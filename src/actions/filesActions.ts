"use server";

import { importFile } from "../core/ecs/engine/filesEngine";
import { getFilesPort } from "../providers/filesPortProvider";

export async function importFileAction(formData: FormData) {
    try {
        const filesPort = await getFilesPort();
        return await importFile(formData, filesPort);
    } catch (error) {
        console.error("Error importing file:", error);
        throw error;
    }
}
