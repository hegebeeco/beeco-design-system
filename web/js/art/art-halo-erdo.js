// ============================================================
//  Matricák — „Élő lánc”, 2. fejezet: a tölgyes-gyertyános erdő, B szinten (docs/rajzolas.md, docs/halo-kutatas-erdo.md)
//  1. rész (12 matrica): kocsánytalan tölgy, gyertyán, mogyoró, gyökérgombák (mikorrhiza), taplógombák, szarvasbogár,
//  hernyók a tölgylevélen, sárganyakú erdei egér, mókus, szajkó, vaddisznó, nagy fakopáncs. A többi: art-halo-erdo-b.js.
//  A játékban hatszögben, ~44–52 px-en jelennek meg (artIcon('halo_…')) → nagy, egyszerű sziluett, kevés, de jellegzetes részlet.
//  Megkülönböztetés: tölgy = karéjos levelű kerek korona + MAKKOK kupacskával · gyertyán = redős, fűrészes levél + lecsüngő,
//  háromkaréjos „termés-füzér” · mogyoró = kerek levél + fodros zöld kupacsú dió + sárga barka · erdei egér = NAGY fül, NAGY szem,
//  HOSSZÚ farok, sárga nyakszalag (a mezei pocok zömök, kis fülű, rövid farkú) · mókus = rozsdavörös, felkunkorodó bozontos farok,
//  fülpamacs · szajkó = rózsásbarna, kék-fekete csíkos szárnyfolt, makk a csőrében · fakopáncs = fekete-fehér, piros alsó farok, törzsön.
//  Az erdő ölyve és gilisztája a rét matricája (halo_egereszolyv, halo_giliszta) – itt nincs újrarajzolva.
//  A segédek az art-halo-b.js másolatai (+ erdei segédek), így a fájl önálló. Nincs szöveg, szám, márka, jelkép.
//  Render: node tools/art-render.js 2d web/js/art/art-halo-erdo.js ki.png --skip halo-erdo · Emoji-álnév nincs (a játék névvel kéri).
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
  //  1. Kocsánytalan tölgy (Quercus petraea) – kis, stilizált fa: kerek korona, a szélén kiálló, mélyen karéjos tölgylevelek,
  //     zömök törzs kiszélesedő tővel, a korona alján 3 makk kupacskával (a makk a fő ismertetőjel)
  // =====================================================================
  {
    const crown = wobC(50, 36, 38, 28, .07, 10, .4, 40);
    const trunk = tube(smO([[50, 97], [50, 80], [51, 60]]), t => 9 - 2.6 * t), flare = smC([[37, 98], [44, 91], [57, 91], [64, 98]], 2);
    const LV = [[36, 30, -125, 24], [60, 26, -60, 24], [70, 46, 10, 18]], leaves = LV.map(([x, y, d, l]) => leafOf(OAKL, x, y, d, l, 0, 1));
    const ribs = LV.map(([x, y, d, l]) => band([[x, y], [x + cos(d) * l * .85, y + sin(d) * l * .85]], .9, false));
    const A = [acorn(30, 56, 104, 19), acorn(42, 60, 80, 17), acorn(68, 57, 86, 19)];
    fin('halo_tolgy', { hu:'kocsánytalan tölgy', en:'sessile oak', look:'small stylised oak tree: round bumpy green crown with big lobed oak leaves on it, a sturdy brown trunk with a flared base and three brown acorns with scaly cups hanging under the crown', shapes:[
      pth('wood', 'base', [trunk.sil, flare]), det('wood', 'light', trunk.light), det('wood', 'dark', trunk.dark),
      ...blob('leaf', crown, [50, 36], { ld:5, dd:5, ed:0, lm:'grass', lt:'base' }),
      pth('grass', 'light', leaves), dpth('leaf', 'base', ribs, { o:.8 }),
      pth('cardboard', 'dark', A.map(a => a.stalk)),
      pth('wood', 'base', A.map(a => a.nut)), dpth('wood', 'dark', A.map(a => crescent(a.nut, a.c, 40, 70, 2.2))),
      pth('cardboard', 'light', A.map(a => a.cup)), dpth('cardboard', 'dark', A.flatMap(a => a.dots)),
      dpth('paper', 'light', A.map(a => a.shine), { o:.75 }),
    ] });
  }

  // =====================================================================
  //  2. Közönséges gyertyán (Carpinus betulus) – ág három tojásdad, kihegyezett, kétszeresen fűrészes levéllel, rajtuk sok
  //     párhuzamos oldalér („redős” lemez), és egy lecsüngő termés-füzér: halványzöld, HÁROMKARÉJOS kupacslevelek, tövükben kis makkocska
  // =====================================================================
  {
    // a fő jegy EGY nagy, lecsüngő termés-fürt: páronként kétoldalt álló, halványzöld, HÁROMKARÉJOS kupacslevelek (hosszú középső
    // „nyelv” + két rövid oldalkaréj, középen ér), a tövükben barnás makkocska; mellette két redős (sok párhuzamos oldalér), fűrészes levél
    const br = tube(smO([[12, 18], [34, 17], [62, 12], [96, 8]]), t => 3.4 - 1.4 * t);
    const LL = [[HORN, 22, 18, 116, 42, .03, 5], [HORN, 44, 15, 96, 40, .03, 5]], L = leafSet(LL);
    const wof = t => .3 * Math.pow(Math.sin(Math.PI * min(1, t * 1.15)), .8);
    const veins = LL.flatMap(([, x, y, d, l]) => [.2, .32, .44, .56, .68, .8].flatMap(t => { const b = [x + cos(d) * l * t, y + sin(d) * l * t], w = wof(t) * l * .95;
      return [1, -1].map(s => band([b, [b[0] + w * cos(d + s * 48) * 1.3, b[1] + w * sin(d + s * 48) * 1.3]], .8, false)); }));
    const stalk = smO([[76, 10], [78, 32], [80, 54], [81, 70]], 3), at = t => stalk[Math.round(t * (stalk.length - 1))];
    // kupacslevél: középső hosszú karéj, a tövéhez közel két rövid oldalkaréj (az egyik nagyobb)
    const bract = (p, a, s) => smC([[0, -.07], [.1, -.34], [.3, -.42], [.36, -.16], [.8, -.18], [1, -.02], [.84, .17], [.34, .15], [.28, .32], [.1, .26], [0, .07]]
      .map(([u, v]) => [p[0] + s * (u * cos(a) - v * sin(a)), p[1] + s * (u * sin(a) + v * cos(a))]), 2);
    const B = [[.14, 136, 35], [.24, 44, 35], [.6, 130, 35], [.7, 50, 35], [1, 90, 33]].map(([t, a, s]) => ({ p:at(t), a, s, poly:bract(at(t), a, s) }));
    const ribs = B.map(b => band([[b.p[0] + b.s * .08 * cos(b.a), b.p[1] + b.s * .08 * sin(b.a)], [b.p[0] + b.s * .82 * cos(b.a), b.p[1] + b.s * .82 * sin(b.a)]], .9, false));
    fin('halo_gyertyan', { hu:'közönséges gyertyán', en:'hornbeam', look:'hornbeam twig with one big hanging cluster of pale yellow-green three-lobed winged fruit bracts in pairs (a long middle lobe and two short side lobes, a small brown nutlet at the base of each) and two oval pointed, finely double-toothed leaves with many straight parallel side veins (pleated look)', shapes:[
      pth('wood', 'base', [br.sil]), det('wood', 'light', br.light),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', veins, { o:.55 }), dpth('leaf', 'line', L.rib, { o:.35 }),
      pth('leaf', 'dark', [band(stalk, 1.5, false)]),
      pth('sage', 'base', B.filter((_, i) => i % 2).map(b => b.poly)), pth('grass', 'light', B.filter((_, i) => !(i % 2)).map(b => b.poly)),
      dpth('leaf', 'base', ribs, { o:.6 }),
      pth('wood', 'base', B.map(b => circ(b.p[0] + 2.4 * cos(b.a), b.p[1] + 2.4 * sin(b.a), 2.6, 8, 1.9, b.a)), { d:true }),
      shineP(band([[14, 30], [18, 40]], 1.6), .6),
    ] });
  }

  // =====================================================================
  //  3. Közönséges mogyoró (Corylus avellana) – átlós ág két kerek, szív alakú tövű, fűrészes levéllel; három mogyoró fodros,
  //     csipkés szélű zöld kupacsban (a dió hegye kilátszik); az ágról lecsüngő sárga barka
  // =====================================================================
  {
    const br = tube(smO([[6, 72], [40, 52], [70, 34], [94, 22]]), t => 3.6 - 1.4 * t);
    const L = leafSet([[ROUND, 42, 51, -118, 36, .03, 5], [ROUND, 76, 31, 58, 28, .03, 4]]);
    const cat = tube(smO([[20, 63], [18, 76], [14, 90]]), 3.4), catB = [.2, .4, .6, .8].map(t => { const p = lerp([19.4, 66], [14.6, 89], t); return circ(p[0], p[1], 3.6, 10, 1.5, -8); });
    const nuts = [[48, 70, -12], [62, 66, 10], [55, 80, 0]].map(([x, y, a]) => {
      const R = (u, v) => [x + u * cos(a) - v * sin(a), y + u * sin(a) + v * cos(a)];
      const nut = smC([[-6.5, 0], [-5.5, -5], [0, -9.5], [5.5, -5], [6.5, 0], [4.5, 5.5], [-4.5, 5.5]].map(([u, v]) => R(u, v)), 3);
      const husk = smC([[-8.8, -3.5], [-5.6, 0], [-4.6, -4.2], [-2, 1.4], [0, -2], [2, 1.4], [4.6, -4.2], [5.6, 0], [8.8, -3.5], [7.8, 5], [0, 9.5], [-7.8, 5]].map(([u, v]) => R(u, v)), 2, .1);
      return { nut, husk, c:R(0, -3), stem:R(0, 8) };
    });
    const stems = nuts.map(n => bar(smO([[54, 48], [(54 + n.stem[0]) / 2, (48 + n.stem[1]) / 2 - 2], n.stem], 2), 1.8));
    fin('halo_mogyoro', { hu:'közönséges mogyoró', en:'hazel', look:'hazel twig with two round heart-based toothed leaves, a cluster of three brown hazelnuts sitting in frilly jagged green husks with their pointed tops showing, and a hanging yellow catkin', shapes:[
      pth('wood', 'base', [br.sil, ...stems]), det('wood', 'light', br.light),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep), dpth('leaf', 'line', L.rib, { o:.35 }),
      pth('honey', 'base', [cat.sil]), dpth('honey', 'dark', catB),
      pth('wood', 'base', nuts.map(n => n.nut)), dpth('wood', 'dark', nuts.map(n => crescent(n.nut, n.c, 40, 70, 2.4))),
      pth('grass', 'base', nuts.map(n => n.husk)), dpth('grass', 'dark', nuts.map(n => crescent(n.husk, [n.c[0], n.c[1] + 4], 50, 70, 2.4))),
      shineP(band([[45, 60], [47, 57]], 1.5), .8), shineP(band([[30, 38], [34, 30]], 1.6), .6),
    ] });
  }

  // =====================================================================
  //  4. Gyökérgombák (mikorrhiza) – talaj-metszet: a felszínen tinóru-szerű gomba (barna kalap, sárgás pórusréteg, vaskos,
  //     hasas, hálózatos tönk), jobbra egy fiatal fa; a föld alatt a fa gyökere, és a gombától hozzá futó finom FEHÉR gombafonalak
  // =====================================================================
  {
    const soil = smC([[6, 50], [50, 47], [94, 50], [93, 80], [82, 94], [18, 94], [7, 80]], 4);
    const turf = band(smO([[7, 49.5], [50, 46.5], [93, 49.5]], 3), 3.4, true);
    const stem = smC([[27, 50], [25.5, 41], [29, 31], [39, 31], [42.5, 41], [41, 50]], 3), cap = smC([[13, 29], [17, 17], [34, 9], [51, 17], [55, 29], [34, 32]], 3);
    const pores = smC([[15, 29], [34, 31.5], [53, 29], [49, 33], [34, 35], [19, 33]], 2);
    const net = [[30, 38], [36, 37], [33, 43], [38, 45], [30, 46]].map(([x, y]) => circ(x, y, 1.2, 6, .8, 30));
    const tr = tube(smO([[80, 50], [80, 34], [81, 20]]), t => 4.2 - 1.6 * t), crownT = wobC(81, 13, 13, 10, .07, 7, 0, 24);
    const roots = [tube(smO([[80, 50], [72, 62], [60, 72], [48, 78]]), t => 3.4 - 2.2 * t), tube(smO([[74, 58], [78, 72], [76, 86]]), t => 2.2 - 1.2 * t), tube(smO([[64, 69], [58, 84]]), 1.4)];
    const hy = [[[34, 51], [38, 60], [46, 70], [50, 77]], [[34, 51], [44, 58], [54, 66], [60, 71]], [[34, 51], [32, 64], [40, 78], [56, 84]], [[38, 60], [30, 72], [28, 84]],
      [[46, 70], [58, 80]], [[44, 58], [58, 60], [66, 66]], [[40, 78], [48, 88], [58, 86]]].map(p => bar(smO(p, 3), 1.05));
    fin('halo_mikorrhiza', { hu:'gyökérgombák (mikorrhiza)', en:'mycorrhizal fungi', look:'soil cross-section: a brown-capped bolete mushroom with a thick pale stem on the surface, a young tree beside it, and under the ground fine white fungal threads running from the mushroom to the tree roots', shapes:[
      ...blob('soil', soil, [50, 70], { ld:0, dd:4, ed:0 }), pth('grass', 'base', [turf]),
      pth('wood', 'base', [tr.sil, ...roots.map(r => r.sil)]), dpth('wood', 'dark', [tr.dark, ...roots.map(r => r.dark)]),
      ...blob('leaf', crownT, [81, 13], { ld:3, dd:2.6, ed:0, lm:'grass', lt:'base' }),
      dpth('white', 'base', hy),
      ...blob('cream', stem, [34, 40], { ld:0, dd:2.4, ed:0 }), dpth('cream', 'dark', net),
      face('honey', 'light', pores),
      ...blob('chocolate', cap, [34, 22], { ld:3.4, dd:3, ed:0, bt:'light', lt:'light', lm:'wood', dm:'chocolate' }),
      shineP(band([[22, 18], [30, 13]], 1.8), .7),
    ] });
  }

  // =====================================================================
  //  5. Taplógombák – korhadó, csonkán tört fatörzs (holtfa): bal oldalán lépcsőzetes, narancs-kénsárga „polcok”
  //     (sárga gévagomba), jobb oldalán egy barna, világos szegélyű taplókonzol; a tövében moha
  // =====================================================================
  {
    const trunk = smC([[34, 95], [34.5, 60], [34, 30], [39, 23], [43, 29], [49, 16], [55, 27], [61, 21], [66, 30], [65.5, 60], [66, 95]], 1);
    const inner = [[37, 31], [39.5, 27.5], [43, 32], [49, 21], [55, 31], [61, 25], [63.5, 32], [50, 35]];
    const cracks = [[[42, 44], [41, 60], [42.5, 74]], [[52, 40], [53, 56]], [[46, 70], [45.5, 88]], [[58, 66], [58.5, 84]]].map(p => bar(p, .8));
    // félkör alakú polc a törzs oldalán (dir = −1 balra, +1 jobbra), hullámos szélű
    const shelf = (x, y, rx, ry, dir, k = 5) => Array.from({ length:17 }, (_, i) => { const a = Math.PI * (.5 + i / 16), q = 1 + .06 * Math.sin(k * a);
      return [x + dir * abs(rx * q * Math.cos(a)), y + ry * q * Math.sin(a)]; });
    const S = [[35, 44, 20, 6.5], [35, 57, 17, 6], [36, 69, 13, 5]].map(([x, y, rx, ry]) => ({ top:shelf(x, y, rx, ry, -1), under:shelf(x, y + 3.2, rx * .97, ry, -1), inner:shelf(x, y - .8, rx * .68, ry * .66, -1) }));
    const Bk = { top:shelf(65, 50, 13, 5.5, 1, 4), under:shelf(65, 53.5, 12.4, 5.2, 1, 4), rim:shelf(65, 50, 13, 5.5, 1, 4) };
    const moss = wobC(50, 94, 24, 4.4, .12, 8, 0, 24);
    fin('halo_taplo', { hu:'taplógombák', en:'bracket fungi on dead wood', look:'broken-off rotting tree trunk (dead wood) with stacked orange and sulphur-yellow shelf fungi on its left side, a brown bracket fungus with a pale rim on its right side, and moss at its foot', shapes:[
      face('chocolate', 'light', trunk), det('chocolate', 'base', clip(trunk, [[56, 0], [80, 0], [80, 100], [56, 100]])), dpth('chocolate', 'dark', cracks, { o:.8 }),
      det('wood', 'light', inner),
      pth('honey', 'dark', S.map(s => s.under)), pth('honey', 'base', S.map(s => s.top)), dpth('orange', 'base', S.map(s => s.inner)),
      pth('chocolate', 'dark', [Bk.under]), pth('cream', 'dark', [Bk.rim]), det('chocolate', 'base', shelf(65, 49.6, 9, 4, 1, 4)),
      pth('grass', 'base', [moss]), det('leaf', 'base', clip(moss, [[50, 90], [80, 90], [80, 100], [50, 100]])),
      shineP(band([[37, 36], [37, 52]], 1.6), .55), shineP(band([[24, 42], [30, 40]], 1.4), .7),
    ] });
  }

  // =====================================================================
  //  6. Nagy szarvasbogár (Lucanus cervus), hím – felülnézet: sötét gesztenyebarna szárnyfedők, fekete, széles előtor és fej,
  //     NAGY, agancsszerű, vörösesbarna rágók (befelé ívelnek, középen egy-egy befelé álló foggal), hat hosszú fekete láb, könyökös csáp
  // =====================================================================
  {
    const T = -12, ely = smC([[32, 50], [50, 47], [68, 50], [70, 70], [62, 88], [50, 92], [38, 88], [30, 70]], 4);
    const pron = smC([[29, 38], [35, 31], [65, 31], [71, 38], [68, 47], [50, 49], [32, 47]], 3), head = smC([[27, 27], [32, 19.5], [68, 19.5], [73, 27], [66, 32], [34, 32]], 3);
    const mand = s => { const X = x => 50 + s * (x - 50);
      return [taper(smO([[X(37), 21], [X(29), 11], [X(29), 1], [X(37), -6]], 3), 5.2, 2.4), bar([[X(29.5), 7], [X(36), 5]], 1.9), bar([[X(35), -4], [X(39), -2.6]], 1.4)]; };
    const leg = s => [[[34, 40], [20, 36], [13, 27]], [[33, 57], [18, 58], [10, 66]], [[37, 74], [24, 84], [20, 95]]].map(p => bar(p.map(([x, y]) => [50 + s * (x - 50), y]), 2));
    const ant = s => bar([[34, 22], [24, 21], [21, 15]].map(([x, y]) => [50 + s * (x - 50), y]), 1.3);
    fin('halo_szarvasbogar', { hu:'nagy szarvasbogár', en:'stag beetle', tilt:T, look:'male stag beetle seen from above: dark chestnut-brown wing cases, broad black head and pronotum, huge reddish-brown antler-like jaws curving inwards with a tooth in the middle, six long black legs and short elbowed antennae', shapes:[
      pth('dark', 'base', [...leg(1), ...leg(-1), ant(1), ant(-1)]),
      ...blob('chocolate', ely, [50, 69], { tilt:T, ld:4.5, dd:4, ed:1.6, lm:'chocolate', lt:'light' }),
      det('chocolate', 'line', [[49.6, 49], [50.4, 49], [50.4, 91], [49.6, 91]], { o:.7 }),
      ...blob('dark', pron, [50, 40], { tilt:T, ld:2.4, dd:0, ed:0 }),
      pth('chocolate', 'light', [...mand(1), ...mand(-1)]), dpth('chocolate', 'base', [...mand(1), ...mand(-1)].slice(0, 0).concat([band(smO([[64, 15], [71, 4], [66, -4]], 2), 1.2)])),
      ...blob('dark', head, [50, 26], { tilt:T, ld:2, dd:0, ed:0 }),
      shineP(band([[36, 60], [40, 53], [45, 50.5]], 2.4), .7),
    ] });
  }

  // =====================================================================
  //  7. Tölgyön élő hernyók (pl. kis téliaraszoló) – nagy, karéjos tölgylevél, a szélén kerek rágásnyom és két lyuk,
  //     rajta egy „araszoló” zöld hernyó Ω alakban felpúposítva (elöl sötétebb fej, hátul a potrohlábak)
  // =====================================================================
  {
    // harapás: a levél körvonalának a kör belsejébe eső pontjait a kör peremére toljuk (kör alakú kivágás a levél széléből)
    const bite = (poly, c, r) => poly.map(p => { const dx = p[0] - c[0], dy = p[1] - c[1], d = hypot(dx, dy); return d < r ? [c[0] + dx / d * r, c[1] + dy / d * r] : p; });
    const x0 = 14, y0 = 88, D = -48, Ln = 96, side = s => halfLeaf(OAKL, x0, y0, D, Ln, s, 0, 1);
    const lit = bite([...side(-1), [x0, y0]], [36, 22], 9), shd = bite([...side(1), [x0, y0]], [36, 22], 9);
    const rib = band([[x0, y0], [x0 + cos(D) * Ln * .92, y0 + sin(D) * Ln * .92]], 1.6, false), stalk = band([[6, 96], [x0 + 1, y0 - 1]], 2.4, false);
    const veins = [.2, .36, .52, .68].flatMap(t => [1, -1].map(s => { const b = [x0 + cos(D) * Ln * t, y0 + sin(D) * Ln * t]; return band([b, [b[0] + 20 * cos(D + s * 55), b[1] + 20 * sin(D + s * 55)]], 1, false); }));
    const holes = [circ(58, 62, 3.4, 10, 2.6, 30), circ(64, 44, 2.4, 8, 2, -20)];
    const sp = smO([[34, 66], [36, 52], [45, 42], [55, 45], [59, 56], [62, 66]], 3), cat = tube(sp, 6.6, { cap:true });
    const segs = sp.filter((_, i) => i % 2 && i > 1 && i < sp.length - 2).map((p, j, a) => { const i = sp.indexOf(p), q = sp[i + 1], dx = q[0] - p[0], dy = q[1] - p[1], l = hypot(dx, dy);
      return band([[p[0] - dy / l * 3.2, p[1] + dx / l * 3.2], [p[0] + dy / l * 3.2, p[1] - dx / l * 3.2]], .7, false); });
    fin('halo_hernyok', { hu:'tölgyön élő hernyók', en:'caterpillars on oak', look:'big lobed oak leaf with a round bite taken out of its edge and two small holes, with a light green looper caterpillar arching its body into a loop on it, darker head at the front', shapes:[
      pth('leaf', 'dark', [stalk]),
      face('leaf', 'base', lit), face('leaf', 'dark', shd), dpth('leaf', 'line', [rib, ...veins], { o:.45 }),
      dpth('cream', 'base', holes), dpth('leaf', 'line', holes.map(h => crescent(h, [h.reduce((s, p) => s + p[0], 0) / h.length, h.reduce((s, p) => s + p[1], 0) / h.length], -135, 80, 1)), { o:.5 }),
      pth('grass', 'light', [cat.sil]), det('grass', 'base', cat.dark), det('honey', 'light', cat.light), dpth('grass', 'dark', segs),
      pth('grass', 'dark', [circ(34, 67, 3.4, 10, 3), circ(61.5, 66.5, 3, 10, 2.4)]), det('dark', 'base', circ(33, 67.4, 1, 6)),
      shineP(band([[22, 70], [30, 60]], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  8. Sárganyakú erdei egér (Apodemus flavicollis) – oldalnézet balra, a hátsó lábán ül és makkot tart: meleg barna hát,
  //     fehér has, a mellén SÁRGA nyakszalag, NAGY kerek fül, NAGY fekete szem, hegyes orr, HOSSZÚ vékony farok (a pocok zömök, kis fülű, rövid farkú)
  // =====================================================================
  {
    const body = smC([[40, 38], [54, 40], [66, 52], [72, 68], [70, 82], [60, 88], [44, 88], [36, 80], [33, 64], [34, 48]], 4);
    const belly = clip(smC([[26, 50], [44, 52], [48, 70], [46, 90], [26, 90]], 3), hullOf(body));
    const collar = clip(smC([[26, 44], [46, 44], [47, 55], [26, 55]], 1), hullOf(body));
    const head = smC([[9, 41], [16, 33], [28, 25], [41, 26], [49, 33], [48, 44], [38, 50], [24, 48], [13, 45]], 4);
    const ear = circ(42, 20, 8.4, 14, 10, -18), earIn = circ(42.4, 21, 5.4, 12, 7, -18);
    const tail = taper(smO([[68, 84], [80, 91], [91, 89], [96, 78], [93, 64]], 3), 2.6, 1.2);
    const foot = smC([[30, 89], [46, 86], [52, 89], [48, 91.5], [30, 91.5]], 1), A = acorn(22, 52, 78, 15);
    const arm = [bar([[36, 56], [30, 62], [25, 62]], 2.8), bar([[38, 60], [33, 67], [28, 67]], 2.8)];
    fin('halo_sarganyaku_eger', { hu:'sárganyakú erdei egér', en:'yellow-necked mouse', look:'yellow-necked mouse sitting up on its hind legs facing left and holding an acorn: warm brown back, white belly, a yellow collar band across the chest, big round ears, big black shiny eyes, pointed pink nose and a very long thin tail', shapes:[
      pth('skin', 'dark', [tail, foot]),
      ...blob('wood', body, [52, 66], { ld:4, dd:4, ed:0 }), det('white', 'base', belly), det('honey', 'base', collar),
      pth('wood', 'base', [ear]), det('skin', 'base', earIn),
      ...blob('wood', head, [30, 37], { ld:3, dd:2.6, ed:0 }),
      det('dark', 'base', circ(28.5, 35, 3.8, 12, 4)), det('paper', 'light', circ(27.3, 33.6, 1.2, 6)), det('skin', 'dark', circ(9.8, 42, 2.2, 8)),
      pth('cardboard', 'dark', [A.stalk]), pth('wood', 'base', [A.nut]), pth('cardboard', 'light', [A.cup]), dpth('cardboard', 'dark', A.dots),
      pth('skin', 'dark', arm),
      shineP(band([[42, 44], [52, 45]], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  9. Vörös mókus (Sciurus vulgaris) – oldalnézet balra, ül és mogyorót tart: rozsdavörös bunda, krém has, fülein PAMACS,
  //     hátul a testnél magasabbra felkunkorodó, bozontos farok
  // =====================================================================
  {
    const tailSp = smO([[62, 86], [82, 76], [90, 54], [86, 30], [74, 14], [60, 12], [56, 22]], 3);
    const tail = band(tailSp, t => 7 + 7 * Math.sin(Math.PI * min(1, t * 1.1)), true);
    const tailTuft = [[.3, 1], [.5, 1], [.7, 1]].map(([t]) => { const p = tailSp[Math.round(t * (tailSp.length - 1))]; return bar([[p[0] - 3, p[1]], [p[0] + 3, p[1] + 2]], .8); });
    const body = smC([[38, 40], [52, 42], [64, 56], [68, 74], [64, 86], [48, 90], [34, 84], [31, 66], [32, 50]], 4);
    const belly = clip(smC([[24, 48], [42, 50], [46, 70], [44, 92], [24, 92]], 3), hullOf(body));
    const head = smC([[12, 44], [16, 35], [26, 27], [38, 27], [46, 34], [46, 44], [38, 51], [24, 51], [15, 48]], 4);
    const ear = smC([[34, 30], [36, 18], [39, 11], [43, 18], [44, 30]], 2), tuftE = taper(smO([[39, 17], [38.5, 9], [37, 3], [40, 0]], 2), 4.2, 1);
    const nut = circ(23, 60, 6, 14, 5.6), nutCap = smC([[17.5, 58], [23, 55.5], [28.5, 58], [27, 62], [19, 62]], 2);
    const foot = smC([[30, 89], [48, 87], [54, 90], [50, 92.5], [30, 92.5]], 1), arm = [bar([[36, 56], [30, 60], [27, 60]], 3), bar([[37, 62], [31, 66], [27, 66]], 3)];
    fin('halo_mokus', { hu:'vörös mókus', en:'red squirrel', look:'red squirrel sitting up facing left holding a hazelnut: rusty red fur, cream belly, pointed ears with dark tufts, big dark eye, and a big bushy tail curling up behind it higher than its head', shapes:[
      ...blob('orange', tail, [76, 46], { ld:0, dd:5, ed:0, bt:'dark', dm:'ember' }),
      ...blob('orange', body, [50, 66], { ld:4, dd:4, ed:0, dm:'ember' }), det('cream', 'base', belly),
      pth('chocolate', 'light', [tuftE]), pth('orange', 'base', [ear]),
      ...blob('orange', head, [30, 39], { ld:3, dd:2.4, ed:0, dm:'ember' }), det('cream', 'base', smC([[16, 46], [26, 47], [30, 52], [18, 51]], 2)),
      det('dark', 'base', circ(29, 36, 3.4, 12, 3.6)), det('paper', 'light', circ(28, 34.8, 1.1, 6)), det('dark', 'base', circ(12.8, 44.6, 1.6, 8)),
      pth('wood', 'base', [nut]), det('wood', 'light', nutCap), pth('orange', 'dark', [foot, ...arm]),
      shineP(band([[42, 44], [50, 46]], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  10. Szajkó (Garrulus glandarius) – ágon ülő madár, oldalnézet balra, makkal a csőrében: rózsásbarna test, világos, sötéten
  //      csíkozott fejtető, fekete „bajusz”, a szárny tövén KÉK-FEKETE CSÍKOS folt, alatta fehér szárnyfolt, fekete evezők, fehér far, fekete farok
  // =====================================================================
  {
    const body = smC([[22, 30], [30, 22], [42, 22], [52, 30], [64, 42], [70, 56], [66, 66], [54, 68], [40, 62], [30, 52], [24, 40]], 4);
    const wing = smC([[44, 34], [58, 40], [72, 56], [80, 72], [70, 72], [56, 62], [44, 48]], 4);
    const patch = smC([[43, 33], [55, 36], [59, 46], [48, 47]], 2), bars = [0, 1, 2, 3, 4].map(i => bar([lerp([45, 34], [56, 37.5], i / 4.4), lerp([48, 46], [58, 46], i / 4.4)].map(([x, y]) => [x + 1.2, y]), .9));
    const white = smC([[50, 49], [59, 48.5], [63, 55], [55, 56]], 2), rump = smC([[62, 58], [70, 60], [70, 66], [62, 66]], 2);
    const tail = smC([[64, 60], [76, 70], [88, 86], [82, 90], [68, 76], [60, 66]], 2), crown = smC([[23, 30], [29, 21], [40, 19], [45, 24], [34, 27]], 2);
    const beak = smC([[23, 30], [14, 32], [23, 35]], 1), A = acorn(19, 33, 175, 13);
    fin('halo_szajko', { hu:'szajkó', en:'Eurasian jay', look:'Eurasian jay perched on a branch facing left with an acorn in its beak: pinkish-brown body, pale dark-streaked crown, black moustache stripe, bright blue and black barred wing patch, white wing patch, black flight feathers, white rump and black tail', shapes:[
      pth('wood', 'dark', [taper([[20, 67], [55, 66], [90, 70]], 4.2, 3.2)]),
      pth('dark', 'base', [tail, bar([[44, 60], [44, 67]], 1.6), bar([[49, 61], [50, 67.5]], 1.6)]),
      ...blob('skin', body, [42, 44], { ld:3.5, dd:3.5, ed:0, bt:'dark', lt:'base', dm:'chocolate', lm:'skin' }),
      det('white', 'base', rump),
      ...blob('dark', wing, [62, 56], { ld:2.4, dd:0, ed:0 }), det('white', 'base', white),
      det('sky', 'base', patch), dpth('blue', 'line', bars),
      det('cream', 'base', crown),
      det('dark', 'base', taper([[23, 35], [26, 40], [28, 44]], 2.8, 1.4)),
      pth('wood', 'base', [A.nut]), pth('cardboard', 'light', [A.cup]),
      pth('dark', 'base', [beak]),
      det('cream', 'light', circ(29.5, 29.5, 2.2, 10)), det('dark', 'base', circ(29.8, 29.5, 1.1, 8)),
      shineP(band([[30, 23], [38, 21.5]], 1.4), .7),
    ] });
  }

  // =====================================================================
  //  11. Vaddisznó (Sus scrofa) – oldalnézet balra: nagy, elöl magas, sötét szürkésbarna, sörtés test, a hátán felálló sörény,
  //      hosszú orr ormánykoronggal, kis fehér agyar, felálló kis fül, rövid, sötét lábak, bojtos farok
  // =====================================================================
  {
    const body = smC([[6, 55], [12, 44], [24, 34], [40, 24], [58, 25], [76, 30], [90, 40], [92, 56], [84, 66], [60, 70], [36, 70], [22, 64], [12, 60]], 4);
    const mane = smC([[24, 34], [30, 26], [36, 27], [40, 20], [46, 23], [52, 18], [58, 22], [64, 20], [70, 25], [76, 24], [84, 34], [70, 32], [52, 28], [36, 31]], 1);
    const legs = [[32, 66, 30, 86], [44, 67, 44, 87], [70, 64, 72, 86], [82, 60, 86, 84]].map(([a, b, c, d]) => taper([[a, b], [c, d]], 6, 4.2, false));
    const hoof = [[30, 86], [44, 87], [72, 86], [86, 84]].map(([x, y]) => smC([[x - 3, y - 1], [x + 3, y - 1], [x + 3.4, y + 3], [x - 3.4, y + 3]], 1));
    const disc = circ(6.5, 56.5, 2.4, 10, 4, 10), tusk = taper(smO([[15, 60], [13, 55], [15, 51]], 2), 2, .8), ear = smC([[30, 34], [32, 22], [38, 32]], 1);
    fin('halo_vaddiszno', { hu:'vaddisznó', en:'wild boar', look:'wild boar in side view facing left: big front-heavy dark grey-brown bristly body with a raised dark bristle mane along the back, a long snout with a flat snout disc, a small white tusk, small upright ear, tiny eye, short dark legs and a tufted tail', shapes:[
      pth('chocolate', 'dark', legs.slice(0, 2).concat([bar(smO([[90, 44], [95, 50], [94, 58]], 2), 1.6)])), pth('dark', 'base', hoof.slice(0, 2)),
      ...blob('chocolate', body, [50, 48], { ld:5, dd:5, ed:1.8 }),
      pth('chocolate', 'dark', legs.slice(2)), pth('dark', 'base', hoof.slice(2)),
      pth('dark', 'base', [mane]), dpth('dark', 'light', [bar([[42, 23], [45, 28]], .8), bar([[56, 21], [58, 27]], .8), bar([[68, 23], [70, 29]], .8)]),
      pth('chocolate', 'dark', [ear]),
      face('chocolate', 'light', disc), det('dark', 'base', circ(5.6, 55, .8, 6)), det('dark', 'base', circ(6.4, 59, .8, 6)),
      pth('white', 'base', [tusk]),
      det('dark', 'base', circ(24, 42, 1.8, 8)), det('paper', 'light', circ(23.4, 41.4, .6, 6)),
      shineP(band([[16, 44], [26, 36]], 1.8), .5),
    ] });
  }

  // =====================================================================
  //  12. Nagy fakopáncs (Dendrocopos major), hím – egy fatörzsön kapaszkodik függőlegesen (a farkával támaszkodik), a törzsön
  //      kerek fészekodú: fekete hát, NAGY fehér vállfolt, fehér pöttysoros szárny, fehér pofa fekete bajusszal, PIROS tarkó és alsó farok
  // =====================================================================
  {
    const trunk = [[54, 2], [88, 2], [88, 98], [54, 98]], trunkD = [[78, 2], [88, 2], [88, 98], [78, 98]];
    const bark = [[[62, 50], [61.5, 64], [62.5, 78]], [[72, 60], [72.5, 92]], [[63, 86], [62, 97]], [[74, 6], [73.5, 14]]].map(p => bar(p, .9));
    const hole = circ(70, 28, 7, 16, 8.6), rim = circ(70.6, 28.6, 8.6, 16, 10.2);
    const body = smC([[36, 30], [46, 28], [53, 38], [55, 56], [53, 72], [46, 78], [38, 72], [33, 56], [32, 42]], 4);
    const tail = smC([[44, 74], [54, 72], [56, 90], [52, 96], [48, 90]], 2), under = smC([[48, 66], [54, 64], [55, 76], [50, 80]], 2);
    const wing = smC([[36, 36], [44, 42], [46, 60], [44, 78], [38, 74], [32, 58], [32, 44]], 3);
    const shoulder = smC([[37, 38], [43, 43], [43, 52], [38, 49]], 2), dots = [[36, 58], [40, 60], [37, 64], [41, 66], [38, 70]].map(([x, y]) => circ(x, y, 1.2, 6, .9));
    const head = circ(44, 22, 10, 16, 9.2), cheek = smC([[43, 21], [50, 19], [52, 25], [46, 28], [42, 26]], 2), stache = taper([[52, 25], [45, 29], [38, 30]], 1.8, 1.2);
    const nape = smC([[34, 20], [37, 15], [40, 20], [36, 24]], 1), beak = smC([[52, 18], [62, 20], [52, 23]], 1);
    fin('halo_nagy_fakopancs', { hu:'nagy fakopáncs', en:'great spotted woodpecker', look:'male great spotted woodpecker clinging upright to a tree trunk next to a round nest hole, facing the trunk: black back with a big white shoulder patch and white-spotted wing, white cheek with a black moustache stripe, red nape, red undertail, stiff tail propped against the bark, chisel-like beak', shapes:[
      face('wood', 'base', trunk), det('wood', 'dark', trunkD),
      face('wood', 'light', rim), det('dark', 'base', hole),
      pth('dark', 'base', [tail]),
      ...blob('cream', body, [44, 54], { ld:0, dd:3, ed:0, bt:'light' }), det('red', 'base', under),
      ...blob('dark', wing, [39, 56], { ld:2.2, dd:0, ed:0 }), det('white', 'base', shoulder), dpth('white', 'base', dots),
      pth('dark', 'base', [head]), det('white', 'base', cheek), det('dark', 'base', stache), det('red', 'base', nape),
      face('steel', 'dark', beak), det('dark', 'base', circ(46, 19.5, 1.5, 8)),
      pth('steel', 'dark', [bar([[50, 44], [56, 42]], 1.6), bar([[51, 60], [56, 58]], 1.6)]),
      shineP(band([[38, 16], [44, 13]], 1.4), .7),
    ] });
  }

})();
