
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Plus, Pencil, Trash, Eye, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vehiclesApi } from '@/services/api';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  specifications?: {
    mileage: number;
  };
  status: 'available' | 'sold' | 'reserved';
  images: string[];
}

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vehiclesApi.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Impossible de récupérer les véhicules. Veuillez réessayer plus tard.');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les véhicules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      return;
    }

    try {
      await vehiclesApi.delete(id);
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
      toast({
        title: "Suppression réussie",
        description: "Le véhicule a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
        variant: "destructive",
      });
    }
  };

  const handleAddVehicle = () => {
    navigate('/admin/vehicles/add');
  };

  const handleEditVehicle = (id: string) => {
    navigate(`/admin/vehicles/edit/${id}`);
  };

  const handleRefresh = () => {
    fetchVehicles();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Véhicules</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button onClick={handleAddVehicle}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un véhicule
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
          <TabsTrigger value="sold">Vendus</TabsTrigger>
          <TabsTrigger value="reserved">Réservés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <VehicleTable 
            vehicles={vehicles} 
            isLoading={isLoading} 
            error={error}
            onDelete={handleDeleteVehicle}
            onEdit={handleEditVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="available">
          <VehicleTable 
            vehicles={vehicles.filter(v => v.status === 'available')} 
            isLoading={isLoading} 
            error={error}
            onDelete={handleDeleteVehicle}
            onEdit={handleEditVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="sold">
          <VehicleTable 
            vehicles={vehicles.filter(v => v.status === 'sold')} 
            isLoading={isLoading} 
            error={error}
            onDelete={handleDeleteVehicle}
            onEdit={handleEditVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="reserved">
          <VehicleTable 
            vehicles={vehicles.filter(v => v.status === 'reserved')} 
            isLoading={isLoading} 
            error={error}
            onDelete={handleDeleteVehicle}
            onEdit={handleEditVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ 
  vehicles, 
  isLoading, 
  error,
  onDelete, 
  onEdit,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 border rounded-md mt-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p>Chargement des véhicules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 border rounded-md mt-4">
        <p className="mb-4">{error}</p>
        <Button onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border rounded-md mt-4">
        <p className="text-lg font-medium">Aucun véhicule trouvé</p>
        <p className="text-sm mb-4">Ajoutez des véhicules pour qu'ils apparaissent ici.</p>
        <Button onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marque</TableHead>
            <TableHead>Modèle</TableHead>
            <TableHead>Année</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Kilométrage</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle._id}>
              <TableCell>{vehicle.make}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>{vehicle.price.toLocaleString('fr-FR')} €</TableCell>
              <TableCell>
                {vehicle.specifications?.mileage 
                  ? `${vehicle.specifications.mileage.toLocaleString('fr-FR')} km`
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vehicle.status === 'available' ? 'Disponible' :
                   vehicle.status === 'sold' ? 'Vendu' : 'Réservé'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/vehicules/${vehicle._id}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(vehicle._id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(vehicle._id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehiclesList;
