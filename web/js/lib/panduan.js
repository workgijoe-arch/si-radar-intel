/**
 * Katalog penjelasan fitur — apa isi tiap layar, dan untuk apa ia ada.
 *
 * ## Kenapa berkas ini terpisah dari halamannya
 *
 * Isinya bukan tampilan, melainkan keterangan yang harus bisa diperiksa. Tiap
 * butir menu di lib/peran.js wajib punya pasangannya di sini, dan sebaliknya
 * tiap butir di sini wajib menunjuk halaman yang benar-benar ada. Keduanya
 * dijaga tools/uji-panduan.mjs, yang gagal ketika sebuah fitur baru ditambahkan
 * ke menu tanpa penjelasannya.
 *
 * Penjagaan itu bukan kerewelan. Panduan yang tidak lengkap tidak terlihat
 * rusak dari mana pun: halamannya tetap terbuka, seluruh fitur yang sudah
 * dijelaskan tetap terbaca, dan yang tidak dijelaskan hanya tidak ada — persis
 * seperti fitur yang memang belum dibuat. Petugas yang mencarinya menyimpulkan
 * fiturnya tidak ada, bukan panduannya yang tertinggal.
 *
 * ## Bentuk tiap butir
 *
 *   isi     Apa yang benar-benar tergambar di layar itu.
 *   guna    Pertanyaan apa yang dijawabnya, dan kapan layar itu dibuka.
 *   catatan Batas yang mudah disalahpahami. Ditulis hanya bila ada.
 *
 * Seluruh nilainya teks polos, tanpa satu pun tanda HTML: halaman yang
 * menggambarnya melewatkannya ke `amankan()`, dan tanda yang ditulis di sini
 * akan tampil sebagai tanda, bukan sebagai penebalan. Penekanan diberikan oleh
 * susunannya — bukan oleh huruf tebal di tengah kalimat.
 *
 * ## Tiga ruang, bukan satu daftar disaring
 *
 * Disusun mengikuti lib/peran.js: tiga menu yang berdiri sendiri, bukan satu
 * menu yang dipangkas. Halaman `input` muncul di ruang pusat dan di ruang
 * wilayah dengan nama berbeda — "Input Berita" dan "Kirim Berita" — dan dengan
 * akibat yang berbeda pula. Satu penjelasan untuk keduanya akan benar separuh.
 */

/* --------------------------------------------------------------- ruang pusat */

