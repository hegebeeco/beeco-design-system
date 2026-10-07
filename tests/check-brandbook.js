#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – önteszt (Javaslat 22)

   1. a build hibátlan (törött link, inline stílus/script, forrás nélküli javaslat, hiányzó profil → hiba)
   2. a jelszókapu: zárva beállítás nélkül, süti nélkül a belépőre visz, rossz jelszó → hiba, jó jelszó → süti,
      jelszócsere után a régi süti érvénytelen, a visszatérési cím csak saját oldal lehet
   3. böngészőben (Playwright + axe): mobil és széles nézet, világos és sötét mód – nincs konzolhiba, nincs vízszintes
      kilógás, nincs súlyos axe-lelet; a keresés talál; a menü mobilon nyílik és Esc-re zár
   node tests/check-brandbook.js          (--gyors: csak a fő oldalak)
   ============================================================ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const gyors = process.argv.includes('--gyors');
const hibak = [];
const ok = (felt, uzenet) => { if (!felt) hibak.push(uzenet); };

async function kapuTeszt() {
  const src = fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/kapu.js'), 'utf8');   // ES-modul (Deno); data-URL-ként töltjük, hogy a Node ne találgasson
  const { default: kapu } = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(src));
  const env = {};
  globalThis.Netlify = { env: { get: k => env[k] } };
  const ctx = { next: async () => new Response('TARTALOM', { status: 200 }) };
  const req = (u, o = {}) => new Request('https://bb.example' + u, o);
  const urlap = (jelszo, vissza = '/') => req('/belepes', { method: 'POST', body: new URLSearchParams({ jelszo, vissza }), headers: { 'content-type': 'application/x-www-form-urlencoded' } });

  let r = await kapu(req('/index.html', { headers: { accept: 'text/html' } }), ctx);
  ok(r.status === 503, `kapu: beállítás nélkül 503 kell (${r.status})`);
  env.BRANDBOOK_JELSZO = 'probajelszo-1';   // titok nélkül is működik (a jelszóból képződik)
  let rt = await kapu(urlap('probajelszo-1', '/'), ctx);
  ok(rt.status === 303 && /bb_kapu=/.test(rt.headers.get('set-cookie') || ''), 'kapu: titok nélkül is beenged a jó jelszó');
  env.BRANDBOOK_TITOK = 'teszt-titok-0123456789';

  r = await kapu(req('/marka.html', { headers: { accept: 'text/html' } }), ctx);
  ok(r.status === 303 && r.headers.get('location') === '/belepes.html?vissza=%2Fmarka.html', `kapu: süti nélkül a belépőre (${r.status} ${r.headers.get('location')})`);
  r = await kapu(req('/bb/kereses.json'), ctx);
  ok(r.status === 401, `kapu: süti nélkül adat → 401 (${r.status})`);
  r = await kapu(urlap('rossz'), ctx);
  ok(r.status === 303 && r.headers.get('location').startsWith('/belepes.html?hiba=1'), 'kapu: rossz jelszó → hibaüzenet');
  ok(!r.headers.get('set-cookie'), 'kapu: rossz jelszóra nincs süti');
  r = await kapu(urlap('probajelszo-1', '/hang.html'), ctx);
  const suti = (r.headers.get('set-cookie') || '').split(';')[0];
  ok(r.status === 303 && r.headers.get('location') === '/hang.html', 'kapu: jó jelszó → vissza az oldalra');
  ok(/HttpOnly/.test(r.headers.get('set-cookie') || '') && /Secure/.test(r.headers.get('set-cookie') || ''), 'kapu: a süti HttpOnly és Secure');
  r = await kapu(req('/hang.html', { headers: { cookie: suti, accept: 'text/html' } }), ctx);
  ok(r.status === 200 && (await r.text()) === 'TARTALOM', 'kapu: sütivel a tartalom jön');
  r = await kapu(urlap('probajelszo-1', '//gonosz.example/'), ctx);
  ok(r.headers.get('location') === '/', 'kapu: idegen visszatérési cím → kezdőlap');
  r = await kapu(req('/kilepes'), ctx);
  ok(/Max-Age=0/.test(r.headers.get('set-cookie') || ''), 'kapu: a kilépés törli a sütit');
  env.BRANDBOOK_JELSZO = 'uj-jelszo-2';
  r = await kapu(req('/hang.html', { headers: { cookie: suti, accept: 'text/html' } }), ctx);
  ok(r.status === 303, 'kapu: jelszócsere után a régi süti érvénytelen');
  delete globalThis.Netlify;
}

function serve(dir) {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
  return new Promise(res => {
    const s = http.createServer((q, w) => {
      let p = path.join(dir, decodeURIComponent(q.url.split('?')[0]));
      if (p.endsWith(path.sep)) p = path.join(p, 'index.html');
      if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { w.writeHead(404); w.end(); return; }
      w.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(w);
    }).listen(0, '127.0.0.1', () => res(s));
  });
}

