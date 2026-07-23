export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  year: number;
}

export const gallery: GalleryItem[] = [
  {
    id: 1,
    title: 'Upacara Bendera 2025',
    category: 'upacara',
    image: 'images/Upacara Bendera 1.png',
    year: 2025
  },
  {
    id: 2,
    title: 'Panjat Pinang Seru',
    category: 'lomba',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800',
    year: 2025
  },
  {
    id: 3,
    title: 'Lomba Makan Kerupuk',
    category: 'lomba',
    image: 'https://images.unsplash.com/photo-1566417713204-3a9a7e7e1e3c?w=800',
    year: 2025
  },
  {
    id: 4,
    title: 'Pentas Seni Budaya',
    category: 'hiburan',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    year: 2025
  },
  {
    id: 5,
    title: 'Pembagian Hadiah',
    category: 'penghargaan',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800',
    year: 2025
  },
  {
    id: 6,
    title: 'Lomba Tarik Tambang',
    category: 'lomba',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    year: 2025
  },
  {
    id: 7,
    title: 'Dekorasi Merah Putih',
    category: 'dekorasi',
    image: 'https://images.unsplash.com/photo-1567093322484-bcf32a1897e1?w=800',
    year: 2025
  },
  {
    id: 8,
    title: 'Warga Berfoto Bersama',
    category: 'kebersamaan',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    year: 2025
  }
];

export const galleryCategories = ['all', 'upacara', 'lomba', 'hiburan', 'penghargaan', 'dekorasi', 'kebersamaan'];
