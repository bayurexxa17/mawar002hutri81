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
    time: '06:00 - 07.00',
    event: 'Registrasi Peserta',
    location: 'Lapangan Fasum',
    icon: '🪪'
  },
  {
    id: 2,
    time: '07:00 - 08.00',
    event: 'Upacara Bendera',
    location: 'Lapangan Fasum',
    icon: '🚩'
  },
  {
    id: 3,
    time: '08:00 - 08.30',
    event: 'Foto Bersama',
    location: 'Lapangan Fasum',
    icon: '📸'
  },
  {
    id: 4,
    time: '08:30 - 09.30 ',
    event: 'Lomba Anak-Anak Dimulai',
    location: 'Area Lomba A',
    icon: '🎈',
    isHighlight: true
  },
  {
    id: 5,
    time: '09:30 - 11.00',
    event: 'Lomba Remaja Dimulai',
    location: 'Area Lomba A',
    icon: '🎈'
  },
  {
    id: 6,
    time: '12:00',
    event: 'Istirahat & Sholat Dzuhur',
    location: 'Mushola Nurul Ukhuwah',
    icon: '🕌'
  },
  {
    id: 7,
    time: '13:00 - 14.00',
    event: 'Lomba Bapak Dimulai',
    location: 'Area Lomba A',
    icon: '🎈'
  },
  {
    id: 8,
    time: '14:00 - 15.00',
    event: 'Lomba Ibu Dimulai',
    location: 'Area Lomba A',
    icon: '🎈'
  },
  {
    id: 9,
    time: '15:00 - 16.30',
    event: 'Lomba Umum/Keluarga Dimulai',
    location: 'Lapangan Utama',
    icon: '🎈',
    isHighlight: true
  },
  {
    id: 10,
    time: '16:00 - 19.00',
    event: 'Istirahat & Sholat Maghrib',
    location: 'Mushola Nurul Ukhuwah',
    icon: '🕌'
  },
  {
    id: 11,
    time: '19:00 - 19.30',
    event: 'Hiburan Warga',
    location: 'Panggung Utama',
    icon: '🎸'
  },
  {
    id: 12,
    time: '19:30 - 20.00',
    event: 'Istirahat & Sholat Isya',
    location: 'Mushola Nurul Ukhuwah',
    icon: '🕌'
  },
  {
    id: 13,
    time: '20:00 - 20.30',
    event: 'Doorprize',
    location: 'Panggung Utama',
    icon: '🏆'
  },
  {
    id: 14,
    time: '20:30 - 21.30',
    event: 'Penilaian Hias Tumpeng oleh Juri dan Warga',
    location: 'Lapangan Utama',
    icon: '🍙',
    isHighlight: true
  },
  {
    id: 15,
    time: '21:30 - 22.30',
    event: 'Pembagian Hadiah & Penutupan',
    location: 'Panggung Utama',
    icon: '🎁'
  },
];
