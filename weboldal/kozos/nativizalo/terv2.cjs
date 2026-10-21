// Natív terv a lapit.json-ból + szimulált ellenőrzés. Futás: node terv2.cjs
const pw = require(require('os').homedir() + '/CLAUDE/Csicsergosz-webapp/node_modules/playwright');
const fs = require('fs');
const U = 'https://beeco-weboldal.webflow.io/fooldal-szuperhos-draft';
const D = '/tmp/fs/nat/';
const HTML = fs.readFileSync(D + 'jelolt.html', 'utf8');
const L = JSON.parse(fs.readFileSync(D + 'lapit.json', 'utf8'));
const CTX = ['main', 'xl', 'medium', 'small', 'tiny'];
const ELOZO = { main: null, xl: 'main', medium: 'main', small: 'medium', tiny: 'small' };
const WFM = { main: '', xl: '@media screen and (min-width: 1440px)', medium: '@media screen and (max-width: 991px)', small: '@media screen and (max-width: 767px)', tiny: '@media screen and (max-width: 479px)' };
const KULCS = { '|': ['noPseudo', ''], '|hover': ['hover', ':hover'], '|focus': ['focus', ':focus'], '|focus-visible': ['focus-visible', ':focus-visible'], '|active': ['active', ':active'], 'before|': ['before', '::before'], 'after|': ['after', '::after'], 'placeholder|': ['placeholder', '::placeholder'] };
const DS = n => `var(--_beeco-ds---${n})`;
const VMAP = { bg: DS('bc-bg'), surface: DS('bc-surface'), 'surface-2': DS('bc-surface-2'), 'surface-accent': DS('bc-surface-accent'), ink: DS('bc-ink'), 'ink-soft': DS('bc-ink-soft'), line: DS('bc-line'), focus: DS('bc-focus'),
  accent: DS('bc-accent'), 'accent-press': DS('bc-accent-press'), 'on-accent': DS('bc-on-accent'), 'accent-ink': DS('bc-accent-ink'), 'raj-bg': DS('bc-raj-bg'), 'raj-line': DS('bc-raj-line'), domb: DS('bc-domb'), 'd-perem': DS('bc-d-perem'),
  cream: DS('bc-krem'), sage: DS('bc-on-olive'), olive: DS('bc-lablec-zold'), 'fs-12': DS('bc-fs-xs'), 'fs-14': DS('bc-fs-s'), 'fs-16': DS('bc-fs-m'), 'fs-20': DS('bc-fs-l'), 'fs-26': DS('bc-fs-xl'), 'fs-34': DS('bc-fs-2xl'), 'fs-46': DS('bc-fs-3xl'),
  r: DS('bc-r-m'), 'r-s': DS('bc-r-s'), bw: DS('bc-bw-base') };
