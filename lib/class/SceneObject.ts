import { SceneObjectRepository } from "../database/graphql/repositories/SceneObjectRepository";
import { ModelClass } from "./ModelClass";
import { Vector3, Vector3Type } from "./Vector3";

/**
 * Represents a 3D object within a scene, including its geometry, transformation, and material properties.
 *
 * @property name - Human-readable name of the object.
 * @property vertices - Array of 3D vertices defining the object's shape.
 * @property indices - Array of indices specifying how vertices are connected to form faces.
 * @property position - The object's position in 3D space.
 * @property rotation - The object's rotation in 3D space.
 * @property scale - The object's scale in 3D space.
 * @property materialId - ID of the material applied to the object.
 */
export type SceneObjectType = {
    id: string;
    name: string;
    vertices: Vector3Type[];
    indices: number[];
    position: Vector3Type;
    rotation: Vector3Type;
    scale: Vector3Type;
    materialId: string;
};

/**
 * Represents a 3D object within a scene, encapsulating its geometry, transformation, and material properties.
 *
 * @remarks
 * The `SceneObject` class provides an abstraction for objects in a 3D scene, including their vertices, indices,
 * position, rotation, scale, and materialId. It supports transformation operations such as translation, rotation,
 * and scaling, as well as serialization and cloning.
 *
 * @example
 * ```typescript
 * const obj = new SceneObject({
 *   name: 'Cube',
 *   vertices: [...],
 *   indices: [...],
 *   position: { x: 0, y: 0, z: 0 },
 *   rotation: { x: 0, y: 0, z: 0 },
 *   scale: { x: 1, y: 1, z: 1 },
 *   materialId: 'material_1'
 * });
 * obj.translate(1, 0, 0);
 * ```
 */
export class SceneObject extends ModelClass {
    private _id: SceneObjectType["id"] = undefined as unknown as string;
    private _name: SceneObjectType["name"];
    private _vertices: Vector3[];
    private _indices: SceneObjectType["indices"];
    private _positionVector: Vector3;
    private _rotationVector: Vector3;
    private _scaleVector: Vector3;
    private _materialId: string;

    private repository = new SceneObjectRepository();

    /**
     * Creates a new SceneObject instance by initializing its properties from the provided object.
     *
     * @param object - The source object containing initial values for the SceneObject.
     *   - `name`: Name of the scene object.
     *   - `vertices`: Array of vertex positions to be converted into Vector3 instances.
     *   - `indices`: Array of indices defining the geometry.
     *   - `position`: Position vector of the object.
     *   - `rotation`: Rotation vector of the object.
     *   - `scale`: Scale vector of the object.
     *   - `material`: Material properties for the object.
     */
    constructor(object: SceneObjectType) {
        super();
        this._name = object.name;
        this._vertices = object.vertices.map((v) => new Vector3(v));
        this._indices = [...object.indices];
        this._positionVector = new Vector3(object.position);
        this._rotationVector = new Vector3(object.rotation);
        this._scaleVector = new Vector3(object.scale);
        this._materialId = object.materialId;
    }

    /* Getters */

    get id(): SceneObjectType["id"] {
        return this._id;
    }

    /**
     * Gets the name of the scene object.
     *
     * @returns The name property as defined in the SceneObjectType.
     */
    get name(): SceneObjectType["name"] {
        return this._name;
    }

    /**
     * Gets the vertices associated with this scene object.
     *
     * @returns The array of vertices as defined by the `SceneObjectType["vertices"]` type.
     */
    get vertices(): SceneObject["_vertices"] {
        return this._vertices;
    }

    /**
     * Gets the indices associated with this scene object.
     *
     * @returns The indices as defined by the `SceneObjectType["indices"]` type.
     */
    get indices(): SceneObjectType["indices"] {
        return this._indices;
    }

    /**
     * Gets the position vector of the scene object.
     *
     * @returns The current position vector represented by the `_positionVector` property.
     */
    get positionVector(): SceneObject["_positionVector"] {
        return this._positionVector;
    }

    /**
     * Gets the current rotation vector of the scene object.
     *
     * The rotation vector typically represents the orientation of the object in 3D space,
     * often as Euler angles or a direction vector. This property is read-only and reflects
     * the internal `_rotationVector` value.
     *
     * @returns The rotation vector of the scene object.
     */
    get rotationVector(): SceneObject["_rotationVector"] {
        return this._rotationVector;
    }

    /**
     * Gets the current scale vector of the scene object.
     *
     * @returns The scale vector representing the object's scaling in each dimension.
     */
    get scaleVector(): SceneObject["_scaleVector"] {
        return this._scaleVector;
    }

    /**
     * Gets the material associated with this scene object.
     *
     * @returns The current material of the scene object.
     */
    get materialId(): SceneObject["_materialId"] {
        return this._materialId;
    }

    /* Setters */

