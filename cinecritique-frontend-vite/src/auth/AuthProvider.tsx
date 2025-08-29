import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../lib/AuthContext";
import type { User } from "../lib/authTypes";
import { apiFetch } from "../lib/apiFetch";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const refreshInProgressRef = useRef<Promise<string | null> | null>(null);

  const isAuthenticated = !!accessToken;

  // 🔄 Récupère un nouvel accessToken avec le refreshToken en cookie
  const performRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshInProgressRef.current) return refreshInProgressRef.current;
    refreshInProgressRef.current = (async () => {
      try {
        const res = await apiFetch("/api/auth/refresh", { method: "POST" });
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.accessToken && data?.user) {
          setAccessToken(data.accessToken);
          setUser({ id: data.user.id, email: data.user.email });

          // ✅ Persist
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));

          return data.accessToken;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshInProgressRef.current = null;
      }
    })();
    return refreshInProgressRef.current;
  }, []);

  // 🔑 Login
  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Identifiants invalides");
    const data = await res.json();

    setUser({ id: data.user.id, email: data.user.email });
    setAccessToken(data.accessToken);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
  }, []);

  // 📝 Register
  const register = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Erreur lors de l'inscription");
    const data = await res.json();

    setUser({ id: data.user.id, email: data.user.email });
    setAccessToken(data.accessToken);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
  }, []);

  // 🚪 Logout
  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccessToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, []);

  // 🏁 Initialisation au montage
  useEffect(() => {
    (async () => {
      try {
        const savedToken = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          setAccessToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          await performRefresh();
        }
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [performRefresh]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,
    }),
    [user, accessToken, isAuthenticated, authLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
