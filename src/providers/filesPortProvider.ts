"use server";

import { FilesPort } from "@/src/core/ports/filesPort";
import { FilesAdapter } from "../adapters/mongodb/adapters/filesAdapter";

let filesPort: FilesPort | null = null;

export async function getFilesPort(): Promise<FilesPort> {
    if (!filesPort) {
        filesPort = new FilesAdapter();
    }
    return filesPort;
}
