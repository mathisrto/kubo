"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/lib/contexts/UserContext";
import { motion } from "framer-motion";
import { ArrowRight, Box, Users, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const fadeIn = {
    initial: { opacity: 1, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function HomePage() {
    const { user, isLoading } = useUser();
    const t = useTranslations("Home");

    return (
        <main className="h-full w-full overflow-auto">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-b from-background via-secondary/10 to-background px-6 py-20 md:py-32">
                {/* Animated background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute -right-1/4 -top-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <motion.div
                    className="container relative z-10 mx-auto max-w-6xl"
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                >
                    {/* Logo avec animation améliorée */}
                    <motion.div
                        variants={fadeIn}
                        className="mb-12 flex justify-center"
                    >
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <div className="relative h-32 w-32 md:h-48 md:w-48">
                                <Image
                                    src="/icon.svg"
                                    alt="Kubo Logo"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Title with gradient */}
                    <motion.div variants={fadeIn} className="text-center">
                        <motion.h1
                            className="mb-6 bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {t("title")}
                        </motion.h1>
                        <motion.p
                            className="mb-8 text-xl text-muted-foreground md:text-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {t("subtitle")}
                        </motion.p>
                        <motion.p
                            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {t("intro_text")}
                        </motion.p>

                        {/* CTA Buttons with loading state */}
                        <motion.div
                            variants={fadeIn}
                            className="flex flex-wrap justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <motion.div
                                        className="h-2 w-2 rounded-full bg-primary"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                        }}
                                    />
                                    <motion.div
                                        className="h-2 w-2 rounded-full bg-primary"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: 0.2,
                                        }}
                                    />
                                    <motion.div
                                        className="h-2 w-2 rounded-full bg-primary"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: 0.4,
                                        }}
                                    />
                                </div>
                            ) : !user ? (
                                <>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            asChild
                                            size="lg"
                                            className="gap-2 shadow-lg"
                                        >
                                            <Link href="/register">
                                                {t("get_started")}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="shadow-lg"
                                        >
                                            <Link href="/login">
                                                {t("login")}
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className="gap-2 shadow-lg"
                                    >
                                        <Link href="/dashboard">
                                            {t("go_to_dashboard")}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20">
                <motion.div
                    className="container mx-auto max-w-6xl"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={stagger}
                >
                    <motion.h2
                        variants={fadeIn}
                        className="mb-12 text-center text-4xl font-bold"
                    >
                        {t("features_title")}
                    </motion.h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        <motion.div
                            variants={fadeIn}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <Card className="group h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl">
                                <CardHeader>
                                    <motion.div
                                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Box className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                                    </motion.div>
                                    <CardTitle className="text-xl">
                                        {t("feature_1_title")}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {t("feature_1_desc")}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <Card className="group h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl">
                                <CardHeader>
                                    <motion.div
                                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Zap className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                                    </motion.div>
                                    <CardTitle className="text-xl">
                                        {t("feature_2_title")}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {t("feature_2_desc")}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <Card className="group h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl">
                                <CardHeader>
                                    <motion.div
                                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Users className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                                    </motion.div>
                                    <CardTitle className="text-xl">
                                        {t("feature_3_title")}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {t("feature_3_desc")}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
