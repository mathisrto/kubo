import { SceneObject } from "@/lib/class/SceneObject";
import * as THREE from "three";
import { MaterialController } from "./MaterialController";

/**
 * Controller for a SceneObject model. Creates a THREE.Mesh from vertices/indices
 * and keeps transform/material in sync using per-field subscriptions.
 *
 * Optional `resolveMaterialController` can be provided to map `materialId` -> MaterialController
 * (typically from SceneController which knows the available materials).
 */
export class SceneObjectController {
    private appObject: SceneObject;
    mesh: THREE.Mesh;
    private geometry: THREE.BufferGeometry;
    private materialController?: MaterialController;
    private _unsubscribe?: () => void;

    constructor(
        appObject: SceneObject,
        resolveMaterialController?: (
            id: string
        ) => MaterialController | undefined
    ) {
        this.appObject = appObject;

        // build geometry
        this.geometry = new THREE.BufferGeometry();
        const verts = this.appObject.vertices || [];
        const positions = new Float32Array(verts.length * 3);
        for (let i = 0; i < verts.length; i++) {
            const v: any = verts[i];
            positions[i * 3 + 0] = v.x;
            positions[i * 3 + 1] = v.y;
            positions[i * 3 + 2] = v.z;
        }
        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        if (
            Array.isArray(this.appObject.indices) &&
            this.appObject.indices.length > 0
        ) {
            this.geometry.setIndex(this.appObject.indices);
        }

        this.geometry.computeVertexNormals();

        // material: either from provided material controller or fallback
        let material: THREE.Material;
        if (resolveMaterialController && this.appObject.materialId) {
            const mc = resolveMaterialController(this.appObject.materialId);
            if (mc) {
                this.materialController = mc;
                material = mc.getThreeMaterial() as THREE.Material;
            } else {
                material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
            }
        } else {
            material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        }

        this.mesh = new THREE.Mesh(this.geometry, material);

        // initial transform
        this.updatePosition();
        this.updateRotation();
        this.updateScale();

        // subscribe to model changes
        const unsubscribes: Array<() => void> = [];
        if (typeof this.appObject.onFieldChange === "function") {
            unsubscribes.push(
                this.appObject.onFieldChange("position", () =>
                    this.updatePosition()
                )
            );
            unsubscribes.push(
                this.appObject.onFieldChange("rotation", () =>
                    this.updateRotation()
                )
            );
            unsubscribes.push(
                this.appObject.onFieldChange("scale", () => this.updateScale())
            );
            unsubscribes.push(
                this.appObject.onFieldChange("materialId", () =>
                    this.updateMaterial(resolveMaterialController)
                )
            );
            unsubscribes.push(
                this.appObject.onFieldChange("name", () => {
                    this.mesh.name = this.appObject.name;
                })
            );
        }
        this._unsubscribe = () => unsubscribes.forEach((u) => u());
    }

    private updatePosition() {
        try {
            const p: any = this.appObject.positionVector;
            this.mesh.position.set(p.x, p.y, p.z);
        } catch (e) {}
    }

    private updateRotation() {
        try {
            const r: any = this.appObject.rotationVector;
            this.mesh.rotation.set(r.x, r.y, r.z);
        } catch (e) {}
    }

    private updateScale() {
        try {
            const s: any = this.appObject.scaleVector;
            this.mesh.scale.set(s.x, s.y, s.z);
        } catch (e) {}
    }

    private updateMaterial(
        resolve?: (id: string) => MaterialController | undefined
    ) {
        // detach previous non-controller material
        try {
            if (this.materialController == null) {
                const mat = this.mesh.material as THREE.Material;
                mat.dispose?.();
            }
        } catch (e) {}

        if (resolve && this.appObject.materialId) {
            const mc = resolve(this.appObject.materialId);
            if (mc) {
                this.materialController = mc;
                this.mesh.material = mc.getThreeMaterial() as THREE.Material;
                return;
            }
        }

        // fallback material
        this.materialController = undefined;
        this.mesh.material = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
        });
    }

    // helpers (update model + mark dirty)
    setPosition(x: number, y: number, z: number) {
        this.appObject.positionVector = { x, y, z } as any;
        this.appObject.markFieldDirty?.("position");
        this.updatePosition();
    }

    setRotation(x: number, y: number, z: number) {
        this.appObject.rotationVector = { x, y, z } as any;
        this.appObject.markFieldDirty?.("rotation");
        this.updateRotation();
    }

    setScale(x: number, y: number, z: number) {
        this.appObject.scaleVector = { x, y, z } as any;
        this.appObject.markFieldDirty?.("scale");
        this.updateScale();
    }

    setMaterialId(
        id: string,
        resolve?: (id: string) => MaterialController | undefined
    ) {
        this.appObject.materialId = id as any;
        this.appObject.markFieldDirty?.("materialId");
        this.updateMaterial(resolve);
    }

    dispose() {
        if (this._unsubscribe) this._unsubscribe();
        try {
            // if material is standalone, dispose it
            if (!this.materialController) {
                const m = this.mesh.material as THREE.Material;
                m.dispose?.();
            }
        } catch (e) {}
        try {
            this.geometry.dispose();
        } catch (e) {}
    }
}
