# Progres Proyek - DUCK DUCK COOK

Terakhir diperbarui: 10 November 2026  
Posisi saat ini: **Step 4 - Deploy ke Vercel & Mode Maintenance (Aktif)**

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
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) dengan inisiasi tabel idempoten & secret token
  - [x] Sistem Login & Register dengan validasi lengkap
  - [x] Role `admin` & `user` dengan proteksi hak akses berbasis server & middleware
  - [x] Password hashing aman menggunakan `bcryptjs` & sesi cookie httpOnly JWT dengan `jose`
  - [x] Dashboard Admin responsif (Manajemen User, Role, CRUD Berita, Ganti Password)
  - [x] Upload media lokal (`src/lib/storage.ts`) ke `public/uploads/`
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Sistem Pemesanan / Booking & Pembayaran QRIS
  - [x] Inisiasi tabel `Orders` di `setup.gs` & `db.ts`
  - [x] Formulir Pemesanan Interaktif (`/pesan`) untuk Reservasi Dine-in, Bento Box, & Frozen Pack
  - [x] Halaman Pembayaran QRIS (`/pembayaran/[id]`) dengan instruksi bayar & kode tiket
  - [x] Halaman & Menu Navigasi **Pesanan Anda** (`/pesanan`) khusus pengguna terdaftar
  - [x] Menu Tab **Pesanan** di Dashboard Admin (`/dashboard`) dengan verifikasi & tombol WhatsApp
  - [x] Seluruh alur integrasi berhasil diuji 100% lolos uji
  - [x] Dikonfirmasi pengguna
- [/] STEP 4 - Deploy & maintenance
  - [x] Inisialisasi Git repository & verifikasi `.gitignore`
  - [x] Validasi production build (`next build`) bersih tanpa error (21 rute)
  - [x] Penyusunan panduan deployment Vercel lengkap
  - [x] Pembuatan dokumen pemeliharaan berkelanjutan `documentation/MAINTENANCE.md`
  - [ ] Penyiapan repository GitHub & import ke Vercel
  - [ ] Konfigurasi Environment Variables di Vercel Production
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan
- **Alur Pemesanan (Step 3)**:
  1. Pelanggan memilih jenis pemesanan (Reservasi Meja Resto, Paket Bento Nasi Jeruk, atau Frozen Pack).
  2. Sistem membuat tiket unik (misal `#DDC-53923`) dengan status `menunggu_konfirmasi`.
  3. Pelanggan melakukan scan QRIS dan total tagihan ditampilkan jelas.
  4. Admin melihat tiket di Dashboard Admin dan mengklik "Konfirmasi" setelah pembayaran diverifikasi.
  5. Status di halaman "Pesanan Anda" milik pelanggan otomatis berubah menjadi `dikonfirmasi` dengan instruksi kedatangan / pengiriman.
- **Penyimpanan Gambar QRIS**: Menggunakan aset grafis berstandar nasional di `public/images/qris.svg`, yang dapat diganti dengan gambar QRIS resmi milik usaha kapan saja.
- **Batasan Media Lokal di Production**: Di lingkungan Vercel Serverless, file lokal yang diunggah bersifat sementara. Backlog migrasi ke Cloudinary/Vercel Blob telah disiapkan di `documentation/MAINTENANCE.md`.

## Panduan Cepat Menjalankan
1. Development server aktif di: [http://localhost:3000](http://localhost:3000)
2. Coba buat pesanan baru di: [http://localhost:3000/pesan](http://localhost:3000/pesan)
3. Cek tiket pesanan Anda di: [http://localhost:3000/pesanan](http://localhost:3000/pesanan)
4. Masuk ke Dashboard Admin untuk verifikasi: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
