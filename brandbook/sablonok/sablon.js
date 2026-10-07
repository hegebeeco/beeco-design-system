/* beeco SABLON – a lap illesztése az ablakhoz, szerkeszthető szövegek, nyomtatás (Mentés PDF-ként).
   • Önállóan megnyitva: a [data-szerk] szövegek kattintásra átírhatók; a „Nyomtatás / PDF” gomb a böngésző nyomtatását nyitja.
   • Keretben (a brand book előnézete) vagy ?elonezet: csak a lap látszik, nem szerkeszthető; ?lap=2 → csak a 2. lap.
   • Nyomtatáskor a sablon.css a kimeneti méretre nagyít – a képernyős illesztés ott nem számít.
   Szöveget nem ír a DOM-ba; JavaScript nélkül is olvasható (csak nem illeszkedik az ablakhoz). */
(function () {
  'use strict';
  var d = document.documentElement;
  var q = null; try { q = new URLSearchParams(location.search); } catch (e) { /* régi böngésző */ }
  var keretben = false; try { keretben = window.self !== window.top; } catch (e) { keretben = true; }
  var elonezet = keretben || !!(q && q.has('elonezet'));
  if (elonezet) d.classList.add('is-elonezet');

  var helyek = Array.prototype.slice.call(document.querySelectorAll('.sb-hely'));
  var n = q ? parseInt(q.get('lap') || '0', 10) : 0;
  if (n > 0 && n <= helyek.length) helyek.forEach(function (h, i) { h.hidden = i !== n - 1; });

  if (!elonezet) Array.prototype.forEach.call(document.querySelectorAll('[data-szerk]'), function (e) { e.contentEditable = 'true'; });

  function illeszt() {
    var lathato = helyek.filter(function (h) { return !h.hidden; });
    if (!lathato.length) return;
    var lap0 = lathato[0].querySelector('.sb-lap'), dw = lap0.offsetWidth, dh = lap0.offsetHeight;
    var tarto = document.querySelector('.sb-lapok'), cs = getComputedStyle(tarto);
    var px = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), py = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    var fej = document.querySelector('.sb-sugo'), fh = fej && !elonezet ? fej.offsetHeight : 0;
    var k = Math.min((d.clientWidth - px) / dw, (window.innerHeight - fh - py) / dh);
    if (!isFinite(k) || k <= 0) k = 1;
    lathato.forEach(function (h) {
      var lap = h.querySelector('.sb-lap');
      lap.style.transform = 'scale(' + k + ')';
      h.style.width = (dw * k) + 'px'; h.style.height = (dh * k) + 'px';
    });
  }
  illeszt();
  window.addEventListener('resize', illeszt);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(illeszt);

  var gomb = document.querySelector('[data-nyomtat]');
  if (gomb) gomb.addEventListener('click', function () { window.print(); });
})();
