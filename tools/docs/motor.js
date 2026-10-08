/* ============================================================
   beeco docs – közös motor: nav.json + oldal-JSON-ok → statikus oldal (oldalváz, akkordion-menü, kereső, tartalomjegyzék,
   előző/következő lánc, lábléc, csomagolt CSS). A két belépő (tools/docs-brand.js, tools/docs-ds.js) csak a beállítást adja.

   Tartalommodell (docs-site/<oldal>/):
     nav.json      { cim, csoportok: [{ id, cim, oldalak: [{ slug, cim, tervezett?, al?, gyerekek? }] }] }
                   – a sorrend adja a „következő oldal” láncot; tervezett = a cél-struktúra még meg nem írt oldala
                     (a menüben szürke „hamarosan”, nem kattintható; nincs a keresőben és a láncban)
                   – gyerekek: a 3. szint (pl. Komponensek → kategória → elem); a menüben lenyíló
     <slug>.json   { id, cim, alcim, csoport, statusz: stabil|béta|elavult|vázlat, blokkok: [...], modositva?, tipus? }
   Generált oldal: a cfg.navAtalakit által beszúrt bejegyzés (generalt: 'komponens' | 'kategoria') – nincs saját JSON-ja.
   Oldalak közti link: [szöveg](brand:<slug>) / (ds:<slug>) – helyben ../brand/, ../ds/; élesen DOCS_BRAND_URL / DOCS_DS_URL.
   Szám a szövegben: {{szam:<kulcs>}} – az adatból (cfg.szamok), nem kézzel.
   Szabály: inline stílus és inline script nincs (szigorú CSP), szöveg mindig escape-elve kerül a HTML-be.
   Laza mód (DOCS_LAZA=1 vagy --laza; az `npm test` így futtatja): csak az üres oldal és a törött link buktat.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const A = require('./alap');
const B = require('./blokk');
const { csomag, skinJatek } = require('./css');
const { atiranyitasok, redirectsFajl } = require('./atiranyitas');
const { ROOT, esc, inl, ic, strip } = A;

const REPO_URL = 'https://github.com/hegebeeco/beeco-design-system';
const STATUSZOK = ['stabil', 'béta', 'elavult', 'vázlat'];
const LAZA = process.env.DOCS_LAZA === '1' || process.argv.includes('--laza');
/** Laza módban is buktató hibák: üres oldal, törött/hiányzó oldal, olvashatatlan JSON. */
const SULYOS = /üres vagy majdnem üres|törött link|nem létező horgony|oldal hiányzik|JSON|Unexpected token|SyntaxError/;

/** Egy oldal (brand | ds) kész és tervezett slugjai – a nav.json-ból (a DS-ben a generált komponensoldalakkal). */
function oldalSlugok(site, navAtalakit) {
  const nav = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs-site', site, 'nav.json'), 'utf8'));
  if (navAtalakit) navAtalakit(nav, []);
  const kesz = new Set(), tervezett = new Set(), generalt = new Set();
  const bejar = o => { (o.tervezett ? tervezett : kesz).add(o.slug); if (o.generalt) generalt.add(o.slug); (o.gyerekek || []).forEach(bejar); };
  nav.csoportok.forEach(c => (c.oldalak || []).forEach(bejar));
  return { nav, kesz, tervezett, generalt };
}
/** A másik oldal alapcíme (perjellel): DOCS_*_URL (index.html-re végződhet), helyben ../<oldal>/ */
function masikAlap(cfg) {
  const e = process.env[cfg.masik.env];
  if (e) return e.replace(/[^/]*\.html$/, '').replace(/\/?$/, '/');
  return cfg.masik.alap;
}

/** A generátorok gyűjtője: CSS-szabály, fájl, másolás, repo-tükör, tesztlap – a kimenet törlése után íródik ki. */
function gyujto() {
  const k = { css: new Set(), fajlok: new Map(), masolasok: [], tukrok: new Set(), tesztlapok: new Set(), latott: new Set() };
  k.megvan = kulcs => { const v = k.latott.has(kulcs); k.latott.add(kulcs); return v; };
  k.fajl = (rel, tartalom) => k.fajlok.set(rel, tartalom);
  k.masol = (src, dst, o = {}) => k.masolasok.push({ src, dst, ...o });
  k.tukor = rel => k.tukrok.add(rel);
  k.tesztlap = n => k.tesztlapok.add(n);
  k.meret = rel => { const v = k.fajlok.get(rel); return v == null ? null : Buffer.byteLength(v); };
  return k;
}

