import { CAMERA_TYPES } from "@/lib/constants";
import { getModelsCollection } from "@/lib/database/client";

// Creation d'une scène

export async function createOrResetScene(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const result = await col.updateOne(
        { _id: id },
        {
            $set: {
                scene: {
                    models3d: [],
                    lights: [],
                    materials: [],
                    camera: {
                        position: { x: 0, y: 0, z: 5 },
                        rotation: { x: 0, y: 0, z: 0 },
                        target: { x: 0, y: 0, z: 0 },
                        fov: 75,
                        near: 0.1,
                        far: 1000,
                        type: CAMERA_TYPES.PERSPECTIVE,
                    },
                    ambientLight: {
                        color: { r: 255, g: 255, b: 255, a: 1 },
                        intensity: 1,
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        },
        { upsert: true }
    );
    return result.acknowledged;
}

export async function hasScene(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    return doc !== null && doc.scene !== undefined;
}

export async function getScene(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });

    // Migration: Ajouter le champ models3d s'il n'existe pas
    if (doc && doc.scene && !doc.scene.models3d) {
        await col.updateOne({ _id: id }, { $set: { "scene.models3d": [] } });
        // Retourner la scène avec le nouveau champ
        return { ...doc.scene, models3d: [] };
    }

    return doc?.scene || null;
}

export async function deleteScene(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const result = await col.updateOne(
        { _id: id },
        {
            $unset: {
                scene: "",
            },
        }
    );
    return result.acknowledged;
}

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
