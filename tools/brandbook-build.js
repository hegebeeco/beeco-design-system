#!/usr/bin/env node
/* ============================================================
   beeco BRAND BOOK – építő (Javaslat 22)

   node tools/brandbook-build.js                 → _brandbook/ (a Netlify ezt teszi ki)
   node tools/brandbook-build.js --ki <mappa>    → máshová
   node tools/brandbook-build.js --check         → ideiglenes mappába épít, és hibát ad, ha valami hiányzik vagy rossz

   Egy forrás: a tokenek (tokens/*.json), a szövegkészlet (tokens/hangnem.json), a katalógus (docs/komponens-katalogus.md),
   a CHANGELOG, a fejezetszövegek (brandbook/tartalom/*.json) és a felületek profilja (brandbook/feluletek/*.json).
   Csak a Node beépített moduljait használja (a Netlify-buildnek nem kell npm install).
   Szabály: inline stílus és inline script nincs (szigorú CSP), szöveg mindig escape-elve kerül a HTML-be.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const BB = path.join(ROOT, 'brandbook');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const kiIdx = args.indexOf('--ki');
const OUT = CHECK ? fs.mkdtempSync(path.join(os.tmpdir(), 'brandbook-')) : path.resolve(ROOT, kiIdx >= 0 ? args[kiIdx + 1] : '_brandbook');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const json = f => JSON.parse(read(f));
const core = json('tokens/core.json');
const termek = json('tokens/theme-termek.json');
const hangnem = json('tokens/hangnem.json');
const VERSION = read('VERSION').trim();
const hibak = [];

// ---------- segédek ----------
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Egyszerű soron belüli jelölés: `kód`, **félkövér**, [szöveg](link) – minden más escape-elve. */
const inl = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, h) => `<a href="${/^(https?:|mailto:|[a-z0-9-]+\.html|#)/.test(h) ? h : '#'}"${/^https?:/.test(h) ? ' rel="noopener"' : ''}>${t}</a>`);
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const mkdir = d => fs.mkdirSync(d, { recursive: true });
function copy(rel, dest = rel) {
  const src = path.join(ROOT, rel), dst = path.join(OUT, 'ds', dest);
  if (!fs.existsSync(src)) { hibak.push(`hiányzó forrás: ${rel}`); return; }
  fs.cpSync(src, dst, { recursive: true, filter: f => !/\.DS_Store$|nezo\.png$/.test(f) });
}
const hex = n => (core.color[n] || '').toUpperCase();

// ---------- fejezetek és utak ----------
const FEJEZETEK = [
  { id: 'index', szam: 0, cim: 'Kezdőlap', file: 'index.html' },
  { id: 'marka', szam: 1, cim: 'Márka' },
  { id: 'hang', szam: 2, cim: 'Hang és szöveg' },
  { id: 'alapok', szam: 3, cim: 'Közös alapok' },
  { id: 'borok', szam: 4, cim: 'Két bőr' },
  { id: 'feluletek', szam: 5, cim: 'Hat felület' },
  { id: 'elemek', szam: 6, cim: 'Elemek' },
  { id: 'kepek', szam: 7, cim: 'Képek' },
  { id: 'partnereknek', szam: 8, cim: 'Partnereknek' },
  { id: 'onkenteseknek', szam: 9, cim: 'Önkénteseknek' },
  { id: 'letoltesek', szam: 10, cim: 'Letöltések' },
].map(f => ({ ...f, file: f.file || `${f.id}.html` }));
const UTAK = {
  onkentes: { nev: 'Önkéntes', leiras: 'Csatlakoztál a kaptárhoz: így szólunk, így nézünk ki, ezt használhatod.', lepesek: ['onkenteseknek', 'marka', 'hang', 'kepek', 'letoltesek'] },
  partner: { nev: 'Partner', leiras: 'Együtt dolgozunk: a logó, a méhecske és a közös anyagok szabályai.', lepesek: ['partnereknek', 'marka', 'hang', 'kepek', 'letoltesek'] },
  fejleszto: { nev: 'Fejlesztő, tervező', leiras: 'Képernyőt, oldalt vagy játékot építesz: tokenek, bőrök, elemek.', lepesek: ['alapok', 'borok', 'feluletek', 'elemek', 'hang', 'letoltesek'] },
};
const tartalom = Object.fromEntries(fs.readdirSync(path.join(BB, 'tartalom')).filter(f => f.endsWith('.json'))
  .map(f => [f.replace(/\.json$/, ''), JSON.parse(fs.readFileSync(path.join(BB, 'tartalom', f), 'utf8'))]));
const SORREND = ['admin', 'partner', 'app', 'kaptar', 'web', 'jatek'];
const feluletek = SORREND.map(id => {
  const f = path.join(BB, 'feluletek', `${id}.json`);
  if (!fs.existsSync(f)) { hibak.push(`hiányzó felület-profil: ${id}`); return null; }
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}).filter(Boolean);

const KOMP_F = path.join(BB, 'elemek', 'komponensek.json');
const KOMP = fs.existsSync(KOMP_F) ? JSON.parse(fs.readFileSync(KOMP_F, 'utf8')) : { szintek: [], komponensek: [] };
const TESZT = json('termek/tesztlapok/lista.json');
const KEP_F = path.join(BB, 'kepernyok', 'kepernyok.json');
const KEPERNYOK = fs.existsSync(KEP_F) ? JSON.parse(fs.readFileSync(KEP_F, 'utf8')).kepernyok : [];

// ---------- piktogramok (vonalas, a DS stílusában) ----------
const IC = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  hold: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  nap: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  auto: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  kereses: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  masol: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  tovabb: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  letolt: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  ki: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
};
const ic = (n, cls = '') => `<svg class="bb-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${IC[n]}</svg>`;

// ---------- keresőindex ----------
const index = [];
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

// ---------- vizuális DO / DON'T (Kristóf: „ha DO és DON'T, mindig legyen vizualizáció”) ----------
function htmlEllenor(h, ctx) {
  if (/\sstyle=|<script|\son[a-z]+=|<link|javascript:/i.test(h)) hibak.push(`${ctx}: tiltott jelölés a minta-HTML-ben (style/script/on…/link)`);
  if (/bee-angry/.test(h)) hibak.push(`${ctx}: a mérges méhecske tilos`);
  return h;
}
function vizual(o, ctx) {
  if (o.html) return htmlEllenor(o.html, ctx);
  const t = inl(o.szoveg || '');
  switch (o.forma) {
    case 'gomb': return `<button type="button" class="bc-btn">${t}</button>`;
    case 'gomb2': return `<div class="bb-demo-sor">${(o.szoveg || '').split(' | ').map((g, i) => `<button type="button" class="bc-btn${i ? '' : ''}">${inl(g)}</button>`).join('')}</div>`;
    case 'hiba': return `<div class="bc-field bb-demo-keskeny"><span class="bc-label">E-mail</span><input class="bc-input" value="nev@" aria-label="E-mail (minta)" aria-invalid="true" readonly><p class="bc-error">${t}</p></div>`;
    case 'uzenet': return `<div class="bc-alert is-info"><p>${t}</p></div>`;
    case 'siker': return `<div class="bc-alert is-success"><p>${t}</p></div>`;
    case 'meh': return `<div class="bb-demo-sor bb-demo-meh"><img src="ds/web/assets/brand/${o.kep || 'bee-cheer'}.webp" alt="" width="56" height="56"><p class="bb-vizual-szoveg">${t}</p></div>`;
    case 'szam': return `<div class="bc-stat bb-demo-keskeny"><p class="bc-stat-value">${t}</p></div>`;
    default: return `<p class="bb-vizual-szoveg">${t}</p>`;
  }
}
function ddFig(o, jo, ctx) {
  return `<figure class="bb-dd ${jo ? 'is-do' : 'is-dont'}"><figcaption><span class="bb-dd-jel" aria-hidden="true">${jo ? '✓' : '✗'}</span> ${jo ? 'Így' : 'Ne így'}${o.felirat || o.cim ? ` – ${inl(o.felirat || o.cim)}` : ''}</figcaption><div class="bb-dd-vizual" inert>${vizual(o, ctx)}</div>${o.miert ? `<p class="bb-dd-miert">${inl(o.miert)}</p>` : ''}</figure>`;
}
function dodont(b, ctx) {
  const parok = (b.parok || []).map(p => `<div class="bb-dd-par">${ddFig(p.jo, true, ctx)}${ddFig(p.rossz, false, ctx)}${p.miert ? `<p class="bb-dd-miert is-kozos">${inl(p.miert)}</p>` : ''}</div>`).join('');
  if (b.allapot === 'javaslat' && !(b.forras && b.forras.length)) hibak.push(`${ctx}: javaslat-szintű DO/DON'T forrás nélkül („${b.cim || ''}”)`);
  const jel = b.allapot === 'javaslat' ? '<span class="bc-badge is-warning">Jóváhagyásra vár</span>' : b.allapot === 'szabaly' ? '<span class="bc-badge is-success">Szabály</span>' : '';
  return `<section class="bb-dodont"${b.cim ? ` aria-labelledby="${slug(ctx + '-dd-' + b.cim)}"` : ''}>${b.cim ? `<div class="bb-blokk-fej">${jel}<h3 id="${slug(ctx + '-dd-' + b.cim)}">${inl(b.cim)}</h3></div>` : ''}${parok}${forrasLista(b.forras)}</section>`;
}

