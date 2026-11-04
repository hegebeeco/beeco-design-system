/* ============================================================
   beeco.hu főoldal – Szuperhős méhecske (fs-)  ·  forrás
   A Webflow natív elemeire épül (a Designerben is látszanak); ez a szkript adja:
   a méhecskét (a hivatalos csontváz-rigből), a lábnyom-útvonalat, a hero funkcióválasztót,
   a közösségi lábnyom-vásznat, a „Kinek szól?” kvízt, az okos boltgombot, a ragadós mobilsávot,
   a sötét/világos kapcsolót és a mérést (dataLayer).
   Építés: node weboldal/fooldal-szuperhos/build.mjs  →  fs.js (+ embed/*.css)
   ============================================================ */
(async function () {
'use strict';
if (window.__fsFut) return; window.__fsFut = true;
const d = document, $ = (s, r) => (r || d).querySelector(s), $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
const oldal = $('.fs-oldal'); if (!oldal) return;
const RM = matchMedia('(prefers-reduced-motion: reduce)'), kevesMozgas = () => RM.matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* a szakaszok között átadjuk a vezérlést a böngészőnek (2026-11-04): így nincs egyetlen hosszú, a kattintást és a görgetést blokkoló feladat */
const szunet = () => (window.scheduler && scheduler.yield) ? scheduler.yield() : new Promise(r => setTimeout(r, 0));
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
  // az oldalon nincs GTM, csak gtag: a dataLayer-esemény magától nem jut el a GA4-be (2026-11-02 audit)
  if (typeof window.gtag === 'function') window.gtag('event', 'beeco_' + esemeny, Object.assign({ oldal: location.pathname }, adat || {}));
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

/* ---------- sötét mód: nincs kapcsoló (Kristóf, 2026-10-30); az oldal mindig világos, a régi mentett választás törlődik ---------- */
try { localStorage.removeItem('beeco-tema'); } catch (e) { }
d.documentElement.removeAttribute('data-theme');

/* ---------- díszítő svg-k (domb, hurok, szaggatott vonalak) ---------- */
function svgElem(html) { const t = d.createElement('div'); t.innerHTML = html; return t.firstElementChild; }
/* a domb, a matricaél és a kaptár-hurok 2026-11-04-én kikerült: a CSS rejtette őket (display:none), csak felesleges munka volt; a domb natív DS · Domb komponens */
const kaptar = $('.fs-kaptar-szin', oldal);
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
/* kellékek az App útja lépéseihez (2026-11-02, Kristóf): a 170×170-es vászon koordinátáiban, a méh jobbra néz; színek a márka primitívjei */
const KELLEKEK = [
  '<g data-kellek="telefon" display="none"><path d="M135 133q9 3 18-2" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(6 14) rotate(-12 158 119)"><rect x="149" y="103" width="18" height="31" rx="3.6" fill="#000"/><rect x="151.4" y="107" width="13.2" height="21.5" rx="1.6" fill="#FECF39"/><path d="M155 114l3 3 4-5" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="158" cy="131" r="1.1" fill="#FFF8E7"/></g></g>',
  '<g data-kellek="szamologep" display="none"><path d="M135 133q9 3 17-2" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(6 14) rotate(-8 158 120)"><rect x="147" y="103" width="22" height="31" rx="3" fill="#FECF39" stroke="#000" stroke-width="2"/><rect x="150" y="106.5" width="16" height="7" rx="1" fill="#FFF8E7" stroke="#000" stroke-width="1.3"/>' + [0, 1, 2].map(r => [0, 1, 2].map(c => '<rect x="' + (150.5 + c * 5.3) + '" y="' + (117 + r * 5.2) + '" width="3.6" height="3.4" rx=".6" fill="#000"/>').join('')).join('') + '</g></g>',
  '<g data-kellek="villanykorte" display="none"><circle class="fs-kv-feny" cx="152" cy="38" r="17" fill="#FECF39" opacity=".45"/><g class="fs-kv-sugar" stroke="#000" stroke-width="2" stroke-linecap="round"><path d="M152 15v-5M135 22l-3.5-3.5M169 22l3.5-3.5M130 38h-5M174 38h5"/></g><path d="M152 27a10 10 0 0 1 6 18v4h-12v-4a10 10 0 0 1 6-18z" class="fs-kv-test" fill="#FFF8E7" stroke="#000" stroke-width="2" stroke-linejoin="round"/><path d="M149 41l3 3 3-3" fill="none" stroke="#000" stroke-width="1.4" stroke-linecap="round"/><path d="M146.5 52h11M148 55.5h8" stroke="#000" stroke-width="2" stroke-linecap="round"/></g>',
  '<g data-kellek="sapka" display="none"><path d="M121 75q2-19 20-20 18 1 19 18z" fill="#E3ECCD" stroke="#000" stroke-width="2" stroke-linejoin="round"/><path d="M121.5 70q19-5 38-2" fill="none" stroke="#2F371E" stroke-width="3.4"/><path d="M114 76q26-7 52-1" fill="none" stroke="#000" stroke-width="4.6" stroke-linecap="round"/><path d="M114 76q26-7 52-1" fill="none" stroke="#2F371E" stroke-width="2.2" stroke-linecap="round"/><path d="M141 57.5a4.2 4.2 0 0 1 4.2 4.2c0 3-4.2 7-4.2 7s-4.2-4-4.2-7a4.2 4.2 0 0 1 4.2-4.2z" fill="#FECF39" stroke="#000" stroke-width="1.4"/><circle cx="141" cy="61.8" r="1.3" fill="#000"/></g>',
  '<g data-kellek="kuponok" display="none"><path d="M135 133q9 3 17-2" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(7 12)">' + [[-22, '#FFF8E7'], [-6, '#E3ECCD'], [10, '#FFF8E7']].map(([r, f]) => '<g transform="rotate(' + r + ' 155 133)"><rect x="148" y="103" width="15" height="24" rx="2" fill="' + f + '" stroke="#000" stroke-width="1.8"/><rect x="148" y="103" width="15" height="6" rx="2" fill="#FECF39" stroke="#000" stroke-width="1.8"/><path d="M151 118h9" stroke="#000" stroke-width="1.3" stroke-dasharray="2 1.6"/></g>').join('') + '</g></g>',
  '<g data-kellek="serleg" display="none"><path d="M135 133q9 3 17-2" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(8 12)"><path d="M146 101h16v10a8 8 0 0 1-16 0z" fill="#FECF39" stroke="#000" stroke-width="2" stroke-linejoin="round"/><path d="M146 104h-3.5a4.5 4.5 0 0 0 4 7M162 104h3.5a4.5 4.5 0 0 1-4 7" fill="none" stroke="#000" stroke-width="2"/><path d="M154 119v6M149 126h10" stroke="#000" stroke-width="2.6" stroke-linecap="round"/><path d="M150 104v5" stroke="#FFF8E7" stroke-width="1.8" stroke-linecap="round"/></g></g>'
].join('');
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
    // kellékek a gyökércsontban, így együtt lebegnek és dőlnek a méhvel; a mátrix a 170×170-es vászon koordinátáit váltja a rajz terére
    const gyoker = svg.querySelector('[data-csont="root"]');
    if (gyoker) { const k = d.createElementNS(NS, 'g'); k.setAttribute('transform', 'matrix(1.72 0 0 1.72 5.177 -43.257)'); k.innerHTML = KELLEKEK; gyoker.appendChild(k); }
    this.kellekek = $$('[data-kellek]', svg); this.kell = null;
    mehek.push(this);
  }
  kellek(n) { if (n === this.kell) return; this.kell = n; for (const g of this.kellekek) g.setAttribute('display', g.getAttribute('data-kellek') === n ? 'inline' : 'none'); }
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
    else if (this.iranyKell && seb < 45) this.irany = this.iranyKell;
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

await szunet();
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
const labKep = ($('img.fs-piko[src*="fs-piko-lab"]', oldal) || {}).src || 'https://s3.amazonaws.com/webflow-prod-assets/648ebb1f9ae84f3d530e2f2d/6acdcf5d31a1079e200f1faa_fs-piko-lab.svg';
const sinJel = d.createElement('img'); sinJel.className = 'fs-sin-jel'; sinJel.src = labKep; sinJel.alt = ''; sinJel.setAttribute('aria-hidden', 'true'); sinNav.appendChild(sinJel);
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
const leszallo = () => $$('.fs-zaro .fs-bolt, .fs-zaro .footer_download', oldal).find(b => b.offsetParent !== null) || $('.fs-zaro .fs-bolt, .fs-zaro .footer_download', oldal) || zaro;
const boltok = $('.fs-zaro .fs-boltok, .fs-zaro .download_block', oldal);
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
  if (L && szeles()) { const p = pontHossznal(prog * L), q = pontHossznal(Math.min(L, prog * L + 6)), sz = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI + 90; sinJel.style.left = p[0] + 'px'; sinJel.style.top = p[1] + 'px'; sinJel.style.setProperty('--fs-jel-sz', sz.toFixed(1) + 'deg'); }
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
    const k = kalandCel();
    if (k) {
      kaland = k; meh.host.classList.remove('fs-rejt'); meh.cel(k.p[0], k.p[1], k.s); meh.iranyKell = k.ir;
      const uj = k.hol + k.i; if (uj !== kalandElozo) { kalandElozo = uj; if (k.hol === 'ut' && k.i >= 6) meh.ugrik(); }
      meh.arc(k.hol === 'ut' ? UT_ARC[k.i] : MIERT_ARC[k.i]); meh.kellek(k.hol === 'ut' ? UT_KELLEK[k.i] : MIERT_KELLEK[k.i]);
      return;
    }
    kalandElozo = ''; meh.iranyKell = 0;
    if (szeles()) { const sr = sin.getBoundingClientRect(), pr = reteg.getBoundingClientRect(), p = pontHossznal(prog * L); meh.cel(sr.left - pr.left + p[0], sr.top - pr.top + p[1] - 18, 0.5); meh.host.classList.add('fs-rejt'); }
    else { const pr = reteg.getBoundingClientRect(); meh.cel(innerWidth - 50 - pr.left, 110 - pr.top, 0.4); meh.host.classList.add('fs-rejt'); }
    meh.arc(ALL[akt][2]);
  }
});

