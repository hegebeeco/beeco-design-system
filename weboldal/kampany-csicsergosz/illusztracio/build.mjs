// Összefűzi az illusztracio/*.svg fájlokat a cs-illusztracio.src.js-be → ../cs-illusztracio.js
// Futtatás: node weboldal/kampany-csicsergosz/illusztracio/build.mjs
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const D = path.dirname(fileURLToPath(import.meta.url));
const svg = {};
for (const f of fs.readdirSync(D).filter(f => f.endsWith('.svg')).sort()) {
  svg[f.replace(/\.svg$/, '')] = fs.readFileSync(path.join(D, f), 'utf8').replace(/\s*\n\s*/g, '').replace(/>\s+</g, '><').trim();
}
const src = fs.readFileSync(path.join(D, 'cs-illusztracio.src.js'), 'utf8');
if (!src.includes('/*SVG*/{}')) throw new Error('hiányzik a /*SVG*/{} jelölő');
const out = src.replace('/*SVG*/{}', JSON.stringify(svg)).replace('GENERÁLT FÁJL FORRÁSA:', 'GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás:');
fs.writeFileSync(path.join(D, '..', 'cs-illusztracio.js'), out);
console.log('cs-illusztracio.js:', Object.keys(svg).join(', '), '·', out.length, 'bájt');