function build(cfg) {
  const hibak = [], figy = [];
  const SRC = path.resolve(ROOT, cfg.forras);
  const OUT = path.resolve(ROOT, cfg.ki);
  const VERSION = A.read('VERSION').trim();
  const hangnem = A.json('tokens/hangnem.json');
  const ki = gyujto();

  // ---------- nav ----------
  const nav = JSON.parse(fs.readFileSync(path.join(SRC, 'nav.json'), 'utf8'));
  hibak.figy = figy;
  if (cfg.navAtalakit) cfg.navAtalakit(nav, hibak);
  const lanc = [], csoportOf = {}, slugok = new Set(), szuloOf = {};
  const nemOldal = new Set(['nav.json', ...(cfg.nemOldal || [])]);
  const bejegyez = (o, cs, szulo) => {
    if (slugok.has(o.slug)) hibak.push(`nav.json: kétszer szereplő oldal: ${o.slug}`);
    slugok.add(o.slug);
    const van = fs.existsSync(path.join(SRC, `${o.slug}.json`));
    if (o.tervezett && van) figy.push(`nav.json: „${o.slug}” tervezettnek jelölt, de van ${o.slug}.json – a menüben „hamarosan”, nem épül; vedd ki a „tervezett” jelölést`);
    if (!o.tervezett && !van && !o.generalt) hibak.push(`nav.json: „${o.slug}” oldal hiányzik (${cfg.forras}/${o.slug}.json), vagy jelöld „tervezett”-nek`);
    if (!o.tervezett) { lanc.push({ ...o, csoport: cs }); csoportOf[o.slug] = cs; if (szulo) szuloOf[o.slug] = szulo; }
    for (const g of o.gyerekek || []) bejegyez(g, cs, o);
  };
  for (const cs of nav.csoportok) {
    if (!cs.id || !cs.cim || !(cs.oldalak || []).length) hibak.push(`nav.json: hiányos csoport: ${JSON.stringify(cs).slice(0, 80)}`);
    for (const o of cs.oldalak || []) bejegyez(o, cs, null);
  }
  for (const f of fs.readdirSync(SRC).filter(f => f.endsWith('.json') && !nemOldal.has(f))) if (!slugok.has(f.replace(/\.json$/, ''))) hibak.push(`${cfg.forras}/${f}: nincs a nav.json-ban`);
  if (!lanc.length || lanc[0].slug !== 'index') hibak.push('nav.json: az első oldal a kezdőlap (index) legyen');

  // ---------- oldalak közti linkek ----------
  const masikAlapUrl = masikAlap(cfg);
  const masikUrl = /^https?:/.test(masikAlapUrl) ? masikAlapUrl : `${masikAlapUrl}index.html`;
  const sajat = { kesz: new Set(lanc.map(n => n.slug)), tervezett: new Set([...slugok].filter(s => !lanc.some(n => n.slug === s))) };
  let masik;
  try { masik = oldalSlugok(cfg.masik.id, cfg.masik.navAtalakit); } catch (e) { masik = { kesz: new Set(), tervezett: new Set() }; hibak.push(`a másik oldal (${cfg.masik.id}) nav.json-ja nem olvasható: ${e.message}`); }
  let aktivOldal = '';
  A.beallitLinkek(cfg.id, (site, slug, horgony) => {
    const o = site === cfg.id ? sajat : masik;
    const nev = site === 'brand' ? 'Brand Book' : 'Design System';
    if (!o.kesz.has(slug) && !o.tervezett.has(slug)) { hibak.push(`${aktivOldal}: a(z) „${site}:${slug}” link célja nincs a ${nev} nav.json-jában – a tartalmat javítsd (a ${nev} kész oldalai: ${[...o.kesz].filter(x => !(o.generalt || new Set()).has(x)).join(', ')}${o.tervezett.size ? `; tervezett: ${[...o.tervezett].join(', ')}` : ''})`); return '#'; }
    if (!o.kesz.has(slug)) return null;   // tervezett: „hamarosan” jelölt szöveg, nem link
    return site === cfg.id ? `${slug}.html${horgony}` : `${masikAlapUrl}${slug}.html${horgony}`;
  });

  // ---------- számok a szövegben: {{szam:<kulcs>}} ----------
  const szamok = cfg.szamok ? cfg.szamok() : {};
  const szamCsere = (v, hol) => {
    if (typeof v === 'string') return v.replace(/\{\{szam:([a-z0-9-]+)\}\}/g, (m, k) => { if (!(k in szamok)) { hibak.push(`${hol}: ismeretlen szám: {{szam:${k}}} (van: ${Object.keys(szamok).join(', ')})`); return m; } return String(szamok[k]); });
    if (Array.isArray(v)) return v.map(x => szamCsere(x, hol));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, szamCsere(x, hol)]));
    return v;
  };

  // ---------- oldalak renderelése (először memóriába: a CSS-csomag a használt osztályokból készül) ----------
  const index = [], kesz = [];
  const navKategoriaOf = {};
  for (const n of lanc) if (szuloOf[n.slug]) navKategoriaOf[n.slug] = szuloOf[n.slug];
  for (let i = 0; i < lanc.length; i++) {
    const n = lanc[i];
    const forras = `${cfg.forras}/${n.slug}.json`;
    const vanJson = fs.existsSync(path.resolve(ROOT, forras));
    aktivOldal = forras;
    let o;
    try { o = vanJson ? JSON.parse(fs.readFileSync(path.resolve(ROOT, forras), 'utf8')) : {}; } catch (e) { hibak.push(`${forras}: JSON-hiba: ${e.message}`); continue; }
    if (n.generalt) o = { ...(cfg.generalt ? cfg.generalt(n) : {}), ...o };
    o = szamCsere(o, forras);
    if (o.id !== n.slug) hibak.push(`${forras}: az id („${o.id}”) nem egyezik a fájlnévvel`);
    if (o.csoport !== n.csoport.id) hibak.push(`${forras}: a csoport („${o.csoport}”) nem egyezik a nav.json-nal („${n.csoport.id}”)`);
    if (!STATUSZOK.includes(o.statusz)) hibak.push(`${forras}: a statusz ${STATUSZOK.join('|')} legyen (most: ${o.statusz})`);
    if (!o.cim) hibak.push(`${forras}: hiányzik a cim`);
    const ctx = B.kornyezet(n.slug, hibak, cfg.gen || {});
    ctx.cfg = cfg; ctx.oldalAdat = o; ctx.nav = nav; ctx.masikUrl = masikUrl; ctx.ki = ki; ctx.navKategoriaOf = navKategoriaOf;
    let torzs, extraForras = [], kulcsszavak = '', kereso = [], nincsToc = false;
    try {
      if (o.tipus && cfg.tipusok && cfg.tipusok[o.tipus]) ({ torzs, extraForras = [], kulcsszavak = '', kereso = [], nincsToc = false } = cfg.tipusok[o.tipus](o, ctx));
      else if (o.tipus) { hibak.push(`${forras}: ismeretlen oldaltípus: ${o.tipus}`); torzs = ''; }
      else torzs = B.blokkok(o.blokkok, ctx);
    } catch (e) { hibak.push(`${forras}: építési hiba: ${e.stack || e}`); torzs = ''; }
    if (strip(torzs).length < 40) hibak.push(`${forras}: üres vagy majdnem üres oldal`);
    const fajlForras = vanJson ? [forras] : [];
    const datum = o.modositva || A.gitDatum([...fajlForras, ...extraForras]) || A.BUILD_ISO;
    const datumForras = o.modositva ? 'kézi' : (A.gitDatum([...fajlForras, ...extraForras]) ? 'git' : 'build');
    const toc = nincsToc ? [] : [...torzs.matchAll(/<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => ({ szint: +m[1], id: m[2], cim: strip(m[3]) }));
    const file = `${n.slug}.html`;
    const csoportCim = szuloOf[n.slug] ? `${n.csoport.cim} › ${szuloOf[n.slug].cim}` : n.csoport.cim;
    index.push({ u: file, c: o.cim, h: '', g: csoportCim, x: strip(o.alcim || '').slice(0, 160), k: kulcsszavak });
    // h2/h3 szakaszok; a h3 a szülő h2 nevével („Védőtér › Legkisebb méret”), hogy a találatnál látsszon a szakasz
    let h2 = '';
    for (const m of torzs.matchAll(/<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[23][\s>]|$)/g)) {
      const cim = strip(m[3]);
      if (m[1] === '2') h2 = cim;
      index.push({ u: `${file}#${m[2]}`, c: o.cim, h: m[1] === '3' && h2 ? `${h2} › ${cim}` : cim, g: csoportCim, x: strip(m[4].replace(/<span class="bb-dd-jel"[^>]*>[^<]*<\/span>/g, '')).slice(0, 160) });
    }
    for (const t of kereso) index.push({ u: `${file}#${t.id}`, c: o.cim, h: t.h, g: csoportCim, x: String(t.x).slice(0, 220), k: t.k || '' });
    kesz.push({ n, o, file, torzs, toc, datum, datumForras, forras: vanJson ? forras : (extraForras[0] || ''), extraForras: vanJson ? extraForras : extraForras.slice(1), elozo: lanc[i - 1], kov: lanc[i + 1] });
  }
  aktivOldal = 'oldalváz';

  // ---------- oldalváz ----------
  function menu(aktivSlug) {
    const aktivCs = csoportOf[aktivSlug];
    const link = (o, cls = 'bb-nav-link') => `<a class="${cls}" href="${esc(o.slug)}.html"${o.slug === aktivSlug ? ' aria-current="page"' : ''}>${esc(o.cim)}</a>`;
    const tetel = (o) => {
      if (o.tervezett) return `<li${o.al ? ' class="is-al"' : ''}><span class="bb-nav-link is-soon">${esc(o.cim)}<span class="bb-soon">hamarosan</span></span></li>`;
      if (!(o.gyerekek || []).length) return `<li${o.al ? ' class="is-al"' : ''}>${link(o)}</li>`;
      // 3. szint: a kategória linkje + lenyitó gomb; alapból csak az aktív ág nyitott
      const nyitott = o.slug === aktivSlug || o.gyerekek.some(g => g.slug === aktivSlug);
      const id = `nav-al-${o.slug}`;
      return `<li class="bb-nav-ag${nyitott ? ' is-aktiv' : ''}" data-ag><div class="bb-nav-ag-sor">${link(o)}<button type="button" class="bb-nav-ag-gomb" aria-expanded="true" aria-controls="${esc(id)}" aria-label="${esc(o.cim)}: ${o.gyerekek.length} elem – lenyitás">${ic('le', 'bb-nav-nyil')}</button></div><ul class="bb-nav-al2" id="${esc(id)}" role="list">${o.gyerekek.map(tetel).join('')}</ul></li>`;
    };
    const csop = nav.csoportok.map(cs => {
      const aktiv = aktivCs && cs.id === aktivCs.id;
      if (cs.oldalak.length === 1 && !(cs.oldalak[0].gyerekek || []).length) {
        const o = cs.oldalak[0];
        return o.tervezett
          ? `<li class="bb-nav-csoport"><span class="bb-nav-fo is-soon"><span>${esc(cs.cim)}</span><span class="bb-soon">hamarosan</span></span></li>`
          : `<li class="bb-nav-csoport${aktiv ? ' is-aktiv' : ''}"><a class="bb-nav-fo" href="${esc(o.slug)}.html"${o.slug === aktivSlug ? ' aria-current="page"' : ''}>${esc(cs.cim)}</a></li>`;
      }
      const keszDb = cs.oldalak.filter(o => !o.tervezett).length;
      return `<li class="bb-nav-csoport${aktiv ? ' is-aktiv' : ''}" data-csoport="${esc(cs.id)}"><button type="button" class="bb-nav-fo" id="navg-${esc(cs.id)}" aria-expanded="true" aria-controls="nav-${esc(cs.id)}"><span>${esc(cs.cim)}</span>${keszDb ? '' : '<span class="bb-soon">hamarosan</span>'}${ic('le', 'bb-nav-nyil')}</button><ul class="bb-nav-al" id="nav-${esc(cs.id)}" role="list">${cs.oldalak.map(tetel).join('')}</ul></li>`;
    }).join('');
    const kilep = cfg.kilepes ? `<a class="bb-nav-kilep" href="${esc(cfg.kilepes)}">${ic('ki')}Kilépés</a>` : '';
    return `<nav class="bb-nav" id="bb-nav" aria-label="${esc(cfg.nev)} – tartalom"><div class="bb-nav-fej"><span class="bb-nav-cim">${esc(cfg.nev)}</span><button type="button" class="bc-btn is-ghost is-icon bb-menu-zar" aria-label="Menü bezárása" data-menu-zar>${ic('x')}</button></div><ul class="bb-nav-lista" role="list">${csop}</ul><p class="bb-nav-lab"><a class="bb-nav-masik" href="${esc(masikUrl)}">${esc(cfg.masik.nev)}${ic('kulso')}<span class="bc-sr"> (másik oldal)</span></a>${kilep}<span>DS v${esc(VERSION)}</span></p></nav>`;
  }
  const tocLista = toc => `<ul role="list">${toc.map(t => `<li class="is-h${t.szint}"><a href="#${esc(t.id)}">${esc(t.cim)}</a></li>`).join('')}</ul>`;
  function oldal({ slug, cim, leiras, torzs, toc = [], csoport, datum, datumForras, forras, extraForras = [], elozo, kov, statusz, keresoOldal, hos }) {
    const fejBelso = `${csoport ? `<p class="bb-csoport">${esc(csoport)}</p>` : ''}<h1>${inl(cim)}</h1>${leiras ? `<p class="bb-lead">${inl(leiras)}</p>` : ''}${statusz ? `<p class="bb-oldal-meta">${B.statuszJelveny(statusz)}</p>` : ''}`;
    const fej = hos ? `<header class="bb-oldalfej bb-hero bc-honeycomb"><div>${fejBelso}</div>${hos.kep ? `<img class="bb-hero-kep" src="assets/brand/${esc(hos.kep)}.webp" alt="" width="160" height="160">` : ''}</header>` : `<header class="bb-oldalfej">${fejBelso}</header>`;
    const tocVan = toc.length >= 2;
    const szerk = forras ? `<a href="${REPO_URL}/edit/main/${esc(forras)}" rel="noopener">${ic('szerk')}Szerkeszd GitHubon</a>${extraForras.length ? ` <span class="bb-lab-halk">(adat: ${extraForras.map(f => `<a href="${REPO_URL}/blob/main/${esc(f)}" rel="noopener"><code>${esc(f)}</code></a>`).join(', ')})</span>` : ''}` : '';
    const lancHtml = (elozo || kov) ? `<nav class="bb-lanc" aria-label="Lapozás">${elozo ? `<a class="bb-lanc-elem is-elozo" href="${esc(elozo.slug)}.html" rel="prev"><span class="bb-lanc-irany">${ic('vissza')}Előző</span><span class="bb-lanc-cim">${esc(elozo.cim)}</span></a>` : '<span></span>'}${kov ? `<a class="bb-lanc-elem is-kov" href="${esc(kov.slug)}.html" rel="next"><span class="bb-lanc-irany">Következő${ic('tovabb')}</span><span class="bb-lanc-cim">${esc(kov.cim)}</span></a>` : ''}</nav>` : '';
    return `<!doctype html>
<html lang="hu" data-theme="auto" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${cfg.robots ? `<meta name="robots" content="${esc(cfg.robots)}">\n` : ''}<title>${esc(strip(cim).includes(cfg.nev) ? strip(cim) : `${strip(cim)} · beeco ${cfg.nev}`)}</title>
<meta name="description" content="${esc(strip(leiras || cfg.leiras))}">
<link rel="icon" href="assets/brand/ikon-32.png">
<link rel="preload" href="assets/fonts/lalezar-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/opensans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/docs.css">
<script src="assets/tema.js"></script>
<script src="assets/docs.js" defer></script>
</head>
<body class="bb-site is-${esc(cfg.id)}" data-oldal="${esc(slug)}">
<a class="bb-ugras" href="#tartalom">Ugrás a tartalomra</a>
<header class="bb-fejlec">
<button type="button" class="bc-btn is-ghost is-icon bb-menu-nyit" aria-label="Menü" aria-controls="bb-nav" aria-expanded="false" data-menu-nyit>${ic('menu')}</button>
<a class="bb-marka" href="index.html"><span class="bc-logo" role="img" aria-label="beeco"></span><span class="bb-marka-nev">${esc(cfg.nev)}</span></a>
<form class="bb-kereso" role="search" action="kereses.html">
<label class="bc-sr" for="bb-q">Keresés: ${esc(cfg.nev)}</label>${ic('kereses', 'bb-kereso-ic')}
<input class="bc-input" id="bb-q" name="q" type="search" placeholder="${esc(cfg.keresoPelda)}" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="bb-talalat" aria-autocomplete="list" aria-describedby="bb-talalat-szam">
<div class="bb-talalat" id="bb-talalat" role="listbox" aria-label="Találatok" hidden></div>
<p class="bc-sr" id="bb-talalat-szam" aria-live="polite"></p>
</form>
<a class="bb-masik" href="${esc(masikUrl)}">${esc(cfg.masik.nev)}${ic('kulso')}<span class="bc-sr"> (másik oldal)</span></a>
<button type="button" class="bc-btn is-ghost is-icon bb-tema" data-tema-gomb aria-label="Téma: rendszer szerint">${ic('auto', 'is-auto')}${ic('nap', 'is-vilagos')}${ic('hold', 'is-sotet')}<span class="bb-tema-nev is-n-auto" aria-hidden="true">Rendszer</span><span class="bb-tema-nev is-n-vilagos" aria-hidden="true">Világos</span><span class="bb-tema-nev is-n-sotet" aria-hidden="true">Sötét</span></button>
</header>
<div class="bb-test${tocVan ? ' has-toc' : ''}">
${menu(slug)}
<div class="bb-scrim" data-menu-zar hidden></div>
<main class="bb-fo" id="tartalom" tabindex="-1">
<article class="bb-cikk">
${fej}
${tocVan ? `<details class="bb-toc-mobil"><summary>Ezen az oldalon</summary>${tocLista(toc)}</details>` : ''}
${torzs}
</article>
${keresoOldal ? '' : lancHtml}
<footer class="bb-lab">
${datum ? `<p>Utoljára módosítva: <time datetime="${esc(datum)}">${esc(A.huDatum(datum))}</time>${datumForras === 'build' ? ' <span class="bb-lab-halk">(építés dátuma – a forrás még nincs commitolva)</span>' : ''}</p>` : ''}
${szerk ? `<p>${szerk}</p>` : ''}
${cfg.labjegy ? `<p class="bb-lab-halk">${inl(cfg.labjegy)}</p>` : ''}
<p class="bb-lab-halk">beeco ${esc(cfg.nev)} · design system v${esc(VERSION)} · forrás: <a href="${REPO_URL}" rel="noopener"><code>hegebeeco/beeco-design-system</code></a></p>
</footer>
</main>
${tocVan ? `<aside class="bb-toc" aria-labelledby="bb-toc-cim"><p class="bb-toc-cim" id="bb-toc-cim">Ezen az oldalon</p>${tocLista(toc)}</aside>` : ''}
</div>
</body>
</html>
`;
  }
  /** A jelszókapu belépő oldala (Brand Book): csak a docs.css, a tema.js, a belepes.js, a betűk és a logó kell hozzá (kapu-brand.js: excludedPath). */
  function belepesOldal() {
    return `<!doctype html>
<html lang="hu" data-theme="auto" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Belépés · beeco ${esc(cfg.nev)}</title>
<link rel="icon" href="/assets/brand/ikon-32.png">
<link rel="stylesheet" href="/assets/docs.css">
<script src="/assets/tema.js"></script>
<script src="/assets/belepes.js" defer></script>
</head>
<body class="bb-site is-${esc(cfg.id)} bb-belepes-test">
<main class="bb-belepes" id="tartalom">
<span class="bc-logo bb-belepes-logo" role="img" aria-label="beeco"></span>
<h1>${esc(cfg.nev)}</h1>
<p>A beeco márkakönyve önkénteseknek, partnereknek és tervezőknek. A jelszót a beeco csapatától kapod.</p>
<form class="bb-belepes-urlap" method="post" action="/belepes">
<input type="hidden" name="vissza" value="/" data-vissza>
<div class="bc-field"><label class="bc-label" for="jelszo">Jelszó</label><input class="bc-input" id="jelszo" name="jelszo" type="password" autocomplete="current-password" required aria-describedby="jelszo-hiba"><p class="bc-error" id="jelszo-hiba" data-hiba hidden>Ez nem a jó jelszó. Nézd meg, nincs-e bekapcsolva a nagybetű, vagy kérd el újra a beeco csapatától.</p></div>
<button type="submit" class="bc-btn is-block">Belépés${ic('tovabb')}</button>
</form>
<p class="bb-kicsi">A ${esc(cfg.masik.nev)} jelszó nélkül is nyitott: <a href="${esc(masikUrl)}">${esc(cfg.masik.nev)}</a></p>
</main>
</body>
</html>
`;
  }

  // ---------- kiírás ----------
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  const html = {};
  for (const k of kesz) html[k.file] = oldal({ slug: k.n.slug, cim: k.o.cim, leiras: k.o.alcim, torzs: k.torzs, toc: k.toc, csoport: k.n.slug === 'index' ? '' : (szuloOf[k.n.slug] ? `${k.n.csoport.cim} · ${szuloOf[k.n.slug].cim}` : k.n.csoport.cim),
    datum: k.datum, datumForras: k.datumForras, forras: k.forras, extraForras: k.extraForras, elozo: k.elozo, kov: k.kov, statusz: k.o.statusz, hos: k.o.hos });
  html['kereses.html'] = oldal({ slug: 'kereses', cim: 'Keresés', leiras: `Keresés a ${cfg.nev} oldalain.`, keresoOldal: true,
    torzs: `<p class="bb-kereses-allapot" data-kereses-allapot aria-live="polite">Írd be fent, mit keresel – például ${cfg.keresoPelda.replace(/^Keresés: /, '').replace(/…$/, '').split(', ').map(s => `<em>${esc(s)}</em>`).join(', ')}.</p><noscript><p>A kereséshez JavaScript kell. A menüből minden oldal elérhető.</p></noscript><div class="bb-kereses-lista" data-kereses-lista></div>` });
  html['404.html'] = oldal({ slug: '404', cim: 'Nincs ilyen oldal', leiras: 'Ezt az oldalt nem találjuk. Indulj a kezdőlapról, vagy keress fent.', keresoOldal: true,
    torzs: `<p><a class="bc-btn" href="index.html">Kezdőlap${ic('tovabb')}</a></p>` });
  if (cfg.belepes) html['belepes.html'] = belepesOldal();
  for (const [f, h] of Object.entries(html)) fs.writeFileSync(path.join(OUT, f), h);
  fs.writeFileSync(path.join(OUT, 'assets', 'kereses.json'), JSON.stringify(index));
  // a kész menü (a generált oldalakkal) – a tests/docs-check.js ebből tudja, mi tervezett
  const navKi = JSON.parse(JSON.stringify(nav, (k, v) => (k === 'kategoria' ? undefined : v)));
  fs.writeFileSync(path.join(OUT, 'assets', 'nav.json'), JSON.stringify(navKi));

  // generátorok fájljai (minta-oldalak, sablonok, ZIP, SVG) és másolásai
  const tiltott = hangnem.tiltott_kepek || [];
  const tiltottFajl = f => tiltott.some(t => path.basename(f).startsWith(t + '.'));
  for (const [rel, t] of ki.fajlok) { fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true }); fs.writeFileSync(path.join(OUT, rel), t); }
  for (const m of ki.masolasok) {
    const s = path.join(ROOT, m.src);
    if (!fs.existsSync(s)) { hibak.push(`hiányzó forrás: ${m.src}`); continue; }
    fs.mkdirSync(path.dirname(path.join(OUT, m.dst)), { recursive: true });
    fs.cpSync(s, path.join(OUT, m.dst), { recursive: true, filter: f => !/\.DS_Store$/.test(f) && !tiltottFajl(f) && (!m.szuro || m.szuro(f)) });
    if (m.atir) for (const f of bejar(path.join(OUT, m.dst)).filter(f => /\.(html|js|css)$/.test(f))) fs.writeFileSync(f, m.atir(fs.readFileSync(f, 'utf8')));
  }
  // tesztlapok: a repó szerinti relatív helyükön (../css/bc-all.css, ../../dist/tesztlapok/*.js)
  if (ki.tesztlapok.size) ['termek/css', 'dist/css', 'web/assets/fonts', 'web/assets/brand'].forEach(r => ki.tukor(r));
  for (const n of ki.tesztlapok) { ki.tukor(`termek/tesztlapok/${n}.html`); ki.tukor(`dist/tesztlapok/${n}.js`); }
  for (const r of [...ki.tukrok, ...(cfg.tukor || [])]) {
    const s = path.join(ROOT, r);
    if (!fs.existsSync(s)) { hibak.push(`hiányzó forrás (repo-tükör): ${r}`); continue; }
    fs.mkdirSync(path.dirname(path.join(OUT, 'repo', r)), { recursive: true });
    fs.cpSync(s, path.join(OUT, 'repo', r), { recursive: true, filter: f => !/\.DS_Store$|nezo\.png$|\.test\.mjs$/.test(f) && !tiltottFajl(f) });
  }

  // CSS: a használt bc-osztályok szerinti csomag + docs réteg + tartalom-réteg + generált minták (+ játékbőr-skin a Brand Bookban)
  const osztalyok = new Set();
  const jsSrc = fs.readFileSync(path.join(__dirname, 'kliens', 'docs.js'), 'utf8');
  for (const h of [...Object.values(html), jsSrc]) for (const m of h.matchAll(/class(?:Name)?\s*[=:]\s*["']([^"']+)["']/g)) m[1].split(/\s+/).forEach(c => osztalyok.add(c));
  const kliensCss = f => fs.readFileSync(path.join(__dirname, 'kliens', f), 'utf8');
  const genCss = [...ki.css].join('\n');
  const retegek = [['tools/docs/kliens/docs.css', kliensCss('docs.css')], ['tools/docs/kliens/tartalom.css', kliensCss('tartalom.css')], ['generált minták (tools/docs/gen.js)', genCss]];
  if (cfg.skin === 'jatek') { const skin = skinJatek(); retegek.push(['skin-jatek.css (generált)', skin]); fs.writeFileSync(path.join(OUT, 'assets', 'skin-jatek.css'), skin); }
  fs.writeFileSync(path.join(OUT, 'assets', 'gen.css'), `/* GENERÁLT (tools/docs/gen.js) – csak ellenőrzéshez; a docs.css már tartalmazza */\n${genCss}\n`);
  const cs = csomag(osztalyok, retegek);
  fs.writeFileSync(path.join(OUT, 'assets', 'docs.css'), cs.css);
  fs.copyFileSync(path.join(__dirname, 'kliens', 'tema.js'), path.join(OUT, 'assets', 'tema.js'));
  fs.writeFileSync(path.join(OUT, 'assets', 'docs.js'), jsSrc);
  if (cfg.belepes) fs.copyFileSync(path.join(__dirname, 'kliens', 'belepes.js'), path.join(OUT, 'assets', 'belepes.js'));

  // Képek, betűk: csak amire hivatkozás van (a mérges méhecske soha) – a fő oldalakon és a minta-oldalakon (../assets/)
  const hiv = new Set();
  const minden = [...Object.values(html), ...[...ki.fajlok].filter(([f]) => /\.(html|css)$/.test(f)).map(([, t]) => String(t))];
  for (const h of minden) for (const m of h.matchAll(/(?:src|href|srcset)="\/?(?:\.\.\/)?assets\/((?:brand|fonts)\/[^"#?\s]+)"/g)) hiv.add(m[1]);
  for (const m of cs.css.matchAll(/url\(["']?((?:brand|fonts)\/[^"')]+)["']?\)/g)) hiv.add(m[1]);
  for (const r of hiv) {
    if (tiltott.some(t => r.includes(t))) { hibak.push(`tiltott kép: ${r}`); continue; }
    const src = path.join(ROOT, 'web/assets', r);
    if (!fs.existsSync(src)) { hibak.push(`hiányzó kép/betű: web/assets/${r}`); continue; }
    fs.mkdirSync(path.dirname(path.join(OUT, 'assets', r)), { recursive: true });
    fs.copyFileSync(src, path.join(OUT, 'assets', r));
  }
  for (const [rel, dst] of (cfg.masol || [])) {
    const s = path.join(ROOT, rel);
    if (!fs.existsSync(s)) { hibak.push(`hiányzó forrás: ${rel}`); continue; }
    fs.mkdirSync(path.dirname(path.join(OUT, dst)), { recursive: true });
    fs.cpSync(s, path.join(OUT, dst), { recursive: true, filter: f => !/\.DS_Store$/.test(f) && !tiltottFajl(f) });
  }

  // átirányítások a régi Brand Book címeiről (docs-site/leltar.json)
  let redir = null;
  if (cfg.atiranyitas) {
    const oldalak = { [cfg.id]: { nav, ...sajat }, [cfg.masik.id]: masik };
    const dsUrl = cfg.id === 'brand' ? process.env.DOCS_DS_URL : null;
    redir = atiranyitasok(oldalak, dsUrl, cfg.id, (site, slug, id) => site === cfg.id && !!html[`${slug}.html`] && html[`${slug}.html`].includes(` id="${id}"`));
    hibak.push(...redir.hibak);
    fs.writeFileSync(path.join(OUT, '_redirects'), redirectsFajl(redir[cfg.id], `a régi Brand Book címei → ${cfg.nev}`));
  }

  const meret = Object.fromEntries(Object.entries(html).map(([f, h]) => [f, Buffer.byteLength(h)]));
  return { hibak, figy, OUT, oldalak: kesz.length, index: index.length, css: { kell: cs.kell, kihagyva: cs.kihagyva, bajt: Buffer.byteLength(cs.css) }, meret, redir };
}
function bejar(d) { return fs.existsSync(d) && fs.statSync(d).isDirectory() ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? bejar(path.join(d, e.name)) : [path.join(d, e.name)]) : [d]; }

