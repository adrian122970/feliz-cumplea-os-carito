
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CarouselSlide from "@/components/CarouselSlide";
import BirthdayCard from "@/components/BirthdayCard";

const CarouselPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showBirthdayCard, setShowBirthdayCard] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [showSurpriseButton, setShowSurpriseButton] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const [hasSpokenInitialGreeting, setHasSpokenInitialGreeting] = useState(false);
  const [lastSpokenSlide, setLastSpokenSlide] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [originalMusicVolume, setOriginalMusicVolume] = useState(0.5);

  // Quotes para cada imagen
// Quotes para cada imagen - Mensajes más emotivos y personales
const slides = [
{
    imageUrl: "https://scontent.ftru2-2.fna.fbcdn.net/v/t39.30808-6/489623196_1204682728046478_9111588848608538192_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFmY3_nM0Jf1yRNS4_Ae92HOqTkQn4zYKg6pORCfjNgqIfIqATHW10li114oKil-ck2VolrOAAhPkOd7TbywUZ5&_nc_ohc=Wl8OWl34lMoQ7kNvwGiXoBf&_nc_oc=Adk8kNYK9lh17jhVd5rMO2aRX9QktftAPczbsY56kZ0Sl_KUKANdKh1ZpXu7zr51GGM&_nc_zt=23&_nc_ht=scontent.ftru2-2.fna&_nc_gid=1SyXrzGt892OzkS7JugrFw&oh=00_AfGh2vDak2sHG_LK5vhAgM-IoJPnDxWWW68WnXMOI1VFlA&oe=67F8C5F1",
    quote: "Cada foto tuya es un tesoro que guardo en lo más profundo de mi corazón. Tu sonrisa ha iluminado mi vida de tantas formas que las palabras no alcanzan a describir. ¡Feliz cumpleaños, mi querida Carito!"
},
// Las siguientes URLs de Facebook necesitan ser reemplazadas con tus nuevas imágenes
// URL 1 - Necesita reemplazo
{
    imageUrl: "https://scontent.ftru2-3.fna.fbcdn.net/v/t39.30808-6/489220191_1204682771379807_4978590286515945750_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEEbPHBqXu0UjyqnuYSsjRnr-fhi5b95m2v5-GLlv3mbfmnnoPww0D0Slsqx2cpji839DLSL_l8IH-p3Nlxr6FV&_nc_ohc=m6UB8VLTHnIQ7kNvwEmlb8n&_nc_oc=AdnRFSBtv6MaJFGde7cJsIk0qRALMrpNQPgX9kUJ_Fxo2ufBLEOpnxg-XD4sYxYJAW0&_nc_zt=23&_nc_ht=scontent.ftru2-3.fna&_nc_gid=DkSI0u5WJ4XWfScGyZhk8g&oh=00_AfEvr_mKD8auLOzDAWP6UqOQdWEC-rpaD6jSyEnplyCVVw&oe=67F8DBFD",
    quote: "Tu sonrisa es como el amanecer que rompe la oscuridad de cualquier día difícil. El brillo de tus ojos contiene universos enteros de bondad y amor que inspiran a todos los que tenemos la fortuna de conocerte."
},
// URL 2 - Necesita reemplazo
{
    imageUrl: "https://scontent.ftru2-2.fna.fbcdn.net/v/t39.30808-6/489030810_1204682808046470_7599903614116695219_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGjmXWQjEsaLw4CEPk8DwdR87uYqdaUEZnzu5ip1pQRmTqnIq9kxulU32QOPjwBiiqSkb9u2UzJJq3Q2LBLjnFu&_nc_ohc=b5JgT1uR21cQ7kNvwGFVI8y&_nc_oc=AdmC_r4E0JbYybiDrHXv9nLe-zLmvi-SkbqNRX7YLfe4yjwwq-Dp9q7EB5E8ifwK0RY&_nc_zt=23&_nc_ht=scontent.ftru2-2.fna&_nc_gid=qE3OzB1BhaXhJmU-8hw7lQ&oh=00_AfHZu7GNkqLZ86ubE9d1mzbGSjHXVuWvoWalOK3AfDzWWA&oe=67F8BD76",
    quote: "Compartir la vida contigo es como encontrar un oasis en medio del desierto. Tu amistad es el regalo más valioso que podría haber recibido, un tesoro que cuido cada día con todo mi corazón."
},
// URL 3 - Necesita reemplazo
{
    imageUrl: "https://scontent.ftru2-2.fna.fbcdn.net/v/t39.30808-6/488658784_1204682601379824_1066111727035690395_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGyA6Myi8XF0j-JWOEt4LanWnl4Dgvc155aeXgOC9zXnkTzgivAV7cFHfXy4Mq5mJqSC2KGLIh5KLvmupPS1P3w&_nc_ohc=5vcliQ6ji6AQ7kNvwHDz8wy&_nc_oc=Admj2lQJ8LuYMmTHDOpD55oS69_4bGg93XlOioR3IJlMSYnQ0ItZ6vnN6F0rTY_Jjw0&_nc_zt=23&_nc_ht=scontent.ftru2-2.fna&_nc_gid=F9h6Tzq52QzJbt7eA2IwVA&oh=00_AfGtapWo8g3slIjbtKKI6GgbaBZAf3XxI0hifqCRPkh0SA&oe=67F8D675",
    quote: "Cada día a tu lado es un regalo. Tu forma de ver el mundo, tu valentía y tu espíritu iluminan mi vida de maneras que nunca creí posibles. Gracias por compartir tu corazón conmigo."
},
// Espacio para tus nuevas imágenes - Puedes añadir hasta 5 más para completar las 9
// URL 4 - Nueva imagen
{
    imageUrl: "https://scontent.ftru2-1.fna.fbcdn.net/v/t39.30808-6/488993000_1204682641379820_4618140628178246365_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFSQG25sAYl1EMIPslbQHl7eaPJiZEKudd5o8mJkQq51ynpP0HYt8NkKdOgXe46dn-IKGDPEyJVlm4VErVdh0r8&_nc_ohc=pElFyNaon4YQ7kNvwGZHmd_&_nc_oc=AdkWZWJ4aXXzGvi4osiOul3w09HGOmuF86W7ql_MlY9KMOJ-VBh8EmoymAKQDuQeJ8Q&_nc_zt=23&_nc_ht=scontent.ftru2-1.fna&_nc_gid=j-tzmc1YxypUUODAj3xVww&oh=00_AfGwAX0he-2yQ_2d4sgWQrJuizJ5ZLrAnZRYiwAu4LawXA&oe=67F8BD07",
    quote: "En cada risa compartida, en cada momento juntos, encuentro razones para agradecer por tenerte en mi vida. Tu amistad es un tesoro que valoro cada día más."
},
// URL 5 - Nueva imagen
{
    imageUrl: "https://scontent.ftru2-1.fna.fbcdn.net/v/t39.30808-6/489055209_1204682724713145_1223485126839483708_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGItWI7WRbIersG1W9Wsvh6JkjcOyjVGaAmSNw7KNUZoMiXgNB4Kr5WHE1StTfi1DmLdNR5ZrYeLVY7gxlg7Mqn&_nc_ohc=VsywS9VsBAoQ7kNvwH4WIQx&_nc_oc=AdkzbvL0TCTXmSTsCY0GYfoJ5Ki4SW9rM_afSTgxnkI7ZY6aMWh48WLCNyPe0yio8PI&_nc_zt=23&_nc_ht=scontent.ftru2-1.fna&_nc_gid=FJKs7hINtEPoDfHbQ2VddQ&oh=00_AfHo8qy6d6NFeMyR1vdqZHH_Wkb8KfXAOmmhTCJo7Y9oIg&oe=67F8E447",
    quote: "Tu energía y pasión por la vida son contagiosas. Me inspiras a ser mejor persona y a disfrutar cada momento como si fuera único e irrepetible."
},
// URL 6 - Nueva imagen
{
    imageUrl: "https://scontent.ftru2-3.fna.fbcdn.net/v/t39.30808-6/489120943_1204735411374543_606787177810133405_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHYVcAFt4MQLyOgQzn4csApKMgnENcyPykoyCcQ1zI_KQ7bEkn9UvmDuivNOGHC6OArpf451a4mF2agjSqhV0zp&_nc_ohc=U2dotbJEsqsQ7kNvwF6QdYI&_nc_oc=AdlAyygyiXcqzF2a2X9wZ1e1Y6zsEgNpecy3YEQ2QQ56YPENLxMMiXiCF5E2Ph9wyg0&_nc_zt=23&_nc_ht=scontent.ftru2-3.fna&_nc_gid=lKK_Fqmo3EUn79uViAxM3w&oh=00_AfFOTY4dgv5ITubQwc-ZQYS50s6QttEVkhgolvyBkJtNOQ&oe=67F8CDF8",
    quote: "La vida es más hermosa cuando la comparto contigo. Tus sueños, tus alegrías y tus logros son también los míos. ¡Feliz cumpleaños, amiga del alma!"
},
// URL 7 - Nueva imagen
{
    imageUrl: "https://scontent.ftru2-3.fna.fbcdn.net/v/t39.30808-6/489870343_1204735321374552_905694733771923552_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGVOdocfRdKVnLl0R0G-1FNsWae0B5lC06xZp7QHmULTvbTqRlox20ZK4jncTqp5x-PhzdE_fkGv4VJgKn_Zoee&_nc_ohc=1TOO5RKVhvsQ7kNvwFoOG6I&_nc_oc=Admsl-GhPy0VG-7cKunnsxP3mU-5JCzfYS4VTiZQUug_p-Gx-OmGBbU3LW3pXEzRDdE&_nc_zt=23&_nc_ht=scontent.ftru2-3.fna&_nc_gid=RC65c0J2vAzJ1AIMHpp1kw&oh=00_AfG1ot5cigLu7D7exNXNCMko1zj3n1TKguOhkmVK30QUmw&oe=67F8D68A",
    quote: "Eres un regalo para todos los que te conocemos. Tu bondad, tu alegría y tu forma de ser iluminan nuestras vidas de maneras que no puedes imaginar."
},
// URL 8 - Nueva imagen
{
    imageUrl: "https://scontent.ftru2-1.fna.fbcdn.net/v/t39.30808-6/489117352_1204735358041215_2524723697474675371_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFmToWgT9ui64WQsBQzQQckGDtHC7tRSIYYO0cLu1FIhtEZqovbJOhv_U4p4xwAw_SgGDtgiuF589Npt79RQCOE&_nc_ohc=pQZU7-DEPsMQ7kNvwHUFAk8&_nc_oc=AdlDtQGZ0bfEeI7HNh1jgtDk4_h0Zb_-36oDO045w-v_7M7vLYZtXz0jTD1pkI2_Z_o&_nc_zt=23&_nc_ht=scontent.ftru2-1.fna&_nc_gid=Z7iYhgl3rh84-8nMTH6EbA&oh=00_AfEtu2RFotifwkJ6oYPm1XSUwQDpXm5O2J4FGk5aGSlNUg&oe=67F8D25E",
    quote: "En este día tan especial, celebro no solo tu cumpleaños, sino la bendición de tenerte en mi vida. Gracias por ser exactamente como eres."
},
];

