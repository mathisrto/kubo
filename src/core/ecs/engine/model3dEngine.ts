import {
    Entity,
    Model3D,
    Name,
    Transform,
} from "@/src/core/ecs/components/indexComponent";
import {
    createMaterial,
    generateEntityId,
} from "@/src/core/ecs/engine/indexEngine";
import { World } from "@/src/core/ecs/world";

export function createModel3D(
    world: World,
    input: Omit<Model3D, "materialId"> & { name: Name; transform?: Transform },
): Entity {
    const id = generateEntityId();
    const materialId = createMaterial(world, {
        name: `${input.name}_material`,
    });
    world.models[id] = {
        fileId: input.fileId,
        format: input.format,
        materialId: materialId,
        metadata: input.metadata,
    };

    if (input.transform) {
        world.transforms[id] = input.transform;
    } else {
        world.transforms[id] = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        };
    }
    world.names[id] = input.name;
    return id;
}

/**
 * Enregistre les animations disponibles pour un modèle 3D.
 * Appelé depuis le renderer quand le GLTF est chargé.
 */
export function setModel3DAnimations(
    world: World,
    modelId: Entity,
    animationNames: string[],
): void {
    const model = world.models[modelId];
    if (!model) return;

    model.animation = {
        available: animationNames,
        current: animationNames.length > 0 ? animationNames[0] : null,
        playing: false,
    };
}

/**
 * Joue une animation spécifique sur un modèle 3D.
 */
export function playModel3DAnimation(
    world: World,
    modelId: Entity,
    animationName: string,
): void {
    const model = world.models[modelId];
    if (!model?.animation) return;
    if (!model.animation.available.includes(animationName)) return;

    model.animation.current = animationName;
    model.animation.playing = true;
}

/**
 * Arrête l'animation en cours sur un modèle 3D.
 */
export function stopModel3DAnimation(world: World, modelId: Entity): void {
    const model = world.models[modelId];
    if (!model?.animation) return;

    model.animation.playing = false;
}

/**
 * Bascule play/pause de l'animation en cours.
 */
export function toggleModel3DAnimation(world: World, modelId: Entity): void {
    const model = world.models[modelId];
    if (!model?.animation) return;

    model.animation.playing = !model.animation.playing;
}
