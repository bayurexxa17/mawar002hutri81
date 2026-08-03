// ============================================
// LOMBA DATA
// ============================================
export interface LombaDetailSection { heading: string; items: string[]; }

export interface LombaItem {
  id: string;
  nama: string;
  icon: string;
  kategori: 'anak' | 'remaja' | 'bapak' | 'ibu' | 'keluarga' | 'umum';
  kategoriLabel: string;
  waktu: string;
  hadiah: string;
  peserta: string;
  deskripsi: string;
  peraturan: string[];
  detailSections: LombaDetailSection[];
}

export const lombaList: LombaItem[] = [
  {
    id: 'makan-kerupuk', nama: 'Lomba Makan Kerupuk', icon: '🎈', kategori: 'anak', kategoriLabel: 'anak',
    waktu: '08:30 WIB', hadiah: 'Menarik', peserta: 'Usia 5-12 tahun',
    deskripsi: 'Lomba makan kerupuk tanpa tangan untuk anak-anak',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Anak-anak'] },
      { heading: 'Peralatan', items: ['Kerupuk', 'Tali', 'Tiang gantungan'] },
      { heading: 'Cara Bermain', items: ['Kerupuk digantung menggunakan tali.', 'Peserta berdiri tanpa menyentuh kerupuk menggunakan tangan.', 'Tangan harus berada di belakang badan.', 'Pemenang adalah peserta yang paling cepat menghabiskan kerupuk.'] },
    ],
  },
  {
    id: 'futsal-mini', nama: 'Futsal Mini', icon: '⚽', kategori: 'remaja', kategoriLabel: 'remaja',
    waktu: '09:30 WIB', hadiah: 'Menarik', peserta: 'Tim 5 orang',
    deskripsi: 'Futsal Mini beregu dengan hadiah menarik di puncak',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Tim 5 pemain.'] },
      { heading: 'Peraturan', items: ['Durasi pertandingan 2 x 10 menit.', 'Sistem gugur.', 'Tidak diperbolehkan bermain kasar.', 'Keputusan wasit bersifat mutlak.', 'Pemenang ditentukan dari jumlah gol terbanyak.'] },
    ],
  },
  {
    id: 'balap-kelereng', nama: 'Lomba Balap Kelereng', icon: '🏃', kategori: 'anak', kategoriLabel: 'anak',
    waktu: '08:30 WIB', hadiah: 'Menarik', peserta: 'Usia 7-15 tahun',
    deskripsi: 'Balap kelereng klasik untuk anak-anak, melatih fokus dan keseimbangan',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Anak-anak'] },
      { heading: 'Peralatan', items: ['Sendok', 'Kelereng'] },
      { heading: 'Cara Bermain', items: ['Kelereng diletakkan di atas sendok.', 'Sendok digigit menggunakan mulut.', 'Tidak boleh dipegang tangan.', 'Bila kelereng jatuh, peserta kembali ke titik awal.', 'Peserta tercepat menjadi pemenang.'] },
    ],
  },
  {
    id: 'tarik-tambang', nama: 'Lomba Tarik Tambang', icon: '💪', kategori: 'bapak', kategoriLabel: 'bapak',
    waktu: '11:00 WIB', hadiah: 'Menarik', peserta: 'Tim 8 orang',
    deskripsi: 'Kompetisi tarik tambang antar RT - adu kekuatan dan kekompakan',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Dua tim.'] },
      { heading: 'Peraturan', items: ['Setiap tim memiliki jumlah peserta yang sama.', 'Tim menarik tali hingga tanda tengah melewati garis kemenangan.', 'Best of 3.'] },
    ],
  },
  {
    id: 'hias-tumpeng', nama: 'Lomba Hias Tumpeng', icon: '🍛', kategori: 'ibu', kategoriLabel: 'ibu',
    waktu: '13:00 WIB', hadiah: 'Menarik', peserta: 'Ibu rumah tangga',
    deskripsi: 'Lomba Hias Tumpeng Kreasi Para Ibu dengan Cita Rasa dan Tampilan Menarik dan Terbaik',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Ibu-ibu.'] },
      { heading: 'Waktu', items: ['Maksimal 60 menit.'] },
      { heading: 'Penilaian', items: ['Kreativitas', 'Kerapihan', 'Kebersihan', 'Keindahan penyajian', 'Kesesuaian tema Kemerdekaan', 'Kekompakan tim', 'Cita rasa (opsional apabila ada dewan juri)'] },
      { heading: 'Catatan', items: ['Peserta diperbolehkan menambah dekorasi maupun bahan makanan di luar anggaran pribadi selama tidak melanggar tema lomba.'] },
    ],
  },
  {
    id: 'fashion-daster', nama: 'Lomba Fashion Week Daster', icon: '👗', kategori: 'ibu', kategoriLabel: 'ibu',
    waktu: '13:00 WIB', hadiah: 'Menarik', peserta: 'Ibu-ibu',
    deskripsi: 'Kreasikan Gaya dan Penampilan Terbaik dan Terlucu',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Ibu-ibu.'] },
      { heading: 'Cara Bermain', items: ['Mengenakan daster dengan gaya sekreatif mungkin.', 'Berjalan di catwalk.', 'Menampilkan pose terbaik.', 'Boleh membawa properti sederhana.'] },
      { heading: 'Penilaian', items: ['Kepercayaan diri', 'Kreativitas', 'Ekspresi', 'Penampilan', 'Interaksi dengan penonton'] },
    ],
  },
  {
    id: 'salah-sambung', nama: 'Salah Sambung', icon: '🗣️', kategori: 'remaja', kategoriLabel: 'remaja',
    waktu: '09:30 WIB', hadiah: 'Menarik', peserta: 'Usia 13-17 tahun',
    deskripsi: 'Lomba Salah Sambung Melatih Fokus, Kekompakan, Kecepatan dan Berfikir',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Bebas.'] },
      { heading: 'Cara Bermain', items: ['MC menyebutkan awal kalimat.', 'Peserta wajib melanjutkan dengan cepat.', 'Jawaban salah atau terlalu lama dianggap gugur.', 'Sistem eliminasi.'] },
    ],
  },
  {
    id: 'estafet-penguin-anak', nama: 'Lomba Estafet Penguin Anak', icon: '🐧', kategori: 'anak', kategoriLabel: 'anak',
    waktu: '08:30 WIB', hadiah: 'Menarik', peserta: 'Tim 3 anak SD',
    deskripsi: 'Lomba Model Baru dengan Keseruan dan Kekompakan',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Anak-anak berpasangan.'] },
      { heading: 'Cara Bermain', items: ['Bola dijepit di antara kedua lutut.', 'Berjalan seperti penguin menuju garis finis.', 'Bola tidak boleh dipegang tangan.', 'Bila bola jatuh kembali ke titik sebelumnya.', 'Tim tercepat menang.'] },
    ],
  },
  {
    id: 'estafet-penguin-remaja', nama: 'Lomba Estafet Penguin Remaja', icon: '🐧', kategori: 'remaja', kategoriLabel: 'remaja',
    waktu: '09:30 WIB', hadiah: 'Menarik', peserta: 'Usia 13-17 tahun',
    deskripsi: 'Lomba Model Baru dengan Keseruan dan Kekompakan',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Remaja.'] },
      { heading: 'Cara Bermain', items: ['Sama seperti Estafet Penguin Anak, namun jarak lintasan lebih panjang dan dilakukan secara estafet antar anggota tim.'] },
    ],
  },
  {
    id: 'estafet-tepung', nama: 'Lomba Estafet Tepung', icon: '🌾', kategori: 'bapak', kategoriLabel: 'bapak',
    waktu: '11:00 WIB', hadiah: 'Menarik', peserta: 'Tim 3 Orang',
    deskripsi: 'Lomba Estafet Tepung dengan Keseruan dan Kekompakan',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Tim.'] },
      { heading: 'Peralatan', items: ['Tepung', 'Gelas', 'Baskom'] },
      { heading: 'Cara Bermain', items: ['Peserta berbaris ke belakang.', 'Tepung dipindahkan dari peserta pertama ke peserta terakhir melalui atas kepala.', 'Tidak boleh melihat ke belakang.', 'Tepung yang berhasil dikumpulkan paling banyak menjadi pemenang.'] },
    ],
  },
  {
    id: 'joget-kursi-ibu', nama: 'Lomba Joget Kursi Ibu', icon: '🪑', kategori: 'ibu', kategoriLabel: 'ibu',
    waktu: '13:00 WIB', hadiah: 'Menarik', peserta: 'Tim 3 Orang',
    deskripsi: 'Lomba joget kursi dengan keseruan untuk ibu-ibu',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Ibu-ibu.'] },
      { heading: 'Cara Bermain', items: ['Sama seperti Joget Kursi Bapak.', 'Penilaian berdasarkan ketahanan hingga babak final.'] },
    ],
  },
  {
    id: 'make-up-buta', nama: 'Lomba Make Up Buta', icon: '💄', kategori: 'keluarga', kategoriLabel: 'keluarga',
    waktu: '15:00 WIB', hadiah: 'Menarik', peserta: 'Tim 2 Pasang',
    deskripsi: 'Lomba Make Up Buta dengan Keseruan dan kekompakan Pasangan',
    peraturan: ['Peserta wajib mendaftar ulang 30 menit sebelum lomba dimulai','Peserta wajib warga Ciptaland Blok Mawar RT 002/RW 014 (dibuktikan KK)','Keputusan juri tidak dapat diganggu gugat','Peserta yang curang akan didiskualifikasi','Hadiah diserahkan pada Malam Puncak 22 Agustus 2026'],
    detailSections: [
      { heading: 'Peserta', items: ['Berpasangan.'] },
      { heading: 'Peralatan', items: ['Alat make up.'] },
      { heading: 'Cara Bermain', items: ['Salah satu peserta ditutup matanya.', 'Peserta tersebut merias wajah pasangannya.', 'Tidak boleh membuka penutup mata.', 'Waktu maksimal 10 menit.'] },
    ],
  },
];

