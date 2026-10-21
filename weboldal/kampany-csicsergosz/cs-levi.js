/* Csicsergősz kampányoldal – Levi-változat viselkedése (csicsergosz-levi ág). A cs-kampany.js mellett fut.
   1. horgonycélok (miert, gyik); a horgonykattintást a fejléc-kód kezeli  2. letöltés-CTA: mobilon áruház, asztalon a záró blokk  3. Play-link listing-paraméter le
   4. hírlevél gombfelirat (a Webflow API nem írja a FormButton értékét) */
(function () {
  var d = document;
  function cel(sel, id) { var el = d.querySelector(sel); if (el && !el.id) el.id = id; }
  cel('.dia_ov_light.cs_horgony', 'miert');
  cel('.dia_kek_ov.cs_sotet', 'gyik');

  /* Oldalon belüli horgonyok: a kezelő a lap fejléc-kódjában fut (fej/horgony.js), hogy a szkriptek
     megérkezése előtt is működjön. Különben a korai kattintás böngésző-előzményt írt, és a Mac trackpad
     „Vissza” mozdulata a gombhoz dobta vissza a látogatót. */

  var ua = navigator.userAgent;
  var IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu';
  var PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app';
  var bolt = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? IOS : (/Android/i.test(ua) ? PLAY : '');
  if (bolt) [].forEach.call(d.querySelectorAll('[data-cs-letolt="store"]'), function (a) { a.href = bolt; a.target = '_blank'; a.rel = 'noopener'; });

  [].forEach.call(d.querySelectorAll('a[href*="play.google.com"]'), function (a) {
    try { var u = new URL(a.href); if (u.searchParams.has('listing')) { u.searchParams.delete('listing'); a.href = u.toString(); } } catch (e) {}
  });

  [].forEach.call(d.querySelectorAll('#fotofal input[type="submit"]'), function (b) { b.value = 'Feliratkozom'; b.setAttribute('data-wait', 'Egy pillanat…'); });
  /* Az általános hírlevél-felugró ezen az oldalon nem jelenik meg: a később beszúrt, rögzített „Iratkozz fel” ablakot elrejtjük. */
  var felugro = /iratkozz fel|beeújság/i;
  function rejt(n) { if (n.nodeType === 1 && !n.closest('#fotofal') && getComputedStyle(n).position === 'fixed' && felugro.test(n.textContent || '')) n.setAttribute('data-cs-nincs-popup', ''); }
  new MutationObserver(function (m) { m.forEach(function (x) { [].forEach.call(x.addedNodes, rejt); }); }).observe(d.body, { childList: true, subtree: true });
  [].forEach.call(d.body.children, rejt);
})();
