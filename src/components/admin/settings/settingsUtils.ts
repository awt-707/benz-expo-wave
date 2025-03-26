
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/services/api';

export interface SiteConfigType {
  homeHeroText: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  videoUrl: string;
}

export const saveSiteConfig = async (config: SiteConfigType): Promise<boolean> => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde de la configuration');
    }
    
    toast({
      title: "Configuration sauvegardée",
      description: "Les modifications ont été enregistrées avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Error saving site config:', error);
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder la configuration.",
      variant: "destructive",
    });
    return false;
  }
};

export const uploadVideo = async (videoFile: File): Promise<string | null> => {
  try {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('video', videoFile);
    
    const response = await fetch(`${API_BASE_URL}/admin/upload-video`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de la vidéo');
    }
    
    const data = await response.json();
    return data.videoUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger la vidéo.",
      variant: "destructive",
    });
    return null;
  }
};

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  config: SiteConfigType,
  section?: string,
  field?: string
): Partial<SiteConfigType> => {
  const { name, value } = e.target;
  
  if (section && field) {
    return {
      [section]: {
        ...(config[section as keyof SiteConfigType] as Record<string, any>),
        [field]: value
      }
    };
  } else {
    return {
      [name]: value
    };
  }
};
