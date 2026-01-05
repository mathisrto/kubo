import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Color } from "./core/ecs/components/indexComponent";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const clamp = (v: number) => Math.max(0, Math.min(255, v));

export function rgbToHex(color: Color): string {
    return (
        "#" +
        [color.r, color.g, color.b]
            .map((v) => clamp(v).toString(16).padStart(2, "0"))
            .join("")
    );
}

export function hexToRgb(hex: string): Color | null {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return null;

    return {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
    };
}
