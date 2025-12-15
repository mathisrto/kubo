import { getModelsCollection } from "@/lib/database/client";

export async function getAmbientLightIntensity(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({ _id: uid });
    return model?.scene?.ambientLight?.intensity;
}

export async function getAmbientLightEnvironmentMap(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({ _id: uid });
    return model?.scene?.ambientLight?.environmentMap;
}

export async function updateAmbientLightIntensity(
    uid: string,
    intensity: number
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.ambientLight.intensity": intensity,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateAmbientLightEnvironmentMap(
    uid: string,
    environmentMap: string | undefined
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.ambientLight.environmentMap": environmentMap,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function getAmbientLight(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    return doc?.scene?.ambientLight || null;
}
