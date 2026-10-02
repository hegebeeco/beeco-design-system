/* ============================================================
   oldal-meres-web – az ÉLŐ weboldal mérése a böngészőben (docs/weboldal.md 5.)

   Kiegészíti a tools/komp/oldal-meres.js-t: az ott mért kilógás / 44 px / kontraszt mellé
   azt nézi, ami csak egy nyilvános marketingoldalon értelmes – szerkezet, linkek, SEO-alap,
   és hogy a futásidejű CSS tényleg a DS tokenjeit használja-e.

   Tisztán szerializálható függvény (playwright page.evaluate). Minden bemenet az `opts`-ban jön:
     opts.paletta  – dist/weboldal/paletta.json tartalma
     opts.utvonal  – az oldal útvonala (a leletek olvashatóságához)
   Lelet alakja azonos: { kat, sulyos, mi, hol }
   ============================================================ */
module.exports = function meresWeb(opts) {
  const L = [];
  const add = (kat, sulyos, mi, hol) => L.push({ kat, sulyos, mi, hol });
  const P = opts.paletta;
  const lathato = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const nev = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').replace(/\s+/g, ' ').trim();
  const hol = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} „${nev(el).slice(0, 34)}”`;
  const hexE = (s) => { const m = (s.match(/[\d.]+/g) || []).map(Number); if (m.length < 3) return null; if (m[3] === 0) return null; return '#' + m.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase(); };

  // ---- 1. Szerkezet: pontosan egy h1, nincs címsor-ugrás
  const h1 = [...document.querySelectorAll('h1')].filter(lathato);
  if (h1.length === 0) add('Szerkezet', 'P1', 'nincs h1 az oldalon', 'oldal');
  if (h1.length > 1) add('Szerkezet', 'P2', `${h1.length} db h1 (egy kell)`, h1.map((e) => nev(e).slice(0, 20)).join(' · '));
  let elozo = 0;
  for (const c of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    if (!lathato(c)) continue;
    const sz = Number(c.tagName[1]);
    if (elozo && sz > elozo + 1) add('Szerkezet', 'P3', `címsor-ugrás h${elozo} után h${sz}`, hol(c));
    elozo = sz;
  }

  // ---- 2. Képek: alt nélkül nincs kép (a díszítő kapjon üres altot ÉS aria-hiddent)
  for (const img of document.querySelectorAll('img')) {
    if (!lathato(img)) continue;
    if (img.getAttribute('alt') === null) add('Hozzáférhetőség', 'P2', 'kép alt nélkül', img.currentSrc?.split('/').pop()?.slice(0, 40) || hol(img));
  }

  // ---- 3. Linkek és gombok
  const celok = new Map();          // linkszöveg → célok halmaza
  const SEMMITMONDO = ['ide kattints', 'kattints ide', 'tovább', 'bővebben', 'itt', 'link', 'olvasd el', 'read more'];
  for (const a of document.querySelectorAll('a[href], button')) {
    if (!lathato(a)) continue;
    const n = nev(a);
    if (!n && !a.querySelector('img[alt]:not([alt=""])')) { add('Hozzáférhetőség', 'P1', `${a.tagName === 'A' ? 'link' : 'gomb'} elérhető név nélkül`, hol(a)); continue; }
    if (a.tagName !== 'A') continue;
    if (a.target === '_blank' && !(a.rel || '').includes('noopener')) add('Biztonság', 'P2', 'target=_blank rel="noopener" nélkül', hol(a));
    if (SEMMITMONDO.includes(n.toLowerCase())) add('Szöveg', 'P3', `semmitmondó linkszöveg: „${n}”`, hol(a));
    const h = a.getAttribute('href');
    if (h && !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('tel:')) {
      const k = n.toLowerCase();
      if (!celok.has(k)) celok.set(k, new Set());
      celok.get(k).add(new URL(h, location.href).pathname);
    }
  }
  for (const [szoveg, hovak] of celok) if (hovak.size > 1 && szoveg) add('Szöveg', 'P3', `ugyanaz a linkszöveg ${hovak.size} különböző helyre: „${szoveg}”`, [...hovak].join(' · '));

  // ---- 4. Kattintható, de nem gomb (billentyűzettel elérhetetlen)
  for (const d of document.querySelectorAll('div[onclick], span[onclick], div[role="button"]:not([tabindex]), span[role="button"]:not([tabindex])')) {
    if (lathato(d)) add('Hozzáférhetőség', 'P1', 'kattintható elem, ami nem <a>/<button> és nem fókuszálható', hol(d));
  }

  // ---- 5. Token-hűség: a futásidejű CSS tényleg a DS értékeit használja-e
  const szinSzotar = new Set(P.szinek);
  const sarokOk = new Set(P.sarok.map(String));
  const latott = { szin: new Set(), sarok: new Set(), betu: new Set() };
  for (const el of document.querySelectorAll('body *')) {
    if (!lathato(el)) continue;
    const s = getComputedStyle(el);
    // szöveg- és háttérszín
    for (const kulcs of ['color', 'backgroundColor', 'borderTopColor']) {
      if (kulcs === 'borderTopColor' && parseFloat(s.borderTopWidth) === 0) continue;
      if (kulcs === 'backgroundColor' && (s.backgroundColor === 'rgba(0, 0, 0, 0)' || s.backgroundColor === 'transparent')) continue;
      const h = hexE(s[kulcs]);
      if (h && !szinSzotar.has(h)) latott.szin.add(`${h} (${kulcs})`);
    }
    // sarok – a 0 és a százalékos (kör) rendben van
    const r = s.borderTopLeftRadius;
    if (r && r !== '0px' && !r.includes('%')) { const px = String(Math.round(parseFloat(r))); if (!sarokOk.has(px) && px !== '0') latott.sarok.add(px + 'px'); }
    // árnyék: a termékbőrben az elmosás mindig 0
    if (s.boxShadow && s.boxShadow !== 'none' && !s.boxShadow.includes('inset')) {
      const sz = s.boxShadow.match(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/);
      if (sz && parseFloat(sz[3]) > parseFloat(P.arnyekElmosas)) add('Arculat', 'P2', `elmosott árnyék (${sz[3]} px) – a termékbőrben kemény, átlós árnyék van`, hol(el));
    }
    // betűcsalád és méret
    const cs = (s.fontFamily || '').split(',')[0].replace(/["']/g, '').trim();
    if (cs && cs !== P.betuCsalad.display && cs !== P.betuCsalad.body && !/^(inherit|initial|system-ui|-apple-system)$/.test(cs)) latott.betu.add(cs);
    const m = parseFloat(s.fontSize);
    if (m && m < 12 && (el.textContent || '').trim()) add('Tipográfia', 'P2', `${Math.round(m)} px betűméret (min. 12)`, hol(el));
    // mozgás: hosszú átmenet vagy ease-in
    const d = (s.transitionDuration || '').split(',').map((x) => parseFloat(x) * (x.includes('ms') ? 1 : 1000));
    if (d.some((x) => x > P.idotartamMax)) add('Animáció', 'P3', `${Math.max(...d)} ms átmenet (max. ${P.idotartamMax} ms)`, hol(el));
    if ((s.transitionTimingFunction || '').includes('ease-in') && !(s.transitionTimingFunction || '').includes('ease-in-out')) add('Animáció', 'P3', 'ease-in görbe (a DS-ben ease-out van)', hol(el));
  }
  if (latott.szin.size) add('Arculat', 'P2', `${latott.szin.size} DS-en kívüli szín`, [...latott.szin].slice(0, 8).join(' · '));
  if (latott.sarok.size) add('Arculat', 'P3', `nem DS sarok: ${[...latott.sarok].join(' · ')}`, `megengedett: ${P.sarok.join(' · ')} px`);
  if (latott.betu.size) add('Tipográfia', 'P2', `idegen betűcsalád: ${[...latott.betu].join(' · ')}`, `megengedett: ${P.betuCsalad.display} · ${P.betuCsalad.body}`);

  // ---- 6. SEO-alap, ami a forrásban látszik
  const cim = (document.title || '').trim();
  if (!cim) add('SEO', 'P1', 'nincs oldalcím', 'head');
  else if (cim.length > 60) add('SEO', 'P3', `oldalcím ${cim.length} karakter (max. 60 látszik)`, cim.slice(0, 50));
  const leiras = document.querySelector('meta[name="description"]')?.content?.trim() || '';
  if (!leiras) add('SEO', 'P2', 'nincs meta leírás', 'head');
  else if (leiras.length < 50 || leiras.length > 160) add('SEO', 'P3', `meta leírás ${leiras.length} karakter (50–160 az ideális)`, leiras.slice(0, 50));
  if (!document.querySelector('link[rel="canonical"]')) add('SEO', 'P3', 'nincs canonical', 'head');
  if (!document.querySelector('meta[property="og:image"]')) add('SEO', 'P3', 'nincs og:image (megosztáskor nem lesz kép)', 'head');
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(s.textContent); } catch (e) { add('SEO', 'P1', `hibás JSON-LD: ${e.message.slice(0, 60)}`, 'head'); }
  }
  return L;
};
