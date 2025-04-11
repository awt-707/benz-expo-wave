
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/hooks/useVehicleForm';

interface VehicleBasicInfoFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleBasicInfoFields: React.FC<VehicleBasicInfoFieldsProps> = ({ form }) => {
  const { control } = form;

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="title">Titre de l'annonce</FormLabel>
            <FormControl>
              <Input
                id="title"
                placeholder="Titre de l'annonce"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="price">Prix (€)</FormLabel>
            <FormControl>
              <Input
                id="price"
                type="number"
                placeholder="Prix"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="make">Marque</FormLabel>
            <FormControl>
              <Input
                id="make"
                placeholder="Marque"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="model">Modèle</FormLabel>
            <FormControl>
              <Input
                id="model"
                placeholder="Modèle"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default VehicleBasicInfoFields;
