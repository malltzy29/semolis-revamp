# Semolis Bali — PT Aviana Sinar Anugerah

Platform web mandiri (standalone) penyewaan motor listrik **Semolis Bali** di bawah naungan **PT Aviana Sinar Anugerah**, dibangun menggunakan **Next.js 15 (App Router)**, **Tailwind CSS**, dan **SQLite (`node:sqlite`)** tanpa ketergantungan pada WordPress.

---

## 1. Company Profile & Kontak Resmi
- **Nama Brand:** Semolis Bali (PT Aviana Sinar Anugerah)
- **Alamat Garasi / Pengambilan Mandiri:** Jl. Bedugul No. 40, Sidakarya, Denpasar Selatan, Bali
- **WhatsApp Layanan Utama:** `+62 822-6648-9776` (Pemesanan, CS, & Konfirmasi Pembayaran)
- **Email Resmi:** `support@sewamotorlistrikbali.com`
- **Jam Operasional:** Setiap hari pukul 08:00 – 21:00 WITA
- **Media Sosial Resmi:**
  - Instagram Sewa Milik: [@asa_sewamilikmolis](https://www.instagram.com/asa_sewamilikmolis)
  - Facebook Page: [Sewa Motor Listrik Bali / KJI Impala](https://www.facebook.com/profile.php?id=61559592037020)

---

## 2. Core Business Offerings (Highlights)
1. **Program Utama — Sewa Hak Milik (Rent-to-Own) 720 Hari**:
   - Berlaku untuk seluruh unit Volta (401, Eagle, Mandala).
   - Skema cicilan sewa harian flat tanpa uang muka (DP) berat; setelah 720 hari, motor 100% resmi berpindah kepemilikan menjadi hak milik penyewa (BPKB & STNK resmi).
2. **Dukungan 29 Titik Stasiun Ganti Baterai (SGB) di Bali**:
   - Didukung jaringan 29 titik Stasiun Ganti Baterai (SGB) aktif di Bali.
   - Tukar baterai instan < 1 menit tanpa perlu menunggu antre bensin (zero range anxiety).
3. **Sewa Harian Transparan (Min. 3 Hari)**:
   - **Volta 401**: Rp 60.000 / hari
   - **Volta Eagle**: Rp 65.000 / hari
   - **Volta Mandala**: Rp 70.000 / hari
4. **Alur Pembayaran Transfer & Validasi Konfirmasi WhatsApp**:
   - Rekening BCA Resmi: `7725489120` a.n. `PT Aviana Sinar Anugerah`.
   - Mendukung transfer dari Bank apa saja maupun E-Wallet (DANA, OVO, GoPay, ShopeePay, Flip, dll).
   - Validasi Bukti Pembayaran: Tombol WhatsApp Admin terkunci sebelum penyewa mengunggah foto bukti pembayaran dan menekan tombol validasi.
   - Tombol 1-klik mengirim format konfirmasi lengkap beserta data penyewa langsung ke WhatsApp Admin.
---

## 3. Kebijakan & Ketentuan Operasional
- **Pengambilan Mandiri**: Unit diambil dan dikembalikan mandiri di garasi Sidakarya (tidak ada layanan antar jemput).
- **Perlengkapan**: Paket sewa tidak termasuk helm, jas hujan, dan phone holder. Penyewa dihimbau membawa helm standar SNI sendiri.

---

## 4. Menjalankan Aplikasi Lokal
```bash
# Development mode
npm run dev

# Production build & start
npm run build
npm run start
```
Akses di browser melalui `http://localhost:3000`.

---

## 5. Panduan Deployment VPS (Jagoan Hosting / Ubuntu)
1. **Install Node.js 22 LTS, PM2, dan Nginx**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs nginx git
   sudo npm install -g pm2
   ```
2. **Build & Jalankan Aplikasi**:
   ```bash
   cd /var/www/revamp-web-semolis
   npm install
   npm run build
   pm2 start npm --name "semolis" -- start
   pm2 save && pm2 startup
   ```
3. **Konfigurasi Reverse Proxy Nginx & SSL HTTPS**:
   Arahkan port `80/443` ke `http://localhost:3000` dan pasang SSL gratis via `certbot --nginx`.
