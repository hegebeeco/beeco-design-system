/* beeco docs – felület: téma, akkordion-menü (mobilon fiók), kereső (nyilas léptetés, kiemelés, csoportosítás),
   tartalomjegyzék görgetéskövetéssel, fülek (Carbon-minta), kódmásolás.
   Szöveg csak textContent-tel kerül a DOM-ba (CSP: nincs inline stílus/script). JavaScript nélkül minden tartalom olvasható:
   a menü csoportjai nyitva, a fülpanelek egymás alatt, a kereső a kereses.html-re küld. */
(function () {
  'use strict';
  var d = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  var tarol = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privát mód */ } } };

  // ---------- téma: auto → világos → sötét ----------
  var TEMA_NEV = { auto: 'rendszer szerint', light: 'világos', dark: 'sötét' };
  var KOV = { auto: 'light', light: 'dark', dark: 'auto' };
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var feloldott = function (v) { return v === 'dark' || (v === 'auto' && mq && mq.matches) ? 'dark' : 'light'; };
  /** az élő minták (iframe) a szülő feloldott témáját kapják (minta.js: bbMintaTema) */
  function mintakTema() {
    var t = d.getAttribute('data-tema-kesz') || 'light';
    $$('iframe[data-minta], iframe[data-kepernyo]:not([data-kulso])').forEach(function (f) {
      try { if (f.contentWindow && f.contentWindow.bbMintaTema) f.contentWindow.bbMintaTema(t); } catch (e) { /* még tölt */ }
    });
  }
  function tema(v) {
    d.setAttribute('data-theme', v); d.setAttribute('data-tema-valasztas', v); d.setAttribute('data-tema-kesz', feloldott(v));
    mintakTema();
    var g = $('[data-tema-gomb]');
    if (g) { var t = 'Téma: ' + TEMA_NEV[v] + ' – váltás erre: ' + TEMA_NEV[KOV[v]]; g.setAttribute('aria-label', t); g.title = t; }
  }
  tema(d.getAttribute('data-tema-valasztas') || 'auto');
  var tg = $('[data-tema-gomb]');
  if (tg) tg.addEventListener('click', function () { var v = KOV[d.getAttribute('data-tema-valasztas') || 'auto']; tarol.set('bb-tema', v); tema(v); });
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { tema(d.getAttribute('data-tema-valasztas') || 'auto'); });

  // ---------- akkordion: csak az aktív csoport nyitott ----------
  $$('.bb-nav-csoport[data-csoport]').forEach(function (cs) {
    var b = $('.bb-nav-fo', cs), ul = $('.bb-nav-al', cs);
    var allit = function (nyitva) { b.setAttribute('aria-expanded', nyitva ? 'true' : 'false'); ul.hidden = !nyitva; };
    allit(cs.classList.contains('is-aktiv'));
    b.addEventListener('click', function () { allit(b.getAttribute('aria-expanded') !== 'true'); });
  });

  // 3. szint (kategória → elem): csak az aktív ág nyitott
  $$('[data-ag]').forEach(function (ag) {
    var b = $('.bb-nav-ag-gomb', ag), ul = $('.bb-nav-al2', ag);
    if (!b || !ul) return;
    var nev = b.getAttribute('aria-label').replace(/ – (lenyitás|becsukás)$/, '');
    var allit = function (nyitva) { b.setAttribute('aria-expanded', nyitva ? 'true' : 'false'); ul.hidden = !nyitva; b.setAttribute('aria-label', nev + (nyitva ? ' – becsukás' : ' – lenyitás')); };
    allit(ag.classList.contains('is-aktiv'));
    b.addEventListener('click', function () { allit(b.getAttribute('aria-expanded') !== 'true'); });
  });

  // ---------- menü: 900 px alatt fiók ----------
  var nav = $('#bb-nav'), nyit = $('[data-menu-nyit]'), scrim = $('.bb-scrim');
  var mobil = window.matchMedia ? window.matchMedia('(max-width: 900px)') : { matches: false };
  function zar(fokusz) {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open'); if (scrim) scrim.hidden = true; d.classList.remove('is-fiok');
    if (nyit) { nyit.setAttribute('aria-expanded', 'false'); if (fokusz) nyit.focus(); }
  }
  if (nav && nyit) {
    nyit.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { zar(true); return; }
      nav.classList.add('is-open'); if (scrim) scrim.hidden = false; d.classList.add('is-fiok');
      nyit.setAttribute('aria-expanded', 'true');
      var f = $('[aria-current="page"]', nav) || $('a, button', nav); if (f) f.focus();
    });
    $$('[data-menu-zar]').forEach(function (b) { b.addEventListener('click', function () { zar(true); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) zar(true); });
    var valt = function () { if (!mobil.matches) zar(false); };
    if (mobil.addEventListener) mobil.addEventListener('change', valt);
  }

  // ---------- kereső ----------
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var adat = null, betolt = null;
  function index() {
    if (adat) return Promise.resolve(adat);
    if (!betolt) betolt = fetch('assets/kereses.json', { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { adat = j.map(function (t) { return { t: t, c: norm(t.c), h: norm(t.h), x: norm(t.x + ' ' + (t.k || '')) }; }); return adat; });
    return betolt;
  }
  function szavak(q) { return norm(q).split(/\s+/).filter(function (w) { return w.length > 1; }); }
  function keres(q) {
    var w = szavak(q); if (!w.length) return [];
    var l = [];
    adat.forEach(function (a, i) {
      var mind = a.c + ' ' + a.h + ' ' + a.x;
      if (!w.every(function (s) { return mind.indexOf(s) >= 0; })) return;
      var p = 0;
      w.forEach(function (s) { if (a.h.indexOf(s) >= 0) p += 4; if (a.c.indexOf(s) >= 0) p += a.t.h ? 1 : 6; });
      l.push({ t: a.t, p: p, i: i });
    });
    return l.sort(function (a, b) { return b.p - a.p || a.i - b.i; }).map(function (x) { return x.t; });
  }
  /** Szöveg a találat kiemelésével (<mark>), ékezetfüggetlenül: a normalizált egyezést az eredeti betűkre vetíti vissza. */
  function kiemelt(szoveg, w) {
    var n = '', map = [];
    for (var i = 0; i < szoveg.length; i++) { var c = norm(szoveg[i]); for (var j = 0; j < c.length; j++) { n += c[j]; map.push(i); } }
    var r = [];
    w.forEach(function (s) { var k = n.indexOf(s); while (k >= 0) { r.push([map[k], map[k + s.length - 1] + 1]); k = n.indexOf(s, k + s.length); } });
    r.sort(function (a, b) { return a[0] - b[0]; });
    var f = document.createDocumentFragment(), poz = 0;
    r.forEach(function (x) { if (x[0] < poz) return; if (x[0] > poz) f.appendChild(document.createTextNode(szoveg.slice(poz, x[0]))); f.appendChild(el('mark', null, szoveg.slice(x[0], x[1]))); poz = x[1]; });
    if (poz < szoveg.length) f.appendChild(document.createTextNode(szoveg.slice(poz)));
    return f;
  }
  function talalatElem(t, w, tag) {
    var a = el(tag || 'a', 'bb-talalat-elem'); a.href = t.u;
    var c = el('span', 'bb-talalat-cim'); c.appendChild(kiemelt(t.h ? t.c + ' › ' + t.h : t.c, w)); a.appendChild(c);
    if (t.x) { var x = el('span', 'bb-talalat-szoveg'); x.appendChild(kiemelt(t.x.length > 110 ? t.x.slice(0, 110) + '…' : t.x, w)); a.appendChild(x); }
    return a;
  }
  function csoportosit(l) {
    var g = [], m = {};
    l.forEach(function (t) { if (!m[t.g]) { m[t.g] = []; g.push([t.g, m[t.g]]); } m[t.g].push(t); });
    return g;
  }
  var q = $('#bb-q'), doboz = $('#bb-talalat'), szam = $('#bb-talalat-szam'), aktiv = -1;
  function opciok() { return $$('[role="option"]', doboz); }
  function jelol(i) {
    var o = opciok(); if (!o.length) return;
    aktiv = (i + o.length) % o.length;
    o.forEach(function (x, k) { x.setAttribute('aria-selected', k === aktiv ? 'true' : 'false'); });
    q.setAttribute('aria-activedescendant', o[aktiv].id);
    o[aktiv].scrollIntoView({ block: 'nearest' });
  }
  function bezar() { if (!doboz) return; doboz.hidden = true; q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); aktiv = -1; }
  if (q && doboz) {
    var frissit = function () {
      var v = q.value.trim();
      if (v.length < 2) { bezar(); szam.textContent = ''; return; }
      index().then(function () {
        var l = keres(v), w = szavak(v), n = 0;
        doboz.textContent = ''; aktiv = -1; q.removeAttribute('aria-activedescendant');
        csoportosit(l.slice(0, 8)).forEach(function (cs) {
          var grp = el('div', 'bb-talalat-csoport'); grp.setAttribute('role', 'group');
          var cim = el('p', 'bb-talalat-csoportcim', cs[0]); cim.id = 'bb-tcs-' + n; grp.setAttribute('aria-labelledby', cim.id); grp.appendChild(cim);
          cs[1].forEach(function (t) { var a = talalatElem(t, w); a.setAttribute('role', 'option'); a.id = 'bb-opt-' + (n++); a.setAttribute('aria-selected', 'false'); a.tabIndex = -1; grp.appendChild(a); });
          doboz.appendChild(grp);
        });
        if (l.length) {
          var mind = el('a', 'bb-talalat-mind', 'Összes találat a keresés oldalon (' + l.length + ')'); mind.href = 'kereses.html?q=' + encodeURIComponent(v);
          mind.setAttribute('role', 'option'); mind.id = 'bb-opt-' + n; mind.setAttribute('aria-selected', 'false'); mind.tabIndex = -1; doboz.appendChild(mind);
        } else {
          var u = el('p', 'bb-talalat-ures', 'Nincs találat erre: „' + v + '”. Próbáld rövidebben, vagy más szóval.'); doboz.appendChild(u);
        }
        szam.textContent = l.length ? l.length + ' találat' : 'Nincs találat';
        doboz.hidden = false; q.setAttribute('aria-expanded', 'true');
      }, function () { doboz.textContent = ''; doboz.appendChild(el('p', 'bb-talalat-ures', 'A keresés most nem érhető el – a menüből minden oldal elérhető.')); doboz.hidden = false; });
    };
    q.addEventListener('input', frissit);
    q.addEventListener('focus', function () { index().catch(function () {}); if (q.value.trim().length > 1 && doboz.hidden) frissit(); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (doboz.hidden) frissit(); else jelol(aktiv + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (!doboz.hidden) jelol(aktiv - 1); }
      else if (e.key === 'Enter') { var o = opciok(); if (!doboz.hidden && aktiv >= 0 && o[aktiv]) { e.preventDefault(); location.href = o[aktiv].href; } }
      else if (e.key === 'Escape') { if (!doboz.hidden) { e.preventDefault(); bezar(); } else if (q.value) { q.value = ''; szam.textContent = ''; } }
    });
    document.addEventListener('click', function (e) { if (!doboz.contains(e.target) && e.target !== q) bezar(); });
    // „/” billentyű: ugrás a keresőbe (ha nem mezőben gépelsz)
    document.addEventListener('keydown', function (e) { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '') && !e.target.isContentEditable) { e.preventDefault(); q.focus(); } });
  }
  // a keresés oldal: teljes lista, szakaszonként
  var lista = $('[data-kereses-lista]'), allapot = $('[data-kereses-allapot]');
  if (lista && allapot) {
    var kq = (new URLSearchParams(location.search).get('q') || '').trim();
    if (q) q.value = kq;
    if (kq.length > 1) index().then(function () {
      var l = keres(kq), w = szavak(kq);
      allapot.textContent = l.length ? l.length + ' találat erre: „' + kq + '”' : 'Erre nincs találat: „' + kq + '”. Próbáld rövidebben, vagy más szóval – a menüből minden oldal elérhető.';
      csoportosit(l).forEach(function (cs, i) {
        var s = el('section', 'bb-kereses-csoport'), h = el('h2', null, cs[0] + ' (' + cs[1].length + ')'); h.id = 'talalat-' + i; s.setAttribute('aria-labelledby', h.id); s.appendChild(h);
        var ul = el('ul', 'bb-kereses-ul'); ul.setAttribute('role', 'list');
        cs[1].forEach(function (t) { var li = el('li'); li.appendChild(talalatElem(t, w)); ul.appendChild(li); });
        s.appendChild(ul); lista.appendChild(s);
      });
    }, function () { allapot.textContent = 'A keresés most nem érhető el – a menüből minden oldal elérhető.'; });
  }

  // ---------- fülek (role=tablist/tab/tabpanel; nyilak, Home/End) ----------
  $$('[data-fulek]').forEach(function (f) {
    var tl = $('[role="tablist"]', f), fulek = $$('[role="tab"]', f), panelek = fulek.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    if (!tl || !fulek.length) return;
    tl.hidden = false; f.classList.add('is-fulek');
    panelek.forEach(function (p, k) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', fulek[k].id); p.tabIndex = 0; });
    function valaszt(i, fokusz) {
      fulek.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; panelek[k].hidden = !on; });
      if (fokusz) fulek[i].focus();
    }
    fulek.forEach(function (t, i) {
      t.addEventListener('click', function () { valaszt(i, false); try { history.replaceState(null, '', '#' + panelek[i].id); } catch (e) { /* file:// */ } });
      t.addEventListener('keydown', function (e) {
        var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: fulek.length - 1 }[e.key];
        if (k === undefined) return; e.preventDefault(); valaszt((k + fulek.length) % fulek.length, true);
      });
    });
    function hashbol() {
      var id = decodeURIComponent(location.hash.slice(1)); if (!id) return false;
      var cel = document.getElementById(id); if (!cel) return false;
      for (var i = 0; i < panelek.length; i++) if (panelek[i] === cel || panelek[i].contains(cel)) { valaszt(i, false); if (cel !== panelek[i]) cel.scrollIntoView(); return true; }
      return false;
    }
    if (!hashbol()) valaszt(0, false);
    window.addEventListener('hashchange', hashbol);
    f.__hash = hashbol;
  });

  // ---------- tartalomjegyzék: görgetéskövetés ----------
  var tocLinkek = $$('.bb-toc a, .bb-toc-mobil a');
  if (tocLinkek.length && 'IntersectionObserver' in window) {
    var cel = {}; tocLinkek.forEach(function (a) { var id = a.getAttribute('href').slice(1); (cel[id] = cel[id] || []).push(a); });
    var lathato = {};
    var jeloles = function () {
      var elso = null;
      Object.keys(cel).some(function (id) { if (lathato[id]) { elso = id; return true; } return false; });
      if (!elso) return;
      tocLinkek.forEach(function (a) { if (a.getAttribute('href') === '#' + elso) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { lathato[e.target.id] = e.isIntersecting; }); jeloles(); }, { rootMargin: '-72px 0px -60% 0px' });
    Object.keys(cel).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
  }
  // a mobil jegyzék kattintás után becsukódik; fülpanelben lévő célnál a fül vált
  $$('.bb-toc-mobil a').forEach(function (a) { a.addEventListener('click', function () { var dt = a.closest('details'); if (dt) dt.open = false; }); });

  // ---------- színkód másolása (data-masol) ----------
  var elo0 = el('p', 'bc-sr'); elo0.setAttribute('aria-live', 'polite'); document.body.appendChild(elo0);
  $$('[data-masol]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-masol');
      var kesz = function () { b.classList.add('is-masolva'); elo0.textContent = 'Kimásolva: ' + v; setTimeout(function () { b.classList.remove('is-masolva'); }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(kesz, function () { elo0.textContent = 'Nem sikerült másolni – jelöld ki: ' + v; });
      else elo0.textContent = 'Jelöld ki és másold: ' + v;
    });
  });

  // ---------- élő minták (iframe): magasság a tartalomhoz, téma a szülőtől ----------
  $$('iframe[data-minta]').forEach(function (f) {
    var meret = function () { try { var h = f.contentDocument && f.contentDocument.documentElement.scrollHeight; if (h) f.style.height = (h + 4) + 'px'; } catch (e) { /* nem baj */ } };
    f.addEventListener('load', function () { mintakTema(); meret(); });
  });
  // ---------- ikonikus képernyők: a keret szélességéhez méretezve (telefon 390 × 844, asztal 1280 × 800) ----------
  var MERET = { telefon: [390, 844], asztal: [1280, 800] };
  function meretez() {
    $$('.bb-eszkoz').forEach(function (w) {
      var m = MERET[w.classList.contains('is-telefon') ? 'telefon' : 'asztal'], f = $('iframe', w);
      if (!f) return;
      var k = Math.min(1, w.clientWidth / m[0]);
      f.style.width = m[0] + 'px'; f.style.height = m[1] + 'px'; f.style.transform = 'scale(' + k + ')';
      w.style.height = Math.round(m[1] * k) + 'px';
    });
  }
  if ($('.bb-eszkoz')) { meretez(); window.addEventListener('resize', meretez); }
  $$('[data-jelolo]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true', f = $('iframe[data-kepernyo]', b.closest('.bb-kepernyo-sor'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? 'DS-jelölések elrejtése' : 'DS-jelölések mutatása';
      try { var r = f.contentDocument.documentElement; r.classList.toggle('bb-jelolve', on); r.classList.toggle('bb-nagyjel', f.getBoundingClientRect().width / f.offsetWidth < 0.6); } catch (e) { /* még tölt */ }
    });
  });
  $$('iframe[data-kepernyo]:not([data-kulso])').forEach(function (f) { f.addEventListener('load', mintakTema); });
  // élő tesztlap lenyitáskor töltődik be (details.bb-teszt > iframe[data-src])
  $$('details.bb-teszt').forEach(function (dt) {
    dt.addEventListener('toggle', function () { var f = $('iframe[data-src]', dt); if (dt.open && f && !f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src')); });
  });

  // ---------- kód másolása ----------
  var elo = el('p', 'bc-sr'); elo.setAttribute('aria-live', 'polite'); document.body.appendChild(elo);
  $$('[data-masol-cel]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () {
      var c = document.getElementById(b.getAttribute('data-masol-cel')); if (!c) return;
      var v = c.textContent;
      var kesz = function () { b.classList.add('is-masolva'); elo.textContent = 'Kimásolva a vágólapra.'; setTimeout(function () { b.classList.remove('is-masolva'); }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(kesz, function () { elo.textContent = 'Nem sikerült másolni – jelöld ki a kódot.'; });
      else elo.textContent = 'Jelöld ki és másold a kódot.';
    });
  });
})();
