"use client";

import { User } from "@/lib/class/User";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const generateApiKeyForUser = async (uid: string) => {
    const action = (await import("@/lib/actions")).generateApiKeyForUser;
    return action(uid);
};

const userHasApiKey = async (uid: string) => {
    const action = (await import("@/lib/actions")).userHasApiKey;
    return action(uid);
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
    isLoading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const didLoginOnceRef = useRef(false);
    const didLogoutOnceRef = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Si on est déjà loggé avec le même UID, inutile de relancer un login côté serveur
                if (didLoginOnceRef.current && user?.uid === firebaseUser.uid) {
                    return;
                }

                const res = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idToken: await firebaseUser.getIdToken(),
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    const user = new User(firebaseUser);

                    if (!(await userHasApiKey(user.uid))) {
                        await generateApiKeyForUser(user.uid);
                    }
                    setUser(user);
                    didLoginOnceRef.current = true;
                    setIsLoading(false);
                } else {
                    console.error("Failed to log in:", data.error);
                    setIsLoading(false);
                }
            } else {
                if (didLogoutOnceRef.current) {
                    didLogoutOnceRef.current = false;
                    setIsLoading(false);
                    return;
                }

                const res = await fetch("/auth/refresh", { method: "POST" });
                const data = await res.json();
                if (res.ok && data?.customToken) {
                    await signInWithCustomToken(auth, data.customToken);
                } else {
                    setUser(null);
                    setIsLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await fetch("/auth/logout", { method: "POST" });
        await auth.signOut();
        didLogoutOnceRef.current = true;
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
