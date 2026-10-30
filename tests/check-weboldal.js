#!/usr/bin/env node
/* ============================================================
   check-weboldal – a webes réteg őre (docs/weboldal.md)

   A weboldal nem tud DS-t importálni, ezért a tokenek Webflow-VÁLTOZÓKÉNT élnek. Ez a teszt azt őrzi,
   hogy a generált lista friss, teljes és a névszabály szerinti – így a Webflow és a DS nem csúszhat szét
   észrevétlenül. Az ÉLŐ oldalt nem ez méri, hanem a tools/web-ellenor.js.

   Használat: node tests/check-weboldal.js
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const hibak = [];
const baj = (m) => hibak.push(m);

// 1. A generált réteg friss-e
try {
  execFileSync(process.execPath, [path.join(ROOT, 'tools/webflow-build.js'), '--check'], { stdio: 'pipe' });
} catch (e) {
  baj(`a dist/weboldal nem friss – futtasd: node tools/webflow-build.js\n    ${String(e.stderr || '').trim().split('\n')[0]}`);
}

const V = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/weboldal/webflow-valtozok.json'), 'utf8'));
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/weboldal/paletta.json'), 'utf8'));
const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/tokens.json'), 'utf8'));

// 2. Minden termékbőr-szerephez van változó (különben a Webflow-ban nincs mivel színezni)
const nevek = new Set(V.valtozok.map((v) => v.nev));
for (const szerep of Object.keys(T.termek.light)) {
  if (!nevek.has(`bc-${szerep}`)) baj(`hiányzó Webflow-változó a(z) "${szerep}" szerephez (bc-${szerep})`);
}

// 3. Névszabály: bc- előtag, csak kisbetű, szám és kötőjel. Ékezet tilos (a CSS-névbe is átmegy).
for (const v of V.valtozok) {
  if (!/^bc-[a-z0-9-]+$/.test(v.nev)) baj(`szabálytalan változónév: "${v.nev}" (csak bc- előtag, kisbetű, szám, kötőjel)`);
}

// 4. Nincs duplikált név
const latott = new Set();
for (const v of V.valtozok) { if (latott.has(v.nev)) baj(`kétszer szereplő változó: ${v.nev}`); latott.add(v.nev); }

// 5. A színek érvényes hexek, és minden szerepnek van sötét párja
for (const v of V.valtozok.filter((x) => x.tipus === 'Color')) {
  if (!/^#[0-9A-F]{6}$/.test(v.ertek)) baj(`nem érvényes hex: ${v.nev} = ${v.ertek}`);
  if (!v.sotet) baj(`nincs sötét érték: ${v.nev} (minden szerepnek kell sötét párja)`);
  else if (!/^#[0-9A-F]{6}$/.test(v.sotet)) baj(`nem érvényes sötét hex: ${v.nev} = ${v.sotet}`);
}

// 6. A méretek pozitív px értékek
for (const v of V.valtozok.filter((x) => x.tipus === 'Size')) {
  if (!v.ertek || typeof v.ertek.value !== 'number' || v.ertek.value < 0 || v.ertek.unit !== 'px') baj(`hibás méret: ${v.nev} = ${JSON.stringify(v.ertek)}`);
}

// 7. A paletta minden színe a core-ból jön (nincs a webre csempészett egyedi szín)
const core = new Set(Object.values(T.color).map((c) => c.toUpperCase()));
for (const sz of P.szinek) if (!core.has(sz)) baj(`a paletta olyan színt tartalmaz, ami nincs a core.json-ban: ${sz}`);

// 8. A termékbőr sarkai és keretei egyeznek a palettával (ebből mér a web-ellenőrző)
const egyezik = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
if (!egyezik(P.sarok, [...new Set(Object.values(T.termek.radius))].sort((a, b) => a - b))) baj('a paletta sarok-listája eltér a theme-termek.json-tól');
if (!egyezik(P.keret, [...new Set(Object.values(T.termek.border))].sort((a, b) => a - b))) baj('a paletta keret-listája eltér a theme-termek.json-tól');

// 8/b. A Webflow-ba beilleszthető CSS létezik, friss, és elfér az egyedi kód mezőjében (~10 000 karakter)
const MEZO_MAX = 10000;
for (const f of ['dist/weboldal/beeco-web.css', 'dist/weboldal/beeco-web.min.css']) {
  if (!fs.existsSync(path.join(ROOT, f))) { baj(`hiányzik: ${f}`); continue; }
}
const minCss = fs.existsSync(path.join(ROOT, 'dist/weboldal/beeco-web.min.css'))
  ? fs.readFileSync(path.join(ROOT, 'dist/weboldal/beeco-web.min.css'), 'utf8') : '';
if (minCss.length > MEZO_MAX) baj(`a beeco-web.min.css ${minCss.length} karakter, a Webflow egyedi kód mezője ~${MEZO_MAX} – vegyél ki belőle`);
if (/var\(\s*--bc-/.test(minCss)) baj('a beeco-web.min.css nyers --bc-* hivatkozást tartalmaz; a Webflow-ban a nevek --_beeco-ds---bc-* alakúak');
if (!/@keyframes/.test(minCss)) baj('a beeco-web.min.css nem tartalmaz @keyframes-t – pedig pont ezért van (a Webflow-stílus nem tud ilyet)');

// 8/c. A generált CSS szintaktikailag ép: a nyitó és záró kapcsos zárójelek száma egyezik.
// (Élesben előfordult: a blokkdaraboló `}` mentén vágott, és kettévágta a @media/@keyframes blokkot.)
for (const f of ['dist/weboldal/beeco-web.css', 'dist/weboldal/beeco-web.min.css', 'dist/weboldal/beeco-web-oldal.min.css']) {
  const t = fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), 'utf8') : '';
  if (!t) { baj(`hiányzik: ${f}`); continue; }
  const nyit = (t.match(/\{/g) || []).length, zar = (t.match(/\}/g) || []).length;
  if (nyit !== zar) baj(`${f}: ${nyit} nyitó és ${zar} záró kapcsos zárójel – a CSS csonka`);
}
const oldalCssF = path.join(ROOT, 'dist/weboldal/beeco-web-oldal.min.css');
const oldalLen = fs.existsSync(oldalCssF) ? fs.readFileSync(oldalCssF, 'utf8').length : 0;
if (oldalLen > 4000) baj(`a beeco-web-oldal.min.css ${oldalLen} karakter – az oldal saját CSS-e mellé is be kell férnie a ~10 000-es mezőbe`);

// 9. A nevek a DS saját CSS-ét követik – enélkül a Webflow és a bc-*.css észrevétlenül elcsúszik
const css = fs.readFileSync(path.join(ROOT, 'dist/css/beeco-tokens.css'), 'utf8');
const cssNevek = new Set([...css.matchAll(/--(bc-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
for (const v of V.valtozok) {
  if (!cssNevek.has(v.nev)) baj(`a(z) "${v.nev}" változónév nem szerepel a dist/css/beeco-tokens.css-ben – a Webflow és a DS CSS elcsúszna`);
}

// 8/d. Régi nevek (aliasok): létező szerepre mutatnak, nem ütköznek a szerepek nevével, és nincs köztük lánc
const aliasNevek = new Set();
for (const a of V.aliasok || []) {
  if (!/^bc-[a-z0-9-]+$/.test(a.nev)) baj(`szabálytalan alias-név: "${a.nev}"`);
  if (aliasNevek.has(a.nev)) baj(`kétszer szereplő alias: ${a.nev}`);
  aliasNevek.add(a.nev);
  if (nevek.has(a.nev)) baj(`az alias ("${a.nev}") ütközik egy DS-szerep nevével`);
  if (!nevek.has(a.alias)) baj(`az alias ("${a.nev}") nem létező szerepre mutat: ${a.alias}`);
}

// 8/e. Reszponzív tipó (mobile first): négy lépcső, felfelé nem csökkenhet, a törzs telefonon ≥ 16 px, semmi sem kisebb a minimumnál
const TS = T.typeScale;
if (!TS || !TS.scale) baj('hiányzik a typeScale a dist/tokens.json-ból');
else {
  if (TS.steps.join() !== 'base,sm,md,lg') baj(`a typeScale lépcsői: ${TS.steps.join()} (várt: base,sm,md,lg)`);
  const MIN = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/core.json'), 'utf8')).minTextSize;
  const wfNevek = new Set();
  for (const [n, t] of Object.entries(TS.scale)) {
    if (t.sizes.length !== 4) baj(`typeScale.${n}: ${t.sizes.length} lépcső (négy kell)`);
    for (let i = 1; i < t.sizes.length; i++) if (t.sizes[i] < t.sizes[i - 1]) baj(`typeScale.${n}: a méret felfelé csökken (${t.sizes.join(' → ')}) – mobile first: az alap a legkisebb`);
    if (n !== 'icon' && Math.min(...t.sizes) < MIN) baj(`typeScale.${n}: ${Math.min(...t.sizes)} px a minimum (${MIN}) alatt`);
    if (['body', 'lead', 'article'].includes(n) && t.sizes[0] < 16) baj(`typeScale.${n}: telefonon ${t.sizes[0]} px – a törzsszöveg legalább 16`);
    if (wfNevek.has(t.webflow)) baj(`typeScale: kétszer szereplő Webflow-név: ${t.webflow}`);
    wfNevek.add(t.webflow);
  }
  const tipo = V.tipografia || { valtozok: [] };
  if (tipo.valtozok.length !== Object.keys(TS.scale).length) baj('a webflow-valtozok.json tipografia listája nem egyezik a typeScale-lel');
  for (const v of tipo.valtozok) {
    const t = TS.scale[v.ds];
    if (!t) { baj(`tipografia: ismeretlen DS-név ${v.ds}`); continue; }
    const vart = { 'Mobil': t.sizes[0], 'Mobil fekvő': t.sizes[1], 'Tablet': t.sizes[2], 'Base mode': t.sizes[3] };
    for (const [mod, px] of Object.entries(vart)) if (!v.ertekek[mod] || v.ertekek[mod].value !== px) baj(`tipografia ${v.nev} / ${mod}: ${v.ertekek[mod] && v.ertekek[mod].value} ≠ ${px}`);
  }
  for (const n of Object.keys(TS.scale)) if (!cssNevek.has(`bc-type-${n}`)) baj(`a bc-type-${n} nincs a dist/css/beeco-tokens.css-ben`);
}

// 9. A dokumentáció megvan
if (!fs.existsSync(path.join(ROOT, 'docs/weboldal.md'))) baj('hiányzik a docs/weboldal.md');

// 10. Az élő oldal ellenőrzője és a web-mérés megvan és betölthető
for (const f of ['tools/web-ellenor.js', 'tools/web/oldal-meres-web.js']) {
  if (!fs.existsSync(path.join(ROOT, f))) { baj(`hiányzik: ${f}`); continue; }
}
try {
  const m = require(path.join(ROOT, 'tools/web/oldal-meres-web.js'));
  if (typeof m !== 'function') baj('a tools/web/oldal-meres-web.js nem függvényt exportál (a page.evaluate így nem tudja futtatni)');
} catch (e) { baj(`a tools/web/oldal-meres-web.js nem tölthető be: ${e.message}`); }

if (hibak.length) {
  console.error(`✗ check-weboldal: ${hibak.length} hiba`);
  hibak.forEach((h) => console.error(`  · ${h}`));
  process.exit(1);
}
console.log(`✓ weboldal rendben (${V.valtozok.length} Webflow-változó, ${(V.aliasok || []).length} alias, ${(V.tipografia || { valtozok: [] }).valtozok.length} tipó-változó, ${P.szinek.length} szín, ${Object.keys(T.termek.light).length} szerep, beillesztendő CSS ${minCss.length} karakter)`);
