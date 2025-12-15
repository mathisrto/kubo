import { getApiKey, updateApiKey } from "@/lib/database/models/UserModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const userResolvers = {
    Query: {
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
