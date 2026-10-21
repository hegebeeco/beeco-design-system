#!/usr/bin/env node
// Persona test report: reads run folders (run.json + result.json + trace.jsonl + shots/) and writes report.html + report.json.
//   node tools/persona-test/report.mjs <runsDir> [--judge judge.json] [--compare <older report.json>] [--title "…"]
// judge.json (written by the synthesizer agent): { "<runFolder>": { "success": "yes|partial|no", "reason": "…" } } – decides
// "judge" type scenarios and may overrule self-reported success when the evidence (shots, trace) contradicts it.
//
// Efficiency index per run (0–100): success 50 (yes 1 · partial 0.5 · no 0) + time 20 (budget/time, capped at 1)
//   + SEQ 15 ((seq-1)/6) + dead ends 15 (1 − 0.25 × (dead clicks + broken anchors), min 0).
// Page index = runs averaged by persona weight (personas.json weight; equal weights when missing).
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = { _: [] };
for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (opt[argv[i].slice(2)] = argv[++i]) : opt._.push(argv[i]);
const dir = path.resolve(opt._[0] || '.');
const judge = opt.judge ? JSON.parse(fs.readFileSync(opt.judge, 'utf8')) : {};
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const runs = [];
for (const name of fs.readdirSync(dir).sort()) {
  const d = path.join(dir, name);
  if (!fs.existsSync(path.join(d, 'result.json'))) continue;
  const run = JSON.parse(fs.readFileSync(path.join(d, 'run.json'), 'utf8'));
  const res = JSON.parse(fs.readFileSync(path.join(d, 'result.json'), 'utf8'));
  const trace = fs.readFileSync(path.join(d, 'trace.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const m = res.metrics;
  let success = judge[name]?.success || (m.successAuto === true ? 'yes' : m.successAuto === false ? (res.selfReported === 'success' ? 'partial' : 'no') : null)
    || ({ success: 'yes', partial: 'partial', fail: 'no' }[res.selfReported] || 'no');
  const sVal = { yes: 1, partial: 0.5, no: 0 }[success];
  const timeScore = Math.min(1, run.budget.seconds / Math.max(1, m.simSeconds));
  const seqScore = res.seq ? (res.seq - 1) / 6 : 0.5;
  const deadScore = Math.max(0, 1 - 0.25 * (m.deadClicks + m.brokenAnchors.length));
  const index = Math.round(50 * sVal + 20 * timeScore + 15 * seqScore + 15 * deadScore);
  runs.push({ folder: name, run, res, trace, success, judgeReason: judge[name]?.reason || '', index, parts: { sVal, timeScore, seqScore, deadScore } });
}
if (!runs.length) { console.error('Nincs lezárt futás (result.json) ebben: ' + dir); process.exit(1); }

const wsum = runs.reduce((a, r) => a + (r.run.weight || 1), 0);
const pageIndex = Math.round(runs.reduce((a, r) => a + r.index * (r.run.weight || 1), 0) / wsum);
const byScenario = {};
for (const r of runs) (byScenario[r.run.scenario] ||= []).push(r);
const issues = runs.flatMap(r => (r.res.issues || []).map(i => ({ ...i, persona: r.run.personaLabel, scenario: r.run.scenarioTitle, folder: r.folder })));
const sevOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
issues.sort((a, b) => (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9));
const compare = opt.compare ? JSON.parse(fs.readFileSync(opt.compare, 'utf8')) : null;
const title = opt.title || `Perszóna-teszt: ${runs[0].run.page}`;
const pill = s => `<span class="pill ${s}">${{ yes: 'siker', partial: 'részben', no: 'nem sikerült' }[s]}</span>`;

const summary = { title, generated: new Date().toISOString(), pageIndex, previousIndex: compare?.pageIndex ?? null, runs: runs.map(r => ({
  folder: r.folder, persona: r.run.persona, scenario: r.run.scenario, lens: r.run.lens, success: r.success, index: r.index, seq: r.res.seq, trust: r.res.trust,
  simSeconds: r.res.metrics.simSeconds, actions: r.res.metrics.actions, deadClicks: r.res.metrics.deadClicks, brokenAnchors: r.res.metrics.brokenAnchors })), issues };
fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(summary, null, 1));

const html = `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>
:root{--bg:#FFFDF6;--ink:#1B1F12;--soft:#4F5640;--line:#D3DDBB;--ok:#2E7D32;--part:#B26A00;--no:#B3261E;--acc:#FECF39}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1100px;margin:0 auto;padding:32px 16px 64px}h1{font-size:28px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px}
.meta{color:var(--soft)}.index{display:flex;gap:24px;align-items:center;margin:20px 0;padding:20px;border:2px solid var(--ink);border-radius:14px;background:#fff}
.big{font-size:56px;font-weight:800;line-height:1}.delta{font-weight:700}table{width:100%;border-collapse:collapse;background:#fff}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:13px;color:var(--soft)}
td.num{font-variant-numeric:tabular-nums;text-align:right}.pill{display:inline-block;padding:1px 8px;border-radius:999px;font-size:12px;font-weight:700;color:#fff}
.pill.yes{background:var(--ok)}.pill.partial{background:var(--part)}.pill.no{background:var(--no)}
.sev{font-weight:800}.run{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:12px;background:#fff}
.shots{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}.shots img{height:180px;border:1px solid var(--line);border-radius:6px}
blockquote{margin:6px 0;padding:4px 10px;border-left:4px solid var(--acc);color:var(--soft)}.tbl{overflow-x:auto}
</style></head><body><main>
<h1>${esc(title)}</h1><p class="meta">${runs.length} futás · ${new Set(runs.map(r => r.run.persona)).size} perszóna · készült: ${new Date().toLocaleString('hu-HU')}. Szintetikus teszt: irányt mutat, valós felhasználói tesztet nem helyettesít.</p>
<div class="index"><div><div class="big">${pageIndex}</div><div class="meta">Hatékonysági index (0–100)</div></div>
<div>${compare ? `<div class="delta">Előző: ${compare.pageIndex} → most: ${pageIndex} (${pageIndex - compare.pageIndex >= 0 ? '+' : ''}${pageIndex - compare.pageIndex})</div>` : ''}
<div class="meta">Siker 50 · idő 20 · elégedettség (SEQ) 15 · holtpontok 15, a perszónák forgalmi súlyával (ideiglenes súlyok, lásd calibration.md).</div></div></div>
<h2>Feladatonként</h2><div class="tbl"><table><tr><th>Feladat</th><th>Perszóna</th><th>Lencse</th><th>Eredmény</th><th>Index</th><th>Idő (szim. mp)</th><th>Lépés</th><th>SEQ</th><th>Holtpont</th></tr>
${Object.values(byScenario).flat().map(r => `<tr><td>${esc(r.run.scenarioTitle)}</td><td>${esc(r.run.personaLabel)}</td><td>${esc(r.run.lens || '–')}</td><td>${pill(r.success)}</td>
<td class="num">${r.index}</td><td class="num">${r.res.metrics.simSeconds} / ${r.run.budget.seconds}</td><td class="num">${r.res.metrics.actions}</td><td class="num">${r.res.seq ?? '–'}</td>
<td class="num">${r.res.metrics.deadClicks + r.res.metrics.brokenAnchors.length}</td></tr>`).join('')}</table></div>
<h2>Leletek (súlyosság szerint)</h2><div class="tbl"><table><tr><th>Súly</th><th>Hol</th><th>Mi</th><th>Ki találta</th></tr>
${issues.map(i => `<tr><td class="sev">${esc(i.severity)}</td><td>${esc(i.where)}</td><td>${esc(i.text)}${i.shot ? ` <a href="${esc(i.folder + '/' + i.shot)}">kép</a>` : ''}</td><td>${esc(i.persona)} · ${esc(i.scenario)}</td></tr>`).join('') || '<tr><td colspan="4">Nincs lelet.</td></tr>'}</table></div>
<h2>Futások részletesen</h2>
${runs.map(r => `<section class="run"><h3>${esc(r.run.personaLabel)} · ${esc(r.run.scenarioTitle)} ${pill(r.success)} <span class="meta">index ${r.index}</span></h3>
<p>${esc(r.res.summary)}</p>${r.res.answer ? `<blockquote>Válasz: ${esc(r.res.answer)}</blockquote>` : ''}${r.judgeReason ? `<p class="meta">Értékelés: ${esc(r.judgeReason)}</p>` : ''}
${r.trace.filter(t => t.kind === 'note').map(t => `<blockquote>„${esc(t.text)}”</blockquote>`).join('')}
<div class="shots">${r.trace.filter(t => t.shot).map(t => `<img loading="lazy" src="${esc(r.folder + '/' + t.shot)}" alt="${esc(r.run.personaLabel)}, ${t.step}. lépés">`).join('')}</div>
<p class="meta">Blokkolt kérés: ${r.res.metrics.blockedRequests} · blokkolt beküldés: ${r.res.metrics.formSubmitsBlocked} · elért események: ${esc(r.res.metrics.dataLayerEvents.join(', ') || '–')}${r.res.metrics.brokenAnchors.length ? ' · hibás horgony: ' + esc(r.res.metrics.brokenAnchors.join(', ')) : ''}</p></section>`).join('')}
</main></body></html>`;
fs.writeFileSync(path.join(dir, 'report.html'), html);
console.log(JSON.stringify({ ok: true, pageIndex, runs: runs.length, issues: issues.length, html: path.join(dir, 'report.html') }));
