/* ============================================================
   beeco docs – közös motor: nav.json + oldal-JSON-ok → statikus oldal (oldalváz, akkordion-menü, kereső, tartalomjegyzék,
   előző/következő lánc, lábléc, csomagolt CSS). A két belépő (tools/docs-brand.js, tools/docs-ds.js) csak a beállítást adja.

   Tartalommodell (docs-site/<oldal>/):
     nav.json      { cim, csoportok: [{ id, cim, oldalak: [{ slug, cim, tervezett?, al? }] }] }
                   – a sorrend adja a „következő oldal” láncot; tervezett = a cél-struktúra még meg nem írt oldala
                     (a menüben szürke „hamarosan”, nem kattintható; nincs a keresőben és a láncban)
     <slug>.json   { id, cim, alcim, csoport, statusz: stabil|béta|elavult|vázlat, blokkok: [...], modositva?, tipus? }
   Szabály: inline stílus és inline script nincs (szigorú CSP), szöveg mindig escape-elve kerül a HTML-be.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const A = require('./alap');
const B = require('./blokk');
const { csomag, skinJatek } = require('./css');
const { ROOT, esc, inl, ic, strip } = A;

const REPO_URL = 'https://github.com/hegebeeco/beeco-design-system';
const STATUSZOK = ['stabil', 'béta', 'elavult', 'vázlat'];

function build(cfg) {
  const hibak = [];
  const SRC = path.join(ROOT, cfg.forras);
  const OUT = path.resolve(ROOT, cfg.ki);
  const VERSION = A.read('VERSION').trim();
  const hangnem = A.json('tokens/hangnem.json');

  // ---------- nav ----------
  const nav = JSON.parse(fs.readFileSync(path.join(SRC, 'nav.json'), 'utf8'));
  const lanc = [], csoportOf = {}, slugok = new Set();
  for (const cs of nav.csoportok) {
    if (!cs.id || !cs.cim || !(cs.oldalak || []).length) hibak.push(`nav.json: hiányos csoport: ${JSON.stringify(cs).slice(0, 80)}`);
    for (const o of cs.oldalak || []) {
      if (slugok.has(o.slug)) hibak.push(`nav.json: kétszer szereplő oldal: ${o.slug}`);
      slugok.add(o.slug);
      const van = fs.existsSync(path.join(SRC, `${o.slug}.json`));
      if (o.tervezett && van) hibak.push(`nav.json: „${o.slug}” tervezettnek jelölt, de van ${o.slug}.json – vedd ki a „tervezett” jelölést`);
      if (!o.tervezett && !van) hibak.push(`nav.json: „${o.slug}” oldal hiányzik (${cfg.forras}/${o.slug}.json), vagy jelöld „tervezett”-nek`);
      if (!o.tervezett) { lanc.push({ ...o, csoport: cs }); csoportOf[o.slug] = cs; }
    }
  }
  for (const f of fs.readdirSync(SRC).filter(f => f.endsWith('.json') && f !== 'nav.json')) if (!slugok.has(f.replace(/\.json$/, ''))) hibak.push(`${cfg.forras}/${f}: nincs a nav.json-ban`);
  if (!lanc.length || lanc[0].slug !== 'index') hibak.push('nav.json: az első oldal a kezdőlap (index) legyen');

  const masikUrl = process.env[cfg.masik.env] || cfg.masik.url;
  // ---------- oldalak renderelése (először memóriába: a CSS-csomag a használt osztályokból készül) ----------
  const index = [], kesz = [];
  for (let i = 0; i < lanc.length; i++) {
    const n = lanc[i];
    const forras = `${cfg.forras}/${n.slug}.json`;
    const o = A.json(forras);
    if (o.id !== n.slug) hibak.push(`${forras}: az id („${o.id}”) nem egyezik a fájlnévvel`);
    if (o.csoport !== n.csoport.id) hibak.push(`${forras}: a csoport („${o.csoport}”) nem egyezik a nav.json-nal („${n.csoport.id}”)`);
    if (!STATUSZOK.includes(o.statusz)) hibak.push(`${forras}: a statusz ${STATUSZOK.join('|')} legyen (most: ${o.statusz})`);
    if (!o.cim) hibak.push(`${forras}: hiányzik a cim`);
    const ctx = B.kornyezet(n.slug, hibak, cfg.gen || {});
    ctx.cfg = cfg; ctx.oldalAdat = o; ctx.nav = nav; ctx.masikUrl = masikUrl;
    let torzs, extraForras = [], kulcsszavak = '';
    if (o.tipus && cfg.tipusok && cfg.tipusok[o.tipus]) ({ torzs, extraForras = [], kulcsszavak = '' } = cfg.tipusok[o.tipus](o, ctx));
    else if (o.tipus) { hibak.push(`${forras}: ismeretlen oldaltípus: ${o.tipus}`); torzs = ''; }
    else torzs = B.blokkok(o.blokkok, ctx);
    if (strip(torzs).length < 40) hibak.push(`${forras}: üres vagy majdnem üres oldal`);
    const datum = o.modositva || A.gitDatum([forras, ...extraForras]) || A.BUILD_ISO;
    const datumForras = o.modositva ? 'kézi' : (A.gitDatum([forras, ...extraForras]) ? 'git' : 'build');
    const toc = [...torzs.matchAll(/<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => ({ szint: +m[1], id: m[2], cim: strip(m[3]) }));
    const file = `${n.slug}.html`;
    index.push({ u: file, c: o.cim, h: '', g: n.csoport.cim, x: strip(o.alcim || '').slice(0, 160), k: kulcsszavak });
    for (const m of torzs.matchAll(/<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[23][\s>]|$)/g))
      index.push({ u: `${file}#${m[2]}`, c: o.cim, h: strip(m[3]), g: n.csoport.cim, x: strip(m[4].replace(/<span class="bb-dd-jel"[^>]*>[^<]*<\/span>/g, '')).slice(0, 160) });
    kesz.push({ n, o, file, torzs, toc, datum, datumForras, forras, extraForras, elozo: lanc[i - 1], kov: lanc[i + 1] });
  }

  // ---------- oldalváz ----------
  function menu(aktivSlug) {
    const aktivCs = csoportOf[aktivSlug];
    const tetel = (o) => o.tervezett
      ? `<li${o.al ? ' class="is-al"' : ''}><span class="bb-nav-link is-soon">${esc(o.cim)}<span class="bb-soon">hamarosan</span></span></li>`
      : `<li${o.al ? ' class="is-al"' : ''}><a class="bb-nav-link" href="${esc(o.slug)}.html"${o.slug === aktivSlug ? ' aria-current="page"' : ''}>${esc(o.cim)}</a></li>`;
    const csop = nav.csoportok.map(cs => {
      const aktiv = aktivCs && cs.id === aktivCs.id;
      if (cs.oldalak.length === 1) {
        const o = cs.oldalak[0];
        return o.tervezett
          ? `<li class="bb-nav-csoport"><span class="bb-nav-fo is-soon"><span>${esc(cs.cim)}</span><span class="bb-soon">hamarosan</span></span></li>`
          : `<li class="bb-nav-csoport${aktiv ? ' is-aktiv' : ''}"><a class="bb-nav-fo" href="${esc(o.slug)}.html"${o.slug === aktivSlug ? ' aria-current="page"' : ''}>${esc(cs.cim)}</a></li>`;
      }
      const kesz = cs.oldalak.filter(o => !o.tervezett).length;
      return `<li class="bb-nav-csoport${aktiv ? ' is-aktiv' : ''}" data-csoport="${esc(cs.id)}"><button type="button" class="bb-nav-fo" id="navg-${esc(cs.id)}" aria-expanded="true" aria-controls="nav-${esc(cs.id)}"><span>${esc(cs.cim)}</span>${kesz ? '' : '<span class="bb-soon">hamarosan</span>'}${ic('le', 'bb-nav-nyil')}</button><ul class="bb-nav-al" id="nav-${esc(cs.id)}" role="list">${cs.oldalak.map(tetel).join('')}</ul></li>`;
    }).join('');
    return `<nav class="bb-nav" id="bb-nav" aria-label="${esc(cfg.nev)} – tartalom"><div class="bb-nav-fej"><span class="bb-nav-cim">${esc(cfg.nev)}</span><button type="button" class="bc-btn is-ghost is-icon bb-menu-zar" aria-label="Menü bezárása" data-menu-zar>${ic('x')}</button></div><ul class="bb-nav-lista" role="list">${csop}</ul><p class="bb-nav-lab"><a class="bb-nav-masik" href="${esc(masikUrl)}">${esc(cfg.masik.nev)}${ic('kulso')}<span class="bc-sr"> (másik oldal)</span></a><span>DS v${esc(VERSION)}</span></p></nav>`;
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
<meta name="description" content="${esc(leiras || cfg.leiras)}">
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
<p class="bb-lab-halk">beeco ${esc(cfg.nev)} · design system v${esc(VERSION)} · forrás: <a href="${REPO_URL}" rel="noopener"><code>hegebeeco/beeco-design-system</code></a></p>
</footer>
</main>
${tocVan ? `<aside class="bb-toc" aria-labelledby="bb-toc-cim"><p class="bb-toc-cim" id="bb-toc-cim">Ezen az oldalon</p>${tocLista(toc)}</aside>` : ''}
</div>
</body>
</html>
`;
  }

  // ---------- kiírás ----------
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  const html = {};
  for (const k of kesz) html[k.file] = oldal({ slug: k.n.slug, cim: k.o.cim, leiras: k.o.alcim, torzs: k.torzs, toc: k.toc, csoport: k.n.slug === 'index' ? '' : k.n.csoport.cim,
    datum: k.datum, datumForras: k.datumForras, forras: k.forras, extraForras: k.extraForras, elozo: k.elozo, kov: k.kov, statusz: k.o.statusz, hos: k.o.hos });
  html['kereses.html'] = oldal({ slug: 'kereses', cim: 'Keresés', leiras: `Keresés a ${cfg.nev} oldalain.`, keresoOldal: true,
    torzs: `<p class="bb-kereses-allapot" data-kereses-allapot aria-live="polite">Írd be fent, mit keresel – például ${cfg.keresoPelda.replace(/^Keresés: /, '').replace(/…$/, '').split(', ').map(s => `<em>${esc(s)}</em>`).join(', ')}.</p><noscript><p>A kereséshez JavaScript kell. A menüből minden oldal elérhető.</p></noscript><div class="bb-kereses-lista" data-kereses-lista></div>` });
  html['404.html'] = oldal({ slug: '404', cim: 'Nincs ilyen oldal', leiras: 'Ezt az oldalt nem találjuk. Indulj a kezdőlapról, vagy keress fent.', keresoOldal: true,
    torzs: `<p><a class="bc-btn" href="index.html">Kezdőlap${ic('tovabb')}</a></p>` });
  for (const [f, h] of Object.entries(html)) fs.writeFileSync(path.join(OUT, f), h);
  fs.writeFileSync(path.join(OUT, 'assets', 'kereses.json'), JSON.stringify(index));

  // CSS: a használt bc-osztályok szerinti csomag + docs réteg (+ játékbőr-skin a Brand Bookban)
  const osztalyok = new Set();
  const jsSrc = fs.readFileSync(path.join(__dirname, 'kliens', 'docs.js'), 'utf8');
  for (const h of [...Object.values(html), jsSrc]) for (const m of h.matchAll(/class(?:Name)?\s*[=:]\s*["']([^"']+)["']/g)) m[1].split(/\s+/).forEach(c => osztalyok.add(c));
  const retegek = [['tools/docs/kliens/docs.css', fs.readFileSync(path.join(__dirname, 'kliens', 'docs.css'), 'utf8')]];
  let skin = '';
  if (cfg.skin === 'jatek') { skin = skinJatek(); retegek.push(['skin-jatek.css (generált)', skin]); fs.writeFileSync(path.join(OUT, 'assets', 'skin-jatek.css'), skin); }
  const cs = csomag(osztalyok, retegek);
  fs.writeFileSync(path.join(OUT, 'assets', 'docs.css'), cs.css);
  fs.copyFileSync(path.join(__dirname, 'kliens', 'tema.js'), path.join(OUT, 'assets', 'tema.js'));
  fs.writeFileSync(path.join(OUT, 'assets', 'docs.js'), jsSrc);

  // Képek, betűk: csak amire hivatkozás van (a mérges méhecske soha)
  const tiltott = hangnem.tiltott_kepek || [];
  const hiv = new Set();
  for (const h of Object.values(html)) for (const m of h.matchAll(/(?:src|href)="assets\/((?:brand|fonts)\/[^"#?]+)"/g)) hiv.add(m[1]);
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
    fs.cpSync(s, path.join(OUT, dst), { recursive: true, filter: f => !/\.DS_Store$/.test(f) && !tiltott.some(t => path.basename(f).startsWith(t + '.')) });
  }

  const meret = Object.fromEntries(Object.entries(html).map(([f, h]) => [f, Buffer.byteLength(h)]));
  return { hibak, OUT, oldalak: kesz.length, index: index.length, css: { kell: cs.kell, kihagyva: cs.kihagyva, bajt: Buffer.byteLength(cs.css) }, meret };
}

function futtat(cfg) {
  const t0 = Date.now();
  let r;
  try { r = build(cfg); } catch (e) { console.error(`docs-${cfg.id} – HIBA: ${e.stack || e}`); process.exit(1); }
  if (r.hibak.length) { console.error(`docs-${cfg.id} – HIBA:\n  ` + r.hibak.join('\n  ')); process.exit(1); }
  console.log(`docs-${cfg.id} kész: ${r.oldalak} tartalmi oldal (+ kereses, 404), ${r.index} keresőtétel, CSS ${Math.round(r.css.bajt / 1024)} KB (${r.css.kell.length} fájl, kihagyva ${r.css.kihagyva.length}) → ${path.relative(ROOT, r.OUT)} · ${Date.now() - t0} ms`);
  return r;
}

module.exports = { build, futtat, REPO_URL };
