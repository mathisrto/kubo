import { LightType } from "@/lib/class/Light";
import {
    getLightById,
    getLightColor,
    getLightColorMultiplier,
    getLightIntensity,
    getLightName,
    getLightPosition,
    getLightRange,
    getLightType,
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
                return await getLightById(uid, id);
            }
        ),
        getLightName: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightName(uid, id);
            }
        ),
        getLightPosition: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightPosition(uid, id);
            }
        ),
        getLightColor: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightColor(uid, id);
            }
        ),
        getLightIntensity: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightIntensity(uid, id);
            }
        ),
        getLightRange: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightRange(uid, id);
            }
        ),
        getLightType: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightType(uid, id);
            }
        ),
        getLightColorMultiplier: requireAuth(
            async (_: unknown, { id }: LightType, context: ContextType) => {
                const uid = context.uid;
                return await getLightColorMultiplier(uid, id);
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
                const acknowledged = await updateLightColorMultiplier(
                    uid,
                    id,
                    colorMultiplier
                );
                return { acknowledged };
            }
        ),
    },
};
