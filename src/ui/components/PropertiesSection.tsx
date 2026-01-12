import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransform } from "@/src/contexts/transformContext";
import { useWorldValues } from "@/src/contexts/worldContext";
import { Entity } from "@/src/core/ecs/components/indexComponent";
import {
  updateLightColor,
  updateLightIntensity,
  updateLightRange,
  updateLightType,
} from "@/src/core/ecs/engine/lightEngine";
import { updateName } from "@/src/core/ecs/engine/nameEngine";
import {
  updatePosition,
  updateRotation,
  updateScale,
} from "@/src/core/ecs/engine/transformEngine";
import {
  getLightColor,
  getLightIntensity,
  getLightRange,
  getLightType,
} from "@/src/core/ecs/queries/lightQuery";
import { getName } from "@/src/core/ecs/queries/nameQuery";
import {
  getPosition,
  getRotation,
  getScale,
} from "@/src/core/ecs/queries/transformQuery";
import {
  isLightEntity,
  isModel3DEntity,
} from "@/src/core/ecs/queries/utilsQuery";
import { LightType } from "@/src/types";
import { hexToRgb, rgbToHex } from "@/src/utils";
import { TablePropertiesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const PropertiesSection = () => {
  const t = useTranslations("PropertiesSection");
  const { world, snap } = useWorldValues();

  const { selectedObject } = useTransform();
  // Utiliser directement selectedObject au lieu d'un état dérivé
  const current = selectedObject;

  if (!current) {
    return (
      <div>
        <h2 className="flex items-center py-4 text-lg font-semibold">
          <TablePropertiesIcon className="w-4 h-4 mr-2 inline-block" />
          {t("properties")}
        </h2>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <p className="text-sm">{t("no_object_selected")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="flex items-center py-4 text-lg font-semibold">
        <TablePropertiesIcon className="w-4 h-4 mr-2 inline-block" />
        {t("properties")}
      </h2>
      <div>
        <Tabs defaultValue="object" className="w-full px-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="object">{t("object")}</TabsTrigger>
            <TabsTrigger value="transform">{t("transform")}</TabsTrigger>
          </TabsList>

          <TabsContent value="transform" className="space-y-4 mt-4">
            {/* Position */}
            {isLightEntity(world, current) ||
              (isModel3DEntity(world, current) && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">
                    {t("position")}
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {t("x")}
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={getPosition(snap, current)?.x}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (!isNaN(value)) {
                            updatePosition(world, current, {
                              x: value,
                            });
                          }
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {t("y")}
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={getPosition(snap, current)?.y}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (!isNaN(value)) {
                            updatePosition(world, current, {
                              y: value,
                            });
                          }
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {t("z")}
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={getPosition(snap, current)?.z}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (!isNaN(value)) {
                            updatePosition(world, current, {
                              z: value,
                            });
                          }
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
                <Label className="text-xs font-semibold">{t("rotation")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {t("x")}
                    </Label>
                    <Input
                      type="number"
                      step="1"
                      value={getRotation(snap, current)?.x}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (!isNaN(value)) {
                          updateRotation(world, current, {
                            x: value,
                          });
                        }
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {t("y")}
                    </Label>
                    <Input
                      type="number"
                      step="1"
                      value={getRotation(snap, current)?.y}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (!isNaN(value)) {
                          updateRotation(world, current, {
                            y: value,
                          });
                        }
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {t("z")}
                    </Label>
                    <Input
                      type="number"
                      step="1"
                      value={getRotation(snap, current)?.z}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (!isNaN(value)) {
                          updateRotation(world, current, {
                            z: value,
                          });
                        }
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
                <Label className="text-xs font-semibold">{t("scale")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {t("x")}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={getScale(snap, current)?.x}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (!isNaN(value)) {
                          updateScale(world, current, {
                            x: value,
                          });
                        }
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {t("y")}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={getScale(snap, current)?.y}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (!isNaN(value)) {
                          updateScale(world, current, {
                            y: value,
                          });
                        }
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {t("z")}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={getScale(snap, current)?.z}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (!isNaN(value)) {
                          updateScale(world, current, {
                            z: value,
                          });
                        }
                      }}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="object" className="space-y-4 mt-4">
            {/* Name - Pour tous les objets */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">{t("name")}</Label>
              <Input
                type="text"
                value={getName(snap, current) || ""}
                onChange={(e) => {
                  updateName(world, current, e.target.value);
                }}
                className="h-8"
                placeholder={t("name_placeholder")}
              />
            </div>

            {/* Propriétés spécifiques aux lumières */}
            {isLightEntity(world, current) && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">
                    {t("light_type")}
                  </Label>
                  <Select
                    value={getLightType(snap, current) || LightType.POINT}
                    onValueChange={(value) => {
                      updateLightType(world, current, value as LightType);
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Type de lumière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LightType.POINT}>
                        {t("point")}
                      </SelectItem>
                      <SelectItem value={LightType.DIRECTIONAL}>
                        {t("directional")}
                      </SelectItem>
                      <SelectItem value={LightType.SPOT}>
                        {t("spot")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">
                    {t("intensity")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={getLightIntensity(snap, current) || 1}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      if (!isNaN(value)) {
                        updateLightIntensity(world, current, value);
                      }
                    }}
                    className="h-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{t("range")}</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    value={getLightRange(snap, current) || 10}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      if (!isNaN(value)) {
                        updateLightRange(world, current, value);
                      }
                    }}
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">{t("color")}</Label>
                  <Input
                    type="color"
                    value={rgbToHex(
                      getLightColor(snap, current) || {
                        r: 255,
                        g: 255,
                        b: 255,
                      }
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      const color = hexToRgb(value);
                      if (color) {
                        updateLightColor(world, current, color);
                      }
                    }}
                    className="h-8 w-16 p-0 border-0"
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
