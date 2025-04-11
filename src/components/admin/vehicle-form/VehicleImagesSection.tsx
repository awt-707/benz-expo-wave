
import React from 'react';
import { Label } from '@/components/ui/label';
import ImageUploader from '@/components/admin/ImageUploader';

interface VehicleImagesSectionProps {
  vehicleId: string;
  images: string[];
  onUpload: (files: File[]) => void;
}

const VehicleImagesSection: React.FC<VehicleImagesSectionProps> = ({
  vehicleId,
  images,
  onUpload
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="images">Images du véhicule</Label>
      <ImageUploader 
        existingImages={images}
        onUpload={onUpload}
        vehicleId={vehicleId}
      />
    </div>
  );
};

export default VehicleImagesSection;
