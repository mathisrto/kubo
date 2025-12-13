import { LIGHT_TYPES } from "../constants";
import { LightRepository } from "../database/graphql/repositories/LightRepository";
import { Color, ColorType } from "./Color";
import { ModelClass } from "./ModelClass";
import { Vector3, Vector3Type } from "./Vector3";

/**
 * Represents the properties of a light source in the application.
 *
 * @property name - Human-readable name of the light.
 * @property position - The 3D position of the light in space.
 * @property color - The color of the light.
 * @property intensity - The brightness level of the light.
 * @property range - The effective range of the light.
 * @property type - The type of light, defined by LIGHT_TYPES.
 * @property colorMultiplier - Optional multiplier to adjust the light's color intensity.
 */
export type LightType = {
    id: string;
    name: string;
    position: Vector3Type;
    color: ColorType;
    intensity: number;
    range: number;
    type: LIGHT_TYPES;
    colorMultiplier?: number;
};

/**
 * Represents a light source in the scene with properties such as position, color, intensity, range, and type.
 *
 * @remarks
 * The `Light` class encapsulates the state and behavior of a light object, providing getters and setters for its properties.
 * It supports translation of its position and serialization to a plain object.
 *
 * @example
 * ```typescript
 * const light = new Light({
 *   name: 'Main Light',
 *   position: { x: 0, y: 10, z: 0 },
 *   color: { r: 255, g: 255, b: 255 },
 *   intensity: 1.0,
 *   range: 100,
 *   type: 'point'
 * });
 * light.intensity = 2.0;
 * light.translate(1, 0, 0);
 * const serialized = light.serialize();
 * ```
 */
export class Light extends ModelClass {
    private _id: LightType["id"] = undefined as unknown as string;
    private _name: LightType["name"];
    private _position: Vector3;
    private _color: Color;
    private _intensity: LightType["intensity"];
    private _range: LightType["range"];
    private _type: LightType["type"];
    private _colorMultiplier: number;

    private repository = new LightRepository();

    /**
     * Creates a new Light instance with the specified properties.
     *
     * @param light - An object containing the properties to initialize the Light.
     *   - `name`: The name of the light.
     *   - `position`: The position of the light as a Vector3.
     *   - `color`: The color of the light as a Color.
     *   - `intensity`: The intensity of the light.
     *   - `range`: The effective range of the light.
     *   - `type`: The type of the light.
     */
    constructor(light: LightType) {
        super();
        if (light.id) {
            this._id = light.id;
        }
        this._name = light.name;
        this._position = new Vector3(light.position);
        this._color = new Color(light.color);
        this._intensity = light.intensity;
        this._range = light.range;
        this._type = light.type;
        this._colorMultiplier = light.colorMultiplier ?? 1;

        // Enregistrer les objets enfants pour la propagation
        this.registerChild(this._position);
        this.registerChild(this._color);
    }

    /*
        Getters
    */

    /**
     * Gets the unique identifier of the light.
     *
     * @returns The ID of the light as defined by the `LightType` interface.
     */
    get id(): LightType["id"] {
        return this._id;
    }

    /**
     * Gets the name of the light.
     * @returns The name property from the LightType.
     */
    get name(): LightType["name"] {
        return this._name;
    }

    /**
     * Gets the current color of the light.
     * @returns The color value as defined in the {@link LightType} interface.
     */
    get color(): Light["_color"] {
        return this._color;
    }

    /**
     * Gets the intensity of the light.
     *
     * @returns The current intensity value as defined in the LightType interface.
     */
    get intensity(): LightType["intensity"] {
        return this._intensity;
    }

    /**
     * Gets the range value of the light.
     *
     * @returns The current range of the light as defined by the `LightType` interface.
     */
    get range(): LightType["range"] {
        return this._range;
    }

    /**
     * Gets the current position of the light.
     *
     * @returns The position property from the LightType interface.
     */
    get position(): Light["_position"] {
        return this._position;
    }

    /**
     * Gets the type of the light.
     *
     * @returns The type of the light as defined in the `LightType` interface.
     */
    get type(): LightType["type"] {
        return this._type;
    }

    /**
     * Gets the color multiplier of the light.
     *
     * @returns The color multiplier as defined in the `LightType` interface.
     */
    get colorMultiplier(): Light["_colorMultiplier"] {
        return this._colorMultiplier;
    }

    /*
        Setters
    */

    set id(value: LightType["id"]) {
        if (this._id)
            throw new Error("ID is already set and cannot be modified.");
        this._id = value;
    }

    /**
     * Sets the name of the light.
     * @param name - The new name to assign to the light, as defined by the `LightType` interface.
     */
    set name(name: LightType["name"]) {
        this._name = name;
        this.markFieldDirty("name");
    }

    /**
     * Sets the color of the light.
     * @param color - The new color value to assign to the light. Must be of type `Light["_color"]`.
     */
    set color(color: Light["_color"]) {
        this._color = color;
        this.markFieldDirty("color");
    }

