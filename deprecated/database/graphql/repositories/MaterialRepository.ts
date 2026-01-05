import { ColorType } from "@/lib/class/Color";
import { MaterialType } from "@/lib/class/Material";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class MaterialRepository {
    async getMaterialById(id: string): Promise<MaterialType> {
        // Implement GraphQL query to get material by ID
        const query = gql`
            query getMaterialById($id: String!) {
                getMaterialById(id: $id) {
                    id
                    name
                    albedo {
                        r
                        g
                        b
                        a
                    }
                    metallic
                    roughness
                    ao
                    emissive {
                        r
                        g
                        b
                        a
                    }
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialById: MaterialType })
            .getMaterialById;
    }

    async getMaterialName(id: string): Promise<string> {
        // Implement GraphQL query to get material name
        const query = gql`
            query getMaterialName($id: String!) {
                getMaterialName(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialName: string }).getMaterialName;
    }

    async getMaterialAlbedo(id: string): Promise<ColorType> {
        // Implement GraphQL query to get material albedo
        const query = gql`
            query getMaterialAlbedo($id: String!) {
                getMaterialAlbedo(id: $id) {
                    r
                    g
                    b
                    a
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialAlbedo: ColorType })
            .getMaterialAlbedo;
    }

    async getMaterialMetallic(id: string): Promise<number> {
        // Implement GraphQL query to get material metallic
        const query = gql`
            query getMaterialMetallic($id: String!) {
                getMaterialMetallic(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialMetallic: number })
            .getMaterialMetallic;
    }

    async getMaterialRoughness(id: string): Promise<number> {
        // Implement GraphQL query to get material roughness
        const query = gql`
            query getMaterialRoughness($id: String!) {
                getMaterialRoughness(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialRoughness: number })
            .getMaterialRoughness;
    }

    async getMaterialAO(id: string): Promise<number> {
        // Implement GraphQL query to get material ambient occlusion
        const query = gql`
            query getMaterialAO($id: String!) {
                getMaterialAO(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialAO: number }).getMaterialAO;
    }

    async getMaterialEmissive(id: string): Promise<ColorType> {
        // Implement GraphQL query to get material emissive
        const query = gql`
            query getMaterialEmissive($id: String!) {
                getMaterialEmissive(id: $id) {
                    r
                    g
                    b
                    a
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (result.data as { getMaterialEmissive: ColorType })
            .getMaterialEmissive;
    }

    async updateMaterialName(id: string, name: string): Promise<boolean> {
        // Implement GraphQL mutation for updating material name
        const mutation = gql`
            mutation updateMaterialName($id: String!, $name: String!) {
                updateMaterialName(id: $id, name: $name) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, name },
        });
        return (
            result.data as {
                updateMaterialName: { acknowledged: boolean };
            }
        ).updateMaterialName.acknowledged;
    }

    async updateMaterialAlbedo(
        id: string,
        albedo: ColorType
    ): Promise<boolean> {
        // Implement GraphQL mutation for updating material albedo
        const mutation = gql`
            mutation updateMaterialAlbedo($id: String!, $albedo: ColorInput!) {
                updateMaterialAlbedo(id: $id, albedo: $albedo) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, albedo },
        });
        return (
            result.data as {
                updateMaterialAlbedo: { acknowledged: boolean };
            }
        ).updateMaterialAlbedo.acknowledged;
    }

    async updateMaterialMetallic(
        id: string,
        metallic: number
    ): Promise<boolean> {
        // Implement GraphQL mutation for updating material metallic
        const mutation = gql`
            mutation updateMaterialMetallic($id: String!, $metallic: Float!) {
                updateMaterialMetallic(id: $id, metallic: $metallic) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, metallic },
        });
        return (
            result.data as {
                updateMaterialMetallic: { acknowledged: boolean };
            }
        ).updateMaterialMetallic.acknowledged;
    }

    async updateMaterialRoughness(
        id: string,
        roughness: number
    ): Promise<boolean> {
        // Implement GraphQL mutation for updating material roughness
        const mutation = gql`
            mutation updateMaterialRoughness($id: String!, $roughness: Float!) {
                updateMaterialRoughness(id: $id, roughness: $roughness) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, roughness },
        });
        return (
            result.data as {
                updateMaterialRoughness: { acknowledged: boolean };
            }
        ).updateMaterialRoughness.acknowledged;
    }

    async updateMaterialAO(id: string, ao: number): Promise<boolean> {
        // Implement GraphQL mutation for updating material ambient occlusion
        const mutation = gql`
            mutation updateMaterialAO($id: String!, $ao: Float!) {
                updateMaterialAO(id: $id, ao: $ao) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, ao },
        });
        return (
            result.data as {
                updateMaterialAO: { acknowledged: boolean };
            }
        ).updateMaterialAO.acknowledged;
    }

    async updateMaterialEmissive(
        id: string,
        emissive: ColorType
    ): Promise<boolean> {
        // Implement GraphQL mutation for updating material emissive
        const mutation = gql`
            mutation updateMaterialEmissive(
                $id: String!
                $emissive: ColorInput!
            ) {
                updateMaterialEmissive(id: $id, emissive: $emissive) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, emissive },
        });
        return (
            result.data as {
                updateMaterialEmissive: { acknowledged: boolean };
            }
        ).updateMaterialEmissive.acknowledged;
    }

    async removeMaterial(id: string) {
        const mutation = gql`
            mutation removeMaterial($id: String!) {
                removeMaterial(id: $id) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id },
        });
        return (result.data as { removeMaterial: { acknowledged: boolean } })
            .removeMaterial.acknowledged;
    }

    async createMaterial(material: MaterialType) {
        const mutation = gql`
            mutation createMaterial($material: MaterialInput!) {
                createMaterial(material: $material)
            }
        `;
        // Deep clone to ensure no class instances remain
        const cleanData = JSON.parse(JSON.stringify(material));
        const result = await apolloClient.mutate({
            mutation,
            variables: { material: cleanData },
        });
        return (result.data as { createMaterial: string }).createMaterial;
    }

    async getMaterials(): Promise<MaterialType[]> {
        const query = gql`
            query getMaterials {
                getMaterials {
                    id
                    name
                    albedo {
                        r
                        g
                        b
                        a
                    }
                    metallic
                    roughness
                    ao
                    emissive {
                        r
                        g
                        b
                        a
                    }
                }
            }
        `;
        // Force network request to avoid stale cache
        const res = await apolloClient.query({
            query,
            fetchPolicy: "network-only",
        });
        const data = (res.data as { getMaterials: any[] }).getMaterials;
        return data;
    }
}