    set id(value: SceneObjectType["id"]) {
        if (this._id)
            throw new Error("ID is already set and cannot be modified.");
        this._id = value;
    }

    /**
     * Sets the name of the scene object.
     * @param value - The new name to assign, as defined by `SceneObjectType["name"]`.
     */
    set name(value: SceneObjectType["name"]) {
        this._name = value;
        this.markFieldDirty("name");
    }

    /**
     * Sets the position vector of the scene object.
     *
     * @param value - The new position vector to assign.
     */
    set positionVector(value: SceneObject["_positionVector"]) {
        this._positionVector = value;
        this.markFieldDirty("position");
    }

    /**
     * Sets the rotation vector for the scene object.
     *
     * @param value - The new rotation vector to apply.
     */
    set rotationVector(value: SceneObject["_rotationVector"]) {
        this._rotationVector = value;
        this.markFieldDirty("rotation");
    }

    /**
     * Sets the scale vector for the scene object.
     * This determines how the object is scaled along each axis.
     * @param value - The new scale vector to apply to the object.
     */
    set scaleVector(value: SceneObject["_scaleVector"]) {
        this._scaleVector = value;
        this.markFieldDirty("scale");
    }

    /**
     * Sets the material ID of the scene object.
     * @param value - The new material ID to assign to the scene object.
     */
    set materialId(value: SceneObject["_materialId"]) {
        this._materialId = value;
        this.markFieldDirty("materialId");
    }

    /* Methods */

    /**
     * Translates the scene object by the specified x, y, and z offsets.
     *
     * @param x - The amount to translate along the X axis.
     * @param y - The amount to translate along the Y axis.
     * @param z - The amount to translate along the Z axis.
     */
    translate(
        x: SceneObjectType["position"]["x"],
        y: SceneObjectType["position"]["y"],
        z: SceneObjectType["position"]["z"]
    ): void {
        this.positionVector = this.positionVector.add(new Vector3({ x, y, z }));
        this.markFieldDirty("position");
    }

    /**
     * Rotates the scene object by the specified angles along the x, y, and z axes.
     *
     * @param x - The angle to rotate around the x-axis.
     * @param y - The angle to rotate around the y-axis.
     * @param z - The angle to rotate around the z-axis.
     */
    rotate(
        x: SceneObjectType["rotation"]["x"],
        y: SceneObjectType["rotation"]["y"],
        z: SceneObjectType["rotation"]["z"]
    ): void {
        this.rotationVector = this.rotationVector.add(new Vector3({ x, y, z }));
        this.markFieldDirty("rotation");
    }

    /**
     * Scales the current object by multiplying its scale vector components
     * with the provided x, y, and z factors.
     *
     * @param x - The factor to scale the x component.
     * @param y - The factor to scale the y component.
     * @param z - The factor to scale the z component.
     */
    scale(
        x: SceneObjectType["scale"]["x"],
        y: SceneObjectType["scale"]["y"],
        z: SceneObjectType["scale"]["z"]
    ): void {
        this.scaleVector = new Vector3({
            x: this.scaleVector.x * x,
            y: this.scaleVector.y * y,
            z: this.scaleVector.z * z,
        });
        this.markFieldDirty("scale");
    }

    /**
     * Serializes the current `SceneObject` instance into a plain object of type `SceneObjectType`.
     *
     * @returns {SceneObjectType} An object containing the serialized properties of the scene object,
     * including its name, vertices, indices, position, rotation, scale, and materialId.
     */
    serialize(): SceneObjectType {
        return {
            id: this.id,
            name: this.name,
            vertices: this.vertices.map((v) => v.serialize()),
            indices: this.indices,
            position: this.positionVector.serialize(),
            rotation: this.rotationVector.serialize(),
            scale: this.scaleVector.serialize(),
            materialId: this.materialId,
        };
    }

    /**
     * Creates a deep copy of the current `SceneObject` instance.
     * The clone is initialized using the serialized data of the original object.
     *
     * @returns A new `SceneObject` instance that is a copy of the current object.
     */
    public clone(): SceneObject {
        return new SceneObject(this.serialize());
    }

    /**
     * Saves the current SceneObject instance asynchronously.
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     *
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) return;

        if (this.dirtyFields.has("name")) {
            this.repository.updateSceneObjectName(this.id, this.name);
        }
        if (this.dirtyFields.has("position")) {
            this.repository.updateSceneObjectPosition(
                this.id,
                this.positionVector
            );
        }
        if (this.dirtyFields.has("rotation")) {
            this.repository.updateSceneObjectRotation(
                this.id,
                this.rotationVector
            );
        }
        if (this.dirtyFields.has("scale")) {
            this.repository.updateSceneObjectScale(this.id, this.scaleVector);
        }
        if (this.dirtyFields.has("materialId")) {
            this.repository.updateSceneObjectMaterial(this.id, this.materialId);
        }
    }
}
