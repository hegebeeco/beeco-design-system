// beeco-weboldal-audit · lib-ux.mjs – UX és felhasználói út (v3, „ux” dimenzió): Nielsen-heurisztikák, első benyomás (5 mp-es teszt),
// CTA-hierarchia, olvashatóság, mobil, bizalom az űrlap közelében. Csak DOM-ot olvas (űrlapot nem küld, a validitást klónon méri).
// A `uxExtract` az oldalon fut (mobil és asztali nézeten is), a `uxFindings` a pontozás.

export function uxExtract(cfg) {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR', 'TEMPLATE', 'LINK', 'META', 'HEAD', 'OPTION']);
  const ZONE = 'nav,footer,[class*="menu-"],[class*="lablec"],[class*="cky"],.w-nav,.w-dropdown-list,[class*="sender"],[class*="cookie"]';
  const vh = innerHeight, vw = innerWidth, sy = scrollY;
  const clip = (s, n) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; try { return el.checkVisibility({ opacityProperty: true, visibilityProperty: true }); } catch { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; } };
  const tx = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const inFold = el => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0; };
  const wc = s => (s.match(/[\p{L}\p{N}]+/gu) || []).length;
  const mask = x => String(x || '').replace(/[\w.+-]+@([\w-]+\.[\w.-]+)/g, '…@$1').replace(/\+?\d[\d\s().-]{6,}\d/g, '…');
  const U = { vh, vw };
  const path = location.pathname.replace(/\/$/, '');
  U.depth = path.split('/').filter(Boolean).length;

  // ---- levélblokkok (szöveges, lapos elemek)
  const LB = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (SKIP.has(el.tagName) || el.closest('svg') || !el.textContent.trim()) continue;
    const cs = getComputedStyle(el); if (cs.display === 'inline' || cs.display === 'none') continue;
    if ([...el.children].some(c => c.tagName !== 'BR' && c.textContent.trim() && getComputedStyle(c).display !== 'inline')) continue;
    if (!vis(el)) continue;
    const text = tx(el); if (!text) continue;
    const r = el.getBoundingClientRect(); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
    LB.push({ el, text, tag: el.tagName, head: /^H[1-6]$/.test(el.tagName), zone: !!el.closest(ZONE), link: !!el.closest('a,button'), fold: inFold(el), fs: parseFloat(cs.fontSize), lh, h: r.height, w: r.width, top: r.top + sy, words: wc(text) });
  }
  const body = LB.filter(b => !b.zone);

  // ---- CTA-k (a gomb-szerű elemek)
  const GEN = /gomb|button|btn|cta|w-button/i;
  const SOCIAL = /^(www\.)?(facebook|instagram|linkedin|tiktok|youtube|x|twitter|threads|pinterest)\.com$/;
  const ctaEls = [...document.querySelectorAll('a[href],button,input[type=submit]')].filter(e => vis(e) && !e.closest('[class*="cky"],[class*="cookie"],.w-dropdown-list,[class*="sender"]') && !/w-nav-button|w-dropdown-toggle|w-tab-link|w-slider/.test(e.className || '') && !/ugrás a tartalomra|skip to/i.test(tx(e)) && !(e.tagName === 'A' && SOCIAL.test(e.hostname))).map(e => {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(), t = (e.value || tx(e) || e.getAttribute('aria-label') || '').trim();
    const bgm = cs.backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    const solid = !!bgm && (bgm[4] === undefined || +bgm[4] > 0.1) && !(+bgm[1] > 235 && +bgm[2] > 235 && +bgm[3] > 235); // kitöltött: nem átlátszó és nem fehér (a fehér + keret = másodlagos)
    const like = GEN.test(e.className || '') || [...e.attributes].some(a => /^data-[a-z0-9]+-cta$/.test(a.name)) || (solid && parseFloat(cs.borderRadius) > 0 && t.length > 1 && t.length <= 40 && r.height >= 32);
    let pos = 'static'; for (let n = e; n && n !== document.documentElement; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') { pos = p; break; } }
    return { el: e, like, solid, text: t, words: wc(mask(t)), href: e.getAttribute('href') || '', fold: inFold(e), cy: r.top + r.height / 2, pos, zone: e.closest('footer,[class*="lablec"]') ? 'footer' : e.closest('nav,.w-nav,[class*="menu-"]') ? 'nav' : 'main', bg: cs.backgroundColor, rad: cs.borderRadius, fs: cs.fontSize };
  }).filter(c => c.like);

  // ---- 1. első benyomás
  const h1 = [...document.querySelectorAll('h1')].find(h => vis(h) && !h.closest(ZONE));
  const vp = body.find(b => b.fold && !b.head && !b.link && b.words >= 8 && b.fs >= 13);
  const heroCtas = ctaEls.filter(c => c.fold && c.zone === 'main');
  let visual = false, visualWhat = '';
  for (const im of document.querySelectorAll('img,svg,video,canvas,picture,lottie-player,[data-animation-type="lottie"]')) {
    if (im.closest(ZONE) || !vis(im)) continue; const r = im.getBoundingClientRect();
    if (r.width >= 120 && r.height >= 80 && inFold(im) && !/logo/i.test((im.getAttribute('alt') || '') + (im.className && im.className.baseVal !== undefined ? im.className.baseVal : im.className || ''))) { visual = true; visualWhat = im.tagName.toLowerCase(); break; }
  }
  if (!visual) for (const el of document.querySelectorAll('div,section,header')) { if (el.closest(ZONE)) continue; const r = el.getBoundingClientRect(); if (r.width < 200 || r.height < 120 || !inFold(el)) continue; const bi = getComputedStyle(el).backgroundImage; if (bi && bi !== 'none' && /url\(/.test(bi)) { visual = true; visualWhat = 'háttérkép'; break; } }
  U.fold = { h1: h1 ? { text: clip(tx(h1), 90), inFold: inFold(h1), words: wc(tx(h1)) } : null, valueProp: vp ? { text: clip(vp.text, 120), words: vp.words } : null, ctaCount: heroCtas.length, visual, visualWhat };
  // ---- 2. CTA-hierarchia a hero-ban
  U.hero = { ctas: heroCtas.map(c => ({ text: mask(c.text).slice(0, 50), solid: c.solid, words: c.words })), solids: heroCtas.filter(c => c.solid).length };
  const VERB = /^(kér|tölt|néz|próbál|ind[ií]t?|csatlakoz|ismer|foglal|fedez|olvas|tudj|regisztr|jelentkez|lép|kezd|kapj|kapok|ajánl|beszél|[ií]rj|[ií]rok|hívj|hívok|nyisd|nyitom|játsz|segít|támogat|válassz|választ|számol|számít|szerez|vedd|veszek|terv[ez]|találd|oszd|küld|mutat|menj|mehet|rendel|vásárol|add\b|adj\b|keres|csinál|nézz|lássuk|kipróbál|letölt|ellenőriz|nyerj|nyerd|vegy[ée]l|oldd|figyelj|egyeztes|beszéljünk|gyere|jöjj|készít|szervez|hozd|hozz|mondd|mondj|kérdez|építs|válts|tedd|csekkold|kóstolj|indulj|ugorj|térj|fizess|állítsd|kapcsold|nyomd|húzd|fedezz|ismerkedj)\p{L}*$/iu;
  const verbOk = t => { const toks = (t.toLowerCase().match(/[\p{L}]+/gu) || []); return toks.some(w => VERB.test(w) || /\p{L}{3,}(j|jék|sd|zd|ld|rd|jünk|junk|szd|dd)$/u.test(w)); };
  U.ctaLabels = [...new Map(ctaEls.filter(c => c.zone !== 'footer' && c.text.length > 1).map(c => [c.text.toLowerCase(), { text: mask(c.text).slice(0, 50), words: c.words, verb: verbOk(c.text), zone: c.zone }])).values()].slice(0, 60);
  U.ctaPairs = ctaEls.filter(c => c.zone !== 'footer' && c.href && c.text.length > 1 && !c.href.startsWith('mailto:') && !c.href.startsWith('tel:')).map(c => { let d = ''; try { const u = new URL(c.el.href); d = (u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/$/, '') + u.hash); } catch { d = c.href; } return { text: mask(c.text).toLowerCase().slice(0, 50), dest: d.slice(0, 100) }; }).slice(0, 80);
  const sigs = new Map(); for (const c of ctaEls.filter(c => c.solid && c.zone === 'main')) sigs.set(`${c.bg}|${c.rad}|${c.fs}`, (sigs.get(`${c.bg}|${c.rad}|${c.fs}`) || 0) + 1);
  U.buttonStyles = { variants: sigs.size, list: [...sigs.entries()].slice(0, 6).map(([k, n]) => `${k} ×${n}`) };

  // ---- 3. Nielsen-heurisztikák
  const first = document.querySelector('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
  U.skip = { first: first ? `${first.tagName.toLowerCase()} ${clip(tx(first) || first.getAttribute('aria-label') || '', 30)} ${first.getAttribute('href') || ''}`.trim() : null, isSkip: !!(first && first.tagName === 'A' && (first.getAttribute('href') || '').startsWith('#') && /ugr|skip|tartalom|main|fő/i.test(tx(first) + ' ' + (first.getAttribute('aria-label') || ''))) };
  U.breadcrumb = !!document.querySelector('[aria-label*="morzsa" i],[aria-label*="breadcrumb" i],[class*="breadcrumb"],[class*="morzsa"],[class*="ds-morzsa"]') || [...document.querySelectorAll('main a,section a')].some(a => /^(←\s*)?(vissza|főoldal|vissza a)/i.test(tx(a)) && vis(a));
  const navLinks = [...document.querySelectorAll('nav a[href],.w-nav a[href],[class*="menu-"] a[href]')].filter(a => tx(a).length > 1);
  const cur = navLinks.filter(a => { try { const u = new URL(a.href); return u.pathname.replace(/\/$/, '') === path && u.hostname === location.hostname && path !== ''; } catch { return false; } });
  U.nav = { matchesCurrent: cur.length, hasCurrentState: cur.some(a => /w--current/.test(a.className) || a.getAttribute('aria-current')) };
  U.help = { faq: [...document.querySelectorAll('a[href]')].some(a => /gyik|faq|gyakori/i.test(a.getAttribute('href') + ' ' + tx(a))), footerContact: [...document.querySelectorAll('footer a[href],[class*="lablec"] a[href]')].some(a => /kapcsolat|^mailto:|^tel:/i.test(a.getAttribute('href') || '')) };
  const engSet = new Set(['submit', 'send', 'send message', 'search', 'read more', 'learn more', 'click here', 'sign up', 'subscribe', 'loading', 'close', 'next', 'previous', 'back', 'contact us', 'get started', 'download', 'login', 'log in', 'sign in', 'your name', 'your email', 'first name', 'last name', 'phone number', 'email address']);
  U.english = [...new Set([...document.querySelectorAll('a,button,label,input[type=submit]')].filter(vis).map(e => (e.value || tx(e)).toLowerCase().replace(/[.!→>›»:]+$/g, '').trim()).concat([...document.querySelectorAll('input[placeholder],textarea[placeholder]')].filter(vis).map(e => e.placeholder.toLowerCase().trim())).filter(t => engSet.has(t)))].slice(0, 8);
  // felugró rétegek (Esc-teszt a lib-qa-ban)
  U.dialogs = [...document.querySelectorAll('[role=dialog],dialog[open],[aria-modal=true]')].filter(vis).length;
  // ---- 4. tömörség
  const secs = [...document.querySelectorAll('section,[class*="szekcio"]')].filter(s => vis(s) && !s.parentElement.closest('section,[class*="szekcio"]') && !s.closest(ZONE));
  const heads = body.filter(b => b.head).map(b => b.text.toLowerCase());
  const hc = {}; for (const h of heads) hc[h] = (hc[h] || 0) + 1;
  U.density = { sections: secs.length, words: body.filter(b => !b.head).reduce((s, b) => s + b.words, 0), repeatedHeadings: Object.entries(hc).filter(([, n]) => n >= 3).map(([h, n]) => `${clip(h, 40)} ×${n}`) };
  // ---- 5. olvashatóság és hangnem
  const prose = body.filter(b => !b.head && !b.link && b.words >= 4); const pw = prose.reduce((s, b) => s + b.words, 0) || 1;
  const nom = prose.reduce((s, b) => s + (b.text.match(/\p{L}{3,}(ás|és|ások|ések|ását|ését|ással|éssel|ásához|ésére)(?![\p{L}])/giu) || []).length, 0);
  const FORMAL = /(?<![\p{L}])(Ön|Önnek|Önt|Önök|Önöket|Önöknek|Önökkel|Önről|Önre|Önnel|Önben|Önhöz|kérjük|tisztelt|szíveskedjen|legyen szíves|amennyiben)(?![\p{L}])/gu;
  const formal = {}; for (const b of prose) for (const m of b.text.matchAll(FORMAL)) { const k = m[1].toLowerCase(); (formal[k] = formal[k] || []).push(clip(b.text.slice(Math.max(0, m.index - 30), m.index + 40), 80)); }
  U.read = { words: pw, nominalPer100: +(nom / pw * 100).toFixed(1), formal: Object.entries(formal).map(([k, v]) => ({ term: k, n: v.length, ex: v[0] })).slice(0, 6) };
  // ---- 6. tipográfia
  const fsw = prose.filter(b => b.text.length >= 40); const arr = []; for (const b of fsw) for (let k = 0; k < Math.min(5, Math.ceil(b.text.length / 80)); k++) arr.push(b.fs);
  arr.sort((a, b) => a - b); U.font = { median: arr.length ? arr[Math.floor(arr.length / 2)] : null, samples: fsw.length };
  const ll = prose.filter(b => b.text.length >= 160 && b.h / b.lh >= 3 && b.w >= 300).map(b => b.text.length / Math.max(1, Math.round(b.h / b.lh))).sort((a, b) => a - b);
  U.line = { median: ll.length ? Math.round(ll[Math.floor(ll.length / 2)]) : null, n: ll.length };
  // ---- 7. mobil hüvelykujj-zóna
  const fixedCtas = ctaEls.filter(c => c.pos !== 'static');
  U.thumb = { fixedCta: fixedCtas.length ? fixedCtas.map(c => ({ text: mask(c.text).slice(0, 30), y: Math.round(c.cy / vh * 100) })) : [], navCta: ctaEls.some(c => c.zone === 'nav' && c.fold), foldCtaLow: ctaEls.some(c => c.fold && c.zone === 'main' && c.cy >= vh * 0.35) };

  // ---- 8. űrlapok (DOM; klónon validálva, beküldés nincs)
  const GOOD_HU = /[áéíóöőúüű]|köszön|sikeres|hiba|próbál|megkap|elküld|rendben|hopp|sajnos|üzenet/i, EN_DEF = /thank you|oops|something went wrong|submission has been received/i;
  const forms = [...document.querySelectorAll('form')].map(f => {
    const fr = f.getBoundingClientRect();
    const fields = [...f.querySelectorAll('input,textarea,select')].filter(i => !/^(hidden|submit|button|image|reset)$/.test(i.type));
    const fVis = i => vis(i) || (i.closest('label') && vis(i.closest('label'))) || (i.parentElement && vis(i.parentElement));
    const vf = fields.filter(fVis);
    const nameOf = i => (i.getAttribute('data-name') || i.name || i.id || i.type).slice(0, 24);
    const lblText = i => { const ls = i.labels ? [...i.labels] : []; const w = i.closest('label'); if (w && !ls.includes(w)) ls.push(w); const t = ls.map(l => tx(l)).join(' ').trim(); return t; };
    const unlabeled = [], ariaOnly = [], placeholderOnly = [], typeIssues = [], noAutocomplete = [], badMax = [];
    let required = 0;
    for (const i of vf) {
      const lt = lblText(i);
      if (!/^(checkbox|radio)$/.test(i.type) || !lt) {
        if (!lt) { if (i.getAttribute('aria-label') || i.getAttribute('aria-labelledby')) ariaOnly.push(nameOf(i)); else if (i.placeholder) placeholderOnly.push(nameOf(i)); else unlabeled.push(nameOf(i)); }
      }
      if (i.required) required++;
      const key = ((i.name || '') + ' ' + (i.getAttribute('data-name') || '') + ' ' + i.id + ' ' + (i.placeholder || '')).toLowerCase();
      if (/e-?mail/.test(key) && i.type !== 'email') typeIssues.push(`${nameOf(i)}: type=${i.type} (email kell)`);
      if (/(tel|telefon|phone)/.test(key) && !/^(tel|number)$/.test(i.type) && !i.getAttribute('inputmode')) typeIssues.push(`${nameOf(i)}: type=${i.type} (tel kell)`);
      if (/(e-?mail|tel|telefon|phone|név|nev|name|ceg|cég|company|organization)/.test(key) && i.tagName === 'INPUT' && !i.getAttribute('autocomplete')) noAutocomplete.push(nameOf(i));
      if (i.maxLength > 0 && (i.maxLength < 2 || i.maxLength > 5000)) badMax.push(`${nameOf(i)}: ${i.maxLength}`);
    }
    const c = f.cloneNode(true);
    for (const i of c.querySelectorAll('input,textarea')) { if (/^(checkbox|radio)$/.test(i.type)) i.checked = false; else if (!/^(hidden|submit|button|image)$/.test(i.type)) i.value = ''; }
    let emptyInvalid = 0; try { emptyInvalid = [...c.elements].filter(e => e.willValidate && !e.checkValidity()).length; } catch {}
    let emailRejects = null; const em = c.querySelector('input[type=email]'); if (em) { em.value = 'abc'; emailRejects = !em.checkValidity(); em.value = 'nev@pelda.hu'; emailRejects = emailRejects && em.checkValidity(); }
    const w = f.closest('.w-form') || f.parentElement;
    const done = w && w.querySelector('.w-form-done'), fail = w && w.querySelector('.w-form-fail');
    const dt = done ? (done.textContent || '').replace(/\s+/g, ' ').trim() : '', ft = fail ? (fail.textContent || '').replace(/\s+/g, ' ').trim() : '';
    const lead = fields.some(i => /^(email|tel)$/.test(i.type) || /e-?mail|phone|tel|név|nev|name|uzenet|üzenet/i.test((i.name || '') + (i.getAttribute('data-name') || '') + (i.placeholder || '')));
    const sc = f.closest('.w-form') || f;
    const privacy = !!sc.querySelector('a[href*="adatkezel"],a[href*="adatvedel"],a[href*="adatvédel"],a[href*="privacy"]') || /adatkezel|adatvédel/i.test(sc.textContent || '');
    // bizalom az űrlap közelében: 1 nézetnyi fölötte + az űrlap saját területe
    const top = fr.top + sy, lo = top - vh, hi = top + fr.height + 40;
    const near = el => { const r = el.getBoundingClientRect(); const y = r.top + sy; return r.height > 0 && y >= lo && y <= hi; };
    const nearBlocks = body.filter(b => b.top >= lo && b.top <= hi);
    const trust = {
      logos: [...document.querySelectorAll('[class*="bizalom"],[class*="logosor"],[class*="partner-logo"],[class*="logo-"],[class*="-logo"]')].some(e => vis(e) && !e.closest(ZONE) && near(e) && e.querySelector('img,svg')),
      testimonial: [...document.querySelectorAll('blockquote,[class*="idezet"],[class*="velemeny"],[class*="testimonial"],[class*="referencia"]')].some(e => vis(e) && near(e)),
      guarantee: nearBlocks.some(b => /garancia|kötelezettség nélkül|ingyenes|nincs rejtett|munkanapon belül|válaszolunk|díjmentes|nem küldünk spam|bármikor leiratkoz/i.test(b.text)),
      privacy: privacy || nearBlocks.some(b => /adatkezel|adatvédel/i.test(b.text)),
    };
    return { id: f.id || '', name: f.getAttribute('data-name') || f.getAttribute('name') || '', lead, visible: fr.width > 0 && fr.height > 0, fields: fields.length, visibleFields: vf.length, unlabeled, ariaOnly, placeholderOnly, required, emptyInvalid, emailRejects, typeIssues, noAutocomplete, badMax,
      done: { exists: !!done, text: clip(dt, 80), hu: !dt || (GOOD_HU.test(dt) && !EN_DEF.test(dt)) }, fail: { exists: !!fail, text: clip(ft, 80), hu: !ft || (GOOD_HU.test(ft) && !EN_DEF.test(ft)) }, privacy, trust };
  });
  U.forms = forms;
  return U;
}

// ------------------------------------------------------------ pontozás
const clipT = (s, n = 80) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const LEGAL_PATH = /impresszum|adatkezel|aszf|jogi|felhasznalas|cookie|suti|sutik|szabalyzat|nyilatkozat/i;

/** mob / desk: a két nézet U-ja; ctx: { path, isEn, b2b } */
export function uxFindings(mob, desk, add, have, ctx) {
  if (!desk && !mob) { add('ux', 'P3', 'ux.not-run', 'Az UX-mérés nem futott le', '', 'Futtasd újra.', 0); return; }
  const D = desk || mob, Mb = mob || desk;
  const views = [['mobil', Mb, true], ['asztali', D, false]].filter((v, i, a) => i === 0 || v[1] !== a[0][1]);
  const legal = LEGAL_PATH.test(ctx.path);
  // 1. első benyomás (5 mp-es teszt)
  for (const [label, U, isM] of views) {
    const f = U.fold;
    if (!f.h1) { if (!have('content.no-h1')) add('ux', 'P1', `ux.no-h1|${label}`, `Az első nézetben nincs látható H1 (${label})`, '', 'Tegyél az oldal fő üzenetét H1-ként a hajtás fölé.', 8); }
    else if (!f.h1.inFold) add('ux', 'P2', `ux.h1-below-fold|${label}`, `A H1 a hajtás alatt van (${label})`, f.h1.text, 'Hozd a H1-et és az első mondatot a hajtás fölé.', 5);
    if (!f.valueProp && !(f.h1 && f.h1.words >= 8)) add('ux', isM ? 'P2' : 'P3', `ux.no-value-prop|${label}`, `Az első nézetben nincs értékajánlat-mondat (≥ 8 szó) (${label})`, f.h1 ? `H1: „${f.h1.text}”` : '', 'Írj a H1 alá egy mondatot (8–20 szó): kinek, mit ad, milyen haszonnal.', isM ? 5 : 3);
    if (f.ctaCount === 0 && !have('links.no-fold-cta-mobile') && !have('links.no-fold-cta-desktop')) add('ux', 'P2', `ux.no-fold-cta|${label}`, `Az első nézetben nincs elsődleges CTA (${label})`, '', 'Tegyél egy kiemelt, cselekvő gombot a hajtás fölé.', 6);
    if (!f.visual) add('ux', 'P3', `ux.no-visual|${label}`, `Az első nézetben nincs kép/illusztráció (${label})`, '', 'Tegyél a hero-ba képet vagy illusztrációt (valódi termék, valódi munka); a vizuális horog növeli az elidőzést.', 3);
    // 2. CTA-hierarchia
    const h = U.hero;
    if (h.ctas.length && h.solids === 0) add('ux', 'P2', `ux.cta-no-primary|${label}`, `A hero-ban nincs egyértelműen elsődleges (kitöltött) CTA (${label})`, h.ctas.map(c => c.text).join(' | '), 'Egy gomb legyen kitöltött (elsődleges), a többi körvonalas vagy szöveglink.', 5);
    if (h.solids > 1) add('ux', 'P2', `ux.cta-multi-primary|${label}`, `A hero-ban ${h.solids} egyformán kiemelt CTA versenyez (${label})`, h.ctas.filter(c => c.solid).map(c => c.text).join(' | '), 'Pontosan egy elsődleges CTA; a másodlagos legyen láthatóan gyengébb.', 6);
    if (h.ctas.length > 2) add('ux', 'P2', `ux.cta-too-many|${label}`, `A hero-ban ${h.ctas.length} CTA van (legfeljebb 2 ajánlott) (${label})`, h.ctas.map(c => c.text).join(' | '), 'Hagyd meg az elsődleges és legfeljebb egy másodlagos utat.', 5);
  }
  // CTA-feliratok: igés, ≤ 4 szó (az asztali nézet listája, nem lábléc)
  const labs = (D.ctaLabels || []).filter(l => l.zone === 'main');
  const badLab = labs.filter(l => l.words > 4 || !l.verb).slice(0, 8);
  for (const l of badLab.slice(0, 4)) add('ux', 'P3', `ux.cta-label|${l.text.toLowerCase().slice(0, 30)}`, `CTA-felirat nem igés vagy túl hosszú: „${l.text}” (${l.words} szó)`, l.words > 4 ? 'több mint 4 szó' : 'nincs benne felszólító/E1 ige (kézzel nézd meg)', 'Cselekvő, ige-első felirat, ≤ 4 szó (pl. „Kérj ajánlatot”, „Töltsd le az appot”).', 1.5, 'ctalab', 6);
  // 3. Nielsen
  for (const f of D.forms || []) {
    const nm = f.name || f.id || 'névtelen';
    if (!f.visible && !f.lead) continue;
    if (f.lead) {
      if (!f.done.exists) add('ux', 'P1', `ux.form-no-success|${nm}`, `Az űrlapnak (${nm}) nincs siker-üzenete (.w-form-done): a látogató nem tudja, elment-e`, '', 'Add hozzá a siker-üzenetet (Webflow Form → Success message), magyarul, a következő lépéssel („1 munkanapon belül jelentkezünk”).', 10, 'uxform', 30);
      else if (!f.done.hu && !have('content.english-default|' + f.done.text.slice(0, 30))) add('ux', 'P2', `ux.form-done-lang|${nm}`, `A siker-üzenet nem magyarnak látszik: „${clipT(f.done.text, 50)}”`, '', 'Írd át magyarra.', 4, 'uxform', 30);
      if (!f.fail.exists) add('ux', 'P2', `ux.form-no-error|${nm}`, `Az űrlapnak (${nm}) nincs hiba-üzenete (.w-form-fail)`, '', 'Add hozzá a hibaüzenetet, magyarul, megoldási javaslattal.', 4, 'uxform', 30);
      else if (!f.fail.hu) add('ux', 'P2', `ux.form-fail-lang|${nm}`, `A hiba-üzenet nem magyarnak látszik: „${clipT(f.fail.text, 50)}”`, '', 'Írd át magyarra.', 4, 'uxform', 30);
      if (f.required === 0) add('ux', 'P2', `ux.form-no-required|${nm}`, `Az űrlap (${nm}) egyetlen mezője sem kötelező: üres beküldés is átmehet`, `Üres klónon ${f.emptyInvalid} érvénytelen mező`, 'Jelöld kötelezőnek legalább az e-mailt (required), és jelezd a címkén.', 4, 'uxform', 30);
      if (f.visibleFields > 8) add('ux', 'P2', `ux.form-long|${nm}`, `Az űrlapnak (${nm}) ${f.visibleFields} látható mezője van (> 8)`, '', 'Csak a szükséges mezők maradjanak; a többit kérdezd meg a második lépésben.', 5, 'uxform', 30);
    }
    if (f.visible && f.unlabeled.length) add('ux', 'P1', `ux.form-label-missing|${nm}`, `Címke nélküli mező az űrlapban (${nm}): ${f.unlabeled.join(', ')}`, 'Se label, se aria-label, se placeholder', 'Adj minden mezőhöz látható <label>-t.', 8, 'uxform', 30);
    if (f.visible && f.placeholderOnly.length) add('ux', 'P2', `ux.form-label-placeholder|${nm}`, `Csak helyőrzővel címkézett mező (${nm}): ${f.placeholderOnly.join(', ')}`, 'A placeholder gépeléskor eltűnik, nem címke', 'Tegyél látható <label>-t a mező fölé; a placeholder csak formátum-példa legyen.', 5, 'uxform', 30);
    if (f.visible && f.ariaOnly.length) add('ux', 'P3', `ux.form-label-aria|${nm}`, `Csak aria-label-lel címkézett mező (${nm}): ${f.ariaOnly.join(', ')}`, 'Látható címke nincs', 'Tegyél látható címkét is.', 2, 'uxform', 30);
    if (f.visible && f.typeIssues.length) add('ux', 'P2', `ux.form-input-type|${nm}`, `Nem megfelelő mezőtípus (${nm})`, f.typeIssues.join('; '), 'type=email / type=tel a mobil billentyűzet és a böngészős ellenőrzés miatt.', 3, 'uxform', 30);
    if (f.visible && f.noAutocomplete.length) add('ux', 'P3', `ux.form-autocomplete|${nm}`, `Hiányzó autocomplete (${nm}): ${f.noAutocomplete.join(', ')}`, '', 'Adj autocomplete=name/email/tel/organization értéket (gyorsabb kitöltés mobilon).', 2, 'uxform', 30);
    if (f.badMax.length) add('ux', 'P3', `ux.form-maxlength|${nm}`, `Gyanús maxlength (${nm}): ${f.badMax.join(', ')}`, '', 'Értelmes határ: név ≥ 2, üzenet ≤ 5000.', 1, 'uxform', 30);
    if (f.lead && f.visible && !(f.trust.logos || f.trust.testimonial || f.trust.guarantee || f.trust.privacy)) add('ux', 'P2', `ux.no-trust-near-form|${nm}`, `Az űrlap (${nm}) közelében nincs bizalmi elem (logó, vélemény, garancia, adatkezelési jegyzet)`, 'Egy nézetnyi tartományban fölötte sem', 'Tegyél az űrlap fölé partnerlogót vagy idézetet, mellé egy garancia-mondatot („Nem küldünk spamet”, „1 munkanapon belül válaszolunk”) és az adatkezelési linket.', 5, 'uxtrust', 10);
    else if (f.lead && f.visible && !(f.trust.logos || f.trust.testimonial || f.trust.guarantee)) add('ux', 'P3', `ux.weak-trust-near-form|${nm}`, `Az űrlap (${nm}) közelében csak az adatkezelési jegyzet van, bizonyíték/garancia nincs`, '', 'Tegyél mellé egy rövid garancia-mondatot vagy logót/idézetet.', 2, 'uxtrust', 10);
  }
  if (!D.skip.isSkip) add('ux', 'P2', 'ux.no-skip-link', 'Nincs „Ugrás a tartalomra” link az első fókuszálható elemként', D.skip.first || '–', 'Tegyél az oldal tetejére rejtett, fókuszra előbukkanó „Ugrás a tartalomra” linket (#main-hoz).', 4);
  if (D.nav.matchesCurrent && !D.nav.hasCurrentState) add('ux', 'P3', 'ux.nav-no-current', 'A menüben a jelenlegi oldalnak nincs aktív állapota', '', 'Állíts be a Webflow „Current” állapotot a menülinkre (w--current).', 2);
  if (D.depth >= 2 && !D.breadcrumb) add('ux', 'P3', 'ux.no-breadcrumb', 'Aloldalon nincs morzsamenü / „Vissza” link', `Útvonal mélysége: ${D.depth}`, 'Add hozzá a DS-morzsamenüt (Főoldal › … › ez az oldal).', 3);
  if (!ctx.isEn && !legal && !D.help.footerContact) add('ux', 'P2', 'ux.no-footer-contact', 'A láblécben nincs kapcsolat-link (kapcsolat oldal, e-mail vagy telefon)', '', 'Tegyél kapcsolat-linket a láblécbe.', 5);
  const productPath = ctx.path && ctx.path !== '/' && !/kapcsolat|gyik|blog|404/i.test(ctx.path) && !legal;
  if (productPath && !D.help.faq) add('ux', 'P3', 'ux.no-faq-link', 'Termék-/szolgáltatásoldalon nincs GYIK-hivatkozás („DS · GYIK tovább”)', '', 'Tegyél a lap aljára GYIK-blokkot vagy linket a GYIK oldalra.', 3);
  if (!ctx.isEn) for (const e of (D.english || []).slice(0, 3)) add('ux', 'P2', `ux.english-ui|${e}`, `Angol felületi szöveg magyar oldalon: „${e}”`, '', 'Írd át magyarra.', 3, 'uxen', 9);
  if (D.density.sections > 14) add('ux', 'P3', 'ux.many-sections', `${D.density.sections} szekció az oldalon (> 14): túl hosszú lehet a görgetés`, '', 'Vond össze vagy vidd külön oldalra a kevésbé fontos szekciókat.', 2);
  if (D.density.words > 2200) add('ux', 'P3', 'ux.long-page', `${D.density.words} szó az oldalon (> 2200)`, '', 'Rövidítsd; a részleteket tedd GYIK-ba vagy külön oldalra.', 2);
  if (D.density.repeatedHeadings.length) add('ux', 'P3', 'ux.repeated-headings', 'Ismétlődő címsorok (≥ 3×)', D.density.repeatedHeadings, 'Egyedi, beszédes címsorok kellenek (képernyőolvasónak és átfutásnál is).', 1.5);
  if (D.buttonStyles.variants > 3) add('ux', 'P3', 'ux.button-styles', `${D.buttonStyles.variants} eltérő kitöltött gombstílus az oldalon`, D.buttonStyles.list, 'Használd a DS-gombváltozatokat (elsődleges / másodlagos); ne legyen „majdnem ugyanolyan” gomb.', 2);
  // 5. olvashatóság, hangnem
  if (!ctx.isEn && !legal) for (const f of D.read.formal.slice(0, 3)) add('ux', 'P2', `ux.formal-tone|${f.term}`, `Magázó/hivatalos fordulat („${f.term}”, ${f.n}×): a házstílus tegez`, `„${f.ex}”`, 'Írd át tegezőre („kérjük” → „kérünk”, „Ön” → „te”, „amennyiben” → „ha”).', 3, 'uxtone', 9);
  if (ctx.b2b && D.read.nominalPer100 >= 8 && D.read.words >= 150) add('ux', 'P3', 'ux.nominal-style', `Főnévi stílus: ${D.read.nominalPer100} -ás/-és főnév / 100 szó (cél < 8)`, '', 'Használj igét a főnévi szerkezet helyett („a megvalósítás” → „megvalósítjuk”); B2B-döntéshozónak a rövid, aktív mondat segít.', 2);
  // 6. mobil, hüvelykujj, tipográfia
  if (Mb.font.median != null && Mb.font.samples >= 3 && Mb.font.median < 16) add('ux', Mb.font.median < 15 ? 'P2' : 'P3', 'ux.mobile-font', `Mobilon a törzsszöveg ${Mb.font.median} px (≥ 16 ajánlott)`, `${Mb.font.samples} szövegblokk mediánja`, 'Állítsd a törzsszöveget 16 px-re mobilon (ds-szoveg).', Mb.font.median < 15 ? 5 : 2);
  if (D.line.median != null && D.line.n >= 2 && D.line.median > 90) add('ux', 'P3', 'ux.line-length', `Asztali nézeten a sorhossz ~${D.line.median} karakter (45–90 az olvasható)`, `${D.line.n} bekezdés mediánja`, 'Korlátozd a szövegoszlop szélességét (max-width ≈ 65ch).', 2);
  if (mob && !(Mb.thumb.fixedCta.some(c => c.y >= 50) || Mb.thumb.navCta || Mb.thumb.foldCtaLow)) add('ux', 'P3', 'ux.thumb-zone', 'Mobilon a CTA csak a képernyő tetején érhető el (nincs ragadós CTA a lent, sem menü-CTA)', '', 'Tegyél ragadós (sticky) CTA-t a képernyő aljára, vagy hozd lejjebb a hero CTA-t.', 3);
}

/** Oldalak közti CTA-következetesség: ugyanaz a felirat → ugyanaz a cél? (nem pontoz) */
export function ctaConsistency(pages) {
  const m = new Map();
  for (const p of pages) {
    const desk = p.vp && (Object.values(p.vp).find(v => !v.mobile) || Object.values(p.vp)[0]); const U = desk && desk.U; if (!U) continue;
    const seen = new Set();
    for (const c of U.ctaPairs || []) { const k = c.text; const key = k + '|' + c.dest; if (seen.has(key)) continue; seen.add(key); const o = m.get(k) || { text: k, dests: new Map() }; const d = o.dests.get(c.dest) || new Set(); d.add(p.slug); o.dests.set(c.dest, d); m.set(k, o); }
  }
  const generic = /^(tovább|részletek|bővebben|itt|link|button)$/i;
  return [...m.values()].filter(o => o.dests.size > 1 && !generic.test(o.text)).map(o => ({ text: o.text, sev: o.dests.size >= 3 ? 'P2' : 'P3', dests: [...o.dests.entries()].map(([d, s]) => ({ dest: d, pages: [...s].slice(0, 4) })) })).sort((a, b) => b.dests.length - a.dests.length).slice(0, 25);
}
export function ctaConsistencyMd(list) {
  const L = ['## CTA-következetesség oldalak között (nem pontoz)', ''];
  if (!list) return [];
  if (!list.length) return [...L, '_Nincs olyan felirat, amely oldalanként eltérő helyre vezet._', ''];
  L.push('| Súly | Felirat | Célok (oldalak) |', '|---|---|---|');
  for (const o of list) L.push(`| ${o.sev} | „${o.text}” | ${o.dests.map(d => `${d.dest} (${d.pages.join(', ')})`).join('<br>')} |`);
  L.push('', '_Ugyanaz a felirat több helyre vezet: lehet szándékos (pl. oldalon belüli horgony), de ellenőrizd._', '');
  return L;
}

export function uxMd(P) {
  const vps = Object.entries(P.vp || {}).filter(([, v]) => v.U); if (!vps.length) return [];
  const L = ['**UX és felhasználói út – első benyomás (5 mp-es teszt)**', '', '| Nézet | H1 a hajtás fölött | Értékajánlat (≥ 8 szó) | Hero-CTA-k (kitöltött) | Kép/illusztráció |', '|---|---|---|---|---|'];
  for (const [k, v] of vps) { const f = v.U.fold; L.push(`| ${k} | ${f.h1 ? (f.h1.inFold ? 'igen: „' + clipT(f.h1.text, 50) + '”' : 'a hajtás ALATT') : '**NINCS**'} | ${f.valueProp ? 'igen (' + f.valueProp.words + ' szó)' : f.h1 && f.h1.words >= 8 ? 'a H1 maga (' + f.h1.words + ' szó)' : '**nincs**'} | ${v.U.hero.ctas.length} (${v.U.hero.solids}): ${v.U.hero.ctas.map(c => '„' + clipT(c.text, 24) + '”').join(', ') || '–'} | ${f.visual ? 'igen (' + f.visualWhat + ')' : '**nincs**'} |`); }
  const D = (vps.find(([, v]) => !v.mobile) || vps[0])[1].U, M = (vps.find(([, v]) => v.mobile) || vps[0])[1].U;
  L.push('', `- Olvashatóság: ${D.read.words} szó, főnévi stílus ${D.read.nominalPer100}/100 szó · mobil törzsszöveg ${M.font.median ?? '–'} px · asztali sorhossz ~${D.line.median ?? '–'} karakter · magázó fordulat: ${D.read.formal.map(f => `${f.term}×${f.n}`).join(', ') || 'nincs'}`);
  L.push(`- Nielsen: ugrólink ${D.skip.isSkip ? 'van' : '**nincs**'} · menü aktív állapot ${D.nav.matchesCurrent ? (D.nav.hasCurrentState ? 'van' : '**nincs**') : 'n/a'} · morzsamenü ${D.breadcrumb ? 'van' : D.depth >= 2 ? '**nincs**' : 'n/a'} · GYIK-link ${D.help.faq ? 'van' : 'nincs'} · lábléc-kapcsolat ${D.help.footerContact ? 'van' : '**nincs**'} · szekciók: ${D.density.sections}`);
  for (const f of D.forms.filter(f => f.lead)) L.push(`- Űrlap „${f.name || f.id}”: ${f.visibleFields} látható mező, kötelező: ${f.required}, üres klónon ${f.emptyInvalid} érvénytelen · siker-üzenet ${f.done.exists ? 'van' : '**nincs**'}, hibaüzenet ${f.fail.exists ? 'van' : '**nincs**'} · címke nélkül: ${f.unlabeled.length + f.placeholderOnly.length} · bizalom közelben: ${['logos', 'testimonial', 'guarantee', 'privacy'].filter(k => f.trust[k]).join(', ') || '**nincs**'}`);
  L.push('');
  return L;
}
