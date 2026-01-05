export enum TRANSFORM_MODES {
    TRANSLATE = "translate",
    ROTATE = "rotate",
    SCALE = "scale",
}

export enum OBJECT_TYPES {
    MODEL = "model",
    LIGHT = "light",
}

export enum CameraType {
    PERSPECTIVE = "perspective",
    ORTHOGRAPHIC = "orthographic",
}

export enum LightType {
    POINT = "point",
    DIRECTIONAL = "directional",
    SPOT = "spot",
    AMBIENT = "ambient",
}

export enum ModelFileFormat {
    GLTF = "gltf",
    OBJ = "obj",
    FBX = "fbx",
    STL = "stl",
    GENERATED = "generated",
}

export enum TextureWrap {
    REPEAT = "RepeatWrapping",
    CLAMP_TO_EDGE = "ClampToEdgeWrapping",
    MIRRORED_REPEAT = "MirroredRepeatWrapping",
}

export enum TextureMapping {
    UV = "UVMapping",
    CUBE_REFLECTION = "CubeReflectionMapping",
    CUBE_REFRACTION = "CubeRefractionMapping",
    SPHERICAL_REFLECTION = "SphericalReflectionMapping",
    CUBE_UV_REFLECTION = "CubeUVReflectionMapping",
    CUBE_UV_REFRACTION = "CubeUVRefractionMapping",
}

export enum TextureFormat {
    RGB = "RGBFormat",
    RGBA = "RGBAFormat",
    LUMINANCE = "LuminanceFormat",
    LUMINANCE_ALPHA = "LuminanceAlphaFormat",
    ALPHA = "AlphaFormat",
}

export enum TextureType {
    UNSIGNED_BYTE = "UnsignedByteType",
    BYTE = "ByteType",
    SHORT = "ShortType",
    UNSIGNED_SHORT = "UnsignedShortType",
    INT = "IntType",
    UNSIGNED_INT = "UnsignedIntType",
    FLOAT = "FloatType",
    HALF_FLOAT = "HalfFloatType",
}

export enum EncodingType {
    LINEAR = "LinearEncoding",
    SRGB = "sRGBEncoding",
    GAMMA = "GammaEncoding",
    RGBE = "RGBEEncoding",
    LOG_LUV = "LogLuvEncoding",
}

export const DEFAULT_TEXTURE = "default";

export const SAVE_DELAY_MS = 100;

export const locales = ["fr", "en"];
export const defaultLocale = "fr";
