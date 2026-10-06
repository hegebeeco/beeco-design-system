/* beeco „Kaptár-kapu” v2 – a Csatlakozz oldal interaktív rétege.
   - Méhecskés oldalnavigáció: a [data-kk-nav="Címke"] szakaszokból szaggatott vonalas, hatszöges sáv a jobb szélen;
     a méhecske az aktuális szakaszhoz repül, kattintásra/Enterre oda ugrik.
   - Képnézegető: [data-kk-galeria] (görgethető sáv) + előző/következő gomb, számláló, nyilak.
   - Rajok és feladatok egy felületen: a [data-kk="feladatok"] doboz kereső- és szűrősáv + „Legjobban itt kell a segítség”
     sor; a feladatok a raj-lenyílókba kerülnek (a lenyíló fejléce = raj neve). Adat: Webflow CMS-elemek
     (data-kk-cms="feladat"), ha vannak; különben a data-kk-forras JSON (mintaadatnál „Mintaadat” jelölés).
   - Jelentkezési űrlap (#jelentkezes form): legördülők feltöltése (a raj-lista a lenyílókból), UTM és oldal rejtett
     mezőkbe, előtöltés a választott feladatból vagy szerepből.
   - Mérés: gtag-események, ablakszintű capture figyelő (a site Trustindex-szkriptje miatt), 600 ms-os ismétlésszűrés. */
