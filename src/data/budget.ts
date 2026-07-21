export interface BudgetDetailItem {
  no: number;
  item: string;
  detail: string;
  budget: number | string;
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
  totalKebutuhan: 32750000,
  targetDanaMasuk: 31000000,
  selisih: -1750000,
};

export const budgetComponents: BudgetComponent[] = [
  {
    id: 'rakyat',
    komponen: 'Total Anggaran — Pesta Rakyat (17 Agt)',
    jumlah: 8000000,
    detailKey: 'rakyat',
  },
  {
    id: 'volley',
    komponen: 'Total Anggaran — Mawar Cup Volley (Antar RT)',
    jumlah: 10000000,
    detailKey: 'volley',
  },
  {
    id: 'puncak',
    komponen: 'Total Anggaran — Malam Puncak (22 Agt)',
    jumlah: 14750000,
    detailKey: 'puncak',
  },
  {
    id: 'total',
    komponen: 'TOTAL KEBUTUHAN ANGGARAN',
    jumlah: 32750000,
    isTotal: true,
  },
  {
    id: 'dana',
    komponen: 'Total Dana Masuk (Pendanaan)',
    jumlah: 31000000,
    detailKey: 'dana',
  },
  {
    id: 'selisih',
    komponen: 'SELISIH (Dana Masuk - Kebutuhan)',
    jumlah: -1750000,
    isDeficit: true,
  },
];

export const budgetDetails: Record<string, { title: string; subtitle: string; items: BudgetDetailItem[]; total: number; validated?: boolean }> = {
  rakyat: {
    title: 'Rincian Pesta Rakyat - 17 Agustus 2026',
    subtitle: 'Perumahan Ciptaland Blok Mawar RT 002 / RW 014',
    total: 8000000,
    validated: true,
    items: [
      // FIXED: sebelumnya error syntax di baris 63 - kurang kurung kurawal buka & budget harus string/number
      { no: 1, item: 'Lomba Anak-anak', detail: 'Estafet Penguin - PJ: Ridho Ananda & Raihan', budget: 2000000 },
      { no: 2, item: 'Lomba Ibu-ibu', detail: 'Estafet tepung, Joget Rebut Kursi, Hias Tumpeng - PJ: Adib, Hafiz & Hafizah', budget: 2000000 },
      { no: 3, item: 'Lomba Bapak-bapak', detail: 'Tarik tambang, Joget Rebut Kursi, Estafet tepung - PJ: Satria & Fajar', budget: 2000000 },
      { no: 4, item: 'Lomba Umum & Jalan Santai', detail: 'Balap karung, Pukul Air, Doorprize - PJ: Pak Budi & Bu Siti', budget: 2000000 },
    ],
  },
  volley: {
    title: 'Rincian Mawar Volley Cup 2026',
    subtitle: 'Antar RT se-RW 014 - Ciptaland Cup',
    total: 10000000,
    validated: true,
    items: [
      { no: 1, item: 'Hadiah Uang Tunai', detail: 'Juara 1-4 Putra & Putri (Total 6.5jt)', budget: 6500000 },
      { no: 2, item: 'Operasional Pertandingan', detail: 'Wasit, perlengkapan, konsumsi, dll', budget: 2500000 },
      { no: 3, item: 'Tropi & Souvenir', detail: 'Piala bergilir + medali', budget: 1000000 },
    ],
  },
  puncak: {
    title: 'Rincian Malam Puncak HUT RI Ke-81',
    subtitle: '22 Agustus 2026 - Panggung Utama Ciptaland',
    total: 14750000,
    validated: true,
    items: [
      { no: 1, item: 'Konsumsi', detail: '250 porsi warga + panitia', budget: 3000000 },
      { no: 2, item: 'Sound System', detail: 'Kawan Pak Yon Audio', budget: 1500000 },
      { no: 3, item: 'MC Profesional', detail: 'Perlu konfirmasi nama final', budget: 1000000 },
      { no: 4, item: 'Baca Doa & Tausiyah', detail: 'Ustadz setempat', budget: 300000 },
      { no: 5, item: 'Spanduk & Banner', detail: 'Merah putih + backdrop panggung', budget: 1000000 },
      { no: 6, item: 'Sewa Panggung', detail: '6x8 meter + dekorasi', budget: 1500000 },
      { no: 7, item: 'Seragam Panitia', detail: '20 pcs x Rp 50.000', budget: 1000000 },
      { no: 8, item: 'Bola Volley', detail: '2 pcs x Rp 1.200.000', budget: 2400000 },
      { no: 9, item: 'Peluit & Perlengkapan', detail: 'Wasit & panitia', budget: 50000 },
      { no: 10, item: 'Lain-lain', detail: 'Tak terduga + kebersihan', budget: 3000000 },
    ],
  },
  dana: {
    title: 'Rincian Pendanaan - Target Dana Masuk',
    subtitle: 'Sumber donasi & kas RT 002 / RW 014',
    total: 31000000,
    items: [
      { no: 1, item: 'Kas RT/RW', detail: 'Kas Ciptaland Mawar', budget: 7000000 },
      { no: 2, item: 'Donasi Warga Mawar', detail: 'Iuran sukarela 150 KK', budget: 15000000 },
      { no: 3, item: 'Kelong Baba Seafood', detail: 'Donatur tetap', budget: 1000000 },
      { no: 4, item: 'Villa Bambu Resto', detail: 'Donatur tetap', budget: 1000000 },
      { no: 5, item: 'Developer Ciptaland', detail: 'PT. CiptaLand Properti', budget: 1000000 },
      { no: 6, item: 'Biznet', detail: 'Provider internet', budget: 1000000 },
      { no: 7, item: 'XL Axiata', detail: 'Provider seluler', budget: 1000000 },
      { no: 8, item: 'Wesli Laundry', detail: 'Usaha warga', budget: 1000000 },
      { no: 9, item: 'IndiHome', detail: 'Telkom', budget: 500000 },
      { no: 10, item: 'Pak Yoga (TC 15) - Banner', detail: 'Sponsor Banner', budget: 1000000 },
      { no: 11, item: 'Dito Bor Ikan', detail: 'Usaha warga', budget: 500000 },
      { no: 12, item: 'Link Net', detail: 'Provider', budget: 1000000 },
    ],
  },
};

export const formatRupiah = (num: number | string) => {
  if (typeof num === 'string') return num;
  const isNegative = num < 0;
  const abs = Math.abs(num);
  const formatted = new Intl.NumberFormat('id-ID').format(abs);
  return `${isNegative ? '- ' : ''}Rp ${formatted}`;
};

export const formatRupiahShort = (num: number | string) => {
  if (typeof num === 'string') return num;
  if (Math.abs(num) >= 1000000) {
    return `Rp ${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}jt`;
  }
  return formatRupiah(num);
};
