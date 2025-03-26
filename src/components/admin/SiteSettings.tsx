
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save } from 'lucide-react';

interface SiteConfigType {
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

const SiteSettings = () => {
  const [config, setConfig] = useState<SiteConfigType>({
    homeHeroText: '',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
    videoUrl: '',
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/site-config`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la configuration');
        }
        
        const data = await response.json();
        setConfig(data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string, field?: string) => {
    const { name, value } = e.target;
    
    if (section && field) {
      setConfig({
        ...config,
        [section]: {
          ...(config[section as keyof SiteConfigType] as Record<string, any>),
          [field]: value
        }
      });
    } else {
      setConfig({
        ...config,
        [name]: value
      });
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Save site config
      const configResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/site-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      
      if (!configResponse.ok) {
        throw new Error('Erreur lors de la sauvegarde de la configuration');
      }
      
      // Upload video if one is selected
      if (videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);
        
        const videoResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload-video`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!videoResponse.ok) {
          throw new Error('Erreur lors de l\'upload de la vidéo');
        }
        
        const videoData = await videoResponse.json();
        setConfig({
          ...config,
          videoUrl: videoData.videoUrl
        });
        
        setVideoFile(null);
      }
      
      toast({
        title: "Succès",
        description: "Configuration du site mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Modifiez le texte principal et les informations sur la page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homeHeroText">Texte d'accueil</Label>
                <Textarea
                  id="homeHeroText"
                  name="homeHeroText"
                  value={config.homeHeroText}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Texte principal sur la page d'accueil"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Réseaux sociaux</Label>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={config.socialMedia.facebook}
                        onChange={(e) => handleInputChange(e, 'socialMedia', 'facebook')}
                        placeholder="URL Facebook"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={config.socialMedia.instagram}
                        onChange={(e) => handleInputChange(e, 'socialMedia', 'instagram')}
                        placeholder="URL Instagram"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={config.socialMedia.twitter}
                        onChange={(e) => handleInputChange(e, 'socialMedia', 'twitter')}
                        placeholder="URL Twitter"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>
                Modifiez les coordonnées affichées sur le site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={config.contactInfo.email}
                    onChange={(e) => handleInputChange(e, 'contactInfo', 'email')}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={config.contactInfo.phone}
                    onChange={(e) => handleInputChange(e, 'contactInfo', 'phone')}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={config.contactInfo.address}
                  onChange={(e) => handleInputChange(e, 'contactInfo', 'address')}
                  placeholder="123 rue exemple, 75000 Paris"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Vidéo du site</CardTitle>
              <CardDescription>
                Changez la vidéo de présentation sur la page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.videoUrl && (
                <div className="mb-4 p-2 border rounded">
                  <video
                    controls
                    className="w-full aspect-video"
                    src={`${import.meta.env.VITE_API_URL}${config.videoUrl}`}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="video">Télécharger une nouvelle vidéo</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                <p className="text-sm text-muted-foreground">
                  Formats acceptés: MP4, WebM, MOV. Taille maximale: 100MB
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isSaving ? "Téléchargement en cours..." : "Télécharger et sauvegarder"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
