
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Plus, Pencil, Trash, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '@/services/api';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: 'available' | 'sold' | 'reserved';
  images: string[];
}

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles`);
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les véhicules",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [toast]);

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
        toast({
          title: "Suppression réussie",
          description: "Le véhicule a été supprimé avec succès",
        });
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Véhicules</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un véhicule
        </Button>
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
            onDelete={handleDeleteVehicle} 
          />
        </TabsContent>
        
        <TabsContent value="available">
          <VehicleTable 
            vehicles={vehicles.filter(v => v.status === 'available')} 
            isLoading={isLoading} 
            onDelete={handleDeleteVehicle} 
          />
        </TabsContent>
        
        <TabsContent value="sold">
          <VehicleTable 
            vehicles={vehicles.filter(v => v.status === 'sold')} 
            isLoading={isLoading} 
            onDelete={handleDeleteVehicle} 
          />
        </TabsContent>
        
        <TabsContent value="reserved">
          <VehicleTable 
            vehicles={vehicles.filter(v => v.status === 'reserved')} 
            isLoading={isLoading} 
            onDelete={handleDeleteVehicle} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, isLoading, onDelete }) => {
  if (isLoading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (vehicles.length === 0) {
    return <div className="text-center py-4">Aucun véhicule trouvé</div>;
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
              <TableCell>{vehicle.mileage.toLocaleString('fr-FR')} km</TableCell>
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
                  <Button variant="ghost" size="icon">
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
