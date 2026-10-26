// ============================================================
//  GRAFIKA-BUILD – a grafikai katalógus generált részei (Javaslat 28, 2. lépés) → grafika/gen/*.json
//  Miért: a kódból rajzolt matricák (ART), az ikonok és a kétszínű jelek metaadata már a saját forrásukban él
//  (web/js/art/*.js, termek/ikonok/ikonok.json, termek/jelek/jelek.json). A katalógus ezekből generálódik, nem kézzel.
//  A kézzel gondozott rész (méhek, madarak, díszletek, logó) a grafika/katalogus.json.
//  node tools/grafika-build.js          → megírja a grafika/gen/ fájlokat
//  node tools/grafika-build.js --check  → csak ellenőriz (a tests/check-grafika.js is ezt hívja); 1-es kóddal áll le, ha elavult
// ============================================================
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'grafika/gen');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

function art() {
  const DIR = path.join(ROOT, 'web/js/art');
  global.ART = require(path.join(DIR, 'art.js'));
  for (const f of fs.readdirSync(DIR).filter(f => /^art-.+\.js$/.test(f) && f !== 'art-index.js').sort()) require(path.join(DIR, f));
  return Object.values(ART.LIB).map(a => ({
    id: 'art-' + a.name.replace(/_/g, '-'), family: 'art', hu: a.hu || '', en: a.en || '',
    forbidden: false, license: 'beeco-marka',
    origin: { kind: 'kod', source: `web/js/art/art-${a.lib}.js` },
    aliases: { art: a.name },
    ...(a.emoji && a.emoji.length ? { emoji: a.emoji } : {}),
    outputs: ['web'], status: 'aktiv',
  }));
}

// add.svg → "Add", arrow-down → "Arrow down" (az angol név a fájlnévből; a fájlnév már angol)
const emberi = n => { const t = n.replace(/\.svg$/, '').replace(/-/g, ' '); return t[0].toUpperCase() + t.slice(1); };

function ikonok() {
  const flutter = 'icons/';
  return JSON.parse(rd('termek/ikonok/ikonok.json')).ikonok.map(i => ({
    id: 'icon-' + i.fajl.replace(/\.svg$/, ''), family: 'icon', hu: i.leiras, en: emberi(i.fajl),
    forbidden: false, license: 'beeco-marka',
    origin: { kind: 'kod', source: 'termek/ikonok/ikonok.json' },
    aliases: { web: 'termek/ikonok/' + i.fajl, react: i.export, flutter: flutter + i.fajl },
    outputs: ['web', 'flutter'], status: 'aktiv',
  }));
}

function jelek() {
  return JSON.parse(rd('termek/jelek/jelek.json')).jelek.map(j => ({
    id: 'sticker-' + j.nev, family: 'sticker', hu: j.leiras, en: emberi(j.nev.replace(/^pik-/, '')),
    forbidden: false, license: 'beeco-marka',
    origin: { kind: 'figma', source: j.forras },
    aliases: { web: 'termek/jelek/' + j.fajl, flutter: 'stickers/' + j.fajl },
    outputs: ['web', 'flutter'], status: 'aktiv',
  }));
}

const fejlec = forras => `GENERÁLT FÁJL – ne szerkeszd kézzel: node tools/grafika-build.js (forrás: ${forras}). Mezők: grafika/README.md.`;
const kimenet = {
  'art.json': { _readme: fejlec('web/js/art/*.js'), items: art() },
  'ikonok.json': { _readme: fejlec('termek/ikonok/ikonok.json'), items: ikonok() },
  'jelek.json': { _readme: fejlec('termek/jelek/jelek.json'), items: jelek() },
};

const check = process.argv.includes('--check');
let elavult = [];
for (const [f, tartalom] of Object.entries(kimenet)) {
  const szoveg = JSON.stringify(tartalom, null, 1) + '\n';
  const hely = path.join(OUT, f);
  const most = fs.existsSync(hely) ? fs.readFileSync(hely, 'utf8') : '';
  if (check) { if (most !== szoveg) elavult.push(f); continue; }
  fs.mkdirSync(OUT, { recursive: true });
  if (most !== szoveg) fs.writeFileSync(hely, szoveg);
}
if (check) {
  if (elavult.length) { console.log(`grafika-build: elavult a grafika/gen/ (${elavult.join(', ')}) – futtasd: node tools/grafika-build.js`); process.exit(1); }
  console.log('grafika-build: a grafika/gen/ friss');
} else {
  console.log('grafika-build: ' + Object.entries(kimenet).map(([f, t]) => `${f} ${t.items.length}`).join(', '));
}
