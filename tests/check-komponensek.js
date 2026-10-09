#!/usr/bin/env node
/* ============================================================
   check-komponensek – a DS-komponensek gépi öntesztje (docs/komponensek.md 3. és 3/C)
   Minden termek/tesztlapok/*.html lapot megnyit fej nélküli Chromiumban 8 nézetben × világos/sötét módban, és mér:
     működés (a lap <név>.test.mjs forgatókönyve: valódi gépelés, kattintás, billentyűzet) · konzolhiba ·
     kilógás · 44 px · szöveg-kontraszt · 3/A (súgó, számláló) · látható fókusz · axe-core hozzáférhetőség ·
     csökkentett mozgás · hosszú feladatok (teljesítmény)
   Kimenet: leletek kategóriánként és súlyosság szerint (P0–P3). P0/P1 vagy bukott forgatókönyv → hiba (exit 1).
   Használat: node tests/check-komponensek.js [lapnév…] [--gyors] [--json out.json]
   ============================================================ */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const meres = require('../tools/komp/oldal-meres');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'termek/tesztlapok');
const args = process.argv.slice(2);
const gyors = args.includes('--gyors');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const csak = args.filter((a) => !a.startsWith('--') && a !== jsonOut);
// --shard=2/3: a tesztlapok i-edik harmada (a CI párhuzamos futtatásához: ~9 helyett ~3 perc)
const shard = (args.find((a) => /^--shard=\d+\/\d+$/.test(a)) || '').match(/(\d+)\/(\d+)/);
const NEZETEK = [
  { n: 'telefon 320', w: 320, h: 640, touch: true }, { n: 'telefon 390', w: 390, h: 844, touch: true },
  { n: 'telefon fekvő', w: 844, h: 390, touch: true }, { n: 'tablet álló', w: 768, h: 1024, touch: true },
  { n: 'tablet fekvő', w: 1024, h: 768, touch: true }, { n: 'asztal 1280', w: 1280, h: 800, touch: false },
  { n: 'asztal 1440', w: 1440, h: 900, touch: false }, { n: 'érintő-TV', w: 1920, h: 1080, touch: true },
].filter((v, i) => !gyors || i === 1 || i === 5);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

// Stabil mérési pont (2026-10: a CI-ben a mérés néha a betűk betöltése előtt futott → elcsúszott középre gördítés):
// megvárja a webbetűket és két képkockát, hogy az elrendezés (és a ResizeObserver-es igazítások) lefussanak.
async function stabil(page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

// Kis statikus szerver a repó gyökeréből (modul-szkript file://-ról nem töltődik)
function serve() {
  return new Promise((res) => {
    const s = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); rsp.end(); return; }
      rsp.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res(s));
  });
}

