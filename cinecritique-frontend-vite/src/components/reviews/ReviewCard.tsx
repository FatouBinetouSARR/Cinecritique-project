// src/components/reviews/ReviewCard.tsx
import React, { useState } from "react";
import { Star, Edit, Trash2, Save } from "lucide-react";
import { Button } from "../../ui/button";

interface ReviewCardProps {
  reviewId: string;
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

  const renderStars = (rate: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
      />
    ));

  return (
    <div className="rounded-lg shadow p-4 hover:shadow-lg transition bg-gray-800">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400 mb-1">{userName}</p>
            {isEditing ? (
              <>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full rounded-md bg-gray-900 border border-gray-700 text-white p-2 mb-2"
                  rows={2}
                />
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      onClick={() => setEditRating(i + 1)}
                      className={`w-5 h-5 cursor-pointer ${
                        i < editRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">{renderStars(rating)}</div>
                <p className="text-white/80 mt-1">{comment}</p>
              </>
            )}
          </div>

          {isOwner && (
            <div className="flex gap-2 ml-4">
              {isEditing ? (
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
              ) : (
                <>
                  <Button
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-500"
                    onClick={() => onDelete?.(reviewId)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">{likes} likes</p>
      </div>
    </div>
  );
};
