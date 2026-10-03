// ============================================================
//  ÉLŐ BIRTOK (18. játék, bt) – a permakultúrás birtok 3D tárgyai B szinten (docs/rajzolas.md): 300–1200 △, kódból, ART.MAT-színek
//
//  Builderek: BT_MODELS.<név>(K, opts) → modell (K = MODEL, js/art/model-kit.js), vagy RÉSZEK objektuma ({ body, foil, glass, water, head }).
//  Lépték: PONTOSAN az Élő kerté (3d/elokert-modellek.js): EGY MEZŐ = BT_MODELS.TILE = 1,4 egység, 1 m ≈ 1,38 egység,
//  Y fel, talp y = 0, origó = a mező közepe a talajon, eleje +Z. Minden tárgy elfér egy mezőn, ha a leírás mást nem mond.
//   • Tisztítandó (leromlott telek): bozot, gazkupac, szemetkupac, ko, raklap
//   • Ágyás: agyas({ allapot:'csupasz'|'karton'|'takart'|'komposztos', keret }) – m.top = a talajfelszín magassága (ide kerül a növény)
//   • Építmények: foliasator, uveghaz, palantatalca, tyukol, szerszamkamra, talicska, arok, csepegteto, kosar
//   • Állatok: tyuk, kacsa – RÉSZEK: body + head (a fej a helyén; a bólintás a h.neck pont körül, az X tengelyen forgatva)
//   • Városi épület (Méhesd-térkép, DIORÁMA-LÉPTÉK, mint a VAROS_MODELS): birtok – 1,4 × 1,0, max. ≈ 0,5
//  A növények (noveny, meggyfa, malnasor): 3d/birtok-novenyek.js (ugyanebbe a BT_MODELS-be kerülnek).
//  Újrahasznosítva, NEM rajzoljuk újra: EK_MODELS tó, esővízgyűjtő hordó, komposztláda, sövény, rovarhotel, fa (alma), kerítés,
//  SZ_MODELS fa/bokor/magaságyás, KP_MODELS kaptár, VAROS_MODELS virágsáv.
//  Betöltési sorrend: js/art/art.js, js/art/model-kit.js, 3d/elokert-modellek.js UTÁN. Katalógus: 3d/katalogus.js („Élő birtok”).
// ============================================================
(function(root){
  const EK = root.EK_MODELS || (typeof require === 'function' ? require('./elokert-modellek.js') : null);
  const { rng, blob, rod, flat, spread } = EK._h, TILE = 1.4, LAY = [-90, 0, 0];

  // ---- segédek (a növények fájlja is ezeket használja: BT_MODELS._h) ----
  // levéllemez: rombusz az XY síkban (tő az origóban, csúcs +Y felé), vékonyan kihúzva – 12 △
  const leafG = (K, len, wid) => K.extrude([[0, 0], [wid / 2, len * 0.38], [0, len], [-wid / 2, len * 0.38]], 0.012);
  // levél a p tőpontból: az = irány a talajon (fok, 0 = +Z, 90 = +X), el = emelkedés (0 = vízszintes, 90 = függőleges)
  const leaf = (m, K, p, az, el, len, wid, color) => m.add(leafG(K, len, wid), { color, t:p, r:[90 - el, az, 0] });
  // rácspontok a mező közepe körül: nx × nz pont, dx / dz távolsággal
  const grid = (nx, nz, dx, dz) => { const P = []; for(let i = 0; i < nx; i++) for(let k = 0; k < nz; k++) P.push([(i - (nx - 1) / 2) * dx, (k - (nz - 1) / 2) * dz]); return P; };
  // íves héj (fólia, abroncs): félellipszis-szalag az XY síkban (a szélesség w, magasság h, vastagság th), Z mentén d hosszan
  function archG(K, w, h, th, d, seg){
    const o = [], i = [];
    for(let k = 0; k <= seg; k++){ const a = k / seg * Math.PI; o.push([Math.cos(a) * w / 2, Math.sin(a) * h]); i.push([Math.cos(a) * (w / 2 - th), Math.sin(a) * (h - th)]); }
    return K.extrude([...o, ...i.reverse()], d);
  }
  const H = { rng, blob, rod, flat, spread, leaf, leafG, grid, archG };

  // ================= TISZTÍTANDÓ: a leromlott telek =================
  // BOZÓT (szeder-szövevény): sötét lombtömeg, ívben áthajló bordós vesszők, fehér virág és fekete szeder, száraz kórók
  function bozot(K){
    const m = K.model(), R = rng(201);
    m.add(blob(K, 0.62, 3, 12, 0.2), { color:'soil:2', t:[0, 0.03, 0], s:[1, 0.06, 1] });                           // avar
    [[0, 0.42, 0, 0.42], [-0.32, 0.3, 0.18, 0.32], [0.34, 0.28, -0.12, 0.33], [0.1, 0.3, 0.34, 0.28], [-0.2, 0.32, -0.32, 0.3]]
      .forEach(([x, y, z, r], i) => m.add(blob(K, r, 210 + i, 14), { color:'leaf:2', t:[x, y, z], s:[1, 0.85, 1] }));
    [[-0.05, 0.7, -0.05, 0.26], [0.26, 0.52, 0.14, 0.2], [-0.3, 0.52, -0.08, 0.2]].forEach(([x, y, z, r], i) => m.add(blob(K, r, 220 + i, 10), { color:'leaf:1', t:[x, y, z] }));
    for(let i = 0; i < 6; i++){ const a = i / 6 * Math.PI * 2 + 0.3, P = (r, y) => [Math.sin(a) * r, y, Math.cos(a) * r], h = 0.68 + R() * 0.12;   // ívben áthajló vesszők
      const pts = [P(0.18, 0.35), P(0.4, h), P(0.62, h - 0.12), P(0.74, 0.12)];
      for(let k = 0; k < 3; k++) rod(m, K, pts[k], pts[k + 1], 0.02 - k * 0.004, 0.016 - k * 0.005, 4, 'berry:1'); }
    for(let i = 0; i < 12; i++){ const a = i * 2.4, r = 0.38 + R() * 0.2, y = 0.3 + R() * 0.45;                            // szeder és virág
      m.add(blob(K, i % 3 ? 0.035 : 0.045, 230 + i, 5, 0.1), { color:i % 3 ? 'dark:2' : 'white:1', t:[Math.sin(a) * r, y, Math.cos(a) * r] }); }
    for(let i = 0; i < 3; i++){ const [x, z] = spread(i, 3, 0.55, 1); rod(m, K, [x, 0.03, z], [x * 1.1, 0.62 + R() * 0.12, z * 1.1], 0.016, 0.008, 3, 'cardboard:2'); }   // kórók
    return m;
  }

  // GAZKUPAC: földhalom, rajta lóromlevél, bogáncs lila fejjel, pitypang, száraz fűcsomók
  function gazkupac(K){
    const m = K.model(), R = rng(241);
    m.add(blob(K, 0.52, 5, 16, 0.25), { color:'soil:1', t:[0, 0.08, 0], s:[1.15, 0.38, 1] });                        // földhalom
    for(let i = 0; i < 8; i++){ const a = i * 45 + R() * 20, p = [Math.sin(a * Math.PI / 180) * 0.12, 0.2, Math.cos(a * Math.PI / 180) * 0.12];
      leaf(m, K, p, a, 35 + R() * 25, 0.38 + R() * 0.12, 0.17, i % 2 ? 'leaf:2' : 'leaf:1'); }                          // lóromlevelek
    for(const [x, z] of [[-0.36, 0.2], [0.34, -0.22], [0.12, 0.42]]){                                                   // bogáncs
      rod(m, K, [x, 0.05, z], [x, 0.62, z], 0.018, 0.012, 4, 'sage:3');
      leaf(m, K, [x, 0.25, z], 60, 30, 0.2, 0.08, 'sage:3'); leaf(m, K, [x, 0.35, z], 240, 35, 0.18, 0.08, 'sage:3');
      m.add(blob(K, 0.06, 250 + x * 10, 7), { color:'sage:3', t:[x, 0.62, z] }); m.add(blob(K, 0.05, 260 + x * 10, 6), { color:'purple:1', t:[x, 0.68, z], s:[1, 0.7, 1] }); }
    for(let i = 0; i < 4; i++){ const [x, z] = spread(i, 4, 0.5, 2); m.add(blob(K, 0.04, 270 + i, 6), { color:'honey:1', t:[x, 0.14, z], s:[1, 0.5, 1] }); }
    for(let i = 0; i < 6; i++){ const [x, z] = spread(i, 6, 0.6, 0.4);                                                 // száraz fűcsomók
      for(let k = 0; k < 3; k++){ const a = k * 2.1 + R(); rod(m, K, [x, 0.04, z], [x + Math.sin(a) * 0.1, 0.32 + R() * 0.12, z + Math.cos(a) * 0.1], 0.02, 0, 3, 'cardboard:0'); } }
    return m;
  }

  // SZEMÉTKUPAC: régi autógumi, korhadt deszkák, felborult vödör, ázott doboz, zsák – felirat és logó nincs
  function szemetkupac(K){
    const m = K.model(), R = rng(281);
    m.add(blob(K, 0.55, 7, 12, 0.2), { color:'soil:1', t:[0, 0.04, 0], s:[1.1, 0.12, 1] });
    m.add(K.torus(0.22, 0.08, 12, 5), { color:'dark:1', t:[-0.25, 0.1, 0.18] });                                       // gumi (fekve)
    m.add(K.torus(0.2, 0.075, 12, 5), { color:'dark:1', t:[0.22, 0.32, -0.28], r:[70, 20, 0] });                       // gumi (dőlve)
    for(const [x, z, a, c] of [[0.05, 0.1, 25, 'wood:2'], [0.12, -0.02, -30, 'cardboard:2'], [-0.1, -0.25, 70, 'wood:2'], [0.36, 0.25, 5, 'cardboard:2']])
      m.add(K.box(0.9, 0.04, 0.12), { color:c, t:[x, 0.12 + R() * 0.06, z], r:[0, a, R() * 10 - 5] });                  // deszkák
    m.add(K.lathe([[0.1, 0], [0.13, 0.26], [0.125, 0.27]], 10), { color:'blue:1', t:[0.38, 0.13, 0.32], r:[0, 30, 80] }); // vödör
    m.add(K.torus(0.11, 0.008, 8, 3), { color:'dark:1', t:[0.38, 0.27, 0.36], r:[0, 30, 0] });                          // vödörfül
    m.add(K.chamferBox(0.3, 0.2, 0.26, 0.02), { color:'cardboard:1', t:[-0.36, 0.14, -0.3], r:[8, 20, -6] });           // ázott doboz
    m.add(blob(K, 0.17, 291, 10, 0.25), { color:'white:2', t:[-0.05, 0.2, -0.38], s:[1.2, 0.9, 1] });                  // zsák
    for(let i = 0; i < 4; i++){ const [x, z] = spread(i, 4, 0.62, 2.2);
      for(let k = 0; k < 3; k++){ const a = k * 2.1 + R(); rod(m, K, [x, 0.03, z], [x + Math.sin(a) * 0.08, 0.26, z + Math.cos(a) * 0.08], 0.02, 0, 3, 'leaf:1'); } }
    return m;
  }

  // KŐRAKÁS: lapos és gömbölyű kövek egymáson, moha a tövében
  function ko(K){
    const m = K.model(), R = rng(311);
    [[0, 0.16, 0, 0.26], [-0.3, 0.12, 0.16, 0.2], [0.3, 0.11, 0.12, 0.19], [0.12, 0.12, -0.3, 0.2], [-0.24, 0.1, -0.24, 0.16], [0.05, 0.36, 0.05, 0.17],
     [-0.12, 0.3, 0.18, 0.13], [0.2, 0.28, -0.1, 0.12], [0.44, 0.07, -0.2, 0.11], [-0.46, 0.06, -0.02, 0.1]].forEach(([x, y, z, r], i) =>
      m.add(blob(K, r, 320 + i, 12, 0.3), { color:['steel:3', 'dark:0', 'cardboard:2'][i % 3], t:[x, y, z], s:[1.25, 0.72, 1.05], r:[0, R() * 180, 0] }));
    for(const [x, z] of [[0.12, 0.34], [-0.42, 0.24], [0.42, 0.0], [-0.06, -0.48]]) m.add(blob(K, 0.08, 340 + x * 10, 6), { color:'grass:1', t:[x, 0.03, z], s:[1.4, 0.45, 1] });
    for(let i = 0; i < 3; i++) m.add(blob(K, 0.06, 350 + i, 6), { color:'leaf:1', t:[-0.3 + i * 0.3, 0.06, 0.4], s:[1, 0.7, 1] });
    return m;
  }

  // KORHADT RAKLAPOK: egy fekvő, egy ráborult (hiányzó léccel), egy nekidőlve; moha és gomba a korhadt fán
  function pallet(K, missing){
    const p = K.model(), L = 1.0, Wd = 0.66;
    for(let i = 0; i < 5; i++) if(i !== missing) p.add(K.box(L, 0.03, 0.1), { color:i % 2 ? 'wood:2' : 'cardboard:2', t:[0, 0.135, -Wd / 2 + 0.05 + i * (Wd - 0.1) / 4] });
    for(const z of [-Wd / 2 + 0.05, 0, Wd / 2 - 0.05]){ p.add(K.box(L, 0.09, 0.08), { color:'wood:3', t:[0, 0.075, z] }); p.add(K.box(L, 0.03, 0.1), { color:'wood:2', t:[0, 0.015, z] }); }
    return p;
  }
  function raklap(K){
    const m = K.model();
    m.merge(pallet(K, -1), { t:[0, 0, 0.18], r:[0, 6, 0] });
    m.merge(pallet(K, 2), { t:[0.08, 0.16, 0.12], r:[0, -14, 3] });
    m.merge(pallet(K, 1), { t:[0.05, 0.3, -0.42], r:[-68, 0, 0] });                                                     // nekidőlve
    for(const [x, y, z, r] of [[-0.42, 0.2, 0.3, 0.07], [0.4, 0.33, 0.0, 0.06], [-0.2, 0.62, -0.32, 0.06]]) m.add(blob(K, r, 360 + x * 10, 7), { color:'grass:1', t:[x, y, z], s:[1.5, 0.45, 1.2] });   // moha
    for(const [x, z] of [[0.5, 0.42], [0.42, 0.5]]){ m.add(K.cylinder(0.014, 0.016, 0.07, 5), { color:'cream:1', t:[x, 0.035, z] });                   // gomba
      m.add(K.lathe([[0.05, 0.07], [0.035, 0.1], [0, 0.11]], 7), { color:'chocolate:0', t:[x, 0, z] }); }
    return m;
  }

  // ================= ÁGYÁS =================
  // talajtakarás-állapotok: csupasz föld (rögök, barázda) · karton + komposzt (ásásmentes ágyás) · szalmatakarás · sötét, morzsás komposztos föld.
  // opts.keret: deszkakeretes, emelt ágyás. A visszaadott modellen m.top = a felszín magassága (ide kerül a BT_MODELS.noveny).
  function agyas(K, o){
    o = o || {};
    const st = ['csupasz', 'karton', 'takart', 'komposztos'].includes(o.allapot) ? o.allapot : 'csupasz', m = K.model(), R = rng(401), S = 1.24, cb = K.chamferBox;
    const kr = !!o.keret, y0 = kr ? 0.2 : 0.08, top = y0 + ({ csupasz:0.02, karton:0.04, takart:0.06, komposztos:0.05 })[st];
    if(kr){ for(const [x, z, w, d] of [[0, S / 2, S + 0.08, 0.07], [0, -S / 2, S + 0.08, 0.07], [S / 2, 0, 0.07, S - 0.06], [-S / 2, 0, 0.07, S - 0.06]])
      m.add(cb(w, 0.28, d, 0.02), { color:'wood:1', t:[x, 0.14, z] });
      for(const sx of [-1, 1]) for(const sz of [-1, 1]) m.add(K.box(0.08, 0.32, 0.08), { color:'wood:2', t:[sx * S / 2, 0.16, sz * S / 2] }); }
    m.add(cb(kr ? S - 0.06 : S, y0, kr ? S - 0.06 : S, kr ? 0.01 : 0.04), { color:st === 'komposztos' ? 'soil:2' : 'soil:1', t:[0, y0 / 2, 0] });   // földtest
    if(st === 'csupasz'){
      for(let i = 0; i < 4; i++) m.add(cb(S - 0.16, 0.04, 0.12, 0.015), { color:'soil:0', t:[0, y0 + 0.005, -0.42 + i * 0.28], r:[0, (R() - 0.5) * 3, 0] });   // barázdák
      for(let i = 0; i < 9; i++){ const [x, z] = spread(i, 9, 0.5, 0.3); m.add(blob(K, 0.05 + R() * 0.03, 410 + i, 6), { color:'soil:2', t:[x, y0 + 0.02, z], s:[1.2, 0.6, 1] }); }
      for(const [x, z] of [[0.38, 0.3], [-0.42, -0.36]]) m.add(blob(K, 0.04, 420 + x * 10, 6), { color:'steel:2', t:[x, y0 + 0.02, z] });
    }else if(st === 'karton'){
      for(const [x, z, a] of [[-0.29, -0.28, 3], [0.29, -0.27, -4], [-0.28, 0.29, -2], [0.3, 0.3, 5]])                    // átfedő kartonlapok
        m.add(K.box(0.62, 0.012, 0.6), { color:'cardboard:2', t:[x, y0 + 0.008 + (a > 0 ? 0.004 : 0), z], r:[0, a, 0] });
      for(const [x, z] of [[-0.29, 0.0], [0.0, -0.29], [0.02, 0.3]]) m.add(K.box(0.6, 0.014, 0.012), { color:'cardboard:3', t:[x, y0 + 0.016, z], r:[0, Math.abs(z) > 0.1 ? 0 : 90, 0] });   // lap-illesztések
      [[0, 0, 0.4], [-0.25, 0.22, 0.24], [0.26, -0.18, 0.26], [0.2, 0.26, 0.2], [-0.24, -0.24, 0.2]].forEach(([x, z, r], i) =>   // komposztréteg kupacokban
        m.add(blob(K, r, 430 + i, 12, 0.25), { color:'soil:2', t:[x, y0 + 0.02, z], s:[1.1, 0.12, 1.1] }));
    }else if(st === 'takart'){
      m.add(cb(S - 0.04, 0.04, S - 0.04, 0.02), { color:'cardboard:1', t:[0, y0 + 0.02, 0] });                          // szalmaréteg
      for(let i = 0; i < 5; i++){ const [x, z] = spread(i, 5, 0.42, 0.9); m.add(blob(K, 0.2, 440 + i, 10, 0.3), { color:'cardboard:0', t:[x, y0 + 0.04, z], s:[1.2, 0.18, 1] }); }
      for(let i = 0; i < 22; i++){ const [x, z] = spread(i, 22, 0.56, 0.2);                                             // szalmaszálak
        m.add(K.box(0.2, 0.014, 0.014), { color:i % 3 ? 'cardboard:0' : 'honey:1', t:[x, y0 + 0.05 + (i % 2) * 0.01, z], r:[0, R() * 180, (R() - 0.5) * 8] }); }
    }else{
      m.add(blob(K, 0.6, 450, 16, 0.12), { color:'soil:2', t:[0, y0, 0], s:[1, 0.08, 1] });                           // domború, morzsás felszín
      for(let i = 0; i < 12; i++){ const [x, z] = spread(i, 12, 0.52, 0.6); m.add(blob(K, 0.035 + R() * 0.02, 460 + i, 5), { color:'chocolate:1', t:[x, y0 + 0.035, z] }); }
      const w = [[0.2, 0.16], [0.28, 0.2], [0.33, 0.14], [0.4, 0.17]];                                                    // giliszta
      for(let i = 0; i < w.length - 1; i++) rod(m, K, [w[i][0], y0 + 0.045, w[i][1]], [w[i + 1][0], y0 + 0.045, w[i + 1][1]], 0.016, 0.014, 4, 'blossom:2');
    }
    m.top = top;
    return m;
  }

  // ================= ÉPÍTMÉNYEK =================
  // FÓLIASÁTOR: íves acél abroncsok, áttetsző fólia (glass:0), homlokfal, faajtó elöl (+Z), alsó deszka, bent két ágyás palántákkal.
  // A sátor hossza a Z mentén: opts.w × opts.h mező (alap 2 × 3). RÉSZEK: body + foil (a fólia – a játékban áttetsző).
  function foliasator(K, o){
    o = o || {};
    const w = Math.max(1, o.w | 0 || 2), h = Math.max(1, o.h | 0 || 3), W = w * TILE - 0.1, D = h * TILE - 0.1, Ht = Math.min(2.3, W * 0.78);
    const body = K.model(), foil = K.model(), R = rng(501), nh = h * 2 + 1;
    body.add(K.box(W - 0.1, 0.02, D - 0.1), { color:'soil:1', t:[0, 0.01, 0] });                                       // padló
    for(let i = 0; i < nh; i++){ const z = -D / 2 + i * D / (nh - 1); body.add(archG(K, W + 0.06, Ht + 0.03, 0.05, 0.05, 8), { color:'steel:2', t:[0, 0, z] }); }
    for(const sx of [-1, 1]) body.add(K.box(0.06, 0.16, D), { color:'wood:2', t:[sx * (W / 2 - 0.02), 0.08, 0] });   // alsó deszka
    foil.add(archG(K, W, Ht, 0.015, D, 8), { color:'glass:0' });                                                       // fólia
    const end = []; for(let k = 0; k <= 8; k++){ const a = k / 8 * Math.PI; end.push([Math.cos(a) * W / 2, Math.sin(a) * Ht]); }
    for(const sz of [-1, 1]) foil.add(K.extrude(end, 0.012), { color:'glass:0', t:[0, 0, sz * D / 2] });                 // homlokfalak
    const dw = 0.8, dh = Math.min(1.75, Ht - 0.25);                                                                        // ajtókeret elöl (+Z)
    for(const sx of [-1, 1]) body.add(K.box(0.06, dh, 0.06), { color:'wood:1', t:[sx * dw / 2, dh / 2, D / 2] });
    body.add(K.box(dw + 0.06, 0.06, 0.06), { color:'wood:1', t:[0, dh, D / 2] });
    body.add(K.box(dw - 0.06, 0.05, 0.04), { color:'wood:1', t:[0, dh * 0.5, D / 2 + 0.02] });                       // ajtó keresztléce
    rod(body, K, [-dw / 2 + 0.04, 0.06, D / 2 + 0.02], [dw / 2 - 0.04, dh * 0.5, D / 2 + 0.02], 0.02, 0.02, 4, 'wood:1');   // merevítő
    foil.add(K.box(dw - 0.06, dh - 0.06, 0.01), { color:'glass:0', t:[0, dh / 2, D / 2 + 0.03] });                      // ajtólap fóliából
    for(const sx of [-1, 1]){ const x = sx * W * 0.26;                                                                    // két ágyás palántákkal
      body.add(K.chamferBox(W * 0.3, 0.1, D - 0.5, 0.02), { color:'soil:2', t:[x, 0.06, -0.1] });
      for(let i = 0; i < h + 1; i++){ const z = -D / 2 + 0.45 + i * (D - 0.9) / h;
        body.add(blob(K, 0.18, 510 + i + sx * 7, 10), { color:'leaf:1', t:[x, 0.3, z], s:[1, 1.3, 1] });
        for(let k = 0; k < 2; k++) body.add(blob(K, 0.045, 530 + i * 2 + k, 6), { color:'tomato:1', t:[x + (k ? 0.1 : -0.08), 0.24 + k * 0.12, z + 0.12] }); }
    }
    return { body, foil };
  }

  // KIS ÜVEGHÁZ (1 mező): kő lábazat, sötétzöld fém váz, üvegfalak és nyeregtető (glass:1), ajtó elöl, bent polc cserepes palántákkal.
  // RÉSZEK: body + glass (az üveg – a játékban áttetsző).
  function uveghaz(K){
    const body = K.model(), glass = K.model(), W = 1.2, D = 1.0, Hw = 1.5, Hr = 2.05, b = 0.28, F = 'leaf:2';   // sötétzöld váz: a világos üveg kontúrja
    body.add(K.chamferBox(W, b, D, 0.03), { color:'steel:2', t:[0, b / 2, 0] });                                           // lábazat
    for(const sx of [-1, 1]) for(const sz of [-1, 1]) body.add(K.box(0.05, Hw - b, 0.05), { color:F, t:[sx * (W / 2 - 0.025), b + (Hw - b) / 2, sz * (D / 2 - 0.025)] });
    for(const sz of [-1, 1]) body.add(K.box(W, 0.05, 0.05), { color:F, t:[0, Hw, sz * (D / 2 - 0.025)] });                // eresz
    for(const sx of [-1, 1]) body.add(K.box(0.05, 0.05, D), { color:F, t:[sx * (W / 2 - 0.025), Hw, 0] });
    for(const x of [-0.3, 0.3]) body.add(K.box(0.035, Hw - b, 0.035), { color:F, t:[x, b + (Hw - b) / 2, -D / 2 + 0.02] });   // osztók
    for(const z of [-0.17, 0.17]) for(const sx of [-1, 1]) body.add(K.box(0.035, Hw - b, 0.035), { color:F, t:[sx * (W / 2 - 0.02), b + (Hw - b) / 2, z] });
    const a = Math.atan2(Hr - Hw, D / 2) * 180 / Math.PI, L = Math.hypot(Hr - Hw, D / 2) + 0.05;
    for(const sz of [-1, 1]){ glass.add(K.box(W, 0.02, L), { color:'glass:1', t:[0, (Hw + Hr) / 2, sz * D / 4], r:[sz * a, 0, 0] });   // tetőüveg
      body.add(K.box(0.04, 0.04, L), { color:F, t:[0, (Hw + Hr) / 2 + 0.02, sz * D / 4], r:[sz * a, 0, 0] }); }
    body.add(K.box(W + 0.04, 0.06, 0.06), { color:F, t:[0, Hr + 0.01, 0] });                                              // gerinc
    for(const sx of [-1, 1]) glass.add(K.extrude([[-D / 2, Hw], [D / 2, Hw], [0, Hr]], 0.012), { color:'glass:1', t:[sx * (W / 2 - 0.02), 0, 0], r:[0, 90, 0] });   // oromüveg
    for(const [x, z, w, d] of [[0, -D / 2 + 0.02, W - 0.06, 0.012], [-W / 2 + 0.02, 0, 0.012, D - 0.06], [W / 2 - 0.02, 0, 0.012, D - 0.06]])
      glass.add(K.box(w, Hw - b, d), { color:'glass:1', t:[x, b + (Hw - b) / 2, z] });                                     // falak
    for(const x of [-0.42, 0.42]) glass.add(K.box(0.32, Hw - b, 0.012), { color:'glass:1', t:[x, b + (Hw - b) / 2, D / 2 - 0.02] });
    for(const sx of [-1, 1]) body.add(K.box(0.05, 1.5, 0.05), { color:F, t:[sx * 0.27, 0.75, D / 2 - 0.02] });           // ajtókeret + ajtó
    body.add(K.box(0.5, 0.05, 0.05), { color:F, t:[0, 1.5, D / 2 - 0.02] }); glass.add(K.box(0.48, 1.18, 0.012), { color:'glass:1', t:[0, 0.9, D / 2 - 0.02] });
    body.add(K.box(0.03, 0.12, 0.04), { color:'steel:2', t:[0.18, 0.85, D / 2 + 0.01] });                                // kilincs
    body.add(K.box(0.9, 0.04, 0.32), { color:'wood:1', t:[0, 0.72, -0.28] });                                             // polc
    for(const sx of [-1, 1]) body.add(K.box(0.04, 0.44, 0.04), { color:'wood:2', t:[sx * 0.42, 0.5, -0.28] });
    for(let i = 0; i < 4; i++){ const x = -0.33 + i * 0.22;                                                                // cserepek palántával
      body.add(K.cylinder(0.07, 0.05, 0.1, 8), { color:'orange:2', t:[x, 0.79, -0.28] });
      body.add(blob(K, 0.08, 560 + i, 8), { color:i % 2 ? 'leaf:1' : 'leaf:0', t:[x, 0.9, -0.28] }); }
    return { body, glass };
  }

  // PALÁNTANEVELŐ: fapad, rajta három fekete tálca cellás földdel és csírákkal; alatta zöld locsolókanna
  function palantatalca(K){
    const m = K.model(), H0 = 0.78, R = rng(601);
    m.add(K.chamferBox(1.24, 0.05, 0.56, 0.015), { color:'wood:1', t:[0, H0, 0] });
    for(const sx of [-1, 1]) for(const sz of [-1, 1]) m.add(K.box(0.06, H0, 0.06), { color:'wood:2', t:[sx * 0.56, H0 / 2, sz * 0.22] });
    m.add(K.box(1.12, 0.05, 0.05), { color:'wood:2', t:[0, 0.22, -0.22] });
    for(let t = 0; t < 3; t++){ const x = -0.4 + t * 0.4;
      m.add(K.chamferBox(0.36, 0.07, 0.5, 0.012), { color:'dark:1', t:[x, H0 + 0.06, 0] });
      m.add(K.box(0.32, 0.01, 0.46), { color:'soil:2', t:[x, H0 + 0.096, 0] });
      for(let i = 0; i < 12; i++){ const cx = x - 0.1 + (i % 3) * 0.1, cz = -0.18 + Math.floor(i / 3) * 0.12, h = 0.03 + t * 0.025 + R() * 0.01;
        m.add(blob(K, 0.022 + t * 0.008, 610 + t * 12 + i, 5, 0.2), { color:t === 2 ? 'leaf:1' : 'leaf:0', t:[cx, H0 + 0.1 + h, cz], s:[1.4, 0.6, 1.1] }); } }
    m.add(K.lathe([[0.13, 0], [0.14, 0.2], [0.12, 0.28]], 10), { color:'leaf:2', t:[0.3, 0, 0.05] });                      // locsolókanna
    rod(m, K, [0.38, 0.06, 0.05], [0.58, 0.32, 0.05], 0.02, 0.014, 5, 'leaf:2');
    m.add(K.cylinder(0.035, 0.024, 0.03, 6), { color:'leaf:2', t:[0.59, 0.33, 0.05], r:[0, 0, -50] });
    m.add(K.torus(0.1, 0.014, 8, 3), { color:'leaf:2', t:[0.22, 0.3, 0.05], r:[90, 0, 0] });
    return m;
  }

  // TYÚKÓL kifutóval (1 mező): lábakon álló, deszkás ól nyeregtetővel, tojófészek-doboz oldalt, kis ajtó létrával a kifutóba;
  // a kifutót oszlopok és dróthálós (vízszintes + függőleges drót) kerítés zárja körbe elöl és oldalt. Ól a hátsó harmadban.
  function tyukol(K){
    const m = K.model(), cb = K.chamferBox, cx = -0.2, cz = -0.36, Wc = 0.7, Dc = 0.5, y0 = 0.3, Hc = 0.5;
    for(const sx of [-1, 1]) for(const sz of [-1, 1]) m.add(K.box(0.05, y0, 0.05), { color:'wood:2', t:[cx + sx * (Wc / 2 - 0.05), y0 / 2, cz + sz * (Dc / 2 - 0.05)] });
    m.add(cb(Wc, Hc, Dc, 0.02), { color:'cream:1', t:[cx, y0 + Hc / 2, cz] });                                             // ól
    for(const x of [-0.18, 0, 0.18]) m.add(K.box(0.012, Hc - 0.04, 0.01), { color:'cream:2', t:[cx + x, y0 + Hc / 2, cz + Dc / 2 + 0.002] });   // deszkahézag
    const ra = 32, run = Dc / 2 + 0.08, L = run / Math.cos(ra * Math.PI / 180) + 0.02;
    for(const sz of [-1, 1]) m.add(K.box(Wc + 0.12, 0.035, L), { color:'tomato:2', r:[sz * ra, 0, 0], t:[cx, y0 + Hc + run / 2 * Math.tan(ra * Math.PI / 180) - 0.02, cz + sz * run / 2] });
    for(const sx of [-1, 1]) m.add(K.extrude([[-Dc / 2, 0], [Dc / 2, 0], [0, (Dc / 2) * Math.tan(ra * Math.PI / 180)]], 0.02), { color:'cream:1', t:[cx + sx * (Wc / 2 - 0.01), y0 + Hc, cz], r:[0, 90, 0] });
    m.add(cb(0.22, 0.24, Dc - 0.08, 0.015), { color:'wood:1', t:[cx + Wc / 2 + 0.1, y0 + 0.14, cz] });                   // tojófészek-doboz
    m.add(K.box(0.26, 0.03, Dc - 0.04), { color:'tomato:2', t:[cx + Wc / 2 + 0.11, y0 + 0.28, cz], r:[0, 0, -14] });
    m.add(K.box(0.16, 0.2, 0.02), { color:'dark:2', t:[cx + 0.16, y0 + 0.11, cz + Dc / 2 + 0.01] });                    // bebúvó
    m.add(K.box(0.1, 0.1, 0.02), { color:'dark:2', t:[cx - 0.18, y0 + 0.3, cz + Dc / 2 + 0.01] });                      // ablak
    const rl = Math.hypot(y0, 0.42), ang = Math.atan2(y0, 0.42) * 180 / Math.PI;                                          // létra
    m.add(K.box(0.15, 0.025, rl), { color:'wood:1', t:[cx + 0.16, y0 / 2, cz + Dc / 2 + 0.21], r:[ang, 0, 0] });
    for(let i = 1; i < 4; i++) m.add(K.box(0.15, 0.02, 0.02), { color:'wood:2', t:[cx + 0.16, y0 * (1 - i / 4) + 0.02, cz + Dc / 2 + 0.42 * i / 4] });
    // kifutó: oszlopok, felső és alsó léc, drótháló
    const E = 0.66, P = [[-E, -0.1], [-E, E], [0, E], [E, E], [E, -0.1], [E, -E]], fh = 0.55;
    for(const [x, z] of P) m.add(K.box(0.05, fh + 0.05, 0.05), { color:'wood:2', t:[x, (fh + 0.05) / 2, z] });
    for(let i = 0; i < P.length - 1; i++){ const [a, b] = [P[i], P[i + 1]], len = Math.hypot(b[0] - a[0], b[1] - a[1]), yaw = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI;
      for(const y of [0.04, fh]) m.add(K.box(0.03, 0.035, len), { color:'wood:1', t:[(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2], r:[0, yaw, 0] });
      for(const y of [0.2, 0.37]) m.add(K.box(0.008, 0.008, len), { color:'steel:2', t:[(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2], r:[0, yaw, 0] });
      const n = Math.max(2, Math.round(len / 0.16)); for(let k = 1; k < n; k++){ const t = k / n;
        m.add(K.box(0.008, fh - 0.04, 0.008), { color:'steel:2', t:[a[0] + (b[0] - a[0]) * t, fh / 2, a[1] + (b[1] - a[1]) * t] }); } }
    m.add(K.lathe([[0.1, 0], [0.11, 0.05], [0.09, 0.06]], 8), { color:'steel:2', t:[0.35, 0, 0.3] });                        // itató
    for(let i = 0; i < 3; i++) m.add(blob(K, 0.15, 650 + i, 8), { color:'cardboard:0', t:[-0.3 + i * 0.25, 0.012, 0.25 - i * 0.12], s:[1.3, 0.08, 1] });   // szalma
    return m;
  }

  // TYÚK (barna tojótyúk) – RÉSZEK: body + head (a fej a helyén; bólintás: a h.neck pont körül az X tengelyen). ≈ 0,55 magas, orr +Z.
  function tyuk(K){
    const body = K.model(), head = K.model();
    body.add(blob(K, 0.17, 701, 14, 0.06), { color:'cardboard:2', t:[0, 0.27, -0.02], s:[0.85, 0.82, 1.2] });             // törzs
    for(const sx of [-1, 1]) body.add(blob(K, 0.11, 702 + sx, 8, 0.05), { color:'wood:2', t:[sx * 0.12, 0.28, -0.04], s:[0.35, 0.6, 1.2], r:[-10, 0, 0] });   // szárny
    body.add(K.hull([[-0.07, 0.3, -0.16], [0.07, 0.3, -0.16], [-0.04, 0.5, -0.3], [0.04, 0.5, -0.3], [0, 0.44, -0.36], [0, 0.26, -0.24]]), { color:'wood:2' });   // farok
    body.add(blob(K, 0.08, 705, 8), { color:'cardboard:2', t:[0, 0.38, 0.12], s:[0.9, 1.2, 0.9] });                       // nyak
    for(const sx of [-1, 1]){ rod(body, K, [sx * 0.05, 0.16, 0.0], [sx * 0.05, 0.02, 0.02], 0.016, 0.014, 4, 'honey:2');
      body.add(K.extrude([[0, 0], [0.05, 0.07], [-0.05, 0.07]], 0.012), { color:'honey:2', t:[sx * 0.05, 0.008, 0.0], r:[90, 0, 0] }); }   // lábfej
    head.add(blob(K, 0.075, 711, 10), { color:'cardboard:2', t:[0, 0.47, 0.17] });
    head.add(K.cylinder(0, 0.028, 0.07, 4), { color:'honey:2', t:[0, 0.46, 0.27], r:[90, 0, 0] });                      // csőr
    for(let k = 0; k < 3; k++) head.add(blob(K, 0.028, 712 + k, 5), { color:'red:1', t:[0, 0.545 + (k === 1 ? 0.015 : 0), 0.13 + k * 0.035], s:[0.6, 1, 1] });   // taréj
    head.add(blob(K, 0.022, 716, 5), { color:'red:1', t:[0, 0.41, 0.23], s:[0.6, 1.3, 1] });                            // toka
    for(const sx of [-1, 1]) head.add(blob(K, 0.012, 717, 5), { color:'dark:2', t:[sx * 0.06, 0.48, 0.2] });           // szem
    return { body, head, neck:[0, 0.38, 0.12] };
  }

  // INDIAI FUTÓKACSA – egyenes tartású, „palack” alakú fehér kacsa, hosszú nyak, sárga-narancs csőr és láb. RÉSZEK: body + head (h.neck).
  function kacsa(K){
    const body = K.model(), head = K.model();
    body.add(K.lathe([[0.02, 0.0], [0.09, 0.03], [0.12, 0.12], [0.11, 0.24], [0.08, 0.34], [0.05, 0.44], [0.042, 0.56]], 10), { color:'white:2', t:[0, 0.08, -0.03], r:[16, 0, 0] });   // törzs + nyak
    for(const sx of [-1, 1]) body.add(blob(K, 0.1, 801 + sx, 8, 0.05), { color:'white:1', t:[sx * 0.09, 0.26, -0.08], s:[0.3, 0.9, 0.55], r:[16, 0, 0] });   // szárny
    body.add(K.cylinder(0, 0.05, 0.08, 5), { color:'white:1', t:[0, 0.12, -0.13], r:[-120, 0, 0] });                      // farok
    for(const sx of [-1, 1]){ rod(body, K, [sx * 0.04, 0.12, -0.02], [sx * 0.045, 0.01, 0.0], 0.016, 0.014, 4, 'orange:1');
      body.add(K.extrude([[0, 0], [0.055, 0.09], [-0.055, 0.09]], 0.012), { color:'orange:1', t:[sx * 0.045, 0.008, 0.0], r:[90, 0, 0] }); }   // úszóhártyás láb
    head.add(blob(K, 0.065, 811, 10), { color:'white:2', t:[0, 0.68, 0.17], s:[0.9, 0.9, 1.2] });
    head.add(K.hull([[-0.03, 0.665, 0.22], [0.03, 0.665, 0.22], [-0.03, 0.695, 0.22], [0.03, 0.695, 0.22], [-0.022, 0.655, 0.32], [0.022, 0.655, 0.32], [0, 0.672, 0.33]]), { color:'honey:2' });   // csőr
    for(const sx of [-1, 1]) head.add(blob(K, 0.011, 812, 5), { color:'dark:2', t:[sx * 0.05, 0.7, 0.19] });
    return { body, head, neck:[0, 0.6, 0.12] };
  }

  // SZERSZÁMKAMRA (1 mező): deszkafalú kamra zöldtetővel (szedum és virágpöttyök), Z-merevítős ajtó, ablak; az oldalán ásó és gereblye
  function szerszamkamra(K){
    const m = K.model(), cb = K.chamferBox, W = 1.1, D = 0.86, Hw = 1.45, F = D / 2;
    m.add(cb(W + 0.06, 0.1, D + 0.06, 0.02), { color:'steel:2', t:[0, 0.05, 0] });                                       // alap
    m.add(cb(W, Hw, D, 0.03), { color:'wood:1', t:[0, 0.1 + Hw / 2, 0] });
    for(let i = 0; i < 6; i++) m.add(K.box(0.012, Hw - 0.04, 0.01), { color:'wood:2', t:[-W / 2 + 0.1 + i * 0.18, 0.1 + Hw / 2, F + 0.002] });   // deszkák
    const ra = 12, Lr = (D + 0.3) / Math.cos(ra * Math.PI / 180);                                                          // félnyereg-tető hátra lejt
    m.add(K.box(W + 0.22, 0.06, Lr), { color:'wood:2', t:[0, 0.1 + Hw + 0.06, 0], r:[ra, 0, 0] });
    m.add(K.box(W + 0.12, 0.06, Lr - 0.1), { color:'grass:1', t:[0, 0.1 + Hw + 0.12, 0], r:[ra, 0, 0] });                // zöldtető
    for(let i = 0; i < 8; i++){ const [x, z] = spread(i, 8, 0.42, 1.3); m.add(blob(K, 0.05, 900 + i, 6), { color:i % 3 ? 'leaf:1' : 'blossom:1', t:[x, 0.1 + Hw + 0.16 - z * Math.tan(ra * Math.PI / 180), z * 0.95], s:[1.2, 0.6, 1] }); }
    m.add(cb(0.5, 1.16, 0.05, 0.012), { color:'wood:2', t:[-0.2, 0.1 + 0.6, F + 0.02] });                                 // ajtó
    for(const y of [0.25, 1.05]) m.add(K.box(0.46, 0.07, 0.03), { color:'wood:1', t:[-0.2, 0.1 + y, F + 0.05] });
    rod(m, K, [-0.4, 0.38, F + 0.05], [0.0, 1.12, F + 0.05], 0.025, 0.025, 4, 'wood:1');
    m.add(K.sphere(0.03, 6, 3), { color:'steel:1', t:[-0.02, 0.75, F + 0.07] });
    m.add(cb(0.32, 0.3, 0.05, 0.012), { color:'wood:2', t:[0.3, 1.05, F + 0.02] });                                       // ablak
    m.add(K.box(0.24, 0.22, 0.02), { color:'glass:1', t:[0.3, 1.05, F + 0.045] });
    m.add(K.box(0.02, 0.22, 0.03), { color:'wood:2', t:[0.3, 1.05, F + 0.05] });
    rod(m, K, [W / 2 + 0.05, 0.02, 0.18], [W / 2 + 0.05, 1.05, 0.05], 0.022, 0.022, 4, 'wood:1');                        // ásó
    m.add(K.box(0.16, 0.24, 0.025), { color:'steel:1', t:[W / 2 + 0.05, 0.12, 0.19], r:[0, 90, -4] });
    rod(m, K, [W / 2 + 0.05, 0.02, -0.24], [W / 2 + 0.05, 1.1, -0.12], 0.02, 0.02, 4, 'wood:1');                        // gereblye
    m.add(K.box(0.04, 0.04, 0.32), { color:'steel:2', t:[W / 2 + 0.06, 1.12, -0.12] });
    for(let i = 0; i < 5; i++) m.add(K.box(0.012, 0.07, 0.012), { color:'steel:2', t:[W / 2 + 0.08, 1.12, -0.25 + i * 0.065] });
    return m;
  }

  // TALICSKA: zöld teknő földdel töltve (opts.tele = false: üres), egy kerék elöl (+Z), két fogantyú hátra, két láb
  function talicska(K, o){
    o = o || {};
    const m = K.model();
    const P = []; for(const [y, w, z0, z1] of [[0.32, 0.22, -0.2, 0.18], [0.58, 0.36, -0.34, 0.36]]) for(const sx of [-1, 1]) for(const z of [z0, z1]) P.push([sx * w, y, z]);
    m.add(K.hull(P), { color:'leaf:1' });                                                                                 // teknő
    m.add(K.box(0.74, 0.03, 0.72), { color:'leaf:2', t:[0, 0.59, 0.01] });                                                // perem
    if(o.tele !== false) m.add(blob(K, 0.3, 951, 12, 0.2), { color:'soil:1', t:[0, 0.6, 0.0], s:[1.05, 0.32, 1.1] });
    else m.add(K.box(0.62, 0.012, 0.6), { color:'leaf:2', t:[0, 0.585, 0.01] });
    m.add(K.cylinder(0.17, 0.17, 0.07, 12), { color:'dark:1', t:[0, 0.17, 0.42], r:[0, 0, 90] });                        // kerék
    m.add(K.cylinder(0.06, 0.06, 0.08, 8), { color:'steel:1', t:[0, 0.17, 0.42], r:[0, 0, 90] });
    for(const sx of [-1, 1]){ rod(m, K, [sx * 0.05, 0.17, 0.42], [sx * 0.24, 0.42, -0.2], 0.022, 0.022, 4, 'steel:2');      // váz
      rod(m, K, [sx * 0.24, 0.42, -0.2], [sx * 0.28, 0.5, -0.74], 0.022, 0.022, 4, 'steel:2');                             // fogantyú
      m.add(K.cylinder(0.03, 0.03, 0.14, 6), { color:'dark:1', t:[sx * 0.282, 0.505, -0.69], r:[96, 0, 0] });
      rod(m, K, [sx * 0.2, 0.36, -0.2], [sx * 0.2, 0.0, -0.28], 0.02, 0.02, 4, 'steel:2'); }                               // lábak
    return m;
  }

  // SZIKKASZTÓ ÁROK (swale): a szintvonalon futó sekély árok, mögötte (a lejtő alatt, +Z) a kiemelt föld-töltés bokrokkal, fűvel, virággal.
  // Mezőről mezőre összeér az X mentén (opts.irany = 'x' | 'z'). opts.viz = true: víz az árokban → RÉSZEK: body + water.
  function arok(K, o){
    o = o || {};
    const b = K.model(), water = K.model(), R = rng(1001), L = TILE;
    const along = (pts, c) => b.add(K.extrude(pts.map(([z, y]) => [-z, y]), L), { color:c, r:[0, 90, 0] });               // keresztmetszet (z, y) az X mentén
    along([[-0.7, 0], [-0.7, 0.06], [-0.46, 0.06], [-0.42, 0.04], [-0.42, 0]], 'grass:2');                                 // a felső (lejtő felőli) sík
    along([[-0.42, 0], [-0.42, 0.04], [-0.3, 0.012], [-0.2, 0.005], [-0.1, 0.02], [-0.06, 0.05], [-0.06, 0]], 'soil:1');   // árok-meder
    along([[-0.06, 0], [-0.06, 0.05], [0.04, 0.17], [0.18, 0.22], [0.34, 0.17], [0.5, 0.07], [0.5, 0]], 'leaf:1');          // töltés
    along([[0.5, 0], [0.5, 0.07], [0.7, 0.06], [0.7, 0]], 'grass:2');
    for(let i = 0; i < 3; i++){ const x = -0.45 + i * 0.45 + (R() - 0.5) * 0.08;                                          // bokrok a töltésen
      b.add(blob(K, 0.17, 1010 + i, 12), { color:'leaf:2', t:[x, 0.34, 0.2], s:[1, 0.95, 1] });
      b.add(blob(K, 0.11, 1020 + i, 8), { color:i % 2 ? 'leaf:1' : 'grass:1', t:[x + 0.04, 0.46, 0.17] }); }
    for(let i = 0; i < 6; i++){ const x = -0.6 + i * 0.24, z = 0.38 + (i % 2) * 0.06, h = 0.22 + R() * 0.08;                // fűcsomók és virágok a lejtőn
      for(let k = 0; k < 3; k++){ const a = k * 2.1 + R(); rod(b, K, [x, 0.1, z], [x + Math.sin(a) * 0.06, h, z + Math.cos(a) * 0.06], 0.02, 0, 3, 'grass:1'); }
      b.add(blob(K, 0.035, 1030 + i, 5), { color:'honey:1', t:[x + 0.06, h - 0.02, z - 0.05], s:[1, 0.6, 1] }); }
    for(let i = 0; i < 4; i++) b.add(blob(K, 0.05, 1040 + i, 6), { color:'steel:2', t:[-0.55 + i * 0.36, 0.06, -0.08], s:[1.2, 0.6, 1] });   // kövek a mederszélen
    let res = b;
    if(o.viz){ water.add(K.box(L, 0.012, 0.2), { color:'water:1', t:[0, 0.024, -0.22] }); res = { body:b, water }; }
    if(o.irany !== 'z') return res;
    const turn = mm => K.model().merge(mm, { r:[0, 90, 0] });
    return res === b ? turn(b) : { body:turn(b), water:turn(water) };
  }

  // CSEPEGTETŐ CSŐ az ágyás szélén (az X mentén, a mező teljes hosszán): fekete cső csepegtetőkkel, vízcseppek, nedves foltok,
  // a bal végén csatlakozó elzárócsappal. Talp y = 0 – a játék az ágyás felszínére (agyas → m.top) teszi.
  function csepegteto(K){
    const m = K.model(), L = 1.3;
    m.add(K.cylinder(0.018, 0.018, L, 6), { color:'dark:2', t:[0, 0.018, 0], r:[0, 0, 90] });
    for(let i = 0; i < 5; i++){ const x = -0.52 + i * 0.26;
      m.add(K.box(0.04, 0.03, 0.045), { color:'dark:1', t:[x, 0.03, 0.01] });
      m.add(blob(K, 0.016, 1101 + i, 5), { color:'water:1', t:[x, 0.02, 0.05], s:[0.8, 1.3, 0.8] });
      m.add(blob(K, 0.08, 1110 + i, 8), { color:'soil:2', t:[x, 0.002, 0.06], s:[1.2, 0.06, 0.9] }); }
    m.add(K.cylinder(0.028, 0.028, 0.08, 8), { color:'blue:1', t:[-L / 2 - 0.02, 0.024, 0], r:[0, 0, 90] });              // csatlakozó
    m.add(K.box(0.03, 0.06, 0.012), { color:'blue:1', t:[-L / 2 - 0.02, 0.07, 0] });
    m.add(K.cylinder(0.022, 0.022, 0.04, 6), { color:'dark:1', t:[L / 2 + 0.01, 0.018, 0], r:[0, 0, 90] });                 // végdugó
    return m;
  }

  // TERMÉNYES LÁDA (a rendelések 3D „játékszere”): léces fa láda paradicsommal, répával, salátával, kis sütőtökkel, paprikával, krumplival.
  // ≈ 0,7 × 0,45 egység – a játék nagyítja.
  function kosar(K){
    const m = K.model(), W = 0.7, D = 0.45, Hh = 0.26, R = rng(1201);
    m.add(K.box(W - 0.04, 0.02, D - 0.04), { color:'wood:2', t:[0, 0.02, 0] });
    for(const sx of [-1, 1]) for(const sz of [-1, 1]) m.add(K.box(0.04, Hh, 0.04), { color:'wood:2', t:[sx * (W / 2 - 0.02), Hh / 2, sz * (D / 2 - 0.02)] });
    for(const y of [0.06, 0.19]){ for(const sz of [-1, 1]) m.add(K.box(W, 0.08, 0.02), { color:'wood:1', t:[0, y, sz * (D / 2 - 0.01)] });
      for(const sx of [-1, 1]) m.add(K.box(0.02, 0.08, D), { color:'wood:1', t:[sx * (W / 2 - 0.01), y, 0] }); }
    m.add(K.box(W - 0.06, 0.12, D - 0.06), { color:'wood:2', t:[0, 0.12, 0] });                                         // a láda alja (árnyék)
    m.add(K.lathe([[0.02, 0.0], [0.09, 0.02], [0.1, 0.07], [0.07, 0.12], [0.02, 0.13]], 10), { color:'orange:1', t:[-0.18, 0.17, -0.06] });   // sütőtök
    m.add(K.cylinder(0.012, 0.015, 0.05, 5), { color:'wood:2', t:[-0.18, 0.32, -0.06] });
    m.add(blob(K, 0.11, 1210, 12), { color:'leaf:1', t:[0.17, 0.27, -0.07], s:[1.1, 0.75, 1.1] });                      // saláta
    m.add(blob(K, 0.08, 1211, 8), { color:'leaf:0', t:[0.17, 0.32, -0.07] });
    for(const [x, z] of [[-0.02, 0.1], [0.07, 0.12], [0.03, 0.02]]) m.add(blob(K, 0.05, 1220 + x * 100, 8), { color:'tomato:1', t:[x, 0.27, z] });   // paradicsom
    for(const [x, a] of [[0.2, 20], [0.25, -10]]){ m.add(K.cylinder(0.025, 0.004, 0.2, 6), { color:'orange:1', t:[x, 0.28, 0.1], r:[90, a, 0] });   // répa + zöldje
      rod(m, K, [x - 0.02, 0.28, 0.0], [x - 0.04, 0.38, -0.08], 0.016, 0, 3, 'leaf:1'); }
    m.add(blob(K, 0.045, 1230, 7), { color:'tomato:1', t:[-0.24, 0.25, 0.12], s:[0.9, 1.4, 0.9] });                       // paprika
    m.add(blob(K, 0.045, 1231, 7), { color:'honey:2', t:[-0.14, 0.24, 0.13], s:[0.9, 1.4, 0.9] });
    for(const [x, z] of [[0.0, -0.15], [0.07, -0.16]]) m.add(blob(K, 0.04, 1240 + x * 100, 6), { color:'cardboard:1', t:[x, 0.24, z], s:[1.2, 0.8, 1] });   // krumpli
    return m;
  }

  // ================= MÉHESD-TÉRKÉP: a birtok épülete (DIORÁMA-LÉPTÉK: 1 egység ≈ 25 m, mint a VAROS_MODELS) =================
  // Füves telek: hátul balra kis tanya-ház (krém fal, cseréptető, napelem, kémény), hátul jobbra fóliasátor, elöl veteményes-sávok
  // (zöld sorok, egyikben piros termés), jobb elöl kis tó náddal, bal elöl gyümölcsfa piros termésekkel, két tyúk-pötty. 1,4 × 1,0, max. ≈ 0,4.
  function birtok(K){
    const m = K.model(), R = rng(1301), g = 0.04;
    m.add(K.chamferBox(1.4, 0.04, 1.0, 0.015), { color:'grass:1', t:[0, 0.02, 0] });                                       // telek
    const hx = -0.36, hz = -0.24, hw = 0.4, hd = 0.28, hh = 0.18;                                                           // ház
    m.add(K.chamferBox(hw, hh, hd, 0.012), { color:'cream:1', t:[hx, g + hh / 2, hz] });
    const ra = 34, run = hd / 2 + 0.03, Lr = run / Math.cos(ra * Math.PI / 180) + 0.02, ry = g + hh + run / 2 * Math.tan(ra * Math.PI / 180);
    for(const sz of [-1, 1]) m.add(K.box(hw + 0.06, 0.025, Lr), { color:'tomato:2', r:[sz * ra, 0, 0], t:[hx, ry, hz + sz * run / 2] });
    for(const sx of [-1, 1]) m.add(K.extrude([[-hd / 2, 0], [hd / 2, 0], [0, (hd / 2) * Math.tan(ra * Math.PI / 180)]], 0.02), { color:'cream:1', t:[hx + sx * (hw / 2 - 0.01), g + hh, hz], r:[0, 90, 0] });
    m.add(K.box(0.16, 0.012, 0.09), { color:'dark:3', t:[hx + 0.06, ry + 0.02, hz + run / 2 - 0.01], r:[ra, 0, 0] });      // napelem
    m.add(K.box(0.04, 0.1, 0.04), { color:'tomato:2', t:[hx - 0.12, ry + 0.06, hz - 0.05] });                              // kémény
    m.add(K.box(0.05, 0.1, 0.01), { color:'wood:2', t:[hx + 0.08, g + 0.05, hz + hd / 2 + 0.004] });                      // ajtó
    for(const x of [-0.1, -0.02]) m.add(K.box(0.045, 0.05, 0.01), { color:'dark:3', t:[hx + x, g + 0.11, hz + hd / 2 + 0.004] });   // ablak
    const tx = 0.34, tz = -0.22, tw = 0.36, tl = 0.42, th = 0.17, end = [];                                                 // fóliasátor
    for(let k = 0; k <= 8; k++){ const a = k / 8 * Math.PI; end.push([Math.cos(a) * tw / 2, Math.sin(a) * th]); }
    m.add(K.extrude(end, tl), { color:'glass:0', t:[tx, g, tz] });
    for(let i = 0; i < 4; i++) m.add(archG(K, tw + 0.012, th + 0.008, 0.01, 0.012, 8), { color:'dark:3', t:[tx, g, tz - tl / 2 + i * tl / 3] });
    m.add(K.box(0.08, 0.11, 0.01), { color:'wood:2', t:[tx, g + 0.055, tz + tl / 2 + 0.006] });
    for(let i = 0; i < 4; i++){ const x = -0.5 + i * 0.16, z = 0.22;                                                         // veteményes-sávok
      m.add(K.chamferBox(0.11, 0.025, 0.34, 0.008), { color:'wood:2', t:[x, g + 0.012, z] });
      for(let k = 0; k < 4; k++) m.add(blob(K, 0.03, 1310 + i * 4 + k, 6), { color:'leaf:1', t:[x, g + 0.04, z - 0.12 + k * 0.08], s:[1, 0.8, 1] });
      if(i === 2) for(const k of [0, 2]) m.add(blob(K, 0.026, 1330 + k, 6), { color:'tomato:2', t:[x + 0.03, g + 0.04, z - 0.1 + k * 0.08], s:[1.1, 0.8, 1.1] }); }
    m.add(K.cylinder(0.14, 0.15, 0.012, 10), { color:'water:1', t:[0.42, g + 0.004, 0.22], s:[1.25, 1, 0.9] });           // tó
    for(let i = 0; i < 7; i++){ const a = i / 7 * Math.PI * 2; m.add(blob(K, 0.03, 1340 + i, 5), { color:'cream:1', t:[0.42 + Math.sin(a) * 0.185, g + 0.01, 0.22 + Math.cos(a) * 0.135], s:[1.2, 0.7, 1] }); }
    for(let i = 0; i < 4; i++) rod(m, K, [0.27 + i * 0.03, g, 0.14 - i * 0.015], [0.26 + i * 0.035, g + 0.12 + R() * 0.04, 0.12 - i * 0.015], 0.006, 0.003, 3, 'leaf:1');   // nád
    m.add(K.cylinder(0.014, 0.02, 0.14, 6), { color:'wood:2', t:[-0.1, g + 0.07, 0.36] });                                 // gyümölcsfa
    for(const [x, y, z, r] of [[-0.1, 0.24, 0.36, 0.1], [-0.16, 0.2, 0.33, 0.07], [-0.04, 0.21, 0.39, 0.07]]) m.add(blob(K, r, 1350 + x * 100, 10), { color:'leaf:1', t:[x, y, z] });
    for(let i = 0; i < 6; i++){ const a = i * 1.05; m.add(blob(K, 0.014, 1360 + i, 5), { color:'tomato:2', t:[-0.1 + Math.sin(a) * 0.095, 0.22 + (i % 2) * 0.04, 0.36 + Math.cos(a) * 0.095] }); }
    for(const [x, z] of [[0.08, 0.02], [0.14, 0.06]]){ m.add(blob(K, 0.02, 1370 + x * 100, 6), { color:'cream:1', t:[x, g + 0.022, z], s:[0.8, 0.9, 1.2] });   // tyúkok
      m.add(blob(K, 0.008, 1380 + x * 100, 5), { color:'tomato:2', t:[x, g + 0.045, z + 0.018] }); }
    m.add(flat(K, [[-0.18, 0.5], [-0.12, 0.5], [-0.12, 0.12], [-0.2, -0.08], [-0.24, -0.1], [-0.18, 0.12]], 0.008), { color:'cream:1', r:LAY, t:[0, g + 0.002, 0] });   // ösvény
    return m;
  }

  const BT_MODELS = Object.assign(root.BT_MODELS || {}, { TILE, bozot, gazkupac, szemetkupac, ko, raklap, agyas, foliasator, uveghaz, palantatalca,
    tyukol, tyuk, kacsa, szerszamkamra, talicska, arok, csepegteto, kosar, birtok, _h:H });
  root.BT_MODELS = BT_MODELS;
  if(typeof module !== 'undefined' && module.exports) module.exports = BT_MODELS;
})(typeof window !== 'undefined' ? window : globalThis);
