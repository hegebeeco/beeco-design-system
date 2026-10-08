/* ============================================================
   beeco docs – komponensoldalak (Design System, Carbon-minta) és a „Komponensek” menücsoport

   • Minden elem a brandbook/elemek/komponensek.json-ból kap saját oldalt (<id>.html) – nincs kézi oldal-JSON.
     Ha mégis van docs-site/ds/<id>.json, annak mezői (cim, alcim, statusz, blokkok elé) felülírják a generáltat.
   • A kategóriák és a sorrend: docs-site/ds/komponens-kategoriak.json ({ kategoriak: [{ id, nev, leiras, elemek: [...] }] });
     ha nincs, a komponens „kategoria”, végül a „csoport” mezője a tartalék. Kategóriaoldal: kat-<id>.html.
   • Menü: Komponensek → kategória (lenyíló) → elem; legfeljebb 3 szint.
   • Új mezők (ha az adatban vannak): kategoria, anatomia[{resz,leiras}], allapotok[{allapot,megjelenes,megjegyzes}],
     a11y{szerep,billentyuk[],megjegyzes}, statusz, kapcsolodo[], alapertek. Hiányzó mező = látható „Hiányzik” jelvény.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const A = require('./alap');
const B = require('./blokk');
const { esc, inl, ic } = A;

const PKG = A.json('package.json');
const KOMP_F = 'brandbook/elemek/komponensek.json';
const KAT_F = 'docs-site/ds/komponens-kategoriak.json';
const KOMP = A.json(KOMP_F);
const API = A.json('api/api.json');
const TESZT = A.json('termek/tesztlapok/lista.json');
const TERMEK = A.json('tokens/theme-termek.json');
const STATUSZOK = ['stabil', 'béta', 'elavult', 'vázlat'];
const TUKOR = 'repo';

// ---------- kategóriák ----------
function kategoriak(hibak) {
  const kom = KOMP.komponensek;
  if (A.exists(KAT_F)) {
    const k = A.json(KAT_F).kategoriak || [];
    const lat = new Set();
    for (const c of k) {
      if (!c.id || !c.nev) hibak.push(`${KAT_F}: kategória id/nev nélkül: ${JSON.stringify(c).slice(0, 60)}`);
      for (const e of c.elemek || []) { if (!kom.some(x => x.id === e)) hibak.push(`${KAT_F}: ${c.id}: ismeretlen elem: ${e}`); if (lat.has(e)) hibak.push(`${KAT_F}: ${e} két kategóriában is`); lat.add(e); }
    }
    const kimaradt = kom.filter(x => !lat.has(x.id)).map(x => x.id);
    if (kimaradt.length) hibak.push(`${KAT_F}: kategória nélküli elemek: ${kimaradt.join(', ')}`);
    return { forras: KAT_F, lista: k.map(c => ({ id: c.id, nev: c.nev, leiras: c.leiras || '', elemek: (c.elemek || []).filter(e => kom.some(x => x.id === e)) })) };
  }
  // tartalék: kategoria, aztán csoport mező (a sorrend a komponensek.json sorrendje)
  const m = new Map();
  for (const x of kom) {
    const nev = x.kategoria || String(x.csoport || 'Egyéb').replace(/^[0-9a-z]+ – /, '');
    if (!m.has(nev)) m.set(nev, { id: A.slug(nev), nev, leiras: '', elemek: [] });
    m.get(nev).elemek.push(x.id);
  }
  return { forras: `${KOMP_F} (csoport – tartalék, amíg nincs ${KAT_F})`, lista: [...m.values()] };
}
const katSlug = id => (id.startsWith('kat-') ? id : `kat-${id}`);
/** A komponensoldal slugja: az elem id-je; ha a nav.json-ban már van ilyen oldal (pl. a „iranyitopult” minta), akkor komponens-<id>. */
const SLUG = {};
const kSlug = id => SLUG[id] || id;

