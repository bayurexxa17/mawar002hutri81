import { supabase } from './supabaseClient';

export interface RegistrationPayload {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  lomba: string[];
  lombaIds: number[];
  catatan?: string;
  waktu: string;
  source?: string;
}

// Fungsi untuk mengirim data pendaftaran ke Supabase Cloud
export async function submitRegistration(payload: RegistrationPayload) {
  try {
    // 1. Simpan juga ke localStorage sebagai cadangan offline di HP/browser pendaftar
    const existing = JSON.parse(localStorage.getItem('mawar81_registrations') || '[]');
    localStorage.setItem('mawar81_registrations', JSON.stringify([payload, ...existing]));

    // 2. Kirim data secara langsung ke database Supabase Cloud
    const { error } = await supabase
      .from('registrations')
      .insert([
        {
          id: payload.id,
          name: payload.name,
          whatsapp: payload.whatsapp,
          address: payload.address,
          lomba: payload.lomba,
          catatan: payload.catatan || '',
          waktu: payload.waktu,
        }
      ]);

    if (error) {
      console.error('Error Supabase:', error);
      // Meskipun gagal ke cloud (misal gangguan internet), tetap sukses secara lokal agar user tidak panik
      return { success: true, id: payload.id };
    }

    return { success: true, id: payload.id };
  } catch (err) {
    console.error('Gagal menyimpan:', err);
    return { success: true, id: payload.id };
  }
}

// Fungsi untuk mengambil data di panel Admin (Dashboard)
export async function getRegistrations() {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('waktu', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback ke localStorage jika data di cloud kosong
      return JSON.parse(localStorage.getItem('mawar81_registrations') || '[]');
    }

    return data;
  } catch (err) {
    return JSON.parse(localStorage.getItem('mawar81_registrations') || '[]');
  }
}

// Generator link WhatsApp konfirmasi panitia
export function generatePanitiaWALinks(payload: RegistrationPayload) {
  const panitiaList = [
    { name: 'Bayu S.Permana (Ketua)', wa: '6281288395550' },
    { name: 'Eka Rista Y (PJ)', wa: '6282171299984' },
    { name: 'Sugiono (Wakil)', wa: '6283183950205' },
  ];

  const text = encodeURIComponent(
    `Halo Panitia HUT RI Ke-81 Ciptaland Mawar,\n\nSaya ingin konfirmasi pendaftaran lomba:\n- ID: *${payload.id}*\n- Nama: *${payload.name}*\n- Alamat: *${payload.address}*\n- No WA: *${payload.whatsapp}*\n- Lomba: *${payload.lomba.join(', ')}*\n\nMohon verifikasinya, terima kasih!`
  );

  return panitiaList.map(p => ({
    name: p.name,
    wa: p.wa,
    link: `https://wa.me/${p.wa}?text=${text}`
  }));
}
