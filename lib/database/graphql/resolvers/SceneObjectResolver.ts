import { SceneObjectType } from "@/lib/class/SceneObject";
import {
    getSceneObjectById,
    getSceneObjectMaterialId,
    getSceneObjectName,
    getSceneObjectPosition,
    getSceneObjectRotation,
    getSceneObjectScale,
    updateSceneObjectMaterial,
    updateSceneObjectName,
    updateSceneObjectPosition,
    updateSceneObjectRotation,
    updateSceneObjectScale,
} from "@/lib/database/models/SceneObjectModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const sceneObjectResolvers = {
    Query: {
        getSceneObjectById: requireAuth(
            async (
                _parent: unknown,
                { id }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                return await getSceneObjectById(uid, id);
            }
        ),
        getSceneObjectName: requireAuth(
            async (
                _parent: unknown,
                { id }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                return await getSceneObjectName(uid, id);
            }
        ),
        getSceneObjectPosition: requireAuth(
            async (
                _parent: unknown,
                { id }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                return await getSceneObjectPosition(uid, id);
            }
        ),
        getSceneObjectRotation: requireAuth(
            async (
                _parent: unknown,
                { id }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                return await getSceneObjectRotation(uid, id);
            }
        ),
        getSceneObjectScale: requireAuth(
            async (
                _parent: unknown,
                { id }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                return await getSceneObjectScale(uid, id);
            }
        ),
        getSceneObjectMaterialId: requireAuth(
            async (
                _parent: unknown,
                { id }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                return await getSceneObjectMaterialId(uid, id);
            }
        ),
    },
    Mutation: {
        updateSceneObjectName: requireAuth(
            async (
                _: unknown,
                { id, name }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                const acknowledged = await updateSceneObjectName(uid, id, name);
                return { acknowledged };
            }
        ),
        updateSceneObjectPosition: requireAuth(
            async (
                _: unknown,
                { id, position }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                const acknowledged = await updateSceneObjectPosition(
                    uid,
                    id,
                    position
                );
                return { acknowledged };
            }
        ),
        updateSceneObjectRotation: requireAuth(
            async (
                _: unknown,
                { id, rotation }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                const acknowledged = await updateSceneObjectRotation(
                    uid,
                    id,
                    rotation
                );
                return { acknowledged };
            }
        ),
        updateSceneObjectScale: requireAuth(
            async (
                _: unknown,
                { id, scale }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                const acknowledged = await updateSceneObjectScale(
                    uid,
                    id,
                    scale
                );
                return { acknowledged };
            }
        ),
        updateSceneObjectMaterial: requireAuth(
            async (
                _: unknown,
                { id, materialId }: SceneObjectType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("SceneObject ID is required");
                }
                const acknowledged = await updateSceneObjectMaterial(
                    uid,
                    id,
                    materialId
                );
                return { acknowledged };
            }
        ),
    },
};
