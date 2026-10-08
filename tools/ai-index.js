#!/usr/bin/env node
/* ============================================================
   ai-index – docs/AI.md: tömör index ügynököknek (docs/ai-munkamod.md 1.)
   Minden React-komponens egy sorban (fő propok, CSS-osztály, mikor kell, szint, új-e), tokenszerepek, CSS-only elemek,
   szabályok, tesztek. Forrás: dist/react/types (JSDoc + propok), react/src (CSS-osztály), termek/css, tokens/, CHANGELOG.md.
   Használat:  node tools/ai-index.js           (ír)
               node tools/ai-index.js --check   (friss-e; CI)
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { reactApi } = require('./api-check');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/AI.md');
const rd = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const react = reactApi(ROOT, { docs: true });
const nevek = Object.keys(react).sort();

/* --- csoportok (a react/src mappái, a katalógus sorrendjében) --- */
const CSOPORT = [['field', 'inputs', 'pickers', 'form', 'cx', '01 Űrlap (alap)'], ['adat', '02 Adat és grafikon'], ['reteg', '03 Rétegek és navigáció'],
  ['media', '04 Média és speciális'], ['meh', '05 Méhecske, mozgás, szöveg'], ['kieg', '06a Kiegészítők'], ['kieg2', '06b Hely, sorsolás, videó'],
  ['sablon', '06c Oldalsablonok'], ['ut', '06d Út (szakasztérkép)'], ['csapat', '06e Csapat-egészség'], ['tema', 'Téma'], ['marka', 'Márka']];
const csoportja = (fajl) => { const m = fajl.split('/')[0].replace(/\.\w+$/, ''); return (CSOPORT.find((c) => c.slice(0, -1).includes(m)) || [null, 'Egyéb']).slice(-1)[0]; };

/* --- „új”: a név szerepel a legutóbbi 3 MELLÉK verzió CHANGELOG-szakaszában. A „## Készül” szakasz egy helynek számít,
   így egy mellékverzió kiadása (Készül → X.Y.0) nem tolja el az ablakot, és nem írja át ezt a fájlt. Verziószám nincs a kimenetben. --- */
