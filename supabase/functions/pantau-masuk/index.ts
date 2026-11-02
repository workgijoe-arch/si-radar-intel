/**
 * Edge Function: pantau-masuk
 *
 * Mata Pemilik Sistem atas SI-RADAR INTEL: siapa yang login, dari mana, dan
 * siapa yang hak aksesnya berubah. Semua kabar dikirim ke Telegram pribadi
 * pemilik dan tercatat di tabel `log_masuk` untuk halaman Pantauan Login.
 *
 * Dua jalan masuk:
 *
 *   x-sync-token  dipanggil basis data sendiri (trigger dan pg_cron lewat
 *                 pg_net). Ini jalan utama: trigger pada auth.sessions
 *                 memanggil `catat_sesi` setiap kali GoTrue menerbitkan sesi
 *                 baru.
 *       catat_sesi / kabar_akun / ringkasan / diagnosa / pemilik_*
 *
 *   Authorization  petugas yang sedang membuka aplikasi.
 *       catat / telegram_*
 *
 * Lokasi diperkirakan dari alamat jaringan (IP), setingkat kota. Yang menambah
 * nilai pengawasan adalah penanda VPN/hosting, jaringan/kota baru, perpindahan
 * mustahil, dan jam janggal — bukan nama kotanya.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const KEPALA = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sync-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const TELEGRAM = 'https://api.telegram.org'
const NAMA_SISTEM = 'SI-RADAR INTEL'

const LABEL_PERAN: Record<string, string> = {
  super_admin: 'Administrator Sistem Intelijen',
  media_intelligence_analyst: 'Analis Intelijen Media',
  news_data_operator: 'Operator Pengumpulan Data',
  field_verification_officer: 'Petugas Verifikasi Lapangan',
  evaluation_recommendation_analyst: 'Analis Evaluasi dan Mitigasi Risiko',
  executive_decision_maker: 'Pimpinan Pengambil Keputusan',
  kanwil_admin: 'Administrator Kantor Wilayah',
  upt_penelaah: 'Penelaah Berita UPT',
}

function env(nama: string): string {
  return Deno.env.get(nama)?.trim() || ''
}

function jawab(isi: unknown, status = 200): Response {
  return new Response(JSON.stringify(isi), { status, headers: KEPALA })
}

function isiToken(token: string): Record<string, unknown> {
  try {
    const bagian = token.split('.')[1] || ''
    const b64 = bagian.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4)))
  } catch {
    return {}
  }
}

function ipDariTajuk(req: Request): string {
  const calon = [
    req.headers.get('cf-connecting-ip'),
    req.headers.get('x-real-ip'),
    (req.headers.get('x-forwarded-for') || '').split(',')[0],
  ]
  for (const c of calon) {
    const t = String(c || '').trim()
    if (t) return t
  }
  return ''
}

function ipPribadi(ip: string): boolean {
  return !ip
    || /^(10\.|127\.|192\.168\.|169\.254\.|0\.)/.test(ip)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
    || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)
    || /^(::1|fc|fd|fe80)/i.test(ip)
}

type Lokasi = {
  kota: string | null
  wilayah: string | null
  negara: string | null
  kode_negara: string | null
  lintang: number | null
  bujur: number | null
  jaringan: string | null
  asn: string | null
  proxy: boolean
  hosting: boolean
  mobile: boolean
}

const LOKASI_KOSONG: Lokasi = {
  kota: null, wilayah: null, negara: null, kode_negara: null,
  lintang: null, bujur: null, jaringan: null,
  asn: null, proxy: false, hosting: false, mobile: false,
}

async function ambilJson(url: string, ms = 4500): Promise<any> {
  const henti = new AbortController()
  const pewaktu = setTimeout(() => henti.abort(), ms)
  try {
    const r = await fetch(url, { signal: henti.signal, headers: { Accept: 'application/json' } })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  } finally {
    clearTimeout(pewaktu)
  }
}

async function cariLokasi(ip: string): Promise<Lokasi> {
  if (ipPribadi(ip)) return LOKASI_KOSONG

  const a = await ambilJson(
    `http://ip-api.com/json/${encodeURIComponent(ip)}`
    + `?fields=status,country,countryCode,regionName,city,lat,lon,isp,org,as,mobile,proxy,hosting`,
  )
  if (a?.status === 'success') {
    return {
      kota: a.city || null,
      wilayah: a.regionName || null,
      negara: a.country || null,
      kode_negara: a.countryCode || null,
      lintang: typeof a.lat === 'number' ? a.lat : null,
      bujur: typeof a.lon === 'number' ? a.lon : null,
      jaringan: a.isp || a.org || null,
      asn: typeof a.as === 'string' ? (a.as.match(/^AS\d+/i)?.[0] || a.as) : null,
      proxy: a.proxy === true,
      hosting: a.hosting === true,
      mobile: a.mobile === true,
    }
  }

  const b = await ambilJson(`https://ipwho.is/${encodeURIComponent(ip)}?lang=en`)
  if (b?.success) {
    return {
      kota: b.city || null,
      wilayah: b.region || null,
      negara: b.country || null,
      kode_negara: b.country_code || null,
      lintang: typeof b.latitude === 'number' ? b.latitude : null,
      bujur: typeof b.longitude === 'number' ? b.longitude : null,
      jaringan: b.connection?.isp || b.connection?.org || null,
      asn: b.connection?.asn ? `AS${b.connection.asn}` : null,
      proxy: false, hosting: false, mobile: false,
    }
  }

  return LOKASI_KOSONG
}

function jarakKm(la1: number, lo1: number, la2: number, lo2: number): number {
  const r = 6371
  const d = (x: number) => (x * Math.PI) / 180
  const a = Math.sin(d(la2 - la1) / 2) ** 2
    + Math.cos(d(la1)) * Math.cos(d(la2)) * Math.sin(d(lo2 - lo1) / 2) ** 2
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(a)))
}

function waktuJakarta(iso: string): { jam: number; menit: number; hari: string } {
  const bagian = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta', hour12: false,
    weekday: 'short', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(iso))
  const ambil = (t: string) => bagian.find((p) => p.type === t)?.value || ''
  return { jam: Number(ambil('hour')) % 24, menit: Number(ambil('minute')), hari: ambil('weekday') }
}

function nilaiLogin(o: {
  kodeNegara: string | null
  proxy: boolean
  hosting: boolean
  ipBaru: boolean
  jaringanBaru: boolean
  kotaBaru: boolean
  sesiLain: boolean
  pindahMustahil: boolean
  akunJanggal: boolean
  waktu: string
}): { luarJam: boolean; diniHari: boolean; tingkat: string; tanda: string[] } {
  const { jam, menit, hari } = waktuJakarta(o.waktu)
  const hariKerja = ['Mon', 'Tue', 'Wed', 'Thu'].includes(hari)
  const menitHari = jam * 60 + menit
  const dalamJam = menitHari >= 7 * 60 + 30 && menitHari < 16 * 60
  const luarJam = !(hariKerja && dalamJam)
  const diniHari = jam >= 22 || jam < 5
  const luarNegeri = !!o.kodeNegara && o.kodeNegara !== 'ID'

  const tanda: string[] = []
  if (o.proxy) tanda.push('VPN / proxy / anonim')
  if (o.hosting) tanda.push('IP milik server hosting, bukan ISP rumahan')
  if (luarNegeri) tanda.push('Login dari luar Indonesia')
  if (o.pindahMustahil) tanda.push('Perpindahan lokasi mustahil (sandi dipakai di dua tempat jauh)')
  if (diniHari) tanda.push('Login dini hari (22.00–05.00 WIB)')
  if (o.akunJanggal) tanda.push('Akun nonaktif / terhapus tetapi berhasil login')
  if (o.sesiLain) tanda.push('Akun ini juga sedang aktif dari alamat lain')
  if (o.ipBaru) tanda.push('IP belum pernah dipakai akun ini')
  if (o.jaringanBaru) tanda.push('Jaringan / operator baru untuk akun ini')
  if (o.kotaBaru) tanda.push('Kota belum pernah tercatat untuk akun ini')
  if (luarJam && !diniHari) tanda.push('Di luar jam kerja (Sen–Kam 07.30–16.00 WIB)')

  const bahaya = o.proxy || o.hosting || luarNegeri || o.pindahMustahil || diniHari || o.akunJanggal
  const perhatian = o.ipBaru || o.jaringanBaru || o.kotaBaru || o.sesiLain || luarJam
  const tingkat = bahaya ? 'bahaya' : perhatian ? 'perhatian' : 'normal'
  return { luarJam, diniHari, tingkat, tanda }
}

function bacaPerangkat(ua: string) {
  const u = ua || ''
  const peramban =
    /SamsungBrowser/i.test(u) ? 'Samsung Internet'
    : /Edg\//i.test(u) ? 'Microsoft Edge'
    : /OPR\/|Opera/i.test(u) ? 'Opera'
    : /Firefox|FxiOS/i.test(u) ? 'Firefox'
    : /CriOS|Chrome\//i.test(u) ? 'Chrome'
    : /Safari\//i.test(u) ? 'Safari'
    : u ? 'Peramban lain' : null

  const sistem =
    /Windows NT/i.test(u) ? 'Windows'
    : /Android/i.test(u) ? 'Android'
    : /iPhone|iPad|iPod/i.test(u) ? 'iOS'
    : /Mac OS X|Macintosh/i.test(u) ? 'macOS'
    : /CrOS/i.test(u) ? 'ChromeOS'
    : /Linux/i.test(u) ? 'Linux'
    : u ? 'Lainnya' : null

  const jenis =
    /iPad|Tablet/i.test(u) || (/Android/i.test(u) && !/Mobile/i.test(u)) ? 'Tablet'
    : /Mobi|iPhone|Android/i.test(u) ? 'Ponsel'
    : u ? 'Komputer' : null

  return { peramban, sistem, jenis }
}

async function telegram(kunci: string, metode: string, muatan?: unknown) {
  const r = await fetch(`${TELEGRAM}/bot${kunci}/${metode}`, muatan
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(muatan) }
    : { method: 'GET' })
  const isi = await r.json().catch(() => ({}))
  if (!r.ok || !isi?.ok) throw new Error(isi?.description || `Telegram menolak (${r.status}).`)
  return isi.result
}

function html(t: unknown): string {
  return String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function waktuWib(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso)) + ' WIB'
}

function susunPesan(c: Record<string, any>): string {
  const tempat = [...new Set([c.kota, c.wilayah, c.negara].filter(Boolean))].join(', ') || 'tidak dapat diperkirakan'
  const satuan = [c.kanwil, c.upt].filter(Boolean).join(' · ')
  const tanda: string[] = Array.isArray(c.tanda) ? c.tanda : []
  const kepala = c.tingkat === 'bahaya' ? '🚨 <b>LOGIN PERLU DICERMATI</b>'
    : c.tingkat === 'perhatian' ? '⚠️ <b>Login — ada catatan</b>'
    : `🔐 <b>Login ${NAMA_SISTEM}</b>`

  const baris: (string | null)[] = [
    kepala,
    tanda.length ? '' : null,
    ...tanda.map((t) => `${c.tingkat === 'bahaya' ? '🔴' : '🟡'} ${html(t)}`),
    c.pemilik ? 'ℹ️ Ini akun Anda sendiri' : null,
    '',
    `<b>${html(c.nama || c.username)}</b> (${html(c.username)})`,
    html(LABEL_PERAN[c.peran] || c.peran || '—'),
    satuan ? html(satuan) : null,
    '',
    `📍 ${html(tempat)}`,
    c.jaringan ? `🌐 ${html(c.jaringan)}${c.mobile ? ' (seluler)' : ''}${c.asn ? ` · ${html(c.asn)}` : ''}` : null,
    c.ip ? `IP ${html(c.ip)}` : null,
    `💻 ${html([c.peramban, c.sistem_operasi].filter(Boolean).join(' di ') || '—')}${c.jenis_perangkat ? ` (${html(c.jenis_perangkat)})` : ''}`,
    `🕒 ${html(waktuWib(c.waktu))}`,
    c.lintang != null && c.bujur != null
      ? `🗺 <a href="https://maps.google.com/?q=${c.lintang},${c.bujur}">Lihat perkiraan di peta</a>`
      : null,
    '',
    '<i>Lokasi diperkirakan dari alamat jaringan, setingkat kota — bukan titik pasti.</i>',
  ]
  return baris.filter((b) => b !== null).join('\n')
}

async function hash(teks: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(teks))
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function samaAman(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false
  let beda = 0
  for (let i = 0; i < a.length; i++) beda |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return beda === 0
}

// deno-lint-ignore no-explicit-any
type Admin = any

const KOLOM_PROFIL = 'id,username,full_name,role,assigned_kanwil,assigned_upt,aktif,deleted_at,pemilik_sistem,'
  + 'telegram_chat_pribadi,telegram_kode_tautan,telegram_kode_kedaluwarsa'

async function profilDari(admin: Admin, kolom: string, nilai: string): Promise<Record<string, any> | null> {
  const { data } = await admin.from('app_users').select(KOLOM_PROFIL).eq(kolom, nilai).maybeSingle()
  return (data as Record<string, any> | null) ?? null
}

async function profilPemilik(admin: Admin): Promise<Record<string, any> | null> {
  const { data } = await admin.from('app_users').select(KOLOM_PROFIL)
    .eq('pemilik_sistem', true).is('deleted_at', null).maybeSingle()
  return (data as Record<string, any> | null) ?? null
}

async function kirimKePemilik(admin: Admin, kunciBot: string, teks: string): Promise<boolean> {
  if (!kunciBot) return false
  const { data } = await admin.from('app_users').select('telegram_chat_pribadi')
    .eq('pemilik_sistem', true).eq('aktif', true).not('telegram_chat_pribadi', 'is', null)
  let terkirim = false
  for (const o of (data || []) as { telegram_chat_pribadi: string }[]) {
    try {
      await telegram(kunciBot, 'sendMessage', {
        chat_id: o.telegram_chat_pribadi, text: teks, parse_mode: 'HTML', disable_web_page_preview: true,
      })
      terkirim = true
    } catch (e) {
      console.warn('Pesan ke pemilik gagal:', (e as Error).message)
    }
  }
  return terkirim
}

async function catatMasuk(admin: Admin, kunciBot: string, o: {
  uid: string
  sesiId: string | null
  waktu?: string
  ipCadangan?: string
  agenCadangan?: string
  emailCadangan?: string | null
}) {
  const sekarang = o.waktu || new Date().toISOString()

  if (o.sesiId) {
    const { data: ada } = await admin.from('log_masuk').select('id').eq('sesi_id', o.sesiId).maybeSingle()
    if (ada) return { ok: true, ulang: true }
  } else {
    const { data: baru } = await admin.from('log_masuk').select('id')
      .eq('auth_user_id', o.uid).gte('waktu', new Date(Date.now() - 60_000).toISOString()).limit(1)
    if (baru?.length) return { ok: true, ulang: true }
  }

  const profil = await profilDari(admin, 'auth_user_id', o.uid)
  let email = o.emailCadangan || null
  if (!profil && !email) {
    const { data } = await admin.auth.admin.getUserById(o.uid)
    email = data?.user?.email || null
  }

  let ip = ''
  let sumberIp = 'tajuk'
  let agen = o.agenCadangan || ''
  if (o.sesiId) {
    const { data: info } = await admin.rpc('info_sesi_auth', { p_sesi: o.sesiId })
    const baris = Array.isArray(info) ? info[0] : info
    if (baris?.ip) { ip = String(baris.ip); sumberIp = 'sesi' }
    if (baris?.agen) agen = String(baris.agen)
  }
  if (!ip && o.ipCadangan) ip = o.ipCadangan

  let lokasi: Lokasi = LOKASI_KOSONG
  if (ip) {
    const { data: lama } = await admin.from('log_masuk')
      .select('kota,wilayah,negara,kode_negara,lintang,bujur,jaringan,asn,proxy,hosting,mobile')
      .eq('ip', ip).not('negara', 'is', null)
      .gte('waktu', new Date(Date.now() - 30 * 86_400_000).toISOString())
      .order('waktu', { ascending: false }).limit(1)
    lokasi = lama?.[0] ? { ...LOKASI_KOSONG, ...(lama[0] as Partial<Lokasi>) } : await cariLokasi(ip)
  }

  let kotaBaru = false
  let ipBaru = false
  let jaringanBaru = false
  let pindahMustahil = false
  const { count: jumlahDulu } = await admin.from('log_masuk')
    .select('id', { count: 'exact', head: true }).eq('auth_user_id', o.uid)
  const sudahPunyaRiwayat = (jumlahDulu ?? 0) > 0

  if (sudahPunyaRiwayat) {
    if (ip) {
      const { count } = await admin.from('log_masuk')
        .select('id', { count: 'exact', head: true }).eq('auth_user_id', o.uid).eq('ip', ip)
      ipBaru = (count ?? 0) === 0
    }
    if (lokasi.asn) {
      const { count } = await admin.from('log_masuk')
        .select('id', { count: 'exact', head: true }).eq('auth_user_id', o.uid).eq('asn', lokasi.asn)
      jaringanBaru = (count ?? 0) === 0
    }
    if (lokasi.kota) {
      const { count } = await admin.from('log_masuk')
        .select('id', { count: 'exact', head: true }).eq('auth_user_id', o.uid).eq('kota', lokasi.kota)
      kotaBaru = (count ?? 0) === 0
    }
    if (lokasi.lintang != null && lokasi.bujur != null) {
      const { data: sebelum } = await admin.from('log_masuk')
        .select('waktu,lintang,bujur').eq('auth_user_id', o.uid)
        .not('lintang', 'is', null).lt('waktu', sekarang)
        .order('waktu', { ascending: false }).limit(1)
      const s = sebelum?.[0] as { waktu: string; lintang: number; bujur: number } | undefined
      if (s) {
        const km = jarakKm(s.lintang, s.bujur, lokasi.lintang, lokasi.bujur)
        const jamSelang = (new Date(sekarang).getTime() - new Date(s.waktu).getTime()) / 3_600_000
        if (km > 200 && jamSelang >= 0 && km / Math.max(jamSelang, 0.05) > 900) pindahMustahil = true
      }
    }
  }

  let sesiLain = false
  if (ip && o.sesiId) {
    const { data: lain } = await admin.rpc('sesi_lain_aktif', { p_user: o.uid, p_ip: ip })
    sesiLain = Number(Array.isArray(lain) ? lain[0] : lain) > 0
  }

  const akunJanggal = !!(profil && (profil.aktif === false || profil.deleted_at))
  const keterangan: string[] = []
  if (!profil) keterangan.push('Sesi sah tanpa profil aplikasi')
  else if (profil.aktif === false) keterangan.push('Akun berstatus NONAKTIF tetapi berhasil login')
  else if (profil.deleted_at) keterangan.push('Akun sudah DIHAPUS tetapi berhasil login')

  const nilai = nilaiLogin({
    kodeNegara: lokasi.kode_negara, proxy: lokasi.proxy, hosting: lokasi.hosting,
    ipBaru, jaringanBaru, kotaBaru, sesiLain, pindahMustahil, akunJanggal, waktu: sekarang,
  })

  const p = bacaPerangkat(agen)
  const catatan = {
    waktu: sekarang,
    auth_user_id: o.uid,
    sesi_id: o.sesiId,
    app_user_id: profil?.id != null ? String(profil.id) : null,
    username: profil?.username || email,
    nama: profil?.full_name || null,
    peran: profil?.role || null,
    kanwil: profil?.assigned_kanwil || null,
    upt: profil?.assigned_upt || null,
    pemilik: !!profil?.pemilik_sistem,
    ip: ip || null,
    sumber_ip: ip ? sumberIp : null,
    ...lokasi,
    peramban: p.peramban,
    sistem_operasi: p.sistem,
    jenis_perangkat: p.jenis,
    agen_pengguna: agen ? agen.slice(0, 400) : null,
    kota_baru: kotaBaru,
    ip_baru: ipBaru,
    jaringan_baru: jaringanBaru,
    luar_jam: nilai.luarJam,
    perpindahan_mustahil: pindahMustahil,
    sesi_lain: sesiLain,
    tingkat: nilai.tingkat,
    tanda: nilai.tanda,
    catatan: keterangan.join('; ') || null,
  }

  const { data: tersimpan, error: galatSimpan } = await admin
    .from('log_masuk').insert(catatan).select('id').single()
  if (galatSimpan) {
    if (String(galatSimpan.code) === '23505') return { ok: true, ulang: true }
    throw galatSimpan
  }

  if (profil) await admin.from('app_users').update({ last_login: sekarang }).eq('auth_user_id', o.uid)

  const terkirim = await kirimKePemilik(admin, kunciBot, susunPesan(catatan))
  if (terkirim) await admin.from('log_masuk').update({ telegram_terkirim: true }).eq('id', (tersimpan as any).id)
  return { ok: true, telegram: terkirim, tingkat: nilai.tingkat }
}

function susunKabarAkun(k: Record<string, any>): string {
  const nama = html(k.nama || k.username || 'tanpa nama')
  const peran = (r: unknown) => html(LABEL_PERAN[String(r)] || r || '—')
  const pelaku = k.pelaku ? html(k.pelaku) : 'layanan sistem'
  const baris: string[] = []

  if (k.jenis === 'baru') {
    baris.push(`🆕 <b>Akun baru diterbitkan</b>`, '', `<b>${nama}</b> (${html(k.username)})`, peran(k.peran_baru))
  } else if (k.jenis === 'hapus') {
    baris.push(`🗑 <b>Akun dihapus</b>`, '', `<b>${nama}</b> (${html(k.username)})`, peran(k.peran_lama))
  } else {
    baris.push(`🛡 <b>Hak akses berubah</b>`, '', `<b>${nama}</b> (${html(k.username)})`)
    if (k.peran_lama !== k.peran_baru) baris.push(`Peran: ${peran(k.peran_lama)} → <b>${peran(k.peran_baru)}</b>`)
    if (k.aktif_lama !== k.aktif_baru) baris.push(k.aktif_baru ? 'Status: <b>diaktifkan kembali</b>' : 'Status: <b>dinonaktifkan</b>')
    if (k.kanwil_lama !== k.kanwil_baru) baris.push(`Wilayah: ${html(k.kanwil_lama || 'Nasional')} → <b>${html(k.kanwil_baru || 'Nasional')}</b>`)
  }
  if (k.peran_baru === 'super_admin' && k.peran_lama !== 'super_admin') {
    baris.splice(1, 0, '⚠️ <b>Ada superadmin baru</b>')
  }
  const satuan = [k.kanwil_baru, k.upt_baru].filter(Boolean).join(' · ')
  if (k.jenis === 'baru' && satuan) baris.push(html(satuan))
  baris.push('', `Oleh: ${pelaku}`, `🕒 ${html(waktuWib(k.waktu || new Date().toISOString()))}`)
  return baris.join('\n')
}

async function susunRingkasan(admin: Admin): Promise<string> {
  const sejak = new Date(Date.now() - 86_400_000).toISOString()
  const { data } = await admin.from('log_masuk')
    .select('username,nama,peran,kota,kode_negara,kota_baru,pemilik,catatan,tingkat')
    .gte('waktu', sejak).order('waktu', { ascending: false }).limit(2000)
  const baris = (data || []) as Record<string, any>[]

  const perOrang = new Map<string, { nama: string; peran: string; n: number; kota: Set<string> }>()
  for (const b of baris) {
    const k = b.username || '—'
    if (!perOrang.has(k)) perOrang.set(k, { nama: b.nama || k, peran: b.peran, n: 0, kota: new Set() })
    const o = perOrang.get(k)!
    o.n++
    if (b.kota) o.kota.add(b.kota)
  }

  const waspada = baris.filter((b) => b.tingkat === 'bahaya' || b.tingkat === 'perhatian'
    || (b.kode_negara && b.kode_negara !== 'ID') || b.kota_baru || b.catatan)
  const { data: admins } = await admin.from('app_users').select('username')
    .eq('role', 'super_admin').eq('aktif', true).is('deleted_at', null)

  const hasil = [
    `📋 <b>Ringkasan login ${NAMA_SISTEM}</b>`,
    `24 jam terakhir, s.d. ${html(waktuWib(new Date().toISOString()))}`,
    '',
    `Total login: <b>${baris.length}</b> dari <b>${perOrang.size}</b> akun`,
    `Perlu dicermati: <b>${waspada.length}</b>`,
    `Superadmin aktif saat ini: <b>${(admins || []).length}</b>`,
  ]
  if (perOrang.size) {
    hasil.push('')
    for (const o of [...perOrang.values()].sort((a, b) => b.n - a.n).slice(0, 25)) {
      hasil.push(`• ${html(o.nama)} — ${o.n}× — ${html([...o.kota].join(', ') || 'lokasi tak terbaca')}`)
    }
  } else {
    hasil.push('', 'Tidak ada yang login dalam 24 jam terakhir.')
  }
  return hasil.join('\n')
}

async function buatTautan(admin: Admin, kunciBot: string, profil: Record<string, any>) {
  const kode = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => (b % 36).toString(36)).join('').toUpperCase()
  await admin.from('app_users').update({
    telegram_kode_tautan: await hash(kode),
    telegram_kode_kedaluwarsa: new Date(Date.now() + 30 * 60_000).toISOString(),
  }).eq('id', profil.id)
  const bot = await telegram(kunciBot, 'getMe')
  return { ok: true, tautan: `https://t.me/${bot.username}?start=${kode}`, bot: bot.username }
}

async function hubungkan(admin: Admin, kunciBot: string, profil: Record<string, any>) {
  if (!profil.telegram_kode_tautan || !profil.telegram_kode_kedaluwarsa
      || new Date(profil.telegram_kode_kedaluwarsa).getTime() < Date.now()) {
    return { ok: false, status: 410, pesan: 'Tautannya sudah kedaluwarsa. Buat tautan baru.' }
  }
  const kabar = await telegram(kunciBot, 'getUpdates?limit=100&allowed_updates=%5B%22message%22%5D')
  let chat: any = null
  for (const k of [...(kabar || [])].reverse()) {
    const m = k?.message
    const cocok = String(m?.text || '').match(/^\/start\s+([A-Z0-9]{6})\s*$/i)
    if (m?.chat?.type === 'private' && cocok && await hash(cocok[1].toUpperCase()) === profil.telegram_kode_tautan) {
      chat = m.chat
      break
    }
  }
  if (!chat) {
    return { ok: false, belum: true, pesan: 'Belum terlihat. Pastikan tombol MULAI/START di Telegram sudah ditekan, lalu coba lagi.' }
  }
  await admin.from('app_users').update({
    telegram_chat_pribadi: String(chat.id), telegram_kode_tautan: null, telegram_kode_kedaluwarsa: null,
  }).eq('id', profil.id)
  await telegram(kunciBot, 'sendMessage', {
    chat_id: chat.id,
    text: `✅ Telegram ini tersambung sebagai penerima pemberitahuan login dan perubahan hak akses ${NAMA_SISTEM}.`,
  })
  const namaTg = [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username
  await admin.from('audit_log').insert({
    actor_username: profil.username, actor_role: profil.role,
    action: 'pemilik_sambung_telegram', entity: 'app_users', entity_id: String(profil.id),
    metadata: { nama_telegram: namaTg },
  })
  return { ok: true, nama: namaTg }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: KEPALA })
  if (req.method !== 'POST') return jawab({ ok: false, pesan: 'Hanya menerima POST.' }, 405)

  try {
    const url = env('SUPABASE_URL')
    const kunciLayanan = env('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !kunciLayanan) return jawab({ ok: false, pesan: 'Fungsi belum dikonfigurasi di peladen.' }, 500)

    const admin = createClient(url, kunciLayanan, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const kunciBot = env('TELEGRAM_BOT_TOKEN')
    const badan = await req.json().catch(() => ({}))
    const aksi = String(badan?.aksi || 'catat')

    const tokenSinkron = req.headers.get('x-sync-token') || ''
    if (tokenSinkron) {
      if (!samaAman(tokenSinkron, env('SHEET_SYNC_TOKEN'))) {
        return jawab({ ok: false, pesan: 'Token sinkron ditolak.' }, 401)
      }

      if (aksi === 'catat_sesi') {
        const uid = String(badan.user_id || '')
        if (!uid) return jawab({ ok: false, pesan: 'user_id kosong.' }, 400)
        return jawab(await catatMasuk(admin, kunciBot, {
          uid, sesiId: badan.sesi_id ? String(badan.sesi_id) : null, waktu: badan.waktu,
        }))
      }

      if (aksi === 'kabar_akun') {
        const terkirim = await kirimKePemilik(admin, kunciBot, susunKabarAkun(badan))
        return jawab({ ok: true, telegram: terkirim })
      }

      if (aksi === 'ringkasan') {
        const terkirim = await kirimKePemilik(admin, kunciBot, await susunRingkasan(admin))
        return jawab({ ok: true, telegram: terkirim })
      }

      const pemilik = await profilPemilik(admin)

      if (aksi === 'diagnosa') {
        let bot: string | null = null
        let galatBot: string | null = null
        if (kunciBot) {
          try { bot = (await telegram(kunciBot, 'getMe')).username } catch (e) { galatBot = (e as Error).message }
        }
        return jawab({
          ok: true, kunci_bot: !!kunciBot, bot, galat_bot: galatBot,
          pemilik: pemilik?.username || null, telegram_pemilik: !!pemilik?.telegram_chat_pribadi,
        })
      }

      if (aksi === 'uji_bahaya') {
        const contoh = {
          waktu: new Date().toISOString(),
          nama: 'UJI COBA', username: 'contoh.penyusup', peran: 'super_admin',
          kota: 'Amsterdam', wilayah: 'North Holland', negara: 'Netherlands', kode_negara: 'NL',
          jaringan: 'DigitalOcean LLC', asn: 'AS14061', ip: '203.0.113.9',
          peramban: 'Chrome', sistem_operasi: 'Linux', jenis_perangkat: 'Komputer',
          tingkat: 'bahaya',
          tanda: ['VPN / proxy / anonim', 'IP milik server hosting, bukan ISP rumahan', 'Login dari luar Indonesia'],
        }
        const ok = await kirimKePemilik(admin, kunciBot, '🧪 <i>Pesan latihan — bukan login sungguhan.</i>\n\n' + susunPesan(contoh))
        return jawab({ ok })
      }

      if (!pemilik) return jawab({ ok: false, pesan: 'Pemilik Sistem belum ditetapkan.' }, 409)
      if (!kunciBot) return jawab({ ok: false, pesan: 'TELEGRAM_BOT_TOKEN belum terpasang.' }, 409)
      if (aksi === 'pemilik_tautan') return jawab(await buatTautan(admin, kunciBot, pemilik))
      if (aksi === 'pemilik_hubungkan') return jawab(await hubungkan(admin, kunciBot, pemilik))
      if (aksi === 'pemilik_uji') {
        const ok = await kirimKePemilik(admin, kunciBot,
          `🔔 Pesan uji dari ${NAMA_SISTEM}. Pemberitahuan login akan masuk ke sini.`)
        return jawab({ ok })
      }
      return jawab({ ok: false, pesan: `Aksi "${aksi}" tidak dikenali.` }, 400)
    }

    const tajuk = req.headers.get('Authorization') || ''
    const token = tajuk.startsWith('Bearer ') ? tajuk.slice(7) : ''
    if (!token) return jawab({ ok: false, pesan: 'Sesi tidak terbaca.' }, 401)

    const { data: sesi, error: galatSesi } = await admin.auth.getUser(token)
    if (galatSesi || !sesi?.user) return jawab({ ok: false, pesan: 'Sesi sudah berakhir.' }, 401)
    const uid = sesi.user.id

    if (aksi === 'catat') {
      const klaim = isiToken(token)
      return jawab(await catatMasuk(admin, kunciBot, {
        uid,
        sesiId: typeof klaim.session_id === 'string' ? klaim.session_id : null,
        ipCadangan: ipDariTajuk(req),
        agenCadangan: req.headers.get('user-agent') || '',
        emailCadangan: sesi.user.email || null,
      }))
    }

    const profil = await profilDari(admin, 'auth_user_id', uid)
    if (!profil?.pemilik_sistem || profil.aktif !== true || profil.deleted_at) {
      return jawab({ ok: false, pesan: 'Hanya Pemilik Sistem yang dapat melakukan ini.' }, 403)
    }
    if (!kunciBot) {
      return jawab({
        ok: false,
        pesan: 'Kunci bot Telegram belum terpasang di peladen, jadi pemberitahuan Telegram belum bisa disambungkan. '
          + 'Pemberitahuan di dalam aplikasi tetap berjalan.',
      }, 409)
    }

    if (aksi === 'telegram_tautan') return jawab(await buatTautan(admin, kunciBot, profil))

    if (aksi === 'telegram_hubungkan') {
      const h = await hubungkan(admin, kunciBot, profil)
      return jawab(h, (h as any).status || 200)
    }

    if (aksi === 'telegram_uji') {
      if (!profil.telegram_chat_pribadi) return jawab({ ok: false, pesan: 'Telegram belum tersambung.' }, 409)
      await telegram(kunciBot, 'sendMessage', {
        chat_id: profil.telegram_chat_pribadi,
        text: `🔔 Pesan uji dari ${NAMA_SISTEM}. Pemberitahuan login akan masuk ke sini.`,
      })
      return jawab({ ok: true })
    }

    if (aksi === 'telegram_putus') {
      await admin.from('app_users').update({ telegram_chat_pribadi: null }).eq('id', profil.id)
      await admin.from('audit_log').insert({
        actor_username: profil.username, actor_role: profil.role,
        action: 'pemilik_putus_telegram', entity: 'app_users', entity_id: String(profil.id), metadata: {},
      })
      return jawab({ ok: true })
    }

    return jawab({ ok: false, pesan: `Aksi "${aksi}" tidak dikenali.` }, 400)
  } catch (e) {
    console.error(e)
    return jawab({ ok: false, pesan: (e as Error)?.message || 'Terjadi kesalahan pada peladen.' }, 500)
  }
})
