// mongooseClient.ts
import mongoose from "mongoose";
import logger from "./logger";

let isConnected = false;

export async function getMongooseClient(): Promise<typeof mongoose | null> {
    if (isConnected) return mongoose;

    const dbName = process.env.DATABASE_NAME;
    const user = process.env.DATABASE_USERNAME;
    const password = process.env.DATABASE_PASSWORD;
    const uri = process.env.DATABASE_URI;

    if (!dbName || !user || !password || !uri) {
        logger.error("❌ Variables d'environnement Mongo manquantes");
        return null;
    }

    try {
        const fullUri = `mongodb://${user}:${password}@${uri}/${dbName}?authSource=admin`;
        logger.info("🔌 Connexion à MongoDB avec Mongoose...");
        logger.info(`URI: ${fullUri}`);

        await mongoose.connect(fullUri, {
            autoIndex: true,
            autoCreate: true,
            serverSelectionTimeoutMS: 2000,
            // autres options si besoin
        });

        isConnected = true;
        logger.info("✅ Mongoose connecté (singleton)");
        return mongoose;
    } catch (error) {
        logger.error("❌ Erreur lors de la connexion Mongoose :", error);
        return null;
    }
}
