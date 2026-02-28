import { exportFile } from "@/src/core/ecs/engine/filesEngine";
import { getUidFromSessionCookie } from "@/src/helpers";
import { getFilesPort } from "@/src/providers/filesPortProvider";
import { NextRequest } from "next/server";

import { GET } from "@/app/api/files/[userId]/[fileId]/route";

jest.mock("@/src/helpers", () => ({
    getUidFromSessionCookie: jest.fn(),
}));

jest.mock("@/src/providers/filesPortProvider", () => ({
    getFilesPort: jest.fn(),
}));

jest.mock("@/src/core/ecs/engine/filesEngine", () => ({
    exportFile: jest.fn(),
}));

jest.mock("@/src/logger", () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
    },
}));

describe("GET /api/files/[userId]/[fileId]", () => {
    const mockedGetUidFromSessionCookie = jest.mocked(getUidFromSessionCookie);
    const mockedGetFilesPort = jest.mocked(getFilesPort);
    const mockedExportFile = jest.mocked(exportFile);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("retourne 401 si non authentifié", async () => {
        mockedGetUidFromSessionCookie.mockResolvedValue(null);

        const request = new NextRequest(
            "http://localhost:3000/api/files/u1/f1",
            {
                headers: { cookie: "session=invalid" },
            },
        );

        const response = await GET(request, {
            params: Promise.resolve({ userId: "u1", fileId: "f1" }),
        });

        expect(response.status).toBe(401);
        await expect(response.json()).resolves.toEqual({
            error: "Unauthorized",
        });
    });

    it("retourne 403 si uid et userId ne correspondent pas", async () => {
        mockedGetUidFromSessionCookie.mockResolvedValue("u2");

        const request = new NextRequest(
            "http://localhost:3000/api/files/u1/f1",
            {
                headers: { cookie: "session=valid" },
            },
        );

        const response = await GET(request, {
            params: Promise.resolve({ userId: "u1", fileId: "f1" }),
        });

        expect(response.status).toBe(403);
        await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
    });

    it("retourne 400 si fileId est vide", async () => {
        mockedGetUidFromSessionCookie.mockResolvedValue("u1");

        const request = new NextRequest("http://localhost:3000/api/files/u1/", {
            headers: { cookie: "session=valid" },
        });

        const response = await GET(request, {
            params: Promise.resolve({ userId: "u1", fileId: "" }),
        });

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: "File ID is required",
        });
    });

    it("retourne le fichier avec le bon mime type", async () => {
        const fileBuffer = Buffer.from("binary");
        const fakeFilesPort = {};

        mockedGetUidFromSessionCookie.mockResolvedValue("u1");
        mockedGetFilesPort.mockResolvedValue(fakeFilesPort as any);
        mockedExportFile.mockResolvedValue({
            buffer: fileBuffer,
            extension: ".glb",
        });

        const request = new NextRequest(
            "http://localhost:3000/api/files/u1/model.glb",
            {
                headers: { cookie: "session=valid" },
            },
        );

        const response = await GET(request, {
            params: Promise.resolve({ userId: "u1", fileId: "model.glb" }),
        });

        expect(mockedExportFile).toHaveBeenCalledWith(
            "model",
            fakeFilesPort,
            "u1",
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("model/gltf-binary");
    });

    it("retourne 500 si une erreur interne survient", async () => {
        mockedGetUidFromSessionCookie.mockResolvedValue("u1");
        mockedGetFilesPort.mockResolvedValue({} as any);
        mockedExportFile.mockRejectedValue(new Error("boom"));

        const request = new NextRequest(
            "http://localhost:3000/api/files/u1/f1",
            {
                headers: { cookie: "session=valid" },
            },
        );

        const response = await GET(request, {
            params: Promise.resolve({ userId: "u1", fileId: "f1" }),
        });

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({
            error: "Failed to download file",
        });
    });
});
