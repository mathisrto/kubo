import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import {
    getLightColor,
    getLightIntensity,
    getLightRange,
    getLightType,
    getPosition,
} from "@/src/core/ecs/queries/indexQuery";
import { LightType } from "@/src/types";
import { useHelper } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DirectionalLightHelper } from "three/src/helpers/DirectionalLightHelper.js";
import { PointLightHelper } from "three/src/helpers/PointLightHelper.js";
import { SpotLightHelper } from "three/src/helpers/SpotLightHelper.js";

export function Light3D({
    lightId,
    onMeshCreated,
}: {
    lightId: Entity;
    isTransforming?: boolean;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    // Refs pour chaque type de lumière
    const pointRef = useRef<THREE.PointLight>(null);
    const spotRef = useRef<THREE.SpotLight>(null);
    const dirRef = useRef<THREE.DirectionalLight>(null);
    // Helper invisible pour la sélection
    const helperRef = useRef<THREE.Mesh>(null);
    const { snap } = useWorldValues();

    useEffect(() => {
        if (helperRef.current) {
            setTimeout(() => onMeshCreated(lightId, helperRef.current!), 0);
        }
    }, [lightId, onMeshCreated]);

    const colorValue = getLightColor(snap, lightId);
    const color = new THREE.Color().setRGB(
        colorValue?.r ?? 1,
        colorValue?.g ?? 1,
        colorValue?.b ?? 1
    );
    const type = getLightType(snap, lightId);

    const size = 0.2;

    // Helper visuel selon le type
    if (type === LightType.POINT) {
        useHelper(
            pointRef as React.RefObject<THREE.Object3D>,
            PointLightHelper,
            size
        );
    } else if (type === LightType.SPOT) {
        useHelper(
            spotRef as React.RefObject<THREE.Object3D>,
            SpotLightHelper,
            size
        );
    } else if (type === LightType.DIRECTIONAL) {
        useHelper(
            dirRef as React.RefObject<THREE.Object3D>,
            DirectionalLightHelper,
            size
        );
    }

    const position = getPosition(snap, lightId);
    const intensity = getLightIntensity(snap, lightId);
    const range = getLightRange(snap, lightId);

    // Rendu dynamique selon le type
    return (
        <>
            {type === LightType.POINT && (
                <pointLight
                    ref={pointRef}
                    position={[
                        position?.x ?? 0,
                        position?.y ?? 0,
                        position?.z ?? 0,
                    ]}
                    color={color}
                    intensity={intensity ?? 1}
                    distance={range ?? 0}
                    userData={{ id: lightId, type: "light" }}
                />
            )}
            {type === LightType.SPOT && (
                <spotLight
                    ref={spotRef}
                    position={[
                        position?.x ?? 0,
                        position?.y ?? 0,
                        position?.z ?? 0,
                    ]}
                    color={color}
                    intensity={intensity ?? 1}
                    distance={range ?? 0}
                    angle={Math.PI / 6}
                    penumbra={0.1}
                    userData={{ id: lightId, type: "light" }}
                />
            )}
            {type === LightType.DIRECTIONAL && (
                <directionalLight
                    ref={dirRef}
                    position={[
                        position?.x ?? 0,
                        position?.y ?? 0,
                        position?.z ?? 0,
                    ]}
                    color={color}
                    intensity={intensity ?? 1}
                    userData={{ id: lightId, type: "light" }}
                />
            )}
            {/* Helper invisible pour la sélection/manipulation */}
            <mesh
                ref={helperRef}
                userData={{ id: lightId, type: "light" }}
                position={[
                    position?.x ?? 0,
                    position?.y ?? 0,
                    position?.z ?? 0,
                ]}
                visible={false}
            >
                <sphereGeometry args={[size, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </>
    );
}
