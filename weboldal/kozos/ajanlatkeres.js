/* DS · Ajánlatkérés űrlap (#ajanlatkeres-urlap) kiegészítése – az egész webhelyen fut, űrlap nélkül nem csinál semmit.
   2026-11-02 (élesítés előtti audit):
   - sikeres küldéskor generate_lead esemény a GA4-be (a Webflow köszönő blokkja, .w-form-done megjelenésekor);
     a meglévő b2b_urlap esemény a beküldési kísérletet méri, ez a tényleges leadet;
   - rejtett mezők a forráshoz: forras_oldal, hivatkozo (külső referrer), utm_source/medium/campaign
     (a munkamenetben megőrizve, ha a látogató több oldalon át jut el az űrlapig); személyes adatot nem tárol;
   - a „Miben segíthetünk?” mező előválasztása az oldal alapján (ha a látogató még nem választott). */
(function () {
  'use strict';
  function indit() {
    var f = document.getElementById('ajanlatkeres-urlap');
    if (!f || f.dataset.forras) return;
    f.dataset.forras = '1';
    var oldal = location.pathname.split('/').filter(Boolean).pop() || 'fooldal';
    function mer(nev, adat) {
      adat.b2b_oldal = oldal;
      if (typeof window.gtag === 'function') window.gtag('event', nev, adat);
      else (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: nev }, adat));
    }

    var q = new URLSearchParams(location.search), mezok = { forras_oldal: location.pathname };
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (n) {
      var v = q.get(n);
      try { if (v) sessionStorage.setItem('b2b_' + n, v); else v = sessionStorage.getItem('b2b_' + n); } catch (x) {}
      if (v) mezok[n] = v;
    });
    try {
      var r = sessionStorage.getItem('b2b_hivatkozo');
      if (r === null) { r = document.referrer && document.referrer.indexOf(location.host) < 0 ? document.referrer : ''; sessionStorage.setItem('b2b_hivatkozo', r); }
      if (r) mezok.hivatkozo = r;
    } catch (x) {}
    Object.keys(mezok).forEach(function (n) {
      var i = f.querySelector('input[name="' + n + '"]');
      if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = n; f.appendChild(i); }
      i.value = mezok[n];
    });

    // az opciók szövegének eleje (a feliratok hosszabbak, pl. „Locsolóraj csapatnap”)
    var TERMEK = { locsoloraj: 'Locsolóraj', madarraj: 'Madárraj', 'beeco-at-work': 'beeco@work', onkormanyzatoknak: 'Önkormányzati program', partner: 'Partnerprogram', 'zold-marketing': 'Zöld marketing' };
    var alap = oldal.replace(/-draft$/, ''), valaszto = f.querySelector('select[name=termek]');
    var cel = TERMEK[alap] || (/klimafresko|3d-zold|kezmuves|kviz|csere-bere|eloadas|zold-esemeny/.test(alap) ? 'Zöld céges program' : '');
    if (valaszto && cel && !valaszto.value) {
      for (var j = 0; j < valaszto.options.length; j++) {
        if (valaszto.options[j].text.trim().indexOf(cel) === 0) { valaszto.selectedIndex = j; break; }
      }
    }

    var doboz = f.closest('.w-form'), kesz = doboz && doboz.querySelector('.w-form-done');
    if (kesz) new MutationObserver(function () {
      if (kesz.style.display && kesz.style.display !== 'none' && !kesz.dataset.mert) {
        kesz.dataset.mert = '1';
        mer('generate_lead', { b2b_termek: valaszto ? valaszto.value : '' });
      }
    }).observe(kesz, { attributes: true, attributeFilter: ['style'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', indit); else indit();
})();
