import {
    createOrResetScene,
    deleteScene,
    getScene,
    hasScene,
} from "@/lib/database/models/SceneModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const sceneResolvers = {
    Query: {
        getScene: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getScene(uid);
            }
        ),
        hasScene: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                const scene = await hasScene(uid);
                return scene;
            }
        ),
    },
    Mutation: {
        createOrResetScene: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                const acknowledged = await createOrResetScene(uid);
                return { acknowledged };
            }
        ),
        deleteScene: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                const acknowledged = await deleteScene(uid);
                return { acknowledged };
            }
        ),
    },
};
