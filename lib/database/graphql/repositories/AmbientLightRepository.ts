import { ColorType } from "@/lib/class/Color";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class AmbientLightRepository {
    async getAmbientLightColor(): Promise<ColorType> {
        const query = gql`
            query getAmbientLightColor {
                getAmbientLightColor {
                    r
                    g
                    b
                    a
                }
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getAmbientLightColor: ColorType;
            }
        ).getAmbientLightColor;
    }

    async getAmbientLightIntensity(): Promise<number> {
        const query = gql`
            query getAmbientLightIntensity {
                getAmbientLightIntensity {
                    intensity
                }
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getAmbientLightIntensity: number;
            }
        ).getAmbientLightIntensity;
    }

    async getAmbientLightColorMultiplier(): Promise<number> {
        const query = gql`
            query getAmbientLightColorMultiplier {
                getAmbientLightColorMultiplier
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getAmbientLightColorMultiplier: number;
            }
        ).getAmbientLightColorMultiplier;
    }

    async updateAmbientLightColor(color: ColorType): Promise<boolean> {
        const mutation = gql`
            mutation updateAmbientLightColor($color: ColorInput!) {
                updateAmbientLightColor(color: $color) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { color },
        });
        return (
            result.data as {
                updateAmbientLightColor: { acknowledged: boolean };
            }
        ).updateAmbientLightColor.acknowledged;
    }

    async updateAmbientLightIntensity(intensity: number): Promise<boolean> {
        const mutation = gql`
            mutation updateAmbientLightIntensity($intensity: Float!) {
                updateAmbientLightIntensity(intensity: $intensity) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { intensity },
        });
        return (
            result.data as {
                updateAmbientLightIntensity: { acknowledged: boolean };
            }
        ).updateAmbientLightIntensity.acknowledged;
    }

    async updateAmbientLightColorMultiplier(
        colorMultiplier: number
    ): Promise<boolean> {
        // Implement GraphQL mutation to update light color multiplier
        const mutation = gql`
            mutation updateAmbientLightColorMultiplier(
                $colorMultiplier: Float!
            ) {
                updateAmbientLightColorMultiplier(
                    colorMultiplier: $colorMultiplier
                ) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { colorMultiplier },
        });
        return (
            result.data as {
                updateAmbientLightColorMultiplier: { acknowledged: boolean };
            }
        ).updateAmbientLightColorMultiplier.acknowledged;
    }
}
