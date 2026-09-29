// ============================================================
//  Matricák — „Élő lánc” (táplálékháló), 4. fejezet: SZÁNTÓ ÉS KERT – B szinten (docs/rajzolas.md, docs/halo-kutatas-szanto.md 11. pont,
//  docs/halo-szanto.json)
//  19 matrica: 10 faj (búza, fejes káposzta, kerti tök, almafa, búzavirág, káposztalepke, meztelencsiga, futóbogár, keleti sün,
//  fogoly), 4 emberi hatás (gyomirtó a táblán, a mezsgye felszántása, csupasz talaj, csigaölő szer) és 5 visszaépítő lépés
//  (permetezetlen tábla-szegély, visszaültetett mezsgye, talajtakarás, sünbarát kert, beporzóbarát veteményes).
//  A segédek az art-halo.js / art-halo-to.js másolatai (így ez a fájl is önálló) + a fejezet saját segédei (harapott levél, inda, sün).
//  A játékban hatszögben, ~44–52 px-en jelennek meg (artIcon('halo_…')) → nagy, egyszerű sziluett, kevés, de jellegzetes részlet,
//  lehetőleg álló vagy négyzetes kompozíció (a széles kép a hatszögben összemegy).
//  Újrahasznált (itt NINCS újrarajzolva): halo_pipacs, halo_hazimeh, halo_poszmeh, halo_vadmeh, halo_zengolegy, halo_leveltetu,
//  halo_mezei_pocok, halo_katica, halo_voros_vercse, halo_egereszolyv, halo_giliszta, halo_v_vercselada.
//  A hatás-matricák semleges tárgyak: nincs szöveg, szám, márka, címke, jelkép, koponya.
//  Render: node tools/art-render.js 2d web/js/art/art-halo-szanto.js ki.png --skip halo
//  Emoji-álnév nincs (a játék névvel kéri).
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
  // vetített kör egy vízszintes síkon (y = magasság)
  const disc = (P, cx, y, cz, rx, rz = rx, n = 16) => circ(0, 0, 1, n).map(([a, b]) => P([cx + rx * a, y, cz + rz * b]));
  // vékony, kéttónusú „ecsetvonás” dísz: alsó sötét sáv + eltolt világos csík (fonal, szár, érhálózat – kontúr nélkül)
  const wave = (x0, x1, y0, A, f, ph = 0, n = 14) => Array.from({ length:n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, y0 + A * Math.sin(f * (x - x0) + ph)]; });

  // ---------------- a szántós fejezet saját segédei ----------------
  // körök uniója (permetköd, lomb, szőrös test) a c pontból sugárirányban mintavételezve (az art-halo.js-ből)
  const union = (C, c) => simplify(Array.from({ length:120 }, (_, i) => { const a = i * 3, u = [cos(a), sin(a)]; let r = 0;
    for(const [x, y, R] of C){ const dx = x - c[0], dy = y - c[1], b = u[0] * dx + u[1] * dy, q = b * b - (dx * dx + dy * dy - R * R); if(q >= 0) r = max(r, b + Math.sqrt(q)); }
    return [c[0] + r * u[0], c[1] + r * u[1]]; }), .2);
  // helyi koordináta-rendszer: o origó, a irány (fok), s nagyítás → [u, v] = [a tengely mentén, merőlegesen]
  const frame = (o, a, s = 1) => ([u, v]) => [o[0] + s * (u * cos(a) - v * sin(a)), o[1] + s * (u * sin(a) + v * cos(a))];
  // 3/4-es nézetű méhsejt-diorámás „sziget”: füves (vagy földes) teteje, elöl földes pereme (mint a tavas fejezetben)
  const tile = (cx, cy, rx, ry, d = 8, n = 20) => { const top = circ(cx, cy, rx, n, ry); return { top, sil:hullOf([...top, ...top.map(([x, y]) => [x, y + d])]), c:[cx, cy], d }; };
  const tileS = (T, m = 'grass') => [pth('soil', 'base', [T.sil]), det('soil', 'dark', crescent(T.sil, [T.c[0], T.c[1] + T.d * .6], 60, 58, 3)),
    pth(m, 'base', [T.top]), det(m, 'light', crescent(T.top, T.c, -120, 70, 3))];
  // harapott levél: a sziluett a c középpontból sugárirányban mintavételezve, a szélén átnyúló harapás-körök kivágva
  function bitten(sil, c, bites, n = 90){
    return simplify(Array.from({ length:n }, (_, i) => { const a = 360 * i / n, u = [cos(a), sin(a)]; let r = rayR(sil, c, a);
      for(const [x, y, R] of bites){ const dx = x - c[0], dy = y - c[1], b = u[0] * dx + u[1] * dy, q = b * b - (dx * dx + dy * dy - R * R);
        if(q >= 0){ const t1 = b - Math.sqrt(q), t2 = b + Math.sqrt(q); if(t1 < r && r <= t2) r = max(t1, 0); } }
      return [c[0] + r * u[0], c[1] + r * u[1]]; }), .2);
  }
  // spirális inda (kacs): a középpont körül befelé csavarodó vonal
  const curl = (cx, cy, r0, a0, turns = 1.4, n = 26) => Array.from({ length:n + 1 }, (_, i) => { const t = i / n, a = a0 + 360 * turns * t, r = r0 * (1 - .8 * t); return [cx + r * cos(a), cy + r * sin(a)]; });
  // keleti sün (oldalnézet, balra néz) – a sün, a csigaölős és a sünbarát kert matricája közös rajza; F = frame(…) a helyére teszi
  // (helyi rács: a test közepe [0, 0], ~80 × 46 egység); o.head: csak a fej és a tüskés homlok, a hát lekerekítve (a csigaölős képhez);
  // o.lite: kevesebb alakzat (sötét tüske-árnyék, fül és arc-árnyék nélkül) – a zsúfoltabb jelenetekhez
  function hedgehog(F, o = {}){
    const T = ([u, v]) => F([u, v]);
    const man = Array.from({ length:44 }, (_, i) => { const t = 360 * i / 44, sp = sin(t) < .5 && i % 2 ? 1.16 : 1; let u = 2 + 33 * sp * cos(t), v = -3 + 23 * sp * sin(t);
      if(o.head && u > -6) u = -6 + (u + 6) * .3; return [u, v]; }).map(T);
    const mc = T([o.head ? -12 : 2, -4]);
    const face = smC([[-20, -3], [-30, -1], [-39, 3], [-46, 7], [-45, 10.5], [-37, 12.5], [-24, 15], [-10, 18], [-3, 15], [-8, 5]].map(T), 3);
    const strokes = [];
    for(let u = -24; u <= 30; u += 6.5) for(let v = -21; v <= 12; v += 6.5){ const q = (u - 2) / 30, r = (v + 3) / 21; if(q * q + r * r > .82 || (o.head && u > -8) || (u < -14 && v > -4)) continue;
      const a = -24 - (u + v) % 7; strokes.push(band([T([u, v]), T([u + 5.5 * cos(a), v + 5.5 * sin(a)])], 1.5, false)); }
    const legs = o.head ? [] : [[-16, 18], [16, 18]].map(([u, v]) => band([T([u, v]), T([u - 2, v + 5])], 5));
    return [
      legs.length && pth('chocolate', 'dark', legs),
      ...blob('chocolate', simplify(man, .3), mc, { ld:5, dd:o.head ? 0 : 4, ed:0, lm:'wood' }),
      dpth('cardboard', 'light', strokes, { o:.9 }), !o.lite && dpth('dark', 'light', strokes.map(p => p.map(([x, y]) => [x + .9, y + 1.1])), { o:.5 }),
      ...blob('cardboard', face, T([-26, 8]), { ld:2.2, dd:o.lite ? 0 : 2.4, ed:0, bt:'light', lt:'light', lm:'cream' }),
      !o.lite && pth('cardboard', 'base', [circ(...T([-19, -3]), 3.2, 10)]),
      pth('dark', 'base', [circ(...T([-45.5, 8.2]), 2.6, 10)]),
      det('dark', 'base', circ(...T([-30, 4]), 2.1, 10)), det('paper', 'light', circ(...T([-30.7, 3.3]), .7, 6)),
    ].filter(Boolean);
  }

  // =====================================================================
  //  1. Őszi búza (Triticum aestivum) – csokor: három érett, aranysárga kalász (kétoldalt váltakozó, kövér szemek, rövid szálka),
  //     aranyló szalmaszár, két-három hosszú, keskeny levél
  // =====================================================================
  {
    // kalász: a tengely mentén váltakozó, kétoldali szemek (a csúcs felé kifelé dőlő ellipszisek); a bal oldali sor a fény felőli
    const ear = (o, a, len, n = 6) => { const F = frame(o, a), L = [], D = [], awn = [], crease = [];
      for(let i = 0; i < n; i++){ const u = len * (.08 + .8 * i / (n - 1)), k = 1 - .22 * i / (n - 1);
        for(const s of [-1, 1]){ const cu = u + (s > 0 ? len * .06 : 0), c = F([cu, s * 3.4 * k]), d = a + s * 24;
          (s < 0 ? L : D).push(circ(c[0], c[1], 5.2 * k, 8, 3.4 * k, d));
          if(i % 2) crease.push(band([[c[0] - 1.6 * k * cos(d), c[1] - 1.6 * k * sin(d)], [c[0] + 1.6 * k * cos(d), c[1] + 1.6 * k * sin(d)]], .8, false));
          const tp = [c[0] + 5 * k * cos(d), c[1] + 5 * k * sin(d)], da = a + s * 14; if(i >= 2) awn.push(band([tp, [tp[0] + 6 * cos(da), tp[1] + 6 * sin(da)]], .8, false)); } }
      const top = F([len * .98, 0]); L.push(circ(top[0], top[1], 4, 8, 2.5, a));
      awn.push(band([F([len * 1.08, 0]), F([len * 1.08 + 7, 0])], .8, false));
      return { core:union([...L, ...D].map(g => { const m = g.reduce((a, q) => [a[0] + q[0] / g.length, a[1] + q[1] / g.length], [0, 0]); return [m[0], m[1], 4.2]; }), F([len * .5, 0])), L, D, awn, crease };
    };
    const E = [ear([37, 42], -112, 30, 5), ear([51, 36], -88, 32, 5), ear([64, 44], -64, 29, 5)];
    const stems = [tube(smO([[49, 97], [44, 70], [37, 42]]), 2.4), tube(smO([[50, 97], [50.5, 66], [51, 36]]), 2.4), tube(smO([[51, 97], [56, 70], [64, 44]]), 2.4)];
    const lv = (pts, w) => taper(smO(pts, 4), w, .4);
    const leavesG = [lv([[49.5, 82], [38, 72], [26, 66], [18, 68]], 4.6), lv([[50.5, 74], [62, 64], [74, 60], [82, 64]], 4.6)], leafY = lv([[50, 90], [60, 86], [70, 86], [77, 90]], 4);
    const all = k => E.flatMap(e => e[k]);
    fin('halo_buza', { hu:'őszi búza', en:'ripe wheat ears', grow:.9, look:'a bunch of three ripe golden wheat ears with plump grains in two alternating rows and short awns, golden straw stems and two long narrow green leaves and one yellowing leaf', shapes:[
      pth('gold', 'base', stems.map(s => s.sil)), dpth('gold', 'light', stems.map(s => s.light)),
      pth('grass', 'base', leavesG), dpth('grass', 'light', leavesG.map(p => p.slice(Math.floor(p.length / 2)))), pth('gold', 'light', [leafY]),
      dpth('gold', 'dark', all('awn')),
      pth('gold', 'dark', E.map(e => e.core)),
      dpth('gold', 'base', all('D')), pth('honey', 'light', all('L'), { d:true }),
      dpth('gold', 'dark', all('crease'), { o:.8 }),
      shineP(band([[45, 20], [47, 13]], 1.4), .8),
    ] });
  }

  // =====================================================================
  //  2. Fejes káposzta (Brassica oleracea var. capitata) – tömör, halványzöld fej, rajta a ráboruló levél széle és erezete,
  //     körülötte elálló, hullámos szélű, erezett, sötétebb külső levelek
  // =====================================================================
  {
    const hc = [50, 50], head = circ(50, 50, 25, 26, 23);
    const BR = [[0, 0], [.12, .3], [.42, .5], [.75, .44], [.95, .22], [1, 0]];
    const L = leafSet([[BR, 46, 62, 196, 42, .025, 3], [BR, 54, 62, -16, 42, .025, 3], [BR, 44, 56, 232, 34, .025, 3], [BR, 56, 56, -52, 34, .025, 3], [BR, 50, 64, 90, 30, .025, 3]]);
    const veins = [[46, 62, 196, 42], [54, 62, -16, 42], [44, 56, 232, 34], [56, 56, -52, 34], [50, 64, 90, 30]].flatMap(([x, y, d, l]) => [.45, .7].flatMap(t => { const b = [x + cos(d) * l * t, y + sin(d) * l * t];
      return [1, -1].map(s => band([b, [b[0] + l * .2 * cos(d + s * 50), b[1] + l * .2 * sin(d + s * 50)]], .9, false)); }));
    // a fejre boruló levél: a fej bal-alsó része, a széle ívesen fut át a fejen
    const wrap = clip(circ(22, 70, 40, 30, 34), hullOf(head)), wrap2 = clip(circ(84, 26, 30, 30, 28), hullOf(head));
    const wv = [band(smO([[30, 62], [42, 55], [54, 52]], 3), 1, false), band(smO([[33, 70], [44, 66], [56, 64]], 3), 1, false), band(smO([[62, 32], [70, 38], [74, 46]], 3), 1, false)];
    fin('halo_kaposzta', { hu:'fejes káposzta', en:'head of cabbage', look:'a firm round pale-green head of cabbage with the edge of a wrapping leaf across it, surrounded by a few spreading wavy darker green outer leaves with pale veins', shapes:[
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep, { o:.7 }),
      dpth('sage', 'light', L.rib, { o:.9 }), dpth('sage', 'base', veins, { o:.8 }),
      ...blob('grass', head, hc, { ld:4, dd:5, ed:1.6, bt:'light', lt:'light', lm:'sage' }),
      pth('sage', 'base', [wrap]), pth('sage', 'light', [wrap2]),
      dpth('grass', 'base', wv, { o:.9 }),
      shineP(band([[38, 36], [44, 31]], 2), .8),
    ] });
  }

  // =====================================================================
  //  3. Kerti tök (Cucurbita) – narancs, bordás sütőtök, fölötte egy NAGY sárga, tölcséres tökvirág (csillagos, visszahajló
  //     csúcsú párta, benne narancs bibe), a száron kunkorodó inda és egy karéjos levél
  // =====================================================================
  {
    const { star } = ART.geo, lob = [[-21, 11, 16], [-11, 13, 18.5], [0, 13, 19.5], [11, 13, 18.5], [21, 11, 16]].map(([x, rx, ry]) => circ(62 + x, 70, rx, 18, ry));
    const vine = tube(smO([[62, 52], [54, 44], [42, 42], [30, 46]]), 2.6), stalk = taper([[62, 53], [63, 47], [66, 44]], 5, 3.6);
    const F = frame([38, 44], -108), tubeP = [[0, 3], [.35, 4], [.62, 7], [.82, 12.5], [1, 18]], len = 38;
    const trumpet = smC([...tubeP.map(([u, v]) => F([u * len, v])), ...tubeP.slice().reverse().map(([u, v]) => F([u * len, -v]))], 3);
    const mc = F([len + 1, 0]), mouth = star(0, 0, 21, 12, 5).map(([x, y]) => { const q = [x, y * .5]; return [mc[0] + q[0] * cos(-22) - q[1] * sin(-22), mc[1] + q[0] * sin(-22) + q[1] * cos(-22)]; });
    const inner = circ(mc[0] + .5, mc[1] + .8, 11, 14, 4.6, -22), pist = circ(mc[0] + .6, mc[1] + .4, 3.6, 10, 2.6, -22);
    const LB = [[0, 0], [.1, .3], [.3, .42], [.42, .3], [.55, .44], [.72, .34], [.8, .16], [1, 0]], Lf = leafSet([[LB, 80, 48, -60, 30, .03, 2]]);
    const tendril = band(curl(18, 56, 8, -90, 1.5), 1.1, false), tstem = band(smO([[30, 46], [24, 48], [18, 48]], 3), 1.1, false);
    fin('halo_tok', { hu:'kerti tök', en:'garden squash with a squash flower', look:'an orange ribbed garden squash, a big yellow trumpet-shaped squash flower with a star-shaped flared mouth and an orange stigma on the green vine, a curly tendril and a lobed leaf', shapes:[
      pth('leaf', 'base', [Lf.lit[0]]), pth('leaf', 'dark', Lf.shade), dpth('grass', 'light', Lf.rib),
      pth('leaf', 'base', [vine.sil, tendril, tstem]), det('grass', 'base', vine.light),
      pth('orange', 'dark', [lob[0], lob[4]]), pth('orange', 'base', [lob[1], lob[3]]),
      ...blob('orange', lob[2], [62, 70], { ld:3.4, dd:3, ed:0, lm:'orange' }),
      pth('leaf', 'dark', [stalk]),
      ...blob('honey', trumpet, F([len * .6, 0]), { ld:2.4, dd:2.4, ed:0, dm:'gold' }),
      pth('honey', 'light', [mouth]), dpth('gold', 'dark', [inner]), dpth('orange', 'base', [pist]),
      shineP(band([[47, 64], [48, 76]], 2.2), .75),
    ] });
  }

  // =====================================================================
  //  4. Almafa (Malus domestica) – egy ágon: két rózsásfehér, ötszirmú virág és egy bimbó, két-három tojásdad levél és egy piros alma
  // =====================================================================
  {
    const br = tube(smO([[6, 66], [30, 50], [58, 36], [94, 20]]), t => 4.4 - 1.8 * t), tw = tube(smO([[34, 48], [32, 38], [28, 30]]), 1.8);
    const ac = [66, 66], apple = smC([[66, 50], [74, 47], [82, 52], [85, 63], [81, 76], [72, 83], [66, 81], [60, 83], [51, 76], [47, 63], [50, 52], [58, 47]], 3);
    const stalk = band(smO([[64, 37], [66, 44], [66, 50]], 3), 1.6, false);
    const fl = (cx, cy, r, a0) => Array.from({ length:5 }, (_, i) => circ(cx + r * .62 * cos(a0 + 72 * i), cy + r * .62 * sin(a0 + 72 * i), r * .5, 10, r * .44, a0 + 72 * i));
    const F1 = fl(26, 26, 17, -90), F2 = fl(46, 26, 13, -60);
    const L = leafSet([[OVAL, 58, 36, -80, 22, .02, 3], [OVAL, 76, 29, 30, 20, .02, 3], [OVAL, 14, 60, 120, 16, .02, 3]]);
    fin('halo_alma', { hu:'almafa', en:'apple branch with blossom and an apple', look:'an apple tree branch with two pink-white five-petalled apple blossoms and a pink bud, oval green leaves and one shiny red apple hanging on a short stalk', shapes:[
      pth('wood', 'dark', [br.sil, tw.sil, stalk]), dpth('wood', 'base', [br.light]),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep, { o:.7 }),
      ...blob('red', apple, ac, { ld:4.6, dd:5, ed:1.8 }),
      pth('blossom', 'light', [...F1, ...F2]), dpth('blossom', 'base', [...F1, ...F2].map(p => crescent(p, p.reduce((a, q) => [a[0] + q[0] / p.length, a[1] + q[1] / p.length], [0, 0]), 45, 70, 1.6))),
      pth('blossom', 'base', [circ(33, 34, 3.6, 10, 4.6, -30)]),
      dpth('honey', 'base', [circ(26, 26, 3.4, 10), circ(46, 26, 2.6, 10)]), dpth('honey', 'dark', [...[0, 72, 144, 216, 288].map(a => circ(26 + 3.8 * cos(a), 26 + 3.8 * sin(a), .9, 6))]),
      shineP(circ(57, 58, 3.2, 10, 5, 30), .85),
    ] });
  }

  // =====================================================================
  //  5. Búzavirág (Centaurea cyanus) – 3/4-es nézetű fészek: körben rojtos végű, tölcséres, élénkkék szélső virágok, a közepén sötét
  //     lilás csöves virágok, alatta pikkelyes, zöld fészekpikkely-kupa; vékony, szürkészöld szár, keskeny levelek, egy bimbó
  // =====================================================================
  {
    const hc = [48, 30], sq = .72;
    // egy szélső virág: keskeny tövű tölcsér, a vége széles, 4 foggal (rojtos)
    const flo = (a, len) => { const P = [[0, -.06], [.62, -.17], [1, -.34], [.93, -.19], [1.03, -.09], [.94, 0], [1.03, .09], [.93, .19], [1, .34], [.62, .17], [0, .06]];
      return P.map(([u, v]) => [hc[0] + (u * cos(a) - v * sin(a)) * len, hc[1] + (u * sin(a) + v * cos(a)) * len * sq]); };
    const back = Array.from({ length:8 }, (_, i) => -90 + 22 + 45 * i).filter(a => sin(a) < .1).map(a => flo(a, 26));
    const front = Array.from({ length:8 }, (_, i) => -90 + 45 * i).filter(a => sin(a) >= -.2).map(a => flo(a, 27));
    const mid = Array.from({ length:7 }, (_, i) => flo(-90 + 51 * i + 10, 13));
    const cup = smC([[39, 38], [57, 38], [55, 50], [48, 54], [41, 50]], 3), scales = [[43, 44], [48, 43], [53, 44], [45.5, 49], [50.5, 49]].map(([x, y]) => band([[x - 2.2, y], [x, y + 1.8], [x + 2.2, y]], .8, false));
    const stem = tube(smO([[48, 52], [50, 72], [48, 98]]), 2.4), side = tube(smO([[49.5, 76], [60, 66], [68, 54]]), 1.8);
    const lf = [taper(smO([[49, 84], [38, 76], [28, 74]], 3), 3.6, .5), taper(smO([[49.5, 64], [58, 70], [66, 80]], 3), 3.2, .5)];
    const bud = circ(69, 50, 4.4, 12, 5.4, 20);
    fin('halo_buzavirag', { hu:'búzavirág', en:'cornflower', look:'bright blue cornflower head in three-quarter view with fringed funnel-shaped ray florets all around, dark purple centre florets and a green scaly cup below, on a thin grey-green stem with narrow leaves and a small bud', shapes:[
      pth('sage', 'dark', [stem.sil, side.sil, ...lf]), dpth('sage', 'base', [stem.light]),
      ...blob('grass', bud, [69, 50], { ld:1.6, dd:1.6, ed:0 }), det('blue', 'base', circ(69, 46.5, 2.2, 8, 1.6, 20)),
      ...blob('grass', cup, [48, 45], { ld:2, dd:2, ed:0 }), dpth('chocolate', 'dark', scales),
      pth('blue', 'dark', back), pth('blue', 'base', front),
      dpth('blue', 'light', front.map(p => [p[0], p[1], p[2], p[8], p[9], p[10]]), { o:.9 }),
      pth('purple', 'dark', mid), dpth('purple', 'line', [circ(48, 30, 4.4, 10, 3.2)]),
      shineP(band([[30, 24], [36, 21]], 1.6), .8),
    ] });
  }

  // =====================================================================
  //  6. Káposztalepke (Pieris brassicae) – felülnézet: fehér szárnyak FEKETE szárnycsúccsal (az elülsőn fekete pötty is), sötét test,
  //     bunkós csáp; alatta egy megrágott, erezett káposztalevél, rajta a sárga, fekete pöttyös, szőrös hernyó
  //     (a pávaszem vörös és szemfoltos, az erdei hernyók zöldek – ez fehér + sárga-fekete)
  // =====================================================================
  {
    const T = -8, bx = 50, mir = p => p.map(([x, y]) => [2 * bx - x, y]);
    const fw = smC([[48, 25], [40, 13], [28, 6], [15, 8], [10, 17], [16, 28], [32, 33], [47, 31]], 3), hw = smC([[48, 32], [36, 34], [25, 40], [25, 49], [34, 53], [44, 47], [49, 38]], 3);
    const tipC = [[4, 0], [30, 0], [30, 9], [18, 22], [4, 24]], tip = clip(fw, tipC);
    const body = tube(smO([[50, 18], [50.2, 32], [50, 48]]), t => 4.4 - 2 * t);
    const ant = [bar([[49, 18], [44, 8], [41, 3]], 1.2), bar([[51, 18], [56, 8], [59, 3]], 1.2), circ(41, 3, 1.6, 8), circ(59, 3, 1.6, 8)];
    // megrágott káposztalevél (kerek, hullámos szél, harapások)
    const lc = [52, 80], leaf0 = wobC(52, 80, 42, 17, .04, 7, .5, 32), leaf = bitten(leaf0, lc, [[14, 72, 5], [90, 76, 4.4], [70, 64, 4]], 64);
    const veins = [band(smO([[16, 86], [52, 80], [88, 76]], 3), 1.3, false), ...[[30, 83, -1], [46, 81, -1], [62, 79, -1], [38, 82, 1], [56, 80, 1], [72, 78, 1]].map(([x, y, s]) => band([[x, y], [x + 6, y + s * 8]], 1, false))];
    // hernyó: gyöngysor-szelvények egy enyhe S-ívben, fekete pöttyök, rövid szőrök, sötét fejtok
    const sp = smO([[24, 78], [36, 73], [50, 75], [62, 72], [72, 70]], 3), seg = sp.filter((_, i) => i % 2 === 0).map(([x, y]) => circ(x, y, 4.2, 8, 3.8));
    const spots = sp.filter((_, i) => i % 2 === 0).slice(1).flatMap(([x, y], i) => [circ(x - .5, y - 1.2, 1.1, 6), ...(i % 2 ? [circ(x + 1.4, y + 1.6, .9, 6)] : [])]);
    const hairs = sp.filter((_, i) => i % 2 === 0).slice(1).map(([x, y], i) => band([[x, y - 3.4], [x + (i % 2 ? 1.4 : -1.4), y - 6.4]], .6, false));
    fin('halo_kaposztalepke', { hu:'káposztalepke', en:'large white butterfly and its caterpillar', look:'a white butterfly seen from above with black forewing tips and a black spot on each forewing, dark body and clubbed antennae, above a nibbled veined cabbage leaf with a yellow, black-spotted, hairy caterpillar crawling on it', shapes:[
      ...blob('grass', leaf, lc, { ld:3, dd:3, ed:0, dm:'leaf' }), dpth('sage', 'light', veins, { o:.85 }),
      dpth('dark', 'base', hairs),
      pth('gold', 'light', seg), dpth('grass', 'base', seg.map(s => s.slice(2, 5).concat([s[0]])), { o:.7 }), dpth('dark', 'base', spots),
      pth('dark', 'light', [circ(20.5, 79.5, 4.2, 12, 4)]),
      pth('white', 'base', [hw, mir(hw)]), pth('paper', 'base', [fw, mir(fw)]),
      dpth('white', 'dark', [crescent(fw, [30, 22], 70, 70, 3), crescent(mir(fw), [70, 22], 110, 70, 3)], { o:.8 }),
      pth('dark', 'base', [tip, mir(tip)]), dpth('dark', 'base', [circ(29, 23, 2.6, 10), circ(71, 23, 2.6, 10)]),
      pth('dark', 'base', [body.sil, ...ant]),
      shineP(band([[18, 14], [26, 10]], 1.4), .7),
    ] });
  }

  // =====================================================================
  //  7. Meztelencsiga (spanyol csiga, Arion vulgaris) – HÁZ NÉLKÜLI, narancsbarna, oldalnézetben balra: elöl sima köpeny-pajzs a
  //     légzőnyílással, hátul szemcsés hát, világos talpszegély, két hosszú szemes és két rövid tapogató; mögötte egy megrágott levél
  // =====================================================================
  {
    const body = smC([[7, 72], [9, 63], [17, 57], [30, 52], [44, 49.5], [58, 52.5], [72, 59], [86, 68], [99, 80], [84, 84.5], [62, 86], [40, 86], [20, 85.5], [9, 81]], 4), bc = [48, 70];
    const mantle = smC([[19, 60], [29, 52.5], [44, 49.5], [57, 53], [55, 64], [36, 67.5], [21, 66]], 3);
    const tub = [[62, 60], [70, 64], [78, 69], [64, 70], [72, 74], [84, 75], [58, 76], [66, 79], [88, 79]].map(([x, y]) => circ(x, y, 2, 8, 1.2, 25));
    const tent = [bar([[13, 60], [8, 50], [4, 40]], 3), bar([[19, 57], [17, 47], [16, 37]], 3), bar([[9, 73], [2, 77]], 2.4)];
    const knobs = [circ(4, 40, 2.8, 8), circ(16, 37, 2.8, 8)];
    const LP = [[0, 0], [.14, .22], [.45, .32], [.78, .22], [1, 0]], lf0 = leafFull(LP, 44, 64, -58, 50, .02, 3), lc = [57, 43], leaf = bitten(lf0, lc, [[45, 36, 6], [42, 48, 4.6], [60, 22, 4.4]]);
    const Ls = leafSet([[LP, 44, 64, -58, 50, 0, 3]]);
    fin('halo_meztelencsiga', { hu:'meztelencsiga', en:'orange-brown slug without a shell', look:'an orange-brown shell-less slug in side view facing left, a smooth mantle shield with a breathing hole at the front, a grainy wrinkled back, pale foot fringe, two long eye-tentacles with dark tips and two short lower tentacles, next to a nibbled green leaf', shapes:[
      ...blob('grass', leaf, lc, { ld:3.6, dd:3.6, ed:0, dm:'leaf' }), dpth('sage', 'light', Ls.rib, { o:.85 }),
      pth('orange', 'dark', tent), pth('dark', 'base', knobs),
      ...blob('orange', body, bc, { ld:3.6, dd:4, ed:1.6, lm:'orange' }),
      dpth('orange', 'light', [band(smO([[12, 82], [40, 84], [70, 83.6], [93, 80.6]], 3), 2.2, false)]),
      dpth('ember', 'dark', tub, { o:.6 }),
      pth('orange', 'base', [mantle]), det('orange', 'light', crescent(mantle, [38, 63], -110, 70, 2.2)),
      dpth('chocolate', 'dark', [circ(49, 60, 2.2, 8, 1.8)]),
      shineP(band(smO([[28, 55], [36, 52.4], [45, 52]], 2), 1.8), .85), shineP(band([[66, 66], [76, 70]], 1.2), .6),
    ] });
  }

  // =====================================================================
  //  8. Futóbogár (futrinka, Carabus) – oldalnézetben balra FUT: karcsú, hosszúkás, fényes fekete test bronzos csillanással,
  //     barázdás szárnyfedő, szív alakú előtor, kis fej, HOSSZÚ, fonalas csáp, hosszú, szétterpesztett futólábak
  //     (nem szarvasbogár: nincs agancs-rágó; nem csíkbogár: nem ovális úszó, nincs sárga szegély)
  // =====================================================================
  {
    const T = -6;
    const ely = smC([[40, 45], [52, 37], [70, 35], [84, 38], [93, 46], [87, 55], [67, 59], [47, 57]], 4), pro = smC([[27, 44], [33, 40], [41, 41], [43, 48], [41, 55], [31, 55], [27, 51]], 3);
    const head = smC([[13, 48], [17, 44], [25, 44], [28, 50], [25, 55], [15, 55]], 3);
    const legN = [[[31, 54], [23, 64], [9, 74]], [[46, 57], [48, 69], [40, 83]], [[60, 58], [72, 68], [92, 78]]].map(p => bar(p, 2.4));
    const legF = [[[35, 52], [30, 62], [22, 72]], [[52, 56], [58, 67], [58, 80]], [[66, 56], [80, 62], [96, 66]]].map(p => bar(p, 2));
    const ant = [bar(smO([[15, 45], [9, 36], [5, 25], [7, 14]], 3), 1.3), bar(smO([[17, 44], [14, 34], [16, 24], [22, 16]], 3), 1.3)];
    const striae = [0, 1, 2].map(i => band(smO([[47, 50 - i * 4.5], [66, 49 - i * 5], [86, 49 - i * 3.6]], 3), .9, false)).map(p => clip(p, hullOf(ely)));
    fin('halo_futobogar', { hu:'futóbogár (futrinka)', en:'running ground beetle', tilt:T, look:'a slim glossy black ground beetle with a bronze sheen running left in side view: long grooved wing cases, heart-shaped pronotum, small head with short jaws, very long thread-like antennae and long spread running legs', shapes:[
      pth('dark', 'dark', [...legF]),
      pth('dark', 'base', [...ant, ...legN]),
      ...blob('dark', ely, [66, 47], { tilt:T, ld:3.4, dd:3, ed:0, lm:'chocolate', lt:'light' }),
      dpth('dark', 'light', striae, { o:.9 }),
      det('gold', 'dark', band(smO([[44, 56], [66, 58.4], [88, 53]], 3), 1.4, false), { o:.9 }),
      ...blob('dark', pro, [35, 48], { tilt:T, ld:2.4, dd:2, ed:0, lm:'chocolate', lt:'light' }),
      pth('dark', 'base', [head, [[14, 52], [8, 53], [11, 56.5], [15, 55.5]]]), det('paper', 'light', circ(19.5, 48.5, .9, 6)),
      shineP(band(smO([[52, 40], [64, 38], [76, 38.6]], 2), 1.8), .75), shineP(band([[31, 44], [36, 42.4]], 1.3), .7),
    ] });
  }

  // =====================================================================
  //  9. Keleti sün (Erinaceus roumanicus) – oldalnézetben balra: barna tüskés bunda világos tüskevégekkel, világos arc hegyes orral,
  //     fekete orrhegy, gombszem; az orra előtt a földből kibújó giliszta, amit szimatol
  // =====================================================================
  {
    const F = frame([60, 46], -8);
    const worm = smO([[4, 84], [8, 76], [15, 73], [21, 77], [24, 84]], 3), rings = [.3, .45, .6, .75].map(t => { const i = Math.round(t * (worm.length - 1)), p = worm[i], q = worm[min(worm.length - 1, i + 1)], a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI + 90;
      return band([[p[0] - 2.2 * cos(a), p[1] - 2.2 * sin(a)], [p[0] + 2.2 * cos(a), p[1] + 2.2 * sin(a)]], .7, false); });
    const clod = smC([[0, 90], [6, 84], [16, 83], [28, 86], [30, 92], [14, 94]], 2);
    fin('halo_sun', { hu:'keleti sün', en:'hedgehog sniffing an earthworm', look:'a brown hedgehog in side view facing left, spiny coat with pale spine tips, light brown face with a pointed snout, black nose and button eye, sniffing an earthworm coming out of a small soil clod', shapes:[
      ...blob('soil', clod, [15, 89], { ld:1.6, dd:1.6, ed:0 }),
      pth('pink', 'base', [band(worm, 4.2)]), dpth('pink', 'dark', rings), dpth('pink', 'light', [band(worm.slice(1, -2).map(([x, y]) => [x - .6, y - .9]), 1.2, false)]),
      ...hedgehog(F),
      shineP(band(smO([[F([-8, -18])[0], F([-8, -18])[1]], F([6, -22])], 2), 1.6), .6),
    ] });
  }

  // =====================================================================
  //  10. Fogoly (Perdix perdix) – kerek, zömök talajlakó madár oldalnézetben balra: NARANCSOS arc és torok, barna fejtető,
  //      finoman szürke mell, a hasán gesztenyebarna PATKÓ, az oldalán rozsdás sávok, barna, csíkos hát, rövid rozsdás farok;
  //      mögötte fűcsomó
  // =====================================================================
  {
    const body = smC([[13, 34], [19, 25], [30, 25], [36, 33], [48, 31], [66, 31], [81, 37], [92, 46], [90, 53], [80, 59], [72, 70], [58, 76], [42, 75], [31, 68], [25, 58], [21, 49], [14, 44], [10, 39]], 4), bc = [52, 54];
    const back = clip(body, [[33, 0], [100, 0], [100, 50], ...[.2, .4, .6, .8].map(t => [100 - 67 * t, 50 - 10 * t + 7 * Math.sin(Math.PI * t)]), [33, 40]]), face = clip(body, [[0, 22], [26, 22], [33, 40], [28, 55], [18, 55], [0, 48]]), cap = clip(body, [[0, 0], [36, 0], [30, 28], [16, 30]]);
    const shoe = band(smO([[38, 73], [40, 64], [47, 60], [54, 64], [55, 73]], 3), 4.4, false);
    const bars = [[62, 52], [69, 53], [76, 53]].map(([x, y]) => clip(band([[x, y], [x - 3, y + 12]], 3, false), hullOf(body)));
    const streaks = [[42, 36, 56, 34], [50, 40, 68, 38], [62, 35, 80, 40], [70, 44, 86, 46]].map(([a, b, c, d]) => band([[a, b], [c, d]], 1.1, false));
    const legs = [[[44, 74], [43, 86]], [[54, 75], [55, 87]]].map(p => bar(p, 2.4)), toes = [[43, 86], [55, 87]].flatMap(([x, y]) => [bar([[x, y], [x - 5, y + 2]], 1.3), bar([[x, y], [x + 3, y + 2]], 1.3)]);
    const tuft = [[82, 92, 70, 44], [86, 92, 84, 40], [90, 92, 98, 50], [78, 92, 64, 58], [94, 92, 104, 66]].map(([x, y, tx, ty]) => taper(smO([[x, y], [(x + tx) / 2 + (tx > x ? -2 : 2), (y + ty) / 2], [tx, ty]], 3), 3.6, .4));
    fin('halo_fogoly', { hu:'fogoly', en:'grey partridge', look:'a plump round grey partridge standing in side view facing left: orange face and throat, brown crown, finely grey breast with a dark chestnut horseshoe patch on the belly, rusty bars on the flank, streaky brown back, short rusty tail and grey legs, beside a grass tuft', shapes:[
      pth('grass', 'base', tuft.slice(0, 3)), pth('leaf', 'base', tuft.slice(3)),
      pth('steel', 'dark', [...legs, ...toes]),
      ...blob('steel', body, bc, { ld:4, dd:4, ed:1.4 }),
      pth('wood', 'base', [back]), dpth('cardboard', 'light', streaks, { o:.9 }), det('orange', 'dark', circ(90, 49, 3.4, 8, 4)),
      dpth('chocolate', 'light', bars),
      dpth('chocolate', 'base', [shoe]),
      pth('orange', 'base', [face]), det('orange', 'light', crescent(face, [20, 38], -140, 60, 2)),
      pth('wood', 'dark', [cap]),
      pth('steel', 'dark', [[[11, 35], [4, 39], [11, 42]]]),
      det('dark', 'base', circ(20, 35, 2.2, 10)), det('paper', 'light', circ(19.3, 34.3, .7, 6)),
      shineP(band([[30, 50], [34, 44]], 1.6), .7),
    ] });
  }

  // =====================================================================
  //  11. Gyomirtó szer a táblán – fent egy vontatott permetező: fehér tartály kerékkel, hosszú, rácsos szórókeret fúvókákkal és
  //      finom permetköddel; alatta, a tábla szélén NAGYBAN egy elszürkült, lekonyuló pipacs és búzavirág, alul tarló-csík.
  //      (Szer-, cég- és márkajel nincs.)
  // =====================================================================
  {
    const tank = smC([[60, 10], [88, 10], [95, 15], [95, 34], [88, 39], [60, 39], [55, 34], [55, 15]], 2), wheel = circ(80, 44, 9, 18);
    const boom = [bar([[58, 16], [4, 16]], 2.8), bar([[58, 23], [6, 23]], 2), ...[8, 20, 32, 44].map(x => bar([[x, 16], [x + 12, 23]], 1.2))];
    const noz = [10, 24, 38, 52].map(x => [[x - 1.8, 23], [x + 1.8, 23], [x, 27.5]]);
    const MC = [10, 24, 38, 52].flatMap(x => [[x, 31, 3.6], [x - 3.4, 36, 4.4], [x + 3.4, 37, 4.4], [x, 41, 4.4]]), mist = union(MC, [31, 36]);
    const ground = smC([[4, 88], [50, 84], [96, 87], [96, 95], [50, 97], [4, 95]], 2), stubble = [12, 22, 32, 62, 72, 82, 90].map(x => band([[x, 90], [x + 1, 84.6]], 1.4, false));
    // lekonyult, elszürkült virágok: a szár ívben visszahajlik, a fej lefelé lóg
    const st1 = smO([[26, 90], [27, 72], [30, 58], [26, 52], [20, 55]], 3), st2 = smO([[52, 90], [54, 72], [60, 60], [67, 60]], 3);
    const pop = [circ(15, 66, 7.4, 14, 9.6, 18), circ(23, 67, 7.4, 14, 9.6, -18), circ(19, 61, 5.2, 12)];
    const cf = smC([[62, 60], [73, 58], [77, 67], [72, 75], [66, 75], [61, 68]], 2), cfF = [[63, 72, 62, 80], [68, 74, 68, 82], [73, 71, 76, 79]].map(([a, b, c, d]) => band([[a, b], [c, d]], 2));
    const lvs = [taper(smO([[27, 78], [18, 76], [11, 80]], 2), 3.6, .5), taper(smO([[53, 76], [62, 78], [66, 84]], 2), 3.4, .5)];
    fin('halo_h_gyomirto', { hu:'gyomirtó szer a táblán', en:'boom sprayer spraying herbicide at a field edge', look:'a plain white trailed field sprayer tank on a wheel with a long lattice spray boom, nozzles and a fine spray mist at the top, and below it a big greyed, wilted, drooping poppy and cornflower over a strip of golden stubble, no label or brand', shapes:[
      ...blob('gold', ground, [50, 90], { ld:1.8, dd:1.8, ed:0 }), dpth('gold', 'dark', stubble),
      pth('sky', 'light', [mist], { o:.75 }),
      pth('steel', 'base', boom), pth('dark', 'base', noz),
      pth('dark', 'base', [wheel]), dpth('steel', 'base', [circ(80, 44, 3.6, 10)]),
      ...blob('white', tank, [75, 25], { ld:3.4, dd:3.4, ed:0, lm:'paper' }), det('steel', 'base', band([[56, 31], [94, 31]], 2.6, false)),
      pth('sage', 'dark', [band(st1, 2.4), band(st2, 2.4), ...lvs]),
      pth('berry', 'light', pop), dpth('steel', 'dark', [pop[2]], { o:.7 }),
      pth('steel', 'base', [cf, ...cfF]), dpth('purple', 'light', [clip(cf, [[58, 56], [80, 56], [80, 65], [58, 65]])], { o:.8 }),
      shineP(band([[62, 15], [70, 13.4]], 2), .8),
    ] });
  }

  // =====================================================================
  //  12. A mezsgye felszántása – piros traktor ekével szántja fel a tábla szélén a füves, virágos mezsgyét; a mezsgyén egy
  //      kivágott fasor csonkja; a traktor mögött barázdás, csupasz föld (típus- és márkajel nincs)
  // =====================================================================
  {
    const T = tile(50, 72, 48, 16, 8), cut = [[0, 0], [60, 0], [70, 100], [0, 100]];
    const plowed = clip(T.top, cut), furrows = [-10, -4, 2, 8, 14].map(d => clip(band([[4 + d * 1.5, 72 + d], [70, 72 + d * .8]], 1.6, false), hullOf(plowed)));
    const stump = smC([[73, 48], [87, 48], [88, 62], [82, 64.5], [73, 63], [72, 56]], 2), stTop = circ(80, 48, 7.2, 14, 2.8);
    const fl = [[66, 76, 'red'], [80, 80, 'blue'], [92, 72, 'red'], [70, 66, 'blue'], [92, 62, 'blue']];
    // traktor oldalnézetben (jobbra halad): nagy hátsó és kis első kerék, motorház, fülke üveggel, kipufogó; mögötte az eke
    const hood = smC([[40, 44], [62, 44], [64, 48], [64, 58], [40, 58]], 1), cab = [[22, 22], [40, 22], [42, 26], [42, 52], [20, 52], [20, 26]];
    const glass = [[25, 26], [38, 26], [38, 40], [25, 40]], exh = bar([[52, 44], [52, 32]], 2.4);
    const plough = [bar([[8, 56], [20, 56]], 2.4), ...[5, 12].map(x => smC([[x, 56], [x + 5, 56], [x + 6, 62], [x + 2, 66], [x - 2, 64]], 1))];
    fin('halo_h_mezsgye_el', { hu:'a mezsgye felszántása', en:'tractor ploughing up a grassy field margin', look:'a small red tractor with a plough ploughing up a grassy flowery field margin with a cut tree-row stump on it, bare brown furrows behind the tractor, no text or brand', shapes:[
      ...tileS(T), pth('soil', 'base', [plowed]), dpth('soil', 'dark', furrows),
      ...['red', 'blue'].map(m => pth(m, 'base', fl.filter(f => f[2] === m).map(([x, y]) => circ(x, y, 3, 8)))),
      ...blob('wood', stump, [80, 56], { ld:2, dd:2.4, ed:0 }), pth('cardboard', 'light', [stTop]), dpth('wood', 'base', [circ(80, 48, 4, 10, 1.5), circ(80, 48, 1.4, 6, .6)]),
      pth('steel', 'base', plough),
      pth('dark', 'base', [exh, circ(30, 60, 13, 20), circ(58, 64, 8, 16)]), dpth('honey', 'base', [circ(30, 60, 5, 12), circ(58, 64, 3.2, 10)]),
      face('red', 'base', hood), face('red', 'base', cab), face('glass', 'light', glass),
      shineP(band([[27, 29], [31, 29]], 2), .8),
    ] });
  }

  // =====================================================================
  //  13. Csupasz, sokat forgatott talaj – mélyen felforgatott, kiszáradt, csupasz szántás-tömb 3/4-es nézetben: a tetején hátrafelé
  //      futó, vastag barázdabordák (az elején hullámos a perem), repedések az oldalán, rögök, egyetlen szál növény sincs;
  //      a bordák közül egy giliszta menekül át a peremen
  // =====================================================================
  {
    const P = cam({ az:24, el:36, F:70, fit:corners(-4, 4, -1.8, 0, -3.8, 3.8) }), k = P.k;
    const B = box(P, -4, 4, -1.8, 0, -3.8, 3.8), Q = quad(B.top), fq = quad(B.front);
    // kiszáradt, repedezett felszín: szabálytalan „táblák” (elcsúsztatott rács), köztük sötét repedések – a száraz, csupasz föld jele
    const NX = 4, NY = 3, jit = (i, j, n) => (i > 0 && i < n ? ((i * 7 + j * 13) % 5 - 2) * .035 : 0);
    const G = (i, j) => [i / NX + jit(i, j, NX), j / NY + jit(j, i, NY)];
    const plates = [];
    for(let i = 0; i < NX; i++) for(let j = 0; j < NY; j++){ const c4 = [G(i, j), G(i + 1, j), G(i + 1, j + 1), G(i, j + 1)], m = c4.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4], [0, 0]);
      plates.push(smC(c4.map(q => Q(lerp(m, q, .84))), 2, .3)); }
    const pc = p => p.reduce((a, q) => [a[0] + q[0] / p.length, a[1] + q[1] / p.length], [0, 0]);
    const clods = [[.3, .45, .55], [.72, .62, .5]].map(([s, t, r]) => { const g = Q([s, t]); return wobC(g[0], g[1] - .3 * k, r * k, r * k * .75, .12, 3, 1, 14); });
    const cracks = [[[.18, .05], [.24, .35], [.2, .6], [.26, .95]], [[.62, .05], [.58, .4], [.63, .75]]].map(p => band(p.map(fq), .13 * k, false));
    const worm = smO([Q([.5, .16]), Q([.51, .02]), fq([.47, .15]), fq([.5, .5]), fq([.46, .8])], 3);
    const rings = [.4, .6, .8].map(t => { const p = worm[Math.round(t * (worm.length - 1))]; return circ(p[0], p[1], .22 * k, 6, .09 * k, 0); });
    fin('halo_h_csupasz_talaj', { hu:'csupasz, sokat forgatott talaj', en:'bare, dry cracked soil', tilt:-3, look:'a block of bare dry soil in three-quarter view: the top is split into cracked dry plates with dark cracks between them and two big overturned clods, no plants at all, cracks on the side, a pink earthworm escaping over the front edge', shapes:[
      face('soil', 'base', B.front), face('soil', 'dark', B.right), det('soil', 'dark', qrect(B.front, 0, 1, .7, 1)),
      face('soil', 'line', B.top), pth('cardboard', 'base', plates), dpth('cardboard', 'dark', plates.map(p => crescent(p, pc(p), 45, 70, .18 * k))),
      dpth('soil', 'line', cracks, { o:.85 }),
      pth('soil', 'light', clods), dpth('soil', 'base', clods.map(c => crescent(c, pc(c), 45, 70, .2 * k))),
      pth('pink', 'base', [band(worm, .5 * k)]), dpth('pink', 'dark', rings), det('pink', 'light', band(worm.slice(1, -3).map(([x, y]) => [x - .1 * k, y]), .13 * k, false)),
      shineP(qrect(B.front, .04, .3, .2, .35), .4),
    ] });
  }

  // =====================================================================
  //  14. Csigaölő szer – a veteményes-ágyás szélén (deszkaszegély, föld, fiatal saláta) egy kupac KÉK szemcse; alulról egy kíváncsi
  //      sün orra szimatol feléjük (felirat, doboz, márka nincs)
  // =====================================================================
  {
    const soil = smC([[6, 50], [20, 32], [50, 27], [84, 30], [96, 42], [96, 52], [6, 58]], 2), board = [[2, 52], [98, 46], [98, 58], [2, 64]];
    const L = leafSet([[OVAL, 26, 44, -130, 22, .02, 2], [OVAL, 26, 44, -50, 22, .02, 2], [OVAL, 26, 44, -90, 25, .02, 2]]);
    const gp = [[56, 44], [60, 42], [64, 44.5], [58, 47], [62, 47.5], [66, 47], [54, 48.5], [68, 44], [60, 39.8], [64, 40.6], [70, 49], [50, 52], [74, 52], [46, 56]];
    const gran = gp.map(([x, y]) => circ(x, y, 2.1, 8, 1.8));
    const F = frame([98, 82], 12, .8);
    fin('halo_h_csigaolo', { hu:'csigaölő szer', en:'blue slug pellets at the edge of a vegetable bed', look:'a small heap of bright blue slug pellets on the soil at the wooden edge of a vegetable bed with a young lettuce, and a curious hedgehog nose sniffing towards them from below, no box, text or brand', shapes:[
      ...blob('soil', soil, [50, 44], { ld:2.4, dd:0, ed:0 }),
      pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade),
      face('wood', 'base', board), det('wood', 'dark', [[2, 61], [98, 55.4], [98, 58], [2, 64]]),
      pth('blue', 'light', gran), dpth('paper', 'light', gp.filter((_, i) => i % 2 === 0).map(([x, y]) => circ(x - .6, y - .6, .8, 6))),
      ...hedgehog(F, { head:true, lite:true }),
      shineP(band([[10, 57], [22, 55]], 1.4), .6),
    ] });
  }

  // kis poszméh (repül, oldalnézet balra) a helyreállító képekre: fekete szőrös test, sárga öv, fehér farok, füstös szárny
  const miniBee = (x, y, s = 1) => { const b = wobC(x, y, 8 * s, 6.4 * s, .05, 10, 0, 20), h = circ(x - 8.4 * s, y + 1, 3.6 * s, 10);
    const w = [circ(x - 1 * s, y - 7 * s, 5.6 * s, 10, 3 * s, -30), circ(x + 3 * s, y - 6 * s, 4.4 * s, 10, 2.4 * s, -10)];
    return [pth('steel', 'light', w, { o:.7 }), pth('dark', 'base', [b, h]), dpth('gold', 'base', [strip(b, x - 3.2 * s, x + .6 * s, 1)]), dpth('white', 'base', [strip(b, x + 4.2 * s, x + 12 * s, 1)])]; };

  // =====================================================================
  //  15. Permetezetlen tábla-szegély – a tó-/réti szigethez hasonló kerek földdarab: hátul aranyló búzafal, elöl a vegyszer nélkül
  //      hagyott szegélysáv piros pipaccsal és kék búzavirággal, benne egy pihés, csíkos fejű fogolycsibe
  // =====================================================================
  {
    const T = tile(50, 66, 47, 20, 9);
    const top = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96].map((x, i) => [x, 30 - 3 * Math.sin(i * 1.3) - (i % 2 ? 2.4 : 0)]);
    const wall = [[4, 62], ...top, [96, 62]], ears = top.filter((_, i) => i % 2).map(([x, y]) => circ(x, y + 2, 1.8, 6, 4.4, 8));
    const stalks = top.filter((_, i) => i % 3 === 0).map(([x, y]) => band([[x, y + 8], [x - 1, 58]], 1, false));
    const pop = [[16, 60], [34, 54], [80, 58], [62, 52]], cf = [[26, 66], [70, 66], [88, 62], [46, 50]];
    const st = [...pop, ...cf].map(([x, y]) => band([[x, y], [x + 1, y + 12]], 1.2, false));
    const { star } = ART.geo, cfl = cf.map(([x, y]) => star(x, y, 4.4, 2.6, 6));
    const chick = wobC(53, 74, 10.5, 9, .04, 9, 0, 20), ch = circ(42, 66, 6.4, 14);
    fin('halo_v_permetezetlen_szegely', { hu:'permetezetlen tábla-szegély', en:'unsprayed field margin with poppies, cornflowers and a partridge chick', look:'a round piece of field in three-quarter view: golden wheat at the back, and in front an unsprayed margin strip of red poppies and blue cornflowers with a fluffy striped partridge chick in it', shapes:[
      ...tileS(T),
      ...blob('gold', wall, [50, 44], { ld:3, dd:4, ed:0 }), dpth('gold', 'light', ears),
      pth('leaf', 'base', st),
      pth('red', 'base', pop.map(([x, y]) => circ(x, y, 4.6, 9, 4))), dpth('dark', 'base', pop.map(([x, y]) => circ(x, y, 1.4, 6))),
      pth('blue', 'base', cfl),
      ...blob('cardboard', chick, [52, 74], { ld:2.4, dd:2.6, ed:0, bt:'light', lt:'light', lm:'cream', dm:'cardboard' }),
      pth('cardboard', 'light', [ch]), dpth('chocolate', 'base', [band([[37, 64.5], [46, 63]], 1.6, false), band([[56, 68], [62, 71]], 1.8, false), band([[50, 70], [56, 73]], 1.4, false)]),
      pth('orange', 'dark', [[[37.4, 66.6], [33, 68.4], [37.4, 69.6]]]), det('dark', 'base', circ(40.6, 66.4, 1.2, 8)),
      shineP(band([[12, 40], [16, 36]], 1.6), .6),
    ] });
  }

  // =====================================================================
  //  16. Visszaállított mezsgye – két tábla között (balra barázdás szántás, jobbra aranyló gabona) széles füves sáv virágokkal és
  //      fiatal, karóhoz kötött fasorral; fölötte egy poszméh
  // =====================================================================
  {
    const P = cam({ az:24, el:36, F:70, fit:[...corners(-4.2, 4.2, -.9, 0, -3.8, 3.8), [0, 4.6, 0]] }), k = P.k;
    const B = box(P, -4.2, 4.2, -.9, 0, -3.8, 3.8), Q = quad(B.top), s1 = .36, s2 = .64;
    const fur = [.08, .18, .28].map(s => band([Q([s, .03]), Q([s, .97])], .16 * k, false)), crop = [.72, .82, .92].map(s => band([Q([s, .03]), Q([s, .97])], .16 * k, false));
    const trees = [.18, .52, .86].map(t => { const g = Q([.5, t]), h = 2 * k; return { trunk:band([g, [g[0], g[1] - h * .8]], .16 * k, false), crown:circ(g[0], g[1] - h, .8 * k, 14, .75 * k), c:[g[0], g[1] - h] }; });
    const fl = [[.42, .08, 'red'], [.58, .3, 'paper'], [.44, .4, 'purple'], [.6, .66, 'red'], [.42, .72, 'paper'], [.56, .96, 'purple']].map(([s, t, m]) => { const g = Q([s, t]); return { m, c:[g[0], g[1] - .2 * k] }; });
    fin('halo_v_mezsgye_vissza', { hu:'visszaállított mezsgye', en:'restored grassy field margin with flowers and young trees', tilt:-3, look:'a block of farmland in three-quarter view: ploughed furrows on the left, golden cereal on the right and between them a broad grassy margin with wildflowers and a row of young staked trees, a bumblebee flying above', shapes:[
      face('soil', 'base', B.front), face('soil', 'dark', B.right),
      face('soil', 'light', qrect(B.top, 0, s1, 0, 1)), dpth('soil', 'base', fur),
      face('gold', 'light', qrect(B.top, s2, 1, 0, 1)), dpth('gold', 'dark', crop, { o:.8 }),
      face('grass', 'base', qrect(B.top, s1, s2, 0, 1)),
      ...['red', 'paper', 'purple'].map(m => dpth(m, 'base', fl.filter(f => f.m === m).map(f => circ(f.c[0], f.c[1], .24 * k, 8)))),
      pth('wood', 'dark', trees.map(t => t.trunk)),
      pth('leaf', 'base', trees.map(t => t.crown)), dpth('grass', 'base', trees.map(t => crescent(t.crown, t.c, -135, 70, .34 * k))),
      ...miniBee(76, 12, .85),
      shineP(qrect(B.front, .05, .35, .3, .5), .45),
    ] });
  }

  // =====================================================================
  //  17. Talajtakarás – szalmával és lehullott lombbal betakart veteményes-ágyás (földdarab 3/4-es nézetben), két fiatal
  //      zöldség kilátszik a takarásból, elöl a takarás alól egy giliszta kukucskál ki
  // =====================================================================
  {
    const P = cam({ az:22, el:34, F:70, fit:[...corners(-4, 4, -1.4, 0, -3.4, 3.4), [0, 2.6, 0]] }), k = P.k;
    const B = box(P, -4, 4, -1.4, 0, -3.4, 3.4), Q = quad(B.top), H = hullOf(B.top);
    const straw = [];
    for(let i = 0; i < 44; i++){ const s = .04 + ((i * 37) % 93) / 100, t = .04 + ((i * 53) % 93) / 100, a = (i * 67) % 180, g = Q([s, t]), l = .7 * k;
      straw.push(clip(band([[g[0] - l * cos(a), g[1] - l * sin(a) * .6], [g[0] + l * cos(a), g[1] + l * sin(a) * .6]], .22 * k, false), H)); }
    const lv = [[.25, .3, 'orange', 20], [.7, .22, 'wood', -30], [.55, .75, 'orange', 60], [.2, .8, 'leaf', -10]].map(([s, t, m, a]) => { const g = Q([s, t]); return { m, p:leafFull(OVAL, g[0] - .5 * k * cos(a), g[1] - .5 * k * sin(a), a, 1.1 * k, 0, 2) }; });
    const plant = (s, t) => { const g = Q([s, t]); return [-135, -90, -45].map(a => leafFull(OVAL, g[0], g[1], a, 1.9 * k, .02, 2)); };
    const pl = [...plant(.3, .55), ...plant(.72, .5)];
    const wg = Q([.55, .06]), worm = smO([[wg[0] - .3 * k, wg[1] + .1 * k], [wg[0] - .1 * k, wg[1] - .6 * k], [wg[0] + .5 * k, wg[1] - .9 * k]], 3);
    fin('halo_v_talajtakaras', { hu:'talajtakarás', en:'vegetable bed mulched with straw and leaves', tilt:-3, look:'a block of vegetable bed in three-quarter view covered with a layer of golden straw and fallen autumn leaves, two young vegetable plants growing through the mulch and a pink earthworm peeking out at the front edge', shapes:[
      face('soil', 'base', B.front), face('soil', 'dark', B.right),
      face('gold', 'light', B.top), dpth('gold', 'base', straw.filter((_, i) => i % 2)), dpth('gold', 'dark', straw.filter((_, i) => !(i % 2))),
      ...['orange', 'wood', 'leaf'].map(m => pth(m, 'base', lv.filter(l => l.m === m).map(l => l.p))),
      pth('grass', 'base', pl), dpth('leaf', 'base', pl.map(p => p.slice(0, Math.ceil(p.length / 2)))),
      pth('pink', 'base', [band(worm, .55 * k)]), det('dark', 'base', circ(worm[worm.length - 1][0] - .1 * k, worm[worm.length - 1][1] - .02 * k, .07 * k, 6)),
      shineP(qrect(B.front, .05, .35, .25, .45), .45),
    ] });
  }

  // =====================================================================
  //  18. Sünbarát kert – deszkakerítés, az alján kivágott kis, íves átjáróval; az átjáróból egy sün jön ki a kertbe, a kerítés
  //      előtt, jobbra rőzse- és lombkupac (búvóhely), alul fű
  // =====================================================================
  {
    const planks = [0, 1, 2, 3].map(i => { const x = 6 + 15 * i; return [[x, 22 + (i % 2) * 2], [x + 7, 16 + (i % 2) * 2], [x + 14, 22 + (i % 2) * 2], [x + 14, 80], [x, 80]]; });
    const rails = [[[4, 32], [66, 32], [66, 37], [4, 37]], [[4, 64], [66, 64], [66, 69], [4, 69]]];
    const hole = [[24, 80], [24, 70], [26, 65], [31, 63], [37, 63], [42, 65], [44, 70], [44, 80]];
    const pile = smC([[54, 88], [58, 70], [66, 58], [78, 52], [90, 56], [98, 70], [98, 88]], 3);
    const twigs = [[[56, 76], [96, 62]], [[60, 66], [92, 80]], [[66, 58], [88, 86]], [[76, 52], [94, 72]], [[58, 84], [86, 60]]].map(p => bar(p, 1.8));
    const lvs = [[70, 64, 'orange', 20], [84, 70, 'leaf', -40], [90, 60, 'orange', 130], [64, 78, 'leaf', 60]].map(([x, y, m, a]) => ({ m, p:leafFull(OVAL, x, y, a, 9, 0, 2) }));
    const grass = band([[2, 88], [98, 88]], 5), F0 = frame([54, 76], 0, .5), F = ([u, v]) => F0([-u, v]);
    fin('halo_v_sunbarat_kert', { hu:'sünbarát kert', en:'hedgehog gap in a garden fence', look:'a wooden board fence with a small arched gap cut into its bottom, a hedgehog coming through it into the garden, a brush and leaf pile as a shelter on the right, grass at the bottom', shapes:[
      pth('grass', 'base', [grass]),
      pth('wood', 'base', planks), dpth('wood', 'light', planks.map(p => [[p[0][0] + 1.2, p[0][1] + 1], [p[0][0] + 3.6, p[0][1] - 1], [p[0][0] + 3.6, 79], [p[0][0] + 1.2, 79]])),
      pth('wood', 'dark', rails),
      face('dark', 'base', hole),
      ...blob('wood', pile, [78, 72], { ld:3, dd:0, ed:0, bt:'dark', lt:'base' }), pth('wood', 'base', twigs),
      ...['orange', 'leaf'].map(m => pth(m, 'base', lvs.filter(l => l.m === m).map(l => l.p))),
      ...hedgehog(F, { lite:true }),
    ] });
  }

  // =====================================================================
  //  19. Beporzóbarát veteményes – fa magaságyás: bal szélén tök nagy levéllel és sárga virággal, középen zsálya lila
  //      virágfüzérekkel, jobbra narancs körömvirágok; fölöttük egy poszméh
  // =====================================================================
  {
    const P = cam({ az:24, el:26, F:70, fit:corners(-4.2, 4.2, -1.8, 0, -2.4, 2.4) }), k = P.k;
    const B = box(P, -4.2, 4.2, -1.8, 0, -2.4, 2.4), Q = quad(B.top);
    const planks = [.33, .66].map(t => band([lerp(B.front[0], B.front[3], t), lerp(B.front[1], B.front[2], t)], .12 * k, false));
    const sq = Q([.14, .5]), LB = [[0, 0], [.1, .3], [.3, .42], [.42, .3], [.55, .44], [.72, .34], [.8, .16], [1, 0]], sqL = leafSet([[LB, sq[0], sq[1], -110, 3 * k, .03, 2]]);
    const { star } = ART.geo, fc = [sq[0] + .5 * k, sq[1] - 1.9 * k], fl = smC(star(fc[0], fc[1], 1.3 * k, .8 * k, 5), 2);
    const sg = Q([.48, .5]), spikes = [-110, -90, -70].flatMap(a => { const e = [sg[0] + 3.4 * k * cos(a), sg[1] + 3.4 * k * sin(a)]; return [.36, .48, .6, .72, .84, .96].map((t, i) => circ(...lerp(sg, e, t), (.26 - .025 * i) * k, 6, (.17 - .015 * i) * k)); });
    const spk = [-110, -90, -70].map(a => taper([lerp(sg, [sg[0] + 3.4 * k * cos(a), sg[1] + 3.4 * k * sin(a)], .32), [sg[0] + 3.55 * k * cos(a), sg[1] + 3.55 * k * sin(a)]], .44 * k, .22 * k));
    const sgL = [...[-150, -30, -125, -55].map(a => leafFull(OVAL, sg[0], sg[1], a, 1.5 * k, 0, 2)), ...[-110, -90, -70].map(a => band([sg, [sg[0] + 3.3 * k * cos(a), sg[1] + 3.3 * k * sin(a)]], .1 * k, false))];
    const mg = [Q([.76, .35]), Q([.88, .7])].map(([x, y], i) => [x, y - (1.2 + i * .2) * k]), mgL = [Q([.8, .5])].flatMap(([x, y]) => [-150, -30, -100, -70].map(a => leafFull(OVAL, x, y, a, 1.4 * k, 0, 2)));
    fin('halo_v_beporzo_kert', { hu:'beporzóbarát veteményes', en:'pollinator-friendly vegetable bed with sage and marigold', tilt:-3, look:'a wooden raised vegetable bed in three-quarter view: a squash with a big lobed leaf and a yellow squash flower on the left, sage with purple flower spikes in the middle and orange marigolds on the right, a bumblebee flying above', shapes:[
      face('wood', 'base', B.front), face('wood', 'dark', B.right), dpth('wood', 'dark', planks), face('soil', 'base', B.top),
      pth('leaf', 'base', sqL.lit), pth('leaf', 'dark', sqL.shade),
      pth('sage', 'dark', sgL), pth('purple', 'dark', spk), dpth('purple', 'light', spikes),
      pth('grass', 'base', mgL),
      pth('orange', 'base', mg.map(([x, y]) => wobC(x, y, .75 * k, .66 * k, .1, 9, 0, 22))), dpth('honey', 'base', mg.map(([x, y]) => circ(x - .1 * k, y - .1 * k, .3 * k, 8))),
      pth('honey', 'base', [fl]), det('gold', 'dark', circ(fc[0], fc[1], .45 * k, 10)), det('orange', 'base', circ(fc[0], fc[1], .2 * k, 8)),
      ...miniBee(58, 10, 1),
      shineP(qrect(B.front, .05, .3, .1, .25), .45),
    ] });
  }
})();
