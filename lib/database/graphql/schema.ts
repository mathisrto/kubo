import { mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import fs from "fs";
import path from "path";
import { ambientLightResolvers } from "./resolvers/AmbientLightResolver";
import { cameraResolvers } from "./resolvers/CameraResolver";
import { lightResolvers } from "./resolvers/LightResolver";
import { materialResolvers } from "./resolvers/MaterialResolver";
import { sceneObjectResolvers } from "./resolvers/SceneObjectResolver";
import { sceneResolvers } from "./resolvers/SceneResolver";
import { userResolvers } from "./resolvers/UserResolver";

const typeDefs = fs.readFileSync(
    path.join(process.cwd(), "lib/database/graphql/schema.graphql"),
    "utf8"
);

const resolvers = mergeResolvers([
    ambientLightResolvers,
    cameraResolvers,
    lightResolvers,
    materialResolvers,
    sceneObjectResolvers,
    sceneResolvers,
    userResolvers,
]);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
