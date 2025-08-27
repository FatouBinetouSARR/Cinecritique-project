// src/components/reviews/ReviewsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Film, Star } from "lucide-react";
import api from "../../utils/api";
import type { Review } from "../../types/review";
import { ReviewCard } from "./ReviewCard";
import axios from "axios";

type ApiErrorData = { message?: string };
function hasApiMessage(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as ApiErrorData).message === "string"
  );
}

function getErrorMessage(e: unknown, fallback: string) {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data;
    if (hasApiMessage(data)) return data.message;
    return e.message ?? fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

// Hook pour récupérer l'utilisateur connecté
const useAuth = () => {
  const raw = localStorage.getItem("user"); // adapter selon ton stockage JWT / user
  return raw ? JSON.parse(raw) : null;
};

interface ReviewsPageProps {
  mode?: "all" | "mine";
  movieId?: number; // on garde number
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ mode = "all", movieId }) => {
  const auth = useAuth();
  const currentUserId = auth?.id;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Charger les critiques
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        if (mode === "mine") {
          const { data } = await api.get<Review[]>("/reviews/mine");
          setReviews(
            movieId
              ? data.filter(r => r.movieId.toString() === movieId.toString()) // conversion string
              : data
          );
        } else {
          if (!movieId) {
            setReviews([]);
            setError("Aucun film sélectionné");
            return;
          }
          const { data } = await api.get<Review[]>(`/movies/${movieId}/reviews`);
          setReviews(data);
        }
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Erreur de chargement"));
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [mode, movieId]);

  // ⭐ Ajouter une critique
  const handleAddReview = async () => {
    if (!movieId || !newReview.trim() || rating === 0) return;
    try {
      const { data } = await api.post<Review>(`/movies/${movieId}/reviews`, {
        movieId,
        rating,
        comment: newReview,
      });
      setReviews(prev => [data, ...prev]);
      setNewReview("");
      setRating(0);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Impossible d’ajouter la critique"));
    }
  };

  // ❌ Supprimer
  const handleDeleteReview = async (id: string) => {
    try {
      const found = reviews.find(r => r._id === id);
      const movieIdToUse = movieId || found?.movieId;
      if (!movieIdToUse) throw new Error("movieId introuvable pour cette critique");
      await api.delete(`/movies/${movieIdToUse}/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Impossible de supprimer"));
    }
  };

  // ✏️ Modifier
  const handleEditReview = async (id: string, updatedText: string, updatedRating: number) => {
    try {
      const found = reviews.find(r => r._id === id);
      const movieIdToUse = movieId || found?.movieId;
      if (!movieIdToUse) throw new Error("movieId introuvable pour cette critique");
      const { data } = await api.put<Review>(`/movies/${movieIdToUse}/reviews/${id}`, {
        comment: updatedText,
        rating: updatedRating,
      });
      setReviews(prev => prev.map(r => (r._id === id ? data : r)));
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Impossible de modifier"));
    }
  };

  // Moyenne des notes locale
  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const renderStarsInput = () =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => setRating(i + 1)}
        className={`w-6 h-6 cursor-pointer ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
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
            <span className="text-sm text-gray-400 mt-2 block">{reviews.length} Critiques</span>
          </div>
        </header>
      )}

      <main className={`container mx-auto px-4 ${!movieId ? "py-8" : "py-4"} space-y-6`}>
        {error && <div className="text-red-400">{error}</div>}
        {loading && <div className="text-gray-400">Chargement…</div>}

        <div className="text-yellow-400 font-semibold">Moyenne des notes : {average.toFixed(1)} ⭐</div>

        {movieId && currentUserId && (
          <div className="bg-neutral-800 rounded-lg p-4 shadow">
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
          reviews.map(r => (
            <ReviewCard
              key={r._id}
              reviewId={r._id.toString()} // conversion en string
              comment={r.comment}
              rating={r.rating}
              userName={r.user?.username || r.user?.email || "Anonyme"}
              likes={r.likes || 0}
              isOwner={r.user?._id === currentUserId}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))
        )}
      </main>
    </div>
  );
};
