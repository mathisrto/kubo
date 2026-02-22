// adapters/mongodb/GridFSService.ts
import {
    FileModel,
    FileType,
    IFile,
} from "@/src/adapters/mongodb/models/filesModel";
import { File } from "@/src/core/ecs/components/indexComponent";
import { FilesPort } from "@/src/core/ports/filesPort";
import { getMongooseClient } from "@/src/db";
import crypto from "crypto";
import { mongo } from "mongoose";
import { Readable } from "stream";

export class FilesAdapter implements FilesPort {
    private bucket: mongo.GridFSBucket | null = null;

    private async getBucket(): Promise<mongo.GridFSBucket> {
        if (this.bucket) return this.bucket;

        const mongoose = await getMongooseClient();
        if (!mongoose) throw new Error("Mongo not connected");
        const db = mongoose.connection.db;
        if (!db) throw new Error("Mongo connection has no db");

        this.bucket = new mongo.GridFSBucket(db, {
            bucketName: "files",
        });
        return this.bucket;
    }

    public async uploadFile(
        buffer: Buffer,
        type: FileType,
        extension: string,
        userId: string,
    ): Promise<IFile> {
        const hash = crypto.createHash("sha256").update(buffer).digest("hex");

        // Vérifier si le fichier existe déjà pour cet utilisateur
        const existing = await FileModel.findOne({ hash, userId });
        if (existing) {
            existing.use += 1;
            await FileModel.updateOne(
                { _id: existing._id },
                { $inc: { use: 1 } },
            );
            return existing; // on réutilise le même fichier
        }

        const bucket = await this.getBucket();

        return new Promise(async (resolve, reject) => {
            const uploadStream = bucket.openUploadStream(`${type}_${hash}`);
            Readable.from(buffer).pipe(uploadStream);

            uploadStream.on("finish", async () => {
                const fileDoc = await FileModel.create({
                    filename: `${type}_${hash}`,
                    hash,
                    userId,
                    type,
                    gridFsId: uploadStream.id,
                    size: buffer.length,
                    extension,
                    uploadedAt: new Date(),
                    use: 1,
                });
                resolve(fileDoc);
            });

            uploadStream.on("error", reject);
        });
    }

    public async downloadFile(
        gridFsId: File,
        userId: string,
    ): Promise<Readable> {
        // Vérifier que le fichier appartient à l'utilisateur
        const fileRecord = await FileModel.findOne({
            gridFsId: new mongo.ObjectId(gridFsId),
            userId,
        });
        if (!fileRecord) {
            throw new Error("File not found or access denied");
        }
        const bucket = await this.getBucket();
        return bucket.openDownloadStream(new mongo.ObjectId(gridFsId));
    }

    public async downloadFileByName(
        filename: string,
        userId: string,
    ): Promise<Readable> {
        const fileRecord = await FileModel.findOne({ filename, userId });
        if (!fileRecord) {
            throw new Error(`File not found: ${filename}`);
        }
        const bucket = await this.getBucket();
        return bucket.openDownloadStream(fileRecord.gridFsId);
    }

    public async getFileInfo(
        gridFsId: string | mongo.ObjectId,
        userId: string,
    ): Promise<IFile> {
        const fileRecord = await FileModel.findOne({
            gridFsId: new mongo.ObjectId(gridFsId),
            userId,
        });
        if (!fileRecord) {
            throw new Error(`File not found: ${gridFsId}`);
        }
        return fileRecord;
    }

    public async deleteFile(
        gridFsId: string | mongo.ObjectId,
        userId: string,
    ): Promise<void> {
        const bucket = await this.getBucket();
        const fileRecord = await FileModel.findOne({
            gridFsId: new mongo.ObjectId(gridFsId),
            userId,
        });
        if (!fileRecord) {
            throw new Error("File record not found or access denied");
        }
        if (fileRecord.use > 1) {
            // Just decrease the use count
            await FileModel.updateOne(
                { gridFsId, userId },
                { $inc: { use: -1 } },
            );
            return;
        }
        await bucket.delete(new mongo.ObjectId(gridFsId));
        await FileModel.deleteOne({ gridFsId, userId });
    }
}
