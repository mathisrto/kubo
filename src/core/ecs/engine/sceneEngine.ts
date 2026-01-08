import { World } from "@/src/core/ecs/world";
import { enablePatches, Patch, produce } from "immer";
import { proxy, subscribe } from "valtio";
import { SAVE_DELAY_MS } from "../../../types";
import { ScenePort } from "../../ports/scenePort";
import { createOrResetScene } from "./utilsEngine";

enablePatches();

export async function saveWorld(
    userId: string,
    world: World,
    scenePort: ScenePort
): Promise<void> {
    await scenePort.saveWorld(userId, world);
}

export async function load(
    userId: string,
    scenePort: ScenePort
): Promise<World | null> {
    return await scenePort.loadWorld(userId);
}

function patchesToMongoSet(patches: Patch[]): Record<string, any> {
    const update: Record<string, any> = {};
    for (const patch of patches) {
        const path = ["world", ...patch.path].join(".");
        if (patch.op === "replace" || patch.op === "add") {
            update[path] = patch.value;
        } else if (patch.op === "remove") {
            update[path] = undefined;
        }
    }
    return update;
}

export function createReactiveWorld(
    userId: string,
    initialWorld: World,
    savePatches: (
        userId: string,
        update: Record<string, any>
    ) => Promise<void> = async () => {}
): World {
    let previousWorld = JSON.parse(JSON.stringify(initialWorld));
    const worldProxy = proxy(initialWorld);
    let saveTimeout: NodeJS.Timeout | null = null;

    subscribe(worldProxy, () => {
        if (saveTimeout) clearTimeout(saveTimeout);

        saveTimeout = setTimeout(async () => {
            try {
                const newWorld = JSON.parse(JSON.stringify(worldProxy));
                const patches: Patch[] = [];

                produce(
                    previousWorld,
                    (draft) => {
                        Object.assign(draft, newWorld);
                    },
                    (p) => patches.push(...p)
                );

                if (patches.length > 0) {
                    const update = patchesToMongoSet(patches);
                    await savePatches(userId, update);
                    previousWorld = JSON.parse(JSON.stringify(worldProxy));
                    console.log("🌱 Patches saved:", update);
                }
            } catch (err) {
                console.error("❌ Failed to save world patches:", err);
            }
        }, SAVE_DELAY_MS);
    });

    return worldProxy;
}

export async function initWorld(
    userId: string,
    scenePort: ScenePort
): Promise<World> {
    let world = await load(userId, scenePort);

    if (!world) {
        world = createOrResetScene();
        await saveWorld(userId, world, scenePort);
    }

    return world;
}
