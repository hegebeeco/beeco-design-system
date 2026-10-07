#!/usr/bin/env node
/* ============================================================
   check-repo – a tároló higiéniája (docs/ai-munkamod.md 5.)
     · nincs követett szimbolikus link, ami abszolút útvonalra vagy a repón kívülre mutat
       (2026-10: egy követett node_modules → /Users/… szimlink 2 napra eltörte a GitHub Pages-t)
     · nincs követett node_modules
     · a generált fájlok fejlécében nincs verziószám (a verzió egyetlen generált helye: dist/tokens.json)
   Git nélkül (pl. kicsomagolt csomag) csendben kihagyja.
   ============================================================ */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let lista;
try { lista = execFileSync('git', ['ls-files', '-s'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 }); }
catch { console.log('check-repo: nincs git – kihagyva'); process.exit(0); }
const hibak = [];
for (const sor of lista.split('\n')) {
  const m = /^(\d+) \S+ \d+\t(.+)$/.exec(sor); if (!m) continue;
  const [, mod, f] = m;
  if (/(^|\/)node_modules(\/|$)/.test(f)) hibak.push(`követett node_modules: ${f}`);
  if (mod !== '120000') continue;
  let cel = ''; try { cel = fs.readlinkSync(path.join(ROOT, f)); } catch { continue; }
  const hova = path.resolve(path.dirname(path.join(ROOT, f)), cel);
  if (path.isAbsolute(cel) || !hova.startsWith(ROOT + path.sep)) hibak.push(`szimlink a repón kívülre: ${f} → ${cel}`);
}
const VER = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
const fej = ['dist/css/beeco-tokens.css', 'dist/scss/_beeco.scss', 'dist/react/index.js', 'dist/react/index.d.ts', 'dist/weboldal/beeco-web.css'];
for (const f of fej) { const p = path.join(ROOT, f); if (fs.existsSync(p) && fs.readFileSync(p, 'utf8').slice(0, 300).includes(VER)) hibak.push(`verziószám a generált fejlécben: ${f}`); }
if (hibak.length) { hibak.forEach((h) => console.log('✗ ' + h)); process.exit(1); }
console.log('check-repo: rendben (nincs kifelé mutató szimlink, nincs követett node_modules, a generált fejlécek verziómentesek)');
