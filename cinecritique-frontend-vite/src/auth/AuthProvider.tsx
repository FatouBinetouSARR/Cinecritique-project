// src/auth/AuthProvider.tsx
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

  const performRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshInProgressRef.current) return refreshInProgressRef.current;
    refreshInProgressRef.current = (async () => {
      try {
        const res = await apiFetch("/api/auth/refresh", { method: "POST" });
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.accessToken) {
          setAccessToken(data.accessToken);
          setUser({ id: data.user.id, email: data.user.email });
          // Persist for axios interceptor and components using localStorage
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
          return data.accessToken;
        }
        return null;
      } finally {
        refreshInProgressRef.current = null;
      }
    })();
    return refreshInProgressRef.current;
  }, []);

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

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await performRefresh();
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [performRefresh]);

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated, authLoading, login, register, logout }),
    [user, accessToken, isAuthenticated, authLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
