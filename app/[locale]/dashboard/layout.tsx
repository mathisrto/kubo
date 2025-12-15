"use client";

import { SceneProvider } from "@/lib/contexts/SceneContext";
import { TransformProvider } from "@/lib/contexts/TransformContext";
import { ViewportProvider } from "@/lib/contexts/ViewportContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SceneProvider>
            <TransformProvider>
                <ViewportProvider>{children}</ViewportProvider>
            </TransformProvider>
        </SceneProvider>
    );
}
