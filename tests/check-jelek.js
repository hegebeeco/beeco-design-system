#!/usr/bin/env node
/* ============================================================
   check-jelek – a közös kétszínű jelkészlet (termek/jelek, Javaslat 28) őre
   Ugyanazok a szabályok, mint a Flutter-DS tool/gen_stickers.dart-jában (a két mappa bájtra egyezik):
   - az első sor egy <!-- leírás --> megjegyzés, utána egy <svg> gyökér: négyzetes viewBox, data-sticker="true", más attribútum nincs;
   - gyerekként csak <path d fill [fill-rule]>, a fill csak ink / honey / paper szerepnév;
   - egy jel legfeljebb 20 000 bájt;
   - a jelek.json pontosan a mappa SVG-it sorolja fel, és a régi nevek létező jelre mutatnak.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'termek/jelek');
const hibak = [];
const hiba = m => hibak.push(m);

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'jelek.json'), 'utf8'));
const fajlok = fs.readdirSync(DIR).filter(f => f.endsWith('.svg')).sort();
const nevek = new Set(idx.jelek.map(j => j.fajl));
for (const f of fajlok) if (!nevek.has(f)) hiba(`${f}: nincs a jelek.json-ban`);
for (const j of idx.jelek) if (!fajlok.includes(j.fajl)) hiba(`jelek.json: ${j.fajl} nincs a mappában`);
if (nevek.size !== idx.jelek.length) hiba('jelek.json: ismétlődő fájlnév');
for (const [regi, uj] of Object.entries(idx.regi_nevek || {})) if (!nevek.has(uj + '.svg')) hiba(`regi_nevek: ${regi} → ${uj}, de ilyen jel nincs`);

for (const f of fajlok) {
  const t = fs.readFileSync(path.join(DIR, f), 'utf8');
  if (Buffer.byteLength(t) > 20000) hiba(`${f}: ${Buffer.byteLength(t)} bájt (legfeljebb 20 000 – jel, nem illusztráció)`);
  const m = t.match(/^<!--\s*(.+?)\s*-->\n<svg ([^>]*)>\n([\s\S]*)<\/svg>\n?$/);
  if (!m) { hiba(`${f}: a formátum: <!-- leírás --> sor, <svg …> gyökér, utak, </svg>`); continue; }
  const attr = Object.fromEntries([...m[2].matchAll(/([\w:-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
  const kulcsok = Object.keys(attr).sort().join(',');
  if (kulcsok !== 'data-sticker,viewBox,xmlns') hiba(`${f}: a gyökér attribútumai csak xmlns, viewBox, data-sticker lehetnek (most: ${kulcsok})`);
  if (attr['data-sticker'] !== 'true') hiba(`${f}: data-sticker="true" kell`);
  const vb = (attr.viewBox || '').trim().split(/\s+/).map(Number);
  if (vb.length !== 4 || vb[2] !== vb[3]) hiba(`${f}: a viewBox négyzetes legyen (${attr.viewBox})`);
  for (const sor of m[3].split('\n').filter(s => s.trim())) {
    const p = sor.match(/^<path ([^>]*)\/>$/);
    if (!p) { hiba(`${f}: csak <path …/> lehet gyerek: ${sor.slice(0, 60)}`); continue; }
    const pa = Object.fromEntries([...p[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
    for (const k of Object.keys(pa)) if (!['d', 'fill', 'fill-rule'].includes(k)) hiba(`${f}: tiltott attribútum a path-on: ${k}`);
    if (!['ink', 'honey', 'paper'].includes(pa.fill)) hiba(`${f}: a fill csak ink / honey / paper lehet (most: ${pa.fill})`);
  }
}

if (hibak.length) { console.log(`check-jelek: ${hibak.length} hiba\n- ` + hibak.join('\n- ')); process.exit(1); }
console.log(`check-jelek: rendben – ${fajlok.length} kétszínű jel (ink / honey / paper), ${Object.keys(idx.regi_nevek || {}).length} régi név`);
