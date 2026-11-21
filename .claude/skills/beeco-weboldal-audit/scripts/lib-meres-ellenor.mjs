// beeco-weboldal-audit · lib-meres-ellenor.mjs – a mérési terv (reference/meresi-terv.json) gépi ellenőrzése.
// Kérdés: amit a terv szerint mérnünk kell, tényleg elmegy-e a GA4-be, a jó névvel és paraméterekkel, egyszer?
//
// BIZTONSÁG (mint a lib-measure.mjs): csak olvas. Minden analitikai küldés (GA collect, Clarity, Meta…), minden nem-GET kérés
// és a betöltés utáni dokumentum-navigáció route-szinten megszakad (a GA4-kérés üres 204-et kap, a Google-höz nem jut el); űrlapot nem küld, a beküldés eseménye megakad (preventDefault).
// A GA4-kérésből a nevet és a paramétereket a MEGSZAKÍTOTT kérésből olvassuk ki: ez az, amit az oldal valóban elküldene.
//
// Állapotok: ok = ✓ (megjött, jó névvel és paraméterekkel, a várt számban) · warn = ⚠ (megjött, de hibás: hiányzó paraméter,
// dupla, vagy a hívás megvan, a GA4-kérés nem látszik) · fail = ✗ (az elem megvan, de nem jött esemény; vagy hibás a consent-jel)
// · skip = – (nem tesztelhető: valódi küldés, valódi áruházi navigáció, hosszú várakozás, vagy az elem nincs az oldalon).

import { isSendUrl } from './lib-measure.mjs';

const GA_RE = /google-analytics\.com\/|analytics\.google\.com\/|\/(g|j|r)\/collect/i;
export const STATUS = { ok: '✓', warn: '⚠', fail: '✗', skip: '–' };
const IGNORED = /^(gtm\.|user_engagement$|session_start$|first_visit$|page_view$|scroll$)/; // „egyéb” listába nem kerül

// ------------------------------------------------------------ GA4 kérés kiolvasása (megszakított kérésből)
export function parseGaHit(url, body) {
  const out = [];
  try {
    const u = new URL(url); const base = Object.fromEntries(u.searchParams);
    const lines = body ? String(body).split('\n').filter(Boolean) : [null];
    for (const l of lines) {
      const own = l ? Object.fromEntries(new URLSearchParams(l)) : {}; const all = { ...base, ...own };
      const params = {};
      for (const k of Object.keys(all)) { const m = k.match(/^(ep|epn)\.(.+)$/); if (m) params[m[2]] = all[k]; }
      out.push({ en: all.en || '', tid: base.tid || '', gcs: base.gcs || '', gcd: base.gcd || '', params });
    }
  } catch { /* hibás URL */ }
  return out;
}

