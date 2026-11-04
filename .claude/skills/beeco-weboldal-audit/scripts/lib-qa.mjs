// beeco-weboldal-audit · lib-qa.mjs – tesztelői (QA) kör (v3): nézetméret-mátrix + kontaktlap, böngészők, módok (sötét, csökkentett mozgás,
// 200 % nagyítás, JS nélkül, lassú 4G), axe-core akadálymentesség, billentyűzet-folyam, 404-oldal.
// Minden QA-oldalbetöltés a védett (lib-measure.openGuarded) környezetben fut: nem küld analitikát, nem küld űrlapot, nem navigál el.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';
import { openGuarded as _openGuarded0, newStats } from './lib-measure.mjs';
const _openGuarded = _openGuarded0;
const openGuarded = _openGuarded0;

const require = createRequire(import.meta.url);
export const MATRIX = [[320, 640, true], [390, 844, true], [768, 1024, false], [1024, 768, false], [1440, 900, false], [1920, 1080, false]];

// ------------------------------------------------------------ oldalon futó függvények
function visLen() {
  let n = 0; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const t = w.currentNode; const s = t.textContent.trim(); if (!s) continue; const p = t.parentElement;
    if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName) || p.closest('[class*="cky"],[class*="sender"],[class*="cookie"]')) continue;
    let ok = true; try { ok = p.checkVisibility({ opacityProperty: true, visibilityProperty: true }); } catch {}
    if (!ok) continue; const r = p.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; n += s.length;
  }
  return n;
}
function matrixProbe(cfg) {
  const vw = document.documentElement.clientWidth, vh = innerHeight;
  const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; try { return el.checkVisibility({ opacityProperty: true, visibilityProperty: true }); } catch { return true; } };
  const R = { vw, overflow: Math.max(0, document.scrollingElement.scrollWidth - vw) };
  const SKIPC = /w-slider|slider|carousel|marquee|ticker|w-dropdown-list|w-tab-content|swiper|lottie|w-lightbox/i;
  const clipped = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (clipped.length >= 12) break;
    if (/^(SCRIPT|STYLE|SVG|IMG|PATH|VIDEO|CANVAS|IFRAME|HTML|BODY)$/i.test(el.tagName) || el.closest('svg') || SKIPC.test(el.className && el.className.baseVal === undefined ? el.className : '') || el.closest('[class*="slider"],[class*="carousel"],[class*="marquee"],.w-dropdown-list,.w-tab-content')) continue;
    const cs = getComputedStyle(el); const ox = cs.overflowX, oy = cs.overflowY;
    const hx = (ox === 'hidden' || ox === 'clip') && el.scrollWidth > el.clientWidth + 3 && el.clientWidth > 20;
    const hy = (oy === 'hidden' || oy === 'clip') && el.scrollHeight > el.clientHeight + 6 && el.clientHeight > 14;
    if (!(hx || hy) || cs.textOverflow === 'ellipsis' || cs.display === 'none' || !vis(el)) continue;
    // csak szöveget tartalmazó doboz számít (kép/dekor nem)
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 3) || (el.children.length <= 3 && /^(P|H[1-6]|SPAN|A|BUTTON|LI|LABEL|DIV)$/.test(el.tagName) && el.innerText && el.innerText.trim().length > 3 && ![...el.children].some(c => c.children.length > 2));
    if (!own) continue;
    clipped.push({ el: desc(el), dir: hx ? 'vízszintes' : 'függőleges', sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight, text: el.innerText.trim().slice(0, 40) });
  }
  R.clipped = clipped;
  const fixed = [];
  for (const el of document.body.querySelectorAll('*')) { const cs = getComputedStyle(el); if ((cs.position === 'fixed' || cs.position === 'sticky') && vis(el)) { const r = el.getBoundingClientRect(); if (r.width > 20 && r.height > 12 && r.bottom > 0 && r.top < vh) fixed.push({ el, r }); } }
  R.overlap = [];
  for (let i = 0; i < fixed.length; i++) for (let j = i + 1; j < fixed.length; j++) {
    const a = fixed[i], b = fixed[j]; if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (w > 0 && h > 0 && (w * h) / Math.min(a.r.width * a.r.height, b.r.width * b.r.height) > 0.3) R.overlap.push(`${desc(a.el)} ⨯ ${desc(b.el)}`);
  }
  R.overlap = R.overlap.slice(0, 4);
  const small = [], tiny = []; const seen = new Set();
  for (const el of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],summary')) {
    if (!vis(el)) continue; const r = el.getBoundingClientRect(); if (r.right <= 0 || r.left >= vw + 1 || r.bottom <= 0) continue;
    if (el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p,li,span,td')) continue; // szövegközi link: WCAG-kivétel
    if (/^(checkbox|radio)$/.test(el.type) && el.closest('label')) continue;
    const k = Math.round(r.left) + ',' + Math.round(r.top) + ',' + Math.round(r.width); if (seen.has(k)) continue; seen.add(k);
    const m = Math.min(r.width, r.height);
    if (m < 24) tiny.push({ el: desc(el), w: Math.round(r.width), h: Math.round(r.height) }); else if (m < 44) small.push({ el: desc(el), w: Math.round(r.width), h: Math.round(r.height) });
  }
  R.tiny = tiny.slice(0, 8); R.nTiny = tiny.length; R.small = small.slice(0, 8); R.nSmall = small.length;
  return R;
}
function contrastProbe() {
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const parse = s => { const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const bgOf = el => { let acc = null; for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); if (c && c[3] > 0) { if (c[3] >= 0.99) return acc ? mix(acc, c) : c; acc = acc ? mix(acc, c) : c; } } return acc ? mix(acc, [255, 255, 255, 1]) : [255, 255, 255, 1]; };
  const mix = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const out = {};
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n = 0;
  while (w.nextNode() && n < 500) {
    const t = w.currentNode; const s = t.textContent.trim(); if (s.length < 2) continue; const el = t.parentElement; if (!el || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
    let ok = true; try { ok = el.checkVisibility({ opacityProperty: true, visibilityProperty: true }); } catch {} if (!ok) continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el); const fg = parse(cs.color); const bg = bgOf(el); if (!fg || !bg) continue; n++;
    const fgm = fg[3] < 1 ? mix(fg, bg) : fg; const L1 = lum(fgm), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const key = el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 1).join('.') + '|' + s.slice(0, 30);
    if (!(key in out) || ratio < out[key].ratio) out[key] = { ratio: +ratio.toFixed(2), size: parseFloat(cs.fontSize) };
  }
  return out;
}
async function scrollThrough(page) {
  try {
    const vh = await page.evaluate(() => innerHeight);
    for (let y = 0, i = 0; i < 60; i++) { const H = await page.evaluate(() => document.documentElement.scrollHeight); if (y >= H) break; await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(110); y += Math.round(vh * 0.8); }
    await page.waitForTimeout(500); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(350);
  } catch {}
}