async function main() {
  const lapok = fs.readdirSync(DIR).filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', '')).filter((n) => !csak.length || csak.includes(n)).filter((n, i) => !shard || i % +shard[2] === +shard[1] - 1);
  const srv = await serve(); const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch();
  const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const leletek = []; const forgato = [];
  const add = (lap, nezet, l) => leletek.push({ lap, nezet, ...l });

  for (const lap of lapok) {
    for (const v of NEZETEK) for (const tema of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, hasTouch: v.touch, isMobile: v.touch && v.w < 900, colorScheme: tema });
      const page = await ctx.newPage(); const hibak = [];
      page.on('pageerror', (e) => hibak.push(e.message)); page.on('console', (m) => m.type() === 'error' && hibak.push(m.text()));
      await page.addInitScript(() => { window.__long = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: true }); } catch {} });
      await page.goto(`${base}/termek/tesztlapok/${lap}.html`); await page.waitForSelector('[data-case]'); await stabil(page); await page.waitForTimeout(150);
      const hol = `${v.n} · ${tema === 'dark' ? 'sötét' : 'világos'}`;
      hibak.forEach((h) => add(lap, hol, { kat: 'Működés', sulyos: 'P1', mi: `konzolhiba: ${h.slice(0, 120)}`, hol: 'oldal' }));
      (await page.evaluate(meres, { touch: v.touch, w: v.w })).forEach((l) => add(lap, hol, l));
      // Teljesítmény: hosszú feladat a betöltés alatt
      const long = await page.evaluate(() => window.__long);
      if (long.some((d) => d > 50)) add(lap, hol, { kat: 'Teljesítmény', sulyos: 'P2', mi: `hosszú feladat betöltéskor: ${long.filter((d) => d > 50).join(', ')} ms (> 50)`, hol: 'oldal' });
      if (v.w === 1280) {
        // Látható fókusz: az első 25 fókuszálható elemen Tab-bal végig
        for (let i = 0; i < 25; i++) {
          await page.keyboard.press('Tab');
          const f = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const shown = (x) => { const s = getComputedStyle(x); return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'; }; const vis = shown(e) || (e.parentElement && e.parentElement.matches(':focus-within') && shown(e.parentElement)); /* a keret a burkon is lehet (pl. keresős legördülő) */ return vis ? null : `${e.closest('[data-case]')?.dataset.case || ''} › ${e.tagName.toLowerCase()} „${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 24)}”`; });
          if (f) add(lap, hol, { kat: 'Hozzáférhetőség', sulyos: 'P1', mi: 'fókusz nem látható', hol: f });
        }
        // axe-core: WCAG 2.2 AA szabályok
        await page.addScriptTag({ content: axeSrc });
        const ax = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, n: x.nodes.length, t: x.nodes[0]?.target?.join(' ') })));
        ax.forEach((x) => add(lap, hol, { kat: 'Hozzáférhetőség', sulyos: { critical: 'P1', serious: 'P1', moderate: 'P2' }[x.impact] || 'P3', mi: `axe: ${x.help} (${x.id}, ${x.n} elem)`, hol: x.t }));
        // Csökkentett mozgás: nem futhat végtelen animáció
        await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(100);
        const inf = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().endTime === Infinity).length);
        if (inf) add(lap, hol, { kat: 'Animáció', sulyos: 'P2', mi: `${inf} végtelen animáció fut csökkentett mozgásnál`, hol: 'oldal' });
        // Forgatókönyv (működés, szélső esetek) – egyszer, világos asztali nézetben
        const tf = path.join(DIR, `${lap}.test.mjs`);
        if (tema === 'light' && fs.existsSync(tf)) {
          await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.reload(); await page.waitForSelector('[data-case]'); await stabil(page);
          const { default: run } = await import(tf);
          await run({ page, stabil: () => stabil(page), t: async (nev, fn) => { try { await fn(); forgato.push({ lap, nev, ok: true }); } catch (e) { forgato.push({ lap, nev, ok: false, hiba: e.message.split('\n')[0] }); } } });
        }
      }
      await ctx.close();
    }
  }
  await browser.close(); srv.close();
  report(lapok, leletek, forgato);
}

function report(lapok, leletek, forgato) {
  // Ugyanaz a lelet több nézetben: egyszer, a nézetek felsorolásával
  const egy = new Map();
  for (const l of leletek) { const k = `${l.lap}|${l.kat}|${l.sulyos}|${l.mi}|${l.hol}`; if (!egy.has(k)) egy.set(k, { ...l, nezetek: [] }); egy.get(k).nezetek.push(l.nezet); }
  const lista = [...egy.values()].sort((a, b) => a.sulyos.localeCompare(b.sulyos) || a.kat.localeCompare(b.kat));
  const db = (s) => lista.filter((l) => l.sulyos === s).length;
  console.log(`check-komponensek: ${lapok.length} tesztlap × ${NEZETEK.length} nézet × 2 mód`);
  console.log(`  forgatókönyv: ${forgato.filter((f) => f.ok).length}/${forgato.length} rendben`);
  forgato.filter((f) => !f.ok).forEach((f) => console.log(`  ✗ ${f.lap}: ${f.nev} – ${f.hiba}`));
  console.log(`  leletek: P0 ${db('P0')} · P1 ${db('P1')} · P2 ${db('P2')} · P3 ${db('P3')}`);
  for (const l of lista) console.log(`  [${l.sulyos}] ${l.kat} · ${l.lap} · ${l.mi}\n        hol: ${l.hol}\n        nézet: ${l.nezetek.length > 4 ? l.nezetek.length + ' nézetben' : l.nezetek.join(', ')}`);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ forgato, leletek: lista }, null, 1));
  if (db('P0') || db('P1') || forgato.some((f) => !f.ok)) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });
