#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – a hat felület felmérése (Javaslat 22; a Brand Book az új motorra állt át, 25. javaslat)

   node tools/brandbook-felmeres.js --forras ~/CLAUDE        → CSAK OLVAS: kiírja, mi tér el a brandbook/feluletek/*.json mentett mért értékeitől
   node tools/brandbook-felmeres.js --forras ~/CLAUDE --check → ugyanez, de eltérésnél 1-es kilépési kóddal áll meg
   node tools/brandbook-felmeres.js --forras ~/CLAUDE --ir    → a mért értékeket és a felmérés dátumát vissza is írja a profilokba

   HELYBEN fut (a termék-repók a gépen vannak, a Netlify-build nem látja őket). A kézzel írt részekhez (kinek, mi közös,
   mi szándékos, cél) nem nyúl; --ir nélkül semmit nem ír. Mért érték: `felmeres.mert`, a DS-verzió a szövegekben
   (admin, partner, Kaptár), az app színeinek száma. Kaptár: a DS-verzió a package.json-ból, az importált bc-*.css fájlok
   a src/index.css-ből (a termek/css/bc-all.css sorrendjéhez képest), a nyers színek száma. Ha egy forrás nincs meg vagy
   olvashatatlan, az a felület kimarad, és szól – kivétel nem száll el.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const IR = args.includes('--ir');
const fi = args.indexOf('--forras');
const FORRAS = path.resolve((fi >= 0 ? args[fi + 1] : '~/CLAUDE').replace(/^~/, os.homedir()));
const DIR = path.join(ROOT, 'brandbook', 'feluletek');
const ma = new Date().toISOString().slice(0, 10);
const DS = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
const olvas = rel => { const p = path.join(FORRAS, rel); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const figyel = [];

function dsVerzio(rel) {
  const s = olvas(rel); if (!s) { figyel.push(`nincs meg: ${rel}`); return null; }
  const m = s.match(/"@beeco\/design-system":\s*"[^"#]*#v?([\d.]+)"/); return m ? m[1] : null;
}
const meresek = {
  admin() { const v = dsVerzio('beeco_ADMIN_APP/beeco-admin/package.json'); return v && { ds_verzio: v }; },
  partner() { const v = dsVerzio('beeco_partner_app/beeco-partner/package.json'); return v && { ds_verzio: v }; },
  app() {
    const c = olvas('beeco_MOBILE_APP/mobile-app/lib/presentation/theme/app_colors.dart');
    const u = olvas('beeco_MOBILE_APP/mobile-app/lib/presentation/utils/ui_constants.dart');
    if (!c || !u) { figyel.push('nincs meg: a mobil app színei vagy UI-állandói'); return null; }
    const szinek = (c.match(/static const \w+ = Color\(/g) || []).length;
    const sarkok = [...u.matchAll(/Radius\.circular\((\d+)\)/g)].map(m => +m[1]);
    const lib = path.join(FORRAS, 'beeco_MOBILE_APP/mobile-app/lib');
    let sotet = false;
    const bejar = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) bejar(p); else if (f.name.endsWith('.dart') && /darkTheme\s*:|ThemeMode\.dark/.test(fs.readFileSync(p, 'utf8'))) sotet = true; } };
    if (fs.existsSync(lib)) bejar(lib);
    return { szinek, sarok_min: Math.min(...sarkok), sarok_max: Math.max(...sarkok), sotet_mod: sotet };
  },
  kaptar() {
    // termékbőr: DS-git-függőség a package.json-ban, a DS fájljai egyenként importálva a src/index.css-ben
    const v = dsVerzio('beeco-hr/package.json');
    const s = olvas('beeco-hr/src/index.css'); if (!s) { figyel.push('nincs meg: beeco-hr/src/index.css'); return v ? { ds_verzio: v } : null; }
    const kod = s.replace(/\/\*[\s\S]*?\*\//g, '');
    const bc = [...kod.matchAll(/@import\s+["']@beeco\/design-system\/(?:termek|css)\/(bc-[\w-]+\.css)["']/g)].map(m => m[1]);
    const all = fs.readFileSync(path.join(ROOT, 'termek/css/bc-all.css'), 'utf8');
    const vart = [...all.matchAll(/@import\s+url\("\.\/(bc-[\w-]+\.css)"\)/g)].map(m => m[1]);
    const hianyzo = vart.filter(f => !bc.includes(f));
    const nyers = (kod.replace(/var\([^)]*\)/g, '').match(/#[0-9a-fA-F]{3,8}\b/g) || []).length;
    if (!bc.length) figyel.push('kaptar: a src/index.css-ben nincs bc-*.css import – a szerkezet változott, nézd át a mérést');
    if (hianyzo.length) figyel.push(`kaptar: a bc-all.css-ben van, de a Kaptár nem importálja: ${hianyzo.join(', ')}`);
    return { ds_verzio: v, bc_importok: bc.length, nyers_szin: nyers, ds_kapcsolat: /@beeco\/design-system/.test(s) };
  },
  web() { const p = path.join(ROOT, 'dist/weboldal/webflow-valtozok.json'); if (!fs.existsSync(p)) return null; const j = JSON.parse(fs.readFileSync(p, 'utf8')); const n = (j.valtozok || j.variables || j).length || Object.keys(j.valtozok || j).length; return { webflow_valtozok: n }; },
  jatek() { const s = fs.readFileSync(path.join(ROOT, 'web/css/tokens.css'), 'utf8'); return { sarkok: [...s.matchAll(/--r-(s|m|l|xl):\s*(\d+)px/g)].map(m => +m[2]) }; },
};

let valtozott = 0;
for (const id of Object.keys(meresek)) {
  const file = path.join(DIR, `${id}.json`);
  let f, m;
  try { f = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { figyel.push(`${id}: a profil nem olvasható (${e.message})`); continue; }
  try { m = meresek[id](); } catch (e) { figyel.push(`${id}: a mérés elbukott, kihagyva (${e.message})`); continue; }
  if (!m) continue;
  const regi = JSON.stringify(f.felmeres && f.felmeres.mert);
  if (regi === JSON.stringify(m)) continue;
  valtozott++;
  console.log(`${id}: ${regi || '(új)'} → ${JSON.stringify(m)}`);
  if (!IR) continue;
  // a mért értékek visszaírása a szövegekbe
  if (m.ds_verzio && f.ertekek && f.ertekek.ds) {
    const cser = s => s.replace(/#v\d+\.\d+\.\d+/g, `#v${m.ds_verzio}`).replace(/a DS `\d+\.\d+\.[\dx]+`/g, `a DS \`${DS}\``);
    f.ertekek.ds.ertek = cser(f.ertekek.ds.ertek); f.cel = (f.cel || []).map(cser);
    f.ertekek.ds.jel = m.ds_verzio === DS ? 'kozos' : 'reszben';
  }
  if (id === 'app' && f.ertekek) {
    if (f.ertekek.ds) f.ertekek.ds.ertek = f.ertekek.ds.ertek.replace(/\(\d+ szín\)/, `(${m.szinek} szín)`);
    if (f.ertekek.sarok) f.ertekek.sarok.ertek = f.ertekek.sarok.ertek.replace(/^\d+–\d+ px/, `${m.sarok_min}–${m.sarok_max} px`);
    if (m.sotet_mod) { f.ertekek.sotet = { ertek: 'van', jel: 'kozos', forras: 'lib/ (darkTheme)' }; if (f.minta) f.minta.nincsSotet = false; }
  }
  f.felmeres = { ...f.felmeres, datum: ma, mert: m };
  fs.writeFileSync(file, JSON.stringify(f, null, 1) + '\n');
}
for (const s of figyel) console.warn('figyelem: ' + s);
if (CHECK && valtozott) { console.error(`${valtozott} felület forrása eltér a mentett profiltól – futtasd --ir kapcsolóval, és nézd át a változást.`); process.exit(1); }
console.log(valtozott ? (IR ? `${valtozott} profil frissítve (${ma}).` : `${valtozott} felület eltér a mentett profiltól (csak olvasás; írás: --ir).`) : 'a felületek profilja friss');
