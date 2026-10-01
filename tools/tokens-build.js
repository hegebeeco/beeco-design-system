#!/usr/bin/env node
/* ============================================================
   tokens-build – a beeco design system EGY FORRÁSÁBÓL (tokens/*.json) generálja
   a termékek kimeneteit a dist/ mappába:
     dist/css/beeco-tokens.css   CSS-változók (--bc-*): primitívek + termékbőr világos/sötét
     dist/css/beeco-fonts.css    saját szerverről töltött Lalezar + Open Sans
     dist/scss/_beeco.scss       SCSS-változók (a CSS-változókra mutatnak) – admin
     dist/tailwind/preset.cjs    Tailwind preset (átlátszóság-módosítóval: bg-ink/40) – partner
     dist/dart/beeco_tokens.dart Flutter-konstansok – app (Bence)
     dist/tokens.json            feloldott, lapos értékek (bármely más eszköznek)
   Használat:  node tools/tokens-build.js          (ír)
               node tools/tokens-build.js --check  (csak ellenőrzi, hogy a dist friss-e; CI)
   Függőség nincs. A dist/ be van commitolva, hogy a fogyasztó projektnek ne kelljen buildelni.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens', f), 'utf8'));
const core = read('core.json');
const termek = read('theme-termek.json');
const VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();

const HEAD = `beeco design system ${VERSION} – GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás: tokens/*.json, eszköz: tools/tokens-build.js`;
const hex = name => {
  const v = core.color[name];
  if (!v) throw new Error(`Ismeretlen primitív szín: "${name}"`);
  return v;
};
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(' ');
const px = n => `${n}px`;
const ms = n => `${n}ms`;
// A kategória-skála elemei primitív nevek → feloldjuk hexre
const categorical = core.data.categorical.map(hex);

/* ---------- 1. CSS-változók ---------- */
function roleBlock(roles, mode) {
  // Ha a szerep és a primitív neve azonos (pl. focus → focus), világosban nincs mit írni: a primitív már az érték.
  // (A „--bc-focus: var(--bc-focus)” önhivatkozás érvénytelen – a böngésző eldobná, és eltűnne a fókuszkeret.)
  return Object.entries(roles).filter(([role, prim]) => !(role === prim && mode === 'light')).map(([role, prim]) =>
    role === prim ? `  --bc-${role}: ${hex(prim)}; --bc-${role}-rgb: ${rgb(hex(prim))};`
      : `  --bc-${role}: var(--bc-${prim}); --bc-${role}-rgb: var(--bc-${prim}-rgb);`).join('\n');
}
function buildCss() {
  const L = [];
  L.push(`/* ${HEAD} */`, '', '/* 1. Primitívek (nyers színek) – felületen NE használd közvetlenül, csak a szerepeket (2.) */', ':root {');
  for (const [n, v] of Object.entries(core.color)) L.push(`  --bc-${n}: ${v}; --bc-${n}-rgb: ${rgb(v)};`);
  L.push('', '  /* Betűk, méretek, térköz */');
  L.push(`  --bc-font-display: ${core.font.display.map(f => f.includes(' ') ? `"${f}"` : f).join(', ')};`);
  L.push(`  --bc-font-body: ${core.font.body.map(f => f.includes(' ') ? `"${f}"` : f).join(', ')};`);
  for (const [n, v] of Object.entries(core.fontWeight)) L.push(`  --bc-fw-${n}: ${v};`);
  for (const [n, v] of Object.entries(core.fontSize)) L.push(`  --bc-fs-${n}: ${px(v)};`);
  for (const [n, v] of Object.entries(core.lineHeight)) L.push(`  --bc-lh-${n}: ${v};`);
  for (const [n, v] of Object.entries(core.space)) L.push(`  --bc-sp-${n}: ${px(v)};`);
  L.push('', '  /* Mozgás: UI ≤ 300 ms, ease-in tilos */');
  for (const [n, v] of Object.entries(core.duration)) L.push(`  --bc-t-${n}: ${ms(v)};`);
  for (const [n, v] of Object.entries(core.easing)) L.push(`  --bc-ease-${n}: ${v};`);
  L.push(`  --bc-tap: ${px(core.tap)};`);
  for (const [n, v] of Object.entries(core.z)) if (!n.startsWith('_')) L.push(`  --bc-z-${n}: ${v};`);
  L.push('', '  /* Adatskálák (grafikon, térkép) */');
  ['seq', 'div', 'seq-cb', 'div-cb'].forEach(k => core.data[k].forEach((v, i) => L.push(`  --bc-data-${k}-${i + 1}: ${v};`)));
  categorical.forEach((v, i) => L.push(`  --bc-data-cat-${i + 1}: ${v};`));
  L.push('', '  /* 2. TERMÉKBŐR – forma */');
  for (const [n, v] of Object.entries(termek.radius)) L.push(`  --bc-r-${n}: ${px(v)};`);
  for (const [n, v] of Object.entries(termek.border)) L.push(`  --bc-bw-${n}: ${px(v)};`);
  for (const [n, v] of Object.entries(termek.shadow)) {
    if (n.startsWith('_')) continue;
    L.push(`  --bc-shadow-${n}: ${px(v[0])} ${px(v[1])} 0 var(--bc-shadow); --bc-shadow-${n}-x: ${px(v[0])}; --bc-shadow-${n}-y: ${px(v[1])};`);
  }
  L.push(`  --bc-scrim-opacity: ${termek.scrimOpacity};`);
  L.push('', '  /* 2. TERMÉKBŐR – szín-szerepek, világos */', '  color-scheme: light;');
  L.push(roleBlock(termek.color.light, 'light'), '}', '');
  L.push('/* Sötét mód: <html data-theme="dark"> vagy <html class="dark"> (Tailwind), rendszer szerint: data-theme="auto" */');
  L.push(':root[data-theme="dark"], :root.dark {', '  color-scheme: dark;', roleBlock(termek.color.dark, 'dark'), '}');
  L.push('@media (prefers-color-scheme: dark) {', '  :root[data-theme="auto"] {', '    color-scheme: dark;');
  L.push(roleBlock(termek.color.dark, 'dark').replace(/^/gm, '  '), '  }', '}', '');
  return L.join('\n');
}

