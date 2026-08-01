import { useState, useEffect, memo } from 'react';
import { supabase } from '../utils/supabaseClient';
import { formatRupiah } from '../data/siteData';
import type { Participant, KeuanganEntry, SharedData, InventoryItem } from '../App';
import { Handshake, Receipt, Images, Plus, Trash2, Save, PencilLine, RefreshCw } from 'lucide-react';

interface Props { onBack: () => void; shared: SharedData; }

const jenisOptions = [
  { value: 'iuran', label: '💰 Iuran Warga', color: 'bg-blue-100 text-blue-700' },
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
  const [keterangan, setKeterangan] = useState(initial.keterangan || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-900 px-6 py-4 rounded-t-2xl flex justify-between">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="text-white/70 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Jenis</label>
            <select value={jenis} onChange={e => setJenis(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-gray-300 outline-none">
              {jenisOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Nama Pembayar / Penerima *</label>
            <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 outline-none" autoFocus /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Jumlah (Rp) *</label>
            <input type="number" value={jumlah || ''} onChange={e => setJumlah(Number(e.target.value))} placeholder="50000" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 outline-none" /></div>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Keterangan / Rincian</label>
            <input value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Keterangan opsional" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 outline-none" /></div>
          <div className="flex gap-2 pt-3">
            <button onClick={onCancel} className="flex-1 py-2.5 border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={() => { if (!nama || !jumlah) { alert('Nama dan Jumlah wajib diisi!'); return; } onSave({ ...initial, nama, jenis, jumlah, keterangan }); }} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">Simpan</button>
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
  const [tab, setTab] = useState<'peserta' | 'keuangan' | 'inventory' | 'talenta' | 'sponsor' | 'pengeluaran' | 'gallery'>('peserta');
  const [searchP, setSearchP] = useState('');
  const [filterJenis, setFilterJenis] = useState('semua');

  // Modal states
  const [pesertaModal, setPesertaModal] = useState<{ mode: 'add' | 'edit'; data: any } | null>(null);
  const [keuanganModal, setKeuanganModal] = useState<{ mode: 'add' | 'edit'; data: KeuanganEntry } | null>(null);
  const [inventoryModal, setInventoryModal] = useState<{ mode: 'add' | 'edit'; data: InventoryItem } | null>(null);

  const authorizedUsers = [
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
          .then(() => shared.fetchParticipants()).catch(() => {});
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
        .then(() => shared.fetchParticipants()).catch(() => {});
    }
  };

  const handleDeletePeserta = (p: Participant) => {
    if (!confirm(`Hapus "${p.name}"?`)) return;
    shared.setParticipants(prev => prev.filter(x => x.id !== p.id));
    if (p.dbId && p.dbId > 0) Promise.resolve(supabase.from('pendaftar').delete().eq('id', p.dbId)).then(() => shared.fetchParticipants()).catch(() => {});
  };

  const handleSaveKeuangan = (k: KeuanganEntry) => {
    setDbError('');
    if (k.id && k.id > 0) {
      // REPLACE / EDIT MODE: Find and update existing keuangan entry
      const updated = keuanganList.map(x => x.id === k.id ? k : x);
      shared.setKeuanganList(updated);
      shared.setTotalDana(updated.reduce((s, x) => s + (x.jenis === 'pengeluaran' ? -x.jumlah : x.jumlah), 0));
      saveToLocal(updated);
      setKeuanganModal(null);
      // Supabase Update
      Promise.resolve(supabase.from('keuangan').update({ nama: k.nama, jenis: k.jenis, jumlah: k.jumlah, keterangan: k.keterangan }).eq('id', k.id))
        .then((res: any) => { if (!res.error) shared.fetchKeuangan(); }).catch(() => {});
    } else {
      // ADD MODE: Insert new entry
      const newK: KeuanganEntry = { ...k, id: -(Date.now()), created_at: new Date().toISOString() };
      const updated = [newK, ...keuanganList];
      shared.setKeuanganList(updated);
      shared.setTotalDana(updated.reduce((s, x) => s + (x.jenis === 'pengeluaran' ? -x.jumlah : x.jumlah), 0));
      saveToLocal(updated);
      setKeuanganModal(null);
      // Supabase Insert
      Promise.resolve(supabase.from('keuangan').insert([{ nama: k.nama, jenis: k.jenis, jumlah: k.jumlah, keterangan: k.keterangan }]))
        .then((res: any) => { if (!res.error) shared.fetchKeuangan(); }).catch(() => {});
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
      supabase.from('keuangan').delete().eq('id', k.id).then(() => shared.fetchKeuangan());
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

  const [dbError, setDbError] = useState('');

  const testKeuanganTable = async () => {
    setDbError('Testing...');
    try {
      const { data, error: selErr } = await supabase.from('keuangan').select('*').limit(1);
      if (selErr) {
        setDbError(`SELECT gagal: ${selErr.message}`);
        return;
      }
      const { error: insErr } = await supabase.from('keuangan').insert([{ nama: 'TEST', jenis: 'donasi', jumlah: 0, keterangan: 'Test' }]);
      if (insErr) {
        setDbError(`INSERT gagal: ${insErr.message}`);
        return;
      }
      setDbError('');
      alert(`✅ Database Keuangan Tersambung!\n\nSELECT: ✅\nINSERT: ✅\nJumlah data: ${data?.length || 0}`);
      shared.fetchKeuangan();
    } catch (e: any) {
      setDbError(`Koneksi Gagal: ${e.message}`);
    }
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
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-green-500/20 rounded-full px-3 py-1.5">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-green-400"></span></span>
            <span className="text-[10px] text-green-400 font-bold">SINKRON</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">👤 {currentUser}</span>
          <button onClick={() => { setAuthed(false); onBack(); }} className="text-xs bg-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-700">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Supabase Diagnostic Panel (ONLY FOR OWNER) */}
        {isOwner && (
          <div className="bg-[#1e1e24] text-white rounded-2xl p-6 mb-6 shadow-md border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-bold text-sm">Owner Panel — Supabase Database Controls</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Diagnosa & konfigurasi database realtime</p>
                </div>
              </div>
              <button onClick={testKeuanganTable} className="text-xs font-bold px-4 py-2 bg-[#C1272D] text-white rounded-xl hover:bg-red-700 transition">Test Koneksi Database</button>
            </div>
            {dbError && <pre className="text-xs text-red-400 bg-black/40 p-3 rounded-lg overflow-x-auto break-all whitespace-pre-wrap">{dbError}</pre>}
          </div>
        )}

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
                        <td className="px-3 py-2.5 text-right font-bold text-green-700">{formatRupiah(k.jumlah)}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-500 max-w-[200px] truncate">{k.keterangan || '-'}</td>
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
              <div className="p-4 border-t bg-gray-50 flex justify-between items-center text-sm">
                <span className="text-gray-500 text-[11px]">Total: <strong>{filteredKeuangan.length}</strong> — ↔ Sinkron Hero Dana</span>
                <span className="font-black text-green-700 text-lg">{formatRupiah(filteredKeuangan.reduce((s, k) => s + k.jumlah, 0))}</span>
              </div>
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
      </div>

      {/* FORM MODALS */}
      {pesertaModal && <PesertaFormModal key="peserta-form" initial={pesertaModal.data} title={pesertaModal.mode === 'add' ? 'Tambah Peserta Baru' : 'Edit Peserta'} onSave={handleSavePeserta} onCancel={() => setPesertaModal(null)} />}
      {keuanganModal && <KeuanganFormModal key="keuangan-form" initial={keuanganModal.data} title={keuanganModal.mode === 'add' ? 'Tambah Data Keuangan' : 'Edit Data Keuangan'} onSave={handleSaveKeuangan} onCancel={() => setKeuanganModal(null)} />}
      {inventoryModal && <InventoryFormModal key="inventory-form" initial={inventoryModal.data} title={inventoryModal.mode === 'add' ? 'Tambah Barang Baru' : 'Edit Barang'} onSave={handleSaveInventory} onCancel={() => setInventoryModal(null)} />}
    </div>
  );
}
