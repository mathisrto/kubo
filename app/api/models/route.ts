import { Model3DRepository } from "@/lib/database/graphql/repositories/Model3DRepository";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/models
 * List all 3D models
 *
 * Query parameters:
 * - format: Filter by format (optional)
 * - limit: Max number of results (optional)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const format = searchParams.get("format");
        const limit = searchParams.get("limit");

        const repository = Model3DRepository.getInstance();

        // Build filter
        const filter: any = {};
        if (format) {
            filter.format = format.toUpperCase();
        }

        // Get models
        const models = await repository.findAll(filter);

        // Apply limit if specified
        const results = limit ? models.slice(0, parseInt(limit)) : models;

        return NextResponse.json({
            success: true,
            count: results.length,
            models: results,
        });
    } catch (error) {
        console.error("Error listing 3D models:", error);
        return NextResponse.json(
            {
                error: "Failed to list 3D models",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