export const lombaCategories = [
  { id: 'semua', label: '📋 Semua', icon: '📋' },
  { id: 'anak', label: '👶 Anak-anak', icon: '👶' },
  { id: 'ibu', label: '👩 Ibu-ibu', icon: '👩' },
  { id: 'bapak', label: '👨 Bapak-bapak', icon: '👨' },
  { id: 'remaja', label: '🧑 Remaja', icon: '🧑' },
  { id: 'keluarga', label: '👨‍👩‍👧 Keluarga', icon: '👨‍👩‍👧' },
  { id: 'umum', label: '👥 Umum', icon: '👥' },
];

// ============================================
// PANITIA DATA
// ============================================
export interface PanitiaItem {
  nama: string;
  jabatan: string;
  hp: string;
  isCore?: boolean;
}

export const panitiaList: PanitiaItem[] = [
  { nama: 'IPTU Saharudin', jabatan: 'Ketua Pembina', hp: '', isCore: true },
  { nama: 'Syamsul Piliano', jabatan: 'Ketua Penasehat', hp: '', isCore: true },
  { nama: 'Eka Rista Y', jabatan: 'Penanggung Jawab', hp: '0821-7129-9984', isCore: true },
  { nama: 'Bayu S.Permana', jabatan: 'Ketua Panitia', hp: '0812-8839-5550', isCore: true },
  { nama: 'Sugiono', jabatan: 'Wakil Ketua', hp: '0831-8395-0205', isCore: true },
  { nama: 'Lani', jabatan: 'Sekretaris', hp: '0813-7116-2792', isCore: true },
  { nama: 'Aulia Komari', jabatan: 'Bendahara 1', hp: '0812-3456-7892', isCore: true },
  { nama: 'Puput', jabatan: 'Bendahara 2', hp: '0831-8330-3884', isCore: true },
  { nama: 'Aryo', jabatan: 'Runner', hp: '0856-0134-31284', isCore: true },
  { nama: 'Kiki', jabatan: 'Runner', hp: '0856-9524-7307' },
  { nama: 'Fauzan', jabatan: 'MC', hp: '0858-6834-8818' },
  { nama: 'Lukman', jabatan: 'MC', hp: '0813-7000-0090' },
  { nama: 'M.Dzaki', jabatan: 'Koordinator Lomba', hp: '0858-3660-5110' },
  { nama: 'Ridho Ananda', jabatan: 'Koordinator Lomba', hp: '0823-8718-8929' },
  { nama: 'Hanif', jabatan: 'Koordinator Lomba', hp: '0881-3712-0796' },
  { nama: 'Fahri', jabatan: 'MC', hp: '0821-2186-2140' },
  { nama: 'A.Fahri.K', jabatan: 'MC', hp: '0813-2924-1359' },
  { nama: 'Agha', jabatan: 'Koordinator Lomba', hp: '0851-9433-4760' },
  { nama: 'Adib', jabatan: 'Koordinator Lomba', hp: '0813-6365-2626' },
  { nama: 'Raihan Allif', jabatan: 'Koordinator Lomba', hp: '0895-3851-06729' },
  { nama: 'Satria', jabatan: 'Koordinator Lomba', hp: '0819-9201-0197' },
  { nama: 'Reza', jabatan: 'Koordinator Lomba', hp: '08xx-xxx-xxx' },
];

