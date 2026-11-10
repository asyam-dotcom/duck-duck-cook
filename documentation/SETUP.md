# Panduan Menjalankan Proyek & Setup Database

Website Company Profile **DUCK DUCK COOK** dibangun dengan Next.js App Router, Tailwind CSS, serta integrasi **Google Spreadsheet sebagai database** melalui Google Apps Script.

---

## 1. Menjalankan di Komputer Lokal

1. Pastikan Node.js (versi 18+) sudah terpasang.
2. Buka terminal di folder proyek (`c:\belajar\Company Profile`).
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka peramban: [http://localhost:3000](http://localhost:3000)

---

## 2. Akun Akses Awal (Development)

Sistem sudah dilengkapi akun Administrator awal:
- **URL Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `admin@gmail.com`
- **Password**: `123456`

> ⚠️ **PERINGATAN KEAMANAN PENTING**:  
> Password `123456` adalah kredensial demo publik yang lemah. Telah disediakan menu **"Ganti Password Admin"** di Dashboard (`/dashboard`). Pastikan Anda mengganti password ini sebelum website dipublikasikan ke publik!

---

## 3. Menghubungkan Google Spreadsheet sebagai Database (Step 2)

Proyek ini telah menyediakan file backend Google Apps Script:
- `setup.gs`: Skrip inisiasi tabel (`Roles`, `Users`, `News`) secara otomatis dan idempoten.
- `code.gs`: Web App router CRUD generik dengan otentikasi secret token.

*(Kedua file ini otomatis diabaikan oleh `.gitignore` demi menjaga keamanan kode).*

### Langkah Setup Google Spreadsheet:
1. Buka [Google Sheets](https://sheets.new) dan buat spreadsheet baru (misalnya diberi nama `DB Duck Duck Cook`).
2. Pada menu atas, klik **Extensions > Apps Script** (Ekstensi > Apps Script).
3. Hapus kode default di file `Code.gs`, lalu salin seluruh isi file `code.gs` dari proyek Anda ke situ.
4. Buat file script baru di editor Apps Script (**+ > Script**), beri nama `setup.gs`, lalu salin seluruh isi file `setup.gs` dari proyek Anda ke situ.
5. Jalankan fungsi inisiasi:
   - Pada dropdown fungsi di bagian atas editor Apps Script, pilih fungsi **`initTables`**.
   - Klik tombol **Run** (Jalankan) dan izinkan izin akses Google Spreadsheet.
   - Tabel `Roles`, `Users` (dengan admin awal), `News`, serta tabel `Orders` (Sistem Pemesanan) akan otomatis terbuat di sheet Anda!
6. Atur Kunci Rahasia (**Script Properties**):
   - Klik ikon gerigi **Project Settings** di bilah sisi kiri Apps Script.
   - Gulir ke bawah ke bagian **Script Properties**, klik **Add script property**.
   - Property: `APPS_SCRIPT_SECRET`
   - Value: buat kata sandi rahasia acak Anda (misalnya: `KunciRahasiaDuckDuckCook2026`).
   - Klik **Save script properties**.
7. Deploy sebagai Web App:
   - Klik tombol biru **Deploy > New deployment**.
   - Pilih jenis: **Web app** (ikon roda gigi).
   - *Description*: `Produksi v1`
   - *Execute as*: **Me (email Anda)**
   - *Who has access*: **Anyone** (Siapa saja)
   - Klik **Deploy**, lalu salin **Web app URL** yang dihasilkan (berawalan `https://script.google.com/macros/s/.../exec`).
8. Masukkan ke file `.env.local` di komputer Anda:
   ```env
   APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   APPS_SCRIPT_SECRET=KunciRahasiaDuckDuckCook2026
   ```

*Catatan: Selama `APPS_SCRIPT_URL` belum diisi, aplikasi berjalan secara cerdas menggunakan database lokal aman di folder `.data/db.json` sehingga Anda dapat langsung mencoba seluruh fitur login, registrasi, dashboard admin, dan sistem pemesanan tanpa hambatan.*

---

## 4. Sistem Pemesanan & Pembayaran QRIS (Step 3)

Alur transaksi tanpa payment gateway pihak ketiga yang dibangun:
1. **Pemesanan (`/pesan`)**: Pelanggan memilih paket makanan atau reservasi meja (dine-in, bento, atau frozen pack), menentukan tanggal/jam/alamat, dan catatan.
2. **Tiket & QRIS (`/pembayaran/[id]`)**: Menampilkan kode tiket unik (contoh `#DDC-53923`), total tagihan, dan barcode QRIS resmi.
3. **Riwayat ("Pesanan Anda" - `/pesanan`)**: Menu khusus pengguna terdaftar untuk melihat tiket dan memantau status pesanan (*Menunggu Konfirmasi*, *Dikonfirmasi*, *Dibatalkan*).
4. **Verifikasi Admin (`/dashboard`)**: Tab "Pesanan & Reservasi" di dashboard admin untuk memverifikasi pembayaran dengan satu klik dan tombol pintas WhatsApp untuk langsung menghubungi pelanggan.
5. **Aset Gambar QRIS**: File gambar QRIS tersimpan di `public/images/qris.svg`. Anda dapat menimpanya dengan foto scan QRIS resmi bank Anda kapan saja.

---

## 5. Catatan Penting Mengenai Penyimpanan Media (Upload Gambar)

- Pada Step 2 ini, semua berkas upload gambar thumbnail berita disimpan secara lokal di folder `public/uploads/`.
- **Batasan Vercel di Production**: Di server Vercel, penyimpanan disk bersifat *sementara dan hanya-baca (read-only ephemeral)*. Artinya, upload file ke folder lokal berjalan sempurna saat dicoba di komputer sendiri (development), tetapi berkas tidak akan bertahan permanen jika diunggah di server Vercel produksi.
- Seluruh logika penyimpanan telah dibungkus rapi di dalam modul `src/lib/storage.ts`. Pada **Step 4**, kita dapat dengan mudah menghubungkannya ke penyimpanan awan permanen (seperti Vercel Blob atau Cloudinary) tanpa perlu mengubah kode dashboard.
