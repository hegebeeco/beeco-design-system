// beeco-weboldal-audit · lib-measure.mjs – mérés és marketing-analitika (v3, „measure” dimenzió).
//
// BIZTONSÁG: csak olvas. A mérő-környezet minden kimenő küldést megakadályoz:
//  - route-szinten megszakítja az analitikai (GA/GTM collect, Clarity collect, Meta, LinkedIn, Bing, sender.net)
//    és a Webflow-űrlap végpontokat, valamint MINDEN nem-GET kérést (sendBeacon, fetch POST…);
//  - betöltés után minden dokumentum-navigációt megszakít, és az oldalon a nem-horgony linkek kattintását letiltja;
//  - nem kattint beküldő gombra, űrlapot nem küld.
// Közben rögzíti, MIT KÜLDENE el: dataLayer/gtag hívások (init-szkript burkoló), a megszakított GA4 kérések `en=` neve, Clarity-hívások.
// A megszakított kérések számát a jelentés kiírja (blocked), a „leaked” azt számolja, ha mégis válasz érkezett volna.

export const SEND_RE = [
  /google-analytics\.com\/(?!analytics\.js|ga\.js)/i, /analytics\.google\.com\//i, /(^|\.)doubleclick\.net\//i, /googleadservices\.com\//i,
  /google\.com\/(pagead|ccm|measurement)\//i, /googletagmanager\.com\/(?!gtag\/js|gtm\.js|gtag\/destination)/i, /\/(g|j|r)\/collect(\?|$|\/)/i,
  /clarity\.ms\/(?!tag\/)/i, /facebook\.com\/tr\b/i, /px\.ads\.linkedin\.com/i, /bat\.bing\.com\/action/i, /analytics\.tiktok\.com\/api/i,
  /sender\.net/i, /webflow\.com\/api\/(v1\/)?forms?\b/i, /\/api\/v1\/form\//i,
];
const SENDER_RE = /sender\.net/i, WFFORM_RE = /webflow\.com\/api\/(v1\/)?forms?\b|\/api\/v1\/form\//i;
const GA_HIT_RE = /google-analytics\.com\/|analytics\.google\.com\/|doubleclick\.net\/|\/(g|j|r)\/collect/i;
export const isSendUrl = u => SEND_RE.some(r => r.test(u));

export const newStats = () => ({ allowNav: true, navBlocked: 0, blocked: { analytics: 0, sender: 0, webform: 0, write: 0 }, hosts: {}, sample: [], ga4: [], clarityHits: 0, tagUrls: new Set(), leaked: 0, escaped: 0 });

function parseGa(url, body) {
  const out = [];
  try {
    const u = new URL(url); const base = Object.fromEntries(u.searchParams);
    const lines = body ? String(body).split('\n').filter(Boolean) : [null];
    for (const l of lines) {
      const p = l ? Object.fromEntries(new URLSearchParams(l)) : {}; const all = { ...base, ...p };
      out.push({ en: all.en || '', tid: base.tid || '', gcs: base.gcs || '', gcd: base.gcd || '', params: Object.keys(all).filter(k => /^(ep|epn)\./.test(k)).map(k => k.replace(/^epn?\./, '')).slice(0, 10) });
    }
  } catch {}
  return out;
}

async function handle(route, st) {
  const req = route.request(); const url = req.url(); const m = req.method();
  try {
    if (/^(data|blob):/i.test(url)) return await route.continue();
    if (req.isNavigationRequest() && !st.allowNav) { st.navBlocked++; return await route.abort(); }
    let cat = null;
    if (isSendUrl(url)) cat = SENDER_RE.test(url) ? 'sender' : WFFORM_RE.test(url) ? 'webform' : 'analytics';
    else if (!/^(GET|HEAD|OPTIONS)$/i.test(m)) cat = 'write';
    if (cat) {
      if (GA_HIT_RE.test(url)) { const hits = parseGa(url, req.postData()); const t = Date.now(); for (const h of hits) st.ga4.push({ ...h, t }); }
      if (/clarity\.ms\/(collect|c\.gif|s\/)/i.test(url)) st.clarityHits++;
      st.blocked[cat] = (st.blocked[cat] || 0) + 1;
      try { const h = new URL(url).hostname; st.hosts[h] = (st.hosts[h] || 0) + 1; } catch {}
      if (st.sample.length < 12) st.sample.push(`${m} ${url.replace(/[?#].*$/, '').slice(0, 90)}`);
      return await route.abort();
    }
    return await route.continue();
  } catch { /* az oldal közben bezárult */ }
}

