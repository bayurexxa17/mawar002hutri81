import { bankAccounts, qrisData, donationInfo } from '../data/banks';
import BankCard from '../components/BankCard';
import { useEffect, useState } from 'react';

export default function DonationBank() {
  const [totalDonasi, setTotalDonasi] = useState(0);

  useEffect(() => {
    const donors = localStorage.getItem('hutri-donors-mawar');
    if (donors) {
      const parsed = JSON.parse(donors);
      const total = parsed.reduce((a: number, b: any) => a + (b.jumlah || 0), 0);
      setTotalDonasi(total);
    }
  }, []);

  const progress = Math.min(100, Math.round((totalDonasi / donationInfo.target) * 100));

  return (
    <section id="donasi-bank" className="py-20 px-4 bg-gradient-to-b from-white to-[#F9F5EB]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-red-100 text-[#C1272D] px-4 py-2 rounded-full font-bold text-sm mb-4">
            💝 DONASI & DUKUNGAN
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800">
            Link Bank <span className="text-[#C1272D]">Donasi</span> HUT RI 81
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Dukung kemeriahan HUT RI ke-81 Ciptaland Mawar. Setiap rupiah sangat berarti untuk hadiah lomba, konsumsi, dan malam puncak. InsyaAllah jadi amal jariyah.
          </p>
          <div className="w-24 h-1.5 bg-[#C1272D] mx-auto mt-6 rounded-full" />
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12 bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-gray-700">Terkumpul: Rp {totalDonasi.toLocaleString('id-ID')}</span>
            <span className="text-gray-500">Target: Rp {donationInfo.target.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C1272D] to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-xs text-gray-500">{progress}% tercapai • Butuh {Math.max(0, donationInfo.target - totalDonasi).toLocaleString('id-ID')} lagi</div>
        </div>

        {/* QRIS - Center */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#C1272D]/20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C1272D] to-red-400" />
            <div className="text-5xl mb-3">📱</div>
            <h3 className="font-black text-xl text-gray-800">QRIS - Scan Semua E-Wallet</h3>
            <p className="text-sm text-gray-500 mt-1">DANA, OVO, GoPay, LinkAja, ShopeePay & M-Banking</p>
            
            {/* QR Placeholder - ganti dengan QRIS asli */}
            <div className="mt-6 bg-gray-100 rounded-2xl p-4 aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-2">🔲</div>
              <div className="text-xs text-gray-500 font-mono">{qrisData.merchantId}</div>
              <div className="mt-4 text-sm">
                <div className="font-bold">{qrisData.holder}</div>
                <div className="text-xs text-gray-500 mt-1">Ganti QR di <code>public/images/qris.png</code></div>
              </div>
              {/* Jika ada file QRIS asli, uncomment: */}
              {/* <img src="/images/qris.png" alt="QRIS" className="w-full h-full object-contain" /> */}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-blue-50 p-3 rounded-xl">
                <div className="font-bold text-blue-800">Cara Bayar:</div>
                <div className="text-gray-600 mt-1 text-left">1. Buka e-wallet<br/>2. Pilih Scan QR<br/>3. Scan QR di atas<br/>4. Masukkan nominal</div>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <div className="font-bold text-green-800">Setelah Transfer:</div>
                <div className="text-gray-600 mt-1 text-left">✅ Screenshot bukti<br/>✅ Klik Konfirmasi WA<br/>✅ Kirim ke Bendahara</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank - Hanya 2 Rekening Sesuai Request Terbaru */}
        <div className="mb-12">
          <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-[#C1272D] text-white rounded-full flex items-center justify-center text-xl">🏦</span>
            Rekening Donasi Resmi - a.n Aulia Komari
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {bankAccounts.map(acc => (
              <BankCard key={acc.id} account={acc} type="bank" />
            ))}
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            💡 <strong>Hanya 2 rekening resmi:</strong> <span className="font-mono font-bold">901592977740 SeaBank</span> & <span className="font-mono font-bold">081364755007 DANA</span> a.n <strong>Aulia Komari</strong> - Bendahara HUT RI 81. Simpan bukti transfer.
          </div>
        </div>

        {/* Konfirmasi */}
        <div className="bg-[#C1272D] rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <h3 className="text-2xl font-black mb-2">✅ Setelah Transfer, Wajib Konfirmasi!</h3>
            <p className="text-red-100 mb-6">Agar donasi tercatat dan masuk laporan keuangan panitia.</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {donationInfo.whatsappKonfirmasi.map(contact => (
                <a
                  key={contact.wa}
                  href={`https://wa.me/${contact.wa}?text=Assalamualaikum%20${encodeURIComponent(contact.name)}%2C%20saya%20sudah%20transfer%20donasi%20HUT%20RI%2081%20sebesar%20Rp%20...%20mohon%20dicek%20ya%20🙏`}
                  target="_blank"
                  className="bg-white text-[#C1272D] rounded-2xl p-4 hover:bg-red-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">💬</div>
                    <div>
                      <div className="font-bold text-gray-800">{contact.name}</div>
                      <div className="text-xs text-gray-500">{contact.phone}</div>
                      <div className="text-xs text-green-600 font-bold mt-1 group-hover:underline">Chat WA →</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
              <strong>Format Konfirmasi:</strong>
              <div className="mt-2 bg-black/20 rounded-lg p-3 font-mono text-xs">
                Nama: ...<br/>
                Jumlah Transfer: Rp ...<br/>
                Bank Asal: BCA/BRI/DANA dll<br/>
                Untuk: Donasi HUT RI 81<br/>
                + Lampirkan Screenshot Bukti Transfer
              </div>
            </div>
          </div>
        </div>

        {/* Transparansi */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            🔒 Donasi dikelola transparan oleh Bendahara 1 & 2. Laporan keuangan dipublikasikan di Tab Pendanaan.<br/>
            Semua donatur (yang tidak anonim) akan disebutkan di malam puncak. Jazakumullah khairan.
          </p>
        </div>
      </div>
    </section>
  );
}
