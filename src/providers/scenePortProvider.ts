"use server";
import { ScenePort } from "@/src/core/ports/scenePort";
import { SceneAdapter } from "../adapters/mongodb/adapters/sceneAdapter";

let scenePort: ScenePort | null = null;

export async function getScenePort(): Promise<ScenePort> {
    if (!scenePort) {
        scenePort = new SceneAdapter();
    }
    return scenePort;
}
