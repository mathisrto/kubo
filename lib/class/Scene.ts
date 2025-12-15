import { AmbientLightRepository } from "../database/graphql/repositories/AmbientLightRepository";
import { CameraRepository } from "../database/graphql/repositories/CameraRepository";
import { LightRepository } from "../database/graphql/repositories/LightRepository";
import { MaterialRepository } from "../database/graphql/repositories/MaterialRepository";
import { Model3DRepository } from "../database/graphql/repositories/Model3DRepository";
import { AmbientLight, AmbientLightType } from "./AmbientLight";
import { Camera, CameraType } from "./Camera";
import { Light, LightType } from "./Light";
import { Material, MaterialType } from "./Material";
import { Model3D, Model3DType, MODEL_FILE_FORMAT } from "./Model3D";
import { ModelClass } from "./ModelClass";

/**
 * Represents a scene containing 3D models, camera, lights, and ambient light settings.
 *
 * @property {Model3DType[]} models3d - Array of 3D models (file-based) in the scene.
 * @property {CameraType} camera - Camera configuration for the scene.
 * @property {LightType[]} lights - Array of lights illuminating the scene.
 * @property {AmbientLightType} ambientLight - Ambient light for the scene.
 * @property {Date} updatedAt - The date and time when the scene was last updated.
 * @property {Date} createdAt - The date and time when the scene was created.
 */
export type SceneType = {
    models3d: Model3DType[];
    camera: CameraType;
    lights: LightType[];
    ambientLight: AmbientLightType;
    materials?: MaterialType[];
    updatedAt: Date;
    createdAt: Date;
};

type CollectionType = {
    id?: string;
    save: () => Promise<void>;
    countDirtyFields: () => number;
    clearDirtyFields: () => void;
    serialize: () => any;
};

/**
 * Represents a 3D scene containing objects, camera, lights, and ambient light.
 *
 * @remarks
 * The `Scene` class encapsulates all elements required to define a renderable scene,
 * including objects, camera, lights, and ambient lighting. It provides methods to
 * manipulate these elements and serialize the scene state.
 *
 * @property _objects - Array of scene objects.
 * @property _camera - The camera used to view the scene.
 * @property _lights - Array of lights in the scene.
 * @property _ambientLight - Ambient light for the scene.
 * @property _materials - Array of materials used in the scene.
 * @property _updatedAt - The date and time when the scene was last updated.
 * @property _createdAt - The date and time when the scene was created.
 *
 * @constructor
 * Creates a new `Scene` instance from a `SceneType` object.
 *
 * @method addObject
 * Adds a new object to the scene.
 *
 * @method removeObject
 * Removes an object from the scene by its name.
 *
 * @method addLight
 * Adds a new light to the scene.
 *
 * @method removeLight
 * Removes a light from the scene by its name.
 *
 * @method getObjectById
 * Retrieves an object from the scene by its name.
 *
 * @method getLightById
 * Retrieves a light from the scene by its name.
 *
 * @method serialize
 * Serializes the scene into a `SceneType` object.
 */
export class Scene extends ModelClass {
    private _models3d: Model3D[];
    private _camera: Camera;
    private _lights: Light[];
    private _ambientLight: AmbientLight;
    private _materials: Material[];
    private _updatedAt: Date;
    private _createdAt: Date;
    private ambientLightRepository = new AmbientLightRepository();
    private cameraRepository = new CameraRepository();
    private lightRepository = new LightRepository();
    private materialRepository = new MaterialRepository();
    private model3DRepository = new Model3DRepository();
    private _isSaving = false; // Prevent concurrent saves
    private _autoSaveEnabled = true;
    private _autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
    private _autoSaveDelay = 100; // Pas de debounce - onChange ne se déclenche qu'après l'arrêt du mouvement

