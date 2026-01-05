import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";
import { ModelFileFormat } from "@/src/types";

describe("model3dEngine", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("createModel3D", () => {
        it("crée un modèle 3D avec les paramètres de base", () => {
            const modelId = createModel3D(world, {
                name: "Test Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(modelId).toBeDefined();
            expect(world.models[modelId]).toBeDefined();
            expect(world.names[modelId]).toBe("Test Model");
        });

        it("crée un modèle avec fileId et format", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "cube.obj",
                format: ModelFileFormat.OBJ,
            });

            expect(world.models[modelId].fileId).toBe("cube.obj");
            expect(world.models[modelId].format).toBe(ModelFileFormat.OBJ);
        });

        it("crée un matériau automatiquement", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            const materialId = world.models[modelId].materialId;
            expect(materialId).toBeDefined();
            expect(world.materials[materialId]).toBeDefined();
        });

        it("nomme le matériau avec le suffixe '_material'", () => {
            const modelId = createModel3D(world, {
                name: "MyModel",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            const materialId = world.models[modelId].materialId;
            expect(world.names[materialId]).toBe("MyModel_material");
        });

        it("crée un transform par défaut si non fourni", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(world.transforms[modelId]).toEqual({
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            });
        });

        it("utilise le transform fourni", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
                transform: {
                    position: { x: 10, y: 20, z: 30 },
                    rotation: { x: 45, y: 90, z: 180 },
                    scale: { x: 2, y: 3, z: 4 },
                },
            });

            expect(world.transforms[modelId]).toEqual({
                position: { x: 10, y: 20, z: 30 },
                rotation: { x: 45, y: 90, z: 180 },
                scale: { x: 2, y: 3, z: 4 },
            });
        });

        it("accepte metadata optionnelles", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
                metadata: { primitive: "cube" },
            });

            expect(world.models[modelId].metadata).toEqual({
                author: "John Doe",
                version: "1.0",
            });
        });

        it("fonctionne sans metadata", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(world.models[modelId].metadata).toBeUndefined();
        });

        it("génère des identifiants uniques", () => {
            const model1 = createModel3D(world, {
                name: "Model 1",
                fileId: "model1.glb",
                format: ModelFileFormat.GLB,
            });
            const model2 = createModel3D(world, {
                name: "Model 2",
                fileId: "model2.glb",
                format: ModelFileFormat.GLB,
            });
            const model3 = createModel3D(world, {
                name: "Model 3",
                fileId: "model3.glb",
                format: ModelFileFormat.GLB,
            });

            expect(model1).not.toBe(model2);
            expect(model2).not.toBe(model3);
            expect(model1).not.toBe(model3);
        });

        it("accepte différents formats de modèles", () => {
            const gltf = createModel3D(world, {
                name: "GLTF",
                fileId: "model.gltf",
                format: ModelFileFormat.GLTF,
            });
            const glb = createModel3D(world, {
                name: "GLB",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });
            const obj = createModel3D(world, {
                name: "OBJ",
                fileId: "model.obj",
                format: ModelFileFormat.OBJ,
            });
            const fbx = createModel3D(world, {
                name: "FBX",
                fileId: "model.fbx",
                format: ModelFileFormat.FBX,
            });
            const stl = createModel3D(world, {
                name: "STL",
                fileId: "model.stl",
                format: ModelFileFormat.STL,
            });

            expect(world.models[gltf].format).toBe(ModelFileFormat.GLTF);
            expect(world.models[glb].format).toBe(ModelFileFormat.GLB);
            expect(world.models[obj].format).toBe(ModelFileFormat.OBJ);
            expect(world.models[fbx].format).toBe(ModelFileFormat.FBX);
            expect(world.models[stl].format).toBe(ModelFileFormat.STL);
        });

        it("retourne un identifiant au format 'e{number}'", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(modelId).toMatch(/^e\d+$/);
        });

        it("crée des modèles indépendants", () => {
            const model1 = createModel3D(world, {
                name: "Model 1",
                fileId: "model1.glb",
                format: ModelFileFormat.GLB,
            });
            const model2 = createModel3D(world, {
                name: "Model 2",
                fileId: "model2.glb",
                format: ModelFileFormat.GLB,
            });

            world.models[model1].fileId = "modified.glb";

            expect(world.models[model2].fileId).toBe("model2.glb");
        });

        it("stocke le modèle dans world.models", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(world.models[modelId]).toBeDefined();
        });

        it("stocke le nom dans world.names", () => {
            const modelId = createModel3D(world, {
                name: "My Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(world.names[modelId]).toBe("My Model");
        });

        it("stocke le transform dans world.transforms", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            expect(world.transforms[modelId]).toBeDefined();
        });

        it("crée un matériau unique pour chaque modèle", () => {
            const model1 = createModel3D(world, {
                name: "Model 1",
                fileId: "model1.glb",
                format: ModelFileFormat.GLB,
            });
            const model2 = createModel3D(world, {
                name: "Model 2",
                fileId: "model2.glb",
                format: ModelFileFormat.GLB,
            });

            const material1 = world.models[model1].materialId;
            const material2 = world.models[model2].materialId;

            expect(material1).not.toBe(material2);
        });

        it("accepte un transform partiel", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
                transform: {
                    position: { x: 5, y: 10, z: 15 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                },
            });

            expect(world.transforms[modelId].position).toEqual({
                x: 5,
                y: 10,
                z: 15,
            });
        });

        it("accepte des chemins de fichiers complexes", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "path/to/models/complex-model_v2.glb",
                format: ModelFileFormat.GLB,
            });

            expect(world.models[modelId].fileId).toBe(
                "path/to/models/complex-model_v2.glb"
            );
        });

        it("crée le matériau avant de l'assigner au modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "model.glb",
                format: ModelFileFormat.GLB,
            });

            const materialId = world.models[modelId].materialId;
            expect(world.materials[materialId]).toBeDefined();
            expect(world.names[materialId]).toBeDefined();
        });
    });
});
