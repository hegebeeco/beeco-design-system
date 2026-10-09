/* A szabály-számok szinkronja: a prózában (DESIGN.md, AI.md, szabálykönyvek, skill, dokumentációs oldal) szereplő
   érintési méret és mozgás-időtartamok egyezzenek a tokenekkel (tokens/core.json). Egy szám forrása a token, nem a szöveg.
   A jelszavas „300 ms” a UI-mozgás szabályos felső határa (nem token), az engedett értékek: a duration tokenek + 300. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const core = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/core.json'), 'utf8'));
const FAJLOK = ['DESIGN.md', 'docs/AI.md', 'docs/termek-arculat.md', 'docs/rendszer.md', 'docs/komponensek.md', '.claude/skills/beeco-ds/SKILL.md',
  ...fs.readdirSync(path.join(ROOT, 'docs-site/ds')).filter(f => f.endsWith('.json') && !/nav|kategoriak/.test(f)).map(f => `docs-site/ds/${f}`)];
const idok = new Set([...Object.values(core.duration), 300]);
const hibak = [];
for (const f of FAJLOK) {
  const p = path.join(ROOT, f); if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/(?:érint(?:és|ési|ő|het)\w*|tap)[^.\n|]{0,40}?(\d+)\s?px/gi)) if (+m[1] !== core.tap && !/16 px|18 px|24 px/.test(m[0])) hibak.push(`${f}: érintési méret ${m[1]} px, a token ${core.tap} px („${m[0].slice(0, 60)}”)`);
  for (const m of t.matchAll(/(?:mozgás|időtartam|animáci)[^.\n|]{0,60}?(\d{2,4})\s?ms/gi)) if (!idok.has(+m[1])) hibak.push(`${f}: mozgás-idő ${m[1]} ms nem egyezik a tokenekkel (${[...idok].join(', ')}) („${m[0].slice(0, 70)}”)`);
}
if (hibak.length) { console.error(`szabály-szinkron: ${hibak.length} eltérés\n- ${[...new Set(hibak)].join('\n- ')}`); process.exit(1); }
console.log(`szabály-szinkron: rendben (${FAJLOK.length} fájl: tap ${core.tap} px, mozgás ${[...idok].join('/')} ms)`);
