import { createLight } from "@/src/core/ecs/engine/lightEngine";
import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { getName } from "@/src/core/ecs/queries/nameQuery";
import { World } from "@/src/core/ecs/world";
import { LightType, ModelFileFormat } from "@/src/types";

describe("nameQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getName", () => {
        it("retourne le nom d'un modèle", () => {
            const modelId = createModel3D(world, {
                name: "My Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const name = getName(world, modelId);

            expect(name).toBe("My Model");
        });

        it("retourne le nom d'une lumière", () => {
            const lightId = createLight(world, {
                name: "Main Light",
                type: LightType.DIRECTIONAL,
            });

            const name = getName(world, lightId);

            expect(name).toBe("Main Light");
        });

        it("retourne undefined si l'entité n'a pas de nom", () => {
            const name = getName(world, "non-existent");

            expect(name).toBeUndefined();
        });

        it("retourne le nom d'une entité quelconque", () => {
            const entityId = "e123";
            world.names[entityId] = "Custom Entity";

            const name = getName(world, entityId);

            expect(name).toBe("Custom Entity");
        });
    });
});
