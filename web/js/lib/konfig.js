/**
 * Konfigurasi aplikasi.
 *
 * Kunci di bawah adalah publishable key Supabase. Kunci jenis ini memang
 * dirancang untuk ditempel di sisi klien dan tidak memberi hak apa pun dengan
 * sendirinya — yang menentukan apa yang boleh dibaca dan ditulis adalah policy
 * RLS pada basis data, dievaluasi terhadap sesi pengguna yang sedang masuk.
 *
 * Tidak ada service role key di berkas ini, dan tidak boleh pernah ada.
 * Kunci itu hanya dipegang Edge Function yang berjalan di peladen.
 *
 * Mode:
 *   "langsung" — terhubung ke Supabase sungguhan
 *   "demo"     — memakai data contoh bawaan, dipakai untuk pratinjau tampilan
 *                dan pemeriksaan visual tanpa menyentuh data sungguhan
 */

const parameter = new URLSearchParams(globalThis.location?.search ?? '')

export const KONFIG = {
  /*
     Nama sistem, satu tempat.

     Sampai 1 September 2026 sistem ini bernama Cyber-Intelpas, dan namanya
     ditulis ulang di belasan berkas. Sekarang halaman apa pun yang perlu
     menyebut namanya mengambilnya dari sini — termasuk kop menu samping dan
     halaman masuk, yang dulu menuliskannya sendiri.

     Yang TIDAK ikut berganti dan tidak boleh diganti: ranah username bayangan
     di lib/api.js, nama folder, nama repositori, dan nama tabel basis data.
     Ketiganya bukan tulisan di layar, melainkan pengenal yang sudah tersimpan.

     Sejak 2 November 2026 kode ini juga menjadi versi kedua bernama
     SI-RADAR INTEL, dengan basis data sendiri. Yang berganti hanya tulisan
     dan gambar lencananya. Kunci localStorage `transsiberpas.*`, konstanta
     TRANS_SIBER, dan nama berkas lambang-trans-siber.* sengaja dibiarkan:
     ketiganya pengenal, dan menyamakan keduanya membuat perbaikan di satu
     versi bisa disalin ke versi lain tanpa terjemahan.
  */
  nama: 'SI-RADAR INTEL',
  /** Kepanjangan resmi, untuk halaman masuk dan keterangan aplikasi. */
  kepanjangan: 'Sistem Pemantauan dan Analisis Informasi Digital untuk Deteksi Dini '
    + 'Kerawanan Keamanan pada Subdirektorat Intelijen Ditpamintel',
  /**
     Dua huruf, dipakai ketika berkas lambang tidak tergambar: teks alternatif
     gambar, dan tempat yang memang hanya menerima aksara.
  */
  lambang: 'SR',

  /**
     Tiga lencana resmi, dan hanya di sini alamatnya ditulis. Urutannya sama di
     setiap tempat: sistem lebih dulu (yang menyusun), lalu kementerian dan
     Pemasyarakatan (yang mengeluarkan), menurut jenjangnya.

     Sejak 2 November 2026 lencana Ditpamintel tidak dipakai lagi; dua lencana
     instansi menggantikannya.

     Sistem dan kementerian berbentuk lingkaran penuh yang menyentuh keempat
     tepi berkas, sehingga `border-radius: 50%` cukup. Pemasyarakatan BUKAN
     lingkaran melainkan perisai: berkasnya persegi dengan perisai utuh di
     tengah dan sudut tembus pandang. Memotongnya bundar memangkas puncak
     perisai, jadi setiap tempat memberinya kelas `lencana-perisai`.

     Lembar infografis TIDAK memakai alamat ini — ia menanam lambangnya sebagai
     data URI lewat ui/lambang-data.js, sebab dua dari tiga keluarannya tidak
     bisa mengambil berkas dari mana pun. Alasannya di kepala berkas itu.
  */
  lencana: {
    /** Lencana sistem: SI-RADAR INTEL. */
    sistem: 'assets/lambang-trans-siber.png',
    /** Lencana Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia. */
    kementerian: 'assets/lambang-kementerian.png',
    /** Lambang Pemasyarakatan — perisai, bukan lingkaran. */
    pemasyarakatan: 'assets/lambang-pemasyarakatan.png',
  },

  /**
     Ruang yang dijelaskan di halaman Panduan, selain ruang milik pembacanya.

     SI-RADAR INTEL dipakai Subdirektorat Intelijen di pusat; peran kantor
     wilayah dan unit tidak diterbitkan di sini. Menjelaskan ruang yang tidak
     pernah dihuni siapa pun hanya membuat pembacanya bertanya-tanya apakah
     mereka salah masuk. Peran daerah yang kelak diterbitkan tetap melihat
     ruangnya sendiri; yang disembunyikan hanya ruang yang bukan miliknya.
     Nilai yang dipakai: semua ruang, seperti di Trans-Siber PAS. Untuk hanya ruang pusat: ['pusat'].
  */
  ruangPanduan: ['pusat', 'wilayah', 'unit'],

  instansi: 'Direktorat Pengamanan dan Intelijen',
  /**
     Singkatan resmi direktorat, huruf besar seluruhnya.

     Sampai 7 September 2026 kop menu samping menuliskan "Dirpamintel" — awalan
     yang keliru: satuan kerjanya direktorat, bukan direktur, sehingga
     singkatannya DIT-, bukan DIR-. Kata itu diketik langsung di main.js dan
     tidak punya sumber lain, jadi setiap tempat yang butuh menyebutnya
     mengetiknya sendiri. Sekarang satu tempat.
  */
  instansiSingkat: 'DITPAMINTEL',
  induk: 'Direktorat Jenderal Pemasyarakatan',
  kementerian: 'Kementerian Imigrasi dan Pemasyarakatan',
  versi: '2.0.0',

  url: 'https://diznmklyxkiyqzngbaeu.supabase.co',
  kunciPublik: 'sb_publishable_oim5r_sDW_1MCd862NzWJg_4_IiQviY',

  mode: parameter.get('mode') === 'demo' ? 'demo' : 'langsung',

  /** Berapa baris ditarik sekali jalan pada tabel panjang. */
  ukuranHalaman: 50,

  /** Ambang keyakinan mesin sebelum hasil boleh dipakai tanpa telaah manusia. */
  ambangKeyakinan: 0.75,
}