/* ---------- 2. Betűk ---------- */
function buildFonts() {
  const src = fs.readFileSync(path.join(ROOT, 'web/css/fonts.css'), 'utf8');
  // Ugyanaz a @font-face, mint a játékoké – csak az útvonal a csomagon belüli
  return `/* ${HEAD} */\n` + src.replace(/url\(\.\.\/assets\/fonts\//g, 'url(../../web/assets/fonts/');
}

/* ---------- 3. SCSS ---------- */
function buildScss() {
  const L = [`// ${HEAD}`, '// A változók a CSS-változókra mutatnak (így a sötét mód magától működik). Előbb töltsd be a beeco-tokens.css-t.', ''];
  const roles = Object.keys(termek.color.light);
  roles.forEach(r => L.push(`$bc-${r}: var(--bc-${r});`));
  L.push('', '// Primitívek – csak adatvizualizációhoz és kivételhez');
  Object.keys(core.color).forEach(n => L.push(`$bc-c-${n}: var(--bc-${n});`));
  // Hex-értékek: csak SCSS színfüggvényhez (rgba($x, .3), color.adjust) és régi kód áthidalásához –
  // sötét módban NEM váltanak, ezért új kódban a var()-os szerep a helyes
  L.push('', '// Hex (fordítási idejű) – csak színfüggvényhez és régi kód áthidalásához; sötét módban nem vált!');
  Object.entries(core.color).forEach(([n, v]) => L.push(`$bc-hex-${n}: ${v};`));
  Object.entries(termek.color.light).forEach(([r, p]) => L.push(`$bc-hex-role-${r}: ${hex(p)};`));
  L.push('', `$bc-font-display: var(--bc-font-display);`, `$bc-font-body: var(--bc-font-body);`);
  // Minden skálaelem egyenként is (pl. $bc-fw-bold, $bc-bw-hair, $bc-lh-normal), és mapként is (a függvényekhez)
  const map = (name, obj, fn) => {
    const keys = Object.keys(obj).filter(k => !k.startsWith('_'));
    keys.forEach(k => L.push(`$bc-${name}-${k}: ${fn(k)};`));
    L.push(`$bc-${name}: (${keys.map(k => `"${k}": ${fn(k)}`).join(', ')});`);
  };
  map('lh', core.lineHeight, k => `var(--bc-lh-${k})`);
  map('fs', core.fontSize, k => `var(--bc-fs-${k})`);
  map('fw', core.fontWeight, k => `var(--bc-fw-${k})`);
  map('sp', core.space, k => `var(--bc-sp-${k})`);
  map('r', termek.radius, k => `var(--bc-r-${k})`);
  map('bw', termek.border, k => `var(--bc-bw-${k})`);
  map('shadow', termek.shadow, k => `var(--bc-shadow-${k})`);
  map('t', core.duration, k => `var(--bc-t-${k})`);
  map('z', core.z, k => `var(--bc-z-${k})`);
  map('ease', core.easing, k => `var(--bc-ease-${k})`);
  L.push('', '@function fs($k) { @return map-get($bc-fs, "#{$k}"); }', '@function sp($k) { @return map-get($bc-sp, "#{$k}"); }',
    '@function r($k) { @return map-get($bc-r, "#{$k}"); }', '@function shadow($k) { @return map-get($bc-shadow, "#{$k}"); }',
    '@function fw($k) { @return map-get($bc-fw, "#{$k}"); }', '@function bw($k) { @return map-get($bc-bw, "#{$k}"); }', '');
  return L.join('\n');
}

/* ---------- 4. Tailwind preset ---------- */
function buildTailwind() {
  const col = {};
  Object.keys(termek.color.light).forEach(r => { col[r] = `rgb(var(--bc-${r}-rgb) / <alpha-value>)`; });
  const prim = {};
  Object.keys(core.color).forEach(n => { prim[n] = `rgb(var(--bc-${n}-rgb) / <alpha-value>)`; });
  const obj = (o, fn) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, fn(k, v)]));
  const preset = {
    darkMode: ['variant', ['&:where(.dark, .dark *)', '&:where([data-theme="dark"], [data-theme="dark"] *)']],
    theme: {
      // A Tailwind saját palettája KI – csak beeco szín létezik (így nyers szín nem csúszhat be)
      colors: { transparent: 'transparent', current: 'currentColor', inherit: 'inherit', ...col, c: prim },
      fontFamily: { display: ['var(--bc-font-display)'], body: ['var(--bc-font-body)'], sans: ['var(--bc-font-body)'] },
      fontSize: obj(core.fontSize, k => [`var(--bc-fs-${k})`, { lineHeight: ['xl', '2xl', '3xl'].includes(k) ? `var(--bc-lh-tight)` : `var(--bc-lh-normal)` }]),
      fontWeight: obj(core.fontWeight, k => `var(--bc-fw-${k})`),
      borderRadius: { none: '0', ...obj(termek.radius, k => `var(--bc-r-${k})`), DEFAULT: 'var(--bc-r-m)', full: '9999px' },
      borderWidth: { 0: '0', ...obj(termek.border, k => `var(--bc-bw-${k})`), DEFAULT: 'var(--bc-bw-hair)' },
      boxShadow: { none: 'none', ...obj(termek.shadow, k => `var(--bc-shadow-${k})`) },
      extend: {
        spacing: { tap: 'var(--bc-tap)' },
        minHeight: { tap: 'var(--bc-tap)' }, minWidth: { tap: 'var(--bc-tap)' },
        zIndex: obj(core.z, k => `var(--bc-z-${k})`),
        transitionDuration: obj(core.duration, k => `var(--bc-t-${k})`),
        transitionTimingFunction: obj(core.easing, k => `var(--bc-ease-${k})`),
      },
    },
  };
  return `// ${HEAD}\n// Használat (tailwind.config.js): presets: [require('@beeco/design-system/tailwind')]\n// és a CSS-ben: @import '@beeco/design-system/css/beeco-tokens.css';\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`;
}

