"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScene } from "@/lib/contexts/SceneContext";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransform } from "../contexts/TransformContext";

export const SceneHierarchy = () => {
    const t = useTranslations("Dashboard");
    const { scene, isLoading, updateScene } = useScene();
    const { selectedObject, setSelectedObject } = useTransform();

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
                                            setSelectedObject(`light-${idx}`)
                                        }
                                    >
                                        💡 {light.name || `Light ${idx + 1}`}
                                    </li>
                                ))}
                                {scene.models3d.map((model, idx) => (
                                    <li
                                        key={`model-${idx}`}
                                        className="cursor-pointer hover:text-primary text-sm"
                                        onClick={() => {
                                            console.log(
                                                "Hierarchy click on model:",
                                                model.id,
                                                model.name
                                            );
                                            setSelectedObject(model.id || null);
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            {" "}
                                            🎨{" "}
                                            {model.name || `Model ${idx + 1}`}
                                            <TrashIcon
                                                className="w-4 h-auto"
                                                onClick={async (e) => {
                                                    e.stopPropagation(); // Prevent selecting the model
                                                    console.log(
                                                        "Deleting model:",
                                                        model.id,
                                                        model.name
                                                    );
                                                    // Deselect FIRST if the deleted model was selected
                                                    if (
                                                        selectedObject ===
                                                        model.id
                                                    ) {
                                                        setSelectedObject(null);
                                                        // Wait for React to process the state change
                                                        await new Promise(
                                                            (resolve) =>
                                                                setTimeout(
                                                                    resolve,
                                                                    0
                                                                )
                                                        );
                                                    }
                                                    if (model.id) {
                                                        console.log(
                                                            "Calling updateScene to remove model"
                                                        );
                                                        updateScene(() => {
                                                            if (
                                                                selectedObject ===
                                                                model.id
                                                            ) {
                                                                setSelectedObject(
                                                                    null
                                                                );
                                                            }
                                                            scene.removeModel(
                                                                model.id
                                                            );
                                                            console.log(
                                                                "Model removed, new models3d length:",
                                                                scene.models3d
                                                                    .length
                                                            );
                                                        });
                                                    } else {
                                                        console.log(
                                                            "Model has no id, cannot remove"
                                                        );
                                                    }
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
