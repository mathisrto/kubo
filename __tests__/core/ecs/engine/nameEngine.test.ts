import { updateName } from "@/src/core/ecs/engine/nameEngine";
import {
    createOrResetScene,
    generateEntityId,
} from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";

describe("nameEngine", () => {
    let world: World;
    let entityId: string;

    beforeEach(() => {
        world = createOrResetScene();
        entityId = generateEntityId();
        world.names[entityId] = "Original Name";
    });

    describe("updateName", () => {
        it("met à jour le nom d'une entité", () => {
            updateName(world, entityId, "New Name");

            expect(world.names[entityId]).toBe("New Name");
        });

        it("remplace complètement l'ancien nom", () => {
            updateName(world, entityId, "Completely Different");

            expect(world.names[entityId]).toBe("Completely Different");
        });

        it("accepte un nom vide", () => {
            updateName(world, entityId, "");

            expect(world.names[entityId]).toBe("");
        });

        it("accepte un nom avec espaces", () => {
            updateName(world, entityId, "Name With Spaces");

            expect(world.names[entityId]).toBe("Name With Spaces");
        });

        it("accepte des caractères spéciaux", () => {
            updateName(world, entityId, "Name-with_special.chars!");

            expect(world.names[entityId]).toBe("Name-with_special.chars!");
        });

        it("accepte des noms longs", () => {
            const longName = "A".repeat(1000);
            updateName(world, entityId, longName);

            expect(world.names[entityId]).toBe(longName);
        });

        it("lance une erreur si l'entité n'a pas de composant Name", () => {
            const nonExistentId = generateEntityId();

            expect(() => updateName(world, nonExistentId, "Test")).toThrow(
                `Name component for entity ${nonExistentId} does not exist.`
            );
        });

        it("met à jour uniquement l'entité spécifiée", () => {
            const entityId2 = generateEntityId();
            world.names[entityId2] = "Other Entity";

            updateName(world, entityId, "Updated Name");

            expect(world.names[entityId]).toBe("Updated Name");
            expect(world.names[entityId2]).toBe("Other Entity");
        });

        it("n'affecte pas les autres composants", () => {
            world.transforms[entityId] = {
                position: { x: 1, y: 2, z: 3 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };

            updateName(world, entityId, "New Name");

            expect(world.transforms[entityId]).toEqual({
                position: { x: 1, y: 2, z: 3 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            });
        });

        it("accepte des caractères Unicode", () => {
            updateName(world, entityId, "名前 🚀 Имя");

            expect(world.names[entityId]).toBe("名前 🚀 Имя");
        });
    });
});
