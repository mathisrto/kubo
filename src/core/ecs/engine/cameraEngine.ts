import { Camera } from "@engine/components/indexComponent";
import { World } from "@engine/world";

/**
 * Vérifie que la caméra est bien initialisée dans le monde.
 * @param world - Instance du monde à vérifier.
 * @throws Si world.camera n'existe pas.
 */
function assertCamera(
    world: World
): asserts world is World & { camera: Camera } {
    if (!world.camera) {
        throw new Error("Camera is not initialized in world");
    }
}

/**
 * Met à jour la position de la caméra.
 * @param world - Instance du monde contenant la caméra.
 * @param position - Nouvelle position (Vector3).
 */
export function updateCameraPosition(
    world: World,
    position: Camera["position"]
) {
    assertCamera(world);
    world.camera.position = position;
}

/**
 * Met à jour la cible (target) de la caméra.
 * @param world - Instance du monde contenant la caméra.
 * @param target - Nouvelle cible (Vector3).
 */
export function updateCameraTarget(world: World, target: Camera["target"]) {
    assertCamera(world);
    world.camera.target = target;
}

/**
 * Met à jour le champ de vision (FOV) de la caméra.
 * @param world - Instance du monde contenant la caméra.
 * @param fov - Nouveau FOV en degrés (0 < fov < 180).
 * @throws Si le FOV n'est pas valide.
 */
export function updateCameraFOV(world: World, fov: Camera["fov"]) {
    assertCamera(world);
    if (!Number.isFinite(fov) || fov <= 0 || fov >= 180) {
        throw new Error(`Invalid FOV: ${fov}`);
    }
    world.camera.fov = fov;
}

/**
 * Met à jour le plan proche (near) de la caméra.
 * @param world - Instance du monde contenant la caméra.
 * @param near - Nouveau near plane (> 0 et < far).
 * @throws Si near est invalide ou supérieur au far plane.
 */
export function updateCameraNear(world: World, near: Camera["near"]) {
    assertCamera(world);
    if (!Number.isFinite(near) || near <= 0) {
        throw new Error(`Invalid near plane: ${near}`);
    }
    if (world.camera.far !== undefined && near >= world.camera.far) {
        throw new Error("Near plane must be smaller than far plane");
    }
    world.camera.near = near;
}

/**
 * Met à jour le plan lointain (far) de la caméra.
 * @param world - Instance du monde contenant la caméra.
 * @param far - Nouveau far plane (> near).
 * @throws Si far est invalide ou inférieur au near plane.
 */
export function updateCameraFar(world: World, far: Camera["far"]) {
    assertCamera(world);
    if (!Number.isFinite(far) || far <= 0) {
        throw new Error(`Invalid far plane: ${far}`);
    }
    if (world.camera.near !== undefined && far <= world.camera.near) {
        throw new Error("Far plane must be greater than near plane");
    }
    world.camera.far = far;
}

/**
 * Met à jour le type de la caméra.
 * @param world - Instance du monde contenant la caméra.
 * @param type - Nouveau type de caméra (CameraType).
 */
export function updateCameraType(world: World, type: Camera["type"]) {
    assertCamera(world);
    world.camera.type = type;
}
