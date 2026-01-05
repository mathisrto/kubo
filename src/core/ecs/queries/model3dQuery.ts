import { Entity } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function getModels3D(world: Readonly<World>): Entity[] {
    return Array.from(Object.keys(world.models));
}

export function getModel3DById(world: Readonly<World>, id: Entity) {
    return world.models[id];
}

export function getModel3DFileId(world: Readonly<World>, id: Entity) {
    return world.models[id]?.fileId;
}

export function getModel3DFormat(world: Readonly<World>, id: Entity) {
    return world.models[id]?.format;
}

export function getModel3DMaterialId(world: Readonly<World>, id: Entity) {
    return world.models[id]?.materialId;
}

export function getModel3DMetadata(world: Readonly<World>, id: Entity) {
    return world.models[id]?.metadata;
}
