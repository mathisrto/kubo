"use client";

import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { useScene } from "../contexts/SceneContext";

interface ThreeSceneProps {
    update?: number;
    selectedObject?: string | null;
}

/**
 * Scene content - everything inside the Canvas
 */
function SceneContent() {
    const { scene, isLoading } = useScene();
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(
        null
    );

    if (!scene) return null;

    return (
        <>
            {/* Camera */}
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

            {/* Controls */}
            <OrbitControls
                makeDefault
                target={[
                    scene.camera.target.x,
                    scene.camera.target.y,
                    scene.camera.target.z,
                ]}
                enableDamping
                dampingFactor={0.05}
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
                fadeDistance={100}
                fadeStrength={2}
                cellSize={1}
                cellThickness={0.5}
                sectionSize={10}
                sectionThickness={1}
                cellColor="#888888"
                sectionColor="#ffffff"
            />

            {/* Ambient Light */}
            <ambientLight
                intensity={scene.ambientLight.intensity}
                color={
                    new THREE.Color(
                        scene.ambientLight.color.r,
                        scene.ambientLight.color.g,
                        scene.ambientLight.color.b
                    )
                }
            />

            {/* Click background to deselect */}
            <mesh
                onClick={() => setSelectedObjectId(null)}
                visible={false}
                position={[0, 0, -1]}
            >
                <planeGeometry args={[10000, 10000]} />
            </mesh>
        </>
    );
}

/**
 * Main Three.js renderer component using React Three Fiber
 */
const ThreeScene = ({ update, selectedObject }: ThreeSceneProps) => {
    const { isLoading } = useScene();

    if (isLoading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "400px",
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
        <div style={{ width: "100%", height: "400px", position: "relative" }}>
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
