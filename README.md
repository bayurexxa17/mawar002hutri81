# 🇮🇩 HUT RI Ke-81 - Ciptaland Blok Mawar RT 002 RW 014

Website resmi perayaan Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81 untuk Perumahan Ciptaland Blok Mawar RT 002 RW 014.

![HUT RI 81](https://img.shields.io/badge/HUT%20RI-81-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Fitur Utama (Updated v2)

### 🎨 Premium UI (Sesuai Request)
- ✅ **Hero Premium** — Gradient animasi, floating particles, grid pattern, wave decoration
- ✅ **Loading Screen** — Progress bar 0-100%, bouncing logo 81, dot animation
- ✅ **Sticky Navbar** — Blur backdrop, scroll detection, mobile drawer
- ✅ **Background Animation** — 15 floating circles + grid + radial overlay
- ✅ **Countdown** — Real-time ke 17 Agustus 2026 (Hari, Jam, Menit, Detik)
- ✅ **Statistik Live** — 6 kartu gradient (10+ lomba, Rp 2.5jt hadiah, dll)
- ✅ **Floating WhatsApp** — 3 kontak dengan badge animasi & popup list
  - Ketua Pembina: 0812-7129-9984
  - Ketua Panitia: 0812-8839-5550
  - Wakil Ketua: 0831-8395-0205
  - 

### 📊 NEW - Fitur Reference Greenbay (https://www.greenbay.my.id/hutri2026)
Inspired dari referensi Greenbay.my.id, kini lengkap dengan:

#### 1. **Dashboard Tabs** (5 Tab seperti di gambar)
- 📊 **Ringkasan** (default active merah #C1272D)
  - 3 Cards: Total Kebutuhan Rp 32.750.000, Target Dana Masuk Rp 31.000.000, Selisih Defisit -Rp 1.750.000
  - Table: Susunan Panitia (Jabatan | Nama) — header merah, row cream
  - Table: Jenis Acara (No | Nama Acara | Tanggal/Keterangan)
  - Warning: Yel-yel belum ditentukan (amber box)
  - Table: Ringkasan Anggaran (Budget vs Dana Masuk) dengan **🔍 Lihat Detail** button
  - Warning: Vendor belum konfirmasi (amber box)
- 💰 **Pendanaan**
  - Table 12 sumber dana dengan status Confirmed / Need Confirm
  - Total Rp 31jt dengan highlight
- 📋 **Panduan Lomba**
  - 9 kartu lomba (Volley, Jalan Santai, Paku Botol, Kelereng, Kerupuk, Pukul Air, Estafet Tepung, Tarik Tambang, Balap Karung)
  - Klik kartu → **Popup Modal** detail aturan (numbered list + durasi + tim)
- 📝 **Pendaftaran**
  - Form: Nama, RT/Blok, HP, Pilih Lomba (10 opsi checkbox), Catatan
  - Submit → Generate ID `MWR81-0001` → **Popup Bukti Pendaftaran** (screenshotable)
  - Table Daftar Peserta live (localStorage)
- ❤️ **Donasi**
  - Form: Nama, Alamat, HP rahasia, Jumlah, Pesan, Anonim checkbox
  - Submit → ID `DON81-0001` → **Popup Bukti Donasi**
  - Table Daftar Donatur + Total Terkumpul live

#### 2. **Popup System - Lihat Detail**
Semua tombol **Lihat Detail** membuka Modal premium:
- **Lihat Detail** Anggaran Pesta Rakyat → breakdown Rp 8jt (4 item)
- **Lihat Detail** Volley Cup → breakdown Rp 10jt (3 item)
- **Lihat Detail** Malam Puncak → breakdown Rp 14.75jt (10 item)
- **Lihat Detail** Dana Masuk → breakdown 12 sumber dana
- Validated badge: ✅ Angka cocok dengan catatan panitia
- Animasi fade-in + scale-in, backdrop blur

#### 3. **Additional Enhancements**
- **Lomba Cards** → Klik untuk modal detail peraturan + tombol daftar
- **Panitia Cards** → Klik untuk modal kontak + tugas + WA/Telepon buttons
- **LocalStorage** persistence untuk peserta & donatur
- **Bukti Pendaftaran/Donasi** — Desain sertifikat dashed border, siap screenshot/print

## 📁 Struktur Project (Sesuai Request)

```
mawar002hutri81/
│
├── public/
│   ├── logo/           # Logo files (500x500px PNG)
│   ├── images/         # Gallery images (WebP 200KB)
│   ├── icons/          # SVG custom icons
│   └── favicon.ico     # Favicon
│
├── src/
│   ├── assets/         # Imported assets
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky + mobile menu
│   │   ├── Hero.tsx             # Premium hero animasi
│   │   ├── Countdown.tsx        # Timer real-time
│   │   ├── Statistics.tsx       # 6 kartu live
│   │   ├── LoadingScreen.tsx    # Progress bar 81
│   │   ├── FloatingWA.tsx       # 3 kontak WA popup
│   │   ├── Modal.tsx            # NEW - Generic popup
│   │   └── Footer.tsx
│   │
│   ├── sections/
│   │   ├── Dashboard.tsx        # NEW - 5 Tabs utama (Ringkasan, Pendanaan, dll)
│   │   ├── About.tsx
│   │   ├── Activities.tsx       # + Modal detail lomba
│   │   ├── Schedule.tsx
│   │   ├── Committee.tsx        # + Modal kontak panitia
│   │   ├── Sponsor.tsx
│   │   ├── Gallery.tsx
│   │   └── Register.tsx
│   │
│   ├── data/
│   │   ├── activities.ts        # 10 lomba
│   │   ├── schedule.ts          # 18 jadwal
│   │   ├── committee.ts         # 12 panitia + 3 primary WA
│   │   ├── statistics.ts
│   │   ├── gallery.ts
│   │   ├── sponsors.ts
│   │   ├── budget.ts            # NEW - Anggaran Rp 32.75jt + detail
│   │   ├── funding.ts           # NEW - 12 sumber dana
│   │   └── eventTypes.ts        # NEW - Jenis Acara + Panduan 9 lomba
│   │
│   ├── hooks/
│   │   ├── useScroll.ts
│   │   └── useLocalStorage.ts   # NEW - Persist data
│   ├── utils/
│   ├── styles/
│   │   └── theme.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Quick Start

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 📱 Kontak Panitia (3 WA Floating)

| Posisi | Nama | No. HP | WhatsApp Link |
|--------|------|--------|---------------|
| Ketua Pembina | Bpk. H. Ahmad Suryadi | 0812-7129-9984 | [Chat WA](https://wa.me/6281271299984) |
| Ketua Panitia | Bpk. Budi Santoso | 0812-8839-5550 | [Chat WA](https://wa.me/628188395550) |
| Wakil Ketua | Ibu Siti Nurhaliza | 0831-8395-0205 | [Chat WA](https://wa.me/6283183950205) |

## 🌐 Deploy ke Cloudflare Pages

### Build Settings:
- **Build command:** `npm run build`
- **Output dir:** `dist`
- **Framework:** Vite

### Via GitHub:
1. Push ke GitHub
2. Cloudflare Dashboard → Pages → Create → Connect to Git
3. Select repo `mawar002hutri81`
4. Deploy otomatis!

### Via Wrangler:
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=mawar002hutri81
```

## 🎨 Design System

- **Primary:** #C1272D (Merah reference Greenbay)
- **Secondary:** #F9F5EB (Cream table rows)
- **Accent:** Amber-50 untuk warning boxes
- **Border:** Red-200 untuk cards
- **Header Table:** bg-[#C1272D] text white

## 📦 Build Output

- **Size:** 359.79 kB (gzipped: 93.40 kB)
- **Modules:** 55
- **Status:** ✅ Success

## 📸 Screenshots Reference

Fitur yang diimplementasi 100% sesuai gambar reference:
- ✅ 3 top cards (Total Kebutuhan, Target Dana, Selisih Defisit) dengan border-left color
- ✅ Tabel merah header putih
- ✅ Lihat Detail button rounded border merah
- ✅ Warning amber box dengan border-left
- ✅ 5 Tabs navigation

---

© 2026 Panitia HUT RI Ke-81 Ciptaland Blok Mawar RT 002 RW 014

🇮🇩 **Dirgahayu Republik Indonesia! Merdeka!** 🇮🇩
