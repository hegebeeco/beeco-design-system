/* beeco „Kaptár-kapu” v1 – a Csatlakozz oldal élő blokkjai.
   Gyökerek: data-kk="szamok|feladatok|valaszto|szintek|ranglista|csapatok" (bennük betöltés-szöveg, JS nélkül az látszik).
   Forrás: a szamok gyökér data-kk-forras attribútuma (Designerben átírható); ha nincs, a mintaadat.
   Szerződés: kapu-adat-szerzodes.md. Mintaadatnál ("minta": true) „Mintaadat” címke + a review P1-et ad.
   „Ezt választom” → a jelentkezési űrlap (#onkentes) területe kitöltődik, a fókusz a név mezőre ugrik. */
(function () {
  var d = document, gy = d.querySelectorAll('[data-kk]');
  function kuld(n, p) { if (typeof window.gtag === 'function') window.gtag('event', n, p || {}); else (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: n }, p || {})); }
  /* Oldalszintű CTA-mérés (data-kk-cta): ablakszintű capture figyelő, mert a site Trustindex-szkriptje a horgonykattintást
     megállítja és 150 ms múlva újrakattint; ugyanarra az elemre 600 ms-on belül jövő második kattintás nem számít. */
  var utolso = typeof WeakMap === 'function' ? new WeakMap() : null;
  function szerepCim(a) {
    var it = a.closest('.uui-career02_item'), cim = it && it.querySelector('.main_heading');
    var lw = a.closest('.uui-career02_list-wrapper'), fej = lw && lw.previousElementSibling, raj = fej && fej.querySelector('h2,h3,h4');
    if (cim) return (raj ? raj.textContent.trim() + ' · ' : '') + cim.textContent.trim();
    for (var x = a.parentElement, i = 0; x && i < 5; x = x.parentElement, i++) { var h = x.querySelector('h2,h3,h4'); if (h && h.textContent.trim()) return h.textContent.trim(); } return '';
  }
  /* „Rajok részletesen” harmonika: a duplikált oldalra a Webflow (IX2) interakciója nem jön át, ezért a panelek nyitva
     maradnának. Ha a panelen nincs a Webflow által írt kezdőállapot (style), a modul csukja és nyitja, akadálymentesen. */
  d.querySelectorAll('.uui-career02_job-department').forEach(function (fej, i) {
    var lw = fej.nextElementSibling; if (!lw || !lw.classList.contains('uui-career02_list-wrapper') || lw.getAttribute('style')) return;
    var id = lw.id || ('kk-raj-' + i); lw.id = id; lw.style.display = 'none';
    fej.setAttribute('role', 'button'); fej.setAttribute('tabindex', '0'); fej.setAttribute('aria-expanded', 'false'); fej.setAttribute('aria-controls', id);
    function valt() { var ny = fej.getAttribute('aria-expanded') !== 'true'; fej.setAttribute('aria-expanded', String(ny)); lw.style.display = ny ? '' : 'none'; if (ny) kuld('kapu_raj_lenyitas', { raj: (fej.textContent || '').trim().slice(0, 60) }); }
    fej.addEventListener('click', valt);
    fej.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); valt(); } });
  });
  window.addEventListener('click', function (ev) {
    var t = ev.target && ev.target.closest ? ev.target : null; if (!t) return;
    var a = t.closest('[data-kk-cta]') || t.closest('a[href="#onkentes"]'); if (!a || a.closest('[data-kk]')) return;
    var most = Date.now(); if (utolso) { if (most - (utolso.get(a) || 0) < 600) return; utolso.set(a, most); }
    var cta = a.getAttribute('data-kk-cta');
    if (cta) { kuld(cta === 'kaptar_belepes' ? 'kapu_kaptar_belepes' : 'kapu_cta_click', { cta: cta }); return; }
    /* a „Rajok részletesen” szerepkártyák „Érdekel!” gombja: a szerep neve az űrlap terület-mezőjébe kerül */
    var szerep = szerepCim(a), mezo = d.querySelector('#onkentes [name*="pozi"],#onkentes textarea');
    if (szerep && mezo) { mezo.value = szerep; mezo.dispatchEvent(new Event('input', { bubbles: true })); }
    kuld('kapu_szerep_erdekel', { szerep: szerep });
  }, true);
  if (!gy.length) return;
  var MINTA = 'https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@1.46/weboldal/csatlakozz/kapu-minta.json';
  var fe = d.querySelector('[data-kk-forras]');
  var forras = (fe && fe.getAttribute('data-kk-forras')) || window.KK_FORRAS || MINTA;
  var csend = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sz(n) { return Number(n || 0).toLocaleString('hu-HU'); }
  function minta(data) { return data.minta ? '<p class="kk_minta" role="note">Mintaadat: a számok és a feladatok még nem valósak, az élő adat a Kaptárból jön.</p>' : ''; }
  function latszik(el, fn) { if (!('IntersectionObserver' in window)) { fn(); return; } var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { io.disconnect(); fn(); } }); }, { threshold: 0.3 }); io.observe(el); }
  function porog(el, cel) { if (csend) { el.textContent = sz(cel); return; } var t0 = null; function lep(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1100, 1); el.textContent = sz(Math.round(cel * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(lep); } requestAnimationFrame(lep); }

  /* Űrlap-előtöltés: a meglévő Webflow-űrlap „Milyen területen segítenéd a rajt?” mezője */
  function jelentkezes(szoveg, forrasNev) {
    var urlap = d.getElementById('onkentes');
    var mezo = urlap && urlap.querySelector('[name*="pozi"],textarea');
    if (mezo) { mezo.value = szoveg; mezo.dispatchEvent(new Event('input', { bubbles: true })); }
    if (urlap) { urlap.scrollIntoView({ behavior: csend ? 'auto' : 'smooth', block: 'start' }); var nev = urlap.querySelector('input[name*="name"],input[type="text"]'); if (nev) setTimeout(function () { nev.focus({ preventScroll: true }); }, csend ? 0 : 450); }
    kuld('kapu_jelentkezes_elotoltve', { forras: forrasNev });
  }

  /* 1. Számok */
  function szamok(el, data) {
    var s = data.szamok || {}, sor = [['onkentes', 'aktív önkéntes'], ['nyitott_feladat', 'nyitott feladat'], ['helyi_csapat', 'helyi csapat'], ['rajpont_honap', 'rajpont ebben a hónapban']];
    el.innerHTML = minta(data) + '<ul class="kk_szamok">' + sor.map(function (k) { return '<li class="kk_szam_doboz"><span class="kk_szam" data-ertek="' + (Number(s[k[0]]) || 0) + '">' + sz(s[k[0]]) + '</span><span class="kk_szam_cimke">' + k[1] + '</span></li>'; }).join('') + '</ul>';
    var xs = el.querySelectorAll('.kk_szam'); if (!csend) xs.forEach(function (x) { x.textContent = '0'; });
    latszik(el, function () { xs.forEach(function (x) { porog(x, Number(x.getAttribute('data-ertek'))); }); });
  }

  /* 2. Nyitott feladatok szűrővel */
  var feladatok = [];
  function kartya(f) {
    return '<li class="kk_feladat"><div class="kk_feladat_fej"><span class="kk_raj">' + e(f.raj) + '</span><span class="kk_pont" aria-label="' + f.rajpont + ' rajpont">+' + sz(f.rajpont) + ' rajpont</span></div>' +
      '<h3 class="kk_feladat_cim">' + e(f.cim) + '</h3>' + (f.leiras ? '<p class="kk_feladat_leiras">' + e(f.leiras) + '</p>' : '') +
      '<p class="kk_cimkek"><span>' + e(f.ora) + ' óra</span><span>' + (f.mod === 'helyben' ? 'Helyben' + (f.varos ? ': ' + e(f.varos) : '') : 'Online') + '</span><span>' + (f.eszkoz === 'vibe-code' ? 'Vibe-code' : 'Kézzel') + '</span>' + (f.szint ? '<span>' + e(f.szint) + '</span>' : '') + '</p>' +
      '<button type="button" class="kk_gomb" data-kk-feladat="' + e(f.id) + '">Ezt választom</button></li>';
  }
  function feladatLista(el, data) {
    feladatok = data.feladatok || [];
    var rajok = []; feladatok.forEach(function (f) { if (rajok.indexOf(f.raj) < 0) rajok.push(f.raj); });
    el.innerHTML = minta(data) +
      '<div class="kk_szurok" role="group" aria-label="Feladatok szűrése">' +
      '<label class="kk_szuro"><span>Raj</span><select data-kk-szuro="raj"><option value="">Mind</option>' + rajok.map(function (r) { return '<option>' + e(r) + '</option>'; }).join('') + '</select></label>' +
      '<label class="kk_szuro"><span>Hol</span><select data-kk-szuro="mod"><option value="">Mindegy</option><option value="online">Online</option><option value="helyben">Helyben</option></select></label>' +
      '<label class="kk_szuro"><span>Hogyan</span><select data-kk-szuro="eszkoz"><option value="">Mindegy</option><option value="kezi">Kézzel</option><option value="vibe-code">Vibe-code</option></select></label></div>' +
      '<p class="kk_talalat" aria-live="polite"></p><ul class="kk_feladatok"></ul>';
    var lista = el.querySelector('.kk_feladatok'), talalat = el.querySelector('.kk_talalat'), szurok = el.querySelectorAll('[data-kk-szuro]');
    function rajzol(meres) {
      var f = {}; szurok.forEach(function (s) { f[s.getAttribute('data-kk-szuro')] = s.value; });
      var x = feladatok.filter(function (t) { return (!f.raj || t.raj === f.raj) && (!f.mod || t.mod === f.mod) && (!f.eszkoz || t.eszkoz === f.eszkoz); });
      lista.innerHTML = x.map(kartya).join('') || '<li class="kk_ures">Erre most nincs nyitott feladat. Válassz mást, vagy írd meg lent, mihez értesz, és mi keresünk neked.</li>';
      talalat.textContent = x.length + ' nyitott feladat';
      if (meres) kuld('kapu_szures', f);
    }
    szurok.forEach(function (s) { s.addEventListener('change', function () { rajzol(true); }); });
    rajzol(false);
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-kk-feladat]'); if (!b) return;
      var t = feladatok.filter(function (x) { return x.id === b.getAttribute('data-kk-feladat'); })[0]; if (!t) return;
      kuld('kapu_feladat_valasztas', { feladat: t.id, raj: t.raj, rajpont: t.rajpont });
      jelentkezes(t.raj + ' · ' + t.cim, 'feladat');
    });
  }

  /* 3. Raj-választó: 3 kérdés → ajánlott raj + 2 illő feladat */
  var KERDESEK = [
    { k: 'mihez', cim: 'Mihez értesz, vagy mit tanulnál szívesen?', v: [['kod', 'Kódolás, vibe-coding'], ['iras', 'Írás, közösségi média'], ['design', 'Design, fotó, videó'], ['terep', 'Terepen lenni, emberekkel'], ['uzlet', 'Számok, üzlet, szervezés']] },
    { k: 'ido', cim: 'Hetente mennyi időd van?', v: [['1', '1–2 óra'], ['3', '3–5 óra'], ['5', 'Több mint 5 óra']] },
    { k: 'hol', cim: 'Hol segítenél?', v: [['online', 'Online'], ['helyben', 'A városomban'], ['', 'Mindkettő jó']] }
  ];
  var RAJ = { kod: 'Webes raj', iras: 'Kommunikációs raj', design: 'Kreatív raj', terep: 'Térképész raj', uzlet: 'Beeeznisz raj' };
  function valaszto(el, data) {
    var v = {}, i = 0;
    function lepes() {
      if (i >= KERDESEK.length) return eredmeny();
      var q = KERDESEK[i];
      el.innerHTML = minta(data) + '<p class="kk_lepes">' + (i + 1) + ' / ' + KERDESEK.length + '</p><fieldset class="kk_kerdes"><legend>' + e(q.cim) + '</legend><div class="kk_valaszok">' +
        q.v.map(function (o) { return '<button type="button" class="kk_valasz" data-v="' + e(o[0]) + '">' + e(o[1]) + '</button>'; }).join('') + '</div></fieldset>' +
        (i ? '<button type="button" class="kk_vissza">Vissza</button>' : '');
      var elso = el.querySelector('.kk_valasz'); if (elso && i) elso.focus();
    }
    function eredmeny() {
      var raj = RAJ[v.mihez] || 'Kommunikációs raj';
      var ora = Number(v.ido) || 1;
      var illik = (data.feladatok || []).filter(function (t) { return t.raj === raj && (!v.hol || t.mod === v.hol); }).sort(function (a, b) { return Math.abs(a.ora - ora) - Math.abs(b.ora - ora); }).slice(0, 2);
      if (!illik.length) illik = (data.feladatok || []).filter(function (t) { return !v.hol || t.mod === v.hol; }).slice(0, 2);
      el.innerHTML = minta(data) + '<div class="kk_eredmeny" tabindex="-1"><p class="kk_eredmeny_felcim">Neked ez a raj illik:</p><p class="kk_eredmeny_raj">' + e(raj) + '</p>' +
        '<p>Két feladat, amivel már ezen a héten kezdhetsz:</p><ul class="kk_feladatok is-kicsi">' + illik.map(kartya).join('') + '</ul>' +
        '<div class="kk_eredmeny_gombok"><button type="button" class="kk_gomb" data-kk-raj="' + e(raj) + '">Jelentkezem ebbe a rajba</button><button type="button" class="kk_vissza" data-kk-ujra>Újrakezdem</button></div></div>';
      el.querySelector('.kk_eredmeny').focus();
      kuld('kapu_rajvalaszto_kesz', { raj: raj, ido: v.ido || '', hol: v.hol || 'mindegy' });
    }
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest ? ev.target : null; if (!t) return;
      var b = t.closest('.kk_valasz'); if (b) { v[KERDESEK[i].k] = b.getAttribute('data-v'); i++; lepes(); return; }
      if (t.closest('[data-kk-ujra]')) { v = {}; i = 0; lepes(); return; }
      if (t.closest('.kk_vissza')) { i = Math.max(0, i - 1); lepes(); return; }
      var r = t.closest('[data-kk-raj]'); if (r) { jelentkezes(r.getAttribute('data-kk-raj') + ' (a raj-választó ajánlása)', 'rajvalaszto'); return; }
      var f = t.closest('[data-kk-feladat]'); if (f) { var x = (data.feladatok || []).filter(function (y) { return y.id === f.getAttribute('data-kk-feladat'); })[0]; if (x) jelentkezes(x.raj + ' · ' + x.cim, 'rajvalaszto'); }
    });
    lepes();
  }

  /* 4. Szintek (a Kaptár karrierszintjei) + mire jó a rajpont */
  var SZINTEK = [['Fióka', 'Jelentkeztél, a bevezető még hátravan.'], ['Kezdő méhecske', 'Kész a bevezető, jöhet az első feladat.'], ['Gyűjtögető', '3 lezárt feladat.'], ['Dolgozó', '10 lezárt feladat és 3 aktív hónap.'], ['Őrszem', 'Mentor vagy: segíted az újakat.'], ['Beecoach', 'Rajt vezetsz.']];
  function szintek(el, data) {
    var b = data.bolt || [];
    el.innerHTML = '<ol class="kk_szintek">' + SZINTEK.map(function (s, i) { return '<li class="kk_szint"><span class="kk_szint_szam">' + (i + 1) + '</span><span class="kk_szint_nev">' + s[0] + '</span><span class="kk_szint_mi">' + s[1] + '</span></li>'; }).join('') + '</ol>' +
      (b.length ? minta(data) + '<p class="kk_bolt_cim">Mire váltható a rajpont?</p><ul class="kk_bolt">' + b.map(function (x) { return '<li><span>' + e(x.nev) + '</span><strong>' + sz(x.rajpont) + ' rajpont</strong></li>'; }).join('') + '</ul>' : '');
  }

  /* 5. Ranglista */
  function ranglista(el, data) {
    var r = (data.ranglista || []).slice().sort(function (a, b) { return b.rajpont - a.rajpont; }).slice(0, 8), max = r.length ? r[0].rajpont : 1;
    el.innerHTML = minta(data) + '<ol class="kk_rang">' + r.map(function (x, i) {
      return '<li class="kk_rang_sor"><span class="kk_rang_hely">' + (i + 1) + '.</span><span class="kk_rang_nev">' + e(x.nev) + '<small>' + e([x.varos, x.raj].filter(Boolean).join(' · ')) + '</small></span><span class="kk_rang_sav"><span style="width:' + Math.round(x.rajpont / max * 100) + '%"></span></span><span class="kk_rang_pont">' + sz(x.rajpont) + '</span></li>'; }).join('') + '</ol>' +
      '<p class="kk_megjegyzes">Csak az szerepel, aki ehhez a Kaptárban hozzájárult.</p>';
  }

  /* 6. Helyi csapatok */
  function csapatok(el, data) {
    var c = data.csapatok || [];
    el.innerHTML = minta(data) + '<ul class="kk_csapatok">' + c.map(function (x) {
      var aktiv = x.allapot === 'aktiv';
      return '<li class="kk_csapat' + (aktiv ? '' : ' is-indulo') + '"><p class="kk_csapat_varos">' + e(x.varos) + '</p>' +
        (aktiv ? '<p class="kk_csapat_adat"><strong>' + sz(x.tagok) + '</strong> tag' + (x.kapitany ? ' · kapitány: ' + e(x.kapitany) : '') + '</p>' + (x.kovetkezo ? '<p class="kk_csapat_adat">Következő találkozó: ' + e(x.kovetkezo) + '</p>' : '')
          : '<p class="kk_csapat_adat">' + (x.erdeklodo ? '<strong>' + sz(x.erdeklodo) + '</strong> érdeklődő · ' : '') + 'csapatkapitányt keresünk</p>') +
        '<button type="button" class="kk_gomb' + (aktiv ? '' : ' is-masodlagos') + '" data-kk-varos="' + e(x.varos) + '" data-kk-aktiv="' + (aktiv ? 1 : 0) + '">' + (aktiv ? 'Csatlakozom' : 'Én indítom') + '</button></li>';
    }).join('') + '</ul>';
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-kk-varos]'); if (!b) return;
      var v = b.getAttribute('data-kk-varos'), a = b.getAttribute('data-kk-aktiv') === '1';
      kuld('kapu_helyi_csapat', { varos: v, tipus: a ? 'csatlakozas' : 'inditas' });
      jelentkezes((a ? 'Helyi csapat: ' : 'Helyi csapatot indítanék: ') + v, 'helyi_csapat');
    });
  }

  var T = { szamok: szamok, feladatok: feladatLista, valaszto: valaszto, szintek: szintek, ranglista: ranglista, csapatok: csapatok };
  fetch(forras, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (data) {
    gy.forEach(function (g) { var f = T[g.getAttribute('data-kk')]; if (!f) return; try { f(g, data); g.setAttribute('data-kk-allapot', data.minta ? 'minta' : 'elo'); } catch (x) { g.setAttribute('data-kk-allapot', 'hiba'); } });
  }).catch(function () { gy.forEach(function (g) { g.setAttribute('data-kk-allapot', 'hiba'); }); });
})();
