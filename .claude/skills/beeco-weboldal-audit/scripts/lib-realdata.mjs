// beeco-weboldal-audit · lib-realdata.mjs – valós felhasználói adatok (v3.1)
//  1) Chrome UX Report (CrUX) API: terepi LCP / INP / CLS (p75), előbb URL-szint, aztán origin-szint, PHONE.
//     Kulcs CSAK a CRUX_API_KEY környezeti változóból; sehova nem írjuk ki és nem mentjük.
//  2) Microsoft Clarity Data Export API (project-live-insights, dimension1=URL, numOfDays=3) vagy --clarity-file.
//     Token CSAK a CLARITY_API_TOKEN környezeti változóból.
// Mindkettő 24 órás lemez-gyorsítótárral (data/cache, gitignore-olt; a válaszok nem tartalmaznak titkot), hogy ne fogyjon a kvóta.
// Adat nélkül / kulcs nélkül: tájékoztató sor a jelentésben, levonás nélkül.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const TTL = 24 * 3600 * 1000;
const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
const hash = s => createHash('sha1').update(s).digest('hex').slice(0, 16);
const scrub = (s, secret) => { s = String(s ?? ''); return secret ? s.split(secret).join('***') : s; };
const pathOf = u => { try { return new URL(u).pathname.replace(/\/$/, '') || '/'; } catch { const p = String(u).split(/[?#]/)[0]; return (p.startsWith('/') ? p : '/' + p).replace(/\/$/, '') || '/'; } };

function cacheGet(dir, name) {
  try { const f = join(dir, name); if (!existsSync(f)) return null; const j = JSON.parse(readFileSync(f, 'utf8')); return Date.now() - j.t < TTL ? j : null; } catch { return null; }
}
function cachePut(dir, name, obj) { try { mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, name), JSON.stringify({ t: Date.now(), ...obj })); } catch {} }

// ------------------------------------------------------------ CrUX
const CRUX_URL = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
const CRUX_METRICS = ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift', 'first_contentful_paint', 'experimental_time_to_first_byte'];
export const CRUX_THRESH = { lcp: [2500, 4000], inp: [200, 500], cls: [0.1, 0.25] };
export const cruxRate = (k, v) => (v == null ? null : v <= CRUX_THRESH[k][0] ? 'good' : v <= CRUX_THRESH[k][1] ? 'ni' : 'poor');

/** Egy CrUX-lekérdezés. {status:200,data}|{status:404}|{error}. A kulcs soha nem kerül kimenetre. */
async function cruxCall(body, key, cacheDir) {
  const name = 'crux-' + hash(JSON.stringify(body)) + '.json';
  const c = cacheGet(cacheDir, name); if (c) return { ...c, cached: true };
  let res;
  try {
    const r = await fetch(`${CRUX_URL}?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    const txt = await r.text(); let j = null; try { j = JSON.parse(txt); } catch {}
    if (r.status === 200 && j) res = { status: 200, data: j };
    else if (r.status === 404) res = { status: 404 };
    else return { error: `HTTP ${r.status}${j && j.error && j.error.message ? ': ' + scrub(j.error.message, key).slice(0, 120) : ''}` };
  } catch (e) { return { error: scrub(e && e.message, key).slice(0, 100) || 'hálózati hiba' }; }
  cachePut(cacheDir, name, res);
  return res;
}
const num = x => (x == null ? null : +x);
function parseCrux(rec, level) {
  const m = rec.record.metrics || {}; const p = k => (m[k] && m[k].percentiles ? num(m[k].percentiles.p75) : null);
  const good = k => (m[k] && m[k].histogram && m[k].histogram[0] ? +(m[k].histogram[0].density * 100).toFixed(0) : null);
  const cp = rec.record.collectionPeriod; const d = x => (x ? `${x.year}-${String(x.month).padStart(2, '0')}-${String(x.day).padStart(2, '0')}` : '');
  return { level, formFactor: (rec.record.key && rec.record.key.formFactor) || 'PHONE', period: cp ? `${d(cp.firstDate)} – ${d(cp.lastDate)}` : '',
    lcp: p('largest_contentful_paint'), inp: p('interaction_to_next_paint'), cls: p('cumulative_layout_shift'), fcp: p('first_contentful_paint'), ttfb: p('experimental_time_to_first_byte'),
    goodPct: { lcp: good('largest_contentful_paint'), inp: good('interaction_to_next_paint'), cls: good('cumulative_layout_shift') } };
}
/** Egy oldal terepi adata. null = nincs kulcs. {none:true} = nincs adat. */
export async function cruxForPage(url, { key, cacheDir, originCache }) {
  if (!key) return { skipped: 'nincs kulcs (CRUX_API_KEY)' };
  let origin; try { origin = new URL(url).origin; } catch { return { skipped: 'érvénytelen URL' }; }
  const clean = url.split('#')[0];
  const a = await cruxCall({ url: clean, formFactor: 'PHONE', metrics: CRUX_METRICS }, key, cacheDir);
  if (a.error) return { error: a.error };
  if (a.status === 200) return { ...parseCrux(a.data, 'url'), cached: !!a.cached };
  const ok = `${origin}|PHONE`;
  if (!originCache.has(ok)) originCache.set(ok, await cruxCall({ origin, formFactor: 'PHONE', metrics: CRUX_METRICS }, key, cacheDir));
  const b = originCache.get(ok);
  if (b.error) return { error: b.error };
  if (b.status === 200) return { ...parseCrux(b.data, 'origin'), cached: !!b.cached };
  return { none: true };
}
export function cruxFindings(C, add) {
  if (!C || !C.level) return;
  const where = `${C.level === 'url' ? 'URL-szintű' : 'origin-szintű (az egész webhely, nem csak ez az oldal)'} terepi adat, mobil, p75, ${C.period}`;
  const R = (k, label, fmt, fixP1, fixP2, pts) => {
    const v = C[k], r = cruxRate(k, v); if (r !== 'poor' && r !== 'ni') return;
    const [g, p] = CRUX_THRESH[k];
    const org = C.level === 'origin'; // origin-szintű adatnál egy lépéssel enyhébb (poor → P2, javítandó → P3), hogy egy webhely-szintű érték ne buktassa minden oldal kapuját
    add('perf', r === 'poor' ? (org ? 'P2' : 'P1') : (org ? 'P3' : 'P2'), `perf.field-${k}`, `Valós látogatók ${label}${org ? ' (origin-szintű adat)' : ''}: ${fmt(v)} (${r === 'poor' ? 'rossz' : 'javítandó'}; cél ≤ ${fmt(g)}, rossz > ${fmt(p)})`, where, r === 'poor' ? fixP1 : fixP2, r === 'poor' ? pts[0] : pts[1], 'crux', 25);
  };
  R('lcp', 'LCP', v => `${(v / 1000).toFixed(1)} s`, 'A hero-kép legyen eager + fetchpriority=high, WebP/AVIF, kisebb méret; kevesebb blokkoló szkript.', 'Hero-kép: eager + fetchpriority=high, tömörítés; a harmadik fél szkriptek késleltetése.', [15, 6]);
  R('inp', 'INP (kattintás-reakció)', v => `${Math.round(v)} ms`, 'Kattintásra késik az oldal: a nehéz harmadik fél szkripteket (chat, mérők, reCAPTCHA) késleltesd, a hosszú feladatokat bontsd. A labor ezt nem méri.', 'Csökkentsd az indulás/kattintás közbeni JavaScriptet; a harmadik fél szkripteket késleltesd.', [15, 6]);
  R('cls', 'CLS (elrendezés-ugrás)', v => (+v).toFixed(2), 'Adj helyet a késve betöltődő elemeknek (kép width/height, aspect-ratio, widget-keret).', 'Képek width/height, aspect-ratio, fix magasság a widgetekhez.', [15, 6]);
}
export function cruxMd(pages, note) {
  const rows = pages.filter(p => !p.fatal && p.crux);
  const L = ['## Terepi adat (Chrome UX Report)', ''];
  if (note) { L.push(`_${note}_`, ''); return L; }
  const data = rows.filter(p => p.crux.level);
  if (!data.length) { L.push(`_Nincs terepi adat${rows.some(p => p.crux.error) ? ' (az API hibát adott: ' + cell(rows.find(p => p.crux.error).crux.error) + ')' : ' ezekhez az oldalakhoz (a CrUX csak elég forgalmú nyilvános URL-hez/origin-hez ad adatot; staging oldalhoz nincs)'}. Nincs levonás._`, ''); return L; }
  const f = (k, v) => (v == null ? '–' : k === 'lcp' ? `${(v / 1000).toFixed(2)} s` : k === 'cls' ? (+v).toFixed(2) : `${Math.round(v)} ms`);
  const mark = (k, v) => ({ good: '✓ ', ni: '~ ', poor: '✗ ' }[cruxRate(k, v)] || '');
  L.push('| Oldal | Szint | LCP (p75) | INP (p75) | CLS (p75) | FCP | TTFB | Időszak |', '|---|---|---|---|---|---|---|---|');
  for (const p of data) { const c = p.crux; L.push(`| ${cell(p.slug)} | ${c.level === 'url' ? 'URL' : 'origin'} | ${mark('lcp', c.lcp)}${f('lcp', c.lcp)} | ${mark('inp', c.inp)}${f('inp', c.inp)} | ${mark('cls', c.cls)}${f('cls', c.cls)} | ${c.fcp != null ? (c.fcp / 1000).toFixed(2) + ' s' : '–'} | ${c.ttfb != null ? Math.round(c.ttfb) + ' ms' : '–'} | ${cell(c.period)} |`); }
  L.push('', 'Küszöbök: LCP 2,5 / 4 s · INP 200 / 500 ms · CLS 0,1 / 0,25 (✓ jó, ~ javítandó, ✗ rossz). Az origin-szintű sor az egész webhely valós látogatóit jelenti, ezért minden oldalnál ugyanaz.', '');
  return L;
}

// ------------------------------------------------------------ Clarity
// Egyszerű formátum (--clarity-file): { "<url vagy útvonal>": { sessions, deadClicks, rageClicks, quickBacks, scrollDepth } }
//   sessions = munkamenetek száma; deadClicks / rageClicks / quickBacks = az ilyen viselkedést mutató MUNKAMENETEK száma
//   (vagy %-ban: deadClicksPct, rageClicksPct, quickBacksPct = a munkamenetek százaléka); scrollDepth = átlagos görgetési mélység, 0–100 %.
// API-alak (tömb {metricName, information[]}) is jó: DeadClickCount, RageClickCount, QuickbackClick, ScrollDepth, Traffic.
const lc = o => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k.toLowerCase(), v]));
const nn = x => (x == null || x === '' || isNaN(+x) ? null : +x);
function normSimple(v) {
  const o = lc(v); const s = nn(o.sessions);
  const pct = (cnt, p) => (nn(o[p]) != null ? nn(o[p]) : nn(o[cnt]) != null && s ? (nn(o[cnt]) / s) * 100 : null);
  return { sessions: s, dead_pct: pct('deadclicks', 'deadclickspct'), rage_pct: pct('rageclicks', 'rageclickspct'), quick_pct: pct('quickbacks', 'quickbackspct'), scroll_pct: nn(o.scrolldepth) };
}
function normApi(arr) {
  const out = new Map(); const slot = u => { const k = pathOf(u); if (!out.has(k)) out.set(k, { url: u }); return out.get(k); };
  for (const m of arr) {
    const name = String(m.metricName || '').toLowerCase().replace(/[^a-z]/g, '');
    for (const it of m.information || []) {
      const o = lc(it); const u = o.url || o.pageurl; if (!u) continue; const s = slot(u);
      const rate = nn(o.sessionswithmetricpercentage);
      if (/^deadclick/.test(name)) { s.dead_pct = rate; s.sessions = s.sessions ?? nn(o.subtotal) ?? nn(o.sessionscount); }
      else if (/^rageclick/.test(name)) { s.rage_pct = rate; s.sessions = s.sessions ?? nn(o.subtotal) ?? nn(o.sessionscount); }
      else if (/^quickback/.test(name)) { s.quick_pct = rate; s.sessions = s.sessions ?? nn(o.subtotal) ?? nn(o.sessionscount); }
      else if (/^scrolldepth/.test(name)) s.scroll_pct = nn(o.averagescrolldepth ?? o.scrolldepth ?? o.value);
      else if (name === 'traffic') s.sessions = nn(o.totalsessioncount) != null ? nn(o.totalsessioncount) - (nn(o.totalbotsessioncount) || 0) : s.sessions;
    }
  }
  return out;
}
/** -> { byPath: Map, source, note } */
export async function loadClarity({ file, token, cacheDir }) {
  try {
    if (file) {
      const j = JSON.parse(readFileSync(file, 'utf8'));
      if (Array.isArray(j)) return { byPath: normApi(j), source: 'fájl (API-alak)', note: '' };
      const m = new Map(); for (const [k, v] of Object.entries(j)) if (!k.startsWith('_') && v && typeof v === 'object') m.set(pathOf(k), { url: k, ...normSimple(v) });
      return { byPath: m, source: 'fájl', note: '' };
    }
    if (!token) return { byPath: new Map(), source: null, note: 'nincs Clarity-token (CLARITY_API_TOKEN) és nincs --clarity-file' };
    const name = 'clarity-url-3d.json'; const c = cacheGet(cacheDir, name);
    let arr = c && c.data, cached = !!c;
    if (!arr) {
      const r = await fetch('https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3&dimension1=URL', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) return { byPath: new Map(), source: null, note: `a Clarity API HTTP ${r.status}-t adott${r.status === 429 ? ' (napi kvóta: 10 kérés/projekt)' : r.status === 401 || r.status === 403 ? ' (a token hibás vagy lejárt)' : ''}` };
      arr = await r.json(); cachePut(cacheDir, name, { data: arr });
    }
    return { byPath: normApi(arr), source: `Clarity API, utolsó 3 nap${cached ? ' (gyorsítótárból)' : ''}`, note: '' };
  } catch (e) { return { byPath: new Map(), source: null, note: 'a Clarity-adat nem olvasható: ' + scrub(e && e.message, token).slice(0, 100) }; }
}
export const CLARITY_MIN_SESSIONS = 30, CLARITY_T = { rage: 2, dead: 10, quick: 15, scroll: 30 };
/** ctx.long: hosszú oldal (a görgetési mélység csak ott értelmezhető). */
export function clarityFindings(C, add, ctx = {}) {
  if (!C || C.sessions == null || C.sessions < CLARITY_MIN_SESSIONS) return;
  const ses = `${Math.round(C.sessions)} munkamenet (Clarity, utolsó 3 nap)`;
  const f1 = v => (+v).toFixed(1).replace('.', ',');
  if (C.rage_pct != null && C.rage_pct > CLARITY_T.rage) add('ux', 'P2', 'ux.clarity-rage', `Dühös kattintás a munkamenetek ${f1(C.rage_pct)} %-ában (küszöb > ${CLARITY_T.rage} %)`, ses, 'Nézd meg a Clarity-felvételeken, mire kattintanak ismételten: nem kattintható elemnek látszó dolog vagy lassú/hibás gomb.', 4, 'clar', 12);
  if (C.dead_pct != null && C.dead_pct > CLARITY_T.dead) add('ux', 'P2', 'ux.clarity-dead', `Halott kattintás a munkamenetek ${f1(C.dead_pct)} %-ában (küszöb > ${CLARITY_T.dead} %)`, ses, 'Tedd valódi linkké/gombbá, ami kattinthatónak látszik (kártyák, ikonok, képek), vagy vedd el a kattinthatóság látszatát.', 4, 'clar', 12);
  if (C.quick_pct != null && C.quick_pct > CLARITY_T.quick) add('ux', 'P2', 'ux.clarity-quickback', `Gyors visszalépés a munkamenetek ${f1(C.quick_pct)} %-ában (küszöb > ${CLARITY_T.quick} %)`, ses, 'A látogató gyorsan visszalép: az oldal nem azt ígéri, amiért jött. Nézd át a címet/leírást és a hajtás fölötti tartalmat.', 4, 'clar', 12);
  if (C.scroll_pct != null && ctx.long && C.scroll_pct < CLARITY_T.scroll) add('ux', 'P2', 'ux.clarity-scroll', `Átlagos görgetési mélység csak ${f1(C.scroll_pct)} % (küszöb < ${CLARITY_T.scroll} %, hosszú oldal)`, ses, 'A tartalom nagy része nem látszik: vidd följebb a legfontosabbat, rövidítsd az oldalt, erősítsd a hajtás fölötti kapaszkodót.', 4, 'clar', 12);
}
export function clarityMd(pages, L0) {
  const L = ['## Viselkedési adat (Microsoft Clarity)', ''];
  if (L0.note) { L.push(`_${cell(L0.note)}. Nincs levonás._`, ''); return L; }
  const rows = pages.filter(p => !p.fatal && p.clarity);
  if (!rows.length) { L.push(`_Forrás: ${L0.source}, de egyik auditált oldalhoz sincs sor. Nincs levonás._`, ''); return L; }
  const p1 = v => (v == null ? '–' : (+v).toFixed(1).replace('.', ',') + ' %');
  L.push(`Forrás: ${L0.source}. Elég adatnak ≥ ${CLARITY_MIN_SESSIONS} munkamenet számít; küszöbök: dühös > ${CLARITY_T.rage} % · halott > ${CLARITY_T.dead} % · gyors visszalépés > ${CLARITY_T.quick} % · görgetési mélység < ${CLARITY_T.scroll} % (hosszú oldalon).`, '', '| Oldal | Munkamenet | Dühös | Halott | Gyors visszalépés | Görgetés (átl.) |', '|---|---|---|---|---|---|');
  for (const p of rows) { const c = p.clarity; L.push(`| ${cell(p.slug)} | ${c.sessions ?? '–'}${c.sessions != null && c.sessions < CLARITY_MIN_SESSIONS ? ' (kevés, nem értékelt)' : ''} | ${p1(c.rage_pct)} | ${p1(c.dead_pct)} | ${p1(c.quick_pct)} | ${p1(c.scroll_pct)} |`); }
  L.push('');
  return L;
}
export const clarityFor = (L0, url) => (L0 && L0.byPath ? L0.byPath.get(pathOf(url)) || null : null);
