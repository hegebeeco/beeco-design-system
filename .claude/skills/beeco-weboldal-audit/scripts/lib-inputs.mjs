// beeco-weboldal-audit · lib-inputs.mjs – külső (modell által gyűjtött) adatok beolvasása és egyesítése:
//   --field <json>    valódi felhasználói adatok (Microsoft Clarity)
//   --search <json>   Search Console + GA4 + Bing (BigQuery / API)
//   --webflow <json>  Webflow MCP-vel gyűjtött oldal-adatok
// A szkript nem hív MCP-t; a gyűjtés lépései a SKILL.md-ben, a scripts/webflow-collect.md-ben és a reference/bigquery.md-ben vannak.
import { readFileSync } from 'node:fs';

const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
const pathOf = u => { try { return new URL(u).pathname.replace(/\/$/, '') || '/'; } catch { const p = String(u).split(/[?#]/)[0]; return (p.startsWith('/') ? p : '/' + p).replace(/\/$/, '') || '/'; } };
const pct = (a, b) => (b ? ((a - b) / b) * 100 : null);
const fmtPct = v => (v == null ? '–' : `${v > 0 ? '+' : ''}${v.toFixed(0)} %`);
const num = n => (n == null ? '–' : (+n).toLocaleString('hu-HU').replace(/ /g, ' '));

export function loadMap(file) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const byPath = new Map(), meta = {};
  for (const [k, v] of Object.entries(j)) { if (k.startsWith('_')) { meta[k] = v; continue; } byPath.set(pathOf(k), v); }
  return { byPath, meta, count: byPath.size };
}
export const lookup = (inp, url) => (inp ? inp.byPath.get(pathOf(url)) || null : null);

// ------------------------------------------------------------ valós felhasználói adat (Clarity)
export function fieldFindings(f, add) {
  if (!f) return;
  const ses = f.sessions != null ? `${num(f.sessions)} munkamenet` : 'munkamenet ismeretlen';
  if (f.lcp_ms > 4000) add('perf', 'P1', 'field.lcp', `Valós LCP ${(f.lcp_ms / 1000).toFixed(1)} s (Clarity; cél ≤ 2,5 s)`, ses, 'Valódi látogatóknál lassú a fő tartalom: hősképet tömörítsd/WebP, ne legyen lazy, kevesebb blokkoló script.', 18);
  else if (f.lcp_ms > 2500) add('perf', 'P2', 'field.lcp', `Valós LCP ${(f.lcp_ms / 1000).toFixed(1)} s (Clarity; cél ≤ 2,5 s)`, ses, 'A hősképet tömörítsd/WebP, ne legyen lazy; kevesebb blokkoló script.', 8);
  if (f.inp_ms > 500) add('perf', 'P1', 'field.inp', `Valós INP ${Math.round(f.inp_ms)} ms (Clarity; cél ≤ 200 ms)`, ses, 'Kattintásra érzékelhetően késik az oldal: a nehéz harmadik fél szkripteket (chat, mérők) késleltesd, a hosszú feladatokat bontsd.', 20);
  else if (f.inp_ms > 200) add('perf', 'P2', 'field.inp', `Valós INP ${Math.round(f.inp_ms)} ms (Clarity; cél ≤ 200 ms)`, ses, 'Csökkentsd az indulásnál és kattintásnál futó JavaScriptet; a harmadik fél szkripteket késleltesd.', 8);
  if (f.cls > 0.25) add('visual', 'P1', 'field.cls', `Valós CLS ${(+f.cls).toFixed(2)} (Clarity; cél ≤ 0,1)`, ses, 'Adj helyet a késve betöltődő elemeknek (kép width/height, aspect-ratio).', 15);
  else if (f.cls > 0.1) add('visual', 'P2', 'field.cls', `Valós CLS ${(+f.cls).toFixed(2)} (Clarity; cél ≤ 0,1)`, ses, 'Adj helyet a késve betöltődő elemeknek (kép width/height, aspect-ratio).', 8);
  if (f.rage_clicks > 0) add('visual', 'P2', 'field.rage', `${f.rage_clicks} dühös kattintás (rage click) a valós látogatóknál`, ses, 'Nézd meg a Clarity-felvételeken, mire kattintanak ismételten: valószínűleg nem kattintható elemnek látszó dolog, vagy lassú/hibás gomb.', Math.min(8, 2 + f.rage_clicks * 0.5));
  if (f.dead_clicks > 0) add('visual', 'P3', 'field.dead', `${f.dead_clicks} halott kattintás (nincs reakció) a valós látogatóknál`, ses, 'Tedd valódi linkké/gombbá, ami kattinthatónak látszik, vagy vedd el a kattinthatóság látszatát.', 1);
}
export function maxSessions(pages) { return Math.max(0, ...pages.map(p => p.field?.sessions || 0)); }
/** prioritás-súly: 0,25 + 0,75 × (oldal munkamenetei / legtöbb munkamenet) */
export const sessionWeight = (p, max) => (max > 0 ? 0.25 + 0.75 * ((p.field?.sessions || 0) / max) : 1);
export function fieldMd(pages) {
  const rows = pages.filter(p => p.field && !p.fatal);
  if (!rows.length) return [];
  const L = ['## Valós felhasználói adatok (Clarity) a labor-mérés mellett', '', '| Oldal | LCP labor → valós | INP valós | CLS labor → valós | Dühös kattintás | Halott kattintás | Görgetési mélység | Munkamenet |', '|---|---|---|---|---|---|---|---|'];
  const s = v => (v == null ? '–' : (v / 1000).toFixed(2) + ' s');
  for (const p of rows) { const f = p.field; L.push(`| ${cell(p.slug)} | ${(p.perf.lcpMs / 1000).toFixed(2)} s → ${s(f.lcp_ms)} | ${f.inp_ms != null ? Math.round(f.inp_ms) + ' ms' : '–'} | ${p.cls} → ${f.cls ?? '–'} | ${f.rage_clicks ?? '–'} | ${f.dead_clicks ?? '–'} | ${f.scroll_depth_pct != null ? f.scroll_depth_pct + ' %' : '–'} | ${num(f.sessions)} |`); }
  L.push('', 'A **Prioritás** a Top 10 táblában: hatás × (0,25 + 0,75 × az oldal munkamenetei / a legtöbb munkamenet): a sok látogatót érintő hiba előrébb kerül. A labor-érték szintetikus (4× CPU-lassítás), a valós érték a látogatóké: ha eltérnek, a valós az irányadó.', '');
  return L;
}

// ------------------------------------------------------------ keresési és forgalmi adat (GSC + GA4 + Bing)
const ctrOf = g => (g && g.impressions > 0 && g.clicks != null ? g.clicks / g.impressions : null);
export function searchFindings(s, ctx, add) {
  if (!s) { return; }
  const g = s.gsc, a = s.ga4;
  if (g && g.impressions >= 500 && ctrOf(g) < 0.01) add('seo', 'P2', 'search.low-ctr', `Sok megjelenés, alig kattintás: ${num(g.impressions)} megjelenés, CTR ${(ctrOf(g) * 100).toFixed(2)} % (Search Console)`, [`átlagos pozíció ${g.position != null ? (+g.position).toFixed(1) : '–'}`, ...(g.top_queries || []).slice(0, 3).map(q => `„${q.query}” ${q.impressions} megj./${q.clicks} kat.`)], 'Írd át a title-t és a meta description-t: legyen benne a legtöbbet keresett kifejezés elöl, a haszon és egy cselekvésre hívás (Page settings → SEO).', 6);
  if (g && g.position >= 5 && g.position <= 15 && g.impressions > 100) add('seo', 'P2', 'search.near-page-one', `Közel az első oldalhoz: átlagos pozíció ${(+g.position).toFixed(1)}, ${num(g.impressions)} megjelenés`, (g.top_queries || []).slice(0, 3).map(q => `„${q.query}” poz. ${(+q.position).toFixed(1)}`), 'Erősítsd belső linkkel (a menün kívüli, tartalmi oldalakról, a kulcskifejezés a link szövegében), és bővítsd a szöveget a keresésekre adott válasszal.', 3);
  if (a && s.prev?.ga4?.sessions >= 20 && a.sessions < s.prev.ga4.sessions * 0.8) add('seo', 'P1', 'search.sessions-drop', `A munkamenetek ${Math.abs(pct(a.sessions, s.prev.ga4.sessions)).toFixed(0)} %-kal csökkentek (${num(s.prev.ga4.sessions)} → ${num(a.sessions)}, GA4)`, 'Az előző azonos hosszú időszakhoz képest', 'Keresd meg az okot: elveszett pozíció (Search Console), megváltozott/eltört link vagy CTA, lejárt kampány, technikai hiba. Hasonlítsd össze a Clarity-adattal.', 10);
  const zero = g ? g.impressions === 0 : (ctx.gscComplete && ctx.hasGsc);
  if (zero && ctx.indexable) add('seo', 'P2', 'search.zero-impressions', '0 megjelenés a Search Console-ban 28 napon át, pedig az oldal indexelhető', 'Az oldal 200-at ad, nincs noindex', 'Ellenőrizd az indexelést (URL Inspection), tedd a sitemapbe, és linkeld tartalmi oldalakról; ha nem kell az oldal, vedd ki a sitemapből.', 8);
}
export function searchTotals(inp, pages) {
  const sum = (sel) => pages.reduce((t, p) => t + (sel(p.search) || 0), 0), has = sel => pages.some(p => sel(p.search) != null);
  const site = inp?.meta?._site || {};
  const T = { range: inp?.meta?._range || null, clicks: site.gsc?.clicks ?? (has(s => s?.gsc?.clicks) ? sum(s => s?.gsc?.clicks) : null), impressions: site.gsc?.impressions ?? (has(s => s?.gsc?.impressions) ? sum(s => s?.gsc?.impressions) : null), sessions: site.ga4?.sessions ?? (has(s => s?.ga4?.sessions) ? sum(s => s?.ga4?.sessions) : null), bingClicks: site.bing?.clicks ?? (has(s => s?.bing?.clicks) ? sum(s => s?.bing?.clicks) : null) };
  T.prev = { clicks: site.gsc?.prev?.clicks ?? (has(s => s?.prev?.gsc?.clicks) ? sum(s => s?.prev?.gsc?.clicks) : null), impressions: site.gsc?.prev?.impressions ?? (has(s => s?.prev?.gsc?.impressions) ? sum(s => s?.prev?.gsc?.impressions) : null), sessions: site.ga4?.prev?.sessions ?? (has(s => s?.prev?.ga4?.sessions) ? sum(s => s?.prev?.ga4?.sessions) : null), bingClicks: site.bing?.prev?.clicks ?? (has(s => s?.prev?.bing?.clicks) ? sum(s => s?.prev?.bing?.clicks) : null) };
  // oldalankénti összegnél az előző érték csak akkor összevethető, ha minden adatos oldalhoz van előző érték
  const full = (now, prv) => pages.filter(p => p.search && now(p.search) != null).every(p => prv(p.search) != null);
  T.prevComplete = { clicks: full(s => s?.gsc?.clicks, s => s?.prev?.gsc?.clicks), impressions: full(s => s?.gsc?.impressions, s => s?.prev?.gsc?.impressions), sessions: full(s => s?.ga4?.sessions, s => s?.prev?.ga4?.sessions), bingClicks: full(s => s?.bing?.clicks, s => s?.prev?.bing?.clicks) };
  if (site.gsc) T.prevComplete.clicks = T.prevComplete.impressions = true; if (site.ga4) T.prevComplete.sessions = true; if (site.bing) T.prevComplete.bingClicks = true;
  return T;
}
export function searchMd(pages, T) {
  const rows = pages.filter(p => p.search && !p.fatal);
  if (!rows.length && !T) return [];
  const r = T?.range;
  const L = ['## Keresési és forgalmi adatok', '', r ? `Időszak: ${r.from || '?'} – ${r.to || '?'}${r.prevFrom ? ` · előző időszak: ${r.prevFrom} – ${r.prevTo}` : ''}.` : 'Időszak: nincs megadva (`_range` a JSON-ban).', ''];
  const d = (a, b) => fmtPct(pct(a, b));
  L.push('**Az egész oldal (bemeneti adatok összege)**', '', '| Mutató | Most | Előző | Változás |', '|---|---|---|---|');
  for (const [n, k] of [['Search Console kattintás', 'clicks'], ['Search Console megjelenés', 'impressions'], ['GA4 munkamenet', 'sessions'], ['Bing kattintás', 'bingClicks']]) if (T[k] != null) L.push(`| ${n} | ${num(T[k])} | ${num(T.prev[k])} | ${T.prev[k] && T.prevComplete?.[k] ? d(T[k], T.prev[k]) : '– (nem minden oldalhoz van előző érték)'} |`);
  L.push('');
  if (rows.length) {
    L.push('**Oldalanként**', '', '| Oldal | GSC kattintás | GSC megjelenés | CTR | Pozíció | GA4 munkamenet (előző) | Elkötelezett % | Kulcsesemény | Bing kat./megj. |', '|---|---|---|---|---|---|---|---|---|');
    for (const p of rows) { const s = p.search, g = s.gsc || {}, a = s.ga4 || {}, b = s.bing || {}; const c = ctrOf(g); L.push(`| ${cell(p.slug)} | ${num(g.clicks)} | ${num(g.impressions)} | ${c != null ? (c * 100).toFixed(2) + ' %' : '–'} | ${g.position != null ? (+g.position).toFixed(1) : '–'} | ${num(a.sessions)}${s.prev?.ga4?.sessions != null ? ` (${num(s.prev.ga4.sessions)}, ${d(a.sessions, s.prev.ga4.sessions)})` : ''} | ${a.engagement_rate != null ? (a.engagement_rate <= 1 ? (a.engagement_rate * 100).toFixed(0) : a.engagement_rate) + ' %' : '–'} | ${num(a.key_events)} | ${num(b.clicks)}/${num(b.impressions)} |`); }
    L.push('');
    const q = rows.filter(p => p.search.gsc?.top_queries?.length);
    if (q.length) { L.push('**Legtöbbet hozó keresések oldalanként (Search Console)**', ''); for (const p of q) L.push(`- ${p.slug}: ${p.search.gsc.top_queries.slice(0, 5).map(x => `„${x.query}” (${x.clicks} kat., ${x.impressions} megj., poz. ${(+x.position).toFixed(1)})`).join('; ')}`); L.push(''); }
  }
  return L;
}

// ------------------------------------------------------------ Webflow oldalak (MCP-gyűjtés)
export function loadWebflow(file) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const arr = Array.isArray(j) ? j : Array.isArray(j.pages) ? j.pages : Object.entries(j.pages || {}).map(([path, v]) => ({ path, ...v }));
  const byPath = new Map(arr.map(p => [pathOf(p.path || p.slug || ''), p]));
  return { byPath, siteId: j.siteId || null, collectedAt: j.collectedAt || null, draftPaths: new Set((j.draftPaths || []).map(pathOf)), count: byPath.size };
}
const REGI = /(-regi|-draft)$/i;
export function webflowFindings(W, wp, { inSitemap, add, have }) {
  if (!wp) return;
  const hasHeadNoindex = !!wp.noindex;
  if (hasHeadNoindex) {
    if (inSitemap === true) add('seo', 'P0', 'webflow.noindex', 'Az oldalra noindex van állítva a Webflow-ban, pedig szerepel a sitemapben (indexelésre szánt oldal)', `Forrás: ${wp.noindexSource || 'oldal-beállítás / fejkód'}`, 'Vedd ki a robots noindex-et (Page settings → SEO / Custom code → <head>), vagy vedd ki az oldalt a sitemapből, ha szándékosan rejtett.', have('seo.noindex') ? 0 : 60);
    else add('seo', 'P3', 'webflow.noindex-note', `noindex a Webflow-ban (nincs a sitemapben${inSitemap == null ? ', vagy nem ellenőrizhető' : ''}): szándékos?`, `Forrás: ${wp.noindexSource || 'oldal-beállítás / fejkód'}`, 'Ha az oldalnak keresőből is látszania kell, vedd ki a noindex-et.', 0);
  }
  if (wp.draft === true) add('seo', 'P2', 'webflow.draft-live', 'Az oldal a Webflow-ban draft, mégis elérhető az élő URL-en', 'draft: true', 'Publikáld újra a webhelyet, vagy ellenőrizd a gyorsítótárat; ha az oldal nem kell, töröld az élő URL-ről.', 8);
  const seen = new Set();
  for (const l of wp.links || []) {
    const to = pathOf(l.to || ''), tp = W.byPath.get(to);
    const isDraft = tp?.draft === true || W.draftPaths.has(to);
    const regi = REGI.test(to);
    if ((isDraft || regi) && !seen.has(to)) { seen.add(to);
      add('links', 'P1', `webflow.link-draft|${to}`, isDraft ? `Élő oldalról piszkozat (draft) oldalra mutat link: ${to}` : `Link „-regi/-draft” végű oldalra: ${to}`, `Felirat: ${l.text || '(nincs)'}${isDraft ? ' · a cél draft' : ''}`, 'Irányítsd az aktuális oldalra (Designer → elem → Link settings → Page), vagy publikáld a célt; a régi oldalra mutató linket ne hagyd éles oldalon.', 12, 'wfl', 36); }
  }
  const code = (wp.headCodeLen || 0);
  if (code > 0 && (wp.headCodeHasStyle || wp.headCodeHasScript)) add('ds', 'P3', 'webflow.head-code', `Oldalszintű ${[wp.headCodeHasStyle && 'CSS', wp.headCodeHasScript && 'JS'].filter(Boolean).join(' + ')} a fejkódban (${code} karakter)`, `Lábkód: ${wp.footerCodeLen || 0} karakter`, 'Vidd a stílust a DS-be (osztály), a scriptet közös, dokumentált helyre; oldalszintű kód csak indokolt kivétel.', Math.min(4, 1 + code / 2000));
}
export function webflowMd(p) {
  const w = p.webflow; if (!w) return [];
  const live = p.metrics?.ds?.embeds;
  return ['**Webflow-oldali adatok (MCP-gyűjtés)**', '', `- draft: ${w.draft === true ? 'IGEN' : w.draft === false ? 'nem' : '?'} · noindex: ${w.noindex ? 'IGEN' : 'nem'}${w.noindexSource ? ` (${w.noindexSource})` : ''} · fejkód: ${w.headCodeLen ?? '?'} karakter · lábkód: ${w.footerCodeLen ?? '?'} karakter`, `- Beágyazott (w-embed/HtmlEmbed) elem: ${w.embeds ?? '?'} a Designerben${live != null ? ` · ${live} az élő oldalon` : ''} · page-típusú link: ${(w.links || []).length}`, `- Használt komponens-példányok: ${(w.components || []).join(', ') || '–'}`, ''];
}
export { pathOf };
