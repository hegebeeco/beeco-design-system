/* CsicsergŐsz „Raj” modul v2 – országos számok (hero), közösségi számláló, közös cél, kerületi és települési verseny
   (valódi minitérkép), fotófal (egysoros, folyamatosan haladó sáv).
   Gyökérelemek a Webflow-ban: data-cs-raj="orszagos|szamlalo|cel|verseny|fotofal" (bennük egy betöltés-szöveg, ami JS nélkül is látszik).
   Adatforrás: a szamlalo gyökér data-cs-raj-forras attribútuma (a Designerben átírható); ha nincs, a mintaadat.
   Térkép: cs-terkep.json (Budapest kerületei az OpenStreetMap határaiból, Magyarország körvonala), egyszerűsített SVG-útvonalak.
   Adatszerződés: raj-adat-szerzodes.md. Mintaadatnál ("minta": true) minden blokk „Mintaadat” címkét kap. */
(function () {
  var d = document;
  var gyokerek = d.querySelectorAll('[data-cs-raj]');
  if (!gyokerek.length) return;
  /* Az adatfájlok ugyanonnan töltődnek, ahonnan ez a szkript (ág, verzió vagy helyi teszt), így a cím sehol nincs beégetve. */
  var sajat = (d.currentScript && d.currentScript.src) || '';
  var ALAP = sajat ? sajat.replace(/[^/?#]+(\?.*)?$/, '') : 'https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@main/weboldal/kampany-csicsergosz/';
  var MINTA = ALAP + 'raj-minta.json', TERKEP = ALAP + 'cs-terkep.json';
  var forrasEl = d.querySelector('[data-cs-raj-forras]');
  var forras = window.CS_RAJ_FORRAS || MINTA;
  if (forrasEl) { var fa = forrasEl.getAttribute('data-cs-raj-forras') || ''; if (fa && fa.indexOf('/raj-minta.json') < 0) forras = fa; }
  var csend = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/';
  var EON = CDN + '6ac3fb1c06c658f239147846_cs-eon-fekete.png';
  var IKON = {
    itato: CDN + '6ac627b278c620e82f2a729b_cs-ikon-madaritato.webp',
    eteto: CDN + '6ac627b22cdd12e88746143c_cs-ikon-madareteto.webp',
    odu: CDN + '6ac627b356f443adf909d48c_cs-ikon-madarodu.webp',
    megfigyeles: CDN + '6ac3dfe27bb4b6bc0902cfe5_csicsergosz-meh-tavcso.webp',
    resztvevo: CDN + '6ac3dfe2375e7044a20820d6_csicsergosz-meh-kalap.webp'
  };

  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sz(n) { return Number(n || 0).toLocaleString('hu-HU'); }
  function kuld(nev, p) { if (typeof window.gtag === 'function') window.gtag('event', nev, p || {}); }
  function datum(s) { try { return new Date(s).toLocaleString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (x) { return ''; } }
  function latszik(el, fn, kuszob) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { io.disconnect(); fn(); } }); }, { threshold: kuszob || 0.25 });
    io.observe(el);
  }
  /* Felpörgő szám: ease-out, a végén pontos érték; utótag (pl. „+”) a végén jelenik meg. */
  function porog(el, cel, utotag, kesleltetes) {
    utotag = utotag || '';
    if (csend) { el.textContent = sz(cel) + utotag; return; }
    var hossz = parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--_csicsergosz---cs-ido-szamlalo-ms')) || 1200, t0 = null;
    function lep(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / hossz, 1); el.textContent = sz(Math.round(cel * (1 - Math.pow(1 - p, 3)))) + (p === 1 ? utotag : ''); if (p < 1) requestAnimationFrame(lep); }
    setTimeout(function () { requestAnimationFrame(lep); }, kesleltetes || 0);
  }
  function minta(data) { return data.minta ? '<p class="cs_raj_minta" role="note">Mintaadat: a számok még nem valósak, az élő adat a beeco appból jön.</p>' : ''; }

  /* 0. Országos számok a heróban: letöltés (publikált szám) + kint lévő itatók, etetők, odúk és a heti növekmény */
  function orszagos(el, data) {
    var o = data.orszagos || {}, s = data.szamlalo || {};
    var kint = (Number(s.itato) || 0) + (Number(s.eteto) || 0) + (Number(s.odu) || 0);
    var h = o.heti || {}, heti = (Number(h.itato) || 0) + (Number(h.eteto) || 0) + (Number(h.odu) || 0);
    el.innerHTML = '<ul class="cs_orsz">' +
      (o.letoltes ? '<li class="cs_orsz_elem"><span class="cs_orsz_szam" data-ertek="' + Number(o.letoltes) + '" data-utotag="+">' + sz(o.letoltes) + '+</span><span class="cs_orsz_cimke">letöltés</span></li>' : '') +
      '<li class="cs_orsz_elem"><span class="cs_orsz_szam" data-ertek="' + kint + '">' + sz(kint) + '</span><span class="cs_orsz_cimke">kint lévő itató, etető és odú</span>' +
      (heti ? '<span class="cs_orsz_heti">+' + sz(heti) + ' ezen a héten</span>' : '') +
      (data.minta ? '<span class="cs_orsz_minta">mintaadat</span>' : '') + '</li></ul>';
    var szamok = el.querySelectorAll('.cs_orsz_szam');
    if (!csend) szamok.forEach(function (x) { x.textContent = '0'; });
    latszik(el, function () { szamok.forEach(function (x, i) { porog(x, Number(x.getAttribute('data-ertek')), x.getAttribute('data-utotag') || '', i * 250); }); }, 0.1);
  }

  /* 1. Számláló: piktogramos csempék, egymás után beúszva és felpörögve */
  function szamlalo(el, data) {
    var s = data.szamlalo || {};
    var sor = [['itato', 'madáritató'], ['eteto', 'madáretető'], ['odu', 'madárodú'], ['megfigyeles', 'madármegfigyelés'], ['resztvevo', 'résztvevő']];
    el.innerHTML = minta(data) + '<ul class="cs_raj_csempek">' + sor.map(function (k, i) {
      return '<li class="cs_raj_csempe" style="--i:' + i + '"><img class="cs_raj_ikon" src="' + IKON[k[0]] + '" alt="" width="56" height="56" loading="lazy">' +
        '<span class="cs_raj_szam" data-ertek="' + (Number(s[k[0]]) || 0) + '">' + sz(s[k[0]]) + '</span><span class="cs_raj_cimke">' + k[1] + '</span></li>';
    }).join('') + '</ul>' + (data.frissitve ? '<p class="cs_raj_frissitve">Frissítve: ' + e(datum(data.frissitve)) + '</p>' : '');
    var lista = el.querySelector('.cs_raj_csempek'), szamok = el.querySelectorAll('.cs_raj_szam');
    if (csend) return;
    lista.classList.add('is-var');
    szamok.forEach(function (x) { x.textContent = '0'; });
    latszik(el, function () {
      lista.classList.remove('is-var');
      szamok.forEach(function (x, i) { porog(x, Number(x.getAttribute('data-ertek')), '', 120 + i * 260); });
    });
  }

  /* 2. Közös cél */
  function cel(el, data) {
    var c = data.cel; if (!c) return;
    var pct = Math.max(0, Math.min(100, Math.round((c.allas / c.cel) * 100)));
    var hatra = Math.max(0, c.cel - c.allas);
    el.innerHTML = '<div class="cs_raj_cel_fej"><p class="cs_raj_cel_cim">' + e(c.cim) + '</p>' +
      (c.szponzor ? '<p class="cs_raj_cel_szponzor">támogatja <img src="' + EON + '" alt="' + e(c.szponzor) + '" width="88" height="26" loading="lazy"></p>' : '') + '</div>' +
      '<div class="cs_raj_sav" role="progressbar" aria-valuemin="0" aria-valuemax="' + c.cel + '" aria-valuenow="' + c.allas + '" aria-label="' + e(c.cim) + ': ' + sz(c.allas) + ' / ' + sz(c.cel) + '">' +
      '<span class="cs_raj_sav_toltes" style="width:' + pct + '%"></span>' +
      [25, 50, 75].map(function (m) { return '<span class="cs_raj_sav_jel" style="left:' + m + '%"></span>'; }).join('') + '</div>' +
      '<p class="cs_raj_cel_allas"><strong>' + sz(c.allas) + '</strong> / ' + sz(c.cel) + ' · ' + pct + '%' + (c.hatarido ? ' · határidő: ' + e(new Date(c.hatarido).toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' })) : '') + '</p>' +
      (hatra ? '<p class="cs_raj_cel_hatra">Még <strong>' + sz(hatra) + '</strong>, és ' + e(c.jutalom || 'teljesül a közös cél') + '.</p>' : '<p class="cs_raj_cel_hatra"><strong>Megvan!</strong> ' + e(c.jutalom || '') + '</p>');
    var t = el.querySelector('.cs_raj_sav_toltes');
    if (!csend) { t.classList.add('is-var'); latszik(el, function () { t.classList.remove('is-var'); }); }
  }

  /* 3. Kerületek és települések versenye: valódi minitérkép (OSM-határok) + ranglista + megosztás */
  var terkepIgeret = null;
  function terkepAdat() { return terkepIgeret || (terkepIgeret = fetch(TERKEP).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })); }
  function verseny(el, data) {
    var ker = (data.keruletek || []).slice().sort(function (a, b) { return b.pont - a.pont; });
    var var_ = (data.varosok || []).slice().sort(function (a, b) { return b.pont - a.pont; });
    ker.forEach(function (k, i) { k.hely = i + 1; });
    var max = ker.length ? ker[0].pont : 1, vmax = var_.length ? var_[0].pont : 1;
    function sav(p, m) { return Math.min(5, 1 + Math.floor((p / m) * 4.999)); }
    function lista(sorok, max_) { return '<ol class="cs_raj_lista">' + sorok.map(function (k, i) {
      return '<li class="cs_raj_lista_sor"><span class="cs_raj_lista_hely">' + (i + 1) + '.</span><span class="cs_raj_lista_nev">' + e(k.nev) + '</span><span class="cs_raj_lista_sav"><span style="width:' + Math.round(k.pont / max_ * 100) + '%"></span></span><span class="cs_raj_lista_pont">' + sz(k.pont) + '</span></li>'; }).join('') + '</ol>'; }
    var jelm = '<p class="cs_raj_jelmagyarazat"><span>kevesebb pont</span><i class="is-1"></i><i class="is-2"></i><i class="is-3"></i><i class="is-4"></i><i class="is-5"></i><span>több pont</span></p>';
    el.innerHTML = minta(data) +
      '<div class="cs_raj_fulek" role="tablist" aria-label="Ranglista">' +
      '<button type="button" role="tab" class="cs_raj_ful" aria-selected="true" aria-controls="cs-raj-bp" id="cs-raj-ful-bp">Budapest</button>' +
      '<button type="button" role="tab" class="cs_raj_ful" aria-selected="false" aria-controls="cs-raj-varos" id="cs-raj-ful-varos" tabindex="-1">Települések</button></div>' +
      '<div class="cs_raj_panel" role="tabpanel" id="cs-raj-bp" aria-labelledby="cs-raj-ful-bp"><div class="cs_raj_verseny_racs">' +
      '<div class="cs_raj_terkep_doboz"><div class="cs_raj_terkep_hely" data-terkep="bp"></div>' + jelm + '</div>' +
      '<div class="cs_raj_verseny_jobb"><label class="cs_raj_valaszto_cimke" for="cs-raj-ker">A te kerületed</label><select id="cs-raj-ker" class="cs_raj_valaszto">' +
      ker.map(function (k) { return '<option value="' + e(k.kod) + '">' + e(k.nev) + '</option>'; }).join('') + '</select>' +
      '<div class="cs_raj_info" aria-live="polite"></div>' +
      '<button type="button" class="cs_raj_megoszt">Hívd be a kerületed</button><p class="cs_raj_megoszt_uzenet" aria-live="polite"></p>' +
      '<p class="cs_raj_lista_cim">Az élmezőny</p>' + lista(ker.slice(0, 5), max) + '</div></div></div>' +
      '<div class="cs_raj_panel" role="tabpanel" id="cs-raj-varos" aria-labelledby="cs-raj-ful-varos" hidden><div class="cs_raj_verseny_racs">' +
      '<div class="cs_raj_terkep_doboz"><div class="cs_raj_terkep_hely" data-terkep="hu"></div>' + jelm + '</div>' +
      '<div class="cs_raj_verseny_jobb"><p class="cs_raj_lista_cim">A települések élmezőnye</p>' + lista(var_.slice(0, 10), vmax) + '</div></div></div>';

    var info = el.querySelector('.cs_raj_info'), sel = el.querySelector('select'), utak = [], aktiv = null;
    function valaszt(kod, meres) {
      var k = ker.filter(function (x) { return x.kod === kod; })[0]; if (!k) return;
      aktiv = k;
      utak.forEach(function (u) { var on = u.getAttribute('data-kod') === kod; u.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) u.parentNode.insertBefore(u, u.parentNode.querySelector('.cs_raj_terkep_cimke')); });
      var cimke = el.querySelector('.cs_raj_terkep_cimke');
      if (cimke && k.x != null) { cimke.setAttribute('x', k.x); cimke.setAttribute('y', k.y + 8); cimke.textContent = k.kod; }
      sel.value = kod;
      var elotte = ker[k.hely - 2];
      info.innerHTML = '<p class="cs_raj_info_nev">' + e(k.nev) + '</p><p class="cs_raj_info_hely"><strong>' + k.hely + '.</strong> hely · <strong>' + sz(k.pont) + '</strong> pont</p>' +
        '<p class="cs_raj_info_bont">' + sz(k.itato) + ' itató · ' + sz(k.eteto) + ' etető · ' + sz(k.odu) + ' odú · ' + sz(k.megfigyeles) + ' megfigyelés</p>' +
        (elotte ? '<p class="cs_raj_info_hajra">Még <strong>' + sz(elotte.pont - k.pont + 1) + '</strong> pont, és megelőzitek: ' + e(elotte.nev) + '.</p>' : '<p class="cs_raj_info_hajra">Ti vezetitek a versenyt. Tartsátok meg!</p>');
      if (meres) kuld('campaign_district_select', { district: kod });
    }
    sel.addEventListener('change', function () { valaszt(sel.value, true); });

    /* Megosztás: natív megosztás, ha nincs, a szöveg és a link a vágólapra. A link a kiválasztott kerülettel nyílik. */
    var uzenet = el.querySelector('.cs_raj_megoszt_uzenet');
    el.querySelector('.cs_raj_megoszt').addEventListener('click', function () {
      if (!aktiv) return;
      var url = location.origin + location.pathname + '?kerulet=' + encodeURIComponent(aktiv.kod) + '&utm_source=megosztas&utm_medium=social&utm_campaign=csicsergosz#verseny';
      var elotte = ker[aktiv.hely - 2];
      var szoveg = 'A ' + aktiv.nev + ' a ' + aktiv.hely + '. helyen áll a CsicsergŐsz kerületi versenyében' + (elotte ? ', még ' + sz(elotte.pont - aktiv.pont + 1) + ' pont, és megelőzzük: ' + elotte.nev : '') + '. Segíts te is a madaraknak!';
      kuld('campaign_district_share', { district: aktiv.kod });
      if (navigator.share) { navigator.share({ title: 'CsicsergŐsz kerületi verseny', text: szoveg, url: url }).catch(function () {}); return; }
      var kesz = function () { uzenet.textContent = 'A link a vágólapon, küldd el a szomszédaidnak!'; };
      if (navigator.clipboard) navigator.clipboard.writeText(szoveg + ' ' + url).then(kesz, function () { uzenet.textContent = url; });
      else uzenet.textContent = url;
    });

    var fulek = el.querySelectorAll('.cs_raj_ful');
    function ful(i, meres) {
      fulek.forEach(function (f, j) { f.setAttribute('aria-selected', i === j ? 'true' : 'false'); f.tabIndex = i === j ? 0 : -1; d.getElementById(f.getAttribute('aria-controls')).hidden = i !== j; });
      if (meres) kuld('campaign_leaderboard_tab', { tab: i ? 'telepulesek' : 'budapest' });
    }
    fulek.forEach(function (f, i) {
      f.addEventListener('click', function () { ful(i, true); });
      f.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { ev.preventDefault(); var j = (i + (ev.key === 'ArrowRight' ? 1 : fulek.length - 1)) % fulek.length; ful(j, true); fulek[j].focus(); } });
    });

    var kert = (new URLSearchParams(location.search).get('kerulet') || '').toUpperCase();
    terkepAdat().then(function (t) {
      var bp = t.budapest, hu = t.magyarorszag;
      el.querySelector('[data-terkep="bp"]').innerHTML = '<svg class="cs_raj_terkep" viewBox="0 0 ' + bp.w + ' ' + bp.h + '" role="group" aria-label="Budapest kerületei">' +
        ker.map(function (k) {
          var g = bp.keruletek[k.kod]; if (!g) return ''; k.x = g.x; k.y = g.y;
          return '<path class="cs_raj_ker is-' + sav(k.pont, max) + '" d="' + g.d + '" tabindex="0" role="button" data-kod="' + e(k.kod) + '" aria-label="' + e(k.nev) + ', ' + k.hely + '. hely, ' + sz(k.pont) + ' pont"></path>';
        }).join('') + '<text class="cs_raj_terkep_cimke" x="0" y="0" aria-hidden="true"></text></svg>';
      utak = [].slice.call(el.querySelectorAll('.cs_raj_ker'));
      utak.forEach(function (u) {
        u.addEventListener('click', function () { valaszt(u.getAttribute('data-kod'), true); });
        u.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); valaszt(u.getAttribute('data-kod'), true); } });
      });
      var p = hu.vetites; /* [cos(lat0), minx, miny, skála] */
      el.querySelector('[data-terkep="hu"]').innerHTML = '<svg class="cs_raj_terkep" viewBox="0 0 ' + hu.w + ' ' + hu.h + '" role="img" aria-label="Magyarország térképe a települések pontszámával">' +
        '<path class="cs_raj_orszag" d="' + hu.d + '"></path>' +
        var_.map(function (v) {
          if (v.lat == null) return '';
          var x = (v.lon * p[0] - p[1]) * p[3], y = (-v.lat - p[2]) * p[3], r = 8 + 14 * Math.sqrt(v.pont / vmax);
          return '<circle class="cs_raj_varos is-' + sav(v.pont, vmax) + '" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(0) + '"><title>' + e(v.nev) + ': ' + sz(v.pont) + ' pont</title></circle>';
        }).join('') + '</svg>';
      valaszt(ker.some(function (k) { return k.kod === kert; }) ? kert : (ker[0] && ker[0].kod), false);
    }).catch(function () {
      el.querySelectorAll('.cs_raj_terkep_doboz').forEach(function (b) { b.hidden = true; });
      if (ker.length) valaszt(ker[0].kod, false);
    });
  }

  /* 6. Fotófal: egysoros, folyamatosan haladó sáv. A sor kétszer szerepel a hézagmentes körhöz (a másolat rejtett a felolvasó elől).
     Rámutatásra és fókuszra megáll; csökkentett mozgásnál nem mozog, hanem oldalra görgethető. */
  function fotofal(el, data) {
    var f = (data.fotok || []).slice(0, 12);
    function elemek(rejtett) {
      return f.map(function (x) {
        return '<li class="cs_raj_foto"' + (rejtett ? ' aria-hidden="true"' : '') + '><figure><img src="' + e(x.kep) + '" alt="' + (rejtett ? '' : e(x.faj + (x.hely ? ', ' + x.hely : ''))) + '" loading="lazy" style="object-position:' + e(x.fokusz || '50% 50%') + '">' +
          '<figcaption><span class="cs_raj_faj">' + e(x.faj) + '</span><span class="cs_raj_hely">' + e(x.hely || '') + '</span></figcaption></figure></li>';
      }).join('');
    }
    el.innerHTML = minta(data) + '<div class="cs_raj_sav_ablak" tabindex="0" role="region" aria-label="A raj fotói, ' + f.length + ' kép"><ul class="cs_raj_fotok">' + elemek(false) + (csend ? '' : elemek(true)) + '</ul></div>';
  }

  function hiba() { gyokerek.forEach(function (g) { if (!g.querySelector('.cs_orsz,.cs_raj_csempek,.cs_raj_sav,.cs_raj_fulek,.cs_raj_fotok')) g.setAttribute('data-cs-raj-allapot', 'hiba'); }); }
  fetch(forras, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (data) {
    var t = { orszagos: orszagos, szamlalo: szamlalo, cel: cel, verseny: verseny, fotofal: fotofal };
    gyokerek.forEach(function (g) { var f = t[g.getAttribute('data-cs-raj')]; if (f) { try { f(g, data); g.setAttribute('data-cs-raj-allapot', data.minta ? 'minta' : 'elo'); } catch (x) { g.setAttribute('data-cs-raj-allapot', 'hiba'); } } });
  }).catch(hiba);
})();
