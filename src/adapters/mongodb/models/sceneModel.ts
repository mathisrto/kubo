import { World } from "@/src/core/ecs/world";
import { model, models, Schema } from "mongoose";

interface IScene {
    userId: string;
    world: World;
}

const SceneSchema = new Schema<IScene>(
    {
        userId: { type: String, required: true, unique: true },
        world: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

export const SceneModel =
    models.Scene || model<IScene>("Scene", SceneSchema, "scenes");
