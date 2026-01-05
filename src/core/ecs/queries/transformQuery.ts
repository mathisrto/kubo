import { Entity } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";
export function getTransform(world: Readonly<World>, id: Entity) {
    return world.transforms[id];
}

export function getPosition(world: Readonly<World>, id: Entity) {
    return world.transforms[id]?.position;
}

export function getRotation(world: Readonly<World>, id: Entity) {
    return world.transforms[id]?.rotation;
}

export function getScale(world: Readonly<World>, id: Entity) {
    return world.transforms[id]?.scale;
}
