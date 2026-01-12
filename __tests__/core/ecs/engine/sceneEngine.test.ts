import {
    createReactiveWorld,
    initWorld,
    load,
    saveWorld,
} from "@/src/core/ecs/engine/sceneEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";
import { ScenePort } from "@/src/core/ports/scenePort";

// Mock ScenePort
const createMockScenePort = (): jest.Mocked<ScenePort> => ({
    saveWorld: jest.fn(),
    loadWorld: jest.fn(),
    savePatches: jest.fn(),
});

describe("sceneEngine", () => {
    let world: World;
    let scenePort: jest.Mocked<ScenePort>;

    beforeEach(() => {
        world = createOrResetScene();
        scenePort = createMockScenePort();
        jest.clearAllMocks();
    });

    describe("saveWorld", () => {
        it("sauvegarde le monde via le port de scène", async () => {
            const userId = "user123";

            await saveWorld(userId, world, scenePort);

            expect(scenePort.saveWorld).toHaveBeenCalledWith(userId, world);
            expect(scenePort.saveWorld).toHaveBeenCalledTimes(1);
        });

        it("gère les erreurs de sauvegarde", async () => {
            const userId = "user123";
            scenePort.saveWorld.mockRejectedValue(new Error("Save failed"));

            await expect(saveWorld(userId, world, scenePort)).rejects.toThrow(
                "Save failed"
            );
        });
    });

    describe("load", () => {
        it("charge le monde depuis le port de scène", async () => {
            const userId = "user123";
            const mockWorld = createOrResetScene();
            scenePort.loadWorld.mockResolvedValue(mockWorld);

            const result = await load(userId, scenePort);

            expect(scenePort.loadWorld).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockWorld);
        });

        it("retourne null si aucun monde n'est trouvé", async () => {
            const userId = "user123";
            scenePort.loadWorld.mockResolvedValue(null);

            const result = await load(userId, scenePort);

            expect(result).toBeNull();
        });

        it("gère les erreurs de chargement", async () => {
            const userId = "user123";
            scenePort.loadWorld.mockRejectedValue(new Error("Load failed"));

            await expect(load(userId, scenePort)).rejects.toThrow(
                "Load failed"
            );
        });
    });

    describe("createReactiveWorld", () => {
        it("crée un proxy réactif du monde", () => {
            const userId = "user123";
            const reactiveWorld = createReactiveWorld(userId, world);

            expect(reactiveWorld).toBeDefined();
            expect(reactiveWorld.transforms).toBeDefined();
            expect(reactiveWorld.models).toBeDefined();
        });

        it("déclenche la sauvegarde des patches lors d'une modification", async () => {
            const userId = "user123";
            const savePatches = jest.fn().mockResolvedValue(undefined);

            const reactiveWorld = createReactiveWorld(
                userId,
                world,
                savePatches
            );

            reactiveWorld.environment.intensity = 0.8;

            await new Promise((resolve) => setTimeout(resolve, 1100));

            expect(savePatches).toHaveBeenCalled();
            expect(savePatches).toHaveBeenCalledWith(
                userId,
                expect.any(Object)
            );
        }, 10000);

        it("debounce les sauvegardes multiples", async () => {
            const userId = "user123";
            const savePatches = jest.fn().mockResolvedValue(undefined);

            const reactiveWorld = createReactiveWorld(
                userId,
                world,
                savePatches
            );

            reactiveWorld.environment.intensity = 0.8;
            reactiveWorld.environment.intensity = 0.9;
            reactiveWorld.environment.intensity = 1.0;

            await new Promise((resolve) => setTimeout(resolve, 1100));

            expect(savePatches).toHaveBeenCalledTimes(1);
        }, 10000);

        it("gère les erreurs de sauvegarde des patches", async () => {
            const savePatches = jest
                .fn()
                .mockRejectedValue(new Error("Patch save failed"));

            const userId = "user123";

            const reactiveWorld = createReactiveWorld(
                userId,
                world,
                savePatches
            );

            reactiveWorld.environment.intensity = 0.5;

            await new Promise((resolve) => setTimeout(resolve, 1100));

            expect(savePatches).toHaveBeenCalled();
        }, 10000);

        it("conserve les modifications du monde", async () => {
            const userId = "user123";
            const reactiveWorld = createReactiveWorld(userId, world);

            reactiveWorld.environment.intensity = 0.7;

            expect(reactiveWorld.environment.intensity).toBe(0.7);

            await new Promise((resolve) => setTimeout(resolve, 1100));
        });
    });

    describe("initWorld", () => {
        it("charge un monde existant", async () => {
            const userId = "user123";
            const existingWorld = createOrResetScene();
            existingWorld.environment.intensity = 0.9;
            scenePort.loadWorld.mockResolvedValue(existingWorld);

            const result = await initWorld(userId, scenePort);

            expect(scenePort.loadWorld).toHaveBeenCalledWith(userId);
            expect(scenePort.saveWorld).not.toHaveBeenCalled();
            expect(result).toEqual(existingWorld);
            expect(result.environment.intensity).toBe(0.9);
        });

        it("crée un nouveau monde si aucun n'existe", async () => {
            const userId = "user123";
            scenePort.loadWorld.mockResolvedValue(null);

            const result = await initWorld(userId, scenePort);

            expect(scenePort.loadWorld).toHaveBeenCalledWith(userId);
            expect(scenePort.saveWorld).toHaveBeenCalledWith(
                userId,
                expect.any(Object)
            );
            expect(result).toBeDefined();
            expect(result.transforms).toBeDefined();
        });

        it("sauvegarde le monde créé", async () => {
            const userId = "user123";
            scenePort.loadWorld.mockResolvedValue(null);

            await initWorld(userId, scenePort);

            const saveWorldCall = scenePort.saveWorld.mock.calls[0];
            expect(saveWorldCall[0]).toBe(userId);
            expect(saveWorldCall[1]).toBeDefined();
            expect(saveWorldCall[1].transforms).toBeDefined();
        });

        it("gère les erreurs d'initialisation", async () => {
            const userId = "user123";
            scenePort.loadWorld.mockRejectedValue(
                new Error("Initialization failed")
            );

            await expect(initWorld(userId, scenePort)).rejects.toThrow(
                "Initialization failed"
            );
        });
    });
});
