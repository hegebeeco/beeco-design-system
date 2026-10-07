#!/usr/bin/env node
/* ============================================================
   kiadas – egy kiadás helyi előkészítése (docs/ai-munkamod.md 3.); a .github/workflows/kiadas.yml is ezt hívja.
     node tools/kiadas.js 1.53.0
   1. ellenőrzi: X.Y.Z alakú, nagyobb a mostaninál, még nincs ilyen címke
   2. CHANGELOG.md: van „## X.Y.Z” szakasz, vagy a „## Készül” fejléc → „## X.Y.Z – <mai nap>”
   3. VERSION, package.json, package-lock.json ← X.Y.Z
   4. npm run build (a verzió csak a dist/tokens.json-ba kerül; a többi generált fájl nem változik)
   Utána: npm test → commit → git tag vX.Y.Z → git push origin main vX.Y.Z (a workflow ezt elvégzi).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const uj = (process.argv[2] || '').replace(/^v/, '');
const hiba = (m) => { console.error(`kiadas: ${m}`); process.exit(1); };
if (!/^\d+\.\d+\.\d+$/.test(uj)) hiba('add meg a verziót: node tools/kiadas.js X.Y.Z');
const regi = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
const szam = (v) => v.split('.').map(Number);
const nagyobb = (a, b) => { const [x, y] = [szam(a), szam(b)]; for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; };
if (!nagyobb(uj, regi)) hiba(`a(z) ${uj} nem nagyobb a mostaninál (${regi})`);
try { execFileSync('git', ['rev-parse', '-q', '--verify', `refs/tags/v${uj}`], { cwd: ROOT, stdio: 'pipe' }); hiba(`már van v${uj} címke`); } catch (e) { if (e.status !== 1) throw e; }

const clp = path.join(ROOT, 'CHANGELOG.md');
let cl = fs.readFileSync(clp, 'utf8');
const esc = uj.replace(/\./g, '\\.');
if (!new RegExp(`^## ${esc}\\b`, 'm').test(cl)) {
  if (!/^## Készül\b/m.test(cl)) hiba(`a CHANGELOG.md-ben nincs „## ${uj}” és „## Készül” szakasz sem – előbb írd le, mi változott`);
  cl = cl.replace(/^## Készül\b/m, `## ${uj} – ${new Date().toISOString().slice(0, 10)}`);
  fs.writeFileSync(clp, cl);
  console.log(`CHANGELOG.md: „Készül” → ${uj}`);
}
fs.writeFileSync(path.join(ROOT, 'VERSION'), uj + '\n');
for (const f of ['package.json', 'package-lock.json']) {
  const p = path.join(ROOT, f); if (!fs.existsSync(p)) continue;
  const j = JSON.parse(fs.readFileSync(p, 'utf8')); j.version = uj; if (j.packages && j.packages['']) j.packages[''].version = uj;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}
console.log(`VERSION, package.json, package-lock.json: ${regi} → ${uj}`);
execFileSync('npm', ['run', '-s', 'build'], { cwd: ROOT, stdio: 'inherit' });
const valtozott = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
console.log(`kiadas: kész, ${valtozott.length} fájl változott. Következő: npm test → commit → git tag v${uj} → git push origin main v${uj}`);
