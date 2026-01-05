import { Button } from "@/components/ui/button";
import { useTransform } from "@/src/contexts/transformContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import { removeEntity } from "@/src/core/ecs/engine/utilsEngine";
import { getLights } from "@/src/core/ecs/queries/lightQuery";
import { getModels3D } from "@/src/core/ecs/queries/model3dQuery";
import { getName } from "@/src/core/ecs/queries/nameQuery";
import { OBJECT_TYPES } from "@/src/types";
import { Grid2X2CheckIcon, LightbulbIcon, TrashIcon } from "lucide-react";

type HierarchyItemProps = {
    obj: Entity;
    type: OBJECT_TYPES;
};

const HierarchyItem: React.FC<HierarchyItemProps> = ({ obj, type }) => {
    const { world, snap } = useWorldValues();

    const { selectedObject, setSelectedObject } = useTransform();

    if (!obj) return null;

    return (
        <div key={obj} className="flex items-center w-full group/item mb-1">
            <button
                className={`w-full flex items-center px-2 py-1 rounded ${
                    selectedObject === obj ? "bg-accent" : ""
                }`}
                onClick={() => {
                    if (obj) setSelectedObject(obj);
                }}
            >
                <LightbulbIcon className="w-4 h-4 mr-2 inline-block" />
                <span className="ml-2">
                    {getName(snap, obj) ||
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
                    if (selectedObject === obj) {
                        setSelectedObject(null);
                    }
                    if (obj) {
                        removeEntity(world, obj);
                    }
                }}
            >
                <TrashIcon className="w-4 h-4" />
            </Button>
        </div>
    );
};

export const HierarchySection = () => {
    const { snap } = useWorldValues();

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <Grid2X2CheckIcon className="w-4 h-4 mr-2 inline-block" />
                Scène
            </h2>
            <div>
                <div className="mb-2 text-sm text-muted-foreground">
                    {getLights(snap).length === 0 &&
                        getModels3D(snap).length === 0 && (
                            <p>Aucun objet dans la scène.</p>
                        )}
                    {getLights(snap).map((light, idx) => (
                        <HierarchyItem
                            key={light || idx}
                            obj={light}
                            type={OBJECT_TYPES.LIGHT}
                        />
                    ))}
                    {getModels3D(snap).map((model, idx) => (
                        <HierarchyItem
                            key={model || idx}
                            obj={model}
                            type={OBJECT_TYPES.MODEL}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