// ============================================
// BUDGET DATA
// ============================================
export interface BudgetRow {
  komponen: string;
  jumlah: number;
  detailKey?: string;
  isTotal?: boolean;
  isSurplus?: boolean;
}

export const budgetRows: BudgetRow[] = [
  { komponen: 'Total Anggaran — Pesta Rakyat (17 Agt)', jumlah: 10000000, detailKey: 'pestaRakyat' },
  { komponen: 'Total Anggaran — Malam Puncak (22 Agt Malam)', jumlah: 7000000, detailKey: 'malamPuncak' },
  { komponen: 'TOTAL KEBUTUHAN ANGGARAN', jumlah: 17000000, isTotal: true },
  { komponen: 'Total Dana Masuk (Pendanaan)', jumlah: 17000000, detailKey: 'danaMasuk' },
  { komponen: 'SELISIH (Dana Masuk - Kebutuhan)', jumlah: 0, isSurplus: true },
];

export interface BudgetDetail { item: string; qty: string; harga: number; subtotal: number; }
export const budgetDetails: Record<string, BudgetDetail[]> = {
  pestaRakyat: [
    { item: 'Hadiah & Piala Lomba', qty: '13 lomba', harga: 500000, subtotal: 4000000 },
    { item: 'Peralatan Lomba', qty: '1 paket', harga: 1500000, subtotal: 1500000 },
    { item: 'Konsumsi & Snack Siang', qty: '1 paket', harga: 2500000, subtotal: 2500000 },
    { item: 'Dekorasi & Sound System', qty: '1 paket', harga: 2000000, subtotal: 2000000 },
  ],
  malamPuncak: [
    { item: 'Panggung & Backdrop', qty: '1 set', harga: 2000000, subtotal: 2000000 },
    { item: 'Hiburan & MC', qty: '1 paket', harga: 1500000, subtotal: 1500000 },
    { item: 'Konsumsi Malam', qty: '1 paket', harga: 2000000, subtotal: 2000000 },
    { item: 'Dokumentasi & Lain-lain', qty: '1 paket', harga: 1500000, subtotal: 1500000 },
  ],
  danaMasuk: [
    { item: 'Iuran Warga (Rp50.000 x KK)', qty: '±200 KK', harga: 50000, subtotal: 10000000 },
    { item: 'Sponsor & Donatur', qty: 'Beberapa', harga: 0, subtotal: 5000000 },
    { item: 'Donasi Online (QRIS/Transfer)', qty: 'Terbuka', harga: 0, subtotal: 2000000 },
  ],
};

