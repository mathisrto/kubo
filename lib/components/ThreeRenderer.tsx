"use client";

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
    useCursor,
    useSelect,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useScene } from "../contexts/SceneContext";
import { useViewport } from "../contexts/ViewportContext";

/**
 * Composant pour un modèle 3D individuel avec gestion du hover et de la sélection
 */
function Model3D({
    model,
    isTransforming,
}: {
    model: any;
    isTransforming?: boolean;
}) {
    const [hovered, setHover] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    const isProcedural = model.metadata?.procedural === true;
    const geometry = model.metadata?.geometry;

    useCursor(hovered && !isTransforming);

    return (
        <mesh
            receiveShadow
            ref={meshRef}
            userData={{ id: model.id, model }}
            position={[
                model.positionVector.x,
                model.positionVector.y,
                model.positionVector.z,
            ]}
            rotation={[
                model.rotationVector.x,
                model.rotationVector.y,
                model.rotationVector.z,
            ]}
            scale={[
                model.scaleVector.x,
                model.scaleVector.y,
                model.scaleVector.z,
            ]}
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
            {isProcedural && geometry === "cube" && (
                <boxGeometry args={[1, 1, 1]} />
            )}
            {isProcedural && geometry === "sphere" && (
                <sphereGeometry args={[0.5, 32, 32]} />
            )}
            {isProcedural && geometry === "cylinder" && (
                <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            )}
            {isProcedural && geometry === "plane" && (
                <planeGeometry args={[1, 1]} />
            )}
            <meshStandardMaterial side={2} />
        </mesh>
    );
}

/**
 * Composant qui observe la sélection et met à jour le state parent
 */
function SelectionObserver({
    onSelectionChange,
}: {
    onSelectionChange: (meshes: THREE.Mesh[]) => void;
}) {
    const selected = useSelect();

    useEffect(() => {
        if (!selected || selected.length === 0) {
            console.log("Selection changed: empty");
            onSelectionChange([]);
            return;
        }

        // Filtrer pour ne garder que les mesh valides
        const validMeshes = selected.filter(
            (obj): obj is THREE.Mesh =>
                obj &&
                obj instanceof THREE.Mesh &&
                obj.userData &&
                obj.userData.model
        );

        console.log("Selection changed:", validMeshes.length, "valid meshes");
        onSelectionChange(validMeshes);
    }, [selected, onSelectionChange]);

    return null;
}

import sunset from "@/data/images/venice_sunset.jpg";
import { CAMERA_TYPES } from "../constants";

/**
 * Scene content - everything inside the Canvas
 */
function SceneContent() {
    const { scene } = useScene();
    const {
        selectedObject,
        transformMode,
        environmentIntensity,
        environmentImage,
    } = useViewport();
    const [isControlsInitialized, setIsControlsInitialized] = useState(false);
    const [selectedMeshes, setSelectedMeshes] = useState<THREE.Mesh[]>([]);
    const [isTransforming, setIsTransforming] = useState(false);

    if (!scene) return null;

    // Map environment names to actual image paths
    const environmentMap: Record<string, string> = {
        venice_sunset: sunset.src,
        studio: sunset.src, // TODO: Add actual studio environment
        warehouse: sunset.src, // TODO: Add actual warehouse environment
        forest: sunset.src, // TODO: Add actual forest environment
    };

    const currentEnvironment = environmentMap[environmentImage] || sunset.src;

    return (
        <>
            <Environment
                files={currentEnvironment}
                background
                backgroundBlurriness={0.5}
                environmentIntensity={environmentIntensity}
            />
            <Select>
                <SelectionObserver onSelectionChange={setSelectedMeshes} />
                {scene.models3d.map((model) => (
                    <Model3D
                        key={model.id}
                        model={model}
                        isTransforming={isTransforming}
                    />
                ))}
            </Select>

            {/* Transform Controls */}
            {selectedMeshes.length > 0 && transformMode && (
                <TransformControls
                    object={selectedMeshes[0]}
                    mode={transformMode}
                    onMouseDown={() => setIsTransforming(true)}
                    onMouseUp={() => setIsTransforming(false)}
                    onObjectChange={() => {
                        const mesh = selectedMeshes[0];
                        const model = mesh.userData.model;
                        if (model) {
                            model.positionVector.x = mesh.position.x;
                            model.positionVector.y = mesh.position.y;
                            model.positionVector.z = mesh.position.z;
                            model.rotationVector.x = mesh.rotation.x;
                            model.rotationVector.y = mesh.rotation.y;
                            model.rotationVector.z = mesh.rotation.z;
                            model.scaleVector.x = mesh.scale.x;
                            model.scaleVector.y = mesh.scale.y;
                            model.scaleVector.z = mesh.scale.z;
                        }
                    }}
                />
            )}

            {/* Camera */}
            {(scene.camera.type === CAMERA_TYPES.PERSPECTIVE && (
                <PerspectiveCamera
                    makeDefault
                    position={[
                        scene.camera.position.x,
                        scene.camera.position.y,
                        scene.camera.position.z,
                    ]}
                    fov={scene.camera.fov}
                    near={scene.camera.near}
                    far={scene.camera.far}
                />
            )) ||
                (scene.camera.type === CAMERA_TYPES.ORTHOGRAPHIC && (
                    <OrthographicCamera
                        makeDefault
                        position={[
                            scene.camera.position.x,
                            scene.camera.position.y,
                            scene.camera.position.z,
                        ]}
                        near={scene.camera.near}
                        far={scene.camera.far}
                    />
                ))}

            {/* Orbit Controls - makeDefault permet la désactivation automatique avec TransformControls */}
            <OrbitControls
                makeDefault
                target={[
                    scene.camera.target.x,
                    scene.camera.target.y,
                    scene.camera.target.z,
                ]}
                enableDamping
                dampingFactor={0.05}
                onStart={() => {
                    // Marquer les controls comme initialisés après le premier mouvement
                    setIsControlsInitialized(true);
                }}
                onChange={(e) => {
                    // Ignorer les premiers événements onChange pendant l'initialisation
                    if (!isControlsInitialized) return;

                    // Synchroniser les changements de la caméra Three.js vers notre modèle
                    if (e?.target) {
                        const controls = e.target;
                        const camera = controls.object;

                        // Mettre à jour la position
                        scene.camera.position.x = camera.position.x;
                        scene.camera.position.y = camera.position.y;
                        scene.camera.position.z = camera.position.z;

                        // Mettre à jour le target
                        scene.camera.target.x = controls.target.x;
                        scene.camera.target.y = controls.target.y;
                        scene.camera.target.z = controls.target.z;
                    }
                }}
            />

            {/* Gizmo Viewport (coin supérieur droit) */}
            <GizmoHelper alignment="top-right" margin={[80, 80]}>
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

            {/* Post-processing Outline - doit être après tous les objets */}
            <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                    selection={selectedMeshes}
                    visibleEdgeColor={0xffff00}
                    hiddenEdgeColor={0xffff00}
                    edgeStrength={100}
                    blur
                    xRay
                    width={screen.width}
                    height={screen.height}
                />
            </EffectComposer>
        </>
    );
}

/**
 * Main Three.js renderer component using React Three Fiber
 */
const ThreeScene = () => {
    const { isLoading } = useScene();

    if (isLoading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <p>Chargement de la scène...</p>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Canvas
                shadows
                camera={{ position: [5, 5, 5], fov: 75 }}
                style={{ background: "#1a1a1a" }}
            >
                <SceneContent />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
