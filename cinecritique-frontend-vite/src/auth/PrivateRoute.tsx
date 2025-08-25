// src/auth/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth"; // chemin relatif vers ton useAuth.ts

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas connecté, redirige vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, affiche les enfants (la page protégée)
  return <>{children}</>;
};
