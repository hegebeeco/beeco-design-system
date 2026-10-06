/* beeco Brand Book – felület: menü (mobilon fiók), témaváltó, keresés, színkód-másolás, „út” sáv, minták magassága.
   Szöveg csak textContent-tel kerül a DOM-ba. JavaScript nélkül is minden tartalom olvasható. */
(function () {
  'use strict';
  var d = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var tarol = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privát mód */ } } };
  var munkamenet = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* privát mód */ } } };

  // ---------- téma ----------
  var TEMA_NEV = { auto: 'rendszer szerint', light: 'világos', dark: 'sötét' };
  var KOVETKEZO = { auto: 'light', light: 'dark', dark: 'auto' };
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function feloldott(v) { return v === 'dark' || (v === 'auto' && mq && mq.matches) ? 'dark' : 'light'; }
  function temaAlkalmaz(v) {
    d.setAttribute('data-theme', v);
    d.setAttribute('data-tema-valasztas', v);
    d.setAttribute('data-tema-kesz', feloldott(v));
    var g = $('[data-tema-gomb]');
    if (g) g.setAttribute('aria-label', 'Téma: ' + TEMA_NEV[v] + ' – váltás: ' + TEMA_NEV[KOVETKEZO[v]]);
    $$('iframe[data-minta], iframe[data-kepernyo]:not([data-kulso])').forEach(function (f) {
      try { if (f.contentWindow && f.contentWindow.bbMintaTema) f.contentWindow.bbMintaTema(feloldott(v)); } catch (e) { /* még tölt */ }
    });
  }
  temaAlkalmaz(d.getAttribute('data-tema-valasztas') || 'auto');
  var tg = $('[data-tema-gomb]');
  if (tg) tg.addEventListener('click', function () { var v = KOVETKEZO[d.getAttribute('data-tema-valasztas') || 'auto']; tarol.set('bb-tema', v); temaAlkalmaz(v); });
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { temaAlkalmaz(d.getAttribute('data-tema-valasztas') || 'auto'); });

  // ---------- menü (900 px alatt fiók) ----------
  var menuEl = $('#bb-menu'), nyit = $('[data-menu-nyit]'), scrim = $('.bb-scrim');
  function menuZar(fokusz) {
    if (!menuEl || !menuEl.classList.contains('is-open')) return;
    menuEl.classList.remove('is-open'); if (scrim) scrim.hidden = true;
    if (nyit) { nyit.setAttribute('aria-expanded', 'false'); if (fokusz) nyit.focus(); }
  }
  function menuNyit() {
    menuEl.classList.add('is-open'); if (scrim) scrim.hidden = false;
    nyit.setAttribute('aria-expanded', 'true');
    var elso = $('[aria-current="page"]', menuEl) || $('a', menuEl); if (elso) elso.focus();
  }
  if (menuEl && nyit) {
    nyit.addEventListener('click', function () { menuEl.classList.contains('is-open') ? menuZar(true) : menuNyit(); });
    $$('[data-menu-zar]').forEach(function (b) { b.addEventListener('click', function () { menuZar(true); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menuZar(true); });
  }

  // ---------- színkód másolása ----------
  var elo = document.createElement('p'); elo.className = 'bc-sr'; elo.setAttribute('aria-live', 'polite'); document.body.appendChild(elo);
  $$('[data-masol]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-masol');
      var kesz = function () { b.classList.add('is-masolva'); elo.textContent = 'Kimásolva: ' + v; setTimeout(function () { b.classList.remove('is-masolva'); }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(kesz, function () { elo.textContent = 'Nem sikerült másolni – jelöld ki: ' + v; });
      else elo.textContent = 'Jelöld ki és másold: ' + v;
    });
  });

  // ---------- keresés ----------
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var adat = null, betolt = null;
  function index() {
    if (adat) return Promise.resolve(adat);
    if (!betolt) betolt = fetch('bb/kereses.json', { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { adat = j.map(function (t) { return Object.assign({ n: norm(t.c + ' ' + t.h + ' ' + t.x) }, t); }); return adat; });
    return betolt;
  }
  function keres(q) {
    var szavak = norm(q).split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!szavak.length) return [];
    return adat.filter(function (t) { return szavak.every(function (w) { return t.n.indexOf(w) >= 0; }); })
      .sort(function (a, b) { return (b.h ? 1 : 0) - (a.h ? 1 : 0); });
  }
  function talalatLi(t) {
    var li = document.createElement('li'), a = document.createElement('a'), c = document.createElement('strong'), x = document.createElement('span');
    a.href = t.f; c.textContent = t.h ? t.c + ' · ' + t.h : t.c; x.textContent = t.x.slice(0, 120) + (t.x.length > 120 ? '…' : '');
    a.appendChild(c); a.appendChild(x); li.appendChild(a); return li;
  }
  var q = $('#bb-q'), doboz = $('#bb-talalat'), szam = $('#bb-talalat-szam');
  if (q && doboz) {
    var ul = $('ul', doboz);
    var frissit = function () {
      var v = q.value.trim();
      if (v.length < 2) { doboz.hidden = true; return; }
      index().then(function () {
        var l = keres(v); ul.textContent = '';
        l.slice(0, 8).forEach(function (t) { ul.appendChild(talalatLi(t)); });
        if (!l.length) { var li = document.createElement('li'); li.className = 'bb-talalat-ures'; li.textContent = 'Nincs találat. Próbáld rövidebben, vagy ékezet nélkül.'; ul.appendChild(li); }
        szam.textContent = l.length ? l.length + ' találat' : 'Nincs találat';
        doboz.hidden = false;
      }, function () { ul.textContent = ''; var li = document.createElement('li'); li.className = 'bb-talalat-ures'; li.textContent = 'A keresés most nem érhető el – a menüből minden fejezet elérhető.'; ul.appendChild(li); doboz.hidden = false; });
    };
    q.addEventListener('input', frissit);
    q.addEventListener('focus', function () { index().catch(function () {}); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { doboz.hidden = true; } });
    document.addEventListener('click', function (e) { if (!doboz.contains(e.target) && e.target !== q) doboz.hidden = true; });
  }
  // a keresés oldal (Enter után)
  var lista = $('[data-kereses-lista]');
  if (lista) {
    var kq = new URLSearchParams(location.search).get('q') || '';
    if (q) q.value = kq;
    if (kq.trim().length > 1) index().then(function () {
      var l = keres(kq), ures = $('[data-kereses-ures]');
      ures.textContent = l.length ? l.length + ' találat erre: „' + kq + '”' : 'Erre nincs találat: „' + kq + '”. Próbáld rövidebben, vagy ékezet nélkül.';
      l.forEach(function (t) { lista.appendChild(talalatLi(t)); });
    });
  }

  // ---------- út (Önkéntes / Partner / Fejlesztő): következő lépés ----------
  var utak = {}; try { utak = JSON.parse(document.body.getAttribute('data-utak') || '{}'); } catch (e) { utak = {}; }
  var urlUt = new URLSearchParams(location.search).get('ut');
  if (urlUt && utak[urlUt]) munkamenet.set('bb-ut', urlUt);
  var ut = munkamenet.get('bb-ut'), sav = $('[data-utsav]');
  if (ut && utak[ut] && sav) {
    var lepesek = utak[ut].lepesek, itt = location.pathname.split('/').pop() || 'index.html';
    var i = lepesek.findIndex(function (l) { return l.file === itt; });
    if (i >= 0) {
      var cim = document.createElement('p'); cim.className = 'bb-utsav-cim';
      cim.textContent = utak[ut].nev + ' út · ' + (i + 1) + '/' + lepesek.length;
      sav.appendChild(cim);
      var gombok = document.createElement('div'); gombok.className = 'bb-utsav-gombok';
      if (i > 0) { var e = document.createElement('a'); e.className = 'bc-btn is-secondary'; e.href = lepesek[i - 1].file; e.textContent = '← ' + lepesek[i - 1].cim; gombok.appendChild(e); }
      if (i < lepesek.length - 1) { var k = document.createElement('a'); k.className = 'bc-btn'; k.href = lepesek[i + 1].file; k.textContent = 'Következő: ' + lepesek[i + 1].cim + ' →'; gombok.appendChild(k); }
      else { var v = document.createElement('a'); v.className = 'bc-btn'; v.href = 'index.html'; v.textContent = 'Kész – vissza a kezdőlapra'; gombok.appendChild(v); }
      var ki = document.createElement('button'); ki.type = 'button'; ki.className = 'bc-btn is-ghost'; ki.textContent = 'Kilépés az útból';
      ki.addEventListener('click', function () { munkamenet.set('bb-ut', null); sav.hidden = true; });
      gombok.appendChild(ki); sav.appendChild(gombok); sav.hidden = false;
    }
  }

  // ---------- élő tesztlapok: csak lenyitáskor töltődnek be ----------
  $$('details.bb-teszt').forEach(function (d) {
    d.addEventListener('toggle', function () { var f = $('iframe[data-src]', d); if (d.open && f && !f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src')); });
  });

  // ---------- ikonikus képernyők: a keret szélességéhez méretezve (telefon 390 × 844, asztal 1280 × 800) ----------
  var MERET = { telefon: [390, 844], asztal: [1280, 800] };
  function meretez() {
    $$('.bb-eszkoz').forEach(function (w) {
      var tip = w.classList.contains('is-telefon') ? 'telefon' : 'asztal', m = MERET[tip], f = $('iframe', w);
      var k = Math.min(1, w.clientWidth / m[0]);
      f.style.width = m[0] + 'px'; f.style.height = m[1] + 'px'; f.style.transform = 'scale(' + k + ')';
      w.style.height = Math.round(m[1] * k) + 'px';
    });
  }
  meretez(); window.addEventListener('resize', meretez);
  $$('[data-jelolo]').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true', f = $('iframe[data-kepernyo]', b.closest('.bb-kepernyo-sor'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? 'DS-jelölések elrejtése' : 'DS-jelölések mutatása';
      try { var r = f.contentDocument.documentElement; r.classList.toggle('bb-jelolve', on); r.classList.toggle('bb-nagyjel', f.getBoundingClientRect().width / f.offsetWidth < 0.6); } catch (e) { /* még tölt */ }
    });
  });
  $$('iframe[data-kepernyo]:not([data-kulso])').forEach(function (f) {
    f.addEventListener('load', function () { temaAlkalmaz(d.getAttribute('data-tema-valasztas') || 'auto'); });
  });

  // ---------- minták: magasság a tartalomhoz ----------
  $$('iframe[data-minta]').forEach(function (f) {
    var meret = function () { try { var h = f.contentDocument && f.contentDocument.documentElement.scrollHeight; if (h) f.style.height = (h + 4) + 'px'; } catch (e) { /* nem baj */ } };
    f.addEventListener('load', function () { meret(); temaAlkalmaz(d.getAttribute('data-tema-valasztas') || 'auto'); });
  });
})();
