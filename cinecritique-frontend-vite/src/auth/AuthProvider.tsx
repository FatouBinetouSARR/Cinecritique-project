// src/auth/AuthProvider.tsx
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../lib/AuthContext";
import type { User } from "../lib/authTypes";
import { apiFetch } from "../lib/apiFetch";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
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
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccessToken(null);
  }, []);

  useEffect(() => {
    performRefresh();
  }, [performRefresh]);

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated, login, register, logout }),
    [user, accessToken, isAuthenticated, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
