// ============================================================
//  Matricák — Hűtő-mester: a fagyasztó ételei (f_ + étel-azonosító), B szint (docs/rajzolas.md):
//  jégkrém, fagyasztott zöldségkeverék, fagyasztott málna, halrúd, jégkocka, mirelit pizza.
//  A „fagyasztott” jel mindenhol ugyanaz, mint az f_felenged (fagyasztott hús) matricán: kékesfehér, cakkos dér a széleken
//  és a sarkokon (rime), meg apró jégkristály (flake). Felirat, márka, logó nincs.
//  A rajz-segédek az art-huto-b.js-ből jönnek (másolat – a matrica-fájlok önállóak, bármilyen sorrendben betölthetők).
//  Render: node tools/art-render.js 2d web/js/art/art-huto-fagy.js ki.png --skip huto-fagy
// ============================================================
ART.later('huto-fagy', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
(function(){
  const { R, rad, band, camera } = ART.geo;
  const { cos, sin, sqrt, hypot, max, min, abs, exp, floor, PI } = Math;
  const norm3 = v => { const l = hypot(...v) || 1; return v.map(x => x / l); };
  const L0 = norm3([-0.52, -0.62, 0.59]);                                   // fény a képernyőn: bal-fent-elöl (y lefelé nő)
  const lightFor = tilt => { const a = rad(-tilt), c = cos(a), s = sin(a); return [L0[0] * c - L0[1] * s, L0[0] * s + L0[1] * c, L0[2]]; };
  const PAD = 0.85;                                                          // a tónus-lapok ennyivel húzódnak be a kontúrtól
  const TONE = { light:d => d > 0.72, dark:d => d < 0.25, edge:d => d < -0.25 };
  const seeded = s => () => (s = (s * 16807) % 2147483647) / 2147483647;    // ismételhető „véletlen” (a kép minden betöltéskor ugyanaz)

  // ---- 2D segédek ----
  const area = p => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1]; }, 0) / 2;
  const orient = p => (area(p) >= 0 ? p : [...p].reverse());
  // sokszögek → egy útvonal (azonos körüljárással, hogy az átfedések ne lyukadjanak ki; ismétlődő pontok nélkül)
  function pathOf(polys){
    return polys.filter(p => p && p.length > 2).map(p => {
      const q = R(orient(p)).filter((v, i, a) => !i || v[0] !== a[i - 1][0] || v[1] !== a[i - 1][1]);
      return 'M' + q.map(v => v[0] + ' ' + v[1]).join(' ') + 'Z';
    }).join('');
  }
  const ellipse = (cx, cy, rx, ry, n = 8, rot = 0) => { const a = rad(rot); return Array.from({ length:n }, (_, i) => { const t = 2 * PI * i / n, x = rx * cos(t), y = ry * sin(t); return [cx + x * cos(a) - y * sin(a), cy + x * sin(a) + y * cos(a)]; }); };
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const mid = pts => pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
  const shrink = (pts, t, c = mid(pts)) => pts.map(p => lerp(p, c, t));                    // sokszög összehúzása a közepe felé
  function hull(pts){
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
    for(const q of p){ while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for(const q of p.reverse()){ while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // töröttvonal egyenletes újramintavételezése m pontra (a dér-folt cakkjai így egyenletesek)
  function resample(pts, m){
    const seg = pts.slice(1).map((p, i) => hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = seg.reduce((a, b) => a + b, 0);
    return Array.from({ length:m }, (_, j) => { let s = tot * j / (m - 1), i = 0; while(i < seg.length - 1 && s > seg[i]){ s -= seg[i]; i++; } return lerp(pts[i], pts[i + 1], seg[i] ? min(1, s / seg[i]) : 0); });
  }

  // ---- DÉR: cakkos, kékesfehér folt egy él (vagy sarok) mentén, a c belső pont felé; d = a folt mélysége ----
  //   a két vége elvékonyodik, a cakkok váltakozva mélyek és sekélyek – mint a zúzmara a fagyasztóból kivett dobozon
  function rime(edge, c, d, seed = 1, m = 13, pad = 0.9){
    const E = resample(edge, m), rnd = seeded(seed * 7919 + 13);
    const N = E.map((p, i) => { const a = E[max(0, i - 1)], b = E[min(m - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = hypot(dx, dy) || 1;
      const v = [-dy / l, dx / l]; return v[0] * (c[0] - p[0]) + v[1] * (c[1] - p[1]) < 0 ? [-v[0], -v[1]] : v; });
    const off = (i, k) => [E[i][0] + N[i][0] * k, E[i][1] + N[i][1] * k];
    const inner = E.map((_, i) => off(i, pad + d * sin(PI * i / (m - 1)) ** 0.6 * (i % 2 ? 0.3 + 0.3 * rnd() : 0.8 + 0.4 * rnd())));
    return [...E.map((_, i) => off(i, pad)), ...inner.reverse()];
  }
  // jégkristály: három keresztbe tett, kerek végű vonás; big = a karokon kis ágak is (a fagyasztó-jel a csomagoláson)
  const flake = (x, y, r, w = 1.1, big = false) => [0, 60, 120].flatMap(a => {
    const ca = cos(rad(a)), sa = sin(rad(a)), out = [band([[x + r * ca, y + r * sa], [x - r * ca, y - r * sa]], w, true)];
    if(big) for(const s of [1, -1]){ const bx = x + s * 0.58 * r * ca, by = y + s * 0.58 * r * sa;
      for(const t of [45, -45]){ const b = rad(a + (s > 0 ? 0 : 180) + t * 1); out.push(band([[bx, by], [bx + 0.36 * r * cos(b), by + 0.36 * r * sin(b)]], w * 0.8, false)); } }
    return out;
  });

  // 1D: a [a,b] szakasz azon része, ahol test(f(x)) igaz (egy intervallumot feltételez), felezéssel finomítva
  function interval(f, test, a, b, n = 28){
    const xs = Array.from({ length:n + 1 }, (_, k) => a + (b - a) * k / n), ok = xs.map(x => test(f(x)));
    const first = ok.indexOf(true); if(first < 0) return null;
    const last = ok.lastIndexOf(true);
    const refine = (p, q) => { const v = test(f(p)); for(let i = 0; i < 16; i++){ const m = (p + q) / 2; if(test(f(m)) === v) p = m; else q = m; } return (p + q) / 2; };
    return [first === 0 ? a : refine(xs[first - 1], xs[first]), last === n ? b : refine(xs[last], xs[last + 1])];
  }
  // mintánkénti intervallumokból sokszögek (összefüggő szakaszonként): felső határ előre, alsó vissza
  function regionPolys(ints, pt){
    const n = ints.length, out = [];
    if(ints.every(Boolean)){
      const idx = ints.map((_, i) => i);
      out.push(idx.every(k => ints[k][0] < 1e-6) ? idx.map(k => pt(k, ints[k][1])) : [...idx.map(k => pt(k, ints[k][1])), ...idx.reverse().map(k => pt(k, ints[k][0]))]);
      return out;
    }
    for(let i = 0; i < n; i++){
      if(!ints[i] || ints[(i - 1 + n) % n]) continue;
      const idx = []; for(let k = i; ints[k]; k = (k + 1) % n){ idx.push(k); if(idx.length > n) break; }
      out.push([...idx.map(k => pt(k, ints[k][1])), ...idx.slice().reverse().map(k => pt(k, ints[k][0]))]);
    }
    return out;
  }
  // ---- poláris folt (gombóc): közép, sugarak, f(fok) sugár-szorzó; tone() gömbszerű álnormálissal ----
  function Blob(o){
    const f = o.f || (() => 1);
    const at = (th, rho = 1) => { const k = f(th) * rho; return [o.cx + o.rx * k * cos(rad(th)), o.cy + o.ry * k * sin(rad(th))]; };
    const sil = (n = 36) => R(Array.from({ length:n }, (_, i) => at(90 + 360 * i / n)));
    const tone = (L, test, n = 40, pad = PAD) => {
      const ths = Array.from({ length:n }, (_, i) => 360 * i / n);
      const ints = ths.map(th => { const e = at(th), dx = e[0] - o.cx, dy = e[1] - o.cy, Rr = hypot(dx, dy), al = (dx * L[0] + dy * L[1]) / Rr;
        return interval(r => r * al + sqrt(max(0, 1 - r * r)) * L[2], test, 0, max(0, 1 - pad / Rr)); });
      return regionPolys(ints, (k, r) => at(ths[k], r));
    };
    return { at, sil, tone, o };
  }
  // ---- vetített forgástest (tölcsér, pizza): rings = [[r, y], …] alulról (cm); P = ART.geo.camera(…) ----
  //   th fokban: 0 = szemből, −90 = bal szél, +90 = jobb szél
  function Lathe(P, rings){
    const n = rings.length, ring = (r, y, th) => P([r * sin(rad(th)), y, r * cos(rad(th))]);
    const at = (i, th, pad = 0) => ring(max(0, rings[i][0] - pad / P.k), rings[i][1], th);
    const sil = (m = 10) => [...rings.map((_, i) => at(i, -90)), ...Array.from({ length:m - 1 }, (_, j) => at(n - 1, -90 - 180 * (j + 1) / m)),
      ...rings.map((_, i) => at(n - 1 - i, 90)), ...Array.from({ length:m - 1 }, (_, j) => at(0, 90 - 180 * (j + 1) / m))];
    // függőleges tónus-sáv th0…th1 között, az i0…i1 gyűrűk mentén (a kontúrtól behúzva)
    const strip = (th0, th1, i0 = 0, i1 = n - 1, pad = PAD, m = 5) => {
      const arcAt = (i, a, b) => Array.from({ length:m + 1 }, (_, j) => at(i, a + (b - a) * j / m, pad));
      const ids = Array.from({ length:i1 - i0 + 1 }, (_, j) => i0 + j);
      return [...ids.map(i => at(i, th0, pad)), ...arcAt(i1, th0, th1), ...ids.slice().reverse().map(i => at(i, th1, pad)), ...arcAt(i0, th1, th0)];
    };
    const top = (r, y, m = 20) => Array.from({ length:m }, (_, j) => ring(r, y, 360 * j / m));   // vízszintes kör (ellipszis a képen)
    return { at, sil, strip, top, ring };
  }
  // ---- hasáb a függőleges tengely körül ang fokkal elforgatva: teteje, eleje (+z), jobb vége (+x), körvonala ----
  function sbox(P, cx, cz, hx, hz, y0, y1, ang = 0){
    const a = rad(ang), c = (u, y, w) => P([cx + u * cos(a) + w * sin(a), y, cz - u * sin(a) + w * cos(a)]), all = [];
    for(const u of [-hx, hx]) for(const y of [y0, y1]) for(const w of [-hz, hz]) all.push(c(u, y, w));
    return { top:[c(-hx, y1, hz), c(hx, y1, hz), c(hx, y1, -hz), c(-hx, y1, -hz)], front:[c(-hx, y0, hz), c(hx, y0, hz), c(hx, y1, hz), c(-hx, y1, hz)],
      right:[c(hx, y0, hz), c(hx, y0, -hz), c(hx, y1, -hz), c(hx, y1, hz)], sil:hull(all), c };
  }
  const box = (P, x0, x1, y0, y1, z0, z1) => sbox(P, (x0 + x1) / 2, (z0 + z1) / 2, (x1 - x0) / 2, (z1 - z0) / 2, y0, y1);

  // ---- alakzat-gyártók ----
  const body = (m, tone, pts, x) => Object.assign({ t:'poly', m, tone, pts:R(pts) }, x);                        // peremet kapó test
  const bodyP = (m, tone, polys, x) => Object.assign({ t:'path', m, tone, p:pathOf(polys) }, x);                 // több részből álló test
  const fill = (m, tone, polys, x) => Object.assign({ t:'path', m, tone, line:false, d:true, p:pathOf(polys) }, x);   // tónus-lap / dísz
  const shine = (polys, o = 0.7) => fill('paper', 'light', polys, { o });
  const dots = (list, r = 0.8, n = 6) => list.map(([x, y, rr]) => ellipse(x, y, rr || r, (rr || r) * 0.85, n));

  // ---- beillesztés: középre tolás (a megdöntött befoglaló alapján) + kicsinyítés, hogy a döntve is 8–92-be férjen ----
  const ptsOf = s => s.pts ? s.pts : s.t === 'path' ? (s.p.match(/-?\d*\.?\d+/g) || []).map(Number).reduce((o, v, i, a) => (i % 2 ? o : o.concat([[v, a[i + 1]]])), []) : [];
  function shift(s, dx, dy){
    const mv = p => [Math.round((p[0] + dx) * 10) / 10, Math.round((p[1] + dy) * 10) / 10];
    if(s.pts) s.pts = s.pts.map(mv);
    else if(s.t === 'path'){ let i = 0; s.p = s.p.replace(/-?\d*\.?\d+/g, v => String(Math.round((Number(v) + (i++ % 2 ? dy : dx)) * 10) / 10)); }
  }
  function add(name, meta){
    const t = rad(meta.tilt || 0), c = cos(t), s = sin(t);
    meta.shapes = meta.shapes.filter(sh => sh.t !== 'path' || /\S/.test(sh.p));   // üres (láthatatlan) útvonal ne kerüljön be
    const sil = meta.shapes.filter(sh => !sh.d);
    const rot = ([x, y]) => [(x - 50) * c - (y - 50) * s, (x - 50) * s + (y - 50) * c];
    let U = sil.flatMap(sh => ptsOf(sh).map(rot)), us = U.map(u => u[0]), vs = U.map(u => u[1]);
    const mu = (max(...us) + min(...us)) / 2, mv = (max(...vs) + min(...vs)) / 2;
    for(const sh of meta.shapes) shift(sh, -(mu * c + mv * s), -(-mu * s + mv * c));   // a megdöntött középpont visszaforgatva
    U = sil.flatMap(sh => ptsOf(sh).map(rot)); const dev = max(...U.map(u => max(abs(u[0]), abs(u[1]))));
    let bx = [1e9, 1e9, -1e9, -1e9];
    for(const sh of sil){ const b = ART.bbox(sh); bx = [min(bx[0], b[0]), min(bx[1], b[1]), max(bx[2], b[0] + b[2]), max(bx[3], b[1] + b[3])]; }
    const k = min(1, 42 / dev, 46 / max(50 - bx[0], bx[2] - 50, 50 - bx[1]), 42.5 / (bx[3] - 50));
    ART.add(name, Object.assign({ emoji:[], shadow:'hard' }, meta, { scale:floor(k * 100) / 100 }));
  }

  // ======================================================================
  //  JÉGKRÉM – ostyatölcsér rácsmintával, benne két gombóc: alul vanília (fodros szélű, vaníliaszem-pöttyökkel),
  //  felül eper (eperdarabokkal); a tölcsér és a fodros gombóc teszi jégkrémmé, egy jégkristály a hideget jelzi
  // ======================================================================
  {
    const TILT = 10, L = lightFor(TILT), CH = 11, CR = 2.9;                     // tölcsér: 11 cm magas, a szája 5,8 cm
    const P = camera({ az:0, el:14, tilt:TILT, span:84, fit:[[-3.7, 0, 0], [3.7, 0, 0], [0, 0, 0], [0, 19.4, 0], [-3.7, 12.8, 0], [3.7, 12.8, 0]] }), k = P.k;
    const cone = Lathe(P, [[0.35, 0], [CR, CH]]), rr = y => 0.35 + (CR - 0.35) * y / CH, on = (th, y) => cone.ring(rr(y) + 0.02, y, th);
    const grid = [];                                                            // ostya-rács: két irányban csavarodó vonalak a kúp felszínén
    for(const s of [1, -1]) for(let c0 = -200; c0 <= 200; c0 += 40){
      const pts = []; for(let j = 0; j <= 8; j++){ const y = 0.8 + (CH - 1) * j / 8, th = c0 + s * 11 * y; if(abs(th) < 80) pts.push(on(th, y)); else if(pts.length) break; }
      if(pts.length > 1) grid.push(band(pts, 1.1, false));
    }
    const ruff = (a, n) => th => 1 + (sin(rad(th)) > 0 ? a * cos(rad(n * th)) * sin(rad(th)) : 0);   // fodros alsó szél
    const vc = P([0, CH + 1.5, 0]), sc = P([0, CH + 5.3, 0]);
    const V = Blob({ cx:vc[0], cy:vc[1], rx:3.6 * k, ry:3.0 * k, f:ruff(0.07, 9) });
    const S = Blob({ cx:sc[0], cy:sc[1], rx:3.1 * k, ry:2.85 * k, f:ruff(0.05, 8) });
    const rnd = seeded(11);
    const vSpeck = Array.from({ length:9 }, (_, i) => V.at(25 + i * 15 + rnd() * 6, 0.55 + 0.3 * rnd()));
    const bits = [[-120, 0.55], [-60, 0.62], [-10, 0.45], [40, 0.7], [100, 0.5], [150, 0.68], [-170, 0.3], [70, 0.25]].map(([a, r0]) => ellipse(...S.at(a, r0), 1.3 + 0.4 * rnd(), 0.95, 6, rnd() * 180));
    add('f_jegkrem', { hu:'Jégkrém', en:'waffle ice cream cone with a vanilla scoop and a strawberry scoop on top', tilt:TILT, shapes:[
      body('cardboard', 'base', cone.sil(10)),                                   // ostyatölcsér
      fill('cardboard', 'light', [cone.strip(-88, -42)]),
      fill('cardboard', 'dark', [cone.strip(30, 88)]),
      fill('wood', 'dark', grid, { o:0.8 }),                                      // rácsminta
      body('cream', 'base', V.sil(44)),                                           // vanília gombóc
      fill('cream', 'light', V.tone(L, TONE.light)),
      fill('cream', 'dark', V.tone(L, TONE.dark)),
      fill('wood', 'dark', dots(vSpeck, 0.5), { o:0.7 }),                        // vaníliaszemek
      body('pink', 'base', S.sil(40)),                                            // eper gombóc
      fill('pink', 'light', S.tone(L, TONE.light)),
      fill('pink', 'dark', S.tone(L, TONE.dark)),
      fill('berry', 'base', bits, { o:0.85 }),                                    // eperdarabok
      fill('white', 'light', flake(...S.at(-35, 0.58), 2.4, 0.9)),                 // jégkristály
      shine([ellipse(...S.at(-145, 0.62), 2.2, 1.3, 8, -35), ellipse(...V.at(-172, 0.78), 1.6, 1.0, 6, -70)], 0.8),
    ]});
  }

  // ======================================================================
  //  FAGYASZTOTT ZÖLDSÉGKEVERÉK – párnás műanyag zacskó (valódi méretből vetítve) bordázott hegesztéssel felül és alul,
  //  elöl átlátszó ablak: zöldborsó, kukoricaszem, répakocka; fölötte fehér hópehely-jel, a sarkokon dér. Felirat nincs.
  // ======================================================================
  {
    const TILT = -10, X = 9, H = 25, Z = 1.8, Y0 = 1.5, Y1 = H - 2.8, N = 10;    // 18 × 25 cm, középen 3,6 cm vastag
    const fit = []; for(const x of [-X - 0.3, X + 0.3]) for(const y of [0, H]) for(const z of [-Z, Z]) fit.push([x, y, z]);
    const P = camera({ az:22, el:12, F:90, tilt:TILT, span:80, fit }), k = P.k;
    const F = ([u, v], z = Z) => P([u, v, z]);
    const ts = Array.from({ length:N + 1 }, (_, i) => i / N);
    const eL = ts.map(t => [-X + 0.7 * sin(PI * t), Y0 + (Y1 - Y0) * t]), eT = ts.slice(1).map(t => [-X + 2 * X * t, Y1 - 0.5 * sin(PI * t)]);
    const eR = ts.slice(1).map(t => [X - 0.7 * sin(PI * t), Y1 - (Y1 - Y0) * t]), eB = ts.slice(1, -1).map(t => [X - 2 * X * t, Y0 + 0.4 * sin(PI * t)]);
    const front = [...eL, ...eT, ...eR, ...eB].map(p => F(p));
    const thick = v => Z - 2 * Z * sin(PI * (v - Y0) / (Y1 - Y0)) ** 0.5;      // a párnás zacskó oldala a végein elvékonyodik
    const side = [...eR.map(p => F(p)), ...eR.slice(1, -1).reverse().map(p => F(p, thick(p[1])))];
    const seal = (v0, v1) => [[-X - 0.3, v0], [X + 0.3, v0], [X + 0.3, v1], [-X - 0.3, v1]].map(p => F(p, Z * 0.55));
    const crimp = Array.from({ length:15 }, (_, i) => -X + 0.8 + i * (2 * X - 1.6) / 14).map(u => band([F([u, Y1 + 0.5], Z * 0.55), F([u, H - 0.5], Z * 0.55)], 0.55, false));
    const rnd = seeded(5), WU = 6.2, WV0 = 3.4, WV1 = 14, RC = 1.8;            // ablak: 12,4 × 10,6 cm, lekerekített sarkok
    const win = [[WU - RC, WV0 + RC, -90], [WU - RC, WV1 - RC, 0], [-WU + RC, WV1 - RC, 90], [-WU + RC, WV0 + RC, 180]].flatMap(([u, v, a0]) => [0, 30, 60, 90].map(t => F([u + RC * cos(rad(a0 + t)), v + RC * sin(rad(a0 + t))])));
    const pieces = { pea:[], corn:[], carrot:[] }, kinds = ['pea', 'carrot', 'pea', 'corn', 'pea', 'corn', 'carrot'];
    for(let i = 0; i < 5; i++) for(let j = 0; j < 4; j++){
      const u = -WU + 1.5 + i * (2 * WU - 3) / 4 + (rnd() - 0.5) * 0.9, v = WV0 + 1.5 + j * (WV1 - WV0 - 3) / 3 + (rnd() - 0.5) * 0.9, kind = kinds[(i * 3 + j * 2) % 7], a = rnd() * 90;
      if(kind === 'pea') pieces.pea.push(ellipse(...F([u, v]), 0.95 * k, 0.9 * k, 8));
      else { const s = kind === 'corn' ? 0.7 : 0.95; pieces[kind].push([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([p, q]) => F([u + s * (p * cos(rad(a)) - q * sin(rad(a))), v + s * (p * sin(rad(a)) + q * cos(rad(a))) * (kind === 'corn' ? 1.15 : 1)]))); }
    }
    const c = F([0, (Y0 + Y1) / 2]);
    add('f_fagyzoldseg', { hu:'Fagyasztott zöldségkeverék', en:'frosty plastic bag of frozen mixed vegetables with a clear window showing peas, corn and carrot cubes', tilt:TILT, shapes:[
      body('leaf', 'dark', side),                                                 // a zacskó oldala (vastagsága)
      fill('leaf', 'line', [[...eR.slice(1, -1).map(p => F(p, thick(p[1]) * 0.92)), ...eR.slice(1, -1).reverse().map(p => F(p, thick(p[1]) * 0.35))]], { o:0.45 }),   // legsötétebb élsáv
      body('leaf', 'dark', seal(0, Y0 + 0.3)),                                    // alsó hegesztés
      body('leaf', 'dark', seal(Y1 - 0.3, H)),                                    // felső hegesztés
      fill('leaf', 'line', crimp, { o:0.45 }),                                    // bordázás
      body('leaf', 'base', front),                                                // eleje
      fill('leaf', 'light', [[...eL.slice(1, -1).map(p => F([p[0] + 0.5, p[1]])), ...eL.slice(1, -1).reverse().map(p => F([p[0] + 3.6 - 1.4 * sin(PI * (p[1] - Y0) / (Y1 - Y0)), p[1]]))]]),
      body('glass', 'light', win),                                                // átlátszó ablak
      fill('leaf', 'light', pieces.pea),                                          // zöldborsó
      fill('white', 'light', pieces.pea.map(q => shrink(q, 0.62, lerp(mid(q), q[5], 0.45))), { o:0.8 }),   // a borsó fénye
      fill('honey', 'base', pieces.corn),                                         // kukorica
      fill('orange', 'base', pieces.carrot),                                      // répakocka
      fill('white', 'light', flake(...F([-3.4, 18.4]), 2.5 * k, 1.2, true)),      // hópehely-jel (fagyasztott)
      fill('sky', 'light', [rime(eL.slice(6).concat(eT.slice(0, 4)).map(p => F(p)), c, 4.2, 1, 11), rime(eR.slice(7).concat(eB.slice(0, 3)).map(p => F(p)), c, 3.4, 2, 11)], { o:0.95 }),   // dér a sarkokon
      shine([[F([-WU + 1, WV1 - 0.8]), F([-WU + 4.2, WV1 - 0.8]), F([-WU + 1.8, WV0 + 4]), F([-WU + 1, WV0 + 4])], [F([-X + 1.4, Y1 - 1.6]), F([-X + 2.2, Y1 - 1.6]), F([-X + 2.2, WV1 + 1.2]), F([-X + 1.4, WV1 + 1.2])]], 0.75),
    ]});
  }

  // ======================================================================
  //  FAGYASZTOTT MÁLNA – átlátszó műanyag doboz (valódi méretből vetítve), púpozva deres málnával és két áfonyával;
  //  a málna szemcsés (apró világos bogyócskák), a szemeken fehér dér, a doboz peremén zúzmara
  // ======================================================================
  {
    const TILT = -10, W = 6.2, D = 4.6, H = 4.4, BR = 1.45;                    // 12,4 × 9,2 × 4,4 cm doboz, ~2,9 cm-es szemek (kissé nagyítva)
    const fit = []; for(const x of [-W, W]) for(const y of [0, H + 1.6]) for(const z of [-D, D]) fit.push([x, y, z]);
    const P = camera({ az:28, el:36, F:70, tilt:TILT, span:80, fit }), k = P.k, b = box(P, -W, W, 0, H, -D, D);
    const berry = ([x, y, z]) => { const c = P([x, y, z]); return { c, r:BR * k }; };
    const back = [[-3.5, H + 0.4, -2.3], [-0.3, H + 0.7, -2.6], [2.9, H + 0.5, -2.0]].map(berry);
    const front = [[-2.1, H + 0.3, 0.9], [1.3, H + 0.4, 0.6], [4.2, H, 1.7]].map(berry);
    const blue = [[-4.5, H - 0.3, 2.4], [-0.9, H - 0.4, 3.3]].map(berry).map(o => ({ c:o.c, r:o.r * 0.7 }));
    const rimS = b => Array.from({ length:16 }, (_, i) => { const a = rad(i * 22.5), q = i % 2 ? 0.9 : 1; return [b.c[0] + b.r * q * cos(a), b.c[1] + b.r * 1.06 * q * sin(a)]; }), baseS = b => ellipse(b.c[0] - b.r * 0.12, b.c[1] - b.r * 0.12, b.r * 0.78, b.r * 0.82, 10);
    const inside = (p, list) => list.some(o => hypot(p[0] - o.c[0], p[1] - o.c[1]) < o.r * 1.02);
    const grains = o => [[0, 0], ...[30, 90, 150, 210, 270, 330].map(a => [0.52 * cos(rad(a)), 0.54 * sin(rad(a))])]   // bogyócskák hatszög-rendben
      .map(([u, v]) => [o.c[0] + (u - 0.06) * o.r, o.c[1] + (v - 0.05) * o.r, 0.23 * o.r]);
    const drupe = [...back.flatMap(grains).filter(p => !inside(p, [...front, ...blue])), ...front.flatMap(grains).filter(p => !inside(p, blue))];
    const rnd = seeded(3), rimeDots = [...back, ...front].map(o => { const a = rad(-150 + 100 * rnd()); return [o.c[0] + o.r * 0.6 * cos(a), o.c[1] + o.r * 0.6 * sin(a), 0.34 * o.r]; });
    // a doboz alsó része is tele van szemekkel: a falon át látszó, hullámos tetejű bogyó-tömeg
    const bump = (u, n) => 0.8 * H + 0.7 * abs(sin(PI * u * n));
    const mass = [P([-W + 0.3, 0.3, D]), P([W - 0.3, 0.3, D]), P([W - 0.3, 0.3, -D + 0.3]),
      ...Array.from({ length:9 }, (_, i) => { const t = i / 8; return P([W - 0.3, bump(t, 2.5), -D + 0.3 + (2 * D - 0.3) * t]); }),
      ...Array.from({ length:13 }, (_, i) => { const t = i / 12; return P([W - 0.3 - (2 * W - 0.6) * t, bump(t, 4), D]); })];
    const c = mid(b.front);
    add('f_fagymalna', { hu:'Fagyasztott málna', en:'clear plastic box heaped with frosty frozen raspberries and two blueberries', tilt:TILT, shapes:[
      body('glass', 'base', b.sil),                                               // doboz
      fill('glass', 'dark', [shrink(b.top, 0.04)]),                               // a doboz belseje
      fill('glass', 'light', [band([b.top[2], b.top[3]], 1.2, false)]),            // hátsó perem
      fill('red', 'dark', [mass]),                                                // alsó réteg a falon át
      bodyP('red', 'dark', back.map(rimS)),                                       // málna, hátsó sor
      fill('red', 'base', back.map(baseS)),
      bodyP('red', 'dark', front.map(rimS)),                                      // málna, első sor
      fill('red', 'base', front.map(baseS)),
      fill('red', 'light', dots(drupe), { o:0.9 }),                                // apró bogyócskák
      bodyP('blue', 'base', blue.map(rimS)),                                      // áfonya
      fill('blue', 'light', blue.map(o => ellipse(o.c[0] - o.r * 0.3, o.c[1] - o.r * 0.32, o.r * 0.4, o.r * 0.3, 8, -30))),
      fill('white', 'light', dots(rimeDots, 0.8, 5), { o:0.95 }),                          // dér a szemeken
      fill('glass', 'base', [b.front], { o:0.38 }),                               // átlátszó elülső fal
      fill('glass', 'dark', [b.right], { o:0.45 }),                               // oldalfal
      fill('glass', 'light', [band([b.top[3], b.top[0], b.top[1], b.top[2]], 1.2, false)]),   // perem (a közeli élek; a hátsó él a szemek mögött)
      fill('white', 'light', [rime([lerp(b.front[3], b.front[0], 0.75), b.front[3], lerp(b.front[3], b.front[2], 0.4)], c, 3.4, 3, 11), rime([lerp(b.right[1], b.right[2], 0.2), b.right[2], lerp(b.right[2], b.right[3], 0.55)], mid(b.right), 3.0, 4, 11)]),   // zúzmara
      fill('white', 'light', flake(...lerp(b.front[1], b.front[3], 0.62), 1.8, 0.9)),   // jégkristály a falon
      shine([shrink([lerp(b.front[0], b.front[1], 0.08), lerp(b.front[0], b.front[1], 0.16), lerp(b.front[3], b.front[2], 0.16), lerp(b.front[3], b.front[2], 0.08)], 0.12)], 0.75),
    ]});
  }

  // ======================================================================
  //  HALRÚD – kék, lapos fagyasztós doboz (elején fehér hal- és hópehely-jel), a tetején három aranyló, panírozott hasáb;
  //  az elsőnek levágott végén fehér halhús látszik – ettől halrúd és nem rántott hús vagy kenyér; dér a doboz sarkain
  // ======================================================================
  {
    const TILT = -12, W = 9, D = 5.5, H = 3, SH = 1.5;                         // doboz 18 × 11 × 3 cm, rúd 9,5 × 2,4 × 1,5 cm
    const fit = []; for(const x of [-W, W]) for(const y of [0, H + SH]) for(const z of [-D, D]) fit.push([x, y, z]);
    const P = camera({ az:30, el:34, F:80, tilt:TILT, span:80, fit }), k = P.k, b = box(P, -W, W, 0, H, -D, D);
    const Fr = ([u, v]) => P([u, v, D + 0.02]);
    const sticks = [[-1.4, -2.9, 4.75, -5], [0.9, 0.0, 4.75, 4], [-1.6, 3.1, 3.2, -3]].map(([x, z, hx, a]) => sbox(P, x, z, hx, 1.2, H, H + SH, a));
    const fish = [...Array.from({ length:9 }, (_, i) => { const t = i / 8; return [1.6 - 5.2 * t, 1.5 + 0.95 * sin(PI * t) ** 0.8]; }), [-4.4, 2.5], [-4.0, 1.5], [-4.4, 0.5],
      ...Array.from({ length:8 }, (_, i) => { const t = 1 - (i + 1) / 8; return [1.6 - 5.2 * t, 1.5 - 0.85 * sin(PI * t) ** 0.8]; })].map(Fr);
    const rnd = seeded(9), crumbs = sticks.flatMap(s => Array.from({ length:7 }, () => { const p = lerp(lerp(s.top[0], s.top[1], 0.08 + 0.84 * rnd()), lerp(s.top[3], s.top[2], 0.08 + 0.84 * rnd()), 0.2 + 0.6 * rnd()); return [p[0], p[1], 0.42]; }));
    const frostDots = sticks.flatMap(s => [0.2, 0.55, 0.85].map(t => { const p = lerp(lerp(s.top[3], s.top[2], t), lerp(s.top[0], s.top[1], t), 0.25 + 0.2 * rnd()); return [p[0], p[1], 0.75]; }));
    const stick = s => [body('orange', 'base', s.sil), fill('gold', 'base', [shrink(s.top, 0.03)]), fill('orange', 'dark', [shrink(s.right, 0.06)])];
    add('f_halrud', { hu:'Halrúd', en:'three golden breaded frozen fish fingers on a blue freezer box with a white fish symbol, one cut showing white fish', tilt:TILT, shapes:[
      body('blue', 'base', b.front),                                              // doboz eleje
      body('blue', 'dark', b.right),                                              // oldala
      body('blue', 'light', b.top),                                               // teteje
      fill('white', 'light', [fish]),                                             // hal-jel
      fill('white', 'light', flake(...Fr([5.6, 1.5]), 1.1 * k, 0.9, true)),       // hópehely-jel
      fill('sky', 'light', [rime([lerp(b.top[0], b.top[3], 0.45), b.top[0], lerp(b.top[0], b.top[1], 0.3)], mid(b.top), 2.6, 5), rime([lerp(b.right[2], b.right[1], 0.6), b.right[2], lerp(b.right[2], b.right[3], 0.4)], mid(b.right), 1.6, 6)], { o:0.95 }),
      ...stick(sticks[0]),
      ...stick(sticks[1]),
      ...stick(sticks[2]),
      fill('cream', 'light', [shrink(sticks[2].right, 0.3)]),                     // levágott vég: fehér halhús
      fill('orange', 'dark', dots(crumbs, 0.42), { o:0.6 }),                      // panír-morzsa
      fill('white', 'light', dots(frostDots), { o:0.9 }),                         // dér a rudakon
      shine([[Fr([-W + 0.7, H - 0.45]), Fr([-W + 4.6, H - 0.45]), Fr([-W + 4.6, H - 0.95]), Fr([-W + 0.7, H - 0.95])]], 0.6),
    ]});
  }

  // ======================================================================
  //  JÉGKOCKA – türkiz jégkocka-tartó 2 × 4 rekesszel, mindben áttetsző kék-fehér jégkocka (világos tető, fényfolt,
  //  sötét első perem), előtte két kiesett kocka; dér a tartó sarkain – a rekeszes tartó különbözteti meg a sima jégkockától
  // ======================================================================
  {
    const TILT = -12, X = 11.5, Z = 4.8, H = 2.4, CW = 4.65, CD = 3.4, GAP = 0.8, CS = 1.35;   // tartó 23 × 9,6 × 2,4 cm, kocka 2,7 cm
    const loose = [[5.4, 8.0, 18], [9.6, 7.2, -22]];
    const fit = []; for(const x of [-X, X]) for(const y of [0, H]) for(const z of [-Z, Z]) fit.push([x, y, z]);
    for(const [x, z] of loose) for(const s of [-1, 1]) fit.push([x + s * 2, 0, z + s * 2], [x, 2 * CS, z]);
    const P = camera({ az:24, el:44, F:80, tilt:TILT, span:82, fit }), b = box(P, -X, X, 0, H, -Z, Z);
    const cells = [], tops = [], hi = [], lo = [];
    for(let i = 0; i < 4; i++) for(let j = 0; j < 2; j++){
      const x0 = -X + 1 + i * (CW + GAP), x1 = x0 + CW, z0 = -Z + 1 + j * (CD + GAP), z1 = z0 + CD, y = H - 0.05, q = (x, z) => P([x, y, z]);
      cells.push([q(x0, z1), q(x1, z1), q(x1, z0), q(x0, z0)]);
      tops.push([q(x0 + 0.5, z1 - 0.7), q(x1 - 0.7, z1 - 0.7), q(x1 - 0.7, z0 + 0.5), q(x0 + 0.5, z0 + 0.5)]);
      hi.push([q(x0 + 0.7, z0 + 0.7), q(x0 + 2.3, z0 + 0.7), q(x0 + 0.7, z0 + 1.9)]);
      lo.push([q(x0, z1), q(x1, z1), q(x1, z0), q(x1 - 0.7, z0 + 0.5), q(x1 - 0.7, z1 - 0.7), q(x0 + 0.5, z1 - 0.7)]);
    }
    const cubes = loose.map(([x, z, a]) => sbox(P, x, z, CS, CS, 0, 2 * CS, a));
    const c = mid(b.top);
    add('f_jegkocka', { hu:'Jégkocka', en:'teal ice cube tray with eight compartments of clear blue-white ice cubes and two loose ice cubes', tilt:TILT, shapes:[
      body('teal', 'base', b.front),                                              // tartó eleje
      body('teal', 'dark', b.right),                                              // oldala
      body('teal', 'light', b.top),                                               // teteje (rekesz-falak)
      fill('sky', 'base', cells),                                                 // jég a rekeszekben
      fill('glass', 'light', tops),                                               // a jég teteje
      fill('sky', 'dark', lo, { o:0.8 }),                                          // a rekesz első és jobb fala (árnyék)
      fill('white', 'light', hi, { o:0.95 }),                                     // fényfolt
      fill('white', 'light', [rime([lerp(b.top[3], b.top[0], 0.5), b.top[3], lerp(b.top[3], b.top[2], 0.22)], c, 3.0, 7, 11), rime([lerp(b.top[0], b.top[1], 0.8), b.top[1], lerp(b.top[1], b.top[2], 0.7)], c, 2.6, 8, 11)], { o:0.95 }),   // dér a sarkokon
      bodyP('sky', 'base', cubes.map(q => q.sil)),                                // kiesett kockák
      fill('sky', 'light', cubes.map(q => shrink(q.top, 0.04))),
      fill('sky', 'dark', cubes.map(q => shrink(q.right, 0.06))),
      shine(cubes.map(({ front:f }) => shrink([lerp(f[0], f[1], 0.18), lerp(f[0], f[1], 0.32), lerp(f[3], f[2], 0.32), lerp(f[3], f[2], 0.18)], 0.15)), 0.8),
      fill('white', 'light', flake(...lerp(b.front[0], b.front[2], 0.5), 1.6, 0.9)),   // jégkristály
    ]});
  }

  // ======================================================================
  //  MIRELIT PIZZA – kerek pizza (valódi méretből vetítve) halvány kék fagyasztós doboz-alján: peremes tészta, paradicsomszósz,
  //  sajt, szalámi, zöldfűszer; a fóliát fénycsík, a fagyot fehér dér-pöttyök és a doboz sarkain zúzmara jelzi. Felirat nincs.
  // ======================================================================
  {
    const TILT = 8, BW = 14, BH = 1.0, PR = 12.6;                              // doboz-alj 28 × 28 cm, pizza 25 cm átmérő
    const fit = []; for(const x of [-BW, BW]) for(const y of [0, BH + 2]) for(const z of [-BW, BW]) fit.push([x, y, z]);
    const P = camera({ az:18, el:40, F:120, tilt:TILT, span:84, fit }), k = P.k, b = box(P, -BW, BW, 0, BH, -BW, BW);
    const Y = BH, rings = [[PR - 0.3, Y], [PR, Y + 0.35], [PR, Y + 1.1], [PR - 0.5, Y + 1.55], [PR - 1.4, Y + 1.5], [PR - 1.8, Y + 1.15]];
    const Lz = Lathe(P, rings), pz = hull(rings.flatMap(([r, y]) => Lz.top(r, y, 28)));
    const flat = (r, th, y = Y + 1.2) => P([r * sin(rad(th)), y, r * cos(rad(th))]);
    const cheese = Array.from({ length:36 }, (_, i) => { const th = i * 10; return flat(9.6 + 0.8 * sin(rad(5 * th + 40)) + 0.45 * sin(rad(11 * th)), th, Y + 1.3); });
    const sal = [[5.6, 20], [6.2, 95], [5.8, 170], [6.0, 250], [6.4, 320], [0.6, 0]].map(([r, th]) => { const c0 = flat(r, th, Y + 1.4); return ellipse(c0[0], c0[1], 2.0 * k, 2.0 * k * 0.8, 12); });
    const rnd = seeded(21), fat = sal.flatMap(s => { const c0 = mid(s); return [0, 1, 2].map(() => [c0[0] + (rnd() - 0.5) * 2.2 * k, c0[1] + (rnd() - 0.5) * 1.4 * k, 0.32 * k]); });
    const herbs = Array.from({ length:10 }, (_, i) => { const p = flat(2.5 + 6.5 * rnd(), i * 36 + 18 * rnd(), Y + 1.45); return ellipse(p[0], p[1], 0.65 * k, 0.32 * k, 6, rnd() * 180); });
    const ice = Array.from({ length:16 }, (_, i) => { const p = flat(1.5 + 9.8 * sqrt(rnd()), i * 22.5 + 12 * rnd(), Y + 1.5); return [p[0], p[1], (0.22 + 0.16 * rnd()) * k]; });
    const crustRime = rime(Array.from({ length:9 }, (_, i) => Lz.ring(PR - 0.6, Y + 1.5, -150 + i * 12)), flat(0, 0), 1.8, 9);
    add('f_pizza', { hu:'Mirelit pizza', en:'frozen salami pizza on a pale blue freezer box base, with frost specks and frosty box corners', tilt:TILT, shapes:[
      body('sky', 'base', b.front),                                               // doboz-alj eleje
      body('sky', 'dark', b.right),                                               // oldala
      body('sky', 'light', b.top),                                                // teteje
      fill('white', 'light', [rime([lerp(b.top[0], b.top[3], 0.28), b.top[0], lerp(b.top[0], b.top[1], 0.2)], mid(b.top), 3.4, 10), rime([lerp(b.top[1], b.top[0], 0.22), b.top[1], lerp(b.top[1], b.top[2], 0.3)], mid(b.top), 3.0, 11), rime([lerp(b.top[3], b.top[0], 0.2), b.top[3], lerp(b.top[3], b.top[2], 0.25)], mid(b.top), 2.6, 12)], { o:0.9 }),   // zúzmara a sarkokon
      body('cardboard', 'base', pz),                                              // tészta
      fill('cardboard', 'dark', [Lz.strip(-30, 92, 0, 2)]),                        // a perem árnyékos oldala
      fill('cardboard', 'light', [Lz.top(PR - 0.45, Y + 1.5, 28)]),                // perem teteje
      fill('tomato', 'base', [Lz.top(PR - 1.9, Y + 1.2, 28)]),                     // paradicsomszósz
      fill('honey', 'light', [cheese]),                                           // sajt
      fill('red', 'base', sal),                                                   // szalámi
      fill('blossom', 'light', dots(fat), { o:0.9 }),                             // szalámi-zsír
      fill('leaf', 'base', herbs),                                                // zöldfűszer
      fill('sky', 'light', [crustRime], { o:0.9 }),                               // dér a peremen
      fill('white', 'light', dots(ice), { o:0.9 }),                               // dér-pöttyök
      fill('white', 'light', flake(...lerp(b.top[1], mid(b.top), 0.12), 1.6, 0.9)),   // jégkristály
      shine([band(Array.from({ length:7 }, (_, i) => Lz.ring(PR - 2.6, Y + 1.5, -168 + i * 13)), t => 0.6 + 1.8 * sin(PI * t), false)], 0.8),   // a fólia fénye
    ]});
  }
})();
});
