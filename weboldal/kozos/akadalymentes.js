/* Közös akadálymentességi kiegészítés – az egész webhelyen fut (2026-11-02, élesítés előtti audit, UX-szakasz):
   - „Ugrás a tartalomra” link a menü előtt (csak billentyűfókuszra látszik);
   - a régi GYIK-lenyílók (.gyik_item .home-faq-top: /gyik, /letoltes és a régi oldalak) billentyűzettel is nyílnak,
     képernyőolvasónak gombként, nyitott/zárt állapottal; a Csatlakozz oldalon ezt a kk.js végzi, ott nem fut;
   - sötét, jól látható fókuszgyűrű az űrlapmezőkön (a sárga gyűrű krém alapon kb. 1,5:1 volt);
   - a felső hírsáv bezáró X-e billentyűzettel is működik (1.1.0). */
(function () {
  'use strict';
  var FOCUS = 'var(--_beeco-ds---bc-focus, #2656d9)';

  function style() {
    if (document.getElementById('beeco-a11y-css')) return;
    var s = document.createElement('style');
    s.id = 'beeco-a11y-css';
    s.textContent =
      '.beeco-ugras{position:absolute;left:16px;top:-80px;z-index:10000;padding:12px 18px;border:2px solid #000;border-radius:14px 4px;' +
      'background:var(--_beeco-ds---bc-accent,#fecf39);color:#000;font-weight:800;text-decoration:none}' +
      '.beeco-ugras:focus{top:12px;outline:3px solid ' + FOCUS + ';outline-offset:2px}' +
      'input:not([type=hidden]):focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid ' + FOCUS + ' !important;outline-offset:2px}' +
      '.gyik_item .home-faq-top:focus-visible,.brix---icon-small-hover:focus-visible{outline:3px solid ' + FOCUS + ';outline-offset:3px}';
    document.head.appendChild(s);
  }

  function skipLink() {
    if (document.querySelector('.beeco-ugras')) return;
    var target = document.querySelector('main, [role=main], body > section, section');
    if (!target) return;
    if (!target.id) target.id = 'tartalom';
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    var a = document.createElement('a');
    a.className = 'beeco-ugras';
    a.href = '#' + target.id;
    a.textContent = 'Ugrás a tartalomra';
    document.body.insertBefore(a, document.body.firstChild);
  }

  function faq() {
    if (document.querySelector('script[src*="/csatlakozz/kk.js"]')) return;
    var headers = document.querySelectorAll('.gyik_item .home-faq-top');
    for (var i = 0; i < headers.length; i++) (function (header) {
      if (header.hasAttribute('role')) return;
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');
      header.addEventListener('click', function () { header.setAttribute('aria-expanded', String(header.getAttribute('aria-expanded') !== 'true')); });
      header.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); header.click(); } });
    })(headers[i]);
  }

  // A felső sáv (brix top bar) bezáró X-e egy kép a kattintható div-ben: gombként, billentyűzettel is zárjon.
  function topBarClose() {
    var icons = document.querySelectorAll('.brix---top-bar-close-icon .brix---icon-small-hover');
    for (var i = 0; i < icons.length; i++) (function (icon) {
      if (icon.hasAttribute('role')) return;
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('aria-label', 'Sáv bezárása');
      icon.setAttribute('alt', '');
      icon.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); icon.click(); } });
    })(icons[i]);
  }

  function init() { style(); skipLink(); faq(); topBarClose(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
