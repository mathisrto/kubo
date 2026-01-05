import { SceneType } from "./class/Scene";

export type DatabaseDocument = {
    _id: string;
    scene: SceneType;
    apiKey?: string;
};

export type ContextType = {
    uid: string;
};
