export interface Statistic {
  id: number;
  value: string | number;
  label: string;
  icon: string;
  color: string;
  suffix?: string;
}

export const statistics: Statistic[] = [
  {
    id: 1,
    value: '17',
    label: 'Agustus 2026',
    icon: '📅',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 2,
    value: '10+',
    label: 'Jenis Lomba',
    icon: '🏆',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 3,
    value: '50',
    label: 'Partisipasi Warga /KK',
    icon: '💰',
    color: 'from-green-500 to-green-600',
    suffix: 'k'
  },
  {
    id: 4,
    value: '150+',
    label: 'Peserta',
    icon: '👥',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 5,
    value: '18',
    label: 'Rundown Acara',
    icon: '📋',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 6,
    value: '1',
    label: 'Hari Kemerdekaan',
    icon: '🇮🇩',
    color: 'from-red-600 to-white'
  }
];

export const liveStats = {
  registered: 127,
  viewed: 1543,
  daysLeft: 0,
  hoursLeft: 0,
  minutesLeft: 0,
  secondsLeft: 0
};
