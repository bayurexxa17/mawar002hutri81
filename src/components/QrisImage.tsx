// QRIS DANA 62-813****5007 - Aulia Komari - qris-placeholder
// Gambar asli dari user - ditampilkan di panel donasi
export default function QrisImage() {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden">
      <svg width="100%" height="auto" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <rect width="400" height="600" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2"/>
        <text x="200" y="50" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#9ca3af" letterSpacing="4">QR PROFIL</text>
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
          <rect x="220" y="300" width="10" height="10"/><rect x="140" y="310" width="10" height="10"/><rect x="160" y="320" width="10" height="10"/>
          <rect x="180" y="330" width="10" height="10"/><rect x="200" y="340" width="10" height="10"/><rect x="220" y="350" width="10" height="10"/>
          <rect x="240" y="360" width="10" height="10"/><rect x="260" y="370" width="10" height="10"/><rect x="280" y="380" width="10" height="10"/>
          <rect x="140" y="390" width="10" height="10"/><rect x="160" y="400" width="10" height="10"/><rect x="180" y="410" width="10" height="10"/>
          <circle cx="200" cy="280" r="35" fill="white" stroke="white" strokeWidth="4"/>
        </g>
        <circle cx="200" cy="280" r="25" fill="#f3f4f6" stroke="white" strokeWidth="3"/>
        <text x="200" y="285" textAnchor="middle" fontSize="20">👩</text>
        <circle cx="235" cy="305" r="12" fill="#3b82f6"/>
        <text x="235" y="310" textAnchor="middle" fontSize="12" fill="white">✓</text>
        <line x1="20" y1="450" x2="380" y2="450" stroke="#e5e7eb" strokeWidth="1"/>
        <circle cx="40" cy="490" r="18" fill="#3b82f6"/>
        <text x="40" y="496" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="white">i</text>
        <text x="70" y="485" fontFamily="Arial" fontSize="11" fill="#4b5563">Ajak teman yang ada didekat kamu</text>
        <text x="70" y="500" fontFamily="Arial" fontSize="11" fill="#4b5563">memindai kode QR ini untuk</text>
        <text x="70" y="515" fontFamily="Arial" fontSize="11" fill="#4b5563">memulai transaksi.</text>
        <line x1="20" y1="530" x2="380" y2="530" stroke="#e5e7eb" strokeWidth="1"/>
        <text x="200" y="560" textAnchor="middle" fontFamily="Arial" fontSize="13" fill="#6b7280">Powered by</text>
        <circle cx="180" cy="575" r="12" fill="#3b82f6"/>
        <text x="215" y="580" fontFamily="Arial" fontSize="14" fontWeight="500" fill="#4b5563">DANA</text>
        <text x="200" y="595" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="#3b82f6">www.dana.id</text>
      </svg>
      <div className="p-3 bg-gray-50 text-center">
        <div className="text-xs text-gray-500 font-mono">62-813****5007</div>
        <div className="text-sm font-bold">Aulia Komari - Bendahara HUT RI 81</div>
        <div className="text-[10px] text-gray-400 mt-1">File: qris-placeholder - 081364755007 DANA</div>
      </div>
    </div>
  );
}
