import { exportFile, importFile } from "@/src/core/ecs/engine/filesEngine";
import { FilesPort } from "@/src/core/ports/filesPort";
import { Readable } from "stream";

// Mock FilesPort
const createMockFilesPort = (): jest.Mocked<FilesPort> => ({
    uploadFile: jest.fn(),
    downloadFile: jest.fn(),
    downloadFileByName: jest.fn(),
    deleteFile: jest.fn(),
    getFileInfo: jest.fn(),
});

describe("filesEngine", () => {
    let filesPort: jest.Mocked<FilesPort>;

    beforeEach(() => {
        filesPort = createMockFilesPort();
        jest.clearAllMocks();
    });

    describe("importFile", () => {
        it("importe un fichier avec l'extension correcte", async () => {
            const formData = new FormData();
            const mockFile = new File([new ArrayBuffer(1024)], "test.hdr", {
                type: "image/vnd.radiance",
            });
            formData.append("file", mockFile);

            const mockGridFsId = "507f1f77bcf86cd799439011";
            filesPort.uploadFile.mockResolvedValue({
                gridFsId: mockGridFsId as any,
                filename: "test.hdr",
                hash: "mockhash",
                type: "texture",
                size: 1024,
                extension: ".hdr",
                uploadedAt: new Date(),
                use: 0,
            });

            const result = await importFile(formData, filesPort);

            expect(filesPort.uploadFile).toHaveBeenCalledWith(
                expect.any(Buffer),
                "texture",
                ".hdr",
                undefined,
            );
            expect(result).toEqual({ gridFsId: mockGridFsId });
        });

        it("détecte l'extension du fichier .exr", async () => {
            const formData = new FormData();
            const mockFile = new File(
                [new ArrayBuffer(2048)],
                "environment.exr",
                { type: "image/x-exr" },
            );
            formData.append("file", mockFile);

            const mockGridFsId = "507f1f77bcf86cd799439012";
            filesPort.uploadFile.mockResolvedValue({
                gridFsId: mockGridFsId as any,
                filename: "environment.exr",
                hash: "mockhash",
                type: "texture",
                size: 2048,
                extension: ".exr",
                uploadedAt: new Date(),
                use: 0,
            });

            const result = await importFile(formData, filesPort);

            expect(filesPort.uploadFile).toHaveBeenCalledWith(
                expect.any(Buffer),
                "texture",
                ".exr",
                undefined,
            );
            expect(result.gridFsId).toBe(mockGridFsId);
        });

        it("détecte l'extension du fichier .jpg", async () => {
            const formData = new FormData();
            const mockFile = new File([new ArrayBuffer(512)], "texture.jpg", {
                type: "image/jpeg",
            });
            formData.append("file", mockFile);

            filesPort.uploadFile.mockResolvedValue({
                gridFsId: "507f1f77bcf86cd799439013" as any,
                filename: "texture.jpg",
                hash: "mockhash",
                type: "texture",
                size: 512,
                extension: ".jpg",
                uploadedAt: new Date(),
                use: 0,
            });

            await importFile(formData, filesPort);

            expect(filesPort.uploadFile).toHaveBeenCalledWith(
                expect.any(Buffer),
                "texture",
                ".jpg",
                undefined,
            );
        });

        it("lance une erreur si aucun fichier n'est fourni", async () => {
            const formData = new FormData();

            await expect(importFile(formData, filesPort)).rejects.toThrow(
                "No file provided",
            );
        });

        it("convertit correctement l'ArrayBuffer en Buffer", async () => {
            const formData = new FormData();
            const arrayBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
            const mockFile = new File([arrayBuffer], "test.png", {
                type: "image/png",
            });
            formData.append("file", mockFile);

            filesPort.uploadFile.mockResolvedValue({
                gridFsId: "507f1f77bcf86cd799439014" as any,
                filename: "test.png",
                hash: "mockhash",
                type: "texture",
                size: 5,
                extension: ".png",
                uploadedAt: new Date(),
                use: 0,
            });

            await importFile(formData, filesPort);

            const uploadCall = filesPort.uploadFile.mock.calls[0];
            expect(Buffer.isBuffer(uploadCall[0])).toBe(true);
            expect(uploadCall[1]).toBe("texture");
            expect(uploadCall[2]).toBe(".png");
        });

        it("gère les erreurs d'upload", async () => {
            const formData = new FormData();
            const mockFile = new File([new ArrayBuffer(1024)], "test.hdr", {
                type: "image/vnd.radiance",
            });
            formData.append("file", mockFile);

            filesPort.uploadFile.mockRejectedValue(new Error("Upload failed"));

            await expect(importFile(formData, filesPort)).rejects.toThrow(
                "Upload failed",
            );
        });
    });

    describe("exportFile", () => {
        it("exporte un fichier avec le bon buffer et extension", async () => {
            const fileId = "507f1f77bcf86cd799439011";
            const mockBuffer = Buffer.from([1, 2, 3, 4, 5]);
            const mockStream = Readable.from(mockBuffer);

            filesPort.getFileInfo.mockResolvedValue({
                extension: ".hdr",
                filename: "test.hdr",
                length: 5,
                uploadDate: new Date(),
            } as any);

            filesPort.downloadFile.mockResolvedValue(mockStream);

            const result = await exportFile(fileId, filesPort);

            expect(filesPort.getFileInfo).toHaveBeenCalledWith(
                fileId,
                undefined,
            );
            expect(filesPort.downloadFile).toHaveBeenCalledWith(
                fileId,
                undefined,
            );
            expect(result.buffer).toEqual(mockBuffer);
            expect(result.extension).toBe(".hdr");
        });

        it("gère les fichiers .exr", async () => {
            const fileId = "507f1f77bcf86cd799439012";
            const mockData = new Uint8Array([10, 20, 30, 40, 50]);
            const mockStream = Readable.from(Buffer.from(mockData));

            filesPort.getFileInfo.mockResolvedValue({
                extension: ".exr",
                filename: "environment.exr",
                length: 5,
                uploadDate: new Date(),
            } as any);

            filesPort.downloadFile.mockResolvedValue(mockStream);

            const result = await exportFile(fileId, filesPort);

            expect(result.extension).toBe(".exr");
            expect(result.buffer).toEqual(Buffer.from(mockData));
        });

        it("concatène les chunks du stream correctement", async () => {
            const fileId = "507f1f77bcf86cd799439013";
            const chunk1 = Buffer.from([1, 2, 3]);
            const chunk2 = Buffer.from([4, 5, 6]);
            const chunk3 = Buffer.from([7, 8, 9]);

            const mockStream = Readable.from([chunk1, chunk2, chunk3]);

            filesPort.getFileInfo.mockResolvedValue({
                extension: ".jpg",
                filename: "texture.jpg",
                length: 9,
                uploadDate: new Date(),
            } as any);

            filesPort.downloadFile.mockResolvedValue(mockStream);

            const result = await exportFile(fileId, filesPort);

            expect(result.buffer).toEqual(
                Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]),
            );
        });

        it("gère les erreurs de récupération des informations du fichier", async () => {
            const fileId = "507f1f77bcf86cd799439014";

            filesPort.getFileInfo.mockRejectedValue(
                new Error("File info not found"),
            );

            await expect(exportFile(fileId, filesPort)).rejects.toThrow(
                "File info not found",
            );
        });

        it("gère les erreurs de téléchargement", async () => {
            const fileId = "507f1f77bcf86cd799439015";

            filesPort.getFileInfo.mockResolvedValue({
                extension: ".png",
                filename: "test.png",
                length: 1024,
                uploadDate: new Date(),
            } as any);

            filesPort.downloadFile.mockRejectedValue(
                new Error("Download failed"),
            );

            await expect(exportFile(fileId, filesPort)).rejects.toThrow(
                "Download failed",
            );
        });

        it("gère les streams vides", async () => {
            const fileId = "507f1f77bcf86cd799439016";
            const mockStream = Readable.from([]);

            filesPort.getFileInfo.mockResolvedValue({
                extension: ".txt",
                filename: "empty.txt",
                length: 0,
                uploadDate: new Date(),
            } as any);

            filesPort.downloadFile.mockResolvedValue(mockStream);

            const result = await exportFile(fileId, filesPort);

            expect(result.buffer.length).toBe(0);
            expect(result.extension).toBe(".txt");
        });
    });
});
