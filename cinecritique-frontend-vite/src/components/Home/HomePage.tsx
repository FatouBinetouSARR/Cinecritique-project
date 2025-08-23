import React from "react";
import { HeroSection } from "./SectionHero";
import { PopularMovies } from "./SectionPopularMovies";
import { ReviewsTabs } from "./SectionReviewsTabs";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-white">
      <HeroSection />
      <PopularMovies />
      <ReviewsTabs/>
    </div>
  );
};
