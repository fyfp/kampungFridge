# Project Prompts Log — KampungFridge

This file collates all prompts used during the creation and iteration of the **KampungFridge** (HDB Community Fridge & Food-Sharing Platform) application.

> **Security Note:** Any Personal Access Tokens included in terminal push commands have been redacted (`<GITHUB_TOKEN_REDACTED>`) so secrets are never committed to the repository.

---

## Prompt 1 — Generate Master Prompt from CSV Brief

```text
Buat master prompt untuk generate code pembuatan aplikasi/website dengan referensi dari csv terlampir. pastikan saat menyusun master prompt, kamu menggunakan struktur berikut: Role, Goal, Output, Guardrails, Context. ingat, ini baru UInya saja. untuk back end akan saya kerjakan belakangan
```

*(Referenced CSV attachment: `public/assets/aistudio/Day_2_Vibe_coding_4d9c912a.csv`)*

---

## Prompt 2 — Master Prompt for UI Build

```markdown
# MASTER PROMPT: HDB COMMUNITY FRIDGE & FOOD-SHARING PLATFORM (UI ONLY)

## 1. Role
Bertindaklah sebagai Senior Frontend Engineer dan UI/UX Product Designer yang berpengalaman membangun aplikasi web sosial/komunitas berstandar produksi dengan aksesibilitas tinggi (ramah lansia dan pengguna non-tech-savvy), responsif (mobile-first), bersih, modern, dan hangat.

## 2. Goal
Bangun kode frontend (UI lengkap dan interaktif) untuk platform digital **Community Fridge & Surplus Food Sharing** di lingkungan perumahan HDB (Housing & Development Board). Aplikasi ini bertujuan memudahkan warga melihat stok bahan makanan gratis secara real-time, mendapatkan rekomendasi resep yang dipersonalisasi sesuai isi kulkas dan kebutuhan diet, mencatat donasi dengan sistem poin, serta membantu relawan/pengelola lokal memantau kedaluwarsa bahan makanan untuk mengurangi *food waste*—sepenuhnya menggunakan data dummy/mock di sisi client (tanpa backend).

## 3. Output
Hasilkan aplikasi web React + TypeScript + Tailwind CSS (modular, bersih, dan siap dijalankan) yang mencakup halaman, komponen, dan alur interaksi berikut:

1. **Landing / Community Overview & Digital Poster View**
   - Hero section yang menjelaskan konsep *HDB Community Fridge* secara visual dan ringkas (pengganti *digital poster* untuk edukasi warga).
   - Cara kerja platform (Donasi -> Pantau Smart Fridge -> Ambil Gratis / Masak).
   - Informasi acara **Quarterly Community Cookout** dan bagian mitra/sponsor (*Town Council, Community Volunteers, Vendor F&B, Corporate Sponsors*).
   - Bagian informasi layanan untuk grup *grassroots* lain yang ingin mengadopsi kulkas komunitas (menampilkan ringkasan paket *Non-Profit Setup & Maintenance*).

2. **Real-Time Smart Fridge & Pantry Stock Explorer (Halaman Utama Pengguna)**
   - Daftar stok bahan makanan segar (*fresh ingredients*) dan bahan kering (*dried food* seperti beras, pasta) dengan indikator kategori, jumlah/kuantitas, status kualitas (*Smart Fridge Quality Indicator*: Fresh, Use Soon, Expiring Today), dan tanggal kedaluwarsa.
   - Filter cepat berdasarkan lokasi blok HDB, kategori bahan, dan status kesegaran.
   - Fitur simulasi **"Claim / Reserve Item"** (gratis untuk warga/keluarga berpenghasilan rendah & lansia) dengan pembaruan state UI secara langsung.
   - Tombol/modal simulasi **"Scan Fridge QR Code"** (alur cepat saat warga memindai QR Code yang tertempel di kulkas fisik).

3. **Personalised Recipe Recommendations**
   - Halaman/tab database resep mudah dibuat (*easy-to-make recipes*) yang secara dinamis mencocokkan bahan yang tersedia di kulkas saat ini (*"Cook with what's in the fridge"*).
   - Filter kebutuhan diet (*dietary requirements*: Halal, Vegetarian, Elderly-Friendly / Soft Food, Low Sodium, Quick <15 mins).
   - Detail resep (daftar bahan yang tersedia di kulkas vs bahan tambahan, langkah memasak sederhana).

4. **Donor Portal & Points Reward System**
   - Form simulasi donasi bahan makanan (nama bahan, kategori segar/kering, kuantitas, perkiraan kedaluwarsa, foto placeholder).
   - Dashboard poin donatur (*Donor Points System*), riwayat kontribusi, serta metrik dampak sosial (*"Your donations helped X neighbours & saved Y kg of food"*).

5. **Volunteer & Grassroots Management Dashboard**
   - Tampilan khusus pengelola/relawan lokal dan *maintenance crew* untuk memantau inventaris harian, daftar bahan yang mendekati kedaluwarsa (*expiry alert*), checklist jadwal pembersihan kulkas (*cleanup schedule*), dan log *drop-off* surplus dari vendor/restoran.

6. **Accessibility & SMS Alert Opt-in (Elderly-Friendly Features)**
   - Fitur toggle **Accessible / Large Text Mode** untuk lansia (*seniors*).
   - Modal/halaman pendaftaran **Daily SMS Stock Alert** (memasukkan nomor HP & memilih blok HDB untuk warga yang kurang terbiasa memakai aplikasi).

7. **Struktur Kode Siap Integrasi Backend**
   - Pisahkan mock data dan tipe data (`types.ts`, `mockData.ts`) serta bungkus interaksi data dalam custom hooks/service layer sederhana di frontend agar mudah disambungkan ke API/backend di tahap selanjutnya.

## 4. Guardrails
- **UI Only (Tanpa Backend)**: Jangan membuat server backend, database sungguhan, autentikasi API eksternal, atau endpoint fetch ke server nyata. Semua interaksi (klaim makanan, tambah donasi, filter resep, update status relawan, toggle SMS alert) harus bekerja secara interaktif menggunakan state lokal React (`useState`/`useReducer`) dan data mock statis.
- **No Native Browser Dialogs**: Jangan gunakan `window.alert()`, `window.confirm()`, atau `window.prompt()`. Gunakan modal, drawer, atau toast notification custom di UI.
- **Aksesibilitas & Inklusivitas**: Pastikan kontras warna tinggi, ukuran font nyaman dibaca, tombol cukup besar (*touch-friendly*), dan bahasa UI sederhana serta empatik (menghindari kesan stigma bagi penerima bantuan).
- **Kualitas Kode & Desain**:
  - Gunakan TypeScript yang ketat (*strict typing* untuk item kulkas, resep, donatur, relawan, dan lokasi HDB).
  - Gunakan Tailwind CSS sepenuhnya tanpa inline CSS atau file CSS terpisah yang berantakan.
  - Gunakan palet warna yang segar, natural, dan terpercaya (misalnya dominan putih bersih, hijau sage/emerald untuk kesegaran & keberlanjutan, serta aksen hangat amber/terracotta untuk komunitas—hindari desain generik).
  - Pastikan tata letak responsif sempurna di layar mobile (375px) hingga desktop (1280px+), dengan navigasi bawah (*bottom navigation*) saat di tampilan mobile dan sidebar/topbar saat di desktop.

## 5. Context
Platform ini merupakan inisiatif **non-profit** berbasis komunitas untuk kawasan hunian HDB dengan detail bisnis & operasional sebagai berikut:
- **Visi**: Memberdayakan warga HDB untuk mengurangi limbah makanan rumah tangga (*household food waste*) melalui kulkas komunitas yang mudah diakses dan platform digital yang membuat proses berbagi, melacak, dan mengambil makanan berlebih menjadi sederhana, nyaman, dan bermanfaat.
- **6 Tujuan Utama**:
  1. Mengurangi limbah makanan rumah tangga dengan mendorong donasi bahan segar berlebih.
  2. Membuka akses makanan gratis dan sehat bagi keluarga berpenghasilan rendah untuk menekan biaya belanja.
  3. Mempererat hubungan bertetangga (*neighbourhood connections*) melalui budaya berbagi.
  4. Mendorong manajemen pangan pintar melalui pelacakan kontribusi, pengambilan, dan tanggal kedaluwarsa.
  5. Mengkampanyekan gaya hidup berkelanjutan di kawasan HDB.
  6. Meningkatkan visibilitas stok harian melalui update rutin dan rekomendasi resep agar bahan cepat dimanfaatkan sebelum basi.
- **Segmen Pengguna**:
  - *Penerima*: Keluarga berpenghasilan rendah, lansia (*seniors*), dan kelompok rentan.
  - *Pengelola*: Grup *grassroots* lokal & relawan komunitas (membutuhkan efisiensi waktu agar tidak banyak bahan kedaluwarsa yang terbuang).
  - *Donatur*: Warga sekitar serta vendor/restoran/supplier penyumbang bahan berlebih yang ingin melihat dampak nyata kontribusinya dan mendapatkan poin penghargaan.
- **Mitra Kunci (Key Partners)**: Town Council, Community Volunteers, Vendor/Restoran/Supplier, dan Maintenance Crew.
- **Saluran Distribusi & Komunikasi (Channels)**: QR Code pada kulkas komunitas, SMS harian untuk lansia/non-tech-savvy, aplikasi mobile/web, dan acara *Quarterly Community Cookout* yang mendemonstrasikan resep dari bahan kulkas.
- **Model Keberlanjutan (Non-Profit Revenue & Cost Context untuk ditampilkan di halaman info mitra/adopsi program)**:
  - Sepenuhnya gratis bagi pengguna pengambil makanan.
  - Didukung oleh sponsor korporasi (*corporate sponsorship*) dan iklan selektif.
  - Layanan paket adopsi kulkas komunitas untuk wilayah lain: *Setup Package* ($1,300 meliputi perangkat & pelatihan operasional/relawan) dan *Monthly Maintenance* ($300/bulan), dengan rincian estimasi biaya operasional non-profit ($800 per kulkas sekali pasang, $200 pelatihan setup, $150/bulan layanan pembersihan kulkas).
```