const ujSzoveg = (() => {
  const s = rd('CHANGELOG.md'); const reszek = s.split(/^## /m).slice(1); const minorok = []; const ki = [];
  for (const r of reszek) { const m = /^Készül/.test(r) ? [0, 'kesz', 'ul'] : /^(\d+)\.(\d+)\.\d+/.exec(r); if (!m) continue; const mm = `${m[1]}.${m[2]}`;
    if (!minorok.includes(mm)) { if (minorok.length === 3) break; minorok.push(mm); } ki.push(r); }
  return ki.join('\n');
})();
const uj = (n) => new RegExp('`' + n + '`').test(ujSzoveg);

/* --- CSS-osztály a forrásból: az első bc- osztály a komponens deklarációja után --- */
const forrasCache = {};
function cssOsztaly(nev, fajl) {
  const alap = path.join(ROOT, 'react/src', fajl);
  const p = ['.tsx', '.ts'].map((x) => alap + x).find((x) => fs.existsSync(x)); if (!p) return '';
  const s = forrasCache[p] ??= fs.readFileSync(p, 'utf8');
  const i = s.search(new RegExp(`(function\\s+${nev}\\b|const\\s+${nev}\\b)`));
  const resz = i >= 0 ? s.slice(i, i + 4000) : s;
  // előbb a className-ben álló (a gyökérelemé jellemzően az első), aztán bármely bc- szöveg
  const m = /className=\{?\s*(?:cx\()?\s*['"`]([^'"`]*?\b)?(bc-[a-z][a-z0-9-]*)/.exec(resz) || /['"`\s]()(bc-[a-z][a-z0-9-]*)/.exec(resz);
  return m ? m[2] : '';
}

/* --- JSDoc → szint + egy mondat --- */
function leiras(doc = '') {
  let d = doc.replace(/\{@link\s+([^}]+)\}/g, '$1');
  let szint = '';
  const m = /^[\w ./–-]{0,60}?\(([^)]*)\)\s*:\s*/.exec(d);
  if (m) { const sz = /(atom|molekula|organizmus|sablon|hook|segéd)/i.exec(m[1]); if (sz) szint = sz[1].toLowerCase(); d = d.slice(m[0].length); }
  // mondatvég, de nem rövidítésnél (pl. min. kb. stb.)
  const vedett = d.replace(/\b(pl|min|max|kb|stb|ill|ld|vö|db|ún|Kft|ford)\./g, '$1\u2024');
  const mondat = ((/^(.{20,}?[.!?])(\s|$)/.exec(vedett) || [null, vedett])[1]).replace(/\u2024/g, '.');
  return { szint, mit: mondat.length > 130 ? mondat.slice(0, 127).replace(/\s+\S*$/, '') + '…' : mondat };
}

/* --- propok tömören: kötelező*, rövid szó-unió, +attr --- */
function propok(e) {
  const p = Object.entries(e.props || {}).filter(([n]) => n !== 'className' && n !== 'children' && n !== 'ref');
  p.sort(([a, x], [b, y]) => (y.kotelezo ? 1 : 0) - (x.kotelezo ? 1 : 0) || a.localeCompare(b));
  const egy = ([n, x]) => {
    const t = x.t.replace(/ \| undefined/g, '');
    const lit = /^("[^"]*"( \| "[^"]*")*)$/.test(t) ? t.split(' | ') : null;
    const tipus = lit ? (lit.length <= 4 ? lit.map((v) => v.replace(/"/g, "'")).join('|') : lit.slice(0, 3).map((v) => v.replace(/"/g, "'")).join('|') + '|…')
      : t === 'boolean' ? 'bool' : /^\(.*\) => /.test(t) ? 'fn' : t === 'ReactNode' ? '' : t.length <= 14 ? t : '';
    return `${n}${x.kotelezo ? '*' : ''}${tipus ? ':' + tipus : ''}`;
  };
  const max = 9; const ki = p.slice(0, max).map(egy);
  if (p.length > max) ki.push(`+${p.length - max}`);
  if (e.htmlAttr) ki.push('…attr');
  return ki.join(', ');
}

const L = [];
L.push('# beeco DS – AI-index', '',
  '> GENERÁLT (`node tools/ai-index.js`) – ne szerkeszd. **Ezt olvasd először**; a `dist/`-et ne nyisd meg (generált).',
  '> Munkamód, kiadás, szabályok: `docs/ai-munkamod.md`. Részletes szabálykönyv csak ha kell: `docs/komponensek.md`, `docs/termek-arculat.md`.', '');
L.push('## Használat a projektben', '',
  '- React: `import { Button, TextField } from \'@beeco/design-system/react\'` + egyszer `import \'@beeco/design-system/termek.css\'`.',
  '- CSS egyenként: `@beeco/design-system/termek/<bc-fájl>.css` · SCSS: `@use \'@beeco/design-system/dist/scss/beeco\' as bc;` · Tailwind: `presets: [require(\'@beeco/design-system/tailwind\')]` · Flutter: `dist/dart/beeco_tokens.dart`.',
  '- Telepítés címkével: `npm i github:hegebeeco/beeco-design-system#vX.Y.Z` (a verzió: `VERSION`).', '');
L.push('## Munkamenet és ellenőrzés', '',
  '- Munka közben **csak** egy komponens: `npm run check:egy -- <tesztlap vagy Komponens>` (pl. `utvonal`, `TextField`): csak azt építi és teszteli (2 nézet).',
  '- A végén egyszer: `npm run build && npm test` (= CI). Generált: `dist/`, `termek/tesztlapok/*.html`, `api/api.json`, `docs/AI.md`.',
  '- Tesztek helye: tesztlap `react/tesztlapok/<lap>.tsx` (+ `termek/tesztlapok/<lap>.test.mjs` forgatókönyv); futtató `tests/check-komponensek.js [lap…] [--gyors]`.',
  '- API-őr: `node tools/api-check.js` (eltűnő név/prop = hiba); változás után `--write`.', '');
L.push('## Szabályok (top 10)', '',
  '1. Meglévőből dolgozz: DS React-komponens → `bc-` CSS-elem → projekt-komponens → tokenekből. Új elem/változat csak Kristóf jóváhagyásával (`docs/javaslatok/`).',
  '2. Csak tokenek/szerepek (`var(--bc-ink)`, `bc.$bc-ink`, `text-ink`); nyers szín, px betűméret/sarok/árnyék tilos; a Tailwind alap-palettája nincs.',
  '3. Név soha nem változik és nem törlődik (token, osztály, export, prop) – csak bővíts. Az `api-check` megfogja.',
  '4. Szöveg a mézen (`accent`) mindig `on-accent`; kattintható és kiemelt elem: kemény, átlós árnyék (`shadow-s/m/l`), nem kattintható információs doboz: `shadow-soft` (`docs/termek-arculat.md` 6/A).',
  '5. Lalezar csak cím/szám/gomb, Open Sans minden más; 12 px alatt nincs szöveg.',
  '6. UI-visszajelzés ≤ 300 ms, `ease-out`; fiók 400 ms; belépő/dekoratív animáció ≤ 900 ms (`t-decor`, `t-hero`), csak token; `ease-in` tilos; csökkentett mozgásnál nincs mozgás.',
  '7. 44 px érintés, látható `:focus-visible` (kifelé: `outline-offset ≥ 2px`), ikongombon `aria-label`, kattintható elem `<a>`/`<button>`.',
  '8. Minden állapot: töltés, üres, hiba (következő lépéssel), siker, tiltott. Szöveg magyarul, tegezve; feliratok `labels`-szel felülírhatók.',
  '9. Gombszabály (egy forrás: `docs/termek-arculat.md` 6/A): egy méz fő gomb; kompakt helyen ikon-gomb `TooltipIconButton`-nal; fő gomb szöveg + piktogram (`IcSave`, `IcTrash`, `IcNew`…).',
  '10. Ne szerkeszd: `dist/`, `termek/tesztlapok/*.html`, `docs/AI.md`; feature-ágon ne emelj verziót; titok soha (publikus repó).', '');

/* --- tokenek --- */
const core = JSON.parse(rd('tokens/core.json')); const termek = JSON.parse(rd('tokens/theme-termek.json'));
const szerepek = Object.keys(termek.color.light);
L.push('## Tokenek (termékbőr)', '',
  `- **Szín-szerepek** (\`--bc-<szerep>\`, Tailwind \`bg-/text-/border-<szerep>\`, sötét módban maguktól váltanak): ${szerepek.map((r) => `\`${r}\``).join(' ')}.`,
  `- Világos → sötét: ${['bg', 'surface', 'ink', 'line', 'accent', 'on-accent'].map((r) => `${r} ${termek.color.light[r]}→${termek.color.dark[r]}`).join(' · ')}.`,
  `- Betű \`--bc-fs-*\`: ${Object.entries(core.fontSize).map(([k, v]) => `${k} ${v}`).join(' · ')} px; vastagság \`--bc-fw-*\`: ${Object.keys(core.fontWeight).join(', ')}.`,
  `- Térköz \`--bc-sp-*\`: ${Object.entries(core.space).map(([k, v]) => `${k}=${v}`).join(' ')} px · sarok \`--bc-r-*\`: ${Object.entries(termek.radius).map(([k, v]) => `${k}=${v}`).join(' ')} · keret \`--bc-bw-*\`: ${Object.keys(termek.border).join(', ')}.`,
  `- Árnyék \`--bc-shadow-*\`: ${Object.keys(termek.shadow).filter((k) => !k.startsWith('_')).join(', ')} (kemény) · idő \`--bc-t-*\`: ${Object.entries(core.duration).map(([k, v]) => `${k} ${v}ms`).join(', ')} · \`--bc-ease-out\` · \`--bc-tap\` 44 px.`,
  `- Adatskálák: \`--bc-data-seq-1…\`, \`div\`, \`-cb\` (színtévesztő-barát), \`allapot\`, \`cat-1…${core.data.categorical.length}\`. Primitívek (\`--bc-honey\`…) csak adatvizualizációhoz.`, '');

/* --- komponensek --- */
const komp = nevek.filter((n) => react[n].fajta === 'komponens');
const ujak = komp.filter(uj);
L.push(`## React-komponensek (${komp.length}; mind: \`@beeco/design-system/react\`)`, '',
  'Sor: **Név** `forrás` — fő propok (`*` kötelező, `…attr` = natív attribútumok is) · `.bc-osztály` · szint · mire. 🆕 = a legutóbbi 3 mellékverzióban jött.', '');
const csoportok = new Map();
for (const n of komp) { const g = csoportja(react[n].fajl); if (!csoportok.has(g)) csoportok.set(g, []); csoportok.get(g).push(n); }
const sorrend = [...CSOPORT.map((c) => c.slice(-1)[0]), 'Egyéb'];
for (const g of sorrend.filter((x) => csoportok.has(x))) {
  L.push(`### ${g}`);
  for (const n of csoportok.get(g)) {
    const e = react[n];
    if (/^Ic[A-Z]/.test(n)) continue; // piktogramok külön sorban
    const { szint, mit } = leiras(e.doc);
    const css = cssOsztaly(n, e.fajl);
    L.push(`- **${n}**${uj(n) ? ' 🆕' : ''} \`${e.fajl}\` — ${propok(e) || '–'}${css ? ` · \`.${css}\`` : ''}${szint ? ` · ${szint}` : ''}${mit ? ` · ${mit}` : ''}`);
  }
  const ik = csoportok.get(g).filter((n) => /^Ic[A-Z]/.test(n));
  if (ik.length) L.push(`- Piktogramok: ${ik.map((n) => `\`${n}\``).join(' ')}`);
  L.push('');
}

/* --- hookok, segédek, állandók --- */
const tobbi = (f) => nevek.filter((n) => react[n].fajta === f);
L.push('## Hookok, segédek, állandók', '',
  `- **Hookok:** ${tobbi('hook').map((n) => `\`${n}\``).join(' ')}`,
  `- **Segédfüggvények:** ${tobbi('fuggveny').map((n) => `\`${n}\``).join(' ')}`,
  `- **Állandók:** ${tobbi('ertek').map((n) => `\`${n}\``).join(' ')}`,
  `- **Típusok:** ${tobbi('tipus').length} db (\`<Komponens>Props\`, \`…Labels\` stb.) – a \`dist/react/index.d.ts\` adja; nem kell megnyitni.`, '');

/* --- CSS-only elemek: bc- gyökérosztályok, amelyeket egy React-forrás sem használ --- */
const reactSrc = (function osszes(d) { return fs.readdirSync(d, { withFileTypes: true }).map((f) => f.isDirectory() ? osszes(path.join(d, f.name)) : /\.(tsx?|css)$/.test(f.name) ? fs.readFileSync(path.join(d, f.name), 'utf8') : '').join('\n'); })(path.join(ROOT, 'react/src'));
const hasznalt = new Set(reactSrc.match(/bc-[a-z][a-z0-9-]*/g) || []);
L.push('## CSS-elemek (`termek/css/<fájl>`; React nélkül is: SCSS/Tailwind/HTML-proto/Webflow)', '',
  'Fájlonként a `bc-` gyökérosztályok (a `bc-x-…` alosztályok a gyökér alatt). **°** = CSS-only: nincs React-párja.', '');
const kihagy = new Set(['bc-all.css', 'bc-tesztlap.css']);
for (const f of fs.readdirSync(path.join(ROOT, 'termek/css')).filter((x) => x.endsWith('.css') && !kihagy.has(x)).sort()) {
  const s = rd(`termek/css/${f}`).replace(/\/\*[\s\S]*?\*\//g, '');
  const cls = [...new Set([...s.matchAll(/\.(bc-[a-z][a-z0-9-]*)/g)].map((m) => m[1]))];
  const gyok = cls.filter((c) => !cls.some((d) => d !== c && c.startsWith(d + '-'))).sort();
  const max = 40;
  if (gyok.length) L.push(`- \`${f}\`: ${gyok.slice(0, max).map((c) => `\`${c}\`${hasznalt.has(c) ? '' : '°'}`).join(' ')}${gyok.length > max ? ` +${gyok.length - max}` : ''}`);
}
L.push('- Módosítók: `is-*` (pl. `is-ghost`, `is-danger`, `is-flat`, `is-icon`); a teljes lista: `api/api.json` → `css.is`.', '');
L.push('## Játékbőr (webjátékok)', '',
  '- Nem ez a skill: töltsd be a `beeco-arculat`-ot. Közös fájlok a `tools/kit-sync.js`-sel (`KIT-FILES.json`); globális nevek (`DS`, `pic`, `ART`, `MODEL`…) és `ds-` osztályok: `api/api.json` → `jatekJs`, `css.jatek`.', '');
L.push(`*${komp.length} komponens · ${ujak.length} új · ${tobbi('hook').length} hook. A verzió: \`VERSION\` (szándékosan nincs itt, hogy a verzióemelés ne írja át).*`);

const szoveg = L.join('\n') + '\n';
if (process.argv.includes('--check')) {
  const regi = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (regi !== szoveg) { console.log('ELAVULT: docs/AI.md → node tools/ai-index.js'); process.exit(1); }
  console.log(`ai-index: a docs/AI.md friss (${L.length} sor)`);
} else if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== szoveg) { fs.writeFileSync(OUT, szoveg); console.log(`írva: docs/AI.md (${L.length} sor)`); }
