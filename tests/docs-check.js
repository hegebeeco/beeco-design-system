#!/usr/bin/env node
/* ============================================================
   docs-check – a két dokumentációs oldal (Brand Book: _site/brand, Design System: _site/ds) őre.
   Futtatás: npm run docs:check (előbb mindkettőt megépíti). Az `npm test` LAZA módban futtatja (npm run docs:test):
   ott csak az üres oldal, a törött link / horgony és a nem létező átirányítási cél buktat; a többi figyelmeztetés.
   --szigoru: a „Hiányzik” jelvények is buktatnak (kiadás előtt). DOCS_SITE=<mappa>: más kimenet ellenőrzése.

   Ellenőrzi: belső linkek és horgonyok (a brand:/ds: feloldás után; a minta- és képernyő-oldalakon is) · egy h1 ·
   nincs kihagyott címsorszint · nincs inline stílus, inline script, on…= · nincs üres oldal · nincs mérges méhecske ·
   belső szöveg nincs a publikus oldalon (Kristóf, skill, beeco-arculat, beeco-ds, javaslatlap, Claude – a jelvények és a
   forrásmezők kivételével; a Brand Bookban a „bőr” sem) · a „tervezett” oldalak nincsenek a kimenetben, a keresőben,
   a láncban · a _redirects céljai léteznek · a számok adatból jönnek (kézzel írt „54 komponens” helyett {{szam:…}}) ·
   a docs-CSS a check-tokens szabályai szerint tiszta · a --bc-line-soft nem UI-határoló/fókusz · kontraszt (mindkét
   oldal, mindkét mód) · a Brand Book jelszókapuja (netlify/edge-functions/brand/kapu-brand.js) és szabad útvonalai.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = process.env.DOCS_SITE ? path.resolve(process.env.DOCS_SITE) : path.join(ROOT, '_site');
const LAZA = process.argv.includes('--laza') || process.env.DOCS_LAZA === '1';
const SZIGORU = process.argv.includes('--szigoru');
const ONKENTES_UT = ['marka-pozicio', 'marka-hang', 'logo', 'szin', 'tipografia', 'meh-illusztracio', 'letoltesek'];
const hibak = [], figy = [];
// laza módban csak ezek buktatnak (a feladat szerint: üres oldal, törött link; + az átirányítás célja)
const SULYOS = /üres vagy majdnem üres|törött link|nem létező horgony|átirányítás célja nem létezik|nincs megépítve/;
const hiba = m => (LAZA && !SULYOS.test(m) ? figy : hibak).push(m);
const OLDALAK = [['brand', 'docs-site/brand'], ['ds', 'docs-site/ds']];
const json = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const bejar = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? bejar(path.join(d, e.name)) : [path.join(d, e.name)]);

const idk = new Map();
const idkOf = f => { if (!idk.has(f)) idk.set(f, new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))); return idk.get(f); };
const strip = h => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
/** A publikus törzsszöveg: a cikk, jelvények, forrásmezők, kód és a GitHub-hivatkozások nélkül. */
const torzsSzoveg = h => strip(((h.match(/<article[\s\S]*?<\/article>/) || [''])[0])
  .replace(/<details class="bb-forras">[\s\S]*?<\/details>/g, ' ')
  .replace(/<span class="bc-badge[^"]*">[^<]*<\/span>/g, ' ')
  .replace(/<p class="bb-kicsi bb-adatforras">[\s\S]*?<\/p>/g, ' ')
  .replace(/<code[^>]*>[\s\S]*?<\/code>/g, ' '));
const TILTOTT = [/Kristóf/i, /\bskill/i, /beeco-arculat/i, /beeco-ds\b/i, /javaslatlap/i, /\bClaude\b/];

