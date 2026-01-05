import {
    Entity,
    Light,
    Material,
    Model3D,
    Name,
    Texture,
    Transform,
} from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";
import { CameraType } from "@/src/types";

let entityCounter = 0;
export function generateEntityId(): Entity {
    return `e${entityCounter++}`;
}

export function removeEntity(world: World, entityId: Entity): boolean {
    const deleted = [
        delete world.transforms[entityId],
        delete world.names[entityId],
        delete world.models[entityId],
        delete world.lights[entityId],
        delete world.materials[entityId],
    ];
    // Retourne true si au moins un composant a été supprimé
    return deleted.some(Boolean);
}

export function createOrResetScene(world?: World): World {
    const tempWorld = {
        camera: {
            position: { x: 5, y: 5, z: 5 },
            target: { x: 0, y: 0, z: 0 },
            fov: 75,
            near: 0.1,
            far: 1000,
            type: CameraType.PERSPECTIVE,
        },
        environment: {
            intensity: 1,
            environmentMap: "",
        },
        lights: {} as Record<Entity, Light>,
        materials: {} as Record<Entity, Material>,
        models: {} as Record<Entity, Model3D>,
        names: {} as Record<Entity, Name>,
        transforms: {} as Record<Entity, Transform>,
        textures: {} as Record<Entity, Texture>,
    };
    if (world) {
        // Réinitialiser le monde existant
        world.camera = tempWorld.camera;
        world.environment = tempWorld.environment;
        world.lights = tempWorld.lights;
        world.materials = tempWorld.materials;
        world.models = tempWorld.models;
        world.names = tempWorld.names;
        world.transforms = tempWorld.transforms;
        world.textures = tempWorld.textures;
        return world;
    } else {
        return tempWorld;
    }
}
