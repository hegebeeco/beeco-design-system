/* Csicsergősz kampányoldal – illusztrációk és a madár jelenetei (Levi-változat, csicsergosz-levi ág).
   GENERÁLT FÁJL FORRÁSA: illusztracio/cs-illusztracio.src.js + illusztracio/agi/*.svg (Ági eredeti rajzai) → node illusztracio/build.mjs → cs-illusztracio.js
   Részek: 1. madár (pózcsere) és repülés  2. dombok  3. hero: szalagcím, táj, fák, hulló levelek, érkező madár
   4. kártyák illusztrációi  5. látogatások: itatóra száll és iszik, etetőre száll és eszik, berepül az odúba
   6. megfigyelés: csicsergő madár  7. közösség: sétáló madár  8. záró jelenet.
   A madár neve nem jelenik meg; minden illusztráció dekoratív (aria-hidden). */
(function () {
  var d = document, w = window;
  var csend = w.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = /*SVG*/{};
  var ALAP = ((d.currentScript && d.currentScript.src) || '').replace(/[^/?#]+(\?.*)?$/, '');
  var mo = new Date().getMonth(), TEL = mo === 11 || mo === 0 || mo === 1 || /[?&]tel=1/.test(location.search);

  function elem(html) { var t = d.createElement('div'); t.innerHTML = html.trim(); return t.firstChild; }
  function dekor(el) { el.setAttribute('aria-hidden', 'true'); el.setAttribute('focusable', 'false'); return el; }
  var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('cs-all', !e.isIntersecting); }); }, { rootMargin: '80px' }) : null;
  function figyel(el) { if (io) io.observe(el); return el; }

  /* 1. Madár: egy burkoló, amelyben Ági megfelelő pózrajza ül. Az „iszik” az eszegető rajzot használja, magok nélkül. */
  var CSI = w.CSI = {
    illu: function (nev, osztaly) { var s = dekor(elem(SVG[nev])); s.setAttribute('class', 'cs-illu cs-illu--' + nev + (osztaly ? ' ' + osztaly : '')); return s; },
    madar: function (poz, osztaly) { var m = elem('<span class="cs-pozmadar' + (osztaly ? ' ' + osztaly : '') + '" aria-hidden="true"></span>'); CSI.poz(m, poz || 'alap'); return figyel(m); },
    poz: function (m, poz) {
      if (!m || m._poz === poz) return; m._poz = poz;
      var rajz = poz === 'iszik' ? 'eszeget' : (poz === 'alap' && TEL ? 'salas' : poz);
      if (m._rajz !== rajz && SVG['poz_' + rajz]) { m.innerHTML = SVG['poz_' + rajz]; m._rajz = rajz; }
      m.setAttribute('data-poz', poz);
    },
    dataUri: function (nev) { return SVG[nev] ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVG[nev]) : ''; }
  };
  /* 0. A Webflow Designerben valódi <img> elemek ülnek (data-cs-illu: rajz, data-cs-poz: madárpóz), hogy a szerkesztőben is
        látszódjon a kép. Élesben ezeket az animálható inline változatra cseréljük, az osztályaikat megtartva. */
  [].forEach.call(d.querySelectorAll('img[data-cs-illu]'), function (img) {
    var n = img.getAttribute('data-cs-illu'); if (!SVG[n]) return; img.parentNode.replaceChild(CSI.illu(n, img.className), img);
  });
  [].forEach.call(d.querySelectorAll('img[data-cs-poz]'), function (img) {
    img.parentNode.replaceChild(CSI.madar(img.getAttribute('data-cs-poz'), img.className.replace(/\bcs-pozmadar\b/, '').trim()), img);
  });
  var LAB = 212 / 220; /* a láb alja a pózdoboz magasságának ennyiedénél */
  function hely(m, x, y, tukor, skala) {
    var mw = m.offsetWidth, mh = mw * 220 / 240;
    m.style.transform = 'translate(' + (x - mw / 2).toFixed(1) + 'px,' + (y - mh * LAB).toFixed(1) + 'px)' + (tukor ? ' scaleX(-1)' : '') + (skala != null ? ' scale(' + skala + ')' : '');
    m._x = x; m._y = y; m._t = tukor;
  }
  function ido(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function kepkocka() { return new Promise(function (r) { requestAnimationFrame(r); }); }
  /* Repülés ívpályán (másodfokú Bézier), repdeső pózban. */
  function repul(m, x, y, opt) {
    opt = opt || {}; var x0 = m._x, y0 = m._y, tav = Math.hypot(x - x0, y - y0);
    if (csend || !tav) { hely(m, x, y, opt.tukor); return Promise.resolve(); }
    CSI.poz(m, 'repdes');
    var cx = (x0 + x) / 2, cy = Math.min(y0, y) - Math.max(60, tav * 0.32), T = Math.max(700, Math.min(1900, tav * 1.5)), t0 = performance.now();
    return new Promise(function (kesz) {
      (function lep(most) {
        var t = Math.min(1, ((most || performance.now()) - t0) / T), e = 0.5 - Math.cos(Math.PI * t) / 2, u = 1 - e;
        hely(m, u * u * x0 + 2 * u * e * cx + e * e * x, u * u * y0 + 2 * u * e * cy + e * e * y, false);
        if (t < 1) requestAnimationFrame(lep); else kesz();
      })();
    });
  }
  /* Egy pont Ági rajzán (a kellék saját koordinátáiban) → a tartály koordinátái. */
  function pont(svg, ux, uy, tartaly) {
    var ctm = svg.getScreenCTM(); if (!ctm) return null;
    var p = svg.createSVGPoint(); p.x = ux; p.y = uy; p = p.matrixTransform(ctm);
    var r = tartaly.getBoundingClientRect(); return { x: p.x - r.left, y: p.y - r.top, s: ctm.a };
  }

  /* 2. Dombok: az előző szekció színe dombgerinccel nyúlik be; erős váltásnál köztes réteg. */
  var veletlen = (function () { var x = 7; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; })();
  function gerinc(alap, ing, lepes) {
    var p = [], x = 0; while (x <= 1440) { p.push([x, alap + (veletlen() * 2 - 1) * ing]); x += lepes * (0.7 + veletlen() * 0.6); }
    p.push([1440, alap]); return p;
  }
  function domb(szinek) {
    var s = '<svg class="cs-domb" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">';
    for (var i = szinek.length - 1; i >= 0; i--) {
      var g = gerinc(36 + i * 26, 12, 140), dd = 'M0 0 H1440 V' + g[g.length - 1][1];
      for (var k = g.length - 1; k >= 0; k--) dd += ' L' + g[k][0].toFixed(0) + ' ' + g[k][1].toFixed(1);
      s += '<path d="' + dd + ' Z" fill="' + szinek[i] + '"/>';
    }
    return s + '</svg>';
  }
  /* Napszak-ív: a hero reggeli krémje után krém és barack váltakozik, a GYIK-kal alkonyodik, a záró jelenet alkonyati.
     Minden határon az előző szekció színe nyúlik be dombgerincként (a hero alja Ági borítójának talaja). */
  var KREM = '#FEF7DE', BARACK = '#FFE2B5', HOMOK = '#CB9C7E', BARNA = '#A87552', KAKAO = '#6B3B16', TALAJ = '#B7805C';
  [
    ['.dia_ov_light.cs_horgony', [TALAJ]],
    ['.dia_green_ov.cs', [KREM]],
    ['.dia_kek.cs:not(#fotofal):not(#download)', [BARACK]],
    ['#HOWTO', [KREM]],
    ['#fotofal', [BARACK]],
    ['.dia_green_ov.cs_feher', [KREM]],
    ['#segits', [BARACK]],
    ['.dia_kek_ov.cs_sotet', [KREM, HOMOK, BARNA]],
    ['#download', [KAKAO, BARNA]],
    ['.cs_lab', [BARNA]]
  ].forEach(function (x) { var s = d.querySelector(x[0]), g = domb(x[1]); if (s) { s.classList.add('cs-van-domb'); if (!s.querySelector(':scope > .cs-domb')) s.insertBefore(elem(g), s.firstChild); } });

  function levelek(tartaly, db) {
    for (var i = 0; i < db; i++) tartaly.appendChild(dekor(elem('<i class="cs-hullo cs-hullo--' + (i + 1) + '"></i>')));
  }

  /* 3. Hero: kétszintes szalagcím, dombos táj, Ági fái, hulló levelek, érkező madár */
  var hero = d.querySelector('.dia_kek_ov.cs');
  if (hero) {
    var h1 = hero.querySelector('h1'), t = h1 && h1.textContent.trim(), i = t ? t.indexOf('. ') : -1;
    if (h1 && h1.querySelector('.cs_szalag')) { h1.classList.add('cs_h1_szalag'); h1.setAttribute('aria-label', t); i = -1; }
    if (i > 0) {
      h1.textContent = '';
      h1.appendChild(elem('<span class="cs_szalag cs_szalag--kicsi"></span>')).textContent = t.slice(0, i + 1);
      h1.appendChild(d.createTextNode(' '));
      h1.appendChild(elem('<span class="cs_szalag cs_szalag--nagy"></span>')).textContent = t.slice(i + 2);
      h1.classList.add('cs_h1_szalag');
      h1.setAttribute('aria-label', t);
    }
    /* a partnertábla tisztán CSS-ből rajzolódik (.cs_mme_sor), hogy ne mozduljon el az oszlop */
    hero.classList.add('cs-taj', 'cs-taj--borito');
    /* Ági borítójának rétegei: domb és talaj, bal fa, jobb fa az odúval. Asztalon görgetésre eltérő mértékben mozdulnak. */
    var taj = hero.querySelector(':scope > .cs-taj_hatter'), rDomb, rBal, rJobb;
    if (taj) { rDomb = taj.querySelector('.cs-bor--domb'); rBal = taj.querySelector('.cs-bor--fa-bal'); rJobb = taj.querySelector('.cs-bor--fa-jobb'); dekor(taj); }
    else {
      taj = dekor(elem('<div class="cs-taj_hatter"></div>'));
      rDomb = elem(SVG.bor_domb); rDomb.setAttribute('class', 'cs-bor cs-bor--domb'); taj.appendChild(dekor(rDomb));
      rBal = CSI.illu('bor_fa_bal', 'cs-bor cs-bor--fa-bal'); rJobb = CSI.illu('bor_fa_jobb', 'cs-bor cs-bor--fa-jobb');
      taj.appendChild(rBal); taj.appendChild(rJobb);
      levelek(taj, 3);
      hero.insertBefore(taj, hero.firstChild);
    }
    if (!csend && w.matchMedia('(min-width: 768px)').matches) {
      var pRaf = 0, retegek = [[rDomb, 0.06], [rBal, 0.16], [rJobb, 0.16]];
      w.addEventListener('scroll', function () {
        if (pRaf) return; pRaf = requestAnimationFrame(function () {
          pRaf = 0; var y = Math.min(scrollY, hero.offsetHeight);
          retegek.forEach(function (r) { r[0].style.transform = 'translate3d(0,' + (y * r[1]).toFixed(1) + 'px,0)'; });
        });
      }, { passive: true });
    }
    /* A madár a jobb fa odújából bújik ki, és a telefon mellé repül (odú-lyuk: 2317, 181 a borító koordinátáiban). */
    var mock = hero.querySelector('.cs_mockup');
    if (mock) {
      var hm = mock.querySelector('.cs-hero-csicser') || mock.appendChild(CSI.madar('alap', 'cs-hero-csicser')); CSI.poz(hm, csend ? 'alap' : 'repdes');
      var kibuj = function () {
        if (csend || !hm.animate) return;
        var ctm = rJobb.getScreenCTM(), r = hm.getBoundingClientRect();
        var dx = 0, dy = -200;
        if (ctm && r.width && getComputedStyle(rJobb).display !== 'none') {
          var p = rJobb.createSVGPoint(); p.x = 2317; p.y = 181; p = p.matrixTransform(ctm);
          dx = p.x - (r.left + r.width / 2); dy = p.y - (r.top + r.height * 0.6);
        }
        /* Egy főszereplő: asztalon a madár az odúból egyenesen a jobb oldali útvonalra repül, és onnan kísér végig. */
        var sin = d.querySelector('.cs-utvonal_madar');
        if (sin && sin.offsetParent !== null) {
          var sr = sin.getBoundingClientRect(), rx = sr.left + sr.width / 2 - (r.left + r.width / 2), ry = sr.top + sr.height * 0.5 - (r.top + r.height / 2), sk = sr.width / r.width;
          hm.animate([
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.14)', opacity: 0 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.3)', opacity: 1, offset: 0.12 },
            { transform: 'translate(' + ((dx + rx) / 2) + 'px,' + (Math.min(dy, ry) - 70) + 'px) scale(' + ((0.3 + sk) / 2) + ')', offset: 0.55 },
            { transform: 'translate(' + rx + 'px,' + ry + 'px) scale(' + sk + ')', opacity: 1 }
          ], { duration: 2100, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }).finished.then(function () {
            hm.remove(); d.dispatchEvent(new CustomEvent('cs:atadas'));
          });
          return;
        }
        hm.animate([
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.14)', opacity: 0 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.3)', opacity: 1, offset: 0.12 },
          { transform: 'translate(' + (dx * 0.5) + 'px,' + (Math.min(dy, 0) * 0.5 - 90) + 'px) scale(.8)', offset: 0.55 },
          { transform: 'translate(0,0) scale(1)', opacity: 1 }
        ], { duration: 1900, easing: 'cubic-bezier(.45,0,.25,1)' }).finished.then(function () { CSI.poz(hm, 'alap'); });
      };
      if (d.readyState === 'complete') setTimeout(kibuj, 300); else w.addEventListener('load', function () { setTimeout(kibuj, 300); });
    }
  }

  /* 4. Kártyák: a fotók helyén Ági illusztrációi (itatás, etetés, odú) */
  function kepCsere(img, nev) {
    if (!img) return null;
    var van = img.parentNode.querySelector('.cs_illu_panel .cs-illu'); if (van) { img.classList.add('cs_foto_rejtett'); return van; }
    var p = elem('<div class="cs_illu_panel"></div>'); var s = CSI.illu(nev); p.appendChild(s);
    img.parentNode.insertBefore(p, img); img.classList.add('cs_foto_rejtett'); return s;
  }
  var utvonal = d.querySelector('.dia_green_ov.cs .card.cs_link');
  if (utvonal) {
    var uImg = utvonal.querySelector('img');
    if (uImg && !utvonal.querySelector('.cs-ciklus')) {
      var ciklus = elem('<div class="cs_illu_panel cs-ciklus" aria-hidden="true"></div>');
      [1, 2, 3].forEach(function (n) { var k = d.createElement('img'); k.src = ALAP + 'illusztracio/kepek/itatas-' + n + '.webp'; k.alt = ''; k.decoding = 'async'; ciklus.appendChild(k); });
      uImg.parentNode.insertBefore(ciklus, uImg); uImg.classList.add('cs_foto_rejtett'); figyel(ciklus);
    }
  }
  /* „Mit tehetsz”: a két csempe egyforma. A második (album) képe is ugyanolyan képpanelbe kerül, és mindkét
     csempén a nyíl-gomb a kép jobb alsó sarkába ül (szögletes, 4 px lekerekítés). */
  [].forEach.call(d.querySelectorAll('.dia_green_ov.cs .card.cs_link'), function (k) {
    var panel = k.querySelector('.cs_illu_panel'), aImg = k.querySelector('img.cs_kartya_album:not(.cs_foto_rejtett)');
    if (!panel && aImg) { panel = elem('<div class="cs_illu_panel cs-album-panel"></div>'); aImg.parentNode.insertBefore(panel, aImg); panel.appendChild(aImg); }
    var ny = k.querySelector('.cs_utvonal_nyil');
    if (panel && ny && ny.parentNode !== panel) { panel.appendChild(ny); ny.classList.add('cs-kep-gomb'); }
  });
  var harmas = d.querySelectorAll('.cs_harmas > .card'), kellekek = [];
  var kell = function (k, nev) {
    var van = harmas[k].querySelector('.cs_illu_panel .cs-illu--' + nev);
    /* a Designerben elhelyezett kép jelölő nélkül is az animálható rajzra cserélődik (a madár csak SVG-n tud leszállni) */
    if (van && van.tagName === 'IMG' && SVG[nev]) { var uj = CSI.illu(nev, van.className.replace(/\bcs-illu(--\S+)?\b/g, '').trim()); van.parentNode.replaceChild(uj, van); van = uj; }
    return van || kepCsere(harmas[k].querySelector('img:not(.cs-pozmadar)'), nev);
  };
  if (harmas.length === 3) kellekek = [kell(0, 'itato'), kell(1, 'eteto'), kell(2, 'odu')];

  /* A csempék címe (Itatás, Etetés, Madárodú) címkeként a képre kerül, mint a hero „Kövesd a csicsergést” szalagja. */
  [].forEach.call(harmas, function (k) {
    var p = k.querySelector('.cs_illu_panel'), h = k.querySelector('h3'); if (!p || !h || h.parentNode === p) return;
    h.classList.add('cs_szalag', 'cs_szalag--kicsi', 'cs-csempe-cimke'); p.appendChild(h);
  });

  /* 5. Gondoskodás: a madár görgetésre végiglátogatja a három csempét. Asztalon (egy sorban) a csempesor helye dönt:
        a képernyő alsó harmadában az itató, középen az etető, a felső harmadban az odú. Egymás alatt (mobil) az a csempe,
        amelyik a képernyő közepéhez a legközelebb van. Pontok Ági rajzainak koordinátáiban; a madár mérete mindenhol
        ugyanaz (az itatónál mért 210 egység). A küszöbök korán vannak (a csempesor közepe a képernyő 72 és 50%-ánál),
        hogy a sor elgörgetése előtt mindhárom látogatás lefusson. Az aktív csempe címkéje kiemelődik, a kelléke megmozdul. */
  var szek = kellekek.length === 3 && kellekek[0] && harmas[0].closest('section');
  if (szek) {
    szek.classList.add('cs-latogatas');
    var CELOK = [
      { lab: [178, 40], poz: 'iszik' },
      { lab: [34, 142], poz: 'eszeget' },
      { lab: [74, 106], poz: 'csicsereg' }
    ];
    var lm = szek.querySelector('.cs-latogato') || CSI.madar('alap', 'cs-latogato'); lm.classList.add('cs-ul'); szek.appendChild(lm);
    var lAkt = -1, lKert = 0, lRepul = false;
    var celPont = function (i) {
      var s0 = pont(kellekek[0], 0, 0, szek), p = kellekek[i] && pont(kellekek[i], CELOK[i].lab[0], CELOK[i].lab[1], szek);
      return p && s0 ? { x: p.x, y: p.y, w: 210 * s0.s } : null;
    };
    var melyik = function () {
      var r = [].map.call(harmas, function (c) { return c.getBoundingClientRect(); }), vh = innerHeight;
      if (Math.abs(r[0].top - r[2].top) < 24) { var cy = (r[0].top + r[0].bottom) / 2; return cy > vh * 0.72 ? 0 : (cy > vh * 0.5 ? 1 : 2); }
      var b = 0, bd = 1e9; r.forEach(function (x, i) { var dd = Math.abs((x.top + x.bottom) / 2 - vh / 2); if (dd < bd) { bd = dd; b = i; } }); return b;
    };
    var jelol = function (i) { [].forEach.call(harmas, function (c, j) { c.classList.toggle('cs-aktiv', j === i); }); };
    var latogat = function (i, azonnal) {
      lKert = i; if (lRepul || (i === lAkt && !azonnal)) return;
      var p = celPont(i); if (!p) return;
      lm.style.width = p.w.toFixed(1) + 'px'; jelol(i);
      if (azonnal || csend || lAkt < 0) { lAkt = i; hely(lm, p.x, p.y, false); CSI.poz(lm, csend ? 'alap' : CELOK[i].poz); return; }
      lAkt = i; lRepul = true;
      repul(lm, p.x, p.y).then(function () {
        lRepul = false; CSI.poz(lm, CELOK[i].poz);
        if (lKert !== lAkt) latogat(lKert);
      });
    };
    var lRaf = 0;
    w.addEventListener('scroll', function () { if (!lRaf) lRaf = requestAnimationFrame(function () { lRaf = 0; latogat(melyik()); }); }, { passive: true });
    var ujra = function () { if (!lRepul) latogat(lAkt < 0 ? melyik() : lAkt, true); };
    w.addEventListener('load', ujra); w.addEventListener('resize', ujra); latogat(melyik(), true);
  }

  /* 6. Megfigyelés: a Webflow a stílus nélküli osztályokat eldobta, ezért a lépések szöveg- és képrészét itt jelöljük meg. */
  [].forEach.call(d.querySelectorAll('.cs_folyamat_lepes'), function (l) {
    var ui = l.querySelector('.cs_folyamat_ui'); if (ui) ui.parentNode.classList.add('cs_folyamat_vizual');
    if (l.firstElementChild && l.firstElementChild !== (ui && ui.parentNode)) l.firstElementChild.classList.add('cs_folyamat_szoveg');
  });
  /* 6b. Felfedezés-ösvény: a lépések között görgetésre kirajzolódó szaggatott vonal, rajta a madár útja.
         1. lépés: fekete sziluett kérdőjellel  2. felismerjük: színes lesz, előjön a neve  3. a fotója bekerül a kis
         Madár albumba, a könyv becsukódik, a madár a könyvön csicsereg. Visszagörgetésre visszafelé játszik. */
  var fol = d.querySelector('#HOWTO .cs_folyamat'), fLep = fol ? fol.querySelectorAll(':scope > .cs_folyamat_lepes') : [];
  if (fol && fLep.length === 3 && !fol.querySelector('.cs-ut')) {
    fol.classList.add('cs-ut-van');
    var uId = 'cs-ut-maszk';
    var ut = dekor(elem('<div class="cs-ut"><svg class="cs-ut_svg"><defs><mask id="' + uId + '" maskUnits="userSpaceOnUse"><path class="cs-ut_maszk" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/></mask></defs>' +
      '<path class="cs-ut_vonal" fill="none" stroke="#A87956" stroke-width="5" stroke-dasharray="13 10" stroke-linecap="round" mask="url(#' + uId + ')"/></svg>' +
      '<div class="cs-ut_konyv"><div class="cs-ut_lap cs-ut_lap--bal"><span class="cs-ut_kep"></span></div>' +
      '<div class="cs-ut_lap cs-ut_lap--jobb"><span class="cs-ut_lap-belso"></span><span class="cs-ut_borito"><b>Madár album</b></span></div></div>' +
      '<div class="cs-ut_madar"><span class="cs-ut_kerdo">?</span><span class="cs-ut_nev">Vörösbegy</span></div></div>'));
    fol.appendChild(ut);
    var uMadar = CSI.madar('alap', 'cs-ut_csicser'); ut.querySelector('.cs-ut_madar').appendChild(uMadar);
    var kepMadar = CSI.madar('alap', 'cs-ut_kep-madar'); ut.querySelector('.cs-ut_kep').appendChild(kepMadar);
    var uSvg = ut.querySelector('svg'), uVonal = ut.querySelector('.cs-ut_vonal'), uMaszk = ut.querySelector('.cs-ut_maszk');
    var uDoboz = ut.querySelector('.cs-ut_madar'), uKonyv = ut.querySelector('.cs-ut_konyv');
    var uMinta = [], uHossz = 0, uHatar = [], uMost = -1, uCel = 0, uRaf = 0, uSzak = 0, uVegTimer = 0, uAllTimer = 0;
    var uEpit = function () {
      var W = fol.clientWidth, H = fol.clientHeight; if (!W || !H) return;
      var keskeny = W < 700, cx = keskeny ? 18 : W / 2, A = keskeny ? 8 : 34;
      var ys = [].map.call(fLep, function (l) { return l.offsetTop + l.offsetHeight / 2; });
      var konyvY = fLep[2].offsetTop + fLep[2].offsetHeight + (keskeny ? 54 : 70);
      var kx = keskeny ? 0 : cx - uKonyv.offsetWidth / 2; uKonyv.style.transform = 'translate(' + kx + 'px,' + konyvY + 'px)';
      var cel = konyvY - 2, pts = [[cx, ys[0] - 40], [cx, ys[0]], [cx, ys[1]], [cx, ys[2]], [kx + uKonyv.offsetWidth / 2, cel]];
      var dd = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k], dy = b[1] - a[1], s = (k % 2 ? 1 : -1) * A;
        dd += ' C' + (a[0] + s) + ' ' + (a[1] + dy / 3) + ' ' + (b[0] - s) + ' ' + (a[1] + 2 * dy / 3) + ' ' + b[0] + ' ' + b[1];
      }
      uSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + (cel + 10)); uSvg.style.width = W + 'px'; uSvg.style.height = (cel + 10) + 'px';
      uVonal.setAttribute('d', dd); uMaszk.setAttribute('d', dd);
      uHossz = uVonal.getTotalLength(); uMinta = [];
      for (var L = 0; L <= uHossz; L += uHossz / 400) uMinta.push([L, uVonal.getPointAtLength(L).y]);
      uMaszk.style.strokeDasharray = uHossz + ' ' + uHossz;
      uHatar = [(ys[0] + ys[1]) / 2, (ys[1] + ys[2]) / 2, (ys[2] + cel) / 2];
      uFris(true);
    };
    var uHossza = function (y) { if (uMinta.length && y >= uMinta[uMinta.length - 1][1]) return uHossz; var b = uMinta[0]; for (var i = 0; i < uMinta.length; i++) { if (uMinta[i][1] <= y) b = uMinta[i]; else break; } return b ? b[0] : 0; };
    var uSzakasz = function (y, vegen) { return vegen ? 4 : (y < uHatar[0] ? 1 : (y < uHatar[1] ? 2 : 3)); };
    var uRajzol = function () {
      var q = uVonal.getPointAtLength(uMost);
      uDoboz.style.transform = 'translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px)';
      uMaszk.style.strokeDashoffset = (uHossz - uMost).toFixed(1);
      var vegen = uMost >= uHossz - 3, sz = uSzakasz(q.y, vegen);
      if (sz !== uSzak) {
        clearTimeout(uVegTimer);
        if (sz === 4) { ut.className = 'cs-ut cs-ut--3 cs-ut--fotozik'; uVegTimer = setTimeout(function () { ut.classList.add('cs-ut--csukva'); CSI.poz(uMadar, 'csicsereg'); }, csend ? 0 : 750); }
        else ut.className = 'cs-ut cs-ut--' + sz;
        uSzak = sz;
      }
    };
    var uLep = function () {
      uRaf = 0; var kul = uCel - uMost;
      uMost = csend || Math.abs(kul) < 0.6 ? uCel : uMost + kul * 0.14;
      uRajzol();
      if (uMost !== uCel) { uRaf = requestAnimationFrame(uLep); if (!csend && uSzak !== 4) CSI.poz(uMadar, 'repdes'); }
      else { clearTimeout(uAllTimer); uAllTimer = setTimeout(function () { if (uSzak !== 4) CSI.poz(uMadar, 'alap'); }, 250); }
    };
    var uFris = function (azonnal) {
      if (!uHossz) return;
      var r = fol.getBoundingClientRect(), y = innerHeight * 0.55 - r.top;
      uCel = Math.max(0, Math.min(uHossz, uHossza(y)));
      if (azonnal || uMost < 0) { uMost = uCel; uRajzol(); return; }
      if (!uRaf) uRaf = requestAnimationFrame(uLep);
    };
    w.addEventListener('scroll', function () { uFris(false); }, { passive: true });
    var uRt; w.addEventListener('resize', function () { clearTimeout(uRt); uRt = setTimeout(uEpit, 150); });
    w.addEventListener('load', uEpit);
    if ('ResizeObserver' in w) new ResizeObserver(function () { clearTimeout(uRt); uRt = setTimeout(uEpit, 120); }).observe(fol);
    uEpit();
  }

  /* 7. Közösség: a hírlevél-sziget tetején ülő madár (álló póz, pislog) */
  var sziget = d.querySelector('#fotofal .cs_sziget');
  if (sziget && !d.querySelector('#fotofal .cs-setalo')) { var sm = CSI.madar('alap', 'cs-setalo'); var sav = elem('<div class="cs-setalo_sav" aria-hidden="true"></div>'); sav.appendChild(sm); sziget.parentNode.insertBefore(sav, sziget); }

  /* 9. „Miért fontos” piktogramjai Ági stílusában (a régi matricák helyén, azonos magassággal) */
  var PIKTO = ['pikto_rovarok', 'pikto_vadvirag', 'pikto_elohely'];
  [].forEach.call(d.querySelectorAll('.cs_horgony .cs_teny'), function (t, n) {
    var img = t.querySelector('img'); if (!img || !PIKTO[n] || t.querySelector('.cs-pikto')) return;
    img.parentNode.insertBefore(CSI.illu(PIKTO[n], 'cs_teny_ikon cs-pikto'), img); img.classList.add('cs_foto_rejtett');
  });

  /* 9b. „600 millió”: mellette egy szomorú madár, fölötte kis esőfelhő. Dekoratív; a szám szövege érintetlen. */
  var hatSzam = d.querySelector('.cs_horgony [data-cs-szamlal]');
  if (hatSzam && !d.querySelector('.cs-szomoru')) {
    var szomSor = elem('<div class="cs-szam-sor"></div>'); hatSzam.parentNode.insertBefore(szomSor, hatSzam); szomSor.appendChild(hatSzam);
    var szom = dekor(elem('<span class="cs-szomoru"><span class="cs-szomoru_felho"><i></i><i></i><i></i></span></span>'));
    szom.appendChild(CSI.madar('szomoru', 'cs-szomoru_madar')); szomSor.appendChild(figyel(szom));
  }

  /* 10. Ági szaggatott repülési hurkai: görgetésre rajzolódnak ki (maszkolt szaggatott vonal). */
  var hurkok = [], hId = 0;
  function hurok(kont, kulcs, osztaly) {
    if (!kont || !SVG[kulcs]) return;
    var regi = kont.querySelector(':scope > .cs-hurok'); if (regi) regi.remove();
    var o = JSON.parse(SVG[kulcs]), id = 'cs-hm-' + (++hId);
    var s = dekor(elem('<svg class="cs-hurok ' + osztaly + '" viewBox="' + o.vb + '"><defs><mask id="' + id + '" maskUnits="userSpaceOnUse"><path class="cs-hurok_maszk" d="' + o.d + '" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/></mask></defs><path d="' + o.d + '" fill="none" stroke="#A87956" stroke-width="5" stroke-dasharray="13 10" stroke-linecap="round" mask="url(#' + id + ')"/></svg>'));
    kont.classList.add('cs-van-hurok'); kont.appendChild(s);
    var m = s.querySelector('.cs-hurok_maszk'), L = m.getTotalLength ? m.getTotalLength() : 0;
    m.style.strokeDasharray = L + ' ' + L; m.style.strokeDashoffset = csend ? 0 : L;
    hurkok.push({ s: s, m: m, L: L });
  }
  hurok(d.querySelector('#fotofal .cs_gabee_bemutat'), 'hurok_meh', 'cs-hurok--meh');
  hurok(szek, 'hurok_madar', 'cs-hurok--gond');
  hurok(d.querySelector('.dia_green_ov.cs .alap-blokk'), 'hurok_madar', 'cs-hurok--mit');
  if (!csend && hurkok.length) {
    var hRaf = 0, hFris = function () {
      hRaf = 0; var vh = innerHeight;
      hurkok.forEach(function (h) { var r = h.s.getBoundingClientRect(); var p = Math.max(0, Math.min(1, (vh * 0.92 - r.top) / (r.height + vh * 0.35))); h.m.style.strokeDashoffset = (h.L * (1 - p)).toFixed(1); });
    };
    w.addEventListener('scroll', function () { if (!hRaf) hRaf = requestAnimationFrame(hFris); }, { passive: true }); hFris();
  }

  /* 11. Megfigyelés 1. lépés: kamera-keret (Ági karuszelje, 4. panel) – a sarkok rázáródnak, „katt”. */
  var elso = d.querySelector('.cs_folyamat_lepes .cs_folyamat_vizual');
  var vanKam = elso && elso.querySelector('.cs-kamera'); if (vanKam) figyel(dekor(vanKam));
  if (elso && !vanKam) { var kam = figyel(dekor(elem('<div class="cs-kamera"><i class="cs-kamera_s cs-kamera_s--bf"></i><i class="cs-kamera_s cs-kamera_s--jf"></i><i class="cs-kamera_s cs-kamera_s--ba"></i><i class="cs-kamera_s cs-kamera_s--ja"></i><i class="cs-kamera_vaku"></i></div>'))); elso.appendChild(kam); }

  /* 12. Gabee teljes szettje a borítóból: távcső és könyvek együtt (Levi kérése) */
  var gImg = d.querySelector('#fotofal .cs_gabee_kep');
  if (gImg && SVG.bor_gabee && !d.querySelector('#fotofal .cs-gabee-szett')) { gImg.parentNode.insertBefore(CSI.illu('bor_gabee', 'cs_gabee_kep cs-gabee-szett'), gImg); gImg.classList.add('cs_foto_rejtett'); }

  /* 8. Záró jelenet: Ági borítójának tükörképe alkonyatban. A főszereplő az útvonalról leszáll a letöltés gombra,
        csicsereg, majd hazarepül az odúba: így zárul a hero íve (kirepült, végigkísért, hazaért). */
  var zaro = d.getElementById('download');
  if (zaro) {
    zaro.classList.add('cs-taj', 'cs-taj--alkony');
    var zt = zaro.querySelector(':scope > .cs-taj_hatter--zaro'), zJobb;
    if (zt) { zJobb = zt.querySelector('.cs-bor--fa-jobb'); dekor(zt); }
    else {
      zt = dekor(elem('<div class="cs-taj_hatter cs-taj_hatter--zaro"></div>'));
      var zDomb = elem(SVG.bor_domb); zDomb.setAttribute('class', 'cs-bor cs-bor--domb cs-bor--zaro'); zt.appendChild(dekor(zDomb));
      var zBal = CSI.illu('bor_fa_bal', 'cs-bor cs-bor--fa-bal'); zJobb = CSI.illu('bor_fa_jobb', 'cs-bor cs-bor--fa-jobb');
      zt.appendChild(zBal); zt.appendChild(zJobb);
      levelek(zt, 2);
      zaro.insertBefore(zt, zaro.firstChild);
    }
    if (!csend && 'IntersectionObserver' in w && zaro.animate) {
      var zKesz = false;
      /* a bolti gomb látható doboza: az <a> inline és 0 magas, a kép adja a méretet */
      var zGomb = function () { var a = [].filter.call(zaro.querySelectorAll('a[href*="play.google"], a[href*="apps.apple"]'), function (x) { return x.offsetParent !== null; })[0]; return a ? (a.querySelector('img') || a) : null; };
      var hazater = async function () {
        zKesz = true;
        var zr = zaro.getBoundingClientRect(), sin = d.querySelector('.cs-utvonal_madar'), sx, sy;
        var zm = CSI.madar('repdes', 'cs-zaro-csicser cs-ul'); zaro.appendChild(zm);
        if (sin && sin.offsetParent !== null) {
          var sr = sin.getBoundingClientRect(); sx = sr.left + sr.width / 2 - zr.left; sy = sr.bottom - zr.top;
          d.documentElement.classList.add('cs-hazaer');
        } else { sx = zr.width + 60; sy = Math.max(40, innerHeight * 0.25 - zr.top); }
        hely(zm, sx, sy, false);
        var gomb = zGomb();
        if (gomb) {
          var gr = gomb.getBoundingClientRect(), zr2 = zaro.getBoundingClientRect();
          await repul(zm, gr.left + gr.width * 0.14 - zr2.left, gr.top - zr2.top + 3);
          CSI.poz(zm, 'csicsereg'); await ido(2600);
        }
        var ly = pont(zJobb, 2317, 181, zaro), zw = zaro.clientWidth;
        if (ly && ly.x > 24 && ly.x < zw - 24 && getComputedStyle(zJobb).display !== 'none') {
          await repul(zm, ly.x, ly.y + zm.offsetWidth * 0.25);
          var mh = zm.offsetWidth * 220 / 240;
          var be = zm.animate([{ transform: zm.style.transform, opacity: 1 }, { transform: 'translate(' + (ly.x - zm.offsetWidth / 2) + 'px,' + (ly.y - mh * 0.55) + 'px) scale(.12)', opacity: 0 }], { duration: 480, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
          await be.finished;
        } else { await repul(zm, zw + 90, -80); }
        zm.style.visibility = 'hidden';
      };
      /* akkor indul, amikor a letöltés gomb már látszik (különben a leszállás a képernyőn kívül történne) */
      var figyelt = zGomb() || zaro;
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !zKesz) hazater();
      }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' }).observe(figyelt);
      new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) d.documentElement.classList.remove('cs-hazaer');
      }, { threshold: 0 }).observe(zaro);
    }
  }


  /* 13. Csatlakozás: a fülek fotói helyett Ági elemeiből rakott képek (cég: odú és etető, önkormányzat: fa és etető, iskola: itató és madár) */
  var KINEK = [['odu', 'eteto'], ['fa_sarga', 'eteto'], ['itato', 'poz_alap']];
  [].forEach.call(d.querySelectorAll('.cs_kinek_panel'), function (pn, n) {
    var img = pn.querySelector('.cs_kinek_foto'); if (!img || !KINEK[n] || pn.querySelector('.cs-kinek-illu')) return;
    var kp = elem('<div class="cs_illu_panel cs-kinek-illu"></div>');
    KINEK[n].forEach(function (nev) { kp.appendChild(CSI.illu(nev)); });
    img.parentNode.insertBefore(kp, img); img.classList.add('cs_foto_rejtett');
  });

  /* 14. Belépés: szekciónként a szalag-kicker kibomlik (300 ms), utána a tartalom 12 px-et emelkedik, 60 ms-os lépcsővel.
        Egyszer fut; a végén az osztályok lekerülnek, így a kártyák saját átmenetei érintetlenek. Csökkentett mozgásnál nincs. */
  if (!csend && 'IntersectionObserver' in w) {
    var BE = 'h2, .cs_lead, .main_text, .cs_atkoto, .cs_tenyek > *, .card, .cs_folyamat_lepes, .cs_folyamat_cta, .cs_sziget, .cs_kinek_valaszto, .gyik_item';
    var beIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; var el = e.target; beIo.unobserve(el);
        if (el.classList.contains('cs-kibont')) { el.classList.add('cs-kibont-lat'); setTimeout(function () { el.classList.remove('cs-kibont', 'cs-kibont-lat'); }, 400); return; }
        el.classList.add('cs-be-lat');
        setTimeout(function () { el.classList.remove('cs-be', 'cs-be-lat'); el.style.removeProperty('--cs-i'); }, 360 + (parseInt(el.style.getPropertyValue('--cs-i'), 10) || 0) * 60);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    [].forEach.call(d.querySelectorAll('body > section, body > div.cs_lab'), function (sz) {
      if (sz.matches('.dia_kek_ov.cs:not(.cs_sotet)')) return;
      var k = 0;
      [].forEach.call(sz.querySelectorAll('.cs_kicker'), function (kc) { kc.classList.add('cs-kibont'); beIo.observe(kc); k = 1; });
      [].forEach.call(sz.querySelectorAll(BE), function (el) {
        if (el.parentElement.closest('.cs-be') || el.closest('.cs-utvonal')) return;
        el.classList.add('cs-be'); el.style.setProperty('--cs-i', Math.min(k++, 6)); beIo.observe(el);
      });
    });
    d.documentElement.classList.add('cs-be-on');
  }
})();
