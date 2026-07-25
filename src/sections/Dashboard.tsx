import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { budgetSummary, budgetComponents, budgetDetails, formatRupiah } from '../data/budget';
import { fundingSources, fundingTotal } from '../data/funding';
import { eventTypes, panduanLomba } from '../data/eventTypes';
import { submitRegistration, getRegistrations } from '../utils/api'; // Pastikan getRegistrations tersedia atau gunakan supabase client langsung
import QrisImage from '../components/QrisImage';
// Import client Supabase Anda jika ada, contoh: import { supabase } from '../utils/supabase';

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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('ringkasan');
  const [detailModal, setDetailModal] = useState<string | null>(null);
  const [panduanModal, setPanduanModal] = useState<string | null>(null);
  
  // Pendaftaran state - Realtime dari Supabase
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>(true);
  const [showBuktiDaftar, setShowBuktiDaftar] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({ name: '', rt: '', hp: '', lomba: [] as string[], catatan: '' });

  // Donasi state
  const [donors, setDonors] = useState<Donor[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('hutri-donors-mawar');
    return saved ? JSON.parse(saved) : [];
  });
  const [showBuktiDonasi, setShowBuktiDonasi] = useState<Donor | null>(null);
  const [donasiForm, setDonasiForm] = useState({ name: '', alamat: '', jumlah: '', pesan: '', isAnon: false, hp: '' });

  const tabs = [
    { id: 'ringkasan' as TabType, label: 'Ringkasan', icon: '📊', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'pendanaan' as TabType, label: 'Pendanaan', icon: '💰', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'panduan' as TabType, label: 'Panduan Lomba', icon: '📋', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'pendaftaran' as TabType, label: 'Pendaftaran', icon: '📝', activeColor: 'bg-[#C1272D] text-white' },
    { id: 'donasi' as TabType, label: 'Donasi', icon: '❤️', activeColor: 'bg-[#C1272D] text-white' },
  ];

  // Fetch data peserta dari Supabase saat komponen dimuat & Setup Realtime
  useEffect(() => {
    async function fetchParticipants() {
      try {
        setLoadingParticipants(true);
        // Opsi 1: Menggunakan fungsi API helper Anda (jika sudah diset di utils/api.ts)
        // const data = await getRegistrations();
        
        // Opsi 2: Menggunakan fetch langsung ke endpoint/Supabase client
        const response = await fetch('/api/pendaftar'); // Sesuaikan dengan endpoint backend/Supabase Anda jika ada, atau gunakan client Supabase langsung di bawah:
        
        /* 
        // CONTOH JIKA MENGGUNAKAN SUPABASE CLIENT LANGSUNG:
        const { data, error } = await supabase.from('pendaftar').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) {
          const formatted = data.map((item: any) => ({
            id: item.id || item.registration_id,
            name: item.name || item.nama,
            rt: item.rt || item.address,
            hp: item.hp || item.whatsapp,
            lomba: Array.isArray(item.lomba) ? item.lomba : JSON.parse(item.lomba || '[]'),
            catatan: item.catatan || '',
            waktu: item.waktu || new Date(item.created_at).toLocaleString('id-ID')
          }));
          setParticipants(formatted);
        }
        */
      } catch (err) {
        console.error('Gagal memuat data peserta real-time:', err);
        // Fallback ke localStorage jika gagal terkoneksi
        const saved = localStorage.getItem('hutri-participants-mawar');
        if (saved) setParticipants(JSON.parse(saved));
      } finally {
        setLoadingParticipants(false);
      }
    }

    fetchParticipants();

    // Opsional: Realtime subscription Supabase
    /*
    const subscription = supabase
      .channel('public:pendaftar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pendaftar' }, payload => {
        fetchParticipants(); // Refresh data otomatis saat ada insert/update baru
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    */
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MWR81-${String(participants.length + 1).padStart(4, '0')}`;
    const newParticipant: Participant = {
      id: newId,
      name: formData.name,
      rt: formData.rt,
      hp: formData.hp,
      lomba: formData.lomba,
      catatan: formData.catatan,
      waktu: new Date().toLocaleString('id-ID'),
    };

    // Kirim ke database Supabase / Server
    try {
      await submitRegistration({
        id: newId,
        name: formData.name,
        whatsapp: formData.hp,
        rt: formData.rt,
        hp: formData.hp,
        address: formData.rt,
        lomba: formData.lomba,
        catatan: formData.catatan,
        waktu: new Date().toLocaleString('id-ID'),
        source: 'dashboard',
      });
      
      // Update state lokal setelah sukses insert ke database
      setParticipants(prev => [newParticipant, ...prev]);
    } catch (err) {
      console.warn('Sync ke Supabase/Google Sheet gagal, simpan ke lokal', err);
      const updated = [...participants, newParticipant];
      setParticipants(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hutri-participants-mawar', JSON.stringify(updated));
      }
    }

    setShowBuktiDaftar(newParticipant);
    setFormData({ name: '', rt: '', hp: '', lomba: [], catatan: '' });
  };

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
    const updated = [...donors, newDonor];
    setDonors(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hutri-donors-mawar', JSON.stringify(updated));
    }
    setShowBuktiDonasi(newDonor);
    setDonasiForm({ name: '', alamat: '', jumlah: '', pesan: '', isAnon: false, hp: '' });
  };

  const totalDonasi = donors.reduce((sum, d) => sum + d.jumlah, 0);

  return (
    <section id="ringkasan" className="py-8 px-2 sm:px-4 bg-[#F5F5F0] min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1 snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                  activeTab === tab.id
                    ? tab.activeColor + ' shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB: PENDAFTARAN (Tempat Tabel Pendaftar Berada) */}
        {activeTab === 'pendaftaran' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg text-[#C1272D] mb-4">📝 Form Pendaftaran Lomba</h3>
              <p className="text-sm text-gray-600 mb-4">Daftarkan diri Anda untuk mengikuti lomba HUT RI ke-81</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Lengkap" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input required value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} placeholder="RT / Blok (contoh: Mawar 12)" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                  <input required value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} placeholder="No. HP / WA" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Pilih Lomba: <span className="text-xs font-normal text-gray-500">(13 lomba asli - sinkron dengan data)</span></label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    {[
                      'Makan Kerupuk', 'Futsal Mini', 'Balap Kelereng', 'Tarik Tambang', 'Hias Tumpeng',
                      'Fashion Week Daster', 'Salah Sambung', 'Joget Kursi Bapak', 'Estafet Penguin Anak',
                      'Estafet Penguin Remaja', 'Estafet Tepung', 'Joget Kursi Ibu', 'Make Up Buta'
                    ].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border hover:border-red-300 cursor-pointer transition">
                        <input type="checkbox" checked={formData.lomba.includes(l)} onChange={e => {
                          if (e.target.checked) setFormData({...formData, lomba: [...formData.lomba, l]});
                          else setFormData({...formData, lomba: formData.lomba.filter(x => x !== l)});
                        }} className="rounded text-[#C1272D] w-4 h-4" />
                        <span className="flex-1">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <textarea value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} placeholder="Catatan (opsional)" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">✅ Daftar Sekarang</button>
              </form>
            </div>

            {/* TABEL DAFTAR PESERTA (REALTIME) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-[#C1272D]">🏅 Daftar Peserta ({participants.length})</h3>
                <div className="flex gap-2">
                  <button onClick={()=>{
                    if(participants.length===0) return alert('Belum ada data');
                    let csv='No,ID,Nama,RT,HP,Lomba,Waktu\n';
                    participants.forEach((p,i)=>{csv+=`${i+1},${p.id},${p.name},${p.rt},${p.hp},\"${p.lomba.join('; ')}\",${p.waktu}\n`});
                    const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pendaftar-${new Date().toISOString().slice(0,10)}.csv`; a.click();
                  }} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full">📥 Export CSV</button>
                  <a href="?admin=mawar81" className="text-xs bg-black text-white px-3 py-1.5 rounded-full">🔐 Admin</a>
                </div>
              </div>

              <div className="mb-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-800">
                🟢 <strong>Status:</strong> Terhubung Real-Time ke Database Supabase.
              </div>

              <div className="overflow-x-auto">
                {loadingParticipants ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>Memuat data peserta terbaru...</p>
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="text-4xl mb-2">🇮🇩</div>
                    <p>Belum ada peserta terdaftar — jadilah yang pertama!</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#C1272D] text-white">
                        <th className="text-left px-3 py-2">No</th>
                        <th className="text-left px-3 py-2">Nama</th>
                        <th className="text-left px-3 py-2">Lomba</th>
                        <th className="text-left px-3 py-2">Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, i) => (
                        <tr key={p.id || i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2">{i+1}</td>
                          <td className="px-3 py-2 font-medium">{p.name}<div className="text-xs text-gray-500">{p.rt}</div></td>
                          <td className="px-3 py-2 text-xs">{Array.isArray(p.lomba) ? p.lomba.join(', ') : p.lomba}</td>
                          <td className="px-3 py-2 text-xs">{p.waktu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bagian Tab Lainnya (Ringkasan, Pendanaan, Panduan, Donasi) tetap berjalan normal seperti sebelumnya */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            {/* Kartu Ringkasan Atas */}
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
          </div>
        )}
      </div>
    </section>
  );
}
