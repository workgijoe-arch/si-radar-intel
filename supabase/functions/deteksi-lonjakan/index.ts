/**
 * Edge Function: deteksi-lonjakan
 *
 * Peringatan dini pemberitaan. Dipanggil pg_cron tiap jam lewat
 * panggil_deteksi_lonjakan(). Menjalankan dua deteksi lalu mengirim hasil yang
 * belum terkirim ke Telegram pemilik:
 *   - catat_lonjakan_baru()  : lonjakan volume negatif per UPT
 *   - catat_isu_eskalasi()   : satu isu yang menyebar di banyak media
 * Masuk hanya lewat x-sync-token.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const KEPALA = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-sync-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const TELEGRAM = 'https://api.telegram.org'

function env(n: string): string { return Deno.env.get(n)?.trim() || '' }
function jawab(isi: unknown, status = 200): Response {
  return new Response(JSON.stringify(isi), { status, headers: KEPALA })
}
function html(t: unknown): string {
  return String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function waktuWib(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso)) + ' WIB'
}
function samaAman(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false
  let beda = 0
  for (let i = 0; i < a.length; i++) beda |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return beda === 0
}

async function telegram(kunci: string, metode: string, muatan: unknown) {
  const r = await fetch(`${TELEGRAM}/bot${kunci}/${metode}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(muatan),
  })
  const isi = await r.json().catch(() => ({}))
  if (!r.ok || !isi?.ok) throw new Error(isi?.description || `Telegram menolak (${r.status}).`)
  return isi.result
}

// deno-lint-ignore no-explicit-any
async function kePemilik(admin: any, kunci: string, teks: string): Promise<boolean> {
  const { data } = await admin.from('app_users').select('telegram_chat_pribadi')
    .eq('pemilik_sistem', true).eq('aktif', true).not('telegram_chat_pribadi', 'is', null)
  let ok = false
  for (const o of (data || []) as { telegram_chat_pribadi: string }[]) {
    try {
      await telegram(kunci, 'sendMessage', {
        chat_id: o.telegram_chat_pribadi, text: teks, parse_mode: 'HTML', disable_web_page_preview: true,
      })
      ok = true
    } catch (e) { console.warn('kirim gagal:', (e as Error).message) }
  }
  return ok
}

function daftarContoh(contoh: any[]): string[] {
  return (Array.isArray(contoh) ? contoh : []).map((c) => c.link
    ? `• <a href="${html(c.link)}">${html(c.judul || 'berita')}</a>${c.media ? ` — ${html(c.media)}` : ''}`
    : `• ${html(c.judul || 'berita')}${c.media ? ` — ${html(c.media)}` : ''}`)
}

function susun(r: Record<string, any>): string {
  const biasa = r.rata_harian != null
    ? `biasanya ~${r.rata_harian}/hari${r.lipat ? ` (${r.lipat}× lipat)` : ''}`
    : 'di atas kebiasaannya'
  const baris = [
    '🚨 <b>Lonjakan pemberitaan negatif</b>',
    '',
    `<b>${html(r.subjek)}</b>`,
    `${r.jumlah_24j} berita negatif dalam 24 jam — ${html(biasa)}`,
    '',
    ...daftarContoh(r.contoh),
    '',
    `🕒 ${html(waktuWib(r.terdeteksi))}`,
    '<i>Peringatan dini otomatis — perlu ditelaah analis.</i>',
  ]
  return baris.join('\n')
}

function susunIsu(r: Record<string, any>): string {
  const rentang = r.mulai ? `sejak ${html(waktuWib(r.mulai))}` : ''
  const baris = [
    '📢 <b>Isu menyebar lintas media</b>',
    '',
    `<b>${html(r.judul || r.kunci)}</b>`,
    `${r.artikel} berita di ${r.media} media — ${r.negatif} negatif${rentang ? `, ${rentang}` : ''}`,
    '',
    ...daftarContoh(r.contoh),
    '',
    `🕒 ${html(waktuWib(r.terdeteksi))}`,
    '<i>Satu isu yang diangkat banyak outlet — pertimbangkan klarifikasi.</i>',
  ]
  return baris.join('\n')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: KEPALA })
  if (req.method !== 'POST') return jawab({ ok: false, pesan: 'Hanya POST.' }, 405)

  if (!samaAman(req.headers.get('x-sync-token') || '', env('SHEET_SYNC_TOKEN'))) {
    return jawab({ ok: false, pesan: 'Token sinkron ditolak.' }, 401)
  }

  try {
    const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const kunci = env('TELEGRAM_BOT_TOKEN')
    const badan = await req.json().catch(() => ({}))
    const aksi = String(badan?.aksi || 'lonjakan')

    if (aksi === 'uji') {
      const contoh = {
        subjek: 'Lapas Kelas IIB Tabanan', jumlah_24j: 16, rata_harian: 1.6, lipat: 10,
        terdeteksi: new Date().toISOString(),
        contoh: [{ judul: 'Contoh judul pemberitaan (latihan)', link: 'https://example.id', media: 'MediaX' }],
      }
      const ok = await kePemilik(admin, kunci, '🧪 <i>Latihan — bukan lonjakan sungguhan.</i>\n\n' + susun(contoh))
      return jawab({ ok })
    }

    if (aksi === 'uji_isu') {
      const contoh = {
        judul: 'Pungli di lapas terungkap, Ombudsman soroti bayaran (latihan)',
        kunci: 'contoh', artikel: 5, media: 5, negatif: 5,
        mulai: new Date(Date.now() - 86_400_000).toISOString(), terdeteksi: new Date().toISOString(),
        contoh: [{ judul: 'Contoh judul isu (latihan)', link: 'https://example.id', media: 'MediaX' }],
      }
      const ok = await kePemilik(admin, kunci, '🧪 <i>Latihan — bukan isu sungguhan.</i>\n\n' + susunIsu(contoh))
      return jawab({ ok })
    }

    const { data: baru } = await admin.rpc('catat_lonjakan_baru')
    const { data: baruIsu } = await admin.rpc('catat_isu_eskalasi')

    let terkirim = 0
    const { data: belum } = await admin.from('peringatan_lonjakan')
      .select('id,subjek,jumlah_24j,rata_harian,lipat,contoh,terdeteksi')
      .eq('dikirim', false).order('terdeteksi', { ascending: true }).limit(20)
    for (const r of (belum || []) as Record<string, any>[]) {
      const ok = kunci ? await kePemilik(admin, kunci, susun(r)) : false
      if (ok) { await admin.from('peringatan_lonjakan').update({ dikirim: true }).eq('id', r.id); terkirim++ }
    }

    let terkirimIsu = 0
    const { data: belumIsu } = await admin.from('isu_terpantau')
      .select('id,kunci,judul,artikel,media,negatif,mulai,contoh,terdeteksi')
      .eq('dikirim', false).order('terdeteksi', { ascending: true }).limit(20)
    for (const r of (belumIsu || []) as Record<string, any>[]) {
      const ok = kunci ? await kePemilik(admin, kunci, susunIsu(r)) : false
      if (ok) { await admin.from('isu_terpantau').update({ dikirim: true }).eq('id', r.id); terkirimIsu++ }
    }

    return jawab({
      ok: true,
      lonjakan: { baru: Number(baru ?? 0), terkirim },
      isu: { baru: Number(baruIsu ?? 0), terkirim: terkirimIsu },
    })
  } catch (e) {
    console.error(e)
    return jawab({ ok: false, pesan: (e as Error)?.message || 'Galat peladen.' }, 500)
  }
})
