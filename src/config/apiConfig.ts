
// Configuration API
export const API_CONFIG = {
  // L'URL de base de l'API - remplacez cette valeur par l'URL de votre serveur déployé
  BASE_URL: import.meta.env.VITE_API_URL || "https://votre-serveur-backend.com/api",
  
  // Timeout pour les requêtes API (en millisecondes)
  TIMEOUT: 30000,
  
  // Configuration des retry en cas d'échec
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  },
  
  // Options par défaut pour fetch
  DEFAULT_OPTIONS: {
    headers: {
      "Content-Type": "application/json"
    }
  }
};

// Fonction utilitaire pour construire des URLs d'API
export const buildApiUrl = (endpoint: string): string => {
  // S'assure que l'endpoint commence par / si ce n'est pas le cas
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Supprime les slashes en double si l'URL de base se termine par un slash
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
    ? API_CONFIG.BASE_URL.slice(0, -1)
    : API_CONFIG.BASE_URL;
  
  return `${baseUrl}${formattedEndpoint}`;
};
