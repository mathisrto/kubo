import { Entity, Material } from "@/src/core/ecs/components/indexComponent";
import { World } from "@/src/core/ecs/world";
import { FilesPort } from "@/src/core/ports/filesPort";
import { DEFAULT_TEXTURE, ModelFileFormat } from "../../../types";
import { getMaterialFromModel } from "../queries/indexQuery";
import { createModel3D } from "./model3dEngine";

export async function importModel3D(
    world: World,
    file: ArrayBuffer,
    format: ModelFileFormat,
    filesPort: FilesPort,
    material?: Material
) {
    const buffer = Buffer.from(file);
    const uploadedFile = await filesPort.uploadFile(buffer, "model3d");

    const modelId = createModel3D(world, {
        name: "Imported Model",
        format: format,
        fileId: uploadedFile.filename,
    });

    const model = world.models[modelId];
    if (model && material) {
        model.materialId = model.materialId;
        world.materials[model.materialId] = material;
    }
}

export async function downloadModel3D(
    world: World,
    fileId: string,
    filesPort: FilesPort
) {
    const file = await filesPort.downloadFile(fileId);
    return file;
}

export async function importAlbedoMap(
    world: World,
    modelId: Entity,
    file: ArrayBuffer,
    filesPort: FilesPort
) {
    const model = world.models[modelId];
    if (!model) {
        throw new Error("Model not found");
    }

    const material = world.materials[model.materialId];
    if (!material) {
        throw new Error("Material not found");
    }

    const buffer = Buffer.from(file);
    const uploadedFile = await filesPort.uploadFile(buffer, "texture");

    const texture = world.textures[material.albedoMap];
    if (texture) {
        world.textures[material.albedoMap] = {
            ...texture,
            fileId: uploadedFile.filename,
        };
    }
}

export async function importTextureEnvironment(
    world: World,
    file: ArrayBuffer,
    filesPort: FilesPort
) {
    const buffer = Buffer.from(file);
    const uploadedFile = await filesPort.uploadFile(buffer, "texture");
    world.environment.environmentMap = uploadedFile.filename;
}

export async function deleteTextureEnvironment(
    world: World,
    filesPort: FilesPort
) {
    if (world.environment.environmentMap) {
        await filesPort.deleteFile(world.environment.environmentMap);
        world.environment.environmentMap = undefined;
    }
}

export async function importMaterialTexture(
    world: World,
    modelId: Entity,
    file: ArrayBuffer,
    filesPort: FilesPort,
    key: keyof Material
) {
    const material = getMaterialFromModel(world, modelId);

    const buffer = Buffer.from(file);
    const uploadedFile = await filesPort.uploadFile(buffer, "texture");

    const textureId = material[key];
    const texture = world.textures[textureId];

    if (!texture) {
        throw new Error(`Texture ${key} not found`);
    }

    world.textures[textureId] = {
        ...texture,
        fileId: uploadedFile.filename,
    };
}

export async function deleteMaterialTexture(
    world: World,
    modelId: Entity,
    filesPort: FilesPort,
    key: keyof Material
) {
    const material = getMaterialFromModel(world, modelId);

    const textureId = material[key];
    const texture = world.textures[textureId];

    if (!texture) return;

    await filesPort.deleteFile(texture.fileId);
    texture.fileId = DEFAULT_TEXTURE;
}
