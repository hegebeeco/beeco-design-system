/* ============================================================
   beeco.hu főoldal – Szuperhős méhecske (fs-)  ·  forrás
   A Webflow natív elemeire épül (a Designerben is látszanak); ez a szkript adja:
   a méhecskét (a hivatalos csontváz-rigből), a lábnyom-útvonalat, a hero funkcióválasztót,
   a közösségi lábnyom-vásznat, a „Kinek szól?” kvízt, az okos boltgombot, a ragadós mobilsávot,
   a sötét/világos kapcsolót és a mérést (dataLayer).
   Építés: node weboldal/fooldal-szuperhos/build.mjs  →  fs.js (+ embed/*.css)
   ============================================================ */
(function () {
'use strict';
if (window.__fsFut) return; window.__fsFut = true;
const d = document, $ = (s, r) => (r || d).querySelector(s), $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
const oldal = $('.fs-oldal'); if (!oldal) return;
const RM = matchMedia('(prefers-reduced-motion: reduce)'), kevesMozgas = () => RM.matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const gorget = el => el && el.scrollIntoView({ behavior: kevesMozgas() ? 'auto' : 'smooth', block: 'start' });
const NS = 'http://www.w3.org/2000/svg';
const ikon = (n, cls) => '<svg class="' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#fs-i-' + n + '"/></svg>';
d.documentElement.classList.add('fs-js');

/* ---------- szimbólumok és rig ---------- */
const sprite = d.createElement('div');
sprite.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>{{SZIMBOLUMOK}}</defs></svg>';
d.body.appendChild(sprite.firstChild);
const RIG = (() => { const t = d.createElement('template'); t.innerHTML = '{{RIG}}'; return t.content.firstElementChild; })();

/* ---------- mérés: dataLayer (+ látható napló a teszt-domainen) ---------- */
window.dataLayer = window.dataLayer || [];
const naploKell = /webflow\.io$/.test(location.hostname) || /[?&]meres\b/.test(location.search) || location.protocol === 'file:';
let naploDb = 0, naploLista = null, naploSzam = null;
function mer(esemeny, adat) {
  const e = Object.assign({ event: 'beeco_' + esemeny }, adat || {});
  window.dataLayer.push(e);
  if (!naploLista) return;
  naploDb++; naploSzam.textContent = naploDb;
  const li = d.createElement('li'); li.innerHTML = '<code>' + e.event + '</code> ' + Object.entries(adat || {}).map(([k, v]) => k + ': ' + v).join(', ');
  naploLista.insertBefore(li, naploLista.firstChild);
}
if (naploKell) {
  const g = d.createElement('button'); g.type = 'button'; g.className = 'fs-meres-gomb'; g.setAttribute('aria-expanded', 'false');
  g.innerHTML = 'Mérés: <span>0</span> esemény'; naploSzam = g.querySelector('span');
  const p = d.createElement('section'); p.className = 'fs-naplo'; p.hidden = true; p.setAttribute('aria-label', 'Mérési napló (teszt)');
  p.innerHTML = '<h2>Mérési események</h2><p style="font-size:12px">Ezek mennek a dataLayer-be (Google Tag Manager). Csak a teszt-domainen látszik.</p><ol></ol>';
  naploLista = p.querySelector('ol');
  g.addEventListener('click', () => { p.hidden = !p.hidden; g.setAttribute('aria-expanded', !p.hidden); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && !p.hidden) { p.hidden = true; g.setAttribute('aria-expanded', 'false'); g.focus(); } });
  oldal.appendChild(g); oldal.appendChild(p);
}
const kattMer = (sel, esemeny, ertek) => $$(sel, oldal).forEach(a => a.addEventListener('click', () => mer(esemeny, ertek ? { ertek: ertek(a) } : {})));
kattMer('.fs-most-fut', 'most_fut_kattintas', () => 'csicsergosz');
kattMer('.fs-logo-csempe', 'logo_kattintas', a => (a.querySelector('img') || {}).alt || '');
kattMer('.fs-beebolt .fs-termek, .fs-bolt-gomb', 'beebolt_kattintas', a => (a.querySelector('.fs-termek-nev') || {}).textContent || 'gomb');
kattMer('.fs-pedia-link', 'beecopedia_kattintas', a => (a.querySelector('.fs-pedia-cim') || {}).textContent || '');
kattMer('.fs-csapat-gomb', 'csapat_csatlakozas');
kattMer('.fs-hirlevel-gomb', 'hirlevel_kattintas');
$$('.fs-kerdes', oldal).forEach(k => k.addEventListener('toggle', () => { if (k.open) mer('gyik_nyitas', { kerdes: $('summary', k).textContent }); }));
const elsoKerdes = $('.fs-kerdes', oldal); if (elsoKerdes) elsoKerdes.open = true;

/* ---------- platform: okos boltgomb, UTM ---------- */
const ua = navigator.userAgent;
const platform = /Android/i.test(ua) ? 'android' : (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) ? 'ios' : 'asztal';
d.documentElement.setAttribute('data-platform', platform);
const PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app', IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu';
const playUtm = h => PLAY + '&referrer=' + encodeURIComponent('utm_source=beeco.hu&utm_medium=web&utm_campaign=fooldal&utm_content=' + h);
const iosUtm = h => IOS + '&ct=fooldal-' + h;
const helyNev = el => { const s = el.closest('section,[id]'); return (s && s.id) || 'ismeretlen'; };
$$('.fs-bolt', oldal).forEach(a => { const ios = a.classList.contains('fs-csak-ios'), h = helyNev(a); a.href = ios ? iosUtm(h) : playUtm(h); a.addEventListener('click', () => mer('bolt_kattintas', { bolt: ios ? 'app_store' : 'google_play', hely: h })); });
function okosLetoltes(a, h) {
  if (platform === 'android') { a.href = playUtm(h); a.target = '_blank'; a.rel = 'noopener'; }
  else if (platform === 'ios') { a.href = iosUtm(h); a.target = '_blank'; a.rel = 'noopener'; }
  a.addEventListener('click', e => { mer('letoltes_gomb', { hely: h, platform: platform }); if (platform === 'asztal') { e.preventDefault(); gorget($('#letoltes')); } });
}
$$('.fs-okos-letoltes', oldal).forEach(a => okosLetoltes(a, helyNev(a)));
if ('IntersectionObserver' in window) $$('.fs-qr', oldal).forEach(qr => { let m = false; new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !m && platform === 'asztal') { m = true; mer('qr_megjelenes', { hely: helyNev(qr) }); } }), { threshold: .8 }).observe(qr); });

