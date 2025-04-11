
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleSpecsFieldsProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
}

const VehicleSpecsFields: React.FC<VehicleSpecsFieldsProps> = ({ register, errors, watch, setValue }) => {
  return (
    <>
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
    </>
  );
};

export default VehicleSpecsFields;
