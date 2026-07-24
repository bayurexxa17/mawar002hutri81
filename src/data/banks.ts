export interface BankAccount {
  id: string;
  bank: string;
  bankName: string;
  number: string;
  holder: string;
  icon: string;
  color: string;
  isPrimary?: boolean;
}

export interface EWallet {
  id: string;
  name: string;
  number: string;
  holder: string;
  icon: string;
  color: string;
}

export const bankAccounts: BankAccount[] = [
  {
    id: 'seabank',
    bank: 'SeaBank',
    bankName: 'SeaBank',
    number: '901592977740',
    holder: 'Aulia Komari',
    icon: '🌊',
    color: 'from-orange-400 to-red-500',
    isPrimary: true
  },
  {
    id: 'dana',
    bank: 'DANA',
    bankName: 'DANA E-Wallet',
    number: '081364755007',
    holder: 'Aulia Komari',
    icon: '💙',
    color: 'from-blue-500 to-cyan-500',
    isPrimary: true
  }
];

export const eWallets: EWallet[] = [
  {
    id: 'seabank2',
    name: 'SeaBank',
    number: '901592977740',
    holder: 'Aulia Komari',
    icon: '🌊',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'dana2',
    name: 'DANA',
    number: '081364755007',
    holder: 'Aulia Komari',
    icon: '💙',
    color: 'from-blue-500 to-cyan-500'
  }
];

export const qrisData = {
  id: 'qris-hutri81',
  name: 'QRIS DANA - Aulia Komari',
  holder: 'Aulia Komari - Bendahara HUT RI 81 - 081364755007 / 62-813****5007',
  note: 'Scan QR ini pakai DANA untuk donasi',
  image: '/images/qris-placeholder.svg',
  merchantId: '62-813****5007 - Powered by DANA'
};

export const donationInfo = {
  target: 19000000,
  terkumpul: 0,
  whatsappKonfirmasi: [
    { name: 'Bendahara - Aulia Komari', wa: '6281364755007', phone: '081364755007' },
    { name: 'Bendahara - Aulia Komari (SeaBank)', wa: '6281364755007', phone: '081364755007' },
    { name: 'Ketua - Bayu S.Permana', wa: '6281288395550', phone: '0812-8839-5550' },
  ]
};
