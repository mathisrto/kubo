"use client";

import { TransformProvider } from "@/src/contexts/transformContext";
import { ViewModeProvider } from "@/src/contexts/viewModeContext";
import { WorldProvider } from "@/src/contexts/worldContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <WorldProvider>
            <TransformProvider>
                <ViewModeProvider>{children}</ViewModeProvider>
            </TransformProvider>
        </WorldProvider>
    );
}
