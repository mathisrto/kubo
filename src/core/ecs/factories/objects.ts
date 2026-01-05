import { ModelFileFormat } from "../../../types";
import { createModel3D } from "../engine/indexEngine";
import { World } from "../world";

export function createCube(world: World) {
    createModel3D(world, {
        fileId: "builtin:cube",
        format: ModelFileFormat.GENERATED,
        name: "Cube",
        metadata: { primitive: "cube" },
    });
}

export function createSphere(world: World) {
    createModel3D(world, {
        fileId: "builtin:sphere",
        format: ModelFileFormat.GENERATED,
        name: "Sphere",
        metadata: { primitive: "sphere" },
    });
}

export function createCylinder(world: World) {
    createModel3D(world, {
        fileId: "builtin:cylinder",
        format: ModelFileFormat.GENERATED,
        name: "Cylinder",
        metadata: { primitive: "cylinder" },
    });
}

export function createPlane(world: World) {
    createModel3D(world, {
        fileId: "builtin:plane",
        format: ModelFileFormat.GENERATED,
        name: "Plane",
        metadata: { primitive: "plane" },
    });
}
