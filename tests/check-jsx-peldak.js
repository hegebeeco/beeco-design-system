/* A docs-oldalak „teljes” JSX-példáit (tools/docs/jsx-pelda.js) lefordítja a dist/react típusaival.
   Ami a dokumentációban teljes példaként szerepel, annak fordulnia kell – különben a másolás hibás kódot adna.
   Használat: node tests/check-jsx-peldak.js [--lista]   (előfeltétel: npm ci, npm run build) */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { futoPelda } = require('../tools/docs/jsx-pelda');
const api = JSON.parse(fs.readFileSync(path.join(ROOT, 'api/api.json'), 'utf8')).react;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsx-peldak-'));
const nevek = Object.entries(api).filter(([, d]) => d.fajta === 'komponens').map(([n]) => n);
let teljes = 0, resz = 0;
for (const n of nevek) {
  const r = futoPelda(n, api[n]);
  if (!r.teljes) { resz++; continue; }
  teljes++;
  fs.writeFileSync(path.join(dir, `${n}.tsx`), r.kod);
}
fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, lib: ['ES2020', 'DOM'], typeRoots: [path.join(ROOT, 'node_modules/@types')], baseUrl: ROOT, paths: { '@beeco/design-system/react': [path.join(ROOT, 'dist/react/index.d.ts')], react: [path.join(ROOT, 'node_modules/@types/react')], 'react/jsx-runtime': [path.join(ROOT, 'node_modules/@types/react/jsx-runtime')] } }, include: ['*.tsx'] }));
const r = cp.spawnSync(path.join(ROOT, 'node_modules/.bin/tsc'), ['-p', dir], { encoding: 'utf8' });
const hibak = (r.stdout || '').split('\n').filter(l => /error TS/.test(l));
console.log(`jsx-példák: ${nevek.length} komponens, ${teljes} teljes (fordítva), ${resz} részleges (a tesztlap forrására mutat)`);
if (hibak.length) { console.error(hibak.slice(0, 30).join('\n')); console.error(`${hibak.length} fordítási hiba`); process.exit(1); }
console.log('jsx-példák: rendben');
