// Főoldal „lapítás”: elemenként a nyertes (deklarált) érték töréspontonként, JS nélküli (tervezési) DOM-on.
// Kimenet: lapit.json (elem → kontextus → {prop: érték}, állapotok), elemzés a konzolra.
const pw = require(require('os').homedir() + '/CLAUDE/Csicsergosz-webapp/node_modules/playwright');
const fs = require('fs');
const U = 'https://beeco-weboldal.webflow.io/fooldal-szuperhos-draft';
const D = '/tmp/fs/nat/';
const HTML0 = fs.readFileSync(D + 'jelolt.html', 'utf8');
const siteHref = (HTML0.match(/<link[^>]*href="([^"]*webflow\.shared[^"]*)"/) || [])[1];
const SITE = require('child_process').execSync('curl -s "' + siteHref + '"').toString();
const HTML = HTML0.replace(/<link[^>]*webflow\.shared[^>]*>/, () => '<style data-site="1">' + SITE + '</style>');
const KONTEXT = [['main', 1300], ['xl', 1440], ['medium', 900], ['small', 700], ['tiny', 390]];

function lapit() {
  // --- specificitás ---
  function spec(sel) {
    let a = 0, b = 0, c = 0; let s = sel;
    s = s.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, ''); // nulla súly
    s = s.replace(/:(is|not|has)\(((?:[^()]|\([^()]*\))*)\)/g, (m, f, arg) => { const r = arg.split(',').map(x => spec(x.trim())).sort((x, y) => cmp(y, x))[0] || [0, 0, 0]; a += r[0]; b += r[1]; c += r[2]; return ''; });
    s = s.replace(/::[\w-]+(\([^)]*\))?/g, () => { c++; return ''; });
    s = s.replace(/#[\w-]+/g, () => { a++; return ''; });
    s = s.replace(/\.[\w-]+|\[[^\]]*\]|:[\w-]+(\([^)]*\))?/g, () => { b++; return ''; });
    s.replace(/(^|[\s>+~(])([a-zA-Z][\w-]*)/g, () => { c++; return ''; });
    return [a, b, c];
  }
  function cmp(x, y) { return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; }
  function bont(sel) { const r = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { r.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) r.push(cur.trim()); return r; }
  function tokenek(v) { const t = []; let d = 0, cur = ''; for (const c of v) { if (c === '(') d++; if (c === ')') d--; if (c === ' ' && !d) { if (cur) t.push(cur); cur = ''; } else cur += c; } if (cur) t.push(cur); return t; }
  function kibont(css) { const ki = {}; let d = 0, cur = ''; const ds = []; for (const c of css) { if (c === '(') d++; if (c === ')') d--; if (c === ';' && !d) { ds.push(cur); cur = ''; } else cur += c; } if (cur.trim()) ds.push(cur);
    const DOBOZ = { padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'], margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'], inset: ['top', 'right', 'bottom', 'left'] };
    const M4 = [[0, 0, 0, 0], [0, 1, 0, 1], [0, 1, 2, 1], [0, 1, 2, 3]];
    for (const dc of ds) { const i = dc.indexOf(':'); if (i < 0) continue; const n = dc.slice(0, i).trim(), v = dc.slice(i + 1).trim().replace(/\s*!important$/, ''); if (!v.includes('var(')) continue; const t = tokenek(v);
      if (DOBOZ[n] && M4[t.length - 1]) DOBOZ[n].forEach((p, j) => ki[p] = t[M4[t.length - 1][j]]);
      else if (n === 'gap') { ki['row-gap'] = t[0]; ki['column-gap'] = t[1] || t[0]; }
      else if (n === 'border-radius' && !t.includes('/') && M4[t.length - 1]) ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'].forEach((p, j) => ki[p] = t[M4[t.length - 1][j]]);
      else if (/^border(-(top|right|bottom|left))?$/.test(n)) { const ol = n === 'border' ? ['top', 'right', 'bottom', 'left'] : [n.split('-')[1]]; let w, st, c; for (const x of t) { if (/^(solid|dashed|dotted|double|none|hidden)$/.test(x)) st = x; else if (/^var\(--bw|^\d/.test(x)) w = x; else c = x; } ol.forEach(o => { if (w) ki[`border-${o}-width`] = w; if (st) ki[`border-${o}-style`] = st; if (c) ki[`border-${o}-color`] = c; }); }
      else if (n === 'border-color' && t.length === 1) ['top', 'right', 'bottom', 'left'].forEach(o => ki[`border-${o}-color`] = v);
      else if (n === 'border-width' && t.length === 1) ['top', 'right', 'bottom', 'left'].forEach(o => ki[`border-${o}-width`] = v);
      else if (n === 'outline') { let w, st, c; for (const x of t) { if (/^(solid|dashed|dotted|none)$/.test(x)) st = x; else if (/^\d|^var\(--bw/.test(x)) w = x; else c = x; } if (st) ki['outline-style'] = st; if (w) ki['outline-width'] = w; if (c) ki['outline-color'] = c; }
      else if (n === 'background' && t.length === 1) ki['background-color'] = v;
      else if (n === 'font') { ki['__font'] = v; }
      else if (n === 'transition') ki['transition'] = v;
      else if (n === 'flex') { if (t.length === 3) { ki['flex-grow'] = t[0]; ki['flex-shrink'] = t[1]; ki['flex-basis'] = t[2]; } else ki['flex'] = v; }
      else if (!n.startsWith('--')) ki[n] = v; }
    return ki; }
  // --- szabályok ---
  const szab = []; let idx = 0;
  const jar = (rules, media) => { for (const r of rules) {
    if (r.type === 1) { const decl = []; let ures = false; for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; const v = r.style.getPropertyValue(p).trim(); if (v === '') { ures = true; continue; } decl.push([p, v, r.style.getPropertyPriority(p)]); }
      if (ures) { const k = kibont(r.style.cssText); for (const p in k) if (!decl.some(x => x[0] === p)) decl.push([p, k[p], '']); }
      const LOG = { 'margin-inline-start': 'margin-left', 'margin-inline-end': 'margin-right', 'margin-block-start': 'margin-top', 'margin-block-end': 'margin-bottom', 'padding-inline-start': 'padding-left', 'padding-inline-end': 'padding-right', 'padding-block-start': 'padding-top', 'padding-block-end': 'padding-bottom', 'inset-inline-start': 'left', 'inset-inline-end': 'right', 'inset-block-start': 'top', 'inset-block-end': 'bottom', 'border-start-start-radius': 'border-top-left-radius', 'border-start-end-radius': 'border-top-right-radius', 'border-end-end-radius': 'border-bottom-right-radius', 'border-end-start-radius': 'border-bottom-left-radius' };
      for (const d of decl) if (LOG[d[0]]) d[0] = LOG[d[0]];
      // azonos blokkon belül a későbbi nyer
      const seen = {}; for (let i = decl.length - 1; i >= 0; i--) { if (seen[decl[i][0]]) decl.splice(i, 1); else seen[decl[i][0]] = 1; }
      szab.push({ idx: idx++, media, sel: r.selectorText, decl, css: r.style.cssText, text: r.cssText }); }
    else if (r.type === 4) jar(r.cssRules, r.conditionText || r.media.mediaText); else szab.push({ idx: idx++, media: '@other', sel: '', decl: [], css: r.cssText, text: r.cssText }); } };
  const FSSEL = /^\s*(\.(fs|fo)-[\w-]+)+(:[\w-]+(\([^)]*\))?|::[\w-]+)*\s*$/;
  const site = document.querySelector('style[data-site]');
  const jarSite = (rules, media) => { for (const r of rules) { if (r.type === 4) { jarSite(r.cssRules, r.conditionText || r.media.mediaText); continue; } if (r.type !== 1) continue;
      const reszek = bont(r.selectorText).filter(x => FSSEL.test(x)); if (!reszek.length) continue;
      const decl = []; for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; const v = r.style.getPropertyValue(p).trim(); if (v !== '') decl.push([p, v, r.style.getPropertyPriority(p)]); }
      szab.push({ idx: idx++, media, sel: reszek.join(','), decl, css: r.style.cssText, site: 1 }); } };
  if (site) jarSite(site.sheet.cssRules, '');
  document.querySelectorAll('style[data-fs]').forEach(s => jar(s.sheet.cssRules, ''));
  const elok = [...document.querySelectorAll('.fs-oldal, .fs-oldal *')].filter(e => e.dataset.nk);
  const ALLAPOT = /:(hover|focus-visible|focus|active)(?![\w-])/;
  const egyezik = new Map(); // nk → [{idx, ps, all, sp}]
  const hasznalt = new Set();
  for (const r of szab) {
    if (r.media === '@other') continue;
    if (r.media && !matchMedia(r.media).matches) continue;
    for (const s of bont(r.sel)) {
      let ps = ''; let alap = s; const pm = s.match(/::(before|after|placeholder)$/); if (pm) { ps = pm[1]; alap = s.slice(0, pm.index); if (/[\s>+~]$/.test(alap) || !alap) alap += '*'; }
      // állapot csak az utolsó összetett szelektoron
      const utolso = alap.split(/[\s>+~]+/).pop(); let all = ''; const am = utolso.match(ALLAPOT);
      if (am) { all = am[1]; }
      const elott = alap.slice(0, alap.length - utolso.length);
      if (ALLAPOT.test(elott)) continue; // szülő-állapot: nem natívítható
      const tiszta = all ? alap.slice(0, alap.length - utolso.length) + utolso.replace(ALLAPOT, '') : alap;
      let lista; try { lista = document.querySelectorAll(tiszta || '*'); } catch (_) { continue; }
      for (const e of lista) { if (!e.dataset.nk || !e.closest('.fs-oldal')) continue; hasznalt.add(r.idx);
        if (!egyezik.has(e.dataset.nk)) egyezik.set(e.dataset.nk, []); egyezik.get(e.dataset.nk).push({ idx: r.idx, ps, all, sp: spec(s) }); }
    }
  }
  const ki = {};
  for (const e of elok) {
    const m = egyezik.get(e.dataset.nk) || [];
    const reteg = {}; // kulcs: ps|all → {prop: [prio, sp, idx, val]}
    for (const x of m) { const r = szab[x.idx]; const k = x.ps + '|' + x.all; reteg[k] = reteg[k] || {};
      for (const [p, v, pr] of r.decl) { const cur = reteg[k][p]; const uj = [pr === 'important' ? 1 : 0, x.sp, x.idx, v];
        if (!cur || cur[0] < uj[0] || (cur[0] === uj[0] && (cmp(cur[1], uj[1]) < 0 || (cmp(cur[1], uj[1]) === 0 && cur[2] < uj[2])))) reteg[k][p] = uj; } }
    const o = {}; for (const k in reteg) { o[k] = {}; for (const p in reteg[k]) o[k][p] = [reteg[k][p][3], reteg[k][p][2]]; }
    ki[e.dataset.nk] = { tag: e.tagName.toLowerCase(), osztaly: [...e.classList].filter(c => !c.startsWith('w-')), w: [...e.classList].filter(c => c.startsWith('w-')), stilus: o,
      css: {} };
  }
  // feloldott egyedi változók (érték-helyettesítéshez)
  const valtozok = {}; const gy = getComputedStyle(document.querySelector('.fs-oldal'));
  for (let i = 0; i < gy.length; i++) { const p = gy[i]; if (p.startsWith('--')) valtozok[p] = gy.getPropertyValue(p).trim(); }
  return { ki, hasznalt: [...hasznalt], szab: szab.map(r => ({ idx: r.idx, media: r.media, sel: r.sel, site: r.site || 0, text: r.text || '', decl: r.decl })), valtozok };
}

