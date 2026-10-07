// ============================================================
//  KÖZÖSSÉGI KAPTÁR (kozosseg / kz) – 3D modellek B szinten (docs/rajzolas.md) a beeco Kaptár közösségi teréhez. KZ_MODELS.
//  A jelenet, ami ezekből a közösség élő adatából kaptárt épít: 3d/kaptar-jelenet.js (beecoKaptar).
//
//  MÉRTÉK: 1 egység ≈ 1 m (a beecoVilag szigetéhez illik: R = 15). Y fel, +Z = eleje (a rajsejt ajtaja, a fal írt oldala), talp y = 0.
//  Modellek:
//    rajsejt(K, { szin, R, magas })      – hatszögletű, felülről nyitott sejt-ház egy rajnak; az ajtó +Z felé (benézhető)
//    jovoTorony(K, { emelet, kesz })     – a beeco útiterve: emeletenként egy mérföldkő; kész = méz, a mostani világos, a jövő zsálya
//    esemenyKut(K)                       – kőkút tetővel, vödörrel: a közelgő események és a havi helyszínek „kútja”
//    fal(K, { tipus, db, seed })         – parafatábla oszlopokon; tipus 'vicc' (színes cetlik) | 'koszono' (méz-hatszög érmék)
//    kikoto(K)                           – RÉSZEK { molo, hajo }: stég és vitorlás (a havi retró vitorlása); a hajó külön ringatható
//    kapu(K)                             – hatszög-íves bejárat két oszloppal (a beeco.hu nyilvános belépője)
//    alap(K, R)                          – a sejt talapzata: lapos hatszög-lap (a jelenet fény-gyűrűjéhez)
//  Színek: csak ART.MAT ('anyag:tónus'). Önálló fájl: js/art/art.js + js/art/model-kit.js kell előtte.
//  Katalógus: 3d/katalogus.js („Közösségi Kaptár”), galéria: modellek.html.
// ============================================================
(function(root){
  const hexPts = (r, rot) => { const out = [], q = (rot || 0) * Math.PI / 180; for(let i = 0; i < 6; i++){ const a = q + i * Math.PI / 3; out.push([Math.cos(a) * r, Math.sin(a) * r]); } return out; };
  // vízszintes hatszög-lemez (vastagság Y irányú), a teteje y = th
  const hexSlab = (m, K, r, th, y, color) => m.add(K.extrude(hexPts(r, 30).map(([x, z]) => [x, -z]), th), { color, r:[-90, 0, 0], t:[0, y + th / 2, 0] });
  function rng(seed){ let s = Math.max(1, Math.floor(seed || 1)) % 2147483647; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  // ---- rajsejt: 5 fal (az ajtó-oldal nyitott), perem, padló, belső polc és asztal ----
  function rajsejt(K, o){
    o = Object.assign({ szin:'honey', R:1.8, magas:1.3 }, o || {});
    const m = K.model(), R = o.R, H = o.magas, side = R, th = 0.16;
    hexSlab(m, K, R + 0.12, 0.14, 0, 'wood:2');                       // padló
    for(let i = 0; i < 6; i++){
      const a = (i * 60) * Math.PI / 180, mid = R * Math.cos(Math.PI / 6);
      if(i === 1) continue;                                           // az ajtó oldala (+Z felé) nyitva marad
      const x = Math.sin(a + Math.PI / 6) * mid, z = Math.cos(a + Math.PI / 6) * mid, ry = (a + Math.PI / 6) * 180 / Math.PI;
      m.add(K.chamferBox(side * 0.98, H, th, 0.04), { color:o.szin + ':1', t:[x, 0.14 + H / 2, z], r:[0, ry, 0] });
      m.add(K.chamferBox(side * 1.02, 0.1, th + 0.08, 0.03), { color:o.szin + ':2', t:[x, 0.14 + H + 0.05, z], r:[0, ry, 0] });
    }
    // ajtófélfák (a nyitott oldal két szélén)
    const dz = R * Math.cos(Math.PI / 6), dx = side / 2;
    for(const sx of [-1, 1]) m.add(K.chamferBox(0.16, H + 0.1, 0.22, 0.03), { color:'wood:3', t:[sx * dx, 0.14 + (H + 0.1) / 2, dz], r:[0, 0, 0] });
    // belső berendezés: polc a hátsó falnál, kis hatszög-asztal középen
    m.add(K.chamferBox(1.1, 0.08, 0.32, 0.02), { color:'wood:1', t:[0, 0.75, -R * 0.62] });
    m.add(K.chamferBox(1.1, 0.08, 0.32, 0.02), { color:'wood:1', t:[0, 1.1, -R * 0.62] });
    for(const [x, c] of [[-0.35, 'cream:2'], [0, o.szin + ':2'], [0.32, 'wood:2']]) m.add(K.chamferBox(0.14, 0.2, 0.18, 0.02), { color:c, t:[x, 0.89, -R * 0.62] });
    m.add(K.cylinder(0.42, 0.42, 0.07, 6), { color:'cream:2', t:[0, 0.62, 0], r:[0, 30, 0] });
    m.add(K.cylinder(0.06, 0.08, 0.48, 6), { color:'wood:3', t:[0, 0.38, 0] });
    return m;
  }

  // ---- a jövő tornya: emeletenként egy hatszög-szint, felül jelzőfény ----
  function jovoTorony(K, o){
    o = Object.assign({ emelet:5, kesz:2 }, o || {});
    const m = K.model(), n = Math.max(1, Math.min(8, o.emelet)), fh = 0.9;
    hexSlab(m, K, 2.0, 0.3, 0, 'wood:3');
    for(let i = 0; i < n; i++){
      const r = 1.55 - i * (0.55 / Math.max(1, n - 1)), y = 0.3 + i * fh;
      const color = i < o.kesz ? 'honey:1' : i === o.kesz ? 'honey:0' : 'sage:1';
      m.add(K.cylinder(r, r, fh - 0.1, 6), { color, t:[0, y + (fh - 0.1) / 2, 0], r:[0, 30, 0] });
      m.add(K.cylinder(r + 0.1, r + 0.1, 0.1, 6), { color:'wood:3', t:[0, y + fh - 0.05, 0], r:[0, 30, 0] });
      // ablakok: két szemközti oldalon
      for(const a of [0, 180]) m.add(K.chamferBox(0.32, 0.36, 0.06, 0.02), { color:i < o.kesz ? 'gold:2' : 'sky:1', t:[Math.sin(a * Math.PI / 180) * (r * 0.87), y + 0.42, Math.cos(a * Math.PI / 180) * (r * 0.87)], r:[0, a, 0] });
    }
    const top = 0.3 + n * fh;
    m.add(K.cylinder(0, 0.75, 0.9, 6), { color:'honey:2', t:[0, top + 0.45, 0], r:[0, 30, 0] });
    m.add(K.sphere(0.2, 8, 6), { color:'gold:1', t:[0, top + 1.05, 0] });
    return m;
  }

  // ---- eseménykút ----
  function esemenyKut(K){
    const m = K.model();
    m.add(K.lathe([[0.95, 0], [0.98, 0.35], [0.95, 0.7], [0.72, 0.7], [0.72, 0.12]], 14), { color:'steel:1' });
    m.add(K.torus(0.84, 0.07, 14, 5), { color:'steel:2', t:[0, 0.72, 0] });
    m.add(K.cylinder(0.72, 0.72, 0.04, 14), { color:'water:1', t:[0, 0.45, 0] });
    for(const sx of [-1, 1]) m.add(K.chamferBox(0.14, 1.6, 0.14, 0.03), { color:'wood:2', t:[sx * 0.9, 1.1, 0] });
    m.add(K.cylinder(0.05, 0.05, 1.9, 8), { color:'wood:3', t:[0, 1.55, 0], r:[0, 0, 90] });
    for(const sz of [-1, 1]) m.add(K.chamferBox(2.3, 0.08, 0.85, 0.02), { color:'honey:2', t:[0, 2.08, sz * 0.36], r:[sz * 28, 0, 0] });
    m.add(K.cylinder(0.16, 0.12, 0.22, 10), { color:'cardboard:2', t:[0, 1.15, 0] });
    m.add(K.cylinder(0.01, 0.01, 0.3, 4), { color:'dark:2', t:[0, 1.4, 0] });
    return m;
  }

  // ---- fal: parafatábla cetlikkel (vicc) vagy méz-érmékkel (köszönő) ----
  function fal(K, o){
    o = Object.assign({ tipus:'vicc', db:7, seed:3 }, o || {});
    const m = K.model(), R = rng(o.seed), W = 3, H = 1.6, y0 = 0.6;
    for(const sx of [-1, 1]) m.add(K.chamferBox(0.16, y0 + H + 0.2, 0.16, 0.03), { color:'wood:3', t:[sx * (W / 2 + 0.05), (y0 + H + 0.2) / 2, 0] });
    m.add(K.chamferBox(W, H, 0.1, 0.03), { color:'cardboard:1', t:[0, y0 + H / 2, 0] });
    m.add(K.chamferBox(W + 0.3, 0.12, 0.3, 0.03), { color:o.tipus === 'vicc' ? 'blossom:2' : 'honey:2', t:[0, y0 + H + 0.12, 0.02] });
    const szinek = o.tipus === 'vicc' ? ['honey:0', 'blossom:0', 'sky:0', 'leaf:0', 'cream:1'] : ['honey:1', 'gold:1', 'honey:0'];
    const n = Math.max(0, Math.min(14, o.db));
    for(let i = 0; i < n; i++){
      const col = i % 5, row = Math.floor(i / 5), x = -W / 2 + 0.35 + col * 0.58 + (R() - 0.5) * 0.1, y = y0 + H - 0.35 - row * 0.5 + (R() - 0.5) * 0.08;
      if(o.tipus === 'vicc') m.add(K.box(0.42, 0.36, 0.02), { color:szinek[i % szinek.length], t:[x, y, 0.07], r:[0, 0, (R() - 0.5) * 14] });
      else m.add(K.cylinder(0.19, 0.19, 0.04, 6), { color:szinek[i % szinek.length], t:[x, y, 0.07], r:[90, 0, 30] });
    }
    return m;
  }

  // ---- kikötő: stég + vitorlás (RÉSZEK) ----
  function kikoto(K){
    const molo = K.model(), hajo = K.model();
    for(let i = 0; i < 6; i++) molo.add(K.chamferBox(1.6, 0.08, 0.36, 0.02), { color:i % 2 ? 'wood:1' : 'wood:2', t:[0, 0.5, i * 0.4] });
    for(const sx of [-1, 1]) for(const z of [0.2, 2.0]) molo.add(K.cylinder(0.08, 0.08, 0.9, 8), { color:'wood:3', t:[sx * 0.72, 0.4, z] });
    const hull = [[-0.9, 0.35], [0.9, 0.35], [1.25, 0.6], [0.7, 0], [-0.7, 0], [-1.05, 0.6]];
    hajo.add(K.extrude(hull, 0.9), { color:'teal:1', r:[0, 90, 0] });
    hajo.add(K.chamferBox(0.8, 0.06, 1.7, 0.02), { color:'wood:1', t:[0, 0.48, 0] });
    hajo.add(K.cylinder(0.04, 0.05, 2.2, 8), { color:'wood:3', t:[0, 1.55, 0.1] });
    hajo.add(K.extrude([[0, 0], [0, 1.8], [0.95, 0.1]], 0.03), { color:'cream:1', t:[0, 0.6, 0.15], r:[0, -90, 0] });
    hajo.add(K.extrude([[0, 0], [0.32, 0.1], [0, 0.2]], 0.02), { color:'honey:1', t:[0, 2.6, 0.1], r:[0, -90, 0] });
    return { molo, hajo };
  }

  // ---- kapu: két hatszög-oszlop, fölöttük hatszög-keret ----
  function kapu(K){
    const m = K.model();
    for(const sx of [-1, 1]){
      m.add(K.cylinder(0.32, 0.38, 2.6, 6), { color:'honey:1', t:[sx * 1.5, 1.3, 0], r:[0, 30, 0] });
      m.add(K.cylinder(0.45, 0.45, 0.18, 6), { color:'wood:3', t:[sx * 1.5, 0.09, 0], r:[0, 30, 0] });
    }
    m.add(K.chamferBox(3.7, 0.3, 0.5, 0.05), { color:'wood:2', t:[0, 2.75, 0] });
    m.add(K.torus(0.7, 0.1, 6, 4), { color:'honey:2', t:[0, 3.55, 0], r:[90, 0, 0] });
    m.add(K.cylinder(0.5, 0.5, 0.06, 6), { color:'honey:0', t:[0, 3.55, -0.02], r:[90, 0, 0] });
    return m;
  }

  // ---- alap: lapos hatszög-lap (pl. a rajsejt alatti fény-gyűrű helye) ----
  function alap(K, R, color){
    const m = K.model();
    hexSlab(m, K, R || 2.1, 0.06, 0, color || 'leaf:1');
    return m;
  }

  const KZ_MODELS = { rajsejt, jovoTorony, esemenyKut, fal, kikoto, kapu, alap, _h:{ hexPts, rng } };
  root.KZ_MODELS = KZ_MODELS;
  if(typeof module !== 'undefined' && module.exports) module.exports = KZ_MODELS;
})(typeof window !== 'undefined' ? window : globalThis);
