import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../lib/AuthContext";
import type { User } from "../lib/authTypes";
import { apiFetch } from "../lib/apiFetch";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  
  // Wrapper pour mettre à jour à la fois l'état local et le token dans apiFetch
  const setAccessToken = useCallback((token: string | null) => {
    _setAccessToken(token);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('accessToken', token || '');
    }
  }, []);

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const refreshInProgressRef = useRef<Promise<string | null> | null>(null);

  const isAuthenticated = !!accessToken;

  const performRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshInProgressRef.current) return refreshInProgressRef.current;
    refreshInProgressRef.current = (async () => {
      try {
        console.log("🔄 performRefresh called");
        const res = await apiFetch("/api/auth/refresh", { method: "POST" });
        console.log("🌐 Refresh response status:", res.status);
        if (!res.ok) return null;
        const data = await res.json();
        console.log("💡 Refresh response data:", data);

        if (data?.accessToken && data?.user) {
          setAccessToken(data.accessToken);
          setUser({ id: data.user.id, email: data.user.email });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
          return data.accessToken;
        }
        return null;
      } catch (err) {
        console.error("❌ performRefresh error:", err);
        return null;
      } finally {
        refreshInProgressRef.current = null;
      }
    })();
    return refreshInProgressRef.current;
  }, [setAccessToken, setUser]);

  const login = useCallback(async (email: string, password: string) => {
    console.log("🔑 Login called:", email);
    const res = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!res.ok) throw new Error("Identifiants invalides");
    const data = await res.json();
    console.log("💡 Login response data:", data);

    setUser({ id: data.user.id, email: data.user.email });
    setAccessToken(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    console.log("📝 Register called:", email);
    const res = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!res.ok) throw new Error("Erreur lors de l'inscription");
    const data = await res.json();
    console.log("💡 Register response data:", data);

    setUser({ id: data.user.id, email: data.user.email });
    setAccessToken(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
  }, []);

  const logout = useCallback(async () => {
    console.log("🚪 Logout called");
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }, [setUser, setAccessToken]);

  // Initialisation au montage
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
  }, [performRefresh, setAccessToken]);

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated, authLoading, login, register, logout }),
    [user, accessToken, isAuthenticated, authLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
