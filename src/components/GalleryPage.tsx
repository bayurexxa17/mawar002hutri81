import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Props { onBack: () => void; }

interface GalleryItem {
  id: number;
  type: 'photo' | 'video';
  thumb: string;
  full: string;
  title: string;
  credit: string;
}

const initialItems: GalleryItem[] = [
  {
    id: 1, type: 'photo',
    thumb: '/images/20260726_091521.jpg',
    full: '/images/20260726_091521.jpg',
    title: 'Kegiatan GoRo Agustus 2026 Warga Blok Mawar RT002/RW 014 Ciptaland',
    credit: 'Dokumentasi BayuRexxa17',
  },
  {
    id: 2, type: 'photo',
    thumb: '/images/20260726_091534.jpg',
    full: '/images/20260726_091534.jpg',
    title: 'Kegiatan GoRo Agustus 2026 Warga Blok Mawar RT002/RW 014 Ciptaland',
    credit: 'Dokumentasi BayuRexxa17',
  },
  {
    id: 3, type: 'photo',
    thumb: '/images/20260726_091550.jpg',
    full: '/images/20260726_091550.jpg',
    title: 'Kegiatan GoRo Agustus 2026 Warga Blok Mawar RT002/RW 014 Ciptaland',
    credit: 'Dokumentasi BayuRexxa17',
  },
  {
    id: 4, type: 'photo',
    thumb: '/images/20260726_091556.jpg',
    full: '/images/20260726_091556.jpg',
    title: 'Kegiatan GoRo Agustus 2026 Warga Blok Mawar RT002/RW 014 Ciptaland',
    credit: 'Dokumentasi BayuRexxa17',
  },
  {
    id: 5, type: 'photo',
    thumb: '/images/20260729_145854.jpg',
    full: '/images/20260729_145854.jpg',
    title: 'Kegiatan GoRo Agustus 2026 Warga Blok Mawar RT002/RW 014 Ciptaland',
    credit: 'Dokumentasi BayuRexxa17',
  },
  {
    id: 6, type: 'photo',
    thumb: '/images/1.jpeg',
    full: '/images/1.jpeg',
    title: 'Turnamen Volly @Greenbay Cup Agustus 2026',
    credit: 'Foto drone by Eka',
  },
  {
    id: 7, type: 'photo',
    thumb: '/images/2.jpeg',
    full: '/images/2.jpeg',
    title: 'Turnamen Volly @Greenbay Cup Agustus 2026',
    credit: 'Foto drone by Eka',
  },
  {
    id: 8, type: 'photo',
    thumb: '/images/3.jpeg',
    full: '/images/3.jpeg',
    title: 'Turnamen Volly @Greenbay Cup Agustus 2026',
    credit: 'Foto drone by Eka',
  },
  {
    id: 9, type: 'photo',
    thumb: '/images/Team%20Putri%20Mawar1.jpeg',
    full: '/images/Team%20Putri%20Mawar1.jpeg',
    title: 'Turnamen Volly @Greenbay Cup Agustus 2026',
    credit: 'Foto drone by Eka',
  },
  {
    id: 10, type: 'photo',
    thumb: '/images/Team%20Putri%20Mawar2.jpeg',
    full: '/images/Team%20Putri%20Mawar2.jpeg',
    title: 'Turnamen Volly @Greenbay Cup Agustus 2026',
    credit: 'Foto drone by Eka',
  },
  {
    id: 101, type: 'video',
    thumb: '/images/VID-20260726-WA0007.png',
    full: '/videos/VID-20260726-WA0007.mp4',
    title: 'View Udara Wilayah RT002 Blok Mawar ',
    credit: 'Take from Drone by Eka',
  },
  {
    id: 102, type: 'video',
    thumb: 'https://images.pexels.com/videos/34373278/karrnafal-17-agustus-desa-beruk-jatiyoso-34373278.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    full: 'https://videos.pexels.com/video-files/34373278/14563041_1920_1080_30fps.mp4',
    title: 'Karnaval 17 Agustus — Aerial View',
    credit: 'just a hobby / Pexels',
  },
  {
    id: 103, type: 'video',
    thumb: 'https://images.pexels.com/videos/29936584/pexels-photo-29936584.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
    full: 'https://videos.pexels.com/video-files/29936584/12848560_1920_1080_30fps.mp4',
    title: 'Pawai Budaya Kemerdekaan',
    credit: 'Sergei Starostin / Pexels',
  },
];

