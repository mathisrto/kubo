"use server";

import { cookies } from "next/headers";
import { importFile, importModel3D } from "../core/ecs/engine/filesEngine";
import { getUidFromSessionCookie } from "../helpers";
import logger from "../logger";
import { getFilesPort } from "../providers/filesPortProvider";

async function requireUserId(): Promise<string> {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    const uid = await getUidFromSessionCookie(session);
    if (!uid) throw new Error("Unauthorized");
    return uid;
}

export async function importFileAction(formData: FormData) {
    try {
        const userId = await requireUserId();
        const filesPort = await getFilesPort();
        return await importFile(formData, filesPort, userId);
    } catch (error) {
        logger.error("Error importing file:", error);
        throw error;
    }
}

export async function importModel3DAction(formData: FormData) {
    try {
        const userId = await requireUserId();
        const filesPort = await getFilesPort();
        return await importModel3D(formData, filesPort, userId);
    } catch (error) {
        logger.error("Error importing 3D model:", error);
        throw error;
    }
}
