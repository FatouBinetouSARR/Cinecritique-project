import axios from 'axios';

// Création d'une instance Axios avec une URL de base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Remplacez par l'URL de votre API
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que ce n'est pas une tentative de rafraîchissement
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenter de rafraîchir le token
        const response = await axios.post('http://localhost:3000/api/auth/refresh', {}, {
          withCredentials: true
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Mettre à jour le header d'autorisation
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Renvoyer la requête originale avec le nouveau token
        return api(originalRequest);
      } catch (error) {
        // En cas d'échec de rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };
