export interface FundingSource {
  id: number;
  sumber: string;
  jumlah: number;
  catatan: string;
  status: 'confirmed' | 'pending' | 'need_confirm';
}

export const fundingSources: FundingSource[] = [
  { id: 1, sumber: 'Kas RT/RW (Ciptaland Mawar)', jumlah: 2500000, catatan: 'Saldo kas per Juli 2026', status: 'confirmed' },
  { id: 2, sumber: 'Donasi Warga Blok Mawar', jumlah: 8500000, catatan: '170 KK x rata-rata 50rb', status: 'confirmed' },
  { id: 3, sumber: 'Sinar Pratama', jumlah: 1000000, catatan: 'Donatur langganan - BARU', status: 'need_confirm' },
  { id: 4, sumber: 'Kelong Baba', jumlah: 1000000, catatan: 'Donatur langganan', status: 'need_confirm' },
  { id: 5, sumber: 'Alfamart', jumlah: 1000000, catatan: 'Minimarket', status: 'need_confirm' },
  { id: 6, sumber: 'Indomaret', jumlah: 1000000, catatan: 'Minimarket', status: 'need_confirm' },
  { id: 7, sumber: 'Developer Ciptaland', jumlah: 1000000, catatan: 'PT Ciptaland Properti', status: 'confirmed' },
  { id: 8, sumber: 'Biznet Home', jumlah: 1000000, catatan: 'Provider internet', status: 'need_confirm' },
  { id: 9, sumber: 'XL Axiata', jumlah: 1000000, catatan: 'Telco provider', status: 'confirmed' },
  { id: 10, sumber: 'Proxinet', jumlah: 500000, catatan: 'Provider', status: 'confirmed' },
  { id: 11, sumber: 'IndiHome', jumlah: 500000, catatan: 'Telkom Group', status: 'confirmed' },
  { id: 12, sumber: 'Link Net / FirstMedia', jumlah: 1000000, catatan: 'Provider', status: 'confirmed' },
];

export const fundingTotal = fundingSources.reduce((sum, f) => sum + f.jumlah, 0);
