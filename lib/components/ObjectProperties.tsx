"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface ObjectPropertiesProps {
    selectedObject: string | null;
}

export const ObjectProperties = ({ selectedObject }: ObjectPropertiesProps) => {
    const t = useTranslations("Dashboard");

    if (!selectedObject) return null;

    return (
        <>
            <div>
                <Label>{t("position")}</Label>
                <div className="flex gap-2">
                    <Input placeholder="x" size={5} />
                    <Input placeholder="y" size={5} />
                    <Input placeholder="z" size={5} />
                </div>
            </div>

            <div>
                <Label>{t("rotation")}</Label>
                <div className="flex gap-2">
                    <Input placeholder="x" size={5} />
                    <Input placeholder="y" size={5} />
                    <Input placeholder="z" size={5} />
                </div>
            </div>

            <div>
                <Label>{t("scale")}</Label>
                <div className="flex gap-2">
                    <Input placeholder="x" size={5} />
                    <Input placeholder="y" size={5} />
                    <Input placeholder="z" size={5} />
                </div>
            </div>
        </>
    );
};
