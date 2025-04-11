
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Activity {
  _id: string;
  type: string;
  action: string;
  timestamp: string;
  details: string;
  user?: string;
}

interface ActivityTableProps {
  activities: Activity[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'vehicle': return 'bg-blue-100 text-blue-800';
      case 'message': return 'bg-green-100 text-green-800';
      case 'visitor': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'vehicle': return 'Véhicule';
      case 'message': return 'Message';
      case 'visitor': return 'Visiteur';
      case 'admin': return 'Admin';
      default: return type;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune activité à afficher</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Détails</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity._id}>
            <TableCell className="font-medium">{activity.action}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                {getActivityTypeLabel(activity.type)}
              </span>
            </TableCell>
            <TableCell>{activity.details}</TableCell>
            <TableCell>{activity.user || 'Système'}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: fr })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActivityTable;
