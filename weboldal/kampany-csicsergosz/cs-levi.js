/* Csicsergősz kampányoldal – Levi-változat viselkedése (csicsergosz-levi ág). A cs-kampany.js mellett fut.
   1. horgonycélok (miert, gyik)  2. letöltés-CTA: mobilon áruház, asztalon a záró blokk  3. Play-link listing-paraméter le
   4. hírlevél gombfelirat (a Webflow API nem írja a FormButton értékét) */
(function () {
  var d = document;
  function cel(sel, id) { var el = d.querySelector(sel); if (el && !el.id) el.id = id; }
  cel('.dia_ov_light.cs_horgony', 'miert');
  cel('.dia_kek_ov.cs_sotet', 'gyik');

  var ua = navigator.userAgent;
  var IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu';
  var PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app';
  var bolt = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? IOS : (/Android/i.test(ua) ? PLAY : '');
  if (bolt) [].forEach.call(d.querySelectorAll('[data-cs-letolt="store"]'), function (a) { a.href = bolt; a.target = '_blank'; a.rel = 'noopener'; });

  [].forEach.call(d.querySelectorAll('a[href*="play.google.com"]'), function (a) {
    try { var u = new URL(a.href); if (u.searchParams.has('listing')) { u.searchParams.delete('listing'); a.href = u.toString(); } } catch (e) {}
  });

  [].forEach.call(d.querySelectorAll('#fotofal input[type="submit"]'), function (b) { b.value = 'Feliratkozom a hírlevélre'; b.setAttribute('data-wait', 'Egy pillanat…'); });
})();
