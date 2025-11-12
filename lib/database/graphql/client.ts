import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

const httpLink = new HttpLink({
    uri: httpUri,
    headers: {},
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