// ------------------------------------------------------------ init-szkript: dataLayer/gtag felvevő + kattintás-védelem
const INIT = () => {
  if (window.__me) return;
  const E = window.__me = { calls: [], order: [], opens: 0, submitBlocked: 0 };
  const val = v => { try { if (v == null || typeof v === 'number' || typeof v === 'boolean') return v; if (typeof v === 'string') return v.slice(0, 160); return JSON.stringify(v).slice(0, 160); } catch { return '?'; } };
  const prm = o => { const r = {}; if (o && typeof o === 'object') for (const k of Object.keys(o).slice(0, 30)) r[k] = val(o[k]); return r; };
  const seen = new WeakSet();
  const rec = it => {
    try {
      if (it && typeof it === 'object') { if (seen.has(it)) return; seen.add(it); }
      const isArgs = Object.prototype.toString.call(it) === '[object Arguments]';
      if (isArgs || (Array.isArray(it) && typeof it[0] === 'string')) {
        const a = Array.from(it), t = Date.now();
        if (a[0] === 'event') E.calls.push({ t, src: 'gtag', name: String(a[1]), params: prm(a[2]) });
        else if (/^(config|consent|js)$/.test(a[0])) E.order.push({ t, cmd: a[0], arg: a[0] === 'consent' ? a[1] + ' ' + JSON.stringify(a[2] || {}).slice(0, 140) : typeof a[1] === 'string' ? a[1].slice(0, 30) : '' });
      } else if (it && typeof it === 'object' && typeof it.event === 'string') {
        const { event, ...rest } = it; E.calls.push({ t: Date.now(), src: 'dl', name: event, params: prm(rest) });
      }
    } catch { /* a felvevő soha nem törheti el az oldalt */ }
  };
  const wrap = arr => {
    if (!Array.isArray(arr) || arr.__me) return arr;
    try { Object.defineProperty(arr, '__me', { value: true }); } catch {}
    for (const it of arr.slice()) rec(it);
    const orig = arr.push; arr.push = function () { for (const x of arguments) rec(x); return orig.apply(this, arguments); };
    return arr;
  };
  let _dl; Object.defineProperty(window, 'dataLayer', { configurable: true, get() { return _dl; }, set(v) { _dl = wrap(v); } });
  E.scan = () => { try { for (const it of (window.dataLayer || [])) rec(it); } catch {} };
  document.addEventListener('click', e => {
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && !(a.getAttribute('href') || '').startsWith('#')) e.preventDefault();
    const b = e.target && e.target.closest ? e.target.closest('button,input[type=submit],input[type=image]') : null;
    if (b && (b.type === 'submit' || b.type === 'image') && b.closest('form')) { e.preventDefault(); E.submitBlocked++; }
  }, true);
  document.addEventListener('submit', e => { e.preventDefault(); E.submitBlocked++; }, true);
  window.open = function () { E.opens++; return null; };
};

// ------------------------------------------------------------ védett környezet
export async function openCapture(browser, url, { w = 1440, h = 900, mobile = false, stripConfig = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, locale: 'hu-HU', timezoneId: 'Europe/Budapest', serviceWorkers: 'block' });
  const page0 = { f: null };
  const st = { allowNav: true, hits: [], blocked: 0, navBlocked: 0, writeBlocked: 0, status: 0 };
  await ctx.route('**/*', async route => {
    const req = route.request(); const u = req.url(); const m = req.method();
    try {
      if (/^(data|blob):/i.test(u)) return await route.continue();
      if (req.isNavigationRequest() && !st.allowNav) { st.navBlocked++; return await route.abort(); }
      // önteszt (--simulate-fix): a Webflow saját gtag('config') sora nélkül töltjük be az oldalt, csak a mérő böngészőjében; a webhelyhez nem nyúl
      if (stripConfig && req.resourceType() === 'document' && req.frame() === page0.f) {
        const resp = await route.fetch(); let body = await resp.text();
        body = body.replace(/gtag\(\s*['"]config['"]\s*,\s*['"]G-[A-Z0-9]+['"]\s*\);?/g, ''); st.stripped = (st.stripped || 0) + 1;
        const hd = { ...resp.headers() }; delete hd['content-encoding']; delete hd['content-length'];
        return await route.fulfill({ status: resp.status(), headers: hd, body });
      }
      if (isSendUrl(u)) {
        if (GA_RE.test(u)) { const t = Date.now(); for (const x of parseGaHit(u, req.postData())) st.hits.push({ ...x, t }); }
        st.blocked++;
        // a GA4-kérésre üres 204-et adunk (nem abort): így a gtag sikeres küldést lát, és a következő eseményeket is kiküldi (a kérés a Google-höz sosem jut el)
        if (GA_RE.test(u)) return await route.fulfill({ status: 204, body: '' });
        return await route.abort();
      }
      if (!/^(GET|HEAD|OPTIONS)$/i.test(m)) { st.writeBlocked++; return await route.abort(); }
      return await route.continue();
    } catch { /* az oldal közben bezárult */ }
  });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage(); page0.f = page.mainFrame();
  const t0 = Date.now();
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => ({ err: e }));
  st.status = resp && resp.status ? resp.status() : 0; st.gotoErr = resp && resp.err ? String(resp.err.message).slice(0, 100) : '';
  await page.waitForLoadState('load', { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(2500);
  st.allowNav = false;
  return { ctx, page, st, t0 };
}

const snap = async (page, st) => {
  await page.evaluate(() => window.__me && window.__me.scan && window.__me.scan()).catch(() => {});
  const E = await page.evaluate(() => window.__me ? { calls: window.__me.calls.slice(), order: window.__me.order.slice() } : { calls: [], order: [] }).catch(() => ({ calls: [], order: [] }));
  return { calls: E.calls, order: E.order, hits: st.hits.slice() };
};

// A gtag az események egy részét ~5 mp-ig gyűjti, és oldalelhagyáskor (pagehide) küldi ki. Ezt váltjuk ki, hogy a GA4-kérés azonnal látszódjon.
const flush = async page => { await page.evaluate(() => { try { window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })); } catch {} }).catch(() => {}); await page.waitForTimeout(600); };

