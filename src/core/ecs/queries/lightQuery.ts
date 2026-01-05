import { Entity } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function getLights(world: Readonly<World>) {
    return Array.from(Object.keys(world.lights));
}

export function getLightById(world: Readonly<World>, id: Entity) {
    return world.lights[id];
}

export function getLightType(world: Readonly<World>, id: Entity) {
    return world.lights[id]?.type;
}

export function getLightColor(world: Readonly<World>, id: Entity) {
    return world.lights[id]?.color;
}

export function getLightRange(world: Readonly<World>, id: Entity) {
    return world.lights[id]?.range;
}

export function getLightIntensity(world: Readonly<World>, id: Entity) {
    return world.lights[id]?.intensity;
}
