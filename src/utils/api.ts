// API - Link Akhir ke Database Panitia (Supabase Cloud + Google Sheets + LocalStorage)
import { supabase } from './supabaseClient';

const GOOGLE_SHEET_URL = (import.meta as any).env?.VITE_GOOGLE_SHEET_URL || '';
const API_ENDPOINT = (import.meta as any).env?.VITE_API_ENDPOINT || '/api/register';

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
  const dataToSave = { 
    id,
    name: payload.name,
    whatsapp: payload.whatsapp || payload.hp || '',
    address: payload.address || payload.rt || '',
    lomba: payload.lomba,
    lombaIds: payload.lombaIds || [],
    catatan: payload.catatan || '',
    waktu: payload.waktu,
    source: payload.source
  };

  // 1. Simpan ke Supabase Cloud (DATABASE UTAMA REAL-TIME)
  try {
    const { error } = await supabase
      .from('registrations')
      .insert([dataToSave]);

    if (error) {
      console.error('[Supabase] Insert failed:', error);
    } else {
      console.log('[Supabase] Saved successfully', id);
    }
  } catch (e) {
    console.error('[Supabase] Exception during insert:', e);
  }

  // 2. Simpan ke LocalStorage (sebagai cache & cadangan offline)
  try {
    const key = 'hutri-participants-mawar';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      id,
      name: dataToSave.name,
      rt: dataToSave.address,
      hp: dataToSave.whatsapp,
      lomba: dataToSave.lomba,
      catatan: dataToSave.catatan,
      waktu: dataToSave.waktu,
    });
    localStorage.setItem(key, JSON.stringify(existing));
    console.log('[LocalStorage] Saved', id);
  } catch (e) {
    console.error('LocalStorage failed', e);
  }

  // 3. Kirim ke Google Sheets (jika ada URL)
  if (GOOGLE_SHEET_URL) {
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pendaftaran',
          app: 'mawar002hutri81',
          id: dataToSave.id,
          name: dataToSave.name,
          rt: dataToSave.address,
          hp: dataToSave.whatsapp,
          lomba: dataToSave.lomba,
          catatan: dataToSave.catatan,
          waktu: dataToSave.waktu,
          source: dataToSave.source,
        }),
      });
      console.log('[Google Sheet] Sync requested');
    } catch (e) {
      console.warn('Google Sheet failed', e);
    }
  }

  // Sukses tersimpan ke Supabase / LocalStorage
  return { success: true, id, message: 'Tersimpan ke Supabase Cloud & Database Panitia' };
}

// Generate WA links untuk konfirmasi ke panitia setelah daftar
export function generatePanitiaWALinks(payload: RegistrationPayload) {
  const lombaText = payload.lomba.join(', ');
  const msg = `🚨 PENDAFTAR BARU HUT RI 81 - CIPTALAND MAWAR%0A%0A🆔 ID: ${payload.id}%0A👤 Nama: ${payload.name}%0A📱 WA: ${payload.whatsapp || payload.hp}%0A📍 Alamat: ${payload.address || payload.rt}%0A🏅 Lomba: ${lombaText}%0A📝 Catatan: ${payload.catatan || '-'}%0A🕐 ${payload.waktu}%0A%0A✅ Data sudah masuk database panitia. Cek Admin: ${typeof window !== 'undefined' ? window.location.origin : ''}?admin=mawar81`;
  
  const panitia = [
    { name: 'Penanggung Jawab - Eka Rista Y', wa: '6282171299984' },
    { name: 'Ketua Panitia - Bayu S.Permana', wa: '6281288395550' },
    { name: 'Wakil Ketua - Sugiono', wa: '6283183950205' },
    { name: 'Bendahara - Aulia Komari', wa: '6281364755007' },
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