// Función para cambiar al siguiente slide automáticamente
const autoAdvance = useCallback(() => {
if (api) {
      api.scrollNext();
    }
  }, [api]);

  // Efecto para la rotación automática
  useEffect(() => {
    const interval = setInterval(() => {
      autoAdvance();
    }, 6000); // Cambiar cada 6 segundos
    
    return () => clearInterval(interval);
  }, [autoAdvance]);
// Efecto para la reproducción de música personalizada
useEffect(() => {
  // Crear una cola de audios para reproducir en secuencia
  const musicQueue = [
    // Primera canción (la que ya estaba)
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Mist_and_Clouds.mp3",
    // Segunda canción (la nueva desde Google Drive)
    "https://drive.google.com/uc?export=download&id=1sxViTxtzfp4RHXGOGlP69gSqKO7fZZa5"
  ];

  // Crear contexto de audio para mejor procesamiento de sonido
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Crear nodos para procesamiento de audio
  const gainNode = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  const equalizer = audioContext.createBiquadFilter();
  
  // Configurar el ecualizador para mejorar la claridad
  equalizer.type = "peaking";
  equalizer.frequency.value = 2500; // Mejorar frecuencias medias para claridad
  equalizer.gain.value = 3; // Ligero aumento para claridad
  equalizer.Q.value = 1.5;
  
  // Configurar el compresor para reducir distorsión
  compressor.threshold.value = -24;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;
  
  // Configurar el nodo de ganancia
  gainNode.gain.value = originalMusicVolume;
  
  // Conectar los nodos de procesamiento
  equalizer.connect(compressor);
  compressor.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Crear instancias de Audio para cada canción con mejor calidad
  const audioElements = musicQueue.map(url => {
    const audio = new Audio(url);
    audio.volume = originalMusicVolume;
    
    // Mejorar la calidad de reproducción
    audio.preload = "auto";
    
    return audio;
  });

  // Guardar la cola de audio en el estado
  setAudioQueue(audioElements);

  // Configurar el primer audio
  const firstAudio = audioElements[0];
  setAudio(firstAudio);

  // Mostrar mensaje para indicar al usuario que debe interactuar
  toast({
    title: "Activar música",
    description: "Haz clic en cualquier parte para iniciar la música",
  });

  // Mostrar el botón de sorpresa después de 15 segundos
  setTimeout(() => {
    setShowSurpriseButton(true);
    console.log("Mostrando botón de sorpresa");
  }, 15000);

  // Función para conectar el elemento de audio al contexto de audio
  const connectAudioToContext = (audioElement: HTMLAudioElement) => {
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(equalizer);
    return source;
  };

  // Función para pasar a la siguiente canción cuando termine la actual
  const setupAudioTransition = (audioElement: HTMLAudioElement, index: number) => {
    audioElement.addEventListener('ended', () => {
      // Si hay más canciones en la cola
      if (index < audioElements.length - 1) {
        const nextIndex = index + 1;
        const nextAudio = audioElements[nextIndex];
        
        // Actualizar el índice actual
        setCurrentAudioIndex(nextIndex);
        
        // Conectar el siguiente audio al contexto de audio
        connectAudioToContext(nextAudio);
        
        // Reproducir la siguiente canción
        nextAudio.play().catch(error => {
          console.error("Error playing next audio:", error);
        });

        // Configurar la transición para la siguiente canción
        setupAudioTransition(nextAudio, nextIndex);

        // Asegurarse de que el botón de sorpresa esté visible cuando comience la última canción
        if (nextIndex === audioElements.length - 1) {
          setShowSurpriseButton(true);
          console.log("Mostrando botón de sorpresa desde transición de audio");
        }
      }
    });
  };

  // Reproducir solo después de interacción del usuario
  const playOnInteraction = () => {
    if (firstAudio) {
      // Reanudar el contexto de audio (necesario debido a políticas de autoplay)
      audioContext.resume().then(() => {
        // Conectar el primer audio al contexto de audio
        connectAudioToContext(firstAudio);
        
        firstAudio.play().catch(error => {
          console.error("Error playing background music:", error);
        });
        
        // Configurar la transición para cuando termine la primera canción
        setupAudioTransition(firstAudio, 0);
      });
    }
    document.removeEventListener('click', playOnInteraction);
  };

  // Añadir listener para detectar la interacción del usuario
  document.addEventListener('click', playOnInteraction);

  // Limpieza al desmontar el componente
  return () => {
    // Detener todas las reproducciones y liberar recursos
    audioElements.forEach(audioElement => {
      audioElement.pause();
      audioElement.src = "";
    });
    document.removeEventListener('click', playOnInteraction);
    
    // Cerrar el contexto de audio
    audioContext.close().catch(error => {
      console.error("Error closing audio context:", error);
    });
  };
}, [toast, originalMusicVolume]);