const PUSAT = {
  dasbor: {
    isi: 'Keadaan pemberitaan hari ini dalam satu layar: jumlah publikasi beserta '
      + 'selisihnya terhadap kemarin, sebaran sentimen, kejadian yang menuntut '
      + 'perhatian, unit yang paling banyak disorot, peta sebaran seluruh Lapas, Rutan, '
      + 'dan LPKA, serta bilah kesehatan aliran data di puncak halaman.',
    guna: 'Layar pertama yang dibuka setiap pagi. Setiap angka pada ubin bisa ditekan '
      + 'dan membuka daftar yang menghasilkannya, sehingga tidak ada angka yang harus '
      + 'dicari sendiri asal-usulnya.',
    catatan: 'Bilah kesehatan memisahkan dua hal yang mudah tertukar: penyalinan yang '
      + 'berhasil dan baris baru yang benar-benar datang. Penyalin bisa berhasil setiap '
      + 'lima menit tanpa satu pun berita baru masuk.',
  },
  briefing: {
    isi: 'Situasi nasional sebagai kalimat, bukan tabel: satu pernyataan tingkat risiko '
      + 'di puncak, angka-angka besar yang masing-masing membawa pembanding periode '
      + 'sebelumnya, dan daftar pendek hal yang menuntut keputusan. Pada bagian Penilaian '
      + 'risiko, kata tingkat risiko tiap pola bisa ditekan untuk membuka kartu beritanya: '
      + 'judul, sumber asli, tombol telaah, dan tombol jadikan kasus.',
    guna: 'Untuk pimpinan yang punya enam puluh detik, bukan analis yang punya sore hari. '
      + 'Dipakai sebagai bahan bacaan sebelum rapat pimpinan.',
    catatan: 'Tidak ada satu pun angka yang dihitung di halaman ini sendiri; seluruhnya '
      + 'dipinjam dari perhitungan yang sama dengan dasbor, sehingga keduanya tidak '
      + 'pernah berselisih.',
  },
  'deteksi-lonjakan': {
    isi: 'Dua daftar yang dibaca mesin di peladen tiap jam: unit yang mendadak diberitakan '
      + 'buruk berkali-kali dalam sehari, dan isu yang diangkat banyak media sekaligus. '
      + 'Ambang penandaannya tertulis di layar.',
    guna: 'Peringatan Dini menilai berita satu per satu; halaman ini menilai pola. Sebuah unit '
      + 'yang dibicarakan lima kali dengan urgensi sedang lolos dari penilaian per berita, '
      + 'tetapi lima kali dalam satu hari adalah kabar yang harus dibaca malam itu juga.',
    catatan: 'Halaman ini hanya membaca hasil mesin; ia tidak menghitung sendiri. Layar dinding '
      + 'versinya, Situation Room, dibuka dari tombol di dalam halaman ini, bukan dari menu.',
  },
  peta: {
    isi: 'Seluruh Lapas, Rutan, dan LPKA di Indonesia sebagai titik pada satu peta layar '
      + 'penuh, diwarnai menurut kerawanan masing-masing: Kritis, Rawan, Waspada, Terkendali, '
      + 'atau Tanpa pemberitaan. Di sebelahnya ada daftar Sedang mencuat, yaitu unit yang '
      + 'berita negatifnya naik dibanding rentang sebelumnya, beserta panah naik atau turun.',
    guna: 'Menjawab di mana persoalannya menumpuk dan unit mana yang sedang naik. Rentang '
      + 'waktunya bisa dipilih: hari ini, 7 hari, 30 hari, atau seluruh arsip yang termuat. '
      + 'Tujuh hari adalah bawaannya karena pertanyaan halaman ini adalah apa yang sedang '
      + 'terjadi, bukan apa yang pernah terjadi.',
    catatan: 'Warna titik ditentukan aturan kerawanan yang sama dengan seluruh angka di sistem, '
      + 'bukan oleh halaman ini. Koordinat sebagian besar unit masih titik pusat kota, jadi jarak '
      + 'antartitik tidak dapat dipakai sebagai jarak sebenarnya. Peta yang sama juga tergambar '
      + 'di Dasbor Eksekutif, dengan berita sebulan.',
  },
  negatif: {
    isi: 'Seluruh pemberitaan yang merugikan institusi, disusun per PERISTIWA, bukan per '
      + 'publikasi. Delapan berita tentang satu narapidana yang kabur tampil sebagai satu '
      + 'kejadian dengan eksposur delapan. Bagi peran yang berhak, tiap kartu membawa saran '
      + 'tindak lanjut: tangani langsung (sidak), statement klarifikasi, verifikasi dulu, '
      + 'atau pantau, lengkap dengan alasannya.',
    guna: 'Menjawab apa yang sedang merugikan institusi hari ini, dan seberapa keras '
      + 'tekanan opininya. Berdiri sendiri di menu supaya isu merugikan tidak perlu '
      + 'dicari dulu di dalam daftar gabungan. Saringan saran memisahkan yang perlu '
      + 'didatangi dari yang cukup dijawab.',
    catatan: 'Jumlah peristiwa dan jumlah publikasi adalah dua angka yang berbeda dan '
      + 'keduanya ditampilkan. Yang pertama menentukan berapa banyak yang harus ditangani, '
      + 'yang kedua menentukan seberapa besar gaungnya. Saran tindak lanjut adalah saran '
      + 'mesin atau sikap unit; keputusan akhir ada pada analis, dan keputusan analis selalu '
      + 'mengalahkan saran mesin.',
  },
  positif: {
    isi: 'Pemberitaan yang menguatkan institusi, disusun dengan bentuk yang sama seperti '
      + 'kanal negatif.',
    guna: 'Bahan kehumasan, dan penyeimbang ketika sebuah isu negatif perlu dijawab '
      + 'dengan capaian yang sudah terberitakan di unit yang sama.',
  },
  analisis: {
    isi: 'Empat cara membaca arsip yang sama, masing-masing satu tab: Tren (apa yang '
      + 'berubah dibanding periode sebelumnya), Narasi (cerita apa yang sedang berjalan), '
      + 'Kaitan (unit, media, dan tema mana yang saling bertemu), dan Pusat Komando '
      + '(layar besar untuk dinding ruang piket).',
    guna: 'Satu pintu untuk pertanyaan sesudah dasbor: bukan lagi berapa hari ini, '
      + 'melainkan ke mana arahnya, ceritanya apa, dan siapa yang terlibat. Tab yang '
      + 'terakhir dibuka diingat selama sesi.',
    catatan: 'Tab yang tidak menjadi kewenangan peran Anda tidak ditampilkan. Operator '
      + 'Puldata dan Petugas Verifikasi Lapangan hanya melihat Pusat Komando.',
  },
  ruang: {
    isi: 'Empat bagian: yang menuntut hari ini, pantauan milik analis sendiri, temuan '
      + 'aturan peringatan, dan riwayat pendek putusan yang baru saja dibuat.',
    guna: 'Satu-satunya halaman yang menjawab apa yang jadi bagian saya hari ini. '
      + 'Halaman lain menjawab pertanyaan tentang arsip; halaman ini tentang pekerjaan.',
    catatan: 'Pantauan tersimpan di peramban yang sedang dipakai, bukan di basis data. '
      + 'Ia tidak ikut berpindah ke komputer lain dan tidak terbagi ke rekan setim.',
  },
  cari: {
    isi: 'Satu kotak kueri dengan bahasa saringan sendiri. Setiap saringan yang dipasang '
      + 'lewat tombol ikut tertulis ke dalam kotak itu.',
    guna: 'Menjawab pertanyaan yang belum pernah ditanyakan sebelumnya. Karena seluruh '
      + 'saringan tertulis sebagai teks, kuerinya bisa disalin ke rekan lewat pesan, '
      + 'disimpan sebagai pantauan, dan dibaca ulang tiga bulan kemudian.',
    catatan: 'Tidak ada pengubahan status telaah massal di sini. Halaman ini bisa memilih '
      + 'dua ratus baris sekaligus, dan justru karena itu putusannya dibuat di Antrean '
      + 'Telaah, satu per satu, lengkap dengan catatan penelaahnya.',
  },
  berita: {
    isi: 'Tabel seluruh berita dengan enam saringan tetap, kotak cari, dan tombol unduh '
      + 'CSV. Tiap baris bisa dibuka menjadi halaman detailnya sendiri.',
    guna: 'Arsip induk. Dipakai ketika yang dicari sudah diketahui bentuknya — satu unit, '
      + 'satu rentang tanggal, satu status telaah.',
  },
  input: {
    isi: 'Borang satu halaman dengan panel penilaian mesin di sebelah kanan yang berjalan '
      + 'sambil diketik.',
    guna: 'Memasukkan isu viral yang belum tertangkap perayap. Sampai halaman ini ada, '
      + 'berita hanya bisa masuk lewat penyalinan spreadsheet — dan isu yang paling cepat '
      + 'berkembang justru yang paling sering luput dari perayap.',
    catatan: 'Hasilnya tetap berstatus Belum Ditelaah dan tidak langsung menjadi angka. '
      + 'Masukan manual tidak lebih tepercaya daripada hasil mesin hanya karena diketik '
      + 'manusia.',
  },
  lapangan: {
    isi: 'Satu daftar penugasan dipandang dari dua sisi: analis menerbitkan surat tugas, '
      + 'petugas lapangan mengisi laporan dan mengunggah bukti.',
    guna: 'Menyandingkan apa yang ditulis media dengan apa yang benar-benar ada di lokasi.',
    catatan: 'Laporan lapangan tidak pernah mengubah status berita. Unit yang menyatakan '
      + 'berita tentang dirinya keliru tidak bisa membuat berita itu hilang dari angka '
      + 'nasional; yang berhak menyatakan sebuah berita tidak valid adalah analis pusat.',
  },
  evaluasi: {
    isi: 'Matriks penyandingan sebagai baris — apa kata media, apa kata lapangan, cocok '
      + 'atau tidak — lalu rekomendasi sebagai butir-butir tersendiri.',
    guna: 'Mempertemukan dua sumber yang saling bertentangan. Yang bernilai justru '
      + 'selisihnya: unit yang diberitakan kehilangan sepuluh warga binaan dan ternyata '
      + 'kehilangan tiga menghadapi kabar yang benar dengan angka yang salah, dan itu '
      + 'ditangani dengan cara yang sama sekali berbeda dari kabar bohong.',
    catatan: 'Analisis yang sudah diverifikasi tidak bisa disunting lagi. Yang perlu '
      + 'diubah dibuat sebagai versi baru, dan keduanya tetap terbaca.',
  },
  keputusan: {
    isi: 'Analisis beserta rekomendasinya, dan kotak centang pada tiap rekomendasi. Tidak '
      + 'ada penyuntingan apa pun di layar ini.',
    guna: 'Ruang tersempit di seluruh sistem, dan itu disengaja: pimpinan membaca lalu '
      + 'memutuskan. Menyetujui dua dari empat rekomendasi adalah putusan yang sah dan '
      + 'sering terjadi.',
    catatan: 'Putusan tidak bisa dicabut. Yang keliru dikoreksi dengan putusan baru, dan '
      + 'keduanya tetap terbaca berdampingan.',
  },
  'analisis-berita': {
    isi: 'Analisis kasus per kasus. Pilih satu berita negatif — daftarnya dikelompokkan per '
      + 'kanwil — lalu lengkapi fakta 5W1H, analisis, prakiraan, rekomendasi, dan evaluasi '
      + 'SIP. Tentukan tujuannya: Klarifikasi UPT, Tindak lanjut disposisi pimpinan, atau keduanya.',
    guna: 'Hasilnya langsung masuk Tindak Lanjut dan grup Telegram kanwil diberi tahu otomatis. '
      + 'Klarifikasi dari pusat menunggu kanwil meneruskannya ke UPT.',
    catatan: 'Klarifikasi hanya bisa diminta untuk berita yang sudah terpetakan ke UPT. '
      + 'Menganalisis ulang berita yang sama memperbarui analisisnya, bukan membuat permintaan kedua.',
  },
  'tindak-lanjut': {
    isi: 'Tiga tab. Klarifikasi UPT: permintaan klarifikasi per kanwil, siapa yang belum dan '
      + 'sudah menginput, berkasnya, dan penilaiannya. Disposisi Pimpinan: disposisi yang dicatat, '
      + 'dikerjakan, dan dilaporkan hasilnya. Tindak Lanjut Kasus: butir turunan putusan pimpinan '
      + 'atas kasus intelijen, lengkap dengan pelaksana dan tenggat.',
    guna: 'Menjawab apakah UPT sudah menjawab pemberitaan tentang dirinya, dan apakah yang '
      + 'diputuskan pimpinan sudah dikerjakan — tanpa menelepon.',
    catatan: 'Klarifikasi wajib berupa PDF atau DOCX dan wajib menyebut nama serta jabatan '
      + 'pengirimnya. Pengingat UPT yang belum menginput dikirim ke grup Telegram kanwil pukul '
      + '08.00 dan 14.00 WIB.',
  },
  laporan: {
    isi: 'Dua keluaran untuk periode yang sama. Pertama, laporan intelijen berkala: pilih '
      + 'periodenya, tekan satu tombol, dan berkasnya jadi lengkap dengan diagram serta '
      + 'daftar sumbernya, siap dicetak atau disimpan sebagai PDF lewat menu cetak peramban. '
      + 'Kedua, ekspor daftar berita: buku kerja Excel berisi berita pada periode itu, '
      + 'seluruhnya atau hanya yang negatif, berurut negatif dan prioritas lebih dulu, dengan '
      + 'pilihan cepat Hari ini, Kemarin, 7 hari terakhir, dan 30 hari terakhir. Keduanya '
      + 'ditandai menurut Standar Intelijen Pemasyarakatan 2023: klasifikasi (SR, R, YB, YPM), '
      + 'prioritas (Mendesak, Segera, Rutin), kode penyebarluasan (A-E), serta evaluasi sumber '
      + '(A-E) dan informasi (1-5) per berita.',
    guna: 'Ekspor mandiri harian dan mingguan, tanpa menunggu siapa pun menjalankan perintah di '
      + 'belakang layar. Laporan memuat pemberitaan negatif, yaitu daftar hal yang menuntut '
      + 'tindakan; buku kerja Excel memuat daftar lengkapnya beserta peringatan dini dan usulan '
      + 'pemecahan masalah tiap berita negatif.',
    catatan: 'Satu hari laporan berarti pukul 00.00 sampai 23.59 WIB, sama persis dengan '
      + 'jendela yang dipakai laporan harian Telegram. Klasifikasi paling rendah dihitung dari '
      + 'isi berkas dan tidak bisa diturunkan; kode penyebarluasan B, C, dan D menghasilkan '
      + 'versi edaran yang identitas petugasnya dikaburkan. Setiap unduhan tercatat di Jejak Audit.',
  },
  infografis: {
    isi: 'Satu lembar gambar untuk laporan harian atau mingguan, memuat sisi baik dan sisi '
      + 'buruk sekaligus. Yang tampil di layar, yang diunduh sebagai PNG, dan yang tercetak '
      + 'adalah gambar yang sama persis.',
    guna: 'Untuk pembaca yang tidak sedang menangani apa pun — pimpinan, kehumasan, kantor '
      + 'wilayah — dan harus bisa dibaca dalam satu menit. Lembar yang hanya memuat kabar '
      + 'buruk berhenti dibaca setelah pekan ketiga.',
    catatan: 'Seluruhnya digambar di dalam peramban. Tidak ada satu bita pun nama unit atau '
      + 'judul berita yang dikirim ke peladen mana pun untuk dirender.',
  },
  distribusi: {
    isi: 'Pratinjau pesan dan lampiran yang akan dikirim, daftar grup yang akan menerima, '
      + 'tombol kirim, dan riwayat seluruh pengiriman beserta sebab kegagalannya.',
    guna: 'Tempat laporan dan peringatan benar-benar berangkat ke grup Telegram.',
    catatan: 'Tidak ada pengiriman tanpa pratinjau, tanpa tujuan yang disebutkan, dan tanpa '
      + 'catatan. Ketiganya adalah jawaban atas cacat sistem lama yang pernah mengirim dua '
      + 'berita yang tidak pernah terjadi.',
  },
  'siklus-kasus': {
    isi: 'Dua tab berurutan: Antrean Telaah, tempat penilaian mesin atas tiap berita '
      + 'disetujui atau dikoreksi, dan Kasus Intelijen, tempat berita yang pantas dijadikan '
      + 'perkara dibentuk menjadi kasus beserta Analisa Awal, Nilai informasi, dan PIC-nya.',
    guna: 'Satu pintu untuk dua langkah satu pekerjaan: menelaah lalu membentuk kasus. '
      + 'Analisa Awal yang ditulis pada borang Bentuk Kasus tampil di rincian kasus itu.',
    catatan: 'Pimpinan dan Analis Evaluasi tidak menelaah berita; bagi mereka menu ini '
      + 'langsung membuka daftar kasus. Angka pada menu adalah jumlah berita yang menunggu telaah.',
  },
  'pemantauan-sistem': {
    isi: 'Dua tab: Aturan Peringatan (bila apa terjadi, kabari siapa) dan Kesehatan Sistem '
      + '(apakah aliran data, penjadwal, dan sambungan keluar berjalan).',
    guna: 'Menjawab satu pertanyaan dari dua sisi: apakah sistem ini akan memberi tahu pada '
      + 'waktunya — dari aturan yang dinyalakan, dan dari aliran data yang membawa beritanya.',
    catatan: 'Analis hanya melihat tab Aturan Peringatan; Kesehatan Sistem khusus superadmin.',
  },
  'pengguna-data': {
    isi: 'Empat tab pekerjaan superadmin: Pengguna, Koordinat UPT, Integrasi dan Kunci, '
      + 'serta Jejak Audit.',
    guna: 'Menerbitkan dan mengatur akun, membetulkan data induk unit, mengatur sambungan '
      + 'keluar, lalu memeriksa siapa mengubah apa — pekerjaan yang jarang dan berurutan.',
    catatan: 'Admin kanwil tetap membuka halaman Pengguna Wilayah miliknya sendiri, tanpa tab '
      + 'lain dan tanpa nama menu pusat ini.',
  },
}