// ------------------------------------------------------------ műveletek
async function doAction(page, a) {
  const note = [];
  const target = async () => {
    const loc = page.locator(a.selector); const n = await loc.count();
    if (!n) return null;
    const el = loc.nth(Math.min(a.nth || 0, n - 1));
    await el.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
    return el;
  };
  switch (a.type) {
    case 'load': await page.waitForTimeout(a.wait || 500); return { ok: true, note };
    case 'wait': await page.waitForTimeout(a.ms || 1000); return { ok: true, note };
    case 'scroll': {
      const pcts = a.steps || [30, 60, 95];
      for (const p of pcts) { await page.evaluate(x => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * x / 100, behavior: 'instant' }), p); await page.waitForTimeout(a.stepWait || 450); }
      return { ok: true, note };
    }
    case 'view': { const el = await target(); if (!el) return { ok: false, missing: true, note }; await page.waitForTimeout(a.wait || 900); return { ok: true, note }; }
    case 'click': case 'toggle': {
      const el = await target(); if (!el) return { ok: false, missing: true, note };
      try { await el.click({ timeout: 4000 }); }
      catch (e) { try { await el.evaluate(n => n.click()); note.push('JS-kattintás (valódi kattintást takarás akadályozta)'); } catch (e2) { return { ok: false, err: String(e2.message).slice(0, 80), note }; } }
      return { ok: true, note };
    }
    case 'simulate-done': { // a Webflow „köszönjük” blokkjának megjelenítése űrlapküldés nélkül
      const r = await page.evaluate(sel => { const f = document.querySelector(sel); const k = f && f.closest('.w-form') && f.closest('.w-form').querySelector('.w-form-done'); if (!k) return false; k.style.display = 'block'; return true; }, a.selector);
      return r ? { ok: true, note: ['a „köszönjük” blokkot JS-ből jelenítettem meg, űrlapot nem küldtem'] } : { ok: false, missing: true, note };
    }
    default: return { ok: false, err: 'ismeretlen művelet: ' + a.type, note };
  }
}

