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
        update: Record<string, any>
    ): Promise<void> {
        await SceneModel.updateOne(
            { userId },
            { $set: update },
            { upsert: true }
        );
    }

    async saveWorld(userId: string, world: World): Promise<void> {
        await SceneModel.updateOne(
            { userId },
            { $set: { world } },
            { upsert: true }
        );
    }

    async loadWorld(userId: string): Promise<World | null> {
        const doc = await SceneModel.findOne({ userId });
        return doc ? (doc.world as World) : null;
    }
}
