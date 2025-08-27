// src/components/home/ReviewsFeed.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ReviewCard } from "../reviews/ReviewCard";
import { dataUserReviews } from "../../data/dataReviews";
import { dataUsers } from "../../data/dataUser";
import { UserCard } from "../profile/ProfileCard";

export const ReviewsFeed: React.FC = () => {
  const currentUserId = 1; // ID de l'utilisateur connecté (à adapter selon ton contexte)

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

        {dataUserReviews.map((r) => {
          const user = dataUsers.find((u) => u.id === r.userId);
          return (
            <Link key={r.id} to={`/movies/${r.movieId}`}>
              <ReviewCard
                reviewId={r.id.toString()}
                comment={r.comment}
                rating={r.rating}
                userName={user?.name || "Utilisateur inconnu"}
                likes={r.likes}
                isOwner={r.userId === currentUserId}
              />
            </Link>
          );
        })}
      </div>

      {/* Sidebar : Utilisateurs populaires */}
      <aside className="lg:col-span-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Critiques populaires</h2>
          <Link
            to="/critics"
            className="text-yellow-400 hover:underline font-medium"
          >
            Plus →
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {dataUsers.map((critic) => (
            <UserCard
              key={critic.id}
              id={critic.id}
              name={critic.name}
              avatar={critic.avatar}
              followers={critic.followers}
              bio={critic.bio}
            />
          ))}
        </div>
      </aside>
    </section>
  );
};
