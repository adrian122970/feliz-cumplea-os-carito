
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AudioUploader from "@/components/AudioUploader";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showMusicUploader, setShowMusicUploader] = useState(false);
  const [customMusic, setCustomMusic] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar si ya existe música personalizada
  useEffect(() => {
    const savedMusic = localStorage.getItem("birthdayMusic");
    if (savedMusic) {
      setCustomMusic(savedMusic);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "06" && password === "23") {
      toast({
        title: "¡Acceso concedido!",
        description: "Preparando tu sorpresa...",
      });
      setTimeout(() => {
        navigate("/surprise");
      }, 1500);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleMusicSelect = (url: string) => {
    setCustomMusic(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-birthday-gradient">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `scale(${0.5 + Math.random() * 0.5})`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          >
            <div className="text-birthday-gold text-4xl">✨</div>
          </div>
        ))}
      </div>
      
      {showMusicUploader ? (
        <AudioUploader 
          onMusicSelect={handleMusicSelect}
          onComplete={() => setShowMusicUploader(false)}
        />
      ) : (
        <Card className="w-[350px] backdrop-blur-sm bg-white/80 border-birthday-purple/20 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center font-playfair text-purple-gradient">
              Bienvenid@
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus datos para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-birthday-purple" />
                  </div>
                  <Input
                    className="pl-10 border-birthday-purple/30 focus-visible:ring-birthday-purple"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-birthday-purple" />
                  </div>
                  <Input
                    className="pl-10 border-birthday-purple/30 focus-visible:ring-birthday-purple"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleLogin} 
              className="w-full bg-birthday-purple hover:bg-birthday-pink"
            >
              Ingresar
            </Button>
            
            {!customMusic && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-birthday-purple/20 text-birthday-purple"
                onClick={() => setShowMusicUploader(true)}
              >
                <Music className="h-3 w-3 mr-1" />
                Personalizar música
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Login;
