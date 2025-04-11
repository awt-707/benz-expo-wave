
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/hooks/useVehicleForm';

interface VehicleDescriptionFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleDescriptionFields: React.FC<VehicleDescriptionFieldsProps> = ({ form }) => {
  const { control } = form;

  return (
    <>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl>
              <Textarea
                id="description"
                placeholder="Description détaillée du véhicule"
                rows={6}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="features">Caractéristiques (séparées par des virgules)</FormLabel>
            <FormControl>
              <Textarea
                id="features"
                placeholder="Climatisation, GPS, Bluetooth, etc."
                rows={3}
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

export default VehicleDescriptionFields;