    /**
     * Initializes a new instance of the Scene class.
     *
     * @param scene - The scene data used to construct the Scene instance.
     *   - `models3d`: An array of 3D models to be included in the scene.
     *   - `camera`: The camera configuration for the scene.
     *   - `lights`: An array of lights to be added to the scene.
     *   - `ambientLight`: The ambient light color for the scene.
     *   - `updatedAt`: The timestamp of the last update to the scene.
     *   - `createdAt`: The timestamp of when the scene was created.
     *
     * Sets up the scene by creating Model3D instances for each model,
     * initializing the camera and lights, and setting the ambient light color.
     */
    constructor(scene: SceneType) {
        super();
        this._models3d = (scene.models3d || []).map(
            (model) => new Model3D(model, this.model3DRepository)
        );
        this._camera = new Camera(scene.camera, this.cameraRepository);
        this._lights = (scene.lights || []).map(
            (light) => new Light(light, this.lightRepository)
        );
        this._ambientLight = new AmbientLight(
            scene.ambientLight,
            this.ambientLightRepository
        );
        this._materials = (scene.materials || []).map(
            (material) => new Material(material, this.materialRepository)
        );
        this._updatedAt = scene.updatedAt;
        this._createdAt = scene.createdAt;

        // Enregistrer tous les enfants pour la propagation automatique
        this.registerAllChildren();

        // Écouter les changements sur Scene elle-même pour l'auto-save
        this.onFieldChanged(() => this.scheduleAutoSave());
    }

    /**
     * Enregistre récursivement tous les objets enfants pour qu'ils propagent leurs changements
     */
    private registerAllChildren(): void {
        // Camera et ses sous-objets
        this.registerChild(this._camera);

        // AmbientLight
        this.registerChild(this._ambientLight);

        // Tous les modèles 3D
        this.registerChildren(this._models3d);

        // Toutes les lumières
        this.registerChildren(this._lights);

        // Tous les matériaux
        this.registerChildren(this._materials);
    }

    updateFromState(state: SceneType): void {
        if (state.camera) {
            this._camera.updateFromState(state.camera);
        }

        if (state.ambientLight) {
            this._ambientLight.updateFromState(state.ambientLight);
        }
    }

    /* Getters */

    /**
     * Gets the collection of 3D models contained within the scene.
     *
     * @returns The array of 3D models managed by this scene.
     */
    get models3d(): Scene["_models3d"] {
        return this._models3d;
    }

    /**
     * Gets the current camera associated with the scene.
     *
     * @returns The camera instance used by this scene.
     */
    get camera(): Scene["_camera"] {
        return this._camera;
    }

    /**
     * Gets the collection of lights currently present in the scene.
     *
     * @returns The array or collection representing the scene's lights.
     */
    get lights(): Scene["_lights"] {
        return this._lights;
    }

    /**
     * Gets the ambient light instance associated with the scene.
     *
     * @returns The current ambient light object of the scene.
     */
    get ambientLight(): Scene["_ambientLight"] {
        return this._ambientLight;
    }

    /**
     * Gets the collection of materials associated with this scene.
     *
     * @returns The materials used in the scene.
     */
    get materials(): Scene["_materials"] {
        return this._materials;
    }

    /* Setters */

    /**
     * Sets the 3D models in the scene.
     * Replaces the current models with a shallow copy of the provided array.
     *
     * @param value - An array of 3D models to set for the scene.
     */
    set models3d(value: Scene["models3d"]) {
        this._models3d = [...value];
        this.markFieldDirty("models3d");
        this.registerAllChildren(); // Reconfigurer les relations parent-enfant
    }

    /**
     * Sets the camera for the scene.
     * @param value - The camera instance to assign to the scene.
     */
    set camera(value: Scene["camera"]) {
        this._camera = value;
        this.markFieldDirty("camera");
    }

    /**
     * Sets the lights for the scene.
     * Accepts an array of lights and creates a shallow copy to assign to the internal `_lights` property.
     *
     * @param value - An array of lights to be set for the scene.
     */
    set lights(value: Scene["lights"]) {
        this._lights = [...value];
        this.markFieldDirty("lights");
        this.registerAllChildren(); // Reconfigurer les relations parent-enfant
    }

    /**
     * Sets the ambient light for the scene.
     * @param value - The new ambient light value to be applied to the scene.
     */
    set ambientLight(value: Scene["ambientLight"]) {
        this._ambientLight = value;
        this.markFieldDirty("ambientLight");
    }

    /* Methods */

    /**
     * Adds a 3D model to the scene.
     *
     * If the provided model is already an instance of `Model3D`, it is directly added to the scene's models.
     * Otherwise, a new `Model3D` is created from the provided model and then added.
     *
     * @param model - The 3D model to add, which can be either an existing `Model3D` or a plain object compatible with `Model3DType`.
     */
    addModel(model: Scene["_models3d"][number]): void {
        // Vérifier si un modèle avec le même ID existe déjà (pour éviter les doublons en React Strict Mode)
        const existingIndex = this.models3d.findIndex(
            (existing) => existing.id === model.id
        );
        if (existingIndex !== -1) {
            console.warn(
                `[Scene.addModel] Model with id "${model.id}" already exists, skipping`
            );
            return;
        }

        this.models3d.push(model);
        this.markFieldDirty("models3d");
    }

