import { Environment } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function updateEnvironmentIntensity(
    world: World,
    intensity: Environment["intensity"]
) {
    world.environment.intensity = intensity;
}
