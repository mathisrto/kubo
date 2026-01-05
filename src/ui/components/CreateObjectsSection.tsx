import { Button } from "@/components/ui/button";
import { useWorldValues } from "@/src/contexts/worldContext";
import { createLight } from "@/src/core/ecs/engine/lightEngine";
import {
    createCube,
    createCylinder,
    createPlane,
    createSphere,
} from "@/src/core/ecs/factories/objects";
import { LightType } from "@/src/types";
import {
    BoxIcon,
    CircleIcon,
    CircleStarIcon,
    CylinderIcon,
    LightbulbIcon,
    SquareIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const CreateObjectsSection = () => {
    const t = useTranslations("Dashboard");
    const { world } = useWorldValues();

    if (!world) {
        return null;
    }

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <CircleStarIcon className="w-4 h-4 mr-2 inline-block" />
                Création d'objets
            </h2>
            <div>
                <div className="grid grid-cols-2 gap-2 px-2">
                    <Button
                        variant="outline"
                        className="flex flex-col h-20"
                        onClick={() => createCube(world)}
                    >
                        <BoxIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{t("create_cube")}</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-20"
                        onClick={() => createSphere(world)}
                    >
                        <CircleIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{t("create_sphere")}</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-20"
                        onClick={() => createCylinder(world)}
                    >
                        <CylinderIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{t("create_cylinder")}</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-20"
                        onClick={() => createPlane(world)}
                    >
                        <SquareIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{t("create_plane")}</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-20"
                        onClick={() =>
                            createLight(world, {
                                name: "Light",
                                type: LightType.POINT,
                            })
                        }
                    >
                        <span className="w-6 h-6 mb-1 flex items-center justify-center">
                            <LightbulbIcon className="w-5 h-5" />
                        </span>
                        <span className="text-xs">Créer une lumière</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
