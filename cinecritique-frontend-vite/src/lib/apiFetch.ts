// src/lib/apiFetch.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  
  // Ajouter le token d'accès s'il est disponible
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // Définir le Content-Type à application/json uniquement si ce n'est pas un FormData
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  } else {
    // Si c'est un FormData, laisser le navigateur définir le Content-Type avec la boundary
    headers.delete('Content-Type');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Si le token a expiré, essayer de le rafraîchir
  if (response.status === 401 && path !== '/api/auth/refresh') {
    try {
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        if (data.accessToken) {
          accessToken = data.accessToken;
          // Mettre à jour le token dans l'en-tête et réessayer la requête
          headers.set('Authorization', `Bearer ${data.accessToken}`);
          
          const retryResponse = await fetch(`${API_URL}${path}`, {
            ...options,
            headers,
            credentials: 'include',
          });
          return retryResponse;
        }
      }
      // Si le rafraîchissement échoue, déconnecter l'utilisateur
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unauthorized'));
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unauthorized'));
      }
    }
  }

  return response;
}
