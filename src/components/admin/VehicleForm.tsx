
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useVehicleForm } from '@/hooks/useVehicleForm';

// Import sub-components
import VehicleBasicInfoFields from './vehicle-form/VehicleBasicInfoFields';
import VehicleSpecsFields from './vehicle-form/VehicleSpecsFields';
import VehicleStatusFields from './vehicle-form/VehicleStatusFields';
import VehicleDescriptionFields from './vehicle-form/VehicleDescriptionFields';
import VehicleImagesSection from './vehicle-form/VehicleImagesSection';
import VehicleFormActions from './vehicle-form/VehicleFormActions';

interface VehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicleId, onSuccess }) => {
  const {
    handleSubmit,
    onSubmit,
    reset,
    isLoading,
    isValid,
    isDirty,
    images,
    handleImageUpload,
    control,
    formState,
    ...formMethods
  } = useVehicleForm({ vehicleId, onSuccess });
  
  // Create a complete form object that we'll pass to child components
  const form = {
    control,
    formState,
    handleSubmit,
    reset,
    ...formMethods
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VehicleBasicInfoFields form={form} />
              <VehicleSpecsFields form={form} />
              <VehicleStatusFields form={form} />
            </div>
            
            <VehicleDescriptionFields form={form} />
            
            {vehicleId && (
              <VehicleImagesSection
                vehicleId={vehicleId}
                images={images}
                onUpload={handleImageUpload}
              />
            )}
            
            <VehicleFormActions 
              isLoading={isLoading}
              onReset={reset}
              vehicleId={vehicleId}
              isValid={isValid}
              isDirty={isDirty}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
