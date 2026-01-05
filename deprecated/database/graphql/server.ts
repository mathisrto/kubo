import { ApolloServer } from "@apollo/server";
import { schema } from "./schema";

const server = new ApolloServer({
    schema,
    allowBatchedHttpRequests: true, // Active le batching côté serveur
});

export default server;
