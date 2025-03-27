
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Trash, Image } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

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
  const { toast } = useToast();

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des médias');
      }
      
      const data = await response.json();
      setMediaFiles(data);
    } catch (error) {
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
    const formData = new FormData();
    formData.append('media', file);
    
    setUploadLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }
      
      const data = await response.json();
      
      toast({
        title: "Succès",
        description: "Média téléchargé avec succès",
      });
      
      // Rafraîchir la liste des médias
      fetchMedia();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
      // Réinitialiser l'input file
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/media/${filename}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      toast({
        title: "Succès",
        description: "Média supprimé avec succès",
      });
      
      // Mettre à jour la liste
      setMediaFiles(prev => prev.filter(file => file.filename !== filename));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
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
          <Input
            type="file"
            id="media-upload"
            className="hidden"
            onChange={handleUpload}
            accept="image/*"
          />
          <Button as="label" htmlFor="media-upload" disabled={uploadLoading}>
            <Upload className="mr-2 h-4 w-4" />
            {uploadLoading ? 'Téléchargement...' : 'Télécharger un média'}
          </Button>
        </div>
      </div>

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
                <div className="truncate text-xs text-gray-500">{file.filename}</div>
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
