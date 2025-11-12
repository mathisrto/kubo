import { SceneType } from "./class/Scene";

export type DatabaseDocument = {
    _id: string;
    scene: SceneType;
};

export type ContextType = {
    uid: string;
};
