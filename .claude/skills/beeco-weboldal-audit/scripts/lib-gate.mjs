// beeco-weboldal-audit · lib-gate.mjs – élesítési kapu (v3, --gate).
// Egy oldal akkor megy át, ha: összpont ≥ 85, nincs P0, és nincs P1 – kivéve a reference/kivetelek.json-ban engedélyezett (és le nem járt) P1-eket.
// Kivétel-bejegyzés: { "path": "/szolgaltatas/cegeknek" | "*" | "/blog/*", "key": "measure.cta-silent" (előtagra is illik: key + "|"), "ok_reason": "…", "until": "ÉÉÉÉ-HH-NN" }

import { readFileSync, existsSync } from 'node:fs';

export const GATE_MIN = 85;
export function loadExceptions(file) {
  try { if (!existsSync(file)) return { list: [], note: 'nincs kivetelek.json' }; const j = JSON.parse(readFileSync(file, 'utf8')); return { list: Array.isArray(j.kivetelek) ? j.kivetelek : [], note: '' }; }
  catch (e) { return { list: [], note: 'a kivetelek.json nem olvasható: ' + e.message }; }
}
const pathOf = u => { try { return new URL(u).pathname.replace(/\/+$/, '') || '/'; } catch { return String(u); } };
const pathMatch = (pat, path) => pat === '*' || (pat.endsWith('/*') ? path === pat.slice(0, -2) || path.startsWith(pat.slice(0, -1)) : pat.replace(/\/+$/, '') === path || (pat === '/' && path === '/'));
const keyMatch = (pat, key) => key === pat || key.startsWith(pat + '|') || key.startsWith(pat + '.');

/** pages: pontozott oldalak; site: [{sev,title}] site-szintű leletek; → { enabled, min, pass, pages:[…], site:[…], exceptionNote } */
export function evaluateGate(pages, exceptions, { today = new Date(), site = [] } = {}) {
  const res = { enabled: true, min: GATE_MIN, pages: [], site: [], exceptionNote: exceptions.note || '' };
  for (const p of pages) {
    const reasons = [], waived = [], expired = [];
    if (p.fatal) reasons.push(`nem tölthető be: ${p.fatal}`);
    else {
      if (p.total < GATE_MIN) reasons.push(`összpont ${p.total} < ${GATE_MIN}`);
      const path = pathOf(p.url);
      for (const f of p.findings || []) {
        if (f.sev === 'P0') reasons.push(`P0: ${f.title}`);
        else if (f.sev === 'P1') {
          const ms = exceptions.list.filter(e => e && e.key && pathMatch(e.path || '*', path) && keyMatch(e.key, f.key));
          const live = ms.find(e => !e.until || new Date(e.until + 'T23:59:59') >= today), ex = live || ms[0];
          if (ex) { if (!live) { expired.push(`${f.title} (a kivétel lejárt: ${ex.until})`); reasons.push(`P1: ${f.title} (a kivétel lejárt: ${ex.until})`); } else waived.push(`${f.title} – kivétel: ${ex.ok_reason || '(indok nélkül)'}${ex.until ? ' · eddig: ' + ex.until : ''}`); }
          else reasons.push(`P1: ${f.title}`);
        }
      }
    }
    res.pages.push({ url: p.url, total: p.total, band: p.band, pass: reasons.length === 0, reasons, waived, expired });
  }
  for (const f of site) if (f.sev === 'P0' || f.sev === 'P1') res.site.push(f);
  res.pass = res.pages.every(x => x.pass) && res.site.length === 0;
  return res;
}
export function gateMd(g) {
  if (!g || !g.enabled) return [];
  const L = ['## Élesítési kapu', '', `Szabály: egy oldal akkor megy át, ha az összpont ≥ ${g.min}, nincs P0, és nincs P1 (kivéve a \`reference/kivetelek.json\`-ban engedélyezett, le nem járt kivételek).`, ''];
  L.push('| Oldal | Pont | Kapu |', '|---|---|---|');
  for (const p of g.pages) L.push(`| ${p.url} | ${p.total} (${p.band}) | **${p.pass ? 'PASS' : 'FAIL'}** |`);
  L.push('', `**Összesített ítélet: ${g.pass ? 'PASS' : 'FAIL'}** (${g.pages.filter(p => p.pass).length}/${g.pages.length} oldal megy át)`, '');
  for (const p of g.pages.filter(p => !p.pass)) { L.push(`- **FAIL – ${p.url}**`); for (const r of p.reasons.slice(0, 12)) L.push(`  - ${r}`); if (p.reasons.length > 12) L.push(`  - … és még ${p.reasons.length - 12}`); }
  for (const p of g.pages.filter(p => p.waived.length)) { L.push(`- Engedélyezett kivételek – ${p.url}`); for (const w of p.waived) L.push(`  - ${w}`); }
  for (const s of g.site) L.push(`- **FAIL – site-szint**: ${s.sev} ${s.title}`);
  if (g.exceptionNote) L.push(`- Megjegyzés: ${g.exceptionNote}`);
  L.push('', '_Élesítési kapu: minden kitett oldal (élesre kerülő vagy élő) csak akkor mehet élesbe / maradhat, ha átmegy a kapun; a FAIL listát Kristófnak meg kell mutatni az élesítési kérés előtt._', '');
  return L;
}
export function gateConsole(g) {
  if (!g || !g.enabled) return;
  console.log('\n=== Élesítési kapu ===');
  for (const p of g.pages) { console.log(`  ${p.pass ? 'PASS' : 'FAIL'}  ${p.url}  (${p.total}/100)`); if (!p.pass) for (const r of p.reasons.slice(0, 6)) console.log(`        - ${r}`); if (!p.pass && p.reasons.length > 6) console.log(`        … és még ${p.reasons.length - 6}`); }
  for (const s of g.site) console.log(`  FAIL  site-szint: ${s.sev} ${s.title}`);
  console.log(`  Összesített ítélet: ${g.pass ? 'PASS' : 'FAIL'} (${g.pages.filter(p => p.pass).length}/${g.pages.length} oldal)`);
}
