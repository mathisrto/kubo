import { ColorType } from "@/lib/class/Color";
import { MaterialType } from "@/lib/class/Material";
import {
    getMaterialAlbedo,
    getMaterialAO,
    getMaterialById,
    getMaterialEmissive,
    getMaterialMetallic,
    getMaterialName,
    getMaterialRoughness,
    updateMaterialAlbedo,
    updateMaterialAO,
    updateMaterialEmissive,
    updateMaterialMetallic,
    updateMaterialName,
    updateMaterialRoughness,
} from "@/lib/database/models/MaterialModel";
import { requireAuth } from "@/lib/helpers";
import { ContextType } from "@/lib/types";

export const materialResolvers = {
    Query: {
        getMaterialById: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialById(uid, id);
            }
        ),
        getMaterialName: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialName(uid, id);
            }
        ),
        getMaterialAlbedo: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialAlbedo(uid, id);
            }
        ),
        getMaterialMetallic: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialMetallic(uid, id);
            }
        ),
        getMaterialRoughness: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialRoughness(uid, id);
            }
        ),
        getMaterialAO: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialAO(uid, id);
            }
        ),
        getMaterialEmissive: requireAuth(
            async (
                _parent: unknown,
                { id }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                return await getMaterialEmissive(uid, id);
            }
        ),
    },
    Mutation: {
        updateMaterialName: requireAuth(
            async (
                _: unknown,
                { id, name }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateMaterialName(uid, id, name);
                return { acknowledged };
            }
        ),
        updateMaterialAlbedo: requireAuth(
            async (
                _: unknown,
                { id, albedo }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateMaterialAlbedo(
                    uid,
                    id,
                    albedo
                );
                return { acknowledged };
            }
        ),
        updateMaterialMetallic: requireAuth(
            async (
                _: unknown,
                { id, metallic }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateMaterialMetallic(
                    uid,
                    id,
                    metallic
                );
                return { acknowledged };
            }
        ),
        updateMaterialRoughness: requireAuth(
            async (
                _: unknown,
                { id, roughness }: MaterialType,
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateMaterialRoughness(
                    uid,
                    id,
                    roughness
                );
                return { acknowledged };
            }
        ),
        updateMaterialAO: requireAuth(
            async (
                _: unknown,
                { id, ao }: { id: string; ao: number },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateMaterialAO(uid, id, ao);
                return { acknowledged };
            }
        ),
        updateMaterialEmissive: requireAuth(
            async (
                _: unknown,
                { id, emissive }: { id: string; emissive: ColorType },
                context: ContextType
            ) => {
                const uid = context.uid;
                if (!id) {
                    throw new Error("Material ID is required");
                }
                const acknowledged = await updateMaterialEmissive(
                    uid,
                    id,
                    emissive
                );
                return { acknowledged };
            }
        ),
    },
};
