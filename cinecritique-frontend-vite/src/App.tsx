import { Routes, Route } from "react-router-dom";
import { HomePage } from "./components/home/HomePage";
import { Layout } from "./layouts/Layout";
import Login from "./components/login-register/Login";
import Register from "./components/login-register/Register";
import Profile from "./components/profile/Profile";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Toaster } from "react-hot-toast";

import { TopRatedPage } from "./components/top-rated/TopRatedPage"; 
import { MyReviewsPage } from "./components/reviews/MyReviewsPage";

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} /> 
      <Layout>
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<HomePage />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profil (protégé) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 🎬 Liste des films les mieux notés */}
          <Route path="/top-rated" element={<TopRatedPage />} />

          {/* Mes critiques */}
          <Route path="/my-reviews" element={
            // <PrivateRoute>
              <MyReviewsPage/>
            // </PrivateRoute>
          } />

          {/* Page 404 */}
          <Route
            path="*"
            element={<div className="text-center p-10">Page non trouvée 😢</div>}
          />
        </Routes>
      </Layout>
    </>
  );
};

export default App;
