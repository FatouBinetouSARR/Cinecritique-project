import React from "react";
import { StarRating } from "../../ui/StarRating";
import { Badge } from "../../ui/badge";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  genres: string[];
  rating: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterPath,
  releaseDate,
  genres,
  rating,
}) => {
  const year = new Date(releaseDate).getFullYear();

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md w-full h-full">
      {/* Poster */}
      <img
        src={posterPath || "/placeholder.svg"}
        alt={`${title} poster`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay au hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2">{title} ({year})</h3>
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={rating} size="sm" />
          <span className="text-white text-xs">{rating.toFixed(1)}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre} className="text-[10px] bg-white/20 text-white">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
