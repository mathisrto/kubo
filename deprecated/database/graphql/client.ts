import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

// Utiliser BatchHttpLink pour grouper les requêtes multiples en une seule
const batchLink = new BatchHttpLink({
    uri: httpUri,
    batchMax: 10, // Max 10 requêtes par batch
    batchInterval: 20, // Attendre 20ms avant d'envoyer le batch
    headers: {},
});

export const apolloClient = new ApolloClient({
    link: batchLink,
    cache: new InMemoryCache(),
});
