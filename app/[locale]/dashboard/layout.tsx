"use client";

import { TransformProvider } from "@/src/contexts/transformContext";
import { WorldProvider } from "@/src/contexts/worldContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <WorldProvider>
            <TransformProvider>{children}</TransformProvider>
        </WorldProvider>
    );
}
