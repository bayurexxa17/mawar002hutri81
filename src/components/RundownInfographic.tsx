export default function RundownInfographic() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-white p-4 border-b-2 border-red-100">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-shrink-0">
            <div className="text-6xl font-black text-red-600 leading-none">81<span className="text-black text-lg align-top ml-1">TH</span></div>
            <div className="text-xs font-bold leading-tight">DIRGAHAYU<br/>REPUBLIK<br/><span className="text-red-600">INDONESIA</span></div>
            <div className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 mt-1 inline-block">17 AGUSTUS 1945 - 17 AGUSTUS 2026</div>
          </div>
          <div className="flex-1 border-l-2 border-red-600 pl-4">
            <div className="text-xs font-bold">PROPOSAL KEGIATAN</div>
            <div className="text-xs">PERINGATAN HUT RI KE-81 TAHUN 2026</div>
            <div className="text-[10px] bg-red-700 text-white px-2 py-0.5 mt-1 inline-block">RT 002 RW 014 PERUMAHAN CIPTALAND BLOK MAWAR</div>
            <div className="text-[10px] mt-1">Kecamatan Sekupang - Kota Batam</div>
          </div>
        </div>
        <div className="mt-4 bg-gradient-to-r from-red-800 to-red-600 text-white text-center py-2 rounded-lg">
          <div className="font-black text-lg">D. RUNDOWN HARI PELAKSANAAN</div>
          <div className="text-sm">(17 AGUSTUS 2026)</div>
        </div>
        <p className="text-[11px] text-center mt-3 text-gray-600">
          Rangkaian kegiatan pada hari pelaksanaan Peringatan HUT RI Ke-81 di RT 002 RW 014 Perumahan Ciptaland Blok Mawar.
        </p>
      </div>

      {/* PAGI */}
      <div className="p-3">
        <div className="border border-green-200 rounded-xl overflow-hidden mb-4">
          <div className="flex">
            <div className="bg-green-700 text-white p-3 flex flex-col items-center justify-center w-24 flex-shrink-0">
              <div className="font-black text-sm">PAGI</div>
              <div className="text-[10px]">06.00 - 10.00 WIB</div>
              <div className="text-3xl mt-2">☀️</div>
            </div>
            <div className="flex-1">
              {[
                { time: '06.00 - 07.00', title: 'REGISTRASI PESERTA', desc: 'Pendaftaran peserta lomba dan absensi kehadiran warga.', icon: '📋' },
                { time: '07.00 - 08.00', title: 'UPACARA PERINGATAN', desc: 'Upacara bendera memperingati HUT RI Ke-81 secara khidmat.', icon: '🚩' },
                { time: '08.00 - 08.30', title: 'FOTO BERSAMA', desc: 'Foto bersama seluruh warga, panitia, dan peserta sebagai kenang-kenangan.', icon: '📸' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 border-b border-green-100 last:border-0 items-start">
                  <div className="text-[11px] font-bold text-green-700 w-20 flex-shrink-0">{item.time}</div>
                  <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs text-green-700">{item.title}</div>
                    <div className="text-[10px] text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIANG */}
        <div className="border border-red-200 rounded-xl overflow-hidden mb-4">
          <div className="flex">
            <div className="bg-red-700 text-white p-3 flex flex-col items-center justify-center w-24 flex-shrink-0">
              <div className="font-black text-sm">SIANG</div>
              <div className="text-[10px]">08.30 - 16.30 WIB</div>
              <div className="text-3xl mt-2">☀️</div>
            </div>
            <div className="flex-1">
              {[
                { time: '08.30 - 09.30', title: 'PERLOMBAAN ANAK-ANAK', desc: 'Makan Kerupuk, Balap Kelereng, Estafet Penguin, dan lainnya.', icon: '👶' },
                { time: '09.30 - 11.00', title: 'PERLOMBAAN REMAJA', desc: 'Futsal Mini, Salah Sambung, Jalan Penguin, dan lainnya.', icon: '🧒' },
                { time: '11.00 - 12.30', title: 'PERLOMBAAN BAPAK-BAPAK', desc: 'Tarik Tambang, Joget Rebut Kursi, Estafet Tepung, dan lainnya.', icon: '👨' },
                { time: '13.00 - 15.00', title: 'PERLOMBAAN IBU-IBU', desc: 'Fashion Week Daster, Hias Tumpeng, Joget Rebut Kursi, Estafet Tepung, dan lainnya.', icon: '👩' },
                { time: '15.00 - 16.30', title: 'PERLOMBAAN KELUARGA', desc: 'Make Up Buta dan lomba kebersamaan keluarga.', icon: '👨‍👩‍👧' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 border-b border-red-100 last:border-0 items-start">
                  <div className="text-[11px] font-bold text-red-700 w-20 flex-shrink-0">{item.time}</div>
                  <div className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs text-red-700">{item.title}</div>
                    <div className="text-[10px] text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MALAM */}
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          <div className="flex">
            <div className="bg-amber-500 text-white p-3 flex flex-col items-center justify-center w-24 flex-shrink-0">
              <div className="font-black text-sm">MALAM</div>
              <div className="text-[10px]">19.00 - 22.00 WIB</div>
              <div className="text-3xl mt-2">🌙</div>
            </div>
            <div className="flex-1">
              {[
                { time: '19.00 - 19.30', title: 'HIBURAN WARGA', desc: 'Penampilan seni, musik, dan hiburan dari warga serta tamu undangan.', icon: '🎵' },
                { time: '19.30 - 20.00', title: 'DOORPRIZE', desc: 'Pembagian doorprize menarik bagi masyarakat yang hadir.', icon: '🎁' },
                { time: '20.00 - 20.30', title: 'HIAS TUMPENG & FASHION SHOW DASTER', desc: 'Penilaian dan penampilan terbaik dari ibu-ibu peserta lomba.', icon: '🍛' },
                { time: '20.30 - 21.30', title: 'PEMBAGIAN HADIAH', desc: 'Penyerahan hadiah kepada para pemenang lomba.', icon: '🏆' },
                { time: '21.30 - 22.00', title: 'PENUTUPAN', desc: 'Penutupan acara dan doa bersama sebagai ungkapan syukur.', icon: '🏁' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 border-b border-amber-100 last:border-0 items-start">
                  <div className="text-[11px] font-bold text-amber-600 w-20 flex-shrink-0">{item.time}</div>
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs text-amber-600">{item.title}</div>
                    <div className="text-[10px] text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-[11px] text-gray-700">
            <span className="text-red-600 font-bold">❝</span> Dengan semangat kebersamaan, mari kita sukseskan Peringatan <strong>HUT RI Ke-81</strong> yang meriah, bermakna, dan membanggakan. <span className="text-red-600 font-bold">❞</span>
          </p>
        </div>
      </div>
    </div>
  );
}
