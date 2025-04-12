
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { vehiclesApi } from '@/services/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define a validation schema with Zod
const vehicleFormSchema = z.object({
  title: z.string().min(3, "Le titre doit comporter au moins 3 caractères"),
  make: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.number()
    .int("L'année doit être un nombre entier")
    .min(1900, "L'année doit être valide")
    .max(new Date().getFullYear() + 1, "L'année ne peut pas être future"),
  price: z.number()
    .min(0, "Le prix doit être positif"),
  mileage: z.number()
    .min(0, "Le kilométrage doit être positif"),
  fuelType: z.string().min(1, "Le type de carburant est requis"),
  transmission: z.string().min(1, "La transmission est requise"),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
  features: z.string(),
  isFeatured: z.boolean(),
  status: z.string()
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface UseVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

export const useVehicleForm = ({ vehicleId, onSuccess }: UseVehicleFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const methods = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    mode: "onBlur", // Validate on blur for better user experience
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
  
  const { formState, control, setValue, watch, reset, handleSubmit } = methods;
  const { errors, isValid, isDirty } = formState;
  
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
    if (!vehicleId || files.length === 0) {
      setUploadError("ID du véhicule manquant ou aucun fichier sélectionné");
      toast({
        title: "Erreur",
        description: "ID du véhicule manquant ou aucun fichier sélectionné",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('vehicleImages', file);
      });
      
      console.log(`Uploading ${files.length} images for vehicle ID: ${vehicleId}`);
      
      const result = await vehiclesApi.uploadImages(vehicleId, formData);
      
      if (result.error) {
        setUploadError(result.message || "Échec du téléchargement des images");
        toast({
          title: "Erreur",
          description: result.message || "Échec du téléchargement des images",
          variant: "destructive",
        });
        return;
      }
      
      // Update images list
      if (result.images && Array.isArray(result.images)) {
        setImages(result.images);
        console.log("Images updated successfully:", result.images);
      }
      
      toast({
        title: "Succès",
        description: "Images téléchargées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'upload des images:", error);
      setUploadError("Une erreur est survenue lors du téléchargement des images");
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
    ...methods,
    control,
    formState,
    errors,
    isLoading,
    isValid,
    isDirty,
    images,
    uploadError,
    handleImageUpload,
    onSubmit,
  };
};
