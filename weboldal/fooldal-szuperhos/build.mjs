// Építés: fs.css (forrás-összefűzés) → embed/fs-N.min.css (Webflow HTML Embed-ekbe, darabonként ≤ 15 000 karakter)
//          fs.src.js + rig + szimbólumok → fs.js (jsDelivr-ről töltődik, commit-SHA-ra rögzítve)
import fs from 'fs'; import path from 'path'; import os from 'os';
const D = path.dirname(new URL(import.meta.url).pathname);
const css = ['fs-alap.css', 'fs-ikonok.css', 'fs-extra.css'].map(f => fs.readFileSync(path.join(D, f), 'utf8')).join('\n');
fs.writeFileSync(path.join(D, 'fs.css'), '/* GENERÁLT – forrás: fs-alap.css, fs-ikonok.css, fs-extra.css; építés: node build.mjs */\n' + css);
const min = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n+/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
// zárójel-tudatos darabolás legfelső szintű blokkokra
const blokkok = []; let mely = 0, kezd = 0;
for (let i = 0; i < min.length; i++) { const c = min[i]; if (c === '{') mely++; else if (c === '}') { mely--; if (mely === 0) { blokkok.push(min.slice(kezd, i + 1)); kezd = i + 1; } } }
if (mely !== 0 || kezd !== min.length) throw new Error('kiegyensúlyozatlan CSS');
const darab = []; let cur = '';
for (const b of blokkok) { if ((cur + b).length > 15000) { darab.push(cur); cur = ''; } cur += b; }
if (cur) darab.push(cur);
fs.rmSync(path.join(D, 'embed'), { recursive: true, force: true }); fs.mkdirSync(path.join(D, 'embed'));
darab.forEach((c, i) => fs.writeFileSync(path.join(D, 'embed', 'fs-' + (i + 1) + '.min.css'), '<style>' + c + '</style>'));
let rig = fs.readFileSync(path.join(os.homedir(), 'CLAUDE/beeco-muhely/meh/mascotte/hos/rig/hos-rig.svg'), 'utf8').replace(/<\?xml[^>]*>\s*/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\s*\n\s*/g, ' ').trim();
const szim = fs.readFileSync(path.join(D, '.szimbolumok.txt'), 'utf8').replace(/'/g, "\\'");
let js = fs.readFileSync(path.join(D, 'fs.src.js'), 'utf8');
if (!js.includes("'{{RIG}}'") || !js.includes('{{SZIMBOLUMOK}}')) throw new Error('helyőrző hiányzik');
js = js.replace("'{{RIG}}'", JSON.stringify(rig)).replace('{{SZIMBOLUMOK}}', szim);
fs.writeFileSync(path.join(D, 'fs.js'), '/* GENERÁLT – forrás: fs.src.js; építés: node build.mjs */\n' + js);
console.log('css', min.length, 'darab', darab.map(x => x.length), 'js', js.length);
