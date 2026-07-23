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
    year: 2026
  },
  {
    id: 2,
    title: 'Futsal Mini',
    category: 'lomba',
    image: 'images/Lomba Futsal Mini.png',
    year: 2026
  },
  {
    id: 3,
    title: 'Lomba Makan Kerupuk',
    category: 'lomba',
    image: 'images/Lomba Makan Kerupuk.png',
    year: 2026
  },
  {
    id: 4,
    title: 'Lomba Estafet Penguin Remaja',
    category: 'lomba',
    image: 'images/Lomba Estafet Penguin Remaja.png',
    year: 2026
  },
  {
    id: 5,
    title: 'Lomba Estafet Penguin Anak',
    category: 'lomba',
    image: 'images/Lomba Estafet Penguin Anak.png',
    year: 2026
  },
  {
    id: 6,
    title: 'Lomba Tarik Tambang',
    category: 'lomba',
    image: 'images/Lomba Tarik Tambang.png',
    year: 2026
  },
  {
    id: 7,
    title: 'Lomba Fashion Week Daster',
    category: 'lomba',
    image: 'images/Lomba Fashion Week Daster.png',
    year: 2026
  },
  {
    id: 8,
    title: 'Lomba Hias Tumpeng',
    category: 'lomba',
    image: 'images/Lomba Hias Tumpeng.png',
    year: 2026
  },
  {
    id: 9,
    title: 'Lomba Joget Kursi Bapak',
    category: 'lomba',
    image: 'images/Lomba Joget Kursi Bapak.png',
    year: 2026
  },
  {
    id: 10,
    title: 'Lomba Joget Kursi Ibu',
    category: 'lomba',
    image: 'images/Lomba Joget Kursi Ibu 1.png',
    year: 2026
  },
  {
    id: 11,
    title: 'Lomba Joget Kursi Ibu',
    category: 'lomba',
    image: 'images/Lomba Joget Kursi Ibu 2.png',
    year: 2026
  },
  {
    id: 12,
    title: 'Lomba Salah sambung',
    category: 'lomba',
    image: 'images/Lomba Salah sambung.png',
    year: 2026
  },
  {
    id: 13,
    title: 'Lomba Estafet Tepung',
    category: 'lomba',
    image: 'images/Lomba Estafet Tepung.png',
    year: 2026
  },
  {
    id: 14,
    title: 'Lomba Make Up Buta',
    category: 'lomba',
    image: 'images/Lomba Make Up Buta.png',
    year: 2026
  }
];

export const galleryCategories = ['all', 'upacara', 'lomba', 'hiburan', 'penghargaan', 'dekorasi', 'kebersamaan'];
