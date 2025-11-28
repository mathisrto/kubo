import { CAMERA_TYPES } from "../constants";
import { CameraRepository } from "../database/graphql/repositories/CameraRepository";
import { ModelClass } from "./ModelClass";
import { Vector3, Vector3Type } from "./Vector3";

/**
 * Represents the properties of a camera in the application.
 *
 * @property position - The position of the camera in 3D space.
 * @property rotation - The rotation of the camera in 3D space.
 * @property target - The point the camera is looking at (for OrbitControls).
 * @property fov - Field of view of the camera, in degrees.
 * @property near - The near clipping plane distance.
 * @property far - The far clipping plane distance.
 * @property type - The type of camera, defined by CAMERA_TYPES.
 */
export type CameraType = {
    position: Vector3Type;
    rotation: Vector3Type;
    target: Vector3Type;
    fov: number;
    near: number;
    far: number;
    type: CAMERA_TYPES;
};

/**
 * Represents a camera in 3D space with position, rotation, field of view, and other properties.
 * Provides methods to manipulate the camera's transformation and serialize its state.
 *
 * @remarks
 * The camera uses {@link Vector3} for position and rotation. All properties are encapsulated with getters and setters.
 *
 * @property _position - The position of the camera in 3D space.
 * @property _rotation - The rotation of the camera in 3D space.
 * @property _fov - Field of view of the camera.
 * @property _near - Near clipping plane distance.
 * @property _far - Far clipping plane distance.
 * @property _type - Type of the camera.
 *
 * @method translate - Translates the camera by the given x, y, z values.
 * @method rotate - Rotates the camera by the given x, y, z values.
 * @method lookAt - Rotates the camera to look at a target position.
 * @method serialize - Serializes the camera state to a {@link CameraType} object.
 *
 * @param camera - The initial camera properties conforming to {@link CameraType}.
 */
export class Camera extends ModelClass {
    private _position: Vector3;
    private _rotation: Vector3;
    private _target: Vector3;
    private _fov: CameraType["fov"];
    private _near: CameraType["near"];
    private _far: CameraType["far"];
    private _type: CameraType["type"];

    private repository = new CameraRepository();

    /**
     * Creates a new Camera instance by copying properties from the provided camera object.
     *
     * @param camera - The source camera object containing initial values for position, rotation, fov, near, far, and type.
     */
    constructor(camera: CameraType) {
        super();
        this._position = new Vector3(camera.position);
        this._rotation = new Vector3(camera.rotation);
        this._target = new Vector3(camera.target || { x: 0, y: 0, z: 0 });
        this._fov = camera.fov;
        this._near = camera.near;
        this._far = camera.far;
        this._type = camera.type;
    }

    /* ========== Realtime Sync depuis la BDD ========== */

    /* Getters */

    /**
     * Gets the current position of the camera.
     *
     * @returns The camera's position as defined by the `_position` property.
     */
    get position(): Camera["_position"] {
        return this._position;
    }

    /**
     * Gets the current rotation value of the camera.
     *
     * @returns The camera's rotation, represented by the `_rotation` property.
     */
    get rotation(): Camera["_rotation"] {
        return this._rotation;
    }

    /**
     * Gets the current target (look-at point) of the camera.
     *
     * @returns The camera's target, represented by the `_target` property.
     */
    get target(): Camera["_target"] {
        return this._target;
    }

    /**
     * Gets the field of view (FOV) value for the camera.
     *
     * @returns The current field of view, as defined by the `CameraType` interface.
     */
    get fov(): CameraType["fov"] {
        return this._fov;
    }

    /**
     * Gets the near clipping plane distance of the camera.
     * This value determines how close objects can be to the camera before they are clipped.
     * @returns The near clipping plane distance as defined in the CameraType.
     */
    get near(): CameraType["near"] {
        return this._near;
    }

    /**
     * Gets the far clipping plane distance of the camera.
     * This value determines how far from the camera objects will be rendered.
     * @returns The distance to the far clipping plane.
     */
    get far(): CameraType["far"] {
        return this._far;
    }

    /**
     * Gets the type of the camera.
     *
     * @returns The camera type as defined by the `CameraType["type"]`.
     */
    get type(): CameraType["type"] {
        return this._type;
    }

    /* Setters */

    /**
     * Sets the camera's position.
     * Accepts a value matching the `position` property type from `CameraType`.
     * Internally, the position is converted to a `Vector3` instance.
     *
     * @param position - The new position for the camera.
     */
    set position(position: CameraType["position"]) {
        this._position = new Vector3(position);
        this.markFieldDirty("position");
    }