// ------------------------------------------------------------ kontaktlap (Playwright canvas, külső függőség nélkül)
export async function contactSheet(browser, shots, outFile) {
  const ok = shots.filter(s => s.file && existsSync(s.file)); if (!ok.length) return null;
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } }); const page = await ctx.newPage();
  try {
    const items = ok.map(s => ({ label: s.label, src: 'data:image/png;base64,' + readFileSync(s.file).toString('base64') }));
    const dataUrl = await page.evaluate(async items => {
      const imgs = await Promise.all(items.map(it => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = it.src; })));
      const H = 340, pad = 16, label = 28; const cols = 3;
      const scaled = imgs.map(i => i ? { w: Math.round(i.width * H / i.height), h: H, i } : null);
      const rows = []; for (let k = 0; k < items.length; k += cols) rows.push([...Array(Math.min(cols, items.length - k)).keys()].map(j => k + j));
      const rowW = rows.map(r => r.reduce((s, k) => s + (scaled[k] ? scaled[k].w : 0) + pad, pad)); const W = Math.max(...rowW);
      const c = document.createElement('canvas'); c.width = W; c.height = rows.length * (H + label + pad) + pad; const g = c.getContext('2d');
      g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, c.width, c.height); g.font = '600 16px sans-serif';
      rows.forEach((r, ri) => { let x = pad; const y = pad + ri * (H + label + pad); for (const k of r) { const s = scaled[k]; if (!s) continue; g.fillStyle = '#222'; g.fillText(items[k].label, x, y + 18); g.drawImage(s.i, x, y + label, s.w, s.h); g.strokeStyle = '#bbb'; g.strokeRect(x, y + label, s.w, s.h); x += s.w + pad; } });
      return c.toDataURL('image/png');
    }, items);
    writeFileSync(outFile, Buffer.from(dataUrl.split(',')[1], 'base64')); return outFile;
  } catch { return null; } finally { await ctx.close(); }
}

// ------------------------------------------------------------ nézetméret-mátrix
export async function qaMatrix(browser, url, dir, slug) {
  const R = { vps: {}, nav: null, contact: null, ms: 0 }; const t0 = Date.now(); mkdirSync(dir, { recursive: true }); const shots = [];
  for (const mobile of [true, false]) {
    let g; try {
      const list = MATRIX.filter(m => m[2] === mobile); const [w0, h0] = list[0];
      g = await openGuarded(browser, url, { w: w0, h: h0, mobile });
      for (const [w, h] of list) {
        const key = `${w}x${h}`;
        try {
          await g.page.setViewportSize({ width: w, height: h }); await g.page.waitForTimeout(700);
          await scrollThrough(g.page);
          const P = await g.page.evaluate(matrixProbe);
          const f = join(dir, `qa-${key}.png`); await g.page.screenshot({ path: f }); shots.push({ label: `${w}×${h}`, file: f });
          R.vps[key] = { ...P, shot: f };
        } catch (e) { R.vps[key] = { error: String(e.message).slice(0, 100) }; }
        // mobil menü: nyit-e, Esc zár-e (a 390-es nézeten)
        if (w === 390) {
          try {
            await g.page.evaluate(() => scrollTo(0, 0));
            const btn = g.page.locator('.w-nav-button:visible, .menu-hamb:visible, .w-dropdown-toggle[aria-expanded]:visible, [class*="hamb"]:visible, button[aria-label*="menü" i]:visible, [class*="menu-button"]:visible').first();
            const countLinks = () => g.page.evaluate(() => [...document.querySelectorAll('nav a[href],.w-nav a[href],[class*="menu-"] a[href],.w-dropdown-list a[href]')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 8 && r.top >= 0 && r.top < innerHeight && getComputedStyle(a).visibility !== 'hidden'; }).length);
            if (await btn.count()) {
              const before = await countLinks();
              await btn.click({ timeout: 3000 }); await g.page.waitForTimeout(600);
              const expanded = await btn.evaluate(e => e.getAttribute('aria-expanded') === 'true' || e.classList.contains('w--open')).catch(() => false);
              const open = (await countLinks()) >= before + 3 || expanded;
              await g.page.keyboard.press('Escape'); await g.page.waitForTimeout(600);
              const still = (await btn.evaluate(e => e.getAttribute('aria-expanded') === 'true' || e.classList.contains('w--open')).catch(() => false)) || (await countLinks()) >= before + 3;
              R.nav = { tested: true, opens: open, closesOnEsc: open ? !still : null };
              if (still) await btn.click({ timeout: 2000 }).catch(() => {});
            } else R.nav = { tested: false, note: 'nincs látható menügomb 390 px-en' };
          } catch (e) { R.nav = { tested: false, note: String(e.message).slice(0, 80) }; }
        }
      }
      R.blocked = (R.blocked || 0) + Object.values(g.st.blocked).reduce((s, n) => s + n, 0); R.leaked = (R.leaked || 0) + g.st.leaked;
    } catch (e) { R.error = String(e.message).slice(0, 120); } finally { try { if (g) await g.ctx.close(); } catch {} }
  }
  if (shots.length) { R.contact = await contactSheet(browser, shots, join(dir, '..', '..', `kontakt-${slug}.png`)); }
  R.ms = Date.now() - t0; return R;
}

