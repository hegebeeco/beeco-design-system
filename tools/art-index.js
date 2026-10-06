// ============================================================
//  ART-INDEX – melyik matrica (név és emoji) melyik lusta könyvtárban van → web/js/art/art-index.js
//  Miért: a böngészőben a matrica-fájlok csak az első kérésükkor számolódnak ki (ART.later, js/art/art.js), ehhez
//  előre tudni kell, hogy egy név vagy emoji melyik fájlban él. (2026-10-06: közepes Androidon -3,8 mp induláskor.)
//  node tools/art-index.js          → megírja az indexet
//  node tools/art-index.js --check  → csak ellenőriz (a tests/check-art.js is ezt hívja); 1-es kóddal áll le, ha elavult
//  Új matrica-fájl vagy új matrica után futtasd le, és a fájl kerüljön a commitba.
// ============================================================
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', 'web', 'js', 'art'), OUT = path.join(DIR, 'art-index.js');

function epit(){
  global.ART = require(path.join(DIR, 'art.js'));
  const map = {};
  const fajlok = fs.readdirSync(DIR).filter(f => /^art-.+\.js$/.test(f) && f !== 'art-index.js').sort();
  for(const f of fajlok){
    const src = fs.readFileSync(path.join(DIR, f), 'utf8');
    const m = src.match(/ART\.later\('([^']+)'/); if(!m) { require(path.join(DIR, f)); continue; }   // nem lusta (pl. art-pecset): mindig fut
    const elotte = new Set(Object.keys(ART.LIB));
    require(path.join(DIR, f));
    const uj = Object.keys(ART.LIB).filter(n => !elotte.has(n));
    map[m[1]] = uj.flatMap(n => [n, ...(ART.LIB[n].emoji || [])]);
  }
  return '// GENERÁLT FÁJL – ne szerkeszd kézzel: node tools/art-index.js (a lusta matrica-könyvtárak névjegyzéke, js/art/art.js – ART.index)\n'
    + 'ART.index(' + JSON.stringify(map) + ');\n';
}

const kesz = epit();
if(process.argv.includes('--check')){
  const most = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if(most !== kesz){ console.error('art-index: ELAVULT – futtasd: node tools/art-index.js'); process.exit(1); }
  console.log('art-index: naprakész');
} else { fs.writeFileSync(OUT, kesz); console.log('art-index →', path.relative(process.cwd(), OUT), Math.round(kesz.length / 1024) + ' KB'); }
