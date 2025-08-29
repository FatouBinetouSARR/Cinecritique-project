// src/components/home/ReviewsFeed.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ReviewCard } from "../reviews/ReviewCard";
import { dataUserReviews } from "../../data/dataReviews";
import { dataUsers } from "../../data/dataUser";

// Données des films (à remplacer par un appel API dans une vraie application)
const moviesData = [
  { id: 1, title: "Oppenheimer" },
  { id: 2, title: "Barbie" },
  { id: 3, title: "Dune: Deuxième Partie" },
  { id: 5, title: "The Batman" },
  { id: 7, title: "Avatar: La Voie de l'Eau" },
];

export const ReviewsFeed: React.FC = () => {

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

        {dataUserReviews.map((review) => {
          const user = dataUsers.find((u) => u.id === review.userId);
          const movie = moviesData.find((m) => m.id === review.movieId);
          
          return (
            <div key={review.id} className="mb-6">
              <ReviewCard
                reviewId={review.id.toString()}
                comment={review.comment}
                rating={review.rating}
                userName={user?.name || "Utilisateur inconnu"}
                likes={review.likes}
                movieId={review.movieId}
                movieTitle={movie?.title || `Film #${review.movieId}`}
              />
            </div>
          );
        })}
      </div>

      {/* Sidebar : Espace pour d'autres fonctionnalités */}
      <aside className="lg:col-span-1">
        {/* Vous pouvez ajouter d'autres fonctionnalités ici plus tard */}
      </aside>
    </section>
  );
};