export function formatRupiah(val: number): string {
  return 'Rp ' + Math.abs(val).toLocaleString('id-ID');
}

// ============================================
// RUNDOWN DATA
// ============================================
export interface RundownItem {
  waktu: string;
  kegiatan: string;
  icon: string;
  keterangan?: string;
}

export const rundownPagi: RundownItem[] = [
  { waktu: '06:00', kegiatan: 'Persiapan Lokasi & Registrasi Peserta', icon: '📋', keterangan: 'Panitia & Peserta' },
  { waktu: '07:00', kegiatan: 'Upacara Bendera & Pembukaan Resmi', icon: '🇮🇩', keterangan: 'Seluruh Warga' },
  { waktu: '07:00', kegiatan: 'Sambutan Ketua RT & Ketua Panitia', icon: '🎤', keterangan: 'Undangan' },
  { waktu: '08:00', kegiatan: 'Lomba Anak-anak (Makan Kerupuk, Balap Kelereng, Estafet Penguin)', icon: '👶', keterangan: 'Usia 5-15 tahun' },
  { waktu: '10:00', kegiatan: 'Lomba Remaja (Futsal Mini, Salah Sambung, Estafet Penguin)', icon: '🧑', keterangan: 'Usia 13-17 tahun' },
  { waktu: '11:00', kegiatan: 'Lomba Bapak-bapak (Tarik Tambang)', icon: '🪢', keterangan: 'Bapak-bapak' },
  { waktu: '12:00', kegiatan: 'Istirahat, Sholat & Makan Siang', icon: '🍛', keterangan: 'Seluruh Warga' },
  { waktu: '13:00', kegiatan: 'Lomba Ibu-ibu (Hias Tumpeng, Fashion Daster, Joget Kursi)', icon: '👗', keterangan: 'Ibu-ibu' },
  { waktu: '16:00', kegiatan: 'Lomba Keluarga (Make Up Buta)', icon: '👨‍%9C_👩‍%9C_👧', keterangan: 'Pasangan' },
  { waktu: '17:00', kegiatan: 'Penutupan Seluruh Perlombaan & Persiapan Pengumuman Pemenang', icon: '✅' },
];