/* ------------------------------------------------------------- ruang wilayah */

const WILAYAH = {
  dasbor: {
    isi: 'Dasbor Eksekutif yang sama dengan pusat, berisi berita UPT di wilayah Anda saja: '
      + 'angka sebulan, isu teratas, unit yang diberitakan negatif, dan kotak Cari UPT.',
    guna: 'Layar pertama setelah masuk. Berita dihitung milik wilayah Anda bila datang dari '
      + 'lembar kanwil Anda, atau bila UPT-nya tercatat di bawah kanwil Anda di data induk.',
    catatan: 'Pembatasannya dilakukan peladen, bukan halaman: berita wilayah lain tidak pernah '
      + 'sampai ke peramban Anda.',
  },
  'analisis-berita': {
    isi: 'Analisis kasus per kasus atas berita negatif di wilayah Anda. Pilih satu berita, '
      + 'lengkapi fakta 5W1H dan penilaiannya, lalu teruskan sebagai Klarifikasi UPT dan/atau '
      + 'Tindak lanjut disposisi pimpinan.',
    guna: 'Klarifikasi yang Anda buat langsung diteruskan ke UPT-nya; UPT melihatnya di menu '
      + 'Klarifikasi UPT dan grup Telegram kanwil diberi tahu.',
    catatan: 'UPT hanya bisa menjawab bila sudah punya akun penelaah unit — terbitkan di Pengguna Wilayah.',
  },
  'tindak-lanjut': {
    isi: 'Klarifikasi UPT dan Disposisi Pimpinan untuk wilayah Anda. Teruskan permintaan dari '
      + 'pusat ke UPT, nilai berkas klarifikasi yang masuk (terima atau kembalikan), dan catat '
      + 'disposisi pimpinan beserta hasilnya.',
    guna: 'Satu tempat untuk melihat UPT mana yang belum menginput klarifikasi dan mana yang sudah.',
    catatan: 'Admin kanwil boleh mengunggah klarifikasi atas nama UPT bila perlu; namanya tetap '
      + 'tercatat sebagai pengunggah.',
  },
  'kanwil-dasbor': {
    isi: 'Empat ubin di puncak — berita wilayah, yang perlu respons segera, yang menunggu '
      + 'telaah Anda, dan yang menunggu telaah pusat — lalu empat belas hari terakhir '
      + 'sebagai grafik, keseimbangan pemberitaan, unit yang paling banyak disorot, dan '
      + 'sebaran urgensi. Di bawahnya: berita negatif yang belum ditanggapi unit, yang '
      + 'mendesak, dan kiriman Anda sendiri.',
    guna: 'Layar pertama Administrator Kantor Wilayah. Menjawab keadaan pemberitaan '
      + 'seluruh unit di wilayah ini hari ini, dan apa yang menunggu dikerjakan.',
    catatan: 'Seluruh angkanya hanya mencakup wilayah ini. Batas itu ditegakkan basis data, '
      + 'bukan oleh saringan di layar: baris unit wilayah lain tidak pernah sampai ke '
      + 'peramban sejak awal. Tidak ada satu pun angka nasional di ruang ini.',
  },
  input: {
    isi: 'Borang satu halaman dengan panel penilaian mesin di sebelah kanan yang berjalan '
      + 'sambil diketik, dan kop yang menyebutkan wilayah mana yang akan tercatat pada '
      + 'kiriman ini.',
    guna: 'Satu-satunya pintu masuk berita dari daerah. Dipakai untuk berita tentang unit '
      + 'di wilayah ini yang belum tertangkap perayap maupun spreadsheet.',
    catatan: 'Hanya Administrator Kantor Wilayah yang memasukkan berita — bukan karena '
      + 'penelaah tidak dipercaya, melainkan supaya setiap kiriman punya satu orang yang '
      + 'bisa ditanya ketika ia keliru.',
  },
  'wilayah-telaah': {
    isi: 'Antrean berita wilayah satu per satu, lengkap dengan alasan mesin, dan kolom '
      + 'untuk menyetujui atau merevisi kategori, sentimen, serta urgensinya beserta '
      + 'alasan revisinya.',
    guna: 'Justru kantor wilayah dan unitnya yang paling tahu apakah sebuah kabar benar '
      + 'menyangkut unit itu. Revisinya tercatat lengkap dengan nama penelaahnya.',
    catatan: 'Putusan di sini TIDAK menyentuh status verifikasi pusat. Kolom itu milik '
      + 'analis pusat dan menentukan sebuah berita ikut dihitung atau tidak; bila daerah '
      + 'boleh mengisinya, sebuah unit dapat menyatakan berita tentang dirinya sendiri '
      + 'tidak valid dan berita itu lenyap dari angka nasional tanpa pernah dibaca analis.',
  },
  'wilayah-berita': {
    isi: 'Tabel seluruh berita yang menyangkut unit di wilayah ini, dengan saringan dan '
      + 'kotak cari yang sama seperti Pusat Data Berita.',
    guna: 'Arsip wilayah. Dipakai menelusuri riwayat pemberitaan satu unit, satu rentang '
      + 'tanggal, atau satu status telaah.',
    catatan: 'Putusan telaah daerah dan status verifikasi pusat terbaca berdampingan di '
      + 'sini, sehingga keduanya tidak pernah tertukar.',
  },
  'wilayah-unit': {
    isi: 'SELURUH unit yang dibawahi wilayah ini, diambil dari data induk — bukan sepuluh '
      + 'teratas, dan bukan hanya yang pernah diberitakan.',
    guna: 'Kantor wilayah bertanggung jawab atas setiap unitnya, termasuk dan terutama yang '
      + 'tidak pernah muncul di daftar mana pun. Unit yang tidak pernah diberitakan bukan '
      + 'unit yang tidak ada.',
  },
  pengguna: {
    isi: 'Penerbitan akun Penelaah Berita UPT untuk unit di wilayah ini, dan daftar akun '
      + 'yang sudah diterbitkan.',
    guna: 'Memberi tiap unit satu akun untuk menelaah dan menanggapi berita tentang '
      + 'dirinya sendiri.',
    catatan: 'Hanya peran Penelaah Berita UPT yang bisa diterbitkan dari sini, dan hanya '
      + 'untuk unit di wilayah sendiri. Batas itu ditegakkan peladen, bukan oleh pilihan '
      + 'yang disembunyikan di borang.',
  },
}

/* ---------------------------------------------------------------- ruang unit */

