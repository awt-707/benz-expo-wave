
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Trash, Image, RefreshCw } from 'lucide-react';
import { API_BASE_URL, mediaApi } from '@/services/api';

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching media files...');
      const data = await mediaApi.getAll();
      console.log('Media files fetched:', data);
      setMediaFiles(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Impossible de récupérer les médias');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les médias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadLoading(true);
    setError(null);
    
    try {
      console.log('Uploading file:', file.name);
      const result = await mediaApi.upload(file);
      console.log('Upload result:', result);
      
      toast({
        title: "Succès",
        description: "Média téléchargé avec succès",
      });
      
      // Refresh the media list
      fetchMedia();
    } catch (error) {
      console.error('Error uploading media:', error);
      setError('Impossible de télécharger le fichier');
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;
    
    setError(null);
    try {
      console.log('Deleting file:', filename);
      await mediaApi.delete(filename);
      console.log('File deleted successfully');
      
      toast({
        title: "Succès",
        description: "Média supprimé avec succès",
      });
      
      // Update the list
      setMediaFiles(prev => prev.filter(file => file.filename !== filename));
    } catch (error) {
      console.error('Error deleting media:', error);
      setError('Impossible de supprimer le fichier');
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    console.log('Copying URL to clipboard:', fullUrl);
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "Lien copié",
      description: "URL du média copiée dans le presse-papier",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestionnaire de médias</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchMedia} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Input
            type="file"
            id="media-upload"
            className="hidden"
            onChange={handleUpload}
            accept="image/*"
          />
          <Button asChild disabled={uploadLoading}>
            <label htmlFor="media-upload">
              <Upload className="mr-2 h-4 w-4" />
              {uploadLoading ? 'Téléchargement...' : 'Télécharger un média'}
            </label>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Chargement des médias...</div>
      ) : mediaFiles.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun média</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par télécharger des images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((file) => (
            <Card key={file.filename} className="overflow-hidden">
              <div className="aspect-square relative group">
                <img
                  src={`${API_BASE_URL}${file.url}`}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Error loading image: ${file.url}`);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(file.filename)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="truncate text-xs text-gray-500" title={file.filename}>
                  {file.filename}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(file.url)}>
                    Copier URL
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
