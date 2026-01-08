"use server";

import { initWorld, saveWorld } from "@/src/core/ecs/engine/sceneEngine";
import { getScenePort } from "@/src/providers/scenePortProvider";
import { World } from "../core/ecs/world";

export async function initWorldAction(userId: string) {
    const scenePort = await getScenePort();
    return initWorld(userId, scenePort);
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
