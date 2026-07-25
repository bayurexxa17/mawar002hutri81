import { useState } from 'react';
import Modal from '../components/Modal';
import { budgetSummary, budgetComponents, budgetDetails, formatRupiah } from '../data/budget';
import { fundingSources, fundingTotal } from '../data/funding';
import { eventTypes, panduanLomba } from '../data/eventTypes';
import { submitRegistration } from '../utils/api';
import QrisImage from '../components/QrisImage';

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
  
  // Pendaftaran state
  const [participants, setParticipants] = useState<Participant[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('hutri-participants-mawar');
    return saved ? JSON.parse(saved) : [];
  });
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
    const updated = [...participants, newParticipant];
    setParticipants(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hutri-participants-mawar', JSON.stringify(updated));
    }
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
    } catch (err) {
      console.warn('Sync ke database gagal, tapi data tetap tersimpan lokal', err);
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

        {/* TAB: RINGKASAN */}
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
                <h3 className="font-bold text-lg text-[#C1272D] flex items-center gap-2">
                  <span>👥</span> Susunan Panitia
                </h3>
                <p className="text-sm text-gray-500 mt-1">Panitia HUT RI ke-81 — Perumahan Ciptaland Blok Mawar (RT 002 / RW 014)</p>
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
                      { jabatan: 'Ketua Penasehat', nama: 'Jamiat' },
                      { jabatan: 'Ketua Pembina', nama: 'Syamsul Piliano' },
                      { jabatan: 'Penanggung Jawab', nama: 'Eka Rista Y' },
                      { jabatan: 'Ketua Panitia', nama: 'Bayu S.Permana (0812-8839-5550)' },
                      { jabatan: 'Wakil Ketua', nama: 'Sugiono (0831-8395-0205)' },
                      { jabatan: 'Sekretaris', nama: 'Lani (0813-7116-2792)' },
                      { jabatan: 'Bendahara I', nama: 'Aulia Komari (0813-6475-5007)' },
                      { jabatan: 'Bendahara II', nama: 'Puput (0831-8330-3884)' },
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

            {/* Jenis Acara */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="font-bold text-lg text-[#C1272D] flex items-center gap-2">
                  <span>🗓️</span> Jenis Acara
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#C1272D] text-white">
                      <th className="text-left px-4 py-3 w-12">No</th>
                      <th className="text-left px-4 py-3">Nama Acara</th>
                      <th className="text-left px-4 py-3">Tanggal / Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventTypes.map((ev) => (
                      <tr key={ev.id} className={ev.id % 2 === 0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                        <td className="px-4 py-3">{ev.id}</td>
                        <td className="px-4 py-3 font-medium">{ev.nama}</td>
                        <td className="px-4 py-3">{ev.tanggal} {ev.keterangan && `(${ev.keterangan})`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3">
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 flex gap-2 text-sm">
                  <span>⚠️</span>
                  <div><strong>Yel-yel:</strong> belum ditentukan — perlu diputuskan panitia.</div>
                </div>
              </div>
            </div>

            {/* Ringkasan Anggaran (DIPASTIKAN MUNCUL SEPERTI SCREENSHOT_166) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="font-bold text-lg text-[#C1272D] flex items-center gap-2">
                  <span>🧮</span> Ringkasan Anggaran (Budget vs Dana Masuk)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#C1272D] text-white">
                      <th className="text-left px-4 py-3">Komponen</th>
                      <th className="text-right px-4 py-3">Jumlah (Rp)</th>
                      <th className="text-left px-4 py-3">Sumber Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetComponents.map((comp, idx) => (
                      <tr 
                        key={comp.id} 
                        className={`
                          ${comp.isTotal ? 'bg-[#F9E2E2] font-bold border-t-2 border-[#C1272D]' : ''}
                          ${comp.isDeficit ? 'bg-[#F9E2E2] font-bold border-t-2 border-[#C1272D] text-[#C1272D]' : ''}
                          ${!comp.isTotal && !comp.isDeficit && idx % 2 === 0 ? 'bg-[#F9F5EB]' : ''}
                          ${!comp.isTotal && !comp.isDeficit ? 'bg-white' : ''}
                        `}
                      >
                        <td className="px-4 py-3">{comp.komponen}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {comp.jumlah.toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          {comp.detailKey ? (
                            <button
                              onClick={() => setDetailModal(comp.detailKey!)}
                              className="inline-flex items-center gap-1.5 border border-[#C1272D] text-[#C1272D] px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#C1272D] hover:text-white transition"
                            >
                              <span>🔍</span> Lihat Detail
                            </button>
                          ) : comp.isDeficit ? (
                            <span className="text-[#C1272D] text-xs font-semibold">DEFISIT — perlu tindak lanjut</span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3">
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 flex gap-2 text-sm text-gray-700">
                  <span>📌</span>
                  <div>Beberapa nama vendor/PJ (Kelong Baba, Alfamart, Indomaret, Developer Ciptaland, Biznet Home, XL Axiata, Proxinet, IndiHome, Link Net / FirstMedia) belum terkonfirmasi — mohon divalidasi ke panitia terkait sebelum finalisasi.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PENDANAAN */}
        {activeTab === 'pendanaan' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-bold text-xl text-[#C1272D]">💰 Pendanaan — Rencana Pengumpulan Dana</h3>
              <p className="text-sm text-gray-500 mt-1">Total target: {formatRupiah(fundingTotal)}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#C1272D] text-white">
                    <th className="text-left px-4 py-3">No</th>
                    <th className="text-left px-4 py-3">Sumber Dana</th>
                    <th className="text-right px-4 py-3">Jumlah (Rp)</th>
                    <th className="text-left px-4 py-3">Catatan</th>
                    <th className="text-center px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fundingSources.map((f, i) => (
                    <tr key={f.id} className={i % 2 === 0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                      <td className="px-4 py-3">{f.id}</td>
                      <td className="px-4 py-3 font-medium">{f.sumber}</td>
                      <td className="px-4 py-3 text-right">{f.jumlah.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 text-gray-600">{f.catatan}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          f.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {f.status === 'confirmed' ? '✅ OK' : '⚠️ Konfirmasi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PANDUAN LOMBA */}
        {activeTab === 'panduan' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h3 className="font-bold text-xl text-[#C1272D]">📋 Panduan Lomba</h3>
              <p className="text-gray-600 mt-2">Tata cara, jumlah peserta, dan estimasi durasi setiap lomba.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {panduanLomba.map((p) => (
                <div key={p.id} onClick={() => setPanduanModal(p.id)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md cursor-pointer transition group">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{p.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{p.kategori}</div>
                      <h4 className="font-bold text-gray-800 group-hover:text-[#C1272D] transition">{p.title}</h4>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <div>👥 Tim: {p.tim}</div>
                        <div>⏱️ {p.durasi}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PENDAFTARAN */}
        {activeTab === 'pendaftaran' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg text-[#C1272D] mb-4">📝 Form Pendaftaran Lomba</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Lengkap" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input required value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} placeholder="RT / Blok (contoh: Mawar 12)" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                  <input required value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} placeholder="No. HP / WA" className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Pilih Lomba:</label>
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

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-[#C1272D]">🏅 Daftar Peserta ({participants.length})</h3>
              </div>
              <div className="overflow-x-auto">
                {participants.length === 0 ? (
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
                        <tr key={p.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2">{i+1}</td>
                          <td className="px-3 py-2 font-medium">{p.name}<div className="text-xs text-gray-500">{p.rt}</div></td>
                          <td className="px-3 py-2 text-xs">{p.lomba.join(', ')}</td>
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

        {/* TAB: DONASI */}
        {activeTab === 'donasi' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#C1272D] to-[#8B1D20] rounded-2xl p-6 text-white relative overflow-hidden">
              <h3 className="text-2xl font-black mb-2">🏦 Link Bank Donasi Resmi</h3>
              <p className="text-red-100 text-sm mb-6">Transfer ke rekening resmi bendahara:</p>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
                <div className="bg-white rounded-xl p-4 text-gray-800">
                  <div className="font-black text-sm">SeaBank</div>
                  <div className="font-mono font-bold text-base truncate">901592977740</div>
                  <div className="text-[11px] text-gray-500 leading-tight">a.n: Aulia Komari</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-gray-800">
                  <div className="font-black text-sm">DANA</div>
                  <div className="font-mono font-bold text-base truncate">081364755007</div>
                  <div className="text-[11px] text-gray-500 leading-tight">a.n: Aulia Komari</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg text-[#C1272D] mb-2">🙏 Daftar Donatur</h3>
              <p className="text-sm text-gray-600 mb-4">Total terkumpul: <strong className="text-[#C1272D]">{formatRupiah(totalDonasi)}</strong></p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL BUDGET */}
      {detailModal && (
        <Modal onClose={() => setDetailModal(null)}>
          <div className="p-6">
            <h3 className="font-bold text-lg text-[#C1272D] mb-4">🔍 Detail Anggaran: {detailModal}</h3>
            <div className="text-sm text-gray-600 space-y-2">
              {budgetDetails[detailModal] ? (
                budgetDetails[detailModal].map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between border-b py-2">
                    <span>{item.uraian || item.nama}</span>
                    <span className="font-semibold">{formatRupiah(item.jumlah || item.biaya)}</span>
                  </div>
                ))
              ) : (
                <p>Detail tidak ditemukan.</p>
              )}
            </div>
            <button onClick={() => setDetailModal(null)} className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold">Tutup</button>
          </div>
        </Modal>
      )}

      {/* MODAL PANDUAN LOMBA */}
      {panduanModal && (
        <Modal onClose={() => setPanduanModal(null)}>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {(() => {
              const p = panduanLomba.find(x => x.id === panduanModal);
              if (!p) return <p>Panduan tidak ditemukan.</p>;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{p.icon}</span>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">{p.kategori}</span>
                      <h3 className="font-bold text-xl text-[#C1272D]">{p.title}</h3>
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg mb-4 text-xs space-y-1 text-red-900">
                    <div>👥 <strong>Jumlah Tim/Peserta:</strong> {p.tim}</div>
                    <div>⏱️ <strong>Durasi:</strong> {p.durasi}</div>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Aturan Main:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 mb-6">
                    {p.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                  <button onClick={() => setPanduanModal(null)} className="w-full bg-[#C1272D] text-white py-2 rounded-lg font-bold">Tutup</button>
                </div>
              );
            })()}
          </div>
        </Modal>
      )}
    </section>
  );
}
