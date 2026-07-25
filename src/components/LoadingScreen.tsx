import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinish: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoaded(true);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-red-600 via-red-500 to-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>

      {/* Logo & Title */}
      <div className="relative z-10 text-center">
        {/* Flag Animation */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
            <span className="text-6xl font-black text-red-600">81</span>
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 rounded-full animate-ping opacity-20" />
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-red-400 rounded-full animate-ping opacity-20" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
          HUT RI KE-81
        </h1>
        <p className="text-red-100 text-lg mb-8">
          Ciptaland Blok Mawar
        </p>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 mx-auto">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Memuat...</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-10 text-center">
        <p className="text-white/80 text-sm">
          🇮🇩 Dirgahayu Republik Indonesia 🇮🇩
        </p>
        <p className="text-white/60 text-xs mt-1">
          RT 002 / RW 014 - Perumahan Ciptaland Blok Mawar
        </p>
      </div>
    </div>
  );
}
