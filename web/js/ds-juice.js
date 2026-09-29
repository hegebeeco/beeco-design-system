// ============================================================
//  beeco design system — JÁTÉKÉRZET („juice”) 1.10: a meglévő mozgás-készletre (ds-motion.css, DS.motion a ds.js-ben,
//  DS.delta a ds-ext.js-ben) épülő, játékokban ismétlődő pillanatok. A DS-review (2026-09-29) szerint az újabb játékok
//  (polgármester, közlekedés, múzeum, Élő lánc, bolygó, rendelő) egyetlen dsFeedback-kel, szinte mozgás nélkül futottak.
//    DS.motion.stagger(box, sel, name, gap)  – a gyerekek sorban érkeznek (képregény-panelek, kártyák, lista)
//    DS.motion.chain(els, o)                  – láncreakció: egymás után villannak, emelkedő hanggal (táplálékháló, dominó)
//    DS.motion.swipe(el, dir)                 – a kártya kirepül balra/jobbra (döntés), Promise, ha kész
//    DS.motion.meter(el, value, o)            – mérő (0–1) animált váltása + opcionális változás-jel (DS.delta)
//    DS.motion.celebrate(target, o)           – a nagy pillanat: darabkák + ragyogás + „great” hang
//  Hang: dsSound('swipe' | 'chain' | 'whoosh') – ugyanaz a halk szintetizátor, mint a többi (ds.js), a némítás érvényes.
//  Minden segéd tiszteli a „Kevesebb mozgás” beállítást: ilyenkor az állapot azonnal a végállásba ugrik.
//  Betöltés: ds.js → ds-ext.js → ds-juice.js. Bemutató: web/arculat.html → Mozgás.
// ============================================================
(function(root){
  if(!root.document) return;
  const DS = root.DS = root.DS || {}; DS.motion = DS.motion || {};
  const still = () => document.body.classList.contains('reduce-motion') || (root.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const tone = (f, d, type, vol) => { if(typeof beep === 'function') beep(f, d, type, vol); };
  const snd = n => typeof root.dsSound === 'function' && root.dsSound(n);

  // plusz hangok a ds.js készletéhez (ha a ds.js nem ad ilyet): rövid, halk, a játék beep()-jén át (némítás!)
  const EXTRA = { swipe:[[520, 0.06, 'triangle', 0.04, 0], [360, 0.08, 'triangle', 0.035, 50]],
    whoosh:[[300, 0.1, 'sine', 0.035, 0], [600, 0.12, 'sine', 0.03, 60]], chain:[[440, 0.06, 'triangle', 0.045, 0]] };
  if(typeof root.dsSound === 'function'){ const s0 = root.dsSound;
    root.dsSound = n => EXTRA[n] ? EXTRA[n].forEach(([f, d, t, v, dl]) => setTimeout(() => tone(f, d, t, v), dl)) : s0(n); }

  Object.assign(DS.motion, {
    stagger(box, sel = ':scope > *', name = 'drop', gap = 70){
      if(!box) return; const els = [...box.querySelectorAll(sel)];
      if(still()) return els;
      els.forEach((el, i) => { el.style.animationDelay = (i * gap) + 'ms'; DS.motion.play(el, name); });
      return els;
    },
    // o: { name:'pulse'|… (ds-anim-*), gap:ms, sound:true, cls:'is-hit' (maradó jelölés), onStep(el, i) }
    chain(els, o = {}){
      const list = [...(els || [])], gap = still() ? 0 : (o.gap || 140);
      return new Promise(res => {
        if(!list.length) return res();
        list.forEach((el, i) => setTimeout(() => {
          if(o.cls) el.classList.add(o.cls);
          if(!still()) DS.motion.play(el, o.name || 'tick');
          if(o.sound !== false) tone(440 * Math.pow(1.06, Math.min(i, 18)), 0.06, 'triangle', 0.04);   // emelkedő hangsor
          if(o.onStep) o.onStep(el, i);
          if(i === list.length - 1) setTimeout(res, gap);
        }, i * gap));
      });
    },
    swipe(el, dir = 1){
      return new Promise(res => { if(!el) return res();
        snd('swipe');
        if(still()){ el.style.opacity = '0'; return res(); }
        el.style.setProperty('--swipe-x', (dir < 0 ? -1 : 1) * 120 + '%'); el.style.setProperty('--swipe-rot', (dir < 0 ? -12 : 12) + 'deg');
        DS.motion.play(el, 'swipe'); setTimeout(res, 320); });
    },
    // el: egy .ds-meter (a belső <i> szélessége a --v); o: { delta, label, better, icon, anchor } – a változás-jel a DS.delta-val
    meter(el, value01, o = {}){
      if(!el) return; const v = Math.max(0, Math.min(1, +value01 || 0));
      el.style.setProperty('--v', (v * 100).toFixed(1) + '%');
      if(o.delta && DS.delta && DS.delta.show) DS.delta.show(o.anchor || el, [{ value:o.delta, label:o.label || '', better:o.better, icon:o.icon }]);
    },
    celebrate(target, o = {}){
      snd(o.sound || 'great');
      if(typeof root.dsHaptic === 'function') root.dsHaptic('great');
      if(still()) return;
      if(DS.motion.burst) DS.motion.burst(target, o.n || 16);
      if(target && target.classList){ DS.motion.play(target, 'glow'); setTimeout(() => target.classList.remove('ds-anim-glow'), 1700); }
    },
  });
})(typeof window !== 'undefined' ? window : this);
