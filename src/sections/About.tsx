export default function About() {
  const features = [
    { icon: '🤝', title: 'Kebersamaan', desc: 'Mempererat silaturahmi' },
    { icon: '🎉', title: 'Kemeriahan', desc: 'Berbagai lomba seru' },
    { icon: '🏆', title: 'Hadiah', desc: 'Total jutaan rupiah' },
    { icon: '🇮🇩', title: 'Nasionalisme', desc: 'Semangat kemerdekaan' },
  ];

  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
            TENTANG ACARA
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Merayakan Kemerdekaan Bersama
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Dalam rangka memeriahkan <span className="font-bold text-red-600">Hari Ulang Tahun Kemerdekaan Republik Indonesia yang ke-81</span>, 
              warga Perumahan Ciptaland Blok Mawar RT 002 RW 014 akan mengadakan berbagai kegiatan 
              yang seru dan penuh semangat kebersamaan.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Acara ini bertujuan untuk mempererat tali silaturahmi antar warga, menanamkan semangat 
              nasionalisme, dan menciptakan kenangan indah bersama keluarga dan tetangga.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Info Box */}
          <div className="relative">
            <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4 animate-bounce">🎊</div>
                  <h3 className="text-2xl font-black mb-2">Informasi Acara</h3>
                </div>

                <div className="space-y-5">
                  {[
                    { icon: '📅', label: 'Tanggal', value: 'Minggu, 17 Agustus 2026' },
                    { icon: '⏰', label: 'Waktu', value: '06:00 - 21:00 WIB' },
                    { icon: '📍', label: 'Lokasi', value: 'Perumahan Ciptaland Blok Mawar', sub: 'RT 002 / RW 014' },
                    { icon: '👥', label: 'Peserta', value: 'Seluruh Warga & Keluarga' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <div className="text-xs text-red-200 uppercase tracking-wider font-semibold">{item.label}</div>
                        <div className="font-bold">{item.value}</div>
                        {item.sub && <div className="text-sm text-red-100">{item.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Decorations */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-xl" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-red-400 rounded-full opacity-20 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
