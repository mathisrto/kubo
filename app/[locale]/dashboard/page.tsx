"use client";

import ThreeScene from "@/lib/components/ThreeRenderer";
import { useScene } from "@/lib/contexts/SceneContext";
import { useUser } from "@/lib/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Box,
    Circle,
    Cylinder,
    Maximize2,
    MousePointer2,
    Move,
    RotateCw,
    Square,
} from "lucide-react";
import { useTranslations } from "next-intl";

const DashboardPage = () => {
    const { user, logout } = useUser();
    const { scene, isLoading } = useScene();
    const router = useRouter();
    const [localUser, setLocalUser] = useState(user);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const t = useTranslations("Dashboard");
    const [selectedObject, setSelectedObject] = useState<string | null>(null);

    useEffect(() => {
        if (user) setLocalUser(user);
    }, [user]);

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // TODO: parse and import into scene
        const reader = new FileReader();
        reader.onload = () => {
            console.log("Imported file contents:", reader.result);
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        // TODO: replace with real scene export
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
        // TODO: call scene reset
        console.log("Reset scene");
    };

    const handleSave = () => {
        // TODO: save scene to backend or local
        console.log("Save scene");
    };

    const [cameraType, setCameraType] = useState<
        "perspective" | "orthographic"
    >("perspective");
    const handleCameraTypeChange = (value: string) => {
        setCameraType(value as "perspective" | "orthographic");
        console.log("Change camera to", value);
    };

    const [globalLightIntensity, setGlobalLightIntensity] = useState(1);

    return (
        <div className="w-full h-full bg-background text-foreground">
            {/* Navbar */}
            <header className="sticky top-0 z-30 border-b bg-background/60 backdrop-blur-sm">
                <button onClick={handleLogout}>Logout</button>
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        {t("scene")}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="w-[260px] p-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleImport}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    {t("import")}
                                                </Button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".json,.glb,.gltf"
                                                    className="hidden"
                                                    onChange={onFileSelected}
                                                />
                                                <Button
                                                    onClick={handleExport}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    {t("export")}
                                                </Button>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleReset}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    {t("reset")}
                                                </Button>
                                                <Button
                                                    onClick={handleSave}
                                                    variant="default"
                                                    size="sm"
                                                >
                                                    {t("save")}
                                                </Button>
                                            </div>

                                            <div className="pt-2">
                                                <Label>
                                                    {t("camera_type")}
                                                </Label>
                                                <Select
                                                    onValueChange={
                                                        handleCameraTypeChange
                                                    }
                                                    defaultValue={cameraType}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={t(
                                                                "camera_type"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="perspective">
                                                            {t(
                                                                "camera_perspective"
                                                            )}
                                                        </SelectItem>
                                                        <SelectItem value="orthographic">
                                                            {t(
                                                                "camera_orthographic"
                                                            )}
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="pt-2">
                                                <Label>
                                                    {t("global_light")}
                                                </Label>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={2}
                                                    step={0.1}
                                                    value={globalLightIntensity}
                                                    onChange={(e) =>
                                                        setGlobalLightIntensity(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="pt-2 flex justify-end">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    {t("close")}
                                                </Button>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground mr-2">
                            {localUser?.displayName || "Utilisateur"}
                        </div>
                        <Avatar>
                            <AvatarImage
                                src={localUser?.photoURL || "/avatar.png"}
                                alt={localUser?.displayName || "Avatar"}
                            />
                            <AvatarFallback>
                                {(localUser?.displayName || "U").charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Main content: left sidebar, center scene, right sidebar */}
            <div className="mx-auto flex h-[calc(100vh-64px)] max-w-[1600px] gap-4 px-4 py-4">
                {/* Left sidepanel */}
                <aside className="w-72 shrink-0">
                    <Card className="h-full overflow-auto">
                        <CardHeader>
                            <CardTitle>{t("hierarchy")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Scene hierarchy */}
                            {isLoading ? (
                                <div className="text-sm text-muted-foreground">
                                    Chargement...
                                </div>
                            ) : scene ? (
                                <div className="space-y-2">
                                    <div className="rounded border p-2">
                                        <div className="font-semibold mb-2">
                                            Scene
                                        </div>
                                        <ul className="space-y-1 ml-4">
                                            <li
                                                className="cursor-pointer hover:text-primary text-sm"
                                                onClick={() =>
                                                    setSelectedObject("camera")
                                                }
                                            >
                                                📷 Camera
                                            </li>
                                            {scene.lights.map((light, idx) => (
                                                <li
                                                    key={`light-${idx}`}
                                                    className="cursor-pointer hover:text-primary text-sm"
                                                    onClick={() =>
                                                        setSelectedObject(
                                                            `light-${idx}`
                                                        )
                                                    }
                                                >
                                                    💡{" "}
                                                    {light.name ||
                                                        `Light ${idx + 1}`}
                                                </li>
                                            ))}
                                            {scene.objects.map((obj, idx) => (
                                                <li
                                                    key={`obj-${idx}`}
                                                    className="cursor-pointer hover:text-primary text-sm"
                                                    onClick={() =>
                                                        setSelectedObject(
                                                            obj.name
                                                        )
                                                    }
                                                >
                                                    📦 {obj.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Aucune scène
                                </div>
                            )}

                            {/* Object properties */}
                            {selectedObject && (
                                <>
                                    <div>
                                        <Label>{t("position")}</Label>
                                        <div className="flex gap-2">
                                            <Input placeholder="x" size={5} />
                                            <Input placeholder="y" size={5} />
                                            <Input placeholder="z" size={5} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>{t("rotation")}</Label>
                                        <div className="flex gap-2">
                                            <Input placeholder="x" size={5} />
                                            <Input placeholder="y" size={5} />
                                            <Input placeholder="z" size={5} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>{t("scale")}</Label>
                                        <div className="flex gap-2">
                                            <Input placeholder="x" size={5} />
                                            <Input placeholder="y" size={5} />
                                            <Input placeholder="z" size={5} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </aside>

                {/* Center 3D canvas */}
                <main className="flex-1">
                    <div className="h-full w-full rounded border bg-muted/5">
                        <ThreeScene />
                    </div>
                </main>

                {/* Right sidepanel */}
                <aside className="w-72 shrink-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>{t("tools")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Create objects */}
                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">
                                    Créer des objets
                                </Label>
                                <div className="flex gap-2 flex-wrap">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Create cube"
                                                        )
                                                    }
                                                >
                                                    <Box className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("create_cube")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Create sphere"
                                                        )
                                                    }
                                                >
                                                    <Circle className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("create_sphere")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Create cylinder"
                                                        )
                                                    }
                                                >
                                                    <Cylinder className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("create_cylinder")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Create plane"
                                                        )
                                                    }
                                                >
                                                    <Square className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("create_plane")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Transform tools */}
                            <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">
                                    Outils de transformation
                                </Label>
                                <div className="flex gap-2 flex-wrap">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Select tool"
                                                        )
                                                    }
                                                >
                                                    <MousePointer2 className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("select_tool")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Translate tool"
                                                        )
                                                    }
                                                >
                                                    <Move className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("translate_tool")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Rotate tool"
                                                        )
                                                    }
                                                >
                                                    <RotateCw className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("rotate_tool")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Scale tool"
                                                        )
                                                    }
                                                >
                                                    <Maximize2 className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("scale_tool")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default DashboardPage;
