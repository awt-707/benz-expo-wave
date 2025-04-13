

/**
 * Utilitaire pour obtenir l'URL correcte d'une image
 * @param imagePath Chemin de l'image
 * @param fallbackImage Image de secours à afficher si l'image n'est pas valide
 * @returns URL formatée de l'image
 */
export const getImageUrl = (imagePath: string, fallbackImage: string = '/placeholder-car.png'): string => {
  if (!imagePath) return fallbackImage;

  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http')) return imagePath;

  // Si le chemin commence par "/", s'assurer qu'il n'y a pas de double slash avec le préfixe API
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Construire l'URL complète en utilisant le préfixe API
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Normaliser les slashes pour éviter les doubles barres obliques
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Hook personnalisé pour charger une image avec gestion d'erreur
 * @param src URL de l'image
 * @param alt Texte alternatif
 * @param className Classes CSS
 * @param fallbackSrc Image de secours
 * @returns Props pour l'élément image
 */
export const useImageWithFallback = (
  src: string,
  alt: string,
  className: string = "",
  fallbackSrc: string = '/placeholder-car.png'
) => {
  const imageUrl = getImageUrl(src, fallbackSrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Image failed to load: ${src}`);
    (e.target as HTMLImageElement).src = fallbackSrc;
  };

  return {
    src: imageUrl,
    alt,
    className,
    onError: handleError,
  };
};
