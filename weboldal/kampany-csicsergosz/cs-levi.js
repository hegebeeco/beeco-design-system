/* Csicsergősz kampányoldal – Levi-változat viselkedése (csicsergosz-levi ág). A cs-kampany.js mellett fut.
   1. horgonycélok (miert, gyik)  2. letöltés-CTA: mobilon áruház, asztalon a záró blokk  3. Play-link listing-paraméter le
   4. hírlevél gombfelirat (a Webflow API nem írja a FormButton értékét) */
(function () {
  var d = document;
  function cel(sel, id) { var el = d.querySelector(sel); if (el && !el.id) el.id = id; }
  cel('.dia_ov_light.cs_horgony', 'miert');
  cel('.dia_kek_ov.cs_sotet', 'gyik');

  /* Oldalon belüli horgonyok („Nézd meg, hogyan segíthetsz”, kártyák): a görgetést mi végezzük. A Webflow saját sima
     görgetése és a site-szintű Trustindex (megállítja, majd 150 ms múlva újrakattint) együtt visszarántotta az oldalt
     oda, ahonnan a látogató jött. Ablakszinten, capture fázisban fogjuk el, a mérés (cs-meres.js) ennél korábban fut.
     Ha a cél elérése után 2 mp-en belül valami felhasználói mozdulat nélkül elviszi az oldalt, visszaállítjuk. */
  var csend = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, hUtolso = 0;
  function horgonyra(cel, id) {
    var nav = d.querySelector('.cs_fejlec, .navbar, nav.w-nav'), fent = nav && getComputedStyle(nav).position.match(/fixed|sticky/) ? nav.offsetHeight : 0;
    var y = Math.max(0, cel.getBoundingClientRect().top + scrollY - fent - 8), sajat = false;
    window.scrollTo({ top: y, behavior: csend ? 'auto' : 'smooth' });
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    var vege = Date.now() + 2600; function kez() { sajat = true; }
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, kez, { once: true, passive: true }); });
    [1300, 2100].forEach(function (ms) { setTimeout(function () { if (!sajat && Date.now() < vege && Math.abs(scrollY - y) > 160) window.scrollTo({ top: y, behavior: 'auto' }); }, ms); });
  }
  window.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="#"]'); if (!a || a.classList.contains('cs_kinek_gomb') || a.classList.contains('cs-utvonal_pont')) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1)), cel = id && d.getElementById(id); if (!cel) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var most = Date.now(); if (!e.isTrusted && most - hUtolso < 1200) return; hUtolso = most;
    horgonyra(cel, id);
  }, true);

  var ua = navigator.userAgent;
  var IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu';
  var PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app';
  var bolt = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? IOS : (/Android/i.test(ua) ? PLAY : '');
  if (bolt) [].forEach.call(d.querySelectorAll('[data-cs-letolt="store"]'), function (a) { a.href = bolt; a.target = '_blank'; a.rel = 'noopener'; });

  [].forEach.call(d.querySelectorAll('a[href*="play.google.com"]'), function (a) {
    try { var u = new URL(a.href); if (u.searchParams.has('listing')) { u.searchParams.delete('listing'); a.href = u.toString(); } } catch (e) {}
  });

  [].forEach.call(d.querySelectorAll('#fotofal input[type="submit"]'), function (b) { b.value = 'Feliratkozom a hírlevélre'; b.setAttribute('data-wait', 'Egy pillanat…'); });
  /* Az általános hírlevél-felugró ezen az oldalon nem jelenik meg: a később beszúrt, rögzített „Iratkozz fel” ablakot elrejtjük. */
  var felugro = /iratkozz fel|beeújság/i;
  function rejt(n) { if (n.nodeType === 1 && !n.closest('#fotofal') && getComputedStyle(n).position === 'fixed' && felugro.test(n.textContent || '')) n.setAttribute('data-cs-nincs-popup', ''); }
  new MutationObserver(function (m) { m.forEach(function (x) { [].forEach.call(x.addedNodes, rejt); }); }).observe(d.body, { childList: true, subtree: true });
  [].forEach.call(d.body.children, rejt);
})();
