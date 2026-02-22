import { MongoClient } from "mongodb";

type NodeEnv = NodeJS.ProcessEnv["NODE_ENV"]; // "development" | "production" | "test" | undefined

const NODE_ENV_VALUES: Exclude<NodeEnv, undefined>[] = [
    "development",
    "production",
    "test",
];

import dotenv from "dotenv";
import path from "path";

const log = {
    info: (msg: string) => console.log(msg),
    error: (msg: string) => console.error(msg),
};

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
                "Variables d'environnement de la base de données manquantes",
            );
        }

        log.info(
            `🔧 Initialisation de la base de données pour l'environnement ${env}`,
        );

        const client = new MongoClient(
            `mongodb://${rootUser}:${rootPass}@${uri}/admin`,
            {
                serverSelectionTimeoutMS: 5000, // 5 secondes au lieu de 30
            },
        );

        try {
            // Connexion à MongoDB
            await client.connect();
            log.info("✅ Connexion à MongoDB réussie");

            const adminDb = client.db("admin");

            // Création de l'utilisateur
            try {
                await adminDb.command({
                    createUser: user,
                    pwd: password,
                    roles: [{ role: "readWrite", db: dbName }],
                });
                log.info(`✅ Utilisateur '${user}' créé`);
            } catch {
                log.info(`ℹ️ Utilisateur '${user}' existe déjà`);
            }

            // Création de la collection 'scenes'
            const appDb = client.db(dbName);
            const collections = await appDb.listCollections().toArray();
            if (!collections.find((c) => c.name === "scenes")) {
                await appDb.createCollection("scenes");
                log.info("✅ Collection 'scenes' créée");
            } else {
                log.info("ℹ️ Collection 'scenes' existe déjà");
            }

            // Création de la collection 'files'
            if (!collections.find((c) => c.name === "files")) {
                await appDb.createCollection("files");
                log.info("✅ Collection 'files' créée");
            } else {
                log.info("ℹ️ Collection 'files' existe déjà");
            }

            log.info(`✅ Base '${dbName}' prête à l'emploi`);
        } catch {
            throw new Error("❌ Impossible de se connecter à MongoDB");
        } finally {
            await client.close();
        }
    }
}

initDatabase().catch(log.error);
