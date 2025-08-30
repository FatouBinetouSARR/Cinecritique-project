import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../lib/AuthContext";
import type { User } from "../lib/authTypes";
import { apiFetch, setAccessToken as setApiFetchToken } from "../lib/apiFetch";

// Decode simple JWT payload
function decodeJwt(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const refreshInProgressRef = useRef<Promise<string | null> | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

  const isAuthenticated = !!accessToken;

  // Nettoyage du timer
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  // 🔄 Refresh du token
  const performRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshInProgressRef.current) return refreshInProgressRef.current;

    refreshInProgressRef.current = (async () => {
      try {
        const res = await apiFetch("/api/auth/refresh", { method: "POST" });

        if (!res.ok) {
          setUser(null);
          _setAccessToken(null);
          return null;
        }

        const data = await res.json();

        if (data?.accessToken && data?.user) {
          _setAccessToken(data.accessToken);
          setUser({ id: data.user.id, email: data.user.email });
          localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
          return data.accessToken;
        }

        return null;
      } catch (err) {
        console.error("❌ performRefresh error:", err);
        setUser(null);
        _setAccessToken(null);
        return null;
      } finally {
        refreshInProgressRef.current = null;
      }
    })();

    return refreshInProgressRef.current;
  }, []);

  // ✅ Met à jour token + localStorage + timer
  const setAccessToken = useCallback(
    (token: string | null) => {
      _setAccessToken(token);
      setApiFetchToken(token);
      clearRefreshTimer();

      if (typeof window !== "undefined") {
        if (token) {
          window.localStorage.setItem("accessToken", token);

          // Décode JWT pour planifier le refresh auto
          const decoded = decodeJwt(token);
          if (decoded?.exp) {
            const expiresAt = decoded.exp * 1000;
            const now = Date.now();
            const refreshDelay = Math.max(expiresAt - now - 60_000, 5000); // 1 min avant expiration
            refreshTimeoutRef.current = window.setTimeout(() => {
              performRefresh();
            }, refreshDelay);
          }
        } else {
          window.localStorage.removeItem("accessToken");
        }
      }
    },
    [clearRefreshTimer, performRefresh]
  );

  // 🔑 Login
  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Identifiants invalides");
      const data = await res.json();

      setUser({ id: data.user.id, email: data.user.email });
      setAccessToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
    },
    [setAccessToken]
  );

  // 📝 Register
  const register = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'inscription");
      const data = await res.json();

      setUser({ id: data.user.id, email: data.user.email });
      setAccessToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify({ id: data.user.id, email: data.user.email }));
    },
    [setAccessToken]
  );

  // 🚪 Logout
  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      clearRefreshTimer();
    }
  }, [setAccessToken, clearRefreshTimer]);

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

    return () => {
      clearRefreshTimer();
    };
  }, [performRefresh, setAccessToken, clearRefreshTimer]);

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated, authLoading, login, register, logout }),
    [user, accessToken, isAuthenticated, authLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
