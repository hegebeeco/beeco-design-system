// CsicsergŐsz natív terv: a meglévő osztályokhoz NEM nyúl (az élő oldal is használja őket).
// Minden elem, amelyen az oldal saját (embed) CSS-e nyer, új combo osztályt kap (cs2-…), abba kerül a lapított érték.
// Kimenet: terv.json, nativ.css, maradek.css, szim.html, elteres.json
const pw = require(require('os').homedir() + '/CLAUDE/Csicsergosz-webapp/node_modules/playwright');
const fs = require('fs');
const U = 'https://beeco-weboldal.webflow.io/kampanyok/csicsergosz-nativ-draft';
const D = '/tmp/cs/nat/';
const HTML = fs.readFileSync(D + 'jelolt.html', 'utf8');
const L = JSON.parse(fs.readFileSync(D + 'lapit.json', 'utf8'));
const MAP = JSON.parse(fs.readFileSync(D + 'nk2id.json', 'utf8'));
const CTX = ['main', 'xl', 'medium', 'small', 'tiny'];
const SAV = { s1100: 'main', s1420: 'main' }; // nem Webflow-sávok: ha itt más nyer, a tulajdonság kódban marad
const ELOZO = { main: null, xl: 'main', medium: 'main', small: 'medium', tiny: 'small' };
const WFM = { main: '', xl: '@media screen and (min-width: 1440px)', medium: '@media screen and (max-width: 991px)', small: '@media screen and (max-width: 767px)', tiny: '@media screen and (max-width: 479px)' };
const KULCS = { '|': ['noPseudo', ''], '|hover': ['hover', ':hover'], '|focus': ['focus', ':focus'], '|focus-visible': ['focus-visible', ':focus-visible'], '|active': ['active', ':active'], 'before|': ['before', '::before'], 'after|': ['after', '::after'], 'placeholder|': ['placeholder', '::placeholder'] };
const WV = n => `var(--_csicsergosz---${n})`;
const VMAP = { 'cs-c-krem': 'cs-krem', 'cs-c-barack': 'cs-barack', 'cs-c-homok': 'cs-homok', 'cs-c-barna': 'cs-dio', 'cs-c-dio': 'cs-gesztenye', 'cs-c-kakao': 'cs-kakao', 'cs-c-mez': 'cs-mez', 'cs-c-narancs': 'cs-narancs',
  'cs-kakao': 'cs-kakao', 'cs-krem': 'cs-krem', 'cs-barack': 'cs-barack', 'cs-mez': 'cs-mez', 'cs-narancs': 'cs-narancs', 'cs-tinta': 'cs-szoveg-torzs', 'cs-keret-c': 'cs-keret-szin', 'cs-fokusz': 'cs-kiemeles', 'cs-arnyek-n': 'cs-arnyek', 'cs-tav': 'cs-mozgas-tav' };
