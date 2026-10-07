/* CsicsergŐsz kampányoldal – viselkedés (v1.50). Párja: cs-kampany.css.
   Részek: 1. „Hogyan segítheted” fülek  2. süvöltő a fülek panelén  3. hero: madarak beszállnak az appba
   4. megfigyelés: jövő-menő madarak  5. záró jelenet görgetésre (iszik, csipeget, odúba száll)  6. interaktív háttér
   7. mobilos ragadós letöltősáv.
   Mozgás: egyszeri belépések ease-out görbével; a megfigyelés-szekció köre csak látható állapotban fut;
   csökkentett mozgásnál minden madár a helyén ül, nincs repülés. */
(function () {
  var d = document, w = window;
  var csend = w.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/';
  var MADAR = {
    rigo: CDN + '6ac3fb2067d7d4578e5a20bd_cs-madar-rigo.webp',
    vereb: CDN + '6ac3fb209baf5ef3d995e00b_cs-madar-vereb.webp',
    suvolto: CDN + '6ac3fb20cb484786aec7e6fa_cs-madar-suvolto.webp'
  };
  var KELLEK = {
    itato: CDN + '6ac627b278c620e82f2a729b_cs-ikon-madaritato.webp',
    eteto: CDN + '6ac627b22cdd12e88746143c_cs-ikon-madareteto.webp',
    odu: CDN + '6ac627b356f443adf909d48c_cs-ikon-madarodu.webp'
  };
  function kuld(n, p) { if (typeof w.gtag === 'function') w.gtag('event', n, p || {}); }
  function latszik(el, fn, kuszob, folyamatos) {
    if (!('IntersectionObserver' in w)) { fn(true); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting || folyamatos) { if (!folyamatos) io.disconnect(); fn(x.isIntersecting); } }); }, { threshold: kuszob || 0.3 });
    io.observe(el);
  }
  /* Madár-elem: a csomagoló (.cs-m) a pozíció és a tükrözés, a kép (img) a mozgás. */
  function madar(faj, osztaly, tukor) {
    var m = d.createElement('div');
    m.className = 'cs-m ' + (osztaly || '') + (tukor ? ' cs-m--tukor' : '');
    m.setAttribute('aria-hidden', 'true');
    m.innerHTML = '<img src="' + MADAR[faj] + '" alt="" width="500" height="470" decoding="async">';
    return m;
  }
  function relativ(el, alap) { var a = alap.getBoundingClientRect(), b = el.getBoundingClientRect(); return { x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height }; }
  function hely(m, x, y, szel) { m.style.left = Math.round(x) + 'px'; m.style.top = Math.round(y) + 'px'; m.style.width = Math.round(szel) + 'px'; }
  function repul(m, honnan, utana) {
    /* honnan: [dx, dy] a végső helyhez képest (px). Az animáció a transzformot az img-n viszi, a csomagoló áll. */
    var img = m.firstChild;
    if (csend) { m.classList.add('cs-m--ul'); if (utana) utana(); return; }
    var tk = m.classList.contains('cs-m--tukor') ? -1 : 1; /* a tükrözött csomagolóban az x irány megfordul */
    img.style.setProperty('--dx', honnan[0] * tk + 'px'); img.style.setProperty('--dy', honnan[1] + 'px');
    m.classList.add('cs-m--repul');
    img.addEventListener('animationend', function vege() { img.removeEventListener('animationend', vege); m.classList.remove('cs-m--repul'); m.classList.add('cs-m--ul'); if (utana) utana(); });
  }
  function elrepul(m, hova, utana) {
    var img = m.firstChild;
    if (csend) { m.remove(); if (utana) utana(); return; }
    var tk = m.classList.contains('cs-m--tukor') ? -1 : 1;
    img.style.setProperty('--dx', hova[0] * tk + 'px'); img.style.setProperty('--dy', hova[1] + 'px');
    m.classList.add('cs-m--el');
    img.addEventListener('animationend', function vege() { img.removeEventListener('animationend', vege); m.remove(); if (utana) utana(); });
  }
  function akcio(m, nev, ms) { m.classList.add('cs-m--' + nev); if (ms) setTimeout(function () { m.classList.remove('cs-m--' + nev); }, ms); }

  /* 1. „Hogyan segítheted” fülek. JS nélkül minden panel látszik. ?neked=ceg|onkormanyzat|iskola|civil */
  (function () {
    var G = [].slice.call(d.querySelectorAll('.cs_kinek_gomb')); if (!G.length) return;
    function k(g) { return g.getAttribute('href').replace('#kinek-', ''); }
    var P = G.map(function (g) { return d.getElementById('kinek-' + k(g)); }), sor = G[0].parentElement, akt = -1;
    sor.setAttribute('role', 'tablist'); sor.setAttribute('aria-label', 'Kinek szól');
    G.forEach(function (g, i) { var p = P[i]; g.id = 'kinek-ful-' + k(g); g.setAttribute('role', 'tab'); if (p) { g.setAttribute('aria-controls', p.id); p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', g.id); p.tabIndex = 0; } });
    function val(i, f, m) {
      if (i !== akt) { akt = i; G.forEach(function (g, j) { var on = i === j; g.setAttribute('aria-selected', on ? 'true' : 'false'); g.tabIndex = on ? 0 : -1; if (P[j]) P[j].hidden = !on; }); if (m) kuld('campaign_audience_select', { audience: k(G[i]) }); d.dispatchEvent(new CustomEvent('cs:kinek', { detail: P[i] })); }
      if (f) G[i].focus();
    }
    var ut = 0;
    w.addEventListener('click', function (e) {
      var t = e.target; if (!t || !t.closest) return;
      var g = t.closest('.cs_kinek_gomb'); if (g) { e.preventDefault(); val(G.indexOf(g), false, true); return; }
      var a = t.closest('a[data-cs-csatlakozas]'); if (a) { var n = Date.now(); if (n - ut < 600) return; ut = n; kuld('campaign_join_click', { audience: a.getAttribute('data-cs-csatlakozas'), channel: a.href.indexOf('mailto:') ? 'pdf' : 'email' }); }
    }, true);
    sor.addEventListener('keydown', function (e) {
      var i = G.indexOf(d.activeElement); if (i < 0) return; var h = G.length, n = null, c = e.key;
      if (c === 'ArrowRight' || c === 'ArrowDown') n = (i + 1) % h; else if (c === 'ArrowLeft' || c === 'ArrowUp') n = (i - 1 + h) % h; else if (c === 'Home') n = 0; else if (c === 'End') n = h - 1; else if (c === ' ') n = i;
      if (n !== null) { e.preventDefault(); val(n, true, true); }
    });
    var q = (new URLSearchParams(location.search).get('neked') || '').toLowerCase(), s = 0, talalt = false;
    G.forEach(function (g, i) { if (k(g) === q) { s = i; talalt = true; } });
    val(s, false, false);
    if (talalt) { var sz = d.getElementById('segits'); if (sz) setTimeout(function () { sz.scrollIntoView(); }, 300); }
  })();

  /* 2. Süvöltő a „Hogyan segítheted” panel szélén: koppintásra ugrik és mesél; fülváltáskor átül. */
  (function () {
    function panel() { return d.querySelector('.cs_kinek_panel:not([hidden])'); }
    var p = panel(); if (!p) return;
    var h = d.createElement('div'); h.className = 'cs-mh cs-mh--suvolto';
    h.innerHTML = '<button type="button" class="cs-madar" aria-label="Süvöltő, koppints rám"><img src="' + MADAR.suvolto + '" alt=""></button><span class="cs-mb" role="status"></span>';
    p.appendChild(h);
    var b = h.firstChild, u = h.lastChild, t;
    function mut(x, ms) { u.innerHTML = x; u.classList.add('cs-lat'); clearTimeout(t); t = setTimeout(function () { u.classList.remove('cs-lat'); }, ms); }
    b.addEventListener('click', function () {
      b.classList.remove('cs-ugrik'); void b.offsetWidth; b.classList.add('cs-ugrik');
      mut('<b>Süvöltő</b>Télen a kertekbe is bejárok, a magvakat és a bogyókat szeretem. Az appban felismersz és a Madár albumodba gyűjtesz.', 7000);
      kuld('campaign_bird_tap', { bird: 'suvolto' });
    });
    latszik(p, function () { b.classList.add('cs-repul'); setTimeout(function () { b.classList.add('cs-leszallt'); mut('Csip! Koppints rám!', 2600); }, csend ? 250 : 950); }, 0.35);
    d.addEventListener('cs:kinek', function (e) { if (e.detail && h.parentNode !== e.detail) e.detail.appendChild(h); });
  })();

  /* 3. Hero: egy veréb rászáll a telefonra, egy süvöltő „beszáll az appba”, és a képernyőn felvillan: új madár az albumban. */
  (function () {
    var mock = d.querySelector('.dia_kek_ov.cs .cs_mockup'), tel = mock && mock.querySelector('.cs_mockup_telefon'); if (!tel) return;
    function indit() {
      var r = relativ(tel, mock); if (!r.w) return;
      var a = madar('vereb', 'cs-hm1'), b = madar('suvolto', 'cs-hm2');
      var sw = r.w * 0.34;
      hely(a, r.x + r.w * 0.56, r.y - sw * 0.82, sw);
      hely(b, r.x + r.w * 0.36, r.y + r.h * 0.40, sw * 0.95);
      var toast = d.createElement('div'); toast.className = 'cs-hm-uzenet'; toast.setAttribute('role', 'status');
      toast.style.left = Math.round(r.x + r.w * 0.1) + 'px'; toast.style.width = Math.round(r.w * 0.8) + 'px'; toast.style.top = Math.round(r.y + r.h * 0.62) + 'px';
      mock.appendChild(a); mock.appendChild(b); mock.appendChild(toast);
      repul(a, [260, -200]);
      setTimeout(function () {
        repul(b, [320, -220], function () {
          if (csend) { b.remove(); } else { akcio(b, 'beszall'); b.firstChild.addEventListener('animationend', function () { b.remove(); }, { once: true }); }
          setTimeout(function () { toast.textContent = 'Új madár a Madár albumodban: süvöltő!'; toast.classList.add('cs-lat'); setTimeout(function () { toast.classList.remove('cs-lat'); }, 3200); }, csend ? 0 : 420);
        });
      }, csend ? 0 : 650);
    }
    if (tel.complete && tel.naturalWidth) setTimeout(indit, 500); else tel.addEventListener('load', function () { setTimeout(indit, 300); }, { once: true });
  })();

  /* 4. Megfigyelés: madarak szállingóznak az app-folyamat képhez: berepülnek, csipegetnek, elrepülnek. Csak látható állapotban fut. */
  (function () {
    var kep = d.querySelector('#HOWTO .cs_folyamat_kep'), dob = kep && kep.parentElement; if (!dob) return;
    dob.classList.add('cs-m-szinpad');
    var fajok = ['vereb', 'rigo', 'suvolto'], fut = false, idozito = null, sorszam = 0;
    function helyek() {
      var r = relativ(kep, dob), sw = Math.max(54, Math.min(96, r.w * 0.3));
      return [
        { x: r.x + r.w * 0.62, y: r.y - sw * 0.8, s: sw, t: false, be: [260, -160], ki: [300, -240] },
        { x: r.x - sw * 0.55, y: r.y + r.h * 0.42, s: sw * 0.9, t: true, be: [-260, -120], ki: [-300, -220] },
        { x: r.x + r.w * 0.05, y: r.y - sw * 0.78, s: sw * 0.85, t: true, be: [-220, -200], ki: [-260, -260] }
      ];
    }
    function kor() {
      if (!fut) return;
      var hs = helyek(), hl = hs[sorszam % hs.length], faj = fajok[sorszam % fajok.length]; sorszam++;
      var m = madar(faj, 'cs-fm', hl.t); hely(m, hl.x, hl.y, hl.s); dob.appendChild(m);
      repul(m, hl.be, function () {
        setTimeout(function () { akcio(m, 'csipeget', 900); }, 500);
        idozito = setTimeout(function () { elrepul(m, hl.ki, function () { idozito = setTimeout(kor, 700); }); }, 2600);
      });
    }
    if (csend) { var hs = helyek(), m = madar('vereb', 'cs-fm'); hely(m, hs[0].x, hs[0].y, hs[0].s); m.classList.add('cs-m--ul'); dob.appendChild(m); return; }
    latszik(dob, function (lat) { if (lat && !fut) { fut = true; kor(); } else if (!lat) { fut = false; clearTimeout(idozito); } }, 0.2, true);
  })();

  /* 5. Záró jelenet: ahogy a látogató legörget, egyre több madár repül az app elé: iszik, csipeget, rászáll, odúba bújik. */
  (function () {
    var szek = d.getElementById('download'), mock = szek && szek.querySelector('.cs_mockup'), tel = mock && mock.querySelector('.cs_mockup_telefon'); if (!tel) return;
    var kesz = false, kellekek = {}, lepesek;
    function epit() {
      var r = relativ(tel, mock); if (!r.w) return false;
      var k = r.w * 0.42, mw = mock.clientWidth;
      function sz(x, meret) { return Math.max(4, Math.min(mw - meret - 4, x)); } /* a kellék a képben marad */
      function kell(nev, x, y, sz_) { var i = d.createElement('img'); i.className = 'cs-kellek cs-kellek--' + nev; i.src = KELLEK[nev]; i.alt = ''; i.setAttribute('aria-hidden', 'true'); i.style.left = Math.round(x) + 'px'; i.style.top = Math.round(y) + 'px'; i.style.width = Math.round(sz_) + 'px'; mock.appendChild(i); kellekek[nev] = { x: x, y: y, s: sz_ }; }
      kell('odu', sz(r.x + r.w + k * 0.15, k * 0.8), r.y - k * 0.1, k * 0.8);
      kell('itato', sz(r.x + r.w + k * 0.1, k), r.y + r.h - k * 0.95, k);
      kell('eteto', sz(r.x - k * 1.15, k), r.y + r.h * 0.18, k);
      var sw = r.w * 0.3;
      lepesek = [
        { faj: 'rigo', t: false, x: kellekek.itato.x + k * 0.18, y: kellekek.itato.y - sw * 0.62, s: sw, be: [300, -220], utana: function (m) { akcio(m, 'iszik'); } },
        { faj: 'vereb', t: true, x: kellekek.eteto.x + k * 0.12, y: kellekek.eteto.y - sw * 0.7, s: sw * 0.9, be: [-300, -200], utana: function (m) { akcio(m, 'csipeget'); } },
        { faj: 'suvolto', t: false, x: r.x + r.w * 0.3, y: r.y - sw * 0.8, s: sw * 0.95, be: [120, -320], utana: function () {} },
        { faj: 'vereb', t: false, x: kellekek.odu.x + kellekek.odu.s * 0.05, y: kellekek.odu.y + kellekek.odu.s * 0.05, s: sw * 0.8, be: [260, -280], utana: function (m) { setTimeout(function () { if (csend) { m.remove(); return; } akcio(m, 'oduba'); m.firstChild.addEventListener('animationend', function () { m.remove(); }, { once: true }); }, 700); } }
      ];
      return true;
    }
    var kovetkezo = 0, figyel = false;
    function lep() {
      if (!lepesek) return;
      var r = szek.getBoundingClientRect(), vh = w.innerHeight || 800;
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.55 + r.height * 0.35)));
      var kuszob = [0.18, 0.4, 0.62, 0.84];
      while (kovetkezo < lepesek.length && p >= kuszob[kovetkezo]) {
        var l = lepesek[kovetkezo++], m = madar(l.faj, 'cs-zm', l.t); hely(m, l.x, l.y, l.s); mock.appendChild(m);
        (function (m, l) { repul(m, l.be, function () { l.utana(m); }); })(m, l);
        if (kovetkezo === lepesek.length) { w.removeEventListener('scroll', onScroll); kuld('campaign_bird_scene', { done: true }); }
      }
    }
    var raf = 0; function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; lep(); }); }
    latszik(szek, function () {
      setTimeout(function () {
        if (!kesz) kesz = epit(); if (!kesz) return;
        if (csend) { kovetkezo = 0; while (kovetkezo < lepesek.length) { var l = lepesek[kovetkezo++], m = madar(l.faj, 'cs-zm', l.t); hely(m, l.x, l.y, l.s); m.classList.add('cs-m--ul'); if (l.faj !== 'vereb' || kovetkezo < 4) mock.appendChild(m); } return; }
        if (!figyel) { figyel = true; w.addEventListener('scroll', onScroll, { passive: true }); lep(); }
      }, 350);
    }, 0.05);
  })();

  /* 6. Interaktív háttér: a díszítők finoman követik az egeret (csak egérrel), kattintásra megperdülnek. */
  (function () {
    if (!w.matchMedia || !matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;
    var D = [].slice.call(d.querySelectorAll('.cs_dekor')), x = 0, y = 0, r = 0;
    w.addEventListener('pointermove', function (e) { x = e.clientX / innerWidth * 2 - 1; y = e.clientY / innerHeight * 2 - 1; if (!r) r = requestAnimationFrame(function () { r = 0; D.forEach(function (el, i) { var k = 6 + i % 3 * 5; el.style.translate = (x * k).toFixed(1) + 'px ' + (y * k).toFixed(1) + 'px'; }); }); }, { passive: true });
    D.forEach(function (el) { el.addEventListener('click', function () { el.classList.remove('cs-porog'); void el.offsetWidth; el.classList.add('cs-porog'); }); });
  })();

  /* 7. Mobilos ragadós letöltősáv: a hero után jelenik meg, a záró letöltőblokknál eltűnik. A gomb a telefon áruházába visz. */
  (function () {
    if (!w.matchMedia || !matchMedia('(max-width: 767px)').matches) return;
    var hero = d.querySelector('.dia_kek_ov.cs'), zaro = d.getElementById('download'); if (!hero || !zaro) return;
    var ua = navigator.userAgent, ios = /iPhone|iPad|iPod/i.test(ua);
    var href = ios ? 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu' : (/Android/i.test(ua) ? 'https://play.google.com/store/apps/details?id=hu.beeco.app' : '#download');
    var s = d.createElement('div'); s.className = 'cs-ragados';
    s.innerHTML = '<img src="' + MADAR.suvolto + '" alt="" width="40" height="38"><span class="cs-ragados_szoveg">CsicsergŐsz a beeco appban</span><a class="button_main cs-ragados_gomb" href="' + href + '" data-cs-event="primary_cta" data-cs-placement="ragados_sav"' + (href.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener"') + '>Letöltöm</a>';
    d.body.appendChild(s);
    var heroLat = true, zaroLat = false;
    function frissit() { s.classList.toggle('cs-lat', !heroLat && !zaroLat); }
    if (!('IntersectionObserver' in w)) return;
    new IntersectionObserver(function (es) { heroLat = es[0].isIntersecting; frissit(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (es) { zaroLat = es[0].isIntersecting; frissit(); }, { threshold: 0 }).observe(zaro);
  })();
})();
