/* beeco design system 1.34.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
/* Használat a böngészőben: const L = window.bcMeres({ w: innerWidth, touch: true }); – leletek { kat, sulyos, mi, hol } */
window.bcMeres = function meres(opts) {
  // Fagyasztás (alap: be): mérés közben nincs átmenet és animáció – a félúton megállt átmenet (pl. rejtett böngészőfül,
  // lassú gép) különben álkontraszt-leletet adna (köztes háttérszín). { fagyaszt: false } a nyers állapotot méri.
  const fagy = opts && opts.fagyaszt === false ? null : document.createElement('style');
  if (fagy) { fagy.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}'; document.head.appendChild(fagy); void document.body.offsetHeight; }
  try { return meresBelso(opts); } finally { if (fagy) fagy.remove(); }

  function meresBelso(opts) {
  const L = [];
  const add = (kat, sulyos, mi, hol) => L.push({ kat, sulyos, mi, hol });
  const desc = (el) => {
    const c = el.closest('[data-case]');
    const name = el.getAttribute('aria-label') || el.textContent.trim().slice(0, 30) || el.tagName.toLowerCase();
    return `${c ? c.dataset.case + ' › ' : ''}${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} „${name}”`;
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[aria-hidden="true"]'); };

  // --- Méretezés: vízszintes kilógás (görgethető burkon belül nem hiba)
  // A beállított nézet-szélességhez mérünk: mobil emulációnál a böngésző kiszélesítheti az innerWidth-et a tartalomhoz,
  // így a kilógás „eltűnne” (a 02-es csomag építése közben derült ki)
  const W = opts.w || innerWidth;
  if (document.documentElement.scrollWidth > W + 1) {
    const culprit = [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > W + 1 && !e.parentElement.closest('.bc-table-wrap, .bc-seg, .bc-tabs, [data-scroll]')).pop();
    add('Méretezés', 'P1', `vízszintes kilógás ${document.documentElement.scrollWidth - W} px`, culprit ? desc(culprit) : 'oldal');
  }

  // --- Hozzáférhetőség: 44 px érintésnél (a mondatközi szöveges link kivétel – WCAG 2.5.8)
  if (opts.touch) {
    for (const el of document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role=switch], [role=option], [role=tab], [role=slider]')) {
      if (!visible(el) || el.disabled) continue;
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
      // A <label>-be ágyazott jelölő/rádió célterülete a teljes címkesor
      const lab = ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) || el.closest('.bc-combo');
      const r = (lab || el).getBoundingClientRect();
      // Láthatatlan, nagyobb érintési terület ::before-rel (pl. csúszka-fogantyú: 24 px látszik, 48 px érinthető)
      const ps = getComputedStyle(el, '::before');
      if (ps.content !== 'none' && ps.position === 'absolute' && parseFloat(ps.width) >= 44 && parseFloat(ps.height) >= 44) continue;
      if (Math.round(r.height) < 44 || Math.round(r.width) < 24) add('Hozzáférhetőség', 'P2', `érintési felület ${Math.round(r.width)}×${Math.round(r.height)} px (< 44)`, desc(el));
    }
  }

  // --- Színezés: szöveg-kontraszt (a tényleges, átlátszatlan háttérhez)
  // rgb()/rgba() és color(srgb r g b / a) – az utóbbit a color-mix() adja, 0–1 közötti komponensekkel
  const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); return /^color\(srgb/.test(s) ? [n[0] * 255, n[1] * 255, n[2] * 255, ...(n.length > 3 ? [n[3]] : [])] : n; };
  const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none' && !s.backgroundImage.includes('gradient(45deg')) return null; const c = rgb(s.backgroundColor); if (c.length === 3 || c[3] > 0.95) return c; } return [255, 255, 255]; };
  const seen = new Set();
  for (const node of document.querySelectorAll('body *')) {
    if (!visible(node) || node.closest('[disabled], [aria-disabled="true"], .bc-day:disabled, video, audio, canvas, object')) continue; // a médiaelem tartalék-szövege nem látszik
    const own = [...node.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const s = getComputedStyle(node); const bg = bgOf(node); if (!bg) continue;
    const fg = rgb(s.color); const a = fg[3] ?? 1;
    const mix = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
    const [x, y] = [lum(mix), lum(bg)]; const ratio = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && Number(s.fontWeight) >= 700);
    const need = big ? 3 : 4.5;
    const key = desc(node);
    if (ratio < need && !seen.has(key)) { seen.add(key); add('Színezés', 'P1', `kontraszt ${ratio.toFixed(2)}:1 < ${need}:1`, key); }
  }

  // --- 3/A: minden beviteli mezőnek súgó gomb; hossz-/tartomány-határnál látható tartomány és számláló
  for (const f of document.querySelectorAll('.bc-field')) {
    // a rejtett belső mező (pl. Radix jelölőnégyzet „bubble” inputja: aria-hidden, tabindex -1) nem a látható vezérlő
    const ctl = f.querySelector('input:not([type=search]):not([type=hidden]):not([aria-hidden="true"]), select:not([aria-hidden="true"]), textarea, [role=combobox], .bc-tagcloud, [role=switch], [role=checkbox]');
    if (!ctl) continue;
    if (!f.querySelector('.bc-help-btn')) add('Szöveg', 'P1', 'beviteli mező súgó (ⓘ) nélkül – 3/A', desc(ctl));
    if (ctl.hasAttribute('maxlength') && ctl.closest('.bc-field') === f && !ctl.closest('.bc-tagcloud') && !f.querySelector('.bc-count')) add('Adat', 'P2', 'max. hossz van, de nincs számláló (pl. 213/255) – 3/A', desc(ctl));
    if (!ctl.labels?.length && !ctl.getAttribute('aria-label') && !ctl.getAttribute('aria-labelledby') && ['INPUT', 'SELECT', 'TEXTAREA'].includes(ctl.tagName)) add('Hozzáférhetőség', 'P1', 'mezőnek nincs címkéje', desc(ctl));
  }

  // --- Igazítás (Kristóf, 2026-10-01): gombban a piktogram és a szöveg függőlegesen középen; szövegmezőben a szöveg középen
  const kozep = (r) => r.top + r.height / 2;
  for (const b of document.querySelectorAll('.bc-btn, .bc-icon-btn, .bc-seg-item')) {
    if (!visible(b)) continue;
    const ic = b.querySelector(':scope > svg, :scope > span > svg, :scope > .bc-btn-icon');
    const txt = [...b.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()) || b.querySelector(':scope > span:not(.bc-sr):not(:has(svg))');
    const br = b.getBoundingClientRect();
    if (ic && Math.abs(kozep(ic.getBoundingClientRect()) - kozep(br)) > 1.5) add('Igazítás', 'P2', `a piktogram nincs függőlegesen középen (${(kozep(ic.getBoundingClientRect()) - kozep(br)).toFixed(1)} px)`, desc(b));
    if (ic && txt) {
      // A betűk LÁTHATÓ közepe: alapvonal − nagybetű-magasság/2 (a szövegdoboz közepe Lalezarnál félrevezető)
      const rg = document.createRange(); rg.selectNodeContents(txt);
      const tr = rg.getBoundingClientRect();
      const fst = getComputedStyle(txt.nodeType === 3 ? txt.parentElement : txt);
      const cx2 = (meres.cv ||= document.createElement('canvas').getContext('2d'));
      cx2.font = `${fst.fontWeight} ${fst.fontSize} ${fst.fontFamily}`;
      const H = cx2.measureText('H');
      // egy sor: alapvonal − nagybetű/2; több sor (tördelt felirat): a blokk közepe + ugyanaz az eltolás
      const sorDoboz = H.fontBoundingBoxAscent + H.fontBoundingBoxDescent;
      const eltolas = H.fontBoundingBoxAscent - H.actualBoundingBoxAscent / 2 - sorDoboz / 2;
      const capKozep = tr.top + tr.height / 2 + eltolas;
      const d = capKozep - kozep(ic.getBoundingClientRect());
      if (tr.height && Math.abs(d) > 1.5) add('Igazítás', 'P2', `piktogram és betűk közepe ${d.toFixed(1)} px-re eltér`, desc(b));
    }
  }
  for (const i of document.querySelectorAll('.bc-input, .bc-select')) {
    if (!visible(i) || i.tagName === 'TEXTAREA') continue;
    const st = getComputedStyle(i);
    if (Math.abs(parseFloat(st.paddingTop) - parseFloat(st.paddingBottom)) > 1) add('Igazítás', 'P2', 'a mező szövege nincs függőlegesen középen (eltérő felső/alsó belső margó)', desc(i));
  }
  // Egy sorban álló beviteli/szűrő elemek: a vezérlők ALJA egy vonalban (eltérő címke-magasság mellett is)
  const vez = (c) => (c.matches('.bc-seg, .bc-btn') ? c : c.querySelector('.bc-combo, .bc-seg, input:not([type=checkbox]):not([type=radio]):not([type=file]), select, .bc-btn'));
  for (const sor of document.querySelectorAll('.bc-fb-row, .bc-row, .bc-form-row, .bc-dt-tools')) {
    if (!visible(sor)) continue;
    if (!sor.querySelector('.bc-field, .bc-filter, .bc-search, .bc-combo, input, select')) continue; // csak gombokból álló sor: más méretű gombok, nem hiba
    const elemek = [...sor.children].filter((c) => visible(c) && vez(c) && visible(vez(c))).map((c) => ({ c, r: vez(c).getBoundingClientRect() }));
    const sorok = [];
    for (const e of elemek) { const s2 = sorok.find((g) => g.some((x) => e.r.top < x.r.bottom && e.r.bottom > x.r.top)); if (s2) s2.push(e); else sorok.push([e]); }
    for (const g of sorok) {
      if (g.length < 2) continue;
      const aljak = g.map((x) => x.r.bottom); const d = Math.max(...aljak) - Math.min(...aljak);
      if (d > 1.5) add('Igazítás', 'P2', `egy sorban álló mezők alja ${d.toFixed(0)} px-re eltér (alulra igazítás kell)`, desc(g[aljak.indexOf(Math.min(...aljak))].c));
    }
  }

  // --- Árnyék (Kristóf, 2026-10-01): a felületek és gombok kemény árnyékot kapnak – ha valami (pl. projekt-CSS) leszedi, lelet
  const ARNYEKOS = '.bc-card:not(.is-flat), .bc-btn:not(.is-ghost):not(:disabled):not([aria-disabled="true"]), .bc-stat, .bc-tile, .bc-pop, .bc-seg, .bc-sablon-bar, .bc-modal, .bc-dt-wrap';
  for (const el of document.querySelectorAll(ARNYEKOS)) {
    if (!visible(el) || el.closest('.bc-dt.is-cards')) continue;
    if (getComputedStyle(el).boxShadow === 'none') add('Árnyék', 'P2', 'a felületről hiányzik a kemény árnyék', desc(el));
  }

  // --- Piktogram-szabály (Kristóf, 2026-10-01): mentés / törlés / új / szerkesztés / info szöveges gombon legyen piktogram;
  // a csak piktogramos gombnak legyen neve (képernyőolvasó) és súgó-buboréka (title vagy Tooltip)
  const PIKT = /^(mentés|ment |mentése|törl|új |új$|hozzáad|létrehoz|felvétel|szerkeszt|módosít|info|súgó|részletek)/i;
  for (const b of document.querySelectorAll('button, a.bc-btn')) {
    if (!visible(b) || !b.matches('.bc-btn, .bc-icon-btn')) continue;
    const szoveg = (b.textContent || '').trim();
    const svg = b.querySelector('svg, img, .bc-btn-icon');
    if (szoveg && !svg && PIKT.test(szoveg) && !b.closest('[data-case-nopikt]')) add('Piktogram', 'P3', 'szöveges mentés/törlés/új/szerkesztés gomb piktogram nélkül', desc(b));
    if (!szoveg && svg) {
      const nev = b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || b.getAttribute('title');
      if (!nev) add('Hozzáférhetőség', 'P1', 'csak piktogramos gomb név nélkül', desc(b));
      else if (!b.getAttribute('title') && !b.hasAttribute('data-state') && !b.getAttribute('aria-describedby') && b.matches('.bc-btn')) add('Piktogram', 'P3', 'csak piktogramos gomb súgó-buborék nélkül (title vagy Tooltip)', desc(b));
    }
  }
  return L;
  }
};
