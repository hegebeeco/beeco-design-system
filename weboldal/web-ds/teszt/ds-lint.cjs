#!/usr/bin/env node
/* Web DS lint: a published page measured against the Web DS v2 rules (docs/web-ds.md, 2. fejezet).
   Usage: node weboldal/web-ds/teszt/ds-lint.cjs <url> [<url> …] [--json out.json] [--strict]
   Reads only; never submits forms. Exit code 1 with --strict when any page has a violation.
   Rules (ids match the doc): R1 radius · R2 shadow · R3 button variants · R4 section divider · R5 FAQ template
   R6 app CTA · R7 images · R8 highlight · R9 text colours · R10 logo container · R11 pictogram splash */
const { chromium } = require(process.env.PLAYWRIGHT_UT || 'playwright');

const args = process.argv.slice(2);
const urls = args.filter(a => /^https?:/.test(a));
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const strict = args.includes('--strict');
if (!urls.length) { console.error('Usage: ds-lint.cjs <url> [...] [--json out.json] [--strict]'); process.exit(2); }

function measure() {
  const WHITE_SPLASH = ['konyv', 'kupa', 'raj', 'lab', 'naptar', 'terkep', 'kupon', 'telefon', 'madarpont', 'kanna', 'csepp', 'fa', 'howto'];
  const CHROME = 'nav,header,footer,.menu,.lablec,[class*="cky-"],[class*="cookie"],.w-nav';
  const CLICKABLE = 'a,button,input,select,textarea,summary,label,[role="button"]';
  const px = v => Math.round(parseFloat(v) || 0);
  const cls = el => (el.className && el.className.toString ? el.className.toString() : '').split(/\s+/).filter(c => c && !/^w-/.test(c)).slice(0, 2).join('.') || el.tagName.toLowerCase();
  const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const zone = el => (el.closest(CHROME) ? 'keret' : 'tartalom');
  const out = { R1: [], R2: [], R3: {}, R4: [], R5: [], R6: [], R7: [], R8: [], R9: {}, R10: [], R11: [], stats: {} };
  const push = (rule, el, why) => out[rule].push({ z: zone(el), c: cls(el), why });
  const all = [...document.body.querySelectorAll('*')].filter(el => visible(el) && !el.closest('.beeco-ugras') && el.getBoundingClientRect().right > 0);

  for (const el of all) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    // R1 radius: 0 or 4 px on all corners; circles (avatar, round icon button, step number) and the divider are exempt
    const rad = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map(k => px(cs[k]));
    if (rad.some(v => v > 0) && !el.closest('.ds-domb') && !el.classList.contains('ds-domb')) {
      const round = Math.min(...rad) >= Math.min(r.width, r.height) / 2 - 1 && Math.abs(r.width - r.height) <= 2;
      const hasBox = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || px(cs.borderTopWidth) > 0 || cs.overflow !== 'visible' || el.tagName === 'IMG';
      // store badges are ready-made button images: the corner baked into the image stays (documented exception)
      const storeBadge = el.tagName === 'IMG' && /App Store|Google Play/i.test(el.alt || '');
      if (!round && hasBox && !storeBadge) {
        if (new Set(rad).size > 1) push('R1', el, 'aszimmetrikus ' + rad.join('/'));
        else if (rad[0] !== 4) push('R1', el, rad[0] + ' px');
      }
    }
    // R2 shadow: hard (no blur), 2 or 4 px, only on clickable elements
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      const m = cs.boxShadow.match(/(-?\d+(?:\.\d+)?)px (-?\d+(?:\.\d+)?)px (-?\d+(?:\.\d+)?)px/);
      const clickable = el.matches(CLICKABLE) || el.matches('details') || !!el.closest('a,button,summary') || !!el.querySelector(':scope > a:only-child, :scope > summary');
      if (m && !el.closest('.ds-domb') && !el.classList.contains('ds-domb')) {
        const [x, y, blur] = [m[1], m[2], m[3]].map(Number);
        if (!clickable) push('R2', el, 'nem kattintható elemen árnyék');
        else if (blur > 0) push('R2', el, 'elmosott árnyék (' + blur + ' px)');
        else if (!(x === y && (x === 2 || x === 4))) push('R2', el, 'méret ' + x + '/' + y + ' px');
      }
    }
    // R3 button variants: one signature per visual variant
    if (el.matches('a,button,input[type="submit"]') && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && r.height >= 32 && r.height <= 90 && r.width < 520 && !el.querySelector('img[src*="store"], img[alt*="Google Play"], img[alt*="App Store"]') && (px(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none') && (el.innerText || el.value || '').trim().length > 0 && (el.innerText || el.value || '').trim().length < 40) {
      const sig = [cs.backgroundColor, px(cs.borderTopWidth) + 'px ' + cs.borderTopColor, 'r' + px(cs.borderTopLeftRadius) + '/' + px(cs.borderTopRightRadius), cs.fontFamily.split(',')[0].replace(/"/g, ''), px(cs.fontSize) + 'px', 'h' + Math.round(r.height)].join(' | ');
      (out.R3[sig] = out.R3[sig] || { z: zone(el), n: 0, c: cls(el), t: (el.innerText || el.value || '').trim().slice(0, 24) }).n++;
    }
    // R9 text colours in content (own text nodes only)
    if (zone(el) === 'tartalom' && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) out.R9[cs.color] = (out.R9[cs.color] || 0) + 1;
    // R10 logo container
    if (/(^|\s)ds-logo(\s|$)/.test(el.className.toString()) && (px(cs.borderTopWidth) > 0 || cs.backgroundColor !== 'rgba(0, 0, 0, 0)')) push('R10', el, 'a logó keretben vagy háttéren áll');
  }

  // R4 divider between sections of different background
  const sections = [...document.querySelectorAll('body > section, body > .ds-szekcio, main > section')].filter(visible);
  const bg = el => { let e = el; while (e && getComputedStyle(e).backgroundColor === 'rgba(0, 0, 0, 0)') e = e.parentElement; return e ? getComputedStyle(e).backgroundColor : ''; };
  sections.forEach((s, i) => { const n = sections[i + 1]; if (!n) return; const hasDomb = !!s.querySelector(':scope > .ds-domb');
    if (bg(s) !== bg(n) && !hasDomb) out.R4.push({ z: 'tartalom', c: (s.id || cls(s)) + ' → ' + (n.id || cls(n)), why: 'eltérő háttér, nincs domb' });
    if (bg(s) === bg(n) && hasDomb) out.R4.push({ z: 'tartalom', c: (s.id || cls(s)) + ' → ' + (n.id || cls(n)), why: 'azonos háttér, fölösleges domb' }); });
  out.stats.sections = sections.length; out.stats.backgrounds = [...new Set(sections.map(bg))].length;

  // R5 FAQ template
  const faqHead = [...document.querySelectorAll('h2,h3')].find(h => /gyik|gyakori kérdés|kérdések/i.test(h.textContent) && !h.closest(CHROME));
  if (faqHead && !document.querySelector('.ds-gyik-racs')) out.R5.push({ z: 'tartalom', c: cls(faqHead.closest('section') || faqHead), why: 'a GYIK nem a ds-gyik-racs sablon' });

  // R6 app CTA: store buttons in content need QR + app image in the same section
  const stores = [...document.querySelectorAll('a[href*="play.google.com"],a[href*="apps.apple.com"]')].filter(a => visible(a) && !a.closest(CHROME));
  [...new Set(stores.map(a => a.closest('section')).filter(Boolean))].forEach(sec => {
    const qr = [...sec.querySelectorAll('img')].some(i => /qr/i.test(i.className + ' ' + i.alt + ' ' + i.src));
    const pic = [...sec.querySelectorAll('img')].some(i => i.getBoundingClientRect().width >= 160 && !/qr|store|google|apple/i.test(i.className + ' ' + i.alt));
    if (!qr || !pic) out.R6.push({ z: 'tartalom', c: sec.id || cls(sec), why: (!qr ? 'nincs QR-kód ' : '') + (!pic ? 'nincs app-kép' : '') });
  });

  // R7 images: upscaled (pixelated), missing alt, distorted
  for (const img of [...document.images].filter(visible)) {
    const r = img.getBoundingClientRect(), name = (img.currentSrc || img.src).split('/').pop().slice(0, 40);
    if (/\.svg(\?|$)/.test(img.currentSrc || img.src) || !img.naturalWidth) continue;
    if (r.width > img.naturalWidth * 1.08) out.R7.push({ z: zone(img), c: name, why: 'felnagyított (pixeles): ' + img.naturalWidth + ' → ' + Math.round(r.width) + ' px' });
    if (!img.hasAttribute('alt')) out.R7.push({ z: zone(img), c: name, why: 'nincs alt attribútum' });
    const fit = getComputedStyle(img).objectFit;
    if ((fit === 'fill' || !fit) && Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) > 0.06) out.R7.push({ z: zone(img), c: name, why: 'torzított arány' });
  }

  // R8 highlight only in headings longer than 30 characters
  document.querySelectorAll('h1 .ds-kiemel, h2 .ds-kiemel, h3 .ds-kiemel').forEach(k => { const h = k.closest('h1,h2,h3'); const t = h.textContent.trim(); if (t.length <= 30) out.R8.push({ z: zone(h), c: t, why: 'kiemelés ' + t.length + ' karakteres címben' }); });

  // R11 pictogram splash: yellow outside the EWWR page
  if (!/ewwr/i.test(location.pathname)) document.querySelectorAll('img[src*="fs-piko-"]').forEach(i => { const n = (i.src.match(/fs-piko-([a-z]+)(-[a-z]+)?\.svg/) || []); if (visible(i) && !i.closest(CHROME) && (n[2] === '-feher' || (WHITE_SPLASH.includes(n[1]) && n[2] !== '-sarga'))) out.R11.push({ z: 'tartalom', c: n[1] + (n[2] || ''), why: 'fehér foltos piktogram' }); });

  out.stats.textColours = Object.keys(out.R9).length;
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const url of urls) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.route(/sender|stripe|clarity|googletagmanager|google-analytics|cookieyes/, r => r.abort());
    await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(600);
    const m = await page.evaluate(measure);
    await page.close();
    const count = (rule, z) => m[rule].filter(v => !z || v.z === z).length;
    const buttons = Object.values(m.R3);
    const row = { url, R1: count('R1', 'tartalom'), R2: count('R2', 'tartalom'), R3: buttons.filter(b => b.z === 'tartalom').length, R3keret: buttons.filter(b => b.z === 'keret').length,
      R4: count('R4'), R5: count('R5'), R6: count('R6'), R7: count('R7', 'tartalom'), R8: count('R8'), R9: m.stats.textColours, R10: count('R10'), R11: count('R11'), keret: count('R1', 'keret') + count('R2', 'keret'), detail: m };
    row.violations = row.R1 + row.R2 + Math.max(0, row.R3 - 2) + row.R4 + row.R5 + row.R6 + row.R7 + row.R8 + row.R10 + row.R11;
    report.push(row);
    console.log(`\n${url}\n  eltérés: ${row.violations} | R1 lekerekítés ${row.R1} · R2 árnyék ${row.R2} · R3 gombfajta ${row.R3} (keretben ${row.R3keret}) · R4 domb ${row.R4} · R5 GYIK ${row.R5} · R6 app-CTA ${row.R6} · R7 kép ${row.R7} · R8 kiemelés ${row.R8} · R9 szövegszín ${row.R9} · R10 logó ${row.R10} · R11 piktogram ${row.R11} · fejléc+lábléc ${row.keret}`);
    const top = rule => { const g = {}; m[rule].filter(v => v.z === 'tartalom').forEach(v => { const k = v.c + ' (' + v.why + ')'; g[k] = (g[k] || 0) + 1; }); return Object.entries(g).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => `${n}× ${k}`).join('; '); };
    for (const rule of ['R1', 'R2', 'R4', 'R5', 'R6', 'R7', 'R8', 'R10', 'R11']) if (m[rule].some(v => v.z === 'tartalom')) console.log(`  ${rule}: ${top(rule)}`);
    if (buttons.length > 2) console.log('  R3: ' + buttons.map(b => `${b.n}× ${b.c} „${b.t}” [${b.z}]`).join('; '));
  }
  await browser.close();
  if (jsonOut) require('fs').writeFileSync(jsonOut, JSON.stringify(report, null, 1));
  const total = report.reduce((a, r) => a + r.violations, 0);
  console.log(`\nÖsszesen ${total} eltérés ${report.length} oldalon.`);
  process.exit(strict && total ? 1 : 0);
})();