export const rundownMalam: RundownItem[] = [
  { waktu: '18:30-19:00', kegiatan: 'Persiapan Panitia & Registrasi Kehadiran Warga', icon: '🎊', keterangan: 'Persiapan teknis, sound, panggung, kursi, dll' },
  { waktu: '19:00-19:05', kegiatan: 'Pembukaan Malam Puncak', icon: '🎤', keterangan: 'Pembukaan oleh MC' },
  { waktu: '19:05-19:10', kegiatan: 'Menyanyikan Lagu Indonesia Raya', icon: '🎶', keterangan: 'Piano by Ameera' },
  { waktu: '19:10-19:15', kegiatan: 'Pembacaan Doa', icon: '🤲', keterangan: 'Tokoh Agama' },
  { waktu: '19:15-19:25', kegiatan: 'Sambutan Ketua Panitia', icon: '🎙️', keterangan: 'Bayu S. Permana' },
  { waktu: '19:25-19:35', kegiatan: 'Sambutan Ketua RT', icon: '🏘️', keterangan: 'Bpk Eka Rista Yudhistira' },
  { waktu: '19:35-19:50', kegiatan: 'Tari Persembahan', icon: '💃', keterangan: 'Talenta Anak' },
  { waktu: '19:50-20:05', kegiatan: 'Tari Zapin', icon: '🌾💃', keterangan: 'Talenta Anak' },
  { waktu: '20:05-20:20', kegiatan: 'Tari Gugur Gunung', icon: '🌾💃', keterangan: 'Talenta Anak' },
  { waktu: '20:20-20:35', kegiatan: 'Tari Tor-Tor', icon: '🌾💃', keterangan: 'Talenta Anak' },
  { waktu: '20:35-21:00', kegiatan: 'Penilaian Hias Tumpeng', icon: '🍚🏆', keterangan: 'Dewan Juri & Warga' },
  { waktu: '21:00-21:20', kegiatan: 'Pengumuman & Penyerahan Hadiah Lomba Anak', icon: '🏅🎁', keterangan: 'Ketua Panitia & Sponsor' },
  { waktu: '21:20-21:40', kegiatan: 'Pengumuman & Penyerahan Hadiah Lomba Dewasa', icon: '🏆🎁', keterangan: 'Ketua RT & Panitia' },
  { waktu: '21:40-22:00', kegiatan: 'Doorprize Warga', icon: '🎉🎁', keterangan: 'MC' },
  { waktu: '22:00:22:15', kegiatan: 'Hiburan & Foto Bersama Seluruh Warga', icon: '📸🎶', keterangan: 'Dokumentasi' },
  { waktu: '22:15-22:20', kegiatan: 'Penutupan & Ucapan Terima Kasih', icon: '🙏🎤', keterangan: 'MC' },
  { waktu: '22:20', kegiatan: 'Ramah Tamah & Makan Bersama (Tumpeng,dll)', icon: '🏁🍽️', keterangan: 'Seluruh Warga' },
];

