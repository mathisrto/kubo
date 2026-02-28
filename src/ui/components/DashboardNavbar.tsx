"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    importFileAction,
    importModel3DAction,
} from "@/src/actions/filesActions";
import { saveWorldAction } from "@/src/actions/sceneActions";
import { useUser } from "@/src/contexts/userContext";
import {
    useWorldHistoryValues,
    useWorldValues,
} from "@/src/contexts/worldContext";
import {
    updateCameraFar,
    updateCameraFOV,
    updateCameraNear,
    updateCameraType,
} from "@/src/core/ecs/engine/cameraEngine";
import {
    updateEnvironmentIntensity,
    updateEnvironmentMap,
} from "@/src/core/ecs/engine/environmentEngine";
import { createModel3D } from "@/src/core/ecs/engine/model3dEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import {
    getCameraFar,
    getCameraFOV,
    getCameraNear,
    getCameraType,
} from "@/src/core/ecs/queries/cameraQuery";
import { getEnvironmentIntensity } from "@/src/core/ecs/queries/environmentQuery";
import { downloadKuboFile, openKuboFile } from "@/src/core/kubo/kuboFile";
import { CameraType, ModelFileFormat } from "@/src/types";
import {
    Camera,
    Download,
    FolderOpen,
    LogOutIcon,
    Redo2,
    RotateCcw,
    Save,
    Undo2,
    Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export const DashboardNavbar = () => {
    const t = useTranslations("DashboardNavbar");
    const { user, logout } = useUser();
    const router = useRouter();
    const { world, snap } = useWorldValues();
    const { undo, redo, canUndo, canRedo } = useWorldHistoryValues();

    // Raccourcis clavier Ctrl+Z / Ctrl+Y
    const handleKeyboard = useCallback(
        (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                if (undo()) toast.success(t("undo_success"));
            }
            if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === "y" || (e.key === "z" && e.shiftKey))
            ) {
                e.preventDefault();
                if (redo()) toast.success(t("redo_success"));
            }
        },
        [undo, redo, t],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyboard);
        return () => window.removeEventListener("keydown", handleKeyboard);
    }, [handleKeyboard]);

    const handleReset = () => {
        createOrResetScene(world);
        toast.success(t("scene_reset_success"));
    };

    const handleSave = () => {
        try {
            saveWorldAction(user!.uid, world);
            toast.success(t("scene_saved_success"));
        } catch (error) {
            toast.error(t("scene_saved_error"));
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const handleImport3D = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".gltf,.glb";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Validation taille (200 Mo)
            if (file.size > 200 * 1024 * 1024) {
                toast.error(t("import_file_too_large"));
                return;
            }

            try {
                // 1. Upload du fichier vers GridFS via server action
                const formData = new FormData();
                formData.append("file", file);
                const result = await importModel3DAction(formData);

                // 2. Créer l'entité Model3D dans le World ECS
                const formatMap: Record<string, ModelFileFormat> = {
                    gltf: ModelFileFormat.GLTF,
                    glb: ModelFileFormat.GLB,
                };

                createModel3D(world, {
                    fileId: result.gridFsId,
                    format: formatMap[result.format],
                    name: result.filename,
                });

                toast.success(t("import_success"));
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : t("import_error");
                toast.error(message);
            }
        };
        input.click();
    };

    const handleExport = () => {
        try {
            downloadKuboFile(world);
            toast.success(t("export_success"));
        } catch {
            toast.error(t("export_error"));
        }
    };

    const handleImportScene = async () => {
        try {
            const importedWorld = await openKuboFile();
            if (!importedWorld) return; // annulé

            // Appliquer le World importé sur le proxy réactif
            world.camera = importedWorld.camera;
            world.environment = importedWorld.environment;
            world.lights = importedWorld.lights;
            world.materials = importedWorld.materials;
            world.models = importedWorld.models;
            world.names = importedWorld.names;
            world.transforms = importedWorld.transforms;
            world.textures = importedWorld.textures;

            toast.success(t("import_scene_success"));
        } catch (err) {
            const message =
                err instanceof Error ? err.message : t("import_scene_error");
            toast.error(message);
        }
    };

    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEnvironmentImageChange = () => {
        fileInputRef.current?.click();
    };

    const updateEnvironmentMapF = async (formData: FormData) => {
        const file = formData.get("file") as File;

        if (!file) return;

        if (file.size > 30 * 1024 * 1024) {
            toast.error(t("environment_image_too_large"));
            return;
        }

        try {
            const result = await importFileAction(formData);

            // 🔁 sync ECS client
            updateEnvironmentMap(world, result.gridFsId);

            toast.success(t("environment_image_updated"));
        } catch (error) {
            toast.error(t("environment_image_update_error"));
        }
    };

    return (
        <header className="fixed top-0 z-30 border-b bg-background backdrop-blur-sm w-full">
            <div className="mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 px-4"
                            >
                                <span className="font-semibold">
                                    {t("scene")}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2">
                            <DropdownMenuItem
                                onClick={handleImport3D}
                                className="flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                <span>{t("import")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleImportScene}
                                className="flex items-center gap-2"
                            >
                                <FolderOpen className="w-4 h-4" />
                                <span>{t("import_scene")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleExport}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>{t("export")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {/* Subdropdown Camera */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    <span>{t("camera")}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-64 p-3">
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs mb-1 block">
                                                {t("camera_type")}
                                            </Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    updateCameraType(
                                                        world,
                                                        value as CameraType,
                                                    );
                                                }}
                                                value={getCameraType(snap)}
                                            >
                                                <SelectTrigger className="w-full h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={
                                                            CameraType.PERSPECTIVE
                                                        }
                                                    >
                                                        {t(
                                                            "camera_perspective",
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={
                                                            CameraType.ORTHOGRAPHIC
                                                        }
                                                    >
                                                        {t(
                                                            "camera_orthographic",
                                                        )}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-1 block">
                                                {t("camera_fov")}:{" "}
                                                {getCameraFOV(snap)}°
                                            </Label>
                                            <input
                                                type="range"
                                                min={10}
                                                max={120}
                                                step={1}
                                                value={getCameraFOV(snap)}
                                                onChange={(e) =>
                                                    updateCameraFOV(
                                                        world,
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="w-full h-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-1 block">
                                                {t("camera_near")}:{" "}
                                                {getCameraNear(snap)}
                                            </Label>
                                            <input
                                                type="range"
                                                min={0.1}
                                                max={10}
                                                step={0.1}
                                                value={getCameraNear(snap)}
                                                onChange={(e) =>
                                                    updateCameraNear(
                                                        world,
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="w-full h-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-1 block">
                                                {t("camera_far")}:{" "}
                                                {getCameraFar(snap)}
                                            </Label>
                                            <input
                                                type="range"
                                                min={100}
                                                max={10000}
                                                step={100}
                                                value={getCameraFar(snap)}
                                                onChange={(e) =>
                                                    updateCameraFar(
                                                        world,
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="w-full h-2"
                                            />
                                        </div>
                                    </div>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Subdropdown Environnement */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="flex items-center gap-2">
                                    <span className="w-4 h-4">🌍</span>
                                    <span>{t("environment")}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-64 p-3">
                                    <div className="space-y-3">
                                        <div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={
                                                    handleEnvironmentImageChange
                                                }
                                                className="w-full"
                                            >
                                                {t("change_environment_image")}
                                            </Button>

                                            <form
                                                ref={formRef}
                                                action={async (formData) => {
                                                    await updateEnvironmentMapF(
                                                        formData,
                                                    );
                                                }}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    name="file"
                                                    accept="image/*,.hdr,.exr"
                                                    hidden
                                                    onChange={() =>
                                                        formRef.current?.requestSubmit()
                                                    }
                                                />
                                            </form>
                                        </div>
                                        <div>
                                            <Label className="text-xs mb-1 block">
                                                {t("environment_intensity")}:{" "}
                                                {getEnvironmentIntensity(
                                                    snap,
                                                ).toFixed(1)}
                                            </Label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={3}
                                                step={0.1}
                                                value={getEnvironmentIntensity(
                                                    snap,
                                                )}
                                                onChange={(e) =>
                                                    updateEnvironmentIntensity(
                                                        world,
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="w-full h-2"
                                            />
                                        </div>
                                    </div>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleSave}
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{t("save")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>{t("reset")}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (undo()) toast.success(t("undo_success"));
                        }}
                        title={`${t("undo")} (Ctrl+Z)`}
                    >
                        <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (redo()) toast.success(t("redo_success"));
                        }}
                        title={`${t("redo")} (Ctrl+Y)`}
                    >
                        <Redo2 className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex justify-center items-center">
                    <Avatar className="relative h-11 w-11 rounded-full border-2 border-primary shadow-md hover:scale-105 transition-transform duration-150">
                        <AvatarImage
                            src={user?.photoURL || "/avatar.png"}
                            alt={user?.displayName || "Avatar"}
                        />
                        <AvatarFallback>
                            {(user?.displayName || "U").charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="ml-4 flex flex-col justify-center">
                        <span className="font-medium">
                            {user?.displayName || t("user")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {user?.email || t("email_placeholder")}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        className="ml-6"
                        onClick={handleLogout}
                    >
                        <LogOutIcon />
                        <span className="sr-only">{t("logout")}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
