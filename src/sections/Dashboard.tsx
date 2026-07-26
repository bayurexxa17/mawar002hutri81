import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase (sesuaikan dengan credentials Anda jika belum di file env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'URL_SUPABASE_ANDA';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'KEY_SUPABASE_ANDA';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Participant {
  id: string;
  name: string;
  rt: string;
  hp: string;
  lomba: string[];
  catatan: string;
  waktu: string;
}

export default function Dashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showBuktiDaftar, setShowBuktiDaftar] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rt: '',
    hp: '',
    lomba: [] as string[],
    catatan: ''
  });

  // Ambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Gagal mengambil data:', error);
        return;
      }

      if (data) {
        const formatted: Participant[] = data.map((item: any) => ({
          id: `MWR81-${String(item.id).padStart(4, '0')}`,
          name: item.nama,
          rt: item.rt || '-',
          hp: item.telepon || '',
          lomba: typeof item.lomba === 'string' ? item.lomba.split(', ') : [],
          catatan: item.catatan || '',
          waktu: item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'
        }));
        setParticipants(formatted);
      }
    } catch (err) {
      console.error('Error fetching:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.hp) {
      alert('Nama lengkap dan Nomor WhatsApp wajib diisi!');
      return;
    }

    try {
      const payloadData = {
        nama: formData.name,
        telepon: formData.hp,
        rt: formData.rt,
        lomba: formData.lomba.join(', '),
        catatan: formData.catatan || '',
      };

      const { data, error } = await supabase
        .from('pendaftar')
        .insert([payloadData])
        .select();

      if (error) {
        alert(`Gagal menyimpan ke Supabase: ${error.message}`);
        return;
      } 

      if (data && data.length > 0) {
        const newItem = data[0];
        const newParticipant: Participant = {
          id: `MWR81-${String(newItem.id).padStart(4, '0')}`,
          name: newItem.nama,
          rt: newItem.rt || '-',
          hp: newItem.telepon || '',
          lomba: formData.lomba,
          catatan: newItem.catatan || '',
          waktu: new Date(newItem.created_at).toLocaleString('id-ID'),
        };

        setShowBuktiDaftar(newParticipant);
        setParticipants(prev => [newParticipant, ...prev]);
        setFormData({ name: '', rt: '', hp: '', lomba: [], catatan: '' });
      }
    } catch (err: any) {
      alert('Terjadi kesalahan koneksi: ' + (err?.message || err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Form Pendaftaran */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Formulir Pendaftaran Lomba</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Nama Lengkap *</label>
            <input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Masukkan nama lengkap" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none text-sm" 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Nomor WhatsApp *</label>
            <input 
              required 
              value={formData.hp} 
              onChange={e => setFormData({...formData, hp: e.target.value})} 
              placeholder="08xxxxxxxxxx" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none text-sm" 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Alamat (RT/RW) *</label>
            <input 
              required 
              value={formData.rt} 
              onChange={e => setFormData({...formData, rt: e.target.value})} 
              placeholder="Contoh: RT 002 / RW 014" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none text-sm" 
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Pilih Lomba *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
              {[
                'Lomba Makan Kerupuk', 'Futsal Mini', 'Lomba Balap Kelereng', 
                'Lomba Tarik Tambang', 'Lomba Hias Tumpeng', 'Lomba Fashion Week Daster', 
                'Salah Sambung', 'Lomba Joget Kursi Bapak', 'Lomba Estafet Penguin Anak',
                'Lomba Estafet Penguin Remaja', 'Lomba Estafet Tepung', 'Lomba Joget Kursi Ibu', 
                'Lomba Make Up Buta'
              ].map(l => (
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
            <label className="text-xs font-semibold text-gray-600 block mb-1">Catatan Tambahan</label>
            <textarea 
              value={formData.catatan} 
              onChange={e => setFormData({...formData, catatan: e.target.value})} 
              placeholder="Informasi tambahan (opsional)" 
              rows={2} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none text-sm" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#C1272D] text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition shadow-md text-sm"
          >
            Kirim Pendaftaran
          </button>
        </form>
      </div>

      {/* Tabel Daftar Peserta */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Peserta Terdaftar ({participants.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Nama</th>
                <th className="p-3">RT/RW</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Lomba</th>
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-400">Belum ada data peserta.</td>
                </tr>
              ) : (
                participants.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{p.id}</td>
                    <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                    <td className="p-3 text-gray-600">{p.rt}</td>
                    <td className="p-3 text-gray-600">{p.hp}</td>
                    <td className="p-3 text-gray-600">
                      <span className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-md">
                        {p.lomba.join(', ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
