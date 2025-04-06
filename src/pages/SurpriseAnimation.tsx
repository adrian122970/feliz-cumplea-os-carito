
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SurpriseAnimation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Verificar si hay música personalizada guardada
    const customMusic = localStorage.getItem("birthdayMusic");
    
    // Crear un nuevo elemento de audio
    const backgroundMusic = new Audio();
    
    if (customMusic) {
      // Usar la música personalizada
      backgroundMusic.src = customMusic;
    } else {
      // Usar música por defecto
      backgroundMusic.src = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Christina_Perri/Songify_This/Christina_Perri_-_A_Thousand_Years_Twilight_-_Breaking_Dawn_OST.mp3";
    }
    
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    setAudio(backgroundMusic);
    
    // Mostrar el contenido con animación
    setTimeout(() => {
      setShowContent(true);
      
      // Intentar reproducir el audio
      backgroundMusic.play().catch(error => {
        console.error("Error playing audio:", error);
        // Mostrar un mensaje al usuario sobre el bloqueo de audio
        toast({
          title: "Activar música",
          description: "Haz clic en cualquier parte de la pantalla para activar la música",
        });
        
        // Añadir un listener para reproducir la música con interacción del usuario
        const playOnInteraction = () => {
          backgroundMusic.play().catch(e => console.error("Error playing audio after click:", e));
          document.removeEventListener('click', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction);
      });
      
      // Generar confetti
      createConfetti();
      
      // Mostrar botón después de 10 segundos
      setTimeout(() => {
        setShowButton(true);
      }, 10000);
      
      // Redirigir automáticamente después de 30 segundos si el usuario no hace clic
      setTimeout(() => {
        navigate("/carousel");
      }, 30000);
    }, 500);

    // Voice Greeting (mensaje de voz)
    setTimeout(() => {
      const voiceGreeting = new SpeechSynthesisUtterance();
      voiceGreeting.text = "¡Feliz cumpleaños Carito! Que este día esté lleno de sonrisas y momentos especiales. Disfruta cada instante de tus 23 años con toda la alegría del mundo.";
      voiceGreeting.lang = "es-ES";
      voiceGreeting.rate = 0.9;
      
      window.speechSynthesis.speak(voiceGreeting);
    }, 1500);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [navigate, toast]);

  const createConfetti = () => {
    const elements: JSX.Element[] = [];
    const colors = ["#FFD700", "#9b87f5", "#D946EF", "#E5DEFF", "#FFC0CB", "#FF69B4"];
    
    for (let i = 0; i < 150; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 5 + Math.random() * 10;
      
      elements.push(
        <div 
          key={i}
          className="confetti"
          style={{ 
            left: `${left}%`, 
            top: `${top}%`, 
            "--color": color, 
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s` 
          } as React.CSSProperties}
        />
      );
    }
    
    setConfetti(elements);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-birthday-gradient relative overflow-hidden">
      {confetti}
      
      <div className={`text-center max-w-2xl px-4 transition-all duration-1000 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
        <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 text-gold-gradient animate-pulse">
          ¡Feliz Cumpleaños Carito!
        </h1>
        
        <div className="relative mb-8">
          <div className="text-xl md:text-2xl text-white bg-birthday-purple/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 animate-pulse-glow">
            <p className="italic font-playfair">
              "En este día tan especial, celebramos tu curiosidad, tu alegría y todo lo maravilloso que eres. 
              Que tus 23 años estén llenos de descubrimientos, sonrisas y momentos inolvidables."
            </p>
          </div>
          
          <div className="absolute -right-4 -top-4 animate-bounce-gift text-5xl">
            🎁
          </div>
          
          <div className="absolute -left-4 -bottom-4 animate-float text-4xl" style={{ animationDelay: "0.5s" }}>
            🎈
          </div>
        </div>
        
        {showButton && (
          <Button 
            onClick={() => navigate("/carousel")}
            className="bg-birthday-gold hover:bg-amber-400 text-black font-medium px-8 py-2 rounded-full shadow-lg transition-all animate-scale-in"
          >
            Ver tu regalo
          </Button>
        )}
      </div>
      
      {/* Light effects */}
      <div className="light-effect light-effect-1"></div>
      <div className="light-effect light-effect-2"></div>
      <div className="light-effect light-effect-3"></div>
      
      {[...Array(20)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-sparkle text-3xl"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: 0.7 + Math.random() * 0.3
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default SurpriseAnimation;