// Efecto para ajustar el volumen de la música cuando hay narración
useEffect(() => {
  // Si hay música reproduciéndose y hay narración activa
  if (audio && isSpeaking) {
    // Bajar el volumen de la música durante la narración (ducking) con transición suave
    const fadeOutInterval = setInterval(() => {
      if (audio.volume > 0.15) { // No bajar completamente, dejar un volumen de fondo
        audio.volume = Math.max(0.15, audio.volume - 0.03); // Transición más suave
      } else {
        clearInterval(fadeOutInterval);
      }
    }, 30); // Intervalo más corto para una transición más rápida pero suave
    
    return () => clearInterval(fadeOutInterval);
  } else if (audio && !isSpeaking) {
    // Restaurar el volumen original cuando no hay narración con transición suave
    const fadeInInterval = setInterval(() => {
      if (audio.volume < originalMusicVolume) {
        audio.volume = Math.min(originalMusicVolume, audio.volume + 0.02); // Transición más suave
      } else {
        clearInterval(fadeInInterval);
      }
    }, 40); // Intervalo ajustado para una transición más natural
    
    return () => clearInterval(fadeInInterval);
  }
}, [audio, isSpeaking, originalMusicVolume]);

// Función para manejar el inicio y fin de la narración
const handleSpeechStart = () => {
  setIsSpeaking(true);
};

