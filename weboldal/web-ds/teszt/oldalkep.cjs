// Oldalkép: teljes oldalas képernyőkép asztalon (1440) és mobilon (390), és gépi jelzők:
// vízszintes kilógás, törött kép, JS-hiba. A lusta képeket végiggörgetéssel tölti be.
// Használat: node weboldal/web-ds/teszt/oldalkep.cjs <útvonal> [<útvonal>…] [--alap URL] [--ki mappa]
const pw = require(process.env.PLAYWRIGHT_UT || 'playwright');
const fs = require('fs'), path = require('path');
const arg = process.argv.slice(2);
const kivesz = k => { const i = arg.indexOf(k); return i >= 0 ? arg.splice(i, 2)[1] : null; };
const ALAP = kivesz('--alap') || 'https://beeco-weboldal.webflow.io';
const KI = kivesz('--ki') || 'oldalkep'; fs.mkdirSync(KI, { recursive: true });
(async () => {
  const ISMERT = [/window\.Stripe is not a function/];  // site-szintű, ismert hiba (beeco-webflow-setup), nem buktatja a tesztet
  const b = await pw.chromium.launch(); let hibak = 0;
  for (const ut of arg.length ? arg : ['/']) for (const [nev, vp, mob] of [['asztal', { width: 1440, height: 900 }, false], ['mobil', { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mob, deviceScaleFactor: 1 });
    await ctx.route(/sender|universal\.js|stripe/, r => r.abort());
    const p = await ctx.newPage(); const jsHiba = []; p.on('pageerror', e => jsHiba.push(e.message));
    await p.goto(ALAP + ut + '?t=' + Date.now(), { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(2000);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
    await p.waitForTimeout(1200);
    const fajl = path.join(KI, `${ut.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'fooldal'}-${nev}.png`);
    await p.screenshot({ path: fajl, fullPage: true });
    const i = await p.evaluate(() => ({ kilog: document.documentElement.scrollWidth - innerWidth,
      torott: [...document.images].filter(k => k.complete && k.naturalWidth === 0).map(k => k.src.slice(-60)) }));
    const uj = jsHiba.filter(h => !ISMERT.some(r => r.test(h)));
    if (i.kilog > 0 || i.torott.length || uj.length) hibak++;
    console.log(`${ut} ${nev}: kilógás ${i.kilog}px · törött kép ${i.torott.length} ${i.torott.join(' ')} · JS-hiba ${uj.length} ${uj.join(' | ')}${jsHiba.length > uj.length ? ' (+ ismert: ' + (jsHiba.length - uj.length) + ')' : ''} · ${fajl}`);
    await ctx.close();
  }
  await b.close(); process.exit(hibak ? 1 : 0);
})();
