
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import ActivityTable from './ActivityTable';

interface Activity {
  _id: string;
  type: string;
  action: string;
  timestamp: string;
  details: string;
  user?: string;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Vous devez être connecté pour voir l\'activité.');
          return;
        }

        const result = await adminApi.getActivityLog();

        if (result.error || !result.activities) {
          throw new Error(result.message || 'Erreur lors de la récupération de l\'activité');
        }
        setActivities(result.activities);
      } catch (err: unknown) {
        setError(err.message || 'Erreur lors de la récupération de l\'activité.');
        toast({
          title: "Erreur",
          description: "Impossible de récupérer l'activité",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  if (!localStorage.getItem('adminToken')) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Vous devez être connecté pour accéder à l'activité.
            <Button variant="link" onClick={() => window.location.href = '/admin'}>
              Se connecter
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <Button variant="outline" onClick={() => window.location.reload()} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              Chargement...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Journal d'activité</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
              <p>Chargement de l'activité...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <ActivityTable activities={activities} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
