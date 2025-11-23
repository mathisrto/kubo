import { LightType } from "@/lib/class/Light";
import { MaterialType } from "@/lib/class/Material";
import { SceneObjectType } from "@/lib/class/SceneObject";
import {
    createLight,
    createMaterial,
    createSceneObject,
    getAmbientLight,
    getCamera,
    getLights,
    getMaterials,
    getSceneObjects,
    removeLight,
    removeMaterial,
    removeSceneObject,
} from "@/lib/database/models/SceneModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const sceneResolvers = {
    Query: {
        getSceneObjects: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getSceneObjects(uid);
            }
        ),
        getLights: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getLights(uid);
            }
        ),
        getMaterials: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getMaterials(uid);
            }
        ),
        getCamera: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getCamera(uid);
            }
        ),
        getAmbientLight: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getAmbientLight(uid);
            }
        ),
    },
    Mutation: {
        createSceneObject: requireAuth(
            async (
                _parent: unknown,
                { object }: { object: SceneObjectType },
                context: ContextType
            ) => {
                const uid = context.uid;
                return await createSceneObject(uid, object);
            }
        ),
        removeSceneObject: requireAuth(
            async (
                _parent: unknown,
                { objectId }: { objectId: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await removeSceneObject(uid, objectId);
                return { acknowledged };
            }
        ),
        createLight: requireAuth(
            async (
                _parent: unknown,
                { light }: { light: LightType },
                context: ContextType
            ) => {
                const uid = context.uid;
                return await createLight(uid, light);
            }
        ),
        removeLight: requireAuth(
            async (
                _parent: unknown,
                { lightId }: { lightId: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await removeLight(uid, lightId);
                return { acknowledged };
            }
        ),
        createMaterial: requireAuth(
            async (
                _parent: unknown,
                { material }: { material: MaterialType },
                context: ContextType
            ) => {
                const uid = context.uid;
                return await createMaterial(uid, material);
            }
        ),
        removeMaterial: requireAuth(
            async (
                _parent: unknown,
                { materialId }: { materialId: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await removeMaterial(uid, materialId);
                return { acknowledged };
            }
        ),
    },
};
