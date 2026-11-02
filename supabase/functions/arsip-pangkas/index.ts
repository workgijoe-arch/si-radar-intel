/**
 * Edge Function: arsip-pangkas
 *
 * Menjaga agar ruang basis data tidak pernah habis, dengan memindahkan berita
 * paling lama ke luar Supabase lalu menghapusnya dari sini.
 *
 * Urutannya tetap dan tidak boleh dibalik:
 *
 *   1. periksa seberapa penuh basis data;
 *   2. kalau belum melewati ambang, berhenti — tidak ada yang disentuh;
 *   3. siapkan satu kumpulan berita tertua (hanya ditandai, belum dihapus);
 *   4. kirim isinya ke penampung di luar;
 *   5. hanya kalau penampung menjawab berhasil DAN jumlah barisnya cocok,
 *      barulah berita itu dihapus dari basis data.
 *
 * Kalau langkah 4 gagal karena apa pun — jaringan putus, penampung penuh,
 * jawabannya aneh — langkah 5 tidak dijalankan. Ruang tidak jadi bertambah,
 * tetapi tidak ada satu pun berita yang hilang. Itu pertukaran yang benar:
 * kehabisan ruang masih bisa ditangani besok, berita yang terhapus tanpa
 * salinan tidak bisa ditangani kapan pun.
 *
 * Secret yang dibutuhkan:
 *   SHEET_SYNC_TOKEN     token pemanggil, sama dengan fungsi lain
 *   ARSIP_WEBHOOK_URL    alamat Web App Google Apps Script penampung arsip
 *   ARSIP_WEBHOOK_TOKEN  (opsional) kata sandi yang diperiksa Apps Script
 *
 * Cara memanggil:
 *   POST /functions/v1/arsip-pangkas
 *   header: x-sync-token: <SHEET_SYNC_TOKEN>
 *   body  : { "ambang_persen": 70, "umur_hari": 120, "batas": 500,
 *             "putaran_maks": 4, "paksa": false, "kering": false }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const KEPALA = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sync-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function env(nama: string): string {
  return Deno.env.get(nama)?.trim() || ''
}

function jawab(isi: unknown, status = 200): Response {
  return new Response(JSON.stringify(isi, null, 2), { status, headers: KEPALA })
}

Deno.serve(async (permintaan: Request) => {
  if (permintaan.method === 'OPTIONS') return new Response('ok', { headers: KEPALA })
  if (permintaan.method !== 'POST') return jawab({ ok: false, pesan: 'Hanya menerima POST.' }, 405)

  const mulai = Date.now()

  try {
    const tokenDiharapkan = env('SHEET_SYNC_TOKEN')
    if (!tokenDiharapkan) {
      return jawab({ ok: false, pesan: 'Secret SHEET_SYNC_TOKEN belum dipasang pada Edge Function.' }, 500)
    }
    const tokenDikirim = permintaan.headers.get('x-sync-token')
      || new URL(permintaan.url).searchParams.get('token') || ''
    if (tokenDikirim !== tokenDiharapkan) {
      return jawab({ ok: false, pesan: 'Token tidak valid.' }, 401)
    }

    let opsi: Record<string, unknown> = {}
    try { opsi = await permintaan.json() } catch { /* badan kosong diperbolehkan */ }

    const ambang = Number(opsi.ambang_persen ?? 70)
    const umurHari = Math.max(30, Number(opsi.umur_hari ?? 120))
    const batas = Math.min(Number(opsi.batas ?? 500), 2000)
    const putaranMaks = Math.min(Number(opsi.putaran_maks ?? 4), 20)
    const paksa = opsi.paksa === true
    const kering = opsi.kering === true

    const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const bacaTekanan = async () => {
      const { data, error } = await db.rpc('arsip_tekanan')
      if (error) throw new Error(`Gagal membaca tekanan ruang: ${error.message}`)
      return data as Record<string, unknown>
    }

    const awal = await bacaTekanan()
    const persenAwal = Number(awal.persen)

    if (!paksa && persenAwal < ambang) {
      return jawab({
        ok: true, dijalankan: false,
        pesan: `Ruang terpakai ${persenAwal}%, masih di bawah ambang ${ambang}%.`,
        tekanan: awal, durasi_ms: Date.now() - mulai,
      })
    }

    const alamat = env('ARSIP_WEBHOOK_URL')
    if (!alamat && !kering) {
      return jawab({
        ok: false,
        pesan: 'Secret ARSIP_WEBHOOK_URL belum dipasang, sehingga tidak ada tempat menaruh arsip. '
          + 'Tidak ada berita yang dihapus.',
        tekanan: awal,
      }, 500)
    }

    const putaran: unknown[] = []

    for (let i = 0; i < putaranMaks; i += 1) {
      const { data: siap, error: galatSiap } = await db.rpc('arsip_siapkan', {
        p_umur_hari: umurHari, p_batas: batas,
      })
      if (galatSiap) throw new Error(`Gagal menyiapkan kumpulan: ${galatSiap.message}`)

      const kumpulan = siap as { batch: string; jumlah: number; baris: unknown[] }
      if (!kumpulan.jumlah) {
        putaran.push({ putaran: i + 1, jumlah: 0, pesan: 'Tidak ada berita yang cukup tua.' })
        break
      }

      if (kering) {
        await db.rpc('arsip_selesaikan', {
          p_batch: kumpulan.batch, p_berhasil: false, p_pesan: 'Uji coba kering, tidak dikirim.',
        })
        putaran.push({ putaran: i + 1, jumlah: kumpulan.jumlah, kering: true, dihapus: 0 })
        break
      }

      let berhasil = false
      let diterima: number | null = null
      let berkas: string | null = null
      let pesan = ''

      try {
        const kirim = await fetch(alamat, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: env('ARSIP_WEBHOOK_TOKEN') || undefined,
            batch: kumpulan.batch,
            jumlah: kumpulan.jumlah,
            tabel: 'berita',
            baris: kumpulan.baris,
          }),
        })
        const teks = await kirim.text()
        let hasil: Record<string, unknown> = {}
        try { hasil = JSON.parse(teks) } catch { /* jawaban bukan JSON */ }

        berhasil = kirim.ok && hasil.ok === true
        diterima = Number(hasil.diterima ?? hasil.rows ?? NaN)
        if (!Number.isFinite(diterima)) diterima = null
        berkas = typeof hasil.berkas === 'string' ? hasil.berkas : null
        pesan = berhasil ? String(hasil.pesan ?? 'Terkirim.') : `HTTP ${kirim.status}: ${teks.slice(0, 300)}`
      } catch (galatKirim) {
        berhasil = false
        pesan = `Gagal menghubungi penampung: ${String(galatKirim)}`
      }

      const { data: tutup, error: galatTutup } = await db.rpc('arsip_selesaikan', {
        p_batch: kumpulan.batch,
        p_berhasil: berhasil,
        p_jumlah_diterima: diterima,
        p_tujuan: alamat.replace(/\?.*$/, ''),
        p_berkas: berkas,
        p_pesan: pesan.slice(0, 500),
      })
      if (galatTutup) throw new Error(`Gagal menutup kumpulan: ${galatTutup.message}`)

      putaran.push({ putaran: i + 1, jumlah: kumpulan.jumlah, hasil: tutup, pesan })

      // Pengiriman gagal berarti penampung sedang bermasalah. Mengulang hanya
      // memperbesar kemungkinan salah, jadi berhenti dan laporkan apa adanya.
      if (!berhasil) break

      const sekarang = await bacaTekanan()
      if (Number(sekarang.persen) < ambang) break
    }

    const akhir = await bacaTekanan()

    return jawab({
      ok: true,
      dijalankan: true,
      ambang_persen: ambang,
      umur_hari: umurHari,
      kering,
      sebelum: awal,
      sesudah: akhir,
      putaran,
      durasi_ms: Date.now() - mulai,
    })
  } catch (galat) {
    const pesan = galat instanceof Error ? (galat.stack || galat.message) : String(galat)
    console.error(pesan)
    return jawab({ ok: false, pesan, durasi_ms: Date.now() - mulai }, 500)
  }
})