// ------------------------------------------------------------ böngészők (webkit / firefox, ha telepítve vannak)
let _engineCache = null;
export async function engines(pw) {
  if (_engineCache) return _engineCache;
  const out = {};
  for (const name of ['webkit', 'firefox']) {
    try { const b = await pw[name].launch(); out[name] = { available: true, browser: b, version: b.version() }; }
    catch (e) { out[name] = { available: false, note: `nincs telepítve (${String(e.message).split('\n')[0].replace(/Executable doesn't exist at .*/, 'a böngészőfájl hiányzik')}); telepítés: npx playwright install ${name}` }; }
  }
  return (_engineCache = out);
}
export async function qaBrowsers(engs, url, dir) {
  const R = {};
  for (const [name, e] of Object.entries(engs)) {
    if (!e.available) { R[name] = { available: false, note: e.note }; continue; }
    R[name] = { available: true, version: e.version, vps: {} };
    for (const [w, h, mobile] of [[390, 844, true], [1440, 900, false]]) {
      const key = `${w}x${h}`; let g;
      try {
        const errs = [];
        g = await openGuarded(e.browser, url, { w, h, mobile, setup: p => p.on('pageerror', x => errs.push(String(x.message).slice(0, 100))) });
        await scrollThrough(g.page);
        const P = await g.page.evaluate(matrixProbe);
        const f = join(dir, `qa-${name}-${key}.png`); await g.page.screenshot({ path: f });
        R[name].vps[key] = { overflow: P.overflow, errors: errs.slice(0, 5), shot: f, h1: await g.page.evaluate(() => { const h = document.querySelector('h1'); return h ? h.innerText.trim().slice(0, 60) : null; }) };
      } catch (err) { R[name].vps[key] = { error: String(err.message).slice(0, 100) }; } finally { try { if (g) await g.ctx.close(); } catch {} }
    }
  }
  return R;
}

// ------------------------------------------------------------ módok
const HERO_INIT = () => {
  window.__q = { lcp: 0, hero: null };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__q.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  const t = setInterval(() => { try { if (window.__q.hero != null) return clearInterval(t); const h = document.querySelector('h1'); if (!h) return; const r = h.getBoundingClientRect(); if (r.width > 1 && r.height > 1 && r.top < innerHeight && h.checkVisibility({ opacityProperty: true, visibilityProperty: true })) window.__q.hero = Math.round(performance.now()); } catch {} }, 60);
};
export async function qaModes(browser, url, lock = { run: (ex, fn) => fn() }) {
  const M = {}; const t0 = Date.now(); let baseline = 0; const acc = { blocked: 0, leaked: 0 }; const guards = [];
  const openGuarded = async (...a) => { const g = await _openGuarded(...a); guards.push(g); return g; };
  const manualBlock = r => { const u = r.request().url(); if (/sender\.net|google-analytics|clarity\.ms\/collect|doubleclick|\/g\/collect|googletagmanager\.com\/(?!gtag\/js|gtm\.js)|webflow\.com\/api/i.test(u) || !/^(GET|HEAD|OPTIONS)$/i.test(r.request().method())) { acc.blocked++; return r.abort().catch(() => {}); } return r.continue().catch(() => {}); };
  const run = (name, fn) => lock.run(name === 'slow4g', async () => { try { M[name] = await fn(); } catch (e) { M[name] = { error: String(e.message).split('\n')[0].slice(0, 120) }; } });
  await run('normal', async () => { const g = await openGuarded(browser, url); try { await scrollThrough(g.page); baseline = await g.page.evaluate(visLen); return { visLen: baseline }; } finally { await g.ctx.close(); } });
  // sötét séma: csak a sötétben ÚJ kontraszt-gond számít
  await run('dark', async () => {
    const g = await openGuarded(browser, url, { colorScheme: 'light' }); let light, dark;
    try { await scrollThrough(g.page); light = await g.page.evaluate(contrastProbe); await g.page.emulateMedia({ colorScheme: 'dark' }); await g.page.waitForTimeout(700); await scrollThrough(g.page); dark = await g.page.evaluate(contrastProbe); } finally { await g.ctx.close(); }
    const invisible = [], low = [];
    for (const [k, v] of Object.entries(dark)) { const l = light[k]; if (!l) continue; const t = k.split('|')[1]; if (v.ratio < 1.5 && l.ratio >= 3) invisible.push(`${k.split('|')[0]} „${t}” ${v.ratio}:1`); else if (v.ratio < (v.size >= 24 ? 3 : 4.5) && l.ratio >= (l.size >= 24 ? 3 : 4.5)) low.push(`${k.split('|')[0]} „${t}” ${v.ratio}:1`); }
    return { invisible: invisible.slice(0, 6), nInvisible: invisible.length, low: low.slice(0, 6), nLow: low.length, compared: Object.keys(dark).length };
  });
  await run('reduced', async () => {
    const g = await openGuarded(browser, url, { reducedMotion: 'reduce' });
    try { await scrollThrough(g.page); const v = await g.page.evaluate(visLen); return { visLen: v, ratio: baseline ? +(v / baseline).toFixed(2) : null }; } finally { await g.ctx.close(); }
  });
  await run('zoom200', async () => {
    // 200 % nagyítás = fele akkora CSS-viewport kétszeres képpont-sűrűséggel (1440 → 720)
    const ctx = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2, locale: 'hu-HU', serviceWorkers: 'block' });
    await ctx.route('**/*', manualBlock);
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForLoadState('load', { timeout: 25000 }).catch(() => {}); await page.waitForTimeout(1500); await scrollThrough(page);
      const o = await page.evaluate(() => Math.max(0, document.scrollingElement.scrollWidth - document.documentElement.clientWidth));
      const navLinks = await page.evaluate(() => [...document.querySelectorAll('nav a[href],.w-nav a[href]')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 4 && getComputedStyle(a).visibility !== 'hidden'; }).length);
      let navUsable = navLinks > 0, via = 'látható menülinkek';
      if (!navUsable) {
        const btn = page.locator('.w-nav-button:visible, .menu-hamb:visible, .w-dropdown-toggle[aria-expanded]:visible, [class*="hamb"]:visible, [class*="menu-button"]:visible').first();
        if (await btn.count()) { await btn.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500); navUsable = await page.evaluate(() => [...document.querySelectorAll('nav a[href],.w-nav a[href]')].some(a => { const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 4; })); via = 'menügomb után'; } else via = 'se menülink, se menügomb';
      }
      // szándékosan egyszerűsített fejléc (landing, pl. /letoltes): asztalon sincs menü, csak főoldal-link → nagyításnál nem vész el semmi
      let landingHeader = false;
      if (!navUsable) {
        const homeTop = await page.evaluate(() => [...document.querySelectorAll('a[href]')].some(a => { const r = a.getBoundingClientRect(); let u; try { u = new URL(a.href); } catch { return false; } return u.host === location.host && u.pathname === '/' && r.top < 140 && r.width > 4 && (a.innerText || '').trim().length > 2; }));
        if (homeTop) {
          const wide = await ctx.newPage(); await wide.setViewportSize({ width: 1440, height: 900 });
          await wide.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}); await wide.waitForTimeout(1200);
          const deskMenu = await wide.evaluate(() => [...document.querySelectorAll('nav a[href],.w-nav a[href],.w-dropdown-toggle,.menu-hamb,.w-nav-button')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 4 && getComputedStyle(a).visibility !== 'hidden'; }).length).catch(() => 1);
          await wide.close().catch(() => {});
          if (!deskMenu) { landingHeader = true; via = 'egyszerűsített fejléc: asztalon sincs menü, a főoldal-link nagyítva is látható'; }
        }
      }
      return { overflow: o, navUsable, via, landingHeader };
    } finally { await ctx.close(); }
  });
  await run('nojs', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, locale: 'hu-HU', serviceWorkers: 'block' });
    await ctx.route('**/*', manualBlock);
    const page = await ctx.newPage();
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForLoadState('load', { timeout: 25000 }).catch(() => {}); await page.waitForTimeout(1200); const v = await page.evaluate(visLen); const h1 = await page.evaluate(() => { const h = document.querySelector('h1'); return !!h && h.checkVisibility({ opacityProperty: true, visibilityProperty: true }); }); return { visLen: v, ratio: baseline ? +(v / baseline).toFixed(2) : null, h1Visible: h1 }; } finally { await ctx.close(); }
  });
  await run('slow4g', async () => {
    const g = await openGuarded(browser, 'about:blank', { w: 390, h: 844, mobile: true }).catch(() => null); // a védett környezetet használjuk, a betöltést mi indítjuk
    if (!g) throw new Error('nem indítható');
    try {
      await g.ctx.addInitScript(HERO_INIT);
      const page = await g.ctx.newPage(); const cdp = await g.ctx.newCDPSession(page);
      await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: Math.round(1.6 * 1024 * 1024 / 8), uploadThroughput: Math.round(750 * 1024 / 8) });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      g.st.allowNav = true; const t = Date.now();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {}); const loadMs = Date.now() - t; g.st.allowNav = false; await page.waitForTimeout(2500);
      const q = await page.evaluate(() => window.__q);
      return { heroMs: q.hero, lcpMs: Math.round(q.lcp), loadMs, profile: 'Slow 4G (1,6 Mbit/s, 150 ms RTT) + 4× CPU, 390×844; az analitika blokkolva, ezért a szám kissé optimista' };
    } finally { await g.ctx.close(); }
  });
  for (const g of guards) { acc.blocked += Object.values(g.st.blocked).reduce((s, n) => s + n, 0); acc.leaked += g.st.leaked; }
  M.blocked = acc.blocked; M.leaked = acc.leaked;
  M.ms = Date.now() - t0;
  return M;
}