// ------------------------------------------------------------ egy esemény kiértékelése
export function evaluate(item, win) {
  const want = item.event;
  const calls = win.calls.filter(c => c.name === want), gt = calls.filter(c => c.src === 'gtag'), dl = calls.filter(c => c.src === 'dl');
  const wire = win.hits.filter(h => h.en === want);
  const first = gt[0] || dl[0] || null;
  const have = new Set([...Object.keys(first ? first.params : {}), ...Object.keys(wire[0] ? wire[0].params : {})]);
  const missing = (item.params || []).filter(p => !have.has(p));
  const bad = [];
  for (const [k, re] of Object.entries(item.values || {})) { const v = first ? first.params[k] : wire[0]?.params[k]; if (v === undefined || !new RegExp(re).test(String(v))) bad.push(`${k}=${v === undefined ? '∅' : v} (várt: /${re}/)`); }
  const maxCalls = item.maxCalls || 1;
  const nGtag = gt.length || (dl.length && !gt.length ? dl.length : 0);
  const other = [...new Set(win.calls.map(c => c.name).filter(n => n !== want && !IGNORED.test(n)))];
  const r = { event: want, gtagCalls: gt.length, dlPushes: dl.length, wireHits: wire.length, params: first ? first.params : (wire[0]?.params || {}), others: other, problems: [] };
  if (!calls.length && !wire.length) { r.status = 'fail'; r.problems.push('nem jött esemény'); return r; }
  if (missing.length) r.problems.push('hiányzó paraméter: ' + missing.join(', '));
  if (bad.length) r.problems.push('eltérő érték: ' + bad.join('; '));
  if (nGtag > maxCalls) r.problems.push(`dupla küldés: ${nGtag}× hívás (várt: ${maxCalls})`);
  if (gt.length && !wire.length) r.problems.push('a gtag-hívás megvan, de GA4-kérés nem látszott (consent miatt visszatartva, vagy nem megy ki)');
  if (!gt.length && dl.length) r.problems.push('csak dataLayer-push (gtag-hívás nincs): GA4-be csak GTM-szabállyal jut el');
  if (wire.length && wire.some(h => !h.gcs)) r.problems.push('a GA4-kérésen nincs consent-jel (gcs)');
  r.status = r.problems.length ? 'warn' : 'ok';
  return r;
}

// ------------------------------------------------------------ oldal futtatása
export async function runPage(browser, origin, pg, { slow = false } = {}) {
  const url = origin.replace(/\/$/, '') + pg.path;
  const R = { id: pg.id, path: pg.path, url, items: [], error: '' };
  let cap;
  try { cap = await openCapture(browser, url, { mobile: !!pg.mobile, w: pg.mobile ? 390 : 1440, h: pg.mobile ? 844 : 900 }); }
  catch (e) { R.error = String(e.message).slice(0, 120); }
  if (!cap || cap.st.status >= 400 || cap.st.status === 0 || cap.st.gotoErr) {
    const why = R.error || (cap && cap.st.gotoErr) || `HTTP ${cap ? cap.st.status : '?'}`;
    R.error = R.error || `az oldal nem érhető el (${why})`;
    for (const it of pg.events) R.items.push({ key: it.key, event: it.event, status: 'skip', problems: [R.error], note: it.note || '' });
    if (cap) await cap.ctx.close().catch(() => {});
    return R;
  }
  const { page, st, ctx } = cap;
  R.status = st.status;
  try {
    await flush(page);
    const base = await snap(page, st); // betöltés közben megjött minden (a page_view is)
    R.load = { hits: base.hits.map(h => ({ en: h.en, gcs: h.gcs, gcd: h.gcd, tid: h.tid })), configs: base.order.filter(o => o.cmd === 'config').map(o => o.arg), order: base.order.map(o => `${o.cmd}${o.arg ? ' ' + o.arg : ''}`).slice(0, 12) };
    for (const it of pg.events) {
      const row = { key: it.key, event: it.event, action: it.action?.type || 'load', note: it.note || '', problems: [] };
      if (it.auto === false) { row.status = 'skip'; row.problems.push(it.reason || 'nem automatizálható'); R.items.push(row); continue; }
      if (it.slow && !slow) { row.status = 'skip'; row.problems.push('lassú teszt: `--slow` kapcsolóval fut (' + (it.reason || '') + ')'); R.items.push(row); continue; }
      let win;
      if (!it.action || it.action.type === 'load') { win = base; }
      else {
        const b = await snap(page, st);
        const res = await doAction(page, it.action);
        if (!res.ok) {
          row.status = 'skip'; row.problems.push(res.missing ? `az elem nincs az oldalon (${it.action.selector}); más környezetben lehet` : 'a művelet nem futott le: ' + res.err);
          if (it.required) { row.status = 'fail'; row.problems = [res.missing ? `kötelező elem hiányzik: ${it.action.selector}` : row.problems[0]]; }
          R.items.push(row); continue;
        }
        await page.waitForTimeout(it.action.settle || 900);
        await flush(page);
        const a = await snap(page, st);
        win = { calls: a.calls.slice(b.calls.length), hits: a.hits.slice(b.hits.length), order: a.order.slice(b.order.length) };
        row.note = [row.note, ...res.note].filter(Boolean).join(' · ');
      }
      Object.assign(row, evaluate(it, win), { key: it.key, action: row.action, note: row.note });
      R.items.push(row);
    }
    if (st.writeBlocked || st.navBlocked) R.guard = { navBlocked: st.navBlocked, writeBlocked: st.writeBlocked, collectBlocked: st.blocked };
  } catch (e) { R.error = 'futási hiba: ' + String(e.message).slice(0, 140); }
  await ctx.close().catch(() => {});
  return R;
}

