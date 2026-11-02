# Brief untuk Claude: membuat versi kedua Trans-Siber PAS

Baca berkas ini sampai habis sebelum menyentuh kode. Isi folder ini adalah
salinan utuh kode yang sedang berjalan di **trans-siberpas.vercel.app**, diambil
dari `origin/main` repo `github.com/dimyustlp/cyber-intelpas` pada commit
`3aafb35` (2 November 2026). Satu berkas sengaja dibuang: `trans-siber-pas-mandiri.html`,
bundel satu-berkas lama yang masih menunjuk ke basis data lama.

## 1. Tugasnya

Pengguna ingin **versi kedua** dari aplikasi ini. Yang berbeda hanya
**logo dan judul**. Selebihnya (fitur, tampilan, alur, peran, mesin
klasifikasi) harus sama persis.

Jadi pekerjaannya adalah penggantian identitas, bukan pembangunan ulang.
Jangan menulis ulang halaman, jangan mengganti kerangka, jangan "merapikan"
kode yang tidak berkaitan dengan nama dan logo.

**Keputusan basis data sudah diambil: proyek Supabase BARU (bagian 5).**
Versi kedua tidak berbagi akun, berita, bot Telegram, maupun
Edge Function dengan versi pertama, jadi nama dan logo juga diganti di sisi
peladen (PDF, pesan Telegram, lembar Google). Kerjakan seluruh bagian 3a,
termasuk daftar "sisi peladen".

Periksa dulu apakah folder `produksi/` ada di paket ini (lihat 5B). Bila
tidak ada, berhenti dan minta pengguna menjalankan
`ambil-dari-produksi.ps1` lebih dulu; tanpa isinya proyek baru tidak bisa
dibangun.

## 2. Tanyakan tiga hal ini dulu

Jangan menebak. Ketiganya menentukan berkas mana yang disentuh.

1. **Nama baru.** Perlu tiga bentuk: nama lengkap (pengganti `Trans-Siber PAS`),
   nama pendek untuk ikon telepon (pengganti `Trans-Siber`), dan dua huruf
   cadangan (pengganti `TS`).
2. **Logo baru.** Apakah hanya lencana sistem yang diganti, atau lencana
   direktorat (Garuda, DITPAMINTEL) juga? Apakah nama instansi
   (`Direktorat Pengamanan dan Intelijen`, `DITPAMINTEL`,
   `Direktorat Jenderal Pemasyarakatan`) ikut berubah?
3. **Alamat gelar dan ref proyek Supabase baru.** Nama proyek Vercel
   (misalnya `nama-baru.vercel.app`), ref proyek Supabase baru, dan
   publishable key-nya. Proyek Supabase dibuat pengguna sendiri.

## 3. Peta penggantian

### 3a. Judul / nama (tulisan di layar)

Hampir semua halaman mengambil nama dari satu tempat, `KONFIG` di
`web/js/lib/konfig.js`. Ganti di sana lebih dulu:

| Kunci | Nilai sekarang | Dipakai untuk |
|---|---|---|
| `nama` | `Trans-Siber PAS` | kop menu, halaman masuk, laporan, ekspor, pesan |
| `lambang` | `TS` | teks alternatif bila gambar lencana gagal |
| `instansi` | `Direktorat Pengamanan dan Intelijen` | kop |
| `instansiSingkat` | `DITPAMINTEL` | kop |
| `induk` | `Direktorat Jenderal Pemasyarakatan` | kop |
| `kementerian` | `Kementerian Imigrasi dan Pemasyarakatan` | kop |
| `lencana.sistem` / `lencana.direktorat` | `assets/lambang-*.png` | alamat lencana di layar |

Tempat yang **mengetik namanya sendiri** dan wajib diganti dengan tangan:

- `web/index.html`: `<meta name="description">` (baris 7), `<title>` (9),
  `apple-mobile-web-app-title` (32), `aria-label` pada `#akar` (91),
  `<image href="assets/lambang-trans-siber.png">` (136), `.nyala-nama` (140),
  `.nyala-instansi` (141). Layar nyala ini harus tergambar sebelum JavaScript
  berjalan, jadi memang tidak boleh membaca `KONFIG`.
