// src/components/reviews/ReviewCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface ReviewCardProps {
  reviewId: string;
  comment: string;
  rating: number;
  userName: string;
  likes?: number;
  movieId?: string | number;
  movieTitle?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  comment,
  rating,
  userName,
  likes = 0,
  movieId,
  movieTitle,
}) => {
  // ⭐ rendu étoiles
  const renderStars = (rate: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
        }`}
      />
    ));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:bg-neutral-800/60 transition">
      <div className="flex justify-between items-start gap-4">
        {/* Contenu principal */}
        <div className="flex-1">
          {/* Titre du film si disponible */}
          {movieTitle && movieId !== undefined && (
            <div className="mb-1">
              <Link
                to={`/movies/${movieId}`}
                className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors"
              >
                {movieTitle}
              </Link>
            </div>
          )}

          <p className="text-xs text-neutral-400 mb-1">{userName}</p>
          <div className="flex items-center gap-1">{renderStars(rating)}</div>
          <p className="text-neutral-200 mt-2">{comment}</p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-neutral-500 mt-3">{likes} 👍</p>
    </div>
  );
};