// ------------------------------------------------------------ axe-core
let _axeSrc;
function axeSource() {
  if (_axeSrc !== undefined) return _axeSrc;
  try { const f = require.resolve('axe-core/axe.min.js', { paths: [process.cwd(), join(os.homedir(), 'CLAUDE/beeco-ds-fooldal/node_modules'), join(os.homedir(), 'CLAUDE/beeco-jatek-kit/node_modules'), ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [])] }); _axeSrc = { src: readFileSync(f, 'utf8'), from: 'node_modules' }; }
  catch { _axeSrc = null; }
  return _axeSrc;
}
async function runAxe(page) {
  const a = axeSource(); let from = a ? a.from : null;
  try {
    if (a) await page.evaluate(a.src); else { await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js' }); from = 'cdnjs 4.9.1'; }
  } catch (e) { return { ok: false, error: 'az axe-core nem tölthető be: ' + String(e.message).slice(0, 80) }; }
  try {
    const res = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] }); return { version: axe.version, v: r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, url: v.helpUrl, n: v.nodes.length, ex: v.nodes.slice(0, 3).map(n => ({ t: (n.target || []).join(' ').slice(0, 90), h: (n.html || '').slice(0, 100) })) })) }; });
    return { ok: true, version: res.version, from, violations: res.v };
  } catch (e) { return { ok: false, error: 'az axe futása hibázott: ' + String(e.message).slice(0, 100) }; }
}

