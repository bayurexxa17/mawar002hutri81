import { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Beranda', href: '#home' },
  { name: 'Ringkasan', href: '#ringkasan' },
  { name: 'Lomba', href: '#activities' },
  { name: 'Jadwal', href: '#schedule' },
  { name: 'Panitia', href: '#committee' },
  { name: 'Galeri', href: '#gallery' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg backdrop-blur-md bg-opacity-95'
          : 'bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-red-600 font-black text-lg md:text-xl">81</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-white text-sm md:text-base">HUT RI Ke-81</h1>
              <p className="text-xs text-red-100">Ciptaland Blok Mawar</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white hover:text-yellow-300 transition-colors rounded-lg hover:bg-white/10"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#register"
              className="bg-yellow-400 text-red-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              📝 Daftar Sekarang
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-red-700 border-t border-red-600">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full bg-yellow-400 text-red-700 text-center px-6 py-3 rounded-lg font-bold mt-4"
            >
              📝 Daftar Sekarang
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
