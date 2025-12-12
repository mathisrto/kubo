import { MODEL_FILE_FORMAT } from "@/lib/class/Model3D";
import { Vector3Type } from "@/lib/class/Vector3";
import {
    createModel3D,
    getModel3DById,
    getModel3DFileId,
    getModel3DFormat,
    getModel3DMaterialId,
    getModel3DName,
    getModel3DPosition,
    getModel3DRotation,
    getModel3Ds,
    getModel3DScale,
    removeModel3D,
    updateModel3DFileId,
    updateModel3DFormat,
    updateModel3DMaterialId,
    updateModel3DName,
    updateModel3DPosition,
    updateModel3DRotation,
    updateModel3DScale,
} from "@/lib/database/models/Model3DModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const model3DResolvers = {
    Query: {
        getModel3DById: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DById(uid, id);
            }
        ),
        getModel3DName: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DName(uid, id);
            }
        ),
        getModel3DFileId: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DFileId(uid, id);
            }
        ),
        getModel3DFormat: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DFormat(uid, id);
            }
        ),
        getModel3DPosition: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DPosition(uid, id);
            }
        ),
        getModel3DRotation: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DRotation(uid, id);
            }
        ),
        getModel3DScale: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DScale(uid, id);
            }
        ),
        getModel3DMaterialId: requireAuth(
            async (
                _parent: unknown,
                { id }: { id: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                return await getModel3DMaterialId(uid, id);
            }
        ),
        getModel3Ds: requireAuth(
            async (_parent: unknown, _args: unknown, context: ContextType) => {
                const uid = context.uid;
                return await getModel3Ds(uid);
            }
        ),
    },
    Mutation: {
        updateModel3DName: requireAuth(
            async (
                _parent: unknown,
                { id, name }: { id: string; name: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!name) {
                    throw new Error("Name is required");
                }
                const acknowledged = await updateModel3DName(uid, id, name);
                return { acknowledged };
            }
        ),
        updateModel3DFileId: requireAuth(
            async (
                _parent: unknown,
                { id, fileId }: { id: string; fileId: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!fileId) {
                    throw new Error("File ID is required");
                }
                const acknowledged = await updateModel3DFileId(uid, id, fileId);
                return { acknowledged };
            }
        ),
        updateModel3DFormat: requireAuth(
            async (
                _parent: unknown,
                { id, format }: { id: string; format: MODEL_FILE_FORMAT },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!format) {
                    throw new Error("Format is required");
                }
                const acknowledged = await updateModel3DFormat(uid, id, format);
                return { acknowledged };
            }
        ),
        updateModel3DPosition: requireAuth(
            async (
                _parent: unknown,
                { id, position }: { id: string; position: Vector3Type },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!position) {
                    throw new Error("Position is required");
                }
                const acknowledged = await updateModel3DPosition(
                    uid,
                    id,
                    position
                );
                return { acknowledged };
            }
        ),
        updateModel3DRotation: requireAuth(
            async (
                _parent: unknown,
                { id, rotation }: { id: string; rotation: Vector3Type },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!rotation) {
                    throw new Error("Rotation is required");
                }
                const acknowledged = await updateModel3DRotation(
                    uid,
                    id,
                    rotation
                );
                return { acknowledged };
            }
        ),
        updateModel3DScale: requireAuth(
            async (
                _parent: unknown,
                { id, scale }: { id: string; scale: Vector3Type },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!scale) {
                    throw new Error("Scale is required");
                }
                const acknowledged = await updateModel3DScale(uid, id, scale);
                return { acknowledged };
            }
        ),
        updateModel3DMaterialId: requireAuth(
            async (
                _parent: unknown,
                { id, materialId }: { id: string; materialId: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Model3D ID is required");
                }
                if (!materialId) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateModel3DMaterialId(
                    uid,
                    id,
                    materialId
                );
                return { acknowledged };
            }
        ),
        createModel3D: requireAuth(
            async (
                _parent: unknown,
                {
                    name,
                    fileId,
                    format,
                }: { name: string; fileId: string; format: MODEL_FILE_FORMAT },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!name) {
                    throw new Error("Name is required");
                }
                if (!fileId) {
                    throw new Error("File ID is required");
                }
                if (!format) {
                    throw new Error("Format is required");
                }
                return await createModel3D(uid, name, fileId, format);
            }
        ),
        removeModel3D: requireAuth(
            async (
                _parent: unknown,
                { modelId }: { modelId: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!modelId) {
                    throw new Error("Model ID is required");
                }
                const acknowledged = await removeModel3D(uid, modelId);
                return { acknowledged };
            }
        ),
    },
};
