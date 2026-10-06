// ============================================================
//  Matricák — „Élő lánc” (táplálékháló), 2. fejezet: KERTI TÓ – B szinten (docs/rajzolas.md, docs/halo-kutatas-to.md, docs/halo-to.json)
//  23 matrica: 14 faj (alga, hínár, nőszirom, vízibolha, tányércsiga, szúnyoglárva, víziászka, szitakötő, hanyattúszó, csíkbogár,
//  pettyes gőte, barna varangy, levelibéka, vízisikló), 4 emberi hatás (halak, bemosódás, feltöltés, özönnövény) és
//  5 helyreállító lépés (halmentes tó, növénysáv, új tó lankás parttal, hazai vízinövény, kő- és farakás).
//  A segédek az art-halo.js másolatai (így ez a fájl is önálló). A játékban hatszögben, ~44–52 px-en jelennek meg (artIcon('halo_…'))
//  → nagy, egyszerű sziluett, kevés, de jellegzetes részlet. A vizes matricák egymástól a víz formájával különböznek:
//  alga = kerek csepp · hínár = csúcsos csepp · szúnyog = vízoszlop felszínnel · hanyattúszó = széles vízsáv felszínnel ·
//  a tavas hatás- és helyreállító képek = 3/4-es nézetű tó-ellipszis, mindegyiken más uralkodó elem (hal, zsák, földkupac, rozetták …).
//  A meglévő halo_poszmeh és halo_giliszta a tavas fejezetben is szerepel – itt nincsenek újrarajzolva.
//  Nincs szöveg, szám, márka, jelkép. Render: node tools/art-render.js 2d web/js/art/art-halo-to.js ki.png --skip halo
//  Emoji-álnév nincs (a játék névvel kéri).
// ============================================================
ART.later('halo-to', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
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

  // =====================================================================
  //  1. Algák – egy kerek vízcsepp (nagyító alatti „tócsa”), benne kusza, élénkzöld FONALAS algák és néhány lebegő zöld pötty
  // =====================================================================
  {
    const c = [50, 50], drop = wobC(50, 50, 40, 36, .025, 5, .6, 36), H = hullOf(drop);
    // fonalak: hullámos szálak átlósan a cseppen át, a csepp burkára vágva (alul sötét, fölötte eltolt világos csík)
    // [x0, x1, y, amplitúdó, frekvencia, fázis, dőlés-szög] – a szálak több irányban keresztezik egymást (kusza „vatta”)
    const strands = [[8, 92, 58, 5, .2, 0, -22], [8, 92, 44, 6, .17, 2, -8], [8, 92, 66, 4, .26, 1, 14], [8, 92, 36, 5, .22, 3, 30], [8, 92, 50, 5, .3, 4.5, 58], [8, 92, 52, 4, .24, 1.2, -50]];
    const sp = strands.map(([x0, x1, y, A, f, ph, rot]) => wave(x0, x1, y, A, f, ph, 20).map(([x, yy]) => [50 + (x - 50) * cos(rot) - (yy - 50) * sin(rot), 50 + (x - 50) * sin(rot) + (yy - 50) * cos(rot)]));
    const dk = sp.map(p => clip(band(p, 3, false), H)), lt = sp.map(p => clip(band(p.map(([x, y]) => [x - .5, y - .7]), 1.3, false), H));
    const dots = [[34, 30, 3.4], [64, 26, 2.8], [72, 68, 3.6], [30, 70, 2.6], [52, 80, 2.4], [80, 44, 2.4]];
    fin('halo_alga', { hu:'algák', en:'pond algae', look:'a round drop of pond water with tangled bright green filamentous algae strands and a few floating green algae dots', shapes:[
      ...blob('water', drop, c, { ld:5, dd:4.4, ed:1.8 }),
      dpth('leaf', 'dark', dk), dpth('leaf', 'light', lt),
      pth('leaf', 'light', dots.map(([x, y, r]) => circ(x, y, r, 10))), dpth('paper', 'light', dots.map(([x, y, r]) => circ(x - r * .35, y - r * .35, r * .35, 6)), { o:.85 }),
      shineP(band([[22, 36], [30, 24], [40, 17]], 2.4), .75),
    ] });
  }

  // =====================================================================
  //  2. Hínár (érdes tócsagaz / fodros békaszőlő) – csúcsos vízcseppben: alul iszap, belőle két sötétzöld szár ÖRVÖS, villásan
  //     elágazó, tűszerű levelekkel (üvegmosó-kefe sziluett), néhány oxigénbuborék
  // =====================================================================
  {
    const drop = smC([[50, 4], [60, 22], [76, 46], [82, 66], [72, 86], [50, 94], [28, 86], [18, 66], [24, 46], [40, 22]], 4), H = hullOf(drop), c = [50, 64];
    const mud = clip(smC([[10, 84], [30, 78], [52, 81], [74, 77], [92, 84], [92, 100], [10, 100]], 3), H);
    const stems = [smO([[42, 86], [38, 66], [42, 46], [38, 26]], 4), smO([[60, 86], [64, 68], [60, 52], [63, 38]], 4)];
    // örv: a szár egy pontján 3–3 levél jobbra-balra, felfelé hajolva, a végükön villásan kettéágazva
    const whorl = ([x, y], s = 1) => [-1, 1].flatMap(sd => [[-32, 8.5], [8, 9.5], [44, 7.5]].map(([a, L]) => {
      const d = sd < 0 ? 180 - a : a, L2 = L * s, m = [x + L2 * .62 * cos(d), y + L2 * .62 * sin(d) - 2], e1 = [x + L2 * cos(d - 14 * sd), y + L2 * sin(d - 14 * sd) - 3.2], e2 = [x + L2 * cos(d + 12 * sd), y + L2 * sin(d + 12 * sd) - 2];
      return [bar([[x, y], m, e1], 1.25), bar([m, e2], 1.1)]; })).flat();
    const at = (sp, t) => sp[Math.round(t * (sp.length - 1))];
    const W = [...[.12, .38, .64, .9].map((t, i) => whorl(at(stems[0], t), 1 - i * .1)), ...[.18, .46, .78].map((t, i) => whorl(at(stems[1], t), .9 - i * .1))].flat();
    const bub = [[30, 40, 2.2], [56, 18, 1.8], [70, 58, 2], [50, 30, 1.4]];
    fin('halo_hinar', { hu:'hínárnövények', en:'submerged pond weed', look:'a pointed water drop with two dark green underwater hornwort stems rising from the mud, with whorls of finely forked needle-like leaves like bottle brushes, and a few oxygen bubbles', shapes:[
      ...blob('water', drop, c, { ld:5, dd:4.4, ed:1.8, bt:'light', lm:'paper', dm:'water' }),
      det('soil', 'base', mud), det('soil', 'dark', clip(smC([[10, 90], [40, 87], [70, 89], [92, 88], [92, 100], [10, 100]], 2), H)),
      dpth('leaf', 'dark', [...stems.map(s => band(s, 2.2, false)), ...W]),
      dpth('leaf', 'base', stems.map(s => band(s.map(([x, y]) => [x - .6, y]), .8, false))),
      pth('paper', 'light', bub.map(([x, y, r]) => circ(x, y, r, 10)), { d:true, line:false, o:.9 }),
      shineP(band([[32, 44], [38, 30], [45, 18]], 2.4), .75),
    ] });
  }

  // =====================================================================
  //  3. Mocsári nőszirom (Iris pseudacorus) – kardszerű, egyenes, hosszú levelek legyezőben; fölöttük élénksárga virág: három
  //     LEKONYULÓ külső lepel (a tövükön barna erezet), három kisebb, felálló belső lepel, a közepén a bibeágak
  // =====================================================================
  {
    const SW = [[0, 0], [.08, .06], [.45, .075], [.82, .05], [1, 0]];
    const L = leafSet([[SW, 44, 96, -104, 78], [SW, 50, 96, -84, 70], [SW, 40, 96, -124, 62], [SW, 54, 96, -66, 60], [SW, 46, 96, -94, 50]]);
    const stem = tube(smO([[48, 96], [52, 60], [56, 34]], 3), 3.2);
    const FALL = [[0, 0], [.18, .16], [.5, .34], [.82, .3], [1, 0]], ST = [[0, 0], [.2, .12], [.6, .2], [.9, .12], [1, 0]];
    const fc = [57, 28];
    const falls = [[156, 27], [26, 27], [98, 20]].map(([d, l]) => leafFull(FALL, fc[0], fc[1], d, l));
    const stds = [[-116, 20], [-64, 20], [-90, 15]].map(([d, l]) => leafFull(ST, fc[0], fc[1] - 1, d, l));
    const veins = [[156, 27], [26, 27], [98, 20]].flatMap(([d, l]) => [-12, 0, 12].map(o => bar([[fc[0] + l * .2 * cos(d + o), fc[1] + l * .2 * sin(d + o)], [fc[0] + l * .56 * cos(d + o * .6), fc[1] + l * .56 * sin(d + o * .6)]], .9)));
    const style = [[140, 14], [40, 14], [95, 11]].map(([d, l]) => leafFull([[0, 0], [.3, .14], [.8, .14], [1, 0]], fc[0], fc[1] - 1, d, l));
    fin('halo_noszirom', { hu:'mocsári nőszirom', en:'yellow flag iris', look:'yellow flag iris: a fan of tall straight sword-shaped green leaves and a bright yellow iris flower with three broad drooping falls with brown veins at the base, three small upright standards and yellow style arms', shapes:[
      pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep), pth('grass', 'base', L.lit),
      ...stemS(stem),
      pth('honey', 'light', stds), det('honey', 'dark', stds[2]),
      pth('honey', 'base', falls), dpth('gold', 'dark', falls.map(f => crescent(f, fc, 60, 60, 3))),
      dpth('chocolate', 'light', veins),
      pth('gold', 'base', style),
      shineP(band([[40, 32], [46, 29]], 1.8), .8),
    ] });
  }

  // =====================================================================
  //  4. Vízibolha (Daphnia) – „nagyító alatt”, oldalnézet: áttetsző, kerekded, bab alakú páncél, a fején EGYETLEN nagy fekete
  //     szem, a fejből felfelé ágazó, kétágú, sertés evezőcsáp, a testben zöld bél (algát evett), a hátán néhány pete,
  //     hátul a farktüske
  // =====================================================================
  {
    // „nagyító alatt”, felálló póz: áttetsző bab-páncél, a fejben EGY nagy fekete szem, a fej mögül két nagy, ágas, sertés
    // evezőcsáp FELEMELVE (mint két kar), bent zöld bél és sárga peték, hátul-lent farktüske; körben buborékok és hullámvonalak = víz
    const body = smC([[26, 44], [34, 34], [46, 33], [58, 38], [70, 46], [76, 60], [72, 76], [60, 86], [46, 88], [36, 80], [32, 68], [26, 62], [19, 60], [18, 52]], 4), c = [52, 62];
    const spine = taper(smO([[66, 82], [74, 88], [82, 92]], 2), 3.4, .6);
    // evezőcsáp: vastag nyél a fej tetejéről, majd két ág; mindegyik ág végén legyező-sertek (a sziluett része, így a vászonra illesztés számol velük)
    const arm = (base, mid, ends) => ({ stem:taper(smO([base, mid], 2), 5, 3.6), br:ends.map(e => taper(smO([mid, lerp(mid, e, .5).map((v, i) => v + (i ? -2 : 0)), e], 2), 3.4, 1.6)),
      set:ends.flatMap(e => { const d = Math.atan2(e[1] - mid[1], e[0] - mid[0]) * 180 / Math.PI; return [-38, 0, 38].map(k => bar([e, [e[0] + 6.5 * cos(d + k), e[1] + 6.5 * sin(d + k)]], 1.5)); }) });
    const A = [arm([33, 36], [26, 22], [[10, 14], [18, 5]]), arm([38, 34], [48, 20], [[58, 6], [68, 14]])];
    const legs = [[46, 64], [51, 69], [56, 74]].map(([x, y]) => bar([[x, y], [x - 6, y + 5]], 1.3));
    const gut = band(smO([[32, 50], [44, 56], [56, 62], [64, 72], [66, 80]], 3), 5);
    const eggs = [[54, 46], [62, 48], [68, 55], [60, 55]].map(([x, y]) => circ(x, y, 3.3, 10));
    const bub = [[80, 30, 3.6], [86, 19, 2.4], [16, 76, 2.8], [78, 42, 1.7]];
    const rip = [wave(78, 94, 64, 1.6, .6), wave(12, 28, 90, 1.6, .6, 1.4), wave(80, 93, 74, 1.4, .65, .8)].map(p => band(p, 1.5, false));
    fin('halo_vizibolha', { hu:'vízibolhák', en:'water flea (Daphnia)', look:'an enlarged cute water flea (Daphnia) swimming in water: translucent pale blue bean-shaped body, one big black eye in the head, two big branched feathery antennae raised like arms, a green gut and yellow eggs inside, a thin tail spine, water bubbles and ripple lines around', shapes:[
      pth('water', 'base', rip),
      pth('water', 'light', bub.map(([x, y, r]) => circ(x, y, r, 10))), dpth('paper', 'light', bub.map(([x, y, r]) => circ(x - r * .3, y - r * .3, r * .35, 6))),
      pth('glass', 'dark', [...A.flatMap(a => [a.stem, ...a.br, ...a.set]), spine]),
      ...blob('glass', body, c, { ld:5, dd:4.4, ed:1.6, lm:'paper' }),
      dpth('glass', 'dark', legs, { o:.8 }), det('leaf', 'base', gut), det('grass', 'light', band(smO([[35, 50], [46, 55], [56, 60]], 3), 1.5)),
      pth('honey', 'base', eggs, { d:true }),
      det('dark', 'base', circ(29, 46.5, 5.6, 14)), det('paper', 'light', circ(27.2, 44.7, 1.9, 8)),
      shineP(band([[40, 38], [52, 38], [62, 43]], 2), .85),
    ] });
  }

  // =====================================================================
  //  5. Nagy tányércsiga (Planorbarius corneus) – LAPOS, síkban feltekeredett, sötét vörösesbarna ház (a lapjával felénk, jól
  //     látszó spirál), alatta a sötét, csúszó talp, elöl a fej két hosszú, vékony tapogatóval
  // =====================================================================
  {
    // LAPOS korong-ház oldalról (nem kerti csiga!): síkban feltekert, sok, EGYFORMA vastag kanyarulat, mint egy kos szarva /
    // feltekert kötél; a jobb oldalon látszik a korong vastagsága (pereme), közepén besüppedt köldök. Alatta a sötét test,
    // elöl két hosszú, vékony tapogató (a tövükben a szem); fent hullámzó vízfelszín, a csigától buborékok szállnak fel = vízben él.
    const c = [58, 50], R = 27;
    const shell = circ(c[0], c[1], R, 28, R * 1.02), rim = circ(c[0] + 5, c[1] + 1, R - .5, 24, R * .98);
    // a varrat-spirál (a kanyarulatok határa): a peremről indul (bal-lent, a száj felől), 3 fordulat, egyenletesen csökkenő sugár → egyforma széles „kötél”-kanyarulatok
    const spi = (r0, off = 0) => Array.from({ length:54 }, (_, i) => { const t = i / 53, a = 140 + 1080 * t, r = r0 - (r0 - 2.5) * t; return [c[0] + (r - off) * cos(a), c[1] + (r - off) * sin(a)]; });
    const sut = spi(R - .3), hl = spi(R - .3, 3.6).slice(4, 44);
    const foot = smC([[8, 84], [16, 76], [30, 74], [60, 75], [84, 77], [92, 83], [72, 87], [30, 87], [12, 88]], 3);
    const head = smC([[10, 80], [12, 70], [20, 64], [30, 66], [34, 76]], 3);
    const tent = [taper(smO([[15, 67], [8, 58], [2, 52]], 2), 2, .9), taper(smO([[21, 65], [18, 54], [18, 44]], 2), 2, .9)];
    const bub = [[20, 34, 3], [14, 22, 2.2], [22, 13, 1.6]];
    const surf = band(wave(8, 92, 10, 1.8, .22), 2.2, false);
    fin('halo_tanyercsiga', { hu:'nagy tányércsiga', en:'great ramshorn snail', look:'great ramshorn snail under water: a flat disc-shaped dark red-brown shell seen from the side, coiled flat like a ram\'s horn with many even whorls and a visible disc edge, the dark snail body gliding under it with two long thin tentacles, a wavy water surface line and rising bubbles', shapes:[
      pth('water', 'base', [surf]),
      pth('dark', 'base', [foot, head, ...tent]), det('dark', 'light', clip(smC([[10, 74], [90, 74], [90, 79], [10, 79]], 1), hullOf(foot))),
      det('dark', 'dark', circ(18, 66, 1.4, 8)), det('dark', 'dark', circ(22.5, 64.5, 1.4, 8)),
      pth('chocolate', 'dark', [rim]),
      ...blob('chocolate', shell, c, { ld:4, dd:3.6, ed:1.6, lm:'chocolate', dm:'chocolate' }),
      dpth('chocolate', 'light', [band(hl, 2.2, false)]),
      dpth('chocolate', 'dark', [band(sut, 2.2, false)]),
      det('chocolate', 'line', circ(c[0], c[1], 3.2, 10)),
      pth('water', 'light', bub.map(([x, y, r]) => circ(x, y, r, 10)), { d:true }), dpth('paper', 'light', bub.map(([x, y, r]) => circ(x - r * .3, y - r * .3, r * .35, 6))),
      shineP(band([[36, 38], [42, 30], [50, 26]], 2), .7),
    ] });
  }

  // =====================================================================
  //  6. Csípőszúnyog-lárvák – vízoszlop (felül a felszín ellipszise), a felszínről a légzőcsövükkel lógó KÉT vessző alakú lárva:
  //     fent a légzőcső, hosszú szelvényes potroh, lent vastag tor és kis fej sertékkel (nem a csípős felnőtt szúnyog!)
  // =====================================================================
  {
    const col = smC([[12, 22], [30, 16], [50, 15], [70, 16], [88, 22], [88, 80], [80, 92], [50, 96], [20, 92], [12, 80]], 3), c = [50, 56];
    const surf = circ(50, 22, 38, 24, 7);
    // lárva: s = a légzőcső vége a felszínen, a gerinc lefelé kanyarog
    const larva = (sx, sy, dx, sw) => { const sp = smO([[sx, sy], [sx + dx * .3, sy + 10], [sx + dx * .1 + sw, sy + 24], [sx + dx * .6 - sw * .4, sy + 38], [sx + dx, sy + 48]], 4), n = sp.length, P = t => sp[Math.round(t * (n - 1))];
      const abd = band(sp.slice(0, Math.round(n * .8)), t => 2.2 + 2.4 * t, false), q = P(.9), r = P(.7), th = circ(q[0], q[1], 7.4, 16, 5.6, Math.atan2(q[1] - r[1], q[0] - r[0]) * 180 / Math.PI);
      const segs = [.3, .42, .54, .66].map(t => { const i = Math.round(t * (n - 1)), a = sp[i - 1], b = sp[i + 1], l = hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l, w = 2 + 2.4 * t;
        return band([[sp[i][0] + nx * w, sp[i][1] + ny * w], [sp[i][0] - nx * w, sp[i][1] - ny * w]], .8, false); });
      const hair = [.36, .56, .76].flatMap(t => { const [x, y] = P(t); return [bar([[x - 3, y], [x - 7, y - 1.5]], .6), bar([[x + 3, y], [x + 7, y - 1.5]], .6)]; });
      const side = bar([P(.14), [P(.14)[0] + 6, P(.14)[1] + 3]], 2);
      return { sil:[abd, th, side], segs, hair, lit:crescent(th, q, -135, 70, 2.4), ring:circ(sx, sy, 5, 12, 1.6) }; };
    const A = larva(36, 22, -6, 5), B = larva(64, 23, 6, -4);
    fin('halo_szunyog', { hu:'csípőszúnyog-lárvák', en:'mosquito larvae', look:'a column of pond water with the surface at the top and two small wriggly comma-shaped mosquito larvae hanging head-down from the surface by their breathing tubes: segmented bodies with small hair tufts, a thicker thorax and a small head', shapes:[
      ...blob('water', col, c, { ld:0, dd:4.4, ed:1.8 }),
      face('water', 'light', surf), det('paper', 'light', circ(40, 20, 22, 18, 3.4), { o:.6 }),
      dpth('dark', 'light', [...A.hair, ...B.hair]),
      pth('dark', 'base', [...A.sil, ...B.sil]), dpth('dark', 'light', [...A.segs, ...B.segs, A.lit, B.lit]),
      dpth('paper', 'light', [A.ring, B.ring], { o:.9 }),
      shineP(band([[18, 40], [18, 56]], 2.4), .6),
    ] });
  }

  // saját koordináta → vászon: u előre (a fej felé), v oldalra; o = középpont, a = a fej iránya (fok)
  const frame = (o, a, s = 1) => ([u, v]) => [o[0] + s * (u * cos(a) - v * sin(a)), o[1] + s * (u * sin(a) + v * cos(a))];

  // =====================================================================
  //  7. Közönséges víziászka (Asellus aquaticus) – felülnézet egy víz alatti, félig lebomlott barna falevélen: lapos, szürkésbarna,
  //     szelvényes test, hét pár hosszú, pókszerű láb, KÉT HOSSZÚ csáp elöl, hátul a két villás farokfüggelék; a levélen lyukak
  // =====================================================================
  {
    const F = frame([50, 52], -58, 1.08);
    const leaf = leafFull([[0, 0], [.12, .2], [.45, .3], [.8, .2], [1, 0]], 20, 84, -40, 78), lc = [48, 58];
    const veins = [band([[22, 82], [78, 36]], 1.4, false), ...[[34, 72, -80], [48, 60, -84], [60, 50, -86], [38, 68, 10], [52, 56, 8], [64, 46, 6]].map(([x, y, a]) => band([[x, y], [x + 11 * cos(a), y + 11 * sin(a)]], .9, false))];
    const holes = [[34, 62, 3.4, 2.4], [66, 62, 2.6, 2], [58, 38, 2.2, 1.6]].map(([x, y, r, ry]) => wobC(x, y, r, ry, .12, 3, 0, 10));
    const body = smC([[-22, 0], [-20, -6.5], [-8, -9], [6, -9.5], [16, -8.4], [20, -5], [20, 5], [16, 8.4], [6, 9.5], [-8, 9], [-20, 6.5]].map(F), 3);
    const head = smC([[18, -5], [25, -4.5], [28, 0], [25, 4.5], [18, 5]].map(F), 2), c = F([0, 0]);
    const segs = [-13, -7, -1, 5, 11].map(u => band([F([u, -9.6]), F([u + 1, 0]), F([u, 9.6])], .9, false));
    const legs = [-14, -8, -2, 4, 9, 14, 18].flatMap((u, i) => [-1, 1].map(s => bar([F([u, 8 * s]), F([u + (i < 3 ? -4 : 4), 17 * s]), F([u + (i < 3 ? -10 : 8), 23 * s])], .9)));
    const ant = [-1, 1].map(s => bar(smO([F([26, 3 * s]), F([35, 8 * s]), F([44, 13 * s]), F([50, 22 * s])], 3), 1.1));
    const ant2 = [-1, 1].map(s => bar([F([27, 2 * s]), F([33, 5 * s])], 1));
    const uro = [-1, 1].flatMap(s => [bar([F([-19, 4 * s]), F([-26, 7 * s])], 1.6), bar([F([-26, 7 * s]), F([-32, 6 * s])], .9), bar([F([-26, 7 * s]), F([-31, 11 * s])], .9)]);
    fin('halo_viziaszka', { hu:'közönséges víziászka', en:'water hoglouse (Asellus)', look:'a water hoglouse (Asellus) seen from above on a decaying brown underwater leaf with holes: flat grey-brown segmented body, seven pairs of long spidery legs, two long antennae in front and two forked tail appendages behind', shapes:[
      ...blob('cardboard', leaf, lc, { ld:4, dd:4, ed:1.6 }), dpth('wood', 'dark', veins), dpth('water', 'base', holes),
      pth('steel', 'dark', [...legs, ...ant, ...ant2, ...uro]),
      pth('steel', 'dark', [body, head]), det('steel', 'base', crescent(body, c, -135, 70, 3.2)), det('dark', 'light', crescent(body, c, 45, 70, 2.6), { o:.8 }),
      dpth('dark', 'light', segs, { o:.75 }), dpth('steel', 'light', [[F([8, -3]), 1.4], [F([-6, 4]), 1.2], [F([0, -5]), 1]].map(([p, r]) => circ(p[0], p[1], r, 6)), { o:.8 }),
      dpth('dark', 'base', [-1, 1].map(s => circ(...F([22, 3 * s]), 1.3, 6))),
      shineP(band([F([-12, -5]), F([10, -6.5])], 1.8), .7),
    ] });
  }

  // =====================================================================
  //  8. Óriás-szitakötő (Anax imperator) – felülnézet: HOSSZÚ, egyenes, kék potroh fekete hátvonallal, zöld tor, nagy, összeérő
  //     zöld szemek, KÉT PÁR víztiszta szárny laposan, szélesen kiterítve (a fátyolka szárnya sátorszerű, ez vízszintes), szárnyjegy
  // =====================================================================
  {
    const T = -22, F = frame([50, 50], -90, 1);   // u felfelé = a fej iránya
    const wing = (u0, s, L, W, sw) => smC([[u0 + 2, 2 * s], [u0 + W * .6 + sw, 12 * s], [u0 + W * .5 + sw * 1.4, L * .55 * s], [u0 + W * .25 + sw * 1.5, L * s], [u0 - W * .2 + sw * 1.4, (L - 3) * s], [u0 - W * .35 + sw, L * .5 * s], [u0 - W * .3, 10 * s], [u0 - 2, 2 * s]].map(F), 3);
    const wF = [-1, 1].map(s => wing(22, s, 44, 12, 3)), wH = [-1, 1].map(s => wing(12, s, 42, 15, -3));
    const stig = [-1, 1].flatMap(s => [circ(...F([27.5, 40 * s]), 2, 8, 1.2, T), circ(...F([10.5, 38 * s]), 2, 8, 1.2, T)]);
    const veins = [-1, 1].flatMap(s => [bar([F([23, 3 * s]), F([28, 38 * s])], .8), bar([F([13, 3 * s]), F([11, 36 * s])], .8)]);
    const abd = smC([[10, -3.2], [4, -4], [-6, -3], [-30, -2.8], [-50, -2.6], [-56, -1.6], [-57, 0], [-56, 1.6], [-50, 2.6], [-30, 2.8], [-6, 3], [4, 4], [10, 3.2]].map(F), 3);
    const thor = smC([[26, -5], [28, 0], [26, 5], [16, 6.4], [8, 4.4], [8, -4.4], [16, -6.4]].map(F), 3);
    const eyes = [-1, 1].map(s => circ(...F([31, 3.6 * s]), 4.6, 12, 4.2));
    const stripe = band([F([4, 0]), F([-54, 0])], 1.4, false), rings = [-12, -22, -32, -42].map(u => band([F([u, -2.9]), F([u, 2.9])], .8, false));
    fin('halo_szitakoto', { hu:'óriás-szitakötő', en:'emperor dragonfly', tilt:T, look:'emperor dragonfly seen from above: a long straight bright blue abdomen with a black line along the top, a green thorax, big touching green eyes and two pairs of clear wings spread out flat and wide with fine veins and a small brown wing spot', shapes:[
      pth('glass', 'light', [...wH, ...wF], { o:.8 }), dpth('glass', 'dark', veins, { o:.8 }), dpth('wood', 'dark', stig),
      ...blob('water', abd, F([-24, 0]), { tilt:T, ld:1.6, dd:1.4, ed:0 }), dpth('dark', 'base', [stripe, ...rings]),
      ...blob('grass', thor, F([17, 0]), { tilt:T, ld:2.4, dd:2, ed:0, dm:'leaf' }), dpth('leaf', 'dark', [band([F([22, -3]), F([12, -4])], 1.2, false), band([F([22, 3]), F([12, 4])], 1.2, false)]),
      pth('teal', 'light', eyes), dpth('teal', 'base', eyes.map((e, i) => crescent(e, F([31, (i ? 1 : -1) * 3.6]), 45 - T, 70, 1.6))),
      shineP(band([F([30, -5.6]), F([33, -3])], 1.2), .9),
      shineP(band([F([22, -8]), F([27, -30])], 1.6), .7),
    ] });
  }

  // =====================================================================
  //  9. Hanyattúszó poloska (Notonecta) – széles vízsáv felszínnel, közvetlenül a felszín alatt HANYATT úszik: csónak alakú test,
  //     a hasa (sötét) felfelé, a világos, gerinces háta lefelé; hosszú, EVEZŐSZERŰ, szőrös hátsó láb, nagy vörös szem, a potroh
  //     végén a felszínhez tapadó ezüstös légbuborék
  // =====================================================================
  {
    // u a fej felé (balra, 18°-kal lefelé), v a HÁT felé (lefelé) – hanyatt fekszik, a hasa néz a felszín felé
    const o = [50, 50], k = 1.45, h = [-cos(18), sin(18)], bk = [sin(18), cos(18)], F = ([u, v]) => [o[0] + k * (u * h[0] + v * bk[0]), o[1] + k * (u * h[1] + v * bk[1])];
    const water = smC([[2, 34], [30, 31], [60, 33], [98, 31], [98, 84], [84, 94], [50, 97], [16, 94], [2, 84]], 3), c = [50, 64];
    const surf = band(wave(2, 98, 32, 1.2, .16, 0, 18), 3, false);
    const hull = smC([[-26, -1], [-18, -5], [0, -6], [16, -5], [24, -3], [27, 1], [22, 6], [8, 10], [-8, 10], [-20, 6]].map(F), 3);
    const belly = clip(smC([[-30, -9], [30, -9], [30, 1.8], [-30, 1.8]].map(F), 1), hullOf(hull));
    const keel = band([F([-20, 5.4]), F([0, 8.6]), F([18, 5.4])], 1.4, false);
    const oar = (r) => ({leg:taper(r.map(F), 4, 2.6), fr:Array.from({ length:6 }, (_, i) => { const t = .12 + i * .15, p = F(lerp(r[1], r[2], t)), q = F(lerp(r[1], r[2], t).map((x, j) => x + [-1.5, 4.5][j])); return bar([p, q], 1); }) });
    const o1 = oar([[-2, 3], [10, 16], [32, 22]]), o2 = oar([[0, 1], [16, 6], [38, 2]]);
    const fl = [bar([F([16, 4]), F([22, 11]), F([27, 13])], 1.8), bar([F([10, 5]), F([12, 12]), F([16, 15])], 1.8)];
    const eye = circ(...F([22.5, 1]), 6, 12, 5.4), air = circ(...F([-26.5, -2.4]), 4.4, 10, 3.4);
    fin('halo_hanyattuszo', { hu:'hanyattúszó poloska', en:'backswimmer (Notonecta)', look:'a band of pond water with the surface line on top and a backswimmer bug swimming upside down just under the surface: boat-shaped body with a dark belly facing up and a pale cream keeled back facing down, very long oar-like hairy hind legs, big red eyes and a silvery air bubble at the tail tip', shapes:[
      ...blob('water', water, c, { ld:0, dd:4.4, ed:1.8, bt:'light', dm:'water' }),
      det('paper', 'light', surf, { o:.9 }), det('water', 'base', clip(smC([[2, 78], [50, 74], [98, 78], [98, 100], [2, 100]], 1), hullOf(water)), { o:.5 }),
      pth('wood', 'dark', [o2.leg]), dpth('wood', 'dark', o2.fr),
      pth('cream', 'base', [hull]), det('dark', 'base', belly), det('cream', 'dark', keel), det('dark', 'light', crescent(belly, F([0, -3]), -100, 60, 1.6)),
      pth('wood', 'base', [o1.leg, ...fl]), dpth('wood', 'dark', o1.fr),
      face('red', 'base', eye), det('red', 'dark', crescent(eye, F([22.5, 1]), 45, 60, 1.6)), det('paper', 'light', circ(...F([23.5, -.6]), 1.6, 6)),
      pth('steel', 'light', [air]), det('paper', 'light', circ(...F([-27, -3.4]), 1.2, 6)),
      shineP(band([F([-12, 3.4]), F([10, 5.6])], 1.8), .7),
    ] });
  }

  // =====================================================================
  // 10. Csíkbogár (Dytiscus marginalis) – felülnézet: FÉNYES, sötét olívbarna ovális test, körben SÁRGA szegély (előtor és
  //     szárnyfedők széle), a hátsó pár lábon lapos, szőrös úszóevező oldalra kinyújtva, rövid elülső lábak, vékony csáp
  // =====================================================================
  {
    const T = -14, F = frame([50, 52], -90, 1);
    const ely = smC([[14, -15], [4, -17], [-14, -16.5], [-28, -12], [-35, 0], [-28, 12], [-14, 16.5], [4, 17], [14, 15]].map(F), 4);
    const pro = smC([[24, -11], [26, 0], [24, 11], [14, 16.4], [12, 0], [14, -16.4]].map(F), 3);
    const head = smC([[33, -6], [35, 0], [33, 6], [25, 8], [23, 0], [25, -8]].map(F), 2), c = F([-6, 0]);
    const rim = smC([[14, -16.6], [4, -18.8], [-14, -18.3], [-29.5, -13.4], [-37, 0], [-29.5, 13.4], [-14, 18.3], [4, 18.8], [14, 16.6], [25.6, 12], [27.8, 0], [25.6, -12]].map(F), 4);
    const hind = s => { const r = [F([-6, 12 * s]), F([-14, 26 * s]), F([-30, 36 * s])]; return { leg:taper(r, 3, 4.4), fr:Array.from({ length:5 }, (_, i) => { const p = lerp(r[1], r[2], .1 + i * .2); return bar([p, lerp(p, F([-24 - i * 3, 44 * s]), .28)], .9); }) }; };
    const H = [hind(-1), hind(1)];
    const legs = [-1, 1].flatMap(s => [bar([F([20, 12 * s]), F([28, 20 * s]), F([36, 22 * s])], 1.8), bar([F([6, 16 * s]), F([10, 26 * s]), F([4, 32 * s])], 1.8)]);
    const ant = [-1, 1].map(s => bar(smO([F([33, 4 * s]), F([40, 8 * s]), F([46, 13 * s])], 2), 1));
    fin('halo_csikbogar', { hu:'sárgaszegélyű csíkbogár', en:'great diving beetle', tilt:T, look:'great diving beetle seen from above: a smooth shiny dark olive-brown oval body with a bright yellow rim around the edge of the thorax and wing cases, flattened hairy paddle-like hind legs stretched out to the sides, short front legs and thin antennae', shapes:[
      pth('cardboard', 'dark', [...H.map(h => h.leg), ...legs, ...ant]), dpth('cardboard', 'light', H.flatMap(h => h.fr)),
      pth('gold', 'base', [rim]),
      ...blob('dark', ely, c, { tilt:T, ld:3.2, dd:0, ed:0 }), pth('dark', 'base', [pro]), det('dark', 'light', crescent(pro, F([18, 0]), -135 - T, 60, 2)),
      pth('gold', 'base', [head]), det('dark', 'base', clip(smC([[28, -9], [36, -9], [36, 9], [28, 9]].map(F), 1), hullOf(head))),
      dpth('dark', 'dark', [band([F([12, 0]), F([-35, 0])], 1, false)]),
      shineP(band([F([6, -10]), F([-14, -12]), F([-24, -9])], 2.2), .75), shineP(band([F([21, -6]), F([19, -9])], 1.6), .7),
    ] });
  }

  // =====================================================================
  // 11. Pettyes gőte (Lissotriton vulgaris), hím – oldalnézet balra: karcsú, barna test sötét, kerek foltokkal, NARANCSSÁRGA,
  //     pettyes has, a hátán és a farkán HULLÁMOS taraj, hosszú, lapított farok (alul kékes-narancs sávval), négy vékony láb
  // =====================================================================
  {
    // a farok felfelé kunkorodik (így a matrica nem túl széles a hatszögben)
    const body = smC([[4, 50], [8, 43], [16, 41], [24, 44], [34, 44], [46, 44], [58, 43], [68, 38], [76, 29], [84, 16], [86, 26], [80, 40], [70, 51], [56, 57], [38, 57], [24, 56], [12, 57], [5, 55]], 5);
    // hullámos taraj: a hát- és farokvonal mentén kifelé tolt, hullámzó sáv (és egy keskenyebb a farok alján)
    const along = (pts, d0, amp, k, n = 26) => { const sp = smO(pts, 5), m = sp.length; return Array.from({ length:n + 1 }, (_, j) => { const i = Math.round(j / n * (m - 1)), a = sp[max(0, i - 1)], b = sp[min(m - 1, i + 1)], l = hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const d = d0 + amp * Math.sin(j * k) * Math.sin(Math.PI * j / n); return [sp[i][0] + (b[1] - a[1]) / l * d, sp[i][1] - (b[0] - a[0]) / l * d]; }); };
    const backL = [[22, 44.5], [40, 44], [58, 43.5], [68, 38.5], [76, 29.5], [84, 17]];
    const crest = smC([...along(backL, 5, 2.6, 1.7), ...[...backL].reverse()], 1);
    const lowL = [[60, 55], [72, 49], [80, 39], [85, 26]], tcrest = smC([...along(lowL, -3.2, 1, 1.5, 10), ...[...lowL].reverse()], 1);
    const belly = clip(smC([[4, 53], [30, 51], [52, 53], [64, 51], [70, 60], [4, 64]], 2), hullOf(body.filter(p => p[0] < 66)));
    const tailBand = band(smO([[62, 51.5], [72, 45.5], [79, 36], [83, 25]], 2), 2.2, false);
    const spots = [[26, 49, 2.2], [38, 48, 2.6], [50, 50, 2.2], [62, 47, 2], [32, 55, 1.4], [46, 55, 1.4], [58, 54, 1.3], [74, 38, 1.6]].map(([x, y, r]) => circ(x, y, r, 8));
    const legs = [[[16, 55], [13, 61], [10, 65]], [[22, 56], [24, 62], [27, 66]], [[46, 56], [43, 62], [40, 66]], [[52, 56], [56, 62], [60, 65]]].map(p => taper(p, 4, 2.8));
    const toes = [[10, 65], [27, 66], [40, 66], [60, 65]].flatMap(([x, y]) => [bar([[x, y], [x - 3, y + 2.4]], 1.2), bar([[x, y], [x, y + 3.2]], 1.2), bar([[x, y], [x + 3, y + 2.4]], 1.2)]);
    fin('halo_pettyes_gote', { hu:'pettyes gőte', en:'smooth newt', look:'male smooth newt in side view facing left: slim olive-brown body with round dark spots, an orange spotted belly, a high wavy crest along the back and the long flattened tail with a pale blue and orange stripe, four thin legs with small fingers', shapes:[
      pth('wood', 'dark', [crest, tcrest]), dpth('chocolate', 'base', [[48, 40], [74, 30]].map(([x, y]) => circ(x, y, 1.5, 6))),
      pth('wood', 'base', [...legs, ...toes]),
      ...blob('wood', body, [40, 50], { ld:2.6, dd:0, ed:0 }),
      det('orange', 'base', belly), det('sky', 'light', tailBand),
      dpth('chocolate', 'base', spots),
      det('chocolate', 'base', band([[5, 48], [12, 47.4], [20, 48.5]], 1.8, false)),
      det('gold', 'base', circ(12, 46.5, 3, 10)), det('dark', 'base', circ(12, 46.5, 1.9, 8)), det('paper', 'light', circ(11.3, 45.8, .7, 6)),
      shineP(band([[20, 46], [34, 45.5]], 1.4), .75),
    ] });
  }

  // =====================================================================
  // 12. Barna varangy (Bufo bufo) – ülő, zömök, BÖRTÖKÖS barna varangy balra-előre nézve: nagy, rézvörös szem VÍZSZINTES
  //     pupillával, a szem mögött a hosszúkás mirigydudor, széles száj, krémszínű torok, támaszkodó mellső láb, behajlított hátsó láb
  // =====================================================================
  {
    const body = smC([[10, 58], [14, 44], [26, 34], [42, 30], [60, 32], [78, 40], [90, 56], [90, 72], [80, 82], [60, 86], [36, 84], [20, 76], [12, 68]], 5), c = [54, 60];
    const thigh = smC([[60, 60], [76, 54], [90, 62], [92, 76], [84, 86], [66, 88], [56, 80]], 4);
    const foot = smC([[46, 86], [60, 84], [76, 86], [82, 90], [60, 92], [44, 91]], 2);
    const arm = smC([[20, 68], [28, 66], [32, 78], [30, 88], [22, 88], [22, 80]], 3);
    const hand = [[20, 88], [25, 90], [30, 90], [34, 88]].map(([x, y], i) => circ(x, y, 2.4, 8, 1.6));
    const throat = smC([[12, 62], [22, 60], [32, 64], [30, 72], [18, 72]], 3);
    const par = smC([[38, 34], [52, 32], [60, 36], [56, 42], [42, 42]], 3);
    const warts = [[48, 50, 2], [62, 46, 2.4], [70, 52, 2], [58, 58, 1.8], [72, 64, 2.2], [44, 60, 1.6], [80, 50, 1.8], [52, 70, 1.8], [66, 74, 1.6], [36, 50, 1.4]].map(([x, y, r]) => circ(x, y, r, 8));
    const eyeB = circ(28, 38, 8, 14, 7);
    fin('halo_barna_varangy', { hu:'barna varangy', en:'common toad', look:'chunky warty brown common toad sitting, facing left in three-quarter view: big coppery orange eye with a horizontal black pupil, a long gland bump behind the eye, a wide mouth, pale cream throat, front leg propped up, folded hind leg, scattered dark warts', shapes:[
      pth('cardboard', 'dark', [foot]),
      ...blob('cardboard', body, c, { ld:5, dd:4.4, ed:1.8 }),
      ...blob('cardboard', thigh, [74, 70], { ld:0, dd:3, ed:0, bt:'base' }),
      det('cream', 'base', throat), det('cardboard', 'line', band(smO([[10, 60], [20, 58], [30, 54]], 2), 1.3, false), { o:.7 }),
      pth('cardboard', 'base', [arm, ...hand]), det('cardboard', 'dark', crescent(arm, [27, 77], 20, 50, 2)),
      face('cardboard', 'light', par),
      dpth('soil', 'dark', warts, { o:.85 }),
      pth('cardboard', 'base', [eyeB]), face('ember', 'base', circ(28, 36, 5.6, 14, 5.2)), det('gold', 'base', crescent(circ(28, 36, 5.6, 14, 5.2), [28, 36], -135, 60, 1.6)),
      det('dark', 'base', circ(28, 36, 3.6, 12, 1.4)), det('paper', 'light', circ(26.4, 34.4, 1, 6)),
      shineP(band([[40, 38], [52, 36]], 1.6), .5),
    ] });
  }

  // =====================================================================
  // 13. Levelibéka (Hyla arborea) – kicsi, ÉLÉNKZÖLD béka oldalnézetben egy ívelt, sötétebb nádlevélen: sötét oldalsáv az orrtól a
  //     szemen át a combtőig (a végén felkunkorodik), fölötte vékony krém csík, nagy aranyszem, KEREK tapadókorongok az ujjakon
  // =====================================================================
  {
    const reed = taper(smO([[2, 90], [30, 78], [62, 76], [86, 66], [98, 44]], 4), 13, 6), rsp = smO([[2, 90], [30, 78], [62, 76], [86, 66], [98, 44]], 4);
    const body = smC([[10, 52], [14, 42], [26, 34], [44, 32], [60, 36], [72, 46], [72, 58], [62, 66], [44, 68], [26, 66], [14, 60]], 4), c = [44, 50];
    const thigh = smC([[54, 48], [68, 44], [80, 52], [80, 62], [70, 68], [58, 64]], 3), shank = smC([[62, 66], [76, 60], [86, 66], [80, 72], [64, 72]], 3);
    const arm = smC([[20, 58], [28, 58], [30, 68], [26, 74], [20, 72]], 2);
    const pads = [[18, 74], [24, 76], [30, 75], [82, 70], [88, 68], [76, 72]].map(([x, y]) => circ(x, y, 2.6, 10));
    const belly = clip(smC([[4, 58], [40, 60], [74, 56], [74, 80], [4, 80]], 1), hullOf(body));
    const stripe = band(smO([[8, 47], [18, 44], [30, 47], [44, 51], [56, 53]], 3), 4.4, false);
    const cline = band(smO([[14, 41.5], [30, 42.8], [44, 47], [56, 48.8]], 3), 1.7, false);
    fin('halo_levelibeka', { hu:'zöld levelibéka', en:'European tree frog', look:'a small bright green European tree frog sitting in side view on an arching darker green reed leaf: dark brown side stripe from the nose through the eye along the flank curling up at the hip with a thin cream line above, big golden eye, pale belly, round sticky toe pads', shapes:[
      pth('leaf', 'dark', [reed]), det('leaf', 'base', band(rsp.map(([x, y]) => [x, y - 1.6]), 2, false)),
      pth('leaf', 'base', [shank]),
      ...blob('leaf', body, c, { ld:4, dd:3, ed:0, bt:'light', lm:'grass', dm:'grass' }), det('cream', 'base', belly),
      det('chocolate', 'base', stripe), det('cream', 'light', cline),
      pth('leaf', 'light', [thigh]), det('grass', 'light', crescent(thigh, [68, 56], -135, 60, 2.4)), det('grass', 'dark', crescent(thigh, [68, 56], 45, 60, 2.2)),
      pth('leaf', 'light', [arm]),
      pth('leaf', 'light', pads, { o:1 }),
      pth('leaf', 'light', [circ(26, 38, 7, 14, 6.4)]), det('gold', 'base', circ(26, 38, 5, 14, 4.6)), det('dark', 'base', circ(26, 38, 3.4, 12, 1.8)), det('paper', 'light', circ(24.4, 36.4, 1, 6)),
      shineP(band([[34, 36], [48, 34.5]], 1.8), .7),
    ] });
  }

  // =====================================================================
  // 14. Vízisikló (Natrix natrix) – S alakban fekvő, szürkés-olív kígyó, a feje balra felemelve: KEREK pupillájú, barátságos szem,
  //     a fej mögött a jellegzetes SÁRGA félhold-folt, mögötte a fekete; az oldalán sötét harántfoltok, kis villás nyelv
  // =====================================================================
  {
    const S = smO([[94, 80], [78, 88], [50, 88], [28, 80], [26, 66], [44, 60], [66, 56], [78, 44], [70, 30], [50, 26], [32, 28], [22, 30]], 5), n = S.length;
    const w = t => t < .06 ? 2 + t / .06 * 5 : t > .82 ? 11 - (t - .82) / .18 * 3 : 7 + (t - .06) / .76 * 4;
    const body = tube(S, t => w(1 - t)), head = smC([[4, 28], [8, 22], [18, 20], [28, 24], [30, 31], [24, 36], [12, 36], [5, 33]], 3);
    const N = i => { const a = S[max(0, i - 1)], b = S[min(n - 1, i + 1)], l = hypot(b[0] - a[0], b[1] - a[1]); return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
    const bars = [.16, .23, .3, .37, .44, .51, .58, .65, .72].map((t, j) => { const i = Math.round(t * (n - 1)), [nx, ny] = N(i), h = w(1 - i / (n - 1)) * .5, sd = j % 2 ? 1 : -1;
      return circ(S[i][0] + nx * h * .55 * sd, S[i][1] + ny * h * .55 * sd, 1.8, 8, 1.2, Math.atan2(ny, nx) * 180 / Math.PI); });
    const collarY = smC([[30, 22], [36, 21], [38, 29], [35, 37], [30, 37], [32, 30]], 2), collarB = smC([[36, 21], [42, 22], [43, 30], [40, 38], [35, 37], [38, 29]], 2);
    const tongue = [bar([[5, 31], [0, 32]], 1), bar([[0, 32], [-3, 30]], .8), bar([[0, 32], [-3, 34]], .8)];
    fin('halo_vizisiklo', { hu:'vízisikló', en:'grass snake', look:'a friendly grey-olive grass snake lying in an S-curve with its head raised on the left: round friendly eye with a round pupil, the characteristic bright yellow crescent collar behind the head followed by a black crescent, small dark bars on the flanks, a tiny forked red tongue', shapes:[
      pth('red', 'base', tongue, { line:false }),
      pth('dark', 'light', [body.sil]), det('steel', 'dark', body.light), det('dark', 'base', body.dark), det('dark', 'dark', body.edge, { o:.6 }),
      dpth('dark', 'dark', bars, { o:.9 }),
      pth('dark', 'light', [head]), det('steel', 'dark', crescent(head, [17, 29], -120, 70, 2.4)),
      det('honey', 'base', collarY), det('dark', 'dark', collarB),
      det('cream', 'base', band(smO([[7, 34], [16, 35], [26, 34]], 2), 1.4, false), { o:.8 }),
      det('paper', 'base', circ(14, 27, 3.8, 12)), det('dark', 'dark', circ(13.4, 27, 2.6, 10)), det('paper', 'light', circ(12.6, 26, .9, 6)),
      shineP(band(S.slice(Math.round(n * .35), Math.round(n * .5)).map(([x, y], j) => { const [ax, ay] = N(Math.round(n * .35) + j); return [x + ax * 3, y + ay * 3]; }), 1.6), .6),
    ] });
  }

  // ---------------- kerti tó 3/4-es nézetben: méhsejt-diorámás „sziget” – füves teteje, elöl földes pereme, benne a víz ----------------
  const tile = (cx, cy, rx, ry, d = 8, n = 20) => { const top = circ(cx, cy, rx, n, ry); return { top, sil:hullOf([...top, ...top.map(([x, y]) => [x, y + d])]), c:[cx, cy], d }; };
  const tileS = (T, m = 'grass') => [pth('soil', 'base', [T.sil]), det('soil', 'dark', crescent(T.sil, [T.c[0], T.c[1] + T.d * .6], 60, 58, 3)),
    pth(m, 'base', [T.top]), det(m, 'light', crescent(T.top, T.c, -120, 70, 3))];
  const pond = (cx, cy, rx, ry, m = 'water') => { const w = wobC(cx, cy, rx, ry, .035, 5, .8, 22); return { w, s:[pth(m, 'base', [w]), det(m, 'dark', crescent(w, [cx, cy], -90, 80, ry * .3))] }; };

  // =====================================================================
  // 15. Díszhalak a tóban – a kis kerti tóban egy nagy NARANCS aranyhal (felülről, lebegő fátyolfarokkal) és egy kisebb
  // =====================================================================
  {
    const T = tile(50, 58, 47, 24, 9), P = pond(50, 57, 40, 18);
    const F = frame([47, 56], -8, 1);
    const fish = smC([[26, 0], [22, -6], [10, -9], [-6, -8], [-16, -4], [-19, 0], [-16, 4], [-6, 8], [10, 9], [22, 6]].map(F), 3);
    const tail = smC([[-15, 0], [-22, -6], [-30, -12], [-35, -9], [-30, -2], [-36, 5], [-30, 11], [-22, 6]].map(F), 3);
    const fins = [-1, 1].map(s => smC([[10, 7 * s], [6, 14 * s], [0, 15 * s], [2, 8 * s]].map(F), 2));
    const G = frame([74, 64], 200, .45), fish2 = [smC([[26, 0], [22, -6], [10, -9], [-6, -8], [-16, -4], [-19, 0], [-16, 4], [-6, 8], [10, 9], [22, 6]].map(G), 2), smC([[-15, 0], [-26, -9], [-24, 0], [-26, 9]].map(G), 1)];
    const ripple = [circ(22, 50, 6, 12, 2.2), circ(80, 52, 4, 12, 1.5)];
    fin('halo_h_halak', { hu:'díszhalak a tóban', en:'goldfish in a garden pond', look:'a small garden pond island in three-quarter view with grassy top and earthy edge, a big orange goldfish seen from above with a flowing veil tail and a smaller goldfish swimming in the blue water', shapes:[
      ...tileS(T), ...P.s,
      pth('orange', 'base', fish2), pth('orange', 'light', [tail, ...fins], { o:1 }), det('orange', 'dark', band([F([-14, 0]), F([-30, -1])], 1.4, false)),
      ...blob('orange', fish, F([4, 0]), { ld:2.6, dd:2.4, ed:0, tilt:0 }), det('orange', 'dark', band([F([18, 0]), F([-12, 0])], 1.6, false)),
      dpth('dark', 'base', [-1, 1].map(s => circ(...F([20, 5 * s]), 2.2, 8))),
      dpth('paper', 'light', ripple, { o:.7 }),
      shineP(band([F([14, -4]), F([0, -6])], 1.6), .8),
    ] });
  }

  // =====================================================================
  // 16. Műtrágya bemosódása – a tóparton feldőlt, felirat nélküli műtrágyás zsák, a száján kiömlő szemcsék a víz felé gurulnak,
  //     a víz ZAVAROS, zöld, algás hab úszik rajta
  // =====================================================================
  {
    const T = tile(56, 62, 42, 22, 9), P = pond(64, 64, 30, 14, 'teal');
    const scum = [[56, 61, 8, 3], [72, 67, 7, 2.6], [68, 58, 5, 1.8], [80, 62, 4, 1.6], [52, 68, 4, 1.4]].map(([x, y, r, ry]) => wobC(x, y, r, ry, .15, 4, 0, 12));
    // párnaszerű zsák a sarkain kis „fülekkel”; a jobb vége a száj, gyűrött, nyitott
    const sack = smC([[2, 30], [8, 28], [16, 20], [30, 18], [42, 22], [46, 20], [52, 34], [49, 48], [44, 50], [30, 56], [14, 56], [6, 54], [4, 48], [8, 40]], 3), sc = [26, 38];
    const mouth = smC([[44, 26], [48, 22], [53, 30], [52, 40], [49, 48], [45, 42]], 3), band1 = clip(smC([[0, 36], [40, 26], [42, 32], [2, 44]], 1), hullOf(sack));
    const gran = [[53, 42], [56, 47], [52, 49], [59, 51], [55, 54], [61, 55], [64, 58], [58, 58], [66, 61], [62, 62], [51, 46], [57, 44]].map(([x, y]) => circ(x, y, 1.9, 8));
    fin('halo_h_bemosodas', { hu:'műtrágya bemosódása', en:'fertiliser washing into a pond', look:'a plain tipped-over white fertiliser sack with no text lying on the bank of a small garden pond island, pale blue granules spilling from its open mouth and rolling towards murky green algae-covered water', shapes:[
      ...tileS(T), ...P.s, dpth('grass', 'light', scum),
      ...blob('white', sack, sc, { ld:3.2, dd:3.4, ed:1.4, lm:'paper' }), det('teal', 'base', band1),
      face('steel', 'base', mouth), det('dark', 'light', smC([[47, 28], [50, 30], [50, 40], [47, 44], [46, 36]], 2)),
      dpth('blue', 'light', gran), dpth('paper', 'light', gran.filter((_, i) => i % 3 === 0).map(g => g.map(([x, y]) => [x - .4, y - .4]))),
      shineP(band([[14, 32], [22, 26]], 2), .8),
    ] });
  }

  // =====================================================================
  // 17. A tó feltöltése – a kis tóba nagy FÖLDKUPAC és törmelék (szürke kő, piros téglatörmelék) kerül, benne egy ásó, a vízbe
  //     hulló rögök körül csobbanás; a tóból már csak egy sarok látszik
  // =====================================================================
  {
    const T = tile(50, 64, 46, 22, 9), P = pond(66, 66, 26, 12);
    const heap = smC([[6, 66], [14, 50], [26, 38], [40, 34], [54, 40], [64, 52], [68, 64], [56, 72], [30, 74], [12, 72]], 4), hc = [38, 58];
    const rub = [smC([[22, 50], [30, 46], [34, 52], [28, 56]], 1), smC([[44, 54], [52, 52], [54, 60], [46, 60]], 1)];
    const brick = [smC([[34, 40], [42, 38], [44, 42], [36, 44]], 1), smC([[14, 60], [22, 58], [22, 63], [15, 64]], 1)];
    const handle = band([[46, 46], [70, 10]], 3.4), grip = band([[66, 8], [76, 12]], 3), blade = smC([[40, 44], [48, 38], [54, 44], [50, 56], [42, 56]], 1);
    const clods = [[68, 62, 2.4], [74, 58, 1.8], [62, 58, 2]].map(([x, y, r]) => circ(x, y, r, 8)), splash = circ(70, 66, 7, 14, 2.4);
    fin('halo_h_feltoltes', { hu:'a tó feltöltése', en:'filling in the pond with soil and rubble', look:'a small garden pond island mostly buried under a big heap of brown soil with grey stones and red brick rubble, a spade stuck in the heap and soil clods splashing into the last corner of water', shapes:[
      ...tileS(T), ...P.s,
      dpth('paper', 'light', [splash], { o:.8 }),
      ...blob('soil', heap, hc, { ld:4, dd:4, ed:1.6 }),
      pth('steel', 'base', rub), pth('red', 'dark', brick), dpth('steel', 'light', rub.map(r => crescent(r, r.reduce((a, p) => [a[0] + p[0] / r.length, a[1] + p[1] / r.length], [0, 0]), -135, 60, 1.4))),
      pth('steel', 'dark', [blade]), pth('wood', 'base', [handle, grip]), det('wood', 'light', band([[47, 44], [69, 11]], 1, false)),
      pth('soil', 'base', clods),
      shineP(band([[20, 52], [28, 42]], 1.8), .5),
    ] });
  }

  // =====================================================================
  // 18. Özönnövény a tóban (pl. kagylótutaj, közönséges süllőhínár) – a víz felszínét szinte TELJESEN beborító, húsos, világoszöld
  //     levélrózsák tömege, néhány már a partra is kilóg – „túl sok”
  // =====================================================================
  {
    const T = tile(50, 60, 46, 23, 9), P = pond(50, 58, 38, 17);
    const R = [[30, 52, 11], [50, 48, 12], [70, 52, 11], [38, 64, 12], [60, 64, 12], [80, 62, 8], [20, 62, 8], [48, 38, 8], [76, 42, 7]];
    const ros = R.map(([x, y, r], i) => wobC(x, y, r, r * .6, .16, 7, i, 21));
    const ribs = R.flatMap(([x, y, r], i) => [0, 1, 2].map(j => { const a = j * 120 + i * 20 + 30; return band([[x + r * .18 * cos(a), y + r * .11 * sin(a)], [x + r * .78 * cos(a), y + r * .47 * sin(a)]], .8, false); }));
    fin('halo_h_ozonnoveny', { hu:'idegenhonos vízinövény', en:'invasive floating water plant', look:'a small garden pond island whose water is almost completely covered by a thick mat of fleshy pale green floating rosettes like water lettuce, some spilling over the edge – clearly too much', shapes:[
      ...tileS(T), ...P.s,
      pth('grass', 'light', ros), dpth('grass', 'base', ros.map((q, i) => crescent(q, R[i], 50, 70, R[i][2] * .22, .9, 8))),
      dpth('grass', 'dark', ribs, { o:.8 }), dpth('leaf', 'base', R.map(([x, y, r]) => circ(x, y, r * .16, 8, r * .1))),
      shineP(band([[42, 44], [52, 42]], 1.6), .8),
    ] });
  }

  // =====================================================================
  // 19. Halmentes tó – TISZTA, világoskék víz (a fenéken kavicsok látszanak), benne egy pettyes gőte (felülről) és három ebihal,
  //     a parton két nádlevél – hal nincs
  // =====================================================================
  {
    const T = tile(50, 60, 47, 24, 9), P = pond(50, 58, 40, 18, 'sky');
    const peb = [[30, 62, 3, 1.6], [62, 66, 3.4, 1.8], [72, 56, 2.4, 1.3], [40, 70, 2.6, 1.3], [54, 50, 2, 1.1]].map(([x, y, r, ry]) => circ(x, y, r, 10, ry));
    const F = frame([36, 63], -10, 1);   // gőte felülről: u a fej felé
    const newt = smC([[17, 0], [15, -3.6], [10, -4.4], [5, -3.2], [-4, -4.4], [-11, -3.2], [-18, -1.8], [-26, .6], [-33, 5], [-35, 8], [-30, 5.4], [-19, 2.4], [-11, 3.2], [-4, 4.4], [5, 3.2], [10, 4.4], [15, 3.6]].map(F), 3);
    const nleg = [[6, -1], [6, 1], [-8, -1], [-8, 1]].map(([u, v], i) => bar([F([u, 2 * v]), F([u + (i < 2 ? 3 : -3), 6.4 * v]), F([u + (i < 2 ? 5 : -2), 8.6 * v])], 2.4));
    const tad = [[62, 50, 200], [72, 58, 170], [60, 66, 190]].map(([x, y, a]) => { const G = frame([x, y], a, 1); return { h:circ(x, y, 4.6, 14, 3.6, a), t:taper(smO([[-3, 0], [-8, 2], [-13, -1.4], [-17, .8]].map(G), 2), 3.2, .8), e:circ(...G([1.6, -1.6]), .9, 6) }; });
    const reeds = [taper(smO([[12, 56], [9, 40], [4, 26]], 2), 3.4, .6), taper(smO([[15, 56], [16, 38], [20, 22]], 2), 3.4, .6), taper(smO([[18, 57], [24, 44], [30, 34]], 2), 3, .6)];
    fin('halo_v_halmentes', { hu:'halmentes tó', en:'fish-free garden pond with a newt and tadpoles', look:'a small garden pond island with clear light blue water and pebbles visible on the bottom, a smooth newt seen from above and three dark tadpoles swimming, a few reed leaves on the bank, no fish', shapes:[
      ...tileS(T), ...P.s, dpth('steel', 'light', peb, { o:.8 }),
      pth('leaf', 'base', reeds), det('grass', 'base', band(smO([[14, 54], [15, 40], [19, 26]], 2), 1, false)),
      pth('wood', 'light', [...nleg, newt]), det('wood', 'dark', band([F([13, 0]), F([-24, 1])], 1.3, false)), det('orange', 'base', band([F([10, 3.4]), F([-10, 3.6])], 1.6, false)), det('orange', 'base', band([F([10, -3.4]), F([-10, -3.6])], 1.6, false)),
      dpth('chocolate', 'base', [[3, -1.4], [-4, 1.4], [-10, -1], [-16, .6]].map(([u, v]) => circ(...F([u, v]), 1.1, 6))),
      pth('dark', 'light', [...tad.map(q => q.t), ...tad.map(q => q.h)]), dpth('paper', 'light', tad.map(q => q.e), { o:.8 }),
      shineP(band([[20, 52], [30, 46]], 1.8), .8),
    ] });
  }

  // =====================================================================
  // 20. Növénysáv a parton, trágya nélkül – a gyep és a víz között dús, SŰRŰ sávban nád, gyékény (barna buzogány) és sárga nőszirom
  // =====================================================================
  {
    const T = tile(50, 62, 47, 23, 9), P = pond(70, 58, 23, 12);
    const lawnS = [0, 1].map(i => clip(smC([[4 + i * 16, 40], [14 + i * 16, 40], [4 + i * 16 + 24, 90], [-6 + i * 16 + 24, 90]], 1), hullOf(T.top)));
    // a sáv tövei a gyep és a víz között húzódó átlón; minden tőből egy kard alakú levél
    const SW = [[0, 0], [.1, .08], [.5, .09], [.85, .06], [1, 0]], roots = Array.from({ length:9 }, (_, i) => lerp([30, 46], [58, 80], i / 8));
    const L = leafSet(roots.map(([x, y], i) => [SW, x, y, -90 + [-14, 8, -4, 14, -10, 4, -16, 10, -2][i], 30 + (i % 3) * 7, 0, 2]));
    const catt = [[38, 54, -2, 38], [52, 70, 4, 42]].map(([x, y, d, l]) => { const top = [x + d, y - l]; return { st:band([[x, y], top], 1.2, false), sp:circ(top[0], top[1] + 5, 2.6, 10, 6) }; });
    const iris = [[34, 20], [48, 30], [60, 44]].map(([x, y]) => wobC(x, y + 1, 5.4, 5, .38, 3, -Math.PI / 2, 12));   // háromkaréjos sárga virág
    fin('halo_v_novenysav', { hu:'növénysáv a parton', en:'planted pond margin without fertiliser', look:'a small garden pond island in three-quarter view with a lush dense band of tall reeds, bulrushes with brown seed heads and yellow flag irises growing between the mown lawn and the water', shapes:[
      ...tileS(T), dpth('grass', 'light', lawnS, { o:.9 }), ...P.s,
      pth('leaf', 'base', L.shade), dpth('leaf', 'dark', L.deep), pth('grass', 'base', L.lit),
      pth('chocolate', 'base', [...catt.map(q => q.st), ...catt.map(q => q.sp)]), dpth('chocolate', 'light', catt.map(q => crescent(q.sp, [q.sp[0][0] - 2.6, q.sp[3][1]], -135, 60, 1.2))),
      pth('honey', 'base', iris), dpth('gold', 'dark', [[34, 20], [48, 30], [60, 44]].map(([x, y]) => circ(x, y + 1, 1.4, 6))),
      shineP(band([[16, 50], [24, 46]], 1.8), .6),
    ] });
  }

  // =====================================================================
  // 21. Új kis tó LANKÁS parttal – frissen ásott, kerek kis tó (körben még csupasz föld), az egyik oldalán enyhén lejtő, kavicsos
  //     „strand”, amin a kis állatok ki-be járhatnak; mellette a földbe szúrt ásó és kis földkupac
  // =====================================================================
  {
    const T = tile(50, 62, 47, 23, 9), dug = wobC(50, 62, 38, 18, .04, 5, 0, 30), P = pond(54, 63, 30, 13);
    const beach = clip(smC([[12, 58], [26, 50], [40, 56], [42, 70], [26, 76], [12, 70]], 3), hullOf(dug));
    const peb = [[20, 60, 2.4], [26, 66, 2.8], [32, 58, 2.2], [20, 69, 2], [34, 67, 2.4], [28, 72, 1.8], [38, 62, 2]].map(([x, y, r]) => circ(x, y, r, 10, r * .6));
    const heap = smC([[66, 44], [74, 34], [84, 32], [92, 40], [94, 48], [80, 50]], 3);
    const shaft = band([[80, 36], [84, 6]], 3.2), grip = smC([[80, 6], [80, 0], [88, 0], [88, 6], [86, 6], [86, 2], [82, 2], [82, 6]], 1), blade = smC([[75, 36], [85, 36], [85, 46], [80, 50], [75, 46]], 1);
    fin('halo_v_uj_to', { hu:'új kis tó lankás parttal', en:'new small pond with a gently sloping beach', look:'a freshly dug small garden pond on a grassy island with bare soil around the edge, clean water, a gently sloping pebbly beach on one side and a spade stuck in a small heap of soil', shapes:[
      ...tileS(T), pth('soil', 'light', [dug]), ...P.s,
      det('cardboard', 'light', beach), dpth('steel', 'base', peb), dpth('paper', 'light', peb.slice(0, 4).map(p => p.map(([x, y]) => [x - .5, y - .5]).filter((_, i) => i % 2 === 0)), { o:.7 }),
      ...blob('soil', heap, [82, 42], { ld:2.4, dd:2.4, ed:0 }),
      pth('steel', 'base', [blade]), det('steel', 'light', smC([[76, 37], [79, 37], [79, 45], [76, 44]], 1)), pth('wood', 'base', [shaft]), pth('wood', 'dark', [grip]),
      shineP(band([[36, 58], [48, 54]], 1.8), .8),
    ] });
  }

  // =====================================================================
  // 22. Csak hazai vízinövény – rácsos ültetőkosárban egy hazai tündérrózsa (kerek, bevágott levelek, FEHÉR virág sárga közepével),
  //     épp most kerül a tóba: a kosár alja már a vízben, körülötte fodrozódik a víz; mellette két úszó levél
  // =====================================================================
  {
    const T = tile(50, 66, 47, 22, 9), P = pond(50, 65, 40, 16);
    const pot = [[32, 46], [68, 46], [64, 66], [36, 66]], rim = circ(50, 46, 18, 20, 5), soilTop = circ(50, 46, 15.4, 18, 4);
    const Q = [pot[3], pot[2], pot[1], pot[0]], holes = [0, 1].flatMap(r => [0, 1, 2, 3, 4].map(cI => qrect(Q, .12 + cI * .165, .19 + cI * .165, .22 + r * .36, .4 + r * .36)));
    const sub = clip(smC([[20, 58], [80, 58], [80, 80], [20, 80]], 1), hullOf(pot));
    const pad = (x, y, r) => [...circ(x, y, r, 18, r * .45).filter((p, i) => i > 0 && i < 17), [x, y]];   // kerek levél ék alakú bevágással
    const pads = [pad(22, 68, 9), pad(78, 70, 8), pad(38, 42, 10), pad(64, 40, 9)];
    const petals = Array.from({ length:8 }, (_, i) => leafFull([[0, 0], [.3, .34], [.7, .32], [1, 0]], 50, 36, -90 + (i - 3.5) * 25, i % 2 ? 14 : 17, 0, 2));
    const petalsB = Array.from({ length:5 }, (_, i) => leafFull([[0, 0], [.3, .34], [.7, .32], [1, 0]], 50, 36, -90 + (i - 2) * 32, 12, 0, 2));
    const ring = [circ(50, 68, 22, 20, 5.4), circ(50, 70, 28, 20, 7.4)];
    fin('halo_v_hazai_noveny', { hu:'csak hazai vízinövény', en:'planting a native water lily', look:'a black mesh planting basket with a native white water lily with round notched green pads and a white flower with a yellow centre being lowered into a small garden pond island, ripples around it and two floating lily pads', shapes:[
      ...tileS(T), ...P.s, dpth('paper', 'light', ring, { o:.7 }),
      pth('leaf', 'base', [pads[0], pads[1]]),
      face('dark', 'base', pot), dpth('dark', 'light', holes), det('water', 'dark', sub, { o:.4 }), det('paper', 'light', band([[35, 58], [50, 59.6], [65, 58]], 1.4, false), { o:.9 }),
      face('dark', 'light', rim), det('soil', 'base', soilTop),
      pth('leaf', 'base', [pads[2], pads[3]]), dpth('leaf', 'light', [crescent(pads[0], [22, 68], -120, 60, 1.8), crescent(pads[2], [38, 42], -120, 60, 1.8), crescent(pads[3], [64, 40], -120, 60, 1.6)]),
      pth('white', 'base', petals), pth('paper', 'light', petalsB), det('gold', 'base', circ(50, 34, 4, 12, 2.8)),
      shineP(band([[37, 50], [38, 62]], 1.6), .5),
    ] });
  }

  // =====================================================================
  // 23. Kő- és farakás a parton – a tó mellett kis halomba rakott, kerekded szürke kövek és rönkdarabok (a vágott végükön évgyűrű),
  //     alul a résből egy barna varangy kukucskál ki
  // =====================================================================
  {
    const T = tile(50, 64, 47, 22, 9), P = pond(72, 70, 20, 9);
    const log = (x0, x1, y, r) => ({ b:smC([[x0, y - r], [x1, y - r], [x1 + r * .35, y], [x1, y + r], [x0, y + r]], 1), cap:circ(x0, y, r * .55, 16, r), rings:[circ(x0, y, r * .3, 10, r * .6), circ(x0, y, r * .08, 6, r * .18)] });
    const L = [log(20, 58, 54, 7), log(26, 54, 40, 6.2), log(52, 70, 60, 5.4)];
    const stones = [[12, 64, 8, 6], [60, 52, 7.4, 6], [40, 30, 7.4, 5.8], [66, 38, 6, 5]].map(([x, y, r, ry], i) => wobC(x, y, r, ry, .06, 3, i, 14));
    const gap = circ(32, 67, 14, 16, 7), toad = smC([[18, 72], [20, 66], [26, 63], [38, 63], [44, 66], [46, 72]], 3);
    fin('halo_v_rejtekhely', { hu:'kő- és farakás a parton', en:'stone and log pile by a pond with a hiding toad', look:'a small pile of rounded grey stones and short logs with tree rings on their cut ends on a grassy pond island next to the water, a brown toad peeking out of a dark gap at the bottom with its coppery eyes', shapes:[
      ...tileS(T), ...P.s,
      pth('wood', 'base', L.map(q => q.b)), dpth('wood', 'dark', L.map(q => clip(smC([[0, q.cap[4][1]], [100, q.cap[4][1]], [100, q.cap[4][1] + 20], [0, q.cap[4][1] + 20]], 1), hullOf(q.b)))),
      pth('wood', 'light', L.map(q => q.cap)), dpth('wood', 'dark', L.flatMap(q => q.rings)),
      pth('steel', 'base', stones), dpth('steel', 'light', stones.map((q, i) => crescent(q, [[12, 64], [60, 52], [40, 30], [66, 38]][i], -130, 70, 2))), dpth('steel', 'dark', stones.map((q, i) => crescent(q, [[12, 64], [60, 52], [40, 30], [66, 38]][i], 50, 60, 1.8))),
      face('dark', 'base', gap), pth('cardboard', 'base', [toad]),
      pth('cardboard', 'base', [circ(23, 63.4, 3.2, 10, 2.8), circ(41, 63.4, 3.2, 10, 2.8)]), dpth('orange', 'dark', [circ(23, 63, 2.1, 10, 1.8), circ(41, 63, 2.1, 10, 1.8)]), dpth('dark', 'base', [circ(23, 63, 1.5, 8, .6), circ(41, 63, 1.5, 8, .6)]), det('cardboard', 'line', band([[20, 69.6], [32, 71], [44, 69.6]], 1, false), { o:.6 }), dpth('soil', 'dark', [[29, 67, 1.2], [35, 66.6, 1], [32, 64.6, .9]].map(([x, y, r]) => circ(x, y, r, 6)), { o:.8 }),
      shineP(band([[36, 26], [42, 25]], 1.4), .6),
    ] });
  }
})();
});
