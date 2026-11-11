# Progres Proyek - DUCK DUCK COOK

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **STEP 3 - Sistem Pemesanan / Booking & Pembayaran QRIS (Selesai & Terhubung Live)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Setup project Next.js + Tailwind CSS
  - [x] Design tokens (*Artisanal Botanical Culinary*)
  - [x] Navbar & Footer dengan Logo DUCK DUCK COOK
  - [x] Hero Section
  - [x] About Section
  - [x] Service Section
  - [x] Berita/Post Section (terhubung live ke database, urut terbaru, pop-up baca artikel)
  - [x] Contact Section + Google Maps embed
  - [x] Responsif & aksesibilitas dicek
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management, dashboard & Database Google Spreadsheet
  - [x] Apps Script (`code.gs`, `setup.gs`) di root proyek dengan inisiasi tabel idempoten & secret token
  - [x] Sistem Login & Register dengan validasi lengkap
  - [x] Role `admin` & `user` dengan proteksi hak akses berbasis server & middleware
  - [x] Password hashing aman menggunakan `bcryptjs` & sesi cookie httpOnly JWT dengan `jose`
  - [x] Dashboard Admin responsif (Manajemen User, Role, CRUD Berita, Ganti Password)
  - [x] Upload media lokal (`src/lib/storage.ts`) ke `public/uploads/`
  - [x] Menghubungkan Google Spreadsheet melalui Apps Script Web App (Terverifikasi Status 200)
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Sistem Pemesanan / Booking & Pembayaran QRIS
  - [x] Tabel `Orders` di Google Spreadsheet via `setup.gs` & `db.ts`
  - [x] Formulir Pemesanan Interaktif (`/pesan`) — Dine-in, Bento Box, Frozen Pack
  - [x] Halaman Pembayaran QRIS (`/pembayaran/[id]`) — kode tiket unik, instruksi bayar
  - [x] Halaman & menu navigasi **Pesanan Anda** (`/pesanan`) — khusus pengguna login
  - [x] Tab **Pesanan & Reservasi** di Dashboard Admin — konfirmasi & tombol WhatsApp
  - [x] API `/api/orders` & `/api/admin/orders` terverifikasi Status 200 & terhubung Google Sheets
  - [x] Dikonfirmasi pengguna ✅
- [ ] STEP 4 - Deploy & maintenance (Menunggu konfirmasi untuk mulai)

## Integrasi Database Aktif
- **Apps Script URL**: `https://script.google.com/macros/s/AKfycbxes_xWybKzGFFx5w3fqNo0OfLus3Ow8sbRlcHg83W9EOAIqvURslbtHCGQ-Dq4jHA/exec`
- **Tabel Live Terhubung**: `Roles`, `Users`, `News`, `Orders` di Google Sheets pengguna.
- **Akun Administrator**: `admin@gmail.com` (ganti password sebelum production!)

## Panduan Cepat Menjalankan
1. Development server aktif di: [http://localhost:3000](http://localhost:3000)
2. Halaman Login: [http://localhost:3000/login](http://localhost:3000/login)
3. Formulir Pemesanan: [http://localhost:3000/pesan](http://localhost:3000/pesan)
4. Riwayat Pesanan: [http://localhost:3000/pesanan](http://localhost:3000/pesanan)
5. Dashboard Admin: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