// ---------- blokkok ----------
const JEL = { kozos: ['●', 'közös'], reszben: ['◐', 'részben'], elter: ['✗', 'eltér'], nincs: ['—', 'nem értelmezhető'] };
function jel(j) { const [s, t] = JEL[j] || JEL.nincs; return `<span class="bb-jel is-${j || 'nincs'}" aria-hidden="true">${s}</span><span class="bc-sr">${t}: </span>`; }
function forrasLista(f) {
  if (!f || (Array.isArray(f) && !f.length)) return '';
  const l = (Array.isArray(f) ? f : [f]).map(x => `<li>${inl(x)}</li>`).join('');
  return `<details class="bb-forras"><summary>Forrás</summary><ul>${l}</ul></details>`;
}
function blokk(b, ctx) {
  switch (b.t) {
    case 'h2': return `<h2 id="${b.id || slug(b.x)}">${inl(b.x)}</h2>`;
    case 'h3': return `<h3 id="${b.id || slug(b.x)}">${inl(b.x)}</h3>`;
    case 'p': return `<p>${inl(b.x)}</p>`;
    case 'lead': return `<p class="bb-lead">${inl(b.x)}</p>`;
    case 'lista': return `<ul class="bb-list">${b.elemek.map(e => `<li>${inl(e)}</li>`).join('')}</ul>`;
    case 'szamozott': return `<ol class="bb-list">${b.elemek.map(e => `<li>${inl(e)}</li>`).join('')}</ol>`;
    case 'szabaly': case 'javaslat': case 'hianyzik': case 'tilos': case 'hivatalos': {
      if ((b.t === 'javaslat' || b.t === 'hivatalos') && !(b.forras && b.forras.length)) hibak.push(`${ctx}: ${b.t}-blokk forrás nélkül („${b.cim || ''}”)`);
      const jelveny = { szabaly: '<span class="bc-badge is-success">Szabály</span>', javaslat: '<span class="bc-badge is-warning">Jóváhagyásra vár</span>', hivatalos: '<span class="bc-badge is-info">Hivatalos szöveg</span>',
        hianyzik: '<span class="bc-badge is-muted">Hiányzik</span>', tilos: '<span class="bc-badge is-danger">Tilos</span>' }[b.t];
      const tor = (b.x ? (Array.isArray(b.x) ? b.x : [b.x]).map(p => `<p>${inl(p)}</p>`).join('') : '') + (b.elemek ? `<ul class="bb-list">${b.elemek.map(e => `<li>${inl(e)}</li>`).join('')}</ul>` : '');
      return `<section class="bc-card is-flat bb-blokk is-${b.t}"${b.cim ? ` aria-labelledby="${slug(ctx + '-' + b.cim)}"` : ''}><div class="bb-blokk-fej">${jelveny}${b.cim ? `<h3 id="${slug(ctx + '-' + b.cim)}">${inl(b.cim)}</h3>` : ''}</div>${tor}${forrasLista(b.forras)}</section>`;
    }
    case 'pelda': return dodont({ parok: [{ jo: { szoveg: b.jo, forma: b.forma, felirat: b.jo_felirat }, rossz: { szoveg: b.rossz, forma: b.forma, felirat: b.rossz_felirat }, miert: b.miert }] }, ctx);
    case 'dodont': return dodont(b, ctx);
    case 'tabla': return tabla(b.fej, b.sorok, b.cim);
    case 'kep': return `<figure class="bb-kep${b.sotet ? ' is-sotet' : ''}"><img src="${esc(b.src)}" alt="${esc(b.alt)}" loading="lazy"${b.w ? ` width="${b.w}" height="${b.h}"` : ''}>${b.felirat ? `<figcaption>${inl(b.felirat)}</figcaption>` : ''}</figure>`;
    case 'tovabb': return `<nav class="bb-tovabb" aria-label="Tovább">${b.linkek.map(l => `<a class="bc-btn is-secondary" href="${esc(l.href)}">${esc(l.x)}${ic('tovabb')}</a>`).join('')}</nav>`;
    case 'gen': { const g = GEN[b.nev]; if (!g) { hibak.push(`${ctx}: ismeretlen generátor: ${b.nev}`); return ''; } return g(b); }
    default: hibak.push(`${ctx}: ismeretlen blokktípus: ${b.t}`); return '';
  }
}
function tabla(fej, sorok, cim) {
  return `<div class="bc-table-wrap bb-tabla" tabindex="0" role="region" aria-label="${esc(cim || 'Táblázat')}"><table class="bc-table">${cim ? `<caption class="bc-sr">${esc(cim)}</caption>` : ''}<thead><tr>${fej.map(h => `<th scope="col">${inl(h)}</th>`).join('')}</tr></thead><tbody>${sorok.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${inl(c)}</th>` : `<td>${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

// ---------- generált részek ----------
const genCss = [];   // bb/gen.css: színminták, méretminták (tokenekből, nem inline)
const SZINCSALAD = [
  ['Méz', ['honey', 'honey-deep', 'butter']],
  ['Krém és papír', ['cream', 'paper', 'white']],
  ['Zöldek', ['olive', 'olive-strong', 'olive-soft', 'forest', 'leaf', 'lime', 'sage', 'sage-bg', 'sprout']],
  ['Meleg színek', ['blossom', 'blossom-bg', 'berry', 'red', 'crimson', 'blush', 'ember', 'rust']],
  ['Hideg színek', ['sky', 'sky-bg', 'ice', 'water', 'navy', 'focus']],
  ['Semlegesek', ['black', 'coal', 'graphite', 'slate', 'silver', 'mist']],
  ['Éjszaka (sötét mód)', ['night', 'night-surface', 'night-line']],
];
const NEV_HU = { honey: 'méz', 'honey-deep': 'nyomott méz', butter: 'vaj', cream: 'krém', paper: 'papír', white: 'fehér', olive: 'olíva', 'olive-strong': 'erős olíva',
  'olive-soft': 'halvány olíva', forest: 'erdő', leaf: 'levél', lime: 'lime', sage: 'zsálya', 'sage-bg': 'halvány zsálya', sprout: 'hajtás', blossom: 'rózsa',
  'blossom-bg': 'halvány rózsa', berry: 'bogyó', red: 'piros', crimson: 'bíbor', blush: 'pirosas', ember: 'parázs', rust: 'rozsda', sky: 'égkék', 'sky-bg': 'halvány égkék',
  ice: 'jég', water: 'víz', navy: 'mélykék', focus: 'fókuszkék', black: 'fekete', coal: 'szén', graphite: 'grafit', slate: 'pala', silver: 'ezüst', mist: 'köd',
  night: 'éjszaka', 'night-surface': 'éjszakai felület', 'night-line': 'éjszakai vonal' };
function swatch(n) {
  genCss.push(`.bb-sw-c[data-c="${n}"] { background: var(--bc-${n}); }`);
  return `<li class="bb-sw"><span class="bb-sw-c" data-c="${n}"></span><span class="bb-sw-t"><strong>${esc(NEV_HU[n] || n)}</strong><code>--bc-${esc(n)}</code><button type="button" class="bb-masol" data-masol="${hex(n)}" aria-label="${esc((NEV_HU[n] || n) + ' színkód másolása: ' + hex(n))}"><code>${hex(n)}</code>${ic('masol')}</button></span></li>`;
}
const GEN = {
  paletta() {
    const mind = new Set(Object.keys(core.color));
    const html = SZINCSALAD.map(([cim, l]) => { l.forEach(n => mind.delete(n)); return `<h3>${esc(cim)}</h3><ul class="bb-swatches">${l.filter(n => core.color[n]).map(swatch).join('')}</ul>`; }).join('');
    const tobbi = [...mind].filter(n => /^#/.test(core.color[n]));
    return html + (tobbi.length ? `<h3>További</h3><ul class="bb-swatches">${tobbi.map(swatch).join('')}</ul>` : '');
  },
  szerepek() {
    const L = termek.color.light, D = termek.color.dark;
    const sor = r => { genCss.push(`.bb-sw-c[data-r="${r}"] { background: var(--bc-${r}); }`);
      return [`<span class="bb-sw-c is-kicsi" data-r="${r}" aria-hidden="true"></span> \`--bc-${r}\``, `${NEV_HU[L[r]] || L[r]} \`${hex(L[r])}\``, `${NEV_HU[D[r]] || D[r]} \`${hex(D[r])}\``]; };
    const sorok = Object.keys(L).map(sor);
    return `<div class="bc-table-wrap bb-tabla" tabindex="0" role="region" aria-label="Színszerepek"><table class="bc-table"><thead><tr><th scope="col">Szerep (ezt használd)</th><th scope="col">Világos</th><th scope="col">Sötét</th></tr></thead><tbody>${sorok.map(r => `<tr><th scope="row">${r[0].replace(/`([^`]+)`/, '<code>$1</code>')}</th><td>${inl(r[1])}</td><td>${inl(r[2])}</td></tr>`).join('')}</tbody></table></div>`;
  },
  betuk() {
    const fs_ = Object.entries(core.fontSize).reverse();
    const minta = fs_.map(([k, v]) => { const disp = ['3xl', '2xl', 'xl', 'l'].includes(k); genCss.push(`.bb-fs-${k} { font-size: var(--bc-fs-${k}); }`);
      return `<li class="bb-tipo"><span class="bb-tipo-meta"><code>--bc-fs-${k}</code> ${v} px</span><span class="bb-fs-${k}${disp ? ' bb-display' : ''}">${disp ? 'Zümmögő méhecske' : 'A méhecske virágról virágra száll, és közben tanít.'}</span></li>`; }).join('');
    return `<div class="bb-ket"><div class="bc-card is-flat"><p class="bb-display bb-fs-2xl">Lalezar</p><p>Cím, szám, gomb – egyetlen vastagság. Hangos, barátságos.</p><p><code>--bc-font-display</code></p></div><div class="bc-card is-flat"><p class="bb-fs-2xl bb-semibold">Open Sans</p><p>Minden más szöveg: 400 · 600 · 700. Nyugodt, jól olvasható.</p><p><code>--bc-font-body</code></p></div></div><h3>Betűskála</h3><ul class="bb-tipolista">${minta}</ul>`;
  },
  terkoz() {
    return `<ul class="bb-terkoz">${Object.entries(core.space).map(([k, v]) => { genCss.push(`.bb-sp-${k} { width: var(--bc-sp-${k}); }`); return `<li><code>--bc-sp-${k}</code><span class="bb-sp-bar bb-sp-${k}" aria-hidden="true"></span><span>${v} px</span></li>`; }).join('')}</ul>`;
  },
  forma() {
    const r = termek.radius, s = termek.shadow || {};
    const sarkok = Object.entries(r).map(([k, v]) => { genCss.push(`.bb-r-${k} { border-radius: var(--bc-r-${k}); }`); return `<li><span class="bb-forma-minta bb-r-${k}" aria-hidden="true"></span><code>--bc-r-${k}</code> ${v === 999 ? 'kapszula' : v + ' px'}</li>`; }).join('');
    const arnyek = ['s', 'm', 'l'].map(k => { genCss.push(`.bb-sh-${k} { box-shadow: var(--bc-shadow-${k}); }`); return `<li><span class="bb-forma-minta bb-sh-${k}" aria-hidden="true"></span><code>--bc-shadow-${k}</code> ${Array.isArray(s[k]) ? `${s[k][0]} px jobbra, ${s[k][1]} px le, elmosás nélkül` : ''}</li>`; }).join('');
    genCss.push('.bb-sh-soft { box-shadow: var(--bc-shadow-soft); }');
    return `<h3>Sarok (termékbőr)</h3><ul class="bb-forma">${sarkok}</ul><h3>Árnyék (termékbőr)</h3><ul class="bb-forma">${arnyek}<li><span class="bb-forma-minta bb-sh-soft" aria-hidden="true"></span><code>--bc-shadow-soft</code> puha – csak nem kattintható dobozon</li></ul>`;
  },
  mozgas() {
    const d = Object.entries(core.duration).map(([k, v]) => [`\`--bc-t-${k}\``, `${v} ms`, { fast: 'gomb, kapcsoló, rámutatás', base: 'megjelenés, lenyíló', slow: 'fiók, nagyobb panel', press: 'lenyomás' }[k] || '']);
    const e = Object.entries(core.easing).map(([k, v]) => [`\`--bc-ease-${k}\``, `\`${v}\``, { out: 'alapértelmezés', 'in-out': 'helyben átalakuló elem', drawer: 'fiók, lap', bounce: 'csak jutalom (csillag, jelvény)' }[k] || '']);
    return tabla(['Időtartam', 'Érték', 'Mire'], d, 'Időtartamok') + tabla(['Görbe', 'Érték', 'Mire'], e, 'Görbék');
  },
  adatskala() {
    const d = core.data || {};
    return Object.entries(d).filter(([k, v]) => Array.isArray(v) && v.every(x => /^#/.test(x))).map(([k, v]) => {
      const l = v.map((c, i) => { genCss.push(`.bb-ds[data-s="${k}-${i}"] { background: ${c}; }`); return `<span class="bb-ds" data-s="${k}-${i}" title="${c}"></span>`; }).join('');
      return `<div class="bb-adatskala"><code>${esc(k)}</code><span class="bb-ds-sor" role="img" aria-label="${esc(k)} skála: ${esc(v.join(', '))}">${l}</span></div>`;
    }).join('') + '<p class="bc-muted">A skálák nyers értékei az adatgrafikon-tokenek (<code>tokens/core.json → data</code>); a felületen a grafikon-komponensek használják őket.</p>';
  },
  borok() {
    // a DESIGN.md „Két bőr” táblája – egy forrás
    const md = read('DESIGN.md'), i = md.indexOf('## Két bőr'), sorok = md.slice(i).split('\n').filter(l => l.startsWith('|'));
    const cells = l => l.split('|').slice(1, -1).map(c => c.trim().replace(/\*\*/g, ''));
    const fej = cells(sorok[0]); fej[0] = 'Jellemző';
    const test = sorok.slice(2).map(cells);
    if (!test.length) hibak.push('borok: a DESIGN.md „Két bőr” táblája üres');
    return tabla(fej, test, 'A két bőr összevetése');
  },
  borminta() {
    return `<div class="bb-mintasor is-ket">${['admin', 'jatek'].map(id => mintaKeret(feluletek.find(f => f.id === id), id === 'admin' ? 'Termékbőr' : 'Játékbőr')).join('')}</div>`;
  },
  hangszerepek() {
    const kep = k => `ds/web/assets/brand/${k.includes('/') ? k : k}.webp`;
    return `<ul class="bb-mehek">${Object.entries(hangnem.szerepek).map(([id, s]) => {
      if (hangnem.tiltott_kepek.includes(s.kep)) hibak.push(`hang: tiltott kép a szerepek között: ${s.kep}`);
      return `<li class="bc-card is-flat bb-meh"><img src="${kep(s.kep)}" alt="" width="96" height="96" loading="lazy"><div><h3>${esc(id.replace('hazigazda', 'házigazda').replace('futar', 'futár').replace('szurkolo', 'szurkoló').replace('piheno', 'pihenő').replace('gondolkodo', 'gondolkodó').replace('hirvivo', 'hírvivő').replace('halas', 'hálás').replace('kacsinto', 'kacsintó').replace('szomoru', 'szomorú').replace('tevekeny', 'tevékeny'))}</h3><p class="bb-meh-erzelem">${esc(s.erzelem)}</p><p>${esc(s.mikor)}</p></div></li>`;
    }).join('')}</ul>`;
  },
  pillanatok() {
    const sorok = Object.entries(hangnem.pillanatok).map(([id, p]) => [id.replace(/-/g, ' '), p.meh, p.valtozatok.map(v => `„${v.poen}”`).join(' · '), p.valtozatok.map(v => `„${v.sima}”`).join(' · ')]);
    return tabla(['Pillanat', 'Méhecske', 'Szóviccel', 'Simán'], sorok, 'Szövegpillanatok');
  },
  utak() {
    return `<ul class="bb-utak">${Object.entries(UTAK).map(([id, u]) => `<li><a class="bc-card is-interactive bb-ut" href="${FEJEZETEK.find(f => f.id === u.lepesek[0]).file}?ut=${id}" data-ut="${id}"><span class="bb-ut-nev">${esc(u.nev)}</span><span class="bb-ut-le">${esc(u.leiras)}</span><span class="bb-ut-lepesek">${u.lepesek.map(l => esc(FEJEZETEK.find(f => f.id === l).cim)).join(' → ')}</span><span class="bb-ut-go">Indulás${ic('tovabb')}</span></a></li>`).join('')}</ul>`;
  },
  csempek() {
    return `<ul class="bb-csempek">${feluletek.map(f => `<li><a class="bc-card is-interactive bb-csempe" href="felulet-${f.id}.html"><span class="bb-csempe-nev">${esc(f.nev)}</span><span class="bb-csempe-bor">${esc(f.bor_nev)}</span><span class="bb-csempe-le">${esc(f.rovid)}</span></a></li>`).join('')}</ul>`;
  },
  matrix() {
    const SOROK = [['mez', 'Méz-szín'], ['tinta', 'Tinta és vonal'], ['hatter', 'Háttér'], ['sarok', 'Sarok'], ['arnyek', 'Árnyék'], ['betu', 'Betű'], ['sotet', 'Sötét mód'],
      ['suruseg', 'Sűrűség'], ['ds', 'Kapcsolat a DS-sel'], ['technika', 'Technika']];
    const head = `<tr><th scope="col">Jellemző</th>${feluletek.map(f => `<th scope="col"><a href="felulet-${f.id}.html">${esc(f.nev)}</a></th>`).join('')}</tr>`;
    const body = SOROK.map(([k, cim]) => `<tr><th scope="row">${esc(cim)}</th>${feluletek.map(f => {
      const c = (f.ertekek || {})[k];
      if (!c) { hibak.push(`matrix: ${f.id}.${k} hiányzik`); return '<td>—</td>'; }
      if (!c.forras) hibak.push(`matrix: ${f.id}.${k} forrás nélkül`);
      return `<td>${jel(c.jel)}${inl(c.ertek)}${c.forras ? `<span class="bb-cella-forras">${esc(c.forras)}</span>` : ''}</td>`;
    }).join('')}</tr>`).join('');
    return `<div class="bb-jelmagyarazat" aria-hidden="true">${Object.entries(JEL).map(([k, [s, t]]) => `<span>${`<span class="bb-jel is-${k}">${s}</span>`} ${t}</span>`).join('')}</div><div class="bc-table-wrap bb-tabla bb-matrix" tabindex="0" role="region" aria-label="A hat felület összevetése"><table class="bc-table is-fixed"><caption class="bc-sr">A hat felület összevetése: ● közös, ◐ részben, ✗ eltér</caption><thead>${head}</thead><tbody>${body}</tbody></table></div><p class="bc-muted bb-kicsi">Felmérve: ${esc([...new Set(feluletek.map(f => f.felmeres && f.felmeres.datum).filter(Boolean))].join(', '))} · frissítés: <code>node tools/brandbook-felmeres.js --forras ~/CLAUDE</code></p>`;
  },
  mintasor() {
    return `<div class="bb-mintasor">${feluletek.map(f => mintaKeret(f)).join('')}</div><p class="bc-muted bb-kicsi">Az app és a Kaptár mintáját a forráskódjukban talált értékekből rajzoljuk újra – a valódi képernyőt a felület oldalán találod leírva.</p>`;
  },
  katalogus() {
    const md = read('docs/komponens-katalogus.md');
    const reszek = md.split('\n## ').slice(1).map(r => { const cim = r.split('\n')[0]; const m = r.match(/\*\*Komponensek:\*\* (.+)/); return { cim, k: m ? m[1].split(', ') : [] }; }).filter(r => r.k.length);
    const ossz = reszek.reduce((a, r) => a + r.k.length, 0);
    if (ossz < 50) hibak.push(`katalogus: gyanúsan kevés komponens (${ossz})`);
    return `<p><strong>${ossz} React-komponens</strong> ${reszek.length} csoportban – a felsorolás a <code>docs/komponens-katalogus.md</code>-ből generálódik.</p>${reszek.map(r => `<details class="bb-kat"><summary><span>${esc(r.cim)}</span><span class="bc-badge is-muted">${r.k.length}</span></summary><ul class="bb-tagek">${r.k.map(k => `<li><code>${esc(k)}</code></li>`).join('')}</ul></details>`).join('')}`;
  },
  elemminta() {
    return `<div class="bb-elemminta">
<div class="bb-elemsor"><button type="button" class="bc-btn">Mentés</button><button type="button" class="bc-btn is-secondary">Mégse</button><button type="button" class="bc-btn is-ghost">Részletek</button><button type="button" class="bc-btn is-danger">Törlés</button><button type="button" class="bc-btn" disabled>Tiltott</button></div>
<div class="bb-elemsor"><span class="bc-badge is-success">Kész</span><span class="bc-badge is-warning">Folyamatban</span><span class="bc-badge is-danger">Hiba</span><span class="bc-badge is-info">Új</span><span class="bc-badge is-muted">Archív</span><span class="bc-badge is-accent">Kiemelt</span></div>
<div class="bb-ket"><div class="bc-field"><label class="bc-label" for="bb-minta-nev">Név</label><input class="bc-input" id="bb-minta-nev" placeholder="pl. Kert utcai közösségi kert"></div><div class="bc-field"><label class="bc-label" for="bb-minta-hiba">E-mail</label><input class="bc-input" id="bb-minta-hiba" value="nev@" aria-invalid="true" aria-describedby="bb-minta-hiba-uz"><p class="bc-error" id="bb-minta-hiba-uz">Hiányzik a @ utáni rész – például: nev@pelda.hu</p></div></div>
<div class="bb-ket"><div class="bc-card"><h3 class="bc-card-title">Kártya</h3><p>Felület kemény árnyékkal – kattintható tartalomhoz.</p></div><div class="bc-alert is-info"><p><strong>Tudtad?</strong> Képernyőnként legfeljebb egy méz fő gomb van.</p></div></div>
</div>`;
  },
  valtozasok() {
    const l = read('CHANGELOG.md').split('\n').filter(s => /^## \d/.test(s)).slice(0, 6).map(s => s.replace(/^## /, ''));
    return `<ul class="bb-valtozasok">${l.map(s => { const [v, d, ...t] = s.split(' – '); return `<li><code>${esc(v)}</code> <span class="bc-muted">${esc(d || '')}</span> ${esc(t.join(' – '))}</li>`; }).join('')}</ul><p class="bc-muted bb-kicsi">A teljes lista: <a href="https://github.com/hegebeeco/beeco-design-system/blob/main/CHANGELOG.md" rel="noopener">CHANGELOG.md</a></p>`;
  },
  logo() {
    return `<div class="bb-logok"><figure class="bb-logo is-vilagos"><img src="ds/web/assets/brand/logo.webp" alt="beeco logó – világos háttérre" width="240" height="96"><figcaption>Világos háttérre: <code>logo.webp</code></figcaption></figure><figure class="bb-logo is-sotet"><img src="ds/web/assets/brand/logo-sotet.webp" alt="beeco logó – sötét háttérre" width="240" height="96"><figcaption>Sötét háttérre: <code>logo-sotet.webp</code></figcaption></figure></div>`;
  },
  letoltesek() {
    const L = [
      ['Logó', [['logo.webp', 'ds/web/assets/brand/logo.webp', 'világos háttérre'], ['logo-sotet.webp', 'ds/web/assets/brand/logo-sotet.webp', 'sötét háttérre'], ['ikon-512.png', 'ds/web/assets/brand/ikon-512.png', 'app- és profilkép']]],
      ['Méhecskék', [['bee-happy.webp', 'ds/web/assets/brand/bee-happy.webp', 'házigazda'], ['bee-cheer.webp', 'ds/web/assets/brand/bee-cheer.webp', 'szurkoló'], ['bee-super.webp', 'ds/web/assets/brand/bee-super.webp', 'futár'], ['bee-phone.webp', 'ds/web/assets/brand/bee-phone.webp', 'hírvivő']]],
      ['Tokenek', [['beeco-tokens.css', 'ds/dist/css/beeco-tokens.css', 'CSS-változók (web)'], ['tokens.json', 'ds/dist/tokens.json', 'minden érték, gépi formában'], ['webflow-valtozok.json', 'ds/dist/weboldal/webflow-valtozok.json', 'Webflow-változók'], ['beeco_tokens.dart', 'ds/dist/dart/beeco_tokens.dart', 'Flutter (mobil app)'], ['preset.cjs', 'ds/dist/tailwind/preset.cjs', 'Tailwind-preset (partner)'], ['_beeco.scss', 'ds/dist/scss/_beeco.scss', 'SCSS (admin)']]],
      ['Betűk', [['Lalezar (woff2)', 'ds/web/assets/fonts/lalezar-latin-ext.woff2', 'SIL Open Font License 1.1'], ['beeco-fonts.css', 'ds/dist/css/beeco-fonts.css', 'betűbetöltő']]],
    ];
    return L.map(([cim, l]) => `<h3>${esc(cim)}</h3><ul class="bb-letolt">${l.map(([n, h, le]) => {
      const p = path.join(OUT, h); const kb = fs.existsSync(p) ? Math.max(1, Math.round(fs.statSync(p).size / 1024)) : null;
      if (kb === null) hibak.push(`letoltesek: hiányzó fájl: ${h}`);
      return `<li><a class="bc-btn is-secondary" href="${esc(h)}" download>${ic('letolt')}${esc(n)}</a><span>${esc(le)}${kb ? ` · ${kb} KB` : ''}</span></li>`;
    }).join('')}</ul>`).join('');
  },
};

