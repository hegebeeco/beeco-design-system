// ============================================================
//  Matricák — „A mi bolygónk” (földgömb-játék) útlevél-PECSÉTJEI, B szinten (docs/rajzolas.md, docs/bolygo-jatekterv.md)
//  11 pecsét: 5 óceán (Csendes, Atlanti, Indiai, Déli-óceán + Antarktisz, Jeges-tenger) és 6 kontinens-régió
//  (Európa, Ázsia, Afrika, Észak-Amerika, Dél-Amerika, Óceánia). A játék útlevelében ~44 px-en jelennek meg
//  (artIcon('bl_pecset_<régió>')) → nagy, egyszerű, barátságos állat-motívum, pecsétenként MÁS tintaszín és más sziluett.
//  Felépítés (mind a 11 ugyanígy): csúcsára állított HATSZÖG (a beeco-méhsejt, mint a .ds-hex) ±8°-ban megdöntve →
//  tinta-színű keret (világos sáv bal-fent, sötét + élsáv jobb-lent) → halvány, azonos színcsaládú mező → szaggatott
//  („perforált”) belső szegély → középen a motívum a tinta tónusaiban → fénycsík. Egy pecsét = EGY anyag az ART.MAT-ból.
//  A rajz nem politikai: nincs szöveg, betű, szám, zászló, határvonalas térkép, nemzeti jelkép vagy épület – csak állatok.
//  Az élőlények 2D-ben rajzolva (y lefelé), a fény bal-fentről. A segédek (simítás, vágás, fin() illesztés) az art-halo.js
//  készletének másolatai, így a fájl önálló. Render: node tools/art-render.js 2d web/js/art/art-bolygo.js ki.png
//  Emoji-álnév nincs: a játék névvel kéri (bolygo-utlevel.js → 'bl_pecset_' + régió).
// ============================================================
(function(){
  const { rad, band } = ART.geo;
  const { hypot, max, min, abs } = Math;
  const sin = d => Math.sin(rad(d)), cos = d => Math.cos(rad(d)), r1 = n => Math.round(n * 10) / 10;

  // ---------------- 2D segédek ----------------
  const area = poly => poly.reduce((a, p, i) => { const q = poly[(i + 1) % poly.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
  const orient = p => (area(p) >= 0 ? p : [...p].reverse());
  // Douglas–Peucker ritkítás (zárt sokszög) – kicsi SVG
  function simplify(poly, eps = .25){
    const dp = pts => { if(pts.length < 3) return pts;
      const a = pts[0], b = pts[pts.length - 1], L = hypot(b[0] - a[0], b[1] - a[1]) || 1; let best = 0, bi = 0;
      for(let i = 1; i < pts.length - 1; i++){ const d = abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if(d > best){ best = d; bi = i; } }
      return best > eps ? [...dp(pts.slice(0, bi + 1)).slice(0, -1), ...dp(pts.slice(bi))] : [a, b]; };
    const half = Math.floor(poly.length / 2);
    return [...dp(poly.slice(0, half + 1)).slice(0, -1), ...dp([...poly.slice(half), poly[0]]).slice(0, -1)];
  }
  // konvex vágás (Sutherland–Hodgman): a subject azon része, ami a konvex cp-n belül van (a víz a mezőre vágva)
  function clip(subject, cp){
    const sg = Math.sign(area(cp)), inside = (p, a, b) => sg * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= 0;
    const cut = (p, q, a, b) => { const A1 = q[1] - p[1], B1 = p[0] - q[0], C1 = A1 * p[0] + B1 * p[1], A2 = b[1] - a[1], B2 = a[0] - b[0], C2 = A2 * a[0] + B2 * a[1], d = A1 * B2 - A2 * B1;
      return [(B2 * C1 - B1 * C2) / d, (A1 * C2 - A2 * C1) / d]; };
    let out = subject;
    for(let i = 0; i < cp.length && out.length; i++){ const a = cp[i], b = cp[(i + 1) % cp.length], inp = out; out = [];
      for(let j = 0; j < inp.length; j++){ const p = inp[(j + inp.length - 1) % inp.length], q = inp[j];
        if(inside(q, a, b)){ if(!inside(p, a, b)) out.push(cut(p, q, a, b)); out.push(q); } else if(inside(p, a, b)) out.push(cut(p, q, a, b)); } }
    return out;
  }
  // ellipszis (rot fokkal elforgatva)
  const circ = (cx, cy, r, n = 12, ry = r, rot = 0) => Array.from({ length:n }, (_, i) => { const t = rad(360 * i / n), x = r * Math.cos(t), y = ry * Math.sin(t);
    return [cx + x * cos(rot) - y * sin(rot), cy + x * sin(rot) + y * cos(rot)]; });
  // sima görbe a pontokon át (Catmull–Rom): zárt (smC) és nyitott (smO)
  const crp = (p0, p1, p2, p3, t) => [0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t * t * t));
  const smC = (pts, n = 5, eps = .2) => { const N = pts.length, out = [];
    for(let i = 0; i < N; i++) for(let j = 0; j < n; j++) out.push(crp(pts[(i - 1 + N) % N], pts[i], pts[(i + 1) % N], pts[(i + 2) % N], j / n));
    return simplify(out, eps); };
  const smO = (pts, n = 6) => { const out = [];
    for(let i = 0; i < pts.length - 1; i++) for(let j = 0; j < n; j++) out.push(crp(pts[i - 1] || pts[i], pts[i], pts[i + 1], pts[i + 2] || pts[i + 1], j / n));
    out.push(pts[pts.length - 1]); return out; };
  const taper = (pts, w0, w1, cap = true) => band(pts, t => w0 + (w1 - w0) * t, cap);
  // pontlista eltolása / tükrözése (a motívumok egy részét helyi koordinátában rajzoljuk)
  const mv = (P, dx, dy, k = 1, rot = 0) => P.map(([x, y]) => [dx + k * (x * cos(rot) - y * sin(rot)), dy + k * (x * sin(rot) + y * cos(rot))]);
  const mirX = (P, cx = 50) => P.map(([x, y]) => [2 * cx - x, y]).reverse();

  // ---------------- alakzat-gyártók (a fin() illeszti a vászonra) ----------------
  const pth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, polys }, o);                 // fő lap: kontúr + fehér perem
  const dpth = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, line:false, polys }, o);  // tónus-lap / motívum
  const ink = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, polys }, o);           // motívum kontúrral (perem nélkül)
  const shineP = (pts, o = .7) => ({ t:'poly', m:'paper', tone:'light', d:true, line:false, o, pts });

  // ---------------- beillesztés a vászonra ----------------
  // a megdöntött sziluett befoglalóját a 8–92 tartományba illeszti (egyenletes nagyítás + eltolás; alul tartalék az árnyéknak),
  // az útvonalakat egyirányú körüljárásra hozza (az átfedés ne lyukadjon ki) és ritkítja
  function fin(name, meta){
    const t = rad(meta.tilt || 0), c = Math.cos(t), s = Math.sin(t), shapes = meta.shapes.filter(Boolean);
    const ptsOf = sh => sh.pts || (sh.polys ? sh.polys.filter(p => p && p.length > 2).flat() : []);
    const rot = ([x, y]) => [50 + (x - 50) * c - (y - 50) * s, 50 + (x - 50) * s + (y - 50) * c];
    const Q = shapes.filter(sh => !sh.d && sh.t !== 'line').flatMap(sh => ptsOf(sh).map(rot)), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
    const X0 = 8, X1 = 92, Y0 = 7.5, Y1 = 91;
    const k = min((X1 - X0) / (max(...xs) - min(...xs)), (Y1 - Y0) / (max(...ys) - min(...ys)));
    const qm = [(max(...xs) + min(...xs)) / 2, (max(...ys) + min(...ys)) / 2], tg = [(X0 + X1) / 2, (Y0 + Y1) / 2];
    const d = [k * (50 - qm[0]) + tg[0] - 50, k * (50 - qm[1]) + tg[1] - 50], dI = [d[0] * c + d[1] * s, -d[0] * s + d[1] * c];
    const T = ([x, y]) => [50 + k * (x - 50) + dI[0], 50 + k * (y - 50) + dI[1]];
    const fix = p => { let q = p.map(T); if(q.length > 6) q = simplify(q, .3);
      return orient(q).map(([x, y]) => [r1(x), r1(y)]).filter((v, i, a) => !i || v[0] !== a[i - 1][0] || v[1] !== a[i - 1][1]); };
    const pathOf = polys => polys.filter(p => p && p.length > 2).map(fix).filter(q => q.length > 2).map(q => 'M' + q.map(v => v.join(' ')).join(' ') + 'Z').join('');
    const out = [];
    for(const sh of shapes){
      const o = Object.assign({}, sh);
      if(o.pts && o.t === 'poly'){ o.pts = fix(o.pts); if(o.pts.length < 3) continue; }
      else if(o.polys){ o.p = pathOf(o.polys); delete o.polys; if(!/\S/.test(o.p)) continue; }
      out.push(o);
    }
    ART.add(name, Object.assign({ emoji:[], shadow:'hard' }, meta, { shapes:out }));
  }

  // ---------------- a pecsét: hatszög-keret + mező + perforált szegély + motívum ----------------
  const C = [50, 50], RO = 44, RF = 39.5, RD = 36.8;                               // külső keret · mező · szaggatott szegély sugara
  const hex = (R, cx = C[0], cy = C[1]) => [-90, -30, 30, 90, 150, 210].map(a => [cx + R * cos(a), cy + R * sin(a)]);   // csúcsára állított
  const FIELD = hex(RF);
  // keret-sáv két sugár között, a hatszög i0…i1 csúcsai mentén (csúcs-sorszám: 0 = fent, 1 = jobb-fent, … 5 = bal-fent)
  const rim = (i0, i1, ra, rb) => { const A = hex(ra), B = hex(rb), idx = []; for(let i = i0; i <= i1; i++) idx.push(i % 6);
    return [...idx.map(i => A[i]), ...idx.reverse().map(i => B[i])]; };
  // szaggatott szegély: oldalanként n szaggatás (a csúcsoknál kis sarok-szaggatás)
  const dashes = (R, n, w) => { const H = hex(R), out = [];
    for(let e = 0; e < 6; e++){ const a = H[e], b = H[(e + 1) % 6];
      for(let j = 0; j < n; j++){ const t0 = (j + .28) / n, t1 = (j + .72) / n;
        out.push(band([[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]], w, false)); } }
    return out; };
  // víz a mező alján: hullámos felszín y0 magasságban (amp, hullámhossz), a mezőre vágva
  const sea = (y0, amp = 1.6, wl = 14, ph = 0) => { const top = []; for(let x = 8; x <= 92; x += 2) top.push([x, y0 + amp * Math.sin((x + ph) / wl * 2 * Math.PI)]);
    return clip([...top, [92, 99], [8, 99]], hex(RF - .6)); };
  // föld-sáv a mező alján (szavanna, préri, bambusz-talaj): sima felső él, a mezőre vágva
  const ground = (y0, y1) => clip(smC([[14, y0 + 1.5], [50, y0 - 1], [86, y0 + .5], [86, y1], [14, y1]], 3), hex(RF - .6));
  // hullám-vonal (fodor) a víz felszínén: a vízfelszínnel párhuzamos, rövidebb szakasz
  const crest = (x0, x1, y0, amp = 1.6, wl = 14, ph = 0, w = 1.6) => { const P = []; for(let x = x0; x <= x1; x += 1.5) P.push([x, y0 + amp * Math.sin((x + ph) / wl * 2 * Math.PI)]); return band(P, w, true); };

  function stamp(name, m, tilt, hu, en, look, motif){
    fin(name, { hu, en, look, tilt, shapes:[
      pth(m, 'base', [hex(RO)]),                                                   // keret (a sziluett: fehér perem + árnyék)
      dpth(m, 'light', [rim(4, 6, RO - .9, RO - 3.2)]),                            // világos sáv bal-fent
      dpth(m, 'dark', [rim(1, 3, RO - .9, RO - 3.4)]),                             // sötét sáv jobb-lent
      ink(m, 'light', [FIELD]),                                                    // halvány mező (a „papír”)
      ...motif,
      dpth(m, 'dark', dashes(RD, 5, 1.3)),                                         // perforált belső szegély
      shineP(band([[19.5, 34], [30, 16]], 2), .75),                                // fénycsík a keret bal-felső élén
    ] });
  }

  // =====================================================================
  //  1. Csendes-óceán – tengeri teknős felülnézetben (páncél méhsejt-pajzsokkal, 4 úszóláb) úszik a hullámok fölött · teal
  // =====================================================================
  {
    const m = 'teal', T = P => mv(P, 50, 44, 1, 28);                              // helyi rajz (fej felfelé) → jobbra-fel fordítva
    const shell = T(smC([[0, -15], [9, -12], [13, -2], [11, 9], [5, 15], [0, 17], [-5, 15], [-11, 9], [-13, -2], [-9, -12]]));
    const head = T(circ(0, -20, 5.2, 12, 6.2));
    const fl = [[6, -9], [16, -17], [25, -17], [27, -13], [20, -8], [11, -3]], fr = [[8, 9], [15, 11], [18, 16], [14, 18], [8, 14]];
    const flip = [fl, fl.map(([x, y]) => [-x, y]), fr, fr.map(([x, y]) => [-x, y])].map(p => T(smC(p, 3)));
    const scute = T(hex(5.2, 0, 1)), rays = [[0, -3.5, 0, -13], [4.5, -1.5, 9.5, -7], [-4.5, -1.5, -9.5, -7], [4.5, 3.5, 10, 8], [-4.5, 3.5, -10, 8], [0, 6, 0, 15]]
      .map(([a, b, c2, d]) => band(T([[a, b], [c2, d]]), 1.2, false));
    stamp('bl_pecset_csendes', m, -7, 'Csendes-óceán pecsét (tengeri teknős)', 'Pacific Ocean passport stamp (sea turtle)',
      'hexagonal teal passport stamp with a dashed inner border; a sea turtle seen from above swimming over waves', [
        dpth(m, 'base', [sea(70, 1.5, 16)]), dpth(m, 'dark', [crest(22, 46, 76, 1.2, 12, 3), crest(54, 76, 80, 1.2, 12, 8)]),
        ink(m, 'line', flip), ink(m, 'line', [head]),
        ink(m, 'dark', [shell]), dpth(m, 'base', [scute, ...rays]),
        dpth(m, 'light', [T(smC([[-10, -4], [-8, -11], [-2, -14], [-6, -9]], 2))], { o:.8 }),
        dpth(m, 'light', [T(circ(-2, -21.5, .9, 6)), T(circ(2, -21.5, .9, 6))]),
      ]);
  }

  // =====================================================================
  //  2. Atlanti-óceán – hosszúszárnyú bálna farokúszója kiemelkedik a vízből (fűrészes, bevágott hátsó él, lecsöppenő víz) · kék
  // =====================================================================
  {
    const m = 'blue';
    const R = [[50, 36], [55, 33.5], [58, 34], [62, 31.5], [66, 31.5], [70, 28.5], [74, 27.5], [79, 23.5], [78, 29], [74, 35], [67, 41], [58, 47], [55.5, 55], [56, 68]];
    const L = mirX(R), tail = smC([...R, ...L.slice(0, -1)], 3, .15);
    stamp('bl_pecset_atlanti', m, 6, 'Atlanti-óceán pecsét (bálnafarok)', 'Atlantic Ocean passport stamp (whale tail)',
      'hexagonal blue passport stamp with a dashed inner border; a humpback whale tail fluke rising above the waves with dripping water', [
        ink(m, 'dark', [tail]),
        dpth(m, 'base', [smC([[40, 42], [46, 40.5], [48, 44], [43, 46]], 3), smC([[60, 42], [54, 40.5], [52, 44], [57, 46]], 3)]),   // világos foltok a farok alján
        dpth(m, 'line', [smC([[56, 50], [58.5, 47.5], [56.5, 60], [55.5, 66]], 3)]),                                                  // árnyék a farokszár jobb oldalán
        dpth(m, 'dark', [circ(24, 34, 1.4, 8, 2), circ(76, 36, 1.4, 8, 2), circ(22, 42, 1.1, 8, 1.6), circ(78, 44, 1.1, 8, 1.6)]),   // csöppek
        dpth(m, 'base', [sea(66, 1.6, 15)]), dpth(m, 'light', [smC([[43, 67], [50, 64.5], [57, 67], [50, 69]], 3)]),
        dpth(m, 'dark', [crest(22, 38, 72, 1.1, 10, 0), crest(62, 78, 74, 1.1, 10, 5), crest(36, 64, 80, 1.1, 10, 2)]),
      ]);
  }

  // =====================================================================
  //  3. Indiai-óceán – ördögrája (manta) felülnézetben: széles szárnyak, két fejlebeny, vékony farok, a vállán világos rajzolat · lila
  // =====================================================================
  {
    const m = 'purple';
    const R = [[50, 33], [53.5, 32.5], [56, 25.5], [58.5, 26], [58, 34], [66, 37], [75, 41.5], [82, 47], [74, 50], [64, 55], [55, 61], [50, 63]];
    const body = smC([...R, ...mirX(R).slice(0, -1)], 3, .15);
    stamp('bl_pecset_indiai', m, -5, 'Indiai-óceán pecsét (ördögrája)', 'Indian Ocean passport stamp (manta ray)',
      'hexagonal purple passport stamp with a dashed inner border; a manta ray seen from above gliding with wide wings, head fins and a thin tail, bubbles rising', [
        dpth(m, 'dark', [taper(smO([[50, 60], [51, 70], [54, 79]]), 1.8, .8)]),
        ink(m, 'dark', [body]),
        dpth(m, 'line', [[[81, 47.2], [74, 50], [64, 55], [55, 61], [50, 62.8], [50, 59.5], [54.5, 57.5], [63, 52.3], [72.5, 48.4]]]),   // árnyék a jobb szárny hátsó élén
        dpth(m, 'light', [smC([[45, 37.5], [38, 41.5], [30, 45], [41, 45.5]], 3), smC([[55, 37.5], [62, 41.5], [70, 45], [59, 45.5]], 3)], { o:.75 }),   // világos vállfoltok
        dpth(m, 'base', [circ(71, 26, 2.6, 10), circ(77, 32, 1.7, 8), circ(66, 20, 1.5, 8)]), dpth(m, 'light', [circ(70.2, 25.2, .9, 6)]),
      ]);
  }

  // =====================================================================
  //  4. Déli-óceán és Antarktisz – császárpingvin áll egy jégtáblán (sötét hát, világos has, fülfolt, csőr) · acélszürke
  // =====================================================================
  {
    const m = 'steel';
    const body = smC([[47, 17], [53, 18.5], [56, 25], [57, 33], [61, 44], [63, 56], [60, 66], [52, 70], [42, 69.5], [37, 62], [38, 48], [41, 34], [41, 24]], 4);
    const belly = smC([[53, 29], [57, 38], [60, 50], [59, 61], [53, 67.5], [46, 66], [45, 54], [48, 40], [50, 32]], 4);
    stamp('bl_pecset_deli', m, 7, 'Déli-óceán és Antarktisz pecsét (pingvin)', 'Southern Ocean and Antarctica passport stamp (penguin)',
      'hexagonal steel-grey passport stamp with a dashed inner border; an emperor penguin standing on an ice floe above the sea', [
        dpth(m, 'dark', [sea(76, 1.1, 12)]),
        ink(m, 'base', [[[25, 69], [72, 67], [78, 72], [74, 78], [28, 79.5], [22, 74]]]), dpth(m, 'light', [[[27, 69.8], [71, 68], [74, 71], [25, 72.5]]]),   // jégtábla
        ink(m, 'line', [body]), dpth(m, 'dark', [smC([[40, 44], [43, 52], [42, 62], [38, 60], [38, 50]], 3)]),               // szárny (bal)
        ink(m, 'light', [belly]), dpth(m, 'base', [smC([[45, 56], [53, 67.5], [46, 66]], 2)]),
        dpth(m, 'base', [smC([[53, 23], [56.5, 25], [55, 30], [52, 27]], 3)]),                                               // fülfolt
        ink(m, 'dark', [[[55.5, 21], [64, 24], [55.5, 24.5]]]),                                                              // csőr
        dpth(m, 'light', [circ(50.5, 21.5, 1.1, 6)]),
        dpth(m, 'line', [smC([[44, 69], [49, 68.5], [48, 71], [43, 71]], 2), smC([[51, 69], [56, 68.5], [56, 71], [51, 71]], 2)]),  // lábak
      ]);
  }

  // =====================================================================
  //  5. Jeges-tenger – jegesmedve lépked egy jégtáblán (hosszú nyak, kis fül, lelógó fej) · égkék
  // =====================================================================
  {
    const m = 'sky';
    const bear = smC([[20, 47], [22, 43.5], [27, 41], [29, 38], [32, 37.5], [34, 39], [42, 36.5], [54, 35], [66, 36], [74, 39.5], [77, 46], [76, 53],
      [75, 64], [70, 64.5], [69, 56], [64, 57], [63, 64.5], [58, 64.5], [58, 56], [46, 55], [44, 64.5], [39, 64.5], [38, 56], [36, 64.5], [31, 64.5], [32, 52], [27, 49], [21, 49.5]], 3, .12);
    stamp('bl_pecset_jeges', m, -6, 'Jeges-tenger pecsét (jegesmedve)', 'Arctic Ocean passport stamp (polar bear)',
      'hexagonal sky-blue passport stamp with a dashed inner border; a polar bear walking on an ice floe with the sea below', [
        dpth(m, 'base', [sea(72, 1.2, 12)]), dpth(m, 'dark', [crest(24, 40, 80, 1, 9, 0), crest(58, 76, 81, 1, 9, 4)]),
        ink(m, 'base', [[[22, 64], [80, 63.5], [76, 72], [26, 73]]]), dpth(m, 'light', [[[23.5, 64.6], [78.5, 64.2], [77.6, 66.5], [24.5, 67]]]),   // jégtábla
        ink(m, 'dark', [bear]),
        dpth(m, 'line', [smC([[63, 44], [72, 41], [76, 48], [74, 55], [69, 56], [66, 50]], 3), [[38, 56], [39, 64.5], [36, 64.5]], [[63, 57], [64, 64.5], [63, 64.5]]]),   // árnyék a faron
        dpth(m, 'base', [smC([[36, 40], [48, 37], [58, 37.5], [48, 40]], 2)]),                                                                          // fény a háton
        dpth(m, 'line', [circ(25.5, 43.5, .9, 6), circ(20.8, 46.8, 1.1, 6), circ(30.5, 38.8, 1, 6)]),                                                // szem, orr, fül
      ]);
  }

  // =====================================================================
  //  6. Európa – fehér gólya áll hosszú lábain a réten (fekete evezőtollak, hosszú nyak, hosszú egyenes csőr) · rózsa (blossom)
  // =====================================================================
  {
    const m = 'blossom';
    const beak = [[38.5, 22.5], [19, 34], [37.5, 26.5]];
    const body = smC([[41, 18.5], [45, 20.5], [45.5, 27], [45, 33], [49, 39.5], [59, 40], [69, 42.5], [80, 49.5], [71, 53], [60, 56], [52, 55],
      [45.5, 50], [41, 42], [38.5, 33], [37.5, 26], [37.5, 21.5]], 4);
    const wing = smC([[59, 43.5], [69, 45.5], [80, 49.5], [71, 53], [60, 55], [56.5, 49.5]], 3);
    const legs = [band([[55.5, 54], [55, 66], [54, 77]], 2.1, true), band([[61, 54], [63.5, 65], [62, 77]], 2.1, true),
      band([[50, 77.5], [57.5, 77.5]], 1.6, true), band([[58, 77.5], [66, 77.5]], 1.6, true)];
    stamp('bl_pecset_europa', m, 8, 'Európa pecsét (gólya)', 'Europe passport stamp (white stork)',
      'hexagonal pink passport stamp with a dashed inner border; a white stork standing on its long legs in a meadow, black wing feathers, long neck and long straight beak', [
        dpth(m, 'base', [ground(76, 83)]),
        dpth(m, 'dark', [band([[70, 75], [72, 69]], 1.4, true), band([[73, 75.5], [77, 70.5]], 1.4, true), band([[33, 75.5], [31, 69.5]], 1.4, true), band([[36, 75], [37, 70]], 1.4, true)]),   // fűszálak
        ink(m, 'line', legs), ink(m, 'dark', [body]), ink(m, 'line', [wing, beak]),
        dpth(m, 'light', [taper(smO([[42.8, 41], [40.6, 34], [39.8, 27]]), 2, 1.3), smC([[48.5, 43.5], [55, 42], [62, 43], [52, 45]], 2)], { o:.8 }),
        dpth(m, 'light', [circ(41.2, 22.4, .95, 6)]),
      ]);
  }

  // =====================================================================
  //  7. Ázsia – vörös macskamedve (kis panda) egy bambuszszáron: kerek fül, világos pofa, fekete láb, GYŰRŰS bozontos farok · narancs
  // =====================================================================
  {
    const m = 'orange';
    const body = smC([[36, 44], [46, 41], [58, 42], [66, 46], [66, 55], [60, 58], [46, 58], [38, 55]], 4);
    const head = smC([[24, 45], [26, 38], [31, 35], [37, 36], [41, 41], [40, 49], [34, 53], [28, 52.5], [22, 50]], 4);
    const ears = [smC([[24.6, 39.5], [23.8, 33.5], [27.5, 31.2], [31, 35]], 3), smC([[34.5, 35.5], [37, 31], [41, 32.5], [40.8, 38.5]], 3)];
    const tail = taper(smO([[64, 50], [72, 46], [76, 38], [75, 27], [70, 21]]), 10, 7);
    const legs = [[39, 54], [45, 55], [57, 55], [63, 54]].map(([x, y]) => band([[x, y], [x - 1, 65.5]], 4.6, true));
    const rings = [[70, 47.5], [75.5, 38.5], [74, 29]].map(([x, y], i) => band([[x - 5 + i * 1.5, y - 1 - i * 2], [x + 5 - i * .5, y + 2 - i * .5]], 2.6, true));
    stamp('bl_pecset_azsia', m, -8, 'Ázsia pecsét (vörös macskamedve)', 'Asia passport stamp (red panda)',
      'hexagonal orange passport stamp with a dashed inner border; a red panda with a pale face, round ears, dark legs and a ringed bushy tail walking along a bamboo stalk with leaves', [
        ink(m, 'base', [band([[20, 68], [80, 66]], 4.2, true)]), dpth(m, 'line', [band([[40, 64.8], [40, 69.2]], 1, false), band([[64, 64.2], [64, 68.6]], 1, false)]),   // bambuszszár ízekkel
        ink(m, 'base', [pathLeaf(22, 67, 205, 16, 5.5), pathLeaf(77, 66, -30, 15, 5)]),
        ink(m, 'dark', [tail]), dpth(m, 'line', rings),
        dpth(m, 'line', legs), ink(m, 'dark', [body, head, ...ears]),
        dpth(m, 'light', [smC([[23, 48], [27, 45.5], [31, 48.5], [29, 52], [24.5, 51.5]], 3), circ(34.5, 40.5, 2, 8, 1.4, -20), circ(27.5, 40, 1.7, 8, 1.3, 20)]),
        dpth(m, 'light', [smC([[26, 37], [25.8, 34], [27.8, 33.2], [29.3, 35.3]], 2), smC([[36.3, 35.5], [37.6, 33.3], [39.6, 34], [39.4, 37]], 2)]),     // fül belseje
        dpth(m, 'line', [circ(31.5, 44, 1.1, 6), circ(22.8, 48.5, 1.1, 6)]),
      ]);
  }
  // levél-sokszög (bambuszlevél): tő (x, y), irány (fok), hossz, szélesség
  function pathLeaf(x, y, deg, len, wid){ const P = []; for(let i = 0; i <= 8; i++){ const u = i / 8; P.push([u, wid / len * Math.sin(Math.PI * Math.pow(u, .8)) * .9]); }
    const half = s => P.map(([u, v]) => [x + (u * cos(deg) - s * v * sin(deg)) * len, y + (u * sin(deg) + s * v * cos(deg)) * len]);
    return [...half(1), ...half(-1).reverse().slice(1, -1)]; }

  // =====================================================================
  //  8. Afrika – afrikai elefánt oldalnézetben: nagy fül, lelógó ormány, agyar, oszloplábak · méz
  // =====================================================================
  {
    const m = 'honey';
    const body = smC([[36, 38], [48, 33.5], [62, 34], [72, 38], [76, 46], [75, 55], [74, 68], [68, 68], [67, 60], [62, 59], [61, 68], [55, 68],
      [54, 58], [46, 58], [45, 68], [39, 68], [38, 57], [35, 52]], 3, .12);
    const head = smC([[27, 40], [31, 33], [38, 32], [43, 38], [42, 48], [36, 52], [30, 51]], 4);
    const trunk = taper(smO([[30, 47], [26, 54], [24.5, 62], [25.5, 69], [29.5, 72]]), 7, 3.4);
    const ear = smC([[39, 33], [48, 32], [53, 38], [52, 48], [47, 56], [42, 53], [40, 45]], 4);
    stamp('bl_pecset_afrika', m, 7, 'Afrika pecsét (elefánt)', 'Africa passport stamp (African elephant)',
      'hexagonal honey-yellow passport stamp with a dashed inner border; an African elephant in side view with big ears, curled trunk and a tusk on the savanna', [
        dpth(m, 'base', [ground(68.5, 74.5)]),                                  // szavanna-föld
        dpth(m, 'line', [band([[46.5, 58], [46, 67.5]], 5, false), band([[66.5, 59], [67.5, 67.5]], 5, false)]),             // túlsó lábak
        ink(m, 'dark', [body, head]), dpth(m, 'dark', [trunk]),
        dpth(m, 'line', [band([[74, 44], [79, 52], [78.5, 58]], 1.3, true), smC([[72, 38.5], [76, 46], [75, 55], [72, 52], [70, 44]], 3)]),   // farok, árnyék
        ink(m, 'base', [ear]), dpth(m, 'dark', [smC([[44, 36], [49, 36], [50.5, 44], [46, 50], [43, 45]], 3)]),
        ink(m, 'light', [taper(smO([[31, 50], [27.5, 55], [22, 56.5]]), 3, 1.4)]),                                         // agyar
        dpth(m, 'line', [circ(34, 40, 1.1, 6)]),
      ]);
  }

  // =====================================================================
  //  9. Észak-Amerika – bölény oldalnézetben: magas púp, sötét bozontos eleje, lehajtott fej kis szarvval és szakállal · fa
  // =====================================================================
  {
    const m = 'wood';
    const rear = smC([[44, 40], [58, 38.5], [70, 40], [77, 46], [76, 55], [75, 67], [70, 67], [69, 58], [64, 58], [63, 67], [58, 67], [57, 57], [46, 57]], 3, .12);
    const front = smC([[24, 50], [27, 40], [34, 30], [43, 28.5], [51, 33], [54, 43], [52, 54], [46, 58], [45, 67], [40, 67], [39, 60], [36, 60], [35, 67], [30, 67], [30, 60], [26, 62], [21, 60]], 3, .12);
    stamp('bl_pecset_eszak_amerika', m, -7, 'Észak-Amerika pecsét (bölény)', 'North America passport stamp (bison)',
      'hexagonal wood-brown passport stamp with a dashed inner border; an American bison in side view with a high shoulder hump, shaggy dark front, lowered head with small horns and a beard, on the prairie', [
        dpth(m, 'base', [ground(67.5, 74)]),                                  // préri
        ink(m, 'dark', [rear]), dpth(m, 'line', [smC([[68, 41], [76, 46], [75, 56], [71, 53]], 3), band([[76, 46], [80, 52], [79.5, 58]], 1.3, true)]),
        ink(m, 'line', [front]),
        dpth(m, 'dark', [smC([[33, 34], [42, 31], [48, 35], [40, 36]], 3)]),                                                  // fény a púpon
        ink(m, 'light', [taper(smO([[27, 43], [24, 40], [25, 35.5]]), 2.6, 1.2), taper(smO([[31, 41], [32, 37], [35.5, 35]]), 2.4, 1.1)]),   // szarvak
        dpth(m, 'dark', [circ(28, 47, 1.2, 6)]),
      ]);
  }

  // =====================================================================
  //  10. Dél-Amerika – tukán ágon ülve: hatalmas, ívelt csőr sötét heggyel, fekete test, világos torokfolt, szemgyűrű · levélzöld
  // =====================================================================
  {
    const m = 'leaf';
    const body = smC([[40, 33], [48, 30], [55, 36], [56, 48], [52, 60], [45, 66], [38, 63], [35, 52], [35, 41]], 4);
    const beak = smC([[52, 30], [62, 27.5], [73, 29.5], [81, 35], [75, 37.5], [64, 38], [54, 38]], 4, .15);
    stamp('bl_pecset_del_amerika', m, 6, 'Dél-Amerika pecsét (tukán)', 'South America passport stamp (toucan)',
      'hexagonal leaf-green passport stamp with a dashed inner border; a toucan perched on a branch with a huge curved beak with a dark tip, dark body and pale throat bib, a jungle leaf beside', [
        ink(m, 'base', [pathLeaf(62, 67, -48, 20, 6.5)]),
        ink(m, 'dark', [band([[18, 70], [50, 67], [80, 69]], 3.8, true)]),                                                 // ág
        ink(m, 'line', [body, taper(smO([[40, 61], [37, 70], [35, 79]]), 7, 5)]),                                          // test + farok
        ink(m, 'light', [smC([[46, 34], [53, 36], [55, 42], [51, 46], [46, 43]], 3)]),                                    // torokfolt
        ink(m, 'base', [beak]), dpth(m, 'line', [smC([[75.5, 31.5], [81, 35], [75, 37.5], [73.5, 35]], 3)]),             // csőr + sötét hegye
        dpth(m, 'dark', [taper(smO([[54, 32.5], [63, 30.5], [72, 31.5]]), 2.2, 1)]),                                      // csőrgerinc
        dpth(m, 'light', [circ(48.5, 34.5, 2.6, 10)]), dpth(m, 'line', [circ(48.8, 34.5, 1.2, 6)]),                        // szemgyűrű + szem
        dpth(m, 'dark', [band([[44, 64], [45, 68.5]], 1.8, true), band([[48, 63], [49.5, 68]], 1.8, true)]),               // lábak
      ]);
  }

  // =====================================================================
  //  11. Óceánia – kenguru áll a hátsó lábán, vastag farkára támaszkodva (hosszú fül, kis mellső mancs) · piros
  // =====================================================================
  {
    const m = 'red';
    const body = smC([[73, 25.5], [70, 28.5], [65.5, 30.5], [63.5, 35], [64, 42], [62.5, 50], [60.5, 58], [62, 64], [68, 67.5], [76, 69.5], [76, 72.8],
      [55, 73.5], [47, 71], [41, 66], [38.5, 57], [40.5, 46], [46, 36.5], [53.5, 29.5], [58, 24], [61.5, 20.5], [66.5, 20.5], [71, 23]], 4, .15);
    const ears = [smC([[59, 22.5], [56, 14], [56.5, 10.5], [61.5, 20]], 2), smC([[62.5, 20.5], [63, 12], [64.5, 9.5], [65.5, 20.5]], 2)];
    const tail = taper(smO([[44, 67], [34, 71], [24, 73.5], [16, 74]]), 8, 2.2);
    stamp('bl_pecset_oceania', m, -6, 'Óceánia pecsét (kenguru)', 'Oceania passport stamp (kangaroo)',
      'hexagonal red passport stamp with a dashed inner border; a kangaroo standing upright on its big hind legs, leaning on its thick tail, long ears and small front paws, on the red outback ground', [
        dpth(m, 'base', [ground(72, 78)]),                                   // föld
        ink(m, 'line', [tail, body, ...ears]),
        dpth(m, 'dark', [smC([[46, 56], [52, 52], [57, 58], [55, 66], [48, 66]], 3)]),   // comb
        dpth(m, 'dark', [smC([[44.5, 42], [50, 35], [56, 30], [49.5, 40], [42.5, 52]], 3), smC([[57.5, 14], [57.2, 11.5], [60, 19]], 2)]),   // fény: hát, fül
        ink(m, 'line', [band([[63.5, 41], [69, 45], [70.5, 49]], 2.6, true)]),                                             // mellső mancs
        dpth(m, 'light', [circ(66, 24, 1, 6)]),
      ]);
  }
})();
