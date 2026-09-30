#!/usr/bin/env node
/* ============================================================
   check-tokens – a beeco design system EGY FORRÁSÁNAK őre (a DS-repóban fut, CI-ben is)
   1. A dist/ friss (tools/tokens-build.js --check).
   2. Kontraszt: a termékbőr minden kijelölt szín-párja WCAG AA, világosban ÉS sötétben.
   3. Párosság: a játékok kézzel írt tokens.css-e ugyanazt a hexet adja a közös neveken, mint a core.json,
      és a theme-jatek.json szerepei egyeznek a tokens.css szerepeivel.
   4. A termékbőr elemei (termek/css): nincs nyers szín, minden var(--bc-…) létezik,
      nincs ease-in, nincs 12 px alatti vagy nyers px betűméret, UI-átmenet ≤ 300 ms (kivétel: fiók).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const core = JSON.parse(rd('tokens/core.json'));
const termek = JSON.parse(rd('tokens/theme-termek.json'));
const jatek = JSON.parse(rd('tokens/theme-jatek.json'));
const hibak = [];
const hiba = m => hibak.push(m);

// 1. dist friss
try { execFileSync('node', [path.join(ROOT, 'tools/tokens-build.js'), '--check'], { stdio: 'pipe' }); }
catch (e) { hiba(`A dist/ elavult – futtasd: node tools/tokens-build.js\n${e.stdout}`); }

// 2. Kontraszt
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
for (const k of Object.keys(core.color)) if (!/^#[0-9A-F]{6}$/.test(core.color[k])) hiba(`core.color.${k}: nem nagybetűs #RRGGBB (${core.color[k]})`);
for (const mode of ['light', 'dark']) {
  const roles = termek.color[mode];
  for (const r of Object.keys(termek.color.light)) if (!roles[r]) hiba(`termek ${mode}: hiányzó szerep "${r}"`);
  for (const [fg, bg, min] of termek.contrast) {
    const a = core.color[roles[fg]], b = core.color[roles[bg]];
    if (!a || !b) { hiba(`kontraszt ${mode}: ismeretlen szerep ${fg}/${bg}`); continue; }
    const r = ratio(a, b);
    if (r < min) hiba(`kontraszt ${mode}: ${fg} (${a}) a ${bg}-on (${b}) = ${r.toFixed(2)}:1 < ${min}:1`);
  }
}

// 3. Párosság a játékok tokens.css-ével
const tcss = rd('web/css/tokens.css');
const decl = {};
for (const m of tcss.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) if (!(m[1] in decl)) decl[m[1]] = m[2].trim();
for (const [n, v] of Object.entries(core.color)) {
  if (decl[n] && /^#/.test(decl[n]) && decl[n].toUpperCase() !== v) hiba(`párosság: --${n} a tokens.css-ben ${decl[n]}, a core.json-ban ${v}`);
}
for (const [role, prim] of Object.entries(jatek.color.light)) {
  const d = decl[role];
  if (!d) hiba(`párosság: a theme-jatek.json "${role}" szerepe nincs a tokens.css-ben`);
  else if (d !== `var(--${prim})`) hiba(`párosság: --${role} a tokens.css-ben "${d}", a theme-jatek.json-ban var(--${prim})`);
}
const seq = [1, 2, 3, 4, 5].map(i => (decl[`scale-${i}`] || '').toUpperCase());
if (seq.join() !== core.data.seq.join()) hiba('párosság: a --scale-1..5 és a core.json data.seq eltér');

// 4. A termékbőr elemei
const gen = rd('dist/css/beeco-tokens.css');
const letezo = new Set([...gen.matchAll(/(--bc-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const dir = path.join(ROOT, 'termek/css');
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.css'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const hol = i => `${f}:${src.slice(0, i).split('\n').length}`;
  for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) hiba(`${hol(m.index)}: nyers szín ${m[0]} – szerep-tokent használj`);
  for (const m of src.matchAll(/\b(rgba?|hsla?)\(\s*\d/g)) hiba(`${hol(m.index)}: nyers ${m[1]}() – szerep-tokent használj`);
  for (const m of src.matchAll(/var\((--[a-z0-9-]+)/g)) if (m[1].startsWith('--bc-') && !letezo.has(m[1])) hiba(`${hol(m.index)}: nem létező token ${m[1]}`);
  for (const m of src.matchAll(/\bease-in\b(?!-out)/g)) hiba(`${hol(m.index)}: ease-in tilos (lassan indul, késésnek érződik)`);
  for (const m of src.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) hiba(`${hol(m.index)}: nyers betűméret ${m[1]}px – a --bc-fs-* skálát használd`);
  // Méz háttér → a szöveg on-accent (sötét módban az ink krém, a mézen olvashatatlan lenne)
  for (const m of src.matchAll(/\{([^{}]*background(?:-color)?\s*:\s*var\(--bc-accent\)[^{}]*)\}/g)) if (!/(^|[\s;])(color|--_ink)\s*:\s*var\(--bc-on-accent\)/.test(m[1])) hiba(`${hol(m.index)}: méz (accent) háttér on-accent szövegszín nélkül`);
  for (const m of src.matchAll(/transition[^;]*var\(--bc-t-slow\)[^;]*/g)) if (!/ease-drawer/.test(m[0])) hiba(`${hol(m.index)}: 400 ms-os átmenet csak fióknál (ease-drawer) – UI ≤ 300 ms`);
}
if (core.minTextSize < 12 || Object.values(core.fontSize).some(v => v < core.minTextSize)) hiba('A betűskála legkisebb eleme is legalább 12 px legyen');

if (hibak.length) { console.log(`check-tokens: ${hibak.length} hiba\n- ` + hibak.join('\n- ')); process.exit(1); }
console.log(`check-tokens: rendben – ${Object.keys(core.color).length} primitív, ${Object.keys(termek.color.light).length} termék-szerep × 2 mód, ${termek.contrast.length * 2} kontraszt-pár, párosság a játékokkal, ${fs.readdirSync(dir).length} elemfájl`);
