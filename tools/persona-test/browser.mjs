#!/usr/bin/env node
// Persona test browser: a background Playwright session that a persona agent drives step by step from the shell.
// Every command prints one JSON object. The trace (trace.jsonl), screenshots (shots/) and result.json go to --run <dir>.
//
//   node tools/persona-test/browser.mjs start  --run <dir> --persona <id> --scenario <file.json#id> [--lens <id>] [--url <override>]
//   node tools/persona-test/browser.mjs look   --run <dir>
//   node tools/persona-test/browser.mjs click  --run <dir> --ref <n>
//   node tools/persona-test/browser.mjs type   --run <dir> --ref <n> --text "…"      (never submits; Enter is blocked in fields)
//   node tools/persona-test/browser.mjs key    --run <dir> --key Tab|Shift+Tab|Enter|Space|Escape
//   node tools/persona-test/browser.mjs scroll --run <dir> --dir down|up
//   node tools/persona-test/browser.mjs back   --run <dir>
//   node tools/persona-test/browser.mjs note   --run <dir> --text "thinking aloud"
//   node tools/persona-test/browser.mjs finish --run <dir> --result success|partial|fail --seq 1-7 --trust 1-5 --answer "…" --summary "…" [--issues '<json array>']
//   node tools/persona-test/browser.mjs stop   --run <dir>
//
// Guardrails: analytics, tag managers and newsletter providers are blocked (no pollution of real data); form submissions and
// non-GET requests are blocked; navigation outside the scenario's allowedHosts is not followed but recorded (that is how an
// app-store click counts as success). Time is simulated (reading + action costs), so agent thinking time does not count.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const PERSONAS = path.join(REPO, 'research', 'personas');
const BLOCKED_HOSTS = /(google-analytics\.com|googletagmanager\.com|analytics\.google\.com|clarity\.ms|sender\.net|facebook\.(com|net)|hotjar|doubleclick\.net|tiktok\.com|stripe\.com|trustindex\.io)/i;
const COST = { click: 2, type: 0.4, key: 0.8, scroll: 1.2, back: 2, look: 0.5 };
const IDLE_MS = 20 * 60 * 1000;

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; out[k] = v; }
    else out._.push(a);
  }
  return out;
}
const print = o => process.stdout.write(JSON.stringify(o, null, 1) + '\n');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));

function loadPlaywright() {
  const req = createRequire(import.meta.url);
  const tries = [process.env.PLAYWRIGHT_PATH, process.env.PLAYWRIGHT_UT, 'playwright', path.join(os.homedir(), 'CLAUDE/Csicsergosz-webapp/node_modules/playwright')].filter(Boolean);
  for (const t of tries) { try { return req(t); } catch {} }
  throw new Error('Playwright nem található: állítsd be a PLAYWRIGHT_PATH-t.');
}

function loadSetup(o) {
  const persona = readJson(path.join(PERSONAS, 'personas.json')).personas.find(p => p.id === o.persona);
  if (!persona) throw new Error('Ismeretlen perszóna: ' + o.persona);
  const [file, sid] = String(o.scenario).split('#');
  const scenFile = readJson(path.isAbsolute(file) ? file : path.join(PERSONAS, 'scenarios', file));
  const scenario = scenFile.scenarios.find(s => s.id === sid);
  if (!scenario) throw new Error('Ismeretlen feladat: ' + o.scenario);
  const lens = o.lens ? readJson(path.join(PERSONAS, 'lenses.json')).lenses.find(l => l.id === o.lens) : null;
  if (o.lens && !lens) throw new Error('Ismeretlen lencse: ' + o.lens);
  return { persona, scenario, lens, page: scenFile.page, url: o.url || scenFile.url, allowedHosts: scenFile.allowedHosts || [] };
}

