import { FileType, IFile } from "@/src/adapters/mongodb/models/filesModel";
import { ObjectId } from "mongodb";
import { Readable } from "stream";

export interface FilesPort {
    uploadFile(
        buffer: Buffer,
        type: FileType,
        extension: string,
        userId: string,
    ): Promise<IFile>;
    downloadFile(
        gridFsId: string | ObjectId,
        userId: string,
    ): Promise<Readable>;
    downloadFileByName(filename: string, userId: string): Promise<Readable>;
    getFileInfo(gridFsId: string | ObjectId, userId: string): Promise<IFile>;
    deleteFile(gridFsId: string | ObjectId, userId: string): Promise<void>;
}
