import { Light as AppLight } from "@/lib/class/Light";
import { LIGHT_TYPES } from "@/lib/constants";
import * as THREE from "three";

/**
 * Controller to bridge application Light model and corresponding Three.js light.
 * Supports POINT, DIRECTIONAL, SPOT types and keeps Three.js light in sync with model.
 */
export class LightController {
    private appLight: AppLight;
    private threeLight: THREE.Light;
    private _unsubscribe?: () => void;

    constructor(appLight: AppLight) {
        this.appLight = appLight;
        this.threeLight = this.createThreeLight(appLight);

        // initial sync
        this.updatePosition();
        this.updateColor();
        this.updateIntensity();
        this.updateRange();

        // subscribe to model changes
        const unsubscribes: Array<() => void> = [];
        if (typeof this.appLight.onFieldChange === "function") {
            unsubscribes.push(
                this.appLight.onFieldChange("position", () =>
                    this.updatePosition()
                )
            );
            unsubscribes.push(
                this.appLight.onFieldChange("color", () => this.updateColor())
            );
            unsubscribes.push(
                this.appLight.onFieldChange("intensity", () =>
                    this.updateIntensity()
                )
            );
            unsubscribes.push(
                this.appLight.onFieldChange("range", () => this.updateRange())
            );
            unsubscribes.push(
                this.appLight.onFieldChange("type", () =>
                    this.recreateFromType()
                )
            );
            unsubscribes.push(
                this.appLight.onFieldChange("colorMultiplier", () =>
                    this.updateColorMultiplier()
                )
            );
        }
        this._unsubscribe = () => unsubscribes.forEach((u) => u());
    }

    getThreeLight(): THREE.Light {
        return this.threeLight;
    }

    private createThreeLight(appLight: AppLight): THREE.Light {
        const hex = appLight.color.toHex();
        const intensity = appLight.intensity;
        const range = appLight.range ?? 0;

        switch (appLight.type) {
            case LIGHT_TYPES.POINT:
                return new THREE.PointLight(
                    new THREE.Color(hex),
                    intensity,
                    range
                );
            case LIGHT_TYPES.DIRECTIONAL: {
                return new THREE.DirectionalLight(
                    new THREE.Color(hex),
                    intensity
                );
            }
            case LIGHT_TYPES.SPOT:
                // SpotLight signature: color, intensity, distance, angle, penumbra, decay
                return new THREE.SpotLight(
                    new THREE.Color(hex),
                    intensity,
                    range
                );
            default:
                // fallback to point light
                return new THREE.PointLight(
                    new THREE.Color(hex),
                    intensity,
                    range
                );
        }
    }

    private recreateFromType() {
        // dispose previous if possible
        try {
            // if light has dispose-like resources, attempt to clean
            (this.threeLight as any).dispose?.();
        } catch (e) {}
        this.threeLight = this.createThreeLight(this.appLight);
        // sync fields
        this.updatePosition();
        this.updateColor();
        this.updateIntensity();
        this.updateRange();
    }

    updatePosition() {
        const pos = this.appLight.position;
        if ((this.threeLight as any).position) {
            (this.threeLight as any).position.set(pos.x, pos.y, pos.z);
        }
    }

    updateColor() {
        const hex = this.appLight.color.toHex();
        if ((this.threeLight as any).color) {
            (this.threeLight as any).color.set(hex);
        }
    }

    updateIntensity() {
        if ((this.threeLight as any).intensity !== undefined) {
            (this.threeLight as any).intensity = this.appLight.intensity;
        }
    }

    updateRange() {
        // for lights that support distance/range
        if ((this.threeLight as any).distance !== undefined) {
            (this.threeLight as any).distance = this.appLight.range;
        }
    }

    updateColorMultiplier() {
        // apply color multiplier by multiplying the color
        this.updateColor();
        if (
            this.appLight.colorMultiplier !== undefined &&
            this.appLight.colorMultiplier !== 1
        ) {
            if ((this.threeLight as any).color) {
                (this.threeLight as any).color.multiplyScalar(
                    this.appLight.colorMultiplier
                );
            }
        }
    }

    setIntensity(i: number) {
        this.appLight.intensity = i;
        this.appLight.markFieldDirty?.("intensity");
        this.updateIntensity();
    }

    setColorHex(hex: string) {
        try {
            const c = new THREE.Color(hex);
            if ((this.threeLight as any).color)
                (this.threeLight as any).color.copy(c);
            this.appLight.color = this.appLight.color?.clone
                ? (this.appLight.color.clone() as any)
                : this.appLight.color;
            this.appLight.markFieldDirty?.("color");
            this.updateColor();
        } catch (e) {
            console.warn("Failed to set light color hex", e);
        }
    }

    dispose() {
        if (this._unsubscribe) this._unsubscribe();
        try {
            (this.threeLight as any).dispose?.();
        } catch (e) {}
    }
}
