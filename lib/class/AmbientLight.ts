import { AmbientLightRepository } from "../database/graphql/repositories/AmbientLightRepository";
import { Color, ColorType } from "./Color";
import { ModelClass } from "./ModelClass";

/**
 * Represents the properties of an ambient light source.
 *
 * @property color - The color of the ambient light, defined as a `ColorType`.
 * @property intensity - The intensity or strength of the ambient light.
 * @property colorMultiplier - (Optional) A multiplier applied to the color for additional adjustment.
 */
export type AmbientLightType = {
    color: ColorType;
    intensity: number;
    colorMultiplier?: number;
};

/**
 * Represents an ambient light source with configurable color, intensity, and color multiplier.
 *
 * @remarks
 * This class encapsulates the properties and serialization logic for an ambient light,
 * typically used in rendering or graphics applications.
 *
 * @example
 * ```ts
 * const ambient = new AmbientLight({
 *   color: "#ffffff",
 *   intensity: 0.8,
 *   colorMultiplier: 1.2
 * });
 * ```
 */
export class AmbientLight extends ModelClass {
    private _color: Color;
    private _intensity: number;
    private _colorMultiplier: number;

    private repository = new AmbientLightRepository();

    /**
     * Creates a new instance of the AmbientLight class.
     *
     * @param data - The configuration object containing properties for the ambient light.
     * @param data.color - The color value of the ambient light, used to initialize the Color instance.
     * @param data.intensity - The intensity of the ambient light.
     * @param data.colorMultiplier - (Optional) A multiplier applied to the color; defaults to 1 if not provided.
     */
    constructor(data: AmbientLightType) {
        super();
        this._color = new Color(data.color);
        this._intensity = data.intensity;
        this._colorMultiplier = data.colorMultiplier ?? 1;

        // Enregistrer la couleur comme enfant pour la propagation
        this.registerChild(this._color);
    }

    /* Getters */

    /**
     * Gets the current color of the ambient light.
     * @returns The color value as stored in the `_color` property.
     */
    get color() {
        return this._color;
    }

    /**
     * Gets the current intensity value of the ambient light.
     * @returns The intensity of the ambient light.
     */
    get intensity() {
        return this._intensity;
    }

    /**
     * Gets the current color multiplier value for the ambient light.
     * This value is typically used to adjust the intensity or tint of the light's color.
     * @returns The color multiplier as a number or appropriate type.
     */
    get colorMultiplier() {
        return this._colorMultiplier;
    }

    /* Setters */

    /**
     * Sets the color of the ambient light.
     * @param c - The new color to apply.
     */
    set color(c: Color) {
        this._color = c;
        this.markFieldDirty("color");
    }

    /**
     * Sets the intensity of the ambient light.
     *
     * @param i - The new intensity value to set.
     */
    set intensity(i: number) {
        this._intensity = i;
        this.markFieldDirty("intensity");
    }

    /**
     * Sets the color multiplier for the ambient light.
     *
     * @param m - The new multiplier value to apply to the ambient light's color.
     */
    set colorMultiplier(m: number) {
        this._colorMultiplier = m;
        this.markFieldDirty("colorMultiplier");
    }

    /* Methods */

    /**
     * Serializes the current AmbientLight instance into an object of type AmbientLightType.
     *
     * @returns {AmbientLightType} An object containing the serialized color, intensity, and colorMultiplier properties.
     */
    serialize(): AmbientLightType {
        return {
            color: this._color.serialize(),
            intensity: this._intensity,
            colorMultiplier: this._colorMultiplier,
        };
    }

    /**
     * Saves the current AmbientLight instance asynchronously.
     *
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) return;

        // Si un sous-champ de couleur a changé
        if (
            this._color.countDirtyFields() > 0 ||
            this.dirtyFields.has("color")
        ) {
            console.log(
                "[AmbientLight.save] Updating color:",
                this._color.serialize()
            );
            await this.repository.updateAmbientLightColor(
                this._color.serialize()
            );
            this._color.clearDirtyFields();
        }

        if (this.dirtyFields.has("intensity")) {
            await this.repository.updateAmbientLightIntensity(this._intensity);
        }
        if (this.dirtyFields.has("colorMultiplier")) {
            await this.repository.updateAmbientLightColorMultiplier(
                this._colorMultiplier
            );
        }

        this.clearDirtyFields();
    }
}