    /**
     * Removes a 3D model from the scene by its unique identifier.
     *
     * @param modelId - The unique identifier of the model to remove.
     */
    removeModel(modelId: Model3DType["id"]): void {
        const initialLength = this.models3d.length;
        this.models3d = this.models3d.filter((model) => model.id !== modelId);
        if (this.models3d.length === initialLength) {
            throw new Error(
                `Model with id "${modelId}" not found in the scene.`
            );
        }
        this.markFieldDirty("models3d");
    }

    /**
     * Adds a light to the scene.
     *
     * Accepts either an instance of `Light` or a plain light configuration object.
     * If a configuration object is provided, a new `Light` instance is created from it.
     *
     * @param light - The light to add, either as a `Light` instance or a configuration object.
     */
    addLight(light: Scene["_lights"][number]): void {
        this.lights.push(light);
        this.markFieldDirty("lights");
    }

    /**
     * Removes a light from the scene by its unique identifier.
     *
     * @param lightId - The unique identifier of the light to be removed.
     */
    removeLight(lightId: LightType["id"]): void {
        const initialLength = this.lights.length;
        this.lights = this.lights.filter((light) => light.id !== lightId);
        if (this.lights.length === initialLength) {
            throw new Error(
                `Light with id "${lightId}" not found in the scene.`
            );
        }
        this.markFieldDirty("lights");
    }

    addMaterial(material: Scene["_materials"][number]): void {
        this._materials.push(material);
        this.markFieldDirty("materials");
    }

    removeMaterial(materialId: MaterialType["id"]): void {
        const initialLength = this._materials.length;
        this._materials = this._materials.filter(
            (material) => material.id !== materialId
        );
        if (this._materials.length === initialLength) {
            throw new Error(
                `Material with id "${materialId}" not found in the scene.`
            );
        }
        this.markFieldDirty("materials");
    }

    /**
     * Retrieves a 3D model from the scene by its unique identifier.
     *
     * @param name - The unique identifier of the model to retrieve.
     * @returns The model with the specified name if found; otherwise, `undefined`.
     */
    getModelById(
        name: Model3DType["name"]
    ): Scene["models3d"][number] | undefined {
        return this.models3d.find((model) => model.name === name);
    }

    /**
     * Retrieves a light object from the scene by its unique identifier.
     *
     * @param id - The unique identifier of the light to retrieve.
     * @returns The light object with the specified id if found; otherwise, `undefined`.
     */
    getLightById(id: LightType["id"]): Scene["lights"][number] | undefined {
        return this.lights.find((light) => light.id === id);
    }

    /**
     * Retrieves a material from the scene by its unique identifier.
     *
     * @param id - The unique identifier of the material to retrieve.
     * @returns The material object with the specified id if found; otherwise, `undefined`.
     */
    getMaterialById(
        id: MaterialType["id"]
    ): Scene["_materials"][number] | undefined {
        return this.materials.find((material) => material.id === id);
    }

    /**
     * Serializes the current scene into a `SceneType` object.
     *
     * The serialized object includes:
     * - All 3D models, each serialized via their own `serialize` method.
     * - The camera, serialized via its `serialize` method.
     * - All lights in the scene, each serialized via their own `serialize` method.
     * - The ambient light, serialized via its `serialize` method.
     *
     * @returns {SceneType} The serialized representation of the scene.
     */
    serialize(): SceneType {
        return {
            models3d: this.models3d.map((model) => model.serialize()),
            camera: this.camera.serialize(),
            lights: this.lights.map((light) => light.serialize()),
            ambientLight: this.ambientLight.serialize(),
            materials: this._materials.map((material) => material.serialize()),
            updatedAt: this._updatedAt,
            createdAt: this._createdAt,
        };
    }

