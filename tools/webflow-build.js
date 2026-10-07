#!/usr/bin/env node
/* ============================================================
   webflow-build – a WEBFLOW-réteg generálása a tokenekből (docs/weboldal.md)

   A beeco.hu Webflow-ban készül, ezért nem tud `npm install`-lal DS-t húzni: a tokeneket
   Webflow-VÁLTOZÓKKÉNT kell felvinni. Ez a szkript állítja elő azt a listát, amiből a
   Webflow MCP felviszi őket, és amihez a `tests/check-weboldal.js` méri a valóságot.

   Kimenet (generált, kézzel SOHA):
     dist/weboldal/webflow-valtozok.json   a Webflow „beeco DS” változó-kollekció teljes tartalma
     dist/weboldal/paletta.json            a megengedett értékek listája a web-ellenőrzőnek
     dist/weboldal/beeco-web.css           a Webflow-ba BEILLESZTHETŐ CSS: amit a Webflow-stílus nem tud
                                           (@keyframes, mozgás, méhsejt-háttér). A DS forrásából generálva.

   Használat: node tools/webflow-build.js [--check]
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/tokens.json'), 'utf8'));
const check = process.argv.includes('--check');

// A termékbőr szerepei a core primitívekre mutatnak; ha már feloldott hexet kapunk, azt hagyjuk.
const hex = (v) => (typeof v === 'string' && v.startsWith('#') ? v.toUpperCase() : (T.color[v] || v).toUpperCase());

// Webflow-változónév: csak ASCII, kötőjeles, `bc-` előtaggal – az ékezetes nevek CSS-ben törékenyek.
const valtozok = [];
const szin = (nev, light, dark) => valtozok.push({ nev, tipus: 'Color', ertek: hex(light), sotet: dark === undefined ? null : hex(dark) });
const meret = (nev, px) => valtozok.push({ nev, tipus: 'Size', ertek: { value: px, unit: 'px' }, sotet: null });

// 1. Szín-szerepek (világos alap + sötét mód) – a szerepnevek a theme-termek.json-ból jönnek,
//    így új szerep felvétele itt automatikusan megjelenik a Webflow-listában is.
for (const szerep of Object.keys(T.termek.light)) {
  szin(`bc-${szerep}`, T.termek.light[szerep], T.termek.dark[szerep]);
}

// 2. Sarok, keret – a NEVEK a DS saját CSS-ét követik (dist/css/beeco-tokens.css: --bc-r-*, --bc-bw-*),
//    hogy aki a bc-*.css-t olvassa, a Webflow-ban ugyanazt a nevet találja.
for (const [k, v] of Object.entries(T.termek.radius)) meret(`bc-r-${k}`, v);
for (const [k, v] of Object.entries(T.termek.border)) meret(`bc-bw-${k}`, v);

// 3. Árnyék – kemény, átlós, elmosás nélkül. A Webflow-ban nincs „árnyék” változótípus,
//    ezért az eltolást méretként visszük fel, és az osztály rakja össze (x y 0 0 var(--bc-shadow)).
for (const [k, [x, y]] of Object.entries(T.termek.shadow)) {
  if (k.startsWith('_')) continue;
  meret(`bc-shadow-${k}-x`, x);
  meret(`bc-shadow-${k}-y`, y);
}

// 4. Térköz, betűméret és a minimális érintési felület
for (const [k, v] of Object.entries(T.space)) meret(`bc-sp-${k}`, v);
for (const [k, v] of Object.entries(T.fontSize)) meret(`bc-fs-${k}`, v);
meret('bc-tap', 44);   // a legkisebb érintési felület – a Designerben is kéznél kell legyen

const ki = {
  _readme: 'GENERÁLT (tools/webflow-build.js) – kézzel ne szerkeszd. Ez a Webflow „beeco DS” változó-kollekció teljes tartalma. A `sotet` mező a kollekció „Sötét” módjának értéke (null = nincs külön sötét érték).',
  kollekcio: 'beeco DS',
  modok: ['Base mode', 'Sötét'],
  valtozok,
};

// A web-ellenőrzőnek: mi számít megengedett értéknek egy élő oldalon.
const paletta = {
  _readme: 'GENERÁLT – a weboldalon megengedett nyers értékek. A `tools/web-ellenor.js` ehhez méri a futásidejű CSS-t.',
  szinek: [...new Set([...Object.values(T.color).map((c) => c.toUpperCase()), ...valtozok.filter((v) => v.tipus === 'Color').flatMap((v) => [v.ertek, v.sotet]).filter(Boolean)])].sort(),
  sarok: [...new Set(Object.values(T.termek.radius))].sort((a, b) => a - b),
  keret: [...new Set(Object.values(T.termek.border))].sort((a, b) => a - b),
  betuMeret: Object.values(T.fontSize).sort((a, b) => a - b),
  betuCsalad: { display: T.font.display[0], body: T.font.body[0] },
  betuVastagsag: Object.values(T.fontWeight),
  // A termékbőrben az árnyék kemény és átlós (elmosás 0). EGYETLEN kivétel a --bc-shadow-soft,
  // amit a nem kattintható kártyák kapnak; ezt az elmosás-értékével engedjük át az ellenőrzőn.
  arnyekElmosas: 0,
  arnyekElmosasKivetel: [28],
  idotartamMax: T.duration.slow,
  gorbe: T.easing.out,
};

// --- A Webflow-ba beilleszthető CSS -----------------------------------------
// A Webflow-stílus nem tud @keyframes-t, pszeudoelemet és maszkot, ezért ezek a részek
// az oldal fej-kódjába kerülnek. A forrás a DS saját CSS-e: itt csak a változóneveket
// írjuk át a Webflow alakjára (--bc-ink  ->  --_beeco-ds---bc-ink), hogy ne legyen másolat.
const WF = (nev) => `var(--_beeco-ds---${nev})`;
const atir = (css) => css.replace(/var\(\s*--(bc-[a-z0-9-]+)\s*\)/g, (_, n) => WF(n));

// Legfelső szintű CSS-blokkokra bont. NEM `}` mentén vágunk: az kettévágná a @media és a
// @keyframes blokkot (élesben kiderült: a kimenet szintaktikailag hibás lett).
function blokkok(css) {
  const ki = []; let melyseg = 0, kezd = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '{') melyseg++;
    else if (c === '}') { melyseg--; if (melyseg === 0) { ki.push(css.slice(kezd, i + 1).trim()); kezd = i + 1; } }
  }
  const marad = css.slice(kezd).trim();
  if (marad) ki.push(marad);
  return ki.filter(Boolean);
}

function reszlet(rel, szuro) {
  const txt = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (!szuro) return txt;
  // Csak azok a szabályok, amelyek a szűrőre illeszkednek (a logó pl. relatív képre mutat, az nem kell)
  return blokkok(txt).filter((b) => szuro.test(b)).join('\n');
}

const webCss = [
  `/* GENERÁLT (tools/webflow-build.js) a beeco design system forrásából (verzió: dist/tokens.json) – kézzel NE szerkeszd.`,
  `   Ez a blokk a Webflow oldal- vagy site-fejkódjába megy. Azt tartalmazza, amit a Webflow-stílus`,
  `   nem tud kifejezni: @keyframes, mozgás-osztályok, méhsejt-háttér maszkkal.`,
  `   A tokenekre a "beeco DS" változókollekció nevein hivatkozik (--_beeco-ds---bc-*).`,
  `   Frissítés: node tools/webflow-build.js, majd a tartalom bemásolása. */`,
  '',
  '/* ---- mozgás-készlet (termek/css/bc-motion.css) ---- */',
  atir(reszlet('termek/css/bc-motion.css')),
  '',
  '/* ---- méhsejt-háttér és évszakos díszítés (termek/css/bc-marka.css) ---- */',
  atir(reszlet('termek/css/bc-marka.css', /honeycomb/)),
  '',
  '/* ---- a nyilvános weboldal mozgása (termek/css/bc-web.css) ---- */',
  atir(reszlet('termek/css/bc-web.css', /bc-web-erkezes|bc-web-zum|bc-sticker|bc-web-in|is-framed|is-tilt|prefers-reduced-motion/)),
  '',
].join('\n');

// A Webflow egyedi kód mezője ~10 000 karakter, ezért a beillesztendő változat tömörített,
// és az évszakos díszítés (önmagában ~11 kB adat-URI) kimarad belőle: az külön kérésre kerül be.
const tomorit = (css) => css
  .split('\n').filter((sor) => !sor.includes('data-evszak')).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')          // kommentek
  .replace(/\s*\n\s*/g, '')                   // sortörés és behúzás
  .replace(/\s*([{}:;,>])\s*/g, '$1')          // felesleges szóköz a jelek körül
  .replace(/;}/g, '}')
  .trim();

const webMin = `/* beeco DS – web (generált, tools/webflow-build.js). Évszakos díszítés nélkül. */\n` + tomorit(webCss);

// OLDAL-PROFIL: egy Webflow-oldal fej-kódjába az oldal saját CSS-e MELLÉ is be kell férni, ezért
// a teljes készlet helyett csak a marketingoldalon ténylegesen használt mozgás megy ki.
// A többi (bc-hexload, bc-tab-ink, bc-dragging, méhsejt-háttér) akkor jön, ha egy oldalnak kell.
const OLDAL_KELL = /bc-buzz|bc-rise|bc-stamp|bc-web-erkezes|bc-web-zum|bc-sticker|bc-web-in|bc-stagger|bc-lift|is-framed|is-tilt|prefers-reduced-motion/;
const oldalCss = [
  `/* beeco DS – web, OLDAL-PROFIL (generált). Csak a marketingoldalon használt mozgás.`,
  `   A teljes készlet: dist/weboldal/beeco-web.css. Frissítés: node tools/webflow-build.js */`,
  ...blokkok(webCss).filter((b) => OLDAL_KELL.test(b) && !/honeycomb/.test(b)),
].join('\n');
const oldalMin = `/* beeco DS – web, oldal-profil (generált) */\n` + tomorit(oldalCss);

const fajlok = {
  'dist/weboldal/webflow-valtozok.json': JSON.stringify(ki, null, 2) + '\n',
  'dist/weboldal/paletta.json': JSON.stringify(paletta, null, 2) + '\n',
  'dist/weboldal/beeco-web.css': webCss,
  'dist/weboldal/beeco-web.min.css': webMin + '\n',
  'dist/weboldal/beeco-web-oldal.min.css': oldalMin + '\n',
};

let elteres = 0;
for (const [rel, tartalom] of Object.entries(fajlok)) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const regi = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (regi === tartalom) continue;
  if (check) { console.error(`webflow-build: a ${rel} nem friss – futtasd: node tools/webflow-build.js`); elteres++; continue; }
  fs.writeFileSync(p, tartalom);
  console.log(`webflow-build: ${rel} (${rel.endsWith('valtozok.json') ? valtozok.length + ' változó' : rel.endsWith('.css') ? Math.round(tartalom.length / 1024) + ' kB' : paletta.szinek.length + ' szín'})`);
}
if (elteres) process.exit(1);
if (check) console.log('webflow-build: a dist/weboldal friss');
