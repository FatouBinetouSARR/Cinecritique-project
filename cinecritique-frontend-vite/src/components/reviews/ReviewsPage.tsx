// src/components/reviews/ReviewsPage.tsx
import { useState } from "react";
import { Film } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { dataUserReviews } from "../../data/dataReviews";

interface ReviewsPageProps {
  mode?: "all" | "mine";
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ mode = "all" }) => {
  const currentUserId = 1; // ← à remplacer par ton auth réelle

  // Sélection des reviews en fonction du mode
  const initialReviews =
    mode === "mine"
      ? dataUserReviews.filter((r) => r.userId === currentUserId)
      : dataUserReviews;

  const [reviews, setReviews] = useState(initialReviews);

  const handleDeleteReview = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditReview = (id: number) => {
    console.log("Editing review", id);
  };

  return (
    <div className="min-h-screen text-gray-100">
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

      <main className="container mx-auto px-4 py-8 space-y-6">
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