function futtat(cfg) {
  const t0 = Date.now();
  let r;
  try { r = build(cfg); } catch (e) { console.error(`docs-${cfg.id} – HIBA: ${e.stack || e}`); process.exit(1); }
  if (r.figy.length) console.warn(`docs-${cfg.id} – figyelmeztetés (${r.figy.length}):\n  ` + r.figy.join('\n  '));
  const sulyos = LAZA ? r.hibak.filter(h => SULYOS.test(h)) : r.hibak;
  const enyhe = LAZA ? r.hibak.filter(h => !SULYOS.test(h)) : [];
  if (enyhe.length) console.warn(`docs-${cfg.id} – figyelmeztetés (laza mód, ${enyhe.length}):\n  ` + enyhe.join('\n  '));
  if (sulyos.length) { console.error(`docs-${cfg.id} – HIBA:\n  ` + sulyos.join('\n  ')); process.exit(1); }
  if (r.redir && r.redir.jegyzet.length && !LAZA) console.log(`docs-${cfg.id} – átirányítás, jegyzet:\n  ` + r.redir.jegyzet.join('\n  '));
  console.log(`docs-${cfg.id} kész: ${r.oldalak} tartalmi oldal (+ kereses, 404${cfg.belepes ? ', belepes' : ''}), ${r.index} keresőtétel, CSS ${Math.round(r.css.bajt / 1024)} KB (${r.css.kell.length} fájl, kihagyva ${r.css.kihagyva.length})${r.redir ? `, ${r.redir[cfg.id].length} átirányítás` : ''} → ${path.relative(ROOT, r.OUT)} · ${Date.now() - t0} ms`);
  return r;
}

module.exports = { build, futtat, oldalSlugok, REPO_URL, LAZA };
