import Countdown from './Countdown';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-hidden pt-20 w-full max-w-[100vw]">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700">
        {/* Floating Circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-float"
              style={{
                width: `${20 + Math.random() * 100}px`,
                height: `${20 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-transparent to-red-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Badge */}
        <div className="mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold text-sm border border-white/30 shadow-lg">
            <span className="text-2xl">🇮🇩</span>
            Dirgahayu Republik Indonesia
            <span className="text-2xl">🇮🇩</span>
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight animate-fade-in-up animation-delay-100">
          HUT KEMERDEKAAN
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300">
            RI KE-81
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
          Perumahan <span className="font-bold text-white">Ciptaland Blok Mawar</span>
          <br />
          <span className="text-red-100">RT 002 / RW 014</span>
        </p>

        {/* Countdown */}
        <div className="mb-10 animate-fade-in-up animation-delay-300">
          <Countdown targetDate="2026-08-17T06:00:00" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-400">
          <a
            href="#register"
            className="group bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              📝 Daftar Lomba
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
          <a
            href="#activities"
            className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              🏆 Lihat Lomba
            </span>
          </a>
        </div>

        {/* Quick Stats - Fix mobile overflow */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto w-full px-2 animate-fade-in-up animation-delay-500">
          {[
            { value: '10+', label: 'Lomba', icon: '🏆' },
            { value: 'Raihlah!', label: 'Total Hadiah', icon: '💰' },
            { value: '18', label: 'Rundown', icon: '📋' },
            { value: '17 Agu', label: '2026', icon: '📅' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all min-w-0"
            >
              <div className="text-2xl sm:text-3xl mb-1">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-white truncate">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-red-100 truncate">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-scroll" />
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 45C840 60 960 90 1080 105C1200 120 1320 120 1380 120L1440 120L1440 120L1380 120C1320 120 1200 120 1080 105C960 90 840 60 720 45C600 30 480 30 360 45C240 60 120 90 60 105L0 120Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes scroll {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </section>
  );
}
