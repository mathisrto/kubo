"use client";

import { useTransform } from "@/src/contexts/transformContext";
import { useUser } from "@/src/contexts/userContext";
import { useViewMode } from "@/src/contexts/viewModeContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import {
    updateCameraPosition,
    updateCameraTarget,
} from "@/src/core/ecs/engine/cameraEngine";
import {
    updatePosition,
    updateTransform,
} from "@/src/core/ecs/engine/transformEngine";
import {
    getCameraFar,
    getCameraFOV,
    getCameraNear,
    getCameraPosition,
    getCameraTarget,
    getCameraType,
} from "@/src/core/ecs/queries/cameraQuery";
import {
    getEnvironmentIntensity,
    getEnvironmentMap,
} from "@/src/core/ecs/queries/environmentQuery";
import { getLightById, getLights } from "@/src/core/ecs/queries/lightQuery";
import {
    getModel3DById,
    getModels3D,
} from "@/src/core/ecs/queries/model3dQuery";
import { CameraType, OBJECT_TYPES, ViewMode } from "@/src/types";
import {
    Environment,
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    OrthographicCamera,
    PerspectiveCamera,
    Select,
    TransformControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { AnimationControlPanel } from "./AnimationControlPanel";
import { Light3D } from "./Light3DRenderer";
import { Model3D } from "./Model3DRenderer";
import { SelectionObserver } from "./SelectionObserver";

/**
 * Composant Environment mémoïsé pour éviter les re-renders coûteux
 * Ne se re-rend que si l'URL ou l'intensité changent réellement.
 */
const MemoizedEnvironment = memo(function MemoizedEnvironment({
    url,
    intensity,
}: {
    url: string;
    intensity: number;
}) {
    return (
        <Environment
            files={url}
            background
            backgroundBlurriness={0.5}
            environmentIntensity={intensity}
        />
    );
});

function SceneContent() {
    const { world, snap } = useWorldValues();
    const { user } = useUser();
    const { viewMode } = useViewMode();

    const { transformMode, selectedObject } = useTransform();
    const isControlsInitialized = useRef(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [meshes, setMeshes] = useState<Record<string, THREE.Mesh>>({});

    // Stocker la position et target initiales de la caméra (une seule fois)
    // pour ne pas laisser le snap écrasé la position pendant le drag OrbitControls
    const initialCameraPos = useRef(getCameraPosition(snap));
    const initialCameraTarget = useRef(getCameraTarget(snap));

    // Activer la sauvegarde de la caméra après un court délai
    // pour ignorer les événements onEnd de l'initialisation OrbitControls
    useEffect(() => {
        const timer = setTimeout(() => {
            isControlsInitialized.current = true;
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Derive selectedMesh from selectedObject and meshes instead of using state
    const selectedMesh = selectedObject ? meshes[selectedObject] : undefined;

    const environmentUrl = useMemo(() => {
        const gridFsId = getEnvironmentMap(snap);
        if (!gridFsId) {
            return "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr";
        }
        // Route scopée par utilisateur pour l'environment map
        return `/api/files/${user!.uid}/${gridFsId}.hdr`;
    }, [getEnvironmentMap(snap), user]);

    const environmentIntensity = getEnvironmentIntensity(snap);

    // Gestion des meshes pour modèles et lumières
    const handleMeshCreated = useCallback((id: string, mesh: THREE.Mesh) => {
        setMeshes((prev) => ({
            ...prev,
            [id]: mesh,
        }));
    }, []);

    return (
        <>
            {/* Environment map : seulement en mode RENDERED */}
            {viewMode === ViewMode.RENDERED && (
                <MemoizedEnvironment
                    url={environmentUrl}
                    intensity={environmentIntensity}
                />
            )}

            {/* Éclairage de remplacement pour les modes sans environment map */}
            {viewMode !== ViewMode.RENDERED && (
                <>
                    <ambientLight intensity={0.6} />
                    <directionalLight
                        position={[5, 10, 7]}
                        intensity={1.0}
                        castShadow={viewMode === ViewMode.MATERIAL}
                    />
                    <directionalLight position={[-3, 5, -5]} intensity={0.3} />
                </>
            )}

            {/* Override des matériaux selon le mode de vue */}
            <Select>
                <SelectionObserver />
                {/* Modèles 3D */}
                {getModels3D(snap).map((modelId) => (
                    <Model3D
                        key={modelId}
                        modelId={modelId}
                        isTransforming={isTransforming}
                        onMeshCreated={handleMeshCreated}
                    />
                ))}
                {/* Lumières 3D */}
                {getLights(snap).map((lightId) => (
                    <Light3D
                        key={lightId}
                        lightId={lightId}
                        isTransforming={isTransforming}
                        onMeshCreated={handleMeshCreated}
                    />
                ))}
            </Select>

            {/* Transform Controls */}
            {selectedMesh?.parent &&
                transformMode &&
                meshes[selectedObject!] && (
                    <TransformControls
                        object={selectedMesh}
                        mode={transformMode}
                        translationSnap={0.01}
                        rotationSnap={degToRad(1)}
                        scaleSnap={0.01}
                        showX={true}
                        showY={true}
                        showZ={true}
                        onMouseDown={() => setIsTransforming(true)}
                        onMouseUp={() => setIsTransforming(false)}
                        onObjectChange={() => {
                            const mesh = selectedMesh;
                            // Synchronisation via userData.type et refs
                            if (mesh.userData.type === OBJECT_TYPES.MODEL) {
                                // Chercher le model correspondant
                                const model = getModel3DById(
                                    snap,
                                    mesh.userData.id,
                                );
                                if (model) {
                                    updateTransform(world, mesh.userData.id, {
                                        position: {
                                            x: mesh.position.x,
                                            y: mesh.position.y,
                                            z: mesh.position.z,
                                        },
                                        rotation: {
                                            x: radToDeg(mesh.rotation.x),
                                            y: radToDeg(mesh.rotation.y),
                                            z: radToDeg(mesh.rotation.z),
                                        },
                                        scale: {
                                            x: mesh.scale.x,
                                            y: mesh.scale.y,
                                            z: mesh.scale.z,
                                        },
                                    });
                                }
                            }
                            if (mesh.userData.type === OBJECT_TYPES.LIGHT) {
                                const light = getLightById(
                                    snap,
                                    mesh.userData.id,
                                );
                                if (light) {
                                    updatePosition(world, mesh.userData.id, {
                                        x: mesh.position.x,
                                        y: mesh.position.y,
                                        z: mesh.position.z,
                                    });
                                }
                            }
                        }}
                    />
                )}

            {/* Camera — position initiale fixe, OrbitControls gère la position ensuite */}
            {(getCameraType(snap) === CameraType.PERSPECTIVE && (
                <PerspectiveCamera
                    makeDefault
                    position={[
                        initialCameraPos.current.x,
                        initialCameraPos.current.y,
                        initialCameraPos.current.z,
                    ]}
                    fov={getCameraFOV(snap)}
                    near={getCameraNear(snap)}
                    far={getCameraFar(snap)}
                />
            )) ||
                (getCameraType(snap) === CameraType.ORTHOGRAPHIC && (
                    <OrthographicCamera
                        makeDefault
                        position={[
                            initialCameraPos.current.x,
                            initialCameraPos.current.y,
                            initialCameraPos.current.z,
                        ]}
                        near={getCameraNear(snap)}
                        far={getCameraFar(snap)}
                    />
                ))}

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.1}
                minDistance={0.1}
                maxDistance={10000}
                zoomSpeed={1.2}
                zoomToCursor
                panSpeed={1.5}
                target={[
                    initialCameraTarget.current.x,
                    initialCameraTarget.current.y,
                    initialCameraTarget.current.z,
                ]}
                onEnd={(e) => {
                    // Ignorer les événements onEnd pendant l'initialisation
                    if (!isControlsInitialized.current) return;

                    // Synchroniser les changements de la caméra Three.js vers notre modèle
                    if (e?.target) {
                        const controls = e.target as unknown as {
                            object: THREE.Camera;
                            target: THREE.Vector3;
                        };
                        const camera = controls.object;

                        updateCameraPosition(world, {
                            x: camera.position.x,
                            y: camera.position.y,
                            z: camera.position.z,
                        });

                        updateCameraTarget(world, {
                            x: controls.target.x,
                            y: controls.target.y,
                            z: controls.target.z,
                        });
                    }
                }}
            />

            {/* Gizmo Viewport (coin supérieur droit) */}
            <GizmoHelper
                alignment="top-right"
                margin={[80, 80]}
                renderPriority={2}
            >
                <GizmoViewport
                    axisColors={["#ff0000", "#00ff00", "#0000ff"]}
                    labelColor="white"
                />
            </GizmoHelper>

            {/* Infinite Grid */}
            <Grid
                infiniteGrid
                fadeDistance={300}
                fadeStrength={5}
                cellSize={1}
                cellThickness={0.5}
                sectionSize={10}
                sectionThickness={1.5}
                cellColor="#6b6b6b"
                sectionColor="#9d9d9d"
            />

            {/* Post-processing Outline — toujours monté pour éviter les problèmes de pipeline */}
            <EffectComposer multisampling={4} autoClear={true}>
                <Outline
                    selection={
                        (viewMode === ViewMode.RENDERED ||
                            viewMode === ViewMode.MATERIAL) &&
                        selectedMesh
                            ? [selectedMesh]
                            : []
                    }
                    visibleEdgeColor={0xffff00}
                    hiddenEdgeColor={0xffff00}
                    edgeStrength={3}
                    blur
                    xRay
                />
            </EffectComposer>
        </>
    );
}

/**
 * Main Three.js renderer component using React Three Fiber
 */
const ThreeScene = () => {
    const t = useTranslations("ThreeRenderer");

    const { snap } = useWorldValues();
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    const cameraPosition = getCameraPosition(snap);
    const cameraFov = getCameraFOV(snap);
    const camearNear = getCameraNear(snap);

    return (
        <div className="w-full h-full bg-sidebar relative">
            {!isCanvasReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-sidebar z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-pulse" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t("loading_scene")}
                        </p>
                    </div>
                </div>
            )}
            <Canvas
                onCreated={() => setIsCanvasReady(true)}
                shadows
                camera={{
                    position: [
                        cameraPosition.x,
                        cameraPosition.y,
                        cameraPosition.z,
                    ],
                    fov: cameraFov,
                    near: camearNear,
                }}
            >
                <SceneContent />
            </Canvas>
            <AnimationControlPanel />
        </div>
    );
};

export default ThreeScene;
