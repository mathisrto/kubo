import { FilesPort } from "@/src/core/ports/filesPort";
import { Readable } from "stream";

// export async function importModel3D(
//     world: World,
//     file: ArrayBuffer,
//     format: ModelFileFormat,
//     filesPort: FilesPort,
//     material?: Material
// ) {
//     const buffer = Buffer.from(file);

//     // Déterminer l'extension selon le format
//     const extensions: Record<ModelFileFormat, string> = {
//         gltf: ".gltf",
//         glb: ".glb",
//         obj: ".obj",
//         fbx: ".fbx",
//         stl: ".stl",
//         generated: ".generated",
//     };

//     const uploadedFile = await filesPort.uploadFile(
//         buffer,
//         "model3d",
//         extensions[format]
//     );

//     const modelId = createModel3D(world, {
//         name: "Imported Model",
//         format: format,
//         fileId: uploadedFile.filename,
//     });

//     const model = world.models[modelId];
//     if (model && material) {
//         model.materialId = model.materialId;
//         world.materials[model.materialId] = material;
//     }
// }

// export async function downloadModel3D(
//     world: World,
//     fileId: string,
//     filesPort: FilesPort
// ) {
//     const file = await filesPort.downloadFile(fileId);
//     return file;
// }

// export async function importAlbedoMap(
//     world: World,
//     modelId: Entity,
//     file: ArrayBuffer,
//     filesPort: FilesPort
// ) {
//     const model = world.models[modelId];
//     if (!model) {
//         throw new Error("Model not found");
//     }

//     const material = world.materials[model.materialId];
//     if (!material) {
//         throw new Error("Material not found");
//     }

//     const buffer = Buffer.from(file);
//     // Par défaut, utiliser .jpg pour les textures d'albedo
//     const uploadedFile = await filesPort.uploadFile(buffer, "texture", ".jpg");

//     const texture = world.textures[material.albedoMap];
//     if (texture) {
//         world.textures[material.albedoMap] = {
//             ...texture,
//             fileId: uploadedFile.filename,
//         };
//     }
// }

// export async function deleteTextureEnvironment(
//     world: World,
//     filesPort: FilesPort
// ) {
//     if (world.environment.environmentMap) {
//         await filesPort.deleteFile(world.environment.environmentMap);
//         world.environment.environmentMap = undefined;
//     }
// }

// export async function importMaterialTexture(
//     world: World,
//     modelId: Entity,
//     file: ArrayBuffer,
//     filesPort: FilesPort,
//     key: keyof Material
// ) {
//     const material = getMaterialFromModel(world, modelId);

//     const buffer = Buffer.from(file);
//     // Par défaut, utiliser .jpg pour les textures de matériaux
//     const uploadedFile = await filesPort.uploadFile(buffer, "texture", ".jpg");

//     const textureId = material[key];
//     const texture = world.textures[textureId];

//     if (!texture) {
//         throw new Error(`Texture ${key} not found`);
//     }

//     world.textures[textureId] = {
//         ...texture,
//         fileId: uploadedFile.filename,
//     };
// }

// export async function deleteMaterialTexture(
//     world: World,
//     modelId: Entity,
//     filesPort: FilesPort,
//     key: keyof Material
// ) {
//     const material = getMaterialFromModel(world, modelId);

//     const textureId = material[key];
//     const texture = world.textures[textureId];

//     if (!texture) return;

//     await filesPort.deleteFile(texture.fileId);
//     texture.fileId = DEFAULT_TEXTURE;
// }

export async function importFile(
    formData: FormData,
    filesPort: FilesPort,
    userId: string,
) {
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("No file provided");
    }

    // Détecter l'extension du fichier
    const extension = file.name.substring(file.name.lastIndexOf(".")); // .hdr, .exr, etc.

    // Déterminer le type de fichier selon l'extension
    const model3dExtensions = [".gltf", ".glb", ".obj", ".fbx", ".stl"];
    const fileType = model3dExtensions.includes(extension.toLowerCase())
        ? "model3d"
        : "texture";

    // Lire le fichier côté serveur
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedFile = await filesPort.uploadFile(
        buffer,
        fileType as "model3d" | "texture",
        extension,
        userId,
    );

    return {
        gridFsId: uploadedFile.gridFsId.toString(),
    };
}

export async function importModel3D(
    formData: FormData,
    filesPort: FilesPort,
    userId: string,
): Promise<{ gridFsId: string; format: string; filename: string }> {
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("No file provided");
    }

    // Validation de la taille (200 Mo max)
    if (file.size > 200 * 1024 * 1024) {
        throw new Error("File too large (max 200MB)");
    }

    // Détecter l'extension et le format
    const extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();

    const formatMap: Record<string, string> = {
        ".gltf": "gltf",
        ".glb": "glb",
    };

    const format = formatMap[extension];
    if (!format) {
        throw new Error(
            `Unsupported 3D format: ${extension}. Supported: .gltf, .glb`,
        );
    }

    // Lire le fichier côté serveur
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // Pour les fichiers GLTF, vérifier les références externes
    // (textures/buffers qui ne sont pas des data URIs)
    if (format === "gltf") {
        try {
            const gltfJson = JSON.parse(buffer.toString("utf-8"));
            const hasExternalImages = gltfJson.images?.some(
                (img: { uri?: string }) =>
                    img.uri && !img.uri.startsWith("data:"),
            );
            const hasExternalBuffers = gltfJson.buffers?.some(
                (buf: { uri?: string }) =>
                    buf.uri && !buf.uri.startsWith("data:"),
            );

            if (hasExternalImages || hasExternalBuffers) {
                throw new Error(
                    "GLTF files with external textures or buffers are not supported. " +
                        "Please use a .glb file instead (which embeds all resources), " +
                        "or export your GLTF with embedded base64 data URIs.",
                );
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error("Invalid GLTF file: could not parse JSON.");
            }
            throw e;
        }
    }

    // Nom du fichier sans extension
    const filename = file.name.substring(0, file.name.lastIndexOf("."));

    const uploadedFile = await filesPort.uploadFile(
        buffer,
        "model3d",
        extension,
        userId,
    );

    return {
        gridFsId: uploadedFile.gridFsId.toString(),
        format,
        filename,
    };
}

export async function exportFile(
    fileId: string,
    filesPort: FilesPort,
    userId: string,
) {
    // Récupérer les infos du fichier pour avoir l'extension
    const fileInfo = await filesPort.getFileInfo(fileId, userId);
    const fileStream = await filesPort.downloadFile(fileId, userId);

    // Convertir le stream en buffer pour NextResponse
    const chunks: Buffer[] = [];
    for await (const chunk of fileStream as Readable) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return {
        buffer,
        extension: fileInfo.extension,
    };
}
