
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

const vehicles = [
  {
    id: "classe-c",
    image: "/lovable-uploads/d6338b3f-2a4f-4279-90e4-8775cb7acd40.png",
    title: "Mercedes-Benz Classe C",
    description: "Élégance, confort et technologie de pointe. La Classe C incarne le luxe accessible.",
    price: "45 000",
    year: "2022",
    specs: {
      engine: "2.0L Turbo",
      power: "204 ch",
      acceleration: "7.3s",
      consumption: "6.2L/100km"
    },
    availability: "En stock" as const,
    fuelType: "Essence"
  },
  {
    id: "classe-e",
    image: "/lovable-uploads/3bf54152-1a0e-47d2-a44f-fae8843a5058.png",
    title: "Mercedes-Benz Classe E",
    description: "Sophistication et performances exceptionnelles pour cette berline de référence.",
    price: "65 000",
    year: "2023",
    specs: {
      engine: "3.0L V6",
      power: "286 ch",
      acceleration: "5.9s",
      consumption: "7.4L/100km"
    },
    availability: "Sur commande" as const,
    fuelType: "Hybride"
  },
  {
    id: "classe-s",
    image: "/lovable-uploads/964d32ef-a58e-44f7-a136-d1b93fdab210.png",
    title: "Mercedes-Benz Classe S",
    description: "L'expression ultime du luxe automobile, alliant confort incomparable et innovations technologiques.",
    price: "110 000",
    year: "2023",
    specs: {
      engine: "4.0L V8",
      power: "435 ch",
      acceleration: "4.8s",
      consumption: "8.6L/100km"
    },
    availability: "Sur commande" as const,
    fuelType: "Hybride"
  },
  {
    id: "gle",
    image: "/lovable-uploads/29df00a1-3840-4b5a-b171-484af6b189aa.png",
    title: "Mercedes-Benz GLE",
    description: "Un SUV alliant polyvalence, confort et performances pour toutes vos aventures.",
    price: "78 000",
    year: "2022",
    specs: {
      engine: "3.0L V6",
      power: "330 ch",
      acceleration: "5.7s",
      consumption: "8.1L/100km"
    },
    availability: "En stock" as const,
    fuelType: "Diesel"
  },
  {
    id: "glc",
    image: "/lovable-uploads/ea38bd58-5015-4016-a27f-9e96383424fb.png",
    title: "Mercedes-Benz GLC",
    description: "Le SUV compact qui offre un équilibre parfait entre élégance urbaine et capacités tout-terrain.",
    price: "58 000",
    year: "2023",
    specs: {
      engine: "2.0L Turbo",
      power: "258 ch",
      acceleration: "6.2s",
      consumption: "7.1L/100km"
    },
    availability: "En stock" as const,
    fuelType: "Essence"
  },
  {
    id: "cla",
    image: "/lovable-uploads/d6338b3f-2a4f-4279-90e4-8775cb7acd40.png",
    title: "Mercedes-Benz CLA",
    description: "Design coupé séduisant et performances dynamiques pour un plaisir de conduite unique.",
    price: "42 000",
    year: "2021",
    specs: {
      engine: "2.0L Turbo",
      power: "224 ch",
      acceleration: "6.3s",
      consumption: "6.4L/100km"
    },
    availability: "Vendu" as const,
    fuelType: "Électrique"
  }
];

type FuelType = "Essence" | "Diesel" | "Hybride" | "Électrique";

const VehiculesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<FuelType[]>([]);
  const [yearRange, setYearRange] = useState([2021, 2023]);
  
  // Filter vehicles based on selected criteria
  const filteredVehicles = vehicles.filter(vehicle => {
    // Filter by fuel type if any is selected
    const fuelTypeMatch = selectedFuelTypes.length === 0 || selectedFuelTypes.includes(vehicle.fuelType as FuelType);
    
    // Filter by year range
    const vehicleYear = parseInt(vehicle.year);
    const yearMatch = vehicleYear >= yearRange[0] && vehicleYear <= yearRange[1];
    
    return fuelTypeMatch && yearMatch;
  });

  // Count available vehicles after filtering
  const availableCount = filteredVehicles.filter(v => v.availability === "En stock").length;

  const toggleFuelType = (fuelType: FuelType) => {
    setSelectedFuelTypes(prev => 
      prev.includes(fuelType) 
        ? prev.filter(type => type !== fuelType)
        : [...prev, fuelType]
    );
  };

  return (
    <>
      <Navbar />
      
      <main>
        <section className="pt-28 pb-20 bg-gradient-to-b from-mercedes-black via-mercedes-darkgray to-black text-white shadow-lg">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-center drop-shadow-md">
                Nos Véhicules
              </h1>
              <p className="text-white/90 max-w-3xl mx-auto text-center text-lg md:text-xl">
                Découvrez notre sélection de véhicules Mercedes-Benz disponibles pour l'exportation vers l'Algérie. 
                <span className="font-bold text-mercedes-blue ml-2">{availableCount} véhicules actuellement en stock.</span>
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-4 lg:mb-0">Véhicules disponibles</h2>
              
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center text-sm bg-green-100 px-3 py-1 rounded-full">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                  En stock
                </span>
                <span className="inline-flex items-center text-sm bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                  Sur commande
                </span>
                <span className="inline-flex items-center text-sm bg-red-100 px-3 py-1 rounded-full">
                  <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                  Vendu
                </span>
              </div>
            </div>
            
            <Collapsible 
              open={filtersOpen} 
              onOpenChange={setFiltersOpen}
              className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-mercedes-darkblue" />
                  <h3 className="text-lg font-medium">Filtres</h3>
                </div>
                <CollapsibleTrigger className="rounded-full hover:bg-gray-100 p-2 transition-colors">
                  {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-4 space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Type de carburant</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Essence", "Diesel", "Hybride", "Électrique"].map((fuel) => (
                      <div key={fuel} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`fuel-${fuel}`} 
                          checked={selectedFuelTypes.includes(fuel as FuelType)}
                          onCheckedChange={() => toggleFuelType(fuel as FuelType)}
                          className="data-[state=checked]:bg-mercedes-darkblue"
                        />
                        <label 
                          htmlFor={`fuel-${fuel}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {fuel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Année du véhicule</h4>
                  <div className="px-2">
                    <Slider 
                      defaultValue={[2021, 2023]} 
                      min={2021} 
                      max={2023} 
                      step={1} 
                      value={yearRange}
                      onValueChange={(value) => setYearRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Separator className="mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (
                  <ScrollReveal key={vehicle.id} delay={index * 100}>
                    <VehicleCard
                      id={vehicle.id}
                      image={vehicle.image}
                      title={vehicle.title}
                      description={vehicle.description}
                      price={vehicle.price}
                      year={vehicle.year}
                      specs={vehicle.specs}
                      availability={vehicle.availability}
                    />
                  </ScrollReveal>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-gray-500">Aucun véhicule ne correspond à vos critères de recherche.</p>
                  <button 
                    onClick={() => {
                      setSelectedFuelTypes([]);
                      setYearRange([2021, 2023]);
                    }}
                    className="mt-4 text-mercedes-blue hover:text-mercedes-darkblue underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-gray-50 to-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-serif font-bold mb-6 text-mercedes-darkblue">
                  Vous ne trouvez pas ce que vous cherchez?
                </h2>
                <p className="text-gray-700 mb-8 text-lg">
                  Nous pouvons vous aider à trouver le véhicule parfait qui correspond à vos besoins spécifiques. 
                  Contactez-nous pour une recherche personnalisée.
                </p>
                <a 
                  href="/contact" 
                  className="mercedes-button bg-mercedes-darkblue hover:bg-mercedes-black inline-flex items-center group"
                >
                  Demande spéciale
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default VehiculesPage;
