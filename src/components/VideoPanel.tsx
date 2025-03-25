
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { PlayCircle, PauseCircle } from "lucide-react";

const VideoPanel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      videoElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    };
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 to-black/70"></div>
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        preload="auto"
        loop
      >
        <source src="/videos/mercedes-experience.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            L'Excellence Automobile
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl text-center mb-12 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Découvrez notre sélection de véhicules d'exception
          </p>
          <div className="flex justify-center">
            <button 
              onClick={togglePlay}
              className="flex items-center gap-2 bg-mercedes-blue hover:bg-mercedes-blue/90 px-8 py-4 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isPlaying ? (
                <>
                  <PauseCircle size={24} />
                  <span className="font-medium tracking-wide">Pause</span>
                </>
              ) : (
                <>
                  <PlayCircle size={24} />
                  <span className="font-medium tracking-wide">Voir la vidéo</span>
                </>
              )}
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VideoPanel;