/* ---------- téma-kapcsoló (alapból világos; a választás megmarad) ---------- */
const tema = d.createElement('button'); tema.type = 'button'; tema.className = 'fs-tema';
tema.innerHTML = '<span class="fs-tema-sin" aria-hidden="true"></span>' + ikon('hold') + '<span class="fs-tema-felirat">Sötét mód</span>';
oldal.appendChild(tema);
const sotetE = () => d.documentElement.getAttribute('data-theme') === 'dark';
function temaFrissit() { const s = sotetE(); tema.setAttribute('aria-pressed', s); $('use', tema).setAttribute('href', s ? '#fs-i-nap-ikon' : '#fs-i-hold'); $('.fs-tema-felirat', tema).textContent = s ? 'Világos mód' : 'Sötét mód'; tema.setAttribute('aria-label', s ? 'Sötét mód bekapcsolva, váltás világosra' : 'Világos mód bekapcsolva, váltás sötétre'); }
try { if (localStorage.getItem('beeco-tema') === 'dark') d.documentElement.setAttribute('data-theme', 'dark'); } catch (e) { }
tema.addEventListener('click', () => { const uj = sotetE() ? 'light' : 'dark'; d.documentElement.setAttribute('data-theme', uj); try { localStorage.setItem('beeco-tema', uj); } catch (e) { } temaFrissit(); mer('tema_valtas', { tema: uj }); });
temaFrissit();

/* ---------- díszítő svg-k (domb, hurok, szaggatott vonalak) ---------- */
function svgElem(html) { const t = d.createElement('div'); t.innerHTML = html; return t.firstElementChild; }
const DOMB = '<svg class="fs-domb" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C 200 6, 380 8, 560 32 S 900 60, 1100 26 S 1340 6, 1440 30 V70 H0Z" style="fill:var(--domb-h)"/><path d="M0 56 C 240 30, 420 54, 640 48 S 1000 28, 1200 50 S 1380 62, 1440 54 V70 H0Z" style="fill:var(--domb-e)"/></svg>';
['.fs-hero', '.fs-miert', '.fs-raj', '.fs-gyik'].forEach(s => { const sz = $(s, oldal); if (sz) sz.appendChild(svgElem(DOMB)); });
const kaptar = $('.fs-kaptar-szin', oldal);
if (kaptar) kaptar.insertBefore(svgElem('<svg class="fs-hurok" viewBox="0 0 400 520" preserveAspectRatio="none" aria-hidden="true"><path d="M40 40 C 160 0, 240 90, 200 140 C 160 190, 110 130, 160 110 C 220 90, 360 160, 340 260 C 320 360, 60 330, 70 420 C 80 500, 300 520, 360 470" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="7 8"/></svg>'), kaptar.firstChild);
const lepesek = $('.fs-lepesek', oldal);
let utVonal = null;
if (lepesek) { utVonal = svgElem('<svg class="fs-lepes-vonal" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M30 30 C 160 -10, 240 70, 360 30 S 560 -10, 660 30 S 860 70, 980 30"/></svg>'); lepesek.insertBefore(utVonal, lepesek.firstChild); }
const idov = $('.fs-idovonal', oldal);
if (idov) idov.insertBefore(svgElem('<svg class="fs-vonal" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M10 30 C 120 0, 200 60, 300 30 S 500 0, 600 30 S 800 60, 990 20"/></svg>'), idov.firstChild);

/* ---------- belépők: csak a hajtás alatt induló elemek kapnak eltolt kezdőállapotot ---------- */
if (!kevesMozgas() && 'IntersectionObserver' in window) {
  const beIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('fs-var'); beIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.fs-be', oldal).forEach(n => { if (n.getBoundingClientRect().top > innerHeight * 0.92) { n.classList.add('fs-var'); const sor = $$('.fs-be', n.parentElement).indexOf(n); n.style.transitionDelay = (Math.max(0, sor) * 60) + 'ms'; beIO.observe(n); } });
  if (utVonal) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fs-rajzolt'); o.unobserve(e.target); } }), { threshold: .6 }).observe(utVonal);
} else if (utVonal) utVonal.classList.add('fs-rajzolt');

/* ---------- gombként viselkedő linkek ---------- */
function gombbaAlakit(a, katt) {
  a.setAttribute('role', 'button');
  a.addEventListener('click', e => { e.preventDefault(); katt(e); });
  a.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); katt(e); } });
}

/* =====================================================
   Szuperhős méhecske: a hivatalos csontváz-rig klónja
   ===================================================== */
