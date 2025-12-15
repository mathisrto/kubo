import { ColorType } from "@/lib/class/Color";
import { LightType } from "@/lib/class/Light";
import { Vector3Type } from "@/lib/class/Vector3";
import { LIGHT_TYPES } from "@/lib/constants";
import { getModelsCollection } from "@/lib/database/client";
import { ObjectId } from "mongodb";

export async function getLightById(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model;
}

export async function getLightName(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.name;
}

export async function getLightPosition(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.position;
}

export async function getLightColor(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.color;
}

export async function getLightIntensity(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.intensity;
}

export async function getLightRange(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.range;
}

export async function getLightType(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.type;
}

export async function getLightColorMultiplier(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.lights.id": id,
        _id: uid,
    });
    return model?.scene?.lights[0]?.colorMultiplier;
}

export async function updateLightName(uid: string, id: string, name: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.name": name,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateLightPosition(
    uid: string,
    id: string,
    position: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.position": position,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateLightColor(
    uid: string,
    id: string,
    color: ColorType
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.color": color,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateLightIntensity(
    uid: string,
    id: string,
    intensity: number
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.intensity": intensity,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateLightRange(uid: string, id: string, range: number) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.range": range,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateLightType(
    uid: string,
    id: string,
    type: LIGHT_TYPES
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.type": type,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateLightColorMultiplier(
    uid: string,
    id: string,
    colorMultiplier: number
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.lights.id": id, _id: uid },
        {
            $set: {
                "scene.lights.$.colorMultiplier": colorMultiplier,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function getLights(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    if (!doc?.scene?.lights) return [];
    return doc.scene.lights;
}

export async function createLight(uid: string, light: LightType) {
    const col = await getModelsCollection();
    if (!col) return null;

    // Generate ID without modifying the original object
    const newId = new ObjectId().toString();
    const lightWithId = { ...light, id: newId };

    const id = uid;
    await col.updateOne(
        { _id: id }, // directement l'ID utilisateur
        {
            $push: { ["scene.lights"]: lightWithId },
            $set: { "scene.updatedAt": new Date() },
        },
        { upsert: true } // au cas où la scène n'existe pas encore
    );
    return newId;
}

export async function removeLight(uid: string, lightId: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const result = await col.updateOne(
        { _id: id },
        {
            $pull: { "scene.lights": { id: lightId } },
            $set: { "scene.updatedAt": new Date() },
        }
    );
    return result.acknowledged;
}
