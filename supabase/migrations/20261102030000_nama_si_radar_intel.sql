-- ============================================================================
-- SI-RADAR INTEL — nama sistem di dalam fungsi basis data
-- ============================================================================
--
-- Versi kedua dibangun dari skema produksi Trans-Siber PAS (pg_dump), bukan
-- dari migrasi di repo ini, sebab tabel intinya lebih tua daripada migrasi
-- pertama. Akibatnya fungsi yang menyusun teks untuk Telegram ikut terbawa
-- dengan kop "Laporan Harian Trans-Siber PAS".
--
-- Badan fungsinya SENGAJA tidak ditulis ulang di sini. Definisi terakhir di
-- repo ada di 20260907020000, tetapi produksi pernah diubah di luar migrasi;
-- menyalin badan dari repo bisa diam-diam mengembalikan fungsi ke versi yang
-- lebih tua. Yang diganti hanya tulisannya, pada definisi yang sedang berlaku.
--
-- Aman dijalankan dua kali: pada putaran kedua tidak ada lagi yang cocok.

do $ganti$
declare
  f     record;
  def   text;
  baru  text;
begin
  for f in
    select p.oid, p.oid::regprocedure as tanda
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.prokind = 'f'
       and p.prosrc like '%Trans-Siber%'
  loop
    def  := pg_get_functiondef(f.oid);
    baru := replace(def, 'Trans-Siber PAS', 'SI-RADAR INTEL');
    -- Sisa "Trans-Siber" dalam bentuk lain berarti ada tulisan yang belum
    -- dipetakan. Lebih baik berhenti di sini daripada menyisakan kop campuran
    -- yang baru ketahuan saat laporan pagi sampai ke pimpinan.
    if position('Trans-Siber' in baru) > 0 then
      raise exception 'Fungsi % masih memuat "Trans-Siber" dalam bentuk lain; petakan dulu.', f.tanda;
    end if;
    execute baru;
    raise notice 'Nama diganti di %', f.tanda;
  end loop;
end
$ganti$;
