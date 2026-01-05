import { World } from "@/src/core/ecs/world";
export function getEnvironmentIntensity(world: Readonly<World>) {
    return world.environment.intensity;
}

export function getEnvironmentMap(world: Readonly<World>) {
    return world.environment.environmentMap;
}
