import * as THREE from "three";
import { Scene } from "../class/Scene";
import { CameraController } from "./CameraController";

export class SceneController {
    scene: THREE.Scene;
    camera: THREE.Camera;
    ambientLight: THREE.AmbientLight;

    renderer: THREE.WebGLRenderer;
    cube: THREE.Mesh;

    cameraController: CameraController;

    constructor(container: HTMLElement, scene: Scene) {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            180,
            container.clientWidth / container.clientHeight,
            0.1,
            5000
        );

        console.log("SceneController initialized", scene);

        this.cameraController = new CameraController(scene.camera);
        this.camera = this.cameraController.getThreeCamera();

        this.ambientLight = new THREE.AmbientLight(0x00ff00, 10);
        this.scene.add(this.ambientLight);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    resize(width: number, height: number) {
        this.renderer.setSize(width, height);
        this.cameraController.resize(width, height);
    }
}