---

## Prompt 3 — Push Initial Code to GitHub

```text
git push https://<GITHUB_TOKEN_REDACTED>@https://github.com/fyfp/kampungFridge.git
```

---

## Prompt 4 — Recipe API Placement Inquiry

```text
now i have an API for the recipe, where shud i put it?
```

---

## Prompt 5 — Add Serverless API Endpoints

```text
add a serverless connection that pulls recipes data using the following endpoints:
https://www.themealdb.com/api/json/v1/1/categories.php
Store this in /api folder at project root level (not the source file).
Include /health.ts and /carparkavailability.ts within the same sub folder.
Do not hardcode any key, I will input them later.
```

---

## Prompt 6 — Clarify Carpark Environment Variables

```text
why is there Carpark api in the environment?
```

---

## Prompt 7 — Delete Carpark Endpoint

```text
alright my mistake. delete /carparkavailability.ts
```

---

## Prompt 8 — Fridge Stock Selection to Recipes API Matching

```text
add a feature so that after I selected item from TAB FRIDGE STOCK, then i clicked MATCH RECIPES WITH THESE ITEM, it moves to RECIPES TAB and return the recipes (from API)
```

---

## Prompt 9 — Push Updated Code to GitHub

```text
git push https://<GITHUB_TOKEN_REDACTED>@https://github.com/fyfp/kampungFridge.git
```

---

## Prompt 10 — Collate Prompts into Markdown

```text
collate all of the pompts and store them as a PROMPTS.md file
```
