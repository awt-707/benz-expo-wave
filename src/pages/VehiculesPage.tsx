
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Separator } from "@/components/ui/separator";

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
    availability: "En stock" as const
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
    availability: "Sur commande" as const
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
    availability: "Sur commande" as const
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
    availability: "En stock" as const
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
    availability: "En stock" as const
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
    availability: "Vendu" as const
  }
];

const VehiculesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Count available vehicles
  const availableCount = vehicles.filter(v => v.availability === "En stock").length;

  return (
    <>
      <Navbar />
      
      <main>
        <section className="pt-24 pb-16 bg-gradient-to-b from-mercedes-black to-mercedes-darkgray text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">
                Nos Véhicules
              </h1>
              <p className="text-white/80 max-w-3xl mx-auto text-center text-lg">
                Découvrez notre sélection de véhicules Mercedes-Benz disponibles pour l'exportation vers l'Algérie. {availableCount} véhicules actuellement en stock.
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif font-bold">Véhicules disponibles</h2>
              <div className="flex gap-2">
                <span className="inline-flex items-center text-sm">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                  En stock
                </span>
                <span className="inline-flex items-center text-sm">
                  <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                  Sur commande
                </span>
                <span className="inline-flex items-center text-sm">
                  <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                  Vendu
                </span>
              </div>
            </div>
            
            <Separator className="mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle, index) => (
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
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-serif font-bold mb-6">
                  Vous ne trouvez pas ce que vous cherchez?
                </h2>
                <p className="text-gray-600 mb-8">
                  Nous pouvons vous aider à trouver le véhicule parfait qui correspond à vos besoins spécifiques. Contactez-nous pour une recherche personnalisée.
                </p>
                <a href="/contact" className="mercedes-button">
                  Demande spéciale
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
