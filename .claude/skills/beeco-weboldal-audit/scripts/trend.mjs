// beeco-weboldal-audit · trend.mjs – a history.jsonl-ból önálló statikus trend.html (inline SVG, külső könyvtár nélkül, világos+sötét téma).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dshort = iso => { const d = new Date(iso); return isNaN(d) ? '' : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const num = n => (+n).toLocaleString('hu-HU').replace(/ /g, ' ');

/** series: [{name, cls, pts:[number|null], dash?}] ; labels: x-címkék. Egyetlen pont is kirajzolódik. */
function chart({ id, title, labels, series, yMin, yMax, unit = '' }) {
  const W = 720, H = 250, ml = 46, mr = 18, mt = 16, mb = 34;
  const vals = series.flatMap(s => s.pts).filter(v => v != null);
  if (!vals.length) return `<section class="card"><h2>${esc(title)}</h2><p class="muted">Még nincs adat.</p></section>`;
  let lo = yMin ?? Math.min(...vals), hi = yMax ?? Math.max(...vals);
  if (yMin == null) { const pad = (hi - lo) * 0.15 || Math.max(1, Math.abs(hi) * 0.1); lo = Math.max(0, lo - pad); hi += pad; }
  if (hi === lo) hi = lo + 1;
  const raw = (hi - lo) / 4, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(v => v >= raw);
  if (yMin == null) lo = Math.max(0, Math.floor(lo / step) * step); if (yMax == null) hi = lo + Math.ceil((hi - lo) / step) * step; if (hi <= lo) hi = lo + step;
  const n = labels.length, x = i => ml + (n === 1 ? (W - ml - mr) / 2 : (i * (W - ml - mr)) / (n - 1)), y = v => mt + (1 - (v - lo) / (hi - lo)) * (H - mt - mb);
  const ticks = Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => lo + step * i);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-t ${id}-d" class="chart"><title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(series.map(s => `${s.name}: ${s.pts.map(v => (v == null ? '–' : v)).join(', ')}`).join(' | '))}</desc>`;
  for (const t of ticks) svg += `<line x1="${ml}" x2="${W - mr}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${ml - 8}" y="${y(t) + 4}" class="ax" text-anchor="end">${esc(num(Math.round(t * 100) / 100))}${unit}</text>`;
  labels.forEach((l, i) => { if (n <= 8 || i % Math.ceil(n / 8) === 0 || i === n - 1) svg += `<text x="${x(i)}" y="${H - 10}" class="ax" text-anchor="${i === n - 1 && n > 1 ? 'end' : i === 0 && n > 1 ? 'start' : 'middle'}">${esc(l)}</text>`; });
  for (const s of series) {
    const pts = s.pts.map((v, i) => (v == null ? null : [x(i), y(v), v]));
    const segs = []; let cur = []; for (const p of pts) { if (p) cur.push(p); else if (cur.length) { segs.push(cur); cur = []; } } if (cur.length) segs.push(cur);
    for (const sg of segs) if (sg.length > 1) svg += `<polyline points="${sg.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" class="ln ${s.cls}"${s.dash ? ' stroke-dasharray="6 5"' : ''}/>`;
    for (const p of pts.filter(Boolean)) svg += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" class="dot ${s.cls}"><title>${esc(s.name)}: ${esc(num(p[2]))}${unit}</title></circle>`;
  }
  svg += '</svg>';
  const legend = series.map(s => `<span class="lg"><i class="sw ${s.cls}"${s.dash ? ' style="border-top-style:dashed;background:none;height:0"' : ''}></i>${esc(s.name)}</span>`).join('');
  return `<section class="card"><h2>${esc(title)}</h2><div class="legend">${legend}</div>${svg}</section>`;
}

