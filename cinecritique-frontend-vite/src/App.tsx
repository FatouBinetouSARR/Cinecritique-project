import { Routes, Route } from "react-router-dom";
import { HomePage } from "./components/home/HomePage";
import { Layout } from "./layouts/Layout";
import Login from "./components/login-register/Login";
import Register from "./components/login-register/Register";
import Profile from "./components/profile/Profile";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Toaster position="top-right" reverseOrder={false} /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </>
  );
};

export default App;
