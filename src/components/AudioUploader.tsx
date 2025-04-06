
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AudioUploaderProps {
  onMusicSelect: (url: string) => void;
  onComplete: () => void;
}

const AudioUploader = ({ onMusicSelect, onComplete }: AudioUploaderProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Verificar en localStorage si ya se ha subido música
  useEffect(() => {
    const uploadedMusic = localStorage.getItem("birthdayMusic");
    if (uploadedMusic) {
      onMusicSelect(uploadedMusic);
      onComplete();
    }
  }, [onMusicSelect, onComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar que sea un archivo de audio
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Por favor, sube un archivo de audio (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Verificar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: "El archivo no debe superar los 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setAudioFile(file);
    }
  };

  const handleUpload = () => {
    if (!audioFile) return;
    
    setIsUploading(true);
    
    // Simular una carga (en un caso real, aquí subirías el archivo a un servidor)
    setTimeout(() => {
      // Crear una URL de objeto para el archivo
      const audioUrl = URL.createObjectURL(audioFile);
      
      // Guardar en localStorage para recordar que ya se subió música
      localStorage.setItem("birthdayMusic", audioUrl);
      
      setIsUploaded(true);
      setIsUploading(false);
      
      toast({
        title: "¡Música cargada con éxito!",
        description: "Tu música se reproducirá automáticamente cuando alguien inicie sesión.",
      });
      
      // Notificar al componente padre sobre la música seleccionada
      onMusicSelect(audioUrl);
      
      // Cerrar el componente después de 2 segundos
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 1500);
  };

  return (
    <Card className="w-[90vw] max-w-md shadow-lg border-birthday-purple/20">
      <CardHeader>
        <CardTitle className="text-xl text-birthday-purple">Música de Cumpleaños</CardTitle>
        <CardDescription>
          Carga una canción especial que se reproducirá cada vez que alguien inicie sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isUploaded ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-birthday-purple/30 rounded-lg p-4 text-center">
              <Input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <label 
                htmlFor="audio-upload" 
                className="block cursor-pointer py-4 px-2 text-birthday-purple hover:text-birthday-pink transition-colors"
              >
                {audioFile ? audioFile.name : "Haz clic para seleccionar un archivo de audio"}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formatos aceptados: MP3, WAV, OGG (máx. 10MB)
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 italic">
                ¡Importante! Esta opción solo estará disponible una vez. Una vez cargada la música, 
                no podrás cambiarla.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-birthday-purple font-medium">¡Música cargada con éxito!</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {!isUploaded && (
          <Button 
            onClick={handleUpload} 
            disabled={!audioFile || isUploading}
            className="bg-birthday-purple hover:bg-birthday-pink text-white"
          >
            {isUploading ? "Cargando..." : "Subir Música"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AudioUploader;
