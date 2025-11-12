import "@/app/globals.css";
import { ThemeProvider } from "@/lib/components/ThemeProvider";
import { LocaleProvider } from "@/lib/contexts/LocaleContext";
import { UserProvider } from "@/lib/contexts/UserContext";
import ThemeScript from "@/lib/scripts/themeScript";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: "900",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    weight: "900",
});

export const metadata: Metadata = {
    title: "Kubo",
    description:
        "Bienvenue sur Kubo, un éditeur d'objets 3D en ligne gratuit et open-source. Créez, modifiez et exportez des modèles 3D directement depuis votre navigateur, sans installation requise. Parfait pour les débutants et les professionnels du design 3D.",
};

export default async function LocaleLayout({
    children,
    params,
}: LayoutProps<"/[locale]">): Promise<ReactNode> {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className="h-screen w-screen bg-background"
        >
            <head>
                <ThemeScript />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased cursor-default w-full h-full flex bg-background text-foreground`}
            >
                <NextIntlClientProvider messages={messages}>
                    <LocaleProvider initialLocale={locale}>
                        <UserProvider>
                            <ThemeProvider>{children}</ThemeProvider>
                        </UserProvider>
                    </LocaleProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
