"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scene } from "@/lib/class/Scene";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface SceneHierarchyProps {
    scene: Scene | null;
    isLoading: boolean;
    selectedObject: string | null;
    onSelectObject: (objId: string | null) => void;
    updateScene: () => void;
}

export const SceneHierarchy = ({
    scene,
    isLoading,
    selectedObject,
    onSelectObject,
    updateScene,
}: SceneHierarchyProps) => {
    const t = useTranslations("Dashboard");

    return (
        <Card className="h-full overflow-auto">
            <CardHeader>
                <CardTitle>{t("hierarchy")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="text-sm text-muted-foreground">
                        Chargement...
                    </div>
                ) : scene ? (
                    <div className="space-y-2">
                        <div className="rounded border p-2">
                            <div className="font-semibold mb-2">Scene</div>
                            <ul className="space-y-1 ml-4">
                                {scene.lights.map((light, idx) => (
                                    <li
                                        key={`light-${idx}`}
                                        className="cursor-pointer hover:text-primary text-sm"
                                        onClick={() =>
                                            onSelectObject(`light-${idx}`)
                                        }
                                    >
                                        💡 {light.name || `Light ${idx + 1}`}
                                    </li>
                                ))}
                                {scene.objects.map((obj, idx) => (
                                    <li
                                        key={`obj-${idx}`}
                                        className="cursor-pointer hover:text-primary text-sm"
                                        onClick={() => onSelectObject(obj.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            {" "}
                                            📦 {obj.name || `Object ${idx + 1}`}
                                            <TrashIcon
                                                className="w-4 h-auto"
                                                onClick={async (e) => {
                                                    e.stopPropagation(); // Prevent selecting the object
                                                    // Deselect FIRST if the deleted object was selected
                                                    if (
                                                        selectedObject ===
                                                        obj.id
                                                    ) {
                                                        onSelectObject(null);
                                                        // Wait for React to process the state change
                                                        await new Promise(
                                                            (resolve) =>
                                                                setTimeout(
                                                                    resolve,
                                                                    0
                                                                )
                                                        );
                                                    }
                                                    scene.removeObject(obj.id);
                                                    scene.save();
                                                    updateScene();
                                                }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Aucune scène
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
