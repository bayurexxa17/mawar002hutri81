import { useState, useEffect } from 'react';
// No supabase needed here currently
import type { ArsipItem } from '../App';

interface Props { onBack: () => void; shared: any; }

export default function ArsipPage({ onBack, shared }: Props) {
  const { arsipList } = shared;
  const [selectedTahun, setSelectedTahun] = useState<string>('');
  const [lightbox, setLightbox] = useState<ArsipItem | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<ArsipItem | null>(null);

  // Dapatkan daftar tahun yang unik dan urutkan menurun
  const tahunList = Array.from(new Set(arsipList.map((a: ArsipItem) => a.tahun))).sort().reverse() as string[];

  useEffect(() => {
    if (tahunList.length > 0 && !selectedTahun) {
      setSelectedTahun(tahunList[0]);
    }
  }, [tahunList, selectedTahun]);

  const filtered = arsipList.filter((a: ArsipItem) => a.tahun === selectedTahun);
  const infos = filtered.filter((a: ArsipItem) => a.jenis === 'info');
  const medias = filtered.filter((a: ArsipItem) => a.jenis === 'photo' || a.jenis === 'video');

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.download = name; a.click();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <nav className="bg-[#B71C22]/95 backdrop-blur-md shadow-lg px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-white/80 hover:text-white text-sm font-semibold transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Kembali
          </button>
          <div className="h-4 w-px bg-white/20" />
          <span className="font-bold text-white text-sm">🕰️ Arsip Acara</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
            <span>🕰️</span> ARSIP HUT RI
          </h1>
          <p className="text-gray-500 mt-2">Rekam jejak perayaan dari tahun ke tahun</p>
        </div>

        {tahunList.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🗃️</div>
            <p className="font-semibold">Belum ada data arsip</p>
          </div>
        ) : (
          <>
            {/* Tab Tahun */}
            <div className="flex gap-2 justify-center mb-8 overflow-x-auto scrollbar-hide pb-2">
              {tahunList.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTahun(t)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedTahun === t ? 'bg-[#C1272D] text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  Tahun {t}
                </button>
              ))}
            </div>

            {/* Info Section */}
            {infos.length > 0 && (
              <div className="mb-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {infos.map((info: ArsipItem) => (
                  <div key={info.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-[#C1272D] mb-2">{info.title}</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{info.deskripsi}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Media Grid */}
            {medias.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {medias.map((item: ArsipItem) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group" onClick={() => item.jenis === 'video' ? setVideoPlayer(item) : setLightbox(item)}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md ${item.jenis === 'video' ? 'bg-blue-600 text-white' : 'bg-white/95 text-gray-700'}`}>
                        {item.jenis === 'video' ? '🎬 Video' : '📷 Foto'}
                      </div>
                      {item.jenis === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-black/60 group-hover:scale-110 transition-all">
                            <span className="text-white ml-1">▶</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900 truncate">{item.title}</h3>
                      {item.deskripsi && <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.deskripsi}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Foto */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); handleDownload(lightbox.url, `arsip-${lightbox.tahun}-${lightbox.id}.jpg`); }} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">📥 Download</button>
            <button onClick={() => setLightbox(null)} className="w-9 h-9 bg-red-600 text-white rounded-lg font-bold">✕</button>
          </div>
          <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          <div className="mt-4 text-center">
            <h3 className="text-white font-bold text-sm">{lightbox.title}</h3>
            <p className="text-gray-400 text-xs">{lightbox.deskripsi}</p>
          </div>
        </div>
      )}

      {/* Video Player */}
      {videoPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-white font-bold text-sm">{videoPlayer.title}</h3>
                <p className="text-gray-500 text-xs">{videoPlayer.deskripsi}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDownload(videoPlayer.url, `arsip-${videoPlayer.tahun}-${videoPlayer.id}.mp4`)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">📥 Download</button>
                <button onClick={() => setVideoPlayer(null)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg">✕ Tutup</button>
              </div>
            </div>
            <video src={videoPlayer.url} className="w-full aspect-video bg-black rounded-xl" controls autoPlay />
          </div>
        </div>
      )}
    </div>
  );
}
