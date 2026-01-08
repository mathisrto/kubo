import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getCameraFar,
    getCameraFOV,
    getCameraNear,
    getCameraPosition,
    getCameraTarget,
    getCameraType,
} from "@/src/core/ecs/queries/cameraQuery";
import { World } from "@/src/core/ecs/world";
import { CameraType } from "@/src/types";

describe("cameraQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getCameraPosition", () => {
        it("retourne la position de la caméra", () => {
            const position = getCameraPosition(world);

            expect(position).toEqual({ x: 5, y: 5, z: 5 });
        });

        it("retourne la position modifiée", () => {
            world.camera.position = { x: 10, y: 20, z: 30 };

            const position = getCameraPosition(world);

            expect(position).toEqual({ x: 10, y: 20, z: 30 });
        });
    });

    describe("getCameraFOV", () => {
        it("retourne le FOV de la caméra", () => {
            const fov = getCameraFOV(world);

            expect(fov).toBe(75);
        });

        it("retourne le FOV modifié", () => {
            world.camera.fov = 90;

            const fov = getCameraFOV(world);

            expect(fov).toBe(90);
        });
    });

    describe("getCameraNear", () => {
        it("retourne le plan near de la caméra", () => {
            const near = getCameraNear(world);

            expect(near).toBe(0.1);
        });

        it("retourne le near modifié", () => {
            world.camera.near = 0.5;

            const near = getCameraNear(world);

            expect(near).toBe(0.5);
        });
    });

    describe("getCameraFar", () => {
        it("retourne le plan far de la caméra", () => {
            const far = getCameraFar(world);

            expect(far).toBe(1000);
        });

        it("retourne le far modifié", () => {
            world.camera.far = 2000;

            const far = getCameraFar(world);

            expect(far).toBe(2000);
        });
    });

    describe("getCameraType", () => {
        it("retourne le type de la caméra", () => {
            const type = getCameraType(world);

            expect(type).toBe(CameraType.PERSPECTIVE);
        });

        it("retourne le type modifié", () => {
            world.camera.type = CameraType.ORTHOGRAPHIC;

            const type = getCameraType(world);

            expect(type).toBe(CameraType.ORTHOGRAPHIC);
        });
    });

    describe("getCameraTarget", () => {
        it("retourne la cible de la caméra", () => {
            const target = getCameraTarget(world);

            expect(target).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("retourne la cible modifiée", () => {
            world.camera.target = { x: 5, y: 10, z: 15 };

            const target = getCameraTarget(world);

            expect(target).toEqual({ x: 5, y: 10, z: 15 });
        });
    });
});
