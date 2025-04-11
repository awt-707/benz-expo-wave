
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/services/api/apiUtils';

interface ImageUploaderProps {
  existingImages?: string[];
  onUpload: (files: File[]) => void;
  vehicleId?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  existingImages = [],
  onUpload,
  vehicleId
}) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const imageFiles = files.filter(file => validImageTypes.includes(file.type));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner des images valides (JPEG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Generate preview URLs for the selected files
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Information",
        description: "Veuillez sélectionner des images à télécharger",
      });
      return;
    }

    onUpload(selectedFiles);
    
    // Clean up preview URLs to avoid memory leaks
    previews.forEach(preview => URL.revokeObjectURL(preview));
    setPreviews([]);
    setSelectedFiles([]);
  };

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  return (
    <div className="space-y-4">
      {existingImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Images existantes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {existingImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`} 
                  alt={`Vehicle image ${index + 1}`} 
                  className="h-24 w-full object-cover rounded-md border" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Card className={`border-2 border-dashed rounded-md ${dragging ? 'border-primary bg-primary/10' : 'border-gray-300'}`}>
        <CardContent 
          className="flex flex-col items-center justify-center py-8 text-center"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Glissez-déposez vos images ici ou
            </p>
            <Button 
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              size="sm"
            >
              Parcourir
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG, WEBP jusqu'à 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Images sélectionnées ({selectedFiles.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative h-24 w-full rounded-md border overflow-hidden">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeSelectedFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs truncate mt-1">{selectedFiles[index].name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              type="button"
              onClick={uploadFiles} 
              variant="secondary"
            >
              Télécharger {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
