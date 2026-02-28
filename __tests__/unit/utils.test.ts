import { hexToRgb, rgbToHex } from "@/src/utils";

describe("utils color conversion", () => {
    it("convertit un RGB valide en hex", () => {
        expect(rgbToHex({ r: 255, g: 16, b: 0 })).toBe("#ff1000");
    });

    it("applique un clamp entre 0 et 255 avant conversion", () => {
        expect(rgbToHex({ r: -10, g: 300, b: 128 })).toBe("#00ff80");
    });

    it("convertit un hex valide en RGB", () => {
        expect(hexToRgb("#0a64ff")).toEqual({ r: 10, g: 100, b: 255 });
    });

    it("retourne null pour un hex invalide", () => {
        expect(hexToRgb("#gggggg")).toBeNull();
    });
});
