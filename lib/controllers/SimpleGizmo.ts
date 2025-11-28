import * as THREE from "three";

/**
 * Simple gizmo with clickable arrows for incremental transform
 * Like Blender/Unity but simpler - just click arrows to move by steps
 */
export class SimpleGizmo extends THREE.Group {
    private mode: "translate" | "rotate" | "scale" = "translate";
    private arrowX: THREE.Group;
    private arrowY: THREE.Group;
    private arrowZ: THREE.Group;

    private raycaster: THREE.Raycaster;
    private pointer: THREE.Vector2;

    // Drag state
    private isDragging = false;
    private activeAxis: "x" | "y" | "z" | null = null;
    private pendingAxis: "x" | "y" | "z" | null = null; // axis candidat avant validation du drag
    private dragStartPointer = new THREE.Vector2();
    private dragStartPosition = new THREE.Vector3();
    private readonly activationThreshold = 0.01; // distance NDC avant de confirmer le drag
    private dragPlane = new THREE.Plane();
    private dragStartPoint3D = new THREE.Vector3();
    private dragOffset = 0;

    public onDragStart?: (
        mode: "translate" | "rotate" | "scale",
        axis: "x" | "y" | "z"
    ) => void;
    public onDrag?: (
        mode: "translate" | "rotate" | "scale",
        axis: "x" | "y" | "z",
        delta: number
    ) => void;
    public onDragEnd?: (mode: "translate" | "rotate" | "scale") => void;

    // Extra groups for rotation & scale
    // We séparate les listes pour limiter le raycast uniquement aux handles actifs du mode courant
    private translateHandles: THREE.Mesh[] = [];
    private rotationRings: THREE.Mesh[] = [];
    private scaleCubes: THREE.Mesh[] = [];

    // Références des handlers pour cleanup correct
    private boundPointerDown: (e: PointerEvent) => void;
    private boundPointerMove: (e: PointerEvent) => void;
    private boundPointerUp: (e: PointerEvent) => void;

    constructor(private camera: THREE.Camera, private domElement: HTMLElement) {
        super();

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        // Create arrow for X axis (red)
        this.arrowX = this.createArrow(0xff0000, new THREE.Vector3(1, 0, 0));
        this.add(this.arrowX);

        // Create arrow for Y axis (green)
        this.arrowY = this.createArrow(0x00ff00, new THREE.Vector3(0, 1, 0));
        this.add(this.arrowY);

        // Create arrow for Z axis (blue)
        this.arrowZ = this.createArrow(0x0000ff, new THREE.Vector3(0, 0, 1));
        this.add(this.arrowZ);

        // Build extra handles
        this.buildRotationRings();
        this.buildScaleCubes();
        this.updateVisibility();

        // Bind handlers une seule fois pour pouvoir les retirer
        this.boundPointerDown = this.onPointerDown.bind(this);
        this.boundPointerMove = this.onPointerMove.bind(this);
        this.boundPointerUp = this.onPointerUp.bind(this);

        // Add drag handlers
        this.domElement.addEventListener("pointerdown", this.boundPointerDown);
        this.domElement.addEventListener("pointermove", this.boundPointerMove);
        this.domElement.addEventListener("pointerup", this.boundPointerUp);
    }

