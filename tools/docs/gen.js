/* ============================================================
   beeco docs – a „gen” blokkok (generált tartalom) a kivezetett régi brandbook-építő (+ bbweb) összes
   generátorából, VÁLTOZATLAN névvel: a régi tartalomfájlok blokkja ({ "t": "gen", "nev": "…" }) átmásolható.

   Minden generátor { oldal, fn, miert }: oldal = 'brand' | 'ds' | '*'. Ha a blokk a rossz oldalon áll, az építő hibát ad
   (pl. a komponens-katalógus és a felületi mátrix csak a Design Systemben, a logó, a madárkészlet és a hangszerepek csak a
   Brand Bookban). A Brand Book szövege köznapi („termék-stílus”, „játék-stílus”); a „bőr” szó csak a DS-generátorokban áll.

   A generátorok nem írnak közvetlenül a kimenetbe: a ctx.ki gyűjtőbe tesznek (CSS-szabály, fájl, másolás, „repo/” tükör),
   a motor ezt a kimenet törlése UTÁN írja ki. Nyers szín nincs: a minták var(--bc-…) tokenekkel színeznek; a madárkák
   saját (illusztrációs) színei SVG-attribútumként jelennek meg, nem CSS-ben.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const A = require('./alap');
const B = require('./blokk');
const { esc, inl, ic, ROOT } = A;
const kSlug = id => require('./komponens').kSlug(id);

const core = A.json('tokens/core.json');
const termek = A.json('tokens/theme-termek.json');
const hangnem = A.json('tokens/hangnem.json');
const VERSION = A.read('VERSION').trim();
const KOMP = A.json('brandbook/elemek/komponensek.json');
const TESZT = A.json('termek/tesztlapok/lista.json');
const BB = path.join(ROOT, 'brandbook');
const opt = f => (fs.existsSync(path.join(ROOT, f)) ? A.json(f) : null);
const SABLON = opt('brandbook/sablonok/sablonok.json') || { csomagok: {}, sablonok: [] };
const KEPERNYOK = (opt('brandbook/kepernyok/kepernyok.json') || { kepernyok: [] }).kepernyok;
const ILLU = opt('brandbook/illusztraciok/keszlet.json') || { madarkak: [], v4: [], anim: [] };
const SORREND = ['admin', 'partner', 'app', 'kaptar', 'web', 'jatek'];
const FELULETEK = SORREND.map(id => opt(`brandbook/feluletek/${id}.json`)).filter(Boolean);
const TUKOR = 'repo';   // a repó fájljai a kimenetben a saját relatív helyükön: repo/termek/css, repo/dist/css, repo/web/…
const hex = n => (core.color[n] || '').toUpperCase();
const kb = rel => { const p = path.join(ROOT, rel); return fs.existsSync(p) ? Math.max(1, Math.round(fs.statSync(p).size / 1024)) : null; };

// ---------- címsor a környezet szintjéhez (a generátor nem ugrik szintet) ----------
/** A generátor első címszintje: a legutóbbi címsor alatt; h1 alatt h2. */
const alapSzint = ctx => Math.min(Math.max(ctx.szint + 1, 2), 4);
function hx(ctx, szint, szoveg, alapId, cls) {
  const sz = Math.min(szint, 6);
  const id = B.egyediId(ctx, alapId || String(szoveg).replace(/[`*]/g, ''));
  return `<h${sz} id="${esc(id)}"${cls ? ` class="${cls}"` : ''}>${inl(szoveg)}</h${sz}>`;
}

// ---------- színek ----------
const SZINCSALAD = [
  ['Méz', ['honey', 'honey-deep', 'butter']],
  ['Krém és papír', ['cream', 'paper', 'white']],
  ['Zöldek', ['olive', 'olive-strong', 'olive-soft', 'forest', 'leaf', 'lime', 'sage', 'sage-bg', 'sprout']],
  ['Meleg színek', ['blossom', 'blossom-bg', 'berry', 'red', 'crimson', 'blush', 'ember', 'rust']],
  ['Hideg színek', ['sky', 'sky-bg', 'ice', 'water', 'navy', 'focus']],
  ['Semlegesek', ['black', 'coal', 'graphite', 'slate', 'silver', 'mist']],
  ['Éjszaka (sötét mód)', ['night', 'night-surface', 'night-line']],
];
const NEV_HU = { honey: 'méz', 'honey-deep': 'nyomott méz', butter: 'vaj', cream: 'krém', paper: 'papír', white: 'fehér', olive: 'olíva', poppy: 'pipacs', 'olive-strong': 'erős olíva',
  'olive-soft': 'halvány olíva', forest: 'erdő', leaf: 'levél', lime: 'lime', sage: 'zsálya', 'sage-bg': 'halvány zsálya', sprout: 'hajtás', blossom: 'rózsa',
  'blossom-bg': 'halvány rózsa', berry: 'bogyó', red: 'piros', crimson: 'bíbor', blush: 'pirosas', ember: 'parázs', rust: 'rozsda', sky: 'égkék', 'sky-bg': 'halvány égkék',
  ice: 'jég', water: 'víz', navy: 'mélykék', focus: 'fókuszkék', black: 'fekete', coal: 'szén', graphite: 'grafit', slate: 'pala', silver: 'ezüst', mist: 'köd',
  night: 'éjszaka', 'night-surface': 'éjszakai felület', 'night-line': 'éjszakai vonal' };
function swatch(n, ctx) {
  ctx.ki.css.add(`.bb-sw-c[data-c="${n}"] { background: var(--bc-${n}); }`);
  return `<li class="bb-sw"><span class="bb-sw-c" data-c="${esc(n)}"></span><span class="bb-sw-t"><strong>${esc(NEV_HU[n] || n)}</strong><code>--bc-${esc(n)}</code><button type="button" class="bb-masol-szin" data-masol="${hex(n)}" aria-label="${esc((NEV_HU[n] || n) + ' színkód másolása: ' + hex(n))}"><code>${hex(n)}</code>${ic('masol')}</button></span></li>`;
}
/** Kis színminta egy CSS-szerephez (a szerep a tokenből; a docs-CSS-ben nincs nyers szín). */
function szerepMinta(r, ctx) {
  ctx.ki.css.add(`.bb-sw-c[data-r="${r}"] { background: var(--bc-${r});${r === 'accent' ? ' color: var(--bc-on-accent);' : ''} }`);
  return `<span class="bb-sw-c is-kicsi" data-r="${esc(r)}" aria-hidden="true"></span>`;
}

// ---------- élő minták (iframe: a bőrök ne keveredjenek) ----------
const MINTA_ASSET = 'assets/minta';
function mintaAlap(ctx) {
  if (ctx.ki.megvan('minta-alap')) return;
  ctx.ki.masol('brandbook/css/minta.css', `${MINTA_ASSET}/minta.css`);
  ctx.ki.masol('brandbook/js/minta.js', `${MINTA_ASSET}/minta.js`);
}
/** A régi Brand Book relatív útvonalai (../ds/…, ../bb/…) az új kimenetben: ../repo/…, ../assets/minta/… */
const atir = h => String(h).replace(/(["'(])\.\.\/ds\//g, `$1../${TUKOR}/`).replace(/(["'(])\.\.\/bb\//g, `$1../${MINTA_ASSET}/`);
function mintaKeret(f, felirat) {
  if (!f) return '';
  return `<figure class="bb-minta"><iframe src="minta/${esc(f.id)}.html" title="${esc(f.nev)} – élő minta: gomb, kártya, mező" loading="lazy" data-minta="${esc(f.id)}"></iframe><figcaption><strong>${esc(felirat || f.nev)}</strong>${f.minta && f.minta.utanzat ? ' <span class="bc-badge is-muted">forrásból utánozva</span>' : ''}</figcaption></figure>`;
}
/** A felület kis élő mintája külön HTML-ben (minta/<id>.html): termék = bc-all.css, játék = web/css, a többi a felmért értékekből. */
function mintaOldal(f, ctx) {
  if (!f || ctx.ki.megvan(`minta-${f.id}`)) return;
  mintaAlap(ctx);
  const m = f.minta || {};
  const head = t => `<!doctype html><html lang="hu" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(f.nev)} – minta</title>${t}<script src="../${MINTA_ASSET}/minta.js"></script></head>`;
  const tartalomHtml = (cls) => `<main class="${cls.wrap}"><div class="${cls.row}"><button type="button" class="${cls.btn}">${esc(m.gomb || 'Mentés')}</button><button type="button" class="${cls.btn2}">Mégse</button></div><div class="${cls.card}"><p class="${cls.cardTitle}">${esc(m.kartya || 'Közösségi kert')}</p><p class="${cls.cardText}">${esc(m.kartyaSzoveg || 'Kert utca 12. · ma nyitva')}</p></div><label class="${cls.label}" for="m">Név</label><input class="${cls.input}" id="m" value="Méhecske"></main>`;
  let html;
  if (m.tipus === 'termek') {
    ctx.ki.tukor('termek/css'); ctx.ki.tukor('dist/css'); ctx.ki.tukor('web/assets/fonts');
    html = head(`<link rel="stylesheet" href="../${TUKOR}/termek/css/bc-all.css"><link rel="stylesheet" href="../${MINTA_ASSET}/minta.css">`) + `<body class="mt-termek${m.suru ? ' is-suru' : ''}">` + tartalomHtml({ wrap: 'mt-wrap', row: 'mt-row', btn: `bc-btn${m.suru ? ' is-sm' : ''}`, btn2: `bc-btn is-secondary${m.suru ? ' is-sm' : ''}`, card: 'bc-card mt-card', cardTitle: 'bc-card-title', cardText: 'bc-muted', label: 'bc-label', input: 'bc-input' }) + '</body></html>';
  } else if (m.tipus === 'jatek') {
    ctx.ki.tukor('web/css'); ctx.ki.tukor('web/assets/fonts');
    html = head(`<link rel="stylesheet" href="../${TUKOR}/web/css/fonts.css"><link rel="stylesheet" href="../${TUKOR}/web/css/tokens.css"><link rel="stylesheet" href="../${TUKOR}/web/css/ds.css"><link rel="stylesheet" href="../${MINTA_ASSET}/minta.css">`) + '<body class="mt-jatek">' + tartalomHtml({ wrap: 'mt-wrap', row: 'mt-row', btn: 'ds-btn', btn2: 'ds-btn is-secondary', card: 'ds-card mt-card', cardTitle: 'mt-cim', cardText: 'mt-halk', label: 'mt-label', input: 'mt-input' }) + '</body></html>';
  } else {
    // forrásból utánozva: a felmért értékekből generált, saját osztályú CSS (a felület SAJÁT értékei, nem DS-tokenek – összevetéshez)
    ctx.ki.tukor('dist/css'); ctx.ki.tukor('web/assets/fonts');
    const v = m.ertekek || {};
    for (const k of ['bg', 'ink', 'surface', 'line', 'btnBg', 'btnInk', 'radius']) if (!v[k]) ctx.hibak.push(`minta ${f.id}: hiányzó érték: ${k}`);
    ctx.ki.fajl(`minta/${f.id}.css`, `/* GENERÁLT – ${f.nev} mintája a forrásában talált értékekből (${((f.felmeres && f.felmeres.forras) || []).join(', ')}). Nem DS-token: összevetéshez. */
@import url("../${TUKOR}/dist/css/beeco-fonts.css");
:root { color-scheme: light; }
body { margin: 0; background: ${v.bg}; color: ${v.ink}; font-family: 'Open Sans', system-ui, sans-serif; }
:root[data-theme="dark"] body { background: ${v.bgDark || v.bg}; color: ${v.inkDark || v.ink}; }
.mu-btn { min-height: 44px; padding: 0 18px; font: ${v.btnFont || '600 14px/1 "Open Sans", sans-serif'}; color: ${v.btnInk}; background: ${v.btnBg}; border: ${v.btnBorder || 'none'}; border-radius: ${v.radius}; box-shadow: ${v.btnShadow || 'none'}; cursor: pointer; }
.mu-btn2 { min-height: 44px; padding: 0 18px; font: 600 14px/1 "Open Sans", sans-serif; color: ${v.ink}; background: ${v.surface}; border: ${v.btn2Border || '1px solid ' + v.line}; border-radius: ${v.radius}; box-shadow: ${v.btn2Shadow || 'none'}; cursor: pointer; }
:root[data-theme="dark"] .mu-btn2 { color: ${v.inkDark || v.ink}; background: ${v.surfaceDark || v.surface}; }
.mu-card { padding: 14px 16px; background: ${v.surface}; border: ${v.cardBorder || '1px solid ' + v.line}; border-radius: ${v.cardRadius || v.radius}; box-shadow: ${v.cardShadow || 'none'}; }
:root[data-theme="dark"] .mu-card { background: ${v.surfaceDark || v.surface}; border-color: ${v.lineDark || v.line}; }
.mu-cim { margin: 0 0 4px; font: 400 20px/1.15 Lalezar, sans-serif; }
.mu-halk { margin: 0; font-size: 14px; opacity: .8; }
.mu-label { display: block; margin: 12px 0 4px; font-size: 14px; font-weight: 700; }
.mu-input { box-sizing: border-box; width: 100%; min-height: 44px; padding: 0 12px; font: 400 16px "Open Sans", sans-serif; color: inherit; background: ${v.surface}; border: ${v.inputBorder || '1px solid ' + v.line}; border-radius: ${v.inputRadius || v.radius}; }
:root[data-theme="dark"] .mu-input { background: ${v.surfaceDark || v.surface}; border-color: ${v.lineDark || v.line}; }
`);
    html = head(`<link rel="stylesheet" href="${esc(f.id)}.css"><link rel="stylesheet" href="../${MINTA_ASSET}/minta.css">`) + `<body class="mt-utanzat${m.nincsSotet ? ' nincs-sotet' : ''}">` + tartalomHtml({ wrap: 'mt-wrap', row: 'mt-row', btn: 'mu-btn', btn2: 'mu-btn2', card: 'mu-card mt-card', cardTitle: 'mu-cim', cardText: 'mu-halk', label: 'mu-label', input: 'mu-input' }) + '</body></html>';
  }
  ctx.ki.fajl(`minta/${f.id}.html`, html);
}
const felulet = id => FELULETEK.find(f => f.id === id);

// ---------- felületek (DS) ----------
const JEL = { kozos: ['●', 'közös'], reszben: ['◐', 'részben'], elter: ['✗', 'eltér'], nincs: ['—', 'nem értelmezhető'] };
const jel = j => { const [s, t] = JEL[j] || JEL.nincs; return `<span class="bb-jel is-${j || 'nincs'}" aria-hidden="true">${s}</span><span class="bc-sr">${t}: </span>`; };
const MATRIX_SOR = { mez: 'Méz-szín', tinta: 'Tinta és vonal', hatter: 'Háttér', sarok: 'Sarok', arnyek: 'Árnyék', betu: 'Betű', sotet: 'Sötét mód', suruseg: 'Sűrűség', ds: 'Kapcsolat a DS-sel', technika: 'Technika' };
/** Egy felület ikonikus képernyői (kepernyok.json), kapcsolható DS-jelölésekkel – a képernyők a repó saját HTML-jei. */
function kepernyoResz(fid, ctx, L) {
  const l = KEPERNYOK.filter(k => k.felulet === fid);
  if (!l.length) return '';
  if (!ctx.ki.megvan('kepernyok')) {
    mintaAlap(ctx); ctx.ki.tukor('termek/css'); ctx.ki.tukor('dist/css'); ctx.ki.tukor('web/assets/fonts'); ctx.ki.tukor('web/assets/brand');
    ctx.ki.masol('brandbook/css/kepernyo.css', `${MINTA_ASSET}/kepernyo.css`);
    ctx.ki.masol('brandbook/kepernyok', 'kepernyok', { szuro: f => !/kepernyok\.json$|[\\/]src([\\/]|$)/.test(f), atir });
  }
  return hx(ctx, L, 'Ikonikus képernyők', `${fid}-kepernyok`) + `<p>A képernyők a design system elemeiből épülnek. A <strong>DS-jelölések</strong> gombbal megmutatod, melyik rész melyik elem – a számok a lista sorai.</p>` + l.map(k => {
    const src = k.url || `kepernyok/${k.file}`;
    if (!k.url && !fs.existsSync(path.join(BB, 'kepernyok', k.file))) ctx.hibak.push(`képernyő ${k.id}: hiányzik a fájl: ${k.file}`);
    const cid = B.egyediId(ctx, `kep-${k.id}`);
    return `<section class="bb-kepernyo" aria-labelledby="${cid}"><h${Math.min(L + 1, 6)} id="${cid}">${esc(k.cim)}</h${Math.min(L + 1, 6)}><p>${inl(k.leiras || '')}</p>
<div class="bb-kepernyo-sor"><div class="bb-eszkoz is-${esc(k.eszkoz || 'asztal')}"><iframe src="${esc(src)}" title="${esc(k.cim)}" loading="lazy" data-kepernyo${k.url ? ' data-kulso' : ''} referrerpolicy="origin"></iframe></div>
<div class="bb-kepernyo-info">${k.url ? `<p class="bb-kicsi">Élő, kattintható – a valódi felület. <a href="${esc(k.url.replace(/[?&]keret=1/, ''))}" rel="noopener">Megnyitás külön lapon</a></p>` : '<button type="button" class="bc-btn is-secondary" data-jelolo aria-pressed="false" hidden>DS-jelölések mutatása</button>'}
<ol class="bb-jelek">${(k.jelek || []).map(j => `<li value="${Number(j.n) || 1}"><strong>${inl(j.nev)}</strong>${j.megj ? ` – ${inl(j.megj)}` : ''}</li>`).join('')}</ol>
${(k.hatas || []).length ? `<p class="bb-kicsi"><strong>A DS hatása:</strong></p><ul class="bb-list">${k.hatas.map(x => `<li>${inl(x)}</li>`).join('')}</ul>` : ''}</div></div></section>`;
  }).join('');
}

// ---------- komponensek (DS) ----------
const SZINT_SORREND = ['atom', 'molekula', 'organizmus', 'sablon'];
const szintNev = id => (KOMP.szintek.find(x => x.id === id) || { nev: id }).nev;
function tesztlapLink(n, ctx) {
  const t = TESZT.find(x => x.nev === n);
  if (!t) { ctx.hibak.push(`${ctx.oldal}: ismeretlen tesztlap: ${n}`); return ''; }
  ctx.ki.tesztlap(n);
  return `<li><a href="${TUKOR}/termek/tesztlapok/${esc(n)}.html"><strong>${esc(t.cim)}</strong><span>${esc(t.leiras || '')}</span></a></li>`;
}

// ---------- illusztrációk (Brand) ----------
const illuFeny = c => { const n = parseInt(c.slice(1), 16); return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255); };
function illuAlap(ctx) {
  if (ctx.ki.megvan('illusztraciok')) return;
  if (fs.existsSync(path.join(BB, 'illusztraciok'))) ctx.ki.masol('brandbook/illusztraciok', 'illusztraciok', { szuro: f => !/keszlet\.json$/.test(f) });
}
function illuKep(x, ctx) {
  if (!fs.existsSync(path.join(BB, 'illusztraciok', x.file))) ctx.hibak.push(`illusztraciok: hiányzó v4 rajz: ${x.file}`);
  return `<figure class="bb-illu-kartya"><div class="bb-illu-szinpad"><img src="illusztraciok/${esc(x.file)}" alt="${esc(x.faj)} – ${esc(x.poz)} (v4 madárrajz)" width="${x.w}" height="${x.h}" loading="lazy"></div><figcaption><strong>${esc(x.faj)}</strong> <span class="bb-kicsi">${esc(x.poz)}</span></figcaption></figure>`;
}
/** A madárka saját színei – SVG-attribútumként (illusztrációs szín, nem UI-token; a CSS-be nem kerül nyers szín). */
const illuSor = (nev, szinek) => `<svg class="bb-illu-sor" viewBox="0 0 ${szinek.length * 24} 20" role="img" aria-label="${esc(nev)} színei, sötéttől világosig: ${esc(szinek.join(', '))}">${szinek.map((c, i) => `<rect x="${i * 24 + 1}" y="1" width="20" height="18" rx="3" fill="${c}" class="bb-illu-sw"/>`).join('')}</svg>`;

// ---------- letöltések ----------
function letoltSor(href, nev, le, ctx, src, letolt = true) {
  const k = src ? kb(src) : null;
  if (src && k === null) ctx.hibak.push(`${ctx.oldal}: hiányzó letölthető fájl: ${src}`);
  return `<li><a class="bc-btn is-secondary" href="${esc(href)}"${letolt ? ' download' : ' rel="noopener"'}>${ic(letolt ? 'letolt' : 'tovabb')}${esc(nev)}</a><span>${esc(le)}${k ? ` · ${k} KB` : ''}</span></li>`;
}
const LETOLT_BRAND = [
  ['Logó', [['logo.webp', 'web/assets/brand/logo.webp', 'világos háttérre'], ['logo-sotet.webp', 'web/assets/brand/logo-sotet.webp', 'sötét háttérre'], ['ikon-512.png', 'web/assets/brand/ikon-512.png', 'app- és profilkép']]],
  ['Méhecskék', [['bee-happy.webp', 'web/assets/brand/bee-happy.webp', 'házigazda'], ['bee-cheer.webp', 'web/assets/brand/bee-cheer.webp', 'szurkoló'], ['bee-super.webp', 'web/assets/brand/bee-super.webp', 'futár'], ['bee-phone.webp', 'web/assets/brand/bee-phone.webp', 'hírvivő']]],
  ['Betűk', [['Lalezar (woff2)', 'web/assets/fonts/lalezar-latin-ext.woff2', 'címbetű – SIL Open Font License 1.1'], ['Open Sans (woff2)', 'web/assets/fonts/opensans-latin-ext.woff2', 'szövegbetű – SIL Open Font License 1.1']]],
];
const LETOLT_DS = [
  ['Tokenek', [['beeco-tokens.css', 'dist/css/beeco-tokens.css', 'CSS-változók (web)'], ['tokens.json', 'dist/tokens.json', 'minden érték, gépi formában'], ['webflow-valtozok.json', 'dist/weboldal/webflow-valtozok.json', 'Webflow-változók'], ['beeco_tokens.dart', 'dist/dart/beeco_tokens.dart', 'Flutter (mobil app)'], ['preset.cjs', 'dist/tailwind/preset.cjs', 'Tailwind-preset (partner)'], ['_beeco.scss', 'dist/scss/_beeco.scss', 'SCSS (admin)']]],
  ['Betűk', [['Lalezar (woff2)', 'web/assets/fonts/lalezar-latin-ext.woff2', 'SIL Open Font License 1.1'], ['beeco-fonts.css', 'dist/css/beeco-fonts.css', 'betűbetöltő']]],
];

// ---------- sablonok (Brand): másolás tokenértékekkel, ZIP-csomag ----------
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); }
  return (c ^ 0xFFFFFFFF) >>> 0;
}
/** Egyszerű, determinisztikus ZIP (deflate, rögzített dátum) – csak a Node beépített zlib-jével. */
function zip(bejegyzesek) {
  const zlib = require('zlib');
  const DATUM = ((2026 - 1980) << 9) | (1 << 5) | 1, IDO = 0;
  const reszek = [], kozponti = []; let hely = 0;
  for (const [nev, adat] of bejegyzesek) {
    const n = Buffer.from(nev, 'utf8'), tomor = zlib.deflateRawSync(adat, { level: 9 }), crc = crc32(adat);
    const fej = Buffer.alloc(30); fej.writeUInt32LE(0x04034b50, 0); fej.writeUInt16LE(20, 4); fej.writeUInt16LE(0x0800, 6); fej.writeUInt16LE(8, 8);
    fej.writeUInt16LE(IDO, 10); fej.writeUInt16LE(DATUM, 12); fej.writeUInt32LE(crc, 14); fej.writeUInt32LE(tomor.length, 18); fej.writeUInt32LE(adat.length, 22); fej.writeUInt16LE(n.length, 26);
    const kf = Buffer.alloc(46); kf.writeUInt32LE(0x02014b50, 0); kf.writeUInt16LE(20, 4); kf.writeUInt16LE(20, 6); kf.writeUInt16LE(0x0800, 8); kf.writeUInt16LE(8, 10);
    kf.writeUInt16LE(IDO, 12); kf.writeUInt16LE(DATUM, 14); kf.writeUInt32LE(crc, 16); kf.writeUInt32LE(tomor.length, 20); kf.writeUInt32LE(adat.length, 24); kf.writeUInt16LE(n.length, 28); kf.writeUInt32LE(hely, 42);
    reszek.push(fej, n, tomor); kozponti.push(kf, n); hely += 30 + n.length + tomor.length;
  }
  const kd = Buffer.concat(kozponti), veg = Buffer.alloc(22);
  veg.writeUInt32LE(0x06054b50, 0); veg.writeUInt16LE(bejegyzesek.length, 8); veg.writeUInt16LE(bejegyzesek.length, 10); veg.writeUInt32LE(kd.length, 12); veg.writeUInt32LE(hely, 16);
  return Buffer.concat([...reszek, kd, veg]);
}
/** A sablonok (brandbook/sablonok) a kimenetbe: {{hex:…}} és {{verzio}} kitöltve; a ZIP-ek a repó szerinti (ds/…) szerkezettel. */
function sablonAlap(ctx) {
  if (ctx.ki.megvan('sablonok')) return;
  const src = path.join(BB, 'sablonok');
  if (!fs.existsSync(src)) { ctx.hibak.push('sablonok: hiányzik a brandbook/sablonok mappa'); return; }
  const tiltott = hangnem.tiltott_kepek || [];
  const kitoltott = {};
  for (const f of fs.readdirSync(src).filter(f => /\.(html|css|js)$/.test(f))) {
    let t = fs.readFileSync(path.join(src, f), 'utf8');
    if (f.endsWith('.html')) t = t.replace(/\{\{hex:([a-z-]+)\}\}/g, (m, n) => { if (!core.color[n]) { ctx.hibak.push(`sablonok/${f}: ismeretlen szín: ${n}`); return m; } return hex(n); }).replace(/\{\{verzio\}\}/g, esc(VERSION));
    if (/\{\{/.test(t)) ctx.hibak.push(`sablonok/${f}: kitöltetlen {{…}} jelölő`);
    kitoltott[f] = t;
    ctx.ki.fajl(`sablonok/${f}`, f.endsWith('.html') ? atir(t) : t);
  }
  // a sablonok a ../repo/ alatt keresik a tokeneket, a betűket és a képeket
  ctx.ki.tukor('dist/css/beeco-tokens.css'); ctx.ki.tukor('dist/css/beeco-fonts.css'); ctx.ki.tukor('web/assets/fonts');
  for (const k of new Set(Object.values(SABLON.csomagok).flatMap(c => c.kepek).concat(['logo', 'logo-sotet']))) ctx.ki.tukor(`web/assets/brand/${k}.webp`);
  const r = rel => fs.readFileSync(path.join(ROOT, rel));
  for (const [id, c] of Object.entries(SABLON.csomagok)) {
    const m = c.mappa, fajlok = [...new Set(SABLON.sablonok.filter(s => s.csoport === id).map(s => s.file))];
    const sor = [
      [`${m}/OLVASS-EL.txt`, Buffer.from(`beeco – ${c.cim} (design system v${VERSION})\r\n\r\n`
        + `1. Csomagold ki a mappát, és nyisd meg a sablonok/ alatti HTML-fájlt Chrome-ban vagy Edge-ben.\r\n`
        + `2. Kattints a szövegre, és írd át. A szövegek mintaszövegek${id === 'partner' ? ' – a partneri sablonok helyőrzők („Minta – korrigálandó”), a végleges változatot a beeco adja' : ''}.\r\n`
        + `3. Mentés: Nyomtatás → Mentés PDF-ként. A lap pontosan a kimeneti méret (pl. 1080 × 1080 px, A4). A PDF-et a Canva és a Figma szerkeszthetően megnyitja.\r\n\r\n`
        + `Betűk: Lalezar és Open Sans (SIL Open Font License 1.1) – a ds/web/assets/fonts mappában; ha más programban dolgozol, telepítsd őket (Google Fonts).\r\n`
        + `A beeco logója és méhecskéi belső használatúak; külső anyagban csak a beeco jóváhagyásával jelenhetnek meg.\r\n`
        + `Forrás: a beeco Brand Book (hegebeeco/beeco-design-system).\r\n`, 'utf8')],
      ...fajlok.concat(['sablon.css', 'sablon.js']).map(f => [`${m}/sablonok/${f}`, Buffer.from(kitoltott[f] || '', 'utf8')]),
      ...['dist/css/beeco-tokens.css', 'dist/css/beeco-fonts.css'].map(f => [`${m}/ds/${f}`, r(f)]),
      ...fs.readdirSync(path.join(ROOT, 'web/assets/fonts')).filter(f => f.endsWith('.woff2')).map(f => [`${m}/ds/web/assets/fonts/${f}`, r(`web/assets/fonts/${f}`)]),
      ...c.kepek.map(k => [`${m}/ds/web/assets/brand/${k}.webp`, r(`web/assets/brand/${k}.webp`)]),
    ];
    if (c.logok) {
      sor.push(...['logo', 'logo-sotet'].map(k => [`${m}/logo/${k}.webp`, r(`web/assets/brand/${k}.webp`)]));
      sor.push([`${m}/szinek.txt`, Buffer.from(`beeco színek (design system v${VERSION})\r\n`
        + ['honey', 'cream', 'black', 'butter', 'night'].map(n => `${NEV_HU[n] || n}\t${hex(n)}\t--bc-${n}`).join('\r\n')
        + `\r\n\r\nA méz az egyetlen hangsúlyszín – rajta a szöveg mindig fekete. Vektoros logó: hamarosan.\r\n`, 'utf8')]);
    }
    for (const [n] of sor) if (tiltott.some(t => n.includes(t))) ctx.hibak.push(`csomag ${id}: a mérges méhecske tilos`);
    ctx.ki.fajl(`sablonok/${c.file}`, zip(sor));
  }
}
const sablonKb = (ctx, rel) => { const b = ctx.ki.meret(rel); return b == null ? null : Math.max(1, Math.round(b / 1024)); };

// ============================================================
const G = {};
const reg = (oldal, nev, fn, miert) => { G[nev] = { oldal, fn, miert }; };
const DS_MIERT = 'rendszer-tartalom (tervezőknek, fejlesztőknek)', BRAND_MIERT = 'márka-tartalom (önkénteseknek, partnereknek)';

// ---------- közös ----------
reg('*', 'paletta', (b, ctx) => {
  const L = alapSzint(ctx), mind = new Set(Object.keys(core.color));
  const html = SZINCSALAD.map(([cim, l]) => { l.forEach(n => mind.delete(n)); return `${hx(ctx, L, cim, `szin-${cim}`)}<ul class="bb-swatches" role="list">${l.filter(n => core.color[n]).map(n => swatch(n, ctx)).join('')}</ul>`; }).join('');
  const tobbi = [...mind].filter(n => /^#/.test(core.color[n]));
  return html + (tobbi.length ? `${hx(ctx, L, 'További', 'szin-tovabbi')}<ul class="bb-swatches" role="list">${tobbi.map(n => swatch(n, ctx)).join('')}</ul>` : '');
});
reg('*', 'betuk', (b, ctx) => {
  const L = alapSzint(ctx);
  const minta = Object.entries(core.fontSize).reverse().map(([k, v]) => {
    const disp = ['3xl', '2xl', 'xl', 'l'].includes(k); ctx.ki.css.add(`.bb-fs-${k} { font-size: var(--bc-fs-${k}); }`);
    return `<li class="bb-tipo"><span class="bb-tipo-meta"><code>--bc-fs-${esc(k)}</code> ${esc(v)} px</span><span class="bb-fs-${esc(k)}${disp ? ' bb-display' : ''}">${disp ? 'Zümmögő méhecske' : 'A méhecske virágról virágra száll, és közben tanít.'}</span></li>`;
  }).join('');
  ctx.ki.css.add('.bb-fs-2xl { font-size: var(--bc-fs-2xl); }');
  return `<div class="bb-ket"><div class="bb-betukartya"><p class="bb-display bb-fs-2xl">Lalezar</p><p>Cím, szám, gomb – egyetlen vastagság. Hangos, barátságos.</p><p><code>--bc-font-display</code></p></div><div class="bb-betukartya"><p class="bb-fs-2xl bb-semibold">Open Sans</p><p>Minden más szöveg: 400 · 600 · 700. Nyugodt, jól olvasható.</p><p><code>--bc-font-body</code></p></div></div>${hx(ctx, L, 'Betűskála')}<ul class="bb-tipolista" role="list">${minta}</ul>`;
});
reg('*', 'mozgas', () => {
  const d = Object.entries(core.duration).map(([k, v]) => [`\`--bc-t-${k}\``, `${v} ms`, { fast: 'gomb, kapcsoló, rámutatás', base: 'megjelenés, lenyíló', slow: 'fiók, nagyobb panel', decor: 'dekoratív belépő mozgás (csökkentett mozgásnál kikapcsol)', hero: 'hős-mozgás (csökkentett mozgásnál kikapcsol)', press: 'lenyomás' }[k] || '']);
  const e = Object.entries(core.easing).map(([k, v]) => [`\`--bc-ease-${k}\``, `\`${v}\``, { out: 'alapértelmezés', 'in-out': 'helyben átalakuló elem', drawer: 'fiók, lap', bounce: 'csak jutalom (csillag, jelvény)' }[k] || '']);
  return B.tabla(['Időtartam', 'Érték', 'Mire'], d, 'Időtartamok') + B.tabla(['Görbe', 'Érték', 'Mire'], e, 'Görbék');
});
reg('*', 'kartyak', (b, ctx) => `<ul class="bb-kartyak" role="list">${(b.kartyak || []).map(k => `<li><div class="bb-kartya"><p class="bb-kartya-nev">${esc(k.nev)}</p><p>${inl(k.leiras)}</p>${k.href
  ? (() => { const u = k.href === '@masik' ? ctx.masikUrl : A.href(k.href); return `<a class="bb-tovabb" href="${esc(u)}"${/^https?:/.test(u) ? ' rel="noopener"' : ''}>${esc(k.link)}${ic(/^https?:|^\.\.|^@/.test(u) ? 'kulso' : 'tovabb')}</a>`; })()
  : `<p class="bb-kicsi"><span class="bb-soon">hamarosan</span> ${esc(k.link)}</p>`}</div></li>`).join('')}</ul>`);