- `web/manifes.webmanifest`: `name`, `short_name`, `description`.
- Komentar kepala `web/css/app.css` dan `web/css/gerak.css` (tidak terlihat
  pengguna; opsional).

Tempat di sisi peladen (wajib, sebab versi kedua punya peladennya sendiri):

- `supabase/functions/laporan-harian/index.ts` baris 301–302: nama berkas PDF.
- `supabase/functions/laporan-harian/pdf.ts` baris 410, 437, 439: kaki halaman
  dan metadata PDF.
- `supabase/functions/telegram-kirim/index.ts` baris 328 dan 617.
- `supabase/functions/sheet-sync/sheet-sync.ts` baris 243 (User-Agent).
- Fungsi SQL `pesan_harian_telegram()`, versi terakhirnya di
  `supabase/migrations/20260907020000_kop_instansi_dan_ditpamintel.sql`
  baris 62 dan 202. Ganti dengan **migrasi baru** yang mendefinisikan ulang
  fungsinya; jangan menyunting migrasi lama yang sudah diterapkan.
- `gas/lembar-kanwil-v3.template.gs` dan `gas/lembar-kanwil.template.gs`:
  nama menu, judul folder dan lembar Google, dan alamat
  `trans-siberpas.vercel.app` (baris 1076).

Cara memastikan tidak ada yang tertinggal:

```bash
grep -rn -i "trans-siber\|trans siber" web supabase/functions gas
```

Sisa yang wajar hanya komentar dan nama konstanta `TRANS_SIBER` (lihat 3c).

### 3b. Logo

Ada **dua bentuk berkas untuk tiap lencana**, dan keduanya perlu:

| Berkas | Bentuk | Dipakai di |
|---|---|---|
| `web/assets/lambang-trans-siber.png` | PNG 128×128, beralfa | kop menu (32 px), halaman masuk (60 px), layar nyala |
| `web/assets/lambang-trans-siber-lembar.jpg` | JPEG 224×224, dasar putih, ≤ 60 KB | lembar infografis, PDF, kop laporan unduhan |
| `web/assets/lambang-ditpamintel.png` | PNG 128×128, beralfa | sama, lencana kedua |
| `web/assets/lambang-ditpamintel-lembar.jpg` | JPEG 224×224, dasar putih | sama, lencana kedua |
| `web/ikon/ikon-192.png`, `ikon-512.png` | PNG beralfa | ikon PWA |
| `web/ikon/ikon-maskable-512.png` | PNG 512, isi 76% di atas `#0B1F3D` | ikon Android yang dipotong topeng |
| `web/ikon/apple-touch-icon.png` | PNG 180×180 | ikon iPhone |

Syarat bentuk yang tidak boleh dilanggar: **lencana harus lingkaran penuh yang
menyentuh keempat tepi berkas**. Seluruh antarmuka cukup memberi
`border-radius: 50%`, termasuk untuk memotong sudut putih JPEG di atas kop
berlatar biru tua. Logo yang punya margin akan tampak mengecil dan bertepi
putih.

Cara termurah: **pertahankan nama berkasnya, ganti isinya saja.** Dengan begitu
`KONFIG.lencana`, `web/index.html`, dan `tools/bundel.mjs` tidak perlu disentuh.

Sesudah mengganti JPEG, wajib menjalankan:

```bash
node tools/susun-lambang.mjs     # menulis ulang web/js/ui/lambang-data.js (data URI)
node tools/ringkas-fungsi.mjs    # menyalin lambang-data.js ke supabase/functions/laporan-harian/
```

Lembar infografis menanam lencana sebagai data URI, bukan tautan, sebab dua
dari tiga keluarannya (PNG untuk Telegram dan PDF dari Edge Function) tidak
bisa mengambil berkas dari mana pun. Bila langkah ini terlewat, layar
menampilkan logo baru tetapi PDF dan infografis masih logo lama, **tanpa satu
pun pesan galat**. Jangan menyunting `lambang-data.js` dengan tangan.

### 3c. Yang TIDAK boleh diganti

Ini pengenal mesin, bukan tulisan di layar:

