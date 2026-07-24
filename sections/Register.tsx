import { useState } from 'react';
import { activities } from '../data';
import { submitRegistration, generatePanitiaWALinks } from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    selectedActivities: [] as number[],
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; lomba: string[]; waLinks: any[] } | null>(null);

  const toggleActivity = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(id)
        ? prev.selectedActivities.filter(a => a !== id)
        : [...prev.selectedActivities, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.selectedActivities.length === 0) {
      alert('Pilih minimal 1 lomba!');
      return;
    }

    setIsSubmitting(true);

    const selectedLombaNames = formData.selectedActivities.map(id => {
      const act = activities.find(a => a.id === id);
      return act ? act.title : `Lomba ${id}`;
    });

    const payload = {
      id: `MWR81-${String(Date.now()).slice(-6)}`,
      name: formData.name,
      whatsapp: formData.whatsapp,
      address: formData.address,
      lomba: selectedLombaNames,
      lombaIds: formData.selectedActivities,
      catatan: formData.notes,
      waktu: new Date().toLocaleString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'form-bawah' as const,
    };

    try {
      const res = await submitRegistration(payload);
      
      if (res.success) {
        const waLinks = generatePanitiaWALinks({ ...payload, id: res.id });
        setResult({ id: res.id, lomba: selectedLombaNames, waLinks });
        
        // Reset form
        setFormData({ name: '', whatsapp: '', address: '', selectedActivities: [], notes: '' });
      }
    } catch (err) {
      alert('Gagal mendaftar, coba lagi. Jika masih gagal hubungi panitia via WA.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Jika sudah berhasil daftar, tampilkan bukti
  if (result) {
    return (
      <section id="register" className="py-20 px-4 bg-gradient-to-br from-green-600 via-green-700 to-green-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-600 mb-6">Data kamu sudah masuk ke Database Panitia</p>
            
            <div className="bg-gradient-to-br from-red-50 to-white border-2 border-dashed border-[#C1272D] rounded-2xl p-6 text-left max-w-md mx-auto">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">No. Registrasi</span>
                  <span className="font-black text-[#C1272D]">{result.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-bold">{formData.name || 'Peserta'}</span>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Lomba Diikuti:</div>
                  <div className="flex flex-wrap gap-1">
                    {result.lomba.map(l => (
                      <span key={l} className="bg-red-100 text-[#C1272D] text-xs px-2 py-1 rounded-full font-semibold">{l}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600 font-bold">✅ Terkirim ke Panitia</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-4 text-center">📸 Screenshot bukti ini & tunjukkan saat registrasi ulang jam 06.00 di Fasum</p>
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-gray-800 mb-3">📤 Langkah Terakhir: Konfirmasi ke Panitia (Wajib)</h4>
              <p className="text-xs text-gray-500 mb-4">Klik salah satu tombol WA di bawah untuk konfirmasi otomatis ke panitia</p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {result.waLinks.slice(0, 3).map((wa: any) => (
                  <a
                    key={wa.wa}
                    href={wa.link}
                    target="_blank"
                    className="bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <span>💬</span> WA {wa.name.split('-')[0]}
                  </a>
                ))}
              </div>
              <div className="mt-6 flex gap-3 justify-center">
                <button 
                  onClick={() => setResult(null)}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition"
                >
                  ← Daftar Lagi
                </button>
                <a 
                  href="?admin=mawar81" 
                  target="_blank"
                  className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
                >
                  🔐 Cek Database Panitia
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-red-600 via-red-700 to-red-800 w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm mb-4">
            PENDAFTARAN - TERHUBUNG DATABASE PANITIA
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-2">
            Daftar Lomba Sekarang!
          </h2>
          <div className="w-24 h-1.5 bg-white mx-auto mt-4 sm:mt-6 rounded-full" />
          <p className="text-red-100 mt-3 sm:mt-4 text-xs sm:text-sm px-2">
            Data otomatis masuk ke Google Sheets Panitia + LocalStorage + Notif WA
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-300/30 text-green-100 text-[10px] sm:text-xs px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Server: { (import.meta as any).env?.VITE_GOOGLE_SHEET_URL ? '✅ Google Sheets Connected' : '⚠️ Local Mode (Setup Google Sheet di PANITIA_SETUP.md)' }
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl w-full">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                Alamat (RT/RW) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Contoh: RT 002 / RW 014 - Blok Mawar 12"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                Pilih Lomba <span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-500">({formData.selectedActivities.length} dipilih)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-[300px] sm:max-h-none overflow-y-auto p-1">
                {activities.map((activity) => (
                  <label 
                    key={activity.id} 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left ${
                      formData.selectedActivities.includes(activity.id)
                        ? 'border-red-500 bg-red-50 shadow-sm'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedActivities.includes(activity.id)}
                      onChange={() => toggleActivity(activity.id)}
                      className="w-5 h-5 text-red-600 focus:ring-red-500 rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">{activity.title}</div>
                      <div className="text-[11px] text-gray-500">{activity.prize} • {activity.time}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                Catatan Tambahan
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informasi tambahan (opsional) - misal: alergi, tim, dll"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all resize-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-black text-base sm:text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Mengirim ke Database Panitia...
                </>
              ) : (
                <>
                  📤 Kirim Pendaftaran
                </>
              )}
            </button>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-800">
              <strong>🔗 Alur Data:</strong> Tombol ini akan: 1) Simpan ke LocalStorage (bisa dilihat di ?admin=mawar81) 2) Kirim ke Google Sheets Panitia (jika sudah setup) 3) Generate link WA konfirmasi otomatis ke Ketua Panitia Bayu 0812-8839-5550.
              <br/>Lihat panduan di <code>PANITIA_SETUP.md</code>
            </div>
          </form>

          <div className="mt-8 pt-6 sm:pt-8 border-t-2 border-gray-100">
            <p className="text-gray-600 mb-4 font-medium text-sm text-center">Atau daftar langsung via WhatsApp Panitia:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Penanggung Jawab', sub: 'Eka Rista Y', wa: '6282171299984', phone: '0821-7129-9984' },
                { name: 'Ketua Panitia', sub: 'Bayu S.Permana', wa: '6281288395550', phone: '0812-8839-5550' },
                { name: 'Wakil Ketua', sub: 'Sugiono', wa: '6283183950205', phone: '0831-8395-0205' },
              ].map((contact) => (
                <a
                  key={contact.wa}
                  href={`https://wa.me/${contact.wa}?text=Assalamualaikum%2C%20saya%20ingin%20mendaftar%20lomba%20HUT%20RI%20Ke-81%20Ciptaland%20Mawar`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 border border-green-200 hover:bg-green-100 p-3 rounded-xl transition group"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">💬</div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-gray-800 truncate">{contact.name}</div>
                    <div className="text-[11px] text-gray-600 truncate">{contact.sub}</div>
                    <div className="text-[10px] text-green-700 font-bold">{contact.phone}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-red-200">
            Database: LocalStorage + Google Sheets (env: VITE_GOOGLE_SHEET_URL) + WA Gateway • Admin: <a href="?admin=mawar81" className="underline font-bold">?admin=mawar81</a>
          </p>
        </div>
      </div>
    </section>
  );
}
