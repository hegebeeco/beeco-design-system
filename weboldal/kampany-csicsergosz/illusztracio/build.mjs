// Összefűzi Ági eredeti SVG-it (illusztracio/agi/*.svg) a cs-illusztracio.src.js-be → ../cs-illusztracio.js
// Futtatás: node weboldal/kampany-csicsergosz/illusztracio/build.mjs
//
// A madárpózok Ági külön megrajzolt fájljai. A build részekre bontja őket (az útvonalak sorszáma alapján, amely
// Ági fájljaiban rögzített), és mindet egy közös 240×220-as dobozba igazítja úgy, hogy a láb alja a (120, 212)
// pontra essen: így pózváltáskor a madár nem ugrik. A forgáspontok view-box koordinátában (transform-box: view-box).
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const D = path.dirname(fileURLToPath(import.meta.url)), A = path.join(D, 'agi');
const olvas = f => fs.readFileSync(path.join(A, f + '.svg'), 'utf8');
const utak = s => s.match(/<path[^>]*\/>/g);
const viewBox = s => s.match(/viewBox="([^"]+)"/)[1];
const tomor = s => s.replace(/\s*\n\s*/g, '').replace(/>\s+</g, '><').trim();

const DOBOZ = { w: 240, h: 220, x: 120, y: 212 };
// láb: a lábfejek közepe és alja Ági koordinátáiban; reszek: [osztály, első, utolsó útvonal-index, forgáspont Ági-koordinátában]
const POZOK = {
  alap:      { f: 'poz-alap',      lab: [75, 162],  reszek: [['cs-p-szem', 11, 16]] },
  repdes:    { f: 'poz-repdes',    lab: [94, 170],  reszek: [['cs-p-szarny-b', 0, 0, [40, 104]], ['cs-p-szarny-j', 19, 20, [102, 96]], ['cs-p-szem', 11, 16]] },
  setalgat:  { f: 'poz-setalgat',  lab: [67, 160],  reszek: [['cs-p-szem', 11, 16]] },
  csicsereg: { f: 'poz-csicsereg', lab: [87, 206],  reszek: [['cs-p-hang', 0, 0], ['cs-p-hang cs-p-hang2', 1, 2], ['cs-p-test', 3, 22, [87, 200]]] },
  eszeget:   { f: 'poz-eszeget',   lab: [128, 130], reszek: [['cs-p-mag', 0, 2], ['cs-p-test', 11, 24, [103, 124]]] }
  // salas: { f: 'poz-salas', lab: [80, 162], reszek: [] }  (téli póz, dátumkapcsolóval később)
};
function poz(nev, p) {
  const s = olvas(p.f), u = utak(s), dx = DOBOZ.x - p.lab[0], dy = DOBOZ.y - p.lab[1];
  const nyit = {}, zar = {};
  for (const [cls, a, b, fp] of p.reszek) {
    const st = fp ? ` style="transform-origin:${(fp[0] + dx).toFixed(1)}px ${(fp[1] + dy).toFixed(1)}px"` : '';
    (nyit[a] = nyit[a] || []).push(`<g class="${cls}"${st}>`); zar[b] = (zar[b] || 0) + 1;
  }
  let belso = '';
  u.forEach((x, i) => { belso += (nyit[i] || []).join('') + x + '</g>'.repeat(zar[i] || 0); });
  return tomor(`<svg viewBox="0 0 ${DOBOZ.w} ${DOBOZ.h}" xmlns="http://www.w3.org/2000/svg" class="cs-poz" data-poz-svg="${nev}" overflow="visible">` +
    `<g class="cs-p-egesz" style="transform-origin:${DOBOZ.x}px ${DOBOZ.y}px"><g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})">${belso}</g></g></svg>`);
}
function kellek(f, csoport) {
  const s = olvas(f), u = utak(s); let belso = '';
  const nyit = {}, zar = {};
  for (const [cls, a, b] of (csoport || [])) { (nyit[a] = nyit[a] || []).push(`<g class="${cls}">`); zar[b] = (zar[b] || 0) + 1; }
  u.forEach((x, i) => { belso += (nyit[i] || []).join('') + x + '</g>'.repeat(zar[i] || 0); });
  return tomor(`<svg viewBox="${viewBox(s)}" xmlns="http://www.w3.org/2000/svg">${belso}</svg>`);
}
const svg = {};
for (const [n, p] of Object.entries(POZOK)) svg['poz_' + n] = poz(n, p);
svg.itato = kellek('itato', [['cs-i-csepp', 0, 1], ['cs-i-csepp cs-i-csepp2', 2, 4], ['cs-i-level', 13, 14]]);
svg.eteto = kellek('eteto'); svg.odu = kellek('odu');
for (const f of ['fa-barna', 'fa-keskeny', 'fa-sarga', 'fa-narancs']) svg[f.replace('-', '_')] = kellek(f);

const src = fs.readFileSync(path.join(D, 'cs-illusztracio.src.js'), 'utf8');
if (!src.includes('/*SVG*/{}')) throw new Error('hiányzik a /*SVG*/{} jelölő');
const out = src.replace('/*SVG*/{}', JSON.stringify(svg)).replace('GENERÁLT FÁJL FORRÁSA:', 'GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás:');
fs.writeFileSync(path.join(D, '..', 'cs-illusztracio.js'), out);
console.log('cs-illusztracio.js:', Object.keys(svg).join(', '), '·', out.length, 'bájt');