- `RANAH_USERNAME = 'pengguna.cyber-intelpas.id'` di `web/js/lib/api.js`
  baris 217 dan di Edge Function `kelola-pengguna`. Bila basis datanya dipakai
  bersama, mengganti ini **mengunci seluruh pengguna** tanpa pesan yang
  menjelaskan sebabnya.
- Nama tabel dan kolom basis data.
- Nama konstanta seperti `TRANS_SIBER`, `LAMBANG`, kunci `localStorage`
  `transsiberpas.*` (setiap domain punya penyimpanannya sendiri, jadi tidak
  bentrok dengan versi pertama).
- `package.json` `name` dan `.claude/launch.json`.

## 4. Arsitektur singkat dan aturan menyunting

- **Tanpa build step.** `web/` adalah modul ES murni yang dijalankan langsung
  oleh peramban. Tidak ada npm install, bundler, TypeScript, atau JSX di sisi
  peramban, dan **tidak ada kode atau huruf dari CDN**: CSP di `web/vercel.json`
  hanya mengizinkan `'self'` dan satu alamat Supabase.
- Halaman dimuat malas lewat `import('./pages/x.js')` di `web/js/main.js`.
- Backend: Supabase (Postgres + RLS, Auth/GoTrue, Edge Functions Deno,
  pg_cron, pg_net, Vault). Peramban memanggil PostgREST dan GoTrue langsung
  tanpa SDK (`web/js/lib/api.js`).
- Gaya kode: komentar menjelaskan **mengapa** aturan itu ada, bukan apa yang
  dikerjakan kodenya. Ikuti gaya itu; bahasa komentar dan nama adalah bahasa
  Indonesia.
- Penjelasan lengkap tiap folder ada di `README.md`; alasan tiap tajuk keamanan
  di `docs/tajuk-keamanan.md`.

Menjalankan secara lokal:

```bash
node tools/server-lokal.mjs 4173
```

Buka `http://localhost:4173/?mode=demo` untuk melihat seluruh tampilan dengan
data peragaan tanpa menyentuh basis data. Mode demo adalah cara tercepat
memeriksa logo dan judul baru di setiap halaman.

## 5. Membangun proyek Supabase baru

### 5A. Mengapa migrasi di repo tidak cukup

Tabel inti `berita`, `app_users`, `weekly_reports`, dan `upt` sudah ada sejak
sistem Streamlit lama, sebelum folder `supabase/migrations/` dimulai. Migrasi
pertama (`20260822010000_auth_bridge.sql`) langsung `alter table
public.app_users`, dan tujuh migrasi lain mengubah `berita`, tanpa satu pun
yang membuatnya. Selain itu beberapa tabel yang dipakai halaman
(`peringatan_lonjakan`, `log_masuk`, `isu_terpantau`, `audit_log`,
`sheet_sync_log`, `system_health_events`, `case_news`) juga tidak dibuat
migrasi mana pun. Menerapkan 38 migrasi ke proyek kosong akan gagal di berkas
pertama.

Karena itu sumber kebenaran untuk proyek baru adalah **folder `produksi/`**,
bukan `supabase/migrations/`. Migrasi tetap dibaca sebagai penjelasan mengapa
tiap tabel, policy, dan fungsi ada.

### 5B. Isi folder `produksi/`

Disusun oleh `ambil-dari-produksi.ps1`, yang dijalankan pengguna sendiri
terhadap proyek lama `iprsfkuunuiepxjfyjmw` (hanya membaca):

| Berkas | Isi |
|---|---|
| `skema-public.sql` | `pg_dump --schema-only` skema `public`: tabel, indeks, fungsi, pemicu, policy RLS. Sudah memuat hasil akhir seluruh migrasi. |
| `data-referensi.sql` | isi tabel referensi: `upt`, `kanwil`, `media_tier`, `sumber_sheet`, `isu_terpantau`, `penjaring_*`, `notifikasi_rute`, `notifikasi_setelan`, `pengaturan_keamanan` |
| `cron-jobs.csv` | seluruh jadwal pg_cron (nama, jadwal, aktif, perintah) |
| `storage-buckets.csv` | bucket penyimpanan |
| `pemicu-auth-users.csv` | pemicu pada `auth.users`, yang tidak ikut dump skema `public` |

