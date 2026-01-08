import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getMaterialAlbedoMap,
    getMaterialAOMap,
    getMaterialEmissiveMap,
    getMaterialFromModel,
    getMaterialMetallicsMap,
    getMaterialNormalMap,
    getMaterialRoughnessMap,
} from "@/src/core/ecs/queries/materialQuery";
import { World } from "@/src/core/ecs/world";
import { ModelFileFormat } from "@/src/types";

describe("materialQuery", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("getMaterialAlbedoMap", () => {
        it("retourne l'albedo map du matériau", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;

            const albedoMap = getMaterialAlbedoMap(world, materialId);

            expect(albedoMap).toBeDefined();
        });

        it("retourne undefined si le matériau n'existe pas", () => {
            const albedoMap = getMaterialAlbedoMap(world, "non-existent");

            expect(albedoMap).toBeUndefined();
        });
    });

    describe("getMaterialMetallicsMap", () => {
        it("retourne la metallic map du matériau", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;

            const metallicMap = getMaterialMetallicsMap(world, materialId);

            expect(metallicMap).toBeDefined();
        });

        it("retourne undefined si le matériau n'existe pas", () => {
            const metallicMap = getMaterialMetallicsMap(world, "non-existent");

            expect(metallicMap).toBeUndefined();
        });
    });

    describe("getMaterialRoughnessMap", () => {
        it("retourne la roughness map du matériau", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;

            const roughnessMap = getMaterialRoughnessMap(world, materialId);

            expect(roughnessMap).toBeDefined();
        });

        it("retourne undefined si le matériau n'existe pas", () => {
            const roughnessMap = getMaterialRoughnessMap(world, "non-existent");

            expect(roughnessMap).toBeUndefined();
        });
    });

    describe("getMaterialNormalMap", () => {
        it("retourne la normal map du matériau", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;

            const normalMap = getMaterialNormalMap(world, materialId);

            expect(normalMap).toBeDefined();
        });

        it("retourne undefined si le matériau n'existe pas", () => {
            const normalMap = getMaterialNormalMap(world, "non-existent");

            expect(normalMap).toBeUndefined();
        });
    });

    describe("getMaterialAOMap", () => {
        it("retourne la AO map du matériau", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;

            const aoMap = getMaterialAOMap(world, materialId);

            expect(aoMap).toBeDefined();
        });

        it("retourne undefined si le matériau n'existe pas", () => {
            const aoMap = getMaterialAOMap(world, "non-existent");

            expect(aoMap).toBeUndefined();
        });
    });

    describe("getMaterialEmissiveMap", () => {
        it("retourne la emissive map du matériau", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;

            const emissiveMap = getMaterialEmissiveMap(world, materialId);

            expect(emissiveMap).toBeDefined();
        });

        it("retourne undefined si le matériau n'existe pas", () => {
            const emissiveMap = getMaterialEmissiveMap(world, "non-existent");

            expect(emissiveMap).toBeUndefined();
        });
    });

    describe("getMaterialFromModel", () => {
        it("retourne le matériau d'un modèle", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });

            const material = getMaterialFromModel(world, modelId);

            expect(material).toBeDefined();
            expect(material.albedoMap).toBeDefined();
            expect(material.metallicMap).toBeDefined();
        });

        it("lance une erreur si le modèle n'existe pas", () => {
            expect(() => {
                getMaterialFromModel(world, "non-existent");
            }).toThrow("Model not found");
        });

        it("lance une erreur si le matériau n'existe pas", () => {
            const modelId = createModel3D(world, {
                name: "Model",
                fileId: "test.glb",
                format: ModelFileFormat.GLB,
            });
            const materialId = world.models[modelId].materialId;
            delete world.materials[materialId];

            expect(() => {
                getMaterialFromModel(world, modelId);
            }).toThrow("Material not found");
        });
    });
});
