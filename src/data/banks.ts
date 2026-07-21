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
    id: 'bca',
    bank: 'BCA',
    bankName: 'Bank Central Asia',
    number: '8465 1234 567',
    holder: 'Aulia Komari (Bendahara HUT RI 81 Mawar)',
    icon: '🏦',
    color: 'from-blue-600 to-blue-800',
    isPrimary: true
  },
  {
    id: 'bri',
    bank: 'BRI',
    bankName: 'Bank Rakyat Indonesia',
    number: '0132 01 123456 50 1',
    holder: 'Puput (Bendahara 2 HUT RI 81)',
    icon: '🏛️',
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'mandiri',
    bank: 'MANDIRI',
    bankName: 'Bank Mandiri',
    number: '156 00 1234567 8',
    holder: 'Panitia HUT RI Ciptaland Mawar',
    icon: '🏦',
    color: 'from-yellow-500 to-yellow-700'
  },
  {
    id: 'bsi',
    bank: 'BSI',
    bankName: 'Bank Syariah Indonesia',
    number: '7089 1234 56',
    holder: 'Eka Rista Y (Penanggung Jawab)',
    icon: '🕌',
    color: 'from-green-600 to-green-800'
  }
];

export const eWallets: EWallet[] = [
  {
    id: 'dana',
    name: 'DANA',
    number: '0812-8839-5550',
    holder: 'Bayu S.Permana (Ketua Panitia)',
    icon: '💙',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'gopay',
    name: 'GoPay',
    number: '0831-8395-0205',
    holder: 'Sugiono (Wakil Ketua)',
    icon: '💚',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'ovo',
    name: 'OVO',
    number: '0813-7116-2792',
    holder: 'Lani (Sekretaris)',
    icon: '💜',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    number: '0812-8839-5550',
    holder: 'Bayu S.Permana',
    icon: '🧡',
    color: 'from-orange-500 to-red-500'
  }
];

export const qrisData = {
  id: 'qris-hutri81',
  name: 'QRIS HUT RI 81 Mawar',
  holder: 'Panitia HUT RI Ke-81 Ciptaland Mawar',
  note: 'Scan QRIS ini pakai semua e-wallet & mobile banking',
  // Ganti dengan file QRIS asli di public/images/qris.png
  image: '/images/qris-placeholder.png',
  merchantId: 'ID1023456789012 (contoh)'
};

export const donationInfo = {
  target: 19000000,
  terkumpul: 0, // akan dihitung dari donors
  whatsappKonfirmasi: [
    { name: 'Bendahara 1 - Aulia', wa: '6281234567892', phone: '0812-3456-7892' },
    { name: 'Bendahara 2 - Puput', wa: '6281234567893', phone: '0812-3456-7893' },
    { name: 'Ketua - Bayu', wa: '6281288395550', phone: '0812-8839-5550' },
  ]
};
