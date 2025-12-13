import { getDb } from "@/lib/database/client";
import { GridFSService } from "@/lib/database/gridfs";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/avatar
 * Upload an avatar image to GridFS and update user profile
 *
 * Accepts multipart/form-data with:
 * - file: Image file (jpg, png, webp, etc.)
 * - uid: User ID (Firebase UID)
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const uid = formData.get("uid") as string;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!uid) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Accepted: jpg, png, webp, gif" },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Get database connection
        const db = await getDb();
        if (!db) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 500 }
            );
        }

        // Check if user exists
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ uid });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Delete old avatar from GridFS if exists
        if (user.avatarFileId) {
            const gridfsService = GridFSService.getInstance();
            await gridfsService.deleteFile(user.avatarFileId);
        }

        // Upload to GridFS with avatars bucket
        const gridfsService = GridFSService.getInstance();
        const timestamp = Date.now();
        const extension = file.name.split(".").pop();
        const filename = `avatar_${uid}_${timestamp}.${extension}`;

        const metadata = {
            contentType: file.type,
            originalName: file.name,
            size: file.size,
            userId: uid,
            uploadedAt: new Date(),
        };

        const fileId = await gridfsService.uploadAvatarFile(
            buffer,
            filename,
            metadata
        );

        if (!fileId) {
            return NextResponse.json(
                { error: "Failed to upload file to GridFS" },
                { status: 500 }
            );
        }

        // Update user document with avatar file ID
        await usersCollection.updateOne(
            { uid },
            {
                $set: {
                    avatarFileId: fileId,
                    updatedAt: new Date(),
                },
            }
        );

        // Return success with file ID and URL
        return NextResponse.json(
            {
                success: true,
                fileId,
                url: `/api/avatar/${fileId}`,
                message: "Avatar uploaded successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Avatar upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/avatar/[fileId]
 * Retrieve an avatar image from GridFS
 */
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split("/");
        const fileId = pathParts[pathParts.length - 1];

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
