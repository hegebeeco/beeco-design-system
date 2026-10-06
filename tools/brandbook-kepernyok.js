#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – ikonikus képernyők a DS valódi React-komponenseiből (Javaslat 22)
     brandbook/kepernyok/src/<név>.tsx  →  brandbook/kepernyok/<név>.js + <név>.html   (önálló oldal, mint a tesztlapok)
   A kimenet commitolva van, így a Netlify-buildnek nem kell npm install.
   Használat:  node tools/brandbook-kepernyok.js            (ír)
               node tools/brandbook-kepernyok.js --check    (friss-e)
   Csomagok: a repó node_modules-a, vagy DS_NODE_MODULES=<útvonal> (ha a helyi mappa nincs telepítve).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const NM = process.env.DS_NODE_MODULES || path.join(ROOT, 'node_modules');
const esbuild = require(require.resolve('esbuild', { paths: [NM, ROOT] }));
const check = process.argv.includes('--check');
const SRC = path.join(ROOT, 'brandbook/kepernyok/src'), OUT = path.join(ROOT, 'brandbook/kepernyok');

(async () => {
  const lapok = fs.readdirSync(SRC).filter((f) => f.endsWith('.tsx') && !f.startsWith('_'));
  const regi = [];
  for (const f of lapok) {
    const nev = f.replace(/\.tsx$/, '');
    const r = await esbuild.build({ entryPoints: [path.join(SRC, f)], bundle: true, format: 'esm', jsx: 'automatic', target: 'es2020', minify: true, write: false,
      legalComments: 'none', nodePaths: [NM], define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'silent',
      banner: { js: `/* beeco Brand Book – GENERÁLT (tools/brandbook-kepernyok.js), forrás: brandbook/kepernyok/src/${f} */` } });
    const js = r.outputFiles[0].text;
    const html = `<!doctype html>
<html lang="hu" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${nev} – beeco Brand Book</title>
<link rel="stylesheet" href="../ds/termek/css/bc-all.css">
<link rel="stylesheet" href="../bb/kepernyo.css">
<script src="../bb/minta.js"></script>
</head>
<body>
<div id="root"></div>
<script type="module" src="${nev}.js"></script>
</body>
</html>
`;
    for (const [file, text] of [[`${nev}.js`, js], [`${nev}.html`, html]]) {
      const p = path.join(OUT, file);
      if (check) { if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== text) regi.push(file); }
      else fs.writeFileSync(p, text);
    }
    if (!check) console.log(`${nev}: ${Math.round(js.length / 1024)} KB`);
  }
  if (check && regi.length) { console.error('A képernyők nem frissek: ' + regi.join(', ') + ' → node tools/brandbook-kepernyok.js'); process.exit(1); }
  if (check) console.log('a képernyők frissek');
})().catch((e) => { console.error(e.message || e); process.exit(1); });