// ============================================
// INVENTORY DATA
// ============================================
export interface InventoryItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  kategori: string;
  keterangan: string;
}

export const initialInventoryList: InventoryItem[] = [
  { id: 'INV-01', nama: 'Tali Tambang Lomba', jumlah: 2, satuan: 'Pcs', kategori: 'Alat Lomba', keterangan: 'Kondisi baik, disimpan di gudang RT' },
  { id: 'INV-02', nama: 'Sound System Portable', jumlah: 1, satuan: 'Set', kategori: 'Elektronik', keterangan: 'Milik warga RT 002' },
  { id: 'INV-03', nama: 'Spanduk Backdrop', jumlah: 1, satuan: 'Pcs', kategori: 'Dekorasi', keterangan: 'Ukuran 4x2 meter' },
  { id: 'INV-04', nama: 'Sendok Balap Kelereng', jumlah: 30, satuan: 'Pcs', kategori: 'Alat Lomba', keterangan: 'Disimpan dalam boks panitia' },
];

// ============================================
// TALENTA MALAM PUNCAK (22 AGUSTUS 2026)
// ============================================
export interface TalentaItem {
  id?: number;
  no: number;
  jenis: string;
  nama: string;
  jumlah: string;
  durasi: string;
  pj: string;
  status: string;
}

export const initialTalentaList: TalentaItem[] = [
  { no: 1, jenis: 'Tari Zapin', nama: 'Whesni, Zahra, Lexa, Lexi, Syifa, dkk', jumlah: '', durasi: '', pj: '', status: '' },
  { no: 2, jenis: 'Tari Gugur Gunung', nama: 'Boru, Amora, Attaya, Namira, Raya', jumlah: '5', durasi: '', pj: '', status: '' },
  { no: 3, jenis: 'Piano (Instrumental)', nama: 'Ameera', jumlah: '1', durasi: '', pj: '', status: '' },
  { no: 4, jenis: 'Tarian Wajib – Persembahan', nama: 'Alifa, Hani, Lara, Acen, Sari', jumlah: '5', durasi: '', pj: '', status: '' },
  { no: 5, jenis: 'Tarian Wajib – Tor Tor', nama: 'Raisa, Shira, Razka, Almera, Shakila, Nabila, Adiibah, Arumi, Mikachan, Hana, Khalisa, Nouren, Inaya, Tisha', jumlah: '14', durasi: '', pj: '', status: '' },
];

// ============================================
// SPONSOR MITRA (slideshow)
// ============================================
export interface SponsorItem {
  id: string;
  nama: string;
  deskripsi: string;
  website?: string;
  icon: string;
  warna: string;
}

export const initialSponsorList: SponsorItem[] = [
  { id: 'SP-01', nama: 'Apotek Sehat Sentosa', deskripsi: 'P3K & obat-obatan acara', website: 'sehat-sentosa.com', icon: '💊', warna: 'text-pink-500' },
  { id: 'SP-02', nama: 'Bengkel Sukses Motor', deskripsi: 'Sponsor doorprize — servis motor 1 tahun', icon: '🏍️', warna: 'text-purple-600' },
  { id: 'SP-03', nama: 'Toko Berkah Mawar', deskripsi: 'Sponsor konsumsi & snack warga', icon: '🏪', warna: 'text-blue-600' },
  { id: 'SP-04', nama: 'Warung Bu RT', deskripsi: 'Sponsor tumpeng & jamuan', icon: '🍛', warna: 'text-amber-600' },
  { id: 'SP-05', nama: 'Ameera Collections', deskripsi: 'Sponsor hadiah lomba ibu-ibu', icon: '👗', warna: 'text-fuchsia-600' },
];
