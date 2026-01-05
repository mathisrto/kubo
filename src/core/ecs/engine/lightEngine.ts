import {
    Entity,
    Light,
    Name,
    Transform,
} from "@/src/core/ecs/components/indexComponent";
import { generateEntityId } from "@/src/core/ecs/engine/indexEngine";
import { World } from "@/src/core/ecs/world";
import { LightType } from "../../../types";

/**
 * Vérifie qu'une lumière existe dans le monde.
 *
 * @param world - L'instance du monde
 * @param id - L'identifiant de l'entité
 * @throws {Error} Si la lumière n'existe pas
 *
 * @example
 * ```ts
 * assertLight(world, lightId);
 * ```
 */
function assertLight(world: World, id: Entity): void {
    if (!world.lights[id]) {
        throw new Error(`La lumière avec l'ID "${id}" n'existe pas`);
    }
}

/**
 * Valide une couleur RGB(A).
 *
 * @param color - La couleur à valider
 * @throws {Error} Si les valeurs de couleur ne sont pas entre 0 et 1
 */
function validateColor(color: Light["color"]): void {
    const { r, g, b, a } = color;
    if (
        typeof r !== "number" ||
        typeof g !== "number" ||
        typeof b !== "number" ||
        r < 0 ||
        r > 1 ||
        g < 0 ||
        g > 1 ||
        b < 0 ||
        b > 1 ||
        (a !== undefined && (a < 0 || a > 1))
    ) {
        throw new Error("Les valeurs de couleur doivent être entre 0 et 1");
    }
}

/**
 * Valide l'intensité d'une lumière.
 *
 * @param intensity - L'intensité à valider
 * @throws {Error} Si l'intensité n'est pas un nombre positif
 */
function validateIntensity(intensity: number): void {
    if (typeof intensity !== "number" || isNaN(intensity) || intensity < 0) {
        throw new Error("L'intensité doit être un nombre positif");
    }
}

/**
 * Valide la portée d'une lumière.
 *
 * @param range - La portée à valider
 * @throws {Error} Si la portée n'est pas un nombre strictement positif
 */
function validateRange(range: number): void {
    if (typeof range !== "number" || isNaN(range) || range <= 0) {
        throw new Error("La portée doit être un nombre strictement positif");
    }
}

/**
 * Valide le type d'une lumière.
 *
 * @param type - Le type à valider
 * @throws {Error} Si le type n'est pas valide
 */
function validateLightType(type: LightType): void {
    if (!Object.values(LightType).includes(type)) {
        throw new Error(
            `Type de lumière invalide. Types valides: ${Object.values(
                LightType
            ).join(", ")}`
        );
    }
}

/**
 * Crée une nouvelle lumière dans le monde.
 *
 * @param world - L'instance du monde
 * @param input - Les paramètres de la lumière (nom requis)
 * @param input.name - Le nom de la lumière
 * @param input.color - La couleur RGB(A) de la lumière (par défaut: blanc)
 * @param input.intensity - L'intensité de la lumière (par défaut: 1)
 * @param input.range - La portée de la lumière (par défaut: 10)
 * @param input.type - Le type de lumière (par défaut: POINT)
 * @param input.position - La position initiale de la lumière
 * @returns L'identifiant de l'entité créée
 * @throws {Error} Si le nom est vide ou si les valeurs sont invalides
 *
 * @example
 * ```ts
 * const lightId = createLight(world, {
 *   name: "Main Light",
 *   color: { r: 1, g: 0.8, b: 0.6 },
 *   intensity: 2.5,
 *   type: LightType.DIRECTIONAL
 * });
 * ```
 */
export function createLight(
    world: World,
    input: Partial<Light> & { name: Name; position?: Transform["position"] }
): Entity {
    if (!input.name || input.name.trim() === "") {
        throw new Error("Le nom de la lumière ne peut pas être vide");
    }

    if (input.intensity !== undefined) {
        validateIntensity(input.intensity);
    }

    if (input.range !== undefined) {
        validateRange(input.range);
    }

    if (input.color) {
        validateColor(input.color);
    }

    if (input.type !== undefined) {
        validateLightType(input.type);
    }

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

/**
 * Met à jour la couleur d'une lumière.
 *
 * @param world - L'instance du monde
 * @param id - L'identifiant de l'entité lumière
 * @param color - La nouvelle couleur RGB(A) (valeurs entre 0 et 1)
 * @throws {Error} Si la lumière n'existe pas ou si les valeurs de couleur sont invalides
 *
 * @example
 * ```ts
 * updateLightColor(world, lightId, { r: 1, g: 0.5, b: 0 });
 * ```
 */
export function updateLightColor(
    world: World,
    id: Entity,
    color: Light["color"]
): void {
    assertLight(world, id);
    validateColor(color);
    world.lights[id].color = color;
}

/**
 * Met à jour l'intensité d'une lumière.
 *
 * @param world - L'instance du monde
 * @param id - L'identifiant de l'entité lumière
 * @param intensity - La nouvelle intensité (doit être un nombre positif)
 * @throws {Error} Si la lumière n'existe pas ou si l'intensité est invalide
 *
 * @example
 * ```ts
 * updateLightIntensity(world, lightId, 2.5);
 * ```
 */
export function updateLightIntensity(
    world: World,
    id: Entity,
    intensity: Light["intensity"]
): void {
    assertLight(world, id);
    validateIntensity(intensity);
    world.lights[id].intensity = intensity;
}

/**
 * Met à jour la portée d'une lumière.
 *
 * @param world - L'instance du monde
 * @param id - L'identifiant de l'entité lumière
 * @param range - La nouvelle portée (doit être un nombre strictement positif)
 * @throws {Error} Si la lumière n'existe pas ou si la portée est invalide
 *
 * @example
 * ```ts
 * updateLightRange(world, lightId, 15);
 * ```
 */
export function updateLightRange(
    world: World,
    id: Entity,
    range: Light["range"]
): void {
    assertLight(world, id);
    
    if (range !== undefined) {
        validateRange(range);
    }

    world.lights[id].range = range;
}

/**
 * Met à jour le type d'une lumière.
 *
 * @param world - L'instance du monde
 * @param id - L'identifiant de l'entité lumière
 * @param type - Le nouveau type de lumière (POINT, DIRECTIONAL ou SPOT)
 * @throws {Error} Si la lumière n'existe pas ou si le type est invalide
 *
 * @example
 * ```ts
 * updateLightType(world, lightId, LightType.DIRECTIONAL);
 * ```
 */
export function updateLightType(
    world: World,
    id: Entity,
    type: Light["type"]
): void {
    assertLight(world, id);
    validateLightType(type);
    world.lights[id].type = type;
}
