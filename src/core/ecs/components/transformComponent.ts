import { Vector3 } from "@/src/core/ecs/components/indexComponent";

export interface Transform {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
}
