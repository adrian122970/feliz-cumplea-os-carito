
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BirthdayCardProps {
  name: string;
  age: number;
  onClose: () => void;
}

const BirthdayCard = ({ name, age, onClose }: BirthdayCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
const [birthdaySong, setBirthdaySong] = useState<HTMLAudioElement | null>(null);
const [audioInitialized, setAudioInitialized] = useState(false);

useEffect(() => {
    // Crear audio para cumpleaños
    const audio = new Audio();
    // Usar un audio de feliz cumpleaños de una fuente confiable y estable
    audio.src = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Monk_Turner__Fascinoma/The_New_Birthday_Song_Contest/Monk_Turner__Fascinoma_-_01_-_Its_Your_Birthday.mp3";
    audio.volume = 0.6;
    setBirthdaySong(audio);
    setAudioInitialized(true);

    setTimeout(() => {
    setIsVisible(true);
    createConfetti();
    
    // Solo configurar el listener para reproducir con interacción del usuario
    const playOnClick = () => {
        if (audio && audioInitialized) {
        audio.play().catch(e => console.error("Error playing audio after click:", e));
        document.removeEventListener('click', playOnClick);
        }
    };
    
    document.addEventListener('click', playOnClick, { once: true });
    }, 100);

    // Auto-close after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 15000);

    return () => {
    clearTimeout(timer);
    if (audio) {
        audio.pause();
        // No limpiar la fuente de audio aquí, para prevenir el error "NotSupportedError"
    }
    };
  }, [onClose]);

  const createConfetti = () => {
    const elements: JSX.Element[] = [];
    const colors = ["#FFD700", "#9b87f5", "#D946EF", "#E5DEFF", "#FFC0CB", "#FF69B4"];
    
    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      elements.push(
        <div 
          key={i}
          style={{ 
            position: "absolute",
            width: `${5 + Math.random() * 10}px`,
            height: `${5 + Math.random() * 10}px`,
            backgroundColor: color,
            left: `${left}%`,
            top: "-20px",
            opacity: 0.7,
            borderRadius: "50%",
            animation: `fall ${2 + Math.random() * 3}s ease-out forwards ${Math.random() * 3}s`
          }}
        />
      );
    }
    
    setConfetti(elements);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        {confetti}
        <Card className={`w-[90vw] max-w-md border-birthday-gold/50 bg-white/95 shadow-2xl transition-all duration-700 animate-pulse-glow ${isVisible ? 'scale-100' : 'scale-90'}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-playfair text-gold-gradient">
            ¡Feliz Cumpleaños!
            </CardTitle>
            <CardDescription className="text-birthday-purple font-medium text-lg">
              Es tu día especial {name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl animate-bounce">
            🎂
            </div>
            <p className="font-playfair italic text-lg">
              "Que tus {age} años estén llenos de curiosidad, descubrimientos y momentos mágicos que iluminen tu camino."
            </p>
            <div className="flex justify-center space-x-3 text-3xl my-4">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>🎁</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🎉</span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>🎈</span>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button 
              onClick={onClose}
              className="bg-birthday-purple hover:bg-birthday-pink text-white animate-pulse"
            >
              Continuar
            </Button>
          </CardFooter>
        </Card>
        
        {/* Light rays effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 h-[200%] w-5 bg-gradient-to-t from-transparent via-birthday-gold/30 to-transparent"
              style={{
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                opacity: 0.6 + Math.random() * 0.4,
                animation: `light-pulse ${3 + Math.random() * 4}s infinite alternate`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
