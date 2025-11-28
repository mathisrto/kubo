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
                material = new THREE.MeshStandardMaterial({
                    color: 0xdddddd,
                    side: THREE.DoubleSide,
                });
            }
        } else {
            material = new THREE.MeshStandardMaterial({
                color: 0xdddddd,
                side: THREE.DoubleSide,
            });
        }

        this.mesh = new THREE.Mesh(this.geometry, material);

        // Initial transform
        this.updatePosition();
        this.updateRotation();
        this.updateScale();

        // Update matrices after setting transform
        this.mesh.updateMatrix();
        this.mesh.updateMatrixWorld(true);

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
        // Skip updates during TransformControls drag
        if ((this as any)._suspendUpdates) return;

        try {
            const p: any = this.appObject.positionVector;
            this.mesh.position.set(p.x ?? 0, p.y ?? 0, p.z ?? 0);
        } catch (e) {
            this.mesh.position.set(0, 0, 0);
        }
        // Update matrices after position change
        this.mesh.updateMatrix();
    }

    private updateRotation() {
        // Skip updates during TransformControls drag
        if ((this as any)._suspendUpdates) return;

        try {
            const r: any = this.appObject.rotationVector;
            this.mesh.rotation.set(r.x ?? 0, r.y ?? 0, r.z ?? 0);
        } catch (e) {
            this.mesh.rotation.set(0, 0, 0);
        }
        // Update matrices after rotation change
        this.mesh.updateMatrix();
    }

    private updateScale() {
        // Skip updates during TransformControls drag
        if ((this as any)._suspendUpdates) return;

        try {
            const s: any = this.appObject.scaleVector;
            this.mesh.scale.set(s.x ?? 1, s.y ?? 1, s.z ?? 1);
        } catch (e) {
            this.mesh.scale.set(1, 1, 1);
        }
        // Update matrices after scale change
        this.mesh.updateMatrix();
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

    getPosition() {
        return this.mesh.position;
    }

    getRotation() {
        return this.mesh.rotation;
    }

    getScale() {
        return this.mesh.scale;
    }

    /**
     * Update position in the model (will trigger reactive update)
     */
    setPosition(x: number, y: number, z: number) {
        const pos = this.appObject.positionVector;
        pos.x = x;
        pos.y = y;
        pos.z = z;
        (this.appObject as any).markFieldDirty("position");
    }

    /**
     * Update rotation in the model (will trigger reactive update)
     */
    setRotation(x: number, y: number, z: number) {
        const rot = this.appObject.rotationVector;
        rot.x = x;
        rot.y = y;
        rot.z = z;
        (this.appObject as any).markFieldDirty("rotation");
    }

    /**
     * Update scale in the model (will trigger reactive update)
     */
    setScale(x: number, y: number, z: number) {
        const scale = this.appObject.scaleVector;
        scale.x = x;
        scale.y = y;
        scale.z = z;
        (this.appObject as any).markFieldDirty("scale");
    }

    setMaterialId(
        id: string,
        resolve?: (id: string) => MaterialController | undefined
    ) {
        this.appObject.materialId = id as string;
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