    private async syncCollection<T extends CollectionType>(
        currentItems: T[],
        getExisting: () => Promise<T[]>,
        createItem: (item: T) => Promise<string>,
        removeItem: (id: string) => Promise<void>
    ) {
        const existingItems = await getExisting();
        const existingIds = existingItems
            .map((i) => i.id)
            .filter(Boolean) as string[];

        console.log(
            "[syncCollection] Current items:",
            currentItems.length,
            "ids:",
            currentItems.map((i) => i.id)
        );
        console.log(
            "[syncCollection] Existing on server:",
            existingIds.length,
            "ids:",
            existingIds
        );

        // Items without ID are new and need to be created
        const toCreate = currentItems.filter((i) => !i.id);

        // Items with ID that don't exist on server should also be created
        const toCreateWithTempId = currentItems.filter(
            (i) => i.id && !existingIds.includes(i.id)
        );

        console.log("[syncCollection] To create (no ID):", toCreate.length);
        console.log(
            "[syncCollection] To create (temp ID):",
            toCreateWithTempId.length,
            "ids:",
            toCreateWithTempId.map((i) => i.id)
        );

        // Items that exist on server but not locally should be removed
        const currentIds = currentItems
            .map((i) => i.id)
            .filter(Boolean) as string[];
        const toRemove = existingIds.filter((id) => !currentIds.includes(id));

        console.log(
            "[syncCollection] To remove:",
            toRemove.length,
            "ids:",
            toRemove
        );

        // Create new items and update their IDs
        for (const item of [...toCreate, ...toCreateWithTempId]) {
            const oldId = item.id;
            const newId = await createItem(item);
            console.log(`[syncCollection] Created item: ${oldId} -> ${newId}`);
            // Update the item's ID with the server-generated one (access private field directly)
            (item as any)._id = newId;
            // Clear dirty fields after creation to avoid re-creating on next save
            if (typeof item.clearDirtyFields === "function") {
                item.clearDirtyFields();
            }
        }

        await Promise.all(toRemove.map(removeItem));

        // Update the remaining items that have changes
        await Promise.all(
            currentItems
                .filter((i) => i.id && i.countDirtyFields() > 0)
                .map((i) => i.save())
        );
    }

    /**
     * Saves the current Scene instance asynchronously.
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        // Prevent concurrent saves (race condition)
        if (this._isSaving) {
            console.log("[Scene.save] Already saving, skipping...");
            return;
        }

        this._isSaving = true;
        try {
            console.log(
                "[Scene.save] Starting save, dirty fields:",
                Array.from(this.dirtyFields)
            );

            // Sauvegarder la caméra si elle a changé
            if (this._camera.countDirtyFields() > 0) {
                console.log("[Scene.save] Saving camera...");
                await this._camera.save();
            }

            // Sauvegarder l'ambient light si elle a changé
            if (this._ambientLight.countDirtyFields() > 0) {
                console.log("[Scene.save] Saving ambient light...");
                await this._ambientLight.save();
            }

            // Sauvegarder les modèles 3D qui ont des dirty fields
            for (const model of this._models3d) {
                if (model.countDirtyFields() > 0) {
                    console.log("[Scene.save] Saving model:", model.id);
                    await model.save();
                }
            }

            // Sauvegarder les lumières qui ont des dirty fields
            for (const light of this._lights) {
                if (light.countDirtyFields() > 0) {
                    console.log("[Scene.save] Saving light:", light.id);
                    await light.save();
                }
            }

            // Sauvegarder les matériaux qui ont des dirty fields
            for (const material of this._materials) {
                if (material.countDirtyFields() > 0) {
                    console.log("[Scene.save] Saving material:", material.id);
                    await material.save();
                }
            }

            // Si la structure de Scene a changé (ajout/suppression d'objets)
            this._updatedAt = new Date();

            if (this.dirtyFields.has("models3d")) {
                await this.syncCollection(
                    this._models3d,
                    async () => {
                        console.log(
                            "[Scene.save] Fetching existing 3D models..."
                        );
                        const models = (
                            await this.model3DRepository.getModel3Ds()
                        ).map((m) => {
                            return new Model3D(m, this.model3DRepository);
                        });
                        return models;
                    },
                    async (model) => {
                        console.log("[Scene.save] Creating new 3D model...");
                        return await this.model3DRepository.createModel3D(
                            model.serialize()
                        );
                    },
                    async (id) => {
                        console.log(
                            "[Scene.save] Removing 3D model with id:",
                            id
                        );
                        await this.model3DRepository.removeModel3D(id);
                    }
                );
            }

            if (this.dirtyFields.has("lights")) {
                await this.syncCollection(
                    this._lights,
                    async () => {
                        console.log("[Scene.save] Fetching existing lights...");
                        const lights = (
                            await this.lightRepository.getLights()
                        ).map((l) => {
                            return new Light(l, this.lightRepository);
                        });
                        return lights;
                    },
                    async (light) => {
                        console.log("[Scene.save] Creating new light...");
                        return await this.lightRepository.createLight(
                            light.serialize()
                        );
                    },
                    async (id) => {
                        console.log("[Scene.save] Removing light with id:", id);
                        await this.lightRepository.removeLight(id);
                    }
                );
            }

            if (this.dirtyFields.has("materials")) {
                await this.syncCollection(
                    this._materials,
                    async () => {
                        console.log(
                            "[Scene.save] Fetching existing materials..."
                        );
                        const materials = (
                            await this.materialRepository.getMaterials()
                        ).map((m) => {
                            return new Material(m, this.materialRepository);
                        });
                        return materials;
                    },
                    async (material) => {
                        console.log("[Scene.save] Creating new material...");
                        return await this.materialRepository.createMaterial(
                            material.serialize()
                        );
                    },
                    async (id) => {
                        console.log(
                            "[Scene.save] Removing material with id:",
                            id
                        );
                        await this.materialRepository.removeMaterial(id);
                    }
                );
            }

            // camera et ambientLight sont déjà sauvegardés au début
            // (voir début de la méthode save())

            this.clearDirtyFields();
        } finally {
            this._isSaving = false;
        }
    }

    /**
     * Active la sauvegarde automatique (activée par défaut)
     */
    enableAutoSave(): void {
        this._autoSaveEnabled = true;
    }