// ------------------------------------------------------------ init-szkript: dataLayer / gtag / clarity burkoló (az oldal szkriptjei előtt fut)
export const MX_INIT = () => {
  if (window.__mx) return;
  const M = window.__mx = { pushes: [], clicks: 0, clickLog: [], clarity: [], submitListeners: [], opens: 0, submitBlocked: 0 };
  const now = () => Date.now(); const seen = new WeakSet();
  const isArgs = x => Object.prototype.toString.call(x) === '[object Arguments]';
  const cmdLike = a => Array.isArray(a) && typeof a[0] === 'string' && /^(event|config|consent|set|js|get)$/.test(a[0]);
  const consentState = o => { const r = {}; try { for (const k of Object.keys(o || {})) if (/^(granted|denied)$/.test(o[k])) r[k] = o[k]; } catch {} return r; };
  const summarize = (it, t) => {
    if (isArgs(it) || cmdLike(it)) {
      const a = Array.from(it); const cmd = a[0];
      if (cmd === 'event') return { t, kind: 'gtag', cmd, name: String(a[1] || ''), keys: Object.keys(a[2] && typeof a[2] === 'object' ? a[2] : {}).slice(0, 10) };
      if (cmd === 'config') return { t, kind: 'gtag', cmd, name: String(a[1] || '') };
      if (cmd === 'consent') return { t, kind: 'gtag', cmd, name: String(a[1] || ''), state: consentState(a[2]) };
      return { t, kind: 'gtag', cmd, name: typeof a[1] === 'string' ? a[1].slice(0, 40) : '' };
    }
    if (it && typeof it === 'object') return { t, kind: 'dl', event: typeof it.event === 'string' ? it.event : '', keys: Object.keys(it).slice(0, 10) };
    return null;
  };
  const rec = it => { try { if (it && typeof it === 'object') { if (seen.has(it)) return; seen.add(it); } const s = summarize(it, now()); if (s) M.pushes.push(s); } catch {} };
  const wrapDL = arr => {
    if (!Array.isArray(arr) || arr.__mxw) return arr;
    try { Object.defineProperty(arr, '__mxw', { value: true }); } catch {}
    for (const it of arr.slice()) rec(it);
    const orig = arr.push; arr.push = function () { for (const x of arguments) rec(x); return orig.apply(this, arguments); };
    return arr;
  };
  let _dl; Object.defineProperty(window, 'dataLayer', { configurable: true, get() { return _dl; }, set(v) { _dl = wrapDL(v); } });
  let _cl; Object.defineProperty(window, 'clarity', { configurable: true, get() { return _cl; }, set(f) {
    if (typeof f === 'function' && !f.__mxw) { const w = function () { try { M.clarity.push({ t: now(), a0: String(arguments[0] || '').slice(0, 20), a1: typeof arguments[1] === 'string' ? arguments[1].slice(0, 40) : '' }); } catch {} return f.apply(this, arguments); }; try { Object.assign(w, f); } catch {} w.__mxw = true; _cl = w; } else _cl = f;
  } });
  M.scan = () => { try { for (const it of (window.dataLayer || [])) rec(it); } catch {} };
  M.dlOrder = () => { try { return (window.dataLayer || []).slice(0, 300).map(it => { const s = summarize(it, 0); return s ? { cmd: s.cmd || 'dl', name: s.name || s.event || '', state: s.state } : null; }).filter(Boolean); } catch { return []; } };
  // kattintás-védelem: nem-horgony linkek ne navigáljanak, beküldés ne történjen
  document.addEventListener('click', e => {
    M.clicks++;
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a) { const h = a.getAttribute('href') || ''; if (!h.startsWith('#')) e.preventDefault(); }
    const b = e.target && e.target.closest ? e.target.closest('button,input[type=submit],input[type=image]') : null;
    if (b && (b.type === 'submit' || b.type === 'image') && b.closest('form')) { e.preventDefault(); M.submitBlocked++; }
  }, true);
  document.addEventListener('submit', e => { e.preventDefault(); M.submitBlocked++; }, true);
  window.open = function () { M.opens++; return null; };
  try {
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, o) {
      try { if (type === 'submit' && M.submitListeners.length < 40) { const src = typeof fn === 'function' ? Function.prototype.toString.call(fn).slice(0, 3000) : ''; M.submitListeners.push({ on: this === window ? 'window' : this === document ? 'document' : (this.tagName || '?') + (this.id ? '#' + this.id : ''), track: /gtag|dataLayer|clarity|fbq|\bk\(|track/i.test(src) }); } } catch {}
      return add.call(this, type, fn, o);
    };
  } catch {}
};

