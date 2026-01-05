import { AmbientLightType } from "@/lib/class/AmbientLight";
import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class AmbientLightRepository {
    async getAmbientLightIntensity(): Promise<number | undefined> {
        const query = gql`
            query getAmbientLightIntensity {
                getAmbientLightIntensity
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getAmbientLightIntensity: number | undefined;
            }
        ).getAmbientLightIntensity;
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

    async getAmbientLightEnvironmentMap(): Promise<string> {
        const query = gql`
            query getAmbientLightEnvironmentMap {
                getAmbientLightEnvironmentMap
            }
        `;
        const result = await apolloClient.query({
            query,
        });
        return (
            result.data as {
                getAmbientLightEnvironmentMap: string;
            }
        ).getAmbientLightEnvironmentMap;
    }

    async getAmbientLight() {
        const query = gql`
            query getAmbientLight {
                getAmbientLight {
                    intensity
                    environmentMap
                }
            }
        `;
        const res = await apolloClient.query({ query });
        return (res.data as { getAmbientLight: AmbientLightType })
            .getAmbientLight;
    }

    async updateAmbientLightEnvironmentMap(
        environmentMap: string
    ): Promise<boolean> {
        const mutation = gql`
            mutation updateAmbientLightEnvironmentMap($environmentMap: String) {
                updateAmbientLightEnvironmentMap(
                    environmentMap: $environmentMap
                ) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { environmentMap },
        });
        return (
            result.data as {
                updateAmbientLightEnvironmentMap: { acknowledged: boolean };
            }
        ).updateAmbientLightEnvironmentMap.acknowledged;
    }
}
