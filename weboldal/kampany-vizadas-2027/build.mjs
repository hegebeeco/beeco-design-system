// Építés: ov.css → embed/ov-N.min.css (Webflow HTML Embed-ek, darabonként ≤ 15 000 karakter); ov.src.js → ov.js (jsDelivr, commit-SHA-ra rögzítve)
import fs from 'fs'; import path from 'path';
const D = path.dirname(new URL(import.meta.url).pathname);
// /*!embed-break*/ = rögzített darabhatár: így egy CSS-módosítás csak a saját embedjét változtatja meg (kevesebb Webflow-csere)
const minify = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n+/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const reszek = fs.readFileSync(path.join(D, 'ov.css'), 'utf8').split('/*!embed-break*/').map(minify);
const min = reszek.join('');
const darab = [];
for (const resz of reszek) {
  const blokkok = []; let mely = 0, kezd = 0;
  for (let i = 0; i < resz.length; i++) { const c = resz[i]; if (c === '{') mely++; else if (c === '}') { mely--; if (mely === 0) { blokkok.push(resz.slice(kezd, i + 1)); kezd = i + 1; } } }
  if (mely !== 0 || kezd !== resz.length) throw new Error('kiegyensúlyozatlan CSS');
  let cur = '';
  for (const b of blokkok) { if ((cur + b).length > 15000) { darab.push(cur); cur = ''; } cur += b; }
  if (cur) darab.push(cur);
}
fs.rmSync(path.join(D, 'embed'), { recursive: true, force: true }); fs.mkdirSync(path.join(D, 'embed'));
darab.forEach((c, i) => fs.writeFileSync(path.join(D, 'embed', 'ov-' + (i + 1) + '.min.css'), '<style>' + c + '</style>'));
fs.writeFileSync(path.join(D, 'ov.js'), '/* GENERÁLT – forrás: ov.src.js; építés: node build.mjs */\n' + fs.readFileSync(path.join(D, 'ov.src.js'), 'utf8'));
console.log('css', min.length, 'darab', darab.map(x => x.length));
