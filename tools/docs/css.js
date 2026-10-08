/* ============================================================
   beeco docs – CSS: egy csomagolt fájl a bc-all.css 22 @import-ja helyett, és a játékbőr-skin

   • csomag(): a termékbőr fájljai a bc-all.css sorrendjében, de CSAK azok, amelyeknek bc- osztálya előfordul a kész
     oldalakon (a tokenek, a betűk és az alap mindig). A url(../../web/assets/…) hivatkozások az assets/ mappára mutatnak.
   • skinJatek(): a --bc-* SZEREP-tokeneket a játékbőr (tokens/theme-jatek.json + core.json) értékeire képezi át – új
     szerepnév nincs, így ugyanaz a komponens-CSS más karaktert kap. Nyers szín nincs benne: minden szín var(--bc-<primitív>),
     az áttetsző árnyék color-mix() a primitívből (a theme-jatek.json rgba-értékeiből visszafejtve).
   ============================================================ */
'use strict';
const { read, json } = require('./alap');

function bcSorrend() {
  return [...read('termek/css/bc-all.css').matchAll(/@import url\("([^"]+)"\)/g)].map(m => m[1].replace(/^\.\.\/\.\.\//, '').replace(/^\.\//, 'termek/css/'));
}
const MINDIG = ['dist/css/beeco-tokens.css', 'dist/css/beeco-fonts.css', 'termek/css/bc-base.css'];
/** A CSS-fájl relatív url()-jei a csomag helyéhez (assets/docs.css): ../../web/assets/x → x */
function urlAt(css, fajl) {
  return css.replace(/url\((["']?)\.\.\/\.\.\/web\/assets\//g, 'url($1').replace(/@import[^;]+;/g, (m) => { throw new Error(`${fajl}: @import a csomagban (${m})`); });
}
/** @param {Set<string>} osztalyok a kész oldalakon használt osztálynevek */
function csomag(osztalyok, retegek) {
  const fajlok = bcSorrend();
  const kell = [], kihagyva = [];
  for (const f of fajlok) {
    if (MINDIG.includes(f)) { kell.push(f); continue; }
    // Akkor kell a fájl, ha van benne olyan szabály, amelynek MINDEN bc-osztálya előfordul az oldalakon
    // (a „.bc-map a.bc-btn” nem húzza be a térképet csak azért, mert van gomb).
    const src = read(f).replace(/\/\*[\s\S]*?\*\//g, '');
    const alkalmazhato = [...src.matchAll(/([^{}]+)\{[^{}]*\}/g)].some(m => m[1].split(',').some(sel => {
      const bc = [...sel.matchAll(/\.(bc-[a-z0-9-]+)/g)].map(x => x[1]);
      return bc.length && bc.every(c => osztalyok.has(c));
    }));
    if (alkalmazhato) kell.push(f); else kihagyva.push(f);
  }
  const reszek = kell.map(f => `/* ---- ${f} ---- */\n${urlAt(read(f), f)}`);
  for (const [nev, css] of retegek) reszek.push(`/* ---- ${nev} ---- */\n${css}`);
  return { css: `/* GENERÁLT (tools/docs) – a termékbőr szükséges fájljai egy csomagban + a docs réteg. Ne szerkeszd kézzel. */\n${reszek.join('\n')}\n`, kell, kihagyva };
}

// ---------- játékbőr-skin ----------
// A theme-jatek.json szerepei → a termékbőr (--bc-*) szerepei. Ugyanaz a jelentés, más érték.
const SZEREP_MAP = { bg: 'bg', surface: 'surface', ink: 'ink', 'ink-soft': 'ink-soft', line: 'line', accent: 'accent', 'on-accent': 'on-accent',
  'good-bg': 'success-bg', 'good-ink': 'success-ink', good: 'success', 'bad-bg': 'danger-bg', 'bad-ink': 'danger-ink' };
// A játékbőrben nem szereplő szerepek és a sötét mód: docs-site/skin-jatek-kiegeszites.json (a docs-oldal kiegészítése, nem hivatalos token)
const KIEG_F = 'docs-site/skin-jatek-kiegeszites.json';
const adat = o => Object.fromEntries(Object.entries(o || {}).filter(([k]) => !k.startsWith('_')));

function skinJatek() {
  const core = json('tokens/core.json'), jatek = json('tokens/theme-jatek.json'), kieg = json(KIEG_F);
  const POTLAS_VILAGOS = adat(kieg.vilagos_potlas), SOTET = adat(kieg.sotet), SA = adat(kieg.sotet_arnyek);
  const prim = n => { if (!core.color[n]) throw new Error(`skin: ismeretlen primitív: ${n}`); return `var(--bc-${n})`; };
  const hexNev = {}; for (const [n, h] of Object.entries(core.color)) hexNev[h.toUpperCase()] = n;
  // rgba(47,55,30,.18) → color-mix(in srgb, var(--bc-olive) 18%, transparent); var(--olive) → var(--bc-olive)
  const arnyek = s => String(s).replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g, (m, r, g, b, a) => {
    const hx = '#' + [r, g, b].map(v => Number(v).toString(16).padStart(2, '0')).join('').toUpperCase();
    const n = hexNev[hx]; if (!n) throw new Error(`skin: az árnyék színe (${m}) nem primitív`);
    return `color-mix(in srgb, var(--bc-${n}) ${Math.round(Number(a) * 100)}%, transparent)`;
  }).replace(/var\(--(?!bc-)([a-z-]+)\)/g, (m, n) => prim(n));
  const sor = (k, v) => `  --bc-${k}: ${v};`;
  const L = jatek.color.light;
  const vil = [];
  for (const [j, b] of Object.entries(SZEREP_MAP)) if (L[j]) vil.push(sor(b, prim(L[j])) + ` /* theme-jatek: ${j} */`);
  for (const [b, p] of Object.entries(POTLAS_VILAGOS)) vil.push(sor(b, prim(p)) + ' /* kiegészítés: docs-site/skin-jatek-kiegeszites.json */');
  const r = jatek.radius, sh = jatek.shadow;
  const forma = [
    sor('bw-base', `${jatek.border.base}px`) + ' /* theme-jatek: border.base */',
    sor('r-xs', `${r.s}px`), sor('r-s', `${r.s}px`), sor('r-m', `${r.m}px`), sor('r-l', `${r.l}px`), sor('r-pill', `${r.pill}px`),
    // puha, függőleges árnyék; a lenyomás lefelé visz (x: 0)
    sor('shadow-s', arnyek(sh['soft-sm'])), sor('shadow-s-x', '0px'), sor('shadow-s-y', '3px'),
    sor('shadow-m', arnyek(sh.soft)), sor('shadow-m-x', '0px'), sor('shadow-m-y', '4px'),
    sor('shadow-l', arnyek(sh.soft)), sor('shadow-l-x', '0px'), sor('shadow-l-y', '4px'),
    sor('shadow-soft', arnyek(sh.soft)),
  ];
  const sot = Object.entries(SOTET).map(([b, p]) => sor(b, prim(p)));
  const arnyekSor = l => l.map(x => { if (!core.color[x.szin]) throw new Error(`skin: ismeretlen primitív: ${x.szin}`); return `0 ${Number(x.y)}px ${Number(x.blur) ? Number(x.blur) + 'px ' : '0 '}color-mix(in srgb, var(--bc-${x.szin}) ${Number(x.alfa)}%, transparent)`; }).join(', ');
  if (!SA['shadow-s'] || !SA['shadow-m']) throw new Error(`${KIEG_F}: a sotet_arnyek shadow-s és shadow-m kell`);
  const sotetArnyek = [sor('shadow-s', arnyekSor(SA['shadow-s'])), sor('shadow-m', arnyekSor(SA['shadow-m'])), sor('shadow-l', 'var(--bc-shadow-m)'), sor('shadow-soft', 'var(--bc-shadow-m)')];
  return `/* GENERÁLT (tools/docs/css.js) – JÁTÉKBŐR-SKIN a Brand Bookhoz: a --bc-* szerepek a theme-jatek.json + core.json értékeivel.
   Forrás: tokens/theme-jatek.json (szerepek, sarok, keret, árnyék) · tokens/core.json (primitívek) ·
   ${KIEG_F} (a hiányzó szerepek és a sötét mód – a docs-oldal kiegészítése, nem a játékbőr hivatalos tokenje). */
:root, :root[data-theme="light"] {
  color-scheme: light;
${vil.join('\n')}
${forma.join('\n')}
}
:root[data-theme="dark"] {
  color-scheme: dark;
${sot.join('\n')}
${sotetArnyek.join('\n')}
}
@media (prefers-color-scheme: dark) {
  :root[data-theme="auto"] {
    color-scheme: dark;
${sot.map(s => '  ' + s).join('\n')}
${sotetArnyek.map(s => '  ' + s).join('\n')}
  }
}
`;
}

module.exports = { csomag, skinJatek, bcSorrend };
