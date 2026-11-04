// Kötelező kattintásteszt a weboldal-kapuhoz: a nav-adat.json minden látogatói útját valódi böngészőben végigkattintja,
// asztalon (1440×900, valós hálózat) és telefonon (390×844, hamburgermenü, lassú 4G + 4× CPU).
// Lépésenként méri: jó oldalra érkezett-e, hány mozdulat kellett, és mennyi idő alatt jelent meg a céloldal (LCP).
// Az eredmény a nav-adat.json-ba kerül (journeys[].test, siteRules: nav.journey-*).
// Használat: node nav-journeys.mjs <nav-adat.json> [--base https://www.beeco.hu]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const file = argv.find(a => !a.startsWith('--'));
const base = (argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : 'https://www.beeco.hu').replace(/\/+$/, '');
if (!file) { console.error('Használat: node nav-journeys.mjs <nav-adat.json> [--base https://www.beeco.hu]'); process.exit(1); }
const NAV = JSON.parse(readFileSync(file, 'utf8'));

// határértékek (reference/pontozas.md, Navigáció): céloldal LCP a kattintás után
const LIMIT = { d: [2500, 4000], m: [4000, 6000] };
const VIEWS = { d: { viewport: { width: 1440, height: 900 } }, m: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' } };
const SEL = { menu: '.menu-lista, nav, header, .w-nav', lablec: 'footer, .lablec, .footer' };

async function lcpOf(page) {
  return page.evaluate(() => new Promise(res => {
    let v = null; try { new PerformanceObserver(l => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
    setTimeout(() => res(v == null ? null : Math.round(v)), 600);
  }));
}

async function findLink(page, to, via) {
  return page.evaluateHandle(({ to, via, SEL }) => {
    const norm = h => { try { const u = new URL(h, location.href); if (!/(^|\.)beeco\.hu$|webflow\.io$/.test(u.hostname)) return null; return u.pathname.replace(/\/+$/, '') || '/'; } catch { return null; } };
    const inArea = a => via === 'menu' ? !!a.closest(SEL.menu) : via === 'lablec' ? !!a.closest(SEL.lablec) : !a.closest(SEL.menu) && !a.closest(SEL.lablec);
    const all = [...document.querySelectorAll('a[href]')].filter(a => !a.closest('[inert],[aria-hidden="true"]') && (norm(a.getAttribute('data-beeco-orig') || a.getAttribute('href')) === to) && inArea(a));
    const vis = a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(a).visibility !== 'hidden'; };
    return all.find(vis) || all[0] || null;
  }, { to, via, SEL });
}

async function openMenuFor(page, link, mobile) {
  let taps = 0;
  const visible = () => link.evaluate(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(a).visibility !== 'hidden'; });
  if (await visible()) return taps;
  if (mobile) { const h = page.locator('.menu-hamb').first(); if (await h.isVisible().catch(() => false)) { await h.click(); taps++; await page.waitForTimeout(450); } }
  if (await visible()) return taps;
  const toggle = await link.evaluateHandle(a => { const d = a.closest('.w-dropdown'); return d && d.querySelector(':scope > .w-dropdown-toggle'); });
  if (toggle && (await toggle.evaluate(t => !!t))) {
    if (!mobile) { await toggle.hover().catch(() => {}); await page.waitForTimeout(300); }
    if (!(await visible())) { await toggle.click().catch(() => {}); }
    taps++; await page.waitForTimeout(450);
  }
  return taps;
}

async function runJourney(browser, j, mode) {
  const ctx = await browser.newContext({ ...VIEWS[mode], locale: 'hu-HU' });
  const page = await ctx.newPage();
  if (mode === 'm') { const c = await ctx.newCDPSession(page); await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  const res = { ok: true, taps: 0, steps: [], note: '' };
  try {
    await page.goto(base + '/', { waitUntil: 'load', timeout: 60000 });
    const rej = page.locator('.cky-btn-reject').first(); if (await rej.isVisible().catch(() => false)) await rej.click().catch(() => {});
    for (const s of j.path) {
      const link = await findLink(page, s.to, s.via);
      if (!(await link.evaluate(a => !!a))) { res.ok = false; res.steps.push({ to: s.to, via: s.via, ok: false, why: 'nem találtam a linket ezen a területen' }); break; }
      const orig = await link.evaluate(a => a.getAttribute('data-beeco-orig'));
      let taps = s.via === 'menu' ? await openMenuFor(page, link, mode === 'm') : 0;
      // fülön (Webflow Tabs) rejtett link: a látogató előbb a fülre kattint, ez plusz mozdulat
      const tab = await link.evaluateHandle(a => { const pane = a.closest('.w-tab-pane'); if (!pane || getComputedStyle(pane).display !== 'none') return null; const tabs = pane.closest('.w-tabs'); return tabs && tabs.querySelector(`.w-tab-link[data-w-tab="${CSS.escape(pane.getAttribute('data-w-tab') || '')}"]`); });
      let tabbed = false;
      if (await tab.evaluate(t => !!t)) { await tab.evaluate(t => t.scrollIntoView({ block: 'center' })); await tab.click().catch(() => {}); taps++; tabbed = true; await page.waitForTimeout(500); }
      if (s.via !== 'menu') await link.evaluate(a => a.scrollIntoView({ block: 'center' }));
      const href = await link.evaluate(a => a.href);
      if (orig && /play\.google|apps\.apple/.test(href)) { res.steps.push({ to: s.to, via: s.via, ok: true, taps: taps + 1, store: true, why: 'telefonon egyenesen az áruházba visz (szándékos)' }); res.taps += taps + 1; res.note = 'áruház'; break; }
      const t0 = Date.now();
      await Promise.all([page.waitForNavigation({ timeout: 30000 }).catch(() => null), link.click({ timeout: 10000 })]);
      await page.waitForLoadState('load', { timeout: 45000 }).catch(() => {});
      const ms = Date.now() - t0, lcp = await lcpOf(page);
      const landed = new URL(page.url()).pathname.replace(/\/+$/, '') || '/';
      const okStep = landed === s.to && await page.locator('h1').count() > 0;
      taps += 1; res.taps += taps;
      res.steps.push({ to: s.to, via: s.via, ok: okStep, taps, ms, lcp, landed, ...(tabbed ? { why: 'a link egy fül mögött van: előbb a fülre kell kattintani' } : {}) });
      if (!okStep) { res.ok = false; break; }
    }
  } catch (e) { res.ok = false; res.steps.push({ ok: false, why: String(e.message || e).slice(0, 160) }); }
  try { await ctx.close(); } catch {}
  return res;
}

// a böngésző hosszú futás közben összeomolhat: ilyenkor újraindítjuk, és az utat egyszer újrafuttatjuk
let browser = await chromium.launch();
async function live(force) { if (force || !browser.isConnected()) { const old = browser; browser = await chromium.launch(); old.close().catch(() => {}); } return browser; }
const findings = [];
for (const j of NAV.journeys) {
  j.test = {};
  for (const mode of ['d', 'm']) {
    let r = await runJourney(await live(), j, mode);
    if (!r.ok && /closed|crash|Target|disconnected/i.test(JSON.stringify(r.steps))) r = await runJourney(await live(true), j, mode);
    j.test[mode] = r;
    const last = r.steps[r.steps.length - 1] || {};
    const lab = mode === 'd' ? 'asztalon' : 'telefonon (lassú 4G)';
    console.log(`${r.ok ? '✓' : '✗'} ${mode} ${j.who}: ${j.goal} · ${r.taps} mozdulat${last.lcp != null ? ' · céloldal ' + (last.lcp / 1000).toFixed(1) + ' s' : ''}${last.why ? ' · ' + last.why : ''}`);
    if (!r.ok) findings.push({ sev: 'P1', key: `nav.journey-fail|${j.target}`, title: `A kattintásteszt elakadt ${lab}: ${j.who} – ${j.goal}`, evidence: (last.why || `ide érkezett: ${last.landed}`) + ` (cél: ${j.target})`, fix: 'Javítsd a linket vagy a menüt, hogy a valódi kattintás a céloldalra vigyen.' });
    else if (!last.store && last.lcp != null && last.lcp > LIMIT[mode][1]) findings.push({ sev: 'P2', key: `nav.journey-slow|${mode}|${j.target}`, title: `Lassan jelenik meg a céloldal ${lab}: ${(last.lcp / 1000).toFixed(1)} s (cél: ≤ ${LIMIT[mode][0] / 1000} s)`, evidence: `${j.who} – ${j.goal} → ${j.target}`, fix: 'A céloldal fő képe legyen eager + fetchpriority=high, kisebb méretben; kevesebb külső szkript.' });
    else if (!last.store && last.lcp != null && last.lcp > LIMIT[mode][0]) findings.push({ sev: 'P3', key: `nav.journey-slow|${mode}|${j.target}`, title: `A céloldal ${lab} ${(last.lcp / 1000).toFixed(1)} s alatt jelenik meg (cél: ≤ ${LIMIT[mode][0] / 1000} s)`, evidence: `${j.who} – ${j.goal} → ${j.target}`, fix: 'Gyorsítsd a céloldal fő képét és a szkripteket.' });
    if (mode === 'm' && r.ok && r.taps > 4) findings.push({ sev: 'P3', key: `nav.journey-taps|${j.target}`, title: `Telefonon ${r.taps} mozdulat kell a célhoz (cél: ≤ 4)`, evidence: `${j.who} – ${j.goal}`, fix: 'Adj közvetlen gombot a célra a főoldalon vagy a kapcsolódó oldalon.' });
  }
}
await browser.close().catch(() => {});
NAV.siteRules = (NAV.siteRules || []).filter(f => !String(f.key).startsWith('nav.journey')).concat(findings);
NAV.journeyTest = { at: new Date().toISOString(), base, limits: LIMIT, pass: NAV.journeys.every(j => j.test.d.ok && j.test.m.ok) };
writeFileSync(file, JSON.stringify(NAV));
console.log(`Kattintásteszt: ${NAV.journeys.filter(j => j.test.d.ok && j.test.m.ok).length}/${NAV.journeys.length} út sikeres mindkét nézetben · ${findings.length} lelet`);
