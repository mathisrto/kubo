import { ModelClass } from "./ModelClass";
import { Vector3, Vector3Type } from "./Vector3";

/**
 * Types of 3D model file formats supported
 */
export enum MODEL_FILE_FORMAT {
    GLTF = "gltf", // glTF 2.0 (JSON + bin)
    GLB = "glb", // glTF Binary
    OBJ = "obj", // Wavefront OBJ
    FBX = "fbx", // Autodesk FBX
    STL = "stl", // STereoLithography
    PLY = "ply", // Polygon File Format
}

/**
 * Represents a 3D model stored in GridFS
 *
 * @property id - Unique identifier
 * @property name - Human-readable name
 * @property fileId - GridFS file ID (reference to the 3D model file)
 * @property format - File format (gltf, glb, obj, etc.)
 * @property position - Position in 3D space
 * @property rotation - Rotation in 3D space (Euler angles in radians)
 * @property scale - Scale factors for each axis
 * @property materialId - Optional material override ID
 * @property metadata - Additional metadata (file size, bounding box, etc.)
 */
export type Model3DType = {
    id?: string;
    name: string;
    fileId: string; // GridFS file ID
    format: MODEL_FILE_FORMAT;
    position: Vector3Type;
    rotation: Vector3Type;
    scale: Vector3Type;
    materialId?: string;
    metadata?: {
        fileSize?: number;
        fileName?: string;
        uploadedAt?: Date;
        boundingBox?: {
            min: Vector3Type;
            max: Vector3Type;
        };
        [key: string]: any;
    };
    createdAt?: Date;
    updatedAt?: Date;
};

/**
 * Represents a 3D model in the scene that references a file stored in GridFS
 *
 * @example
 * ```typescript
 * const model = new Model3D({
 *   name: "Character",
 *   fileId: "507f1f77bcf86cd799439011", // GridFS file ID
 *   format: MODEL_FILE_FORMAT.GLB,
 *   position: { x: 0, y: 0, z: 0 },
 *   rotation: { x: 0, y: 0, z: 0 },
 *   scale: { x: 1, y: 1, z: 1 }
 * });
 * ```
 */
export class Model3D extends ModelClass {
    private _id?: string;
    private _name: string;
    private _fileId: string;
    private _format: MODEL_FILE_FORMAT;
    private _positionVector: Vector3;
    private _rotationVector: Vector3;
    private _scaleVector: Vector3;
    private _materialId?: string;
    private _metadata?: Model3DType["metadata"];
    private _createdAt?: Date;
    private _updatedAt?: Date;

    private repository =
        new (require("../database/graphql/repositories/Model3DRepository").Model3DRepository)();

    constructor(data: Model3DType) {
        super();
        this._id = data.id;
        this._name = data.name;
        this._fileId = data.fileId;
        this._format = data.format;
        this._positionVector = new Vector3(data.position);
        this._rotationVector = new Vector3(data.rotation);
        this._scaleVector = new Vector3(data.scale);
        this._materialId = data.materialId;
        this._metadata = data.metadata;
        this._createdAt = data.createdAt;
        this._updatedAt = data.updatedAt;
    }

    /* ==================== GETTERS ==================== */

    get id(): string | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get fileId(): string {
        return this._fileId;
    }

    get format(): MODEL_FILE_FORMAT {
        return this._format;
    }

    get positionVector(): Vector3 {
        return this._positionVector;
    }

    get rotationVector(): Vector3 {
        return this._rotationVector;
    }

    get scaleVector(): Vector3 {
        return this._scaleVector;
    }

    get materialId(): string | undefined {
        return this._materialId;
    }

