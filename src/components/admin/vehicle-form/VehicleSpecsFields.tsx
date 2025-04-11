
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/hooks/useVehicleForm';

interface VehicleSpecsFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleSpecsFields: React.FC<VehicleSpecsFieldsProps> = ({ form }) => {
  const { control } = form;

  return (
    <>
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="year">Année</FormLabel>
            <FormControl>
              <Input
                id="year"
                type="number"
                placeholder="Année"
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
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="mileage">Kilométrage</FormLabel>
            <FormControl>
              <Input
                id="mileage"
                type="number"
                placeholder="Kilométrage"
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
        name="fuelType"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="fuelType">Type de carburant</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de carburant" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="essence">Essence</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybride">Hybride</SelectItem>
                <SelectItem value="electrique">Électrique</SelectItem>
                <SelectItem value="gpl">GPL</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="transmission"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="transmission">Transmission</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une transmission" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="manuelle">Manuelle</SelectItem>
                <SelectItem value="automatique">Automatique</SelectItem>
                <SelectItem value="semi-automatique">Semi-automatique</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default VehicleSpecsFields;