/* ---------- 5. Dart (Flutter) ---------- */
function buildDart() {
  const camel = s => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, 'n$1');
  const dc = h => `Color(0xFF${h.slice(1).toUpperCase()})`;
  const L = [`// ${HEAD}`, '// Bence: ez a fájl a beeco-design-system dist/dart mappájából jön – ne szerkeszd kézzel.', "import 'package:flutter/material.dart';", ''];
  L.push('/// Primitívek – a felületen a szerepeket (BeecoRoles) használd.', 'abstract final class BeecoPalette {');
  Object.entries(core.color).forEach(([n, v]) => L.push(`  static const ${camel(n)} = ${dc(v)};`));
  L.push('}', '');
  L.push('/// Termékbőr szín-szerepei (világos / sötét).', 'class BeecoRoles {');
  const roles = Object.keys(termek.color.light);
  L.push(`  const BeecoRoles({${roles.map(r => `required this.${camel(r)}`).join(', ')}});`);
  roles.forEach(r => L.push(`  final Color ${camel(r)};`));
  ['light', 'dark'].forEach(m => {
    L.push(`  static const ${m} = BeecoRoles(`);
    roles.forEach(r => L.push(`    ${camel(r)}: BeecoPalette.${camel(termek.color[m][r])},`));
    L.push('  );');
  });
  L.push('}', '');
  L.push('abstract final class BeecoTokens {');
  L.push(`  static const fontDisplay = '${core.font.display[0]}';`, `  static const fontBody = 'OpenSans';`);
  Object.entries(core.fontSize).forEach(([n, v]) => L.push(`  static const fs${camel('-' + n)} = ${v}.0;`));
  Object.entries(core.space).forEach(([n, v]) => L.push(`  static const sp${n} = ${v}.0;`));
  Object.entries(termek.radius).forEach(([n, v]) => L.push(`  static const r${camel('-' + n)} = ${v}.0;`));
  Object.entries(termek.border).forEach(([n, v]) => L.push(`  static const bw${camel('-' + n)} = ${v}.0;`));
  Object.entries(termek.shadow).filter(([k]) => !k.startsWith('_')).forEach(([n, v]) => L.push(`  static const shadow${camel('-' + n)} = Offset(${v[0]}, ${v[1]});`));
  Object.entries(core.duration).forEach(([n, v]) => L.push(`  static const t${camel('-' + n)} = Duration(milliseconds: ${v});`));
  L.push(`  static const easeOut = Cubic(.23, 1, .32, 1);`, `  static const tap = ${core.tap}.0;`, '}', '');
  return L.join('\n');
}

