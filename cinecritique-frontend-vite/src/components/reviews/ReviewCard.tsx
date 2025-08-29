// src/components/reviews/ReviewCard.tsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Star, ThumbsUp } from "lucide-react";
import { AuthContext } from "../../lib/AuthContext";
import { toast } from "react-hot-toast";
import axios from 'axios';

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
  reviewId,
  comment,
  rating,
  userName,
  likes: initialLikes = 0,
  movieId,
  movieTitle,
}) => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;
  const accessToken = authContext?.accessToken || null;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur a déjà liké cette critique
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews/${reviewId}/like`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error("Erreur lors de la vérification du like:", error);
      }
    };

    if (isAuthenticated) {
      checkIfLiked();
    }
  }, [reviewId, isAuthenticated, accessToken]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Veuvez vous connecter pour aimer une critique");
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `http://localhost:3000/api/reviews/${reviewId}/like`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      setLikeCount(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Erreur lors du like:", error);
      toast.error("Une erreur est survenue lors du like");
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Footer avec bouton de like */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-1 text-xs ${isLiked ? 'text-blue-400' : 'text-neutral-500'} hover:text-blue-400 transition-colors disabled:opacity-50`}
          aria-label={isLiked ? "Retirer le like" : "Aimer cette critique"}
        >
          <ThumbsUp className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};