const UNIT = {
  klarifikasi: {
    isi: 'Pemberitaan negatif tentang unit Anda yang diminta klarifikasinya oleh kanwil, beserta '
      + 'instruksi dan batas waktunya.',
    guna: 'Unggah berkas klarifikasi (PDF atau DOCX, paling besar 10 MB), isi nama dan jabatan '
      + 'pengirim, lalu kirim. Kanwil dan pusat langsung diberi tahu.',
    catatan: 'Klarifikasi yang dikembalikan kanwil muncul lagi dengan catatan perbaikannya.',
  },
  'upt-dasbor': {
    isi: 'Empat ubin di puncak — berita unit ini, yang perlu respons segera, yang menunggu '
      + 'telaah Anda, dan yang belum ditanggapi — lalu empat belas hari terakhir sebagai '
      + 'grafik dan keseimbangan pemberitaan. Di bawahnya: sikap unit yang sudah dinyatakan, '
      + 'dan yang menunggu tanggapan Anda.',
    guna: 'Layar pertama Penelaah Berita UPT. Menjawab apa yang sedang diberitakan tentang '
      + 'unit ini, dan apa yang belum dijawab.',
    catatan: 'Cakupannya satu unit. Berita unit tetangga tidak pernah sampai ke layar ini, '
      + 'dan daftar unit lain memang bukan urusan peran ini.',
  },
  'wilayah-telaah': {
    isi: 'Antrean berita unit ini satu per satu, lengkap dengan alasan mesin, kolom revisi '
      + 'penilaian, dan kolom tanggapan resmi unit.',
    guna: 'Dua pekerjaan sekaligus: menilai apakah penilaian mesin sudah tepat, dan '
      + 'menuliskan sikap resmi unit atas berita itu.',
    catatan: 'Tanggapan unit adalah pernyataan, bukan putusan. Ia tidak menghapus berita '
      + 'dari angka nasional dan tidak mengubah status verifikasi pusat; ia tersimpan pada '
      + 'kolomnya sendiri dan terbaca berdampingan dengan penilaian pusat.',
  },
  'wilayah-berita': {
    isi: 'Tabel seluruh berita yang menyangkut unit ini, dengan saringan dan kotak cari '
      + 'yang sama seperti di ruang lain.',
    guna: 'Arsip unit. Dipakai menelusuri riwayat pemberitaan unit ini dan melihat mana '
      + 'yang sudah ditanggapi.',
  },
}

/* ------------------------------------------------------- halaman tanpa menu */

/**
 * Halaman yang tidak punya butir menu, tetapi tetap dibuka petugas setiap hari.
 *
 * Dipisah dari ketiga ruang di atas supaya penjaga cakupan bisa membedakan
 * "belum dijelaskan" dari "memang tidak ada di menu".
 */
export const TANPA_MENU = {
  /* Bagian-bagian menu gabungan 23 September 2026, dan dua halaman yang
     kehilangan butir menunya. Penjelasannya tetap per bagian, sebab tiap
     bagian menjawab pertanyaan yang berbeda dan punya batasnya sendiri. */
  telaah: {
    isi: 'Antrean satu berita per layar, lengkap dengan alasan mesin: kata kunci penentu, '
      + 'skor keyakinan, dan pesaing terdekatnya. Analis menyetujui atau mengoreksi, lalu '
      + 'lanjut ke berita berikutnya.',
    guna: 'Tempat penilaian mesin menjadi penilaian resmi. Tanpa halaman ini, hasil '
      + 'berkeyakinan 0,20 dan 0,95 sama-sama masuk laporan tanpa pernah dibaca manusia.',
    catatan: 'Bentuk antrean dipilih, bukan tabel. Tabel dua puluh baris mengundang orang '
      + 'mencentang semuanya sekaligus; satu berita yang memenuhi layar menuntut ia dibaca '
      + 'lebih dulu.',
  },
  kasus: {
    isi: 'Perkara intelijen: beberapa publikasi dan peristiwa yang diikat menjadi satu '
      + 'berkas dengan riwayat penanganannya.',
    guna: 'Tempat pemberitaan berhenti menjadi daftar dan mulai menjadi perkara. '
      + 'Menjawab sudah sampai mana penanganan sebuah perkara — pertanyaan yang tidak '
      + 'punya tempat untuk dijawab di dalam tabel berita.',
  },
  aturan: {
    isi: 'Daftar aturan peringatan: bila apa terjadi, kabari siapa. Setiap kali syaratnya '
      + 'diubah, jangkauannya dihitung ulang terhadap arsip yang termuat — sebelum tombol '
      + 'Simpan ditekan.',
    guna: 'Menuliskan pertanyaan tetap sebuah kantor supaya tidak perlu ditanyakan ulang '
      + 'setiap hari.',
    catatan: 'Lima aturan bawaan bisa dimatikan dan ambangnya bisa disunting, tetapi tidak '
      + 'bisa dihapus. Tombolnya karena itu berbunyi Pulihkan, bukan Hapus.',
  },
  kesehatan: {
    isi: 'Keadaan tiap komponen yang bekerja di belakang layar: penyalin sumber, perayap, '
      + 'penjadwal laporan, dan pengiriman Telegram — masing-masing dinilai dari WAKTU '
      + 'kegiatan terakhirnya, dengan ambang diamnya tertulis di layar.',
    guna: 'Menjawab apakah sistemnya masih bekerja. Ketiganya bisa berhenti tanpa satu pun '
      + 'galat muncul di layar siapa pun, dan itulah kelas kegagalan yang paling lama tidak '
      + 'ketahuan.',
  },
  pengguna: {
    isi: 'Penerbitan akun beserta perannya, dan daftar akun yang sudah ada.',
    guna: 'Menerbitkan akun untuk petugas baru. Superadmin menerbitkan peran apa pun; '
      + 'Administrator Kantor Wilayah hanya Penelaah Berita UPT di wilayahnya sendiri.',
    catatan: 'Kolom identitas boleh diisi alamat surel (misalnya Gmail kanwil) atau username '
      + 'pendek, untuk peran apa pun. Petugas masuk dengan apa yang ditulis di kolom itu.',
  },
  koordinat: {
    isi: 'Satu unit pada satu waktu, dengan pratinjau titiknya di atas peta yang sama '
      + 'dengan Peta Sebaran, dan kolom untuk membetulkan atau membenarkan koordinatnya.',
    guna: 'Memperbaiki titik yang masih berupa pusat kota. Pratinjaunya cukup untuk '
      + 'menangkap kelas kesalahan yang paling sering: bujur dan lintang tertukar, atau '
      + 'tanda minus hilang.',
  },
  integrasi: {
    isi: 'Pemeriksaan sambungan Telegram: empat langkah penyiapan dengan tanda sudah atau '
      + 'belum, dan kalimat yang menyebutkan persis apa yang salah pada kunci tersimpan.',
    guna: 'Menyelesaikan penyiapan bot Telegram tanpa perlu membuka baris perintah. '
      + 'Sebelumnya penyiapan bisa macet berhari-hari tanpa satu pun layar yang bisa '
      + 'menjelaskan sebabnya.',
    catatan: 'Tidak ada kolom isian kunci di halaman ini, dan tidak boleh pernah ada. '
      + 'Kunci bot tidak pernah melewati peramban; yang terlihat di sini hanya hasil '
      + 'pemeriksaannya.',
  },
  audit: {
    isi: 'Riwayat tindakan pengguna, hanya bisa dibaca. Yang mengubah keadaan tampil lebih '
      + 'dulu; pembacaan halaman disembunyikan di balik sakelar.',
    guna: 'Menelusuri siapa melakukan apa dan kapan.',
    catatan: 'Tidak ada tombol sunting dan tidak ada tombol hapus, sebab basis data memang '
      + 'tidak menyediakan jalannya. Jejak yang bisa dihapus oleh yang meninggalkannya '
      + 'bukan jejak.',
  },
  pemetaan: {
    isi: 'Berita yang unitnya belum dikenali, beserta kandidat unit sebagai tombol — hasil '
      + 'mesin pencocokan yang dijalankan ulang di peramban. Ada pula pencarian bebas ke '
      + 'seluruh unit pada data induk.',
    guna: 'Memutuskan unit mana yang dimaksud sebuah berita ketika skor mesin di bawah '
      + 'ambang otomatis. Berita yang tidak terpetakan tidak pernah muncul di peta, di '
      + 'daftar unit, maupun di lembar wilayah.',
  },
  sinkronisasi: {
    isi: 'Keadaan tiap sumber data: kapan terakhir ditarik, berapa baris yang datang, dan '
      + 'sebab kegagalan bila ada. Sumber pusat dan sumber tiap kantor wilayah dilaporkan '
      + 'terpisah.',
    guna: 'Menjawab kenapa hari ini sepi. Kosongnya data lebih sering berarti penarikan '
      + 'terhenti daripada berarti tidak ada berita.',
    catatan: 'Tidak ada tombol tarik sekarang di halaman ini, dan itu disengaja: '
      + 'menariknya menuntut token yang tidak boleh berada di peramban. Penjadwal di '
      + 'basis data sudah menariknya sendiri.',
  },
  /* Empat tab Analisis Pemberitaan. Penjelasannya tetap dipisah per tab, sebab
     tiap tab menjawab pertanyaan yang berbeda dan punya batasnya sendiri. */
  tren: {
    isi: 'Perbandingan periode berjalan terhadap periode sebelumnya yang panjangnya '
      + 'persis sama: ubin bertumbuh atau menyusut, batang per kategori, dan tabel '
      + 'subkategori yang naik paling tajam.',
    guna: 'Dasbor menjawab keadaan hari ini; halaman ini menjawab apa yang BERUBAH. '
      + 'Dipakai menyusun laporan mingguan dan bulanan.',
    catatan: 'Tidak ada ramalan di sini, dan itu disengaja. Sistem ini mencatat '
      + 'pemberitaan yang sudah terbit.',
  },
  narasi: {
    isi: 'Kumpulan peristiwa yang membentuk satu cerita, tiap cerita satu kartu: '
      + 'bentuknya (menanjak, berulang, bertahan, mereda), sebarannya, pemantiknya, dan '
      + 'ada tidaknya suara penyeimbang.',
    guna: 'Menjawab cerita apa yang sedang berjalan tentang institusi — satu lapis di '
      + 'atas peristiwa. Satu kartu bisa memuat tiga kejadian di tiga unit berbeda, dan '
      + 'memang begitulah publik membacanya.',
    catatan: 'Pemantik disebut sebagai terbitan paling awal yang tercatat, bukan sebagai '
      + 'sumber narasi. Arsip ini hanya memuat yang berhasil ditangkap.',
  },
  jaringan: {
    isi: 'Gambar kaitan antara unit, media, wilayah, tema, dan platform. Tebal garis '
      + 'berarti berapa kali dua hal muncul di publikasi yang sama; besar simpul berarti '
      + 'berapa publikasi menyebutnya.',
    guna: 'Menjawab tiga pertanyaan yang tidak bisa dijawab tabel: media mana yang '
      + 'mengangkat unit ini dan apa lagi yang mereka angkat, tema apa yang muncul di '
      + 'banyak unit sekaligus, dan siapa yang menjembatani dua kelompok.',
    catatan: 'Tidak ada simpul orang di sini, dan tidak akan ada sampai kewenangan '
      + 'pengumpulan data akun perorangan dinyatakan tertulis.',
  },
  komando: {
    isi: 'Enam angka nasional berukuran besar dan daftar peringatan terberat yang diam, '
      + 'beserta waktu penyegaran terakhir.',
    guna: 'Untuk dinding ruang piket — dibaca dari jarak tiga meter oleh orang yang '
      + 'sedang berdiri sambil menerima telepon. Isinya sama dengan dasbor; bentuknya '
      + 'yang berbeda.',
  },
  peringatan: {
    isi: 'Kejadian berurgensi tinggi dan kritis sebagai kartu satu per satu, dengan pita '
      + 'kerawanan di tepi kiri — bukan sebagai tabel.',
    guna: 'Dibaca ketika sesuatu sedang berlangsung. Kartunya muncul juga sebagai jendela '
      + 'ketika kata risiko di halaman Peringatan Dini ditekan; halaman penuhnya dibuka dari '
      + 'tombol Lihat semua di dasbor.',
    catatan: 'Label AWAL berarti belum ditelaah analis; label RESMI berarti sudah '
      + 'diverifikasi. Hanya yang kedua yang boleh menjadi dasar keputusan.',
  },
  'berita-detail': {
    isi: 'Satu berita utuh beserta dasar penilaiannya: kata kunci penentu, skor mesin, '
      + 'catatan telaah analis, dan tanggapan unit bila sudah ada. Bagi peran yang berhak, '
      + 'di puncaknya ada kartu Rekomendasi tindak lanjut: saran beserta alasan dan langkahnya, '
      + 'dan formulir untuk mencatat hasil verifikasi dan keputusan.',
    guna: 'Menjawab pertanyaan yang paling sering ditanyakan dan paling sulit dijawab: '
      + 'kenapa berita ini dinilai begitu, dan apa yang sebaiknya dilakukan sesudahnya. '
      + 'Dibuka dari Pusat Data Berita, dari kartu Berita Negatif, dan dari palet '
      + 'perintah.',
    catatan: 'Halaman ini hanya untuk peran pusat, sebab ia menampilkan catatan analis '
      + 'pusat. Membukanya bagi daerah berarti melepas catatan itu ke wilayah.',
  },
  profil: {
    isi: 'Nama, nama pengguna, dan kata sandi milik sendiri.',
    guna: 'Setiap peran berhak menyunting identitasnya sendiri, terlepas dari kewenangan '
      + 'apa pun yang ia punya atas data lain.',
  },
  panduan: {
    isi: 'Halaman yang sedang Anda baca: penjelasan tiap fitur menurut ruangnya, manual '
      + 'mengirim berita, dan aturan jendela pelaporan harian.',
    guna: 'Dibuka petugas baru pada hari pertama, dan dibuka siapa pun yang lupa sebuah '
      + 'layar untuk apa. Tersedia bagi seluruh peran.',
  },
}

