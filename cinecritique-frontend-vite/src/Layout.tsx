import React from "react";
import Navigation from "./components/Navigation";
import { Footer } from "./components/layouts/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navigation />
      <main className="flex-1 container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
};
