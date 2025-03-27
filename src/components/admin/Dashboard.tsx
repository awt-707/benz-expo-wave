
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Car, MessageSquare, Activity, Building, ArrowUpRight } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

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
        const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        
        // Mock data in case of error
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
          title: "Erreur",
          description: "Impossible de récupérer les statistiques réelles. Affichage de données simulées.",
          variant: "destructive",
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

  // Generate visitor data for charts
  const generateVisitorData = () => {
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
    if (stats) {
      lastWeekData[currentDay - 1].Visiteurs = stats.counts.visitorsToday;
    }
    
    return lastWeekData;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Car className="h-4 w-4 opacity-75" />;
      case 'message': return <MessageSquare className="h-4 w-4 opacity-75" />;
      case 'visitor': return <Users className="h-4 w-4 opacity-75" />;
      case 'admin': return <Activity className="h-4 w-4 opacity-75" />;
      default: return <Activity className="h-4 w-4 opacity-75" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Véhicules</p>
                <p className="text-3xl font-bold">{stats?.counts.vehicles || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <Car size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">+12% ce mois</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-3xl font-bold">{stats?.counts.messages || 0}</p>
              </div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-xs text-green-500 font-medium">{stats?.counts.unreadMessages || 0} non lus</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visiteurs aujourd'hui</p>
                <p className="text-3xl font-bold">{stats?.counts.visitorsToday || 0}</p>
              </div>
              <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
                <Users size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">+8% vs hier</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visiteurs (7j)</p>
                <p className="text-3xl font-bold">{stats?.counts.visitorsWeek || 0}</p>
              </div>
              <div className="p-2 bg-orange-100 text-orange-700 rounded-full">
                <Building size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">+23% vs semaine précédente</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyse des visiteurs</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des véhicules</CardTitle>
                <CardDescription>Par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: 'Disponibles', value: stats?.counts.vehicles ? Math.round(stats.counts.vehicles * 0.6) : 12 },
                    { name: 'Réservés', value: stats?.counts.vehicles ? Math.round(stats.counts.vehicles * 0.3) : 9 },
                    { name: 'Vendus', value: stats?.counts.vehicles ? Math.round(stats.counts.vehicles * 0.1) : 3 }
                  ]}
                  index="name"
                  categories={['value']}
                  valueFormatter={(value) => `${value} véhicules`}
                  colors={['#0ea5e9', '#f59e0b', '#10b981']}
                  className="h-80"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activité du site</CardTitle>
                <CardDescription>7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={generateVisitorData()}
                  index="name"
                  categories={['Visiteurs']}
                  colors={['#6366f1']}
                  valueFormatter={(value) => `${value} visiteurs`}
                  className="h-80"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Vue globale des messages</CardTitle>
              <CardDescription>Résumé mensuel</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={[
                  {
                    name: '01/09',
                    'Reçus': 12,
                    'Traités': 9
                  },
                  {
                    name: '08/09',
                    'Reçus': 18,
                    'Traités': 15
                  },
                  {
                    name: '15/09',
                    'Reçus': 15,
                    'Traités': 14
                  },
                  {
                    name: '22/09',
                    'Reçus': 20,
                    'Traités': 18
                  },
                  {
                    name: 'Aujourd\'hui',
                    'Reçus': stats?.counts.messages || 24,
                    'Traités': stats?.counts.messages ? stats.counts.messages - stats.counts.unreadMessages : 17
                  }
                ]}
                index="name"
                categories={['Reçus', 'Traités']}
                colors={['#8b5cf6', '#06b6d4']}
                valueFormatter={(value) => `${value} messages`}
                className="h-96"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des visiteurs</CardTitle>
              <CardDescription>
                Répartition des visiteurs par page et source
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Pages les plus visitées</h3>
                <div className="space-y-1.5">
                  {[
                    { page: "Accueil", visits: 532, percentage: 42 },
                    { page: "Véhicules", visits: 384, percentage: 30 },
                    { page: "Détails véhicule", visits: 168, percentage: 13 },
                    { page: "Contact", visits: 96, percentage: 8 },
                    { page: "À propos", visits: 88, percentage: 7 }
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-4 items-center gap-2">
                      <div className="col-span-2 font-medium">{item.page}</div>
                      <div className="col-span-1 text-sm text-muted-foreground text-right">{item.visits} visites</div>
                      <div className="col-span-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Sources de trafic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <PieChart
                      data={[
                        { name: 'Recherche Google', value: 68 },
                        { name: 'Direct', value: 15 },
                        { name: 'Réseaux sociaux', value: 10 },
                        { name: 'Liens externes', value: 7 }
                      ]}
                      index="name"
                      categories={['value']}
                      valueFormatter={(value) => `${value}%`}
                      colors={['#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6']}
                      className="h-60"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: "Pages vues", value: "1,428", change: "+12%" },
                        { title: "Visiteurs uniques", value: "856", change: "+8%" },
                        { title: "Taux de rebond", value: "32%", change: "-5%" },
                        { title: "Durée moyenne", value: "3:24", change: "+18%" }
                      ].map((stat, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                            <div className="text-2xl font-bold mt-1">{stat.value}</div>
                            <div className={`text-xs mt-1 ${
                              stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {stat.change} vs semaine précédente
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Voir le rapport détaillé
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Dernières actions effectuées sur le site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {stats?.recentActivities.map((activity) => (
                  <div key={activity._id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="h-full w-px bg-muted" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-x-2">
                        <p className="text-sm font-medium leading-none">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                      {activity.user && (
                        <p className="text-xs font-medium">
                          Par: {activity.user}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm" asChild>
                  <a href="/admin/activity">
                    Voir toutes les activités
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
