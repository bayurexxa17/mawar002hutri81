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
    time: '08:00 WIB',
    prize: 'Rp 100.000',
    icon: '🎈',
    description: 'Lomba makan kerupuk tanpa tangan untuk anak-anak',
    participants: 'Usia 5-12 tahun'
  },
  {
    id: 2,
    title: 'Lomba Panjat Pinang',
    category: 'umum',
    time: '10:00 WIB',
    prize: 'Rp 500.000',
    icon: '🎋',
    description: 'Panjat pinang beregu dengan hadiah menarik di puncak',
    participants: 'Tim 5 orang'
  },
  {
    id: 3,
    title: 'Lomba Balap Karung',
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
    category: 'umum',
    time: '14:00 WIB',
    prize: 'Rp 300.000',
    icon: '💪',
    description: 'Kompetisi tarik tambang antar RT',
    participants: 'Tim 8 orang'
  },
  {
    id: 5,
    title: 'Lomba Kebersihan Lingkungan',
    category: 'ibu',
    time: '09:00 WIB',
    prize: 'Rp 200.000',
    icon: '🧹',
    description: 'Lomba kebersihan dan keindahan halaman rumah',
    participants: 'Ibu rumah tangga'
  },
  {
    id: 6,
    title: 'Lomba Masak Nasi Goreng',
    category: 'ibu',
    time: '11:00 WIB',
    prize: 'Rp 250.000',
    icon: '🍳',
    description: 'Kreasi nasi goreng nusantara',
    participants: 'Ibu-ibu PKK'
  },
  {
    id: 7,
    title: 'Lomba Egrang',
    category: 'remaja',
    time: '13:00 WIB',
    prize: 'Rp 150.000',
    icon: '🦵',
    description: 'Lomba jalan pakai egrang',
    participants: 'Usia 13-17 tahun'
  },
  {
    id: 8,
    title: 'Lomba Joget Balo',
    category: 'umum',
    time: '16:00 WIB',
    prize: 'Rp 200.000',
    icon: '💃',
    description: 'Lomba joget dengan balon tanpa pecah',
    participants: 'Pasangan'
  },
  {
    id: 9,
    title: 'Lomba Cerdas Cermat',
    category: 'anak',
    time: '09:30 WIB',
    prize: 'Rp 150.000',
    icon: '🧠',
    description: 'Kuis pengetahuan umum dan sejarah Indonesia',
    participants: 'Tim 3 anak SD'
  },
  {
    id: 10,
    title: 'Lomba Sepeda Hias',
    category: 'anak',
    time: '07:00 WIB',
    prize: 'Rp 175.000',
    icon: '🚴',
    description: 'Parade sepeda hias bertema kemerdekaan',
    participants: 'Usia 6-12 tahun'
  }
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
