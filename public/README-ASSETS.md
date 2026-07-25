# Assets Directory

## Struktur Folder

```
public/
├── logo/          # Logo acara dan sponsor
├── images/        # Gambar galeri dan background
├── icons/         # Icon custom
└── favicon.ico    # Favicon website
```

## Cara Menambahkan Assets

### 1. Logo
- Simpan logo di folder `public/logo/`
- Format yang disarankan: PNG dengan background transparan
- Ukuran: minimal 500x500px

### 2. Images
- Simpan gambar di folder `public/images/`
- Optimasi ukuran file untuk web (max 200KB per gambar)
- Gunakan format WebP untuk performa lebih baik

### 3. Icons
- Simpan icon SVG di folder `public/icons/`
- Atau gunakan emoji/icon dari library

## Referensi di Code

```tsx
// Logo
<img src="/logo/hut-ri-81.png" alt="Logo HUT RI 81" />

// Image
<img src="/images/gallery-1.jpg" alt="Gallery" />

// Favicon (sudah di-set di index.html)
<link rel="icon" type="image/svg+xml" href="/favicon.ico" />
```

## Optimasi

- Gunakan [TinyPNG](https://tinypng.com/) untuk kompresi PNG
- Gunakan [Squoosh](https://squoosh.app/) untuk konversi ke WebP
- Lazy loading untuk gambar di bawah fold