/* ---------------------------------------------------------------- tutorial */

/**
 * Cara memakai tiap fitur, sebagai langkah berurutan.
 *
 * Dipisahkan dari katalog di atas karena menjawab pertanyaan yang lain. Katalog
 * menjawab "layar ini isinya apa dan untuk apa"; tutorial menjawab "saya
 * membukanya, lalu apa". Yang pertama dibaca sekali; yang kedua dibaca setiap
 * kali orang lupa urutannya.
 *
 * Halaman panduan hanya menampilkan tutorial fitur yang boleh dibuka peran
 * pembacanya. Tutorial untuk layar yang tidak bisa dibuka adalah janji yang
 * tidak bisa ditepati, dan petugas yang membacanya menyimpulkan haknya kurang.
 *
 * Teks polos, seperti katalog. Penjaganya di tools/uji-panduan.mjs: tiap butir
 * menu pusat wajib punya tutorial minimal tiga langkah.
 */
export const LANGKAH = {
  dasbor: [
    'Buka Dasbor Eksekutif; ini layar pertama setelah masuk. Pilih tab Bulan ini atau Bulan lalu di bawah judul.',
    'Baca bilah kesehatan data di puncak: ia menunjukkan apakah penyalinan berjalan dan apakah ada berita baru yang benar-benar masuk.',
    'Baca ubin angka dari kiri ke kanan. Tekan sebuah ubin untuk membuka daftar berita yang menghasilkan angka itu.',
    'Bila ada kotak peringatan merah di bawah tab, baca dan buka daftarnya; itu kejadian yang menunggu penanganan.',
    'Gulir ke bawah untuk unit yang diberitakan negatif dalam 24 jam terakhir. Peta sebaran tampil di bagian bawah bagi peran yang berhak.',
  ],
  briefing: [
    'Buka Peringatan Dini dan baca pernyataan tingkat risiko di puncak halaman.',
    'Baca angka-angka besar; masing-masing membawa pembanding periode sebelumnya.',
    'Baca daftar pendek hal yang menuntut keputusan.',
    'Di bagian Penilaian risiko, tekan kata tingkat risiko sebuah pola untuk membuka kartu beritanya: judul, sumber asli, tombol telaah, dan tombol jadikan kasus.',
  ],
  'deteksi-lonjakan': [
    'Buka Deteksi Lonjakan dan baca tiga ubin di puncak: unit yang melonjak, isu lintas media, dan waktu pembacaan terakhir.',
    'Pada daftar unit yang melonjak, baca ambang yang tertulis di layar supaya tahu persis apa yang membuat sebuah unit ditandai.',
    'Buka contoh artikel pada tiap butir untuk memastikan lonjakannya sungguhan, bukan satu berita yang disalin banyak situs.',
    'Untuk layar dinding ruang piket, tekan Buka Situation Room.',
  ],
  peta: [
    'Buka Peta Kerawanan. Titik berwarna menunjukkan kerawanan tiap Lapas, Rutan, dan LPKA; legenda di bawah peta menjelaskan warnanya.',
    'Pilih rentang waktu di bilah atas: Hari ini, 7 hari, 30 hari, atau Semua termuat. Bawaannya 7 hari.',
    'Baca daftar Sedang mencuat di sisi kanan. Panah merah naik berarti berita negatif unit itu bertambah dibanding rentang sebelumnya.',
    'Tekan nama unit di daftar atau titik di peta untuk membuka rincian unit dan berita yang mewarnainya.',
    'Gunakan kotak cari, saringan kantor wilayah, dan tombol Hanya yang bermasalah untuk menyempitkan peta. Tahan Ctrl sambil memutar roda untuk memperbesar.',
  ],
  negatif: [
    'Buka Berita Negatif. Satu kartu adalah satu peristiwa; batang di bawahnya menunjukkan besar tekanan opininya.',
    'Saring menurut tingkat urgensi, atau urutkan menurut Eksposur, Publikasi, atau Terbaru.',
    'Pada baris Saran tindak lanjut, tekan Sidak, Klarifikasi, Verifikasi, atau Pantau untuk hanya melihat peristiwa dengan saran itu. Angka di tiap tombol adalah jumlah peristiwanya.',
    'Pada sebuah kartu, buka Alasan dan langkah yang disarankan untuk tahu kenapa mesin menyarankan itu dan apa langkah berikutnya.',
    'Tekan Catat keputusan untuk membuka detail berita dan menyimpan hasil verifikasi beserta keputusan Anda.',
    'Bila peristiwa perlu perkara tersendiri, tekan Jadikan kasus.',
  ],
  positif: [
    'Buka Berita Positif; susunannya sama dengan kanal negatif.',
    'Cari peristiwa dengan jumlah media terbanyak untuk dijadikan bahan penyeimbang.',
    'Pakai unit yang sama dengan isu negatif sebagai acuan: capaian di unit itu adalah jawaban yang paling kuat.',
  ],
  analisis: [
    'Buka Analisis Pemberitaan dan pilih tab: Tren, Narasi, Kaitan, atau Pusat Komando.',
    'Mulai dari Tren untuk tahu apa yang berubah dibanding periode sebelumnya.',
    'Pindah ke Narasi untuk melihat cerita apa yang sedang berjalan, lalu ke Kaitan untuk melihat unit, media, dan tema yang saling bertemu.',
    'Tab yang terakhir dibuka diingat selama sesi.',
  ],
  ruang: [
    'Buka Ruang Analis; ini halaman tentang pekerjaan Anda hari ini, bukan tentang arsip.',
    'Baca bagian yang menuntut hari ini lebih dulu.',
    'Periksa pantauan milik Anda dan temuan aturan peringatan.',
    'Pantauan tersimpan di peramban ini saja; ia tidak ikut ke komputer lain.',
  ],
  cari: [
    'Buka Pencarian Lanjutan dan ketik kueri pada kotak. Saringan yang dipasang lewat tombol ikut tertulis ke dalam kotak itu.',
    'Gabungkan syarat dengan DAN, ATAU, dan TIDAK; pakai tanda kutip untuk frasa.',
    'Simpan kueri yang sering dipakai sebagai pantauan.',
    'Unduh hasilnya sebagai CSV lewat tombol unduh.',
    'Untuk mengubah status telaah, buka berita lewat Antrean Telaah; halaman ini sengaja tidak mengubah status massal.',
  ],
  berita: [
    'Buka Pusat Data Berita dan pakai enam saringan tetap atau kotak cari.',
    'Tekan sebuah baris untuk membuka halaman detail berita itu.',
    'Tekan tombol unduh untuk mendapat CSV dari hasil saringan yang sedang tampil.',
    'Untuk berkas periode harian atau mingguan yang lengkap, pakai Laporan Berkala.',
  ],
  input: [
    'Buka Input Berita. Borangnya satu halaman, dengan panel penilaian mesin di sebelah kanan.',
    'Ikuti manual mengirim berita di bagian bawah panduan ini, langkah demi langkah.',
    'Setelah menyimpan, berita berstatus Belum Ditelaah dan baru ikut dihitung setelah penelaah menyetujuinya.',
  ],
  'siklus-kasus': [
    'Buka Kasus Intelijen. Bila peran Anda menelaah, tab pertama adalah Antrean Telaah.',
    'Pada Antrean Telaah, baca alasan mesin untuk satu berita, lalu setujui atau koreksi. Berita berikutnya muncul sesudahnya.',
    'Pindah ke tab Kasus Intelijen untuk melihat perkara yang sedang berjalan beserta riwayat penanganannya.',
    'Untuk membentuk kasus baru, isi Analisa Awal, Nilai informasi, dan PIC pada borang Bentuk Kasus.',
  ],
  lapangan: [
    'Buka Verifikasi Lapangan untuk melihat daftar penugasan.',
    'Analis menerbitkan surat tugas dari kasus yang dipilih.',
    'Petugas lapangan membuka penugasannya, mengisi laporan, dan mengunggah bukti.',
    'Laporan lapangan tidak mengubah status berita; yang berhak menyatakan berita tidak valid adalah analis pusat.',
  ],
  evaluasi: [
    'Buka Evaluasi dan Rekomendasi dan pilih kasus yang laporan lapangannya sudah masuk.',
    'Baca matriks penyandingan: apa kata media, apa kata lapangan, cocok atau tidak.',
    'Tulis rekomendasi sebagai butir-butir tersendiri, satu tindakan satu butir.',
    'Analisis yang sudah diverifikasi tidak bisa disunting; buat versi baru bila ada yang perlu diubah.',
  ],
  keputusan: [
    'Buka Keputusan Pimpinan dan baca analisis beserta rekomendasinya.',
    'Centang rekomendasi yang disetujui. Menyetujui sebagian saja adalah putusan yang sah.',
    'Simpan putusan. Putusan tidak bisa dicabut; yang keliru dikoreksi dengan putusan baru.',
  ],
  'analisis-berita': [
    'Buka Analisis Berita. Pusat melihat berita negatif dikelompokkan per kanwil; kanwil melihat berita wilayahnya.',
    'Pilih satu berita. Lengkapi fakta 5W1H, analisis, prakiraan, dan rekomendasi; periksa evaluasi sumber dan informasinya.',
    'Centang tujuannya: Klarifikasi UPT (isi instruksi dan batas waktu) dan/atau Tindak lanjut disposisi pimpinan.',
    'Tekan Simpan analisis & teruskan. Hasilnya muncul di Tindak Lanjut dan grup Telegram kanwil diberi tahu.',
  ],
  'tindak-lanjut': [
    'Buka Tindak Lanjut lalu pilih tab Klarifikasi UPT, Disposisi Pimpinan, atau Tindak Lanjut Kasus.',
    'Klarifikasi dari pusat: kanwil menekan Teruskan ke UPT. UPT mengunggah PDF/DOCX beserta nama dan jabatan pengirim.',
    'Klarifikasi yang masuk dinilai: Terima, atau Kembalikan dengan catatan perbaikan.',
    'Disposisi: catat pimpinan dan isi disposisinya, laporkan kemajuannya, lalu Tandai selesai.',
  ],
  laporan: [
    'Buka Laporan Berkala. Pilih jenis laporan: Harian, Mingguan, atau Bulanan; tanggalnya terisi otomatis.',
    'Ubah tanggal Mulai dan Sampai bila perlu. Satu hari adalah pukul 00.00 sampai 23.59 WIB menurut waktu berita ditangkap.',
    'Tekan Susun laporan. Berkas dibuat di peramban Anda sendiri, tanpa mengirim data ke pihak lain.',
    'Pada kartu Penandaan produk intelijen, periksa klasifikasi, prioritas, dan kode penyebarluasan; isi Ditujukan kepada bila ada. Klasifikasi paling rendah sudah dihitung dari isinya.',
    'Centang pernyataan perlakuan. Tanpa centang itu tombol unduh tidak aktif.',
    'Pada Laporan siap, tekan Buka, atau Unduh HTML lalu cetak sebagai PDF lewat menu Cetak peramban.',
    'Untuk mengirimnya ke pimpinan, tekan Kirim lewat Telegram; halaman itu menampilkan pratinjau lebih dulu.',
    'Untuk daftar berita, pakai kartu Ekspor daftar berita: pilih Hari ini, Kemarin, 7 hari terakhir, atau 30 hari terakhir, lalu Unduh Excel seluruh berita atau hanya yang negatif. Lembar Keterangan di dalamnya menjelaskan setiap kode.',
    'Bila muncul peringatan arsip terpotong, periode yang Anda pilih lebih panjang dari arsip yang termuat; persempit periodenya.',
  ],
  infografis: [
    'Buka Lembar Infografis dan pilih harian atau mingguan.',
    'Periksa lembar di layar: tiga lambang resmi di kepalanya, peta sebaran, dan ringkasan sisi baik serta sisi buruk.',
    'Tekan Unduh PNG untuk dikirim lewat pesan, Unduh SVG untuk diolah desainer, atau Cetak untuk kertas. Ketiganya gambar yang sama.',
  ],
  distribusi: [
    'Buka Distribusi Telegram dan pilih jenis ringkasan, lalu tekan Susun ringkasan.',
    'Baca pratinjau pesan dan lampirannya sebelum apa pun dikirim.',
    'Pilih grup tujuan. Tidak ada pengiriman tanpa tujuan yang disebutkan.',
    'Tekan Kirim ke grup terpilih, lalu periksa riwayat pengiriman di bawahnya.',
    'Bila pengiriman gagal, riwayat menyebut sebabnya; sambungan bot diperiksa di Integrasi dan Kunci.',
  ],
  'pengguna-data': [
    'Buka Pengguna & Data Induk dan pilih tab: Pengguna, Koordinat UPT, Integrasi dan Kunci, atau Jejak Audit.',
    'Pada tab Pengguna, terbitkan akun baru dan pilih perannya. Superadmin boleh menerbitkan peran apa pun.',
    'Pada Koordinat UPT, betulkan titik unit yang masih berupa pusat kota, lalu periksa pratinjaunya di peta.',
    'Periksa Jejak Audit secara berkala untuk melihat siapa mengubah apa.',
  ],
  'pemantauan-sistem': [
    'Buka Pemantauan Sistem dan pilih tab Aturan Peringatan atau Kesehatan Sistem.',
    'Pada Aturan Peringatan, tulis syarat dan penerimanya; jangkauan aturan dihitung ulang terhadap arsip sebelum Anda menyimpan.',
    'Pada Kesehatan Sistem (khusus superadmin), pastikan penyalin sumber, perayap, penjadwal laporan, dan pengiriman Telegram tidak diam melewati ambangnya.',
  ],
  /* Layar yang tidak punya butir menu. */
  telaah: [
    'Buka Antrean Telaah lewat menu Kasus Intelijen.',
    'Baca berita yang tampil beserta alasan mesin: kata kunci penentu, skor keyakinan, dan pesaing terdekat.',
    'Setujui bila penilaian tepat, atau koreksi kategori, sentimen, dan urgensinya.',
    'Lanjut ke berita berikutnya; antrean menampilkan satu berita per layar supaya setiap berita dibaca.',
  ],
  kasus: [
    'Buka tab Kasus Intelijen di dalam menu Kasus Intelijen.',
    'Pilih sebuah kasus untuk membaca publikasi yang diikat dan riwayat penanganannya.',
    'Perbarui tahap penanganan sesuai wewenang peran Anda.',
  ],
  aturan: [
    'Buka tab Aturan Peringatan di Pemantauan Sistem.',
    'Pilih aturan bawaan untuk mengubah ambangnya, atau tambah aturan baru: bila apa terjadi, kabari siapa.',
    'Perhatikan jangkauan yang dihitung ulang setiap kali syarat diubah, sebelum menekan Simpan.',
    'Aturan bawaan tidak bisa dihapus; tombolnya Pulihkan.',
  ],
  kesehatan: [
    'Buka tab Kesehatan Sistem di Pemantauan Sistem.',
    'Baca waktu kegiatan terakhir tiap komponen dan bandingkan dengan ambang diamnya yang tertulis.',
    'Komponen yang melewati ambang berarti ada yang berhenti walau tidak ada galat di layar siapa pun.',
  ],
  pengguna: [
    'Buka tab Pengguna di Pengguna & Data Induk.',
    'Isi identitas (alamat surel atau username), nama, dan peran, lalu terbitkan akun.',
    'Cari akun yang sudah ada di daftar untuk memeriksa atau mengubahnya.',
    'Petugas masuk dengan apa yang tertulis pada kolom identitas.',
  ],
  koordinat: [
    'Buka tab Koordinat UPT dan pilih satu unit.',
    'Isi atau betulkan lintang dan bujurnya, lalu lihat pratinjau titiknya di peta.',
    'Waspadai dua kesalahan yang paling sering: lintang dan bujur tertukar, atau tanda minus hilang.',
  ],
  integrasi: [
    'Buka tab Integrasi dan Kunci.',
    'Ikuti empat langkah penyiapan Telegram dan lihat tanda sudah atau belum pada tiap langkah.',
    'Bila ada yang salah, kalimat di layar menyebut persisnya; kunci bot tidak pernah diketik di halaman ini.',
  ],
  audit: [
    'Buka tab Jejak Audit.',
    'Baca tindakan yang mengubah keadaan, yang tampil lebih dulu; nyalakan sakelar untuk ikut melihat pembacaan halaman.',
    'Halaman ini hanya bisa dibaca; tidak ada yang bisa disunting atau dihapus.',
  ],
  pemetaan: [
    'Buka Pemetaan UPT dari tombol di halaman lain.',
    'Pilih berita yang unitnya belum dikenali, lalu tekan kandidat unit yang benar.',
    'Bila tidak ada kandidat yang cocok, cari unitnya di pencarian bebas ke seluruh data induk.',
    'Berita yang tidak terpetakan tidak pernah muncul di peta, jadi pekerjaan ini menentukan isi peta.',
  ],
  sinkronisasi: [
    'Buka Sinkronisasi Sumber dari tombol di halaman lain.',
    'Baca kapan tiap sumber terakhir ditarik dan berapa baris yang datang.',
    'Bila ada kegagalan, sebabnya tertulis; hari yang sepi lebih sering berarti penarikan terhenti daripada tidak ada berita.',
  ],
  tren: [
    'Buka tab Tren di Analisis Pemberitaan.',
    'Baca ubin bertumbuh atau menyusut terhadap periode sebelumnya yang sama panjang.',
    'Lihat tabel subkategori yang naik paling tajam untuk bahan laporan mingguan dan bulanan.',
  ],
  narasi: [
    'Buka tab Narasi di Analisis Pemberitaan.',
    'Baca bentuk tiap cerita: menanjak, berulang, bertahan, atau mereda.',
    'Periksa pemantiknya dan ada tidaknya suara penyeimbang sebelum menyimpulkan.',
  ],
  jaringan: [
    'Buka tab Kaitan di Analisis Pemberitaan.',
    'Baca tebal garis sebagai seberapa sering dua hal muncul bersama, dan besar simpul sebagai jumlah publikasinya.',
    'Gunakan untuk menjawab media mana yang mengangkat sebuah unit dan tema apa yang muncul di banyak unit sekaligus.',
  ],
  komando: [
    'Buka tab Pusat Komando di Analisis Pemberitaan, atau Situation Room dari Deteksi Lonjakan.',
    'Tampilkan di layar dinding; enam angka nasional terbaca dari jarak tiga meter.',
    'Perhatikan waktu penyegaran terakhir di sudut layar.',
  ],
  peringatan: [
    'Buka Daftar Peringatan lewat tombol Lihat semua di dasbor.',
    'Baca kartu kejadian satu per satu; pita warna di tepi kiri menunjukkan kerawanannya.',
    'Perhatikan labelnya: AWAL berarti belum ditelaah analis, RESMI berarti sudah diverifikasi dan boleh jadi dasar keputusan.',
  ],
  'berita-detail': [
    'Buka sebuah berita dari Pusat Data Berita, dari kartu Berita Negatif, atau dari palet perintah.',
    'Baca kartu Rekomendasi tindak lanjut di puncak: saran, alasannya, dan langkah yang disarankan.',
    'Periksa dasar penilaian mesin, mutu penilaian, liputan serumpun, serta telaah dan tanggapan unit.',
    'Setelah memeriksa ke unit atau sumber aslinya, pilih Hasil verifikasi pada formulir; tindakan ikut bergeser ke akibatnya, dan Anda tetap bebas mengubahnya.',
    'Tulis catatan singkat: siapa yang dihubungi, apa yang ditemukan, apa yang akan dilakukan.',
    'Tekan Simpan keputusan. Keputusan Anda mengalahkan saran mesin, dan perbedaannya tetap terbaca oleh yang lain.',
  ],
  panduan: [
    'Baca kotak di puncak: ia menyebut peran Anda dan menjelaskan bahwa yang tampil hanya layar yang bisa Anda buka.',
    'Mulai dari Alur kerja untuk peran Anda, yaitu urutan layar yang disarankan untuk satu hari.',
    'Buka Cara memakai pada fitur yang sedang Anda cari, atau ketik namanya di kotak cari; hasil pencarian membuka tutorialnya otomatis.',
    'Tekan Cetak panduan bila perlu salinan kertas. Pengelola pengguna juga melihat bagian Hak akses menurut peran di bawah.',
  ],
  profil: [
    'Buka Profil Saya dari kaki menu samping.',
    'Ubah nama, nama pengguna, atau kata sandi milik Anda sendiri.',
    'Setiap peran boleh menyunting identitasnya sendiri, apa pun kewenangannya yang lain.',
  ],
}