const handleSpeechEnd = () => {
  setIsSpeaking(false);
};

// Voice Greeting (mensaje de voz con tono suave y conmovedor)
useEffect(() => {
  if (!showBirthdayCard && !hasSpokenInitialGreeting) {
    // Dividir el saludo inicial en frases para una narración más natural
    const greetingText = "¡Feliz cumpleaños Carito! Que este día esté lleno de sonrisas y momentos mágicos. Disfruta de tus 23 años con toda la alegría del mundo. Te he preparado un carrusel con nuestros momentos especiales.";
    const sentences = greetingText.split(/(?<=\.|\?|\!|\:)\s+/);
    
    // Esperar un momento antes de reproducir el mensaje
    setTimeout(() => {
      let currentSentenceIndex = 0;
      
      const speakNextSentence = () => {
        if (currentSentenceIndex < sentences.length) {
          const sentenceUtterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex]);
          sentenceUtterance.lang = "es-ES";
          sentenceUtterance.rate = 0.85; // Velocidad ajustada para mejor claridad
          sentenceUtterance.pitch = 1.05; // Tono ligeramente más cálido
          sentenceUtterance.volume = 1.0; // Volumen máximo
          
          // Mejorar la calidad de voz seleccionando una voz específica si está disponible
          const voices = window.speechSynthesis.getVoices();
          const spanishVoice = voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Female')
          );
          
          if (spanishVoice) {
            sentenceUtterance.voice = spanishVoice;
          }
          
          // Solo para la primera frase
          if (currentSentenceIndex === 0) {
            sentenceUtterance.onstart = handleSpeechStart;
          }
          
          // Solo para la última frase
          if (currentSentenceIndex === sentences.length - 1) {
            sentenceUtterance.onend = handleSpeechEnd;
          } else {
            // Para frases intermedias, continuar con la siguiente después de una pausa
            sentenceUtterance.onend = () => {
              setTimeout(speakNextSentence, 450); // Pausa entre frases
            };
          }
          
          window.speechSynthesis.speak(sentenceUtterance);
          currentSentenceIndex++;
        }
      };
      
      // Iniciar la secuencia de narración
      speakNextSentence();
      setHasSpokenInitialGreeting(true);
    }, 1000);
  }
}, [showBirthdayCard, hasSpokenInitialGreeting]);

