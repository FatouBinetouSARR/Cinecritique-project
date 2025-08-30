import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

// Récupérer les avis populaires
export const getPopularReviews = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_BASE}/reviews/popular`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des avis populaires:', error);
    throw error;
  }
};

// Récupérer les critiques les plus actifs
export const getTopCritics = async (limit = 3) => {
  try {
    const response = await axios.get(`${API_BASE}/users/top-critics`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des critiques populaires:', error);
    throw error;
  }
};

// Vérifier si l'utilisateur actuel a aimé une critique
export const checkUserLikedReview = async (reviewId: string, token: string) => {
  try {
    const response = await axios.get(`${API_BASE}/reviews/${reviewId}/like`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.isLiked;
  } catch (error) {
    console.error('Erreur lors de la vérification du like:', error);
    return false;
  }
};

// Ajouter/retirer un like à une critique
export const toggleReviewLike = async (reviewId: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE}/reviews/${reviewId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du like:', error);
    throw error;
  }
};

// Modifier une critique
export const updateReview = async (movieId: string, reviewId: string, data: { rating?: number; comment?: string }, token: string) => {
  try {
    const response = await axios.put(
      `${API_BASE}/movies/${movieId}/reviews/${reviewId}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la modification de la critique:', error);
    throw error;
  }
};

// Supprimer une critique
export const deleteReview = async (movieId: string, reviewId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE}/movies/${movieId}/reviews/${reviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la critique:', error);
    throw error;
  }
};
