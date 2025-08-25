// src/components/reviews/ReviewsPage.tsx
import { useState } from "react";
import { Film, Star } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { dataUserReviews } from "../../data/dataReviews";

interface ReviewsPageProps {
  mode?: "all" | "mine";
  movieId?: number;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ mode = "all", movieId }) => {
  const currentUserId = 1; // ← à remplacer par ton auth réelle
  // const currentUserName = "Utilisateur"; // placeholder

  let initialReviews = dataUserReviews;

  if (movieId) {
    initialReviews = initialReviews.filter((r) => r.movieId === movieId);
  }

  if (mode === "mine") {
    initialReviews = initialReviews.filter((r) => r.userId === currentUserId);
  }

  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleDeleteReview = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditReview = (id: number) => {
    console.log("Editing review", id);
  };

  const handleAddReview = () => {
    if (!newReview.trim() || rating === 0) return;

    const newReviewObj = {
      id: Date.now(),
      movieId: movieId!,
      userId: currentUserId,
      comment: newReview,
      rating,
      likes: 0,
    };

    setReviews((prev) => [newReviewObj, ...prev]);
    setNewReview("");
    setRating(0);
  };

  const renderStarsInput = () =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => setRating(i + 1)}
        className={`w-6 h-6 cursor-pointer ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
        }`}
      />
    ));

  return (
    <div className="text-gray-100">
      {!movieId && (
        <header className="border-b border-gray-700 bg-card">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">
                {mode === "mine" ? "Mes critiques" : "Toutes les critiques"}
              </h1>
            </div>
            <p className="text-gray-400">
              {mode === "mine"
                ? "Gérez et modifiez vos critiques de films"
                : "Découvrez les avis récents et populaires des spectateurs"}
            </p>
            <span className="text-sm text-gray-400 mt-2 block">
              {reviews.length} Critiques
            </span>
          </div>
        </header>
      )}

      <main className={`container mx-auto px-4 ${!movieId ? "py-8" : "py-4"} space-y-6`}>
        {/* 🔥 Formulaire si movieId est fourni */}
        {movieId && (
          <div className="bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold mb-2">Ajouter une critique</h3>
            <div className="flex items-center gap-2 mb-2">{renderStarsInput()}</div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Écris ton avis..."
              className="w-full rounded-md bg-gray-900 border border-gray-700 text-white p-2 mb-3"
              rows={3}
            />
            <button
              onClick={handleAddReview}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded"
            >
              Publier
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-400">Aucune critique disponible.</p>
        ) : (
          reviews.map((r) => (
            <ReviewCard
              key={r.id}
              reviewId={r.id}
              isOwner={mode === "mine"}
              onEdit={mode === "mine" ? handleEditReview : undefined}
              onDelete={mode === "mine" ? handleDeleteReview : undefined}
            />
          ))
        )}
      </main>
    </div>
  );
};
