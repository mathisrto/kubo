import { ModelClass } from "./ModelClass";

/**
 * Represents a color using RGBA (red, green, blue, alpha) channels.
 * Each channel is a number, typically in the range 0-255 for r, g, b and 0-1 for a.
 *
 * @property r - The red channel value.
 * @property g - The green channel value.
 * @property b - The blue channel value.
 * @property a - The alpha (opacity) channel value.
 */
export type ColorType = {
    r: number;
    g: number;
    b: number;
    a: number;
};

/**
 * Represents an RGBA color with utility methods for manipulation and serialization.
 *
 * @remarks
 * The `Color` class provides getters and setters for each color channel (red, green, blue, alpha),
 * ensures values are clamped to valid ranges, and supports multiplying the color by a scalar.
 *
 * @example
 * ```typescript
 * const color = new Color({ r: 255, g: 128, b: 64, a: 0.5 });
 * color.r = 100;
 * const brighter = color.multiply(1.2);
 * const serialized = color.serialize();
 * ```
 */
export class Color extends ModelClass {
    private _r: ColorType["r"];
    private _g: ColorType["g"];
    private _b: ColorType["b"];
    private _a: ColorType["a"];

    /**
     * Creates a new Color instance from the provided color values.
     * Each color channel (red, green, blue) is clamped to the valid Uint8 range (0-255),
     * and the alpha channel is clamped to its valid range.
     *
     * @param color - An object of type `ColorType` containing the RGBA values.
     */
    constructor(color: ColorType) {
        super();
        this._r = Color.clampUint8(color.r);
        this._g = Color.clampUint8(color.g);
        this._b = Color.clampUint8(color.b);
        this._a = Color.clampAlpha(color.a);
    }

    /* Getters */

    /**
     * Gets the red component of the color.
     * @returns The value of the red channel.
     */
    get r(): ColorType["r"] {
        return this._r;
    }

    /**
     * Gets the green channel value of the color.
     * @returns The green component as defined in the `ColorType` interface.
     */
    get g(): ColorType["g"] {
        return this._g;
    }

    /**
     * Gets the blue component of the color.
     * @returns The value of the blue channel as defined in the `ColorType` interface.
     */
    get b(): ColorType["b"] {
        return this._b;
    }

    /**
     * Gets the alpha (transparency) component of the color.
     * @returns The alpha value as defined in the ColorType interface.
     */
    get a(): ColorType["a"] {
        return this._a;
    }

    /* Setters */

    /**
     * Sets the red channel value of the color.
     * The value is clamped to the range of an unsigned 8-bit integer (0-255).
     * @param value - The new red channel value.
     */
    set r(value: ColorType["r"]) {
        this._r = Color.clampUint8(value);
        this.markFieldDirty("r");
    }

    /**
     * Sets the green channel value of the color.
     * The value is clamped to the valid range for an 8-bit unsigned integer (0-255).
     * @param value - The green channel value to set.
     */
    set g(value: ColorType["g"]) {
        this._g = Color.clampUint8(value);
        this.markFieldDirty("g");
    }

    /**
     * Sets the blue channel value of the color.
     * The value is clamped to the range of an unsigned 8-bit integer (0-255).
     * @param value - The new blue channel value.
     */
    set b(value: ColorType["b"]) {
        this._b = Color.clampUint8(value);
        this.markFieldDirty("b");
    }

    /**
     * Sets the alpha (transparency) value of the color.
     * The value is clamped to ensure it remains within valid bounds.
     * @param value - The new alpha value to set.
     */
    set a(value: ColorType["a"]) {
        this._a = Color.clampAlpha(value);
        this.markFieldDirty("a");
    }

    /* Methods */

    /**
     * Clamps a number to the range of an unsigned 8-bit integer (0 to 255).
     * Rounds the input value to the nearest integer before clamping.
     *
     * @param value - The number to clamp.
     * @returns The clamped value, guaranteed to be between 0 and 255 inclusive.
     */
    private static clampUint8(value: number): number {
        return Math.max(0, Math.min(255, Math.round(value)));
    }

    /**
     * Clamps the alpha value to a valid range between 0 and 1, rounding to two decimal places.
     * If the input value is `undefined`, defaults to 1 (fully opaque).
     *
     * @param value - The alpha value to clamp, or `undefined`.
     * @returns The clamped alpha value between 0 and 1.
     */
    private static clampAlpha(
        value: ColorType["a"] | undefined
    ): ColorType["a"] {
        return Math.max(
            0,
            Math.min(1, value !== undefined ? Math.round(value * 100) / 100 : 1)
        );
    }

    /**
     * Multiplies each color channel (red, green, blue, alpha) by the given scalar value.
     * The RGB channels are clamped to the range [0, 255], and the alpha channel is clamped to [0, 1].
     *
     * @param scalar - The value to multiply each channel by.
     * @returns A new {@link Color} instance with the multiplied channel values.
     */
    public multiply(scalar: number): Color {
        return new Color({
            r: Color.clampUint8(this.r * scalar),
            g: Color.clampUint8(this.g * scalar),
            b: Color.clampUint8(this.b * scalar),
            a: Math.max(0, Math.min(1, this.a * scalar)),
        });
    }

    /**
     * Serializes the current color instance into a plain object of type `ColorType`.
     *
     * @returns {ColorType} An object containing the RGBA components of the color.
     */
    public serialize(): ColorType {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a,
        };
    }

    /**
     * Creates a new {@link Color} instance that is a copy of the current color.
     *
     * @remarks
     * The cloned color will have identical RGBA channel values as the original.
     *
     * @returns A new {@link Color} object with the same channel values as this instance.
     */
    public clone(): Color {
        return new Color(this.serialize());
    }

    /**
     * Méthode de sauvegarde requise par ModelClass (Color ne se sauvegarde pas individuellement)
     */
    async save(): Promise<void> {
        // Color ne se sauvegarde pas directement, c'est l'objet parent qui gère la sauvegarde
    }

    /**
     * Converts the RGB color values of this instance to a hexadecimal color string.
     *
     * @returns {string} The hexadecimal representation of the color in the format `#RRGGBB`.
     */
    public toHex(): string {
        const r = this.r.toString(16).padStart(2, "0");
        const g = this.g.toString(16).padStart(2, "0");
        const b = this.b.toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }

    updateFromState(state: ColorType): void {
        this.r = state.r;
        this.g = state.g;
        this.b = state.b;
        this.a = state.a;
    }
}
