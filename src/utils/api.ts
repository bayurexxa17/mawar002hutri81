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

// Fungsi untuk mengirim data pendaftaran ke tabel 'pendaftar' Supabase
export async function submitRegistration(payload: RegistrationPayload) {
  try {
    const { data, error } = await supabase
      .from('pendaftar')
      .insert([
        {
          nama: payload.name,       // Menyesuaikan kolom 'nama' di Supabase
          telepon: payload.whatsapp, // Menyesuaikan kolom 'telepon' di Supabase
          // Jika ingin menyimpan data lomba/alamat/catatan, Anda bisa tambahkan kolom baru di Supabase (tipe text)
        }
      ])
      .select();

    if (error) {
      console.error('Error Supabase detail:', error);
      alert(`Gagal menyimpan ke Database Cloud: ${error.message}`);
      throw error;
    }

    return { success: true, id: payload.id, data };
  } catch (err: any) {
    console.error('Gagal menyimpan:', err);
    throw err;
  }
}

// Fungsi untuk mengambil data dari tabel 'pendaftar' Supabase
export async function getRegistrations() {
  try {
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error mengambil data dari Supabase:', error);
      return [];
    }

    // Mapping agar sesuai dengan format yang dibaca oleh tampilan web
    return (data || []).map((item: any) => ({
      id: String(item.id),
      name: item.nama || '',
      whatsapp: item.telepon || '',
      address: '-',
      lomba: [item.kategori || 'Umum'],
      catatan: '',
      waktu: item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : ''
    }));
  } catch (err) {
    console.error('Exception saat mengambil data:', err);
    return [];
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