const PISLOGHAT = new Set(['alap', 'vidam', 'figyelmes', 'kivancsi', 'meleg', 'nyugodt']);
const mehek = [];
class Meh {
  constructor(host, o) {
    o = o || {}; this.host = host;
    const svg = RIG.cloneNode(true);
    svg.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    svg.querySelectorAll('title,desc').forEach(n => n.remove());
    svg.removeAttribute('aria-labelledby'); svg.removeAttribute('role');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    host.appendChild(svg);
    this.cs = {};
    svg.querySelectorAll('[data-csont]').forEach(g => { const p = g.getAttribute('data-pivot').split(',').map(Number), k = g.getAttribute('data-csont'); (this.cs[k] = this.cs[k] || []).push({ g: g, px: p[0], py: p[1] }); });
    this.arcok = $$('[data-arc]', svg);
    this.face = null; this.tartos = o.arc || 'alap'; this.arc(this.tartos);
    this.p = { x: 0, y: 0, s: o.s || 1 }; this.v = { x: 0, y: 0, s: 0 }; this.t = { x: 0, y: 0, s: o.s || 1 };
    this.irany = 1; this.ul = !!o.ul; this.aktiv = true;
    this.ido = Math.random() * 10; this.kovPislog = 1.5 + Math.random() * 3; this.pislogVege = 0;
    this.ugrasT = -1; this.nez = { x: 0, y: 0 }; this.nezCel = { x: 0, y: 0 }; this.K = 38; this.D = 11;
    this.w = host.offsetWidth || 160;
    mehek.push(this);
  }
  hely(x, y, s) { this.p.x = this.t.x = x; this.p.y = this.t.y = y; if (s != null) this.p.s = this.t.s = s; this.v = { x: 0, y: 0, s: 0 }; this.rajzol(0); }
  cel(x, y, s) { this.t.x = x; this.t.y = y; if (s != null) this.t.s = s; }
  tav() { return Math.hypot(this.p.x - this.t.x, this.p.y - this.t.y); }
  arc(f) { this.tartos = f; this._arc(f); }
  _arc(f) { if (f === this.face) return; this.face = f; for (const g of this.arcok) g.setAttribute('display', g.getAttribute('data-arc') === f ? 'inline' : 'none'); }
  ugrik() { this.ugrasT = 0; }
  csont(n, r, dx, dy, sx, sy) {
    const l = this.cs[n]; if (!l) return; sx = sx == null ? 1 : sx; sy = sy == null ? sx : sy;
    for (const b of l) b.g.setAttribute('transform', 'translate(' + (b.px + (dx || 0)).toFixed(2) + ' ' + (b.py + (dy || 0)).toFixed(2) + ') rotate(' + (r || 0).toFixed(2) + ') scale(' + sx.toFixed(3) + ' ' + sy.toFixed(3) + ') translate(' + (-b.px) + ' ' + (-b.py) + ')');
  }
  lep(dt) {
    this.ido += dt;
    if (kevesMozgas()) { this.p.x = this.t.x; this.p.y = this.t.y; this.p.s = this.t.s; this.v.x = this.v.y = 0; }
    else {
      for (const k of ['x', 'y']) { const a = (this.t[k] - this.p[k]) * this.K - this.v[k] * this.D; this.v[k] = clamp(this.v[k] + a * dt, -1600, 1600); this.p[k] += this.v[k] * dt; }
      const as = (this.t.s - this.p.s) * 30 - this.v.s * 10; this.v.s += as * dt; this.p.s += this.v.s * dt;
    }
    this.rajzol(dt);
  }
  rajzol(dt) {
    const rm = kevesMozgas(), seb = Math.hypot(this.v.x, this.v.y), repul = seb > 45;
    if (this.v.x > 70) this.irany = 1; else if (this.v.x < -70) this.irany = -1;
    const half = this.w / 2;
    this.host.style.transform = 'translate3d(' + (this.p.x - half).toFixed(1) + 'px,' + (this.p.y - half).toFixed(1) + 'px,0) scale(' + (this.p.s * this.irany).toFixed(3) + ',' + this.p.s.toFixed(3) + ')';
    const t = this.ido, dol = rm ? 0 : clamp(Math.abs(this.v.x) * 0.011 + this.v.y * 0.009, -20, 20);
    let bob = 0, ug = 0, sx = 1, sy = 1;
    if (!this.ul && !rm) bob = Math.sin(t * 2 * Math.PI * 1.15) * 5;
    if (this.ugrasT >= 0 && !rm) { this.ugrasT += dt; const u = this.ugrasT / 0.42; if (u < 1) ug = -Math.sin(Math.PI * u) * 22; else if (u < 1.5) { const q = (u - 1) / 0.5; sx = 1 + 0.08 * Math.sin(Math.PI * q); sy = 1 - 0.08 * Math.sin(Math.PI * q); } else this.ugrasT = -1; }
    this.csont('root', dol, 0, bob + ug); this.csont('test', 0, 0, 0, sx, sy);
    let sz; if (this.ul) sz = -6; else if (rm) sz = -14; else { const f = repul ? 12 : 8, amp = repul ? 30 : 20; sz = Math.sin(t * 2 * Math.PI * f) * amp - 8; }
    this.csont('szarnyBal', sz); this.csont('szarnyJobb', sz * 0.85);
    const kw = 2 * Math.PI * (repul ? 2.6 : 1.3), ka = rm ? 0 : (repul ? 1.6 : 1), alap = rm ? 0 : clamp(seb * 0.006, 0, 9);
    this.csont('kopeny1', alap * 0.4 + Math.sin(t * kw) * 2.5 * ka); this.csont('kopeny2', alap * 0.8 + Math.sin(t * kw - 0.7) * 5 * ka); this.csont('kopeny3', alap * 1.2 + Math.sin(t * kw - 1.4) * 8 * ka);
    if (!rm) { const cw = 2 * Math.PI * 0.9; this.csont('csapBal1', Math.sin(t * cw) * 5); this.csont('csapJobb1', Math.sin(t * cw + 0.6) * 5); this.csont('csapBal2', Math.sin(t * cw - 0.8) * 7); this.csont('csapJobb2', Math.sin(t * cw - 0.2) * 7); }
    this.nez.x += (this.nezCel.x - this.nez.x) * 0.15; this.nez.y += (this.nezCel.y - this.nez.y) * 0.15;
    this.csont('pupillaBal', 0, this.nez.x, this.nez.y); this.csont('pupillaJobb', 0, this.nez.x, this.nez.y);
    if (!rm && dt > 0) {
      if (this.pislogVege && t > this.pislogVege) { this.pislogVege = 0; this._arc(this.tartos); }
      else if (!this.pislogVege && t > this.kovPislog && PISLOGHAT.has(this.tartos)) { this._arc('pislogo'); this.pislogVege = t + 0.12; this.kovPislog = t + 2.8 + Math.random() * 3.5; }
    }
  }
}
addEventListener('pointermove', e => {
  for (const m of mehek) { const r = m.host.getBoundingClientRect(); const dx = (e.clientX - (r.left + r.width / 2)) * m.irany, dy = e.clientY - (r.top + r.height / 2), dd = Math.hypot(dx, dy) || 1; m.nezCel.x = dx / dd * 3.2; m.nezCel.y = dy / dd * 2.6; }
}, { passive: true });

const ciklusok = [];
let utolso = 0, fut = false;
function keret(ts) {
  const dt = Math.min(0.05, (ts - utolso) / 1000 || 0.016); utolso = ts;
  for (const f of ciklusok) f(dt, ts);
  for (const m of mehek) if (m.aktiv) m.lep(dt);
  if (d.hidden) { fut = false; return; }
  requestAnimationFrame(keret);
}
function indit() { if (!fut) { fut = true; utolso = performance.now(); requestAnimationFrame(keret); } }
d.addEventListener('visibilitychange', () => { if (!d.hidden) indit(); });

/* ---------- ragadós letöltősáv (mobil) ---------- */
const ragados = d.createElement('div'); ragados.className = 'fs-ragados'; ragados.setAttribute('aria-hidden', 'true');
ragados.innerHTML = ikon('lab', 'fs-lab') + '<p><b>beeco app</b>Ingyenes, 4,6 ★</p><a class="fs-gomb fs-okos-letoltes" href="#letoltes" tabindex="-1">Töltsd le az appot</a>';
oldal.appendChild(ragados); okosLetoltes($('a', ragados), 'ragados');
d.body.classList.add('fs-van-ragados');
let heroLat = true, zaroLat = false;
function ragadosFrissit() { const lat = !heroLat && !zaroLat; ragados.classList.toggle('fs-lat', lat); ragados.setAttribute('aria-hidden', !lat); $('a', ragados).tabIndex = lat ? 0 : -1; }
const heroCta = $('.fs-hero .fs-cta-sor', oldal), zaro = $('#letoltes');
if (heroCta) new IntersectionObserver(es => es.forEach(e => { heroLat = e.isIntersecting; ragadosFrissit(); })).observe(heroCta);
if (zaro) new IntersectionObserver(es => es.forEach(e => { zaroLat = e.isIntersecting; ragadosFrissit(); }), { threshold: .15 }).observe(zaro);

/* =====================================================
   Főszereplő: hero → lábnyom-útvonal → leszállás → haza az appba
   ===================================================== */
