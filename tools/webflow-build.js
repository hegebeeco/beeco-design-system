#!/usr/bin/env node
/* ============================================================
   webflow-build – a WEBFLOW-réteg generálása a tokenekből (docs/weboldal.md)

   A beeco.hu Webflow-ban készül, ezért nem tud `npm install`-lal DS-t húzni: a tokeneket
   Webflow-VÁLTOZÓKKÉNT kell felvinni. Ez a szkript állítja elő azt a listát, amiből a
   Webflow MCP felviszi őket, és amihez a `tests/check-weboldal.js` méri a valóságot.

   Kimenet (generált, kézzel SOHA):
     dist/weboldal/webflow-valtozok.json   a Webflow „beeco DS” változó-kollekció teljes tartalma
     dist/weboldal/paletta.json            a megengedett értékek listája a web-ellenőrzőnek

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

// 2. Sarok, keret – a termékbőr saját értékei (2 · 4 · 8 · 12 · kapszula, 1 és 2 px keret)
for (const [k, v] of Object.entries(T.termek.radius)) meret(`bc-radius-${k}`, v);
for (const [k, v] of Object.entries(T.termek.border)) meret(`bc-border-${k}`, v);

// 3. Árnyék – kemény, átlós, elmosás nélkül. A Webflow-ban nincs „árnyék” változótípus,
//    ezért az eltolást méretként visszük fel, és az osztály rakja össze (x y 0 0 var(--bc-shadow)).
for (const [k, [x, y]] of Object.entries(T.termek.shadow)) {
  if (k.startsWith('_')) continue;
  meret(`bc-shadow-${k}-x`, x);
  meret(`bc-shadow-${k}-y`, y);
}

// 4. Térköz és betűméret – a 4 px rács és a 7 fokozatú skála
for (const [k, v] of Object.entries(T.space)) meret(`bc-space-${k}`, v);
for (const [k, v] of Object.entries(T.fontSize)) meret(`bc-text-${k}`, v);

const ki = {
  _readme: 'GENERÁLT (tools/webflow-build.js) – kézzel ne szerkeszd. Ez a Webflow „beeco DS” változó-kollekció teljes tartalma. A `sotet` mező a kollekció „Sötét” módjának értéke (null = nincs külön sötét érték).',
  version: T.version,
  kollekcio: 'beeco DS',
  modok: ['Base mode', 'Sötét'],
  valtozok,
};

// A web-ellenőrzőnek: mi számít megengedett értéknek egy élő oldalon.
const paletta = {
  _readme: 'GENERÁLT – a weboldalon megengedett nyers értékek. A `tools/web-ellenor.js` ehhez méri a futásidejű CSS-t.',
  version: T.version,
  szinek: [...new Set([...Object.values(T.color).map((c) => c.toUpperCase()), ...valtozok.filter((v) => v.tipus === 'Color').flatMap((v) => [v.ertek, v.sotet]).filter(Boolean)])].sort(),
  sarok: [...new Set(Object.values(T.termek.radius))].sort((a, b) => a - b),
  keret: [...new Set(Object.values(T.termek.border))].sort((a, b) => a - b),
  betuMeret: Object.values(T.fontSize).sort((a, b) => a - b),
  betuCsalad: { display: T.font.display[0], body: T.font.body[0] },
  betuVastagsag: Object.values(T.fontWeight),
  arnyekElmosas: 0,
  idotartamMax: T.duration.slow,
  gorbe: T.easing.out,
};

const fajlok = {
  'dist/weboldal/webflow-valtozok.json': JSON.stringify(ki, null, 2) + '\n',
  'dist/weboldal/paletta.json': JSON.stringify(paletta, null, 2) + '\n',
};

let elteres = 0;
for (const [rel, tartalom] of Object.entries(fajlok)) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const regi = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (regi === tartalom) continue;
  if (check) { console.error(`webflow-build: a ${rel} nem friss – futtasd: node tools/webflow-build.js`); elteres++; continue; }
  fs.writeFileSync(p, tartalom);
  console.log(`webflow-build: ${rel} (${rel.endsWith('valtozok.json') ? valtozok.length + ' változó' : paletta.szinek.length + ' szín'})`);
}
if (elteres) process.exit(1);
if (check) console.log('webflow-build: a dist/weboldal friss');
