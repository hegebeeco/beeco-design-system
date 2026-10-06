// ============================================================
//  2D HÁTTÉR – MÉHESD (kertváros) két változatban, ugyanazon a várostérképen: szmogos ma ('szmog') és zöld jövő ('zold')
//  2026-10-06: Kristóf döntése szerint „a kertváros mindenhol” – a 3D Méhesd kis nyeregtetős házai, nem panelváros.
//  Használja: a menü Méhesd-csempéje, a fokozat-ünnep, a Polgármester és a „Vágd a zöld jövőt!” háttere (jovo-city.js → varosFest).
//
//  beecoHatter2D.varos(canvas, { variant:'szmog'|'zold', seed:2075 })   → { redraw(o), destroy() }
//  beecoHatter2D.varosJovo(host, { seed, value:0 })                     → { set(0–1), redraw(o), destroy() }
//     két egymásra tett vászon: alul a szmogos, fölötte a zöld – a „jövő-mérő” (0–1) a zöld réteg átlátszóságát állítja,
//     így a keverés képkockánként semmibe sem kerül (mindkét kép egyszer rajzolódik).
//  beecoHatter2D.varosLayout(W, H, seed) – tiszta függvény: ugyanaz a seed → ugyanaz az elrendezés (Node-teszt).
// ============================================================
(function(root){
  const A = root.beecoHatter2D || (typeof require === 'function' ? require('./alap.js') : null);

  // TARTALOM-színek: a szmogos (mai) Méhesd szürkéi és barnái a szennyezett levegőt ábrázolják, ezért nincsenek a palettában.
  // [világos, alap, sötét] falszínek, tetők [eleje, oldala]; a zöld város mindent az ART.MAT-ból vesz.
  const SZIN = { sky:['#8D8A80', '#A39D8B', '#B7AE96'], haze:'rgba(120,108,80,.20)', far:'#8E8B83',
    house:[['#A9A59B', '#97938A', '#7C7970'], ['#B0A99A', '#9C9584', '#7F7968'], ['#A2A4A5', '#8F9193', '#76787A']],
    roof:[['#8A7468', '#6F5D54'], ['#7E766C', '#655E56'], ['#727980', '#5B6167']],
    win:'#4E4C47', winLit:'#C9B77A', line:'#3D3B36', smoke:['rgba(84,82,76,.62)', 'rgba(110,106,96,.5)'], ground:'#6A675E',
    road:'#3D3B36', dash:'#C9C3AE', tyre:'#26241F', sunSmog:'rgba(230,214,170,.45)', sill:'rgba(255,255,255,.12)',
    curb:'rgba(255,255,255,.08)', veil:'rgba(120,110,80,.26)', hedge:'#5E6455' };

  // ---- elrendezés: EGYSZER sorsolva, mindkét változat ebből fest ----
  // 2026-10-06 (Kristóf döntése: „a kertváros mindenhol”): Méhesd kertváros, mint a 3D városban – kis nyeregtetős házak
  // kerttel és kerítéssel, mögöttük a távoli háztetők és a templomtorony; nincs panelház.
  function varosLayout(W, H, seed = 2075){
    const r = A.rng(seed), ground = H * 0.84, unit = Math.max(24, Math.min(H * 0.06, W * 0.09));
    const back = [], front = [], trees = [], cars = [], hills = [], birds = [];
    for(let x = -20; x < W + 20; x += unit * (1.2 + r() * 1.1)) back.push({ x, w:unit * (0.9 + r() * 0.8), h:H * (0.05 + r() * 0.06) });
    const tower = { x:W * (0.22 + r() * 0.5), w:unit * 0.42, h:H * 0.26 };
    for(let x = -unit * 0.6; x < W + 10;){ const w = unit * (1.5 + r() * 0.9), h = Math.min(H * (0.09 + r() * 0.05), w * 0.85);
      front.push({ x, w, h, tone:Math.floor(r() * 3), roof:r(), door:r() < 0.5, lit:r() }); x += w + unit * (0.55 + r() * 0.5); }
    for(let x = unit * 0.4; x < W; x += unit * (1.3 + r() * 1.1)) trees.push({ x, s:0.8 + r() * 0.5, kind:r() });
    for(let x = r() * unit; x < W; x += unit * (2.2 + r() * 2.4)) cars.push({ x, c:Math.floor(r() * 3) });
    for(let i = 0; i < 4; i++) hills.push({ x:W * (i / 3) + (r() - 0.5) * W * 0.2, r:W * (0.22 + r() * 0.12), h:H * (0.1 + r() * 0.08) });
    for(let i = 0; i < 5; i++) birds.push({ x:W * (0.2 + r() * 0.5), y:H * (0.12 + r() * 0.14), s:unit * (0.12 + r() * 0.08) });
    return { ground, unit, back, tower, front, trees, cars, hills, birds };
  }
  if(typeof module !== 'undefined' && module.exports && !root.document){ module.exports = { varosLayout, SZIN }; return; }

  // ---- festés ----
  function paint(x, W, H, o){
    const M = A.M(), green = o.variant === 'zold', L = varosLayout(W, H, o.seed), G = L.ground, u = L.unit;
    const line = green ? A.ink() : SZIN.line, lw = 1.4;
    // ég: zöldben sávos kék → mézes horizont, szmogban barnás pára-sávok
    A.skyBands(x, W, 0, G, green ? [M.sky[1], M.sky[0], M.white[0], M.honey[0]] : SZIN.sky);
    if(green){
      A.sun(x, W * 0.82, H * 0.15, Math.min(W, H) * 0.06);
      for(const [cx, cy, s] of [[0.14, 0.12, 1], [0.46, 0.08, 0.8], [0.64, 0.24, 0.7]]) A.cloud(x, W * cx, H * cy, u * 0.5 * s);
      x.strokeStyle = A.ink(); x.lineWidth = 1.6;                                           // madarak
      for(const b of L.birds){ x.beginPath(); x.moveTo(b.x - b.s, b.y - b.s * 0.5); x.quadraticCurveTo(b.x - b.s * 0.4, b.y - b.s * 0.7, b.x, b.y);
        x.quadraticCurveTo(b.x + b.s * 0.4, b.y - b.s * 0.7, b.x + b.s, b.y - b.s * 0.5); x.stroke(); }
    } else A.circle(x, W * 0.82, H * 0.15, Math.min(W, H) * 0.05, SZIN.sunSmog);
    // dombok a város mögött (mindkét változatban – Méhesd dombok közti kisváros); a zöldben szélkerekek
    for(const hl of L.hills){ x.beginPath(); x.ellipse(hl.x, G - H * 0.05, hl.r, hl.h, 0, Math.PI, 0); A.shape(x, green ? M.grass[0] : SZIN.far); }
    if(green) for(let i = 0; i < 3; i++){ const tx = W * (0.12 + i * 0.36), ty = G - H * 0.36;
      x.strokeStyle = M.white[2]; x.lineWidth = 3; x.beginPath(); x.moveTo(tx, G - H * 0.12); x.lineTo(tx, ty); x.stroke();
      x.strokeStyle = M.white[0]; x.lineWidth = 3.5;
      for(let k = 0; k < 3; k++){ const a = k * 2.094 + i; x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx + Math.cos(a) * u * 0.8, ty + Math.sin(a) * u * 0.8); x.stroke(); }
      A.circle(x, tx, ty, 3.5, M.white[2]); }
    // távoli háztetők és a templomtorony (sziluett)
    const far = green ? M.sage[1] : SZIN.far;
    const t = L.tower; x.fillStyle = far; x.fillRect(t.x, G - t.h, t.w, t.h);
    A.poly(x, [[t.x - 2, G - t.h], [t.x + t.w / 2, G - t.h - u * 0.9], [t.x + t.w + 2, G - t.h]], far);
    for(const b of L.back){ const top = G - b.h; x.fillStyle = far; x.fillRect(b.x, top, b.w, b.h);
      A.poly(x, [[b.x - 2, top], [b.x + b.w / 2, top - b.w * 0.35], [b.x + b.w + 2, top]], far);
      if(!green && b.w > u * 1.4) A.puff(x, b.x + b.w * 0.7, top - b.w * 0.45, u * 0.3, SZIN.smoke[1]); }      // fűtési füst
    if(!green) for(let i = 0; i < 3; i++){ x.fillStyle = SZIN.haze; x.fillRect(0, H * (0.3 + i * 0.16), W, H * 0.07); }
    ground(x, M, L, W, H, green);
    for(const b of L.front) house(x, M, b, G, u, green, line, lw);
    for(const tr of L.trees) tree(x, M, tr, G, u, green);
    if(!green){ x.fillStyle = SZIN.veil; x.fillRect(0, 0, W, H); }                          // barnás szmog-pára mindenen
  }

  // egy kertes ház: térhatású fal (box), nyeregtető (homlokzat + oldal), ablakok, ajtó;
  // zöld: napelem a tetőn, virágláda · szmog: kémény füsttel vagy klímadoboz
  function house(x, M, b, G, u, green, line, lw){
    const top = G - b.h, d = b.w * 0.14, rh = Math.min(b.w * 0.42, u * 1.05);
    const fal = green ? [M.cream, M.white, M.paper][b.tone] : SZIN.house[b.tone];
    const teto = green ? [[M.red[0], M.red[1]], [M.wood[0], M.wood[1]], [M.blue[0], M.blue[1]]][b.tone] : SZIN.roof[b.tone];
    A.box(x, b.x, top, b.w, b.h, d, fal, line, lw);
    // tető: oldallap (a mélység felé), aztán a homlokzati háromszög
    A.poly(x, [[b.x + b.w / 2, top - rh], [b.x + b.w / 2 + d, top - rh - d * 0.6], [b.x + b.w + 4 + d, top - d * 0.6], [b.x + b.w + 4, top]], teto[1], line, lw);
    A.poly(x, [[b.x - 4, top], [b.x + b.w / 2, top - rh], [b.x + b.w + 4, top]], teto[0], line, lw);
    A.circle(x, b.x + b.w / 2, top - rh * 0.42, Math.max(2.5, rh * 0.13), green ? M.sky[1] : SZIN.win, line, 1);    // padlásablak
    // ablakok és ajtó
    const ww = b.w * 0.22, wh = b.h * 0.3, wy = top + b.h * 0.22;
    const ablak = (wx, on) => { x.fillStyle = green ? (on ? M.honey[0] : M.sky[1]) : (on ? SZIN.winLit : SZIN.win); x.fillRect(wx, wy, ww, wh);
      x.strokeStyle = line; x.lineWidth = 1; x.strokeRect(wx, wy, ww, wh);
      x.fillStyle = green ? M.white[0] : SZIN.sill; x.fillRect(wx - 1, wy + wh, ww + 2, 2.5);
      if(green){ A.circle(x, wx + ww * 0.25, wy + wh + 1, 2.6, M.leaf[1]); A.circle(x, wx + ww * 0.7, wy + wh + 1, 2.6, M.blossom[1]); } };
    if(b.door){ ablak(b.x + b.w * 0.14, b.lit < 0.3); A.rect(x, b.x + b.w * 0.6, G - b.h * 0.5, b.w * 0.22, b.h * 0.5, green ? M.wood[1] : SZIN.roof[b.tone][1], line, 1); }
    else { ablak(b.x + b.w * 0.14, b.lit < 0.3); ablak(b.x + b.w * 0.62, b.lit > 0.8); }
    // tetődísz
    if(green && b.roof < 0.5){ for(let k = 0; k < 2; k++){ const px = b.x + b.w * (0.58 + k * 0.17) + d * 0.3, py = top - rh * (0.55 - k * 0.3);
      A.poly(x, [[px, py], [px + b.w * 0.14, py + rh * 0.12], [px + b.w * 0.14 + d * 0.4, py + rh * 0.12 - d * 0.25], [px + d * 0.4, py - d * 0.25]], M.blue[2], M.blue[3], 1); } }   // napelem
    else if(!green && b.roof < 0.6){ const cx = b.x + b.w * 0.7, cy = top - rh * 0.55;
      A.rect(x, cx, cy - u * 0.4, u * 0.2, u * 0.45, SZIN.roof[b.tone][1], line, lw);
      for(let k = 0; k < 3; k++) A.puff(x, cx + u * 0.1 + k * u * 0.24, cy - u * (0.6 + k * 0.32), u * (0.16 + k * 0.07), SZIN.smoke[k % 2]); }
    else if(!green){ A.rect(x, b.x + b.w * 0.04, top + b.h * 0.6, b.w * 0.18, b.h * 0.16, SZIN.house[2][2], line, 1); }      // klímadoboz
  }

  // fák a kertekben: zöldben lombos és tűlevelű, szmogban kopár, szürkés
  function tree(x, M, t, G, u, green){
    const s = t.s * u * 0.9, bx = t.x, by = G + 2;
    x.fillStyle = green ? M.wood[2] : SZIN.hedge; x.fillRect(bx - 2.5, by - s * 0.55, 5, s * 0.58);
    if(!green){ A.puff(x, bx, by - s * 0.7, s * 0.24, SZIN.hedge); return; }
    if(t.kind < 0.5){ A.puff(x, bx, by - s * 0.75, s * 0.34, M.leaf[1]); A.puff(x, bx - s * 0.08, by - s * 0.84, s * 0.2, M.leaf[0]); }
    else { A.poly(x, [[bx, by - s * 1.2], [bx + s * 0.28, by - s * 0.45], [bx - s * 0.28, by - s * 0.45]], M.leaf[2]);
      A.poly(x, [[bx, by - s * 1.2], [bx - s * 0.28, by - s * 0.45], [bx - s * 0.02, by - s * 0.45]], M.leaf[1]); }
  }

  // talaj: zöldben fű, virágos kertek, sövény, bicikliút · szmogban aszfalt, autósor kipufogófüsttel
  function ground(x, M, L, W, H, green){
    const G = L.ground, u = L.unit, gh = H - G;
    x.fillStyle = green ? M.grass[1] : SZIN.ground; x.fillRect(0, G, W, gh);
    x.fillStyle = green ? M.grass[0] : SZIN.curb; x.fillRect(0, G, W, 4);
    // kerítés a kertek előtt
    x.strokeStyle = green ? M.white[2] : SZIN.hedge; x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, G + gh * 0.16); x.lineTo(W, G + gh * 0.16); x.stroke();
    for(let px = 4; px < W; px += 9){ x.beginPath(); x.moveTo(px, G + gh * 0.06); x.lineTo(px, G + gh * 0.24); x.stroke(); }
    if(green){
      x.fillStyle = M.sage[1]; x.fillRect(0, G + gh * 0.45, W, gh * 0.24);                          // bicikliút
      x.fillStyle = M.white[0]; for(let px = 0; px < W; px += 26) x.fillRect(px, G + gh * 0.56, 13, 2.5);
      for(const t of L.trees){ const fc = [M.blossom[1], M.honey[1], M.white[0]][Math.floor(t.kind * 3)];
        for(const dx of [-10, 4, 12]) A.circle(x, t.x + dx, G + gh * 0.32, 2.4, fc); }
    } else {
      x.fillStyle = SZIN.road; x.fillRect(0, G + gh * 0.36, W, gh * 0.4);
      x.fillStyle = SZIN.dash; for(let px = 0; px < W; px += 34) x.fillRect(px, G + gh * 0.54, 16, 2.5);
      for(const c of L.cars){ const cy = G + gh * 0.4, cw = u * 1.1, ch = u * 0.32, col = SZIN.house[c.c];
        x.fillStyle = col[1]; x.fillRect(c.x, cy, cw, ch); x.fillStyle = col[0]; x.fillRect(c.x + cw * 0.2, cy - ch * 0.55, cw * 0.55, ch * 0.6);
        x.fillStyle = SZIN.win; x.fillRect(c.x + cw * 0.26, cy - ch * 0.45, cw * 0.2, ch * 0.4); x.fillRect(c.x + cw * 0.5, cy - ch * 0.45, cw * 0.2, ch * 0.4);
        for(const wx of [0.22, 0.78]) A.circle(x, c.x + cw * wx, cy + ch, ch * 0.36, SZIN.tyre);
        A.puff(x, c.x - u * 0.2, cy + ch * 0.7, u * 0.12, SZIN.smoke[1]); }
    }
  }

  // ---- nyilvános API ----
  const varos = (canvas, o = {}) => A.mount(canvas, paint, Object.assign({ variant:'szmog', seed:2075 }, o));
  function varosJovo(host, o = {}){
    if(getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const mk = (v) => { const c = document.createElement('canvas'); c.className = 'h2d-layer is-' + v; c.setAttribute('aria-hidden', 'true');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;transition:opacity var(--t-slow, .4s) ease';
      host.appendChild(c); return c; };
    const cs = mk('szmog'), cz = mk('zold');
    const a = varos(cs, { variant:'szmog', seed:o.seed }), b = varos(cz, { variant:'zold', seed:o.seed });
    const set = (k) => { cz.style.opacity = String(A.clamp(Number(k) || 0, 0, 1)); };
    set(o.value || 0);
    return { set, redraw(n){ a.redraw(n && { seed:n.seed }); b.redraw(n && { seed:n.seed }); }, destroy(){ a.destroy(); b.destroy(); cs.remove(); cz.remove(); } };
  }
  // varosFest: közvetlenül egy már beállított 2D vászon-környezetre fest (a „Vágd a zöld jövőt!” saját vásznai – jovo-city.js)
  const varosFest = (x, W, H, o = {}) => paint(x, W, H, Object.assign({ variant:'szmog', seed:2075 }, o));
  Object.assign(A, { varos, varosJovo, varosLayout, varosFest });
})(typeof window !== 'undefined' ? window : globalThis);
