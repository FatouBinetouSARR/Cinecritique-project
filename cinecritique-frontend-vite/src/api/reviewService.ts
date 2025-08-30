import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Récupérer les avis populaires
export const getPopularReviews = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/popular`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des avis populaires:', error);
    throw error;
  }
};

// Récupérer les critiques les plus actifs
export const getTopReviewers = async (limit = 3) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/top-reviewers`, {
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
    const response = await axios.get(`${API_URL}/reviews/${reviewId}/like`, {
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
      `${API_URL}/reviews/${reviewId}/like`,
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
