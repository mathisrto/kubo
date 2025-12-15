import { AmbientLightType } from "@/lib/class/AmbientLight";
import {
    getAmbientLight,
    getAmbientLightEnvironmentMap,
    getAmbientLightIntensity,
    updateAmbientLightEnvironmentMap,
    updateAmbientLightIntensity,
} from "@/lib/database/models/AmbientLightModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const ambientLightResolvers = {
    Query: {
        getAmbientLightEnvironmentMap: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getAmbientLightEnvironmentMap(uid);
            }
        ),
        getAmbientLightIntensity: requireAuth(
            async (_parent: unknown, _args: object, context: ContextType) => {
                const uid = context.uid;
                return await getAmbientLightIntensity(uid);
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
        updateAmbientLightEnvironmentMap: requireAuth(
            async (
                _: unknown,
                { environmentMap }: { environmentMap: string },
                context: ContextType
            ) => {
                const uid = context.uid;
                const acknowledged = await updateAmbientLightEnvironmentMap(
                    uid,
                    environmentMap
                );
                return { acknowledged };
            }
        ),
    },
};
