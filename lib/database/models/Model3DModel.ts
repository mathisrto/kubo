import { Model3DType, MODEL_FILE_FORMAT } from "@/lib/class/Model3D";
import { Vector3Type } from "@/lib/class/Vector3";
import { getModelsCollection } from "@/lib/database/client";

// ==================== QUERIES ====================

export async function getModel3DById(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    if (!model) return null;
    const model3d = model.scene?.models3d?.find((m: any) => m.id === id);
    return model3d || null;
}

export async function getModel3DName(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.name || null;
}

export async function getModel3DFileId(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.fileId || null;
}

export async function getModel3DFormat(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.format || null;
}

export async function getModel3DPosition(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.position || null;
}

export async function getModel3DRotation(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.rotation || null;
}

export async function getModel3DScale(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.scale || null;
}

export async function getModel3DMaterialId(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.models3d.id": id,
        _id: uid,
    });
    const model3d = model?.scene?.models3d?.find((m: any) => m.id === id);
    return model3d?.materialId || null;
}

export async function getModel3Ds(uid: string) {
    const col = await getModelsCollection();
    if (!col) return [];
    const model = await col.findOne({ _id: uid });
    return model?.scene?.models3d || [];
}

// ==================== MUTATIONS ====================

export async function updateModel3DName(uid: string, id: string, name: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.name": name,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateModel3DFileId(
    uid: string,
    id: string,
    fileId: string
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.fileId": fileId,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateModel3DFormat(
    uid: string,
    id: string,
    format: MODEL_FILE_FORMAT
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.format": format,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateModel3DPosition(
    uid: string,
    id: string,
    position: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.position": position,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateModel3DRotation(
    uid: string,
    id: string,
    rotation: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.rotation": rotation,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateModel3DScale(
    uid: string,
    id: string,
    scale: Vector3Type
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.scale": scale,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateModel3DMaterialId(
    uid: string,
    id: string,
    materialId: string
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.models3d.id": id, _id: uid },
        {
            $set: {
                "scene.models3d.$.materialId": materialId,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function createModel3D(uid: string, model3d: Model3DType) {
    const col = await getModelsCollection();
    if (!col) return null;

    const m = {
        id: `model3d_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: model3d.name,
        fileId: model3d.fileId,
        format: model3d.format,
        position: model3d.position || { x: 0, y: 0, z: 0 },
        rotation: model3d.rotation || { x: 0, y: 0, z: 0 },
        scale: model3d.scale || { x: 1, y: 1, z: 1 },
        materialId: model3d.materialId || null,
        ...(model3d.metadata && { metadata: model3d.metadata }), // Only include metadata if provided
    };

    const result = await col.updateOne(
        { _id: uid },
        {
            $push: { "scene.models3d": m } as any,
            $set: { "scene.updatedAt": new Date() },
        }
    );

    if (!result.acknowledged) {
        throw new Error("Failed to create Model3D");
    }

    return m.id;
}

export async function removeModel3D(uid: string, modelId: string) {
    const col = await getModelsCollection();
    if (!col) return null;

    const result = await col.updateOne(
        { _id: uid },
        {
            $pull: { "scene.models3d": { id: modelId } } as any,
            $set: { "scene.updatedAt": new Date() },
        }
    );

    return result.acknowledged;
}
