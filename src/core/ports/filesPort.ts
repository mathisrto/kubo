import { FileType, IFile } from "@/src/adapters/mongodb/models/filesModel";
import { ObjectId } from "mongodb";
import { Readable } from "stream";

export interface FilesPort {
    uploadFile(
        buffer: Buffer,
        type: FileType,
        extension: string
    ): Promise<IFile>;
    downloadFile(gridFsId: string | ObjectId): Promise<Readable>;
    downloadFileByName(filename: string): Promise<Readable>;
    getFileInfo(gridFsId: string | ObjectId): Promise<IFile>;
    deleteFile(gridFsId: string | ObjectId): Promise<void>;
}