    /**
     * Sets the camera's rotation.
     * Accepts a value of type `CameraType["rotation"]` and assigns it to the internal `_rotation` property
     * as a new `Vector3` instance.
     *
     * @param rotation - The rotation value to set for the camera.
     */
    set rotation(rotation: CameraType["rotation"]) {
        this._rotation = new Vector3(rotation);
        this.markFieldDirty("rotation");
    }

    /**
     * Sets the camera's target (look-at point).
     *
     * @param target - The target value to set for the camera.
     */
    set target(target: CameraType["target"]) {
        this._target = new Vector3(target);
        this.markFieldDirty("target");
    }

    /**
     * Sets the field of view (FOV) for the camera.
     * @param fov - The field of view value to assign, as defined by the `CameraType` interface.
     */
    set fov(fov: CameraType["fov"]) {
        this._fov = fov;
        this.markFieldDirty("fov");
    }

    /**
     * Sets the near clipping plane distance for the camera.
     * @param near - The distance to the near clipping plane.
     */
    set near(near: CameraType["near"]) {
        this._near = near;
        this.markFieldDirty("near");
    }

    /**
     * Sets the far clipping plane distance for the camera.
     * @param far - The distance to the far clipping plane, as defined in CameraType["far"].
     */
    set far(far: CameraType["far"]) {
        this._far = far;
        this.markFieldDirty("far");
    }

    /**
     * Sets the camera type.
     * @param type - The type of the camera, as defined by the `CameraType["type"]` type.
     */
    set type(type: CameraType["type"]) {
        this._type = type;
        this.markFieldDirty("type");
    }

    /* Methods */

    /**
     * Translates the camera's position by the specified amounts along the x, y, and z axes.
     *
     * @param x - The amount to translate along the x-axis.
     * @param y - The amount to translate along the y-axis.
     * @param z - The amount to translate along the z-axis.
     */
    public translate(
        x: CameraType["position"]["x"],
        y: CameraType["position"]["y"],
        z: CameraType["position"]["z"]
    ): void {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;

        this.markFieldDirty("position");
    }

    /**
     * Rotates the camera by the specified amounts along the x, y, and z axes.
     *
     * @param x - The amount to rotate around the x-axis.
     * @param y - The amount to rotate around the y-axis.
     * @param z - The amount to rotate around the z-axis.
     */
    public rotate(
        x: CameraType["rotation"]["x"],
        y: CameraType["rotation"]["y"],
        z: CameraType["rotation"]["z"]
    ): void {
        this.rotation.x += x;
        this.rotation.y += y;
        this.rotation.z += z;

        this.markFieldDirty("rotation");
    }

    /**
     * Orients the camera to look at a specified target position.
     *
     * Calculates the direction vector from the camera's current position to the target,
     * normalizes it, and updates the camera's rotation accordingly.
     *
     * @param target - The target position to look at, represented as a `Vector3`.
     */
    public lookAt(target: Vector3): void {
        const direction = target.subtract(this.position).normalize();
        this.rotation = new Vector3({
            x: Math.asin(direction.y),
            y: Math.atan2(-direction.x, -direction.z),
            z: 0,
        });

        this.markFieldDirty("rotation");
    }

    /**
     * Serializes the current camera instance into a plain object of type `CameraType`.
     *
     * @returns {CameraType} An object containing the camera's position, rotation, field of view (fov), near and far clipping planes, and type.
     */
    public serialize(): CameraType {
        return {
            position: this.position.serialize(),
            rotation: this.rotation.serialize(),
            target: this.target.serialize(),
            fov: this.fov,
            near: this.near,
            far: this.far,
            type: this.type,
        };
    }

    /**
     * Saves the current camera instance asynchronously.
     *
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        const dirtyCount = this.countDirtyFields();
        if (dirtyCount === 0) return;

        console.log(
            `[Camera Save] Saving ${dirtyCount} dirty fields:`,
            Array.from(this.dirtyFields)
        );

        const promises = [];

        if (this.dirtyFields.has("position")) {
            promises.push(
                this.repository.updateCameraPosition(this.position.serialize())
            );
        }
        if (this.dirtyFields.has("rotation")) {
            promises.push(
                this.repository.updateCameraRotation(this.rotation.serialize())
            );
        }
        if (this.dirtyFields.has("target")) {
            promises.push(
                this.repository.updateCameraTarget(this.target.serialize())
            );
        }
        if (this.dirtyFields.has("fov")) {
            promises.push(this.repository.updateCameraFOV(this.fov));
        }
        if (this.dirtyFields.has("near")) {
            promises.push(this.repository.updateCameraNear(this.near));
        }
        if (this.dirtyFields.has("far")) {
            promises.push(this.repository.updateCameraFar(this.far));
        }
        if (this.dirtyFields.has("type")) {
            promises.push(this.repository.updateCameraType(this.type));
        }

        await Promise.all(promises);
        this.clearDirtyFields();
        console.log("[Camera Save] Save completed");
    }
}
