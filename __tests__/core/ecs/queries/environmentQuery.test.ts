import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getEnvironmentIntensity,
    getEnvironmentMap,
} from "@/src/core/ecs/queries/environmentQuery";
import { World } from "@/src/core/ecs/world";

describe("environmentQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getEnvironmentIntensity", () => {
        it("retourne l'intensité de l'environnement", () => {
            const intensity = getEnvironmentIntensity(world);

            expect(intensity).toBe(1);
        });

        it("retourne l'intensité modifiée", () => {
            world.environment.intensity = 0.5;

            const intensity = getEnvironmentIntensity(world);

            expect(intensity).toBe(0.5);
        });
    });

    describe("getEnvironmentMap", () => {
        it("retourne undefined si aucune map n'est définie", () => {
            const map = getEnvironmentMap(world);

            expect(map).toBeUndefined();
        });

        it("retourne la map définie", () => {
            world.environment.environmentMap = "env-map-id";

            const map = getEnvironmentMap(world);

            expect(map).toBe("env-map-id");
        });
    });
});
