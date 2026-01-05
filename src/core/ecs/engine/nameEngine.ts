import { Entity, Name } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function updateName(
    world: World,
    entityId: Entity,
    name: Name
): boolean {
    const n = world.names[entityId];
    if (n) {
        world.names[entityId] = name;
        return true;
    }
    return false;
}
