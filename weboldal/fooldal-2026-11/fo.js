/* beeco.hu új főoldal (2026-11) – az oldal viselkedése. Forrás: weboldal/fooldal-2026-11/fo.js (nyilvános repó),
   jsDelivr-ről töltődik, commit-SHA-ra rögzítve. A jelölés natív Webflow-elem (.fo- osztályok), lásd epit.py.
   Tartalom: gombszerep a <a data-fo-gomb> elemeken, hero-váltó, funkcióváltók, számsor, vélemény-léptető,
   képnézegető, lenyitható logósorok, váltakozó kérdések, a navbar elbújása görgetéskor, mérés (dataLayer). */
(function () {
  'use strict';
  var d = document, w = window;
  var oldal = d.querySelector('.fo');
  if (!oldal) return;
  var rm = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  /* ---------- mérés: ugyanaz a dataLayer-forma, mint a régi főoldalon (beeco_* események) ---------- */
  w.dataLayer = w.dataLayer || [];
  function mer(esemeny, adat) { w.dataLayer.push(Object.assign({ event: 'beeco_' + esemeny }, adat || {})); }
  function kattMer(sel, esemeny, ertek) {
    $$(sel, oldal).forEach(function (a) { a.addEventListener('click', function () { mer(esemeny, ertek ? { ertek: ertek(a) } : {}); }); });
  }

  /* ---------- gombszerep: a Webflow-ban <a href="#">, a felolvasónak és a billentyűzetnek gomb ---------- */
  $$('[data-fo-gomb]', oldal).forEach(function (a) {
    a.setAttribute('role', 'button');
    a.addEventListener('click', function (e) { e.preventDefault(); });
    a.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); a.click(); } });
  });

  /* ---------- áruházgombok: UTM a hely szerint (a régi főoldal szerint) ---------- */
  var helyNev = function (el) { var s = el.closest('section,aside,[id]'); return (s && s.id) || 'ismeretlen'; };
  $$('a[href*="play.google.com"]', oldal).forEach(function (a) {
    a.href = 'https://play.google.com/store/apps/details?id=hu.beeco.app&referrer=' + encodeURIComponent('utm_source=beeco.hu&utm_medium=web&utm_campaign=fooldal&utm_content=' + helyNev(a));
  });
  $$('a[href*="apps.apple.com"]', oldal).forEach(function (a) {
    a.href = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu&ct=fooldal-' + helyNev(a);
  });

  /* ---------- hero: három haszon váltakozik, a telefon képe és a fekete címke követi ---------- */
  var hero = $('.fo-hero', oldal);
  if (hero) {
    var hb = $$('.fo-hb', hero), kepek = $$('#kepek img', hero), cimke = $('#cimke', hero);
    var H = [['Kuponok', 'helyi zöld partnerektől'], ['Lábnyom', 'kiszámolod és csökkented'], ['Zöld térkép', 'boltok, javítók, programok']];
    var KULCS = ['sporolas', 'labnyom', 'zold_helyek'], i0 = 0;
    var allit = function (i) {
      i0 = i;
      hb.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      kepek.forEach(function (im, j) { im.classList.toggle('fo-be', j === i); if (j === i) im.removeAttribute('aria-hidden'); else im.setAttribute('aria-hidden', 'true'); });
      if (!cimke) return;
      cimke.classList.add('fo-valt');
      setTimeout(function () {
        $('#cimke1', cimke).textContent = H[i][0];
        $('#cimke2', cimke).textContent = H[i][1];
        var ik = $('img', hb[i]), cel = $('.fo-cimke-ik img', cimke); if (ik && cel) cel.src = ik.src; // Webflow drops the id on images
        cimke.classList.remove('fo-valt');
      }, 180);
    };
    hb.forEach(function (b, j) {
      b.addEventListener('click', function () { hero.classList.add('fo-kezi'); allit(j); mer('funkcio_valasztas', { funkcio: KULCS[j], hely: 'hero' }); });
      var sav = $('.fo-sav', b);
      if (sav) sav.addEventListener('animationend', function () { if (!hero.classList.contains('fo-kezi')) allit((i0 + 1) % hb.length); });
    });
    if (rm) hero.classList.add('fo-kezi');
    var sz = $('#szunet', hero);
    if (sz) {
      sz.setAttribute('aria-pressed', 'false');
      sz.addEventListener('click', function () {
        var p = hero.classList.toggle('fo-all');
        oldal.classList.toggle('fo-all-mind', p);
        sz.setAttribute('aria-pressed', p ? 'true' : 'false');
        sz.setAttribute('aria-label', p ? 'A váltás folytatása' : 'A váltás megállítása');
      });
    }
    // dotted bee trail (decorative)
    var ns = 'http://www.w3.org/2000/svg', svg = d.createElementNS(ns, 'svg'), path = d.createElementNS(ns, 'path');
    svg.setAttribute('class', 'fo-nyom'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    path.setAttribute('d', 'M 86 13 C 96 30, 95 60, 88 78 S 66 91, 50 93');
    [['fill', 'none'], ['stroke', '#000'], ['stroke-width', '3'], ['stroke-linecap', 'round'], ['stroke-dasharray', '1 12'], ['vector-effect', 'non-scaling-stroke'], ['opacity', '.6']].forEach(function (p) { path.setAttribute(p[0], p[1]); });
    svg.appendChild(path);
    var hatter = $('.fo-hatter', hero); if (hatter) hatter.insertAdjacentElement('afterend', svg);
  }

  /* ---------- funkcióváltók (Megértés, Cselekvés, Jutalom): a gomb dönti el, mit mutat a telefon ---------- */
  $$('.fo-fv', oldal).forEach(function (fv) {
    var blokk = fv.closest('.fo-ketto'), kep = blokk ? $$('.fo-kep img.fo-tv', blokk) : [], bs = $$('.fo-fvb', fv);
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = +b.getAttribute('data-k');
        bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        kep.forEach(function (im, n) { im.classList.toggle('fo-be', n === k); if (n === k) im.removeAttribute('aria-hidden'); else im.setAttribute('aria-hidden', 'true'); });
        mer('funkcio_valasztas', { funkcio: ($('strong', b) || b).textContent.trim(), hely: helyNev(b) });
      });
    });
  });
  $$('.fo-lepesek a', oldal).forEach(function (a) {
    a.addEventListener('click', function () { mer('allomas_kattintas', { allomas: ($('strong', a) || a).textContent.trim() }); });
  });

  /* ---------- számsor: beúszó sorok és felpörgő számok, egyszer ---------- */
  var lista = $('#szamlista', oldal);
  if (lista && !rm && 'IntersectionObserver' in w) {
    if (lista.getBoundingClientRect().top > w.innerHeight) {
      lista.classList.add('fo-var');
      new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { o.disconnect(); lista.classList.remove('fo-var'); lista.classList.add('fo-lat'); } }, { threshold: 0.25 }).observe(lista);
    }
    var fmt = function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, n = +el.getAttribute('data-n'), u = el.getAttribute('data-u') || '', t0 = performance.now(), vege = el.textContent;
        (function lep(t) { var k = Math.min(1, (t - t0) / 900); k = 1 - Math.pow(1 - k, 3); el.textContent = k < 1 ? fmt(n * k) + u : vege; if (k < 1) requestAnimationFrame(lep); })(t0);
      });
    }, { threshold: 0.6 });
    $$('strong[data-n]', lista).forEach(function (b) { io.observe(b); });
  }

  /* ---------- vélemények: a nyilak egy kártyányit léptetnek ---------- */
  var vl = $('#vellista', oldal);
  if (vl) {
    var lep = function (n) { var li = $('li', vl); vl.scrollBy({ left: n * (li.offsetWidth + 16), behavior: rm ? 'auto' : 'smooth' }); };
    var vb = $('#velbal', oldal), vj = $('#veljobb', oldal);
    if (vb) vb.addEventListener('click', function () { lep(-1); });
    if (vj) vj.addEventListener('click', function () { lep(1); });
  }

  /* ---------- képnézegető a közösségfotókhoz (natív <dialog>, Esc zár, a fókusz visszatér) ---------- */
  var fotok = $$('#fotok .fo-polaroid', oldal);
  if (fotok.length) {
    var dlg = d.createElement('dialog');
    dlg.className = 'fo-nezo'; dlg.setAttribute('aria-label', 'Fényképnézegető');
    dlg.innerHTML = '<button type="button" class="fo-ngomb fo-nezo-zar" aria-label="Bezárás">✕</button><img class="fo-nezo-kep" src="" alt="">' +
      '<div class="fo-nezo-lab"><span class="fo-hol"></span><strong></strong><button type="button" class="fo-ngomb" aria-label="Előző kép">‹</button><button type="button" class="fo-ngomb" aria-label="Következő kép">›</button></div>';
    oldal.appendChild(dlg);
    var nk = $('.fo-nezo-kep', dlg), hol = $('.fo-hol', dlg), cim = $('.fo-nezo-lab strong', dlg), ng = $$('.fo-ngomb', dlg), ix = 0, honnan = null;
    var mutat = function (k) {
      ix = (k + fotok.length) % fotok.length;
      var g = fotok[ix], im = $('img', g);
      nk.src = im.currentSrc || im.src; nk.alt = im.alt;
      cim.textContent = ($('.fo-fc', g) || {}).textContent || '';
      hol.textContent = (ix + 1) + ' / ' + fotok.length;
    };
    fotok.forEach(function (g, k) {
      g.addEventListener('click', function () { honnan = g; mutat(k); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); mer('foto_nezo', { kep: k + 1 }); });
    });
    ng[0].addEventListener('click', function () { dlg.close(); });
    ng[1].addEventListener('click', function () { mutat(ix - 1); });
    ng[2].addEventListener('click', function () { mutat(ix + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') mutat(ix - 1); if (e.key === 'ArrowRight') mutat(ix + 1); });
    dlg.addEventListener('close', function () { if (honnan) honnan.focus(); });
  }

  /* ---------- logósorok: egy sor látszik, a többi gombra nyílik ---------- */
  $$('.fo-logosor', oldal).forEach(function (ul) {
    var li = $('.fo-logo-gomb', ul); if (!li) return;
    var b = $('.fo-logotobb', li);
    var rejtett = function () { var n = 0; [].forEach.call(ul.children, function (c) { if (c !== li && getComputedStyle(c).display === 'none') n++; }); return n; };
    var frissit = function () {
      var nyitva = ul.classList.contains('fo-nyitva');
      if (!nyitva) { var n = rejtett(); li.hidden = n === 0; b.textContent = '+' + n + ' további'; } else { b.textContent = 'Kevesebb'; }
      b.setAttribute('aria-expanded', nyitva ? 'true' : 'false');
    };
    b.addEventListener('click', function () { ul.classList.toggle('fo-nyitva'); frissit(); });
    frissit();
    if ('ResizeObserver' in w) new ResizeObserver(function () { if (!ul.classList.contains('fo-nyitva')) frissit(); }).observe(ul);
  });

  /* ---------- záró kérdések: a szünet gomb megállítja a gördülést, és mind a négy látszik ---------- */
  var kl = $('#kerdesek', oldal), kb = $('#kszunet', oldal);
  if (kl && kb) {
    kb.setAttribute('aria-pressed', 'false');
    kb.addEventListener('click', function () {
      var all = kl.classList.toggle('fo-gor') === false;
      kb.setAttribute('aria-pressed', all ? 'true' : 'false');
      kb.setAttribute('aria-label', all ? 'A kérdések váltakozásának folytatása' : 'A váltakozó kérdések megállítása');
    });
  }

  /* ---------- oldalspecifikus kattintásmérés (a régi főoldal eseménynevei) ---------- */
  kattMer('.fo-banner', 'most_fut_kattintas', function () { return 'csicsergosz'; });
  kattMer('.fo-logosor li:not(.fo-logo-gomb) a', 'logo_kattintas', function (a) { return ($('img', a) || {}).alt || ''; });
  kattMer('.fo-termek', 'beebolt_kattintas', function (a) { return ($('strong', a) || {}).textContent || ''; });
  kattMer('#beebolt .fo-gm', 'beebolt_kattintas', function () { return 'gomb'; });
  kattMer('.fo-koz-alul a', 'csapat_csatlakozas', function (a) { return a.textContent.trim(); });
  kattMer('.fo-ut', 'ut_valasztas', function (a) { return ($('strong', a) || {}).textContent || ''; });

  /* ---------- navbar (C · lebegő sáv): lefelé görgetve elbújik, felfelé visszajön ---------- */
  var menu = d.querySelector('.menu');
  if (menu) {
    var y = w.scrollY;
    w.addEventListener('scroll', function () {
      var n = w.scrollY, dd = n - y;
      if (Math.abs(dd) < 6) return;
      var nyitva = menu.querySelector('.w--open') || menu.contains(d.activeElement);
      if (dd > 0 && n > 160 && !nyitva) menu.classList.add('fo-rejt');
      else if (dd < 0 || n <= 160) menu.classList.remove('fo-rejt');
      y = n;
    }, { passive: true });
    menu.addEventListener('focusin', function () { menu.classList.remove('fo-rejt'); });
  }
})();
