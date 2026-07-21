export interface EventType {
  id: number;
  nama: string;
  tanggal: string;
  keterangan: string;
  lokasi: string;
  badge?: string;
}

export const eventTypes: EventType[] = [
  {
    id: 2,
    nama: 'Pesta Rakyat Ciptaland Mawar (HUT RI 2026)',
    tanggal: '17 Agustus 2026',
    keterangan: '06.00 – selesai',
    lokasi: 'Fasum Mushola Nurul Ukhuwah Blok Mawar',
    badge: 'Puncak',
  },
  {
    id: 3,
    nama: 'Malam Puncak HUT RI ke-81 Ciptaland',
    tanggal: '17 Agustus 2026',
    keterangan: '19.00 – 22.00 WIB + Doorprize',
    lokasi: 'Panggung Utama',
    badge: 'Hiburan',
  },
];

export interface PanduanLombaDetail {
  id: string;
  icon: string;
  title: string;
  kategori: string;
  tanggal: string;
  tim: string;
  durasi: string;
  rules: string[];
  budget?: string;
}

export const panduanLomba: PanduanLombaDetail[] = [
  {
    id: 'jalan',
    icon: '🚶',
    title: 'Jalan Santai & Senam',
    kategori: 'Umum · 17 Agustus 06.00',
    tanggal: '17 Agustus 06.00',
    tim: 'Seluruh warga (tanpa batas)',
    durasi: '±1,5 jam',
    rules: [
      'Berkumpul di Gapura Mawar pukul 06.00, terima kupon doorprize saat registrasi.',
      'Rute keliling perumahan 1–2 km, lanjut senam bersama di lapangan.',
      'Kupon diundi setelah senam; pemenang wajib hadir saat dipanggil (3x panggilan).',
      'Doorprize dari budget umum Rp 3.000.000.',
    ],
  },
  {
    id: 'paku',
    icon: '🧒',
    title: 'Masukkan Paku dalam Botol',
    kategori: 'Anak-anak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5–10 anak / ronde (5–12 th)',
    durasi: '±30 menit total',
    rules: [
      'Paku diikat tali di pinggang belakang peserta.',
      'Tanpa bantuan tangan, masukkan paku ke botol di belakang.',
      'Tercepat menang ±2–3 menit per ronde.',
      'Juara tiap ronde maju ke final.',
    ],
  },
  {
    id: 'kelereng',
    icon: '🥄',
    title: 'Bawa Kelereng (Sendok)',
    kategori: 'Anak-anak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5–8 anak / ronde',
    durasi: '±30 menit total',
    rules: [
      'Gigit sendok berisi kelereng, tangan di belakang.',
      'Jalan 10 meter dari start ke finish tanpa jatuh.',
      'Jatuh = gugur atau kembali ke start (panitia).',
      'Yang sampai pertama dengan utuh menang.',
    ],
  },
  {
    id: 'kerupuk',
    icon: '🍘',
    title: 'Makan Kerupuk',
    kategori: 'Anak-anak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5–10 anak / ronde',
    durasi: '±30 menit total',
    rules: [
      'Kerupuk digantung setinggi mulut.',
      'Tangan di belakang, dilarang sentuh kerupuk/tali.',
      'Yang habis pertama menang ±5–10 menit per ronde.',
    ],
  },
  {
    id: 'air',
    icon: '💦',
    title: 'Pukul Air Digantung (Tutup Mata)',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '1 orang / giliran, ±15 peserta',
    durasi: '±45 menit total',
    rules: [
      'Kantong/balon air digantung, peserta ditutup mata.',
      'Diputar 3x, jalan menuju target dengan 1 pukulan tongkat.',
      'Pecah = hadiah/poin ±3 menit per peserta.',
      'Penonton boleh memberi arahan - di sinilah serunya!',
    ],
  },
  {
    id: 'tepung',
    icon: '🍚',
    title: 'Estafet Tepung',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–6 orang, 2–4 tim / ronde',
    durasi: '±10 menit / ronde',
    rules: [
      'Duduk berbanjar, yang depan pegang tepung.',
      'Oper ke belakang lewat atas kepala pakai piring, tanpa menoleh.',
      'Yang belakang tampung di wadah ukur.',
      'Setelah ±3 menit, tepung terbanyak menang.',
    ],
  },
  {
    id: 'tambang',
    icon: '💪',
    title: 'Tarik Tambang',
    kategori: 'Ibu & Bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–7 orang',
    durasi: '±10 menit / pertandingan',
    rules: [
      'Dua tim berhadapan pegang tambang, pita di tengah.',
      'Tarik hingga pita melewati garis lawan.',
      'Best of 3, dilarang lilit tambang ke tubuh.',
      'Sistem gugur antar RT. Kategori ibu & bapak dipisah.',
    ],
  },
  {
    id: 'karung',
    icon: '🏃',
    title: 'Balap Karung',
    kategori: 'Bapak-bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '4–6 peserta / heat',
    durasi: '±5 menit / heat, ±30 menit total',
    rules: [
      'Masuk karung, berdiri di garis start.',
      'Melompat menuju finish ±15–20 meter.',
      'Keluar karung = diskualifikasi.',
      'Pemenang heat maju ke final.',
    ],
  },
];
