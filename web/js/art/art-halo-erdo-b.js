// ============================================================
//  Matricák — „Élő lánc”, 2. fejezet: a tölgyes-gyertyános erdő, B szinten (docs/rajzolas.md, docs/halo-kutatas-erdo.md)
//  2. rész (11 matrica): széncinege, nagyfülű denevér, macskabagoly, vörös róka; emberi hatás: tarvágás, a holtfa elvitele,
//  bálványfa (idegenhonos); helyreállítás: a holtfa meghagyása, madár- és denevérodú, folyamatos erdőborítás,
//  őshonos cserje a bálványfa helyett. Az 1. rész: art-halo-erdo.js.
//  Megkülönböztetés: cinege = sárga mell fekete sávval, fekete fej fehér pofával, hernyó a csőrben · denevér = kiterjesztett
//  szárny, NAGYON hosszú fül · macskabagoly = kerek, fültoll nélkül, arcfátyol, faodúban (az ölyv szemből álló, horgas sárga csőrű) ·
//  róka = narancs, fehér mell és farokvég, fekete láb · a hatás-matricák semleges tárgyak (tuskók, talicska), gép, márka, ember nélkül.
//  A segédek az art-halo-b.js másolatai (+ erdei segédek), így a fájl önálló. Nincs szöveg, szám, márka, jelkép.
//  Render: node tools/art-render.js 2d web/js/art/art-halo-erdo-b.js ki.png --skip halo-erdo · Emoji-álnév nincs.
// ============================================================
ART.later('halo-erdo-b', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
(function(){
  const { rad, band } = ART.geo;
  const { hypot, max, min, abs } = Math;
  const sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d)), r1 = n => Math.round(n * 10) / 10;

  // ---------------- 2D segédek ----------------
  const area = poly => poly.reduce((a, p, i) => { const q = poly[(i + 1) % poly.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
  const orient = p => (area(p) >= 0 ? p : [...p].reverse());
  // Douglas–Peucker ritkítás (zárt sokszög) – kicsi SVG
  function simplify(poly, eps = .25){
    const dp = pts => { if(pts.length < 3) return pts;
      const a = pts[0], b = pts[pts.length - 1], L = hypot(b[0] - a[0], b[1] - a[1]) || 1; let best = 0, bi = 0;
      for(let i = 1; i < pts.length - 1; i++){ const d = abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if(d > best){ best = d; bi = i; } }
      return best > eps ? [...dp(pts.slice(0, bi + 1)).slice(0, -1), ...dp(pts.slice(bi))] : [a, b]; };
    const half = Math.floor(poly.length / 2);
    return [...dp(poly.slice(0, half + 1)).slice(0, -1), ...dp([...poly.slice(half), poly[0]]).slice(0, -1)];
  }
  // konvex vágás (Sutherland–Hodgman): a subject azon része, ami a konvex cp-n belül van
  function clip(subject, cp){
    const sg = Math.sign(area(cp)), inside = (p, a, b) => sg * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= 0;
    const cut = (p, q, a, b) => { const A1 = q[1] - p[1], B1 = p[0] - q[0], C1 = A1 * p[0] + B1 * p[1], A2 = b[1] - a[1], B2 = a[0] - b[0], C2 = A2 * a[0] + B2 * a[1], d = A1 * B2 - A2 * B1;
      return [(B2 * C1 - B1 * C2) / d, (A1 * C2 - A2 * C1) / d]; };
    let out = subject;
    for(let i = 0; i < cp.length && out.length; i++){ const a = cp[i], b = cp[(i + 1) % cp.length], inp = out; out = [];
      for(let j = 0; j < inp.length; j++){ const p = inp[(j + inp.length - 1) % inp.length], q = inp[j];
        if(inside(q, a, b)){ if(!inside(p, a, b)) out.push(cut(p, q, a, b)); out.push(q); } else if(inside(p, a, b)) out.push(cut(p, q, a, b)); } }
    return out;
  }
  const circ = (cx, cy, r, n = 12, ry = r, rot = 0) => Array.from({ length:n }, (_, i) => { const t = rad(360 * i / n), x = r * Math.cos(t), y = ry * Math.sin(t);
    return [cx + x * cos(rot) - y * sin(rot), cy + x * sin(rot) + y * cos(rot)]; });
  // hullámos szélű kör (szőrös test, gyűrött szirom): wob = hullám-mélység (arány), k = hullámok száma
  const wobC = (cx, cy, r, ry, wob, k, ph = 0, n = 28, rot = 0) => Array.from({ length:n }, (_, i) => { const t = 2 * Math.PI * i / n, q = 1 + wob * Math.sin(k * t + ph), x = r * q * Math.cos(t), y = ry * q * Math.sin(t);
    return [cx + x * cos(rot) - y * sin(rot), cy + x * sin(rot) + y * cos(rot)]; });
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  // sima görbe a pontokon át (Catmull–Rom): zárt (smC) és nyitott (smO)
  const crp = (p0, p1, p2, p3, t) => [0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t * t * t));
  const smC = (pts, n = 5, eps = .2) => { const N = pts.length, out = [];
    for(let i = 0; i < N; i++) for(let j = 0; j < n; j++) out.push(crp(pts[(i - 1 + N) % N], pts[i], pts[(i + 1) % N], pts[(i + 2) % N], j / n));
    return simplify(out, eps); };
  const smO = (pts, n = 6) => { const out = [];
    for(let i = 0; i < pts.length - 1; i++) for(let j = 0; j < n; j++) out.push(crp(pts[i - 1] || pts[i], pts[i], pts[i + 1], pts[i + 2] || pts[i + 1], j / n));
    out.push(pts[pts.length - 1]); return out; };
  const taper = (pts, w0, w1, cap = true) => band(pts, t => w0 + (w1 - w0) * t, cap);

  // ---------------- alakzat-gyártók (a fin() illeszti a vászonra) ----------------
  const face = (m, tone, pts, o) => Object.assign({ t:'poly', m, tone, pts }, o);                    // fő lap: kontúr + fehér perem
  const det = (m, tone, pts, o) => Object.assign({ t:'poly', m, tone, d:true, line:false, pts }, o);  // tónus-lap / dísz
  const pth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, polys }, o);                 // több részből álló fő lap
  const dpth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, line:false, polys }, o);
  const shineP = (pts, o = .7) => det('paper', 'light', pts, { o });

  // ---------------- tónus-sarlók szerves formára: a fény bal-fentről (LA), a megdöntést (tilt) visszaforgatjuk ----------------
  const LA = -135;
  function rayR(sil, c, a){   // a középpontból a szög irányába: az első metszés a körvonallal
    const ux = cos(a), uy = sin(a); let best = Infinity;
    for(let i = 0; i < sil.length; i++){ const p = sil[i], q = sil[(i + 1) % sil.length], ex = q[0] - p[0], ey = q[1] - p[1], den = ux * ey - uy * ex;
      if(abs(den) < 1e-9) continue; const dx = p[0] - c[0], dy = p[1] - c[1], t = (dx * ey - dy * ex) / den, s = (dx * uy - dy * ux) / den;
      if(t > 0 && s >= 0 && s <= 1 && t < best) best = t; }
    return best === Infinity ? 0 : best;
  }
  function crescent(sil, c, mid, half, depth, pad = .9, n = 16){
    const o = [], i = [];
    for(let k = 0; k <= n; k++){ const t = k / n, a = mid - half + 2 * half * t, r = rayR(sil, c, a), d = min(depth * Math.pow(Math.sin(Math.PI * t), .7), max(0, r - pad) * .9);
      o.push([c[0] + (r - pad) * cos(a), c[1] + (r - pad) * sin(a)]); i.push([c[0] + (r - pad - d) * cos(a), c[1] + (r - pad - d) * sin(a)]); }
    return simplify([...o, ...i.reverse()], .15);
  }
  // csak a sarlók (alap nélkül): világos bal-fent, sötét és legsötétebb élsáv jobb-lent
  function shade(m, sil, c, o = {}){
    const T = o.tilt || 0, D = 45 - T + (o.dshift || 0), out = [];
    if(o.ld !== 0) out.push(det(o.lm || m, 'light', crescent(sil, c, LA - T + (o.lshift || 0), o.lh || 80, o.ld || 6)));
    if(o.dd !== 0) out.push(det(o.dm || m, 'dark', crescent(sil, c, D, o.dh || 78, o.dd || 5)));
    if(o.ed !== 0) out.push(det(o.dm || m, 'line', crescent(sil, c, D, o.eh || 58, o.ed || 1.8), { o:.35 }));
    return out;
  }
  // szerves test 4 tónusban: alap + világos sarló + sötét sarló + élsáv
  const blob = (m, sil, c, o = {}) => [pth(m, o.bt || 'base', [sil]), ...shade(m, sil, c, o)];
  // cső / szár gerincvonal mentén: sziluett + a fény felőli világos csík + a túloldali sötét csík és élsáv
  function tube(sp, w, o = {}){
    const W = typeof w === 'function' ? w : () => w, n = sp.length, tt = i => i / (n - 1), T = o.tilt || 0, Lv = [cos(LA - T), sin(LA - T)];
    const nr = i => { const a = sp[max(0, i - 1)], b = sp[min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
    const sg = o.side || Math.sign(sp.reduce((s, _, i) => { const q = nr(i); return s + q[0] * Lv[0] + q[1] * Lv[1]; }, 0)) || 1;
    const off = k => sp.map((p, i) => { const q = nr(i), d = sg * k * W(tt(i)); return [p[0] + q[0] * d, p[1] + q[1] * d]; });
    return { sil:band(sp, W, o.cap !== false), light:band(off(.22), t => W(t) * .3), dark:band(off(-.25), t => W(t) * .28), edge:band(off(-.4), t => W(t) * .1) };
  }
  // levél-fél profilból: prof = [[u, v], …] a tőtől a csúcsig (u: 0…1 a hossz mentén, v ≥ 0 a félszélesség a hosszhoz képest);
  // teeth: fűrészfog (minden második pont kifelé és a csúcs felé tolva)
  function halfLeaf(prof, x, y, deg, len, side, teeth = 0, n = 3){
    const P = smO(prof, n);
    return P.map(([u, v], i) => { const tt = teeth && i % 2 && i > 0 && i < P.length - 1 ? teeth : 0, uu = u + tt * .6, vv = side * (v + tt);
      return [x + (uu * cos(deg) - vv * sin(deg)) * len, y + (uu * sin(deg) + vv * cos(deg)) * len]; });
  }
  const leafFull = (prof, x, y, deg, len, teeth, n) => [...halfLeaf(prof, x, y, deg, len, 1, teeth, n), ...halfLeaf(prof, x, y, deg, len, -1, teeth, n).reverse().slice(1, -1)];
  const litSide = (deg, side, T = 0) => (-sin(deg) * side) * cos(LA - T) + (cos(deg) * side) * sin(LA - T) > 0;
  // levelek kéttónusú hajtással: { lit: fény felőli felek, shade: árnyékos felek, deep: sötét sáv az árnyékos félen, rib: főér }
  function leafSet(list, T = 0){
    const out = { lit:[], shade:[], deep:[], rib:[] };
    for(const [prof, x, y, deg, len, teeth = 0, n = 3] of list){
      for(const s of [1, -1]){
        const h = halfLeaf(prof, x, y, deg, len, s, teeth, n);
        if(litSide(deg, s, T)) out.lit.push([...h, [x, y]]);
        else { out.shade.push([...h, [x, y]]); out.deep.push([...halfLeaf(prof.map(([u, v]) => [u, v * .36]), x + cos(deg) * len * .1, y + sin(deg) * len * .1, deg, len * .82, s), [x + cos(deg) * len * .1, y + sin(deg) * len * .1]]); }
      }
      out.rib.push(band([[x + cos(deg) * len * .08, y + sin(deg) * len * .08], [x + cos(deg) * len * .8, y + sin(deg) * len * .8]], .9, false));
    }
    return out;
  }
  const OVAL = [[0, 0], [.14, .17], [.42, .25], [.74, .19], [1, 0]];

  // ---------------- beillesztés a vászonra ----------------
  // a megdöntött sziluett befoglalóját a perem- és árnyék-tartalékkal a vászonra illeszti (egyenletes nagyítás + eltolás),
  // az útvonalakat egyirányú körüljárásra hozza (az átfedés ne lyukadjon ki) és ritkítja
  function fin(name, meta){
    const t = rad(meta.tilt || 0), c = Math.cos(t), s = Math.sin(t), shapes = meta.shapes.filter(Boolean);
    const ptsOf = sh => sh.pts || (sh.polys ? sh.polys.filter(p => p && p.length > 2).flat() : []);
    const rot = ([x, y]) => [50 + (x - 50) * c - (y - 50) * s, 50 + (x - 50) * s + (y - 50) * c];
    const Q = shapes.filter(sh => !sh.d && sh.t !== 'line').flatMap(sh => ptsOf(sh).map(rot)), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
    const X0 = 4.6, X1 = 95.4, Y0 = 4.6, Y1 = 91.8, g = meta.grow || 1;
    const k = min((X1 - X0) / (max(...xs) - min(...xs)), (Y1 - Y0) / (max(...ys) - min(...ys))) * g;
    const qm = [(max(...xs) + min(...xs)) / 2, (max(...ys) + min(...ys)) / 2], tg = [(X0 + X1) / 2, (Y0 + Y1) / 2];
    const d = [k * (50 - qm[0]) + tg[0] - 50, k * (50 - qm[1]) + tg[1] - 50], dI = [d[0] * c + d[1] * s, -d[0] * s + d[1] * c];
    const T = ([x, y]) => [50 + k * (x - 50) + dI[0], 50 + k * (y - 50) + dI[1]];
    const fix = p => { let q = p.map(T); if(q.length > 6) q = simplify(q, .42);
      return orient(q).map(([x, y]) => [r1(x), r1(y)]).filter((v, i, a) => !i || v[0] !== a[i - 1][0] || v[1] !== a[i - 1][1]); };
    const pathOf = polys => polys.filter(p => p && p.length > 2).map(fix).filter(q => q.length > 2).map(q => 'M' + q.map(v => v.join(' ')).join(' ') + 'Z').join('');
    const out = [];
    for(const sh of shapes){
      const o = Object.assign({}, sh);
      if(o.pts && o.t === 'poly'){ o.pts = fix(o.pts); if(o.pts.length < 3) continue; }
      else if(o.polys){ o.p = pathOf(o.polys); delete o.polys; if(!/\S/.test(o.p)) continue; }
      else if(o.t === 'line'){ o.pts = o.pts.map(T).map(([x, y]) => [r1(x), r1(y)]); o.w = r1((o.w || 2) * k); }
      out.push(o);
    }
    delete meta.grow;
    ART.add(name, Object.assign({ emoji:[], shadow:'hard' }, meta, { shapes:out }));
  }

  // szár (zöld cső): sziluett + világos csík
  const stemS = (tb, m = 'leaf') => [pth(m, 'base', [tb.sil]), det(m, 'light', tb.light)];


  // sávok egy konvex testen: a [x0, x1] függőleges sáv (ívelt szélekkel, bow = az ív öble) a test burkán belül
  const hullOf = pts => { const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
    for(const q of p){ while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for(const q of p.reverse()){ while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1)); };
  const strip = (body, x0, x1, bow = 3, y0 = -20, y1 = 120) => { const e = (x, s) => Array.from({ length:7 }, (_, i) => { const t = i / 6, y = y0 + (y1 - y0) * t; return [x + bow * Math.sin(Math.PI * t) * s, y]; });
    return clip([...e(x0, 1), ...e(x1, 1).reverse()], hullOf(body)); };
  // ugyanez vízszintes sávra (felülnézetes potroh)
  const stripH = (body, y0, y1, bow = 3) => { const e = y => Array.from({ length:7 }, (_, i) => { const x = -20 + 140 * i / 6; return [x, y - bow * Math.sin(Math.PI * i / 6)]; });
    return clip([...e(y0), ...e(y1).reverse()], hullOf(body)); };
  const bar = (pts, w) => band(pts, w, w > 1.4);   // vékony láb, csáp: kerek vég nélkül (kisebb SVG)

  // ---------------- 3D vetítés a tárgyakhoz (valódi méretből, ART.geo.camera) – az art-tortenelem.js készletéből ----------------
  const { camera } = ART.geo;
  const norm3 = v => { const l = hypot(...v) || 1; return v.map(x => x / l); };
  function cam(o){ const P = camera(Object.assign({ span:80 }, o)), a = rad(o.az || 0), e = rad(o.el || 0);
    P.V = [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)]; return P; }
  const corners = (x0, x1, y0, y1, z0, z1) => { const o = []; for(const x of [x0, x1]) for(const y of [y0, y1]) for(const z of [z0, z1]) o.push([x, y, z]); return o; };
  // doboz látható lapjai (az > 0: az eleje és a jobb oldala látszik)
  function box(P, x0, x1, y0, y1, z0, z1){
    const c = (x, y, z) => P([x, y, z]);
    return { top:[c(x0, y1, z1), c(x1, y1, z1), c(x1, y1, z0), c(x0, y1, z0)], front:[c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)],
      right:[c(x1, y0, z1), c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1)], sil:hullOf(corners(x0, x1, y0, y1, z0, z1).map(P)) };
  }
  const quad = q => ([s, t]) => lerp(lerp(q[0], q[1], s), lerp(q[3], q[2], s), t);
  const qrect = (q, s0, s1, t0, t1) => [[s0, t0], [s1, t0], [s1, t1], [s0, t1]].map(quad(q));


  // ---------------- erdei segédek ----------------
  // levél-profilok (u, v): karéjos tölgylevél (mély öblök), gyertyán (tojásdad, kihegyezett), mogyoró (kerek, szív alakú tő),
  // bálványfa-levélke (hosszúkás lándzsa)
  // tölgylevél: 4 pár kerek karéj, mély öblök, a csúcs felé szélesebb; rövid nyél nélkül (kocsánytalan tölgy)
  const OAKL = Array.from({ length:33 }, (_, i) => { const u = i / 32, lobe = abs(Math.sin(Math.PI * (u * 4.3 + .2)));
    return [u, i % 32 ? .38 * Math.pow(Math.sin(Math.PI * min(1, u * 1.02)), .5) * (.38 + .62 * Math.sqrt(lobe)) : 0]; });
  const HORN = [[0, 0], [.1, .2], [.36, .3], [.66, .23], [.88, .09], [1, 0]];
  const ROUND = [[0, 0], [-.06, .22], [.1, .44], [.38, .5], [.66, .41], [.86, .2], [1, 0]];
  const LANCE = [[0, 0], [.15, .2], [.5, .25], [.82, .15], [1, 0]];
  const leafOf = (prof, x, y, deg, len, teeth = 0, n = 3) => leafFull(prof, x, y, deg, len, teeth, n);
  // makk: (x, y) a kocsány töve, a = a makk tengelyének iránya (fok, 90 = lefelé), s = a hossza
  function acorn(x, y, a, s){
    const A = (u, v) => [x + s * (u * cos(a) - v * sin(a)), y + s * (u * sin(a) + v * cos(a))];
    const nut = smC([[.3, -.3], [.62, -.31], [.88, -.17], [1.02, 0], [.88, .17], [.62, .31], [.3, .3]].map(([u, v]) => A(u, v)), 3);
    const cup = smC([[.08, -.12], [.12, -.36], [.26, -.42], [.44, -.38], [.47, 0], [.44, .38], [.26, .42], [.12, .36], [.08, .12]].map(([u, v]) => A(u, v)), 3);
    const dots = [[.2, -.2], [.2, .05], [.32, -.3], [.32, -.06], [.32, .18], [.21, .28]].map(([u, v]) => circ(...A(u, v), s * .05, 6));
    return { nut, cup, dots, stalk:bar([A(-.18, 0), A(.12, 0)], s * .09), shine:band([A(.56, -.2), A(.8, -.14)], s * .07), c:A(.65, 0) };
  }
  // réti / erdei „sziget” (lekerekített földkupac füves vagy avaros tetővel): tető, föld-oldal
  const island = (cx, cy, rx, ry, th) => { const topS = circ(cx, cy, rx, 24, ry), side = [...circ(cx, cy, rx, 24, ry).filter(([, y]) => y >= cy - .01).sort((a, b) => b[0] - a[0]),
    ...circ(cx, cy + th, rx * .94, 24, ry * .9).filter(([, y]) => y >= cy + th - .01).sort((a, b) => a[0] - b[0])]; return { topS, side }; };
  // függőleges henger 3/4-ből (tuskó, rönk vége): tető-ellipszis + palást (cx, alja y0, teteje y1, sugár r, ellipszis-lapultság e)
  const cyl = (cx, y0, y1, r, e = .38) => { const top = circ(cx, y1, r, 14, r * e), bot = circ(cx, y0, r, 14, r * e).filter(([, y]) => y >= y0 - .01).sort((a, b) => b[0] - a[0]);
    return { top, side:[[cx - r, y1], ...bot.reverse(), [cx + r, y1]], rings:[circ(cx, y1, r * .62, 14, r * e * .62), circ(cx, y1, r * .28, 10, r * e * .28)] }; };
  // fűcsomó egy pontból (a, hossz, szélesség, hajlás)
  const tuft = (g, list) => list.map(([a, l, w, bend]) => taper(smO([g, [g[0] + l * .5 * cos(a) + bend, g[1] + l * .5 * sin(a)], [g[0] + l * cos(a) + bend * 2.4, g[1] + l * sin(a)]], 2), w, .4));
  // szárnyas termés (bálványfa): csavart, hosszúkás szárny, közepén a mag
  const samara = (x, y, a, s) => { const A = (u, v) => [x + s * (u * cos(a) - v * sin(a)), y + s * (u * sin(a) + v * cos(a))];
    return { wing:smC([[0, 0], [.2, -.14], [.5, -.12], [.8, -.14], [1, 0], [.8, .12], [.5, .1], [.2, .14]].map(([u, v]) => A(u, v)), 2), seed:circ(...A(.5, 0), s * .09, 8, s * .07, a) }; };
  // szárnyasan összetett levél (bálványfa): gerinc (rhachis) + n pár lándzsás levélke
  function pinnate(x, y, deg, len, n, ll, bend = 0){
    const sp = smO([[x, y], [x + len * .5 * cos(deg + bend), y + len * .5 * sin(deg + bend)], [x + len * cos(deg + bend * 2.2), y + len * sin(deg + bend * 2.2)]], 4);
    const at = t => { const f = t * (sp.length - 1), i = Math.min(sp.length - 2, Math.floor(f)); return [lerp(sp[i], sp[i + 1], f - i), Math.atan2(sp[i + 1][1] - sp[i][1], sp[i + 1][0] - sp[i][0]) * 180 / Math.PI]; };
    const lets = [];
    for(let i = 0; i < n; i++){ const [p, d] = at(.2 + .75 * i / n); for(const s of [1, -1]) lets.push([LANCE, p[0], p[1], d + s * 58, ll * (1 - .15 * i / n), 0, 2]); }
    const [pe, de] = at(1); lets.push([LANCE, pe[0], pe[1], de, ll, 0, 2]);
    return { rach:band(sp, .9, false), lets };
  }

  // =====================================================================
  //  13. Széncinege (Parus major) – ágon ülő kis madár, oldalnézet balra, a csőrében zöld hernyó: fényes fekete fej FEHÉR pofafolttal,
  //      SÁRGA mell a közepén FEKETE sávval, olajzöld hát, kékesszürke szárny fehér szárnycsíkkal, kékesszürke farok
  // =====================================================================
  {
    const body = smC([[22, 32], [30, 21], [42, 20], [52, 28], [61, 40], [65, 54], [60, 65], [48, 68], [36, 63], [28, 53], [23, 43]], 4);
    const breast = clip(smC([[18, 38], [36, 40], [50, 52], [58, 70], [20, 70]], 3), hullOf(body));
    const back = clip(smC([[40, 18], [56, 28], [68, 48], [66, 60], [54, 44], [42, 34]], 3), hullOf(body));
    const wing = smC([[46, 34], [58, 40], [68, 56], [74, 70], [64, 68], [52, 58], [45, 46]], 4), wbar = band(smO([[48, 40], [56, 46], [62, 56]], 2), 1.8, false);
    const tail = smC([[62, 58], [72, 70], [84, 86], [78, 89], [66, 76], [58, 66]], 2);
    const head = smC([[20, 32], [24, 22], [34, 17], [44, 19], [48, 27], [46, 36], [36, 40], [24, 39]], 3), cheek = smC([[29, 29], [38, 28], [42, 34], [34, 37], [28, 35]], 2);
    const stripe = taper(smO([[34, 39], [38, 50], [44, 60], [48, 67]], 2), 5, 3), beak = smC([[21, 29], [14, 31], [21, 33]], 1);
    const cat = tube(smO([[16, 31.5], [11, 36], [10, 44], [13, 50]], 2), 3), catS = [.3, .55, .8].map(t => { const p = cat.sil[Math.round(t * cat.sil.length / 2)]; return circ(p[0], p[1], .7, 6); });
    fin('halo_szencinege', { hu:'széncinege', en:'great tit', look:'great tit perched on a branch facing left with a small green caterpillar in its beak: glossy black head with a white cheek patch, yellow breast with a black central stripe, olive green back, blue-grey wing with a white wing bar and a blue-grey tail', shapes:[
      pth('wood', 'dark', [taper([[20, 67], [55, 66], [90, 70]], 4.2, 3.2)]),
      pth('steel', 'dark', [tail, bar([[42, 62], [42, 68]], 1.6), bar([[48, 64], [49, 68.5]], 1.6)]),
      ...blob('honey', body, [42, 44], { ld:3.5, dd:3.5, ed:0 }), det('grass', 'base', back), det('dark', 'base', stripe),
      ...blob('steel', wing, [60, 54], { ld:2.4, dd:2.4, ed:0, bt:'dark', lt:'base', dm:'blue' }), det('white', 'base', wbar),
      pth('dark', 'base', [head]), det('white', 'base', cheek),
      pth('grass', 'base', [cat.sil]), det('grass', 'light', cat.light),
      pth('dark', 'base', [beak]),
      det('dark', 'light', circ(29, 24.5, 1.8, 8)), det('paper', 'light', circ(28.4, 23.9, .6, 6)),
      shineP(band([[28, 20.5], [36, 18.5]], 1.4), .7),
    ] });
  }

  // =====================================================================
  //  14. Nagyfülű denevér (Myotis bechsteinii) – szemből, kiterjesztett, csipkés szélű hártyaszárnnyal (látszanak az ujjcsontok):
  //      barna, bolyhos test, NAGYON HOSSZÚ, nagy fülek, rózsás pofa, kis fekete szemek – kedves, nem ijesztő
  // =====================================================================
  {
    const wingL = smC([[43, 46], [30, 36], [20, 32], [9, 38], [3, 50], [11, 56], [13, 66], [22, 64], [27, 73], [36, 66], [45, 68]], 1, .15);
    const wingR = wingL.map(([x, y]) => [100 - x, y]).reverse();
    const fing = s => [[[20, 32], [3, 50]], [[20, 32], [13, 66]], [[20, 32], [27, 73]]].map(p => bar(p.map(([x, y]) => [s > 0 ? x : 100 - x, y]), 1));
    const arm = s => bar([[43, 46], [30, 36], [20, 32]].map(([x, y]) => [s > 0 ? x : 100 - x, y]), 2);
    const body = circ(50, 58, 10, 16, 13), head = circ(50, 40, 9.6, 16, 8.8);
    const ear = s => circ(50 + s * 7.5, 20, 5.2, 14, 15, s * 12), earIn = s => circ(50 + s * 7.2, 21.5, 2.8, 12, 11, s * 12);
    const muzzle = smC([[45, 43], [50, 41.5], [55, 43], [53, 47.5], [47, 47.5]], 2);
    fin('halo_denever', { hu:'nagyfülű denevér', en:"Bechstein's bat", look:"cute Bechstein's bat seen from the front with its wings spread: brown fluffy body, very long large ears, pinkish face, small black eyes, thin dark wing membranes with visible finger bones and scalloped edges", shapes:[
      ...blob('chocolate', wingL, [26, 50], { ld:3, dd:0, ed:0, lt:'light' }), pth('chocolate', 'base', [wingR]), det('chocolate', 'dark', crescent(wingR, [74, 50], 45, 70, 3)),
      dpth('dark', 'base', [...fing(1), ...fing(-1), arm(1), arm(-1)]),
      pth('wood', 'base', [ear(-1), ear(1)]), dpth('skin', 'dark', [earIn(-1), earIn(1)]),
      ...blob('wood', body, [50, 58], { ld:3, dd:3, ed:0 }),
      ...blob('wood', head, [50, 40], { ld:2.4, dd:2.4, ed:0 }), det('skin', 'base', muzzle),
      dpth('dark', 'base', [circ(45.6, 38.5, 1.9, 10), circ(54.4, 38.5, 1.9, 10), circ(50, 44, 1, 6, .7)]), dpth('paper', 'light', [circ(45, 37.8, .6, 6), circ(53.8, 37.8, .6, 6)]),
      pth('dark', 'base', [bar([[46, 70], [45, 74]], 1.4), bar([[54, 70], [55, 74]], 1.4)]),
      shineP(band([[45, 50], [48, 48]], 1.4), .6),
    ] });
  }

  // =====================================================================
  //  15. Macskabagoly (Strix aluco) – egy szürke kérgű fatörzs odújában ül: kerek fej FÜLTOLLAK NÉLKÜL, világos, kettős arcfátyol,
  //      NAGY sötét szemek, kis sárgás csőr, barna, pettyes-csíkos tollazat, az odú alsó pereme takarja a lábát
  // =====================================================================
  {
    const trunk = smC([[16, 98], [18, 60], [20, 24], [22, 8], [32, 12], [42, 4], [54, 10], [66, 3], [76, 11], [79, 26], [82, 60], [85, 98]], 1);
    const bark = [[[24, 22], [23, 40]], [[78, 30], [79, 48]], [[24, 90], [25, 97]], [[76, 88], [77, 97]], [[50, 8], [50, 14]]].map(p => bar(p, .9));
    const hollow = circ(50, 52, 27, 22, 36), lip = smC([[24, 76], [50, 81], [76, 76], [78, 87], [50, 92], [22, 87]], 3);
    const body = smC([[34, 44], [50, 40], [66, 44], [72, 62], [68, 82], [50, 88], [32, 82], [28, 62]], 4);
    const head = circ(50, 36, 19, 20, 17), disc = [circ(42.5, 37, 9, 14, 9.6), circ(57.5, 37, 9, 14, 9.6)];
    const wings = [smC([[30, 50], [36, 56], [36, 76], [30, 80], [27, 64]], 2), smC([[70, 50], [64, 56], [64, 76], [70, 80], [73, 64]], 2)];
    const spots = [[44, 62], [56, 62], [50, 68], [42, 74], [58, 74], [50, 58]].map(([x, y]) => circ(x, y, 1.3, 6, 2.2));
    fin('halo_macskabagoly', { hu:'macskabagoly', en:'tawny owl', look:'round brown tawny owl without ear tufts sitting in a tree hollow of a grey-barked trunk: pale double facial disc, big dark eyes, small yellowish beak, mottled brown plumage with dark streaks, the hollow rim hiding its feet', shapes:[
      face('steel', 'base', trunk), det('steel', 'dark', clip(trunk, [[72, 0], [100, 0], [100, 100], [72, 100]])), dpth('steel', 'line', bark, { o:.45 }),
      det('dark', 'base', hollow),
      ...blob('wood', body, [50, 64], { ld:3.4, dd:3.4, ed:0 }), dpth('wood', 'dark', wings), dpth('chocolate', 'base', spots),
      ...blob('wood', head, [50, 36], { ld:3.4, dd:3.4, ed:0 }),
      dpth('cardboard', 'light', disc),
      dpth('dark', 'base', [circ(43.5, 37.5, 4.6, 14), circ(56.5, 37.5, 4.6, 14)]), dpth('paper', 'light', [circ(42.3, 36, 1.4, 8), circ(55.3, 36, 1.4, 8)]),
      face('honey', 'dark', smC([[48, 42], [52, 42], [50, 48]], 1)),
      face('steel', 'base', lip), det('steel', 'dark', clip(lip, [[64, 60], [90, 60], [90, 100], [64, 100]])),
      shineP(band([[38, 24], [46, 20]], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  16. Vörös róka (Vulpes vulpes) – oldalnézet balra, ül: narancsvörös bunda, FEHÉR mell, pofa és farokvég, hegyes orr,
  //      nagy, hegyes, hátul sötét fülek, FEKETE „harisnyás” mellső lábak, a lábai elé kunkorodó bozontos farok
  // =====================================================================
  {
    const body = smC([[34, 40], [50, 40], [64, 54], [70, 72], [67, 86], [50, 90], [36, 86], [31, 66], [31, 50]], 4);
    const chest = clip(smC([[22, 44], [40, 46], [44, 64], [40, 80], [22, 80]], 3), hullOf(body));
    const tailSp = smO([[62, 84], [74, 88], [66, 95], [44, 96], [24, 93], [12, 88]], 3), tail = band(tailSp, t => 5 + 4.4 * Math.sin(Math.PI * min(1, t * 1.05)), true);
    const tip = clip(tail, [[0, 70], [24, 70], [24, 100], [0, 100]]);
    const head = smC([[4, 41], [12, 37], [24, 28], [36, 24], [46, 29], [48, 39], [40, 47], [26, 47], [12, 44]], 4);
    const jaw = clip(smC([[2, 42], [24, 41], [42, 44], [42, 50], [2, 50]], 1), hullOf(head));
    const ears = [smC([[29, 29], [32, 10], [40, 26]], 1), smC([[37, 26], [44, 8], [48, 30]], 1)], earTip = [smC([[31, 15], [32, 10], [34, 16]], 1), smC([[42.5, 13], [44, 8], [45.5, 14]], 1)];
    const legs = [taper([[38, 68], [36, 90]], 4.6, 3.8), taper([[45, 70], [45, 91]], 4.6, 3.8)];
    fin('halo_voros_roka', { hu:'vörös róka', en:'red fox', look:'red fox sitting in side view facing left: orange-red fur, white chest, white muzzle and white tail tip, pointed snout with a black nose, big pointed ears with dark tips, black lower front legs and a bushy tail curled in front of its feet', shapes:[
      pth('orange', 'dark', ears.slice(0, 1)),
      ...blob('orange', body, [50, 66], { ld:4, dd:4, ed:0, dm:'ember' }), det('white', 'base', chest),
      pth('dark', 'base', legs),
      ...blob('orange', tail, [44, 90], { ld:2.6, dd:2.6, ed:0, dm:'ember' }), det('white', 'base', tip),
      pth('orange', 'base', ears.slice(1)), dpth('dark', 'base', earTip),
      ...blob('orange', head, [30, 38], { ld:3, dd:2.4, ed:0, dm:'ember' }), det('white', 'base', jaw),
      det('dark', 'base', circ(4.8, 41.2, 2, 8)), det('dark', 'base', taper([[26, 35], [31, 34]], 2.2, 1.4)),
      shineP(band([[40, 44], [50, 46]], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  17. Nagy tarvágás – kerek erdei „sziget”, rajta négy friss tuskó (világos, évgyűrűs vágáslap, sötét kéreg), hátul jobbra
  //      egymásra rakott farönkök (3 + 2 + 1, a vágott végük felénk) – gép, márka, ember nélkül
  // =====================================================================
  {
    const I = island(50, 68, 42, 16, 9);
    const S = [[27, 62, 8.5, 10], [50, 58, 8, 9], [34, 80, 9, 9], [60, 78, 8, 8]].map(([x, y, r, h]) => Object.assign(cyl(x, y, y - h, r), { x, r }));
    const ends = [[70, 60], [80, 60], [90, 60], [75, 51.4], [85, 51.4], [80, 42.8]], R = 5.1;
    const logs = ends.map(([x, y]) => hullOf([...circ(x, y, R, 10), ...circ(x - 12, y - 7, R, 10)]));
    fin('halo_h_tarvagas', { hu:'nagy tarvágás', en:'large clear-cut', look:'round forest ground patch with four fresh tree stumps showing pale cut surfaces with growth rings and dark bark, and a neat stack of cut logs with their round ends facing the viewer; no machinery and no people', shapes:[
      face('soil', 'base', I.side), det('soil', 'dark', I.side.slice(Math.floor(I.side.length / 2) - 4)),
      ...blob('grass', I.topS, [50, 68], { ld:3, dd:3, ed:0, bt:'dark', lt:'base', dm:'leaf' }),
      pth('chocolate', 'light', logs), pth('wood', 'light', ends.map(([x, y]) => circ(x, y, R, 12))), dpth('wood', 'base', ends.map(([x, y]) => circ(x, y, R * .45, 8))),
      pth('chocolate', 'light', S.map(c => c.side)), dpth('chocolate', 'base', S.map(c => clip(c.side, [[c.x + c.r * .35, 0], [100, 0], [100, 100], [c.x + c.r * .35, 100]]))),
      pth('wood', 'light', S.map(c => c.top)), dpth('wood', 'base', S.flatMap(c => c.rings.slice(0, 1))),
      shineP(band([[16, 64], [24, 60]], 1.6), .55),
    ] });
  }

  // =====================================================================
  //  18. A holtfa elvitele – talicska 3/4-es oldalnézetben (kerék elöl-balra, két nyél és láb hátul), benne egy ÜREGES farönk
  //      (a vége felénk: sötét odú, évgyűrű) és száraz ágak – „rendrakás” az erdőben
  // =====================================================================
  {
    const tray = smC([[18, 50], [84, 46], [74, 72], [36, 74]], 1), rim = [[16, 47], [86, 43], [86, 47.5], [16, 51.5]];
    const wheel = circ(24, 80, 11, 18), hub = circ(24, 80, 3.4, 10);
    const frame = [bar([[24, 80], [40, 72], [72, 68]], 2.6), bar([[74, 64], [97, 57]], 3), bar([[66, 70], [68, 91]], 3)];
    const logEnd = circ(34, 43, 9, 16, 11), hole = circ(35, 44, 4.6, 12, 6), logB = hullOf([...logEnd, ...circ(72, 37, 9, 16, 11)]);
    const br = [bar(smO([[58, 38], [74, 24], [88, 14]], 2), 2.2), bar([[74, 24], [78, 12]], 1.5), bar(smO([[48, 40], [56, 22], [60, 8]], 2), 2), bar([[56, 22], [49, 13]], 1.4)];
    fin('halo_h_holtfa_el', { hu:'a holtfa elvitele', en:'removing dead wood', look:'a wheelbarrow in three-quarter side view carrying away a hollow dead log (its open end with a dark hole facing the viewer) and dry branches – tidying up the forest', shapes:[
      pth('wood', 'dark', br),
      pth('chocolate', 'light', [logB]), det('chocolate', 'base', clip(logB, [[40, 41], [90, 33], [90, 56], [40, 56]])),
      pth('wood', 'light', [logEnd]), det('wood', 'base', circ(35, 44, 6.4, 12, 8)), det('dark', 'base', hole),
      pth('dark', 'base', frame),
      face('teal', 'base', tray), det('teal', 'dark', clip(tray, [[62, 40], [100, 40], [100, 80], [62, 80]])), face('teal', 'light', rim),
      ...blob('dark', wheel, [24, 80], { ld:2.6, dd:0, ed:0 }), face('steel', 'base', hub),
      shineP(band([[26, 56], [44, 55]], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  19. Bálványfa (Ailanthus altissima, idegenhonos) – fiatal fa vékony, világosszürke törzzsel; a csúcsán NAGYON HOSSZÚ,
  //      szárnyasan összetett levelek (sok pár lándzsás levélke), és lecsüngő, vörösessárga, csavart szárnyú termés-fürt
  // =====================================================================
  {
    const tr = tube(smO([[50, 97], [50, 72], [51, 44]]), t => 4.4 - 2 * t);
    const PL = [pinnate(51, 44, -160, 52, 3, 19, 16), pinnate(51, 43, -20, 52, 3, 19, -16), pinnate(51, 43, -94, 40, 2, 16, -4)];
    const L = leafSet(PL.flatMap(p => p.lets));
    const sam = [[56, 50, 70], [60, 49, 40], [62, 54, 60], [58, 56, 95], [66, 55, 35], [64, 60, 80], [70, 60, 50], [68, 64, 70]].map(([x, y, a]) => samara(x, y + 4, a, 15));
    fin('halo_h_ozon', { hu:'bálványfa (idegenhonos)', en:'tree of heaven (invasive)', look:'young tree of heaven: slim pale grey trunk topped with very long arching pinnate leaves made of many pairs of lance-shaped leaflets, and a hanging cluster of reddish-yellow twisted winged seeds', shapes:[
      pth('steel', 'dark', [tr.sil]), det('steel', 'base', tr.light),
      pth('leaf', 'dark', PL.map(p => p.rach)),
      pth('grass', 'light', L.lit), pth('grass', 'base', L.shade),
      pth('leaf', 'dark', [bar([[53, 44], [58, 52], [60, 55]], 1.2)]),
      pth('honey', 'base', sam.filter((_, i) => i % 2).map(q => q.wing)), pth('orange', 'base', sam.filter((_, i) => !(i % 2)).map(q => q.wing)), dpth('red', 'dark', sam.map(q => q.seed)),
      shineP(band([[48, 90], [48.5, 76]], 1.2), .5),
    ] });
  }

  // =====================================================================
  //  20. A holtfa meghagyása – a földön fekvő, mohos, korhadó farönk (a vége felénk, évgyűrűkkel), a tetején apró gombák,
  //      az oldalán egy bogár, előtte páfrány – a rönk a helyén marad
  // =====================================================================
  {
    const ground = wobC(52, 78, 44, 10, .05, 7, 0, 24);
    const endC = [22, 58], logB = hullOf([...circ(endC[0], endC[1], 9, 14, 13), ...circ(84, 48, 9, 14, 13)]), end = circ(endC[0], endC[1], 9, 16, 13);
    const moss = [wobC(46, 44, 16, 4.4, .12, 7, 0, 22, -8), wobC(74, 38.5, 10, 3.6, .12, 5, 0, 18, -8)];
    const caps = [[58, 38, 5], [65, 36, 4], [52, 40.5, 3.4]].map(([x, y, r]) => ({ cap:smC([[x - r, y], [x - r * .7, y - r * .7], [x, y - r * .9], [x + r * .7, y - r * .7], [x + r, y]], 2), st:[[x - r * .3, y], [x + r * .3, y], [x + r * .25, y + r * .9], [x - r * .25, y + r * .9]] }));
    const beetle = circ(46, 60, 4.6, 12, 3.2, -10), bh = circ(40.6, 61.2, 2, 8), blegs = [[[44, 62], [42, 67]], [[47, 63], [47, 68]], [[50, 62], [52, 67]], [[40, 60], [36, 57]]].map(p => bar(p, 1));
    const fern = [[-120, 20, 3.4, -2], [-95, 22, 3.4, 0], [-70, 20, 3.4, 2], [-45, 16, 3, 2.4]].flatMap(q => tuft([86, 82], [q]));
    fin('halo_v_holtfa_meghagyas', { hu:'a holtfa meghagyása', en:'leaving dead wood in place', look:'a mossy rotting log lying on the forest floor with its cut end facing the viewer showing growth rings, small tan mushrooms growing on top, a dark beetle on its side and a fern in front – the log is left in place', shapes:[
      pth('leaf', 'dark', [ground]),
      ...blob('chocolate', logB, [54, 54], { ld:0, dd:3.4, ed:0, bt:'light' }),
      pth('grass', 'base', moss), det('grass', 'light', moss[0].filter(([, y]) => y < 44).concat([[40, 44]])),
      face('wood', 'light', end), dpth('wood', 'base', [circ(22.6, 58.6, 5.4, 12, 8), circ(23, 59, 1.8, 8, 2.6)]),
      pth('cream', 'base', caps.map(c => c.st)), pth('cardboard', 'base', caps.map(c => c.cap)), dpth('cardboard', 'light', caps.map(c => crescent(c.cap, [c.cap[0][0] + 3, c.cap[0][1] - 1], -135, 60, 1.2))),
      pth('dark', 'base', [...blegs, beetle, bh]), det('blue', 'base', band([[43.5, 58.6], [47.5, 57.6]], 1)),
      pth('grass', 'base', fern), dpth('leaf', 'base', fern.map(p => p.slice(Math.floor(p.length / 2)))),
      shineP(band([[28, 50], [38, 46]], 1.6), .5),
    ] });
  }

  // =====================================================================
  //  21. Madár- és denevérodú – szürke kérgű fatörzsön fent egy madárodú (fa doboz, féltető, KEREK röpnyílás), lent egy lapos,
  //      széles denevérodú: elöl zárt, alul keskeny RÉS, a hátlap lent kinyúlik bordázott „leszállópadként”
  // =====================================================================
  {
    const trunk = smC([[18, 99], [25, 92], [27, 70], [26, 45], [28, 20], [29, 1], [71, 1], [72, 22], [74, 46], [73, 72], [76, 92], [83, 99]], 2);
    const bark = [[[31, 46], [30.5, 54]], [[68, 48], [69, 60]], [[30, 94], [31, 99]], [[66, 95], [67, 99]], [[69, 8], [68.6, 14]]].map(p => bar(p, .9));
    const twig = tube(smO([[68, 14], [82, 6], [94, 4]]), t => 3 - 1.4 * t), L = leafSet([[OVAL, 84, 6, -60, 12], [OVAL, 90, 4.4, 30, 11]]);
    const bF = [[37, 18], [57, 18], [57, 44], [37, 44]], bS = [[57, 18], [62, 14.5], [62, 40.5], [57, 44]];
    const bRoof = [[34, 19], [59, 19], [66, 13], [41, 13]], bRoofE = [[34, 19], [59, 19], [59, 21.5], [34, 21.5]];
    const vF = [[33, 56], [61, 56], [61, 82], [33, 82]], vS = [[61, 56], [66, 52.5], [66, 88], [61, 93]], plate = [[33, 82], [61, 82], [61, 93], [33, 93]];
    const vRoof = [[31, 57], [63, 57], [69, 52], [37, 52]], vRoofE = [[31, 57], [63, 57], [63, 59.5], [31, 59.5]], slit = [[33, 82], [61, 82], [61, 84.6], [33, 84.6]];
    const grooves = [87, 90].map(y => bar([[35, y], [59, y]], .7));
    fin('halo_v_odu', { hu:'madár- és denevérodú', en:'bird box and bat box on a tree', look:'grey-barked tree trunk with a wooden bird nest box with a round entrance hole and a sloping roof at the top, and below it a flat wide bat box with a narrow slit at the bottom and a grooved landing board sticking out underneath', shapes:[
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade),
      pth('chocolate', 'light', [trunk, twig.sil]), det('chocolate', 'base', clip(trunk, [[64, 0], [90, 0], [90, 100], [64, 100]])), dpth('chocolate', 'dark', bark, { o:.7 }),
      face('wood', 'dark', bS), face('wood', 'light', bF), det('dark', 'base', circ(47, 29, 4.6, 14)), det('wood', 'dark', crescent(circ(47, 29, 4.6, 14), [47, 29], -135, 70, 1.4)),
      face('dark', 'light', bRoof), det('dark', 'base', bRoofE),
      face('wood', 'dark', vS), face('wood', 'dark', plate), face('wood', 'base', vF), det('dark', 'base', slit), dpth('wood', 'line', grooves, { o:.5 }),
      face('dark', 'light', vRoof), det('dark', 'base', vRoofE),
      shineP([[39, 23], [44, 23], [40.5, 40], [39, 40]], .45), shineP([[35, 61], [40, 61], [36.5, 78], [35, 78]], .35),
    ] });
  }

  // =====================================================================
  //  22. Folyamatos erdőborítás – kerek erdei „sziget”, rajta két öreg, vastag törzsű, nagy koronájú fa, és közöttük három
  //      különböző korú fiatal fa (csemete, suhanc) – vegyes korú erdő, nincs tarvágás
  // =====================================================================
  {
    const I = island(50, 80, 46, 13, 9);
    const T1 = tube(smO([[26, 82], [26, 56], [27, 34]]), t => 5.4 - 1.6 * t), T2 = tube(smO([[72, 78], [72, 52], [71, 28]]), t => 5.8 - 1.8 * t);
    const C1 = wobC(27, 30, 21, 17, .06, 7, .3, 28), C2 = wobC(71, 22, 22, 18, .06, 7, 1.2, 28);
    const Y = [[48, 84, 60, 8, 1.8], [38, 90, 78, 5, 1.3], [60, 92, 82, 4.4, 1.2]];
    const ys = Y.map(([x, y0, y1, r, w]) => ({ st:band([[x, y0], [x, y1 + r * .4]], w, false), cr:wobC(x, y1, r, r * .9, .08, 5, 0, 16) }));
    fin('halo_v_folyamatos_erdo', { hu:'folyamatos erdőborítás', en:'continuous cover forestry', look:'round forest island with two big old trees with thick trunks and large crowns, and three young trees of different sizes growing between them – a mixed-age forest', shapes:[
      face('soil', 'base', I.side), det('soil', 'dark', I.side.slice(Math.floor(I.side.length / 2) - 4)),
      ...blob('grass', I.topS, [50, 80], { ld:2.6, dd:2.6, ed:0 }),
      pth('wood', 'base', [T1.sil, T2.sil]), dpth('wood', 'dark', [T1.dark, T2.dark]),
      ...blob('leaf', C2, [71, 22], { ld:4, dd:4, ed:0, lm:'grass', lt:'base' }),
      ...blob('leaf', C1, [27, 30], { ld:4, dd:4, ed:0, lm:'grass', lt:'base' }),
      pth('wood', 'light', ys.map(y => y.st)), pth('grass', 'light', ys.map(y => y.cr)), dpth('grass', 'base', ys.map((y, i) => crescent(y.cr, [Y[i][0], Y[i][2]], 45, 70, Y[i][3] * .35))),
      shineP(band([[14, 26], [20, 18]], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  23. Őshonos cserje a bálványfa helyett – kis földkupacba ültetett fiatal galagonya (bokros korona, piros termések),
  //      előtte a földön fekszik a kihúzott bálványfa-csemete, látható gyökérrel és szárnyas levéllel
  // =====================================================================
  {
    const soil = smC([[8, 84], [20, 74], [44, 70], [70, 72], [90, 80], [92, 90], [70, 94], [26, 94], [10, 91]], 4), dig = smC([[40, 74], [50, 71], [60, 74], [55, 77], [45, 77]], 3);
    const stems = [tube(smO([[50, 74], [48, 60], [42, 46]]), 2.2), tube(smO([[50, 74], [52, 58], [60, 44]]), 2)];
    const crown = wobC(50, 38, 24, 17, .1, 9, 0, 32);
    const berries = [[38, 34], [42, 38], [58, 30], [62, 34], [50, 46], [46, 26], [66, 42]].map(([x, y]) => circ(x, y, 2.3, 8));
    const gstem = taper(smO([[82, 88], [64, 86], [44, 88], [30, 86]], 3), 2.6, 1.8);
    const roots = [[[82, 88], [90, 80]], [[82, 88], [94, 86]], [[82, 88], [91, 94]], [[86, 84], [93, 81]]].map(p => taper(p, 1.6, .5, false));
    const PL = pinnate(32, 86, -164, 32, 3, 13, 10), L = leafSet(PL.lets);
    fin('halo_v_balvanyfa_helyett', { hu:'őshonos cserje a bálványfa helyett', en:'native shrub instead of tree of heaven', look:'a young native hawthorn shrub with a bushy green crown and red berries planted in a small soil mound, and in front a pulled-out tree of heaven seedling lying on the ground with its roots showing and a pinnate leaf', shapes:[
      ...blob('soil', soil, [50, 84], { ld:3, dd:3, ed:0 }), det('soil', 'dark', dig),
      pth('wood', 'base', stems.map(t => t.sil)),
      ...blob('leaf', crown, [50, 38], { ld:4, dd:4, ed:0, lm:'grass', lt:'base' }),
      pth('red', 'base', berries), dpth('paper', 'light', berries.map(b => circ(b[0][0] - 2.4, b[0][1] - .8, .6, 6)), { o:.8 }),
      pth('wood', 'light', [...roots, circ(85, 87, 3.2, 10, 2.8)]), pth('grass', 'dark', [gstem, PL.rach]),
      pth('grass', 'base', L.lit), pth('sage', 'dark', L.shade),
      shineP(band([[33, 34], [38, 27]], 1.8), .6),
    ] });
  }

})();
});
