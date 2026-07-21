import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
          <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl -z-10" />
      </div>
      <span className="text-xs sm:text-sm text-red-100 mt-2 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg sm:text-xl font-semibold">
        🎉 Menuju Hari Kemerdekaan 🎉
      </h3>
      <div className="flex justify-center gap-2 sm:gap-4">
        <TimeUnit value={timeLeft.days} label="Hari" />
        <TimeUnit value={timeLeft.hours} label="Jam" />
        <TimeUnit value={timeLeft.minutes} label="Menit" />
        <TimeUnit value={timeLeft.seconds} label="Detik" />
      </div>
    </div>
  );
}
