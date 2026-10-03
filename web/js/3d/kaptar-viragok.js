// ============================================================
//  MÉHPILÓTA (kaptar / kp) – VIRÁGOK, VESZÉLYEK, VERSENY-KOSZORÚ B szinten (docs/rajzolas.md). A KP_MODELS-be kerülnek.
//
//  Mérték: mint a 3d/kaptar-modellek.js-ben – 1 egység = 1 dm, valódi arányok, Y fel, +Z = eleje.
//  VIRÁGOK (< 600 △): kis növény szárral, levéllel, virággal; az origó a talajon (a hárs és az almavirág ág: az ág tövén).
//    Visszaad: modell + m.bloomY (a fő virág közepének magassága – ide teheted a „nektár-célt”) + m.blooms ([[x, y, z], …] minden virág).
//    opts: { s } nagyítás vagy { h } célmagasság (a legmagasabb pont ennyi lesz) – a bloomY és a blooms vele nagyul.
//    Háziméhnek jó: almavirag, feherhere, facelia, napraforgo, hars, levendula.
//    Inkább poszméhnek (zümmögő beporzás / hosszú párta): paradicsom, lucerna, voroshere, burgonya.
//  VESZÉLYEK: gyurgyalag (RÉSZEK body/wingL/wingR/foot, origó a szárny-zsanér, kitárt szárny), darazs (mint a méh), permetfelho (felhő).
//  KOSZORÚ: virágfüzér-karika verseny-kapunak – az origó a karika KÖZEPE, a karika az XY síkban áll (a méh a Z mentén repül át).
//  Kell előtte: js/art/art.js, js/art/model-kit.js, 3d/kaptar-modellek.js (a segédeit és a KP_SZIN színneveket használja).
// ============================================================
(function(root){
  const KP = root.KP_MODELS || (typeof require === 'function' ? require('./kaptar-modellek.js') : null);
  const { rng, blob, rod, flat, ell, latheOpen, scaled } = KP._h, S = KP.KP_SZIN;
  const rad = d => d * Math.PI / 180;

  // ---- 2D alakzatok (XZ sík, a flat() fekteti le) ----
  // csillag/szirom-korong: n szirom, k pont szirmonként, inner = a szirmok közti bemetszés mélysége (sugár-arány)
  const lobed = (R, n, k, inner, rot) => Array.from({ length:n * k }, (_, i) => { const a = i / (n * k) * Math.PI * 2 + (rot || 0);
    const r = R * (inner + (1 - inner) * Math.pow(Math.abs(Math.cos(n * a / 2 - n * (rot || 0) / 2)), 0.7)); return [Math.sin(a) * r, Math.cos(a) * r]; });
  // levél (a töve az origóban, a csúcsa +Z felé): tojásdad, kissé hegyes
  const oval = (L, w, n) => Array.from({ length:n }, (_, i) => { const t = i / n * Math.PI * 2, u = (1 - Math.cos(t)) / 2;
    return [Math.sin(t) * w / 2 * (1 - 0.35 * u * u), u * L]; });
  // szív alakú levél (napraforgó, hárs)
  const heart = (L, w) => [[0, 0.1], [0.32, -0.04], [0.5, 0.16], [0.46, 0.46], [0.26, 0.76], [0, 1], [-0.26, 0.76], [-0.46, 0.46], [-0.5, 0.16], [-0.32, -0.04]].map(([x, z]) => [x * w, z * L]);
  // szárnyasan szeldelt levél (facélia, paradicsom-levélke): lobes karéj oldalanként
  const pinnate = (L, w, lobes) => { const R = [], Lf = [];
    for(let j = 0; j < lobes; j++){ const z0 = L * (j + 0.35) / (lobes + 0.5), z1 = L * (j + 0.85) / (lobes + 0.5), ww = w / 2 * (1 - j / (lobes + 1.5));
      R.push([w * 0.09, z0], [ww, z1]); Lf.push([-w * 0.09, z0], [-ww, z1]); }
    return [[0, 0], ...R, [0, L], ...Lf.reverse()]; };
  // fehér here-szerű „V” rajzolat a levélkén
  const chevron = (L, w) => [[-w * 0.3, L * 0.35], [0, L * 0.6], [w * 0.3, L * 0.35], [0, L * 0.5]];

  // ---- elhelyezés ----
  // lap (levél, szirom-korong) a pos pontban: up = a csúcs emelése fokban (levél) / tilt = a lap normálisa a függőlegestől, az = irány (0 = +Z)
  const leaf = (m, K, pts, th, color, pos, up, az) => m.add(flat(K, pts, th), { color, t:pos, r:[-90 - up, az, 0] });
  const nrm = (tilt, az) => [Math.sin(rad(tilt)) * Math.sin(rad(az)), Math.cos(rad(tilt)), Math.sin(rad(tilt)) * Math.cos(rad(az))];
  const add3 = (p, n, k) => [p[0] + n[0] * k, p[1] + n[1] * k, p[2] + n[2] * k];
  // virág: szirom-korong (tilt, az irányba néz) + közép; o = { R, n, k, inner, color, center, cr, th }
  function flower(m, K, c, tilt, az, o){
    const n = nrm(tilt, az);
    m.add(flat(K, lobed(o.R, o.n || 5, o.k || 3, o.inner == null ? 0.35 : o.inner, o.rot), o.th || o.R * 0.08), { color:o.color, t:c, r:[-90 + tilt, az, 0] });
    if(o.center) m.add(K.sphere(o.R * (o.cr || 0.26), 5, 3), { color:o.center, t:add3(c, n, o.R * 0.07), s:[1, 0.7, 1], r:[tilt, az, 0] });
    return add3(c, n, o.R * 0.1);
  }
  // hármas levél (here, lucerna) a P pontban: 3 levélke 120°-onként, opcionális V-rajzolattal
  function trefoil(m, K, P, L, w, az0, color, mark){
    for(let i = 0; i < 3; i++){ const az = az0 + i * 120;
      leaf(m, K, oval(L, w, 7), 0.008, color, P, 18, az);
      if(mark) leaf(m, K, chevron(L, w), 0.01, mark, [P[0], P[1] + 0.006, P[2]], 18, az); }
  }
  // a kész virág: bloomY + blooms, { s } / { h } nagyítás
  function done(K, m, blooms, o){
    m.blooms = blooms; m.bloomY = blooms[0][1]; o = o || {};
    let k = o.s || 1;
    if(o.h){ let top = 0; for(const g of m.groups().values()) for(const t of g) for(const p of t) top = Math.max(top, p[1]); k = o.h / top; }
    return scaled(K, m, k);
  }

  // ================= HÁZIMÉHNEK JÓ VIRÁGOK =================
  // ALMAVIRÁG: rövid termőnyárs-ág (a töve az origó), csúcsán bokrétában 4 nyitott fehér, 5 szirmú virág sárga porzóval,
  // egy félig nyílt rózsaszín és két rózsaszín bimbó, alatta levélrozetta. ≈ 2 egység.
  function almavirag(K, o){
    const m = K.model(), C = [0.08, 1.38, 0.08];
    rod(m, K, [0, 0, 0], [0.1, 0.85, 0.04], 0.07, 0.055, 4, 'wood:3');
    rod(m, K, [0.1, 0.85, 0.04], [0.08, 1.25, 0.08], 0.055, 0.045, 4, 'wood:3');
    for(let i = 0; i < 4; i++) leaf(m, K, oval(0.62, 0.3, 6), 0.01, i % 2 ? 'leaf:2' : 'leaf:0', [0.08, 1.2, 0.08], 25 - i * 4, 45 + i * 90);
    const blooms = [];
    [[0, 15, 0.26], [20, 60, 0.3], [140, 62, 0.3], [260, 58, 0.3]].forEach(([az, tilt, d], i) => {
      const n = nrm(tilt * 0.7, az), c = add3([C[0], C[1] + (i ? 0 : 0.2), C[2]], n, d);
      rod(m, K, C, c, 0.014, 0.012, 3, 'grass:3');
      blooms.push(flower(m, K, c, tilt, az, { R:0.2, color:S.almaSzirom, center:'honey:1' })); });
    const c4 = add3(C, nrm(55, 200), 0.24); rod(m, K, C, c4, 0.012, 0.01, 3, 'grass:3');                                     // félig nyílt
    flower(m, K, c4, 55, 200, { R:0.13, inner:0.55, color:'blossom:0', center:'honey:1' });
    for(const az of [80, 320]){ const c = add3(C, nrm(40, az), 0.22); rod(m, K, C, c, 0.01, 0.01, 3, 'grass:3');            // bimbók
      m.add(blob(K, 0.055, 7 + az, 6, 0.1), { color:S.almaBimbo, t:c, s:[1, 1.3, 1] }); }
    return done(K, m, blooms, o);
  }

  // FEHÉR HERE: kúszó szár, két hosszú kocsányon gömbös fehér virágfej (alul barnuló, lekonyuló virágokkal), hármas levelek
  // világos V-rajzolattal. ≈ 1,3 egység.
  function feherhere(K, o){
    const m = K.model();
    rod(m, K, [-0.5, 0.03, -0.05], [0.5, 0.03, 0.1], 0.03, 0.025, 4, 'leaf:3');                                               // inda
    const blooms = [];
    for(const [x, z, h, sd] of [[-0.1, 0, 1.25, 1], [0.25, 0.06, 0.95, 2]]){
      const top = [x + 0.04, h, z + 0.05]; rod(m, K, [x, 0.03, z], top, 0.022, 0.018, 3, 'grass:3');
      m.add(K.sphere(0.14, 7, 4), { color:'white:1', t:[top[0], top[1] + 0.08, top[2]], s:[1, 0.9, 1] });
      for(let i = 0; i < 7; i++){ const a = i / 7 * Math.PI * 2 + sd, p = [top[0] + Math.cos(a) * 0.1, top[1] + 0.08, top[2] + Math.sin(a) * 0.1];   // virágocskák
        rod(m, K, p, [p[0] + Math.cos(a) * 0.085, p[1] - 0.017, p[2] + Math.sin(a) * 0.085], 0.036, 0, 3, 'white:2'); }
      m.add(blob(K, 0.105, 20 + sd, 8, 0.12), { color:'cardboard:3', t:[top[0], top[1] + 0.005, top[2]], s:[1.15, 0.55, 1.15] });   // lekonyuló, barnuló virágok
      blooms.push([top[0], top[1] + 0.11, top[2]]);
    }
    for(const [x, z, h, az, mark] of [[-0.35, 0.05, 0.62, 10, true], [0.42, 0.1, 0.5, 70, true], [0.05, -0.04, 0.7, 200, false]]){
      const P = [x + 0.02, h, z]; rod(m, K, [x, 0.03, z], P, 0.016, 0.012, 3, 'grass:3');
      trefoil(m, K, P, 0.22, 0.18, az, 'leaf:2', mark ? 'sage:2' : null); }
    return done(K, m, blooms, o);
  }

  // FACÉLIA (mézontófű): szőrös szár két oldalággal, szárnyasan szeldelt levelek, az ágak végén csigavonalban begöngyölődő
  // virágzat: kívül nyitott levendulakék virágok, a csiga belsejében sötétebb bimbók. ≈ 5 egység.
  function facelia(K, o){
    const m = K.model(), blooms = [];
    rod(m, K, [0, 0, 0], [0, 3.7, 0], 0.07, 0.05, 4, 'leaf:2');
    rod(m, K, [0, 2.6, 0], [0.55, 3.6, 0.1], 0.04, 0.035, 3, 'leaf:2');
    rod(m, K, [0, 3.0, 0], [-0.5, 3.9, -0.05], 0.04, 0.035, 3, 'leaf:2');
    leaf(m, K, pinnate(1.3, 0.75, 5), 0.012, 'leaf:2', [0, 1.4, 0], 22, 30);
    leaf(m, K, pinnate(1.1, 0.65, 4), 0.012, 'leaf:3', [0, 2.2, 0], 26, 215);
    for(const [S0, az, k] of [[[0, 3.7, 0], 0, 1], [[0.55, 3.6, 0.1], 70, 0.85], [[-0.5, 3.9, -0.05], 250, 0.85]]){
      const h = [Math.cos(rad(az)), 0, -Math.sin(rad(az))], R0 = 0.42 * k, Cc = [S0[0], S0[1] + R0, S0[2]];              // a csiga síkja: h és Y
      for(let i = 0; i < 10; i++){ const u = i / 9, ph = rad(-90 + u * 380), r = R0 * (1 - 0.62 * u);
        const p = [Cc[0] + h[0] * r * Math.cos(ph), Cc[1] + r * Math.sin(ph), Cc[2] + h[2] * r * Math.cos(ph)];
        const open = i < 6;
        m.add(blob(K, (open ? 0.13 : 0.08) * k * (1 - 0.3 * u), 30 + i + az, open ? 8 : 6, 0.15), { color:open ? S.faceliaKek : 'purple:1', t:p });
        if(i === 2) blooms.push(p); }
    }
    return done(K, m, blooms, o);
  }

  // NAPRAFORGÓ: vastag szár, váltakozó szív alakú levelek, a fej kissé előre-lefelé (+Z) néz: zöld hátsó csésze, két sor sárga
  // nyelves virág, barna csöves-virág tányér sötét középpel. ≈ 16 egység (1,6 m).
  function napraforgo(K, o){
    const m = K.model(), H = [0, 15.1, 1.0], tilt = 105, n = nrm(tilt, 0);
    rod(m, K, [0, 0, 0], [0, 14.3, 0.3], 0.22, 0.15, 5, 'leaf:2');
    rod(m, K, [0, 14.3, 0.3], add3(H, n, -0.3), 0.15, 0.13, 5, 'leaf:2');
    [[4, 30, 'leaf:2'], [7.2, 210, 'leaf:3'], [10.2, 80, 'leaf:2'], [12.6, 250, 'leaf:3']].forEach(([y, az, c]) => {
      const P = [Math.sin(rad(az)) * 0.45, y + 0.25, 0.3 * y / 14 + Math.cos(rad(az)) * 0.45];
      rod(m, K, [0, y, 0.3 * y / 14], P, 0.06, 0.04, 3, c);
      leaf(m, K, heart(2.1, 1.8), 0.03, c, P, 20, az); });
    m.add(latheOpen([[0.25, -0.4], [0.95, -0.12], [1.05, 0]], 12), { color:'leaf:3', t:H, r:[tilt, 0, 0] });                       // hátsó csésze
    m.add(flat(K, lobed(1.55, 14, 2, 0.6, Math.PI / 14), 0.04), { color:'gold:2', t:add3(H, n, 0.01), r:[-90 + tilt, 0, 0] });      // hátsó szirom-sor
    m.add(flat(K, lobed(1.65, 14, 2, 0.6), 0.04), { color:S.napraforgoSzirom, t:add3(H, n, 0.05), r:[-90 + tilt, 0, 0] });           // első szirom-sor
    m.add(K.cylinder(1.0, 1.02, 0.16, 14), { color:S.napraforgoTanyer, t:add3(H, n, 0.1), r:[tilt, 0, 0] });                       // tányér
    m.add(K.lathe([[0.6, 0], [0.38, 0.08], [0, 0.11]], 10), { color:'chocolate:2', t:add3(H, n, 0.17), r:[tilt, 0, 0] });          // sötét közép
    return done(K, m, [add3(H, n, 0.3)], o);
  }

  // HÁRS (virágos ágacska – a fát a játék meglévő fája adja): ág szív alakú levelekkel, két lecsüngő virágzat a jellegzetes
  // halványzöld murvalevéllel (a kocsány félig hozzánőtt) és 5–5 krémsárga virággal. Az origó az ág töve; a virágok az ág alatt.
  function hars(K, o){
    const m = K.model(), blooms = [];
    rod(m, K, [0, 0, 0], [1.6, 0.5, 0], 0.06, 0.035, 4, 'wood:3');
    rod(m, K, [0.8, 0.25, 0], [1.35, 0.2, 0.5], 0.035, 0.025, 3, 'wood:3');
    for(const [P, az] of [[[0.5, 0.16, 0], 330], [[1.2, 0.38, 0], 30], [[1.6, 0.5, 0], 100]]){ const L = [P[0] + 0.15, P[1] + 0.05, P[2] - 0.15];
      rod(m, K, P, L, 0.015, 0.012, 3, 'grass:3'); leaf(m, K, heart(0.85, 0.75), 0.012, 'leaf:2', L, 12, az); }
    for(const [A, seed] of [[[1.0, 0.31, 0.05], 1], [[1.35, 0.2, 0.5], 2]]){
      const B = [A[0] + 0.1, A[1] - 0.3, A[2] + 0.12], F = [B[0] + 0.04, B[1] - 0.32, B[2] + 0.05];
      rod(m, K, A, B, 0.012, 0.012, 3, 'grass:3'); rod(m, K, B, F, 0.012, 0.01, 3, 'grass:3');
      leaf(m, K, oval(0.62, 0.15, 6), 0.01, S.harsMurvalevel, [A[0] + 0.02, A[1] - 0.02, A[2]], -70, 20 + seed * 30);       // murvalevél
      for(let i = 0; i < 5; i++){ const a = i / 5 * Math.PI * 2 + seed, p = [F[0] + Math.cos(a) * 0.15, F[1] - 0.08 - (i % 2) * 0.07, F[2] + Math.sin(a) * 0.15];
        rod(m, K, F, p, 0.008, 0.008, 3, 'grass:3');
        m.add(blob(K, 0.08, 40 + i + seed * 9, 7, 0.15), { color:'cream:2', t:p });
        m.add(blob(K, 0.045, 50 + i + seed * 9, 5, 0.1), { color:'honey:2', t:[p[0], p[1] - 0.055, p[2]] }); }                  // porzó-pamacs
      blooms.push([F[0], F[1] - 0.12, F[2]]);
    }
    return done(K, m, blooms, o);
  }

  // LEVENDULA: szürkészöld, keskeny levelű tő, 7 hosszú szár, a végükön örvös, lila virágfüzér. ≈ 5 egység.
  function levendula(K, o){
    const m = K.model(), R = rng(17), blooms = [];
    m.add(blob(K, 0.6, 3, 12, 0.2), { color:'sage:3', t:[0, 0.25, 0], s:[1.3, 0.6, 1.3] });
    for(let i = 0; i < 8; i++){ const a = i / 8 * Math.PI * 2; rod(m, K, [0, 0.3, 0], [Math.cos(a) * 0.95, 1.0 + R() * 0.3, Math.sin(a) * 0.95], 0.045, 0.012, 3, 'sage:3'); }
    for(let i = 0; i < 7; i++){ const a = i / 7 * Math.PI * 2 + 0.3, d = i === 0 ? 0 : 0.55 + R() * 0.35, h = 4.3 + R() * 0.8 - d * 0.6;
      const T = [Math.cos(a) * d * 1.5, h, Math.sin(a) * d * 1.5];
      rod(m, K, [Math.cos(a) * d * 0.2, 0.4, Math.sin(a) * d * 0.2], T, 0.03, 0.022, 3, 'leaf:2');
      for(let k = 0; k < 5; k++) m.add(blob(K, 0.1 - k * 0.008, 60 + i * 5 + k, 6, 0.15), { color:k === 4 ? 'purple:3' : S.levendulaLila,
        t:[T[0], T[1] + k * 0.17, T[2]], s:[1, 0.85, 1] });
      blooms.push([T[0], T[1] + 0.35, T[2]]); }
    blooms.sort((a, b) => b[1] - a[1]);
    return done(K, m, blooms, o);
  }

  // ================= INKÁBB POSZMÉHNEK =================
  // PARADICSOM: szőrös szár, szárnyasan szeldelt levélkék, lecsüngő fürtben 3 bókoló sárga virág visszahajló, keskeny
  // szirmokkal és előremeredő sárga porzó-kúppal (zümmögő beporzás), zöld csészével; a fürt végén egy kis zöld termés. ≈ 4 egység.
  function paradicsom(K, o){
    const m = K.model(), blooms = [];
    rod(m, K, [0, 0, 0], [0.1, 3.7, 0], 0.1, 0.07, 5, 'leaf:2');
    rod(m, K, [0.05, 2.2, 0], [1.3, 2.55, 0.3], 0.03, 0.02, 3, 'leaf:2');
    [[0.45, 2.31, 0.1, 30], [0.85, 2.42, 0.2, 150], [1.3, 2.55, 0.3, 75], [0.65, 2.37, 0.15, 260]].forEach(([x, y, z, az], i) =>
      leaf(m, K, pinnate(0.85, 0.55, 2), 0.012, i % 2 ? 'leaf:3' : 'leaf:2', [x, y, z], 24, az));
    const A = [0.08, 3.05, 0], B = [-0.3, 3.35, 0.5]; rod(m, K, A, B, 0.025, 0.02, 3, 'leaf:2');
    [[-0.45, 3.0, 0.65, 0], [-0.15, 3.0, 0.78, 40], [-0.62, 3.12, 0.4, 300]].forEach(([x, y, z, az]) => {
      const c = [x, y, z]; rod(m, K, B, c, 0.012, 0.012, 3, 'leaf:2');
      const n = nrm(140, az);
      m.add(flat(K, lobed(0.16, 5, 2, 0.25), 0.015), { color:'leaf:3', t:add3(c, n, -0.025), r:[-90 + 140, az, 0] });                // csésze
      m.add(flat(K, lobed(0.27, 5, 2, 0.2, Math.PI / 5), 0.018), { color:S.paradicsomSarga, t:c, r:[-90 + 140, az, 0] });         // szirmok
      m.add(K.cylinder(0, 0.075, 0.26, 6), { color:S.paradicsomPorzo, t:add3(c, n, 0.13), r:[140, az, 0] });                        // porzó-kúp
      blooms.push(add3(c, n, 0.16)); });
    m.add(K.sphere(0.13, 7, 5), { color:'leaf:0', t:[-0.35, 3.2, 0.25], s:[1, 0.9, 1] });                                         // zöld termés
    return done(K, m, blooms, o);
  }

  // LUCERNA: elágazó szár, hármas levelek (hosszúkás, a csúcsukon fogazott levélkék), az ágak végén tömött, lila pillangós
  // fürtvirágzat. ≈ 6 egység.
  function lucerna(K, o){
    const m = K.model(), blooms = [];
    rod(m, K, [0, 0, 0], [0.1, 5.6, 0], 0.05, 0.035, 4, 'leaf:2');
    rod(m, K, [0.05, 3.4, 0], [0.8, 4.8, 0.2], 0.035, 0.03, 3, 'leaf:2');
    [[1.6, 30], [2.6, 200], [3.9, 110], [4.6, 290]].forEach(([y, az]) => { const P = [0.06 + Math.sin(rad(az)) * 0.3, y + 0.15, Math.cos(rad(az)) * 0.3];
      rod(m, K, [0.05, y, 0], P, 0.015, 0.012, 3, 'leaf:2'); trefoil(m, K, P, 0.4, 0.17, az, 'leaf:2', null); });
    for(const [T, k] of [[[0.1, 5.6, 0], 1], [[0.8, 4.8, 0.2], 0.85]]){
      for(let i = 0; i < 10; i++){ const ring = Math.floor(i / 3), a = (i % 3) / 3 * Math.PI * 2 + ring * 0.9, r = (0.18 - ring * 0.04) * k;
        m.add(blob(K, (0.14 - ring * 0.016) * k, 70 + i + k * 10, 6, 0.15), { color:i % 4 === 1 ? 'purple:1' : S.lucernaLila,
          t:[T[0] + Math.cos(a) * r, T[1] + 0.1 + ring * 0.18 * k, T[2] + Math.sin(a) * r] }); }
      blooms.push([T[0], T[1] + 0.32 * k, T[2]]); }
    return done(K, m, blooms, o);
  }

  // VÖRÖS HERE: szőrös szár, rajta tojásdad, rózsaszínes-bíbor virágfej sok kifelé meredő, hosszú csöves virággal, közvetlenül
  // alatta két levél; tövénél hármas levelek világos V-rajzolattal. ≈ 3,5 egység.
  function voroshere(K, o){
    const m = K.model(), T = [0.1, 3.05, 0];
    rod(m, K, [0, 0, 0], T, 0.045, 0.035, 4, 'leaf:2');
    m.add(K.sphere(0.2, 8, 5), { color:S.voroshereRozsa, t:[T[0], T[1] + 0.21, T[2]], s:[1, 1.15, 1] });
    for(let i = 0; i < 12; i++){ const a = i / 6 * Math.PI + (i > 5 ? 0.5 : 0), e = i > 5 ? 0.65 : 0.1;                         // csöves virágok
      const p = [T[0] + Math.cos(a) * Math.cos(e) * 0.16, T[1] + 0.21 + Math.sin(e) * 0.19, T[2] + Math.sin(a) * Math.cos(e) * 0.16];
      rod(m, K, p, [p[0] + Math.cos(a) * Math.cos(e) * 0.13, p[1] + Math.sin(e) * 0.13 + 0.03, p[2] + Math.sin(a) * Math.cos(e) * 0.13], 0.045, 0, 3, 'pink:3'); }
    for(const az of [40, 220]){ leaf(m, K, oval(0.32, 0.16, 8), 0.01, 'leaf:2', [T[0], T[1] - 0.02, T[2]], 18, az);                 // a fej alatti levélpár
      leaf(m, K, chevron(0.32, 0.16), 0.012, 'sage:2', [T[0], T[1] - 0.013, T[2]], 18, az); }
    for(const [x, z, h, az] of [[-0.3, 0.1, 0.9, 20], [0.35, -0.12, 0.75, 160]]){ const P = [x, h, z];
      rod(m, K, [x * 0.3, 0, z * 0.3], P, 0.02, 0.015, 3, 'leaf:2'); trefoil(m, K, P, 0.35, 0.17, az, 'leaf:2', 'sage:2'); }
    return done(K, m, [[T[0], T[1] + 0.28, T[2]]], o);
  }

  // BURGONYA: szár szárnyas, tojásdad levélkékkel, csúcsán bogas virágzat: 4 halványlila / fehér, ötszögletű csillag-párta,
  // a közepén előremeredő sárga porzó-kúppal (zümmögő beporzás), egy bimbóval. ≈ 4 egység.
  function burgonya(K, o){
    const m = K.model(), blooms = [];
    rod(m, K, [0, 0, 0], [0.05, 3.5, 0], 0.09, 0.06, 5, 'leaf:2');
    for(const [y, az, n] of [[1.6, 40, 4], [2.5, 220, 3]]){ const E = [Math.sin(rad(az)) * 1.1, y + 0.35, Math.cos(rad(az)) * 1.1];
      rod(m, K, [0.03, y, 0], E, 0.025, 0.018, 3, 'leaf:2');
      for(let i = 0; i < n; i++){ const t = (i + 1) / n, P = [E[0] * t, y + 0.35 * t, E[2] * t];
        if(i === n - 1) leaf(m, K, oval(0.42, 0.26, 6), 0.01, 'leaf:3', P, 22, az);
        else for(const sd of [-1, 1]) leaf(m, K, oval(0.34, 0.2, 6), 0.01, i % 2 ? 'leaf:3' : 'leaf:2', P, 22, az + sd * 70); } }
    const A = [0.05, 3.5, 0], B = [0.1, 3.8, 0.2]; rod(m, K, A, B, 0.025, 0.02, 3, 'leaf:2');
    [[0.42, 3.85, 0.5, 50, S.burgonyaLila], [-0.2, 3.98, 0.58, 340, S.burgonyaLila], [0.12, 4.12, -0.05, 160, 'white:1'], [0.55, 3.72, 0.0, 110, S.burgonyaLila]].forEach(([x, y, z, az, c]) => {
      const p = [x, y, z], n = nrm(70, az); rod(m, K, B, p, 0.012, 0.012, 3, 'leaf:2');
      m.add(flat(K, lobed(0.28, 5, 2, 0.72), 0.016), { color:c, t:p, r:[-90 + 70, az, 0] });                                       // ötszögletű párta
      m.add(K.cylinder(0, 0.07, 0.2, 5), { color:'honey:2', t:add3(p, n, 0.1), r:[70, az, 0] });                               // porzó-kúp
      blooms.push(add3(p, n, 0.12)); });
    m.add(blob(K, 0.06, 90, 6, 0.1), { color:'purple:1', t:[0.0, 3.82, 0.32], s:[1, 1.3, 1] });                                   // bimbó
    return done(K, m, blooms, o);
  }

  // ================= VESZÉLYEK =================
  // GYURGYALAG: gesztenyebarna fejtető és hát, aranysárga váll-folt és torok, fekete szemsáv, türkizkék has, hosszú, enyhén
  // lefelé ívelő fekete csőr, zöldes farok megnyúlt középső tollakkal; kitárt, kékeszöld szárny gesztenyés fedőtollakkal.
  // RÉSZEK { body, wingL, wingR, foot }, origó a szárny-zsanér, az orr +Z. Hossza ≈ 2,8 (a farokkal).
  function gyurgyalag(K, o){
    const body = K.model();
    body.add(K.sphere(0.36, 10, 6), { color:S.gyurgyalagHas, t:[0, -0.2, -0.05], s:[0.9, 0.85, 1.55] });                       // has
    body.add(K.sphere(0.36, 10, 6), { color:S.gyurgyalagGesztenye, t:[0, -0.11, -0.02], s:[0.93, 0.78, 1.5] });               // hát
    body.add(blob(K, 0.22, 7, 10, 0.1), { color:'gold:3', t:[0, -0.0, -0.1], s:[1.4, 0.35, 1.5] });                 // váll-folt
    body.add(K.sphere(0.25, 10, 6), { color:S.gyurgyalagGesztenye, t:[0, -0.04, 0.55] });                                       // fej
    body.add(K.sphere(0.18, 8, 5), { color:S.gyurgyalagTorok, t:[0, -0.16, 0.63], s:[0.95, 0.85, 0.9] });                     // torok
    for(const sx of [-1, 1]) body.add(K.sphere(0.1, 6, 4), { color:'dark:3', t:[sx * 0.17, -0.04, 0.63], s:[0.5, 0.55, 1.7] });   // szemsáv
    rod(body, K, [0, -0.06, 0.74], [0, -0.09, 1.06], 0.055, 0.035, 4, 'dark:3'); rod(body, K, [0, -0.09, 1.06], [0, -0.17, 1.3], 0.035, 0, 4, 'dark:3');   // csőr
    body.add(flat(K, [[-0.14, 0], [-0.19, -0.75], [-0.05, -0.8], [-0.03, -1.08], [0.03, -1.08], [0.05, -0.8], [0.19, -0.75], [0.14, 0]], 0.03),
      { color:'leaf:1', t:[0, -0.13, -0.5], r:[-90 + 8, 0, 0] });                                                                 // farok
    const W = [[0, 0.22], [0.45, 0.2], [0.9, 0.08], [1.3, -0.12], [1.2, -0.22], [0.7, -0.25], [0.3, -0.35], [0, -0.25]];
    const cov = [[0, 0.2], [0.4, 0.18], [0.55, 0.05], [0.35, -0.1], [0, -0.08]], tip = [[0.88, 0.06], [1.3, -0.12], [1.2, -0.22], [0.85, -0.2]];
    const out = { body, foot:-0.47 };
    for(const [name, sx] of [['wingL', 1], ['wingR', -1]]){ const g = K.model(), mir = p => p.map(([x, z]) => [sx * x, z]);
      g.add(flat(K, mir(W), 0.02), { color:S.gyurgyalagSzarny, t:[sx * 0.2, -0.02, 0], r:[-90, 0, sx * 8] });
      g.add(flat(K, mir(cov), 0.02), { color:S.gyurgyalagGesztenye, t:[sx * 0.2, -0.0, 0], r:[-90, 0, sx * 8] });
      g.add(flat(K, mir(tip), 0.02), { color:'leaf:2', t:[sx * 0.2, -0.0, 0], r:[-90, 0, sx * 8] });
      out[name] = g; }
    return scaled(K, out, (o || {}).s);
  }

  // DARÁZS (kecskedarázs-féle): élénk citromsárga és fekete, CSUPASZ test, a tor és a potroh között vékony DARÁZSDEREK, sárga
  // arc nagy fekete vese alakú szemmel, fekete tor sárga foltokkal, sárga lábak, keskeny füstös szárny. Mint a méh: RÉSZEK, origó a zsanér.
  function darazs(K, o){
    const body = K.model(), Y = -0.018, Yl = S.darazsSarga, B = S.darazsFekete;
    body.add(K.sphere(0.017, 10, 7), { color:B, t:[0, Y, 0], s:[0.95, 0.95, 1.15] });                                          // tor
    for(const sx of [-1, 1]) body.add(blob(K, 0.006, 3 + sx, 6, 0.1), { color:Yl, t:[sx * 0.009, Y + 0.012, 0.004], s:[1, 0.5, 1.5] });
    const hz = 0.027;
    body.add(K.sphere(0.014, 10, 6), { color:Yl, t:[0, Y - 0.002, hz], s:[1.15, 1.05, 0.75] });                               // sárga arc
    body.add(K.sphere(0.011, 6, 4), { color:B, t:[0, Y + 0.006, hz - 0.004], s:[1.25, 0.6, 0.8] });                            // fekete fejtető
    for(const sx of [-1, 1]){ body.add(K.sphere(0.008, 6, 4), { color:B, t:[sx * 0.0125, Y, hz - 0.001], s:[0.45, 1.35, 0.9] });   // vese-szem
      const a = [sx * 0.004, Y + 0.01, hz + 0.009], b = [sx * 0.008, Y + 0.024, hz + 0.013], c = [sx * 0.022, Y + 0.03, hz + 0.036];
      rod(body, K, a, b, 0.0016, 0.0014, 3, B); rod(body, K, b, c, 0.0014, 0.0012, 3, B); }
    rod(body, K, [0, Y - 0.002, -0.016], [0, Y - 0.004, -0.027], 0.0032, 0.0032, 4, B);                                         // darázsderék
    const L = 0.062, Rm = 0.017, z0 = -0.026 - L, prof = t => t < 0.62 ? Math.pow(Math.sin(Math.PI / 2 * t / 0.62), 0.7) : Math.pow(Math.cos((t - 0.62) / 0.38 * Math.PI / 2 * 0.86), 0.7);
    KP._h.banded(body, K, t => [prof(t) * Rm, z0 + t * L], [[0, 0.14, Yl], [0.14, 0.22, B], [0.22, 0.37, Yl], [0.37, 0.45, B], [0.45, 0.6, Yl], [0.6, 0.7, B], [0.7, 0.85, Yl], [0.85, 1, B]], 10, Y - 0.006);
    rod(body, K, [0, Y - 0.006, z0 + 0.001], [0, Y - 0.007, z0 - 0.008], 0.0018, 0, 3, B);                                     // fullánk
    let foot = 0;
    [[0.008, 0.016], [0, 0], [-0.009, -0.026]].forEach(([z, dz]) => { for(const sx of [-1, 1]){
      const a = [sx * 0.008, Y - 0.012, z], b = [sx * 0.024, Y - 0.02, z + dz * 0.3], c = [sx * 0.03, Y - 0.042, z + dz * 0.9];
      rod(body, K, a, b, 0.0022, 0.002, 3, Yl); rod(body, K, b, c, 0.002, 0.0016, 3, Yl); foot = Math.min(foot, c[1] - 0.002); } });
    const out = { body, foot };
    for(const [name, sx] of [['wingL', 1], ['wingR', -1]]){ const g = K.model();
      g.add(flat(K, ell(sx * 0.028, -0.012, 0.03, 0.0065, 10, -sx * 24), 0.0012), { color:'glass:1', t:[0, 0.0012, 0], r:[-90, 0, sx * 10] });
      g.add(flat(K, ell(sx * 0.018, -0.022, 0.016, 0.005, 8, -sx * 30), 0.0012), { color:'glass:1', t:[0, 0.0004, 0], r:[-90, 0, sx * 10] });
      out[name] = g; }
    return scaled(K, out, (o || {}).s);
  }

  // PERMETFELHŐ: lágy, lapjaira tört pamacsokból álló, lebegő köd (külső pamacsok 'glass:0' – a játékban áttetsző –, a mag
  // halvány zsálya) és alatta szitáló cseppek. Vegyszer, flakon, jelkép nélkül. ≈ 6,4 × 3,6 × 3,2, a legalsó pont y ≈ 0.
  function permetfelho(K, o){
    const m = K.model(), R = rng(29);
    [[0, 2.0, 0, 1.4], [1.4, 1.7, 0.3, 1.1], [-1.3, 1.8, -0.2, 1.15], [0.6, 2.9, -0.3, 1.0], [-0.5, 2.8, 0.4, 0.9], [2.6, 1.4, 0, 0.75], [-2.5, 1.5, 0.2, 0.7], [1.0, 1.3, 0.9, 0.8], [-0.8, 1.3, -0.9, 0.8]]
      .forEach(([x, y, z, r], i) => m.add(blob(K, r, 200 + i, 16, 0.16), { color:i < 3 ? S.permetMag : S.permet, t:[x, y, z], s:[1, 0.8, 1] }));
    for(let i = 0; i < 14; i++) m.add(blob(K, 0.07 + R() * 0.05, 300 + i, 5, 0.1), { color:'glass:2', t:[(R() - 0.5) * 4.4, 0.1 + R() * 0.6, (R() - 0.5) * 1.8], s:[0.8, 1.3, 0.8] });
    return scaled(K, m, (o || {}).s);
  }

  // ================= VERSENY-KOSZORÚ =================
  // Virágfüzér-karika (kapu): zöld inda-gyűrű (R = 1), körben váltakozva levelek és 10 kis virág (rózsaszín, sárga, fehér, lila – elöl sárga közepű, hátulról is látszik).
  // Az origó a karika közepe, a karika az XY síkban áll, mindkét oldalról virágos. koszoru.R = a belső nyílás sugara.
  function koszoru(K, o){
    const m = K.model(), R = 1.0, COL = ['blossom:1', 'honey:1', 'white:1', 'purple:0'];
    m.add(K.torus(R, 0.065, 20, 4), { color:'leaf:2', r:[90, 0, 0] });
    for(let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2 + 0.2, out = i % 2 ? 1 : -1;
      m.add(K.extrude([[0, 0], [0.12, 0.06], [0.27, 0], [0.12, -0.06]], 0.02), { color:'leaf:0',
        t:[Math.cos(a) * R, Math.sin(a) * R, (i % 3 - 1) * 0.04], r:[0, 0, a * 180 / Math.PI + out * 70] }); }
    for(let i = 0; i < 10; i++){ const a = i / 10 * Math.PI * 2, p = [Math.cos(a) * R, Math.sin(a) * R, 0];
      m.add(K.extrude(lobed(0.14, 5, 2, 0.45), 0.03), { color:COL[i % 4], t:[p[0], p[1], 0.05] });
      m.add(blob(K, 0.045, 400 + i, 5, 0.1), { color:'honey:2', t:[p[0], p[1], 0.075] }); }
    m.R = R - 0.065;
    return scaled(K, m, (o || {}).s);
  }

  Object.assign(KP, { almavirag, feherhere, facelia, napraforgo, hars, levendula, paradicsom, lucerna, voroshere, burgonya, gyurgyalag, darazs, permetfelho, koszoru,
    VIRAGOK:{ jo:['almavirag', 'feherhere', 'facelia', 'napraforgo', 'hars', 'levendula'], poszmeh:['paradicsom', 'lucerna', 'voroshere', 'burgonya'] } });
  root.KP_MODELS = KP;
  if(typeof module !== 'undefined' && module.exports) module.exports = KP;
})(typeof window !== 'undefined' ? window : globalThis);