let db = 0, linkDb = 0, hianyDb = { brand: 0, ds: 0 };
const kesz = {};
for (const [nev, forras] of OLDALAK) {
  const dir = path.join(SITE, nev);
  if (!fs.existsSync(dir)) { hiba(`${nev}: nincs megépítve (${path.relative(ROOT, dir)}) – futtasd: npm run docs:build`); continue; }
  const navF = path.join(dir, 'assets', 'nav.json');   // a motor kiírja a kész menüt (a generált komponensoldalakkal)
  const nav = JSON.parse(fs.readFileSync(fs.existsSync(navF) ? navF : path.join(ROOT, forras, 'nav.json'), 'utf8'));
  const tervezett = [];
  const bej = o => { if (o.tervezett) tervezett.push(`${o.slug}.html`); (o.gyerekek || []).forEach(bej); };
  nav.csoportok.forEach(c => c.oldalak.forEach(bej));
  const htmlek = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  kesz[nev] = new Set(htmlek);
  for (const t of tervezett) if (htmlek.includes(t)) hiba(`${nev}: a tervezett oldal (${t}) mégis kikerült`);

  for (const f of htmlek) {
    db++;
    const p = path.join(dir, f), h = fs.readFileSync(p, 'utf8'), hol = `${nev}/${f}`;
    if (!/^<!doctype html>/i.test(h)) hiba(`${hol}: nincs <!doctype html>`);
    if (!/<html lang="hu"/.test(h)) hiba(`${hol}: nincs lang="hu"`);
    if (/\sstyle="/.test(h)) hiba(`${hol}: inline stílus`);
    if (/<style[\s>]/.test(h)) hiba(`${hol}: <style> elem`);
    if (/<script(?![^>]*\ssrc=)[^>]*>/.test(h)) hiba(`${hol}: inline script`);
    if (/\son[a-z]+="/i.test(h)) hiba(`${hol}: on…= eseménykezelő`);
    if (/bee-angry/.test(h)) hiba(`${hol}: a mérges méhecske tilos`);
    const cimek = [...h.matchAll(/<h([1-6])[\s>]/g)].map(m => +m[1]);
    const h1 = cimek.filter(x => x === 1).length;
    if (h1 !== 1) hiba(`${hol}: ${h1} db h1 (pontosan egy kell)`);
    for (let i = 1; i < cimek.length; i++) if (cimek[i] > cimek[i - 1] + 1) hiba(`${hol}: kihagyott címsorszint: h${cimek[i - 1]} → h${cimek[i]}`);
    const fo = (h.match(/<main[\s\S]*?<\/main>/) || [''])[0];
    if (strip(fo).length < 80) hiba(`${hol}: üres vagy majdnem üres oldal`);
    // belső szöveg a publikus oldalon
    const sz = torzsSzoveg(h);
    for (const re of TILTOTT) { if (nev === 'ds' && re.source === 'javaslatlap') continue; const m = sz.match(re); if (m) hiba(`${hol}: belső szöveg a publikus oldalon: „${m[0]}” („…${sz.slice(Math.max(0, m.index - 40), m.index + 40)}…”)`); }
    if (nev === 'brand') { const m = sz.match(/bőr/i); if (m) hiba(`${hol}: a Brand Bookban „termék-stílus” / „játék-stílus” a szó, nem „bőr” („…${sz.slice(Math.max(0, m.index - 40), m.index + 40)}…”)`); }
    // az önkéntes fejlesztő hétoldalas útja: mindegyik oldal tetején legyen „Röviden” (docs-site/brand/index.json: hetoldalas-ut)
    if (nev === 'brand' && ONKENTES_UT.includes(path.basename(p, '.html')) && !/class="bb-roviden"/.test(h)) hiba(`${hol}: az önkéntes úton lévő oldalról hiányzik a „Röviden” doboz`);
    hianyDb[nev] += (h.match(/<span class="bc-badge is-muted">Hiányzik|\sdata-mezo="/g) || []).length;
    for (const m of h.matchAll(/<img\b[^>]*>/g)) {
      if (!/\salt="/.test(m[0])) hiba(`${hol}: kép alt nélkül: ${m[0].slice(0, 80)}`);
      if (!/\sloading="lazy"/.test(m[0]) && !/bb-hero-kep/.test(m[0])) hiba(`${hol}: kép loading="lazy" nélkül: ${m[0].slice(0, 80)}`);
    }
    for (const m of h.matchAll(/rel="(?:prev|next)"/g)) { /* a lánc linkje a href-ellenőrzésen megy át */ }
    for (const m of h.matchAll(/href="([^"]+)" rel="(?:prev|next)"/g)) if (tervezett.includes(m[1])) hiba(`${hol}: a láncban tervezett oldal: ${m[1]}`);
    for (const m of h.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)) for (const id of m[1].split(/\s+/)) if (!idkOf(p).has(id)) hiba(`${hol}: ARIA-hivatkozás nem létező id-re: ${id}`);
    if (/href="(?:brand|ds):/.test(h)) hiba(`${hol}: feloldatlan brand:/ds: link`);
  }
  // linkek és horgonyok: a fő oldalakon és a minta-, képernyő-, sablon-oldalakon is (a kimenetben a repo/ tükör kivételével)
  for (const p of bejar(dir).filter(f => f.endsWith('.html') && !f.includes(`${path.sep}repo${path.sep}`))) {
    const h = fs.readFileSync(p, 'utf8'), hol = path.relative(SITE, p);
    for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(https?:|mailto:|data:)/.test(u)) continue;
      if (u.startsWith('/')) { if (path.basename(p) === 'belepes.html' && !fs.existsSync(path.join(dir, u.split(/[?#]/)[0]))) hiba(`${hol}: törött link: ${u}`); continue; }
      linkDb++;
      const [fajl, horgony] = u.split('#');
      const cel = fajl ? path.resolve(path.dirname(p), fajl.split('?')[0]) : p;
      if (!fs.existsSync(cel)) { hiba(`${hol}: törött link: ${u}`); continue; }
      if (horgony && cel.endsWith('.html') && !idkOf(cel).has(horgony)) hiba(`${hol}: nem létező horgony: ${u}`);
      if (tervezett.includes(path.basename(fajl)) && path.dirname(cel) === dir) hiba(`${hol}: link tervezett oldalra: ${u}`);
    }
    if (/\sstyle="/.test(h) && !/[\\/](kepernyok|sablonok)[\\/]/.test(p)) hiba(`${hol}: inline stílus`);
    if (/<script(?![^>]*\ssrc=)[^>]*>/.test(h)) hiba(`${hol}: inline script`);
  }
  // keresőindex
  const ix = path.join(dir, 'assets', 'kereses.json');
  if (!fs.existsSync(ix)) hiba(`${nev}: hiányzik az assets/kereses.json`);
  else for (const t of JSON.parse(fs.readFileSync(ix, 'utf8'))) {
    const [fajl, horgony] = t.u.split('#');
    if (tervezett.includes(fajl)) hiba(`${nev}: tervezett oldal a keresőben: ${t.u}`);
    const cel = path.join(dir, fajl);
    if (!fs.existsSync(cel)) hiba(`${nev}: a keresőindex nem létező oldalra mutat (törött link): ${t.u}`);
    else if (horgony && !idkOf(cel).has(horgony)) hiba(`${nev}: a keresőindex nem létező horgonyra mutat: ${t.u}`);
    for (const k of ['c', 'g']) if (!t[k]) hiba(`${nev}: keresőtétel „${k}” nélkül: ${t.u}`);
  }
  for (const f of bejar(dir)) if (/bee-angry/.test(path.basename(f))) hiba(`${nev}: tiltott fájl a kimenetben: ${path.relative(SITE, f)}`);
}

// ---------- átirányítások: minden cél létezik ----------
let redirDb = 0;
const dsKulso = /^https?:\/\//.test(process.env.DOCS_DS_URL || '') ? process.env.DOCS_DS_URL.replace(/[^/]*\.html$/, '').replace(/\/?$/, '/') : null;
for (const [nev] of OLDALAK) {
  const f = path.join(SITE, nev, '_redirects');
  if (!fs.existsSync(f)) { if (fs.existsSync(path.join(SITE, nev))) hiba(`${nev}: nincs _redirects (a régi Brand Book címei)`); continue; }
  for (const sor of fs.readFileSync(f, 'utf8').split('\n').filter(s => s.trim() && !s.startsWith('#'))) {
    const [honnan, hova, kod] = sor.trim().split(/\s+/);
    redirDb++;
    if (!/^30[12]$/.test(kod || '')) hiba(`${nev}/_redirects: ismeretlen kód: ${sor}`);
    if (hova.includes(':splat')) continue;
    let celDir = path.join(SITE, nev), rel = hova;
    if (/^https?:/.test(hova)) { if (dsKulso && hova.startsWith(dsKulso)) { celDir = path.join(SITE, 'ds'); rel = '/' + hova.slice(dsKulso.length); } else { hiba(`${nev}/_redirects: ismeretlen külső cél: ${hova}`); continue; } }
    const [fajl, horgony] = rel.split('#');
    const cel = path.join(celDir, fajl);
    if (!fs.existsSync(cel)) hiba(`${nev}/_redirects: az átirányítás célja nem létezik: ${honnan} → ${hova}`);
    else if (horgony && !idkOf(cel).has(horgony)) hiba(`${nev}/_redirects: az átirányítás célja nem létezik (horgony): ${honnan} → ${hova}`);
    if (fs.existsSync(path.join(SITE, nev, honnan)) && !/^https?:/.test(hova)) figy.push(`${nev}/_redirects: ${honnan} létező oldal – a Netlify kényszerítés (!) nélkül nem irányít át`);
  }
}

// ---------- számok adatból: kézzel írt darabszám a tartalomban ----------
const SZAMSZO = /\b(\d{1,4})\s+(dokumentált elem|React-komponens|komponens(?:oldal)?|tesztlap|sablon|madárrajz|mozgásminta|kategória|letölthető fájl)/gi;
function bejarJson(v, hol, gen) {
  if (typeof v === 'string') { if (!gen) for (const m of v.matchAll(SZAMSZO)) hiba(`${hol}: kézzel írt szám: „${m[0]}” – használd a {{szam:…}} jelölőt vagy a gen-blokkot (az adat változik, a szöveg nem)`); return; }
  if (Array.isArray(v)) return v.forEach((x, i) => bejarJson(x, hol, gen));
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'forras' && !k.startsWith('_')) bejarJson(x, hol, gen || v.t === 'gen');
}
for (const [, forras] of OLDALAK) for (const f of fs.readdirSync(path.join(ROOT, forras)).filter(f => f.endsWith('.json') && f !== 'nav.json')) {
  try { bejarJson(json(`${forras}/${f}`), `${forras}/${f}`, false); } catch (e) { hiba(`${forras}/${f}: olvashatatlan JSON (${e.message}) – üres vagy majdnem üres oldal lesz belőle`); }
}

// ---------- a docs-CSS és a generált skin: a check-tokens termékbőr-szabályai ----------
const tokCss = fs.readFileSync(path.join(ROOT, 'dist/css/beeco-tokens.css'), 'utf8');
const letezo = new Set([...tokCss.matchAll(/(--bc-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const cssek = ['docs.css', 'tartalom.css'].map(f => [`tools/docs/kliens/${f}`, fs.readFileSync(path.join(ROOT, 'tools/docs/kliens', f), 'utf8')]);
for (const nev of ['brand', 'ds']) { const g = path.join(SITE, nev, 'assets/gen.css'); if (fs.existsSync(g)) cssek.push([`_site/${nev}/assets/gen.css`, fs.readFileSync(g, 'utf8')]); }
const skinF = path.join(SITE, 'brand/assets/skin-jatek.css');
if (fs.existsSync(skinF)) cssek.push(['_site/brand/assets/skin-jatek.css', fs.readFileSync(skinF, 'utf8')]); else hiba('a játékbőr-skin (skin-jatek.css) nincs megépítve');
for (const [f, nyers] of cssek) {
  const src = nyers.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const hol = i => `${f}:${src.slice(0, i).split('\n').length}`;
  for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) hiba(`${hol(m.index)}: nyers szín ${m[0]}`);
  for (const m of src.matchAll(/\b(rgba?|hsla?)\(\s*\d/g)) hiba(`${hol(m.index)}: nyers ${m[1]}()`);
  for (const m of src.matchAll(/var\((--bc-[a-z0-9-]+)/g)) if (!letezo.has(m[1])) hiba(`${hol(m.index)}: nem létező token ${m[1]}`);
  for (const m of src.matchAll(/z-index\s*:\s*-?\d+/g)) hiba(`${hol(m.index)}: nyers z-index`);
  for (const m of src.matchAll(/\bease-in\b(?!-out)/g)) hiba(`${hol(m.index)}: ease-in tilos`);
  for (const m of src.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) hiba(`${hol(m.index)}: nyers betűméret ${m[1]}px`);
  for (const m of src.matchAll(/\{([^{}]*background(?:-color)?\s*:\s*var\(--bc-accent\)[^{}]*)\}/g)) if (!/(^|[\s;])(color|--_ink)\s*:\s*var\(--bc-on-accent\)/.test(m[1])) hiba(`${hol(m.index)}: méz háttér on-accent szövegszín nélkül`);
  for (const m of src.matchAll(/transition[^;]*var\(--bc-t-slow\)[^;]*/g)) if (!/ease-drawer/.test(m[0])) hiba(`${hol(m.index)}: 400 ms-os átmenet csak fióknál`);
  for (const m of src.matchAll(/transition[^;]*\b(\d{3,})ms/g)) if (+m[1] > 300) hiba(`${hol(m.index)}: ${m[1]} ms-os átmenet (UI ≤ 300 ms)`);
  // a halvány vonal (line-soft, ~1,4:1) csak díszítő: interaktív elem kerete / fókusz nem lehet
  for (const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim(), test = m[2];
    if (!/(border|outline)[a-z-]*\s*:[^;]*var\(--bc-line-soft\)/.test(test)) continue;
    if (/(^|[\s,>+~])(a|button|input|select|textarea|summary)\b|\[role=|:focus|\.bc-btn|\.bb-nav-link|\.bb-talalat-elem|\.bb-masol|\.bb-ful\b/.test(sel)) hiba(`${hol(m.index)}: --bc-line-soft UI-határolóként (${sel.slice(0, 70)}) – ≥ 3:1 szerep kell (--bc-line)`);
  }
}

// ---------- kontraszt: a két oldal szerepei, világos és sötét módban (tokenekből számolva) ----------
const core = json('tokens/core.json'), termek = json('tokens/theme-termek.json'), jatek = json('tokens/theme-jatek.json'), kieg = json('docs-site/skin-jatek-kiegeszites.json');
const tisztit = o => Object.fromEntries(Object.entries(o || {}).filter(([k]) => !k.startsWith('_')));
const MAP = { bg: 'bg', surface: 'surface', ink: 'ink', 'ink-soft': 'ink-soft', line: 'line', accent: 'accent', 'on-accent': 'on-accent', 'good-bg': 'success-bg', 'good-ink': 'success-ink', good: 'success', 'bad-bg': 'danger-bg', 'bad-ink': 'danger-ink' };
const jatekVil = Object.fromEntries(Object.entries(jatek.color.light).filter(([k]) => MAP[k]).map(([k, v]) => [MAP[k], v]));
const SZEREPEK = {
  'DS világos': termek.color.light, 'DS sötét': termek.color.dark,
  'Brand világos': { ...termek.color.light, ...jatekVil, ...tisztit(kieg.vilagos_potlas) }, 'Brand sötét': { ...termek.color.dark, ...tisztit(kieg.sotet) },
};
const lum = hx => { const n = parseInt(hx.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0); };
const arany = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAROK = [
  // [előtér, háttér, min, mire]
  ...['bg', 'surface', 'surface-2'].flatMap(h => [['ink', h, 4.5, 'szöveg'], ['ink-soft', h, 4.5, 'halk szöveg']]),
  ['on-accent', 'accent', 4.5, 'szöveg a mézen (aktív menüpont, kiemelés)'],
  ['success-ink', 'success-bg', 4.5, 'szöveg'], ['danger-ink', 'danger-bg', 4.5, 'szöveg'], ['ink', 'danger-bg', 4.5, 'a „Ne így” kártya szövege'],
  ...['bg', 'surface'].flatMap(h => [['line', h, 3, 'UI-határoló (keret)'], ['focus', h, 3, 'fókuszgyűrű']]),
  ['ink-muted', 'surface', 4.5, 'tiltott/„hamarosan” felirat (WCAG alól kivétel – csak jelzés)'],
  ['line-soft', 'surface', 0, 'díszítő elválasztó – nem UI-határoló'],
];
const kontraszt = [];
for (const [mod, sz] of Object.entries(SZEREPEK)) for (const [e, h, min, mire] of PAROK) {
  const a = core.color[sz[e]], b = core.color[sz[h]];
  if (!a || !b) { hiba(`kontraszt ${mod}: ismeretlen szerep ${e} (${sz[e]}) / ${h} (${sz[h]})`); continue; }
  const r = arany(a, b);
  kontraszt.push(`${mod.padEnd(13)} ${e.padEnd(12)} / ${h.padEnd(11)} ${r.toFixed(2).padStart(5)}:1${min ? ` (min ${min})` : ''} – ${mire}`);
  if (min && r < min) (e === 'ink-muted' ? figy : hibak).push(`kontraszt ${mod}: ${e} (${sz[e]}) a ${h}-on (${sz[h]}) = ${r.toFixed(2)}:1 < ${min}:1 – ${mire}`);
}

// ---------- a Brand Book jelszókapuja (ESM → ideiglenes .mjs) ----------
async function kapuProba() {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kapu-'));
  fs.mkdirSync(path.join(tmp, 'brand'));
  fs.copyFileSync(path.join(ROOT, 'netlify/edge-functions/kapu.js'), path.join(tmp, 'kapu.mjs'));
  fs.writeFileSync(path.join(tmp, 'brand/kapu-brand.mjs'), fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/brand/kapu-brand.js'), 'utf8').replace("'../kapu.js'", "'../kapu.mjs'"));
  const m = await import(require('url').pathToFileURL(path.join(tmp, 'brand/kapu-brand.mjs')).href);
  const kapu = m.default, cfg = m.config;
  let jelszo = 'proba-jelszo-1';
  globalThis.Netlify = { env: { get: n => ({ BRANDBOOK_JELSZO: jelszo, SITE_ID: 'proba' })[n] } };
  const next = () => new Response('TARTALOM', { status: 200 });
  const req = (u, o = {}) => new Request(`https://bb.example${u}`, o);
  const t = [];
  let r = await kapu(req('/logo.html', { headers: { accept: 'text/html' } }), { next });
  t.push([r.status === 303 && /^\/belepes\.html\?vissza=%2Flogo\.html/.test(r.headers.get('location')), 'süti nélkül → belépő oldal (303, vissza=/logo.html)']);
  r = await kapu(req('/assets/kereses.json'), { next });
  t.push([r.status === 401, 'süti nélkül a keresőindex 401']);
  const urlap = j => { const f = new FormData(); f.set('jelszo', j); f.set('vissza', '/logo.html'); return f; };
  r = await kapu(req('/belepes', { method: 'POST', body: urlap('rossz') }), { next });
  t.push([r.status === 303 && /hiba=1/.test(r.headers.get('location')) && !r.headers.get('set-cookie'), 'rossz jelszó → belepes.html?hiba=1, süti nélkül']);
  r = await kapu(req('/belepes', { method: 'POST', body: urlap(jelszo) }), { next });
  const suti = (r.headers.get('set-cookie') || '').split(';')[0];
  t.push([r.status === 303 && r.headers.get('location') === '/logo.html' && /^bb_kapu=/.test(suti) && /HttpOnly/.test(r.headers.get('set-cookie')), 'jó jelszó → HttpOnly süti és vissza a kért oldalra']);
  r = await kapu(req('/logo.html', { headers: { cookie: suti, accept: 'text/html' } }), { next });
  t.push([r.status === 200 && (await r.text()) === 'TARTALOM', 'süti mellett a tartalom jön']);
  jelszo = 'proba-jelszo-2';
  r = await kapu(req('/logo.html', { headers: { cookie: suti, accept: 'text/html' } }), { next });
  t.push([r.status === 303, 'jelszócsere után a régi süti érvénytelen']);
  r = await kapu(req('/belepes', { method: 'POST', body: (() => { const f = new FormData(); f.set('jelszo', jelszo); f.set('vissza', '//gonosz.example'); return f; })() }), { next });
  t.push([r.headers.get('location') === '/', 'nyitott átirányítás (//…) ellen véd']);
  for (const [ok, mi] of t) if (!ok) hibak.push(`kapu-brand: NEM teljesül: ${mi}`);
  // a szabad útvonalak a kimenetben léteznek, és pontosan a belépő oldal kellékei
  const dir = path.join(SITE, 'brand');
  if (fs.existsSync(dir)) {
    for (const p of cfg.excludedPath) { if (p === '/favicon.ico') continue; const ut = p.replace(/\/\*$/, ''); if (!fs.existsSync(path.join(dir, ut))) hibak.push(`kapu-brand: a szabad útvonal (${p}) nincs a kimenetben`); }
    const b = path.join(dir, 'belepes.html');
    if (fs.existsSync(b)) for (const m2 of fs.readFileSync(b, 'utf8').matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
      const u = m2[1].split(/[?#]/)[0];
      if (u === '/belepes' || u === '/') continue;
      if (!cfg.excludedPath.some(p => p.endsWith('/*') ? u.startsWith(p.slice(0, -1)) : p === u)) hibak.push(`kapu-brand: a belépő oldal kelléke (${u}) a kapu mögött van – vedd fel az excludedPath-ba`);
    }
    for (const m2 of (fs.readFileSync(path.join(dir, 'assets/docs.css'), 'utf8').match(/url\("?(fonts|brand)\/[^")]+/g) || [])) {
      const u = '/assets/' + m2.replace(/^url\("?/, '');
      if (/brand\//.test(u) && !cfg.excludedPath.includes(u)) figy.push(`kapu-brand: a docs.css képe (${u}) a kapu mögött van – a belépő oldalon nem töltődik be (ha ott nem kell, rendben)`);
    }
  } else hibak.push('kapu-brand: a Brand Book nincs megépítve, a szabad útvonalak nem ellenőrizhetők');
  fs.rmSync(tmp, { recursive: true, force: true });
  return t.length;
}

kapuProba().catch(e => { hibak.push(`kapu-brand: a próba nem futott: ${e.stack || e}`); return 0; }).then(kapuDb => {
  if (SZIGORU && hianyDb.brand + hianyDb.ds) hibak.push(`„Hiányzik” jelvények: Brand ${hianyDb.brand}, DS ${hianyDb.ds} (--szigoru)`);
  console.log(`docs-check – kontraszt (tokenekből, mindkét oldal, mindkét mód):\n  ${kontraszt.join('\n  ')}`);
  if (figy.length) console.log(`docs-check: ${figy.length} figyelmeztetés${LAZA ? ' (laza mód: nem buktat)' : ''}\n- ` + figy.join('\n- '));
  if (hibak.length) { console.log(`docs-check: ${hibak.length} hiba\n- ` + hibak.join('\n- ')); process.exit(1); }
  console.log(`docs-check: rendben – ${db} oldal, ${linkDb} belső hivatkozás, ${redirDb} átirányítás, ${cssek.length} CSS-réteg, ${kapuDb} kapu-próba; „Hiányzik” jelvény: Brand ${hianyDb.brand}, DS ${hianyDb.ds}${LAZA ? ' (laza mód)' : ''}`);
});
