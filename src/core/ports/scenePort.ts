import { World } from "@/src/core/ecs/world";

export interface ScenePort {
    savePatches(userId: string, update: Record<string, any>): Promise<void>;
    loadWorld(userId: string): Promise<World | null>;
    saveWorld(userId: string, world: World): Promise<void>;
}
