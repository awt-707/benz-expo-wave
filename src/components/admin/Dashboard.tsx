
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, Car, MessageSquare, Users, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalVehicles: number;
  totalContacts: number;
  totalVisitors: number;
  visitorsByDay: Array<{ name: string; visitors: number }>;
  vehiclesByStatus: Array<{ name: string; value: number }>;
  recentActivity: Array<{
    id: string;
    type: 'vehicle' | 'message' | 'visitor';
    action: string;
    timestamp: string;
    details: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalContacts: 0,
    totalVisitors: 0,
    visitorsByDay: [],
    vehiclesByStatus: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        console.error('Error fetching stats:', error);
        
        // Données simulées en cas d'erreur pour la démo
        const mockStats: DashboardStats = {
          totalVehicles: 24,
          totalContacts: 15,
          totalVisitors: 348,
          visitorsByDay: [
            { name: 'Lun', visitors: 45 },
            { name: 'Mar', visitors: 52 },
            { name: 'Mer', visitors: 49 },
            { name: 'Jeu', visitors: 62 },
            { name: 'Ven', visitors: 78 },
            { name: 'Sam', visitors: 42 },
            { name: 'Dim', visitors: 20 },
          ],
          vehiclesByStatus: [
            { name: 'Disponible', value: 15 },
            { name: 'Vendu', value: 6 },
            { name: 'Réservé', value: 3 },
          ],
          recentActivity: [
            { 
              id: '1', 
              type: 'vehicle', 
              action: 'Ajout',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              details: 'Audi A3 2020' 
            },
            { 
              id: '2', 
              type: 'message', 
              action: 'Nouveau',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              details: 'Question sur BMW X5' 
            },
            { 
              id: '3', 
              type: 'visitor', 
              action: 'Pic',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              details: '25 visiteurs à 14h' 
            },
          ]
        };
        
        setStats(mockStats);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [toast]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Rapports
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Véhicules</p>
                <p className="text-3xl font-bold">{stats.totalVehicles}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+4.6%</span> ce mois-ci
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Car className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+12.2%</span> ce mois-ci
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visiteurs</p>
                <p className="text-3xl font-bold">{stats.totalVisitors}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+8.1%</span> ce mois-ci
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aujourd'hui</p>
                <p className="text-3xl font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visiteurs par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.visitorsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#1e3a8a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={stats.vehiclesByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.vehiclesByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {stats.vehiclesByStatus.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center gap-1">
                    <div className="w-3 h-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  activity.type === 'vehicle' 
                    ? 'bg-blue-100 text-blue-600' 
                    : activity.type === 'message' 
                    ? 'bg-green-100 text-green-600'
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {activity.type === 'vehicle' && <Car className="h-5 w-5" />}
                  {activity.type === 'message' && <MessageSquare className="h-5 w-5" />}
                  {activity.type === 'visitor' && <Users className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {activity.action} {activity.type === 'vehicle' ? 'véhicule' : activity.type === 'message' ? 'message' : 'visiteurs'}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/activity')}>
              Voir toute l'activité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
