import { Button } from "@/components/ui/button";
import { Grid2X2CheckIcon, LightbulbIcon, TrashIcon } from "lucide-react";
import { Light } from "../class/Light";
import { Model3D } from "../class/Model3D";
import { OBJECT_TYPES } from "../constants";
import { useScene } from "../contexts/SceneContext";
import { useTransform } from "../contexts/TransformContext";

type HierarchyItemProps = {
    obj: Light | Model3D;
    type: OBJECT_TYPES;
};

const HierarchyItem: React.FC<HierarchyItemProps> = ({ obj, type }) => {
    const { scene, updateScene } = useScene();
    const { selectedObject, setSelectedObject } = useTransform();

    if (!obj.id) return null;
    if (!scene) return null;

    return (
        <div key={obj.id} className="flex items-center w-full group/item mb-1">
            <button
                className={`w-full flex items-center px-2 py-1 rounded ${
                    selectedObject?.id === obj.id ? "bg-accent" : ""
                }`}
                onClick={() => {
                    if (obj.id) setSelectedObject({ id: obj.id, type: type });
                }}
            >
                <LightbulbIcon className="w-4 h-4 mr-2 inline-block" />
                <span className="ml-2">
                    {obj.name ||
                        (type === OBJECT_TYPES.LIGHT
                            ? `Light`
                            : type === OBJECT_TYPES.MODEL
                            ? `Model`
                            : "")}
                </span>
            </button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity"
                onClick={async (e) => {
                    e.stopPropagation();
                    if (selectedObject === obj.id) {
                        setSelectedObject(null);
                        await new Promise((resolve) => setTimeout(resolve, 0));
                    }
                    if (obj.id) {
                        updateScene(() => {
                            type === OBJECT_TYPES.LIGHT
                                ? scene.removeLight(obj.id)
                                : type === OBJECT_TYPES.MODEL
                                ? scene.removeModel(obj.id)
                                : null;
                        });
                    }
                }}
            >
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    );
};

export const HierarchySection = () => {
    const { scene } = useScene();

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <Grid2X2CheckIcon className="w-4 h-4 mr-2 inline-block" />
                Scène
            </h2>
            <div>
                <div className="mb-2 text-sm text-muted-foreground">
                    {!scene ||
                        (scene?.lights.length === 0 &&
                            scene?.models3d.length === 0 && (
                                <p>Aucun objet dans la scène.</p>
                            ))}
                    {scene?.lights.map((light, idx) => (
                        <HierarchyItem
                            key={light.id || idx}
                            obj={light}
                            type={OBJECT_TYPES.LIGHT}
                        />
                    ))}
                    {scene?.models3d.map((model, idx) => (
                        <HierarchyItem
                            key={model.id || idx}
                            obj={model}
                            type={OBJECT_TYPES.MODEL}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
