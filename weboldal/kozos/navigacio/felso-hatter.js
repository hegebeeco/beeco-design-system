/* beecoFelsoHatter 1.0.0 (2026-11-26): a lebegő menüsáv (C) alatti sáv színe = az első szekció színe.
   Miért: a törzs 70 px-es felső margója (60 px telefonon) a régi fix navbart kompenzálta; a margóban a törzs krémszíne látszott,
   és az első szekció más színű volt, ezért „megtört” az oldal teteje.
   Hogyan: csak a margó helyét festi (fix, z-index -1 pszeudo-elem, a tartalom mögött); a törzs hátteréhez nem nyúl.
   Ha az első szekció háttere kép vagy átlátszó, nem csinál semmit (a régi nézet marad). Nincs hálózat, nincs tárolás. */
(function () {
  var d = document, r = d.documentElement, b = d.body;
  if (!b) return;
  var st = d.createElement('style');
  st.textContent = 'html::before{content:"";position:fixed;top:0;left:0;right:0;height:var(--bn-m,0px);background:var(--bn-top,transparent);z-index:-1;pointer-events:none}';
  d.head.appendChild(st);
  function opaque(c) { return c && c !== 'transparent' && !/rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)/.test(c); }
  function pick(el, y) {
    var c = opaque(getComputedStyle(el).backgroundColor) ? getComputedStyle(el).backgroundColor : '';
    for (var i = 0; i < el.children.length; i++) {
      var k = el.children[i];
      if (/^(SCRIPT|STYLE|LINK)$/.test(k.tagName)) continue;
      var q = k.getBoundingClientRect(), t = q.top + scrollY;
      if (t <= y && q.bottom + scrollY > y && getComputedStyle(k).position !== 'fixed') {
        var cc = pick(k, y);
        if (cc) c = cc;
        break;
      }
    }
    return c;
  }
  function frissit() {
    var m = parseFloat(getComputedStyle(b).marginTop) || 0;
    if (m < 1) { r.style.removeProperty('--bn-top'); r.style.removeProperty('--bn-m'); return; }
    var c = pick(b, m + 6);
    if (c && c !== getComputedStyle(b).backgroundColor) { r.style.setProperty('--bn-top', c); r.style.setProperty('--bn-m', m + 'px'); }
    else { r.style.removeProperty('--bn-top'); r.style.removeProperty('--bn-m'); }
  }
  var t;
  function k() { clearTimeout(t); t = setTimeout(frissit, 120); }
  frissit();
  addEventListener('load', frissit);
  addEventListener('resize', k);
})();