/* ---------- kaland (2026-11-02, Kristóf): a méhecske végigrepüli a „Miért a beeco?” kártyáit és az App útja 8 lépését ----------
   Miért a beeco? (2026-11-04): hamarabb érkezik, és sorban végiglépi a 3 csempét: 1 felvillanó villanykörte a feje fölött,
   2 telefon (az app), 3 serleg.
   App útja: 1 telefon, 2 számológép, 3 felvillanó villanykörte, 4 térképész sapka, 5 kuponok, 6 barátok csatlakoznak,
   7 egyikük serleget kap, 8 balra érkeznek (buborék nélkül, 2026-11-04). Csökkentett mozgásnál a helyükre ugranak. */
const miertKartyak = $$('#miert .fs-lepes', oldal), utLepesek = $$('.fs-u-lepes', oldal);
const UT_KELLEK = ['telefon', 'szamologep', 'villanykorte', 'sapka', 'kuponok', null, null, null];
const UT_ARC = ['vidam', 'figyelmes', 'meglepett', 'kivancsi', 'ujjongo', 'meleg', 'ujjongo', 'vidam'];
const MIERT_ARC = ['figyelmes', 'kivancsi', 'ujjongo'];
const MIERT_KELLEK = ['villanykorte', 'telefon', 'serleg'];
let kaland = null, kalandElozo = '';
function lathato(lista, fent, lent) { if (!lista.length) return false; const a = lista[0].getBoundingClientRect(), z = lista[lista.length - 1].getBoundingClientRect(); return a.top < innerHeight * (fent || 0.7) && z.bottom > innerHeight * (lent || 0.3); }
function kozel(lista) {
  let best = 0, bd = 1e9;
  lista.forEach((el, i) => { const r = el.getBoundingClientRect(), c = Math.abs(r.top + Math.min(r.height, 240) / 2 - innerHeight * 0.45); if (c < bd) { bd = c; best = i; } });
  return best;
}
function kalandCel() {
  const mob = innerWidth < 768;
  if (lathato(utLepesek)) {
    const i = kozel(utLepesek), el = utLepesek[i], szam = $('.fs-u-szam', el) || el, torzs = $('.fs-u-torzs', el) || el, bal = el.classList.contains('fs-u-bal');
    let p, ir;
    if (mob) { p = relHely(torzs, 0.86, -0.08); ir = -1; }
    else if (i === utLepesek.length - 1) { p = relHely(el, 0.3, 0.62); ir = 1; }
    else { p = relHely(szam, 0.5 + (bal ? 1 : -1) * 110 / (szam.offsetWidth || 56), 0.45); ir = bal ? -1 : 1; }
    // a barátok a középvonaltól kifelé sorakoznak (mobilon a kártya teteje mentén balra)
    return { hol: 'ut', i: i, p: p, s: mob ? 0.5 : 0.62, ir: ir, kifele: mob || i === utLepesek.length - 1 || !bal ? -1 : 1 };
  }
  // a Miért-csempékhez már akkor odarepül, amikor az első csempe a képernyő aljára ér, és a görgetéssel sorban végiglépi őket
  if (lathato(miertKartyak, 0.95, 0.2)) {
    const r0 = miertKartyak[0].getBoundingClientRect(), egySor = miertKartyak.length > 1 && Math.abs(miertKartyak[1].getBoundingClientRect().top - r0.top) < 4;
    const i = egySor ? clamp(Math.floor(clamp((innerHeight * 0.95 - r0.top) / (innerHeight * 0.75), 0, 0.999) * miertKartyak.length), 0, miertKartyak.length - 1) : kozel(miertKartyak);
    return { hol: 'miert', i: i, p: relHely(miertKartyak[i], 0.86, -0.06), s: mob ? 0.46 : 0.5, ir: -1, kifele: -1 };
  }
  return null;
}
const baratok = [], BARAT = [[1.2, 0.22, 'meleg'], [2.25, -0.08, 'kivancsi']];
function barat(i) {
  if (!baratok[i]) { const h = d.createElement('div'); h.className = 'fs-meh fs-meh-barat fs-rejt'; reteg.appendChild(h); baratok[i] = new Meh(h, { arc: BARAT[i][2], s: 0.4 }); baratok[i].latszik = false; }
  return baratok[i];
}
ciklusok.unshift(function () { kaland = null; });
ciklusok.push(function () {
  if (!kaland) meh.kellek(null);
  const ut = kaland && kaland.hol === 'ut', vele = ut && kaland.i >= 5;
  BARAT.forEach(([fx, fy, arc], i) => {
    if (!vele && !baratok[i]) return;
    const m = barat(i), w = meh.w * meh.t.s;
    if (vele) {
      if (!m.latszik) { m.latszik = true; m.host.classList.remove('fs-rejt'); m.hely(meh.p.x - innerWidth * 0.6, meh.p.y + fy * w * 2, meh.t.s * 0.8); }
      m.cel(meh.p.x + kaland.kifele * fx * w, meh.p.y + fy * w, meh.t.s * 0.8); m.iranyKell = meh.iranyKell;
      const serleg = kaland.i === 6 && i === 0;
      m.arc(kaland.i >= 6 ? 'ujjongo' : arc); m.kellek(serleg ? 'serleg' : null);
      if (kaland.i === 6 && !m.ugrott) { m.ugrott = true; m.ugrik(); } else if (kaland.i !== 6) m.ugrott = false;
    } else if (m.latszik) { m.latszik = false; m.host.classList.add('fs-rejt'); m.kellek(null); }
  });
});
if (kaptar) { const heroIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { heroIO.disconnect(); turaIndit(); } }), { threshold: .5 }); heroIO.observe(kaptar); }

