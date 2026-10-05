/* CsicsergŐsz „Raj” modul v1 – közösségi számláló, közös cél, kerületi verseny, fotófal.
   Gyökérelemek a Webflow-ban: data-cs-raj="szamlalo|cel|verseny|fotofal" (bennük egy betöltés-szöveg, ami JS nélkül is látszik).
   Adatforrás: a szamlalo gyökér data-cs-raj-forras attribútuma (a Designerben átírható); ha nincs, a mintaadat.
   Adatszerződés: raj-adat-szerzodes.md. Mintaadatnál ("minta": true) minden blokk „Mintaadat” címkét kap. */
(function () {
  var d = document;
  var gyokerek = d.querySelectorAll('[data-cs-raj]');
  if (!gyokerek.length) return;
  var MINTA = 'https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@v1.45.0/weboldal/kampany-csicsergosz/raj-minta.json';
  var forrasEl = d.querySelector('[data-cs-raj-forras]');
  var forras = (forrasEl && forrasEl.getAttribute('data-cs-raj-forras')) || window.CS_RAJ_FORRAS || MINTA;
  var csend = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EON = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/6ac3fb1c06c658f239147846_cs-eon-fekete.png';

  function gy(nev) { return d.querySelector('[data-cs-raj="' + nev + '"]'); }
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sz(n) { return Number(n || 0).toLocaleString('hu-HU'); }
  function kuld(nev, p) { if (typeof window.gtag === 'function') window.gtag('event', nev, p || {}); (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: nev }, p || {})); }
  function datum(s) { try { return new Date(s).toLocaleString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (x) { return ''; } }
  function latszik(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { io.disconnect(); fn(); } }); }, { threshold: 0.25 });
    io.observe(el);
  }
  function porog(el, cel) {
    if (csend) { el.textContent = sz(cel); return; }
    var hossz = parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--_csicsergosz---cs-ido-szamlalo-ms')) || 1200, t0 = null;
    function lep(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / hossz, 1); el.textContent = sz(Math.round(cel * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(lep); }
    requestAnimationFrame(lep);
  }
  function minta(data) { return data.minta ? '<p class="cs_raj_minta" role="note">Mintaadat: a számok még nem valósak, az élő adat a beeco appból jön.</p>' : ''; }

  /* 1. Számláló */
  function szamlalo(el, data) {
    var s = data.szamlalo || {};
    var sor = [['itato', 'madáritató'], ['eteto', 'madáretető'], ['odu', 'madárodú'], ['megfigyeles', 'madármegfigyelés'], ['resztvevo', 'résztvevő']];
    el.innerHTML = minta(data) + '<ul class="cs_raj_csempek">' + sor.map(function (k) {
      return '<li class="cs_raj_csempe"><span class="cs_raj_szam" data-ertek="' + (Number(s[k[0]]) || 0) + '">' + sz(s[k[0]]) + '</span><span class="cs_raj_cimke">' + k[1] + '</span></li>';
    }).join('') + '</ul>' + (data.frissitve ? '<p class="cs_raj_frissitve">Frissítve: ' + e(datum(data.frissitve)) + '</p>' : '');
    var szamok = el.querySelectorAll('.cs_raj_szam');
    if (!csend) szamok.forEach(function (x) { x.textContent = '0'; });
    latszik(el, function () { szamok.forEach(function (x) { porog(x, Number(x.getAttribute('data-ertek'))); }); });
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

  /* 3. Kerületek versenye: sematikus méhsejt-térkép (minden hatszög egy kerület) + ranglista */
  var RACS = { III: [0, 1], XIII: [0, 2], IV: [0, 3], XV: [0, 4], XVI: [0, 5], II: [1, 0], I: [1, 1], V: [1, 2], VI: [1, 3], XIV: [1, 4], XVII: [1, 5],
    XII: [2, 0], XI: [2, 1], VII: [2, 2], VIII: [2, 3], X: [2, 4], XVIII: [2, 5], XXII: [3, 1], IX: [3, 2], XIX: [3, 3], XX: [3, 4], XXI: [4, 2], XXIII: [4, 3] };
  function verseny(el, data) {
    var ker = (data.keruletek || []).slice().sort(function (a, b) { return b.pont - a.pont; });
    var var_ = (data.varosok || []).slice().sort(function (a, b) { return b.pont - a.pont; });
    ker.forEach(function (k, i) { k.hely = i + 1; });
    var max = ker.length ? ker[0].pont : 1;
    var R = 34, W = Math.sqrt(3) * R, H = 1.5 * R;
    function poz(sor, osz) { return [W * osz + (sor % 2 ? W / 2 : 0) + W / 2 + 4, H * sor + R + 4]; }
    function hatszog(cx, cy) { var p = []; for (var i = 0; i < 6; i++) { var a = Math.PI / 180 * (60 * i - 30); p.push((cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1)); } return p.join(' '); }
    function sav(k) { return Math.min(5, 1 + Math.floor((k.pont / max) * 4.999)); }
    var svg = '<svg class="cs_raj_terkep" viewBox="0 0 ' + Math.ceil(W * 6.6 + 8) + ' ' + Math.ceil(H * 4 + 2 * R + 8) + '" role="group" aria-label="Budapest kerületei, sematikus térkép">' +
      ker.map(function (k) {
        var r = RACS[k.kod]; if (!r) return ''; var p = poz(r[0], r[1]);
        return '<g class="cs_raj_hex is-' + sav(k) + '" tabindex="0" role="button" data-kod="' + e(k.kod) + '" aria-label="' + e(k.nev) + ', ' + k.hely + '. hely, ' + sz(k.pont) + ' pont">' +
          '<polygon points="' + hatszog(p[0], p[1]) + '"></polygon><text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 5).toFixed(1) + '">' + e(k.kod) + '</text></g>';
      }).join('') + '</svg>';
    function lista(sorok, max_) { return '<ol class="cs_raj_lista">' + sorok.map(function (k, i) {
      return '<li class="cs_raj_lista_sor"><span class="cs_raj_lista_hely">' + (i + 1) + '.</span><span class="cs_raj_lista_nev">' + e(k.nev) + '</span><span class="cs_raj_lista_sav"><span style="width:' + Math.round(k.pont / max_ * 100) + '%"></span></span><span class="cs_raj_lista_pont">' + sz(k.pont) + '</span></li>'; }).join('') + '</ol>'; }
    el.innerHTML = minta(data) +
      '<div class="cs_raj_fulek" role="tablist" aria-label="Ranglista">' +
      '<button type="button" role="tab" class="cs_raj_ful" aria-selected="true" aria-controls="cs-raj-bp" id="cs-raj-ful-bp">Budapest</button>' +
      '<button type="button" role="tab" class="cs_raj_ful" aria-selected="false" aria-controls="cs-raj-varos" id="cs-raj-ful-varos" tabindex="-1">Városok</button></div>' +
      '<div class="cs_raj_panel" role="tabpanel" id="cs-raj-bp" aria-labelledby="cs-raj-ful-bp"><div class="cs_raj_verseny_racs">' +
      '<div class="cs_raj_terkep_doboz">' + svg + '<p class="cs_raj_jelmagyarazat"><span>kevesebb pont</span><i class="is-1"></i><i class="is-2"></i><i class="is-3"></i><i class="is-4"></i><i class="is-5"></i><span>több pont</span></p></div>' +
      '<div class="cs_raj_verseny_jobb"><label class="cs_raj_valaszto_cimke" for="cs-raj-ker">A te kerületed</label><select id="cs-raj-ker" class="cs_raj_valaszto">' +
      ker.map(function (k) { return '<option value="' + e(k.kod) + '">' + e(k.nev) + '</option>'; }).join('') + '</select>' +
      '<div class="cs_raj_info" aria-live="polite"></div><p class="cs_raj_lista_cim">Az élmezőny</p>' + lista(ker.slice(0, 5), max) + '</div></div></div>' +
      '<div class="cs_raj_panel" role="tabpanel" id="cs-raj-varos" aria-labelledby="cs-raj-ful-varos" hidden>' + lista(var_.slice(0, 10), var_.length ? var_[0].pont : 1) + '</div>';
    var info = el.querySelector('.cs_raj_info'), sel = el.querySelector('select'), hexek = el.querySelectorAll('.cs_raj_hex');
    function valaszt(kod, meres) {
      var k = ker.filter(function (x) { return x.kod === kod; })[0]; if (!k) return;
      hexek.forEach(function (h) { h.setAttribute('aria-pressed', h.getAttribute('data-kod') === kod ? 'true' : 'false'); });
      sel.value = kod;
      var elotte = ker[k.hely - 2];
      info.innerHTML = '<p class="cs_raj_info_nev">' + e(k.nev) + '</p><p class="cs_raj_info_hely"><strong>' + k.hely + '.</strong> hely · <strong>' + sz(k.pont) + '</strong> pont</p>' +
        '<p class="cs_raj_info_bont">' + sz(k.itato) + ' itató · ' + sz(k.eteto) + ' etető · ' + sz(k.odu) + ' odú · ' + sz(k.megfigyeles) + ' megfigyelés</p>' +
        (elotte ? '<p class="cs_raj_info_hajra">Még <strong>' + sz(elotte.pont - k.pont + 1) + '</strong> pont, és megelőzitek: ' + e(elotte.nev) + '.</p>' : '<p class="cs_raj_info_hajra">Ti vezetitek a versenyt. Tartsátok meg!</p>');
      if (meres) kuld('campaign_district_select', { district: kod });
    }
    hexek.forEach(function (h) {
      h.addEventListener('click', function () { valaszt(h.getAttribute('data-kod'), true); });
      h.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); valaszt(h.getAttribute('data-kod'), true); } });
    });
    sel.addEventListener('change', function () { valaszt(sel.value, true); });
    if (ker.length) valaszt(ker[0].kod, false);
    var fulek = el.querySelectorAll('.cs_raj_ful');
    function ful(i, meres) {
      fulek.forEach(function (f, j) { f.setAttribute('aria-selected', i === j ? 'true' : 'false'); f.tabIndex = i === j ? 0 : -1; d.getElementById(f.getAttribute('aria-controls')).hidden = i !== j; });
      if (meres) kuld('campaign_leaderboard_tab', { tab: i ? 'varosok' : 'budapest' });
    }
    fulek.forEach(function (f, i) {
      f.addEventListener('click', function () { ful(i, true); });
      f.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { ev.preventDefault(); var j = (i + (ev.key === 'ArrowRight' ? 1 : fulek.length - 1)) % fulek.length; ful(j, true); fulek[j].focus(); } });
    });
  }

  /* 6. Fotófal */
  function fotofal(el, data) {
    var f = (data.fotok || []).slice(0, 8);
    el.innerHTML = minta(data) + '<ul class="cs_raj_fotok">' + f.map(function (x) {
      return '<li class="cs_raj_foto"><figure><img src="' + e(x.kep) + '" alt="' + e(x.faj + (x.hely ? ', ' + x.hely : '')) + '" loading="lazy" style="object-position:' + e(x.fokusz || '50% 50%') + '">' +
        '<figcaption><span class="cs_raj_faj">' + e(x.faj) + '</span><span class="cs_raj_hely">' + e(x.hely || '') + '</span>' + (x.szerzo ? '<span class="cs_raj_szerzo">Fotó: ' + e(x.szerzo) + '</span>' : '') + '</figcaption></figure></li>';
    }).join('') + '</ul>';
  }

  function hiba() { gyokerek.forEach(function (g) { if (!g.querySelector('.cs_raj_csempek,.cs_raj_sav,.cs_raj_fulek,.cs_raj_fotok')) g.setAttribute('data-cs-raj-allapot', 'hiba'); }); }
  fetch(forras, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (data) {
    var t = { szamlalo: szamlalo, cel: cel, verseny: verseny, fotofal: fotofal };
    gyokerek.forEach(function (g) { var f = t[g.getAttribute('data-cs-raj')]; if (f) { try { f(g, data); g.setAttribute('data-cs-raj-allapot', data.minta ? 'minta' : 'elo'); } catch (x) { g.setAttribute('data-cs-raj-allapot', 'hiba'); } } });
  }).catch(hiba);
})();
