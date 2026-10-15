/* Önkéntes vízadás – szezonzáró oldal viselkedése (a Webflow-oldal láblécéből töltődik, commit-SHA-ra rögzítve).
   Natív jelölésre épül: ha a szkript nem fut, az oldal akkor is teljes (a játékban a piros fa látszik, a számok a végértéken). */
(function () {
'use strict';
const d = document, oldal = d.querySelector('.ov-oldal'); if (!oldal) return;
const $ = (s, r) => (r || d).querySelector(s), $$ = (s, r) => [...(r || d).querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)'), kevesMozgas = () => RM.matches;

/* ---------- mérés: dataLayer (GTM), teszt-domainen napló ---------- */
window.dataLayer = window.dataLayer || [];
const teszt = /webflow\.io$/.test(location.hostname) || /[?&]meres\b/.test(location.search) || location.protocol === 'file:';
let naploLista = null, naploSzam = null, db = 0;
function mer(esemeny, adat) {
  const e = Object.assign({ event: 'ov_' + esemeny, oldal: 'onkentes-vizadas' }, adat || {});
  window.dataLayer.push(e);
  if (naploLista) { const li = d.createElement('li'); li.textContent = e.event + ' ' + JSON.stringify(adat || {}); naploLista.appendChild(li); naploSzam.textContent = ++db; }
}
if (teszt) {
  const g = d.createElement('button'); g.type = 'button'; g.className = 'ov-meres-gomb'; g.setAttribute('aria-expanded', 'false');
  g.innerHTML = 'Mérés: <span>0</span> esemény'; naploSzam = $('span', g);
  const p = d.createElement('section'); p.className = 'ov-naplo'; p.hidden = true; p.setAttribute('aria-label', 'Mérési napló (teszt)');
  p.innerHTML = '<strong>Mérési események</strong><p>Ezek mennek a dataLayer-be. Csak a teszt-domainen látszik.</p><ol></ol>'; naploLista = $('ol', p);
  g.addEventListener('click', () => { p.hidden = !p.hidden; g.setAttribute('aria-expanded', !p.hidden); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && !p.hidden) { p.hidden = true; g.setAttribute('aria-expanded', 'false'); g.focus(); } });
  oldal.append(g, p);
}
const helyNev = el => { const s = el.closest('section'); return (s && s.id) || 'ismeretlen'; };
const kattMer = (sel, esemeny) => $$(sel, oldal).forEach(a => a.addEventListener('click', () => mer(esemeny, { hely: helyNev(a), szoveg: a.textContent.trim().slice(0, 40) })));
kattMer('.ov-ertesito', 'ertesito_kattintas');
/* CTA-k: a data-ov-cta érték a hely (hero, hero-b2b, csatlakozz-…, partner-…, otlet, qr) */
$$('[data-ov-cta]', oldal).forEach(a => a.addEventListener('click', () => mer('cta_kattintas', { hely: a.getAttribute('data-ov-cta'), cel: a.getAttribute('href') || '' })));
$$('.ov-kerdes', oldal).forEach(k => k.addEventListener('toggle', () => { if (k.open) mer('gyik_nyitas', { kerdes: $('summary', k).textContent }); }));
const elso = $('.ov-kerdes', oldal); if (elso) elso.open = true;

/* ---------- QR-érkezés: plakátról, matricáról, szórólapról jövőknek egy rövid sáv a hero fölött ---------- */
(function () {
  const sav = $('.ov-qr-sav', oldal); if (!sav) return;
  const q = new URLSearchParams(location.search), med = (q.get('utm_medium') || '').toLowerCase(), forras = (q.get('utm_source') || '').toLowerCase();
  if (!/^(qr|print|offline|plakat|matrica|szorolap)$/.test(med) && !/qr|plakat|matrica|szorolap/.test(forras)) return;
  sav.classList.add('ov-lathato'); mer('qr_erkezes', { forras: forras || med, kampany: q.get('utm_campaign') || '' });
})();

/* ---------- okos boltgombok: platform + UTM ---------- */
const ua = navigator.userAgent;
const platform = /Android/i.test(ua) ? 'android' : (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) ? 'ios' : 'asztal';
d.documentElement.setAttribute('data-platform', platform);
const PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app', IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu';
$$('.ov-bolt', oldal).forEach(a => {
  const ios = a.classList.contains('ov-csak-ios'), h = helyNev(a);
  a.href = ios ? IOS + '&ct=vizadas-' + h : PLAY + '&referrer=' + encodeURIComponent('utm_source=beeco.hu&utm_medium=web&utm_campaign=onkentes-vizadas&utm_content=' + h);
  a.addEventListener('click', () => mer('bolt_kattintas', { bolt: ios ? 'app_store' : 'google_play', hely: h }));
});

/* ---------- gomb-szerep a Webflow-linkekre, amelyek valójában gombok ---------- */
function gombbaAlakit(a, katt) {
  a.setAttribute('role', 'button');
  a.addEventListener('click', e => { e.preventDefault(); katt(); });
  a.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); katt(); } });
}