/**
 * Alur kerja per peran pusat: urutan yang disarankan untuk satu hari.
 *
 * Yang ditulis hanya layar yang benar-benar bisa dibuka peran itu. Daftar hak
 * aksesnya TIDAK ditulis di sini; halaman panduan menghitungnya dari
 * lib/peran.js, sehingga tidak bisa berselisih dengan menu yang sebenarnya.
 */
export const ALUR_PERAN = {
  super_admin: [
    'Pemantauan Sistem, tab Kesehatan Sistem: pastikan penyalin sumber, perayap, dan penjadwal masih bekerja.',
    'Dasbor Eksekutif dan Peta Kerawanan: lihat keadaan hari ini dan unit yang sedang mencuat.',
    'Berita Negatif: baca saran tindak lanjut tiap peristiwa, dan catat keputusan bagi yang sudah diperiksa.',
    'Laporan Berkala dan Lembar Infografis: susun atau unduh laporan harian dan mingguan.',
    'Pengguna & Data Induk: terbitkan akun petugas baru, betulkan koordinat unit, dan periksa Jejak Audit secara berkala.',
  ],
  executive_decision_maker: [
    'Peringatan Dini: baca tingkat risiko dan daftar hal yang menuntut keputusan.',
    'Dasbor Eksekutif dan Peta Kerawanan: lihat keadaan dan unit yang sedang mencuat.',
    'Berita Negatif: peristiwa bersaran Sidak adalah yang paling mendesak; Klarifikasi berarti cukup dijawab.',
    'Keputusan Pimpinan: baca analisis dan rekomendasi, lalu centang yang disetujui.',
    'Tindak Lanjut: periksa kemajuan putusan sebelumnya, terutama yang lewat tenggat.',
    'Laporan Berkala dan Lembar Infografis sebagai bahan bacaan rapat.',
  ],
  media_intelligence_analyst: [
    'Ruang Analis: lihat apa yang menuntut hari ini.',
    'Kasus Intelijen, Antrean Telaah: setujui atau koreksi penilaian mesin atas berita yang menunggu.',
    'Berita Negatif: untuk tiap peristiwa baca saran tindak lanjutnya, periksa ke unit atau sumber asli, lalu catat hasil verifikasi dan keputusan.',
    'Bila perlu pemeriksaan lapangan, bentuk kasus dan terbitkan penugasan di Verifikasi Lapangan.',
    'Laporan Berkala: susun laporan harian atau mingguan; kirim lewat Distribusi Telegram setelah memeriksa pratinjaunya.',
    'Input Berita: masukkan isu viral yang belum tertangkap perayap.',
  ],
  evaluation_recommendation_analyst: [
    'Ruang Analis: lihat apa yang menuntut hari ini.',
    'Kasus Intelijen: baca kasus yang sedang berjalan.',
    'Verifikasi Lapangan: baca laporan lapangan yang baru masuk.',
    'Evaluasi dan Rekomendasi: sandingkan kata media dengan kata lapangan, lalu tulis rekomendasi.',
    'Berita Negatif: baca saran tindak lanjut dan catat keputusan atas peristiwa yang sudah diperiksa.',
    'Tindak Lanjut: nilai kemajuan butir pekerjaan yang sudah diputuskan.',
  ],
  news_data_operator: [
    'Dasbor Eksekutif: periksa bilah kesehatan data di puncak, apakah berita baru benar-benar masuk.',
    'Pusat Data Berita: cari duplikat dan periksa kelengkapan metadata.',
    'Input Berita: masukkan isu viral yang belum tertangkap perayap, mengikuti manual di bawah.',
    'Ruang Analis: lihat pekerjaan yang menunggu Anda.',
  ],
  field_verification_officer: [
    'Verifikasi Lapangan: terima penugasan, isi laporan, dan unggah bukti temuan.',
    'Tindak Lanjut: perbarui kemajuan butir yang menjadi tanggung jawab Anda.',
    'Analisis Pemberitaan, tab Pusat Komando: baca keadaan nasional sekilas.',
  ],
}

