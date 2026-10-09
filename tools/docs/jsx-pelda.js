/* ============================================================
   beeco docs – futtatható JSX-példa az api/api.json-ból

   • Egyszerű kötelező propokból (string, szám, logikai, ReactNode, eseménykezelő) teljes, másolható példa készül:
     importokkal, useState-tel a value/onChange, checked/onChange, open/onOpenChange párokra.
   • Ha egy kötelező prop típusa összetett (ChartData, tömb, generikus függvény…), a példa NEM teljes: a hívó a
     „teljes: false” jelzést kapja, és a tesztlap forrására mutató hivatkozást ír ki (nincs kitalált adat).
   • A tests/check-jsx-peldak.js minden teljes példát lefordít a dist/react típusaival: ami itt „teljes”, az fordul.
   ============================================================ */
'use strict';

const PAROK = [['value', 'onChange'], ['checked', 'onChange'], ['open', 'onOpenChange'], ['open', 'onOpen']];
const SZOVEG = { label: 'Címke', title: 'Cím', help: 'Rövid súgó', children: 'Felirat', name: 'Név', text: 'Szöveg', description: 'Leírás', placeholder: 'Írj ide', message: 'Üzenet', heading: 'Cím', alt: 'Leírás' };
/** Amit az api.json nem ír ki (a TS-típus Omit/szűkítése miatt): nyílt elem helyett önzáró, plusz kötelező natív attribútum. */
const KIEGESZITES = { IconButton: { attr: ['aria-label="Törlés"'], szoveg: '×' }, SwitchInput: { attr: ['aria-label="Értesítések"'], onzaro: true } };
const tiszta = t => String(t).replace(/\s*\|\s*undefined\b/g, '').trim();

/** Egy kötelező prop értéke JSX-attribútumként, vagy null, ha nem képezhető le biztosan. */
function ertek(nev, t, kontroll) {
  const tt = tiszta(t);
  if (kontroll[nev]) return `{${kontroll[nev]}}`;
  if (tt === 'string') return `"${SZOVEG[nev] || 'Szöveg'}"`;
  if (tt === 'ReactNode') return `"${SZOVEG[nev] || 'Szöveg'}"`;
  if (tt === 'number') return '{1}';
  if (tt === 'boolean') return '';                       // csak a neve: true
  if (/^\(\s*\)\s*=>\s*(void|Promise<void>)$/.test(tt) || /^\(\s*\)\s*=>\s*void\s*\|\s*Promise<void>$/.test(tt)) return '{() => {}}';
  if (/^\([a-z]\w*:\s*[^)]+\)\s*=>\s*void$/.test(tt)) return '{() => {}}';
  if (/^"[^"]+"(\s*\|\s*"[^"]+")*$/.test(tt)) return `"${tt.match(/"([^"]+)"/)[1]}"`;
  return null;
}
/** A useState kezdőértéke a prop típusából. */
function kezdo(t) {
  const tt = tiszta(t);
  if (!/^(string|number|boolean|null)(\s*\|\s*(string|number|boolean|null))*$/.test(tt)) return null;
  if (tt === 'string') return "''";
  if (/\bnull\b/.test(tt)) return 'null';
  if (tt === 'number') return '0';
  if (tt === 'boolean') return 'false';
  return null;
}

/**
 * @param {string} nev  a komponens neve
 * @param {{props?: Object, htmlAttr?: boolean}} def  az api.json bejegyzése
 * @returns {{kod: string, teljes: boolean, hianyzik: string[]}}
 */
function futoPelda(nev, def) {
  const p = def.props || {};
  const kotelezo = Object.entries(p).filter(([, v]) => v.kotelezo);
  const allapot = []; const kontroll = {};
  for (const [val, ch] of PAROK) {
    if (p[val] && p[val].kotelezo && p[ch] && p[ch].kotelezo && !kontroll[val] && /^\(\s*\w+\s*:/.test(tiszta(p[ch].t))) {
      const k = kezdo(p[val].t);
      if (k === null) continue;
      const setter = 'set' + val[0].toUpperCase() + val.slice(1);
      allapot.push(`  const [${val}, ${setter}] = useState<${tiszta(p[val].t)}>(${k});`);
      kontroll[val] = val; kontroll[ch] = setter;
    }
  }
  const attr = []; const hianyzik = [];
  for (const [kk, v] of kotelezo) {
    const k = kk.replace(/^['"]|['"]$/g, '');
    const e = ertek(k, v.t, kontroll);
    if (e === null) { hianyzik.push(k); attr.push(`${k}={/* ${tiszta(v.t).slice(0, 48)} */}`); }
    else attr.push(e === '' ? k : `${k}=${e}`);
  }
  const kieg = KIEGESZITES[nev] || {};
  for (const a of kieg.attr || []) attr.push(a);
  const bent = def.htmlAttr && !p.children && !kieg.onzaro;
  const jsx = bent ? `<${nev}${attr.length ? ' ' + attr.join(' ') : ''}>${kieg.szoveg || 'Felirat'}</${nev}>` : `<${nev}${attr.length ? ' ' + attr.join(' ') : ''} />`;
  const imp = [allapot.length ? "import { useState } from 'react';" : '', `import { ${nev} } from '@beeco/design-system/react';`].filter(Boolean).join('\n');
  const kod = `${imp}\n\nexport function Pelda() {\n${allapot.length ? allapot.join('\n') + '\n' : ''}  return ${jsx};\n}\n`;
  return { kod, teljes: hianyzik.length === 0, hianyzik };
}

module.exports = { futoPelda };
