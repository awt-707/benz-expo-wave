
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    register,
    handleSubmit,
    onSubmit,
    setValue,
    watch,
    reset,
    errors,
    isLoading,
    images,
    handleImageUpload
  } = useVehicleForm({ vehicleId, onSuccess });
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VehicleBasicInfoFields 
              register={register} 
              errors={errors} 
            />
            
            <VehicleSpecsFields 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue} 
            />
            
            <VehicleStatusFields 
              watch={watch} 
              setValue={setValue} 
            />
          </div>
          
          <VehicleDescriptionFields 
            register={register} 
            errors={errors} 
          />
          
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
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
