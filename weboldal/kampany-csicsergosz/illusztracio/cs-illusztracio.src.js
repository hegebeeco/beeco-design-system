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

  /* 6. Megfigyelés: a Webflow a stílus nélküli osztályokat eldobta, ezért a lépések szöveg- és képrészét itt jelöljük meg. */
  [].forEach.call(d.querySelectorAll('.cs_folyamat_lepes'), function (l) {
    var ui = l.querySelector('.cs_folyamat_ui'); if (ui) ui.parentNode.classList.add('cs_folyamat_vizual');
    if (l.firstElementChild && l.firstElementChild !== (ui && ui.parentNode)) l.firstElementChild.classList.add('cs_folyamat_szoveg');
  });
  /* a 3. lépésnél csicsergő madár */
  var zaroLepes = d.querySelector('.cs_folyamat_lepes--zaro .cs_folyamat_vizual');
  if (zaroLepes) zaroLepes.appendChild(CSI.madar('csicsereg', 'cs-lepes-csicser'));

  /* 7. Közösség: a hírlevél-sziget tetején sétáló madár */
  var sziget = d.querySelector('#fotofal .cs_sziget');
  if (sziget) { var sm = CSI.madar('setalgat', 'cs-setalo'); var sav = elem('<div class="cs-setalo_sav" aria-hidden="true"></div>'); sav.appendChild(sm); sziget.parentNode.insertBefore(sav, sziget); }

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

  /* 8. Záró jelenet: dombos táj, Ági fái, hulló levelek */
  var zaro = d.getElementById('download');
  if (zaro) {
    zaro.classList.add('cs-taj');
    var zt = dekor(elem('<div class="cs-taj_hatter cs-taj_hatter--zaro"></div>'));
    var zDomb = elem(SVG.bor_domb); zDomb.setAttribute('class', 'cs-bor cs-bor--domb cs-bor--zaro'); zt.appendChild(dekor(zDomb));
    zt.appendChild(CSI.illu('fa_sarga', 'cs-taj_fa cs-taj_fa--bal'));
    zt.appendChild(CSI.illu('fa_keskeny', 'cs-taj_fa cs-taj_fa--jobb'));
    levelek(zt, 2);
    zaro.insertBefore(zt, zaro.firstChild);
  }
})();