// ---------------------------------------------------------------- server (one per run, detached)
async function serve(o) {
  const run = path.resolve(o.run);
  const setup = loadSetup(o);
  const { persona, scenario, lens } = setup;
  const pw = loadPlaywright();
  const shots = path.join(run, 'shots'); fs.mkdirSync(shots, { recursive: true });
  const traceFile = path.join(run, 'trace.jsonl');
  const state = { step: 0, simSeconds: 0, actions: 0, seenWords: new Set(), deadClicks: 0, brokenAnchors: [], external: [], blocked: 0,
    submitsBlocked: 0, successSeen: false, looks: 0, started: Date.now(), finished: false };
  const log = e => fs.appendFileSync(traceFile, JSON.stringify({ t: new Date().toISOString(), step: state.step, sim: +state.simSeconds.toFixed(1), ...e }) + '\n');

  const mobile = persona.device.type === 'mobile';
  let [w, h] = persona.device.viewport;
  const zoom = lens?.browser?.zoom || 1;
  const browser = await pw.chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: Math.round(w / zoom), height: Math.round(h / zoom) }, deviceScaleFactor: zoom > 1 ? zoom : (mobile ? 3 : 1),
    isMobile: mobile, hasTouch: mobile, locale: 'hu-HU',
    userAgent: mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined
  });
  await ctx.addInitScript(() => {
    window.__ptEvents = []; window.__ptSubmits = 0;
    const hook = arr => { const p = arr.push.bind(arr); arr.push = (...x) => { try { x.forEach(e => e && e.event && window.__ptEvents.push(String(e.event))); } catch {} return p(...x); }; };
    window.dataLayer = window.dataLayer || []; hook(window.dataLayer);
    document.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); window.__ptSubmits++; }, true);
    HTMLFormElement.prototype.submit = function () { window.__ptSubmits++; };
    HTMLFormElement.prototype.requestSubmit = function () { window.__ptSubmits++; };
  });
  const allowed = u => { try { return setup.allowedHosts.includes(new URL(u).hostname); } catch { return false; } };
  await ctx.route('**/*', route => {
    const r = route.request(); const u = r.url();
    if (BLOCKED_HOSTS.test(u)) { state.blocked++; return route.abort(); }
    if (r.method() !== 'GET' && r.method() !== 'HEAD') { state.blocked++; log({ kind: 'blocked-request', method: r.method(), url: u.slice(0, 200) }); return route.abort(); }
    if (r.isNavigationRequest() && r.frame() === r.frame().page().mainFrame() && !allowed(u) && !u.startsWith('about:')) {
      if (!state.external.includes(u)) { state.external.push(u); log({ kind: 'external-navigation', url: u }); } return route.abort();
    }
    return route.continue();
  });
  const page = await ctx.newPage();
  ctx.on('page', async p => { if (p === page) return; await p.waitForLoadState('domcontentloaded').catch(() => {}); const u = p.url();
    if (!state.external.includes(u)) { state.external.push(u); log({ kind: 'external-navigation', url: u, popup: true }); } await p.close().catch(() => {}); });
  if (lens?.browser?.network === '3g') {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 200 * 1024 / 8 });
  }
  const wpm = persona.readingWpm * (lens?.browser?.readingFactor || 1);
  const entry = setup.url + (persona.arrival.utm ? (setup.url.includes('?') ? '&' : '?') + persona.arrival.utm : '');
  const t0 = Date.now();
  await page.goto(entry, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
  state.simSeconds += (Date.now() - t0) / 1000;
  log({ kind: 'start', persona: persona.id, scenario: scenario.id, lens: lens?.id || null, url: entry, loadSeconds: +((Date.now() - t0) / 1000).toFixed(1) });
  fs.writeFileSync(path.join(run, 'run.json'), JSON.stringify({ persona: persona.id, personaLabel: persona.label, scenario: scenario.id, scenarioTitle: scenario.title,
    scenarioFile: String(o.scenario).split('#')[0], page: setup.page, lens: lens?.id || null, url: entry, budget: scenario.budget, success: scenario.success,
    weight: persona.weight, started: new Date().toISOString() }, null, 1));

  const successCheck = async () => {
    const s = scenario.success;
    if (s.type === 'externalUrl') return state.external.some(u => new RegExp(s.pattern).test(u)) || new RegExp(s.pattern).test(page.url());
    if (s.type === 'urlContains') return page.url().includes(s.value);
    if (s.type === 'elementSeen') return page.evaluate(sel => [...document.querySelectorAll(sel)].some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; }), s.selector).catch(() => false);
    return null; // judge: decided by the synthesizer from the answer
  };
  const snapshot = async () => page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
    const inView = e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    document.querySelectorAll('[data-pt-ref]').forEach(e => e.removeAttribute('data-pt-ref'));
    const sel = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[tabindex]:not([tabindex="-1"])';
    const els = [...document.querySelectorAll(sel)].filter(e => vis(e) && inView(e)).slice(0, 70);
    const items = els.map((e, i) => { e.setAttribute('data-pt-ref', String(i + 1));
      const name = (e.getAttribute('aria-label') || e.innerText || e.value || e.getAttribute('placeholder') || e.getAttribute('title') || e.querySelector('img')?.alt || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      return { ref: i + 1, role: e.getAttribute('role') || e.tagName.toLowerCase(), name, href: e.getAttribute('href') || undefined }; });
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const parts = []; let n;
    while ((n = tw.nextNode())) { const p = n.parentElement; if (!p || /SCRIPT|STYLE|NOSCRIPT/.test(p.tagName)) continue; const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t.length < 2) continue;
      const r = p.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight && vis(p)) parts.push(t); }
    const f = document.activeElement;
    return { url: location.href, title: document.title, scrollPct: Math.round(100 * scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)),
      text: [...new Set(parts)].join(' · ').slice(0, 3000), elements: items,
      focused: f && f !== document.body ? (f.getAttribute('aria-label') || f.innerText || f.tagName).replace(/\s+/g, ' ').trim().slice(0, 80) : null,
      events: window.__ptEvents.slice(-20), submits: window.__ptSubmits };
  });
  const shot = async () => { const f = path.join(shots, String(++state.step).padStart(2, '0') + '.jpg'); await page.screenshot({ path: f, type: 'jpeg', quality: 60 }); return path.relative(run, f); };
  const budgetLeft = () => ({ seconds: +(scenario.budget.seconds - state.simSeconds).toFixed(1), actions: scenario.budget.actions - state.actions });
  const fingerprint = () => page.evaluate(() => location.href + '|' + Math.round(scrollY) + '|' + document.body.innerText.length + '|' + document.querySelectorAll('[aria-expanded=true],details[open],.w--open').length).catch(() => '');
  const keyboardOnly = !!lens?.browser?.keyboardOnly;

  const handlers = {
    async look() {
      if (scenario.mode === 'fiveSecond' && state.looks >= 1) return { error: 'Az 5 másodperces tesztben csak egy pillantás van: most a finish jön.' };
      state.looks++;
      const s = await snapshot();
      const words = s.text.split(/\s+/).filter(x => !state.seenWords.has(x));
      words.forEach(x => state.seenWords.add(x));
      state.simSeconds += scenario.mode === 'fiveSecond' ? 5 : COST.look + words.length / wpm * 60 * 0.6; // skim factor
      const f = await shot();
      const ok = await successCheck(); if (ok) state.successSeen = true;
      log({ kind: 'look', url: s.url, scrollPct: s.scrollPct, shot: f, newWords: words.length });
      return { ...s, screenshot: path.join(run, f), budgetLeft: budgetLeft(), successReached: ok, keyboardOnly };
    },
    async click({ ref }) {
      if (keyboardOnly) return { error: 'Billentyűzet-lencse: csak a key parancs használható.' };
      if (scenario.mode === 'fiveSecond') return { error: 'Az 5 másodperces tesztben nincs kattintás.' };
      const loc = page.locator(`[data-pt-ref="${ref}"]`).first();
      if (!(await loc.count())) return { error: 'Nincs ilyen ref; előbb look.' };
      const href = await loc.getAttribute('href').catch(() => null);
      if (href && href.startsWith('#') && href.length > 1) {
        const exists = await page.evaluate(id => !!document.getElementById(id), decodeURIComponent(href.slice(1)));
        if (!exists) { state.brokenAnchors.push(href); log({ kind: 'broken-anchor', href }); }
      }
      const before = await fingerprint(); const extBefore = state.external.length; const t = Date.now();
      await loc.click({ timeout: 5000 }).catch(e => log({ kind: 'click-error', ref, error: String(e).slice(0, 120) }));
      await page.waitForTimeout(1200); await page.waitForLoadState('domcontentloaded').catch(() => {});
      const after = await fingerprint();
      state.actions++; state.simSeconds += COST.click + (lens?.browser?.network === '3g' ? (Date.now() - t) / 1000 : 0);
      const dead = before === after && state.external.length === extBefore;
      if (dead) { state.deadClicks++; }
      log({ kind: 'click', ref, href, dead });
      return { ok: true, dead, externalNavigation: state.external.length > extBefore ? state.external.slice(-1)[0] : null, budgetLeft: budgetLeft() };
    },
    async type({ ref, text }) {
      if (scenario.mode === 'fiveSecond') return { error: 'Az 5 másodperces tesztben nincs gépelés.' };
      const loc = page.locator(`[data-pt-ref="${ref}"]`).first();
      await loc.fill(String(text || '').slice(0, 80)).catch(e => log({ kind: 'type-error', error: String(e).slice(0, 120) }));
      state.actions++; state.simSeconds += COST.type * String(text || '').length;
      log({ kind: 'type', ref, chars: String(text || '').length });
      return { ok: true, budgetLeft: budgetLeft() };
    },
    async key({ key }) {
      if (scenario.mode === 'fiveSecond') return { error: 'Az 5 másodperces tesztben nincs billentyű.' };
      const allowedKeys = ['Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape', 'ArrowDown', 'ArrowUp'];
      if (!allowedKeys.includes(key)) return { error: 'Engedélyezett: ' + allowedKeys.join(', ') };
      const inField = await page.evaluate(() => /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || ''));
      if (key === 'Enter' && inField) return { error: 'Mezőben az Enter beküldene: blokkolva.' };
      const before = await fingerprint();
      await page.keyboard.press(key === 'Space' ? ' ' : key); await page.waitForTimeout(700);
      state.actions++; state.simSeconds += COST.key;
      const focused = await page.evaluate(() => { const f = document.activeElement; if (!f || f === document.body) return null; const r = f.getBoundingClientRect(); const cs = getComputedStyle(f);
        return { name: (f.getAttribute('aria-label') || f.innerText || f.tagName).replace(/\s+/g, ' ').trim().slice(0, 80), inView: r.bottom > 0 && r.top < innerHeight,
          visibleFocus: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none' }; });
      const dead = (key === 'Enter' || key === 'Space') && before === await fingerprint();
      if (dead) state.deadClicks++;
      log({ kind: 'key', key, focused, dead });
      return { ok: true, focused, dead, budgetLeft: budgetLeft() };
    },
    async scroll({ dir }) {
      if (keyboardOnly) return { error: 'Billentyűzet-lencse: görgetni a Tab-bal vagy nyíllal tudsz (key).' };
      if (scenario.mode === 'fiveSecond') return { error: 'Az 5 másodperces tesztben nincs görgetés.' };
      await page.evaluate(d => scrollBy({ top: (d === 'up' ? -1 : 1) * innerHeight * 0.8, behavior: 'instant' }), dir); await page.waitForTimeout(400);
      state.actions++; state.simSeconds += COST.scroll;
      log({ kind: 'scroll', dir });
      return { ok: true, budgetLeft: budgetLeft() };
    },
    async back() {
      await page.goBack({ timeout: 15000 }).catch(() => {}); state.actions++; state.simSeconds += COST.back;
      log({ kind: 'back', url: page.url() }); return { ok: true, url: page.url(), budgetLeft: budgetLeft() };
    },
    async note({ text }) { log({ kind: 'note', text: String(text || '').slice(0, 400) }); return { ok: true }; },
    async finish(a) {
      const ok = await successCheck(); if (ok) state.successSeen = true;
      const s = await page.evaluate(() => ({ events: window.__ptEvents, submits: window.__ptSubmits })).catch(() => ({ events: [], submits: 0 }));
      let issues = []; try { issues = a.issues ? JSON.parse(a.issues) : []; } catch { issues = [{ severity: 'P3', where: 'jelentés', text: 'Az issues nem érvényes JSON: ' + String(a.issues).slice(0, 200) }]; }
      const result = { persona: persona.id, scenario: scenario.id, lens: lens?.id || null,
        selfReported: a.result || 'fail', seq: Number(a.seq) || null, trust: Number(a.trust) || null, answer: a.answer || '', summary: a.summary || '', issues,
        metrics: { simSeconds: +state.simSeconds.toFixed(1), actions: state.actions, deadClicks: state.deadClicks, brokenAnchors: state.brokenAnchors,
          externalNavigations: state.external, successAuto: scenario.success.type === 'judge' ? null : state.successSeen,
          overBudget: state.simSeconds > scenario.budget.seconds || state.actions > scenario.budget.actions,
          blockedRequests: state.blocked, formSubmitsBlocked: s.submits, dataLayerEvents: [...new Set(s.events)] },
        finished: new Date().toISOString() };
      fs.writeFileSync(path.join(run, 'result.json'), JSON.stringify(result, null, 1));
      log({ kind: 'finish', result: result.selfReported }); state.finished = true;
      return { ok: true, saved: path.join(run, 'result.json'), metrics: result.metrics };
    },
    async stop() { setTimeout(async () => { await browser.close().catch(() => {}); process.exit(0); }, 50); return { ok: true }; }
  };

  let idle = setTimeout(() => process.exit(0), IDLE_MS);
  const server = http.createServer((req, res) => {
    let body = ''; req.on('data', c => body += c);
    req.on('end', async () => {
      clearTimeout(idle); idle = setTimeout(async () => { await browser.close().catch(() => {}); process.exit(0); }, IDLE_MS);
      let out; try { const { cmd, ...a } = JSON.parse(body || '{}'); out = handlers[cmd] ? await handlers[cmd](a) : { error: 'ismeretlen parancs: ' + cmd }; }
      catch (e) { out = { error: String(e).slice(0, 300) }; }
      res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(out));
    });
  });
  server.listen(0, '127.0.0.1', () => fs.writeFileSync(path.join(run, 'server.json'), JSON.stringify({ port: server.address().port, pid: process.pid })));
}

