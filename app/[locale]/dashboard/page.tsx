"use client";

import ThreeScene from "@/lib/components/ThreeRenderer";
import { useScene } from "@/lib/contexts/SceneContext";
import { useUser } from "@/lib/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateObjectsPanel } from "@/lib/components/CreateObjectsPanel";
import { DashboardNavbar } from "@/lib/components/DashboardNavbar";
import { ObjectProperties } from "@/lib/components/ObjectProperties";
import { SceneHierarchy } from "@/lib/components/SceneHierarchy";
import { TransformToolsPanel } from "@/lib/components/TransformToolsPanel";

const DashboardPage = () => {
    const { user, logout } = useUser();
    const { scene, isLoading } = useScene();
    const router = useRouter();
    const [localUser, setLocalUser] = useState(user);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [cameraType, setCameraType] = useState<
        "perspective" | "orthographic"
    >("perspective");
    const [globalLightIntensity, setGlobalLightIntensity] = useState(1);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const updateScene = () => {
        setUpdateTrigger((prev) => prev + 1);
    };

    useEffect(() => {
        if (user) setLocalUser(user);
    }, [user]);

    const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsText(file);
    };

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            note: "scene-export-placeholder",
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scene-export.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const handleReset = () => {
        console.log("Reset scene");
    };

    const handleSave = () => {
        console.log("Save scene");
    };

    const handleCameraTypeChange = (value: string) => {
        setCameraType(value as "perspective" | "orthographic");
        console.log("Change camera to", value);
    };

    return (
        <div className="w-full h-full bg-background text-foreground">
            <DashboardNavbar
                userName={localUser?.displayName}
                userAvatar={localUser?.photoURL}
                onImport={() => console.log("Import")}
                onExport={handleExport}
                onReset={handleReset}
                onSave={handleSave}
                onLogout={handleLogout}
                onFileSelected={onFileSelected}
                cameraType={cameraType}
                onCameraTypeChange={handleCameraTypeChange}
                globalLightIntensity={globalLightIntensity}
                onGlobalLightChange={setGlobalLightIntensity}
            />

            <div className="mx-auto flex h-[calc(100vh-64px)] max-w-[1600px] gap-4 px-4 py-4">
                {/* Left sidepanel */}
                <aside className="w-72 shrink-0">
                    <SceneHierarchy
                        scene={scene}
                        isLoading={isLoading}
                        selectedObject={selectedObject}
                        onSelectObject={setSelectedObject}
                        updateScene={updateScene}
                    />
                    {selectedObject && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Propriétés</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ObjectProperties
                                    selectedObject={selectedObject}
                                />
                            </CardContent>
                        </Card>
                    )}
                </aside>

                {/* Center 3D canvas */}
                <main className="flex-1">
                    <div className="h-full w-full rounded border bg-muted/5">
                        <ThreeScene
                            update={updateTrigger}
                            selectedObject={selectedObject}
                        />
                    </div>
                </main>

                {/* Right sidepanel */}
                <aside className="w-72 shrink-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Outils</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CreateObjectsPanel
                                onCreateCube={async () => {
                                    await scene?.createCube();
                                    await scene?.save();
                                    updateScene();
                                }}
                                onCreateSphere={async () => {
                                    await scene?.createSphere();
                                    await scene?.save();
                                    updateScene();
                                }}
                                onCreateCylinder={async () => {
                                    await scene?.createCylinder();
                                    await scene?.save();
                                    updateScene();
                                }}
                                onCreatePlane={async () => {
                                    await scene?.createPlane();
                                    await scene?.save();
                                    updateScene();
                                }}
                            />
                            <TransformToolsPanel
                                onSelectTool={() => console.log("Select tool")}
                                onTranslateTool={() =>
                                    console.log("Translate tool")
                                }
                                onRotateTool={() => console.log("Rotate tool")}
                                onScaleTool={() => console.log("Scale tool")}
                            />
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default DashboardPage;
