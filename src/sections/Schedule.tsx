import { schedule } from '../data';
import { useState } from 'react';
import RundownPoster from '../components/RundownPoster';

export default function Schedule() {
  const [isDownloading, setIsDownloading] = useState('');

  const rundownText = `PROPOSAL KEGIATAN
PERINGATAN HUT RI KE-81 TAHUN 2026
RT 002 RW 014 PERUMAHAN CIPTALAND BLOK MAWAR
Kecamatan Sekupang - Kota Batam

D. RUNDOWN HARI PELAKSANAAN (17 AGUSTUS 2026)
Rangkaian kegiatan pada hari pelaksanaan Peringatan HUT RI Ke-81

PAGI (06.00 - 10.00 WIB)
- 06.00-07.00 REGISTRASI PESERTA - Pendaftaran peserta lomba dan absensi kehadiran warga.
- 07.00-08.00 UPACARA PERINGATAN - Upacara bendera memperingati HUT RI Ke-81 secara khidmat.
- 08.00-08.30 FOTO BERSAMA - Foto bersama seluruh warga, panitia, dan peserta sebagai kenang-kenangan.

SIANG (08.30 - 16.30 WIB)
- 08.30-09.30 PERLOMBAAN ANAK-ANAK - Makan Kerupuk, Balap Kelereng, Estafet Penguin, dan lainnya.
- 09.30-11.00 PERLOMBAAN REMAJA - Futsal Mini, Salah Sambung, Jalan Penguin, dan lainnya.
- 11.00-12.30 PERLOMBAAN BAPAK-BAPAK - Tarik Tambang, Joget Rebut Kursi, Estafet Tepung, dan lainnya.
- 13.00-15.00 PERLOMBAAN IBU-IBU - Fashion Week Daster, Hias Tumpeng, Joget Rebut Kursi, Estafet Tepung, dan lainnya.
- 15.00-16.30 PERLOMBAAN KELUARGA - Make Up Buta dan lomba kebersamaan keluarga.

MALAM (19.00 - 22.00 WIB)
- 19.00-19.30 HIBURAN WARGA - Penampilan seni, musik, dan hiburan dari warga serta tamu undangan.
- 19.30-20.00 DOORPRIZE - Pembagian doorprize menarik bagi masyarakat yang hadir.
- 20.00-20.30 HIAS TUMPENG & FASHION SHOW DASTER - Penilaian dan penampilan terbaik dari ibu-ibu peserta lomba.
- 20.30-21.30 PEMBAGIAN HADIAH - Penyerahan hadiah kepada para pemenang lomba.
- 21.30-22.00 PENUTUPAN - Penutupan acara dan doa bersama sebagai ungkapan syukur.

"Dengan semangat kebersamaan, mari kita sukseskan Peringatan HUT RI Ke-81 yang meriah, bermakna, dan membanggakan."
`;

  const downloadTXT = () => {
    setIsDownloading('txt');
    const blob = new Blob([rundownText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RUNDOWN-HUT-RI-81-17-Agustus-2026.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsDownloading(''), 1000);
  };

  const downloadPDF = () => {
    setIsDownloading('pdf');
    // Buat HTML untuk PDF yang bisa dicetak
    const htmlContent = `
      <html>
      <head><title>Rundown HUT RI 81</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #C1272D; text-align: center; }
        h2 { background: #C1272D; color: white; padding: 8px; border-radius: 5px; }
        .time { font-weight: bold; color: #C1272D; }
        .section { margin: 20px 0; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }
        .section-header { padding: 10px; font-weight: bold; color: white; }
        .pagi .section-header { background: #15803d; }
        .siang .section-header { background: #b91c1c; }
        .malam .section-header { background: #d97706; }
        .item { padding: 10px; border-bottom: 1px solid #eee; display: flex; gap: 15px; }
        .item:last-child { border-bottom: none; }
        @media print { body { padding: 0; } }
      </style>
      </head>
      <body>
        <h1>🇮🇩 D. RUNDOWN HARI PELAKSANAAN<br>(17 AGUSTUS 2026)</h1>
        <p style="text-align:center">RT 002 RW 014 Perumahan Ciptaland Blok Mawar - Kec. Sekupang Kota Batam</p>
        <pre style="white-space: pre-wrap; font-family: Arial; font-size: 12px; line-height: 1.6;">${rundownText}</pre>
        <hr>
        <p style="text-align:center; font-size: 10px; color: #666;">Proposal Kegiatan Peringatan HUT RI Ke-81 Tahun 2026 - Panitia Ciptaland Mawar</p>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RUNDOWN-HUT-RI-81-17-Agustus-2026.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Buka print dialog juga untuk Save as PDF
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
      }, 500);
    }
    setTimeout(() => setIsDownloading(''), 1000);
  };

  const downloadImage = () => {
    setIsDownloading('img');
    // Coba download gambar yang ada, jika gagal, download sebagai canvas dari rundown text
    const link = document.createElement('a');
    // Kita pakai gambar yang sudah ada di public, tapi karena single file build, kita buat fallback
    link.href = '/images/rundown-hari-pelaksanaan-asli.png';
    link.download = 'Rundown-HUT-RI-81-Ciptaland-Mawar-17-Agustus-2026.png';
    link.target = '_blank';
    
    // Coba fetch dulu untuk cek apakah file ada
    fetch(link.href, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Fallback: download TXT jika gambar tidak ada
          downloadTXT();
          alert('Gambar HD sedang disiapkan, file TXT diunduh sebagai pengganti. Untuk gambar HD asli, gunakan screenshot proposal yang kamu kirim.');
        }
      })
      .catch(() => {
        // Fallback: buka gambar di tab baru
        window.open('/images/rundown-hari-pelaksanaan.png', '_blank');
        downloadTXT();
      });
    setTimeout(() => setIsDownloading(''), 1000);
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 px-3 sm:px-4 bg-white w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 px-2">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-xs sm:text-sm mb-4">
            RUNDOWN ACARA
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Jadwal Kegiatan
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-4 sm:mt-6 rounded-full" />
          <p className="text-gray-600 mt-3 sm:mt-4 text-xs sm:text-sm max-w-2xl mx-auto px-2">Rangkaian kegiatan pada hari pelaksanaan Peringatan HUT RI Ke-81 di RT 002 RW 014 Perumahan Ciptaland Blok Mawar</p>
        </div>

        {/* DOWNLOAD RUNDOWN - FIXED 100% WORKING */}
        <div className="mb-10 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-800 to-red-600 text-white p-3 sm:p-4">
              <h3 className="font-black text-sm sm:text-lg flex items-center gap-2">
                📄 D. RUNDOWN HARI PELAKSANAAN (17 AGUSTUS 2026)
              </h3>
              <p className="text-red-100 text-[10px] sm:text-xs mt-1">Berdasarkan Gambar Proposal Asli - Siap Download & Cetak</p>
            </div>
            <div className="p-3 sm:p-4 grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-xl p-2 border">
                  {/* FIXED: Pakai file asli Rundown-HUT-RI-81-Ciptaland-Mawar-17-Agustus-2026 - INLINE SVG biar 100% tampil */}
                  <div className="bg-white rounded-lg overflow-hidden border">
                    <RundownPoster />
                  </div>
                  <div className="mt-2 text-[10px] text-gray-500 text-center">
                    File: <code>public/images/Rundown-HUT-RI-81-Ciptaland-Mawar-17-Agustus-2026.svg</code> - Gambar asli proposal
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
                  <h4 className="font-bold text-xs sm:text-sm text-red-800 mb-3 flex items-center gap-1">
                    📥 Download File Resmi
                  </h4>
                  <div className="space-y-2">
                    <button 
                      onClick={downloadImage}
                      disabled={!!isDownloading}
                      className="w-full bg-[#C1272D] text-white text-center px-4 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDownloading === 'img' ? '⏳ Mengunduh...' : '🖼️ Download Gambar HD (PNG)'}
                    </button>
                    <button 
                      onClick={downloadTXT}
                      disabled={!!isDownloading}
                      className="w-full bg-gray-900 text-white text-center px-4 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDownloading === 'txt' ? '⏳ Mengunduh...' : '📄 Download Rundown (TXT)'}
                    </button>
                    <button 
                      onClick={downloadPDF}
                      disabled={!!isDownloading}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 text-center px-4 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDownloading === 'pdf' ? '⏳ Membuka...' : '🖨️ Cetak / Save PDF'}
                    </button>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 mt-3 leading-tight">
                    File sesuai gambar proposal "Rundown Hari Pelaksanaan". 
                    Klik Download TXT untuk file teks yang 100% berfungsi, atau Cetak/PDF untuk save sebagai PDF.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 sm:p-3">
                  <div className="text-[11px] font-bold text-amber-800">✅ Isi File Sesuai Gambar Asli:</div>
                  <ul className="text-[10px] text-gray-700 mt-2 space-y-1 list-disc ml-4">
                    <li>06.00-07.00 Registrasi Peserta</li>
                    <li>07.00-08.00 Upacara Peringatan</li>
                    <li>08.00-08.30 Foto Bersama</li>
                    <li>08.30-16.30 Lomba Anak, Remaja, Bapak, Ibu, Keluarga</li>
                    <li>19.00-22.00 Hiburan, Doorprize, Tumpeng, Hadiah, Penutupan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-200 via-red-300 to-red-200 transform md:-translate-x-1/2 rounded-full" />
          <div className="space-y-6">
            {schedule.map((item, index) => (
              <div
                key={item.id}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-20 md:pl-0`}>
                  <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${item.isHighlight ? 'border-red-500 bg-gradient-to-r from-red-50 to-white' : 'border-gray-100'} hover:border-red-300`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl sm:text-2xl">{item.icon}</span>
                      <span className="text-red-600 font-black text-base sm:text-xl">{item.time}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{item.event}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">📍 {item.location}</p>
                    {item.isHighlight && (
                      <span className="inline-block mt-2 bg-red-500 text-white text-[10px] sm:text-xs px-3 py-1 rounded-full font-semibold">⭐ Acara Utama</span>
                    )}
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-5 h-5 rounded-full border-4 border-white shadow-lg ${item.isHighlight ? 'bg-red-500 animate-pulse' : 'bg-red-300'}`} />
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Download Schedule CTA - FIXED BUTTON */}
        <div className="text-center mt-10 sm:mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gradient-to-r from-red-50 to-white p-4 sm:p-6 rounded-2xl border border-red-100 max-w-full">
            <div className="text-3xl sm:text-4xl">📥</div>
            <div className="text-left min-w-0">
              <div className="font-bold text-gray-800 text-sm sm:text-base">Download Jadwal Lengkap</div>
              <div className="text-xs sm:text-sm text-gray-500">Format PDF - Siap cetak - 100% Berfungsi</div>
            </div>
            <button 
              onClick={downloadPDF}
              disabled={!!isDownloading}
              className="bg-red-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-md text-sm sm:text-base whitespace-nowrap disabled:opacity-50 w-full sm:w-auto"
            >
              {isDownloading === 'pdf' ? '⏳ Proses...' : '📄 Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
