import { Entity } from "@/src/core/ecs/components/indexComponent";

export interface Material {
    albedoMap: Entity;
    normalMap: Entity;
    metallicMap: Entity;
    roughnessMap: Entity;
    emissiveMap: Entity;
    aoMap: Entity;
}
