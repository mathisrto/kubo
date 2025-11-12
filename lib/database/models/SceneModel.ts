import { Light } from "@/lib/class/Light";
import { Material } from "@/lib/class/Material";
import { SceneObject } from "@/lib/class/SceneObject";
import { getModelsCollection } from "@/lib/database/client";
import { ObjectId } from "mongodb";

// Objets de la scène

export async function getSceneObjects(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    if (!doc?.scene?.objects) return [];
    return doc.scene.objects;
}

export async function createSceneObject(uid: string, object: SceneObject) {
    const col = await getModelsCollection();
    if (!col) return null;

    if (!object.id) {
        object.id = new ObjectId().toString();
    }

    const serialized = object.serialize();
    const id = uid;
    await col.updateOne(
        { _id: id }, // directement l'ID utilisateur
        {
            $push: { ["scene.objects"]: serialized },
            $set: { "scene.updatedAt": new Date() },
        },
        { upsert: true } // au cas où la scène n'existe pas encore
    );
    return serialized.id;
}

export async function removeSceneObject(uid: string, objectId: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const result = await col.updateOne(
        { _id: id },
        {
            $pull: { "scene.objects": { id: objectId } },
            $set: { "scene.updatedAt": new Date() },
        }
    );
    return result.acknowledged;
}

// Lights

export async function getLights(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    if (!doc?.scene?.lights) return [];
    return doc.scene.lights;
}

export async function createLight(uid: string, light: Light) {
    const col = await getModelsCollection();
    if (!col) return null;

    if (!light.id) {
        light.id = new ObjectId().toString();
    }

    const serialized = light.serialize();
    const id = uid;
    await col.updateOne(
        { _id: id }, // directement l'ID utilisateur
        {
            $push: { ["scene.lights"]: serialized },
            $set: { "scene.updatedAt": new Date() },
        },
        { upsert: true } // au cas où la scène n'existe pas encore
    );
    return serialized.id;
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

// Materiaux

export async function getMaterials(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    if (!doc?.scene?.materials) return [];
    return doc.scene.materials;
}

export async function createMaterial(uid: string, material: Material) {
    const col = await getModelsCollection();
    if (!col) return null;

    if (!material.id) {
        material.id = new ObjectId().toString();
    }

    const serialized = material.serialize();
    const id = uid;
    await col.updateOne(
        { _id: id }, // directement l'ID utilisateur
        {
            $push: { ["scene.materials"]: serialized },
            $set: { "scene.updatedAt": new Date() },
        },
        { upsert: true } // au cas où la scène n'existe pas encore
    );
    return serialized.id;
}

export async function removeMaterial(uid: string, materialId: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const result = await col.updateOne(
        { _id: id },
        {
            $pull: { "scene.materials": { id: materialId } },
            $set: { "scene.updatedAt": new Date() },
        }
    );
    return result.acknowledged;
}

export async function getCamera(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    return doc?.scene?.camera || null;
}

export async function getAmbientLight(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const id = uid;
    const doc = await col.findOne({ _id: id });
    return doc?.scene?.ambientLight || null;
}