// Efecto para monitorear el estado de la síntesis de voz
useEffect(() => {
  // Función para verificar si la síntesis de voz está activa
  const checkSpeechStatus = () => {
    const isSpeechActive = window.speechSynthesis.speaking;
    
    // Actualizar el estado solo si hay un cambio
    if (isSpeechActive !== isSpeaking) {
      setIsSpeaking(isSpeechActive);
    }
  };
  
  // Verificar el estado cada 100ms para mayor precisión
  const intervalId = setInterval(checkSpeechStatus, 100);
  
  // Limpiar el intervalo al desmontar
  return () => clearInterval(intervalId);
}, [isSpeaking]);

// Efecto para ajustar el volumen de la música cuando hay narración
useEffect(() => {
  if (!audio) return;
  
  let fadeInterval: NodeJS.Timeout | null = null;
  
  if (isSpeaking) {
    // Bajar el volumen de la música durante la narración (ducking)
    // Usar una transición más rápida para que el efecto sea inmediato
    fadeInterval = setInterval(() => {
      if (audio.volume > 0.15) { // Volumen mínimo durante la narración
        // Reducción más rápida para que la voz sea clara desde el principio
        audio.volume = Math.max(0.15, audio.volume - 0.08);
      } else {
        if (fadeInterval) clearInterval(fadeInterval);
      }
    }, 30); // Intervalo más corto para una transición más rápida
  } else {
    // Restaurar el volumen original cuando no hay narración
    // Usar una transición más gradual para que no sea abrupta
    fadeInterval = setInterval(() => {
      if (audio.volume < originalMusicVolume) {
        audio.volume = Math.min(originalMusicVolume, audio.volume + 0.03);
      } else {
        if (fadeInterval) clearInterval(fadeInterval);
      }
    }, 50); // Intervalo más largo para una transición más suave
  }
  
  // Limpiar el intervalo al desmontar o cuando cambie el estado
  return () => {
    if (fadeInterval) clearInterval(fadeInterval);
  };
}, [audio, isSpeaking, originalMusicVolume]);

