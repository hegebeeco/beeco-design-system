// beeco-weboldal-audit · lib-site.mjs – teljes oldal mód: sitemap-crawl, belső linkgráf (árva oldalak), futási előzmények (history.jsonl).
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdirSync, appendFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

const execFileP = promisify(execFile);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 beeco-audit';
const UTILITY = /^\/(access-denied|checkout|log-in|login|order-confirmation|paypal-checkout|reset-password|search|sign-up|update-password|user-account|401|404|cart)(\/|$)/i;

async function curlText(url) {
  try { const { stdout } = await execFileP('curl', ['-s', '-L', '-m', '25', '-A', UA, url], { maxBuffer: 1 << 26 }); return stdout; } catch { return ''; }
}
const locs = xml => [...xml.matchAll(/<loc>\s*([^<\s][^<]*?)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));

/** <origin>/sitemap.xml (sitemap-index is) → { urls (rendezve), total, all } ; a limitnél a felső szintű, nem „szolgáltatási” oldalak jönnek előre */
export async function fetchSitemap(origin, limit = 0) {
  const base = origin.replace(/\/$/, '');
  const seen = new Set(); const all = [];
  const walk = async (u, depth) => {
    const xml = await curlText(u); if (!xml) return;
    if (/<sitemapindex/i.test(xml) && depth < 2) { for (const s of locs(xml)) await walk(s, depth + 1); return; }
    for (const l of locs(xml)) if (!seen.has(l)) { seen.add(l); all.push(l); }
  };
  await walk(base + '/sitemap.xml', 0);
  const host = new URL(base).host.replace(/^www\./, '');
  const same = all.filter(u => { try { return new URL(u).host.replace(/^www\./, '') === host; } catch { return false; } });
  const path = u => new URL(u).pathname.replace(/\/$/, '') || '/';
  const depth = u => path(u) === '/' ? 0 : path(u).split('/').length - 1;
  const ordered = same.map((u, i) => ({ u, i })).sort((a, b) => (UTILITY.test(path(a.u)) - UTILITY.test(path(b.u))) || depth(a.u) - depth(b.u) || a.i - b.i).map(x => x.u);
  return { urls: limit > 0 ? ordered.slice(0, limit) : ordered, total: same.length, all: same };
}

// ------------------------------------------------------------ linkgráf
export const pathKey = u => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, '') + (x.pathname.replace(/\/$/, '') || '/')).toLowerCase(); } catch { return String(u); } };
const isAsset = p => /\.(pdf|png|jpe?g|webp|avif|svg|gif|zip|xml|txt|mp4|ico)$/i.test(p);

