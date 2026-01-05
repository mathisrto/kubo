import {
    updateCameraFar,
    updateCameraFOV,
    updateCameraNear,
    updateCameraPosition,
    updateCameraTarget,
    updateCameraType,
} from "@/src/core/ecs/engine/cameraEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";
import { CameraType } from "@/src/types";

describe("cameraEngine", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("updateCameraPosition", () => {
        it("met à jour la position de la caméra", () => {
            const newPosition = { x: 10, y: 15, z: 20 };

            updateCameraPosition(world, newPosition);

            expect(world.camera.position).toEqual(newPosition);
        });

        it("lance une erreur si la caméra n'existe pas", () => {
            const worldWithoutCamera = { ...world, camera: undefined } as any;

            expect(() =>
                updateCameraPosition(worldWithoutCamera, { x: 0, y: 0, z: 0 })
            ).toThrow("Camera is not initialized in world");
        });

        it("accepte des valeurs négatives", () => {
            updateCameraPosition(world, { x: -5, y: -10, z: -15 });

            expect(world.camera.position).toEqual({ x: -5, y: -10, z: -15 });
        });
    });

    describe("updateCameraTarget", () => {
        it("met à jour la cible de la caméra", () => {
            const newTarget = { x: 5, y: 10, z: 15 };

            updateCameraTarget(world, newTarget);

            expect(world.camera.target).toEqual(newTarget);
        });

        it("lance une erreur si la caméra n'existe pas", () => {
            const worldWithoutCamera = { ...world, camera: undefined } as any;

            expect(() =>
                updateCameraTarget(worldWithoutCamera, { x: 0, y: 0, z: 0 })
            ).toThrow("Camera is not initialized in world");
        });

        it("accepte des valeurs négatives", () => {
            updateCameraTarget(world, { x: -2, y: -3, z: -4 });

            expect(world.camera.target).toEqual({ x: -2, y: -3, z: -4 });
        });
    });

    describe("updateCameraFOV", () => {
        it("met à jour le FOV de la caméra", () => {
            updateCameraFOV(world, 60);

            expect(world.camera.fov).toBe(60);
        });

        it("lance une erreur si le FOV est 0", () => {
            expect(() => updateCameraFOV(world, 0)).toThrow("Invalid FOV: 0");
        });

        it("lance une erreur si le FOV est négatif", () => {
            expect(() => updateCameraFOV(world, -10)).toThrow(
                "Invalid FOV: -10"
            );
        });

        it("lance une erreur si le FOV est >= 180", () => {
            expect(() => updateCameraFOV(world, 180)).toThrow(
                "Invalid FOV: 180"
            );
            expect(() => updateCameraFOV(world, 200)).toThrow(
                "Invalid FOV: 200"
            );
        });

        it("lance une erreur si le FOV n'est pas un nombre fini", () => {
            expect(() => updateCameraFOV(world, NaN)).toThrow("Invalid FOV");
            expect(() => updateCameraFOV(world, Infinity)).toThrow(
                "Invalid FOV"
            );
        });

        it("accepte des valeurs limites valides", () => {
            updateCameraFOV(world, 0.1);
            expect(world.camera.fov).toBe(0.1);

            updateCameraFOV(world, 179.9);
            expect(world.camera.fov).toBe(179.9);
        });

        it("lance une erreur si la caméra n'existe pas", () => {
            const worldWithoutCamera = { ...world, camera: undefined } as any;

            expect(() => updateCameraFOV(worldWithoutCamera, 60)).toThrow(
                "Camera is not initialized in world"
            );
        });
    });

    describe("updateCameraNear", () => {
        it("met à jour le plan proche de la caméra", () => {
            updateCameraNear(world, 0.5);

            expect(world.camera.near).toBe(0.5);
        });

        it("lance une erreur si near est 0", () => {
            expect(() => updateCameraNear(world, 0)).toThrow(
                "Invalid near plane: 0"
            );
        });

        it("lance une erreur si near est négatif", () => {
            expect(() => updateCameraNear(world, -1)).toThrow(
                "Invalid near plane: -1"
            );
        });

        it("lance une erreur si near n'est pas un nombre fini", () => {
            expect(() => updateCameraNear(world, NaN)).toThrow(
                "Invalid near plane"
            );
            expect(() => updateCameraNear(world, Infinity)).toThrow(
                "Invalid near plane"
            );
        });

        it("lance une erreur si near >= far", () => {
            world.camera.far = 100;

            expect(() => updateCameraNear(world, 100)).toThrow(
                "Near plane must be smaller than far plane"
            );
            expect(() => updateCameraNear(world, 150)).toThrow(
                "Near plane must be smaller than far plane"
            );
        });

        it("accepte near < far", () => {
            world.camera.far = 100;

            updateCameraNear(world, 50);

            expect(world.camera.near).toBe(50);
        });

        it("lance une erreur si la caméra n'existe pas", () => {
            const worldWithoutCamera = { ...world, camera: undefined } as any;

            expect(() => updateCameraNear(worldWithoutCamera, 0.1)).toThrow(
                "Camera is not initialized in world"
            );
        });
    });

    describe("updateCameraFar", () => {
        it("met à jour le plan lointain de la caméra", () => {
            updateCameraFar(world, 2000);

            expect(world.camera.far).toBe(2000);
        });

        it("lance une erreur si far est 0", () => {
            expect(() => updateCameraFar(world, 0)).toThrow(
                "Invalid far plane: 0"
            );
        });

        it("lance une erreur si far est négatif", () => {
            expect(() => updateCameraFar(world, -10)).toThrow(
                "Invalid far plane: -10"
            );
        });

        it("lance une erreur si far n'est pas un nombre fini", () => {
            expect(() => updateCameraFar(world, NaN)).toThrow(
                "Invalid far plane"
            );
            expect(() => updateCameraFar(world, Infinity)).toThrow(
                "Invalid far plane"
            );
        });

        it("lance une erreur si far <= near", () => {
            world.camera.near = 100;

            expect(() => updateCameraFar(world, 100)).toThrow(
                "Far plane must be greater than near plane"
            );
            expect(() => updateCameraFar(world, 50)).toThrow(
                "Far plane must be greater than near plane"
            );
        });

        it("accepte far > near", () => {
            world.camera.near = 50;

            updateCameraFar(world, 100);

            expect(world.camera.far).toBe(100);
        });

        it("lance une erreur si la caméra n'existe pas", () => {
            const worldWithoutCamera = { ...world, camera: undefined } as any;

            expect(() => updateCameraFar(worldWithoutCamera, 1000)).toThrow(
                "Camera is not initialized in world"
            );
        });
    });

    describe("updateCameraType", () => {
        it("met à jour le type de caméra", () => {
            updateCameraType(world, CameraType.ORTHOGRAPHIC);

            expect(world.camera.type).toBe(CameraType.ORTHOGRAPHIC);
        });

        it("accepte tous les types valides", () => {
            updateCameraType(world, CameraType.PERSPECTIVE);
            expect(world.camera.type).toBe(CameraType.PERSPECTIVE);

            updateCameraType(world, CameraType.ORTHOGRAPHIC);
            expect(world.camera.type).toBe(CameraType.ORTHOGRAPHIC);
        });

        it("lance une erreur si la caméra n'existe pas", () => {
            const worldWithoutCamera = { ...world, camera: undefined } as any;

            expect(() =>
                updateCameraType(worldWithoutCamera, CameraType.PERSPECTIVE)
            ).toThrow("Camera is not initialized in world");
        });
    });

    describe("coordinations entre near et far", () => {
        it("permet de définir near puis far dans le bon ordre", () => {
            updateCameraNear(world, 1);
            updateCameraFar(world, 500);

            expect(world.camera.near).toBe(1);
            expect(world.camera.far).toBe(500);
        });

        it("permet de définir far puis near dans le bon ordre", () => {
            updateCameraFar(world, 500);
            updateCameraNear(world, 1);

            expect(world.camera.near).toBe(1);
            expect(world.camera.far).toBe(500);
        });
    });
});