// ------------------------------------------------------------ consent-kör: N friss betöltés + elutasítás/elfogadás
// A gcs a GA4-kérés Google-consent állapota (G1xy: x = ad_storage, y = analytics_storage; G100 = mindkettő tiltva, G111 = mindkettő engedve).
// Minden betöltés első GA4-kérésén (page_view) lennie kell gcs-nek: ha hiányzik, a kérés consent-állapot nélkül ment ki (versenyhelyzet:
// a gtag config a consent default előtt fut). A 2026-11-04-i mérés: a Webflow saját gtag('config') sorával 5/7 betöltésnél hiányzott.
const gcdLetters = g => (String(g || '').match(/[a-z]/g) || []).slice(0, 4); // ad_storage, analytics_storage, ad_user_data, ad_personalization; „l” = nincs beállítva

export async function consentRound(browser, origin, { path = '/', loads = 7, concurrency = 1, gcsRe = '^G1[01][01]$', simulateFix = false } = {}) {
  const url = origin.replace(/\/$/, '') + path; const re = new RegExp(gcsRe);
  const C = { url, simulateFix, loads: [], total: loads, missing: 0, invalid: 0, noDefault: 0, config: new Set(), tid: new Set(), findings: [] };
  const one = async i => {
    const L = { i: i + 1, firstHit: null, hits: 0 };
    let cap;
    try { cap = await openCapture(browser, url, { stripConfig: simulateFix }); } catch (e) { L.error = String(e.message).slice(0, 80); return L; }
    await cap.page.waitForTimeout(1500);
    await flush(cap.page);
    const s = await snap(cap.page, cap.st);
    const pv = s.hits.filter(h => h.en === 'page_view'); L.hits = s.hits.length;
    const h0 = pv[0] || s.hits[0] || null;
    L.firstHit = h0 ? { en: h0.en, gcs: h0.gcs, gcd: h0.gcd, tid: h0.tid } : null; L.pageViews = pv.length;
    L.configs = s.order.filter(o => o.cmd === 'config').map(o => o.arg);
    // szerkezeti kockázat: a gtag config a consent-parancs (default/update) előtt fut a saját dataLayeren
    L.configBeforeConsent = (() => { const ci = s.order.findIndex(o => o.cmd === 'config'); const di = s.order.findIndex(o => o.cmd === 'consent'); return ci !== -1 && (di === -1 || ci < di); })();
    await cap.ctx.close().catch(() => {});
    return L;
  };
  const idx = [...Array(loads).keys()]; const out = [];
  for (let k = 0; k < idx.length; k += concurrency) out.push(...await Promise.all(idx.slice(k, k + concurrency).map(one)));
  C.loads = out;
  for (const L of out) {
    if (L.error || !L.firstHit) continue;
    if (!L.firstHit.gcs) C.missing++; else if (!re.test(L.firstHit.gcs)) C.invalid++;
    if (gcdLetters(L.firstHit.gcd).slice(0, 2).includes('l')) C.noDefault++;
    for (const c of L.configs || []) C.config.add(c); if (L.firstHit.tid) C.tid.add(L.firstHit.tid);
  }
  C.configFirst = out.filter(L => L.configBeforeConsent).length;
  C.noHit = out.filter(L => !L.error && !L.firstHit).length; C.errors = out.filter(L => L.error).length;
  C.config = [...C.config]; C.tid = [...C.tid];
  C.gcsValues = [...new Set(out.map(L => L.firstHit?.gcs || '∅'))];
  C.configsPerLoad = [...new Set(out.map(L => (L.configs || []).length))];
  C.pageViewsPerLoad = [...new Set(out.map(L => L.pageViews))];

  // elutasítás / elfogadás: utána az új kérések gcs-e igazodik-e
  const click = async (sel, re2) => {
    let cap; try { cap = await openCapture(browser, url); } catch { return { ran: false, why: 'betöltési hiba' }; }
    const { page, st } = cap;
    let btn = page.locator(sel).first();
    if (!(await btn.count()) || !(await btn.isVisible().catch(() => false))) {
      btn = null; const all = page.locator('button,a,[role=button]'); const n = Math.min(await all.count(), 150);
      for (let i = 0; i < n; i++) { const el = all.nth(i); const t = ((await el.innerText({ timeout: 300 }).catch(() => '')) || '').trim(); if (t && t.length < 40 && re2.test(t) && await el.isVisible().catch(() => false)) { btn = el; break; } }
    }
    if (!btn) { await cap.ctx.close().catch(() => {}); return { ran: false, why: 'a gomb nem található (sütisáv nincs, vagy más szöveg)' }; }
    const before = st.hits.length;
    await btn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1200);
    await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight * 0.5); }).catch(() => {});
    await page.waitForTimeout(1800);
    await page.mouse.move(100, 100).catch(() => {});
    const s = await snap(page, st);
    const after = s.hits.slice(before).filter(h => h.gcs || h.en);
    const consentCmds = s.order.filter(o => o.cmd === 'consent').map(o => o.arg.slice(0, 120));
    await cap.ctx.close().catch(() => {});
    return { ran: true, gcs: [...new Set(after.map(h => h.gcs || '∅'))], hits: after.length, consentCmds: consentCmds.slice(-2) };
  };
  C.reject = await click('.cky-btn-reject', /^\s*(elutasítom|elutasít|csak a szükséges(ek)?|reject( all)?|decline)\s*$/i);
  C.accept = await click('.cky-btn-accept', /^\s*(elfogadom|mindet elfogadom|összes elfogadása|mindent elfogadok|elfogad|accept( all)?)\s*$/i);

  // leletek
  const f = (status, key, msg, ev, fix) => C.findings.push({ status, key, msg, evidence: ev, fix });
  const ok = out.length - C.errors;
  if (simulateFix) f('skip', 'consent.simulation', 'SZIMULÁCIÓ: az oldalt a Webflow gtag(\'config\') sora nélkül töltöttem be (csak a mérő böngészőjében); a webhely nem változott', '', '');
  if (C.errors === out.length) f('skip', 'consent.round', 'A consent-kör nem futott le', out[0]?.error || '', 'Futtasd újra.');
  else {
    if (C.missing) f('fail', 'consent.gcs-missing', `Az első GA4-kérésen hiányzik a consent-jel (gcs): ${C.missing}/${ok} betöltésnél`, `gcs értékek betöltésenként: ${out.map(L => L.firstHit?.gcs || '∅').join(', ')} · gcd: ${out.map(L => L.firstHit?.gcd || '∅').join(', ')}`, 'Tedd a webhely Head code legelejére a szinkron `gtag(\'consent\',\'default\',{…denied…, wait_for_update:500})` sort (Levi). A Webflow saját GA-azonosítóját (Site settings → Integrations) csak akkor vedd ki, ha a saját eseményeket már a GTM küldi: 2026-11-04-i próba szerint nélküle egyetlen gtag(\'event\') sem megy ki, és a tiltó látogatók süti nélküli jelzése is elmarad.');
    if (C.invalid) f('fail', 'consent.gcs-invalid', `Váratlan gcs-érték ${C.invalid}/${ok} betöltésnél (nem G100/G101/G110/G111)`, C.gcsValues.join(', '), 'Nézd meg a Consent Mode beállítást.');
    if (C.configFirst && !C.missing && !C.invalid) f('warn', 'consent.config-first', `A gtag config a consent előtt fut ${C.configFirst}/${ok} betöltésnél: versenyhelyzet, a gcs hol megvan, hol nem`, `most ${ok}/${ok} betöltésnél volt gcs, de a sorrend nem garantált (config: ${C.config.join(', ')})`, 'Tedd a webhely Head code legelejére a szinkron `gtag(\'consent\',\'default\',{…denied…, wait_for_update:500})` sort (Levi). A Webflow saját GA-azonosítóját (Site settings → Integrations) csak akkor vedd ki, ha a saját eseményeket már a GTM küldi: 2026-11-04-i próba szerint nélküle egyetlen gtag(\'event\') sem megy ki, és a tiltó látogatók süti nélküli jelzése is elmarad.');
    if (C.noDefault && !C.missing) f('warn', 'consent.default-late', `A consent default nem volt beállítva az első kérésnél ${C.noDefault}/${ok} betöltésnél`, `gcd: ${out.map(L => L.firstHit?.gcd || '∅').join(', ')}`, 'A consent default legyen a config előtt (CookieYes/GTM).');
    if (C.noHit) f('warn', 'consent.no-hit', `${C.noHit}/${out.length} betöltésnél nem látszott GA4-kérés (page_view sem)`, 'Alapértelmezett tiltás mellett nem megy ki GA4-kérés: a tiltó/döntetlen látogatók oldalmegtekintése nem számolódik.', 'Ha ez nem szándékos: a GTM Google tagje legyen közzétéve, és Consent Mode (advanced) szerint is küldjön sütik nélküli pinget.');
    if (C.configsPerLoad.some(n => n > 1)) f('warn', 'consent.double-config', `Egy betöltésen belül több gtag config: ${C.configsPerLoad.join('/')} db (${C.config.join(', ')})`, 'Dupla page_view-t okozhat', 'Csak egy helyen legyen a Google tag.');
    if (C.pageViewsPerLoad.some(n => n > 1)) f('warn', 'consent.double-pageview', `Dupla page_view egy betöltésen (${C.pageViewsPerLoad.join('/')} db)`, '', 'Csak egy helyen legyen a Google tag.');
  }
  if (C.reject.ran) { const bad = C.reject.gcs.filter(g => g !== '∅' && g !== 'G100'); if (bad.length) f('fail', 'consent.reject-gcs', `Elutasítás után a gcs nem G100: ${bad.join(', ')}`, 'az elutasítás utáni kérések', 'A CookieYes elutasításkor frissítse a Consent Mode-ot (denied).'); else if (!C.reject.hits) f('skip', 'consent.reject-nohit', 'Elutasítás után nem látszott GA4-kérés (görgetés/kattintás után)', '', ''); }
  if (C.accept.ran) { const bad = C.accept.gcs.filter(g => g !== '∅' && g !== 'G111'); if (bad.length) f('warn', 'consent.accept-gcs', `Elfogadás után a gcs nem G111: ${bad.join(', ')}`, 'az elfogadás utáni kérések', 'A CookieYes elfogadáskor állítsa granted-re az analytics_storage-ot (és a hirdetési jeleket, ha engedélyezett).'); else if (!C.accept.hits) f('skip', 'consent.accept-nohit', 'Elfogadás után nem látszott GA4-kérés', '', ''); }
  if (!C.findings.some(x => x.status === 'fail' || x.status === 'warn')) f('ok', 'consent.ok', `Minden betöltésnél van gcs (${ok}/${ok})`, `gcs: ${C.gcsValues.join(', ')}`, '');
  return C;
}

