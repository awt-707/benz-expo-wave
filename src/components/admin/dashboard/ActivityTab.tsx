
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Car, MessageSquare, Users } from 'lucide-react';

interface ActivityItem {
  _id: string;
  type: string;
  action: string;
  timestamp: string;
  details: string;
  user?: string;
}

interface ActivityTabProps {
  activities: ActivityItem[];
  formatDate: (timestamp: string) => string;
}

const ActivityTab = ({ activities, formatDate }: ActivityTabProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Car className="h-4 w-4 opacity-75" />;
      case 'message': return <MessageSquare className="h-4 w-4 opacity-75" />;
      case 'visitor': return <Users className="h-4 w-4 opacity-75" />;
      case 'admin': return <Activity className="h-4 w-4 opacity-75" />;
      default: return <Activity className="h-4 w-4 opacity-75" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>
          Dernières actions effectuées sur le site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
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
  );
};

export default ActivityTab;
