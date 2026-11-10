# Maintenance Log - DUCK DUCK COOK

Dokumen ini mencatat rencana fitur lanjutan, bug yang dilaporkan, dan riwayat perubahan aplikasi website DUCK DUCK COOK.

---

## Backlog Fitur
- [ ] **Migrasi Cloud Storage Media**: Integrasikan Vercel Blob atau Cloudinary di `src/lib/storage.ts` agar upload foto berita/media tetap persisten di lingkungan serverless production.
- [ ] **Payment Gateway Otomatis**: Integrasikan Midtrans Snap / Xendit Webhook agar verifikasi status pesanan QRIS berubah secara otomatis tanpa verifikasi manual admin.
- [ ] **Notifikasi Otomatis WhatsApp / Email**: Kirim notifikasi konfirmasi pesanan secara real-time ke pembeli menggunakan layanan email (Resend) atau WhatsApp API (Fonnte / WA Cloud API).
- [ ] **Filter Rentang Tanggal di Dashboard**: Tambahkan filter pesanan berdasarkan tanggal reservasi untuk mempermudah operasional harian dapur resto.
- [ ] **Ekspor Laporan Penjualan**: Kemampuan download riwayat pesanan ke format CSV / Excel langsung dari dashboard admin.

---

## Bug Diketahui
*Belum ada bug aktif yang dilaporkan.*

Format pelaporan:
`- [ ] [YYYY-MM-DD] Deskripsi bug, langkah reproduksi, prioritas (Rendah / Sedang / Kritis)`

---

## Riwayat Perubahan
- **2026-11-10**:
  - Inisiasi proyek Next.js 14 App Router, Tailwind CSS dengan design tokens *Artisanal Botanical Culinary* (Step 1).
  - Implementasi sistem role & authentication berbasis JWT httpOnly dan Google Apps Script database (`code.gs`, `setup.gs`) (Step 2).
  - Implementasi Dashboard Admin lengkap dengan CRUD Berita, Manajemen User, Manajemen Role, dan Ganti Password Admin (Step 2).
  - Implementasi sistem pemesanan online & reservasi meja dengan alur QRIS, pembuatan tiket otomatis, halaman "Pesanan Anda", dan tab verifikasi pesanan di dashboard admin (Step 3).
  - Penyusunan dokumen panduan deployment Vercel dan inisiasi repository Git (Step 4).
