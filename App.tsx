import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('all');

  const activities = [
    { id: 1, title: 'Lomba Makan Kerupuk', category: 'anak', time: '08:00 WIB', prize: 'Rp 100.000' },
    { id: 2, title: 'Lomba Panjat Pinang', category: 'umum', time: '10:00 WIB', prize: 'Rp 500.000' },
    { id: 3, title: 'Lomba Balap Karung', category: 'anak', time: '08:30 WIB', prize: 'Rp 75.000' },
    { id: 4, title: 'Lomba Tarik Tambang', category: 'umum', time: '14:00 WIB', prize: 'Rp 300.000' },
    { id: 5, title: 'Lomba Kebersihan Lingkungan', category: 'ibu', time: '09:00 WIB', prize: 'Rp 200.000' },
    { id: 6, title: 'Lomba Masak Nasi Goreng', category: 'ibu', time: '11:00 WIB', prize: 'Rp 250.000' },
  ];

  const schedule = [
    { time: '06:00', event: 'Upacara Bendera', location: 'Lapangan Utama' },
    { time: '08:00', event: 'Pembukaan & Sambutan', location: 'Panggung Utama' },
    { time: '08:30', event: 'Lomba Anak-Anak Dimulai', location: 'Area Lomba' },
    { time: '12:00', event: 'Istirahat & Sholat Dzuhur', location: 'Masjid Al-Ikhlas' },
    { time: '14:00', event: 'Lomba Umum Dimulai', location: 'Area Lomba' },
    { time: '17:00', event: 'Penampilan Hiburan', location: 'Panggung Utama' },
    { time: '19:00', event: 'Malam Puncak & Doorprize', location: 'Panggung Utama' },
    { time: '21:00', event: 'Penutupan', location: 'Panggung Utama' },
  ];

  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(a => a.category === activeTab);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-lg">81</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">HUT RI Ke-81</h1>
              <p className="text-xs text-red-100">Ciptaland Blok Mawar</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm">
            <a href="#home" className="hover:text-red-200 transition">Beranda</a>
            <a href="#about" className="hover:text-red-200 transition">Tentang</a>
            <a href="#activities" className="hover:text-red-200 transition">Lomba</a>
            <a href="#schedule" className="hover:text-red-200 transition">Jadwal</a>
            <a href="#register" className="hover:text-red-200 transition">Daftar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-white pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-block bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-4 shadow-lg">
              🇮🇩 Dirgahayu Republik Indonesia 🇮🇩
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            HUT KEMERDEKAAN<br />
            <span className="text-yellow-300">RI KE-81</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Perumahan Ciptaland Blok Mawar<br />
            <span className="text-red-100">RT 002 / RW 014</span>
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="#register" 
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📝 Daftar Lomba
            </a>
            <a 
              href="#activities" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition"
            >
              🏆 Lihat Lomba
            </a>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">17</div>
              <div className="text-red-100 text-sm">Agustus 2026</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">8+</div>
              <div className="text-red-100 text-sm">Jenis Lomba</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">Rp 2jt+</div>
              <div className="text-red-100 text-sm">Total Hadiah</div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 45C840 60 960 90 1080 105C1200 120 1320 120 1380 120L1440 120L1440 120L1380 120C1320 120 1200 120 1080 105C960 90 840 60 720 45C600 30 480 30 360 45C240 60 120 90 60 105L0 120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Tentang Acara</span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">Merayakan Kemerdekaan Bersama</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Dalam rangka memeriahkan Hari Ulang Tahun Kemerdekaan Republik Indonesia yang ke-81, 
                warga Perumahan Ciptaland Blok Mawar RT 002 RW 014 akan mengadakan berbagai kegiatan 
                yang seru dan penuh semangat kebersamaan.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Acara ini bertujuan untuk mempererat tali silaturahmi antar warga, menanamkan semangat 
                nasionalisme, dan menciptakan kenangan indah bersama keluarga dan tetangga.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Kebersamaan</div>
                    <div className="text-sm text-gray-500">Mempererat silaturahmi</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Kemeriahan</div>
                    <div className="text-sm text-gray-500">Berbagai lomba seru</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Hadiah</div>
                    <div className="text-sm text-gray-500">Total jutaan rupiah</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🇮🇩</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Nasionalisme</div>
                    <div className="text-sm text-gray-500">Semangat kemerdekaan</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎊</div>
                  <h3 className="text-2xl font-bold mb-4">Informasi Acara</h3>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <div className="font-semibold">Tanggal</div>
                        <div className="text-red-100">Minggu, 17 Agustus 2026</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <div className="font-semibold">Waktu</div>
                        <div className="text-red-100">06:00 - 21:00 WIB</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <div className="font-semibold">Lokasi</div>
                        <div className="text-red-100">Perumahan Ciptaland Blok Mawar</div>
                        <div className="text-red-100 text-sm">RT 002 / RW 014</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <div>
                        <div className="font-semibold">Peserta</div>
                        <div className="text-red-100">Seluruh Warga & Keluarga</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 px-4 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Aneka Lomba</span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">Pilih Lomba Favoritmu</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            {['all', 'anak', 'ibu', 'umum'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeTab === tab
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-red-50'
                }`}
              >
                {tab === 'all' && '📋 Semua'}
                {tab === 'anak' && '👶 Anak-anak'}
                {tab === 'ibu' && '👩 Ibu-ibu'}
                {tab === 'umum' && '👥 Umum'}
              </button>
            ))}
          </div>
          
          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                  <div className="text-4xl text-center">
                    {activity.category === 'anak' && '🎈'}
                    {activity.category === 'ibu' && '🍳'}
                    {activity.category === 'umum' && '🏅'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">{activity.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>⏰</span>
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🏆</span>
                      <span>Hadiah: {activity.prize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>👥</span>
                      <span className="capitalize">{activity.category}</span>
                    </div>
                  </div>
                  <a 
                    href="#register"
                    className="mt-4 block w-full bg-red-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Rundown Acara</span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">Jadwal Kegiatan</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-red-200 transform md:-translate-x-1/2"></div>
            
            {schedule.map((item, index) => (
              <div 
                key={index}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Time */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} pl-20 md:pl-0`}>
                  <div className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                    <div className="text-red-600 font-bold text-lg">{item.time}</div>
                    <div className="text-gray-800 font-semibold">{item.event}</div>
                    <div className="text-gray-500 text-sm">📍 {item.location}</div>
                  </div>
                </div>
                
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-red-600 rounded-full transform -translate-x-1/2 border-4 border-white shadow"></div>
                
                {/* Empty space for alternating layout */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 px-4 bg-gradient-to-br from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-100 font-bold text-sm uppercase tracking-wider">Pendaftaran</span>
            <h2 className="text-4xl font-bold text-white mt-2">Daftar Lomba Sekarang!</h2>
            <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nomor WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Alamat (RT/RW)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: RT 002 / RW 014"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Pilih Lomba</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {activities.map((activity) => (
                    <label key={activity.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-red-50 cursor-pointer transition">
                      <input type="checkbox" className="w-4 h-4 text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-700">{activity.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Catatan Tambahan</label>
                <textarea 
                  rows={3}
                  placeholder="Informasi tambahan (opsional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition shadow-lg"
              >
                📤 Kirim Pendaftaran
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">Atau daftar melalui WhatsApp:</p>
              <a 
                href="https://wa.me/6281234567890"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                <span>💬</span>
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">81</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">HUT RI Ke-81</h3>
                  <p className="text-gray-400 text-sm">Ciptaland Blok Mawar</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mari rayakan kemerdekaan Indonesia dengan penuh semangat dan kebersamaan. 
                Dirgahayu Republik Indonesia!
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Kontak Panitia</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 0812-3456-7890 (Ketua Panitia)</p>
                <p>📞 0812-3456-7891 (Sekretaris)</p>
                <p>📧 panitia@ciptaland-mawar.id</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Ikuti Kami</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  📸
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  🐦
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  📺
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 Panitia HUT RI Ke-81 Perumahan Ciptaland Blok Mawar RT 002 RW 014. 
              Semua hak dilindungi.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              🇮🇩 Merdeka! 🇮🇩
            </p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <a 
        href="#register"
        className="fixed bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition z-40 animate-bounce"
      >
        <span className="text-2xl">📝</span>
      </a>
    </div>
  );
}

export default App;
