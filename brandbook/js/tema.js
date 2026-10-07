/* beeco Brand Book – téma a festés előtt (a <head>-ben, szinkron fut, hogy ne villanjon).
   A választás: auto (rendszer szerint) · light · dark – localStorage „bb-tema”.
   data-theme: a DS ezt olvassa · data-tema-valasztas: a gomb ikonja · data-tema-kesz: a feloldott érték (a mintáknak). */
(function () {
  var d = document.documentElement, v = 'auto';
  try { v = localStorage.getItem('bb-tema') || 'auto'; } catch (e) { /* privát mód: marad a rendszer szerinti */ }
  if (v !== 'light' && v !== 'dark') v = 'auto';
  var sotet = v === 'dark' || (v === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  d.setAttribute('data-theme', v);
  d.setAttribute('data-tema-valasztas', v);
  d.setAttribute('data-tema-kesz', sotet ? 'dark' : 'light');
})();
