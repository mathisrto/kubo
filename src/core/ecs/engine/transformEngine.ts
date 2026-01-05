import { Entity, Transform } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";

/**
 * Vérifie qu'une entité a un composant Transform.
 *
 * @param world - L'instance du monde
 * @param entityId - L'identifiant de l'entité
 * @throws {Error} Si l'entité n'a pas de composant Transform
 *
 * @example
 * ```ts
 * assertTransform(world, entityId);
 * ```
 */
function assertTransform(world: World, entityId: Entity): void {
    if (!world.transforms[entityId]) {
        throw new Error(
            `L'entité avec l'ID "${entityId}" n'a pas de composant Transform`
        );
    }
}

/**
 * Met à jour le composant Transform d'une entité.
 *
 * @param world - L'instance du monde
 * @param entityId - L'identifiant de l'entité
 * @param transform - Les propriétés du transform à mettre à jour (position, rotation, scale)
 * @throws {Error} Si l'entité n'a pas de composant Transform ou si les valeurs sont invalides
 *
 * @example
 * ```ts
 * updateTransform(world, entityId, {
 *   position: { x: 10, y: 5, z: 0 },
 *   rotation: { x: 0, y: 90, z: 0 }
 * });
 * ```
 */
export function updateTransform(
    world: World,
    entityId: Entity,
    transform: Partial<Transform>
): void {
    assertTransform(world, entityId);

    if (transform.position) updatePosition(world, entityId, transform.position);
    if (transform.rotation) updateRotation(world, entityId, transform.rotation);
    if (transform.scale) updateScale(world, entityId, transform.scale);
}

/**
 * Met à jour la position d'une entité.
 *
 * @param world - L'instance du monde
 * @param entityId - L'identifiant de l'entité
 * @param position - Les coordonnées de position à mettre à jour (x, y, z)
 * @throws {Error} Si l'entité n'a pas de composant Transform ou si les valeurs sont invalides
 *
 * @example
 * ```ts
 * updatePosition(world, entityId, { x: 10, y: 5 });
 * ```
 */
export function updatePosition(
    world: World,
    entityId: Entity,
    position: Partial<Transform["position"]>
): void {
    assertTransform(world, entityId);
    world.transforms[entityId].position = {
        ...world.transforms[entityId].position,
        ...position,
    };
}

/**
 * Met à jour la rotation d'une entité.
 *
 * @param world - L'instance du monde
 * @param entityId - L'identifiant de l'entité
 * @param rotation - Les angles de rotation à mettre à jour (x, y, z en degrés)
 * @throws {Error} Si l'entité n'a pas de composant Transform ou si les valeurs sont invalides
 *
 * @example
 * ```ts
 * updateRotation(world, entityId, { y: 90 });
 * ```
 */
export function updateRotation(
    world: World,
    entityId: Entity,
    rotation: Partial<Transform["rotation"]>
): void {
    assertTransform(world, entityId);
    world.transforms[entityId].rotation = {
        ...world.transforms[entityId].rotation,
        ...rotation,
    };
}

/**
 * Met à jour l'échelle d'une entité.
 *
 * @param world - L'instance du monde
 * @param entityId - L'identifiant de l'entité
 * @param scale - Les facteurs d'échelle à mettre à jour (x, y, z)
 * @throws {Error} Si l'entité n'a pas de composant Transform, si les valeurs sont invalides ou si l'échelle est 0
 *
 * @example
 * ```ts
 * updateScale(world, entityId, { x: 2, y: 2, z: 2 });
 * ```
 */
export function updateScale(
    world: World,
    entityId: Entity,
    scale: Partial<Transform["scale"]>
): void {
    assertTransform(world, entityId);
    if (
        (scale.x !== undefined && scale.x === 0) ||
        (scale.y !== undefined && scale.y === 0) ||
        (scale.z !== undefined && scale.z === 0)
    ) {
        throw new Error("Les composants de l'échelle ne peuvent pas être 0");
    }

    world.transforms[entityId].scale = {
        ...world.transforms[entityId].scale,
        ...scale,
    };
}