/**
 * Ukuran data induk UPT, untuk halaman yang harus menyebut angkanya sebelum ada
 * sesi — halaman masuk dan kartu fitur yang belum siap.
 *
 * Angka ini pernah ditulis lima kali di lima berkas berbeda, dan kelimanya
 * menyebut 492 karena memang itulah isi tabelnya. Ketika daftar Ditjenpas
 * dibandingkan ulang pada 1 September 2026, tabelnya ternyata kehilangan 39
 * unit — seluruh LPKA di Indonesia di antaranya — dan lima kalimat di layar
 * ikut salah tanpa ada satu pun yang berubah warna. Sekarang angkanya satu,
 * dan berasal dari satu tempat.
 *
 * Sumber kebenarannya adalah data/master-upt.csv, yang disusun
 * tools/susun-master-upt.mjs dari daftar UPT nasional. Halaman yang sudah punya
 * sesi TIDAK memakai angka ini — mereka menghitung dari tabelnya sendiri.
 *
 * Sampai 3 November 2026 `kanwil` masih 38, padahal sejak lembar induk v3
 * (2 November 2026) data induk dan tabel `upt` memuat 33 kantor wilayah.
 * Halaman masuk menampilkan angka yang salah selama sehari tanpa ada yang
 * berubah warna. tools/uji-induk-upt.mjs kini mencocokkan kedua angka ini
 * dengan data/master-upt.csv.
 */
export const INDUK_UPT = {
  jumlah: 531,
  kanwil: 33,
  /** Unit yang koordinatnya masih titik wilayah, bukan alamat gedung. */
  belumTerverifikasi: 530,
}

export const ADA_DEMO = KONFIG.mode === 'demo'
