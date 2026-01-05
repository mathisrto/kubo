import { World } from "@/src/core/ecs/world";
export function getCameraPosition(world: Readonly<World>) {
    return world.camera.position;
}

export function getCameraFOV(world: Readonly<World>) {
    return world.camera.fov;
}

export function getCameraNear(world: Readonly<World>) {
    return world.camera.near;
}

export function getCameraFar(world: Readonly<World>) {
    return world.camera.far;
}

export function getCameraType(world: Readonly<World>) {
    return world.camera.type;
}

export function getCameraTarget(world: Readonly<World>) {
    return world.camera.target;
}
