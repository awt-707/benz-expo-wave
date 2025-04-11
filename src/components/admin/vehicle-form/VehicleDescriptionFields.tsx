
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface VehicleDescriptionFieldsProps {
  register: any;
  errors: any;
}

const VehicleDescriptionFields: React.FC<VehicleDescriptionFieldsProps> = ({ register, errors }) => {
  return (
    <>
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
    </>
  );
};

export default VehicleDescriptionFields;
