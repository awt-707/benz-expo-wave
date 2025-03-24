
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Euro, Fuel, Gauge, Info, Share2, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

// Sample vehicle data - in a real app, this would come from an API
const vehicles = [
  {
    id: "classe-c",
    image: "/lovable-uploads/d6338b3f-2a4f-4279-90e4-8775cb7acd40.png",
    title: "Mercedes-Benz Classe C",
    description: "Élégance, confort et technologie de pointe. La Classe C incarne le luxe accessible.",
    fullDescription: "La Mercedes-Benz Classe C représente l'équilibre parfait entre élégance, confort et technologie de pointe. Avec son design sophistiqué et ses finitions luxueuses, elle offre une expérience de conduite incomparable. Son habitacle spacieux et raffiné est doté des dernières innovations technologiques pour assurer votre confort et votre sécurité. Que ce soit pour vos déplacements professionnels ou vos voyages personnels, la Classe C vous accompagne avec style et performance.",
    price: "45 000",
    year: "2022",
    specs: {
      engine: "2.0L Turbo",
      power: "204 ch",
      acceleration: "7.3s",
      consumption: "6.2L/100km"
    },
    features: [
      "Système MBUX avec écran tactile",
      "Sièges en cuir",
      "Climatisation automatique bizone",
      "Aide au stationnement avec caméra de recul",
      "Jantes alliage 18 pouces",
      "Système de navigation",
      "Apple CarPlay et Android Auto",
      "Éclairage d'ambiance personnalisable"
    ],
    mileage: "25 000 km",
    transmission: "Automatique",
    color: "Gris Sélénite",
    availability: "En stock"
  },
  {
    id: "classe-e",
    image: "/lovable-uploads/3bf54152-1a0e-47d2-a44f-fae8843a5058.png",
    title: "Mercedes-Benz Classe E",
    description: "Sophistication et performances exceptionnelles pour cette berline de référence.",
    fullDescription: "La Mercedes-Benz Classe E incarne l'excellence automobile avec sa combinaison de sophistication et de performances exceptionnelles. Cette berline de référence offre un niveau de confort supérieur grâce à ses suspensions adaptatives et son habitacle spacieux. Équipée des technologies les plus avancées, elle garantit une sécurité optimale et une expérience de conduite intuitive. Son design élégant et intemporel attire tous les regards, tandis que son moteur puissant offre des sensations de conduite incomparables.",
    price: "65 000",
    year: "2023",
    specs: {
      engine: "3.0L V6",
      power: "286 ch",
      acceleration: "5.9s",
      consumption: "7.4L/100km"
    },
    features: [
      "Système MBUX avec réalité augmentée",
      "Sièges en cuir Nappa",
      "Climatisation automatique 4 zones",
      "Stationnement automatique",
      "Jantes alliage 19 pouces",
      "Affichage tête haute",
      "Système audio Burmester",
      "Assistant de conduite actif"
    ],
    mileage: "10 000 km",
    transmission: "Automatique",
    color: "Noir Obsidienne",
    availability: "Sur commande"
  },
  {
    id: "classe-s",
    image: "/lovable-uploads/964d32ef-a58e-44f7-a136-d1b93fdab210.png",
    title: "Mercedes-Benz Classe S",
    description: "L'expression ultime du luxe automobile, alliant confort incomparable et innovations technologiques.",
    fullDescription: "La Mercedes-Benz Classe S représente l'apogée du luxe automobile moderne. Chef-d'œuvre d'ingénierie, elle offre un confort incomparable grâce à ses sièges massants climatisés et sa suspension pneumatique qui semble faire flotter le véhicule au-dessus de la route. Son habitacle silencieux est un sanctuaire de tranquillité, tandis que ses technologies d'avant-garde comme l'éclairage numérique MBUX et les systèmes d'assistance à la conduite de niveau 3 redéfinissent l'expérience automobile premium. La Classe S n'est pas seulement une voiture, c'est une déclaration de réussite.",
    price: "110 000",
    year: "2023",
    specs: {
      engine: "4.0L V8",
      power: "435 ch",
      acceleration: "4.8s",
      consumption: "8.6L/100km"
    },
    features: [
      "Système MBUX nouvelle génération",
      "Sièges Executive avec massage",
      "Climatisation automatique 4 zones avec filtration d'air",
      "Conduite semi-autonome de niveau 3",
      "Jantes alliage 20 pouces",
      "Système audio Burmester 4D",
      "Portes à fermeture douce",
      "Écrans OLED pour passagers arrière"
    ],
    mileage: "5 000 km",
    transmission: "Automatique",
    color: "Blanc Diamant",
    availability: "Sur commande"
  },
  {
    id: "gle",
    image: "/lovable-uploads/29df00a1-3840-4b5a-b171-484af6b189aa.png",
    title: "Mercedes-Benz GLE",
    description: "Un SUV alliant polyvalence, confort et performances pour toutes vos aventures.",
    fullDescription: "Le Mercedes-Benz GLE est le SUV par excellence qui allie polyvalence, confort et performances pour répondre à tous vos besoins. Son design robuste mais élégant cache un intérieur raffiné pouvant accueillir confortablement jusqu'à sept passagers. La technologie MBUX avec commande gestuelle et l'assistant personnel intelligent facilitent chaque interaction avec le véhicule. Son système de suspension E-Active Body Control analyse la route et ajuste chaque roue indépendamment pour une tenue de route impeccable, que ce soit sur autoroute ou en tout-terrain. Le GLE représente le compagnon idéal pour toutes vos aventures, qu'elles soient urbaines ou hors des sentiers battus.",
    price: "78 000",
    year: "2022",
    specs: {
      engine: "3.0L V6",
      power: "330 ch",
      acceleration: "5.7s",
      consumption: "8.1L/100km"
    },
    features: [
      "Système MBUX avec écran tactile de 12,3 pouces",
      "Sièges en cuir chauffants et ventilés",
      "Suspension pneumatique adaptative",
      "Système de traction intégrale 4MATIC",
      "Jantes alliage 20 pouces",
      "Toit panoramique",
      "Système de son surround",
      "Caméras 360°"
    ],
    mileage: "30 000 km",
    transmission: "Automatique",
    color: "Bleu Brillant",
    availability: "En stock"
  },
  {
    id: "glc",
    image: "/lovable-uploads/ea38bd58-5015-4016-a27f-9e96383424fb.png",
    title: "Mercedes-Benz GLC",
    description: "Le SUV compact qui offre un équilibre parfait entre élégance urbaine et capacités tout-terrain.",
    fullDescription: "Le Mercedes-Benz GLC est le SUV compact qui ne fait aucun compromis. Il offre un équilibre parfait entre élégance urbaine et capacités tout-terrain. Compact à l'extérieur mais spacieux à l'intérieur, le GLC se faufile facilement dans les rues étroites tout en offrant suffisamment d'espace pour tous vos besoins. Son design distinctif avec la calandre imposante et les phares LED haute performance attire tous les regards. Sous le capot, le moteur puissant et efficace offre des performances impressionnantes tout en maintenant une consommation raisonnable. Les technologies d'assistance à la conduite de dernière génération assurent votre sécurité dans toutes les situations.",
    price: "58 000",
    year: "2023",
    specs: {
      engine: "2.0L Turbo",
      power: "258 ch",
      acceleration: "6.2s",
      consumption: "7.1L/100km"
    },
    features: [
      "Système MBUX avec commande vocale",
      "Sièges sport en similicuir ARTICO",
      "Climatisation automatique",
      "Pack Off-Road",
      "Jantes alliage 19 pouces",
      "Système de navigation",
      "Hayon électrique EASY-PACK",
      "Système d'aide au stationnement actif"
    ],
    mileage: "15 000 km",
    transmission: "Automatique",
    color: "Argent Iridium",
    availability: "En stock"
  },
  {
    id: "cla",
    image: "/lovable-uploads/d6338b3f-2a4f-4279-90e4-8775cb7acd40.png",
    title: "Mercedes-Benz CLA",
    description: "Design coupé séduisant et performances dynamiques pour un plaisir de conduite unique.",
    fullDescription: "La Mercedes-Benz CLA se distingue par son design coupé séduisant et ses performances dynamiques qui offrent un plaisir de conduite unique. Sa silhouette élancée avec toit incliné et ses proportions parfaites en font l'une des voitures les plus attrayantes de sa catégorie. À l'intérieur, l'ambiance sportive et moderne est rehaussée par des éléments design distinctifs et des matériaux de haute qualité. Le système d'infodivertissement MBUX avec intelligence artificielle apprend vos préférences pour une expérience personnalisée. Sur la route, la direction précise et la suspension sportive vous connectent parfaitement à la route pour une conduite exaltante.",
    price: "42 000",
    year: "2021",
    specs: {
      engine: "2.0L Turbo",
      power: "224 ch",
      acceleration: "6.3s",
      consumption: "6.4L/100km"
    },
    features: [
      "Système MBUX avec écran tactile",
      "Sièges sport",
      "Climatisation automatique",
      "Aide au stationnement active",
      "Jantes alliage 18 pouces AMG",
      "Éclairage d'ambiance 64 couleurs",
      "Système audio avancé",
      "Pack AMG Line"
    ],
    mileage: "35 000 km",
    transmission: "Automatique",
    color: "Rouge Jupiter",
    availability: "Vendu"
  }
];

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Find the vehicle in our data
    const foundVehicle = vehicles.find((v) => v.id === id);
    if (foundVehicle) {
      setVehicle(foundVehicle);
    }
  }, [id]);
  
  if (!vehicle) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold">Véhicule non trouvé</h1>
          <p className="mt-4">Le véhicule que vous recherchez n'existe pas.</p>
          <Button 
            className="mt-8 bg-mercedes-blue"
            onClick={() => navigate('/vehicules')}
          >
            Retour aux véhicules
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const getAvailabilityColor = () => {
    switch (vehicle.availability) {
      case "En stock":
        return "bg-green-500 hover:bg-green-600";
      case "Sur commande":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Vendu":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-green-500 hover:bg-green-600";
    }
  };
  
  const handleReserve = () => {
    // Navigate to contact page with vehicle reference
    navigate(`/contact?vehicule=${vehicle.id}&titre=${encodeURIComponent(vehicle.title)}`);
  };

  return (
    <>
      <Navbar />
      
      <main className="pb-16">
        <section className="pt-24 pb-16 bg-gradient-to-b from-mercedes-black to-mercedes-darkgray text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-center">
                {vehicle.title}
              </h1>
              <p className="text-white/80 max-w-3xl mx-auto text-center text-lg mb-6">
                {vehicle.description}
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-mercedes-darkgray text-white px-3 py-1 text-sm font-semibold">
                  <Euro className="w-4 h-4 mr-1" />
                  {vehicle.price} €
                </Badge>
                <Badge variant="outline" className="text-white border-white px-3 py-1 text-sm font-semibold">
                  <Calendar className="w-4 h-4 mr-1" />
                  {vehicle.year}
                </Badge>
                <Badge className={`px-3 py-1 text-sm font-semibold text-white ${getAvailabilityColor()}`}>
                  {vehicle.availability}
                </Badge>
              </div>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-3/5">
                <ScrollReveal>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.title} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-2xl font-serif font-bold mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {vehicle.fullDescription}
                    </p>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-2xl font-serif font-bold mb-4">Caractéristiques principales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicle.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <ShieldCheck className="h-5 w-5 text-mercedes-blue mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="lg:w-2/5">
                <ScrollReveal delay={100}>
                  <Card className="shadow-lg">
                    <CardHeader className="bg-mercedes-darkgray text-white">
                      <CardTitle>Détails du véhicule</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Car className="h-5 w-5 text-mercedes-darkblue" />
                            <div>
                              <p className="text-sm text-gray-500">Moteur</p>
                              <p className="font-medium">{vehicle.specs.engine}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Gauge className="h-5 w-5 text-mercedes-darkblue" />
                            <div>
                              <p className="text-sm text-gray-500">Puissance</p>
                              <p className="font-medium">{vehicle.specs.power}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Info className="h-5 w-5 text-mercedes-darkblue" />
                            <div>
                              <p className="text-sm text-gray-500">0-100 km/h</p>
                              <p className="font-medium">{vehicle.specs.acceleration}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Fuel className="h-5 w-5 text-mercedes-darkblue" />
                            <div>
                              <p className="text-sm text-gray-500">Consommation</p>
                              <p className="font-medium">{vehicle.specs.consumption}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Kilométrage:</span>
                            <span className="font-medium">{vehicle.mileage}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">Transmission:</span>
                            <span className="font-medium">{vehicle.transmission}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">Couleur:</span>
                            <span className="font-medium">{vehicle.color}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">Année:</span>
                            <span className="font-medium">{vehicle.year}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">Prix:</span>
                            <span className="font-bold text-mercedes-darkblue">{vehicle.price} €</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="pt-2">
                          <div className="mb-4">
                            <Badge className={`${getAvailabilityColor()} text-white px-3 py-1 w-full justify-center text-base`}>
                              {vehicle.availability}
                            </Badge>
                          </div>
                          
                          <Button 
                            className="w-full bg-mercedes-darkgray hover:bg-mercedes-black text-lg py-6" 
                            onClick={handleReserve}
                            disabled={vehicle.availability === "Vendu"}
                          >
                            {vehicle.availability === "Vendu" ? "Véhicule vendu" : "Réserver ce véhicule"}
                          </Button>
                          
                          <div className="mt-4 flex justify-center">
                            <Button variant="outline" className="flex items-center">
                              <Share2 className="mr-2 h-4 w-4" />
                              Partager
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Besoin d'aide?</CardTitle>
                        <CardDescription>
                          Notre équipe est disponible pour répondre à vos questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">
                          Contactez-nous directement pour plus d'informations sur ce véhicule ou pour organiser une visite.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="bg-mercedes-blue/10 p-2 rounded-full mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mercedes-blue">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                            </span>
                            <span>+213 123 456 789</span>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-mercedes-blue/10 p-2 rounded-full mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mercedes-blue">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                            </span>
                            <span>contact@3ansdz.com</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default VehicleDetailsPage;
