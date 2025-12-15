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
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CAMERA_TYPES } from "../constants";
import { useScene } from "../contexts/SceneContext";
import { useTransform } from "../contexts/TransformContext";

/**
 * Composant pour un modèle 3D individuel avec gestion du hover et de la sélection
 */
function Model3D({
    model,
    isTransforming,
    onMeshCreated,
}: {
    model: any;
    isTransforming?: boolean;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    const [hovered, setHover] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    const isProcedural = model.metadata?.procedural === true;
    const geometry = model.metadata?.geometry;

    useCursor(hovered && !isTransforming);

    useEffect(() => {
        if (meshRef.current) {
            onMeshCreated(model.id, meshRef.current);
        }
    }, [model.id, onMeshCreated]);

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
 * Scene content - everything inside the Canvas
 */
/**
 * Composant qui observe la sélection et met à jour le state parent
 */
function SelectionObserver({
    onSelectionChange,
}: {
    onSelectionChange: (mesh: THREE.Mesh | undefined) => void;
}) {
    const selected = useSelect();
    const { selectedObject, setSelectedObject } = useTransform();

    useEffect(() => {
        if (!selected || selected.length === 0) {
            console.log("Selection changed: empty");
            setSelectedObject(null);
            onSelectionChange(undefined);
            return;
        }

        // Filtrer pour ne garder que les mesh valides
        const validMesh = selected.filter((obj): obj is THREE.Mesh => {
            return obj instanceof THREE.Mesh;
        })[0];
        setSelectedObject(validMesh?.userData.id || null);
        console.log(
            "Selection changed: selected mesh id =",
            validMesh?.userData.id || null
        );
        onSelectionChange(validMesh);
    }, [selected, onSelectionChange]);

    return null;
}

function SceneContent() {
    const { scene } = useScene();
    const { transformMode, selectedObject } = useTransform();
    const [isControlsInitialized, setIsControlsInitialized] = useState(false);
    const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh>();
    const [isTransforming, setIsTransforming] = useState(false);
    const [meshes, setMeshes] = useState<Record<string, THREE.Mesh>>({});

    const [, setSelected] = useSelect();

    useEffect(() => {
        // Lorsque selectedObject change, mettre à jour selectedMesh
        if (selectedObject) {
            const mesh = meshes[selectedObject];
            setSelectedMesh(mesh);
        }
    }, [selectedObject, meshes, setSelected]);

    if (!scene) return null;

    // État pour l'URL de l'environnement validée
    const [validatedEnvUrl, setValidatedEnvUrl] = useState<string>(
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
    );

    // Valider et charger l'environnement
    useEffect(() => {
        const url = scene.ambientLight.environmentMap;
        if (!url) {
            setValidatedEnvUrl(
                "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
            );
            return;
        }

        // Extensions supportées
        const SUPPORTED_EXTENSIONS = [".hdr", ".exr", ".jpg", ".jpeg", ".png"];
        const isSupported = SUPPORTED_EXTENSIONS.some((ext) =>
            url.toLowerCase().endsWith(ext)
        );

        if (!isSupported) {
            console.warn(
                "Extension non supportée, fallback sur sunset.jpg",
                url
            );
            setValidatedEnvUrl(
                "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
            );
            return;
        }

        // Tester le chargement avec TextureLoader
        const loader = new THREE.TextureLoader();
        loader.load(
            url,
            (texture) => {
                console.log("Environnement chargé avec succès:", url);
                setValidatedEnvUrl(url);
            },
            undefined, // onProgress
            (error) => {
                console.warn(
                    "Erreur de chargement de l'environnement, fallback sur sunset.jpg",
                    url,
                    error
                );
                setValidatedEnvUrl(
                    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
                );
            }
        );
    }, [scene.ambientLight.environmentMap]);

    const handleMeshCreated = useCallback((id: string, mesh: THREE.Mesh) => {
        setMeshes((prev) => ({
            ...prev,
            [id]: mesh,
        }));
    }, []);

    const handleSelectionChange = useCallback(
        (mesh: THREE.Mesh | undefined) => {
            setSelectedMesh(mesh);
        },
        []
    );

    return (
        <>
            <Environment
                files={validatedEnvUrl}
                background
                backgroundBlurriness={0.5}
                environmentIntensity={scene.ambientLight.intensity}
            />
            <Select>
                <SelectionObserver onSelectionChange={handleSelectionChange} />
                {scene.models3d?.map((model) => (
                    <Model3D
                        key={model.id}
                        model={model}
                        isTransforming={isTransforming}
                        onMeshCreated={handleMeshCreated}
                    />
                ))}
            </Select>

            {/* Transform Controls */}
            {selectedMesh && transformMode && (
                <TransformControls
                    object={selectedMesh}
                    mode={transformMode}
                    onMouseDown={() => setIsTransforming(true)}
                    onMouseUp={() => setIsTransforming(false)}
                    onObjectChange={() => {
                        const mesh = selectedMesh;
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
                    selection={selectedMesh ? [selectedMesh] : []}
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