// ---------- élő minták (iframe, hogy a bőrök ne keveredjenek) ----------
function mintaKeret(f, felirat) {
  if (!f) return '';
  return `<figure class="bb-minta"><iframe src="minta/${f.id}.html" title="${esc(f.nev)} – élő minta: gomb, kártya, mező" loading="lazy" data-minta="${f.id}"></iframe><figcaption><strong>${esc(felirat || f.nev)}</strong>${f.minta && f.minta.utanzat ? ' <span class="bc-badge is-muted">forrásból utánozva</span>' : ''}</figcaption></figure>`;
}
function mintaOldal(f) {
  const m = f.minta || {};
  const head = t => `<!doctype html><html lang="hu" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(f.nev)} – minta</title>${t}<script src="../bb/minta.js"></script></head>`;
  const tartalomHtml = (cls) => `<main class="${cls.wrap}"><div class="${cls.row}"><button type="button" class="${cls.btn}">${esc(m.gomb || 'Mentés')}</button><button type="button" class="${cls.btn2}">Mégse</button></div><div class="${cls.card}"><p class="${cls.cardTitle}">${esc(m.kartya || 'Közösségi kert')}</p><p class="${cls.cardText}">${esc(m.kartyaSzoveg || 'Kert utca 12. · ma nyitva')}</p></div><label class="${cls.label}" for="m">Név</label><input class="${cls.input}" id="m" value="Méhecske"></main>`;
  let html;
  if (m.tipus === 'termek') {
    html = head('<link rel="stylesheet" href="../ds/termek/css/bc-all.css"><link rel="stylesheet" href="../bb/minta.css">') + `<body class="mt-termek${m.suru ? ' is-suru' : ''}">` + tartalomHtml({ wrap: 'mt-wrap', row: 'mt-row', btn: `bc-btn${m.suru ? ' is-sm' : ''}`, btn2: `bc-btn is-secondary${m.suru ? ' is-sm' : ''}`, card: 'bc-card mt-card', cardTitle: 'bc-card-title', cardText: 'bc-muted', label: 'bc-label', input: 'bc-input' }) + '</body></html>';
  } else if (m.tipus === 'jatek') {
    html = head('<link rel="stylesheet" href="../ds/web/css/fonts.css"><link rel="stylesheet" href="../ds/web/css/tokens.css"><link rel="stylesheet" href="../ds/web/css/ds.css"><link rel="stylesheet" href="../bb/minta.css">') + '<body class="mt-jatek">' + tartalomHtml({ wrap: 'mt-wrap', row: 'mt-row', btn: 'ds-btn', btn2: 'ds-btn is-secondary', card: 'ds-card mt-card', cardTitle: 'mt-cim', cardText: 'mt-halk', label: 'mt-label', input: 'mt-input' }) + '</body></html>';
  } else {
    // forrásból utánozva: a felmért értékekből generált, saját osztályú CSS (a nyers értékek a felület saját értékei, nem DS-tokenek)
    const v = m.ertekek || {};
    const css = `/* GENERÁLT – ${f.nev} mintája a forrásában talált értékekből (${(f.felmeres && f.felmeres.forras || []).join(', ')}). Nem DS-token: összevetéshez. */
@import url("../ds/dist/css/beeco-fonts.css");
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
`;
    for (const k of ['bg', 'ink', 'surface', 'line', 'btnBg', 'btnInk', 'radius']) if (!v[k]) hibak.push(`minta ${f.id}: hiányzó érték: ${k}`);
    fs.writeFileSync(path.join(OUT, 'minta', `${f.id}.css`), css);
    html = head(`<link rel="stylesheet" href="${f.id}.css"><link rel="stylesheet" href="../bb/minta.css">`) + `<body class="mt-utanzat${m.nincsSotet ? ' nincs-sotet' : ''}">` + tartalomHtml({ wrap: 'mt-wrap', row: 'mt-row', btn: 'mu-btn', btn2: 'mu-btn2', card: 'mu-card mt-card', cardTitle: 'mu-cim', cardText: 'mu-halk', label: 'mu-label', input: 'mu-input' }) + '</body></html>';
  }
  fs.writeFileSync(path.join(OUT, 'minta', `${f.id}.html`), html);
}

