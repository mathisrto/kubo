import { ColorType } from "@/lib/class/Color";
import { LightType } from "@/lib/class/Light";
import { gql } from "@apollo/client";
import { Vector3Type } from "../../../class/Vector3";
import { apolloClient } from "../client";

export class LightRepository {
    async getLightById(id: string): Promise<LightType | null> {
        // Implement GraphQL query to get light by ID
        const query = gql`
            query getLightById($id: String!) {
                getLightById(id: $id) {
                    id
                    name
                    position {
                        x
                        y
                        z
                    }
                    color {
                        r
                        g
                        b
                        a
                    }
                    intensity
                    range
                    type
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightById: LightType | null }).getLightById ||
            null
        );
    }

    async getLightName(id: string): Promise<string | null> {
        // Implement GraphQL query to get light name
        const query = gql`
            query getLightName($id: String!) {
                getLightName(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightName: string | null }).getLightName ||
            null
        );
    }

    async getLightPosition(id: string): Promise<Vector3Type | null> {
        // Implement GraphQL query to get light position
        const query = gql`
            query getLightPosition($id: String!) {
                getLightPosition(id: $id) {
                    x
                    y
                    z
                }
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightPosition: Vector3Type | null })
                .getLightPosition || null
        );
    }

    async getLightColor(id: string): Promise<ColorType | null> {
        // Implement GraphQL query to get light color
        const query = gql`
            query getLightColor($id: String!) {
                getLightColor(id: $id) {
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
            (result.data as { getLightColor: ColorType | null })
                .getLightColor || null
        );
    }

    async getLightIntensity(id: string): Promise<number | null> {
        // Implement GraphQL query to get light intensity
        const query = gql`
            query getLightIntensity($id: String!) {
                getLightIntensity(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightIntensity: number | null })
                .getLightIntensity || null
        );
    }

    async getLightRange(id: string): Promise<number | null> {
        // Implement GraphQL query to get light range
        const query = gql`
            query getLightRange($id: String!) {
                getLightRange(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightRange: number | null }).getLightRange ||
            null
        );
    }

    async getLightType(id: string): Promise<string | null> {
        // Implement GraphQL query to get light type
        const query = gql`
            query getLightType($id: String!) {
                getLightType(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightType: string | null }).getLightType ||
            null
        );
    }

    async getLightColorMultiplier(id: string): Promise<number | null> {
        // Implement GraphQL query to get light color multiplier
        const query = gql`
            query getLightColorMultiplier($id: String!) {
                getLightColorMultiplier(id: $id)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { id },
        });
        return (
            (result.data as { getLightColorMultiplier: number | null })
                .getLightColorMultiplier || null
        );
    }

    async updateLightName(id: string, name: string): Promise<boolean> {
        // Implement GraphQL mutation to update light name
        const mutation = gql`
            mutation updateLightName($id: String!, $name: String!) {
                updateLightName(id: $id, name: $name) {
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
                updateLightName: { acknowledged: boolean };
            }
        ).updateLightName.acknowledged;
    }

    async updateLightPosition(
        id: string,
        position: Vector3Type
    ): Promise<boolean> {
        // Implement GraphQL mutation to update light position
        const mutation = gql`
            mutation updateLightPosition(
                $id: String!
                $position: Vector3Input!
            ) {
                updateLightPosition(id: $id, position: $position) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, position },
        });
        return (
            result.data as {
                updateLightPosition: { acknowledged: boolean };
            }
        ).updateLightPosition.acknowledged;
    }

    async updateLightColor(id: string, color: ColorType): Promise<boolean> {
        // Implement GraphQL mutation to update light color
        const mutation = gql`
            mutation updateLightColor($id: String!, $color: ColorInput!) {
                updateLightColor(id: $id, color: $color) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, color },
        });
        return (
            result.data as {
                updateLightColor: { acknowledged: boolean };
            }
        ).updateLightColor.acknowledged;
    }

    async updateLightIntensity(
        id: string,
        intensity: number
    ): Promise<boolean> {
        // Implement GraphQL mutation to update light intensity
        const mutation = gql`
            mutation updateLightIntensity($id: String!, $intensity: Float!) {
                updateLightIntensity(id: $id, intensity: $intensity) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, intensity },
        });
        return (
            result.data as {
                updateLightIntensity: { acknowledged: boolean };
            }
        ).updateLightIntensity.acknowledged;
    }

    async updateLightRange(id: string, range: number): Promise<boolean> {
        // Implement GraphQL mutation to update light range
        const mutation = gql`
            mutation updateLightRange($id: String!, $range: Float!) {
                updateLightRange(id: $id, range: $range) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, range },
        });
        return (
            result.data as {
                updateLightRange: { acknowledged: boolean };
            }
        ).updateLightRange.acknowledged;
    }

    async updateLightType(id: string, type: string): Promise<boolean> {
        // Implement GraphQL mutation to update light type
        const mutation = gql`
            mutation updateLightType($id: String!, $type: String!) {
                updateLightType(id: $id, type: $type) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, type },
        });
        return (
            result.data as {
                updateLightType: { acknowledged: boolean };
            }
        ).updateLightType.acknowledged;
    }

    async updateLightColorMultiplier(
        id: string,
        colorMultiplier: number
    ): Promise<boolean> {
        // Implement GraphQL mutation to update light color multiplier
        const mutation = gql`
            mutation updateLightColorMultiplier(
                $id: String!
                $colorMultiplier: Float!
            ) {
                updateLightColorMultiplier(
                    id: $id
                    colorMultiplier: $colorMultiplier
                ) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { id, colorMultiplier },
        });
        return (
            result.data as {
                updateLightColorMultiplier: { acknowledged: boolean };
            }
        ).updateLightColorMultiplier.acknowledged;
    }
}
