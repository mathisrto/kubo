import { Entity } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function getMaterialAlbedoMap(world: Readonly<World>, id: Entity) {
    return world.materials[id]?.albedoMap;
}

export function getMaterialMetallicsMap(world: Readonly<World>, id: Entity) {
    return world.materials[id]?.metallicMap;
}

export function getMaterialRoughnessMap(world: Readonly<World>, id: Entity) {
    return world.materials[id]?.roughnessMap;
}

export function getMaterialNormalMap(world: Readonly<World>, id: Entity) {
    return world.materials[id]?.normalMap;
}

export function getMaterialAOMap(world: Readonly<World>, id: Entity) {
    return world.materials[id]?.aoMap;
}

export function getMaterialEmissiveMap(world: Readonly<World>, id: Entity) {
    return world.materials[id]?.emissiveMap;
}

export function getMaterialFromModel(world: Readonly<World>, modelId: Entity) {
    const model = world.models[modelId];
    if (!model) throw new Error("Model not found");

    const material = world.materials[model.materialId];
    if (!material) throw new Error("Material not found");

    return material;
}
