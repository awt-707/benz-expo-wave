import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, UserCheck, ChevronRight, Star } from "lucide-react";
import CarCarousel from "@/components/CarCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPanel from "@/components/VideoPanel";

const carouselItems = [
  {
    id: 1,
    image: "/lovable-uploads/ea38bd58-5015-4016-a27f-9e96383424fb.png",
    title: "Votre Partenaire d'Exportation Automobile",
    description: "Spécialiste de l'exportation de véhicules premium de l'Europe vers l'Algérie."
  },
  {
    id: 2,
    image: "/lovable-uploads/3bf54152-1a0e-47d2-a44f-fae8843a5058.png",
    title: "Qualité et Fiabilité Garanties",
    description: "Des véhicules soigneusement sélectionnés pour répondre à vos exigences."
  },
  {
    id: 3,
    image: "/lovable-uploads/964d32ef-a58e-44f7-a136-d1b93fdab210.png",
    title: "Service d'Exportation Premium",
    description: "Un accompagnement personnalisé pour simplifier votre acquisition."
  }
];

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

const testimonials = [
  {
    id: 1,
    name: "Ahmed B.",
    role: "Entrepreneur",
    content: "J'ai fait appel à -3ans DZ pour l'achat et l'exportation d'une Mercedes Classe E. Le service était impeccable, transparent et professionnel. Je recommande vivement!",
    rating: 5
  },
  {
    id: 2,
    name: "Sara M.",
    role: "Médecin",
    content: "Une équipe sérieuse qui a su répondre à mes attentes. La voiture est arrivée en parfait état et dans les délais annoncés. Merci pour votre professionnalisme.",
    rating: 5
  },
  {
    id: 3,
    name: "Karim L.",
    role: "Directeur Commercial",
    content: "Excellente expérience avec -3ans DZ. Des conseillers compétents, des délais respectés et un véhicule conforme à la description. Je n'hésiterai pas à faire appel à leurs services à nouveau.",
    rating: 4
  }
];

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      
      <main>
        <VideoPanel />
        
        <section className="pt-16">
          <CarCarousel items={carouselItems} />
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                  Exportation de Véhicules Premium
                </h2>
                <p className="text-gray-600 text-lg">
                  -3ans DZ vous accompagne dans l'acquisition et l'exportation de véhicules haut de gamme de l'Europe vers l'Algérie.
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={index * 100}>
                  <div className="glass-card p-8 text-center">
                    <div className="w-12 h-12 bg-mercedes-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 text-mercedes-blue">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <ScrollReveal>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                    Pourquoi choisir -3ans DZ?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Avec plus de 5 ans d'expérience dans l'exportation automobile, -3ans DZ s'est imposé comme un acteur de référence sur le marché. Notre expertise nous permet de vous offrir un service complet, de la sélection du véhicule jusqu'à sa livraison en Algérie.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-3 text-mercedes-blue">
                        <ChevronRight size={20} />
                      </div>
                      <span>Sélection rigoureuse des véhicules</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 text-mercedes-blue">
                        <ChevronRight size={20} />
                      </div>
                      <span>Gestion complète des formalités administratives et douanières</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 text-mercedes-blue">
                        <ChevronRight size={20} />
                      </div>
                      <span>Transport sécurisé par des transporteurs agréés</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 text-mercedes-blue">
                        <ChevronRight size={20} />
                      </div>
                      <span>Suivi en temps réel de votre commande</span>
                    </li>
                  </ul>
                  <div className="mt-10">
                    <Link to="/services" className="mercedes-button">
                      Découvrir nos services
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="md:w-1/2">
                <ScrollReveal delay={200}>
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-mercedes-blue z-0"></div>
                    <img 
                      src="/lovable-uploads/29df00a1-3840-4b5a-b171-484af6b189aa.png" 
                      alt="Mercedes-Benz Showroom" 
                      className="w-full h-auto rounded-sm shadow-xl relative z-10"
                    />
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-mercedes-blue z-0"></div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                  Ce que nos clients disent
                </h2>
                <p className="text-gray-600 text-lg">
                  La satisfaction de nos clients est notre priorité absolue.
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollReveal key={testimonial.id} delay={index * 100}>
                  <div className="glass-card p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < testimonial.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-mercedes-black text-white">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Prêt à démarrer?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-10">
                Contactez-nous dès aujourd'hui pour discuter de votre projet d'acquisition de véhicule et bénéficier de notre expertise en exportation.
              </p>
              <Link to="/contact" className="inline-block bg-white text-mercedes-black font-medium px-8 py-3 rounded-none transition-all duration-300 hover:bg-mercedes-blue hover:text-white">
                Nous contacter
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default HomePage;