(async () => {
  const b = await pw.chromium.launch(); const eredm = {};
  for (const [nev, w] of KONTEXT) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: false });
    await ctx.route(u => u.href.split('?')[0] === U, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML }));
    const p = await ctx.newPage(); await p.goto(U); await p.waitForTimeout(300);
    eredm[nev] = await p.evaluate(lapit); await ctx.close();
  }
  await b.close();
  fs.writeFileSync(D + 'lapit.json', JSON.stringify(eredm));
  // elemzés
  const m = eredm.main; const nk = Object.keys(m.ki);
  const osztalytalan = nk.filter(k => !m.ki[k].osztaly.length && KONTEXT.some(([c]) => Object.keys(eredm[c].ki[k].stilus).length));
  const lanc = {}; for (const k of nk) { const L = m.ki[k].osztaly.join(' '); if (!L) continue; const sig = JSON.stringify(KONTEXT.map(([c]) => Object.fromEntries(Object.entries(eredm[c].ki[k].stilus).map(([a, o]) => [a, Object.fromEntries(Object.entries(o).map(([p, v]) => [p, v[0]]))])))); (lanc[L] = lanc[L] || new Set()).add(sig); }
  const utkozo = Object.entries(lanc).filter(([, s]) => s.size > 1);
  const hasznalt = new Set(KONTEXT.flatMap(([c]) => eredm[c].hasznalt));
  console.log('tervezési elemek', nk.length, '| osztály nélküli, de stílusos', osztalytalan.length, '| lánc', Object.keys(lanc).length, '| ütköző lánc', utkozo.length, '(elemek:', utkozo.reduce((a, [L]) => a + nk.filter(k => m.ki[k].osztaly.join(' ') === L).length, 0), ')');
  console.log('szabályok', m.szab.length, '| tervezési elemre illő', hasznalt.size, '| maradék (JS/állapot/kulcskép)', m.szab.length - hasznalt.size);
  console.log('ütközők pl.', utkozo.slice(0, 12).map(([L, s]) => L + '×' + s.size).join(', '));
  console.log('osztálytalan pl.', osztalytalan.slice(0, 12).map(k => m.ki[k].tag).join(','));
})();
