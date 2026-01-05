import { Collection, Db, MongoClient } from "mongodb";
import { DatabaseDocument } from "../types";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoClient(): Promise<MongoClient | null> {
    if (client) return client;

    const dbName = process.env.DATABASE_NAME;
    const user = process.env.DATABASE_USERNAME;
    const password = process.env.DATABASE_PASSWORD;
    const uri = process.env.DATABASE_URI;

    if (!dbName || !user || !password || !uri) {
        console.error("❌ Variables d'environnement Mongo manquantes");
        return null;
    }

    try {
        console.log("🔌 Connexion à MongoDB...");
        console.log(`URI: mongodb://${user}:${password}@${uri}/${dbName}`);

        client = new MongoClient(
            `mongodb://${user}:${password}@${uri}/${dbName}?authSource=admin`,
            {
                serverSelectionTimeoutMS: 2000,
            }
        );

        await client.connect();
        db = client.db(dbName);
        console.log("✅ MongoDB connecté (singleton)");
        return client;
    } catch (error) {
        console.error("❌ Erreur lors de la connexion MongoDB :", error);
        client = null;
        db = null;
        return null;
    }
}

export async function getDb(): Promise<Db | null> {
    if (db) return db;
    const client = await getMongoClient();
    if (!client) return null;

    db = client.db(process.env.DATABASE_NAME);
    return db;
}

export async function getModelsCollection(): Promise<Collection<DatabaseDocument> | null> {
    const database = await getDb();

    if (!database) {
        console.warn("⚠️ Database not initialized (getModelsCollection)");
        return null;
    }

    return database.collection("models");
}

export async function getUidFromApiKey(apiKey: string): Promise<string | null> {
    const database = await getDb();
    if (!database) return null;

    const hashedApiKey = await hashApiKey(apiKey);

    const user = await database
        .collection("users")
        .findOne({ apiKey: hashedApiKey });
    return user ? user.uid : null;
}

export async function hashApiKey(apiKey: string): Promise<string> {
    const crypto = await import("crypto");
    return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export async function uidExists(uid: string): Promise<boolean> {
    const database = await getDb();
    if (!database) return false;
    const user = await database.collection("users").findOne({ uid });
    return user !== null;
}
