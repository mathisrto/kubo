import { Camera as AppCamera } from "@/lib/class/Camera";
import * as THREE from "three";
import { CAMERA_TYPES } from "../constants";

export class CameraController {
    private appCamera: AppCamera;
    private threeCamera: THREE.Camera;

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

        // initial sync
        this.updateThreeCamera();

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

    /**
     * Synchronise toute la caméra ThreeJS avec le modèle
     */
    private updateThreeCamera() {
        const pos = this.appCamera.position;
        const rot = this.appCamera.rotation;

        this.threeCamera.position.set(pos.x, pos.y, pos.z);

        if (
            this.threeCamera instanceof THREE.PerspectiveCamera ||
            this.threeCamera instanceof THREE.OrthographicCamera
        ) {
            this.threeCamera.rotation.set(rot.x, rot.y, rot.z);
        }

        if (this.threeCamera instanceof THREE.PerspectiveCamera) {
            this.threeCamera.fov = this.appCamera.fov;
        }

        if (this.threeCamera instanceof THREE.OrthographicCamera) {
            // Pour l'orthographic, on peut recalculer left/right/top/bottom si nécessaire
            const aspect = window.innerWidth / window.innerHeight;
            const frustumHeight = 10;
            const frustumWidth = frustumHeight * aspect;
            this.threeCamera.left = -frustumWidth / 2;
            this.threeCamera.right = frustumWidth / 2;
            this.threeCamera.top = frustumHeight / 2;
            this.threeCamera.bottom = -frustumHeight / 2;
        }

        if (
            this.threeCamera instanceof THREE.PerspectiveCamera ||
            this.threeCamera instanceof THREE.OrthographicCamera
        ) {
            this.threeCamera.near = this.appCamera.near;
            this.threeCamera.far = this.appCamera.far;
            this.threeCamera.updateProjectionMatrix();
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
}
