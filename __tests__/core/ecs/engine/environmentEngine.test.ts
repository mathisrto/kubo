import {
    updateEnvironmentIntensity,
    updateEnvironmentMap,
} from "@/src/core/ecs/engine/environmentEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";

describe("environmentEngine", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("updateEnvironmentIntensity", () => {
        it("met à jour l'intensité de l'environnement", () => {
            updateEnvironmentIntensity(world, 2.5);

            expect(world.environment.intensity).toBe(2.5);
        });

        it("accepte des valeurs décimales", () => {
            updateEnvironmentIntensity(world, 0.5);

            expect(world.environment.intensity).toBe(0.5);
        });

        it("accepte la valeur 0", () => {
            updateEnvironmentIntensity(world, 0);

            expect(world.environment.intensity).toBe(0);
        });

        it("accepte de grandes valeurs", () => {
            updateEnvironmentIntensity(world, 1000);

            expect(world.environment.intensity).toBe(1000);
        });

        it("lance une erreur si l'intensité est négative", () => {
            expect(() => updateEnvironmentIntensity(world, -1)).toThrow(
                "L'intensité ne peut pas être négative"
            );
            expect(() => updateEnvironmentIntensity(world, -0.5)).toThrow(
                "L'intensité ne peut pas être négative"
            );
        });

        it("lance une erreur si l'intensité n'est pas un nombre", () => {
            expect(() => updateEnvironmentIntensity(world, NaN)).toThrow(
                "L'intensité doit être un nombre valide"
            );

            expect(() => updateEnvironmentIntensity(world, "2" as any)).toThrow(
                "L'intensité doit être un nombre valide"
            );
        });

        it("lance une erreur si l'environnement n'existe pas", () => {
            const worldWithoutEnv = { ...world, environment: undefined } as any;

            expect(() =>
                updateEnvironmentIntensity(worldWithoutEnv, 1)
            ).toThrow("Environment is not initialized in world");
        });
    });

    describe("updateEnvironmentMap", () => {
        it("met à jour la carte d'environnement", () => {
            const fileId = "environment.hdr";

            updateEnvironmentMap(world, fileId);

            expect(world.environment.environmentMap).toBe(fileId);
        });

        it("accepte undefined pour supprimer la map", () => {
            world.environment.environmentMap = "old-map.hdr";

            updateEnvironmentMap(world, undefined);

            expect(world.environment.environmentMap).toBeUndefined();
        });

        it("remplace une ancienne map", () => {
            world.environment.environmentMap = "old-map.hdr";

            updateEnvironmentMap(world, "new-map.hdr");

            expect(world.environment.environmentMap).toBe("new-map.hdr");
        });

        it("accepte différents types de fichiers", () => {
            updateEnvironmentMap(world, "env.exr");
            expect(world.environment.environmentMap).toBe("env.exr");

            updateEnvironmentMap(world, "sky.hdr");
            expect(world.environment.environmentMap).toBe("sky.hdr");
        });

        it("lance une erreur si l'environnement n'existe pas", () => {
            const worldWithoutEnv = { ...world, environment: undefined } as any;

            expect(() =>
                updateEnvironmentMap(worldWithoutEnv, "map.hdr")
            ).toThrow("Environment is not initialized in world");
        });
    });

    describe("intégration intensity et map", () => {
        it("permet de définir les deux propriétés indépendamment", () => {
            updateEnvironmentIntensity(world, 2);
            updateEnvironmentMap(world, "sky.hdr");

            expect(world.environment.intensity).toBe(2);
            expect(world.environment.environmentMap).toBe("sky.hdr");
        });

        it("l'intensité n'affecte pas la map", () => {
            updateEnvironmentMap(world, "sky.hdr");
            updateEnvironmentIntensity(world, 3);

            expect(world.environment.environmentMap).toBe("sky.hdr");
        });

        it("la map n'affecte pas l'intensité", () => {
            updateEnvironmentIntensity(world, 2.5);
            updateEnvironmentMap(world, "env.exr");

            expect(world.environment.intensity).toBe(2.5);
        });
    });
});
