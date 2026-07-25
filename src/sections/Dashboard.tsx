import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { budgetSummary, budgetComponents, budgetDetails, formatRupiah } from '../data/budget';
import { fundingSources, fundingTotal } from '../data/funding';
import { eventTypes, panduanLomba } from '../data/eventTypes';
import { submitRegistration, getRegistrations, submitDonation, getDonations } from '../utils/api';
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

  // Pendaftaran state (Terhubung langsung ke Supabase Cloud)
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showBuktiDaftar, setShowBuktiDaftar] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({ name: '', rt: '', hp: '', lomba: [] as string[], catatan: '' });

  // Donasi state (Terhubung langsung ke Supabase Cloud)
  const [donors, setDonors] = useState<Donor[]>([]);
  const [showBuktiDonasi, setShowBuktiDonasi] = useState<Donor | null>(null);
  const [donasiForm, setDonasiForm] = useState({ name: '', alamat: '', jumlah: '', pesan: '', isAnon: false, hp: '' });

  // Ambil data real-time dari Supabase Cloud saat Dashboard dimuat
  useEffect(() => {
    async function fetchCloudData() {
      try {
        const cloudParticipants = await getRegistrations();
        if (cloudParticipants && Array.isArray(cloudParticipants)) {
          setParticipants(cloudParticipants);
        }
        const cloudDonations = await getDonations();
        if (cloudDonations && Array.isArray(cloudDonations)) {
          setDonors(cloudDonations);
        }
      } catch (err) {
        console.warn('Gagal memuat data dari Supabase Cloud:', err);
      }
    }
    fetchCloudData();
  }, []);

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
      const updated = [newParticipant, ...participants];
      setParticipants(updated);
    } catch (err) {
      console.error('Gagal menyimpan pendaftaran ke Cloud:', err);
      alert('Gagal menyimpan ke database Cloud. Periksa koneksi internet.');
      return;
    }
    
    setShowBuktiDaftar(newParticipant);
    setFormData({ name: '', rt: '', hp: '', lomba: [], catatan: '' });
  };

  const handleDonasi = async (e: React.FormEvent) => {
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

    try {
      await submitDonation({
        id: newId,
        name: newDonor.name,
        alamat: donasiForm.alamat,
        jumlah: Number(donasiForm.jumlah),
        pesan: donasiForm.pesan,
        waktu: newDonor.waktu,
        isAnon: donasiForm.isAnon,
      });
      const updated = [newDonor, ...donors];
      setDonors(updated);
    } catch (err) {
      console.error('Gagal menyimpan donasi ke Cloud:', err);
      alert('Gagal menyimpan donasi ke database Cloud.');
      return;
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
            </div>

            {/* Ringkasan Anggaran */}
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
                  <tr className="bg-[#C1272D]/10 font-bold border-t-2 border-[#C1272D]">
                    <td colSpan={2} className="px-4 py-3">TOTAL DANA MASUK</td>
                    <td className="px-4 py-3 text-right">{fundingTotal.toLocaleString('id-ID')}</td>
                    <td colSpan={2}></td>
                  </tr>
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
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Lengkap" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input required value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} placeholder="RT / Blok" className="border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                  <input required value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} placeholder="No. HP / WA" className="border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Pilih Lomba:</label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    {[
                      'Makan Kerupuk', 'Futsal Mini', 'Balap Kelereng', 'Tarik Tambang', 'Hias Tumpeng',
                      'Fashion Week Daster', 'Salah Sambung', 'Joget Kursi Bapak', 'Estafet Penguin Anak',
                      'Estafet Penguin Remaja', 'Estafet Tepung', 'Joget Kursi Ibu', 'Make Up Buta'
                    ].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border cursor-pointer">
                        <input type="checkbox" checked={formData.lomba.includes(l)} onChange={e => {
                          if (e.target.checked) setFormData({...formData, lomba: [...formData.lomba, l]});
                          else setFormData({...formData, lomba: formData.lomba.filter(x => x !== l)});
                        }} className="rounded text-[#C1272D] w-4 h-4" />
                        <span className="flex-1">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <textarea value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} placeholder="Catatan (opsional)" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">✅ Daftar Sekarang</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-lg text-[#C1272D] mb-4">🏅 Daftar Peserta ({participants.length})</h3>
              <div className="overflow-x-auto">
                {participants.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>Belum ada peserta terdaftar.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#C1272D] text-white">
                        <th className="text-left px-3 py-2">No</th>
                        <th className="text-left px-3 py-2">Nama</th>
                        <th className="text-left px-3 py-2">Lomba</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2">{i+1}</td>
                          <td className="px-3 py-2 font-medium">{p.name}<div className="text-xs text-gray-500">{p.rt}</div></td>
                          <td className="px-3 py-2 text-xs">{p.lomba.join(', ')}</td>
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
            <div className="bg-gradient-to-br from-[#C1272D] to-[#8B1D20] rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-black mb-2">🏦 Link Bank Donasi Resmi</h3>
              <p className="text-red-100 text-sm mb-4">Transfer ke rekening resmi bendahara (Aulia Komari).</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-lg text-[#C1272D] mb-2">❤️ Form Konfirmasi Donasi</h3>
                <form onSubmit={handleDonasi} className="space-y-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={donasiForm.isAnon} onChange={e => setDonasiForm({...donasiForm, isAnon: e.target.checked})} className="rounded" />
                    Donasi sebagai Hamba Allah (Anonim)
                  </label>
                  {!donasiForm.isAnon && (
                    <input required={!donasiForm.isAnon} value={donasiForm.name} onChange={e => setDonasiForm({...donasiForm, name: e.target.value})} placeholder="Nama Donatur" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                  )}
                  <input required value={donasiForm.alamat} onChange={e => setDonasiForm({...donasiForm, alamat: e.target.value})} placeholder="Alamat / Blok Rumah" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                  <input required value={donasiForm.hp} onChange={e => setDonasiForm({...donasiForm, hp: e.target.value})} placeholder="No. HP" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                  <input required type="number" value={donasiForm.jumlah} onChange={e => setDonasiForm({...donasiForm, jumlah: e.target.value})} placeholder="Jumlah Donasi (Rp)" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                  <textarea value={donasiForm.pesan} onChange={e => setDonasiForm({...donasiForm, pesan: e.target.value})} placeholder="Pesan / Doa (opsional)" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" />
                  <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">💖 Konfirmasi Donasi Saya</button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-bold text-lg text-[#C1272D] mb-2">🙏 Daftar Donatur</h3>
                  <p className="text-sm text-gray-600 mb-4">Total terkumpul: <strong className="text-[#C1272D]">{formatRupiah(totalDonasi)}</strong></p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                  <h4 className="font-bold mb-3">📱 QRIS HUT RI 81 Mawar</h4>
                  <QrisImage />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Budget Detail */}
        {detailModal && budgetDetails[detailModal] && (
          <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={budgetDetails[detailModal].title} subtitle={budgetDetails[detailModal].subtitle} size="xl">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#C1272D] text-white">
                      <th className="text-left px-4 py-3">No</th>
                      <th className="text-left px-4 py-3">Item</th>
                      <th className="text-left px-4 py-3">Detail / PJ</th>
                      <th className="text-right px-4 py-3">Budget (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetDetails[detailModal].items.map((item, i) => (
                      <tr key={item.no} className={i % 2 === 0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                        <td className="px-4 py-3">{item.no}</td>
                        <td className="px-4 py-3 font-medium">{item.item}</td>
                        <td className="px-4 py-3 text-gray-600">{item.detail}</td>
                        <td className="px-4 py-3 text-right">{typeof item.budget === 'number' ? item.budget.toLocaleString('id-ID') : item.budget}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setDetailModal(null)} className="bg-[#C1272D] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition">Tutup</button>
              </div>
            </div>
          </Modal>
        )}

        {/* MODAL: Bukti Pendaftaran */}
        {showBuktiDaftar && (
          <Modal isOpen={!!showBuktiDaftar} onClose={() => setShowBuktiDaftar(null)} title="Pendaftaran Berhasil!" subtitle="HUT RI ke-81 — Perumahan Ciptaland Blok Mawar" size="md">
            <div className="p-6">
              <div className="bg-gradient-to-br from-red-50 to-white border-2 border-dashed border-[#C1272D] rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-bold text-lg">Bangkit Semangat Kemerdekaan Bersama Mawar</h3>
                <div className="mt-4 space-y-3 text-sm text-left bg-white p-4 rounded-lg">
                  <div className="flex justify-between"><span className="text-gray-500">No. Registrasi</span><span className="font-bold text-[#C1272D]">{showBuktiDaftar.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Nama</span><span className="font-semibold">{showBuktiDaftar.name}</span></div>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={() => setShowBuktiDaftar(null)} className="w-full bg-[#C1272D] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">Selesai</button>
              </div>
            </div>
          </Modal>
        )}

        {/* MODAL: Bukti Donasi */}
        {showBuktiDonasi && (
          <Modal isOpen={!!showBuktiDonasi} onClose={() => setShowBuktiDonasi(null)} title="Terima Kasih atas Donasi Anda!" subtitle="HUT RI ke-81 — Perumahan Ciptaland Blok Mawar" size="md">
            <div className="p-6">
              <div className="bg-gradient-to-br from-green-50 to-white border-2 border-dashed border-green-600 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">💖</div>
                <div className="mt-4 space-y-3 text-sm text-left bg-white p-4 rounded-lg">
                  <div className="flex justify-between"><span className="text-gray-500">No. Donasi</span><span className="font-bold text-green-700">{showBuktiDonasi.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Jumlah</span><span className="font-bold text-[#C1272D]">{formatRupiah(showBuktiDonasi.jumlah)}</span></div>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={() => setShowBuktiDonasi(null)} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">Selesai</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
}
