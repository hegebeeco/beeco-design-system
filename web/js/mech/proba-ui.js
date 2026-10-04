// ============================================================
//  MECHANIKA 5 – ÜGYESSÉGI PRÓBA: a felület (sáv célzónával, mozgó jelző, „Most!” gomb)
//
//  const p = MechProba.mount(el, { feladat:'Kerüld ki!', zona:0.26, sebesseg:1, korok:3, tol:null,
//                                  onKesz:(ok) => {…} })     // egyszer hívódik: koppintásra vagy ha lejárt az idő
//  Vissza: { stop() }  ·  Kezelés: koppintás a gombra, vagy Szóköz / Enter (a gomb fókuszt kap).
//  „Kevesebb mozgás” mellett a jelző lassabban jár (MechUI.still) – a próba így is teljesíthető.
// ============================================================
(function(root){
  const { esc, ic, still, say, play } = root.MechUI;

  function mount(el, o = {}){
    const L = root.MechProba.create(Object.assign({}, o, { lassit:still() ? 1.8 : 1 }));
    el.classList.add('mp');
    el.innerHTML = `<div class="mp-sav" style="--tol:${(L.tol * 100).toFixed(1)}%;--szel:${(L.szel * 100).toFixed(1)}%" aria-hidden="true">
        <i class="mp-zona"></i><i class="mp-jel"></i></div>
      <button type="button" class="ds-btn is-block mp-gomb">${ic('hand')} ${esc(o.feladat || tr('Most!'))}</button>`;
    const sav = el.querySelector('.mp-sav'), jel = el.querySelector('.mp-jel'), gomb = el.querySelector('.mp-gomb');
    const t0 = performance.now(); let p = 0, raf = 0, vege = false;
    const dont = (ok) => { if(vege) return; vege = true; cancelAnimationFrame(raf); gomb.disabled = true;
      sav.classList.add(ok ? 'is-ok' : 'is-fail'); play(sav, ok ? 'pop' : 'shake');
      say(el, ok ? tr('Sikerült!') : tr('Most nem jött össze.')); if(o.onKesz) o.onKesz(ok); };
    const lep = (t) => { if(vege) return;
      p = L.pos(t - t0); jel.style.left = `calc(${(p * 100).toFixed(2)}% - 3px)`;
      if(L.lejart(t - t0)) return dont(false);
      raf = requestAnimationFrame(lep); };
    gomb.addEventListener('click', () => dont(L.talal(p)));
    raf = requestAnimationFrame(lep); setTimeout(() => gomb.focus({ preventScroll:true }), 30);
    return { stop(){ vege = true; cancelAnimationFrame(raf); } };
  }
  root.MechProba = Object.assign(root.MechProba || {}, { mount });
})(window);