/** A DS nav.json „komponensek” csoportja: a kézi kat-* és komponens-bejegyzések helyére a generált kategóriák (gyerekekkel). */
function navAtalakit(nav, hibak) {
  const cs = nav.csoportok.find(c => c.id === 'komponensek');
  if (!cs) { hibak.push('nav.json: nincs „komponensek” csoport – a komponensoldalak nem kerülnek a menübe'); return nav; }
  const ids = new Set(KOMP.komponensek.map(k => k.id));
  const kat = kategoriak(hibak);
  const marad = (cs.oldalak || []).filter(o => !/^kat-/.test(o.slug) && !ids.has(o.slug));
  const masutt = new Set(nav.csoportok.filter(c => c !== cs).flatMap(c => (c.oldalak || []).map(o => o.slug)));
  for (const id of ids) { SLUG[id] = masutt.has(id) ? `komponens-${id}` : id; if (masutt.has(id) && hibak.figy) hibak.figy.push(`komponens: a(z) „${id}” slug már egy másik oldalé – a komponensoldal: komponens-${id}.html`); }
  const gen = kat.lista.map(c => ({ slug: katSlug(c.id), cim: c.nev, generalt: 'kategoria', kategoria: c,
    gyerekek: c.elemek.map(e => { const k = KOMP.komponensek.find(x => x.id === e); return { slug: kSlug(e), cim: k.nev, generalt: 'komponens', komponens: e }; }) }));
  cs.oldalak = [...marad, ...gen];
  return nav;
}