    private createArrow(color: number, direction: THREE.Vector3): THREE.Group {
        // Arrow shaft (cylinder)
        const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const shaftMaterial = new THREE.MeshBasicMaterial({ color });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

        // Arrow head (cone)
        const headGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
        const head = new THREE.Mesh(headGeometry, shaftMaterial);
        head.position.y = 0.65;

        // Combine shaft and head into a group
        const arrowGroup = new THREE.Group();
        arrowGroup.add(shaft);
        arrowGroup.add(head);

        // Rotate arrow to point in the correct direction
        if (direction.x !== 0) {
            arrowGroup.rotation.z = -Math.PI / 2;
        } else if (direction.z !== 0) {
            arrowGroup.rotation.x = Math.PI / 2;
        }

        // Position arrow along its axis
        const offset = direction.clone().multiplyScalar(0.75);
        arrowGroup.position.copy(offset);

        // Create invisible clickable box for raycasting
        const clickableGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const clickableMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            visible: false,
        });
        const clickable = new THREE.Mesh(clickableGeometry, clickableMaterial);
        clickable.position.set(0, 0, 0); // local to arrow group

        // Store axis info for raycasting
        (clickable as any).userData = {
            axis: direction.x !== 0 ? "x" : direction.y !== 0 ? "y" : "z",
            direction: 1,
            handleType: "translate",
        };

        // Enregistrer ce mesh invisible dans la liste des handles de translation
        this.translateHandles.push(clickable);

        arrowGroup.add(clickable);

        return arrowGroup;
    }

    private buildRotationRings() {
        const ringConfigs: Array<{
            axis: "x" | "y" | "z";
            color: number;
            rotation: THREE.Euler;
        }> = [
            { axis: "x", color: 0xff0000, rotation: new THREE.Euler(0, 0, 0) },
            { axis: "y", color: 0x00ff00, rotation: new THREE.Euler(0, 0, 0) },
            { axis: "z", color: 0x0000ff, rotation: new THREE.Euler(0, 0, 0) },
        ];
        for (const cfg of ringConfigs) {
            const geom = new THREE.TorusGeometry(0.9, 0.015, 8, 64);
            const mat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                transparent: true,
                opacity: 0.6,
            });
            const ring = new THREE.Mesh(geom, mat);
            // Orient ring so its normal aligns with axis
            if (cfg.axis === "x") {
                ring.rotation.y = Math.PI / 2;
            } else if (cfg.axis === "y") {
                ring.rotation.x = Math.PI / 2;
            } // z stays default (lying in XY plane)
            (ring as any).userData = { axis: cfg.axis, handleType: "rotate" };
            this.rotationRings.push(ring);
            this.add(ring);
        }
    }

    private buildScaleCubes() {
        const cubeConfigs: Array<{
            axis: "x" | "y" | "z";
            color: number;
            position: THREE.Vector3;
        }> = [
            {
                axis: "x",
                color: 0xff0000,
                position: new THREE.Vector3(1.1, 0, 0),
            },
            {
                axis: "y",
                color: 0x00ff00,
                position: new THREE.Vector3(0, 1.1, 0),
            },
            {
                axis: "z",
                color: 0x0000ff,
                position: new THREE.Vector3(0, 0, 1.1),
            },
        ];
        for (const cfg of cubeConfigs) {
            const geom = new THREE.BoxGeometry(0.15, 0.15, 0.15);
            const mat = new THREE.MeshBasicMaterial({ color: cfg.color });
            const cube = new THREE.Mesh(geom, mat);
            cube.position.copy(cfg.position);
            (cube as any).userData = { axis: cfg.axis, handleType: "scale" };
            this.scaleCubes.push(cube);
            this.add(cube);
        }
    }

    private updateVisibility() {
        // Translate mode: show arrows only
        const showTranslate = this.mode === "translate";
        this.arrowX.visible = showTranslate;
        this.arrowY.visible = showTranslate;
        this.arrowZ.visible = showTranslate;

        const showRotate = this.mode === "rotate";
        for (const r of this.rotationRings) r.visible = showRotate;

        const showScale = this.mode === "scale";
        for (const c of this.scaleCubes) c.visible = showScale;
    }

    public setMode(mode: "translate" | "rotate" | "scale") {
        if (this.mode === mode) return;
        this.mode = mode;
        this.updateVisibility();
    }

    private updatePointer(event: PointerEvent) {
        const rect = this.domElement.getBoundingClientRect();
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    private onPointerDown(event: PointerEvent) {
        if (this.isDragging) return;
        this.updatePointer(event);
        let activeHandles: THREE.Object3D[] = [];
        if (this.mode === "translate") activeHandles = this.translateHandles;
        else if (this.mode === "rotate") activeHandles = this.rotationRings;
        else if (this.mode === "scale") activeHandles = this.scaleCubes;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(activeHandles, true);
        if (intersects.length > 0) {
            const first = intersects[0];
            const userData = first.object.userData;
            if (userData && userData.axis) {
                // Stocker comme axe potentiel, sans démarrer le drag
                this.pendingAxis = userData.axis;
                this.dragStartPointer.copy(this.pointer);
                this.dragStartPosition.copy(this.position);
                // On ne stoppe pas la propagation ici pour permettre au click scène de passer si pas de drag
            }
        }
    }

    private onPointerMove(event: PointerEvent) {
        this.updatePointer(event);
        // Activer le drag seulement après dépassement du seuil si axe en attente
        if (!this.isDragging && this.pendingAxis) {
            const dx = this.pointer.x - this.dragStartPointer.x;
            const dy = this.pointer.y - this.dragStartPointer.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 >= this.activationThreshold * this.activationThreshold) {
                this.isDragging = true;
                this.activeAxis = this.pendingAxis;
                this.pendingAxis = null;

                // Configurer le plan de drag perpendiculaire à la vue caméra
                const cameraDir = new THREE.Vector3();
                this.camera.getWorldDirection(cameraDir);
                this.dragPlane.setFromNormalAndCoplanarPoint(
                    cameraDir,
                    this.position
                );

                // Trouver le point 3D initial sur le plan
                this.raycaster.setFromCamera(
                    this.dragStartPointer,
                    this.camera
                );
                this.raycaster.ray.intersectPlane(
                    this.dragPlane,
                    this.dragStartPoint3D
                );
                this.dragOffset = 0;

                if (this.onDragStart && this.activeAxis) {
                    this.onDragStart(this.mode, this.activeAxis);
                }
                event.stopPropagation();
                event.preventDefault();
            }
        }
        if (!this.isDragging || !this.activeAxis) return;

        // Raycast sur le plan de drag pour obtenir la position 3D actuelle
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const currentPoint3D = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.dragPlane, currentPoint3D);

        if (!currentPoint3D) return;

        // Calculer le vecteur de mouvement 3D
        const movement3D = currentPoint3D.clone().sub(this.dragStartPoint3D);

        // Projeter sur l'axe actif
        const worldAxis = new THREE.Vector3();
        if (this.activeAxis === "x") worldAxis.set(1, 0, 0);
        else if (this.activeAxis === "y") worldAxis.set(0, 1, 0);
        else worldAxis.set(0, 0, 1);

        // Distance projetée sur l'axe
        const delta = movement3D.dot(worldAxis);

        let modeDelta = delta;
        if (this.mode === "rotate") modeDelta = delta * 0.5;
        else if (this.mode === "scale") modeDelta = delta * 0.3;

        if (this.onDrag && this.activeAxis)
            this.onDrag(this.mode, this.activeAxis, modeDelta);
        event.stopPropagation();
        event.preventDefault();
    }

    private onPointerUp(event: PointerEvent) {
        if (this.isDragging) {
            this.isDragging = false;
            const wasActive = this.activeAxis !== null;
            this.activeAxis = null;
            if (wasActive && this.onDragEnd) this.onDragEnd(this.mode);
            if (wasActive) {
                event.stopPropagation();
                event.preventDefault();
            }
        } else if (this.pendingAxis) {
            // Clic simple sur handle sans drag => laisser la sélection scène fonctionner
            this.pendingAxis = null;
        }
    }

    /**
     * Update gizmo position to follow target object
     */
    updatePosition(target: THREE.Object3D) {
        this.position.copy(target.position);
    }

    /**
     * Cleanup
     */
    dispose() {
        this.domElement.removeEventListener(
            "pointerdown",
            this.boundPointerDown
        );
        this.domElement.removeEventListener(
            "pointermove",
            this.boundPointerMove
        );
        this.domElement.removeEventListener("pointerup", this.boundPointerUp);

        this.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach((m) => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}
