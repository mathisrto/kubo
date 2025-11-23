import * as THREE from "three";
import { Scene } from "../class/Scene";
import { AmbientLightController } from "./AmbientLightController";
import { CameraController } from "./CameraController";
import { LightController } from "./LightController";
import { MaterialController } from "./MaterialController";
import { SceneObjectController } from "./SceneObjectController";

export class SceneController {
    scene: THREE.Scene;
    camera: THREE.Camera;
    ambientLight: THREE.AmbientLight;

    ambientLightController: AmbientLightController;
    lightControllers: LightController[] = [];
    materialControllers: Map<string, MaterialController> = new Map();
    objectControllers: SceneObjectController[] = [];

    renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private animationId?: number;

    cameraController: CameraController;
    private selectedObjectId: string | null = null;
    private highlightEdges: THREE.LineSegments | null = null;

    constructor(container: HTMLElement, scene: Scene) {
        this.scene = new THREE.Scene();
        this.container = container;

        this.camera = new THREE.PerspectiveCamera(
            180,
            container.clientWidth / container.clientHeight,
            0.1,
            5000
        );

        console.log("SceneController initialized", scene);

        this.cameraController = new CameraController(scene.camera);
        this.camera = this.cameraController.getThreeCamera();

        // Ambient light via controller (syncs with app model)
        this.ambientLightController = new AmbientLightController(
            scene.ambientLight
        );
        this.ambientLight = this.ambientLightController.getThreeLight();
        this.scene.add(this.ambientLight);

        // Add scene lights via LightController
        if (Array.isArray(scene.lights)) {
            this.lightControllers = scene.lights.map(
                (l) => new LightController(l)
            );
            for (const lc of this.lightControllers) {
                try {
                    this.scene.add(lc.getThreeLight());
                } catch (e) {
                    console.warn("Failed to add light to scene", e);
                }
            }
        }

        // Materials -> MaterialController
        if (Array.isArray(scene.materials)) {
            for (const m of scene.materials) {
                try {
                    const mc = new MaterialController(m);
                    if (m.id) {
                        this.materialControllers.set(m.id, mc);
                    }
                } catch (e) {
                    console.warn("Failed to create MaterialController", e);
                }
            }
        }

        // Scene objects -> SceneObjectController (resolve material controllers by id)
        if (Array.isArray(scene.objects)) {
            this.objectControllers = scene.objects.map(
                (o) =>
                    new SceneObjectController(o, (id) =>
                        this.materialControllers.get(id)
                    )
            );
            for (const oc of this.objectControllers) {
                try {
                    this.scene.add(oc.mesh);
                } catch (e) {
                    console.warn("Failed to add object mesh to scene", e);
                }
            }
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.renderer.render(this.scene, this.camera);
    }

    resize(width: number, height: number) {
        this.renderer.setSize(width, height);
        this.cameraController.resize(width, height);
    }

    /**
     * Set selected object and update highlight
     */
    setSelectedObject(objectId: string | null) {
        // Remove previous highlight
        if (this.highlightEdges) {
            this.scene.remove(this.highlightEdges);
            this.highlightEdges.geometry.dispose();
            (this.highlightEdges.material as THREE.Material).dispose();
            this.highlightEdges = null;
        }

        this.selectedObjectId = objectId;

        // Add new highlight if object selected
        if (objectId) {
            const objectController = this.objectControllers.find(
                (oc) => (oc as any).appObject?.id === objectId
            );

            if (objectController && objectController.mesh) {
                // Create edges geometry from the mesh geometry
                const edges = new THREE.EdgesGeometry(
                    objectController.mesh.geometry,
                    30 // angle threshold in degrees
                );
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffff00, // yellow
                    linewidth: 2,
                });
                this.highlightEdges = new THREE.LineSegments(
                    edges,
                    lineMaterial
                );

                // Copy transform from the mesh
                this.highlightEdges.position.copy(
                    objectController.mesh.position
                );
                this.highlightEdges.rotation.copy(
                    objectController.mesh.rotation
                );
                this.highlightEdges.scale.copy(objectController.mesh.scale);

                this.scene.add(this.highlightEdges);
            }
        }
    }

    /**
     * Dispose scene controller and free Three.js resources
     */
    dispose() {
        // stop animation
        if (this.animationId) cancelAnimationFrame(this.animationId);

        // dispose controllers
        try {
            this.cameraController.dispose?.();
        } catch (e) {}
        try {
            this.ambientLightController.dispose?.();
        } catch (e) {}
        try {
            for (const lc of this.lightControllers) lc.dispose?.();
        } catch (e) {}
        try {
            for (const mc of this.materialControllers.values()) mc.dispose?.();
        } catch (e) {}
        try {
            for (const oc of this.objectControllers) oc.dispose?.();
        } catch (e) {}

        // dispose renderer
        try {
            this.renderer.dispose();
        } catch (e) {}

        // remove canvas from DOM
        try {
            const canvas = this.renderer.domElement;
            if (canvas && canvas.parentElement === this.container) {
                this.container.removeChild(canvas);
            }
        } catch (e) {}
    }
}
