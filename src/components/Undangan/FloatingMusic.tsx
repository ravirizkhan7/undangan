import { useState, useRef, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';
import { motion } from 'motion/react';
import bgsound from '../../../assets/bg-sound.mp3';

export default function FloatingMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayFallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(bgsound);
    audioRef.current.loop = true;

    // Coba autoplay langsung
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // Browser block autoplay → tunggu interaksi pertama user
        const handleFirstInteraction = () => {
          if (audioRef.current && !audioRef.current.paused === false) {
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
          autoplayFallbackRef.current = null;
        };

        autoplayFallbackRef.current = handleFirstInteraction;
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
      });

    return () => {
      audioRef.current?.pause();
      // Cleanup fallback listener kalau masih terpasang
      if (autoplayFallbackRef.current) {
        document.removeEventListener('click', autoplayFallbackRef.current);
        document.removeEventListener('touchstart', autoplayFallbackRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    // Kalau user klik button dan fallback listener masih aktif, hapus dulu
    if (autoplayFallbackRef.current) {
      document.removeEventListener('click', autoplayFallbackRef.current);
      document.removeEventListener('touchstart', autoplayFallbackRef.current);
      autoplayFallbackRef.current = null;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      setIsPlaying(true);
    }
  };

  return (
    // ✅ z-[9999] biar pasti di depan semua elemen
    <div className="fixed top-6 left-0 right-0 px-6 z-[9999] flex justify-between items-start pointer-events-none">
      {/* Badge "Exclusive Preview" */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        <span className="text-[10px] font-medium tracking-widest text-amber-100/90 uppercase">
          Exclusive Preview
        </span>
      </motion.div>

      {/* Floating Audio Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        onClick={togglePlay}
        className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Music className="w-4 h-4 ml-0.5" />
        )}
      </motion.button>
    </div>
  );
}