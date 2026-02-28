"use client";

import { Button } from "@/components/ui/button";
import { useViewMode } from "@/src/contexts/viewModeContext";
import { ViewMode } from "@/src/types";
import { Box, CircleDot, Eye, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

const VIEW_MODES = [
    {
        mode: ViewMode.WIREFRAME,
        icon: Box,
        labelKey: "wireframe" as const,
        descKey: "wireframe_desc" as const,
    },
    {
        mode: ViewMode.SOLID,
        icon: CircleDot,
        labelKey: "solid" as const,
        descKey: "solid_desc" as const,
    },
    {
        mode: ViewMode.MATERIAL,
        icon: Lightbulb,
        labelKey: "material" as const,
        descKey: "material_desc" as const,
    },
    {
        mode: ViewMode.RENDERED,
        icon: Eye,
        labelKey: "rendered" as const,
        descKey: "rendered_desc" as const,
    },
];

export const ViewModeSection = () => {
    const t = useTranslations("ViewModeSection");
    const { viewMode, setViewMode } = useViewMode();

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <Eye className="w-4 h-4 mr-2 inline-block" />
                {t("title")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
                {VIEW_MODES.map(({ mode, icon: Icon, labelKey, descKey }) => (
                    <Button
                        key={mode}
                        variant={viewMode === mode ? "default" : "outline"}
                        className="flex flex-col items-center gap-1 h-auto py-3 px-2"
                        onClick={() => setViewMode(mode)}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">
                            {t(labelKey)}
                        </span>
                        <span className="text-[10px] opacity-70 leading-tight text-center">
                            {t(descKey)}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
};
