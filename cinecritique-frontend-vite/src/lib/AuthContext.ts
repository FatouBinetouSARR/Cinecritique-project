// src/auth/AuthContext.ts
import { createContext } from "react";
import type { AuthContextValue } from "../lib/authTypes";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
