export const locales = ["fr", "en"];
export const defaultLocale = "fr";

export enum LIGHT_TYPES {
    POINT = "point",
    DIRECTIONAL = "directional",
    SPOT = "spot",
}

export enum CAMERA_TYPES {
    PERSPECTIVE = "perspective",
    ORTHOGRAPHIC = "orthographic",
}

export enum TRANSFORM_MODES {
    TRANSLATE = "translate",
    ROTATE = "rotate",
    SCALE = "scale",
}

export enum OBJECT_TYPES {
    MODEL = "model",
    LIGHT = "light",
}

export interface SelectedObjectProps {
    id: string;
    type: OBJECT_TYPES;
}
