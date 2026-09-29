// ============================================================
//  Matricák — Hűtő-mester bővítés (2026-09-29, Kristóf jóváhagyta): +20 étel (f_ + étel-azonosító), B szint (docs/rajzolas.md).
//  Felső polc: rizs, lazac, tiramisu · alsó polc: pulyka, hamburgerhús, pácolt csirke · fiók: paprika, szőlő, kukorica,
//  spenót, cukkini · ajtó: majonéz, savanyúság, salátaöntet · konyhapolc: liszt, konzerv (a meglévő „konzerv” matrica másolata),
//  sütőtök, batáta, avokádó, görögdinnye.
//  A rajz-segédek az art-huto-kamra.js-ből jönnek (másolat – a matrica-fájlok önállóak, bármilyen sorrendben betölthetők).
//  Render: node tools/art-render.js 2d web/js/art/art-huto-b.js ki.png --skip huto-b
// ============================================================
(function(){
  const { R, rad, band, arc, camera } = ART.geo;
  const { cos, sin, sqrt, hypot, max, min, abs, exp, floor, PI } = Math;
  const norm3 = v => { const l = hypot(...v) || 1; return v.map(x => x / l); };
  const L0 = norm3([-0.52, -0.62, 0.59]);                                   // fény a képernyőn: bal-fent-elöl (y lefelé nő)
  const lightFor = tilt => { const a = rad(-tilt), c = cos(a), s = sin(a); return [L0[0] * c - L0[1] * s, L0[0] * s + L0[1] * c, L0[2]]; };
  const PAD = 0.85;                                                          // a tónus-lapok ennyivel húzódnak be a kontúrtól
  const gauss = (d, w) => exp(-(d / w) * (d / w)), dAng = (a, b) => ((a - b + 540) % 360) - 180;
  const TONE = { light:d => d > 0.72, dark:d => d < 0.25, edge:d => d < -0.25 };

  // ---- 2D segédek ----
  const area = p => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1]; }, 0) / 2;
  const orient = p => (area(p) >= 0 ? p : [...p].reverse());
  // sokszögek → egy útvonal (azonos körüljárással, hogy az átfedések ne lyukadjanak ki; ismétlődő pontok nélkül)
  function pathOf(polys, keepDir){
    return polys.filter(p => p && p.length > 2).map(p => {
      const q = R(keepDir ? p : orient(p)).filter((v, i, a) => !i || v[0] !== a[i - 1][0] || v[1] !== a[i - 1][1]);
      return 'M' + q.map(v => v[0] + ' ' + v[1]).join(' ') + 'Z';
    }).join('');
  }
  const ellipse = (cx, cy, rx, ry, n = 8, rot = 0) => { const a = rad(rot); return Array.from({ length:n }, (_, i) => { const t = 2 * PI * i / n, x = rx * cos(t), y = ry * sin(t); return [cx + x * cos(a) - y * sin(a), cy + x * sin(a) + y * cos(a)]; }); };
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const bez = (p0, p1, p2, n = 8) => Array.from({ length:n + 1 }, (_, i) => { const t = i / n; return lerp(lerp(p0, p1, t), lerp(p1, p2, t), t); });   // másodfokú görbe pontjai
  // levél egyik fele (a középér és az egyik ív között) – a levél kéttónusú hajtásához; side: +1 / −1
  function leafHalf(x, y, deg, len, wid, side){
    const dx = cos(rad(deg)), dy = sin(rad(deg)), h = side * wid / 1.5, P = (t, o) => `${R([[x + dx * len * t - dy * o, y + dy * len * t + dx * o]])[0].join(' ')}`;
    return `M${P(0, 0)} C${P(0.2, h)} ${P(0.7, h)} ${P(1, 0)}Z`;
  }

  // 1D: a [a,b] szakasz azon része, ahol test(f(x)) igaz (egy intervallumot feltételez), felezéssel finomítva
  function interval(f, test, a, b, n = 28){
    const xs = Array.from({ length:n + 1 }, (_, k) => a + (b - a) * k / n), ok = xs.map(x => test(f(x)));
    const first = ok.indexOf(true); if(first < 0) return null;
    const last = ok.lastIndexOf(true);
    const refine = (p, q) => { const v = test(f(p)); for(let i = 0; i < 16; i++){ const m = (p + q) / 2; if(test(f(m)) === v) p = m; else q = m; } return (p + q) / 2; };
    return [first === 0 ? a : refine(xs[first - 1], xs[first]), last === n ? b : refine(xs[last], xs[last + 1])];
  }
  // mintánkénti intervallumokból sokszögek (összefüggő szakaszonként): felső határ előre, alsó vissza
  function regionPolys(ints, pt, cyclic){
    const n = ints.length, out = [];
    if(cyclic && ints.every(Boolean)){
      const idx = ints.map((_, i) => i);
      out.push(idx.every(k => ints[k][0] < 1e-6) ? idx.map(k => pt(k, ints[k][1])) : [...idx.map(k => pt(k, ints[k][1])), ...idx.reverse().map(k => pt(k, ints[k][0]))]);
      return out;
    }
    for(let i = 0; i < n; i++){
      const prev = cyclic ? ints[(i - 1 + n) % n] : (i ? ints[i - 1] : null);
      if(!ints[i] || prev) continue;
      const idx = []; for(let k = i; ints[k]; k = cyclic ? (k + 1) % n : k + 1){ idx.push(k); if(!cyclic && k === n - 1) break; if(idx.length > n) break; }
      out.push([...idx.map(k => pt(k, ints[k][1])), ...idx.slice().reverse().map(k => pt(k, ints[k][0]))]);
    }
    return out;
  }

  // ---- poláris folt: közép, sugarak, forgatás, f(fok) sugár-szorzó; tone() gömbszerű álnormálissal ----
  function Blob(o){
    const a = rad(o.rot || 0), ca = cos(a), sa = sin(a), f = o.f || (() => 1);
    const at = (th, rho = 1) => { const k = f(th) * rho, x = o.rx * k * cos(rad(th)), y = o.ry * k * sin(rad(th)); return [o.cx + x * ca - y * sa, o.cy + x * sa + y * ca]; };
    const sil = (n = 36, off = 0) => R(Array.from({ length:n }, (_, i) => at(off + 360 * i / n)));
    const tone = (L, test, n = 40, pad = PAD) => {
      const ths = Array.from({ length:n }, (_, i) => 360 * i / n);
      const ints = ths.map(th => { const e = at(th), dx = e[0] - o.cx, dy = e[1] - o.cy, Rr = hypot(dx, dy), al = (dx * L[0] + dy * L[1]) / Rr;
        return interval(r => r * al + sqrt(max(0, 1 - r * r)) * L[2], test, 0, max(0, 1 - pad / Rr)); });
      return regionPolys(ints, (k, r) => at(ths[k], r), true);
    };
    return { at, sil, tone, o };
  }
  // ---- cső: gerincvonal + teljes szélesség (szám vagy t→szélesség); tone() hengeres álnormálissal ----
  function Tube(spine, w){
    const n = spine.length, hw = i => (typeof w === 'function' ? w(i / (n - 1)) : w) / 2;
    const N = spine.map((p, i) => { const a = spine[max(0, i - 1)], b = spine[min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
    const at = (i, u) => [spine[i][0] + N[i][0] * u * hw(i), spine[i][1] + N[i][1] * u * hw(i)];
    // dark: csak a fénytől elforduló oldalon keresünk (hosszában futó sáv)
    const tone = (L, test, dark, pad = PAD) => {
      const ints = spine.map((p, i) => { const h = hw(i); if(h <= pad * 1.3) return null;
        const um = 1 - pad / h, al = N[i][0] * L[0] + N[i][1] * L[1], f = u => u * al + sqrt(max(0, 1 - u * u)) * L[2];
        return dark ? interval(f, test, al > 0 ? -um : 0, al > 0 ? 0 : um) : interval(f, test, -um, um); });
      return regionPolys(ints, (k, u) => at(k, u), false);
    };
    return { at, sil:(cap = true) => band(spine, w, cap), tone, N, hw, n };
  }
  const smooth = (pts, n = 6) => pts.length < 3 ? pts : pts.slice(0, -2).flatMap((_, i) => {   // töröttvonal simítása (másodfokú görbék a felezőpontokon át)
    const a = i ? lerp(pts[i], pts[i + 1], 0.5) : pts[0], c = i === pts.length - 3 ? pts[i + 2] : lerp(pts[i + 1], pts[i + 2], 0.5);
    return bez(a, pts[i + 1], c, n).slice(i ? 1 : 0);
  });


  // vízszintes metszet: a sokszög bal és jobb széle y magasságban (hagyma-, fokhagyma-„délkörökhöz”)
  function spanAt(poly, y){
    let xl = 1e9, xr = -1e9;
    for(let i = 0; i < poly.length; i++){ const a = poly[i], b = poly[(i + 1) % poly.length];
      if((a[1] - y) * (b[1] - y) <= 0 && a[1] !== b[1]){ const x = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); xl = min(xl, x); xr = max(xr, x); } }
    return [xl, xr];
  }
  // délkör-sáv: k1…k2 (−1 bal szél … +1 jobb szél) között, y0…y1 magasságban
  function meridian(poly, k1, k2, y0, y1, n = 9, pad = PAD){
    const ys = Array.from({ length:n + 1 }, (_, i) => y0 + (y1 - y0) * i / n), P = (y, k) => { const [xl, xr] = spanAt(poly, y), m = (xl + xr) / 2, h = max(0, (xr - xl) / 2 - pad); return [m + k * h, y]; };
    return [...ys.map(y => P(y, k1)), ...ys.slice().reverse().map(y => P(y, k2))];
  }
  const meridianLine = (poly, k, y0, y1, w, n = 9) => { const ys = Array.from({ length:n + 1 }, (_, i) => y0 + (y1 - y0) * i / n);
    return band(ys.map(y => { const [xl, xr] = spanAt(poly, y); return [(xl + xr) / 2 + k * ((xr - xl) / 2 - 1.2), y]; }), t => w * sin(PI * (0.04 + 0.92 * t)), false); };
  // csepp-forma felső fele (hagyma, fokhagyma): szuperellipszis a csúcs felé
  const dropTop = (th, tip, p) => { const s = sin(rad(th)), c = abs(cos(rad(th))); return (c ** p + (abs(s) / tip) ** p) ** (-1 / p); };

  // gyökérszakáll: cikkcakkos rojt egy sokszögben (x, y: a tő közepe; w: fél-szélesség; n: szálak)
  const fringe = (x, y, w, n) => { const out = [[x - w * 0.7, y], [x + w * 0.7, y]];
    for(let i = n; i >= 0; i--){ const u = -1 + 2 * i / n; out.push([x + u * w * 1.15, y + 6.5 - abs(u) * 1.5]); if(i) out.push([x + (u - 1 / n) * w * 0.8, y + 2.6]); }
    return out; };

  // ---- vetített forgástest (üveg, palack, kupak): rings = [[r, y], …] alulról (cm); P = ART.geo.camera(…) ----
  //   th fokban: 0 = szemből, −90 = bal szél, +90 = jobb szél
  function Lathe(P, rings){
    const n = rings.length, k = P.k, ring = (r, y, th) => P([r * sin(rad(th)), y, r * cos(rad(th))]);
    const at = (i, th, pad = 0) => ring(max(0, rings[i][0] - pad / k), rings[i][1], th);
    const sil = (m = 10) => [...rings.map((_, i) => at(i, -90)), ...Array.from({ length:m - 1 }, (_, j) => at(n - 1, -90 - 180 * (j + 1) / m)),
      ...rings.map((_, i) => at(n - 1 - i, 90)), ...Array.from({ length:m - 1 }, (_, j) => at(0, 90 - 180 * (j + 1) / m))];
    // függőleges tónus-sáv th0…th1 között, az i0…i1 gyűrűk mentén (a kontúrtól behúzva)
    const strip = (th0, th1, i0 = 0, i1 = n - 1, pad = PAD, m = 5) => {
      const arcAt = (i, a, b) => Array.from({ length:m + 1 }, (_, j) => at(i, a + (b - a) * j / m, pad));
      const ids = Array.from({ length:i1 - i0 + 1 }, (_, j) => i0 + j);
      return [...ids.map(i => at(i, th0, pad)), ...arcAt(i1, th0, th1), ...ids.slice().reverse().map(i => at(i, th1, pad)), ...arcAt(i0, th1, th0)];
    };
    const top = (i = n - 1, m = 16, pad = 0) => Array.from({ length:m }, (_, j) => at(i, 360 * j / m, pad));   // felső ellipszis
    return { at, sil, strip, top, ring, k };
  }
  function hull(pts){
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
    for(const q of p){ while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for(const q of p.reverse()){ while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }

  // ---- alakzat-gyártók ----
  const body = (m, tone, pts, x) => Object.assign({ t:'poly', m, tone, pts:R(pts) }, x);                        // peremet kapó test
  const bodyP = (m, tone, polys, x) => Object.assign({ t:'path', m, tone, p:pathOf(polys) }, x);                 // több részből álló test
  const fill = (m, tone, polys, x) => Object.assign({ t:'path', m, tone, line:false, d:true, p:pathOf(polys) }, x);   // tónus-lap / dísz
  const shine = (polys, o = 0.7) => fill('paper', 'light', polys, { o });
  const dots = (list, r = 0.8) => list.map(([x, y, rr]) => ellipse(x, y, rr || r, (rr || r) * 0.8, 6));

  // ---- beillesztés: középre tolás (a megdöntött befoglaló alapján) + kicsinyítés, hogy a döntve is 8–92-be férjen ----
  const ptsOf = s => s.pts ? s.pts : s.t === 'path' ? (s.p.match(/-?\d*\.?\d+/g) || []).map(Number).reduce((o, v, i, a) => (i % 2 ? o : o.concat([[v, a[i + 1]]])), [])
    : s.t === 'circle' ? arc(s.cx, s.cy, s.r, 0, 360, 16) : s.t === 'ellipse' ? ellipse(s.cx, s.cy, s.rx, s.ry, 16) : s.t === 'rect' ? [[s.x, s.y], [s.x + s.w, s.y + s.h]] : [];
  function shift(s, dx, dy){
    const mv = p => [Math.round((p[0] + dx) * 10) / 10, Math.round((p[1] + dy) * 10) / 10];
    if(s.pts) s.pts = s.pts.map(mv);
    else if(s.t === 'path'){ let i = 0; s.p = s.p.replace(/-?\d*\.?\d+/g, v => { const r = Math.round((Number(v) + (i++ % 2 ? dy : dx)) * 10) / 10; return String(r); }); }
    else if(s.cx != null){ s.cx = Math.round((s.cx + dx) * 10) / 10; s.cy = Math.round((s.cy + dy) * 10) / 10; }
    else if(s.x != null){ s.x = Math.round((s.x + dx) * 10) / 10; s.y = Math.round((s.y + dy) * 10) / 10; }
  }
  function add(name, meta){
    const t = rad(meta.tilt || 0), c = cos(t), s = sin(t), sil = meta.shapes.filter(sh => !(sh.d || sh.t === 'shine'));
    const rot = ([x, y]) => [(x - 50) * c - (y - 50) * s, (x - 50) * s + (y - 50) * c];
    let U = sil.flatMap(sh => ptsOf(sh).map(rot)), us = U.map(u => u[0]), vs = U.map(u => u[1]);
    const mu = (max(...us) + min(...us)) / 2, mv = (max(...vs) + min(...vs)) / 2;
    const dx = -(mu * c + mv * s), dy = -(-mu * s + mv * c);                  // a megdöntött középpont visszaforgatva
    if(meta.center !== false) for(const sh of meta.shapes) shift(sh, dx, dy);
    U = sil.flatMap(sh => ptsOf(sh).map(rot)); let dev = max(...U.map(u => max(abs(u[0]), abs(u[1]))));
    let bx = [1e9, 1e9, -1e9, -1e9];
    for(const sh of sil){ const p = sh.t === 'line' ? (sh.w || 2) / 2 : 0, b = sh.t === 'line' ? (q => [min(...q.map(v => v[0])), min(...q.map(v => v[1])), max(...q.map(v => v[0])) - min(...q.map(v => v[0])), max(...q.map(v => v[1])) - min(...q.map(v => v[1]))])(sh.pts) : ART.bbox(sh); bx = [min(bx[0], b[0] - p), min(bx[1], b[1] - p), max(bx[2], b[0] + b[2] + p), max(bx[3], b[1] + b[3] + p)]; }
    // (a vonal befoglalóját a pontjaiból számoljuk – az ART.bbox a 'line' típust nem ismeri)
    const k = min(1, 42 / dev, 46 / max(50 - bx[0], bx[2] - 50, 50 - bx[1]), 42.5 / (bx[3] - 50));
    delete meta.center;
    meta.shapes = meta.shapes.filter(sh => sh.t !== 'path' || /\S/.test(sh.p));   // üres (láthatatlan) útvonal ne kerüljön be
    ART.add(name, Object.assign({ emoji:[], shadow:'hard' }, meta, { scale:floor(k * 100) / 100 }));
  }

  // ---- doboz lapjai a vetítésben (P = camera): teteje, eleje (+Z), jobb oldala (+X), körvonala ----
  function box(P, x0, x1, y0, y1, z0, z1){
    const c = (x, y, z) => P([x, y, z]), all = [];
    for(const x of [x0, x1]) for(const y of [y0, y1]) for(const z of [z0, z1]) all.push(c(x, y, z));
    return { top:[c(x0, y1, z1), c(x1, y1, z1), c(x1, y1, z0), c(x0, y1, z0)], front:[c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)],
      right:[c(x1, y0, z1), c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1)], sil:hull(all) };
  }

  // ======================================================================
  //  PAPRIKA – piros, szögletes-harangos kaliforniai paprika: széles váll, alul három karéj, a karéjok közt hosszanti
  //  barázdák, felül besüppedő váll zöld csészelevéllel és vastag, hajlott szárral; erős, fényes csillanás
  // ======================================================================
  {
    const TILT = -8, L = lightFor(TILT);
    const sq = th => { const c = abs(cos(rad(th))), s = abs(sin(rad(th))); return (c ** 2.6 + s ** 2.6) ** (-1 / 2.6); };
    const B = Blob({ cx:50, cy:58, rx:30, ry:31, f:th => { const s = sin(rad(th));
      let k = sq(th) * (1 - 0.1 * max(0, s) * abs(cos(rad(th))));                                           // alul kissé keskenyedik
      if(s < 0) k *= 1 - 0.12 * gauss(dAng(th, -90), 20);                                                      // besüppedő váll
      else k *= 1 - 0.08 * gauss(dAng(th, 64), 6) - 0.08 * gauss(dAng(th, 116), 6);                            // karéjok közti barázda
      return k; } });
    const sil = B.sil(64, 90), top = 58 - 31 * 0.88, bot = 58 + 31;
    const calyx = Array.from({ length:12 }, (_, i) => { const a = rad(i * 30), r = i % 2 ? 6 : 10.5; return [50 + r * cos(a), top + 2.2 + r * 0.38 * sin(a)]; });
    const stem = Tube([[50, top + 2], [50.6, top - 4], [54, top - 10], [58, top - 12]], t => 6.2 - 2 * t);
    add('f_paprika', { hu:'Paprika', en:'glossy red bell pepper with a thick green stem', tilt:TILT, shapes:[
      body('red', 'base', sil),
      fill('red', 'light', B.tone(L, TONE.light)),
      fill('red', 'dark', B.tone(L, TONE.dark)),
      fill('berry', 'base', B.tone(L, TONE.edge), { o:0.4 }),
      fill('red', 'dark', [-0.36, 0.34].map(k => meridianLine(sil, k, top + 7, bot - 2, 3, 10)), { o:0.85 }),   // barázdák
      fill('red', 'dark', [ellipse(50, top + 3.4, 14, 4.2, 14)], { o:0.8 }),                                     // besüppedő váll
      body('leaf', 'base', calyx),                                                                              // csészelevél
      fill('leaf', 'light', [calyx.slice(5, 11).concat([[50, top + 2.2]])]),
      body('leaf', 'base', stem.sil()),                                                                         // szár
      fill('leaf', 'dark', stem.tone(L, TONE.dark, true)),
      fill('grass', 'light', [ellipse(58.4, top - 12, 1.8, 2.4, 8, 30)]),                                        // vágott szár-vég
      shine([band([B.at(-150, 0.7), B.at(-165, 0.72), B.at(180, 0.72), B.at(160, 0.66)], t => 0.6 + 2.6 * sin(PI * t), false), ellipse(...B.at(-122, 0.78), 2, 1.3, 6, -30)], 0.85),
    ]});
  }

  // ======================================================================
  //  SZŐLŐ – lefelé keskenyedő fürt lila szemekből (két rétegben, szemenként fény és árnyék), barna kocsány,
  //  hátul karéjos szőlőlevél – a kerek szemek fürtje különbözteti meg a bogyós gyümölcsöktől
  // ======================================================================
  {
    const TILT = 10, L = lightFor(TILT), D = 12.6, r = 6.9;
    const widths = [4, 3, 3, 2, 2, 1], jit = [[0.4, -0.3], [-0.5, 0.4], [0.3, 0.5], [-0.2, -0.4], [0.5, 0.2], [-0.4, 0.3]];
    const grapes = [];
    widths.forEach((w, row) => { for(let i = 0; i < w; i++){ const j = jit[(i + row) % 6];
      grapes.push({ row, B:Blob({ cx:50 + (i - (w - 1) / 2) * D + j[0], cy:36 + row * 10.6 + j[1], rx:r, ry:r * 1.08, rot:10 }) }); } });
    const layer = odd => grapes.filter(g => g.row % 2 === (odd ? 1 : 0));
    const grapeShapes = odd => { const G = layer(odd); return [
      bodyP('berry', 'base', G.map(g => g.B.sil(10))),                                                    // szem: árnyékos perem
      fill('purple', 'dark', G.map(g => ellipse(...g.B.at(-135, 0.16), r * 0.84, r * 0.9, 9))),            // alap
      fill('purple', 'base', G.map(g => ellipse(...g.B.at(-135, 0.42), r * 0.42, r * 0.38, 6, -40))),       // fény felőli folt
    ]; };
    const Lf = Blob({ cx:70, cy:26, rx:17, ry:13, rot:-18, f:th => 1 + 0.2 * cos(rad(5 * (th + 90))) - 0.35 * gauss(dAng(th, 130), 12) });
    add('f_szolo', { hu:'Szőlő', en:'bunch of purple grapes with a vine leaf', tilt:TILT, shapes:[
      body('leaf', 'base', Lf.sil(30)),                                                                     // szőlőlevél
      fill('leaf', 'light', Lf.tone(L, d => d > 0.6, 24)),
      fill('leaf', 'dark', [-60, -10, 40].map(a => band([Lf.at(130, 0.25), Lf.at(a, 0.8)], t => 1.4 * (1 - t) + 0.3, false))),
      ...grapeShapes(false),
      ...grapeShapes(true),
      body('wood', 'base', band([[50, 32], [50.5, 24], [47.5, 15], [44, 11]], t => 3.6 - 1.2 * t)),          // kocsány
      shine(grapes.map(g => ellipse(...g.B.at(-140, 0.52), 1.6, 1.05, 4, -40)), 0.85),
    ]});
  }

  // ======================================================================
  //  CSEMEGEKUKORICA – csöves kukorica: aranysárga szemek sorokban (a henger mentén rövidülve), lekerekített csúcs,
  //  a tövénél hátrahajtott zöld csuhélevelek és rövid szár
  // ======================================================================
  {
    const TILT = -6, L = lightFor(TILT), N = 12;
    const spine = Array.from({ length:N }, (_, i) => { const t = i / (N - 1); return [26 + 52 * t, 76 - 50 * t]; });
    const C = Tube(spine, t => 27 - 9 * t * t);
    const kern = [];
    for(let i = 1; i < N - 1; i++) for(const u of [-0.78, -0.47, -0.16, 0.15, 0.46, 0.77]){ const p = C.at(i, u + (i % 2 ? 0.08 : -0.08)), fz = sqrt(max(0.1, 1 - u * u)), a = Math.atan2(spine[1][1] - spine[0][1], spine[1][0] - spine[0][0]) * 180 / PI;
      kern.push(ellipse(p[0], p[1], 2.1, C.hw(i) * 0.14 * fz + 0.35, 6, a)); }
    const husk = (p0, c, p1, w) => { const sp = bez(p0, c, p1, 10); return band(sp, t => w * sin(PI * min(1, 0.12 + t * 0.95)) ** 0.8 + 0.3, false); };
    const hB = husk([30, 74], [12, 62], [4, 48], 11), hF = husk([30, 76], [42, 92], [64, 90], 11), hL = husk([28, 76], [18, 88], [6, 88], 8);
    add('f_kukorica', { hu:'Csemegekukorica', en:'ear of sweet corn with yellow kernels and peeled-back green husks', tilt:TILT, shapes:[
      body('grass', 'dark', hB),                                                                            // hátsó csuhé
      body('gold', 'base', C.sil()),
      fill('honey', 'base', C.tone(L, d => d > 0.45)),
      fill('gold', 'dark', C.tone(L, TONE.dark, true)),
      fill('honey', 'light', kern, { o:0.95 }),                                                             // szemek
      fill('gold', 'line', C.tone(L, TONE.edge, true), { o:0.35 }),
      body('grass', 'base', hL),                                                                            // csuhé elöl
      body('grass', 'light', hF),
      fill('grass', 'base', [band(bez([30, 76], [42, 88], [62, 89], 8), t => 1.4 * sin(PI * t), false)], { o:0.8 }),
      body('leaf', 'base', band([[27, 79], [22, 84]], 6)),                                                  // szár-csonk
      shine([band([C.at(3, -0.55), C.at(6, -0.6), C.at(9, -0.5)], t => 0.6 + 2.2 * sin(PI * t), false)], 0.6),
    ]});
  }

  // ======================================================================
  //  SPENÓT – csokor sima, sötétzöld, kanál-formájú levél hosszú, világos levélnyéllel; a levelek a középérnél
  //  „hajlanak” (világos és sötét fél) – a salátától a különálló, hosszú nyelű levelek különböztetik meg
  // ======================================================================
  {
    const TILT = 8, L = lightFor(TILT), base = [50, 94];
    // kanál-levél: a nyél végétől az irány (deg) mentén, nyél-hossz, levél-hossz, szélesség
    const spoon = (deg, stemL, len, wid, bend = 0) => { const d = [cos(rad(deg)), sin(rad(deg))], n = [-d[1], d[0]], s0 = [base[0] + d[0] * stemL, base[1] + d[1] * stemL];
      const at = (t, u) => [s0[0] + d[0] * len * t + n[0] * (u + bend * t * t), s0[1] + d[1] * len * t + n[1] * (u + bend * t * t)];
      const w = t => wid * sin(PI * t ** 0.7) ** 0.75, M = 10, ts = Array.from({ length:M + 1 }, (_, i) => i / M);
      return { poly:[...ts.map(t => at(t, w(t))), ...ts.slice(1, -1).reverse().map(t => at(t, -w(t)))], half:[...ts.map(t => at(t, w(t))), ...ts.slice(1, -1).reverse().map(t => at(t, 0))],
        stem:band([[base[0] + d[0] * 2, base[1] + d[1] * 2], lerp(base, s0, 0.5), at(0.08, 0)], 3, false), vein:band([s0, at(0.5, 0), at(0.88, 0)], t => 1.6 * (1 - t) + 0.3, false),
        side:[0.3, 0.55].flatMap(t => [band([at(t, 0), at(t + 0.16, wid * 0.55)], 0.8, false), band([at(t, 0), at(t + 0.16, -wid * 0.55)], 0.8, false)]) }; };
    const back = [spoon(-124, 22, 34, 12, 3), spoon(-56, 22, 34, 12, -3)], front = [spoon(-108, 16, 38, 13.5, 2), spoon(-74, 18, 36, 13, -2)];
    add('f_spenot', { hu:'Spenót', en:'bunch of dark green spinach leaves with long stems', tilt:TILT, shapes:[
      bodyP('grass', 'base', [...back, ...front].map(l => l.stem)),                                        // levélnyelek
      bodyP('leaf', 'dark', back.map(l => l.poly)),
      fill('leaf', 'base', back.map(l => l.half)),
      bodyP('leaf', 'base', front.map(l => l.poly)),
      fill('leaf', 'light', front.map(l => l.half)),
      fill('leaf', 'line', front.map(l => l.poly.slice(12).concat([l.poly[0]])), { o:0.3 }),                // árnyékos szél
      fill('grass', 'light', [...back, ...front].map(l => l.vein)),                                          // középér
      fill('grass', 'base', front.flatMap(l => l.side), { o:0.85 }),                                         // oldalerek
      body('red', 'base', band([[44.5, 85], [55.5, 85]], 4)),                                               // gumi a csokron
      shine([band(front[0].half.slice(3, 7).map(p => [p[0] + 1.6, p[1] + 1.2]), t => 0.4 + 1.4 * sin(PI * t), false)], 0.6),
    ]});
  }

  // ======================================================================
  //  CUKKINI – hosszú, sötétzöld, bunkós henger (a virág felőli vége vastagabb), apró világos pöttyökből álló
  //  hosszanti csíkok, vaskos ötszögletű szár; sima héj és sötét szín – ettől nem uborka
  // ======================================================================
  {
    const TILT = 18, L = lightFor(TILT), N = 10;
    const spine = Array.from({ length:N }, (_, i) => { const t = i / (N - 1); return [14 + 70 * t, 56 - 5 * sin(PI * t)]; });
    const Z = Tube(spine, t => 17 + 7 * t);
    const speck = [-0.5, -0.05, 0.4].flatMap(u => Array.from({ length:N - 3 }, (_, i) => Z.at(i + 1, u + ((i % 2) - 0.5) * 0.12)));
    const stripe = u => band(Array.from({ length:N - 2 }, (_, i) => Z.at(i + 1, u)), t => 2.4 * sin(PI * t), false);
    const e0 = spine[0], stem = [[e0[0] + 2, e0[1] - 5], [e0[0] - 6, e0[1] - 4.2], [e0[0] - 9, e0[1] - 5.5], [e0[0] - 9, e0[1] + 4.5], [e0[0] - 6, e0[1] + 3.2], [e0[0] + 2, e0[1] + 4.5]];
    add('f_cukkini', { hu:'Cukkini', en:'dark green zucchini with pale speckles and a thick stem', tilt:TILT, shapes:[
      body('leaf', 'dark', Z.sil()),
      fill('leaf', 'base', Z.tone(L, d => d > 0.62)),
      fill('leaf', 'line', Z.tone(L, TONE.dark, true), { o:0.7 }),
      fill('grass', 'base', [stripe(-0.3), stripe(0.2)], { o:0.45 }),                                         // világosabb csíkok
      fill('grass', 'light', dots(speck, 0.7), { o:0.9 }),                                                   // pöttyök
      body('grass', 'base', stem),                                                                           // vaskos szár
      fill('grass', 'dark', [stem.slice(3).concat([[e0[0] + 2, e0[1]]])]),
      fill('sage', 'light', [ellipse(e0[0] - 9, e0[1] - 0.5, 1.4, 4.6, 8)]),                                  // vágott szár-vég
      body('cardboard', 'dark', ellipse(spine[N - 1][0] + 11, spine[N - 1][1] + 0.5, 2.2, 3.2, 8)),        // virág-helye a végén
      shine([band([Z.at(2, -0.6), Z.at(4, -0.66), Z.at(7, -0.6)], t => 0.6 + 2.2 * sin(PI * t), false)], 0.55),
    ]});
  }

  // ======================================================================
  //  LISZT – papírzacskó (valódi méretből vetítve): krémfehér papír, felül lehajtott, gyűrt perem, elöl búzakalász-kép
  //  és méz-sárga sáv, a tövénél kis kiszóródott lisztkupac
  // ======================================================================
  {
    const TILT = -12, X = 5.5, Z = 3.2, H = 17, FT = 2.4;
    const fit = []; for(const x of [-X - 0.3, X + 0.3]) for(const y of [0, H + FT]) for(const z of [-Z - 0.3, Z + 0.3]) fit.push([x, y, z]);
    fit.push([X + 4, 0, Z + 3.5]);
    const P = camera({ az:30, el:22, F:80, tilt:TILT, span:80, fit });
    const b = box(P, -X, X, 0, H, -Z, Z), f = box(P, -X - 0.3, X + 0.3, H, H + FT, -Z - 0.3, Z + 0.3);
    const F = ([u, v], dz = 0.02) => P([u, v, Z + dz]);
    const bandF = [F([-X, 1.4]), F([X, 1.4]), F([X, 4.4]), F([-X, 4.4])], bandS = [[X, 1.4, Z], [X, 1.4, -Z], [X, 4.4, -Z], [X, 4.4, Z]].map(P);
    const ear = [0, 1, 2, 3, 4].flatMap(i => [-1, 1].map(s => ellipse(...F([s * 1.05, 7.6 + i * 1.5]), 0.95 * P.k, 0.62 * P.k, 7, s * 35 - 90 + s * 90)));
    const PC = [X + 1.2, 0, Z + 2.6], pile = hull([...ellipse(...P(PC), 10.5, 3.4, 14), P([PC[0], 3, PC[2]]), P([PC[0] - 2, 2.2, PC[2]]), P([PC[0] + 2.2, 2, PC[2]])]);
    add('f_liszt', { hu:'Liszt', en:'paper bag of flour with a folded top and a wheat-ear picture', tilt:TILT, center:true, shapes:[
      body('paper', 'dark', b.right),                                                                     // oldala
      body('paper', 'base', b.front),                                                                     // eleje
      fill('honey', 'base', [bandF]),                                                                     // sáv elöl
      fill('gold', 'base', [bandS]),                                                                      // sáv oldalt
      fill('wood', 'base', [band([F([0, 6.2]), F([0, 14.6])], 0.9 * P.k * 0.5 + 0.6, false)]),           // kalász szára
      fill('gold', 'base', ear),                                                                          // kalász szemei
      fill('gold', 'dark', [band([F([0, 14.2]), F([0.2, 16.2])], 0.7, false), band([F([-0.6, 14]), F([-1.4, 15.8])], 0.6, false), band([F([0.6, 14]), F([1.5, 15.7])], 0.6, false)]),   // szálka
      body('paper', 'dark', f.right),                                                                     // lehajtott perem
      body('paper', 'light', f.front),
      body('paper', 'light', f.top),
      fill('paper', 'line', [[F([-X, H + 0.9], 0.32), F([X, H + 1.1], 0.32), F([X, H + 1.5], 0.32), F([-X, H + 1.3], 0.32)]], { o:0.35 }),   // hajtás-él
      body('white', 'light', pile),                                                                       // kiszóródott liszt
      fill('white', 'dark', [ellipse(...P([PC[0] + 1.6, 0.5, PC[2]]), 6, 1.6, 10)], { o:0.8 }),
      shine([[F([-X + 0.8, 5.2]), F([-X + 1.6, 5.2]), F([-X + 1.6, H - 0.8]), F([-X + 0.8, H - 0.8])]], 0.7),
    ]});
  }

  // ======================================================================
  //  KONZERV – bontatlan konzervdoboz: a meglévő „konzerv” matrica (art-food.js, B szint) másolata az étel nevével
  // ======================================================================
  if(ART.LIB.konzerv) ART.add('f_konzerv', Object.assign(JSON.parse(JSON.stringify(ART.LIB.konzerv)), { name:'f_konzerv', emoji:[], hu:'Bontatlan konzerv', en:'unopened tin can of food with a plain label', lib:undefined }));

  // ======================================================================
  //  SÜTŐTÖK (hokkaido) – lapított, mélyen bordázott narancs tök: a bordák a tető mélyedéséből futnak le, vaskos,
  //  rostos, zöldesbarna kocsány; bordák + kocsány – ettől nem narancs és nem paprika
  // ======================================================================
  {
    const TILT = -8, L = lightFor(TILT);
    const B = Blob({ cx:50, cy:58, rx:38, ry:28, f:th => { const s = sin(rad(th)); return 1 - (s < 0 ? 0.14 * gauss(dAng(th, -90), 26) : 0.05 * gauss(dAng(th, 90), 30)) + 0.018 * cos(rad(8 * th)); } });
    const sil = B.sil(64, 90), top = 58 - 28 * 0.86, bot = 58 + 28 * 0.95;
    const stem = [[46.5, top + 3], [45.5, top - 7], [44, top - 10], [52.5, top - 12], [53.5, top - 7], [54.5, top + 3]];
    add('f_sutotok', { hu:'Sütőtök', en:'ribbed orange hokkaido pumpkin with a thick stem', tilt:TILT, shapes:[
      body('orange', 'base', sil),
      fill('orange', 'light', B.tone(L, d => d > 0.66)),
      fill('orange', 'dark', B.tone(L, TONE.dark)),
      fill('ember', 'dark', B.tone(L, TONE.edge), { o:0.4 }),
      fill('ember', 'base', [-0.84, -0.5, -0.17, 0.17, 0.5, 0.84].map(k => meridianLine(sil, k, top + 4, bot - 3, 2.6, 10)), { o:0.7 }),   // bordák
      fill('ember', 'dark', [ellipse(50, top + 3.2, 13, 3.6, 14)], { o:0.7 }),                                // tető-mélyedés
      body('grass', 'dark', stem),                                                                            // kocsány
      fill('wood', 'base', [stem.slice(3).concat([[50, top + 3]])]),
      fill('cardboard', 'light', [ellipse(48.3, top - 11, 3.8, 1.6, 8, -12)]),                                // vágott kocsány-vég
      fill('grass', 'base', [band([[48, top + 2], [47.6, top - 8]], 0.8, false), band([[51, top + 2], [50.8, top - 9]], 0.8, false)], { o:0.8 }),   // rostok
      shine([band([B.at(-160, 0.62), B.at(-176, 0.66), B.at(168, 0.62)], t => 0.6 + 2.4 * sin(PI * t), false), ellipse(...B.at(-128, 0.72), 2.2, 1.3, 6, -20)], 0.75),
    ]});
  }

  // ======================================================================
  //  ÉDESBURGONYA (batáta) – két orsó alakú, hegyes végű gumó vörösesrózsaszín héjjal és hosszanti ráncokkal;
  //  az elülső kettévágva: narancssárga hús – az orsó forma és a narancs bél különbözteti meg a burgonyától
  // ======================================================================
  {
    const TILT = -10, L = lightFor(TILT), N = 9;
    const spindle = (a, b, bend, W) => { const sp = Array.from({ length:N }, (_, i) => { const t = i / (N - 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - bend * sin(PI * t)]; });
      return { sp, T:Tube(sp, t => W * sin(PI * (0.04 + 0.92 * t)) ** 0.7 + 1.2) }; };
    const A = spindle([12, 42], [88, 34], 5, 25);
    const Bs = Array.from({ length:6 }, (_, i) => { const t = i / 5; return [22 + 34 * t, 68 - 3 * sin(PI * t)]; });
    const B = Tube(Bs, t => 22 * sin(PI * (0.02 + 0.48 * t)) ** 0.8 + 0.8);                                // elülső fél gumó (a vágott vége jobbra)
    const e1 = Bs[5], cut = ellipse(e1[0] + 0.4, e1[1], 5.2, 11.4, 14, -4), flesh = ellipse(e1[0] + 0.6, e1[1], 4.1, 9.8, 14, -4);
    const wr = (T, us, i0, i1) => us.map(u => band(Array.from({ length:i1 - i0 + 1 }, (_, k) => T.at(i0 + k, u + 0.08 * sin(k * 1.7))), t => 1.1 * sin(PI * t), false));
    add('f_batata', { hu:'Édesburgonya (batáta)', en:'two red-skinned sweet potatoes, one cut showing orange flesh', tilt:TILT, shapes:[
      body('berry', 'light', A.T.sil()),
      fill('blossom', 'dark', A.T.tone(L, d => d > 0.64)),
      fill('berry', 'base', A.T.tone(L, TONE.dark, true)),
      fill('berry', 'base', wr(A.T, [-0.35, 0.1, 0.5], 2, 6), { o:0.7 }),                                     // ráncok
      body('berry', 'light', [...B.sil(false).slice(0, -1)]),
      fill('blossom', 'dark', B.tone(L, d => d > 0.64)),
      fill('berry', 'base', B.tone(L, TONE.dark, true)),
      fill('berry', 'dark', B.tone(L, TONE.edge, true), { o:0.4 }),
      body('orange', 'base', cut),                                                                           // vágott lap: narancs hús
      fill('orange', 'light', [flesh]),
      fill('honey', 'light', [ellipse(e1[0] - 0.2, e1[1] - 2.4, 1.6, 3.8, 8, -4)], { o:0.8 }),
      fill('berry', 'base', dots([A.T.at(3, 0.2), A.T.at(5, -0.3), B.at(2, 0.3), A.T.at(6, 0.4)], 0.8), { o:0.7 }),   // hajszál-gyökér helyek
      shine([band([A.T.at(2, -0.6), A.T.at(4, -0.66), A.T.at(6, -0.58)], t => 0.6 + 2 * sin(PI * t), false)], 0.5),
    ]});
  }

  // ======================================================================
  //  AVOKÁDÓ (éretlen) – körte alakú, sötétzöld, rücskös héjú gyümölcs kis fás kocsánnyal; előtte egy félbevágott:
  //  sötét héj-perem, zöldből sárgába hajló hús és a barna mag (az ismerős kép)
  // ======================================================================
  {
    const TILT = -12, L = lightFor(TILT);
    const pear = th => { const s = sin(rad(th)); return s < 0 ? 1 - 0.36 * s * s * (1 - 0.3 * s * s) : 1; };
    const W = Blob({ cx:40, cy:46, rx:24, ry:36, rot:-8, f:pear });
    const Hf = Blob({ cx:64, cy:66, rx:20, ry:25, rot:34, f:pear });
    const pebble = [[-150, 0.55], [-120, 0.3], [-60, 0.5], [-20, 0.7], [10, 0.4], [40, 0.75], [70, 0.5], [110, 0.7], [150, 0.45], [175, 0.72], [-95, 0.7]].map(([a, r]) => W.at(a, r));
    add('f_avokado', { hu:'Avokádó (éretlen)', en:'dark green avocado with bumpy skin, and one avocado half with the stone', tilt:TILT, shapes:[
      body('leaf', 'base', W.sil(48)),                                                                        // egész avokádó
      fill('leaf', 'light', W.tone(L, d => d > 0.68)),
      fill('leaf', 'dark', W.tone(L, TONE.dark)),
      fill('grass', 'light', dots(pebble, 0.85), { o:0.55 }),                                                 // rücskös héj
      body('wood', 'dark', band([W.at(-98, 0.98), W.at(-98, 1.12)], 3.2)),                                  // kocsány
      body('leaf', 'dark', Hf.sil(44)),                                                                       // fél avokádó: héj-perem
      fill('grass', 'base', [Hf.sil(40).map(p => lerp(p, Hf.o ? [Hf.o.cx, Hf.o.cy] : p, 0.1))]),              // hús (zöld szél)
      fill('gold', 'light', [Hf.sil(40).map(p => lerp(p, [Hf.o.cx, Hf.o.cy], 0.3))]),                          // hús (sárgás belső)
      body('wood', 'base', ellipse(...Hf.at(90, 0.2), 8.2, 8.8, 14)),                                        // mag
      fill('wood', 'dark', [ellipse(...lerp(Hf.at(90, 0.2), [Hf.o.cx + 20, Hf.o.cy + 20], 0.1), 6.6, 7.2, 12)].map(p => p.map(q => [q[0] + 1.2, q[1] + 1.2])), { o:0.6 }),
      fill('wood', 'light', [ellipse(...Hf.at(90, 0.2).map((v, i) => v - [2.4, 2.8][i]), 2.6, 2, 8, -30)]),
      shine([band([W.at(-160, 0.6), W.at(-176, 0.66), W.at(165, 0.6)], t => 0.5 + 2 * sin(PI * t), false)], 0.5),
    ]});
  }

  // ======================================================================
  //  GÖRÖGDINNYE (egész) – nagy, fekvő ovális dinnye: világoszöld alap, a pólustól pólusig futó sötétzöld, cakkos
  //  csíkok (a görbült felszínen összetartva), sárgás „fekvőfolt” alul, kis göndör kocsány
  // ======================================================================
  {
    const TILT = 8, L = lightFor(TILT), cx = 50, cy = 54, rx = 40, ry = 29;
    const B = Blob({ cx, cy, rx, ry });
    const stripe = v => { const M = 16, up = [], dn = [];
      for(let i = 0; i <= M; i++){ const x = -0.93 + 1.86 * i / M, sq = sqrt(1 - x * x), zz = 0.05 * sin(i * 2.4 + v * 7), w = 0.075 * sq + 0.02;
        up.push([cx + rx * x, cy + ry * sq * (v + zz - w)]); dn.push([cx + rx * x, cy + ry * sq * (v + zz + w)]); }
      return [...up, ...dn.reverse()]; };
    add('f_dinnye', { hu:'Görögdinnye (egész)', en:'whole striped watermelon lying on its side', tilt:TILT, shapes:[
      body('grass', 'base', B.sil(48)),
      fill('grass', 'light', B.tone(L, d => d > 0.62)),
      fill('grass', 'dark', B.tone(L, TONE.dark)),
      fill('leaf', 'dark', [-0.72, -0.4, -0.08, 0.24, 0.56, 0.86].map(stripe)),                              // cakkos sötét csíkok
      fill('grass', 'dark', [-0.56, -0.24, 0.08, 0.4, 0.71].map(v => band(Array.from({ length:13 }, (_, i) => { const x = -0.9 + 1.8 * i / 12; return [cx + rx * x, cy + ry * sqrt(1 - x * x) * (v + 0.03 * sin(i * 3))]; }), t => 0.9 * sin(PI * t), false)), { o:0.7 }),   // halvány erek
      fill('leaf', 'line', B.tone(L, TONE.edge), { o:0.45 }),
      fill('cream', 'dark', [ellipse(cx + 4, cy + ry * 0.8, 13, 3.6, 12)], { o:0.8 }),                        // fekvőfolt
      fill('leaf', 'line', [ellipse(cx + rx - 3, cy - 1, 2.6, 3.4, 8)], { o:0.6 }),                              // kocsány-hely
      body('wood', 'base', band([[cx + rx - 1.6, cy - 1.5], [cx + rx + 3.6, cy - 4.6], [cx + rx + 5.4, cy - 8.6], [cx + rx + 3.2, cy - 10.6]], 2.4)),   // göndör kocsány
      shine([band([B.at(-160, 0.66), B.at(-140, 0.72), B.at(-118, 0.74)], t => 0.8 + 2.8 * sin(PI * t), false), ellipse(...B.at(-100, 0.78), 1.8, 1.2, 6)], 0.7),
    ]});
  }

  // ---- kupolás lap-tárgy egy síkban (fekvő hús, filé): O(th) → (u, v) cm körvonal, y0 talp, H domborulat; ring(s, h) = s-szeres körvonal h magasságban ----
  function Dome(P, O, y0, Hh, n = 28){
    const ths = Array.from({ length:n }, (_, i) => 360 * i / n);
    const ring = (s, h = 0, du = 0, dv = 0) => ths.map(th => { const [u, v] = O(th); return P([u * s + du, y0 + h, -(v * s + dv)]); });
    const cap = s => ring(s, Hh * (1 - s * s));
    const sil = hull([...ring(1), ...cap(0.8), ...cap(0.6), ...cap(0.3)]);
    const arcOf = (s, a0, a1, m = 8, du = 0, dv = 0) => Array.from({ length:m + 1 }, (_, i) => { const th = a0 + (a1 - a0) * i / m, [u, v] = O(th); return P([u * s + du, y0 + Hh * (1 - s * s), -(v * s + dv)]); });
    return { ring, cap, sil, arcOf };
  }
  // fehér hab-tálca (doboz lapjai + belső alj), W × D cm, H magas
  function Tray(P, W, D, Hh){
    const b = box(P, -W / 2, W / 2, 0, Hh, -D / 2, D / 2), i = 1.1;
    return { sil:b.sil, front:b.front, right:b.right, top:b.top, floor:[[-W / 2 + i, -D / 2 + i], [W / 2 - i, -D / 2 + i], [W / 2 - i, D / 2 - i], [-W / 2 + i, D / 2 - i]].map(([x, z]) => P([x, Hh * 0.3, z])) };
  }

  // ======================================================================
  //  FŐTT RIZS – kerámia tál kék díszcsíkkal, benne púpozott, fehér főtt rizs: a kupacon apró, hosszúkás szemek rajzolata
  //  (nem üvegdoboz – ettől nem „maradék”)
  // ======================================================================
  {
    const TILT = 8, L = lightFor(TILT), RIM = 6.2, RR = 7.4, DH = 2.6;
    const fit = [...Array.from({ length:12 }, (_, i) => [RR * sin(rad(i * 30)), RIM, RR * cos(rad(i * 30))]), [0, 0, 0], [0, RIM + DH, 0]];
    const P = camera({ az:0, el:30, tilt:TILT, span:80, fit });
    const bowl = Lathe(P, [[3.1, 0], [3.4, 0.5], [3.3, 0.7], [5.6, 2.4], [6.9, 4.4], [RR, RIM]]);
    const domeR = h => (RR - 0.5) * sqrt(max(0, 1 - h * h)), dome = hull([0, 0.25, 0.5, 0.7, 0.85, 0.95, 1].flatMap(h => Array.from({ length:20 }, (_, i) => P([domeR(h) * sin(rad(i * 18)), RIM + DH * h, domeR(h) * cos(rad(i * 18))]))));
    const dp = (h, th, k = 1) => P([domeR(h) * k * sin(rad(th)), RIM + DH * h, domeR(h) * k * cos(rad(th))]);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const grains = Array.from({ length:30 }, () => { const h = 0.1 + rnd() * 0.85, th = -95 + rnd() * 190; return ellipse(...dp(h, th, 0.95), 1.9, 0.8, 6, rnd() * 180); });
    add('f_rizs', { hu:'Főtt rizs', en:'bowl heaped with white cooked rice', tilt:TILT, shapes:[
      body('sky', 'base', bowl.sil(12)),                                                                     // tál
      fill('sky', 'light', [bowl.strip(-90, -40, 1, 5)]),
      fill('sky', 'dark', [bowl.strip(35, 90, 1, 5)]),
      fill('blue', 'base', [bowl.strip(-90, 90, 3, 4, 0.2)]),                                                 // kék díszcsík
      fill('blue', 'light', [-60, -30, 0, 30, 60].map(th => ellipse(...P([6.3 * sin(rad(th)), 3.25, 6.3 * cos(rad(th))]), 0.9, 0.7, 6)), { o:0.9 }),   // pöttyök a csíkon
      body('white', 'base', dome),                                                                           // rizs-kupac
      fill('white', 'light', [hull([dp(0.35, -80), dp(0.6, -60), dp(0.95, 0), dp(0.75, -120), dp(0.45, -130), dp(0.6, -100)])]),
      fill('white', 'dark', [[...Array.from({ length:9 }, (_, i) => dp(0.02, 20 + i * 10)), ...Array.from({ length:9 }, (_, i) => dp(0.45, 100 - i * 10, 0.95))]]),
      fill('steel', 'base', grains),                                                                         // szemek
      fill('paper', 'light', grains.map(g => g.map(q => [q[0] - 0.4, q[1] - 0.35]))),
      fill('sky', 'light', [band(Array.from({ length:13 }, (_, i) => bowl.ring(RR - 0.15, RIM, -90 + i * 15)), 1.4, false)]),   // a tál elülső pereme a rizs előtt
      shine([bowl.strip(-66, -58, 1, 4, 0.4, 2)], 0.7),
    ]});
  }

  // ======================================================================
  //  FÜSTÖLT LAZAC – három, legyezőszerűen egymásra hajtott narancs-rózsaszín szelet fehér zsír-csíkokkal, kis fehér
  //  tálon, citromcikkel és kaporral – a csíkos, lágy szelet különbözteti meg a nyers haltól és a sonkától
  // ======================================================================
  {
    const TILT = -10, L = lightFor(TILT);
    const plate = Blob({ cx:50, cy:60, rx:42, ry:22 }), plateIn = Blob({ cx:50, cy:59, rx:33, ry:16 });
    const slice = (cx, cy, rot) => Blob({ cx, cy, rx:24, ry:9.5, rot, f:th => 1 + 0.05 * sin(rad(6 * th)) });
    const S = [slice(44, 48, -28), slice(52, 56, -14), slice(58, 64, 0)];
    const stripes = B => [-44, -24, -4, 16, 36].map(d => band([B.at(-90 + d - 8, 0.86), B.at(0, 0) && lerp(B.at(-90 + d - 8, 0.86), B.at(90 - d + 8, 0.86), 0.5), B.at(90 - d + 8, 0.86)].map((p, i) => i === 1 ? [p[0] + 1.2, p[1]] : p), t => 1.1 * sin(PI * t), false));
    const sl = B => [body('orange', 'base', B.sil(36)), fill('orange', 'light', B.tone(L, d => d > 0.6, 30)), fill('paper', 'light', stripes(B), { o:0.75 })];
    const lemon = [[74, 50], [90, 46], [88, 54]], dill = [[18, 58], [26, 54], [32, 55], [24, 60]];
    add('f_lazac', { hu:'Füstölt lazac', en:'slices of smoked salmon with white fat lines on a small plate', tilt:TILT, shapes:[
      body('white', 'base', plate.sil(40)),                                                                  // tányér
      fill('white', 'dark', [plateIn.sil(36)]),
      ...sl(S[0]), fill('ember', 'dark', S[0].tone(L, TONE.dark, 30), { o:0.5 }),
      ...sl(S[1]),
      ...sl(S[2]), fill('ember', 'base', S[2].tone(L, TONE.dark, 30), { o:0.45 }),
      body('honey', 'base', lemon),                                                                          // citromcikk
      fill('honey', 'light', [[[75.5, 50], [89, 46.8], [87.5, 51.5]]]),
      fill('leaf', 'base', [band(bez([14, 62], [22, 52], [34, 50], 6), 1.1, false), ...[[20, 56], [24, 53], [28, 51.5]].flatMap(([x, y]) => [band([[x, y], [x - 2, y - 5]], 0.9, false), band([[x, y], [x + 3, y - 4]], 0.9, false)])]),   // kapor
    ]});
  }

  // ======================================================================
  //  TIRAMISU – szögletes szelet valódi méretből vetítve: kakaós teteje, elöl és oldalt a rétegek (kávés babapiskóta –
  //  mascarpone-krém – piskóta – krém), kis fehér tányéron
  // ======================================================================
  {
    const TILT = -10, X = 4, Z = 4, H = 5.6, LAY = [[0, 1.2, 'b'], [1.2, 2.5, 'c'], [2.5, 3.7, 'b'], [3.7, 5.0, 'c'], [5.0, H, 'k']];
    const fit = []; for(const x of [-X, X]) for(const y of [0, H]) for(const z of [-Z, Z]) fit.push([x, y, z]);
    for(let i = 0; i < 12; i++) fit.push([7.2 * sin(rad(i * 30)), -0.2, 7.2 * cos(rad(i * 30))]);
    const P = camera({ az:28, el:26, F:60, tilt:TILT, span:84, fit });
    const bx = box(P, -X, X, 0, H, -Z, Z), pl = hull(Array.from({ length:24 }, (_, i) => P([7.2 * sin(rad(i * 15)), -0.2, 7.2 * cos(rad(i * 15))])));
    const plIn = Array.from({ length:24 }, (_, i) => P([5.2 * sin(rad(i * 15)), -0.2, 5.2 * cos(rad(i * 15))]));
    const Fq = (y0, y1) => [P([-X, y0, Z]), P([X, y0, Z]), P([X, y1, Z]), P([-X, y1, Z])], Rq = (y0, y1) => [P([X, y0, Z]), P([X, y0, -Z]), P([X, y1, -Z]), P([X, y1, Z])];
    const lay = k => LAY.filter(l => l[2] === k);
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const dust = Array.from({ length:12 }, () => ellipse(...P([-X + 0.6 + rnd() * (2 * X - 1.2), H + 0.02, -Z + 0.6 + rnd() * (2 * Z - 1.2)]), 0.7, 0.45, 5));
    const pores = lay('b').flatMap(([y0, y1]) => [-2.8, -0.9, 1.1, 3.0].map((x, i) => ellipse(...P([x, (y0 + y1) / 2 + (i % 2 ? 0.2 : -0.2), Z + 0.02]), 0.55, 0.4, 5)));
    add('f_tiramisu', { hu:'Tiramisu', en:'square slice of tiramisu with cocoa on top and cream and sponge layers', tilt:TILT, shapes:[
      body('white', 'base', pl),                                                                              // tányér
      fill('white', 'dark', [plIn]),
      body('chocolate', 'base', bx.sil),                                                                      // szelet körvonala
      fill('wood', 'base', lay('b').map(([a, b]) => Fq(a, b))),                                               // piskóta-rétegek elöl
      fill('wood', 'dark', lay('b').map(([a, b]) => Rq(a, b))),                                               // … oldalt
      fill('cream', 'base', lay('c').map(([a, b]) => Fq(a, b))),                                              // krém-rétegek elöl
      fill('cream', 'dark', lay('c').map(([a, b]) => Rq(a, b))),                                              // … oldalt
      fill('chocolate', 'base', [Fq(5.0, H)]),
      fill('chocolate', 'dark', [Rq(5.0, H)]),
      fill('chocolate', 'light', [bx.top]),                                                                   // kakaós tető
      fill('chocolate', 'base', dust, { o:0.8 }),
      fill('wood', 'dark', pores, { o:0.7 }),                                                                 // kávés piskóta pórusai
      shine([[P([-X + 0.4, 3.0, Z + 0.02]), P([-X + 1.2, 3.0, Z + 0.02]), P([-X + 1.2, 3.4, Z + 0.02]), P([-X + 0.4, 3.4, Z + 0.02])]], 0.8),
    ]});
  }

  // ======================================================================
  //  NYERS PULYKAMELL – nagy, csont nélküli, csepp alakú rózsaszín filé (domború, rostos) fehér tálcán
  //  – a csontos karajtól és az egész csirkétől a sima, nagy filé különbözteti meg
  // ======================================================================
  {
    const TILT = -10, TW = 21, TD = 14, TH = 1.8, L = lightFor(TILT);
    const O = th => { const s = sin(rad(th)), c = cos(rad(th)); return [8.6 * c + 1.2 * c * c - 0.6, 5.4 * s * (1 - 0.32 * c)]; };
    const fit = [[-TW / 2, 0, TD / 2], [TW / 2, 0, TD / 2], [-TW / 2, 0, -TD / 2], [TW / 2, 0, -TD / 2], [-TW / 2, TH, -TD / 2], [TW / 2, TH, -TD / 2], [0, TH + 3, 0]];
    const P = camera({ az:22, el:38, tilt:TILT, span:82, fit }), T = Tray(P, TW, TD, TH), D = Dome(P, O, TH * 0.4, 3.4);
    const fib = [-0.5, -0.1, 0.3].map(v => band(Array.from({ length:6 }, (_, i) => { const u = -5.5 + i * 2.4; return P([u, TH * 0.4 + 3.4 * max(0, 1 - ((u / 9) ** 2 + (v * 0.9) ** 2)) + 0.05, -(v * 4.8 + 0.4 * sin(i))]); }), t => 1.1 * sin(PI * t), false));
    add('f_pulyka', { hu:'Nyers pulykamell', en:'large raw turkey breast fillet on a white tray', tilt:TILT, shapes:[
      body('white', 'base', T.sil),                                                                           // tálca
      fill('white', 'dark', [T.right]),
      fill('white', 'light', [T.top]),
      fill('steel', 'light', [T.floor]),
      body('blossom', 'base', D.sil),                                                                         // filé
      fill('blossom', 'light', [hull([...D.arcOf(0.55, 110, 230, 8), ...D.arcOf(0.22, 0, 360, 8)])]),                // fény felőli domború rész
      fill('blossom', 'dark', [[...D.ring(1, 0.02).slice(19), ...D.ring(1, 0.02).slice(0, 3), ...D.arcOf(0.74, 38, 245, 14)]]),   // árnyékos szél
      fill('pink', 'dark', [[...D.ring(1, 0.02).slice(21), ...D.ring(1, 0.02).slice(0, 2), ...D.arcOf(0.93, 26, 272, 12)]], { o:0.5 }),
      fill('blossom', 'light', fib, { o:0.9 }),                                                              // rostok
      fill('white', 'light', [ellipse(...P([-3.6, TH * 0.4 + 3, 1.4]), 2.8, 1.1, 8, -12)], { o:0.8 }),        // fényes, nedves csillanás
    ]});
  }

  // ======================================================================
  //  NYERS HAMBURGERHÚS – két kerek, vastag, vörös pogácsa egymáson, köztük sütőpapír-lap kilógó sarkokkal;
  //  darált-hús „kukacos” minta – a kerek pogácsa különbözteti meg a darált hús halmától
  // ======================================================================
  {
    const TILT = 10, R0 = 5.4, L = lightFor(TILT);
    const fit = [...Array.from({ length:12 }, (_, i) => [7.4 * sin(rad(i * 30)), 0, 7.4 * cos(rad(i * 30))]), [0, 4.2, 0]];
    const P = camera({ az:0, el:36, tilt:TILT, span:80, fit });
    const lo = Lathe(P, [[R0 - 0.2, 0], [R0, 0.3], [R0, 1.4], [R0 - 0.3, 1.8]]), hi = Lathe(P, [[R0 - 0.2, 2.0], [R0, 2.3], [R0, 3.5], [R0 - 0.35, 4.0]]);
    const sheet = [45, 135, 225, 315].map(a => P([7.4 * sin(rad(a + 18)), 1.9, 7.4 * cos(rad(a + 18))]));
    let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const worm = (n, w, r0) => Array.from({ length:n }, () => { const rr = sqrt(rnd()) * r0, th = rnd() * 360, c = P([rr * sin(rad(th)), 4.02, rr * cos(rad(th))]), a0 = rnd() * 360, s = 0.7 * P.k;
      return band(Array.from({ length:4 }, (_, i) => [c[0] + s * cos(rad(a0 + i * 55)), c[1] + s * 0.7 * sin(rad(a0 + i * 55))]), w, false); });
    const sideW = (n, w) => Array.from({ length:n }, () => { const th = -80 + rnd() * 160, y = 2.5 + rnd() * 0.9, c = hi.ring(R0 + 0.02, y, th); return band([[c[0] - 1, c[1]], [c[0] + 1, c[1] + 0.3]], w, false); });
    add('f_burgerhus', { hu:'Nyers hamburgerhús', en:'two raw beef burger patties stacked with baking paper between', tilt:TILT, shapes:[
      body('red', 'base', lo.sil(12)),                                                                        // alsó pogácsa
      fill('red', 'dark', [lo.strip(20, 90, 0, 3)]),
      body('paper', 'light', sheet),                                                                          // sütőpapír
      fill('paper', 'dark', [[sheet[0], sheet[1], lerp(sheet[1], sheet[0], 0.5)]], { o:0.6 }),
      body('red', 'base', hi.sil(12)),                                                                        // felső pogácsa
      fill('red', 'light', [hi.top(3, 18, 0.9)]),
      fill('red', 'dark', [hi.strip(25, 90, 0, 3)]),
      fill('red', 'line', [hi.strip(62, 90, 0, 3)], { o:0.4 }),
      fill('tomato', 'light', worm(13, 1.3, 4.2)),                                                            // világos darálás-minta
      fill('red', 'line', [...worm(11, 1.1, 4.3), ...sideW(7, 1.1)], { o:0.45 }),                             // sötét darálás-minta
      fill('blossom', 'light', Array.from({ length:7 }, () => { const rr = sqrt(rnd()) * 4, th = rnd() * 360; return ellipse(...P([rr * sin(rad(th)), 4.03, rr * cos(rad(th))]), 0.55, 0.4, 5); })),   // zsír-pöttyök
      shine([ellipse(...P([-2.2, 4.05, -1.2]), 2.2, 0.8, 8, -8)], 0.45),
    ]});
  }

  // ======================================================================
  //  PÁCOLT CSIRKECOMB – két fényes, vörösesnarancs pácos alsócomb (vaskos hús, vékony csontvég fehér bütyökkel)
  //  lapos üvegtálban, a pác tócsájában, zöld fűszer-pöttyökkel és fokhagyma-szeletekkel
  // ======================================================================
  {
    const TILT = -8, L = lightFor(TILT);
    const dish = Blob({ cx:50, cy:62, rx:44, ry:24 }), pool = Blob({ cx:50, cy:61, rx:37, ry:17 });
    const leg = (a, b, c) => { const sp = bez(a, b, c, 10), meat = sp.slice(0, 8), bone = sp.slice(6);
      return { sp, bone, T:Tube(meat, t => 19 * sin(PI * (0.14 + 0.62 * t)) ** 0.55 * (t > 0.7 ? 1 - (t - 0.7) / 0.3 * 0.62 : 1) + 1) }; };
    const A = leg([20, 58], [42, 44], [74, 28]), B = leg([30, 72], [55, 66], [88, 50]);
    const knob = l => { const e = l.sp[l.sp.length - 1], q = l.sp[l.sp.length - 2], d = [e[0] - q[0], e[1] - q[1]], k = hypot(...d); const n = [-d[1] / k, d[0] / k];
      return [ellipse(e[0] + n[0] * 2.3, e[1] + n[1] * 2.3, 2.9, 2.5, 8), ellipse(e[0] - n[0] * 2.3, e[1] - n[1] * 2.3, 2.9, 2.5, 8)]; };
    const legShapes = l => [body('ember', 'base', l.T.sil()), fill('orange', 'base', l.T.tone(L, d => d > 0.6)), fill('ember', 'dark', l.T.tone(L, TONE.dark, true))];
    add('f_pacolt', { hu:'Pácolt csirkecomb', en:'two chicken drumsticks in red marinade in a glass dish with herbs', tilt:TILT, shapes:[
      body('glass', 'base', dish.sil(40)),                                                                    // üvegtál
      fill('ember', 'light', [pool.sil(36)], { o:0.8 }),                                                      // pác
      bodyP('cream', 'light', [...knob(A), ...knob(B), band(A.bone, 4.4, false), band(B.bone, 4.4, false)]),     // csont és bütyke
      ...legShapes(A),
      ...legShapes(B),
      fill('leaf', 'base', dots([[30, 55], [38, 49], [46, 46], [52, 42], [40, 67], [50, 64], [60, 60], [68, 57], [28, 66], [58, 72], [74, 66]], 0.9)),   // fűszer
      fill('cream', 'light', [ellipse(22, 70, 3, 2, 8, 20), ellipse(76, 72, 2.8, 1.9, 8, -10)]),              // fokhagyma-szelet
      fill('glass', 'light', [band(bez(dish.at(-170, 0.93), dish.at(-130, 0.95), dish.at(-95, 0.95), 8), 2, false)], { o:0.9 }),   // üvegperem fénye
      shine([band([A.T.at(2, -0.5), A.T.at(3, -0.55), A.T.at(4, -0.45)], t => 0.5 + 1.8 * sin(PI * t), false), band([B.T.at(2, -0.5), B.T.at(3, -0.55), B.T.at(4, -0.45)], t => 0.5 + 1.8 * sin(PI * t), false)], 0.75),
    ]});
  }

  // ======================================================================
  //  BOLTI MAJONÉZ – zömök üvegtégely krémfehér majonézzel, kék csavaros tetővel, a címkén tojás-kép
  //  (fehér ovális sárga sárgájával) – a krémfehér tartalom és a tojás-jel különbözteti meg a méztől és a lekvártól
  // ======================================================================
  {
    const TILT = -10, L = lightFor(TILT), JR = 4.6, JH = 7.6, NR = 3.9, L0 = 8.3, L1 = 10.2;
    const P = camera({ az:0, el:22, F:70, tilt:TILT, span:78, fit:[[-JR, 0, -JR], [JR, 0, JR], [-JR, L1, -JR], [JR, L1, JR]] });
    const jar = Lathe(P, [[4.2, 0], [4.5, 0.35], [JR, 0.9], [JR, 6.9], [4.3, 7.5], [NR, JH], [NR, L0]]), lid = Lathe(P, [[4.15, L0], [4.15, L1]]);
    const on = (th, y, r = JR + 0.03) => jar.ring(r, y, th);
    const label = [...Array.from({ length:9 }, (_, i) => on(-70 + i * 17.5, 1.6)), ...Array.from({ length:9 }, (_, i) => on(70 - i * 17.5, 5.8))];
    const EC = on(-8, 3.7), egg = Array.from({ length:14 }, (_, i) => { const a = rad(i * 360 / 14), k = 1 + 0.09 * sin(3 * a + 1); return [EC[0] + 8.2 * k * cos(a), EC[1] + 5.2 * k * sin(a)]; });
    add('f_majonez', { hu:'Bolti majonéz', en:'glass jar of creamy white mayonnaise with a blue lid and an egg on the label', tilt:TILT, shapes:[
      body('cream', 'base', jar.sil(12)),                                                                    // majonéz az üvegben
      fill('cream', 'light', [jar.strip(-90, -36, 0, 4)]),
      fill('cream', 'dark', [jar.strip(34, 90, 0, 4)]),
      fill('glass', 'light', [jar.strip(-90, 90, 4, 6, 0.4)], { o:0.9 }),                                   // üres üvegnyak
      body('blue', 'base', lid.sil(12)),                                                                     // kék tető
      fill('blue', 'dark', [lid.strip(30, 90)]),
      fill('blue', 'light', [lid.top(1, 14, 0.6)]),
      fill('blue', 'dark', [-60, -35, -10, 15].map(th => band([lid.at(0, th, 0.2), lid.at(1, th, 0.2)], 0.7, false)), { o:0.55 }),   // recézés
      fill('sky', 'light', [label]),                                                                         // címke
      fill('white', 'dark', [egg.map(p => [p[0] + 0.6, p[1] + 0.6])]),
      fill('paper', 'light', [egg]),                                                                          // tojás…
      fill('honey', 'base', [ellipse(EC[0] + 0.8, EC[1] - 0.2, 4.4, 3.8, 12)]),
      fill('honey', 'light', [ellipse(EC[0] - 0.3, EC[1] - 1.1, 1.3, 0.9, 6)]),                                        // …sárgája
      fill('blue', 'base', [band(Array.from({ length:9 }, (_, i) => on(-70 + i * 17.5, 1.9)), 0.9, false), band(Array.from({ length:9 }, (_, i) => on(-70 + i * 17.5, 5.5)), 0.9, false)]),   // címke-csíkok
      shine([jar.strip(-62, -54, 1, 3, 0), jar.strip(-46, -42, 1, 3, 0)], 0.75),
    ]});
  }

  // ======================================================================
  //  SAVANYÚSÁG – magas befőttesüveg, a halványsárga lében függőleges csemegeuborkák és kaporág látszik,
  //  aranyszínű csavaros fémtető – az üvegen át látszó uborkák teszik felismerhetővé
  // ======================================================================
  {
    const TILT = 10, L = lightFor(TILT), JR = 4.4, JH = 12.4, NR = 3.8, L0 = 13.0, L1 = 14.7;
    const P = camera({ az:0, el:18, F:70, tilt:TILT, span:80, fit:[[-JR, 0, -JR], [JR, 0, JR], [-JR, L1, -JR], [JR, L1, JR]] });
    const jar = Lathe(P, [[4.0, 0], [4.3, 0.35], [JR, 0.9], [JR, 11.4], [4.1, 12.0], [NR, JH], [NR, L0]]), lid = Lathe(P, [[4.05, L0], [4.05, L1]]);
    const on = (th, y, r = JR - 0.4) => jar.ring(r, y, th);
    const cuke = (th, y0, y1, w) => { const sp = Array.from({ length:6 }, (_, i) => on(th + 3 * sin(i), y0 + (y1 - y0) * i / 5)); return Tube(sp, t => w * sin(PI * (0.1 + 0.8 * t)) ** 0.4); };
    const C = [cuke(-52, 1.1, 9.4, 7.6), cuke(-6, 0.9, 10.6, 8.4), cuke(42, 1.2, 9.8, 7.8)];
    add('f_savanyusag', { hu:'Savanyúság', en:'tall glass jar of pickled gherkins with dill and a gold lid', tilt:TILT, shapes:[
      body('glass', 'base', jar.sil(12)),                                                                    // üveg
      fill('honey', 'light', [jar.strip(-90, 90, 0, 3, 0.6)], { o:0.85 }),                                   // halványsárga lé
      bodyP('leaf', 'base', C.map(c => c.sil())),                                                            // uborkák
      fill('grass', 'base', C.flatMap(c => c.tone(L, d => d > 0.6))),
      fill('leaf', 'dark', C.flatMap(c => c.tone(L, TONE.dark, true))),
      fill('grass', 'light', dots(C.flatMap(c => [c.at(1, 0.3), c.at(2, -0.3), c.at(3, 0.2), c.at(4, -0.2)]), 0.55), { o:0.9 }),   // dudorok
      fill('leaf', 'light', [band([on(20, 2.5), on(24, 7), on(18, 11)], 0.8, false), ...[4, 6.5, 9].flatMap(y => [band([on(21, y), on(32, y + 1.4)], 0.6, false), band([on(21, y), on(10, y + 1.2)], 0.6, false)])]),   // kapor
      fill('glass', 'dark', [jar.strip(40, 90, 0, 5)], { o:0.45 }),                                         // üveg árnyékos oldala
      body('gold', 'base', lid.sil(12)),                                                                     // fémtető
      fill('gold', 'dark', [lid.strip(30, 90)]),
      fill('gold', 'light', [lid.top(1, 14, 0.6)]),
      shine([jar.strip(-66, -58, 1, 4, 0), jar.strip(-50, -46, 1, 4, 0)], 0.8),
    ]});
  }

  // ======================================================================
  //  SALÁTAÖNTET – karcsú, kerek üvegpalack két réteggel: fent aranysárga olaj, lent zavaros, fűszeres öntet
  //  zöld pöttyökkel; fehér pattintós kupak, címkén salátalevél – a rétegek és a pöttyök különböztetik meg az olajtól
  // ======================================================================
  {
    const TILT = 12, L = lightFor(TILT), R0 = 3.2, H = 13, SH = 15.2, NR = 1.35, NT = 17.4, CT = 19.6;
    const P = camera({ az:0, el:16, F:80, tilt:TILT, span:82, fit:[[-R0, 0, -R0], [R0, 0, R0], [-R0, CT, -R0], [R0, CT, R0]] });
    const bot = Lathe(P, [[2.6, 0], [2.85, 0.3], [R0, 0.8], [R0, H], [2.4, 14.3], [1.6, SH], [NR, 15.8], [NR, NT]]), cap = Lathe(P, [[1.75, NT], [1.75, 18.8], [1.2, 19.2], [1.2, CT]]);
    const on = (th, y, r = R0 + 0.02) => bot.ring(r, y, th);
    let seed = 9; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const flecks = Array.from({ length:14 }, () => ellipse(...on(-80 + rnd() * 160, 0.8 + rnd() * 5.6, R0 - 0.2), 0.75, 0.5, 5, rnd() * 180));
    const lab = [...Array.from({ length:7 }, (_, i) => on(-60 + i * 20, 7.2)), ...Array.from({ length:7 }, (_, i) => on(60 - i * 20, 11.8))];
    add('f_salataontet', { hu:'Salátaöntet', en:'slim glass bottle of salad dressing with an oil layer, herb flecks and a white flip cap', tilt:TILT, shapes:[
      body('glass', 'light', bot.sil(12)),                                                                   // palack (üres váll)
      fill('cream', 'dark', [bot.strip(-90, 90, 0, 3, 0.5)]),                                                // zavaros öntet (lent)
      fill('honey', 'base', [[...Array.from({ length:9 }, (_, i) => on(-88 + i * 22, 6.6, R0 - 0.45)), ...Array.from({ length:9 }, (_, i) => on(88 - i * 22, 13, R0 - 0.45))]]),   // olajréteg (fent)
      fill('gold', 'base', [bot.strip(40, 90, 0, 3, 0.5)], { o:0.6 }),
      fill('leaf', 'base', flecks),                                                                          // fűszer-pöttyök
      fill('paper', 'light', [lab]),                                                                         // címke
      fill('grass', 'base', [ellipse(...on(-4, 9.5), 4, 2.4, 10, -15)]),                                        // salátalevél a címkén
      fill('leaf', 'base', [band([on(-26, 10.4), on(16, 8.8)], 0.7, false)]),
      fill('glass', 'dark', [bot.strip(55, 90, 3, 7)], { o:0.5 }),
      body('white', 'base', cap.sil(10)),                                                                    // pattintós kupak
      fill('white', 'dark', [cap.strip(30, 90, 0, 1)]),
      fill('white', 'light', [cap.top(3, 12, 0.3)]),
      shine([bot.strip(-66, -58, 1, 3, 0)], 0.8),
    ]});
  }
})();
