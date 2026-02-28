// MongoSceneAdapter.ts
import { SceneModel } from "@/src/adapters/mongodb/models/sceneModel";
import { World } from "@/src/core/ecs/world";
import { ScenePort } from "@/src/core/ports/scenePort";
import { getMongooseClient } from "@/src/db";

export class SceneAdapter implements ScenePort {
    constructor() {
        getMongooseClient();
    }

    async savePatches(
        userId: string,
        update: { $set: Record<string, any>; $unset: Record<string, any> },
    ): Promise<void> {
        const ops: Record<string, any> = {};
        if (Object.keys(update.$set).length > 0) {
            ops.$set = update.$set;
        }
        if (Object.keys(update.$unset).length > 0) {
            ops.$unset = update.$unset;
        }
        if (Object.keys(ops).length > 0) {
            await SceneModel.updateOne({ userId }, ops, { upsert: true });
        }
    }

    async saveWorld(userId: string, world: World): Promise<void> {
        await SceneModel.updateOne(
            { userId },
            { $set: { world } },
            { upsert: true },
        );
    }

    async loadWorld(userId: string): Promise<World | null> {
        const doc = await SceneModel.findOne({ userId });
        return doc ? (doc.world as World) : null;
    }
}
