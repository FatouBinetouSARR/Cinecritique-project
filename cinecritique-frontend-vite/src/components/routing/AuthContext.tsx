import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type User = { id: number; email: string } | null;

type AuthContextValue = {
  user: User;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });
}

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
          return data.accessToken as string;
        }
        return null;
      } finally {
        refreshInProgressRef.current = null;
      }
    })();
    return refreshInProgressRef.current;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!res.ok) throw new Error("Register failed");
    const data = await res.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccessToken(null);
  }, []);

  const fetchWithAuth = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      let tokenToUse = accessToken;
      const doRequest = async (token?: string | null) => {
        const headers = new Headers(init.headers || {});
        if (token) headers.set("Authorization", `Bearer ${token}`);
        const res = await fetch(input, { ...init, headers, credentials: "include" });
        return res;
      };

      let res = await doRequest(tokenToUse);
      if (res.status === 401) {
        const newToken = await performRefresh();
        if (newToken) {
          res = await doRequest(newToken);
        }
      }
      return res;
    },
    [accessToken, performRefresh]
  );

  useEffect(() => {
    // Optionally, try to get a token at mount using refresh cookie
    performRefresh();
  }, [performRefresh]);

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated, login, register, logout, fetchWithAuth }),
    [user, accessToken, isAuthenticated, login, register, logout, fetchWithAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


