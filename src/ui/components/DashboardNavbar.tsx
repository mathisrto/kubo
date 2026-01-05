"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { saveWorldAction } from "@/src/actions/sceneActions";
import { useUser } from "@/src/contexts/userContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import { updateCameraType } from "@/src/core/ecs/engine/cameraEngine";
import { updateEnvironmentIntensity } from "@/src/core/ecs/engine/environmentEngine";
import { createOrResetScene } from "@/src/core/ecs/engine/utilsEngine";
import { getCameraType } from "@/src/core/ecs/queries/cameraQuery";
import { getEnvironmentIntensity } from "@/src/core/ecs/queries/environmentQuery";
import { CameraType } from "@/src/types";
import { Container, LogOutIcon, RotateCcw, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DashboardNavbar = () => {
    const t = useTranslations("Dashboard");
    const { user, logout } = useUser();
    const router = useRouter();
    const { world, snap } = useWorldValues();

    const handleReset = () => {
        createOrResetScene(world);
        toast.success(t("scene_reset_success"));
    };

    const handleSave = () => {
        saveWorldAction(user!.uid, world);
        toast.success(t("scene_saved_success"));
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
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
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>{t("reset")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleSave}
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{t("save")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {}}
                                className="flex items-center gap-2"
                            >
                                <Container className="w-4 h-4" />
                                <span>{t("edit_environment")}</span>
                            </DropdownMenuItem>
                            <div className="px-2 py-1">
                                <Label className="mb-1 block">
                                    {t("environment_intensity")}
                                    {getEnvironmentIntensity(snap)}
                                </Label>
                                <input
                                    type="range"
                                    min={0}
                                    max={3}
                                    step={0.1}
                                    value={getEnvironmentIntensity(snap)}
                                    onChange={(e) =>
                                        updateEnvironmentIntensity(
                                            world,
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="px-2 py-1">
                                <Label className="mb-1 block">
                                    {t("camera_type")}
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        updateCameraType(
                                            world,
                                            value as CameraType
                                        );
                                    }}
                                    value={getCameraType(snap)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={t("camera_type")}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value={CameraType.PERSPECTIVE}
                                        >
                                            {t("camera_perspective")}
                                        </SelectItem>
                                        <SelectItem
                                            value={CameraType.ORTHOGRAPHIC}
                                        >
                                            {t("camera_orthographic")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
