"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { profilService } from "@/services/profil.service";
import { setBackendAuthToken } from "@/services/api";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/auth-storage";
import type { ChefProfil } from "@/types";

interface UserContextValue {
  user: ChefProfil | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ChefProfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setBackendAuthToken(token);
    profilService
      .getMe()
      .then((u) => setUser(u))
      .catch(() => {
        clearStoredToken();
        setBackendAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const { accessToken } = await authService.login(email, password);
    setStoredToken(accessToken);
    setBackendAuthToken(accessToken);
    const profil = await profilService.getMe();
    setUser(profil);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setBackendAuthToken(null);
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useChefUser() {
  return useContext(UserContext);
}

export function useRequireAuth() {
  const { user, loading } = useChefUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/connexion");
    }
  }, [loading, user, router]);
}