// ---------- CSS-ből kinyert adat: melyik szabály melyik tokent használja ----------
const CSS_FAJLOK = fs.readdirSync(path.join(A.ROOT, 'termek/css')).filter(f => /^bc-.*\.css$/.test(f) && f !== 'bc-all.css');
const CSS_SRC = Object.fromEntries(CSS_FAJLOK.map(f => [f, A.read(`termek/css/${f}`).replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))]));
function szabalyok(osztaly) {
  const re = new RegExp(`\\.${osztaly.replace(/-/g, '\\-')}(?![\\w-])`);
  const ki = [];
  for (const f of CSS_FAJLOK) {
    const src = CSS_SRC[f];
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
const literalok = t => [...String(t).matchAll(/"([^"]+)"/g)].map(m => m[1]);
const csakLiteral = t => /^("[^"]+"\s*\|\s*)*"[^"]+"(\s*\|\s*undefined)?$/.test(t);
function jsxPelda(nev, def) {
  const p = def.props || {};
  const kotelezo = Object.entries(p).filter(([, v]) => v.kotelezo).map(([k, v]) => /^string/.test(v.t) ? `${k}="…"` : `${k}={…}`).join(' ');
  const zar = def.htmlAttr ? '>Felirat</' + nev + '>' : ' />';
  const nyit = (extra) => `<${nev}${kotelezo ? ' ' + kotelezo : ''}${extra ? ' ' + extra : ''}${zar}`;
  const sorok = [nyit('')];
  for (const [k, v] of Object.entries(p)) {
    if (v.kotelezo) continue;
    if (csakLiteral(v.t)) literalok(v.t).forEach(l => sorok.push(nyit(`${k}="${l}"`)));
    else if (/^boolean/.test(v.t)) sorok.push(nyit(k));
  }
  return [...new Set(sorok)];
}
let kodDb = 0;
function kodBlokk(szoveg, cimke) {
  const id = `kod-${++kodDb}`;
  return `<div class="bb-kod"><pre tabindex="0" aria-label="${esc(cimke)}"><code id="${id}">${esc(szoveg)}</code></pre><button type="button" class="bc-btn is-ghost is-icon bb-masol" data-masol-cel="${id}" aria-label="${esc(cimke)} másolása" hidden>${ic('masol')}</button></div>`;
}

/** Alapérték egy propra: alapertek = { prop: érték } (az ELSŐ React-komponensre), { "Komponens.prop": érték } (a többire),
    vagy { Komponens: { prop: érték } }. */
function alapErtek(k, komp, prop) {
  const a = k.alapertek;
  if (!a || typeof a !== 'object') return undefined;
  if (`${komp}.${prop}` in a) return a[`${komp}.${prop}`];
  if (a[komp] && typeof a[komp] === 'object') return a[komp][prop];
  if ((k.react || [])[0] !== komp) return undefined;
  return a[prop] !== null && typeof a[prop] === 'object' ? undefined : a[prop];
}
/** adat_forras: { mezo: [fájl, …] } vagy [fájl, …] → létező fájlok (a nem létező hiba) */
function adatForrasok(k, mezo, hibak) {
  const af = k.adat_forras;
  const l = !af ? [] : Array.isArray(af) ? (mezo ? [] : af) : mezo ? [].concat(af[mezo] || []) : Object.values(af).flat();
  return l.filter(f => { const ok = typeof f === 'string' && /^[\w./-]+$/.test(f) && A.exists(f); if (!ok && hibak) hibak.push(`${KOMP_F}: ${k.id}.adat_forras${mezo ? '.' + mezo : ''}: nem létező fájl: ${f}`); return ok; });
}
const forrasSor = (k, mezo) => { const l = adatForrasok(k, mezo); return l.length ? `<p class="bb-kicsi bb-adatforras">Forrás: ${l.map(f => `<a href="https://github.com/hegebeeco/beeco-design-system/blob/main/${esc(f)}" rel="noopener"><code>${esc(f)}</code></a>`).join(', ')}</p>` : ''; };
/** A billentyűtérkép sora: ["Enter", "…"] · { billentyu, muvelet } · "Enter – …" */
function billSor(x) {
  if (Array.isArray(x)) return [String(x[0] || ''), String(x[1] || '')];
  if (x && typeof x === 'object') return [String(x.billentyu || x.billentyű || x.gomb || ''), String(x.muvelet || x.mit || x.leiras || '')];
  const m = String(x).match(/^(.+?)\s+[–-]\s+(.+)$/); return m ? [m[1], m[2]] : [String(x), ''];
}

// ---------- komponensoldal (Carbon: Irányelvek · Specifikáció · Kód · Hozzáférhetőség) ----------
const UJ_MEZOK = [['anatomia', 'annotált anatómia (részek és nevük)'], ['allapotok', 'változat × állapot mátrix'], ['a11y', 'ARIA-szerep és billentyűtérkép'],
  ['statusz', 'életciklus-státusz (stabil / béta / elavult)'], ['kapcsolodo', 'kapcsolódó komponensek'], ['alapertek', 'a propok alapértékei']];
const komp = id => KOMP.komponensek.find(x => x.id === id);

function komponensOldal(o, ctx) {
  const k = komp(o.komponens);
  if (!k) { ctx.hibak.push(`${ctx.oldal}: ismeretlen komponens: ${o.komponens}`); return { torzs: '' }; }
  for (const m of ['nev', 'leiras', 'minta_html']) if (!k[m]) ctx.hibak.push(`${ctx.oldal}: a komponensadatból hiányzik: ${m}`);
  if (k.statusz && !STATUSZOK.includes(k.statusz)) ctx.hibak.push(`${KOMP_F}: ${k.id}.statusz ${STATUSZOK.join('|')} legyen (most: ${k.statusz})`);
  const reactok = (k.react || []).map(n => [n, API.react[n]]);
  for (const [n, d] of reactok) if (!d) ctx.hibak.push(`${ctx.oldal}: a(z) ${n} nincs az api.json-ban`);
  const fo = (k.css || [])[0] ? k.css[0].split(' ')[0] : null;
  const rules = fo ? szabalyok(fo) : [];
  const tokenek = [...new Set(rules.flatMap(r => [...r.test.matchAll(/var\(--bc-([a-z0-9-]+)/g)].map(m => m[1])))];
  const hiany = UJ_MEZOK.filter(([m]) => k[m] == null || (Array.isArray(k[m]) && !k[m].length));
  if (!o.alcim) o.alcim = k.leiras;
  ctx.szint = 2;
  // Hiányzó mező: a helyén csak halvány „–” (data-hiany a szerkesztőnek és a --szigoru számlálónak); a nevük a fül tetején egy összegzőben
  const HFUL = { iranyelvek: 'specifikacio', specifikacio: 'specifikacio', kod: 'specifikacio', egyeb: 'specifikacio', a11y: 'hozzaferhetoseg' };
  const hianyok = { specifikacio: [], hozzaferhetoseg: [] };
  const hj = (mezo, mit, ful = 'specifikacio') => { const l = hianyok[HFUL[ful] || ful]; if (!l.some(x => x[0] === mezo)) l.push([mezo, mit]); return `<p class="bb-hiany-kicsi" data-hiany="${esc(mezo)}"><span aria-hidden="true">–</span><span class="bc-sr">Még hiányzik: ${esc(mit || mezo)}</span></p>`; };
  for (const [m, l] of hiany) if (m === 'statusz') hianyok.specifikacio.push([m, l]);
  const valtozatok = reactok.filter(([, d]) => d && d.props).map(([n, d]) => [n, Object.entries(d.props).filter(([, v]) => csakLiteral(v.t))]).filter(([, l]) => l.length);

  // Irányelvek
  const iranyelvek = `<h2 id="iranyelvek">Irányelvek</h2>
<div class="bb-mikor"><section aria-labelledby="mikor"><h3 id="mikor">Mikor használd</h3>${B.lista(k.mikor)}</section><section aria-labelledby="mikor-ne"><h3 id="mikor-ne">Mikor ne – és mit helyette</h3>${B.lista(k.mikor_ne)}</section></div>
<h3 id="valtozatok">Változatok</h3>
${valtozatok.map(([n, l]) => `<p><strong>${esc(n)}</strong> (React): ${l.map(([p, v]) => `<code>${esc(p)}</code>: ${literalok(v.t).map(x => `<code>${esc(x)}</code>`).join(' · ')}`).join('; ')}</p>`).join('')}
${(k.css || []).length ? `<p><strong>CSS-osztályok:</strong></p><ul class="bb-tokenek" role="list">${k.css.map(c => `<li><code>${esc(c)}</code></li>`).join('')}</ul>` : hj('css', 'CSS-osztályok')}
<h3 id="igy-es-ne-igy">Így és ne így</h3>
<div class="bb-dd-racs">${(k.do || []).map(d => B.ddFig(d, true, ctx)).join('')}${(k.dont || []).map(d => B.ddFig(d, false, ctx)).join('')}</div>
${(k.do || []).length && (k.dont || []).length ? '' : hj('do / dont', 'legalább egy képes Így és Ne így pár')}`;

  // Specifikáció
  const tokCsop = [], maradt = new Set(tokenek);
  for (const [cim, f] of TOKEN_CSOPORT) { const l = [...maradt].filter(f); l.forEach(t => maradt.delete(t)); if (l.length) tokCsop.push(`<p><strong>${esc(cim)}:</strong></p><ul class="bb-tokenek" role="list">${l.map(t => `<li><code>--bc-${esc(t)}</code></li>`).join('')}</ul>`); }
  const fajlok = [...new Set(rules.map(r => r.fajl))];
  const anat = Array.isArray(k.anatomia) && k.anatomia.length
    ? `<ol class="bb-anatomia">${k.anatomia.map(a => `<li><strong>${inl(a.resz || '')}</strong>${a.leiras ? ` – ${inl(a.leiras)}` : ''}</li>`).join('')}</ol>`
    : hj('anatomia', 'annotált rajz: a részek neve (felirat, piktogram, keret, árnyék) – készül');
  const allapot = Array.isArray(k.allapotok) && k.allapotok.length
    ? B.tabla(['Állapot', 'Megjelenés', 'Megjegyzés'], k.allapotok.map(a => [a.allapot || '', a.megjelenes || '', a.megjegyzes || '']), `${k.nev} – állapotok`)
    : hj('allapotok', 'a mátrix helye: változatonként alap, rámutatás, lenyomva, fókusz, tiltott, folyamatban');
  const specifikacio = `<h2 id="specifikacio">Specifikáció</h2>
<h3 id="anatomia">Anatómia</h3>${anat}${forrasSor(k, 'anatomia')}
<h3 id="valtozat-allapot">Változat × állapot</h3>${allapot}${forrasSor(k, 'allapotok')}
${(k.tesztlap || []).length ? `<p class="bb-kicsi">Minden állapot élőben: ${k.tesztlap.map(n => { ctx.ki.tesztlap(n); return `<a href="${TUKOR}/termek/tesztlapok/${esc(n)}.html">${esc((TESZT.find(t => t.nev === n) || { cim: n }).cim)} tesztlap</a>`; }).join(', ')}.</p>` : ''}
<h3 id="tokenek">Használt tokenek</h3>
${tokenek.length ? `<p class="bb-kicsi">A <code>.${esc(fo)}</code> szabályaiból kinyerve (${fajlok.map(f => `<code>${esc(f)}</code>`).join(', ')}; ${rules.length} szabály).</p>${tokCsop.join('')}` : hj('tokenek', 'a CSS-ből nem nyerhető ki')}`;

  // Kód
  const importok = reactok.filter(([, d]) => d).map(([n]) => n);
  const vanReact = PKG.exports && PKG.exports['./react'], vanCss = PKG.exports && PKG.exports['./termek.css'];
  const importKod = (vanReact && importok.length ? `import { ${importok.join(', ')} } from '${PKG.name}/react';\n` : '') + (vanCss ? `import '${PKG.name}/termek.css'; // egyszer, az alkalmazás belépőjében` : '');
  const vanAlap = !!k.alapertek;
  const kod = `<h2 id="kod">Kód</h2>
<h3 id="importut">Importút</h3>${vanReact ? kodBlokk(importKod, 'Import') : hj('exports ./react', 'a package.json-ban')}
<h3 id="jsx">JSX-példák</h3>${importok.length ? `<p class="bb-kicsi">Az <code>api/api.json</code> propjaiból generálva: minden változat és kapcsoló egy sorban. A „…” helyére a saját értéked kerül.</p>
${reactok.filter(([, d]) => d).map(([n, d]) => kodBlokk(jsxPelda(n, d).join('\n'), `${n} – JSX`)).join('')}` : `<p>Ennek az elemnek nincs React-komponense: a <code>bc-</code> osztályokkal, HTML-ben használd (lásd az élő mintát).</p>${kodBlokk(k.minta_html || '', `${k.nev} – HTML`)}`}
<h3 id="propok">Propok</h3>${forrasSor(k, 'alapertek')}
${vanAlap ? '' : hj('alapertek', 'a propok alapértékei', 'kod')}
${reactok.filter(([, d]) => d).map(([n, d]) => `<h4 id="propok-${A.slug(n)}">${esc(n)}</h4>${d.props && Object.keys(d.props).length
    ? B.tabla(vanAlap ? ['Prop', 'Típus', 'Kötelező', 'Alapérték'] : ['Prop', 'Típus', 'Kötelező'], Object.entries(d.props).map(([p, v]) => { const sor = [`\`${p}\``, `\`${v.t}\``, v.kotelezo ? 'igen' : 'nem']; if (vanAlap) { const a = alapErtek(k, n, p); sor.push(a === undefined ? '—' : `\`${typeof a === 'string' ? a : JSON.stringify(a)}\``); } return sor; }), `${n} propjai`)
    : hj('props', `${n}`)}${d.htmlAttr ? '<p class="bb-kicsi">A natív HTML-attribútumokat is továbbadja (<code>htmlAttr</code>).</p>' : ''}`).join('') || '<p class="bb-kicsi">Nincs React-prop: az elemet a CSS-osztályai vezérlik.</p>'}`;

  // Hozzáférhetőség
  const magassag = rules.flatMap(r => [...r.test.matchAll(/min-height\s*:\s*([^;]+)/g)].map(m => [`\`${r.sel.replace(/\s+/g, ' ')}\``, `\`${m[1].trim()}\``, `\`${r.fajl.replace('termek/css/', '')}:${r.sor}\``]));
  const fokusz = (A.read('termek/css/bc-base.css').match(/:where\(:focus-visible\)\s*\{[^}]*\}/) || [''])[0];
  const a = k.a11y || {};
  const a11y = `<h2 id="hozzaferhetoseg">Hozzáférhetőség</h2>
<h3 id="aria">ARIA-szerep</h3>${a.szerep ? `<p>${inl(a.szerep)}</p>` : hj('a11y.szerep', 'ARIA-szerep: a natív elem és a szükséges ARIA-attribútumok', 'a11y')}
<h3 id="billentyuk">Billentyűtérkép</h3>${Array.isArray(a.billentyuk) && a.billentyuk.length ? B.tabla(['Billentyű', 'Mit csinál'], a.billentyuk.map(billSor), 'Billentyűk') : hj('a11y.billentyuk', 'billentyű → művelet táblázat', 'a11y')}
${a.megjegyzes ? `<p>${inl(a.megjegyzes)}</p>` : ''}${forrasSor(k, 'a11y')}
<h3 id="erintes">Érintési méret (a CSS-ből)</h3>${magassag.length ? B.tabla(['Szabály', 'min-height', 'Hol'], magassag, 'Legkisebb magasság') + `<p class="bb-kicsi"><code>--bc-tap</code> = ${A.json('tokens/core.json').tap} px (<code>tokens/core.json</code>).</p>` : hj('min-height', 'legkisebb magasság a CSS-ben', 'a11y')}
<h3 id="fokusz">Fókusz</h3>${fokusz ? `<p class="bb-kicsi">A közös alap (<code>termek/css/bc-base.css</code>) minden elemre ad látható fókuszkeretet:</p>${kodBlokk(fokusz, 'Fókusz-szabály')}` : hj('focus-visible', 'fókusz-szabály', 'a11y')}`;

  const fulek = [['iranyelvek', 'Irányelvek', iranyelvek], ['specifikacio', 'Specifikáció', specifikacio], ['kod', 'Kód', kod], ['hozzaferhetoseg', 'Hozzáférhetőség', a11y]];
  const kapcs = Array.isArray(k.kapcsolodo) && k.kapcsolodo.length
    ? `<ul class="bb-tagek" role="list">${k.kapcsolodo.map(x => { const r = komp(x); if (!r) ctx.hibak.push(`${KOMP_F}: ${k.id}.kapcsolodo: ismeretlen elem: ${x}`); return r ? `<li><a href="${esc(kSlug(r.id))}.html">${esc(r.nev)}</a></li>` : `<li>${esc(x)}</li>`; }).join('')}</ul>`
    : hj('kapcsolodo', 'a rokon komponensek listája');
  const teszt = (k.tesztlap || []).length ? `<ul class="bb-tesztlap-lista" role="list">${k.tesztlap.map(n => { const t = TESZT.find(x => x.nev === n); if (!t) ctx.hibak.push(`${ctx.oldal}: ismeretlen tesztlap: ${n}`); ctx.ki.tesztlap(n); return `<li><a href="${TUKOR}/termek/tesztlapok/${esc(n)}.html">${esc(t ? t.cim : n)}${ic('tovabb')}</a><span class="bb-kicsi"> – ${esc(t ? t.leiras : '')}</span></li>`; }).join('')}</ul>` : hj('tesztlap', 'élő tesztlap');
  const osszegzo = ful => { const l = hianyok[ful]; return l.length ? `<p class="bb-hiany-osszeg"><span class="bc-badge is-muted">Még hiányzik ezen az oldalon</span> ${l.map(([m, t]) => `<span class="bb-hiany-nev" data-mezo="${esc(m)}">${esc(t || m)}</span>`).join(' · ')}</p>` : ''; };
  const elotag = id => (id === 'specifikacio' || id === 'hozzaferhetoseg') ? osszegzo(id) : '';
  const kat = ctx.navKategoriaOf ? ctx.navKategoriaOf[kSlug(k.id)] : null;
  const torzs = `<dl class="bb-komp-meta">${kat ? `<div><dt>Kategória</dt><dd><a href="${esc(kat.slug)}.html">${esc(kat.cim)}</a></dd></div>` : ''}${(k.react || []).length ? `<div><dt>React</dt><dd>${k.react.map(x => `<code>${esc(x)}</code>`).join('')}</dd></div>` : ''}<div><dt>Szint</dt><dd>${esc((KOMP.szintek.find(s => s.id === k.szint) || { nev: k.szint }).nev)}</dd></div><div><dt>Életciklus</dt><dd>${k.statusz ? B.statuszJelveny(k.statusz) : '<span class="bc-badge is-muted">Státusz: nincs döntés</span>'}</dd></div></dl>
<section class="bb-demo" aria-labelledby="elo-minta"><p class="bb-demo-cim" id="elo-minta">Élő minta</p>${B.htmlEllenor(k.minta_html || '', ctx, 'minta_html')}</section>
<div class="bb-fulek" data-fulek>
<div class="bb-fulsor" role="tablist" aria-label="${esc(k.nev)} – dokumentáció" hidden>${fulek.map(([id, cim], i) => `<button type="button" class="bb-ful" role="tab" id="ful-${id}" aria-controls="panel-${id}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''}>${cim}</button>`).join('')}</div>
${fulek.map(([id, , t]) => `<section class="bb-panel" id="panel-${id}" data-ful="ful-${id}">${t.replace(/^(<h2[^>]*>[\s\S]*?<\/h2>)/, m => m + elotag(id))}</section>`).join('\n')}
</div>
<h2 id="kapcsolodo">Kapcsolódó</h2>${kapcs}${forrasSor(k, 'kapcsolodo')}
<h3 id="tesztlapok">Tesztlapok</h3>${teszt}
${B.forrasLista(k.forras)}`;

  // keresőindex: változatok és propok külön tételként (a találatnál a szakasz neve látszik)
  const kereso = [];
  if (valtozatok.length || (k.css || []).length) kereso.push({ h: 'Irányelvek › Változatok', id: 'valtozatok', x: [...valtozatok.map(([n, l]) => `${n}: ${l.map(([p, v]) => `${p} = ${literalok(v.t).join(' | ')}`).join('; ')}`), ...(k.css || [])].join(' · ') });
  for (const [n, d] of reactok) if (d && d.props && Object.keys(d.props).length) kereso.push({ h: `Kód › Propok › ${n}`, id: `propok-${A.slug(n)}`, x: Object.entries(d.props).map(([p, v]) => `${p}: ${v.t}`).join(' · ') });
  const adatForras = [...new Set(adatForrasok(k, null, ctx.hibak))];
  return { torzs, extraForras: [KOMP_F, 'api/api.json', ...adatForras.filter(f => f !== KOMP_F)], kereso,
    kulcsszavak: [...(k.react || []), ...(k.css || []), ...reactok.flatMap(([, d]) => Object.keys((d && d.props) || {}))].join(' ') };
}

/** Kategóriaoldal: leírás + az elemek kártyái (név, szint, leírás, státusz) – a sorrend a kategóriafájlé. */
function kategoriaOldal(o, ctx) {
  const c = o.kategoria;
  ctx.szint = 1;
  const kartyak = `<ul class="bb-kartyak is-komp" role="list">${c.elemek.map(e => { const k = komp(e); return `<li><div class="bb-kartya"><p class="bb-kartya-nev"><a href="${esc(kSlug(k.id))}.html">${esc(k.nev)}</a></p><p class="bb-kicsi">${esc((KOMP.szintek.find(s => s.id === k.szint) || { nev: k.szint }).nev)}${k.statusz ? ` · ${esc(k.statusz)}` : ''}${(k.react || []).length ? ` · <code>${esc(k.react[0])}</code>` : ''}</p><p>${inl(k.leiras)}</p></div></li>`; }).join('')}</ul>`;
  const elo = (o.blokkok || []).length ? B.blokkok(o.blokkok, ctx) : '';
  return { torzs: `${elo}<h2 id="elemek">${c.elemek.length} elem ebben a kategóriában</h2>${kartyak}`, extraForras: [A.exists(KAT_F) ? KAT_F : KOMP_F] };
}

/** Komponens-katalógus gen-blokk (DS „Komponensek” áttekintő): kategóriánként az elemek linkjei, a számok adatból. */
function katalogusGen(b, ctx) {
  const kat = kategoriak(ctx.hibak);
  const L = Math.min(Math.max(ctx.szint + 1, 2), 4);
  return `<p>${KOMP.komponensek.length} dokumentált elem ${kat.lista.length} kategóriában.</p>` + kat.lista.map(c => {
    const id = B.egyediId(ctx, `katalogus-${c.id}`);
    return `<section class="bb-katalogus" aria-labelledby="${id}"><h${L} id="${id}"><a href="${esc(katSlug(c.id))}.html">${esc(c.nev)}</a> <span class="bc-badge is-muted">${c.elemek.length}</span></h${L}>${c.leiras ? `<p class="bb-kicsi">${inl(c.leiras)}</p>` : ''}<ul class="bb-tagek" role="list">${c.elemek.map(e => `<li><a href="${esc(kSlug(e))}.html">${esc(komp(e).nev)}</a></li>`).join('')}</ul></section>`;
  }).join('');
}

module.exports = { kSlug, navAtalakit, komponensOldal, kategoriaOldal, katalogusGen, kategoriak, katSlug, KOMP, KOMP_F, KAT_F, TESZT };
