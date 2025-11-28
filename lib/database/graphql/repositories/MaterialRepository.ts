import { ColorType } from "@/lib/class/Color";
import { MaterialType } from "@/lib/class/Material";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class MaterialRepository {
    async getMaterialById(id: string): Promise<MaterialType | null> {
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
        return (
            (result.data as { getMaterialById: MaterialType | null })
                .getMaterialById || null
        );
    }

    async getMaterialName(id: string): Promise<string | null> {
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
        return (
            (result.data as { getMaterialName: string | null })
                .getMaterialName || null
        );
    }

    async getMaterialAlbedo(id: string): Promise<ColorType | null> {
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
        return (
            (result.data as { getMaterialAlbedo: ColorType | null })
                .getMaterialAlbedo || null
        );
    }

    async getMaterialMetallic(id: string): Promise<number | null> {
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
        return (
            (result.data as { getMaterialMetallic: number | null })
                .getMaterialMetallic || null
        );
    }

    async getMaterialRoughness(id: string): Promise<number | null> {
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
        return (
            (result.data as { getMaterialRoughness: number | null })
                .getMaterialRoughness || null
        );
    }

    async getMaterialAO(id: string): Promise<number | null> {
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
        return (
            (result.data as { getMaterialAO: number | null }).getMaterialAO ||
            null
        );
    }

    async getMaterialEmissive(id: string): Promise<ColorType | null> {
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
        return (
            (result.data as { getMaterialEmissive: ColorType | null })
                .getMaterialEmissive || null
        );
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
}
