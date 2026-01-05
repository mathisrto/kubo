import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import { getModel3DMetadata } from "@/src/core/ecs/queries/model3dQuery";
import { getTransform } from "@/src/core/ecs/queries/transformQuery";
import { useCursor } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export function Model3D({
    modelId,
    isTransforming,
    onMeshCreated,
}: {
    modelId: Entity;
    isTransforming?: boolean;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    const [hovered, setHover] = useState(false);
    const { snap } = useWorldValues();
    const meshRef = useRef<THREE.Mesh>(null);

    // Stocker une ref vers le model pour la synchronisation
    const modelRef = useRef(modelId);

    useEffect(() => {
        modelRef.current = modelId;
    }, [modelId]);

    useCursor(hovered && !isTransforming);

    useEffect(() => {
        if (meshRef.current) {
            setTimeout(() => onMeshCreated(modelId, meshRef.current!), 0);
        }
    }, [modelId, onMeshCreated]);

    const primitive = getModel3DMetadata(snap, modelId)?.primitive;

    const transform = getTransform(snap, modelId);

    if (!transform) return null;

    return (
        <mesh
            receiveShadow
            ref={meshRef}
            userData={{ id: modelId, type: "model" }}
            position={[
                transform.position.x,
                transform.position.y,
                transform.position.z,
            ]}
            rotation={[
                degToRad(transform.rotation.x),
                degToRad(transform.rotation.y),
                degToRad(transform.rotation.z),
            ]}
            scale={[transform.scale.x, transform.scale.y, transform.scale.z]}
            onClick={(e) => {
                if (isTransforming) {
                    e.stopPropagation();
                }
            }}
            onPointerOver={(e) =>
                !isTransforming && (e.stopPropagation(), setHover(true))
            }
            onPointerOut={(e) => setHover(false)}
        >
            {primitive === "cube" && <boxGeometry args={[1, 1, 1]} />}
            {primitive === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
            {primitive === "cylinder" && (
                <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            )}
            {primitive === "plane" && <planeGeometry args={[1, 1]} />}
            <meshStandardMaterial side={2} />
        </mesh>
    );
}
