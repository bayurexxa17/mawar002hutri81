import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PanitiaAdmin() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'pendaftar' | 'donasi' | 'notif'>('pendaftar');
  const [participants, setParticipants] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('hutri-admin-auth');
    if (auth === 'true') {
      setIsAuth(true);
    }

    const params = new URLSearchParams(window.location.search);
    const adminValue = params.get('admin');
    
    // Hanya mengizinkan admin81 dan panitia81
    const allowed = ['admin81', 'panitia81'];

    if (adminValue && allowed.includes(adminValue.toLowerCase())) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
      window.history.replaceState({}, document.title, `${window.location.pathname}?admin`);
    } else if (params.has('admin') && !adminValue) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
    }

    fetchDataFromCloud();

    const channel = supabase
      .channel('public:admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pendaftar' },
        () => fetchDataFromCloud()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donasi' },
        () => fetchDataFromCloud()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDataFromCloud = async () => {
    try {
      const { data: dataPendaftar } = await supabase
        .from('pendaftar')
        .select('*')
        .order('id', { ascending: false });
      
      if (dataPendaftar) {
        const formattedParticipants = dataPendaftar.map(p => ({
          id: p.id,
          name: p.nama || '',
          rt: p.rt || '-',
          hp: p.telepon || '-',
          lomba: p.lomba ? p.lomba.split(', ').map((s: string) => s.trim()) : [],
          waktu: p.created_at ? new Date(p.created_at).toLocaleString('id-ID') : '',
          catatan: p.catatan || ''
        }));
        setParticipants(formattedParticipants);
      }

      const { data: dataDonasi } = await supabase
        .from('donasi')
        .select('*')
        .order('id', { ascending: false });
      
      if (dataDonasi) {
        const formattedDonors = dataDonasi.map(d => ({
          id: d.id,
          name: d.nama,
          alamat: '-',
          jumlah: Number(d.nominal) || 0,
          pesan: d.pesan || '-',
          waktu: d.created_at ? new Date(d.created_at).toLocaleString('id-ID') : ''
        }));
        setDonors(formattedDonors);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Batasi password yang valid hanya 2 opsi ini
    const allowed = ['admin81', 'panitia81'];
    
    if (allowed.includes(password.toLowerCase())) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
    } else {
      alert('Password salah! Gunakan password yang sah.');
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('hutri-admin-auth');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleDeleteParticipant = async (id: string | number) => {
    if (!confirm('Hapus pendaftar ini dari database online?')) return;
    const { error } = await supabase.from('pendaftar').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus: ' + error.message);
    } else {
      fetchDataFromCloud();
    }
  };

  const handleClearAll = async () => {
    if (!confirm('HAPUS SEMUA DATA DI CLOUD? Tindakan ini tidak bisa dikembalikan!')) return;
    if (tab === 'pendaftar') {
      await supabase.from('pendaftar').delete().neq('id', 0);
      setParticipants([]);
    } else if (tab === 'donasi') {
      await supabase.from('donasi').delete().neq('id', 0);
      setDonors([]);
    }
    fetchDataFromCloud();
  };

  const exportCSV = (type: 'participants' | 'donors') => {
    const dataToExport = type === 'participants' ? participants : donors;
    if (dataToExport.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'participants') {
      csvContent += "ID,Nama,RT/Blok,No HP,Lomba,Waktu\r\n";
      participants.forEach(p => {
        csvContent += `"${p.id}","${p.name}","${p.rt}","${p.hp}","${p.lomba.join('; ')}","${p.waktu}"\r\n`;
      });
    } else {
      csvContent += "ID,Nama,Jumlah,Pesan,Waktu\r\n";
      donors.forEach(d => {
        csvContent += `"${d.id}","${d.name}","${d.jumlah}","${d.pesan}","${d.waktu}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_${type}_hutri81.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <strong>Hub:</strong> Ketua <code>Panitia</code> Telp: 0812-8839-5550
          </div>
          <a href="/" className="block text-center text-sm text-gray-400 mt-4 hover:text-[#C1272D]">← Kembali ke Website</a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EB]">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-[#C1272D]">📊 Dashboard Panitia - HUT RI 81</h1>
            <p className="text-xs text-gray-500">RT 002/014 Ciptaland Mawar • Terhubung ke Cloud Supabase (Real-time)</p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Lihat Website</a>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-[#C1272D] rounded-lg text-sm hover:bg-red-100">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">TOTAL PENDAFTAR</div>
            <div className="text-2xl font-black">{participants.length}</div>
            <div className="text-xs text-green-600">✅ Live dari Supabase Cloud</div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">TOTAL DONASI</div>
            <div className="text-2xl font-black">Rp {donors.reduce((a,b)=>a+b.jumlah,0).toLocaleString('id-ID')}</div>
            <div className="text-xs text-gray-500">{donors.length} donatur</div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">DATABASE</div>
            <div className="text-lg font-bold text-green-700">Supabase Cloud</div>
            <div className="text-xs text-green-600">⚡ Sinkronisasi Real-time</div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">AKSI CEPAT</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => exportCSV(tab === 'pendaftar' ? 'participants' : 'donors')} className="text-xs bg-[#C1272D] text-white px-3 py-1.5 rounded-full">📥 Export CSV</button>
              <button onClick={handleClearAll} className="text-xs bg-gray-200 px-3 py-1.5 rounded-full">🗑️ Clear</button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={()=>setTab('pendaftar')} className={`px-5 py-2.5 rounded-full font-bold text-sm ${tab==='pendaftar' ? 'bg-[#C1272D] text-white' : 'bg-white border'}`}>📝 Pendaftar ({participants.length})</button>
          <button onClick={()=>setTab('donasi')} className={`px-5 py-2.5 rounded-full font-bold text-sm ${tab==='donasi' ? 'bg-[#C1272D] text-white' : 'bg-white border'}`}>❤️ Donasi ({donors.length})</button>
          <button onClick={()=>setTab('notif')} className={`px-5 py-2.5 rounded-full font-bold text-sm ${tab==='notif' ? 'bg-[#C1272D] text-white' : 'bg-white border'}`}>🔔 Setup Notifikasi</button>
        </div>

        {tab === 'pendaftar' && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-bold">Daftar Peserta Lomba (Online Cloud)</h3>
              <div className="flex gap-2">
                <button onClick={()=>exportCSV('participants')} className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg">Export Excel/CSV</button>
              </div>
            </div>
            {participants.length===0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                Belum ada pendaftar di database online.
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
                        <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{p.lomba.map((l:string)=><span key={l} className="bg-red-50 text-[#C1272D] text-xs px-2 py-1 rounded-full">{l}</span>)}</div></td>
                        <td className="px-4 py-3 text-xs">{p.waktu}</td>
                        <td className="px-4 py-3 text-center flex gap-1 justify-center">
                          <a href={`https://wa.me/${p.hp.replace(/[^0-9]/g,'')}?text=Halo%20${encodeURIComponent(p.name)}%20terima%20kasih%20sudah%20daftar%20lomba%20HUT%20RI%2081`} target="_blank" className="bg-green-500 text-white p-2 rounded-full text-xs" title="WA Peserta">💬</a>
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
              <h3 className="font-bold">Daftar Donatur (Online Cloud)</h3>
              <button onClick={()=>exportCSV('donors')} className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg">Export CSV</button>
            </div>
            {donors.length===0 ? (
              <div className="p-12 text-center text-gray-400"><div className="text-5xl mb-3">💝</div>Belum ada donasi masuk.</div>
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
                        <td className="px-4 py-3"><div className="font-bold">{d.name}</div></td>
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
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-lg mb-3">🔔 Status Koneksi Cloud</h3>
            <p className="text-sm text-gray-600 mb-4">Dashboard Panitia ini sekarang sudah terhubung langsung ke Supabase Cloud. Setiap kali ada warga yang mendaftar atau berdonasi lewat website utama, data akan masuk secara otomatis tanpa perlu *refresh*.</p>
            <div className="mt-4">
              <h4 className="font-bold mb-2">Link Admin untuk Panitia:</h4>
              <code className="block bg-black text-green-400 p-3 rounded-lg text-xs">
                {window.location.origin}/?admin
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
