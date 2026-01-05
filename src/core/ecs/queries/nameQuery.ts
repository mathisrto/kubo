import { Entity } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";
export function getName(world: Readonly<World>, id: Entity) {
    return world.names[id];
}