reg('*', 'letoltesek', (b, ctx) => {
  const L = alapSzint(ctx), site = ctx.cfg.id;
  const lista = site === 'brand' ? LETOLT_BRAND : LETOLT_DS;
  const kert = b.csoportok ? lista.filter(([c]) => b.csoportok.includes(c)) : lista;
  if (b.csoportok) for (const c of b.csoportok) if (!lista.some(([n]) => n === c)) ctx.hibak.push(`${ctx.oldal}: letoltesek: a „${c}” csoport ezen az oldalon nincs (${lista.map(([n]) => n).join(', ')})`);
  return kert.map(([cim, l]) => `${hx(ctx, L, cim, `letoltes-${cim}`)}<ul class="bb-letolt" role="list">${l.map(([n, src, le]) => {
    const h = site === 'brand' ? `assets/${src.replace(/^web\/assets\//, '')}` : (ctx.ki.tukor(src), `${TUKOR}/${src}`);
    return letoltSor(h, n, le, ctx, src);
  }).join('')}</ul>`).join('');
});

// ---------- Design System ----------
reg('ds', 'szerepek', (b, ctx) => {
  const Lc = termek.color.light, D = termek.color.dark;
  const sorok = Object.keys(Lc).map(r => `<tr><th scope="row">${szerepMinta(r, ctx)} <code>--bc-${esc(r)}</code></th><td>${esc(NEV_HU[Lc[r]] || Lc[r])} <code>${hex(Lc[r])}</code></td><td>${esc(NEV_HU[D[r]] || D[r])} <code>${hex(D[r])}</code></td></tr>`).join('');
  return `<div class="bc-table-wrap bb-tabla" tabindex="0" role="region" aria-label="Színszerepek"><table class="bc-table"><caption class="bc-sr">Színszerepek a termékbőrben, világos és sötét módban</caption><thead><tr><th scope="col">Szerep (ezt használd)</th><th scope="col">Világos</th><th scope="col">Sötét</th></tr></thead><tbody>${sorok}</tbody></table></div>`;
}, DS_MIERT);
reg('ds', 'terkoz', (b, ctx) => `<ul class="bb-terkoz" role="list">${Object.entries(core.space).map(([k, v]) => { ctx.ki.css.add(`.bb-sp-${k} { width: var(--bc-sp-${k}); }`); return `<li><code>--bc-sp-${esc(k)}</code><span class="bb-sp-bar bb-sp-${esc(k)}" aria-hidden="true"></span><span>${esc(v)} px</span></li>`; }).join('')}</ul>`, DS_MIERT);
reg('ds', 'forma', (b, ctx) => {
  const L = alapSzint(ctx), r = termek.radius, s = termek.shadow || {};
  const sarkok = Object.entries(r).map(([k, v]) => { ctx.ki.css.add(`.bb-r-${k} { border-radius: var(--bc-r-${k}); }`); return `<li><span class="bb-forma-minta bb-r-${esc(k)}" aria-hidden="true"></span><code>--bc-r-${esc(k)}</code> ${v === 999 ? 'kapszula' : esc(v) + ' px'}</li>`; }).join('');
  const arnyek = ['s', 'm', 'l'].map(k => { ctx.ki.css.add(`.bb-sh-${k} { box-shadow: var(--bc-shadow-${k}); }`); return `<li><span class="bb-forma-minta bb-sh-${k}" aria-hidden="true"></span><code>--bc-shadow-${k}</code> ${Array.isArray(s[k]) ? `${s[k][0]} px jobbra, ${s[k][1]} px le, elmosás nélkül` : ''}</li>`; }).join('');
  ctx.ki.css.add('.bb-sh-soft { box-shadow: var(--bc-shadow-soft); }');
  return `${hx(ctx, L, 'Sarok (termékbőr)')}<ul class="bb-forma" role="list">${sarkok}</ul>${hx(ctx, L, 'Árnyék (termékbőr)')}<ul class="bb-forma" role="list">${arnyek}<li><span class="bb-forma-minta bb-sh-soft" aria-hidden="true"></span><code>--bc-shadow-soft</code> puha – csak nem kattintható dobozon</li></ul>`;
}, DS_MIERT);
reg('ds', 'adatskala', (b, ctx) => {
  const d = core.data || {};
  return Object.entries(d).filter(([, v]) => Array.isArray(v) && v.every(x => /^#/.test(x))).map(([k, v]) => {
    const l = v.map((c, i) => { ctx.ki.css.add(`.bb-ds[data-s="${k}-${i + 1}"] { background: var(--bc-data-${k}-${i + 1}); }`); return `<span class="bb-ds" data-s="${esc(k)}-${i + 1}"></span>`; }).join('');
    return `<div class="bb-adatskala"><code>${esc(k)}</code><span class="bb-ds-sor" role="img" aria-label="${esc(k)} skála: ${esc(v.join(', '))}">${l}</span></div>`;
  }).join('') + '<p class="bb-kicsi">A skálák a <code>--bc-data-…</code> tokenek (<code>tokens/core.json → data</code>); a felületen a grafikon-komponensek használják őket.</p>';
}, DS_MIERT);
reg('ds', 'borok', (b, ctx) => {
  const md = A.read('DESIGN.md'), i = md.indexOf('## Két bőr');
  if (i < 0) { ctx.hibak.push('borok: a DESIGN.md-ben nincs „## Két bőr” szakasz'); return ''; }
  const sorok = md.slice(i).split('\n').filter(l => l.startsWith('|'));
  const cells = l => l.split('|').slice(1, -1).map(c => c.trim().replace(/\*\*/g, ''));
  const fej = cells(sorok[0]); fej[0] = 'Jellemző';
  // a belső eszközsor (pl. „Szabálykönyv | skill: …”) nem publikus tartalom
  const test = sorok.slice(2).map(cells).filter(r => !r.some(c => /\bskill\b/i.test(c)));
  if (!test.length) ctx.hibak.push('borok: a DESIGN.md „Két bőr” táblája üres');
  return B.tabla(fej, test, 'A két bőr összevetése');
}, DS_MIERT);
reg('ds', 'borminta', (b, ctx) => {
  ['admin', 'jatek'].forEach(id => mintaOldal(felulet(id), ctx));
  return `<div class="bb-mintasor is-ket">${['admin', 'jatek'].map(id => mintaKeret(felulet(id), id === 'admin' ? 'Termékbőr' : 'Játékbőr')).join('')}</div>`;
}, DS_MIERT);
reg('ds', 'szintek', (b, ctx) => `<ul class="bb-csempek" role="list">${SZINT_SORREND.filter(sz => KOMP.komponensek.some(k => k.szint === sz)).map(sz => {
  const info = KOMP.szintek.find(x => x.id === sz) || {}, l = KOMP.komponensek.filter(k => k.szint === sz);
  return `<li><div class="bb-csempe"><p class="bb-csempe-nev">${esc(info.nev || sz)}</p><p class="bb-csempe-bor">${l.length} elem</p><p class="bb-csempe-le">${esc(info.leiras || '')}</p><ul class="bb-tagek" role="list">${l.map(k => `<li><a href="${esc(kSlug(k.id))}.html">${esc(k.nev)}</a></li>`).join('')}</ul></div></li>`;
}).join('')}</ul>`, DS_MIERT);
reg('ds', 'elemminta', () => `<div class="bb-elemminta">
<div class="bb-elemsor"><button type="button" class="bc-btn">Mentés</button><button type="button" class="bc-btn is-secondary">Mégse</button><button type="button" class="bc-btn is-ghost">Részletek</button><button type="button" class="bc-btn is-danger">Törlés</button><button type="button" class="bc-btn" disabled>Tiltott</button></div>
<div class="bb-elemsor"><span class="bc-badge is-success">Kész</span><span class="bc-badge is-warning">Folyamatban</span><span class="bc-badge is-danger">Hiba</span><span class="bc-badge is-info">Új</span><span class="bc-badge is-muted">Archív</span><span class="bc-badge is-accent">Kiemelt</span></div>
<div class="bb-ket"><div class="bc-field"><label class="bc-label" for="bb-minta-nev">Név</label><input class="bc-input" id="bb-minta-nev" placeholder="pl. Kert utcai közösségi kert"></div><div class="bc-field"><label class="bc-label" for="bb-minta-hiba">E-mail</label><input class="bc-input" id="bb-minta-hiba" value="nev@" aria-invalid="true" aria-describedby="bb-minta-hiba-uz"><p class="bc-error" id="bb-minta-hiba-uz">Hiányzik a @ utáni rész – például: nev@pelda.hu</p></div></div>
<div class="bb-ket"><div class="bc-card"><p class="bc-card-title">Kártya</p><p>Felület kemény árnyékkal – kattintható tartalomhoz.</p></div><div class="bc-alert is-info"><p><strong>Tudtad?</strong> Képernyőnként legfeljebb egy méz fő gomb van.</p></div></div>
</div>`, DS_MIERT);
reg('ds', 'katalogus', (b, ctx) => {
  const md = A.read('docs/komponens-katalogus.md');
  const reszek = md.split('\n## ').slice(1).map(r => { const cim = r.split('\n')[0]; const m = r.match(/\*\*Komponensek:\*\* (.+)/); return { cim, k: m ? m[1].split(', ') : [] }; }).filter(r => r.k.length);
  const ossz = reszek.reduce((a, r) => a + r.k.length, 0);
  if (ossz < 50) ctx.hibak.push(`katalogus: gyanúsan kevés komponens (${ossz})`);
  return `<p><strong>${ossz} React-komponens</strong> ${reszek.length} csoportban – a felsorolás a <code>docs/komponens-katalogus.md</code>-ből generálódik.</p>${reszek.map(r => `<details class="bb-kat"><summary><span>${esc(r.cim)}</span><span class="bc-badge is-muted">${r.k.length}</span></summary><ul class="bb-tagek" role="list">${r.k.map(k => `<li><code>${esc(k)}</code></li>`).join('')}</ul></details>`).join('')}`;
}, DS_MIERT);
reg('ds', 'tesztlapok', (b, ctx) => `<ul class="bb-tesztlista" role="list">${TESZT.map(t => tesztlapLink(t.nev, ctx)).join('')}</ul>`, DS_MIERT);
reg('ds', 'komponensKartya', (b, ctx) => {
  const k = KOMP.komponensek.find(x => x.id === b.komponens);
  if (!k) { ctx.hibak.push(`${ctx.oldal}: komponensKartya: ismeretlen komponens: ${b.komponens}`); return ''; }
  const L = alapSzint(ctx), cid = B.egyediId(ctx, `komp-${k.id}`);
  const kodok = l => (l || []).map(x => `<code>${esc(x)}</code>`).join(' ');
  return `<article class="bb-komp" aria-labelledby="${cid}">
<header class="bb-komp-fej"><h${L} id="${cid}"><a href="${esc(kSlug(k.id))}.html">${esc(k.nev)}</a></h${L}><span class="bc-badge is-accent">${esc(szintNev(k.szint))}</span></header>
<p class="bb-komp-le">${inl(k.leiras)}</p>
<dl class="bb-komp-meta">${(k.react || []).length ? `<div><dt>React</dt><dd>${kodok(k.react)}</dd></div>` : ''}${(k.css || []).length ? `<div><dt>CSS</dt><dd>${kodok(k.css)}</dd></div>` : ''}</dl>
<div class="bb-demo" role="group" aria-label="${esc(k.nev)} – élő minta"><p class="bb-demo-cim">Élő minta</p>${B.htmlEllenor(k.minta_html || '', ctx, 'minta_html')}</div>
</article>`;
}, DS_MIERT);
reg('ds', 'csempek', (b, ctx) => `<ul class="bb-csempek" role="list">${FELULETEK.map(f => `<li><a class="bb-csempe is-link" href="${esc(b.hova || 'feluletek.html')}#felulet-${esc(f.id)}"><span class="bb-csempe-nev">${esc(f.nev)}</span><span class="bb-csempe-bor">${esc(f.bor_nev)}</span><span class="bb-csempe-le">${esc(f.rovid)}</span></a></li>`).join('')}</ul>`, DS_MIERT);
reg('ds', 'matrix', (b, ctx) => {
  const head = `<tr><th scope="col">Jellemző</th>${FELULETEK.map(f => `<th scope="col">${esc(f.nev)}</th>`).join('')}</tr>`;
  const body = Object.entries(MATRIX_SOR).map(([k, cim]) => `<tr><th scope="row">${esc(cim)}</th>${FELULETEK.map(f => {
    const c = (f.ertekek || {})[k];
    if (!c) { ctx.hibak.push(`matrix: ${f.id}.${k} hiányzik`); return '<td>—</td>'; }
    if (!c.forras) ctx.hibak.push(`matrix: ${f.id}.${k} forrás nélkül`);
    return `<td>${jel(c.jel)}${inl(c.ertek)}${c.forras ? `<span class="bb-cella-forras">${esc(c.forras)}</span>` : ''}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="bb-jelmagyarazat" aria-hidden="true">${Object.entries(JEL).map(([k, [s, t]]) => `<span><span class="bb-jel is-${k}">${s}</span> ${t}</span>`).join('')}</div><div class="bc-table-wrap bb-tabla bb-matrix" tabindex="0" role="region" aria-label="A hat felület összevetése"><table class="bc-table is-fixed"><caption class="bc-sr">A hat felület összevetése: ● közös, ◐ részben, ✗ eltér</caption><thead>${head}</thead><tbody>${body}</tbody></table></div><p class="bb-kicsi">Felmérve: ${esc([...new Set(FELULETEK.map(f => f.felmeres && f.felmeres.datum).filter(Boolean))].join(', '))} · frissítés: <code>node tools/brandbook-felmeres.js --forras ~/CLAUDE</code></p>`;
}, DS_MIERT);
reg('ds', 'mintasor', (b, ctx) => { FELULETEK.forEach(f => mintaOldal(f, ctx)); return `<div class="bb-mintasor">${FELULETEK.map(f => mintaKeret(f)).join('')}</div><p class="bb-kicsi">Az app és a Kaptár mintáját a forráskódjukban talált értékekből rajzoljuk újra – a valódi képernyőt a felület leírásánál találod.</p>`; }, DS_MIERT);
/** Egy felület teljes profilja (a régi felulet-<id>.html tartalma) egy szakaszként: { "t":"gen", "nev":"felulet", "felulet":"admin" } */
reg('ds', 'felulet', (b, ctx) => {
  const f = felulet(b.felulet);
  if (!f) { ctx.hibak.push(`${ctx.oldal}: felulet: ismeretlen felület: ${b.felulet} (${SORREND.join(', ')})`); return ''; }
  const L = Math.max(2, Math.min(ctx.szint === 1 ? 2 : ctx.szint, 3));   // a felület címe h2 (vagy h3, ha h2 alatt áll)
  const fid = `felulet-${f.id}`; ctx.idk.add(fid); ctx.szint = L;
  const lista = (cim, l, cls) => l && l.length ? `<section class="bb-fl-resz ${cls}">${hx(ctx, L + 1, cim, `${f.id}-${cim}`)}<ul class="bb-list">${l.map(x => `<li>${inl(x)}</li>`).join('')}</ul></section>` : '';
  mintaOldal(f, ctx);
  const sorok = Object.entries(f.ertekek || {}).map(([k, c]) => [MATRIX_SOR[k] || k, `${JEL[c.jel] ? JEL[c.jel][0] + ' ' : ''}${c.ertek}`, c.forras || '']);
  const blokkok = (f.blokkok || []).map(x => B.blokk(x, ctx)).join('\n');
  ctx.szint = L;
  return `<h${L} id="${fid}">${esc(f.nev)}</h${L}><p class="bb-lead">${inl(f.rovid)}</p><p class="bb-oldal-meta"><span class="bc-badge is-accent">${esc(f.bor_nev)}</span> <span class="bc-badge is-muted">${esc(f.technika_rovid || '')}</span></p>
<div class="bb-ket bb-fl-fej"><div>${lista('Kinek szól', f.kinek, '')}${f.hol ? `<p><strong>Hol él:</strong> ${inl(f.hol)}</p>` : ''}</div>${mintaKeret(f, 'Élő minta')}</div>
${kepernyoResz(f.id, ctx, L + 1)}
${lista('Mi közös a többi felülettel', f.kozos, 'is-kozos')}${lista('Mi tér el – szándékosan', f.szandekos, 'is-szandekos')}${lista('Mi tér el ma – rendezendő', f.elter, 'is-elter')}${lista('Cél felé – teendők', f.cel, 'is-cel')}
${blokkok}
${hx(ctx, L + 1, 'Értékek a forrásból', `${f.id}-ertekek`)}${B.tabla(['Jellemző', 'Érték', 'Forrás'], sorok, `${f.nev} értékei`)}
<p class="bb-kicsi">Felmérve: ${esc((f.felmeres && f.felmeres.datum) || '–')} · ${esc(((f.felmeres && f.felmeres.forras) || []).join(' · '))}</p>
${f.szabalykonyv ? `<p>Szabálykönyv: ${inl(f.szabalykonyv)}</p>` : ''}`;
}, DS_MIERT);
reg('ds', 'pillanatok', () => {
  const sorok = Object.entries(hangnem.pillanatok).map(([id, p]) => [id.replace(/-/g, ' '), p.meh, p.valtozatok.map(v => `„${v.poen}”`).join(' · '), p.valtozatok.map(v => `„${v.sima}”`).join(' · ')]);
  return B.tabla(['Pillanat', 'Méhecske', 'Szóviccel', 'Simán'], sorok, 'Szövegpillanatok');
}, 'mikroszöveg-minta (DS: Minták / Mikroszöveg)');

// ---------- bb-web: Webflow-megfeleltetés és a játékbőr élő elemei (DS / Felületek) ----------
let PIC = null, ART = null;
function pic(n, ctx) {
  if (!PIC) { const src = A.read('web/js/pics.js'), vege = src.indexOf('\n};'); PIC = vm.runInNewContext(src.slice(0, vege + 3) + '\nPIC_DEFS'); }
  if (!PIC[n]) { ctx.hibak.push(`jatekelemek: ismeretlen piktogram: ${n}`); return ''; }
  return `<svg class="pic pic-${n}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PIC[n]}</svg>`;
}
function art(n, alt, ctx) {
  if (!ART) {
    const dir = path.join(ROOT, 'web/js/art');
    ART = require(path.join(dir, 'art.js')); globalThis.ART = ART;
    for (const f of fs.readdirSync(dir).filter(f => /^art-.+\.js$/.test(f)).sort()) require(path.join(dir, f));
  }
  if (!ART.has(n)) { ctx.hibak.push(`jatekelemek: ismeretlen matrica: ${n}`); return ''; }
  ctx.ki.fajl(`minta/art/${n}.svg`, ART.svg(n));
  return `<img class="art" src="art/${esc(n)}.svg" alt="${esc(alt || '')}" width="100" height="100">`;
}
const kitolt = (h, ctx) => atir(B.htmlEllenor(String(h || ''), ctx).replace(/(\s(?:src|href|srcset)=")assets\//g, '$1../assets/'))
  .replace(/\{\{pic:([a-z0-9]+)\}\}/g, (m, n) => pic(n, ctx))
  .replace(/\{\{art:([a-z0-9_]+)(?:\|([^}]*))?\}\}/g, (m, n, alt) => art(n, alt, ctx));
function jatekOldal(file, cim, torzs, termekTokenek, ctx) {
  mintaAlap(ctx);
  if (!ctx.ki.megvan('jatekminta')) { ctx.ki.masol('brandbook/css/jatekminta.css', `${MINTA_ASSET}/jatekminta.css`); ctx.ki.tukor('web/css'); ctx.ki.tukor('web/assets/fonts'); ctx.ki.tukor('dist/css'); }
  ctx.ki.fajl(`minta/${file}`, `<!doctype html><html lang="hu" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(cim)} – játékbőr, minta</title>`
    + `<link rel="stylesheet" href="../${TUKOR}/web/css/fonts.css"><link rel="stylesheet" href="../${TUKOR}/web/css/tokens.css"><link rel="stylesheet" href="../${TUKOR}/web/css/ds.css"><link rel="stylesheet" href="../${TUKOR}/web/css/ds-game.css">`
    + (termekTokenek ? `<link rel="stylesheet" href="../${TUKOR}/dist/css/beeco-tokens.css">` : '')
    + `<link rel="stylesheet" href="../${MINTA_ASSET}/minta.css"><link rel="stylesheet" href="../${MINTA_ASSET}/jatekminta.css"><script src="../${MINTA_ASSET}/minta.js"></script></head>`
    + `<body class="mt-jatek jm nincs-sotet"><main class="jm-wrap">${torzs}</main></body></html>`);
}
const keret = (file, cim, cls = '') => `<iframe class="bbw-jm-keret${cls}" src="minta/${esc(file)}" title="${esc(cim)}" loading="lazy" data-minta="${esc(file)}"></iframe>`;
reg('ds', 'webflowValtozok', (b, ctx) => {
  const w = A.json('dist/weboldal/webflow-valtozok.json');
  const kol = w.kollekcio || 'beeco DS', elotag = '--_' + kol.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '---';
  const v = w.valtozok || [];
  if (v.length < 50) ctx.hibak.push(`webflowValtozok: gyanúsan kevés változó (${v.length})`);
  const ertek = x => x && typeof x === 'object' ? `${x.value} ${x.unit}` : x;
  const szinek = v.filter(x => x.tipus === 'Color').map(x => `<tr><th scope="row">${szerepMinta(x.nev.replace(/^bc-/, ''), ctx)} <code>--${esc(x.nev)}</code></th><td><code>${esc(x.nev)}</code></td><td><code>${esc(elotag + x.nev)}</code></td><td><code>${esc(x.ertek)}</code></td><td>${x.sotet ? `<code>${esc(x.sotet)}</code>` : '—'}</td></tr>`).join('');
  const csoport = { 'bc-r-': 'Sarok', 'bc-bw-': 'Keret', 'bc-shadow-': 'Árnyék (eltolás)', 'bc-sp-': 'Térköz', 'bc-fs-': 'Betűméret', 'bc-tap': 'Érintési méret' };
  const meretek = v.filter(x => x.tipus !== 'Color').map(x => {
    const cs = Object.entries(csoport).find(([p]) => x.nev.startsWith(p));
    const ds = /^bc-shadow-[sml]-[xy]$/.test(x.nev) ? `\`--bc-shadow-${x.nev.split('-')[2]}\` (${x.nev.endsWith('-x') ? 'vízszintes' : 'függőleges'} rész)` : `\`--${x.nev}\``;
    return [ds, `\`${x.nev}\``, `\`${elotag}${x.nev}\``, ertek(x.ertek), cs ? cs[1] : '—'];
  });
  const szinTabla = `<div class="bc-table-wrap bb-tabla" tabindex="0" role="region" aria-label="Színszerepek: DS-token és Webflow-változó"><table class="bc-table"><thead><tr>${['DS-token (kódban)', 'Webflow-változó', 'CSS-név a Webflow-ban', 'Világos', 'Sötét mód'].map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${szinek}</tbody></table></div>`;
  return `<p>A <strong>${esc(kol)}</strong> kollekció ${v.length} változója, két móddal (${esc((w.modok || []).join(' · '))}). A táblázat a <code>dist/weboldal/webflow-valtozok.json</code>-ból generálódik – ha egy token változik, a <code>node tools/webflow-build.js</code> után itt is az új érték áll.</p>`
    + `<details class="bb-kat" open><summary><span>Színszerepek</span><span class="bc-badge is-muted">${v.filter(x => x.tipus === 'Color').length}</span></summary>${szinTabla}</details>`
    + `<details class="bb-kat"><summary><span>Méretek: sarok, keret, árnyék, térköz, betű</span><span class="bc-badge is-muted">${meretek.length}</span></summary>${B.tabla(['DS-token (kódban)', 'Webflow-változó', 'CSS-név a Webflow-ban', 'Érték', 'Csoport'], meretek, 'Méret-változók: DS-token és Webflow-változó')}</details>`
    + '<p class="bb-kicsi">Árnyék: a Webflow-ban nincs árnyék-típusú változó, ezért az eltolás két méret-változó (<code>-x</code>, <code>-y</code>); a <code>box-shadow</code>-t az oldal fejkódja rakja össze: <code>&lt;x&gt; &lt;y&gt; 0 0 var(--_beeco-ds---bc-shadow)</code>.</p>';
}, DS_MIERT);
reg('ds', 'jatekelemek', (b, ctx) => {
  const elemek = b.elemek || [];
  if (!elemek.length) { ctx.hibak.push('jatekelemek: üres elemlista'); return ''; }
  const L = alapSzint(ctx), ids = new Set();
  return `<nav class="bb-komp-ugro" aria-label="A játékbőr elemei – ugrás"><ul role="list">${elemek.map(e => `<li><a href="#jatek-${esc(e.id)}">${esc(e.nev)}</a></li>`).join('')}</ul></nav>` + elemek.map(e => {
    const hol = `jatekelem ${e.id}`;
    if (ids.has(e.id)) ctx.hibak.push(`${hol}: kétszer szereplő azonosító`); ids.add(e.id);
    for (const m of ['nev', 'leiras', 'minta']) if (!e[m]) ctx.hibak.push(`${hol}: hiányzik: ${m}`);
    if (!(e.do || []).length || !(e.dont || []).length) ctx.hibak.push(`${hol}: kell legalább egy IGEN és egy NEM`);
    if (!(e.forras || []).length) ctx.hibak.push(`${hol}: forrás nélkül`);
    jatekOldal(`jatek-${e.id}.html`, e.nev, kitolt(e.minta, ctx), false, ctx);
    const dd = (l, jo) => (l || []).map((d, i) => {
      const file = `jatek-${e.id}-${jo ? 'igen' : 'nem'}-${i + 1}.html`;
      jatekOldal(file, `${e.nev} – ${jo ? 'így' : 'ne így'}`, kitolt(d.html, ctx), d.termekTokenek, ctx);
      return B.ddFig({ html: keret(file, `${e.nev} – ${jo ? 'így' : 'ne így'}: ${d.felirat || ''}`, ' is-kep'), felirat: d.felirat, miert: d.miert }, jo, ctx);
    }).join('');
    const id = `jatek-${e.id}`; ctx.idk.add(id);
    return `<article class="bb-komp bbw-jatekelem" aria-labelledby="${esc(id)}">
<header class="bb-komp-fej"><h${L} id="${esc(id)}">${esc(e.nev)}</h${L}><span class="bc-badge is-accent">Játékbőr</span></header>
<p class="bb-komp-le">${inl(e.leiras)}</p>
${(e.css || []).length ? `<dl class="bb-komp-meta"><div><dt>CSS</dt><dd>${e.css.map(c => `<code>${esc(c)}</code>`).join(' ')}</dd></div>${e.js ? `<div><dt>JS</dt><dd>${e.js.map(c => `<code>${esc(c)}</code>`).join(' ')}</dd></div>` : ''}</dl>` : ''}
<figure class="bb-minta bbw-jm-elo">${keret(`jatek-${e.id}.html`, `${e.nev} – élő minta a játékbőrben`)}<figcaption><strong>Élő minta</strong> – a játék saját CSS-ével, külön keretben${e.minta_jel ? ` · ${inl(e.minta_jel)}` : ''}</figcaption></figure>
<div class="bb-mikor"><section class="is-igen"><p class="bb-mikor-cim">Így használd</p>${B.lista(e.mikor)}</section><section class="is-ne"><p class="bb-mikor-cim">Mikor ne – és mit helyette</p>${B.lista(e.mikor_ne)}</section></div>
<div class="bb-dd-racs">${dd(e.do, true)}${dd(e.dont, false)}</div>
${B.forrasLista(e.forras)}
</article>`;
  }).join('\n');
}, DS_MIERT);

// ---------- DS kezdőlap: számok, változások, kód ----------
reg('ds', 'valtozasok', (b) => {
  const l = A.read('CHANGELOG.md').split('\n').filter(s => /^## \d/.test(s)).slice(0, (b && +b.db) || 5).map(s => s.replace(/^## /, ''));
  return `<ul class="bb-valtozasok">${l.map(s => { const [v, d, ...t] = s.split(' – '); return `<li><code>${esc(v)}</code> <span class="bb-kicsi">${d ? `<time datetime="${esc(d)}">${esc(d)}</time>` : ''}</span> ${inl(t.join(' – '))}</li>`; }).join('')}</ul><p class="bb-kicsi">A teljes lista: <a href="https://github.com/hegebeeco/beeco-design-system/blob/main/CHANGELOG.md" rel="noopener">CHANGELOG.md</a></p>`;
}, 'fejlesztői változásnapló');

// ---------- Brand Book ----------
reg('brand', 'logo', () => `<div class="bb-logok"><figure class="bb-logo is-vilagos"><img src="assets/brand/logo.webp" alt="beeco logó, világos háttérre" width="240" height="147" loading="lazy"><figcaption>Világos háttérre: <code>logo.webp</code></figcaption></figure><figure class="bb-logo is-sotet"><img src="assets/brand/logo-sotet.webp" alt="beeco logó, sötét háttérre" width="240" height="147" loading="lazy"><figcaption>Sötét háttérre: <code>logo-sotet.webp</code></figcaption></figure></div>`, BRAND_MIERT);
/** Védőtér-ábra: a logó körül a logó magasságának fele (Kristóf döntése, 2026-10-08) – a szaggatott keret a védőtér határa. */
reg('brand', 'logoVedoter', () => `<figure class="bb-vedoter-abra"><div class="bb-vedoter-zona" role="img" aria-label="A beeco logó a védőtérrel: minden oldalon a logó magasságának fele marad üresen"><img src="assets/brand/logo.webp" alt="" width="240" height="147" loading="lazy"><span class="bb-vedoter-meret is-fent" aria-hidden="true">½ h</span><span class="bb-vedoter-meret is-bal" aria-hidden="true">½ h</span></div><figcaption>Védőtér: a logó körül minden oldalon a <strong>logó magasságának fele</strong> (½ h) üres. A szaggatott vonal a védőtér határa – ezen belül ne legyen szöveg, kép vagy másik logó.</figcaption></figure>`, BRAND_MIERT);
reg('brand', 'partnerlogok', (b, ctx) => G.logo.fn(b, ctx) + `<ul class="bb-letolt bb-sablon-logok" role="list">${[['logo.webp', 'világos háttérre'], ['logo-sotet.webp', 'sötét háttérre']].map(([f, le]) => letoltSor(`assets/brand/${f}`, f, le, ctx, `web/assets/brand/${f}`)).join('')}</ul>`, BRAND_MIERT);
reg('brand', 'partnerszinek', (b, ctx) => `<ul class="bb-swatches" role="list">${['honey', 'cream', 'black', 'butter', 'night'].filter(n => core.color[n]).map(n => swatch(n, ctx)).join('')}</ul>`, BRAND_MIERT);
const SZEREP_NEV = { hazigazda: 'házigazda', futar: 'futár', szurkolo: 'szurkoló', piheno: 'pihenő', gondolkodo: 'gondolkodó', hirvivo: 'hírvivő', halas: 'hálás', kacsinto: 'kacsintó', szomoru: 'szomorú', tevekeny: 'tevékeny' };
reg('brand', 'hangszerepek', (b, ctx) => {
  const L = alapSzint(ctx);
  return `<ul class="bb-mehek" role="list">${Object.entries(hangnem.szerepek).map(([id, s]) => {
    if ((hangnem.tiltott_kepek || []).includes(s.kep)) { ctx.hibak.push(`hang: tiltott kép a szerepek között: ${s.kep}`); return ''; }
    return `<li class="bb-meh"><img src="assets/brand/${esc(s.kep)}.webp" alt="" width="96" height="96" loading="lazy"><div>${hx(ctx, L, SZEREP_NEV[id] || id, `meh-${id}`)}<p class="bb-meh-erzelem">${esc(s.erzelem)}</p><p>${esc(s.mikor)}</p></div></li>`;
  }).join('')}</ul>`;
}, BRAND_MIERT);
reg('brand', 'madarkak', (b, ctx) => {
  illuAlap(ctx);
  const van = ILLU.madarkak.filter(m => fs.existsSync(path.join(BB, 'illusztraciok', m.file)));
  if (!van.length) return '<p class="bb-kicsi">A Csicsergősz-madárkák (liba, rigó, varjú, veréb) a csapat rajzai; ebben a kiadásban nem szerepelnek – a beeco csapatától kérd őket.</p>';
  return `<ul class="bb-illu-racs" role="list">${van.map(m => {
    const svg = fs.readFileSync(path.join(BB, 'illusztraciok', m.file), 'utf8');
    if (/<script|<image|href=/i.test(svg)) ctx.hibak.push(`illusztraciok: ${m.file}: a madárka SVG-ben nem lehet szkript, beágyazott kép vagy hivatkozás`);
    const szinek = [...new Set([...svg.matchAll(/fill="(#[0-9A-Fa-f]{6}|white|black)"/g)].map(x => ({ white: '#FFFFFF', black: '#000000' }[x[1]] || x[1].toUpperCase())))].sort((a, c) => illuFeny(a) - illuFeny(c));
    const sikok = (svg.match(/<path\b/g) || []).length;
    return `<li><figure class="bb-illu-kartya"><div class="bb-illu-szinpad"><img src="illusztraciok/${esc(m.file)}" alt="${esc(m.nev)} – Csicsergősz-madárka" width="${m.w}" height="${m.h}" loading="lazy"></div><figcaption><strong>${esc(m.nev)}</strong> <span class="bb-kicsi">${sikok} sík, ${szinek.length} szín</span>${illuSor(m.nev, szinek)}</figcaption></figure></li>`;
  }).join('')}</ul>`;
}, BRAND_MIERT);
reg('brand', 'v4kepek', (b, ctx) => {
  illuAlap(ctx);
  const l = (b.idk || []).map(id => ILLU.v4.find(x => x.id === id) || (ctx.hibak.push(`illusztraciok: ismeretlen v4 rajz: ${id}`), null)).filter(Boolean);
  return `<div class="bb-illu-racs${l.length === 2 ? ' is-par' : ''}">${l.map(x => illuKep(x, ctx)).join('')}</div>`;
}, BRAND_MIERT);
reg('brand', 'animaciok', (b, ctx) => {
  illuAlap(ctx);
  return `<ul class="bb-illu-racs is-mozgas" role="list">${ILLU.anim.map(a => {
    for (const f of [a.file, a.allo]) if (!fs.existsSync(path.join(BB, 'illusztraciok', f))) ctx.hibak.push(`illusztraciok: hiányzó mozgásminta: ${f}`);
    return `<li><figure class="bb-illu-kartya"><div class="bb-illu-szinpad"><picture><source srcset="illusztraciok/${esc(a.file)}" type="image/svg+xml" media="(prefers-reduced-motion: no-preference)"><img src="illusztraciok/${esc(a.allo)}" alt="${esc(a.faj)} – mozgásminta: ${esc(a.mozgas)}" width="${a.w}" height="${a.h}" loading="lazy"></picture></div><figcaption><strong>${esc(a.faj)}</strong> <span class="bb-kicsi">${esc(a.mozgas)}</span> <a href="illusztraciok/${esc(a.file)}" rel="noopener">Lejátszás újra, külön lapon</a></figcaption></figure></li>`;
  }).join('')}</ul><p class="bb-kicsi">A minta négyszer játszik le, aztán megáll. Csökkentett mozgásnál (rendszerbeállítás) az álló kép látszik.</p>`;
}, BRAND_MIERT);
reg('brand', 'madarkeszlet', (b, ctx) => {
  illuAlap(ctx);
  const L = alapSzint(ctx), K = ILLU;
  const lista = [
    ['Csicsergősz-madárkák (SVG, vektoros)', K.madarkak.filter(m => fs.existsSync(path.join(BB, 'illusztraciok', m.file))).map(m => [m.file.split('/').pop(), m.file, m.nev])],
    ['Madárrajzok v4 (WebP, 600 px széles, átlátszó háttér)', K.v4.map(x => [x.file.split('/').pop(), x.file, `${x.faj} – ${x.poz}`])],
    ['Mozgásminták (animált SVG + álló WebP)', K.anim.flatMap(a => [[a.file.split('/').pop(), a.file, `${a.faj} – ${a.mozgas}`], [a.allo.split('/').pop(), a.allo, `${a.faj} – álló kép`]])],
  ];
  return lista.filter(([, l]) => l.length).map(([cim, l]) => `${hx(ctx, L, cim, `keszlet-${cim}`)}<ul class="bb-letolt bb-illu-letolt" role="list">${l.map(([n, h, le]) => letoltSor(`illusztraciok/${h}`, n, le, ctx, `brandbook/illusztraciok/${h}`)).join('')}</ul>`).join('');
}, BRAND_MIERT);
/** Sablon-galéria: méretarányos élő előnézet (a sablon HTML-je keretben) + megnyitás szerkesztésre. b.csoport: social | partner */
reg('brand', 'sablonok', (b, ctx) => {
  sablonAlap(ctx);
  const L = alapSzint(ctx);
  const l = SABLON.sablonok.filter(s => s.csoport === b.csoport && (!b.csak || b.csak.includes(s.id)));
  if (!l.length) { ctx.hibak.push(`sablonok: üres csoport: ${b.csoport}`); return ''; }
  return `<ul class="bb-sablonok" role="list">${l.map(s => {
    for (const m of ['id', 'file', 'w', 'h', 'cim', 'meret']) if (!s[m]) ctx.hibak.push(`sablon ${s.id || '?'}: hiányzik: ${m}`);
    if (!fs.existsSync(path.join(BB, 'sablonok', s.file))) ctx.hibak.push(`sablon ${s.id}: hiányzó fájl: brandbook/sablonok/${s.file}`);
    ctx.ki.css.add(`.bb-sablon-kep[data-sablon="${s.id}"] iframe { aspect-ratio: ${Number(s.w)} / ${Number(s.h)}; max-width: ${Math.round(360 * s.w / s.h)}px; }`);
    const jelv = s.osszefoglalo ? '<span class="bc-badge is-warning">Tervezet</span>' : s.korrigalando ? '<span class="bc-badge is-danger">Minta – korrigálandó</span>' : '<span class="bc-badge is-muted">Minta</span>';
    return `<li class="bb-sablon"><div class="bb-sablon-kep" data-sablon="${esc(s.id)}" inert><iframe src="sablonok/${esc(s.file)}${s.lap ? `?lap=${esc(s.lap)}` : ''}" title="${esc(s.cim)} – előnézet" loading="lazy" tabindex="-1"></iframe></div>`
      + `<div class="bb-sablon-info">${hx(ctx, L, s.cim, `sablon-${s.id}`)}<p class="bb-sablon-meret">${jelv} ${esc(s.meret)}</p><p class="bb-sablon-hol">${esc(s.hol || '')}</p><p>${inl(s.leiras || '')}</p>`
      + `<a class="bc-btn is-secondary" href="sablonok/${esc(s.file)}" rel="noopener">Megnyitás és szerkesztés${ic('tovabb')}</a></div></li>`;
  }).join('')}</ul>`;
}, BRAND_MIERT);
/** A sablon-csomagok (ZIP) letöltése; b.csoport nélkül mind. b.osszefoglalo: az A4-es összefoglaló is. */
reg('brand', 'sablonletoltes', (b, ctx) => {
  sablonAlap(ctx);
  const cs = Object.entries(SABLON.csomagok).filter(([id]) => !b.csoport || id === b.csoport);
  const db = id => new Set(SABLON.sablonok.filter(s => s.csoport === id).map(s => s.file)).size;
  const sor = (h, n, le, letolt = true) => { const k = sablonKb(ctx, h); if (k === null) ctx.hibak.push(`sablonletoltes: hiányzó fájl: ${h}`);
    return `<li><a class="bc-btn is-secondary" href="${esc(h)}"${letolt ? ' download' : ' rel="noopener"'}>${ic(letolt ? 'letolt' : 'tovabb')}${esc(n)}</a><span>${esc(le)}${k ? ` · ${k} KB` : ''}</span></li>`; };
  return `<ul class="bb-letolt" role="list">${cs.map(([id, c]) => sor(`sablonok/${c.file}`, c.file, `${c.cim}: ${db(id)} szerkeszthető HTML-sablon, betűk és képek egy csomagban`)).join('')}`
    + `${b.osszefoglalo ? sor('sablonok/partner-osszefoglalo.html', 'Összefoglaló (A4)', 'egyoldalas, nyomtatható – megnyitás, utána Nyomtatás → Mentés PDF-ként', false) : ''}</ul>`;
}, BRAND_MIERT);
/** A fejezetek a nav.json-ból (szám és sorrend adatból, nem kézzel). */
reg('brand', 'fejezetek', (b, ctx) => {
  const cs = ctx.nav.csoportok.filter(c => c.id !== 'kezdes');
  return `<p>${cs.length} fejezet, egy olvasási sorrendben: ${cs.map(c => esc(c.cim)).join(', ')}. Minden oldal alján a „Következő” visz tovább; a még készülő oldalak a menüben szürkén, „hamarosan” jelöléssel látszanak.</p>`;
}, BRAND_MIERT);
/** Kezdőlap: „Hol kezdjem?” – csak a már létező oldalakra visz; a többi útra „hamarosan”. */
reg('brand', 'holKezdjem', (b, ctx) => G.kartyak.fn(b, ctx), BRAND_MIERT);

module.exports = { GEN: G, TUKOR, mintaOldal, mintaKeret, kepernyoResz, tesztlapLink, NEV_HU, FELULETEK, KOMP, TESZT, kb };
