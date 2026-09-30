#!/usr/bin/env node
/* ============================================================
   react-build – a DS React-komponenseinek fordítása (esbuild, gyors, függőség nélküli kimenet)
     react/src/index.ts            → dist/react/index.js (+ index.d.ts, types/)   – ezt importálják a projektek
     react/tesztlapok/<név>.tsx    → dist/tesztlapok/<név>.js                      – a tesztlapok (termek/tesztlapok/<név>.html) futtatója
   A React és a Radix a projektekben külső függőség (nem csomagoljuk bele); a tesztlapokba igen (önálló oldalak).
   Használat:  node tools/react-build.js           (ír)
               node tools/react-build.js --check   (csak ellenőrzi, hogy a dist friss-e; CI)
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const esbuild = require('esbuild');

const ROOT = path.join(__dirname, '..');
const check = process.argv.includes('--check');
const VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
const banner = `/* beeco design system ${VERSION} – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */`;
const common = { bundle: true, format: 'esm', jsx: 'automatic', target: 'es2020', write: false, legalComments: 'none', banner: { js: banner }, logLevel: 'silent' };

async function main() {
  const outputs = [];
  // 1. A projekteknek: React, Radix külső
  const lib = await esbuild.build({ ...common, entryPoints: [path.join(ROOT, 'react/src/index.ts')], outfile: path.join(ROOT, 'dist/react/index.js'),
    external: ['react', 'react-dom', 'react/jsx-runtime', '@radix-ui/*'] });
  outputs.push(...lib.outputFiles);
  // 2. A tesztlapoknak: minden benne (önálló oldal)
  const dir = path.join(ROOT, 'react/tesztlapok');
  const pages = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.startsWith('_')) : [];
  for (const p of pages) {
    const r = await esbuild.build({ ...common, entryPoints: [path.join(dir, p)], outfile: path.join(ROOT, 'dist/tesztlapok', p.replace(/\.tsx$/, '.js')),
      minify: true, define: { 'process.env.NODE_ENV': '"production"' } });
    outputs.push(...r.outputFiles);
    const name = p.replace(/\.tsx$/, '');
    outputs.push({ path: path.join(ROOT, 'termek/tesztlapok', `${name}.html`), text:
`<!doctype html>
<html lang="hu" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tesztlap – ${name}</title>
<meta name="description" content="beeco design system tesztlap: minden állapot és szélső eset (docs/komponensek.md 3.).">
<link rel="icon" href="../../web/assets/brand/ikon-32.png">
<link rel="stylesheet" href="../css/bc-all.css">
<link rel="stylesheet" href="../css/bc-tesztlap.css">
</head>
<body>
<div id="root"></div>
<script type="module" src="../../dist/tesztlapok/${name}.js"></script>
</body>
</html>
` });
  }
  outputs.push({ path: path.join(ROOT, 'dist/react/index.d.ts'), text: `${banner}\nexport * from './types/index';\n` });

  let stale = 0;
  for (const o of outputs) {
    const rel = path.relative(ROOT, o.path);
    const old = fs.existsSync(o.path) ? fs.readFileSync(o.path, 'utf8') : null;
    if (old === o.text) continue;
    if (check) { console.log(`ELAVULT: ${rel}`); stale++; continue; }
    fs.mkdirSync(path.dirname(o.path), { recursive: true });
    fs.writeFileSync(o.path, o.text);
    console.log(`írva: ${rel}`);
  }
  // Típusok (tsc) – csak író módban; a --check a TS-hibát is megfogja (noEmit)
  const tsc = path.join(ROOT, 'node_modules/.bin/tsc');
  try { execFileSync(tsc, ['-p', path.join(ROOT, 'react/tsconfig.json'), ...(check ? ['--noEmit', '--emitDeclarationOnly', 'false'] : [])], { stdio: 'pipe' }); }
  catch (e) { console.log(`TypeScript-hiba:\n${e.stdout}`); process.exit(1); }
  if (check && stale) { console.log('→ futtasd: node tools/react-build.js'); process.exit(1); }
  if (check) console.log(`react-build: a dist/react és a ${pages.length} tesztlap friss`);
}
main().catch((e) => { console.error(e); process.exit(1); });
