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
for (const f of ['fa-keskeny', 'fa-sarga']) svg[f.replace('-', '_')] = kellek(f);  // a barna és a narancs fa a heróban a borító fáira cserélődött

// Ági borítója (illusztracio/agi/borito.svg) egyetlen, réteg nélküli rajz. A hero rétegeit az elemek sorszáma alapján
// vágjuk ki (0 = háttér-téglalap, utána az útvonalak rajzolási sorrendben); az átlátszósági csoportokat megtartjuk.
// Térkép: 1–2 domb és talaj · 3–4, 61–70, 81–94 jobb fa az odúval · 152–171 bal fa (169 a méh szaggatott útja, kimarad)
// · 23–36 itató · 37–60 madár · 95–151 Gabee · 172–202 könyvek · 5–22, 204–205 logó és szalagok · 206–226 partnertábla.
function boritoElemek() {
  const s = olvas('borito'), elemek = [], stack = [];
  for (const m of s.matchAll(/<g([^>]*)>|<\/g>|<(?:path|rect)[^>]*\/>/g)) {
    if (m[0].startsWith('</g')) { stack.pop(); continue; }
    if (m[0].startsWith('<g')) { const op = (m[1].match(/opacity="([^"]+)"/) || [])[1]; stack.push(op || null); continue; }
    const op = stack.filter(Boolean).pop();
    elemek.push(op ? `<g opacity="${op}">${m[0]}</g>` : m[0]);
  }
  return elemek;
}
const BOR = boritoElemek();
const tart = (a, b, ki = []) => Array.from({ length: b - a + 1 }, (_, k) => a + k).filter(i => !ki.includes(i));
function boritoReteg(indexek, vb, par) {
  return tomor(`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"${par ? ` preserveAspectRatio="${par}"` : ''}>${indexek.map(i => BOR[i]).join('')}</svg>`);
}
svg.bor_domb = boritoReteg([1, 2], '0 330 2553 615', 'xMidYMax slice');
svg.bor_fa_bal = boritoReteg(tart(152, 171, [169]), '-20 -50 250 995');
svg.bor_fa_jobb = boritoReteg([...tart(61, 70), ...tart(81, 94), 3, 4], '2030 -50 570 995');

const src = fs.readFileSync(path.join(D, 'cs-illusztracio.src.js'), 'utf8');
if (!src.includes('/*SVG*/{}')) throw new Error('hiányzik a /*SVG*/{} jelölő');
const out = src.replace('/*SVG*/{}', JSON.stringify(svg)).replace('GENERÁLT FÁJL FORRÁSA:', 'GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás:');
fs.writeFileSync(path.join(D, '..', 'cs-illusztracio.js'), out);
console.log('cs-illusztracio.js:', Object.keys(svg).join(', '), '·', out.length, 'bájt');
