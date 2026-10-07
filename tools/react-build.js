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
// Verzió/dátum SZÁNDÉKOSAN nincs a fejlécben: így egy verzióemelés nem írja át a dist/ több száz fájlját (docs/ai-munkamod.md 2.)
const banner = `/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */`;
const common = { bundle: true, format: 'esm', jsx: 'automatic', target: 'es2020', write: false, legalComments: 'none', banner: { js: banner }, logLevel: 'silent' };

async function main() {
  const outputs = [];
  // 1. A projekteknek: React, Radix külső
  //    Modulonként (1.42.1): minden forrásfájl belépési pont + közös darabok (splitting) – így a projekt buildje (Rollup/Vite)
  //    minden DS-elemet abba a csomagba tesz, ahol használják; egyetlen nagy fájlnál az egész DS a belépő-csomagba került.
  const srcDir = path.join(ROOT, 'react/src');
  const modulok = [];
  (function bejar(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const t = path.join(d, f.name);
    if (f.isDirectory()) bejar(t); else if (/\.(ts|tsx)$/.test(f.name) && !/\.(d|test)\.tsx?$/.test(f.name)) modulok.push(t); } })(srcDir);
  modulok.sort();
  const lib = await esbuild.build({ ...common, entryPoints: modulok, outdir: path.join(ROOT, 'dist/react'), outbase: srcDir, splitting: true,
    chunkNames: 'reszek/[name]-[hash]', external: ['react', 'react-dom', 'react/jsx-runtime', '@radix-ui/*', '@tanstack/*', 'react-easy-crop'] });
  outputs.push(...lib.outputFiles);
  const libUtak = new Set(lib.outputFiles.map((o) => o.path));
  // 2. A tesztlapoknak: minden benne (önálló oldal)
  const dir = path.join(ROOT, 'react/tesztlapok');
  const pages = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.startsWith('_')).sort() : []; // rendezve: a readdir sorrendje Linuxon nem az
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
  // A tesztlapok listája a kezdőlapnak (GitHub Pages nem listáz mappát): név + cím a tsx mount() hívásából
  const lista = pages.map((p) => { const src = fs.readFileSync(path.join(dir, p), 'utf8'); const m = src.match(/mount\(\s*'([^']+)'(?:,\s*'([^']*)')?/); return { nev: p.replace(/\.tsx$/, ''), cim: m ? m[1] : p, leiras: m && m[2] ? m[2] : '' }; });
  outputs.push({ path: path.join(ROOT, 'termek/tesztlapok/lista.json'), text: JSON.stringify(lista, null, 1) + '\n' });
  outputs.push({ path: path.join(ROOT, 'dist/react/index.d.ts'), text: `${banner}\nexport * from './types/index';\n` });
  // 3. A gépi mérés böngészőben futtatható formában (projektekben is: window.bcMeres({ w, touch }) → leletek)
  const meresFn = require(path.join(ROOT, 'tools/komp/oldal-meres.js'));
  outputs.push({ path: path.join(ROOT, 'dist/meres/oldal-meres.js'), text: `${banner}\n/* Használat a böngészőben: const L = window.bcMeres({ w: innerWidth, touch: true }); – leletek { kat, sulyos, mi, hol } */\nwindow.bcMeres = ${meresFn.toString()};\n` });

  let stale = 0;
  // A dist/react régi .js-fájljai (más hash, törölt modul) – a types/ marad
  (function regi(d) { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d, { withFileTypes: true })) { const t = path.join(d, f.name);
    if (f.isDirectory()) { if (f.name !== 'types') regi(t); } else if (t.endsWith('.js') && !libUtak.has(t)) {
      if (check) { console.log(`ELAVULT (törlendő): ${path.relative(ROOT, t)}`); stale++; } else { fs.unlinkSync(t); console.log(`törölve: ${path.relative(ROOT, t)}`); } } } })(path.join(ROOT, 'dist/react'));
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
  // --check: ideiglenes mappába ír, és összeveti a dist/react/types-szal (így az elavult .d.ts is kiderül, nem csak a TS-hiba)
  const typesDir = path.join(ROOT, 'dist/react/types');
  const tmpTypes = check ? fs.mkdtempSync(path.join(require('os').tmpdir(), 'bc-types-')) : null;
  try { execFileSync(tsc, ['-p', path.join(ROOT, 'react/tsconfig.json'), ...(check ? ['--outDir', tmpTypes] : [])], { stdio: 'pipe' }); }
  catch (e) { console.log(`TypeScript-hiba:\n${e.stdout}`); process.exit(1); }
  if (check) {
    const lista = (d, b = d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => f.isDirectory() ? lista(path.join(d, f.name), b) : [path.relative(b, path.join(d, f.name))]) : [];
    // a types/react/ egy régi build maradéka (be van commitolva) – visszafelé kompatibilitás miatt nem nyúlunk hozzá
    const regiMaradek = (f) => f.startsWith('react' + path.sep);
    const uj = new Set(lista(tmpTypes)); const regi = new Set(lista(typesDir).filter((f) => !regiMaradek(f)));
    for (const f of [...new Set([...uj, ...regi])].sort()) {
      const a = uj.has(f) ? fs.readFileSync(path.join(tmpTypes, f), 'utf8') : null; const b = regi.has(f) ? fs.readFileSync(path.join(typesDir, f), 'utf8') : null;
      if (a !== b) { console.log(`ELAVULT: dist/react/types/${f}${a === null ? ' (törlendő)' : ''}`); stale++; }
    }
    fs.rmSync(tmpTypes, { recursive: true, force: true });
  } else {
    // a már nem létező forrás típusfájlja ne maradjon ott (a tsc magától nem töröl)
    const forras = (rel) => ['.ts', '.tsx'].some((x) => fs.existsSync(path.join(srcDir, rel.replace(/\.d\.ts$/, x))));
    (function tisztit(d) { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d, { withFileTypes: true })) { const t = path.join(d, f.name);
      if (f.isDirectory()) { if (!(d === typesDir && f.name === 'react')) tisztit(t); } else if (t.endsWith('.d.ts') && !forras(path.relative(typesDir, t))) { fs.unlinkSync(t); console.log(`törölve: ${path.relative(ROOT, t)}`); } } })(typesDir);
  }
  // A tesztlapok is típusellenőrzést kapnak (az esbuild csak eldobja a típusokat, nem ellenőrzi)
  try { execFileSync(tsc, ['-p', path.join(ROOT, 'react/tsconfig.tesztlap.json')], { stdio: 'pipe' }); }
  catch (e) { console.log(`TypeScript-hiba a tesztlapokon:\n${e.stdout}`); process.exit(1); }
  if (check && stale) { console.log('→ futtasd: node tools/react-build.js'); process.exit(1); }
  if (check) console.log(`react-build: a dist/react és a ${pages.length} tesztlap friss`);
}
main().catch((e) => { console.error(e); process.exit(1); });
