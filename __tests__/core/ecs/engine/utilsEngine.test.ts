import {
    createOrResetScene,
    generateEntityId,
    removeEntity,
} from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";
import { CameraType, ModelFileFormat } from "@/src/types";

describe("utilsEngine", () => {
    describe("generateEntityId", () => {
        it("génère des identifiants uniques", () => {
            const id1 = generateEntityId();
            const id2 = generateEntityId();
            const id3 = generateEntityId();

            expect(id1).not.toBe(id2);
            expect(id2).not.toBe(id3);
            expect(id1).not.toBe(id3);
        });

        it("génère des identifiants au format 'e{number}'", () => {
            const id = generateEntityId();
            expect(id).toMatch(/^e\d+$/);
        });

        it("génère des identifiants incrémentaux", () => {
            const id1 = generateEntityId();
            const id2 = generateEntityId();

            const num1 = parseInt(id1.substring(1));
            const num2 = parseInt(id2.substring(1));

            expect(num2).toBeGreaterThan(num1);
        });
    });

    describe("removeEntity", () => {
        let world: World;

        beforeEach(() => {
            world = createOrResetScene();
        });

        it("supprime une entité avec tous ses composants", () => {
            const entityId = "e1";
            world.transforms[entityId] = {
                position: { x: 1, y: 2, z: 3 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };
            world.names[entityId] = "Test Entity";
            world.models[entityId] = {
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
                materialId: "m1",
            };

            const result = removeEntity(world, entityId);

            expect(result).toBe(true);
            expect(world.transforms[entityId]).toBeUndefined();
            expect(world.names[entityId]).toBeUndefined();
            expect(world.models[entityId]).toBeUndefined();
        });

        it("retourne true si au moins un composant a été supprimé", () => {
            const entityId = "e2";
            world.transforms[entityId] = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };

            const result = removeEntity(world, entityId);

            expect(result).toBe(true);
        });

        it("retourne false si aucun composant n'existait", () => {
            const entityId = "e999";

            const result = removeEntity(world, entityId);

            expect(result).toBe(false);
        });

        it("supprime tous les types de composants", () => {
            const entityId = "e3";
            world.transforms[entityId] = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };
            world.names[entityId] = "Light";
            world.lights[entityId] = {
                color: { r: 1, g: 1, b: 1 },
                intensity: 1,
                range: 10,
                type: "POINT" as any,
            };
            world.materials[entityId] = {
                albedoMap: "t1",
                normalMap: "t2",
                roughnessMap: "t3",
                metallicMap: "t4",
                aoMap: "t5",
                emissiveMap: "t6",
            };

            removeEntity(world, entityId);

            expect(world.transforms[entityId]).toBeUndefined();
            expect(world.names[entityId]).toBeUndefined();
            expect(world.lights[entityId]).toBeUndefined();
            expect(world.materials[entityId]).toBeUndefined();
        });
    });

    describe("createOrResetScene", () => {
        it("crée un nouveau monde avec les valeurs par défaut", () => {
            const world = createOrResetScene();

            expect(world).toBeDefined();
            expect(world.camera).toBeDefined();
            expect(world.environment).toBeDefined();
            expect(world.lights).toEqual({});
            expect(world.materials).toEqual({});
            expect(world.models).toEqual({});
            expect(world.names).toEqual({});
            expect(world.transforms).toEqual({});
            expect(world.textures).toEqual({});
        });

        it("initialise la caméra avec les bonnes valeurs", () => {
            const world = createOrResetScene();

            expect(world.camera.position).toEqual({ x: 5, y: 5, z: 5 });
            expect(world.camera.target).toEqual({ x: 0, y: 0, z: 0 });
            expect(world.camera.fov).toBe(75);
            expect(world.camera.near).toBe(0.1);
            expect(world.camera.far).toBe(1000);
            expect(world.camera.type).toBe(CameraType.PERSPECTIVE);
        });

        it("initialise l'environnement avec intensité 1", () => {
            const world = createOrResetScene();

            expect(world.environment.intensity).toBe(1);
        });

        it("réinitialise un monde existant", () => {
            const world = createOrResetScene();
            const entityId = "e1";

            // Ajouter des données au monde
            world.transforms[entityId] = {
                position: { x: 10, y: 20, z: 30 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };
            world.names[entityId] = "Test";
            world.camera.fov = 90;

            // Réinitialiser
            const resetWorld = createOrResetScene(world);

            expect(resetWorld).toBe(world); // Même référence
            expect(resetWorld.transforms).toEqual({});
            expect(resetWorld.names).toEqual({});
            expect(resetWorld.camera.fov).toBe(75);
        });

        it("retourne une nouvelle instance si aucun monde n'est fourni", () => {
            const world1 = createOrResetScene();
            const world2 = createOrResetScene();

            expect(world1).not.toBe(world2);
        });

        it("préserve la référence lors de la réinitialisation", () => {
            const world = createOrResetScene();
            const originalReference = world;

            createOrResetScene(world);

            expect(world).toBe(originalReference);
        });
    });
});