/* ---------- próbáld ki: öntözd meg a fiatal fát (piros 100 l → sárga 50 l → zöld) ---------- */
(function () {
  const j = $('.ov-jatek', oldal); if (!j) return;
  const gomb = $('.ov-ontoz', j), szin = $('.ov-jatek-szin', j), allapot = $('.ov-jatek-allapot', j), toltes = $('.ov-jatek-toltes', j), liter = $('.ov-jatek-liter', j);
  const fa = { piros: $('.ov-jf-piros', j), sarga: $('.ov-jf-sarga', j), zold: $('.ov-jf-zold', j) };
  if (!gomb || !fa.piros) return;
  j.classList.add('ov-js'); allapot.setAttribute('aria-live', 'polite');
  let l = 0;
  const SZOV = { 0: ['piros', 'Piros a térképen: nagyon szomjas, 100 liter kell neki.', 'Öntözök 50 litert'],
                 50: ['sarga', 'Már sárga: még szomjas, kér még 50 litert.', 'Még 50 litert!'],
                 100: ['zold', 'Zöld lett! Köszöni a fa, most jóllakott. Tavasszal sok ilyen fa vár rád.', 'Újrakezdem'] };
  function mutat() {
    const [szinNev, szoveg, gombSz] = SZOV[l];
    Object.entries(fa).forEach(([k, el]) => el && el.classList.toggle('ov-akt', k === szinNev));
    allapot.textContent = szoveg; gomb.textContent = gombSz;
    toltes.style.width = l + '%'; liter.textContent = l + ' / 100 liter';
  }
  function cseppek() {
    if (kevesMozgas()) return;
    for (let i = 0; i < 7; i++) {
      const c = d.createElement('span'); c.className = 'ov-hull';
      c.style.setProperty('--dx', (-24 + Math.random() * 20).toFixed(0) + 'px'); c.style.animationDelay = (i * 70) + 'ms'; c.style.left = (90 + Math.random() * 16).toFixed(0) + 'px';
      szin.appendChild(c); setTimeout(() => c.remove(), 900 + i * 70);
    }
    j.classList.remove('ov-ont'); void j.offsetWidth; j.classList.add('ov-ont');
  }
  gombbaAlakit(gomb, () => {
    if (l >= 100) { l = 0; mutat(); mer('ontozes_ujra', {}); return; }
    l += 50; cseppek(); setTimeout(mutat, kevesMozgas() ? 0 : 450);
    mer('ontozes', { liter: l });
  });
  mutat();
})();

/* ---------- felpörgő számok az eredményeknél ---------- */
(function () {
  const szamok = $$('.ov-stat-szam, .ov-hero-szam', oldal);
  if (!szamok.length || kevesMozgas() || !('IntersectionObserver' in window)) return;
  szamok.forEach(el => {
    const eredeti = el.textContent.trim(), cel = parseInt(eredeti.replace(/\D/g, ''), 10); if (!cel) return;
    const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    el.setAttribute('aria-label', eredeti); el.textContent = fmt(0);
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (!e.isIntersecting) return; o.disconnect(); const t0 = performance.now(), T = 1500;
      (function lep(t) { const k = Math.min(1, (t - t0) / T), ki = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(cel * ki)); if (k < 1) requestAnimationFrame(lep); else el.textContent = eredeti; })(t0);
    }), { threshold: .6 }).observe(el);
  });
  const er = $('#eredmenyek'); if (er) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { o.disconnect(); mer('eredmenyek_megjelenes', {}); } }), { threshold: .3 }).observe(er);
})();
})();