// ------------------------------------------------------------ billentyűzet-folyam + axe a védett (mérő) környezetben
export async function qaKeyboardAxe(g, url) {
  const Q = { keyboard: null, axe: null }; const page = await g.newPage();
  try {
    await scrollThrough(page);
    await page.evaluate(() => { scrollTo(0, 0); if (document.activeElement) document.activeElement.blur(); window.__kf = { prev: null, ps: '', rows: [] }; window.__sty = el => { const c = getComputedStyle(el); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.borderColor, c.backgroundColor, c.color, c.textDecorationLine].join('|'); }; });
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      await page.evaluate(() => {
        const K = window.__kf; const a = document.activeElement;
        if (K.prev && K.prev !== a && K.rows.length) K.rows[K.rows.length - 1].changed = window.__sty(K.prev) !== K.ps;
        if (!a || a === document.body || a === document.documentElement) { K.rows.push({ none: true }); K.prev = null; return; }
        const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); const ow = parseFloat(cs.outlineWidth) || 0;
        K.rows.push({ el: a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.split(/\s+/)[0] : ''), text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30), href: (a.getAttribute('href') || '').slice(0, 40), ring: (cs.outlineStyle !== 'none' && ow > 0) || (!!cs.boxShadow && cs.boxShadow !== 'none'), changed: false, inView: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, id: (a.tagName + (a.id || '') + Math.round(r.left) + ',' + Math.round(r.top)), foot: !!a.closest('footer,[class*="lablec"]') });
        K.prev = a; K.ps = window.__sty(a);
      });
    }
    const rows = await page.evaluate(() => window.__kf.rows);
    const real = rows.filter(r => !r.none); const distinct = new Set(real.map(r => r.id)).size;
    let maxRun = 1, run = 1; for (let i = 1; i < real.length; i++) { run = real[i].id === real[i - 1].id ? run + 1 : 1; maxRun = Math.max(maxRun, run); }
    const noFocus = real.filter(r => !(r.ring || r.changed));
    Q.keyboard = { steps: rows.length, distinct, lost: rows.filter(r => r.none).length, visibleFocus: real.length - noFocus.length, withoutIndicator: noFocus.length, noIndicatorEx: noFocus.slice(0, 4).map(r => `${r.el} „${r.text}”`), offscreen: real.filter(r => !r.inView).length, trap: rows.length >= 12 && (distinct <= 3 || maxRun >= 6), first: real[0] ? `${real[0].el} „${real[0].text}” ${real[0].href}` : null, firstIsSkip: !!(real[0] && /ugr|skip|tartalom/i.test(real[0].text + real[0].href) && real[0].href.startsWith('#')), reachedFooter: real.some(r => r.foot) };
    // Enter a hero-CTA-n (navigáció letiltva)
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
    Q.enter = await page.evaluate(async () => {
      const GEN = /gomb|button|btn|cta|w-button/i;
      const el = [...document.querySelectorAll('a[href],button')].find(e => { const r = e.getBoundingClientRect(); return GEN.test(e.className || '') && r.width > 8 && r.height > 8 && r.top < innerHeight && r.bottom > 0 && !e.closest('nav,.w-nav,footer,[class*="cky"],[class*="cookie"]') && !(e.closest('form') && e.tagName === 'BUTTON'); });
      if (!el) return { found: false };
      const href = el.getAttribute('href') || ''; const before = { y: scrollY, hash: location.hash, clicks: window.__mx ? window.__mx.clicks : 0 };
      el.focus(); return { found: true, text: (el.innerText || '').trim().slice(0, 30), href: href.slice(0, 50), hash: href.startsWith('#'), before, focused: document.activeElement === el };
    });
    if (Q.enter.found) {
      await page.keyboard.press('Enter'); await page.waitForTimeout(900);
      const after = await page.evaluate(() => ({ y: scrollY, hash: location.hash, clicks: window.__mx ? window.__mx.clicks : 0, active: document.activeElement ? document.activeElement.tagName.toLowerCase() : '' }));
      Q.enter.activated = after.clicks > Q.enter.before.clicks; Q.enter.scrolled = Math.abs(after.y - Q.enter.before.y) > 20 || after.hash !== Q.enter.before.hash; Q.enter.after = after;
    }
    // felugró rétegek Esc-teszt (ha van látható)
    Q.dialog = await page.evaluate(async () => { const d = [...document.querySelectorAll('[role=dialog],dialog[open],[aria-modal=true],[class*="modal"],[class*="popup"],[class*="lightbox"]')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 120 && r.height > 80 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.1 && (cs.position === 'fixed' || e.getAttribute('role') === 'dialog') && !/cky|cookie/i.test(e.className); }); return { found: d.length, desc: d.slice(0, 2).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(/\s+/)[0]) }; });
    if (Q.dialog.found) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); Q.dialog.closedByEsc = await page.evaluate(() => [...document.querySelectorAll('[role=dialog],dialog[open],[aria-modal=true],[class*="modal"],[class*="popup"]')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 120 && r.height > 80 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.1 && cs.position === 'fixed' && !/cky|cookie/i.test(e.className); }).length === 0); }
    // axe
    await page.evaluate(() => scrollTo(0, 0));
    Q.axe = await runAxe(page);
  } catch (e) { Q.error = String(e.message).slice(0, 140); } finally { try { await page.close(); } catch {} }
  return Q;
}

// ------------------------------------------------------------ 404-oldal (site-szint)
export async function qa404(browser, origin, curlStatus) {
  const R = { checked: true, url: '' }; const slug = 'nem-letezo-oldal-' + Math.random().toString(36).slice(2, 8); R.url = `${origin.replace(/\/$/, '')}/${slug}`;
  try {
    const st = await curlStatus(R.url); R.status = st.code; R.redirected = st.redirects > 0;
    const g = await openGuarded(browser, R.url, { w: 1440, h: 900 }).catch(e => { R.error = String(e.message).slice(0, 80); return null; });
    if (g) { try {
      R.page = await g.page.evaluate(() => { const links = [...document.querySelectorAll('a[href]')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 2 && r.height > 2; }); const home = links.some(a => { try { const u = new URL(a.href); return u.hostname === location.hostname && (u.pathname === '/' || u.pathname === ''); } catch { return false; } }); const ht = links.find(a => /főoldal/i.test(a.innerText || '')); const homeText = ht ? { text: (ht.innerText || '').trim().slice(0, 40), path: (() => { try { return new URL(ht.href).pathname; } catch { return ''; } })() } : null; return { home, homeText, contact: links.some(a => /kapcsolat|^mailto:|^tel:/i.test(a.getAttribute('href') || '')), search: !!document.querySelector('input[type=search],form[role=search],[class*="search"]'), nav: !!document.querySelector('nav,.w-nav'), h1: (document.querySelector('h1') || {}).innerText ? document.querySelector('h1').innerText.trim().slice(0, 80) : '', text: (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160) }; });
    } finally { await g.ctx.close(); } }
  } catch (e) { R.error = String(e.message).slice(0, 100); }
  return R;
}