async function bongeszo(dir) {
  const { chromium } = require('playwright');
  const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const srv = await serve(dir), base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch();
  const oldalak = gyors ? ['index.html', 'feluletek.html', 'belepes.html']
    : fs.readdirSync(dir).filter(f => f.endsWith('.html')).concat(fs.readdirSync(path.join(dir, 'kepernyok')).filter(f => f.endsWith('.html')).map(f => 'kepernyok/' + f))
    .concat(fs.existsSync(path.join(dir, 'sablonok')) ? fs.readdirSync(path.join(dir, 'sablonok')).filter(f => f.endsWith('.html')).map(f => 'sablonok/' + f) : []);   // bb-sablonok: a sablonok is (az ablakhoz illeszkednek, nem lóghatnak ki)
  const nezetek = [{ n: 'mobil', w: 360, h: 740 }, { n: 'széles', w: 1280, h: 800 }];
  try {
    for (const v of nezetek) for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: v.w, height: v.h }, colorScheme: scheme });
      await page.route(u => !u.href.startsWith(base), r => r.abort());   // az élő játék (külső oldal) nem része a tesztnek
      const konzol = []; page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) konzol.push(m.text()); }); page.on('pageerror', e => konzol.push(e.message));
      page.on('response', r => { if (r.status() >= 400) konzol.push(`${r.status()} ${r.url().replace(base, '')}`); });
      for (const o of oldalak) {
        konzol.length = 0;
        await page.goto(`${base}/${o}`, { waitUntil: 'load' });
        // a lusta minták (iframe) töltsenek be, mielőtt továbblépünk – különben a félbehagyott betöltés hamis 404-et ad
        await page.evaluate(() => document.querySelectorAll('iframe').forEach(f => { f.loading = 'eager'; }));
        await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});   // a blokkolt külső iframe miatt nem mindig csendesedik el
        const hol = `${o} (${v.n}, ${scheme === 'dark' ? 'sötét' : 'világos'})`;
        const sajat = konzol.filter(x => !/ERR_FAILED|net::/.test(x));
        ok(!sajat.length, `${hol}: konzolhiba: ${sajat.join(' | ')}`);
        konzol.length = 0;
        const kilog = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        // a 390 px-es telefon-képernyőknek a mobil nézetben természetes a 390 px szélesség – a keretük a felület-oldalon méretezi őket
        ok(kilog <= 1 || o.startsWith('kepernyok/'), `${hol}: vízszintesen kilóg (${kilog} px)`);   // a képernyők rögzített méretű keretben (390 / 1280 px) futnak
        await page.addScriptTag({ content: axeSrc });
        const ax = await page.evaluate(async () => (await window.axe.run(document, { preload: false, runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] })).violations
          .filter(x => x.impact === 'critical' || x.impact === 'serious').map(x => `${x.id} (${x.nodes.length}: ${x.nodes[0] && x.nodes[0].target.join(' ')})`));
        ok(!ax.length, `${hol}: axe: ${ax.join('; ')}`);
      }
      // működés: keresés és mobilmenü (egyszer nézetenként, világosban)
      if (scheme === 'light') {
        await page.goto(`${base}/index.html`);
        await page.fill('#bb-q', 'logó');
        await page.waitForSelector('#bb-talalat:not([hidden]) li a', { timeout: 3000 }).catch(() => {});
        ok(await page.locator('#bb-talalat li a').count() > 0, `keresés (${v.n}): a „logó” szóra nincs találat`);
        await page.fill('#bb-q', 'xyzqw');
        await page.waitForTimeout(100);
        ok(/Nincs találat/.test(await page.locator('#bb-talalat').innerText()), `keresés (${v.n}): nincs „Nincs találat” üzenet`);
        if (v.w < 900) {
          await page.click('[data-menu-nyit]');
          ok(await page.locator('#bb-menu.is-open').count() === 1, 'mobilmenü: nem nyílik');
          await page.keyboard.press('Escape');
          ok(await page.locator('#bb-menu.is-open').count() === 0, 'mobilmenü: Esc-re nem zár');
        }
      }
      await page.close();
    }
  } finally { await browser.close(); srv.close(); }
}

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bb-teszt-'));
  try {
    try { execFileSync('node', [path.join(ROOT, 'tools/brandbook-build.js'), '--ki', dir], { stdio: 'pipe' }); }
    catch (e) { hibak.push('build: ' + String(e.stderr || e.message).trim()); }
    await kapuTeszt();
    if (!hibak.length) await bongeszo(dir);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  if (hibak.length) { console.error(`Brand book – ${hibak.length} hiba:\n  ` + hibak.join('\n  ')); process.exit(1); }
  console.log('Brand book: build, jelszókapu és böngészős ellenőrzés rendben.');
})().catch(e => { console.error(e); process.exit(1); });