const reteg = d.createElement('div'); reteg.className = 'fs-reteg'; reteg.setAttribute('aria-hidden', 'true');
reteg.innerHTML = '<div class="fs-meh"></div>'; oldal.insertBefore(reteg, oldal.firstChild);
const meh = new Meh($('.fs-meh', reteg), { arc: 'vidam', s: 0.5 });
const sin = d.createElement('div'); sin.className = 'fs-sin';
sin.innerHTML = '<svg class="fs-ut" aria-hidden="true"><path class="fs-ut-alap"/><path class="fs-ut-halvany"/><path class="fs-ut-teli"/></svg>';
const sinNav = d.createElement('div'); sinNav.className = 'fs-sin fs-sin-nav'; sinNav.innerHTML = '<nav aria-label="Hol tartasz az oldalon"></nav>';
oldal.appendChild(sin); oldal.appendChild(sinNav);
const sinSvg = $('svg', sin), halv = $('.fs-ut-halvany', sin), teli = $('.fs-ut-teli', sin), alapUt = $('.fs-ut-alap', sin), allNav = $('nav', sinNav);
const ALL = [['kezdes', 'Kezdés', 'vidam'], ['miert', 'Miért?', 'figyelmes'], ['raj', 'Közösség', 'meleg'], ['rolunk', 'Rólunk', 'buszke'], ['utak', 'Kinek szól?', 'vidam'], ['gyik', 'GYIK', 'figyelmes'], ['letoltes', 'Letöltés', 'ujjongo']].filter(a => d.getElementById(a[0]));
let pontok = [], hossz = [], L = 0, allT = [];
function sinEpit() {
  const r = sin.getBoundingClientRect(), W = r.width, H = r.height; if (!H) return;
  sinSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  pontok = []; const N = 300;
  for (let i = 0; i <= N; i++) {
    const u = i / N; let x = W * 0.55 + Math.sin(2 * Math.PI * u * 2.6) * W * 0.22, y = 8 + u * (H - 16);
    [[0.24, 1], [0.55, -1], [0.82, 1]].forEach(([c, old]) => { const LW = 0.06; if (Math.abs(u - c) < LW / 2) { const q = (u - c) / LW + 0.5, sm = q * q * (3 - 2 * q), th = 2 * Math.PI * sm, rr = Math.min(16, W * 0.2); x += rr * Math.sin(th) * old; y -= rr * (1 - Math.cos(th)) * 0.95; } });
    pontok.push([x, y]);
  }
  hossz = [0]; for (let i = 1; i < pontok.length; i++) hossz.push(hossz[i - 1] + Math.hypot(pontok[i][0] - pontok[i - 1][0], pontok[i][1] - pontok[i - 1][1]));
  L = hossz[hossz.length - 1];
  const dd = 'M' + pontok.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  halv.setAttribute('d', dd); teli.setAttribute('d', dd); alapUt.setAttribute('d', dd);
}
function pontHossznal(l) { l = clamp(l, 0, L); let i = 1; while (i < hossz.length && hossz[i] < l) i++; i = Math.min(i, hossz.length - 1); const a = pontok[i - 1], b = pontok[i], f = (l - hossz[i - 1]) / ((hossz[i] - hossz[i - 1]) || 1); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
const gombok = ALL.map(([id, nev]) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'fs-allomas'; b.setAttribute('aria-label', 'Ugrás: ' + nev); b.innerHTML = ikon('lab') + '<span>' + nev + '</span>'; b.addEventListener('click', () => { gorget(d.getElementById(id)); mer('allomas_kattintas', { allomas: nev }); }); allNav.appendChild(b); return b; });
function hatar() { const k = $('#kezdes').getBoundingClientRect().top + scrollY, v = $('#letoltes').getBoundingClientRect().bottom + scrollY - innerHeight; return [k, Math.max(k + 1, v)]; }
function allomasHely() {
  const [k, v] = hatar();
  allT = ALL.map(([id]) => clamp((d.getElementById(id).getBoundingClientRect().top + scrollY - innerHeight * 0.3 - k) / (v - k), 0, 1));
  allT[0] = 0; allT[allT.length - 1] = 1;
  gombok.forEach((b, i) => { const p = pontHossznal(allT[i] * L); b.style.left = p[0] + 'px'; b.style.top = p[1] + 'px'; });
}
const szeles = () => innerWidth >= 900;
function frissit() { sin.classList.toggle('fs-lat', szeles()); sinNav.classList.toggle('fs-lat', szeles()); if (szeles()) { sinEpit(); allomasHely(); } }
addEventListener('resize', frissit);
addEventListener('load', frissit);
function relHely(el, fx, fy) { const r = el.getBoundingClientRect(), pr = reteg.getBoundingClientRect(); return [r.left - pr.left + r.width * (fx == null ? .5 : fx), r.top - pr.top + r.height * (fy == null ? .5 : fy)]; }

/* hero: funkció-piktogramok */
const funkok = $$('.fs-funk', oldal), kepek = $$('.fs-app-kep', oldal), felirat = $('.fs-felirat', oldal);
const KULCS = ['lab', 'terkep', 'vasarlas', 'hir', 'kozosseg', 'nektar'];
const kepDoboz = $('.fs-app-kepek', oldal); if (kepDoboz) kepDoboz.classList.add('fs-js');
if (felirat) felirat.setAttribute('aria-live', 'polite');
const tura = d.createElement('div'); tura.className = 'fs-tura'; tura.hidden = true; tura.innerHTML = '<span>A méhecske körbevezet.</span><button type="button">Megállítom</button>';
if (felirat) felirat.after(tura);
let funkCel = funkok[0], erkezett = true, turaFut = false, turaIdo = [];
function valaszt(i, kezi) {
  const s = funkok[i]; if (!s) return;
  funkok.forEach((x, j) => x.setAttribute('aria-pressed', j === i));
  kepek.forEach((x, j) => x.classList.toggle('fs-aktiv', j === i));
  if (felirat) felirat.innerHTML = '<h2 class="fs-felirat-cim">' + $('.fs-funk-cim', s).textContent + '</h2><p class="fs-felirat-szoveg">' + $('.fs-funk-szoveg', s).textContent + '</p>';
  funkCel = s; erkezett = false; meh.arc('kivancsi');
  if (kezi) { turaAll(); mer('funkcio_valasztas', { funkcio: KULCS[i] || i }); }
}
function turaAll() { if (turaFut) mer('tura_vege', {}); turaFut = false; turaIdo.forEach(clearTimeout); turaIdo = []; tura.hidden = true; }
function turaIndit() {
  if (kevesMozgas() || funkok.length < 6) return;
  turaFut = true; tura.hidden = false;
  [1, 4, 2].forEach((k, n) => turaIdo.push(setTimeout(() => { if (turaFut) valaszt(k); }, 1200 + n * 2300)));
  turaIdo.push(setTimeout(() => { if (turaFut) { valaszt(0); turaFut = false; tura.hidden = true; } }, 1200 + 3 * 2300));
}
funkok.forEach((s, i) => gombbaAlakit(s, () => valaszt(i, true)));
$('button', tura).addEventListener('click', turaAll);
valaszt(0);

