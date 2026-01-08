import { createLight } from "@/src/core/ecs/engine/lightEngine";
import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    isLightEntity,
    isModel3DEntity,
} from "@/src/core/ecs/queries/utilsQuery";
import { World } from "@/src/core/ecs/world";
import { LightType, ModelFileFormat } from "@/src/types";

describe("utilsQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("isLightEntity", () => {
        it("retourne true pour une entité lumière", () => {
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.DIRECTIONAL,
            });

            const result = isLightEntity(world, lightId);

            expect(result).toBe(true);
        });

        it("retourne false pour un modèle 3D", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const result = isLightEntity(world, modelId);

            expect(result).toBe(false);
        });

        it("retourne false pour une entité inexistante", () => {
            const result = isLightEntity(world, "non-existent");

            expect(result).toBe(false);
        });

        it("retourne false pour une entité sans composant light", () => {
            const entityId = "e123";
            world.transforms[entityId] = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };

            const result = isLightEntity(world, entityId);

            expect(result).toBe(false);
        });
    });

    describe("isModel3DEntity", () => {
        it("retourne true pour une entité modèle 3D", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const result = isModel3DEntity(world, modelId);

            expect(result).toBe(true);
        });

        it("retourne false pour une lumière", () => {
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.POINT,
            });

            const result = isModel3DEntity(world, lightId);

            expect(result).toBe(false);
        });

        it("retourne false pour une entité inexistante", () => {
            const result = isModel3DEntity(world, "non-existent");

            expect(result).toBe(false);
        });

        it("retourne false pour une entité sans composant model", () => {
            const entityId = "e123";
            world.transforms[entityId] = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };

            const result = isModel3DEntity(world, entityId);

            expect(result).toBe(false);
        });
    });

    describe("interactions entre types d'entités", () => {
        it("une entité ne peut pas être à la fois lumière et modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const lightId = createLight(world, {
                name: "Light",
                type: LightType.SPOT,
            });

            expect(isModel3DEntity(world, modelId)).toBe(true);
            expect(isLightEntity(world, modelId)).toBe(false);

            expect(isLightEntity(world, lightId)).toBe(true);
            expect(isModel3DEntity(world, lightId)).toBe(false);
        });
    });
});
