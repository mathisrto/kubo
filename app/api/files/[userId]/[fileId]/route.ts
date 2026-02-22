import { exportFile } from "@/src/core/ecs/engine/filesEngine";
import { getUidFromSessionCookie } from "@/src/helpers";
import logger from "@/src/logger";
import { getFilesPort } from "@/src/providers/filesPortProvider";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; fileId: string }> },
) {
    try {
        const { userId, fileId: rawFileId } = await params;

        // 1. Vérifier l'authentification via le session cookie
        const session = request.cookies.get("session")?.value;
        const uid = await getUidFromSessionCookie(session);

        if (!uid) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // 2. Vérifier que l'utilisateur accède à ses propres fichiers
        if (uid !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!rawFileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 },
            );
        }

        // 3. Enlever l'extension si présente (compatibilité avec Environment et modèles 3D)
        let fileId = rawFileId;
        const extensionMatch = fileId.match(
            /\.(hdr|exr|jpg|jpeg|png|glb|gltf)$/i,
        );
        if (extensionMatch) {
            fileId = fileId.replace(extensionMatch[0], "");
        }

        const filesPort = await getFilesPort();

        // 4. exportFile vérifie aussi que le fichier appartient au userId
        const { buffer, extension } = await exportFile(
            fileId,
            filesPort,
            userId,
        );

        // 5. Déterminer le type MIME selon l'extension
        const mimeTypes: Record<string, string> = {
            ".hdr": "image/vnd.radiance",
            ".exr": "image/x-exr",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".glb": "model/gltf-binary",
            ".gltf": "model/gltf+json",
        };

        const contentType = mimeTypes[extension] || "application/octet-stream";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        logger.error("Error downloading file:", error);
        return NextResponse.json(
            { error: "Failed to download file" },
            { status: 500 },
        );
    }
}
