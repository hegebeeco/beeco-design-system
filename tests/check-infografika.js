#!/usr/bin/env node
/* ============================================================
   check-infografika – a tools/infografika figuráinak őre (a repó npm test-je futtatja)
     · a src/figures.js minden képe létezik és követett (git) fájl a repóban
       (a build beágyazza őket – átnevezés vagy törlés itt derüljön ki, ne a posztereknél)
     · tiltott kép nincs a listán (tokens/hangnem.json → tiltott_kepek, pl. a mérges méh)
     · SVG figurában nincs <text> (a html2canvas-export szabálya, tools/infografika/CLAUDE.md)
   A vizuális tesztek (Playwright) külön futnak: cd tools/infografika && npm test
   ============================================================ */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const TOOL = path.join(ROOT, 'tools/infografika');
const hibak = [];

const forras = fs.readFileSync(path.join(TOOL, 'src/figures.js'), 'utf8');
const utak = [...forras.matchAll(/src:"(\.\.\/\.\.\/[^"]+)"/g)].map((m) => path.normalize(path.join('tools/infografika', m[1])));
if (!utak.length) hibak.push('a src/figures.js-ben nincs egy figura sem (változott a formátum?)');

let kovetett = null;
try { kovetett = new Set(execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n')); }
catch { /* git nélkül csak a létezést nézzük */ }

const tiltott = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/hangnem.json'), 'utf8')).tiltott_kepek || [];
for (const f of utak) {
  if (!fs.existsSync(path.join(ROOT, f))) { hibak.push(`hiányzó figura: ${f}`); continue; }
  if (kovetett && !kovetett.has(f)) hibak.push(`nem követett (gitben nincs) figura: ${f}`);
  const nev = path.basename(f).replace(/\.[^.]+$/, '');
  if (tiltott.some((t) => t === nev || f.endsWith(`/${t}.webp`) || f.endsWith(`/${t}.png`))) hibak.push(`tiltott kép a figurák között: ${f} (tokens/hangnem.json)`);
  if (f.endsWith('.svg') && /<text[\s>]/.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))) hibak.push(`szöveg az SVG figurában (az export elrontja): ${f}`);
}

if (hibak.length) { hibak.forEach((h) => console.log('✗ ' + h)); process.exit(1); }
console.log(`check-infografika: rendben (${utak.length} figura, mind létezik, követett, nem tiltott)`);