/* ----------------------------------------------------------------- manual */

/**
 * Manual mengirim berita, sebagai langkah berurutan.
 *
 * Ditulis satu kali untuk dua ruang. Borangnya memang satu dan sama — ruang
 * pusat menyebutnya "Input Berita", ruang wilayah menyebutnya "Kirim Berita" —
 * dan menulis dua manual untuk satu borang berarti salah satunya akan basi
 * tanpa ada yang tahu yang mana.
 */
export const MANUAL_KIRIM = [
  {
    judul: 'Buka menu Kirim Berita',
    isi: 'Di ruang wilayah namanya Kirim Berita; di ruang pusat namanya Input Berita. '
      + 'Borangnya sama persis, dan mesin yang menilainya juga sama.',
  },
  {
    judul: 'Periksa kop wilayah sebelum mengetik apa pun',
    isi: 'Di puncak borang tertulis wilayah mana yang akan tercatat pada kiriman ini. '
      + 'Bila yang tertulis justru "Wilayah pada akun Anda belum ditetapkan", berhenti di '
      + 'sini dan hubungi administrator: basis data akan menolak kiriman tanpa asal '
      + 'wilayah, dan penolakan itu baru muncul setelah seluruh borang terisi.',
  },
  {
    judul: 'Tempelkan tautan beritanya',
    isi: 'Kolom wajib. Tempelkan alamat lengkapnya; penanda iklan di ekor alamat dibuang '
      + 'otomatis sebelum disimpan. Di bawah kolom tertulis sumber yang berhasil dibaca '
      + 'dari alamat itu — periksa sekilas, sebab alamat yang terpotong saat disalin '
      + 'biasanya ketahuan di baris ini.',
  },
  {
    judul: 'Salin judul beritanya apa adanya',
    isi: 'Kolom wajib. Tulis judul sebagaimana tertulis di sumbernya, tanpa diringkas dan '
      + 'tanpa diperbaiki ejaannya. Judul adalah keterangan pertama yang dibaca mesin, dan '
      + 'judul yang sudah disunting menggeser penilaiannya.',
  },
  {
    judul: 'Isi media dan tanggal terbit',
    isi: 'Keduanya tidak wajib. Media yang dikosongkan diisi dari nama situsnya. Tanggal '
      + 'terbit yang dikosongkan membuat berita ini tercatat tanpa tanggal terbit — ia '
      + 'tetap masuk laporan, sebab yang menentukan hari laporan adalah waktu berita ini '
      + 'DITANGKAP, bukan tanggal terbitnya.',
  },
  {
    judul: 'Tentukan unitnya',
    isi: 'Ketik nama unit dan daftar unit akan membantu melengkapinya. Mesin pencocokan '
      + 'juga membaca judul serta ringkasan dan menawarkan saran beserta tingkat '
      + 'keyakinannya — tekan "Pakai saran ini" bila benar. Kosongkan bila unitnya memang '
      + 'belum jelas; jangan menebak. Berita tanpa unit bisa dipetakan kemudian, sedangkan '
      + 'berita yang salah unit akan terbaca sebagai persoalan unit yang tidak melakukan '
      + 'apa pun.',
  },
  {
    judul: 'Tulis ringkasan isinya',
    isi: 'Apa yang terjadi, di mana, dan siapa yang terlibat. Inilah kolom yang paling '
      + 'menentukan ketepatan mesin: makin lengkap ringkasannya, makin tepat kategori, '
      + 'sentimen, dan urgensi yang diusulkannya. Satu kalimat sudah cukup untuk disimpan, '
      + 'tetapi belum tentu cukup untuk dinilai dengan benar.',
  },
  {
    judul: 'Tambahkan catatan petugas bila perlu',
    isi: 'Konteks yang tidak ada di dalam beritanya sendiri — misalnya bahwa ini unggahan '
      + 'pertama yang memicu isu, atau bahwa akun penyebarnya bukan media. Catatan ini '
      + 'tidak dibaca mesin; ia dibaca penelaah.',
  },
  {
    judul: 'Baca panel penilaian mesin di sebelah kanan',
    isi: 'Panel ini muncul sendiri sekitar setengah detik setelah Anda berhenti mengetik. '
      + 'Isinya kategori, subkategori, sentimen, urgensi, persen keyakinan, kata kunci '
      + 'penentu, dan alasan ringkas. Keyakinan di bawah ambang ditandai dengan peringatan '
      + 'kuning — itu bukan larangan menyimpan, melainkan permintaan untuk memeriksa.',
  },
  {
    judul: 'Betulkan penilaian yang keliru, sekarang juga',
    isi: 'Subkategori, sentimen, dan urgensi di bawah panel masih bisa diubah. Membetulkan '
      + 'di sini jauh lebih murah daripada membiarkannya lalu memperbaikinya di antrean '
      + 'telaah. Bila mesin menilai berita ini "Di Luar Lingkup", ia tetap bisa disimpan — '
      + 'tetapi tidak akan ikut menjadi angka di dasbor mana pun.',
  },
  {
    judul: 'Tekan Simpan berita',
    isi: 'Sebelum menyimpan, sistem memeriksa apakah tautan itu sudah pernah masuk. Bila '
      + 'sudah, yang muncul adalah judul kiriman yang lebih dulu ada, dan tidak ada baris '
      + 'baru yang dibuat. Itu bukan kegagalan; itu berarti beritanya sudah tercatat.',
  },
  {
    judul: 'Ikuti kirimannya sampai ke antrean telaah',
    isi: 'Berita tersimpan dengan status Belum Ditelaah dan belum menjadi angka di laporan '
      + 'mana pun. Tombol "Buka antrean telaah" membawa Anda langsung ke barisnya. Ia ikut '
      + 'dihitung setelah penelaah menyetujui penilaiannya.',
  },
]

