"use client";

import { Scene } from "@/lib/class/Scene";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useUser } from "./UserContext";

type SceneContextType = {
    scene: Scene | null;
    isLoading: boolean;
    setScene: (scene: Scene | null) => void;
    reloadScene: () => Promise<void>;
};

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user } = useUser();
    const [scene, setScene] = useState<Scene | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const loadedUserRef = useRef<string | null>(null);

    // 🧹 Cleanup de la scène quand elle change ou au démontage
    useEffect(() => {
        return () => {
            if (scene) {
                scene.destroy();
            }
        };
    }, [scene]);

    // 🔁 Quand le user change, on recharge sa scène
    useEffect(() => {
        const loadScene = async () => {
            if (!user) {
                setScene(null);
                setIsLoading(false);
                loadedUserRef.current = null;
                return;
            }

            // ⚡ Empêche de recharger pour le même user
            if (loadedUserRef.current === user.uid) {
                return;
            }

            setIsLoading(true);

            const repository = user["repository"];
            const hasScene = await repository.hasScene();
            if (!hasScene) {
                await repository.createAndResetScene();
            }

            const sceneData = await repository.getScene();

            console.log("Scene data loaded:", sceneData);
            const newScene = new Scene(sceneData);
            setScene(newScene);
            user.scene = newScene; // synchronisation
            setIsLoading(false);
            loadedUserRef.current = user.uid;

            console.log(`Scene loaded for user ${user.scene}`);
        };

        loadScene();
    }, [user]);

    const reloadScene = async () => {
        if (!user) return;
        setIsLoading(true);
        const repository = user["repository"];
        const sceneData = await repository.getScene();
        const newScene = new Scene(sceneData);
        setScene(newScene);
        setIsLoading(false);
    };

    return (
        <SceneContext.Provider
            value={{ scene, isLoading, setScene, reloadScene }}
        >
            {children}
        </SceneContext.Provider>
    );
};

export const useScene = () => {
    const ctx = useContext(SceneContext);
    if (!ctx) {
        throw new Error("useScene must be used within a SceneProvider");
    }
    return ctx;
};
