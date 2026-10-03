// ============================================================
//  ÉLŐ BIRTOK – NÖVÉNYEK (B szint: docs/rajzolas.md) – a BT_MODELS-be kerülnek (3d/birtok-modellek.js mellé, UTÁNA töltődik).
//
//  noveny(K, { faj, szakasz })  EGY mezőnyi vetemény (néhány tő, < 600 △), talp y = 0: a játék az ágyás felszínére teszi (agyas → m.top).
//     faj: paradicsom · paprika · salata · retek · borso · bab · cukkini · sutotok · burgonya · hagyma · sargarepa · kaposzta · eper ·
//          bazsalikom · koromvirag · zoldtragya (facélia + mustár keverék)  – a lista: BT_MODELS.FAJOK
//     szakasz: 0 = csíra · 1 = növekvő · 2 = virágzó · 3 = érett (látható termés)                – a nevek: BT_MODELS.SZAKASZOK
//     Felismerhetőség diorámatávolságból: paradicsom karóval, borsó hálón, bab karó-sátoron, tök indákon, káposzta- és salátarózsa,
//     hagyma-tüskék, eper alacsony levéllel és piros pöttyel, burgonya bokrosan bakhátakon.
//  meggyfa(K, { szakasz })      0 = csemete karóval · 1 = fiatal fa (első termés) · 2 = termő fa sok meggyel. Az almafa: EK_MODELS.tree.
//  malnasor(K, { szakasz })     málnasor oszlopokkal és dróttal az X mentén: 0 = ültetett vesszők · 1 = lombos · 2 = érett málnával.
//  Lépték, tengelyek: mint a birtok-modellek.js (1 mező = 1,4 egység, 1 m ≈ 1,38 egység, eleje +Z).
// ============================================================
(function(root){
  const BT = root.BT_MODELS || (typeof require === 'function' ? require('./birtok-modellek.js') : null);
  const { rng, blob, rod, spread, leaf, grid } = BT._h;
  const FAJOK = ['paradicsom', 'paprika', 'salata', 'retek', 'borso', 'bab', 'cukkini', 'sutotok', 'burgonya', 'hagyma', 'sargarepa', 'kaposzta', 'eper', 'bazsalikom', 'koromvirag', 'zoldtragya'];
  const SZAKASZOK = ['csíra', 'növekvő', 'virágzó', 'érett'];
  const D2R = Math.PI / 180;

  // csíra: rövid szár + két sziklevél (≈ 30 △); s = méret
  function sprout(m, K, x, z, s, a){
    rod(m, K, [x, 0, z], [x, 0.07 * s, z], 0.012 * s, 0.008 * s, 3, 'leaf:1');
    for(const k of [0, 180]) leaf(m, K, [x, 0.07 * s, z], a + k, 35, 0.06 * s, 0.05 * s, 'leaf:0');
  }
  // tüske-csíra (hagyma, répa, zöldtrágya-fű): 2 vékony kúp
  const spike = (m, K, x, z, h, c) => { for(const k of [-1, 1]) rod(m, K, [x, 0, z], [x + k * 0.015, h, z + k * 0.01], 0.012, 0, 3, c || 'leaf:0'); };
  // termés-pötty és bokor-lomb
  const dot = (m, K, p, r, c, seed, n, s) => m.add(blob(K, r, seed, n || 6, 0.08), { color:c, t:p, s });
  const bush = (m, K, p, r, c, seed, n, s) => m.add(blob(K, r, seed, n || 10, 0.2), { color:c, t:p, s });

  // ---- fajonként: tövek helye + a 0. szakasz módja + építő (1–3. szakasz) ----
  const F = {
    paradicsom:{ pos:grid(2, 2, 0.62, 0.6), seed:1.2, b(m, K, x, z, st, R, i){                                   // karó, felfutó szár, sárga virág, piros bogyók
      const s = [0, 0.55, 0.85, 1][st], h = 1.15 * s;
      m.add(K.box(0.035, h + 0.18, 0.035), { color:'wood:1', t:[x + 0.08, (h + 0.18) / 2, z - 0.06] });
      rod(m, K, [x, 0, z], [x + 0.03, h, z - 0.02], 0.024, 0.014, 4, 'leaf:2');
      [[0.3, 0.17, -1], [0.62, 0.16, 1], [0.92, 0.12, -1]].forEach(([f, r, sd], k) => bush(m, K, [x + sd * 0.07, h * f, z + 0.02], r * (0.6 + 0.4 * s), k % 2 ? 'leaf:2' : 'leaf:1', 40 + i * 3 + k));
      if(st === 2) for(let k = 0; k < 3; k++) dot(m, K, [x + 0.1 - k * 0.09, h * (0.5 + k * 0.17), z + 0.12], 0.028, 'honey:1', 50 + k, 5);
      if(st === 3) for(let k = 0; k < 5; k++) dot(m, K, [x + (k % 2 ? 0.14 : -0.13), h * (0.25 + k * 0.14), z + 0.11 - (k % 2) * 0.08], 0.068, 'tomato:1', 60 + k, 8);
    } },
    paprika:{ pos:grid(2, 2, 0.6, 0.6), seed:1, b(m, K, x, z, st, R, i){                                          // alacsony bokor, lecsüngő hosszúkás termés
      const s = [0, 0.6, 0.85, 1][st];
      rod(m, K, [x, 0, z], [x, 0.3 * s, z], 0.02, 0.014, 4, 'leaf:2');
      bush(m, K, [x, 0.3 * s, z], 0.21 * s, 'leaf:1', 70 + i, 10, [1, 0.8, 1]); bush(m, K, [x - 0.07, 0.46 * s, z + 0.04], 0.15 * s, 'leaf:2', 74 + i, 8);
      if(st === 2) for(let k = 0; k < 3; k++) dot(m, K, [x - 0.1 + k * 0.1, 0.42, z + 0.12], 0.026, 'white:1', 80 + k, 5);
      if(st === 3) [[-0.15, 'red:1'], [0.16, 'red:1'], [0.0, 'honey:2']].forEach(([dx, c], k) => dot(m, K, [x + dx, 0.24, z + 0.16 - (k % 2) * 0.3], 0.052, c, 84 + k, 7, [0.9, 1.7, 0.9]));
    } },
    salata:{ pos:grid(3, 3, 0.4, 0.4), seed:0.9, b(m, K, x, z, st, R, i){                                         // világoszöld rózsák
      const r = [0, 0.09, 0.15, 0.17][st];
      bush(m, K, [x, r * 0.45, z], r, 'leaf:1', 90 + i, 10, [1.25, 0.55, 1.25]);
      if(st > 1) for(let k = 0; k < 2; k++) leaf(m, K, [x, 0.03, z], i * 40 + k * 180, 30, r * 1.3, r * 1.1, 'leaf:0');
      bush(m, K, [x, r * 0.75, z], r * 0.62, 'leaf:0', 100 + i, 8);
    } },
    retek:{ pos:grid(3, 4, 0.36, 0.27), seed:0.7, b(m, K, x, z, st, R, i){                                        // apró levélcsokor, a földből kibúvó rózsaszín gumó
      const s = [0, 0.7, 1, 1][st];
      for(let k = 0; k < 3; k++) leaf(m, K, [x, 0.02, z], k * 120 + i * 30, 50, 0.17 * s, 0.08 * s, k % 2 ? 'leaf:2' : 'leaf:1');
      if(st === 3) dot(m, K, [x, 0.035, z], 0.06, 'pink:2', 110 + i, 6);
    } },
    borso:{ pos:grid(5, 1, 0.22, 0), seed:1, frame:'halo', b(m, K, x, z, st, R, i){                                // hálóra kapaszkodik, fehér virág, zöld hüvely
      const h = [0, 0.4, 0.8, 0.85][st];
      rod(m, K, [x, 0, z + 0.05], [x + 0.03, h, z + 0.03], 0.016, 0.01, 3, 'leaf:1');
      for(let k = 0; k < 3; k++) bush(m, K, [x + (k % 2 ? 0.07 : -0.06), h * (0.3 + k * 0.3), z + 0.06], 0.075, k % 2 ? 'grass:1' : 'leaf:1', 120 + i * 3 + k, 8);
      if(st === 2) for(let k = 0; k < 2; k++) dot(m, K, [x + 0.04 - k * 0.08, h * (0.5 + k * 0.3), z + 0.13], 0.03, 'white:1', 130 + k, 5);
      if(st === 3) for(let k = 0; k < 3; k++) dot(m, K, [x - 0.08 + k * 0.08, h * (0.35 + (k % 2) * 0.3), z + 0.12], 0.032, 'grass:0', 135 + k, 6, [0.7, 2.2, 0.7]);
    } },
    bab:{ pos:[[-0.32, 0], [0.32, 0]], seed:1.4, frame:'sator', b(m, K, x, z, st, R, i){                            // karó-sátor, felfutó inda, piros virág, hosszú hüvely
      const h = [0, 0.6, 1.3, 1.4][st];
      for(let p = 0; p < 3; p++){ const a = (p * 120 + 30) * D2R, bx = x + Math.sin(a) * 0.26, bz = z + Math.cos(a) * 0.26;
        const tx = bx + (x - bx) * h / 1.55, tz = bz + (z - bz) * h / 1.55;
        rod(m, K, [bx, 0, bz], [x + Math.sin(a) * 0.03, 1.5, z + Math.cos(a) * 0.03], 0.016, 0.012, 3, 'wood:1');            // karó
        rod(m, K, [bx + 0.02, 0, bz], [tx + 0.02, h, tz], 0.012, 0.008, 3, 'leaf:1');                                          // inda
        for(let k = 0; k < 3; k++){ const f = 0.25 + k * 0.3; dot(m, K, [bx + (x - bx) * f * h / 1.55 + 0.03, h * f, bz + (z - bz) * f * h / 1.55], 0.1, k % 2 ? 'leaf:2' : 'leaf:1', 140 + i * 9 + p * 3 + k, 8); }
        if(st === 2) dot(m, K, [bx + (x - bx) * 0.5 - 0.05, h * 0.55, bz + (z - bz) * 0.5], 0.03, 'red:1', 160 + p, 5);
        if(st === 3) for(const f of [0.4, 0.7]) m.add(K.cylinder(0.014, 0.01, 0.2, 4), { color:'leaf:0', t:[bx + (x - bx) * f * h / 1.55 - 0.05, h * f - 0.1, bz + (z - bz) * f * h / 1.55 + 0.03] });
      }
    } },
    cukkini:{ pos:[[0, 0]], seed:2.2, hill:true, b(m, K, x, z, st, R, i){                                                     // nagy, sötét levelek, sárga tölcsérvirág, sötétzöld termés
      const s = [0, 0.55, 0.9, 1][st];
      bush(m, K, [x, 0.12 * s, z], 0.14 * s, 'leaf:1', 170, 10);
      for(let k = 0; k < 9; k++) leaf(m, K, [x, 0.1 * s, z], k * 40 + 10, 26 + (k % 3) * 10, 0.52 * s, 0.44 * s, k % 2 ? 'leaf:2' : 'leaf:1');
      if(st === 2) for(const a of [60, 220]) m.add(K.cylinder(0.075, 0.015, 0.12, 6), { color:'honey:1', t:[x + Math.sin(a * D2R) * 0.22, 0.3, z + Math.cos(a * D2R) * 0.22], r:[-30, a, 0] });
      if(st === 3) for(const a of [20, 140, 260]){ m.add(K.cylinder(0.05, 0.045, 0.32, 6), { color:'leaf:3', t:[x + Math.sin(a * D2R) * 0.32, 0.06, z + Math.cos(a * D2R) * 0.32], r:[90, a, 0] });
        dot(m, K, [x + Math.sin(a * D2R) * 0.5, 0.06, z + Math.cos(a * D2R) * 0.5], 0.03, 'honey:1', 175, 5); }
    } },
    sutotok:{ pos:[[0, 0]], seed:2, hill:true, b(m, K, x, z, st, R, i){                                                        // szétfutó indák levelekkel, narancs tökök
      const s = [0, 0.5, 0.9, 1][st];
      for(let v = 0; v < 4; v++){ const a = (v * 90 + 45) * D2R, mid = [Math.sin(a + 0.4) * 0.3 * s, 0.03, Math.cos(a + 0.4) * 0.3 * s], end = [Math.sin(a) * 0.6 * s, 0.03, Math.cos(a) * 0.6 * s];
        rod(m, K, [x, 0.03, z], mid, 0.018, 0.016, 3, 'leaf:1'); rod(m, K, mid, end, 0.016, 0.01, 3, 'leaf:1');
        for(let k = 1; k < 3; k++){ const p = k === 1 ? mid : end;
          leaf(m, K, [x + p[0], 0.04, z + p[2]], v * 90 + 45 + (k - 1) * 70, 35, 0.32 * s, 0.3 * s, (v + k) % 2 ? 'leaf:2' : 'leaf:1'); } }
      if(st === 2) for(const a of [0, 120, 240]) m.add(K.cylinder(0.07, 0.014, 0.11, 6), { color:'honey:1', t:[x + Math.sin(a * D2R) * 0.3, 0.12, z + Math.cos(a * D2R) * 0.3], r:[-20, a, 0] });
      if(st === 3) [[0.0, -0.3, 1.3], [0.34, 0.24, 1.1], [-0.36, 0.2, 0.95]].forEach(([dx, dz, k]) => {
        m.add(K.lathe([[0.02, 0], [0.13, 0.02], [0.16, 0.08], [0.12, 0.15], [0.02, 0.165]], 10), { color:'orange:1', t:[x + dx, 0, z + dz], s:[k, k, k] });
        m.add(K.cylinder(0.014, 0.02, 0.06, 5), { color:'wood:2', t:[x + dx, 0.18 * k, z + dz] }); });
    } },
    burgonya:{ pos:grid(3, 2, 0.4, 0.62), seed:1.1, ridges:true, b(m, K, x, z, st, R, i){                         // bakháton bokros tő, fehér-lila virág, érésre sárguló lomb és gumók
      const s = [0, 0.6, 1, 0.9][st], c0 = st === 3 ? 'grass:2' : 'leaf:1', c1 = st === 3 ? 'cardboard:1' : 'leaf:2';
      bush(m, K, [x, 0.12 + 0.12 * s, z], 0.18 * s, c1, 180 + i, 12, [1, 0.8, 1]); bush(m, K, [x + 0.05, 0.12 + 0.24 * s, z - 0.03], 0.13 * s, c0, 186 + i, 10);
      if(st === 2) for(let k = 0; k < 3; k++) dot(m, K, [x - 0.08 + k * 0.08, 0.42, z + 0.06 - (k % 2) * 0.1], 0.028, k % 2 ? 'purple:0' : 'white:1', 192 + k, 5);
      if(st === 3) for(let k = 0; k < 2; k++) dot(m, K, [x + (k ? 0.14 : -0.15), 0.07, z + 0.2], 0.05, 'cardboard:1', 195 + i + k, 6, [1.2, 0.85, 1]);
    } },
    hagyma:{ pos:grid(5, 3, 0.24, 0.36), seed:0, sp:'spike', b(m, K, x, z, st, R, i){                              // kékeszöld tüskék, érve hagymafej és ledőlő szár
      const h = [0, 0.26, 0.38, 0.3][st], fl = st === 3;
      for(let k = 0; k < 3; k++){ const a = (k * 120 + i * 25) * D2R, lean = fl ? 0.16 : 0.04;
        rod(m, K, [x, 0.02, z], [x + Math.sin(a) * lean, h - (fl ? 0.12 : 0), z + Math.cos(a) * lean], 0.024, 0, 3, fl && k ? 'cardboard:1' : 'grass:2'); }
      if(st === 2 && i % 3 === 1){ rod(m, K, [x, 0, z], [x, 0.5, z], 0.008, 0.008, 3, 'sage:3'); dot(m, K, [x, 0.52, z], 0.05, 'white:1', 200 + i, 8); }
      if(fl) dot(m, K, [x, 0.04, z], 0.065, 'cardboard:1', 205 + i, 6, [1, 0.75, 1]);
    } },
    sargarepa:{ pos:grid(4, 3, 0.3, 0.38), seed:0, sp:'spike', b(m, K, x, z, st, R, i){                            // finom, tollas levélcsokor, érve narancs répafej
      const h = [0, 0.18, 0.3, 0.34][st];
      for(let k = 0; k < 3; k++){ const a = (k * 120 + i * 40) * D2R, tip = [x + Math.sin(a) * 0.07, h, z + Math.cos(a) * 0.07];
        rod(m, K, [x, 0.02, z], tip, 0.016, 0, 3, 'leaf:1'); if(k < 2) dot(m, K, tip, 0.06, k ? 'grass:2' : 'leaf:1', 210 + i * 2 + k, 6, [1, 0.6, 1]); }
      if(st === 3) m.add(K.cylinder(0.046, 0, 0.08, 5), { color:'orange:1', t:[x, 0.025, z] });
    } },
    kaposzta:{ pos:grid(2, 2, 0.62, 0.62), seed:1.3, b(m, K, x, z, st, R, i){                                     // kékes, nagy külső levelek, halvány fej
      const s = [0, 0.6, 0.85, 1][st], hr = [0, 0.05, 0.1, 0.15][st];
      for(let k = 0; k < 6; k++) leaf(m, K, [x, 0.03, z], k * 60 + i * 20, 22 + (k % 2) * 16, 0.3 * s, 0.27 * s, k % 2 ? 'teal:2' : 'grass:2');
      bush(m, K, [x, hr * 0.8 + 0.02, z], hr, 'grass:1', 220 + i, 12);
    } },
    eper:{ pos:grid(3, 3, 0.38, 0.38), seed:0.8, b(m, K, x, z, st, R, i){                                         // alacsony, hármas levél, fehér virág, piros szemek
      for(let k = 0; k < 3; k++){ const a = (k * 120 + i * 30) * D2R; bush(m, K, [x + Math.sin(a) * 0.06, 0.07 + 0.02 * st, z + Math.cos(a) * 0.06], 0.065 + 0.01 * st, k % 2 ? 'leaf:2' : 'leaf:1', 230 + i * 3 + k, 8, [1.2, 0.5, 1.2]); }
      if(st === 2) for(let k = 0; k < 2; k++) dot(m, K, [x + (k ? 0.1 : -0.09), 0.1, z + 0.08], 0.03, 'white:1', 240 + k, 6, [1, 0.5, 1]);
      if(st === 3) for(let k = 0; k < 3; k++){ const a = (k * 120 + 60 + i * 30) * D2R; dot(m, K, [x + Math.sin(a) * 0.13, 0.035, z + Math.cos(a) * 0.13], 0.035, 'red:1', 245 + k, 5, [1, 1.2, 1]); }
    } },
    bazsalikom:{ pos:grid(3, 2, 0.4, 0.55), seed:0.8, b(m, K, x, z, st, R, i){                                     // élénkzöld, tömött bokrocska; virágzáskor fehér füzér
      const s = [0, 0.6, 0.85, 1][st];
      bush(m, K, [x, 0.13 * s, z], 0.13 * s, 'leaf:2', 250 + i, 10);
      for(let k = 0; k < (st === 3 ? 4 : 2); k++){ const a = k * 1.7 + i; bush(m, K, [x + Math.sin(a) * 0.06, (0.24 + (k > 1 ? 0.06 : 0)) * s, z + Math.cos(a) * 0.05], 0.08 * s, 'leaf:1', 256 + i * 4 + k, 8); }
      if(st === 2) for(let k = 0; k < 2; k++){ const p = [x + (k ? 0.05 : -0.05), 0.4, z]; rod(m, K, [p[0], 0.2, p[2]], p, 0.01, 0.008, 3, 'leaf:1'); dot(m, K, p, 0.025, 'white:1', 262 + k, 5, [0.8, 2, 0.8]); }
    } },
    koromvirag:{ pos:grid(3, 2, 0.4, 0.55), seed:0.9, b(m, K, x, z, st, R, i){                                     // bokros tő, narancs tányérvirágok
      const s = [0, 0.6, 0.9, 1][st];
      bush(m, K, [x, 0.12 * s, z], 0.13 * s, 'leaf:1', 270 + i, 10); bush(m, K, [x + 0.05, 0.2 * s, z - 0.03], 0.08 * s, 'leaf:2', 276 + i, 8);
      const n = [0, 0, 2, 3][st];
      for(let k = 0; k < n; k++){ const a = (k * 120 + i * 50) * D2R, p = [x + Math.sin(a) * 0.08, 0.3 + (k % 2) * 0.04, z + Math.cos(a) * 0.08];
        dot(m, K, p, 0.06, 'orange:1', 280 + k, 8, [1, 0.35, 1]); dot(m, K, [p[0], p[1] + 0.015, p[2]], 0.022, 'orange:2', 284 + k, 5); }
      if(st === 2) dot(m, K, [x - 0.06, 0.28, z + 0.06], 0.025, 'leaf:2', 288, 5);
    } },
    zoldtragya:{ pos:grid(4, 3, 0.32, 0.38), seed:0.6, b(m, K, x, z, st, R, i){                                     // sűrű takaró: facélia lila és mustár sárga virággal
      const s = [0, 0.6, 0.9, 1][st], c = i % 2 ? 'purple:1' : 'honey:1';
      bush(m, K, [x, 0.1 * s, z], 0.14 * s, i % 3 ? 'leaf:1' : 'leaf:2', 290 + i, 8, [1.1, 0.8, 1.1]);
      if(st > 1) for(let k = 0; k < st - 1; k++){ const p = [x + (k ? 0.06 : -0.05), 0.32 + k * 0.04, z + (k ? 0.04 : -0.03)];
        rod(m, K, [p[0], 0.1, p[2]], p, 0.014, 0, 3, 'leaf:1'); dot(m, K, p, 0.055, c, 300 + i + k, 6, i % 2 ? [0.8, 1.4, 0.8] : [1, 0.6, 1]); }
    } },
  };

  // támaszok: borsóháló (két oszlop, zsinórháló) és bab-karósátor (a karókat a b() rajzolja)
  function halo(m, K){
    for(const sx of [-1, 1]) m.add(K.box(0.04, 1.0, 0.04), { color:'wood:2', t:[sx * 0.58, 0.5, -0.02] });
    for(const y of [0.3, 0.6, 0.95]) m.add(K.box(1.16, 0.01, 0.01), { color:'cardboard:0', t:[0, y, -0.02] });
    for(let k = 0; k < 5; k++) m.add(K.box(0.01, 0.92, 0.01), { color:'cardboard:0', t:[-0.44 + k * 0.22, 0.48, -0.02] });
  }

  function noveny(K, o){
    o = o || {};
    const faj = F[o.faj] ? o.faj : 'paradicsom', sp = F[faj], st = Math.max(0, Math.min(3, o.szakasz == null ? 3 : o.szakasz | 0));
    const m = K.model(), R = rng(7 + FAJOK.indexOf(faj) * 13 + st);
    if(sp.frame === 'halo') halo(m, K);
    if(sp.ridges) for(const z of [-0.31, 0.31]) m.add(K.chamferBox(1.2, 0.12, 0.34, 0.05), { color:'soil:1', t:[0, 0.06, z] });   // bakhát
    const y0 = sp.ridges ? 0.11 : 0;
    if(sp.hill && st < 2) m.add(blob(K, 0.22, 17, 10, 0.1), { color:'soil:2', t:[0, 0.02, 0], s:[1, 0.2, 1] });           // ültetőkupac (tökféle)
    const pts = st === 0 && sp.hill ? [[-0.1, -0.06], [0.1, -0.06], [0, 0.1]] : sp.pos;                                 // fészekbe 3 mag
    pts.forEach(([x, z], i) => {
      if(st === 0){ const sub = K.model();
        if(sp.sp === 'spike') spike(sub, K, x, z, 0.08, 'leaf:0'); else sprout(sub, K, x, z, sp.seed, i * 47);
        if(sp.frame === 'sator') sprout(sub, K, x + 0.14, z + 0.1, sp.seed, i * 47 + 90);
        m.merge(sub, { t:[0, y0 + (sp.hill ? 0.05 : 0), 0] }); return; }
      const sub = K.model(); sp.b(sub, K, x, z, st, R, i); m.merge(sub, { t:[0, y0, 0] });
    });
    if(st === 0 && sp.frame === 'sator') for(const x of [-0.32, 0.32]) for(let p = 0; p < 3; p++){ const a = (p * 120 + 30) * D2R;   // a karók már állnak
      rod(m, K, [x + Math.sin(a) * 0.26, 0, Math.cos(a) * 0.26], [x + Math.sin(a) * 0.03, 1.5, Math.cos(a) * 0.03], 0.016, 0.012, 3, 'wood:1'); }
    m.faj = faj; m.szakasz = st;
    return m;
  }

  // ================= MEGGYFA: sötétvörös kéreg, széles, kissé lecsüngő korona, párosával lógó meggyek =================
  function meggyfa(K, o){
    o = o || {};
    const st = Math.max(0, Math.min(2, o.szakasz == null ? 2 : o.szakasz | 0)), m = K.model(), R = rng(311 + st);
    m.add(K.lathe([[0.42, 0], [0.36, 0.04], [0.14, 0.09], [0, 0.1]], 12), { color:'soil:1' });                           // tányér
    const S = [
      { trunk:[[0.045, 0], [0.03, 0.1], [0.018, 0.85]], top:0.85, crowns:[[0.02, 0.9, 0.02, 0.15], [-0.11, 0.76, 0.04, 0.11], [0.12, 0.78, -0.03, 0.11]] },
      { trunk:[[0.11, 0], [0.075, 0.1], [0.055, 1.1], [0.04, 1.35]], top:1.35, crowns:[[0, 1.62, 0, 0.42], [0.36, 1.42, 0.1, 0.32], [-0.34, 1.44, -0.08, 0.33], [0.04, 1.42, 0.36, 0.3]] },
      { trunk:[[0.22, 0], [0.15, 0.12], [0.12, 0.5], [0.1, 1.3], [0.07, 1.6]], top:1.6, crowns:[[0, 2.1, 0, 0.6], [0.55, 1.8, 0.15, 0.48], [-0.52, 1.82, -0.12, 0.5], [0.1, 1.78, -0.55, 0.46], [-0.14, 1.8, 0.54, 0.46], [0.02, 2.5, 0.04, 0.4]] },
    ][st];
    m.add(K.lathe(S.trunk, st ? 10 : 6), { color:'chocolate:1' });
    if(st < 2){ const hk = st ? 1.25 : 1.1;                                                                                  // karó + kötés
      m.add(K.chamferBox(0.07, hk, 0.07, 0.015), { color:'wood:1', t:[0.15, hk / 2, -0.05] });
      m.add(K.box(0.2, 0.035, 0.04), { color:'wood:1', t:[0.08, hk * 0.62, -0.02], r:[0, -16, 0] }); }
    S.crowns.slice(1).forEach(c => st && rod(m, K, [0, S.top * 0.7, 0], [c[0] * 0.7, c[1] - 0.1, c[2] * 0.7], 0.04 + st * 0.02, 0.022, 6, 'chocolate:1'));
    S.crowns.forEach((c, i) => m.add(blob(K, c[3], 330 + i + st * 10, st ? 18 : 12), { color:i % 2 ? 'leaf:2' : 'leaf:1', t:c.slice(0, 3), s:[1.12, 0.82, 1.12] }));
    const n = [0, 8, 16][st];
    for(let i = 0; i < n; i++){ const c = S.crowns[1 + i % (S.crowns.length - 1)], a = R() * Math.PI * 2, rr = c[3] * 1.08;   // meggypárok a korona alsó felén
      const p = [c[0] + Math.cos(a) * rr, c[1] - c[3] * (0.15 + R() * 0.35), c[2] + Math.sin(a) * rr];
      for(const k of [-1, 1]) m.add(blob(K, 0.06, 350 + i * 2 + k, 6, 0.05), { color:k > 0 ? 'red:2' : 'red:1', t:[p[0] + k * 0.04, p[1] - (k > 0 ? 0.03 : 0), p[2]] }); }
    return m;
  }

  // ================= MÁLNASOR: két oszlop, két sor drót, a sorban 7 vessző; érve piros málnaszemek =================
  function malnasor(K, o){
    o = o || {};
    const st = Math.max(0, Math.min(2, o.szakasz == null ? 2 : o.szakasz | 0)), m = K.model(), R = rng(401 + st);
    m.add(K.chamferBox(1.3, 0.06, 0.42, 0.02), { color:'soil:1', t:[0, 0.03, 0] });
    m.add(K.chamferBox(1.24, 0.03, 0.36, 0.01), { color:'cardboard:0', t:[0, 0.07, 0] });                                // szalmatakarás
    for(const sx of [-1, 1]) m.add(K.box(0.06, 1.25, 0.06), { color:'wood:2', t:[sx * 0.62, 0.625, 0] });
    for(const y of [0.6, 1.05]) for(const sz of [-1, 1]) m.add(K.box(1.24, 0.01, 0.01), { color:'steel:2', t:[0, y, sz * 0.07] });
    for(let i = 0; i < 7; i++){ const x = -0.48 + i * 0.16, z = (R() - 0.5) * 0.08;
      if(st === 0){ rod(m, K, [x, 0.06, z], [x, 0.36, z], 0.016, 0.01, 3, 'wood:2'); leaf(m, K, [x, 0.3, z], i * 70, 40, 0.08, 0.06, 'leaf:0'); continue; }
      const top = [x + (R() - 0.5) * 0.12, 1.15 + R() * 0.15, z + (i % 2 ? 0.1 : -0.1)], mid = [x, 0.65, z];
      rod(m, K, [x, 0.06, z], mid, 0.02, 0.016, 3, 'wood:2'); rod(m, K, mid, top, 0.016, 0.01, 3, 'wood:2');
      const on = f => f < 0.5 ? [x + (mid[0] - x) * f * 2, 0.06 + (mid[1] - 0.06) * f * 2, z] : [mid[0] + (top[0] - mid[0]) * (f * 2 - 1), mid[1] + (top[1] - mid[1]) * (f * 2 - 1), mid[2] + (top[2] - mid[2]) * (f * 2 - 1)];
      for(let k = 0; k < 4; k++){ const p = on(0.35 + k * 0.2), sd = k % 2 ? 1 : -1;                                       // lomb a vessző mentén
        m.add(blob(K, 0.12, 420 + i * 4 + k, 10, 0.3), { color:(i + k) % 2 ? 'leaf:1' : 'leaf:2', t:[p[0] + sd * 0.05, p[1], p[2] + sd * 0.07], r:[0, i * 37 + k * 50, 0] });
        if(st === 2) m.add(blob(K, 0.042, 450 + i * 4 + k, 6, 0.05), { color:'red:1', t:[p[0] - sd * 0.06, p[1] - 0.1, p[2] + sd * 0.15] }); }
    }
    return m;
  }

  Object.assign(BT, { FAJOK, SZAKASZOK, noveny, meggyfa, malnasor });
  root.BT_MODELS = BT;
  if(typeof module !== 'undefined' && module.exports) module.exports = BT;
})(typeof window !== 'undefined' ? window : globalThis);
