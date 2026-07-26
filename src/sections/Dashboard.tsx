import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { budgetSummary, budgetComponents, formatRupiah } from '../data/budget';
import { fundingSources } from '../data/funding';
import { panduanLomba } from '../data/eventTypes';
import QrisImage from '../components/QrisImage';
import { supabase } from '../utils/supabaseClient';

type TabType = 'ringkasan' | 'pendanaan' | 'panduan' | 'pendaftaran' | 'donasi';

interface Participant {
  id: string;
  name: string;
  rt: string;
  hp: string;
  lomba: string[];
  catatan: string;
  waktu: string;
}

interface Donor {
  id: string;
  name: string;
  alamat: string;
  jumlah: number;
  pesan: string;
  waktu: string;
  isAnon: boolean;
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('pendaftaran');
  const [detailModal, setDetailModal] = useState<string | null>(null);
  const [panduanModal, setPanduanModal] = useState<string | null>(null);
  
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

  const [donors, setDonors] = useState<Donor[]>([]);
  const [showBuktiDonasi, setShowBuktiDonasi] = useState<Donor | null>(null);
  const [donasiForm, setDonasiForm] = useState({ name: '', alamat: '', jumlah: '', pesan: '', isAnon: false, hp: '' });

  const handleDonasi = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `DON81-${String(donors.length + 1).padStart(4, '0')}`;
    const newDonor: Donor = {
      id: newId,
      name: donasiForm.isAnon ? 'Hamba Allah' : donasiForm.name,
      alamat: donasiForm.alamat,
      jumlah: Number(donasiForm.jumlah),
      pesan: donasiForm.pesan,
      waktu: new Date().toLocaleString('id-ID'),
      isAnon: donasiForm.isAnon,
    };
    const updated = [newDonor, ...donors];
    setDonors(updated);
    setShowBuktiDonasi(newDonor);
    setDonasiForm({ name: '', alamat: '', jumlah: '', pesan: '', isAnon: false, hp: '' });
  };

  const tabs = [
    { id: 'ringkasan' as TabType, label: 'Ringkasan', icon: '📊', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'pendanaan' as TabType, label: 'Pendanaan', icon: '💰', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'panduan' as TabType, label: 'Panduan Lomba', icon: '📋', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'pendaftaran' as TabType, label: 'Pendaftaran', icon: '📝', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'donasi' as TabType, label: 'Donasi', icon: '❤️', activeColor: 'bg-[#C1272D] text-white' },
  ];

  return (
    <section id="ringkasan" className="py-8 px-2 sm:px-4 bg-[#F5F5F0] min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id ? tab.activeColor + ' shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB RINGKASAN */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-gray-300 p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">TOTAL KEBUTUHAN ANGGARAN</div>
                <div className="text-2xl font-black text-gray-800">{formatRupiah(budgetSummary.totalKebutuhan)}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-600 p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">TARGET DANA MASUK</div>
                <div className="text-2xl font-black text-emerald-700">{formatRupiah(budgetSummary.targetDanaMasuk)}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#C1272D] p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">SELISIH (DEFISIT)</div>
                <div className="text-2xl font-black text-[#C1272D]">{formatRupiah(budgetSummary.selisih)}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="font-bold text-lg text-[#C1272D] flex items-center gap-2"><span>👥</span> Susunan Panitia</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#C1272D] text-white">
                      <th className="text-left px-4 py-3 font-semibold">Jabatan</th>
                      <th className="text-left px-4 py-3 font-semibold">Nama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { jabatan: 'Penanggung Jawab', nama: 'Eka Rista Y (0821-7129-9984)' },
                      { jabatan: 'Ketua Panitia', nama: 'Bayu S.Permana (0812-8839-5550)' },
                      { jabatan: 'Wakil Ketua', nama: 'Sugiono (0831-8395-0205)' },
                      { jabatan: 'Sekretaris', nama: 'Lani (0813-7116-2792)' },
                      { jabatan: 'Bendahara I', nama: 'Aulia Komari (0812-3456-7892)' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                        <td className="px-4 py-3 font-medium">{row.jabatan}</td>
                        <td className="px-4 py-3">{row.nama}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="font-bold text-lg text-[#C1272D] flex items-center gap-2"><span>🧮</span> Ringkasan Anggaran</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#C1272D] text-white">
                      <th className="text-left px-4 py-3">Komponen</th>
                      <th className="text-right px-4 py-3">Jumlah (Rp)</th>
                      <th className="text-left px-4 py-3">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetComponents.map((comp, idx) => (
                      <tr key={comp.id} className={comp.isTotal || comp.isDeficit ? 'bg-[#F9E2E2] font-bold text-[#C1272D]' : idx % 2 === 0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                        <td className="px-4 py-3">{comp.komponen}</td>
                        <td className="px-4 py-3 text-right">{comp.jumlah.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3">
                          {comp.detailKey && (
                            <button onClick={() => setDetailModal(comp.detailKey!)} className="border border-[#C1272D] text-[#C1272D] px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#C1272D] hover:text-white transition">Lihat Detail</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB PENDANAAN */}
        {activeTab === 'pendanaan' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-xl text-[#C1272D] mb-4">💰 Pendanaan</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#C1272D] text-white">
                  <th className="text-left px-4 py-3">Sumber Dana</th>
                  <th className="text-right px-4 py-3">Jumlah (Rp)</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {fundingSources.map((f, i) => (
                  <tr key={f.id} className={i % 2 === 0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium">{f.sumber}</td>
                    <td className="px-4 py-3 text-right">{f.jumlah.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">{f.status === 'confirmed' ? '✅ OK' : '⚠️ Konfirmasi'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB PANDUAN */}
        {activeTab === 'panduan' && (
          <div className="grid md:grid-cols-3 gap-4">
            {panduanLomba.map((p) => (
              <div key={p.id} onClick={() => setPanduanModal(p.id)} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md cursor-pointer transition">
                <div className="text-3xl mb-2">{p.icon}</div>
                <h4 className="font-bold text-gray-800">{p.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{p.kategori}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB PENDAFTARAN (DIGANTI SEPENUHNYA MENJADI TABEL REAL-TIME SUPABASE) */}
        {activeTab === 'pendaftaran' && (
          <div className="bg-[#C1272D] rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto space-y-6">
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
          </div>
        )}

        {/* TAB DONASI */}
        {activeTab === 'donasi' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg text-[#C1272D] mb-4">❤️ Konfirmasi Donasi</h3>
              <form onSubmit={handleDonasi} className="space-y-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={donasiForm.isAnon} onChange={e => setDonasiForm({...donasiForm, isAnon: e.target.checked})} />
                  Hamba Allah (Anonim)
                </label>
                {!donasiForm.isAnon && (
                  <input required value={donasiForm.name} onChange={e => setDonasiForm({...donasiForm, name: e.target.value})} placeholder="Nama Donatur" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                )}
                <input required value={donasiForm.alamat} onChange={e => setDonasiForm({...donasiForm, alamat: e.target.value})} placeholder="Alamat / Blok Rumah" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                <input required type="number" value={donasiForm.jumlah} onChange={e => setDonasiForm({...donasiForm, jumlah: e.target.value})} placeholder="Jumlah Donasi (Rp)" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition text-sm">Kirim Konfirmasi</button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <h4 className="font-bold mb-3">📱 QRIS Donasi Resmi</h4>
              <QrisImage />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