/* ---------- 6. Lapos JSON ---------- */
function buildJson() {
  const res = m => Object.fromEntries(Object.entries(termek.color[m]).map(([r, p]) => [r, hex(p)]));
  return JSON.stringify({ version: VERSION, color: core.color, termek: { light: res('light'), dark: res('dark'), radius: termek.radius, border: termek.border, shadow: termek.shadow }, font: core.font, fontWeight: core.fontWeight, fontSize: core.fontSize, space: core.space, duration: core.duration, easing: core.easing, data: { ...core.data, categorical } }, null, 2) + '\n';
}

// Szerepek ellenőrzése: minden szerep létező primitívre mutasson (különben a build megáll)
['light', 'dark'].forEach(m => Object.values(termek.color[m]).forEach(hex));

// Szövegkészlet (Javaslat 05) TS-modulként a React-komponenseknek – egy forrás: tokens/hangnem.json
function buildHangnem() {
  const h = read('hangnem.json');
  return `// ${HEAD}\n// A méhes pillanatok szövegei – forrás: tokens/hangnem.json\nexport default ${JSON.stringify({ szerepek: h.szerepek, pillanatok: h.pillanatok }, null, 2)} as const;\n`;
}

const OUT = {
  'react/src/meh/hangnem.gen.ts': buildHangnem(),
  'dist/css/beeco-tokens.css': buildCss(),
  'dist/css/beeco-fonts.css': buildFonts(),
  'dist/scss/_beeco.scss': buildScss(),
  'dist/tailwind/preset.cjs': buildTailwind(),
  'dist/dart/beeco_tokens.dart': buildDart(),
  'dist/tokens.json': buildJson(),
};
const check = process.argv.includes('--check');
let stale = 0;
for (const [f, content] of Object.entries(OUT)) {
  const p = path.join(ROOT, f);
  const old = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (old === content) continue;
  if (check) { console.log(`ELAVULT: ${f}`); stale++; continue; }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log(`írva: ${f}`);
}
if (check && stale) { console.log('→ futtasd: node tools/tokens-build.js'); process.exit(1); }
if (check) console.log('tokens-build: a dist/ friss');
