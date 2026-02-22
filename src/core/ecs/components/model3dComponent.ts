import { Entity, File } from "@/src/core/ecs/components/indexComponent";
import { ModelFileFormat } from "@/src/types";

export interface ModelAnimation {
    /** Noms des animations disponibles dans le fichier GLTF */
    available: readonly string[];
    /** Nom de l'animation actuellement jouée (null = aucune) */
    current: string | null;
    /** Est-ce que l'animation est en cours de lecture */
    playing: boolean;
}

export interface Model3D {
    fileId: File;
    format: ModelFileFormat;
    materialId: Entity;
    animation?: ModelAnimation;
    metadata?: {
        primitive: string;
    };
}
