// Storage abstraction untuk Pendaftaran & Donasi
// Saat ini: localStorage (jalan di Cloudflare Pages)
// Upgrade: ganti ke Google Sheets / Supabase / Cloudflare D1 tanpa ubah UI

export interface ParticipantDB {
  id: string;
  name: string;
  rt: string;
  hp: string;
  lomba: string[];
  catatan: string;
  waktu: string;
}

export interface DonorDB {
  id: string;
  name: string;
  alamat: string;
  hp: string;
  jumlah: number;
  pesan: string;
  waktu: string;
  isAnon: boolean;
}

const KEY_PARTICIPANTS = 'hutri-participants-mawar';
const KEY_DONORS = 'hutri-donors-mawar';

// ====== LOCAL STORAGE (DEFAULT) ======
export const storage = {
  // PARTICIPANTS
  getParticipants(): ParticipantDB[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(KEY_PARTICIPANTS) || '[]');
    } catch { return []; }
  },
  saveParticipants(data: ParticipantDB[]) {
    localStorage.setItem(KEY_PARTICIPANTS, JSON.stringify(data));
    // auto sync ke google sheets jika ada URL
    syncToGoogleSheet('pendaftaran', data[data.length - 1]);
    notifyPanitiaWA(data[data.length - 1]);
  },

  // DONORS
  getDonors(): DonorDB[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(KEY_DONORS) || '[]');
    } catch { return []; }
  },
  saveDonors(data: DonorDB[]) {
    localStorage.setItem(KEY_DONORS, JSON.stringify(data));
    syncToGoogleSheet('donasi', data[data.length - 1]);
  },

  exportCSV(type: 'participants' | 'donors') {
    const data = type === 'participants' ? this.getParticipants() : this.getDonors();
    if (data.length === 0) {
      alert('Belum ada data untuk di-export');
      return;
    }
    let csv = '';
    if (type === 'participants') {
      csv = 'No,ID,Nama,RT/Blok,HP,Lomba,Catatan,Waktu\n';
      (data as ParticipantDB[]).forEach((p, i) => {
        csv += `${i+1},"${p.id}","${p.name}","${p.rt}","${p.hp}","${p.lomba.join('; ')}","${p.catatan.replace(/"/g, "'")}","${p.waktu}"\n`;
      });
    } else {
      csv = 'No,ID,Nama,Alamat,Jumlah,Pesan,Waktu,Anonim\n';
      (data as DonorDB[]).forEach((d, i) => {
        csv += `${i+1},"${d.id}","${d.name}","${d.alamat}",${d.jumlah},"${d.pesan.replace(/"/g, "'")}","${d.waktu}",${d.isAnon}\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hutri81-${type}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }
};

// ====== GOOGLE SHEETS SYNC (OPTIONAL) ======
// Cara pakai:
// 1. Buat Google Sheet baru
// 2. Extensions > Apps Script, paste script dari PANITIA_SETUP.md
// 3. Deploy as Web App, copy URL
// 4. Set di .env: VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/.../exec
async function syncToGoogleSheet(type: 'pendaftaran' | 'donasi', payload: any) {
  const url = (import.meta as any).env?.VITE_GOOGLE_SHEET_URL;
  if (!url) return; // skip jika tidak ada config
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ type, ...payload, app: 'mawar002hutri81' }),
    });
    console.log(`[SYNC] ${type} synced to Google Sheet`);
  } catch (e) {
    console.error('Google Sheet sync failed', e);
  }
}

// ====== AUTO NOTIF WA KE PANITIA ======
function notifyPanitiaWA(p: ParticipantDB) {
  // Tidak bisa auto-kirim WA tanpa API berbayar
  // Kita buat notifikasi di browser + simpan log agar panitia cek
  // Untuk auto-kirim beneran, pakai Fonnte / Wablas / WA Gateway
  const panitiaNumbers = [
    '6281271299984', // Ketua Pembina
    '6281288395550', // Ketua Panitia Bayu
    '6283183950205', // Wakil
  ];
  const msg = `🚨 PENDAFTAR BARU HUT RI 81 MAWAR%0A%0A👤 Nama: ${p.name}%0A📍 RT: ${p.rt}%0A📱 HP: ${p.hp}%0A🏅 Lomba: ${p.lomba.join(', ')}%0A🕐 ${p.waktu}%0A%0ABuka Admin: ${window.location.origin}?admin=mawar81`;
  
  // Simpan notif terakhir untuk ditampilkan di Admin Panel
  localStorage.setItem('hutri-last-wa-notif', JSON.stringify({ p, msg, waLinks: panitiaNumbers.map(n => `https://wa.me/${n}?text=${msg}`) }));
}
