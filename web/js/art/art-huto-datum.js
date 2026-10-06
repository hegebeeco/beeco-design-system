// ============================================================
//  Matricák — Hűtő-mester „Lejárt vagy még jó?” játékrész (js/huto-datum.js) termékei, B szint (docs/rajzolas.md).
//  A játékrész a kártya képét a `matrica` mezőből (meglévő Hűtő-étel matricája) vagy az emoji matricájából veszi –
//  ebben a fájlban azok a termékek vannak, amelyeknek még nem volt matricájuk:
//    ht_szarazteszta (🍝) – bontatlan zacskó száraztészta, átlátszó ablakon át penne látszik.
//  Felirat, márka, logó nincs. A név ht_ előtagú, mert nem Hűtő-étel (az f_ előtag csak létező huto.json-étel lehet).
//  A rajz-segédek az art-huto-fagy.js-ből jönnek (másolat – a matrica-fájlok önállóak, bármilyen sorrendben betölthetők).
//  Render: node tools/art-render.js 2d web/js/art/art-huto-datum.js ki.png --skip huto-datum
// ============================================================
ART.later('huto-datum', function(){   // lusta könyvtár: csak az első matricája kérésekor fut (js/art/art.js – ART.later)
(function(){
  const { R, rad, band, camera } = ART.geo;
  const { cos, sin, hypot, max, min, abs, floor, PI } = Math;

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
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

  // ---- alakzat-gyártók ----
  const body = (m, tone, pts, x) => Object.assign({ t:'poly', m, tone, pts:R(pts) }, x);                        // peremet kapó test
  const fill = (m, tone, polys, x) => Object.assign({ t:'path', m, tone, line:false, d:true, p:pathOf(polys) }, x);   // tónus-lap / dísz
  const shine = (polys, o = 0.7) => fill('paper', 'light', polys, { o });

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
  //  SZÁRAZTÉSZTA – bontatlan, párnás műanyag zacskó (valódi méretből vetítve, 17 × 27 cm, 500 g-os kiszerelés mérete)
  //  bordázott hegesztéssel felül és alul; elöl nagy, boltíves átlátszó ablak, mögötte tele aranysárga pennével:
  //  a ferdén vágott csőtészta (paralelogramma, a végén sötét nyílás, felül fénycsík) teszi tésztává – ettől nem liszt
  //  és nem fagyasztott zöldség; alul krémfehér hullám-sáv (bolti csomagolás-minta). Felirat, márka nincs.
  // ======================================================================
  {
    const TILT = -10, X = 8.5, H = 27, Z = 1.6, Y0 = 1.6, Y1 = H - 2.6, N = 10;   // 17 × 27 cm, középen 3,2 cm vastag
    const fit = []; for(const x of [-X - 0.3, X + 0.3]) for(const y of [0, H]) for(const z of [-Z, Z]) fit.push([x, y, z]);
    const P = camera({ az:22, el:12, F:90, tilt:TILT, span:80, fit });
    const F = ([u, v], z = Z) => P([u, v, z]);
    const ts = Array.from({ length:N + 1 }, (_, i) => i / N);
    // az eleje: a négy él enyhén befelé ível (a teli zacskó párnás)
    const eL = ts.map(t => [-X + 0.6 * sin(PI * t), Y0 + (Y1 - Y0) * t]), eT = ts.slice(1).map(t => [-X + 2 * X * t, Y1 - 0.45 * sin(PI * t)]);
    const eR = ts.slice(1).map(t => [X - 0.6 * sin(PI * t), Y1 - (Y1 - Y0) * t]), eB = ts.slice(1, -1).map(t => [X - 2 * X * t, Y0 + 0.35 * sin(PI * t)]);
    const front = [...eL, ...eT, ...eR, ...eB].map(p => F(p));
    const thick = v => Z - 2 * Z * sin(PI * (v - Y0) / (Y1 - Y0)) ** 0.5;      // a párnás zacskó oldala a végein elvékonyodik
    const side = [...eR.map(p => F(p)), ...eR.slice(1, -1).reverse().map(p => F(p, thick(p[1])))];
    const seal = (v0, v1) => [[-X - 0.3, v0], [X + 0.3, v0], [X + 0.3, v1], [-X - 0.3, v1]].map(p => F(p, Z * 0.55));
    const crimp = Array.from({ length:13 }, (_, i) => -X + 0.9 + i * (2 * X - 1.8) / 12).map(u => band([F([u, Y1 + 0.5], Z * 0.55), F([u, H - 0.5], Z * 0.55)], 0.55, false));

    // ablak: alul lekerekített sarkok, felül félellipszis-ív (12,4 cm széles, 6…21 cm magasan); g = behúzás
    const WU = 6.2, WV0 = 6.0, WV1 = 21.0, RC = 1.4, AR = 4.2;
    const winAt = g => [
      ...[0, 30, 60, 90].map(a => [WU - g - RC + RC * cos(rad(a - 90)), WV0 + g + RC + RC * sin(rad(a - 90))]),
      ...Array.from({ length:11 }, (_, i) => { const a = PI * i / 10; return [(WU - g) * cos(a), WV1 - AR + (AR - g) * sin(a)]; }),
      ...[0, 30, 60, 90].map(a => [-WU + g + RC + RC * cos(rad(a + 180)), WV0 + g + RC + RC * sin(rad(a + 180))]),
    ].map(p => F(p));
    const winRim = winAt(-0.55), win = winAt(0.15);

    // penne: ferdén vágott cső a zacskó síkjában – [közép u, közép v, szög fokban]; mindkét vége párhuzamosan ferde
    //   (oldalról paralelogramma), a jobb végén a vágott lap ellipszise látszik: világos perem, sötét nyílás
    const PL = 6.6, PR = 1.15, SL = 1.7 * PR, CW = 0.45 * PR;               // a valódi penne ~5 × 1 cm – nagyítva, hogy 48 px-en is látsszon
    const lc = ([cu, cv, deg], a, b) => { const d = [cos(rad(deg)), sin(rad(deg))]; return F([cu + d[0] * a - d[1] * b, cv + d[1] * a + d[0] * b]); };
    const xL = o => -PL / 2 + SL * (o + 1) / 2, xR = o => PL / 2 - SL * (1 - o) / 2;   // a cső két vége az o (−1…1) magasságban
    const ml = hypot(SL / 2, PR), Wd = [PR / ml, -SL / 2 / ml];               // a vágott lap: fél-nagytengely (SL/2, PR), kistengely kifelé
    // a vágott lap ellipszise (km, kw: a két tengely szorzója; t0…t1: ívdarab, 0…π = a külső fele)
    const cap = (p, km, kw, t0 = 0, t1 = 2 * PI, m = 12) => Array.from({ length:m + 1 }, (_, i) => { const t = t0 + (t1 - t0) * i / m;
      return lc(p, PL / 2 - SL / 2 + km * SL / 2 * cos(t) + kw * CW * Wd[0] * sin(t), km * PR * cos(t) + kw * CW * Wd[1] * sin(t)); }).slice(0, t1 - t0 > 6 ? m : m + 1);   // teljes ellipszisnél az utolsó pont = az első
    const pBody = p => [...cap(p, 1, 1, 0, PI, 6), lc(p, xL(-1), -PR), lc(p, xL(1), PR)];   // A → a lap külső íve → B → C → D
    const strip = (p, o0, o1) => [lc(p, xL(o1) + 0.35, o1 * PR), lc(p, xR(o1) - 0.2, o1 * PR), lc(p, xR(o0) - 0.2, o0 * PR), lc(p, xL(o0) + 0.35, o0 * PR)];
    const frontD = [[-2.4, 17.6, 15], [2.2, 16.2, -28], [-2.2, 13.2, -20], [2.5, 11.4, 25], [-2.2, 8.7, 10]];   // mind az ablakon belül
    const backD = [[0.2, 18.6, -6], [0.0, 14.4, 80], [2.1, 8.0, -8]];       // a mögöttük látszó penne (sötétebb)
    // alul piros hullám-sáv (bolti csomagolás-minta)
    const wave = [F([X - 0.5, Y0 + 0.3]), ...eB.map(p => F([p[0], p[1] + 0.3])), F([-X + 0.5, Y0 + 0.3]),   // a kontúrtól behúzva
      ...Array.from({ length:13 }, (_, i) => { const u = -X + 0.55 + (2 * X - 1.1) * i / 12; return F([u, 4.0 + 0.4 * sin(PI * i / 4)]); })];
    add('ht_szarazteszta', { emoji:['🍝'], hu:'Száraztészta', en:'unopened plastic bag of dry penne pasta with crimped seals and a large arched clear window full of golden penne', tilt:TILT, shapes:[
      body('blue', 'dark', side),                                                 // a zacskó oldala (vastagsága)
      fill('blue', 'line', [[...eR.slice(1, -1).map(p => F(p, thick(p[1]) * 0.92)), ...eR.slice(1, -1).reverse().map(p => F(p, thick(p[1]) * 0.35))]], { o:0.5 }),   // legsötétebb élsáv
      body('blue', 'dark', seal(0, Y0 + 0.3)),                                    // alsó hegesztés
      body('blue', 'dark', seal(Y1 - 0.3, H)),                                    // felső hegesztés
      fill('blue', 'line', crimp, { o:0.45 }),                                    // bordázás
      body('blue', 'base', front),                                                // eleje
      fill('blue', 'light', [[...eL.slice(1, -1).map(p => F([p[0] + 0.45, p[1]])), ...eL.slice(1, -1).reverse().map(p => F([p[0] + 2.6 - 1.0 * sin(PI * (p[1] - Y0) / (Y1 - Y0)), p[1]]))]]),   // fény a bal szélen
      fill('red', 'base', [wave]),                                                // hullám-sáv alul
      fill('cream', 'base', [winRim]),                                            // az ablak pereme
      { t:'path', m:'gold', tone:'dark', d:true, p:pathOf([win]) },               // tészta-tömeg az ablak mögött
      { t:'path', m:'gold', tone:'dark', d:true, p:pathOf(backD.map(pBody)) },    // hátsó penne
      { t:'path', m:'gold', tone:'base', d:true, p:pathOf(frontD.map(pBody)) },   // penne (körvonallal, hogy szétváljanak)
      fill('gold', 'dark', frontD.map(p => strip(p, -0.85, -0.45))),               // a csövek árnyékos alja
      fill('gold', 'light', frontD.map(p => strip(p, 0.25, 0.72))),                // fénycsík a csöveken
      fill('gold', 'light', frontD.map(p => cap(p, 0.9, 0.85))),                   // a vágott lap pereme
      fill('gold', 'line', frontD.map(p => cap(p, 0.62, 0.5)), { o:0.9 }),         // a cső nyílása
      shine([[F([-WU + 0.9, WV1 - 2.2]), F([-WU + 2.6, WV1 - 1.0]), F([-WU + 1.7, WV0 + 4.5]), F([-WU + 0.9, WV0 + 4.5])]], 0.55),   // az ablak fólia-fénye
      shine([[F([-X + 1.2, Y1 - 1.4]), F([-X + 2.0, Y1 - 1.4]), F([-X + 2.0, WV1 + 0.6]), F([-X + 1.2, WV1 + 0.6])]], 0.7),
    ]});
  }
})();
});
