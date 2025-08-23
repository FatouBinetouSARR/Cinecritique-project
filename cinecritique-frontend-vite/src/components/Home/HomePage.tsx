import React from "react";
import { HeroSection } from "./HeroSection";
import { PopularMovies } from "./PopularMovies";
import { ReviewsTabs } from "./ReviewsTabs";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-white">
      <HeroSection />
      <PopularMovies />
      <ReviewsTabs/>
    </div>
  );
};
