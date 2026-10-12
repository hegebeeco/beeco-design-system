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
      var rajz = poz === 'iszik' ? 'eszeget' : poz;
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
    hero.classList.add('cs-taj');
    var taj = dekor(elem('<div class="cs-taj_hatter"></div>'));
    taj.appendChild(elem('<svg class="cs-taj_domb" viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 120 L180 70 L360 104 L560 52 L760 96 L980 60 L1200 98 L1440 58 V220 H0Z" fill="#FFE2B5"/><path d="M0 170 L220 130 L470 160 L720 118 L980 156 L1220 126 L1440 150 V220 H0Z" fill="#CB9C7E"/><path d="M0 196 L300 176 L640 200 L960 178 L1440 194 V220 H0Z" fill="#A87552"/></svg>'));
    taj.appendChild(CSI.illu('fa_barna', 'cs-taj_fa cs-taj_fa--bal'));
    taj.appendChild(CSI.illu('fa_narancs', 'cs-taj_fa cs-taj_fa--jobb'));
    levelek(taj, 3);
    hero.insertBefore(taj, hero.firstChild);
    var mock = hero.querySelector('.cs_mockup');
    if (mock) {
      var hm = CSI.madar(csend ? 'alap' : 'repdes', 'cs-hero-csicser'); mock.appendChild(hm);
      if (!csend && hm.animate) {
        hm.animate([{ transform: 'translate(-260px,-220px)' }, { transform: 'translate(-120px,-150px)', offset: 0.5 }, { transform: 'translate(0,0)' }], { duration: 1500, easing: 'cubic-bezier(.23,1,.32,1)' })
          .finished.then(function () { CSI.poz(hm, 'alap'); });
      }
    }
  }

  /* 4. Kártyák: a fotók helyén Ági illusztrációi (itatás, etetés, odú) */
  function kepCsere(img, nev) {
    if (!img) return null;
    var p = elem('<div class="cs_illu_panel"></div>'); var s = CSI.illu(nev); p.appendChild(s);
    img.parentNode.insertBefore(p, img); img.classList.add('cs_foto_rejtett'); return s;
  }
  var utvonal = d.querySelector('.dia_green_ov.cs .card.cs_link');
  if (utvonal) kepCsere(utvonal.querySelector('img'), 'itato');
  var harmas = d.querySelectorAll('.cs_harmas > .card'), kellekek = [];
  if (harmas.length === 3) kellekek = [kepCsere(harmas[0].querySelector('img'), 'itato'), kepCsere(harmas[1].querySelector('img'), 'eteto'), kepCsere(harmas[2].querySelector('img'), 'odu')];

  /* 5. Látogatások a Gondoskodás kártyáin. Pontok Ági rajzainak koordinátáiban; meret: a madár szélessége a kellék egységében.
        Asztalon egy madár bejárja mindhármat; mobilon az épp látható kártyához repül. Egyszerre egy madár. */
  var szek = kellekek.length === 3 && kellekek[0] && harmas[0].closest('section');
  if (szek) {
    szek.classList.add('cs-latogatas');
    var CEL = [
      { svg: kellekek[0], lab: [178, 40], meret: 210, tukor: false, tett: 'iszik', ido: 3600 },
      { svg: kellekek[1], lab: [34, 156], meret: 128, tukor: true, tett: 'eszeget', ido: 3200 },
      { svg: kellekek[2], lab: [166, 98], meret: 120, tukor: false, tett: 'odu', ido: 2400, lyuk: [166.6, 76.4] }
    ];
    var lm = CSI.madar('alap', 'cs-latogato'); szek.appendChild(lm);
    var fut = false, lathato = false, asztal = w.matchMedia('(min-width: 768px)');
    function meretez(c) { var p = pont(c.svg, 0, 0, szek); if (p) lm.style.width = (c.meret * p.s).toFixed(1) + 'px'; }
    function kint(bal) { var r = szek.getBoundingClientRect(); return { x: bal ? -80 : r.width + 80, y: Math.max(-60, -r.top - 60) }; }
    async function latogat(c) {
      meretez(c); var p = pont(c.svg, c.lab[0], c.lab[1], szek); if (!p) return;
      await repul(lm, p.x, p.y);
      if (c.tett === 'odu') {
        var ly = pont(c.svg, c.lyuk[0], c.lyuk[1], szek), mh = lm.offsetWidth * 220 / 240;
        var be = lm.animate([{ transform: lm.style.transform, opacity: 1 }, { transform: 'translate(' + (ly.x - lm.offsetWidth / 2) + 'px,' + (ly.y - mh * 0.55) + 'px) scale(.12)', opacity: 0 }], { duration: 480, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
        await be.finished; await ido(c.ido); be.reverse(); await be.finished; be.cancel(); hely(lm, p.x, p.y, false);
      } else {
        hely(lm, p.x, p.y, c.tukor); CSI.poz(lm, 'alap'); await ido(260); CSI.poz(lm, c.tett); await ido(c.ido); CSI.poz(lm, 'alap'); await ido(300);
      }
    }
    async function tura() {
      if (fut) return; fut = true; lm.classList.add('cs-repul');
      var k = kint(true); hely(lm, k.x, k.y);
      if (asztal.matches) {
        for (var j = 0; j < CEL.length && lathato; j++) await latogat(CEL[j]);
      } else {
        var r = szek.getBoundingClientRect(), kozep = innerHeight / 2, leg = null, legd = 1e9;
        CEL.forEach(function (c) { var b = c.svg.getBoundingClientRect(), dd = Math.abs(b.top + b.height / 2 - kozep); if (dd < legd) { legd = dd; leg = c; } });
        if (leg && legd < innerHeight / 2) await latogat(leg);
      }
      var ki = kint(false); await repul(lm, ki.x, ki.y);
      lm.classList.remove('cs-repul'); fut = false;
      if (lathato) setTimeout(tura, asztal.matches ? 4000 : 2500);
    }
    if (csend) {
      lm.classList.add('cs-ul');
      var allo = function () { meretez(CEL[1]); var p = pont(CEL[1].svg, CEL[1].lab[0], CEL[1].lab[1], szek); if (p) { hely(lm, p.x, p.y, true); CSI.poz(lm, 'eszeget'); } };
      w.addEventListener('load', allo); w.addEventListener('resize', allo); allo();
    } else if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { lathato = es[0].isIntersecting; if (lathato) tura(); }, { threshold: 0.35 }).observe(harmas[0].parentNode);
    }
  }

  /* 6. Megfigyelés: a 3. lépésnél csicsergő madár */
  var zaroLepes = d.querySelector('.cs_folyamat_lepes--zaro .cs_folyamat_vizual');
  if (zaroLepes) zaroLepes.appendChild(CSI.madar('csicsereg', 'cs-lepes-csicser'));

  /* 7. Közösség: a hírlevél-sziget tetején sétáló madár */
  var sziget = d.querySelector('#fotofal .cs_sziget');
  if (sziget) { var sm = CSI.madar('setalgat', 'cs-setalo'); var sav = elem('<div class="cs-setalo_sav" aria-hidden="true"></div>'); sav.appendChild(sm); sziget.parentNode.insertBefore(sav, sziget); }

  /* 8. Záró jelenet: dombos táj, Ági fái, hulló levelek */
  var zaro = d.getElementById('download');
  if (zaro) {
    zaro.classList.add('cs-taj');
    var zt = dekor(elem('<div class="cs-taj_hatter cs-taj_hatter--zaro"></div>'));
    zt.appendChild(elem('<svg class="cs-taj_domb" viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 130 L240 84 L520 118 L800 70 L1100 112 L1440 76 V220 H0Z" fill="#FEF7DE" opacity=".7"/><path d="M0 182 L360 150 L720 176 L1080 146 L1440 172 V220 H0Z" fill="#CB9C7E"/><path d="M0 204 L480 190 L960 206 L1440 192 V220 H0Z" fill="#A87552"/></svg>'));
    zt.appendChild(CSI.illu('fa_sarga', 'cs-taj_fa cs-taj_fa--bal'));
    zt.appendChild(CSI.illu('fa_keskeny', 'cs-taj_fa cs-taj_fa--jobb'));
    levelek(zt, 2);
    zaro.insertBefore(zt, zaro.firstChild);
  }
})();
