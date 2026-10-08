#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – belépő a közös docs-motorhoz (tools/docs/). Játékbőr-karakter (Méhsejt-diorama), jelszókapu mögé kerül.

   node tools/docs-brand.js          → _site/brand/
   Forrás: docs-site/brand/ (nav.json + oldalanként <slug>.json). A régi tools/brandbook-build.js külön él tovább.
   A másik oldal címe: DOCS_DS_URL környezeti változó (alap: ../ds/index.html – helyben a két kimenet egymás mellett van).
   ============================================================ */
'use strict';
const { futtat } = require('./docs/motor');
const { ic, esc, inl } = require('./docs/alap');

const GEN = {
  /** A két logóváltozat, a valódi fájlokkal. */
  logo() {
    return `<div class="bb-logok"><figure class="bb-logo is-vilagos"><img src="assets/brand/logo.webp" alt="beeco logó, világos háttérre" width="240" height="147" loading="lazy"><figcaption>Világos háttérre: <code>logo.webp</code></figcaption></figure><figure class="bb-logo is-sotet"><img src="assets/brand/logo-sotet.webp" alt="beeco logó, sötét háttérre" width="240" height="147" loading="lazy"><figcaption>Sötét háttérre: <code>logo-sotet.webp</code></figcaption></figure></div>`;
  },
  /** A fejezetek a nav.json-ból (szám és sorrend adatból, nem kézzel). */
  fejezetek(b, ctx) {
    const cs = ctx.nav.csoportok.filter(c => c.id !== 'kezdes');
    return `<p>${cs.length} fejezet, egy olvasási sorrendben: ${cs.map(c => esc(c.cim)).join(', ')}. Minden oldal alján a „Következő” visz tovább; a még készülő oldalak a menüben szürkén, „hamarosan” jelöléssel látszanak.</p>`;
  },
  /** Kezdőlap: „Hol kezdjem?” – csak a már létező oldalakra visz; a többi útra „hamarosan”. */
  holKezdjem(b, ctx) {
    return `<ul class="bb-kartyak" role="list">${b.kartyak.map(k => `<li><div class="bb-kartya"><p class="bb-kartya-nev">${esc(k.nev)}</p><p>${inl(k.leiras)}</p>${k.href
      ? `<a class="bb-tovabb" href="${esc(k.href === '@masik' ? ctx.masikUrl : k.href)}">${esc(k.link)}${ic(/^https?:|^\.\.|^@/.test(k.href) ? 'kulso' : 'tovabb')}</a>`
      : `<p class="bb-kicsi"><span class="bb-soon">hamarosan</span> ${esc(k.link)}</p>`}</div></li>`).join('')}</ul>`;
  },
};

futtat({
  id: 'brand', nev: 'Brand Book', skin: 'jatek',
  forras: 'docs-site/brand', ki: '_site/brand',
  robots: 'noindex, nofollow',
  leiras: 'A beeco márkakönyve: ki a beeco, hogyan szól, és hogyan néz ki – önkénteseknek, partnereknek, tervezőknek.',
  keresoPelda: 'Keresés: logó, védőtér, méhecske…',
  masik: { nev: 'Design System', url: '../ds/index.html', env: 'DOCS_DS_URL' },
  gen: GEN,
});
