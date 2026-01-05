import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const TextureSection = () => {
    const t = useTranslations("TextureSection");

    return (
        <div>
            <h2 className="flex items-center py-4 text-lg font-semibold">
                <ImageIcon className="w-4 h-4 mr-2 inline-block" />
                {t("textures")}
            </h2>
            <div>
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <div className="text-center space-y-2">
                        <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
                        <p className="text-sm font-medium">{t("soon")}</p>
                        <p className="text-xs">
                            {t("texture_management_coming_soon")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
