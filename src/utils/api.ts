// API - Link Akhir ke Database Panitia
// Support: Google Sheets (primary), Cloudflare Pages Function, Supabase, WhatsApp Fallback

const GOOGLE_SHEET_URL = (import.meta as any).env?.VITE_GOOGLE_SHEET_URL || '';
const API_ENDPOINT = (import.meta as any).env?.VITE_API_ENDPOINT || '/api/register'; // Cloudflare Pages Function

export interface RegistrationPayload {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  rt?: string;
  hp?: string;
  lomba: string[]; // nama lomba
  lombaIds?: number[]; // id lomba
  catatan: string;
  waktu: string;
  source: 'form-bawah' | 'dashboard';
}

export async function submitRegistration(payload: RegistrationPayload): Promise<{ success: boolean; id: string; message: string }> {
  const id = payload.id || `MWR81-${Date.now().toString().slice(-6)}`;
  const dataToSave = { ...payload, id };

  // 1. Simpan ke LocalStorage (selalu, sebagai cache & untuk Admin Panel offline)
  try {
    const key = 'hutri-participants-mawar';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      id,
      name: payload.name,
      rt: payload.address || payload.rt,
      hp: payload.whatsapp || payload.hp,
      lomba: payload.lomba,
      catatan: payload.catatan,
      waktu: payload.waktu,
    });
    localStorage.setItem(key, JSON.stringify(existing));
    console.log('[LocalStorage] Saved', id);
  } catch (e) {
    console.error('LocalStorage failed', e);
  }

  // 2. Kirim ke Google Sheets (jika ada URL) - INI DATABASE UTAMA PANITIA
  if (GOOGLE_SHEET_URL) {
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // penting untuk Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pendaftaran',
          app: 'mawar002hutri81',
          id: dataToSave.id,
          name: dataToSave.name,
          rt: dataToSave.address || dataToSave.rt,
          hp: dataToSave.whatsapp || dataToSave.hp,
          lomba: dataToSave.lomba,
          catatan: dataToSave.catatan,
          waktu: dataToSave.waktu,
          source: dataToSave.source,
        }),
      });
      console.log('[Google Sheet] Sync requested');
      // Karena no-cors, kita anggap sukses
      return { success: true, id, message: 'Tersimpan ke Database Panitia (Google Sheet)' };
    } catch (e) {
      console.warn('Google Sheet failed, fallback to API', e);
    }
  }

  // 3. Coba kirim ke Cloudflare Pages Function / API Endpoint (jika ada backend)
  try {
    if (API_ENDPOINT && API_ENDPOINT !== '/api/register') {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, id: json.id || id, message: 'Tersimpan ke Server Panitia' };
      }
    }
  } catch (e) {
    console.warn('API Endpoint failed', e);
  }

  // 4. Fallback: tetap sukses karena sudah di localStorage
  return { success: true, id, message: 'Tersimpan Offline (Panitia bisa lihat di Admin Panel HP ini)' };
}

// Generate WA links untuk konfirmasi ke panitia setelah daftar
export function generatePanitiaWALinks(payload: RegistrationPayload) {
  const lombaText = payload.lomba.join(', ');
  const msg = `🚨 PENDAFTAR BARU HUT RI 81 - CIPTALAND MAWAR%0A%0A🆔 ID: ${payload.id}%0A👤 Nama: ${payload.name}%0A📱 WA: ${payload.whatsapp || payload.hp}%0A📍 Alamat: ${payload.address || payload.rt}%0A🏅 Lomba: ${lombaText}%0A📝 Catatan: ${payload.catatan || '-'}%0A🕐 ${payload.waktu}%0A%0A✅ Data sudah masuk database panitia. Cek Admin: ${typeof window !== 'undefined' ? window.location.origin : ''}?admin=mawar81`;
  
  const panitia = [
    { name: 'Ketua Panitia - Bayu S.Permana', wa: '6281288395550' },
    { name: 'Ketua Pembina - Eka Rista', wa: '6281271299984' },
    { name: 'Wakil Ketua - Sugiono', wa: '6283183950205' },
    { name: 'Bendahara 1 - Aulia Komari', wa: '6281271299984' },
  ];

  return panitia.map(p => ({
    ...p,
    link: `https://wa.me/${p.wa}?text=${msg}`
  }));
}

export function generatePesertaWALink(payload: RegistrationPayload) {
  const msg = `Halo ${payload.name}! 🎉%0A%0ATerima kasih sudah mendaftar lomba HUT RI Ke-81 Ciptaland Mawar.%0A%0A🆔 ID: ${payload.id}%0A🏅 Lomba: ${payload.lomba.join(', ')}%0A📅 Hari H: 17 Agustus 2026%0A%0A📸 Screenshot bukti ini dan tunjukkan saat registrasi ulang jam 06.00 di Fasum.%0A%0AInfo lebih lanjut hubungi panitia. Merdeka! 🇮🇩`;
  const hp = (payload.whatsapp || payload.hp || '').replace(/[^0-9]/g, '').replace(/^0/, '62');
  return hp ? `https://wa.me/${hp}?text=${msg}` : null;
}
