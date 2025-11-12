import { ColorType } from "@/lib/class/Color";
import { getModelsCollection } from "@/lib/database/client";

export async function getMaterialById(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model;
}

export async function getMaterialName(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model?.scene?.materials[0]?.name;
}

export async function getMaterialAlbedo(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model?.scene?.materials[0]?.albedo;
}

export async function getMaterialMetallic(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model?.scene?.materials[0]?.metallic;
}

export async function getMaterialRoughness(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model?.scene?.materials[0]?.roughness;
}

export async function getMaterialAO(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model?.scene?.materials[0]?.ao;
}

export async function getMaterialEmissive(uid: string, id: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const model = await col.findOne({
        "scene.materials.id": id,
        _id: uid,
    });
    return model?.scene?.materials[0]?.emissive;
}

export async function updateMaterialName(
    uid: string,
    id: string,
    name: string
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.materials.id": id, _id: uid },
        {
            $set: {
                "scene.materials.$.name": name,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateMaterialAlbedo(
    uid: string,
    id: string,
    albedo: ColorType
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.materials.id": id, _id: uid },
        {
            $set: {
                "scene.materials.$.albedo": albedo,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateMaterialMetallic(
    uid: string,
    id: string,
    metallic: number
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.materials.id": id, _id: uid },
        {
            $set: {
                "scene.materials.$.metallic": metallic,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateMaterialRoughness(
    uid: string,
    id: string,
    roughness: number
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.materials.id": id, _id: uid },
        {
            $set: {
                "scene.materials.$.roughness": roughness,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateMaterialAO(uid: string, id: string, ao: number) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.materials.id": id, _id: uid },
        {
            $set: {
                "scene.materials.$.ao": ao,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateMaterialEmissive(
    uid: string,
    id: string,
    emissive: ColorType
) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { "scene.materials.id": id, _id: uid },
        {
            $set: {
                "scene.materials.$.emissive": emissive,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}
