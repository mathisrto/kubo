import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTransform } from "@/src/contexts/transformContext";
import { TRANSFORM_MODES } from "@/src/types";
import {
    Maximize2Icon,
    MousePointerIcon,
    MoveIcon,
    RotateCwIcon,
    ToolCaseIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const TransformToolsSection = () => {
    const t = useTranslations("TransformToolsSection");

    const { transformMode, setTransformMode } = useTransform();

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <ToolCaseIcon className="w-4 h-4 mr-2 inline-block" />
                {t("transformation")}
            </h2>
            <div>
                <div className="flex justify-center items-center gap-8">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={
                                    transformMode === null
                                        ? "default"
                                        : "outline"
                                }
                                size="icon"
                                onClick={() => setTransformMode(null)}
                            >
                                <MousePointerIcon className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("select_tool")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={
                                    transformMode === TRANSFORM_MODES.TRANSLATE
                                        ? "default"
                                        : "outline"
                                }
                                size="icon"
                                onClick={() =>
                                    setTransformMode(TRANSFORM_MODES.TRANSLATE)
                                }
                            >
                                <MoveIcon className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("translate_tool")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={
                                    transformMode === TRANSFORM_MODES.ROTATE
                                        ? "default"
                                        : "outline"
                                }
                                size="icon"
                                onClick={() =>
                                    setTransformMode(TRANSFORM_MODES.ROTATE)
                                }
                            >
                                <RotateCwIcon className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("rotate_tool")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={
                                    transformMode === TRANSFORM_MODES.SCALE
                                        ? "default"
                                        : "outline"
                                }
                                size="icon"
                                onClick={() =>
                                    setTransformMode(TRANSFORM_MODES.SCALE)
                                }
                            >
                                <Maximize2Icon className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t("scale_tool")}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
