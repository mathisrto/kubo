import { Vector3 } from "@/src/core/ecs/components/indexComponent";
import { CameraType } from "@/src/types";

export interface Camera {
    position: Vector3;
    fov: number;
    near: number;
    far: number;
    type: CameraType;
    target: Vector3;
}
