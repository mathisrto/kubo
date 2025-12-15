"use client";

import ThreeScene from "@/lib/components/ThreeRenderer";
import { useScene } from "@/lib/contexts/SceneContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateObjectsPanel } from "@/lib/components/CreateObjectsPanel";
import { DashboardNavbar } from "@/lib/components/DashboardNavbar";
import { ObjectProperties } from "@/lib/components/ObjectProperties";
import { SceneHierarchy } from "@/lib/components/SceneHierarchy";
import { TransformToolsPanel } from "@/lib/components/TransformToolsPanel";
import { useTransform } from "@/lib/contexts/TransformContext";
import { useViewport } from "@/lib/contexts/ViewportContext";
import {
    ChevronLeft,
    ChevronRight,
    Cuboid,
    MousePointer2,
    Move,
    RotateCw,
    Scale,
} from "lucide-react";

const DashboardPage = () => {
    const { updateScene } = useScene();
    const {
        leftSidebarOpen,
        setLeftSidebarOpen,
        rightSidebarOpen,
        setRightSidebarOpen,
    } = useViewport();
    const { selectedObject, transformMode, setTransformMode } = useTransform();

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground">
            {/* Navbar */}
            <DashboardNavbar />

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div
                    className={`relative border-r bg-background transition-all duration-300 ${
                        leftSidebarOpen ? "w-72" : "w-0"
                    }`}
                >
                    {leftSidebarOpen && (
                        <div className="flex h-full flex-col p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Hiérarchie
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setLeftSidebarOpen(false)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </div>
                            <Separator className="mb-4" />
                            <div className="flex-1 overflow-auto">
                                <SceneHierarchy />
                                {selectedObject && (
                                    <Card className="mt-4">
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Propriétés
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <ObjectProperties
                                                selectedObject={selectedObject}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle button for left sidebar when closed */}
                {!leftSidebarOpen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-20 z-10"
                        onClick={() => setLeftSidebarOpen(true)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}

                {/* 3D Canvas - Takes all available space */}
                <main className="relative flex-1 bg-muted/5">
                    <ThreeScene />
                </main>

                {/* Right Sidebar */}
                <div
                    className={`relative border-l bg-background transition-all duration-300 ${
                        rightSidebarOpen ? "w-72" : "w-14"
                    }`}
                >
                    {rightSidebarOpen ? (
                        <div className="flex h-full flex-col p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Outils
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setRightSidebarOpen(false)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Separator className="mb-4" />
                            <div className="flex-1 space-y-6 overflow-auto">
                                <CreateObjectsPanel
                                    onCreateCube={async () => {
                                        updateScene(async (scene) => {
                                            await scene.createCube();
                                        });
                                    }}
                                    onCreateSphere={async () => {
                                        updateScene(async (scene) => {
                                            await scene.createSphere();
                                        });
                                    }}
                                    onCreateCylinder={async () => {
                                        updateScene(async (scene) => {
                                            await scene.createCylinder();
                                        });
                                    }}
                                    onCreatePlane={async () => {
                                        updateScene(async (scene) => {
                                            await scene.createPlane();
                                        });
                                    }}
                                />
                                <Separator />
                                <TransformToolsPanel />
                            </div>
                        </div>
                    ) : (
                        <TooltipProvider>
                            <div className="flex h-full flex-col items-center gap-2 py-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setRightSidebarOpen(true)
                                            }
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Ouvrir le panneau</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Separator />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={
                                                transformMode === null
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            size="icon"
                                            onClick={() =>
                                                setTransformMode(null)
                                            }
                                        >
                                            <MousePointer2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Sélection</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={
                                                transformMode === "translate"
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            size="icon"
                                            onClick={() =>
                                                setTransformMode("translate")
                                            }
                                        >
                                            <Move className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Translation</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={
                                                transformMode === "rotate"
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            size="icon"
                                            onClick={() =>
                                                setTransformMode("rotate")
                                            }
                                        >
                                            <RotateCw className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Rotation</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={
                                                transformMode === "scale"
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            size="icon"
                                            onClick={() =>
                                                setTransformMode("scale")
                                            }
                                        >
                                            <Scale className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Échelle</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Separator />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={async () => {
                                                updateScene(async (scene) => {
                                                    await scene.createCube();
                                                });
                                            }}
                                        >
                                            <Cuboid className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Créer un cube</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