// Efecto para narrar las frases de cada slide cuando cambia
useEffect(() => {
  // Solo narrar si ya se mostró el saludo inicial y si el slide actual no ha sido narrado
  if (hasSpokenInitialGreeting && currentSlide !== lastSpokenSlide) {
    // Cancelar cualquier narración en curso
    window.speechSynthesis.cancel();
    setIsSpeaking(false); // Asegurarse de que el estado de narración se actualice
    
    // Pequeña pausa antes de narrar el nuevo slide para evitar superposiciones
    setTimeout(() => {
      // Dividir el texto en frases para una narración más natural
      const sentences = slides[currentSlide].quote.split(/(?<=\.|\?|\!|\:)\s+/);
      
      let currentSentenceIndex = 0;
      
      const speakNextSentence = () => {
        if (currentSentenceIndex < sentences.length) {
          const sentenceUtterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex]);
          sentenceUtterance.lang = "es-ES";
          sentenceUtterance.rate = 0.85; // Velocidad ajustada para mejor claridad
          sentenceUtterance.pitch = 1.05; // Tono ligeramente más cálido
          sentenceUtterance.volume = 1.0; // Volumen máximo
          
          // Mejorar la calidad de voz seleccionando una voz específica si está disponible
          const voices = window.speechSynthesis.getVoices();
          const spanishVoice = voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Female')
          );
          
          if (spanishVoice) {
            sentenceUtterance.voice = spanishVoice;
          }
          
          // Solo para la primera frase
          if (currentSentenceIndex === 0) {
            sentenceUtterance.onstart = handleSpeechStart;
          }
          
          // Solo para la última frase
          if (currentSentenceIndex === sentences.length - 1) {
            sentenceUtterance.onend = () => {
              handleSpeechEnd();
              setLastSpokenSlide(currentSlide);
            };
          } else {
            // Para frases intermedias, continuar con la siguiente después de una pausa
            sentenceUtterance.onend = () => {
              setTimeout(speakNextSentence, 400); // Pausa entre frases
            };
          }
          
          window.speechSynthesis.speak(sentenceUtterance);
          currentSentenceIndex++;
        }
      };
      
      // Asegurarse de que las voces estén cargadas antes de iniciar la narración
      if (window.speechSynthesis.getVoices().length > 0) {
        speakNextSentence();
      } else {
        // Si las voces aún no están cargadas, esperar a que se carguen
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          speakNextSentence();
        };
      }
    }, 800); // Aumentar la pausa para asegurar una transición suave
  }
}, [currentSlide, hasSpokenInitialGreeting, lastSpokenSlide, slides]);

