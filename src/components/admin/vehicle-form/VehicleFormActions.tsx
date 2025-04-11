
import React from 'react';
import { Button } from '@/components/ui/button';

interface VehicleFormActionsProps {
  isLoading: boolean;
  onReset: () => void;
  vehicleId?: string;
  isValid: boolean;
  isDirty: boolean;
}

const VehicleFormActions: React.FC<VehicleFormActionsProps> = ({ 
  isLoading, 
  onReset, 
  vehicleId,
  isValid,
  isDirty
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onReset}>
        Réinitialiser
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading || (!isValid && isDirty)}
      >
        {isLoading ? 'Chargement...' : vehicleId ? 'Mettre à jour' : 'Créer'}
      </Button>
    </div>
  );
};

export default VehicleFormActions;
