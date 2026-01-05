import {
    createLight,
    updateLightColor,
    updateLightIntensity,
    updateLightRange,
    updateLightType,
} from "@/src/core/ecs/engine/lightEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { World } from "@/src/core/ecs/world";
import { LightType } from "@/src/types";

describe("lightEngine", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("createLight", () => {
        it("crée une lumière avec les valeurs par défaut", () => {
            const lightId = createLight(world, { name: "Test Light" });

            expect(lightId).toBeDefined();
            expect(world.lights[lightId]).toEqual({
                color: { r: 1, g: 1, b: 1 },
                intensity: 1,
                range: 10,
                type: LightType.POINT,
            });
            expect(world.names[lightId]).toBe("Test Light");
        });

        it("crée une lumière avec des paramètres personnalisés", () => {
            const lightId = createLight(world, {
                name: "Custom Light",
                color: { r: 1, g: 0.5, b: 0 },
                intensity: 2.5,
                range: 20,
                type: LightType.DIRECTIONAL,
            });

            expect(world.lights[lightId]).toEqual({
                color: { r: 1, g: 0.5, b: 0 },
                intensity: 2.5,
                range: 20,
                type: LightType.DIRECTIONAL,
            });
        });

        it("crée un transform avec position par défaut", () => {
            const lightId = createLight(world, { name: "Light" });

            expect(world.transforms[lightId]).toEqual({
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            });
        });

        it("crée un transform avec position personnalisée", () => {
            const lightId = createLight(world, {
                name: "Light",
                position: { x: 5, y: 10, z: 15 },
            });

            expect(world.transforms[lightId].position).toEqual({
                x: 5,
                y: 10,
                z: 15,
            });
        });

        it("lance une erreur si le nom est vide", () => {
            expect(() => createLight(world, { name: "" })).toThrow(
                "Le nom de la lumière ne peut pas être vide"
            );
            expect(() => createLight(world, { name: "   " })).toThrow(
                "Le nom de la lumière ne peut pas être vide"
            );
        });

        it("lance une erreur si l'intensité est négative", () => {
            expect(() =>
                createLight(world, { name: "Light", intensity: -1 })
            ).toThrow("L'intensité doit être un nombre positif");
        });

        it("lance une erreur si l'intensité est NaN", () => {
            expect(() =>
                createLight(world, { name: "Light", intensity: NaN })
            ).toThrow("L'intensité doit être un nombre positif");
        });

        it("lance une erreur si la portée est négative ou 0", () => {
            expect(() =>
                createLight(world, { name: "Light", range: 0 })
            ).toThrow("La portée doit être un nombre strictement positif");
            expect(() =>
                createLight(world, { name: "Light", range: -5 })
            ).toThrow("La portée doit être un nombre strictement positif");
        });

        it("lance une erreur si la couleur a des valeurs invalides", () => {
            expect(() =>
                createLight(world, {
                    name: "Light",
                    color: { r: 2, g: 0.5, b: 0.5 },
                })
            ).toThrow("Les valeurs de couleur doivent être entre 0 et 1");

            expect(() =>
                createLight(world, {
                    name: "Light",
                    color: { r: -0.1, g: 0.5, b: 0.5 },
                })
            ).toThrow("Les valeurs de couleur doivent être entre 0 et 1");
        });

        it("lance une erreur si le type de lumière est invalide", () => {
            expect(() =>
                createLight(world, {
                    name: "Light",
                    type: "INVALID_TYPE" as any,
                })
            ).toThrow("Type de lumière invalide");
        });

        it("accepte tous les types de lumière valides", () => {
            const pointLight = createLight(world, {
                name: "Point",
                type: LightType.POINT,
            });
            expect(world.lights[pointLight].type).toBe(LightType.POINT);

            const directionalLight = createLight(world, {
                name: "Directional",
                type: LightType.DIRECTIONAL,
            });
            expect(world.lights[directionalLight].type).toBe(
                LightType.DIRECTIONAL
            );

            const spotLight = createLight(world, {
                name: "Spot",
                type: LightType.SPOT,
            });
            expect(world.lights[spotLight].type).toBe(LightType.SPOT);
        });
    });

    describe("updateLightColor", () => {
        let lightId: string;

        beforeEach(() => {
            lightId = createLight(world, { name: "Test Light" });
        });

        it("met à jour la couleur de la lumière", () => {
            updateLightColor(world, lightId, { r: 1, g: 0, b: 0 });

            expect(world.lights[lightId].color).toEqual({ r: 1, g: 0, b: 0 });
        });

        it("accepte des couleurs avec alpha", () => {
            updateLightColor(world, lightId, {
                r: 0.5,
                g: 0.5,
                b: 0.5,
                a: 0.8,
            });

            expect(world.lights[lightId].color).toEqual({
                r: 0.5,
                g: 0.5,
                b: 0.5,
                a: 0.8,
            });
        });

        it("lance une erreur si les valeurs sont hors limites", () => {
            expect(() =>
                updateLightColor(world, lightId, { r: 2, g: 0, b: 0 })
            ).toThrow("Les valeurs de couleur doivent être entre 0 et 1");

            expect(() =>
                updateLightColor(world, lightId, { r: 0, g: -0.5, b: 0 })
            ).toThrow("Les valeurs de couleur doivent être entre 0 et 1");
        });

        it("lance une erreur si alpha est hors limites", () => {
            expect(() =>
                updateLightColor(world, lightId, {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 1.5,
                })
            ).toThrow("Les valeurs de couleur doivent être entre 0 et 1");
        });

        it("lance une erreur si la lumière n'existe pas", () => {
            expect(() =>
                updateLightColor(world, "non-existent", { r: 1, g: 1, b: 1 })
            ).toThrow("La lumière avec l'ID \"non-existent\" n'existe pas");
        });
    });

    describe("updateLightIntensity", () => {
        let lightId: string;

        beforeEach(() => {
            lightId = createLight(world, { name: "Test Light" });
        });

        it("met à jour l'intensité de la lumière", () => {
            updateLightIntensity(world, lightId, 2.5);

            expect(world.lights[lightId].intensity).toBe(2.5);
        });

        it("accepte 0 comme intensité", () => {
            updateLightIntensity(world, lightId, 0);

            expect(world.lights[lightId].intensity).toBe(0);
        });

        it("lance une erreur si l'intensité est négative", () => {
            expect(() => updateLightIntensity(world, lightId, -1)).toThrow(
                "L'intensité doit être un nombre positif"
            );
        });

        it("lance une erreur si l'intensité est NaN", () => {
            expect(() => updateLightIntensity(world, lightId, NaN)).toThrow(
                "L'intensité doit être un nombre positif"
            );
        });

        it("lance une erreur si la lumière n'existe pas", () => {
            expect(() =>
                updateLightIntensity(world, "non-existent", 1)
            ).toThrow("La lumière avec l'ID \"non-existent\" n'existe pas");
        });
    });

    describe("updateLightRange", () => {
        let lightId: string;

        beforeEach(() => {
            lightId = createLight(world, { name: "Test Light" });
        });

        it("met à jour la portée de la lumière", () => {
            updateLightRange(world, lightId, 25);

            expect(world.lights[lightId].range).toBe(25);
        });

        it("accepte undefined pour la portée", () => {
            updateLightRange(world, lightId, undefined);

            expect(world.lights[lightId].range).toBeUndefined();
        });

        it("lance une erreur si la portée est 0", () => {
            expect(() => updateLightRange(world, lightId, 0)).toThrow(
                "La portée doit être un nombre strictement positif"
            );
        });

        it("lance une erreur si la portée est négative", () => {
            expect(() => updateLightRange(world, lightId, -5)).toThrow(
                "La portée doit être un nombre strictement positif"
            );
        });

        it("lance une erreur si la portée est NaN", () => {
            expect(() => updateLightRange(world, lightId, NaN)).toThrow(
                "La portée doit être un nombre strictement positif"
            );
        });

        it("lance une erreur si la lumière n'existe pas", () => {
            expect(() => updateLightRange(world, "non-existent", 10)).toThrow(
                "La lumière avec l'ID \"non-existent\" n'existe pas"
            );
        });
    });

    describe("updateLightType", () => {
        let lightId: string;

        beforeEach(() => {
            lightId = createLight(world, { name: "Test Light" });
        });

        it("met à jour le type de lumière vers DIRECTIONAL", () => {
            updateLightType(world, lightId, LightType.DIRECTIONAL);

            expect(world.lights[lightId].type).toBe(LightType.DIRECTIONAL);
        });

        it("met à jour le type de lumière vers SPOT", () => {
            updateLightType(world, lightId, LightType.SPOT);

            expect(world.lights[lightId].type).toBe(LightType.SPOT);
        });

        it("met à jour le type de lumière vers POINT", () => {
            lightId = createLight(world, {
                name: "Light",
                type: LightType.DIRECTIONAL,
            });
            updateLightType(world, lightId, LightType.POINT);

            expect(world.lights[lightId].type).toBe(LightType.POINT);
        });

        it("lance une erreur si le type est invalide", () => {
            expect(() =>
                updateLightType(world, lightId, "INVALID" as any)
            ).toThrow("Type de lumière invalide");
        });

        it("lance une erreur si la lumière n'existe pas", () => {
            expect(() =>
                updateLightType(world, "non-existent", LightType.POINT)
            ).toThrow("La lumière avec l'ID \"non-existent\" n'existe pas");
        });
    });
});
