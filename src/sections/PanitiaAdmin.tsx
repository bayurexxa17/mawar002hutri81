import { useEffect, useState } from 'react';
import { storage, ParticipantDB, DonorDB } from '../utils/storage';

export default function PanitiaAdmin() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'pendaftar' | 'donasi' | 'notif'>('pendaftar');
  const [participants, setParticipants] = useState<ParticipantDB[]>([]);
  const [donors, setDonors] = useState<DonorDB[]>([]);
  const [lastNotif, setLastNotif] = useState<any>(null);

  useEffect(() => {
    setParticipants(storage.getParticipants());
    setDonors(storage.getDonors());
    const auth = localStorage.getItem('hutri-admin-auth');
    if (auth === 'true') setIsAuth(true);
    const notif = localStorage.getItem('hutri-last-wa-notif');
    if (notif) setLastNotif(JSON.parse(notif));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // password default: mawar81 - bisa ganti di env
    const allowed = ['mawar81', 'admin81', 'panitia81', 'greenbay81'];
    if (allowed.includes(password.toLowerCase())) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
    } else {
      alert('Password salah! Hubungi Ketua Panitia.');
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('hutri-admin-auth');
  };

  const handleDeleteParticipant = (id: string) => {
    if (!confirm('Hapus pendaftar ini?')) return;
    const filtered = participants.filter(p => p.id !== id);
    setParticipants(filtered);
    localStorage.setItem('hutri-participants-mawar', JSON.stringify(filtered));
  };

  const handleClearAll = () => {
    if (!confirm('HAPUS SEMUA DATA? Tidak bisa dikembalikan!')) return;
    if (tab === 'pendaftar') {
      localStorage.removeItem('hutri-participants-mawar');
      setParticipants([]);
    } else {
      localStorage.removeItem('hutri-donors-mawar');
      setDonors([]);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C1272D] to-[#8B1D20] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-2xl font-black text-gray-800">Login Panitia</h1>
            <p className="text-sm text-gray-500">HUT RI ke-81 Ciptaland Mawar</p>
          </div>
          <input
            type="password"
            placeholder="Password panitia"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#C1272D] outline-none mb-4"
            required
          />
          <button type="submit" className="w-full bg-[#C1272D] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition">
            Masuk Dashboard
          </button>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-600">
            <strong>Hubungi:</strong> Ketua Panitia 0812-8839-5550 <code>untuk</code> mendapatkan akses login.
          </div>
          <a href="/" className="block text-center text-sm text-gray-400 mt-4 hover:text-[#C1272D]">← Kembali ke Website</a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EB]">
      {/* Header Admin */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-[#C1272D]">📊 Dashboard Panitia - HUT RI 81</h1>
            <p className="text-xs text-gray-500">RT 002/014 Ciptaland Mawar • Data tersimpan di browser ini (localStorage)</p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Lihat Website</a>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-[#C1272D] rounded-lg text-sm hover:bg-red-100">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">TOTAL PENDAFTAR</div>
            <div className="text-2xl font-black">{participants.length}</div>
            <div className="text-xs text-green-600">✅ Live dari localStorage</div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">TOTAL DONASI</div>
            <div className="text-2xl font-black">Rp {donors.reduce((a,b)=>a+b.jumlah,0).toLocaleString('id-ID')}</div>
            <div className="text-xs text-gray-500">{donors.length} donatur</div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">DATABASE</div>
            <div className="text-lg font-bold">localStorage</div>
            <div className="text-xs text-amber-600">⚠️ Per-browser, belum cloud</div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">AKSI CEPAT</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => storage.exportCSV(tab === 'pendaftar' ? 'participants' : 'donors')} className="text-xs bg-[#C1272D] text-white px-3 py-1.5 rounded-full">📥 Export CSV</button>
              <button onClick={handleClearAll} className="text-xs bg-gray-200 px-3 py-1.5 rounded-full">🗑️ Clear</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setTab('pendaftar')} className={`px-5 py-2.5 rounded-full font-bold text-sm ${tab==='pendaftar' ? 'bg-[#C1272D] text-white' : 'bg-white border'}`}>📝 Pendaftar ({participants.length})</button>
          <button onClick={()=>setTab('donasi')} className={`px-5 py-2.5 rounded-full font-bold text-sm ${tab==='donasi' ? 'bg-[#C1272D] text-white' : 'bg-white border'}`}>❤️ Donasi ({donors.length})</button>
          <button onClick={()=>setTab('notif')} className={`px-5 py-2.5 rounded-full font-bold text-sm ${tab==='notif' ? 'bg-[#C1272D] text-white' : 'bg-white border'}`}>🔔 Setup Notifikasi</button>
        </div>

        {/* Table Pendaftar */}
        {tab === 'pendaftar' && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-bold">Daftar Peserta Lomba</h3>
              <div className="flex gap-2">
                <button onClick={()=>storage.exportCSV('participants')} className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg">Export Excel/CSV</button>
              </div>
            </div>
            {participants.length===0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                Belum ada pendaftar. Suruh warga daftar lewat Tab Pendaftaran di website.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#C1272D] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Nama & HP</th>
                      <th className="px-4 py-3 text-left">RT/Blok</th>
                      <th className="px-4 py-3 text-left">Lomba Diikuti</th>
                      <th className="px-4 py-3 text-left">Waktu</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p,i)=>(
                      <tr key={p.id} className={i%2===0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                        <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                        <td className="px-4 py-3"><div className="font-bold">{p.name}</div><div className="text-xs text-gray-500">{p.hp}</div></td>
                        <td className="px-4 py-3">{p.rt}</td>
                        <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{p.lomba.map(l=><span key={l} className="bg-red-50 text-[#C1272D] text-xs px-2 py-1 rounded-full">{l}</span>)}</div>{p.catatan && <div className="text-xs text-gray-500 mt-1">Catatan: {p.catatan}</div>}</td>
                        <td className="px-4 py-3 text-xs">{p.waktu}</td>
                        <td className="px-4 py-3 text-center flex gap-1 justify-center">
                          <a href={`https://wa.me/${p.hp.replace(/[^0-9]/g,'')}?text=Halo%20${encodeURIComponent(p.name)}%20terima%20kasih%20sudah%20daftar%20lomba%20${encodeURIComponent(p.lomba.join(', '))}%20HUT%20RI%2081`} target="_blank" className="bg-green-500 text-white p-2 rounded-full text-xs" title="WA Peserta">💬</a>
                          <button onClick={()=>handleDeleteParticipant(p.id)} className="bg-red-100 text-red-600 p-2 rounded-full text-xs">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'donasi' && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-bold">Daftar Donatur</h3>
              <button onClick={()=>storage.exportCSV('donors')} className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg">Export CSV</button>
            </div>
            {donors.length===0 ? (
              <div className="p-12 text-center text-gray-400"><div className="text-5xl mb-3">💝</div>Belum ada donasi.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#C1272D] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Nama</th>
                      <th className="px-4 py-3 text-right">Jumlah</th>
                      <th className="px-4 py-3 text-left">Pesan</th>
                      <th className="px-4 py-3 text-left">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((d,i)=>(
                      <tr key={d.id} className={i%2===0 ? 'bg-[#F9F5EB]' : 'bg-white'}>
                        <td className="px-4 py-3 text-xs font-mono">{d.id}</td>
                        <td className="px-4 py-3"><div className="font-bold">{d.name}</div><div className="text-xs text-gray-500">{d.alamat}</div></td>
                        <td className="px-4 py-3 text-right font-bold text-green-700">Rp {d.jumlah.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3 text-xs">{d.pesan}</td>
                        <td className="px-4 py-3 text-xs">{d.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'notif' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-lg mb-3">🔔 Cara Panitia Dapat Notifikasi</h3>
              <div className="space-y-4 text-sm">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
                  <strong>Saat ini (localStorage):</strong> Data hanya tersimpan di HP/laptop warga yang mendaftar. Panitia harus minta warga screenshot atau buka <code>?admin=mawar81</code> di HP yang sama.
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-bold">Solusi 1: Google Sheets (GRATIS, Recommended untuk RT)</div>
                  <ol className="list-decimal ml-5 mt-2 space-y-1 text-gray-600">
                    <li>Buat Google Sheet baru</li>
                    <li>Extensions → Apps Script → paste kode dari file <code>PANITIA_SETUP.md</code></li>
                    <li>Deploy → Web App → Anyone → Copy URL</li>
                    <li>Di Cloudflare Pages → Settings → Environment Variables → Tambah <code>VITE_GOOGLE_SHEET_URL</code> = URL tadi</li>
                    <li>Redeploy, semua pendaftar baru otomatis masuk Google Sheet</li>
                  </ol>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-bold">Solusi 2: WhatsApp Gateway (Otomatis WA)</div>
                  <p className="text-gray-600 mt-1">Daftar di Fonnte.com / Wablas.com, dapat API key, lalu semua pendaftaran akan auto WA ke 3 nomor panitia.</p>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="font-bold">Solusi 3: Database Beneran (Supabase - Gratis)</div>
                  <p className="text-gray-600 mt-1">Butuh setup Supabase project, ganti `storage.ts` pakai Supabase client. Saya bisa buatkan kalau diminta.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-lg mb-3">📱 Link WA Notifikasi Terakhir</h3>
              {!lastNotif ? <p className="text-gray-400 text-sm">Belum ada pendaftar baru.</p> : (
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-gray-500">Pendaftar terakhir:</div>
                    <div className="font-bold">{lastNotif.p.name} - {lastNotif.p.lomba.join(', ')}</div>
                  </div>
                  <div className="space-y-2">
                    {lastNotif.waLinks.map((link: string, i: number) => (
                      <a key={i} href={link} target="_blank" className="block w-full bg-green-500 text-white text-center py-2.5 rounded-lg font-bold text-sm">
                        Kirim WA ke Panitia {i+1}
                      </a>
                    ))}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono break-words">
                    {decodeURIComponent(lastNotif.msg.replace(/%0A/g, ' \n'))}
                  </div>
                </div>
              )}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-bold mb-2">Link Admin untuk Panitia:</h4>
                <code className="block bg-black text-green-400 p-3 rounded-lg text-xs">
                  {window.location.origin}?admin=mawar81
                </code>
                <p className="text-xs text-gray-500 mt-2">Bagikan link ini ke grup WA panitia. Password: mawar81</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
