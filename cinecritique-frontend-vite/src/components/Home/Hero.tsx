// src/components/home/Hero.tsx
import React from "react";
import { Button } from "../../ui/button";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src="/hero.jpg"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Overlay dégradé horizontal */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-3xl px-4 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white font-space-grotesk leading-tight">
          Découvrez, notez et partagez vos{" "}
          <span className="text-secondary">films préférés</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          Une communauté de cinéphiles passionnés. Suivez vos amis, créez vos listes,
          et trouvez l’inspiration pour votre prochaine séance.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-secondary text-white hover:bg-secondary/90"
            onClick={() => {
              // Ouvre le modal d'authentification en mode inscription
              window.dispatchEvent(new CustomEvent("switchAuthMode", { detail: "register" }));
              window.dispatchEvent(new Event("openAuthModal"));
            }}
          >
            Créer un compte
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-white border border-secondary hover:bg-secondary/20"
          >
            <Link to="/movies">Explorer les films</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