    /**
     * Sets the intensity of the light, ensuring it is not negative.
     * Accepts a value of type `LightType["intensity"]` and clamps it to a minimum of 0.
     * @param value - The desired intensity value for the light.
     */
    set intensity(value: LightType["intensity"]) {
        this._intensity = Math.max(0, value);
        this.markFieldDirty("intensity");
    }

    /**
     * Sets the range of the light, ensuring it is not negative.
     * @param value - The desired range value for the light.
     */
    set range(value: LightType["range"]) {
        this._range = Math.max(0, value);
        this.markFieldDirty("range");
    }

    /**
     * Sets the position of the light.
     * @param position - The new position to assign to the light, matching the type of `_position`.
     */
    set position(position: Light["_position"]) {
        this._position = position;
        this.markFieldDirty("position");
    }

    /**
     * Sets the type of the light.
     * @param type - The type of the light, as defined in `LightType["type"]`.
     */
    set type(type: LightType["type"]) {
        this._type = type;
        this.markFieldDirty("type");
    }

    /**
     * Sets the color multiplier of the light.
     * @param multiplier - The new color multiplier to assign to the light.
     */
    set colorMultiplier(multiplier: Light["_colorMultiplier"]) {
        this._colorMultiplier = multiplier;
        this.markFieldDirty("colorMultiplier");
    }

    /*
        Methods
    */

    /**
     * Translates the light's position by the specified x, y, and z offsets.
     *
     * @param x - The amount to translate along the x-axis.
     * @param y - The amount to translate along the y-axis.
     * @param z - The amount to translate along the z-axis.
     */
    public translate(
        x: LightType["position"]["x"],
        y: LightType["position"]["y"],
        z: LightType["position"]["z"]
    ): void {
        this._position.x += x;
        this._position.y += y;
        this._position.z += z;

        this.markFieldDirty("position");
    }

    /**
     * Serializes the current Light instance into a plain object of type `LightType`.
     *
     * @returns {LightType} An object containing the light's name, position, color, intensity, range, and type.
     */
    public serialize(): any {
        // Never include id in serialization - it's not part of LightInput
        return {
            name: this._name,
            position: this._position.serialize(),
            color: this._color.serialize(),
            intensity: this._intensity,
            range: this._range,
            type: this._type,
            colorMultiplier: this._colorMultiplier,
        };
    }

    /**
     * Creates and returns a new instance of `Light` with the same properties as the current instance.
     * The cloning is performed by serializing the current object and passing the serialized data to the constructor.
     *
     * @returns {Light} A new `Light` instance that is a copy of the current object.
     */
    public clone(): Light {
        return new Light(this.serialize());
    }

    /**
     * Normalizes the position vector of the light.
     */
    public normalizePosition(): void {
        this._position.normalize();
    }

    /**
     * Calculates the normalized direction vector from the light to a target point.
     * @param target - The target position as a Vector3Type.
     * @returns A normalized Vector3 representing the direction.
     */
    public directionTo(target: Vector3Type): Vector3 {
        const direction = new Vector3({
            x: target.x - this._position.x,
            y: target.y - this._position.y,
            z: target.z - this._position.z,
        });
        direction.normalize();
        return direction;
    }

    /**
     * Saves the current Light instance asynchronously.
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) return;

        // Can only save updates if light has an ID (i.e., it exists on the server)
        if (!this._id) {
            console.warn("Cannot save Light without an ID");
            return;
        }

        if (this.dirtyFields.has("name")) {
            await this.repository.updateLightName(this._id, this.name);
        }

        // Si un sous-champ de position a changé
        if (
            this._position.countDirtyFields() > 0 ||
            this.dirtyFields.has("position")
        ) {
            console.log(
                "[Light.save] Updating position:",
                this._position.serialize()
            );
            await this.repository.updateLightPosition(this._id, this.position);
            this._position.clearDirtyFields();
        }

        // Si un sous-champ de couleur a changé
        if (
            this._color.countDirtyFields() > 0 ||
            this.dirtyFields.has("color")
        ) {
            console.log(
                "[Light.save] Updating color:",
                this._color.serialize()
            );
            await this.repository.updateLightColor(this._id, this.color);
            this._color.clearDirtyFields();
        }

        if (this.dirtyFields.has("intensity")) {
            await this.repository.updateLightIntensity(
                this._id,
                this.intensity
            );
        }
        if (this.dirtyFields.has("range")) {
            await this.repository.updateLightRange(this._id, this.range);
        }
        if (this.dirtyFields.has("type")) {
            await this.repository.updateLightType(this._id, this.type);
        }
        if (this.dirtyFields.has("colorMultiplier")) {
            await this.repository.updateLightColorMultiplier(
                this._id,
                this.colorMultiplier
            );
        }

        this.clearDirtyFields();
    }
}