Skrip yang sama mengunduh lima Edge Function yang hidup di produksi tetapi tidak
pernah masuk repo ke `supabase/functions/`:

| Fungsi | Dipanggil oleh |
|---|---|
| `deteksi-lonjakan` | `web/js/lib/lonjakan.js`, menu di `peran.js` |
| `pantau-masuk` | `supabase/functions/pantau-keamanan` |
| `arsip-pangkas` | jadwal pg_cron (lihat `cron-jobs.csv`) |
| `pasang-modul`, `uji-jarak-jauh` | tidak dipanggil kode; alat bantu lama, boleh dilewati |

**Sengaja tidak ikut:** isi `berita`, `app_users`, `telegram_targets`,
`telegram_deliveries`, `integration_settings`, dan seluruh log. Versi kedua
mulai dengan arsip kosong, akun baru, dan bot Telegram baru. Jangan memindahkan
data versi pertama kecuali pengguna memintanya secara tegas.

### 5C. Urutan pekerjaan

1. **Pengguna** membuat proyek Supabase baru dan memberi Claude ref proyek
   dan publishable key-nya. Aktifkan ekstensi `pg_cron`, `pg_net`, dan
   `supabase_vault` (Database → Extensions).
2. **Ganti alamat proyek lama** di seluruh `produksi/*.sql`, `cron-jobs.csv`,
   dan `supabase/functions/**`: setiap `iprsfkuunuiepxjfyjmw` dan
   `ffcebfslmnhivravwhvm` menjadi ref proyek baru.
   `grep -rn "iprsfkuunuiepxjfyjmw\|ffcebfslmnhivravwhvm" produksi supabase web`
   harus kosong sesudahnya.
3. **Ganti kop di sisi basis data** di `skema-public.sql` sebelum diterapkan:
   fungsi `pesan_harian_telegram()` (cari `Laporan Harian Trans-Siber PAS` dan
   `dasbor Trans-Siber PAS`), dan setiap teks lain yang
   `grep -n -i "trans-siber\|ditpamintel" produksi/skema-public.sql` temukan.
4. **Terapkan `skema-public.sql`** ke proyek baru. Bila ada galat karena
   urutan atau ekstensi, perbaiki berkasnya lalu ulangi pada proyek yang
   masih kosong; jangan menambal setengah jalan.
5. **Pemicu `auth.users`**: buat ulang dari `pemicu-auth-users.csv`. Tanpa ini
   akun baru di Auth tidak mendapat baris profil.
6. **Bucket**: buat ulang dari `storage-buckets.csv`.
7. **Data referensi**: terapkan `data-referensi.sql`. Bandingkan jumlah baris
   `upt` dengan `data/master-upt.csv` (531) dan `kanwil` dengan
   `data/kanwil-33.json` (33). Baris `sumber_sheet` dan `isu_terpantau`
   menunjuk ke spreadsheet Google versi pertama; tanyakan pengguna apakah
   versi kedua memakai lembar yang sama atau lembar baru.
8. **Rahasia.** Vault: satu rahasia bernama `SHEET_SYNC_TOKEN` (string acak
   panjang; pg_cron mengambilnya untuk memanggil Edge Function). Rahasia Edge
   Function: `SHEET_SYNC_TOKEN` (nilai yang sama) dan `TELEGRAM_BOT_TOKEN`
   (bot **baru** dari @BotFather, jangan bot versi pertama). `SUPABASE_URL` dan
   `SUPABASE_SERVICE_ROLE_KEY` sudah tersedia otomatis. Nilai rahasia diisi
   pengguna sendiri; jangan pernah menuliskannya ke berkas di repo.
