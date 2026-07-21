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
    id: 'futsal',
    icon: '⚽',
    title: 'Futsal Mini',
    kategori: 'Remaja · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5 Remaja / ronde',
    durasi: '±30 menit total',
    rules: [
      'Format: beregu sistem gugur / setengah kompetisi.',
      'Jumlah: 5 pemain inti (termasuk kiper) + cadangan.',
      'Durasi: 2 x 10 atau 15 menit.',
      'Pergantian bebas, kick-in untuk bola out.',
      'Keputusan wasit mutlak.',
    ],
  },
  {
    id: 'tepung',
    icon: '🍚',
    title: 'Estafet Tepung',
    kategori: 'Bapak-bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–6 orang, 2–4 tim / ronde',
    durasi: '±10 menit / ronde',
    rules: [
      'Duduk berbanjar, yang depan pegang tepung.',
      'Oper ke belakang lewat atas kepala pakai piring.',
      'Yang belakang tampung di wadah ukur.',
      'Tepung terbanyak menang.',
    ],
  },
  {
    id: 'penguin-anak',
    icon: '🐧',
    title: 'Estafet Penguin Anak',
    kategori: 'Anak-anak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 3–4 orang / ronde',
    durasi: '±10 menit / ronde',
    rules: [
      'Jalan dengan bola diapit lutut (gaya penguin).',
      'Jika bola jatuh, ambil dan lanjut dari tempat jatuh.',
      'Estafet ke teman sampai finish.',
      'Tim tercepat menang.',
    ],
  },
  {
    id: 'penguin-remaja',
    icon: '🐧',
    title: 'Estafet Penguin Remaja',
    kategori: 'Remaja · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 3–4 orang',
    durasi: '±10 menit / ronde',
    rules: [
      'Sama seperti versi anak, tapi jarak lebih jauh.',
      'Wajib kompak dan jaga keseimbangan.',
      'Tim tercepat menang.',
    ],
  },
  {
    id: 'tambang',
    icon: '💪',
    title: 'Tarik Tambang',
    kategori: 'Bapak-bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–7 orang',
    durasi: '±10 menit / pertandingan',
    rules: [
      'Dua tim berhadapan pegang tambang, pita di tengah.',
      'Tarik hingga pita melewati garis lawan.',
      'Best of 3, dilarang lilit tambang ke tubuh.',
      'Sistem gugur antar RT.',
    ],
  },
  {
    id: 'buta',
    icon: '👩‍🦯',
    title: 'Make Up Buta',
    kategori: 'Keluarga · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 2 orang berpasangan',
    durasi: '±5-10 menit',
    rules: [
      'Perias mata tertutup, model duduk diam.',
      'Persiapan raba alat make-up sebelum mata ditutup.',
      'Rias dalam waktu 5-10 menit.',
      'Hasil paling rapi/lucu/kreatif menang.',
    ],
  },
  {
    id: 'joget-bapak',
    icon: '🕺',
    title: 'Joget Kursi Bapak',
    kategori: 'Bapak-bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–7 orang',
    durasi: '±10 menit',
    rules: [
      'Kursi jumlah = peserta -1, susun melingkar.',
      'Jalan keliling kursi saat musik bunyi.',
      'Saat musik berhenti, rebutan kursi.',
      'Tidak kebagian = gugur, kursi dikurangi 1.',
      'Terakhir duduk di 1 kursi jadi juara.',
    ],
  },
  {
    id: 'joget-ibu',
    icon: '🪑',
    title: 'Joget Kursi Ibu',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5–10 ibu / ronde',
    durasi: '±15 menit',
    rules: [
      'Sama seperti joget kursi bapak, versi ibu-ibu.',
      'Musik dangdut / remix kemerdekaan.',
      'Juri nilai sportivitas.',
    ],
  },
  {
    id: 'sambung',
    icon: '🍙',
    title: 'Salah Sambung',
    kategori: 'Remaja · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '4–6 Orang / Tim',
    durasi: '±30 menit total',
    rules: [
      'Berbisik berantai dari depan ke belakang.',
      'Kalimat awal dari panitia, tidak boleh keras.',
      'Kalimat terakhir dibacakan, yang paling mirip atau paling lucu menang.',
      'Dilarang mengeraskan suara.',
    ],
  },
  {
    id: 'tumpeng',
    icon: '🍛',
    title: 'Hias Tumpeng',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Per RT / Kelompok 3-5 ibu',
    durasi: '90 menit',
    rules: [
      'Tumpeng disediakan peserta, hias di lokasi.',
      'Tema: Kemerdekaan Indonesia.',
      'Juri nilai kreativitas, rasa, kerapian.',
      'Waktu hias 90 menit, presentasi 2 menit per tim.',
    ],
  },
  {
    id: 'daster',
    icon: '👗',
    title: 'Fashion Week Daster',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Individu',
    durasi: '±45 menit',
    rules: [
      'Peserta pakai daster kreasi terbaik/terlucu.',
      'Catwalk 1 menit per orang di panggung.',
      'Juri nilai kreativitas, kepercayaan diri, kekocakan.',
      'Boleh bawa properti pendukung.',
    ],
  },
];
