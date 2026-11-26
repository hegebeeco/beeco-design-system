// Kötelező navigációs ellenőrzés (Kristóf, 2026-11-04): bejárás (nav-crawl.py), gomb- és link-szabályok + kattintásmélység
// (nav-analyze.py), valódi kattintásteszt asztalon és telefonon (nav-journeys.mjs). Az eredmény 24 órán át a data/cache-ben él;
// ha nem futott le, a kapu FAIL (nav.missing, P1). Határértékek: reference/pontozas.md → Navigáció.
import { existsSync, readFileSync, statSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const PONT = { P0: 12, P1: 8, P2: 4, P3: 1 };

export function ensureNav(origin, { skillDir, file = null, maxAgeH = 24 } = {}) {
  if (file) { try { return { ...JSON.parse(readFileSync(file, 'utf8')), file }; } catch (e) { return { error: `a --nav fájl nem olvasható: ${e.message}` }; } }
  let host; try { host = new URL(origin).hostname; } catch { return { error: `érvénytelen origin: ${origin}` }; }
  const dir = join(skillDir, 'data', 'cache'); mkdirSync(dir, { recursive: true });
  const raw = join(dir, `nav-nyers-${host}.json`), out = join(dir, `nav-adat-${host}.json`);
  if (existsSync(out) && Date.now() - statSync(out).mtimeMs < maxAgeH * 3600e3) {
    try { const d = JSON.parse(readFileSync(out, 'utf8')); if (d.journeyTest) { console.log(`Navigációs ellenőrzés: a ${Math.round((Date.now() - statSync(out).mtimeMs) / 60000)} perces eredményt használom (${out})`); return { ...d, file: out, cached: true }; } } catch {}
  }
  console.log('Navigációs ellenőrzés (kötelező): bejárás, gomb- és link-szabályok, kattintásteszt asztalon és telefonon…');
  const S = join(skillDir, 'scripts');
  const steps = [
    ['python3', [join(S, 'nav-crawl.py'), '--base', origin, '--out', raw]],
    ['python3', [join(S, 'nav-analyze.py'), raw, '--out', out]],
    [process.execPath, [join(S, 'nav-journeys.mjs'), out, '--base', origin]],
  ];
  for (const [cmd, args] of steps) {
    const r = spawnSync(cmd, args, { encoding: 'utf8', env: process.env, timeout: 25 * 60e3, maxBuffer: 64 * 1024 * 1024 });
    const tail = String(r.stdout || '').trim().split('\n').filter(l => !/^\[pid=/.test(l)).slice(-3).join(' | ');
    if (r.status !== 0) return { error: `${args[0].split('/').pop()} hibával állt le: ${(String(r.stderr || '').split('\n').filter(l => l && !/^\[pid=/.test(l)).slice(-2).join(' ') || r.error?.message || r.status)}`.slice(0, 300) };
    if (tail) console.log('  ' + tail);
  }
  try { return { ...JSON.parse(readFileSync(out, 'utf8')), file: out }; } catch (e) { return { error: 'a navigációs eredmény nem olvasható: ' + e.message }; }
}

// oldalszintű leletek a „links” területbe (közös plafon: −12), plusz a célként tesztelt látogatói utak leletei
export function navPageFindings(nav, path, add) {
  if (!nav || nav.error) return;
  const p = path.replace(/\/+$/, '') || '/';
  for (const r of (nav.rules || {})[p] || []) add('links', r.sev, r.key, r.title, r.evidence, r.fix, r.pont ?? PONT[r.sev], 'nav', 12);
  for (const f of nav.siteRules || []) if (String(f.key).startsWith('nav.journey') && String(f.key).endsWith('|' + p)) add('links', f.sev, f.key, f.title, f.evidence, f.fix, PONT[f.sev], 'nav', 12);
}

// webhelyszintű leletek: a P1 (elakadt kattintásteszt, hibás belső cél, hiányzó ellenőrzés) a kaput is megállítja
export function navSiteFindings(nav) {
  if (!nav || nav.error) return [{ sev: 'P1', key: 'nav.missing', title: `A kötelező navigációs ellenőrzés nem futott le${nav && nav.error ? ': ' + nav.error : ''}`, fix: 'Futtasd újra a mérőt hálózattal (python3 és Playwright kell), vagy add meg a friss eredményt: --nav <nav-adat.json>.' }];
  return (nav.siteRules || []).map(f => ({ sev: f.sev, key: f.key, title: f.title, fix: f.fix, evidence: f.evidence }));
}

export function navMd(nav) {
  if (!nav) return [];
  if (nav.error) return ['## Navigáció (kötelező)', '', `- **Nem futott le:** ${nav.error}`, ''];
  const s = nav.summary || {}, jt = nav.journeyTest || {};
  const L = ['## Navigáció (kötelező)', '', `- Bejárt oldalak: ${s.pages} · legfeljebb 3 kattintásra: ${s.within3}% · átlag ${s.avg} kattintás · árva: ${s.orphans} · menü: ${(nav.menu || []).map(m => `${m.group} (${m.items})`).join(', ')} · lábléc: ${nav.footerLinks} link`,
    `- Kattintásteszt (${jt.at ? jt.at.slice(0, 16).replace('T', ' ') : '–'}, ${jt.base || ''}): ${(nav.journeys || []).filter(j => j.test && j.test.d.ok && j.test.m.ok).length}/${(nav.journeys || []).length} út sikeres asztalon és telefonon${nav.cached ? ' · gyorsítótárból' : ''}`, '',
    '| Látogató | Cél | Asztal | Telefon (lassú 4G) |', '|---|---|---|---|'];
  const cell = r => !r ? '–' : `${r.ok ? '✓' : '✗'} ${r.taps} mozdulat${(() => { const l = r.steps[r.steps.length - 1] || {}; return l.store ? ' · áruház' : l.lcp != null ? ` · ${(l.lcp / 1000).toFixed(1)} s` : l.why ? ' · ' + l.why.slice(0, 40) : ''; })()}`;
  for (const j of nav.journeys || []) L.push(`| ${j.who} | ${j.goal} | ${cell(j.test && j.test.d)} | ${cell(j.test && j.test.m)} |`);
  L.push('', ...(nav.siteRules || []).map(f => `- ${f.sev}: ${f.title}${f.fix ? ' – ' + f.fix : ''}`), '');
  return L;
}