// ---------- komponensek (atom → sablon), élő mintával, használati jegyzettel és képes DO / DON'T-tal ----------
const SZINT_SORREND = ['atom', 'molekula', 'organizmus', 'sablon'];
const szintNev = id => (KOMP.szintek.find(x => x.id === id) || { nev: id }).nev;
function tesztlapRész(nevek, kid) {
  return (nevek || []).map(n => {
    const t = TESZT.find(x => x.nev === n);
    if (!t) { hibak.push(`komponens ${kid}: ismeretlen tesztlap: ${n}`); return ''; }
    const src = `ds/termek/tesztlapok/${n}.html`;
    return `<details class="bb-teszt"><summary><span>Élő React-komponens minden állapotban: <strong>${esc(t.cim)}</strong></span></summary><p class="bc-muted bb-kicsi">${esc(t.leiras || '')}</p><iframe data-src="${src}" title="${esc(t.cim)} – élő tesztlap" loading="lazy"></iframe><p><a href="${src}" target="_blank" rel="noopener">Megnyitás külön lapon</a></p></details>`;
  }).join('');
}
function komponensKartya(k) {
  const ctx = `komponens ${k.id}`;
  for (const m of ['nev', 'szint', 'leiras', 'minta_html']) if (!k[m]) hibak.push(`${ctx}: hiányzik: ${m}`);
  if (!(k.do || []).length || !(k.dont || []).length) hibak.push(`${ctx}: kell legalább egy DO és egy DON'T`);
  const lista = l => `<ul class="bb-list">${(l || []).map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
  const kodok = l => (l || []).map(x => `<code>${esc(x)}</code>`).join(' ');
  return `<article class="bb-komp" aria-labelledby="${esc(k.id)}">
<header class="bb-komp-fej"><h2 id="${esc(k.id)}">${esc(k.nev)}</h2><span class="bc-badge is-accent">${esc(szintNev(k.szint))}</span>${k.csoport ? `<span class="bc-badge is-muted">${esc(k.csoport)}</span>` : ''}</header>
<p class="bb-komp-le">${inl(k.leiras)}</p>
<dl class="bb-komp-meta">${(k.react || []).length ? `<div><dt>React</dt><dd>${kodok(k.react)}</dd></div>` : ''}${(k.css || []).length ? `<div><dt>CSS</dt><dd>${kodok(k.css)}</dd></div>` : ''}</dl>
<div class="bb-demo" role="group" aria-label="${esc(k.nev)} – élő minta"><p class="bb-demo-cim">Élő minta</p>${htmlEllenor(k.minta_html || '', ctx)}</div>
<div class="bb-ket bb-mikor-sor"><section class="bb-mikor is-igen"><h3>Mikor használd</h3>${lista(k.mikor)}</section><section class="bb-mikor is-ne"><h3>Mikor ne – és mit helyette</h3>${lista(k.mikor_ne)}</section></div>
<div class="bb-dd-racs">${(k.do || []).map(d => ddFig(d, true, ctx)).join('')}${(k.dont || []).map(d => ddFig(d, false, ctx)).join('')}</div>
${tesztlapRész(k.tesztlap, k.id)}
${forrasLista(k.forras)}
</article>`;
}
function elemekOldalak() {
  const lefed = new Set(KOMP.komponensek.flatMap(k => k.tesztlap || []));
  const hiany = TESZT.filter(t => !lefed.has(t.nev)).map(t => t.nev);
  if (KOMP.komponensek.length && hiany.length) hibak.push(`elemek: tesztlap komponens nélkül: ${hiany.join(', ')}`);
  const ids = new Set(); for (const k of KOMP.komponensek) { if (ids.has(k.id)) hibak.push(`elemek: kétszer szereplő azonosító: ${k.id}`); ids.add(k.id); }
  for (const sz of SZINT_SORREND) {
    const l = KOMP.komponensek.filter(k => k.szint === sz);
    if (!l.length) continue;
    const info = KOMP.szintek.find(x => x.id === sz) || {};
    const i = SZINT_SORREND.indexOf(sz), elozo = SZINT_SORREND.slice(0, i).reverse().find(x => KOMP.komponensek.some(k => k.szint === x)), kov = SZINT_SORREND.slice(i + 1).find(x => KOMP.komponensek.some(k => k.szint === x));
    const torzs = `<p class="bb-vissza"><a href="elemek.html">← Elemek</a></p><header class="bb-fej"><h1>${esc(info.nev || sz)}</h1><p class="bb-lead">${inl(info.leiras || '')}</p></header>
<nav class="bb-komp-ugro" aria-label="${esc(info.nev || sz)} – ugrás"><ul>${l.map(k => `<li><a href="#${esc(k.id)}">${esc(k.nev)}</a></li>`).join('')}</ul></nav>
${l.map(komponensKartya).join('\n')}
<nav class="bb-tovabb" aria-label="Szintek">${elozo ? `<a class="bc-btn is-secondary" href="elemek-${elozo}.html">← ${esc(szintNev(elozo))}</a>` : ''}${kov ? `<a class="bc-btn is-secondary" href="elemek-${kov}.html">${esc(szintNev(kov))}${ic('tovabb')}</a>` : ''}</nav>`;
    fs.writeFileSync(path.join(OUT, `elemek-${sz}.html`), oldal({ id: `elemek-${sz}`, cim: info.nev || sz, leiras: info.leiras, torzs, fejezet: '6. fejezet · Elemek' }));
  }
}
GEN.szintek = () => {
  if (!KOMP.komponensek.length) { hibak.push('elemek: hiányzik a brandbook/elemek/komponensek.json'); return ''; }
  return `<ul class="bb-csempek">${SZINT_SORREND.filter(sz => KOMP.komponensek.some(k => k.szint === sz)).map(sz => { const info = KOMP.szintek.find(x => x.id === sz) || {}; const l = KOMP.komponensek.filter(k => k.szint === sz);
    return `<li><a class="bc-card is-interactive bb-csempe" href="elemek-${sz}.html"><span class="bb-csempe-nev">${esc(info.nev || sz)}</span><span class="bb-csempe-bor">${l.length} komponens</span><span class="bb-csempe-le">${esc(l.slice(0, 6).map(k => k.nev).join(' · '))}${l.length > 6 ? ' …' : ''}</span></a></li>`; }).join('')}</ul>`;
};
GEN.tesztlapok = () => `<ul class="bb-tesztlista">${TESZT.map(t => `<li><a href="ds/termek/tesztlapok/${esc(t.nev)}.html" target="_blank" rel="noopener"><strong>${esc(t.cim)}</strong><span>${esc(t.leiras || '')}</span></a></li>`).join('')}</ul>`;

// ---------- ikonikus képernyők (felületenként 1–2), kapcsolható DS-jelölésekkel ----------
function kepernyoResz(fid) {
  const l = KEPERNYOK.filter(k => k.felulet === fid);
  if (!l.length) return '';
  return `<h2 id="ikonikus-kepernyok">Ikonikus képernyők</h2><p>A képernyők a design system elemeiből épülnek. A <strong>DS-jelölések</strong> gombbal megmutatod, melyik rész melyik elem – a számok a lista sorai.</p>` + l.map(k => {
    const src = k.url || `kepernyok/${k.file}`;
    if (!k.url && !fs.existsSync(path.join(BB, 'kepernyok', k.file))) hibak.push(`képernyő ${k.id}: hiányzik a fájl: ${k.file}`);
    return `<section class="bb-kepernyo" aria-labelledby="kep-${esc(k.id)}"><h3 id="kep-${esc(k.id)}">${esc(k.cim)}</h3><p>${inl(k.leiras || '')}</p>
<div class="bb-kepernyo-sor"><div class="bb-eszkoz is-${esc(k.eszkoz || 'asztal')}"><iframe src="${esc(src)}" title="${esc(k.cim)}" loading="lazy" data-kepernyo${k.url ? ' data-kulso' : ''} referrerpolicy="origin"></iframe></div>
<div class="bb-kepernyo-info">${k.url ? `<p class="bc-muted bb-kicsi">Élő, kattintható – a valódi felület. <a href="${esc(k.url.replace(/[?&]keret=1/, ''))}" target="_blank" rel="noopener">Megnyitás külön lapon</a></p>` : `<button type="button" class="bc-btn is-secondary" data-jelolo aria-pressed="false">DS-jelölések mutatása</button>`}
<ol class="bb-jelek">${(k.jelek || []).map(j => `<li value="${j.n}"><strong>${inl(j.nev)}</strong>${j.megj ? ` – ${inl(j.megj)}` : ''}</li>`).join('')}</ol>
${(k.hatas || []).length ? `<h4>A DS hatása</h4><ul class="bb-list">${k.hatas.map(x => `<li>${inl(x)}</li>`).join('')}</ul>` : ''}</div></div></section>`;
  }).join('');
}

// ---------- oldal-váz ----------
function menu(aktiv) {
  const linkek = FEJEZETEK.map(f => `<li><a class="bc-nav-link" href="${f.file}"${f.id === aktiv || (aktiv.startsWith('felulet-') && f.id === 'feluletek') || (aktiv.startsWith('elemek-') && f.id === 'elemek') ? ' aria-current="page"' : ''}><span class="bb-szam" aria-hidden="true">${f.szam}</span><span class="bc-nav-text">${esc(f.cim)}</span></a></li>`).join('');
  return `<nav class="bc-sidebar bb-sidebar" id="bb-menu" aria-label="Fejezetek"><div class="bc-sidebar-head"><a class="bc-brand" href="index.html"><img src="ds/web/assets/brand/logo.webp" alt="" width="90" height="36" class="bb-logo-vilagos"><img src="ds/web/assets/brand/logo-sotet.webp" alt="" width="90" height="36" class="bb-logo-sotet"><span class="bc-brand-text">Brand Book</span></a><button type="button" class="bc-btn is-ghost is-icon bb-menu-zar" aria-label="Menü bezárása" data-menu-zar>${ic('x')}</button></div><div class="bc-sidebar-links"><ul class="bc-nav-list">${linkek}</ul><p class="bc-nav-group">Utak</p><ul class="bc-nav-list">${Object.entries(UTAK).map(([id, u]) => `<li><a class="bc-nav-link" href="${FEJEZETEK.find(f => f.id === u.lepesek[0]).file}?ut=${id}" data-ut="${id}"><span class="bc-nav-text">${esc(u.nev)}</span></a></li>`).join('')}</ul></div><div class="bc-sidebar-foot"><p class="bb-kicsi bc-muted">DS v${esc(VERSION)} · <a href="/kilepes">Kilépés</a></p></div></nav>`;
}
function oldal({ id, cim, leiras, torzs, fejezet }) {
  const utakJson = esc(JSON.stringify(Object.fromEntries(Object.entries(UTAK).map(([k, u]) => [k, { nev: u.nev, lepesek: u.lepesek.map(l => { const f = FEJEZETEK.find(x => x.id === l); return { file: f.file, cim: f.cim }; }) }]))));
  index.push(...kivonat(id, cim, torzs));
  return `<!doctype html>
<html lang="hu" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(cim)} · beeco Brand Book</title>
<meta name="description" content="${esc(leiras || 'A beeco márkakönyve és design systeme: hangnem, logó, méhecske, színek, betűk és a hat felület szabályai.')}">
<link rel="icon" href="ds/web/assets/brand/ikon-32.png">
<link rel="preload" href="ds/web/assets/fonts/lalezar-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="ds/termek/css/bc-all.css">
<link rel="stylesheet" href="bb/bb.css">
<link rel="stylesheet" href="bb/gen.css">
<script src="bb/tema.js"></script>
<script src="bb/bb.js" defer></script>
</head>
<body data-oldal="${esc(id)}" data-utak="${utakJson}">
<a class="bb-ugras" href="#tartalom">Ugrás a tartalomra</a>
<div class="bc-shell bb-shell">
${menu(id)}
<div class="bb-scrim" data-menu-zar hidden></div>
<div class="bc-main">
<header class="bc-topbar bb-topbar">
<button type="button" class="bc-btn is-ghost is-icon bb-menu-nyit" aria-label="Menü" aria-controls="bb-menu" aria-expanded="false" data-menu-nyit>${ic('menu')}</button>
<form class="bb-kereso" role="search" action="kereses.html"><label class="bc-sr" for="bb-q">Keresés a brand bookban</label>${ic('kereses', 'bb-kereso-ic')}<input class="bc-input" id="bb-q" name="q" type="search" placeholder="Keresés: logó, méz, szóvicc…" autocomplete="off" aria-controls="bb-talalat" aria-describedby="bb-talalat-szam"><div class="bb-talalat" id="bb-talalat" hidden><p class="bc-sr" id="bb-talalat-szam" aria-live="polite"></p><ul></ul></div></form>
<button type="button" class="bc-btn is-ghost is-icon bb-tema" data-tema-gomb aria-label="Téma: rendszer szerint">${ic('auto', 'is-auto')}${ic('nap', 'is-vilagos')}${ic('hold', 'is-sotet')}</button>
</header>
<main class="bc-content bb-tartalom" id="tartalom" tabindex="-1">
${fejezet ? `<p class="bb-fejezetszam">${fejezet}</p>` : ''}
${torzs}
<nav class="bb-utsav" data-utsav hidden aria-label="Utad"></nav>
</main>
<footer class="bb-lab"><p class="bc-muted">beeco Brand Book · design system v${esc(VERSION)} · generálva a <code>hegebeeco/beeco-design-system</code> repóból. A beeco méhecskéi és logója belső használatúak; külső anyagban a beeco jóváhagyása kell.</p></footer>
</div>
</div>
</body>
</html>
`;
}
function kivonat(id, cim, html) {
  const file = id === 'index' ? 'index.html' : `${id}.html`;
  const res = [{ f: file, c: cim, h: '', x: strip(html).slice(0, 220) }];
  const re = /<h([23]) id="([^"]+)">(.*?)<\/h\1>([\s\S]*?)(?=<h[23] id=|$)/g; let m;
  while ((m = re.exec(html))) res.push({ f: `${file}#${m[2]}`, c: cim, h: strip(m[3]), x: strip(m[4]).slice(0, 200) });
  return res;
}
function fejezetOldal(f) {
  const t = tartalom[f.id];
  if (!t) { hibak.push(`hiányzó tartalom: brandbook/tartalom/${f.id}.json`); return; }
  const torzs = `<header class="bb-fej"><h1>${inl(t.cim || f.cim)}</h1>${t.alcim ? `<p class="bb-lead">${inl(t.alcim)}</p>` : ''}</header>` + t.blokkok.map(b => blokk(b, f.id)).join('\n');
  fs.writeFileSync(path.join(OUT, f.file), oldal({ id: f.id, cim: t.cim || f.cim, leiras: t.alcim, torzs, fejezet: f.szam ? `${f.szam}. fejezet` : '' }));
}
function feluletOldal(f) {
  const lista = (cim, l, cls) => l && l.length ? `<section class="bb-fl-resz ${cls}"><h2 id="${slug(cim)}">${esc(cim)}</h2><ul class="bb-list">${l.map(x => `<li>${inl(x)}</li>`).join('')}</ul></section>` : '';
  const sorok = Object.entries(f.ertekek || {}).map(([k, c]) => [{ mez: 'Méz-szín', tinta: 'Tinta és vonal', hatter: 'Háttér', sarok: 'Sarok', arnyek: 'Árnyék', betu: 'Betű', sotet: 'Sötét mód', suruseg: 'Sűrűség', ds: 'Kapcsolat a DS-sel', technika: 'Technika' }[k] || k, `${JEL[c.jel] ? JEL[c.jel][0] + ' ' : ''}${c.ertek}`, c.forras || '']);
  const torzs = `<p class="bb-vissza"><a href="feluletek.html">← Hat felület</a></p><header class="bb-fej"><h1>${esc(f.nev)}</h1><p class="bb-lead">${inl(f.rovid)}</p><p><span class="bc-badge is-accent">${esc(f.bor_nev)}</span> <span class="bc-badge is-muted">${esc(f.technika_rovid || '')}</span></p></header>
<div class="bb-ket bb-fl-fej"><div>${lista('Kinek szól', f.kinek, '')}${f.hol ? `<p><strong>Hol él:</strong> ${inl(f.hol)}</p>` : ''}</div>${mintaKeret(f, 'Élő minta')}</div>
${kepernyoResz(f.id)}
${lista('Mi közös a többi felülettel', f.kozos, 'is-kozos')}${lista('Mi tér el – szándékosan', f.szandekos, 'is-szandekos')}${lista('Mi tér el ma – rendezendő', f.elter, 'is-elter')}${lista('Cél felé – teendők', f.cel, 'is-cel')}
${(f.blokkok || []).map(b => blokk(b, `felulet-${f.id}`)).join('\n')}
<h2 id="ertekek">Értékek a forrásból</h2>${tabla(['Jellemző', 'Érték', 'Forrás'], sorok, `${f.nev} értékei`)}
<p class="bc-muted bb-kicsi">Felmérve: ${esc(f.felmeres && f.felmeres.datum || '–')} · ${esc((f.felmeres && f.felmeres.forras || []).join(' · '))}</p>
${f.szabalykonyv ? `<p>Szabálykönyv: ${inl(f.szabalykonyv)}</p>` : ''}`;
  fs.writeFileSync(path.join(OUT, `felulet-${f.id}.html`), oldal({ id: `felulet-${f.id}`, cim: f.nev, leiras: f.rovid, torzs, fejezet: '5. fejezet · Hat felület' }));
}
function kezdolap() {
  const t = tartalom.index || { blokkok: [] };
  const torzs = `<header class="bb-hero"><div class="bb-hero-szoveg"><p class="bb-fejezetszam">beeco Brand Book</p><h1>${inl(t.cim || 'Egy méhecske, hat felület')}</h1><p class="bb-lead">${inl(t.alcim || '')}</p></div><img class="bb-hero-meh" src="ds/web/assets/brand/bee-happy.webp" alt="" width="160" height="160"></header>
<h2 id="ki-vagy">Ki vagy? Innen indulj</h2>${GEN.utak()}
<h2 id="hat-felulet">Hat felület egy pillantásra</h2>${GEN.csempek()}
${t.blokkok.map(b => blokk(b, 'index')).join('\n')}
<h2 id="mi-uj">Mi új a design systemben</h2>${GEN.valtozasok()}`;
  fs.writeFileSync(path.join(OUT, 'index.html'), oldal({ id: 'index', cim: 'Kezdőlap', torzs }));
}
function keresesOldal() {
  const torzs = `<header class="bb-fej"><h1>Keresés</h1></header><p data-kereses-ures>Írd be fent, mit keresel – például <em>logó</em>, <em>szóvicc</em> vagy <em>méz</em>.</p><ul class="bb-kereses-lista" data-kereses-lista></ul>`;
  fs.writeFileSync(path.join(OUT, 'kereses.html'), oldal({ id: 'kereses', cim: 'Keresés', torzs }));
}
function belepesOldal() {
  fs.writeFileSync(path.join(OUT, 'belepes.html'), `<!doctype html>
<html lang="hu" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Belépés · beeco Brand Book</title>
<link rel="icon" href="ds/web/assets/brand/ikon-32.png">
<link rel="stylesheet" href="ds/termek/css/bc-all.css">
<link rel="stylesheet" href="bb/bb.css">
<script src="bb/tema.js"></script>
<script src="bb/belepes.js" defer></script>
</head>
<body class="bb-belepes-test">
<main class="bb-belepes">
<img src="ds/web/assets/brand/logo.webp" alt="beeco" width="150" height="60" class="bb-logo-vilagos"><img src="ds/web/assets/brand/logo-sotet.webp" alt="beeco" width="150" height="60" class="bb-logo-sotet">
<h1>Brand Book</h1>
<p>A beeco márkakönyve önkénteseknek, partnereknek és fejlesztőknek. A jelszót a beeco csapatától kapod.</p>
<form class="bc-card bb-belepes-urlap" method="post" action="/belepes">
<input type="hidden" name="vissza" value="/" data-vissza>
<div class="bc-field"><label class="bc-label" for="jelszo">Jelszó</label><input class="bc-input" id="jelszo" name="jelszo" type="password" autocomplete="current-password" required aria-describedby="jelszo-hiba"><p class="bc-error" id="jelszo-hiba" data-hiba hidden>Ez nem a jó jelszó. Nézd meg, nincs-e bekapcsolva a nagybetű, vagy kérd el újra a beeco csapatától.</p></div>
<button type="submit" class="bc-btn is-block">Belépés${ic('tovabb')}</button>
</form>
</main>
</body>
</html>
`);
}

