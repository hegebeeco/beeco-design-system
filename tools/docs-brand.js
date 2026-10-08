#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – belépő a közös docs-motorhoz (tools/docs/). Játékbőr-karakter (Méhsejt-diorama), jelszókapu mögé kerül
   (netlify.docs-brand.toml + netlify/edge-functions/brand/kapu-brand.js).

   node tools/docs-brand.js          → _site/brand/ (+ belepes.html, _redirects a régi Brand Book címeiről)
   Forrás: docs-site/brand/ (nav.json + oldalanként <slug>.json). A régi tools/brandbook-build.js külön él tovább.
   A DS címe: DOCS_DS_URL (alap: ../ds/ – helyben a két kimenet egymás mellett van). Abszolút DOCS_DS_URL mellett a régi
   DS-tartalmú címek (alapok.html, elemek.html …) is átirányítódnak a DS-re.
   A „gen” blokkok: tools/docs/gen.js (a régi építő nevei); a DS-be való generátor itt hibát ad.
   ============================================================ */
'use strict';
const { futtat } = require('./docs/motor');
const { GEN } = require('./docs/gen');
const G = require('./docs/gen');
const K = require('./docs/komponens');
const A = require('./docs/alap');

const opt = f => (A.exists(f) ? A.json(f) : null);
/** {{szam:<kulcs>}} – a szövegben a számok adatból (nem kézzel). */
function szamok() {
  const S = opt('brandbook/sablonok/sablonok.json') || { sablonok: [], csomagok: {} };
  const I = opt('brandbook/illusztraciok/keszlet.json') || { madarkak: [], v4: [], anim: [] };
  const H = A.json('tokens/hangnem.json');
  const fajl = cs => new Set(S.sablonok.filter(s => !cs || s.csoport === cs).map(s => s.file)).size;
  return {
    sablonok: fajl(), 'sablonok-social': fajl('social'), 'sablonok-partner': fajl('partner'), 'sablon-csomagok': Object.keys(S.csomagok).length,
    madarkak: I.madarkak.length, madarrajzok: I.v4.length, mozgasmintak: I.anim.length,
    'meh-szerepek': Object.keys(H.szerepek || {}).length, feluletek: G.FELULETEK.length,
    komponensek: K.KOMP.komponensek.length,
  };
}

futtat({
  id: 'brand', nev: 'Brand Book', skin: 'jatek',
  forras: process.env.DOCS_FORRAS || 'docs-site/brand', ki: process.env.DOCS_KI || '_site/brand',   // DOCS_FORRAS / DOCS_KI: csak próbához
  robots: 'noindex, nofollow',
  leiras: 'A beeco márkakönyve: ki a beeco, hogyan szól, és hogyan néz ki – önkénteseknek, partnereknek, tervezőknek.',
  keresoPelda: 'Keresés: logó, védőtér, méhecske…',
  masik: { id: 'ds', nev: 'Design System', alap: '../ds/', env: 'DOCS_DS_URL', navAtalakit: K.navAtalakit },
  labjegy: 'A beeco logója és méhecskéi belső használatúak; külső anyagban csak a beeco jóváhagyásával jelenhetnek meg.',
  gen: GEN, szamok,
  belepes: true, kilepes: '/kilepes', atiranyitas: true,
});
