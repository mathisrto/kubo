import * as THREE from "three";

/**
 * Plugin GLTFLoader pour supporter l'extension dépréciée
 * KHR_materials_pbrSpecularGlossiness.
 *
 * Three.js ≥ 0.174 a retiré le support natif de cette extension.
 * Beaucoup de modèles téléchargés depuis Sketchfab l'utilisent encore.
 *
 * Ce plugin convertit les propriétés spec/gloss en matériau PBR standard
 * (metallic/roughness workflow) pour un rendu approximativement correct.
 */

const EXTENSION_NAME = "KHR_materials_pbrSpecularGlossiness";

interface SpecGlossData {
    diffuseFactor?: [number, number, number, number];
    diffuseTexture?: { index: number; texCoord?: number };
    specularFactor?: [number, number, number];
    glossinessFactor?: number;
    specularGlossinessTexture?: { index: number; texCoord?: number };
}

// Minimal subset of the GLTF parser interface we need
interface GLTFParser {
    json: {
        extensionsUsed?: string[];
        materials?: Array<{
            extensions?: Record<string, SpecGlossData>;
            [key: string]: unknown;
        }>;
    };
    associations: Map<unknown, { materials?: number; [key: string]: unknown }>;
    getDependency(type: string, index: number): Promise<unknown>;
}

/**
 * Estimate metalness/roughness from specular/glossiness values.
 * This is a simplified conversion — not physically exact, but visually close.
 */
function specGlossToMetalRough(
    specular: [number, number, number],
    glossiness: number,
): { metalness: number; roughness: number } {
    // Perceived brightness of specular color
    const perceivedSpecular =
        0.2126 * specular[0] + 0.7152 * specular[1] + 0.0722 * specular[2];

    // High specular brightness → metallic, low → dielectric
    const metalness = Math.min(1, Math.max(0, perceivedSpecular));
    const roughness = 1 - glossiness;

    return { metalness, roughness };
}

export class GLTFSpecularGlossinessPlugin {
    name = EXTENSION_NAME;
    parser: GLTFParser;

    constructor(parser: GLTFParser) {
        this.parser = parser;
    }

    getMaterialType(_materialIndex: number): typeof THREE.MeshStandardMaterial {
        const materialDef = this.parser.json.materials?.[_materialIndex];
        if (!materialDef?.extensions?.[EXTENSION_NAME]) return null!;
        return THREE.MeshStandardMaterial;
    }

    async extendMaterialParams(
        materialIndex: number,
        materialParams: Record<string, unknown>,
    ): Promise<void> {
        const materialDef = this.parser.json.materials?.[materialIndex];
        if (!materialDef?.extensions?.[EXTENSION_NAME]) return;

        const sgData = materialDef.extensions[EXTENSION_NAME] as SpecGlossData;

        // Diffuse factor → color + opacity
        if (sgData.diffuseFactor) {
            const [r, g, b, a] = sgData.diffuseFactor;
            materialParams.color = new THREE.Color(r, g, b);
            if (a < 1) {
                materialParams.opacity = a;
                materialParams.transparent = true;
            }
        }

        // Diffuse texture → map
        if (sgData.diffuseTexture != null) {
            const texture = await this.parser.getDependency(
                "texture",
                sgData.diffuseTexture.index,
            );
            if (texture) {
                materialParams.map = texture;
            }
        }

        // Convert specular/glossiness to metalness/roughness
        const specFactor = sgData.specularFactor ?? [1, 1, 1];
        const glossFactor = sgData.glossinessFactor ?? 1;

        const { metalness, roughness } = specGlossToMetalRough(
            specFactor as [number, number, number],
            glossFactor,
        );

        materialParams.metalness = metalness;
        materialParams.roughness = roughness;

        // Specular-glossiness texture → use as rough/metal approximation
        if (sgData.specularGlossinessTexture != null) {
            const texture = await this.parser.getDependency(
                "texture",
                sgData.specularGlossinessTexture.index,
            );
            if (texture) {
                // Use the specular-glossiness texture as a roughness map
                // (inverted glossiness). Not perfect but way better than white.
                materialParams.roughnessMap = texture;
                materialParams.metalnessMap = texture;
            }
        }
    }
}

/**
 * Extend the GLTFLoader to register the specular-glossiness plugin.
 * Usage: useGLTF(url, true, true, extendGLTFLoader)
 */
export function extendGLTFLoader(loader: {
    register: (
        callback: (parser: GLTFParser) => GLTFSpecularGlossinessPlugin,
    ) => void;
}) {
    loader.register(
        (parser: GLTFParser) => new GLTFSpecularGlossinessPlugin(parser),
    );
}