// ---------- futtatás ----------
fs.rmSync(OUT, { recursive: true, force: true });
mkdir(OUT); mkdir(path.join(OUT, 'minta')); mkdir(path.join(OUT, 'bb'));
// a DS fájljai a repó szerinti relatív helyükön (a bc-all.css @import-jai így működnek)
copy('termek/css'); copy('dist/css'); copy('dist/tokens.json'); copy('dist/weboldal/webflow-valtozok.json'); copy('dist/dart/beeco_tokens.dart');
copy('dist/tailwind/preset.cjs'); copy('dist/scss/_beeco.scss'); copy('web/assets/fonts'); copy('web/assets/brand'); copy('web/css');
copy('termek/tesztlapok'); copy('dist/tesztlapok');   // élő React-komponensek minden állapotban
if (fs.existsSync(path.join(BB, 'kepernyok'))) fs.cpSync(path.join(BB, 'kepernyok'), path.join(OUT, 'kepernyok'), { recursive: true, filter: f => !/kepernyok\.json$|[\/]src([\/]|$)/.test(f) });
// a dühös méhecske nem kerül ki (tiltott kép)
for (const t of hangnem.tiltott_kepek) fs.rmSync(path.join(OUT, 'ds/web/assets/brand', `${t}.webp`), { force: true });
for (const f of ['bb.css', 'bb.js', 'tema.js', 'minta.css', 'minta.js', 'belepes.js', 'kepernyo.css']) {
  const src = path.join(BB, f.endsWith('.css') ? 'css' : 'js', f);
  if (!fs.existsSync(src)) { hibak.push(`hiányzó fájl: brandbook/${f.endsWith('.css') ? 'css' : 'js'}/${f}`); continue; }
  fs.copyFileSync(src, path.join(OUT, 'bb', f));
}
for (const f of feluletek) mintaOldal(f);
for (const f of FEJEZETEK.filter(f => f.id !== 'index')) fejezetOldal(f);
for (const f of feluletek) feluletOldal(f);
elemekOldalak();
kezdolap(); keresesOldal(); belepesOldal();
fs.writeFileSync(path.join(OUT, 'bb', 'gen.css'), `/* GENERÁLT (tools/brandbook-build.js) – minták a tokenekből */\n${[...new Set(genCss)].join('\n')}\n`);
fs.writeFileSync(path.join(OUT, 'bb', 'kereses.json'), JSON.stringify(index));
fs.writeFileSync(path.join(OUT, '404.html'), oldal({ id: '404', cim: 'Nincs ilyen oldal', torzs: `<header class="bb-fej"><h1>Ezt a virágot nem találjuk</h1><p class="bb-lead">Nincs ilyen oldal. Indulj a kezdőlapról, vagy keress fent.</p></header><p><a class="bc-btn" href="index.html">Kezdőlap${ic('tovabb')}</a></p>` }));

