// ============================================================
//  BEVEZETŐ – „Hogyan játssz?” nyitókártya (2026-10-03, tesztelői visszajelzés: „az elején nem jó a szabályleírás, nincs is”,
//  „nincs elég eligazítás” – Élő kert, Méhesd élő hálózata)
//
//  Egy ablak: a cél egy mondatban + legfeljebb 3 szabály + „Kezdjük!”. Játékonként egyszer jön magától; a játék „?” gombja
//  (bevezetoGombHTML) bármikor újranyitja. A „már láttad” jelzés a DS.coach kulcs-családjában van (beeco_coach_bev_<játék>),
//  így a Beállítások „Bemutatók újra” gombja ezt is visszahozza – új eszköz-kulcs nem kell.
//  Ha a bevezető jön, az indító súgó (sugo.js) ugyanehhez a játékhoz kimarad: két egymás utáni magyarázat sok lenne.
//  Használat: bevezetoMutat({ jatek:'elokert', cim, cel, szabalyok:[…], utana:fn, kenyszer:false })
//  A cel és a szabalyok HTML-részletek (pl. <b>), a cim sima szöveg. Közös elem (beeco-design-system, 1.39.0): a pics.js, a ds.js
//  és az i18n.js után töltődjön; a játék saját súgója (sugo.js) és a kioszk (KIOSZK) nélkül is működik.
// ============================================================
const bevEsc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const bevEl = document.createElement('div');
bevEl.id = 'bevezeto'; bevEl.className = 'hidden';
bevEl.innerHTML = `<div class="ds-panel bevBox" role="dialog" aria-modal="true" aria-labelledby="bevCim"></div>`;
document.body.appendChild(bevEl);
let bevUtana = null;

const bevKulcs = jatek => 'bev_' + jatek;
const bevLatta = jatek => typeof DS !== 'undefined' && DS.coach && DS.coach.seen(bevKulcs(jatek));
function bevJelol(jatek){ try{ localStorage.setItem('beeco_coach_' + bevKulcs(jatek), '1'); localStorage.setItem('beeco_sugo_' + jatek, '1'); }catch(e){} }

// true: megjelent (a hívó ilyenkor ne mutasson mellé más tippet – az utana() fut a bezárás után)
function bevezetoMutat(o){
  if(!o || (!o.kenyszer && bevLatta(o.jatek)) || (typeof KIOSZK !== 'undefined' && KIOSZK && !o.kenyszer)) return false;
  bevJelol(o.jatek); bevUtana = o.utana || null;
  const box = bevEl.querySelector('.bevBox');
  box.innerHTML = `<button class="ds-icon-btn bevZar" type="button" data-ds-close data-bev="zar" aria-label="${tr('Bezárás')}">${pic('close')}</button>
    <div class="ds-say bevSay"><span class="ds-avatar is-bee" aria-hidden="true"><img src="${typeof dsMood === 'function' ? dsMood('help') : ''}" alt=""></span>
      <div><h2 id="bevCim" class="bevCim">${bevEsc(o.cim || tr('Hogyan játssz?'))}</h2>
      <p class="bevCel">${pic('star')}<span><b>${tr('A cél:')}</b> ${o.cel || ''}</span></p></div></div>
    <ol class="bevLepesek">${(o.szabalyok || []).slice(0, 3).map((s, i) => `<li><span class="bevN">${i + 1}</span><span>${s}</span></li>`).join('')}</ol>
    <button class="ds-btn is-block bevIndul" type="button" data-bev="zar">${tr('Kezdjük!')} ${pic('play')}</button>`;
  bevEl.classList.remove('hidden');
  if(typeof DS !== 'undefined' && DS.motion && !(typeof reduceMotion !== 'undefined' && reduceMotion)) DS.motion.play(box, 'in');
  setTimeout(() => { const b = box.querySelector('.bevIndul'); if(b) b.focus({ preventScroll:true }); }, 30);
  return true;
}
function bevezetoZar(){
  if(bevEl.classList.contains('hidden')) return;
  bevEl.classList.add('hidden'); const f = bevUtana; bevUtana = null; if(f) f();
}
const bevezetoNyitva = () => !bevEl.classList.contains('hidden');
// a játék fejlécébe tehető „?” gomb (a játék saját kattintás-kezelője hívja a bevezetoMutat-ot kenyszer:true-val)
const bevezetoGombHTML = attr => `<button class="ds-icon-btn bevGomb" type="button" ${attr} aria-label="${tr('Hogyan játssz?')}" title="${tr('Hogyan játssz?')}">${pic('info')}</button>`;

bevEl.addEventListener('click', e => { e.stopPropagation(); if(e.target === bevEl || e.target.closest('[data-bev="zar"]')) bevezetoZar(); });
addEventListener('keydown', e => { if(e.key === 'Escape' && bevezetoNyitva()){ e.preventDefault(); e.stopImmediatePropagation(); bevezetoZar(); } }, true);
