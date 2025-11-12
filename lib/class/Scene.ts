import { SceneRepository } from "../database/graphql/repositories/SceneRepository";
import { AmbientLight, AmbientLightType } from "./AmbientLight";
import { Camera, CameraType } from "./Camera";
import { Light, LightType } from "./Light";
import { Material, MaterialType } from "./Material";
import { ModelClass } from "./ModelClass";
import { SceneObject, SceneObjectType } from "./SceneObject";

/**
 * Represents a scene containing objects, camera, lights, and ambient light settings.
 *
 * @property {SceneObjectType[]} objects - Array of objects present in the scene.
 * @property {CameraType} camera - Camera configuration for the scene.
 * @property {LightType[]} lights - Array of lights illuminating the scene.
 * @property {AmbientLightType} ambientLight - Ambient light for the scene.
 * @property {Date} updatedAt - The date and time when the scene was last updated.
 * @property {Date} createdAt - The date and time when the scene was created.
 */
export type SceneType = {
    objects: SceneObjectType[];
    camera: CameraType;
    lights: LightType[];
    ambientLight: AmbientLightType;
    materials: MaterialType[];
    updatedAt: Date;
    createdAt: Date;
};

type CollectionType = {
    id: string;
    save: () => Promise<void>;
    countDirtyFields: () => number;
    clearDirtyFields: () => void;
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
    private _objects: SceneObject[];
    private _camera: Camera;
    private _lights: Light[];
    private _ambientLight: AmbientLight;
    private _materials: Material[];
    private _updatedAt: Date;
    private _createdAt: Date;

    private repository = new SceneRepository();

    /**
     * Initializes a new instance of the Scene class.
     *
     * @param scene - The scene data used to construct the Scene instance.
     *   - `objects`: An array of objects to be included in the scene.
     *   - `camera`: The camera configuration for the scene.
     *   - `lights`: An array of lights to be added to the scene.
     *   - `ambientLight`: The ambient light color for the scene.
     *   - `updatedAt`: The timestamp of the last update to the scene.
     *   - `createdAt`: The timestamp of when the scene was created.
     *
     * Sets up the scene by creating SceneObject instances for each object,
     * initializing the camera and lights, and setting the ambient light color.
     */
    constructor(scene: SceneType) {
        super();
        this._objects = scene.objects.map((obj) => new SceneObject(obj));
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
     * Gets the collection of objects contained within the scene.
     *
     * @returns The array or collection of objects managed by this scene.
     */
    get objects(): Scene["_objects"] {
        return this._objects;
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
     * Sets the objects in the scene.
     * Replaces the current objects with a shallow copy of the provided array.
     *
     * @param value - An array of objects to set for the scene.
     */
    set objects(value: Scene["objects"]) {
        this._objects = [...value];
        this.markFieldDirty("objects");
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
     * Adds an object to the scene.
     *
     * If the provided object is already an instance of `SceneObject`, it is directly added to the scene's objects.
     * Otherwise, a new `SceneObject` is created from the provided object and then added.
     *
     * @param obj - The object to add, which can be either an existing `SceneObject` or a plain object compatible with `SceneType["objects"][number]`.
     */
    addObject(obj: Scene["_objects"][number]): void {
        this.objects.push(obj);
        this.markFieldDirty("objects");
    }

    /**
     * Removes an object from the scene by its unique identifier.
     *
     * @param objId - The unique identifier of the object to remove.
     */
    removeObject(objId: SceneType["objects"][number]["name"]): void {
        const initialLength = this.objects.length;
        this.objects = this.objects.filter((obj) => obj.name !== objId);
        if (this.objects.length === initialLength) {
            throw new Error(
                `Object with name "${objId}" not found in the scene.`
            );
        }
        this.markFieldDirty("objects");
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
     * Retrieves an object from the scene by its unique identifier.
     *
     * @param name - The unique identifier of the object to retrieve.
     * @returns The object with the specified name if found; otherwise, `undefined`.
     */
    getObjectById(
        name: SceneType["objects"][number]["name"]
    ): Scene["objects"][number] | undefined {
        return this.objects.find((obj) => obj.name === name);
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
     * - All scene objects, each serialized via their own `serialize` method.
     * - The camera, serialized via its `serialize` method.
     * - All lights in the scene, each serialized via their own `serialize` method.
     * - The ambient light, serialized via its `serialize` method.
     *
     * @returns {SceneType} The serialized representation of the scene.
     */
    serialize(): SceneType {
        return {
            objects: this.objects.map((obj) => obj.serialize()),
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
        createItem: (item: T) => Promise<void>,
        removeItem: (id: string) => Promise<void>
    ) {
        const ids = currentItems.map((i) => i.id);
        const existingItems = await getExisting();
        const existingIds = existingItems.map((i) => i.id);

        const toCreate = currentItems.filter(
            (i) => !existingIds.includes(i.id)
        );
        const toRemove = existingIds.filter((id) => !ids.includes(id));

        await Promise.all(toCreate.map(createItem));
        await Promise.all(toRemove.map(removeItem));

        // Update the remaining items
        await Promise.all(
            currentItems
                .filter((i) => i.countDirtyFields() > 0)
                .map((i) => i.save())
        );
    }

    /**
     * Saves the current Scene instance asynchronously.
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) return;

        this._updatedAt = new Date();
        // Graphql update date here

        if (this.dirtyFields.has("objects")) {
            await this.syncCollection(
                this._objects,
                async () => {
                    const objects = await this.repository.getSceneObjects();
                    return objects;
                },
                async (obj) => {
                    await this.repository.createSceneObject(obj);
                },
                async (id) => {
                    await this.repository.removeSceneObject(id);
                }
            );
        }

        if (this.dirtyFields.has("lights")) {
            await this.syncCollection(
                this._lights,
                async () => {
                    const lights = await this.repository.getLights();
                    return lights;
                },
                async (light) => {
                    await this.repository.createLight(light);
                },
                async (id) => {
                    await this.repository.removeLight(id);
                }
            );
        }

        if (this.dirtyFields.has("materials")) {
            await this.syncCollection(
                this._materials,
                async () => {
                    const materials = await this.repository.getMaterials();
                    return materials;
                },
                async (material) => {
                    await this.repository.createMaterial(material);
                },
                async (id) => {
                    await this.repository.removeMaterial(id);
                }
            );
        }

        if (this.dirtyFields.has("camera")) {
            await this._camera.save();
            this._camera.clearDirtyFields();
        }

        if (this.dirtyFields.has("ambientLight")) {
            await this._ambientLight.save();
            this._ambientLight.clearDirtyFields();
        }

        this.clearDirtyFields();
    }
}
