
import React from 'react';
import { Label } from '@/components/ui/label';
import ImageUploader from '../ImageUploader';

interface VehicleImagesSectionProps {
  vehicleId: string;
  images: string[];
  onUpload: (files: File[]) => void;
}

const VehicleImagesSection: React.FC<VehicleImagesSectionProps> = ({ vehicleId, images, onUpload }) => {
  if (!vehicleId) return null;
  
  return (
    <div className="space-y-4">
      <Label>Images du véhicule</Label>
      <ImageUploader 
        existingImages={images}
        onUpload={onUpload}
        vehicleId={vehicleId}
      />
    </div>
  );
};

export default VehicleImagesSection;
