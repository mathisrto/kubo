import { createTexture } from "@/src/core/ecs/engine/textureEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";

describe("textureEngine", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("createTexture", () => {
        it("crée une texture avec un fileId", () => {
            const textureId = createTexture(world, {
                fileId: "texture.jpg",
            });

            expect(textureId).toBeDefined();
            expect(world.textures[textureId]).toEqual({
                fileId: "texture.jpg",
            });
        });

        it("génère un identifiant unique pour chaque texture", () => {
            const texture1 = createTexture(world, { fileId: "tex1.jpg" });
            const texture2 = createTexture(world, { fileId: "tex2.png" });
            const texture3 = createTexture(world, { fileId: "tex3.hdr" });

            expect(texture1).not.toBe(texture2);
            expect(texture2).not.toBe(texture3);
            expect(texture1).not.toBe(texture3);
        });

        it("stocke les textures dans le monde", () => {
            const textureId = createTexture(world, { fileId: "albedo.jpg" });

            expect(world.textures[textureId]).toBeDefined();
            expect(world.textures[textureId].fileId).toBe("albedo.jpg");
        });

        it("accepte différents types de fichiers", () => {
            const jpg = createTexture(world, { fileId: "image.jpg" });
            const png = createTexture(world, { fileId: "image.png" });
            const hdr = createTexture(world, { fileId: "env.hdr" });
            const exr = createTexture(world, { fileId: "env.exr" });

            expect(world.textures[jpg].fileId).toBe("image.jpg");
            expect(world.textures[png].fileId).toBe("image.png");
            expect(world.textures[hdr].fileId).toBe("env.hdr");
            expect(world.textures[exr].fileId).toBe("env.exr");
        });

        it("crée des textures indépendantes", () => {
            const texture1 = createTexture(world, { fileId: "tex1.jpg" });
            const texture2 = createTexture(world, { fileId: "tex2.jpg" });

            world.textures[texture1].fileId = "modified.jpg";

            expect(world.textures[texture1].fileId).toBe("modified.jpg");
            expect(world.textures[texture2].fileId).toBe("tex2.jpg");
        });

        it("accepte des chemins de fichiers", () => {
            const textureId = createTexture(world, {
                fileId: "path/to/texture.jpg",
            });

            expect(world.textures[textureId].fileId).toBe(
                "path/to/texture.jpg"
            );
        });

        it("accepte des IDs de fichiers avec des caractères spéciaux", () => {
            const textureId = createTexture(world, {
                fileId: "texture-123_v2.final.jpg",
            });

            expect(world.textures[textureId].fileId).toBe(
                "texture-123_v2.final.jpg"
            );
        });

        it("crée plusieurs textures pour le même fichier", () => {
            const texture1 = createTexture(world, { fileId: "same.jpg" });
            const texture2 = createTexture(world, { fileId: "same.jpg" });

            expect(texture1).not.toBe(texture2);
            expect(world.textures[texture1].fileId).toBe("same.jpg");
            expect(world.textures[texture2].fileId).toBe("same.jpg");
        });

        it("retourne un identifiant au format 'e{number}'", () => {
            const textureId = createTexture(world, { fileId: "test.jpg" });

            expect(textureId).toMatch(/^e\d+$/);
        });

        it("copie l'objet input sans référence partagée", () => {
            const input = { fileId: "texture.jpg" };
            const textureId = createTexture(world, input);

            input.fileId = "modified.jpg";

            expect(world.textures[textureId].fileId).toBe("texture.jpg");
        });
    });
});
