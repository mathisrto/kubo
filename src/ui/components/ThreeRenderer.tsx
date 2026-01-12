"use client";

import { useTransform } from "@/src/contexts/transformContext";
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
import { CameraType, OBJECT_TYPES } from "@/src/types";
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
  useSelect,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Light3D } from "./Light3DRenderer";
import { Model3D } from "./Model3DRenderer";
import { SelectionObserver } from "./SelectionObserver";

function SceneContent() {
  const { world, snap } = useWorldValues();

  const { transformMode, selectedObject } = useTransform();
  const [isControlsInitialized, setIsControlsInitialized] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [meshes, setMeshes] = useState<Record<string, THREE.Mesh>>({});

  const [, setSelected] = useSelect();

  // Dériver selectedMesh directement sans effet
  const selectedMesh =
    selectedObject && meshes[selectedObject]
      ? meshes[selectedObject]
      : undefined;

  const environmentUrl = (() => {
    const gridFsId = getEnvironmentMap(snap);
    if (!gridFsId) {
      return "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr";
    }
    // Utiliser la route API avec le gridFsId et ajouter .hdr pour que Environment détecte le format
    return `/api/files/${gridFsId}.hdr`;
  })();

  // Gestion des meshes pour modèles et lumières
  const handleMeshCreated = useCallback((id: string, mesh: THREE.Mesh) => {
    setMeshes((prev) => ({
      ...prev,
      [id]: mesh,
    }));
  }, []);

  const handleSelectionChange = useCallback((mesh: THREE.Mesh | undefined) => {
    setSelectedMesh(mesh);
  }, []);

  return (
    <>
      <Environment
        files={environmentUrl}
        background
        backgroundBlurriness={0.5}
        environmentIntensity={getEnvironmentIntensity(snap)}
      />
      <Select>
        <SelectionObserver onSelectionChange={handleSelectionChange} />
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
      {selectedMesh?.parent && transformMode && meshes[selectedObject!] && (
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
              const model = getModel3DById(snap, mesh.userData.id);
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
              const light = getLightById(snap, mesh.userData.id);
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

      {/* Camera */}
      {(getCameraType(snap) === CameraType.PERSPECTIVE && (
        <PerspectiveCamera
          makeDefault
          position={[
            getCameraPosition(snap).x,
            getCameraPosition(snap).y,
            getCameraPosition(snap).z,
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
              getCameraPosition(snap).x,
              getCameraPosition(snap).y,
              getCameraPosition(snap).z,
            ]}
            near={getCameraNear(snap)}
            far={getCameraFar(snap)}
          />
        ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={0.01}
        maxDistance={10000}
        onEnd={(e) => {
          // Ignorer les premiers événements onChange pendant l'initialisation
          if (!isControlsInitialized) return;

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
      <GizmoHelper alignment="top-right" margin={[80, 80]} renderPriority={2}>
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
          position: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
          fov: cameraFov,
          near: camearNear,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
