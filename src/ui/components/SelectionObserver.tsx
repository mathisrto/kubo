import { useTransform } from "@/src/contexts/transformContext";
import { useSelect } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

/**
 * Remonte la hiérarchie parent d'un Object3D pour trouver
 * l'ancêtre le plus proche qui porte un userData.id (entité ECS).
 * Nécessaire car les modèles GLTF sont composés de multiples sous-meshes,
 * et le raycast touche un enfant profond qui n'a pas de userData.id.
 */
function findEntityAncestor(obj: THREE.Object3D): THREE.Object3D | null {
    let current: THREE.Object3D | null = obj;
    while (current) {
        if (current.userData?.id && current.userData?.type) {
            return current;
        }
        current = current.parent;
    }
    return null;
}

export function SelectionObserver() {
    const selected = useSelect();
    const { setSelectedObject } = useTransform();

    useEffect(() => {
        if (!selected || selected.length === 0) {
            setSelectedObject(null);
            return;
        }

        // Pour chaque objet sélectionné, remonter la hiérarchie
        // pour trouver l'entité ECS parente (group avec userData.id)
        const entityObj = selected
            .map((obj) => findEntityAncestor(obj))
            .find((obj) => obj !== null);

        const id = entityObj?.userData.id || null;
        setSelectedObject(id);
    }, [selected, setSelectedObject]);

    return null;
}
