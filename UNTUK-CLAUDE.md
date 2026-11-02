# Brief untuk Claude: SI-RADAR INTEL, versi kedua Trans-Siber PAS

Baca berkas ini sampai habis sebelum menyentuh kode.

Folder ini berisi kode **SI-RADAR INTEL** (Sistem Pemantauan dan Analisis
Informasi Digital untuk Deteksi Dini Kerawanan Keamanan pada Subdirektorat
Intelijen Ditpamintel). Kodenya salinan utuh **Trans-Siber PAS** yang berjalan
di trans-siberpas.vercel.app, diambil dari `origin/main` repo
`github.com/dimyustlp/cyber-intelpas` commit `3aafb35` (2 November 2026).
Riwayatnya ada di git lokal folder ini: commit pertama adalah salinan apa
adanya, commit kedua penggantian identitas. `git diff HEAD~1` menunjukkan
persis apa yang berubah.

## 1. Keadaannya sekarang

**Identitas sudah selesai diganti.** Yang berbeda dari versi pertama hanya
nama dan lencana sistem. Fitur, tampilan, tema warna, alur, peran, dan mesin
klasifikasi harus tetap sama persis. Jangan menulis ulang halaman, jangan
mengganti kerangka, dan jangan "merapikan" kode yang tidak berkaitan.

**Basis datanya proyek Supabase BARU** (bagian 5). Versi kedua tidak berbagi
akun, berita, bot Telegram, maupun Edge Function dengan versi pertama.

**SUDAH DIGELAR (2 November 2026).** Bagian 5–7 di bawah adalah catatan
cara membangunnya, bukan pekerjaan yang tersisa:

| | |
|---|---|
| Situs | https://si-radar-intel.vercel.app (tim Vercel `workgijoe-7117s-projects`, proyek `si-radar-intel`) |
| Repo | https://github.com/workgijoe-arch/si-radar-intel |
| Supabase | proyek `diznmklyxkiyqzngbaeu` (org Trans-Siber Pemasyarakatan) |

- Skema dibangun dari katalog produksi Trans-Siber (bukan dari migrasi), lalu
  33.092 berita dan seluruh data induk disalin. Akun, target Telegram, dan
  log Trans-Siber sengaja TIDAK disalin.
- 19 jadwal pg_cron aktif; 11 Edge Function tergelar dari kode yang berjalan
  di produksi (lebih maju dari repo lama), kecuali `laporan-harian`.
- Vercel **tidak** tersambung ke GitHub: akun Vercel belum punya login
  connection GitHub. Gelaran dilakukan dari folder `web/` dengan CLI:
  `cd web && npx vercel@65.9.0 deploy --prod --scope workgijoe-7117s-projects`.
  Karena gelaran dari `web/`, `web/vercel.json` terbaca (cek: `/README.md`
  harus 404).

**Yang masih harus dikerjakan pengguna sendiri:** akun admin pertama
(Supabase → Authentication → Add user, lalu naikkan perannya di
`app_users`), dan bot Telegram baru (rahasia Edge Function
`TELEGRAM_BOT_TOKEN`).

## 2. Tanyakan ini kepada pengguna sebelum bagian 5

- Ref proyek Supabase baru dan publishable key-nya (proyek dibuat pengguna
  sendiri).
- Nama proyek Vercel / alamat situs (misalnya `si-radar-intel.vercel.app`).
- Apakah versi kedua memakai spreadsheet Google yang sama dengan versi pertama
  (`sumber_sheet`), atau lembar baru.

## 3. Penggantian identitas yang sudah dikerjakan

### 3a. Nama

| Bentuk | Nilai | Tempat |
|---|---|---|
| Nama | `SI-RADAR INTEL` | `KONFIG.nama` di `web/js/lib/konfig.js` |
| Kepanjangan | Sistem Pemantauan dan Analisis Informasi Digital untuk Deteksi Dini Kerawanan Keamanan pada Subdirektorat Intelijen Ditpamintel | `KONFIG.kepanjangan` (kunci baru; dipakai di halaman masuk) |
| Nama pendek | `SI-RADAR` | ikon telepon (`manifes.webmanifest`, `apple-mobile-web-app-title`) |
| Dua huruf | `SR` | `KONFIG.lambang`, ikon tab peramban di `web/index.html` |
| Nama berkas unduhan | `si-radar-intel-*`, `Laporan-Harian-SI-RADAR-INTEL-*.pdf`, `Infografis-*-SI-RADAR-INTEL-*` | `ekspor.js`, `berita.js`, `infografis.js`, Edge Function `laporan-harian` |

Instansi (`Direktorat Pengamanan dan Intelijen`, `DITPAMINTEL`,
`Direktorat Jenderal Pemasyarakatan`, kementerian) **tidak** berubah. Lencana
direktorat (Garuda) juga tetap, dan urutannya tetap: lencana sistem dulu,
lencana direktorat sesudahnya.

