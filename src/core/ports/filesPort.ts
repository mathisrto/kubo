import { FileType, IFile } from "@/src/adapters/mongodb/models/filesModel";
import { ObjectId } from "mongodb";
import { Readable } from "stream";

export interface FilesPort {
    uploadFile(buffer: Buffer, type: FileType): Promise<IFile>;
    downloadFile(gridFsId: string | ObjectId): Promise<Readable>;
    deleteFile(gridFsId: string | ObjectId): Promise<void>;
}
