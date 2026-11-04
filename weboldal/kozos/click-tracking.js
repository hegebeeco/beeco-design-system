// beecokapcsolatmeres 1.1.0 – kattintásmérés GA4-be (Webflow site-szintű regisztrált szkript, lábléc).
// Csak azt méri, amit a site-kód többi része nem: a „beeco 3/5” (áruházgombok, app_store_click) és
// a „beeco 5/5” (belső link, letöltés-gomb: internal_link_click, download_cta_click) mellett.
//   contact_click  – tel: / mailto:
//   social_click   – közösségi oldalak
//   outbound_click – minden más külső oldal (sajtó, partner)
//   menu_click     – belső link a menüben vagy a láblécben (az 5/5 ezeket szándékosan kihagyja)
//   anchor_click   – oldalon belüli horgony (pl. „Érdekel!”, évszám-ugrók)
// A data-kk-cta (beecokkmeres) gombokat és az áruház-/letöltéslinkeket békén hagyja, így nincs kettős esemény.
// `click` eseményre figyel (a billentyűzetes Enter is ezt váltja ki); 600 ms-en belüli ismétlést eldob.
// A site-szkriptek listájában a beecohorgonyv31 ELŐTT kell lennie: a horgonyszkript a window capture
// fázisában stopImmediatePropagation-nel leállítja a horgonykattintást, utána regisztrálva nem látnánk.
(function () {
  var w = window;
  if (w._bkm) return;
  w._bkm = 1;
  function send(name, params) {
    params.page_type = location.pathname.split('/')[1] || 'fooldal';
    if (typeof w.gtag == 'function') w.gtag('event', name, params);
    else (w.dataLayer = w.dataLayer || []).push(Object.assign({ event: name }, params));
  }
  var SOCIAL = /(^|\.)(instagram|facebook|tiktok|linkedin|youtube)\.com$/i;
  var STORE = /(^|\.)(play\.google\.com|apps\.apple\.com)$/i;
  var DOWNLOAD = /^\/letoltes\/?$/;
  var SKIP_BLOCK = '.hol_lista,.kapcsolodo_chipek,.gyumi_text_blokk,.w-richtext';
  var last = new WeakMap();
  // ugyanaz a menü/lábléc-felismerés, mint az 5/5-ben, különben egy link kétszer számolódna
  function blockOf(a) {
    if (a.closest('nav,.w-nav,header')) return 'menu';
    if (a.closest('footer,.footer')) return 'lablec';
    return 'tartalom';
  }
  w.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('data-kk-cta') || a.hasAttribute('data-beeco-orig')) return;
    var t = Date.now();
    if (t - (last.get(a) || 0) < 600) return;
    last.set(a, t);
    var href = a.getAttribute('href') || '';
    var text = (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    var block = blockOf(a);
    if (/^tel:/i.test(href)) return send('contact_click', { method: 'telefon', network: '', link_text: text, block: block });
    if (/^mailto:/i.test(href)) return send('contact_click', { method: 'email', network: '', link_text: text, block: block });
    var u;
    try { u = new URL(href, location.href); } catch (x) { return; }
    var host = u.hostname.replace(/^www\./, '');
    var here = location.hostname.replace(/^www\./, '');
    if (host != here) {
      if (STORE.test(host)) return;
      if (SOCIAL.test(host)) return send('social_click', { method: 'social', network: host, link_text: text, block: block });
      return send('outbound_click', { link_domain: host, link_url: (host + u.pathname).slice(0, 100), link_text: text, block: block });
    }
    if (u.pathname == location.pathname) {
      if (u.hash) send('anchor_click', { anchor: u.hash.slice(0, 40), link_text: text, block: block });
      return;
    }
    if (block != 'tartalom' && !DOWNLOAD.test(u.pathname) && !a.closest(SKIP_BLOCK)) send('menu_click', { link_url: u.pathname, link_text: text, block: block });
  }, true);
})();
