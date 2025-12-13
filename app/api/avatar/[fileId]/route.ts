import { GridFSService } from "@/lib/database/gridfs";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/avatar/[fileId]
 * Retrieve an avatar image from GridFS
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const { fileId } = await params;

        if (!fileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 }
            );
        }

        const gridfsService = GridFSService.getInstance();
        const fileInfo = await gridfsService.getAvatarFileInfo(fileId);

        if (!fileInfo) {
            return NextResponse.json(
                { error: "Avatar not found" },
                { status: 404 }
            );
        }

        const stream = await gridfsService.downloadAvatarFile(fileId);
        if (!stream) {
            return NextResponse.json(
                { error: "Failed to download avatar" },
                { status: 500 }
            );
        }

        // Convert stream to buffer
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Return image with appropriate headers
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": fileInfo.metadata?.contentType || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Content-Length": buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("❌ Avatar download error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