await szunet();
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
  const szamok = $$('.fs-szam-ertek, .fo-ereje-szam', oldal);
  if (!szamok.length || kevesMozgas() || !('IntersectionObserver' in window)) return;
  szamok.forEach(el => {
    const eredeti = el.textContent.trim(), m = eredeti.match(/^([\d.\s]+)(.*)$/); if (!m) return;
    const cel = parseInt(m[1].replace(/\D/g, ''), 10), pont = /\./.test(m[1]), fmt = n => (pont ? n.toLocaleString('de-DE') : String(n)) + m[2];
    el.setAttribute('aria-label', eredeti); el.textContent = fmt(0);
    new IntersectionObserver((es, o) => es.forEach(e => { if (!e.isIntersecting) return; o.disconnect(); const t0 = performance.now(), T = 1300;
      (function lep(t) { const k = Math.min(1, (t - t0) / T), ki = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(cel * ki)); if (k < 1) requestAnimationFrame(lep); else el.textContent = eredeti; })(t0); }), { threshold: .6 }).observe(el);
  });
})();

await szunet();
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
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; huz = { x: e.clientX, s: el.scrollLeft, mozgott: false }; });
  addEventListener('pointermove', e => { if (!huz) return; const dx = e.clientX - huz.x; if (!huz.mozgott && Math.abs(dx) > 4) { huz.mozgott = true; el.classList.add('fs-huz'); } if (huz.mozgott) { e.preventDefault(); el.scrollLeft = huz.s - dx; } });
  // az fs-huz (linkek pointer-events:none) csak tényleges húzáskor kerül fel, így a sima egérkattintás eljut a logó linkjéig
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
/* Vélemények: kézzel görgethető sor (Kristóf, 2026-10-14: nem kell automata mozgás és megállító gomb).
   Egérrel húzható, görgővel és billentyűvel is mozgatható. */
