
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { vehiclesApi } from '@/services/api';
import ImageUploader from './ImageUploader';

interface VehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

interface VehicleFormData {
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

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicleId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<VehicleFormData>({
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
              setValue(key as keyof VehicleFormData, vehicle[key]);
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
  
  const onSubmit = async (data: VehicleFormData) => {
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
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'annonce</Label>
              <Input
                id="title"
                {...register('title', { required: "Le titre est requis" })}
                placeholder="Titre de l'annonce"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { 
                  required: "Le prix est requis",
                  min: { value: 0, message: "Le prix doit être positif" }
                })}
                placeholder="Prix"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="make">Marque</Label>
              <Input
                id="make"
                {...register('make', { required: "La marque est requise" })}
                placeholder="Marque"
              />
              {errors.make && (
                <p className="text-sm text-red-500">{errors.make.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                {...register('model', { required: "Le modèle est requis" })}
                placeholder="Modèle"
              />
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { 
                  required: "L'année est requise",
                  min: { value: 1900, message: "L'année doit être valide" },
                  max: { value: new Date().getFullYear() + 1, message: "L'année ne peut pas être future" }
                })}
                placeholder="Année"
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                type="number"
                {...register('mileage', { 
                  required: "Le kilométrage est requis",
                  min: { value: 0, message: "Le kilométrage doit être positif" }
                })}
                placeholder="Kilométrage"
              />
              {errors.mileage && (
                <p className="text-sm text-red-500">{errors.mileage.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuelType">Type de carburant</Label>
              <Select 
                onValueChange={(value) => setValue('fuelType', value)}
                defaultValue={watch('fuelType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de carburant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essence">Essence</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybride">Hybride</SelectItem>
                  <SelectItem value="electrique">Électrique</SelectItem>
                  <SelectItem value="gpl">GPL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select 
                onValueChange={(value) => setValue('transmission', value)}
                defaultValue={watch('transmission')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manuelle">Manuelle</SelectItem>
                  <SelectItem value="automatique">Automatique</SelectItem>
                  <SelectItem value="semi-automatique">Semi-automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                onValueChange={(value) => setValue('status', value)}
                defaultValue={watch('status')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="isFeatured" 
                checked={watch('isFeatured')}
                onCheckedChange={(checked) => setValue('isFeatured', checked === true)}
              />
              <Label htmlFor="isFeatured">Véhicule en vedette</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: "La description est requise" })}
              placeholder="Description détaillée du véhicule"
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
            <Textarea
              id="features"
              {...register('features')}
              placeholder="Climatisation, GPS, Bluetooth, etc."
              rows={3}
            />
            {errors.features && (
              <p className="text-sm text-red-500">{errors.features.message}</p>
            )}
          </div>
          
          {vehicleId && (
            <div className="space-y-4">
              <Label>Images du véhicule</Label>
              <ImageUploader 
                existingImages={images}
                onUpload={handleImageUpload}
                vehicleId={vehicleId}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Chargement...' : vehicleId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
