import { Entity, Name } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function updateName(world: World, entityId: Entity, name: Name): void {
    const n = world.names[entityId];
    if (n) {
        world.names[entityId] = name;
    } else {
        throw new Error(
            `Name component for entity ${entityId} does not exist.`
        );
    }
}
