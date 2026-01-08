import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getPosition,
    getRotation,
    getScale,
    getTransform,
} from "@/src/core/ecs/queries/transformQuery";
import { World } from "@/src/core/ecs/world";
import { ModelFileFormat } from "@/src/types";

describe("transformQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getTransform", () => {
        it("retourne la transformation d'une entité", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const transform = getTransform(world, modelId);

            expect(transform).toBeDefined();
            expect(transform?.position).toBeDefined();
            expect(transform?.rotation).toBeDefined();
            expect(transform?.scale).toBeDefined();
        });

        it("retourne undefined si l'entité n'a pas de transformation", () => {
            const transform = getTransform(world, "non-existent");

            expect(transform).toBeUndefined();
        });
    });

    describe("getPosition", () => {
        it("retourne la position par défaut", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const position = getPosition(world, modelId);

            expect(position).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("retourne la position modifiée", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            world.transforms[modelId].position = { x: 10, y: 20, z: 30 };

            const position = getPosition(world, modelId);

            expect(position).toEqual({ x: 10, y: 20, z: 30 });
        });

        it("retourne undefined si l'entité n'a pas de transformation", () => {
            const position = getPosition(world, "non-existent");

            expect(position).toBeUndefined();
        });
    });

    describe("getRotation", () => {
        it("retourne la rotation par défaut", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const rotation = getRotation(world, modelId);

            expect(rotation).toEqual({ x: 0, y: 0, z: 0 });
        });

        it("retourne la rotation modifiée", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            world.transforms[modelId].rotation = { x: 45, y: 90, z: 180 };

            const rotation = getRotation(world, modelId);

            expect(rotation).toEqual({ x: 45, y: 90, z: 180 });
        });

        it("retourne undefined si l'entité n'a pas de transformation", () => {
            const rotation = getRotation(world, "non-existent");

            expect(rotation).toBeUndefined();
        });
    });

    describe("getScale", () => {
        it("retourne l'échelle par défaut", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const scale = getScale(world, modelId);

            expect(scale).toEqual({ x: 1, y: 1, z: 1 });
        });

        it("retourne l'échelle modifiée", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            world.transforms[modelId].scale = { x: 2, y: 3, z: 4 };

            const scale = getScale(world, modelId);

            expect(scale).toEqual({ x: 2, y: 3, z: 4 });
        });

        it("retourne undefined si l'entité n'a pas de transformation", () => {
            const scale = getScale(world, "non-existent");

            expect(scale).toBeUndefined();
        });
    });
});
