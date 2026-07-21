export interface Activity {
  id: number;
  title: string;
  category: 'anak' | 'ibu' | 'umum' | 'remaja';
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
    prize: 'Rp 100.000',
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
    icon: '🎋',
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
    description: 'Balap karung klasik untuk anak-anak',
    participants: 'Usia 7-15 tahun'
  },
  {
    id: 4,
    title: 'Lomba Tarik Tambang',
    category: 'bapak',
    time: '11:00 WIB',
    prize: 'Rp 300.000',
    icon: '💪',
    description: 'Kompetisi tarik tambang antar RT',
    participants: 'Tim 8 orang'
  },
  {
    id: 5,
    title: 'Lomba Hias Tumpeng',
    category: 'ibu',
    time: '13:00 WIB',
    prize: 'Rp 250.000',
    icon: '🧹',
    description: 'Lomba Hias Tumpeng Kreasi Para Ibu dengan Cita Rasa dan Tampilan Menarik dan Terbaik',
    participants: 'Ibu rumah tangga'
  },
  {
    id: 6,
    title: 'Lomba Fashion Week Daster',
    category: 'ibu',
    time: '13:00 WIB',
    prize: 'Rp 200.000',
    icon: '🍳',
    description: 'Kreasikan Gaya dan Penampilan Terbaik dan Terlucu',
    participants: 'Ibu-ibu'
  },
  {
    id: 7,
    title: 'Salah Sambung',
    category: 'remaja',
    time: '09:30 WIB',
    prize: 'Rp 150.000',
    icon: '🦵',
    description: 'Lomba Salah Sambung Melatih Fokus, Kekompakan, Kecepatan dan Berfikir',
    participants: 'Usia 13-17 tahun'
  },
  {
    id: 8,
    title: 'Lomba Joget Kurai',
    category: 'bapk',
    time: '11:00 WIB',
    prize: 'Rp 200.000',
    icon: '💃',
    description: 'Lomba joget dengan Keseruan ',
    participants: 'Pasangan'
  },
  {
    id: 9,
    title: 'Lomba Estafet Penguin',
    category: 'anak',
    time: '08:30 WIB',
    prize: 'Rp 150.000',
    icon: '🧠',
    description: 'Lomba Model Baru dengan Keseruan dan Kekompakan',
    participants: 'Tim 3 anak SD'
  },
  {
    id: 10,
    title: 'Lomba Estafet Penguin',
    category: 'remaja',
    time: '09:30 WIB',
    prize: 'Rp 175.000',
    icon: '🚴',
    description: 'Lomba Model Baru dengan Keseruan dan Kekompaka',
    participants: 'Usia 13-17 tahun'
  },
  {
    id: 11,
    title: 'Lomba Estafet Tepung',
    category: 'bapak',
    time: '11:00 WIB',
    prize: 'Rp 200.000',
    icon: '🚴',
    description: 'Lomba Estafet Tepung dengan Keseruan dan Kekompaka',
    participants: 'Tim 3 Orang'
  },
  {
    id: 12,
    title: 'Lomba Joget Kurai',
    category: 'ibu',
    time: '13:00 WIB',
    prize: 'Rp 200.000',
    icon: '💃',
    description: 'Lomba joget dengan Keseruan ',
    participants: 'Tim 3 Orang'
  },
  {
    id: 13,
    title: 'Lomba Make Up Buta',
    category: 'Keluarga',
    time: '15:00 WIB',
    prize: 'Rp 200.000',
    icon: '💃',
    description: 'Lomba Make Up Buta dengan Keseruan dan kekompakan Pasangan ',
    participants: 'Tim 3 Pasanga'
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
  { id: 'remaja', label: 'Remaja', icon: '🧑' },
  { id: 'umum', label: 'Umum', icon: '👥' }
];
