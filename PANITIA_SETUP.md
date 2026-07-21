# 📊 Setup Database untuk Panitia HUT RI 81

## Masalah Saat Ini
- Data pendaftar disimpan di `localStorage` browser warga
- Panitia tidak bisa melihat di HP panitia (beda browser)
- Solusi: hubungkan ke Google Sheets (GRATIS)

---

## ✅ SOLUSI 1: Google Sheets (5 Menit Setup) - RECOMMENDED

### Langkah 1: Buat Google Sheet
1. Buka https://sheets.google.com
2. Buat Sheet baru dengan nama `HUT RI 81 Mawar`
3. Buat 2 Tab/Sheet:
   - Tab 1: `Pendaftaran` dengan header:
     ```
     ID | Nama | RT | HP | Lomba | Catatan | Waktu | App
     ```
   - Tab 2: `Donasi` dengan header:
     ```
     ID | Nama | Alamat | HP | Jumlah | Pesan | Waktu | Anonim | App
     ```

### Langkah 2: Apps Script
1. Di Google Sheet: `Extensions` → `Apps Script`
2. Hapus kode lama, paste kode ini:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.type === 'pendaftaran') {
      const sheet = ss.getSheetByName('Pendaftaran');
      sheet.appendRow([
        data.id,
        data.name,
        data.rt,
        data.hp,
        data.lomba.join(', '),
        data.catatan,
        data.waktu,
        data.app || 'mawar002hutri81'
      ]);
    } else if (data.type === 'donasi') {
      const sheet = ss.getSheetByName('Donasi');
      sheet.appendRow([
        data.id,
        data.name,
        data.alamat,
        data.hp,
        data.jumlah,
        data.pesan,
        data.waktu,
        data.isAnon,
        data.app || 'mawar002hutri81'
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("HUT RI 81 Mawar API Active").setMimeType(ContentService.MimeType.TEXT);
}
```

3. Klik `Deploy` → `New deployment`
   - Type: `Web app`
   - Description: `HUT RI 81 API`
   - Execute as: `Me`
   - Who has access: `Anyone`
   - Klik Deploy → Authorize → Copy URL (contoh: `https://script.google.com/macros/s/AKfyc.../exec`)

### Langkah 3: Hubungkan ke Website
1. Di Cloudflare Pages Dashboard:
   - Pilih project `mawar002hutri81`
   - Settings → Environment variables → Add variable
   - Key: `VITE_GOOGLE_SHEET_URL`
   - Value: URL yang kamu copy tadi
2. Save → Retry deployment

3. Atau untuk testing lokal, buat file `.env` di root:
```
VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/AKfyc.../exec
```

### Tes
- Daftar 1 peserta di website
- Cek Google Sheet, harusnya otomatis masuk baris baru
- Done! Panitia bisa lihat semua pendaftar di Google Sheet kapan saja

---

## ✅ SOLUSI 2: WhatsApp Auto Notif (Pakai Fonnte - Rp 50rb/bulan)

Kalau mau panitia dapat WA otomatis setiap ada pendaftar:

1. Daftar di https://fonnte.com
2. Dapat API Token dan connect WA
3. Tambah env: `VITE_FONNTE_TOKEN=xxxxx`
4. Ganti fungsi `notifyPanitiaWA` di `src/utils/storage.ts` dengan code:

```ts
async function notifyPanitiaWA(p: ParticipantDB) {
  const token = import.meta.env.VITE_FONNTE_TOKEN;
  if (!token) return;
  const numbers = ['6281271299984','6281288395550','6283183950205'];
  for (const num of numbers) {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: token },
      body: new URLSearchParams({
        target: num,
        message: `🚨 PENDAFTAR BARU\nNama: ${p.name}\nRT: ${p.rt}\nLomba: ${p.lomba.join(', ')}`,
      })
    });
  }
}
```

---

## ✅ SOLUSI 3: Database Beneran (Supabase - Gratis 500MB)

Kalau mau database SQL beneran:

1. Buat project di https://supabase.com
2. Buat table `participants`:
```sql
create table participants (
  id text primary key,
  name text,
  rt text,
  hp text,
  lomba text[],
  catatan text,
  waktu text,
  created_at timestamp default now()
);
```
3. Install: `npm install @supabase/supabase-js`
4. Ganti `storage.ts` pakai supabase client

Saya bisa buatkan filenya kalau kamu pilih solusi ini.

---

## 🔑 Admin Panel

Setelah deploy, akses:
```
https://mawar002hutri81.pages.dev/?admin=mawar81
```
atau
```
https://punyamu.com/?admin=mawar81
```

Password default:
- `mawar81`
- `admin81`
- `panitia81`
- `greenbay81`

Di dalam Admin Panel bisa:
- Lihat semua pendaftar
- Export CSV / Excel
- Hapus data
- Kirim WA ke peserta
- Lihat link Google Sheet notifikasi

---

## 🆘 Bantuan

Jika butuh bantuan setup, hubungi:
- Bayu (Ketua Panitia): 0812-8839-5550

Kirim URL Google Sheet / screenshot error, saya bantu.
