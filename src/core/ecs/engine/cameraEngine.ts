import { Camera } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

export function updateCameraPosition(
    world: World,
    position: Camera["position"]
) {
    world.camera.position = position;
}
export function updateCameraTarget(world: World, target: Camera["target"]) {
    world.camera.target = target;
}
export function updateCameraFOV(world: World, fov: Camera["fov"]) {
    world.camera.fov = fov;
}
export function updateCameraNear(world: World, near: Camera["near"]) {
    world.camera.near = near;
}
export function updateCameraFar(world: World, far: Camera["far"]) {
    world.camera.far = far;
}
export function updateCameraType(world: World, type: Camera["type"]) {
    world.camera.type = type;
}