    /**
     * Désactive la sauvegarde automatique
     */
    disableAutoSave(): void {
        this._autoSaveEnabled = false;
        if (this._autoSaveTimer) {
            clearTimeout(this._autoSaveTimer);
            this._autoSaveTimer = null;
        }
    }

    /**
     * Configure le délai de debounce pour l'auto-save (en ms)
     */
    setAutoSaveDelay(delayMs: number): void {
        this._autoSaveDelay = delayMs;
    }

    /**
     * Programme une sauvegarde automatique avec debounce
     */
    private scheduleAutoSave(): void {
        if (!this._autoSaveEnabled) return;

        // Annuler le timer précédent
        if (this._autoSaveTimer) {
            clearTimeout(this._autoSaveTimer);
        }

        // Programmer une nouvelle sauvegarde
        this._autoSaveTimer = setTimeout(async () => {
            console.log("[Scene.autoSave] Saving scene automatically...");
            await this.save();
        }, this._autoSaveDelay);
    }

    /**
     * Nettoie les ressources (appeler avant de détruire la scène)
     */
    destroy(): void {
        this.disableAutoSave();
    }

    /**
     * Crée un cube procédural dans la scène.
     * Le modèle est généré côté client et stocké temporairement.
     */
    async createCube(): Promise<void> {
        const model = new Model3D(
            {
                id: `cube-${Date.now()}`,
                name: `Cube-${Date.now()}`,
                fileId: "procedural-cube", // Marqueur pour géométrie procédurale
                format: MODEL_FILE_FORMAT.GLB,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                metadata: {
                    procedural: true,
                    geometry: "cube",
                },
            },
            this.model3DRepository
        );
        this.addModel(model);
    }

    /**
     * Crée une sphère procédurale dans la scène.
     */
    async createSphere(): Promise<void> {
        const model = new Model3D(
            {
                id: `sphere-${Date.now()}`,
                name: `Sphere-${Date.now()}`,
                fileId: "procedural-sphere",
                format: MODEL_FILE_FORMAT.GLB,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                metadata: {
                    procedural: true,
                    geometry: "sphere",
                },
            },
            this.model3DRepository
        );
        this.addModel(model);
    }

    /**
     * Crée un cylindre procédural dans la scène.
     */
    async createCylinder(): Promise<void> {
        const model = new Model3D(
            {
                id: `cylinder-${Date.now()}`,
                name: `Cylinder-${Date.now()}`,
                fileId: "procedural-cylinder",
                format: MODEL_FILE_FORMAT.GLB,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                metadata: {
                    procedural: true,
                    geometry: "cylinder",
                },
            },
            this.model3DRepository
        );
        this.addModel(model);
    }

    /**
     * Crée un plan procédural dans la scène.
     */
    async createPlane(): Promise<void> {
        const model = new Model3D(
            {
                id: `plane-${Date.now()}`,
                name: `Plane-${Date.now()}`,
                fileId: "procedural-plane",
                format: MODEL_FILE_FORMAT.GLB,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                metadata: {
                    procedural: true,
                    geometry: "plane",
                },
            },
            this.model3DRepository
        );
        this.addModel(model);
    }
}
