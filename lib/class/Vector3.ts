/**
 * Represents a three-dimensional vector with numeric x, y, and z components.
 *
 * @property x - The X coordinate or component of the vector.
 * @property y - The Y coordinate or component of the vector.
 * @property z - The Z coordinate or component of the vector.
 */
export type Vector3Type = {
    x: number;
    y: number;
    z: number;
};

/**
 * Represents a three-dimensional vector and provides common vector operations.
 *
 * @remarks
 * The `Vector3` class encapsulates 3D vector arithmetic, including addition, subtraction,
 * scalar multiplication, dot product, cross product, normalization, and serialization.
 *
 * @example
 * ```typescript
 * const v1 = new Vector3({ x: 1, y: 2, z: 3 });
 * const v2 = new Vector3({ x: 4, y: 5, z: 6 });
 * const sum = v1.add(v2); // Vector addition
 * const dot = v1.dot(v2); // Dot product
 * const normalized = v1.normalize(); // Normalized vector
 * ```
 *
 * @public
 */
export class Vector3 {
    private _x: Vector3Type["x"];
    private _y: Vector3Type["y"];
    private _z: Vector3Type["z"];

    /**
     * Creates a new Vector3 instance from the provided vector object.
     * @param vector - An object containing the x, y, and z components of the vector.
     */
    constructor(vector: Vector3Type) {
        this._x = vector.x;
        this._y = vector.y;
        this._z = vector.z;
    }

    /* Getters */

    /**
     * Gets the x-component of the vector.
     * @returns The value of the x-coordinate.
     */
    get x(): Vector3Type["x"] {
        return this._x;
    }

    /**
     * Gets the y-component of the vector.
     * @returns The current value of the y-coordinate.
     */
    get y(): Vector3Type["y"] {
        return this._y;
    }

    /**
     * Gets the z-coordinate of the vector.
     * @returns The value of the z component.
     */
    get z(): Vector3Type["z"] {
        return this._z;
    }

    /* Setters */

    /**
     * Sets the x-coordinate of the vector.
     * @param value - The new value for the x-coordinate.
     */
    set x(value: Vector3Type["x"]) {
        this._x = value;
    }

    /**
     * Sets the y component of the vector.
     * @param value - The new value for the y component.
     */
    set y(value: Vector3Type["y"]) {
        this._y = value;
    }

    /**
     * Sets the z-coordinate of the vector.
     * @param value - The new value for the z-coordinate.
     */
    set z(value: Vector3Type["z"]) {
        this._z = value;
    }

    /* Methods */

    /**
     * Adds the components of the given {@link Vector3} to this vector and returns a new {@link Vector3} instance.
     *
     * @param v - The vector to add.
     * @returns A new {@link Vector3} representing the sum of this vector and the given vector.
     */
    add(v: Vector3): Vector3 {
        return new Vector3({
            x: this.x + v.x,
            y: this.y + v.y,
            z: this.z + v.z,
        });
    }

    /**
     * Subtracts the components of the given `Vector3` from this vector and returns a new `Vector3` instance.
     *
     * @param v - The vector to subtract from this vector.
     * @returns A new `Vector3` representing the result of the subtraction.
     */
    subtract(v: Vector3): Vector3 {
        return new Vector3({
            x: this.x - v.x,
            y: this.y - v.y,
            z: this.z - v.z,
        });
    }

    /**
     * Multiplies each component of this vector by the given scalar value.
     *
     * @param s - The scalar value to multiply by.
     * @returns A new `Vector3` instance with each component scaled by `s`.
     */
    multiplyScalar(s: number): Vector3 {
        return new Vector3({
            x: this.x * s,
            y: this.y * s,
            z: this.z * s,
        });
    }

    /**
     * Calculates the dot product of this vector and another vector.
     * The dot product is a scalar value equal to the sum of the products of the corresponding components.
     *
     * @param v - The other {@link Vector3} to compute the dot product with.
     * @returns The dot product as a number.
     */
    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Computes the cross product of this vector and another vector.
     * The cross product results in a new vector that is perpendicular to both input vectors.
     *
     * @param v - The other vector to compute the cross product with.
     * @returns A new `Vector3` instance representing the cross product.
     */
    cross(v: Vector3): Vector3 {
        return new Vector3({
            x: this.y * v.z - this.z * v.y,
            y: this.z * v.x - this.x * v.z,
            z: this.x * v.y - this.y * v.x,
        });
    }

    /**
     * Calculates the Euclidean length (magnitude) of the vector.
     *
     * @returns The length of the vector as a number.
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Returns a normalized (unit length) vector in the same direction as this vector.
     * If the vector has zero length, returns a zero vector.
     *
     * @returns {Vector3} A new normalized Vector3 instance.
     */
    normalize(): Vector3 {
        const len = this.length();
        if (len === 0) return new Vector3({ x: 0, y: 0, z: 0 });
        return new Vector3({
            x: this.x / len,
            y: this.y / len,
            z: this.z / len,
        });
    }

    /**
     * Serializes the current `Vector3` instance into a plain object representation.
     *
     * @returns {Vector3Type} An object containing the `x`, `y`, and `z` components of the vector.
     */
    serialize(): Vector3Type {
        return { x: this.x, y: this.y, z: this.z };
    }

    /**
     * Converts the vector components to an array.
     *
     * @returns An array containing the x, y, and z components of the vector.
     */
    toArray(): [Vector3Type["x"], Vector3Type["y"], Vector3Type["z"]] {
        return [this.x, this.y, this.z];
    }

    equals(v: Vector3Type): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }
}
