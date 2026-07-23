export type ActivityCategory = 'anak' | 'ibu' | 'bapak' | 'remaja' | 'umum' | 'keluarga';

export interface Activity {
  id: number;
  title: string;
  category: ActivityCategory;
  time: string;
  prize: string;
  icon: string;
  description: string;
  participants?: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: 'Lomba Makan Kerupuk',
    category: 'anak',
    time: '08:30 WIB',
    prize: '🏆 Hadiah Menarik',
    icon: '🎈',
    description: 'Lomba makan kerupuk tanpa tangan untuk anak-anak',
    participants: 'Usia 5-12 tahun'
  },
  {
    id: 2,
    title: 'Futsal Mini',
    category: 'remaja',
    time: '09:30 WIB',
    prize: 'Rp 500.000',
    icon: '⚽',
    description: 'Futsal Mini beregu dengan hadiah menarik di puncak',
    participants: 'Tim 5 orang'
  },
  {
    id: 3,
    title: 'Lomba Balap Kelereng',
    category: 'anak',
    time: '08:30 WIB',
    prize: 'Rp 75.000',
    icon: '🏃',
    description: 'Balap kelereng klasik untuk anak-anak, melatih fokus dan keseimbangan',
    participants: 'Usia 7-15 tahun'
  },
  {
    id: 4,
    title: 'Lomba Tarik Tambang',
    category: 'bapak',
    time: '11:00 WIB',
    prize: 'Rp 300.000',
    icon: '💪',
    description: 'Kompetisi tarik tambang antar RT - adu kekuatan dan kekompakan',
    participants: 'Tim 8 orang'
  },
  {
    id: 5,
    title: 'Lomba Hias Tumpeng',
    category: 'ibu',
    time: '13:00 WIB',
    prize: 'Rp 250.000',
    icon: '🍛',
    description: 'Lomba Hias Tumpeng Kreasi Para Ibu dengan Cita Rasa dan Tampilan Menarik dan Terbaik',
    participants: 'Ibu rumah tangga'
  },
  {
    id: 6,
    title: 'Lomba Fashion Week Daster',
    category: 'ibu',
    time: '13:00 WIB',
    prize: 'Rp 200.000',
    icon: '👗',
    description: 'Kreasikan Gaya dan Penampilan Terbaik dan Terlucu',
    participants: 'Ibu-ibu'
  },
  {
    id: 7,
    title: 'Salah Sambung',
    category: 'remaja',
    time: '09:30 WIB',
    prize: 'Rp 150.000',
    icon: '🗣️',
    description: 'Lomba Salah Sambung Melatih Fokus, Kekompakan, Kecepatan dan Berfikir',
    participants: 'Usia 13-17 tahun'
  },
  {
    id: 8,
    title: 'Lomba Joget Kursi Bapak',
    category: 'bapak',
    time: '11:00 WIB',
    prize: 'Rp 200.000',
    icon: '💃',
    description: 'Lomba joget kursi dengan keseruan untuk bapak-bapak',
    participants: 'Individu'
  },
  {
    id: 9,
    title: 'Lomba Estafet Penguin Anak',
    category: 'anak',
    time: '08:30 WIB',
    prize: 'Rp 150.000',
    icon: '🐧',
    description: 'Lomba Model Baru dengan Keseruan dan Kekompakan',
    participants: 'Tim 3 anak SD'
  },
  {
    id: 10,
    title: 'Lomba Estafet Penguin Remaja',
    category: 'remaja',
    time: '09:30 WIB',
    prize: 'Rp 175.000',
    icon: '🐧',
    description: 'Lomba Model Baru dengan Keseruan dan Kekompakan',
    participants: 'Usia 13-17 tahun'
  },
  {
    id: 11,
    title: 'Lomba Estafet Tepung',
    category: 'bapak',
    time: '11:00 WIB',
    prize: 'Rp 200.000',
    icon: '🌾',
    description: 'Lomba Estafet Tepung dengan Keseruan dan Kekompakan',
    participants: 'Tim 3 Orang'
  },
  {
    id: 12,
    title: 'Lomba Joget Kursi Ibu',
    category: 'ibu',
    time: '13:00 WIB',
    prize: 'Rp 200.000',
    icon: '🪑',
    description: 'Lomba joget kursi dengan keseruan untuk ibu-ibu',
    participants: 'Tim 3 Orang'
  },
  {
    id: 13,
    title: 'Lomba Make Up Buta',
    category: 'keluarga',
    time: '15:00 WIB',
    prize: 'Rp 200.000',
    icon: '💄',
    description: 'Lomba Make Up Buta dengan Keseruan dan kekompakan Pasangan',
    participants: 'Tim 2 Pasang'
  },
];

export const getActivityByCategory = (category: string) => {
  if (category === 'all') return activities;
  return activities.filter(a => a.category === category);
};

export const categories = [
  { id: 'all', label: 'Semua', icon: '📋' },
  { id: 'anak', label: 'Anak-anak', icon: '👶' },
  { id: 'ibu', label: 'Ibu-ibu', icon: '👩' },
  { id: 'bapak', label: 'Bapak-bapak', icon: '👨' },
  { id: 'remaja', label: 'Remaja', icon: '🧑' },
  { id: 'keluarga', label: 'Umum/Keluarga', icon: '👨‍👩‍👧' },
];
