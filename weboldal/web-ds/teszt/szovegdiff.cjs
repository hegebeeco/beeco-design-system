// Szöveg-összevetés: a publikált oldal szekcióinak szövege betűre egyezik-e a generátor kimenetével
// (szóköztől függetlenül; így a beillesztéskor elgépelt vagy elcsúszott szöveg azonnal kiderül).
// Használat: node weboldal/web-ds/teszt/szovegdiff.cjs <útvonal> <generátor-kimenet.json> [--alap URL] [--kihagy "szöveg"]…
//   --kihagy: az a szekció, amelynek szövege ezt tartalmazza, kimarad (komponens-példány, például „Velünk dolgoznak”)
//   pl. node weboldal/web-ds/teszt/szovegdiff.cjs /en weboldal/rolunk/ki/e.json
const pw = require(process.env.PLAYWRIGHT_UT || 'playwright');
const fs = require('fs');
const arg = process.argv.slice(2); const ai = arg.indexOf('--alap');
const ALAP = ai >= 0 ? arg.splice(ai, 2)[1] : 'https://beeco-weboldal.webflow.io';
const KIHAGY = []; for (let i; (i = arg.indexOf('--kihagy')) >= 0;) KIHAGY.push(arg.splice(i, 2)[1]);
const [UT, JSONFAJL] = arg;
const ent = s => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const lap = s => s.normalize('NFC').replace(/\s+/g, '');
(async () => {
  const forras = lap(ent(JSON.parse(fs.readFileSync(JSONFAJL, 'utf8')).map(a => a.html.replace(/<option[^>]*>[\s\S]*?<\/option>/g, '').replace(/<[^>]+>/g, '')).join('')));
  const b = await pw.chromium.launch(); const p = await b.newPage();
  await p.route(/sender|universal\.js|stripe/, r => r.abort());
  await p.goto(ALAP + UT + '?t=' + Date.now(), { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const elo = lap(await p.evaluate(kihagy => [...document.querySelectorAll('section.ds-szekcio')].filter(s => !s.closest('.w-dyn-list, footer, nav') && !kihagy.some(k => s.textContent.includes(k)))
    .map(s => { const c = s.cloneNode(true); c.querySelectorAll('option, .w-embed').forEach(x => x.remove()); return c.textContent; }).join(''), KIHAGY));
  await b.close();
  if (elo === forras) { console.log(`${UT}: a szöveg betűre egyezik (${forras.length} karakter).`); process.exit(0); }
  let i = 0; while (i < elo.length && elo[i] === forras[i]) i++;
  console.log(`${UT}: ELTÉR a ${i}. karaktertől.\n  generátor: …${forras.slice(Math.max(0, i - 40), i + 60)}\n  élő:       …${elo.slice(Math.max(0, i - 40), i + 60)}`);
  process.exit(1);
})();