/* ------------------------------------------------------- jendela pelaporan */

/**
 * Aturan jendela pelaporan harian, ditulis sebagai data supaya halaman panduan
 * dan uji regresi membaca kalimat yang sama.
 */
export const JENDELA_LAPORAN = {
  mulai: '00.00 WIB',
  selesai: '23.59 WIB',
  kirim: '05.30 WIB',
  contoh: 'Seluruh berita yang ditangkap pada 11 September 2026 pukul 00.00 WIB sampai '
    + '23.59 WIB dilaporkan pada 12 September 2026 pukul 05.30 WIB.',
  butir: [
    {
      judul: 'Satu hari laporan adalah satu hari kalender Jakarta',
      isi: 'Batasnya pukul 00.00 sampai 23.59 WIB, bukan pukul 07.00 sampai 07.00 dan '
        + 'bukan hari menurut UTC. Aturan ini berlaku sama untuk laporan Telegram dan '
        + 'untuk ekspor mandiri lewat halaman Laporan Berkala serta Lembar Infografis.',
    },
    {
      judul: 'Yang menentukan hari adalah waktu TANGKAP, bukan tanggal terbit',
      isi: 'Sebuah berita yang terbit pekan lalu dan baru tertangkap tadi malam tetap '
        + 'kabar baru bagi yang membaca laporan pagi ini. Memotongnya menurut tanggal '
        + 'terbit membuatnya tidak pernah muncul di laporan mana pun. Tanggal terbitnya '
        + 'tidak hilang — ia tetap tercetak pada tiap baris laporan.',
    },
    {
      judul: 'Laporan harian terkirim pukul 05.30 WIB keesokan harinya',
      isi: 'Berkas PDF beserta pesan ringkasnya dikirim ke grup Telegram pimpinan. Yang '
        + 'dilaporkan adalah hari sebelumnya secara utuh, sehingga laporan yang terbit '
        + 'pagi ini tidak pernah memuat berita pagi ini.',
    },
    {
      judul: 'Laporan mingguan terkirim tiap Minggu pukul 05.30 WIB',
      isi: 'Bentuk berkasnya sama; yang berbeda hanya rentang dan penomorannya.',
    },
    {
      judul: 'Berita yang masuk setelah 23.59 WIB masuk laporan hari berikutnya',
      isi: 'Tidak ada berita yang hilang karenanya, dan tidak ada yang dihitung dua kali. '
        + 'Perayap dan penyalin sumber tetap berjalan sepanjang malam.',
    },
  ],
}

/** Ketiga ruang, dengan nama dan keterangannya. */
export const RUANG = {
  pusat: {
    label: 'Ruang Pusat',
    ket: 'Ditpamintel — seluruh peran internal, dari Operator Puldata sampai Pimpinan.',
    butir: PUSAT,
  },
  wilayah: {
    label: 'Ruang Kantor Wilayah',
    ket: 'Administrator Kantor Wilayah — seluruh unit yang dibawahi satu kantor wilayah.',
    butir: WILAYAH,
  },
  unit: {
    label: 'Ruang Unit',
    ket: 'Penelaah Berita UPT — satu unit pelaksana teknis, tanpa unit tetangga.',
    butir: UNIT,
  },
}

/** Nama ruang yang sedang ditempati sebuah peran. */
export function ruangPeran(unit, eksternal) {
  if (unit) return 'unit'
  return eksternal ? 'wilayah' : 'pusat'
}
