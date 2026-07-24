import { useState } from 'react';
import { activities, categories, Activity } from '../data/activities';
import Modal from '../components/Modal';

export default function Activities() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = activeCategory === 'all'
    ? activities
    : activities.filter(a => a.category === activeCategory);

  return (
    <section id="activities" className="py-20 px-4 bg-gradient-to-b from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
            ANEKA LOMBA
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Pilih Lomba Favoritmu
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-6 rounded-full" />
          <p className="text-gray-600 mt-4">Klik kartu untuk melihat detail panduan lomba</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with Icon */}
              <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6 overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                <div className="relative text-center">
                  <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {activity.icon}
                  </div>
                  <div className="text-white/80 text-xs uppercase tracking-wider font-semibold">
                    {activity.category} • Klik untuk Detail
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-red-600 transition-colors">
                  {activity.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-red-500">⏰</span>
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-yellow-500">🏆</span>
                    <span className="font-semibold text-green-600">Hadiah: {activity.prize}</span>
                  </div>
                  {activity.participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-blue-500">👥</span>
                      <span>{activity.participants}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-md">
                    🔍 Detail
                  </button>
                  <a
                    href="#ringkasan"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-gray-800 text-white text-center py-3 rounded-xl font-bold hover:bg-gray-700 transition-all"
                  >
                    📝 Daftar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <Modal
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          title={selectedActivity.title}
          subtitle={`${selectedActivity.category} • ${selectedActivity.time} • ${selectedActivity.prize}`}
          size="lg"
        >
          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedActivity.icon}</div>
              <p className="text-gray-600">{selectedActivity.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="text-xs text-gray-500 uppercase">Waktu</div>
                <div className="font-bold text-gray-800">{selectedActivity.time}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-xs text-gray-500 uppercase">Hadiah</div>
                <div className="font-bold text-green-700">{selectedActivity.prize}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl col-span-2">
                <div className="text-xs text-gray-500 uppercase">Peserta</div>
                <div className="font-bold text-gray-800">{selectedActivity.participants}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold mb-3">📋 Peraturan Lomba:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-[#C1272D]">•</span> Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai</li>
                <li className="flex gap-2"><span className="text-[#C1272D]">•</span> Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)</li>
                <li className="flex gap-2"><span className="text-[#C1272D]">•</span> Keputusan juri tidak dapat diganggu gugat</li>
                <li className="flex gap-2"><span className="text-[#C1272D]">•</span> Peserta yang curang akan didiskualifikasi</li>
                <li className="flex gap-2"><span className="text-[#C1272D]">•</span> Hadiah diserahkan pada Malam Puncak 22 Agustus 2026</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedActivity(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Tutup</button>
              <a href="#ringkasan" onClick={() => setSelectedActivity(null)} className="flex-1 bg-[#C1272D] text-white py-3 rounded-xl font-bold text-center hover:bg-red-700 transition">📝 Daftar Lomba Ini</a>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
