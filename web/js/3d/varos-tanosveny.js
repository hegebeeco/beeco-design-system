// ============================================================
//  MÉHESD – TANÖSVÉNY (B szint: docs/rajzolas.md) – a „Ha eltűnne a méh…” játék épülete a városban. A VAROS_MODELS-be kerül.
//
//  natureTrail   Kis szabadtéri tanösvény dioráma-léptékben: füves telek, rajta elölről (+Z) hátrafelé kanyargó, világos
//                murvás gyalogút; az út jobb oldalán alacsony, kétléces fa korlát választja el a kaszálatlan vadvirágos
//                rétfolttól (fűcsomók, lila, sárga és fehér virágok); elöl balra fedett, két lábon álló fa ismertető tábla
//                (ÜRES tábla – felirat, logó nincs); hátul jobbra rovarhotel karón (nyeregtető, fúrt lyukak); hátul balra
//                egy pad az út felé fordulva. Alap 1,4 × 1,0 (x × z), a legmagasabb pont (a tábla teteje) ≈ 0,5.
//                8 szín: grass:1 (telek, a rétfolt fűcsomói), cardboard:0 (murva), wood:2 (minden faszerkezet), white:1 (táblalap, fehér virág),
//                dark:2 (a rovarhotel lyukai), leaf:1 (rétfolt, szárak, fűcsomók), purple:1 és honey:1 (virágok). ≈ 1000 háromszög.
//
//  Tengelyek, lépték: mint a varos-modellek.js-ben (Y fel, talp y = 0, origó = közép, eleje +Z; 1 egység ≈ 25 m, dioráma-léptékben).
//  Betöltési sorrend: 3d/elokert-modellek.js és 3d/varos-modellek.js UTÁN (a segédeiket használja). Node-ban require is elég.
// ============================================================
(function(root){
  const EK = root.EK_MODELS || (typeof require === 'function' ? require('./elokert-modellek.js') : null);
  const VM = root.VAROS_MODELS || (typeof require === 'function' ? require('./varos-modellek.js') : null);
  const { rng, blob, rod, flat } = EK._h, { tuft } = VM._h;
  const LAY = [-90, 0, 0];                                                        // a flat() sokszögét a talajra fekteti

  // sima görbe a pontokon át (Catmull–Rom), XZ síkban: pts = [[x, z], …] → n pont szakaszonként
  function spline(pts, n){
    const out = [], P = i => pts[Math.max(0, Math.min(pts.length - 1, i))];
    for(let i = 0; i < pts.length - 1; i++) for(let j = 0; j < n; j++){ const t = j / n, a = P(i - 1), b = P(i), c = P(i + 1), d = P(i + 2);
      out.push([0, 1].map(k => 0.5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t * t * t))); }
    out.push(pts[pts.length - 1]); return out;
  }
  // a középvonal két oldalára d távolságra eltolt pontsor (d > 0: a haladási iránytól jobbra)
  function offset(line, d){
    return line.map((p, i) => { const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
      return [p[0] - dz / l * d, p[1] + dx / l * d]; });
  }
  // kis nyeregtető két lapból (a gerinc az X mentén, y = a gerinc magassága)
  function smallRoof(m, K, W, D, y, color){
    const a = 28, run = D / 2, L = run / Math.cos(a * Math.PI / 180) + 0.02;
    for(const sz of [-1, 1]) m.add(K.box(W, 0.016, L), { color, r:[sz * a, 0, 0], t:[0, y - run / 2 * Math.tan(a * Math.PI / 180), sz * run / 2] });
  }

  function natureTrail(K){
    const m = K.model(), R = rng(97);
    m.add(K.chamferBox(1.4, 0.04, 1.0, 0.015), { color:'grass:1', t:[0, 0.02, 0] });                              // füves telek

    // MURVÁS ÚT: elölről (+Z) kanyarogva hátra-jobbra; 0,15 széles szalag, alig kiemelve
    const mid = spline([[-0.08, 0.47], [0.0, 0.3], [-0.14, 0.08], [-0.06, -0.14], [0.14, -0.3], [0.22, -0.465]], 3);
    m.add(flat(K, [...offset(mid, 0.075), ...offset(mid, -0.075).reverse()], 0.012), { color:'cardboard:0', r:LAY, t:[0, 0.046, 0] });

    // KORLÁT az út jobb oldalán (a rét felé): 5 karó, két vízszintes léc
    const rail = offset(mid.slice(0, 9), 0.12);
    const posts = [1, 3, 5, 7, 8].map(i => rail[i]);
    for(const [x, z] of posts) m.add(K.box(0.022, 0.13, 0.022), { color:'wood:2', t:[x, 0.105, z] });
    for(let i = 0; i < posts.length - 1; i++) for(const y of [0.08, 0.14]){ const [a, b] = [posts[i], posts[i + 1]];
      rod(m, K, [a[0], y, a[1]], [b[0], y, b[1]], 0.007, 0.007, 3, 'wood:2'); }

    // KASZÁLATLAN RÉTFOLT a korláton túl (jobb elöl): sötétebb zöld, kissé kiemelt folt, rajta világos fűcsomók és vadvirágok
    const patch = []; for(let i = 0; i < 10; i++){ const a = i / 10 * Math.PI * 2; patch.push([0.42 + Math.cos(a) * (0.24 + (i % 2) * 0.02), 0.26 + Math.sin(a) * (0.2 + (i % 3) * 0.015)]); }
    m.add(flat(K, patch, 0.02), { color:'leaf:1', r:LAY, t:[0, 0.045, 0] });
    const MEAD = [[0.24, 0.38], [0.38, 0.42], [0.54, 0.38], [0.62, 0.26], [0.3, 0.24], [0.46, 0.2], [0.56, 0.12], [0.36, 0.1], [0.22, 0.16]];
    MEAD.forEach(([x, z]) => tuft(m, K, x, z, 0.1 + R() * 0.05, 'grass:1', R, 3));
    const FL = ['purple:1', 'honey:1', 'white:1'];
    [[0.27, 0.32], [0.42, 0.35], [0.56, 0.32], [0.5, 0.16], [0.33, 0.18], [0.62, 0.2], [0.24, 0.24], [0.44, 0.08], [0.4, 0.26], [0.32, 0.4]].forEach(([x, z], i) => {
      const h = 0.13 + R() * 0.05;
      rod(m, K, [x, 0.05, z], [x, h, z], 0.005, 0.004, 3, 'leaf:1');
      m.add(blob(K, 0.034, 300 + i, 6, 0.1), { color:FL[i % 3], t:[x, h + 0.01, z], s:[1, 0.6, 1] }); });

    // ISMERTETŐ TÁBLA elöl balra (az út felé fordítva): két láb, fa keret, üres világos tábla, kis nyeregtető
    const tb = K.model(), ty = 0.3;
    for(const sx of [-1, 1]) tb.add(K.box(0.026, 0.42, 0.026), { color:'wood:2', t:[sx * 0.14, 0.21, 0] });
    tb.add(K.chamferBox(0.3, 0.2, 0.03, 0.008), { color:'wood:2', t:[0, ty, 0] });
    tb.add(K.box(0.26, 0.16, 0.01), { color:'white:1', t:[0, ty, 0.016] });
    smallRoof(tb, K, 0.36, 0.12, 0.49, 'wood:2');
    m.merge(tb, { t:[-0.46, 0.04, 0.3], r:[0, 22, 0] });

    // ROVARHOTEL karón hátul jobbra: test, nyeregtető, a homlokzaton fúrt lyukak (dark:2)
    const rh = K.model();
    rh.add(K.box(0.03, 0.2, 0.03), { color:'wood:2', t:[0, 0.1, 0] });
    rh.add(K.chamferBox(0.16, 0.16, 0.08, 0.01), { color:'wood:2', t:[0, 0.28, 0] });
    smallRoof(rh, K, 0.19, 0.11, 0.405, 'wood:2');
    for(const [x, y] of [[-0.045, 0.32], [0, 0.32], [0.045, 0.32], [-0.045, 0.25], [0.045, 0.25], [0, 0.285], [0, 0.23]])
      rh.add(K.cylinder(0.013, 0.013, 0.01, 5), { color:'dark:2', t:[x, y, 0.038], r:[90, 0, 0] });
    m.merge(rh, { t:[0.48, 0.04, -0.28], r:[0, -35, 0] });

    // PAD hátul balra, az út felé fordulva (háttámla hátul)
    const b = K.model();
    b.add(K.box(0.24, 0.022, 0.07), { color:'wood:2', t:[0, 0.065, 0] });
    b.add(K.box(0.24, 0.05, 0.016), { color:'wood:2', t:[0, 0.11, -0.035], r:[-10, 0, 0] });
    for(const sx of [-1, 1]) b.add(K.box(0.018, 0.065, 0.07), { color:'wood:2', t:[sx * 0.1, 0.033, 0] });
    m.merge(b, { t:[-0.3, 0.04, -0.34], r:[0, 25, 0] });

    // néhány fűcsomó a telek szélén (a korlát és a pad mellett)
    for(const [x, z] of [[-0.6, 0.42], [-0.62, -0.05], [0.62, -0.44]]) tuft(m, K, x, z, 0.08, 'leaf:1', R, 3);
    return m;
  }

  Object.assign(VM, { natureTrail });
  root.VAROS_MODELS = VM;
  if(typeof module !== 'undefined' && module.exports) module.exports = VM;
})(typeof window !== 'undefined' ? window : globalThis);
