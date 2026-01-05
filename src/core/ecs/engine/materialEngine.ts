import { Entity, Name } from "@/src/core/ecs/components/indexComponent";
import { generateEntityId } from "@/src/core/ecs/engine/indexEngine";
import { World } from "@/src/core/ecs/world";
import { DEFAULT_TEXTURE } from "../../../types";
import { createTexture } from "./textureEngine";

export function createMaterial(world: World, input: { name: Name }): Entity {
    const id = generateEntityId();
    world.materials[id] = {
        albedoMap: createTexture(world, {
            fileId: DEFAULT_TEXTURE,
        }),
        normalMap: createTexture(world, {
            fileId: DEFAULT_TEXTURE,
        }),
        roughnessMap: createTexture(world, {
            fileId: DEFAULT_TEXTURE,
        }),
        metallicMap: createTexture(world, {
            fileId: DEFAULT_TEXTURE,
        }),
        aoMap: createTexture(world, {
            fileId: DEFAULT_TEXTURE,
        }),
        emissiveMap: createTexture(world, {
            fileId: DEFAULT_TEXTURE,
        }),
    };
    world.names[id] = input.name;
    return id;
}
