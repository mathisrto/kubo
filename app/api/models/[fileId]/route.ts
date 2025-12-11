import { GridFSService } from "@/lib/database/gridfs";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/models/[fileId]
 * Stream a 3D model file from GridFS
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { fileId: string } }
) {
    try {
        const { fileId } = params;

        if (!fileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 }
            );
        }

        const gridfsService = GridFSService.getInstance();

        // Get file info first
        const fileInfo = await gridfsService.getFileInfo(fileId);

        if (!fileInfo) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        // Stream the file
        const downloadStream = await gridfsService.downloadFile(fileId);

        // Convert Node.js Readable stream to Web ReadableStream
        const readableStream = new ReadableStream({
            start(controller) {
                downloadStream.on("data", (chunk: Buffer) => {
                    controller.enqueue(new Uint8Array(chunk));
                });

                downloadStream.on("end", () => {
                    controller.close();
                });

                downloadStream.on("error", (error) => {
                    console.error("Stream error:", error);
                    controller.error(error);
                });
            },
            cancel() {
                downloadStream.destroy();
            },
        });

        // Determine Content-Type based on format
        const contentTypeMap: Record<string, string> = {
            GLTF: "model/gltf+json",
            GLB: "model/gltf-binary",
            OBJ: "text/plain",
            FBX: "application/octet-stream",
            STL: "application/vnd.ms-pki.stl",
            PLY: "application/octet-stream",
        };

        const format = fileInfo.metadata?.format || "GLB";
        const contentType =
            contentTypeMap[format] || "application/octet-stream";

        // Return streaming response
        return new NextResponse(readableStream, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": fileInfo.length.toString(),
                "Content-Disposition": `inline; filename="${fileInfo.filename}"`,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error downloading 3D model:", error);
        return NextResponse.json(
            {
                error: "Failed to download 3D model",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/models/[fileId]
 * Delete a 3D model file from GridFS
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { fileId: string } }
) {
    try {
        const { fileId } = params;

        if (!fileId) {
            return NextResponse.json(
                { error: "File ID is required" },
                { status: 400 }
            );
        }

        const gridfsService = GridFSService.getInstance();

        // Check if file exists
        const fileInfo = await gridfsService.getFileInfo(fileId);

        if (!fileInfo) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        // Delete the file
        await gridfsService.deleteFile(fileId);

        return NextResponse.json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting 3D model:", error);
        return NextResponse.json(
            {
                error: "Failed to delete 3D model",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
