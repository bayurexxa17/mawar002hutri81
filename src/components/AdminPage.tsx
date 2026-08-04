import { useState, useEffect, memo } from 'react';
import { supabase } from '../utils/supabaseClient';
import { formatRupiah } from '../data/siteData';
import type { Participant, KeuanganEntry, SharedData, InventoryItem } from '../App';
import { categorizeKeuangan, APP_BUILD } from '../App';
import { Handshake, Receipt, Images, Plus, Trash2, Save, PencilLine, RefreshCw, Database, Check, Copy, Music } from 'lucide-react';

interface Props { onBack: () => void; shared: SharedData; }

const jenisOptions = [
  { value: 'iuran', label: '💰 Iuran Warga', color: 'bg-blue-100 text-blue-700' },
  { value: 'kas', label: '🏦 Kas RT', color: 'bg-teal-100 text-teal-700' },
  { value: 'donasi', label: '❤️ Donasi Online', color: 'bg-pink-100 text-pink-700' },
  { value: 'cash', label: '💵 Donasi Cash', color: 'bg-green-100 text-green-700' },
  { value: 'sponsor', label: '🏢 Sponsor', color: 'bg-purple-100 text-purple-700' },
  { value: 'donatur', label: '🤝 Donatur', color: 'bg-amber-100 text-amber-700' },
  { value: 'pengeluaran', label: '💸 Pengeluaran', color: 'bg-red-100 text-red-700' },
];
const getJenisStyle = (j: string) => jenisOptions.find(o => o.value === j)?.color || 'bg-gray-100 text-gray-700';
const getJenisLabel = (j: string) => jenisOptions.find(o => o.value === j)?.label || j;

// ===== STABLE FORM COMPONENTS =====
const PesertaFormModal = memo(function PesertaFormModal({ initial, title, onSave, onCancel }: {
  initial: { id?: string; dbId?: number; nama: string; telepon: string; rt: string; lomba: string; catatan: string };
  title: string; onSave: (d: any) => void; onCancel: () => void;
}) {
  const [nama, setNama] = useState(initial.nama);
  const [telepon, setTelepon] = useState(initial.telepon);
  const [rt, setRt] = useState(initial.rt);
  const [lomba, setLomba] = useState(initial.lomba);
  const [catatan, setCatatan] = useState(initial.catatan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="bg-[#C1272D] px-6 py-4 rounded-t-2xl flex justify-between">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Nama Lengkap *</label>
            <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C1272D]/20 outline-none" autoFocus /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">No. Telepon *</label>
            <input value={telepon} onChange={e => setTelepon(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C1272D]/20 outline-none" /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">RT / Alamat *</label>
            <input value={rt} onChange={e => setRt(e.target.value)} placeholder="RT 002 / Blok Mawar" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C1272D]/20 outline-none" /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Lomba (pisah koma)</label>
            <input value={lomba} onChange={e => setLomba(e.target.value)} placeholder="Makan Kerupuk, Balap Kelereng" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C1272D]/20 outline-none" /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Catatan</label>
            <input value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Catatan opsional" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C1272D]/20 outline-none" /></div>
          <div className="flex gap-2 pt-3">
            <button onClick={onCancel} className="flex-1 py-2.5 border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={() => { if (!nama || !telepon || !rt) { alert('Nama, Telepon, dan RT wajib diisi!'); return; } onSave({ ...initial, nama, telepon, rt, lomba, catatan }); }} className="flex-1 py-2.5 bg-[#C1272D] text-white rounded-xl text-sm font-bold hover:bg-red-700">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
});

