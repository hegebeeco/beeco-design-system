// ============================================================
//  Matricák — „Élő lánc” (táplálékháló a virágos réten), 2. csomag, B szinten (docs/rajzolas.md, docs/halo-jatekterv.md)
//  4 matrica: zöld fátyolka, levéltetű-fürkészdarázs a „múmiával”, vörös vércse, vércseláda karón.
//  Az art-halo.js már 857 soros, ezért külön fájl; a segédek annak a másolatai (így ez a fájl is önálló).
//  A játékban hatszögben, ~44–52 px-en jelennek meg (artIcon('halo_…')) → nagy, egyszerű sziluett, kevés, de jellegzetes részlet.
//  Megkülönböztetés a meglévőktől: fátyolka = halványzöld, vékony test, NAGY, zöld erezetű háztető-szárny, arany szem;
//  fürkészdarázs = apró, fekete, darázsderekú, hosszú csáp – a fő elem a felfúvódott, barna levéltetű-„múmia” a KEREK kibújónyílással;
//  vércse = karcsú, jobbra néz, SZÜRKE fej és farok, rozsdavörös pettyes szárny, fekete bajuszsáv (az ölyv barna, zömök, szemből);
//  vércseláda = félig nyitott elejű faláda karón, T alakú ülőfával (a rovarhotel piros nyeregtetős, rekeszes).
//  Nincs szöveg, szám, márka, jelkép. Render: node tools/art-render.js 2d web/js/art/art-halo-b.js ki.png --skip halo
//  Emoji-álnév nincs (a játék névvel kéri).
// ============================================================
ART.later('halo-b', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
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

  // =====================================================================
  //  28. Zöld fátyolka (Chrysoperla carnea) – oldalnézet balra: halványzöld, karcsú test, NAGY, víztiszta szárnyak háztetőszerűen
  //      a test fölött (a potroh végén túlnyúlnak), sűrű zöld erezet (csipkés háló), hosszú, vékony csáp, aranyszínű szem
  // =====================================================================
  {
    const T = -8;
    // szárny: tő (x0, y0), hossz L, magasság H; u a hossz mentén, f az alsó (0) és a felső (1) szél között
    const wing = (x0, y0, L, H) => { const lo = u => y0 - 5 * u, hi = u => lo(u) - H * Math.pow(Math.sin(Math.PI * min(1, max(0, u))), .62);
      const at = (u, f) => [x0 + L * u, lo(u) + (hi(u) - lo(u)) * f];
      const N = 14, out = []; for(let i = 0; i <= N; i++) out.push(at(i / N, 0)); for(let i = N - 1; i > 0; i--) out.push(at(i / N, 1));
      return { sil:smC(out, 2), at }; };
    const wN = wing(29, 58, 62, 30), wF = wing(26, 54, 58, 27);
    const veins = [...[.3, .56, .8].map(f => bar(Array.from({ length:8 }, (_, i) => wN.at(.05 + .9 * i / 7, f)), .7)),
      ...Array.from({ length:9 }, (_, i) => { const u = .13 + .085 * i; return [[0, .3], [.3, .56], [.56, .8], [.8, 1]].map(([a, b], j) => bar([wN.at(u + (j % 2) * .04, a), wN.at(u + (j % 2) * .04, b)], .6)); }).flat()];
    const head = circ(19, 58, 6, 14, 5.6), thor = smC([[23, 55], [31, 53.5], [37, 55.5], [36.5, 61], [29, 62.5], [23.5, 61]], 3);
    const abd = smC([[36, 56], [48, 55.5], [60, 56.5], [68, 58.5], [70, 60.5], [65, 62.5], [54, 63.5], [42, 62.5], [36, 61]], 4);
    const legs = [[[26, 61], [22, 68], [19, 74]], [[31, 62], [31, 69], [29, 75]], [[35, 61], [39, 68], [42, 74]]].map(p => bar(p, 1.1));
    const ant = [bar(smO([[16, 54], [10.5, 44], [8, 32], [9.5, 19]], 2), .75), bar(smO([[18, 53], [16.5, 42], [17, 30], [20.5, 18]], 2), .75)];
    fin('halo_fatyolka', { hu:'zöld fátyolka', en:'green lacewing', tilt:T, look:'delicate green lacewing in side view facing left: slender pale green body, very large clear wings held roof-like over the body with a fine green net of veins, long thin antennae and shiny golden eyes', shapes:[
      pth('leaf', 'base', legs), pth('leaf', 'dark', ant),
      pth('sage', 'light', [wF.sil], { o:.55 }),
      ...blob('leaf', abd, [53, 59.5], { tilt:T, ld:2.6, dd:2.2, ed:0, bt:'light', lm:'grass' }),
      ...blob('leaf', thor, [30, 58], { tilt:T, ld:2.2, dd:0, ed:0, bt:'light', lm:'grass' }),
      pth('leaf', 'light', [head]),
      pth('gold', 'base', [circ(17, 57, 3.6, 12)]), det('paper', 'light', circ(16, 55.8, 1.1, 6), { o:.9 }),
      pth('sage', 'light', [wN.sil], { o:.4 }),
      dpth('leaf', 'dark', veins, { o:.7 }),
      shineP(band([wN.at(.2, .72), wN.at(.42, .9)], 1.6), .75),
    ] });
  }

  // =====================================================================
  //  29. Levéltetű-fürkészdarázs (Aphidiinae) – zöld száron egy felfúvódott, papírszerű, barnás levéltetű-„múmia” (a hátsó
  //      két kis csővel), a hátán a KEREK kibújónyílással és a félig nyitott „fedővel”; mellette a száron az apró, karcsú,
  //      fekete darázs: darázsderék, hegyes potroh, hosszú fonalas csáp, víztiszta szárny sötét szárnyjeggyel, barnássárga láb
  // =====================================================================
  {
    const stem = tube(smO([[12, 92], [32, 74], [56, 54], [78, 38], [92, 30]]), t => 5 - 1.4 * t), L = leafSet([[OVAL, 62, 49, 30, 26]]);
    // múmia: a szár tetején, a szár irányában (−40°), hátsó vége balra-lent
    const mc = [31, 60], ms = 1.35, M = (u, v) => [mc[0] + ms * (u * cos(-40) - v * sin(-40)), mc[1] + ms * (u * sin(-40) + v * cos(-40))];
    const mum = smC([[-14, 1], [-11, -7], [-2, -10.5], [8, -9], [14, -3], [13, 4], [4, 7.5], [-8, 7]].map(([u, v]) => M(u, v)), 4);
    const segs = [-6, 0, 6].map(u => bar(smO([M(u - 1, -9.5), M(u + 1.2, -2), M(u, 6.5)], 2), .8));
    const sip = [bar([M(-9, -5.5), M(-14.5, -8)], 1.6), bar([M(-8, -2), M(-14, -3.4)], 1.6)];
    const hole = circ(...M(1, -3.5), 4.4, 14, 3.8, -40), rim = circ(...M(1.2, -3.2), 5.4, 14, 4.7, -40), lid = circ(...M(1.5, -12.2), 5.4, 12, 2, -40);
    // a darázs saját koordinátában (x jobbra = a potroh vége, y lefelé = a láb felé), a szárra forgatva (−36°)
    const wc = [60, 40], s = .95, W = ([u, v]) => [wc[0] + s * (u * cos(-36) - v * sin(-36)), wc[1] + s * (u * sin(-36) + v * cos(-36))];
    const wb = [circ(-9, -1, 3.4, 12, 3.1), circ(0, -.5, 5.6, 14, 3.9), smC([[8, 0], [13, -2], [19, -.5], [24, 4], [18, 4.8], [12, 3.8], [8.5, 2]], 3)].map(p => p.map(W));
    const waist = bar([[4.5, 0], [8.5, .8]].map(W), 1.4);
    const wlegs = [[[-3, 2.5], [-6.5, 6.5], [-8.5, 9.5]], [[0, 3], [.5, 7], [-.5, 10]], [[3, 2.5], [7.5, 6.5], [9.5, 9.5]]].map(p => bar(p.map(W), 1.25));
    const want = [bar(smO([[-11.5, -2.5], [-16, -9], [-21, -14], [-27, -15]].map(W), 2), 1), bar(smO([[-11, -3.5], [-13.5, -11], [-17, -18], [-22, -22]].map(W), 2), 1)];
    const wing = smC([[-1, -3.5], [8, -8.5], [19, -10.5], [28, -9], [27.5, -5.5], [15, -4], [3, -2.5]].map(W), 3), stig = circ(...W([14.5, -9]), 1.6, 8, 1, -36);
    fin('halo_furkeszdarazs', { hu:'levéltetű-fürkészdarázs', en:'aphid parasitoid wasp with an aphid mummy', look:'a tiny slim black parasitoid wasp with long thread-like antennae, a narrow waist and clear wings standing on a green stem next to a swollen papery tan-brown aphid mummy that has a neat round exit hole with its lid flipped open', shapes:[
      ...stemS(stem), pth('grass', 'base', L.lit), pth('leaf', 'base', L.shade),
      ...blob('cardboard', mum, mc, { ld:3.6, dd:3.4, ed:1.4 }),
      dpth('cardboard', 'dark', [...segs, ...sip]),
      det('cardboard', 'light', rim), det('dark', 'base', hole), face('cardboard', 'light', lid),
      dpth('wood', 'base', wlegs), dpth('dark', 'base', want),
      pth('dark', 'base', [...wb, waist]), dpth('steel', 'dark', [crescent(wb[1], W([0, -.5]), -126, 60, 1.4), crescent(wb[2], W([15, 1.5]), -126, 60, 1.4)]),
      pth('glass', 'light', [wing], { o:.65 }), dpth('glass', 'line', [bar([[1, -3.5], [9, -7.2], [14.5, -9]].map(W), .6)], { o:.6 }), det('dark', 'base', stig),
      shineP(band([M(2, -7.5), M(9, -6)], 1.6), .8),
    ] });
  }

  // =====================================================================
  //  30. Vörös vércse (Falco tinnunculus), hím – ágon ülő, karcsú kis sólyom, oldalnézetben JOBBRA néz (az ölyv szemből, a gyurgyalag
  //      balra): kékesszürke fej és hosszú szürke farok fekete végszalaggal és fehér hegyével, rozsdavörös, sötéten pettyezett
  //      hegyes szárny, sötét evezőtollak, fekete „bajuszsáv” a szem alatt, sárga szemgyűrű, viaszhártya és láb, krém, pettyes mell
  // =====================================================================
  {
    const tail = smC([[37, 58], [47, 60], [42, 80], [36, 96], [29, 95], [30, 78]], 3);
    const body = smC([[52, 24], [62, 28], [66.5, 40], [64, 53], [56, 63], [46, 66], [39, 60], [39, 44], [44, 30]], 4);
    const wing = smC([[44, 29], [55, 32], [57.5, 44], [51, 58], [41, 72], [33, 82], [34, 68], [37, 50], [39, 36]], 4);
    const prim = clip(smC([[20, 62], [60, 56], [60, 100], [20, 100]], 1), hullOf(wing));
    const head = circ(57.5, 20, 10, 16, 9.3), cheek = smC([[57, 22], [63, 21.5], [64, 26.5], [60, 28.5], [57, 26]], 2);
    const hook = smC([[65.5, 16.5], [70, 16.8], [73.5, 20], [72.8, 25], [70.8, 22.5], [66, 22]], 2);
    const spots = [[48, 38], [45.5, 46], [43, 55], [52, 44], [50, 52], [40, 64], [46, 60]].map(([x, y]) => circ(x, y, 2, 6, 1.4, 30));
    const bspots = [[60, 38], [63, 45], [58, 50], [61, 55], [55, 58]].map(([x, y]) => circ(x, y, .9, 6, 1.4));
    fin('halo_voros_vercse', { hu:'vörös vércse', en:'common kestrel', look:'slim male common kestrel perched on a branch facing right: blue-grey head with a black moustache stripe below the eye and a yellow eye ring and cere, rufous wing with dark spots and dark wingtips, long blue-grey tail with a black band and white tip, pale spotted breast, yellow feet', shapes:[
      pth('wood', 'dark', [taper([[10, 67], [50, 65.5], [90, 69]], 4.2, 3.2)]),
      pth('steel', 'dark', [tail]), dpth('white', 'base', [stripH(tail, 91.5, 100, 0)]),
      ...blob('cream', body, [54, 44], { ld:0, dd:3.6, ed:0, dm:'cardboard' }),
      dpth('chocolate', 'base', bspots),
      ...blob('orange', wing, [46, 50], { ld:3, dd:3, ed:0, bt:'dark', lt:'base', dm:'ember' }),
      dpth('chocolate', 'dark', [prim, ...spots]),
      ...blob('steel', head, [57.5, 20], { ld:2.6, dd:2.6, ed:0, bt:'dark', lt:'base', dm:'steel' }),
      det('cream', 'base', cheek),
      dpth('dark', 'base', [stripH(tail, 85.5, 91.5, 0), taper([[59, 22], [58.2, 28.5]], 2.6, 1.6)]),
      pth('honey', 'base', [circ(61, 18.5, 3, 12), smC([[64.8, 16.5], [67.5, 16.5], [67.5, 21.5], [64.8, 21.5]], 1), ...[47, 53].map(x => taper([[x, 63], [x + .5, 67.5]], 2.4, 1.8))], { d:true }),
      det('dark', 'base', circ(61, 18.5, 2.1, 10)),
      pth('dark', 'light', [hook]),
      shineP(band([[51, 13.5], [57, 11]], 1.6), .7),
    ] });
  }

  // =====================================================================
  //  31. Vércseláda karón – fa költőláda (dm-ben vetítve) magasan egy oszlopon: hátrafelé lejtő, féltetős fedél,
  //      az eleje FÉLIG NYITOTT (alul zárt deszka, felül nagy nyílás, benne a belső fal és az alom), mellette T alakú ülőfa,
  //      az oszlop tövében fűcsomó
  // =====================================================================
  {
    const P = cam({ az:28, el:16, F:70, fit:corners(-6, 2.2, 0, 9.6, -2.9, 3) }), k = P.k, p = (x, y, z) => P([x, y, z]);
    const pole = box(P, -.36, .36, 0, 6.1, -.36, .36);
    const post = box(P, -5.05, -4.75, 0, 6.6, .45, .75), perch = box(P, -6, -3.8, 6.6, 6.86, .43, .77);
    const X0 = -1.6, X1 = 1.6, Y0 = 6, YF = 9, YB = 8.5, Z0 = -2.4, Z1 = 2.4;
    const front = [p(X0, Y0, Z1), p(X1, Y0, Z1), p(X1, YF, Z1), p(X0, YF, Z1)], right = [p(X1, Y0, Z1), p(X1, Y0, Z0), p(X1, YB, Z0), p(X1, YF, Z1)];
    const open = qrect(front, .1, .9, .5, .93);
    // a nyíláson át: a bal belső fal és az alom (a nyílásra vágva)
    const inWall = clip([p(X0 + .1, 7.5, Z1), p(X0 + .1, 7.5, Z0), p(X0 + .1, YB, Z0), p(X0 + .1, YF, Z1)], open);
    const floor = clip([p(X0, 7.5, Z1), p(X1, 7.5, Z1), p(X1, 7.5, Z0), p(X0, 7.5, Z0)], open);
    const RX0 = -1.9, RX1 = 1.9, RZ0 = -2.8, RZ1 = 2.95, ry = z => YF + (YB - YF) * (Z1 - z) / (Z1 - Z0), th = .28;
    const rTop = [p(RX0, ry(RZ1) + th, RZ1), p(RX1, ry(RZ1) + th, RZ1), p(RX1, ry(RZ0) + th, RZ0), p(RX0, ry(RZ0) + th, RZ0)];
    const rFront = [p(RX0, ry(RZ1), RZ1), p(RX1, ry(RZ1), RZ1), p(RX1, ry(RZ1) + th, RZ1), p(RX0, ry(RZ1) + th, RZ1)];
    const rSide = [p(RX1, ry(RZ1), RZ1), p(RX1, ry(RZ0), RZ0), p(RX1, ry(RZ0) + th, RZ0), p(RX1, ry(RZ1) + th, RZ1)];
    const grain = [.3, .62].map(t => bar([0, 1].map(i => lerp(lerp(right[0], right[3], t), lerp(right[1], right[2], t), i)), .5));
    // fűcsomó az oszlop tövében
    const g0 = p(0, 0, .3), g1 = p(-4.9, 0, .9), blade = (a, l, w, bend, g = g0) => taper(smO([g, [g[0] + l * .5 * cos(a) + bend, g[1] + l * .5 * sin(a)], [g[0] + l * cos(a) + bend * 2.4, g[1] + l * sin(a)]], 2), w, .5);
    const back = [[-150, 12, 2.6, -1.5], [-112, 14, 2.6, -1], [-70, 13, 2.6, 1.2], [-32, 11, 2.4, 1.5]].map(q => blade(...q));
    const fr = [[-135, 10, 2.8, -1], [-95, 12, 2.8, -.6], [-55, 11, 2.8, 1], [-165, 8, 2.4, -1], [-15, 8, 2.4, 1]].map(q => blade(...q))
      .concat([[-140, 8, 2.4, -1], [-100, 9, 2.4, -.5], [-60, 8, 2.4, .8]].map(q => blade(...q, g1)));
    fin('halo_v_vercselada', { hu:'vércseláda karón', en:'kestrel nest box on a pole', tilt:-4, look:'wooden kestrel nest box mounted high on a wooden pole in three-quarter view: a sloping single-pitch roof, the front half open (a closed lower board and a big opening above showing the dark inside), a T-shaped perch on a post beside it and a tuft of grass at the foot of the pole', shapes:[
      pth('leaf', 'dark', [circ((g0[0] + g1[0]) / 2, g0[1] + .5, 16, 16, 3.4)]),
      pth('grass', 'dark', back),
      pth('wood', 'base', [pole.front, post.front, perch.front]), pth('wood', 'dark', [pole.right, post.right, perch.right]), dpth('wood', 'light', [perch.top]),
      face('wood', 'dark', right), dpth('wood', 'line', grain, { o:.3 }),
      face('wood', 'light', front),
      det('dark', 'base', open), det('chocolate', 'base', inWall), det('soil', 'base', floor),
      face('dark', 'base', rSide), face('dark', 'light', rTop), det('dark', 'dark', rFront),
      pth('grass', 'base', fr),
      shineP([lerp(rTop[0], rTop[1], .12), lerp(rTop[0], rTop[1], .55), lerp(lerp(rTop[0], rTop[1], .55), lerp(rTop[3], rTop[2], .55), .14), lerp(lerp(rTop[0], rTop[1], .12), lerp(rTop[3], rTop[2], .12), .14)], .55),
    ] });
  }

})();
});
