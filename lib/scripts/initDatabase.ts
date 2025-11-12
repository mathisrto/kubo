import { MongoClient } from "mongodb";

type NodeEnv = NodeJS.ProcessEnv["NODE_ENV"]; // "development" | "production" | "test" | undefined

const NODE_ENV_VALUES: Exclude<NodeEnv, undefined>[] = [
    "development",
    "production",
    "test",
];

import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({
    path: path.join(process.cwd(), `.env.local`),
    override: true,
});

async function initDatabase() {
    for (const env of NODE_ENV_VALUES) {
        dotenv.config({
            path: path.join(process.cwd(), `.env.${env}`),
            override: true,
        });

        dotenv.config({
            path: path.join(process.cwd(), `.env.${env}.local`),
            override: true,
        });

        const dbName = process.env.DATABASE_NAME;
        const user = process.env.DATABASE_USERNAME;
        const password = process.env.DATABASE_PASSWORD;
        const uri = process.env.DATABASE_URI;

        const rootUser = process.env.DATABASE_ROOT_USERNAME;
        const rootPass = process.env.DATABASE_ROOT_PASSWORD;

        if (!dbName || !user || !password || !uri || !rootUser || !rootPass) {
            throw new Error(
                "Variables d'environnement de la base de données manquantes"
            );
        }

        console.log(
            `🔧 Initialisation de la base de données pour l'environnement ${env}`
        );

        const client = new MongoClient(
            `mongodb://${rootUser}:${rootPass}@${uri}/admin`,
            {
                serverSelectionTimeoutMS: 5000, // 5 secondes au lieu de 30
            }
        );

        try {
            // Connexion à MongoDB
            await client.connect();
            console.log("✅ Connexion à MongoDB réussie");

            const adminDb = client.db("admin");

            // Création de l'utilisateur
            try {
                await adminDb.command({
                    createUser: user,
                    pwd: password,
                    roles: [{ role: "readWrite", db: dbName }],
                });
                console.log(`✅ Utilisateur '${user}' créé`);
            } catch {
                console.log(`ℹ️ Utilisateur '${user}' existe déjà`);
            }

            // Création de la collection 'models'
            const appDb = client.db(dbName);
            const collections = await appDb.listCollections().toArray();
            if (!collections.find((c) => c.name === "models")) {
                await appDb.createCollection("models");
                console.log("✅ Collection 'models' créée");
            } else {
                console.log("ℹ️ Collection 'models' existe déjà");
            }

            // Création de la collection 'users'
            if (!collections.find((c) => c.name === "users")) {
                await appDb.createCollection("users");
                console.log("✅ Collection 'users' créée");
            } else {
                console.log("ℹ️ Collection 'users' existe déjà");
            }

            console.log(`✅ Base '${dbName}' prête à l'emploi`);
        } catch {
            throw new Error("❌ Impossible de se connecter à MongoDB");
        } finally {
            await client.close();
        }
    }
}

initDatabase().catch(console.error);
