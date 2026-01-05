import {
    Camera,
    Entity,
    Environment,
    Light,
    Material,
    Model3D,
    Name,
    Texture,
    Transform,
} from "@/src/core/ecs/components/indexComponent";

export interface World {
    camera: Camera;
    environment: Environment;
    lights: Record<Entity, Light>;
    materials: Record<Entity, Material>;
    models: Record<Entity, Model3D>;
    names: Record<Entity, Name>;
    transforms: Record<Entity, Transform>;
    textures: Record<Entity, Texture>;
}
