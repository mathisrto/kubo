import { initWorldAction, savePatches } from "@/src/actions/sceneActions";
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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      try {
        const loadedWorld = await initWorldAction(user.uid);
        const reactiveWorld = createReactiveWorld(
          user.uid,
          loadedWorld,
          savePatches
        );
        setWorld(reactiveWorld);
      } catch (error) {
        console.error("Error initializing world in WorldProvider:", error);
        setHasError(true);
      }
    };

    init();
  }, [user]);

  if (!world) return <LoadingWorld hasError={hasError} />;

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
import LoadingWorld from "../ui/components/LoadingWorld";

const useWorldSnapshot = () => {
  const world = useWorld();
  return useSnapshot(world);
};

export const useWorldValues = () => {
  const world = useWorld();
  const snap = useWorldSnapshot();
  return { world, snap };
};
