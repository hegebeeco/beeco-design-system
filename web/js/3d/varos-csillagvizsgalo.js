// ============================================================
//  MÉHESD – CSILLAGVIZSGÁLÓ (B szint: docs/rajzolas.md) – az „A mi bolygónk” földgömb-játék épülete a városban. A VAROS_MODELS-be kerül.
//
//  observatory   Kis, barátságos csillagvizsgáló dioráma-léptékben: füves telek, rajta mézsárga HATSZÖGLETŰ lábazat (a beeco-
//                méhsejt), a lábazaton kerek (14 szegmenses), krémszínű torony fehér párkánnyal, két kerek ablakkal és íves bejárati
//                ajtóval elöl (+Z), kis előtetővel és lépcsővel; a tornyon ezüstszürke kupola sötét nyitott réssel (jobbra
//                fordítva), a résből kinyúló rövid távcső sötét lencsével. Elöl kőlapos gyalogút az ajtóig; a bejárat mellett balra kis
//                „földgömb állványon” szobor (égkék gömb zöld szárazföld-foltokkal, fehér délkör-gyűrű, mézsárga hatszög talp),
//                jobbra egy pad. Felirat, logó, jelkép nincs. Alap 1,2 × 1,0 (x × z), a legmagasabb pont (a távcső vége) ≈ 0,86.
//                8 szín: grass:1 (telek, gömb-foltok), honey:2 (lábazat, szobor-talp, előtető, gyűrű a távcsövön), cream:1 (torony), white:1 (párkány,
//                keretek, út, távcső, gyűrű), steel:1 (kupola), dark:2 (kupola-rés, lencse, kilincs), wood:2 (ajtó, pad), sky:1 (gömb, ablakok).
//
//  Tengelyek, lépték: mint a varos-modellek.js-ben (Y fel, talp y = 0, origó = közép, eleje +Z; 1 egység ≈ 25 m, dioráma-léptékben).
//  Betöltési sorrend: 3d/elokert-modellek.js és 3d/varos-modellek.js UTÁN (a segédeiket használja). Node-ban require is elég.
// ============================================================
(function(root){
  const EK = root.EK_MODELS || (typeof require === 'function' ? require('./elokert-modellek.js') : null);
  const VM = root.VAROS_MODELS || (typeof require === 'function' ? require('./varos-modellek.js') : null);
  const { blob, rod } = EK._h;
  const D2R = Math.PI / 180;

  // íves (félköríves záródású) ajtó körvonala az XY síkban, alul középen az origó: szélesség w, teljes magasság h
  function arch(w, h, n){
    const r = w / 2, P = [[-r, 0], [r, 0]];
    for(let i = 0; i <= (n || 6); i++){ const a = i / (n || 6) * Math.PI; P.push([Math.cos(a) * r, h - r + Math.sin(a) * r]); }
    return P;
  }
  // irány-vektor a kupola közepéből: ry = elfordulás a függőleges tengely körül (fok, 0 = +Z), e = emelkedés (fok)
  const dirOf = (ry, e) => [Math.sin(ry * D2R) * Math.cos(e * D2R), Math.sin(e * D2R), Math.cos(ry * D2R) * Math.cos(e * D2R)];
  const at = (c, d, k) => [c[0] + d[0] * k, c[1] + d[1] * k, c[2] + d[2] * k];

  // ================= CSILLAGVIZSGÁLÓ =================
  function observatory(K){
    const m = K.model(), tx = 0.06, tz = -0.1;                                      // a torony (és a hatszög-lábazat) közepe
    m.add(K.chamferBox(1.2, 0.03, 1.0, 0.01), { color:'grass:1', t:[0, 0.015, 0] });                                     // füves telek
    // hatszögletű lábazat (lapjával előre) + egy lépcsőfok az ajtó előtt
    const PR = 0.34, PH = 0.06, P0 = 0.03, ap = PR * Math.cos(30 * D2R);
    m.add(K.cylinder(PR, PR, PH, 6), { color:'honey:2', t:[tx, P0 + PH / 2, tz], r:[0, 30, 0] });
    m.add(K.box(0.2, 0.03, 0.07), { color:'honey:2', t:[tx, P0 + 0.015, tz + ap + 0.035] });
    // kőlapos gyalogút a lépcsőtől a telek elejéig (három lap)
    for(let i = 0; i < 3; i++) m.add(K.box(0.13, 0.008, 0.06), { color:'white:1', t:[tx, 0.034, tz + ap + 0.11 + i * 0.08] });
    // TORONY: krémszínű henger, alul lábazati gyűrű, fent fehér párkány
    const TR = 0.22, TB = P0 + PH, TH = 0.36, TT = TB + TH;
    m.add(K.cylinder(TR, TR, TH, 14), { color:'cream:1', t:[tx, TB + TH / 2, tz] });
    m.add(K.cylinder(TR + 0.018, TR + 0.018, 0.035, 14), { color:'white:1', t:[tx, TT + 0.0175, tz] });
    // bejárat: íves faajtó fehér kerettel, fölötte kis mézsárga előtető
    const fz = tz + TR + 0.002;
    m.add(K.extrude(arch(0.13, 0.2, 5), 0.02), { color:'white:1', t:[tx, TB, fz] });
    m.add(K.extrude(arch(0.1, 0.18, 5), 0.02), { color:'wood:2', t:[tx, TB, fz + 0.006] });
    m.add(K.box(0.012, 0.012, 0.012), { color:'dark:2', t:[tx + 0.03, TB + 0.09, fz + 0.018] });                          // kilincs
    m.add(K.box(0.18, 0.016, 0.07), { color:'honey:2', t:[tx, TB + 0.225, fz + 0.03], r:[-8, 0, 0] });                    // előtető
    // két kerek ablak a torony elején, jobbra és balra (fehér keret + égkék üveg)
    for(const th of [-58, 58]){ const s = Math.sin(th * D2R), c = Math.cos(th * D2R);
      m.add(K.cylinder(0.05, 0.05, 0.016, 10), { color:'white:1', t:[tx + s * (TR + 0.002), TB + 0.22, tz + c * (TR + 0.002)], r:[90, th, 0] });
      m.add(K.cylinder(0.036, 0.036, 0.016, 10), { color:'sky:1', t:[tx + s * (TR + 0.008), TB + 0.22, tz + c * (TR + 0.008)], r:[90, th, 0] }); }
    // KUPOLA: ezüstszürke félgömb a párkányon, jobbra-előre forduló sötét réssel (4 ívelt lap) és a résből kinyúló távcsővel
    const DR = 0.23, dc = [tx, TT + 0.035, tz], RY = 75;
    m.add(K.lathe([[DR, 0], [DR * 0.94, DR * 0.34], [DR * 0.77, DR * 0.64], [DR * 0.5, DR * 0.87], [DR * 0.17, DR * 0.985], [0, DR]], 14), { color:'steel:1', t:dc });
    for(const e of [9, 31, 53, 75]) m.add(K.box(0.07, 0.014, 0.094), { color:'dark:2', t:at(dc, dirOf(RY, e), DR - 0.001), r:[90 - e, RY, 0] });
    const td = dirOf(RY, 42), t0 = at(dc, td, 0.1), t1 = at(dc, td, 0.37);
    rod(m, K, t0, t1, 0.036, 0.03, 10, 'white:1');                                                                       // távcső-cső
    rod(m, K, at(dc, td, 0.2), at(dc, td, 0.225), 0.041, 0.041, 10, 'honey:2');                                          // mézsárga gyűrű a csövön
    rod(m, K, t1, at(dc, td, 0.385), 0.036, 0.036, 10, 'dark:2');                                                        // lencse
    // FÖLDGÖMB ÁLLVÁNYON a bejárattól balra: mézsárga hatszög talp, fehér oszlop, égkék gömb zöld foltokkal, ferde fehér délkör-gyűrű
    const gx = -0.33, gz = 0.26, gy = 0.235, GR = 0.075;
    m.add(K.cylinder(0.068, 0.078, 0.045, 6), { color:'honey:2', t:[gx, 0.0525, gz], r:[0, 30, 0] });
    rod(m, K, [gx, 0.075, gz], [gx, gy - GR + 0.01, gz], 0.014, 0.01, 6, 'white:1');
    m.add(K.sphere(GR, 12, 7), { color:'sky:1', t:[gx, gy, gz] });
    for(const [a, e, r, k] of [[20, 25, 0.034, 3], [110, -5, 0.03, 4], [-40, -20, 0.026, 5]]){ const d = dirOf(a, e);
      m.add(blob(K, r, 400 + k, 8, 0.3), { color:'grass:1', t:at([gx, gy, gz], d, GR - 0.012), s:[1, 0.75, 1] }); }
    m.add(K.torus(GR + 0.014, 0.006, 12, 3), { color:'white:1', t:[gx, gy, gz], r:[90, 30, 23] });
    // PAD a bejárattól jobbra, a torony felé fordulva
    const b = K.model(), bc = 'wood:2';
    b.add(K.box(0.24, 0.022, 0.07), { color:bc, t:[0, 0.065, 0] });
    b.add(K.box(0.24, 0.05, 0.016), { color:bc, t:[0, 0.11, -0.035], r:[-10, 0, 0] });
    for(const sx of [-1, 1]) b.add(K.box(0.018, 0.065, 0.07), { color:bc, t:[sx * 0.1, 0.033, 0] });
    m.merge(b, { t:[0.39, 0.03, 0.3], r:[0, 200, 0] });
    return m;
  }

  Object.assign(VM, { observatory });
  root.VAROS_MODELS = VM;
  if(typeof module !== 'undefined' && module.exports) module.exports = VM;
})(typeof window !== 'undefined' ? window : globalThis);
