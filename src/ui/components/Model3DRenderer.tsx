import { useUser } from "@/src/contexts/userContext";
import { useViewMode } from "@/src/contexts/viewModeContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import { setModel3DAnimations } from "@/src/core/ecs/engine/model3dEngine";
import {
    getModel3DFileId,
    getModel3DFormat,
    getModel3DMetadata,
} from "@/src/core/ecs/queries/model3dQuery";
import { getTransform } from "@/src/core/ecs/queries/transformQuery";
import { ModelFileFormat, ViewMode } from "@/src/types";
import { extendGLTFLoader } from "@/src/ui/helpers/gltfSpecularGlossinessPlugin";
import { useCursor, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { subscribe } from "valtio";

/**
 * Composant interne pour charger et afficher un modèle GLTF/GLB
 * Gère également les animations embarquées dans le fichier GLTF.
 *
 * Chaque entité utilise une URL unique (via ?eid=) pour forcer
 * useGLTF à charger une copie indépendante du modèle.
 * Aucun clone nécessaire : chaque entité a sa propre scène,
 * ses propres nœuds, ses propres clips d'animation.
 */
function GLTFModel({
    url,
    modelId,
    isTransforming,
    onMeshCreated,
}: {
    url: string;
    modelId: Entity;
    isTransforming?: boolean;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    const { scene, animations } = useGLTF(url, true, true, extendGLTFLoader);
    const { world, snap } = useWorldValues();
    const { viewMode } = useViewMode();
    const groupRef = useRef<THREE.Group>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
    const [hovered, setHover] = useState(false);
    const animationsRegistered = useRef(false);
    const originalMaterials = useRef<
        Map<THREE.Mesh, THREE.Material | THREE.Material[]>
    >(new Map());

    useCursor(hovered && !isTransforming);

    const transform = getTransform(snap, modelId);

    // Configurer la scène (shadows + frustumCulled) — une seule fois au montage
    useEffect(() => {
        scene.position.set(0, 0, 0);
        scene.rotation.set(0, 0, 0);
        scene.scale.set(1, 1, 1);
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            // Désactiver le frustumCulling sur les SkinnedMesh pour éviter
            // les artefacts liés à la bounding box des os pendant les animations
            if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
                child.frustumCulled = false;
            }
        });
    }, [scene]);

    // ─── Override des matériaux selon le mode de vue ─────────────────────
    useEffect(() => {
        const meshes: THREE.Mesh[] = [];
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                meshes.push(child as THREE.Mesh);
            }
        });

        if (viewMode === ViewMode.WIREFRAME || viewMode === ViewMode.SOLID) {
            meshes.forEach((mesh) => {
                // Sauvegarder le matériau original une seule fois
                if (!originalMaterials.current.has(mesh)) {
                    originalMaterials.current.set(mesh, mesh.material);
                }
                if (viewMode === ViewMode.WIREFRAME) {
                    mesh.material = new THREE.MeshBasicMaterial({
                        color: 0x00ff88,
                        wireframe: true,
                    });
                } else {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: 0xaaaaaa,
                        roughness: 0.7,
                        metalness: 0.0,
                    });
                }
            });
        } else {
            // Restaurer les matériaux originaux
            originalMaterials.current.forEach((mat, mesh) => {
                mesh.material = mat;
            });
            originalMaterials.current.clear();
        }
    }, [viewMode, scene]);

    // Créer le mixer, les actions, et s'abonner aux changements d'animation
    const activeActionRef = useRef<THREE.AnimationAction | null>(null);

    useEffect(() => {
        const mixer = new THREE.AnimationMixer(scene);
        mixerRef.current = mixer;

        const actions: Record<string, THREE.AnimationAction> = {};
        animations.forEach((clip) => {
            actions[clip.name] = mixer.clipAction(clip, scene);
        });
        actionsRef.current = actions;

        // Fonction qui applique l'état d'animation courant
        let prevName: string | null = null;
        let prevPlaying = false;

        function applyAnimationState() {
            const model = world.models[modelId];
            const anim = model?.animation;
            const wantedName = anim?.current ?? null;
            const wantedPlaying = anim?.playing ?? false;

            if (wantedName === prevName && wantedPlaying === prevPlaying)
                return;

            // Sauvegarder les anciennes valeurs AVANT de les mettre à jour
            const oldName = prevName;
            prevName = wantedName;
            prevPlaying = wantedPlaying;

            // Si on change d'animation, stopper l'ancienne et lancer la nouvelle
            if (wantedName !== oldName) {
                if (activeActionRef.current) {
                    activeActionRef.current.stop();
                    activeActionRef.current = null;
                }
                if (wantedName && wantedPlaying) {
                    const action = actions[wantedName];
                    if (action) {
                        action.reset().play();
                        activeActionRef.current = action;
                    }
                }
            } else if (activeActionRef.current) {
                // Même animation : gérer play/pause sans reset
                if (wantedPlaying && activeActionRef.current.paused) {
                    activeActionRef.current.paused = false;
                } else if (!wantedPlaying && !activeActionRef.current.paused) {
                    activeActionRef.current.paused = true;
                }
            } else if (wantedName && wantedPlaying) {
                // Pas d'action active mais on veut jouer
                const action = actions[wantedName];
                if (action) {
                    action.reset().play();
                    activeActionRef.current = action;
                }
            }
        }

        // Appliquer l'état initial
        applyAnimationState();

        // S'abonner aux changements du modèle via valtio subscribe
        const model = world.models[modelId];
        const unsubscribe = model
            ? subscribe(model, applyAnimationState)
            : () => {};

        return () => {
            unsubscribe();
            mixer.stopAllAction();
            mixer.uncacheRoot(scene);
            mixerRef.current = null;
            actionsRef.current = {};
            activeActionRef.current = null;
        };
    }, [scene, animations, world, modelId]);

    // Enregistrer les animations disponibles dans l'ECS (une seule fois)
    useEffect(() => {
        if (animations.length > 0 && !animationsRegistered.current) {
            const animNames = animations.map((clip) => clip.name);
            setModel3DAnimations(world, modelId, animNames);
            animationsRegistered.current = true;
        }
    }, [animations, world, modelId]);

    // Tick le mixer à chaque frame (juste l'avancement du temps)
    useFrame((_, delta) => {
        mixerRef.current?.update(delta);
    });

    useEffect(() => {
        if (groupRef.current) {
            // Enregistrer le group comme "mesh" pour les TransformControls
            setTimeout(
                () =>
                    onMeshCreated(
                        modelId,
                        groupRef.current as unknown as THREE.Mesh,
                    ),
                0,
            );
        }
    }, [modelId, onMeshCreated]);

    if (!transform) return null;

    return (
        <group
            ref={groupRef}
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
            onPointerOut={() => setHover(false)}
        >
            <primitive object={scene} />
        </group>
    );
}

