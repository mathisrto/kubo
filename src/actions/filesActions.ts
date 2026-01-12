"use server";

import { importFile } from "../core/ecs/engine/filesEngine";
import logger from "../logger";
import { getFilesPort } from "../providers/filesPortProvider";

export async function importFileAction(formData: FormData) {
    try {
        const filesPort = await getFilesPort();
        return await importFile(formData, filesPort);
    } catch (error) {
        logger.error("Error importing file:", error);
        throw error;
    }
}
