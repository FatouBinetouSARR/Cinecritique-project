import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header/>
      <main className="flex-1 container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
};
