import { MODEL_FILE_FORMAT } from "@/lib/class/Model3D";
import { GridFSService } from "@/lib/database/gridfs";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/models/upload
 * Upload a 3D model file to GridFS and create a Model3D document
 *
 * Accepts multipart/form-data with:
 * - file: 3D model file (.obj, .gltf, .glb, .fbx, .stl, .ply)
 * - name: Model name (optional, defaults to filename)
 * - metadata: JSON string with additional metadata (optional)
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string | null;
        const metadataStr = formData.get("metadata") as string | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!extension) {
            return NextResponse.json(
                { error: "Invalid file: no extension found" },
                { status: 400 }
            );
        }

        // Map extension to MODEL_FILE_FORMAT
        const formatMap: Record<string, MODEL_FILE_FORMAT> = {
            gltf: MODEL_FILE_FORMAT.GLTF,
            glb: MODEL_FILE_FORMAT.GLB,
            obj: MODEL_FILE_FORMAT.OBJ,
            fbx: MODEL_FILE_FORMAT.FBX,
            stl: MODEL_FILE_FORMAT.STL,
            ply: MODEL_FILE_FORMAT.PLY,
        };

        const format = formatMap[extension];
        if (!format) {
            return NextResponse.json(
                {
                    error: `Unsupported file format: ${extension}. Supported formats: ${Object.keys(
                        formatMap
                    ).join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse metadata if provided
        let additionalMetadata = {};
        if (metadataStr) {
            try {
                additionalMetadata = JSON.parse(metadataStr);
            } catch (e) {
                return NextResponse.json(
                    { error: "Invalid metadata JSON" },
                    { status: 400 }
                );
            }
        }

        // Upload to GridFS
        const gridfsService = GridFSService.getInstance();
        const metadata = {
            format,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            uploadedAt: new Date(),
            ...additionalMetadata,
        };

        const fileId = await gridfsService.uploadFile(
            buffer,
            file.name,
            metadata
        );

        if (!fileId) {
            return NextResponse.json(
                { error: "Failed to upload file to GridFS" },
                { status: 500 }
            );
        }

        // Return the uploaded file info
        // Note: To create a Model3D in the scene, use the GraphQL createModel3D mutation
        // This endpoint only handles file upload to GridFS
        return NextResponse.json(
            {
                success: true,
                file: {
                    fileId,
                    filename: file.name,
                    format,
                    size: file.size,
                    metadata,
                    downloadUrl: `/api/models/${fileId}`,
                },
                message:
                    "File uploaded successfully. Use createModel3D mutation to add it to your scene.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading 3D model:", error);
        return NextResponse.json(
            {
                error: "Failed to upload 3D model",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
