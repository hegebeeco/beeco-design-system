// ============================================================
//  Matricák — „Digitális rendelő” (Méhesd Könyvtára, javítókávézó; docs/rendelo-jatekterv.md) · B szint: docs/rajzolas.md
//  Négy csoport, mind dr_ előtaggal, emoji-álnév nélkül (a játék névvel kéri: artIcon('dr_telefon')):
//    1. eszközök (a „betegek”): telefon, tablet, laptop, fülhallgató tokkal, fejhallgató, okosóra, konzol, kontroller, tévé,
//       router, nyomtató, porszívó, kávéfőző – általános forma, MÁRKA ÉS LOGÓ NÉLKÜL;
//    2. szolgáltatás-ikonok tárgyként: streaming (lejátszó-képernyő), felhő fotókkal, MI (beszédbuborék szikrával), készenlét (elosztó);
//    3. „betegség”-jelzők (kicsi, a tárgyra ragasztható): lapos akku, repedt kijelző, csiga (lassú), hőmérő (melegszik), teli doboz (tárhely);
//    4. kezelés-jelzők: csavarhúzó, akku-modul, frissítés-nyíl, továbbadás (kéz a kézben), e-hulladék gyűjtő, új doboz szalaggal.
//  A „beteg” eszköz barátságos, ép kinézetű – a hibát a kis jelzők mutatják. Szöveg, betű, szám, márka nincs a képen.
//  Tárgyak valódi méretből (cm) vetítve (ART.geo.camera): 3/4-es nézet, 4 éles tónus (teteje világos · eleje alap ·
//  oldala sötét · hátsó élsáv legsötétebb), megdöntve, tömör olíva árnyék. A lapos jelek (felhő, buborék, nyíl, csiga, kezek)
//  2D-ben rajzolva, „vastagsággal” (eltolt sötét másolat). A segédek az art-office.js B-készletének másolatai – a fájl önálló.
//  Render: node tools/art-render.js 2d web/js/art/art-rendelo.js ki.png --skip rendelo
// ============================================================
ART.later('rendelo', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
(function(){
  const { r1, rad, camera, band, star } = ART.geo;
  const sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d));

  // ---------------- 2D segédek ----------------
  const RR = pts => pts.map(p => [r1(p[0]), r1(p[1])]);
  const pathOf = polys => polys.filter(p => p && p.length > 2).map(p => 'M' + RR(p).map(q => q.join(' ')).join(' ') + 'Z').join('');
  const area = poly => poly.reduce((a, p, i) => { const q = poly[(i + 1) % poly.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
  function hull(pts){
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for(const q of p){ while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for(const q of p.reverse()){ while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // Douglas–Peucker ritkítás (zárt sokszög) – kicsi SVG
  function simplify(poly, eps = .25){
    const dp = pts => { if(pts.length < 3) return pts;
      const a = pts[0], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; let best = 0, bi = 0;
      for(let i = 1; i < pts.length - 1; i++){ const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if(d > best){ best = d; bi = i; } }
      return best > eps ? [...dp(pts.slice(0, bi + 1)).slice(0, -1), ...dp(pts.slice(bi))] : [a, b]; };
    const half = Math.floor(poly.length / 2);
    return [...dp(poly.slice(0, half + 1)).slice(0, -1), ...dp([...poly.slice(half), poly[0]]).slice(0, -1)];
  }
  // függőlegesen konvex, átfedő konvex sokszögek uniójának körvonala (forgástest sziluettje)
  function envelope(polys, step = .45){
    const xs = polys.flat().map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), N = Math.max(8, Math.ceil((x1 - x0) / step)), top = [], bot = [];
    for(let i = 0; i <= N; i++){
      const x = x0 + (x1 - x0) * Math.min(Math.max(i / N, .0005), .9995); let lo = Infinity, hi = -Infinity;
      for(const poly of polys) for(let j = 0; j < poly.length; j++){ const a = poly[j], b = poly[(j + 1) % poly.length];
        if(a[0] !== b[0] && (a[0] - x) * (b[0] - x) <= 0){ const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); lo = Math.min(lo, y); hi = Math.max(hi, y); } }
      if(lo < Infinity){ top.push([x, lo]); bot.push([x, hi]); }
    }
    return simplify([...top, ...bot.reverse()], .25);
  }
  // a sziluett közelében lévő pontok behúzása, hogy a tónus-lapok ne takarják le a kontúrt
  function inset(pts, sil, d = .85){
    const s = Math.sign(area(sil)) || 1, n = sil.length;
    return pts.map(p => { let best = null, bd = Infinity;
      for(let i = 0; i < n; i++){ const a = sil[i], b = sil[(i + 1) % n], ex = b[0] - a[0], ey = b[1] - a[1], L2 = ex * ex + ey * ey; if(L2 < 1e-9) continue;
        const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / L2)), qx = a[0] + t * ex, qy = a[1] + t * ey, dd = Math.hypot(p[0] - qx, p[1] - qy);
        if(dd < bd){ bd = dd; best = { qx, qy, ex, ey, L:Math.sqrt(L2) }; } }
      return !best || bd >= d ? p : [best.qx - best.ey / best.L * s * d, best.qy + best.ex / best.L * s * d]; });
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
  // ellipszis / kör (rot fokkal elforgatva)
  const circ = (cx, cy, r, n = 14, ry = r, rot = 0) => Array.from({ length:n }, (_, i) => { const t = rad(360 * i / n), x = r * Math.cos(t), y = ry * Math.sin(t);
    return [cx + x * cos(rot) - y * sin(rot), cy + x * sin(rot) + y * cos(rot)]; });
  // lekerekített téglalap (u, v síkban), map: a pont elhelyezése (pl. vetítés az előlapra)
  const rrect = (u0, v0, u1, v1, r, map = p => p, n = 3) => [[u1 - r, v0 + r, -90], [u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180]]
    .flatMap(([cu, cv, a0]) => Array.from({ length:n + 1 }, (_, i) => map([cu + r * cos(a0 + 90 * i / n), cv + r * sin(a0 + 90 * i / n)])));
  // elforgatott téglalap a rácson (fénykép, kártya)
  const rbox = (cx, cy, w, h, deg) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * cos(deg) - y * sin(deg), cy + x * sin(deg) + y * cos(deg)]);
  const mv = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
  // sima zárt görbe a pontokon át (Catmull–Rom), ritkítva
  const crp = (p0, p1, p2, p3, t) => [0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t * t * t));
  const smC = (pts, n = 5, eps = .25) => { const N = pts.length, out = [];
    for(let i = 0; i < N; i++) for(let j = 0; j < n; j++) out.push(crp(pts[(i - 1 + N) % N], pts[i], pts[(i + 1) % N], pts[(i + 2) % N], j / n));
    return simplify(out, eps); };
  const smO = (pts, n = 5) => { const out = [];
    for(let i = 0; i < pts.length - 1; i++) for(let j = 0; j < n; j++) out.push(crp(pts[i - 1] || pts[i], pts[i], pts[i + 1], pts[i + 2] || pts[i + 1], j / n));
    out.push(pts[pts.length - 1]); return RR(out); };

  // alakzat-gyártók: fő lap (kontúr + fehér perem; tone nélkül lapokra tört) · belső lap kontúrral · dísz-lap · útvonalak · fénycsík · vonal
  const face = (m, tone, pts, o) => Object.assign({ t:'poly', m, pts:RR(pts) }, tone ? { tone } : {}, o);
  const dface = (m, tone, pts, o) => Object.assign({ t:'poly', m, d:true, pts:RR(pts) }, tone ? { tone } : {}, o);
  const det = (m, tone, pts, o) => Object.assign({ t:'poly', m, tone, d:true, line:false, pts:RR(pts) }, o);
  const pth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, p:pathOf(polys) }, o);
  const dpth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, line:false, p:pathOf(polys) }, o);
  const lpth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, p:pathOf(polys) }, o);   // dísz-útvonal kontúrral
  const shineP = (pts, o = .6) => det('paper', 'light', pts, { o });
  const lineP = (m, tone, pts, w, o) => Object.assign({ t:'line', m, tone, w, pts:RR(pts) }, o);

  // ---------------- 3D segédek ----------------
  const corners = (x0, x1, y0, y1, z0, z1) => { const q = []; for(const x of [x0, x1]) for(const y of [y0, y1]) for(const z of [z0, z1]) q.push([x, y, z]); return q; };
  // doboz lapjai a vetítésben (az > 0: az eleje (+Z) és a jobb (+X) oldala látszik)
  function box(P, x0, x1, y0, y1, z0, z1){
    const c = (x, y, z) => P([x, y, z]);
    return { top:[c(x0, y1, z1), c(x1, y1, z1), c(x1, y1, z0), c(x0, y1, z0)], front:[c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)],
      right:[c(x1, y0, z1), c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1)], sil:hull(corners(x0, x1, y0, y1, z0, z1).map(P)) };
  }
  // tömör doboz 4 tónussal: oldala (sötét) · hátsó élsáv (legsötétebb) · teteje (világos) · eleje (alap + lapok, vagy megadott tónus)
  function cube(P, m, x0, x1, y0, y1, z0, z1, o = {}){
    const b = box(P, x0, x1, y0, y1, z0, z1), e = z0 + (z1 - z0) * (o.eb || .15);
    const s = [face(m, 'dark', b.right)];
    if(o.edge !== false) s.push(det(m, 'line', inset([P([x1, y0, z0]), P([x1, y0, e]), P([x1, y1, e]), P([x1, y1, z0])], b.sil, .5), { o:.45 }));
    s.push(face(m, 'light', b.top), face(m, o.front, b.front));
    return { b, s };
  }
  const FF = (P, Z) => (dz = 0) => ([u, v]) => P([u, v, Z + dz]);   // előlap-térkép: (u, v) → a z = Z síkon
  // forgástest: prof = [[r, y], …] a tengely mentén; xf = a helyi pont elhelyezése a térben · szög: 0 = elöl (+Z), −90 = bal, +90 = jobb
  function lathe(P, prof, xf = p => p){
    const at = (r, y, a) => P(xf([r * sin(a), y, r * cos(a)]));
    const rAt = y => { for(let i = 1; i < prof.length; i++) if(y <= prof[i][1] || i === prof.length - 1){ const [ra, ya] = prof[i - 1], [rb, yb] = prof[i]; return yb === ya ? rb : ra + (rb - ra) * (y - ya) / (yb - ya); } return prof[0][0]; };
    const ring = (r, y, a0 = 0, a1 = 360, n = 20) => Array.from({ length:n + 1 }, (_, i) => at(r, y, a0 + (a1 - a0) * i / n));
    const full = (r, y, n = 24) => ring(r, y, 0, 360, n).slice(0, n);
    const rings = prof.map(([r, y]) => full(r, y, 28));
    const sil = envelope(rings.slice(1).map((rg, i) => hull([...rings[i], ...rg])));
    const on = (a, y, dr = 0) => at(rAt(y) + dr, y, a);
    const strip = (a0, a1, y0 = prof[0][1], y1 = prof[prof.length - 1][1], n = 6) => {
      const ys = [y0, ...prof.map(p => p[1]).filter(y => y > y0 && y < y1), y1];
      return inset([...ring(rAt(y0), y0, a0, a1, n), ...ys.slice(1, -1).map(y => on(a1, y)), ...ring(rAt(y1), y1, a1, a0, n), ...ys.slice(1, -1).reverse().map(y => on(a0, y))], sil);
    };
    return { at, rAt, ring, full, sil, on, strip };
  }
  // cső / zsinór: 3D középvonal → vastag sáv (sil) és a fény felőli (bal-fenti) keskeny csík (hi)
  function pipe(P, pts3, r, hiK = .4){
    const c = pts3.map(P), w = 2 * r * P.k, sil = band(c, w);
    const hi = c.map((p, i) => { const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      let nx = -dy / l, ny = dx / l; if(nx + ny > 0){ nx = -nx; ny = -ny; } return [p[0] + nx * w * .26, p[1] + ny * w * .26]; });
    return { c, w, sil, hi:band(hi, w * hiK) };
  }
  const rotX = d => ([x, y, z]) => [x, y * cos(d) - z * sin(d), y * sin(d) + z * cos(d)];
  const rotZ = d => ([x, y, z]) => [x * cos(d) - y * sin(d), x * sin(d) + y * cos(d), z];
  const add = (name, meta) => ART.add(name, Object.assign({ emoji:[], shadow:'hard' }, meta));

  // =====================================================================
  //  1. ESZKÖZÖK
  // =====================================================================

  // ---- Telefon – álló okostelefon zöld védőtokban, kezdőképernyő színes (üres) app-csempékkel. (7,2 × 14,6 × 0,9 cm)
  {
    const TILT = -16, X = 3.6, H = 14.6, Z = .45;
    const P = camera({ az:28, el:12, F:150, tilt:TILT, span:80, fit:corners(-X, X, 0, H, -Z, Z) });
    const C = cube(P, 'leaf', -X, X, 0, H, -Z, Z), F = FF(P, Z);
    const scr = rrect(-2.95, .85, 2.95, H - .85, .55, F(.03)), cols = ['honey', 'blossom', 'water', 'leaf'], tiles = {};
    [11, 8.5, 6].forEach((v, r) => [-1.85, 0, 1.85].forEach((u, c) => { const m = cols[(r * 3 + c) % 4]; (tiles[m] = tiles[m] || []).push(rrect(u - .72, v - .72, u + .72, v + .72, .3, F(.04), 2)); }));
    const side = (y0, y1) => [P([X, y0, -Z + .12]), P([X, y0, Z - .12]), P([X, y1, Z - .12]), P([X, y1, -Z + .12])];
    add('dr_telefon', { hu:'telefon', en:'smartphone in a green case', look:'smartphone standing tilted in three-quarter view inside a leaf-green protective case, home screen with blank colourful app tiles, camera notch, side buttons, no logo', tilt:TILT, shapes:[
      ...C.s,
      face('dark', 'base', rrect(-3.3, .45, 3.3, H - .45, .8, F(.02))),                                 // üveg-keret
      det('sky', 'base', scr),                                                                            // kijelző
      det('sky', 'light', clip([F(.035)([-3, H]), F(.035)([1.2, H]), F(.035)([-3, 5.5])], scr)),
      ...Object.keys(tiles).map(m => dpth(m, 'base', tiles[m])),                                         // app-csempék (üresek)
      det('dark', 'line', rrect(-.8, H - 1.6, .8, H - 1.05, .27, F(.04), 2)),                            // kamerakivágás
      det('white', 'light', rrect(-1.2, 1.25, 1.2, 1.5, .12, F(.04), 2), { o:.9 }),                       // kezdőlap-csík
      dpth('steel', 'base', [side(10, 12), side(7.6, 9.2)]),                                             // oldalgombok
      shineP([F(.05)([-2.7, 3.5]), F(.05)([-2, 3.5]), F(.05)([.2, H - 1.2]), F(.05)([-.5, H - 1.2])], .35),
    ]});
  }

  // ---- Tablet – fekvő tablet enyhén hátradöntve, a kijelzőn rajzoló-alkalmazás (virág, színpaletta), előtte érintőtoll. (24 × 17 × 0,7 cm)
  {
    const TILT = -12, X = 12, H = 17, Z = .35, lean = rotX(-12);
    const stylus = [[-9.5, .5, 3.4], [6.2, .5, 5.2]];
    const Pc = camera({ az:24, el:14, F:250, tilt:TILT, span:82, fit:[...corners(-X, X, 0, H, -Z, Z).map(lean), ...stylus, [7.8, .5, 5.4]] });
    const P = p => Pc(lean(p)); P.k = Pc.k;
    const C = cube(P, 'dark', -X, X, 0, H, -Z, Z), F = FF(P, Z), k = P.k;
    const scr = rrect(-11, 1.1, 11, H - 1.1, .5, F(.03));
    const petals = [0, 72, 144, 216, 288].map(a => circ(...F(.05)([1.8 + 1.4 * cos(a + 90), 11.2 + 1.4 * sin(a + 90)]), 1.05 * k, 10));
    const pen = pipe(Pc, stylus, .5), a = Pc(stylus[1]), t = Pc([7.8, .5, 5.4]), dx = t[0] - a[0], dy = t[1] - a[1], l = Math.hypot(dx, dy), h = pen.w / 2;
    add('dr_tablet', { hu:'tablet', en:'tablet with a drawing app and a stylus', look:'landscape tablet leaning back slightly in three-quarter view, dark bezel, screen shows a simple flower drawing and a colour palette, a white stylus lies in front, no logo', tilt:TILT, shapes:[
      ...C.s,
      det('white', 'base', scr),                                                                          // rajzlap
      det('white', 'light', clip([F(.035)([-X, H]), F(.035)([2, H]), F(.035)([-X, 4])], scr)),
      det('steel', 'light', rrect(-10.6, 2.4, -8.4, H - 2.4, .5, F(.04), 2)),                              // paletta-sáv
      dface('red', 'base', circ(...F(.05)([-9.5, 12.3]), .7 * k, 10)),
      dface('honey', 'base', circ(...F(.05)([-9.5, 9.6]), .7 * k, 10)),
      dface('water', 'base', circ(...F(.05)([-9.5, 6.9]), .7 * k, 10)),
      lineP('leaf', 'dark', [F(.05)([2.2, 3]), F(.05)([1.6, 6.2]), F(.05)([1.8, 10])], 1.5),              // rajzolt virág: szár
      dface('leaf', 'base', circ(...F(.05)([3.4, 5.4]), 1.5 * k, 10, .6 * k, -30)),                        // levél
      lpth('blossom', 'base', petals),                                                                    // szirmok
      dface('honey', 'light', circ(...F(.06)([1.8, 11.2]), .8 * k, 10)),
      face('white', 'base', pen.sil),                                                                     // érintőtoll
      det('white', 'light', pen.hi),
      face('dark', 'base', [[a[0] - dy / l * h, a[1] + dx / l * h], t, [a[0] + dy / l * h, a[1] - dx / l * h]]),
      shineP([F(.06)([-7, 2]), F(.06)([-5.8, 2]), F(.06)([-1.5, H - 1.5]), F(.06)([-2.7, H - 1.5])], .3),
    ]});
  }

  // ---- Laptop – nyitott laptop 3/4-ben felülről: billentyűzet (üres gombok), érintőpad, a kijelzőn egy ablak. (30 × 21 × 1,5 cm, fedél 20,5 cm)
  {
    const TILT = -10, X = 15, T = 1.5, Z = 10.5, L = 20.5, A = 16, TH = .7, HZ = -Z + .8;
    const lid = (u, v, t = 0) => [u, T + v * cos(A) + t * sin(A), HZ - v * sin(A) + t * cos(A)];
    const fit = [...corners(-X, X, 0, T, -Z, Z), ...[-X, X].flatMap(u => [lid(u, L), lid(u, L, -TH), lid(u, 0, -TH)])];
    const P = camera({ az:26, el:24, F:150, tilt:TILT, span:82, fit });
    const LS = (t = .02) => ([u, v]) => P(lid(u, v, t)), Tp = ([x, z]) => P([x, T + .02, z]);
    const scr = rrect(-13.6, 1.3, 13.6, L - 1.2, .4, LS(.03), 1);
    const keys = [];
    for(const zc of [-8.6, -6.9, -5.2]) for(let i = 0; i < 12; i++){ const u0 = -12.6 + i * 2.13; keys.push([[u0, zc - .7], [u0 + 1.8, zc - .7], [u0 + 1.8, zc + .7], [u0, zc + .7]].map(Tp)); }
    keys.push([[-5.5, -4.1], [5.5, -4.1], [5.5, -2.8], [-5.5, -2.8]].map(Tp));
    const Cb = cube(P, 'steel', -X, X, 0, T, -Z, Z);
    add('dr_laptop', { hu:'laptop', en:'open laptop', look:'open silver laptop seen from above in three-quarter view, blank keyboard keys, touchpad, the screen shows one simple window, no logo', tilt:TILT, shapes:[
      face('steel', 'dark', hull([-X, X].flatMap(u => [0, L].flatMap(v => [0, -TH].map(t => LS(t)([u, v])))))),   // fedél
      face('dark', 'base', [[-X, 0], [X, 0], [X, L], [-X, L]].map(LS(.02))),                                    // keret
      det('sky', 'base', scr),                                                                                  // kijelző
      det('sky', 'light', clip([[-X, L], [2, L], [-X, 4]].map(LS(.035)), scr)),
      dface('white', 'light', rrect(-7.5, 5.5, 5.5, 16.2, .4, LS(.05), 1)),                                     // ablak
      det('leaf', 'base', [[-7.3, 14.6], [5.3, 14.6], [5.3, 16], [-7.3, 16]].map(LS(.06))),
      ...Cb.s,
      face('dark', 'base', [[-13, -9.5], [13, -9.5], [13, -2.2], [-13, -2.2]].map(Tp)),                       // billentyű-mező
      dpth('steel', 'light', keys),                                                                             // gombok (üresek)
      dface('steel', 'base', rrect(-4.3, .6, 4.3, 7.2, .5, Tp, 2)),                                              // érintőpad
      shineP([[-12.5, 3], [-11.2, 3], [-8.2, L - 2], [-9.5, L - 2]].map(LS(.07)), .35),
    ]});
  }

  // ---- Fülhallgató – vezeték nélküli fülhallgató nyitott töltőtokban: pirula alakú tok, felnyitott fedél, két fülhallgató-fej. (6 × 3 × 2,4 cm)
  {
    const TILT = -10, H = 3, PHI = 105;
    const stad = (y, s = 1, n = 7) => [...Array.from({ length:n + 1 }, (_, i) => { const t = -90 + 180 * i / n; return [s * (1.8 + 1.2 * cos(t)), y, s * 1.2 * sin(t)]; }),
      ...Array.from({ length:n + 1 }, (_, i) => { const t = 90 + 180 * i / n; return [s * (-1.8 + 1.2 * cos(t)), y, s * 1.2 * sin(t)]; })];
    const open = ([x, y, z]) => { const dz = z + 1.2, dy = y - H; return [x, H + dz * sin(PHI) + dy * cos(PHI), -1.2 + dz * cos(PHI) - dy * sin(PHI)]; };
    const body = [stad(0, .8), stad(.6, .96), stad(H, 1)], stems = [-1.3, 1.3].map(x => [x * 1.45, H + 2.7, -.5]), rim = stad(H, 1).map(open), dome = stad(H + .9, .88).map(open);
    const P = camera({ az:18, el:26, F:60, tilt:TILT, span:80, fit:[...body.flat(), ...rim, ...dome, ...stems] }), k = P.k;
    const sil = hull(body.flat().map(P)), top = stad(H, 1, 10).map(P);
    const buds = [-1.3, 1.3];
    add('dr_fulhallgato', { hu:'fülhallgató', en:'wireless earbuds in an open charging case', look:'white pill-shaped charging case with the lid flipped open, two round earbud heads sitting in their wells, a small green status light on the front, no logo', tilt:TILT, shapes:[
      face('white', 'dark', hull([...rim, ...dome].map(P))),                                               // fedél
      face('white', null, rim.map(P)),                                                                     // fedél pereme
      det('steel', 'light', stad(H + .3, .82).map(open).map(P)),                                            // fedél belseje
      face('white', 'base', sil),                                                                          // tok
      det('white', 'dark', inset(hull(body.flat().filter(p => p[0] > 2.1).map(P)), sil)),                  // tok oldala
      face('white', 'light', top),                                                                         // tok teteje
      dpth('steel', 'dark', buds.map(x => circ(...P([x, H + .01, 0]), 1 * k, 14, .55 * k))),              // mélyedések
      pth('white', 'base', buds.map(x => pipe(P, [[x, H + .5, 0], [x * 1.45, H + 2.3, -.5]], .42).sil), { d:true }),   // szárak
      lpth('white', 'light', buds.map(x => circ(...P([x, H + .5, .05]), .85 * k, 14))),                   // fülhallgató-fejek
      dpth('steel', 'base', buds.map(x => circ(...P([x - Math.sign(x) * .35, H + .45, .55]), .3 * k, 10))),   // fülillesztő
      det('leaf', 'light', circ(...P([0, 1.3, 1.2]), .24 * k, 10)),                                      // jelzőfény
      shineP(circ(...P([-2.4, 1.6, 1.0]), .35 * k, 10, 1.1 * k, 10), .6),
    ]});
  }

  // ---- Fejhallgató – párnás, fülre boruló fejhallgató: ív alakú fejpánt párnával, két kagyló; a bal kagyló párnája felénk néz. (19 × 17 cm)
  {
    const TILT = -8, CY = 6;
    const ringYZ = (x, r, n = 20) => Array.from({ length:n }, (_, i) => { const t = 360 * i / n; return [x, CY + r * sin(t), r * cos(t)]; });
    const arcP = (rx, ry, a0, a1, n) => Array.from({ length:n + 1 }, (_, i) => { const t = a0 + (a1 - a0) * i / n; return [rx * cos(t), 10 + ry * sin(t), 0]; });
    const bandP = arcP(8.6, 6.8, 180, 0, 12), padP = arcP(7.9, 6.0, 148, 32, 8);
    const P = camera({ az:34, el:10, F:120, tilt:TILT, span:80, fit:[...ringYZ(-9.4, 4.2), ...ringYZ(9.4, 4.2), ...bandP] }), k = P.k;
    const HP = pts => hull(pts.map(P)), band1 = pipe(P, bandP, .85), pad = pipe(P, padP, .55);
    add('dr_fejhallgato', { hu:'fejhallgató', en:'over-ear headphones with padded cushions', look:'green over-ear headphones in three-quarter view, arched headband with a cream cushion, big padded cream ear cushions, round outer cups with a small honey accent, no logo', tilt:TILT, shapes:[
      face('leaf', 'dark', HP([...ringYZ(-9.4, 4), ...ringYZ(-7.8, 4.2)])),                                 // bal kagyló
      face('cream', 'dark', HP([...ringYZ(-7.8, 4.3), ...ringYZ(-6.2, 4)])),                               // bal párna oldala
      dface('cream', 'base', ringYZ(-6.2, 4).map(P)),                                                      // bal párna
      det('dark', 'light', ringYZ(-6.15, 2.2).map(P)),                                                     // hangszóró
      face('cream', 'base', pad.sil),                                                                      // fejpánt-párna
      face('leaf', 'base', band1.sil),                                                                     // fejpánt
      det('leaf', 'light', band1.hi),
      face('cream', 'dark', HP([...ringYZ(6.2, 4), ...ringYZ(7.8, 4.3)])),                                 // jobb párna
      face('leaf', 'dark', HP([...ringYZ(7.8, 4.2), ...ringYZ(9.4, 4)])),                                  // jobb kagyló
      dface('leaf', 'base', ringYZ(9.45, 3.5).map(P)),                                                     // külső lap
      det('leaf', 'light', [...Array.from({ length:7 }, (_, i) => [9.5, CY + 3.1 * sin(70 + 15 * i), 3.1 * cos(70 + 15 * i)]),
        ...Array.from({ length:7 }, (_, i) => [9.5, CY + 2.2 * sin(160 - 15 * i), 2.2 * cos(160 - 15 * i)])].map(P)),
      dface('honey', 'base', ringYZ(9.5, 1.2, 12).map(P)),                                                 // díszkorong
      shineP(pipe(P, arcP(8.3, 6.5, 165, 125, 5), .2).sil, .7),
    ]});
  }

  // ---- Okosóra – szögletes okosóra zöld szilikon szíjjal; a kijelzőn két színes aktivitás-gyűrű (szám nélkül), oldalt koronagomb. (4 × 4,4 × 1,2 cm)
  {
    const TILT = -12, X = 2, H = 4.4, Z = .6, SW = 1.25;
    const topS = [[4.1, 0], [5.6, -.3], [6.9, -.9], [7.7, -2], [8, -3.2]], botS = [[.3, 0], [-1.2, -.3], [-2.5, -.9], [-3.3, -2], [-3.6, -3.2]];
    const P = camera({ az:24, el:16, F:40, tilt:TILT, span:80, fit:[...corners(-X, X, 0, H, -Z, Z), ...[...topS, ...botS].flatMap(([y, z]) => [[-SW, y, z], [SW, y, z]])] }), k = P.k;
    const strip = path => [...path.map(([y, z]) => P([-SW, y, z])), ...[...path].reverse().map(([y, z]) => P([SW, y, z]))];
    const C = cube(P, 'steel', -X, X, 0, H, -Z, Z), F = FF(P, Z), c = [0, 2.2];
    const ringA = (r, a0, a1) => Array.from({ length:13 }, (_, i) => { const a = a0 + (a1 - a0) * i / 12; return F(.05)([c[0] + r * cos(a), c[1] + r * sin(a)]); });
    const crown = [[X, 2.7, 0], [X + .45, 2.7, 0]].flatMap(([x, y]) => Array.from({ length:12 }, (_, i) => P([x, y + .42 * sin(30 * i), .42 * cos(30 * i)])));
    add('dr_okosora', { hu:'okosóra', en:'smartwatch with a green strap', look:'square smartwatch with a silver case and a leaf-green silicone strap curving away, the dark screen shows two coloured activity rings, a crown on the side, no numbers, no logo', tilt:TILT, shapes:[
      face('leaf', 'dark', strip(topS.slice(2))), face('leaf', 'base', strip(topS.slice(0, 3))),           // felső szíj
      face('leaf', 'dark', strip(botS.slice(2))), face('leaf', 'base', strip(botS.slice(0, 3))),           // alsó szíj
      dpth('leaf', 'line', [-1.1, -2].map(y => circ(...P([0, y, y < -1.5 ? -.7 : -.25]), .22 * k, 8))),   // szíj-lyukak
      ...C.s,
      face('dark', 'base', rrect(-1.6, .4, 1.6, 4, .45, F(.03), 2)),                                        // kijelző
      lineP('leaf', 'light', ringA(1.2, -90, 190), 2.4),                                                     // aktivitás-gyűrűk
      lineP('honey', 'base', ringA(.72, -90, 120), 2.4),
      face('steel', 'dark', hull(crown)),                                                                     // koronagomb
      shineP([F(.06)([-1.4, 1]), F(.06)([-1.05, 1]), F(.06)([-.2, 3.8]), F(.06)([-.55, 3.8])], .3),
    ]});
  }

  // ---- Játékkonzol – lapos, fekvő konzol-doboz: kétszínű tető szellőzőréssel és fénycsíkkal, elöl lemezrés, gombok. (30 × 6 × 25 cm)
  {
    const TILT = -12, X = 15, H = 6, Z = 12.5;
    const P = camera({ az:24, el:24, F:160, tilt:TILT, span:82, fit:corners(-X, X, 0, H, -Z, Z) });
    const C = cube(P, 'white', -X, X, 0, H, -Z, Z), F = FF(P, Z), Tp = ([x, z]) => P([x, H + .02, z]), k = P.k;
    add('dr_konzol', { hu:'játékkonzol', en:'game console box', look:'flat white game console box lying down in three-quarter view, dark glossy panel on the back half of the top, vent slots, a honey light strip, a disc slot and small buttons on the front, no logo', tilt:TILT, shapes:[
      ...C.s,
      det('dark', 'base', inset([[-X, -Z], [X, -Z], [X, .5], [-X, .5]].map(Tp), C.b.sil)),                      // sötét tető-panel
      det('dark', 'light', inset([[-X, -Z], [-4, -Z], [-X, -3]].map(Tp), C.b.sil), { o:.8 }),
      lineP('honey', 'light', [Tp([-X + .8, .6]), Tp([X - .8, .6])], 1.6),                                    // fénycsík
      dpth('steel', 'dark', [4, 6.5, 9].map(z => band([Tp([-12.5, z]), Tp([-4, z])], .8, false))),         // szellőzők
      dface('steel', 'light', [[-.7, 2.4], [.7, 2.4], [.7, 5.1], [2.3, 5.1], [2.3, 7.1], [.7, 7.1], [.7, 9.8], [-.7, 9.8], [-.7, 7.1], [-2.3, 7.1], [-2.3, 5.1], [-.7, 5.1]].map(([x, z]) => Tp([x + 3, z]))),   // kontroller-jel
      lpth('steel', 'light', [[9.5, 3.6], [9.5, 8.6], [7.6, 6.1], [11.4, 6.1]].map(([x, z]) => circ(...Tp([x, z]), .85 * k, 10, .85 * k * .55))),
      lineP('dark', 'base', [F(.02)([-11, 3.6]), F(.02)([2, 3.6])], 1.6),                                     // lemezrés
      dpth('dark', 'base', [-13.4, -11.4].map(u => [[u, 1.4], [u + 1.3, 1.4], [u + 1.3, 2], [u, 2]].map(F(.02)))),   // csatlakozók
      dface('leaf', 'light', circ(...F(.03)([11.5, 3.2]), .75 * k, 10)),                                     // bekapcsoló
      shineP([F(.03)([-13, 5]), F(.03)([-11.5, 5]), F(.03)([-12.5, 1]), F(.03)([-14, 1])], .5),
    ]});
  }

  // ---- Kontroller – játékvezérlő felülről 3/4-ben: markolatok, keresztgomb, négy színes (felirat nélküli) gomb, két hüvelykujj-kar. (15,5 × 10 × 2,2 cm)
  {
    const TILT = 10, T = 2.2;
    const half = [[0, 3.1], [2.5, 3.2], [5.2, 3.5], [6.9, 3.1], [7.7, 1.6], [7.9, -.8], [7.6, -3.6], [6.8, -5.6], [5.5, -6.3], [4.3, -5.6], [3.3, -3.4], [1.8, -2.5], [0, -2.5]];
    const out = smC([...half, ...half.slice(1, -1).reverse().map(([x, w]) => [-x, w])], 4, .08);
    const P = camera({ az:0, el:55, F:60, tilt:TILT, span:84, fit:[...out.map(([x, w]) => [x, 0, -w]), ...out.map(([x, w]) => [x, T, -w])] }), k = P.k;
    const Tm = y => ([x, w]) => P([x, y, -w]), top = out.map(Tm(T));
    const a = .45, L = 1.35, cross = [[-a, L], [a, L], [a, a], [L, a], [L, -a], [a, -a], [a, -L], [-a, -L], [-a, -a], [-L, -a], [-L, a], [-a, a]].map(([x, w]) => [x - 4.4, w + .9]);
    const btn = (dx, dw) => circ(...Tm(T + .05)([4.4 + dx, .9 + dw]), .62 * k, 12);
    add('dr_kontroller', { hu:'kontroller', en:'game controller', look:'white game controller seen from above in three-quarter view with two grips, a dark cross d-pad, four plain coloured buttons, two thumbsticks, no letters, no logo', tilt:TILT, shapes:[
      face('white', 'dark', out.map(Tm(0))),                                                                  // oldalfal
      face('white', 'base', top),                                                                             // felső lap
      det('white', 'light', inset(clip(out, [[-9, 5], [3, 5], [-9, -3]]).map(Tm(T)), top)),
      dface('dark', 'base', cross.map(Tm(T + .05))),                                                          // keresztgomb
      dface('leaf', 'base', btn(0, 1.15)), dface('honey', 'base', btn(1.15, 0)),                              // négy gomb
      dface('blossom', 'base', btn(0, -1.15)), dface('water', 'base', btn(-1.15, 0)),
      dpth('dark', 'base', [-2.3, 2.3].map(x => circ(...Tm(T)([x, -1.7]), 1.3 * k, 14))),                    // karok foglalata
      lpth('steel', 'light', [-2.3, 2.3].map(x => circ(...Tm(T + .8)([x, -1.7]), 1 * k, 14))),               // karok
      det('leaf', 'light', rrect(-.9, 1.7, .9, 2.3, .25, Tm(T + .02), 2)),
      shineP([[-6.7, 2.2], [-5.9, 2.6], [-6.9, -2.8], [-7.4, -2.4]].map(Tm(T + .03)), .6),
    ]});
  }

  // ---- Tévé – lapos tévé középső talpon; a képernyőn napos dombvidék (szöveg nélkül). (100 × 58 cm képernyő)
  {
    const TILT = -10, X = 50, Y0 = 12, Y1 = 70, Z = 1.6;
    const P = camera({ az:22, el:12, F:600, tilt:TILT, span:82, fit:[...corners(-X, X, Y0, Y1, -Z, Z), ...corners(-18, 18, 0, 2.5, -11, 7)] }), k = P.k;
    const C = cube(P, 'dark', -X, X, Y0, Y1, -Z, Z), F = FF(P, Z);
    const sc = [[-47, Y0 + 3], [47, Y0 + 3], [47, Y1 - 3], [-47, Y1 - 3]], scr = sc.map(F(.05));
    const hill = (v, a, ph) => clip([...Array.from({ length:13 }, (_, i) => { const u = -48 + 96 * i / 12; return [u, v + a * Math.sin(i / 12 * 2 * Math.PI + ph)]; }), [48, 0], [-48, 0]], sc).map(F(.08));
    const foot = cube(P, 'steel', -18, 18, 0, 2.5, -11, 7, { edge:false });
    add('dr_teve', { hu:'tévé', en:'flat screen television on a stand', look:'flat screen television on a central stand in three-quarter view, dark frame, the screen shows sunny green hills, no text, no logo', tilt:TILT, shapes:[
      face('steel', 'dark', box(P, -4, 4, 2.5, Y0 + 2, -5, -1.6).sil),                                      // nyak
      ...foot.s,                                                                                             // talp
      ...C.s,
      det('sky', 'base', scr),                                                                               // képernyő: ég
      dface('honey', 'light', circ(...F(.07)([24, 55]), 6 * k, 16)),                                        // nap
      det('grass', 'base', hill(34, 5, .8)),                                                                 // hátsó domb
      det('leaf', 'base', hill(25, 4, 3.4)),                                                                 // első domb
      det('sky', 'light', clip([[-47, Y1 - 3], [0, Y1 - 3], [-47, 30]], sc).map(F(.09)), { o:.35 }),
      shineP([[-44, 20], [-39, 20], [-22, Y1 - 5], [-27, Y1 - 5]].map(F(.1)), .3),
    ]});
  }

  // ---- Router – fehér, lapos router három sötét antennával, elöl jelzőfény-sor, tetején szellőzőrés. (22 × 3,5 × 15 cm, antenna 11 cm)
  {
    const TILT = -12, X = 11, H = 3.5, Z = 7.5;
    const ants = [[-8, -2.2], [0, 0], [8, 2.2]].map(([x, dx]) => [[x, H + .4, -6.2], [x + dx, H + 11, -6.8]]);
    const P = camera({ az:24, el:20, F:120, tilt:TILT, span:80, fit:[...corners(-X, X, 0, H, -Z, Z), ...ants.flat()] }), k = P.k;
    const C = cube(P, 'white', -X, X, 0, H, -Z, Z), F = FF(P, Z), Tp = ([x, z]) => P([x, H + .02, z]);
    const pipes = ants.map(a => pipe(P, a, .6));
    add('dr_router', { hu:'router', en:'wifi router with three antennas', look:'flat white wifi router in three-quarter view with three dark antennas standing up at the back, a row of small green status lights on the front, vent slots on top, no logo', tilt:TILT, shapes:[
      ...C.s,
      dpth('steel', 'dark', [-3, -.5, 2, 4.5].map(z => band([Tp([-6, z]), Tp([6, z])], .7, false))),           // szellőzők
      dpth('dark', 'base', ants.map(a => circ(...P(a[0]), .95 * k, 12))),                                      // antenna-tövek
      pth('dark', 'base', pipes.map(p => p.sil)),                                                              // antennák
      dpth('dark', 'light', pipes.map(p => p.hi)),
      dpth('leaf', 'light', [-6.5, -4.3, -2.1, .1].map(u => circ(...F(.03)([u, 1.75]), .42 * k, 10))),         // jelzőfények
      det('honey', 'base', circ(...F(.03)([2.3, 1.75]), .42 * k, 10)),
      shineP([F(.03)([-10, 2.7]), F(.03)([-4, 2.7]), F(.03)([-4, 2.3]), F(.03)([-10, 2.3])], .6),
    ]});
  }

  // ---- Nyomtató – fehér asztali nyomtató: hátul álló papír az adagolóban, elöl kijövő lap kis képpel, tetején kijelző és gomb. (40 × 13 × 30 cm)
  {
    const TILT = -12, X = 20, H = 13, Z = 15;
    const pin = [[-8, H, -11], [8, H, -11], [8, H + 10, -14], [-8, H + 10, -14]], pout = [[-9, 8.2, Z - .5], [9, 8.2, Z - .5], [9, 7, Z + 8], [-9, 7, Z + 8]];
    const P = camera({ az:24, el:24, F:200, tilt:TILT, span:82, fit:[...corners(-X, X, 0, H, -Z, Z), ...pin, ...pout] }), k = P.k;
    const C = cube(P, 'white', -X, X, 0, H, -Z, Z), F = FF(P, Z), Tp = ([x, z]) => P([x, H + .02, z]);
    const lerp = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t), onOut = (s, t) => P(lerp(lerp(pout[0], pout[1], s), lerp(pout[3], pout[2], s), t));
    add('dr_nyomtato', { hu:'nyomtató', en:'desktop printer printing a picture', look:'white desktop printer in three-quarter view with a sheet standing in the rear feeder, a printed sheet with a small landscape picture coming out at the front, a small dark display and a green button on top, no logo', tilt:TILT, shapes:[
      face('steel', 'base', [[-9, H, -10.5], [9, H, -10.5], [9, H + 7, -13.5], [-9, H + 7, -13.5]].map(P)),     // adagoló-tartó
      face('paper', 'light', pin.map(P)),                                                                      // papír hátul
      ...C.s,
      face('dark', 'base', rrect(-13, 7.4, 13, 9.2, .5, F(.02), 1)),                                            // kiadó-rés
      face('paper', 'base', pout.map(P)),                                                                      // kijövő lap
      det('sky', 'base', [onOut(.25, .3), onOut(.75, .3), onOut(.75, .85), onOut(.25, .85)]),                  // kép a lapon
      det('leaf', 'base', [onOut(.25, .85), onOut(.4, .55), onOut(.58, .66), onOut(.75, .5), onOut(.75, .85)]),
      face('dark', 'base', [[10, 6], [17, 6], [17, 11.5], [10, 11.5]].map(Tp)),                                // kijelző
      dface('leaf', 'light', circ(...Tp([13.5, 3.2]), .9 * k, 10)),                                           // gomb
      shineP([F(.03)([-18, 5.5]), F(.03)([-16.5, 5.5]), F(.03)([-16.5, 1.5]), F(.03)([-18, 1.5])], .5),
    ]});
  }

  // ---- Porszívó – piros, gurulós porszívó oldalkerékkel: sötét gégecső, fém szívócső, padlófej. (test 30 × 20 × 20 cm)
  {
    const TILT = -8, CY = 10;
    const xf = ([x, y, z]) => [y, CY - x, z];   // a forgástest tengelye vízszintes (X irány)
    const prof = [[.5, -13], [6.5, -12.6], [9.6, -10.5], [10.6, -6], [10.6, 5], [9.4, 9.5], [6.4, 12.2], [3.8, 13]];
    const hose = [[13.5, 10, 0], [17, 14.5, 1], [19.5, 20, 2], [23, 23, 3], [26.5, 23.5, 4]], wand = [[28.5, 22, 4.6], [35.5, 2.4, 7]];
    const fit = [[-13, 0, -10], [-13, 21, 10], [13, 21, 10], [40, 0, 14], [40, 2.4, -1], [27, 25, 4]];
    const P = camera({ az:30, el:18, F:200, tilt:TILT, span:84, fit }), k = P.k;
    const B = lathe(P, prof, xf), hp = pipe(P, hose, 1.6), wp = pipe(P, wand, .75);
    const ringXY = (c, r, n = 18) => Array.from({ length:n }, (_, i) => P([c[0] + r * cos(360 * i / n), c[1] + r * sin(360 * i / n), c[2]]));
    const nz = cube(P, 'dark', 31.5, 39.5, 0, 2.6, -1, 14, { edge:false });
    add('dr_porszivo', { hu:'porszívó', en:'canister vacuum cleaner', look:'red canister vacuum cleaner on wheels in three-quarter view, a dark flexible hose to a steel wand and a dark floor head, a big side wheel, no logo', tilt:TILT, shapes:[
      face('red', 'base', B.sil),                                                                            // test
      det('red', 'light', B.strip(-90, -35, -11, 11)),
      det('red', 'dark', B.strip(40, 90, -11, 11)),
      det('dark', 'base', B.full(3.6, 13.02, 14)),                                                           // cső-csatlakozó
      face('dark', 'dark', hull([...ringXY([-5, 5.6, 10.2], 5.6), ...ringXY([-5, 5.6, 12], 5.6)])),         // kerék
      dface('dark', 'base', ringXY([-5, 5.6, 12.05], 5.4)),
      dface('steel', 'base', ringXY([-5, 5.6, 12.1], 2.4, 12)),                                              // kerékagy
      face('dark', 'base', hp.sil), det('dark', 'light', hp.hi),                                             // gégecső
      ...nz.s,                                                                                               // padlófej
      face('steel', 'base', wp.sil), det('steel', 'light', wp.hi),                                           // szívócső
      face('dark', 'base', pipe(P, [[27, 22.5, 4], [29, 21, 4.7]], 1.1).sil),                                // fogantyú
      shineP(B.strip(-80, -62, -9, 7), .6),
    ]});
  }

  // ---- Kávéfőző – krémszínű filteres kávéfőző: hátsó torony, túlnyúló fej, alul üvegkancsó kávéval. (18 × 30 × 19 cm)
  {
    const TILT = -10, X = 9;
    const off = ([x, y, z]) => [x, y + 2.6, z + 2.8];
    const P = camera({ az:26, el:16, F:180, tilt:TILT, span:80, fit:[...corners(-X, X, 0, 30, -10, 9), [0, 2.6, 9.2]] }), k = P.k;
    const col = cube(P, 'cream', -X, X, 2.5, 25, -10, -3, { edge:false }), head = cube(P, 'cream', -X, X, 24, 30, -10, 6);
    const base = cube(P, 'dark', -X, X, 0, 2.6, -10, 9, { edge:false });
    const G = lathe(P, [[4.2, 0], [5.8, .8], [6.2, 3.5], [5.6, 7.5], [4.3, 10.2], [4.4, 11.8]], off);
    const K = lathe(P, [[4, .3], [5.6, .9], [6, 3.5], [5.9, 5.6]], off);
    const handle = pipe(P, [[6.1, 4, 0], [8.4, 5, 0], [8.7, 8.5, 0], [5.4, 10.2, 0]].map(off), .7);
    const Fh = FF(P, 6);
    add('dr_kavefozo', { hu:'kávéfőző', en:'drip coffee maker with a glass jug', look:'cream drip coffee maker in three-quarter view with a tower at the back, an overhanging head with a green button, a glass jug of coffee on a dark base, no logo', tilt:TILT, shapes:[
      face('cream', 'dark', col.b.right), face('cream', 'base', col.b.front),                                  // torony
      ...head.s,                                                                                             // fej
      dface('leaf', 'light', circ(...Fh(.05)([5.5, 27]), .9 * k, 10)),                                      // gomb
      det('honey', 'base', circ(...Fh(.05)([2.8, 27]), .45 * k, 8)),                                          // jelzőfény
      ...base.s,                                                                                             // talp
      face('glass', 'base', G.sil),                                                                          // kancsó
      det('glass', 'dark', G.strip(45, 90, .5, 11.5)),
      face('chocolate', 'base', K.sil, { line:false }),                                                      // kávé
      det('chocolate', 'light', K.full(5.9, 5.6, 18)),
      face('dark', 'base', handle.sil),                                                                      // fül
      face('dark', 'base', lathe(P, [[4.4, 11.6], [4.6, 12.2], [2.8, 13]], off).sil),                        // fedő
      shineP(G.strip(-72, -55, 1, 9.5), .7),
    ]});
  }

  // =====================================================================
  //  2. SZOLGÁLTATÁS-IKONOK (egyszerű tárgyként)
  // =====================================================================

  // ---- Streaming – lejátszó-képernyő: lila kijelző nagy méz-színű lejátszás-gombbal és folyamatjelző csíkkal. (24 × 15 cm)
  {
    const TILT = -12, X = 12, H = 15, Z = .8;
    const P = camera({ az:26, el:12, F:150, tilt:TILT, span:80, fit:corners(-X, X, 0, H, -Z, Z) }), k = P.k;
    const C = cube(P, 'dark', -X, X, 0, H, -Z, Z), F = FF(P, Z), scr = rrect(-11, 1, 11, H - 1, .6, F(.03), 2);
    const pc = [0, 8.3], pr = 3.8;
    add('dr_streaming', { hu:'streaming (videó és zene)', en:'video player screen with a play button', look:'dark framed screen in three-quarter view showing a purple video player with a big round honey play button and a progress bar, no text, no logo', tilt:TILT, shapes:[
      ...C.s,
      det('purple', 'base', scr),                                                                            // kijelző
      det('purple', 'light', clip([[-X, H], [1, H], [-X, 5]].map(F(.04)), scr), { o:.7 }),
      det('purple', 'dark', clip([[-X, 0], [X, 0], [X, 4.3], [-X, 4.3]].map(F(.04)), scr)),
      face('honey', 'dark', hull([...circ(...pc, pr, 20).map(F(.05)), ...circ(...pc, pr, 20).map(F(.7))])),   // lejátszás-gomb
      dface('honey', null, circ(...pc, pr, 20).map(F(.7))),
      dface('dark', 'base', [[-1.3, 6.3], [2.2, 8.3], [-1.3, 10.3]].map(F(.75))),                             // háromszög
      lineP('steel', 'dark', [F(.05)([-9.5, 2.6]), F(.05)([9.5, 2.6])], 1.8),                                // folyamatjelző
      lineP('leaf', 'light', [F(.06)([-9.5, 2.6]), F(.06)([-2, 2.6])], 1.8),
      dface('paper', 'light', circ(...F(.07)([-2, 2.6]), .85 * k, 10)),
      shineP([F(.8)([-2.6, 10.6]), F(.8)([-1.6, 11.6]), F(.8)([-2.9, 11.9])], .7),
    ]});
  }

  // ---- Felhő fotókkal – vastag, pufók felhő; előtte két fénykép (tájkép, szöveg nélkül) „tárolva”.
  {
    const CS = [[31, 46, 12], [47, 36, 16], [64, 40, 13], [73, 51, 9.5], [25, 55, 8.5]], BOT = 60;
    const inside = (x, y) => (y <= BOT && CS.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r)) || (x >= 24 && x <= 74 && y >= 44 && y <= BOT);
    const cloud = simplify(Array.from({ length:90 }, (_, i) => { const a = 2 * Math.PI * i / 90, dx = Math.cos(a), dy = Math.sin(a);
      let r = 50; while(r > 0 && !inside(50 + dx * r, 46 + dy * r)) r -= .2; return [50 + dx * r, 46 + dy * r]; }), .3);
    const photo = (cx, cy, deg, sun) => { const fr = rbox(cx, cy, 20, 22, deg), pic = rbox(cx, cy - 2.2, 16, 13.5, deg);
      const hill = clip([[-9, 3.5], [-3, -.5], [2, 1.8], [9, -1.5], [9, 8], [-9, 8]].map(([x, y]) => [cx + x * cos(deg) - (y - 2.2) * sin(deg), cy + x * sin(deg) + (y - 2.2) * cos(deg)]), pic);
      return [face('paper', null, fr), det('sky', 'base', pic), det('leaf', 'base', hill), sun ? dface('honey', 'light', circ(cx + 3.5 * cos(deg) + 4.5 * sin(deg), cy + 3.5 * sin(deg) - 4.5 * cos(deg), 2.2, 10)) : null].filter(Boolean); };
    add('dr_felho', { hu:'felhő és fotók', en:'cloud storage with photos', look:'puffy light blue cloud with thickness, two instant photos with tiny green landscapes tucked in front of it, no text, no logo', tilt:-6, shapes:[
      face('sky', 'dark', mv(cloud, 2.2, 3)),                                                                 // felhő vastagsága
      face('sky', 'light', cloud),                                                                            // felhő
      det('sky', 'base', inset(clip(cloud, [[0, 52], [100, 52], [100, 100], [0, 100]]), cloud, .8)),
      det('white', 'light', inset(clip(cloud, [[0, 0], [100, 0], [100, 34], [0, 44]]), cloud, .8), { o:.7 }),
      ...photo(40, 66, -12, false),                                                                           // fénykép 1
      ...photo(61, 69, 9, true),                                                                              // fénykép 2
      shineP(circ(40, 32, 2, 10, 5, 60), .7),
    ]});
  }

  // ---- MI – mesterséges intelligencia: vastag lila beszédbuborék, benne nagy méz-színű négyágú szikra és két kisebb.
  {
    const x0 = 16, y0 = 16, x1 = 82, y1 = 62, r = 13, arcA = (cx, cy, a0, a1) => ART.geo.arc(cx, cy, r, a0, a1, 5);
    const bub = [...arcA(x0 + r, y0 + r, 180, 270), ...arcA(x1 - r, y0 + r, 270, 360), ...arcA(x1 - r, y1 - r, 0, 90), [44, y1], [25, 81], [33, y1], ...arcA(x0 + r, y1 - r, 90, 180)];
    const big = star(50, 38, 16, 4.6, 4), c = [50, 38];
    add('dr_mi', { hu:'mesterséges intelligencia', en:'AI chat speech bubble with a sparkle', look:'thick purple speech bubble with a big honey four-pointed sparkle and two small sparkles, no text, no logo', tilt:-8, shapes:[
      face('purple', 'dark', mv(bub, 2.4, 3)),                                                                // vastagság
      face('purple', 'base', bub),                                                                            // buborék
      det('purple', 'light', inset(clip(bub, [[0, 0], [66, 0], [0, 48]]), bub, .8)),
      det('purple', 'line', inset(clip(bub, [[100, 50], [100, 100], [30, 100], [30, 57], [70, 57]]), bub, .8), { o:.25 }),
      dface('honey', 'base', big),                                                                            // szikra
      det('honey', 'light', [c, big[0], big[7], big[6]]),
      dface('honey', 'light', star(69, 25, 6.5, 2, 4)),
      dface('paper', 'light', star(31, 30, 5, 1.6, 4)),
      dface('honey', 'light', circ(67, 50, 2.1, 10)),
      shineP(circ(26, 26, 1.8, 10, 4.5, 40), .7),
    ]});
  }

  // ---- Készenlét – fehér elosztó három aljzattal, kapcsolóval és világító piros készenléti fénnyel, oldalt kábel. (28 × 4 × 6,4 cm)
  {
    const TILT = -12, X = 11.5, H = 4, Z = 3.2;
    const cable = [[-11.5, 2, 0], [-14, 1.6, .6], [-15.5, .8, 2.6], [-14.8, .5, 5.4], [-12, .4, 7]];
    const P = camera({ az:18, el:38, F:120, tilt:TILT, span:84, fit:[...corners(-X, X, 0, H, -Z, Z), ...cable] }), k = P.k;
    const C = cube(P, 'white', -X, X, 0, H, -Z, Z), Tp = y => ([x, z]) => P([x, H + y, z]), cp = pipe(P, cable, .55);
    const socks = [-7, -2, 3];
    add('dr_keszenlet', { hu:'készenlét (elosztó)', en:'power strip with a glowing standby light', look:'white power strip seen from above in three-quarter view with three round sockets, a rocker switch and a glowing red standby light, a dark cable, no text, no logo', tilt:TILT, shapes:[
      face('dark', 'base', cp.sil), det('dark', 'light', cp.hi),                                              // kábel
      ...C.s,
      lpth('steel', 'dark', socks.map(x => circ(...Tp(.02)([x, 0]), 2.1 * k, 16, 2.1 * k * .78))),           // aljzatok
      dpth('dark', 'base', socks.flatMap(x => [-.8, .8].map(d => circ(...Tp(.03)([x + d, 0]), .38 * k, 8)))),
      face('dark', 'base', box(P, 5.6, 8.6, H, H + .6, -1.5, 1.5).sil),                                       // kapcsoló
      dface('red', 'base', [[5.9, -1.2], [8.3, -1.2], [8.3, 1.2], [5.9, 1.2]].map(Tp(.9))),
      det('red', 'light', [[5.9, -1.2], [7.1, -1.2], [7.1, 1.2], [5.9, 1.2]].map(Tp(.92))),
      det('red', 'light', circ(...Tp(.02)([10, 0]), 1.8 * k, 14), { o:.55 }),                                  // készenléti fény
      dface('red', 'base', circ(...Tp(.03)([10, 0]), .7 * k, 10)),
      shineP([[-10.6, -2.6], [4, -2.6], [4, -1.9], [-10.6, -1.9]].map(Tp(.02)), .6),
    ]});
  }

  // =====================================================================
  //  3. „BETEGSÉG”-JELZŐK (kicsi matricák a tárgyra)
  // =====================================================================

  // ---- Lapos akku – fekvő elem-ikon tárgyként: ezüst ház, üres (sötét) kijelzőablak egyetlen piros csíkkal, pólus-dudor.
  {
    const TILT = -12, X = 5, H = 5, Z = 1.5;
    const P = camera({ az:22, el:16, F:40, tilt:TILT, span:80, fit:corners(-X, X + 1.2, 0, H, -Z, Z) });
    const C = cube(P, 'steel', -X, X, 0, H, -Z, Z), F = FF(P, Z), nub = cube(P, 'steel', X, X + 1.2, 1.6, 3.4, -.9, .9, { edge:false });
    add('dr_hiba_akku', { hu:'lemerült akku', en:'empty battery', look:'silver battery shape lying on its side in three-quarter view with a dark empty charge window and only one small red bar left', tilt:TILT, shapes:[
      ...nub.s,                                                                                              // pólus
      ...C.s,
      face('dark', 'base', rrect(-4.2, .8, 4.2, 4.2, .4, F(.03), 2)),                                         // üres ablak
      det('dark', 'light', [[-4.2, 4.2], [-1, 4.2], [-4.2, 2]].map(F(.04)), { o:.5 }),
      dface('red', 'base', rrect(-3.8, 1.2, -2.3, 3.8, .25, F(.05), 2)),                                       // utolsó piros csík
      det('red', 'light', [[-3.6, 3.6], [-3.1, 3.6], [-3.1, 1.4], [-3.6, 1.4]].map(F(.06))),
      shineP([F(.03)([-4.7, 4.7]), F(.03)([3.5, 4.7]), F(.03)([3.5, 4.45]), F(.03)([-4.7, 4.45])], .7),
    ]});
  }

  // ---- Repedt kijelző – kijelző-lap sötét üveggel, a becsapódási pontból szétfutó fehér repedésekkel.
  {
    const TILT = -14, X = 4.5, H = 8.5, Z = .35;
    const P = camera({ az:26, el:14, F:40, tilt:TILT, span:80, fit:corners(-X, X, 0, H, -Z, Z) });
    const C = cube(P, 'steel', -X, X, 0, H, -Z, Z), F = FF(P, Z), f = F(.06), I = [1.2, 5.6];
    const cr = pts => lineP('paper', 'light', [I, ...pts].map(f), 1.3);
    add('dr_hiba_kijelzo', { hu:'repedt kijelző', en:'cracked screen', look:'small screen panel in three-quarter view, dark glass with white cracks spreading out from one impact point', tilt:TILT, shapes:[
      ...C.s,
      face('dark', 'base', rrect(-4, .5, 4, H - .5, .4, F(.03), 2)),                                          // üveg
      det('glass', 'light', [I, [-4, 8], [-4, 4]].map(F(.04)), { o:.28 }),                                     // üvegszilánk-lapok
      det('glass', 'light', [I, [4, 3], [.3, .5]].map(F(.04)), { o:.2 }),
      cr([[-1.2, 7], [-3.9, 7.8]]), cr([[3, 7], [3.9, 8]]), cr([[3, 4.6], [4, 2.8]]),                          // repedések
      cr([[.3, 3], [-1, .5]]), cr([[-1.8, 4.6], [-3.9, 3.6]]),
      lineP('paper', 'light', circ(...I, .75, 9).concat([circ(...I, .75, 9)[0]]).map(f), 1.1),
      shineP([F(.07)([-3.6, 1.6]), F(.07)([-3.1, 1.6]), F(.07)([-2, 3.2]), F(.07)([-2.5, 3.2])], .35),
    ]});
  }

  // ---- Lassú – kedves csiga (a „lassú gép” jele): méz-színű spirális ház, zsálya test, szemnyél, mosoly.
  {
    const body = smC([[10, 77], [26, 72], [50, 71], [67, 69], [73, 58], [77, 47], [85, 44], [91, 50], [90, 63], [85, 75], [70, 80], [40, 81], [16, 81]], 5, .3);
    const shell = circ(45, 49, 21, 28), spiral = Array.from({ length:26 }, (_, i) => { const t = i / 25, a = rad(200 + 560 * t), r = 16 * (1 - t * .92); return [46 + r * Math.cos(a), 50 + r * Math.sin(a)]; });
    add('dr_hiba_lassu', { hu:'lassú (csiga)', en:'friendly snail', look:'cute smiling snail with a honey spiral shell and a sage body, two eye stalks', tilt:0, shapes:[
      face('sage', 'base', body),                                                                             // test
      det('sage', 'dark', inset(clip(body, [[0, 76], [100, 76], [100, 100], [0, 100]]), body)),
      det('sage', 'light', inset(clip(body, [[74, 40], [92, 40], [92, 52], [74, 58]]), body), { o:.9 }),
      lineP('sage', 'line', [[81, 46], [78, 33]], 2), lineP('sage', 'line', [[86, 46], [89, 33]], 2),        // szemnyelek
      dface('dark', 'base', circ(78, 32, 3.2, 10)), dface('dark', 'base', circ(89.3, 32, 3.2, 10)),           // szemek
      face('honey', 'base', shell),                                                                           // ház
      det('honey', 'dark', inset(clip(shell, [[100, 6], [100, 100], [6, 100]].map(([x, y]) => [x + 4, y + 4])), shell)),
      det('honey', 'light', inset(clip(shell, [[0, 0], [86, 0], [0, 86]]), shell)),
      lineP('honey', 'line', smO(spiral, 2), 2.4),                                                            // spirál
      lineP('sage', 'line', [[80.5, 58], [84, 61], [87.5, 58]], 1.6),                                        // mosoly
      dface('blossom', 'base', circ(89, 60, 1.8, 8), { line:false }),
      shineP(circ(34, 36, 2.2, 10, 5, 40), .7),
    ]});
  }

  // ---- Melegszik – hőmérő magasra szökött piros oszloppal, beosztás-vonásokkal, mellette két hőhullám.
  {
    const TILT = 16, xf = p => p;
    const P = camera({ az:0, el:12, F:80, tilt:TILT, span:78, fit:[[-2, 0, -2], [4.8, 13.4, 1.6], [-2, 13.4, 0], [4.8, 0, 0]] }), k = P.k;
    const G = lathe(P, [[.05, 0], [1.1, .25], [1.7, .9], [1.9, 1.9], [1.7, 2.9], [1.05, 3.5], [1, 3.8], [1, 12.6], [.75, 13.2], [.05, 13.4]], xf);
    const R = lathe(P, [[.05, .35], [1.15, .6], [1.45, 1.9], [1.15, 3], [.55, 3.5], [.55, 10.8], [.05, 11]], xf);
    const ticks = [4.2, 5.4, 6.6, 7.8, 9, 10.2, 11.4].map((y, i) => band([G.on(-10, y, .02), G.on(i % 2 ? 25 : 45, y, .02)], .55, false));
    const wave = (x, y0) => { const a = P([x, y0, 0]), b = P([x, y0 + 5, 0]); return Array.from({ length:9 }, (_, i) => { const t = i / 8; return [a[0] + (b[0] - a[0]) * t + 1.4 * Math.sin(t * 2 * Math.PI), a[1] + (b[1] - a[1]) * t]; }); };
    add('dr_hiba_meleg', { hu:'melegszik (hőmérő)', en:'thermometer showing heat', look:'glass thermometer with a high red column and tick marks, two small orange heat waves beside it', tilt:TILT, shapes:[
      face('glass', 'base', G.sil),                                                                           // üveg
      det('glass', 'dark', G.strip(40, 90, .6, 13)),
      face('red', 'base', R.sil),                                                                             // piros oszlop
      det('red', 'light', R.strip(-80, -35, .6, 10.5)),
      det('red', 'dark', R.strip(35, 90, .6, 10.5)),
      dpth('steel', 'dark', ticks),                                                                           // beosztás
      det('glass', 'light', G.full(1, 12.6, 14), { o:.8 }),
      lineP('orange', 'base', wave(3.4, 6.5), 2.4), lineP('orange', 'base', wave(4.7, 4.2), 2.4),                // hőhullámok
      shineP(G.strip(-70, -50, 3.4, 12.2), .75),
    ]});
  }

  // ---- Teli tárhely – nyitott kartondoboz, amelyből kilógnak a színes „fájlok” és egy fénykép – már nem fér bele több.
  {
    const TILT = -12, X = 6, H = 8, Z = 5;
    const cards = [[-3.2, -2.2, 4.4, 10, 12, 'water'], [.4, -1.6, 5, 11, -5, 'honey'], [3.6, -.6, 4.2, 9.4, -18, 'blossom'], [-1, 1.4, 5, 8.6, 7, 'paper'], [2.8, 2.4, 4, 7.8, -10, 'leaf']];
    const card = ([xc, zc, w, h, a]) => [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]].map(([x, y]) => [xc + x * cos(a) - y * sin(a), 2 + x * sin(a) + y * cos(a), zc]);
    const flapF = [[-X, H, Z], [X, H, Z], [X, H - 1.8, Z + 4.6], [-X, H - 1.8, Z + 4.6]], flapR = [[X, H, -Z], [X, H, Z], [X + 4.4, H - 1.8, Z], [X + 4.4, H - 1.8, -Z]];
    const flapB = [[-X, H, -Z], [X, H, -Z], [X, H + 4.2, -Z - 1.8], [-X, H + 4.2, -Z - 1.8]];
    const P = camera({ az:24, el:26, F:80, tilt:TILT, span:82, fit:[...corners(-X, X, 0, H, -Z, Z), ...flapF, ...flapR, ...flapB, ...cards.flatMap(card)] });
    const b = box(P, -X, X, 0, H, -Z, Z), ph = card(cards[3]), lerp = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);
    const phPic = [[.15, .45], [.85, .45], [.85, .88], [.15, .88]].map(([s, t]) => P(lerp(lerp(ph[0], ph[1], s), lerp(ph[3], ph[2], s), t)));
    add('dr_hiba_tarhely', { hu:'megtelt tárhely (teli doboz)', en:'overflowing box of files', look:'open cardboard box in three-quarter view overflowing with colourful file cards and a photo, flaps spread open', tilt:TILT, shapes:[
      face('cardboard', 'light', flapB.map(P)),                                                               // hátsó fül
      face('cardboard', 'line', b.top, { o:1 }),                                                              // a doboz belseje
      ...cards.map(cd => face(cd[5], cd[5] === 'paper' ? 'light' : 'base', card(cd).map(P))),                 // fájlok
      det('sky', 'base', phPic),                                                                              // fénykép
      face('cardboard', null, b.front),                                                                       // eleje
      face('cardboard', 'dark', b.right),                                                                     // oldala
      face('cardboard', 'base', flapR.map(P)),                                                                // oldalsó fül
      face('cardboard', 'light', flapF.map(P)),                                                               // első fül
      shineP([P([-5.5, 1, Z]), P([-4.7, 1, Z]), P([-4.7, 7, Z]), P([-5.5, 7, Z])], .5),
    ]});
  }

  // =====================================================================
  //  4. KEZELÉS-JELZŐK
  // =====================================================================

  // ---- Csavarhúzó – zöld, bordás nyelű lapos csavarhúzó méz-színű gyűrűvel, fém szárral, átlósan.
  {
    const TILT = 14, xf = rotZ(-38);
    const P = camera({ az:0, el:20, F:120, tilt:TILT, span:84, fit:[[0, 0, 0], [0, 20, 0], [1.6, 0, 0], [-1.6, 0, 0], [1.6, 9, 0], [-1.6, 9, 0]].map(xf) });
    const Hd = lathe(P, [[.3, 0], [1.25, .2], [1.5, .8], [1.55, 6.5], [1.35, 8.4], [1, 9.6], [.75, 10.2]], xf);
    const Rg = lathe(P, [[1.52, 6.9], [1.46, 7.6]], xf), Fe = lathe(P, [[.72, 10.1], [.72, 11]], xf);
    const Sh = lathe(P, [[.32, 11], [.32, 18.6], [.12, 19.9]], xf);
    add('dr_kez_csavarhuzo', { hu:'javítás (csavarhúzó)', en:'screwdriver', look:'screwdriver lying diagonally with a green fluted handle, a honey ring, a steel shaft and a flat tip', tilt:TILT, shapes:[
      face('leaf', 'base', Hd.sil),                                                                           // nyél
      det('leaf', 'light', Hd.strip(-90, -45, .3, 9.4)),
      det('leaf', 'dark', Hd.strip(45, 90, .3, 9.4)),
      dpth('leaf', 'dark', [[-40, -28], [-6, 6], [28, 40]].map(([a0, a1]) => Hd.strip(a0, a1, 1.2, 6.2, 2))),    // bordák
      face('honey', 'base', Rg.sil),                                                                          // gyűrű
      face('steel', 'dark', Fe.sil),                                                                          // hüvely
      face('steel', 'base', Sh.sil),                                                                          // szár
      det('steel', 'light', Sh.strip(-90, -30, 11.2, 18.4)),
      det('steel', 'dark', Sh.strip(40, 90, 11.2, 19.6)),
      shineP(Hd.strip(-70, -58, 1.6, 8), .7),
    ]});
  }

  // ---- Alkatrészcsere – új akku-modul: lapos, sötét akku zöld címkével és méz-színű villám-jellel, szalagkábel csatlakozóval, csillanás.
  {
    const TILT = -14, X = 3.2, H = .8, Z = 4.6;
    const rib = [[.7, .4, -Z], [2, .4, -Z], [2, .4, -Z - 2.2], [.7, .4, -Z - 2.2]];
    const P = camera({ az:22, el:48, F:40, tilt:TILT, span:80, fit:[...corners(-X, X, 0, H, -Z, Z), ...corners(.4, 2.3, 0, .8, -Z - 3.2, -Z)] }), k = P.k;
    const C = cube(P, 'dark', -X, X, 0, H, -Z, Z), Tp = y => ([u, w]) => P([u, H + y, -w]);
    const bolt = [[.3, 2.6], [-1.4, -.2], [-.15, -.2], [-.55, -2.8], [1.4, .45], [.12, .45]];
    const st = star(0, 0, 7, 2, 4), s0 = P([X, H, -Z]);
    add('dr_kez_alkatresz', { hu:'alkatrészcsere (akku-modul)', en:'replacement battery module', look:'flat dark phone battery module seen from above in three-quarter view with a green label, a honey lightning mark, a gold ribbon connector and a sparkle', tilt:TILT, shapes:[
      face('gold', 'light', rib.map(P)),                                                                      // szalagkábel
      face('dark', 'base', box(P, .4, 2.3, 0, .8, -Z - 3.2, -Z - 2.1).sil),                                   // csatlakozó
      ...C.s,
      dface('leaf', 'base', rrect(-2.6, -3.8, 2.6, 3.8, .4, Tp(.02), 2)),                                     // címke
      det('leaf', 'light', clip([[-3, 4], [1, 4], [-3, -1]], rrect(-2.6, -3.8, 2.6, 3.8, .4)).map(Tp(.03))),
      dface('honey', 'base', bolt.map(Tp(.04))),                                                              // villám
      dface('paper', 'light', mv(st, s0[0] + 1, s0[1] - 3)),                                                  // csillanás (új)
      shineP([[-2.9, 3.8], [-2.3, 3.8], [-2.3, -3.2], [-2.9, -3.2]].map(Tp(.05)), .35),
    ]});
  }

  // ---- Frissítés – vastag, körbe futó zöld nyíl (szoftverfrissítés), közepén méz-színű felfelé mutató nyíl.
  {
    const c = [48, 50], Ro = 34, Ri = 23, Rm = (Ro + Ri) / 2, a0 = -35, a1 = 245, pt = (r, a) => [c[0] + r * cos(a), c[1] + r * sin(a)];
    const ringArc = (r, s, e, n = 16) => Array.from({ length:n + 1 }, (_, i) => pt(r, s + (e - s) * i / n));
    const arrow = [...ringArc(Ro, a0, a1), pt(Ro + 6, a1), pt(Rm, a1 + 30), pt(Ri - 6, a1), ...ringArc(Ri, a1, a0)];
    const seg = (s, e) => [...ringArc(Ro - .8, s, e, 6), ...ringArc(Ri + .8, e, s, 6)];
    const up = [[48, 34], [58, 45], [52, 45], [52, 62], [44, 62], [44, 45], [38, 45]];
    add('dr_kez_frissites', { hu:'frissítés', en:'circular update arrow', look:'thick green circular arrow with a small honey up arrow in the middle', tilt:0, shapes:[
      face('leaf', 'dark', mv(arrow, 2.2, 2.8)),                                                              // vastagság
      face('leaf', 'base', arrow),                                                                            // nyíl
      det('leaf', 'light', seg(150, 240)),
      det('leaf', 'dark', seg(0, 80), { o:.8 }),
      face('honey', 'dark', mv(up, 1.4, 1.8)),
      face('honey', 'base', up),                                                                              // felfelé nyíl
      det('honey', 'light', [[48, 36.5], [48, 60.5], [45.5, 60.5], [45.5, 44], [41.5, 44]]),
      lineP('leaf', 'line', ringArc(Rm, 95, 130, 5), 1.2, { o:.35 }),
      shineP(band(ringArc(Ro - 3.5, 185, 225, 6), 2.2), .6),
      dface('honey', 'light', star(80, 22, 6, 1.8, 4)),
    ]});
  }

  // ---- Továbbadás – két kéz (két különböző ujjú) átad egy kartondobozt: a bal oldali odaadja, a jobb oldali átveszi.
  {
    const TILT = -8, X = 5, H = 6, Z = 4;
    const Pc = camera({ az:24, el:22, F:60, tilt:TILT, span:38, fit:corners(-X, X, 0, H, -Z, Z) }), P = p => mv([Pc(p)], 0, -6)[0];
    const b = box(P, -X, X, 0, H, -Z, Z), tapeT = [[-.9, -Z], [.9, -Z], [.9, Z], [-.9, Z]].map(([x, z]) => P([x, H + .02, z]));
    const tapeF = [[-.9, H], [.9, H], [.9, 3.2], [-.9, 3.2]].map(([x, y]) => P([x, y, Z + .02]));
    const palmL = smC([[18, 70], [30, 62], [44, 62], [50, 66], [44, 70], [32, 74], [22, 78]]), palmR = smC([[82, 64], [70, 58], [58, 60], [54, 64], [60, 67], [72, 70], [84, 74]]);
    const thumbL = smC([[33, 64], [30, 54], [33, 50], [37, 53], [38, 63]]), thumbR = smC([[64, 60], [66, 50], [70, 47], [73, 51], [70, 61]]);
    add('dr_kez_tovabbad', { hu:'továbbadás', en:'hands passing on a box', look:'two friendly hands with green and honey sleeves, one handing a small cardboard box to the other', tilt:TILT, shapes:[
      face('leaf', 'base', band([[19, 80], [26, 71]], 12)),                                                    // bal ujj
      face('honey', 'base', band([[84, 80], [78, 69]], 12)),                                                  // jobb ujj
      face('skin', 'base', palmL), face('skin', 'base', palmR),                                               // tenyerek
      face('cardboard', 'dark', b.right), face('cardboard', 'light', b.top), face('cardboard', null, b.front),   // doboz
      det('cream', 'base', tapeT), det('cream', 'base', tapeF),                                                // ragasztószalag
      face('skin', null, thumbL), face('skin', null, thumbR),                                                 // hüvelykujjak
      det('leaf', 'light', band([[19, 77], [24, 71]], 3)), det('honey', 'light', band([[82, 76], [78, 70]], 3)),
      shineP(inset([P([-4.5, 1, Z]), P([-3.8, 1, Z]), P([-3.8, 5, Z]), P([-4.5, 5, Z])], b.sil), .5),
    ]});
  }

  // ---- Újrahasznosítás – zöld e-hulladék gyűjtőláda: tetején résbe dugott régi telefon, elöl villásdugó-jel.
  {
    const TILT = -12, X = 7, H = 15, Z = 6, rot = rotZ(10), ph = p => { const q = rot([p[0], p[1] - H, p[2]]); return [q[0], q[1] + H, q[2]]; };
    const phoneC = corners(-2.3, 2.3, H, H + 6.5, -.7, -.1).map(ph);
    const P = camera({ az:24, el:20, F:120, tilt:TILT, span:80, fit:[...corners(-X, X, 0, H, -Z, Z), ...phoneC] }), k = P.k;
    const C = cube(P, 'leaf', -X, X, 0, H, -Z, Z), F = FF(P, Z), Tp = ([x, z]) => P([x, H + .02, z]);
    const Pp = p => P(ph(p)), pb = box(Pp, -2.3, 2.3, H, H + 6.5, -.7, -.1);
    add('dr_kez_ujrahaszn', { hu:'újrahasznosítás (e-hulladék gyűjtő)', en:'e-waste collection bin with an old phone', look:'green e-waste collection box in three-quarter view with an old phone dropped half into the slot on top and a plug symbol on the front, no text', tilt:TILT, shapes:[
      ...C.s,
      det('leaf', 'light', inset([[-X, H], [0, H], [-X, 6]].map(F(.02)), C.b.sil)),
      face('dark', 'base', [[-4, -1.3], [4, -1.3], [4, .5], [-4, .5]].map(Tp)),                               // bedobó-rés
      face('dark', 'dark', pb.right), face('dark', 'light', pb.top), face('dark', 'base', pb.front),          // régi telefon
      det('sky', 'dark', rrect(-1.9, H + .6, 1.9, H + 6, .3, ([u, v]) => Pp([u, v, -.08]), 1)),
      dface('steel', 'light', rrect(-2.3, 5.2, 2.3, 8.8, .6, F(.03), 2)),                                      // dugó-jel
      dpth('steel', 'dark', [-1.1, 1.1].map(u => [[u - .4, 8.8], [u + .4, 8.8], [u + .4, 11], [u - .4, 11]].map(F(.03)))),
      lineP('steel', 'line', [F(.03)([0, 5.2]), F(.03)([0, 3.8]), F(.03)([1.8, 2.8]), F(.03)([1.2, 1.4])], 1.6),
      shineP([F(.03)([-6.4, 1.2]), F(.03)([-5.6, 1.2]), F(.03)([-5.6, 13.5]), F(.03)([-6.4, 13.5])], .45),
    ]});
  }

  // ---- Új eszköz – égszínkék doboz méz-színű szalaggal és masnival (a „vegyél újat” jele), csillanással.
  {
    const TILT = -12, X = 6.2, Hb = 7.4, L = 6.8, H = 10, Z = 6.2, w = .9;
    const P = camera({ az:24, el:24, F:80, tilt:TILT, span:74, fit:[...corners(-L, L, 0, H + 3.5, -L, L)] }), k = P.k;
    const bx = box(P, -X, X, 0, Hb, -Z, Z), ld = box(P, -L, L, 7, H, -L, L), top = P([0, H, 0]);
    const q = (pts, f) => pts.map(f);
    const loop = (deg) => circ(top[0] + 6.2 * cos(deg), top[1] + 6.2 * sin(deg) - 2.5, 6.4, 14, 3.8, deg);
    add('dr_kez_uj', { hu:'új eszköz (új doboz)', en:'new boxed device with a ribbon', look:'light blue gift-like box in three-quarter view with a honey ribbon and a bow on top, a small sparkle', tilt:TILT, shapes:[
      face('sky', 'dark', bx.right), face('sky', null, bx.front),                                              // doboz
      dface('honey', 'base', q([[-w, 0], [w, 0], [w, 7], [-w, 7]], ([x, y]) => P([x, y, Z + .02]))),           // szalag a dobozon
      dface('honey', 'dark', q([[-w, 0], [w, 0], [w, 7], [-w, 7]], ([z, y]) => P([X + .02, y, -z]))),
      face('sky', 'dark', ld.right), face('sky', 'light', ld.top), face('sky', 'base', ld.front),              // fedő
      lpth('honey', 'light', [q([[-w, -L], [w, -L], [w, L], [-w, L]], ([x, z]) => P([x, H + .02, z])), q([[-L, -w], [L, -w], [L, w], [-L, w]], ([x, z]) => P([x, H + .02, z]))]),
      dface('honey', 'base', q([[-w, 7], [w, 7], [w, H], [-w, H]], ([x, y]) => P([x, y, L + .02]))),
      dface('honey', 'dark', q([[-w, 7], [w, 7], [w, H], [-w, H]], ([z, y]) => P([L + .02, y, -z]))),
      face('honey', 'base', loop(-150)), face('honey', 'base', loop(-30)),                                    // masni
      face('honey', 'dark', circ(top[0], top[1] - 2.3, 2.6, 10)),
      dface('paper', 'light', star(80, 22, 6, 1.8, 4)),                                                       // csillanás
      shineP([P([-5.8, 1, Z]), P([-5, 1, Z]), P([-5, 6.4, Z]), P([-5.8, 6.4, Z])], .45),
    ]});
  }
})();
});
