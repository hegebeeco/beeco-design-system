#!/usr/bin/env node
/* ============================================================
   beeco DESIGN SYSTEM – belépő a közös docs-motorhoz (tools/docs/). Termékbőr, nyitott oldal (nincs jelszókapu).

   node tools/docs-ds.js             → _site/ds/
   Forrás: docs-site/ds/ (nav.json + oldalanként <slug>.json). Komponensoldal: { "tipus": "komponens", "komponens": "<id>" } –
   az adat a brandbook/elemek/komponensek.json-ból, a propok az api/api.json-ból, a tokenek a termek/css-ből jönnek (nem másolat).
   Ami nincs meg az adatban, az látható „Hiányzik” jelvénnyel és a mező nevével jelenik meg – soha nem kitalálva.
   A másik oldal címe: DOCS_BRAND_URL (alap: ../brand/index.html).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { futtat } = require('./docs/motor');
const A = require('./docs/alap');
const B = require('./docs/blokk');
const { esc, inl, ic } = A;

const PKG = A.json('package.json');
const KOMP = A.json('brandbook/elemek/komponensek.json');
const API = A.json('api/api.json');
const TESZT = A.json('termek/tesztlapok/lista.json');
const TERMEK = A.json('tokens/theme-termek.json');
const KOMP_F = 'brandbook/elemek/komponensek.json';

// ---------- CSS-ből kinyert adat: melyik szabály melyik tokent használja ----------
const CSS_FAJLOK = fs.readdirSync(path.join(A.ROOT, 'termek/css')).filter(f => /^bc-.*\.css$/.test(f) && f !== 'bc-all.css');
function szabalyok(osztaly) {
  const re = new RegExp(`\\.${osztaly.replace(/-/g, '\\-')}(?![\\w-])`);
  const ki = [];
  for (const f of CSS_FAJLOK) {
    const nyers = A.read(`termek/css/${f}`);
    const src = nyers.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));   // a sorszám maradjon
    for (const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1].trim().replace(/^@[^{]*$/, '');
      if (!re.test(sel)) continue;
      ki.push({ fajl: `termek/css/${f}`, sor: src.slice(0, m.index + m[0].indexOf(m[1].trim())).split('\n').length, sel, test: m[2] });
    }
  }
  return ki;
}
const TOKEN_CSOPORT = [
  ['Szín (szerep)', t => Object.keys(TERMEK.color.light).includes(t)],
  ['Forma (sarok, keret, árnyék)', t => /^(r-|bw-|shadow)/.test(t)],
  ['Betű', t => /^(font-|fs-|fw-|lh-)/.test(t)],
  ['Térköz', t => /^sp-/.test(t)],
  ['Mozgás', t => /^(t-|ease-)/.test(t)],
  ['Egyéb', () => true],
];

// ---------- JSX-példa az api.json propjaiból ----------
function jsxPelda(nev, def) {
  const p = def.props || {};
  const kotelezo = Object.entries(p).filter(([, v]) => v.kotelezo).map(([k, v]) => /=>/.test(v.t) ? `${k}={…}` : /^string/.test(v.t) ? `${k}="…"` : `${k}={…}`).join(' ');
  const zar = def.htmlAttr ? '>Felirat</' + nev + '>' : ' />';
  const nyit = (extra) => `<${nev}${kotelezo ? ' ' + kotelezo : ''}${extra ? ' ' + extra : ''}${zar}`;
  const sorok = [nyit('')];
  for (const [k, v] of Object.entries(p)) {
    if (v.kotelezo) continue;
    const lit = [...v.t.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    if (lit.length && /^("[^"]+"\s*\|\s*)*"[^"]+"(\s*\|\s*undefined)?$/.test(v.t)) lit.forEach(l => sorok.push(nyit(`${k}="${l}"`)));
    else if (/^boolean/.test(v.t)) sorok.push(nyit(k));
  }
  return [...new Set(sorok)];
}

let kodDb = 0;
function kodBlokk(szoveg, cimke) {
  const id = `kod-${++kodDb}`;
  return `<div class="bb-kod"><pre tabindex="0" aria-label="${esc(cimke)}"><code id="${id}">${esc(szoveg)}</code></pre><button type="button" class="bc-btn is-ghost is-icon bb-masol" data-masol-cel="${id}" aria-label="${esc(cimke)} másolása" hidden>${ic('masol')}</button></div>`;
}

// ---------- komponensoldal (Carbon: Irányelvek · Specifikáció · Kód · Hozzáférhetőség) ----------
const UJ_MEZOK = [['anatomia', 'annotált anatómia (részek és nevük)'], ['allapotok', 'változat × állapot mátrix'], ['a11y', 'ARIA-szerep és billentyűtérkép'],
  ['statusz', 'életciklus-státusz (stabil / béta / elavult)'], ['kapcsolodo', 'kapcsolódó komponensek']];
function komponensOldal(o, ctx) {
  const k = KOMP.komponensek.find(x => x.id === o.komponens);
  if (!k) { ctx.hibak.push(`${ctx.oldal}: ismeretlen komponens: ${o.komponens}`); return { torzs: '' }; }
  for (const m of ['nev', 'leiras', 'minta_html']) if (!k[m]) ctx.hibak.push(`${ctx.oldal}: a komponensadatból hiányzik: ${m}`);
  const reactok = (k.react || []).map(n => [n, API.react[n]]);
  for (const [n, d] of reactok) if (!d) ctx.hibak.push(`${ctx.oldal}: a(z) ${n} nincs az api.json-ban`);
  const fo = (k.css || [])[0] ? k.css[0].split(' ')[0] : null;
  const rules = fo ? szabalyok(fo) : [];
  const tokenek = [...new Set(rules.flatMap(r => [...r.test.matchAll(/var\(--bc-([a-z0-9-]+)/g)].map(m => m[1])))];
  const hiany = UJ_MEZOK.filter(([m]) => !k[m]);
  if (!o.alcim) o.alcim = k.leiras;
  const ful = (id, cim, tartalom) => ({ id, cim, tartalom });

  // Irányelvek
  ctx.szint = 2;
  const iranyelvek = `<h2 id="iranyelvek">Irányelvek</h2>
<div class="bb-mikor"><section aria-labelledby="mikor"><h3 id="mikor">Mikor használd</h3>${B.lista(k.mikor)}</section><section aria-labelledby="mikor-ne"><h3 id="mikor-ne">Mikor ne – és mit helyette</h3>${B.lista(k.mikor_ne)}</section></div>
<h3 id="valtozatok">Változatok</h3>
${reactok.filter(([, d]) => d && d.props).map(([n, d]) => { const l = Object.entries(d.props).filter(([, v]) => /"/.test(v.t)); return l.length ? `<p><strong>${esc(n)}</strong> (React): ${l.map(([p, v]) => `<code>${esc(p)}</code>: ${[...v.t.matchAll(/"([^"]+)"/g)].map(m => `<code>${esc(m[1])}</code>`).join(' · ')}`).join('; ')}</p>` : ''; }).join('')}
${(k.css || []).length ? `<p><strong>CSS-osztályok:</strong></p><ul class="bb-tokenek" role="list">${k.css.map(c => `<li><code>${esc(c)}</code></li>`).join('')}</ul>` : B.hianyzikJel('css', 'CSS-osztályok')}
<h3 id="igy-es-ne-igy">Így és ne így</h3>
<div class="bb-dd-racs">${(k.do || []).map(d => B.ddFig(d, true, ctx)).join('')}${(k.dont || []).map(d => B.ddFig(d, false, ctx)).join('')}</div>
${(k.do || []).length && (k.dont || []).length ? '' : B.hianyzikJel('do / dont', 'legalább egy képes Így és Ne így pár')}`;

  // Specifikáció
  const tokCsop = [];
  const maradt = new Set(tokenek);
  for (const [cim, f] of TOKEN_CSOPORT) { const l = [...maradt].filter(f); l.forEach(t => maradt.delete(t)); if (l.length) tokCsop.push(`<p><strong>${esc(cim)}:</strong></p><ul class="bb-tokenek" role="list">${l.map(t => `<li><code>--bc-${esc(t)}</code></li>`).join('')}</ul>`); }
  const fajlok = [...new Set(rules.map(r => r.fajl))];
  const specifikacio = `<h2 id="specifikacio">Specifikáció</h2>
<h3 id="anatomia">Anatómia</h3>${k.anatomia ? '' : B.hianyzikJel('anatomia', 'annotált rajz: a részek neve (felirat, piktogram, keret, árnyék) – készül')}
<h3 id="valtozat-allapot">Változat × állapot</h3>${k.allapotok ? '' : B.hianyzikJel('allapotok', 'a mátrix helye: változatonként alap, rámutatás, lenyomva, fókusz, tiltott, folyamatban')}
${(k.tesztlap || []).length ? `<p class="bb-kicsi">Addig minden állapot élőben: ${k.tesztlap.map(n => `<a href="repo/termek/tesztlapok/${esc(n)}.html">${esc((TESZT.find(t => t.nev === n) || { cim: n }).cim)} tesztlap</a>`).join(', ')}.</p>` : ''}
<h3 id="tokenek">Használt tokenek</h3>
${tokenek.length ? `<p class="bb-kicsi">A <code>.${esc(fo)}</code> szabályaiból kinyerve (${fajlok.map(f => `<code>${esc(f)}</code>`).join(', ')}; ${rules.length} szabály).</p>${tokCsop.join('')}` : B.hianyzikJel('tokenek', 'a CSS-ből nem nyerhető ki')}`;

  // Kód
  const importok = reactok.filter(([, d]) => d).map(([n]) => n);
  const vanReact = PKG.exports && PKG.exports['./react'], vanCss = PKG.exports && PKG.exports['./termek.css'];
  const importKod = (vanReact ? `import { ${importok.join(', ')} } from '${PKG.name}/react';\n` : '') + (vanCss ? `import '${PKG.name}/termek.css'; // egyszer, az alkalmazás belépőjében` : '');
  const kod = `<h2 id="kod">Kód</h2>
<h3 id="importut">Importút</h3>${vanReact ? kodBlokk(importKod, 'Import') : B.hianyzikJel('exports ./react', 'a package.json-ban')}
<h3 id="jsx">JSX-példák</h3><p class="bb-kicsi">Az <code>api/api.json</code> propjaiból generálva: minden változat és kapcsoló egy sorban. A „…” helyére a saját értéked kerül.</p>
${reactok.filter(([, d]) => d).map(([n, d]) => kodBlokk(jsxPelda(n, d).join('\n'), `${n} – JSX`)).join('')}
<h3 id="propok">Propok</h3>
<p class="bb-hiany"><span class="bc-badge is-muted">Hiányzik</span> <code>alapertek</code> – az alapértékek nincsenek az <code>api.json</code>-ban; a forrás: <code>react/src/</code>.</p>
${reactok.filter(([, d]) => d).map(([n, d]) => `<h4 id="propok-${A.slug(n)}">${esc(n)}</h4>${d.props && Object.keys(d.props).length ? B.tabla(['Prop', 'Típus', 'Kötelező'], Object.entries(d.props).map(([p, v]) => [`\`${p}\``, `\`${v.t}\``, v.kotelezo ? 'igen' : 'nem']), `${n} propjai`) : B.hianyzikJel('props', `${n}`)}${d.htmlAttr ? `<p class="bb-kicsi">A natív HTML-attribútumokat is továbbadja (<code>htmlAttr</code>).</p>` : ''}`).join('')}`;

  // Hozzáférhetőség
  const magassag = rules.flatMap(r => [...r.test.matchAll(/min-height\s*:\s*([^;]+)/g)].map(m => [`\`${r.sel.replace(/\s+/g, ' ')}\``, `\`${m[1].trim()}\``, `\`${r.fajl.replace('termek/css/', '')}:${r.sor}\``]));
  const fokusz = (A.read('termek/css/bc-base.css').match(/:where\(:focus-visible\)\s*\{[^}]*\}/) || [''])[0];
  const a11y = `<h2 id="hozzaferhetoseg">Hozzáférhetőség</h2>
<h3 id="aria">ARIA-szerep</h3>${k.a11y && k.a11y.szerep ? `<p>${inl(k.a11y.szerep)}</p>` : B.hianyzikJel('a11y.szerep', 'a natív elem és a szükséges ARIA-attribútumok leírása')}
<h3 id="billentyuk">Billentyűtérkép</h3>${k.a11y && k.a11y.billentyuk ? B.tabla(['Billentyű', 'Mit csinál'], k.a11y.billentyuk, 'Billentyűk') : B.hianyzikJel('a11y.billentyuk', 'billentyű → művelet táblázat')}
<h3 id="erintes">Érintési méret (a CSS-ből)</h3>${magassag.length ? B.tabla(['Szabály', 'min-height', 'Hol'], magassag, 'Legkisebb magasság') + `<p class="bb-kicsi"><code>--bc-tap</code> = ${A.json('tokens/core.json').tap} px (<code>tokens/core.json</code>).</p>` : B.hianyzikJel('min-height', 'a CSS-ben nincs legkisebb magasság')}
<h3 id="fokusz">Fókusz</h3>${fokusz ? `<p class="bb-kicsi">A közös alap (<code>termek/css/bc-base.css</code>) minden elemre ad látható fókuszkeretet:</p>${kodBlokk(fokusz, 'Fókusz-szabály')}` : B.hianyzikJel('focus-visible', '')}`;

  const fulek = [ful('iranyelvek', 'Irányelvek', iranyelvek), ful('specifikacio', 'Specifikáció', specifikacio), ful('kod', 'Kód', kod), ful('hozzaferhetoseg', 'Hozzáférhetőség', a11y)];
  const torzs = `<dl class="bb-komp-meta">${(k.react || []).length ? `<div><dt>React</dt><dd>${k.react.map(x => `<code>${esc(x)}</code>`).join('')}</dd></div>` : ''}<div><dt>Szint</dt><dd>${esc((KOMP.szintek.find(s => s.id === k.szint) || { nev: k.szint }).nev)}</dd></div><div><dt>Életciklus</dt><dd>${k.statusz ? B.statuszJelveny(k.statusz) : '<span class="bc-badge is-muted">Hiányzik: statusz</span>'}</dd></div></dl>
<section class="bb-demo" aria-labelledby="elo-minta"><p class="bb-demo-cim" id="elo-minta">Élő minta</p>${B.htmlEllenor(k.minta_html || '', ctx, 'minta_html')}</section>
${hiany.length ? `<section class="bb-blokk is-hianyzik" aria-labelledby="adathiany"><div class="bb-blokk-fej"><span class="bc-badge is-muted">Hiányzik</span><p class="bb-kartya-cim" id="adathiany">Adathiány ezen az oldalon</p></div><p>A komponensadatból (<code>${KOMP_F}</code>) ezek a mezők még hiányoznak – a lapon a helyük jelölve van:</p><ul class="bb-list">${hiany.map(([m, l]) => `<li><code>${m}</code> – ${esc(l)}</li>`).join('')}</ul></section>` : ''}
<div class="bb-fulek" data-fulek>
<div class="bb-fulsor" role="tablist" aria-label="${esc(k.nev)} – dokumentáció" hidden>${fulek.map((f, i) => `<button type="button" class="bb-ful" role="tab" id="ful-${f.id}" aria-controls="panel-${f.id}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''}>${f.cim}</button>`).join('')}</div>
${fulek.map(f => `<section class="bb-panel" id="panel-${f.id}" data-ful="ful-${f.id}">${f.tartalom}</section>`).join('\n')}
</div>
<h2 id="kapcsolodo">Kapcsolódó</h2>${k.kapcsolodo ? B.lista(k.kapcsolodo) : B.hianyzikJel('kapcsolodo', 'a rokon komponensek listája')}
<h3 id="tesztlapok">Tesztlapok</h3>${(k.tesztlap || []).length ? `<ul class="bb-tesztlap-lista" role="list">${k.tesztlap.map(n => { const t = TESZT.find(x => x.nev === n); if (!t) ctx.hibak.push(`${ctx.oldal}: ismeretlen tesztlap: ${n}`); return `<li><a href="repo/termek/tesztlapok/${esc(n)}.html">${esc(t ? t.cim : n)}${ic('tovabb')}</a><span class="bb-kicsi"> – ${esc(t ? t.leiras : '')}</span></li>`; }).join('')}</ul>` : B.hianyzikJel('tesztlap', '')}
${B.forrasLista(k.forras)}`;
  return { torzs, extraForras: [KOMP_F, 'api/api.json'], kulcsszavak: [...(k.react || []), ...(k.css || []), ...reactok.flatMap(([, d]) => Object.keys((d && d.props) || {}))].join(' ') };
}

// ---------- generált részek a kezdőlapra ----------
const komponensOldalak = () => fs.readdirSync(path.join(A.ROOT, 'docs-site/ds')).filter(f => f !== 'nav.json' && f.endsWith('.json')).map(f => A.json(`docs-site/ds/${f}`)).filter(o => o.tipus === 'komponens');
const GEN = {
  /** A három szám, magyarázattal és forrással – adatból számolva, nem kézzel beírva. */
  szamok() {
    const react = Object.values(API.react).filter(x => x.fajta === 'komponens').length;
    const sor = (szam, cim, mit) => `<div><dt>${cim}</dt><dd class="bb-szam">${szam}</dd><dd>${mit}</dd></div>`;
    return `<dl class="bb-szamok">${[
      sor(KOMP.komponensek.length, 'Dokumentált elem', 'atomtól sablonig, használati szabállyal (<code>komponensek.json</code>)'),
      sor(react, 'React-komponens', 'a csomag exportált komponensei (<code>api/api.json</code>)'),
      sor(TESZT.length, 'Tesztlap', 'élő oldal minden állapottal és szélső esettel'),
      sor(`${komponensOldalak().length} / ${KOMP.komponensek.length}`, 'Komponensoldal itt', 'a dokumentált elemekből ennyinek van már saját oldala'),
    ].join('')}</dl><p class="bb-kicsi">Egy dokumentált elem több React-komponenst is lefedhet (a Gomb például: Button, CopyButton, DownloadButton).</p>`;
  },
  valtozasok() {
    const l = A.read('CHANGELOG.md').split('\n').filter(s => /^## \d/.test(s)).slice(0, 5).map(s => s.replace(/^## /, ''));
    return `<ul class="bb-valtozasok">${l.map(s => { const [v, d, ...t] = s.split(' – '); return `<li><code>${esc(v)}</code> <span class="bb-kicsi">${d ? `<time datetime="${esc(d)}">${esc(d)}</time>` : ''}</span> ${inl(t.join(' – '))}</li>`; }).join('')}</ul><p class="bb-kicsi">A teljes lista: <a href="https://github.com/hegebeeco/beeco-design-system/blob/main/CHANGELOG.md" rel="noopener">CHANGELOG.md</a></p>`;
  },
  kod(b) { return kodBlokk(b.x, b.cimke || 'Kód'); },
  /** Telepítés a VERSION fájl szerinti címkével (docs/AI.md: „Telepítés címkével”). */
  telepites() { return kodBlokk(`npm i github:hegebeeco/beeco-design-system#v${A.read('VERSION').trim()}`, 'Telepítés'); },
  kartyak(b, ctx) {
    return `<ul class="bb-kartyak" role="list">${b.kartyak.map(k => `<li><div class="bb-kartya"><p class="bb-kartya-nev">${esc(k.nev)}</p><p>${inl(k.leiras)}</p>${k.href ? `<a class="bb-tovabb" href="${esc(k.href === '@masik' ? ctx.masikUrl : k.href)}"${/^https?:/.test(k.href) ? ' rel="noopener"' : ''}>${esc(k.link)}${ic(/^https?:|^\.\.|^@/.test(k.href) ? 'kulso' : 'tovabb')}</a>` : `<p class="bb-kicsi"><span class="bb-soon">hamarosan</span> ${esc(k.link)}</p>`}</div></li>`).join('')}</ul>`;
  },
};