interface GalleryComment {
  id: string;
  itemId: number;
  nama: string;
  comment: string;
  waktu: string;
}

export default function GalleryPage({ onBack }: Props) {
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<GalleryItem | null>(null);

  // Dynamic comments and citizen photo uploads
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('mawar-citizen-uploads');
      return saved ? [...initialItems, ...JSON.parse(saved)] : initialItems;
    } catch { return initialItems; }
  });

  const [comments, setComments] = useState<GalleryComment[]>(() => {
    try {
      const saved = localStorage.getItem('mawar-gallery-comments');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [newComment, setNewComment] = useState('');
  const [newCommentName, setNewCommentName] = useState('');

  // Citizen upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCredit, setUploadCredit] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mawar-gallery-comments', JSON.stringify(comments));
  }, [comments]);

  // Fetch comments from Supabase (optional, realtime if table exists)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await supabase.from('gallery_comments').select('*').order('id', { ascending: false });
        if (data && data.length > 0) {
          setComments(data.map((c: any) => ({
            id: String(c.id),
            itemId: c.item_id,
            nama: c.nama,
            comment: c.comment,
            waktu: new Date(c.created_at).toLocaleString('id-ID'),
          })));
        }
      } catch { /* Suppabase fallback */ }
    };

    // Ambil item galeri tambahan dari tabel `gallery` (input via Panel Panitia)
    const fetchGallery = async () => {
      try {
        const { data } = await supabase.from('gallery').select('*').order('id', { ascending: true });
        if (data && data.length > 0) {
          setGalleryList(prev => {
            const remote: GalleryItem[] = data.map((r: any) => ({
              id: 900000 + Number(r.id),
              type: (r.type === 'video' ? 'video' : 'photo') as 'photo' | 'video',
              thumb: r.url || r.thumb || '',
              full: r.url || r.full || '',
              title: r.title || 'Dokumentasi Warga',
              credit: r.credit || 'Panel Panitia',
            }));
            const existing = new Set(prev.map(p => p.title.toLowerCase()));
            return [...prev, ...remote.filter(r => !existing.has(r.title.toLowerCase()))];
          });
        }
      } catch { /* tabel belum ada */ }
    };

    fetchComments();
    fetchGallery();

    // Realtime: refresh galeri saat ada perubahan di tabel gallery / gallery_comments
    const chG = supabase.channel('rt-gallery').on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => { fetchGallery(); }).subscribe();
    return () => { supabase.removeChannel(chG); };
  }, []);

  const handleCardClick = (item: GalleryItem) => {
    if (item.type === 'video') {
      setVideoPlayer(item);
    } else {
      setLightbox(item);
    }
  };

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = name;
    a.click();
  };

  const submitComment = async (itemId: number) => {
    if (!newCommentName.trim() || !newComment.trim()) {
      alert('Nama dan Komentar wajib diisi!');
      return;
    }
    const c: GalleryComment = {
      id: `C-${Date.now()}`,
      itemId,
      nama: newCommentName.trim(),
      comment: newComment.trim(),
      waktu: new Date().toLocaleString('id-ID'),
    };
    setComments(prev => [c, ...prev]);
    setNewComment('');

    // Background Supabase Save
    Promise.resolve(supabase.from('gallery_comments').insert([{ item_id: itemId, nama: c.nama, comment: c.comment }]))
      .catch(() => {});
  };

  const handleCitizenUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadCredit.trim() || !uploadUrl.trim()) {
      alert('Semua kolom wajib diisi!');
      return;
    }
    const newItem: GalleryItem = {
      id: Date.now(),
      type: 'photo',
      thumb: uploadUrl,
      full: uploadUrl,
      title: uploadTitle.trim(),
      credit: uploadCredit.trim(),
    };
    try {
      const saved = localStorage.getItem('mawar-citizen-uploads');
      const current = saved ? JSON.parse(saved) : [];
      localStorage.setItem('mawar-citizen-uploads', JSON.stringify([...current, newItem]));
    } catch {}
    setGalleryList(prev => [...prev, newItem]);
    setUploadTitle('');
    setUploadCredit('');
    setUploadUrl('');
    setShowUploadModal(false);
    alert('Foto berhasil ditambahkan ke Galeri Dokumentasi Warga!');
  };

  const filtered = filter === 'all' ? galleryList : galleryList.filter(i => i.type === filter);
  const photoCount = galleryList.filter(i => i.type === 'photo').length;
  const videoCount = galleryList.filter(i => i.type === 'video').length;

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* NAVBAR */}
      <nav className="bg-[#B71C22] shadow-lg px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={onBack} className="text-white/80 hover:text-white text-sm font-semibold transition flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Kembali
        </button>
        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-black text-[#C1272D] text-xs shadow">81</div>
        <span className="font-bold text-white text-sm">📸 Galeri HUT RI ke-81</span>
      </nav>

      {/* HEADER */}
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
          <span>📸</span> GALERI DOKUMENTASI
        </h1>
        <p className="text-gray-500 mt-2">HUT RI ke-81 — Perumahan Ciptaland Blok Mawar RT 002/RW 014</p>
        <p className="text-xs text-gray-400 mt-1">Klik gambar untuk memperbesar • Klik video untuk memutar</p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 justify-center mb-8 px-4 flex-wrap">
        {([['all', '📋', 'Semua', galleryList.length], ['photo', '📷', 'Foto', photoCount], ['video', '🎬', 'Video', videoCount]] as const).map(([id, icon, label, count]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              filter === id ? 'bg-[#C1272D] text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {icon} {label} ({count})
          </button>
        ))}
        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-bold shadow-md transition-all scale-105">
          ➕ Upload Foto Warga
        </button>
      </div>

      {/* GRID */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div key={item.id}
              onClick={() => handleCardClick(item)}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-gray-200">
                <img
                  src={item.thumb}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Badge */}
                <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md ${
                  item.type === 'video' ? 'bg-blue-600 text-white' : 'bg-white/95 text-gray-700 border'
                }`}>
                  {item.type === 'video' ? '🎬 Video' : '📷 Foto'}
                </div>
                {/* Play button for video */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-black/60 group-hover:scale-110 transition-all shadow-xl">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 leading-snug">{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{item.credit}</p>
                  <span className="text-xs font-bold text-[#C1272D] flex items-center gap-1">
                    {item.type === 'video' ? '▶ Putar' : '🔍 Zoom'}
                  </span>
                </div>
                {/* Comment summary badge */}
                <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                  <span>💬</span> {comments.filter(c => c.itemId === item.id).length} Komentar Warga
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📷</div>
            <p className="font-semibold">Belum ada konten untuk kategori ini</p>
          </div>
        )}

        {/* UPLOAD HINT */}
        <div className="mt-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="text-4xl mb-3">📤</div>
          <h4 className="font-bold text-gray-800 mb-1">Kirim Foto & Video Anda</h4>
          <p className="text-sm text-gray-400 mb-3">Bagikan momen kemerdekaan bersama warga Blok Mawar</p>
          <p className="text-xs text-gray-400">Kirim via WhatsApp ke Panitia atau email ke:</p>
          <p className="text-sm font-bold text-[#C1272D] mt-1">panitiahutri81.mawar002@gmail.com</p>
        </div>
      </div>

      {/* ===== PHOTO LIGHTBOX with COMMENT SIDEBAR ===== */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row">
          {/* Top toolbar (mobile) / Main frame (desktop) */}
          <div className="flex-1 flex flex-col relative bg-black">
            <div className="absolute top-4 left-4 z-25 bg-black/60 px-3 py-1.5 rounded-xl text-white text-xs">
              <h3 className="font-bold">{lightbox.title}</h3>
              <p className="text-[10px] text-gray-300">{lightbox.credit}</p>
            </div>
            <div className="absolute top-4 right-4 z-25 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(lightbox.full, `hutri81-foto-${lightbox.id}.jpg`); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
              >📥 Download HD</button>
              <button
                onClick={() => setLightbox(null)}
                className="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-lg font-bold"
              >✕</button>
            </div>
            {/* Image frame */}
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={lightbox.full}
                alt={lightbox.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Comment Sidebar */}
          <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col h-[40vh] md:h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1">💬 Komentar Warga ({comments.filter(c => c.itemId === lightbox.id).length})</h3>
            </div>
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
              {comments.filter(c => c.itemId === lightbox.id).length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">Belum ada komentar. Jadilah yang pertama berkomentar!</div>
              ) : (
                comments.filter(c => c.itemId === lightbox.id).map(c => (
                  <div key={c.id} className="pt-2 first:pt-0">
                    <div className="flex justify-between text-[11px] font-bold text-gray-800">
                      <span>👤 {c.nama}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{c.waktu}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{c.comment}</p>
                  </div>
                ))
              )}
            </div>
            {/* Comment Form */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
              <input value={newCommentName} onChange={e => setNewCommentName(e.target.value)} placeholder="Nama Anda *" className="w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#C1272D]/20 outline-none" />
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Tulis komentar... *" className="w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#C1272D]/20 outline-none h-16 resize-none" />
              <button onClick={() => submitComment(lightbox.id)} className="w-full py-2 bg-[#C1272D] text-white text-xs font-bold rounded-lg hover:bg-red-700 transition">Kirim Komentar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIDEO PLAYER with COMMENT SIDEBAR ===== */}
      {videoPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col md:flex-row items-stretch">
          {/* Main Frame */}
          <div className="flex-1 flex flex-col justify-center bg-black p-4 relative">
            <div className="absolute top-4 left-4 z-25 bg-black/60 px-3 py-1.5 rounded-xl text-white text-xs">
              <h3 className="font-bold">{videoPlayer.title}</h3>
              <p className="text-[10px] text-gray-300">{videoPlayer.credit}</p>
            </div>
            <div className="absolute top-4 right-4 z-25 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(videoPlayer.full, `hutri81-video-${videoPlayer.id}.mp4`); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
              >📥 Download Video</button>
              <button
                onClick={() => setVideoPlayer(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
              >✕ Tutup</button>
            </div>
            {/* Player */}
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-800 bg-black mt-10">
              <video key={videoPlayer.id} src={videoPlayer.full} className="w-full aspect-video bg-black" controls autoPlay playsInline />
            </div>
          </div>

          {/* Comment Sidebar */}
          <div className="w-full md:w-80 bg-white flex flex-col h-[40vh] md:h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1">💬 Komentar Warga ({comments.filter(c => c.itemId === videoPlayer.id).length})</h3>
            </div>
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
              {comments.filter(c => c.itemId === videoPlayer.id).length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">Belum ada komentar. Jadilah yang pertama berkomentar!</div>
              ) : (
                comments.filter(c => c.itemId === videoPlayer.id).map(c => (
                  <div key={c.id} className="pt-2 first:pt-0">
                    <div className="flex justify-between text-[11px] font-bold text-gray-800">
                      <span>👤 {c.nama}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{c.waktu}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{c.comment}</p>
                  </div>
                ))
              )}
            </div>
            {/* Comment Form */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
              <input value={newCommentName} onChange={e => setNewCommentName(e.target.value)} placeholder="Nama Anda *" className="w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-gray-300 outline-none" />
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Tulis komentar... *" className="w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-gray-300 outline-none h-16 resize-none" />
              <button onClick={() => submitComment(videoPlayer.id)} className="w-full py-2 bg-[#C1272D] text-white text-xs font-bold rounded-lg hover:bg-red-700 transition">Kirim Komentar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CITIZEN UPLOAD MODAL ===== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in" onClick={e => e.stopPropagation()}>
            <div className="bg-green-600 px-6 py-4 rounded-t-2xl flex justify-between">
              <h3 className="font-bold text-white">📤 Tambah Koleksi Foto Warga</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-white/70 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleCitizenUpload} className="p-6 space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Judul / Tajuk Acara *</label>
                <input required value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Contoh: Lomba Balap Karung RT 02" className="w-full border rounded-xl px-4 py-2.5 text-sm" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Nama Pengunggah *</label>
                <input required value={uploadCredit} onChange={e => setUploadCredit(e.target.value)} placeholder="Contoh: Bapak Saharudin / Blok Mawar" className="w-full border rounded-xl px-4 py-2.5 text-sm" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Link URL Foto (Pexels, Imgur, atau link foto publik lainnya) *</label>
                <input required value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} placeholder="https://images.pexels.com/... atau link foto lainnya" className="w-full border rounded-xl px-4 py-2.5 text-sm" /></div>
              <p className="text-[10px] text-gray-400">💡 Anda bisa menyalin link foto publik mana saja untuk dimasukkan ke galeri dokumentasi.</p>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition text-sm">✅ Tambahkan ke Galeri</button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#1a1a1a] text-center py-6 px-4">
        <p className="text-gray-500 text-xs">© 2026 Panitia HUT RI ke-81 — Perumahan Ciptaland Blok Mawar 🇮🇩</p>
      </footer>
    </div>
  );
}
