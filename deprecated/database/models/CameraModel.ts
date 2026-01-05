import { Vector3Type } from "@/lib/class/Vector3";
import { CAMERA_TYPES } from "@/lib/constants";
import { getModelsCollection } from "@/lib/database/client";

export async function getCameraPosition(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: uid });
    return doc?.scene.camera.position;
}

export async function getCameraTarget(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: uid });
    return doc?.scene.camera.target;
}

export async function getCameraFOV(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: uid });
    return doc?.scene.camera.fov;
}

export async function getCameraNear(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: uid });
    return doc?.scene.camera.near;
}

export async function getCameraFar(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: uid });
    return doc?.scene.camera.far;
}

export async function getCameraType(uid: string) {
    const col = await getModelsCollection();
    if (!col) return null;
    const doc = await col.findOne({ _id: uid });
    return doc?.scene.camera.type;
}

export async function updateCameraPosition(uid: string, position: Vector3Type) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.camera.position": position,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateCameraTarget(uid: string, target: Vector3Type) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.camera.target": target,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateCameraFOV(uid: string, fov: number) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.camera.fov": fov,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateCameraNear(uid: string, near: number) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.camera.near": near,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateCameraFar(uid: string, far: number) {
    const col = await getModelsCollection();
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.camera.far": far,
                "scene.updatedAt": new Date(),
            },
        }
    );
    return result.acknowledged;
}

export async function updateCameraType(uid: string, type: CAMERA_TYPES) {
    const col = await getModelsCollection();
    if (!col) return null;
    if (!col) return null;
    const result = await col.updateOne(
        { _id: uid },
        {
            $set: {
                "scene.camera.type": type,
                "scene.updatedAt": new Date(),
            },
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
