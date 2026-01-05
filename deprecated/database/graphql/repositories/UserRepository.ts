import { gql } from "@apollo/client";
import { apolloClient } from "../client";

export class UserRepository {
    async updateApiKey(userId: string, apiKey: string): Promise<boolean> {
        const mutation = gql`
            mutation UpdateApiKey($userId: String!, $apiKey: String!) {
                updateApiKey(userId: $userId, apiKey: $apiKey) {
                    acknowledged
                }
            }
        `;
        const result = await apolloClient.mutate({
            mutation,
            variables: { userId, apiKey },
        });
        return (result.data as { updateApiKey: { acknowledged: boolean } })
            .updateApiKey.acknowledged;
    }

    async getApiKey(userId: string): Promise<string | null> {
        const query = gql`
            query GetApiKey($userId: String!) {
                getApiKey(userId: $userId)
            }
        `;
        const result = await apolloClient.query({
            query,
            variables: { userId },
        });
        return (result.data as { getApiKey: string | null }).getApiKey;
    }
}
