
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = "up", 
  distance = 50,
  duration = 1000
}: ScrollRevealProps) => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("active");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (revealRef.current) {
      // Apply the direction-specific class
      revealRef.current.classList.add(`reveal-${direction}`);
      revealRef.current.style.setProperty("--reveal-distance", `${distance}px`);
      revealRef.current.style.setProperty("--reveal-duration", `${duration}ms`);
      observer.observe(revealRef.current);
    }

    return () => {
      if (revealRef.current) {
        observer.unobserve(revealRef.current);
      }
    };
  }, [delay, direction, distance, duration]);

  return (
    <div ref={revealRef} className="reveal">
      {children}
    </div>
  );
};

export default ScrollReveal;