/** pages: [{url, slug, status, linkSource: [{abs, zone}], linkResults}] ; sitemapAll: az összes sitemap-URL (vagy null) */
export function buildGraph(pages, sitemapAll, total) {
  const nodes = new Map(); // key -> {url, slug}
  for (const p of pages) if (!p.fatal) nodes.set(pathKey(p.url), { url: p.url, slug: p.slug });
  const host = pages.length ? new URL(pages[0].url).hostname.replace(/^www\./, '') : '';
  const inC = new Map(), inN = new Map(); const out = {};
  for (const p of pages) {
    if (p.fatal || !p.linkSource) continue;
    const src = pathKey(p.url); out[src] = new Set();
    for (const l of p.linkSource) {
      let u; try { u = new URL(l.abs); } catch { continue; }
      if (!/^https?:$/.test(u.protocol) || u.hostname.replace(/^www\./, '') !== host) continue;
      const t = pathKey(l.abs); if (t === src || isAsset(u.pathname)) continue;
      out[src].add(t);
      const m = l.zone === 'main' ? inC : inN; if (!m.has(t)) m.set(t, new Set()); m.get(t).add(src);
    }
  }
  const rows = [...nodes.entries()].map(([k, n]) => ({ key: k, slug: n.slug, url: n.url, content: (inC.get(k) || new Set()).size, nav: (inN.get(k) || new Set()).size, out: out[k] ? out[k].size : 0 }));
  const home = k => /^[^/]+\/$/.test(k);
  const orphans = rows.filter(r => r.content === 0 && r.nav === 0 && !home(r.key) && !UTILITY.test('/' + r.key.split('/').slice(1).join('/')));
  const navOnly = rows.filter(r => r.content === 0 && r.nav > 0 && !home(r.key) && !UTILITY.test('/' + r.key.split('/').slice(1).join('/')));
  // hibás / átirányított belső linkek az összes oldalról
  const bad = new Map();
  for (const p of pages) for (const r of (p.linkResults || [])) {
    if (!r.internal) continue;
    const broken = r.code >= 400 || r.code === 0, redir = !broken && r.redirects >= 1;
    if (!broken && !redir) continue;
    const trivial = redir && pathKey(r.url) === pathKey(r.final || r.url);
    const e = bad.get(r.url) || { url: r.url, code: r.code, final: r.final, redirects: r.redirects, kind: broken ? '404' : trivial ? 'redirect-trivial' : 'redirect', sev: broken || !trivial ? 'P1' : 'P3', from: [] };
    e.from.push(p.slug); bad.set(r.url, e);
  }
  const top = [...rows].sort((a, b) => b.content - a.content || b.nav - a.nav).slice(0, 10);
  const smKeys = sitemapAll ? new Set(sitemapAll.map(pathKey)) : null;
  const linkedNotInSitemap = smKeys ? [...new Set([...inC.keys(), ...inN.keys()])].filter(k => !smKeys.has(k) && !isAsset(k)).slice(0, 15) : [];
  return {
    partial: !!(total && pages.length < total), crawled: pages.filter(p => !p.fatal).length, sitemapTotal: total || null,
    orphans: orphans.map(r => ({ sev: 'P2', slug: r.slug, url: r.url })), navOnly: navOnly.map(r => ({ sev: 'P3', slug: r.slug, url: r.url, nav: r.nav })),
    badLinks: [...bad.values()].map(b => ({ ...b, from: [...new Set(b.from)] })), top10: top.map(r => ({ slug: r.slug, url: r.url, contentLinks: r.content, navLinks: r.nav })), linkedNotInSitemap,
    pages: rows.map(r => ({ slug: r.slug, content: r.content, nav: r.nav, out: r.out })),
  };
}
const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
export function graphMd(g) {
  if (!g) return [];
  const L = ['## Belső linkek és árva oldalak', '', `${g.crawled} oldal linkjeiből épített gráf${g.sitemapTotal ? ` (a sitemapben ${g.sitemapTotal} URL van)` : ''}. „Tartalmi link” = a lábléc és a menü nélküli linkek.`];
  if (g.partial) L.push('', `> **Részleges gráf:** csak a bejárt ${g.crawled} oldalról látjuk a linkeket, ezért az „árva” és „csak menüből elérhető” lista gyanús, nem végleges (a nem bejárt oldalak is linkelhetnek). A teljes sitemap bejárásához hagyd el a \`--limit\`-et.`);
  L.push('', `**Árva oldalak (0 bejövő link, P2): ${g.orphans.length}**`, '', g.orphans.length ? g.orphans.slice(0, 30).map(o => `- ${o.url}`).join('\n') : '_Nincs._', '');
  L.push(`**Csak menüből/láblécből elérhető (0 tartalmi link, P3): ${g.navOnly.length}**`, '', g.navOnly.length ? g.navOnly.slice(0, 30).map(o => `- ${o.url} (menü/lábléc: ${o.nav} oldalról)`).join('\n') : '_Nincs._', '');
  L.push(`**Belső link hibás céllal vagy átirányításra (P1): ${g.badLinks.filter(b => b.sev === 'P1').length}**`, '');
  if (g.badLinks.length) { L.push('| Súly | Cél | Állapot | Honnan linkelik |', '|---|---|---|---|'); for (const b of g.badLinks.slice(0, 30)) L.push(`| ${b.sev} | ${cell(b.url)} | ${b.kind === '404' ? 'HTTP ' + (b.code || 'nem elérhető') : '→ ' + cell(b.final)} | ${b.from.slice(0, 4).join(', ')}${b.from.length > 4 ? ` (+${b.from.length - 4})` : ''} |`); L.push(''); } else L.push('_Nincs._', '');
  L.push('**A 10 legtöbbet linkelt oldal**', '', '| Oldal | Tartalmi link | Menü/lábléc |', '|---|---|---|', ...g.top10.map(t => `| ${cell(t.url)} | ${t.contentLinks} | ${t.navLinks} |`), '');
  if (g.linkedNotInSitemap.length) L.push('**Linkelt, de nincs a sitemapben (max 15)**', '', ...g.linkedNotInSitemap.map(k => `- ${k}`), '');
  return L;
}

