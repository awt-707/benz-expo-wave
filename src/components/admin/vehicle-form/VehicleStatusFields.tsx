
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/hooks/useVehicleForm';

interface VehicleStatusFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleStatusFields: React.FC<VehicleStatusFieldsProps> = ({ form }) => {
  const { control } = form;

  return (
    <>
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="status">Statut</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="reserved">Réservé</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="isFeatured"
        render={({ field }) => (
          <div className="flex items-center space-x-2 pt-4">
            <FormControl>
              <Checkbox 
                id="isFeatured" 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel htmlFor="isFeatured" className="cursor-pointer">Véhicule en vedette</FormLabel>
          </div>
        )}
      />
    </>
  );
};

export default VehicleStatusFields;
