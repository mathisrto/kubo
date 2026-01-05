import { Entity, File } from "@/src/core/ecs/components/indexComponent";
import { ModelFileFormat } from "@/src/types";

export interface Model3D {
    fileId: File;
    format: ModelFileFormat;
    materialId: Entity;
    metadata?: {
        primitive: string;
    };
}
