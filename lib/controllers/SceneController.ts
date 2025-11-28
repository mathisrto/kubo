import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Scene } from "../class/Scene";
import { AmbientLightController } from "./AmbientLightController";
import { CameraController } from "./CameraController";
import { InfiniteGridHelper } from "./InfiniteGridHelper";
import { LightController } from "./LightController";
import { MaterialController } from "./MaterialController";
import { SceneObjectController } from "./SceneObjectController";
import { SimpleGizmo } from "./SimpleGizmo";

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
    private controls: OrbitControls;
    private selectedObjectId: string | null = null;
    private highlightEdges: THREE.LineSegments | null = null;
    private gridHelper: InfiniteGridHelper;
    private gizmo: SimpleGizmo | null = null;
    private dragStartPosition = new THREE.Vector3();
    private raycaster = new THREE.Raycaster();
    private pointer = new THREE.Vector2();
    private isDraggingGizmo = false;
    private suppressNextSceneClick = false; // évite la désélection juste après un drag du gizmo
    // Gestion du clic vs drag pour la sélection
    private scenePointerDown = new THREE.Vector2();
    private scenePointerUp = new THREE.Vector2();
    private pointerDownTime = 0;
    private pointerMovedDuringClick = false;
    private currentGizmoMode: "translate" | "rotate" | "scale" = "translate";
    private dragStartRotation = new THREE.Vector3();
    private dragStartScale = new THREE.Vector3();

    constructor(container: HTMLElement, scene: Scene) {
        this.scene = new THREE.Scene();
        this.container = container;

        // Use camera from CameraController
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

        // Add InfiniteGridHelper (grille infinie au sol)
        this.gridHelper = new InfiniteGridHelper();
        this.scene.add(this.gridHelper);

        // Setup OrbitControls for camera movement
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.enableDamping = true; // smooth camera movement
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;

        // Initialiser target d'OrbitControls depuis appCamera
        this.controls.target.set(
            scene.camera.target.x,
            scene.camera.target.y,
            scene.camera.target.z
        );

        // Synchroniser OrbitControls → appCamera quand l'utilisateur bouge la caméra
        this.controls.addEventListener("change", () => {
            this.syncOrbitControlsToAppCamera();
        });

        // Gestion séparée pointerdown/move/up pour distinguer clic et drag
        this.renderer.domElement.addEventListener(
            "pointerdown",
            this.onScenePointerDown.bind(this)
        );
        this.renderer.domElement.addEventListener(
            "pointermove",
            this.onScenePointerMove.bind(this)
        );
        this.renderer.domElement.addEventListener(
            "pointerup",
            this.onScenePointerUp.bind(this)
        );

        // Simple gizmo will be created when an object is selected
        // (see setSelectedObject method)
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }

    resize(width: number, height: number) {
        this.renderer.setSize(width, height);
        this.cameraController.resize(width, height);
    }

    /**
     * Handle click on scene - raycast to select objects
     */
    private onScenePointerDown(event: PointerEvent) {
        // Enregistrer position initiale pour détecter drag
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.scenePointerDown.set(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
        this.pointerDownTime = performance.now();
        this.pointerMovedDuringClick = false;
        // S'assurer que les contrôles caméra restent actifs (sauf drag gizmo)
        if (!this.isDraggingGizmo && !this.controls.enabled) {
            this.controls.enabled = true;
        }
    }

    private onScenePointerMove(event: PointerEvent) {
        if (this.isDraggingGizmo) return; // gizmo gère son propre drag
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - this.scenePointerDown.x;
        const dy = y - this.scenePointerDown.y;
        // Seuil de mouvement pour considérer que ce n'est plus un clic (4px)
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            this.pointerMovedDuringClick = true;
        }
        // Maintenir OrbitControls actifs durant les drags de fond
        if (!this.isDraggingGizmo && !this.controls.enabled) {
            this.controls.enabled = true;
        }
    }

    private onScenePointerUp(event: PointerEvent) {
        // Ignorer si on vient juste de terminer un drag gizmo
        if (this.suppressNextSceneClick) {
            this.suppressNextSceneClick = false;
            this.pointerMovedDuringClick = false; // réinitialiser aussi ce flag
            return;
        }
        // Ne pas sélectionner si un drag a eu lieu ou si gizmo actif
        if (this.isDraggingGizmo || this.pointerMovedDuringClick) return;
        const target = event.target as HTMLElement;
        if (!target || target !== this.renderer.domElement) return;

        // Calcul NDC pour raycast
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const meshes = this.objectControllers
            .map((oc) => oc.mesh)
            .filter((m) => m);
        const intersects = this.raycaster.intersectObjects(meshes, false);
        if (intersects.length > 0) {
            const selectedMesh = intersects[0].object as THREE.Mesh;
            const objectController = this.objectControllers.find(
                (oc) => oc.mesh === selectedMesh
            );
            if (objectController) {
                const objectId = (objectController as any).appObject?.id;
                if (objectId) this.setSelectedObject(objectId);
            }
        } else {
            this.setSelectedObject(null);
        }
    }

    /**
     * Get selected object controller
     */
    private getSelectedObjectController(): SceneObjectController | undefined {
        return this.objectControllers.find(
            (oc) => (oc as any).appObject?.id === this.selectedObjectId
        );
    }

    /**
     * Handle gizmo drag start - disable OrbitControls and save start position
     */
    private onGizmoDragStart(
        mode: "translate" | "rotate" | "scale",
        axis: "x" | "y" | "z"
    ) {
        this.isDraggingGizmo = true;
        this.controls.enabled = false;
        this.currentGizmoMode = mode;
        const objectController = this.getSelectedObjectController();
        if (!objectController) return;
        const mesh = objectController.mesh;
        // Store starting transforms
        this.dragStartPosition.copy(mesh.position);
        this.dragStartRotation.set(
            mesh.rotation.x,
            mesh.rotation.y,
            mesh.rotation.z
        );
        this.dragStartScale.set(mesh.scale.x, mesh.scale.y, mesh.scale.z);
    }
    /**
     * Handle gizmo drag - apply transform based on mode
     */
    private onGizmoDrag(
        mode: "translate" | "rotate" | "scale",
        axis: "x" | "y" | "z",
        delta: number
    ) {
        const objectController = this.getSelectedObjectController();
        if (!objectController) return;
        const mesh = objectController.mesh;
        if (mode === "translate") {
            if (axis === "x")
                mesh.position.x = this.dragStartPosition.x + delta;
            else if (axis === "y")
                mesh.position.y = this.dragStartPosition.y + delta;
            else mesh.position.z = this.dragStartPosition.z + delta;
        } else if (mode === "rotate") {
            if (axis === "x")
                mesh.rotation.x = this.dragStartRotation.x + delta;
            else if (axis === "y")
                mesh.rotation.y = this.dragStartRotation.y + delta;
            else mesh.rotation.z = this.dragStartRotation.z + delta;
        } else if (mode === "scale") {
            if (axis === "x")
                mesh.scale.x = Math.max(0.01, this.dragStartScale.x + delta);
            else if (axis === "y")
                mesh.scale.y = Math.max(0.01, this.dragStartScale.y + delta);
            else mesh.scale.z = Math.max(0.01, this.dragStartScale.z + delta);
        }
        mesh.updateMatrix();
        if (this.highlightEdges) {
            this.highlightEdges.position.copy(mesh.position);
            this.highlightEdges.rotation.copy(mesh.rotation);
            this.highlightEdges.scale.copy(mesh.scale);
        }
        if (this.gizmo) this.gizmo.updatePosition(mesh);
    }

    /**
     * Handle gizmo drag end - save position and re-enable OrbitControls
     */
    private async onGizmoDragEnd(mode: "translate" | "rotate" | "scale") {
        this.isDraggingGizmo = false;
        // Empêche l'événement pointerdown qui suit le relâchement de provoquer une désélection
        this.suppressNextSceneClick = true;
        this.controls.enabled = true;

        const objectController = this.getSelectedObjectController();
        if (!objectController) return;

        const mesh = objectController.mesh;
        if (mode === "translate") {
            objectController.setPosition(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            );
        } else if (mode === "rotate") {
            objectController.setRotation(
                mesh.rotation.x,
                mesh.rotation.y,
                mesh.rotation.z
            );
        } else if (mode === "scale") {
            objectController.setScale(mesh.scale.x, mesh.scale.y, mesh.scale.z);
        }

        // Sauvegarder l'objet après modification
        try {
            await (objectController as any).appObject.save();
        } catch (error) {
            console.error(
                "[SceneController] Failed to save object after transform:",
                error
            );
        }
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
                // Utiliser WireframeGeometry pour un meilleur highlight sur toutes les formes
                const wireframe = new THREE.WireframeGeometry(
                    objectController.mesh.geometry
                );
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffff00, // yellow
                    linewidth: 2,
                });
                this.highlightEdges = new THREE.LineSegments(
                    wireframe,
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

                // Create and attach simple gizmo
                if (this.gizmo) {
                    this.gizmo.dispose();
                    this.scene.remove(this.gizmo);
                }

                this.gizmo = new SimpleGizmo(
                    this.camera,
                    this.renderer.domElement
                );
                this.gizmo.updatePosition(objectController.mesh);
                this.gizmo.onDragStart = this.onGizmoDragStart.bind(this);
                this.gizmo.onDrag = this.onGizmoDrag.bind(this);
                this.gizmo.onDragEnd = this.onGizmoDragEnd.bind(this);
                // Apply current gizmo mode if changed earlier
                this.gizmo.setMode(this.currentGizmoMode);
                this.scene.add(this.gizmo);
            }
        } else {
            // Remove gizmo when nothing is selected
            if (this.gizmo) {
                this.gizmo.dispose();
                this.scene.remove(this.gizmo);
                this.gizmo = null;
            }
        }
    }

    /**
     * Public API to change gizmo mode
     */
    public setGizmoMode(mode: "translate" | "rotate" | "scale") {
        this.currentGizmoMode = mode;
        if (this.gizmo) this.gizmo.setMode(mode);
    }

    /**
     * Dispose scene controller and free Three.js resources
     */
    dispose() {
        // stop animation
        if (this.animationId) cancelAnimationFrame(this.animationId);

        // remove event listeners
        try {
            this.renderer.domElement.removeEventListener(
                "pointerdown",
                this.onScenePointerDown.bind(this)
            );
            this.renderer.domElement.removeEventListener(
                "pointermove",
                this.onScenePointerMove.bind(this)
            );
            this.renderer.domElement.removeEventListener(
                "pointerup",
                this.onScenePointerUp.bind(this)
            );
        } catch (e) {}

        // dispose controls
        try {
            this.controls.dispose();
        } catch (e) {}

        // dispose helpers
        try {
            this.gridHelper.dispose();
        } catch (e) {}
        try {
            if (this.gizmo) {
                this.gizmo.dispose();
            }
        } catch (e) {}

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

    /**
     * Synchronize OrbitControls state to appCamera (bidirectional sync)
     * Called on OrbitControls 'change' event
     */
    private syncOrbitControlsToAppCamera(): void {
        const appCamera = this.cameraController.appCamera;

        // Copier position
        appCamera.position = this.camera.position;

        // Copier rotation
        appCamera.rotation = this.camera.rotation;

        // Copier target d'OrbitControls
        appCamera.target = this.controls.target;

        // Marquer comme dirty pour auto-save
        appCamera.markFieldDirty("position");
        appCamera.markFieldDirty("rotation");
        appCamera.markFieldDirty("target");
    }

    /**
     * Synchronize appCamera to OrbitControls (when appCamera changes programmatically)
     */
    public syncAppCameraToOrbitControls(): void {
        const appCamera = this.cameraController.appCamera;

        // Copier position
        this.camera.position.set(
            appCamera.position.x,
            appCamera.position.y,
            appCamera.position.z
        );

        // Copier rotation
        this.camera.rotation.set(
            appCamera.rotation.x,
            appCamera.rotation.y,
            appCamera.rotation.z
        );

        // Copier target
        this.controls.target.set(
            appCamera.target.x,
            appCamera.target.y,
            appCamera.target.z
        );

        this.controls.update();
    }
}
