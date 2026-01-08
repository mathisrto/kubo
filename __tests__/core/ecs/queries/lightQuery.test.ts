import { createLight } from "@/src/core/ecs/engine/lightEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getLightById,
    getLightColor,
    getLightIntensity,
    getLightRange,
    getLights,
    getLightType,
} from "@/src/core/ecs/queries/lightQuery";
import { World } from "@/src/core/ecs/world";
import { LightType } from "@/src/types";

describe("lightQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getLights", () => {
        it("retourne un tableau vide si aucune lumière", () => {
            const lights = getLights(world);

            expect(lights).toEqual([]);
        });

        it("retourne les IDs des lumières", () => {
            const light1 = createLight(world, {
                name: "Light 1",
                type: LightType.DIRECTIONAL,
            });
            const light2 = createLight(world, {
                name: "Light 2",
                type: LightType.POINT,
            });

            const lights = getLights(world);

            expect(lights).toHaveLength(2);
            expect(lights).toContain(light1);
            expect(lights).toContain(light2);
        });
    });

    describe("getLightById", () => {
        it("retourne la lumière par son ID", () => {
            const lightId = createLight(world, {
                name: "Test Light",
                type: LightType.SPOT,
            });

            const light = getLightById(world, lightId);

            expect(light).toBeDefined();
            expect(light?.type).toBe(LightType.SPOT);
        });

        it("retourne undefined si la lumière n'existe pas", () => {
            const light = getLightById(world, "non-existent");

            expect(light).toBeUndefined();
        });
    });

    describe("getLightType", () => {
        it("retourne le type de la lumière", () => {
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.DIRECTIONAL,
            });

            const type = getLightType(world, lightId);

            expect(type).toBe(LightType.DIRECTIONAL);
        });

        it("retourne undefined si la lumière n'existe pas", () => {
            const type = getLightType(world, "non-existent");

            expect(type).toBeUndefined();
        });
    });

    describe("getLightColor", () => {
        it("retourne la couleur de la lumière", () => {
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.POINT,
                color: { r: 255, g: 128, b: 64 },
            });

            const color = getLightColor(world, lightId);

            expect(color).toEqual({ r: 255, g: 128, b: 64 });
        });

        it("retourne undefined si la lumière n'existe pas", () => {
            const color = getLightColor(world, "non-existent");

            expect(color).toBeUndefined();
        });
    });

    describe("getLightRange", () => {
        it("retourne la portée de la lumière", () => {
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.POINT,
                range: 100,
            });

            const range = getLightRange(world, lightId);

            expect(range).toBe(100);
        });

        it("retourne undefined si la lumière n'existe pas", () => {
            const range = getLightRange(world, "non-existent");

            expect(range).toBeUndefined();
        });
    });

    describe("getLightIntensity", () => {
        it("retourne l'intensité de la lumière", () => {
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.SPOT,
                intensity: 2.5,
            });

            const intensity = getLightIntensity(world, lightId);

            expect(intensity).toBe(2.5);
        });

        it("retourne undefined si la lumière n'existe pas", () => {
            const intensity = getLightIntensity(world, "non-existent");

            expect(intensity).toBeUndefined();
        });
    });
});
