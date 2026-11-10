# Progres Proyek - DUCK DUCK COOK

Terakhir diperbarui: 10 November 2026  
Posisi saat ini: **STEP 2 - User Management, Dashboard, & Database Google Spreadsheet (Aktif)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Setup project Next.js + Tailwind CSS
  - [x] Design tokens (*Artisanal Botanical Culinary*)
  - [x] Navbar & Footer dengan Logo DUCK DUCK COOK
  - [x] Hero Section
  - [x] About Section
  - [x] Service Section
  - [x] Berita/Post Section (terhubung live ke database)
  - [x] Contact Section + Google Maps embed
  - [x] Responsif & aksesibilitas dicek
  - [x] Dikonfirmasi pengguna
- [/] STEP 2 - User management, dashboard & Database Google Spreadsheet
  - [x] Apps Script (`code.gs`, `setup.gs`) di root proyek dengan inisiasi tabel idempoten & secret token
  - [x] Sistem Login & Register dengan validasi lengkap
  - [x] Role `admin` & `user` dengan proteksi hak akses berbasis server & middleware
  - [x] Password hashing aman menggunakan `bcryptjs` & sesi cookie httpOnly JWT dengan `jose`
  - [x] Dashboard Admin responsif (Manajemen User, Role, CRUD Berita, Ganti Password)
  - [x] Upload media lokal (`src/lib/storage.ts`) ke `public/uploads/`
  - [ ] Pengguna menghubungkan Google Spreadsheet ke Web App Apps Script
  - [ ] Pengujian koneksi live Google Sheets & verifikasi admin
  - [ ] Gerbang Konfirmasi Step 2
- [ ] STEP 3 - Sistem Pemesanan / Booking & Pembayaran QRIS (Menunggu Step 2 Selesai)
- [ ] STEP 4 - Deploy & maintenance (Belum dimulai)

## Panduan Cepat Menjalankan
1. Development server aktif di: [http://localhost:3000](http://localhost:3000)
2. Halaman Login: [http://localhost:3000/login](http://localhost:3000/login)
3. Halaman Register: [http://localhost:3000/register](http://localhost:3000/register)
4. Dashboard Admin: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Akun Default Administrator
- **Email**: `admin@gmail.com`
- **Password**: `123456`
