"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTransform } from "@/src/contexts/transformContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import {
    playModel3DAnimation,
    stopModel3DAnimation,
    toggleModel3DAnimation,
} from "@/src/core/ecs/engine/model3dEngine";
import {
    getModel3DAnimation,
    getModel3DAnimationAvailable,
    getModel3DAnimationCurrent,
    getModel3DAnimationPlaying,
} from "@/src/core/ecs/queries/model3dQuery";
import { Pause, Play, Square } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Panneau de contrôle des animations.
 * Apparaît en bas de la scène quand un objet sélectionné possède des animations.
 */
export function AnimationControlPanel() {
    const t = useTranslations("AnimationPanel");
    const { world, snap } = useWorldValues();
    const { selectedObject } = useTransform();

    // Pas d'objet sélectionné → rien à afficher
    if (!selectedObject) return null;

    const animation = getModel3DAnimation(snap, selectedObject);

    // L'objet n'a pas d'animations → rien à afficher
    if (!animation || animation.available.length === 0) return null;

    const availableAnims = getModel3DAnimationAvailable(snap, selectedObject);
    const currentAnim = getModel3DAnimationCurrent(snap, selectedObject);
    const isPlaying = getModel3DAnimationPlaying(snap, selectedObject);

    const handlePlay = () => {
        if (currentAnim) {
            playModel3DAnimation(world, selectedObject, currentAnim);
        } else if (availableAnims.length > 0) {
            playModel3DAnimation(world, selectedObject, availableAnims[0]);
        }
    };

    const handleToggle = () => {
        toggleModel3DAnimation(world, selectedObject);
    };

    const handleStop = () => {
        stopModel3DAnimation(world, selectedObject);
    };

    const handleAnimationChange = (animName: string) => {
        playModel3DAnimation(world, selectedObject, animName);
    };

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
                {/* Sélecteur d'animation */}
                {availableAnims.length > 1 && (
                    <Select
                        value={currentAnim ?? undefined}
                        onValueChange={handleAnimationChange}
                    >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder={t("select_animation")} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableAnims.map((name) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Nom de l'animation (si une seule) */}
                {availableAnims.length === 1 && (
                    <span className="text-xs text-muted-foreground px-2 max-w-[180px] truncate">
                        {availableAnims[0]}
                    </span>
                )}

                {/* Bouton Play / Pause */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={isPlaying ? handleToggle : handlePlay}
                    title={isPlaying ? t("pause") : t("play")}
                >
                    {isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </Button>

                {/* Bouton Stop */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleStop}
                    title={t("stop")}
                    disabled={!isPlaying}
                >
                    <Square className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
