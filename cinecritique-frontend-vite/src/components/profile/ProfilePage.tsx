// src/pages/ProfilePage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { dataUsers } from "../../data/dataUser";

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = dataUsers.find((u) => u.id === Number(id));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Utilisateur introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.bio}</p>
            <p className="text-sm text-gray-500">{user.followers}</p>
          </div>
        </div>
      </header>

      {/* INFOS */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{user.moviesWatched}</p>
            <p className="text-gray-400 text-sm">Films vus</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.lists}</p>
            <p className="text-gray-400 text-sm">Listes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.likes}</p>
            <p className="text-gray-400 text-sm">Likes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.reviews}</p>
            <p className="text-gray-400 text-sm">Critiques</p>
          </div>
        </div>

        {/* Placeholder des critiques */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Dernières critiques</h2>
          {user.reviewsList && user.reviewsList.length > 0 ? (
            <ul className="space-y-3">
              {user.reviewsList.map((review, index) => (
                <li
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg text-gray-200"
                >
                  <p className="font-semibold">{review.movie}</p>
                  <p className="text-sm text-gray-400">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Pas encore de critiques.</p>
          )}
        </section>

        {/* Bouton retour */}
        <div className="mt-10">
          <Link
            to="/critics"
            className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
          >
            ⬅ Retour aux critiques
          </Link>
        </div>
      </main>
    </div>
  );
};
