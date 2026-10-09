/* A ds-lint saját tesztje: minden szabály megfogja a hibás mintát, a tiszta minta 0, és a régi racsni nem bukik az új szabályoktól.
   Használat: node tests/check-ds-lint.js */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const LINT = path.resolve(__dirname, '../tools/ds-lint.js');
const hibak = [];
const futtat = (dir, ...a) => cp.spawnSync('node', [LINT, dir, ...a], { encoding: 'utf8' });
const mk = (fajlok) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dslint-')); for (const [f, t] of Object.entries(fajlok)) { fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true }); fs.writeFileSync(path.join(d, f), t); } return d; };
const szamok = (out) => Object.fromEntries([...out.matchAll(/^\s{2}([a-z-]+)\s+(\d+)/gm)].map(m => [m[1], +m[2]]));

// 1. minden szabály megfogja a maga hibás mintáját
const rossz = mk({ 'src/a.css': `.a { color: #123456; font-size: 13px; border-radius: 7px; box-shadow: 0 2px 4px #000; transition: all 700ms ease-in; outline: none; font-family: Arial; }
.b { color: red; font-weight: 800; z-index: 9999; font-size: 10px; }`,
  'src/b.tsx': `export const X = () => <div onClick={f} className="bg-gray-100 rounded-lg shadow-lg font-medium p-[13px]"><img src="x.png" /></div>;` });
const r1 = szamok(futtat(rossz).stdout);
const vart = ['raw-color', 'tw-palette', 'font-foreign', 'font-size-raw', 'tiny-text', 'radius-raw', 'shadow-raw', 'ease-in', 'outline-none', 'named-color', 'motion-raw', 'font-weight-off', 'z-raw', 'tw-missing', 'tw-arbitrary', 'div-onclick', 'img-no-alt'];
for (const r of vart) if (!(r1[r] > 0)) hibak.push(`a(z) „${r}” szabály nem fogta meg a hibás mintát`);

// 2. a tiszta minta 0
const jo = mk({ 'src/a.css': `.a { color: var(--bc-ink); font-size: var(--bc-fs-m); border-radius: var(--bc-r-m); box-shadow: var(--bc-shadow-s); transition: color var(--bc-t-fast) var(--bc-ease-out); }`,
  'src/b.tsx': `export const X = () => <button className="rounded-m shadow-m p-4" onClick={f}><img src="x.png" alt="Logó" /></button>;` });
const r2 = szamok(futtat(jo).stdout);
for (const r of vart) if (r2[r]) hibak.push(`a(z) „${r}” téves riasztás a tiszta mintán (${r2[r]})`);

// 3. régi racsni (nincs _szabalyok): az új szabályok csak tájékoztatnak; --update után buktatnak
const regi = mk({ 'src/a.css': '.a { color: red; }' });
fs.writeFileSync(path.join(regi, '.beeco-ds-baseline.json'), JSON.stringify({ files: {} }));
const e1 = futtat(regi);
if (e1.status !== 0 || !/Új szabály/.test(e1.stdout)) hibak.push('a régi racsni nem szabadna bukjon az új szabályoktól (csak tájékoztatás)');
futtat(regi, '--init');
const e2 = futtat(regi);
if (e2.status !== 0) hibak.push('a frissen felírt racsni az első futáson nem bukhat');
fs.writeFileSync(path.join(regi, 'src/a.css'), '.a { color: red; } .b { color: blue; }');
const e3 = futtat(regi);
if (e3.status !== 1) hibak.push('a felvett új szabály romlásnál buktatnia kell');

if (hibak.length) { console.error('ds-lint teszt: ' + hibak.length + ' hiba\n- ' + hibak.join('\n- ')); process.exit(1); }
console.log(`ds-lint teszt: rendben (${vart.length} szabály, tiszta minta, racsni-visszamenőleges)`);
