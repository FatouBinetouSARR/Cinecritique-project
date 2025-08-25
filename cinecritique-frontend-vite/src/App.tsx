import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import { Layout } from "./layouts/Layout";

// Pages principales
import { HomePage } from "./components/home/HomePage";
import Login from "./components/login-register/Login";
import Register from "./components/login-register/Register";
import Profile from "./components/account/Account";

// Pages Films
import { MoviesPage } from "./components/movies/MoviesPage";
import { MoviesGridPage } from "./components/movies/MoviesGridPage";
import { MoviesSearchResults } from "./components/movies/MoviesSearchResults";
import { MoviesId } from "./components/movies/MoviesId";

// Pages Personnes / Critiques
import { PersonPage } from "./components/acteurs/ActeursPage";
import { ReviewsPage } from "./components/reviews/ReviewsPage";
import { CriticsPage } from "./components/membres/MembrePage";

// Auth / Routes privées (à décommenter si besoin)
// import { PrivateRoute } from "./auth/PrivateRoute";

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Layout>
        <Routes>
          {/* ---------------------- Accueil ---------------------- */}
          <Route path="/" element={<HomePage />} />

          {/* ---------------------- Auth ------------------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ---------------------- Profil (protégé) ------------- */}
          <Route
            path="/profile"
            element={
              // TODO: activer PrivateRoute pour sécuriser la page
              // <PrivateRoute>
                <Profile />
              // </PrivateRoute>
            }
          />

          {/* ---------------------- Personne --------------------- */}
          <Route path="/person/:id" element={<PersonPage />} />

          {/* ---------------------- Films ------------------------ */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MoviesId />} />
          <Route path="/search" element={<MoviesSearchResults />} />
          <Route path="/:type" element={<MoviesGridPage />} />

          {/* ---------------------- Critiques -------------------- */}
          <Route
            path="/my-reviews"
            element={
              // TODO: activer PrivateRoute si nécessaire
              // <PrivateRoute>
                <ReviewsPage />
              // </PrivateRoute>
            }
          />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/critics" element={<CriticsPage />} />

          {/* ---------------------- 404 -------------------------- */}
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
    </>
  );
};

export default App;
