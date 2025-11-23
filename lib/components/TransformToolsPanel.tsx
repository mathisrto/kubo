"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Maximize2, MousePointer2, Move, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface TransformToolsPanelProps {
    onSelectTool: () => void;
    onTranslateTool: () => void;
    onRotateTool: () => void;
    onScaleTool: () => void;
}

export const TransformToolsPanel = ({
    onSelectTool,
    onTranslateTool,
    onRotateTool,
    onScaleTool,
}: TransformToolsPanelProps) => {
    const t = useTranslations("Dashboard");

    return (
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
                                onClick={onSelectTool}
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
                                onClick={onTranslateTool}
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
                                onClick={onRotateTool}
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
                                onClick={onScaleTool}
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
    );
};
