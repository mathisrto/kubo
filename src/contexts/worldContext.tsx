import { initWorld, savePatches } from "@/src/actions/sceneActions";
import { useUser } from "@/src/contexts/userContext";
import { createReactiveWorld } from "@/src/core/ecs/engine/sceneEngine";
import { World } from "@/src/core/ecs/world";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export const WorldContext = createContext<World | null>(null);

interface Props {
    children: ReactNode;
}

export const WorldProvider = ({ children }: Props) => {
    const { user } = useUser();
    const [world, setWorld] = useState<World | null>(null);

    useEffect(() => {
        if (!user) return;

        const init = async () => {
            const loadedWorld = await initWorld(user.uid);
            const reactiveWorld = createReactiveWorld(
                user.uid,
                loadedWorld,
                savePatches
            );
            setWorld(reactiveWorld);
        };

        init();
    }, [user?.uid]);

    if (!world) return null;

    return (
        <WorldContext.Provider value={world}>{children}</WorldContext.Provider>
    );
};

const useWorld = (): World => {
    const world = useContext(WorldContext);
    if (!world) {
        throw new Error("useWorld must be used within WorldProvider");
    }
    return world;
};

import { useSnapshot } from "valtio";

const useWorldSnapshot = () => {
    const world = useWorld();
    return useSnapshot(world);
};

export const useWorldValues = () => {
    const world = useWorld();
    const snap = useWorldSnapshot();
    return { world, snap };
};
