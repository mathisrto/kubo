import { Environment } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

/**
 * Vérifie que l'environnement est bien initialisé dans le monde.
 * @param world - Instance du monde à vérifier.
 * @throws Si world.environment n'existe pas.
 */
function assertEnvironment(
    world: World
): asserts world is World & { environment: Environment } {
    if (!world.environment) {
        throw new Error("Environment is not initialized in world");
    }
}

/**
 * Met à jour l'intensité de l'environnement dans le monde.
 *
 * @param world - L'instance du monde à modifier
 * @param intensity - La valeur d'intensité de l'environnement (doit être un nombre positif)
 * @throws {Error} Si l'intensité n'est pas un nombre valide ou est négative
 *
 */
export function updateEnvironmentIntensity(
    world: World,
    intensity: Environment["intensity"]
) {
    assertEnvironment(world);

    if (typeof intensity !== "number" || isNaN(intensity)) {
        throw new Error("L'intensité doit être un nombre valide");
    }

    if (intensity < 0) {
        throw new Error("L'intensité ne peut pas être négative");
    }

    world.environment.intensity = intensity;
}

/**
 * Met à jour la carte d'environnement (environment map) dans le monde.
 *
 * @param world - L'instance du monde à modifier
 * @param fileId - Le fichier de la carte d'environnement (peut être undefined pour supprimer la map)
 *
 */
export function updateEnvironmentMap(
    world: World,
    fileId: Environment["environmentMap"]
) {
    assertEnvironment(world);
    world.environment.environmentMap = fileId;
}
