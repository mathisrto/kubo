"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/contexts/UserContext";
import { auth } from "@/lib/firebase/client";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    updateProfile,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
    Container,
    Key,
    LogOut,
    Mail,
    RotateCcw,
    Save,
    Shield,
    Upload,
    User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CAMERA_TYPES } from "../constants";
import { useScene } from "../contexts/SceneContext";
import { UserRepository } from "../database/graphql/repositories/UserRepository";

export const DashboardNavbar = () => {
    const t = useTranslations("Dashboard");
    const { user, logout } = useUser();
    const router = useRouter();
    const { scene, updateScene, resetScene } = useScene();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<
        | "password"
        | "username"
        | "avatar"
        | "email"
        | "apikey"
        | "environment"
        | null
    >(null);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newUsername, setNewUsername] = useState(user?.displayName || "");
    const [newEmail, setNewEmail] = useState(user?.email || "");
    const [apiKey, setApiKey] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);
    const [error, setError] = useState("");

    const userRepository = new UserRepository();

    const handleReset = () => {
        resetScene();
        toast.success(t("scene_reset_success"));
    };

    const handleSave = () => {
        updateScene((scene) => {
            scene.save();
        });
        toast.success(t("scene_saved_success"));
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const openDialog = async (
        type:
            | "password"
            | "username"
            | "avatar"
            | "email"
            | "apikey"
            | "environment"
    ) => {
        setDialogType(type);
        setDialogOpen(true);

        // Charger la clé API si on ouvre le dialog apikey
        if (type === "apikey" && user) {
            setIsLoadingApiKey(true);
            try {
                const existingKey = await userRepository.getApiKey(user.uid);
                if (existingKey) {
                    setApiKey(existingKey);
                }
            } catch (err) {
                console.error(
                    "Erreur lors de la récupération de la clé API:",
                    err
                );
            } finally {
                setIsLoadingApiKey(false);
            }
        }
    };

    const handleGenerateApiKey = async () => {
        if (!user) return;

        setIsLoading(true);
        setError("");

        try {
            // Générer une nouvelle clé API
            const generatedKey = `sk-${Math.random()
                .toString(36)
                .substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`;

            // Sauvegarder dans la base de données
            await userRepository.updateApiKey(user.uid, generatedKey);

            setApiKey(generatedKey);
            user.apiKey = generatedKey;
            toast.success(t("api_key_generate_success"));
        } catch (err: any) {
            console.error("Erreur génération clé API:", err);
            const errorMessage = err.message || t("api_key_generate_error");
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditEnvironment = () => {};

    const handleDialogSave = async () => {
        if (!user || !auth.currentUser) return;

        setIsLoading(true);
        setError("");

        // Timeout de sécurité de 30 secondes
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            toast.error(t("operation_timeout"));
        }, 30000);

        try {
            switch (dialogType) {
                case "password":
                    if (newPassword !== confirmPassword) {
                        setError(t("passwords_do_not_match"));
                        setIsLoading(false);
                        return;
                    }
                    if (newPassword.length < 6) {
                        setError(t("password_too_short"));
                        setIsLoading(false);
                        return;
                    }
                    // Réauthentification nécessaire pour changer le mot de passe
                    if (currentPassword && user.email) {
                        const credential = EmailAuthProvider.credential(
                            user.email,
                            currentPassword
                        );
                        await reauthenticateWithCredential(
                            auth.currentUser,
                            credential
                        );
                    }
                    await updatePassword(auth.currentUser, newPassword);
                    toast.success(t("password_update_success"));
                    break;

                case "username":
                    await updateProfile(auth.currentUser, {
                        displayName: newUsername,
                    });
                    user.displayName = newUsername;
                    toast.success(t("username_update_success"));
                    break;

                case "email":
                    // Utiliser verifyBeforeUpdateEmail au lieu de updateEmail
                    // Cela enverra un email de vérification au nouveau email
                    await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
                    toast.info(t("email_verification_sent"), {
                        duration: 8000,
                    });
                    setIsLoading(false);
                    setDialogOpen(false);
                    return;

                case "avatar":
                    if (avatarFile) {
                        // Upload l'image vers MongoDB GridFS
                        const formData = new FormData();
                        formData.append("file", avatarFile);
                        formData.append("uid", user.uid);

                        const uploadResponse = await fetch("/api/avatar", {
                            method: "POST",
                            body: formData,
                        });

                        if (!uploadResponse.ok) {
                            const errorData = await uploadResponse.json();
                            throw new Error(
                                errorData.error || t("avatar_upload_failed")
                            );
                        }

                        const uploadData = await uploadResponse.json();
                        console.log("Upload réussi:", uploadData);

                        // L'URL de l'avatar est maintenant /api/avatar/[fileId]
                        const photoURL = uploadData.url;
                        console.log("URL de l'avatar:", photoURL);

                        // Mettre à jour le profil Firebase avec la nouvelle URL
                        await updateProfile(auth.currentUser, {
                            photoURL: photoURL,
                        });
                        user.photoURL = photoURL;
                        toast.success(t("avatar_update_success"));
                    }
                    break;
            }

            setDialogOpen(false);
            setDialogType(null);
            setNewPassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            setAvatarFile(null);
        } catch (err: any) {
            console.error("Erreur:", err);
            const errorMessage = err.message || t("generic_error");
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 border-b bg-background/60 backdrop-blur-sm">
            <div className="mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 px-4"
                            >
                                <span className="font-semibold">
                                    {t("scene")}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2">
                            <DropdownMenuItem
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>{t("reset")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleSave}
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{t("save")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => openDialog("environment")}
                                className="flex items-center gap-2"
                            >
                                <Container className="w-4 h-4" />
                                <span>{t("edit_environment")}</span>
                            </DropdownMenuItem>
                            <div className="px-2 py-1">
                                <Label className="mb-1 block">
                                    {t("environment_intensity")} (
                                    {scene?.ambientLight.intensity.toFixed(1)})
                                </Label>
                                <input
                                    type="range"
                                    min={0}
                                    max={3}
                                    step={0.1}
                                    value={scene?.ambientLight.intensity.toFixed(
                                        1
                                    )}
                                    onChange={(e) =>
                                        updateScene((scene) => {
                                            scene.ambientLight.intensity =
                                                parseFloat(e.target.value);
                                        })
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="px-2 py-1">
                                <Label className="mb-1 block">
                                    {t("camera_type")}
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        updateScene((scene) => {
                                            scene.camera.type =
                                                value as CAMERA_TYPES;
                                        });
                                    }}
                                    value={scene?.camera.type}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={t("camera_type")}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value={CAMERA_TYPES.PERSPECTIVE}
                                        >
                                            {t("camera_perspective")}
                                        </SelectItem>
                                        <SelectItem
                                            value={CAMERA_TYPES.ORTHOGRAPHIC}
                                        >
                                            {t("camera_orthographic")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="relative h-11 w-11 rounded-full border-2 border-primary shadow-md hover:scale-105 transition-transform duration-150"
                            aria-label="Ouvrir le menu utilisateur"
                        >
                            <Avatar>
                                <AvatarImage
                                    src={user?.photoURL || "/avatar.png"}
                                    alt={user?.displayName || "Avatar"}
                                />
                                <AvatarFallback>
                                    {(user?.displayName || "U").charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.displayName || t("user")}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || t("email_placeholder")}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => openDialog("username")}
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>{t("edit_name")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog("email")}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>{t("edit_email")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog("avatar")}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span>{t("edit_avatar")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openDialog("password")}
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>{t("edit_password")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDialog("apikey")}>
                            <Key className="mr-2 h-4 w-4" />
                            <span>{t("generate_api_key")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{t("logout")}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Dialogs pour les différentes options */}
            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    // Empêcher la fermeture si en cours de chargement
                    if (!isLoading) {
                        setDialogOpen(open);
                        if (!open) {
                            // Réinitialiser les états quand on ferme
                            setDialogType(null);
                            setNewPassword("");
                            setConfirmPassword("");
                            setCurrentPassword("");
                            setAvatarFile(null);
                            setAvatarPreview(null);
                            setApiKey("");
                            setError("");
                        }
                    }
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === "password" && t("edit_password")}
                            {dialogType === "username" && t("edit_name")}
                            {dialogType === "email" && t("edit_email")}
                            {dialogType === "avatar" && t("edit_avatar")}
                            {dialogType === "apikey" && t("api_key")}
                            {dialogType === "environment" &&
                                t("edit_environment")}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogType === "password" &&
                                t("enter_new_password")}
                            {dialogType === "username" &&
                                t("edit_display_name")}
                            {dialogType === "email" && t("edit_email_address")}
                            {dialogType === "avatar" && t("upload_new_avatar")}
                            {dialogType === "apikey" &&
                                t("generate_api_key_description")}
                            {dialogType === "environment" &&
                                t("edit_environment_description")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        {dialogType === "password" && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">
                                        {t("current_password")}
                                    </Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">
                                        {t("new_password")}
                                    </Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">
                                        {t("confirm_password")}
                                    </Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}
                        {dialogType === "username" && (
                            <div className="grid gap-2">
                                <Label htmlFor="username">
                                    {t("username")}
                                </Label>
                                <Input
                                    id="username"
                                    value={newUsername}
                                    onChange={(e) =>
                                        setNewUsername(e.target.value)
                                    }
                                />
                            </div>
                        )}
                        {dialogType === "email" && (
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t("email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) =>
                                        setNewEmail(e.target.value)
                                    }
                                />
                            </div>
                        )}
                        {dialogType === "avatar" && (
                            <div className="grid gap-4">
                                <Label>{t("avatar")}</Label>
                                <div className="flex flex-col items-center gap-4">
                                    {/* Aperçu de l'avatar */}
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Aperçu"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="Avatar actuel"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                                                <User className="w-16 h-16" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Bouton de sélection */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            const input =
                                                document.getElementById(
                                                    "avatar-file"
                                                ) as HTMLInputElement;
                                            input?.click();
                                        }}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {avatarFile
                                            ? t("change_image")
                                            : t("choose_image")}
                                    </Button>
                                    <input
                                        id="avatar-file"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setAvatarFile(file);
                                                // Créer un aperçu
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setAvatarPreview(
                                                        reader.result as string
                                                    );
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {avatarFile && (
                                        <p className="text-sm text-muted-foreground text-center">
                                            {avatarFile.name} (
                                            {Math.round(avatarFile.size / 1024)}{" "}
                                            {t("kb")})
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {dialogType === "apikey" && (
                            <div className="grid gap-4">
                                {isLoadingApiKey ? (
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        <p className="text-sm text-muted-foreground">
                                            Chargement de la clé API...
                                        </p>
                                    </div>
                                ) : apiKey ? (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>{t("your_api_key")}</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={apiKey}
                                                    readOnly
                                                    className="font-mono text-xs"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            apiKey
                                                        );
                                                        toast.success(
                                                            t("api_key_copied")
                                                        );
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    Copier
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={handleGenerateApiKey}
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            {isLoading
                                                ? t("generating")
                                                : t("regenerate_api_key")}
                                        </Button>
                                        <p className="text-xs text-orange-600">
                                            {t("regenerate_api_key_warning")}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm">
                                            {t("generate_api_key_prompt")}
                                        </p>
                                        <Button
                                            onClick={handleGenerateApiKey}
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            {isLoading
                                                ? t("generating")
                                                : t("generate_api_key")}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                        {dialogType === "environment" && (
                            <div className="grid gap-4">
                                <Label>{t("environment_source")}</Label>
                                <Select
                                    value={
                                        scene?.ambientLight.environmentMap.startsWith(
                                            "http"
                                        )
                                            ? "url"
                                            : scene?.ambientLight.environmentMap
                                            ? "file"
                                            : "url"
                                    }
                                    onValueChange={(value) => {
                                        updateScene((scene) => {
                                            scene.ambientLight.environmentMap =
                                                value;
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={t(
                                                "choose_source_type"
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="url">
                                            {t("url")}
                                        </SelectItem>
                                        <SelectItem value="file">
                                            {t("file")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {scene?.ambientLight.environmentMap.startsWith(
                                    "http"
                                ) || !scene?.ambientLight.environmentMap ? (
                                    <div className="grid gap-2">
                                        <Label htmlFor="environment-url">
                                            {t("environment_url")}
                                        </Label>
                                        <Input
                                            id="environment-url"
                                            type="url"
                                            value={
                                                scene?.ambientLight.environmentMap.startsWith(
                                                    "http"
                                                )
                                                    ? scene?.ambientLight
                                                          .environmentMap
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                updateScene((scene) => {
                                                    scene.ambientLight.environmentMap =
                                                        e.target.value;
                                                })
                                            }
                                            placeholder="https://..."
                                        />
                                    </div>
                                ) : (
                                    <div className="grid gap-2">
                                        <Label htmlFor="environment-file">
                                            {t("environment_file")}
                                        </Label>
                                        <Input
                                            id="environment-file"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    updateScene((scene) => {
                                                        // Ici, on pourrait implémenter l'upload
                                                        // vers le serveur et obtenir un URL ou ID
                                                        // temporaire pour l'environnement.
                                                        // Pour l'instant, on met juste le nom du fichier.
                                                        scene.ambientLight.environmentMap =
                                                            file.name;
                                                    });
                                                    // TODO: gérer l'upload du fichier
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDialogOpen(false);
                                setError("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setCurrentPassword("");
                                setAvatarFile(null);
                                setApiKey("");
                            }}
                            disabled={isLoading}
                        >
                            {dialogType === "apikey" ? t("close") : t("cancel")}
                        </Button>
                        {dialogType !== "apikey" && (
                            <Button
                                onClick={handleDialogSave}
                                disabled={isLoading}
                            >
                                {isLoading ? t("in_progress") : t("save")}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
};
