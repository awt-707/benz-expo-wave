
import { ShieldCheck, Truck, UserCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: <ShieldCheck size={24} />,
    title: "Qualité Garantie",
    description: "Tous nos véhicules sont minutieusement inspectés pour assurer une qualité irréprochable."
  },
  {
    icon: <Truck size={24} />,
    title: "Livraison Fiable",
    description: "Transport sécurisé et livraison dans les délais convenus."
  },
  {
    icon: <UserCheck size={24} />,
    title: "Service Personnalisé",
    description: "Un conseiller dédié vous accompagne tout au long du processus d'achat et d'exportation."
  }
];

const HomeFeatures = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-mercedes-black">
              Exportation de Véhicules Premium
            </h2>
            <div className="w-24 h-1 bg-mercedes-blue mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">
              -3ans DZ vous accompagne dans l'acquisition et l'exportation de véhicules haut de gamme de l'Europe vers l'Algérie.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 150}>
              <div className="bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center rounded-sm border-t-4 border-mercedes-blue">
                <div className="w-16 h-16 bg-mercedes-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 text-mercedes-blue">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif font-bold mb-4 text-mercedes-black">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
