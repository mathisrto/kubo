import { LightType } from "@/lib/class/Light";
import {
    createLight,
    getLightById,
    getLightColor,
    getLightColorMultiplier,
    getLightIntensity,
    getLightName,
    getLightPosition,
    getLightRange,
    getLights,
    getLightType,
    removeLight,
    updateLightColor,
    updateLightColorMultiplier,
    updateLightIntensity,
    updateLightName,
    updateLightPosition,
    updateLightRange,
    updateLightType,
} from "@/lib/database/models/LightModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const lightResolvers = {
    Query: {
        getLightById: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightById(uid, id);
            }
        ),
        getLightName: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightName(uid, id);
            }
        ),
        getLightPosition: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightPosition(uid, id);
            }
        ),
        getLightColor: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightColor(uid, id);
            }
        ),
        getLightIntensity: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightIntensity(uid, id);
            }
        ),
        getLightRange: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightRange(uid, id);
            }
        ),
        getLightType: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightType(uid, id);
            }
        ),
        getLightColorMultiplier: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                return await getLightColorMultiplier(uid, id);
            }
        ),
        getLights: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getLights(uid);
            }
        ),
    },
    Mutation: {
        updateLightName: requireAuth(
            async (
                _: unknown,
                { id, name }: LightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightName(uid, id, name);
                return { acknowledged };
            }
        ),
        updateLightPosition: requireAuth(
            async (
                _: unknown,
                { id, position }: LightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightPosition(
                    uid,
                    id,
                    position
                );
                return { acknowledged };
            }
        ),
        updateLightColor: requireAuth(
            async (
                _: unknown,
                { id, color }: LightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightColor(uid, id, color);
                return { acknowledged };
            }
        ),
        updateLightIntensity: requireAuth(
            async (
                _: unknown,
                { id, intensity }: LightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightIntensity(
                    uid,
                    id,
                    intensity
                );
                return { acknowledged };
            }
        ),
        updateLightRange: requireAuth(
            async (
                _: unknown,
                { id, range }: LightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightRange(uid, id, range);
                return { acknowledged };
            }
        ),
        updateLightType: requireAuth(
            async (
                _: unknown,
                { id, type }: LightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightType(uid, id, type);
                return { acknowledged };
            }
        ),
        updateLightColorMultiplier: requireAuth(
            async (
                _: unknown,
                {
                    id,
                    colorMultiplier,
                }: { id: string; colorMultiplier: number },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Light ID is required");
                }
                const acknowledged = await updateLightColorMultiplier(
                    uid,
                    id,
                    colorMultiplier
                );
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
    },
};
