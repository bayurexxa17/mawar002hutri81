// ============================================
// 📍 LOKASI GANTI GAMBAR QRIS - EDIT DI SINI
// ============================================
// CARA GANTI GAMBAR QRIS ASLI:
// 1. Upload file QRIS asli kamu ke folder: public/images/
//    - Nama file bebas, contoh: qris-dana-aulia.png
// 2. Ganti URL di bawah ini (baris 8) dengan nama file kamu
// 3. Contoh: const QRIS_IMAGE_URL = "/images/qris-dana-aulia.png"
// 4. Save & deploy ulang
//
// File yang sudah ada (bisa pakai salah satu):
// - /images/qris-placeholder.png (SVG replika - yang tampil sekarang)
// - /images/qris-placeholder.svg
// - /images/qris.png
// - /images/qris-dana-asli.png (jika kamu upload)
// - /images/Rundown-HUT-RI-81-Ciptaland-Mawar-17-Agustus-2026.svg (untuk rundown)
// ============================================

const QRIS_IMAGE_URL = "/images/qris-placeholder.png"; // ⬅️ GANTI DI SINI dengan file QR asli kamu
const QRIS_IMAGE_FALLBACK = "/images/qris-placeholder.svg";
const QRIS_IMAGE_BACKUP = "/images/qris.png";

// QRIS DANA 62-813****5007 - Aulia Komari - qris-placeholder
// Gambar asli dari user - ditampilkan di panel donasi

export default function QrisImage() {
  // Jika file QRIS asli tidak ada, akan fallback ke SVG replika di bawah
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src.includes('qris-placeholder.png')) {
      target.src = QRIS_IMAGE_FALLBACK;
    } else if (target.src.includes('qris-placeholder.svg')) {
      target.src = QRIS_IMAGE_BACKUP;
    } else {
      // Jika semua gagal, sembunyikan img dan tampilkan SVG manual
      target.style.display = 'none';
      const fallback = document.getElementById('qris-svg-fallback');
      if (fallback) fallback.style.display = 'block';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden">
      {/* GAMBAR QRIS ASLI - GANTI FILE DI public/images/ UNTUK UBAH GAMBAR */}
      <div className="relative">
        <img
          src={QRIS_IMAGE_URL}
          alt="QRIS DANA Aulia Komari - 62-813****5007 - qris-placeholder - 081364755007 - SeaBank 901592977740"
          className="w-full h-auto"
          onError={handleImageError}
        />
        {/* FALLBACK SVG - Tampil jika gambar asli tidak ada */}
        <div id="qris-svg-fallback" style={{ display: 'none' }}>
          <svg width="100%" height="auto" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <rect width="400" height="600" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2"/>
            <text x="200" y="50" textAnchor="middle" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#9ca3af" letterSpacing="4">QR PROFIL</text>
            <text x="200" y="100" textAnchor="middle" fontFamily="monospace" fontSize="24" fill="black">62-813****5007</text>
            <rect x="50" y="130" width="300" height="300" fill="white" stroke="black" strokeWidth="2"/>
            <g fill="black">
              <rect x="60" y="140" width="60" height="60"/><rect x="70" y="150" width="40" height="40" fill="white"/><rect x="80" y="160" width="20" height="20"/>
              <rect x="280" y="140" width="60" height="60"/><rect x="290" y="150" width="40" height="40" fill="white"/><rect x="300" y="160" width="20" height="20"/>
              <rect x="60" y="360" width="60" height="60"/><rect x="70" y="370" width="40" height="40" fill="white"/><rect x="80" y="380" width="20" height="20"/>
              <rect x="140" y="140" width="10" height="10"/><rect x="160" y="140" width="10" height="10"/><rect x="180" y="150" width="10" height="10"/>
              <rect x="200" y="160" width="10" height="10"/><rect x="220" y="140" width="10" height="10"/><rect x="140" y="170" width="10" height="10"/>
              <rect x="170" y="180" width="10" height="10"/><rect x="190" y="190" width="10" height="10"/><rect x="210" y="200" width="10" height="10"/>
              <rect x="230" y="210" width="10" height="10"/><rect x="150" y="220" width="10" height="10"/><rect x="180" y="230" width="10" height="10"/>
              <rect x="200" y="240" width="10" height="10"/><rect x="220" y="250" width="10" height="10"/><rect x="140" y="260" width="10" height="10"/>
              <rect x="160" y="270" width="10" height="10"/><rect x="180" y="280" width="10" height="10"/><rect x="200" y="290" width="10" height="10"/>
            </g>
            <circle cx="200" cy="280" r="25" fill="#f3f4f6" stroke="white" strokeWidth="3"/>
            <text x="200" y="285" textAnchor="middle" fontSize="20">👩</text>
            <circle cx="235" cy="305" r="12" fill="#3b82f6"/>
            <text x="235" y="310" textAnchor="middle" fontSize="12" fill="white">✓</text>
          </svg>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 text-center">
        <div className="text-xs text-gray-500 font-mono">62-813****5007 • DANA</div>
        <div className="text-sm font-bold">Aulia Komari - Bendahara HUT RI 81</div>
        <div className="text-[10px] text-gray-400 mt-1">
          File: qris-placeholder • 901592977740 SeaBank • 081364755007 DANA<br/>
          <span className="text-[9px]">Ganti di: src/components/QrisImage.tsx baris 8 atau upload ke public/images/</span>
        </div>
      </div>
    </div>
  );
}

/*
  CARA LENGKAP GANTI QRIS:

  OPSI 1 - Paling Mudah (Tanpa Edit Kode):
  1. Siapkan file QRIS asli kamu (PNG/JPG) - yang kamu kirim tadi
  2. Rename jadi: qris-placeholder.png
  3. Upload & timpa file di: public/images/qris-placeholder.png
  4. Push ke GitHub → auto deploy → gambar baru tampil

  OPSI 2 - Edit Kode (Jika nama file beda):
  1. Upload file QRIS ke public/images/ contoh: qris-dana-aulia-asli.png
  2. Buka file ini: src/components/QrisImage.tsx
  3. Ganti baris 8: const QRIS_IMAGE_URL = "/images/qris-dana-aulia-asli.png"
  4. Save & deploy

  OPSI 3 - Ganti Rundown:
  File rundown ada di: public/images/Rundown-HUT-RI-81-Ciptaland-Mawar-17-Agustus-2026.svg
  Ganti file tersebut dengan gambar proposal asli kamu (PNG/JPG/SVG)
  Lalu di src/sections/Schedule.tsx sudah pakai file itu
*/
