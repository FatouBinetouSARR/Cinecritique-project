// src/components/top-rated/CompactMovieCard.tsx
import React from "react";
import { Star, Users } from "lucide-react";

export interface CompactMovie {
  id: number;
  posterPath: string;
  rating: number;
  reviewCount: number;
  fileSize: string; // ex: "368 Ko"
}

export const CompactMovieCard: React.FC<{ movie: CompactMovie }> = ({ movie }) => (
  <div className="flex flex-col items-center bg-gray-800 rounded overflow-hidden w-36 shrink-0">
    <div className="w-36 h-52 overflow-hidden">
      <img
        src={movie.posterPath}
        alt=""
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="flex flex-col items-center p-2 gap-1 text-xs text-gray-300">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400" /> {movie.rating}
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-3 h-3" /> {movie.reviewCount.toLocaleString()}
      </div>
      <div>{movie.fileSize}</div>
    </div>
  </div>
);
