// ============================================================
//  Matricák — „A mi bolygónk” „Egy nap 2050-ben” KÉPESLAPJAI, B szinten (docs/rajzolas.md, docs/bolygo-jatekterv.md)
//  8 képeslap, témakörönként egy derűs, zöld jövőbeli jelenet Méhesden (magyar kisváros): közlekedés, étkezés,
//  gazdaság, vásárlás, otthon, hulladék, etika, digitális lábnyom. A játék névvel kéri: artIcon('bl2050_<témakör>').
//  Felépítés (mind a 8 ugyanígy): fekvő, 4:3-as, lekerekített KÉPESLAP (120 × 90 egységes helyi rács, y lefelé) –
//  a lap maga az ég (ez a sziluett: fehér perem + tömör olíva árnyék), rajta nap, felhők, dombok, talaj, és a jelenet.
//  Hogy a jelenet 10–20 alakzatban maradjon, egy alakzat = EGY anyag + EGY tónus, akárhány darabban (egy útvonal több
//  al-útvonallal): pl. minden fal eleje egy alakzat, minden fal oldala egy másik. A házak 3/4-es ferde vetületben
//  (a mélység jobbra-fel tolódik): teteje/bal tetősík világos · eleje alap · oldala sötét · élsáv, kontúr legsötétebb.
//  Minden jelenet-darab a lap belsejére van vágva (clip), így semmi nem lóg ki a képeslapról.
//  A rajz nem ítélkezik és nincs rajta szöveg, betű, szám, márka, logó; a beeco méhecskét nem rajzoljuk újra
//  (csak egy-egy apró, általános méh díszítésként). A segédek (simítás, vágás, fin() illesztés) az art-bolygo.js
//  készletének másolatai, így a fájl önálló.
//  Render: node tools/art-render.js 2d web/js/art/art-bolygo-2050.js ki.png --skip bolygo-2050
// ============================================================
(function(){
  const { rad, band, arc } = ART.geo;
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
  // konvex vágás (Sutherland–Hodgman): a subject azon része, ami a konvex cp-n belül van (a jelenet a képeslapra vágva)
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
  const smC = (pts, n = 4, eps = .2) => { const N = pts.length, out = [];
    for(let i = 0; i < N; i++) for(let j = 0; j < n; j++) out.push(crp(pts[(i - 1 + N) % N], pts[i], pts[(i + 1) % N], pts[(i + 2) % N], j / n));
    return simplify(out, eps); };
  const smO = (pts, n = 5) => { const out = [];
    for(let i = 0; i < pts.length - 1; i++) for(let j = 0; j < n; j++) out.push(crp(pts[i - 1] || pts[i], pts[i], pts[i + 1], pts[i + 2] || pts[i + 1], j / n));
    out.push(pts[pts.length - 1]); return out; };
  const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  // lekerekített téglalap (konvex – a képeslap és a vágó-keret)
  const rr = (x, y, w, h, r, n = 4) => [...arc(x + r, y + r, r, 180, 270, n), ...arc(x + w - r, y + r, r, 270, 360, n),
    ...arc(x + w - r, y + h - r, r, 0, 90, n), ...arc(x + r, y + h - r, r, 90, 180, n)];
  const ring = (cx, cy, r, w, n = 14) => { const P = circ(cx, cy, r, n); return band([...P, P[0], P[1]], w, false); };   // kerék, abroncs
  const mv = (P, dx, dy, k = 1) => P.map(([x, y]) => [dx + k * x, dy + k * y]);

  // ---------------- a képeslap ----------------
  const W = 120, H = 90, CARD = rr(0, 0, W, H, 6, 4), IN = rr(.5, .5, W - 1, H - 1, 5.5, 4);
  const K = polys => polys.filter(p => p && p.length > 2).map(p => clip(p, IN)).filter(p => p.length > 2);
  const card = () => ({ t:'path', m:'cream', tone:'light', polys:[CARD] });                                     // a lap (sziluett, meleg barna kontúr)
  const ink = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, polys:K(polys) }, o);           // kontúrral
  const dp = (m, tone, polys, o) => Object.assign({ t:'path', m, tone, d:true, line:false, polys:K(polys) }, o); // kontúr nélkül
  const shineCard = () => ({ t:'poly', m:'paper', tone:'light', d:true, line:false, o:.55, pts:band([[4.5, 20], [15, 4.5]], 2.6) });   // fényes lap-sarok

  // ---------------- beillesztés a vászonra ----------------
  // a megdöntött képeslap befoglalóját a 8–92 tartományba illeszti (alul tartalék az árnyéknak), a darabokat egyirányú
  // körüljárásra hozza (az átfedés ne lyukadjon ki), ritkítja és 1 tizedesre kerekíti
  function fin(name, meta){
    const t = rad(meta.tilt || 0), c = Math.cos(t), s = Math.sin(t), shapes = meta.shapes.filter(Boolean);
    const ptsOf = sh => sh.pts || (sh.polys ? sh.polys.filter(p => p && p.length > 2).flat() : []);
    const rot = ([x, y]) => [50 + (x - 50) * c - (y - 50) * s, 50 + (x - 50) * s + (y - 50) * c];
    const Q = shapes.filter(sh => !sh.d).flatMap(sh => ptsOf(sh).map(rot)), xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
    const X0 = 8, X1 = 92, Y0 = 7.5, Y1 = 91;
    const k = min((X1 - X0) / (max(...xs) - min(...xs)), (Y1 - Y0) / (max(...ys) - min(...ys)));
    const qm = [(max(...xs) + min(...xs)) / 2, (max(...ys) + min(...ys)) / 2], tg = [(X0 + X1) / 2, (Y0 + Y1) / 2];
    const d = [k * (50 - qm[0]) + tg[0] - 50, k * (50 - qm[1]) + tg[1] - 50], dI = [d[0] * c + d[1] * s, -d[0] * s + d[1] * c];
    const T = ([x, y]) => [50 + k * (x - 50) + dI[0], 50 + k * (y - 50) + dI[1]];
    const fix = p => { let q = p.map(T); if(q.length > 6) q = simplify(q, .22);
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
  // kültéri lapon az első réteg az ég (sky), beltérin a krém lap maga a fal
  const postcard = (name, hu, en, look, shapes) => fin('bl2050_' + name, { hu, en, look, tilt:-3, shapes:[card(), ...shapes, shineCard()] });
  const skyL = () => dp('sky', 'light', [rect(-2, -2, 124, 94)]);

  // ---------------- táj-darabok ----------------
  const cloud = (x, y, s) => smC(mv([[-10, 0], [-9, -3], [-6, -4.5], [-3.5, -4], [-1, -7], [3, -7], [5, -4], [8, -4.2], [10, -1.5], [9, 0]], x, y, s), 3);
  const sun = (x = 103, y = 15, r = 7) => dp('honey', 'base', [circ(x, y, r, 16)]);
  // dombvonal y körül, alatta minden (a talaj majd rárajzol)
  const hills = (y, amp = 3, ph = 0) => [[...smO([[-4, y + amp], [22, y - amp + ph], [48, y + amp * .6], [74, y - amp], [98, y + amp * .4 - ph], [126, y - amp * .6]], 4), [126, 96], [-4, 96]]];
  const ground = (y, amp = .8) => [[...smO([[-4, y], [40, y - amp], [80, y + amp], [126, y - amp * .5]], 4), [126, 96], [-4, 96]]];

  // ---------------- épületek (3/4-es ferde vetület: a mélység jobbra-fel tolódik) ----------------
  const DX = .6, DY = -.4;
  // oromfalas ház (az orom az utca felé – a magyar kisvárosi ház): eleje, oldala, bal (világos) és jobb (alap) tetősík
  function gHouse(x, yB, w, h, d, rh, ov = 1.2){
    const Dx = DX * d, Dy = DY * d, A = [x + w / 2, yB - h - rh], e = yB - h + .9;
    return {
      front:[[x, yB], [x + w, yB], [x + w, yB - h], A, [x, yB - h]],
      side:[[x + w, yB], [x + w + Dx, yB + Dy], [x + w + Dx, yB - h + Dy], [x + w, yB - h]],
      roofL:[A, [x - ov, e], [x - ov + Dx, e + Dy], [A[0] + Dx, A[1] + Dy]],
      roofR:[A, [A[0] + Dx, A[1] + Dy], [x + w + ov + Dx, e + Dy], [x + w + ov, e]],
      // a jobb tetősík négy sarka (napelemhez): orom, orom hátul, eresz hátul, eresz elöl
      rq:[A, [A[0] + Dx, A[1] + Dy], [x + w + ov + Dx, e + Dy], [x + w + ov, e]],
    };
  }
  // lapostetős doboz: eleje, oldala, teteje
  function box(x, yB, w, h, d){
    const Dx = DX * d, Dy = DY * d;
    return { front:rect(x, yB - h, w, h), side:[[x + w, yB], [x + w + Dx, yB + Dy], [x + w + Dx, yB - h + Dy], [x + w, yB - h]],
      top:[[x, yB - h], [x + w, yB - h], [x + w + Dx, yB - h + Dy], [x + Dx, yB - h + Dy]] };
  }
  // négyszög belső része (bilineáris): u0..u1 az első éltől, v0..v1 a második éltől – napelem a tetősíkon
  const quadIn = (q, u0, u1, v0, v1) => { const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const at = (u, v) => L(L(q[0], q[1], u), L(q[3], q[2], u), v); return [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]; };
  // napelem-sor a tetősíkon (n tábla), és a tábla-osztó vonalak (világos)
  function solar(q, n, u0 = .15, u1 = .85, v0 = .18, v1 = .82){
    const panels = [], lines = [];
    for(let i = 0; i < n; i++){ const a = v0 + (v1 - v0) * i / n, b = v0 + (v1 - v0) * (i + 1) / n - .03; panels.push(quadIn(q, u0, u1, a, b));
      const m = quadIn(q, (u0 + u1) / 2 - .015, (u0 + u1) / 2 + .015, a, b); lines.push(m); }
    return { panels, lines };
  }

  // ---------------- élőlények ----------------
  function tree(x, yB, h, r){
    const cy = yB - h;
    return { crown:smC([[x - r, cy + .2 * r], [x - .8 * r, cy - .55 * r], [x - .2 * r, cy - r], [x + .5 * r, cy - .85 * r], [x + r, cy - .15 * r], [x + .75 * r, cy + .6 * r], [x, cy + .8 * r], [x - .7 * r, cy + .7 * r]], 3),
      hi:smC([[x - .75 * r, cy - .1 * r], [x - .55 * r, cy - .6 * r], [x - .1 * r, cy - .8 * r], [x - .25 * r, cy - .35 * r]], 3),
      trunk:band([[x, yB], [x, cy + .72 * r]], max(1.2, .26 * r), false) };
  }
  // ember: s = magasság. o.sit – ülő (csak a felsőtest, asztal mögött) · o.arm – 'up' (int) · o.kid · o.dress
  function person(x, yB, s, o = {}){
    const hr = .13 * s, hy = yB - s + hr, sh = yB - .78 * s, hip = yB - .42 * s, w = .17 * s;
    const torso = o.dress ? smC([[x - w, sh], [x + w, sh], [x + 1.35 * w, yB - .2 * s], [x - 1.35 * w, yB - .2 * s]], 2)
      : smC([[x - w, sh], [x + w, sh], [x + 1.05 * w, hip], [x - 1.05 * w, hip]], 2);
    const armR = o.arm === 'up' ? band([[x + .8 * w, sh + .05 * s], [x + 1.5 * w, sh - .22 * s]], .09 * s) : band([[x + .9 * w, sh + .05 * s], [x + 1.25 * w, hip]], .09 * s);
    const armL = band([[x - .9 * w, sh + .05 * s], [x - 1.25 * w, hip]], .09 * s);
    const legs = o.sit ? [] : [band([[x - .45 * w, hip - .02 * s], [x - .5 * w, yB]], .12 * s, false), band([[x + .45 * w, hip - .02 * s], [x + .5 * w, yB]], .12 * s, false)];
    const hair = o.bald ? [] : [[...arc(x, hy, hr * 1.08, 180, 360, 6), [x + hr * 1.08, hy + .25 * hr], [x - hr * 1.08, hy + .25 * hr]]];
    return { head:circ(x, hy, hr, 10), body:[torso, armL, armR], legs, hair };
  }
  // kerékpár (két abroncs + váz) – a kerékpáros a person()-ból, előre dőlve
  function bike(x, yB, s){
    const r = .3 * s, b = [x - .52 * s, yB - r], f = [x + .52 * s, yB - r], seat = [x - .18 * s, yB - .9 * s], cr = [x - .05 * s, yB - r], hb = [x + .38 * s, yB - 1.02 * s];
    return { wheels:[ring(b[0], b[1], r, .07 * s), ring(f[0], f[1], r, .07 * s)],
      frame:[band([b, seat, cr, b], .06 * s, false), band([seat, [x + .34 * s, yB - .85 * s], f], .06 * s, false), band([cr, [x + .34 * s, yB - .85 * s]], .06 * s, false), band([hb, [x + .34 * s, yB - .85 * s]], .06 * s, false)],
      seat, hb };
  }
  // apró méh díszítésnek (nem a beeco méhecske): test, csík, szárnyak
  const bee = (x, y, s = 1) => ({ body:circ(x, y, 1.9 * s, 10, 1.3 * s), stripe:band([[x - .2 * s, y - 1.2 * s], [x - .2 * s, y + 1.2 * s]], .6 * s, false),
    wings:[circ(x - .7 * s, y - 1.9 * s, 1.1 * s, 8, .75 * s, -30), circ(x + .6 * s, y - 2 * s, 1.1 * s, 8, .75 * s, 30)] });
  const flower = (x, y, r = 1.3) => circ(x, y, r, 8);
  // kerékpáros a bike() nyergén: előre dőlő törzs, kar a kormányhoz, láb a hajtókarhoz
  function rider(b, s){
    const hip = [b.seat[0], b.seat[1] - .02 * s], shd = [hip[0] + .22 * s, hip[1] - .5 * s], hr = .11 * s, hc = [shd[0] + .1 * s, shd[1] - .17 * s];
    return { body:[band([hip, shd], .26 * s), band([[shd[0], shd[1] + .04 * s], b.hb], .09 * s)], head:circ(hc[0], hc[1], hr, 10),
      hair:[[...arc(hc[0], hc[1], hr * 1.08, 180, 360, 6), [hc[0] + hr * 1.08, hc[1] + .2 * hr], [hc[0] - hr * 1.08, hc[1] + .2 * hr]]],
      legs:[band([hip, [hip[0] + .3 * s, hip[1] + .12 * s], [hip[0] + .14 * s, hip[1] + .55 * s]], .1 * s, false)] };
  }
  // ülő ember (padon, asztal mögött): a csípő a seatY magasságban; lába lefelé a talajig (o.foot), ha kell
  function seated(x, seatY, s, o = {}){
    const p = person(x, seatY + .42 * s, s, Object.assign({ sit:true }, o)), w = .17 * s;
    if(o.foot) p.legs = [band([[x - .45 * w, seatY], [x - .5 * w, o.foot]], .12 * s, false), band([[x + .45 * w, seatY], [x + .5 * w, o.foot]], .12 * s, false)];
    return p;
  }
  const all = (list, k) => list.flatMap(p => p[k] || []);

  const heads = list => list.map(p => p.head);

  // =====================================================================
  //  1. KÖZLEKEDÉS – fás utca: villamos érkezik, zöld biciklisáv kerékpárossal, gyalogosok a járdán; autó nincs
  // =====================================================================
  {
    const hs = [gHouse(2, 58, 20, 13, 12, 9), gHouse(33, 58, 17, 15, 11, 8)];
    const tr = [tree(29, 64, 17, 7), tree(59, 64, 16, 6.5)];
    const mom = person(9, 65, 21, { dress:true }), kid = person(17, 65, 14);
    const bk = bike(36, 87, 15), rd = rider(bk, 19);
    const tram = [[71, 47], [126, 47], [126, 76], [67, 76], [65.5, 71], [65.5, 55], [67, 49.5]];
    postcard('kozlekedes', 'Egy nap 2050-ben: közlekedés (fás utca villamossal és biciklisávval)', 'A day in 2050: transport (tree-lined street with a tram and a bike lane)',
      'landscape postcard: sunny tree-lined small-town street, a yellow tram arriving, a green bike lane with a cyclist, a mother and child walking on the pavement, gable houses with red roofs, no cars', [
        skyL(), sun(),
        dp('sage', 'base', hills(46)),
        dp('sage', 'light', ground(57, .3)),                                                     // járda
        dp('tomato', 'light', hs.map(h => h.roofL)), dp('cream', 'dark', hs.map(h => h.side)),
        ink('cream', 'base', hs.map(h => h.front)), ink('tomato', 'base', hs.map(h => h.roofR)),
        dp('steel', 'base', [rect(-2, 65, 124, 15)]),                                            // úttest
        ink('leaf', 'base', tr.map(t => t.crown)),
        dp('leaf', 'light', [...tr.map(t => t.hi), rect(-2, 80, 124, 6)]),                        // lomb-fény + zöld biciklisáv
        dp('paper', 'light', [cloud(22, 15, 1.1), cloud(62, 11, .8), ...[4, 48, 92].map(x => band([[x, 80.6], [x + 9, 80.6]], 1, false))]),   // felhők, sáv-jelek
        ink('honey', 'base', [tram]),
        dp('glass', 'base', [rect(5, 47, 5, 6), rect(14, 47, 5, 6), rect(36, 46, 4.5, 6), rect(43, 46, 4.5, 6),
          smC([[67.6, 53], [71, 51], [71, 62], [67.3, 62]], 2), rect(74, 51, 11, 10), rect(88, 51, 11, 10), rect(102, 51, 6, 19), rect(111, 51, 11, 10)]),
        dp('leaf', 'dark', [...rd.body, ...kid.body]),
        dp('berry', 'base', mom.body),
        dp('skin', 'base', [rd.head, kid.head, mom.head]),
        dp('dark', 'base', [...tr.map(t => t.trunk), ...kid.legs, ...mom.legs, ...rd.legs, ...bk.wheels, ...bk.frame, ...rd.hair, ...kid.hair, ...mom.hair,
          [[65.7, 72], [126, 72], [126, 76], [67, 76]], band([[-2, 77.5], [124, 77.5]], .8, false),       // alváz, sín
          band([[98, 47], [91, 38], [98, 28.5]], .9, false), band([[-2, 28], [124, 28]], .7, false)]),    // áramszedő, felsővezeték
      ]);
  }

  // =====================================================================
  //  2. ÉTKEZÉS – közösségi kert (magaságyások paradicsommal) és piaci stand, a család egy hosszú közös asztalnál
  // =====================================================================
  {
    const beds = [box(74, 64, 19, 5, 9), box(97, 64, 19, 5, 9)];
    const tr = tree(111, 50, 18, 8);
    const ppl = [seated(19, 70, 26, { dress:true }), seated(35, 70, 29), seated(49, 70, 19), seated(62, 70, 26, { dress:true })];
    const awn = [[4, 36], [42, 36], [46, 43], [0, 43]];
    const stripes = [0, 1, 2, 3, 4].map(i => [[4 + 8 * i, 36], [8 + 8 * i, 36], [4.6 + 9.2 * (i + 1) - 4.6, 43], [9.2 * i, 43]]);
    const bush = (x, y, r) => smC([[x - r, y], [x - .7 * r, y - .8 * r], [x, y - r], [x + .7 * r, y - .8 * r], [x + r, y]], 3);
    postcard('etkezes', 'Egy nap 2050-ben: étkezés (közösségi kert, piac, közös asztal)', 'A day in 2050: food (community garden, market stall and a shared family table)',
      'landscape postcard: sunny community garden with raised beds of tomatoes and greens, a market stall with a striped awning and fresh produce, a family eating together at a long wooden table', [
        skyL(), sun(),
        dp('sage', 'base', hills(44)),
        dp('grass', 'base', ground(52)),
        ink('honey', 'base', [awn]),
        ink('wood', 'base', [rect(6, 52, 34, 9), ...beds.flatMap(b => [b.front, b.side]), rect(6, 72, 72, 3), rect(8, 75, 3, 12), rect(73, 75, 3, 12)]),   // stand, ágyások, asztal éle és lába
        dp('soil', 'base', beds.map(b => b.top)),
        ink('leaf', 'base', [tr.crown, bush(78, 59, 4), bush(86, 59, 4), bush(101, 59, 3.5), bush(108, 59, 3.5), bush(114, 59, 3),
          circ(12, 51, 3, 10), circ(19, 51, 3, 10)]),                                                           // káposzták a standon
        dp('blue', 'base', [...ppl[1].body, ...ppl[3].body]), dp('orange', 'base', [...ppl[0].body, ...ppl[2].body]),
        dp('skin', 'base', heads(ppl)),
        ink('wood', 'light', [[[6, 72], [78, 72], [83, 67.5], [11, 67.5]]]),                                  // asztallap
        dp('leaf', 'light', [tr.hi, bush(77, 57.5, 2), bush(100.5, 57.5, 1.8), bush(107.5, 57.5, 1.8), circ(11.2, 50.2, 1.4, 8), circ(18.2, 50.2, 1.4, 8),
          smC([[25.5, 68.5], [27, 66], [30, 65.5], [32, 67], [31.5, 68.5]], 2)]),                               // saláta a tálban
        dp('tomato', 'base', [circ(77, 56.5, 1.2, 8), circ(81, 58, 1.2, 8), circ(86.5, 56.5, 1.2, 8), circ(89, 58.5, 1.2, 8),
          circ(25, 50.5, 2.2, 10), circ(29.5, 50.5, 2.2, 10), circ(34, 50.5, 2.2, 10), circ(42, 70, 1.5, 8), circ(45, 69.5, 1.5, 8), circ(47.8, 70.1, 1.5, 8)]),
        dp('paper', 'light', [cloud(58, 14, 1), ...stripes,
          [[24.5, 68.2], [33, 68.2], [31.5, 70.8], [26, 70.8]], circ(57, 69.8, 3, 10, 1.1), circ(14, 69.8, 3, 10, 1.1), circ(69, 69.8, 3, 10, 1.1)]),   // tál, tányérok
        dp('dark', 'base', [tr.trunk, band([[6.5, 52], [6.5, 43]], 1.2, false), band([[39.5, 52], [39.5, 43]], 1.2, false), ...all(ppl, 'hair')]),
      ]);
  }

  // =====================================================================
  //  3. GAZDASÁG – javítóműhely napelemes tetővel a főtéren: szerelő kerékpárt javít, vevő hozza a lámpáját, a szomszéd pékség
  // =====================================================================
  {
    const ws = gHouse(8, 66, 44, 22, 16, 13), sh = gHouse(74, 62, 24, 17, 12, 10);
    const pv = solar(ws.rq, 2, .12, .9, .14, .86);
    const tr = tree(111, 70, 22, 9);
    const mech = person(54, 85, 23), cust = person(70, 84, 21, { dress:true }), inWin = seated(40, 60, 11);
    const bk = bike(37, 84, 15);
    postcard('gazdasag', 'Egy nap 2050-ben: gazdaság (napelemes javítóműhely, helyi munkahelyek)', 'A day in 2050: economy (a solar-roofed repair workshop and local jobs)',
      'landscape postcard: sunny small-town square with a repair workshop that has solar panels on its roof, a mechanic fixing a bicycle, a customer arriving, a neighbouring bakery and a tree', [
        skyL(),
        dp('paper', 'light', [cloud(24, 14, 1), cloud(70, 18, .8)]),
        dp('sage', 'base', hills(48)),
        dp('sage', 'light', ground(60, .4)),
        dp('tomato', 'light', [ws.roofL, sh.roofL]), dp('cream', 'dark', [ws.side, sh.side]),
        ink('cream', 'base', [ws.front, sh.front]), ink('tomato', 'base', [ws.roofR, sh.roofR]),
        ink('blue', 'base', pv.panels), dp('blue', 'light', pv.lines),
        dp('glass', 'base', [rect(33, 50, 14, 10), rect(77, 48, 8, 7), rect(89, 48, 6, 5)]),
        ink('leaf', 'base', [tr.crown, smC([[56, 66], [58, 61], [62, 60], [65, 62], [66, 66]], 2)]),
        dp('leaf', 'light', [tr.hi, smC([[57.5, 64], [59, 61.5], [61.5, 61.5]], 2)]),
        dp('blue', 'base', [...mech.body, ...inWin.body]),
        dp('honey', 'base', [circ(103, 15, 7, 16), ...cust.body, circ(30, 38.5, 3.6, 12), smC([[72, 70.5], [78, 70.5], [77, 66], [73, 66]], 1)]),   // nap, vevő, cégér, lámpabúra
        dp('skin', 'base', [mech.head, cust.head, inWin.head]),
        dp('dark', 'base', [rect(12, 50, 15, 16), rect(86, 51, 6, 11), tr.trunk, ...bk.wheels, ...bk.frame, ...mech.legs, ...cust.legs, ...all([mech, cust, inWin], 'hair'),
          band([[28.2, 40.3], [31.6, 36.8]], 1, false), ring(31.9, 36.5, .9, .6, 8),                     // villáskulcs a cégéren
          band([[75, 70.5], [75, 76]], .8, false), band([[37, 84], [37, 77]], 1, false)]),                 // lámpa szára, kerékpár-állvány
      ]);
  }

  // =====================================================================
  //  4. VÁSÁRLÁS – újratöltő bolt belülről: csomagolásmentes polcok üvegekkel, vevő vászontáskával, bérelhető szerszámok falon
  // =====================================================================
  {
    const WIN = rect(7, 8, 30, 24), inWin = p => clip(p, WIN);
    const jar = (x, y, w, h) => smC([[x, y - h], [x + w, y - h], [x + w, y], [x, y]], 2, .15);           // y = a polc
    const fill = (x, y, w, h, f) => rect(x + .6, y - h * f, w - 1.2, h * f - .6);
    const rows = [30, 44, 58], xs = [55, 64, 73, 82, 91];
    const jars = [], fills = [[], [], []];
    rows.forEach((y, r) => xs.forEach((x, i) => { const h = 9 - (i % 2) * 1.5; jars.push(jar(x, y, 8, h)); fills[(i + r) % 3].push(fill(x, y, 8, h, .55 + (i % 3) * .1)); }));
    const cust = person(42, 88, 36);
    const tote = smC([[46, 66], [55, 66], [56, 79], [45.5, 79]], 2, .15);
    postcard('vasarlas', 'Egy nap 2050-ben: vásárlás (újratöltő bolt, vászontáska, bérelhető eszközök)', 'A day in 2050: shopping (refill shop, canvas bag and tools to borrow)',
      'landscape postcard: bright zero-waste refill shop interior with wooden shelves of glass jars, a customer with a canvas tote bag holding a jar, a pegboard of tools to borrow, a sunny window', [
        dp('sky', 'light', [WIN]),
        dp('wood', 'light', [rect(-2, 70, 124, 24)]),                                            // padló
        ink('leaf', 'base', [inWin(smC([[4, 34], [10, 24], [18, 22], [26, 26], [30, 34]], 3)), inWin(circ(33, 26, 6, 10)),
          smC([[104, 60], [106, 50], [110, 53], [113, 44], [117, 51], [119, 60]], 3)]),                       // kint fák · cserepes növény
        ink('wood', 'base', [band([[7, 8], [37, 8], [37, 32], [7, 32], [7, 8]], 1.8, false), band([[22, 8], [22, 32]], 1.4, false),   // ablakkeret
          ...rows.map(y => rect(52, y, 50, 2.2)), rect(52, 20, 2.2, 50), rect(99.8, 20, 2.2, 50)]),                         // polcok
        dp('cardboard', 'light', [rect(6, 38, 28, 26)]),
        ink('glass', 'light', jars),                                        // szerszámfal
        ink('steel', 'base', [[[9, 45], [19, 45], [19, 49], [9, 51]], rect(23, 42, 2, 12), rect(21, 42, 6, 2.5), rect(9, 55, 12, 2)]),   // fűrész, kalapács, csavarkulcs
        dp('honey', 'base', [circ(31, 13, 4, 12), ...fills[0], smC([[26, 56], [32, 56], [32, 60], [29, 60], [28, 63], [26, 63]], 1)]),   // nap · üvegek tartalma · fúró
        dp('orange', 'base', [...fills[1], smC([[106, 72], [117, 72], [118, 61], [105, 61]], 1, .1)]),       // lencse · cserép
        dp('soil', 'base', fills[2]),
                dp('leaf', 'dark', cust.body),
        ink('cream', 'base', [tote]),   // vászontáska
        dp('skin', 'base', [cust.head]),
        dp('dark', 'base', [...cust.legs, ...cust.hair, band([[-2, 70], [124, 70]], .8, false), ...xs.flatMap(x => rows.map(y => rect(x + 1, y - 10.5, 6, 1.4))),
          band([[47, 66], [48.5, 58], [52.5, 58], [54.5, 66]], .8, false)]),
      ]);
  }

  // =====================================================================
  //  5. OTTHON – felújított, jól szigetelt ház: napelem, hőszivattyú, esővíz-gyűjtő hordó, zöldtetős melléképület, virágos kert
  // =====================================================================
  {
    const h = gHouse(28, 70, 38, 24, 20, 15), ex = box(6, 70, 22, 12, 14);
    const pv = solar(h.rq, 2, .1, .9, .12, .88);
    const tr = tree(106, 78, 26, 10);
    const hp = box(82, 76, 12, 9, 6);
    postcard('otthon', 'Egy nap 2050-ben: otthon (felújított ház napelemmel, hőszivattyúval, esővízzel, zöldtetővel)', 'A day in 2050: home (a renovated house with solar panels, heat pump, rain barrel and green roof)',
      'landscape postcard: sunny renovated insulated family house with solar panels on the roof, a heat pump unit outside, a rain water barrel under the downpipe, a shed with a green roof, flowers and a tree', [
        skyL(), sun(),
        dp('paper', 'light', [cloud(20, 13, 1)]),
        dp('sage', 'base', hills(50)),
        dp('grass', 'base', ground(66)),
        dp('tomato', 'light', [h.roofL]), dp('cream', 'dark', [h.side, ex.side]),
        ink('cream', 'base', [ex.front, h.front]), ink('tomato', 'base', [h.roofR]),
        ink('blue', 'base', pv.panels), dp('blue', 'light', pv.lines),
        dp('glass', 'base', [rect(31.5, 53, 8, 9), rect(54.5, 53, 8, 9), rect(10, 61, 9, 6), circ(47, 40, 2.3, 10)]),
        ink('leaf', 'base', [ex.top, tr.crown, smC([[2, 77], [6, 71], [14, 71], [18, 77]], 2)]),     // zöldtető, fa, bokor
        dp('leaf', 'light', [tr.hi, [[8, 57.5], [26, 57.5], [30, 55], [13, 55]]]),
        ink('white', 'base', [hp.front, hp.top, band([[68, 47], [68, 62]], 1.4, false)]),       // hőszivattyú, ereszcsatorna
        ink('teal', 'base', [rect(43, 56, 7, 14), smC([[65, 63], [72, 63], [72.6, 74], [64.4, 74]], 2)]),   // ajtó, esővíz-hordó
        dp('dark', 'base', [tr.trunk, ring(88, 71.5, 2.8, .9, 12), band([[85.5, 71.5], [90.5, 71.5]], .7, false), band([[88, 69], [88, 74]], .7, false),
          ...[31.5, 54.5].map(x => rect(x - .5, 62, 9, 1.3)), band([[64.4, 66], [72.6, 66]], .6, false)]),   // ventilátor, ablakpárkány, hordó abroncsa
        dp('pink', 'base', [...[[4, 72], [9, 70], [14, 71.5], [18, 74], [78, 82], [83, 80], [98, 83], [34, 78], [40, 80]].map(([x, y]) => flower(x, y, 1.3)),
          ...[[12, 55.5], [18, 55], [23, 56]].map(([x, y]) => flower(x, y, 1))]),               // virágok (a zöldtetőn is)
      ]);
  }

  // =====================================================================
  //  6. HULLADÉK – javítókávézó a szabadban: asztalon szétszedett kenyérpirító és lámpa, körforgás-cégér, komposztáló csírákkal
  // =====================================================================
  {
    const cf = gHouse(4, 60, 40, 20, 14, 12);
    const tr = tree(104, 62, 22, 10);
    const ppl = [seated(40, 68, 27), seated(62, 68, 25, { dress:true })];
    const comp = box(90, 82, 22, 12, 10);
    // körforgás-jel: két ívelt nyíl körben (nincs betű)
    const arrow = (a0, a1) => { const P = arc(24, 33, 3.3, a0, a1, 6), e = P[P.length - 1], dir = rad(a1 + 90);
      return [band(P, 1.2, false), [[e[0] + 1.8 * Math.cos(dir - 1.57), e[1] + 1.8 * Math.sin(dir - 1.57)], [e[0] - 1.8 * Math.cos(dir - 1.57), e[1] - 1.8 * Math.sin(dir - 1.57)], [e[0] + 2 * Math.cos(dir), e[1] + 2 * Math.sin(dir)]]]; };
    postcard('hulladek', 'Egy nap 2050-ben: hulladék (javítókávézó, körforgás, komposztáló)', 'A day in 2050: waste (repair café, circular reuse and a compost bin)',
      'landscape postcard: sunny outdoor repair café, volunteers fixing a toaster and a lamp on a wooden table, a sign with circular arrows, a wooden compost bin with sprouts, a tree', [
        skyL(),
        dp('sage', 'base', hills(46)),
        dp('grass', 'base', ground(58)),
        dp('tomato', 'light', [cf.roofL]), dp('cream', 'dark', [cf.side]),
        ink('cream', 'base', [cf.front]), ink('tomato', 'base', [cf.roofR]),
        dp('glass', 'base', [rect(7, 44, 15, 11)]),
        ink('leaf', 'base', [tr.crown, ...[96, 101, 106].map(x => smC([[x - 2, 70.5], [x, 66.5], [x + 2, 70.5]], 2))]),
        dp('leaf', 'light', [tr.hi]),
        dp('blue', 'base', ppl[0].body), dp('berry', 'base', ppl[1].body),
        dp('skin', 'base', heads(ppl)),
        ink('wood', 'light', [[[16, 73], [84, 73], [89, 68], [21, 68]], comp.front, comp.top]),     // asztallap · komposztáló
        ink('steel', 'base', [rect(24, 61, 11, 8.5), [[45, 70.5], [52, 70.5], [51, 72.3], [46, 72.3]], rect(73.2, 58, 1.6, 12), [[70, 70], [78, 70], [77, 72], [71, 72]]]),   // pirító, levett oldallap, lámpa
        dp('paper', 'light', [circ(24, 33, 5.2, 16), cloud(20, 14, .9), ...ppl[0].hair]),   // cégér-korong · felhő · ősz haj
        dp('honey', 'base', [circ(103, 15, 7, 16), smC([[69, 58.5], [79, 58.5], [77, 53], [71, 53]], 1), ...arrow(-60, 120), ...arrow(120, 300)]),
        dp('dark', 'base', [rect(28, 46, 9, 14), tr.trunk, ...ppl[1].hair, rect(18, 73, 2, 12), rect(80, 73, 2, 12),
          ...[84, 76.5, 79].map((y, i) => band([[90, 71.5 + i * 3.5], [112, 71.5 + i * 3.5]], .6, false)),             // komposztáló lécei
          circ(53, 69.8, .6, 6), circ(55, 69.4, .6, 6), circ(57, 70, .6, 6), band([[25.5, 59.8], [33.5, 59.8]], 1, false), band([[36, 63], [36, 66.5]], .8, false)]),
      ]);
  }

  // =====================================================================
  //  7. ETIKA – közösségi fórum a szabadban egy nagy fa alatt: gyerek szól, idősek és fiatalok figyelnek, virágos rét méhekkel
  // =====================================================================
  {
    const tr = tree(36, 64, 30, 17);
    const back = [[70, 44], [84, 44], [98, 44]].map(([x, y]) => ({ f:[[x, y + 10], [x + 11, y + 10], [x + 11, y + 3], [x + 5.5, y - 3], [x, y + 3]],
      r:band([[x - 1, y + 3.6], [x + 5.5, y - 3], [x + 12, y + 3.6]], 2.2, false) }));
    const gma = seated(15, 67, 25, { dress:true, foot:77 }), kid = person(50, 78, 18, { arm:'up' }), gpa = person(66, 78, 26), teen = seated(90, 67, 23, { foot:77 });
    const benches = [rect(4, 66.5, 24, 2.6), rect(4, 57, 24, 2.6), rect(78, 66.5, 24, 2.6), rect(78, 57, 24, 2.6)];
    const bees = [bee(60, 48, 1.2), bee(108, 76, 1), bee(34, 83, 1)];
    const fl = [[6, 85], [14, 82], [22, 86], [38, 84], [46, 87], [60, 83], [68, 86], [80, 84], [90, 87], [98, 82], [110, 85], [116, 81]];
    postcard('etika', 'Egy nap 2050-ben: etika és döntések (közösségi fórum a fa alatt, virágos rét)', 'A day in 2050: ethics and choices (an outdoor town forum under a tree, a flower meadow with bees)',
      'landscape postcard: sunny outdoor town forum under a big tree, a child speaking with a raised hand, grandparents and a teenager listening on benches, a flower meadow with bees, small houses behind', [
        skyL(),
        dp('sage', 'base', hills(50)),
        dp('grass', 'base', ground(60)),
        ink('cream', 'base', back.map(b => b.f)), ink('tomato', 'base', back.map(b => b.r)),
        ink('leaf', 'base', [tr.crown]), dp('leaf', 'light', [tr.hi]),
        ink('wood', 'base', benches),
        dp('blue', 'base', [...gpa.body, ...teen.body]), dp('orange', 'base', [...kid.body, ...gma.body]),
        dp('skin', 'base', heads([gma, kid, gpa, teen])),
        dp('white', 'dark', [...gma.hair, ...gpa.hair]),                                        // ősz haj
        dp('grass', 'light', [[...smO([[-4, 80], [30, 77], [60, 79], [90, 76.5], [126, 78.5]], 4), [126, 96], [-4, 96]]]),   // virágos rét
        dp('pink', 'base', fl.filter((_, i) => i % 2).map(([x, y]) => flower(x, y, 1.6))),
        dp('honey', 'base', [circ(103, 15, 7, 16), ...fl.filter((_, i) => !(i % 2)).map(([x, y]) => flower(x, y, 1.5)), ...bees.map(b => b.body)]),
        dp('paper', 'light', [cloud(70, 15, 1), cloud(26, 9, .7), ...bees.flatMap(b => b.wings)]),
        dp('dark', 'base', [tr.trunk, ...all([gma, kid, gpa, teen], 'legs'), ...kid.hair, ...teen.hair, ...bees.map(b => b.stripe),
          band([[74, 58], [74, 78]], .9, false), ...[6, 25, 80, 99].map(x => rect(x, 57, 1.4, 20))]),   // bot, padlábak
      ]);
  }

  // =====================================================================
  //  8. DIGITÁLIS LÁBNYOM – könyvtár: nagyapa és unokája egy javítható, csavarral nyitható laptopot használ;
  //     az ablakon át napelemes „adatház” fák között
  // =====================================================================
  {
    const WIN = rect(58, 8, 54, 40), inWin = p => clip(p, WIN);
    const dh = box(70, 40, 26, 10, 12);
    const pv = [quadIn(dh.top, .08, .92, .15, .85)];
    const ppl = [seated(57, 72, 28), seated(97, 72, 24, { dress:true })];
    const books = [[], [], []];
    [[8, 22], [8, 38], [8, 54], [8, 70]].forEach(([x0, y], r) => { let x = x0 + 1;
      for(let i = 0; x < 45; i++){ const w = 2.6 + ((i * 7 + r * 3) % 4) * .6, h = 9 + ((i * 5 + r) % 3) * 1.6; books[(i + r) % 3].push(rect(x, y - h, w, h)); x += w + .4; } });
    postcard('digitalis', 'Egy nap 2050-ben: digitális lábnyom (javítható laptop a könyvtárban, napelemes adatház)', 'A day in 2050: digital footprint (a repairable laptop in the library and a solar-powered data centre)',
      'landscape postcard: sunny town library interior with bookshelves, a grandfather and granddaughter using a sturdy repairable laptop with a screwdriver beside it, through the window a small solar-roofed data centre among trees', [
        dp('sky', 'light', [WIN]),
        dp('leaf', 'light', [inWin([[50, 42], [80, 38], [120, 41], [120, 60], [50, 60]])]),
        ink('leaf', 'base', [inWin(circ(64, 32, 7, 10)), inWin(circ(105, 31, 8, 10))]),
        ink('white', 'base', [dh.front, dh.side, dh.top]),
        ink('blue', 'base', pv),
        dp('sage', 'base', [rect(-2, 72, 124, 22)]),                                                // szőnyeg
        ink('wood', 'base', [band([[58, 8], [112, 8], [112, 48], [58, 48], [58, 8]], 2, false), band([[85, 8], [85, 48]], 1.5, false),
          rect(6, 6, 2.4, 66), rect(45, 6, 2.4, 66), ...[22, 38, 54, 70].map(y => rect(6, y, 41.4, 2.2))]),   // ablakkeret · könyvespolc
        dp('teal', 'base', books[0]),
        dp('blue', 'base', ppl[0].body), dp('berry', 'base', [...ppl[1].body, ...books[1]]),
        dp('skin', 'base', heads(ppl)),
        dp('white', 'dark', ppl[0].hair),
        ink('wood', 'light', [[[40, 76], [110, 76], [115, 71], [45, 71]]]),                           // asztallap
        ink('steel', 'base', [[[68, 73.5], [84, 73.5], [86, 71.2], [70, 71.2]], [[70, 71.2], [86, 71.2], [85, 60], [71, 60]], rect(100, 72.3, 6, 2.2)]),   // laptop · kivett akku-modul
        dp('sky', 'base', [[[72, 69.8], [84.2, 69.8], [83.5, 61.5], [72.4, 61.5]]]),               // képernyő
        dp('honey', 'base', [circ(104, 17, 5, 14), ...books[2], rect(88, 73.3, 4, 1.4)]),           // nap · könyvek · csavarhúzó nyele
        dp('dark', 'base', [...ppl[1].hair, rect(44, 76, 2, 12), rect(106, 76, 2, 12), band([[92, 74], [95, 74]], .5, false),
          ...[0, 1, 2, 3].map(i => circ(71 + i * 4.5, 72.4, .45, 6))]),                               // asztallábak, csavarhúzó hegye, csavarok
      ]);
  }
})();
