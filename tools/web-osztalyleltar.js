#!/usr/bin/env node
/* ============================================================
   web-osztalyleltar – mi a DS, mi egyedi, és mi halott a Webflow-oldalon (docs/weboldal.md 7.)

   A Webflow-ban az osztályok sosem tűnnek el maguktól: a törölt szekciók stílusai ott maradnak,
   és minden új oldal tovább hizlalja a listát. Ez az eszköz két forrást vet össze:

     1. a Webflow-ban DEFINIÁLT stílusok (a `data_style_tool > get_styles` kimentett válasza),
     2. az ÉLŐ oldalakon ténylegesen HASZNÁLT osztályok (a publikált HTML-ből).

   Így kiderül, mi törölhető, mi az, ami sablonszemét, és hol tér el a névadás a DS-től.

   Használat:
     node tools/web-osztalyleltar.js <stilusok.json> <alap-URL> [--max 25] [--json out.json]
     node tools/web-osztalyleltar.js <stilusok.json>              (csak a definiált lista elemzése)
   ============================================================ */
const fs = require('fs');

const args = process.argv.slice(2);
const kap = (n, alap) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : alap; };
const fajl = args.find((a) => !a.startsWith('-') && !a.startsWith('http'));
const alap = (args.find((a) => a.startsWith('http')) || '').replace(/\/$/, '');
const maxOldal = Number(kap('--max', 25));
const jsonOut = args.includes('--json') ? kap('--json') : null;
if (!fajl) { console.error('Adj meg egy kimentett get_styles választ: node tools/web-osztalyleltar.js stilusok.json [URL]'); process.exit(2); }

const nyers = JSON.parse(fs.readFileSync(fajl, 'utf8'));
const stilusok = nyers.result || nyers.styles || nyers;

// --- Osztályozás: ki honnan jött
const SABLON = [
  /^div-block/i, /^section-?\d/i, /^heading-?\d/i, /^paragraph-?\d/i, /^text-block-?\d/i, /^link-block/i,
  /^image-?\d/i, /^container-?\d/i, /^grid-?\d/i, /^columns?-?\d/i, /^list-item/i, /^bold-text/i,
  /^rich-text/i, /^button-?\d/i, /^form-block/i, /^block-\d/i, /^wrapper-?\d/i, /^untitled/i,
  /^combine|^elements-webflow-library|^ov[_-]/i, /^brix/i, /^w-/,
];
const csoport = (nev, selector) => {
  const n = (nev || '').trim();
  if (/^bc-/.test(n)) return 'DS (bc-)';
  if (/^h26-/.test(n)) return 'oldal-specifikus (h26-)';
  if (/^ds-/.test(n)) return 'játékbőr maradék (ds-)';
  if (SABLON.some((r) => r.test(n))) return 'sablon-maradék';
  if (/[A-ZÁÉÍÓÖŐÚÜŰ]/.test(n) || /[áéíóöőúüű]/i.test(n)) return 'ékezetes vagy nagybetűs';
  return 'egyedi';
};

const osszes = stilusok.map((s) => ({
  nev: s.name, id: s.id, combo: !!s.isComboClass, konyvtar: !!s.isFromLibrary,
  selector: s.selector, csoport: csoport(s.name, s.selector),
}));

async function hasznalat() {
  if (!alap) return null;
  let utak = ['/'];
  try {
    const r = await fetch(`${alap}/sitemap.xml`);
    const xml = await r.text();
    utak = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => { try { return new URL(m[1]).pathname; } catch { return null; } }).filter(Boolean))].slice(0, maxOldal);
  } catch { console.error('sitemap nem olvasható, csak a kezdőlapot nézem'); }
  const szam = new Map();
  for (const u of utak) {
    try {
      const r = await fetch(alap + u);
      if (!r.ok) continue;
      const html = await r.text();
      for (const m of html.matchAll(/class="([^"]+)"/g)) {
        for (const c of m[1].trim().split(/\s+/)) szam.set(c, (szam.get(c) || 0) + 1);
      }
    } catch {}
    process.stdout.write('.');
  }
  console.log(`\n${utak.length} oldal átnézve`);
  return szam;
}

(async () => {
  const hasznalt = await hasznalat();

  // --- Csoportonkénti összegzés
  const g = new Map();
  for (const s of osszes) {
    if (!g.has(s.csoport)) g.set(s.csoport, []);
    g.get(s.csoport).push(s);
  }
  console.log(`\n■ Definiált stílusok: ${osszes.length}\n`);
  const sorrend = [...g.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [nev, lista] of sorrend) {
    const nemHasznalt = hasznalt ? lista.filter((s) => !hasznalt.has(s.nev)).length : null;
    console.log(`  ${String(lista.length).padStart(4)}  ${nev}${nemHasznalt !== null ? `   (sehol nem látszik: ${nemHasznalt})` : ''}`);
  }

  if (hasznalt) {
    const halott = osszes.filter((s) => !hasznalt.has(s.nev) && !s.konyvtar);
    console.log(`\n■ Egyetlen átnézett oldalon sem fordul elő: ${halott.length} osztály`);
    console.log('  (ez NEM azonnali törlési lista: a sitemapből csak mintát néztünk, és a vázlat oldalak kimaradnak)\n');
    const halottCsop = new Map();
    for (const s of halott) halottCsop.set(s.csoport, (halottCsop.get(s.csoport) || 0) + 1);
    for (const [k, v] of [...halottCsop.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
    console.log('\n  Példák a legbiztosabb jelöltekből (sablon-maradék, sehol nem látszik):');
    halott.filter((s) => s.csoport === 'sablon-maradék').slice(0, 25).forEach((s) => console.log(`    · ${s.nev}`));

    // Gyakori, de nem DS nevű osztályok: ezeket érdemes bc-re átnevezni
    // Egy névhez több stílus is tartozhat (kombinált osztályok), ezért névre egyesítünk
    const egyedi = new Map();
    for (const s of osszes) {
      if (!hasznalt.has(s.nev) || s.csoport === 'DS (bc-)' || s.csoport === 'oldal-specifikus (h26-)') continue;
      if (!egyedi.has(s.nev)) egyedi.set(s.nev, { ...s, db: hasznalt.get(s.nev), valtozat: 0 });
      egyedi.get(s.nev).valtozat++;
    }
    const gyakori = [...egyedi.values()].sort((a, b) => b.db - a.db).slice(0, 20);
    console.log('\n■ A legtöbbet használt, de nem DS-nevű osztályok (átnevezési jelöltek):');
    gyakori.forEach((s) => console.log(`  ${String(s.db).padStart(4)}×  ${s.nev}   [${s.csoport}]${s.valtozat > 1 ? `  ${s.valtozat} változatban` : ''}`));
  }

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify({
      osszes: osszes.length,
      csoportok: Object.fromEntries([...g.entries()].map(([k, v]) => [k, v.length])),
      stilusok: osszes.map((s) => ({ ...s, hasznalat: hasznalt ? (hasznalt.get(s.nev) || 0) : null })),
    }, null, 2));
    console.log(`\njelentés: ${jsonOut}`);
  }
})();