// ------------------------------------------------------------ pontozás
const clipT = (s, n = 90) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const AXE_SKIP_IF = { 'color-contrast': 'visual.contrast', 'button-name': 'visual.noname', 'link-name': 'visual.noname', 'input-button-name': 'visual.noname', 'image-alt': 'visual.img-no-alt', 'meta-viewport': 'visual.viewport-meta', 'target-size': 'visual.small-targets', 'html-has-lang': 'seo.lang-missing', 'document-title': 'seo.title-missing' };
export function qaFindings(Q, add, have, { baselineSeen = true } = {}) {
  if (!Q) return;
  // ---- axe
  const ax = Q.axe;
  if (ax && !ax.ok) add('visual', 'P3', 'visual.axe-error', `Az axe-core ellenőrzés nem futott le: ${ax.error}`, '', 'Futtasd újra; telepítve legyen az axe-core a node_modules-ban.', 0);
  if (ax && ax.ok) for (const v of ax.violations) {
    if (/^(bypass|skip-link)$/.test(v.id)) continue; // a UX-dimenzió skip-link lelete lefedi
    const dup = AXE_SKIP_IF[v.id]; if (dup && have(dup)) continue;
    const sev = v.impact === 'critical' || v.impact === 'serious' ? 'P1' : v.impact === 'moderate' ? 'P2' : 'P3';
    const pt = sev === 'P1' ? 5 : sev === 'P2' ? 2 : 0.5; const grp = 'axe' + sev; const cap = sev === 'P1' ? 20 : sev === 'P2' ? 8 : 3;
    add('visual', sev, `visual.axe|${v.id}`, `axe (${v.impact}): ${v.help} (${v.n} elem)`, v.ex.map(e => `${e.t}: ${clipT(e.h, 70)}`), `Javítsd a „${v.id}” szabály szerint: ${v.url}`, pt, grp, cap);
  }
  // ---- billentyűzet
  const K = Q.keyboard;
  if (K) {
    if (K.trap) add('visual', 'P1', 'visual.keyboard-trap', 'Billentyűzet-csapda: a Tab nem halad előre (a fókusz ugyanazon az elemen / pár elem között marad)', `${K.steps} lépésből ${K.distinct} különböző elem`, 'Ellenőrizd a felugró rétegek és a menü fókuszkezelését; Esc zárjon, Tab haladjon.', 10);
    if (K.steps >= 10 && K.withoutIndicator / Math.max(1, K.steps - K.lost) > 0.25 && !have('visual.focus-ring')) add('visual', 'P2', 'visual.focus-indicator', `A fókusz nem látszik minden Tab-lépésnél (${K.withoutIndicator}/${K.steps - K.lost} elemnél nincs kerethatás)`, K.noIndicatorEx, 'Adj minden fókuszálható elemnek látható :focus-visible keretet (outline vagy box-shadow, ≥ 3:1 kontraszt).', 6);
    if (K.lost >= 5) add('visual', 'P3', 'visual.focus-lost', `A fókusz ${K.lost}× a dokumentumra esett vissza Tab közben`, '', 'Nézd meg a rejtett elemeket és a tabindex-eket.', 2);
  }
  const E = Q.enter;
  if (E && E.found && !E.activated && !E.scrolled) add('ux', 'P2', 'ux.keyboard-enter', `Enter a hero-CTA-n („${E.text}”) nem aktiválja a gombot`, `href: ${E.href}`, 'A CTA legyen valódi <a>/<button>; ne div kattintás-figyelővel.', 5);
  else if (E && E.found && E.hash && E.activated && !E.scrolled) add('ux', 'P3', 'ux.keyboard-anchor', `A horgony-CTA („${E.text}”) Enterre nem görget / nem mozgatja a fókuszt`, `href: ${E.href}`, 'Ellenőrizd a horgony célját és a fókusz-áthelyezést.', 2);
  if (Q.dialog && Q.dialog.found && Q.dialog.closedByEsc === false) add('ux', 'P2', 'ux.modal-esc', `A felugró réteg Esc-re nem záródik: ${Q.dialog.desc.join(', ')}`, '', 'Esc zárja a felugró réteget, és a fókusz térjen vissza a nyitó elemre.', 5);
}

