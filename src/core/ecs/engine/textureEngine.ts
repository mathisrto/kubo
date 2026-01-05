import { Texture } from "../components/indexComponent";
import { World } from "../world";
import { generateEntityId } from "./utilsEngine";

export function createTexture(world: World, input: Texture) {
    const id = generateEntityId();
    world.textures[id] = { ...input };
    return id;
}
