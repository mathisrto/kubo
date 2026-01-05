"use server";

import { getFilesPort } from "../providers/filesPortProvider";

export async function importFileAction(formData: FormData) {
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("No file provided");
    }

    // Détecter l'extension du fichier
    const extension = file.name.substring(file.name.lastIndexOf(".")); // .hdr, .exr, etc.

    // Lire le fichier côté serveur
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filesPort = await getFilesPort();

    console.log("Uploading file with extension:", extension);
    const uploadedFile = await filesPort.uploadFile(
        buffer,
        "texture",
        extension
    );

    return {
        gridFsId: uploadedFile.gridFsId.toString(),
    };
}
