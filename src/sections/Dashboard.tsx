import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Participant {
  id: string;
  name: string;
  rt: string;
  hp: string;
  lomba: string[];
  catatan: string;
  waktu: string;
}

const defaultParticipants: Participant[] = [
  {
    id: 'MWR81-0001',
    name: 'Fatimah Az Zahra',
    rt: 'RT 002 / Blok Mawar',
    hp: '081234567890',
    lomba: ['Makan Kerupuk', 'Balap Kelereng'],
    catatan: 'Peserta resmi terdaftar',
    waktu: '10/06/2026, 09:00:00',
  },
  {
    id: 'MWR81-0002',
    name: 'Ameera Hanania R',
    rt: 'RT 002 / Blok Mawar',
    hp: '081234567891',
    lomba: ['Fashion Week Daster', 'Estafet Penguin Anak'],
    catatan: 'Peserta resmi terdaftar',
    waktu: '10/06/2026, 09:05:00',
  }
];

export default function RegistrationTableSection() {
  const [participants, setParticipants] = useState<Participant[]>(defaultParticipants);

  const cleanAndFormatParticipants = (rawList: any[]): Participant[] => {
    const map = new Map<string, Participant>();
    const sorted = [...rawList].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());

    sorted.forEach((item) => {
      if (!item) return;
      const rawName = item.nama || item.name || '';
      if (!rawName || rawName.trim() === '') return;

      const cleanName = rawName.trim();
      const cleanPhone = (item.telepon || item.hp || '').replace(/\D/g, '');
      const cleanRt = item.rt || item.address || '-';

      if (cleanPhone.includes('81991176369')) return;

      const uniqueKey = cleanPhone ? cleanPhone : cleanName.toLowerCase();
      const currentIdx = map.size + 1;

      const formattedItem: Participant = {
        id: `MWR81-${String(currentIdx).padStart(4, '0')}`,
        name: cleanName,
        rt: cleanRt,
        hp: item.telepon || item.hp || '-',
        lomba: typeof item.lomba === 'string' 
          ? item.lomba.split(',').map((x: string) => x.trim()).filter(Boolean) 
          : (Array.isArray(item.lomba) ? item.lomba : []),
        catatan: item.catatan || '',
        waktu: item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : new Date().toLocaleString('id-ID')
      };

      map.set(uniqueKey, formattedItem);
    });

    return Array.from(map.values()).reverse();
  };

  const fetchParticipantsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        const combined = cleanAndFormatParticipants([...defaultParticipants, ...data]);
        setParticipants(combined);
      }
    } catch (err) {
      console.warn('Gagal memuat dari database:', err);
    }
  };

  useEffect(() => {
    fetchParticipantsFromSupabase();

    const channel = supabase
      .channel('public:pendaftar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pendaftar' }, () => {
        fetchParticipantsFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="bg-[#C1272D] rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto my-8 space-y-6">
      <div className="text-center text-white space-y-2">
        <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider">
          PENDAFTARAN — TERHUBUNG CLOUD SUPABASE
        </span>
        <h2 className="text-3xl sm:text-4xl font-black">Daftar Peserta Lomba</h2>
        <p className="text-sm text-white/90">Data peserta lomba yang masuk secara real-time dari Database Supabase Cloud</p>
        <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>Supabase Cloud Connected & Real-time Active</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-xl text-[#C1272D]">🏅 Data Peserta Real-Time ({participants.length})</h3>
            <p className="text-xs text-gray-500">Tabel otomatis memperbarui data dari pendaftar baru</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={fetchParticipantsFromSupabase} 
              className="flex-1 sm:flex-none text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition"
            >
              🔄 Refresh Data
            </button>
            <button 
              onClick={() => {
                let csv = 'No,ID,Nama,RT,HP,Lomba,Waktu\n';
                participants.forEach((p, i) => { 
                  csv += `${i+1},${p.id},${p.name},${p.rt},${p.hp},\"${p.lomba.join('; ')}\",${p.waktu}\n`; 
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); 
                a.href = url; 
                a.download = 'pendaftar-mawar.csv'; 
                a.click();
              }} 
              className="flex-1 sm:flex-none text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold transition shadow-sm"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#C1272D] text-white">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">Nama & Kontak</th>
                <th className="text-left px-4 py-3 font-semibold">Lomba Yang Diikuti</th>
                <th className="text-left px-4 py-3 font-semibold">Waktu Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {participants.map((p, i) => (
                <tr key={p.id || i} className={i % 2 === 0 ? 'bg-gray-50/50 hover:bg-gray-50' : 'bg-white hover:bg-gray-50'}>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#C1272D]">{p.id}</td>
                  <td className="px-4 py-3 font-medium">
                    <div className="text-gray-900 font-semibold">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.rt} • {p.hp}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.lomba.map((l, idx) => (
                        <span key={idx} className="bg-red-50 text-[#C1272D] border border-red-100 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{p.waktu}</td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400 text-sm">Belum ada data peserta terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <span>Database Supabase Cloud • Realtime Subscription Active</span>
          <span>Admin: Lomba Mawar81</span>
        </div>
      </div>
    </section>
  );
}
