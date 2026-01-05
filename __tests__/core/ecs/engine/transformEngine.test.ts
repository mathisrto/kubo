import {
    updatePosition,
    updateRotation,
    updateScale,
    updateTransform,
} from "@/src/core/ecs/engine/transformEngine";
import {
    createOrResetScene,
    generateEntityId,
} from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";

describe("transformEngine", () => {
    let world: World;
    let entityId: string;

    beforeEach(() => {
        world = createOrResetScene();
        entityId = generateEntityId();
        world.transforms[entityId] = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        };
    });

    describe("updatePosition", () => {
        it("met à jour la position complète", () => {
            updatePosition(world, entityId, { x: 10, y: 20, z: 30 });

            expect(world.transforms[entityId].position).toEqual({
                x: 10,
                y: 20,
                z: 30,
            });
        });

        it("met à jour partiellement la position (x)", () => {
            updatePosition(world, entityId, { x: 5 });

            expect(world.transforms[entityId].position).toEqual({
                x: 5,
                y: 0,
                z: 0,
            });
        });

        it("met à jour partiellement la position (y)", () => {
            updatePosition(world, entityId, { y: 10 });

            expect(world.transforms[entityId].position).toEqual({
                x: 0,
                y: 10,
                z: 0,
            });
        });

        it("met à jour partiellement la position (z)", () => {
            updatePosition(world, entityId, { z: 15 });

            expect(world.transforms[entityId].position).toEqual({
                x: 0,
                y: 0,
                z: 15,
            });
        });

        it("met à jour plusieurs composants à la fois", () => {
            updatePosition(world, entityId, { x: 5, z: 10 });

            expect(world.transforms[entityId].position).toEqual({
                x: 5,
                y: 0,
                z: 10,
            });
        });

        it("accepte des valeurs négatives", () => {
            updatePosition(world, entityId, { x: -5, y: -10, z: -15 });

            expect(world.transforms[entityId].position).toEqual({
                x: -5,
                y: -10,
                z: -15,
            });
        });

        it("lance une erreur si l'entité n'a pas de Transform", () => {
            const nonExistentId = generateEntityId();

            expect(() =>
                updatePosition(world, nonExistentId, { x: 10 })
            ).toThrow(
                `L'entité avec l'ID "${nonExistentId}" n'a pas de composant Transform`
            );
        });

        it("préserve les valeurs non mises à jour", () => {
            world.transforms[entityId].position = { x: 1, y: 2, z: 3 };

            updatePosition(world, entityId, { x: 10 });

            expect(world.transforms[entityId].position).toEqual({
                x: 10,
                y: 2,
                z: 3,
            });
        });
    });

    describe("updateRotation", () => {
        it("met à jour la rotation complète", () => {
            updateRotation(world, entityId, { x: 45, y: 90, z: 180 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 45,
                y: 90,
                z: 180,
            });
        });

        it("met à jour partiellement la rotation (x)", () => {
            updateRotation(world, entityId, { x: 30 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 30,
                y: 0,
                z: 0,
            });
        });

        it("met à jour partiellement la rotation (y)", () => {
            updateRotation(world, entityId, { y: 60 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 0,
                y: 60,
                z: 0,
            });
        });

        it("met à jour partiellement la rotation (z)", () => {
            updateRotation(world, entityId, { z: 90 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 0,
                y: 0,
                z: 90,
            });
        });

        it("accepte des valeurs négatives", () => {
            updateRotation(world, entityId, { x: -45, y: -90, z: -180 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: -45,
                y: -90,
                z: -180,
            });
        });

        it("accepte des valeurs > 360", () => {
            updateRotation(world, entityId, { x: 450, y: 720, z: 1000 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 450,
                y: 720,
                z: 1000,
            });
        });

        it("lance une erreur si l'entité n'a pas de Transform", () => {
            const nonExistentId = generateEntityId();

            expect(() =>
                updateRotation(world, nonExistentId, { x: 90 })
            ).toThrow(
                `L'entité avec l'ID "${nonExistentId}" n'a pas de composant Transform`
            );
        });

        it("préserve les valeurs non mises à jour", () => {
            world.transforms[entityId].rotation = { x: 10, y: 20, z: 30 };

            updateRotation(world, entityId, { y: 90 });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 10,
                y: 90,
                z: 30,
            });
        });
    });

    describe("updateScale", () => {
        it("met à jour l'échelle complète", () => {
            updateScale(world, entityId, { x: 2, y: 3, z: 4 });

            expect(world.transforms[entityId].scale).toEqual({
                x: 2,
                y: 3,
                z: 4,
            });
        });

        it("met à jour partiellement l'échelle (x)", () => {
            updateScale(world, entityId, { x: 2 });

            expect(world.transforms[entityId].scale).toEqual({
                x: 2,
                y: 1,
                z: 1,
            });
        });

        it("met à jour partiellement l'échelle (y)", () => {
            updateScale(world, entityId, { y: 0.5 });

            expect(world.transforms[entityId].scale).toEqual({
                x: 1,
                y: 0.5,
                z: 1,
            });
        });

        it("met à jour partiellement l'échelle (z)", () => {
            updateScale(world, entityId, { z: 3 });

            expect(world.transforms[entityId].scale).toEqual({
                x: 1,
                y: 1,
                z: 3,
            });
        });

        it("accepte des valeurs négatives", () => {
            updateScale(world, entityId, { x: -1, y: -2, z: -3 });

            expect(world.transforms[entityId].scale).toEqual({
                x: -1,
                y: -2,
                z: -3,
            });
        });

        it("lance une erreur si x est 0", () => {
            expect(() => updateScale(world, entityId, { x: 0 })).toThrow(
                "Les composants de l'échelle ne peuvent pas être 0"
            );
        });

        it("lance une erreur si y est 0", () => {
            expect(() => updateScale(world, entityId, { y: 0 })).toThrow(
                "Les composants de l'échelle ne peuvent pas être 0"
            );
        });

        it("lance une erreur si z est 0", () => {
            expect(() => updateScale(world, entityId, { z: 0 })).toThrow(
                "Les composants de l'échelle ne peuvent pas être 0"
            );
        });

        it("lance une erreur si l'entité n'a pas de Transform", () => {
            const nonExistentId = generateEntityId();

            expect(() => updateScale(world, nonExistentId, { x: 2 })).toThrow(
                `L'entité avec l'ID "${nonExistentId}" n'a pas de composant Transform`
            );
        });

        it("accepte des valeurs décimales", () => {
            updateScale(world, entityId, { x: 0.5, y: 1.5, z: 2.25 });

            expect(world.transforms[entityId].scale).toEqual({
                x: 0.5,
                y: 1.5,
                z: 2.25,
            });
        });

        it("préserve les valeurs non mises à jour", () => {
            world.transforms[entityId].scale = { x: 2, y: 3, z: 4 };

            updateScale(world, entityId, { z: 5 });

            expect(world.transforms[entityId].scale).toEqual({
                x: 2,
                y: 3,
                z: 5,
            });
        });
    });

    describe("updateTransform", () => {
        it("met à jour position, rotation et scale en une seule fois", () => {
            updateTransform(world, entityId, {
                position: { x: 10, y: 20, z: 30 },
                rotation: { x: 45, y: 90, z: 180 },
                scale: { x: 2, y: 3, z: 4 },
            });

            expect(world.transforms[entityId]).toEqual({
                position: { x: 10, y: 20, z: 30 },
                rotation: { x: 45, y: 90, z: 180 },
                scale: { x: 2, y: 3, z: 4 },
            });
        });

        it("met à jour uniquement la position", () => {
            updateTransform(world, entityId, {
                position: { x: 5, y: 10, z: 15 },
            });

            expect(world.transforms[entityId].position).toEqual({
                x: 5,
                y: 10,
                z: 15,
            });
            expect(world.transforms[entityId].rotation).toEqual({
                x: 0,
                y: 0,
                z: 0,
            });
            expect(world.transforms[entityId].scale).toEqual({
                x: 1,
                y: 1,
                z: 1,
            });
        });

        it("met à jour uniquement la rotation", () => {
            updateTransform(world, entityId, {
                rotation: { x: 30, y: 60, z: 90 },
            });

            expect(world.transforms[entityId].rotation).toEqual({
                x: 30,
                y: 60,
                z: 90,
            });
        });

        it("met à jour uniquement l'échelle", () => {
            updateTransform(world, entityId, {
                scale: { x: 2, y: 2, z: 2 },
            });

            expect(world.transforms[entityId].scale).toEqual({
                x: 2,
                y: 2,
                z: 2,
            });
        });

        it("met à jour position et rotation", () => {
            updateTransform(world, entityId, {
                position: { x: 1, y: 2, z: 3 },
                rotation: { x: 10, y: 20, z: 30 },
            });

            expect(world.transforms[entityId].position).toEqual({
                x: 1,
                y: 2,
                z: 3,
            });
            expect(world.transforms[entityId].rotation).toEqual({
                x: 10,
                y: 20,
                z: 30,
            });
        });

        it("lance une erreur si l'entité n'a pas de Transform", () => {
            const nonExistentId = generateEntityId();

            expect(() =>
                updateTransform(world, nonExistentId, {
                    position: { x: 10, y: 20, z: 30 },
                })
            ).toThrow(
                `L'entité avec l'ID "${nonExistentId}" n'a pas de composant Transform`
            );
        });

        it("ne fait rien si aucune propriété n'est fournie", () => {
            const original = { ...world.transforms[entityId] };

            updateTransform(world, entityId, {});

            expect(world.transforms[entityId]).toEqual(original);
        });
    });
});
