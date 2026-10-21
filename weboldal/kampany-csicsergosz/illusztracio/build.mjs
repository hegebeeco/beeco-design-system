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
  eszeget:   { f: 'poz-eszeget',   lab: [128, 130], reszek: [['cs-p-mag', 0, 2], ['cs-p-test', 11, 24, [103, 124]]] },
  salas:     { f: 'poz-salas',     lab: [80, 162],  reszek: [['cs-p-szem', 11, 16]] }  // téli póz: dec. 1. és febr. vége között az alap helyett
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
// Szomorú póz (a „600 millió” mellé): az alap póz lecsüngő szemhéjakkal és egy könnycseppel, Ági koordinátáiban.
// A szemhéj a mell narancsa, alsó éle kakaó; a külső szemzug lejjebb van (szomorú tekintet).
svg.poz_szomoru = svg.poz_alap.replace('data-poz-svg="alap"', 'data-poz-svg="szomoru"').replace('</g></g></svg>',
  '<g class="cs-p-szemhej"><path d="M40 38 L94 38 L94 55 L40 68Z" fill="#EA6C18"/><path d="M40 68 L94 55" stroke="#6B3B16" stroke-width="3.5" stroke-linecap="round"/>' +
  '<path d="M102 38 L128 38 L128 62 L102 51Z" fill="#EA6C18"/><path d="M102 51 L128 62" stroke="#6B3B16" stroke-width="3.5" stroke-linecap="round"/></g>' +
  '<path class="cs-p-konny" d="M58 84 C52 94 50 100 55 104 C60 107 65 102 63 95 C62 91 60 88 58 84Z" fill="#8FD3F4" stroke="#4BA7D6" stroke-width="1.5"/></g></g></svg>');
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

// Gabee teljes szettje a borítóból: távcsöves Gabee (95–151) és a könyvek (172–202), a könyvek közelebb tolva.
svg.bor_gabee = tomor(`<svg viewBox="530 150 400 560" xmlns="http://www.w3.org/2000/svg">${tart(95, 151).map(i => BOR[i]).join('')}<g transform="translate(-10 -190)">${tart(172, 202).map(i => BOR[i]).join('')}</g></svg>`);
// A borító két szaggatott repülési hurka: a méhé (169) és a madáré (203). A JS maszkkal rajzolja ki őket görgetésre.
const dOf = h => h.match(/ d="([^"]+)"/)[1];
svg.hurok_meh = JSON.stringify({ vb: '-60 120 690 655', d: dOf(BOR[169]) });
svg.hurok_madar = JSON.stringify({ vb: '1950 165 310 410', d: dOf(BOR[203]) });

