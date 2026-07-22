export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">81</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">HUT RI Ke-81</h3>
                <p className="text-gray-400 text-sm">Ciptaland Blok Mawar</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Mari rayakan kemerdekaan Indonesia dengan penuh semangat dan kebersamaan. 
              Dirgahayu Republik Indonesia!
            </p>
            <div className="flex gap-2">
              <span className="text-2xl">🇮🇩</span>
              <span className="text-2xl">🎉</span>
              <span className="text-2xl">🎊</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📍</span> Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Beranda', href: '#home' },
                { name: 'Tentang Acara', href: '#about' },
                { name: 'Daftar Lomba', href: '#activities' },
                { name: 'Jadwal Kegiatan', href: '#schedule' },
                { name: 'Panitia', href: '#committee' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📞</span> Kontak Panitia
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-400">📱</span>
                <div>
                  <div className="text-gray-400 text-sm">Ketua Pembina</div>
                  <a href="tel:081271299984" className="text-white hover:text-red-400 transition text-sm font-medium">
                    0812-7129-9984
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400">📱</span>
                <div>
                  <div className="text-gray-400 text-sm">Ketua Panitia</div>
                  <a href="tel:081288395550" className="text-white hover:text-red-400 transition text-sm font-medium">
                    0812-8839-5550
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400">📱</span>
                <div>
                  <div className="text-gray-400 text-sm">Wakil Ketua</div>
                  <a href="tel:083183950205" className="text-white hover:text-red-400 transition text-sm font-medium">
                    0831-8395-0205
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400">📧</span>
                <a href="mailto:panitia@ciptaland-mawar.id" className="text-gray-400 hover:text-red-400 transition text-sm">
                  panitiahutri81.mawar002@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>🌐</span> Media Sosial
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Ikuti kami untuk update terbaru seputar acara HUT RI Ke-81
            </p>
            <div className="flex gap-3">
              {[
                { icon: '📘', name: 'Facebook', color: 'hover:bg-blue-600' },
                { icon: '📸', name: 'Instagram', color: 'hover:bg-pink-600' },
                { icon: '🐦', name: 'Twitter', color: 'hover:bg-blue-400' },
                { icon: '📺', name: 'YouTube', color: 'hover:bg-red-600' },
                { icon: '📱', name: 'TikTok', color: 'hover:bg-black' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl transition-all ${social.color} hover:text-white hover:scale-110`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} Panitia HUT RI Ke-81 Perumahan Ciptaland Blok Mawar RT 002 RW 014.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Semua hak dilindungi. Dibuat dengan ❤️ untuk Indonesia.
              </p>
            </div>

            {/* Merdeka Badge */}
            <div className="flex items-center gap-2">
              <span className="text-red-500">🇮🇩</span>
              <span className="text-white font-bold text-sm">MERDEKA!</span>
              <span className="text-red-500">🇮🇩</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-600 text-xs">
            Website resmi perayaan Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81
          </p>
        </div>
      </div>
    </footer>
  );
}
