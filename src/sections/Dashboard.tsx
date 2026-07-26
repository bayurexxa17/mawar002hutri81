import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// Daftar pilihan lomba sesuai dengan gambar
const daftarLombaOptions = [
  'Lomba Makan Kerupuk',
  'Futsal Mini',
  'Lomba Balap Kelereng',
  'Lomba Tarik Tambang',
  'Lomba Hias Tumpeng',
  'Lomba Fashion Week Daster',
  'Salah Sambung',
  'Lomba Joget Kursi Bapak',
  'Lomba Estafet Penguin Anak',
  'Lomba Estafet Penguin Remaja',
  'Lomba Estafet Tepung',
  'Lomba Joget Kursi Ibu'
];

export default function LandingRegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    hp: '',
    rt: '',
    lomba: [] as string[],
    catatan: ''
  });
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (lombaName: string) => {
    if (formData.lomba.includes(lombaName)) {
      setFormData({
        ...formData,
        lomba: formData.lomba.filter(item => item !== lombaName)
      });
    } else {
      setFormData({
        ...formData,
        lomba: [...formData.lomba, lombaName]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.hp.trim() || !formData.rt.trim()) {
      alert('Nama lengkap, Nomor WhatsApp, dan Alamat (RT/RW) wajib diisi!');
      return;
    }

    if (formData.lomba.length === 0) {
      alert('Silakan pilih minimal 1 jenis lomba!');
      return;
    }

    setLoading(true);

    const payload = {
      nama: formData.name.trim(),
      telepon: formData.hp.trim(),
      rt: formData.rt.trim(),
      lomba: formData.lomba.join(', '),
      catatan: formData.catatan.trim() || 'Terdaftar via Form Landing Page',
    };

    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .insert([payload])
        .select();

      if (error) {
        throw error;
      }

      alert('🎉 Pendaftaran berhasil! Data Anda telah tersimpan otomatis ke database.');
      setFormData({ name: '', hp: '', rt: '', lomba: [], catatan: '' });
    } catch (err: any) {
      alert('Gagal menyimpan pendaftaran: ' + (err.message || 'Terjadi kesalahan pada koneksi database.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#C1272D] py-12 px-4 min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center text-white max-w-2xl mb-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-wide">Daftar Lomba Sekarang!</h2>
        <div className="w-24 h-1 bg-white mx-auto mb-4 rounded-full"></div>
        <p className="text-sm sm:text-base opacity-90">
          Data otomatis masuk ke Database Cloud Supabase Panitia + Notif WA
        </p>
        <div className="inline-flex items-center gap-2 mt-3 bg-black/20 px-3 py-1.5 rounded-full text-xs font-medium border border-white/20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Server: Supabase Cloud Connected</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 sm:p-8 text-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Masukkan nama lengkap"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C1272D] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                value={formData.hp}
                onChange={e => setFormData({...formData, hp: e.target.value})}
                placeholder="08xxxxxxxxxx"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C1272D] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider">Alamat (RT/RW) *</label>
            <input
              type="text"
              required
              value={formData.rt}
              onChange={e => setFormData({...formData, rt: e.target.value})}
              placeholder="Contoh: RT 002 / RW 014 - Blok Mawar 12"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C1272D] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider">
              Pilih Lomba * <span className="text-xs font-normal text-gray-500">({formData.lomba.length} dipilih)</span>
            </label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
              {daftarLombaOptions.map(lomba => {
                const isChecked = formData.lomba.includes(lomba);
                return (
                  <div
                    key={lomba}
                    onClick={() => handleCheckboxChange(lomba)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked ? 'border-[#C1272D] bg-red-50/60 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Ditangani oleh wrapper div agar area klik lebih luas
                      className="mt-0.5 rounded text-[#C1272D] focus:ring-[#C1272D]"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-gray-800">{lomba}</div>
                      <div className="text-gray-500 mt-0.5">Menarik • Sesuai Jadwal</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
            <textarea
              value={formData.catatan}
              onChange={e => setFormData({...formData, catatan: e.target.value})}
              placeholder="Informasi tambahan jika ada..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C1272D] focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C1272D] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg text-base disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Menyimpan ke Database...' : '✅ Kirim Pendaftaran Lomba'}
          </button>
        </form>
      </div>
    </div>
  );
}
