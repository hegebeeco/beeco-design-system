// ============================================================
//  Matricák — Méhpilóta (kaptar / kp) B szinten (docs/rajzolas.md): méhanya, szalmakas, keretes kaptár, lárva a sejtben,
//  rezgőtánc, mézgyomor-mérő, gyurgyalag, darázs. A játékban ~44–64 px-en jelennek meg (artIcon('kp_…')) → nagy, egyszerű sziluett,
//  kevés, de jellegzetes részlet. A méhanya ránézésre különbözik a dolgozótól (art-halo: halo_hazimeh): hosszú, kúpos potroh, amit
//  a rövidebb szárny csak részben takar, és a méhészek jelölő-pöttye a toron. A darázs ránézésre NEM méh: csupasz, citromsárga–fekete,
//  vékony derék, sárga lábak. Arc (szem-pupilla, mosoly) nincs; a beeco méhecskét nem rajzoljuk újra. Szöveg, szám, márka nincs.
//  Az élőlények 2D-ben rajzolva (y lefelé), a fény bal-fentről; a kaptár valódi méretekből vetítve (ART.geo.camera).
//  A segédek az art-halo.js másolatai (így a fájl önálló). Render: node tools/art-render.js 2d web/js/art/art-kaptar.js ki.png --skip kaptar
// ============================================================
ART.later('kaptar', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
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

  // =====================================================================
  //  1. Méhanya (Apis mellifera) – oldalnézet balra: a dolgozónál HOSSZABB, kúpos, borostyános potroh, amelyből a rövidebb szárny
  //     csak kb. kétharmadnyit takar; barna tor a méhészek jelölő-pöttyével (kék festékpötty), sötét fej, könyökös csáp
  // =====================================================================
  {
    const T = -6, head = circ(22, 50, 7.5, 16, 8.5), thor = wobC(37.5, 47, 10.5, 10, .03, 14, 0, 24);
    const abd = smC([[46, 45], [60, 42.5], [75, 45], [88, 49.5], [100, 56], [90, 61.5], [74, 64.5], [58, 64], [47, 58]], 4);
    const legs = [[[33, 56], [29, 65], [26, 73]], [[39, 57], [39, 67], [37, 75]], [[45, 56], [52, 65], [55, 74]]].map(p => bar(p, 2.1));
    const ant = [bar([[19, 43.5], [16, 35], [9.5, 31]], 1.7)];
    const wF = smC([[40, 40], [52, 32], [64, 27], [73, 26], [76, 29.5], [67, 34.5], [53, 40.5]], 4), wH = smC([[45, 43], [56, 38.5], [65, 37], [67, 40], [59, 44], [50, 46]], 4);
    fin('kp_kiralyno', { hu:'méhanya', en:'honeybee queen', tilt:T, look:'honeybee queen in side view facing left: a long, tapering amber abdomen with dark brown bands that reaches well beyond the short wings, brown fuzzy thorax with a small blue paint dot (beekeeper marking), dark head with big eye and elbowed antennae', shapes:[
      pth('chocolate', 'base', [...legs, ...ant]),
      ...blob('orange', abd, [70, 54], { tilt:T, ld:4.5, dd:4, ed:1.5, lm:'honey' }),
      dpth('chocolate', 'base', [strip(abd, 56, 59.5, 2), strip(abd, 65, 68.5, 2.2), strip(abd, 74, 77.5, 2.2), strip(abd, 83, 86, 2), strip(abd, 92, 102, 2)]),
      ...blob('wood', thor, [37.5, 47], { tilt:T, ld:3.5, dd:3.5, ed:1.4 }),
      ...blob('chocolate', head, [22, 50], { tilt:T, ld:2.6, dd:0, ed:0 }), det('dark', 'base', circ(24.5, 47.5, 3.2, 12, 5, 12)),
      pth('honey', 'light', [wH, wF], { o:.62 }), dpth('honey', 'dark', [bar([[43, 40], [58, 31.5], [72, 27]], .7), bar([[50, 39], [63, 34]], .7)], { o:.8 }),
      det('blue', 'base', circ(35.5, 40.5, 3.4, 12), { line:true }),
      shineP(band([[62, 48], [76, 50]], 1.8), .75),
    ] });
  }

  // =====================================================================
  //  2. Szalmakas – harang alakú, spirálban tekert szalmából; a vízszintes tekercs-barázdák a 3/4-es nézet miatt lefelé íveltek;
  //     elöl alul íves röpnyílás, a tetején fogó, kerek deszkán áll
  // =====================================================================
  {
    const R = smO([[50, 20], [62, 24], [71.5, 34], [77.5, 49], [80.5, 65], [80.5, 80]], 4), sil = [...R, ...R.map(([x, y]) => [100 - x, y]).reverse()];
    const board = hullOf([...circ(50, 81, 39, 24, 7.5), ...circ(50, 86, 39, 24, 7.5)]), top = circ(50, 81, 39, 24, 7.5);
    const groove = y0 => clip(band(Array.from({ length:9 }, (_, i) => [12 + i * 9.5, y0 + 3.2 * Math.sin(Math.PI * i / 8)]), 1.5, false), sil);
    const lite = y0 => clip(band(Array.from({ length:9 }, (_, i) => [12 + i * 9.5, y0 - 2.2 + 3.2 * Math.sin(Math.PI * i / 8)]), 1, false), sil);
    const ys = [29, 37, 45, 53, 61, 69, 76];
    fin('kp_kas', { hu:'szalmakas', en:'straw bee skep', tilt:6, look:'traditional bell-shaped coiled straw bee skep in three-quarter view: golden straw coils as curved horizontal ridges, a small arched entrance at the bottom front, a little knob on top, standing on a round wooden board', shapes:[
      face('wood', 'dark', board), det('wood', 'light', top),
      ...blob('cardboard', sil, [50, 55], { tilt:6, ld:6, dd:6, ed:2, lm:'gold' }),
      dpth('cardboard', 'dark', ys.map(groove)), dpth('gold', 'light', ys.map(lite), { o:.75 }),
      det('dark', 'base', [...circ(50, 81.5, 7, 12, 7.5).filter(([, y]) => y <= 81.5), [57, 81.5], [43, 81.5]].sort((a, b) => Math.atan2(a[1] - 81.5, a[0] - 50) - Math.atan2(b[1] - 81.5, b[0] - 50))),
      face('wood', 'base', circ(50, 18.5, 4.5, 12, 3.2)),
      shineP(band([[31, 38], [26, 56]], 2), .6),
    ] });
  }

  // =====================================================================
  //  3. Keretes kaptár – 3/4-es nézet (valódi méretekből vetítve: 0,41 × 0,51 m alap): lábakon álló fenékdeszka lejtős röpdeszkával,
  //     sötét röpnyílás, méz-sárga fiókos test, zsálya mézkamra kerek kijáróval, fogantyú-mélyedések, fa takarófedél fémlemezzel
  // =====================================================================
  {
    const X = .205, Z = .255, y1 = .33, y2 = .57, y3 = .74, y4 = .8, xo = .222, zo = .272;
    const fit = []; for(const x of [-xo, xo]) for(const y of [0, y4 + .012]) for(const z of [-zo, zo + .13]) fit.push([x, y, z]);
    const P = ART.geo.camera({ az:30, el:20, F:3.2, fit, span:80 });
    const Fq = (x0, x1, y0, y1_, z) => [[x0, y0, z], [x1, y0, z], [x1, y1_, z], [x0, y1_, z]].map(P);   // eleje (+Z)
    const Sq = (z0, z1, y0, y1_, x) => [[x, y0, z0], [x, y0, z1], [x, y1_, z1], [x, y1_, z0]].map(P);   // jobb oldal (+X)
    const legs = [Fq(-X + .01, -X + .05, 0, y1 - .03, Z - .03), Fq(X - .05, X - .01, 0, y1 - .03, Z - .03), Sq(-Z + .03, -Z + .07, 0, y1 - .03, X - .01)];
    fin('kp_kaptar', { hu:'keretes kaptár', en:'framed beehive', tilt:-12, look:'modern wooden framed beehive in three-quarter view on a small stand: honey-yellow brood box with a dark entrance slot and a sloping landing board, a sage-green honey super with a round upper entrance, side hand-holds, a wooden telescoping lid with a grey metal top', shapes:[
      pth('wood', 'dark', legs),
      face('wood', 'base', Fq(-X - .01, X + .01, y1 - .03, y1, Z + .005)),
      face('wood', 'light', [[-X + .03, y1 - .005, Z], [X - .03, y1 - .005, Z], [X - .03, y1 - .04, Z + .13], [-X + .03, y1 - .04, Z + .13]].map(P)),
      face('honey', 'dark', Sq(-Z, Z, y1, y2, X)), face('honey', 'base', Fq(-X, X, y1, y2, Z)),
      face('sage', 'dark', Sq(-Z, Z, y2, y3, X)), face('sage', 'base', Fq(-X, X, y2, y3, Z)),
      face('wood', 'dark', Sq(-zo, zo, y3, y4, xo)), face('wood', 'base', Fq(-xo, xo, y3, y4, zo)),
      face('steel', 'light', [[-xo, y4, zo], [xo, y4, zo], [xo, y4, -zo], [-xo, y4, -zo]].map(P)),
      det('dark', 'base', Fq(-.13, .13, y1 + .006, y1 + .024, Z + .002)),
      dpth('dark', 'base', [Sq(-.07, .07, y2 - .1, y2 - .075, X + .002), Sq(-.06, .06, y3 - .07, y3 - .05, X + .002)]),
      det('dark', 'base', circ(0, 0, .022, 10).map(([u, v]) => P([u, y2 + .1 + v, Z + .002]))),
      det('honey', 'line', Sq(-Z, -Z + .035, y1, y2, X + .001), { o:.45 }),
      shineP(band([P([-X + .04, y2 - .03, Z]), P([-X + .04, y1 + .07, Z])], 2), .7),
    ] });
  }

  // =====================================================================
  //  4. Lárva a sejtben – egy viasz-sejt szemből, kicsit felülről: a hatszög-perem, a sejt belső falai (a bal-felső árnyékban,
  //     a jobb-alsó fényben), a sejt alján tejfehér méhpempő-tócsa, benne C alakban begörbült, gyöngyház-fehér, szelvényes lárva
  // =====================================================================
  {
    const hex = (cx, cy, r) => Array.from({ length:6 }, (_, k) => [cx + r * Math.cos(rad(-90 + 60 * k)), cy + r * Math.sin(rad(-90 + 60 * k))]);
    const rim = hex(50, 50, 40), hole = hex(50, 50, 31), floor = hex(46, 46, 22);
    const lit = clip(hullOf([...hole.slice(1, 4), ...floor.slice(1, 4)]), hole);
    const C = [50, 52], arcP = Array.from({ length:12 }, (_, i) => { const a = -30 + i * 22; return [C[0] + 13 * cos(a), C[1] + 11.5 * sin(a)]; });
    const larva = band(arcP, t => 10 * (.6 + .4 * Math.sin(Math.PI * t)), true);
    const segs = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const a = -30 + i * 22; return band([[C[0] + 8.6 * cos(a), C[1] + 7.6 * sin(a)], [C[0] + 17.6 * cos(a), C[1] + 15.6 * sin(a)]], .8, false); });
    fin('kp_larva', { hu:'méhlárva a sejtben', en:'bee larva in a comb cell', tilt:-8, look:'one hexagonal beeswax comb cell seen from the front: a pale wax rim, shaded inner walls, and a pearly white segmented bee larva curled into a C shape in a pool of milky royal jelly at the bottom', shapes:[
      pth('honey', 'light', [rim]), det('honey', 'base', clip(rim, [[50, 50], [100, 50], [100, 100], [0, 100], [0, 72]]), { o:.7 }),
      det('cream', 'dark', hole), det('cream', 'light', lit), det('cream', 'base', floor),
      det('cream', 'light', circ(51, 56, 20, 16, 12)),
      ...blob('white', larva, C, { ld:2.4, dd:2.4, ed:1, lm:'paper', dm:'cream' }),
      dpth('cream', 'dark', segs, { o:.8 }),
      det('honey', 'line', band(hex(50, 50, 39).slice(1, 4), 1.2, false), { o:.35 }),
      shineP(band([[37, 30], [30, 42]], 2), .7), shineP(band([[45, 44], [50, 41]], 1.4), .8),
    ] });
  }

  // =====================================================================
  //  5. Rezgőtánc (a méhek „térképe”) – lép-lapon a nyolcas alakú táncút: középen az egyenes, rezgő szakasz (cikcakk), két oldalt
  //     a visszatérő ívek nyíllal; az egész a függőlegeshez képest ~25°-ban dől (a tánc iránya), a rezgő szakasz elején egy
  //     felülnézetes méh (arc nélkül)
  // =====================================================================
  {
    const hexF = (cx, cy, r) => Array.from({ length:6 }, (_, k) => [cx + r * Math.cos(rad(60 * k)), cy + r * Math.sin(rad(60 * k))]);
    const tile = hexF(50, 50, 44), cells = [];
    for(const [q, w] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]){ const cx = 50 + q * 22.5, cy = 50 + (w + q / 2) * 26;
      const h = hexF(cx, cy, 12.4); cells.push(clip(band([...h, h[0]], .9, false), tile)); }
    const loopR = Array.from({ length:13 }, (_, i) => { const a = -90 + i * 15; return [50 + 27 * cos(a), 50 + 19 * sin(a)]; }), loopL = loopR.map(([x, y]) => [100 - x, y]);
    const zig = Array.from({ length:9 }, (_, i) => [50 + (i % 2 ? 3.2 : -3.2) * (i && i < 8 ? 1 : 0), 67 - i * 4.2]);
    const arrow = (x, y, d) => [[x - 4.2, y - 3.2 * d], [x + 4.2, y - 3.2 * d], [x, y + 4.2 * d]];
    const ROT = 25, rt = ([x, y]) => [50 + (x - 50) * cos(ROT) - (y - 50) * sin(ROT), 50 + (x - 50) * sin(ROT) + (y - 50) * cos(ROT)], rp = ps => ps.map(rt);
    const bee = (pts) => rp(pts.map(([x, y]) => [x, y - 13]));
    fin('kp_tanc', { hu:'rezgőtánc', en:'honeybee waggle dance', tilt:-6, look:'icon of the honeybee waggle dance on a honeycomb tile: a figure-eight path with a straight zigzag waggle run in the middle and two return loops with arrows, a small top-view bee on the waggle run', shapes:[
      pth('honey', 'base', [tile]), det('honey', 'light', [[50, 50], tile[3], tile[4], tile[5]], { o:.8 }), det('honey', 'dark', [[50, 50], tile[0], tile[1], tile[2]], { o:.8 }),
      dpth('honey', 'dark', cells, { o:.55 }),
      dpth('dark', 'base', [band(rp(loopR), 2.4, true), band(rp(loopL), 2.4, true)]),
      dpth('dark', 'base', [rp(arrow(77, 50, 1)), rp(arrow(23, 50, 1))]),
      dpth('orange', 'dark', [band(rp(zig), 2.8, true)]),
      det('glass', 'light', bee(circ(45.5, 47, 3.6, 10, 6.5, -25)), { o:.9, line:true }), det('glass', 'light', bee(circ(54.5, 47, 3.6, 10, 6.5, 25)), { o:.9, line:true }),
      face('wood', 'base', bee(circ(50, 54, 4.6, 14, 7.5))),
      dpth('chocolate', 'base', [bee(stripH(circ(50, 54, 4.6, 14, 7.5), 52.5, 54.5, 0)), bee(stripH(circ(50, 54, 4.6, 14, 7.5), 56.5, 58.5, 0))]),
      face('chocolate', 'base', bee(circ(50, 44.5, 3.6, 12))), face('chocolate', 'dark', bee(circ(50, 39.3, 2.6, 10))),
      shineP(band([[16, 32], [24, 19]], 1.8), .6),
    ] });
  }

  // =====================================================================
  //  6. Mézgyomor-mérő – csepp alakú, átlátszó „edény”, alul borostyános nektárral (hullámos felszín), oldalt beosztás-vonalak,
  //     buborékok, fénycsík: a gyűjtőrepülés telítettség-jelzője
  // =====================================================================
  {
    const drop = smC([[50, 8], [55, 18], [64, 32], [72, 47], [74, 62], [68, 77], [50, 85], [32, 77], [26, 62], [28, 47], [36, 32], [45, 18]], 4, .15);
    const lvl = 52, surf = Array.from({ length:11 }, (_, i) => [20 + i * 6, lvl + 1.6 * Math.sin(i * 1.3)]);
    const fill = clip([...surf, [80, 95], [20, 95]], drop);
    fin('kp_mezgyomor', { hu:'mézgyomor', en:'honey stomach meter', tilt:8, look:'a clear glass droplet-shaped vessel half filled with amber nectar with a wavy surface, scale marks on the side, small bubbles and a highlight – a fill meter icon', shapes:[
      pth('glass', 'base', [drop]),
      ...shade('glass', drop, [50, 52], { tilt:8, ld:6, dd:0, ed:2 }),
      dpth('honey', 'base', [fill]), det('honey', 'dark', crescent(fill, [50, 70], 40, 70, 5)),
      det('honey', 'light', clip(band(surf, 2.4, false), drop)),
      dpth('glass', 'line', [36, 46, 66].map(y => band([[31, y], [37, y]], 1.2, false)), { o:.6 }),
      dpth('paper', 'light', [circ(44, 64, 2.2, 8), circ(56, 72, 1.6, 8), circ(52, 60, 1.2, 8)], { o:.9 }),
      shineP(band([[41, 26], [35, 42]], 2.4), .8), shineP(band([[34, 50], [33.5, 56]], 1.6), .6),
    ] });
  }

  // =====================================================================
  //  7. Gyurgyalag (Merops apiaster) – ágon ülve, oldalnézet balra: gesztenyés fejtető és hát, aranysárga váll-sáv és torok,
  //     fekete szemsáv és torokszegély, türkizkék mell és has, kékeszöld szárny gesztenyés fedőtollal, hosszú, enyhén lehajló
  //     fekete csőr, zöldes farok megnyúlt középső tollakkal
  // =====================================================================
  {
    const T = -4, head = circ(28, 40, 10, 16), body = smC([[32, 34], [48, 33], [62, 38], [72, 47], [74, 56], [66, 62], [52, 64], [38, 60], [31, 50]], 4);
    const tail = smC([[64, 53], [80, 60], [98, 70], [96.5, 73], [79, 66.5], [62, 60]], 3);
    const wing = smC([[39, 38], [55, 36.5], [70, 44], [81, 54], [70, 56], [55, 51], [42, 47]], 4);
    const twig = tube(smO([[22, 80], [50, 72], [86, 77]]), 3.2, { tilt:T });
    fin('kp_gyurgyalag', { hu:'gyurgyalag', en:'European bee-eater', tilt:T, look:'European bee-eater perched on a twig in side view facing left: chestnut crown and back, golden scapular stripe, yellow throat with a thin black necklace, black eye mask, turquoise-blue breast and belly, green-blue wing with chestnut coverts, long slightly curved black bill, long greenish tail with elongated central feathers', shapes:[
      pth('dark', 'base', [bar([[48, 62], [47, 70]], 1.6), bar([[55, 62], [56, 70]], 1.6)]),
      pth('wood', 'base', [twig.sil]), det('wood', 'light', twig.light),
      pth('leaf', 'base', [tail]), det('leaf', 'dark', clip(tail, [[60, 64], [100, 64], [100, 80], [60, 80]])),
      ...blob('teal', body, [52, 50], { tilt:T, ld:4, dd:3.5, ed:1.4 }),
      pth('ember', 'dark', [head, smC([[30, 31], [46, 31.5], [60, 37], [52, 40], [36, 38]], 3)]),
      det('honey', 'base', smC([[36, 37.5], [50, 37.6], [62, 41], [58, 43.5], [44, 41]], 3)),
      face('teal', 'dark', wing), det('ember', 'dark', smC([[42, 40], [54, 39], [60, 43], [50, 45.5], [43, 44.5]], 3)),
      det('honey', 'base', smC([[19.5, 43.5], [29, 45.5], [37, 48.5], [33, 55], [24, 51]], 3)),
      dpth('dark', 'base', [taper(smO([[18.5, 40.5], [28, 39.5], [38, 38.5]]), 3.4, 2.2), band(smO([[23, 51.5], [30, 55.5], [36.5, 55]]), 1.2, false)]),
      det('red', 'dark', circ(26.5, 39.6, 1.6, 8)),
      pth('dark', 'base', [taper(smO([[20, 39.5], [11, 42], [2.5, 46.5]]), 2.8, .5)]),
      shineP(band([[42, 54], [56, 58]], 1.6), .55),
    ] });
  }

  // =====================================================================
  //  8. Darázs (kecskedarázs-féle) – oldalnézet balra: CSUPASZ, citromsárga–fekete potroh éles sávokkal és fullánkkal, vékony
  //     darázsderék, fekete tor sárga foltokkal, sárga arc fekete vese-szemmel, sárga lábak, keskeny, hosszában hajtott füstös szárny
  // =====================================================================
  {
    const T = -6, head = circ(22, 48, 7, 16, 8), thor = wobC(36, 46, 9.5, 9, .02, 14, 0, 24);
    const gas = smC([[51, 46], [62, 43], [75, 45], [86, 51], [93, 57], [84, 61], [70, 63], [57, 61], [51, 56]], 4);
    const legs = [[[31, 54], [27, 63], [24, 71]], [[37, 55], [37, 65], [35, 73]], [[43, 54], [49, 63], [52, 71]]].map(p => bar(p, 1.7));
    const wF = smC([[38, 38.5], [55, 33.5], [73, 32], [81, 34], [73, 37.5], [55, 40]], 4);
    fin('kp_darazs', { hu:'darázs', en:'common wasp', tilt:T, look:'common wasp in side view facing left: smooth bright lemon-yellow and black banded abdomen with a stinger, a very thin wasp waist, black thorax with yellow marks, yellow face with a black kidney-shaped eye, long black antennae, yellow legs, narrow smoky folded wings', shapes:[
      pth('honey', 'base', legs), pth('dark', 'base', [bar([[19, 41], [15, 32], [8, 27]], 1.6)]),
      det('dark', 'base', [[91, 56.2], [95.5, 58], [91, 59.2]]),
      ...blob('honey', gas, [70, 53], { tilt:T, ld:4, dd:3.5, ed:1.4 }),
      dpth('dark', 'base', [strip(gas, 49, 55.5, 2), strip(gas, 62, 65.5, 2.2), strip(gas, 71.5, 75, 2.2), strip(gas, 81, 84, 2)]),
      pth('dark', 'base', [band([[44, 49], [52, 51.5]], 2.2, false)]),
      ...blob('dark', thor, [36, 46], { tilt:T, ld:3, dd:0, ed:0 }),
      dpth('honey', 'base', [circ(38, 40.5, 2.6, 8, 1.4, -10), circ(41.5, 49, 1.8, 8, 2.8)]),
      pth('honey', 'base', [head]), det('dark', 'base', clip(head, [[10, 38], [34, 38], [34, 45], [10, 44]])),
      det('dark', 'base', circ(24, 48.5, 2.4, 10, 5, 8)),
      pth('steel', 'light', [wF], { o:.6 }), dpth('steel', 'dark', [bar([[41, 38.5], [58, 34.5], [74, 33.5]], .7)], { o:.7 }),
      shineP(band([[60, 49], [70, 49.5]], 1.6), .7),
    ] });
  }
})();
});
