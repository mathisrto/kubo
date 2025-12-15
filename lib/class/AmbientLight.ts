import { AmbientLightRepository } from "../database/graphql/repositories/AmbientLightRepository";
import { ModelClass } from "./ModelClass";

/**
 * Represents the properties of an ambient light source.
 *
 * @property intensity - The intensity or strength of the ambient light.
 * @property environmentMap - (Optional) URL or identifier for the environment image (HDRI, panorama, etc.)
 */
export type AmbientLightType = {
    intensity: number;
    environmentMap: string; // URL ou identifiant de l'image d'environnement
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
 *   intensity: 0.8,
 *   environmentMap: "venice_sunset.hdr"
 * });
 * ```
 */
export class AmbientLight extends ModelClass {
    private _intensity: number;
    private _environmentMap: string;

    private repository: AmbientLightRepository;

    /**
     * Creates a new instance of the AmbientLight class.
     *
     * @param data - The configuration object containing properties for the ambient light.
     * @param data.intensity - The intensity of the ambient light.
     * @param data.environmentMap - (Optional) The environment map GridFS ID or URL.
     */
    constructor(data: AmbientLightType, repository: AmbientLightRepository) {
        super();
        this._intensity = data.intensity;
        this.repository = repository;
        // On stocke l'ID GridFS, ou une URL directe si fournie
        if (data.environmentMap) {
            // Si c'est un ObjectId (24 caractères hex), on le traite comme un ID GridFS
            if (/^[a-f\d]{24}$/i.test(data.environmentMap)) {
                this._environmentMap = data.environmentMap;
            } else {
                this._environmentMap = data.environmentMap;
            }
        } else {
            this._environmentMap = "";
        }
    }

    /* Getters */

    /**
     * Gets the current intensity value of the ambient light.
     * @returns The intensity of the ambient light.
     */
    get intensity() {
        return this._intensity;
    }

    /**
     * Gets the current environment map GridFS ID (si stocké comme ID).
     */
    get environmentMap() {
        // Si c'est un ObjectId (GridFS), retourne l'URL API
        if (/^[a-f\d]{24}$/i.test(this._environmentMap)) {
            return `api/environments/${this._environmentMap}`;
        }
        // Sinon, c'est une URL externe
        return this._environmentMap;
    }

    /* Setters */

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
     * Sets the environment map (image) for the ambient light.
     * @param map - The new environment map GridFS ID or URL.
     */
    set environmentMap(map: string) {
        if (/^[a-f\d]{24}$/i.test(map)) {
            this._environmentMap = map;
        } else {
            this._environmentMap = map;
        }
        this.markFieldDirty("environmentMap");
    }

    /* Methods */

    /**
     * Serializes the current AmbientLight instance into an object of type AmbientLightType.
     *
     * @returns {AmbientLightType} An object containing the serialized color, intensity, and colorMultiplier properties.
     */
    serialize(): AmbientLightType {
        return {
            intensity: this._intensity,
            environmentMap: this._environmentMap,
        };
    }

    /**
     * Saves the current AmbientLight instance asynchronously.
     *
     * @returns {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        if (this.countDirtyFields() === 0) return;

        if (this.dirtyFields.has("intensity")) {
            await this.repository.updateAmbientLightIntensity(this._intensity);
        }
        if (this.dirtyFields.has("environmentMap")) {
            await this.repository.updateAmbientLightEnvironmentMap(
                this._environmentMap
            );
        }
        this.clearDirtyFields();
    }

    updateFromState(state: AmbientLightType): void {
        this.intensity = state.intensity;
        this.environmentMap = state.environmentMap;
    }
}
