"use client";

import { auth } from "@/src/firebase/client";
import { signInWithCustomToken, User, UserCredential } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import logger from "../logger";

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
      // Vérifier si l'email est vérifié
      if (!user.user.emailVerified) {
        throw new Error(
          "Veuillez vérifier votre email avant de vous connecter. Un email de vérification vous a été envoyé."
        );
      }

      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await user.user.getIdToken() }),
      });

      if (!res.ok) throw new Error("Échec de la connexion au serveur");

      setUser(user.user);
    });
  };

  // Déconnexion centralisée
  const handleLogout = useCallback(async () => {
    await withLoading(async () => {
      await fetch("/auth/logout", { method: "POST" });
      if (!user) return;
      await auth.signOut();
      setUser(null);
    });
  }, [user]);

  const refreshSession = useCallback(async () => {
    await withLoading(async () => {
      try {
        const res = await fetch("/auth/refresh", { method: "POST" });
        const data = await res.json();
        if (res.ok && data?.customToken) {
          const userCredential = await signInWithCustomToken(
            auth,
            data.customToken
          );

          setUser(userCredential.user);
        }
      } catch (error) {
        logger.error("Erreur lors du rafraîchissement de la session :", error);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) refreshSession();
  }, [user, refreshSession]);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        if (!user) return;
        handleLogout();
        return;
      }
    });

    return () => unsubscribe();
  }, [user, handleLogout]);

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