export function qaMatrixFindings(R, add, have) {
  if (!R || R.error && !Object.keys(R.vps).length) { if (R) add('visual', 'P3', 'visual.matrix-error', `A nézetméret-mátrix nem futott le: ${R.error}`, '', 'Futtasd újra.', 0); return; }
  const ovf = Object.entries(R.vps).filter(([, v]) => v.overflow > 0);
  if (ovf.length && !have('visual.overflow')) add('visual', 'P1', 'visual.overflow', `Vízszintes kilógás ezeken a nézeteken: ${ovf.map(([k, v]) => `${k} (${v.overflow} px)`).join(', ')}`, 'Az oldal oldalra görgethető', 'Keresd meg a kilógó elemet (fix szélesség, negatív margó, túl széles kép/embed), és adj neki max-width:100% / flex-wrap-ot.', 15);
  const cl = Object.entries(R.vps).filter(([, v]) => v.clipped && v.clipped.length);
  if (cl.length) { const ex = cl.flatMap(([k, v]) => v.clipped.slice(0, 2).map(c => `${k} ${c.el} „${c.text}” (${c.dir}: ${c.dir === 'vízszintes' ? c.sw + '>' + c.cw : c.sh + '>' + c.ch})`)); add('visual', 'P2', 'visual.clipped-text', `Kivágott szöveg ${cl.length} nézeten: ${cl.map(([k, v]) => `${k} (${v.clipped.length})`).join(', ')}`, ex.slice(0, 4), 'A szöveges doboznak ne legyen fix magassága/overflow:hidden; hagyd a tartalommal nőni (min-height), vagy törd a sort.', Math.min(9, 3 * cl.length), 'clip', 9); }
  const ov = Object.entries(R.vps).filter(([, v]) => v.overlap && v.overlap.length);
  if (ov.length) add('visual', 'P2', 'visual.fixed-overlap', `Egymást takaró rögzített elemek: ${[...new Set(ov.flatMap(([, v]) => v.overlap))].slice(0, 3).join('; ')}`, ov.map(([k]) => k).join(', '), 'A ragadós menü, a süti-sáv és a lebegő CTA ne takarja egymást; állíts z-index-et és alsó/felső helyet.', 4);
  const tiny = Object.entries(R.vps).filter(([k, v]) => +k.split('x')[0] <= 390 && v.nTiny > 0);
  if (tiny.length) { const [k, v] = tiny[tiny.length - 1]; add('visual', 'P1', 'visual.tiny-targets', `${v.nTiny} érintési felület 24 px alatt (${k}): WCAG 2.2 AA célméret`, v.tiny.map(t => `${t.el} ${t.w}×${t.h}`), 'Min. 24×24 px (ajánlott 44×44) kattintható terület; padding vagy min-height.', Math.min(9, 3 * v.nTiny), 'tiny', 9); }
  const small = Object.entries(R.vps).filter(([k, v]) => +k.split('x')[0] <= 390 && v.nSmall > 0);
  if (small.length && !have('visual.small-targets')) { const [k, v] = small[small.length - 1]; add('visual', 'P2', 'visual.small-targets', `${v.nSmall} érintési felület 44 px alatt mobilon (${k})`, v.small.map(t => `${t.el} ${t.w}×${t.h}`), 'Növeld a gomb/link kattintható területét (padding, min-height: 44px), főleg a láblécben és a menüben.', Math.min(10, 2 + 0.3 * v.nSmall)); }
  if (R.nav && R.nav.tested && R.nav.opens === false) add('ux', 'P2', 'ux.mobile-nav-broken', 'Mobilon a menügomb nem nyit használható menüt (390 px)', '', 'Ellenőrizd a Webflow nav-menüt tablet/mobil töréspontokon.', 6);
  else if (R.nav && R.nav.opens && R.nav.closesOnEsc === false) add('ux', 'P3', 'ux.mobile-nav-esc', 'A mobil menü Esc-re nem záródik', '', 'Esc zárja a menüt (a menügomb állapotával együtt).', 2);
}
export function qaBrowserFindings(B, add) {
  if (!B) return;
  for (const [name, b] of Object.entries(B)) {
    if (!b.available) continue;
    for (const [k, v] of Object.entries(b.vps || {})) {
      if (v.error) { add('visual', 'P2', `visual.browser-fail|${name}|${k}`, `${name}: az oldal nem tölt be vagy nem mérhető (${k}): ${v.error}`, '', `Nézd meg kézzel ${name}-ben.`, 4, 'brerr', 12); continue; }
      if (v.overflow > 0) add('visual', 'P1', `visual.browser-overflow|${name}|${k}`, `${name}: vízszintes kilógás ${v.overflow} px (${k})`, '', 'Böngészőspecifikus elrendezés-hiba: nézd meg a flex/grid és a 100vw használatot.', 10, 'brovf', 20);
      if (v.errors && v.errors.length) add('visual', 'P2', `visual.browser-console|${name}|${k}`, `${name}: ${v.errors.length} JS-hiba (${k})`, v.errors, 'Nézd meg a böngésző konzolját.', 3, 'brerr', 12);
      if (!v.h1) add('visual', 'P2', `visual.browser-no-h1|${name}|${k}`, `${name}: nincs H1 a renderelt oldalon (${k})`, '', 'Böngészőspecifikus renderelési hiba lehet.', 4, 'brerr', 12);
    }
  }
}
export function qaModeFindings(M, add, have) {
  if (!M) return;
  const d = M.dark; if (d && !d.error) {
    if (d.nInvisible) add('visual', 'P1', 'visual.dark-invisible', `Sötét sémában ${d.nInvisible} szöveg gyakorlatilag láthatatlan (kontraszt < 1,5:1, világosban rendben volt)`, d.invisible, 'Ha az oldal nem támogat sötét módot, tiltsd (color-scheme: light); ha igen, adj sötét tokent a szövegnek.', Math.min(12, 4 + d.nInvisible));
    if (d.nLow) add('visual', 'P2', 'visual.dark-low-contrast', `Sötét sémában ${d.nLow} szöveg kontrasztja WCAG AA alatt (világosban rendben volt)`, d.low, 'Állíts a sötét módhoz külön szín-tokent, vagy tiltsd a sötét sémát (color-scheme: light).', Math.min(8, 2 + d.nLow));
  }
  const r = M.reduced; if (r && !r.error && r.ratio != null && r.ratio < 0.9) add('visual', 'P1', 'visual.reduced-motion-hidden', `Csökkentett mozgásnál a látható szöveg ${Math.round(r.ratio * 100)} %-ra csökken a normálhoz képest: rejtve maradó tartalom`, `${r.visLen} vs. normál`, 'A mozgás-kikapcsolás ne hagyjon rejtve (opacity: 0) tartalmat: @media (prefers-reduced-motion: reduce) { [data-w-id] { opacity: 1 !important; transform: none !important } }.', 12);
  const z = M.zoom200; if (z && !z.error) {
    if (z.overflow > 0) add('visual', 'P1', 'visual.zoom-overflow', `200 %-os nagyításnál vízszintes görgetés (${z.overflow} px): WCAG 1.4.4/1.4.10`, '720 px-es CSS-viewport, 2× képpont-sűrűség', 'Az elrendezés töredezzen egy oszlopra; nincs fix szélesség.', 10);
    if (!z.navUsable && z.landingHeader) add('ux', 'P3', 'ux.zoom-nav-landing', `Egyszerűsített fejléc menü nélkül (${z.via})`, '', 'Rendben, ha a landing szándékosan csak főoldal-linket és egy fő gombot kínál; a többi oldalra a láblécből is el lehessen jutni.', 1);
    else if (!z.navUsable) add('ux', 'P1', 'ux.zoom-nav', `200 %-os nagyításnál a navigáció nem használható (${z.via})`, '', 'A menü legyen elérhető hamburger-gombbal is, és nyíljon meg.', 10);
  }
  const n = M.nojs; if (n && !n.error && n.ratio != null) {
    if (n.ratio < 0.6) add('visual', 'P1', 'visual.nojs-content', `JavaScript nélkül a látható szöveg a normál ${Math.round(n.ratio * 100)} %-a (< 60 %)`, `H1 látszik: ${n.h1Visible ? 'igen' : 'NEM'}`, 'A tartalom ne függjön a JS-től (Webflow-interakciók kezdőállapota ne rejtse el; <noscript> tartalék).', 14);
    else if (n.ratio < 0.85) add('visual', 'P2', 'visual.nojs-content', `JavaScript nélkül a látható szöveg a normál ${Math.round(n.ratio * 100)} %-a`, '', 'Nézd meg, mi marad rejtve JS nélkül (animált belépők).', 6);
  }
  const s = M.slow4g; if (s && !s.error) {
    if (s.heroMs == null || s.heroMs > 8000) add('visual', 'P1', 'perf.slow4g-hero', `Lassú 4G-n a hero (H1) ${s.heroMs == null ? 'nem jelenik meg' : (s.heroMs / 1000).toFixed(1) + ' s után jelenik meg'} (cél ≤ 4 s)`, s.profile, 'Kevesebb blokkoló kód/betűtípus, kisebb hero-kép, preload a hero-képre; a H1 ne várjon JS-re.', 12);
    else if (s.heroMs > 4000) add('perf', 'P2', 'perf.slow4g-hero', `Lassú 4G-n a hero (H1) ${(s.heroMs / 1000).toFixed(1)} s után jelenik meg (cél ≤ 4 s)`, s.profile, 'Kisebb hero-kép/betűtípus, kevesebb blokkoló szkript.', 6);
    if (s.lcpMs > 8000) add('perf', 'P1', 'perf.slow4g-lcp', `Lassú 4G-n az LCP ${(s.lcpMs / 1000).toFixed(1)} s (cél ≤ 4 s)`, s.profile, 'A hero-kép legyen kisebb (WebP, ≤ 150 kB), fetchpriority=high.', 12);
    else if (s.lcpMs > 4000) add('perf', 'P2', 'perf.slow4g-lcp', `Lassú 4G-n az LCP ${(s.lcpMs / 1000).toFixed(1)} s (cél ≤ 4 s)`, s.profile, 'Kisebb hero-kép (WebP), kevesebb blokkoló kód.', 6);
  }
}
export function qa404Findings(R) {
  const F = []; if (!R || !R.checked) return F;
  if (R.error && R.status == null) { F.push({ sev: 'P3', title: `A 404-teszt nem futott le: ${R.error}` }); return F; }
  if (R.status !== 404) F.push({ sev: 'P2', title: `A nem létező oldal HTTP ${R.status}-t ad, nem 404-et (${R.url})`, fix: 'Állíts be 404-es állapotot a hibaoldalra (Webflow: Site settings → 404 page), különben a keresők „soft 404”-ként kezelik.' });
  if (R.page) {
    if (!R.page.home && R.page.homeText) F.push({ sev: 'P2', title: `A 404-es oldal „${R.page.homeText.text}” linkje nem a főoldalra (/) mutat, hanem ide: ${R.page.homeText.path}`, fix: 'Állítsd a gomb célját a főoldalra (/).' });
    else if (!R.page.home) F.push({ sev: 'P2', title: '404-es oldalon nincs link a főoldalra', fix: 'Tegyél „Vissza a főoldalra” gombot/linket.' });
    if (!R.page.contact && !R.page.search) F.push({ sev: 'P2', title: '404-es oldalon nincs sem kapcsolat-link, sem keresés', fix: 'Adj kapcsolat-linket vagy keresőt, hogy a tévedt látogató ne vesszen el.' });
    if (!R.page.nav) F.push({ sev: 'P3', title: '404-es oldalon nincs menü', fix: 'Használd a közös menüt és láblécet.' });
  }
  return F;
}

