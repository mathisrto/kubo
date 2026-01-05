"use server";

import crypto from "crypto";
import { getDb, hashApiKey } from "./database/client";

export async function generateApiKeyForUser(uid: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const apiKey = crypto.randomBytes(32).toString("hex");

    const hashedApiKey = await hashApiKey(apiKey);

    await db
        .collection("users")
        .updateOne(
            { uid },
            { $set: { apiKey: hashedApiKey } },
            { upsert: true }
        );

    return apiKey;
}

export async function userHasApiKey(uid: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const user = await db.collection("users").findOne({ uid });
    return !!(user && user.apiKey);
}
