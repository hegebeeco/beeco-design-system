/* Csicsergősz kampányoldal – illusztrációk és a madár jelenetei (Levi-változat, csicsergosz-levi ág).
   GENERÁLT FÁJL FORRÁSA: illusztracio/cs-illusztracio.src.js + illusztracio/*.svg → node illusztracio/build.mjs → cs-illusztracio.js
   Részek: 1. dombok a szekcióhatárokon  2. hero: szalagcím, partnertábla, fák, dombok, repdeső madár
   3. kártyák illusztrációi  4. megfigyelés: telefonkeret, összekötő vonal, csicsergő madár  5. közösség: sétáló madár
   6. záró jelenet: fák, dombok. A madár neve nem jelenik meg; minden illusztráció dekoratív (aria-hidden). */
(function () {
  var d = document, w = window;
  var csend = w.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = /*SVG*/{};
  var CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/';

  function elem(html) { var t = d.createElement('div'); t.innerHTML = html.trim(); return t.firstChild; }
  function dekor(el) { el.setAttribute('aria-hidden', 'true'); el.setAttribute('focusable', 'false'); return el; }
  var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('cs-all', !e.isIntersecting); }); }, { rootMargin: '80px' }) : null;
  function figyel(el) { if (io) io.observe(el); return el; }
  var CSI = w.CSI = {
    illu: function (nev, osztaly) { var s = dekor(elem(SVG[nev])); s.setAttribute('class', 'cs-illu cs-illu--' + nev + (osztaly ? ' ' + osztaly : '')); return s; },
    madar: function (poz, osztaly) { var s = dekor(elem(SVG.csicser)); s.setAttribute('data-poz', poz || 'alap'); if (osztaly) s.setAttribute('class', 'cs-csicser ' + osztaly); return figyel(s); },
    dataUri: function (nev) { return SVG[nev] ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVG[nev]) : ''; },
    poz: function (s, poz) { if (s && s.getAttribute('data-poz') !== poz) s.setAttribute('data-poz', poz); }
  };

  /* 1. Dombok: az előző szekció színe dombgerinccel nyúlik be; erős váltásnál köztes réteg. */
  var veletlen = (function () { var x = 7; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; })();
  function gerinc(alap, ing, lepes) {
    var p = [], x = 0; while (x <= 1440) { p.push([x, alap + (veletlen() * 2 - 1) * ing]); x += lepes * (0.7 + veletlen() * 0.6); }
    p.push([1440, alap]); return p;
  }
  function domb(szinek) {
    var h = 100, s = '<svg class="cs-domb" viewBox="0 0 1440 ' + h + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">';
    for (var i = szinek.length - 1; i >= 0; i--) {
      var g = gerinc(36 + i * 26, 12, 140), dd = 'M0 0 H1440 V' + g[g.length - 1][1];
      for (var k = g.length - 1; k >= 0; k--) dd += ' L' + g[k][0].toFixed(0) + ' ' + g[k][1].toFixed(1);
      s += '<path d="' + dd + ' Z" fill="' + szinek[i] + '"/>';
    }
    return s + '</svg>';
  }
  var KREM = '#FEF7DE', BARACK = '#FFE2B5', HOMOK = '#CB9C7E', BARNA = '#A87552', KAKAO = '#6B3B16', FEHER = '#FFFFFF';
  [
    ['.dia_ov_light.cs_horgony', [BARACK, BARNA]],
    ['.dia_green_ov.cs', [KAKAO, BARNA]],
    ['#HOWTO', [BARACK]],
    ['#fotofal', [KREM]],
    ['.dia_green_ov.cs_feher', [BARACK]],
    ['#segits', [FEHER]],
    ['.dia_kek_ov.cs_sotet', [KREM, HOMOK, BARNA]],
    ['#download', [KAKAO, BARNA]],
    ['.cs_lab', [BARACK]]
  ].forEach(function (x) { var s = d.querySelector(x[0]); if (s) { s.classList.add('cs-van-domb'); s.insertBefore(elem(domb(x[1])), s.firstChild); } });

  /* 2. Hero: kétszintes szalagcím, partnertábla, dombos táj, fák, repdeső madár */
  var hero = d.querySelector('.dia_kek_ov.cs');
  if (hero) {
    var h1 = hero.querySelector('h1'), t = h1 && h1.textContent.trim(), i = t ? t.indexOf('. ') : -1;
    if (i > 0) {
      h1.textContent = '';
      h1.appendChild(elem('<span class="cs_szalag cs_szalag--kicsi"></span>')).textContent = t.slice(0, i + 1);
      h1.appendChild(elem('<span class="cs_szalag cs_szalag--nagy"></span>')).textContent = t.slice(i + 2);
      h1.classList.add('cs_h1_szalag');
    }
    /* a partnertábla tisztán CSS-ből rajzolódik (.cs_mme_sor), hogy ne mozduljon el az oszlop */
    hero.classList.add('cs-taj');
    var taj = dekor(elem('<div class="cs-taj_hatter"></div>'));
    taj.appendChild(elem('<svg class="cs-taj_domb" viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 120 L180 70 L360 104 L560 52 L760 96 L980 60 L1200 98 L1440 58 V220 H0Z" fill="#FFE2B5"/><path d="M0 170 L220 130 L470 160 L720 118 L980 156 L1220 126 L1440 150 V220 H0Z" fill="#CB9C7E"/><path d="M0 196 L300 176 L640 200 L960 178 L1440 194 V220 H0Z" fill="#A87552"/></svg>'));
    taj.appendChild(CSI.illu('fa1', 'cs-taj_fa cs-taj_fa--bal'));
    taj.appendChild(CSI.illu('fa4', 'cs-taj_fa cs-taj_fa--jobb'));
    hero.insertBefore(taj, hero.firstChild);
    var mock = hero.querySelector('.cs_mockup');
    if (mock) { var hm = CSI.madar('repdes', 'cs-hero-csicser'); mock.appendChild(hm); if (!csend) setTimeout(function () { CSI.poz(hm, 'alap'); }, 2600); }
  }

  /* 3. Kártyák: a fotók helyén a designer illusztrációi (itatás, etetés, odú) */
  function kepCsere(img, nev, madarPoz) {
    if (!img) return;
    var p = elem('<div class="cs_illu_panel"></div>'); p.appendChild(CSI.illu(nev));
    if (madarPoz) p.appendChild(CSI.madar(madarPoz, 'cs-panel-csicser cs-panel-csicser--' + nev));
    img.parentNode.insertBefore(p, img); img.classList.add('cs_foto_rejtett');
  }
  var utvonal = d.querySelector('.dia_green_ov.cs .card.cs_link');
  if (utvonal) kepCsere(utvonal.querySelector('img'), 'itato', null);
  var harmas = d.querySelectorAll('.cs_harmas > .card');
  if (harmas.length === 3) { kepCsere(harmas[0].querySelector('img'), 'itato'); kepCsere(harmas[1].querySelector('img'), 'eteto', 'eszeget'); kepCsere(harmas[2].querySelector('img'), 'odu'); }

  /* 4. Megfigyelés: döntött telefonkeret, összekötő szaggatott vonal, a 3. lépésnél csicsergő madár */
  var zaroLepes = d.querySelector('.cs_folyamat_lepes--zaro .cs_folyamat_vizual');
  if (zaroLepes) zaroLepes.appendChild(CSI.madar('csicsereg', 'cs-lepes-csicser'));

  /* 5. Közösség: a hírlevél-sziget tetején sétáló madár */
  var sziget = d.querySelector('#fotofal .cs_sziget');
  if (sziget) { var sm = CSI.madar('setalgat', 'cs-setalo'); var sav = elem('<div class="cs-setalo_sav" aria-hidden="true"></div>'); sav.appendChild(sm); sziget.parentNode.insertBefore(sav, sziget); }

  /* 6. Záró jelenet: dombos táj és fák a telefon körül */
  var zaro = d.getElementById('download');
  if (zaro) {
    zaro.classList.add('cs-taj');
    var zt = dekor(elem('<div class="cs-taj_hatter cs-taj_hatter--zaro"></div>'));
    zt.appendChild(elem('<svg class="cs-taj_domb" viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 130 L240 84 L520 118 L800 70 L1100 112 L1440 76 V220 H0Z" fill="#FEF7DE" opacity=".7"/><path d="M0 182 L360 150 L720 176 L1080 146 L1440 172 V220 H0Z" fill="#CB9C7E"/><path d="M0 204 L480 190 L960 206 L1440 192 V220 H0Z" fill="#A87552"/></svg>'));
    zt.appendChild(CSI.illu('fa3', 'cs-taj_fa cs-taj_fa--bal'));
    zt.appendChild(CSI.illu('fa2', 'cs-taj_fa cs-taj_fa--jobb'));
    zaro.insertBefore(zt, zaro.firstChild);
  }
})();
