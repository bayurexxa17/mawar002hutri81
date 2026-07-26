import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { budgetSummary, budgetComponents, budgetDetails, formatRupiah } from '../data/budget';
import { fundingSources, fundingTotal } from '../data/funding';
import { eventTypes, panduanLomba } from '../data/eventTypes';
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

// Data awal bersih standar
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
  const [showBuktiDaftar, setShowBuktiDaftar] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({ name: '', rt: '', hp: '', lomba: [] as string[], catatan: '' });

  // Fungsi Pembersihan & Deduplikasi Ketat (Membuang data tanpa RT/Nama '-'/duplikat nomor HP)
  const cleanAndFormatParticipants = (rawList: any[]): Participant[] => {
    const map = new Map<string, Participant>();

    // Urutkan dari yang lama ke baru agar ID terurut rapi
    const sorted = [...rawList].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());

    sorted.forEach((item, index) => {
      if (!item) return;
      const rawName = item.nama || item.name || '';
      if (!rawName || rawName.trim() === '') return;

      const cleanName = rawName.trim();
      const cleanPhone = (item.telepon || item.hp || '').replace(/\D/g, '');
      const cleanRt = item.rt || item.address || '';

      // Abaikan data sampah test / data kosong tanpa RT atau nama tidak wajar
      if (!cleanRt || cleanRt === '-' || cleanRt.trim() === '') return;

      // Kunci unik berdasarkan Nomor HP atau Nama
      const uniqueKey = cleanPhone ? cleanPhone : cleanName.toLowerCase();

      const formattedItem: Participant = {
        id: `MWR81-${String(index + 1).padStart(4, '0')}`,
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

    return Array.from(map.values()).reverse(); // Terbaru di atas
  };

  // Fetch Supabase & Sinkronisasi
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('pendaftar')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          const combined = cleanAndFormatParticipants([...defaultParticipants, ...data]);
          setParticipants(combined);
          localStorage.setItem('hutri-participants-mawar', JSON.stringify(combined));
        }
      } catch (err) {
        console.warn('Gagal memuat dari database:', err);
      }
    }
    loadData();
  }, []);

  // Handler Pendaftaran
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.hp.trim() || !formData.rt.trim()) {
      alert('Nama lengkap, Nomor WhatsApp, dan RT/Alamat wajib diisi dengan benar!');
      return;
    }

    if (formData.lomba.length === 0) {
      alert('Pilih minimal 1 jenis lomba!');
      return;
    }

    const payload = {
      nama: formData.name.trim(),
      telepon: formData.hp.trim(),
      rt: formData.rt.trim(),
      lomba: formData.lomba.join(', '),
      catatan: formData.catatan.trim() || 'Terdaftar via Web',
    };

    try {
      const { data, error } = await supabase
        .from('pendaftar')
        .insert([payload])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Refresh data dari database agar sinkron
        const { data: refreshed } = await supabase.from('pendaftar').select('*').order('id', { ascending: true });
        if (refreshed) {
          const cleaned = cleanAndFormatParticipants([...defaultParticipants, ...refreshed]);
          setParticipants(cleaned);
          const newest = cleaned.find(p => p.hp.replace(/\D/g, '') === formData.hp.replace(/\D/g, '')) || cleaned[0];
          setShowBuktiDaftar(newest);
        }
      }

      setFormData({ name: '', rt: '', hp: '', lomba: [], catatan: '' });
    } catch (err: any) {
      alert('Gagal menyimpan ke database: ' + (err.message || 'Kesalahan jaringan'));
    }
  };

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

  const totalDonasi = donors.reduce((sum, d) => sum + d.jumlah, 0);

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

            {/* Susunan Panitia */}
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

            {/* Ringkasan Anggaran */}
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

        {/* TAB PENDAFTARAN */}
        {activeTab === 'pendaftaran' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg text-[#C1272D] mb-4">📝 Form Pendaftaran Lomba</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Nama Lengkap *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Abiyu Rexxa" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Nomor WhatsApp *</label>
                  <input required value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} placeholder="08xxxxxxxxxx" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Alamat (RT / Blok) *</label>
                  <input required value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} placeholder="Contoh: RT 002 / Blok Mawar 12" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Pilih Lomba * ({formData.lomba.length} dipilih)</label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                    {['Makan Kerupuk', 'Futsal Mini', 'Balap Kelereng', 'Tarik Tambang', 'Hias Tumpeng', 'Fashion Week Daster', 'Estafet Tepung'].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm bg-white p-2 rounded border cursor-pointer">
                        <input type="checkbox" checked={formData.lomba.includes(l)} onChange={e => {
                          if (e.target.checked) setFormData({...formData, lomba: [...formData.lomba, l]});
                          else setFormData({...formData, lomba: formData.lomba.filter(x => x !== l)});
                        }} className="rounded text-[#C1272D]" />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition text-sm">✅ Daftar Sekarang</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-[#C1272D]">🏅 Daftar Peserta ({participants.length})</h3>
                <button onClick={() => {
                  let csv = 'No,ID,Nama,RT,HP,Lomba,Waktu\n';
                  participants.forEach((p, i) => { csv += `${i+1},${p.id},${p.name},${p.rt},${p.hp},\"${p.lomba.join('; ')}\",${p.waktu}\n`; });
                  const blob = new Blob([csv], {type: 'text/csv'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = 'pendaftar-mawar.csv'; a.click();
                }} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold">📥 Export CSV</button>
              </div>
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#C1272D] text-white">
                    <tr>
                      <th className="text-left px-3 py-2">ID</th>
                      <th className="text-left px-3 py-2">Nama & Kontak</th>
                      <th className="text-left px-3 py-2">Lomba</th>
                      <th className="text-left px-3 py-2">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, i) => (
                      <tr key={p.id || i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-3 py-2 font-mono text-xs font-bold text-[#C1272D]">{p.id}</td>
                        <td className="px-3 py-2 font-medium">
                          <div>{p.name}</div>
                          <div className="text-xs text-gray-500">{p.rt} • {p.hp}</div>
                        </td>
                        <td className="px-3 py-2 text-xs">{p.lomba.join(', ')}</td>
                        <td className="px-3 py-2 text-[11px] text-gray-500">{p.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

        {/* MODAL BUKTI PENDAFTARAN */}
        {showBuktiDaftar && (
          <Modal isOpen={!!showBuktiDaftar} onClose={() => setShowBuktiDaftar(null)} title="Pendaftaran Berhasil!" subtitle="HUT RI ke-81 — Perumahan Ciptaland Blok Mawar" size="md">
            <div className="p-6 text-center">
              <div className="bg-red-50 border-2 border-dashed border-[#C1272D] rounded-xl p-4 text-left space-y-2 text-sm">
                <div><strong>No. ID:</strong> <span className="text-[#C1272D] font-bold">{showBuktiDaftar.id}</span></div>
                <div><strong>Nama:</strong> {showBuktiDafftarName => showBuktiDaftar.name}</div>
                <div><strong>RT / Blok:</strong> {showBuktiDaftar.rt}</div>
                <div><strong>No. HP:</strong> {showBuktiDaftar.hp}</div>
                <div><strong>Lomba:</strong> {showBuktiDaftar.lomba.join(', ')}</div>
              </div>
              <button onClick={() => setShowBuktiDaftar(null)} className="mt-4 w-full bg-[#C1272D] text-white py-2.5 rounded-lg font-bold">Tutup</button>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
}
