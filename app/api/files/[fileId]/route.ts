import { exportFile } from "@/src/core/ecs/engine/filesEngine";
import logger from "@/src/logger";
import { getFilesPort } from "@/src/providers/filesPortProvider";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        let { fileId } = await params;

        if (!fileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 }
            );
        }

        // Enlever l'extension si présente (pour compatibilité avec Environment)
        // Ex: 695bc23cedc6643bc49b1145.hdr -> 695bc23cedc6643bc49b1145
        const extensionMatch = fileId.match(/\.(hdr|exr|jpg|jpeg|png)$/i);
        if (extensionMatch) {
            fileId = fileId.replace(extensionMatch[0], "");
        }

        const filesPort = await getFilesPort();

        const { buffer, extension } = await exportFile(fileId, filesPort);

        // Déterminer le type MIME selon l'extension
        const mimeTypes: Record<string, string> = {
            ".hdr": "image/vnd.radiance",
            ".exr": "image/x-exr",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
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
            { status: 500 }
        );
    }
}
