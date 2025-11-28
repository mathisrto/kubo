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
            if (containerRef.current) {
                controller.resize(
                    containerRef.current.clientWidth,
                    containerRef.current.clientHeight
                );
            }
        };

        // Use ResizeObserver to detect container size changes
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                controller.resize(width, height);
            }
        });
        resizeObserver.observe(containerRef.current);

        window.addEventListener("resize", handleResize);

        return () => {
            resizeObserver.disconnect();
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

        const controller = sceneControllerRef.current;

        // Créer une map des objets existants par ID
        const existingObjectsMap = new Map(
            controller.objectControllers.map((oc) => [
                (oc as any).appObject?.id,
                oc,
            ])
        );

        // Créer une map des objets de la scène par ID
        const sceneObjectsMap = new Map(scene.objects.map((o) => [o.id, o]));

        // Retirer les objets qui n'existent plus dans la scène
        for (const [id, oc] of existingObjectsMap) {
            if (!sceneObjectsMap.has(id)) {
                controller.scene.remove(oc.mesh);
                oc.dispose?.();
                // Si l'objet supprimé était sélectionné, nettoyer la sélection
                if ((controller as any).selectedObjectId === id) {
                    controller.setSelectedObject(null);
                }
            }
        }

        // Mettre à jour ou ajouter les objets
        controller.objectControllers = scene.objects.map((o) => {
            const existing = existingObjectsMap.get(o.id);
            if (existing) {
                // Mettre à jour les transformations de l'objet existant
                const mesh = existing.mesh;
                const pos = o.positionVector;
                const rot = o.rotationVector;
                const scl = o.scaleVector;
                mesh.position.set(pos.x, pos.y, pos.z);
                mesh.rotation.set(rot.x, rot.y, rot.z);
                mesh.scale.set(scl.x, scl.y, scl.z);
                mesh.updateMatrix();
                mesh.updateMatrixWorld(true);
                return existing;
            } else {
                // Créer un nouvel objet
                const oc =
                    new (require("../controllers/SceneObjectController").SceneObjectController)(
                        o,
                        (id: string) => controller.materialControllers.get(id)
                    );
                controller.scene.add(oc.mesh);
                return oc;
            }
        });
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
