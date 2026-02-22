import { World } from "@/src/core/ecs/world";
import { useCallback, useEffect, useRef } from "react";
import { snapshot, subscribe } from "valtio";

const MAX_HISTORY_SIZE = 50;

/**
 * Hook de gestion de l'historique undo/redo pour le World ECS (valtio proxy).
 *
 * Capture des snapshots à chaque mutation significative du World
 * et permet de naviguer dans l'historique avec undo() / redo().
 */
export function useWorldHistory(world: World) {
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);
    const isRestoring = useRef(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Capturer l'état initial
    useEffect(() => {
        const initial = JSON.stringify(snapshot(world));
        undoStack.current = [initial];
        redoStack.current = [];
    }, [world]);

    // Souscrire aux changements du proxy et empiler les snapshots
    useEffect(() => {
        const unsubscribe = subscribe(world, () => {
            // Ne pas enregistrer les changements causés par un undo/redo
            if (isRestoring.current) return;

            // Debounce : regrouper les mutations rapides (ex: drag continu)
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                const snap = JSON.stringify(snapshot(world));
                const last = undoStack.current[undoStack.current.length - 1];

                // Ne pas empiler si identique au dernier snapshot
                if (snap === last) return;

                undoStack.current.push(snap);

                // Limiter la taille de l'historique
                if (undoStack.current.length > MAX_HISTORY_SIZE) {
                    undoStack.current.shift();
                }

                // Toute nouvelle action annule le redo
                redoStack.current = [];
            }, 300);
        });

        return () => {
            unsubscribe();
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [world]);

    const restoreSnapshot = useCallback(
        (snapStr: string) => {
            isRestoring.current = true;
            const parsed: World = JSON.parse(snapStr);

            // Réassigner chaque propriété du proxy pour déclencher les réactions valtio
            Object.assign(world, parsed);

            // Laisser le cycle de subscription valtio se terminer avant de réactiver
            requestAnimationFrame(() => {
                isRestoring.current = false;
            });
        },
        [world],
    );

    const undo = useCallback(() => {
        if (undoStack.current.length <= 1) return false; // rien à annuler

        // L'état actuel va dans le redo
        const current = undoStack.current.pop()!;
        redoStack.current.push(current);

        // Restaurer l'état précédent
        const previous = undoStack.current[undoStack.current.length - 1];
        restoreSnapshot(previous);
        return true;
    }, [restoreSnapshot]);

    const redo = useCallback(() => {
        if (redoStack.current.length === 0) return false;

        const next = redoStack.current.pop()!;
        undoStack.current.push(next);

        restoreSnapshot(next);
        return true;
    }, [restoreSnapshot]);

    const canUndo = useCallback(() => undoStack.current.length > 1, []);
    const canRedo = useCallback(() => redoStack.current.length > 0, []);

    return { undo, redo, canUndo, canRedo };
}
