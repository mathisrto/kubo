"use client";

import { Scene } from "@/lib/class/Scene";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { SceneRepository } from "../database/graphql/repositories/SceneRepository";
import { useUser } from "./UserContext";

/* ---------------- TYPES ---------------- */
type SceneContextType = {
    scene: Scene | null;
    isLoading: boolean;
    updateScene: (fn: (scene: Scene) => void) => void;
    reloadScene: () => Promise<void>;
    resetScene: () => Promise<void>;
};

/* ---------------- CONTEXT ---------------- */
const SceneContext = createContext<SceneContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */
export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user } = useUser();
    const [sceneState, setSceneState] = useState<Scene | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const sceneRef = useRef<Scene | null>(null);
    const loadedUserRef = useRef<string | null>(null);

    const repo = new SceneRepository();

    /* 🧹 Cleanup Scene */
    useEffect(() => {
        return () => {
            sceneRef.current?.destroy();
            sceneRef.current = null;
        };
    }, []);

    /* 🔁 Load scene when user changes */
    useEffect(() => {
        const loadScene = async () => {
            if (!user) {
                sceneRef.current?.destroy();
                sceneRef.current = null;
                setSceneState(null);
                setIsLoading(false);
                loadedUserRef.current = null;
                return;
            }

            if (loadedUserRef.current === user.uid) return;

            setIsLoading(true);
            const hasScene = await repo.hasScene();
            if (!hasScene) {
                await repo.createAndResetScene();
            }

            const data = await repo.getScene();

            // Crée la Scene moteur
            sceneRef.current?.destroy();
            sceneRef.current = new Scene(data);

            // Stocke l'instance dans le state pour déclencher le rerender React
            setSceneState(sceneRef.current);

            loadedUserRef.current = user.uid;
            setIsLoading(false);
        };

        loadScene();
    }, [user]);

    /* ✨ API : updateScene */
    const updateScene = (fn: (scene: Scene) => void | Promise<void>) => {
        if (!sceneRef.current) return;

        console.log("updateScene called");
        const maybePromise = fn(sceneRef.current);

        // Si la fonction est async, attendre avant de rerender
        if (maybePromise instanceof Promise) {
            maybePromise.then(() => {
                console.log("Setting scene state after promise");
                // Créer une nouvelle instance pour forcer le re-render
                const newScene = new Scene(sceneRef.current!.serialize());
                sceneRef.current = newScene;
                setSceneState(newScene);
            });
        } else {
            console.log("Setting scene state immediately");
            // Créer une nouvelle instance pour forcer le re-render
            const newScene = new Scene(sceneRef.current.serialize());
            sceneRef.current = newScene;
            setSceneState(newScene);
        }
    };

    /* 🔄 reloadScene */
    const reloadScene = async () => {
        if (!user) return;
        setIsLoading(true);
        const data = await repo.getScene();

        sceneRef.current?.destroy();
        sceneRef.current = new Scene(data);
        setSceneState(sceneRef.current);
        setIsLoading(false);
    };

    const resetScene = async () => {
        if (!user) return;
        setIsLoading(true);
        await repo.createAndResetScene();
        const data = await repo.getScene();
        sceneRef.current?.destroy();
        sceneRef.current = new Scene(data);
        setSceneState(sceneRef.current);
        setIsLoading(false);
    };

    return (
        <SceneContext.Provider
            value={{
                scene: sceneState,
                isLoading,
                updateScene,
                reloadScene,
                resetScene,
            }}
        >
            {children}
        </SceneContext.Provider>
    );
};

/* ---------------- HOOK ---------------- */
export const useScene = () => {
    const ctx = useContext(SceneContext);
    if (!ctx) throw new Error("useScene must be used within a SceneProvider");
    return ctx;
};