export function writeTrend(entries, outFile, { historyFile = '' } = {}) {
  const last = entries[entries.length - 1];
  const runs = last ? entries.filter(e => e.origin === last.origin) : [];
  const labels = runs.map(e => dshort(e.date));
  const dimNames = { ds: 'Design system', links: 'Linkek', content: 'Tartalom', visual: 'Vizuál/UX', perf: 'Teljesítmény', seo: 'SEO', legal: 'Jog/bizalom', measure: 'Mérés', ux: 'UX/út' };
  const dimKeys = Object.keys(dimNames);
  let body = '';
  if (!runs.length) body = '<p class="muted">A history.jsonl még üres. Futtass egy auditot a <code>--history</code> kapcsolóval.</p>';
  else {
    body += chart({ id: 'c1', title: 'Átlagpont (0–100)', labels, yMin: 0, yMax: 100, series: [{ name: 'Átlagos összpont', cls: 's1', pts: runs.map(e => e.avgTotal) }] });
    body += chart({ id: 'c2', title: 'Súlyos leletek (P0 + P1)', labels, series: [{ name: 'P0', cls: 's4', pts: runs.map(e => e.p0) }, { name: 'P1', cls: 's2', pts: runs.map(e => e.p1) }, { name: 'P0 + P1', cls: 's1', pts: runs.map(e => e.p0 + e.p1) }] });
    body += chart({ id: 'c3', title: 'Területek átlaga', labels, yMin: 0, yMax: 100, series: dimKeys.map((k, i) => ({ name: dimNames[k], cls: 's' + (i + 1), pts: runs.map(e => e.avgDims?.[k] ?? null) })) });
    const sess = runs.map(e => e.traffic?.sessions ?? null);
    if (sess.some(v => v != null)) {
      // havi +30 % cél: az előző hónap tényleges munkamenetszáma × 1,3
      const target = sess.map((v, i) => (i === 0 ? null : sess[i - 1] != null ? Math.round(sess[i - 1] * 1.3) : null));
      body += chart({ id: 'c4', title: 'Munkamenetek (GA4) és a havi +30 % cél', labels, series: [{ name: 'Munkamenet', cls: 's1', pts: sess }, { name: 'Cél: előző × 1,3', cls: 's5', dash: true, pts: target }] });
      body += chart({ id: 'c5', title: 'Keresési kattintás és megjelenés (Search Console)', labels, series: [{ name: 'Kattintás', cls: 's2', pts: runs.map(e => e.traffic?.clicks ?? null) }, { name: 'Megjelenés', cls: 's3', pts: runs.map(e => e.traffic?.impressions ?? null) }] });
      const rows = runs.map((e, i) => { const p = runs[i - 1]; const g = p?.traffic?.sessions && e.traffic?.sessions != null ? ((e.traffic.sessions - p.traffic.sessions) / p.traffic.sessions) * 100 : null; return `<tr><td>${esc(dshort(e.date))}</td><td class="r">${e.traffic?.sessions != null ? num(e.traffic.sessions) : '–'}</td><td class="r ${g == null ? '' : g >= 30 ? 'good' : 'bad'}">${g == null ? '–' : (g > 0 ? '+' : '') + g.toFixed(0) + ' %'}</td></tr>`; }).join('');
      body += `<section class="card"><h2>Havi növekedés a +30 % célhoz</h2><div class="tw"><table><thead><tr><th>Futás</th><th class="r">Munkamenet</th><th class="r">Változás az előzőhöz</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    }
    const w = last.worst10 || [];
    body += `<section class="card"><h2>A 10 leggyengébb oldal (legutóbbi futás, ${esc(dshort(last.date))})</h2><div class="tw"><table><thead><tr><th>#</th><th>Oldal</th><th class="r">Pont</th><th>Sáv</th></tr></thead><tbody>${w.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.url)}</td><td class="r">${p.total}</td><td><span class="band b${esc(p.band)}">${esc(p.band)}</span></td></tr>`).join('') || '<tr><td colspan="4">–</td></tr>'}</tbody></table></div></section>`;
  }
  const sum = last ? `${esc(last.origin)} · ${runs.length} futás · legutóbb ${esc(dshort(last.date))} · ${last.pages} oldal · átlag ${last.avgTotal}` : '';
  const html = `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>beeco audit trend</title>
<style>
:root{--bg:#fbf8f1;--card:#fff;--fg:#26231d;--muted:#6b665b;--line:#e7e1d3;--s1:#1f6f4a;--s2:#c9780b;--s3:#2b6cb0;--s4:#b42318;--s5:#7a4fb5;--s6:#0e8a8a;--s7:#8a6d00;--s8:#c2185b;--s9:#455a64;--good:#1f6f4a;--bad:#b42318}
@media (prefers-color-scheme:dark){:root{--bg:#15130f;--card:#1e1b15;--fg:#f1ece0;--muted:#a59f90;--line:#3a352a;--s1:#5fcf9a;--s2:#f0a53a;--s3:#6aa8f0;--s4:#ff7a6b;--s5:#b794f0;--s6:#4fd1d1;--s7:#e0c040;--s8:#f48fb1;--s9:#b0bec5;--good:#5fcf9a;--bad:#ff7a6b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:20px 16px 48px}
main{max-width:860px;margin:0 auto}h1{font-size:1.5rem;margin:0 0 4px}h2{font-size:1.05rem;margin:0 0 8px}.muted{color:var(--muted)}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}
.chart{width:100%;height:auto;display:block}.grid{stroke:var(--line);stroke-width:1}.ax{fill:var(--muted);font-size:11px}
.ln{fill:none;stroke-width:2.5}.dot{stroke:var(--card);stroke-width:2}
.s1{stroke:var(--s1);fill:var(--s1);background:var(--s1);border-color:var(--s1)}.s2{stroke:var(--s2);fill:var(--s2);background:var(--s2);border-color:var(--s2)}.s3{stroke:var(--s3);fill:var(--s3);background:var(--s3);border-color:var(--s3)}.s4{stroke:var(--s4);fill:var(--s4);background:var(--s4);border-color:var(--s4)}.s5{stroke:var(--s5);fill:var(--s5);background:var(--s5);border-color:var(--s5)}.s6{stroke:var(--s6);fill:var(--s6);background:var(--s6);border-color:var(--s6)}.s7{stroke:var(--s7);fill:var(--s7);background:var(--s7);border-color:var(--s7)}.s8{stroke:var(--s8);fill:var(--s8);background:var(--s8);border-color:var(--s8)}.s9{stroke:var(--s9);fill:var(--s9);background:var(--s9);border-color:var(--s9)}
.ln.s1,.ln.s2,.ln.s3,.ln.s4,.ln.s5,.ln.s6,.ln.s7,.ln.s8,.ln.s9{fill:none}
.legend{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:.85rem;margin-bottom:6px}.lg{display:inline-flex;align-items:center;gap:6px}.sw{display:inline-block;width:12px;height:12px;border-radius:3px;border-top:2px solid}
.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:.9rem}th,td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;word-break:break-word}th{color:var(--muted);font-weight:600}.r{text-align:right;white-space:nowrap}
.good{color:var(--good);font-weight:600}.bad{color:var(--bad);font-weight:600}.band{display:inline-block;min-width:1.6em;text-align:center;border-radius:6px;padding:0 6px;font-weight:700;border:1px solid var(--line)}
.bA,.bB{color:var(--good)}.bC{color:var(--s2)}.bD{color:var(--bad)}code{background:var(--line);padding:1px 5px;border-radius:4px}
</style></head><body><main>
<h1>beeco weboldal-audit: havi trend</h1><p class="muted">${sum}</p>
${body}
<p class="muted">Forrás: ${esc(historyFile || 'history.jsonl')}. Önálló statikus oldal, külső könyvtár nélkül. A munkamenet-cél a GA4-adatból számolt, az előző futás × 1,3.</p>
</main></body></html>`;
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  return { runs: runs.length };
}
