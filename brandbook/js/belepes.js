/* beeco Brand Book – belépő oldal: hibaüzenet (?hiba=1) és visszatérési cím (?vissza=/…). Csak saját oldalra enged vissza. */
(function () {
  var q = new URLSearchParams(location.search);
  var vissza = q.get('vissza') || '/';
  if (!/^\/(?!\/)[^\s]*$/.test(vissza) || vissza.indexOf('/belepes') === 0) vissza = '/';
  var mezo = document.querySelector('[data-vissza]');
  if (mezo) mezo.value = vissza;
  if (q.get('hiba') === '1') {
    var h = document.querySelector('[data-hiba]'), j = document.getElementById('jelszo');
    if (h) h.hidden = false;
    if (j) { j.setAttribute('aria-invalid', 'true'); j.focus(); }
  }
})();
