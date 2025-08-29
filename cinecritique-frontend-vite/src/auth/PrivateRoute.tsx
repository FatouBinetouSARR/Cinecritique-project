// src/auth/PrivateRoute.tsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth"; // chemin relatif vers ton hook

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.dispatchEvent(new CustomEvent("switchAuthMode", { detail: "login" }));
      window.dispatchEvent(new Event("openAuthModal"));
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-[50vh] w-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
  
    // Rediriger vers "/" ET ouvrir le modal
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
