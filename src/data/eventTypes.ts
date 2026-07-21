export interface EventType {
  id: number;
  nama: string;
  tanggal: string;
  keterangan: string;
  lokasi: string;
  badge?: string;
}

export const eventTypes: EventType[] = [
  {
    id: 2,
    nama: 'Pesta Rakyat Ciptaland Mawar (HUT RI 2026)',
    tanggal: '17 Agustus 2026',
    keterangan: '06.00 – selesai',
    lokasi: 'Fasum Mushola Nurul Ukhuwah Blok Mawar',
    badge: 'Puncak',
  },
  {
    id: 3,
    nama: 'Malam Puncak HUT RI ke-81 Ciptaland',
    tanggal: '17 Agustus 2026',
    keterangan: '19.00 – 22.00 WIB + Doorprize',
    lokasi: 'Panggung Utama',
    badge: 'Hiburan',
  },
];

export interface PanduanLombaDetail {
  id: string;
  icon: string;
  title: string;
  kategori: string;
  tanggal: string;
  tim: string;
  durasi: string;
  rules: string[];
  budget?: string;
}

export const panduanLomba: PanduanLombaDetail[] = [
  {
    id: 'kerupuk',
    icon: '🍘',
    title: 'Makan Kerupuk',
    kategori: 'Anak-anak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5–10 anak / ronde',
    durasi: '±30 menit total',
    rules: [
      'Kerupuk digantung setinggi mulut.',
      'Tangan di belakang, dilarang sentuh kerupuk/tali.',
      'Yang habis pertama menang ±5–10 menit per ronde.',
    ],
  },
  {
    id: 'kelereng',
    icon: '🥄',
    title: 'Bawa Kelereng (Sendok)',
    kategori: 'Anak-anak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5–8 anak / ronde',
    durasi: '±30 menit total',
    rules: [
      'Gigit sendok berisi kelereng, tangan di belakang.',
      'Jalan 10 meter dari start ke finish tanpa jatuh.',
      'Jatuh = gugur atau kembali ke start (panitia).',
      'Yang sampai pertama dengan utuh menang.',
    ],
  },
  {
    id: 'futsal',
    icon: '⚽',
    title: 'Futsal Mini',
    kategori: 'Remaja · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '5 Remaja / ronde',
    durasi: '±30 menit total',
    rules: [
      'Format Pertandingan: Pertandingan dimainkan secara beregu dengan sistem gugur atau setengah kompetisi sesuai kesepakatan panitia.',
      'Jumlah Pemain: Setiap tim terdiri dari 5 pemain inti di lapangan (termasuk penjaga gawang) dan beberapa pemain cadangan.',
      'Durasi Permainan: Waktu pertandingan dibagi menjadi 2 babak (misal: 2 x 10 atau 15 menit) dengan waktu istirahat singkat di antara babak.',
      'Aturan Main:

Pergantian pemain dapat dilakukan kapan saja (bebas) tanpa harus menunggu bola mati.

Bola keluar garis samping dilakukan dengan tendangan ke dalam (kick-in).

Pelanggaran keras atau akumulasi kartu akan dikenakan sanksi sesuai keputusan wasit lapangan yang bertugas demi menjaga sportivitas.',
      'Keputusan Wasit: Seluruh pemain wajib menjunjung tinggi sportivitas (fair play) dan keputusan wasit adalah mutlak serta tidak dapat diganggu gugat.',
    ],
  },
  {
    id: 'tepung',
    icon: '🍚',
    title: 'Estafet Tepung',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–6 orang, 2–4 tim / ronde',
    durasi: '±10 menit / ronde',
    rules: [
      'Duduk berbanjar, yang depan pegang tepung.',
      'Oper ke belakang lewat atas kepala pakai piring, tanpa menoleh.',
      'Yang belakang tampung di wadah ukur.',
      'Setelah ±3 menit, tepung terbanyak menang.',
    ],
  },
  {
    id: 'penguin',
    icon: '🐧',
    title: 'Estafet Penguin',
    kategori: 'Remaja · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 3–4 orang / ronde',
    durasi: '±10 menit / ronde',
    rules: [
      'Konsep Permainan: Lomba beregu adu kecepatan di mana setiap peserta berjalan atau berlari menuju titik tertentu dengan posisi bola atau benda diletakkan di antara kedua lutut/mata kaki (menyerupai gaya berjalan penguin), kemudian estafet ke anggota tim berikutnya.',
      'Jumlah Anggota Tim: Setiap tim terdiri dari 3 sampai 4 orang yang berbaris di jalur estafet masing-masing.',
      'Aturan Main:

Peserta wajib berjalan dengan gaya "penguin" (menjepit bola/benda di antara lutut atau kaki) tanpa menggunakan tangan untuk memegang benda tersebut selama berjalan.

Jika bola atau benda terjatuh di tengah jalan, peserta harus berhenti, mengambilnya kembali, menjepitkannya ke posisi semula, baru boleh melanjutkan perjalanan.

Sesampainya di garis finish atau titik estafet, benda diberikan kepada anggota tim berikutnya, begitu seterusnya hingga anggota terakhir menyelesaikan tantangan.',
      'Kriteria Pemenang: Tim yang berhasil menyelesaikan seluruh estafet dari garis start sampai finish dengan waktu tercepat keluar sebagai pemenang.',
    ],
  ], 
  {
    id: 'tambang',
    icon: '💪',
    title: 'Tarik Tambang',
    kategori: 'Ibu & Bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–7 orang',
    durasi: '±10 menit / pertandingan',
    rules: [
      'Dua tim berhadapan pegang tambang, pita di tengah.',
      'Tarik hingga pita melewati garis lawan.',
      'Best of 3, dilarang lilit tambang ke tubuh.',
      'Sistem gugur antar RT. Kategori ibu & bapak dipisah.',
    ],
  },
  {
    id: 'buta',
    icon: '👩‍🦯',
    title: 'Make Up Buta',
    kategori: 'Ibu & Bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 2 orang berpasangan',
    durasi: '±5 - ±10 menit / pertandingan',
    rules: [
      'Konsep Permainan: Perlombaan merias wajah rekan satu tim, namun peserta yang bertugas sebagai make-up artist (perias) harus menutup matanya menggunakan penutup mata (blindfold).',
      'Jumlah Anggota Tim: Setiap tim terdiri dari 2 orang (1 orang perias dengan mata tertutup dan 1 orang model yang wajahnya dirias).',
      'Aturan Main:

Panitia memberikan waktu persiapan singkat bagi perias untuk meraba dan mengenali letak alat-alat make-up di depannya sebelum mata ditutup.

Setelah aba-aba dimulai, perias wajib merias wajah modelnya sepenuhnya dalam keadaan mata tertutup, mengandalkan insting dan arahan suara dari modelnya (tanpa boleh saling bertukar posisi).

Batas waktu yang diberikan biasanya berkisar antara 5 hingga 10 menit.',
      'Kriteria Pemenang: Tim yang hasil riasannya paling rapi, paling lucu/kreatif (mengingat kondisi mata tertutup), atau paling mendekati hasil riasan normal keluar sebagai pemenang.',
    ],
  },
  {
    id: 'joget',
    icon: '🕺',
    title: 'Joget Kursi',
    kategori: 'Ibu & Bapak · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–7 orang',
    durasi: '±10 menit / pertandingan',
    rules: [
      'Konsep Permainan: Permainan memperebutkan kursi saat alunan musik berhenti; peserta yang tidak kebagian kursi akan tersingkir secara bertahap hingga menyisakan satu orang pemenang.',
      'Persiapan Alat:

Siapkan kursi sebanyak jumlah peserta dikurangi satu (misal: 10 peserta, kursi yang dipasang 9 buah) yang disusun melingkar dengan posisi sandaran kursi saling membelakangi di bagian dalam.

Siapkan pengeras suara (speaker) untuk memutar musik.',
      'Aturan Main:

Peserta berjalan mengelilingi barisan kursi secara berputar mengikuti irama musik yang sedang dimainkan.

Selama musik berbunyi, peserta tidak boleh duduk atau menyentuh kursi.

Ketika musik tiba-tiba berhenti, seluruh peserta harus segera berebut dan duduk di kursi yang tersedia.

Peserta yang tidak kebagian kursi dinyatakan gugur, dan panitia akan mengambil 1 buah kursi dari lingkaran untuk babak selanjutnya.',
      'Kriteria Pemenang: Peserta terakhir yang berhasil menduduki kursi satu-satunya di babak final keluar sebagai juara.',
    ],
  },
  {
    id: 'sambung',
    icon: '🍙',
    title: 'Salah Sambung',
    kategori: 'Remaja · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '4–6 Orang / Tim',
    durasi: '±5 menit / heat, ±30 menit total',
    rules: [
      'Konsep Permainan: Permainan menyebarkan informasi atau kalimat secara berantai dari telinga ke telinga secara berbisik dalam satu barisan tim, di mana kalimat akhir seringkali melenceng jauh dan menjadi lucu akibat salah tangkap pesan.',
      'Jumlah Anggota Tim: Setiap tim terdiri dari 4 sampai 6 orang yang berbaris ke belakang.',
      'Aturan Main:

Panitia memberikan sebuah kalimat rahasia kepada peserta paling depan.

Peserta pertama membisikkan kalimat tersebut ke peserta di belakangnya dengan cepat dan hanya satu kali kesempatan bisik, begitu seterusnya secara estafet hingga sampai ke peserta terakhir.

Peserta terakhir wajib mengucapkan dengan lantang kalimat yang ia terima di hadapan juri atau penonton.',
      'Kriteria Pemenang: Tim yang kalimat akhirnya paling mendekati kalimat asli dari panitia (atau tim yang menghasilkan pelintiran kalimat paling lucu dan menghibur) keluar sebagai pemenang.',
    ],
  },
  {
    id: 'daster',
    icon: '💪',
    title: 'Fashion Week Daster',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: 'Tim 5–7 orang',
    durasi: '±10 menit / pertandingan',
    rules: [
      'Konsep Acara: Ajang peragaan busana (catwalk) unik dan penuh unsur humor khusus menggunakan daster, dengan gaya berjalan serta aksi panggung paling kreatif dari para peserta.',
      'Peserta: Perwakilan warga atau ibu-ibu (bisa juga kategori bapak-bapak berdaster sebagai variasi hiburan) per RT atau kelompok.',
      'Aturan & Cara Main:

Peserta wajib mengenakan pakaian utama berupa daster dengan tambahan atribut atau aksesoris pendukung yang menarik (seperti kacamata hitam, payung, topi, tas unik, atau selendang).

Peserta berjalan secara bergantian di atas catwalk atau jalur yang telah ditentukan, lalu melakukan pose-pose unik di ujung panggung diiringi musik yang meriah.

Penampilan dinilai berdasarkan kreativitas gaya/aksi, kepercayaan diri (paling totalitas), serta kelucuan dan keserasian atribut yang digunakan.',
      'Kriteria Pemenang: Peserta yang paling menghibur, percaya diri tinggi, dan sukses mengocok perut penonton dinobatkan sebagai juara.',
    ],
  },
  {
    id: 'tumpeng',
    icon: '🍙',
    title: 'Hias Tumpeng',
    kategori: 'Ibu-ibu · 17 Agustus',
    tanggal: '17 Agustus',
    tim: '3–5 Orang / Tim',
    durasi: '±5 menit / heat, ±30 menit total',
    rules: [
      '1–2 orang fokus pada dekorasi dan penataan hiasan (hiasan sayur, cabai, atau pernak-pernik estetika).',
      '1–2 orang bertugas menyiapkan dan menata lauk-pauk pendamping di sekeliling tumpeng.',
      '1 orang sebagai koordinator atau penanggung jawab tim yang mendampingi saat proses penilaian oleh juri.',
      'Persiapan awal (10–15 menit): Penataan meja, penyiapan nampan/tampah, serta penataan dasar nasi tumpeng.',
      'Proses inti (45–60 menit): Membentuk nasi kerucut, menyusun aneka lauk-pauk, serta merangkai hiasan (garnish) dari sayuran dan buah.',
      'Finishing (15 menit): Pembersihan area meja saji (cleaning up) agar tampil bersih dan rapi sebelum juri mulai melakukan penilaian.',
    ],
  },
];
