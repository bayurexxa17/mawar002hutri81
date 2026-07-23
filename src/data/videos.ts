export interface VideoItem {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string; // YouTube / local / Drive link
  duration?: string;
  year: number;
}

export const videos: VideoItem[] = [
  {
    id: 1,
    title: 'Upacara Bendera HUT RI 2024',
    category: 'upacara',
    thumbnail: 'images/Upacara Bendera 1.png',
    videoUrl: 'https://www.youtube.com/watch?v=UuPaS81n0xg&list=RDUuPaS81n0xg&start_radio=1',
    duration: '1:46',
    year: 2026
  },
  {
    id: 2,
    title: 'Keseruan Lomba Panjat Pinang',
    category: 'lomba',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '3:15',
    year: 2024
  },
  {
    id: 3,
    title: 'Hiburan Malam Puncak - Band Warga',
    category: 'hiburan',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '8:40',
    year: 2024
  },
  {
    id: 4,
    title: 'Pembagian Hadiah Juara',
    category: 'penghargaan',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '2:30',
    year: 2024
  },
];

export const videoCategories = ['all', 'upacara', 'lomba', 'hiburan', 'penghargaan'];
