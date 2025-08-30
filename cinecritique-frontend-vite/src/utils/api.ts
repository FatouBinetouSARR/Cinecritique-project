import axios from "axios";

const api = axios.create({
  // VITE_API_URL is the backend origin WITHOUT /api; we append it here
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,
  withCredentials: true, // si tu utilises refreshToken en cookie
});

// Si tu stockes l'accessToken dans localStorage:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