const SOTET = { 'bc-bg': '#1F2615', 'bc-surface': '#353F25', 'bc-surface-2': '#2F371E', 'bc-surface-accent': '#48542D', 'bc-ink': '#FFF8E7', 'bc-ink-soft': '#D3DDBB', 'bc-line': '#B6C4A3', 'bc-focus': '#B1DEFF', 'bc-accent-ink': '#FECF39', 'bc-raj-bg': '#12170C', 'bc-raj-line': '#B6C4A3', 'bc-domb': '#48542D', 'bc-d-perem': '#353F25' };
const ROSSZ = p => p.startsWith('--') || p.startsWith('-webkit-') || p === 'font-variant-emoji' || p === '__font';
const SAROK = { 'border-top-left-radius': 0, 'border-top-right-radius': 1, 'border-bottom-right-radius': 2, 'border-bottom-left-radius': 3, 'padding-top': 0, 'padding-right': 1, 'padding-bottom': 2, 'padding-left': 3, 'margin-top': 0, 'margin-right': 1, 'margin-bottom': 2, 'margin-left': 3 };
function tok(v) { const t = []; let d = 0, cur = ''; for (const c of v) { if (c === '(') d++; if (c === ')') d--; if (c === ' ' && !d) { if (cur) t.push(cur); cur = ''; } else cur += c; } if (cur) t.push(cur); return t; }
function doboz(p, v) { if (!(p in SAROK)) return v; const t = tok(v); if (t.length < 2 || t.length > 4 || t.includes('/')) return v; const M = [[0, 0, 0, 0], [0, 1, 0, 1], [0, 1, 2, 1], [0, 1, 2, 3]][t.length - 1]; return t[M[SAROK[p]]]; }
function ertek(v, ctx) {
  for (let i = 0; i < 6 && v.includes('var(--'); i++) v = v.replace(/var\(--([\w-]+)(?:\s*,\s*([^()]*(?:\([^()]*\))*[^()]*))?\)/g, (m, n, fb) => {
    if (n.startsWith('_')) return m; if (VMAP[n]) return VMAP[n]; const lit = L[ctx].valtozok['--' + n]; return lit != null ? lit : (fb || m); });
  return v;
}
(async () => {
  const m = L.main; const nkok = Object.keys(m.ki);
  const fsLanc = k => { const o = m.ki[k].osztaly; return o.length > 0 && o.every(c => c.startsWith('fs-') || c.startsWith('fo-')); };
  const stilusos = k => CTX.some(c => Object.keys(L[c].ki[k].stilus).length);
  // komponensen (DOWNLOAD_BLOCK) belüli elemek kizárása: ősük nem fs-láncú? — ős-ellenőrzés a JS nélküli DOM-ban: nem kell, a láncfeltétel elég
  const elig = new Set(nkok.filter(k => stilusos(k) && (fsLanc(k) || !m.ki[k].osztaly.length)));
  // kulcsok és szabálylefedés
  const natSzab = new Map(); // szabály idx → db
  const nemNat = new Set();
  const elem = {}; // nk → {ctx: {kulcs: {prop: val}}}
  for (const k of nkok) for (const c of CTX) for (const [kk, pr] of Object.entries(L[c].ki[k].stilus)) for (const [p, [v, idx]] of Object.entries(pr)) {
    if (!elig.has(k) || !KULCS[kk] || ROSSZ(p)) { nemNat.add(idx); continue; }
    if ((kk === 'before|' || kk === 'after|') && !('content' in pr)) continue; // tartalom nélküli pszeudo: nem kell natívan
    natSzab.set(idx, 1); ((elem[k] = elem[k] || {})[c] = elem[k][c] || {}); (elem[k][c][kk] = elem[k][c][kk] || {})[p] = doboz(p, ertek(v, c));
  }
  // csoportosítás láncok szerint
  const sig = k => JSON.stringify(CTX.map(c => (elem[k] || {})[c] || {}));
  const csop = {}; for (const k of elig) { const lanc = m.ki[k].osztaly.join(' ') || ('__' + m.ki[k].tag); (csop[lanc] = csop[lanc] || {}); (csop[lanc][sig(k)] = csop[lanc][sig(k)] || []).push(k); }
  // HTML-ből ős-osztályok a névadáshoz
  const osok = {}; { const re = /<([a-z0-9]+)\s+data-nk="(\d+)"([^>]*)>/g; let x; const verem = []; // egyszerűsítve: osztály szerint névadás
    while ((x = re.exec(HTML))) { const cl = (x[3].match(/class="([^"]*)"/) || [])[1] || ''; osok[x[2]] = cl; } }
  const iras = new Map(); // stílusLánc (szóközzel) → {ctx: {kulcs: {}}}
  const ujOsztaly = {}; // nk → hozzáadandó osztály
  const nevek = new Set();
  const nev = (alap) => { let n = alap.replace(/[^a-z0-9-]/gi, '-').toLowerCase().replace(/-+/g, '-'), i = 2; while (nevek.has(n)) n = alap + '-' + i++; nevek.add(n); return n; };
  for (const [lanc, sigs] of Object.entries(csop)) {
    const lista = Object.entries(sigs);
    let alapLanc = lanc.startsWith('__') ? null : lanc.split(' ');
    if (!alapLanc) { // osztálytalan elemek: új osztály szignatúránként
      lista.forEach(([s, ks], i) => { const n = nev('fo-' + lanc.slice(2) + '-' + (i + 1)); ks.forEach(k => ujOsztaly[k] = n); iras.set(n, JSON.parse(s)); });
      continue;
    }
    if (lista.length === 1) { iras.set(lanc, JSON.parse(lista[0][0])); continue; }
    // közös rész az alapláncra, eltérések combóra
    const objs = lista.map(([s]) => JSON.parse(s));
    const kozos = CTX.map((c, ci) => { const o = {}; for (const kk of Object.keys(objs[0][ci] || {})) { for (const [p, v] of Object.entries(objs[0][ci][kk])) if (objs.every(ob => ob[ci] && ob[ci][kk] && ob[ci][kk][p] === v)) (o[kk] = o[kk] || {})[p] = v; } return o; });
    iras.set(lanc, kozos);
    lista.forEach(([s, ks], i) => { const ob = JSON.parse(s);
      const kul = CTX.map((c, ci) => { const o = {}; for (const kk of Object.keys(ob[ci] || {})) for (const [p, v] of Object.entries(ob[ci][kk])) if (!(kozos[ci][kk] && kozos[ci][kk][p] === v)) (o[kk] = o[kk] || {})[p] = v; return o; });
      // név: a csoport első elemének legközelebbi fs-őse alapján
      const utolso = alapLanc[alapLanc.length - 1].replace(/^fs-/, '');
      const n = nev('fo-' + utolso + '-' + (i + 1));
      ks.forEach(k => ujOsztaly[k] = n); iras.set(lanc + ' ' + n, kul); });
  }
  // szivárgás-javítás: minden elemre az összes illeszkedő natív stílus (osztályhalmaz ⊆ elem osztályai) kaszkádja
  const elemOszt = k => [...m.ki[k].osztaly, ...(ujOsztaly[k] ? [ujOsztaly[k]] : [])];
  const stilusok = [...iras.keys()].map(l => ({ l, cs: l.split(' ') }));
  let rogzit = 0;
  for (let kor = 0; kor < 4; kor++) { const elotte = rogzit;
  for (const k of elig) { const eo = elemOszt(k); if (!eo.length) continue; const sajat = eo.join(' ');
    if (!iras.has(sajat)) iras.set(sajat, CTX.map(() => ({})));
    const illo = stilusok.filter(s => s.cs.every(c => eo.includes(c)) && s.l !== sajat);
    CTX.forEach((c, ci) => { for (const kk of Object.keys(KULCS)) {
      const cel = ((elem[k] || {})[c] || {})[kk] || {};
      const hatas = {}; // prop → {len, ertekek:Set}
      for (const st of illo) { const pr = ((iras.get(st.l)[ci]) || {})[kk] || {}; for (const [p, v] of Object.entries(pr)) { const h = hatas[p]; if (!h || st.cs.length > h.len) hatas[p] = { len: st.cs.length, e: new Set([v]) }; else if (st.cs.length === h.len) h.e.add(v); } }
      const sajatPr = ((iras.get(sajat)[ci] = iras.get(sajat)[ci] || {})[kk] = (iras.get(sajat)[ci] || {})[kk] || {});
      for (const p of new Set([...Object.keys(hatas), ...Object.keys(cel)])) {
        if (p in sajatPr) continue; const h = hatas[p];
        const eff = h && h.e.size === 1 ? [...h.e][0] : undefined;
        if (cel[p] !== undefined && eff !== cel[p]) { sajatPr[p] = cel[p]; rogzit++; }
        else if (cel[p] === undefined && h) { sajatPr[p] = 'revert'; rogzit++; }
      }
      if (!Object.keys(sajatPr).length) delete iras.get(sajat)[ci][kk];
    } }); }
  if (rogzit === elotte) break; }
  console.log('szivárgás miatt rögzített érték', rogzit);
  // töréspont-delták
  let reverts = 0; const terv = [];
  for (const [lanc, ob] of iras) {
    for (const kk of Object.keys(KULCS)) {
      CTX.forEach((c, ci) => { const most = (ob[ci] || {})[kk] || {}; const ki = {};
        const elozo = ELOZO[c] ? ((ob[CTX.indexOf(ELOZO[c])] || {})[kk] || {}) : {};
        for (const [p, v] of Object.entries(most)) if (elozo[p] !== v) ki[p] = v;
        for (const p of Object.keys(elozo)) if (!(p in most)) { ki[p] = 'revert'; reverts++; }
        if (Object.keys(ki).length) terv.push({ lanc: lanc.split(' '), bp: c, kulcs: kk, props: ki }); });
    }
  }
  // natív CSS a szimulációhoz
  let nat = ''; for (const c of CTX) { let blokk = ''; for (const t of terv.filter(t => t.bp === c)) blokk += '.' + t.lanc.join('.') + KULCS[t.kulcs][1] + '{' + Object.entries(t.props).map(([p, v]) => p + ':' + v).join(';') + '}'; nat += WFM[c] ? WFM[c] + '{' + blokk + '}' : blokk; }
  // maradék: minden szabály, ami nem kizárólag natívan lefedett (szövegesen, az eredeti sorrendben)
  const szabSzoveg = L.main.szab.filter(r => !r.site);
  const tisztanNat = new Set([...natSzab.keys()].filter(i => !nemNat.has(i)));
  // szelektorrészek illeszkedése JS nélkül és JS-sel
  const reszIllik = async (js) => { const b0 = await pw.chromium.launch(); const ctx = await b0.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: js });
    await ctx.route(/cdn\.sender\.net|universal\.js|googletagmanager|clarity\.ms|stripe/, r => r.abort());
    await ctx.route(u => u.href.split('?')[0] === U, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML }));
    const p = await ctx.newPage(); await p.goto(U); await p.waitForTimeout(js ? 2200 : 300);
    const out = await p.evaluate((szab) => { const bont = sel => { const r = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { r.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) r.push(cur.trim()); return r; };
      const o = {}; for (const r of szab) { if (!r.sel) continue; o[r.idx] = bont(r.sel).map(sp => { const t = sp.replace(/::[\w-]+(\([^)]*\))?/g, '').replace(/:(hover|focus-visible|focus|active)(?![\w-])/g, ''); let l; try { l = [...document.querySelectorAll(t || '*')]; } catch (_) { return null; }
        return l.map(e => e.dataset && e.dataset.nk ? e.dataset.nk : 'JS'); }); } return o; }, szabSzoveg.map(r => ({ idx: r.idx, sel: r.sel })));
    await b0.close(); return out; };
  const illKi = await reszIllik(false), illBe = await reszIllik(true);
  let jsMiatt = 0; for (const r of szabSzoveg) if (tisztanNat.has(r.idx) && ((illBe[r.idx] && illBe[r.idx].some(l => l && l.includes('JS'))) || (r.sel || '').includes('[') || (illBe[r.idx] && illKi[r.idx] && illBe[r.idx].some((l, i) => JSON.stringify((l || []).slice().sort()) !== JSON.stringify((illKi[r.idx][i] || []).slice().sort()))))) { tisztanNat.delete(r.idx); jsMiatt++; }
  console.log('JS-elemek miatt a maradékban is megtartott szabály', jsMiatt);
  const bontS = sel => { const r = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { r.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) r.push(cur.trim()); return r; };
  let kidobottResz = 0, vegyesDb = 0;
  const szukit = (r) => { // csak azokat a részeket hagyja, amelyek nem kizárólag natív elemekre illenek
    if (!r.sel || !illKi[r.idx] || (r.decl || []).some(d => d[0].startsWith('--'))) return r.text; const reszek = bontS(r.sel); const marad = [];
    reszek.forEach((sp, i) => { const ki = illKi[r.idx][i], be = illBe[r.idx][i];
      const csakNat = !sp.includes('[') && ki && be && be.length && !be.includes('JS') && be.length === ki.length && be.every(n => elig.has(n)) && !/::|:(hover|focus|active)/.test(sp) && !sp.includes('data-theme');
      if (csakNat && tisztanNat.has(r.idx) === false && natSzab.has(r.idx)) { kidobottResz++; return; }
      const alany = sp.split(/[\s>+~]+/).pop(); const vegyes = !sp.includes('[') && ki && ki.some(n => elig.has(n)) && !/:(hover|focus|active)/.test(sp) && !sp.includes('data-theme');
      if (vegyes) { kidobottResz += 0; { const pm = sp.match(/(::[\w-]+(\([^)]*\))?)$/); { let el = pm ? sp.slice(0, pm.index) : sp; if (pm && (/[\s>+~]$/.test(el) || !el)) el += '*'; marad.push(pm ? 'html body :where(' + el + ')' + pm[1] : 'html body :where(' + sp + ')'); } } vegyesDb++; } else marad.push(sp); });
    if (!marad.length) return ''; if (marad.join(',') === reszek.join(',')) return r.text;
    return marad.join(',') + r.text.slice(r.text.indexOf('{')); };
  const mar = []; let am = null;
  for (const r0 of szabSzoveg) { if (tisztanNat.has(r0.idx) && !(r0.decl || []).some(d => d[0].startsWith('--'))) continue;
    const t = szukit(r0); if (!t) continue; const r = Object.assign({}, r0, { text: t });
    if (r.media === '@other' || r.media === '') { if (am) { mar.push('}'); am = null; } mar.push(r.text); continue; }
    if (r.media !== am) { if (am) mar.push('}'); mar.push('@media ' + r.media + '{'); am = r.media; } mar.push(r.text); }
  if (am) mar.push('}');
  mar.push('html[data-theme="dark"] .fs-oldal{' + Object.entries(SOTET).map(([k, v]) => `--_beeco-ds---${k}:${v}`).join(';') + '}');
  const marCss = mar.join(''); console.log('maradékból kivett, csak natív elemre illő szelektorrész', kidobottResz, '| :where()-be csomagolt vegyes rész', vegyesDb);
  fs.writeFileSync(D + 'terv2.json', JSON.stringify({ terv, ujOsztaly, nevek: [...nevek] }));
  fs.writeFileSync(D + 'nativ2.css', nat); fs.writeFileSync(D + 'maradek2.css', marCss);
  console.log('natív írások', terv.length, '| új/combo osztályok', nevek.size, '| osztályt kapó elemek', Object.keys(ujOsztaly).length, '| revert', reverts);
  console.log('natív CSS', nat.length, 'B | maradék', marCss.length, 'B | tisztán natív szabály', tisztanNat.size);
  // szimulált HTML
  const siteHref = (HTML.match(/<link[^>]*href="([^"]*webflow\.shared[^"]*)"/) || [])[1];
  let siteCss = require('child_process').execSync('curl -s "' + siteHref + '"').toString();
  const szur = (css) => { let out = '', i = 0; while (i < css.length) { const j = css.indexOf('{', i); if (j < 0) { out += css.slice(i); break; } const fej = css.slice(i, j);
      if (fej.trim().startsWith('@media') || fej.trim().startsWith('@supports')) { let d = 1, k = j + 1; while (d) { if (css[k] === '{') d++; else if (css[k] === '}') d--; k++; } out += fej + '{' + szur(css.slice(j + 1, k - 1)) + '}'; i = k; continue; }
      let d = 1, k = j + 1; while (d) { if (css[k] === '{') d++; else if (css[k] === '}') d--; k++; }
      const sels = fej.split(',').filter(x => !/^\s*(\.(fs|fo)-[\w-]+)+(:[\w-]+(\([^)]*\))?|::[\w-]+)*\s*$/.test(x));
      if (sels.length) out += sels.join(',') + css.slice(j, k); i = k; } return out; };
  siteCss = szur(siteCss);
  const UJVAR = ':root{--_beeco-ds---bc-accent-ink:#8A6A00;--_beeco-ds---bc-raj-bg:#2F371E;--_beeco-ds---bc-raj-line:#000000;--_beeco-ds---bc-domb:#D3DDBB;--_beeco-ds---bc-d-perem:#FFFFFF}';
  nat = UJVAR + nat;
  let html = HTML.replace(/(<link[^>]*webflow\.shared[^>]*>)/, () => '<style id="site">' + siteCss + '</style><style id="nativ">' + nat + '</style>');
  let elso = true; html = html.replace(/<style data-fs="1">[\s\S]*?<\/style>/g, () => { if (elso) { elso = false; return '<style data-fs="1">' + marCss.replace(/\$/g, '$$$$') + '</style>'; } return '<style data-fs="1"></style>'; });
  for (const [k, n] of Object.entries(ujOsztaly)) html = html.replace(new RegExp(`(data-nk="${k}"[^>]*?)(class="([^"]*)")`), (x, a, b, c) => `${a}class="${c} ${n}"`).replace(new RegExp(`data-nk="${k}"(?![^>]*class=)`), `data-nk="${k}" class="${n}"`);
  fs.writeFileSync(D + 'szim2.html', html);
  // összevetés
  const PROPS = 'display position top right bottom left z-index width height min-width min-height max-width max-height margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left border-top-width border-top-style border-top-color border-right-color border-bottom-color border-left-color border-top-left-radius border-bottom-right-radius background-color background-image color font-family font-size font-weight line-height letter-spacing text-align text-transform opacity visibility transform box-shadow flex-direction flex-wrap justify-content align-items gap grid-template-columns object-fit content'.split(' ');
  const gyujt = (PROPS) => { const res = {}; const root = document.querySelector('.fs-oldal'); const kul = new Map();
    for (const e of [root, ...root.querySelectorAll('*')]) { let k = e.dataset && e.dataset.nk; if (!k) { const p = e.parentElement; k = (kul.get(p) || 'x') + '>' + e.tagName + [...p.children].indexOf(e); } kul.set(e, k);
      for (const ps of ['', '::before', '::after']) { const cs = getComputedStyle(e, ps || null); if (ps && (cs.content === 'none' || cs.content === 'normal')) continue;
        const v = PROPS.map(p => cs.getPropertyValue(p)); if (!ps) { const r = e.getBoundingClientRect(); v.push([Math.round(r.width), Math.round(r.height)].join('x')); } res[k + ps] = v; } } return res; };
  const b = await pw.chromium.launch();
  const lap = async (h, vp) => { const ctx = await b.newContext({ viewport: { width: vp, height: 900 }, reducedMotion: 'reduce' });
    await ctx.route(/cdn\.sender\.net|universal\.js|googletagmanager|clarity\.ms|stripe/, r => r.abort());
    await ctx.route(u => u.href.split('?')[0] === U, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: h }));
    const p = await ctx.newPage(); await p.goto(U); await p.waitForTimeout(2200); const r = await p.evaluate(gyujt, PROPS); await ctx.close(); return r; };
  const ossz = {};
  for (const vp of [1440, 1100, 900, 700, 390, 950, 500]) {
    const a = await lap(HTML, vp), a2 = await lap(HTML, vp), c = await lap(html, vp);
    const elt = []; for (const k in a) { if (!c[k]) { elt.push([k, 'HIÁNYZIK']); continue; } a[k].forEach((v, i) => { if (v !== c[k][i] && v === a2[k][i]) elt.push([k, i < PROPS.length ? PROPS[i] : 'meret', v, c[k][i]]); }); }
    ossz[vp] = elt; console.log(vp, 'eltérés', elt.length, elt.slice(0, 4).map(x => x.join(' ')).join(' || '));
  }
  fs.writeFileSync(D + 'elteres2.json', JSON.stringify(ossz));
  await b.close();
})();
