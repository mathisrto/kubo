// adapters/mongodb/model/FileModel.ts
import { model, models, Schema, Types } from "mongoose";

export type FileType = "model3d" | "texture";

export interface IFile {
    filename: string;
    hash: string; // SHA256
    type: FileType;
    gridFsId: Types.ObjectId;
    size: number;
    extension: string; // .hdr, .exr, .jpg, etc.
    uploadedAt: Date;
    use: number;
}

const FileSchema = new Schema<IFile>({
    filename: { type: String, required: true },
    hash: { type: String, required: true, index: true, unique: true },
    type: { type: String, enum: ["model3d", "texture"], required: true },
    gridFsId: { type: Schema.Types.ObjectId, required: true },
    size: { type: Number, required: true },
    extension: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    use: { type: Number, default: 1 },
});

export const FileModel =
    models.File || model<IFile>("File", FileSchema, "files");
