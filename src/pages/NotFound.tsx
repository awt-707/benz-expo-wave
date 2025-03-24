
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card max-w-lg mx-auto p-10">
            <h1 className="text-6xl font-serif font-bold mb-6 text-mercedes-black">404</h1>
            <h2 className="text-2xl font-serif mb-6">Page non trouvée</h2>
            <p className="text-gray-600 mb-8">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link 
              to="/" 
              className="mercedes-button inline-block"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NotFound;
