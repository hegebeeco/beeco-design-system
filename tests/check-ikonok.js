#!/usr/bin/env node
/* ============================================================
   check-ikonok – a közös ikonkészlet (Javaslat 27) őre
   A termek/ikonok/*.svg (a Flutter appal közös forrás) és a react/src/inputs/ikonok.tsx (Ic*) egyezzen:
   - minden SVG-nek van Ic* párja, és a rajz (path/circle/rect) karakterre azonos;
   - 24-es rács, 2,2 px vonal, currentColor, nincs kitöltés / nyers szín;
   - minden Ic* ki van exportálva a react/src/index.ts-ben, és az ikonok.json mindent felsorol.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const hibak = [];
const hiba = m => hibak.push(m);

const dir = path.join(ROOT, 'termek/ikonok');
const idx = JSON.parse(rd('termek/ikonok/ikonok.json')).ikonok;
const tsx = rd('react/src/inputs/ikonok.tsx');
const index = rd('react/src/index.ts');

// Az Ic* sorok: név → a <svg …> és </svg> közti rajz, normalizálva (JSX → SVG attribútumnév, a ' />' → '/>')
const jsx = {};
for (const m of tsx.matchAll(/^export const (Ic\w+) = \(\) => <svg \{\.\.\.S\}>(.*)<\/svg>;$/gm)) {
  jsx[m[1]] = m[2].replace(/strokeWidth=/g, 'stroke-width=').replace(/\s*\/>/g, '/>');
}
const svgFajlok = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
if (svgFajlok.length !== idx.length) hiba(`ikonok.json: ${idx.length} tétel, de ${svgFajlok.length} SVG-fájl van`);
for (const f of svgFajlok) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  const sor = t.split('\n')[1] || '';
  const fej = /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2\.2" stroke-linecap="round" stroke-linejoin="round"( data-mirror-rtl="true")?>/;
  if (!fej.test(sor)) hiba(`${f}: a fejléc nem a közös (24-es rács, fill="none", stroke="currentColor", 2,2 px, kerek vég)`);
  if (!/^<!-- .+ -->\n/.test(t)) hiba(`${f}: hiányzik az első soros leírás-megjegyzés`);
  const test = sor.replace(fej, '').replace('</svg>', '');
  if (/#[0-9a-fA-F]{3,8}\b|fill=|stroke="/.test(test)) hiba(`${f}: nyers szín vagy kitöltés a rajzban`);
  const bejegyzes = idx.find(x => x.fajl === f);
  if (!bejegyzes) { hiba(`${f}: nincs az ikonok.json-ban`); continue; }
  const ex = bejegyzes.export;
  if (!jsx[ex]) { hiba(`${f}: a(z) ${ex} nincs az ikonok.tsx-ben`); continue; }
  if (jsx[ex] !== test) hiba(`${f}: a rajz eltér a(z) ${ex} rajzától\n    svg: ${test}\n    tsx: ${jsx[ex]}`);
  if (!new RegExp(`\\b${ex}\\b`).test(index)) hiba(`${ex}: nincs kiexportálva a react/src/index.ts-ben`);
}
for (const n of Object.keys(jsx)) if (!idx.some(x => x.export === n)) hiba(`${n}: az ikonok.tsx-ben van, de nincs az ikonok.json-ban`);
if (new Set(idx.map(x => x.export)).size !== idx.length) hiba('ikonok.json: ismétlődő export-név');

if (hibak.length) { console.log(`check-ikonok: ${hibak.length} hiba\n- ` + hibak.join('\n- ')); process.exit(1); }
console.log(`check-ikonok: rendben – ${svgFajlok.length} SVG, ${Object.keys(jsx).length} Ic* (az SVG és a React-rajz egyezik)`);
