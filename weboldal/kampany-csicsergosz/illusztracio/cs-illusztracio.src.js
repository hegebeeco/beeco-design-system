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
  ].forEach(function (x) { var s = d.querySelector(x[0]); if (s) { s.classList.add('cs-van-domb'); s.insertBefore(elem(domb(x[1])), s.firstChild); } });

  function levelek(tartaly, db) {
    for (var i = 0; i < db; i++) tartaly.appendChild(dekor(elem('<i class="cs-hullo cs-hullo--' + (i + 1) + '"></i>')));
  }

  /* 3. Hero: kétszintes szalagcím, dombos táj, Ági fái, hulló levelek, érkező madár */
  var hero = d.querySelector('.dia_kek_ov.cs');
  if (hero) {
    var h1 = hero.querySelector('h1'), t = h1 && h1.textContent.trim(), i = t ? t.indexOf('. ') : -1;
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
    var taj = dekor(elem('<div class="cs-taj_hatter"></div>'));
    var rDomb = elem(SVG.bor_domb); rDomb.setAttribute('class', 'cs-bor cs-bor--domb'); taj.appendChild(dekor(rDomb));
    var rBal = CSI.illu('bor_fa_bal', 'cs-bor cs-bor--fa-bal'), rJobb = CSI.illu('bor_fa_jobb', 'cs-bor cs-bor--fa-jobb');
    taj.appendChild(rBal); taj.appendChild(rJobb);
    levelek(taj, 3);
    hero.insertBefore(taj, hero.firstChild);
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
      var hm = CSI.madar(csend ? 'alap' : 'repdes', 'cs-hero-csicser'); mock.appendChild(hm);
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
    var p = elem('<div class="cs_illu_panel"></div>'); var s = CSI.illu(nev); p.appendChild(s);
    img.parentNode.insertBefore(p, img); img.classList.add('cs_foto_rejtett'); return s;
  }
  var utvonal = d.querySelector('.dia_green_ov.cs .card.cs_link');
  if (utvonal) {
    var uImg = utvonal.querySelector('img');
    if (uImg) {
      var ciklus = elem('<div class="cs_illu_panel cs-ciklus" aria-hidden="true"></div>');
      [1, 2, 3].forEach(function (n) { var k = d.createElement('img'); k.src = ALAP + 'illusztracio/kepek/itatas-' + n + '.webp'; k.alt = ''; k.decoding = 'async'; ciklus.appendChild(k); });
      uImg.parentNode.insertBefore(ciklus, uImg); uImg.classList.add('cs_foto_rejtett'); figyel(ciklus);
    }
  }
  var harmas = d.querySelectorAll('.cs_harmas > .card'), kellekek = [];
  if (harmas.length === 3) kellekek = [kepCsere(harmas[0].querySelector('img'), 'itato'), kepCsere(harmas[1].querySelector('img'), 'eteto'), kepCsere(harmas[2].querySelector('img'), 'odu')];

  /* 5. Gondoskodás: egy madár ül az itatón és iszik (álló póz). Repülés itt nincs: a főszereplő az útvonalon kísér.
        Pont Ági itató-rajzának koordinátáiban; meret: a madár szélessége a kellék egységében. */
  var szek = kellekek.length === 3 && kellekek[0] && harmas[0].closest('section');
  if (szek) {
    szek.classList.add('cs-latogatas');
    var CEL = { svg: kellekek[0], lab: [178, 40], meret: 210 };
    var lm = CSI.madar('alap', 'cs-latogato cs-ul'); szek.appendChild(lm);
    var ulteti = function () {
      var p0 = pont(CEL.svg, 0, 0, szek), p = pont(CEL.svg, CEL.lab[0], CEL.lab[1], szek); if (!p || !p0) return;
      lm.style.width = (CEL.meret * p0.s).toFixed(1) + 'px'; hely(lm, p.x, p.y, false); CSI.poz(lm, csend ? 'alap' : 'iszik');
    };
    w.addEventListener('load', ulteti); w.addEventListener('resize', ulteti); ulteti();
  }

  /* 6. Megfigyelés: a Webflow a stílus nélküli osztályokat eldobta, ezért a lépések szöveg- és képrészét itt jelöljük meg. */
  [].forEach.call(d.querySelectorAll('.cs_folyamat_lepes'), function (l) {
    var ui = l.querySelector('.cs_folyamat_ui'); if (ui) ui.parentNode.classList.add('cs_folyamat_vizual');
    if (l.firstElementChild && l.firstElementChild !== (ui && ui.parentNode)) l.firstElementChild.classList.add('cs_folyamat_szoveg');
  });
  /* a 3. lépésnél csicsergő madár */
  var zaroLepes = d.querySelector('.cs_folyamat_lepes--zaro .cs_folyamat_vizual');
  if (zaroLepes) zaroLepes.appendChild(CSI.madar('csicsereg', 'cs-lepes-csicser'));

  /* 7. Közösség: a hírlevél-sziget tetején ülő madár (álló póz, pislog) */
  var sziget = d.querySelector('#fotofal .cs_sziget');
  if (sziget) { var sm = CSI.madar('alap', 'cs-setalo'); var sav = elem('<div class="cs-setalo_sav" aria-hidden="true"></div>'); sav.appendChild(sm); sziget.parentNode.insertBefore(sav, sziget); }

  /* 9. „Miért fontos” piktogramjai Ági stílusában (a régi matricák helyén, azonos magassággal) */
  var PIKTO = ['pikto_rovarok', 'pikto_vadvirag', 'pikto_elohely'];
  [].forEach.call(d.querySelectorAll('.cs_horgony .cs_teny'), function (t, n) {
    var img = t.querySelector('img'); if (!img || !PIKTO[n]) return;
    img.parentNode.insertBefore(CSI.illu(PIKTO[n], 'cs_teny_ikon cs-pikto'), img); img.classList.add('cs_foto_rejtett');
  });

  /* 10. Ági szaggatott repülési hurkai: görgetésre rajzolódnak ki (maszkolt szaggatott vonal). */
  var hurkok = [], hId = 0;
  function hurok(kont, kulcs, osztaly) {
    if (!kont || !SVG[kulcs]) return;
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
  if (elso) { var kam = figyel(dekor(elem('<div class="cs-kamera"><i class="cs-kamera_s cs-kamera_s--bf"></i><i class="cs-kamera_s cs-kamera_s--jf"></i><i class="cs-kamera_s cs-kamera_s--ba"></i><i class="cs-kamera_s cs-kamera_s--ja"></i><i class="cs-kamera_vaku"></i></div>'))); elso.appendChild(kam); }

  /* 12. Gabee teljes szettje a borítóból: távcső és könyvek együtt (Levi kérése) */
  var gImg = d.querySelector('#fotofal .cs_gabee_kep');
  if (gImg && SVG.bor_gabee) { gImg.parentNode.insertBefore(CSI.illu('bor_gabee', 'cs_gabee_kep cs-gabee-szett'), gImg); gImg.classList.add('cs_foto_rejtett'); }

  /* 8. Záró jelenet: Ági borítójának tükörképe alkonyatban. A főszereplő az útvonalról leszáll a letöltés gombra,
        csicsereg, majd hazarepül az odúba: így zárul a hero íve (kirepült, végigkísért, hazaért). */
  var zaro = d.getElementById('download');
  if (zaro) {
    zaro.classList.add('cs-taj', 'cs-taj--alkony');
    var zt = dekor(elem('<div class="cs-taj_hatter cs-taj_hatter--zaro"></div>'));
    var zDomb = elem(SVG.bor_domb); zDomb.setAttribute('class', 'cs-bor cs-bor--domb cs-bor--zaro'); zt.appendChild(dekor(zDomb));
    var zBal = CSI.illu('bor_fa_bal', 'cs-bor cs-bor--fa-bal'), zJobb = CSI.illu('bor_fa_jobb', 'cs-bor cs-bor--fa-jobb');
    zt.appendChild(zBal); zt.appendChild(zJobb);
    levelek(zt, 2);
    zaro.insertBefore(zt, zaro.firstChild);
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
    var img = pn.querySelector('.cs_kinek_foto'); if (!img || !KINEK[n]) return;
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
