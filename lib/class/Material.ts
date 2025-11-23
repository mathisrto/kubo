import { MaterialRepository } from "../database/graphql/repositories/MaterialRepository";
import { Color, ColorType } from "./Color";
import { ModelClass } from "./ModelClass";

/**
 * Represents the properties of a material used in rendering.
 *
 * @property name - Human-readable name of the material.
 * @property albedo - Base color of the material.
 * @property metallic - Value indicating how metallic the material is (typically between 0 and 1).
 * @property roughness - Value indicating the roughness of the material surface (typically between 0 and 1).
 * @property ao - (Optional) Ambient occlusion factor for the material.
 * @property emissive - (Optional) Emissive color of the material, representing light emission.
 */
export type MaterialType = {
    id: string;
    name: string;
    albedo: ColorType;
    metallic: number;
    roughness: number;
    ao?: number;
    emissive?: ColorType;
};

/**
 * Represents a physically-based material with properties such as albedo, metallic, roughness, ambient occlusion, and emissive color.
 * Provides getter and setter methods for each property, as well as serialization and cloning functionality.
 *
 * @remarks
 * This class is designed to encapsulate material properties commonly used in rendering engines and graphics applications.
 *
 * @example
 * ```typescript
 * const materialData: MaterialType = {
 *   name: "Gold",
 *   albedo: { r: 1, g: 0.85, b: 0.57, a: 1 },
 *   metallic: 1,
 *   roughness: 0.2,
 *   ao: 1,
 *   emissive: { r: 0, g: 0, b: 0, a: 1 }
 * };
 * const goldMaterial = new Material(materialData);
 * ```
 */
export class Material extends ModelClass {
    private _id: MaterialType["id"] = undefined as unknown as string;
    private _name: MaterialType["name"];
    private _albedo: Color;
    private _metallic: MaterialType["metallic"];
    private _roughness: MaterialType["roughness"];
    private _ao: number;
    private _emissive: Color;

    private repository = new MaterialRepository();

    constructor(material: MaterialType) {
        super();
        if (material.id) {
            this._id = material.id;
        }
        this._name = material.name;
        this._albedo = new Color(material.albedo);
        this._metallic = material.metallic;
        this._roughness = material.roughness;
        this._ao = material.ao ?? 1.0;
        this._emissive = new Color(
            material.emissive ?? { r: 0, g: 0, b: 0, a: 1 }
        );
    }

    /* Getters */

    /**
     * Gets the unique identifier of the material.
     *
     * @returns The `id` property from the `MaterialType` interface.
     */
    get id(): MaterialType["id"] {
        return this._id;
    }

    /**
     * Gets the name of the material.
     *
     * @returns The name property from the MaterialType.
     */
    get name(): MaterialType["name"] {
        return this._name;
    }

    /**
     * Gets the albedo property of the material.
     * Albedo typically represents the diffuse reflectivity or base color of the material.
     * @returns The current albedo value.
     */
    get albedo(): Material["_albedo"] {
        return this._albedo;
    }

    /**
     * Gets the metallic property of the material.
     *
     * @returns The metallic value as defined in the MaterialType interface.
     */
    get metallic(): MaterialType["metallic"] {
        return this._metallic;
    }

    /**
     * Gets the roughness value of the material.
     * Roughness typically determines how matte or glossy the material appears.
     * @returns The roughness property from the material type.
     */
    get roughness(): MaterialType["roughness"] {
        return this._roughness;
    }

    /**
     * Gets the ambient occlusion (AO) value of the material.
     * This property represents how much ambient light the material receives,
     * typically used for shading and rendering effects.
     *
     * @returns The ambient occlusion value as defined in the `MaterialType`.
     */
    get ao(): Material["_ao"] {
        return this._ao;
    }

    /**
     * Gets the emissive property of the material.
     * This value represents the material's emissive color or intensity,
     * which determines how much light the material emits independently of external lighting.
     *
     * @returns The current emissive value of the material.
     */
    get emissive(): Material["_emissive"] {
        return this._emissive;
    }