// Piktogramok a „Miért fontos” blokkba: kettő saját rajz Ági stílusában (illusztracio/sajat), a harmadik Ági elemeiből.
const sajat = f => fs.readFileSync(path.join(D, 'sajat', f + '.svg'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const belso = x => x.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
svg.pikto_rovarok = tomor(sajat('pikto-rovarok')); svg.pikto_vadvirag = tomor(sajat('pikto-vadvirag'));
svg.pikto_elohely = tomor(`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">` +
  `<path d="M0 160 L0 132 L40 124 L100 130 L160 122 L200 130 L200 160Z" fill="#A87552"/><path d="M0 132 L40 124 L100 130 L160 122 L200 130 L200 138 L0 140Z" fill="#CB9C7E"/>` +
  `<g transform="translate(4 8) scale(.66)">${belso(olvas('fa-sarga'))}</g>` +
  `<g transform="translate(104 64) scale(.43)">${belso(olvas('poz-alap'))}</g>` +
  `<path d="M181 134 L184 134 L185 102 L182 102Z" fill="#809D50"/><path d="M183 98 L183 86 L186 86Z M183 98 L194 92 L195 96Z M183 98 L194 104 L190 107Z M183 98 L176 108 L173 104Z M183 98 L171 96 L172 92Z M183 98 L174 86 L178 84Z" fill="#FFFFFF"/><path d="M180 95 L184 93 L187 96 L186 100 L181 101Z" fill="#FFAA2E"/></svg>`);

// ===== Statikus SVG-fájlok a Webflow Designerhez (illusztracio/statikus/) =====
// A Designer nem futtat JS-t: ezek <img>-ként ülnek az oldalon (data-cs-illu / data-cs-poz jelölővel), élesben a JS
// a helyükre teszi az animálható inline változatot. A dombokat ugyanazzal a véletlen-sorozattal rajzoljuk, mint a JS.
const ST = path.join(D, 'statikus'); fs.mkdirSync(ST, { recursive: true });
const meretes = x => x.replace(/^<svg([^>]*?)viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/, (m, a, x0, y0, w, h) => '<svg' + a + 'viewBox="' + [x0, y0, w, h].join(' ') + '" width="' + Math.round(w) + '" height="' + Math.round(h) + '"');
const ir = (nev, tart) => fs.writeFileSync(path.join(ST, nev + '.svg'), meretes(tart.replace(/^<svg(?![^>]*xmlns=)/, '<svg xmlns="http://www.w3.org/2000/svg"')));
['itato', 'eteto', 'odu', 'fa_sarga', 'bor_domb', 'bor_fa_bal', 'bor_fa_jobb', 'bor_gabee', 'pikto_rovarok', 'pikto_vadvirag', 'pikto_elohely', 'poz_alap', 'poz_csicsereg', 'poz_repdes', 'poz_szomoru'].forEach(n => ir(n, svg[n]));
ir('poz_iszik', svg.poz_eszeget.replace(/<g class="cs-p-mag">[\s\S]*?<\/g>/, ''));
for (const k of ['hurok_meh', 'hurok_madar']) { const o = JSON.parse(svg[k]); ir(k, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb}"><path d="${o.d}" fill="none" stroke="#A87956" stroke-width="5" stroke-dasharray="13 10" stroke-linecap="round"/></svg>`); }
{ // dombok: a cs-illusztracio.src.js 2. részének pontos másolata (azonos sorrend, azonos mag)
  let x = 7; const vel = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const gerinc = (alap, ing, lepes) => { const p = []; let xx = 0; while (xx <= 1440) { p.push([xx, alap + (vel() * 2 - 1) * ing]); xx += lepes * (0.7 + vel() * 0.6); } p.push([1440, alap]); return p; };
  const domb = szinek => { let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">'; for (let i = szinek.length - 1; i >= 0; i--) { const g = gerinc(36 + i * 26, 12, 140); let dd = 'M0 0 H1440 V' + g[g.length - 1][1]; for (let k = g.length - 1; k >= 0; k--) dd += ' L' + g[k][0].toFixed(0) + ' ' + g[k][1].toFixed(1); s += '<path d="' + dd + ' Z" fill="' + szinek[i] + '"/>'; } return s + '</svg>'; };
  const KREM = '#FEF7DE', BARACK = '#FFE2B5', HOMOK = '#CB9C7E', BARNA = '#A87552', KAKAO = '#6B3B16', TALAJ = '#B7805C';
  [['miert', [TALAJ]], ['mit', [KREM]], ['gond', [BARACK]], ['howto', [KREM]], ['fotofal', [BARACK]], ['partner', [KREM]], ['segits', [BARACK]], ['gyik', [KREM, HOMOK, BARNA]], ['zaro', [KAKAO, BARNA]], ['lab', [BARNA]]]
    .forEach(([n, sz]) => fs.writeFileSync(path.join(ST, 'domb_' + n + '.svg'), domb(sz)));
}
console.log('statikus:', fs.readdirSync(ST).length, 'fájl');

const src = fs.readFileSync(path.join(D, 'cs-illusztracio.src.js'), 'utf8');
if (!src.includes('/*SVG*/{}')) throw new Error('hiányzik a /*SVG*/{} jelölő');
const out = src.replace('/*SVG*/{}', JSON.stringify(svg)).replace('GENERÁLT FÁJL FORRÁSA:', 'GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás:');
fs.writeFileSync(path.join(D, '..', 'cs-illusztracio.js'), out);
console.log('cs-illusztracio.js:', Object.keys(svg).join(', '), '·', out.length, 'bájt');
