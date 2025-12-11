"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "next-intl";

interface ObjectPropertiesProps {
    selectedObject: string | null;
}

export const ObjectProperties = ({ selectedObject }: ObjectPropertiesProps) => {
    const t = useTranslations("Dashboard");

    if (!selectedObject) return null;

    return (
        <>
            <div className="mb-4 flex-col space-y-2">
                <Label>{t("position")}</Label>
                <div className="flex gap-2">
                    <span>
                        X:
                        <Input
                            type="number"
                            defaultValue={0}
                            size={5}
                            min={-100}
                            max={100}
                        />
                    </span>
                    <span>
                        Y:
                        <Input
                            type="number"
                            defaultValue={0}
                            size={5}
                            min={-100}
                            max={100}
                        />
                    </span>
                    <span>
                        Z:
                        <Input
                            type="number"
                            defaultValue={0}
                            size={5}
                            min={-100}
                            max={100}
                        />
                    </span>
                </div>
            </div>

            <div>
                <Label>{t("rotation")}</Label>
                <div className="flex gap-2">
                    <span>
                        X:
                        <Slider defaultValue={[0]} step={1} min={0} max={360} />
                    </span>
                    <span>
                        Y:
                        <Slider defaultValue={[0]} step={1} min={0} max={360} />
                    </span>
                    <span>
                        Z:
                        <Slider defaultValue={[0]} step={1} min={0} max={360} />
                    </span>
                </div>
            </div>

            <div>
                <Label>{t("scale")}</Label>
                <div className="flex gap-2">
                    <span>
                        X:
                        <Input
                            type="number"
                            defaultValue={1}
                            size={5}
                            min={0.1}
                            max={10}
                        />
                    </span>
                    <span>
                        Y:
                        <Input
                            type="number"
                            defaultValue={1}
                            size={5}
                            min={0.1}
                            max={10}
                        />
                    </span>
                    <span>
                        Z:
                        <Input
                            type="number"
                            defaultValue={1}
                            size={5}
                            min={0.1}
                            max={10}
                        />
                    </span>
                </div>
            </div>
        </>
    );
};
