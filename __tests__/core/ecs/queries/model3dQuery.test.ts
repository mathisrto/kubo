import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getModel3DById,
    getModel3DFileId,
    getModel3DFormat,
    getModel3DMaterialId,
    getModel3DMetadata,
    getModels3D,
} from "@/src/core/ecs/queries/model3dQuery";
import { World } from "@/src/core/ecs/world";
import { ModelFileFormat } from "@/src/types";

describe("model3dQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getModels3D", () => {
        it("retourne un tableau vide si aucun modèle", () => {
            const models = getModels3D(world);

            expect(models).toEqual([]);
        });

        it("retourne les IDs des modèles", () => {
            const model1 = createModel3D(world, {
                name: "Model 1",
                fileId: "test1.glb",
                format: ModelFileFormat.GLB,
            });
            const model2 = createModel3D(world, {
                name: "Model 2",
                fileId: "test2.obj",
                format: ModelFileFormat.OBJ,
            });

            const models = getModels3D(world);

            expect(models).toHaveLength(2);
            expect(models).toContain(model1);
            expect(models).toContain(model2);
        });
    });

    describe("getModel3DById", () => {
        it("retourne le modèle par son ID", () => {
            const modelId = createModel3D(world, {
                name: "Test Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const model = getModel3DById(world, modelId);

            expect(model).toBeDefined();
            expect(model?.fileId).toBe("test.glb");
            expect(model?.format).toBe(ModelFileFormat.GLB);
        });

        it("retourne undefined si le modèle n'existe pas", () => {
            const model = getModel3DById(world, "non-existent");

            expect(model).toBeUndefined();
        });
    });

    describe("getModel3DFileId", () => {
        it("retourne le fileId du modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.fbx",
                format: ModelFileFormat.FBX,
            });

            const fileId = getModel3DFileId(world, modelId);

            expect(fileId).toBe("model.fbx");
        });

        it("retourne undefined si le modèle n'existe pas", () => {
            const fileId = getModel3DFileId(world, "non-existent");

            expect(fileId).toBeUndefined();
        });
    });

    describe("getModel3DFormat", () => {
        it("retourne le format du modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.stl",
                format: ModelFileFormat.STL,
            });

            const format = getModel3DFormat(world, modelId);

            expect(format).toBe(ModelFileFormat.STL);
        });

        it("retourne undefined si le modèle n'existe pas", () => {
            const format = getModel3DFormat(world, "non-existent");

            expect(format).toBeUndefined();
        });
    });

    describe("getModel3DMaterialId", () => {
        it("retourne l'ID du matériau du modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            const materialId = getModel3DMaterialId(world, modelId);

            expect(materialId).toBeDefined();
            expect(world.materials[materialId!]).toBeDefined();
        });

        it("retourne undefined si le modèle n'existe pas", () => {
            const materialId = getModel3DMaterialId(world, "non-existent");

            expect(materialId).toBeUndefined();
        });
    });

    describe("getModel3DMetadata", () => {
        it("retourne les metadata du modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
                metadata: { primitive: "cube" },
            });

            const metadata = getModel3DMetadata(world, modelId);

            expect(metadata).toEqual({ primitive: "cube" });
        });

        it("retourne undefined si le modèle n'a pas de metadata", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            const metadata = getModel3DMetadata(world, modelId);

            expect(metadata).toBeUndefined();
        });

        it("retourne undefined si le modèle n'existe pas", () => {
            const metadata = getModel3DMetadata(world, "non-existent");

            expect(metadata).toBeUndefined();
        });
    });
});
