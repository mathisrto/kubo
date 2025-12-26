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
    useHelper,
    useSelect,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CAMERA_TYPES, OBJECT_TYPES } from "../constants";
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

    // Stocker une ref vers le model pour la synchronisation
    const modelRef = useRef(model);
    useEffect(() => {
        modelRef.current = model;
    }, [model]);

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
            userData={{ id: model.id, type: "model" }}
            position={[model.position.x, model.position.y, model.position.z]}
            rotation={[
                degToRad(model.rotation.x),
                degToRad(model.rotation.y),
                degToRad(model.rotation.z),
            ]}
            scale={[model.scale.x, model.scale.y, model.scale.z]}
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
 * Composant pour une lumière 3D native Three.js avec helper visuel
 */
import {
    DirectionalLightHelper,
    PointLightHelper,
    SpotLightHelper,
} from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { LIGHT_TYPES } from "../constants";

function Light3D({
    light,
    onMeshCreated,
}: {
    light: any;
    isTransforming?: boolean;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    // Refs pour chaque type de lumière
    const pointRef = useRef<THREE.PointLight>(null);
    const spotRef = useRef<THREE.SpotLight>(null);
    const dirRef = useRef<THREE.DirectionalLight>(null);
    // Helper invisible pour la sélection
    const helperRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        if (helperRef.current) {
            onMeshCreated(light.id, helperRef.current);
        }
    }, [light.id, onMeshCreated]);

    // Couleur de la lumière
    const color = light.color
        ? `rgb(${light.color.r},${light.color.g},${light.color.b})`
        : "#fff";

    const size = 0.2;

    // Helper visuel selon le type
    if (light.type === LIGHT_TYPES.POINT) {
        useHelper(
            pointRef as React.RefObject<THREE.Object3D>,
            PointLightHelper,
            size
        );
    } else if (light.type === LIGHT_TYPES.SPOT) {
        useHelper(
            spotRef as React.RefObject<THREE.Object3D>,
            SpotLightHelper,
            size
        );
    } else if (light.type === LIGHT_TYPES.DIRECTIONAL) {
        useHelper(
            dirRef as React.RefObject<THREE.Object3D>,
            DirectionalLightHelper,
            size
        );
    }

    // Rendu dynamique selon le type
    return (
        <>
            {light.type === LIGHT_TYPES.POINT && (
                <pointLight
                    ref={pointRef}
                    position={[
                        light.position?.x ?? 0,
                        light.position?.y ?? 0,
                        light.position?.z ?? 0,
                    ]}
                    color={color}
                    intensity={light.intensity ?? 1}
                    distance={light.range ?? 0}
                    userData={{ id: light.id, type: "light" }}
                />
            )}
            {light.type === LIGHT_TYPES.SPOT && (
                <spotLight
                    ref={spotRef}
                    position={[
                        light.position?.x ?? 0,
                        light.position?.y ?? 0,
                        light.position?.z ?? 0,
                    ]}
                    color={color}
                    intensity={light.intensity ?? 1}
                    distance={light.range ?? 0}
                    angle={light.angle ?? Math.PI / 6}
                    penumbra={light.penumbra ?? 0.1}
                    userData={{ id: light.id, type: "light" }}
                />
            )}
            {light.type === LIGHT_TYPES.DIRECTIONAL && (
                <directionalLight
                    ref={dirRef}
                    position={[
                        light.position?.x ?? 0,
                        light.position?.y ?? 0,
                        light.position?.z ?? 0,
                    ]}
                    color={color}
                    intensity={light.intensity ?? 1}
                    userData={{ id: light.id, type: "light" }}
                />
            )}
            {/* Helper invisible pour la sélection/manipulation */}
            <mesh
                ref={helperRef}
                userData={{ id: light.id, type: "light" }}
                position={[
                    light.position?.x ?? 0,
                    light.position?.y ?? 0,
                    light.position?.z ?? 0,
                ]}
                visible={false}
            >
                <sphereGeometry args={[size, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </>
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
    const { setSelectedObject } = useTransform();

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
        const id = validMesh?.userData.id || null;
        const type = validMesh?.userData.type || null;
        setSelectedObject(id && type ? { id, type } : null);
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
            const mesh = meshes[selectedObject.id];
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

    // Gestion des meshes pour modèles et lumières
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
                {/* Modèles 3D */}
                {scene.models3d?.map((model) => (
                    <Model3D
                        key={model.id}
                        model={model}
                        isTransforming={isTransforming}
                        onMeshCreated={handleMeshCreated}
                    />
                ))}
                {/* Lumières 3D */}
                {scene.lights?.map((light) => (
                    <Light3D
                        key={light.id}
                        light={light}
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
                            const model = scene.models3d.find(
                                (m) => m.id === mesh.userData.id
                            );
                            if (model) {
                                model.position.x = mesh.position.x;
                                model.position.y = mesh.position.y;
                                model.position.z = mesh.position.z;
                                model.rotation.x = radToDeg(mesh.rotation.x);
                                model.rotation.y = radToDeg(mesh.rotation.y);
                                model.rotation.z = radToDeg(mesh.rotation.z);
                                model.scale.x = mesh.scale.x;
                                model.scale.y = mesh.scale.y;
                                model.scale.z = mesh.scale.z;
                            }
                        }
                        if (mesh.userData.type === OBJECT_TYPES.LIGHT) {
                            const light = scene.lights.find(
                                (l) => l.id === mesh.userData.id
                            );
                            if (light && light.position) {
                                light.position.x = mesh.position.x;
                                light.position.y = mesh.position.y;
                                light.position.z = mesh.position.z;
                            }
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
            <div className="w-full h-full flex justify-center items-center">
                <p>Chargement de la scène...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-background">
            <Canvas shadows camera={{ position: [5, 5, 5], fov: 75 }}>
                <SceneContent />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
