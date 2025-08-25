// src/lib/apiFetch.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
  });
}
