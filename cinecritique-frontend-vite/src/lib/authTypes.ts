// src/lib/authTypes.ts
export type User = { id: string; email: string } | null;

export type AuthContextValue = {
  user: User;
  accessToken: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
