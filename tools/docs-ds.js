#!/usr/bin/env node
/* ============================================================
   beeco DESIGN SYSTEM – belépő a közös docs-motorhoz (tools/docs/). Termékbőr, nyitott oldal (nincs jelszókapu).

   node tools/docs-ds.js             → _site/ds/ (+ _redirects a régi Brand Book DS-tartalmú címeiről)
   Forrás: docs-site/ds/ (nav.json + oldalanként <slug>.json). A komponensoldalak (<id>.html) és a kategóriaoldalak
   (kat-<id>.html) GENERÁLTAK: az adat a brandbook/elemek/komponensek.json-ból, a kategóriák a docs-site/ds/komponens-kategoriak.json-ból,
   a propok az api/api.json-ból, a tokenek a termek/css-ből (tools/docs/komponens.js). Ami nincs meg az adatban, az látható
   „Hiányzik” jelvénnyel és a mező nevével jelenik meg – soha nem kitalálva.
   A Brand Book címe: DOCS_BRAND_URL (alap: ../brand/).
   ============================================================ */
'use strict';
const { futtat } = require('./docs/motor');
const A = require('./docs/alap');
const { GEN } = require('./docs/gen');
const K = require('./docs/komponens');
const { esc, inl, ic } = A;
const fs = require('fs');
const path = require('path');

const API = A.json('api/api.json');
let kodDb = 0;
const kodBlokk = (szoveg, cimke) => { const id = `dkod-${++kodDb}`; return `<div class="bb-kod"><pre tabindex="0" aria-label="${esc(cimke)}"><code id="${id}">${esc(szoveg)}</code></pre><button type="button" class="bc-btn is-ghost is-icon bb-masol" data-masol-cel="${id}" aria-label="${esc(cimke)} másolása" hidden>${ic('masol')}</button></div>`; };

/** {{szam:<kulcs>}} – a szövegben a számok adatból (nem kézzel). */
function szamok() {
  return {
    komponensek: K.KOMP.komponensek.length, 'react-komponensek': Object.values(API.react).filter(x => x.fajta === 'komponens').length,
    tesztlapok: K.TESZT.length, kategoriak: K.kategoriak([]).lista.length, verzio: A.read('VERSION').trim(),
  };
}

const DS = 'rendszer-tartalom';
const GEN_DS = {
  ...GEN,
  /** A számok magyarázattal és forrással – adatból számolva, nem kézzel beírva. */
  szamok: { oldal: 'ds', miert: DS, fn() {
    const sz = szamok();
    const sor = (szam, cim, mit) => `<div><dt>${cim}</dt><dd class="bb-szam">${szam}</dd><dd>${mit}</dd></div>`;
    return `<dl class="bb-szamok">${[
      sor(sz.komponensek, 'Dokumentált elem', 'atomtól sablonig, saját oldallal (<code>komponensek.json</code>)'),
      sor(sz['react-komponensek'], 'React-komponens', 'a csomag exportált komponensei (<code>api/api.json</code>)'),
      sor(sz.tesztlapok, 'Tesztlap', 'élő oldal minden állapottal és szélső esettel'),
      sor(sz.kategoriak, 'Kategória', 'a komponensek csoportjai a menüben'),
    ].join('')}</dl><p class="bb-kicsi">Egy dokumentált elem több React-komponenst is lefedhet (a Gomb például: Button, CopyButton, DownloadButton).</p>`;
  } },
  kod: { oldal: 'ds', miert: DS, fn: b => kodBlokk(b.x, b.cimke || 'Kód') },
  /** Telepítés a VERSION fájl szerinti címkével (docs/AI.md: „Telepítés címkével”). */
  telepites: { oldal: 'ds', miert: DS, fn: () => kodBlokk(`npm i github:hegebeeco/beeco-design-system#v${A.read('VERSION').trim()}`, 'Telepítés') },
  /** Komponens-katalógus: kategóriánként az elemek (a „Komponensek” áttekintőre). */
  komponensKatalogus: { oldal: 'ds', miert: DS, fn: K.katalogusGen },
};

futtat({
  id: 'ds', nev: 'Design System', skin: 'termek',
  forras: process.env.DOCS_FORRAS || 'docs-site/ds', ki: process.env.DOCS_KI || '_site/ds',   // DOCS_FORRAS / DOCS_KI: csak próbához
  robots: '',
  leiras: 'A beeco design systeme: alapok, komponensek, minták és eszközök tervezőknek, fejlesztőknek és AI-eszközöknek.',
  keresoPelda: 'Keresés: gomb, variant, token…',
  masik: { id: 'brand', nev: 'Brand Book', alap: '../brand/', env: 'DOCS_BRAND_URL' },
  gen: GEN_DS, szamok,
  nemOldal: ['komponens-kategoriak.json'],
  navAtalakit: K.navAtalakit,
  generalt: n => n.generalt === 'komponens'
    ? { id: n.slug, cim: n.cim, csoport: 'komponensek', statusz: (K.KOMP.komponensek.find(k => k.id === n.komponens) || {}).statusz || 'vázlat', tipus: 'komponens', komponens: n.komponens }
    : { id: n.slug, cim: n.cim, alcim: n.kategoria.leiras, csoport: 'komponensek', statusz: 'vázlat', tipus: 'kategoria', kategoria: n.kategoria },
  tipusok: { komponens: K.komponensOldal, kategoria: K.kategoriaOldal },
  atiranyitas: true,
});

// llms.txt a dokumentációs oldal gyökerébe: a repó llms.txt-je abszolút (GitHub) linkekkel, hogy az ügynök az oldalról is elérje
{
  const ki = path.resolve(A.ROOT, process.env.DOCS_KI || '_site/ds');
  const blob = 'https://github.com/hegebeeco/beeco-design-system/blob/main/';
  const dsUrl = (process.env.DOCS_DS_URL || '').replace(/\/?$/, '/');
  const szoveg = A.read('llms.txt').replace(/\]\((?!https?:)([^)]+)\)/g, (m, f) => `](${blob}${f})`)
    .replace(/\n## Kezdd itt/, `\n## A dokumentációs oldal\n- [Első nap](${dsUrl}elso-nap.html): húsz perc, hat lépés új közreműködőknek\n- [Komponensek](${dsUrl}komponensek.html): minden elem saját oldalon, élő kipróbálással, JSX-példával, billentyűtérképpel\n- [Szótár](${dsUrl}szotar.html): bőr, téma, szerep, token\n\n## Kezdd itt`);
  fs.writeFileSync(path.join(ki, 'llms.txt'), szoveg);
}
