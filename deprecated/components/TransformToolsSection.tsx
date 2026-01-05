import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Maximize2Icon,
    MousePointerIcon,
    MoveIcon,
    RotateCwIcon,
    ToolCaseIcon,
} from "lucide-react";
import { TRANSFORM_MODES } from "../constants";
import { useTransform } from "../contexts/TransformContext";

export const TransformToolsSection = () => {
    const { transformMode, setTransformMode } = useTransform();

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <ToolCaseIcon className="w-4 h-4 mr-2 inline-block" />
                Transformation
            </h2>
            <div>
                <div className="grid grid-cols-4 gap-2 px-2">
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
                            <p>Sélection</p>
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
                            <p>Translation</p>
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
                            <p>Rotation</p>
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
                            <p>Échelle</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
