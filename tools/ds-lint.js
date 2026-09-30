#!/usr/bin/env node
/* ============================================================
   ds-lint – a beeco TERMÉKBŐR ellenőrzője a fogyasztó projektekben (admin, partner, web)
   Mit keres (szabályonként számol, fájlonként):
     raw-color      nyers szín (#hex, rgb(), hsl(), Tailwind [#…]) a tokenfájlokon kívül
     tw-palette     Tailwind alap-paletta osztály (bg-gray-100 …) – a beeco presetben NEM létezik, csendben stílus nélkül marad
     font-foreign   idegen betűcsalád (Inria, Roboto, Bricolage, Inter, Arial, Helvetica) vagy serif tartalék
     font-size-raw  nyers betűméret (px/rem/em) token helyett; Tailwind text-[…]
     tiny-text      12 px alatti szöveg (olvashatatlan) – mindig hiba
     radius-raw     nyers border-radius (0, 50% és 999px kivétel)
     shadow-raw     nyers box-shadow token helyett
     ease-in        ease-in görbe (UI-n tilos)
     outline-none   fókusz-keret eltüntetése :focus-visible pótlás nélkül
   RACSNI: az első futás felírja a mostani állapotot (.beeco-ds-baseline.json); utána egy fájl
   egy szabálya sem nőhet, új fájl pedig tisztán indul. Javítás után: --update (csak csökkenhet).
   Használat:  node ds-lint.js [projekt-mappa] [--update] [--init] [--json]
               (npm-ből: npx beeco-ds-lint)
   ============================================================ */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const ROOT = path.resolve(args.find(a => !a.startsWith('--')) || '.');
const CFG_FILE = path.join(ROOT, '.beeco-ds.json');
const BASE_FILE = path.join(ROOT, '.beeco-ds-baseline.json');
const DEFAULT_CFG = { skin: 'termek', include: ['src'], exclude: ['node_modules', 'dist', 'build', '.claude', 'coverage'], allow: [] };
const cfg = { ...DEFAULT_CFG, ...(fs.existsSync(CFG_FILE) ? JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')) : {}) };
const EXT = /\.(css|scss|sass|less|tsx|ts|jsx|js|vue|svelte|html)$/;

const TW_COLORS = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const RULES = {
  'raw-color': [/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F-])|\b(?:rgba?|hsla?)\(\s*\d|-\[#[0-9a-fA-F]+\]/g],
  'tw-palette': [new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|divide|placeholder|shadow)-(?:${TW_COLORS})-\\d{2,3}\\b`, 'g')],
  'font-foreign': [/\b(?:Inria|Roboto|Bricolage|Inter|Helvetica|Arial(?! Rounded))\b|,\s*serif\s*[;"'}]/g],
  'font-size-raw': [/font-size\s*:\s*-?\d*\.?\d+(?:px|rem|em)\b|fontSize\s*:\s*['"]?\d|\btext-\[\d/g],
  'tiny-text': [/font-size\s*:\s*(?:(?:[0-9]|1[01])(?:\.\d+)?px|0?\.[0-6]\d*rem)\b|\btext-\[(?:[0-9]|1[01])px\]/g],
  'radius-raw': [/border-radius\s*:\s*(?!0\s*[;}]|50%|999px|var\(|inherit)[^;}]*\d(?:px|rem|em)|\brounded-\[\d/g],
  'shadow-raw': [/box-shadow\s*:\s*(?!none|var\(|inherit)[^;}]*\d|\bshadow-\[\d/g],
  'ease-in': [/\bease-in\b(?!-out)|\bCurves\.easeIn\b/g],
  'outline-none': [/outline\s*:\s*(?:none|0)\b|\boutline-none\b/g],
};
// Ezekben a fájlokban lakhat nyers érték (tokenfájl, generált kimenet)
const TOKEN_FILE = /(beeco-tokens|_beeco|tokens?)\.(s?css|json|js|cjs|ts)$|preset\.cjs$/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (cfg.exclude.includes(e.name) || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}
const files = cfg.include.flatMap(d => fs.existsSync(path.join(ROOT, d)) ? walk(path.join(ROOT, d)) : []);
const counts = {}; const examples = {};
for (const f of files) {
  const rel = path.relative(ROOT, f);
  if (cfg.allow.some(a => rel.startsWith(a)) || TOKEN_FILE.test(rel)) continue;
  // Megjegyzések ki (a magyarázó szövegben lévő szín ne számítson)
  const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const hasFocusVisible = /focus-visible/.test(src);
  for (const [rule, [re]] of Object.entries(RULES)) {
    const m = src.match(re);
    let n = m ? m.length : 0;
    if (rule === 'outline-none' && hasFocusVisible) n = 0;
    if (!n) continue;
    (counts[rel] ||= {})[rule] = n;
    (examples[rule] ||= []).push(`${rel} (${n}): ${m[0].slice(0, 50)}`);
  }
}

const total = r => Object.values(counts).reduce((s, c) => s + (c[r] || 0), 0);
const base = fs.existsSync(BASE_FILE) ? JSON.parse(fs.readFileSync(BASE_FILE, 'utf8')) : null;
const write = () => {
  if (!fs.existsSync(CFG_FILE)) fs.writeFileSync(CFG_FILE, JSON.stringify(DEFAULT_CFG, null, 2) + '\n');
  fs.writeFileSync(BASE_FILE, JSON.stringify({ _readme: 'beeco ds-lint racsni – ennél TÖBB nem lehet. Csökkentés után: npx beeco-ds-lint --update', files: counts }, null, 1) + '\n');
};

console.log(`beeco ds-lint (${cfg.skin}) – ${files.length} fájl, ${ROOT}`);
for (const r of Object.keys(RULES)) console.log(`  ${r.padEnd(14)} ${String(total(r)).padStart(5)}${base ? `   (racsni: ${Object.values(base.files).reduce((s, c) => s + (c[r] || 0), 0)})` : ''}`);

if (args.includes('--init') || !base) {
  write();
  console.log(`\nRacsni felírva: ${path.basename(BASE_FILE)} – innentől egyik szám sem nőhet.`);
  process.exit(0);
}
const worse = [];
for (const [f, c] of Object.entries(counts)) for (const [r, n] of Object.entries(c)) {
  const was = base.files[f]?.[r] || 0;
  if (n > was || (r === 'tiny-text' && n > was)) worse.push(`${f}: ${r} ${was} → ${n}`);
}
if (worse.length) {
  console.log(`\nROMLOTT (${worse.length}) – javítsd tokenre / beeco-elemre:\n  ` + worse.join('\n  '));
  console.log('\nSegítség: docs/termek-arculat.md (beeco-design-system)');
  process.exit(1);
}
const better = Object.entries(base.files).some(([f, c]) => Object.entries(c).some(([r, n]) => (counts[f]?.[r] || 0) < n));
if (args.includes('--update')) { write(); console.log('\nRacsni frissítve (csökkent).'); }
else if (better) console.log('\nJavult! Rögzítsd: npx beeco-ds-lint --update');
console.log('\nds-lint: rendben (nem romlott)');