// ---------------------------------------------------------------- client
async function send(run, payload) {
  const info = readJson(path.join(path.resolve(run), 'server.json'));
  const res = await fetch(`http://127.0.0.1:${info.port}/`, { method: 'POST', body: JSON.stringify(payload) });
  return res.json();
}

async function main() {
  const o = args(process.argv.slice(2)); const cmd = o._[0];
  if (!cmd || !o.run) { print({ error: 'Használat: browser.mjs <start|look|click|type|key|scroll|back|note|finish|stop> --run <dir> …' }); process.exit(1); }
  if (cmd === 'serve') return serve(o);
  if (cmd === 'start') {
    loadSetup(o); // validate before spawning
    const run = path.resolve(o.run); fs.mkdirSync(run, { recursive: true }); fs.rmSync(path.join(run, 'server.json'), { force: true });
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url), 'serve', ...process.argv.slice(3)], { detached: true, stdio: ['ignore', fs.openSync(path.join(run, 'server.log'), 'a'), fs.openSync(path.join(run, 'server.log'), 'a')] });
    child.unref();
    for (let i = 0; i < 150; i++) { if (fs.existsSync(path.join(run, 'server.json'))) break; await new Promise(r => setTimeout(r, 200)); }
    if (!fs.existsSync(path.join(run, 'server.json'))) { print({ error: 'A böngésző nem indult el; lásd ' + path.join(run, 'server.log') }); process.exit(1); }
    const setup = loadSetup(o);
    return print({ ok: true, run, persona: setup.persona.label, scenario: setup.scenario.title, task: setup.scenario.task, budget: setup.scenario.budget, lens: setup.lens?.label || null,
      hint: 'Következő lépés: look' });
  }
  const payload = { cmd };
  if (o.ref) payload.ref = Number(o.ref);
  for (const k of ['text', 'key', 'dir', 'result', 'seq', 'trust', 'answer', 'summary', 'issues']) if (o[k] !== undefined) payload[k] = o[k];
  print(await send(o.run, payload));
}
main().catch(e => { print({ error: String(e) }); process.exit(1); });
