import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePropertiesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Light } from "../class/Light";
import { Model3D } from "../class/Model3D";
import { OBJECT_TYPES } from "../constants";
import { useScene } from "../contexts/SceneContext";
import { useTransform } from "../contexts/TransformContext";

export const PropertiesSection = () => {
    const { scene, updateScene } = useScene();
    const { selectedObject } = useTransform();
    const [current, setCurrent] = useState<Light | Model3D | null>(null);

    useEffect(() => {
        if (selectedObject) {
            if (selectedObject.type === OBJECT_TYPES.LIGHT) {
                const light =
                    scene?.lights.find((l) => l.id === selectedObject.id) ||
                    null;
                setCurrent(light);
            } else if (selectedObject.type === OBJECT_TYPES.MODEL) {
                const model =
                    scene?.models3d.find((m) => m.id === selectedObject.id) ||
                    null;
                setCurrent(model);
            }
        }
    }, [selectedObject, scene]);

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
                        {current instanceof Light ||
                            (current instanceof Model3D && (
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
                                                value={current.position.x}
                                                onChange={(e) => {
                                                    updateScene(() => {
                                                        current.position.x =
                                                            e.target.valueAsNumber;
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
                                                value={current.position.y}
                                                onChange={(e) => {
                                                    updateScene(() => {
                                                        current.position.y =
                                                            e.target.valueAsNumber;
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
                                                value={current.position.z}
                                                onChange={(e) => {
                                                    updateScene(() => {
                                                        current.position.z =
                                                            e.target.valueAsNumber;
                                                    });
                                                }}
                                                className="h-8"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* Rotation */}
                        {current instanceof Model3D && (
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
                                            value={current.rotation.x}
                                            onChange={(e) => {
                                                updateScene(() => {
                                                    current.rotation.x =
                                                        e.target.valueAsNumber;
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
                                            value={current.rotation.y}
                                            onChange={(e) => {
                                                updateScene(() => {
                                                    current.rotation.y =
                                                        e.target.valueAsNumber;
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
                                            value={current.rotation.z}
                                            onChange={(e) => {
                                                updateScene(() => {
                                                    current.rotation.z =
                                                        e.target.valueAsNumber;
                                                });
                                            }}
                                            className="h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scale */}
                        {current instanceof Model3D && (
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
                                            value={current.scale.x}
                                            onChange={(e) => {
                                                updateScene(() => {
                                                    current.scale.x =
                                                        e.target.valueAsNumber;
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
                                            value={current.scale.y}
                                            onChange={(e) => {
                                                updateScene(() => {
                                                    current.scale.y =
                                                        e.target.valueAsNumber;
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
                                            value={current.scale.z}
                                            onChange={(e) => {
                                                updateScene(() => {
                                                    current.scale.z =
                                                        e.target.valueAsNumber;
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
