
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CarouselSlideProps {
  imageUrl: string;
  quote: string;
}

const CarouselSlide = ({ imageUrl, quote }: CarouselSlideProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isHovered) {
      createSparkles();
    }
  }, [isHovered]);

  const createSparkles = () => {
    const elements: JSX.Element[] = [];
    
    for (let i = 0; i < 10; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = 10 + Math.random() * 15;
      
      elements.push(
        <div 
          key={i}
          className="absolute text-birthday-gold animate-pulse"
          style={{ 
            left: `${left}%`, 
            top: `${top}%`,
            fontSize: `${size}px`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.7 + Math.random() * 0.3
          }}
        >
          ✨
        </div>
      );
    }
    
    setSparkles(elements);
  };

  return (
    <Card 
      className={`overflow-hidden border border-birthday-purple/20 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'transform scale-105 shadow-xl shadow-birthday-purple/20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Recuerdo especial" 
            className="w-full h-[300px] object-cover transition-transform duration-700 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-70'}`} />
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-white font-playfair italic text-lg md:text-xl">
              "{quote}"
            </p>
          </div>
          
          <div className="absolute top-4 right-4 text-3xl animate-float">
            🎠
          </div>

          {isHovered && sparkles}
          
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-birthday-purple/10 to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-birthday-gold via-birthday-purple to-birthday-pink"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarouselSlide;
