import { Routes, Route } from "react-router-dom";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/top-rated" element={<TopRatedMovies />} />
        <Route path="/profile" element={<Profile />} /> 
        */}
      </Routes>
    </Layout>
  );
};

export default App;
