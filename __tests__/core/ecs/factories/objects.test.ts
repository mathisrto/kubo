import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    createCube,
    createCylinder,
    createPlane,
    createSphere,
} from "@/src/core/ecs/factories/objects";
import { World } from "@/src/core/ecs/world";
import { ModelFileFormat } from "@/src/types";

describe("objects factory", () => {
    let world: World;

    beforeEach(() => {
        world = createOrResetScene();
    });

    describe("createCube", () => {
        it("crée un cube avec les bonnes propriétés", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            expect(cubeId).toBeDefined();
            expect(world.models[cubeId]).toBeDefined();
        });

        it("définit le nom du cube", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            expect(world.names[cubeId]).toBe("Cube");
        });

        it("utilise le format GENERATED", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            expect(world.models[cubeId].format).toBe(ModelFileFormat.GENERATED);
        });

        it("utilise le fileId builtin:cube", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            expect(world.models[cubeId].fileId).toBe("builtin:cube");
        });

        it("ajoute les metadata avec primitive cube", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            expect(world.models[cubeId].metadata).toEqual({
                primitive: "cube",
            });
        });

        it("crée un matériau pour le cube", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            const materialId = world.models[cubeId].materialId;
            expect(materialId).toBeDefined();
            expect(world.materials[materialId]).toBeDefined();
        });

        it("crée une transformation par défaut", () => {
            createCube(world);

            const cubeId = Object.keys(world.models)[0];
            expect(world.transforms[cubeId]).toBeDefined();
            expect(world.transforms[cubeId].position).toEqual({
                x: 0,
                y: 0,
                z: 0,
            });
            expect(world.transforms[cubeId].rotation).toEqual({
                x: 0,
                y: 0,
                z: 0,
            });
            expect(world.transforms[cubeId].scale).toEqual({
                x: 1,
                y: 1,
                z: 1,
            });
        });
    });

    describe("createSphere", () => {
        it("crée une sphère avec les bonnes propriétés", () => {
            createSphere(world);

            const sphereId = Object.keys(world.models)[0];
            expect(sphereId).toBeDefined();
            expect(world.models[sphereId]).toBeDefined();
        });

        it("définit le nom de la sphère", () => {
            createSphere(world);

            const sphereId = Object.keys(world.models)[0];
            expect(world.names[sphereId]).toBe("Sphere");
        });

        it("utilise le format GENERATED", () => {
            createSphere(world);

            const sphereId = Object.keys(world.models)[0];
            expect(world.models[sphereId].format).toBe(
                ModelFileFormat.GENERATED
            );
        });

        it("utilise le fileId builtin:sphere", () => {
            createSphere(world);

            const sphereId = Object.keys(world.models)[0];
            expect(world.models[sphereId].fileId).toBe("builtin:sphere");
        });

        it("ajoute les metadata avec primitive sphere", () => {
            createSphere(world);

            const sphereId = Object.keys(world.models)[0];
            expect(world.models[sphereId].metadata).toEqual({
                primitive: "sphere",
            });
        });

        it("crée un matériau pour la sphère", () => {
            createSphere(world);

            const sphereId = Object.keys(world.models)[0];
            const materialId = world.models[sphereId].materialId;
            expect(materialId).toBeDefined();
            expect(world.materials[materialId]).toBeDefined();
        });
    });

    describe("createCylinder", () => {
        it("crée un cylindre avec les bonnes propriétés", () => {
            createCylinder(world);

            const cylinderId = Object.keys(world.models)[0];
            expect(cylinderId).toBeDefined();
            expect(world.models[cylinderId]).toBeDefined();
        });

        it("définit le nom du cylindre", () => {
            createCylinder(world);

            const cylinderId = Object.keys(world.models)[0];
            expect(world.names[cylinderId]).toBe("Cylinder");
        });

        it("utilise le format GENERATED", () => {
            createCylinder(world);

            const cylinderId = Object.keys(world.models)[0];
            expect(world.models[cylinderId].format).toBe(
                ModelFileFormat.GENERATED
            );
        });

        it("utilise le fileId builtin:cylinder", () => {
            createCylinder(world);

            const cylinderId = Object.keys(world.models)[0];
            expect(world.models[cylinderId].fileId).toBe("builtin:cylinder");
        });

        it("ajoute les metadata avec primitive cylinder", () => {
            createCylinder(world);

            const cylinderId = Object.keys(world.models)[0];
            expect(world.models[cylinderId].metadata).toEqual({
                primitive: "cylinder",
            });
        });

        it("crée un matériau pour le cylindre", () => {
            createCylinder(world);

            const cylinderId = Object.keys(world.models)[0];
            const materialId = world.models[cylinderId].materialId;
            expect(materialId).toBeDefined();
            expect(world.materials[materialId]).toBeDefined();
        });
    });

    describe("createPlane", () => {
        it("crée un plan avec les bonnes propriétés", () => {
            createPlane(world);

            const planeId = Object.keys(world.models)[0];
            expect(planeId).toBeDefined();
            expect(world.models[planeId]).toBeDefined();
        });

        it("définit le nom du plan", () => {
            createPlane(world);

            const planeId = Object.keys(world.models)[0];
            expect(world.names[planeId]).toBe("Plane");
        });

        it("utilise le format GENERATED", () => {
            createPlane(world);

            const planeId = Object.keys(world.models)[0];
            expect(world.models[planeId].format).toBe(
                ModelFileFormat.GENERATED
            );
        });

        it("utilise le fileId builtin:plane", () => {
            createPlane(world);

            const planeId = Object.keys(world.models)[0];
            expect(world.models[planeId].fileId).toBe("builtin:plane");
        });

        it("ajoute les metadata avec primitive plane", () => {
            createPlane(world);

            const planeId = Object.keys(world.models)[0];
            expect(world.models[planeId].metadata).toEqual({
                primitive: "plane",
            });
        });

        it("crée un matériau pour le plan", () => {
            createPlane(world);

            const planeId = Object.keys(world.models)[0];
            const materialId = world.models[planeId].materialId;
            expect(materialId).toBeDefined();
            expect(world.materials[materialId]).toBeDefined();
        });
    });

    describe("création de multiples objets", () => {
        it("crée plusieurs objets dans le même monde", () => {
            createCube(world);
            createSphere(world);
            createCylinder(world);
            createPlane(world);

            const modelIds = Object.keys(world.models);
            expect(modelIds).toHaveLength(4);
        });

        it("chaque objet a un ID unique", () => {
            createCube(world);
            createSphere(world);
            createCylinder(world);

            const modelIds = Object.keys(world.models);
            const uniqueIds = new Set(modelIds);
            expect(uniqueIds.size).toBe(3);
        });

        it("conserve les noms distincts", () => {
            createCube(world);
            createSphere(world);
            createCylinder(world);
            createPlane(world);

            const names = Object.values(world.names);
            expect(names).toContain("Cube");
            expect(names).toContain("Sphere");
            expect(names).toContain("Cylinder");
            expect(names).toContain("Plane");
        });
    });
});