    /* Setters */

    set id(value: MaterialType["id"]) {
        if (this._id)
            throw new Error("ID is already set and cannot be modified.");
        this._id = value;
    }

    /**
     * Sets the name of the material.
     * @param value - The new name to assign to the material.
     */
    set name(value: MaterialType["name"]) {
        this._name = value;
        this.markFieldDirty("name");
    }

    /**
     * Sets the albedo (base color) property of the material.
     * Accepts a value compatible with the `MaterialType["albedo"]` type and
     * assigns it to the internal `_albedo` property as a new `Color` instance.
     *
     * @param value - The albedo value to set, representing the material's base color.
     */
    set albedo(value: MaterialType["albedo"]) {
        this._albedo = new Color(value);
        this.markFieldDirty("albedo");
    }

    /**
     * Sets the metallic property of the material.
     *
     * @param value - The new metallic value to assign.
     */
    set metallic(value: MaterialType["metallic"]) {
        this._metallic = Math.max(0, Math.min(1, value));
        this.markFieldDirty("metallic");
    }

    /**
     * Sets the roughness value of the material.
     * Roughness determines how matte or glossy the material appears.
     * @param value - The new roughness value to assign.
     */
    set roughness(value: MaterialType["roughness"]) {
        this._roughness = Math.max(0, Math.min(1, value));
        this.markFieldDirty("roughness");
    }

    /**
     * Sets the ambient occlusion (AO) value for the material.
     * @param value - The ambient occlusion value, as defined in the `MaterialType` interface.
     */
    set ao(value: Material["_ao"]) {
        this._ao = value;
        this.markFieldDirty("ao");
    }

    /**
     * Sets the emissive color of the material.
     * Accepts a value compatible with the `MaterialType["emissive"]` type and assigns it to the internal `_emissive` property as a `Color` instance.
     * @param value - The emissive color value to set.
     */
    set emissive(value: Material["_emissive"]) {
        this._emissive = value;
        this.markFieldDirty("emissive");
    }

    /* Methods */

    /**
     * Serializes the current Material instance into a plain object of type `MaterialType`.
     *
     * @returns {MaterialType} The serialized representation of the material, including its properties such as name, albedo, metallic, roughness, ambient occlusion (ao), and emissive.
     */
    serialize(): any {
        // Never include id in serialization - it's not part of MaterialInput
        return {
            name: this.name,
            albedo: this.albedo.serialize(),
            metallic: this.metallic,
            roughness: this.roughness,
            ao: this.ao,
            emissive: this.emissive?.serialize() ?? { r: 0, g: 0, b: 0, a: 1 },
        };
    }

    /**
     * Creates and returns a deep copy of the current `Material` instance.
     * The new instance is initialized using the serialized data of the original.
     *
     * @returns {Material} A new `Material` object that is a clone of the current instance.
     */
    public clone(): Material {
        return new Material(this.serialize());
    }

    /**
     * Saves the current Material instance asynchronously.
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) return;

        // Can only save updates if material has an ID (i.e., it exists on the server)
        if (!this._id) {
            console.warn("Cannot save Material without an ID");
            return;
        }

        if (this.dirtyFields.has("name")) {
            await this.repository.updateMaterialName(this._id, this.name);
        }

        if (this.dirtyFields.has("albedo")) {
            await this.repository.updateMaterialAlbedo(this._id, this.albedo);
        }

        if (this.dirtyFields.has("metallic")) {
            await this.repository.updateMaterialMetallic(
                this._id,
                this.metallic
            );
        }

        if (this.dirtyFields.has("roughness")) {
            await this.repository.updateMaterialRoughness(
                this._id,
                this.roughness
            );
        }

        if (this.dirtyFields.has("ao")) {
            await this.repository.updateMaterialAO(this._id, this.ao);
        }

        if (this.dirtyFields.has("emissive")) {
            await this.repository.updateMaterialEmissive(
                this._id,
                this.emissive
            );
        }

        this.dirtyFields.clear();
    }
}
