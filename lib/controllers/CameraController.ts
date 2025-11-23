import { Camera as AppCamera } from "@/lib/class/Camera";
import * as THREE from "three";
import { CAMERA_TYPES } from "../constants";

export class CameraController {
    private appCamera: AppCamera;
    private threeCamera: THREE.Camera;
    private _unsubscribe?: () => void;

    constructor(appCamera: AppCamera) {
        this.appCamera = appCamera;
        this.threeCamera = this.createThreeCamera(appCamera);

        this.threeCamera.position.set(
            appCamera.position.x,
            appCamera.position.y,
            appCamera.position.z
        );

        this.threeCamera.rotation.set(
            appCamera.rotation.x,
            appCamera.rotation.y,
            appCamera.rotation.z
        );

        // initial sync (per-field)
        this.updatePosition();
        this.updateRotation();
        this.updateFov();
        this.updateNearFar();

        // subscribe to model changes and update three camera accordingly
        const unsubscribes: Array<() => void> = [];
        if (typeof this.appCamera.onFieldChange === "function") {
            unsubscribes.push(
                this.appCamera.onFieldChange("fov", () => this.updateFov())
            );
            unsubscribes.push(
                this.appCamera.onFieldChange("near", () => this.updateNearFar())
            );
            unsubscribes.push(
                this.appCamera.onFieldChange("far", () => this.updateNearFar())
            );
            unsubscribes.push(
                this.appCamera.onFieldChange("position", () =>
                    this.updatePosition()
                )
            );
            unsubscribes.push(
                this.appCamera.onFieldChange("rotation", () =>
                    this.updateRotation()
                )
            );
            // recreate camera when type changes
            unsubscribes.push(
                this.appCamera.onFieldChange("type", () => {
                    this.threeCamera = this.createThreeCamera(this.appCamera);
                    // after recreating, sync per-field
                    this.updatePosition();
                    this.updateRotation();
                    this.updateFov();
                    this.updateNearFar();
                })
            );
        }
        this._unsubscribe = () => unsubscribes.forEach((u) => u());

        console.log("CameraController initialized", this.threeCamera);
    }

    /**
     * Crée la caméra ThreeJS en fonction du type défini dans AppCamera
     */
    private createThreeCamera(appCamera: AppCamera): THREE.Camera {
        switch (appCamera.type) {
            case CAMERA_TYPES.PERSPECTIVE:
                return new THREE.PerspectiveCamera(
                    appCamera.fov,
                    window.innerWidth / window.innerHeight,
                    appCamera.near,
                    appCamera.far
                );
            case CAMERA_TYPES.ORTHOGRAPHIC:
                // valeurs par défaut pour l'orthographic
                const aspect = window.innerWidth / window.innerHeight;
                const frustumHeight = 10;
                const frustumWidth = frustumHeight * aspect;
                return new THREE.OrthographicCamera(
                    -frustumWidth / 2,
                    frustumWidth / 2,
                    frustumHeight / 2,
                    -frustumHeight / 2,
                    appCamera.near,
                    appCamera.far
                );
            default:
                throw new Error(`Unknown camera type: ${appCamera.type}`);
        }
    }

    /**
     * Retourne la caméra ThreeJS à utiliser dans la scène
     */
    getThreeCamera(): THREE.Camera {
        return this.threeCamera;
    }

    // (Removed full-sync method; controllers now react per-field.)

    /**
     * Update only the FOV on the three camera (if perspective)
     */
    updateFov() {
        if (this.threeCamera instanceof THREE.PerspectiveCamera) {
            this.threeCamera.fov = this.appCamera.fov;
            this.threeCamera.updateProjectionMatrix();
        }
    }

    /**
     * Update only near/far on the three camera
     */
    updateNearFar() {
        if (
            this.threeCamera instanceof THREE.PerspectiveCamera ||
            this.threeCamera instanceof THREE.OrthographicCamera
        ) {
            this.threeCamera.near = this.appCamera.near;
            this.threeCamera.far = this.appCamera.far;
            if (this.threeCamera instanceof THREE.OrthographicCamera) {
                const aspect = window.innerWidth / window.innerHeight;
                const frustumHeight = 10;
                const frustumWidth = frustumHeight * aspect;
                this.threeCamera.left = -frustumWidth / 2;
                this.threeCamera.right = frustumWidth / 2;
                this.threeCamera.top = frustumHeight / 2;
                this.threeCamera.bottom = -frustumHeight / 2;
            }
            this.threeCamera.updateProjectionMatrix();
        }
    }

    /**
     * Update only the position on the three camera
     */
    updatePosition() {
        const pos = this.appCamera.position;
        this.threeCamera.position.set(pos.x, pos.y, pos.z);
    }

    /**
     * Update only the rotation on the three camera
     */
    updateRotation() {
        const rot = this.appCamera.rotation;
        if (
            this.threeCamera instanceof THREE.PerspectiveCamera ||
            this.threeCamera instanceof THREE.OrthographicCamera
        ) {
            this.threeCamera.rotation.set(rot.x, rot.y, rot.z);
        }
    }

    /**
     * Met à jour l'aspect ratio lors du resize
     */
    resize(width: number, height: number) {
        if (this.threeCamera instanceof THREE.PerspectiveCamera) {
            this.threeCamera.aspect = width / height;
            this.threeCamera.updateProjectionMatrix();
        } else if (this.threeCamera instanceof THREE.OrthographicCamera) {
            const frustumHeight = 10;
            const frustumWidth = frustumHeight * (width / height);
            this.threeCamera.left = -frustumWidth / 2;
            this.threeCamera.right = frustumWidth / 2;
            this.threeCamera.top = frustumHeight / 2;
            this.threeCamera.bottom = -frustumHeight / 2;
            this.threeCamera.updateProjectionMatrix();
        }
    }

    /**
     * Dispose subscriptions when controller is no longer used
     */
    dispose() {
        if (this._unsubscribe) this._unsubscribe();
    }
}