9. **Edge Function.** Ganti nama dan logo di sisi peladen (bagian 3a), jalankan
   `node tools/susun-lambang.mjs` lalu `node tools/ringkas-fungsi.mjs`, lalu
   gelar dari **akar repo** (dari folder lain pesannya menyesatkan:
   "Entrypoint path does not exist"):

   ```bash
   npx supabase functions deploy <nama> --project-ref <REF_BARU> [--no-verify-jwt]
   ```

   - `--no-verify-jwt`: `sheet-sync`, `klasifikasi`, `laporan-harian`,
     `telegram-kirim`, `penjaring`, `notifikasi`, `pantau-keamanan`, dan
     (sesuai produksi) `pantau-masuk`, `deteksi-lonjakan`, `arsip-pangkas`
   - JWT diperiksa (tanpa penanda): `kelola-pengguna`

   `sheet-sync` butuh `index.ts` satu baris yang mengimpor `sheet-sync.ts`;
   berkas itu sudah ada. Jangan menyunting salinan `web/js/lib/*.js` di dalam
   `supabase/functions/` dengan tangan.

   Uji hidup tanpa efek samping: POST ke fungsi tanpa token harus menjawab
   `401` berJSON. Jangan memanggil `laporan-harian` dengan token sah hanya
   untuk mengujinya; ia mengirim ke grup Telegram.
10. **Jadwal pg_cron** dibuat ulang dari `cron-jobs.csv` **sesudah** fungsi
    tergelar dan rahasia terisi, supaya tidak ada jadwal yang menembak fungsi
    yang belum ada. Untuk menilai kesehatannya, baca `net._http_response`,
    bukan `cron.job_run_details`: yang kedua melaporkan `succeeded` walaupun
    fungsinya habis waktu.
11. **Sisi web.** Ganti `KONFIG.url` dan `KONFIG.kunciPublik` di
    `web/js/lib/konfig.js` (publishable key, **bukan** service role key), dan
    alamat yang sama di `connect-src` pada `web/vercel.json`. Bila hanya satu
    yang diganti, situs tampak hidup tetapi setiap panggilan ke basis data
    diblokir CSP.
12. **Akun admin pertama.** Pengguna membuatnya di Supabase → Authentication;
    pastikan baris `public.app_users`-nya terbentuk (lewat pemicu dari langkah 5)
    dan perannya admin. Akun ber-username memakai surel bayangan
    `<username>@pengguna.cyber-intelpas.id` (lihat 3c).
13. **Auth → URL Configuration**: isi Site URL dengan alamat Vercel baru.

## 6. Menggelar di Vercel

- Proyek Vercel baru, sambungkan ke repo GitHub baru (jangan mendorong ke repo
  versi pertama).
- **Root Directory = `web`**. Setelan ini hanya ada di papan kendali Vercel.
  Tanpa itu `web/vercel.json` diabaikan **tanpa pesan apa pun**: situs tetap
  tampil, tetapi tanpa satu pun tajuk keamanan. Pemeriksaan sepuluh detik:
  `/README.md` harus 404 dan `/css/app.css` harus 200.
- Framework preset: Other. Tanpa build command, tanpa output directory.
- Bila Vercel memunculkan "Security Checkpoint" 403 saat diperiksa dengan
  `curl`, buka lewat peramban. Itu tantangan anti-bot, bukan penggelaran yang
  rusak.

## 7. Pemeriksaan sebelum selesai

```bash
node tools/uji-infografis.mjs      # lencana tertanam di lembar
node tools/uji-panduan.mjs         # catatan: sudah merah sejak sebelum 3aafb35 ("Deteksi Lonjakan" belum punya penjelasan)
node tools/uji-tombol.mjs
node tools/uji-mesin.mjs
```

Lalu periksa setiap `import('./pages/x.js')` di `main.js` punya berkasnya:

```bash
grep -oP "import\('\./pages/\K[a-z-]+\.js" web/js/main.js | sort -u \
  | while read f; do [ -f "web/js/pages/$f" ] || echo "HILANG: $f"; done
```

Terakhir, buka `?mode=demo` dan lihat dengan mata: layar nyala, halaman masuk,
kop menu samping, ikon tab peramban, Laporan (unduh PDF), dan Lembar
Infografis (unduh PNG). Lima tempat itu yang paling sering masih menyimpan
logo lama.

## 8. Ringkasan untuk pengguna sesudah selesai

Sebutkan: ref proyek Supabase baru dan apa saja yang sudah diterapkan di sana,
berkas yang diganti, langkah yang hanya bisa dikerjakan pengguna sendiri
(membuat proyek Vercel/Supabase, mengisi rahasia, membuat bot Telegram), dan
hal yang belum diperiksa.
