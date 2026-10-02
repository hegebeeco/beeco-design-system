#!/usr/bin/env node
/* ============================================================
   web-ellenor – az ÉLŐ beeco weboldal gépi átvizsgálása (docs/weboldal.md 5.)

   A Webflow-oldal nem tud DS-t importálni és nincs build-lépése, ezért a minőséget a KIMENETEN
   mérjük: megnyitjuk a publikált oldalakat fej nélküli Chromiumban, és ugyanazt a mérést futtatjuk,
   amit a DS-komponenseken (tools/komp/oldal-meres.js), plusz a web-specifikusat
   (tools/web/oldal-meres-web.js), plusz axe-core-t, fókuszt és a linkek elérhetőségét.

   Használat:
     node tools/web-ellenor.js https://beeco-weboldal.webflow.io
     node tools/web-ellenor.js <alap> --oldalak /,/letoltes,/kampanyok/csicsergosz
     node tools/web-ellenor.js <alap> --gyors --max 12 --json jelentes.json
   Kapcsolók: --gyors (2 nézet), --max N (hány oldal a sitemapből), --oldalak a,b,c, --json f, --linkek-nelkul
   Kilépés: P0/P1 lelet → 1
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const meres = require('./komp/oldal-meres');
const meresWeb = require('./web/oldal-meres-web');

const ROOT = path.join(__dirname, '..');
const paletta = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/weboldal/paletta.json'), 'utf8'));

const args = process.argv.slice(2);
const kap = (n, alap) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : alap; };
const alap = (args.find((a) => a.startsWith('http')) || '').replace(/\/$/, '');
if (!alap) { console.error('Adj meg egy alap URL-t, pl. node tools/web-ellenor.js https://beeco-weboldal.webflow.io'); process.exit(2); }
const gyors = args.includes('--gyors');
const maxOldal = Number(kap('--max', 25));
const jsonOut = args.includes('--json') ? kap('--json') : null;
const linkEllenorzes = !args.includes('--linkek-nelkul');
const megadott = kap('--oldalak', null);

const NEZETEK = [
  { n: 'telefon 320', w: 320, h: 640, touch: true },
  { n: 'telefon 390', w: 390, h: 844, touch: true },
  { n: 'tablet 768', w: 768, h: 1024, touch: true },
  { n: 'asztal 1280', w: 1280, h: 800, touch: false },
].filter((v, i) => !gyors || i === 1 || i === 3);

// --- Oldallista: a megadott lista, különben a sitemap.xml
async function oldalLista() {
  if (megadott) return megadott.split(',').map((s) => s.trim()).filter(Boolean);
  try {
    const r = await fetch(`${alap}/sitemap.xml`, { redirect: 'follow' });
    if (!r.ok) throw new Error(`sitemap ${r.status}`);
    const xml = await r.text();
    const url = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const utak = [...new Set(url.map((u) => { try { return new URL(u).pathname; } catch { return null; } }).filter(Boolean))];
    // A gyűjtemény-oldalakból elég néhány minta: útvonal-minta szerint csoportosítunk
    const csoport = new Map();
    for (const u of utak) {
      const kulcs = u.split('/').slice(0, 2).join('/') || '/';
      if (!csoport.has(kulcs)) csoport.set(kulcs, []);
      csoport.get(kulcs).push(u);
    }
    const ki = [];
    for (const [, lista] of csoport) ki.push(...lista.slice(0, Math.max(1, Math.ceil(maxOldal / csoport.size))));
    return ki.slice(0, maxOldal);
  } catch (e) {
    console.error(`sitemap nem olvasható (${e.message}), csak a kezdőlapot nézem`);
    return ['/'];
  }
}

async function main() {
  const utak = await oldalLista();
  console.log(`web-ellenor · ${alap} · ${utak.length} oldal × ${NEZETEK.length} nézet\n`);
  const browser = await chromium.launch();
  let axeSrc = null;
  try { axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'); } catch { console.error('axe-core nincs telepítve – a WCAG-szabályokat kihagyom'); }

  const leletek = [];
  const belsoLinkek = new Set();
  const add = (ut, nezet, l) => leletek.push({ ut, nezet, ...l });

  for (const ut of utak) {
    for (const v of NEZETEK) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, hasTouch: v.touch, isMobile: v.touch && v.w < 900 });
      const page = await ctx.newPage();
      const hibak = [];
      page.on('pageerror', (e) => hibak.push(e.message));
      page.on('console', (m) => m.type() === 'error' && hibak.push(m.text()));
      const hol = `${v.n}`;
      let valasz;
      try {
        // domcontentloaded + rövid ülepedés: a networkidle-t a beágyazott követők és csevegők sosem érik el
        valasz = await page.goto(alap + ut, { waitUntil: 'domcontentloaded', timeout: 45000 });
        try { await page.waitForLoadState('networkidle', { timeout: 8000 }); }
        catch { add(ut, hol, { kat: 'Teljesítmény', sulyos: 'P2', mi: 'a hálózat 8 mp után sem csendesedik el (folyamatosan töltő beágyazás)', hol: 'oldal' }); }
      } catch (e) {
        add(ut, hol, { kat: 'Működés', sulyos: 'P0', mi: `az oldal nem töltődött be: ${e.message.slice(0, 80)}`, hol: ut });
        await ctx.close(); continue;
      }
      if (!valasz || valasz.status() >= 400) {
        add(ut, hol, { kat: 'Működés', sulyos: 'P0', mi: `HTTP ${valasz ? valasz.status() : '?'}`, hol: ut });
        await ctx.close(); continue;
      }
      await page.waitForTimeout(400);
      hibak.forEach((h) => add(ut, hol, { kat: 'Működés', sulyos: 'P1', mi: `konzolhiba: ${h.slice(0, 110)}`, hol: 'oldal' }));
      (await page.evaluate(meres, { touch: v.touch, w: v.w })).forEach((l) => add(ut, hol, l));
      (await page.evaluate(meresWeb, { paletta, utvonal: ut })).forEach((l) => add(ut, hol, l));

      if (!v.touch) {
        // Belső linkek begyűjtése a későbbi elérhetőség-ellenőrzéshez
        for (const h of await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href))) {
          try { const u = new URL(h); if (u.origin === new URL(alap).origin) belsoLinkek.add(u.pathname + u.search); } catch {}
        }
        // Látható fókusz: az első 20 fókuszálható elemen
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press('Tab');
          const f = await page.evaluate(() => {
            const e = document.activeElement; if (!e || e === document.body) return null;
            const mutat = (x) => { const s = getComputedStyle(x); return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'; };
            return mutat(e) || (e.parentElement && e.parentElement.matches(':focus-within') && mutat(e.parentElement))
              ? null : `${e.tagName.toLowerCase()} „${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 28)}”`;
          });
          if (f) add(ut, hol, { kat: 'Hozzáférhetőség', sulyos: 'P1', mi: 'fókusz nem látható', hol: f });
        }
        if (axeSrc) {
          await page.addScriptTag({ content: axeSrc });
          const ax = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] })).violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, n: x.nodes.length, t: x.nodes[0]?.target?.join(' ') })));
          ax.forEach((x) => add(ut, hol, { kat: 'Hozzáférhetőség', sulyos: { critical: 'P1', serious: 'P1', moderate: 'P2' }[x.impact] || 'P3', mi: `axe: ${x.help} (${x.id}, ${x.n} elem)`, hol: x.t }));
        }
        // Csökkentett mozgás: nem futhat végtelen animáció
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(200);
        const vegtelen = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().endTime === Infinity).length);
        if (vegtelen) add(ut, hol, { kat: 'Animáció', sulyos: 'P2', mi: `${vegtelen} végtelen animáció fut csökkentett mozgásnál`, hol: 'oldal' });
      }
      await ctx.close();
    }
    process.stdout.write('.');
  }
  await browser.close();
  console.log('\n');

  // --- Linkek elérhetősége (egyszer minden egyedi belső útvonalra)
  if (linkEllenorzes && belsoLinkek.size) {
    const lista = [...belsoLinkek];
    console.log(`linkek ellenőrzése: ${lista.length} egyedi belső útvonal`);
    for (let i = 0; i < lista.length; i += 8) {
      await Promise.all(lista.slice(i, i + 8).map(async (u) => {
        try {
          let r = await fetch(alap + u, { method: 'HEAD', redirect: 'follow' });
          if (r.status === 405 || r.status === 501) r = await fetch(alap + u, { method: 'GET', redirect: 'follow' });
          if (r.status >= 400) leletek.push({ ut: u, nezet: 'link', kat: 'Működés', sulyos: 'P1', mi: `belső link HTTP ${r.status}`, hol: u });
        } catch (e) { leletek.push({ ut: u, nezet: 'link', kat: 'Működés', sulyos: 'P1', mi: `belső link nem érhető el: ${e.message.slice(0, 50)}`, hol: u }); }
      }));
    }
  }
  jelentes(utak, leletek);
}

function jelentes(utak, leletek) {
  // Ugyanaz a lelet több nézetben: egyszer, a nézetek felsorolásával
  const egy = new Map();
  for (const l of leletek) {
    const k = `${l.ut}|${l.kat}|${l.sulyos}|${l.mi}|${l.hol}`;
    if (!egy.has(k)) egy.set(k, { ...l, nezetek: [] });
    egy.get(k).nezetek.push(l.nezet);
  }
  const sor = [...egy.values()].sort((a, b) => a.sulyos.localeCompare(b.sulyos) || a.ut.localeCompare(b.ut));
  const szam = { P0: 0, P1: 0, P2: 0, P3: 0 };
  sor.forEach((l) => (szam[l.sulyos] = (szam[l.sulyos] || 0) + 1));

  let elozoUt = null;
  for (const l of sor) {
    if (l.ut !== elozoUt) { console.log(`\n■ ${l.ut}`); elozoUt = l.ut; }
    const n = l.nezetek.length > 3 ? 'minden nézet' : [...new Set(l.nezetek)].join(', ');
    console.log(`  [${l.sulyos}] ${l.kat}: ${l.mi}`);
    console.log(`        ${l.hol}${n ? `  ·  ${n}` : ''}`);
  }
  console.log(`\n────────────────────────────────────────`);
  console.log(`${utak.length} oldal · P0 ${szam.P0} · P1 ${szam.P1} · P2 ${szam.P2} · P3 ${szam.P3}`);
  if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify({ alap, utak, leletek: sor }, null, 2)); console.log(`jelentés: ${jsonOut}`); }
  if (!sor.length) console.log('✓ nincs lelet');
  process.exit(szam.P0 || szam.P1 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