let allapot = 'hero', leszallIdo = 0, playLat = false;
const leszallo = () => $$('.fs-zaro .fs-bolt', oldal).find(b => b.offsetParent !== null) || $('.fs-zaro .fs-bolt', oldal);
const boltok = $('.fs-zaro .fs-boltok', oldal);
if (boltok) new IntersectionObserver(es => es.forEach(e => { playLat = e.intersectionRatio >= 0.9; }), { threshold: [0, 0.9, 1] }).observe(boltok);
const zaroTelefon = $('.fs-zaro-telefon', oldal);
ciklusok.push(function (dt, ts) {
  const hero = $('#kezdes'); if (!hero) return;
  const hr = hero.getBoundingClientRect();
  const [k, v] = hatar(), prog = clamp((scrollY - k) / (v - k), 0, 1);
  let akt = 0;
  if (szeles() && allT.length) { for (let i = 0; i < allT.length; i++) if (prog >= allT[i] - 0.02) akt = i; }
  else ALL.forEach(([id], i) => { if (d.getElementById(id).getBoundingClientRect().top < innerHeight * 0.5) akt = i; });
  gombok.forEach((b, i) => { b.classList.toggle('fs-bejart', i <= akt); if (i === akt) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  if (L) teli.style.strokeDasharray = (prog * L).toFixed(1) + ' ' + L;
  if (playLat) { if (allapot !== 'leszall' && allapot !== 'haza' && allapot !== 'otthon') { allapot = 'leszall'; leszallIdo = ts; meh.ul = false; } }
  else if (allapot === 'leszall' || allapot === 'haza' || allapot === 'otthon') { allapot = 'ut'; meh.ul = false; }
  if (allapot === 'leszall') { meh.host.classList.remove('fs-rejt'); const p = relHely(leszallo(), 0.86, -0.05); meh.cel(p[0], p[1] - 22, 0.55); meh.arc('ujjongo'); if (meh.tav() < 6) meh.ul = true; if (ts - leszallIdo > 2600) { allapot = 'haza'; meh.ul = false; } return; }
  if (allapot === 'haza') { const p = relHely(zaroTelefon || leszallo(), 0.5, 0.38); meh.cel(p[0], p[1], 0.2); meh.arc('meleg'); if (meh.tav() < 10) { allapot = 'otthon'; meh.host.classList.add('fs-rejt'); } return; }
  if (allapot === 'otthon') return;
  if (hr.bottom > innerHeight * 0.45) {
    if (allapot !== 'hero') { allapot = 'hero'; erkezett = false; }
    meh.host.classList.remove('fs-rejt');
    const p = relHely($('.fs-pin', funkCel), 0.9, 0.05); meh.cel(p[0], p[1], 0.5);
    if (!erkezett && meh.tav() < 8) { erkezett = true; meh.arc('ujjongo'); meh.ugrik(); setTimeout(() => { if (erkezett && allapot === 'hero') meh.arc('vidam'); }, 700); }
  } else {
    if (allapot === 'hero' && turaFut) turaAll();
    allapot = 'ut';
    if (szeles()) { meh.host.classList.remove('fs-rejt'); const sr = sin.getBoundingClientRect(), pr = reteg.getBoundingClientRect(), p = pontHossznal(prog * L); meh.cel(sr.left - pr.left + p[0], sr.top - pr.top + p[1] - 18, 0.5); }
    else { const pr = reteg.getBoundingClientRect(); meh.cel(innerWidth - 50 - pr.left, 110 - pr.top, 0.4); meh.host.classList.add('fs-rejt'); }
    meh.arc(ALL[akt][2]);
  }
});
if (kaptar) { const heroIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { heroIO.disconnect(); turaIndit(); } }), { threshold: .5 }); heroIO.observe(kaptar); }

/* =====================================================
   Közösség: „Beállok a rajba”, felpörgő nagy számok
   ===================================================== */
(function () {
  const gomb = $('.fs-csatlakoz', oldal), uzenet = $('.fs-raj-uzenet', oldal); let csatl = false;
  if (uzenet) uzenet.setAttribute('aria-live', 'polite');
  if (gomb) gombbaAlakit(gomb, () => {
    if (csatl) { mer('letoltes_gomb', { hely: 'raj', platform: platform }); if (platform === 'android') location.href = playUtm('raj'); else if (platform === 'ios') location.href = iosUtm('raj'); else gorget($('#letoltes')); return; }
    csatl = true; mer('raj_csatlakozas', {});
    meh.arc('ujjongo'); meh.ugrik();
    if (uzenet) uzenet.textContent = 'Üdv a rajban! Egy lépéssel közelebb a zöld 2050-hez.';
    gomb.textContent = 'Töltsd le az appot';
  });
  const szamok = $$('.fs-szam-ertek', oldal);
  if (!szamok.length || kevesMozgas() || !('IntersectionObserver' in window)) return;
  szamok.forEach(el => {
    const eredeti = el.textContent.trim(), m = eredeti.match(/^([\d.\s]+)(.*)$/); if (!m) return;
    const cel = parseInt(m[1].replace(/\D/g, ''), 10), pont = /\./.test(m[1]), fmt = n => (pont ? n.toLocaleString('de-DE') : String(n)) + m[2];
    el.setAttribute('aria-label', eredeti); el.textContent = fmt(0);
    new IntersectionObserver((es, o) => es.forEach(e => { if (!e.isIntersecting) return; o.disconnect(); const t0 = performance.now(), T = 1300;
      (function lep(t) { const k = Math.min(1, (t - t0) / T), ki = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(cel * ki)); if (k < 1) requestAnimationFrame(lep); else el.textContent = eredeti; })(t0); }), { threshold: .6 }).observe(el);
  });
})();

/* =====================================================
   Végtelen sávok: vélemények, sajtó (a tartalom duplikálva; szüneteltethető)
   ===================================================== */
function vegtelen(el, seb, cimke, gombFelirat) {
  if (!el || el.classList.contains('fs-vegtelen')) return;
  const sav = d.createElement('div'); sav.className = 'fs-vegtelen-sav';
  [...el.children].forEach(c => sav.appendChild(c));
  const db = sav.children.length; if (!db) return;
  [...sav.children].forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.setAttribute('inert', ''); sav.appendChild(k); });
  el.appendChild(sav); el.classList.add('fs-vegtelen'); el.setAttribute('tabindex', '0'); el.setAttribute('role', 'region'); el.setAttribute('aria-label', cimke + ' (görgethető)');
  let fel = 0, pos = null, all = false, lathato = false, szunet = 0, huz = null;
  const most = () => performance.now(), meres = () => { fel = sav.children[db].offsetLeft - sav.children[0].offsetLeft; };
  const tart = ms => { szunet = Math.max(szunet, most() + ms); pos = null; };
  el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') szunet = Infinity; });
  el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { szunet = 0; tart(400); } });
  el.addEventListener('touchstart', () => { szunet = Infinity; }, { passive: true });
  el.addEventListener('touchend', () => { szunet = 0; tart(2500); }, { passive: true });
  el.addEventListener('focusin', () => { szunet = Infinity; }); el.addEventListener('focusout', () => { szunet = 0; tart(400); });
  el.addEventListener('wheel', () => tart(1500), { passive: true });
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; huz = { x: e.clientX, s: el.scrollLeft, mozgott: false }; el.classList.add('fs-huz'); });
  addEventListener('pointermove', e => { if (!huz) return; const dx = e.clientX - huz.x; if (Math.abs(dx) > 4) huz.mozgott = true; if (huz.mozgott) { e.preventDefault(); el.scrollLeft = huz.s - dx; } });
  addEventListener('pointerup', () => { if (!huz) return; el.classList.remove('fs-huz');
    if (huz.mozgott) { const blokk = ev => { ev.preventDefault(); ev.stopPropagation(); el.removeEventListener('click', blokk, true); }; el.addEventListener('click', blokk, true); setTimeout(() => el.removeEventListener('click', blokk, true), 50); mer('sav_huzas', { sav: cimke }); }
    huz = null; tart(1200); });
  el.addEventListener('dragstart', e => e.preventDefault());
  el.addEventListener('scroll', () => { if (!fel) return; if (el.scrollLeft >= fel + 1) { el.scrollLeft -= fel; if (huz) huz.s -= fel; } else if (el.scrollLeft < 1) { el.scrollLeft += fel; if (huz) huz.s += fel; } }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => lathato = e.isIntersecting)).observe(el); else lathato = true;
  addEventListener('resize', meres); addEventListener('load', meres);
  ciklusok.push(dt => {
    if (!fel) { meres(); if (fel) el.scrollLeft = 1; return; }
    if (all || !lathato || huz || kevesMozgas() || most() < szunet) { pos = null; return; }
    if (pos === null) pos = el.scrollLeft;
    pos += seb * dt; if (pos >= fel) pos -= fel; el.scrollLeft = pos;
  });
  if (gombFelirat) {
    const g = d.createElement('button'); g.type = 'button'; g.className = 'fs-sav-gomb';
    const frissit = () => { g.setAttribute('aria-pressed', all); g.textContent = all ? '▶ ' + gombFelirat[1] : '❚❚ ' + gombFelirat[0]; };
    g.addEventListener('click', () => { all = !all; pos = null; frissit(); mer('sav_szunet', { sav: cimke, all: all }); });
    frissit(); el.insertAdjacentElement('afterend', g);
  }
}
vegtelen($('.fs-velemenyek', oldal), 34, 'Vélemények', ['Vélemények megállítása', 'Vélemények indítása']);
vegtelen($('.fs-sajto .fs-logosor', oldal), 40, 'Írtak rólunk');
vegtelen($('.fs-partner-racs', oldal), 40, 'Szakmai partnereink');

/* =====================================================
   Csapat-slider: görgethető képsor, nyilak, pontok, lassú automata lapozás
   ===================================================== */
(function () {
  const doboz = $('.fs-csapat-slider', oldal), diak = doboz && $('.fs-diak', doboz); if (!diak) return;
  const kepek = [...diak.children]; if (kepek.length < 2) return;
  const vezer = d.createElement('div'); vezer.className = 'fs-slider-vezer';
  const elozo = d.createElement('button'), kov = d.createElement('button');
  elozo.type = kov.type = 'button'; elozo.className = 'fs-slider-gomb'; kov.className = 'fs-slider-gomb';
  elozo.setAttribute('aria-label', 'Előző kép'); kov.setAttribute('aria-label', 'Következő kép'); elozo.textContent = '‹'; kov.textContent = '›';
  const pontok = d.createElement('div'); pontok.className = 'fs-slider-pontok';
  const pb = kepek.map((k, i) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'fs-slider-pont'; b.setAttribute('aria-label', (i + 1) + '. kép'); b.addEventListener('click', () => { megy(i); kezi(); }); pontok.appendChild(b); return b; });
  vezer.append(elozo, pontok, kov); doboz.appendChild(vezer);
  let akt = 0, ido = null;
  const megy = i => { akt = (i + kepek.length) % kepek.length; diak.scrollTo({ left: kepek[akt].offsetLeft - diak.offsetLeft, behavior: kevesMozgas() ? 'auto' : 'smooth' }); };
  const jelol = () => pb.forEach((b, i) => b.setAttribute('aria-current', i === akt ? 'true' : 'false'));
  diak.addEventListener('scroll', () => { const i = Math.round(diak.scrollLeft / diak.clientWidth); if (i !== akt) { akt = i; } jelol(); }, { passive: true });
  const auto = () => { clearInterval(ido); if (!kevesMozgas()) ido = setInterval(() => { if (!doboz.matches(':hover,:focus-within')) megy(akt + 1); }, 5000); };
  const kezi = () => { mer('csapat_slider', { kep: akt + 1 }); auto(); };
  elozo.addEventListener('click', () => { megy(akt - 1); kezi(); }); kov.addEventListener('click', () => { megy(akt + 1); kezi(); });
  jelol(); auto();
})();

/* =====================================================
   Záró: egymás után beúszó kérdések
   ===================================================== */
(function () {
  const forgo = $('.fs-forgo', oldal), lista = forgo && $('.fs-forgo-lista', forgo); if (!lista) return;
  const elemek = [...lista.children]; if (elemek.length < 2) return;
  forgo.classList.add('fs-forgo-js'); lista.setAttribute('aria-live', 'off');
  let i = 0, lathato = false;
  elemek.forEach((el, k) => el.classList.toggle('fs-forgo-akt', k === 0));
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => lathato = e.isIntersecting)).observe(forgo);
  setInterval(() => {
    if (!lathato || d.hidden) return;
    const reg = elemek[i]; i = (i + 1) % elemek.length; const uj = elemek[i];
    reg.classList.remove('fs-forgo-akt'); reg.classList.add('fs-forgo-ki'); uj.classList.remove('fs-forgo-ki'); uj.classList.add('fs-forgo-akt');
    setTimeout(() => reg.classList.remove('fs-forgo-ki'), 500);
  }, 2400);
})();

/* =====================================================
   Kinek szól: B2C (lábnyom), B2G (polgármester), B2B (vállalkozás)
   ===================================================== */
