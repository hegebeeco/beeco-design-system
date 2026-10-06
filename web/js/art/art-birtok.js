// ============================================================
//  Matricák — Élő birtok (birtok / bt) B szinten (docs/rajzolas.md): bozót, kartonos ásásmentes ágyás, palánta, magzacskó, talicska,
//  barna tojótyúk, indiai futókacsa, fóliasátor, szikkasztó árok (swale), terményes láda, komposzthalom, szalmatakarás.
//  Termés (13–18.): retek (csomó), borsó (nyitott hüvellyel), zöldbab (csomó), meggy, málna, befőtt (üveg, címke nélkül).
//  A játékban ~44–64 px-en jelennek meg (artIcon('bt_…')) → nagy, egyszerű sziluett, kevés, de jellegzetes részlet; 4 tónus a fő
//  felületeken, tömör olíva árnyék (shadow:'hard'). Szöveg, szám, márka, arc nincs (a tyúk és a kacsa szeme egy sötét pötty).
//  A tyúk NEM a régi „tyuk” (fehér, A szint): barna tojótyúk; az esővízgyűjtő hordó már megvan (art-devices: esovizgyujto).
//  A dobozszerű tárgyak valódi méretekből vetítve (ART.geo.camera), az élőlények 2D-ben (y lefelé), a fény bal-fentről.
//  A segédek az art-kaptar.js (ott: art-halo.js) másolatai, így a fájl önálló.
//  Render: node tools/art-render.js 2d web/js/art/art-birtok.js ki.png --skip birtok
// ============================================================
ART.later('birtok', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
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


  // ---------------- az Élő birtok saját segédei ----------------
  // levél-sokszög: tő (x, y), irány (fok, 0 = jobbra, 90 = le), hossz, szélesség
  const leafP = (x, y, deg, len, wid, n = 6) => { const d = [cos(deg), sin(deg)], nr = [-d[1], d[0]], L = [], R = [];
    for(let i = 0; i <= n; i++){ const t = i / n, w = wid / 2 * Math.pow(Math.sin(Math.PI * t), .8), c = [x + d[0] * len * t, y + d[1] * len * t];
      L.push([c[0] + nr[0] * w, c[1] + nr[1] * w]); R.push([c[0] - nr[0] * w, c[1] - nr[1] * w]); }
    return [...L, ...R.reverse().slice(1, -1)]; };
  // 3D-doboz lapjai a vetítővel: eleje (+Z), jobb oldala (+X), teteje (+Y)
  const boxF = (P, x0, x1, y0, y1, z0, z1) => ({ front:[[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(P),
    side:[[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]].map(P), top:[[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]].map(P) });
  const fitBox = (x0, x1, y0, y1, z0, z1) => { const f = []; for(const x of [x0, x1]) for(const y of [y0, y1]) for(const z of [z0, z1]) f.push([x, y, z]); return f; };

  // =====================================================================
  //  1. Bozót (szederinda-szövevény): lombhalom, ívben áthajló bordós vesszők, fekete szeder, fehér virág, avar a tövén
  // =====================================================================
  {
    const T = -6, C = [[50, 58, 21], [31, 64, 14], [69, 63, 15], [40, 45, 13], [61, 46, 14], [51, 35, 11], [26, 53, 9], [76, 53, 9]], c = [50, 56], sil = union(C, c);
    const cane = pts => tube(smO(pts, 4), t => 3.4 - 1.8 * t, { tilt:T });
    const k1 = cane([[36, 44], [24, 26], [12, 34], [6, 54], [5, 74]]), k2 = cane([[64, 44], [78, 26], [90, 36], [95, 56], [95, 74]]), k3 = cane([[52, 36], [60, 18], [74, 16], [82, 24]]);
    const cl = [leafP(18, 28, -110, 9, 5), leafP(9, 46, 200, 8, 4.5), leafP(84, 27, -60, 9, 5), leafP(94, 46, -10, 8, 4.5), leafP(68, 15, -80, 8, 4.5)];
    const berry = (x, y) => union([[x, y, 2.6], [x + 2.4, y + .8, 2.6], [x + .8, y + 2.6, 2.6], [x - 1.6, y + 2, 2.4]], [x + .4, y + 1.2]);
    const petals = (x, y) => union([0, 72, 144, 216, 288].map(a => [x + 3.4 * cos(a - 90), y + 3.4 * sin(a - 90), 3]), [x, y]);
    fin('bt_bozot', { hu:'bozót (szeder)', en:'bramble thicket', tilt:T, look:'dense bramble thicket in three-quarter view: a lumpy mound of dark green leaves, long burgundy canes arching over and rooting at the ground, a few black blackberries and a white five-petal flower, brown leaf litter at its base', shapes:[
      face('soil', 'dark', circ(50, 79, 40, 22, 7.5)),
      ...blob('leaf', sil, c, { tilt:T, ld:7, dd:7.5, ed:2.2 }),
      pth('berry', 'base', [k1.sil, k2.sil, k3.sil]), dpth('berry', 'light', [k1.light, k2.light, k3.light], { o:.75 }), pth('leaf', 'base', cl),
      pth('dark', 'base', [berry(34, 56), berry(63, 40), berry(70, 64)]),
      face('white', 'base', petals(46, 66)), det('honey', 'base', circ(46, 66, 1.8, 8)),
      shineP(band([[38, 39], [46, 35]], 2), .6),
    ] });
  }

  // =====================================================================
  //  2. Kartonos ásásmentes ágyás: földtest, a tetején átfedő kartonlapok (az egyik sarka felpöndörödik), rajtuk komposzt-halom két csírával
  // =====================================================================
  {
    const T = -10, L = .6, D = .42, H = .17, P = ART.geo.camera({ az:28, el:30, F:5, tilt:T, fit:fitBox(-L, L, 0, H + .12, -D, D), span:80 }), b = boxF(P, -L, L, 0, H, -D, D);
    const ring = (r, rz, y, n = 14) => Array.from({ length:n }, (_, i) => { const a = 2 * Math.PI * i / n, q = 1 + .08 * Math.sin(3 * a + 1); return P([.04 + r * q * Math.cos(a), y, -.02 + rz * q * Math.sin(a)]); });
    const heap = hullOf([...ring(.42, .28, H + .01), ...ring(.22, .14, H + .1, 10)]), hc = P([.04, H + .05, -.02]);
    const seed = (x, z) => { const p = P([x, H + .095, z]); return [band([p, [p[0], p[1] - 5]], 1.2), leafP(p[0], p[1] - 5, -160, 6, 3.6), leafP(p[0], p[1] - 5, -20, 6, 3.6)]; };
    fin('bt_karton_agyas', { hu:'kartonos ásásmentes ágyás', en:'no-dig bed with cardboard and compost', tilt:T, look:'no-dig garden bed in three-quarter view: a low block of brown soil, its top covered by overlapping flat brown cardboard sheets with one corner curling up, a dark crumbly compost heap on the cardboard with two tiny green seedlings', shapes:[
      face('soil', 'base', b.front), face('soil', 'dark', b.side), det('soil', 'line', [[L, 0, -D + .07], [L, 0, -D], [L, H, -D], [L, H, -D + .07]].map(P), { o:.4 }),
      face('cardboard', 'base', b.top),
      det('cardboard', 'light', [[-.02, H, D - .01], [L - .02, H, D - .03], [L - .03, H, -D + .02], [.01, H, -D + .04]].map(P)),
      { t:'line', pts:[P([-.02, H, D - .01]), P([.01, H, -D + .04])], m:'cardboard', tone:'dark', w:1.4 },
      face('cardboard', 'light', [[-L, H, D], [-L + .2, H, D], [-L + .05, H + .08, D - .12]].map(P)),
      ...blob('soil', heap, hc, { tilt:T, bt:'dark', lm:'soil', ld:3.5, dd:3, ed:1.2 }),
      pth('leaf', 'base', [...seed(-.06, .02), ...seed(.14, -.06)]),
      shineP(band([P([-L + .08, H, -D + .08]), P([-.12, H, -D + .08])], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  3. Palánta cserépben: terrakotta cserép alátéttel, sötét föld, szár két sziklevéllel és két valódi levéllel
  // =====================================================================
  {
    const T = 8, P = ART.geo.camera({ az:0, el:24, F:3, tilt:T, fit:[[-.075, 0, -.075], [.075, 0, .075], [-.075, .2, 0], [.075, .2, 0], [0, 0, .075]], span:80 });
    const ring = (r, y, n = 20) => Array.from({ length:n }, (_, i) => { const a = 2 * Math.PI * i / n; return P([r * Math.cos(a), y, r * Math.sin(a)]); });
    const rT = .065, rB = .045, h = .09, body = hullOf([...ring(rB, 0), ...ring(rT, h)]);
    const s0 = P([0, h, 0]), s1 = P([0, h + .07, 0]), s2 = P([0, h + .1, 0]);
    fin('bt_palanta', { hu:'palánta cserépben', en:'seedling in a terracotta pot', tilt:T, look:'young seedling in a small terracotta pot on a saucer, three-quarter view from slightly above: dark soil, a short green stem with two round seed leaves and two larger true leaves', shapes:[
      face('orange', 'dark', hullOf([...ring(.07, -.008), ...ring(.07, .006)])),
      face('orange', 'base', body),
      det('orange', 'light', clip(hullOf([...ring(rB, 0).slice(9, 13), ...ring(rT, h).slice(9, 13)]), body)),
      det('orange', 'dark', clip(hullOf([...ring(rB, 0).slice(0, 3), ...ring(rB, 0).slice(18), ...ring(rT, h).slice(0, 3), ...ring(rT, h).slice(18)]), body)),
      face('orange', 'light', hullOf([...ring(.071, h - .018), ...ring(.071, h + .004)])),
      det('soil', 'dark', ring(.06, h + .004)),
      pth('leaf', 'base', [band([s0, s2], 1.8), leafP(s1[0], s1[1], 200, 9, 6), leafP(s1[0], s1[1], -20, 9, 6), leafP(s2[0], s2[1], -125, 15, 8.5), leafP(s2[0], s2[1], -55, 15, 8.5)]),
      det('leaf', 'light', leafP(s2[0], s2[1], -125, 13, 4)), det('leaf', 'dark', leafP(s2[0] + 1, s2[1], -55, 13, 3.5)),
      shineP(band([P([-.05, .02, .03]), P([-.06, .07, .035])], 2), .6),
    ] });
  }

  // =====================================================================
  //  4. Magzacskó (felirat nélkül): krémszínű papírtasak hullámos zárással, ablakában csíra és nap, zöld sáv, kiszóródó magok
  // =====================================================================
  {
    const T = -14, W = .045, H = .13, D = .006, P = ART.geo.camera({ az:22, el:14, F:2, tilt:T, fit:fitBox(-W, W + .05, -.01, H + .012, -D, D), span:80 });
    const b = boxF(P, -W, W, 0, H, -D, D), F = pts => pts.map(([u, v]) => P([u, v, D + .0005]));
    const zig = [[-W, H], ...Array.from({ length:9 }, (_, i) => [-W + (i + .5) * 2 * W / 9, H + (i % 2 ? .004 : .011)]), [W, H], [W, H - .012], [-W, H - .012]];
    const win = F(Array.from({ length:16 }, (_, i) => { const a = 2 * Math.PI * i / 16; return [.033 * Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), .35), .068 + .03 * Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), .35)]; }));
    const sp = F([[0, .045]])[0], sp2 = F([[0, .07]])[0];
    const seed = (x, y, r) => circ(x, y, 2.2, 8, 1.5, r);
    fin('bt_magzacsko', { hu:'magzacskó', en:'seed packet', tilt:T, look:'paper seed packet without any text, cream colour with a crimped top edge, a window picture of a green sprout and a small sun, a green band at the bottom, a few seeds spilled beside it', shapes:[
      face('cream', 'dark', b.side), face('cream', 'light', b.top), face('cream', 'base', b.front),
      face('cream', 'dark', F(zig)),
      det('sky', 'light', win, { line:true }),
      det('soil', 'base', F([[-.03, .042], [-.015, .05], [.015, .05], [.03, .042]])),
      dpth('leaf', 'base', [band([sp, sp2], 1.2), leafP(sp2[0], sp2[1], -150, 7, 4.5), leafP(sp2[0], sp2[1], -30, 7, 4.5)]),
      det('honey', 'base', F(Array.from({ length:10 }, (_, i) => [.02 + .008 * Math.cos(i * .628), .085 + .008 * Math.sin(i * .628)]))),
      det('leaf', 'base', F([[-W, .012], [W, .012], [W, .026], [-W, .026]])),
      pth('cardboard', 'base', [seed(84, 82, 20), seed(90, 76, -30), seed(80, 90, 60)]),
      shineP(band([F([[-.036, .03]])[0], F([[-.036, .1]])[0]], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  5. Talicska: zöld teknő földdel, egy kerék elöl, két fogantyú, két láb – 3/4-es nézet felülről
  // =====================================================================
  {
    const T = -8, P = ART.geo.camera({ az:-32, el:26, F:4, tilt:T, fit:[...fitBox(-.62, .9, 0, .62, -.3, .3)], span:84 });
    const rim = [[-.3, .58, .27], [.42, .58, .27], [.42, .58, -.27], [-.3, .58, -.27]], bot = [[-.1, .3, .15], [.28, .3, .15], [.28, .3, -.15], [-.1, .3, -.15]];
    const tray = hullOf([...rim, ...bot].map(P)), open = rim.map(P);
    const wheel = Array.from({ length:18 }, (_, i) => { const a = 2 * Math.PI * i / 18; return P([-.42 + .2 * Math.cos(a), .2 + .2 * Math.sin(a), 0]); });
    const hub = Array.from({ length:10 }, (_, i) => { const a = 2 * Math.PI * i / 10; return P([-.42 + .06 * Math.cos(a), .2 + .06 * Math.sin(a), .03]); });
    const rod = (a, b, w) => band([P(a), P(b)], w);
    const soil = hullOf([...[[-.24, .58, .2], [.36, .58, .2], [.36, .58, -.2], [-.24, .58, -.2]].map(P), P([.06, .68, 0]), P([-.08, .66, .06])]);
    fin('bt_talicska', { hu:'talicska', en:'wheelbarrow with soil', tilt:T, look:'green garden wheelbarrow in three-quarter view from above: a deep tray filled with brown soil, one black wheel at the front, two long metal handles with dark grips and two legs at the back', shapes:[
      pth('steel', 'dark', [rod([.3, .42, -.2], [.86, .52, -.24], 3), rod([.22, .32, -.14], [.26, 0, -.18], 3)]),
      face('leaf', 'base', tray),
      det('leaf', 'light', [rim[0], rim[3], bot[3], bot[0]].map(P)),
      det('leaf', 'dark', [[.42, .58, .27], [.28, .3, .15], [-.1, .3, .15], [-.3, .58, .27]].map(P), { o:.45 }),
      det('leaf', 'dark', open),
      ...blob('soil', soil, P([.06, .62, 0]), { tilt:T, ld:3, dd:2.5, ed:1 }),
      { t:'line', pts:[...open, open[0]], m:'leaf', tone:'light', w:1.6 },
      face('dark', 'base', wheel), det('dark', 'light', clip(hullOf([...wheel.slice(7, 13), hub[5]]), wheel)), det('steel', 'base', hub),
      pth('steel', 'base', [rod([.3, .42, .2], [.86, .52, .24], 3), rod([.22, .32, .14], [.26, 0, .18], 3), rod([-.42, .2, .05], [-.12, .36, .14], 2.6)]),
      pth('dark', 'base', [rod([.74, .5, .23], [.92, .53, .245], 4.2), rod([.74, .5, -.23], [.92, .53, -.245], 4.2)]),
      shineP(band([P([-.2, .52, .27]), P([.25, .52, .27])], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  6. Tyúk (barna tojótyúk) oldalnézetben balra: piros taréj és toka, sárga csőr és láb, sötétebb farok és szárny
  // =====================================================================
  {
    const T = -4, body = smC([[22, 40], [24, 30], [32, 25], [39, 29], [41, 38], [50, 41], [64, 41], [76, 47], [80, 58], [76, 69], [64, 77], [48, 79], [36, 73], [29, 61], [24, 50]], 4);
    const tail = smC([[68, 46], [74, 27], [83, 17], [91, 22], [90, 38], [84, 52], [74, 56]], 3), tailD = smC([[76, 44], [81, 28], [87, 24], [87, 38], [81, 50]], 3);
    const wing = smC([[44, 52], [58, 47], [71, 51], [73, 61], [63, 67], [49, 63]], 4);
    fin('bt_tyuk', { hu:'tyúk (barna tojótyúk)', en:'brown laying hen', tilt:T, look:'brown laying hen in side view facing left: plump tan-brown body, darker brown upright tail feathers and folded wing, red comb and wattle, small yellow beak, yellow legs', shapes:[
      pth('honey', 'dark', [bar([[45, 77], [44, 89]], 2.8), bar([[58, 77], [60, 89]], 2.8), bar([[37, 90], [49, 90]], 2.4), bar([[53, 90], [66, 90]], 2.4)]),
      face('wood', 'base', tail), det('wood', 'dark', tailD),
      ...blob('cardboard', body, [52, 58], { tilt:T, ld:6, dd:6.5, ed:2 }),
      det('wood', 'base', wing, { line:true }), dpth('wood', 'dark', [bar([[52, 58], [67, 56]], .9), bar([[54, 62], [66, 61]], .9)], { o:.7 }),
      face('red', 'base', union([[27, 23, 3.6], [32, 20.5, 4], [37.5, 23, 3.4]], [32, 24])), face('red', 'base', smC([[22, 40], [26, 40], [26, 46], [23, 48], [20.5, 44]], 3)),
      face('honey', 'dark', [[23, 31.5], [13, 35], [23, 38.5]]),
      det('dark', 'base', circ(28.5, 32, 1.9, 10)),
      shineP(band([[38, 49], [50, 45]], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  7. Indiai futókacsa: egyenes, „palack” tartású fehér kacsa, hosszú nyak, narancssárga csőr és láb
  // =====================================================================
  {
    const T = 4, sil = smC([[40, 18], [44, 11.5], [51, 11.5], [55, 17], [53, 25], [51, 35], [53, 45], [60, 57], [64, 69], [69, 82], [61, 88], [48, 88], [38, 82], [33, 70], [34, 57], [40, 46], [43, 36], [43, 27], [40, 22]], 4);
    const wing = smC([[47, 50], [57, 56], [64, 70], [62, 81], [53, 73], [46, 61]], 4);
    fin('bt_kacsa', { hu:'indiai futókacsa', en:'Indian runner duck', tilt:T, look:'white Indian runner duck standing very upright like a bottle, side view facing left: long slim neck, small head, orange-yellow flat bill, folded wing outline, orange legs and webbed feet', shapes:[
      pth('orange', 'base', [bar([[46, 86], [45, 94]], 2.8), bar([[55, 86], [57, 94]], 2.8), leafP(45, 94, 180, 9, 4.5), leafP(57, 94, 175, 9, 4.5)]),
      ...blob('white', sil, [49, 62], { tilt:T, ld:4.5, dd:6, ed:2 }),
      det('white', 'dark', wing, { line:true }), det('white', 'line', bar([[51, 60], [60, 74]], .9), { o:.4 }),
      face('orange', 'base', [[41, 15.5], [27.5, 19.5], [28.5, 23], [41.5, 21.5]]), det('orange', 'dark', [[34, 21.8], [28.5, 23], [27.5, 21], [41, 20]]),
      det('dark', 'base', circ(46.5, 16.5, 1.7, 10)),
      shineP(band([[38, 52], [37, 66]], 2), .6),
    ] });
  }

  // =====================================================================
  //  8. Fóliasátor: áttetsző, íves fólia acél abroncsokkal, homlokfal faajtóval, bent paradicsom-tövek, deszka a tövén
  // =====================================================================
  {
    const T = -8, a = .5, h = .55, Z = .6, P = ART.geo.camera({ az:32, el:18, F:5, tilt:T, fit:fitBox(-a, a, 0, h, -Z, Z), span:84 });
    const arc = (z, t0 = 0, t1 = 180, n = 12) => Array.from({ length:n + 1 }, (_, i) => { const t = rad(t0 + (t1 - t0) * i / n); return P([a * Math.cos(t), h * Math.sin(t), z]); });
    const sil = hullOf([...arc(Z), ...arc(-Z)]), strip = (t0, t1) => [...arc(Z, t0, t1, 5), ...arc(-Z, t0, t1, 5).reverse()];
    const plant = (x, y) => union([[x, y, 4.2], [x - 3, y + 3, 3.6], [x + 3, y + 2.5, 3.6], [x, y - 3.5, 3]], [x, y]);
    const p1 = P([-.22, .2, .5]), p2 = P([.2, .2, .5]);
    fin('bt_folia', { hu:'fóliasátor', en:'polytunnel', tilt:T, look:'garden polytunnel in three-quarter view: translucent pale blue plastic stretched over half-round metal hoops, a wooden door frame in the front end wall, green tomato plants visible inside, wooden base boards', shapes:[
      face('glass', 'base', sil),
      det('glass', 'light', strip(95, 165)), det('glass', 'dark', strip(0, 50)), det('glass', 'line', strip(0, 12), { o:.35 }),
      dpth('leaf', 'base', [plant(p1[0], p1[1]), plant(p2[0], p2[1])], { o:.7 }), dpth('tomato', 'base', [circ(p1[0] + 2, p1[1] + 2, 1.6, 8), circ(p2[0] - 2, p2[1] + 1, 1.6, 8)], { o:.8 }),
      det('glass', 'light', [...arc(Z), P([a, 0, Z])], { o:.55, line:true }),
      face('wood', 'base', [[-.15, 0, Z], [.15, 0, Z], [.15, .4, Z], [-.15, .4, Z]].map(P)), det('glass', 'dark', [[-.11, .02, Z + .001], [.11, .02, Z + .001], [.11, .36, Z + .001], [-.11, .36, Z + .001]].map(P)),
      ...[.3, 0, -.3].map(z => ({ t:'line', pts:arc(z, 0, 180, 10), m:'steel', tone:'base', w:1.3 })),
      face('wood', 'dark', [[a, 0, Z], [a, 0, -Z], [a, .06, -Z], [a, .06, Z]].map(P)),
      shineP(band(arc(.2, 118, 150, 4), 2), .6),
    ] });
  }

  // =====================================================================
  //  9. Szikkasztó árok (swale): földtömb metszete – a szintvonalon futó sekély árok vízzel, mögötte beültetett töltés bokorral és virággal,
  //     esőcseppek az árok fölött
  // =====================================================================
  {
    const T = -6, Z = .45, P = ART.geo.camera({ az:25, el:32, F:5, tilt:T, fit:fitBox(-.7, .7, -.18, .42, -Z, Z), span:84 });
    const prof = [[-.7, .1], [-.44, .1], [-.36, .02], [-.26, -.03], [-.16, -.02], [-.06, .06], [.06, .26], [.18, .32], [.3, .27], [.44, .14], [.7, .1]];
    const seg = (i0, i1, z0 = Z, z1 = -Z, dy = 0) => { const q = prof.slice(i0, i1 + 1); return [...q.map(([x, y]) => P([x, y + dy, z0])), ...q.reverse().map(([x, y]) => P([x, y + dy, z1]))]; };
    const front = [P([-.7, -.18, Z]), P([.7, -.18, Z]), ...[...prof].reverse().map(([x, y]) => P([x, y, Z]))];
    const humus = [...prof.map(([x, y]) => P([x, y, Z])), ...[...prof].reverse().map(([x, y]) => P([x, y - .06, Z]))];
    const sh = P([.18, .4, -.08]), shrub = union([[sh[0], sh[1], 7], [sh[0] - 6, sh[1] + 3, 5.5], [sh[0] + 6, sh[1] + 2.5, 5.5], [sh[0] + 1, sh[1] - 5, 5]], sh);
    const drop = (x, y) => smC([[x, y - 4], [x + 2.2, y], [x, y + 2.2], [x - 2.2, y]], 3);
    const dr1 = P([-.3, .3, .1]), dr2 = P([-.18, .24, -.15]), fl = [P([.36, .25, .2]), P([.08, .27, .25]), P([.46, .17, -.1])];
    fin('bt_arok', { hu:'szikkasztó árok (swale)', en:'swale with planted berm', tilt:T, look:'cross-section block of land in three-quarter view: a shallow ditch on contour holding a strip of blue water, behind it a raised green berm with a round shrub and small flowers, dark topsoil layer over brown subsoil, two raindrops falling into the ditch', shapes:[
      face('soil', 'base', front), det('soil', 'dark', humus), face('soil', 'dark', [P([.7, -.18, Z]), P([.7, -.18, -Z]), P([.7, .1, -Z]), P([.7, .1, Z])]),
      det('soil', 'line', [P([.7, -.18, -Z + .06]), P([.7, -.18, -Z]), P([.7, .1, -Z]), P([.7, .1, -Z + .06])], { o:.4 }),
      face('grass', 'light', seg(0, 2)), face('soil', 'light', seg(2, 5)), det('water', 'base', seg(2, 4, Z, -Z, .03)), { t:'line', pts:[P([-.28, .0, .3]), P([-.25, .0, -.3])], m:'water', tone:'light', w:1.6 },
      face('grass', 'base', seg(5, 10)), det('grass', 'light', seg(6, 8, Z, -Z, .002)),
      ...blob('leaf', shrub, sh, { tilt:T, ld:3, dd:3, ed:1 }),
      dpth('honey', 'base', fl.map(([x, y]) => circ(x, y, 1.8, 8))),
      pth('water', 'base', [drop(dr1[0], dr1[1]), drop(dr2[0], dr2[1])]),
    ] });
  }

  // =====================================================================
  //  10. Terményes láda: léces fa láda, kilóg belőle saláta, sütőtök, répa zöldjével, paradicsom
  // =====================================================================
  {
    const T = -10, X = .25, H = .2, Z = .16, P = ART.geo.camera({ az:30, el:28, F:3, tilt:T, fit:fitBox(-X, X + .02, 0, H + .14, -Z, Z + .05), span:82 }), b = boxF(P, -X, X, 0, H, -Z, Z);
    const lt = P([-.12, .25, -.06]), pk = P([.12, .23, -.05]), tm = P([.09, .21, .07]), tm2 = P([.16, .2, .1]);
    const lettuce = union([[lt[0], lt[1], 9], [lt[0] - 7, lt[1] + 3, 6.5], [lt[0] + 7, lt[1] + 2, 6.5], [lt[0], lt[1] - 6, 6]], lt);
    const pump = circ(pk[0], pk[1], 9.5, 18, 7.5), c0 = P([-.03, .17, .08]), c1 = P([-.2, .33, .12]);
    fin('bt_kosar', { hu:'terményes láda', en:'wooden crate of fresh vegetables', tilt:T, look:'slatted wooden harvest crate in three-quarter view filled with fresh vegetables: a green lettuce, a small orange pumpkin, carrots with green tops and two red tomatoes poking out over the rim', shapes:[
      det('wood', 'dark', b.top),
      ...blob('leaf', lettuce, lt, { tilt:T, ld:3, dd:0, ed:0 }),
      face('orange', 'base', pump), dpth('orange', 'dark', [bar([[pk[0] - 3, pk[1] - 7], [pk[0] - 4, pk[1] + 6]], 1), bar([[pk[0] + 3.5, pk[1] - 7], [pk[0] + 4, pk[1] + 6]], 1)]),
      face('leaf', 'dark', band([[pk[0], pk[1] - 7], [pk[0] + 1, pk[1] - 11]], 2.4)),
      face('orange', 'base', taper([c0, c1], 6.5, 2.5)), face('leaf', 'base', union([[c1[0] - 2, c1[1] - 4, 3.5], [c1[0] + 2, c1[1] - 5, 3.5], [c1[0] - 5, c1[1] - 1, 3]], [c1[0], c1[1] - 3])),
      pth('tomato', 'base', [circ(tm[0], tm[1], 6, 16), circ(tm2[0], tm2[1], 5.5, 16)]), det('tomato', 'light', circ(tm[0] - 2, tm[1] - 2, 2, 8)),
      face('wood', 'base', b.front), face('wood', 'dark', b.side), det('wood', 'line', [[X, 0, -Z + .03], [X, 0, -Z], [X, H, -Z], [X, H, -Z + .03]].map(P), { o:.4 }),
      det('wood', 'line', [[-X, .095, Z], [X, .095, Z], [X, .11, Z], [-X, .11, Z]].map(P), { o:.8 }),
      det('wood', 'light', [[-X, H - .018, Z], [X, H - .018, Z], [X, H, Z], [-X, H, Z]].map(P)),
      det('dark', 'base', circ(0, 0, 1, 12).map(([u, v]) => P([u * .06, .16 + v * .016, Z + .001]))),
      shineP(band([P([-X + .03, .04, Z]), P([-X + .03, .085, Z])], 1.8), .55),
    ] });
  }

  // =====================================================================
  //  11. Komposzthalom: barna kupac zöld levéllel, szalmával, tojáshéjjal, narancshéjjal; gőzölög (dolgozik), vasvilla áll benne
  // =====================================================================
  {
    const T = 0, sil = smC([[10, 82], [13, 68], [22, 54], [36, 43], [52, 40], [67, 45], [79, 56], [87, 69], [90, 82], [50, 85]], 5);
    const steam = x => smO([[x, 36], [x + 3, 30], [x - 1, 24], [x + 2, 17]], 4);
    fin('bt_komposzt_halom', { hu:'komposzthalom', en:'steaming compost heap', tilt:T, look:'garden compost heap: a dome of dark brown crumbly compost with green leaf scraps, straw bits, an eggshell and an orange peel, two wisps of steam rising, a garden fork stuck in its side', shapes:[
      face('wood', 'base', band([[70, 52], [86, 12]], 3.6)), face('wood', 'dark', band([[83, 15], [89, 7]], 6)), face('steel', 'base', band([[69, 54], [72, 47]], 5)),
      ...blob('soil', sil, [50, 66], { tilt:T, ld:6, dd:6.5, ed:2 }),
      dpth('leaf', 'base', [leafP(30, 60, -30, 10, 5), leafP(55, 50, 20, 9, 4.5), leafP(68, 70, -10, 9, 4.5)], { line:true }),
      dpth('cardboard', 'light', [bar([[38, 70], [48, 66]], 1.4), bar([[60, 60], [70, 63]], 1.4), bar([[22, 74], [30, 72]], 1.4)]),
      det('white', 'base', [[44, 54], [47, 51], [49, 53.5], [51, 50.5], [53, 54], [50, 57.5], [45, 57]], { line:true }),
      det('orange', 'base', smC([[32, 48], [40, 46], [42, 50], [34, 52]], 3), { line:true }),
      { t:'line', pts:steam(40), m:'paper', tone:'light', w:2, o:.9 }, { t:'line', pts:steam(56), m:'paper', tone:'light', w:2, o:.9 },
      shineP(band([[28, 54], [40, 46]], 2), .5),
    ] });
  }

  // =====================================================================
  //  12. Szalmatakarás (mulcs): földszelet vastag aranyló szalmaréteggel, a szalmán át két salátapalánta bújik ki
  // =====================================================================
  {
    const T = -10, L = .5, D = .35, H = .12, M = .23, P = ART.geo.camera({ az:28, el:30, F:5, tilt:T, fit:fitBox(-L, L, 0, M + .08, -D, D), span:80 });
    const soil = boxF(P, -L, L, 0, H, -D, D), n = 10;
    const zig = (y0, y1, z) => [...Array.from({ length:n + 1 }, (_, i) => [-L + 2 * L * i / n, y0 - (i % 2 ? .008 : 0), z]), ...Array.from({ length:n + 1 }, (_, i) => [L - 2 * L * i / n, y1 + (i % 2 ? .01 : 0), z])].map(P);
    const top = [[-L, M, D], [L, M, D], [L, M, -D], [-L, M, -D]].map(P);
    const straw = (x, z, a) => { const d = [.09 * Math.cos(rad(a)), .09 * Math.sin(rad(a))]; return bar([P([x - d[0], M + .003, z - d[1]]), P([x + d[0], M + .003, z + d[1]])], 1.7); };
    const rose = p => union([[p[0], p[1], 5], [p[0] - 4.5, p[1] + 1.5, 4], [p[0] + 4.5, p[1] + 1.5, 4], [p[0], p[1] - 3.5, 3.6]], p);
    const r1 = P([-.18, M + .05, .05]), r2 = P([.22, M + .05, -.12]);
    fin('bt_mulcs', { hu:'szalmatakarás (mulcs)', en:'straw mulch on a garden bed', tilt:T, look:'slice of garden bed in three-quarter view: brown soil block covered by a thick golden straw mulch layer with loose straw strands, two small lettuce seedlings poking through the straw', shapes:[
      face('soil', 'base', soil.front), face('soil', 'dark', soil.side),
      face('cardboard', 'base', zig(H, M, D)), face('cardboard', 'dark', [[L, H, D], [L, H, -D], [L, M, -D], [L, M, D]].map(P)),
      face('cardboard', 'light', top),
      dpth('honey', 'dark', [straw(-.3, .2, 20), straw(.1, .1, -35), straw(-.05, -.2, 60), straw(.32, .15, 80), straw(-.32, -.15, -10), straw(.36, -.05, 30), straw(-.02, .24, 5), straw(.18, -.24, -60)]),
      dpth('cardboard', 'base', [straw(.0, .25, -70), straw(.3, -.2, 15), straw(-.18, -.05, 130), straw(-.36, .05, 75), straw(.12, -.02, 100)]),
      face('leaf', 'base', rose(r1)), det('leaf', 'light', circ(r1[0] - 1, r1[1] - 1.5, 2.6, 8)),
      face('leaf', 'base', rose(r2)), det('leaf', 'light', circ(r2[0] - 1, r2[1] - 1.5, 2.6, 8)),
      shineP(band([P([-L + .08, M, -D + .08]), P([-.1, M, -D + .08])], 1.8), .6),
    ] });
  }

  // ---------------- termés-segédek (13–18.) ----------------
  // pontok forgatása a c körül (fok)
  const rotP = (pts, c, deg) => pts.map(([x, y]) => [c[0] + (x - c[0]) * cos(deg) - (y - c[1]) * sin(deg), c[1] + (x - c[0]) * sin(deg) + (y - c[1]) * cos(deg)]);
  // több, egymást NEM fedő gömbölyű termés 4 tónusban, 4 alakzatban: alap + világos sarló + sötét sarló + élsáv (list: [[sziluett, középpont], …])
  const blobs = (m, list, o = {}) => { const T = o.tilt || 0, D = 45 - T;
    return [pth(m, o.bt || 'base', list.map(l => l[0])),
      dpth(o.lm || m, 'light', list.map(([s, c]) => crescent(s, c, LA - T, o.lh || 80, o.ld || 4))),
      dpth(o.dm || m, 'dark', list.map(([s, c]) => crescent(s, c, D, o.dh || 78, o.dd || 4))),
      dpth(o.dm || m, 'line', list.map(([s, c]) => crescent(s, c, D, o.eh || 58, o.ed || 1.4)), { o:.35 })]; };
  // pont a (ritkított) gerincvonal f hányadánál
  const at = (sp, f) => sp[Math.round(f * (sp.length - 1))];

  // =====================================================================
  //  13. Retek (csomó): három piros gumó fehér gyökérfarokkal, a száraik egy rafiával átkötve, felül nagy zöld levelek
  // =====================================================================
  {
    const T = -8, tie = [56, 40];
    const R = [[36, 70, 12], [60, 76, 13], [79, 63, 10.5]].map(([x, y, r]) => { const ang = Math.atan2(y - tie[1], x - tie[0]) * 180 / Math.PI; return { c:[x, y], r, ang, u:[cos(ang), sin(ang)] }; });
    // a gumó: felül szélesebb, alul a farok felé csúcsosodik; a tengelye a csomó kötése felől mutat
    const root = ({ c:[cx, cy], r, ang }) => rotP(Array.from({ length:28 }, (_, i) => { const t = 2 * Math.PI * i / 28, q = r * (1 + .24 * Math.pow(max(0, Math.sin(t)), 8));
      return [cx + q * Math.cos(t) * 1.04, cy + q * Math.sin(t)]; }), [cx, cy], ang - 90);
    const tail = ({ c, r, u }) => { const p0 = [c[0] + u[0] * r * 1.12, c[1] + u[1] * r * 1.12], nv = [-u[1], u[0]];
      return taper(smO([p0, [p0[0] + u[0] * 6 + nv[0] * 1.5, p0[1] + u[1] * 6 + nv[1] * 1.5], [p0[0] + u[0] * 15 - nv[0] * .5, p0[1] + u[1] * 15 - nv[1] * .5]], 3), 3.4, .8); };
    const stem = ({ c, r, u }) => band([tie, [c[0] - u[0] * .9 * r, c[1] - u[1] * .9 * r]], 2.4);
    const lf = (deg, len, wid) => leafP(tie[0], tie[1] - 2, deg, len, wid, 8);
    const rib = (deg, len) => bar([[tie[0], tie[1] - 2], [tie[0] + cos(deg) * len * .85, tie[1] - 2 + sin(deg) * len * .85]], 1);
    fin('bt_retek', { hu:'retek (csomó)', en:'bunch of red radishes', tilt:T, look:'bunch of three round red radishes with thin white root tails, their green stems tied together with a raffia band, large fresh green leaves fanning out above', shapes:[
      pth('leaf', 'base', [lf(-152, 30, 15), lf(-98, 36, 16), lf(-38, 32, 15)]),
      pth('grass', 'base', [lf(-124, 33, 17), lf(-68, 34, 17)]),
      det('grass', 'light', leafP(tie[0] - 1, tie[1] - 3, -128, 27, 7)),
      dpth('leaf', 'dark', [rib(-124, 33), rib(-68, 34), rib(-152, 30), rib(-98, 36), rib(-38, 32)], { o:.8 }),
      pth('grass', 'base', R.map(stem)),
      pth('white', 'base', R.map(tail)),
      ...blobs('red', [R[0], R[2]].map(q => [root(q), q.c]), { tilt:T, ld:3.5, dd:3.5 }),
      ...blobs('red', [[root(R[1]), R[1].c]], { tilt:T, ld:4, dd:4 }),
      face('cardboard', 'base', band([[tie[0] - 6, tie[1] + 4], [tie[0] + 6, tie[1] + 4.5]], 4.2)),
      shineP(circ(R[1].c[0] - 5, R[1].c[1] - 5, 2.6, 8, 1.8, -40), .75),
    ] });
  }

  // =====================================================================
  //  14. Borsó: hátul egy zárt hüvely (kidudorodó szemekkel), elöl egy kinyitott hüvely sorban fekvő zöld borsószemekkel, csészelevél, kacs
  // =====================================================================
  {
    const T = -10, W = wm => t => wm * Math.pow(Math.sin(Math.PI * min(1, max(0, t))), .55) + .4;
    const spA = smO([[14, 32], [34, 23], [60, 22], [82, 29], [91, 23]], 5), spB = smO([[10, 60], [32, 71], [60, 73], [83, 63], [93, 55]], 5);
    const A = tube(spA, W(14), { tilt:T }), B = tube(spB, W(21), { tilt:T });
    const cav = band(spB.map(([x, y]) => [x, y - 1.6]), t => 14 * Math.pow(Math.sin(Math.PI * t), .8) + .2);
    const peas = [.2, .32, .44, .56, .68, .8].map(f => { const p = at(spB, f); return [p[0], p[1] - 2]; });
    const pea = peas.map(([x, y]) => circ(x, y, 5.3, 12));
    const lip = band(spB.map(([x, y]) => [x, y + 3.6]), t => 6 * Math.pow(Math.sin(Math.PI * t), .7) + .2);
    const bumps = [.3, .45, .6, .75].map(f => { const p = at(spA, f); return circ(p[0], p[1] - 1, 3.6, 8, 2.8); });
    const calyx = (p, deg) => [leafP(p[0], p[1], deg, 7, 3.5), leafP(p[0], p[1], deg - 40, 6, 3), leafP(p[0], p[1], deg + 40, 6, 3)];
    fin('bt_borso', { hu:'borsó', en:'green pea pods, one open', tilt:T, look:'two bright green pea pods: a closed plump pod behind with the bumps of the peas showing, and an opened pod in front with a row of six round green peas inside its pale lining, small green calyx at the stalk ends, a curly tendril', shapes:[
      { t:'line', pts:smO([[14, 32], [7, 27], [7, 18], [13, 16], [13, 21]], 4), m:'leaf', tone:'dark', w:1.4 },
      face('grass', 'base', A.sil), det('grass', 'light', A.light), dpth('grass', 'light', bumps, { o:.85 }), det('grass', 'dark', A.dark), det('grass', 'line', A.edge, { o:.35 }),
      face('grass', 'base', B.sil), det('grass', 'dark', B.dark),
      det('sage', 'base', cav),
      pth('grass', 'base', pea), dpth('grass', 'dark', pea.map((s, i) => crescent(s, peas[i], 45 - T, 78, 1.8))), dpth('grass', 'light', peas.map(([x, y]) => circ(x - 1.6, y - 1.7, 1.6, 8))),
      det('grass', 'light', lip, { line:true }),
      pth('leaf', 'base', [...calyx(spA[0], 200), ...calyx(spB[0], 165)]),
      shineP(band([at(spA, .3), at(spA, .55)].map(([x, y]) => [x, y - 4.5]), 1.6), .6),
    ] });
  }

  // =====================================================================
  //  15. Zöldbab (csomó): öt hosszú, vékony, enyhén ívelt hüvely (kettő hátul sötétebb), szárvéggel, a közepén rafiával átkötve
  // =====================================================================
  {
    const T = -12, dv = [.99, .12], nv = [.12, -.99], K = 8.2;
    // a hüvely gerince: k = sorszám a csomóban (nv irányban eltolva), cu = a vékony csúcs felkunkorodása, s0 = a szárvég helye
    const spine = (k, cu, s0) => smO([[6 + s0, 44 + s0 * .18], [28, 48], [52, 51], [74, 50], [86, 47 - cu * .3], [92 + abs(cu) * .2, 43 - cu]].map(([x, y]) => [x + nv[0] * k * K, y + nv[1] * k * K]), 5);
    // keskeny, kihegyesedő vég, a szemek helyén enyhe dudorok
    const W = t => (6.4 * Math.pow(min(1, Math.sin(Math.PI * t) * 1.7), .7) + .3) * (1 + .08 * Math.sin(2 * Math.PI * 6.5 * t) * Math.sin(Math.PI * t));
    const P5 = [[-2, -11, 8], [-1, -5, 3], [0, 1, 0], [1, 6, 5], [2, 12, 10]].map(([k, cu, s0]) => ({ k, sp:spine(k, cu, s0) }));
    const pods = P5.map(q => Object.assign(q, tube(q.sp, W, { tilt:T })));
    const back = pods.filter(q => q.k % 2), front = pods.filter(q => !(q.k % 2));
    const tops = pods.map(({ sp }) => { const q = sp[0]; return bar([q, [q[0] - dv[0] * 6 + nv[0] * 1.8, q[1] - dv[1] * 6 + nv[1] * 1.8]], 1.8); });
    const c0 = at(pods[2].sp, .3), tieB = band([[c0[0] - nv[0] * 21, c0[1] - nv[1] * 21], [c0[0] + nv[0] * 21, c0[1] + nv[1] * 21]], 5.5);
    const tieL = band([[c0[0] - nv[0] * 20 - dv[0] * 1.2, c0[1] - nv[1] * 20 - dv[1] * 1.2], [c0[0] + nv[0] * 20 - dv[0] * 1.2, c0[1] + nv[1] * 20 - dv[1] * 1.2]], 1.6);
    fin('bt_bab', { hu:'zöldbab (csomó)', en:'bunch of green French beans', tilt:T, look:'bunch of five long slim green French bean pods lying side by side, gently curved with slightly bumpy sides and thin pointed tips that curl, two darker ones behind, short stalk ends at the left, tied in the middle with a raffia band', shapes:[
      pth('leaf', 'dark', tops),
      pth('leaf', 'base', back.map(p => p.sil)), dpth('leaf', 'light', back.map(p => p.light), { o:.8 }),
      pth('grass', 'base', front.map(p => p.sil)), dpth('grass', 'light', front.map(p => p.light)), dpth('grass', 'dark', front.map(p => p.dark)), dpth('grass', 'line', front.map(p => p.edge), { o:.35 }),
      face('cardboard', 'base', tieB), det('cardboard', 'light', tieL),
      shineP(band([at(pods[2].sp, .48), at(pods[2].sp, .66)].map(([x, y]) => [x - nv[0] * 1.6, y - nv[1] * 1.6]), 1.4), .6),
    ] });
  }

  // =====================================================================
  //  16. Meggy: két sötétpiros szem hosszú száron, a szárak felül egy termőnyárson találkoznak, mellettük egy fogazott levél
  // =====================================================================
  {
    const T = 8, cA = [36, 68], cB = [67, 72], r = 15;
    // gömb, a szár tövénél kis bemélyedéssel
    const cher = ([cx, cy]) => Array.from({ length:24 }, (_, i) => { const a = -90 + 15 * i, da = min(abs(a + 90), abs(a - 270)), q = 1 - .13 * Math.exp(-Math.pow(da / 22, 2));
      return [cx + r * q * cos(a), cy + r * q * .95 * sin(a)]; });
    const top = c => [c[0], c[1] - r * .84], J = [54, 14];
    const lv = leafP(J[0] + 1, J[1], -14, 38, 15, 8);
    fin('bt_meggy', { hu:'meggy', en:'pair of sour cherries with a leaf', tilt:T, look:'pair of glossy dark red sour cherries hanging on long thin green stems that join at the top on a small woody spur, one green leaf with a midrib beside them', shapes:[
      pth('leaf', 'base', [band(smO([top(cA), [38, 42], [46, 26], J], 4), 2.2), band(smO([top(cB), [64, 42], [58, 26], J], 4), 2.2)]),
      face('leaf', 'base', lv), det('leaf', 'light', leafP(J[0] + 3, J[1] - 1.5, -20, 32, 6.5, 6)),
      dpth('leaf', 'dark', [bar([[J[0] + 1, J[1]], [J[0] + 34, J[1] - 8.5]], 1), bar([[J[0] + 13, J[1] - 3.2], [J[0] + 19, J[1] + 2.5]], .8), bar([[J[0] + 22, J[1] - 5.5], [J[0] + 28, J[1] - .5]], .8)], { o:.8 }),
      face('wood', 'base', circ(J[0], J[1], 3.2, 10)),
      ...blobs('berry', [[cher(cA), cA], [cher(cB), cB]], { tilt:T, ld:4.5, dd:4.5, ed:1.6 }),
      dpth('berry', 'line', [circ(top(cA)[0], top(cA)[1] + 1.2, 2.6, 8, 1.2), circ(top(cB)[0], top(cB)[1] + 1.2, 2.6, 8, 1.2)], { o:.55 }),
      dpth('paper', 'light', [circ(cA[0] - 6, cA[1] - 5, 3.4, 10, 2.2, -40), circ(cB[0] - 6, cB[1] - 5, 3.4, 10, 2.2, -40), circ(cA[0] - 9.5, cA[1] + 1, 1.2, 6), circ(cB[0] - 9.5, cB[1] + 1, 1.2, 6)], { o:.8 }),
    ] });
  }

  // =====================================================================
  //  17. Málna: két szem (apró, gömbölyű csonthéjas „szemecskékből” álló kúpos termés) zöld csészelevéllel, mögöttük egy fogazott levél;
  //      a szemecskék fénye csak a megvilágított oldalon (az árnyékos sarlón nincs – így kisebb is az SVG)
  // =====================================================================
  {
    const T = -6;
    // a szemecskék középpontjai: félgömb-kúp, soronként eltolva; s = méret, ang = a tengely iránya (90 = csúcs lefelé)
    const drupes = (cx, cy, s, ang) => { const out = [];
      for(let j = 0; j < 5; j++){ const y = -10.5 + j * 5.3, hw = 12.4 * Math.sqrt(max(0, 1 - Math.pow(y / 15.5, 2))) * (y > 0 ? 1 - y / 38 : 1), n = max(1, Math.round(2 * hw / 5.4));
        for(let i = 0; i < n; i++){ const x = n === 1 ? 0 : -hw + 3 + (2 * hw - 6) * i / (n - 1) + (j % 2 ? .6 : -.6); out.push([x, y]); } }
      return out.map(([x, y]) => rotP([[cx + x * s, cy + y * s]], [cx, cy], ang - 90)[0]); };
    const berry = (cx, cy, s, ang) => { const D = drupes(cx, cy, s, ang); return { c:[cx, cy], s, ang, D, sil:simplify(union(D.map(([x, y]) => [x, y, 3.4 * s]), [cx, cy]), .4) }; };
    const A = berry(42, 63, 1.15, 98), B = berry(73, 47, .9, 72);
    const sep = q => { const u = [cos(q.ang), sin(q.ang)], p = [q.c[0] - u[0] * 13.5 * q.s, q.c[1] - u[1] * 13.5 * q.s];
      return [...[-60, -20, 20, 60].map(d => leafP(p[0], p[1], q.ang + 180 + d, 9 * q.s, 4.4 * q.s, 4)), band([p, [p[0] - u[0] * 6 * q.s, p[1] - u[1] * 6 * q.s]], 2)]; };
    // fogazott levél: a szélesség pontonként váltakozik
    const serr = (x, y, deg, len, wid, n = 14) => { const d = [cos(deg), sin(deg)], nr = [-d[1], d[0]], L = [], Rr = [];
      for(let i = 0; i <= n; i++){ const t = i / n, w = wid / 2 * Math.pow(Math.sin(Math.PI * t), .75) * (i % 2 ? .84 : 1), c = [x + d[0] * len * t, y + d[1] * len * t];
        L.push([c[0] + nr[0] * w, c[1] + nr[1] * w]); Rr.push([c[0] - nr[0] * w, c[1] - nr[1] * w]); }
      return [...L, ...Rr.reverse().slice(1, -1)]; };
    const L0 = [60, 30];
    fin('bt_malna', { hu:'málna', en:'two raspberries with a leaf', tilt:T, look:'two ripe red raspberries made of many small round drupelets, rounded-cone shape, small green calyx and stalk on top, a serrated green raspberry leaf with veins behind them', shapes:[
      face('leaf', 'base', serr(L0[0], L0[1], -158, 46, 24, 12)), det('leaf', 'light', serr(L0[0] - 2, L0[1] - 3, -164, 38, 9, 8)),
      dpth('leaf', 'dark', [bar([L0, [L0[0] - 42 * cos(22), L0[1] - 42 * sin(22)]], 1.1), ...[.3, .55].flatMap(f => { const p = [L0[0] - 46 * f * cos(22), L0[1] - 46 * f * sin(22)];
        return [bar([p, [p[0] - 8, p[1] - 8]], .8), bar([p, [p[0] - 2, p[1] + 9]], .8)]; })], { o:.75 }),
      ...blobs('red', [[A.sil, A.c], [B.sil, B.c]], { tilt:T, bt:'dark', ld:3.5, dd:5, ed:1.8, dm:'berry', lm:'red' }),
      dpth('red', 'base', [A, B].flatMap(q => q.D.filter(([x, y]) => (x - q.c[0]) * cos(45 - T) + (y - q.c[1]) * sin(45 - T) < 4.5 * q.s)).map(([x, y]) => circ(x - .6, y - .7, 2.1, 7))),
      pth('leaf', 'base', [...sep(A), ...sep(B)]),
      shineP(circ(A.c[0] - 7, A.c[1] - 4, 2.6, 8, 1.8, -50), .7),
    ] });
  }

  // =====================================================================
  //  18. Befőtt (címke nélkül): üvegtégely piros csavaros tetővel, benne világos szirupban barackfelek; üvegfény a bal oldalon
  // =====================================================================
  {
    const T = 6, Rj = .045, P = ART.geo.camera({ az:0, el:20, F:3, tilt:T, fit:[[-Rj, 0, -Rj], [Rj, 0, Rj], [-Rj, .155, 0], [Rj, .155, 0], [0, 0, Rj]], span:80 });
    const ring = (r, y, n = 20) => Array.from({ length:n }, (_, i) => { const a = 2 * Math.PI * i / n; return P([r * Math.cos(a), y, r * Math.sin(a)]); });
    const body = hullOf([...ring(Rj, 0), ...ring(Rj, .1), ...ring(.036, .118), ...ring(.036, .134)]);
    const sideS = (r0, y0, r1, y1, ix, sh) => clip(hullOf([...ix.flatMap(i => [ring(r0, y0)[i], ring(r1, y1)[i]])]), sh);
    const fr = [[50, .019], [90, .017], [130, .019], [70, .049], [110, .049], [50, .079], [90, .077], [130, .079]].map(([a, y]) => P([.9 * Rj * cos(a), y, .9 * Rj * sin(a)]));
    const rf = .0118 * P.k, fruit = fr.map(([x, y]) => circ(x, y, rf, 14, rf * .92));
    const lid = hullOf([...ring(.041, .134), ...ring(.041, .153)]);
    fin('bt_befott', { hu:'befőtt (üvegben)', en:'glass jar of preserved fruit', tilt:T, look:'glass preserve jar without any label, a red screw lid on top, inside pale golden syrup with orange apricot halves pressed against the glass, a white glare stripe on the left side of the glass', shapes:[
      face('glass', 'base', body),
      det('honey', 'light', clip(hullOf([...ring(Rj - .002, .005), ...ring(Rj - .002, .092)]), body), { o:.95 }),
      det('honey', 'base', ring(Rj - .002, .092), { o:.45 }),
      pth('orange', 'base', fruit), dpth('orange', 'dark', fruit.map((s, i) => crescent(s, fr[i], 45 - T, 80, 2))), dpth('orange', 'light', fr.map(([x, y]) => circ(x - rf * .3, y - rf * .3, rf * .4, 8))),
      det('glass', 'dark', sideS(Rj, 0, Rj, .1, [0, 1, 2, 18, 19], body), { o:.55 }),
      det('glass', 'line', sideS(Rj, 0, Rj, .1, [0, 1, 19], body), { o:.3 }),
      det('glass', 'dark', [...ring(Rj, 0).slice(0, 11), ...ring(Rj, .008).slice(0, 11).reverse()], { o:.5 }),
      det('glass', 'light', sideS(Rj, .01, .036, .125, [10, 11, 12], body), { o:.75 }),
      face('red', 'base', lid), det('red', 'dark', sideS(.041, .134, .041, .153, [0, 1, 2, 18, 19], lid)), face('red', 'light', ring(.041, .153)),
      shineP(band([P([-.036, .016, .028]), P([-.037, .09, .028])], 2.4), .75),
    ] });
  }
})();
});
