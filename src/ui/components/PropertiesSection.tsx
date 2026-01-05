import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransform } from "@/src/contexts/transformContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import {
    updatePosition,
    updateRotation,
    updateScale,
} from "@/src/core/ecs/engine/transformEngine";
import {
    getPosition,
    getRotation,
    getScale,
} from "@/src/core/ecs/queries/transformQuery";
import {
    isLightEntity,
    isModel3DEntity,
} from "@/src/core/ecs/queries/utilsQuery";
import { TablePropertiesIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const PropertiesSection = () => {
    const { world, snap } = useWorldValues();

    const { selectedObject } = useTransform();
    const [current, setCurrent] = useState<Entity | null>(null);

    useEffect(() => {
        if (selectedObject) {
            setCurrent(selectedObject);
        }
    }, [selectedObject]);

    if (!current) {
        return (
            <div>
                <h2 className="flex items-center py-4 text-lg font-semibold">
                    <TablePropertiesIcon className="w-4 h-4 mr-2 inline-block" />
                    Propriétés
                </h2>
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <p className="text-sm">No object selected</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <TablePropertiesIcon className="w-4 h-4 mr-2 inline-block" />
                Propriétés
            </h2>
            <div>
                <Tabs defaultValue="object" className="w-full px-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="object">Objet</TabsTrigger>
                        <TabsTrigger value="transform">
                            Transformation
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transform" className="space-y-4 mt-4">
                        {/* Position */}
                        {isLightEntity(world, current) ||
                            (isModel3DEntity(world, current) && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">
                                        Position
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">
                                                X
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={
                                                    getPosition(snap, current)
                                                        ?.x
                                                }
                                                onChange={(e) => {
                                                    updatePosition(
                                                        world,
                                                        current,
                                                        {
                                                            x: e.target
                                                                .valueAsNumber,
                                                        }
                                                    );
                                                }}
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">
                                                Y
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={
                                                    getPosition(snap, current)
                                                        ?.y
                                                }
                                                onChange={(e) => {
                                                    updatePosition(
                                                        world,
                                                        current,
                                                        {
                                                            y: e.target
                                                                .valueAsNumber,
                                                        }
                                                    );
                                                }}
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">
                                                Z
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={
                                                    getPosition(snap, current)
                                                        ?.z
                                                }
                                                onChange={(e) => {
                                                    updatePosition(
                                                        world,
                                                        current,
                                                        {
                                                            z: e.target
                                                                .valueAsNumber,
                                                        }
                                                    );
                                                }}
                                                className="h-8"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* Rotation */}
                        {isModel3DEntity(world, current) && (
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">
                                    Rotation
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            X
                                        </Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            value={
                                                getRotation(snap, current)?.x
                                            }
                                            onChange={(e) => {
                                                updateRotation(world, current, {
                                                    x: e.target.valueAsNumber,
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Y
                                        </Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            value={
                                                getRotation(snap, current)?.y
                                            }
                                            onChange={(e) => {
                                                updateRotation(world, current, {
                                                    y: e.target.valueAsNumber,
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Z
                                        </Label>
                                        <Input
                                            type="number"
                                            step="1"
                                            value={
                                                getRotation(snap, current)?.z
                                            }
                                            onChange={(e) => {
                                                updateRotation(world, current, {
                                                    z: e.target.valueAsNumber,
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scale */}
                        {isModel3DEntity(world, current) && (
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">
                                    Scale
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            X
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0.01"
                                            value={getScale(snap, current)?.x}
                                            onChange={(e) => {
                                                updateScale(world, current, {
                                                    x: e.target.valueAsNumber,
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Y
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0.01"
                                            value={getScale(snap, current)?.y}
                                            onChange={(e) => {
                                                updateScale(world, current, {
                                                    y: e.target.valueAsNumber,
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Z
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0.01"
                                            value={getScale(snap, current)?.z}
                                            onChange={(e) => {
                                                updateScale(world, current, {
                                                    z: e.target.valueAsNumber,
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="object" className="mt-4">
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <p className="text-sm">
                                Object properties coming soon...
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
