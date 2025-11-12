"use client";

import { useEffect, useRef } from "react";
import { useScene } from "../contexts/SceneContext";
import { SceneController } from "../controllers/SceneController";

const ThreeScene = () => {
    const { scene, isLoading } = useScene();
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneControllerRef = useRef<SceneController | null>(null);

    useEffect(() => {
        if (!containerRef.current || !scene || isLoading) return;

        // ⚡ Empêche la recréation si déjà initialisé
        if (sceneControllerRef.current) return;

        const controller = new SceneController(containerRef.current, scene);
        sceneControllerRef.current = controller;
        controller.animate();

        const handleResize = () => {
            controller.resize(
                containerRef.current!.clientWidth,
                containerRef.current!.clientHeight
            );
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [scene, isLoading]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "400px" }}>
            {isLoading && <p>Chargement de la scène...</p>}
        </div>
    );
};

export default ThreeScene;
