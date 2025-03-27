
export const generateVisitorData = (visitorsToday: number) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const currentDay = new Date().getDay();
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
    lastWeekData[currentDay - 1].Visiteurs = visitorsToday;
  }
  
  return lastWeekData;
};

export const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
