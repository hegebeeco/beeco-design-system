// ============================================================
//  Matricák — Greenwashing-vadász (Ítéld el!) termékei, 5. csoport (gw_ + azonosító), B szint (docs/rajzolas.md)
//  halrudacska · fa kerti pad · vízforraló · pamut ágynemű · polárpulóver · hajbalzsam · eldobható tányér · autógumi
//  (a 2026-09-29-i +20 kártyás bővítéshez; a toalettpapír a meglévő 'papirtekercs' matricát kapja).
//  Csak a termék: szöveg, márka, logó nélkül (a hamis márkát és az öko-pecsétet a HTML adja).
//  Valódi méretből (cm) vetítve (ART.geo.camera), 4 éles tónus, 3/4-es nézet, tömör olíva árnyék.
//  A segédek az art-gw-d.js-ből másolva (a fájlok önállóak, közös globális nevük nincs).
//  Render: node tools/art-render.js 2d <ez a fájl> ki.png
// ============================================================
(function(){
  const { rad, camera, band } = ART.geo;
  const { hypot, max, min, abs, sqrt } = Math;
  const sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d));
  const r1 = n => Math.round(n * 10) / 10;

  // ---------------- 2D segédek ----------------
  const area = poly => poly.reduce((a, p, i) => { const q = poly[(i + 1) % poly.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
  function hull(pts){
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for(const q of p){ while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for(const q of p.reverse()){ while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // Douglas–Peucker ritkítás (zárt sokszög) – kis SVG
  function simplify(poly, eps = .25){
    const dp = pts => {
      if(pts.length < 3) return pts;
      const a = pts[0], b = pts[pts.length - 1], L = hypot(b[0] - a[0], b[1] - a[1]) || 1;
      let best = 0, bi = 0;
      for(let i = 1; i < pts.length - 1; i++){ const d = abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if(d > best){ best = d; bi = i; } }
      return best > eps ? [...dp(pts.slice(0, bi + 1)).slice(0, -1), ...dp(pts.slice(bi))] : [a, b];
    };
    const half = Math.floor(poly.length / 2);
    return [...dp(poly.slice(0, half + 1)).slice(0, -1), ...dp([...poly.slice(half), poly[0]]).slice(0, -1)];
  }
  // függőlegesen konvex sokszögek uniójának körvonala (forgástest sziluettje)
  function envelope(polys, step = .5){
    const xs = polys.flat().map(p => p[0]), x0 = min(...xs), x1 = max(...xs), N = max(8, Math.ceil((x1 - x0) / step));
    const top = [], bot = [];
    for(let i = 0; i <= N; i++){
      const x = x0 + (x1 - x0) * min(max(i / N, .0005), .9995);
      let lo = Infinity, hi = -Infinity;
      for(const poly of polys) for(let j = 0; j < poly.length; j++){
        const a = poly[j], b = poly[(j + 1) % poly.length];
        if(a[0] !== b[0] && (a[0] - x) * (b[0] - x) <= 0){ const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); lo = min(lo, y); hi = max(hi, y); }
      }
      if(lo < Infinity){ top.push([x, lo]); bot.push([x, hi]); }
    }
    return simplify([...top, ...bot.reverse()], .2);
  }
  // a sziluett közelében lévő pontok behúzása (a tónus-lapok ne takarják le a kontúrt)
  function inset(pts, sil, d = .85){
    const s = Math.sign(area(sil)) || 1, n = sil.length;
    return pts.map(p => {
      let best = null, bd = Infinity;
      for(let i = 0; i < n; i++){
        const a = sil[i], b = sil[(i + 1) % n], ex = b[0] - a[0], ey = b[1] - a[1], L2 = ex * ex + ey * ey;
        if(L2 < 1e-9) continue;
        const t = max(0, min(1, ((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / L2)), qx = a[0] + t * ex, qy = a[1] + t * ey, dd = hypot(p[0] - qx, p[1] - qy);
        if(dd < bd){ bd = dd; best = { qx, qy, ex, ey, L:sqrt(L2) }; }
      }
      if(!best || bd >= d) return p;
      return [best.qx - best.ey / best.L * s * d, best.qy + best.ex / best.L * s * d];
    });
  }
  // konvex vágás (Sutherland–Hodgman)
  function clip(subject, cp){
    const sg = Math.sign(area(cp)), inside = (p, a, b) => sg * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= 0;
    const cut = (p, q, a, b) => { const A1 = q[1] - p[1], B1 = p[0] - q[0], C1 = A1 * p[0] + B1 * p[1], A2 = b[1] - a[1], B2 = a[0] - b[0], C2 = A2 * a[0] + B2 * a[1], d = A1 * B2 - A2 * B1;
      return [(B2 * C1 - B1 * C2) / d, (A1 * C2 - A2 * C1) / d]; };
    let out = subject;
    for(let i = 0; i < cp.length && out.length; i++){
      const a = cp[i], b = cp[(i + 1) % cp.length], inp = out; out = [];
      for(let j = 0; j < inp.length; j++){ const p = inp[(j + inp.length - 1) % inp.length], q = inp[j];
        if(inside(q, a, b)){ if(!inside(p, a, b)) out.push(cut(p, q, a, b)); out.push(q); } else if(inside(p, a, b)) out.push(cut(p, q, a, b)); }
    }
    return out;
  }
  const circ = (cx, cy, r, n = 12, ry = r, a0 = 0) => Array.from({ length:n }, (_, i) => { const a = rad(a0 + 360 * i / n); return [cx + r * Math.cos(a), cy + ry * Math.sin(a)]; });
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  // töröttvonal simítása (másodfokú görbék a felezőpontokon át)
  const smooth = (pts, n = 4) => pts.length < 3 ? pts : pts.slice(0, -2).flatMap((_, i) => {
    const a = i ? lerp(pts[i], pts[i + 1], .5) : pts[0], c = i === pts.length - 3 ? pts[i + 2] : lerp(pts[i + 1], pts[i + 2], .5);
    return Array.from({ length:n + 1 }, (_, j) => { const t = j / n; return lerp(lerp(a, pts[i + 1], t), lerp(pts[i + 1], c, t), t); }).slice(i ? 1 : 0);
  });
  // lekerekített téglalap (u, v síkban) – címkékhez, ablakokhoz; a map vetíti a felületre
  const rrect = (u0, v0, u1, v1, r, map = p => p, n = 3) => [[u1 - r, v0 + r, -90], [u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180]]
    .flatMap(([cu, cv, a0]) => Array.from({ length:n + 1 }, (_, i) => map([cu + r * cos(a0 + 90 * i / n), cv + r * sin(a0 + 90 * i / n)])));
  // 2D elhelyezés: eltolás, forgatás (fok), nagyítás a (0,0) körül
  const place = (pts, dx, dy, deg = 0, k = 1) => pts.map(([x, y]) => [dx + k * (x * cos(deg) - y * sin(deg)), dy + k * (x * sin(deg) + y * cos(deg))]);
  // félsík a p→q iránytól balra (képernyőn) – vágáshoz
  const halfPlane = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = hypot(dx, dy), nx = dy / l * 300, ny = -dx / l * 300, ex = dx / l * 300, ey = dy / l * 300;
    return [[p[0] - ex, p[1] - ey], [p[0] + ex, p[1] + ey], [p[0] + ex + nx, p[1] + ey + ny], [p[0] - ex + nx, p[1] - ey + ny]]; };

  // ---------------- 3D segédek ----------------
  const norm = v => { const l = hypot(...v) || 1; return v.map(x => x / l); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  function cam(o){ const P = camera(Object.assign({ span:80 }, o)), a = rad(o.az || 0), e = rad(o.el || 0);
    P.V = [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)]; return P; }
  const corners = (x0, x1, y0, y1, z0, z1) => { const o = []; for(const x of [x0, x1]) for(const y of [y0, y1]) for(const z of [z0, z1]) o.push([x, y, z]); return o; };
  // doboz látható lapjai (az > 0: eleje és jobb oldala látszik)
  function box(P, x0, x1, y0, y1, z0, z1){
    const c = (x, y, z) => P([x, y, z]);
    return {
      top:[c(x0, y1, z1), c(x1, y1, z1), c(x1, y1, z0), c(x0, y1, z0)],
      front:[c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)],
      right:[c(x1, y0, z1), c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1)],
      sil:hull(corners(x0, x1, y0, y1, z0, z1).map(P)),
    };
  }
  // forgástest: prof = [[r, y], …] alulról; ez = a keresztmetszet mélységi aránya. Szög: 0 = elöl, −90 = bal szél, +90 = jobb szél
  function lathe(P, prof, ez = 1){
    const at = (r, y, a) => P([r * sin(a), y, r * ez * cos(a)]);
    const rAt = y => { for(let i = 1; i < prof.length; i++) if(y <= prof[i][1] || i === prof.length - 1){ const [ra, ya] = prof[i - 1], [rb, yb] = prof[i]; return yb === ya ? rb : ra + (rb - ra) * (y - ya) / (yb - ya); } return prof[0][0]; };
    const ring = (r, y, a0 = 0, a1 = 360, n = 20) => Array.from({ length:n + 1 }, (_, i) => at(r, y, a0 + (a1 - a0) * i / n));
    const full = (r, y, n = 16) => ring(r, y, 0, 360, n).slice(0, n);
    const rings = prof.map(([r, y]) => full(r, y, 24));
    const sil = envelope(rings.slice(1).map((rg, i) => hull([...rings[i], ...rg])));
    const on = (a, y, dr = 0) => at(rAt(y) + dr, y, a);
    const strip = (a0, a1, y0 = prof[0][1], y1 = prof[prof.length - 1][1], n = 5) => {
      const ys = [y0, ...prof.map(p => p[1]).filter(y => y > y0 && y < y1), y1];
      return inset([...ring(rAt(y0), y0, a0, a1, n), ...ys.slice(1, -1).map(y => on(a1, y)), ...ring(rAt(y1), y1, a1, a0, n), ...ys.slice(1, -1).reverse().map(y => on(a0, y))], sil);
    };
    return { at, rAt, ring, full, sil, on, strip };
  }
  // henger tetszőleges tengellyel: at(t, szög, r) a palást pontja (szög 0 = a néző felé)
  function acyl(P, base, dir, r, len, n = 14){
    const d = norm(dir), u = norm(cross(d, [0, 0, 1])), w = cross(u, d);
    const pt = (t, a, rr = r) => P([0, 1, 2].map(k => base[k] + d[k] * t + rr * (Math.cos(rad(a)) * w[k] - Math.sin(rad(a)) * u[k])));
    const ring = (t, rr = r) => Array.from({ length:n }, (_, i) => pt(t, 360 * i / n, rr));
    return { sil:hull([...ring(0), ...ring(len)]), top:ring(len), ring, at:pt };
  }

  // lekerekített sarkú tálca: külső perem fent, szűkebb talp lent (minta: art-huto.js)
  function tray(P, W, D, Hh, ins, rc = 1.6){
    const rr = (w, d, y, r) => [[w / 2 - r, d / 2 - r, 0], [-w / 2 + r, d / 2 - r, 90], [-w / 2 + r, -d / 2 + r, 180], [w / 2 - r, -d / 2 + r, 270]]
      .flatMap(([x, z, a0]) => [0, 45, 90].map(t => [x + r * cos(a0 + t), y, z + r * sin(a0 + t)]));
    const top = rr(W, D, Hh, rc), bot = rr(W - 2 * ins, D - 2 * ins, 0, rc * .8), fl = rr(W - 2 * ins - 1.2, D - 2 * ins - 1.2, Hh * .25, rc * .7), rim = rr(W - 1.6, D - 1.6, Hh, rc * .8);
    const sil = hull([...top, ...bot].map(P)), right = hull([...top, ...bot].filter(p => p[0] > W / 2 - ins - rc - .1 || p[2] > D / 2 - ins - .1 && p[0] > 0).map(P));
    return { sil, right:inset(right, sil), top:top.map(P), rim:rim.map(P), floor:hull([...fl, ...rim.map(([x, , z]) => [x * .96, Hh * .25, z * .96])].map(P)) };
  }

  const LIGHT = norm([-0.5, 0.65, 0.55]);                 // fény: bal-fent-elöl (X jobbra, Y fel, Z a néző felé)
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const toneOf = n => { const s = dot(norm(n), LIGHT); return s > .6 ? 'light' : s > .15 ? 'base' : s > -.52 ? 'dark' : 'line'; };
  // kihúzott profil (x, y sík, z0…z1 mélység): front = elülső lap · tone(t) = az adott tónusú oldallapok · sil = körvonal
  function extrude(P, prof0, z0, z1){
    const prof = area(prof0) > 0 ? prof0 : [...prof0].reverse(), n = prof.length, front = prof.map(([x, y]) => P([x, y, z1])), sides = [];
    for(let i = 0; i < n; i++){ const a = prof[i], b = prof[(i + 1) % n], nn = norm([b[1] - a[1], a[0] - b[0], 0]);
      if(dot(nn, P.V) > .02) sides.push({ pts:[P([a[0], a[1], z1]), P([b[0], b[1], z1]), P([b[0], b[1], z0]), P([a[0], a[1], z0])], tone:toneOf(nn) }); }
    return { front, sides, tone:t => sides.filter(s => s.tone === t).map(s => s.pts), sil:envelope([front, ...sides.map(s => s.pts)], .5) };
  }
  // levél-forma pontjai (tő, irány fokban, hossz, szélesség)
  const leafPts = (x, y, deg, len, wid) => { const dx = cos(deg), dy = sin(deg), h = wid / 2;
    return Array.from({ length:13 }, (_, i) => { const t = i / 6, u = t <= 1 ? t : 2 - t, s = t <= 1 ? 1 : -1;
      return [x + dx * len * u - dy * s * h * Math.sin(Math.PI * u), y + dy * len * u + dx * s * h * Math.sin(Math.PI * u)]; }); };
  const star4 = (cx, cy, R) => Array.from({ length:8 }, (_, i) => { const a = 90 - i * 45, r = i % 2 ? R * .3 : R; return [cx + r * cos(a), cy + r * sin(a)]; });

  // ---------------- alakzat-gyártók ----------------
  const face = (m, tone, pts, o) => Object.assign({ t:'poly', m, tone, pts }, o);                    // fő lap: kontúr + fehér perem
  const det = (m, tone, pts, o) => Object.assign({ t:'poly', m, tone, d:true, line:false, pts }, o);  // tónus-lap / dísz
  const pth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, polys }, o);                 // több részből álló fő lap
  const dpth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, line:false, polys }, o);
  const shine = (pts, o = .6) => det('paper', 'light', pts, { o });
  const lin = (m, tone, pts, w, o) => Object.assign({ t:'line', m, tone, pts, w }, o);               // vékony vonal
  const tube = (pts, w, cap = true) => band(pts, w, cap);                                           // vastag vonal sokszögként

  // ---------------- beillesztés a vászonra ----------------
  // a megdöntött sziluett befoglalóját a perem- és árnyék-tartalékkal a vászonra illeszti (egyenletes nagyítás + eltolás a rajzon)
  function fin(name, meta){
    const t = rad(meta.tilt || 0), c = Math.cos(t), s = Math.sin(t), shapes = meta.shapes.filter(Boolean);
    const ptsOf = sh => sh.pts || (sh.polys ? sh.polys.filter(p => p && p.length > 2).flat() : []);
    const rot = ([x, y]) => [50 + (x - 50) * c - (y - 50) * s, 50 + (x - 50) * s + (y - 50) * c];
    const Q = shapes.filter(sh => !sh.d && sh.t !== 'line').flatMap(sh => ptsOf(sh).map(rot)), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
    const X0 = 4.6, X1 = 95.4, Y0 = 4.6, Y1 = 91.8, g = meta.grow || 1;
    const k = min((X1 - X0) / (max(...xs) - min(...xs)), (Y1 - Y0) / (max(...ys) - min(...ys))) * g;
    const qm = [(max(...xs) + min(...xs)) / 2, (max(...ys) + min(...ys)) / 2], tg = [(X0 + X1) / 2, (Y0 + Y1) / 2];
    const d = [k * (50 - qm[0]) + tg[0] - 50, k * (50 - qm[1]) + tg[1] - 50], dI = [d[0] * c + d[1] * s, -d[0] * s + d[1] * c];
    const T = ([x, y]) => [r1(50 + k * (x - 50) + dI[0]), r1(50 + k * (y - 50) + dI[1])];
    const pathOf = polys => polys.filter(p => p && p.length > 2).map(p => { const q = p.map(T).filter((v, i, a) => !i || v[0] !== a[i - 1][0] || v[1] !== a[i - 1][1]);
      return q.length > 2 ? 'M' + q.map(v => v.join(' ')).join(' ') + 'Z' : ''; }).join('');
    const out = [];
    for(const sh of shapes){
      const o = Object.assign({}, sh);
      if(o.pts && o.t === 'poly'){ o.pts = o.pts.map(T); if(o.pts.length < 3) continue; }
      else if(o.polys){ o.p = pathOf(o.polys); delete o.polys; if(!/\S/.test(o.p)) continue; }
      else if(o.t === 'line'){ o.pts = o.pts.map(T); o.w = r1((o.w || 2) * k); }
      out.push(o);
    }
    delete meta.grow;
    ART.add(name, Object.assign({ emoji:[], shadow:'hard' }, meta, { shapes:out }));
  }


  // ============================================================================================
  //  1. Halrudacska – lapos fagyasztós kartondoboz (19 × 13 × 3,4 cm) hal- és hópehely-képpel,
  //     előtte három panírozott rudacska; az elsőnek harapott vége a fehér halhúst mutatja
  // ============================================================================================
  {
    const TILT = -12, X = 9.5, Z = 6.5, H = 3.4, SW = 1.25, SH = 1.5, SL = 7.6, Z0 = Z + .8;
    const sx = [-2.2, 1.0, 4.2];
    const P = cam({ az:24, el:36, F:160, tilt:TILT, fit:[...corners(-X, X, 0, H, -Z, Z), ...corners(sx[0] - SW, sx[2] + SW, 0, SH, Z0, Z0 + SL)] });
    const b = box(P, -X, X, 0, H, -Z, Z), T = (x, z) => P([x, H, z]), k = P.k;
    const st = sx.map(x => box(P, x - SW, x + SW, 0, SH, Z0, Z0 + SL));
    const fish = [...circ(-1.2, -1.4, 3.6, 14, 1.7), ].map(([x, z]) => T(x, z));
    const tail = [T(2.0, -1.4), T(4.6, -3.0), T(4.0, -1.4), T(4.6, .2)];
    const eye = circ(...T(-3.6, -1.8), .34 * k, 8);
    const flake = [0, 60, 120].map(a => tube([T(-6.4 + 1.5 * cos(a), 3.4 + 1.5 * sin(a)), T(-6.4 - 1.5 * cos(a), 3.4 - 1.5 * sin(a))], .32 * k, true));
    const crumbs = st.flatMap((_, i) => [[-.5, 1.8], [.5, 3.6], [-.3, 5.4], [.4, 6.8]].map(([dx, dz]) => circ(...P([sx[i] + dx, SH, Z0 + dz]), .2 * k, 6)));
    const bite = [P([sx[2] - SW + .25, .25, Z0 + SL]), P([sx[2] + SW - .25, .25, Z0 + SL]), P([sx[2] + SW - .25, SH - .25, Z0 + SL]), P([sx[2] - SW + .25, SH - .25, Z0 + SL])];
    fin('gw_halrudacska', { hu:'Fagyasztott halrudacska', en:'flat blue frozen fish finger box with a fish and snowflake motif, three breaded fish fingers in front', tilt:TILT, shapes:[
      face('blue', 'dark', b.right),                                     // a doboz oldala
      face('blue', 'base', b.front),                                     // a doboz eleje
      face('blue', 'light', b.top),                                      // a doboz teteje
      det('blue', 'line', inset([P([X, 0, -Z]), P([X, 0, -Z + .7]), P([X, H, -Z + .7]), P([X, H, -Z])], b.sil, .35), { o:.45 }),   // legsötétebb élsáv
      dpth('white', 'base', [fish, tail]),                               // hal-kép a tetején
      det('blue', 'dark', eye),
      dpth('white', 'light', flake, { o:.9 }),                           // hópehely: fagyasztott
      dpth('white', 'base', [[P([-X, H * .45, Z]), P([X, H * .45, Z]), P([X, H * .75, Z]), P([-X, H * .75, Z])]], { o:.55 }),   // világos sáv elöl
      pth('orange', 'dark', st.map(s => s.right)),                        // panírozott rudacskák
      pth('orange', 'base', st.map(s => s.front)),
      pth('honey', 'dark', st.map(s => s.top)),
      dpth('orange', 'dark', crumbs, { o:.8 }),                          // panír-morzsák
      det('white', 'base', bite),                                        // harapott vég: fehér halhús
      shine([T(-8.4, -5.4), T(-6.8, -5.4), T(-7.6, 5.4), T(-9.0, 5.4)], .35),
    ] });
  }

  // ============================================================================================
  //  2. Fa kerti pad – 120 cm-es pad léc-üléssel és háttámlával, sötét fém oldalvázzal és karfával
  // ============================================================================================
  {
    const TILT = -10, X = 60, FX = 49, SY = 42, ST = 3.2;
    const P = cam({ az:30, el:20, F:520, tilt:TILT, fit:[...corners(-X, X, 0, 84, -26, 24)] });
    const k = P.k;
    // lejtős hasáb (a háttámla hátradől): z eltolódik y-nal
    const slab = (x0, x1, y0, y1, z0, z1, lean = 0) => {
      const c = (x, y, z) => P([x, y, z + lean * (y - y0)]);
      return { top:[c(x0, y1, z1), c(x1, y1, z1), c(x1, y1, z0), c(x0, y1, z0)], front:[c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)],
        right:[c(x1, y0, z1), c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1)] };
    };
    const seat = [[9, 21], [-6.5, 6.5], [-21, -9]].map(([z0, z1]) => slab(-X, X, SY, SY + ST, z0, z1));
    const back = [[52, 62], [66, 76]].map(([y0, y1]) => slab(-X + 2, X - 2, y0, y1, -22 - .18 * (y0 - SY), -19.5 - .18 * (y0 - SY), -.18));
    const legB = [-FX, FX].map(x => slab(x - 1.8, x + 1.8, 0, 82, -25, -21.5, -.18));
    const legF = [-FX, FX].map(x => slab(x - 1.8, x + 1.8, 0, SY, 16, 19.5));
    const upF = [-FX, FX].map(x => slab(x - 1.6, x + 1.6, SY + ST, 61, 16.2, 19.3));
    const arm = [-FX, FX].map(x => slab(x - 2.4, x + 2.4, 61, 63.5, -24, 22));
    const all = (arr, f) => arr.map(s => s[f]);
    const grain = seat.flatMap((s, i) => [[-44, -20], [6, 34]].map(([a, c]) => tube([P([a + i * 5, SY + ST, [15, 0, -15][i] + .6]), P([c + i * 5, SY + ST, [15, 0, -15][i] - .8])], .4 * k, false)));
    fin('gw_kertipad', { hu:'Fa kerti pad', en:'wooden garden bench with slatted seat and backrest on dark metal side frames with armrests', tilt:TILT, shapes:[
      pth('dark', 'base', [...all(legB, 'front'), ...all(legB, 'right')]),   // hátsó lábak (fém)
      pth('wood', 'base', all(back, 'front')),                           // háttámla-lécek
      dpth('wood', 'dark', all(back, 'right')),
      dpth('wood', 'light', all(back, 'top')),
      pth('dark', 'base', [...all(legF, 'front'), ...all(legF, 'right')]),   // első lábak
      pth('wood', 'base', all(seat, 'front')),                           // ülés-lécek
      pth('wood', 'light', all(seat, 'top')),
      dpth('wood', 'dark', all(seat, 'right')),
      dpth('wood', 'dark', grain, { o:.35 }),                            // faerezet
      pth('dark', 'base', [...all(upF, 'front'), ...all(upF, 'right')]),     // karfatartók
      pth('dark', 'base', [...all(arm, 'front'), ...all(arm, 'right')]),     // karfák
      dpth('dark', 'light', all(arm, 'top')),
      dpth('dark', 'line', [...all(legF, 'right'), ...all(arm, 'right')], { o:.5 }),   // a fém árnyékos oldala
      shine([P([-54, SY + ST, 19]), P([-44, SY + ST, 19]), P([-44, SY + ST, 13]), P([-54, SY + ST, 13])], .45),
    ] });
  }

  // ============================================================================================
  //  3. Vízforraló – kúpos, rozsdamentes kanna (Ø 17 × 23 cm) sötét talppal, fogantyúval és kiöntővel;
  //     elöl kék vízszint-ablak
  // ============================================================================================
  {
    const TILT = 8, EZ = 1, B = 1.8, TOP = 21.4;
    const prof = [[8.1, B], [8.3, 3.2], [7.9, 11], [7.0, 17.5], [6.0, TOP]];
    const P = cam({ az:0, el:17, F:150, tilt:TILT, fit:[...Array.from({ length:12 }, (_, i) => [8.6 * sin(i * 30), 0, 8.6 * cos(i * 30)]),
      [-10.2, 22.6, 0], [13.2, 12, 0], [0, 24.4, 0]] });
    const L = lathe(P, prof, EZ), bs = lathe(P, [[8.5, 0], [8.7, .4], [8.6, B]], EZ), lid = lathe(P, [[6.0, TOP], [5.7, TOP + .8], [3.6, TOP + 1.6], [1.2, TOP + 1.9]], EZ), k = P.k;
    const spout = [L.on(-100, 14.6), P([-10.0, 20.6, 1.2]), P([-10.4, 22.4, 1.2]), P([-8.8, 22.6, 1.2]), L.on(-60, 21.0), L.on(-66, 17.0)];
    const hdl = [[5.6, TOP + .3], [9.6, TOP - .6], [12.2, 18.4], [12.6, 11.6], [11.2, 5.4], [8.4, 4.0]].map(([x, y]) => P([x, y, -.4]));
    const win = [L.on(-38, 4.6), L.on(-24, 4.6), L.on(-24, 16.4), L.on(-38, 16.4)];
    const water = [L.on(-38, 4.6), L.on(-24, 4.6), L.on(-24, 11.4), L.on(-38, 11.4)];
    const marks = [7, 10, 13].map(y => tube([L.on(-37, y), L.on(-33, y)], .28 * k, false));
    fin('gw_vizforralo', { hu:'Vízforraló', en:'conical stainless steel electric kettle with a dark base, handle, spout and a blue water window', tilt:TILT, shapes:[
      pth('dark', 'base', [bs.sil]),                                     // talp (tápegység)
      det('dark', 'line', bs.strip(30, 88, 0, B), { o:.6 }),
      face('steel', 'dark', spout),                                      // kiöntő
      pth('steel', 'base', [L.sil]),                                     // rozsdamentes test
      det('steel', 'light', L.strip(-88, -46, B, TOP)),
      det('steel', 'dark', L.strip(34, 88, B, TOP)),
      det('steel', 'line', L.strip(72, 88, B, TOP), { o:.4 }),           // legsötétebb élsáv
      det('sky', 'base', win, { o:.5 }),                                 // vízszint-ablak
      det('water', 'base', water),                                       // víz az ablakban
      dpth('dark', 'base', marks, { o:.6 }),                             // szintjelek
      face('steel', 'light', lid.sil),                                   // fedél
      face('dark', 'base', lathe(P, [[1.8, TOP + 1.8], [1.6, TOP + 2.6], [.8, TOP + 3.0]], EZ).sil),   // fedélnyitó gomb
      pth('dark', 'base', [tube(hdl, 2.4 * k, true)]),                   // fogantyú
      dpth('dark', 'light', [tube(hdl.slice(1, 5).map(([x, y]) => [x - .5 * k, y]), .6 * k, false)], { o:.7 }),
      face('honey', 'base', circ(...P([11.8, 16.6, 1.0]), .7 * k, 8)),  // kapcsoló
      shine([L.on(-68, 3.4), L.on(-58, 3.4), L.on(-58, 17.4), L.on(-68, 17.4)], .55),
    ] });
  }

  // ============================================================================================
  //  4. Pamut ágynemű – összehajtott, csíkos paplanhuzat, rajta párnahuzat; papírszalag gyapot-képpel
  // ============================================================================================
  {
    const TILT = -12, W = 16, D = 12, T = 7.6, R = 3.0, PW = 12.5, PD = 7.5, PT = 3.8, BX = 2.8, BW = 4.4;
    const P = cam({ az:24, el:21, F:160, tilt:TILT, fit:[...corners(-W, W, 0, T, -D, D), ...corners(-PW, PW, T, T + PT, -PD, PD)] });
    const E = extrude(P, rrect(-W, .1, W, T - .1, R), -D, D), k = P.k;
    // puha párna: lencse-profil (a közepe vastag, a széle összecsípve)
    const lens = [...Array.from({ length:11 }, (_, i) => { const x = -PW + 2 * PW * i / 10; return [x, T + .1 + .5 + (PT - .5) * Math.pow(max(0, 1 - (x / PW) ** 2), .55)]; }), [PW, T + .1], [-PW, T + .1]];
    const Pl = extrude(P, lens, -PD, PD);
    const F = (x, y) => P([x, y, D]);
    const stripes = [-12.5, -8.5, -4.5, -.5, 7.5, 11.5].map(x => [F(x, .7), F(x + 1.6, .7), F(x + 1.6, T - .7), F(x, T - .7)]);
    const topStr = [-12.5, -8.5, 7.5, 11.5].map(x => [P([x, T, D - .6]), P([x + 1.6, T, D - .6]), P([x + 1.6, T, -D + .6]), P([x, T, -D + .6])]);
    const band = [[F(BX, 0), F(BX + BW, 0), F(BX + BW, T), F(BX, T)],
      [P([BX, T, D]), P([BX + BW, T, D]), P([BX + BW, T, PD]), P([BX, T, PD])]];
    const bc = F(BX + BW / 2, T / 2), boll = [[-.75, .3], [.75, .3], [0, -.6]].map(([dx, dy]) => circ(bc[0] + dx * k, bc[1] + dy * k, .85 * k, 9));
    fin('gw_agynemu', { hu:'Pamut ágynemű', en:'folded striped cotton duvet cover with a pillowcase on top, tied with a paper band showing a cotton boll', tilt:TILT, shapes:[
      pth('sky', 'base', [E.sil]),                                       // összehajtott paplanhuzat
      dpth('sky', 'dark', [...E.tone('dark'), ...E.tone('line')]),
      dpth('sky', 'light', E.tone('light')),
      dpth('white', 'base', [...stripes, ...topStr], { o:.85 }),         // csíkminta
      dpth('sky', 'line', [tube([F(-W + R, T * .5), F(W - R, T * .5)], .45 * k, false), tube([P([W, T * .5, D - R]), P([W, T * .5, -D + R])], .45 * k, false)], { o:.5 }),   // a hajtás vonala
      pth('white', 'base', [Pl.sil]),                                    // párnahuzat
      dpth('white', 'dark', [...Pl.tone('dark'), ...Pl.tone('line')]),
      dpth('white', 'light', Pl.tone('light')),
      dpth('sky', 'base', [[-8, -4], [-3, -1], [2, -4.5], [7, -1.5], [-6, 3], [0, 3.5], [5.5, 4]].map(([x, z]) => circ(...P([x, T + PT + .02, z]), .5 * k, 8, .3 * k)), { o:.8 }),   // pöttyös párnahuzat
      dpth('sky', 'base', [tube(lens.slice(0, 11).map(([x, y]) => P([x * .97, y - .3, PD])), .32 * k, false)], { o:.8 }),   // a párna paszpólja
      dpth('leaf', 'base', band),                                        // papírszalag
      dpth('leaf', 'dark', [band[0]], { o:.5 }),
      det('leaf', 'dark', star4(bc[0], bc[1] + .5 * k, 1.9 * k)),            // gyapot-kép a szalagon
      dpth('white', 'light', boll),
      shine([P([-PW + 1.4, T + PT, -PD + 1.2]), P([-PW + 3.6, T + PT, -PD + 1.2]), P([-PW + 3.6, T + PT, PD - 2]), P([-PW + 1.4, T + PT, PD - 2])], .35),
    ] });
  }

  // ============================================================================================
  //  5. Polárpulóver – elölről: felálló gallér félcipzárral, sötét szegélyű kézelő és derékpánt, bolyhos felület
  // ============================================================================================
  {
    const TILT = 8;
    const body = smooth([[40, 21], [28, 24], [19, 31], [13, 53], [9, 77], [21, 79], [24, 57], [29, 44], [30, 64], [31, 85], [69, 85], [70, 64],
      [71, 44], [76, 57], [79, 79], [91, 77], [87, 53], [81, 31], [72, 24], [60, 21]], 3);
    const collar = [[39, 22], [38.5, 11], [49.2, 12.4], [50.8, 12.4], [61.5, 11], [61, 22], [50, 24]];
    const inner = [[40.5, 12.6], [49.2, 13.8], [50.8, 13.8], [59.5, 12.6], [58.5, 15.2], [41.5, 15.2]];
    const cuffs = [[[9, 77], [21, 79], [20.4, 84], [8.4, 82.4]], [[91, 77], [79, 79], [79.6, 84], [91.6, 82.4]]];
    const hem = [[31, 80.4], [69, 80.4], [69.2, 86], [30.8, 86]];
    const fuzz = [[36, 32], [44, 40], [58, 34], [64, 46], [38, 56], [52, 52], [62, 64], [42, 70], [56, 74], [18, 44], [16, 64], [82, 44], [84, 64], [34, 44], [48, 64]]
      .map(([x, y]) => circ(x, y, 1.2, 7));
    fin('gw_polarpulover', { hu:'Polárpulóver', en:'fleece pullover from the front with a stand-up half-zip collar, dark cuffs and hem band, fuzzy texture', tilt:TILT, shapes:[
      face('berry', 'base', body),                                       // polár test
      det('berry', 'light', clip(body, halfPlane([24, 70], [52, 20])), { o:.9 }),   // fény felőli oldal
      det('berry', 'dark', clip(body, halfPlane([78, 60], [60, 20]))),              // árnyékos oldal
      det('berry', 'line', clip(body, halfPlane([80, 64], [72, 24])), { o:.35 }),   // legsötétebb élsáv
      dpth('berry', 'line', [tube([[29, 44], [30, 78]], 1.1, false), tube([[71, 44], [70, 78]], 1.1, false)], { o:.4 }),   // ujja-varrás
      dpth('berry', 'dark', fuzz, { o:.4 }),                             // bolyhos polár
      pth('dark', 'base', [...cuffs, hem]),                              // sötét kézelő és derékpánt
      dpth('dark', 'light', cuffs.map(c => [c[0], c[1], lerp(c[1], c[2], .35), lerp(c[0], c[3], .35)]), { o:.5 }),
      face('berry', 'light', collar),                                    // felálló gallér
      det('berry', 'line', inner, { o:.8 }),                             // a gallér belseje
      lin('dark', 'base', [[50, 13.6], [50, 42]], 1.5),                  // félcipzár
      face('steel', 'light', [[48.6, 41], [51.4, 41], [51.4, 47], [48.6, 47]]),   // cipzárhúzó
      shine([[22, 36], [26, 34], [22, 62], [18, 62]], .4),
    ] });
  }

  // ============================================================================================
  //  6. Hajbalzsam – kupakján álló, lapított tubus (Ø 5,6 × 3 × 18 cm) préselt felső véggel,
  //     a címkén hullámos hajtincs; előtte nekitámasztott fa fésű
  // ============================================================================================
  {
    const TILT = 9, EZ = .5, CAP = 3.2, TOP = 16.8, CR = 18.4;
    const prof = [[1.8, CAP], [2.6, CAP + .9], [2.9, CAP + 2.4], [2.95, 12.0], [3.0, TOP]];
    const capP = [[2.5, 0], [2.6, .3], [2.6, CAP - .2], [2.3, CAP]];
    const P = cam({ az:0, el:15, F:130, tilt:TILT, fit:[...Array.from({ length:12 }, (_, i) => [3.1 * sin(i * 30), 0, 3.1 * EZ * cos(i * 30)]).flatMap(([x, , z]) => [[x, 0, z], [x, CR, z * .1]]),
      [8.4, 0, 3.4], [8.8, 4.2, 3.4]] });
    const L = lathe(P, prof, EZ), C = lathe(P, capP, EZ), k = P.k;
    const crimp = [P([-3.2, TOP - .1, .1]), P([3.2, TOP - .1, .1]), P([3.2, CR, .1]), P([-3.2, CR, .1])];
    const waves = [-.8, .4, 1.6].map(dy => tube(Array.from({ length:7 }, (_, i) => L.on(-44 + i * 14, 9.4 + dy + .45 * Math.sin(i * 1.3 + dy)), ), .36 * k, false));
    // fa fésű: a tubus elé támasztva, a fogain áll
    const cz = 2.6, ca = 14, cb = (u, v) => P([.8 + u * cos(ca) - v * sin(ca), u * sin(ca) + v * cos(ca), cz]);
    const spine = [cb(0, 2.6), cb(8.4, 2.6), cb(8.4, 3.9), cb(.4, 3.9), cb(0, 3.4)];
    const teeth = Array.from({ length:11 }, (_, i) => tube([cb(.5 + i * .74, .25), cb(.5 + i * .74, 2.7)], .38 * k, false));
    fin('gw_hajbalzsam', { hu:'Hajbalzsam', en:'flattened hair conditioner tube standing on its cap with a wavy hair lock motif and a wooden comb leaning in front', tilt:TILT, shapes:[
      pth('purple', 'base', [L.sil]),                                    // lapított tubus
      det('purple', 'light', L.strip(-88, -48, CAP + .6, TOP)),
      det('purple', 'dark', L.strip(34, 88, CAP + .6, TOP)),
      det('purple', 'line', L.strip(70, 88, CAP + .6, TOP), { o:.4 }),   // legsötétebb élsáv
      face('purple', 'dark', crimp),                                     // préselt felső vég
      dpth('purple', 'line', [TOP + .5, TOP + .95, CR - .5].map(y => tube([P([-3.0, y, .12]), P([3.0, y, .12])], .22 * k, false)), { o:.55 }),
      det('cream', 'base', L.strip(-88, 88, 6.8, 13.2, 10)),             // világos címkesáv
      det('cream', 'dark', L.strip(38, 88, 6.8, 13.2)),
      dpth('honey', 'dark', waves),                                      // hullámos hajtincs
      pth('white', 'base', [C.sil]),                                     // pattintós kupak (alul)
      det('white', 'light', C.strip(-88, -46, 0, CAP)),
      det('white', 'dark', C.strip(36, 88, 0, CAP)),
      pth('wood', 'base', teeth),                                        // fésű fogai
      face('wood', 'base', spine),                                       // fésű gerince
      dpth('wood', 'light', [[cb(.5, 3.3), cb(8.0, 3.3), cb(8.0, 3.6), cb(.5, 3.6)]], { o:.8 }),
      shine(L.strip(-70, -60, CAP + 2.4, TOP - .6, 3), .55),
    ] });
  }

  // ============================================================================================
  //  7. Eldobható tányér – négy egymásba rakott, bordás peremű papírtányér (Ø 23 cm), rajta fa villa
  // ============================================================================================
  {
    const TILT = -8, R0 = 8.4, R1 = 10.6, R2 = 11.8, N = 4, DY = .8, BH = 1.1;
    const H = BH + (N - 1) * DY;
    const P = cam({ az:0, el:33, F:220, tilt:TILT, fit:Array.from({ length:16 }, (_, i) => [R2 * sin(i * 22.5), 0, R2 * cos(i * 22.5)]).flatMap(([x, , z]) => [[x, 0, z], [x, H, z]]) });
    const L = lathe(P, [[R0, 0], [R2 - .3, .5], [R2, H - .15], [R2, H]], 1), k = P.k;
    const rim = L.full(R2, H, 28), wall = L.full(R1, H - .05, 28), floor = L.full(R0 - .2, H - BH, 24);
    const edges = Array.from({ length:N - 1 }, (_, i) => tube(L.ring(R2 - .1 * i, H - DY * (i + 1), -92, 92, 16), .26 * k, false));
    const flutes = Array.from({ length:28 }, (_, i) => tube([L.at(R1 + .15, H, i * 360 / 28), L.at(R2 - .15, H, i * 360 / 28)], .22 * k, false));
    // fa villa a felső tányéron (vízszintes lap, y = H − BH + .1)
    const fy = H - BH + .12, fk = (u, v) => P([u * cos(-28) - v * sin(-28) - .6, fy, u * sin(-28) + v * cos(-28) + .4]);
    const fork = [fk(-6.4, -.55), fk(1.2, -.6), fk(2.6, -1.35), fk(6.2, -1.35), fk(6.2, 1.35), fk(2.6, 1.35), fk(1.2, .6), fk(-6.4, .55), fk(-6.8, 0)];
    const tines = [-.45, .45].map(v => tube([fk(3.6, v), fk(6.3, v)], .32 * k, false));
    fin('gw_papirtanyer', { hu:'Eldobható tányér', en:'stack of four paper plates with fluted rims and a wooden disposable fork on top', tilt:TILT, shapes:[
      pth('cream', 'base', [L.sil]),                                 // a tányérok oldala
      det('cream', 'dark', L.strip(30, 88, 0, H)),
      det('cream', 'line', L.strip(70, 88, 0, H), { o:.4 }),         // legsötétebb élsáv
      dpth('cream', 'line', edges, { o:.6 }),                       // az egymásba rakott tányérok peremei
      face('cream', 'light', rim),                                   // a felső tányér pereme
      dpth('cream', 'dark', flutes, { o:.4 }),                       // bordázott perem
      det('cream', 'base', wall),                                    // a tányér belső fala
      det('cream', 'light', floor),                                  // a tányér alja
      face('wood', 'light', fork),                                       // fa villa
      dpth('wood', 'dark', tines, { o:.8 }),
      shine([L.at(R1 + .3, H, -150), L.at(R2 - .2, H, -150), L.at(R2 - .2, H, -118), L.at(R1 + .3, H, -118)], .5),
    ] });
  }

  // ============================================================================================
  //  8. Autógumi – álló személyautó-gumi (Ø 64 × 20 cm) 3/4-es nézetben: mintázott futófelület,
  //     lekerekített váll, üres belső; az oldalfalon üres, színsávos címke
  // ============================================================================================
  {
    const TILT = -10, R = 32, RI = 20, Z = 10, RS = 29.4;
    const P = cam({ az:34, el:14, F:420, tilt:TILT, fit:[...corners(-R, R, 0, 2 * R, -Z, Z)] });
    const k = P.k, C = [0, R];
    const at = (r, th, z) => P([r * cos(th), R + r * sin(th), z]);
    const ring = (r, z, n = 28, a0 = 0, a1 = 360) => Array.from({ length:n + (a1 - a0 < 360 ? 1 : 0) }, (_, i) => at(r, a0 + (a1 - a0) * i / n, z));
    const vis = th => dot([cos(th), sin(th), 0], P.V) > 0;
    const sil = hull([...ring(R, -Z), ...ring(R, Z)]);
    const side = ring(R, Z), shoulder = ring(RS, Z + .4), bead = ring(RI + 1.6, Z + .6), hole = ring(RI, Z + .6);
    const back = ring(RI, -Z + 1);
    // futófelület felső (napos) része
    const topTr = [...Array.from({ length:9 }, (_, i) => at(R, 20 + i * 12.5, Z)), ...Array.from({ length:9 }, (_, i) => at(R, 120 - i * 12.5, -Z))];
    // cikcakk hornyok a látható futófelületen
    const grooves = [];
    for(let th = -70; th <= 160; th += 13) if(vis(th)) grooves.push(tube([at(R + .1, th, Z - 1.5), at(R + .1, th + 4, 0), at(R + .1, th, -Z + 1.5)], .9 * k, false));
    const circ2 = [-Z * .45, Z * .45].map(z => tube(Array.from({ length:17 }, (_, i) => at(R + .1, -60 + i * 13, z)).filter((_, i) => vis(-60 + i * 13)), .7 * k, false));
    const lab = [at(22.4, -58, Z + .7), at(28.4, -58, Z + .7), at(28.4, -30, Z + .7), at(22.4, -30, Z + .7)];
    const lb = (r0, r1, a) => [at(r0, a, Z + .8), at(r1, a, Z + .8), at(r1, a + 3.6, Z + .8), at(r0, a + 3.6, Z + .8)];
    fin('gw_autogumi', { hu:'Autógumi', en:'standing car tyre in three-quarter view with zigzag tread, rounded shoulder and a small blank colour-bar label', tilt:TILT, shapes:[
      pth('dark', 'dark', [sil]),                                        // futófelület (árnyékos)
      det('dark', 'base', clip(hull(topTr), sil)),                       // a napos felső futófelület
      dpth('dark', 'line', [...grooves, ...circ2], { o:.8 }),            // mintázat
      face('dark', 'base', side),                                        // oldalfal
      det('dark', 'light', clip(side, halfPlane(at(R, 200, Z), at(R, 40, Z))), { o:.35 }),   // fény az oldalfalon
      dpth('dark', 'dark', [tube([...shoulder, shoulder[0]], .7 * k, false)], { o:.6 }),   // lekerekített váll
      det('dark', 'line', bead),                                         // perem (sarok)
      det('dark', 'dark', hole),                                         // az üres belső
      det('dark', 'line', clip(back, hole), { o:.9 }),
      det('cream', 'base', lab),                                         // üres gumicímke
      dpth('leaf', 'base', [lb(23.4, 27.4, -55)]),
      dpth('honey', 'base', [lb(23.4, 26.2, -47.5)]),
      dpth('orange', 'base', [lb(23.4, 25.2, -40)]),
      shine([at(RS - 1.2, 120, Z + .5), at(R - .6, 120, Z + .5), at(R - .6, 150, Z + .5), at(RS - 1.2, 150, Z + .5)], .35),
    ] });
  }
})();
