import { useTransform } from "@/src/contexts/transformContext";
import { useSelect } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export function SelectionObserver({
  onSelectionChange,
}: {
  onSelectionChange: (mesh: THREE.Mesh | undefined) => void;
}) {
  const selected = useSelect();
  const { setSelectedObject } = useTransform();

  useEffect(() => {
    if (!selected || selected.length === 0) {
      setSelectedObject(null);
      onSelectionChange(undefined);
      return;
    }

    // Filtrer pour ne garder que les mesh valides
    const validMesh = selected.filter((obj): obj is THREE.Mesh => {
      return obj instanceof THREE.Mesh;
    })[0];
    const id = validMesh?.userData.id || null;
    setSelectedObject(id);
    onSelectionChange(validMesh);
  }, [selected, onSelectionChange, setSelectedObject]);

  return null;
}
