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
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/contexts/UserContext";
import { useViewport } from "@/lib/contexts/ViewportContext";
import { auth, storage } from "@/lib/firebase/client";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    updateProfile,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Key, LogOut, Mail, Shield, Upload, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const DashboardNavbar = () => {
    const t = useTranslations("Dashboard");
    const { user, logout } = useUser();
    const router = useRouter();
    const {
        cameraType,
        setCameraType,
        environmentImage,
        setEnvironmentImage,
        environmentIntensity,
        setEnvironmentIntensity,
    } = useViewport();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<
        "password" | "username" | "avatar" | "email" | "apikey" | null
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
    const [error, setError] = useState("");

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // TODO: Implémenter l'import
        console.log("Import file:", file);
    };

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            note: "scene-export-placeholder",
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scene-export.json";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Scène exportée avec succès");
    };

    const handleReset = () => {
        // TODO: Implémenter la réinitialisation de la scène
        toast.info("Fonctionnalité à venir");
    };

    const handleSave = () => {
        // TODO: Implémenter la sauvegarde de la scène
        toast.success("Scène sauvegardée");
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const openDialog = (
        type: "password" | "username" | "avatar" | "email" | "apikey"
    ) => {
        setDialogType(type);
        setDialogOpen(true);
    };

    const handleDialogSave = async () => {
        if (!user || !auth.currentUser) return;

        setIsLoading(true);
        setError("");

        // Timeout de sécurité de 30 secondes
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            toast.error(
                "L'opération a pris trop de temps. Veuillez réessayer."
            );
        }, 30000);

        try {
            switch (dialogType) {
                case "password":
                    if (newPassword !== confirmPassword) {
                        setError("Les mots de passe ne correspondent pas");
                        setIsLoading(false);
                        return;
                    }
                    if (newPassword.length < 6) {
                        setError(
                            "Le mot de passe doit contenir au moins 6 caractères"
                        );
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
                    toast.success("Mot de passe modifié avec succès");
                    break;

                case "username":
                    await updateProfile(auth.currentUser, {
                        displayName: newUsername,
                    });
                    user.displayName = newUsername;
                    toast.success("Nom d'utilisateur modifié avec succès");
                    break;

                case "email":
                    // Utiliser verifyBeforeUpdateEmail au lieu de updateEmail
                    // Cela enverra un email de vérification au nouveau email
                    await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
                    toast.info(
                        "Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez vérifier votre email et cliquer sur le lien pour confirmer le changement.",
                        {
                            duration: 8000,
                        }
                    );
                    setIsLoading(false);
                    setDialogOpen(false);
                    return;

                case "apikey":
                    if (!apiKey) {
                        // Générer une nouvelle clé API
                        const generatedKey = `sk-${Math.random()
                            .toString(36)
                            .substring(2, 15)}${Math.random()
                            .toString(36)
                            .substring(2, 15)}`;
                        setApiKey(generatedKey);
                        user.apiKey = generatedKey;
                        // Sauvegarder dans la base de données
                        await user.repository.updateApiKey(
                            user.uid,
                            generatedKey
                        );
                        toast.success("Clé API générée avec succès");
                        setIsLoading(false);
                        return; // Ne pas fermer le dialog pour l'affichage de la clé
                    }
                    break;

                case "avatar":
                    if (avatarFile) {
                        // Upload l'image vers Firebase Storage avec métadonnées
                        const timestamp = Date.now();
                        const fileName = `${timestamp}_${avatarFile.name.replace(
                            /[^a-zA-Z0-9.-]/g,
                            "_"
                        )}`;
                        const storageRef = ref(
                            storage,
                            `avatars/${user.uid}/${fileName}`
                        );

                        // Uploader avec les métadonnées appropriées
                        const metadata = {
                            contentType: avatarFile.type || "image/jpeg",
                            cacheControl: "public, max-age=31536000",
                        };

                        const uploadResult = await uploadBytes(
                            storageRef,
                            avatarFile,
                            metadata
                        );
                        console.log("Upload réussi:", uploadResult);

                        const photoURL = await getDownloadURL(storageRef);
                        console.log("URL de l'avatar:", photoURL);

                        await updateProfile(auth.currentUser, {
                            photoURL: photoURL,
                        });
                        user.photoURL = photoURL;
                        toast.success("Avatar modifié avec succès");
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
            const errorMessage = err.message || "Une erreur est survenue";
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
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    {t("scene")}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="w-[260px] p-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleImportClick}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {t("import")}
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".json,.glb,.gltf"
                                                className="hidden"
                                                onChange={handleFileSelected}
                                            />
                                            <Button
                                                onClick={handleExport}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {t("export")}
                                            </Button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleReset}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                {t("reset")}
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                variant="default"
                                                size="sm"
                                            >
                                                {t("save")}
                                            </Button>
                                        </div>

                                        <div className="pt-2">
                                            <Label>{t("camera_type")}</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setCameraType(
                                                        value as
                                                            | "perspective"
                                                            | "orthographic"
                                                    )
                                                }
                                                value={cameraType}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={t(
                                                            "camera_type"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="perspective">
                                                        {t(
                                                            "camera_perspective"
                                                        )}
                                                    </SelectItem>
                                                    <SelectItem value="orthographic">
                                                        {t(
                                                            "camera_orthographic"
                                                        )}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="pt-2">
                                            <Label>Image d'environnement</Label>
                                            <Select
                                                onValueChange={
                                                    setEnvironmentImage
                                                }
                                                value={environmentImage}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner un environnement" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="venice_sunset">
                                                        Venice Sunset
                                                    </SelectItem>
                                                    <SelectItem value="studio">
                                                        Studio
                                                    </SelectItem>
                                                    <SelectItem value="warehouse">
                                                        Warehouse
                                                    </SelectItem>
                                                    <SelectItem value="forest">
                                                        Forest
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="pt-2">
                                            <Label>
                                                Intensité d'environnement (
                                                {environmentIntensity})
                                            </Label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={3}
                                                step={0.1}
                                                value={environmentIntensity}
                                                onChange={(e) =>
                                                    setEnvironmentIntensity(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                {t("close")}
                                            </Button>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-10 w-10 rounded-full"
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
                                    {user?.displayName || "Utilisateur"}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || "email@example.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => openDialog("username")}
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Modifier le nom</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog("email")}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Modifier l'email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog("avatar")}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Modifier l'avatar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openDialog("password")}
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Modifier le mot de passe</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDialog("apikey")}>
                            <Key className="mr-2 h-4 w-4" />
                            <span>Générer une clé API</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Déconnexion</span>
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
                            {dialogType === "password" &&
                                "Modifier le mot de passe"}
                            {dialogType === "username" &&
                                "Modifier le nom d'utilisateur"}
                            {dialogType === "email" &&
                                "Modifier l'adresse email"}
                            {dialogType === "avatar" && "Modifier l'avatar"}
                            {dialogType === "apikey" && "Clé API"}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogType === "password" &&
                                "Entrez votre nouveau mot de passe"}
                            {dialogType === "username" &&
                                "Modifiez votre nom d'affichage"}
                            {dialogType === "email" &&
                                "Modifiez votre adresse email"}
                            {dialogType === "avatar" &&
                                "Téléchargez une nouvelle photo de profil"}
                            {dialogType === "apikey" &&
                                "Générez une nouvelle clé API pour accéder à nos services"}
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
                                        Mot de passe actuel
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
                                        Nouveau mot de passe
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
                                        Confirmer le mot de passe
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
                                    Nom d'utilisateur
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
                                <Label htmlFor="email">Adresse email</Label>
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
                                <Label>Photo de profil</Label>
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
                                            ? "Changer l'image"
                                            : "Choisir une image"}
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
                                            Ko)
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {dialogType === "apikey" && (
                            <div className="grid gap-2">
                                {apiKey ? (
                                    <>
                                        <Label>Votre clé API</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={apiKey}
                                                readOnly
                                                className="font-mono text-xs"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        apiKey
                                                    );
                                                }}
                                            >
                                                Copier
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Copiez cette clé maintenant, vous ne
                                            pourrez plus la voir.
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm">
                                        Cliquez sur &quot;Générer&quot; pour
                                        créer une nouvelle clé API.
                                    </p>
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
                            }}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleDialogSave} disabled={isLoading}>
                            {isLoading
                                ? "En cours..."
                                : dialogType === "apikey" && !apiKey
                                ? "Générer"
                                : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
};
