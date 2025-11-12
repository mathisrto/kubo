import { AmbientLightType } from "@/lib/class/AmbientLight";
import {
    getAmbientLightColor,
    getAmbientLightColorMultiplier,
    getAmbientLightIntensity,
    updateAmbientLightColor,
    updateAmbientLightColorMultiplier,
    updateAmbientLightIntensity,
} from "@/lib/database/models/AmbientLightModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const ambientLightResolvers = {
    Query: {
        getAmbientLightColor: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getAmbientLightColor(uid);
            }
        ),
        getAmbientLightIntensity: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getAmbientLightIntensity(uid);
            }
        ),
        getAmbientLightColorMultiplier: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getAmbientLightColorMultiplier(uid);
            }
        ),
    },
    Mutation: {
        updateAmbientLightColor: requireAuth(
            async (
                _: unknown,
                { color }: AmbientLightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await updateAmbientLightColor(uid, color);
                return { acknowledged };
            }
        ),
        updateAmbientLightIntensity: requireAuth(
            async (
                _: unknown,
                { intensity }: AmbientLightType,
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await updateAmbientLightIntensity(
                    uid,
                    intensity
                );
                return { acknowledged };
            }
        ),
        updateAmbientLightColorMultiplier: requireAuth(
            async (
                _: unknown,
                { colorMultiplier }: { colorMultiplier: number },
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await updateAmbientLightColorMultiplier(
                    uid,
                    colorMultiplier
                );
                return { acknowledged };
            }
        ),
    },
};
