import { ColorType } from "@/lib/class/Color";
import { getModelsCollection } from "@/lib/database/client";

export async function getAmbientLightColor(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({ _id: uid });
    return model?.scene?.ambientLight?.color;
}

export async function getAmbientLightIntensity(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({ _id: uid });
    return model?.scene?.ambientLight?.intensity;
}

export async function getAmbientLightColorMultiplier(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({ _id: uid });
    return model?.scene?.ambientLight?.colorMultiplier;
}

export async function updateAmbientLightColor(uid: string, color: ColorType) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.ambientLight.color": color,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
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

export async function updateAmbientLightColorMultiplier(
    uid: string,
    colorMultiplier: number
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.ambientLight.colorMultiplier": colorMultiplier,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}
