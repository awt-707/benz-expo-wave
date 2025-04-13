
// Configuration API
export const API_CONFIG = {
  // L'URL de base de l'API - Now using a valid localhost URL for development
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  // Timeout pour les requêtes API (en millisecondes)
  TIMEOUT: 30000,

  // Configuration des retry en cas d'échec
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  },

  // Configuration de sécurité
  SECURITY: {
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes avant expiration
    TOKEN_KEY: 'adminToken',
    TOKEN_EXPIRY_CHECK_INTERVAL: 60 * 1000 // Vérifier l'expiration chaque minute
  },

  // Options par défaut pour fetch - fix credentials type
  DEFAULT_OPTIONS: {
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    credentials: 'same-origin' as RequestCredentials
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

// Vérifier si un token JWT est expiré
export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    return exp * 1000 < Date.now();
  } catch (e) {
    return true; // Si on ne peut pas décoder, on considère le token comme expiré
  }
};
