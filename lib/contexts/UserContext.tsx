"use client";

import { User } from "@/lib/class/User";
import { auth } from "@/lib/firebase/client";
import { signInWithCustomToken, UserCredential } from "firebase/auth";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    login: (user: UserCredential) => Promise<void>;
    isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
    login: (user: UserCredential) => Promise.resolve(),
    isLoading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const withLoading = async <T,>(action: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        try {
            const result = await action();
            return result;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (user: UserCredential) => {
        await withLoading(async () => {
            const res = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: await user.user.getIdToken() }),
            });

            if (!res.ok) throw new Error("Échec de la connexion au serveur");

            setUser(new User(user.user));
        });
    };

    // Déconnexion centralisée
    const handleLogout = async () => {
        await withLoading(async () => {
            await fetch("/auth/logout", { method: "POST" });
            if (!user) return;
            await auth.signOut();
            setUser(null);
        });
    };

    const refreshSession = async () => {
        await withLoading(async () => {
            try {
                const res = await fetch("/auth/refresh", { method: "POST" });
                const data = await res.json();
                if (res.ok && data?.customToken) {
                    const user = await signInWithCustomToken(
                        auth,
                        data.customToken
                    );
                    setUser(new User(user.user));
                }
            } catch (error) {
                console.error(
                    "Erreur lors du rafraîchissement de la session :",
                    error
                );
            }
        });
    };

    useEffect(() => {
        if (!user) refreshSession();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged(async (firebaseUser) => {
            if (!firebaseUser) {
                if (!user) return;
                handleLogout();
                return;
            }

            if (user && user.uid === firebaseUser.uid) {
                user.updateUserFromFirebase(firebaseUser);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                logout: handleLogout,
                login: handleLogin,
                isLoading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
