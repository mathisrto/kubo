import { Button } from "@/components/ui/button";
import { useTransform } from "@/src/contexts/transformContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import { removeEntity } from "@/src/core/ecs/engine/utilsEngine";
import { getLights } from "@/src/core/ecs/queries/lightQuery";
import { getModels3D } from "@/src/core/ecs/queries/model3dQuery";
import { getName } from "@/src/core/ecs/queries/nameQuery";
import { OBJECT_TYPES } from "@/src/types";
import {
    BoxIcon,
    Grid2X2CheckIcon,
    LightbulbIcon,
    TrashIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

type HierarchyItemProps = {
    obj: Entity;
    type: OBJECT_TYPES;
};

const HierarchyItem: React.FC<HierarchyItemProps> = ({ obj, type }) => {
    const t = useTranslations("HierarchySection");

    const OBJECT_TYPE_CONFIG = {
        [OBJECT_TYPES.LIGHT]: {
            icon: LightbulbIcon,
            defaultName: t("light"),
        },
        [OBJECT_TYPES.MODEL]: {
            icon: BoxIcon,
            defaultName: t("model"),
        },
    } as const;

    const { world, snap } = useWorldValues();

    const { selectedObject, setSelectedObject } = useTransform();

    if (!obj) return null;

    const config = OBJECT_TYPE_CONFIG[type];
    const Icon = config?.icon || BoxIcon;
    const defaultName = config?.defaultName || t("default_name");

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
                <Icon className="w-4 h-4 mr-2 inline-block" />
                <span className="ml-2">
                    {getName(snap, obj) || defaultName}
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
    const t = useTranslations("HierarchySection");
    const { snap } = useWorldValues();

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <Grid2X2CheckIcon className="w-4 h-4 mr-2 inline-block" />
                {t("scene_hierarchy")}
            </h2>
            <div>
                <div className="mb-2 text-sm text-muted-foreground">
                    {getLights(snap).length === 0 &&
                        getModels3D(snap).length === 0 && (
                            <p>{t("no_objects")}</p>
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
