import { createMaterial } from "@/src/core/ecs/engine/materialEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";
import { DEFAULT_TEXTURE } from "@/src/types";

describe("materialEngine", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("createMaterial", () => {
        it("crée un matériau avec un nom", () => {
            const materialId = createMaterial(world, { name: "Test Material" });

            expect(materialId).toBeDefined();
            expect(world.names[materialId]).toBe("Test Material");
        });

        it("crée toutes les maps de texture par défaut", () => {
            const materialId = createMaterial(world, { name: "Material" });

            expect(world.materials[materialId]).toBeDefined();
            expect(world.materials[materialId].albedoMap).toBeDefined();
            expect(world.materials[materialId].normalMap).toBeDefined();
            expect(world.materials[materialId].roughnessMap).toBeDefined();
            expect(world.materials[materialId].metallicMap).toBeDefined();
            expect(world.materials[materialId].aoMap).toBeDefined();
            expect(world.materials[materialId].emissiveMap).toBeDefined();
        });

        it("crée des textures avec DEFAULT_TEXTURE", () => {
            const materialId = createMaterial(world, { name: "Material" });

            const albedoTextureId = world.materials[materialId].albedoMap;
            const normalTextureId = world.materials[materialId].normalMap;
            const roughnessTextureId = world.materials[materialId].roughnessMap;
            const metallicTextureId = world.materials[materialId].metallicMap;
            const aoTextureId = world.materials[materialId].aoMap;
            const emissiveTextureId = world.materials[materialId].emissiveMap;

            expect(world.textures[albedoTextureId].fileId).toBe(
                DEFAULT_TEXTURE
            );
            expect(world.textures[normalTextureId].fileId).toBe(
                DEFAULT_TEXTURE
            );
            expect(world.textures[roughnessTextureId].fileId).toBe(
                DEFAULT_TEXTURE
            );
            expect(world.textures[metallicTextureId].fileId).toBe(
                DEFAULT_TEXTURE
            );
            expect(world.textures[aoTextureId].fileId).toBe(DEFAULT_TEXTURE);
            expect(world.textures[emissiveTextureId].fileId).toBe(
                DEFAULT_TEXTURE
            );
        });

        it("génère des identifiants uniques pour chaque matériau", () => {
            const material1 = createMaterial(world, { name: "Material 1" });
            const material2 = createMaterial(world, { name: "Material 2" });
            const material3 = createMaterial(world, { name: "Material 3" });

            expect(material1).not.toBe(material2);
            expect(material2).not.toBe(material3);
            expect(material1).not.toBe(material3);
        });

        it("crée des textures distinctes pour chaque map", () => {
            const materialId = createMaterial(world, { name: "Material" });

            const textureIds = [
                world.materials[materialId].albedoMap,
                world.materials[materialId].normalMap,
                world.materials[materialId].roughnessMap,
                world.materials[materialId].metallicMap,
                world.materials[materialId].aoMap,
                world.materials[materialId].emissiveMap,
            ];

            const uniqueIds = new Set(textureIds);
            expect(uniqueIds.size).toBe(6);
        });

        it("accepte différents noms de matériaux", () => {
            const mat1 = createMaterial(world, { name: "Wood" });
            const mat2 = createMaterial(world, { name: "Metal" });
            const mat3 = createMaterial(world, { name: "Glass" });

            expect(world.names[mat1]).toBe("Wood");
            expect(world.names[mat2]).toBe("Metal");
            expect(world.names[mat3]).toBe("Glass");
        });

        it("retourne un identifiant au format 'e{number}'", () => {
            const materialId = createMaterial(world, { name: "Test" });

            expect(materialId).toMatch(/^e\d+$/);
        });

        it("crée des matériaux indépendants", () => {
            const material1 = createMaterial(world, { name: "Material 1" });
            const material2 = createMaterial(world, { name: "Material 2" });

            // Modifier le premier matériau
            world.materials[material1].albedoMap = "custom-texture-id";

            // Vérifier que le second n'est pas affecté
            expect(world.materials[material2].albedoMap).not.toBe(
                "custom-texture-id"
            );
        });

        it("stocke le matériau dans world.materials", () => {
            const materialId = createMaterial(world, { name: "Material" });

            expect(world.materials[materialId]).toBeDefined();
        });

        it("stocke le nom dans world.names", () => {
            const materialId = createMaterial(world, { name: "My Material" });

            expect(world.names[materialId]).toBe("My Material");
        });

        it("accepte des noms avec caractères spéciaux", () => {
            const materialId = createMaterial(world, {
                name: "Material_v2.final!",
            });

            expect(world.names[materialId]).toBe("Material_v2.final!");
        });

        it("accepte des noms longs", () => {
            const longName = "A".repeat(100);
            const materialId = createMaterial(world, { name: longName });

            expect(world.names[materialId]).toBe(longName);
        });

        it("crée les 6 types de maps requis", () => {
            const materialId = createMaterial(world, { name: "Material" });

            const material = world.materials[materialId];
            expect(material).toHaveProperty("albedoMap");
            expect(material).toHaveProperty("normalMap");
            expect(material).toHaveProperty("roughnessMap");
            expect(material).toHaveProperty("metallicMap");
            expect(material).toHaveProperty("aoMap");
            expect(material).toHaveProperty("emissiveMap");
        });
    });
});
