/* beeco docs – téma a festés előtt (a <head>-ben, szinkron fut, hogy ne villanjon) + „van JS” jelzés.
   A választás: auto (rendszer szerint) · light · dark – localStorage „bb-tema”. data-theme: a DS ezt olvassa. */
(function () {
  var d = document.documentElement, v = 'auto';
  d.classList.remove('no-js'); d.classList.add('js');
  try { v = localStorage.getItem('bb-tema') || 'auto'; } catch (e) { /* privát mód: rendszer szerint */ }
  if (v !== 'light' && v !== 'dark') v = 'auto';
  d.setAttribute('data-theme', v);
  d.setAttribute('data-tema-valasztas', v);
})();
