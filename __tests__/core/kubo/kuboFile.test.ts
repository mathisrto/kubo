import { World } from "@/src/core/ecs/world";
import {
    deserializeKuboFile,
    KuboFileError,
    serializeKuboFile,
} from "@/src/core/kubo/kuboFile";
import { CameraType } from "@/src/types";

const createTestWorld = (): World => ({
    camera: {
        position: { x: 5, y: 5, z: 5 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000,
        type: CameraType.PERSPECTIVE,
    },
    environment: { intensity: 1 },
    lights: {
        e0: {
            type: "point" as any,
            color: { r: 1, g: 1, b: 1 },
            intensity: 1,
        },
    },
    materials: {},
    models: {},
    names: { e0: "Ma lumière" },
    transforms: {
        e0: {
            position: { x: 0, y: 3, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        },
    },
    textures: {},
});

describe("kuboFile — serialize / deserialize", () => {
    it("doit sérialiser puis désérialiser un World sans perte", () => {
        const original = createTestWorld();
        const serialized = serializeKuboFile(original);
        const restored = deserializeKuboFile(serialized);

        expect(restored.camera).toEqual(original.camera);
        expect(restored.environment).toEqual(original.environment);
        expect(restored.lights).toEqual(original.lights);
        expect(restored.names).toEqual(original.names);
        expect(restored.transforms).toEqual(original.transforms);
    });

    it("doit contenir l'en-tête kubo dans le JSON sérialisé", () => {
        const serialized = serializeKuboFile(createTestWorld());
        const parsed = JSON.parse(serialized);

        expect(parsed.kubo).toBeDefined();
        expect(parsed.kubo.version).toBe("1.0.0");
        expect(parsed.kubo.app).toBe("Kubo");
        expect(parsed.kubo.createdAt).toBeDefined();
    });

    it("doit rejeter un JSON invalide", () => {
        expect(() => deserializeKuboFile("not json")).toThrow(KuboFileError);
    });

    it("doit rejeter un JSON sans structure kubo", () => {
        expect(() => deserializeKuboFile('{"hello": "world"}')).toThrow(
            KuboFileError,
        );
    });

    it("doit rejeter un fichier dont le world est incomplet", () => {
        const bad = JSON.stringify({
            kubo: {
                version: "1.0.0",
                app: "Kubo",
                createdAt: new Date().toISOString(),
            },
            world: { camera: null, environment: null },
        });
        expect(() => deserializeKuboFile(bad)).toThrow(KuboFileError);
    });

    it("doit initialiser les records manquants à {}", () => {
        const minimal = JSON.stringify({
            kubo: {
                version: "1.0.0",
                app: "Kubo",
                createdAt: new Date().toISOString(),
            },
            world: {
                camera: {
                    position: { x: 0, y: 0, z: 0 },
                    target: { x: 0, y: 0, z: 0 },
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    type: "perspective",
                },
                environment: { intensity: 1 },
                // pas de lights, models, etc.
            },
        });

        const world = deserializeKuboFile(minimal);
        expect(world.lights).toEqual({});
        expect(world.materials).toEqual({});
        expect(world.models).toEqual({});
        expect(world.names).toEqual({});
        expect(world.transforms).toEqual({});
        expect(world.textures).toEqual({});
    });
});