// ------------------------------------------------------------ jelentés
export function summarize(pages, C) {
  const cnt = { ok: 0, warn: 0, fail: 0, skip: 0 };
  for (const p of pages) for (const it of p.items) cnt[it.status] = (cnt[it.status] || 0) + 1;
  if (C) for (const f of C.findings) cnt[f.status] = (cnt[f.status] || 0) + 1;
  return cnt;
}

export function toMarkdown({ origin, pages, consent, cnt, started }) {
  const L = [`# Mérés-ellenőrzés · ${origin}`, '', `Futás: ${started} · ✓ ${cnt.ok} · ⚠ ${cnt.warn} · ✗ ${cnt.fail} · – ${cnt.skip}`, '',
    'Jelmagyarázat: ✓ megjött, jó névvel/paraméterekkel, egyszer · ⚠ megjött, de hibás · ✗ az elem megvan, de nem jött esemény (vagy hibás consent-jel) · – nem tesztelhető (valódi küldés/navigáció, lassú teszt, vagy az elem nincs az oldalon). Az eseményt a megszakított GA4-kérésből olvassuk ki, valódi adat nem megy a GA4-be.', ''];
  if (consent) {
    L.push('## Consent-kör (gcs)', '');
    for (const f of consent.findings) L.push(`- ${STATUS[f.status]} **${f.msg}**${f.evidence ? ` — ${f.evidence}` : ''}${f.fix ? ` · Javítás: ${f.fix}` : ''}`);
    L.push('', `Betöltések (${consent.url}): ` + consent.loads.map(l => `#${l.i} gcs=${l.firstHit?.gcs || '∅'}`).join(' · '));
    if (consent.reject?.ran) L.push(`Elutasítás után: gcs ${consent.reject.gcs.join(', ') || '–'} (${consent.reject.hits} kérés)`); else L.push(`Elutasítás: nem futott (${consent.reject?.why || '?'})`);
    if (consent.accept?.ran) L.push(`Elfogadás után: gcs ${consent.accept.gcs.join(', ') || '–'} (${consent.accept.hits} kérés)`); else L.push(`Elfogadás: nem futott (${consent.accept?.why || '?'})`);
    L.push('');
  }
  for (const p of pages) {
    L.push(`## ${p.path} ${p.error ? '— ' + p.error : ''}`, '');
    if (p.load) L.push(`Betöltéskor: GA4-kérések: ${p.load.hits.map(h => `${h.en || '?'}${h.gcs ? ' (' + h.gcs + ')' : ' (gcs ∅)'}`).join(', ') || 'nincs'} · config: ${p.load.configs.join(', ') || 'nincs'}`, '');
    L.push('| | Esemény | Művelet | gtag/dl · GA4-kérés | Megjegyzés | Más esemény a művelet közben |', '|---|---|---|---|---|---|');
    for (const it of p.items) L.push(`| ${STATUS[it.status]} | \`${it.event}\` | ${it.action || ''} | ${it.gtagCalls ?? '–'}/${it.dlPushes ?? '–'} · ${it.wireHits ?? '–'} | ${[...(it.problems || []), it.note].filter(Boolean).join('; ').replace(/\|/g, '/')} | ${(it.others || []).join(', ')} |`);
    L.push('');
  }
  return L.join('\n');
}
