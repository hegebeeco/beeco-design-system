// Gombteszt (beeco-szabály: minden gomb és horgony, Chromium + WebKit, asztal + mobil).
// Horgony: a cél a rögzített menü alá ér (|top| < 160 px), vagy az oldal aljáig görget; az előzmény nem nő.
// Linkek: minden http(s) link státusza (HEAD, ha kell GET). A mailto/tel kihagyva.
// Használat: node weboldal/web-ds/teszt/gombteszt.cjs <útvonal> [<útvonal>…] [--alap https://beeco-weboldal.webflow.io]
//   pl. node weboldal/web-ds/teszt/gombteszt.cjs /en /szolgaltatas/cegeknek-draft
const pw = require(process.env.PLAYWRIGHT_UT || 'playwright');
const arg = process.argv.slice(2); const ai = arg.indexOf('--alap');
const ALAP = ai >= 0 ? arg.splice(ai, 2)[1] : 'https://beeco-weboldal.webflow.io';
const UTAK = arg.length ? arg : ['/'];
const KIZAR = /sender|universal\.js|stripe/;  // harmadik fél, a teszt szempontjából zaj
(async () => {
  let hibak = 0; const linkek = new Set();
  for (const motor of ['chromium', 'webkit']) for (const mobil of [false, true]) {
    const b = await pw[motor].launch();
    const ctx = await b.newContext(mobil ? { ...pw.devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 } });
    await ctx.route(KIZAR, r => r.abort());
    for (const ut of UTAK) {
      const p = await ctx.newPage();
      await p.goto(ALAP + ut + (ut.includes('?') ? '&' : '?') + 't=' + Date.now(), { waitUntil: 'load' }); await p.waitForTimeout(1500);
      const h0 = await p.evaluate(() => history.length);
      const horgonyok = await p.evaluate(() => [...new Set([...document.querySelectorAll('main a[href^="#"], section a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1))]);
      const rossz = [];
      for (const h of horgonyok) {
        await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
        const a = p.locator(`section a[href="${h}"]`).first(); await a.scrollIntoViewIfNeeded();
        mobil ? await a.tap() : await a.click(); await p.waitForTimeout(1300);
        const r = await p.evaluate(h => { const c = document.querySelector(h); if (!c) return null;
          const veg = Math.abs(scrollY - (document.documentElement.scrollHeight - innerHeight)) < 4;
          return { top: Math.round(c.getBoundingClientRect().top), veg }; }, h);
        if (!r || !(Math.abs(r.top) < 160 || r.veg)) rossz.push(`${h}:${r ? r.top : 'nincs cél'}`);
      }
      const h1 = await p.evaluate(() => history.length);
      (await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href))).filter(u => /^https?:/.test(u) && !u.includes('#')).forEach(u => linkek.add(u));
      if (rossz.length || h1 !== h0) hibak++;
      console.log(`${motor} ${mobil ? 'mobil' : 'asztal'} ${ut}: horgony ${horgonyok.length - rossz.length}/${horgonyok.length} ${rossz.join(' ')} | előzmény ${h0}→${h1}`);
      await p.close();
    }
    await b.close();
  }
  for (const u of linkek) {
    let s = 0; try { s = (await fetch(u, { method: 'HEAD', redirect: 'follow' })).status; if (s >= 400) s = (await fetch(u, { redirect: 'follow' })).status; } catch (e) { s = 'HIBA ' + e.message; }
    if (s !== 200) { hibak++; console.log(`link ${s}  ${u}`); }
  }
  console.log(`${linkek.size} link ellenőrizve. ${hibak ? hibak + ' hiba' : 'Minden rendben.'}`);
  process.exit(hibak ? 1 : 0);
})();
