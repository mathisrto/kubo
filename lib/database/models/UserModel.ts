import { getModelsCollection } from "../client";

export async function updateApiKey(userId: string, apiKey: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: userId },
        {
            $set: {
                apiKey: apiKey,
                updatedAt: new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function getApiKey(userId: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: userId });
    return doc?.apiKey || null;
}
