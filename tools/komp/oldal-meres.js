/* ============================================================
   Böngészőben futó mérések egy tesztlapon (a check-komponensek hívja page.evaluate-tel).
   Visszaad: leletek listája { kat, sulyos, mi, hol } – kategóriák: docs/komponensek.md 3/C.
   ============================================================ */
module.exports = function meres(opts) {
  const L = [];
  const add = (kat, sulyos, mi, hol) => L.push({ kat, sulyos, mi, hol });
  const desc = (el) => {
    const c = el.closest('[data-case]');
    const name = el.getAttribute('aria-label') || el.textContent.trim().slice(0, 30) || el.tagName.toLowerCase();
    return `${c ? c.dataset.case + ' › ' : ''}${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} „${name}”`;
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[aria-hidden="true"]'); };

  // --- Méretezés: vízszintes kilógás (görgethető burkon belül nem hiba)
  if (document.documentElement.scrollWidth > innerWidth + 1) {
    const culprit = [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && !e.parentElement.closest('.bc-table-wrap, .bc-seg, .bc-tabs')).pop();
    add('Méretezés', 'P1', `vízszintes kilógás ${document.documentElement.scrollWidth - innerWidth} px`, culprit ? desc(culprit) : 'oldal');
  }

  // --- Hozzáférhetőség: 44 px érintésnél (a mondatközi szöveges link kivétel – WCAG 2.5.8)
  if (opts.touch) {
    for (const el of document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role=switch], [role=option], [role=tab]')) {
      if (!visible(el) || el.disabled) continue;
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
      // A <label>-be ágyazott jelölő/rádió célterülete a teljes címkesor
      const lab = ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) || el.closest('.bc-combo');
      const r = (lab || el).getBoundingClientRect();
      if (Math.round(r.height) < 44 || Math.round(r.width) < 24) add('Hozzáférhetőség', 'P2', `érintési felület ${Math.round(r.width)}×${Math.round(r.height)} px (< 44)`, desc(el));
    }
  }

  // --- Színezés: szöveg-kontraszt (a tényleges, átlátszatlan háttérhez)
  const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none' && !s.backgroundImage.includes('gradient(45deg')) return null; const c = rgb(s.backgroundColor); if (c.length === 3 || c[3] > 0.95) return c; } return [255, 255, 255]; };
  const seen = new Set();
  for (const node of document.querySelectorAll('body *')) {
    if (!visible(node) || node.closest('[disabled], [aria-disabled="true"], .bc-day:disabled')) continue;
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
    const ctl = f.querySelector('input:not([type=search]), select, textarea, [role=combobox], .bc-tagcloud, [role=switch]');
    if (!ctl) continue;
    if (!f.querySelector('.bc-help-btn')) add('Szöveg', 'P1', 'beviteli mező súgó (ⓘ) nélkül – 3/A', desc(ctl));
    if (ctl.hasAttribute('maxlength') && ctl.closest('.bc-field') === f && !ctl.closest('.bc-tagcloud') && !f.querySelector('.bc-count')) add('Adat', 'P2', 'max. hossz van, de nincs számláló (pl. 213/255) – 3/A', desc(ctl));
    if (!ctl.labels?.length && !ctl.getAttribute('aria-label') && !ctl.getAttribute('aria-labelledby') && ['INPUT', 'SELECT', 'TEXTAREA'].includes(ctl.tagName)) add('Hozzáférhetőség', 'P1', 'mezőnek nincs címkéje', desc(ctl));
  }
  return L;
};
