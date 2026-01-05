import {
    Entity,
    Light,
    Name,
    Transform,
} from "@/src/core/ecs/components/indexComponent";
import { generateEntityId } from "@/src/core/ecs/engine/indexEngine";
import { World } from "@/src/core/ecs/world";
import { LightType } from "../../../types";

export function createLight(
    world: World,
    input: Partial<Light> & { name: Name; position?: Transform["position"] }
): Entity {
    const id = generateEntityId();
    world.lights[id] = {
        color: input.color || { r: 1, g: 1, b: 1 },
        intensity: input.intensity || 1,
        range: input.range || 10,
        type: input.type || LightType.POINT,
    };
    world.transforms[id] = {
        position: input.position || { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
    };
    world.names[id] = input.name;
    return id;
}

export function updateLightColor(
    world: World,
    id: Entity,
    color: Light["color"]
): boolean {
    const l = world.lights[id];
    if (l) {
        l.color = color;
        return true;
    }
    return false;
}

export function updateLightIntensity(
    world: World,
    id: Entity,
    intensity: Light["intensity"]
): boolean {
    const l = world.lights[id];
    if (l) {
        l.intensity = intensity;
        return true;
    }
    return false;
}

export function updateLightRange(
    world: World,
    id: Entity,
    range: Light["range"]
): boolean {
    const l = world.lights[id];
    if (l) {
        l.range = range;
        return true;
    }
    return false;
}

export function updateLightType(
    world: World,
    id: Entity,
    type: Light["type"]
): boolean {
    const l = world.lights[id];
    if (l) {
        l.type = type;
        return true;
    }
    return false;
}
