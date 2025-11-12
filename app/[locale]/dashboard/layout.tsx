"use client";

import { SceneProvider } from "@/lib/contexts/SceneContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <SceneProvider>{children}</SceneProvider>;
}
