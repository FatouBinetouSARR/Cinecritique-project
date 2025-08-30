import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ThumbsUp, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../lib/useAuth";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { updateReview, deleteReview } from "../../api/reviewService";

interface ReviewCardProps {
  reviewId: string;
  comment: string;
  rating: number;
  userName: string;
  likes?: number;
  movieId?: string | number;
  movieTitle?: string;
  userId?: string;
  onUpdate?: (id: string, updatedText: string, updatedRating: number) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isOwner?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  comment,
  rating,
  userName,
  likes: initialLikes = 0,
  movieId,
  movieTitle,
  userId,
  onUpdate,
  onDelete,
  isOwner,
}) => {
  const { isAuthenticated, accessToken, user } = useAuth();
  const currentUserId = user?.id;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(comment);
  const [editRating, setEditRating] = useState(rating);

  const owner = isOwner ?? currentUserId === userId;

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews/${reviewId}/like`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error("Erreur lors de la vérification du like:", error);
      }
    };
    if (isAuthenticated) checkIfLiked();
  }, [reviewId, isAuthenticated, accessToken]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error("Veuillez vous connecter pour aimer une critique");
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/reviews/${reviewId}/like`,
        {},
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
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

  const handleUpdate = async () => {
    if (!accessToken || !movieId) return;
    try {
      await updateReview(movieId.toString(), reviewId, {
        rating: editRating,
        comment: editComment
      }, accessToken);
      toast.success("Critique modifiée avec succès");
      setIsEditing(false);
      onUpdate?.(reviewId, editComment, editRating);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification de la critique");
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !movieId) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette critique ?")) return;
    try {
      await deleteReview(movieId.toString(), reviewId, accessToken);
      toast.success("Critique supprimée avec succès");
      onDelete?.(reviewId);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la critique");
    }
  };

  const renderStars = (rate: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
      />
    ));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:bg-neutral-800/60 transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
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

          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <button key={i} onClick={() => setEditRating(i + 1)} className="focus:outline-none">
                    <Star
                      className={`w-5 h-5 cursor-pointer ${
                        i < editRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full p-2 bg-neutral-800 text-white rounded border border-neutral-700 focus:border-yellow-400 focus:outline-none resize-none"
                rows={3}
                maxLength={3000}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-yellow-400 text-black text-xs font-medium rounded hover:bg-yellow-500 transition-colors"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditComment(comment);
                    setEditRating(rating);
                  }}
                  className="px-3 py-1 bg-neutral-700 text-white text-xs font-medium rounded hover:bg-neutral-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">{renderStars(rating)}</div>
              <p className="text-neutral-200 mt-2">{comment}</p>
            </>
          )}
        </div>

        {owner && !isEditing && (
          <div className="flex gap-1">
            <button onClick={() => setIsEditing(true)} className="p-1 text-neutral-400 hover:text-yellow-400 transition-colors" aria-label="Modifier la critique">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="p-1 text-neutral-400 hover:text-red-400 transition-colors" aria-label="Supprimer la critique">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
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
      )}
    </div>
  );
};
