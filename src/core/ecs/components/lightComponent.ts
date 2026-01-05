import { Color } from "@/src/core/ecs/components/indexComponent";
import { LightType } from "@/src/types";

export interface Light {
    type: LightType;
    color: Color;
    range?: number;
    intensity: number;
}
