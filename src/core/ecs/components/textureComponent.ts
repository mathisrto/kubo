import {
    EncodingType,
    TextureFormat,
    TextureMapping,
    TextureType,
    TextureWrap,
} from "../../../types";
import { File } from "./utils/fileComponent";

export interface Texture {
    fileId: File;
    mapping?: TextureMapping;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    repeat?: { x: number; y: number };
    offset?: { x: number; y: number };
    rotation?: number;
    flipY?: boolean;
    format?: TextureFormat;
    type?: TextureType;
    encoding?: EncodingType;
}
