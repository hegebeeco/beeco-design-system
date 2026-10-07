#!/usr/bin/env node
/* ============================================================
   check-egy – gyors kör EGY komponensre (docs/ai-munkamod.md 1.)
     npm run check:egy -- utvonal          (tesztlap neve)
     npm run check:egy -- TextField        (komponensnév → a tesztlap(ok), ahol a legtöbbet szerepel; legfeljebb 2)
     npm run check:egy -- utvonal --teljes (mind a 8 nézet, nem csak 2)   · --tipus (tsc is)
   Lépések: tokens-build (ha a tokenek változtak) → csak az érintett tesztlap esbuild-je → check-komponensek <lap> --gyors.
   A dist/react-ot és a tsc-t kihagyja – ezek a végén, egyszer: npm run build && npm test.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const cel = args.find((a) => !a.startsWith('--'));
const DIR = path.join(ROOT, 'react/tesztlapok');
const lapok = fs.readdirSync(DIR).filter((f) => f.endsWith('.tsx') && !f.startsWith('_')).map((f) => f.replace(/\.tsx$/, '')).sort();
if (!cel) { console.log(`Használat: npm run check:egy -- <tesztlap | Komponens>\nTesztlapok: ${lapok.join(' ')}`); process.exit(2); }

let valasztott;
if (lapok.includes(cel)) valasztott = [cel];
else {
  const re = new RegExp(`\\b${cel.replace(/[^\w]/g, '')}\\b`, 'g');
  const talalat = lapok.map((l) => ({ l, n: (fs.readFileSync(path.join(DIR, `${l}.tsx`), 'utf8').match(re) || []).length })).filter((x) => x.n).sort((a, b) => b.n - a.n);
  if (!talalat.length) { console.log(`Nincs „${cel}” nevű tesztlap, és egyik tesztlap sem használja. Tesztlapok: ${lapok.join(' ')}`); process.exit(2); }
  valasztott = talalat.slice(0, 2).map((x) => x.l);
  console.log(`„${cel}” → tesztlap: ${valasztott.join(', ')}${talalat.length > 2 ? ` (még ${talalat.length - 2} lapon szerepel; a végén a teljes npm test mindet futtatja)` : ''}`);
}

const t0 = Date.now();
const fut = (cmd, a) => execFileSync(process.execPath, [path.join(ROOT, cmd), ...a], { cwd: ROOT, stdio: 'inherit' });
try {
  fut('tools/tokens-build.js', []);
  fut('tools/react-build.js', ['--csak', valasztott.join(',')]);
  if (args.includes('--tipus')) execFileSync(path.join(ROOT, 'node_modules/.bin/tsc'), ['-p', path.join(ROOT, 'react/tsconfig.tesztlap.json')], { stdio: 'inherit' });
  const t1 = Date.now();
  fut('tests/check-komponensek.js', [...valasztott, ...(args.includes('--teljes') ? [] : ['--gyors'])]);
  console.log(`check:egy: rendben – építés ${((t1 - t0) / 1000).toFixed(1)} s, teszt ${((Date.now() - t1) / 1000).toFixed(1)} s. A végén egyszer: npm run build && npm test`);
} catch {
  console.log(`check:egy: HIBA (${((Date.now() - t0) / 1000).toFixed(1)} s)`); process.exit(1);
}
