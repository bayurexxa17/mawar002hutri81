export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website?: string;
}

export const sponsors: Sponsor[] = [
  {
    id: 1,
    name: 'PT. Ciptaland Properti',
    logo: '🏢',
    tier: 'platinum',
    website: '#'
  },
  {
    id: 2,
    name: 'Toko Bangunan Jaya',
    logo: '🏪',
    tier: 'gold',
    website: '#'
  },
  {
    id: 3,
    name: 'Warung Makan Bu Siti',
    logo: '🍴',
    tier: 'gold',
    website: '#'
  },
  {
    id: 4,
    name: 'Apotek Sehat Selalu',
    logo: '💊',
    tier: 'silver',
    website: '#'
  },
  {
    id: 5,
    name: 'Bengkel Motor Maju',
    logo: '🔧',
    tier: 'silver',
    website: '#'
  },
  {
    id: 6,
    name: 'Minimarket 24 Jam',
    logo: '🛒',
    tier: 'silver',
    website: '#'
  },
  {
    id: 7,
    name: 'Salon Cantik',
    logo: '💇',
    tier: 'bronze',
    website: '#'
  },
  {
    id: 8,
    name: 'Laundry Bersih',
    logo: '🧺',
    tier: 'bronze',
    website: '#'
  }
];

export const getSponsorsByTier = (tier: string) => {
  return sponsors.filter(s => s.tier === tier);
};
