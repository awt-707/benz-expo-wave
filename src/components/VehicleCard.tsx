
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  specs: {
    engine?: string;
    power?: string;
    acceleration?: string;
    consumption?: string;
  };
}

const VehicleCard = ({ id, image, title, description, specs }: VehicleCardProps) => {
  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4">
            <h3 className="text-white text-xl font-bold font-serif">{title}</h3>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold font-serif mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {specs.engine && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Moteur</span>
              <span className="text-sm font-medium">{specs.engine}</span>
            </div>
          )}
          
          {specs.power && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Puissance</span>
              <span className="text-sm font-medium">{specs.power}</span>
            </div>
          )}
          
          {specs.acceleration && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">0-100 km/h</span>
              <span className="text-sm font-medium">{specs.acceleration}</span>
            </div>
          )}
          
          {specs.consumption && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Consommation</span>
              <span className="text-sm font-medium">{specs.consumption}</span>
            </div>
          )}
        </div>
        
        <Link to={`/vehicules/${id}`} className="mercedes-button inline-block w-full text-center">
          Voir les détails
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