// ------------------------------------------------------------ jelentés
const ok = b => (b ? 'rendben' : 'HIBA');
export function qaMd(P, rel = '') {
  const Q = P.qa; if (!Q) return [];
  const L = ['**QA-mátrix (tesztelői kör)**', ''];
  if (Q.skipped) return [...L, `- Kihagyva: ${Q.skipped}`, ''];
  const m = Q.matrix;
  if (m && m.vps) {
    L.push('| Nézet | Kilógás | Kivágott szöveg | Takaró rögzített elem | Érintési cél < 24 / < 44 px |', '|---|---|---|---|---|');
    for (const [k, v] of Object.entries(m.vps)) L.push(v.error ? `| ${k} | nem mérve: ${v.error} | | | |` : `| ${k} | ${v.overflow > 0 ? `**${v.overflow} px**` : 'nincs'} | ${v.clipped.length ? `**${v.clipped.length}**` : 'nincs'} | ${v.overlap.length ? `**${v.overlap.length}**` : 'nincs'} | ${+k.split('x')[0] <= 768 ? `${v.nTiny} / ${v.nSmall}` : '–'} |`);
    L.push('');
    if (m.contact) L.push(`Kontaktlap (hajtás minden nézeten): ${m.contact}`, '', `![kontaktlap](${rel}${m.contact.split('/').slice(-1)[0]})`, '');
    if (m.nav) L.push(`- Mobil menü (390 px): ${m.nav.tested ? `nyit: ${m.nav.opens ? 'igen' : 'NEM'}, Esc zár: ${m.nav.closesOnEsc == null ? '–' : m.nav.closesOnEsc ? 'igen' : 'NEM'}` : 'nem mérve (' + (m.nav.note || '') + ')'}`);
  } else L.push('- Nézetméret-mátrix: nem mérve (`--fast` vagy hiba)');
  const B = Q.browsers; if (B) L.push(`- Böngészők: chromium rendben (alap)` + Object.entries(B).map(([n, b]) => ` · ${n}: ${b.available ? Object.entries(b.vps).map(([k, v]) => `${k} ${v.error ? 'hiba' : v.overflow > 0 || (v.errors || []).length ? 'ELTÉRÉS' : 'rendben'}`).join(', ') : 'NEM MÉRVE – ' + b.note}`).join(''));
  const M = Q.modes; if (M) {
    const f = (k, fn) => M[k] ? (M[k].error ? `nem mérve (${M[k].error})` : fn(M[k])) : 'nem mérve';
    L.push(`- Sötét séma: ${f('dark', d => d.nInvisible ? `**${d.nInvisible} láthatatlan szöveg**` : d.nLow ? `${d.nLow} gyenge kontraszt` : 'rendben')} · csökkentett mozgás: ${f('reduced', r => r.ratio == null ? 'rendben' : `${Math.round(r.ratio * 100)} % látszik`)} · 200 % nagyítás: ${f('zoom200', z => `${z.overflow > 0 ? 'KILÓG ' + z.overflow + ' px' : 'nincs kilógás'}, menü: ${z.navUsable ? 'használható' : 'NEM'}`)} · JS nélkül: ${f('nojs', n => n.ratio == null ? 'rendben' : `${Math.round(n.ratio * 100)} % látszik`)} · lassú 4G: ${f('slow4g', s => `hero ${s.heroMs == null ? 'NEM jelent meg' : (s.heroMs / 1000).toFixed(1) + ' s'}, LCP ${(s.lcpMs / 1000).toFixed(1)} s`)}`);
  } else L.push('- Módok (sötét, csökkentett mozgás, 200 %, JS nélkül, lassú 4G): nem mérve (`--fast`)');
  const ax = Q.axe; if (ax) L.push(`- axe-core${ax.version ? ' ' + ax.version : ''}: ${ax.ok ? ['critical', 'serious', 'moderate', 'minor'].map(i => `${i} ${ax.violations.filter(v => v.impact === i).length}`).join(' · ') : 'nem futott: ' + ax.error}`);
  const K = Q.keyboard; if (K) L.push(`- Billentyűzet (Tab ×${K.steps}): ${K.distinct} különböző elem · fókusz látszik ${K.visibleFocus}× / hiányzik ${K.withoutIndicator}× · csapda: ${K.trap ? '**IGEN**' : 'nincs'} · első fókusz: ${K.first || '–'}${K.firstIsSkip ? ' (ugrólink)' : ''} · Enter a hero-CTA-n: ${Q.enter?.found ? (Q.enter.activated ? 'működik' : '**nem aktivál**') : 'nincs hero-CTA'}`);
  L.push(`- Konzol/hálózat: ${Q.net ? `JS-hiba ${Q.net.errors}, hibás válasz (4xx/5xx) ${Q.net.failed}` : 'nem mérve'}`);
  L.push('');
  return L;
}
export const _ = { ok, matrixProbe, contrastProbe, visLen };
