"use server";

import { initWorld, saveWorld } from "@/src/core/ecs/engine/sceneEngine";
import { getScenePort } from "@/src/providers/scenePortProvider";
import { World } from "../core/ecs/world";

export async function initWorldAction(userId: string) {
    try {
        const scenePort = await getScenePort();
        return await initWorld(userId, scenePort);
    } catch (error) {
        console.error("Error initializing world:", error);
        throw error;
    }
}

export async function saveWorldAction(userId: string, world: World) {
    try {
        const scenePort = await getScenePort();
        await saveWorld(userId, world, scenePort);
    } catch (error) {
        console.error("Error saving world:", error);
        throw error;
    }
}

export async function savePatches(
    userId: string,
    update: Record<string, any>
): Promise<void> {
    try {
        const scenePort = await getScenePort();
        await scenePort.savePatches(userId, update);
    } catch (error) {
        console.error("Error saving patches:", error);
        throw error;
    }
}
