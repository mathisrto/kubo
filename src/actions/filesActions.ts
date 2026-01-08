"use server";

import { importFile } from "../core/ecs/engine/filesEngine";
import { getFilesPort } from "../providers/filesPortProvider";

export async function importFileAction(formData: FormData) {
    const filesPort = await getFilesPort();
    return await importFile(formData, filesPort);
}
