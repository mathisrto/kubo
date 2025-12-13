import {
    createOrResetScene,
    deleteScene,
    getApiKey,
    getScene,
    hasScene,
    updateApiKey,
} from "@/lib/database/models/UserModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const userResolvers = {
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
        getApiKey: requireAuth(
            async (
                _parent: unknown,
                args: { userId: string },
                context: ContextType
            ) => {
                const { userId } = args;
                // Verify that the user is requesting their own API key
                if (userId !== context.uid) {
                    throw new Error(
                        "Unauthorized: Cannot access another user's API key"
                    );
                }
                return await getApiKey(userId);
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
        updateApiKey: requireAuth(
            async (
                _parent: unknown,
                args: { userId: string; apiKey: string },
                context: ContextType
            ) => {
                const { userId, apiKey } = args;
                // Verify that the user is updating their own API key
                if (userId !== context.uid) {
                    throw new Error(
                        "Unauthorized: Cannot update another user's API key"
                    );
                }
                const acknowledged = await updateApiKey(userId, apiKey);
                return { acknowledged };
            }
        ),
    },
};
