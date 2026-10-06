// ============================================================
//  ÉLŐ BIRTOK – változatos kellékek és a „jutalom-talaj” (2. átvilágítás: a szemétkupacok klónok voltak, a kitakarított
//  mező üres krémszínű lap). B szint (docs/rajzolas.md): 300–1200 △, kódból, ART.MAT-színek, egy mező = 1,4 egység.
//
//  • szemetkupac2 – rozsdás, eldőlt fémhordó, két zsák, törött cserép, elhajlott drótdarab (gumi NINCS benne)
//  • szemetkupac3 – felborult, törött kerti szék, gyűrött ponyva, két vödör egymásba csúszva, téglák
//  • raklap2      – egy szétesett raklap: a deszkák kupacban, egy talpgerenda félrecsúszva, csalán a tövében
//  • frissFold    – a kitakarított mező: frissen gereblyézett, sötét föld barázdákkal, rögökkel, a szélén fűcsomókkal
//  • fuFolt       – füves mező (régóta tiszta vagy eleve füves): alacsony fűcsomók, egy-két vadvirág
//  A birtok-3d.js mezőnként (x, y szerint, ismételhetően) választ változatot, forgatást és méretet – így a telek
//  egyetlen kupaca sem pontos klónja a szomszédjának. Betöltés: 3d/birtok-modellek.js UTÁN (a BT_MODELS-t bővíti).
// ============================================================
(function(root){
  const BT = root.BT_MODELS || (typeof require === 'function' ? require('./birtok-modellek.js') : null);
  const { rng, blob, rod, spread } = BT._h;

  // fűcsomó: 3–4 ferde szál egy tőből (3 △ / szál – kúp-rúd)
  function tuft(m, K, x, z, h, R, color){
    for(let k = 0; k < 4; k++){ const a = k * 1.7 + R() * 0.8;
      rod(m, K, [x, 0.02, z], [x + Math.sin(a) * h * 0.35, h * (0.75 + R() * 0.35), z + Math.cos(a) * h * 0.35], 0.018, 0, 3, color); }
  }

  // SZEMÉTKUPAC – 2. változat: eldőlt hordó, zsákok, cserépdarabok, drót
  function szemetkupac2(K){
    const m = K.model(), R = rng(1501);
    m.add(blob(K, 0.55, 1502, 12, 0.2), { color:'soil:1', t:[0, 0.04, 0], s:[1.1, 0.12, 1] });
    m.add(K.cylinder(0.2, 0.2, 0.62, 12), { color:'orange:3', t:[0.12, 0.2, -0.12], r:[0, 35, 90] });              // rozsdás hordó (fekve)
    for(const d of [-0.22, 0.22]) m.add(K.torus(0.205, 0.022, 12, 3), { color:'steel:2', t:[0.12 + Math.cos(0.61) * d, 0.2, -0.12 - Math.sin(0.61) * d], r:[0, 35, 90] });   // abroncsok
    m.add(K.cylinder(0.17, 0.17, 0.01, 10), { color:'orange:3', t:[0.12 - Math.cos(0.61) * 0.315, 0.2, -0.12 + Math.sin(0.61) * 0.315], r:[0, 35, 90] });               // a hordó feneke
    m.add(blob(K, 0.2, 1510, 12, 0.3), { color:'dark:1', t:[-0.3, 0.17, 0.2], s:[1.1, 0.85, 0.9] });              // fekete zsák
    m.add(blob(K, 0.07, 1511, 6), { color:'dark:1', t:[-0.3, 0.37, 0.18] });                                         // a zsák csomója
    m.add(blob(K, 0.16, 1512, 10, 0.3), { color:'white:2', t:[-0.42, 0.13, -0.18], s:[1.2, 0.8, 1] });              // szürke zsák
    for(let i = 0; i < 5; i++){ const [x, z] = spread(i, 5, 0.42, 0.7);                                               // törött cserép
      m.add(K.cylinder(0.07, 0.05, 0.05, 5), { color:'orange:1', t:[x + 0.15, 0.05, z + 0.22], r:[R() * 60, R() * 180, R() * 40] }); }
    rod(m, K, [0.4, 0.04, 0.3], [0.2, 0.18, 0.42], 0.01, 0.01, 3, 'steel:2');                                          // elhajlott drót
    rod(m, K, [0.2, 0.18, 0.42], [-0.05, 0.06, 0.45], 0.01, 0.01, 3, 'steel:2');
    for(let i = 0; i < 4; i++){ const [x, z] = spread(i, 4, 0.6, 1.3); tuft(m, K, x, z, 0.26, R, 'leaf:1'); }          // gaz a kupac körül
    return m;
  }

  // SZEMÉTKUPAC – 3. változat: törött kerti szék, ponyva, vödrök, téglák
  function szemetkupac3(K){
    const m = K.model(), R = rng(1601);
    m.add(blob(K, 0.55, 1602, 12, 0.2), { color:'soil:1', t:[0, 0.04, 0], s:[1.1, 0.1, 1] });
    // felborult szék: ülőlap, támla, négy láb (egy hiányzik) – oldalára dőlve
    const sz = K.model();
    sz.add(K.box(0.42, 0.04, 0.4), { color:'wood:2', t:[0, 0.4, 0] });
    for(let i = 0; i < 4; i++) sz.add(K.box(0.42, 0.06, 0.03), { color:'wood:2', t:[0, 0.48 + i * 0.1, -0.19], r:[-8, 0, 0] });
    for(const [x, z] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17]]) sz.add(K.box(0.04, 0.4, 0.04), { color:'wood:3', t:[x, 0.2, z] });
    m.merge(sz, { t:[-0.12, 0.2, -0.05], r:[0, 25, 78] });
    // gyűrött ponyva: lapos, hullámos lepel (lapított rögök)
    for(let i = 0; i < 4; i++) m.add(blob(K, 0.22, 1610 + i, 10, 0.35), { color:'blue:2', t:[0.22 + (i % 2) * 0.16, 0.06 + i * 0.012, 0.18 - (i >> 1) * 0.18], s:[1.3, 0.22, 1] });
    // két vödör egymásba csúszva, fekve
    m.add(K.lathe([[0.1, 0], [0.13, 0.24], [0.125, 0.25]], 10), { color:'white:1', t:[0.36, 0.13, -0.3], r:[0, -40, 85] });
    m.add(K.lathe([[0.095, 0], [0.122, 0.22], [0.118, 0.23]], 10), { color:'leaf:2', t:[0.28, 0.13, -0.24], r:[0, -40, 85] });
    for(const [x, z, a] of [[-0.4, 0.3, 10], [-0.3, 0.38, 70], [-0.44, 0.42, 40]])                                        // téglák
      m.add(K.chamferBox(0.2, 0.06, 0.1, 0.01), { color:'tomato:2', t:[x, 0.06 + R() * 0.04, z], r:[0, a, R() * 12] });
    for(let i = 0; i < 3; i++){ const [x, z] = spread(i, 3, 0.6, 2.2); tuft(m, K, x, z, 0.24, R, 'leaf:1'); }
    return m;
  }

  // KORHADT RAKLAP – 2. változat: szétesett raklap, deszkák kupacban, csalán
  function raklap2(K){
    const m = K.model(), R = rng(1701);
    for(let i = 0; i < 9; i++)                                                                                            // egymásra dobált lécek
      m.add(K.chamferBox(0.95, 0.03, 0.1, 0.008), { color:i % 3 ? 'wood:2' : 'cardboard:2', t:[R() * 0.16 - 0.08, 0.03 + i * 0.03, R() * 0.4 - 0.2], r:[0, R() * 60 - 30, R() * 6 - 3] });
    m.add(K.box(1.0, 0.09, 0.08), { color:'wood:3', t:[0.05, 0.05, 0.42], r:[0, 12, 0] });                             // félrecsúszott talpgerenda
    m.add(K.box(0.09, 0.09, 0.09), { color:'wood:3', t:[-0.42, 0.05, -0.36], r:[0, 30, 0] });                           // talpkocka
    for(const [x, z] of [[0.42, -0.3], [-0.44, 0.12], [0.38, 0.22]]){                                                    // csalán
      rod(m, K, [x, 0.02, z], [x, 0.5, z], 0.014, 0.01, 4, 'leaf:2');
      for(let k = 0; k < 3; k++) BT._h.leaf(m, K, [x, 0.18 + k * 0.12, z], k * 120 + 20, 25, 0.16, 0.09, 'leaf:2'); }
    for(const [x, y, z] of [[-0.2, 0.24, 0.05], [0.25, 0.2, -0.1]]) m.add(blob(K, 0.06, 1710 + x * 10, 6), { color:'grass:1', t:[x, y, z], s:[1.5, 0.45, 1.2] });   // moha
    return m;
  }

  // FRISS FÖLD: a kitakarított mező „jutalomképe” – gereblyézett barázdák, rögök, a szélén megmaradt fűcsomók
  function frissFold(K){
    const m = K.model(), R = rng(1801), L = 1.26;
    m.add(K.chamferBox(L, 0.06, L, 0.02), { color:'soil:2', t:[0, 0.03, 0] });                                         // a föld lapja
    for(let i = 0; i < 5; i++) m.add(K.chamferBox(L - 0.12, 0.05, 0.1, 0.02), { color:'soil:1', t:[0, 0.075, -0.48 + i * 0.24] });   // barázdák (gereblye nyoma)
    for(let i = 0; i < 9; i++){ const [x, z] = spread(i, 9, 0.52, 0.4); m.add(blob(K, 0.035 + R() * 0.02, 1810 + i, 6), { color:'soil:2', t:[x, 0.09, z] }); }   // rögök
    for(const [x, z] of [[-0.58, -0.56], [0.56, -0.5], [-0.55, 0.58], [0.6, 0.52], [0.0, -0.62]]) tuft(m, K, x, z, 0.2, R, 'grass:2');   // fű a szélén
    return m;
  }

  // FÜVES FOLT: régóta tiszta (vagy eleve füves) mező – alacsony fűcsomók és egy-két vadvirág, hogy ne legyen üres lap
  function fuFolt(K, o){
    o = o || {}; const m = K.model(), R = rng(1901 + (o.mag | 0));
    m.add(K.chamferBox(1.3, 0.03, 1.3, 0.015), { color:'grass:1', t:[0, 0.015, 0] });
    for(let i = 0; i < 9; i++){ const [x, z] = spread(i, 9, 0.6, (o.mag | 0) * 0.9); tuft(m, K, x, z, 0.18 + R() * 0.08, R, i % 3 ? 'grass:2' : 'leaf:1'); }
    for(let i = 0; i < 2; i++){ const [x, z] = spread(i + 3, 6, 0.5, 1.1 + (o.mag | 0));                                // vadvirág
      rod(m, K, [x, 0.02, z], [x, 0.22, z], 0.01, 0.008, 3, 'leaf:2'); m.add(blob(K, 0.04, 1920 + i, 6), { color:i ? 'white:1' : 'honey:1', t:[x, 0.24, z] }); }
    return m;
  }

  Object.assign(BT, { szemetkupac2, szemetkupac3, raklap2, frissFold, fuFolt });
  if(typeof module !== 'undefined' && module.exports) module.exports = BT;
})(typeof window !== 'undefined' ? window : globalThis);
