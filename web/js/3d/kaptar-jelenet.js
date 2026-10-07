// ============================================================
//  beeco KAPTÁR – a közösség 3D otthona, ADATBÓL építve (a Kaptár platform és a beeco.hu közös jelenete)
//
//  Betöltés (sorrendben): three.min.js (r128) · js/ds.js · js/art/art.js · js/art/model-kit.js · js/vilag/vilag-modellek.js ·
//    js/vilag/vilag-fold.js · js/vilag/vilag.js · js/3d/kaptar-modellek.js · js/3d/kozosseg-modellek.js · js/3d/kaptar-jelenet.js
//
//  const KP = beecoKaptar(THREE, scene, adat, { quality:'auto', time:'nap', mozgas:true });
//  képkockánként: KP.tick(dt, camera) · kattintás: const sel = KP.pick(ndcX, ndcY, camera) → { tipus, id, cim, adat, hol:[x,y,z] }
//  KP.kiemel(sel) – a kijelölt tárgy fénygyűrűt kap · KP.lista – minden kijelölhető tárgy (a 2D tartalék-listához, ugyanabban a sorrendben)
//  KP.frissit(adat) – újraépíti a közösségi részt (a világ marad) · KP.dispose()
//
//  adat = { rajok:[{ id, nev, tagok:[{ id, nev }], egeszseg:0..1|null, sajat:bool }], jovo:[{ id, cim, allapot:'kesz'|'most'|'jon' }],
//           esemenyek:[{ id, cim }], koszonetek:[{ id, cim }], viccek:[{ id, cim }], retro:{ cim }|null }
//  Elrendezés: középen a jövő tornya, körülötte gyűrűben a rajsejtek (ajtóval befelé), kint a kút, a falak, a kikötő, elöl a kapu.
//  Színek: DS.world / ART.MAT; a raj egészsége a sejt alatti gyűrű színe ÉS a tábla jele (szín mellett jel is – hozzáférhetőség).
// ============================================================
function beecoKaptar(THREE, scene, adat, opts){
  const o = Object.assign({ quality:'auto', time:'nap', mozgas:true, gyuru:7.2, kulso:11.6 }, opts || {});
  const K = MODEL, Z = KZ_MODELS, KP = KP_MODELS;
  // a rét csak a sziget peremén nő, és szabadon hagyja a kaput (elöl) és a kikötőt (balra) – ne takarjon semmit
  const szabad = (x, z) => { const r = Math.hypot(x, z), fok = Math.atan2(x, z) * 180 / Math.PI;
    return r > 12.6 && Math.abs(fok) > 22 && Math.abs(fok + 90) > 22; };
  const V = beecoVilag(THREE, scene, { island:{ R:15 }, meadow:{ inner:12.6, trees:5, bushes:8, free:szabad }, quality:o.quality, time:o.time, seed:7 });
  const RAJ_SZIN = ['honey', 'sky', 'blossom', 'leaf', 'teal', 'orange', 'purple', 'cream'];
  let G = null, lista = [], mehek = [], hajo = null, jelzo = null, kiemelo = null, ido = 0;

  const tabla = (szoveg, jel) => {   // DS-tábla sprite-ként; a jel (pl. ▲ ●) a szín mellé ad formát
    const c = DS.signCanvas(jel ? `${jel} ${szoveg}` : szoveg, { w:480, h:128, size:56 });
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map:t, depthWrite:false })); s.scale.set(4.2, 1.12, 1); return s;
  };
  const tesz = (obj, x, z, ry, sel) => { obj.position.set(x, 0, z); obj.rotation.y = ry || 0; G.add(obj);
    if(sel){ sel.hol = [x, 1.2, z]; obj.traverse(n => { n.userData.kaptarSel = sel; }); lista.push(sel); } return obj; };
  const befele = (x, z) => Math.atan2(-x, -z);   // +Z (eleje) a középpont felé
  const egeszsegSzin = e => e == null ? 'sage:1' : e >= 0.66 ? 'leaf:1' : e >= 0.33 ? 'honey:1' : 'ember:1';
  const egeszsegJel = e => e == null ? '' : e >= 0.66 ? '●' : e >= 0.33 ? '◆' : '▲';

  function epit(d){
    if(G){ scene.remove(G); G.traverse(n => { if(n.geometry) n.geometry.dispose(); if(n.material){ if(n.material.map) n.material.map.dispose(); n.material.dispose(); } }); }
    G = new THREE.Group(); G.name = 'beecoKaptar'; scene.add(G); lista = []; mehek = [];
    d = Object.assign({ rajok:[], jovo:[], esemenyek:[], koszonetek:[], viccek:[], retro:null }, d || {});

    // ---- középen: a jövő tornya ----
    const kesz = d.jovo.filter(j => j.allapot === 'kesz').length, emelet = Math.max(3, Math.min(8, d.jovo.length || 3));
    const torony = tesz(V.model3(Z.jovoTorony(K, { emelet, kesz }), true), 0, 0, 0,
      { tipus:'jovo', id:'jovo', cim:'A beeco jövője', adat:d.jovo });
    jelzo = torony; const tt = tabla('A beeco jövője'); tt.position.set(0, 0.3 + emelet * 0.9 + 2, 0); G.add(tt);

    // ---- gyűrűben: a rajsejtek ----
    const n = Math.max(1, d.rajok.length);
    d.rajok.forEach((raj, i) => {
      const a = (i / n) * Math.PI * 2 + Math.PI / n, x = Math.sin(a) * o.gyuru, z = Math.cos(a) * o.gyuru, ry = befele(x, z);
      const csoport = new THREE.Group();
      csoport.add(V.model3(Z.alap(K, 2.15, egeszsegSzin(raj.egeszseg)), false));
      const sejt = V.model3(Z.rajsejt(K, { szin:RAJ_SZIN[i % RAJ_SZIN.length] }), true); sejt.position.y = 0.06; csoport.add(sejt);
      tesz(csoport, x, z, ry, { tipus:'raj', id:raj.id, cim:raj.nev, adat:raj });
      const t = tabla(raj.nev + (raj.sajat ? ' ★' : ''), egeszsegJel(raj.egeszseg)); t.position.set(x, 3.0, z); G.add(t);
      // a tagok méhei a sejt fölött köröznek (legfeljebb 8 rajonként – több csak zaj lenne)
      (raj.tagok || []).slice(0, 8).forEach((tag, j) => {
        const p = KP.workerLow(K, { s:6 }), meh = new THREE.Group();
        for(const r of ['body', 'wingL', 'wingR']){ const g = V.model3(p[r], false); g.name = r; meh.add(g); }
        meh.userData = { kozep:[x, z], r:0.6 + (j % 3) * 0.35, faz:j * 1.7 + i, mag:1.9 + (j % 4) * 0.25, seb:0.5 + (j % 3) * 0.15 };
        G.add(meh); mehek.push(meh);
      });
    });

    // ---- kint: kút, falak, kikötő, kapu (szögek fokban, a kapu elöl, +Z) ----
    const kint = (fok, r) => [Math.sin(fok * Math.PI / 180) * r, Math.cos(fok * Math.PI / 180) * r];
    const helyek = [
      [215, () => V.model3(Z.esemenyKut(K), true), { tipus:'kut', id:'esemenyek', cim:'Eseménykút', adat:d.esemenyek }],
      [145, () => V.model3(Z.fal(K, { tipus:'vicc', db:d.viccek.length || 3, seed:5 }), true), { tipus:'vicc', id:'viccfal', cim:'Viccfal', adat:d.viccek }],
      [-145, () => V.model3(Z.fal(K, { tipus:'koszono', db:d.koszonetek.length || 3, seed:9 }), true), { tipus:'koszono', id:'koszonofal', cim:'Köszönőfal', adat:d.koszonetek }],
    ];
    for(const [fok, epito, sel] of helyek){ const [x, z] = kint(fok, o.kulso); tesz(epito(), x, z, befele(x, z), sel);
      const t = tabla(sel.cim); t.position.set(x, 3.4, z); G.add(t); }
    { const [x, z] = kint(-90, 13.2), k = Z.kikoto(K), g = new THREE.Group();
      g.add(V.model3(k.molo, true)); hajo = V.model3(k.hajo, true); hajo.position.set(0, 0.15, 3.1); g.add(hajo);
      tesz(g, x, z, befele(x, z) + Math.PI, { tipus:'kikoto', id:'retro', cim:'Kikötő – havi retró', adat:d.retro });
      const t = tabla('Havi retró'); t.position.set(x, 3.6, z); G.add(t); }
    { const [x, z] = kint(0, 13.4); tesz(V.model3(Z.kapu(K), true), x, z, 0, { tipus:'kapu', id:'kapu', cim:'Kapu – csatlakozz', adat:null }); }

    kiemelo = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.08, 6, 6), new THREE.MeshBasicMaterial({ color:K.hexOf('honey:0') }));
    kiemelo.rotation.x = Math.PI / 2; kiemelo.visible = false; G.add(kiemelo);
  }

  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
  function pick(nx, ny, camera){
    v2.set(nx, ny); ray.setFromCamera(v2, camera);
    for(const h of ray.intersectObjects(G.children, true)){ if(h.object.userData.kaptarSel) return h.object.userData.kaptarSel; }
    return null;
  }
  function kiemel(sel){
    if(!kiemelo) return; kiemelo.visible = Boolean(sel);
    if(sel){ kiemelo.position.set(sel.hol[0], 0.12, sel.hol[2]); kiemelo.scale.setScalar(sel.tipus === 'raj' ? 1 : 0.8); }
  }
  function tick(dt, camera){
    V.tick(dt, camera); ido += dt;
    if(!o.mozgas) return;
    for(const m of mehek){ const u = m.userData, a = ido * u.seb + u.faz;
      m.position.set(u.kozep[0] + Math.cos(a) * u.r, u.mag + Math.sin(ido * 2 + u.faz) * 0.08, u.kozep[1] + Math.sin(a) * u.r);
      m.rotation.y = -a; const f = Math.sin(ido * 40 + u.faz) * 0.5;
      m.children.forEach(c => { if(c.name === 'wingL') c.rotation.z = f; if(c.name === 'wingR') c.rotation.z = -f; }); }
    if(hajo){ hajo.rotation.z = Math.sin(ido * 0.9) * 0.05; hajo.position.y = 0.15 + Math.sin(ido * 1.3) * 0.04; }
    if(kiemelo && kiemelo.visible) kiemelo.rotation.z += dt * 0.6;
  }
  function dispose(){ if(G){ scene.remove(G); G.traverse(n => { if(n.geometry) n.geometry.dispose(); if(n.material){ if(n.material.map) n.material.map.dispose(); n.material.dispose(); } }); } V.dispose(); }

  epit(adat);
  return { V, get lista(){ return lista; }, get root(){ return G; }, pick, kiemel, tick, dispose, frissit:epit,
    set mozgas(v){ o.mozgas = Boolean(v); }, get mozgas(){ return o.mozgas; }, get torony(){ return jelzo; } };
}
if(typeof module !== 'undefined' && module.exports) module.exports = beecoKaptar;
