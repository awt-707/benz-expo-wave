
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, Car, MessageSquare, Building } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

// Import our components
import StatsCard from './dashboard/StatsCard';
import OverviewTab from './dashboard/OverviewTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import ActivityTab from './dashboard/ActivityTab';
import { generateVisitorData, formatDate } from './dashboard/dashboardUtils';

interface DashboardStats {
  counts: {
    vehicles: number;
    messages: number;
    unreadMessages: number;
    visitorsToday: number;
    visitorsWeek: number;
  };
  recentActivities: {
    _id: string;
    type: string;
    action: string;
    timestamp: string;
    details: string;
    user?: string;
  }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        // Cette API n'existe pas encore côté serveur, on devrait utiliser /api/admin/visitors pour le moment
        const response = await fetch(`${API_BASE_URL}/admin/visitors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        
        // Adapter la réponse au format attendu
        const visitorData = await response.json();
        
        // Récupérer les données des véhicules et messages depuis d'autres endpoints
        const vehiclesResponse = await fetch(`${API_BASE_URL}/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const messagesResponse = await fetch(`${API_BASE_URL}/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const activitiesResponse = await fetch(`${API_BASE_URL}/admin/activities?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!vehiclesResponse.ok || !messagesResponse.ok || !activitiesResponse.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const vehicles = await vehiclesResponse.json();
        const messages = await messagesResponse.json();
        const activities = await activitiesResponse.json();
        
        // Construire l'objet stats à partir des différentes réponses
        setStats({
          counts: {
            vehicles: vehicles.length || 0,
            messages: messages.length || 0,
            unreadMessages: messages.filter((m: any) => !m.read).length || 0,
            visitorsToday: visitorData.visitorsLast24Hours || 0,
            visitorsWeek: visitorData.visitorsLast7Days || 0
          },
          recentActivities: activities || []
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        
        // Mock data en cas d'erreur
        setStats({
          counts: {
            vehicles: 24,
            messages: 18,
            unreadMessages: 7,
            visitorsToday: 143,
            visitorsWeek: 1258
          },
          recentActivities: Array(5).fill(null).map((_, i) => ({
            _id: i.toString(),
            type: ['admin', 'vehicle', 'message', 'visitor'][Math.floor(Math.random() * 4)],
            action: 'Action simulée',
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            details: 'Détails simulés pour le tableau de bord',
            user: ['admin', 'commercial'][Math.floor(Math.random() * 2)]
          }))
        });
        
        toast({
          title: "Données simulées",
          description: "Utilisation de données simulées en attendant la configuration complète de l'API.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const visitorData = generateVisitorData(stats?.counts.visitorsToday || 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Véhicules"
          value={stats?.counts.vehicles || 0}
          icon={<Car size={20} />}
          trend={{ value: "+12% ce mois", positive: true }}
        />
        
        <StatsCard 
          title="Messages"
          value={stats?.counts.messages || 0}
          icon={<MessageSquare size={20} />}
          trend={{ value: `${stats?.counts.unreadMessages || 0} non lus`, positive: false }}
        />
        
        <StatsCard 
          title="Visiteurs aujourd'hui"
          value={stats?.counts.visitorsToday || 0}
          icon={<Users size={20} />}
          trend={{ value: "+8% vs hier", positive: true }}
        />
        
        <StatsCard 
          title="Visiteurs (7j)"
          value={stats?.counts.visitorsWeek || 0}
          icon={<Building size={20} />}
          trend={{ value: "+23% vs semaine précédente", positive: true }}
        />
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyse des visiteurs</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab stats={stats} visitorData={visitorData} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityTab 
            activities={stats?.recentActivities || []} 
            formatDate={formatDate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
