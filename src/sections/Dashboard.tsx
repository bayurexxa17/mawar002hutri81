import { useState, useEffect } from 'react';
import { submitRegistration, getRegistrations } from '../utils/api';

interface Participant {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  lomba: string[];
  catatan?: string;
  waktu: string;
}

export default function Dashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State form pendaftaran lengkap sesuai Screenshot 158
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    lomba: [] as string[],
    catatan: ''
  });

  // Daftar 13 lomba resmi HUT RI 81
  const listLomba = [
    'Lomba Makan Kerupuk', 'Futsal Mini', 'Lomba Balap Kelereng', 
    'Lomba Tarik Tambang', 'Lomba Hias Tumpeng', 'Lomba Fashion Week Daster', 
    'Salah Sambung', 'Lomba Joget Kursi Bapak', 'Lomba Estafet Penguin Anak', 
    'Lomba Estafet Penguin Remaja', 'Lomba Estafet Tepung', 'Lomba Joget Kursi Ibu', 
    'Lomba Make Up Buta'
  ];

  // Ambil data peserta dari Supabase saat komponen dimuat
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getRegistrations();
      setParticipants(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Handler Submit Pendaftaran ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.address || formData.lomba.length === 0) {
      alert('Mohon lengkapi Nama, No WhatsApp, Alamat, dan pilih minimal 1 lomba!');
      return;
    }

    const newId = `MWR81-${String(participants.length + 1).padStart(4, '0')}`;
    const payload = {
      id: newId,
      name: formData.name,
      whatsapp: formData.whatsapp,
      address: formData.address,
      lomba: formData.lomba,
      lombaIds: [],
      catatan: formData.catatan,
      waktu: new Date().toLocaleString('id-ID'),
      source: 'web'
    };

    try {
      await submitRegistration(payload);
      alert('Pendaftaran berhasil disimpan ke Cloud Supabase!');
      
      // Refresh data peserta terbaru
      const updatedData = await getRegistrations();
      setParticipants(updatedData);

      // Reset form
      setFormData({ name: '', whatsapp: '', address: '', lomba: [], catatan: '' });
    } catch (err) {
      console.error('Gagal mendaftar:', err);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-4">
      {/* FORM PENDAFTARAN LENGKAP */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-lg text-[#C1272D] mb-4">📝 Form Pendaftaran Lomba</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Nama Lengkap *</label>
              <input 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Masukkan nama lengkap" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" 
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Nomor WhatsApp *</label>
              <input 
                required 
                value={formData.whatsapp} 
                onChange={e => setFormData({...formData, whatsapp: e.target.value})} 
                placeholder="08xxxxxxxxxx" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Alamat (RT/RW) *</label>
            <input 
              required 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              placeholder="Contoh: RT 002 / RW 014 - Blok Mawar 12" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" 
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Pilih Lomba * <span className="text-xs font-normal text-gray-500">({formData.lomba.length} dipilih)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
              {listLomba.map(l => (
                <label key={l} className="flex items-center gap-2 text-xs sm:text-sm bg-white p-2.5 rounded-lg border hover:border-red-300 cursor-pointer transition">
                  <input 
                    type="checkbox" 
                    checked={formData.lomba.includes(l)} 
                    onChange={e => {
                      if (e.target.checked) {
                        setFormData({...formData, lomba: [...formData.lomba, l]});
                      } else {
                        setFormData({...formData, lomba: formData.lomba.filter(x => x !== l)});
                      }
                    }} 
                    className="rounded text-[#C1272D] w-4 h-4" 
                  />
                  <span className="flex-1 font-medium text-gray-800">{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Catatan Tambahan</label>
            <textarea 
              value={formData.catatan} 
              onChange={e => setFormData({...formData, catatan: e.target.value})} 
              placeholder="Informasi tambahan (opsional) - misal: alergi, tim, dll" 
              rows={2} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" 
            />
          </div>

          <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md">
            ✅ Daftar Sekarang
          </button>
        </form>
      </div>

      {/* TABEL DAFTAR PESERTA */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-lg text-[#C1272D] mb-4">🏅 Daftar Peserta ({participants.length})</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-gray-500">Memuat data peserta...</p>
          ) : participants.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Belum ada peserta terdaftar.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#C1272D] text-white">
                  <th className="text-left px-3 py-2">No</th>
                  <th className="text-left px-3 py-2">Nama & HP</th>
                  <th className="text-left px-3 py-2">RT/Blok</th>
                  <th className="text-left px-3 py-2">Lomba</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => (
                  <tr key={p.id || i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{p.name}<div className="text-xs text-gray-500">{p.whatsapp}</div></td>
                    <td className="px-3 py-2 text-xs">{p.address}</td>
                    <td className="px-3 py-2 text-xs">{Array.isArray(p.lomba) ? p.lomba.join(', ') : p.lomba}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
