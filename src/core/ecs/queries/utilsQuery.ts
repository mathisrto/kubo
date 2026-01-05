import { Entity } from "../components/indexComponent";
import { World } from "../world";

export function isLightEntity(world: Readonly<World>, id: Entity): boolean {
    return world.lights[id] !== undefined;
}

export function isModel3DEntity(world: Readonly<World>, id: Entity): boolean {
    return world.models[id] !== undefined;
}