// Mensaje final sorpresa
const showSurpriseMessage = () => {
  setShowFinalMessage(true);
  
  // Cancelar cualquier narración en curso antes de reproducir el mensaje final
  window.speechSynthesis.cancel();
  setIsSpeaking(false); // Actualizar el estado de narración
  
  // Pequeña pausa para asegurar que la cancelación se complete
  setTimeout(() => {
    // Dividir el mensaje final en frases para una narración más natural
    const finalMessageText = "Feliz cumpleaños hermanita, que lo pases de lo mejor en este día tan especial. Te deseo todo lo mejor, y aunque no estamos cerca, te mando un abrazo fuerte. Siempre estaré orgulloso de ti y de la gran persona que eres. ¡Feliz cumpleaños!";
    const sentences = finalMessageText.split(/(?<=\.|\?|\!|\:)\s+/);
    
    let currentSentenceIndex = 0;
    
    const speakNextSentence = () => {
      if (currentSentenceIndex < sentences.length) {
        const sentenceUtterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex]);
        sentenceUtterance.lang = "es-ES";
        sentenceUtterance.rate = 0.8; // Velocidad ajustada para mejor claridad
        sentenceUtterance.pitch = 1.0; // Tono natural
        sentenceUtterance.volume = 1.0; // Volumen máximo
        
        // Mejorar la calidad de voz seleccionando una voz específica si está disponible
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => 
          voice.lang.includes('es') && voice.name.includes('Female')
        );
        
        if (spanishVoice) {
          sentenceUtterance.voice = spanishVoice;
        }
        
        // Solo para la primera frase
        if (currentSentenceIndex === 0) {
          sentenceUtterance.onstart = handleSpeechStart;
        }
        
        // Solo para la última frase
        if (currentSentenceIndex === sentences.length - 1) {
          sentenceUtterance.onend = handleSpeechEnd;
        } else {
          // Para frases intermedias, continuar con la siguiente después de una pausa
          sentenceUtterance.onend = () => {
            setTimeout(speakNextSentence, 500); // Pausa más larga entre frases para el mensaje final
          };
        }
        
        window.speechSynthesis.speak(sentenceUtterance);
        currentSentenceIndex++;
      }
    };
    
    // Iniciar la secuencia de narración
    speakNextSentence();
  }, 300);
};
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Actualizamos cuando cambia el api del carrusel
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      // Actualizar el índice actual
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-birthday-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showBirthdayCard && (
        <BirthdayCard
          name="Carito"
          age={23}
          onClose={() => setShowBirthdayCard(false)}
        />
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-8 text-gold-gradient animate-pulse">
        Momentos Especiales de Carito
      </h1>
      
      <div className="w-full max-w-4xl px-4 md:px-12">
        <Carousel 
          className="w-full" 
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
                <CarouselSlide
                  imageUrl={slide.imageUrl}
                  quote={slide.quote}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="md:-left-4 lg:-left-8" />
          <CarouselNext className="md:-right-4 lg:-right-8" />
        </Carousel>
      </div>
      
      <div className="flex justify-center mt-4 gap-1">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
              i === currentSlide ? "bg-birthday-gold w-4" : "bg-white/50"
            }`}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-4">
        <Button 
          onClick={() => navigate("/surprise")}
          className="bg-birthday-purple hover:bg-birthday-pink text-white font-medium px-8 py-2 rounded-full"
        >
          Volver
        </Button>
        
        {showSurpriseButton && !showFinalMessage && (
          <Button 
            onClick={showSurpriseMessage}
            className="bg-birthday-gold hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-full animate-bounce mt-6 text-lg shadow-lg border-2 border-white"
          >
            ¡SORPRESA ESPECIAL! Haz clic aquí
          </Button>
        )}
        
        {showFinalMessage && (
          <div className="mt-6 p-6 bg-white/90 rounded-lg shadow-lg max-w-md text-center animate-fadeIn">
            <h3 className="text-2xl font-bold text-birthday-purple mb-3">Mensaje Especial</h3>
            <p className="text-lg text-gray-800">
              Feliz cumpleaños hermanita, que lo pases de lo mejor en este día tan especial. 
              Te deseo todo lo mejor, y aunque no estamos cerca, te mando un abrazo fuerte. 
              ¡Feliz cumpleaños!
            </p>
            <div className="mt-4 text-3xl">❤️🎂✨</div>
          </div>
        )}
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${10 + Math.random() * 20}px`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.2 + Math.random() * 0.3,
            }}
          >
            {["✨", "🎂", "🎁", "🎈", "🎉"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselPage;
