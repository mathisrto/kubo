"use server";

import { load, saveWorld } from "@/src/core/ecs/engine/sceneEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { getScenePort } from "@/src/providers/scenePortProvider";
import { World } from "../core/ecs/world";

export async function initWorld(userId: string) {
    const scenePort = await getScenePort();

    let world = await load(userId, scenePort);

    if (!world) {
        world = createOrResetScene();
        await saveWorld(userId, world, scenePort);
    }

    return world;
}

export async function saveWorldAction(userId: string, world: World) {
    const scenePort = await getScenePort();
    await saveWorld(userId, world, scenePort);
}

export async function savePatches(
    userId: string,
    update: Record<string, any>
): Promise<void> {
    const scenePort = await getScenePort();
    await scenePort.savePatches(userId, update);
}
