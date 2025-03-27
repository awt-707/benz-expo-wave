
export const generateVisitorData = (visitorsToday: number) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const date = new Date();
  const currentDay = date.getDay();
  // Ajuster pour que dimanche soit 6 et non 0
  const indexToday = currentDay === 0 ? 6 : currentDay - 1;
  
  const lastWeekData = days.map((day, i) => {
    // Generate more realistic data, highest on weekend
    const baseValue = 100 + Math.round(Math.random() * 50);
    const weekendMultiplier = (i === 5 || i === 6) ? 1.5 : 1;
    
    return {
      name: day,
      Visiteurs: Math.round(baseValue * weekendMultiplier)
    };
  });
  
  // Add data for today
  if (visitorsToday) {
    lastWeekData[indexToday].Visiteurs = visitorsToday;
  }
  
  return lastWeekData;
};

export const formatDate = (timestamp: string, format: 'short' | 'long' | 'full' = 'short'): string => {
  const date = new Date(timestamp);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      });
      
    case 'long':
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      
    case 'full':
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      
    default:
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
  }
};

// Ajoute une fonction pour calculer la différence en pourcentage
export const calculatePercentageDifference = (current: number, previous: number): string => {
  if (previous === 0) return "+100%";
  
  const difference = current - previous;
  const percentage = (difference / previous) * 100;
  
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}%`;
};
