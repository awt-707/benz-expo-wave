
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleBasicInfoFieldsProps {
  register: any;
  errors: any;
}

const VehicleBasicInfoFields: React.FC<VehicleBasicInfoFieldsProps> = ({ register, errors }) => {
  return (
    <>
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
    </>
  );
};

export default VehicleBasicInfoFields;