(function kezi(el, cimke) {
  if (!el) return;
  el.classList.add('fs-kezi'); el.setAttribute('tabindex', '0'); el.setAttribute('role', 'region'); el.setAttribute('aria-label', cimke + ' (vízszintesen görgethető)');
  let huz = null;
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; huz = { x: e.clientX, s: el.scrollLeft, mozgott: false }; });
  addEventListener('pointermove', e => { if (!huz) return; const dx = e.clientX - huz.x; if (!huz.mozgott && Math.abs(dx) > 4) { huz.mozgott = true; el.classList.add('fs-huz'); } if (huz.mozgott) { e.preventDefault(); el.scrollLeft = huz.s - dx; } });
  addEventListener('pointerup', () => { if (!huz) return; el.classList.remove('fs-huz'); if (huz.mozgott) mer('sav_huzas', { sav: cimke }); huz = null; });
  el.addEventListener('dragstart', e => e.preventDefault());
})($('.fs-velemenyek', oldal), 'Vélemények');
vegtelen($('.fs-sajto .fs-logosor', oldal), 40, 'Írtak rólunk');
vegtelen($('.fs-partner-racs', oldal), 40, 'Szakmai partnereink');

await szunet();
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

await szunet();
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


/* indulás */
frissit();
if (funkok[0]) { const p = relHely($('.fs-pin', funkok[0]), 0.9, 0.05); meh.hely(p[0], p[1] - 60, 0.5); erkezett = false; }
indit();
RM.addEventListener && RM.addEventListener('change', indit);
})();
