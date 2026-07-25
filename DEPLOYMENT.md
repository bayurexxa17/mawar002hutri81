# 🚀 Deployment Guide

## Persiapan Deploy

### 1. Update Data
Sebelum deploy, pastikan untuk update data di folder `src/data/`:
- `committee.ts` - Sesuaikan nama dan nomor kontak panitia
- `activities.ts` - Update daftar lomba dan hadiah
- `schedule.ts` - Sesuaikan jadwal acara
- `sponsors.ts` - Tambahkan sponsor jika ada

### 2. Build Production
```bash
npm run build
```

Output akan ada di folder `dist/`

---

## 📦 Deploy ke Cloudflare Pages

### Metode 1: GitHub Integration (Recommended)

#### Step 1: Push ke GitHub
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit HUT RI 81"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/username/mawar002hutri81.git
git push -u origin main
```

#### Step 2: Connect ke Cloudflare
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pilih **Pages** di sidebar
3. Klik **Create a project**
4. Pilih **Connect to Git**
5. Pilih repository `mawar002hutri81`
6. Konfigurasi build:
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```
7. Klik **Save and Deploy**

#### Step 3: Custom Domain (Optional)
1. Di Cloudflare Pages, pilih project
2. Pergi ke **Custom domains**
3. Klik **Add custom domain**
4. Masukkan domain (contoh: `hutri81-ciptaland.com`)
5. Cloudflare akan otomatis setup DNS

---

### Metode 2: Direct Upload via Wrangler CLI

#### Install Wrangler
```bash
npm install -g wrangler
```

#### Login
```bash
wrangler login
```

#### Deploy
```bash
# Build first
npm run build

# Deploy
wrangler pages deploy dist --project-name=mawar002hutri81
```

---

## 🌐 Deploy ke Platform Lain

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Run deploy
npm run deploy
```

---

## ⚙️ Environment Variables

Jika butuh environment variables, buat file `.env`:

```env
VITE_API_URL=https://api.example.com
VITE_WHATSAPP_NUMBER=6281234567890
```

Access di code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🔒 Security Checklist

- [ ] Remove console.log dari production
- [ ] Validate semua form input
- [ ] Use HTTPS untuk production
- [ ] Set security headers
- [ ] Enable CSP (Content Security Policy)
- [ ] Sanitize user input

---

## 📊 Performance Optimization

### Image Optimization
```bash
# Install sharp
npm install -D sharp

# Compress images
# Gunakan tool online: tinypng.com, squoosh.app
```

### Code Splitting
Vite automatically code-splits your application.

### Lazy Loading
```typescript
// Lazy load components
const Gallery = lazy(() => import('./sections/Gallery'));
```

---

## 🧪 Testing Before Deploy

```bash
# Linting
npm run lint

# Build test
npm run build

# Preview production build
npm run preview
```

---

## 📱 Mobile Testing

Test di berbagai device:
- iPhone (Safari)
- Android (Chrome)
- Tablet

Gunakan Chrome DevTools Device Mode untuk simulasi.

---

## 🆘 Troubleshooting

### Build Failed
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Failed
- Check build output di `dist/`
- Verify build command di platform
- Check error logs di dashboard

### Website Not Loading
- Clear browser cache
- Check Cloudflare cache
- Verify DNS propagation

---

## 📞 Support

Untuk masalah deployment:
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Vite Docs: https://vitejs.dev/guide/
- React Docs: https://react.dev/

---

**Happy Deploying!** 🎉
