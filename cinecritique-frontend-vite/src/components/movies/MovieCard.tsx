import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { StarRating } from "../../ui/StarRating";
import { Link } from "react-router-dom";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  runtime?: number;
  genres: string[];
  rating: number;
  reviewCount: number;
  overview: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterPath,
  releaseDate,
  runtime,
  genres,
  rating,
  reviewCount,
  overview,
}) => {
  const year = new Date(releaseDate).getFullYear();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-card border-border overflow-hidden">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterPath || "/placeholder.svg"}
          alt={`${title} poster`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating overlay */}
        <div className="absolute top-2 right-2 bg-black/80 rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1">
            <StarRating rating={rating} size="sm" />
            <span className="text-xs text-white font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <Link to={`/movie/${id}`}>
              <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors line-clamp-2 font-space-grotesk">
                {title}
              </h3>
            </Link>
            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </div>
              {runtime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{runtime}min</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 2).map((genre) => (
              <Badge key={genre} className="text-xs bg-muted text-muted-foreground">
                {genre}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{overview}</p>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <StarRating rating={rating} size="sm" />
              <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{reviewCount} reviews</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
