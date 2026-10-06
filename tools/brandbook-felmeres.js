#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – a hat felület felmérése (Javaslat 22)

   node tools/brandbook-felmeres.js --forras ~/CLAUDE           → frissíti a brandbook/feluletek/*.json mért értékeit
   node tools/brandbook-felmeres.js --forras ~/CLAUDE --check   → csak jelez, ha a forrás eltér a mentett profiltól

   HELYBEN fut (a termék-repók a gépen vannak, a Netlify-build nem látja őket). A kézzel írt részekhez (kinek, mi közös,
   mi szándékos, cél) nem nyúl – csak a mért értékeket és a felmérés dátumát írja: `felmeres.mert`, a DS-verzió a szövegekben,
   az app színeinek száma, a Kaptár mintájának színei. Ha egy forrás nincs meg, kihagyja és szól.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
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
    const s = olvas('beeco-hr/src/index.css'); if (!s) { figyel.push('nincs meg: beeco-hr/src/index.css'); return null; }
    const tema = (s.match(/@theme\s*{([\s\S]*?)\n}/) || [])[1] || '', sotetBlokk = (s.match(/\[data-theme="dark"\]\s*{([\s\S]*?)}/) || [])[1] || '';
    const v = (blokk, n) => { const m = blokk.match(new RegExp(`--color-beeco-${n}:\\s*(#[0-9a-fA-F]{3,8})`)); return m ? m[1].toUpperCase() : null; };
    return { zold: v(tema, 'green'), zold_sotet: v(tema, 'green-dark'), mez: v(tema, 'honey'), krem: v(tema, 'cream'), kartya: v(tema, 'card'), tinta: v(tema, 'ink'), vonal: v(tema, 'line'), vonal_eros: v(tema, 'line-strong'),
      sotet: { krem: v(sotetBlokk, 'cream'), kartya: v(sotetBlokk, 'card'), tinta: v(sotetBlokk, 'ink'), vonal: v(sotetBlokk, 'line') }, ds_kapcsolat: /@beeco\/design-system|beeco-tokens\.css|termek\.css/.test(s) };
  },
  web() { const p = path.join(ROOT, 'dist/weboldal/webflow-valtozok.json'); if (!fs.existsSync(p)) return null; const j = JSON.parse(fs.readFileSync(p, 'utf8')); const n = (j.valtozok || j.variables || j).length || Object.keys(j.valtozok || j).length; return { webflow_valtozok: n }; },
  jatek() { const s = fs.readFileSync(path.join(ROOT, 'web/css/tokens.css'), 'utf8'); return { sarkok: [...s.matchAll(/--r-(s|m|l|xl):\s*(\d+)px/g)].map(m => +m[2]) }; },
};

let valtozott = 0;
for (const id of Object.keys(meresek)) {
  const file = path.join(DIR, `${id}.json`);
  const f = JSON.parse(fs.readFileSync(file, 'utf8'));
  const m = meresek[id]();
  if (!m) continue;
  const regi = JSON.stringify(f.felmeres && f.felmeres.mert);
  if (regi === JSON.stringify(m)) continue;
  valtozott++;
  console.log(`${id}: ${regi || '(új)'} → ${JSON.stringify(m)}`);
  if (CHECK) continue;
  // a mért értékek visszaírása a szövegekbe
  if (m.ds_verzio) {
    const cser = s => s.replace(/#v\d+\.\d+\.\d+/g, `#v${m.ds_verzio}`).replace(/a DS `\d+\.\d+\.[\dx]+`/g, `a DS \`${DS}\``);
    f.ertekek.ds.ertek = cser(f.ertekek.ds.ertek); f.cel = (f.cel || []).map(cser);
    f.ertekek.ds.jel = m.ds_verzio === DS ? 'kozos' : 'reszben';
  }
  if (id === 'app') {
    f.ertekek.ds.ertek = f.ertekek.ds.ertek.replace(/\(\d+ szín\)/, `(${m.szinek} szín)`);
    f.ertekek.sarok.ertek = f.ertekek.sarok.ertek.replace(/^\d+–\d+ px/, `${m.sarok_min}–${m.sarok_max} px`);
    if (m.sotet_mod) { f.ertekek.sotet = { ertek: 'van', jel: 'kozos', forras: 'lib/ (darkTheme)' }; f.minta.nincsSotet = false; }
  }
  if (id === 'kaptar') {
    Object.assign(f.minta.ertekek, { bg: m.krem, surface: m.kartya, ink: m.tinta, line: m.vonal, btnBg: m.zold_sotet, btn2Border: `1px solid ${m.vonal_eros}`, inputBorder: `1px solid ${m.vonal_eros}`,
      bgDark: m.sotet.krem, surfaceDark: m.sotet.kartya, inkDark: m.sotet.tinta, lineDark: m.sotet.vonal });
    if (m.ds_kapcsolat) figyel.push('kaptar: a forrásban DS-hivatkozás van – nézd át kézzel a „Kapcsolat a DS-sel” cellát');
  }
  f.felmeres = { ...f.felmeres, datum: ma, mert: m };
  fs.writeFileSync(file, JSON.stringify(f, null, 1) + '\n');
}
for (const s of figyel) console.warn('figyelem: ' + s);
if (CHECK && valtozott) { console.error(`${valtozott} felület forrása eltér a mentett profiltól – futtasd --check nélkül, és nézd át a változást.`); process.exit(1); }
console.log(valtozott ? `${valtozott} profil frissítve (${ma}).` : 'a felületek profilja friss');
