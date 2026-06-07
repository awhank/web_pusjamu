# Website Profil Pusat Penjamin Mutu

Website statis untuk Pusat Penjamin Mutu universitas, dibangun dengan HTML/CSS/JavaScript vanila tanpa build tools.

## Struktur Direktori

```
root/
├── index.html              (SPA shell — entry point utama)
├── css/style.css           (Desain sistem)
├── js/
│   ├── app.js              (Router SPA + loader)
│   └── data/pages.js       (Registry konten & metadata)
├── pages/                  (Konten per halaman — SNIPPET, tanpa header/footer)
│   ├── beranda.html
│   ├── tentang/
│   │   ├── index.html
│   │   ├── struktur-organisasi.html
│   │   ├── sasaran-mutu.html
│   │   └── program-kerja.html
│   ├── ppepp/
│   │   ├── index.html
│   │   ├── penetapan.html
│   │   ├── pelaksanaan.html
│   │   ├── evaluasi.html
│   │   ├── pengendalian.html
│   │   └── peningkatan.html
│   ├── dokumen/
│   │   ├── index.html      (8 kategori dokumen)
│   │   └── *.html          (halaman per kategori)
│   └── akreditasi/
│       └── index.html
├── assets/                 (Folder aset — gambar, dll)
├── mockup/                 (Mockup HTML — referensi visual)
├── robots.txt              (SEO)
├── sitemap.xml             (SEO — 22 URL)
└── README.md               (File ini)
```

## Cara Kerja

Website ini menggunakan arsitektur SPA-lite:
1. **`index.html`** — dimuat sekali. Berisi header, navigasi, footer, dan konten Beranda.
2. **Navigasi** — semua link internal dicegat oleh `js/app.js`. Konten di-fetch dari `pages/` dan disuntikkan ke `<main>`.
3. **Hash routing** — URL menggunakan `#/halaman` untuk kompatibilitas semua browser.
4. **Fallback** — jika JavaScript tidak aktif, link langsung mengarah ke file di `pages/`.

## Update Konten

### Menambahkan/Mengubah Halaman
1. Edit file di direktori `pages/`
2. File adalah snippet HTML (tanpa `<html>`, `<head>`, `<body>`, `<header>`, `<footer>`)
3. Gunakan class CSS dari `css/style.css` (Bootstrap 5 + custom)
4. Link internal harus menggunakan prefix `pages/` (contoh: `href="pages/beranda.html"`)

### Mendaftarkan Halaman Baru
1. Buat file snippet di `pages/`
2. Daftarkan di `js/data/pages.js` dengan path, title, meta description, dan nav section
3. Tambahkan link di navigasi header (di `index.html`) dan registri

### Mengubah Navigasi
- Navigasi utama ada di `index.html` (bagian `<header>`)
- Ubah link, label, atau tambah item di sini (hanya 1 file)

## Persyaratan Hosting

Hosting statis apa pun (GitHub Pages, Netlify, server universitas):
- Arahkan domain ke `index.html`
- Tidak perlu konfigurasi server khusus
- Untuk SEO optimal, gunakan Netlify (mendukung SPA rewrite) atau tambahkan `_redirects` file

## Teknologi

- Bootstrap 5 (CDN)
- Vanilla JavaScript
- Google Fonts (Nunito)
- Tidak ada build tools
