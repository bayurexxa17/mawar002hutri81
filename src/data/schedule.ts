export interface ScheduleItem {
  id: number;
  time: string;
  event: string;
  location: string;
  icon: string;
  isHighlight?: boolean;
}

export const schedule: ScheduleItem[] = [
  {
    id: 1,
    time: '06:00',
    event: 'Upacara Bendera',
    location: 'Lapangan Utama',
    icon: '🚩'
  },
  {
    id: 2,
    time: '07:00',
    event: 'Lomba Sepeda Hias',
    location: 'Start: Gapura Utama',
    icon: '🚴'
  },
  {
    id: 3,
    time: '08:00',
    event: 'Pembukaan & Sambutan',
    location: 'Panggung Utama',
    icon: '🎤',
    isHighlight: true
  },
  {
    id: 4,
    time: '08:30',
    event: 'Lomba Anak-Anak Dimulai',
    location: 'Area Lomba A',
    icon: '🎈'
  },
  {
    id: 5,
    time: '09:00',
    event: 'Lomba Kebersihan Lingkungan',
    location: 'Sepanjang Blok Mawar',
    icon: '🧹'
  },
  {
    id: 6,
    time: '09:30',
    event: 'Lomba Cerdas Cermat',
    location: 'Aula Warga',
    icon: '🧠'
  },
  {
    id: 7,
    time: '10:00',
    event: 'Lomba Panjat Pinang',
    location: 'Lapangan Utama',
    icon: '🎋',
    isHighlight: true
  },
  {
    id: 8,
    time: '11:00',
    event: 'Lomba Masak Nasi Goreng',
    location: 'Tenda Kuliner',
    icon: '🍳'
  },
  {
    id: 9,
    time: '12:00',
    event: 'Istirahat & Sholat Dzuhur',
    location: 'Masjid Al-Ikhlas',
    icon: '🕌'
  },
  {
    id: 10,
    time: '13:00',
    event: 'Lomba Egrang',
    location: 'Area Lomba B',
    icon: '🦵'
  },
  {
    id: 11,
    time: '14:00',
    event: 'Lomba Tarik Tambang',
    location: 'Lapangan Utama',
    icon: '💪',
    isHighlight: true
  },
  {
    id: 12,
    time: '15:00',
    event: 'Penampilan Seni Budaya',
    location: 'Panggung Utama',
    icon: '🎭'
  },
  {
    id: 13,
    time: '16:00',
    event: 'Lomba Joget Balo',
    location: 'Panggung Utama',
    icon: '💃'
  },
  {
    id: 14,
    time: '17:00',
    event: 'Penampilan Hiburan Musik',
    location: 'Panggung Utama',
    icon: '🎵'
  },
  {
    id: 15,
    time: '18:00',
    event: 'Istirahat & Sholat Maghrib',
    location: 'Masjid Al-Ikhlas',
    icon: '🕌'
  },
  {
    id: 16,
    time: '19:00',
    event: 'Malam Puncak & Doorprize',
    location: 'Panggung Utama',
    icon: '🎁',
    isHighlight: true
  },
  {
    id: 17,
    time: '20:00',
    event: 'Penampilan Band & Dangdut',
    location: 'Panggung Utama',
    icon: '🎸'
  },
  {
    id: 18,
    time: '21:00',
    event: 'Pengumuman Pemenang & Penutupan',
    location: 'Panggung Utama',
    icon: '🏆',
    isHighlight: true
  }
];
