"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { useTranslations } from "next-intl";
import { useRef } from "react";

interface DashboardNavbarProps {
    userName?: string;
    userAvatar?: string;
    onImport: () => void;
    onExport: () => void;
    onReset: () => void;
    onSave: () => void;
    onLogout: () => void;
    onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
    cameraType: "perspective" | "orthographic";
    onCameraTypeChange: (value: string) => void;
    globalLightIntensity: number;
    onGlobalLightChange: (value: number) => void;
}

export const DashboardNavbar = ({
    userName,
    userAvatar,
    onImport,
    onExport,
    onReset,
    onSave,
    onLogout,
    onFileSelected,
    cameraType,
    onCameraTypeChange,
    globalLightIntensity,
    onGlobalLightChange,
}: DashboardNavbarProps) => {
    const t = useTranslations("Dashboard");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <header className="sticky top-0 z-30 border-b bg-background/60 backdrop-blur-sm">
            <button onClick={onLogout}>Logout</button>
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
                                                onClick={handleImportClick}
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
                                                onClick={onExport}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {t("export")}
                                            </Button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={onReset}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                {t("reset")}
                                            </Button>
                                            <Button
                                                onClick={onSave}
                                                variant="default"
                                                size="sm"
                                            >
                                                {t("save")}
                                            </Button>
                                        </div>

                                        <div className="pt-2">
                                            <Label>{t("camera_type")}</Label>
                                            <Select
                                                onValueChange={
                                                    onCameraTypeChange
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
                                            <Label>{t("global_light")}</Label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={2}
                                                step={0.1}
                                                value={globalLightIntensity}
                                                onChange={(e) =>
                                                    onGlobalLightChange(
                                                        Number(e.target.value)
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
                        {userName || "Utilisateur"}
                    </div>
                    <Avatar>
                        <AvatarImage
                            src={userAvatar || "/avatar.png"}
                            alt={userName || "Avatar"}
                        />
                        <AvatarFallback>
                            {(userName || "U").charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
};
