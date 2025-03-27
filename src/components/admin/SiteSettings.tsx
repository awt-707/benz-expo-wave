
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralSettings } from './settings/GeneralSettings';
import { ContactSettings } from './settings/ContactSettings';
import { VideoSettings } from './settings/VideoSettings';
import { API_BASE_URL } from '@/services/api';

interface SiteConfigType {
  homeHeroText: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    workingHours?: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  videoUrl: string;
}

const defaultConfig: SiteConfigType = {
  homeHeroText: '',
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    workingHours: '',
  },
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
  videoUrl: '',
};

const SiteSettings = () => {
  const [config, setConfig] = useState<SiteConfigType>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la configuration');
        }
        
        const data = await response.json();
        
        // Ensure all required properties exist
        const completeConfig = {
          ...defaultConfig,
          ...data,
          contactInfo: {
            ...defaultConfig.contactInfo,
            ...(data.contactInfo || {}),
          },
          socialMedia: {
            ...defaultConfig.socialMedia,
            ...(data.socialMedia || {}),
          },
        };
        
        setConfig(completeConfig);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la configuration du site",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [toast]);

  const handleConfigUpdate = (newConfig: Partial<SiteConfigType>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  if (isLoading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuration du site</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="video">Vidéo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="contact">
          <ContactSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="video">
          <VideoSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
