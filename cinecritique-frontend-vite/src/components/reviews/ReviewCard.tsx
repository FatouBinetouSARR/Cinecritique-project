// src/components/Reviews/ReviewCard.tsx
import React from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { dataMovies } from "../../data/dataMovies";
import { dataUsers } from "../../data/dataUser";
import { dataUserReviews } from "../../data/dataReviews"; 

interface ReviewCardProps {
  reviewId: number;
  isOwner?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  // 👉 On retrouve la review correspondante
  const review = dataUserReviews.find((r) => r.id === reviewId);
  if (!review) return null;

  const movie = dataMovies.find((m) => m.id === review.movieId);
  const user = dataUsers.find((u) => u.id === review.userId);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
        }`}
      />
    ));

  return (
    <div className=" rounded-lg shadow p-4 hover:shadow-lg transition">
      <div className="flex gap-4">
        {/* Affiche du film */}
        <img
          src={movie?.posterPath} // ⚠️ garder posterPath pour correspondre à ton ancien dataMovies
          alt={movie?.title}
          className="w-16 h-24 object-cover rounded-md"
        />

        {/* Contenu de la critique */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{movie?.title}</h3>

          {/* Étoiles + note */}
          <div className="flex items-center gap-2">
            {renderStars(review.rating)}
            <span className="text-sm text-yellow-400">{review.rating}/5</span>
          </div>

          {/* Commentaire */}
          <p className="text-sm text-white/80 mt-2">{review.comment}</p>

          {/* Auteur + likes */}
          <p className="text-xs text-gray-400 mt-1">
            par {user?.name} • {review.likes} likes
          </p>

          {/* Boutons si owner */}
          {isOwner && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => onEdit?.(review.id)}
                className="bg-gray-700 hover:bg-gray-600"
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button
                size="sm"
                onClick={() => onDelete?.(review.id)}
                className="bg-red-600 hover:bg-red-500"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
