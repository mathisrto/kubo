import { Material as AppMaterial } from "@/lib/class/Material";
import * as THREE from "three";

/**
 * Controller to bridge application Material model and Three.js material.
 * Keeps a `THREE.MeshStandardMaterial` in sync with the model using per-field subscriptions.
 */
export class MaterialController {
    private appMaterial: AppMaterial;
    private threeMaterial: THREE.MeshStandardMaterial;
    private _unsubscribe?: () => void;

    constructor(appMaterial: AppMaterial) {
        this.appMaterial = appMaterial;
        this.threeMaterial = this.createThreeMaterial(appMaterial);

        // initial sync
        this.updateAlbedo();
        this.updateMetallic();
        this.updateRoughness();
        this.updateAO();
        this.updateEmissive();

        // subscribe to model changes
        const unsubscribes: Array<() => void> = [];
        if (typeof this.appMaterial.onFieldChange === "function") {
            unsubscribes.push(
                this.appMaterial.onFieldChange("albedo", () =>
                    this.updateAlbedo()
                )
            );
            unsubscribes.push(
                this.appMaterial.onFieldChange("metallic", () =>
                    this.updateMetallic()
                )
            );
            unsubscribes.push(
                this.appMaterial.onFieldChange("roughness", () =>
                    this.updateRoughness()
                )
            );
            unsubscribes.push(
                this.appMaterial.onFieldChange("ao", () => this.updateAO())
            );
            unsubscribes.push(
                this.appMaterial.onFieldChange("emissive", () =>
                    this.updateEmissive()
                )
            );
        }
        this._unsubscribe = () => unsubscribes.forEach((u) => u());
    }

    getThreeMaterial(): THREE.Material {
        return this.threeMaterial;
    }

    private createThreeMaterial(appMaterial: AppMaterial) {
        const colorHex = appMaterial.albedo?.toHex?.() ?? "#ffffff";
        const emissiveHex = appMaterial.emissive?.toHex?.() ?? "#000000";

        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(colorHex),
            metalness: appMaterial.metallic ?? 0,
            roughness: appMaterial.roughness ?? 1,
            aoMap: undefined,
            emissive: new THREE.Color(emissiveHex),
        });
    }

    private updateAlbedo() {
        const hex = this.appMaterial.albedo?.toHex?.();
        if (!hex) return;
        try {
            this.threeMaterial.color.set(hex);
        } catch (e) {
            console.warn("Failed to set material color", e);
        }
    }

    private updateMetallic() {
        if ((this.threeMaterial as any).metalness !== undefined) {
            (this.threeMaterial as any).metalness =
                this.appMaterial.metallic ?? 0;
        }
    }

    private updateRoughness() {
        if ((this.threeMaterial as any).roughness !== undefined) {
            (this.threeMaterial as any).roughness =
                this.appMaterial.roughness ?? 1;
        }
    }

    private updateAO() {
        // AO is typically baked into a map; here we expose it as a factor on the material if desired
        // Three.js MeshStandardMaterial doesn't have a direct `ao` scalar, so this is a no-op unless a custom mapping is used.
    }

    private updateEmissive() {
        const hex = this.appMaterial.emissive?.toHex?.();
        if (!hex) return;
        try {
            (this.threeMaterial as any).emissive.set(hex);
        } catch (e) {
            console.warn("Failed to set emissive color", e);
        }
    }

    // Helpers that update model + mark dirty and sync three material
    setAlbedoHex(hex: string) {
        try {
            const c = new THREE.Color(hex);
            this.threeMaterial.color.copy(c);
            // update model (create a ColorType-like object)
            const r = Math.round(c.r * 255);
            const g = Math.round(c.g * 255);
            const b = Math.round(c.b * 255);
            this.appMaterial.albedo = { r, g, b, a: 1 } as any;
            this.appMaterial.markFieldDirty?.("albedo");
        } catch (e) {
            console.warn("Failed to set albedo hex", e);
        }
    }

    setMetallic(v: number) {
        this.appMaterial.metallic = Math.max(0, Math.min(1, v));
        this.appMaterial.markFieldDirty?.("metallic");
        this.updateMetallic();
    }

    setRoughness(v: number) {
        this.appMaterial.roughness = Math.max(0, Math.min(1, v));
        this.appMaterial.markFieldDirty?.("roughness");
        this.updateRoughness();
    }

    setEmissiveHex(hex: string) {
        try {
            const c = new THREE.Color(hex);
            (this.threeMaterial as any).emissive.copy(c);
            const r = Math.round(c.r * 255);
            const g = Math.round(c.g * 255);
            const b = Math.round(c.b * 255);
            this.appMaterial.emissive = { r, g, b, a: 1 } as any;
            this.appMaterial.markFieldDirty?.("emissive");
        } catch (e) {
            console.warn("Failed to set emissive hex", e);
        }
    }

    dispose() {
        if (this._unsubscribe) this._unsubscribe();
        try {
            this.threeMaterial.dispose();
        } catch (e) {}
    }
}
