import {
    Entity,
    Model3D,
    Name,
    Transform,
} from "@/src/core/ecs/components/indexComponent";
import {
    createMaterial,
    generateEntityId,
} from "@/src/core/ecs/engine/indexEngine";
import { World } from "@/src/core/ecs/world";

export function createModel3D(
    world: World,
    input: Omit<Model3D, "materialId"> & { name: Name; transform?: Transform }
): Entity {
    const id = generateEntityId();
    const materialId = createMaterial(world, {
        name: `${input.name}_material`,
    });
    world.models[id] = {
        fileId: input.fileId,
        format: input.format,
        materialId: materialId,
        metadata: input.metadata,
    };

    if (input.transform) {
        world.transforms[id] = input.transform;
    } else {
        world.transforms[id] = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        };
    }
    world.names[id] = input.name;
    return id;
}