/**
 * Composant pour les primitives générées (cube, sphere, etc.)
 */
function PrimitiveModel({
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
    const { viewMode } = useViewMode();
    const meshRef = useRef<THREE.Mesh>(null);

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
            onPointerOut={() => setHover(false)}
        >
            {primitive === "cube" && <boxGeometry args={[1, 1, 1]} />}
            {primitive === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
            {primitive === "cylinder" && (
                <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            )}
            {primitive === "plane" && <planeGeometry args={[1, 1]} />}
            {viewMode === ViewMode.WIREFRAME ? (
                <meshBasicMaterial color={0x00ff88} wireframe />
            ) : viewMode === ViewMode.SOLID ? (
                <meshStandardMaterial
                    color={0xaaaaaa}
                    roughness={0.7}
                    metalness={0.0}
                />
            ) : (
                <meshStandardMaterial side={2} />
            )}
        </mesh>
    );
}

/**
 * Placeholder affiché pendant le chargement des modèles 3D
 */
function ModelLoadingPlaceholder({
    modelId,
    onMeshCreated,
}: {
    modelId: Entity;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    const { snap } = useWorldValues();
    const meshRef = useRef<THREE.Mesh>(null);
    const transform = getTransform(snap, modelId);

    useEffect(() => {
        if (meshRef.current) {
            setTimeout(() => onMeshCreated(modelId, meshRef.current!), 0);
        }
    }, [modelId, onMeshCreated]);

    if (!transform) return null;

    return (
        <mesh
            ref={meshRef}
            userData={{ id: modelId, type: "model" }}
            position={[
                transform.position.x,
                transform.position.y,
                transform.position.z,
            ]}
        >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
                color="#888888"
                wireframe
                transparent
                opacity={0.5}
            />
        </mesh>
    );
}

/**
 * Composant principal Model3D qui dispatch selon le format
 */
export function Model3D({
    modelId,
    isTransforming,
    onMeshCreated,
}: {
    modelId: Entity;
    isTransforming?: boolean;
    onMeshCreated: (id: string, mesh: THREE.Mesh) => void;
}) {
    const { snap } = useWorldValues();
    const { user } = useUser();

    const format = getModel3DFormat(snap, modelId);
    const fileId = getModel3DFileId(snap, modelId);

    // Modèles générés (primitives)
    if (format === ModelFileFormat.GENERATED) {
        return (
            <PrimitiveModel
                modelId={modelId}
                isTransforming={isTransforming}
                onMeshCreated={onMeshCreated}
            />
        );
    }

    // Modèles GLTF/GLB chargés depuis GridFS
    if (
        (format === ModelFileFormat.GLTF || format === ModelFileFormat.GLB) &&
        fileId
    ) {
        const extension = format === ModelFileFormat.GLB ? ".glb" : ".gltf";
        // URL scopée par utilisateur : chaque user accède uniquement à ses fichiers.
        // Le param ?eid= force useGLTF à charger une copie indépendante par entité.
        const url = `/api/files/${user!.uid}/${fileId}${extension}?eid=${modelId}`;

        return (
            <Suspense
                fallback={
                    <ModelLoadingPlaceholder
                        modelId={modelId}
                        onMeshCreated={onMeshCreated}
                    />
                }
            >
                <GLTFModel
                    url={url}
                    modelId={modelId}
                    isTransforming={isTransforming}
                    onMeshCreated={onMeshCreated}
                />
            </Suspense>
        );
    }

    // Fallback: format non supporté
    return null;
}
