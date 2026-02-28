/**
 * .kubo — Format de fichier propriétaire Kubo
 *
 * Un fichier .kubo est un fichier texte (JSON) contenant
 * l'intégralité de l'état d'une scène 3D ECS (World).
 *
 * Structure :
 * {
 *   "kubo": {
 *     "version":   "1.0.0",
 *     "createdAt": ISO-8601,
 *     "app":       "Kubo"
 *   },
 *   "world": { ... }
 * }
 */

import { World } from "@/src/core/ecs/world";

// ─── Types ───────────────────────────────────────────────────────────

export const KUBO_FILE_VERSION = "1.0.0";
export const KUBO_FILE_EXTENSION = ".kubo";
export const KUBO_MIME_TYPE = "application/x-kubo";

export interface KuboFileHeader {
    version: string;
    createdAt: string;
    app: string;
}

export interface KuboFile {
    kubo: KuboFileHeader;
    world: World;
}

// ─── Serialization ───────────────────────────────────────────────────

/**
 * Sérialise un World en fichier .kubo (texte JSON indenté).
 */
export function serializeKuboFile(world: World): string {
    const kuboFile: KuboFile = {
        kubo: {
            version: KUBO_FILE_VERSION,
            createdAt: new Date().toISOString(),
            app: "Kubo",
        },
        world: JSON.parse(JSON.stringify(world)), // deep clone pour dé-proxifier valtio
    };

    return JSON.stringify(kuboFile, null, 2);
}

// ─── Deserialization ─────────────────────────────────────────────────

export class KuboFileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "KuboFileError";
    }
}

/**
 * Désérialise le contenu d'un fichier .kubo et renvoie le World.
 * Lance une KuboFileError si le fichier est invalide.
 */
export function deserializeKuboFile(content: string): World {
    let parsed: unknown;

    try {
        parsed = JSON.parse(content);
    } catch {
        throw new KuboFileError(
            "Le fichier .kubo est invalide (JSON malformé).",
        );
    }

    if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("kubo" in parsed) ||
        !("world" in parsed)
    ) {
        throw new KuboFileError(
            "Le fichier .kubo ne contient pas la structure attendue (kubo + world).",
        );
    }

    const file = parsed as KuboFile;

    // Validation de l'en-tête
    if (!file.kubo.version || !file.kubo.app) {
        throw new KuboFileError(
            "En-tête .kubo invalide (version ou app manquant).",
        );
    }

    // Validation minimale du World
    const w = file.world;
    if (!w.camera || !w.environment) {
        throw new KuboFileError(
            "Le World dans le fichier .kubo est incomplet (camera ou environment manquant).",
        );
    }

    // S'assurer que les records existent même s'ils sont vides
    w.lights = w.lights ?? {};
    w.materials = w.materials ?? {};
    w.models = w.models ?? {};
    w.names = w.names ?? {};
    w.transforms = w.transforms ?? {};
    w.textures = w.textures ?? {};

    return w;
}

// ─── Export helper (côté navigateur) ─────────────────────────────────

/**
 * Déclenche le téléchargement d'un fichier .kubo dans le navigateur.
 */
export function downloadKuboFile(world: World, filename?: string): void {
    const content = serializeKuboFile(world);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `scene_${Date.now()}${KUBO_FILE_EXTENSION}`;
    document.body.appendChild(a);
    a.click();

    // Nettoyage
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// ─── Import helper (côté navigateur) ─────────────────────────────────

/**
 * Ouvre un sélecteur de fichiers .kubo et renvoie le World désérialisé.
 * Retourne `null` si l'utilisateur annule.
 */
export function openKuboFile(): Promise<World | null> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = KUBO_FILE_EXTENSION;

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                resolve(null);
                return;
            }

            try {
                const text = await file.text();
                const world = deserializeKuboFile(text);
                resolve(world);
            } catch (err) {
                reject(err);
            }
        };

        // Si l'utilisateur annule, on ne reçoit pas d'événement fiable.
        // On résout `null` après un délai raisonnable via focus.
        const handleFocus = () => {
            setTimeout(() => {
                if (!input.files?.length) resolve(null);
                window.removeEventListener("focus", handleFocus);
            }, 500);
        };
        window.addEventListener("focus", handleFocus);

        input.click();
    });
}
