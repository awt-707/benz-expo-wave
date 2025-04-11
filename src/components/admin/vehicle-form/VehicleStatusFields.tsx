
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface VehicleStatusFieldsProps {
  watch: any;
  setValue: any;
}

const VehicleStatusFields: React.FC<VehicleStatusFieldsProps> = ({ watch, setValue }) => {
  return (
    <>
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
    </>
  );
};

export default VehicleStatusFields;
