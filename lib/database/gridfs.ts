import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "stream";
import { getDb } from "./client";

/**
 * GridFS Service for storing and retrieving 3D model files
 * Supports: .obj, .gltf, .glb, .fbx, textures, etc.
 */
export class GridFSService {
    private static instance: GridFSService;
    private bucket: GridFSBucket | null = null;

    private constructor() {}

    static getInstance(): GridFSService {
        if (!GridFSService.instance) {
            GridFSService.instance = new GridFSService();
        }
        return GridFSService.instance;
    }

    /**
     * Get or create GridFS bucket
     */
    private async getBucket(
        bucketName: string = "models3d"
    ): Promise<GridFSBucket | null> {
        const db = await getDb();
        if (!db) {
            console.error("❌ Cannot get MongoDB database for GridFS");
            return null;
        }

        const bucket = new GridFSBucket(db, {
            bucketName, // Collection prefix: {bucketName}.files, {bucketName}.chunks
        });

        return bucket;
    }

    /**
     * Upload a file to GridFS
     * @param buffer - File buffer
     * @param filename - Original filename (e.g., "model.glb")
     * @param metadata - Additional metadata (e.g., { contentType: "model/gltf-binary" })
     * @returns File ID (ObjectId as string)
     */
    async uploadFile(
        buffer: Buffer,
        filename: string,
        metadata?: Record<string, any>
    ): Promise<string | null> {
        try {
            const bucket = await this.getBucket("models3d");
            if (!bucket) return null;

            return new Promise((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(filename, {
                    metadata: {
                        ...metadata,
                        uploadedAt: new Date(),
                    },
                });

                const readableStream = Readable.from(buffer);
                readableStream.pipe(uploadStream);

                uploadStream.on("finish", () => {
                    console.log(
                        `✅ File uploaded to GridFS: ${filename} (${uploadStream.id})`
                    );
                    resolve(uploadStream.id.toString());
                });

                uploadStream.on("error", (error) => {
                    console.error("❌ GridFS upload error:", error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error("❌ Failed to upload file to GridFS:", error);
            return null;
        }
    }

    /**
     * Upload an avatar file to GridFS (avatars bucket)
     * @param buffer - File buffer
     * @param filename - Original filename (e.g., "avatar_uid_timestamp.jpg")
     * @param metadata - Additional metadata (e.g., { contentType: "image/jpeg" })
     * @returns File ID (ObjectId as string)
     */
    async uploadAvatarFile(
        buffer: Buffer,
        filename: string,
        metadata?: Record<string, any>
    ): Promise<string | null> {
        try {
            const bucket = await this.getBucket("avatars");
            if (!bucket) return null;

            return new Promise((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(filename, {
                    metadata: {
                        ...metadata,
                        uploadedAt: new Date(),
                    },
                });

                const readableStream = Readable.from(buffer);
                readableStream.pipe(uploadStream);

                uploadStream.on("finish", () => {
                    console.log(
                        `✅ Avatar uploaded to GridFS: ${filename} (${uploadStream.id})`
                    );
                    resolve(uploadStream.id.toString());
                });

                uploadStream.on("error", (error) => {
                    console.error("❌ GridFS avatar upload error:", error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error("❌ Failed to upload avatar to GridFS:", error);
            return null;
        }
    }

    /**
     * Download a file from GridFS
     * @param fileId - File ID (ObjectId as string)
     * @returns Readable stream
     */
    async downloadFile(fileId: string): Promise<Readable | null> {
        try {
            const bucket = await this.getBucket("models3d");
            if (!bucket) return null;

            const downloadStream = bucket.openDownloadStream(
                new ObjectId(fileId)
            );

            return downloadStream;
        } catch (error) {
            console.error("❌ Failed to download file from GridFS:", error);
            return null;
        }
    }

    /**
     * Download an avatar file from GridFS (avatars bucket)
     * @param fileId - File ID (ObjectId as string)
     * @returns Readable stream
     */
    async downloadAvatarFile(fileId: string): Promise<Readable | null> {
        try {
            const bucket = await this.getBucket("avatars");
            if (!bucket) return null;

            const downloadStream = bucket.openDownloadStream(
                new ObjectId(fileId)
            );

            return downloadStream;
        } catch (error) {
            console.error("❌ Failed to download avatar from GridFS:", error);
            return null;
        }
    }

    /**
     * Get file metadata from GridFS
     * @param fileId - File ID (ObjectId as string)
     * @returns File info (filename, length, metadata, etc.)
     */
    async getFileInfo(fileId: string): Promise<{
        filename: string;
        length: number;
        metadata?: Record<string, any>;
    } | null> {
        try {
            const bucket = await this.getBucket("models3d");
            if (!bucket) return null;

            const files = await bucket
                .find({ _id: new ObjectId(fileId) })
                .toArray();

            if (files.length === 0) {
                console.error(`❌ File not found in GridFS: ${fileId}`);
                return null;
            }

            const file = files[0];
            return {
                filename: file.filename,
                length: file.length,
                metadata: file.metadata,
            };
        } catch (error) {
            console.error("❌ Failed to get file info from GridFS:", error);
            return null;
        }
    }

    /**
     * Get avatar file metadata from GridFS (avatars bucket)
     * @param fileId - File ID (ObjectId as string)
     * @returns File info (filename, length, metadata, etc.)
     */
    async getAvatarFileInfo(fileId: string): Promise<{
        filename: string;
        length: number;
        metadata?: Record<string, any>;
    } | null> {
        try {
            const bucket = await this.getBucket("avatars");
            if (!bucket) return null;

            const files = await bucket
                .find({ _id: new ObjectId(fileId) })
                .toArray();

            if (files.length === 0) {
                console.error(`❌ Avatar not found in GridFS: ${fileId}`);
                return null;
            }

            const file = files[0];
            return {
                filename: file.filename,
                length: file.length,
                metadata: file.metadata,
            };
        } catch (error) {
            console.error("❌ Failed to get avatar info from GridFS:", error);
            return null;
        }
    }

    /**
     * Delete a file from GridFS
     * @param fileId - File ID (ObjectId as string)
     */
    async deleteFile(fileId: string): Promise<boolean> {
        try {
            // Try avatars bucket first, then models3d bucket
            let bucket = await this.getBucket("avatars");
            if (!bucket) return false;

            try {
                await bucket.delete(new ObjectId(fileId));
                console.log(`✅ File deleted from GridFS (avatars): ${fileId}`);
                return true;
            } catch {
                // If not found in avatars, try models3d
                bucket = await this.getBucket("models3d");
                if (!bucket) return false;

                await bucket.delete(new ObjectId(fileId));
                console.log(
                    `✅ File deleted from GridFS (models3d): ${fileId}`
                );
                return true;
            }
        } catch (error) {
            console.error("❌ Failed to delete file from GridFS:", error);
            return false;
        }
    }

    /**
     * List all files in GridFS
     * @param filter - Optional filter (e.g., { "metadata.contentType": "model/gltf-binary" })
     * @returns Array of file info
     */
    async listFiles(filter?: Record<string, any>): Promise<
        Array<{
            _id: string;
            filename: string;
            length: number;
            uploadDate: Date;
            metadata?: Record<string, any>;
        }>
    > {
        try {
            const bucket = await this.getBucket("models3d");
            if (!bucket) return [];

            const files = await bucket.find(filter || {}).toArray();

            return files.map((file: any) => ({
                _id: file._id.toString(),
                filename: file.filename,
                length: file.length,
                uploadDate: file.uploadDate,
                metadata: file.metadata,
            }));
        } catch (error) {
            console.error("❌ Failed to list files from GridFS:", error);
            return [];
        }
    }
}
