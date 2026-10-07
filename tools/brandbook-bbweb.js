/* ============================================================
   beeco BRAND BOOK – két generátor a WEBOLDAL és a JÁTÉKOK felület-oldalához (a brandbook-build.js hívja be)

   {t:"gen", nev:"webflowValtozok"}  → a DS-tokenek és a Webflow „beeco DS” változói egymás mellett,
                                       a dist/weboldal/webflow-valtozok.json-ból (egy forrás, kézzel nem írjuk át)
   {t:"gen", nev:"jatekelemek", elemek:[…]} → a játékbőr élő elemei: minden elem saját keretben (minta/jatek-*.html),
                                       a játék saját CSS-ével (web/css), hogy a két bőr ne keveredjen; mellette használati
                                       jegyzet és képes IGEN / NEM – a NEM-képek is a játékbőr keretében futnak.
   A mintában: {{pic:név}} → a web/js/pics.js piktogramja, {{art:név|alt}} → a web/js/art matricája (építéskor SVG-fájl).
   Csak a Node beépített moduljait használja; inline stílus és inline script nincs (szigorú CSP).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function bbweb(k) {
  const { ROOT, OUT, esc, inl, hibak, tabla, ddFig, forrasLista, genCss, htmlEllenor } = k;
  const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

  // ---------- piktogramok és matricák a játék saját forrásából ----------
  let PIC = null;
  function pic(n) {
    if (!PIC) {
      const src = read('web/js/pics.js'), vege = src.indexOf('\n};');
      PIC = vm.runInNewContext(src.slice(0, vege + 3) + '\nPIC_DEFS');
    }
    if (!PIC[n]) { hibak.push(`jatekelemek: ismeretlen piktogram: ${n}`); return ''; }
    return `<svg class="pic pic-${n}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PIC[n]}</svg>`;
  }
  let ART = null;
  function art(n, alt) {
    if (!ART) {
      const dir = path.join(ROOT, 'web/js/art');
      ART = require(path.join(dir, 'art.js')); globalThis.ART = ART;
      for (const f of fs.readdirSync(dir).filter(f => /^art-.+\.js$/.test(f)).sort()) require(path.join(dir, f));
    }
    if (!ART.has(n)) { hibak.push(`jatekelemek: ismeretlen matrica: ${n}`); return ''; }
    fs.mkdirSync(path.join(OUT, 'minta', 'art'), { recursive: true });
    fs.writeFileSync(path.join(OUT, 'minta', 'art', `${n}.svg`), ART.svg(n));
    return `<img class="art" src="art/${esc(n)}.svg" alt="${esc(alt || '')}" width="100" height="100">`;
  }
  const kitolt = (h, ctx) => htmlEllenor(String(h || ''), ctx)
    .replace(/\{\{pic:([a-z0-9]+)\}\}/g, (m, n) => pic(n))
    .replace(/\{\{art:([a-z0-9_]+)(?:\|([^}]*))?\}\}/g, (m, n, alt) => art(n, alt));

  // ---------- a játékbőr minta-oldala (iframe) ----------
  let cssKesz = false;
  function jatekOldal(file, cim, torzs, termekTokenek) {
    if (!cssKesz) {
      const src = path.join(ROOT, 'brandbook/css/jatekminta.css');
      if (!fs.existsSync(src)) hibak.push('hiányzó fájl: brandbook/css/jatekminta.css');
      else fs.copyFileSync(src, path.join(OUT, 'bb', 'jatekminta.css'));
      cssKesz = true;
    }
    const html = `<!doctype html><html lang="hu" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(cim)} – játékbőr, minta</title>`
      + '<link rel="stylesheet" href="../ds/web/css/fonts.css"><link rel="stylesheet" href="../ds/web/css/tokens.css"><link rel="stylesheet" href="../ds/web/css/ds.css"><link rel="stylesheet" href="../ds/web/css/ds-game.css">'
      + (termekTokenek ? '<link rel="stylesheet" href="../ds/dist/css/beeco-tokens.css">' : '')
      + '<link rel="stylesheet" href="../bb/minta.css"><link rel="stylesheet" href="../bb/jatekminta.css"><script src="../bb/minta.js"></script></head>'
      + `<body class="mt-jatek jm nincs-sotet"><main class="jm-wrap">${torzs}</main></body></html>`;
    fs.writeFileSync(path.join(OUT, 'minta', file), html);
  }
  const keret = (file, cim, cls = '') => `<iframe class="bbw-jm-keret${cls}" src="minta/${esc(file)}" title="${esc(cim)}" loading="lazy" data-minta="${esc(file)}"></iframe>`;

  return {
    webflowValtozok() {
      const w = JSON.parse(read('dist/weboldal/webflow-valtozok.json'));
      const kol = w.kollekcio || 'beeco DS', elotag = '--_' + kol.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '---';
      const v = w.valtozok || [];
      if (v.length < 50) hibak.push(`webflowValtozok: gyanúsan kevés változó (${v.length})`);
      const ertek = x => x && typeof x === 'object' ? `${x.value} ${x.unit}` : x;
      const szinek = v.filter(x => x.tipus === 'Color').map(x => {
        genCss.push(`.bb-sw-c[data-r="${x.nev.replace(/^bc-/, '')}"] { background: var(--${x.nev}); }`);
        return [`<span class="bb-sw-c is-kicsi" data-r="${esc(x.nev.replace(/^bc-/, ''))}" aria-hidden="true"></span> \`--${esc(x.nev)}\``, `\`${x.nev}\``, `\`${elotag}${x.nev}\``, `\`${x.ertek}\``, x.sotet ? `\`${x.sotet}\`` : '—'];
      });
      const csoport = { 'bc-r-': 'Sarok', 'bc-bw-': 'Keret', 'bc-shadow-': 'Árnyék (eltolás)', 'bc-sp-': 'Térköz', 'bc-fs-': 'Betűméret', 'bc-tap': 'Érintési méret' };
      const meretek = v.filter(x => x.tipus !== 'Color').map(x => {
        const cs = Object.entries(csoport).find(([p]) => x.nev.startsWith(p));
        const ds = /^bc-shadow-[sml]-[xy]$/.test(x.nev) ? `\`--bc-shadow-${x.nev.split('-')[2]}\` (${x.nev.endsWith('-x') ? 'vízszintes' : 'függőleges'} rész)` : `\`--${x.nev}\``;
        return [ds, `\`${x.nev}\``, `\`${elotag}${x.nev}\``, ertek(x.ertek), cs ? cs[1] : '—'];
      });
      // a színsor első cellája színmintát is kap (a tabla() mindent escape-elne), ezért ezt a táblát itt rakjuk össze
      const szinTabla = `<div class="bc-table-wrap bb-tabla" tabindex="0" role="region" aria-label="Színszerepek: DS-token és Webflow-változó"><table class="bc-table"><thead><tr>${['DS-token (kódban)', 'Webflow-változó', 'CSS-név a Webflow-ban', 'Világos', 'Sötét mód'].map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>`
        + szinek.map(r => `<tr><th scope="row">${r[0].replace(/`([^`]+)`/, '<code>$1</code>')}</th>${r.slice(1).map(c => `<td>${inl(c)}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
      return `<p>A <strong>${esc(kol)}</strong> kollekció ${v.length} változója, két móddal (${esc((w.modok || []).join(' · '))}). A táblázat a <code>dist/weboldal/webflow-valtozok.json</code>-ból generálódik – ha egy token változik, a <code>node tools/webflow-build.js</code> után itt is az új érték áll.</p>`
        + `<details class="bb-kat" open><summary><span>Színszerepek</span><span class="bc-badge is-muted">${szinek.length}</span></summary>${szinTabla}</details>`
        + `<details class="bb-kat"><summary><span>Méretek: sarok, keret, árnyék, térköz, betű</span><span class="bc-badge is-muted">${meretek.length}</span></summary>${tabla(['DS-token (kódban)', 'Webflow-változó', 'CSS-név a Webflow-ban', 'Érték', 'Csoport'], meretek, 'Méret-változók: DS-token és Webflow-változó')}</details>`
        + '<p class="bc-muted bb-kicsi">Árnyék: a Webflow-ban nincs árnyék-típusú változó, ezért az eltolás két méret-változó (<code>-x</code>, <code>-y</code>); a <code>box-shadow</code>-t az oldal fejkódja rakja össze: <code>&lt;x&gt; &lt;y&gt; 0 0 var(--_beeco-ds---bc-shadow)</code>.</p>';
    },

    jatekelemek(b) {
      const elemek = b.elemek || [];
      if (!elemek.length) { hibak.push('jatekelemek: üres elemlista'); return ''; }
      const ids = new Set();
      return `<nav class="bb-komp-ugro" aria-label="A játékbőr elemei – ugrás"><ul>${elemek.map(e => `<li><a href="#jatek-${esc(e.id)}">${esc(e.nev)}</a></li>`).join('')}</ul></nav>` + elemek.map(e => {
        const ctx = `jatekelem ${e.id}`;
        if (ids.has(e.id)) hibak.push(`${ctx}: kétszer szereplő azonosító`); ids.add(e.id);
        for (const m of ['nev', 'leiras', 'minta']) if (!e[m]) hibak.push(`${ctx}: hiányzik: ${m}`);
        if (!(e.do || []).length || !(e.dont || []).length) hibak.push(`${ctx}: kell legalább egy IGEN és egy NEM`);
        if (!(e.forras || []).length) hibak.push(`${ctx}: forrás nélkül`);
        jatekOldal(`jatek-${e.id}.html`, e.nev, kitolt(e.minta, ctx));
        const dd = (l, jo) => (l || []).map((d, i) => {
          const file = `jatek-${e.id}-${jo ? 'igen' : 'nem'}-${i + 1}.html`;
          jatekOldal(file, `${e.nev} – ${jo ? 'így' : 'ne így'}`, kitolt(d.html, ctx), d.termekTokenek);
          return ddFig({ html: keret(file, `${e.nev} – ${jo ? 'így' : 'ne így'}: ${d.felirat || ''}`, ' is-kep'), felirat: d.felirat, miert: d.miert }, jo, ctx);
        }).join('');
        const lista = l => `<ul class="bb-list">${(l || []).map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
        return `<article class="bb-komp bbw-jatekelem" aria-labelledby="jatek-${esc(e.id)}">
<header class="bb-komp-fej"><h3 id="jatek-${esc(e.id)}">${esc(e.nev)}</h3><span class="bc-badge is-accent">Játékbőr</span></header>
<p class="bb-komp-le">${inl(e.leiras)}</p>
${(e.css || []).length ? `<dl class="bb-komp-meta"><div><dt>CSS</dt><dd>${e.css.map(c => `<code>${esc(c)}</code>`).join(' ')}</dd></div>${e.js ? `<div><dt>JS</dt><dd>${e.js.map(c => `<code>${esc(c)}</code>`).join(' ')}</dd></div>` : ''}</dl>` : ''}
<figure class="bb-minta bbw-jm-elo">${keret(`jatek-${e.id}.html`, `${e.nev} – élő minta a játékbőrben`)}<figcaption><strong>Élő minta</strong> – a játék saját CSS-ével, külön keretben${e.minta_jel ? ` · ${inl(e.minta_jel)}` : ''}</figcaption></figure>
<div class="bb-ket bb-mikor-sor"><section class="bb-mikor is-igen"><h4>Így használd</h4>${lista(e.mikor)}</section><section class="bb-mikor is-ne"><h4>Mikor ne – és mit helyette</h4>${lista(e.mikor_ne)}</section></div>
<div class="bb-dd-racs">${dd(e.do, true)}${dd(e.dont, false)}</div>
${forrasLista(e.forras)}
</article>`;
      }).join('\n');
    },
  };
};