// A tesztlapok a repó szerinti relatív helyükön (a ../css/bc-all.css és a ../../dist/tesztlapok/*.js így működik) – csak a hivatkozottak.
const tesztlapok = [...new Set(komponensOldalak().flatMap(o => (KOMP.komponensek.find(k => k.id === o.komponens) || {}).tesztlap || []))];
const MASOL = [['termek/css', 'repo/termek/css'], ['dist/css', 'repo/dist/css'], ['web/assets/fonts', 'repo/web/assets/fonts'],
  ['web/assets/brand', 'repo/web/assets/brand'],
  ...tesztlapok.flatMap(n => [[`termek/tesztlapok/${n}.html`, `repo/termek/tesztlapok/${n}.html`], [`dist/tesztlapok/${n}.js`, `repo/dist/tesztlapok/${n}.js`]])];

futtat({
  id: 'ds', nev: 'Design System', skin: 'termek',
  forras: 'docs-site/ds', ki: '_site/ds',
  robots: '',
  leiras: 'A beeco design systeme: alapok, komponensek, minták és eszközök tervezőknek, fejlesztőknek és AI-eszközöknek.',
  keresoPelda: 'Keresés: gomb, variant, token…',
  masik: { nev: 'Brand Book', url: '../brand/index.html', env: 'DOCS_BRAND_URL' },
  gen: GEN,
  tipusok: { komponens: komponensOldal },
  masol: MASOL,
});