(function () {
  const test = $('.fs-kviz-test', oldal), bub = $('.fs-buborek', oldal), hely = $('.fs-kviz-mehhely', oldal);
  if (!test || !bub || !hely) return;
  const helyKep = $('img', hely); if (helyKep) helyKep.remove();
  const host = d.createElement('div'); host.className = 'fs-meh'; host.setAttribute('aria-hidden', 'true'); hely.appendChild(host);
  bub.setAttribute('aria-live', 'polite');
  const km = new Meh(host, { arc: 'kivancsi', s: 1 });
  const REAK = [['ujjongo', 'Szuper, ez nagyon ökos!'], ['vidam', 'Jó úton jársz!'], ['meleg', 'Semmi gond, ebben tudunk segíteni.']];
  const UTAK = {
    b2c: { koszon: 'Szia! Segítek kideríteni, miben vagy már ökohős.', lab: 'Játékos előszűrés, nem a valódi kalkulátor.',
      kerdes: [
        { ter: 'Közlekedés', k: 'Hogyan jársz leggyakrabban?', v: [['Autóval', 'auto', 2], ['Tömegközlekedéssel', 'busz', 1], ['Biciklivel vagy gyalog', 'bicaj', 0]] },
        { ter: 'Étkezés', k: 'Milyen gyakran eszel húst?', v: [['Szinte minden nap', 'hus', 2], ['Hetente párszor', 'tal', 1], ['Ritkán vagy soha', 'level', 0]] },
        { ter: 'Ruhák', k: 'Mi lesz a megunt ruháiddal?', v: [['Kidobom', 'kuka', 2], ['Elajándékozom', 'ajandek', 1], ['Cserélem vagy javítom', 'csere', 0]] }],
      reakcio: v => REAK[v],
      eredmeny(vs) {
        const LEP = { 'Közlekedés': ['Nézz körül a közelben!', 'A Zöld térképen megmutatjuk a zöld helyeket és programokat gyalog- vagy bringatávon.'], 'Étkezés': ['Egyél szezonálisan!', 'Mi terem most? Szezonális alapanyagok és növényi receptek az appban.'], 'Ruhák': ['Cserélj, ne vegyél!', 'Csere-bere programok a Kaptárnaptárban, és kuponok zöld partnerektől.'] };
        const min = Math.min(...vs), max = Math.max(...vs), mind = max === 0;
        const eros = this.kerdes[vs.indexOf(min)].ter, lp = mind ? ['Gyűjts nektárt!', 'Minden ökos lépésedért nektár jár az appban, amit jutalmakra válthatsz.'] : LEP[this.kerdes[vs.lastIndexOf(max)].ter];
        return { arc: 'buszke', bub: mind ? 'Igazi ökohős vagy!' : 'Megvan, merre repülünk tovább!', cim: 'Ebben már ökohős vagy', kod: mind ? 'mind' : this.kerdes[vs.lastIndexOf(max)].ter,
          sorok: [['Erősséged', mind ? 'Mindhárom terület' : eros, ''], ['Következő lépés', lp[0], lp[1]]], kiemelt: 1, cta: 'Töltsd le az appot', letolt: true, kep: true, lab: 'A pontos számot az app kalkulátora adja.' };
      } },
    b2g: { koszon: 'Üdv! Már 15 önkormányzattal dolgozunk. Nézzük, mit tehetünk nálatok.', javaslat: true,
      kerdes: [
        { k: 'Mi a legfontosabb célotok?', v: [['A lakók szemléletformálása', 'hir', 'szemlelet'], ['A helyi zöld programok láthatósága', 'nap', 'lathato'], ['Közös önkéntes akció', 'csepp', 'akcio']] },
        { k: 'Hol érjük el a lakókat?', v: [['Az appban', 'lab', 'app'], ['Helyi rendezvényen', 'raj', 'esemeny'], ['Mindkettőn', 'cel', 'mind']] }],
      reakcio: () => ['figyelmes', 'Értem, ez jó irány.'],
      eredmeny(vs) {
        const CEL = { szemlelet: ['Lakossági zöld csomag', 'Helyi tippek és hírek a lakóknak a napi ökosságban, a lábnyomkalkulátorral együtt.'], lathato: ['A település a Zöld térképen', 'A zöld helyek a térképre, a programok a Kaptárnaptárba kerülnek.'], akcio: ['Közös kampány', 'Az Önkéntes vízadás mintájára, ahol 2025-ben 7 000 fa kapott inni: a lakók az appból jelentkeznek, a részvétel mérhető.'] };
        const HOL = { app: 'Az appban 25.000+ letöltő közül érjük el a helyieket.', esemeny: 'Helyi rendezvényre visszük a programjainkat, például Klímafreskót vagy csere-berét.', mind: 'Az appban és helyi rendezvényen is jelen vagyunk, így a kettő erősíti egymást.' };
        return { arc: 'vidam', bub: 'Ebből jó közös projekt lehet!', cim: 'A javaslatunk a településnek', kod: vs[0], telepulesek: true,
          sorok: [['Javaslat', CEL[vs[0]][0], CEL[vs[0]][1]], ['Elérés', 'Így érjük el a lakókat', HOL[vs[1]]]], kiemelt: 0, cta: 'Egyeztessünk', href: '/kapcsolat', lab: 'Szakmai partnerünk az Élhető Települések Országos Szövetsége.' };
      } },
    b2b: { koszon: 'Szia! Nézzük, hogyan találnak meg a zöld vásárlók.',
      kerdes: [
        { k: 'Milyen a vállalkozásod?', v: [['Zöld kisvállalkozás, bolt, szolgáltató', 'bolt', 'kkv'], ['Nagyvállalat', 'ceg', 'nagy']] },
        { k: 'Mi a legfontosabb célod?', v: [['Új vásárlók', 'kupon', 'vevo'], ['A munkatársak bevonása', 'raj', 'csapat'], ['Márkaépítés, ESG', 'cel', 'marka']] }],
      reakcio: () => ['figyelmes', 'Rendben, nézzük tovább!'],
      eredmeny(vs) {
        let r;
        if (vs[1] === 'vevo') r = ['Partnerprogram', 'Kerülj be a beeco appba: megjelenés, kuponfüzet és analitika. A Zümi csomagban már mindent megkapsz az első kuponhoz.', 'Kerülj fel az appba', '/szolgaltatas/partner'];
        else if (vs[1] === 'csapat') r = ['Zöld programok', 'Klímafreskó, ökos kvíz, workshopok és csere-bere a munkatársaknak.', 'Kérj ajánlatot', '/szolgaltatas/zold-esemeny-szervezes'];
        else r = ['Marketing és ESG', 'Közös kampány, mint az őszi CsicsergŐsz, és ESG-tanácsadás.', 'Beszéljünk', '/szolgaltatas/szolgaltatasaink'];
        if (vs[0] === 'kkv' && vs[1] !== 'vevo') r[1] += ' Kisvállalkozásként a partnerprogrammal is indulhatsz.';
        return { arc: 'ujjongo', bub: 'Ez nektek való!', cim: 'Ezzel indulnék', kod: vs.join('-'), sorok: [['Javaslat', r[0], r[1]], vs[1] === 'vevo' ? ['Mennyi idő', 'Három lépés', 'Jelentkezés, beállítás, élesítés.'] : ['Következő lépés', 'Írj nekünk', 'Elmondod, mit szeretnél, és összerakjuk a programot.']], kiemelt: 0, cta: r[2], href: r[3], lab: '' };
      } }
  };
  const KULCSOK = ['b2c', 'b2g', 'b2b'];
  let ut = 'b2c', lepes = 0, valaszok = [];
  const U = () => UTAK[ut];
  const labak = (n, kesz) => Array.from({ length: n }, (_, i) => '<svg class="' + (i < kesz ? 'fs-kesz' : '') + '" aria-hidden="true"><use href="#fs-i-lab"/></svg>').join('');
  const labjegy = () => U().javaslat ? '<span class="fs-javaslat-jel">Új ajánlat, jóváhagyásra vár</span> ' : '';
  function kerdes() {
    const q = U().kerdes[lepes], n = U().kerdes.length;
    test.innerHTML = '<div class="fs-kviz-halad">' + labak(n, lepes) + '<span>' + (lepes + 1) + '. kérdés a ' + n + '-ból</span></div><h3 tabindex="-1" class="fs-kviz-kerdes">' + q.k + '</h3><div class="fs-valaszok">' + q.v.map((v, i) => '<button type="button" class="fs-valasz" aria-pressed="false" data-i="' + i + '">' + ikon(v[1], 'fs-vik') + v[0] + '</button>').join('') + '</div>' +
      '<div class="fs-kviz-lab"><span>' + labjegy() + (U().lab || '') + '</span>' + (lepes ? '<button type="button" class="fs-kviz-vissza">Vissza</button>' : '') + '</div>';
    $$('.fs-valasz', test).forEach(b => b.addEventListener('click', () => valaszol(+b.dataset.i, b)));
    const vb = $('.fs-kviz-vissza', test); if (vb) vb.addEventListener('click', () => { lepes--; valaszok.pop(); km.arc('figyelmes'); bub.textContent = 'Rendben, nézzük újra.'; kerdes(); $('.fs-kviz-kerdes', test).focus(); });
  }
  function valaszol(i, b) {
    if (test.dataset.zar) return; test.dataset.zar = '1';
    $$('.fs-valasz', test).forEach(x => x.setAttribute('aria-pressed', x === b));
    const ert = U().kerdes[lepes].v[i][2]; valaszok[lepes] = ert;
    mer('kviz_valasz', { ut: ut, kerdes: lepes + 1, valasz: String(ert) });
    const r = U().reakcio(ert); km.arc(r[0]); bub.textContent = r[1]; if (r[0] === 'ujjongo') km.ugrik();
    setTimeout(() => { delete test.dataset.zar; lepes++; if (lepes < U().kerdes.length) { km.arc('figyelmes'); kerdes(); $('.fs-kviz-kerdes', test).focus(); } else eredmeny(); }, kevesMozgas() ? 250 : 900);
  }
  function eredmeny() {
    const e = U().eredmeny(valaszok), n = U().kerdes.length;
    mer('kviz_kesz', { ut: ut, eredmeny: e.kod });
    km.arc(e.arc); km.ugrik(); bub.textContent = e.bub;
    const kepSrc = (kepek[0] || {}).src || '';
    test.innerHTML = '<div class="fs-kviz-halad">' + labak(n, n) + '<span>Kész!</span></div>' +
      '<div class="fs-eredmeny' + (e.kep ? '' : ' fs-eredmeny--kep-nelkul') + '"><div><h3 tabindex="-1" class="fs-kviz-kerdes">' + e.cim + '</h3>' +
      e.sorok.map((s, i) => '<div class="fs-eredmeny-sor' + (i === e.kiemelt ? ' fs-eredmeny-sor--lepes' : '') + '"><div class="fs-cimke">' + s[0] + '</div><b>' + s[1] + '</b>' + (s[2] ? '<p>' + s[2] + '</p>' : '') + '</div>').join('') +
      (e.telepulesek ? '<div class="fs-telepulesek"><span class="fs-telepules">címer</span><span class="fs-telepules">címer</span><span class="fs-telepules">címer</span><span class="fs-telepules">címer</span><span class="fs-minta-jel">Ide jön 4–5 partnertelepülés címere, engedéllyel</span></div>' : '') +
      '<a class="fs-gomb fs-kviz-cta" href="' + (e.href || '#letoltes') + '">' + e.cta + '</a></div>' +
      (e.kep && kepSrc ? '<img src="' + kepSrc + '" alt="A beeco Lábnyomkalkulátor képernyője" width="140" height="252">' : '') + '</div>' +
      '<div class="fs-kviz-lab"><span>' + labjegy() + (e.lab || '') + '</span><button type="button" class="fs-kviz-ujra">Újrakezdem</button></div>';
    const cta = $('.fs-kviz-cta', test);
    if (e.letolt) okosLetoltes(cta, 'kviz'); else cta.addEventListener('click', () => mer('kviz_cta', { ut: ut, cta: e.cta }));
    $('.fs-kviz-ujra', test).addEventListener('click', () => { indul(); $('.fs-kviz-kerdes', test).focus(); });
    $('.fs-kviz-kerdes', test).focus({ preventScroll: true });
  }
  function indul() { lepes = 0; valaszok = []; km.arc('kivancsi'); bub.textContent = U().koszon; kerdes(); }
  const ug = $$('.fs-utgomb', oldal);
  const csoport = $('.fs-utvalaszto', oldal); if (csoport) { csoport.setAttribute('role', 'group'); csoport.setAttribute('aria-label', 'Ki vagy?'); }
  ug.forEach((b, i) => { b.setAttribute('aria-pressed', i === 0); gombbaAlakit(b, () => { ug.forEach(x => x.setAttribute('aria-pressed', x === b)); ut = KULCSOK[i] || 'b2c'; mer('ut_valasztas', { ut: ut }); indul(); km.ugrik(); }); });
  ciklusok.push(() => { const w = km.host.offsetWidth; if (w && km.w !== w) km.w = w; km.cel(km.w / 2, km.w / 2, 1); });
  km.w = km.host.offsetWidth || 150; km.hely(km.w / 2, km.w / 2, 1);
  indul();
})();

/* indulás */
frissit();
if (funkok[0]) { const p = relHely($('.fs-pin', funkok[0]), 0.9, 0.05); meh.hely(p[0], p[1] - 60, 0.5); erkezett = false; }
indit();
RM.addEventListener && RM.addEventListener('change', indit);
})();
