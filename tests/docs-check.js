#!/usr/bin/env node
/* ============================================================
   docs-check – a két új dokumentációs oldal (Brand Book: _site/brand, Design System: _site/ds) minimális őre.
   Futtatás: npm run docs:check (előbb mindkettőt megépíti). SZÁNDÉKOSAN nem tests/check-*.js nevű, így az `npm test`
   még nem futtatja – amíg a régi tools/brandbook-build.js él, a két építő párhuzamos (lásd a terv F7 pontját).

   Ellenőrzi: minden belső link és horgony él · egy h1 oldalanként · nincs kihagyott címsorszint · nincs inline stílus,
   inline script, on…= eseménykezelő · nincs üres oldal · nincs mérges méhecske · a „tervezett” oldalak nincsenek
   kimenetben, keresőben, láncban és linkben · a képek lusta betöltésűek · a docs-CSS és a skin a check-tokens szabályai
   szerint tiszta (nyers szín, nem létező token, nyers z-index, ease-in, px betűméret, méz on-accent nélkül, 400 ms nem fióknál).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const hibak = [];
const hiba = m => hibak.push(m);
const OLDALAK = [['brand', 'docs-site/brand'], ['ds', 'docs-site/ds']];

const idk = new Map();
const idkOf = f => { if (!idk.has(f)) idk.set(f, new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))); return idk.get(f); };
const strip = h => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

let db = 0, linkDb = 0;
for (const [nev, forras] of OLDALAK) {
  const dir = path.join(SITE, nev);
  if (!fs.existsSync(dir)) { hiba(`${nev}: nincs megépítve (_site/${nev}) – futtasd: npm run docs:build`); continue; }
  const nav = JSON.parse(fs.readFileSync(path.join(ROOT, forras, 'nav.json'), 'utf8'));
  const tervezett = nav.csoportok.flatMap(c => c.oldalak).filter(o => o.tervezett).map(o => `${o.slug}.html`);
  const htmlek = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const t of tervezett) if (htmlek.includes(t)) hiba(`${nev}: a tervezett oldal (${t}) mégis kikerült`);

  for (const f of htmlek) {
    db++;
    const p = path.join(dir, f), h = fs.readFileSync(p, 'utf8'), hol = `${nev}/${f}`;
    if (!/^<!doctype html>/i.test(h)) hiba(`${hol}: nincs <!doctype html>`);
    if (!/<html lang="hu"/.test(h)) hiba(`${hol}: nincs lang="hu"`);
    // CSP: nincs inline stílus és script, nincs eseménykezelő-attribútum
    if (/\sstyle="/.test(h)) hiba(`${hol}: inline stílus`);
    if (/<style[\s>]/.test(h)) hiba(`${hol}: <style> elem`);
    if (/<script(?![^>]*\ssrc=)[^>]*>/.test(h)) hiba(`${hol}: inline script`);
    if (/\son[a-z]+="/i.test(h)) hiba(`${hol}: on…= eseménykezelő`);
    if (/bee-angry/.test(h)) hiba(`${hol}: a mérges méhecske tilos`);
    // címsorok: egy h1, nincs kihagyott szint
    const cimek = [...h.matchAll(/<h([1-6])[\s>]/g)].map(m => +m[1]);
    const h1 = cimek.filter(x => x === 1).length;
    if (h1 !== 1) hiba(`${hol}: ${h1} db h1 (pontosan egy kell)`);
    for (let i = 1; i < cimek.length; i++) if (cimek[i] > cimek[i - 1] + 1) hiba(`${hol}: kihagyott címsorszint: h${cimek[i - 1]} → h${cimek[i]}`);
    // nem üres
    const fo = (h.match(/<main[\s\S]*?<\/main>/) || [''])[0];
    if (strip(fo).length < 80) hiba(`${hol}: üres vagy majdnem üres oldal`);
    // képek: lusta betöltés (a hős-kép kivétel: az első képernyőn van) és alt
    for (const m of h.matchAll(/<img\b[^>]*>/g)) {
      if (!/\salt="/.test(m[0])) hiba(`${hol}: kép alt nélkül: ${m[0].slice(0, 80)}`);
      if (!/\sloading="lazy"/.test(m[0]) && !/bb-hero-kep/.test(m[0])) hiba(`${hol}: kép loading="lazy" nélkül: ${m[0].slice(0, 80)}`);
    }
    // belső linkek és horgonyok
    for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(https?:|mailto:|data:)/.test(u) || u.startsWith('/')) continue;
      linkDb++;
      const [fajl, horgony] = u.split('#');
      const cel = fajl ? path.resolve(path.dirname(p), fajl.split('?')[0]) : p;
      if (!fs.existsSync(cel)) { hiba(`${hol}: törött link: ${u}`); continue; }
      if (horgony && cel.endsWith('.html') && !idkOf(cel).has(horgony)) hiba(`${hol}: nem létező horgony: ${u}`);
      if (tervezett.includes(path.basename(fajl)) && path.dirname(cel) === dir) hiba(`${hol}: link tervezett oldalra: ${u}`);
    }
    for (const m of h.matchAll(/rel="(prev|next)"[^>]*|href="([^"]+)" rel="(prev|next)"/g)) {
      const u = m[2]; if (u && tervezett.includes(u)) hiba(`${hol}: a láncban tervezett oldal: ${u}`);
    }
    for (const m of h.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)) for (const id of m[1].split(/\s+/)) if (!idkOf(p).has(id)) hiba(`${hol}: ARIA-hivatkozás nem létező id-re: ${id}`);
  }
  // keresőindex
  const ix = path.join(dir, 'assets', 'kereses.json');
  if (!fs.existsSync(ix)) hiba(`${nev}: hiányzik az assets/kereses.json`);
  else for (const t of JSON.parse(fs.readFileSync(ix, 'utf8'))) {
    const [fajl, horgony] = t.u.split('#');
    if (tervezett.includes(fajl)) hiba(`${nev}: tervezett oldal a keresőben: ${t.u}`);
    const cel = path.join(dir, fajl);
    if (!fs.existsSync(cel)) hiba(`${nev}: a keresőindex nem létező oldalra mutat: ${t.u}`);
    else if (horgony && !idkOf(cel).has(horgony)) hiba(`${nev}: a keresőindex nem létező horgonyra mutat: ${t.u}`);
    for (const k of ['c', 'g']) if (!t[k]) hiba(`${nev}: keresőtétel „${k}” nélkül: ${t.u}`);
  }
  // a teljes kimenetben sincs mérges méhecske
  const bejar = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? bejar(path.join(d, e.name)) : [path.join(d, e.name)]);
  for (const f of bejar(dir)) if (/bee-angry/.test(path.basename(f))) hiba(`${nev}: tiltott fájl a kimenetben: ${path.relative(SITE, f)}`);
}

// ---------- a docs-CSS és a generált skin: a check-tokens termékbőr-szabályai ----------
const gen = fs.readFileSync(path.join(ROOT, 'dist/css/beeco-tokens.css'), 'utf8');
const letezo = new Set([...gen.matchAll(/(--bc-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const cssek = [['tools/docs/kliens/docs.css', fs.readFileSync(path.join(ROOT, 'tools/docs/kliens/docs.css'), 'utf8')]];
const skinF = path.join(SITE, 'brand/assets/skin-jatek.css');
if (fs.existsSync(skinF)) cssek.push(['_site/brand/assets/skin-jatek.css', fs.readFileSync(skinF, 'utf8')]); else hiba('a játékbőr-skin (skin-jatek.css) nincs megépítve');
for (const [f, nyers] of cssek) {
  const src = nyers.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const hol = i => `${f}:${src.slice(0, i).split('\n').length}`;
  for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) hiba(`${hol(m.index)}: nyers szín ${m[0]}`);
  for (const m of src.matchAll(/\b(rgba?|hsla?)\(\s*\d/g)) hiba(`${hol(m.index)}: nyers ${m[1]}()`);
  for (const m of src.matchAll(/var\((--bc-[a-z0-9-]+)/g)) if (!letezo.has(m[1])) hiba(`${hol(m.index)}: nem létező token ${m[1]}`);
  for (const m of src.matchAll(/z-index\s*:\s*-?\d+/g)) hiba(`${hol(m.index)}: nyers z-index`);
  for (const m of src.matchAll(/\bease-in\b(?!-out)/g)) hiba(`${hol(m.index)}: ease-in tilos`);
  for (const m of src.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) hiba(`${hol(m.index)}: nyers betűméret ${m[1]}px`);
  for (const m of src.matchAll(/\{([^{}]*background(?:-color)?\s*:\s*var\(--bc-accent\)[^{}]*)\}/g)) if (!/(^|[\s;])(color|--_ink)\s*:\s*var\(--bc-on-accent\)/.test(m[1])) hiba(`${hol(m.index)}: méz háttér on-accent szövegszín nélkül`);
  for (const m of src.matchAll(/transition[^;]*var\(--bc-t-slow\)[^;]*/g)) if (!/ease-drawer/.test(m[0])) hiba(`${hol(m.index)}: 400 ms-os átmenet csak fióknál`);
  for (const m of src.matchAll(/transition[^;]*\b(\d{3,})ms/g)) if (+m[1] > 300) hiba(`${hol(m.index)}: ${m[1]} ms-os átmenet (UI ≤ 300 ms)`);
}

if (hibak.length) { console.log(`docs-check: ${hibak.length} hiba\n- ` + hibak.join('\n- ')); process.exit(1); }
console.log(`docs-check: rendben – ${db} oldal, ${linkDb} belső hivatkozás, ${cssek.length} CSS-réteg a token-szabályok szerint`);
