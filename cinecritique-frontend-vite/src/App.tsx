import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import { Layout } from "./layouts/Layout";

// Pages principales
import { HomePage } from "./components/home/HomePage";
import ProfilePage from "./components/profile/ProfilePage";

// Pages Films
import { MoviesPage } from "./components/movies/MoviesPage";
import { MoviesGridPage } from "./components/movies/MoviesGridPage";
import { MoviesSearchResults } from "./components/movies/MoviesSearchResults";
import { MoviesId } from "./components/movies/MoviesId";

// Pages Personnes / Critiques
import { PersonPage } from "./components/acteurs/ActeursPage";
import { ReviewsPage } from "./components/reviews/ReviewsPage";
import { CriticsPage } from "./components/membres/MembrePage";

// Auth
import { AuthProvider } from "./auth/AuthProvider";
import { PrivateRoute } from "./auth/PrivateRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />

      <Layout>
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<HomePage />} />

          {/* Profil protégé */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Personne */}
          <Route path="/person/:id" element={<PersonPage />} />

          {/* Films */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MoviesId />} />
          <Route path="/search" element={<MoviesSearchResults />} />
          <Route path="/:type" element={<MoviesGridPage />} />

          {/* Critiques */}
          <Route
            path="/my-reviews"
            element={
              <PrivateRoute>
                <ReviewsPage />
              </PrivateRoute>
            }
          />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/critics" element={<CriticsPage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="text-center p-10">
                Page non trouvée 😢
              </div>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
