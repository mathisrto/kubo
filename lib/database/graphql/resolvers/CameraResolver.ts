// --- src/graphql/resolvers/camera.ts ---
import { CameraType } from "@/lib/class/Camera";
import {
    getCameraFar,
    getCameraFOV,
    getCameraNear,
    getCameraPosition,
    getCameraRotation,
    getCameraType,
    updateCameraFar,
    updateCameraFOV,
    updateCameraNear,
    updateCameraPosition,
    updateCameraRotation,
    updateCameraType,
} from "@/lib/database/models/CameraModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const cameraResolvers = {
    Query: {
        getCameraPosition: requireAuth(
            async (_: unknown, __: object, context: ContextType) => {
                return await getCameraPosition(context.uid);
            }
        ),
        getCameraRotation: requireAuth(
            async (_: unknown, __: object, context: ContextType) => {
                return await getCameraRotation(context.uid);
            }
        ),
        getCameraFOV: requireAuth(
            async (_: unknown, __: object, context: ContextType) => {
                return await getCameraFOV(context.uid);
            }
        ),
        getCameraNear: requireAuth(
            async (_: unknown, __: object, context: ContextType) => {
                return await getCameraNear(context.uid);
            }
        ),
        getCameraFar: requireAuth(
            async (_: unknown, __: object, context: ContextType) => {
                return await getCameraFar(context.uid);
            }
        ),
        getCameraType: requireAuth(
            async (_: unknown, __: object, context: ContextType) => {
                return await getCameraType(context.uid);
            }
        ),
    },

    Mutation: {
        updateCameraPosition: requireAuth(
            async (
                _: unknown,
                { position }: CameraType,
                context: ContextType
            ) => {
                const acknowledged = await updateCameraPosition(
                    context.uid,
                    position
                );

                return { acknowledged };
            }
        ),
        updateCameraRotation: requireAuth(
            async (
                _: unknown,
                { rotation }: CameraType,
                context: ContextType
            ) => {
                const acknowledged = await updateCameraRotation(
                    context.uid,
                    rotation
                );

                return { acknowledged };
            }
        ),
        updateCameraFOV: requireAuth(
            async (_: unknown, { fov }: CameraType, context: ContextType) => {
                const acknowledged = await updateCameraFOV(context.uid, fov);

                return { acknowledged };
            }
        ),
        updateCameraNear: requireAuth(
            async (_: unknown, { near }: CameraType, context: ContextType) => {
                const acknowledged = await updateCameraNear(context.uid, near);

                return { acknowledged };
            }
        ),
        updateCameraFar: requireAuth(
            async (_: unknown, { far }: CameraType, context: ContextType) => {
                const acknowledged = await updateCameraFar(context.uid, far);

                return { acknowledged };
            }
        ),
        updateCameraType: requireAuth(
            async (_: unknown, { type }: CameraType, context: ContextType) => {
                const acknowledged = await updateCameraType(context.uid, type);

                return { acknowledged };
            }
        ),
    },
};