export async function openGuarded(browser, url, { w = 1440, h = 900, mobile = false, st = newStats(), reducedMotion, colorScheme, setup } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, locale: 'hu-HU', timezoneId: 'Europe/Budapest', serviceWorkers: 'block', ...(reducedMotion ? { reducedMotion } : {}), ...(colorScheme ? { colorScheme } : {}) });
  st.allowNav = true;
  await ctx.route('**/*', r => handle(r, st));
  await ctx.addInitScript(MX_INIT);
  const watch = p => {
    p.on('request', r => { const u = r.url(); const m = u.match(/googletagmanager\.com\/(gtag\/js|gtm\.js)\?id=([\w-]+)/i) || u.match(/clarity\.ms\/tag\/([\w]+)/i); if (m) st.tagUrls.add(u.replace(/^https?:\/\//, '').split('&')[0].slice(0, 90)); if (/cookieyes\.com|cdn-cookieyes/i.test(u)) st.tagUrls.add('cookieyes'); });
    p.on('response', r => { if (isSendUrl(r.url())) st.leaked++; });
  };
  const page = await ctx.newPage(); watch(page); if (setup) setup(page);
  const nav = async p => { await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForLoadState('load', { timeout: 25000 }).catch(() => {}); };
  const open = async () => { st.allowNav = true; await nav(page); await page.waitForTimeout(2500); st.allowNav = false; };
  await open();
  return { ctx, page, st, open, newPage: async () => { const p = await ctx.newPage(); watch(p); st.allowNav = true; await nav(p); await p.waitForTimeout(1500); st.allowNav = false; return p; } };
}

// ------------------------------------------------------------ oldalon futó segédek
function pageProbe() {
  const out = {};
  const q = s => document.querySelector(s);
  out.gsc = !!q('meta[name="google-site-verification"][content]');
  out.banner = !!q('.cky-consent-container,.cky-banner,.cky-modal,[class*="cookieyes"],#CybotCookiebotDialog,.cc-window,#onetrust-banner-sdk,[class*="cookie-consent"],[class*="cookie-banner"]');
  out.bannerKind = q('.cky-consent-container,.cky-banner,[class*="cookieyes"]') ? 'CookieYes' : out.banner ? 'egyéb' : '';
  out.clarityStub = typeof window.clarity === 'function';
  out.gtagFn = typeof window.gtag === 'function';
  out.gtagScripts = [...document.scripts].map(s => s.src).filter(s => /googletagmanager\.com\/(gtag\/js|gtm\.js)/.test(s)).map(s => (s.match(/id=([\w-]+)/) || [])[1]).filter(Boolean);
  out.clarityScripts = [...document.scripts].map(s => s.src + ' ' + (s.textContent || '').slice(0, 600)).filter(s => /clarity\.ms|clarity_script/i.test(s)).length;
  out.height = document.documentElement.scrollHeight; out.vh = innerHeight;
  // belső linkek UTM-mal, áruházi linkek
  const isInt = h => /(^|\.)beeco\.hu$/.test(h) || h === location.hostname;
  out.utm = []; out.store = [];
  for (const a of document.querySelectorAll('a[href]')) {
    let u; try { u = new URL(a.href); } catch { continue; } if (!/^https?:$/.test(u.protocol)) continue;
    if (isInt(u.hostname) && /(^|&)(utm_[a-z]+|gclid|fbclid|msclkid)=/i.test(u.search.slice(1))) out.utm.push({ href: (u.pathname + u.search).slice(0, 100), text: (a.innerText || '').trim().slice(0, 40) });
    if (/apps\.apple\.com|itunes\.apple\.com|play\.google\.com/i.test(u.hostname + u.pathname)) out.store.push({ href: u.hostname + u.pathname.slice(0, 40), attr: /(^|&)(ct|pt|mt)=|(^|&)(utm_[a-z]+|referrer)=/i.test(u.search.slice(1)) });
  }
  // űrlap-mérési horog: inline szkriptek elemzése + a recorder által látott submit-figyelők
  const code = [...document.scripts].filter(s => !s.src).map(s => s.textContent || '').join('\n').slice(0, 800000);
  const srcs = [...document.scripts].map(s => s.src).filter(Boolean);
  const subIdx = []; { const re = /['"]submit['"]/g; let m; while ((m = re.exec(code)) && subIdx.length < 40) subIdx.push(m.index); }
  const win = i => code.slice(Math.max(0, i - 400), i + 1500);
  out.hooks = { b2bCta: /data-b2b-cta/.test(code), kkCta: /data-kk-cta/.test(code), scripts: srcs.filter(s => /beeco(kkmeres|ajanlatkeres)/i.test(s)).map(s => s.split('/').pop().slice(0, 40)), inlineNamed: /beeco(kkmeres|ajanlatkeres)/i.test(code), submitListeners: (window.__mx && window.__mx.submitListeners) || [] };
  out.forms = [...document.querySelectorAll('form')].map(f => {
    const r = f.getBoundingClientRect(); const fields = [...f.querySelectorAll('input,textarea,select')].filter(i => !/^(hidden|submit|button|image)$/.test(i.type));
    const lead = fields.some(i => /^(email|tel)$/.test(i.type) || /e-?mail|phone|tel|név|nev|name|ajanlat|uzenet|üzenet/i.test((i.name || '') + (i.getAttribute('data-name') || '') + (i.placeholder || '')));
    const names = [f.id, f.getAttribute('name'), f.getAttribute('data-name')].filter(Boolean);
    const hit = names.some(n => subIdx.some(i => win(i).includes(n)));
    const generic = subIdx.some(i => /(gtag|dataLayer\.push|clarity\()/.test(win(i)) && /(form|urlap|űrlap)/i.test(win(i)));
    const wfTrack = /w-form-done/.test(code) && /(gtag|dataLayer)/.test(code) && /MutationObserver/.test(code);
    const attrHook = !!f.querySelector('[data-b2b-cta],[data-kk-cta]') && /submit/.test(code);
    // a közös beeco mérőszkriptek (külön fájlként töltődnek, ezért a beágyazott kódban nem látszanak) a küldést is mérik
    const sharedHook = srcs.some(s => /beeco(kkmeres|ajanlatkeres)/i.test(s));
    const tracked = hit || wfTrack || attrHook || sharedHook || (generic && !names.length);
    return { id: f.id || '', name: f.getAttribute('data-name') || f.getAttribute('name') || '', lead, visible: r.width > 0 && r.height > 0, tracked, evidence: hit ? 'submit-figyelő hivatkozik az űrlapra' : sharedHook ? 'közös beeco mérőszkript (beecokkmeres / beecoajanlatkeres)' : wfTrack ? 'Webflow siker-megfigyelő + gtag' : attrHook ? 'data-*-cta a gombon + szkript' : generic ? 'általános submit-figyelő mérőhívással' : 'nincs egyedi küldés-mérési horog a kódban' };
  });
  return out;
}

function ctaEnumerate() {
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const tx = el => (el.value || el.innerText || el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
  const GEN = /gomb|button|btn|cta|w-button/i; const STORE = /apps\.apple\.com|itunes\.apple\.com|play\.google\.com|app-?store|google-?play/i;
  const OFFER = /ajánlat|ajanlat|árajánlat|időpont|foglal|demo|regisztr|csatlakoz|letölt|download|kérj|kérek|offer/i;
  const isInt = h => /(^|\.)beeco\.hu$/.test(h) || h === location.hostname;
  const mask = x => String(x || '').replace(/[\w.+-]+@([\w-]+\.[\w.-]+)/g, '…@$1').replace(/\+?\d[\d\s().-]{6,}\d/g, '…');
  const SOCIAL = /^(www\.)?(facebook|instagram|linkedin|tiktok|youtube|x|twitter|threads|pinterest)\.com$/;
  const out = []; let i = 0;
  document.querySelectorAll('[data-mx-i]').forEach(e => e.removeAttribute('data-mx-i'));
  for (const el of document.querySelectorAll('a[href],button,[role=button],input[type=button]')) {
    if (!vis(el)) continue;
    if (el.closest('[class*="cky"],[class*="cookie"],[id*="cookie"],[class*="sender"],.w-form-done,.w-form-fail')) continue;
    // végtelen sávok másolatai és rejtett ismétlések: a látogató nem kattinthat rájuk, a mérésük téves lelet lenne
    if (el.closest('[inert],[aria-hidden="true"]')) continue;
    if (/\bw-(nav-button|dropdown-toggle|tab-link|slider-arrow|slider-dot|lightbox)/.test(el.className || '') || el.hasAttribute('aria-expanded') || el.hasAttribute('aria-haspopup')) continue;
    if (el.closest('form') && (el.tagName === 'BUTTON' || el.tagName === 'INPUT')) continue;
    const href = el.tagName === 'A' ? (el.getAttribute('href') || '') : '';
    if (/^(javascript:|)$/i.test(href) && el.tagName === 'A') continue;
    if (/ugrás a tartalomra|skip to|ugrás a fő/i.test(tx(el))) continue;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); const t = tx(el).slice(0, 70);
    const solid = !/rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(cs.backgroundColor);
    const dataCta = [...el.attributes].some(a => /^data-[a-z0-9]+-cta$/.test(a.name));
    let abs = ''; try { abs = el.tagName === 'A' ? new URL(el.href).href : ''; } catch {}
    let host = ''; try { host = abs ? new URL(abs).hostname : ''; } catch {}
    const zone = el.closest('footer,[class*="lablec"]') ? 'footer' : el.closest('nav,.w-nav,[class*="menu-"]') ? 'nav' : 'main';
    let kind = null;
    if (host && SOCIAL.test(host)) kind = 'social';
    else if (STORE.test(abs + ' ' + (el.querySelector('img') ? el.querySelector('img').alt : '') + ' ' + t)) kind = 'store';
    else if (/^mailto:/i.test(href)) kind = 'mailto'; else if (/^tel:/i.test(href)) kind = 'tel';
    else if (dataCta || GEN.test(el.className || '') || (solid && parseFloat(cs.borderRadius) > 0 && t.length > 1 && t.length <= 40 && r.height >= 32)) kind = zone === 'nav' ? 'nav-cta' : href.startsWith('#') ? 'anchor' : 'cta';
    else if (host && !isInt(host)) kind = 'outbound';
    if (!kind) continue;
    const fold = r.top < innerHeight && r.bottom > 0 && r.left < innerWidth;
    out.push({ text: mask(t), href: mask(href).slice(0, 120), kind, zone, fold, solid, offer: OFFER.test(t + ' ' + href), dataCta, w: Math.round(r.width) });
    el.setAttribute('data-mx-i', String(i)); out[out.length - 1].i = i++;
  }
  return out;
}

const IGNORE_CTA = /^(page_view|session_start|first_visit|user_engagement|scroll|scroll_depth|gtm\.(js|dom|load|init|init_consent|scrollDepth|timer|historyChange.*))$/i;
const SCROLL_RE = /scroll/i;
function eventsOf(M, st, from, to, { scroll = false } = {}) {
  const evs = [];
  for (const p of M.pushes) if (p.t >= from && p.t <= to) {
    if (p.kind === 'gtag' && p.cmd === 'event') evs.push({ name: p.name, src: 'gtag' });
    else if (p.kind === 'dl' && p.event) evs.push({ name: p.event, src: 'dataLayer' });
  }
  for (const c of M.clarity) if (c.t >= from && c.t <= to && c.a0 === 'event') evs.push({ name: c.a1 || 'clarity_event', src: 'clarity' });
  for (const g of st.ga4) if (g.t >= from && g.t <= to && g.en) evs.push({ name: g.en, src: 'ga4' });
  return evs.filter(e => scroll ? SCROLL_RE.test(e.name) : !IGNORE_CTA.test(e.name));
}

/** Teljes mérési kör egy oldalra. Visszaad: M (nyers adat a pontozáshoz és a jelentéshez). */
export async function measureTracking(browser, url, { fast = false, qaKeyboard = null } = {}) {
  const t0 = Date.now(); const dbg = m => { if (process.env.MX_DEBUG) console.error(`    [mx ${((Date.now() - t0) / 1000).toFixed(1)}s] ${m}`); }; const M = { ok: false, url };
  const st = newStats(); let g = null;
  try {
    g = await openGuarded(browser, url, { st });
    const { page } = g;
    await page.waitForTimeout(1500);
    dbg('betöltve');
    const probe = await page.evaluate(pageProbe);
    await page.evaluate(() => window.__mx.scan());
    const base = await page.evaluate(() => ({ pushes: window.__mx.pushes, order: window.__mx.dlOrder(), clarity: window.__mx.clarity, submitListeners: window.__mx.submitListeners }));
    M.probe = { gsc: probe.gsc, banner: probe.banner, bannerKind: probe.bannerKind, clarityStub: probe.clarityStub, gtagFn: probe.gtagFn, height: probe.height, vh: probe.vh };
    // ---- címkék
    const cfg = base.order.find(o => o.cmd === 'config' && /^G-/.test(o.name));
    const gaIds = [...new Set([...(probe.gtagScripts || []).filter(x => /^G-/.test(x)), ...base.order.filter(o => o.cmd === 'config' && /^G-/.test(o.name)).map(o => o.name)])];
    const gtmIds = [...new Set([...(probe.gtagScripts || []).filter(x => /^GTM-/.test(x))])];
    const gaCollect = st.ga4.filter(x => x.tid || x.en);
    const cDefIdx = base.order.findIndex(o => o.cmd === 'consent' && o.name === 'default'); const cfgIdx = base.order.findIndex(o => o.cmd === 'config');
    const defState = cDefIdx >= 0 ? base.order[cDefIdx].state : null;
    M.tags = {
      ga4: { present: !!(gaIds.length || gtmIds.length || gaCollect.length || probe.gtagFn), ids: gaIds, gtm: gtmIds, initialized: !!(cfg || gaCollect.length), collectAttempts: gaCollect.length, gcs: [...new Set(gaCollect.map(x => x.gcs).filter(Boolean))].slice(0, 4) },
      clarity: { present: !!(probe.clarityScripts || probe.clarityStub || [...st.tagUrls].some(u => /clarity/.test(u))), initialized: st.clarityHits > 0 || base.clarity.length > 0, collectAttempts: st.clarityHits, calls: base.clarity.length },
      gsc: { meta: probe.gsc, note: probe.gsc ? 'meta google-site-verification megvan' : 'meta-címke nincs: a DNS-es igazolás innen nem látható, kézzel ellenőrizd (Search Console → Beállítások → Tulajdon-igazolás)' },
      consentMode: { present: cDefIdx >= 0, beforeConfig: cDefIdx >= 0 && (cfgIdx < 0 || cDefIdx < cfgIdx), state: defState },
      banner: { present: probe.banner, kind: probe.bannerKind, note: 'Részletes teszt: --consent' },
    };
    M.loadEvents = eventsOf(await page.evaluate(() => window.__mx), st, 0, Date.now() + 1, {}).map(e => `${e.name}`).slice(0, 30);
    // ---- görgetésmélység
    try {
      const H = await page.evaluate(() => document.documentElement.scrollHeight); const vh = await page.evaluate(() => innerHeight);
      M.scroll = { tested: H > vh * 2.2, events: [] };
      if (M.scroll.tested) {
        const t2 = Date.now(); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
        for (let k = 1; k <= 12; k++) { await page.evaluate(([k, H]) => scrollTo(0, H * k / 12), [k, H]); await page.waitForTimeout(240); }
        await page.waitForTimeout(900); await page.evaluate(() => window.__mx.scan());
        const mx = await page.evaluate(() => ({ pushes: window.__mx.pushes, clarity: window.__mx.clarity }));
        M.scroll.events = [...new Set(eventsOf(mx, st, t2, Date.now() + 5, { scroll: true }).map(e => `${e.name} (${e.src})`))];
        await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
      }
    } catch (e) { M.scroll = { tested: false, error: String(e.message).slice(0, 80) }; }
    // ---- CTA-szimuláció (navigáció letiltva, kimenő kérések megszakítva)
    dbg('scroll kész');
    const ctasAll = await page.evaluate(ctaEnumerate);
    const prio = c => (c.fold && c.zone === 'main' && c.kind === 'cta' ? 0 : c.kind === 'store' ? 1 : c.offer || c.dataCta ? 2 : c.kind === 'cta' || c.kind === 'nav-cta' ? 3 : c.kind === 'anchor' ? 4 : c.kind === 'mailto' || c.kind === 'tel' ? 5 : 6);
    const outbound = [...ctasAll.filter(c => c.kind === 'outbound').slice(0, 8), ...ctasAll.filter(c => c.kind === 'social').slice(0, 5)];
    const ctas = [...ctasAll.filter(c => c.kind !== 'outbound' && c.kind !== 'social'), ...outbound].map(c => ({ ...c, p: prio(c) }));
    const sel = [...ctas].sort((a, b) => a.p - b.p || a.i - b.i).slice(0, 48);
    const firstPrimary = ctas.filter(c => c.fold && c.zone === 'main' && c.kind === 'cta').sort((a, b) => (b.solid - a.solid) || a.i - b.i)[0];
    M.cta = { total: ctasAll.length, tested: 0, fired: 0, items: [] };
    for (const c of sel) {
      try {
        if (/^chrome-error:/.test(page.url()) || (new URL(page.url()).pathname !== new URL(url).pathname)) { st.escaped++; await g.open(); await page.evaluate(ctaEnumerate); }
        await page.evaluate(i => { const el = document.querySelector(`[data-mx-i="${i}"]`); if (el) el.scrollIntoView({ block: 'center' }); window.__mx.scan(); }, c.i);
        await page.waitForTimeout(220);
        const pos = await page.evaluate(i => { const el = document.querySelector(`[data-mx-i="${i}"]`); if (!el) return null; const r = el.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return { ok: !!top && (top === el || el.contains(top)), x, y, inView: y > 0 && y < innerHeight }; }, c.i);
        if (!pos) { M.cta.items.push({ ...c, skipped: 'eltűnt' }); continue; }
        const t1 = Date.now();
        if (pos.ok && pos.inView) await page.mouse.click(pos.x, pos.y); else await page.evaluate(i => { const el = document.querySelector(`[data-mx-i="${i}"]`); el && el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); }, c.i);
        await page.waitForTimeout(520);
        await page.evaluate(() => window.__mx.scan());
        const mx = await page.evaluate(() => ({ pushes: window.__mx.pushes, clarity: window.__mx.clarity }));
        const evs = eventsOf(mx, st, t1, Date.now() + 5, {});
        const names = [...new Set(evs.map(e => e.name))];
        M.cta.tested++; if (names.length) M.cta.fired++;
        M.cta.items.push({ i: c.i, text: c.text, href: c.href, kind: c.kind, zone: c.zone, fold: c.fold, offer: c.offer, primary: !!(firstPrimary && firstPrimary.i === c.i), fired: names, method: pos.ok && pos.inView ? 'egér' : 'szintetikus' });
        await page.keyboard.press('Escape').catch(() => {});
      } catch (e) { M.cta.items.push({ ...c, skipped: String(e.message).slice(0, 60) }); }
    }
    dbg('cta kész');
    M.cta.coverage = M.cta.tested ? Math.round(M.cta.fired / M.cta.tested * 100) : null;
    // ---- események összesítése (mérési térkép)
    await page.evaluate(() => window.__mx.scan());
    const all = await page.evaluate(() => ({ pushes: window.__mx.pushes, clarity: window.__mx.clarity }));
    const allEv = eventsOf(all, st, 0, Date.now() + 5, {}).concat(eventsOf(all, st, 0, Date.now() + 5, { scroll: true }));
    const cnt = new Map(); for (const e of allEv) { const k = e.name + '|' + e.src; cnt.set(k, (cnt.get(k) || 0) + 1); }
    for (const e of [...st.ga4]) if (e.en && IGNORE_CTA.test(e.en) && !SCROLL_RE.test(e.en)) { const k = e.en + '|ga4'; cnt.set(k, (cnt.get(k) || 0) + 1); }
    M.events = [...cnt.entries()].map(([k, n]) => { const [name, src] = k.split('|'); return { name, src, n }; }).sort((a, b) => b.n - a.n);
    M.forms = probe.forms; M.hooks = probe.hooks; M.submitListeners = base.submitListeners.slice(0, 10);
    M.utm = probe.utm.slice(0, 12); M.store = probe.store.slice(0, 6);
    // ---- billentyűzet-folyam és axe ugyanebben a védett környezetben (lib-qa adja a függvényeket)
    if (qaKeyboard) M.qa = await qaKeyboard(g, url);
    M.blocked = { ...st.blocked }; M.blockedHosts = st.hosts; M.blockedSample = st.sample; M.navBlocked = st.navBlocked; M.navEscaped = st.escaped; M.leaked = st.leaked;
    const fin = await page.evaluate(() => ({ submitBlocked: window.__mx.submitBlocked, opens: window.__mx.opens }));
    M.submitBlocked = fin.submitBlocked; M.opensBlocked = fin.opens;
    M.ga4Hits = st.ga4.slice(0, 40).map(x => ({ en: x.en, gcs: x.gcs, params: x.params }));
    M.ok = true;
  } catch (e) { M.error = String(e.stack || e).slice(0, 300); M.blocked = { ...st.blocked }; M.leaked = st.leaked; }
  finally { try { if (g) await g.ctx.close(); } catch {} }
  M.ms = Date.now() - t0;
  return M;
}

// ------------------------------------------------------------ pontozás
const SNAKE = /^[a-z][a-z0-9_]*$/;
const clipT = (s, n = 70) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
export function measureFindings(M, add, have, { b2b = false } = {}) {
  if (!M || !M.ok) { add('measure', 'P3', 'measure.not-run', `A mérési kör nem futott le${M?.error ? ': ' + clipT(M.error, 100) : ''}`, '', 'Futtasd újra; ha marad, nézd meg kézzel (GA4 DebugView, Clarity).', 0); return; }
  const T = M.tags;
  if (!T.ga4.present) add('measure', 'P1', 'measure.no-ga4', 'Nincs GA4-címke az oldalon (gtag/GTM nem látszik)', 'Se gtag.js, se GTM, se GA4-kérés', 'Telepítsd a GA4-et (Webflow: Site settings → Custom code → Head) a Consent Mode-dal együtt; a mérés nélkül nem látod, hogyan használják az oldalt.', 40);
  else if (!T.ga4.initialized) add('measure', 'P1', 'measure.ga4-not-init', 'A GA4-címke betöltődik, de nincs inicializálva (nincs gtag(\'config\', \'G-…\'), és nem indul kérés)', `Azonosítók: ${T.ga4.ids.join(', ') || T.ga4.gtm.join(', ') || '–'}`, 'Add hozzá a gtag(\'config\', \'G-…\') hívást, vagy ellenőrizd a GTM-ben a GA4-konfigurációs címke indítóját.', 25);
  if (!T.clarity.present) add('measure', 'P2', 'measure.no-clarity', 'Nincs Microsoft Clarity az oldalon', 'Nincs clarity szkript', 'Add hozzá a Clarity-kódot (Custom code → Head), hogy lásd a valós viselkedést (hőtérkép, visszajátszás).', 15);
  else if (!T.clarity.initialized) add('measure', 'P3', 'measure.clarity-silent', 'A Clarity betöltődik, de a mérőoldalon nem indult kérés (hozzájárulásra várhat)', `Clarity-hívások: ${T.clarity.calls}, kérés: ${T.clarity.collectAttempts}`, 'Nézd meg a Clarity-ben (Live) valódi böngészőből, hogy érkezik-e adat elfogadás után.', 0);
  if (!T.gsc.meta) add('measure', 'P3', 'measure.gsc-meta', 'Search Console: nincs google-site-verification meta; a DNS-es igazolás innen nem látható', T.gsc.note, 'Kézzel ellenőrizd a Search Console-ban, hogy a tulajdon igazolva van-e, és be van-e küldve a sitemap.', 2);
  if (T.ga4.present && !T.consentMode.present) add('measure', 'P1', 'measure.consent-default-missing', 'Nincs Consent Mode alapértelmezés (gtag(\'consent\', \'default\', …)) a GA4 előtt', 'A dataLayerben nincs consent/default bejegyzés', 'Állítsd be a Consent Mode v2 alapértelmezéseket (denied) a config ELŐTT; CookieYes: Settings → Google Consent Mode. Enélkül a GA4 vagy hozzájárulás nélkül mér, vagy elveszíti az elutasítók adatait.', 15);
  else if (T.ga4.present && T.consentMode.present && !T.consentMode.beforeConfig) add('measure', 'P1', 'measure.consent-order', 'A Consent Mode alapértelmezés a GA4-config UTÁN fut', `consent default állapot: ${JSON.stringify(T.consentMode.state || {})}`, 'Tedd a consent default hívást a gtag config elé (a Webflow fejkód elejére).', 10);
  // CTA-események
  const C = M.cta || { items: [], tested: 0 };
  for (const c of C.items.filter(x => !x.skipped && !x.fired.length)) {
    const soft = c.kind === 'social';
    const big = !soft && (c.primary || c.kind === 'store' || (c.offer && c.zone === 'main') || (/^(mailto|tel)$/.test(c.kind) && c.fold && c.zone === 'main'));
    add('measure', big ? 'P1' : soft ? 'P3' : 'P2', `measure.cta-silent|${c.kind}|${clipT(c.text || c.href, 30).toLowerCase()}`, `${big ? 'Kulcs-CTA' : 'CTA'} kattintása nem küld eseményt: „${clipT(c.text || c.href, 50)}”${c.fold ? ' (hajtás fölött)' : ''}`, `${c.kind}${c.href ? ' → ' + clipT(c.href, 60) : ''}; 500 ms-en belül nincs dataLayer/gtag/Clarity/GA4 esemény`, 'Köss rá eseményt (pl. data-b2b-cta + a közös mérő-szkript, vagy gtag(\'event\', \'cta_click\', {hely:…})); snake_case névvel.', big ? 12 : soft ? 1 : 4, big ? 'ctaP1' : soft ? 'ctaSoc' : 'ctaP2', big ? 36 : soft ? 4 : 24);
  }
  if (M.scroll?.tested && !M.scroll.events.length && T.ga4.present) add('measure', 'P3', 'measure.no-scroll-depth', 'Görgetés közben nem látszik scroll-esemény (scroll_depth / GA4 scroll)', `Oldalmagasság ≈ ${Math.round(M.probe.height / M.probe.vh * 10) / 10} nézet`, 'Kapcsold be a GA4 Enhanced measurement „Scrolls” opciót, vagy küldj scroll_depth eseményt 25/50/75/90 %-nál.', 3);
  // űrlapok
  for (const f of (M.forms || []).filter(f => f.lead && f.visible && !f.tracked)) add('measure', b2b ? 'P1' : 'P2', `measure.form-untracked|${f.id || f.name}`, `Az űrlap (${f.name || f.id || 'névtelen'}) beküldése nem mért: nincs küldés-mérési horog`, f.evidence + ' (a GA4 Enhanced measurement form_submit esetleg méri: nézd meg DebugView-ban)', 'Küldj eseményt a sikeres beküldéskor (pl. generate_lead / urlap_kuldve a Webflow siker-állapotra, vagy a közös beeco-szkript data-*-cta horgával).', b2b ? 15 : 8, 'formhook', 30);
  // UTM-higiénia
  for (const u of (M.utm || [])) add('measure', 'P2', `measure.utm-internal|${u.href}`, `Belső link utm_ paraméterrel: ${u.href}`, `Felirat: „${u.text || '–'}”; a belső utm új munkamenetet indít a GA4-ben`, 'Vedd le az utm_ paramétert a belső linkről; az utm csak külső hirdetési/levél linkekbe való.', 4, 'utm', 16);
  const noAttr = (M.store || []).filter(s => !s.attr);
  if (noAttr.length) add('measure', 'P3', 'measure.store-attribution', `${noAttr.length} áruházi link forgalom-forrás jelölés nélkül`, noAttr.map(s => s.href).join(', '), 'App Store: tegyél a linkre ct=<kampány> tokent; Google Play: referrer=utm_source%3Dbeeco.hu%26utm_medium%3Dweb – így látod, honnan jön a letöltés.', 2 * Math.min(2, noAttr.length));
  // esemény-elnevezés
  const bad = [...new Set((M.events || []).map(e => e.name).filter(n => n && !/^gtm\./.test(n) && (!SNAKE.test(n) || n.length > 40)))];
  for (const n of bad.slice(0, 6)) add('measure', 'P3', `measure.event-name|${n.toLowerCase().slice(0, 40)}`, `Esemény-név nem snake_case / túl hosszú: „${clipT(n, 45)}”`, 'Az esemény-nevek legyenek kisbetűs snake_case, szóköz nélkül, ≤ 40 karakter', 'Nevezd át (pl. cta_click, urlap_kuldve); a régi néven futó jelentéseket egyeztesd.', 2, 'evname', 8);
}

// ------------------------------------------------------------ jelentés
const pc = (a, b) => (b ? Math.round(a / b * 100) + ' %' : '–');
export function measureMd(P) {
  const M = P.measure; if (!M) return [];
  const L = ['**Mérési lefedettség**', ''];
  if (!M.ok) return [...L, `- A mérési kör nem futott le: ${M.error || 'ismeretlen hiba'}`, ''];
  const T = M.tags; const C = M.cta || { items: [] };
  const by = k => C.items.filter(x => !x.skipped && x.kind === k);
  const row = (label, present, cov, miss) => `| ${label} | ${present} | ${cov} | ${miss || '–'} |`;
  L.push('| Elem | Jelen? | Esemény-lefedettség | Hiányzó események / megjegyzés |', '|---|---|---|---|');
  L.push(row('GA4', T.ga4.present ? (T.ga4.initialized ? 'igen, inicializálva' : 'betöltve, NEM inicializált') : 'NEM', '–', T.ga4.ids.length ? T.ga4.ids.join(', ') : T.ga4.gtm.join(', ')));
  L.push(row('Clarity', T.clarity.present ? (T.clarity.initialized ? 'igen' : 'betöltve, nem küld') : 'NEM', '–', ''));
  L.push(row('Search Console', T.gsc.meta ? 'meta igen' : 'meta nincs', '–', T.gsc.meta ? '' : 'DNS-igazolás nem látható: kézzel ellenőrizd'));
  L.push(row('Consent Mode', T.consentMode.present ? (T.consentMode.beforeConfig ? 'igen, config előtt' : 'igen, de config UTÁN') : 'NEM', '–', T.consentMode.state ? Object.entries(T.consentMode.state).map(([k, v]) => `${k}=${v}`).join(' ') : ''));
  L.push(row('Sütisáv', T.banner.present ? 'igen' + (T.banner.kind ? ` (${T.banner.kind})` : '') : 'nincs', '–', 'részletes teszt: --consent'));
  L.push(row('CTA-k összesen', `${C.tested}/${C.total ?? '?'} tesztelve`, M.cta?.coverage != null ? `${M.cta.coverage} % (${M.cta.fired}/${C.tested})` : '–', C.items.filter(x => !x.skipped && !x.fired.length).slice(0, 6).map(x => `„${clipT(x.text || x.href, 25)}”`).join(', ')));
  for (const [k, label] of [['store', 'Áruházi gombok'], ['cta', 'Fő CTA-k'], ['social', 'Közösségi linkek'], ['nav-cta', 'Menü-CTA'], ['anchor', 'Horgony-CTA'], ['mailto', 'mailto'], ['tel', 'tel'], ['outbound', 'Kimenő linkek']]) { const a = by(k); if (a.length) L.push(row(label, `${a.length} db`, pc(a.filter(x => x.fired.length).length, a.length), a.filter(x => !x.fired.length).slice(0, 4).map(x => `„${clipT(x.text || x.href, 22)}”`).join(', '))); }
  L.push(row('Görgetésmélység', M.scroll?.tested ? 'mérve' : 'rövid oldal / nem mérve', M.scroll?.tested ? (M.scroll.events.length ? 'van: ' + M.scroll.events.join(', ') : '0 %') : '–', M.scroll?.tested && !M.scroll.events.length ? 'scroll_depth / scroll' : ''));
  const lf = (M.forms || []).filter(f => f.lead);
  L.push(row('Űrlap-beküldés', `${lf.length} db`, lf.length ? pc(lf.filter(f => f.tracked).length, lf.length) : '–', lf.filter(f => !f.tracked).map(f => f.name || f.id || 'névtelen').join(', ')));
  L.push('');
  const bl = M.blocked || {}; const nb = Object.values(bl).reduce((s, n) => s + (+n || 0), 0);
  L.push(`- Biztonság: a CTA-szimuláció alatt **${nb} kimenő kérés** megszakítva (analitika ${bl.analytics || 0}, sender ${bl.sender || 0}, Webflow-űrlap ${bl.webform || 0}, egyéb írás ${bl.write || 0}), megszakított navigáció ${M.navBlocked}, letiltott beküldés ${M.submitBlocked}, **kijutott kérés (leaked): ${M.leaked}**.`);
  if (M.events?.length) L.push(`- Az oldalon látott események: ${M.events.slice(0, 14).map(e => `\`${e.name}\` (${e.src}×${e.n})`).join(', ')}`);
  if (M.ga4Hits?.length) { const gcs = [...new Set(M.ga4Hits.map(h => h.gcs).filter(Boolean))]; L.push(`- GA4-kérések (megszakítva, csak a névből): ${[...new Set(M.ga4Hits.map(h => h.en).filter(Boolean))].join(', ') || '–'}${gcs.length ? ` · consent-jelzés (gcs): ${gcs.join(', ')}` : ''}`); }
  L.push('');
  return L;
}

/** Site-szintű mérési térkép: esemény-név → források, oldalak */
export function eventMap(pages) {
  const map = new Map();
  for (const p of pages) for (const e of (p.measure?.events || [])) { if (/^gtm\./.test(e.name)) continue; const o = map.get(e.name) || { name: e.name, sources: new Set(), pages: new Set(), n: 0 }; o.sources.add(e.src); o.pages.add(p.slug); o.n += e.n; map.set(e.name, o); }
  return [...map.values()].map(o => ({ name: o.name, sources: [...o.sources], pages: o.pages.size, n: o.n, ok: /^[a-z][a-z0-9_]*$/.test(o.name) && o.name.length <= 40 })).sort((a, b) => b.pages - a.pages || b.n - a.n);
}
export function eventMapMd(map, nPages) {
  if (!map) return [];
  const L = ['## Mérési térkép (az oldalakon látott események)', ''];
  if (!map.length) return [...L, '_Egyetlen oldalon sem látszott mérési esemény._', ''];
  L.push('| Esemény | Forrás | Oldalak | Név rendben? |', '|---|---|---|---|');
  for (const e of map.slice(0, 40)) L.push(`| \`${e.name}\` | ${e.sources.join(', ')} | ${e.pages}/${nPages} | ${e.ok ? 'igen' : 'NEM (snake_case, ≤ 40)'} |`);
  L.push('', '_Csak a beeco-oldalakon a szimuláció alatt látott események; a GA4 szerveroldali beállításai (konverzió-jelölés) innen nem látszanak._', '');
  return L;
}
