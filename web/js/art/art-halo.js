// ============================================================
//  Matricák — „Ha eltűnne a méh…” (virágos rét tápláléklánc-homokozója) B szinten (docs/rajzolas.md, docs/halo-jatekterv.md)
//  27 matrica: 18 élőlény (hazai réti faj, a faj-azonosító jegyekkel), 4 emberi hatás, 5 helyreállító lépés.
//  A játékban hatszögben, ~44–52 px-en jelennek meg (artIcon('halo_…')) → nagy, egyszerű sziluett, kevés, de jellegzetes részlet.
//  A három méh ránézésre különbözik: házi méh = karcsú, aranybarna, csíkos, hegyes potroh, borostyán szárny ·
//  poszméh = kerek, szőrös, fekete, sárga gallér + sárga öv, FEHÉR farok · vadméh (levélvágó méh) = sötét, világos szőrsávok,
//  a lábai közt kerek levélkorong. A zengőlégy felülnézetben: egy pár szárny oldalra tartva, nagy vörösbarna szem.
//  A rajz nem ítélkezik: nincs szöveg, szám, márka, jelkép, koponya; a hatás-matricák semleges tárgyak (permetező, fűnyíró, térkő).
//  Az élőlények 2D-ben rajzolva (y lefelé), a fény bal-fentről; szerves formán tónus-sarlók (világos bal-fent, sötét + élsáv jobb-lent).
//  A segédek az art-nature-b.js (sarlók, cső, levél) és az art-tortenelem.js (fin(): a kész rajz a vászonra illesztve) másolatai,
//  így a fájl önálló. Render: node tools/art-render.js 2d web/js/art/art-halo.js ki.png --skip halo
//  Emoji-álnév csak a 🐞 (katica) és a 🦗 (szöcske) – a többit a játék névvel kéri.
// ============================================================
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
  // körök uniója (virágzat, lomb, szőrös test) a c pontból sugárirányban mintavételezve
  const union = (C, c) => simplify(Array.from({ length:120 }, (_, i) => { const a = i * 3, u = [cos(a), sin(a)]; let r = 0;
    for(const [x, y, R] of C){ const dx = x - c[0], dy = y - c[1], b = u[0] * dx + u[1] * dy, q = b * b - (dx * dx + dy * dy - R * R); if(q >= 0) r = max(r, b + Math.sqrt(q)); }
    return [c[0] + r * u[0], c[1] + r * u[1]]; }), .2);

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
  // levél-profilok (u, v)
  const OVAL = [[0, 0], [.14, .17], [.42, .25], [.74, .19], [1, 0]];
  const OBOV = [[0, 0], [.2, .16], [.55, .31], [.84, .29], [.97, .14], [.93, 0]];                        // visszás tojásdad, csípett csúcs (here, lucerna)
  const HEART = [[0, 0], [-.07, .15], [-.02, .31], [.16, .39], [.4, .36], [.64, .25], [.84, .11], [1, 0]]; // szív alakú (csalán)
  const LANCE = [[0, 0], [.18, .07], [.5, .09], [.8, .055], [1, 0]];                                     // lándzsás (aranyvessző)

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

  // =====================================================================
  //  1. Lucerna (Medicago sativa) – tömött, lilás fürtvirágzat a szár csúcsán és egy oldalágon, hármas levelek visszás tojásdad,
  //     csípett csúcsú levélkékkel (a pillangós virágokat apró világos „vitorla” és sötét „csónak” pötty jelzi)
  // =====================================================================
  {
    const C1 = [[47, 12, 6], [41.5, 18, 6.5], [52.5, 18, 6.5], [40.5, 26, 6.8], [53.5, 26, 6.8], [42, 34, 6.4], [52, 34, 6.4], [47, 40, 5.6], [47, 24, 8.5]];
    const C2 = [[75, 33, 4.4], [71.5, 38, 4.6], [78.5, 38, 4.6], [72.5, 44, 4.4], [77.5, 44, 4.2], [75, 39, 5.2]];
    const R1 = union(C1, [47, 25]), R2 = union(C2, [75, 39]);
    const main = tube(smO([[51, 97], [50, 80], [48.5, 62], [47, 44]]), t => 3.4 - 1.2 * t), side = tube(smO([[49.5, 62], [60, 54], [70, 47]]), 2.3);
    const pet = tube(smO([[50.5, 80], [42, 77], [34, 75]]), 1.7), pet2 = tube(smO([[49, 68], [58, 67], [64, 66]]), 1.6);
    const L = leafSet([[OBOV, 34, 75, 186, 14], [OBOV, 34, 75, 232, 12.5], [OBOV, 34, 75, 140, 12.5], [OBOV, 64, 66, -6, 12.5], [OBOV, 64, 66, -50, 11], [OBOV, 64, 66, 38, 11]]);
    const fl = (C, dx, dy, r) => C.slice(0, -1).map(([x, y]) => circ(x + dx, y + dy, r, 8));
    fin('halo_lucerna', { hu:'lucerna', en:'lucerne (alfalfa) flower', look:'lucerne stem with a dense violet-purple raceme of small pea flowers at the top and a smaller one on a side branch, trifoliate leaves with oval notched leaflets', shapes:[
      pth('leaf', 'base', [main.sil, side.sil, pet.sil, pet2.sil]), det('leaf', 'light', main.light),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep),
      ...blob('purple', R2, [75, 39], { ld:3, dd:3, ed:0 }),
      ...blob('purple', R1, [47, 25], { ld:5, dd:5, ed:1.8 }),
      dpth('purple', 'light', [...fl(C1, -1.8, -1.8, 2.2), ...fl(C2, -1.2, -1.2, 1.6)]),
      dpth('purple', 'dark', fl(C1, 1.6, 2.6, 1.3)),
      shineP(band([[40, 17], [43.5, 11.5]], 1.8), .8),
    ] });
  }

  // =====================================================================
  //  2. Pipacs (Papaver rhoeas) – négy gyűrött skarlát szirom (a hátsó pár sötétebb), a tövükön fekete folt, sötét porzók,
  //     zöld toktermés sugaras bibével, szőrös szár, mellette egy lehajló, szőrös bimbó (az oldalán kivillanó piros sziromral)
  // =====================================================================
  {
    const c = [50, 38], P = (a, r, ry, ph) => smC(wobC(c[0] + 13 * cos(a), c[1] + 11 * sin(a), r, ry, .05, 5, ph, 18), 3);
    const back = [P(-128, 19, 16, 0), P(-52, 19, 16, 1.3)], fl1 = P(142, 19.5, 16.5, 2.1), fl2 = P(38, 19.5, 16.5, .6);
    const blot = Array.from({ length:24 }, (_, i) => { const a = 15 * i, r = 9 * (.78 + .24 * Math.cos(rad(4 * a))); return [c[0] + r * cos(a), c[1] + .82 * r * sin(a)]; });
    const stem = tube(smO([[50.5, 50], [52, 70], [49.5, 97]]), 3.2), bs = tube(smO([[51, 84], [40, 73], [31, 64], [24.5, 62], [20.5, 66]]), 2.2);
    const bud = circ(19.5, 72, 4.8, 14, 7, 12), hairs = [58, 66, 74, 82, 90].map((y, i) => band([[i % 2 ? 53 : 48.5, y], [i % 2 ? 55.5 : 46, y - 1.8]], .8));
    fin('halo_pipacs', { hu:'pipacs', en:'corn poppy', look:'scarlet corn poppy flower with four crinkled petals, a black blotch at the centre with dark stamens and a green seed capsule, a hairy stem and a nodding hairy bud', shapes:[
      pth('leaf', 'base', [stem.sil, bs.sil]), det('leaf', 'light', stem.light), dpth('leaf', 'dark', hairs),
      ...blob('grass', bud, [19.5, 72], { ld:2.4, dd:2.4, ed:0 }), det('red', 'base', [[17.2, 76.5], [19, 78.6], [21.3, 76.6], [19.6, 71]]),
      pth('red', 'dark', back),
      ...blob('red', fl1, [c[0] + 12 * cos(142), c[1] + 10 * sin(142)], { ld:5, dd:0, ed:0 }),
      ...blob('red', fl2, [c[0] + 12 * cos(38), c[1] + 10 * sin(38)], { ld:0, dd:5, ed:1.8 }),
      dpth('red', 'dark', [[150, 12, 24], [125, 16, 22], [58, 16, 22], [30, 13, 24]].map(([a, r0, r]) => band([[c[0] + r0 * cos(a), c[1] + r0 * .82 * sin(a)], [c[0] + r * cos(a + 6), c[1] + r * .82 * sin(a + 6)]], .9)), { o:.7 }),
      dpth('dark', 'base', [blot]),
      dpth('dark', 'dark', Array.from({ length:10 }, (_, i) => circ(c[0] + 10.5 * cos(36 * i + 10), c[1] + 8.6 * sin(36 * i + 10), 1.2, 6))),
      ...blob('grass', circ(c[0], c[1] - .5, 4.6, 12, 4), [c[0], c[1] - .5], { ld:1.4, dd:0, ed:0 }),
      dpth('leaf', 'line', Array.from({ length:6 }, (_, i) => band([[c[0], c[1] - .5], [c[0] + 3.6 * cos(30 * i), c[1] - .5 + 3.1 * sin(30 * i)]], .7, false))),
      shineP(band([[33, 30], [37, 25]], 2), .75),
    ] });
  }

  // =====================================================================
  //  3. Margitvirág (Leucanthemum vulgare) – 3/4-ben hátradőlt fej: fehér nyelves virágok két sorban, nagy, lapos sárga korong,
  //     szár, alul karéjos-fogas levél
  // =====================================================================
  {
    const M = ([x, y]) => [50 + x, 34 + y * .64], pet = (a, len, wid) => leafFull([[0, 0], [.15, .1], [.6, .12], [.94, .08], [1, 0]], 10 * cos(a), 10 * sin(a), a, len, 0, 1).map(M);
    const back = Array.from({ length:10 }, (_, i) => pet(18 + 36 * i, 30, 0)), front = Array.from({ length:10 }, (_, i) => pet(36 * i, 32, 0));
    const disc = circ(50, 34, 12.5, 20, 8.2), dots = [[-6, -2], [0, -4.2], [6, -2], [-3, 2], [3, 2], [0, -.5], [8, 1.5], [-8, 1.5]].map(([x, y]) => circ(50 + x, 34 + y, 1, 6));
    const stem = tube(smO([[50, 40], [51.5, 64], [49, 97]]), 3.2);
    const LOB = [[0, 0], [.2, .1], [.45, .17], [.75, .2], [.95, .12], [1, 0]], L = leafSet([[LOB, 50.5, 80, 206, 27, .07, 2], [LOB, 50.5, 66, -24, 18, .06, 2]]);
    fin('halo_margitvirag', { hu:'margitvirág', en:'oxeye daisy', look:'oxeye daisy head tilted back in three-quarter view: white ray petals in two rows around a large flat yellow disc, green stem with a lobed toothed leaf', shapes:[
      ...stemS(stem), pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep),
      pth('white', 'dark', back), pth('paper', 'base', front),
      dpth('white', 'dark', front.filter((_, i) => i >= 1 && i <= 4).map(p => p.slice(0, Math.ceil(p.length / 2)).concat([p[0]])), { o:.6 }),
      ...blob('honey', disc, [50, 34], { ld:3, dd:3, ed:1.2 }),
      dpth('honey', 'dark', dots),
      shineP(band([[42, 31.5], [46, 29]], 1.8), .85),
    ] });
  }

  // =====================================================================
  //  4. Nagy csalán (Urtica dioica) – egyenes, négyélű szár, keresztben átellenes, szív alakú, erősen fűrészes levélpárok
  //     (felfelé kisebbek), a levélhónaljakból lecsüngő zöld virágfüzérek, a száron csalánszőrök
  // =====================================================================
  {
    // kevés, de NAGY levél: alul egy nagy, középen egy közepes szív alakú, durván fűrészes levélpár (átellenes), a csúcson kis
    // levélpár; a középső levélhónaljakból lelógó, világos, gyöngyös zöld virágfüzérek; a száron fehér csalánszőrök
    const stem = tube(smO([[50, 99], [50.5, 70], [50, 40], [49.5, 8]]), t => 3.8 - 1.8 * t);
    const HT = [[0, 0], [-.13, .15], [-.1, .32], [.06, .41], [.3, .38], [.55, .26], [.78, .12], [1, 0]];   // hegyes csúcsú szív
    const LL = [[HT, 42, 82, 168, 32, .065, 2], [HT, 58, 82, 12, 32, .065, 2], [HT, 44.5, 40, 200, 23, .06, 2], [HT, 55.5, 40, -20, 23, .06, 2],
      [HT, 48, 16, 236, 10, .06, 1], [HT, 52, 16, -56, 10, .06, 1]], L = leafSet(LL);
    const pets = [[49, 80, 42, 82], [51, 80, 58, 82], [49, 38, 44.5, 40], [51, 38, 55.5, 40]].map(([a, b, c, d]) => band([[a, b], [c, d]], 2));
    // az ér-rajzolat: főér + 3 pár oldalér (a csalánlevél „ráncolt” erezete)
    const veins = LL.slice(0, 4).flatMap(([, x, y, d, l]) => [.25, .45, .65].flatMap(t => { const b = [x + cos(d) * l * t, y + sin(d) * l * t], w = l * .22 * (1.1 - t);
      return [1, -1].map(s => band([b, [b[0] + w * cos(d + s * 55), b[1] + w * sin(d + s * 55)]], .8, false)); }));
    // virágfüzér: gyöngyös szélű, lecsüngő szál a levélhónaljból
    const cat = (sp, n) => band(smO(sp, 3), t => 1.8 + 1.3 * abs(Math.sin(Math.PI * n * t)), true);
    const kat = [cat([[48.5, 42], [42, 48], [37, 56], [35, 66]], 4), cat([[51.5, 42], [58, 48], [63, 56], [65, 66]], 4), cat([[49, 43], [45, 52], [43.5, 61]], 5), cat([[51, 43], [55, 52], [56.5, 61]], 5)];
    const hairs = [12, 24, 30, 52, 60, 68, 92].map((y, i) => band([[i % 2 ? 51.8 : 48.2, y], [i % 2 ? 54.4 : 45.6, y - 2]], .8));
    fin('halo_csalan', { hu:'nagy csalán', en:'stinging nettle', look:'stinging nettle: an upright stem with a few big opposite heart-shaped, coarsely toothed dark green leaves (a large lower pair, a medium pair and a small top pair) with netted veins, pale green beaded flower tassels hanging from the upper leaf axils and tiny white stinging hairs on the stem', shapes:[
      ...stemS(stem), dpth('paper', 'light', hairs), pth('leaf', 'base', pets),
      pth('leaf', 'base', L.lit), pth('leaf', 'dark', L.shade), dpth('leaf', 'line', L.deep, { o:.4 }),
      dpth('grass', 'light', L.rib, { o:.7 }), dpth('grass', 'base', veins, { o:.8 }),
      pth('grass', 'light', kat), dpth('grass', 'base', kat.map(p => p.slice(Math.floor(p.length / 2)))),
      shineP(band([[18, 80], [26, 77]], 1.6), .7),
    ] });
  }

  // =====================================================================
  //  5. Fehér here (Trifolium repens) – gömbölyű fehér-krém virágfej apró pártákból (az alsók lekonyulók, barnás-rózsás),
  //     hármas levél kerek levélkékkel és világos, V alakú rajzolattal
  // =====================================================================
  {
    // virágfej: sűrű gömb apró, csőszerű pártákból, három rétegben (kint krém, középen fehér, a közepén hófehér) – pamacs,
    // nem pitypang-bóbita; az alsó sor lekonyul (halvány rózsaszín). A két hármas levél NAGY és elöl van (a fő ismertetőjel).
    const hc = [36, 24], R = 14.5;
    // egy párta: kis, lekerekített „cső” (csepp), a tövétől kifelé mutat; a lenti párták lefelé konyulnak
    const flo = (r, a, len, w) => { const p = [hc[0] + r * cos(a), hc[1] + r * sin(a)], d = sin(a) > 0 ? a + .5 * (90 - a) : a;
      const U = [cos(d), sin(d)], V = [-U[1], U[0]], P = (u, v) => [p[0] + U[0] * u * len + V[0] * v * w, p[1] + U[1] * u * len + V[1] * v * w];
      return [P(0, -.3), P(.55, -.5), P(.88, -.42), P(1, 0), P(.88, .42), P(.55, .5), P(0, .3)]; };
    const ring = (r, n, len, w, ph, f = () => true) => Array.from({ length:n }, (_, i) => ph + 360 * i / n).filter(f).map(a => flo(r, a % 360, len, w));
    const outer = ring(R - 5, 15, 9.5, 6, 0, a => sin(a % 360) < .35), low = ring(R - 6, 15, 11, 5.6, 0, a => sin(a % 360) >= .35);
    const mid = ring(R - 10, 9, 8.5, 5.8, 16), inner = ring(1.5, 5, 6, 4.8, 40);
    const under = circ(hc[0], hc[1] + .5, R, 16);
    const stem = tube(smO([[36, 36], [39, 60], [44, 97]]), 3);
    const pA = tube(smO([[44, 97], [55, 80], [64, 60]]), 2.6), pB = tube(smO([[44, 97], [33, 86], [24, 74]]), 2.4);
    // hármas levél: kerek, csúcsán kicsit csípett levélkék, mindegyiken a világos „V”
    const CLOV = [[0, 0], [.12, .2], [.36, .4], [.66, .44], [.9, .3], [1, .1], [.95, 0]];
    const tri = [[64, 58, 21, [-86, 32, 150]], [24, 72, 16.5, [-118, 2, 124]]];
    const LL = tri.flatMap(([x, y, l, as]) => as.map(a => [CLOV, x, y, a, l, 0, 3])), L = leafSet(LL);
    const chev = LL.map(([, x, y, a, l]) => band([[.7, -.3], [.44, 0], [.7, .3]].map(([u, v]) => [x + (u * cos(a) - v * sin(a)) * l, y + (u * sin(a) + v * cos(a)) * l]), l * .12, false));
    fin('halo_feher_here', { hu:'fehér here', en:'white clover', look:'white clover: a dense round globe flower head of many small creamy-white tube florets (the lowest drooping, faintly pink) with a green base on a stalk, and two big trefoil leaves in front, each round leaflet with a pale V chevron mark', shapes:[
      pth('leaf', 'base', [stem.sil, pA.sil, pB.sil]), det('leaf', 'light', stem.light),
      pth('cream', 'base', [under]), pth('blossom', 'light', low), pth('cream', 'light', outer),
      dpth('white', 'base', mid), dpth('paper', 'light', inner),
      dpth('white', 'dark', mid.filter((_, i) => i >= 1 && i <= 4).map(p => p.slice(0, Math.ceil(p.length / 2)).concat([p[p.length - 1]])), { o:.8 }),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep, { o:.7 }),
      dpth('sage', 'light', chev),
      shineP(band([[25, 21], [28, 15]], 1.8), .9),
    ] });
  }

  // =====================================================================
  //  6. Réti fűfélék – fűcsomó ívelt, kéttónusú levéllemezekkel, három szárral: bugás (lazán szétálló kalászkák), füzéres
  //     (tömött, hengeres – mint a mezei komócsin) és egy lecsüngő buga
  // =====================================================================
  {
    const base = [50, 95], blade = (tip, bend, w) => taper(smO([[base[0] + (tip[0] - base[0]) * .06, base[1]], lerp(base, tip, .5).map((v, i) => v + bend[i]), tip]), w, .6);
    const lit = [blade([20, 50], [-4, -2], 6), blade([40, 36], [-2, 0], 6), blade([74, 44], [0, -4], 6)], shd = [blade([30, 62], [-6, 4], 5.5), blade([62, 50], [2, 2], 6), blade([86, 60], [4, -4], 5.5)];
    const culm = [smO([[48, 94], [45, 60], [36, 14]]), smO([[51, 94], [55, 55], [60, 30]]), smO([[53, 94], [66, 60], [76, 34], [82, 30]])];
    const spikelets = (pts, n, s) => pts.flatMap((p, i) => i % 2 || i < 2 ? [] : [s, -s].map(sd => circ(p[0] + sd * 2.6, p[1] + 1.2, 1.3, 7, 2.6, sd > 0 ? 30 : -30)));
    const pan = spikelets(smO([[39, 30], [37.5, 22], [36, 12]], 3), 0, 1), spike = taper(smO([[59.6, 32], [58.6, 20], [58, 8]]), 6.5, 5.2);
    const nod = smO([[82, 30], [87, 36], [89, 45]], 3).map(([x, y], i) => circ(x + (i % 2 ? 2 : -1.5), y, 1.4, 7, 2.8, 20));
    fin('halo_fufelek', { hu:'réti fűfélék', en:'meadow grasses', look:'tuft of arching two-tone grass blades with three flowering stems: a loose open panicle, a dense cylindrical spike like timothy and a drooping panicle', shapes:[
      pth('leaf', 'base', culm.map(c => band(c, 1.6, false))),
      pth('leaf', 'base', shd), dpth('leaf', 'dark', shd.map(p => p.slice(0, Math.ceil(p.length / 2)).concat([base])), { o:.5 }),
      pth('grass', 'base', lit), dpth('grass', 'light', lit.map(p => p.slice(Math.floor(p.length / 2)).concat([base])), { o:.9 }),
      pth('cardboard', 'light', [...pan, ...nod]), dpth('cardboard', 'base', [...pan, ...nod].map(p => p.slice(3, 8).concat([p[2]]))),
      ...blob('sage', spike, [58.8, 20], { ld:1.6, dd:1.8, ed:0, dm:'grass' }),
      dpth('grass', 'dark', [11, 15, 19, 23, 27].flatMap(y => [circ(57.6, y, .8, 5), circ(60, y + 2, .8, 5)])),
      shineP(band([[26, 60], [33, 48]], 1.4), .6),
    ] });
  }

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

  // =====================================================================
  //  7. Házi méh (Apis mellifera) – oldalnézet balra: KARCSÚ test, aranybarna, sötétbarna csíkos, hegyes potroh, barnás szőrös tor,
  //     két pár áttetsző, borostyános szárny, könyökös csáp, a hátsó lábon narancs virágporcsomó (virágporkosár)
  // =====================================================================
  {
    const T = -8, head = circ(22, 50, 7.5, 16, 8.5), thor = wobC(37.5, 47, 10.5, 10, .03, 14, 0, 24);
    const abd = smC([[46, 45], [58, 43.5], [71, 46.5], [82, 53], [89, 58.5], [81, 63.5], [67, 66], [54, 64.5], [46.5, 58]], 4);
    const legs = [[[33, 56], [29, 64], [27, 71]], [[39, 57], [39, 66], [37, 73]], [[45, 56], [51, 64], [53, 72]]].map(p => bar(p, 2));
    const ant = [bar([[19, 43.5], [16, 35], [9.5, 31]], 1.7)];
    const wF = smC([[40, 40], [52, 31], [68, 24.5], [78, 23], [80, 27], [70, 33], [54, 40]], 4), wH = smC([[45, 43], [58, 38], [70, 36], [73, 39.5], [62, 44], [50, 46]], 4);
    fin('halo_hazimeh', { hu:'házi méh', en:'honeybee', tilt:T, look:'slender honeybee in side view facing left: golden-brown pointed abdomen with dark brown stripes, fuzzy brown thorax, dark head with big eye and elbowed antennae, two pairs of clear amber wings, an orange pollen load on the hind leg', shapes:[
      pth('chocolate', 'base', [...legs, ...ant]),
      ...blob('honey', abd, [64, 55], { tilt:T, ld:4.5, dd:4, ed:1.5, bt:'dark', lt:'base', dm:'wood' }),
      dpth('chocolate', 'base', [strip(abd, 56, 60, 2), strip(abd, 66, 70, 2.2), strip(abd, 75.5, 79, 2.2), strip(abd, 84, 95, 2)]),
      ...blob('wood', thor, [37.5, 47], { tilt:T, ld:3.5, dd:3.5, ed:1.4 }),
      pth('orange', 'base', [circ(52.5, 67, 3.4, 10, 4.2, 20)]),
      ...blob('chocolate', head, [22, 50], { tilt:T, ld:2.6, dd:0, ed:0 }), det('dark', 'base', circ(24.5, 47.5, 3.2, 12, 5, 12)),
      pth('honey', 'light', [wH, wF], { o:.62 }), dpth('honey', 'dark', [bar([[43, 40], [60, 31], [76, 25.5]], .7), bar([[50, 39], [66, 33]], .7)], { o:.8 }),
      shineP(band([[58, 48], [70, 49.5]], 1.8), .75),
    ] });
  }

  // =====================================================================
  //  8. Földi poszméh (Bombus terrestris) – oldalnézet balra: KEREK, szőrös, fekete test; a tor ELEJÉN sötétsárga gallér,
  //     a potrohon sárga öv, a potroh vége FEHÉR; rövid, füstös szárny, zömök lábak (a beeco-méhecske nincs újrarajzolva: arc nincs)
  // =====================================================================
  {
    const T = -6, abd = wobC(62, 55, 21, 18.5, .035, 22, 0, 44), thor = wobC(38, 48, 14, 13.5, .045, 16, .5, 32), head = wobC(23, 55, 8, 8.5, .03, 10, 0, 20);
    const legs = [[[31, 60], [27, 69], [25, 75]], [[40, 61], [40, 70], [38, 76]], [[50, 64], [55, 71], [57, 77]]].map(p => bar(p, 3));
    const band_ = strip(abd, 48, 57, 3.4), tail = strip(abd, 72, 90, 3);
    const ant = [bar([[19, 48], [15.5, 40], [9.5, 37]], 1.8)];
    const wF = smC([[38, 37], [50, 29], [64, 25.5], [69, 28.5], [60, 35], [46, 40]], 4), wH = smC([[43, 40], [55, 35.5], [63, 35.5], [60, 39.5], [49, 42.5]], 4);
    fin('halo_poszmeh', { hu:'földi poszméh', en:'buff-tailed bumblebee', tilt:T, look:'round fuzzy buff-tailed bumblebee in side view facing left: black body, dark-yellow collar at the front of the thorax, a yellow band on the abdomen and a white tail tip, short smoky wings, stubby legs', shapes:[
      pth('dark', 'base', [...legs, ...ant]),
      ...blob('dark', abd, [62, 55], { tilt:T, ld:4.5, dd:4, ed:1.6 }),
      dpth('gold', 'base', [band_]), det('gold', 'dark', crescent(band_, [53, 58], 80, 40, 3.5)),
      pth('white', 'base', [tail], { d:true }), det('white', 'dark', crescent(tail, [76, 55], 40, 60, 2.6)),
      ...blob('dark', thor, [38, 48], { tilt:T, ld:3.5, dd:3, ed:0 }),
      dpth('gold', 'base', [strip(thor, 22, 32.5, 2.8)]),
      ...blob('dark', head, [23, 55], { ld:0, dd:0, ed:0 }), det('dark', 'dark', circ(22, 52.5, 2.4, 10, 3.6, 10)),
      pth('steel', 'light', [wH, wF], { o:.55 }),
      shineP(band([[50, 44], [57, 40.5]], 2), .6),
    ] });
  }

  // =====================================================================
  //  9. Vadméh – levélvágó méh (Megachile): repülő, zömök, SÖTÉT test világos szőrsávokkal a potrohon, nagy fej erős rágóval,
  //     a lábai közt szorosan fogott, szabályos, kerek levélkorong (a megkülönböztető részlet) – ebből béleli a fészkét
  // =====================================================================
  {
    const T = -10, head = circ(24, 40, 8.5, 16, 8.5), thor = wobC(39, 39, 10.5, 10, .03, 14, 0, 24);
    const abd = smC([[47, 34], [60, 32.5], [72, 35], [80, 41], [78, 49], [66, 52], [52, 51], [46.5, 45]], 4);
    const disc = circ(47, 63, 19, 22, 11.5, -8), veins = [bar([[30, 65.5], [64, 60.5]], 1), ...[[38, 64.5, -1], [46, 63.3, -1], [54, 62.2, -1], [42, 64, 1], [50, 62.8, 1], [58, 61.6, 1]].map(([x, y, s]) => bar([[x, y], [x + 4, y + s * 5.5]], .8))];
    const legs = [[[33, 46], [30, 53], [33, 58]], [[41, 48], [41, 55], [44, 58]], [[48, 48], [55, 54], [59, 57]]].map(p => bar(p, 2.2));
    const ant = [bar([[21, 33], [18.5, 25], [12, 21]], 1.8)], mand = [[16.5, 43], [12.5, 45.5], [15, 48], [18.5, 46.5]];
    const wF = smC([[40, 31], [46, 20], [55, 10], [63, 7], [65, 11], [58, 21], [48, 32]], 4), wH = smC([[45, 32], [54, 22], [61, 18], [63, 21.5], [56, 29], [49, 34]], 4);
    fin('halo_vadmeh', { hu:'vadméh (levélvágó méh)', en:'solitary leafcutter bee carrying a leaf piece', tilt:T, look:'dark solitary leafcutter bee flying left, stout black-grey body with pale hair bands on the abdomen, big head with strong jaws and short antennae, holding a neat round green leaf disc under its body with its legs, raised clear wings', shapes:[
      pth('glass', 'light', [wH, wF], { o:.6 }), dpth('glass', 'line', [bar([[43, 30], [53, 17], [62, 9]], .7)], { o:.5 }),
      ...blob('dark', abd, [63, 42], { tilt:T, ld:4, dd:3.5, ed:0, bt:'light', lt:'light', lm:'steel', dm:'dark' }),
      dpth('sage', 'light', [strip(abd, 55, 57.3, 1.5), strip(abd, 63, 65.3, 1.6), strip(abd, 70.5, 72.8, 1.6)]),
      ...blob('dark', thor, [39, 39], { tilt:T, ld:3, dd:3, ed:0, bt:'light', lm:'steel' }),
      ...blob('dark', head, [24, 40], { ld:2.6, dd:0, ed:0, lm:'steel', lt:'dark' }), det('dark', 'line', circ(26.5, 37.5, 3, 12, 4.8, 15)),
      pth('dark', 'base', [...ant, mand]),
      ...blob('grass', disc, [47, 63], { tilt:T, ld:4, dd:4, ed:1.5, dm:'leaf' }), dpth('leaf', 'dark', veins, { o:.7 }),
      pth('dark', 'base', legs),
      shineP(band([[56, 36.5], [66, 36]], 1.6), .55),
    ] });
  }

  // =====================================================================
  //  10. Nappali pávaszem (Aglais io) – 3/4-es nézet: rozsdavörös szárnyak, mind a négyen nagy „szemfolt” (az elülsőn sárga-kék-fekete,
  //      a hátulsón fekete, kék pöttyökkel, szürkésfehér gyűrűben), sötét szárnyszél; a távoli szárnypár rövidülve
  // =====================================================================
  {
    const T = 8, fw = [[52, 44], [56, 28], [67, 15], [82, 12], [90, 20], [86, 36], [71, 46], [55, 50]], hw = [[53, 52], [67, 50], [80, 57], [82, 70], [72, 82], [60, 80], [54, 67]];
    const far = p => p.map(([x, y]) => [50 - (x - 50) * .66, y + 2]);
    const FW = smC(fw), HW = smC(hw), fFW = smC(far(fw)), fHW = smC(far(hw));
    const body = tube(smO([[50, 37], [50.5, 54], [50, 76]]), t => 7 - 3 * t, { tilt:T });
    const eyeF = [78, 23], eyeH = [70, 68], eyeFf = far([eyeF])[0], eyeHf = far([eyeH])[0];
    fin('halo_pavaszem', { hu:'nappali pávaszem', en:'European peacock butterfly', tilt:T, look:'peacock butterfly in three-quarter view: rusty red wings each with a big eyespot (yellow, blue and black on the forewing, black with blue on the hindwing), dark wing edges, dark hairy body and clubbed antennae', shapes:[
      pth('berry', 'base', [fHW, fFW]), dpth('dark', 'base', [circ(eyeHf[0], eyeHf[1], 3.2, 10, 4.4), circ(eyeFf[0], eyeFf[1] + .5, 3, 10, 4)]),
      pth('chocolate', 'dark', [body.sil]), det('chocolate', 'base', body.light),
      pth('chocolate', 'dark', [circ(50, 31.5, 5.4, 14)]),
      ...blob('red', HW, [65, 64], { tilt:T, ld:4, dd:0, ed:0, bt:'dark', lt:'base' }),
      ...blob('red', FW, [70, 31], { tilt:T, ld:5, dd:0, ed:0, bt:'dark', lt:'base' }),
      dpth('chocolate', 'dark', [crescent(FW, [70, 31], -40, 80, 3.2), crescent(HW, [65, 64], 50, 75, 3.2)]),
      dpth('cream', 'base', [circ(eyeF[0], eyeF[1], 8, 14, 7, -25), circ(eyeH[0], eyeH[1], 7.8, 14, 7.2)]),
      dpth('honey', 'base', [circ(eyeF[0] - 1.6, eyeF[1] - 1.4, 4.4, 12, 3.8, -25)]),
      dpth('dark', 'base', [circ(eyeF[0] + 2.2, eyeF[1] + 2, 4, 12, 3.4, -25), circ(eyeH[0], eyeH[1], 6, 14, 5.6)]),
      dpth('blue', 'base', [circ(eyeF[0] + 1.6, eyeF[1] + 1.4, 2, 8), circ(eyeF[0] - 3.4, eyeF[1] + 3.2, 1.3, 8), circ(eyeH[0] - 2, eyeH[1] - 1.6, 2.2, 8), circ(eyeH[0] + 2.4, eyeH[1] + 1.8, 1.6, 8)]),
      pth('chocolate', 'dark', [bar([[48.5, 27], [42, 13]], 1.6), bar([[51.5, 27], [58, 13]], 1.6), circ(42, 13, 2.2, 8), circ(58, 13, 2.2, 8)]),
      shineP(band([[60, 26], [70, 18]], 2), .6),
    ] });
  }

  // =====================================================================
  //  11. Zengőlégy (Syrphidae) – felülnézet: LAPOS, széles potroh sárga-fekete harántsávokkal (darázsutánzó), NAGY vörösbarna
  //      összetett szemek, EGY pár víztiszta szárny oldalra kitartva (légy, nem méh), apró csápok
  // =====================================================================
  {
    const T = -12, abd = smC([[50, 43], [59, 45], [62, 55], [60.5, 68], [55, 78], [50, 81], [45, 78], [39.5, 68], [38, 55], [41, 45]], 4);
    const thor = circ(50, 37, 9.5, 18, 8.5), eyes = [circ(44, 25.5, 7.2, 16, 7.6, 20), circ(56, 25.5, 7.2, 16, 7.6, -20)], face = circ(50, 19.5, 3.2, 10, 2.4);
    const wL = smC([[45, 33], [34, 32], [18, 38], [9, 46], [12, 51], [24, 49], [40, 40]], 4), wR = wL.map(([x, y]) => [100 - x, y]);
    const legs = [[[43, 38], [36, 44], [34, 50]], [[57, 38], [64, 44], [66, 50]], [[44, 42], [40, 50], [39, 57]], [[56, 42], [60, 50], [61, 57]]].map(p => bar(p, 1.8));
    fin('halo_zengolegy', { hu:'zengőlégy', en:'hoverfly', tilt:T, look:'hoverfly seen from above: flat broad abdomen with yellow and black bands like a wasp, dark thorax, very big red-brown eyes, ONE pair of clear wings held straight out to the sides, tiny antennae', shapes:[
      pth('dark', 'base', legs),
      pth('glass', 'light', [wL, wR], { o:.6 }), dpth('glass', 'line', [bar([[42, 36], [26, 40], [12, 47]], .7), bar([[58, 36], [74, 40], [88, 47]], .7)], { o:.55 }),
      ...blob('dark', abd, [50, 60], { tilt:T, ld:0, dd:0, ed:0 }),
      dpth('honey', 'base', [stripH(abd, 48, 52.5, -2), stripH(abd, 58, 62.5, -2), stripH(abd, 68, 72, -2)]),
      ...shade('honey', abd, [50, 60], { tilt:T, ld:3, dd:3, ed:0, lm:'honey', dm:'dark', lt:'light' }),
      ...blob('chocolate', thor, [50, 36], { tilt:T, ld:2.6, dd:2.4, ed:0 }),
      pth('cream', 'dark', [face]),
      ...blob('tomato', eyes[0], [43.5, 22], { ld:2.2, dd:0, ed:0, bt:'dark', lt:'base' }), ...blob('tomato', eyes[1], [56.5, 22], { ld:0, dd:2, ed:0, bt:'dark' }),
      shineP(circ(41.5, 20, 1.4, 8, 2, -30), .8),
    ] });
  }

  // =====================================================================
  //  12. Levéltetvek (Aphididae) – kis csoport: 4 puha, körte alakú, zöld levéltetű egy zöld szárdarabon (a potroh végén két
  //      apró sötét „csővel”, hosszú csápok, sötét szempötty), a szár végén egy levélke
  // =====================================================================
  {
    const stem = tube(smO([[16, 86], [36, 62], [58, 42], [80, 30]]), 8), L = leafSet([[OVAL, 77, 31, -60, 24], [OVAL, 60, 42, -110, 16]]);
    const aph = [[33, 58, -48, 1.55], [55, 50, -35, 1.4], [42, 76, -52, 1.25], [67, 29, -30, 1.2]].map(([x, y, a, s]) => {
      const f = (u, v) => [x + (u * cos(a) - v * sin(a)) * s, y + (u * sin(a) + v * cos(a)) * s];
      const body = smC([[-9, 0], [-7, -5.2], [-1, -6.2], [5, -3.8], [8.5, 0], [5, 3.8], [-1, 6.2], [-7, 5.2]].map(([u, v]) => f(u, v)), 4);
      return { body, c:f(-1, 0), eye:f(6.4, -1.8), sip:[bar([f(-6, -3.5), f(-10.5, -4.5)], 1.6), bar([f(-6, 3.5), f(-10.5, 4.5)], 1.6)],
        ant:[bar([f(7.5, -1.5), f(11, -6), f(4, -12)], .9), bar([f(7.5, 1.5), f(12, 4.5), f(13, 11)], .9)], legs:[-4, 0, 4].map(u => bar([f(u, 5), f(u + 1.5, 9)], 1.1)) }; });
    fin('halo_leveltetu', { hu:'levéltetvek', en:'aphids on a stem', look:'small cluster of four soft pear-shaped light green aphids sitting on a green stem, each with two tiny dark tubes at the rear, long thin antennae and a dark eye, a small leaf at the stem tip', shapes:[
      ...stemS(stem), pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade),
      pth('leaf', 'dark', aph.flatMap(q => [...q.sip, ...q.ant, ...q.legs])),
      pth('grass', 'light', aph.map(q => q.body)),
      dpth('paper', 'light', aph.map(q => crescent(q.body, q.c, LA, 70, 2.2))),
      dpth('grass', 'base', aph.map(q => crescent(q.body, q.c, 45, 70, 2.6))),
      dpth('dark', 'base', aph.map(q => circ(q.eye[0], q.eye[1], 1.2, 8))),
      shineP(band([[18, 76], [30, 64]], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  13. Mezei pocok (Microtus arvalis) – oldalnézet balra: alacsony, megnyúlt, szürkésbarna rágcsáló a fűben (nem hörcsög), TOMPA, kerek orr, a bundából alig
  //      kilátszó kis fül, apró szem, RÖVID farok (nem egér: nincs hegyes orr, nagy fül, hosszú farok), világosabb has
  // =====================================================================
  {
    // alacsony, MEGNYÚLT test (nem gömbölyű hörcsög): a fej nyak nélkül folytatódik a törzsbe, tompa, kerek orr, a fül alig
    // bújik ki a bundából, kicsi szem, rövid, de jól látható farok; mögötte és előtte fűszálak (a mezőn lapul, fűpárnán)
    const body = smC([[6, 62], [8, 54], [14, 47], [23, 43], [33, 42], [46, 37], [63, 36], [78, 41], [87, 51], [88, 63], [82, 71], [64, 74], [40, 74], [22, 72], [11, 69]], 4), c = [50, 58];
    const belly = clip(smC([[14, 69], [36, 66], [60, 67], [84, 64], [84, 80], [14, 80]], 3), hullOf(body));
    const ear = circ(31, 40, 5.4, 12, 5, -10);
    const tail = taper(smO([[85, 64], [92, 64], [99, 67]], 2), 3.4, 2.2);
    const feet = [[22, 74, 10], [30, 75, -5], [66, 74.5, 8], [74, 73.5, -8]].map(([x, y, a]) => circ(x, y, 3, 8, 1.7, a));
    const blade = (x0, tip, bend, w, y0 = 66) => taper(smO([[x0, y0], lerp([x0, y0], tip, .5).map((v, i) => v + bend[i]), tip]), w, .5);
    // alacsony fűpárna a talpak alatt (fogazott teteje fűszálvég) – a pocok ebben lapul
    const tuft = smC([[4, 84], [8, 77], [13, 80], [18, 76], [25, 80], [34, 77], [42, 80], [50, 76], [58, 80], [67, 77], [75, 80], [83, 76], [90, 80], [95, 77], [97, 84], [50, 88]], 1);
    const back = [blade(22, [10, 28], [-3, 0], 6), blade(36, [44, 20], [3, -2], 6), blade(60, [54, 24], [-3, 0], 6), blade(74, [93, 32], [5, -2], 6)];
    const front = [blade(4, [1, 62], [-1, 0], 4.4, 82)];
    fin('halo_mezei_pocok', { hu:'mezei pocok', en:'common vole', look:'low elongated grey-brown common vole crouching among grass stems in side view facing left: blunt rounded snout with pink nose, small dark eye, a small round ear almost hidden in the fur, pale grey belly, tiny pink feet and a short but visible tail', shapes:[
      pth('leaf', 'base', back), dpth('grass', 'base', back.map(p => p.slice(0, Math.ceil(p.length / 2)).concat([p[p.length - 1]])), { o:.8 }),
      pth('skin', 'dark', feet),
      pth('soil', 'base', [ear]), det('skin', 'dark', circ(31.4, 39.6, 2.9, 8, 2.6)),
      ...blob('soil', body, c, { ld:5, dd:4.5, ed:1.8 }),
      det('white', 'dark', belly),
      dpth('soil', 'dark', [band(smO([[25.5, 44.8], [31, 43.6], [36.5, 45]], 2), 1.2, false)]),
      det('dark', 'base', circ(18.5, 53.5, 2.7, 10, 2.8)), det('paper', 'light', circ(17.6, 52.6, .9, 6)),
      det('skin', 'dark', circ(8.6, 62.8, 2.3, 10, 2)),
      dpth('soil', 'line', [bar([[13, 63.5], [4, 60.5]], .5), bar([[13, 65.5], [4, 67]], .5)], { o:.7 }),
      pth('soil', 'dark', [tail]), pth('grass', 'base', [tuft, ...front]), dpth('leaf', 'base', [clip(smC([[0, 80], [100, 80], [100, 90], [0, 90]], 1), hullOf(tuft))], { o:.8 }),
      shineP(band([[40, 42], [56, 38.5]], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  14. Szöcske (Caelifera – sáska-féle rövid csápú szöcske) – oldalnézet balra: zöld test, NAGY, erős, felhúzott ugrólábak
  //      halszálka-mintás combbal, RÖVID csáp, a hátán összecsukott szárnyak, nagy szem
  // =====================================================================
  {
    const body = smC([[14, 50], [18, 40], [28, 37], [44, 40], [62, 44], [84, 50], [86, 55], [66, 58], [44, 59], [28, 60], [17, 57]], 4);
    const wing = smC([[38, 40], [60, 42], [85, 47.5], [87, 51], [62, 50], [40, 48]], 3), pron = smC([[27, 37.5], [40, 38.5], [42, 51], [30, 53]], 2);
    const fem = taper(smO([[50, 56], [66, 47], [84, 35]]), 11.5, 5.5), tib = taper(smO([[84, 35], [80, 54], [74, 73]]), 3, 2.4);
    const legs = [[[26, 58], [22, 66], [18, 73]], [[36, 59], [36, 67], [33, 74]], [[74, 73], [67, 75]]].map(p => bar(p, 2.2));
    const chev = [0, 1, 2, 3].map(i => { const p = lerp([54, 54], [80, 38], .15 + i * .22); return bar([[p[0] - 3, p[1] - 1.6], [p[0] + .8, p[1] + 1.6], [p[0] + 3.6, p[1] - 2.4]], .9); });
    fin('halo_szocske', { hu:'szöcske', emoji:['🦗'], en:'grasshopper', look:'green grasshopper in side view facing left: long powerful folded hind legs with a thick herringbone-patterned thigh, short antennae, folded wings along the back, big eye', shapes:[
      pth('leaf', 'base', [...legs, tib]),
      ...blob('grass', body, [48, 49], { ld:3.5, dd:3.5, ed:1.4, dm:'leaf' }),
      pth('leaf', 'base', [wing]), det('grass', 'base', pron),
      ...blob('grass', fem, [66, 44], { ld:2.6, dd:2.4, ed:0, dm:'leaf' }), dpth('leaf', 'dark', chev),
      pth('leaf', 'dark', [bar([[19, 40], [15, 34], [11, 31]], 2.2)]),
      det('dark', 'base', circ(20.5, 44, 3, 12, 3.6, 10)), det('paper', 'light', circ(19.6, 42.8, .9, 6)),
      shineP(band([[23, 41], [30, 39]], 1.6), .65),
    ] });
  }

  // =====================================================================
  //  15. Hétpettyes katicabogár (Coccinella septempunctata) – 3/4-es felülnézet: domború piros szárnyfedők 7 fekete pöttyel
  //      (3 + 3 + 1 a varraton, elöl), fekete előtor fehér sarokfoltokkal, fekete fej fehér „pofafoltokkal”
  // =====================================================================
  {
    const T = -14, ely = circ(50, 56, 30, 26, 26), pron = smC([[32, 36], [38, 28], [50, 25.5], [62, 28], [68, 36], [50, 38.5]], 3), head = circ(50, 23, 9.5, 14, 6.5);
    const legs = [[[24, 44], [16, 42]], [[21, 58], [13, 60]], [[27, 72], [20, 78]], [[76, 44], [84, 42]], [[79, 58], [87, 60]], [[73, 72], [80, 78]]].map(p => bar(p, 2.4));
    const spots = [[50, 34, 5], [36, 44, 4.8], [31, 60, 5.4], [40, 73, 4.6], [64, 44, 4.8], [69, 60, 5.4], [60, 73, 4.6]].map(([x, y, r]) => circ(x, y, r, 12, r * .88));
    fin('halo_katica', { hu:'hétpettyes katicabogár', emoji:['🐞'], en:'seven-spot ladybird', tilt:T, look:'seven-spot ladybird in three-quarter top view: domed glossy red wing cases with seven black spots (three on each side and one on the seam at the front), black pronotum with white front corners, black head with white cheek patches, short black legs', shapes:[
      pth('dark', 'base', [...legs, bar([[45, 19], [40, 12]], 1.5), bar([[55, 19], [60, 12]], 1.5)]),
      ...blob('red', ely, [50, 56], { tilt:T, ld:6, dd:5.5, ed:2 }),
      det('red', 'line', [[49.6, 36], [50.4, 36], [50.4, 81.8], [49.6, 81.8]], { o:.7 }),
      dpth('dark', 'base', spots),
      pth('dark', 'base', [pron]), dpth('white', 'base', [circ(37.5, 32, 3.4, 10, 2.8), circ(62.5, 32, 3.4, 10, 2.8)]),
      pth('dark', 'base', [head]), dpth('white', 'base', [circ(43.5, 22, 1.8, 8, 1.4), circ(56.5, 22, 1.8, 8, 1.4)]),
      shineP(band([[30, 50], [34, 42], [42, 37]], 3), .75), shineP(circ(64, 42.5, 1.4, 8), .55),
    ] });
  }

  // =====================================================================
  //  16. Gyurgyalag (Merops apiaster) – ágon ülő madár, oldalnézet balra: gesztenyebarna fejtető és hát, aranyszínű vállfolt,
  //      sárga torok alatta fekete szegéllyel, fekete szemsáv, türkizkék has, zöldes szárny, HOSSZÚ, enyhén ívelt fekete csőr,
  //      hegyes, kinyúló középső faroktollak
  // =====================================================================
  {
    const body = smC([[20, 30], [28, 22], [38, 22], [46, 30], [58, 42], [66, 55], [64, 64], [54, 66], [42, 60], [33, 50], [27, 40]], 4);
    const back = clip(smC([[22, 25], [30, 18], [40, 18], [50, 28], [64, 44], [70, 56], [60, 56], [48, 40], [36, 30]], 3), hullOf(body));
    const wing = smC([[44, 36], [58, 42], [70, 58], [76, 72], [66, 68], [52, 58], [44, 46]], 4);
    const tail = smC([[62, 60], [74, 74], [90, 94], [85, 94], [68, 78], [60, 66]], 2);
    const throat = smC([[22, 36], [30, 37], [36, 44], [30, 47], [23, 42]], 3), beak = taper(smO([[20, 31], [10, 33], [1, 38]], 3), 4, 1.2, true);
    fin('halo_gyurgyalag', { hu:'gyurgyalag', en:'European bee-eater', look:'colourful European bee-eater perched on a twig facing left: chestnut crown and back, golden shoulder patch, yellow throat with a black border, black eye stripe, turquoise belly, greenish wings, long pointed central tail feathers and a long slightly curved black bill', shapes:[
      pth('wood', 'dark', [taper([[20, 67], [55, 66], [88, 70]], 4.2, 3.2)]),
      pth('leaf', 'dark', [tail]),
      ...blob('teal', body, [42, 44], { ld:3.5, dd:3.5, ed:0 }),
      det('orange', 'dark', back), det('gold', 'base', smC([[44, 32], [52, 36], [56, 42], [49, 41]], 2)),
      ...blob('leaf', wing, [60, 54], { ld:2.6, dd:2.6, ed:0 }), det('orange', 'dark', smC([[46, 37], [56, 42], [58, 47], [48, 44]], 2)),
      det('honey', 'base', throat), det('dark', 'base', band([[23, 43], [30, 47.5], [36, 45]], 1.4)),
      det('dark', 'base', taper([[19, 31], [30, 31.5], [38, 30]], 3.4, 2.4)),
      pth('dark', 'base', [beak]),
      det('red', 'base', circ(27, 30.8, 1.5, 8)),
      pth('dark', 'dark', [bar([[44, 63], [44, 67]], 1.6), bar([[49, 64], [50, 67.5]], 1.6)]),
      shineP(band([[28, 23], [36, 22]], 1.4), .7),
    ] });
  }

  // =====================================================================
  //  17. Egerészölyv (Buteo buteo) – kerítésoszlopon ülő ragadozó, szemből, a fej balra fordul: barna tollazat, a mellen világos,
  //      „U” alakú harántsáv, csíkozott has, két oldalt a sötétebb összecsukott szárny, sárga viaszhártyás, horgas csőr, sárga láb
  // =====================================================================
  {
    const post = [[39, 76], [61, 76], [61, 98], [39, 98]], top = circ(50, 76, 11, 14, 3.2);
    const body = smC([[50, 26], [62, 32], [68, 46], [67, 62], [60, 76], [50, 79], [40, 76], [33, 62], [32, 46], [38, 32]], 4);
    const wL = smC([[34, 34], [38, 44], [37, 62], [36, 80], [30, 70], [28, 50]], 3), wR = wL.map(([x, y]) => [100 - x, y]);
    const band_ = clip(smC([[30, 50], [40, 56], [50, 58], [60, 56], [70, 50], [70, 60], [60, 66], [50, 68], [40, 66], [30, 60]], 3), hullOf(body));
    const streak = [[44, 46], [50, 44], [56, 46], [42, 70], [50, 72], [57, 70]].map(([x, y]) => circ(x, y, 1.3, 8, 2.4));
    const head = circ(49, 22, 12.5, 16, 11.5), cere = smC([[36, 18], [41, 17.5], [41, 25], [36, 25.5]], 1), hook = smC([[36, 18], [30, 19], [26.5, 24], [27, 30], [30, 27], [36, 25.5]], 2);
    fin('halo_egereszolyv', { hu:'egerészölyv', en:'common buzzard', look:'common buzzard perched on a wooden fence post, seen from the front with the head turned left: brown plumage, a pale U-shaped band across the chest, streaked belly, darker folded wings at the sides, a hooked dark beak with a yellow base, yellow feet', shapes:[
      face('wood', 'base', post), det('wood', 'dark', [[53, 78], [61, 76], [61, 98], [53, 98]]), face('wood', 'light', top),
      ...blob('wood', body, [50, 52], { ld:4, dd:0, ed:0 }),
      det('cream', 'base', band_), dpth('wood', 'dark', streak),
      pth('chocolate', 'light', [wL]), pth('chocolate', 'base', [wR]),
      dpth('honey', 'base', [42, 47, 53, 58].map(x => taper([[x, 75], [x - .5, 80]], 2.6, 2))),
      ...blob('wood', head, [49, 22], { ld:3, dd:3, ed:0 }),
      face('dark', 'light', hook), face('honey', 'base', cere),
      det('dark', 'base', circ(44.5, 19.5, 2, 10)), det('paper', 'light', circ(44, 19, .6, 6)),
      shineP(band([[42, 14.5], [48, 12]], 1.6), .6),
    ] });
  }

  // =====================================================================
  //  18. Földigiliszta (Lumbricus terrestris) – S alakban, egy kis földkupacon: rózsás-barna, gyűrűs (szelvényes) test, az eleje felé
  //      világosabb nyereg (clitellum), a vége a földbe bújik, néhány morzsa (szem és arc nincs – az igazi gilisztának nincs)
  // =====================================================================
  {
    const soil = smC([[12, 84], [22, 76], [44, 74], [70, 76], [88, 80], [92, 88], [70, 92], [30, 92], [14, 90]], 4);
    const S = smO([[18, 80], [24, 66], [38, 60], [54, 68], [68, 66], [80, 52], [84, 38]], 6), n = S.length, w = t => 8.5 - 2 * abs(t - .6);
    const body = tube(S, w), nrm = i => { const a = S[max(0, i - 1)], b = S[min(n - 1, i + 1)], l = hypot(b[0] - a[0], b[1] - a[1]); return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
    const across = (i, k = .44) => { const [nx, ny] = nrm(i), h = w(i / (n - 1)) * k; return [[S[i][0] + nx * h, S[i][1] + ny * h], [S[i][0] - nx * h, S[i][1] - ny * h]]; };
    const rings = [3, 6, 9, 12, 15, 18, 21, 24, 31, 34].map(i => band(across(i), 1)), sad = [...across(26, .5), ...across(29, .5).reverse()];
    const crumbs = [[30, 70, 2.6], [64, 72, 2.2], [76, 74, 1.8], [20, 74, 1.6]].map(([x, y, r]) => circ(x, y, r, 8, r * .75));
    fin('halo_giliszta', { hu:'földigiliszta', en:'earthworm', look:'pink-brown earthworm in an S-curve on a small soil mound: ringed segmented body, a lighter saddle band (clitellum) near the front end, the tail end disappearing into the soil, soil crumbs, no face', shapes:[
      ...blob('soil', soil, [52, 84], { ld:3, dd:3, ed:0 }),
      pth('blossom', 'dark', [body.sil]), det('blossom', 'base', body.light), det('berry', 'light', body.dark), det('berry', 'base', body.edge, { o:.5 }),
      dpth('berry', 'light', rings, { o:.9 }),
      det('skin', 'base', [sad[0], sad[1], sad[3], sad[2]]),
      pth('soil', 'base', [smC([[12, 82], [16, 76], [24, 75], [27, 82]], 3), ...crumbs]),
      shineP(band(S.slice(8, 16).map(([x, y], j) => { const [ax, ay] = nrm(8 + j); return [x + ax * 2.4, y + ay * 2.4]; }), 1.6), .7),
    ] });
  }

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
  // függőlegesen konvex sokszögek uniójának körvonala (forgástest sziluettje)
  function envelope(polys, step = .5){
    const xs = polys.flat().map(p => p[0]), x0 = min(...xs), x1 = max(...xs), N = max(8, Math.ceil((x1 - x0) / step)), top = [], bot = [];
    for(let i = 0; i <= N; i++){
      const x = x0 + (x1 - x0) * min(max(i / N, .0005), .9995); let lo = Infinity, hi = -Infinity;
      for(const poly of polys) for(let j = 0; j < poly.length; j++){ const a = poly[j], b = poly[(j + 1) % poly.length];
        if(a[0] !== b[0] && (a[0] - x) * (b[0] - x) <= 0){ const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); lo = min(lo, y); hi = max(hi, y); } }
      if(lo < Infinity){ top.push([x, lo]); bot.push([x, hi]); }
    }
    return simplify([...top, ...bot.reverse()], .2);
  }
  // forgástest: prof = [[r, y], …] alulról; xf: a pont eltolása/forgatása vetítés előtt. Szög: 0 = elöl, −90 = bal szél, +90 = jobb szél
  function lathe(P, prof, xf = p => p){
    const at = (r, y, a) => P(xf([r * sin(a), y, r * cos(a)]));
    const rAt = y => { for(let i = 1; i < prof.length; i++) if(y <= prof[i][1] || i === prof.length - 1){ const [ra, ya] = prof[i - 1], [rb, yb] = prof[i]; return yb === ya ? rb : ra + (rb - ra) * (y - ya) / (yb - ya); } return prof[0][0]; };
    const ring = (r, y, a0 = 0, a1 = 360, n = 20) => Array.from({ length:n + 1 }, (_, i) => at(r, y, a0 + (a1 - a0) * i / n));
    const full = (r, y, n = 16) => ring(r, y, 0, 360, n).slice(0, n);
    const rings = prof.map(([r, y]) => full(r, y, 24));
    const sil = envelope(rings.slice(1).map((rg, i) => hullOf([...rings[i], ...rg])));
    const strip = (a0, a1, y0 = prof[0][1], y1 = prof[prof.length - 1][1], n = 6) => {
      const ys = [y0, ...prof.map(p => p[1]).filter(y => y > y0 && y < y1), y1];
      return [...ring(rAt(y0), y0, a0, a1, n), ...ys.slice(1, -1).map(y => at(rAt(y), y, a1)), ...ring(rAt(y1), y1, a1, a0, n), ...ys.slice(1, -1).reverse().map(y => at(rAt(y), y, a0))];
    };
    return { at, rAt, ring, full, sil, strip };
  }
  // vetített kör egy vízszintes síkon (y = magasság) · bilineáris térkép egy vetített négyszögre (q = [s0t0, s1t0, s1t1, s0t1])
  const disc = (P, cx, y, cz, rx, rz = rx, n = 16) => circ(0, 0, 1, n).map(([a, b]) => P([cx + rx * a, y, cz + rz * b]));
  const quad = q => ([s, t]) => lerp(lerp(q[0], q[1], s), lerp(q[3], q[2], s), t);
  const qrect = (q, s0, s1, t0, t1) => [[s0, t0], [s1, t0], [s1, t1], [s0, t1]].map(quad(q));

  // =====================================================================
  //  19. Vegyszeres permetezés – egyszerű kézi nyomáspermetező (~5 l, dm-ben vetítve): krémszínű tartály, pumpa-szár T-fogantyúval,
  //      tömlő, fém szórócső fúvókával, finom permetköd. Címke, jel, szöveg, koponya nincs – semleges tárgy.
  // =====================================================================
  {
    const tankP = [[.95, 0], [1, .1], [1, 2.1], [.86, 2.45], [.46, 2.6]], pumpP = [[.44, 2.6], [.44, 2.92], [.32, 3.04]];
    const W0 = [1.35, 1.35, .35], W1 = [3.3, 3.55, .35], N1 = [3.55, 3.8, .35];
    const P = cam({ az:24, el:20, F:40, fit:[...corners(-1, 1, 0, 3.9, -1, 1), W1, [4.7, 4.9, .35], [4.9, 4.5, .35]] }), k = P.k;
    const tank = lathe(P, tankP), pump = lathe(P, pumpP);
    const [a, b, n1] = [W0, W1, N1].map(P), hose = smO([P([.7, .35, .75]), P([1.45, .25, 1]), P([1.75, .8, .7]), a], 4);
    const top = P([0, 3.85, 0]), tl = P([-.62, 3.85, 0]), tr = P([.62, 3.85, 0]), rodB = P([0, 3.04, 0]);
    // permetköd: a fúvókától szétterülő, puha felhő (körök uniója) apró cseppekkel
    const MC = [[3.72, 3.95, .14], [3.95, 4.15, .22], [4.2, 4.45, .3], [4.45, 4.25, .26], [4.3, 4.8, .26], [4.62, 4.62, .24]].map(([x, y, r]) => { const q = P([x, y, .35]); return [q[0], q[1], r * k]; });
    const mc = P([4.2, 4.45, .35]), mist = union(MC, mc);
    const drops = [[4.1, 4.4, .06], [4.45, 4.7, .05], [4.55, 4.3, .06], [4.25, 4.85, .045], [4.75, 4.6, .045], [3.95, 4.08, .045], [4.35, 4.1, .045]].map(([x, y, r]) => { const q = P([x, y, .35]); return circ(q[0], q[1], r * k, 8); });
    fin('halo_h_vegyszer', { hu:'vegyszeres permetezés', en:'hand pressure sprayer spraying', look:'plain cream hand pressure garden sprayer with a teal pump top and a T-handle, a dark hose to a metal spray wand with a nozzle and a fine blue spray mist, no label or symbol', shapes:[
      pth('sky', 'light', [mist], { o:.7 }), dpth('sky', 'base', drops, { o:.9 }),
      pth('dark', 'base', [band(hose, .13 * k), band([tl, tr], .16 * k), band([rodB, top], .1 * k)]),
      pth('steel', 'base', [band([a, b], .09 * k)]), pth('dark', 'base', [band([b, n1], .14 * k)]),
      pth('cream', 'base', [tank.sil]), det('paper', 'light', tank.strip(-78, -38, .1, 2.1)), det('cream', 'dark', tank.strip(34, 90, 0, 2.45)), det('cream', 'line', tank.strip(70, 90, 0, 2.45), { o:.3 }),
      face('cream', 'light', tank.full(.46, 2.6, 16)),
      pth('teal', 'base', [pump.sil]), det('teal', 'dark', pump.strip(30, 90)), face('teal', 'light', pump.full(.32, 3.04, 12)),
      det('cream', 'dark', tank.strip(-100, 100, .55, .68), { o:.8 }),
      shineP(tank.strip(-66, -56, .4, 1.9), .8),
    ] });
  }

  // =====================================================================
  //  20. Túl gyakori kaszálás – tolós rotációs fűnyíró 3/4-es nézetben (narancs ház, motor-tető, fekete kerekek, tolókar) a tövig
  //      nyírt, csíkos gyepen, oldalt kirepülő levágott fűdarabkák. (dm-ben vetítve)
  // =====================================================================
  {
    const P = cam({ az:34, el:26, F:60, fit:[...corners(-4.6, 4.6, 0, .1, -4.2, 4.2), [-1.9, 6.6, -6.6], [2.1, 6.6, -6.6], [5.6, 1.6, 1.4]] }), k = P.k;
    const deck = box(P, -2.3, 2.3, .55, 1.35, -2.5, 2.3), eng = lathe(P, [[1.35, 0], [1.35, .55], [1.05, .95], [.4, 1.05]], ([x, y, z]) => [x, y + 1.35, z - .2]);
    const lawn = disc(P, 0, 0, 0, 4.6, 4.2, 20), stripe = qrect([P([-4.6, 0, -4.2]), P([4.6, 0, -4.2]), P([4.6, 0, 4.2]), P([-4.6, 0, 4.2])], .38, .62, 0, 1);
    const wheel = (x, z, r = .72) => circ(0, 0, 1, 14).map(([a, b]) => P([x, .72 + r * b, z + r * a]));
    const hL = [P([-1.9, 1.35, -2.4]), P([-2.05, 6.4, -6.4])], hR = [P([1.9, 1.35, -2.4]), P([2.05, 6.4, -6.4])], grip = [P([-2.1, 6.5, -6.5]), P([2.1, 6.5, -6.5])];
    const bits = [[4.6, 1.2, 1.6, 30], [5.2, .8, .6, -20], [4.2, 1.8, .2, 60], [5.5, 1.5, 2.3, 10], [3.8, .4, 3.4, -40]].map(([x, y, z, a]) => { const q = P([x, y, z]); return circ(q[0], q[1], .34 * k, 6, .1 * k, a); });
    const lawnC = P([0, 0, 0]);
    fin('halo_h_kaszalas', { hu:'túl gyakori kaszálás', en:'lawn mower on short-cut grass', tilt:-4, look:'orange push rotary lawn mower in three-quarter view with a dark engine cover, black wheels and a push handle, on a patch of very short striped lawn, with little cut grass clippings flying out of the side', shapes:[
      pth('grass', 'light', [lawn]), det('grass', 'base', clip(stripe, hullOf(lawn))), ...shade('grass', lawn, lawnC, { ld:0, dd:3, ed:0 }),
      pth('dark', 'base', [band([...hL], .22 * k), band([...hR], .22 * k)]), pth('dark', 'base', [band(grip, .3 * k)]),
      pth('dark', 'base', [wheel(-2.35, 1.5), wheel(-2.35, -1.7)]),
      face('orange', 'light', deck.top), face('orange', 'base', deck.front), face('orange', 'dark', deck.right),
      pth('dark', 'base', [wheel(2.35, 1.5), wheel(2.35, -1.7)]), dpth('steel', 'base', [P([2.4, .72, 1.5]), P([2.4, .72, -1.7])].map(q => circ(q[0], q[1], .22 * k, 8))),
      pth('dark', 'light', [eng.sil]), det('dark', 'base', eng.strip(30, 100)), face('steel', 'dark', eng.full(.4, 2.4, 12)),
      pth('grass', 'base', bits),
      shineP(qrect(deck.front, .08, .5, .3, .5), .6),
    ] });
  }

  // =====================================================================
  //  21. Beburkolás, betonozás – szürke betonlap-burkolat 3/4-es nézetben (2 × 3 lap, fugákkal, vastagsága látszik elöl és oldalt),
  //      egy hajszálrepedés, rajta kis útjelző bója fehér csíkkal. (dm-ben vetítve)
  // =====================================================================
  {
    const P = cam({ az:30, el:36, F:70, fit:[...corners(-3.6, 3.6, -.7, 0, -3.6, 3.6), [.9, 4, .9]] }), k = P.k;
    const B = box(P, -3.6, 3.6, -.7, 0, -3.6, 3.6), top = quad(B.top), jx = [1 / 3, 2 / 3], joints = [...jx.map(s => band([top([s, 0]), top([s, 1])], .12 * k, false)), ...jx.map(t => band([top([0, t]), top([1, t])], .12 * k, false))];
    const cone = lathe(P, [[1.25, .14], [1.2, .24], [.78, .36], [.2, 3.6], [.08, 3.72]], ([x, y, z]) => [x + .9, y, z + .9]), plate = box(P, -.45, 2.25, 0, .16, -.45, 2.25);
    const crack = band([top([.08, .62]), top([.15, .7]), top([.14, .8]), top([.22, .9])], .07 * k, false);
    fin('halo_h_beton', { hu:'beburkolás (beton)', en:'grey concrete paving slabs with a traffic cone', tilt:-4, look:'grey concrete paving slab area in three-quarter view, six slabs with joints and visible thickness, a hairline crack, and a small orange traffic cone with a white band standing on it', shapes:[
      face('steel', 'base', B.front), face('steel', 'dark', B.right), face('steel', 'light', B.top),
      det('steel', 'base', qrect(B.top, 2 / 3, 1, 2 / 3, 1)), det('steel', 'base', qrect(B.top, 0, 1 / 3, 1 / 3, 2 / 3)),
      dpth('steel', 'dark', joints), dpth('steel', 'line', [crack], { o:.6 }),
      det('steel', 'line', qrect(B.front, 0, 1, .82, 1), { o:.35 }),
      face('dark', 'base', plate.top), face('dark', 'dark', plate.front), face('dark', 'dark', plate.right),
      pth('orange', 'base', [cone.sil]), det('orange', 'dark', cone.strip(30, 90, .36, 3.6)), det('white', 'base', cone.strip(-90, 90, 1.5, 2.2, 8)), det('orange', 'light', cone.strip(-80, -45, .36, 1.4)),
      shineP(qrect(B.top, .05, .3, .08, .16), .6),
    ] });
  }

  // aranyvessző-buga: rövid csúcs + n váltakozva ívesen kihajló, a végén lekonyuló, elvékonyodó ág (a felső oldalukon ülnek az apró
  // sárga fészkek). branches: az ágak (sziluett) · lines: sötét ág-gerinc · lit: világos csík az ágak tetején.
  // rot: elforgatás a buga töve körül (a kihúzott, fekvő szárhoz)
  function goldPlume(cx, top, h, w, n = 6, rot = 0){
    const base = [cx, top + h], R = p => rot ? [base[0] + (p[0] - base[0]) * cos(rot) - (p[1] - base[1]) * sin(rot), base[1] + (p[0] - base[0]) * sin(rot) + (p[1] - base[1]) * cos(rot)] : p;
    const branches = [taper([R([cx, top + h * .25]), R([cx, top])], 5, 3)], lines = [], lit = [];
    for(let i = 0; i < n; i++){ const y = top + h * (.12 + i * .9 / n), s = i % 2 ? 1 : -1, reach = w * (.36 + i * .64 / n), wd = 5.2 - i * .2;
      const br = smO([[cx, y], [cx + s * reach * .55, y - 2.8], [cx + s * reach, y + 2]], 2).map(R);
      branches.push(taper(br, wd, 1.2, false)); lines.push(band(br.slice(1, -1), .7, false));
      lit.push(band(br.slice(0, -1).map(([x, y]) => [x - .6, y - wd * .22]), 1.3, false)); }
    return { branches, lines, lit };
  }

  // =====================================================================
  //  22. Idegenhonos inváziós növény – kanadai / magas aranyvessző (Solidago): magas, egyenes szárak keskeny, lándzsás levelekkel,
  //      a csúcsukon sűrű, ívesen kihajló, élénksárga bugák (egyoldalú ágakon apró fészkek) – NEM napraforgó: nincs korong
  // =====================================================================
  {
    const G1 = goldPlume(50, 6, 32, 22, 6), G2 = goldPlume(28, 26, 22, 14, 4), G3 = goldPlume(73, 22, 24, 15, 4), GG = [G1, G2, G3];
    const stems = [tube(smO([[50, 97], [50, 60], [50, 12]]), 3), tube(smO([[46, 97], [34, 64], [28, 30]]), 2.4), tube(smO([[53, 97], [66, 64], [73, 26]]), 2.4)];
    const L = leafSet([[LANCE, 50, 78, 205, 20], [LANCE, 50, 64, -25, 19], [LANCE, 50, 50, 210, 15], [LANCE, 39, 74, 195, 14], [LANCE, 34, 56, 200, 12], [LANCE, 62, 72, -15, 14], [LANCE, 67, 54, -18, 12]]);

    fin('halo_h_idegenhonos', { hu:'aranyvessző (idegenhonos)', en:'invasive goldenrod', look:'tall invasive goldenrod: straight stems with narrow lance-shaped leaves, topped with dense arching plume-like panicles of tiny bright yellow flower heads on one-sided curved branches', shapes:[
      pth('leaf', 'base', stems.map(s => s.sil)), dpth('leaf', 'light', stems.map(s => s.light)), dpth('leaf', 'dark', stems.map(s => s.dark)),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep), dpth('leaf', 'line', L.rib, { o:.3 }),
      pth('honey', 'base', GG.flatMap(g => g.branches)), dpth('honey', 'light', GG.flatMap(g => g.lit)), dpth('honey', 'dark', GG.flatMap(g => g.lines)),
      shineP(band([[45, 14], [47, 9]], 1.4), .7),
    ] });
  }

  // réti „sziget” (lekerekített földkupac füves tetővel) – a helyreállító matricák alapja: tető, föld-oldal, sötét alj
  const island = (cx, cy, rx, ry, th) => { const topS = circ(cx, cy, rx, 24, ry), side = [...circ(cx, cy, rx, 24, ry).filter(([, y]) => y >= cy - .01).sort((a, b) => b[0] - a[0]),
    ...circ(cx, cy + th, rx * .94, 24, ry * .9).filter(([, y]) => y >= cy + th - .01).sort((a, b) => a[0] - b[0])]; return { topS, side }; };
  const flower = (x, y, r, m) => circ(x, y, r, 10, r * .8);

  // =====================================================================
  //  23. Kaszálatlan virágsáv – kerek réti sziget magasra nőtt fűvel és vegyes vadvirágokkal (fehér, lila, piros, sárga fejek)
  // =====================================================================
  {
    const I = island(50, 70, 40, 13, 12), base = [50, 74];
    const blade = (x, tip, w) => taper(smO([[x, 72], [(x + tip[0]) / 2 + (tip[0] > x ? -2 : 2), (72 + tip[1]) / 2], tip]), w, .5);
    const lit = [blade(30, [18, 34], 4.5), blade(44, [40, 18], 4.5), blade(58, [66, 22], 4.5), blade(70, [84, 38], 4)], shd = [blade(36, [26, 26], 4), blade(52, [54, 14], 4.2), blade(64, [76, 28], 4), blade(24, [14, 52], 3.8)];
    const st = [[32, 36, 28], [46, 28, 20], [58, 44, 26], [70, 40, 32], [40, 52, 42], [62, 52, 48], [24, 48, 44], [78, 50, 46]];
    const stems = st.map(([x, tx, ty]) => band(smO([[x, 72], [(x + tx) / 2, (72 + ty) / 2 + 3], [tx, ty]], 2), 1.3, false));
    const F = { white:[[28, 28], [66, 48]], purple:[[46, 20], [22, 44]], red:[[70, 32], [40, 42]], honey:[[62, 48], [78, 46]] };
    const heads = m => F[m].map(([x, y]) => flower(x, y, m === 'purple' ? 4.2 : 4.6));
    fin('halo_v_viragsav', { hu:'kaszálatlan virágsáv', en:'unmown wildflower meadow patch', look:'round meadow island with tall unmown grass and mixed wildflowers on thin stems: white daisies, purple, red poppies and yellow flowers', shapes:[
      face('soil', 'base', I.side), det('soil', 'dark', I.side.slice(Math.floor(I.side.length / 2) - 4)),
      ...blob('grass', I.topS, [50, 70], { ld:3, dd:3, ed:0 }),
      pth('leaf', 'base', [...shd, ...stems]), pth('grass', 'base', lit), dpth('grass', 'light', lit.map(p => p.slice(Math.floor(p.length / 2)).concat([p[0]]))),
      pth('white', 'base', heads('white')), dpth('honey', 'base', F.white.map(([x, y]) => circ(x, y, 1.7, 8))),
      pth('purple', 'base', heads('purple')), dpth('purple', 'light', F.purple.map(([x, y]) => circ(x - 1.2, y - 1.2, 1.6, 6))),
      pth('red', 'base', heads('red')), dpth('dark', 'base', F.red.map(([x, y]) => circ(x, y, 1.4, 6))),
      pth('honey', 'base', heads('honey')), dpth('honey', 'dark', F.honey.map(([x, y]) => circ(x + .8, y + 1, 1.5, 6))),
      shineP(band([[18, 66], [26, 62]], 1.6), .6),
    ] });
  }

  // =====================================================================
  //  24. Mozaikos (sávos) kaszálás – kis rétdarab 3/4-es nézetben: két szélső sáv rövidre nyírt (kaszanyom-csíkokkal),
  //      a középső sáv magasra hagyva, virágokkal – a rovarok mindig találnak menedéket és virágot
  // =====================================================================
  {
    // a sávok balról jobbra: rövid (s 0…⅓) · MAGAS, virágos (⅓…⅔) · rövid (⅔…1); a kaszanyom-csíkok a sávok mentén (előre-hátra) futnak
    const P = cam({ az:20, el:34, F:70, fit:[...corners(-4.2, 4.2, -1, 0, -3.8, 3.8), [0, 3.4, 3.6], [0, 3.4, -3.6]] }), k = P.k;
    const B = box(P, -4.2, 4.2, -1, 0, -3.8, 3.8), T = quad(B.top), s1 = 1 / 3, s2 = 2 / 3;
    const mow = [.08, .18, .27, .73, .82, .92].map(s => band([T([s, .04]), T([s, .96])], .09 * k, false));
    const tall = [];   // hátulról előre, hogy az elsők takarják a hátsókat
    for(let i = 14; i >= 0; i--){ const s = s1 + .05 + (i % 3) * .115, t = .08 + Math.floor(i / 3) * .2, g = T([s, t]), h = (2.3 + (i * 7 % 5) * .22) * k, lean = (i % 2 ? 1 : -1) * .3 * k;
      tall.push(taper([g, [g[0] + lean, g[1] - h * .55], [g[0] + lean * 2, g[1] - h]], .5 * k, .1 * k)); }
    const fl = [[.4, .85, 'white'], [.6, .66, 'purple'], [.45, .5, 'red'], [.58, .32, 'honey'], [.42, .14, 'white'], [.6, .05, 'purple']].map(([s, t, m], i) => { const g = T([s, t]); return { m, c:[g[0], g[1] - (2.5 + (i % 2) * .5) * k] }; });
    const bits = [[.15, .2], [.1, .6], [.22, .85], [.8, .3], [.88, .7]].map(([s, t]) => { const g = T([s, t]); return circ(g[0], g[1], .25 * k, 6, .1 * k, 20); });
    fin('halo_v_mozaik_kaszalas', { hu:'mozaikos kaszálás', en:'strip mowing of a meadow', tilt:-4, look:'small meadow block in three-quarter view: the two outer strips mown short with mowing lines, the middle strip left tall with grass and wildflowers', shapes:[
      face('soil', 'base', B.front), face('soil', 'dark', B.right),
      face('grass', 'light', B.top), det('leaf', 'base', qrect(B.top, s1, s2, 0, 1)), dpth('grass', 'base', mow, { o:.8 }), dpth('grass', 'dark', bits),
      pth('leaf', 'base', tall), dpth('grass', 'base', tall.map(p => p.slice(0, Math.ceil(p.length / 2)))),
      ...['white', 'purple', 'red', 'honey'].map(m => pth(m, 'base', fl.filter(f => f.m === m).map(f => flower(f.c[0], f.c[1], .5 * k)))),
      dpth('honey', 'dark', fl.filter(f => f.m === 'white').map(f => circ(f.c[0], f.c[1], .2 * k, 6))),
      shineP(qrect(B.front, .05, .4, .25, .45), .45),
    ] });
  }

  // =====================================================================
  //  25. Vegyszermentes kert – egészséges, nagy zöld levél, rajta hétpettyes katica, a levél lemezén világos szív alakú folt
  //      (a „szeretett” kert jele) – áthúzott permetező nincs
  // =====================================================================
  {
    const LF = [[0, 0], [.1, .2], [.35, .34], [.62, .3], [.85, .16], [1, 0]], L = leafSet([[LF, 16, 84, -45, 92]]), rib = L.rib;
    const veins = [.28, .46, .64].flatMap(t => [1, -1].map(s => { const b = [16 + 92 * t * cos(-45), 84 + 92 * t * sin(-45)], a = -45 + s * 48;
      return band([b, [b[0] + 16 * cos(a) * (1 - t * .5), b[1] + 16 * sin(a) * (1 - t * .5)]], 1.1, false); }));
    const heart = (x, y, s) => smC([[x, y + 5 * s], [x - 5.5 * s, y - .5 * s], [x - 5 * s, y - 4.5 * s], [x - 1.8 * s, y - 5 * s], [x, y - 2.6 * s], [x + 1.8 * s, y - 5 * s], [x + 5 * s, y - 4.5 * s], [x + 5.5 * s, y - .5 * s]], 3);
    const lb = circ(56, 42, 13, 18, 11.5, -45), lbh = circ(45.5, 52, 6, 12, 4.4, -45);
    const spots = [[52, 38, 2.5], [60, 36, 2.3], [55, 47, 2.4], [63, 44, 2.1], [48.6, 45.4, 2.2]].map(([x, y, r]) => circ(x, y, r, 10));
    fin('halo_v_vegyszermentes', { hu:'vegyszermentes kert', en:'healthy leaf with a ladybird', look:'big healthy green leaf with veins and a pale green heart-shaped patch, a seven-spot ladybird sitting on it, no crossed-out sprayer', shapes:[
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep),
      pth('leaf', 'base', [band([[8, 92], [18, 82]], 3)]),
      dpth('leaf', 'dark', [...rib, ...veins], { o:.6 }),
      det('grass', 'light', heart(34, 58, 1.35)),
      pth('dark', 'base', [lbh, ...[[40, 44], [44, 56], [52, 58], [60, 30]].map(([x, y]) => bar([[x, y], [x + (x < 50 ? -3 : 3), y + (y < 50 ? -3 : 3)]], 1.8))]),
      ...blob('red', lb, [56, 42], { ld:3.5, dd:3.5, ed:1.4 }),
      det('red', 'line', [[47.2, 50.8], [47.8, 51.4], [64.8, 34.4], [64.2, 33.8]], { o:.7 }),
      dpth('dark', 'base', spots), dpth('white', 'base', [circ(43.6, 51.6, 1.1, 6), circ(46.4, 54.4, 1.1, 6)]),
      shineP(band([[50, 36], [54, 32]], 2), .75),
    ] });
  }

  // =====================================================================
  //  26. Rovarhotel – kis fa ház nyeregtetővel, karón: négy rekeszben üreges nádszálak, fúrt lyukas farönk-szelet, tobozok,
  //      rövid ágdarabok (cm-ben vetítve)
  // =====================================================================
  {
    const P = cam({ az:24, el:14, F:80, fit:[...corners(-2.2, 2.2, 0, 7.6, -1.2, 1.2)] }), k = P.k;
    const B = box(P, -2, 2, 2.4, 6.4, -1, 1), post = box(P, -.35, .35, 0, 2.5, -.35, .35), q = quad(B.front);
    const rf = [P([-2.35, 6.3, 1.3]), P([0, 7.6, 1.3]), P([2.35, 6.3, 1.3])], rb = [P([-2.35, 6.3, -1.3]), P([0, 7.6, -1.3]), P([2.35, 6.3, -1.3])];
    const roofL = [rf[0], rf[1], rb[1], rb[0]], roofR = [rf[1], rf[2], rb[2], rb[1]];
    const cell = (s0, s1, t0, t1) => qrect(B.front, s0, s1, t0, t1), holes = (s0, t0, n, m, r) => { const out = [];
      for(let i = 0; i < n; i++) for(let j = 0; j < m; j++){ const c = q([s0 + (i + .5) * (.44 / n), t0 + (j + .5) * (.43 / m)]); out.push(circ(c[0], c[1], r * k, 10)); } return out; };
    const reeds = holes(.05, .53, 3, 3, .27), logC = q([.73, .74]), log = circ(logC[0], logC[1], .82 * k, 16), drill = [[-.35, -.25], [.3, -.3], [0, .15], [-.32, .4], [.34, .35]].map(([dx, dy]) => circ(logC[0] + dx * k, logC[1] + dy * k, .11 * k, 8));
    const cones = [[.14, .3], [.36, .3], [.25, .11]].map(([s, t]) => { const c = q([s, t]); return circ(c[0], c[1], .36 * k, 10, .44 * k); });
    const scales = [[.14, .3], [.36, .3], [.25, .11]].flatMap(([s, t]) => { const c = q([s, t]); return [-.16, .1].map(dy => band([[c[0] - .22 * k, c[1] + dy * k - .06 * k], [c[0], c[1] + dy * k + .08 * k], [c[0] + .22 * k, c[1] + dy * k - .06 * k]], .07 * k, false)); });
    const sticks = holes(.51, .04, 3, 2, .3);
    fin('halo_v_rovarhotel', { hu:'rovarhotel', en:'insect hotel', tilt:-4, look:'small wooden insect hotel on a post in three-quarter view with a pitched roof: compartments filled with hollow reed stems, a drilled log slice, pine cones and short sticks with holes', shapes:[
      face('wood', 'base', post.front), face('wood', 'dark', post.right),
      face('wood', 'dark', B.right), face('wood', 'light', B.front),
      det('wood', 'dark', [...cell(.04, .48, .52, .96), ...[]]), det('wood', 'dark', cell(.52, .96, .04, .48)), det('wood', 'dark', cell(.04, .48, .04, .48)), det('wood', 'dark', cell(.52, .96, .52, .96)),
      dpth('cardboard', 'light', reeds), dpth('dark', 'base', reeds.map(p => { const c = p.reduce((s, v) => [s[0] + v[0] / p.length, s[1] + v[1] / p.length], [0, 0]); return circ(c[0], c[1], .14 * k, 8); })),
      det('wood', 'light', log), dpth('dark', 'base', drill),
      dpth('chocolate', 'light', cones), dpth('chocolate', 'dark', scales),
      dpth('cardboard', 'base', sticks), dpth('dark', 'base', sticks.map(p => { const c = p.reduce((s, v) => [s[0] + v[0] / p.length, s[1] + v[1] / p.length], [0, 0]); return circ(c[0], c[1], .12 * k, 8); })),
      face('tomato', 'dark', roofR), face('tomato', 'base', roofL),
      shineP([lerp(rf[0], rf[1], .15), lerp(rf[0], rf[1], .6), lerp(lerp(rf[0], rf[1], .6), lerp(rb[0], rb[1], .6), .12), lerp(lerp(rf[0], rf[1], .15), lerp(rb[0], rb[1], .15), .12)], .6),
    ] });
  }

  // =====================================================================
  //  27. Aranyvessző helyett őshonos virág – kis földkupacból felnövő fiatal margitvirág (két levél, fehér virág), mellette
  //      a földön fekszik a kihúzott aranyvessző-szár, látható gyökérrel és konyuló sárga bugával
  // =====================================================================
  {
    const soil = smC([[8, 84], [20, 74], [44, 70], [70, 72], [90, 80], [92, 90], [70, 94], [26, 94], [10, 91]], 4);
    const dig = smC([[42, 74], [50, 71], [58, 74], [54, 77], [46, 77]], 3);
    const st = tube(smO([[50, 74], [49, 56], [48, 36]]), 2.8), L = leafSet([[OVAL, 49.5, 64, 200, 18], [OVAL, 49, 56, -22, 16]]);
    const M = ([x, y]) => [48 + x, 28 + y * .7], pet = a => leafFull([[0, 0], [.15, .12], [.6, .14], [1, 0]], 4 * cos(a), 4 * sin(a), a, 15, 0, 1).map(M);
    const petals = Array.from({ length:12 }, (_, i) => pet(30 * i + 15));
    // a kihúzott aranyvessző: elöl fekszik, jobbra a gyökérzet (földdarabbal), balra a konyuló sárga buga, a száron fonnyadt levelek
    const gstem = taper(smO([[84, 88], [66, 86], [46, 88], [30, 87]], 3), 3, 2.2);
    const GP = goldPlume(30, 70, 18, 12, 5, -84);
    const roots = [[[84, 88], [91, 80]], [[84, 88], [95, 86]], [[84, 88], [92, 94]], [[88, 84], [95, 81]], [[88, 91], [96, 92]]].map(p => taper(p, 1.6, .5, false));
    const wl = leafSet([[LANCE, 68, 86, -150, 12, 0, 2], [LANCE, 54, 87, 150, 11, 0, 2]]);
    fin('halo_v_aranyvesszo_irtas', { hu:'őshonos virág az aranyvessző helyett', en:'native daisy seedling replacing pulled goldenrod', look:'a young native oxeye daisy growing up from a small soil mound with two leaves and a white flower, next to a pulled-out goldenrod stem lying on the ground with its roots showing and a drooping yellow plume', shapes:[
      ...blob('soil', soil, [50, 84], { ld:3, dd:3, ed:0 }), det('soil', 'dark', dig),
      pth('wood', 'light', [...roots, circ(87, 87, 3.4, 10, 3)]), pth('leaf', 'base', [gstem, ...wl.lit, ...wl.shade]), dpth('leaf', 'dark', wl.shade),
      pth('honey', 'base', GP.branches), dpth('honey', 'light', GP.lit), dpth('honey', 'dark', GP.lines),
      ...stemS(st), pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade),
      pth('paper', 'base', petals), dpth('white', 'dark', petals.filter((_, i) => i >= 1 && i <= 5).map(p => p.slice(0, Math.ceil(p.length / 2)).concat([p[0]]))),
      ...blob('honey', circ(48, 28, 5.5, 14, 3.9), [48, 28], { ld:1.6, dd:0, ed:0 }),
      shineP(band([[43.5, 27], [46, 25.5]], 1.2), .85),
    ] });
  }


})();
