
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { vehiclesApi } from '@/services/api';

interface VehicleFormValues {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  description: string;
  features: string;
  isFeatured: boolean;
  status: string;
}

interface UseVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

export const useVehicleForm = ({ vehicleId, onSuccess }: UseVehicleFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<VehicleFormValues>({
    defaultValues: {
      title: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: 'essence',
      transmission: 'manuelle',
      description: '',
      features: '',
      isFeatured: false,
      status: 'available'
    }
  });
  
  // Fetch vehicle data if editing
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleId) return;
      
      setIsLoading(true);
      try {
        const response = await vehiclesApi.getById(vehicleId);
        
        if (response.error) {
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les données du véhicule",
            variant: "destructive",
          });
          return;
        }
        
        // Populate form with vehicle data
        const vehicle = response;
        Object.keys(vehicle).forEach(key => {
          if (key !== 'images' && key !== '_id') {
            // Only set value if the key exists in our form
            if (key in watch()) {
              setValue(key as keyof VehicleFormValues, vehicle[key]);
            }
          }
        });
        
        // Set images separately
        if (vehicle.images && Array.isArray(vehicle.images)) {
          setImages(vehicle.images);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des données",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicleData();
  }, [vehicleId, setValue, toast, watch]);
  
  const onSubmit = async (data: VehicleFormValues) => {
    setIsLoading(true);
    
    try {
      let response;
      
      if (vehicleId) {
        // Update existing vehicle
        response = await vehiclesApi.update(vehicleId, data);
      } else {
        // Create new vehicle
        response = await vehiclesApi.create(data);
      }
      
      if (response.error) {
        toast({
          title: "Erreur",
          description: response.message || "Une erreur est survenue",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Succès",
        description: vehicleId 
          ? "Véhicule mis à jour avec succès" 
          : "Véhicule créé avec succès",
      });
      
      if (!vehicleId) {
        reset(); // Reset form if creating new vehicle
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUpload = async (files: File[]) => {
    if (!vehicleId || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('vehicleImages', file);
      });
      
      const result = await vehiclesApi.uploadImages(vehicleId, formData);
      
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger les images",
          variant: "destructive",
        });
        return;
      }
      
      // Update images list
      if (result.images && Array.isArray(result.images)) {
        setImages(result.images);
      }
      
      toast({
        title: "Succès",
        description: "Images téléchargées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement des images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    setValue,
    watch,
    reset,
    errors,
    isLoading,
    images,
    handleImageUpload
  };
};