// ---------- ellenőrzés: belső linkek, inline stílus / script ----------
const oldalak = fs.readdirSync(OUT).filter(f => f.endsWith('.html'));
for (const o of oldalak) {
  const h = fs.readFileSync(path.join(OUT, o), 'utf8');
  if (/\sstyle="/.test(h)) hibak.push(`${o}: inline stílus`);
  if (/<script(?![^>]*\ssrc=)[^>]*>/.test(h)) hibak.push(`${o}: inline script`);
  if (!/<html lang="hu"/.test(h)) hibak.push(`${o}: nincs lang="hu"`);
  for (const m of h.matchAll(/(?:href|src)="([^"#?:]+\.(?:html|css|js|webp|png|json|woff2|dart|cjs|scss))(?:[?#][^"]*)?"/g)) {
    if (m[1].startsWith('/')) continue;
    if (!fs.existsSync(path.join(OUT, m[1]))) hibak.push(`${o}: törött link: ${m[1]}`);
  }
}
for (const dir of ['minta', 'kepernyok']) {
  if (!fs.existsSync(path.join(OUT, dir))) continue;
  for (const f of fs.readdirSync(path.join(OUT, dir)).filter(f => f.endsWith('.html'))) {
    const h = fs.readFileSync(path.join(OUT, dir, f), 'utf8');
    if (/\sstyle="/.test(h)) hibak.push(`${dir}/${f}: inline stílus`);
    if (/<script(?![^>]*\ssrc=)[^>]*>/.test(h)) hibak.push(`${dir}/${f}: inline script`);
    if (/bee-angry/.test(h)) hibak.push(`${dir}/${f}: a mérges méhecske tilos`);
    for (const m of h.matchAll(/(?:href|src)="([^"#?:]+\.(?:css|js|webp|png|svg|html))"/g)) if (!m[1].startsWith('/') && !fs.existsSync(path.join(OUT, dir, m[1]))) hibak.push(`${dir}/${f}: törött link: ${m[1]}`);
  }
}

if (hibak.length) { console.error('brandbook – HIBA:\n  ' + hibak.join('\n  ')); process.exit(1); }
console.log(`brandbook kész: ${oldalak.length} oldal, ${feluletek.length} felület, ${index.length} keresőtétel → ${path.relative(ROOT, OUT) || OUT}${CHECK ? ' (ellenőrzés, ideiglenes)' : ''}`);
if (CHECK) fs.rmSync(OUT, { recursive: true, force: true });
