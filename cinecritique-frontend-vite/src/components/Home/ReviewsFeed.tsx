// src/components/home/ReviewsFeed.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReviewCard } from "../reviews/ReviewCard";
import { getPopularReviews, getTopCritics } from "../../api/reviewService";

interface Review {
  _id: string;
  movieId: string;
  rating: number;
  comment: string;
  likes: number;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TopCritic {
  _id: string;
  reviewCount: number;
  totalLikes: number;
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

export const ReviewsFeed: React.FC = () => {
  const [popularReviews, setPopularReviews] = useState<Review[]>([]);
  const [topCritics, setTopCritics] = useState<TopCritic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsData, criticsData] = await Promise.all([
          getPopularReviews(5),
          getTopCritics(3)
        ]);
        
        setPopularReviews(reviewsData);
        setTopCritics(criticsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8 bg-neutral-950">
        <div className="text-center text-white">Chargement...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 md:px-8 bg-neutral-950">
        <div className="text-center text-red-400">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-neutral-950">
      {/* Colonne principale : Feed de reviews */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Avis populaires</h2>
          <Link
            to="/reviews"
            className="text-yellow-400 hover:underline font-medium"
          >
            Plus →
          </Link>
        </div>

{popularReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Aucun avis populaire disponible pour le moment.</p>
            <p className="text-sm mt-2">Soyez le premier à laisser une critique !</p>
          </div>
        ) : (
          popularReviews.map((review) => (
            <div key={review._id} className="mb-6">
              <ReviewCard
                reviewId={review._id}
                comment={review.comment}
                rating={review.rating}
                userName={review.user?.username || "Utilisateur inconnu"}
                likes={review.likes}
                movieId={review.movieId}
                movieTitle={`Film #${review.movieId}`}
                userId={review.user?._id}
                onUpdate={() => {
                  // Recharger les données après modification
                  const fetchData = async () => {
                    try {
                      const reviewsData = await getPopularReviews(5);
                      setPopularReviews(reviewsData);
                    } catch (err) {
                      console.error('Erreur lors du rechargement:', err);
                    }
                  };
                  fetchData();
                }}
                onDelete={() => {
                  // Recharger les données après suppression
                  const fetchData = async () => {
                    try {
                      const reviewsData = await getPopularReviews(5);
                      setPopularReviews(reviewsData);
                    } catch (err) {
                      console.error('Erreur lors du rechargement:', err);
                    }
                  };
                  fetchData();
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Sidebar : Critiqueurs populaires */}
      <aside className="lg:col-span-1">
        <div className="bg-neutral-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">Critiqueurs populaires</h3>
          <div className="space-y-4">
            {topCritics.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">Aucun critique disponible</p>
              </div>
            ) : (
              topCritics.map((critic, index) => (
                <div key={critic._id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <span className="text-black font-bold text-lg">
                        {critic.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {critic.user?.username || "Utilisateur inconnu"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {critic.reviewCount} critiques
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </section>
  );
};
