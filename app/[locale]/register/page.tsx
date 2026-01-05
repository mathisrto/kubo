"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/src/contexts/userContext";
import { auth } from "@/src/firebase/client";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import GoogleIcon from "@/data/icons/google.svg";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useUser();
    const router = useRouter();
    const t = useTranslations("Register");

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        // Validation
        if (password !== confirmPassword) {
            setError(t("password_mismatch"));
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t("password_too_short"));
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Mettre un displayName et une photo par défaut
            await updateProfile(userCredential.user, {
                displayName: name || "Utilisateur",
                photoURL: "https://www.gravatar.com/avatar/?d=mp",
            });

            // Envoyer un email de vérification
            await sendEmailVerification(userCredential.user);

            setSuccess(t("success_message"));
            setIsLoading(false);
        } catch (err: any) {
            const errorMessage =
                err.code === "auth/email-already-in-use"
                    ? t("email_already_used")
                    : err.code === "auth/weak-password"
                    ? t("weak_password")
                    : err.message || t("unknown_error");
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setError("");
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (err: any) {
            setError(err.message || t("unknown_error"));
            setIsLoading(false);
        }
    };

    return (
        <main className="flex h-full w-full items-center justify-center bg-linear-to-br from-background via-secondary/10 to-background px-6 py-12">
            {/* Animated background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
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
                    className="absolute -right-1/4 top-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"
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
                className="relative z-10 w-full max-w-md"
                initial="initial"
                animate="animate"
                variants={fadeIn}
            >
                {/* Logo */}
                <motion.div
                    className="mb-8 flex justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <Link href="/">
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                            <div className="relative h-20 w-20">
                                <Image
                                    src="/icon.svg"
                                    alt="Kubo Logo"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>

                <Card className="border-2 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl font-bold">
                            {t("title")}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {t("subtitle")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Google Register */}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleGoogleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Image src={GoogleIcon} alt="Google Logo" />
                            )}
                            {t("google_register")}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    {t("or_continue_with")}
                                </span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("name")}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={t("name_placeholder")}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t("email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t("email_placeholder")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {t("password")}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={t("password_placeholder")}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    {t("confirm_password")}
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder={t(
                                        "confirm_password_placeholder"
                                    )}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400"
                                >
                                    {success}
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("loading")}
                                    </>
                                ) : (
                                    t("register_button")
                                )}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-muted-foreground">
                            {t("already_account")}{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                {t("login_link")}
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button variant="ghost" asChild className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            {t("back_home")}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </main>
    );
}
