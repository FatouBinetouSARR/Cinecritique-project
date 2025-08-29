import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiFetch';

export interface Review {
  _id: string;
  movieId: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  rating: number;
  comment: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  followers?: string[];
  bio?: string;
  reviews?: number;
  moviesWatched?: number;
  lists?: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const usePopularReviews = () => {
  const [popularReviews, setPopularReviews] = useState<Review[]>([]);
  const [randomUsers, setRandomUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les critiques populaires
        const reviewsResponse = await apiFetch('/api/reviews/popular?limit=10');
        console.log('Réponse de l\'API (status):', reviewsResponse.status);
        if (!reviewsResponse.ok) {
          const errorText = await reviewsResponse.text();
          console.error('Erreur API:', errorText);
          throw new Error('Erreur lors de la récupération des critiques populaires');
        }
        const reviewsData: ApiResponse<Review[]> = await reviewsResponse.json();
        console.log('Données reçues:', reviewsData);
        
        if (reviewsData.error) {
          throw new Error(reviewsData.error);
        }
        
        // Récupérer des utilisateurs aléatoires
        const usersResponse = await apiFetch('/api/users/random?limit=3');
        if (!usersResponse.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const usersData: ApiResponse<User[]> = await usersResponse.json();
        
        if (usersData.error) {
          throw new Error(usersData.error);
        }
        
        setPopularReviews(reviewsData.data || []);
        setRandomUsers(usersData.data || []);
        setError(null);
      } catch (err) {
        console.error('Erreur dans usePopularReviews:', err);
        const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
        setError(errorMessage);
        // Réinitialiser les états en cas d'erreur
        setPopularReviews([]);
        setRandomUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Nettoyage en cas de démontage du composant
    return () => {
      // Annuler les requêtes en cours si nécessaire
    };
  }, []);

  return { popularReviews, randomUsers, loading, error };
};
