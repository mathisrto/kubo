import { Entity, Transform } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function updateTransform(
    world: World,
    entityId: Entity,
    transform: Partial<Transform>
): boolean {
    const t = world.transforms[entityId];
    if (t) {
        if (transform.position) t.position = transform.position;
        if (transform.rotation) t.rotation = transform.rotation;
        if (transform.scale) t.scale = transform.scale;
        return true;
    }
    return false;
}

export function updatePosition(
    world: World,
    entityId: Entity,
    position: Partial<Transform["position"]>
): boolean {
    const t = world.transforms[entityId];
    if (t) {
        t.position = { ...t.position, ...position };
        return true;
    }
    return false;
}

export function updateRotation(
    world: World,
    entityId: Entity,
    rotation: Partial<Transform["rotation"]>
): boolean {
    const t = world.transforms[entityId];
    if (t) {
        t.rotation = { ...t.rotation, ...rotation };
        return true;
    }
    return false;
}

export function updateScale(
    world: World,
    entityId: Entity,
    scale: Partial<Transform["scale"]>
): boolean {
    const t = world.transforms[entityId];
    if (t) {
        t.scale = { ...t.scale, ...scale };
        return true;
    }
    return false;
}
