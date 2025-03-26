
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Car, MessageSquare, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalContacts: 0,
    totalVisitors: 0,
    visitorsByDay: []
  });

  useEffect(() => {
    // Simuler la récupération des statistiques depuis l'API
    // À remplacer par un appel réel à l'API
    const mockStats = {
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
      ]
    };
    
    setStats(mockStats);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Véhicules</p>
                <p className="text-3xl font-bold">{stats.totalVehicles}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Car className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visiteurs</p>
                <p className="text-3xl font-bold">{stats.totalVisitors}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aujourd'hui</p>
                <p className="text-3xl font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
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
    </div>
  );
};

export default Dashboard;
