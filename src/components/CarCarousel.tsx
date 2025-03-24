
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface CarCarouselProps {
  items: CarouselItem[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const CarCarousel = ({
  items,
  autoSlide = true,
  autoSlideInterval = 5000,
}: CarCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((currentIndex) => (currentIndex === 0 ? items.length - 1 : currentIndex - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((currentIndex) => (currentIndex === items.length - 1 ? 0 : currentIndex + 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    if (autoSlide) {
      const startTimer = () => {
        timerRef.current = setInterval(() => {
          next();
        }, autoSlideInterval);
      };

      startTimer();

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [autoSlide, autoSlideInterval, currentIndex]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (autoSlide && !timerRef.current) {
      timerRef.current = setInterval(() => {
        next();
      }, autoSlideInterval);
    }
  };

  return (
    <div 
      className="relative overflow-hidden h-[500px] md:h-[600px] lg:h-[700px] w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full h-full relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70 flex items-end">
              <div className="container mx-auto px-4 pb-16 md:pb-24">
                <div className="max-w-3xl">
                  <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
                    {item.title}
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl mb-6">
                    {item.description}
                  </p>
                  <button className="mercedes-button">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button 
          onClick={prev}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-mercedes-blue/80 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-mercedes-blue/80 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentIndex(i);
              setTimeout(() => setIsAnimating(false), 700);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-mercedes-blue w-6' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarCarousel;
