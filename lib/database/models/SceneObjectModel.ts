import { Vector3Type } from "@/lib/class/Vector3";
import { getModelsCollection } from "@/lib/database/client";

export async function getSceneObjectById(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({
        "scene.objects.id": id,
        _id: uid,
    });
    return doc?.scene?.objects[0] || null;
}

export async function getSceneObjectName(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({
        "scene.objects.id": id,
        _id: uid,
    });
    return doc?.scene?.objects[0]?.name || null;
}

export async function getSceneObjectPosition(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({
        "scene.objects.id": id,
        _id: uid,
    });
    return doc?.scene?.objects[0]?.position || null;
}

export async function getSceneObjectRotation(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({
        "scene.objects.id": id,
        _id: uid,
    });
    return doc?.scene?.objects[0]?.rotation || null;
}

export async function getSceneObjectScale(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({
        "scene.objects.id": id,
        _id: uid,
    });
    return doc?.scene?.objects[0]?.scale || null;
}

export async function getSceneObjectMaterialId(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({
        "scene.objects.id": id,
        _id: uid,
    });
    return doc?.scene?.objects[0]?.materialId || null;
}

export async function updateSceneObjectName(
    uid: string,
    id: string,
    name: string
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.objects.id": id, _id: uid },
        {
            $set: {
                "scene.objects.$.name": name,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateSceneObjectPosition(
    uid: string,
    id: string,
    position: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.objects.id": id, _id: uid },
        {
            $set: {
                "scene.objects.$.position": position,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateSceneObjectRotation(
    uid: string,
    id: string,
    rotation: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.objects.id": id, _id: uid },
        {
            $set: {
                "scene.objects.$.rotation": rotation,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateSceneObjectScale(
    uid: string,
    id: string,
    scale: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.objects.id": id, _id: uid },
        {
            $set: {
                "scene.objects.$.scale": scale,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateSceneObjectMaterial(
    uid: string,
    id: string,
    materialId: string
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.objects.id": id, _id: uid },
        {
            $set: {
                "scene.objects.$.materialId": materialId,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}
