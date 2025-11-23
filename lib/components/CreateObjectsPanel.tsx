"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Box, Circle, Cylinder, Square } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateObjectsPanelProps {
    onCreateCube: () => void;
    onCreateSphere: () => void;
    onCreateCylinder: () => void;
    onCreatePlane: () => void;
}

export const CreateObjectsPanel = ({
    onCreateCube,
    onCreateSphere,
    onCreateCylinder,
    onCreatePlane,
}: CreateObjectsPanelProps) => {
    const t = useTranslations("Dashboard");

    return (
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
                                onClick={onCreateCube}
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
                                onClick={onCreateSphere}
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
                                onClick={onCreateCylinder}
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
                                onClick={onCreatePlane}
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
    );
};
