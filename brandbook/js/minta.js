/* beeco Brand Book – élő minta (iframe): a szülő oldal feloldott témáját veszi át.
   Ha a felületnek nincs sötét módja (body.nincs-sotet), világos marad – ez maga is információ. */
(function () {
  var d = document.documentElement;
  function alkalmaz(t) {
    if (document.body && document.body.classList.contains('nincs-sotet')) t = 'light';
    d.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  }
  var t = 'light';
  try { t = window.parent.document.documentElement.getAttribute('data-tema-kesz') || 'light'; } catch (e) { /* önállóan megnyitva */ }
  try { var q = new URLSearchParams(location.search).get('tema'); if (q) t = q; } catch (e) { /* régi böngésző */ }
  alkalmaz(t);
  document.addEventListener('DOMContentLoaded', function () { alkalmaz(t); });
  window.bbMintaTema = alkalmaz;
})();