const ROSSZ = p => p.startsWith('--') || p.startsWith('-webkit-') || p === 'font-variant-emoji' || p === '__font' || p === 'will-change';
const SAROK = { 'border-top-left-radius': 0, 'border-top-right-radius': 1, 'border-bottom-right-radius': 2, 'border-bottom-left-radius': 3, 'padding-top': 0, 'padding-right': 1, 'padding-bottom': 2, 'padding-left': 3, 'margin-top': 0, 'margin-right': 1, 'margin-bottom': 2, 'margin-left': 3 };
function tok(v) { const t = []; let d = 0, cur = ''; for (const c of v) { if (c === '(') d++; if (c === ')') d--; if (c === ' ' && !d) { if (cur) t.push(cur); cur = ''; } else cur += c; } if (cur) t.push(cur); return t; }
function doboz(p, v) { if (!(p in SAROK)) return v; const t = tok(v); if (t.length < 2 || t.length > 4 || t.includes('/')) return v; const M = [[0, 0, 0, 0], [0, 1, 0, 1], [0, 1, 2, 1], [0, 1, 2, 3]][t.length - 1]; return t[M[SAROK[p]]]; }
const PALETTA = { 'rgb(107, 59, 22)': 'cs-kakao', 'rgb(254, 247, 222)': 'cs-krem', 'rgb(255, 226, 181)': 'cs-barack', 'rgb(203, 156, 126)': 'cs-homok', 'rgb(168, 117, 82)': 'cs-dio', 'rgb(144, 94, 57)': 'cs-gesztenye', 'rgb(255, 170, 46)': 'cs-mez', 'rgb(234, 108, 24)': 'cs-narancs', 'rgb(26, 26, 26)': 'cs-tinta', 'rgb(255, 255, 255)': 'cs-feher' };
const SZINP = /^(color|background-color|border-(top|right|bottom|left)-color|outline-color|text-decoration-color|fill|stroke|caret-color|column-rule-color)$/;
const FONTRESET = /^font-(variant-(caps|ligatures|east-asian|alternates|position|numeric)|size-adjust|language-override|kerning|optical-sizing|feature-settings|variation-settings|stretch)$/;
function finom(p, v) { if (v == null) return v; v = v.replace(/calc\((-?[\d.]+) \* 1ms\)/g, '$1ms'); if (SZINP.test(p) && PALETTA[v.trim()]) return WV(PALETTA[v.trim()]); return v; }
const VARRE = /var\(--([\w-]+)(?:\s*,\s*((?:[^()]|\([^()]*\))*))?\)/g;
// érték: egyetlen Webflow-változó → var(--_csicsergosz---x) (a Webflow ehhez köti); összetett → literál (a Webflow összetett var()-t elront)
function ertek(v, ctx) {
  const t = v.trim();
  const egy = t.match(/^var\(--([\w-]+)(?:\s*,[^()]*(?:\([^()]*\))*[^()]*)?\)$/);
  if (egy) { const n = egy[1]; if (VMAP[n]) return WV(VMAP[n]); if (n.startsWith('_csicsergosz---')) return 'var(--' + n + ')'; }
  for (let i = 0; i < 8 && v.includes('var(--'); i++) v = v.replace(VARRE, (m, n, fb) => { const lit = L[ctx].valtozok['--' + n]; return lit != null && lit !== '' ? lit : (fb != null ? fb : m); });
  return v;
}
(async () => {
  const m = L.main; const nkok = Object.keys(m.ki);
  const szabSzoveg = m.szab.filter(r => !r.site);
  const reszIllik = async (js) => { const b0 = await pw.chromium.launch(); const ctx = await b0.newContext({ viewport: { width: 1300, height: 900 }, javaScriptEnabled: js });
    await ctx.route(/cdn\.sender\.net|universal\.js|googletagmanager|clarity\.ms|stripe|trustindex/, r => r.abort());
    await ctx.route(u => u.href.split('?')[0] === U, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML }));
    const p = await ctx.newPage(); await p.goto(U); await p.waitForTimeout(js ? 3000 : 300);
    const out = await p.evaluate((szab) => { const bont = sel => { const r = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { r.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) r.push(cur.trim()); return r; };
      const o = {}; for (const r of szab) { if (!r.sel) continue; o[r.idx] = bont(r.sel).map(sp => { const t = sp.replace(/::[\w-]+(\([^)]*\))?/g, '').replace(/:(hover|focus-visible|focus|active)(?![\w-])/g, ''); let l; try { l = [...document.querySelectorAll(t || '*')]; } catch (_) { return null; }
        return l.map(e => e.dataset && e.dataset.nk ? e.dataset.nk : 'JS'); }); } return o; }, szabSzoveg.map(r => ({ idx: r.idx, sel: r.sel })));
    await b0.close(); return out; };
  const illKi = await reszIllik(false), illBe = await reszIllik(true);
  // csak JS-sel illeszkedő szabályok tulajdonságai elemenként: ezeket nem írjuk natívan (a JS-állapot nyerjen)
  const jsCsak = {};
  const kulsoFelt = mm => /prefers-|hover|pointer|print|orientation|aspect-ratio|min-height|max-height/.test(mm || '');
  for (const r of szabSzoveg) { const ki = illKi[r.idx] || [], be = illBe[r.idx] || []; const kf = kulsoFelt(r.media); be.forEach((l, i) => { const kiS = new Set(ki[i] || []); const beS = new Set(l || []); for (const n of [...(l || []), ...(ki[i] || [])]) if (n !== 'JS' && (kf || !kiS.has(n) || !beS.has(n))) { const s0 = (jsCsak[n] = jsCsak[n] || new Set()); (r.decl || []).forEach(d => s0.add(d[0])); } }); }
  const elig = new Set(nkok.filter(k => MAP[k] && MAP[k].id && !MAP[k].komp && !/HtmlEmbed|String|ComponentInstance/.test(MAP[k].type) && !/^(br|link|script|style|source)$/.test(m.ki[k].tag)));
  const site = idx => !!m.szab[idx].site;
  const natSzab = new Set(), nemNat = new Set();
  const elem = {}; // nk → [ctxIdx] {kulcs: {prop: érték}}
  let kizartSav = 0, kizartVar = 0;
  for (const k of nkok) {
    // érintett tulajdonságok: ahol bármely kontextusban az oldal CSS-e nyer
    const erint = new Map(); // kk|p → true
    for (const c of [...CTX, ...Object.keys(SAV)]) for (const [kk, pr] of Object.entries(L[c].ki[k].stilus)) for (const [p, [, idx]] of Object.entries(pr)) if (!site(idx)) erint.set(kk + '\u0001' + p, 1);
    for (const kp of erint.keys()) {
      const [kk, p] = kp.split('\u0001');
      const nyertesek = [...CTX, ...Object.keys(SAV)].map(c => (L[c].ki[k].stilus[kk] || {})[p]).filter(Boolean).map(x => x[1]).filter(i => !site(i));
      let jo = elig.has(k) && KULCS[kk] && !ROSSZ(p) && !FONTRESET.test(p) && !(jsCsak[k] && jsCsak[k].has(p));
      if (jo && (kk === 'before|' || kk === 'after|')) jo = CTX.some(c => (L[c].ki[k].stilus[kk] || {}).content); // tartalom nélküli pszeudo nem kell
      if (jo) for (const [s, alap] of Object.entries(SAV)) { const a = (L[s].ki[k].stilus[kk] || {})[p], b = (L[alap].ki[k].stilus[kk] || {})[p]; if ((a && a[0]) !== (b && b[0])) { jo = false; kizartSav++; break; } }
      const ertekek = CTX.map(c => { const x = (L[c].ki[k].stilus[kk] || {})[p]; return x ? finom(p, doboz(p, ertek(x[0], c))) : null; });
      if (jo && ertekek.some(v => v && /var\(--(?!_csicsergosz---)/.test(v))) { jo = false; kizartVar++; }
      if (!jo) { nyertesek.forEach(i => nemNat.add(i)); continue; }
      nyertesek.forEach(i => natSzab.add(i));
      CTX.forEach((c, ci) => { const v = ertekek[ci]; if (v == null) return; ((elem[k] = elem[k] || CTX.map(() => ({})))[ci][kk] = elem[k][ci][kk] || {})[p] = v; });
      // ahol nincs nyertes, de máshol írunk: revert (a töréspont-deltánál)
      CTX.forEach((c, ci) => { if (ertekek[ci] == null && elem[k]) { (elem[k][ci][kk] = elem[k][ci][kk] || {})[p] = 'revert'; } });
    }
  }
  console.log('sáv miatt kódban maradt tulajdonság', kizartSav, '| feloldatlan változó miatt', kizartVar);
  // csoportosítás: lánc + szignatúra → új osztály (combo a láncon, vagy alaposztály, ha osztálytalan)
  const sig = k => JSON.stringify(elem[k]);
  const csop = {}; for (const k of Object.keys(elem)) { const lanc = m.ki[k].osztaly.join(' ') || ('__' + m.ki[k].tag); ((csop[lanc] = csop[lanc] || {})[sig(k)] = csop[lanc][sig(k)] || []).push(k); }
  const nevek = new Set(); const ujOsztaly = {}; const iras = new Map(); // láncnév (szóközzel) → [ctx]{kulcs:{}}
  const tisztit = s => s.toLowerCase().replace(/^(cs[-_]+)/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'elem';
  const nev = alap => { let n = 'cs2-' + alap, i = 2; while (nevek.has(n)) n = 'cs2-' + alap + '-' + i++; nevek.add(n); return n; };
  for (const [lanc, sigs] of Object.entries(csop)) for (const [s, ks] of Object.entries(sigs)) {
    const tail = lanc.startsWith('__') ? lanc.slice(2) : tisztit(lanc.split(' ').pop());
    const n = nev(tail); ks.forEach(k => ujOsztaly[k] = n);
    iras.set(lanc.startsWith('__') ? n : lanc + ' ' + n, JSON.parse(s));
  }
  // töréspont-delták
  const terv = []; let reverts = 0;
  for (const [lanc, ob] of iras) for (const kk of Object.keys(KULCS)) CTX.forEach((c, ci) => {
    const most = ob[ci][kk] || {}; const elozo = ELOZO[c] ? (ob[CTX.indexOf(ELOZO[c])][kk] || {}) : {}; const ki = {};
    for (const [p, v] of Object.entries(most)) { if (c === 'main' && v === 'revert') continue; if (elozo[p] !== v && !(elozo[p] === undefined && v === 'revert')) { ki[p] = v; if (v === 'revert') reverts++; } }
    if (Object.keys(ki).length) terv.push({ lanc: lanc.split(' '), bp: c, kulcs: kk, props: ki }); });
  let nat = ''; for (const c of CTX) { let blokk = ''; for (const t of terv.filter(t => t.bp === c)) blokk += '.' + t.lanc.join('.') + KULCS[t.kulcs][1] + '{' + Object.entries(t.props).map(([p, v]) => p + ':' + v).join(';') + '}'; nat += WFM[c] ? WFM[c] + '{' + blokk + '}' : blokk; }
  // maradék
  // DEKLARÁCIÓ-SZINTŰ maradék: egy (szabály, tulajdonság) csak akkor marad kódban, ha kell
  const natKey = (n, kk, p) => elig.has(n) && elem[n] && elem[n].some(o => o[kk] && o[kk][p] != null && o[kk][p] !== 'revert');
  const kulcsa = sp => { const pm = sp.match(/::(before|after|placeholder)$/); if (pm) return pm[1] + '|'; const ut = sp.split(/[\s>+~]+/).pop(); const am = ut.match(/:(hover|focus-visible|focus|active)(?![\w-])/); if (am) return '|' + am[1]; if (/::|:focus-within|:visited|:target|:checked|:disabled/.test(ut)) return null; return '|'; };
  const bontS = sel => { const r = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { r.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) r.push(cur.trim()); return r; };
  const kell = new Map(); const kellAdd = (i, p) => { if (!kell.has(i)) kell.set(i, new Set()); if (kell.get(i).has(p)) return false; kell.get(i).add(p); return true; };
  const reszek = {}; // idx → [{kk, nodes:Set, js:bool}]
  for (const r of szabSzoveg) { if (!r.sel) continue; const ki = illKi[r.idx] || [], be = illBe[r.idx] || [];
    reszek[r.idx] = bontS(r.sel).map((sp, i) => ({ kk: kulcsa(sp), nodes: new Set([...(ki[i] || []), ...(be[i] || [])].filter(n => n !== 'JS')), js: !ki[i] || !be[i] || (be[i] || []).includes('JS') })); }
  for (const r of szabSzoveg) { if (r.media === '@other' || !r.sel) continue;
    for (const [p] of r.decl || []) { if (p.startsWith('--')) { kellAdd(r.idx, p); continue; }
      for (const rs of reszek[r.idx]) { if (rs.js || !rs.kk) { kellAdd(r.idx, p); break; } let k0 = false; for (const n of rs.nodes) if (!natKey(n, rs.kk, p)) { k0 = true; break; } if (k0) { kellAdd(r.idx, p); break; } } } }
  // sorrend-védelem deklarációnként: ha egy kódban maradó (i,p) illik egy natív (n,kk,p)-re, az eredeti nyertes (w,p) is marad
  let vedett = 0;
  for (let kor = 0; kor < 10; kor++) { let valt = 0;
    for (const [i, ps] of kell) { const rsz = reszek[i]; if (!rsz) continue;
      for (const p of ps) for (const rs of rsz) { if (!rs.kk) continue; for (const n of rs.nodes) { if (!natKey(n, rs.kk, p)) continue;
        for (const c of [...CTX, ...Object.keys(SAV)]) { const x = ((L[c].ki[n].stilus[rs.kk]) || {})[p]; if (!x) continue; const w = x[1]; if (w !== i && !site(w) && kellAdd(w, p)) { valt++; vedett++; } } } } }
    if (!valt) break; }
  let csapda = 0, osszes = 0;
  for (const n of Object.keys(elem)) CTX.forEach((c, ci) => { for (const [kk, pr] of Object.entries(elem[n][ci])) for (const p of Object.keys(pr)) { if (pr[p] === 'revert') continue; const x = ((L[c].ki[n].stilus[kk]) || {})[p]; if (!x || site(x[1])) continue; osszes++; if (kell.has(x[1]) && kell.get(x[1]).has(p)) csapda++; } });
  console.log('sorrend-védelem', vedett, '| natív érték', osszes, '| ebből kódban is nyerő (szerkesztési csapda)', csapda);
  const mar = []; let am = null; let teljes = 0, resz = 0;
  for (const r of szabSzoveg) { let t;
    if (r.media === '@other' || !r.sel) t = r.text;
    else { const ps = kell.get(r.idx); if (!ps || !ps.size) continue;
      const dk = (r.decl || []).filter(d => ps.has(d[0])); if (dk.length === (r.decl || []).length) { t = r.text.slice(r.text.indexOf('{')) ; t = r.text; teljes++; } else { t = r.sel + '{' + dk.map(d => d[0] + ':' + d[1] + (d[2] === 'important' ? '!important' : '')).join(';') + '}'; resz++; } }
    if (r.media === '@other' || r.media === '') { if (am) { mar.push('}'); am = null; } mar.push(t); continue; }
    if (r.media !== am) { if (am) mar.push('}'); mar.push('@media ' + r.media + '{'); am = r.media; } mar.push(t); }
  if (am) mar.push('}');
  const tisztanNat = { size: szabSzoveg.filter(r => r.sel && r.media !== '@other' && !kell.has(r.idx)).length };
  console.log('kódban maradó szabály: teljes', teljes, '| szűkített', resz);
  const marCss = mar.join('');
  fs.writeFileSync(D + 'terv.json', JSON.stringify({ terv, ujOsztaly, nevek: [...nevek] }));
  fs.writeFileSync(D + 'nativ.css', nat); fs.writeFileSync(D + 'maradek.css', marCss);
  const eredetiCss = szabSzoveg.map(r => r.text).join('').length;
  console.log('natív írás', terv.length, '| új osztály', nevek.size, '| osztályt kapó elem', Object.keys(ujOsztaly).length, '| revert', reverts);
  console.log('natív CSS', nat.length, 'B | maradék', marCss.length, 'B (eredeti oldal-CSS kb.', eredetiCss, 'B) | tisztán natív szabály', tisztanNat.size, '/', szabSzoveg.length);
  // szimuláció
  let html = HTML.replace(/(<link[^>]*webflow\.shared[^>]*>)/, (x) => x + '<style id="nativ">' + nat + '</style>');
  let elso = true; html = html.replace(/<style data-fs="1">[\s\S]*?<\/style>/g, () => { if (elso) { elso = false; return '<style data-fs="1">' + marCss.replace(/\$/g, '$$$$') + '</style>'; } return '<style data-fs="1"></style>'; });
  for (const [k, n] of Object.entries(ujOsztaly)) html = html.replace(new RegExp(`(<[a-zA-Z][\\w-]*\\b[^>]*? data-nk="${k}"[^>]*>)`), (tag) => /class="/.test(tag) ? tag.replace(/class="([^"]*)"/, (x, c) => `class="${c} ${n}"`) : tag.replace(` data-nk="${k}"`, ` data-nk="${k}" class="${n}"`));
  fs.writeFileSync(D + 'szim.html', html);
  const PROPS = 'display position top right bottom left z-index width height min-width min-height max-width max-height margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left border-top-width border-top-style border-top-color border-right-color border-bottom-color border-left-color border-top-left-radius border-bottom-right-radius border-image-source background-color background-image color font-family font-size font-weight line-height letter-spacing text-align text-transform opacity visibility transform box-shadow filter flex-direction flex-wrap justify-content align-items gap grid-template-columns object-fit content'.split(' ');
  const gyujt = (PROPS) => { const res = {}; const kul = new Map();
    for (const root of document.querySelectorAll('body > [class*="dia_"]')) for (const e of [root, ...root.querySelectorAll('*')]) { let k = e.dataset && e.dataset.nk; if (!k) { const p = e.parentElement; k = (kul.get(p) || 'x') + '>' + e.tagName + [...p.children].indexOf(e); } kul.set(e, k);
      for (const ps of ['', '::before', '::after']) { const cs = getComputedStyle(e, ps || null); if (ps && (cs.content === 'none' || cs.content === 'normal')) continue;
        const v = PROPS.map(p => cs.getPropertyValue(p)); if (!ps) { const r = e.getBoundingClientRect(); v.push([Math.round(r.width), Math.round(r.height)].join('x')); } res[k + ps] = v; } } return res; };
  const b = await pw.chromium.launch();
  const lap = async (h, vp) => { const ctx = await b.newContext({ viewport: { width: vp, height: 900 }, reducedMotion: process.env.RM === '0' ? 'no-preference' : 'reduce' });
    await ctx.route(/cdn\.sender\.net|universal\.js|googletagmanager|clarity\.ms|stripe|trustindex/, r => r.abort());
    await ctx.route(u => u.href.split('?')[0] === U, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: h }));
    const p = await ctx.newPage(); await p.goto(U); await p.waitForTimeout(2500); const r = await p.evaluate(gyujt, PROPS); await ctx.close(); return r; };
  const ossz = {};
  for (const vp of (process.env.W ? process.env.W.split(',').map(Number) : [1440, 1300, 1100, 900, 700, 390, 500, 1420])) {
    const a = await lap(HTML, vp), a2 = await lap(HTML, vp), c = await lap(html, vp);
    const elt = []; for (const k in a) { if (!c[k]) { elt.push([k, 'HIÁNYZIK']); continue; } a[k].forEach((v, i) => { if (v !== c[k][i] && v === a2[k][i]) elt.push([k, i < PROPS.length ? PROPS[i] : 'meret', v, c[k][i]]); }); }
    ossz[vp] = elt; console.log(vp, 'eltérés', elt.length, elt.slice(0, 5).map(x => x.join(' ')).join(' || '));
  }
  fs.writeFileSync(D + 'elteres.json', JSON.stringify(ossz));
  await b.close();
})();