Tulisan nama juga sudah diganti di sisi peladen: Edge Function
`laporan-harian` (kaki halaman dan metadata PDF), `telegram-kirim`,
`sheet-sync` (User-Agent), templat Apps Script di `gas/` dan
`tools/penjaring-celah.gs`, serta data peragaan. Untuk fungsi SQL yang
menyusun teks Telegram ada migrasi
`supabase/migrations/20261102030000_nama_si_radar_intel.sql`. Ia **tidak**
menulis ulang badan fungsinya. Ia mengambil definisi yang sedang berlaku,
mengganti tulisannya saja, dan berhenti dengan galat bila masih ada bentuk
"Trans-Siber" lain. Jalankan sesudah skema produksi diterapkan (5C).

Pemeriksaan: `grep -rn -i "trans-siber" web supabase/functions gas tools`
hanya boleh menyisakan pengenal di 3c, komentar sejarah di `api.js`, dan
`tools/bundel.mjs`.

### 3b. Lencana

Lencana baru dipotong dari logo SI RADAR INTEL (2000×2000) menjadi lingkaran
penuh yang menyentuh keempat tepi berkas, dengan **nama berkas lama**:

| Berkas | Bentuk |
|---|---|
| `web/assets/lambang-trans-siber.png` | PNG 128×128 beralfa (kop menu, halaman masuk, layar nyala) |
| `web/assets/lambang-trans-siber-lembar.jpg` | JPEG 224×224 dasar putih, 26 KB (infografis, PDF) |
| `web/ikon/ikon-192.png`, `ikon-512.png` | PNG beralfa |
| `web/ikon/ikon-maskable-512.png` | isi 76% di atas `#0B1F3D` |
| `web/ikon/apple-touch-icon.png` | 180×180 di atas `#0B1F3D` (iOS menggambar alfa sebagai hitam) |

`node tools/susun-lambang.mjs` dan `node tools/ringkas-fungsi.mjs` sudah
dijalankan, jadi `web/js/ui/lambang-data.js` dan salinannya di
`supabase/functions/laporan-harian/` sudah memuat lencana baru.

Bila lencana diganti lagi: ganti berkasnya, lalu jalankan kedua alat itu.
Kalau langkah itu terlewat, layar menampilkan logo baru tetapi PDF dan
infografis masih logo lama, **tanpa satu pun pesan galat**. Jangan menyunting
`lambang-data.js` dengan tangan.

`web/laporan-contoh.pdf` dihapus. Berkas itu contoh berlogo lama, tidak
dirujuk kode mana pun, tetapi tetap tersaji untuk umum di `/laporan-contoh.pdf`.

### 3c. Yang TIDAK boleh diganti

Ini pengenal mesin, bukan tulisan di layar:

- `RANAH_USERNAME = 'pengguna.cyber-intelpas.id'` di `web/js/lib/api.js` dan
  di Edge Function `kelola-pengguna`. Akun ber-username disimpan dengan surel
  bayangan berranah itu.
- Nama tabel dan kolom basis data.
- Konstanta `TRANS_SIBER`, `LAMBANG`, nama berkas `lambang-trans-siber.*`, dan
  kunci `localStorage` `transsiberpas.*`. Setiap domain punya penyimpanannya
  sendiri, jadi tidak bentrok dengan versi pertama. Menyamakan pengenal kedua
  versi membuat perbaikan di satu versi bisa disalin ke versi lain apa adanya.
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
   `grep -rn "iprsfkuunuiepxjfyjmw\|ffcebfslmnhivravwhvm" produksi supabase/functions web`
   harus kosong sesudahnya. Migrasi lama di `supabase/migrations/` dibiarkan
   apa adanya: berkas itu catatan sejarah, bukan yang diterapkan.
3. **Terapkan `skema-public.sql`** ke proyek baru. Bila ada galat karena
   urutan atau ekstensi, perbaiki berkasnya lalu ulangi pada proyek yang
   masih kosong; jangan menambal setengah jalan.
4. **Terapkan `20261102030000_nama_si_radar_intel.sql`** tepat sesudahnya.
   Ia mengganti "Trans-Siber PAS" di setiap fungsi `public` yang menyimpannya
   (kop pesan Telegram harian) dan mencetak `NOTICE` per fungsi. Bila ia
   berhenti dengan galat "dalam bentuk lain", periksa fungsi yang disebut,
   tambahkan pemetaannya ke migrasi itu, lalu jalankan lagi.
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
9. **Edge Function.** Nama dan lencana di sisi peladen sudah diganti (3a, 3b),
   termasuk salinan `ringkas-fungsi`. Lima fungsi yang diunduh skrip dari
   produksi (5B) belum diperiksa: jalankan
   `grep -rn -i "trans-siber" supabase/functions/{deteksi-lonjakan,pantau-masuk,arsip-pangkas}`
   dan ganti tulisannya bila ada. Lalu gelar dari **akar repo** (dari folder lain pesannya menyesatkan:
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
