// src/components/home/HomePage.tsx
import React from "react";
import { HeroSection } from "./Hero";
import { PopularMovies } from "./PopularMovies";
import { ReviewsFeed } from "./ReviewsFeed";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-white">
      <HeroSection />
      <PopularMovies />
      <ReviewsFeed/>
    </div>
  );
};