(function () {
  var d = document, w = window;
  var csend = w.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MINTA = 'https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@1.48/weboldal/csatlakozz/kapu-minta.json';
  var MEH = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/69958ad111b6a3c7275accc0_ME%CC%81H_Beela.png';

  function kuld(n, p) { if (typeof w.gtag === 'function') w.gtag('event', n, p || {}); else (w.dataLayer = w.dataLayer || []).push(Object.assign({ event: n }, p || {})); }
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
  function $$(sel, gy) { return [].slice.call((gy || d).querySelectorAll(sel)); }

  /* ---------- Képek: az API-n át betett Webflow-képeknek nincs srcset-je, így a teljes (akár 900 kB-os) fájl töltődne.
     Ha a Webflow már legenerálta a 800 px-es változatot (-p-800), arra cseréljük; csak sikeres próbabetöltés után. */
  $$('.kk_tortenet_kep, .kk_galeria_kep, .kk_ertek_ikon, .kk_kampany_kep').forEach(function (img) {
    var src = img.getAttribute('src') || ''; if (img.srcset || !/website-files\.com\/.+\.(webp|jpe?g|png|avif)$/i.test(src) || /-p-\d+\./.test(src)) return;
    var kicsi = src.replace(/\.(webp|jpe?g|png|avif)$/i, '-p-800.$1'), proba = new Image();
    proba.onload = function () { if (proba.naturalWidth >= 400) img.src = kicsi; };
    proba.src = kicsi;
  });

  /* ---------- Űrlap ---------- */
  var urlap = d.querySelector('#jelentkezes form, #onkentes form');
  var OPCIOK = {
    heti_ido: ['1–2 óra', '3–5 óra', '5–10 óra', 'Több mint 10 óra'],
    munkamod: ['Online', 'Helyben, a városomban', 'Mindkettő'],
    tapasztalat: ['Kezdő vagyok, tanulnék', 'Van némi tapasztalatom', 'Profi vagyok benne'],
    forras: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Ismerős ajánlotta', 'Egyetem, iskola', 'Rendezvény', 'Hírlevél', 'Google', 'Egyéb']
  };
  function rajNevek() { return $$('.uui-career02_job-department').map(function (f) { var h = f.querySelector('h2,h3,h4'); return h ? h.textContent.trim() : ''; }).filter(Boolean); }
  function feltolt(sel, lista, ujra) {
    if (!sel || sel.tagName !== 'SELECT') return;
    if (ujra) while (sel.options.length > 1) sel.remove(1);
    else if (sel.options.length > 1) return;
    lista.forEach(function (o) { var op = d.createElement('option'); op.value = o; op.textContent = o; sel.appendChild(op); });
  }
  var UTM = {};
  try {
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { var v = q.get(k) || sessionStorage.getItem('kk_' + k); if (v) { UTM[k] = v.slice(0, 80); try { sessionStorage.setItem('kk_' + k, UTM[k]); } catch (x) {} } });
  } catch (x) {}
  if (urlap) {
    feltolt(urlap.querySelector('[name="raj"]'), rajNevek().concat(['Még nem tudom']), true);
    /* a Webflow a whtml-ből épült mezőknél üres for-t ír a feliratra, és a jelölőnégyzet mellé a mezőnevet: rendbe tesszük */
    $$('.kk_mezo', urlap).forEach(function (m) { var l = m.querySelector('label'), i = m.querySelector('input,select,textarea'); if (l && i && i.id && !l.getAttribute('for')) l.setAttribute('for', i.id); });
    $$('.kk_jovahagyas', urlap).forEach(function (k) {
      var szoveg = k.querySelector('.kk_jovahagyas_szoveg'), cimke = k.querySelector('.w-form-label'); if (!szoveg || !cimke) return;
      cimke.innerHTML = szoveg.innerHTML; szoveg.remove(); k.removeAttribute('for');
      $$('a', cimke).forEach(function (a) { a.target = '_blank'; a.rel = 'noopener'; });
    });
    var gomb = urlap.querySelector('[type="submit"]'); if (gomb) { gomb.value = 'Jelentkezem'; gomb.setAttribute('data-wait', 'Küldés…'); }
    var HELYORZO = { nev: 'Teljes neved', email: 'nev@pelda.hu', varos: 'pl. Budapest' };
    Object.keys(HELYORZO).forEach(function (k) { var i = urlap.querySelector('[name="' + k + '"]'); if (i && (!i.placeholder || /example/i.test(i.placeholder))) i.placeholder = HELYORZO[k]; });
    Object.keys(OPCIOK).forEach(function (k) { feltolt(urlap.querySelector('[name="' + k + '"]'), OPCIOK[k]); });
    var fs = urlap.querySelector('[name="forras"]'), us = norm(UTM.utm_source);
    if (fs && us) OPCIOK.forras.forEach(function (o) { if (norm(o) === us) fs.value = o; });
    ['utm_source', 'utm_medium', 'utm_campaign', 'oldal'].forEach(function (k) {
      if (urlap.querySelector('[name="' + k + '"]')) return;
      var i = d.createElement('input'); i.type = 'hidden'; i.name = k; i.value = k === 'oldal' ? location.origin + location.pathname : (UTM[k] || ''); urlap.appendChild(i);
    });
    /* sikeres beküldés: a Webflow megjeleníti a .w-form-done blokkot */
    var kesz = urlap.parentElement && urlap.parentElement.querySelector('.w-form-done');
    if (kesz && 'MutationObserver' in w) {
      var mo = new MutationObserver(function () {
        if (getComputedStyle(kesz).display !== 'none') {
          mo.disconnect(); var r = urlap.querySelector('[name="raj"]');
          kuld('kapu_jelentkezes_siker', { raj: r ? r.value : '', utm_source: UTM.utm_source || '' });
          kesz.setAttribute('tabindex', '-1'); kesz.focus({ preventScroll: true });
        }
      });
      mo.observe(kesz, { attributes: true, attributeFilter: ['style'] });
    }
    urlap.addEventListener('submit', function () {
      var r = urlap.querySelector('[name="raj"]'), f = urlap.querySelector('[name="forras"]');
      kuld('kapu_jelentkezes_kuldes', { raj: r ? r.value : '', forras: f ? f.value : '', utm_source: UTM.utm_source || '' });
    });
  }
  function jelentkezes(raj, feladat, honnan) {
    if (urlap) {
      var r = urlap.querySelector('[name="raj"]'), f = urlap.querySelector('[name="feladat"]');
      if (r && raj) { if (![].some.call(r.options, function (o) { return o.value === raj; })) feltolt(r, [raj]); r.value = raj; }
      if (f) { f.value = feladat || ''; f.dispatchEvent(new Event('input', { bubbles: true })); }
      var cel = d.getElementById('jelentkezes') || urlap;
      cel.scrollIntoView({ behavior: csend ? 'auto' : 'smooth', block: 'start' });
      var nev = urlap.querySelector('[name="nev"], input[type="text"]');
      if (nev) setTimeout(function () { nev.focus({ preventScroll: true }); }, csend ? 0 : 500);
    }
    kuld('kapu_jelentkezes_elotoltve', { forras: honnan, raj: raj || '' });
  }

  /* ---------- Harmonikák ---------- */
  /* A duplikált oldalra a Webflow (IX2) interakciója nem jön át: ha a panelen nincs Webflow-kezdőállapot, a modul kezeli. */
  var RAJOK = {};
  $$('.uui-career02_job-department').forEach(function (fej, i) {
    var lw = fej.nextElementSibling; if (!lw || !lw.classList.contains('uui-career02_list-wrapper')) return;
    var h = fej.querySelector('h2,h3,h4'), nev = h ? h.textContent.trim() : ''; fej.setAttribute('data-kk-raj', nev);
    var sajat = !lw.getAttribute('style');
    var id = lw.id || ('kk-raj-' + i); lw.id = id;
    function nyit(ny, meres) {
      if (!sajat) { if ((fej.getAttribute('aria-expanded') === 'true') !== ny) fej.click(); return; }
      fej.setAttribute('aria-expanded', String(ny)); lw.style.display = ny ? '' : 'none';
      if (ny && meres) kuld('kapu_raj_lenyitas', { raj: nev });
    }
    if (sajat) {
      lw.style.display = 'none';
      fej.setAttribute('role', 'button'); fej.setAttribute('tabindex', '0'); fej.setAttribute('aria-expanded', 'false'); fej.setAttribute('aria-controls', id);
      fej.addEventListener('click', function () { nyit(fej.getAttribute('aria-expanded') !== 'true', true); });
      fej.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); nyit(fej.getAttribute('aria-expanded') !== 'true', true); } });
    }
    if (nev) RAJOK[nev] = { fej: fej, lw: lw, blokk: fej.parentElement, nyit: nyit, nev: nev };
  });
  /* „Írd nálunk a diplomamunkád” (gyik_item): működik, de billentyűzettel nem érhető el */
  $$('.gyik_item .home-faq-top').forEach(function (fej) {
    fej.setAttribute('role', 'button'); fej.setAttribute('tabindex', '0'); fej.setAttribute('aria-expanded', 'false');
    fej.addEventListener('click', function () { fej.setAttribute('aria-expanded', String(fej.getAttribute('aria-expanded') !== 'true')); });
    fej.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fej.click(); } });
  });

  /* ---------- Kattintásmérés és szerepkártyák ---------- */
  var utolso = typeof WeakMap === 'function' ? new WeakMap() : null;
  function szerep(a) {
    var it = a.closest('.uui-career02_item'), cim = it && it.querySelector('.main_heading');
    var lw = a.closest('.uui-career02_list-wrapper'), fej = lw && lw.previousElementSibling, h = fej && fej.querySelector('h2,h3,h4');
    return { raj: fej && fej.getAttribute('data-kk-raj') || (h ? h.textContent.trim() : ''), cim: cim ? cim.textContent.trim() : '' };
  }
  var valasztKezelo = null;
  w.addEventListener('click', function (ev) {
    var t = ev.target && ev.target.closest ? ev.target : null; if (!t) return;
    var v = t.closest('[data-kk-valaszt], [data-kk-cms="feladat"] a[href^="#"]');
    if (v && valasztKezelo) {
      var most0 = Date.now(); if (utolso) { if (most0 - (utolso.get(v) || 0) < 600) { ev.preventDefault(); ev.stopPropagation(); return; } utolso.set(v, most0); }
      if (valasztKezelo(v)) { ev.preventDefault(); ev.stopPropagation(); } return;
    }
    var a = t.closest('[data-kk-cta]') || t.closest('.uui-career02_item a[href^="#"]');
    if (!a || a.closest('[data-kk-feladat-lista]') || a.closest('[data-kk-cms]')) return;
    var most = Date.now(); if (utolso) { if (most - (utolso.get(a) || 0) < 600) return; utolso.set(a, most); }
    var cta = a.getAttribute('data-kk-cta');
    if (cta) { kuld(cta === 'kaptar_belepes' ? 'kapu_kaptar_belepes' : 'kapu_cta_click', { cta: cta }); return; }
    var s = szerep(a); ev.preventDefault();
    kuld('kapu_szerep_erdekel', { szerep: (s.raj + ' · ' + s.cim).slice(0, 90) });
    jelentkezes(s.raj, s.cim, 'szerep');
  }, true);

  /* ---------- Képnézegető ---------- */
  $$('[data-kk-galeria]').forEach(function (g) {
    var sav = g.querySelector('ul,ol'), diak = sav ? $$(':scope > li', sav) : []; if (diak.length < 2) return;
    g.setAttribute('role', 'region'); g.setAttribute('aria-roledescription', 'képnézegető'); if (!g.getAttribute('aria-label')) g.setAttribute('aria-label', 'Képek');
    sav.setAttribute('tabindex', '0');
    var vez = d.createElement('div'); vez.className = 'kk_galeria_vez';
    vez.innerHTML = '<button type="button" class="kk_galeria_gomb" data-ir="-1" aria-label="Előző kép">‹</button><span class="kk_galeria_szamlalo" aria-live="polite"></span><button type="button" class="kk_galeria_gomb" data-ir="1" aria-label="Következő kép">›</button>';
    g.appendChild(vez);
    var szl = vez.querySelector('.kk_galeria_szamlalo'), most = 0;
    function aktiv() { var x = sav.scrollLeft, legj = 0, kul = 1e9; diak.forEach(function (li, i) { var k = Math.abs(li.offsetLeft - x); if (k < kul) { kul = k; legj = i; } }); return legj; }
    function frissit() { var i = aktiv(); if (i !== most) { most = i; kuld('kapu_galeria', { dia: i + 1 }); } szl.textContent = (i + 1) + ' / ' + diak.length; }
    function ugrik(i) { i = (i + diak.length) % diak.length; sav.scrollTo({ left: diak[i].offsetLeft, behavior: csend ? 'auto' : 'smooth' }); }
    vez.addEventListener('click', function (ev) { var b = ev.target.closest('[data-ir]'); if (b) ugrik(aktiv() + Number(b.getAttribute('data-ir'))); });
    sav.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { ev.preventDefault(); ugrik(aktiv() + (ev.key === 'ArrowRight' ? 1 : -1)); } });
    var tid; sav.addEventListener('scroll', function () { clearTimeout(tid); tid = setTimeout(frissit, 120); }, { passive: true });
    szl.textContent = '1 / ' + diak.length;
  });

  /* ---------- Méhecskés oldalnavigáció ---------- */
  /* A szakaszokat azonosító alapján is megtalálja (a data-kk-nav csak felülírja a címkét), mert a Webflow nem mindig
     publikálja az egyedi attribútumot. */
  var NAV_ALAP = [['udv', 'Üdv'], ['rolunk', 'Kik vagyunk'], ['mit-csinalunk', 'Mit csinálunk'], ['tortenetunk', 'Történetünk'], ['sikereink', 'Elismerések'],
    ['partnerek', 'Partnereink'], ['igy-mukodik', 'Hogyan'], ['rajok', 'Rajok és feladatok'], ['jelentkezes', 'Jelentkezés'], ['gyik', 'GYIK']];
  var szakaszok = [];
  NAV_ALAP.forEach(function (p) { var el = d.getElementById(p[0]); if (el && szakaszok.indexOf(el) < 0) { if (!el.getAttribute('data-kk-nav')) el.setAttribute('data-kk-nav', p[1]); szakaszok.push(el); } });
  $$('[data-kk-nav]').forEach(function (el) { if (el.id && szakaszok.indexOf(el) < 0) szakaszok.push(el); });
  szakaszok.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
  if (szakaszok.length > 2) {
    var nav = d.createElement('nav'); nav.className = 'kk_mehnav'; nav.setAttribute('aria-label', 'Az oldal részei');
    nav.innerHTML = '<ol class="kk_mehnav_lista">' + szakaszok.map(function (s) {
      return '<li class="kk_mehnav_elem"><a class="kk_mehnav_pont" href="#' + e(s.id) + '"><span class="kk_mehnav_hatszog" aria-hidden="true"></span><span class="kk_mehnav_cimke">' + e(s.getAttribute('data-kk-nav')) + '</span></a></li>';
    }).join('') + '</ol><img class="kk_mehnav_meh" src="' + MEH + '" alt="" width="40" height="40" aria-hidden="true">';
    d.body.appendChild(nav);
    var pontok = $$('.kk_mehnav_pont', nav), meh = nav.querySelector('.kk_mehnav_meh'), aktivI = -1, irany = 1;
    function mehOda(i) {
      if (i === aktivI || !pontok[i]) return;
      irany = i > aktivI ? 1 : -1; aktivI = i;
      pontok.forEach(function (p, j) { if (j === i) p.setAttribute('aria-current', 'location'); else p.removeAttribute('aria-current'); });
      var hp = pontok[i].querySelector('.kk_mehnav_hatszog'), nr = nav.getBoundingClientRect(), r = hp.getBoundingClientRect();
      meh.style.transform = 'translate(-50%,' + Math.round(r.top - nr.top + r.height / 2) + 'px) translateY(-50%) rotate(' + (irany > 0 ? 12 : -12) + 'deg)';
      meh.classList.remove('kk_repul'); void meh.offsetWidth; if (!csend) meh.classList.add('kk_repul');
    }
    function melyik() {
      var y = innerHeight * 0.35, legj = 0;
      szakaszok.forEach(function (s, i) { if (s.getBoundingClientRect().top <= y) legj = i; });
      mehOda(legj);
    }
    var tik = false; w.addEventListener('scroll', function () { if (!tik) { tik = true; requestAnimationFrame(function () { tik = false; melyik(); }); } }, { passive: true });
    w.addEventListener('resize', function () { var i = aktivI; aktivI = -1; mehOda(i < 0 ? 0 : i); });
    nav.addEventListener('click', function (ev) { var a = ev.target.closest('.kk_mehnav_pont'); if (a) kuld('kapu_mehnav', { szakasz: a.textContent.trim() }); });
    melyik();
  }

  /* ---------- Rajok és feladatok ---------- */
  var gyoker = d.querySelector('[data-kk="feladatok"]');
  if (!gyoker) return;
  var fe = d.querySelector('[data-kk-forras]');
  var forras = (fe && fe.getAttribute('data-kk-forras')) || w.KK_FORRAS || MINTA;

  function cmsFeladatok() {
    return $$('[data-kk-cms="feladat"]').map(function (el, i) {
      function a(n) { return (el.getAttribute('data-kk-' + n) || '').trim(); }
      return { id: 'cms' + i, el: el, cim: a('cim'), raj: a('raj'), ora: Number(a('ora')) || 0, mod: /helyben/i.test(a('hol')) ? 'helyben' : 'online',
        varos: a('varos'), eszkoz: /vibe/i.test(a('hogyan')) ? 'vibe-code' : 'kezi', szint: a('szint'), leiras: a('leiras'), kiemelt: /^(1|true|igen)$/i.test(a('kiemelt')) };
    }).filter(function (t) { return t.cim; });
  }
  function kartya(f, kiemelt) {
    return '<li class="kk_feladat' + (kiemelt ? ' is-kiemelt' : '') + '" data-kk-feladat-id="' + e(f.id) + '">' +
      '<p class="kk_feladat_raj">' + e(f.raj) + '</p><h4 class="kk_feladat_cim">' + e(f.cim) + '</h4>' +
      (f.leiras ? '<p class="kk_feladat_leiras">' + e(f.leiras) + '</p>' : '') +
      '<p class="kk_cimkek"><span>' + e(f.ora) + ' óra</span><span>' + (f.mod === 'helyben' ? 'Helyben' + (f.varos ? ': ' + e(f.varos) : '') : 'Online') + '</span><span>' + (f.eszkoz === 'vibe-code' ? 'Vibe-code' : 'Kézzel') + '</span>' + (f.szint ? '<span>' + e(f.szint) + '</span>' : '') + '</p>' +
      '<button type="button" class="kk_gomb" data-kk-valaszt="' + e(f.id) + '">Ezt választom</button></li>';
  }

  function felepit(data) {
    var CMS = cmsFeladatok(), cmsMod = CMS.length > 0;
    var lista = cmsMod ? CMS : (data.feladatok || []).map(function (f, i) { return Object.assign({ id: f.id || ('f' + i) }, f); });
    var minta = !cmsMod && data.minta;
    var rajNevekL = Object.keys(RAJOK);

    /* szűrősáv + kiemelt sor */
    gyoker.innerHTML =
      (minta ? '<p class="kk_minta" role="note">Mintaadat: a feladatok még nem valósak, a csapat most tölti fel a valódiakat.</p>' : '') +
      '<div class="kk_szurok" role="search" aria-label="Feladatok keresése és szűrése">' +
      '<label class="kk_szuro kk_kereso"><span>Keresés</span><input type="search" data-kk-szuro="q" placeholder="pl. videó, térkép, Instagram" autocomplete="off"></label>' +
      '<label class="kk_szuro"><span>Raj</span><select data-kk-szuro="raj"><option value="">Mind</option>' + rajNevekL.map(function (r) { return '<option>' + e(r) + '</option>'; }).join('') + '</select></label>' +
      '<label class="kk_szuro"><span>Hol</span><select data-kk-szuro="mod"><option value="">Mindegy</option><option value="online">Online</option><option value="helyben">Helyben</option></select></label>' +
      '<label class="kk_szuro"><span>Hogyan</span><select data-kk-szuro="eszkoz"><option value="">Mindegy</option><option value="kezi">Kézzel</option><option value="vibe-code">Vibe-code</option></select></label></div>' +
      '<p class="kk_talalat" aria-live="polite"></p>' +
      '<div class="kk_kiemelt" hidden><h3 class="kk_kiemelt_cim">Legjobban itt kell a segítség</h3><ul class="kk_feladatok" data-kk-feladat-lista="kiemelt"></ul></div>';
    var kiemeltDoboz = gyoker.querySelector('.kk_kiemelt'), kiemeltLista = kiemeltDoboz.querySelector('ul');

    /* rajonként: feladatlista a lenyíló elejére + darabszám a fejlécen */
    var rajLista = {};
    rajNevekL.forEach(function (n) {
      var R = RAJOK[n], dob = d.createElement('div'); dob.className = 'kk_rajfeladatok';
      dob.innerHTML = '<h4 class="kk_rajfeladatok_cim">Nyitott feladatok</h4><ul class="kk_feladatok" data-kk-feladat-lista="' + e(n) + '"></ul>';
      R.lw.insertBefore(dob, R.lw.firstChild); rajLista[n] = { dob: dob, ul: dob.querySelector('ul') };
      var jel = d.createElement('span'); jel.className = 'kk_rajszam'; R.fej.querySelector('h2,h3,h4').appendChild(jel); R.jel = jel;
    });
    var KIEMELT_MAX = 3, kiemeltDb = 0;
    lista.forEach(function (t) {
      var cel = rajLista[t.raj]; t.elemek = [];
      if (t.kiemelt) { if (kiemeltDb >= KIEMELT_MAX) t.kiemelt = false; else kiemeltDb++; }
      if (cmsMod) {
        if (cel) { cel.ul.appendChild(t.el); t.elemek.push(t.el); }
        if (t.kiemelt) { var kl = t.el.cloneNode(true); kiemeltLista.appendChild(kl); t.elemek.push(kl); }
      } else {
        if (cel) { cel.ul.insertAdjacentHTML('beforeend', kartya(t)); t.elemek.push(cel.ul.lastElementChild); }
        if (t.kiemelt) { kiemeltLista.insertAdjacentHTML('beforeend', kartya(t, true)); t.elemek.push(kiemeltLista.lastElementChild); }
      }
    });
    /* CMS-elemek, amik egyik rajhoz sem illeszkednek: maradnak a helyükön; a CMS-lista üres burkát elrejtjük */
    if (cmsMod) $$('.w-dyn-list').forEach(function (l) { if (!l.querySelector('[data-kk-cms="feladat"]') && l.closest('#rajok')) l.hidden = true; });

    var szurok = $$('[data-kk-szuro]', gyoker), talalat = gyoker.querySelector('.kk_talalat'), kTimer;
    function szur(meres) {
      var f = {}; szurok.forEach(function (s) { f[s.getAttribute('data-kk-szuro')] = s.value; });
      var q = norm(f.q), aktivSzuro = !!(q || f.raj || f.mod || f.eszkoz), db = 0, perRaj = {};
      lista.forEach(function (t) {
        var ok = (!f.raj || t.raj === f.raj) && (!f.mod || t.mod === f.mod) && (!f.eszkoz || t.eszkoz === f.eszkoz) &&
          (!q || norm(t.cim + ' ' + t.leiras + ' ' + t.raj).indexOf(q) >= 0);
        t.elemek.forEach(function (el) { el.hidden = !ok; });
        if (ok) { db++; perRaj[t.raj] = (perRaj[t.raj] || 0) + 1; }
      });
      kiemeltDoboz.hidden = !$$('[data-kk-feladat-lista="kiemelt"] > :not([hidden])', gyoker).length;
      rajNevekL.forEach(function (n) {
        var R = RAJOK[n], m = perRaj[n] || 0, osszes = lista.filter(function (t) { return t.raj === n; }).length;
        R.jel.textContent = osszes ? ' · ' + osszes + ' nyitott feladat' : '';
        rajLista[n].dob.hidden = !m;
        var rajNevTalal = q && norm(n).indexOf(q) >= 0;
        R.blokk.hidden = aktivSzuro && !m && !rajNevTalal && !(f.raj === n);
        if (aktivSzuro && (m || f.raj === n)) R.nyit(true, false);
      });
      talalat.textContent = aktivSzuro ? (db ? db + ' feladat illik a keresésedre' : 'Erre most nincs nyitott feladat. Nézd meg a rajokat, vagy írd meg a jelentkezésben, mihez értesz.') : lista.length + ' nyitott feladat ' + rajNevekL.length + ' rajban';
      if (meres) kuld(q ? 'kapu_kereses' : 'kapu_szures', { q: q.slice(0, 40), raj: f.raj, mod: f.mod, eszkoz: f.eszkoz, talalat: db });
    }
    szurok.forEach(function (s) {
      s.addEventListener(s.type === 'search' ? 'input' : 'change', function () { clearTimeout(kTimer); kTimer = setTimeout(function () { szur(true); }, s.type === 'search' ? 400 : 0); });
    });
    szur(false);
    valasztKezelo = function (b) {
      var li = b.closest('[data-kk-feladat-id], [data-kk-cms="feladat"]'); if (!li) return false;
      var t = lista.filter(function (x) { return x.elemek && x.elemek.indexOf(li) >= 0; })[0]; if (!t) return false;
      kuld('kapu_feladat_valasztas', { feladat: t.cim.slice(0, 80), raj: t.raj, kiemelt: !!t.kiemelt });
      jelentkezes(t.raj, t.cim, 'feladat');
      return true;
    };
    gyoker.setAttribute('data-kk-allapot', minta ? 'minta' : 'elo');
  }

  if (cmsFeladatok().length) felepit({ feladatok: [] });
  else fetch(forras, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(felepit).catch(function () { gyoker.setAttribute('data-kk-allapot', 'hiba'); });
})();
