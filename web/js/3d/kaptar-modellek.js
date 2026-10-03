// ============================================================
//  MÉHPILÓTA (kaptar / kp) – 3D modellek B szinten (docs/rajzolas.md): méhek, kaptár, keret, lép-sejt, kas. KP_MODELS.
//  A virágok, a veszélyek és a verseny-koszorú külön fájlban: 3d/kaptar-viragok.js (ugyanebbe a KP_MODELS-be kerülnek).
//
//  MÉRTÉK: 1 egység = 1 dm (10 cm), VALÓDI ARÁNYOKKAL – a dolgozó méh ≈ 0,12 hosszú, a keret 4,8 széles, a kaptár ≈ 8 magas.
//    (Méterben a 1,2 cm-es méh a galéria közeli vágósíkja alá esne.) A játék a saját léptékére nagyít: minden builder
//    elfogad { s } nagyítást (pl. KP_MODELS.worker(MODEL, { s:4 })), a virágok { h } célmagasságot is.
//  Tengelyek: Y fel, +Z = eleje (a méh orra, a kaptár röpnyílása), talp y = 0 (kivéve, ahol a leírás mást mond).
//  Méhek: RÉSZEK { body, wingL, wingR, foot } – mint az EK_MODELS.bee: az origó a SZÁRNY-ZSANÉR (a tor teteje), a szárnyakat
//    a Z tengely körül forgatva csapkodtatod (wingL: +, wingR: − irányba nyílik); foot = a legalsó pont (negatív) – leültetéskor y − foot.
//    A szárny 'glass:*' színű: a játékban a material(hex, kulcs) visszahívásban legyen áttetsző (mint a galériában).
//    Arc (szem-pupilla, mosoly) szándékosan NINCS: ez valódi háziméh, a beeco méhecskét nem rajzoljuk újra.
//  Lép-sejt: KP_MODELS.cellGeometry(THREE, r, mélység, { cap }) – hatszög-hasáb BufferGeometry InstancedMesh-hez (lásd lent),
//    KP_MODELS.cellGrid(…) – sejtközéppontok, KP_MODELS.CELL – a sejt-állapotok tartalom-színei (névvel, a palettából).
//  Önálló fájl: csak js/art/art.js + js/art/model-kit.js kell előtte. Katalógus: 3d/katalogus.js („Méhpilóta”), galéria: modellek.html.
// ============================================================
(function(root){
  // ---- segédek (az EK_MODELS._h másolatai, hogy a fájl önálló legyen; a virágos fájl is ezeket használja: KP_MODELS._h) ----
  function rng(seed){ let s = Math.max(1, Math.floor(seed || 1)) % 2147483647; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function blob(K, r, seed, n, jit){   // szabálytalan, lapjaira tört gömb (konvex burok) ≈ 2n − 4 háromszög
    const R = rng(seed || 1), P = [], ga = Math.PI * (3 - Math.sqrt(5)); n = n || 14; jit = jit == null ? 0.18 : jit;
    for(let i = 0; i < n; i++){ const y = 1 - (i + 0.5) / n * 2, rad = Math.sqrt(1 - y * y), a = i * ga + R() * 0.6, k = r * (1 - jit / 2 + R() * jit);
      P.push([Math.cos(a) * rad * k, y * k, Math.sin(a) * rad * k]); }
    return K.hull(P);
  }
  function rod(m, K, a, b, r0, r1, seg, color){   // henger két pont között (r0 az „a”, r1 a „b” végén; r1 = 0 → kúp)
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d) || 1e-6;
    const th = Math.acos(Math.max(-1, Math.min(1, d[1] / L))) * 180 / Math.PI, ph = Math.atan2(d[0], d[2]) * 180 / Math.PI;
    m.add(K.cylinder(r1, r0, L, seg), { color, t:[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], r:[th, ph, 0] });
  }
  // lapos sokszög a vízszintes (XZ) síkban: pts = [[x, z], …]; hozzáadáskor r:[-90, 0, 0] fekteti le (vastagság Y irányú)
  const flat = (K, pts, th) => K.extrude(pts.map(([x, z]) => [x, -z]), th);
  // ellipszis (XZ), rot fokban elforgatva
  const ell = (cx, cz, a, b, n, rot) => { const q = (rot || 0) * Math.PI / 180, out = [];
    for(let i = 0; i < n; i++){ const t = i / n * Math.PI * 2, x = Math.cos(t) * a, z = Math.sin(t) * b; out.push([cx + x * Math.cos(q) - z * Math.sin(q), cz + x * Math.sin(q) + z * Math.cos(q)]); }
    return out; };
  // forgástest fedőlapok nélkül (a sávos potrohnál a belső fedők csak pazarolnák a háromszöget): prof = [[sugár, y], …] alulról felfelé
  function latheOpen(prof, seg){
    const t = [], ring = (r, y, i) => { const a = i / seg * 2 * Math.PI; return [r * Math.sin(a), y, r * Math.cos(a)]; };
    for(let p = 0; p < prof.length - 1; p++) for(let i = 0; i < seg; i++){
      const [r0, y0] = prof[p], [r1, y1] = prof[p + 1], a = ring(r0, y0, i), b = ring(r0, y0, i + 1), c = ring(r1, y1, i + 1), d = ring(r1, y1, i);
      if(r0 > 1e-9) t.push([a, b, c]); if(r1 > 1e-9) t.push([a, c, d]);
    }
    return t;
  }
  // színes övekre bontott forgástest a Z tengely mentén: f(t) → [sugár, z] (t = 0 hátul … 1 elöl), bands = [[t0, t1, szín], …]
  function banded(m, K, f, bands, seg, y, step){
    for(const [t0, t1, color] of bands){ const P = [], n = Math.max(2, Math.round((t1 - t0) / (step || 0.1)) + 1);
      for(let i = 0; i < n; i++) P.push(f(t0 + (t1 - t0) * i / (n - 1)));
      m.add(latheOpen(P, seg), { color, r:[90, 0, 0], t:[0, y, 0] }); }
  }
  // egész modell (vagy részek) nagyítása: { s } – a számszerű mezők (foot, bloomY, …) és a pont-listák is nagyulnak
  function scaled(K, r, k){
    if(!k || k === 1) return r;
    const one = m => { const o = K.model().merge(m, { s:[k, k, k] });
      for(const [key, v] of Object.entries(m)) if(typeof v !== 'function') o[key] = sc(v);
      return o; };
    const sc = v => typeof v === 'number' ? v * k : Array.isArray(v) ? v.map(sc) : (v && typeof v === 'object') ? (typeof v.groups === 'function' ? one(v) : Object.fromEntries(Object.entries(v).map(([a, b]) => [a, sc(b)]))) : v;
    return sc(r);
  }

  // ---- tartalom-színek NÉVVEL (valódi tárgy színe – a beeco-arculat szabálya szerint; mind az ART.MAT palettából) ----
  // FÉNY-TANULSÁG (docs/rajzolas.md): a cel-árnyalás a világos tónusokat kifehéríti → a borostyán, a barna és a szalma itt a
  // sötétebb (2–3) tónusból jön; a méhsejt-színeket a játék példányszínnek is ugyanígy kapja (cellHex).
  const KP_SZIN = {
    viasz:'cream:3', pete:'white:0', larva:'white:1', mez:'honey:3', fedettMez:'cream:2', fedettFiasitas:'cardboard:3', viragpor:'orange:2',
    mehBorostyan:'gold:3', mehSav:'wood:3', mehTor:'cardboard:3', mehFej:'chocolate:3', mehSzem:'dark:3',
    kaptarTest:'honey:3', kaptarMezkamra:'sage:3', kaptarFa:'wood:2', kaptarAllvany:'wood:3', fedelLemez:'steel:3', szalma:'cardboard:3', szalmaArnyek:'wood:3',
    paradicsomSarga:'honey:2', paradicsomPorzo:'honey:3', lucernaLila:'purple:2', voroshereRozsa:'pink:2', burgonyaLila:'purple:2', faceliaKek:'blue:1',
    levendulaLila:'purple:2', napraforgoSzirom:'honey:2', napraforgoTanyer:'chocolate:2', harsMurvalevel:'grass:2', almaSzirom:'white:1', almaBimbo:'blossom:2',
    gyurgyalagGesztenye:'ember:3', gyurgyalagTorok:'honey:2', gyurgyalagHas:'teal:1', gyurgyalagSzarny:'teal:2',
    darazsSarga:'honey:1', darazsFekete:'dark:3', permet:'glass:0', permetMag:'sage:1',
  };
  // a lép-sejtek állapot-színei (a játék InstancedMesh-példányszínnek adja: KP_MODELS.cellHex('honey'))
  const CELL = { empty:KP_SZIN.viasz, egg:KP_SZIN.pete, larva:KP_SZIN.larva, honey:KP_SZIN.mez, cappedHoney:KP_SZIN.fedettMez,
    cappedBrood:KP_SZIN.fedettFiasitas, pollen:KP_SZIN.viragpor, pollenMix:['orange:2', 'honey:3', 'ember:2', 'gold:2', 'red:2'] };
  const cellHex = (state, i) => { const c = CELL[state] || CELL.empty; const M = root.MODEL || (typeof require === 'function' ? require('../art/model-kit.js') : null);
    return M.hexOf(Array.isArray(c) ? c[(i || 0) % c.length] : c); };
  // modell-méret (nem tartalmi adat): dolgozó-sejt köré írt sugara és mélysége dm-ben (a lapok közti ≈ 5,3 mm-hez igazítva)
  const CELL_R = 0.0306, CELL_DEPTH = 0.11, DRONE_CELL_R = 0.036;

  // ================= MÉHEK =================
  // potroh-profilok: t = 0 a potroh vége, 1 a nyél (a tor felé); érték = sugár / legnagyobb sugár
  const PROF = {
    worker: t => t < 0.55 ? Math.pow(Math.sin(Math.PI / 2 * t / 0.55), 0.8) : Math.pow(Math.cos((t - 0.55) / 0.45 * Math.PI / 2 * 0.8), 0.6),
    queen:  t => t < 0.62 ? Math.pow(Math.sin(Math.PI / 2 * t / 0.62), 0.9) : Math.pow(Math.cos((t - 0.62) / 0.38 * Math.PI / 2 * 0.8), 0.6),
    drone:  t => t < 0.5 ? Math.pow(Math.sin(Math.PI / 2 * t / 0.5), 0.42) : Math.pow(Math.cos((t - 0.5) / 0.5 * Math.PI / 2 * 0.8), 0.55),
  };
  const A = KP_SZIN.mehBorostyan, D = KP_SZIN.mehSav;
  const TYPES = {
    // dolgozó: karcsú, aranybarna, hátrafelé sötétedő csíkok, hegyes potroh; virágporkosár opcióval
    worker:{ abdL:1, abdR:1, wing:1, eye:'small', tor:KP_SZIN.mehTor, prof:PROF.worker,
      bands:[[0, 0.2, D], [0.2, 0.3, A], [0.3, 0.4, D], [0.4, 0.52, A], [0.52, 0.62, D], [0.62, 0.78, A], [0.78, 0.86, D], [0.86, 1, A]] },
    // anya: hosszú, kúpos potroh (a szárny csak kb. kétharmadáig ér), kissé nagyobb tor, borostyános lábak
    queen:{ s:1.1, abdL:1.6, abdR:0.98, wing:0.88, eye:'small', tor:'wood:3', leg:'cardboard:3', prof:PROF.queen,
      bands:[[0, 0.16, D], [0.16, 0.34, A], [0.34, 0.42, D], [0.42, 0.6, A], [0.6, 0.67, D], [0.67, 0.85, A], [0.85, 1, A]] },
    // here: zömök, tompa végű potroh, a fejtetőn összeérő nagy szemek, nagy szárny, sötétebb
    drone:{ s:1.12, abdL:0.92, abdR:1.3, wing:1.22, eye:'big', tor:'wood:3', prof:PROF.drone,
      bands:[[0, 0.22, 'chocolate:3'], [0.22, 0.34, 'cardboard:3'], [0.34, 0.46, 'chocolate:3'], [0.46, 0.6, 'cardboard:3'], [0.6, 0.72, 'chocolate:3'], [0.72, 1, 'cardboard:3']] },
  };
  function honeybee(K, type, o){
    o = o || {}; const T = TYPES[type], s = T.s || 1, body = K.model(), legC = T.leg || KP_SZIN.mehFej;
    const rT = 0.019 * s, Y = -0.02 * s;
    body.add(K.sphere(rT, 10, 7), { color:T.tor, t:[0, Y, 0], s:[1, 0.95, 1.08] });                                    // tor (szőrös, barna)
    const L = 0.066 * s * T.abdL, Rm = 0.021 * s * T.abdR, zf = -rT * 0.7, z0 = zf - L;                                  // potroh
    banded(body, K, t => [T.prof(t) * Rm, z0 + t * L], T.bands, 10, Y - 0.003 * s);
    const hz = rT + 0.011 * s, hy = Y + 0.001 * s;                                                                       // fej (szívforma, lapos)
    body.add(K.sphere(0.0145 * s, 10, 6), { color:KP_SZIN.mehFej, t:[0, hy, hz], s:[1.12, 1.05, 0.78] });
    for(const sx of [-1, 1]){
      if(T.eye === 'big') body.add(K.sphere(0.013 * s, 8, 5), { color:KP_SZIN.mehSzem, t:[sx * 0.0105 * s, hy + 0.006 * s, hz - 0.002 * s], s:[0.72, 1.15, 1] });
      else body.add(K.sphere(0.0085 * s, 6, 4), { color:KP_SZIN.mehSzem, t:[sx * 0.0135 * s, hy + 0.002 * s, hz - 0.001 * s], s:[0.45, 1.25, 0.95] });
      const a = [sx * 0.004 * s, hy + 0.009 * s, hz + 0.008 * s], b = [sx * 0.007 * s, hy + 0.022 * s, hz + 0.014 * s], c = [sx * 0.018 * s, hy + 0.027 * s, hz + 0.033 * s];
      rod(body, K, a, b, 0.0016 * s, 0.0014 * s, 3, legC); rod(body, K, b, c, 0.0014 * s, 0.0012 * s, 3, legC);       // könyökös csáp
    }
    let foot = 0;                                                                                                        // 3 pár láb
    [[0.009, 0.018], [0, 0], [-0.01, -0.028]].forEach(([z, dz], k) => { for(const sx of [-1, 1]){
      const a = [sx * 0.008 * s, Y - 0.013 * s, z * s], b = [sx * 0.021 * s, Y - 0.019 * s, (z + dz * 0.3) * s];
      const c = [sx * (k === 2 ? 0.024 : 0.021) * s, Y - (k === 2 ? 0.036 : 0.031) * s, (z + dz * 0.9) * s];
      rod(body, K, a, b, 0.0028 * s, 0.0024 * s, 3, legC); rod(body, K, b, c, 0.0024 * s, k === 2 ? 0.0038 * s : 0.002 * s, 3, legC);
      foot = Math.min(foot, c[1] - 0.002 * s);
      if(k === 2 && o.pollen && type === 'worker') body.add(blob(K, 0.0058 * s, 60 + sx, 7, 0.15), { color:KP_SZIN.viragpor,   // virágporkosár
        t:[b[0] * 0.45 + c[0] * 0.55, b[1] * 0.45 + c[1] * 0.55, b[2] * 0.45 + c[2] * 0.55], s:[1, 1.3, 1] });
    } });
    const w = T.wing * s, out = { body, foot };                                                                          // két pár szárny
    for(const [name, sx] of [['wingL', 1], ['wingR', -1]]){ const g = K.model();
      g.add(flat(K, ell(sx * 0.027 * w, -0.008 * w, 0.026 * w, 0.0085 * w, 10, -sx * 14), 0.0012 * s), { color:'glass:0', t:[0, 0.0012 * s, 0], r:[-90, 0, sx * 12] });
      g.add(flat(K, ell(sx * 0.019 * w, -0.02 * w, 0.016 * w, 0.006 * w, 8, -sx * 22), 0.0012 * s), { color:'glass:1', t:[0, 0.0004 * s, 0], r:[-90, 0, sx * 12] });
      g.add(flat(K, ell(sx * 0.024 * w, -0.0015 * w, 0.021 * w, 0.0021 * w, 6, -sx * 13), 0.0014 * s), { color:KP_SZIN.mehBorostyan, t:[0, 0.0016 * s, 0], r:[-90, 0, sx * 12] });   // borostyános elülső ér
      out[name] = g; }
    return scaled(K, out, o.s);
  }
  const worker = (K, o) => honeybee(K, 'worker', o);
  const queen = (K, o) => honeybee(K, 'queen', o);
  const drone = (K, o) => honeybee(K, 'drone', o);

  // TÁVOLI DOLGOZÓ (< 150 △, sok példányhoz): tor, fej, 4 sávos potroh, egy-egy szárny. Ugyanaz az origó és rész-szerkezet.
  function workerLow(K, o){
    const body = K.model(), rT = 0.019, Y = -0.02, L = 0.066, Rm = 0.021, zf = -rT * 0.7, z0 = zf - L;
    body.add(K.sphere(rT, 6, 4), { color:KP_SZIN.mehTor, t:[0, Y, 0], s:[1, 0.95, 1.08] });
    body.add(K.sphere(0.0145, 5, 3), { color:KP_SZIN.mehFej, t:[0, Y + 0.001, rT + 0.011], s:[1.12, 1.05, 0.78] });
    banded(body, K, t => [PROF.worker(t) * Rm, z0 + t * L], [[0, 0.3, D], [0.3, 0.55, A], [0.55, 0.75, D], [0.75, 1, A]], 6, Y - 0.003, 1);
    const out = { body, foot:Y - rT };
    for(const [name, sx] of [['wingL', 1], ['wingR', -1]]){ const g = K.model();
      g.add(flat(K, ell(sx * 0.027, -0.008, 0.026, 0.0095, 5, -sx * 14), 0.0012), { color:'glass:0', t:[0, 0.001, 0], r:[-90, 0, sx * 12] });
      out[name] = g; }
    return scaled(K, out, (o || {}).s);
  }

  // ================= LÉP-SEJT (InstancedMesh-hez) =================
  // Hatszög-hasáb a +Z tengely mentén: a talpa z = 0 (a lép középfalán), a szája z = depth. Csúcs felül és alul („álló” hatszög:
  // a lépen a sejtsorok vízszintesek, két oldalfal függőleges). r = a köré írt kör sugara. Lapos normálok + 'color' csúcsszín-attribútum
  // (árnyalás: perem világos, belső fal sötétebb) – MeshToonMaterial({ vertexColors:true }) mellett a példányszínnel szorzódik.
  //   cap:'flat'  – lapos teteje (18 △): viasz-fedél (fedett méz) vagy egyszínű sejt
  //   cap:'dome'  – domború teteje (18 △): fedett fiasítás
  //   cap:'open'  – nyitott csésze (42 △): perem, belső fal, sejtfenék – üres sejt, benne petével/lárvával/mézzel
  // Javaslat: a nyitott sejtfalak egy InstancedMesh-ben viasz-színnel (CELL.empty), a tartalom (méz, virágpor, lárva) egy második,
  // sekély 'flat' példányréteg a sejt aljában, példányszínnel (cellHex(állapot)) – így a perem viasz marad, a belseje színes.
  function cellGeometry(THREE, r, depth, o){
    o = o || {}; const cap = o.cap || 'flat', ri = r * (o.rim || 0.8), zf = depth * (o.floor == null ? 0.35 : o.floor);
    const P = [], C = [], V = k => { const a = Math.PI / 2 + k * Math.PI / 3; return [Math.cos(a), Math.sin(a)]; };
    const tri = (a, b, c, sh) => { P.push(...a, ...b, ...c); C.push(sh, sh, sh, sh, sh, sh, sh, sh, sh); };
    for(let k = 0; k < 6; k++){
      const [x0, y0] = V(k), [x1, y1] = V(k + 1);
      tri([x0 * r, y0 * r, 0], [x1 * r, y1 * r, 0], [x1 * r, y1 * r, depth], 0.82); tri([x0 * r, y0 * r, 0], [x1 * r, y1 * r, depth], [x0 * r, y0 * r, depth], 0.82);   // külső fal
      if(cap === 'open'){
        tri([x0 * r, y0 * r, depth], [x1 * r, y1 * r, depth], [x1 * ri, y1 * ri, depth], 1); tri([x0 * r, y0 * r, depth], [x1 * ri, y1 * ri, depth], [x0 * ri, y0 * ri, depth], 1);   // perem
        tri([x0 * ri, y0 * ri, zf], [x1 * ri, y1 * ri, depth], [x1 * ri, y1 * ri, zf], 0.7); tri([x0 * ri, y0 * ri, zf], [x0 * ri, y0 * ri, depth], [x1 * ri, y1 * ri, depth], 0.7);   // belső fal
        tri([0, 0, zf], [x0 * ri, y0 * ri, zf], [x1 * ri, y1 * ri, zf], 0.92);                                                   // sejtfenék
      } else tri([0, 0, depth + (cap === 'dome' ? r * 0.35 : 0)], [x0 * r, y0 * r, depth], [x1 * r, y1 * r, depth], 1);         // fedél
    }
    const N = new Float32Array(P.length);
    for(let i = 0; i < P.length; i += 9){ const ax = P[i + 3] - P[i], ay = P[i + 4] - P[i + 1], az = P[i + 5] - P[i + 2], bx = P[i + 6] - P[i], by = P[i + 7] - P[i + 1], bz = P[i + 8] - P[i + 2];
      let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      for(let k = 0; k < 3; k++) N.set([nx, ny, nz], i + k * 3); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(C), 3));
    g.computeBoundingSphere();
    return g;
  }
  // sejtközéppontok egy téglalapban (álló hatszögek: soronként √3·r, sorköz 1,5·r, minden második sor fél sejttel eltolva) → [[x, y, sor, oszlop], …]
  function cellGrid(x0, x1, y0, y1, r){
    const dx = Math.sqrt(3) * r, dy = 1.5 * r, out = [];
    for(let j = 0, y = y0 + r; y <= y1 - r + 1e-9; j++, y += dy){ const off = j % 2 ? dx / 2 : 0;
      for(let i = 0, x = x0 + dx / 2 + off; x <= x1 - dx / 2 + 1e-9; i++, x += dx) out.push([x, y, j, i]); }
    return out;
  }

  // ================= KERET (egy lép a fakeretben) =================
  // Fakeret: felső léc fülekkel (4,8 széles), két oldalléc, alsó léc; benne a viasz középfal (comb). A sejteket a játék rajzolja
  // a comb két oldalára (InstancedMesh): area = { x0, x1, y0, y1, z: a középfal felszíne (±z), depth: a sejt mélysége }. Talp y = 0.
  function frame(K, o){
    const body = K.model(), comb = K.model(), W = 4.4, H = 2.3;
    body.add(K.chamferBox(4.8, 0.2, 0.26, 0.04), { color:'wood:2', t:[0, H - 0.1, 0] });                              // felső léc (fülekkel)
    for(const sx of [-1, 1]){ body.add(K.chamferBox(0.1, H - 0.2, 0.35, 0.02), { color:'wood:3', t:[sx * (W / 2 - 0.05), (H - 0.2) / 2, 0] });   // oldalléc
      body.add(K.box(0.06, 0.06, 0.2), { color:'dark:3', t:[sx * (W / 2 + 0.02), H - 0.1, 0] }); }                    // szegfej-csík (a fülek alatt)
    body.add(K.chamferBox(W - 0.2, 0.1, 0.2, 0.02), { color:'wood:3', t:[0, 0.05, 0] });                       // alsó léc
    comb.add(K.chamferBox(W - 0.2, H - 0.3, 0.04, 0.01), { color:KP_SZIN.viasz, t:[0, 0.1 + (H - 0.3) / 2, 0] });       // viasz középfal
    const r = { body, comb, area:{ x0:-(W / 2 - 0.1), x1:W / 2 - 0.1, y0:0.1, y1:H - 0.2, z:0.02, depth:CELL_DEPTH }, cellR:CELL_R };
    return scaled(K, r, (o || {}).s);
  }

  // ================= KAPTÁR =================
  // Modern keretes kaptár állványon: fenékdeszka, lejtős röpdeszka, alul a röpnyílás (+Z), fiókos test (aranysárga), fölötte
  // a mézkamra (zsálya), fogantyú-mélyedések, kis felső kijáró, takarófedél fémlemezzel. hive.entrance = a röpdeszka közepe.
  // hiveOpen: fedél és mézkamra nélkül, felülről a 10 keret felső léce látszik (köztük a lépek mézes teteje) – hive.slots a
  // keretek helye ([x, felső léc teteje, 0]; a keretek a Z mentén állnak), hive.frameY = a beakasztott keret talpának magassága.
  const HV = { W:4.1, D:5.1, legH:3.0, H1:2.4, H2:1.7 };
  function hiveBase(K, m){
    const { W, D, legH } = HV;
    for(const sx of [-1, 1]) for(const sz of [-1, 1]) m.add(K.box(0.3, legH, 0.3), { color:KP_SZIN.kaptarAllvany, t:[sx * (W / 2 - 0.3), legH / 2, sz * (D / 2 - 0.35)] });
    for(const sx of [-1, 1]) m.add(K.box(0.24, 0.3, D), { color:KP_SZIN.kaptarAllvany, t:[sx * (W / 2 - 0.3), legH - 0.15, 0] });            // hosszanti gerendák
    for(const sz of [-1, 1]) m.add(K.box(W - 0.4, 0.22, 0.2), { color:KP_SZIN.kaptarAllvany, t:[0, legH * 0.35, sz * (D / 2 - 0.35)] });     // merevítők
    m.add(K.chamferBox(W + 0.1, 0.3, D, 0.05), { color:KP_SZIN.kaptarFa, t:[0, legH + 0.15, 0] });                                         // fenékdeszka
    m.add(K.chamferBox(W - 0.6, 0.1, 1.3, 0.03), { color:KP_SZIN.kaptarFa, t:[0, legH + 0.1, D / 2 + 0.6], r:[14, 0, 0] });               // röpdeszka (lejt)
    const b0 = legH + 0.3;
    m.add(K.box(2.8, 0.16, 0.1), { color:'dark:3', t:[0, b0 + 0.1, D / 2] });                                                             // röpnyílás
    return b0;
  }
  const handles = (K, m, y) => { for(const sx of [-1, 1]) m.add(K.box(0.06, 0.2, 1.1), { color:'dark:3', t:[sx * (HV.W / 2 + 0.005), y, 0] }); };
  function hive(K, o){
    const m = K.model(), { W, D, H1, H2 } = HV, b0 = hiveBase(K, m);
    m.add(K.chamferBox(W, H1, D, 0.07), { color:KP_SZIN.kaptarTest, t:[0, b0 + H1 / 2, 0] });                                                // fiókos test
    handles(K, m, b0 + H1 * 0.7);
    const s0 = b0 + H1 + 0.02;
    m.add(K.chamferBox(W, H2, D, 0.07), { color:KP_SZIN.kaptarMezkamra, t:[0, s0 + H2 / 2, 0] });                                            // mézkamra
    handles(K, m, s0 + H2 * 0.65);
    m.add(K.cylinder(0.14, 0.14, 0.1, 10), { color:'dark:3', t:[0, s0 + H2 * 0.62, D / 2], r:[90, 0, 0] });                                // felső kijáró
    const l0 = s0 + H2;
    m.add(K.chamferBox(W + 0.3, 0.55, D + 0.3, 0.05), { color:'wood:2', t:[0, l0 + 0.275, 0] });                                   // takarófedél
    m.add(K.chamferBox(W + 0.42, 0.1, D + 0.42, 0.03), { color:KP_SZIN.fedelLemez, t:[0, l0 + 0.6, 0] });                                   // fémlemez
    m.entrance = [0, HV.legH + 0.25, D / 2 + 0.6];
    return scaled(K, m, (o || {}).s);
  }
  function hiveOpen(K, o){
    const m = K.model(), { W, D, H1 } = HV, b0 = hiveBase(K, m), top = b0 + H1, T = 0.2;
    for(const sz of [-1, 1]) m.add(K.box(W, H1, T), { color:KP_SZIN.kaptarTest, t:[0, b0 + H1 / 2, sz * (D / 2 - T / 2)] });               // falak
    for(const sx of [-1, 1]) m.add(K.box(T, H1, D - 2 * T), { color:KP_SZIN.kaptarTest, t:[sx * (W / 2 - T / 2), b0 + H1 / 2, 0] });
    handles(K, m, b0 + H1 * 0.7);
    m.add(K.box(W - 2 * T, 0.05, D - 2 * T), { color:'dark:3', t:[0, top - 0.6, 0] });                                                       // sötét mélység
    const slots = [];
    for(let i = 0; i < 10; i++){ const x = -1.6 + i * 0.355;
      m.add(K.box(0.32, 0.05, D - 0.7), { color:KP_SZIN.mez, t:[x, top - 0.32, 0] });                                                         // lép mézes teteje
      m.add(K.box(0.25, 0.18, D - 0.24), { color:'wood:2', t:[x, top - 0.14, 0] });                                                        // felső léc
      slots.push([x, top - 0.05, 0]); }
    m.entrance = [0, HV.legH + 0.25, D / 2 + 0.6]; m.slots = slots; m.frameY = top - 0.05 - 2.3;
    return scaled(K, m, (o || {}).s);
  }

  // ================= SZALMAKAS =================
  // Hagyományos, harang alakú, spirálban tekert szalmakas (8 tekercs: a felső fele világos, az alsó árnyékos szalma) kerek
  // deszkán; elöl (+Z) alul íves röpnyílás, a tetején fogó-gomb. Ø ≈ 3,6, magasság ≈ 3,5. skep.entrance = a nyílás előtt.
  function skep(K, o){
    const m = K.model(), R = 1.8, H = 3.0, y0 = 0.25, N = 8, bul = 0.09;
    m.add(K.cylinder(2.2, 2.25, 0.25, 14), { color:KP_SZIN.kaptarFa, t:[0, 0.125, 0] });
    const rad = u => R * Math.pow(Math.max(0, 1 - Math.pow(u, 2.3)), 0.5);
    for(let k = 0; k < N; k++){ const a = k / N, mid = (k + 0.5) / N, b = (k + 1) / N, rm = rad(mid) + bul * (1 - mid * 0.6);
      m.add(latheOpen([[rad(a) * 0.98, y0 + a * H], [rm, y0 + mid * H]], 14), { color:KP_SZIN.szalmaArnyek });
      m.add(latheOpen([[rm, y0 + mid * H], [rad(b) * 0.98, y0 + b * H]], 14), { color:KP_SZIN.szalma }); }
    const arch = [[-0.42, 0]]; for(let i = 0; i <= 6; i++){ const t = Math.PI - i / 6 * Math.PI; arch.push([Math.cos(t) * 0.42, Math.sin(t) * 0.42]); } arch.push([0.42, 0]);
    m.add(K.extrude(arch.slice(1, -1).concat([[0.42, 0], [-0.42, 0]]).filter((p, i, a) => i === a.findIndex(q => q[0] === p[0] && q[1] === p[1])), 0.6), { color:'dark:3', t:[0, y0, R - 0.18] });   // röpnyílás
    m.add(K.cylinder(0.12, 0.17, 0.3, 8), { color:'wood:2', t:[0, y0 + H + 0.1, 0] });                                                       // fogó
    m.entrance = [0, y0 + 0.15, R + 0.3];
    return scaled(K, m, (o || {}).s);
  }

  // ================= MÉHES – a Méhesd-térkép épülete (DIORÁMA-LÉPTÉK, mint a VAROS_MODELS: 1 egység ≈ 25 m) =================
  // Füves telek (1,4 × 1,0); hátul egy sorban 3 keretes kaptár állványon, lágy színekben (méz, zsálya, rózsa), elöl (+Z) röpnyílással;
  // elöl jobbra szalmakas egy kis padon; bal elöl kis deszka méhészház nyeregtetővel; a telek elején virágsáv (sárga és rózsaszín);
  // a kaptárak fölött néhány repülő méh-pötty. Talp y = 0, legmagasabb pont ≈ 0,47. 8 szín, ≈ 1000 háromszög. ({ s } nagyít.)
  function mehes(K, o){
    const m = K.model(), R = rng(131);
    m.add(K.chamferBox(1.4, 0.04, 1.0, 0.015), { color:'grass:1', t:[0, 0.02, 0] });                                                     // telek
    const g = 0.04;
    [['honey:3', -0.05], ['sage:3', 0.22], ['blossom:2', 0.49]].forEach(([c, x], i) => {                                                  // 3 kaptár
      const z = -0.22 + (i % 2) * 0.03, s0 = g + 0.07;
      m.add(K.box(0.2, 0.07, 0.17), { color:'wood:2', t:[x, g + 0.035, z] });                                                          // állvány
      m.add(K.chamferBox(0.18, 0.18, 0.2, 0.012), { color:c, t:[x, s0 + 0.09, z] });                                                   // test
      m.add(K.box(0.21, 0.03, 0.23), { color:'wood:2', t:[x, s0 + 0.195, z] });                                                        // fedél
      m.add(K.box(0.1, 0.018, 0.012), { color:'dark:3', t:[x, s0 + 0.015, z + 0.1] });                                                 // röpnyílás
      m.add(K.box(0.12, 0.01, 0.05), { color:'wood:2', t:[x, s0 + 0.004, z + 0.12], r:[12, 0, 0] });                                  // röpdeszka
      m.add(K.box(0.008, 0.035, 0.09), { color:'dark:3', t:[x + 0.092, s0 + 0.12, z] });                                               // fogantyú
    });
    // szalmakas kis padon (elöl jobbra)
    const kx = 0.42, kz = 0.18;
    m.add(K.box(0.22, 0.02, 0.16), { color:'wood:2', t:[kx, g + 0.09, kz] });
    for(const sx of [-1, 1]) m.add(K.box(0.02, 0.08, 0.14), { color:'wood:2', t:[kx + sx * 0.09, g + 0.04, kz] });
    const kas = K.model(), rad = u => 0.08 * Math.pow(Math.max(0, 1 - Math.pow(u, 2.3)), 0.5), y0 = g + 0.1, H = 0.14;   // a kas a saját origója körül épül
    for(let k = 0; k < 4; k++){ const a = k / 4, mid = (k + 0.5) / 4, b = (k + 1) / 4, rm = rad(mid) + 0.006;
      kas.add(latheOpen([[rad(a) * 0.97, y0 + a * H], [rm, y0 + mid * H], [rad(b) * 0.97, y0 + b * H]], 10), { color:'cardboard:3' }); }
    kas.add(K.box(0.04, 0.025, 0.02), { color:'dark:3', t:[0, y0 + 0.012, 0.075] });                                                 // röpnyílás
    kas.add(K.cylinder(0.01, 0.014, 0.02, 6), { color:'wood:2', t:[0, y0 + H + 0.008, 0] });                                          // fogó
    m.merge(kas, { t:[kx, 0, kz] });
    // méhészház (bal elöl): deszkafalak, fa nyeregtető, sötét ajtó, ablak
    const hx = -0.47, hz = 0.12, hw = 0.3, hd = 0.26, hh = 0.26;
    m.add(K.chamferBox(hw, hh, hd, 0.01), { color:'cardboard:3', t:[hx, g + hh / 2, hz] });
    const ra = 30, run = hd / 2 + 0.03, L = run / Math.cos(ra * Math.PI / 180) + 0.02;
    for(const sz of [-1, 1]) m.add(K.box(hw + 0.05, 0.02, L), { color:'wood:2', r:[sz * ra, 0, 0], t:[hx, g + hh + run / 2 * Math.tan(ra * Math.PI / 180) + 0.01, hz + sz * run / 2] });
    m.add(K.box(0.075, 0.15, 0.012), { color:'wood:2', t:[hx + 0.06, g + 0.075, hz + hd / 2 + 0.004] });                              // ajtó
    m.add(K.box(0.06, 0.05, 0.012), { color:'dark:3', t:[hx - 0.07, g + 0.16, hz + hd / 2 + 0.004] });                                 // ablak
    // virágsáv a telek elején (sárga és rózsaszín virágok, zöld száron)
    for(let i = 0; i < 11; i++){ const x = -0.22 + i * 0.075 + (R() - 0.5) * 0.02, z = 0.41 + (R() - 0.5) * 0.06, h = 0.07 + R() * 0.04;
      rod(m, K, [x, g, z], [x, g + h, z], 0.006, 0.004, 3, 'leaf:2');
      m.add(blob(K, 0.022, 140 + i, 6, 0.1), { color:i % 3 ? 'honey:3' : 'blossom:2', t:[x, g + h + 0.008, z], s:[1, 0.6, 1] }); }
    for(let i = 0; i < 6; i++) m.add(blob(K, 0.024, 150 + i, 7, 0.2), { color:'leaf:2', t:[-0.25 + i * 0.15, g + 0.012, 0.44], s:[1.3, 0.5, 1] });   // levélcsomók
    for(const [x, y, z] of [[0.05, 0.4, -0.05], [0.3, 0.45, -0.02], [0.18, 0.36, 0.06], [0.5, 0.42, 0.0]])                              // repülő méhek
      m.add(blob(K, 0.012, 160 + x * 100, 5, 0.1), { color:'honey:3', t:[x, y, z] });
    return scaled(K, m, (o || {}).s);
  }

  const KP_MODELS = Object.assign(root.KP_MODELS || {}, { KP_SZIN, CELL, cellHex, CELL_R, CELL_DEPTH, DRONE_CELL_R,
    worker, workerLow, queen, drone, frame, cellGeometry, cellGrid, hive, hiveOpen, skep, mehes, _h:{ rng, blob, rod, flat, ell, latheOpen, banded, scaled } });
  root.KP_MODELS = KP_MODELS;
  if(typeof module !== 'undefined' && module.exports) module.exports = KP_MODELS;
})(typeof window !== 'undefined' ? window : globalThis);
