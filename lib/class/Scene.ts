import { SceneRepository } from "../database/graphql/repositories/SceneRepository";
import { AmbientLight, AmbientLightType } from "./AmbientLight";
import { Camera, CameraType } from "./Camera";
import { Light, LightType } from "./Light";
import { Material, MaterialType } from "./Material";
import { Model3D, Model3DType } from "./Model3D";
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
    materials: MaterialType[];
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

    private repository = new SceneRepository();
    private _isSaving = false; // Prevent concurrent saves

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
        this._models3d = scene.models3d.map((model) => new Model3D(model));
        this._camera = new Camera(scene.camera);
        this._lights = scene.lights.map((light) => new Light(light));
        this._ambientLight = new AmbientLight(scene.ambientLight);
        this._materials = scene.materials.map(
            (material) => new Material(material)
        );
        this._updatedAt = scene.updatedAt;
        this._createdAt = scene.createdAt;
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
    removeModel(modelId: SceneType["models3d"][number]["id"]): void {
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
    removeLight(lightId: SceneType["lights"][number]["id"]): void {
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

    removeMaterial(materialId: SceneType["materials"][number]["id"]): void {
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
        name: SceneType["models3d"][number]["name"]
    ): Scene["models3d"][number] | undefined {
        return this.models3d.find((model) => model.name === name);
    }

    /**
     * Retrieves a light object from the scene by its unique identifier.
     *
     * @param id - The unique identifier of the light to retrieve.
     * @returns The light object with the specified id if found; otherwise, `undefined`.
     */
    getLightById(
        id: SceneType["lights"][number]["id"]
    ): Scene["lights"][number] | undefined {
        return this.lights.find((light) => light.id === id);
    }

    /**
     * Retrieves a material from the scene by its unique identifier.
     *
     * @param id - The unique identifier of the material to retrieve.
     * @returns The material object with the specified id if found; otherwise, `undefined`.
     */
    getMaterialById(
        id: SceneType["materials"][number]["id"]
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
            // Maintenant traiter les dirty fields de Scene elle-même
            if (this.countDirtyFields() === 0) {
                // Même si Scene n'a pas de dirty fields, sauvegarder les enfants modifiés
                if (this._camera.countDirtyFields() > 0) {
                    await this._camera.save();
                }
                if (this._ambientLight.countDirtyFields() > 0) {
                    await this._ambientLight.save();
                }
                // Sauvegarder les modèles 3D qui ont des dirty fields
                for (const model of this._models3d) {
                    if (model.countDirtyFields() > 0) {
                        await model.save();
                    }
                }
                return;
            }

            this._updatedAt = new Date();
            // Graphql update date here

            if (this.dirtyFields.has("models3d")) {
                await this.syncCollection(
                    this._models3d,
                    async () => {
                        console.log(
                            "[Scene.save] Fetching existing 3D models..."
                        );
                        const models = await this.repository.getModel3Ds();
                        return models;
                    },
                    async (model) => {
                        console.log("[Scene.save] Creating new 3D model...");
                        return await this.repository.createModel3D(
                            model as Model3D
                        );
                    },
                    async (id) => {
                        console.log(
                            "[Scene.save] Removing 3D model with id:",
                            id
                        );
                        await this.repository.removeModel3D(id);
                    }
                );
            }

            if (this.dirtyFields.has("lights")) {
                await this.syncCollection(
                    this._lights,
                    async () => {
                        console.log("[Scene.save] Fetching existing lights...");
                        const lights = await this.repository.getLights();
                        return lights;
                    },
                    async (light) => {
                        console.log("[Scene.save] Creating new light...");
                        return await this.repository.createLight(
                            light as Light
                        );
                    },
                    async (id) => {
                        console.log("[Scene.save] Removing light with id:", id);
                        await this.repository.removeLight(id);
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
                        const materials = await this.repository.getMaterials();
                        return materials;
                    },
                    async (material) => {
                        console.log("[Scene.save] Creating new material...");
                        return await this.repository.createMaterial(
                            material as Material
                        );
                    },
                    async (id) => {
                        console.log(
                            "[Scene.save] Removing material with id:",
                            id
                        );
                        await this.repository.removeMaterial(id);
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
     * NOTE: Les méthodes de création de primitives (createCube, createSphere, etc.)
     * ont été commentées car elles utilisaient SceneObject avec des vertices.
     *
     * Avec Model3D, vous devez maintenant:
     * 1. Uploader un fichier 3D (GLB, GLTF, OBJ, etc.) via /api/models/upload
     * 2. Créer un Model3D dans la scène via la mutation GraphQL createModel3D
     *
     * Pour créer des primitives, vous pouvez:
     * - Utiliser three.js pour générer les géométries côté client
     * - Exporter des modèles de primitives depuis Blender en GLB
     * - Utiliser une bibliothèque de modèles 3D prédéfinis
     */

    /* async createCube() {
        const vertices = new Float32Array([
            -0.5,
            -0.5,
            0.5, // 0
            0.5,
            -0.5,
            0.5, // 1
            0.5,
            0.5,
            0.5, // 2
            -0.5,
            0.5,
            0.5, // 3
            -0.5,
            -0.5,
            -0.5, // 4
            0.5,
            -0.5,
            -0.5, // 5
            0.5,
            0.5,
            -0.5, // 6
            -0.5,
            0.5,
            -0.5, // 7
        ]);

        const indices = [
            0,
            1,
            2,
            0,
            2,
            3, // front
            1,
            5,
            6,
            1,
            6,
            2, // right
            5,
            4,
            7,
            5,
            7,
            6, // back
            4,
            0,
            3,
            4,
            3,
            7, // left
            3,
            2,
            6,
            3,
            6,
            7, // top
            4,
            5,
            1,
            4,
            1,
            0, // bottom
        ];

        const cubeObject = new SceneObject({
            id: `cube-${Date.now()}`,
            name: `Cube-${Date.now()}`,
            vertices: Array.from({ length: vertices.length / 3 }, (_, i) => ({
                x: vertices[i * 3 + 0],
                y: vertices[i * 3 + 1],
                z: vertices[i * 3 + 2],
            })),
            indices: indices,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            materialId: "default",
        });

        this.addObject(cubeObject);
    }

    async createSphere() {
        // Icosphere generation: start with icosahedron, then subdivide
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;

        // Initial icosahedron vertices (12 vertices)
        const initialVertices: number[] = [
            -1,
            t,
            0,
            1,
            t,
            0,
            -1,
            -t,
            0,
            1,
            -t,
            0,
            0,
            -1,
            t,
            0,
            1,
            t,
            0,
            -1,
            -t,
            0,
            1,
            -t,
            t,
            0,
            -1,
            t,
            0,
            1,
            -t,
            0,
            -1,
            -t,
            0,
            1,
        ];

        // Initial icosahedron faces (20 triangles)
        const initialIndices = [
            0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4,
            11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3,
            8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
        ];

        // Normalize vertices to unit sphere
        const normalize = (x: number, y: number, z: number) => {
            const len = Math.sqrt(x * x + y * y + z * z);
            return { x: x / len, y: y / len, z: z / len };
        };

        let vertices = initialVertices
            .map((v, i) => {
                if (i % 3 === 0) {
                    const { x, y, z } = normalize(
                        initialVertices[i],
                        initialVertices[i + 1],
                        initialVertices[i + 2]
                    );
                    return [x, y, z];
                }
                return null;
            })
            .filter((v) => v !== null)
            .flat() as number[];

        let indices = [...initialIndices];

        // Subdivide for smoother sphere (1 subdivision = 80 triangles, 2 = 320)
        const subdivisions = 2;
        for (let s = 0; s < subdivisions; s++) {
            const newIndices: number[] = [];
            const midpointCache = new Map<string, number>();

            const getMidpoint = (i1: number, i2: number): number => {
                const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;
                if (midpointCache.has(key)) {
                    return midpointCache.get(key)!;
                }

                const x1 = vertices[i1 * 3 + 0];
                const y1 = vertices[i1 * 3 + 1];
                const z1 = vertices[i1 * 3 + 2];
                const x2 = vertices[i2 * 3 + 0];
                const y2 = vertices[i2 * 3 + 1];
                const z2 = vertices[i2 * 3 + 2];

                const { x, y, z } = normalize(
                    (x1 + x2) / 2,
                    (y1 + y2) / 2,
                    (z1 + z2) / 2
                );

                const newIndex = vertices.length / 3;
                vertices.push(x, y, z);
                midpointCache.set(key, newIndex);
                return newIndex;
            };

            for (let i = 0; i < indices.length; i += 3) {
                const v1 = indices[i];
                const v2 = indices[i + 1];
                const v3 = indices[i + 2];

                const a = getMidpoint(v1, v2);
                const b = getMidpoint(v2, v3);
                const c = getMidpoint(v3, v1);

                newIndices.push(v1, a, c);
                newIndices.push(v2, b, a);
                newIndices.push(v3, c, b);
                newIndices.push(a, b, c);
            }

            indices = newIndices;
        }

        // Scale to desired radius
        const radius = 0.5;
        vertices = vertices.map((v) => v * radius);

        const sphereObject = new SceneObject({
            id: `sphere-${Date.now()}`,
            name: `Sphere-${Date.now()}`,
            vertices: Array.from({ length: vertices.length / 3 }, (_, i) => ({
                x: vertices[i * 3 + 0],
                y: vertices[i * 3 + 1],
                z: vertices[i * 3 + 2],
            })),
            indices: indices,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            materialId: "default",
        });

        this.addObject(sphereObject);
    }

    async createCylinder() {
        // Cylinder parameters
        const radius = 0.5;
        const height = 1.0;
        const radialSegments = 32;
        const heightSegments = 1;
        const openEnded = false;

        const vertices: number[] = [];
        const indices: number[] = [];

        // Generate vertices
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const posY = v * height - height / 2;

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * Math.PI * 2;

                const posX = radius * Math.cos(theta);
                const posZ = radius * Math.sin(theta);

                vertices.push(posX, posY, posZ);
            }
        }

        // Generate side indices
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = y * (radialSegments + 1) + x;
                const b = a + radialSegments + 1;
                const c = a + radialSegments + 2;
                const d = a + 1;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        if (!openEnded) {
            // Bottom cap center vertex
            const bottomCenterIndex = vertices.length / 3;
            vertices.push(0, -height / 2, 0);

            // Bottom cap vertices
            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * Math.PI * 2;
                vertices.push(
                    radius * Math.cos(theta),
                    -height / 2,
                    radius * Math.sin(theta)
                );
            }

            // Bottom cap indices
            for (let x = 0; x < radialSegments; x++) {
                const a = bottomCenterIndex;
                const b = bottomCenterIndex + 1 + x;
                const c = bottomCenterIndex + 1 + x + 1;
                indices.push(a, c, b);
            }

            // Top cap center vertex
            const topCenterIndex = vertices.length / 3;
            vertices.push(0, height / 2, 0);

            // Top cap vertices
            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * Math.PI * 2;
                vertices.push(
                    radius * Math.cos(theta),
                    height / 2,
                    radius * Math.sin(theta)
                );
            }

            // Top cap indices
            for (let x = 0; x < radialSegments; x++) {
                const a = topCenterIndex;
                const b = topCenterIndex + 1 + x;
                const c = topCenterIndex + 1 + x + 1;
                indices.push(a, b, c);
            }
        }

        const cylinderObject = new SceneObject({
            id: `cylinder-${Date.now()}`,
            name: `Cylinder-${Date.now()}`,
            vertices: Array.from({ length: vertices.length / 3 }, (_, i) => ({
                x: vertices[i * 3 + 0],
                y: vertices[i * 3 + 1],
                z: vertices[i * 3 + 2],
            })),
            indices: indices,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            materialId: "default",
        });

        this.addObject(cylinderObject);
    }

    async createPlane() {
        // Plane parameters
        const width = 1.0;
        const height = 1.0;
        const widthSegments = 1;
        const heightSegments = 1;

        const vertices: number[] = [];
        const indices: number[] = [];

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const gridX = widthSegments + 1;
        const gridY = heightSegments + 1;

        const segmentWidth = width / widthSegments;
        const segmentHeight = height / heightSegments;

        // Generate vertices
        for (let iy = 0; iy < gridY; iy++) {
            const y = iy * segmentHeight - halfHeight;

            for (let ix = 0; ix < gridX; ix++) {
                const x = ix * segmentWidth - halfWidth;

                vertices.push(x, y, 0);
            }
        }

        // Generate indices
        for (let iy = 0; iy < heightSegments; iy++) {
            for (let ix = 0; ix < widthSegments; ix++) {
                const a = ix + gridX * iy;
                const b = ix + gridX * (iy + 1);
                const c = ix + 1 + gridX * (iy + 1);
                const d = ix + 1 + gridX * iy;

                // Two triangles per quad
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        const planeObject = new SceneObject({
            id: `plane-${Date.now()}`,
            name: `Plane-${Date.now()}`,
            vertices: Array.from({ length: vertices.length / 3 }, (_, i) => ({
                x: vertices[i * 3 + 0],
                y: vertices[i * 3 + 1],
                z: vertices[i * 3 + 2],
            })),
            indices: indices,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            materialId: "default",
        });

        this.addModel(planeObject);
    } */
}
