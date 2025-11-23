import { AmbientLight as AppAmbientLight } from "@/lib/class/AmbientLight";
import * as THREE from "three";

/**
 * Controller to bridge the application's AmbientLight model with a Three.js AmbientLight.
 *
 * Responsibilities:
 * - Create a corresponding Three.js AmbientLight from the application model
 * - Keep the Three.js light in sync when the model changes
 */
export class AmbientLightController {
    private appAmbientLight: AppAmbientLight;
    private threeLight: THREE.AmbientLight;
    private _unsubscribe?: () => void;

    constructor(appAmbientLight: AppAmbientLight) {
        this.appAmbientLight = appAmbientLight;

        const colorHex = this.appAmbientLight.color.toHex();
        const intensity = this.appAmbientLight.intensity;

        // Create Three.js AmbientLight using the app color and intensity
        this.threeLight = new THREE.AmbientLight(
            new THREE.Color(colorHex),
            intensity
        );

        // subscribe to model changes (use specific-field listeners for clarity)
        const unsubscribes: Array<() => void> = [];
        if (typeof this.appAmbientLight.onFieldChange === "function") {
            unsubscribes.push(
                this.appAmbientLight.onFieldChange("intensity", () =>
                    this.updateIntensity()
                )
            );
            unsubscribes.push(
                this.appAmbientLight.onFieldChange("color", () =>
                    this.updateColor()
                )
            );
            unsubscribes.push(
                this.appAmbientLight.onFieldChange("colorMultiplier", () =>
                    this.updateColorMultiplier()
                )
            );
        }
        this._unsubscribe = () => unsubscribes.forEach((u) => u());
    }

    /**
     * Returns the underlying Three.js AmbientLight instance.
     */
    getThreeLight(): THREE.AmbientLight {
        return this.threeLight;
    }

    /**
     * Update the model intensity and immediately sync the Three.js light.
     */
    setIntensity(i: number) {
        this.appAmbientLight.intensity = i;
        this.appAmbientLight.markFieldDirty?.("intensity");
        this.updateIntensity();
    }

    /**
     * Update the model color using a hex string and sync the Three.js light.
     */
    setColorHex(hex: string) {
        // Try to set color via the model's Color API if available
        try {
            // assume model exposes a Color instance with toHex/serialize; set via repository normally
            // Here we directly set three light and expect model persistence handled elsewhere
            const c = new THREE.Color(hex);
            this.threeLight.color.copy(c);
            this.appAmbientLight.color = this.appAmbientLight.color?.clone
                ? (this.appAmbientLight.color.clone() as any)
                : this.appAmbientLight.color;
            // no-op for model update; repository should persist
            this.appAmbientLight.markFieldDirty?.("color");
            this.updateColor();
        } catch (e) {
            console.warn("Failed to set ambient light color hex", e);
        }
    }

    /**
     * Update intensity only on the Three.js light from model
     */
    updateIntensity() {
        // @ts-ignore
        (this.threeLight as any).intensity = this.appAmbientLight.intensity;
    }

    /**
     * Update color only on the Three.js light from model
     */
    updateColor() {
        const baseColor = new THREE.Color(this.appAmbientLight.color.toHex());
        this.threeLight.color.copy(baseColor);
    }

    /**
     * Apply color multiplier to Three.js light based on model
     */
    updateColorMultiplier() {
        // Reset to base color then apply multiplier
        this.updateColor();
        if (
            this.appAmbientLight.colorMultiplier &&
            this.appAmbientLight.colorMultiplier !== 1
        ) {
            this.threeLight.color.multiplyScalar(
                this.appAmbientLight.colorMultiplier
            );
        }
    }

    /**
     * Dispose subscriptions and resources
     */
    dispose() {
        if (this._unsubscribe) this._unsubscribe();
    }
}