// ------------------------------------------------------------ előzmények
export const defaultHistoryPath = home => `${home}/.claude/skills/beeco-weboldal-audit/data/history.jsonl`;
export function readHistory(file) {
  if (!file || !existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').map(l => { try { return l.trim() ? JSON.parse(l) : null; } catch { return null; } }).filter(Boolean);
}
export function buildHistoryEntry(pages, { origin, version, consistency, graph, traffic }, DIMS) {
  const ok = pages.filter(p => !p.fatal && p.findings);
  const avg = f => ok.length ? +(ok.reduce((s, p) => s + f(p), 0) / ok.length).toFixed(1) : 0;
  const cnt = sev => ok.reduce((s, p) => s + p.findings.filter(f => f.sev === sev).length, 0);
  return {
    date: new Date().toISOString(), origin, version, pages: pages.length, measured: ok.length,
    avgTotal: avg(p => p.total), avgDims: Object.fromEntries(DIMS.map(([k]) => [k, avg(p => p.scores[k])])),
    p0: cnt('P0'), p1: cnt('P1'), p2: cnt('P2'), p3: cnt('P3'),
    contradictions: consistency ? { cross: consistency.groups.length, facts: consistency.facts.length } : null,
    graph: graph ? { orphans: graph.orphans.length, navOnly: graph.navOnly.length, badLinks: graph.badLinks.filter(b => b.sev === 'P1').length, partial: graph.partial } : null,
    traffic: traffic || null,
    worst10: [...ok].sort((a, b) => a.total - b.total).slice(0, 10).map(p => ({ url: p.url, total: p.total, band: p.band })),
  };
}
export function appendHistory(file, entry) { mkdirSync(dirname(file), { recursive: true }); appendFileSync(file, JSON.stringify(entry) + '\n'); }

/** 5 soros változás-összefoglaló az előző (azonos origin) futáshoz képest */
export function trendLines(prev, cur) {
  if (!prev) return [];
  const d = (a, b, u = '') => { const x = +(b - a).toFixed(1); return x > 0 ? `+${x}${u}` : x === 0 ? `±0${u}` : `${x}${u}`; };
  const L = [`- Átlagpont: ${prev.avgTotal} → ${cur.avgTotal} (${d(prev.avgTotal, cur.avgTotal)}) · oldalszám: ${prev.pages} → ${cur.pages}`];
  L.push(`- P0 ${prev.p0} → ${cur.p0} · P1 ${prev.p1} → ${cur.p1} (${d(prev.p1, cur.p1)}) · P2 ${prev.p2} → ${cur.p2}`);
  const dims = Object.keys(cur.avgDims).map(k => [k, +(cur.avgDims[k] - (prev.avgDims?.[k] ?? cur.avgDims[k])).toFixed(1)]).sort((a, b) => a[1] - b[1]);
  L.push(`- Legnagyobb romlás: ${dims[0][0]} (${d(0, dims[0][1])}) · legnagyobb javulás: ${dims[dims.length - 1][0]} (${d(0, dims[dims.length - 1][1])})`);
  const pw = new Map((prev.worst10 || []).map(w => [w.url, w.total]));
  const w0 = cur.worst10?.[0]; L.push(`- Legrosszabb oldal most: ${w0 ? `${w0.url} (${w0.total})` : '–'}${w0 && pw.has(w0.url) ? `, előzőleg ${pw.get(w0.url)}` : ''}`);
  if (cur.traffic && prev.traffic) L.push(`- Forgalom: munkamenet ${prev.traffic.sessions ?? '–'} → ${cur.traffic.sessions ?? '–'}${prev.traffic.sessions ? ` (${(((cur.traffic.sessions - prev.traffic.sessions) / prev.traffic.sessions) * 100).toFixed(0)} %, cél +30 %)` : ''} · kattintás ${prev.traffic.clicks ?? '–'} → ${cur.traffic.clicks ?? '–'}`);
  else L.push(`- Ellentmondások: ${prev.contradictions ? prev.contradictions.cross + prev.contradictions.facts : '–'} → ${cur.contradictions ? cur.contradictions.cross + cur.contradictions.facts : '–'} · árva oldal: ${prev.graph?.orphans ?? '–'} → ${cur.graph?.orphans ?? '–'}`);
  return L;
}
