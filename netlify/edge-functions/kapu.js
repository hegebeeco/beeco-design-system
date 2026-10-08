/* ============================================================
   beeco BRAND BOOK – jelszókapu (Netlify Edge Function, Javaslat 22)
   MEGJEGYZÉS: önállóan már nem fut (a netlify.toml a brand/ mappát használja); a brand/kapu-brand.js és a tests/docs-check.js importálja.

   • A jelszó és a titok a Netlify környezeti változóiban él (Site configuration → Environment variables):
       BRANDBOOK_JELSZO  – a közös jelszó (ezt adod oda önkéntesnek, partnernek)
       BRANDBOOK_TITOK   – nem kötelező: hosszú, véletlen szöveg a süti aláírásához (nélküle a jelszóból és az oldal azonosítójából képződik)
     A repó nyilvános: jelszó, titok soha nem kerül ide.
   • Belépés: POST /belepes (jelszo, vissza) → helyes jelszóra 30 napos, HttpOnly süti.
     A süti értéke HMAC(titok, jelszó) – jelszócserekor minden régi belépés érvényét veszti.
   • Kilépés: /kilepes. Süti nélkül HTML-kérésre a /belepes.html jön, más kérésre 401.
   • Ha a jelszó nincs beállítva, a kapu zárva marad (503) – így nem lesz véletlenül nyilvános.
   ============================================================ */
const SUTI = 'bb_kapu';
const NAP30 = 60 * 60 * 24 * 30;
const enc = new TextEncoder();

function env(nev) {
  try { if (globalThis.Netlify && globalThis.Netlify.env) return globalThis.Netlify.env.get(nev); } catch (e) { /* helyi teszt */ }
  try { return globalThis.Deno ? globalThis.Deno.env.get(nev) : undefined; } catch (e) { return undefined; }
}
async function alair(titok, uzenet) {
  const kulcs = await crypto.subtle.importKey('raw', enc.encode(titok), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', kulcs, enc.encode(uzenet)));
  let s = ''; for (const b of sig) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function egyenlo(a, b) {   // időállandó összevetés
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function suti(req, nev) {
  const h = req.headers.get('cookie') || '';
  for (const p of h.split(/;\s*/)) { const i = p.indexOf('='); if (i > 0 && p.slice(0, i) === nev) return p.slice(i + 1); }
  return null;
}
function biztosVissza(v) { return typeof v === 'string' && /^\/(?!\/)[^\s\\]*$/.test(v) && !v.startsWith('/belepes') ? v : '/'; }
const atiranyit = (hova, extra = {}) => new Response(null, { status: 303, headers: { Location: hova, 'Cache-Control': 'no-store', ...extra } });

export default async function kapu(req, context) {
  const jelszo = env('BRANDBOOK_JELSZO');
  const titok = env('BRANDBOOK_TITOK') || (jelszo ? `bb-kapu:${env('SITE_ID') || ''}:${jelszo}` : '');
  if (!jelszo) {
    return new Response('A brand book jelszava még nincs beállítva (BRANDBOOK_JELSZO a Netlify környezeti változói között).',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  const url = new URL(req.url);
  const vart = await alair(titok, 'bb1:' + jelszo);

  if (url.pathname === '/belepes' && req.method === 'POST') {
    let adott = '', vissza = '/';
    try { const f = await req.formData(); adott = String(f.get('jelszo') || ''); vissza = biztosVissza(String(f.get('vissza') || '/')); } catch (e) { /* üres űrlap */ }
    const kapott = await alair(titok, 'bb1:' + adott);
    if (!egyenlo(kapott, vart)) return atiranyit('/belepes.html?hiba=1' + (vissza !== '/' ? '&vissza=' + encodeURIComponent(vissza) : ''));
    return atiranyit(vissza, { 'Set-Cookie': `${SUTI}=${vart}; Path=/; Max-Age=${NAP30}; HttpOnly; Secure; SameSite=Lax` });
  }
  if (url.pathname === '/kilepes') return atiranyit('/belepes.html', { 'Set-Cookie': `${SUTI}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });

  if (egyenlo(suti(req, SUTI) || '', vart)) return context.next();

  const html = (req.headers.get('accept') || '').includes('text/html') || url.pathname === '/' || url.pathname.endsWith('.html');
  if (html && req.method === 'GET') return atiranyit('/belepes.html' + (url.pathname !== '/' ? '?vissza=' + encodeURIComponent(url.pathname + url.search) : ''));
  return new Response('Belépés szükséges.', { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}

// A belépő oldal és a hozzá kellő stílus, betű, logó, ikon szabadon jön; minden más a kapun át.
export const config = {
  path: '/*',
  excludedPath: ['/belepes.html', '/bb/bb.css', '/bb/tema.js', '/bb/belepes.js', '/ds/termek/css/*', '/ds/dist/css/*', '/ds/web/assets/fonts/*',
    '/ds/web/assets/brand/logo.webp', '/ds/web/assets/brand/logo-sotet.webp', '/ds/web/assets/brand/ikon-32.png', '/favicon.ico'],
};
