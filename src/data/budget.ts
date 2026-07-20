export interface BudgetDetailItem {
  no: number;
  item: string;
  detail: string;
  budget: number;
}

export interface BudgetComponent {
  id: string;
  komponen: string;
  jumlah: number;
  isTotal?: boolean;
  isDeficit?: boolean;
  detailKey?: string;
}

export const budgetSummary = {
  totalKebutuhan: 17000000,
  targetDanaMasuk: 17000000,
  selisih: -0,
};

export const budgetComponents: BudgetComponent[] = [
  {
    id: 'Upacara Bendera & Aneka Perlombaan Rakyat',
    komponen: 'Total Anggaran — Aneka Perlombaan dan Pesta Rakyat (17 Agt)',
    jumlah: 10000000,
    detailKey: 'rakyat',
  },
  {
    id: 'puncak',
    komponen: 'Total Anggaran — Malam Puncak (22 Agt)',
    jumlah: 7000000,
    detailKey: 'puncak',
  },
  {
    id: 'total',
    komponen: 'TOTAL KEBUTUHAN ANGGARAN',
    jumlah: 17000000,
    isTotal: true,
  },
  {
    id: 'dana',
    komponen: 'Total Dana Masuk (Pendanaan)',
    jumlah: 0,
    detailKey: 'dana',
  },
  {
    id: 'selisih',
    komponen: 'SELISIH (Dana Masuk - Kebutuhan)',
    jumlah: -17000000,
    isDeficit: true,
  },
];

export const budgetDetails: Record<string, { title: string; subtitle: string; items: BudgetDetailItem[]; total: number; validated?: boolean }> = {
  rakyat: {
    title: 'Aneka Perlombaan Rakyat - 17 Agustus 2026',
    subtitle: 'Perumahan Ciptaland Blok Mawar RT 002 / RW 014',
    total: 10000000,
    validated: true,
    items: [
      { no: 1, item: 'Permainan Anak-anak', detail: 'Makan Kerupuk, Balap Kelereng, Estafet Penguin - PJ: Ridho Ananda & Raihan', budget: Tahap Perencanaan Biaya },
      { no: 2, item: 'Lomba Ibu-ibu', detail: 'Estafet tepung, Joget Rebut Kursi, Hias Tumpeng - PJ: Adib, Hafiz & Hanif', budget: Tahap Perencanaan Biaya },
      { no: 3, item: 'Lomba Bapak-bapak', detail: 'Tarik tambang, Joget Rebut Kursi, Estafet tepung  - PJ: satria & Fahri 2', budget: Tahap Perencanaan Biaya },
      { no: 4, item: 'Lomba Keluarga', detail: 'MAke Up Buta  - PJ: Dio & Reza', budget: Tahap Perencanaan Biaya },
    ],
  },
  puncak: {
    title: 'Rincian Malam Puncak HUT RI Ke-81',
    subtitle: '17 Agustus 2026 - Panggung Utama Ciptaland',
    total: 7000000,
    validated: true,
    items: [
      { no: 1, item: 'Konsumsi', detail: '250 porsi warga + panitia', budget: 3000000 },
      { no: 2, item: 'Sound System', detail: 'Kawan Pak Yon Audio', budget: 1000000 },
      { no: 3, item: 'Baca Doa & Tausiyah', detail: 'Ustadz setempat', budget: 300000 },
      { no: 4, item: 'Spanduk & Banner', detail: 'Merah putih + backdrop panggung', budget: 1000000 },
      { no: 5, item: 'Seragam Panitia', detail: '20 pcs x Rp 50.000', budget: 1000000 },
      { no: 6, item: 'Lain-lain', detail: 'Tak terduga + kebersihan', budget: 3000000 },
    ],
  },
  dana: {
    title: 'Rincian Pendanaan - Target Dana Masuk',
    subtitle: 'Sumber donasi & kas RT 002 / RW 014',
    total: 17000000,
    items: [
      { no: 1, item: 'Kas RT/RW', detail: 'Kas Ciptaland Mawar', budget: 2500000 },
      { no: 2, item: 'Donasi Warga Mawar', detail: 'Iuran sukarela 170 KK', budget: 8500000 },
      { no: 3, item: 'Kelong Baba Seafood', detail: 'Donatur tetap', budget: 1000000 },
      { no: 5, item: 'Developer Ciptaland', detail: 'PT. CiptaLand Properti', budget: 1000000 },
      { no: 6, item: 'Biznet', detail: 'Provider internet', budget: 1000000 },
      { no: 7, item: 'XL Axiata', detail: 'Provider seluler', budget: 1000000 },
      { no: 9, item: 'IndiHome', detail: 'Telkom', budget: 500000 },
      { no: 12, item: 'Link Net', detail: 'Provider', budget: 1000000 },
    ],
  },
};

export const formatRupiah = (num: number) => {
  const isNegative = num < 0;
  const abs = Math.abs(num);
  const formatted = new Intl.NumberFormat('id-ID').format(abs);
  return `${isNegative ? '- ' : ''}Rp ${formatted}`;
};

export const formatRupiahShort = (num: number) => {
  if (Math.abs(num) >= 1000000) {
    return `Rp ${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}jt`;
  }
  return formatRupiah(num);
};