const KeuanganFormModal = memo(function KeuanganFormModal({ initial, title, onSave, onCancel }: {
  initial: KeuanganEntry; title: string; onSave: (d: KeuanganEntry) => void; onCancel: () => void;
}) {
  const [nama, setNama] = useState(initial.nama);
  const [jenis, setJenis] = useState(initial.jenis || 'iuran');
  const [jumlah, setJumlah] = useState(initial.jumlah || 0);
  const [keterangan, setKeterangan] = useState((initial.keterangan || '').replace(/^\[BARANG\]\s*/, ''));
  // Donasi berupa barang: jumlah Rp opsional, wajib isi deskripsi barang
  const [isBarang, setIsBarang] = useState((initial.keterangan || '').startsWith('[BARANG]'));

  const finalKeterangan = isBarang ? `[BARANG] ${keterangan}`.trim() : keterangan;

  const handleSimpan = () => {
    if (!nama.trim()) { alert('Nama wajib diisi!'); return; }
    if (isBarang) {
      if (!keterangan.trim()) { alert('Deskripsi barang wajib diisi (cth: 2 dus air mineral)!'); return; }
    } else if (!jumlah) {
      alert('Jumlah (Rp) wajib diisi!'); return;
    }
    onSave({ ...initial, nama, jenis, jumlah: isBarang ? (jumlah || 0) : jumlah, keterangan: finalKeterangan });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-900 px-6 py-4 rounded-t-2xl flex justify-between">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Jenis</label>
            <select value={jenis} onChange={e => { setJenis(e.target.value); if (e.target.value !== 'donatur') setIsBarang(false); }} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-gray-300 outline-none">
              {jenisOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {jenis === 'pengeluaran' && (
              <p className="mt-1.5 text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
                ↘ Pengeluaran akan <strong>mengurangi</strong> Total Bersih (Pemasukan − Pengeluaran), bukan menambah.
              </p>
            )}
            {jenis === 'kas' && (
              <p className="mt-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5">
                🏦 Masuk ke kolom <strong>Kas RT</strong> (terpisah dari Cash/Iuran Warga). Jika data lama Anda masih berjenis "Iuran Warga"/"Cash", edit jenisnya menjadi "Kas RT" agar ikut terhitung di sini.
              </p>
            )}
          </div>

          {/* Opsi khusus Donatur: uang atau barang */}
          {jenis === 'donatur' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-amber-800 cursor-pointer">
                <input type="checkbox" checked={isBarang} onChange={e => setIsBarang(e.target.checked)} className="rounded accent-amber-600 w-4 h-4" />
                📦 Donasi berupa barang (bukan uang)
              </label>
              {isBarang && (
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Jumlah Rp boleh kosong / 0. Wajib mengisi <strong>deskripsi barang</strong> di kolom keterangan. Nilai barang tidak memengaruhi Total Bersih.
                </p>
              )}
            </div>
          )}

          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Nama {jenis === 'donatur' ? 'Donatur' : 'Pembayar / Penerima'} *</label>
            <input value={nama} onChange={e => setNama(e.target.value)} placeholder={jenis === 'donatur' ? 'Cth: H. Sulaiman / Toko Berkah' : 'Nama'} className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 outline-none" autoFocus /></div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Jumlah (Rp) {isBarang ? <span className="text-amber-600">— opsional (nilai taksiran)</span> : '*'}
            </label>
            <input type="number" value={jumlah || ''} onChange={e => setJumlah(Number(e.target.value))} placeholder={isBarang ? '0' : '50000'} className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 outline-none ${isBarang ? 'border-amber-300 bg-amber-50/40 focus:ring-amber-200' : 'focus:ring-gray-300'}`} />
          </div>

          <div><label className="text-xs font-semibold text-gray-500 block mb-1">
            {isBarang ? 'Deskripsi Barang *' : 'Keterangan / Rincian'}
          </label>
            <input value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder={isBarang ? 'Cth: 2 dus air mineral, 5 kg beras' : 'Keterangan opsional'} className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 outline-none ${isBarang ? 'border-amber-400 ring-1 ring-amber-200 focus:ring-amber-300' : 'focus:ring-gray-300'}`} /></div>

          <div className="flex gap-2 pt-3">
            <button onClick={onCancel} className="flex-1 py-2.5 border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={handleSimpan} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition active:scale-[0.98]">
              {isBarang ? '📦 Simpan Barang' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const InventoryFormModal = memo(function InventoryFormModal({ initial, title, onSave, onCancel }: {
  initial: InventoryItem; title: string; onSave: (d: InventoryItem) => void; onCancel: () => void;
}) {
  const [nama, setNama] = useState(initial.nama);
  const [jumlah, setJumlah] = useState(initial.jumlah);
  const [satuan, setSatuan] = useState(initial.satuan);
  const [kategori, setKategori] = useState(initial.kategori);
  const [keterangan, setKeterangan] = useState(initial.keterangan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="bg-[#B71C22] px-6 py-4 rounded-t-2xl flex justify-between">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Nama Barang *</label>
            <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Barang" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" autoFocus /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-semibold text-gray-500 block mb-1">Jumlah *</label>
              <input type="number" value={jumlah || ''} onChange={e => setJumlah(Number(e.target.value))} placeholder="1" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" /></div>
            <div><label className="text-xs font-semibold text-gray-500 block mb-1">Satuan *</label>
              <input value={satuan} onChange={e => setSatuan(e.target.value)} placeholder="Pcs/Set" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" /></div>
          </div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Kategori *</label>
            <input value={kategori} onChange={e => setKategori(e.target.value)} placeholder="Alat Lomba / Dekorasi / dll" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Keterangan</label>
            <input value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Kondisi barang dll" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" /></div>
          <div className="flex gap-2 pt-3">
            <button onClick={onCancel} className="flex-1 py-2.5 border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={() => { if (!nama || !jumlah || !satuan || !kategori) { alert('Harap isi semua field wajib!'); return; } onSave({ ...initial, nama, jumlah, satuan, kategori, keterangan }); }} className="flex-1 py-2.5 bg-[#B71C22] text-white rounded-xl text-sm font-bold hover:bg-red-700">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ===== MAIN ADMIN COMPONENT =====
export default function AdminPage({ onBack, shared }: Props) {
  const [authed, setAuthed] = useState(false);
  const [isOwner, setIsLiveOwner] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [tab, setTab] = useState<'peserta' | 'keuangan' | 'inventory' | 'talenta' | 'sponsor' | 'pengeluaran' | 'gallery' | 'panitia' | 'info' | 'rundown' | 'pelaksana' | 'musik'>('peserta');
  const [musikForm, setMusikForm] = useState({ title: '', url: '', ket: '' });
  const [editMusik, setEditMusik] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  // Unggah file MP3 ke Supabase Storage (bucket "musik") → URL publik langsung
  const uploadMusik = async (file: File) => {
    setUploading(true);
    try {
      const path = `lagu-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from('musik').upload(path, file, { upsert: true });
      if (error) throw error;
      const url = supabase.storage.from('musik').getPublicUrl(path).data.publicUrl;
      const t = { id: `custom-${Date.now()}`, title: file.name.replace(/\.[^.]+$/, ''), sub: 'MP3 • Supabase Storage', kind: 'audio' as const, url, custom: true };
      persistMusik([...shared.musicTracks, t]);
      notify('✔ Lagu diunggah & masuk playlist');
    } catch (e: any) {
      console.warn('[Storage] gagal unggah:', e?.message);
      notify('⚠️ Gagal unggah: ' + (e?.message || 'buat bucket "musik" publik dulu — lihat petunjuk di bawah'), 'err');
    }
    setUploading(false);
  };

  const persistMusik = async (list: any[]) => {
    shared.setMusicTracks(list);
    // tulis ke Supabase: hapus semua lalu tulis ulang (tabel kecil)
    try {
      await supabase.from('musik').delete().neq('id', -1);
      await supabase.from('musik').insert(list.filter(t => t.custom).map((t, i) => ({ judul: t.title, url: t.url, keterangan: t.sub, urutan: i + 1 })));
    } catch { /* tabel musik belum ada — localStorage tetap tersimpan via App */ }
    shared.fetchMusic();
  };
  // Konversi link share Google Drive → tautan unduh langsung
  const normUrl = (u: string) => {
    const m = (u || '').match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]{10,})/);
    if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
    return u;
  };
  const addMusik = () => {
    if (!musikForm.url.trim()) { alert('URL file MP3 wajib diisi!'); return; }
    const t = { id: `custom-${Date.now()}`, title: musikForm.title.trim() || 'Lagu Kustom', sub: musikForm.ket.trim() || 'MP3 • Panel Panitia', kind: 'audio' as const, url: normUrl(musikForm.url.trim()), custom: true };
    persistMusik([...shared.musicTracks, t]);
    setMusikForm({ title: '', url: '', ket: '' });
    notify('✔ Lagu ditambahkan ke playlist');
  };
  const updateMusik = () => {
    if (!editMusik) return;
    if (!editMusik.url?.trim()) { alert('URL MP3 wajib diisi!'); return; }
    persistMusik(shared.musicTracks.map(t => t.id === editMusik.id ? { ...t, title: editMusik.title || t.title, sub: editMusik.ket || t.sub, url: normUrl(editMusik.url) } : t));
    setEditMusik(null);
    notify('✔ Lagu diperbarui');
  };
  const deleteMusik = (id: string) => {
    if (!confirm('Hapus lagu ini dari playlist?')) return;
    persistMusik(shared.musicTracks.filter(t => t.id !== id));
    notify('✔ Lagu dihapus');
  };

  // ===== INFO ACARA handlers =====
  const [infoForm, setInfoForm] = useState(shared.infoAcara);
  const saveInfoAcara = async () => {
    shared.setInfoAcara(infoForm);
    try {
      // Pola "ganti semua": hapus isi lama lalu tulis satu baris baru —
      // menghindari masalah id/kolom dan menjamin selalu tersimpan.
      await supabase.from('info_acara').delete().neq('id', -1);
      const { error } = await supabase.from('info_acara').insert([{ tanggal: infoForm.tanggal, waktu: infoForm.waktu, lokasi: infoForm.lokasi, peserta: infoForm.peserta }]);
      if (error) throw error;
      notify('✔ Informasi Acara tersimpan & tersinkron ke Supabase');
    } catch (e: any) {
      console.warn('[Supabase] info_acara gagal simpan:', e?.message);
      notify('⚠️ Gagal simpan ke Supabase: ' + (e?.message || 'periksa tabel info_acara'), 'err');
    }
    shared.fetchInfoAcara();
  };

  // ===== RUNDOWN handlers =====
  const [rundownForm, setRundownForm] = useState({ hari: 'perlombaan' as 'perlombaan' | 'malam', waktu: '', icon: '', kegiatan: '', keterangan: '' });
  const [editRundown, setEditRundown] = useState<any | null>(null);
  const submitRundown = async () => {
    const src = editRundown || rundownForm;
    if (!src.waktu.trim() || !src.kegiatan.trim()) { alert('Waktu dan Kegiatan wajib diisi!'); return; }
    if (editRundown?.id) {
      shared.setRundownRows(prev => prev.map(r => r.id === editRundown.id ? { ...r, hari: src.hari, waktu: src.waktu, icon: src.icon || '📌', kegiatan: src.kegiatan, keterangan: src.keterangan } : r));
      try { await supabase.from('rundown').update({ hari: src.hari, waktu: src.waktu, icon: src.icon || '📌', kegiatan: src.kegiatan, keterangan: src.keterangan }).eq('id', editRundown.id); notify('✔ Rundown diperbarui'); }
      catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal'), 'err'); }
      setEditRundown(null);
    } else {
      const row = { hari: src.hari, waktu: src.waktu.trim(), icon: src.icon || '📌', kegiatan: src.kegiatan.trim(), keterangan: src.keterangan.trim(), urutan: shared.rundownRows.length + 1 };
      shared.setRundownRows(prev => [...prev, row as any]);
      setRundownForm({ hari: 'perlombaan', waktu: '', icon: '', kegiatan: '', keterangan: '' });
      try { await supabase.from('rundown').insert([row]); notify('✔ Rundown ditambahkan'); }
      catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal'), 'err'); }
    }
    shared.fetchRundown();
  };
  const deleteRundown = async (r: any) => {
    if (!confirm(`Hapus "${r.kegiatan}"?`)) return;
    shared.setRundownRows(prev => prev.filter(x => x.id !== r.id));
    if (r.id) { try { await supabase.from('rundown').delete().eq('id', r.id); } catch {} }
    shared.fetchRundown();
  };

  // ===== PANITIA PELAKSANA handlers =====
  const [pelaksanaForm, setPelaksanaForm] = useState({ nama: '', jabatan: '', hp: '', is_core: false });
  const [editPelaksana, setEditPelaksana] = useState<any | null>(null);
  const submitPelaksana = async () => {
    const src = editPelaksana || pelaksanaForm;
    if (!src.nama.trim() || !src.jabatan.trim()) { alert('Nama dan Jabatan wajib diisi!'); return; }
    if (editPelaksana?.id) {
      shared.setPelaksanaRows(prev => prev.map(p => p.id === editPelaksana.id ? { ...p, nama: src.nama, jabatan: src.jabatan, hp: src.hp, is_core: src.is_core } : p));
      try { await supabase.from('panitia_pelaksana').update({ nama: src.nama, jabatan: src.jabatan, hp: src.hp, is_core: src.is_core }).eq('id', editPelaksana.id); notify('✔ Panitia pelaksana diperbarui'); }
      catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal'), 'err'); }
      setEditPelaksana(null);
    } else {
      const row = { nama: src.nama.trim(), jabatan: src.jabatan.trim(), hp: src.hp.trim(), is_core: src.is_core, urutan: shared.pelaksanaRows.length + 1 };
      shared.setPelaksanaRows(prev => [...prev, row as any]);
      setPelaksanaForm({ nama: '', jabatan: '', hp: '', is_core: false });
      try { await supabase.from('panitia_pelaksana').insert([row]); notify('✔ Panitia pelaksana ditambahkan'); }
      catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal'), 'err'); }
    }
    shared.fetchPelaksana();
  };
  const deletePelaksana = async (p: any) => {
    if (!confirm(`Hapus "${p.nama}"?`)) return;
    shared.setPelaksanaRows(prev => prev.filter(x => x.id !== p.id));
    if (p.id) { try { await supabase.from('panitia_pelaksana').delete().eq('id', p.id); } catch {} }
    shared.fetchPelaksana();
  };

  // ===== PANITIA handlers (tabel `panitia` di Supabase) =====
  const [panitiaForm, setPanitiaForm] = useState({ jabatan: '', nama: '', hp: '' });
  const [editPanitiaRow, setEditPanitiaRow] = useState<{ id?: number; jabatan: string; nama: string; hp: string } | null>(null);

  const submitPanitia = async () => {
    const src = editPanitiaRow || panitiaForm;
    if (!src.jabatan.trim() || !src.nama.trim()) { alert('Jabatan dan Nama wajib diisi!'); return; }
    if (editPanitiaRow?.id) {
      shared.setPanitiaCore(prev => prev.map(p => p.id === editPanitiaRow.id ? { ...p, jabatan: src.jabatan, nama: src.nama, hp: src.hp } : p));
      try {
        await supabase.from('panitia').update({ jabatan: src.jabatan, nama: src.nama, hp: src.hp }).eq('id', editPanitiaRow.id);
        notify('✔ Susunan panitia diperbarui & tersinkron');
      } catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal sinkron'), 'err'); }
      setEditPanitiaRow(null);
    } else {
      const newRow = { jabatan: src.jabatan.trim(), nama: src.nama.trim(), hp: src.hp.trim() };
      shared.setPanitiaCore(prev => [...prev, newRow]);
      setPanitiaForm({ jabatan: '', nama: '', hp: '' });
      try {
        await supabase.from('panitia').insert([{ ...newRow, urutan: shared.panitiaCore.length + 1 }]);
        notify('✔ Panitia ditambahkan & tersinkron');
      } catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal sinkron'), 'err'); }
    }
    shared.fetchPanitia();
  };

  const deletePanitia = async (p: { id?: number; nama: string }) => {
    if (!confirm(`Hapus "${p.nama}" dari Susunan Panitia?`)) return;
    shared.setPanitiaCore(prev => prev.filter(x => x !== p));
    if (p.id) {
      try { await supabase.from('panitia').delete().eq('id', p.id); notify('✔ Panitia dihapus dari Supabase'); }
      catch (e: any) { notify('⚠️ ' + (e?.message || 'Gagal hapus'), 'err'); }
    }
    shared.fetchPanitia();
  };

  // Notifikasi sinkronisasi (feedback realtime untuk setiap aksi)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const notify = (msg: string, type: 'ok' | 'err' = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4500); };

  // ===== Status koneksi tabel Supabase (selalu terlihat) =====
  const TABLES_PROBE = ['pendaftar', 'keuangan', 'sponsor', 'donatur', 'kas rt', 'pengeluaran', 'iuran warga', 'inventory', 'talenta', 'panitia', 'panitia_pelaksana', 'rundown', 'info_acara', 'gallery', 'musik'];
  const [tableStatus, setTableStatus] = useState<Record<string, 'ok' | 'fail' | 'cek'>>(() => Object.fromEntries(TABLES_PROBE.map(t => [t, 'cek'])));
  const [openSql, setOpenSql] = useState<string | null>(null);
  const [copiedTbl, setCopiedTbl] = useState('');

  const TABLE_COLS: Record<string, string> = {
    'pendaftar': 'nama TEXT NOT NULL, telepon TEXT, rt TEXT, lomba TEXT, catatan TEXT',
    'keuangan': 'nama TEXT NOT NULL, jenis TEXT DEFAULT \'donasi\', jumlah BIGINT DEFAULT 0, keterangan TEXT',
    'sponsor': 'nama TEXT NOT NULL, deskripsi TEXT, website TEXT, logo TEXT, icon TEXT DEFAULT \'🏪\', warna TEXT',
    'donatur': 'nama TEXT NOT NULL, jumlah BIGINT DEFAULT 0, keterangan TEXT',
    'kas rt': 'nama TEXT NOT NULL, jumlah BIGINT DEFAULT 0, keterangan TEXT, jenis TEXT DEFAULT \'kas\'',
    'pengeluaran': 'nama TEXT, keterangan TEXT, jumlah BIGINT DEFAULT 0',
    'iuran warga': 'nama TEXT NOT NULL, jumlah BIGINT DEFAULT 0, keterangan TEXT',
    'inventory': 'nama TEXT NOT NULL, jumlah BIGINT DEFAULT 0, satuan TEXT DEFAULT \'Pcs\', kategori TEXT DEFAULT \'Umum\', keterangan TEXT',
    'talenta': 'no INT DEFAULT 0, jenis TEXT, nama TEXT, jumlah TEXT, durasi TEXT, pj TEXT, status TEXT',
    'panitia': 'urutan INT DEFAULT 0, jabatan TEXT NOT NULL, nama TEXT NOT NULL, hp TEXT',
    'panitia_pelaksana': 'urutan INT DEFAULT 0, nama TEXT NOT NULL, jabatan TEXT NOT NULL, hp TEXT, is_core BOOLEAN DEFAULT FALSE',
    'rundown': 'hari TEXT DEFAULT \'perlombaan\', urutan INT DEFAULT 0, waktu TEXT, icon TEXT DEFAULT \'📌\', kegiatan TEXT, keterangan TEXT',
    'info_acara': 'tanggal TEXT, waktu TEXT, lokasi TEXT, peserta TEXT',
    'gallery': 'title TEXT, url TEXT, credit TEXT, type TEXT DEFAULT \'photo\'',
    'musik': 'urutan INT DEFAULT 0, judul TEXT NOT NULL, url TEXT NOT NULL, keterangan TEXT',
  };
  const sqlFor = (t: string) =>
    `CREATE TABLE IF NOT EXISTS "${t}" (id BIGSERIAL PRIMARY KEY, ${TABLE_COLS[t]}, created_at TIMESTAMPTZ DEFAULT NOW());\n` +
    `ALTER TABLE "${t}" ENABLE ROW LEVEL SECURITY;\n` +
    `DROP POLICY IF EXISTS "public_all" ON "${t}";\n` +
    `CREATE POLICY "public_all" ON "${t}" FOR ALL USING (true) WITH CHECK (true);\n` +
    `ALTER PUBLICATION supabase_realtime ADD TABLE "${t}";`;
  const copyTblSql = (t: string) => {
    navigator.clipboard.writeText(sqlFor(t)).then(() => { setCopiedTbl(t); setTimeout(() => setCopiedTbl(''), 2000); });
  };
  const probeTables = async () => {
    const next: Record<string, 'ok' | 'fail' | 'cek'> = {};
    TABLES_PROBE.forEach(t => { next[t] = 'cek'; });
    setTableStatus({ ...next });
    await Promise.all(TABLES_PROBE.map(async t => {
      try {
        const { error } = await supabase.from(t).select('*').limit(1);
        next[t] = error ? 'fail' : 'ok';
      } catch { next[t] = 'fail'; }
    }));
    setTableStatus({ ...next });
  };
  useEffect(() => { if (authed) probeTables(); }, [authed]);

  const [searchP, setSearchP] = useState('');
  const [filterJenis, setFilterJenis] = useState('semua');

  // Modal states
  const [pesertaModal, setPesertaModal] = useState<{ mode: 'add' | 'edit'; data: any } | null>(null);
  const [keuanganModal, setKeuanganModal] = useState<{ mode: 'add' | 'edit'; data: KeuanganEntry } | null>(null);
  const [inventoryModal, setInventoryModal] = useState<{ mode: 'add' | 'edit'; data: InventoryItem } | null>(null);

  const authorizedUsers = [
    { user: 'admin', pass: 'mawar81', nama: 'Administrator' },
    { user: 'eka', pass: 'pj2026!', nama: 'Eka Rista Y (PJ)' },
    { user: 'bayu', pass: 'ketua2026!', nama: 'Bayu S.Permana (Ketua)' },
    { user: 'aulia', pass: 'bendahara2026!', nama: 'Aulia Komari (Bendahara)' },
    { user: 'sugiono', pass: 'wakil2026!', nama: 'Sugiono (Wakil)' },
    { user: 'lani', pass: 'sekretaris2026!', nama: 'Lani (Sekretaris)' },
    { user: 'puput', pass: 'bendahara2!', nama: 'Puput (Bendahara 2)' },
  ];

  const { participants, keuanganList, inventoryList } = shared;
  const filteredPeserta = participants.filter(p => searchP === '' || p.name.toLowerCase().includes(searchP.toLowerCase()) || p.rt.toLowerCase().includes(searchP.toLowerCase()) || p.hp.includes(searchP));
  const filteredKeuangan = filterJenis === 'semua' ? keuanganList : keuanganList.filter(k => k.jenis === filterJenis);
  
  // Calculate total, ignoring Pengeluaran
  const totalPemasukan = keuanganList.filter(k => k.jenis !== 'pengeluaran').reduce((s, k) => s + (k.jumlah || 0), 0);
  const totalPengeluaran = keuanganList.filter(k => k.jenis === 'pengeluaran').reduce((s, k) => s + (k.jumlah || 0), 0);
  const totalByJenis = (jenis: string) => keuanganList.filter(k => k.jenis === jenis).reduce((s, k) => s + (k.jumlah || 0), 0);

  // Helper: simpan keuangan ke localStorage LANGSUNG
  const saveToLocal = (list: KeuanganEntry[]) => {
    try { localStorage.setItem('hutri81-keuangan', JSON.stringify(list)); } catch { /* storage full */ }
  };

  // Helper: simpan inventory ke localStorage LANGSUNG
  const saveInventoryToLocal = (list: InventoryItem[]) => {
    try { localStorage.setItem('hutri81-inventory', JSON.stringify(list)); } catch { /* storage full */ }
  };

  // ===== CRUD handlers (WITH REPLACE — NO DUPLICATES) =====
  const handleSavePeserta = (f: { id?: string; dbId?: number; nama: string; telepon: string; rt: string; lomba: string; catatan: string }) => {
    if (f.id) {
      // REPLACE / EDIT MODE: Find and update the existing element
      const updated = participants.map(x => x.id === f.id ? {
        ...x,
        name: f.nama, rt: f.rt, hp: f.telepon,
        lomba: f.lomba.split(',').map(l => l.trim()).filter(Boolean),
        catatan: f.catatan || x.catatan
      } : x);
      shared.setParticipants(updated);
      setPesertaModal(null);
      // Supabase Update in Background
      if (f.dbId) {
        Promise.resolve(supabase.from('pendaftar').update({ nama: f.nama, telepon: f.telepon, rt: f.rt, lomba: f.lomba, catatan: f.catatan }).eq('id', f.dbId))
          .then((res: any) => {
            if (res?.error) notify('⚠️ Gagal update peserta di Supabase: ' + res.error.message, 'err');
            else { shared.fetchParticipants(); notify('✔ Peserta diperbarui & tersinkron ke Supabase'); }
          }).catch((e: any) => notify('⚠️ ' + (e?.message || 'Gagal sinkron'), 'err'));
      }
    } else {
      // ADD MODE: Insert new element
      const newP: Participant = {
        id: `MWR81-${String(participants.length + 1).padStart(4, '0')}`,
        name: f.nama, rt: f.rt, hp: f.telepon,
        lomba: f.lomba.split(',').map(x => x.trim()).filter(Boolean),
        catatan: f.catatan || 'Via Admin', waktu: new Date().toLocaleString('id-ID'),
      };
      shared.setParticipants(prev => [newP, ...prev]);
      shared.setNewRowIds(prev => { const s = new Set(prev); s.add(newP.name); return s; });
      setTimeout(() => shared.setNewRowIds(prev => { const s = new Set(prev); s.delete(newP.name); return s; }), 5000);
      setPesertaModal(null);
      Promise.resolve(supabase.from('pendaftar').insert([{ nama: f.nama, telepon: f.telepon, rt: f.rt, lomba: f.lomba, catatan: f.catatan }]))
        .then((res: any) => {
          if (res?.error) notify('⚠️ Peserta tampil lokal, gagal ke Supabase: ' + res.error.message, 'err');
          else { shared.fetchParticipants(); notify('✔ Peserta tersimpan & realtime ke Supabase'); }
        }).catch((e: any) => notify('⚠️ ' + (e?.message || 'Gagal sinkron'), 'err'));
    }
  };

  const handleDeletePeserta = (p: Participant) => {
    if (!confirm(`Hapus "${p.name}"?`)) return;
    shared.setParticipants(prev => prev.filter(x => x.id !== p.id));
    if (p.dbId && p.dbId > 0) {
      Promise.resolve(supabase.from('pendaftar').delete().eq('id', p.dbId))
        .then((res: any) => {
          if (res?.error) notify('⚠️ Gagal hapus di Supabase: ' + res.error.message, 'err');
          else { shared.fetchParticipants(); notify('✔ Peserta dihapus dari Supabase'); }
        }).catch(() => {});
    } else {
      notify('✔ Peserta dihapus (data lokal)');
    }
  };

  const handleSaveKeuangan = (k: KeuanganEntry) => {
    if (k.id && k.id > 0) {
      // REPLACE / EDIT MODE: Find and update existing keuangan entry
      const updated = keuanganList.map(x => x.id === k.id ? k : x);
      shared.setKeuanganList(updated);
      shared.setTotalDana(updated.reduce((s, x) => s + (x.jenis === 'pengeluaran' ? -x.jumlah : x.jumlah), 0));
      saveToLocal(updated);
      setKeuanganModal(null);
      // Supabase Update
      Promise.resolve(supabase.from('keuangan').update({ nama: k.nama, jenis: k.jenis, jumlah: k.jumlah, keterangan: k.keterangan }).eq('id', k.id))
        .then((res: any) => {
          if (res?.error) notify('⚠️ Gagal update keuangan di Supabase: ' + res.error.message, 'err');
          else { shared.fetchKeuangan(); notify('✔ Keuangan diperbarui & tersinkron'); }
        }).catch((e: any) => notify('⚠️ ' + (e?.message || 'Gagal sinkron'), 'err'));
    } else {
      // ADD MODE: Insert new entry
      const newK: KeuanganEntry = { ...k, id: -(Date.now()), created_at: new Date().toISOString() };
      const updated = [newK, ...keuanganList];
      shared.setKeuanganList(updated);
      shared.setTotalDana(updated.reduce((s, x) => s + (x.jenis === 'pengeluaran' ? -x.jumlah : x.jumlah), 0));
      saveToLocal(updated);
      setKeuanganModal(null);
      // Supabase Insert — jenis 'kas' masuk ke tabel khusus `kas_rt`
      const isKas = k.jenis === 'kas';
      const isDonatur = k.jenis === 'donatur';
      const target = isKas
        ? supabase.from('kas rt').insert([{ nama: k.nama, jumlah: k.jumlah, keterangan: k.keterangan, jenis: 'kas' }])
        : isDonatur
          ? supabase.from('donatur').insert([{ nama: k.nama, jumlah: k.jumlah, keterangan: k.keterangan }])
          : supabase.from('keuangan').insert([{ nama: k.nama, jenis: k.jenis, jumlah: k.jumlah, keterangan: k.keterangan }]);
      Promise.resolve(target)
        .then((res: any) => {
          if (res?.error) notify('⚠️ Transaksi tampil lokal, gagal ke Supabase: ' + res.error.message, 'err');
          else { shared.fetchKeuangan(); notify(isKas ? '✔ Setoran Kas RT tersimpan & realtime' : k.jenis === 'pengeluaran' ? '✔ Pengeluaran tercatat — saldo & pemasukan diperbarui realtime' : '✔ Transaksi tersimpan & realtime ke Supabase'); }
        }).catch((e: any) => notify('⚠️ ' + (e?.message || 'Gagal sinkron'), 'err'));
      // Jika sponsor → tulis juga ke tabel `sponsor` agar slideshow & kolom Sponsor sinkron
      if (k.jenis === 'sponsor') {
        Promise.resolve(supabase.from('sponsor').insert([{ nama: k.nama, keterangan: k.keterangan }]))
          .then(() => shared.fetchKeuangan()).catch(() => {});
      }
    }
  };

  const handleDeleteKeuangan = (k: KeuanganEntry) => {
    if (!confirm('Hapus data keuangan ini?')) return;
    const updated = keuanganList.filter(x => x.id !== k.id);
    shared.setKeuanganList(updated);
    shared.setTotalDana(updated.reduce((s, x) => s + (x.jenis === 'pengeluaran' ? -x.jumlah : x.jumlah), 0));
    saveToLocal(updated);
    if (k.id && k.id > 0) {
      // Offset 9jt = donatur, 8jt = "kas rt", 7jt = "kas_rt", 6jt = pengeluaran, lainnya = keuangan
      if (k.id >= 9000000) {
        supabase.from('donatur').delete().eq('id', k.id - 9000000).then(() => shared.fetchKeuangan());
      } else if (k.id >= 8000000) {
        supabase.from('kas rt').delete().eq('id', k.id - 8000000).then(() => shared.fetchKeuangan());
      } else if (k.id >= 7000000) {
        supabase.from('kas_rt').delete().eq('id', k.id - 7000000).then(() => shared.fetchKeuangan());
      } else if (k.id >= 6000000) {
        supabase.from('pengeluaran').delete().eq('id', k.id - 6000000).then(() => shared.fetchKeuangan());
      } else {
        supabase.from('keuangan').delete().eq('id', k.id).then(() => shared.fetchKeuangan());
      }
    }
  };

  const handleSaveInventory = (item: InventoryItem) => {
    if (item.id && !item.id.startsWith('-')) {
      // REPLACE / EDIT MODE: Update existing inventory
      const updated = inventoryList.map(x => x.id === item.id ? item : x);
      shared.setInventoryList(updated);
      saveInventoryToLocal(updated);
      setInventoryModal(null);
      // Supabase Update
      Promise.resolve(supabase.from('inventory').update({ nama: item.nama, jumlah: item.jumlah, satuan: item.satuan, kategori: item.kategori, keterangan: item.keterangan }).eq('id', item.id))
        .then(() => shared.fetchInventory()).catch(() => {});
    } else {
      // ADD MODE: Insert new item
      const newItem: InventoryItem = { ...item, id: `INV-${Date.now()}` };
      const updated = [...inventoryList, newItem];
      shared.setInventoryList(updated);
      saveInventoryToLocal(updated);
      setInventoryModal(null);
      // Supabase Insert
      Promise.resolve(supabase.from('inventory').insert([{ nama: item.nama, jumlah: item.jumlah, satuan: item.satuan, kategori: item.kategori, keterangan: item.keterangan }]))
        .then(() => shared.fetchInventory()).catch(() => {});
    }
  };

  const handleDeleteInventory = (item: InventoryItem) => {
    if (!confirm(`Hapus "${item.nama}" dari inventory?`)) return;
    const updated = inventoryList.filter(x => x.id !== item.id);
    shared.setInventoryList(updated);
    saveInventoryToLocal(updated);
    if (item.id && !item.id.startsWith('-')) {
      Promise.resolve(supabase.from('inventory').delete().eq('id', item.id)).then(() => shared.fetchInventory()).catch(() => {});
    }
  };

  // ===== TALENTA handlers (inline edit + simpan ke Supabase) =====
  const updateTalenta = (idx: number, field: string, value: string) => {
    shared.setTalentaList(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };
  const addTalenta = () => {
    shared.setTalentaList(prev => [...prev, { no: prev.length + 1, jenis: '', nama: '', jumlah: '', durasi: '', pj: '', status: '' }]);
  };
  const deleteTalenta = (idx: number) => {
    if (!confirm('Hapus baris talenta ini?')) return;
    shared.setTalentaList(prev => prev.filter((_, i) => i !== idx));
  };
  const saveTalentaToDb = async () => {
    try {
      // Hapus semua lalu insert ulang (tabel kecil)
      await supabase.from('talenta').delete().neq('no', -1);
      const { error } = await supabase.from('talenta').insert(shared.talentaList.map(t => ({ no: t.no, jenis: t.jenis, nama: t.nama, jumlah: t.jumlah, durasi: t.durasi, pj: t.pj, status: t.status })));
      if (error) throw error;
      alert('✅ Data talenta berhasil disimpan ke Supabase!');
      shared.fetchTalenta();
    } catch (e: any) {
      alert('⚠️ Gagal simpan ke Supabase: ' + (e?.message || e) + '\n\nData tetap tersimpan lokal & sinkron antar halaman.');
    }
  };

  // ===== SPONSOR handlers (realtime → tabel `sponsor`) =====
  const [sponsorForm, setSponsorForm] = useState({ nama: '', deskripsi: '', logo: '', website: '' });
  const [editSponsor, setEditSponsor] = useState<any | null>(null);

  const submitSponsor = async () => {
    const src = editSponsor || sponsorForm;
    if (!src.nama?.trim()) { alert('Nama sponsor wajib diisi!'); return; }
    if (editSponsor) {
      shared.setSponsorList(prev => prev.map(s => s.id === editSponsor.id ? { ...s, nama: src.nama, deskripsi: src.deskripsi, logo: src.logo, website: src.website } : s));
      const numId = Number(String(editSponsor.id).replace('sp-', ''));
      try {
        if (!isNaN(numId)) await supabase.from('sponsor').update({ nama: src.nama, deskripsi: src.deskripsi, logo: src.logo, website: src.website }).eq('id', numId);
        shared.fetchSponsors();
      } catch (e: any) { alert('⚠️ ' + (e?.message || 'Gagal update')); }
      setEditSponsor(null);
    } else {
      const item = { id: `sp-${Date.now()}`, nama: src.nama.trim(), deskripsi: src.deskripsi || 'Sponsor mitra acara', logo: src.logo, website: src.website, icon: '🏪', warna: 'text-purple-600' };
      shared.setSponsorList(prev => [...prev, item]);
      setSponsorForm({ nama: '', deskripsi: '', logo: '', website: '' });
      try {
        const { error } = await supabase.from('sponsor').insert([{ nama: item.nama, deskripsi: item.deskripsi, logo: item.logo || '', website: item.website || '' }]);
        if (error) throw error;
        shared.fetchSponsors(); shared.fetchKeuangan();
      } catch (e: any) { alert('⚠️ Gagal simpan ke Supabase: ' + (e?.message || e) + '\nSponsor tetap tampil lokal.'); }
    }
  };

  const deleteSponsor = async (sp: any) => {
    if (!confirm(`Hapus sponsor "${sp.nama}"?`)) return;
    shared.setSponsorList(prev => prev.filter(x => x.id !== sp.id));
    const numId = Number(String(sp.id).replace('sp-', ''));
    if (!isNaN(numId)) { try { await supabase.from('sponsor').delete().eq('id', numId); shared.fetchSponsors(); shared.fetchKeuangan(); } catch {} }
  };

  // ===== PENGELUARAN handlers (realtime → tabel `pengeluaran`) =====
  const [pengeluaranForm, setPengeluaranForm] = useState({ nama: '', keterangan: '', jumlah: '' });
  const pengeluaranRows = shared.keuanganList.filter(k => (k.jenis || '').toLowerCase().includes('pengeluaran') || (k.jumlah || 0) < 0);

  const addPengeluaran = async () => {
    if (!pengeluaranForm.nama?.trim() || !pengeluaranForm.jumlah) { alert('Nama & jumlah pengeluaran wajib diisi!'); return; }
    const jumlah = Math.abs(Number(pengeluaranForm.jumlah));
    const entry: KeuanganEntry = { id: -(Date.now()), nama: pengeluaranForm.nama.trim(), jenis: 'pengeluaran', jumlah, keterangan: pengeluaranForm.keterangan || '', created_at: new Date().toISOString() };
    shared.setKeuanganList(prev => [entry, ...prev]);
    setPengeluaranForm({ nama: '', keterangan: '', jumlah: '' });
    try {
      const { error } = await supabase.from('pengeluaran').insert([{ nama: entry.nama, keterangan: entry.keterangan, jumlah }]);
      if (error) throw error;
      shared.fetchKeuangan();
    } catch (e: any) { alert('⚠️ Gagal simpan ke Supabase: ' + (e?.message || e) + '\nPengeluaran tetap tampil lokal & mengurangi saldo.'); }
  };

  const deletePengeluaran = async (k: KeuanganEntry) => {
    if (!confirm(`Hapus pengeluaran "${k.nama}"?`)) return;
    shared.setKeuanganList(prev => prev.filter(x => x.id !== k.id));
    const numId = (k.id || 0) > 0 ? (k.id || 0) - 6000000 : 0;
    if (numId > 0) { try { await supabase.from('pengeluaran').delete().eq('id', numId); shared.fetchKeuangan(); } catch {} }
  };

  // ===== GALLERY handlers (realtime → tabel `gallery`) =====
  const [galleryForm, setGalleryForm] = useState({ title: '', url: '', credit: '', type: 'photo' });
  const [adminGallery, setAdminGallery] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const fetchAdminGallery = async () => {
    setGalleryLoading(true);
    try {
      const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
      if (data) setAdminGallery(data);
    } catch { setAdminGallery([]); }
    setGalleryLoading(false);
  };

  useEffect(() => { if (tab === 'gallery') fetchAdminGallery(); }, [tab]);

  const addGallery = async () => {
    if (!galleryForm.title?.trim() || !galleryForm.url?.trim()) { alert('Judul & URL foto/video wajib diisi!'); return; }
    try {
      const { error } = await supabase.from('gallery').insert([{ title: galleryForm.title.trim(), url: galleryForm.url.trim(), credit: galleryForm.credit || 'Panel Panitia', type: galleryForm.type }]);
      if (error) throw error;
      setGalleryForm({ title: '', url: '', credit: '', type: 'photo' });
      fetchAdminGallery();
      alert('✅ Berhasil ditambahkan ke Galeri (realtime)!');
    } catch (e: any) { alert('⚠️ Gagal simpan: ' + (e?.message || e)); }
  };

  const deleteGallery = async (id: number) => {
    if (!confirm('Hapus item galeri ini?')) return;
    try { await supabase.from('gallery').delete().eq('id', id); fetchAdminGallery(); } catch (e: any) { alert('⚠️ ' + (e?.message || e)); }
  };

  // ===== REPORT DOWNLOAD GENERATOR =====
  const downloadReport = (type: 'keuangan' | 'peserta' | 'donasi' | 'inventory') => {
    let text = `========================================\nLaporan Resmi HUT RI ke-81 — Perumahan Ciptaland Blok Mawar\nTipe: Laporan ${type.toUpperCase()}\nWaktu Unduh: ${new Date().toLocaleString('id-ID')}\n========================================\n\n`;
    if (type === 'keuangan') {
      text += `Pemasukan: ${formatRupiah(totalPemasukan)}\nPengeluaran: ${formatRupiah(totalPengeluaran)}\nSaldo Bersih: ${formatRupiah(totalPemasukan - totalPengeluaran)}\n\n`;
      text += `No | Jenis | Nama | Jumlah | Keterangan\n`;
      keuanganList.forEach((k, idx) => {
        text += `${idx + 1} | ${getJenisLabel(k.jenis)} | ${k.nama} | ${formatRupiah(k.jumlah)} | ${k.keterangan || '-'}\n`;
      });
    } else if (type === 'peserta') {
      text += `Total Peserta: ${participants.length}\n\n`;
      text += `No | ID | Nama | No. Rumah/RT | HP | Lomba Diikuti\n`;
      participants.forEach((p, idx) => {
        text += `${idx + 1} | ${p.id} | ${p.name} | ${p.rt} | ${p.hp} | ${p.lomba.join(', ')}\n`;
      });
    } else if (type === 'donasi') {
      const donasiOnly = keuanganList.filter(k => k.jenis === 'donasi' || k.jenis === 'cash' || k.jenis === 'donatur');
      text += `Total Donasi Masuk: ${formatRupiah(donasiOnly.reduce((s, k) => s + k.jumlah, 0))}\n\n`;
      text += `No | Nama Pembayar | Jumlah | Metode / Alamat\n`;
      donasiOnly.forEach((k, idx) => {
        text += `${idx + 1} | ${k.nama} | ${formatRupiah(k.jumlah)} | ${k.keterangan || '-'}\n`;
      });
    } else if (type === 'inventory') {
      text += `Total Barang: ${inventoryList.length}\n\n`;
      text += `ID | Nama Barang | Jumlah | Kategori | Keterangan\n`;
      inventoryList.forEach(item => {
        text += `${item.id} | ${item.nama} | ${item.jumlah} ${item.satuan} | ${item.kategori} | ${item.keterangan || '-'}\n`;
      });
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-mawar-${type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ===== LOGIN GATE =====
  const handleLogin = () => {
    if (loginUser.toLowerCase().trim() === 'owner' && loginPw === 'owner81') {
      setAuthed(true);
      setIsLiveOwner(true);
      setCurrentUser('Owner (Akses Penuh)');
    } else {
      const found = authorizedUsers.find(u => u.user === loginUser.toLowerCase().trim() && u.pass === loginPw);
      if (found) {
        setAuthed(true);
        setIsLiveOwner(false);
        setCurrentUser(found.nama);
      } else {
        alert('Username atau password salah!');
      }
    }
  };

  if (!authed) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-in">
        <div className="w-16 h-16 bg-[#C1272D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white">🔒</div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Panel Panitia</h2>
        <p className="text-xs text-gray-500 mb-6">HUT RI ke-81 — Blok Mawar</p>
        <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Username" className="w-full border-2 rounded-xl px-4 py-3 text-sm mb-3 focus:border-[#C1272D] outline-none" />
        <input type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)} placeholder="Password" className="w-full border-2 rounded-xl px-4 py-3 text-sm mb-3 focus:border-[#C1272D] outline-none" onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }} />
        <button onClick={handleLogin} className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition">Masuk</button>
        <button onClick={onBack} className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition">← Kembali ke Website</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-white transition">← Kembali</button>
          <div className="h-4 w-px bg-gray-700" />
          <span className="font-bold text-sm">🔒 Panel Panitia</span>
          <span className="hidden sm:inline text-[10px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{APP_BUILD}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-green-500/20 rounded-full px-3 py-1.5">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-green-400"></span></span>
            <span className="text-[10px] text-green-400 font-bold">SINKRON</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">👤 {currentUser}</span>
          {isOwner && <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-full">OWNER</span>}
          <button onClick={() => { setAuthed(false); onBack(); }} className="text-xs bg-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-700">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Status koneksi tabel Supabase */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Database size={15} className="text-slate-600" /> Status Koneksi Supabase
            </h4>
            <button onClick={probeTables} className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-emerald-600 transition"><RefreshCw size={12} /> Scan Ulang</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABLES_PROBE.map(t => {
              const st = tableStatus[t];
              const clickable = st === 'fail';
              const Tag = clickable ? 'button' : 'span';
              return (
                <Tag key={t} {...(clickable ? { onClick: () => setOpenSql(openSql === t ? null : t) } : {})}
                  title={st === 'fail' ? 'Klik untuk lihat SQL pembuat tabel ini' : st === 'ok' ? `Tabel "${t}" terhubung` : 'Memeriksa...'}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
                    st === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    st === 'fail' ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 cursor-pointer' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st === 'ok' ? 'bg-emerald-500' : st === 'fail' ? 'bg-red-500' : 'bg-gray-300 animate-pulse'}`} />
                  {t}
                  {clickable && <span className="text-[9px] opacity-70">{openSql === t ? '▲' : 'SQL'}</span>}
                </Tag>
              );
            })}
          </div>

          {openSql && tableStatus[openSql] === 'fail' && (
            <div className="mt-3 bg-slate-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-slate-300">SQL untuk tabel <span className="text-amber-300 font-mono">"{openSql}"</span> — jalankan di Supabase → SQL Editor → Run</p>
                <button onClick={() => copyTblSql(openSql)} className="flex items-center gap-1 text-[11px] font-bold bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded-lg transition">
                  {copiedTbl === openSql ? <><Check size={11} className="text-emerald-400" /> Tersalin!</> : <><Copy size={11} /> Salin</>}
                </button>
              </div>
              <pre className="text-[10px] text-emerald-300 font-mono whitespace-pre-wrap break-all leading-relaxed">{sqlFor(openSql)}</pre>
            </div>
          )}

          {Object.values(tableStatus).some(s => s === 'fail') && (
            <p className="mt-3 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠️ Klik chip merah untuk menyalin SQL pembuat tabelnya. Setelah dijalankan di Supabase, klik <strong>Scan Ulang</strong> — chip berubah hijau dan data langsung tersinkron realtime.
            </p>
          )}
        </div>

        {/* Report Download Banner */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
            <span>📥</span> Download Dokumen Laporan Panitia
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => downloadReport('keuangan')} className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition">
              📄 Unduh Lap. Keuangan
            </button>
            <button onClick={() => downloadReport('peserta')} className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100 transition">
              👥 Unduh Lap. Peserta
            </button>
            <button onClick={() => downloadReport('donasi')} className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 font-bold text-xs rounded-xl hover:bg-green-100 transition">
              ❤️ Unduh Lap. Donasi
            </button>
            <button onClick={() => downloadReport('inventory')} className="flex items-center justify-center gap-2 py-3 bg-amber-50 text-amber-700 font-bold text-xs rounded-xl hover:bg-amber-100 transition">
              📦 Unduh Lap. Inventory
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-5 text-center"><div className="text-3xl font-black text-[#C1272D]">{participants.length}</div><div className="text-xs text-gray-500 font-semibold mt-1">Peserta</div></div>
          <div className="bg-white rounded-2xl shadow-sm border p-5 text-center"><div className="text-xl font-black text-green-600">{formatRupiah(totalPemasukan - totalPengeluaran)}</div><div className="text-xs text-gray-500 font-semibold mt-1">Saldo Bersih</div></div>
          <div className="bg-white rounded-2xl shadow-sm border p-5 text-center"><div className="text-xl font-black text-blue-600">{formatRupiah(totalByJenis('iuran'))}</div><div className="text-xs text-gray-500 font-semibold mt-1">Iuran</div></div>
          <div className="bg-white rounded-2xl shadow-sm border p-5 text-center"><div className="text-xl font-black text-pink-600">{formatRupiah(totalByJenis('donasi') + totalByJenis('cash'))}</div><div className="text-xs text-gray-500 font-semibold mt-1">Donasi</div></div>
          <div className="bg-white rounded-2xl shadow-sm border p-5 text-center"><div className="text-xl font-black text-red-600">{formatRupiah(totalPengeluaran)}</div><div className="text-xs text-gray-500 font-semibold mt-1">Pengeluaran</div></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('peserta')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'peserta' ? 'bg-[#C1272D] text-white shadow' : 'bg-white text-gray-600 border'}`}>📝 Peserta ({participants.length})</button>
          <button onClick={() => setTab('keuangan')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'keuangan' ? 'bg-gray-900 text-white shadow' : 'bg-white text-gray-600 border'}`}>💰 Keuangan ({keuanganList.length})</button>
          <button onClick={() => setTab('inventory')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'inventory' ? 'bg-amber-600 text-white shadow' : 'bg-white text-gray-600 border'}`}>📦 Inventory ({inventoryList.length})</button>
          <button onClick={() => setTab('talenta')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'talenta' ? 'bg-purple-600 text-white shadow' : 'bg-white text-gray-600 border'}`}>🌙 Talenta ({shared.talentaList.length})</button>
          <button onClick={() => setTab('sponsor')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'sponsor' ? 'bg-fuchsia-600 text-white shadow' : 'bg-white text-gray-600 border'}`}><Handshake size={15} /> Sponsor ({shared.sponsorList.length})</button>
          <button onClick={() => setTab('pengeluaran')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'pengeluaran' ? 'bg-orange-600 text-white shadow' : 'bg-white text-gray-600 border'}`}><Receipt size={15} /> Pengeluaran ({pengeluaranRows.length})</button>
          <button onClick={() => setTab('gallery')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'gallery' ? 'bg-cyan-600 text-white shadow' : 'bg-white text-gray-600 border'}`}><Images size={15} /> Gallery</button>
          <button onClick={() => setTab('panitia')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'panitia' ? 'bg-[#C1272D] text-white shadow' : 'bg-white text-gray-600 border'}`}>👥 Susunan ({shared.panitiaCore.length})</button>
          <button onClick={() => setTab('pelaksana')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'pelaksana' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-600 border'}`}>🧑‍‍ Pelaksana ({shared.pelaksanaRows.length})</button>
          <button onClick={() => setTab('rundown')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'rundown' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-600 border'}`}>📋 Rundown ({shared.rundownRows.length})</button>
          <button onClick={() => { setInfoForm(shared.infoAcara); setTab('info'); }} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'info' ? 'bg-rose-600 text-white shadow' : 'bg-white text-gray-600 border'}`}>🎪 Info Acara</button>
          <button onClick={() => setTab('musik')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition ${tab === 'musik' ? 'bg-fuchsia-600 text-white shadow' : 'bg-white text-gray-600 border'}`}><Music size={15} /> Musik ({shared.musicTracks.filter(t => t.custom).length})</button>
          <button onClick={() => { shared.fetchParticipants(); shared.fetchKeuangan(); shared.fetchInventory(); }} className="ml-auto px-4 py-2.5 rounded-xl text-sm font-bold bg-white border text-gray-600 hover:bg-gray-50">🔄 Refresh</button>
        </div>

        {/* ===== PESERTA TAB ===== */}
        {tab === 'peserta' && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-b bg-gray-50/50">
              <input value={searchP} onChange={e => setSearchP(e.target.value)} placeholder="🔍 Cari peserta..." className="flex-1 border rounded-xl px-4 py-2.5 text-sm w-full sm:w-auto outline-none focus:ring-2 focus:ring-[#C1272D]/30" />
              <button onClick={() => setPesertaModal({ mode: 'add', data: { nama: '', telepon: '', rt: '', lomba: '', catatan: '' } })} className="text-xs font-bold px-4 py-2.5 bg-[#C1272D] text-white rounded-xl hover:bg-red-700 transition">+ Tambah Peserta</button>
            </div>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-800 text-white"><tr>
                  <th className="px-3 py-3 text-left text-xs">No</th><th className="px-3 py-3 text-left text-xs">ID</th><th className="px-3 py-3 text-left text-xs">Nama</th><th className="px-3 py-3 text-left text-xs">Telepon</th><th className="px-3 py-3 text-left text-xs">RT</th><th className="px-3 py-3 text-left text-xs">Lomba</th><th className="px-3 py-3 text-left text-xs">Waktu</th><th className="px-3 py-3 text-center text-xs w-24">Aksi</th>
                </tr></thead>
                <tbody>
                  {filteredPeserta.length === 0 ? <tr><td colSpan={8} className="text-center py-12 text-gray-400">Tidak ada data</td></tr> : filteredPeserta.map((p, i) => (
                    <tr key={p.id + i} className={`border-b hover:bg-red-50/40 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-3 py-2.5 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2.5"><span className="font-mono text-[11px] font-bold text-[#C1272D] bg-red-50 px-1.5 py-0.5 rounded">{p.id}</span></td>
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{p.name}</td>
                      <td className="px-3 py-2.5 text-xs font-mono">{p.hp}</td>
                      <td className="px-3 py-2.5 text-xs">{p.rt}</td>
                      <td className="px-3 py-2.5 text-xs max-w-[200px] truncate">{p.lomba.join(', ')}</td>
                      <td className="px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap">{p.waktu}</td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setPesertaModal({ mode: 'edit', data: { id: p.id, dbId: p.dbId, nama: p.name, telepon: p.hp, rt: p.rt, lomba: p.lomba.join(', '), catatan: p.catatan } })} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100">✏️</button>
                          <button onClick={() => handleDeletePeserta(p)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t text-[11px] text-gray-400">Total: <strong className="text-gray-600">{filteredPeserta.length}</strong> peserta — ↔ Sinkron dengan Tabel Real-Time</div>
          </div>
        )}

        {/* ===== KEUANGAN TAB ===== */}
        {tab === 'keuangan' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-4">
              {jenisOptions.map(o => (<div key={o.value} className={`${o.color} rounded-xl p-3 text-center`}><div className="text-xs font-bold opacity-70">{o.label}</div><div className="font-black text-sm mt-1">{formatRupiah(totalByJenis(o.value))}</div></div>))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-b bg-gray-50/50">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  <button onClick={() => setFilterJenis('semua')} className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${filterJenis === 'semua' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>Semua</button>
                  {jenisOptions.map(o => <button key={o.value} onClick={() => setFilterJenis(o.value)} className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${filterJenis === o.value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>{o.label}</button>)}
                </div>
                <button onClick={() => setKeuanganModal({ mode: 'add', data: { nama: '', jenis: 'iuran', jumlah: 0, keterangan: '' } })} className="text-xs font-bold px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800">+ Tambah Dana</button>
              </div>
              <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800 text-white"><tr>
                    <th className="px-3 py-3 text-left text-xs">Jenis</th><th className="px-3 py-3 text-left text-xs">Nama</th><th className="px-3 py-3 text-right text-xs">Jumlah</th><th className="px-3 py-3 text-left text-xs">Keterangan</th><th className="px-3 py-3 text-left text-xs">Waktu</th><th className="px-3 py-3 text-center text-xs w-24">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {filteredKeuangan.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">Tidak ada data</td></tr> : filteredKeuangan.map((k, i) => (
                      <tr key={(k.id || '') + '' + i} className={`border-b hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2.5"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getJenisStyle(k.jenis)}`}>{getJenisLabel(k.jenis)}</span></td>
                        <td className="px-3 py-2.5 font-semibold text-gray-800">{k.nama}</td>
                        <td className={`px-3 py-2.5 text-right font-bold ${categorizeKeuangan(k) === 'pengeluaran' ? 'text-red-600' : (k.keterangan || '').startsWith('[BARANG]') ? 'text-amber-600' : 'text-green-700'}`}>
                          {categorizeKeuangan(k) === 'pengeluaran' ? `- ${formatRupiah(k.jumlah)}`
                            : (k.keterangan || '').startsWith('[BARANG]') ? <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">📦 Barang{(k.jumlah || 0) > 0 ? ` ±${formatRupiah(k.jumlah)}` : ''}</span>
                            : formatRupiah(k.jumlah)}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-500 max-w-[200px] truncate">{(k.keterangan || '').replace(/^\[BARANG\]\s*/, '') || '-'}</td>
                        <td className="px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap">{k.created_at ? new Date(k.created_at).toLocaleString('id-ID') : '-'}</td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => setKeuanganModal({ mode: 'edit', data: k })} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100">✏️</button>
                            <button onClick={() => handleDeleteKeuangan(k)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(() => {
                const masuk = filteredKeuangan.filter(k => categorizeKeuangan(k) !== 'pengeluaran' && !(k.keterangan || '').startsWith('[BARANG]')).reduce((s, k) => s + (k.jumlah || 0), 0);
                const keluar = filteredKeuangan.filter(k => categorizeKeuangan(k) === 'pengeluaran').reduce((s, k) => s + Math.abs(k.jumlah || 0), 0);
                return (
                  <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
                    <span className="text-gray-500 text-[11px]">{filteredKeuangan.length} transaksi — ↔ Sinkron Hero Dana & Ringkasan Anggaran</span>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="text-green-700">Pemasukan: {formatRupiah(masuk)}</span>
                      <span className="text-red-600">Pengeluaran: {formatRupiah(keluar)}</span>
                      <span className="text-gray-900 text-sm font-black bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">Saldo: {formatRupiah(masuk - keluar)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ===== INVENTORY TAB ===== */}
        {tab === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-b bg-gray-50/50">
              <h4 className="font-bold text-sm text-gray-800">📦 Kelola Inventory & Peralatan Lomba</h4>
              <button onClick={() => setInventoryModal({ mode: 'add', data: { id: '', nama: '', jumlah: 1, satuan: 'Pcs', kategori: 'Alat Lomba', keterangan: '' } })} className="text-xs font-bold px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition">+ Tambah Barang</button>
            </div>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs">ID</th>
                    <th className="px-4 py-3 text-left text-xs">Nama Barang</th>
                    <th className="px-4 py-3 text-center text-xs">Jumlah</th>
                    <th className="px-4 py-3 text-left text-xs">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs">Keterangan</th>
                    <th className="px-4 py-3 text-center text-xs w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryList.map((item, idx) => (
                    <tr key={item.id || idx} className={`border-b hover:bg-amber-50/20 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-[#C1272D] font-bold">{item.id}</td>
                      <td className="px-4 py-2.5 font-semibold text-gray-800">{item.nama}</td>
                      <td className="px-4 py-2.5 text-center"><span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-xs">{item.jumlah} {item.satuan}</span></td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{item.kategori}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500 max-w-[200px] truncate">{item.keterangan || '-'}</td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setInventoryModal({ mode: 'edit', data: item })} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100">✏️</button>
                          <button onClick={() => handleDeleteInventory(item)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== TALENTA TAB ===== */}
        {tab === 'talenta' && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-b bg-gray-50/50">
              <div>
                <h4 className="font-bold text-sm text-gray-800">🌙 Talenta Anak Malam Puncak — 22 Agustus 2026</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Edit langsung di baris, lalu klik "Simpan ke Database"</p>
              </div>
              <div className="flex gap-2">
                <button onClick={addTalenta} className="text-xs font-bold px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">+ Tambah Penampilan</button>
                <button onClick={saveTalentaToDb} className="text-xs font-bold px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">💾 Simpan ke Database</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs w-12">No</th>
                    <th className="px-3 py-3 text-left text-xs">Jenis Penampilan</th>
                    <th className="px-3 py-3 text-left text-xs">Nama Peserta</th>
                    <th className="px-3 py-3 text-left text-xs w-20">Jumlah</th>
                    <th className="px-3 py-3 text-left text-xs w-24">Durasi</th>
                    <th className="px-3 py-3 text-left text-xs">Penanggung Jawab</th>
                    <th className="px-3 py-3 text-left text-xs w-28">Status</th>
                    <th className="px-3 py-3 text-center text-xs w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shared.talentaList.map((t, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/30 transition">
                      <td className="px-3 py-2 text-gray-500 font-mono text-xs">{t.no || idx + 1}</td>
                      <td className="px-3 py-2"><input value={t.jenis} onChange={e => updateTalenta(idx, 'jenis', e.target.value)} placeholder="Jenis" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-200 outline-none" /></td>
                      <td className="px-3 py-2"><input value={t.nama} onChange={e => updateTalenta(idx, 'nama', e.target.value)} placeholder="Nama peserta (pisahkan koma)" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-200 outline-none" /></td>
                      <td className="px-3 py-2"><input value={t.jumlah} onChange={e => updateTalenta(idx, 'jumlah', e.target.value)} placeholder="—" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-200 outline-none" /></td>
                      <td className="px-3 py-2"><input value={t.durasi} onChange={e => updateTalenta(idx, 'durasi', e.target.value)} placeholder="—" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-200 outline-none" /></td>
                      <td className="px-3 py-2"><input value={t.pj} onChange={e => updateTalenta(idx, 'pj', e.target.value)} placeholder="PJ" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-200 outline-none" /></td>
                      <td className="px-3 py-2"><input value={t.status} onChange={e => updateTalenta(idx, 'status', e.target.value)} placeholder="Siap/Latihan" className="w-full border rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-200 outline-none" /></td>
                      <td className="px-3 py-2 text-center"><button onClick={() => deleteTalenta(idx)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* ===== SPONSOR TAB ===== */}
        {tab === 'sponsor' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"><Handshake size={16} className="text-fuchsia-600" /> {editSponsor ? 'Edit Sponsor Mitra' : 'Tambah Sponsor Mitra'}</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={(editSponsor || sponsorForm).nama} onChange={e => editSponsor ? setEditSponsor({ ...editSponsor, nama: e.target.value }) : setSponsorForm({ ...sponsorForm, nama: e.target.value })} placeholder="Nama sponsor * (cth: Apotek Sehat Sentosa)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
                <input value={(editSponsor || sponsorForm).deskripsi} onChange={e => editSponsor ? setEditSponsor({ ...editSponsor, deskripsi: e.target.value }) : setSponsorForm({ ...sponsorForm, deskripsi: e.target.value })} placeholder="Deskripsi (cth: Sponsor doorprize)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
                <input value={(editSponsor || sponsorForm).logo} onChange={e => editSponsor ? setEditSponsor({ ...editSponsor, logo: e.target.value }) : setSponsorForm({ ...sponsorForm, logo: e.target.value })} placeholder="URL logo sponsor (png/jpg)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
                <input value={(editSponsor || sponsorForm).website} onChange={e => editSponsor ? setEditSponsor({ ...editSponsor, website: e.target.value }) : setSponsorForm({ ...sponsorForm, website: e.target.value })} placeholder="Website (opsional)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
              </div>
              {(editSponsor || sponsorForm).logo && (
                <div className="mt-3 flex items-center gap-3 bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-3">
                  <img src={(editSponsor || sponsorForm).logo} alt="Preview logo" className="w-12 h-12 object-contain bg-white rounded-lg border p-1" />
                  <span className="text-xs text-fuchsia-700 font-semibold">Preview logo pada slideshow</span>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={submitSponsor} className="flex items-center gap-1.5 px-5 py-2.5 bg-fuchsia-600 text-white text-xs font-bold rounded-xl hover:bg-fuchsia-700 transition shadow"><Save size={14} /> {editSponsor ? 'Simpan Perubahan' : 'Tambah Sponsor'}</button>
                {editSponsor && <button onClick={() => setEditSponsor(null)} className="px-5 py-2.5 border text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50">Batal Edit</button>}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Daftar Sponsor ({shared.sponsorList.length}) — tampil slideshow realtime di halaman utama</h4>
                <button onClick={() => shared.fetchSponsors()} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-fuchsia-600"><RefreshCw size={13} /> Refresh</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {shared.sponsorList.map(sp => (
                  <div key={sp.id} className="group border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-fuchsia-200 transition">
                    <div className="flex items-center gap-3">
                      {sp.logo ? <img src={sp.logo} alt={sp.nama} className="w-12 h-12 object-contain bg-gray-50 rounded-lg border p-1" /> : <div className="w-12 h-12 rounded-lg bg-fuchsia-50 flex items-center justify-center text-xl">{sp.icon}</div>}
                      <div className="min-w-0 flex-1">
                        <div className={`font-black text-sm truncate ${sp.warna}`}>{sp.nama}</div>
                        <div className="text-[11px] text-gray-500 truncate">{sp.deskripsi}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button onClick={() => setEditSponsor(sp)} className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"><PencilLine size={12} /> Edit</button>
                      <button onClick={() => deleteSponsor(sp)} className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 ml-auto"><Trash2 size={12} /> Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== PENGELUARAN TAB ===== */}
        {tab === 'pengeluaran' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"><Receipt size={16} className="text-orange-600" /> Catat Pengeluaran (pembelian, pembayaran barang & jasa)</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <input value={pengeluaranForm.nama} onChange={e => setPengeluaranForm({ ...pengeluaranForm, nama: e.target.value })} placeholder="Nama pengeluaran * (cth: Sewa Sound System)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-200 outline-none" />
                <input value={pengeluaranForm.keterangan} onChange={e => setPengeluaranForm({ ...pengeluaranForm, keterangan: e.target.value })} placeholder="Keterangan (cth: Toko Maju Jaya)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-200 outline-none" />
                <input type="number" value={pengeluaranForm.jumlah} onChange={e => setPengeluaranForm({ ...pengeluaranForm, jumlah: e.target.value })} placeholder="Jumlah (Rp) *" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-200 outline-none" />
              </div>
              <button onClick={addPengeluaran} className="flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition shadow"><Plus size={14} /> Catat Pengeluaran</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Rincian Pengeluaran ({pengeluaranRows.length}) — Total: <span className="text-orange-600">{formatRupiah(pengeluaranRows.reduce((s, k) => s + Math.abs(k.jumlah || 0), 0))}</span></h4>
                <button onClick={() => shared.fetchKeuangan()} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-orange-600"><RefreshCw size={13} /> Refresh</button>
              </div>
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800 text-white"><tr>
                    <th className="px-4 py-3 text-left text-xs">Nama</th><th className="px-4 py-3 text-left text-xs">Keterangan</th><th className="px-4 py-3 text-right text-xs">Jumlah</th><th className="px-4 py-3 text-left text-xs">Waktu</th><th className="px-4 py-3 text-center text-xs w-16">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {pengeluaranRows.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-xs">Belum ada pengeluaran tercatat</td></tr> : pengeluaranRows.map((k, i) => (
                      <tr key={(k.id || '') + '' + i} className={`border-b hover:bg-orange-50/30 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-2.5 font-semibold text-gray-800">{k.nama}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{k.keterangan || '-'}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-orange-600">- {formatRupiah(k.jumlah)}</td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 whitespace-nowrap">{k.created_at ? new Date(k.created_at).toLocaleString('id-ID') : '-'}</td>
                        <td className="px-4 py-2.5 text-center"><button onClick={() => deletePengeluaran(k)} className="text-red-500 hover:text-red-600"><Trash2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== GALLERY TAB ===== */}
        {tab === 'gallery' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"><Images size={16} className="text-cyan-600" /> Tambah Foto / Video ke Galeri Publik</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={galleryForm.title} onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Judul * (cth: Lomba Balap Karung RT 02)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-200 outline-none" />
                <select value={galleryForm.type} onChange={e => setGalleryForm({ ...galleryForm, type: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-cyan-200 outline-none">
                  <option value="photo">📷 Foto</option>
                  <option value="video">🎬 Video</option>
                </select>
                <input value={galleryForm.url} onChange={e => setGalleryForm({ ...galleryForm, url: e.target.value })} placeholder="URL file foto/video *" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-200 outline-none sm:col-span-2" />
                <input value={galleryForm.credit} onChange={e => setGalleryForm({ ...galleryForm, credit: e.target.value })} placeholder="Kredit / pengunggah (cth: Panitia Dokumentasi)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-200 outline-none" />
              </div>
              <button onClick={addGallery} className="flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-cyan-600 text-white text-xs font-bold rounded-xl hover:bg-cyan-700 transition shadow"><Plus size={14} /> Publish ke Galeri</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Item Galeri di Database ({adminGallery.length})</h4>
                <button onClick={fetchAdminGallery} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-cyan-600"><RefreshCw size={13} /> {galleryLoading ? 'Memuat...' : 'Refresh'}</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {adminGallery.length === 0 ? <div className="col-span-full text-center py-10 text-gray-400 text-xs">Belum ada item galeri di database — tambahkan lewat form di atas.</div> : adminGallery.map(g => (
                  <div key={g.id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                    <div className="aspect-video bg-gray-100 relative">
                      {g.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-2xl">🎬</div>
                      ) : (
                        <img src={g.url} alt={g.title} className="w-full h-full object-cover" loading="lazy" />
                      )}
                      <span className="absolute top-2 right-2 text-[10px] font-bold bg-white/90 text-gray-700 px-2 py-0.5 rounded-full">{g.type === 'video' ? '🎬 Video' : '📷 Foto'}</span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-xs text-gray-800 truncate">{g.title}</div>
                      <div className="text-[10px] text-gray-400 truncate">{g.credit || '-'}</div>
                      <button onClick={() => deleteGallery(g.id)} className="flex items-center gap-1 mt-2 text-[11px] font-bold text-red-500 hover:text-red-600"><Trash2 size={12} /> Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* ===== PANITIA TAB ===== */}
        {tab === 'panitia' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">👥 {editPanitiaRow ? 'Edit Jabatan Panitia' : 'Tambah ke Susunan Panitia'}</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <input value={(editPanitiaRow || panitiaForm).jabatan} onChange={e => editPanitiaRow ? setEditPanitiaRow({ ...editPanitiaRow, jabatan: e.target.value }) : setPanitiaForm({ ...panitiaForm, jabatan: e.target.value })} placeholder="Jabatan * (cth: Wakil Bendahara)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" />
                <input value={(editPanitiaRow || panitiaForm).nama} onChange={e => editPanitiaRow ? setEditPanitiaRow({ ...editPanitiaRow, nama: e.target.value }) : setPanitiaForm({ ...panitiaForm, nama: e.target.value })} placeholder="Nama *" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" />
                <input value={(editPanitiaRow || panitiaForm).hp} onChange={e => editPanitiaRow ? setEditPanitiaRow({ ...editPanitiaRow, hp: e.target.value }) : setPanitiaForm({ ...panitiaForm, hp: e.target.value })} placeholder="No. HP (opsional)" className="border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 outline-none" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={submitPanitia} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#C1272D] text-white text-xs font-bold rounded-xl hover:bg-red-700 transition shadow active:scale-[0.98]"><Save size={14} /> {editPanitiaRow ? 'Simpan Perubahan' : 'Tambah Panitia'}</button>
                {editPanitiaRow && <button onClick={() => setEditPanitiaRow(null)} className="px-5 py-2.5 border text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50">Batal Edit</button>}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Susunan Panitia ({shared.panitiaCore.length}) — tampil di tabel "Susunan Panitia" halaman utama</h4>
                <button onClick={() => shared.fetchPanitia()} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#C1272D]"><RefreshCw size={13} /> Refresh</button>
              </div>
              <div className="overflow-x-auto max-h-[55vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800 text-white"><tr>
                    <th className="px-4 py-3 text-left text-xs w-12">No</th><th className="px-4 py-3 text-left text-xs">Jabatan</th><th className="px-4 py-3 text-left text-xs">Nama</th><th className="px-4 py-3 text-left text-xs">No. HP</th><th className="px-4 py-3 text-center text-xs w-24">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {shared.panitiaCore.map((p, i) => (
                      <tr key={(p as any).id ?? i} className={`border-b hover:bg-red-50/30 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{i + 1}</td>
                        <td className="px-4 py-2.5 font-semibold text-gray-800">{p.jabatan}</td>
                        <td className="px-4 py-2.5">{p.nama}</td>
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">{p.hp || '-'}</td>
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => setEditPanitiaRow(p)} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100"><PencilLine size={12} /></button>
                            <button onClick={() => deletePanitia(p)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* ===== INFO ACARA TAB ===== */}
        {tab === 'info' && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-2xl">
            <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">🎪 Informasi Acara (kartu merah di halaman utama)</h4>
            <div className="space-y-3">
              <div><label className="text-xs font-semibold text-gray-500 block mb-1">Tanggal</label><input value={infoForm.tanggal} onChange={e => setInfoForm({ ...infoForm, tanggal: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-200 outline-none" /></div>
              <div><label className="text-xs font-semibold text-gray-500 block mb-1">Waktu</label><input value={infoForm.waktu} onChange={e => setInfoForm({ ...infoForm, waktu: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-200 outline-none" /></div>
              <div><label className="text-xs font-semibold text-gray-500 block mb-1">Lokasi (Enter untuk baris baru)</label><textarea value={infoForm.lokasi} onChange={e => setInfoForm({ ...infoForm, lokasi: e.target.value })} rows={2} className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-200 outline-none resize-none" /></div>
              <div><label className="text-xs font-semibold text-gray-500 block mb-1">Peserta</label><input value={infoForm.peserta} onChange={e => setInfoForm({ ...infoForm, peserta: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-200 outline-none" /></div>
              <button onClick={saveInfoAcara} className="flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition shadow"><Save size={14} /> Simpan & Sinkronkan</button>
            </div>
          </div>
        )}

        {/* ===== RUNDOWN TAB ===== */}
        {tab === 'rundown' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-4">📋 {editRundown ? 'Edit Baris Rundown' : 'Tambah Baris Rundown'}</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <select value={(editRundown || rundownForm).hari} onChange={e => editRundown ? setEditRundown({ ...editRundown, hari: e.target.value }) : setRundownForm({ ...rundownForm, hari: e.target.value as any })} className="border rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="perlombaan">🏆 Perlombaan (17 Agt)</option>
                  <option value="malam">🌙 Malam Puncak (22 Agt)</option>
                </select>
                <input value={(editRundown || rundownForm).waktu} onChange={e => editRundown ? setEditRundown({ ...editRundown, waktu: e.target.value }) : setRundownForm({ ...rundownForm, waktu: e.target.value })} placeholder="Waktu * (cth: 19:00-19:05)" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input value={(editRundown || rundownForm).icon} onChange={e => editRundown ? setEditRundown({ ...editRundown, icon: e.target.value }) : setRundownForm({ ...rundownForm, icon: e.target.value })} placeholder="Emoji (🎤)" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input value={(editRundown || rundownForm).kegiatan} onChange={e => editRundown ? setEditRundown({ ...editRundown, kegiatan: e.target.value }) : setRundownForm({ ...rundownForm, kegiatan: e.target.value })} placeholder="Kegiatan *" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input value={(editRundown || rundownForm).keterangan} onChange={e => editRundown ? setEditRundown({ ...editRundown, keterangan: e.target.value }) : setRundownForm({ ...rundownForm, keterangan: e.target.value })} placeholder="Keterangan" className="border rounded-xl px-3 py-2.5 text-sm" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={submitRundown} className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition shadow"><Save size={14} /> {editRundown ? 'Simpan Perubahan' : 'Tambah Baris'}</button>
                {editRundown && <button onClick={() => setEditRundown(null)} className="px-5 py-2.5 border text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50">Batal</button>}
              </div>
            </div>
            {(['perlombaan', 'malam'] as const).map(hari => (
              <div key={hari} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50 font-bold text-sm text-gray-800">{hari === 'perlombaan' ? '🏆 Acara Perlombaan — 17 Agustus' : '🌙 Malam Puncak — 22 Agustus'} ({shared.rundownRows.filter(r => r.hari === hari).length})</div>
                <div className="divide-y divide-gray-100 max-h-[40vh] overflow-y-auto">
                  {shared.rundownRows.filter(r => r.hari === hari).map((r, i) => (
                    <div key={r.id ?? i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/40 transition">
                      <span className="font-mono text-xs font-bold text-emerald-700 min-w-[92px]">{r.waktu}</span>
                      <span className="text-base">{r.icon}</span>
                      <div className="flex-1 min-w-0"><div className="font-semibold text-sm text-gray-800 truncate">{r.kegiatan}</div>{r.keterangan && <div className="text-[11px] text-gray-400 truncate">{r.keterangan}</div>}</div>
                      <button onClick={() => setEditRundown(r)} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100"><PencilLine size={12} /></button>
                      <button onClick={() => deleteRundown(r)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  {shared.rundownRows.filter(r => r.hari === hari).length === 0 && <div className="px-4 py-6 text-center text-xs text-gray-400">Belum ada — pakai default siteData sampai Anda menambah baris.</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== PANITIA PELAKSANA TAB ===== */}
        {tab === 'pelaksana' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-4">🧑‍ {editPelaksana ? 'Edit Panitia Pelaksana' : 'Tambah Panitia Pelaksana'}</h4>
              <div className="grid sm:grid-cols-4 gap-3">
                <input value={(editPelaksana || pelaksanaForm).nama} onChange={e => editPelaksana ? setEditPelaksana({ ...editPelaksana, nama: e.target.value }) : setPelaksanaForm({ ...pelaksanaForm, nama: e.target.value })} placeholder="Nama *" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input value={(editPelaksana || pelaksanaForm).jabatan} onChange={e => editPelaksana ? setEditPelaksana({ ...editPelaksana, jabatan: e.target.value }) : setPelaksanaForm({ ...pelaksanaForm, jabatan: e.target.value })} placeholder="Jabatan *" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input value={(editPelaksana || pelaksanaForm).hp} onChange={e => editPelaksana ? setEditPelaksana({ ...editPelaksana, hp: e.target.value }) : setPelaksanaForm({ ...pelaksanaForm, hp: e.target.value })} placeholder="No. HP" className="border rounded-xl px-3 py-2.5 text-sm" />
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 border rounded-xl px-3 py-2.5 cursor-pointer">
                  <input type="checkbox" checked={(editPelaksana || pelaksanaForm).is_core} onChange={e => editPelaksana ? setEditPelaksana({ ...editPelaksana, is_core: e.target.checked }) : setPelaksanaForm({ ...pelaksanaForm, is_core: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  ⭐ Kartu utama
                </label>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={submitPelaksana} className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow"><Save size={14} /> {editPelaksana ? 'Simpan Perubahan' : 'Tambah'}</button>
                {editPelaksana && <button onClick={() => setEditPelaksana(null)} className="px-5 py-2.5 border text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50">Batal</button>}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Panitia Pelaksana ({shared.pelaksanaRows.length}) — tampil di section "PANITIA PELAKSANA"</h4>
                <button onClick={() => shared.fetchPelaksana()} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-indigo-600"><RefreshCw size={13} /> Refresh</button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
                {shared.pelaksanaRows.map((p, i) => (
                  <div key={p.id ?? i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50/40 transition">
                    <span className="text-xs text-gray-400 font-mono w-6">{i + 1}</span>
                    {p.is_core && <span className="text-amber-500">⭐</span>}
                    <div className="flex-1 min-w-0"><div className="font-semibold text-sm text-gray-800 truncate">{p.nama}</div><div className="text-[11px] text-gray-400">{p.jabatan} {p.hp ? `• ${p.hp}` : ''}</div></div>
                    <button onClick={() => setEditPelaksana(p)} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100"><PencilLine size={12} /></button>
                    <button onClick={() => deletePelaksana(p)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"><Trash2 size={12} /></button>
                  </div>
                ))}
                {shared.pelaksanaRows.length === 0 && <div className="px-4 py-6 text-center text-xs text-gray-400">Tabel Supabase kosong — section memakai default siteData sampai Anda menambah data.</div>}
              </div>
            </div>
          </div>
        )}
        {/* ===== MUSIK TAB ===== */}
        {tab === 'musik' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <h4 className="font-bold text-sm text-gray-800 mb-1 flex items-center gap-2"><Music size={15} className="text-fuchsia-600" /> {editMusik ? 'Edit Lagu MP3' : 'Tambah Lagu MP3 ke Playlist'}</h4>
              <p className="text-[11px] text-gray-400 mb-4">Lagu tampil di pemutar musik melayang di semua halaman. Tersimpan di Supabase (tabel <span className="font-mono">musik</span>) + localStorage.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <input value={(editMusik || musikForm).title} onChange={e => editMusik ? setEditMusik({ ...editMusik, title: e.target.value }) : setMusikForm({ ...musikForm, title: e.target.value })} placeholder="Judul lagu *" className="border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
                <input value={(editMusik || musikForm).url} onChange={e => editMusik ? setEditMusik({ ...editMusik, url: e.target.value }) : setMusikForm({ ...musikForm, url: e.target.value })} placeholder="URL file MP3 *" className="border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
                <input value={(editMusik || musikForm).ket} onChange={e => editMusik ? setEditMusik({ ...editMusik, ket: e.target.value }) : setMusikForm({ ...musikForm, ket: e.target.value })} placeholder="Keterangan (opsional)" className="border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-fuchsia-200 outline-none" />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <label className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer ${uploading ? 'bg-gray-300 text-gray-500 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
                  <Music size={14} /> {uploading ? 'Mengunggah…' : '⬆️ Unggah File MP3'}
                  <input type="file" accept="audio/*" disabled={uploading} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadMusik(f); e.target.value = ''; }} />
                </label>
                <button onClick={editMusik ? updateMusik : addMusik} className="flex items-center gap-1.5 px-5 py-2.5 bg-fuchsia-600 text-white text-xs font-bold rounded-xl hover:bg-fuchsia-700 transition shadow"><Save size={14} /> {editMusik ? 'Simpan Perubahan' : 'Simpan dari URL'}</button>
                {editMusik && <button onClick={() => setEditMusik(null)} className="px-5 py-2.5 border text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50">Batal</button>}
              </div>
              <div className="mt-3 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 leading-relaxed space-y-1">
                <p>⬆️ <strong>Paling andal:</strong> klik <strong>Unggah File MP3</strong> — file tersimpan di Supabase Storage dan langsung bisa diputar semua warga.</p>
                <p>🔗 <strong>Alternatif:</strong> tempel URL direct .mp3 → <strong>Simpan dari URL</strong>. Link Google Drive dikonversi otomatis tapi sering diblokir Drive — jangan andalkan.</p>
                <details className="pt-1">
                  <summary className="cursor-pointer font-bold text-gray-600">⚙️ Setup satu kali: buat bucket "musik" (klik untuk SQL)</summary>
                  <pre className="mt-2 text-[9px] text-emerald-700 bg-slate-900 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap">INSERT INTO storage.buckets (id, name, public) VALUES ('musik','musik',true) ON CONFLICT (id) DO NOTHING;{'\n'}CREATE POLICY "musik_read" ON storage.objects FOR SELECT USING (bucket_id='musik');{'\n'}CREATE POLICY "musik_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id='musik');{'\n'}CREATE POLICY "musik_del" ON storage.objects FOR DELETE USING (bucket_id='musik');</pre>
                </details>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 font-bold text-sm text-gray-800">Playlist ({shared.musicTracks.length} lagu — {shared.musicTracks.filter(t => t.custom).length} kustom + {shared.musicTracks.filter(t => !t.custom).length} bawaan)</div>
              <div className="divide-y divide-gray-100">
                {shared.musicTracks.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-fuchsia-50/40 transition">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.custom ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-gray-100 text-gray-400'}`}><Music size={13} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">{i + 1}. {t.title}</div>
                      <div className="text-[11px] text-gray-400 truncate">{t.sub}{t.url ? ` • ${t.url}` : ''}</div>
                    </div>
                    {!t.custom && <span className="text-[9px] font-black text-gray-300 uppercase">Bawaan</span>}
                    {t.custom && (
                      <div className="flex gap-1">
                        <button onClick={() => setEditMusik({ id: t.id, title: t.title, url: t.url, ket: t.sub })} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100"><PencilLine size={12} /></button>
                        <button onClick={() => deleteMusik(t.id)} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"><Trash2 size={12} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORM MODALS */}
      {pesertaModal && <PesertaFormModal key="peserta-form" initial={pesertaModal.data} title={pesertaModal.mode === 'add' ? 'Tambah Peserta Baru' : 'Edit Peserta'} onSave={handleSavePeserta} onCancel={() => setPesertaModal(null)} />}
      {keuanganModal && <KeuanganFormModal key="keuangan-form" initial={keuanganModal.data} title={keuanganModal.mode === 'add' ? 'Tambah Data Keuangan' : 'Edit Data Keuangan'} onSave={handleSaveKeuangan} onCancel={() => setKeuanganModal(null)} />}
      {inventoryModal && <InventoryFormModal key="inventory-form" initial={inventoryModal.data} title={inventoryModal.mode === 'add' ? 'Tambah Barang Baru' : 'Edit Barang'} onSave={handleSaveInventory} onCancel={() => setInventoryModal(null)} />}

      {/* Toast notifikasi sinkronisasi */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] max-w-sm animate-in shadow-2xl rounded-xl border-l-4 px-4 py-3 flex items-start gap-3 ${toast.type === 'ok' ? 'bg-emerald-600 border-emerald-300 text-white' : 'bg-red-600 border-red-300 text-white'}`}>
          <span className="text-lg leading-none mt-0.5">{toast.type === 'ok' ? '' : '⚠️'}</span>
          <p className="text-xs font-semibold leading-relaxed">{toast.msg}</p>
          <button onClick={() => setToast(null)} className="text-white/70 hover:text-white ml-1">✕</button>
        </div>
      )}
    </div>
  );
}
