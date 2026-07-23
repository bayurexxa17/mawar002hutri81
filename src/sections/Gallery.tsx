import { useState } from 'react';
import { gallery, galleryCategories } from '../data/gallery';
import { videos, videoCategories } from '../data/videos';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'foto' | 'video'>('foto');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [videoCategory, setVideoCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const filteredGallery = activeCategory === 'all'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  const filteredVideos = videoCategory === 'all'
    ? videos
    : videos.filter(v => v.category === videoCategory);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-white to-red-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 sm:mb-16 px-2">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-xs sm:text-sm mb-4">
            DOKUMENTASI
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Galeri Kegiatan
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-4 sm:mt-6 rounded-full" />
          <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto text-xs sm:text-sm px-2">
            Momen-momen seru dari perayaan HUT RI tahun-tahun sebelumnya di Perumahan Ciptaland Blok Mawar. Klik gambar untuk zoom & download.
          </p>
        </div>

        {/* Tab Foto / Video */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('foto')}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'foto' ? 'bg-[#C1272D] text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            📸 Foto ({gallery.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'video' ? 'bg-[#C1272D] text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            🎬 Video ({videos.length})
          </button>
        </div>

        {/* FOTO TAB */}
        {activeTab === 'foto' && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 max-w-full overflow-x-auto scrollbar-hide pb-2">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all capitalize whitespace-nowrap flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredGallery.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-square cursor-pointer bg-gray-100"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/400x400/DC2626/FFFFFF?text=${encodeURIComponent(item.title)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-white">
                      <div className="text-[10px] sm:text-xs text-red-300 uppercase tracking-wider mb-1">
                        {item.category} • {item.year}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <span className="text-sm sm:text-lg">🔍</span>
                  </div>
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 text-white text-[9px] sm:text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Klik untuk zoom
                  </div>
                </div>
              ))}
            </div>
            {filteredGallery.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-sm">Belum ada foto di kategori {activeCategory}</p>
                <p className="text-xs mt-1">Upload foto ke <code>public/images/gallery/</code> dan tambah di <code>src/data/gallery.ts</code></p>
              </div>
            )}
          </>
        )}

        {/* VIDEO TAB - Kolom Khusus Video */}
        {activeTab === 'video' && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {videoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setVideoCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all capitalize whitespace-nowrap ${
                    videoCategory === cat
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer border"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <span className="text-2xl sm:text-3xl ml-1">▶️</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] sm:text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                      {video.category}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-[11px] sm:text-xs text-gray-500">
                      <span>📅 {video.year}</span>
                      <span>•</span>
                      <span>👁️ Klik untuk play</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

      {/* LIGHTBOX - Zoom & Download */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2 sm:p-4" onClick={closeLightbox}>
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <button
                onClick={closeLightbox}
                className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/30 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition font-bold"
                >
                  −
                </button>
                <div className="px-4 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center text-sm font-bold">
                  {Math.round(zoomLevel * 100)}%
                </div>
                <button
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold uppercase">{selectedImage.category}</span>
                    <span className="text-gray-500 text-xs">• {selectedImage.year}</span>
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-gray-800">{selectedImage.title}</h3>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(selectedImage.image, selectedImage.title)}
                    className="flex-1 sm:flex-initial bg-[#C1272D] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <span>📥</span> Download HD
                  </button>
                  <button
                    onClick={closeLightbox}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                📁 File: <code>src/data/gallery.ts</code> → <code>image: '{selectedImage.image}'</code> • Scroll untuk zoom, klik X untuk tutup
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2 sm:p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative max-w-4xl w-full bg-black rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-black">
              <iframe
                src={selectedVideo.videoUrl.replace('watch?v=', 'embed/')}
                title={selectedVideo.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg">{selectedVideo.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedVideo.category} • {selectedVideo.year} • {selectedVideo.duration}</p>
              <div className="flex gap-2 mt-4">
                <a href={selectedVideo.videoUrl} target="_blank" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700">🔗 Buka di YouTube</a>
                <button onClick={() => setSelectedVideo(null)} className="bg-gray-100 px-6 py-2 rounded-full font-bold text-sm">Tutup</button>
              </div>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 w-10 h-10 bg-white/20 text-white rounded-full hover:bg-white/30"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
