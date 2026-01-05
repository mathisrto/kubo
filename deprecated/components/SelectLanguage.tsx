"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { locales } from "../constants";
import { useLocale } from "../contexts/LocaleContext";

const SelectLanguage = () => {
    const { locale, setLocale } = useLocale();

    const [currentValue, setCurrentValue] = useState(locale);
    const t = useTranslations("SelectLanguage");

    useEffect(() => {
        setCurrentValue(locale);
    }, [locale]);

    const handleChange = (value: string) => {
        setCurrentValue(value);
        setLocale(value);
    };

    return (
        <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger>
                <SelectValue placeholder={t("select_language")} />
            </SelectTrigger>
            <SelectContent>
                {locales.map((item) => (
                    <SelectItem key={item} value={item}>
                        {t(item)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SelectLanguage;
