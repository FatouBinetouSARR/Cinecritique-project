// src/components/reviews/ReviewCard.tsx
import React, { useState } from "react";
import { Star, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "../../ui/button";

interface ReviewCardProps {
  reviewId: string; // toujours string
  comment: string;
  rating: number;
  userName: string;
  likes?: number;
  isOwner?: boolean;
  onEdit?: (id: string, updatedText: string, updatedRating: number) => void;
  onDelete?: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  comment,
  rating,
  userName,
  likes = 0,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(comment);
  const [editRating, setEditRating] = useState(rating);

  // ⭐ rendu étoiles
  const renderStars = (rate: number, editable = false) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={editable ? () => setEditRating(i + 1) : undefined}
        className={`w-5 h-5 ${editable ? "cursor-pointer" : ""} ${
          i < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
        }`}
      />
    ));

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:bg-neutral-800/60 transition">
      <div className="flex justify-between items-start gap-4">
        {/* Contenu principal */}
        <div className="flex-1">
          <p className="text-sm text-neutral-400 mb-1">{userName}</p>

          {isEditing ? (
            <>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full rounded-xl bg-neutral-950 border border-neutral-700 text-white p-2 mb-3 resize-none focus:ring-2 focus:ring-yellow-500/30"
                rows={3}
              />
              <div className="flex items-center gap-1 mb-3">
                {renderStars(editRating, true)}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">{renderStars(rating)}</div>
              <p className="text-neutral-200 mt-2">{comment}</p>
            </>
          )}
        </div>

        {/* Actions propriétaire */}
        {isOwner && (
          <div className="flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-500"
                  onClick={() => {
                    onEdit?.(reviewId, editComment, editRating);
                    setIsEditing(false);
                  }}
                >
                  <Save className="w-4 h-4 mr-1" /> Sauvegarder
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600"
                  onClick={() => {
                    setEditComment(comment);
                    setEditRating(rating);
                    setIsEditing(false);
                  }}
                >
                  <X className="w-4 h-4 mr-1" /> Annuler
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="bg-neutral-700 hover:bg-neutral-600"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Modifier
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-500"
                  onClick={() => onDelete?.(reviewId)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-neutral-500 mt-3">{likes} 👍</p>
    </div>
  );
};
