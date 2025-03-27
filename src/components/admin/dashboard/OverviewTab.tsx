
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, BarChart, LineChart } from '@/components/ui/charts';

interface OverviewTabProps {
  stats: {
    counts: {
      vehicles: number;
      messages: number;
      unreadMessages: number;
    };
  } | null;
  visitorData: Array<{ name: string; Visiteurs: number }>;
}

const OverviewTab = ({ stats, visitorData }: OverviewTabProps) => {
  return (
    <div className="space-y-4">
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
              data={visitorData}
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
    </div>
  );
};

export default OverviewTab;
