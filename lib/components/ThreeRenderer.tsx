"use client";

import { useEffect, useRef } from "react";
import { useScene } from "../contexts/SceneContext";
import { SceneController } from "../controllers/SceneController";

interface ThreeSceneProps {
    update?: number;
    selectedObject?: string | null;
}

const ThreeScene = ({ update, selectedObject }: ThreeSceneProps) => {
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

        controller.resize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
        );

        const handleResize = () => {
            controller.resize(
                containerRef.current!.clientWidth,
                containerRef.current!.clientHeight
            );
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            // Dispose controller and free resources
            if (sceneControllerRef.current) {
                sceneControllerRef.current.dispose();
                sceneControllerRef.current = null;
            }
        };
    }, [scene, isLoading]);

    // Re-render scene when update prop changes
    useEffect(() => {
        if (!scene || !sceneControllerRef.current || update === undefined)
            return;

        // Dispose old controller
        sceneControllerRef.current.dispose();
        sceneControllerRef.current = null;

        // Recreate controller with updated scene
        if (containerRef.current) {
            const controller = new SceneController(containerRef.current, scene);
            sceneControllerRef.current = controller;
            controller.animate();
            controller.resize(
                containerRef.current.clientWidth,
                containerRef.current.clientHeight
            );
        }
    }, [update, scene]);

    // Update highlight when selectedObject changes
    useEffect(() => {
        if (sceneControllerRef.current && selectedObject !== undefined) {
            sceneControllerRef.current.setSelectedObject(selectedObject);
        }
    }, [selectedObject]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "400px" }}>
            {isLoading && <p>Chargement de la scène...</p>}
        </div>
    );
};

export default ThreeScene;