    get metadata(): Model3DType["metadata"] {
        return this._metadata;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    /* ==================== SETTERS ==================== */

    set name(value: string) {
        this._name = value;
        this.markFieldDirty("name");
    }

    set fileId(value: string) {
        this._fileId = value;
        this.markFieldDirty("fileId");
    }

    set format(value: MODEL_FILE_FORMAT) {
        this._format = value;
        this.markFieldDirty("format");
    }

    set materialId(value: string | undefined) {
        this._materialId = value;
        this.markFieldDirty("materialId");
    }

    set metadata(value: Model3DType["metadata"]) {
        this._metadata = value;
        this.markFieldDirty("metadata");
    }

    /* ==================== TRANSFORM METHODS ==================== */

    /**
     * Set position of the model
     */
    setPosition(x: number, y: number, z: number): void {
        this._positionVector.x = x;
        this._positionVector.y = y;
        this._positionVector.z = z;
        this.markFieldDirty("position");
    }

    /**
     * Set rotation of the model (Euler angles in radians)
     */
    setRotation(x: number, y: number, z: number): void {
        this._rotationVector.x = x;
        this._rotationVector.y = y;
        this._rotationVector.z = z;
        this.markFieldDirty("rotation");
    }

    /**
     * Set scale of the model
     */
    setScale(x: number, y: number, z: number): void {
        this._scaleVector.x = x;
        this._scaleVector.y = y;
        this._scaleVector.z = z;
        this.markFieldDirty("scale");
    }

    /**
     * Translate (move) the model by delta values
     */
    translate(dx: number, dy: number, dz: number): void {
        this._positionVector.x += dx;
        this._positionVector.y += dy;
        this._positionVector.z += dz;
        this.markFieldDirty("position");
    }

    /**
     * Rotate the model by delta values (in radians)
     */
    rotate(dx: number, dy: number, dz: number): void {
        this._rotationVector.x += dx;
        this._rotationVector.y += dy;
        this._rotationVector.z += dz;
        this.markFieldDirty("rotation");
    }

    /**
     * Scale the model by multiplying factors
     */
    scaleBy(sx: number, sy: number, sz: number): void {
        this._scaleVector.x *= sx;
        this._scaleVector.y *= sy;
        this._scaleVector.z *= sz;
        this.markFieldDirty("scale");
    }

    /* ==================== SERIALIZATION ==================== */

    /**
     * Serialize to Model3DType
     */
    serialize(): Model3DType {
        return {
            id: this._id,
            name: this._name,
            fileId: this._fileId,
            format: this._format,
            position: this._positionVector.serialize(),
            rotation: this._rotationVector.serialize(),
            scale: this._scaleVector.serialize(),
            materialId: this._materialId,
            metadata: this._metadata,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    /**
     * Clone this model
     */
    clone(): Model3D {
        return new Model3D(this.serialize());
    }

    /**
     * Get file URL for loading in Three.js
     * @param baseUrl - Base API URL (e.g., "/api/models")
     */
    getFileUrl(baseUrl: string = "/api/models"): string {
        return `${baseUrl}/${this._fileId}`;
    }

    /* ==================== PERSISTENCE ==================== */

    /**
     * Save changes to database
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) {
            console.log("⚠️ No changes to save for Model3D");
            return;
        }

        // Can only save updates if model has an ID (i.e., it exists in the scene)
        if (!this._id) {
            console.warn(
                "Cannot save Model3D without an ID. Use createModel3D mutation to create a new model."
            );
            return;
        }

        if (this.dirtyFields.has("name")) {
            await this.repository.updateModel3DName(this._id, this._name);
        }
        if (this.dirtyFields.has("fileId")) {
            await this.repository.updateModel3DFileId(this._id, this._fileId);
        }
        if (this.dirtyFields.has("format")) {
            await this.repository.updateModel3DFormat(this._id, this._format);
        }
        if (this.dirtyFields.has("position")) {
            await this.repository.updateModel3DPosition(
                this._id,
                this._positionVector.serialize()
            );
        }
        if (this.dirtyFields.has("rotation")) {
            await this.repository.updateModel3DRotation(
                this._id,
                this._rotationVector.serialize()
            );
        }
        if (this.dirtyFields.has("scale")) {
            await this.repository.updateModel3DScale(
                this._id,
                this._scaleVector.serialize()
            );
        }

        if (this.dirtyFields.has("materialId") && this._materialId) {
            await this.repository.updateModel3DMaterialId(
                this._id,
                this._materialId
            );
        }

        this.dirtyFields.clear();
    }
}
