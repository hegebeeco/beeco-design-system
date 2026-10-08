/* ============================================================
   beeco docs – közös segédek (escape, soron belüli jelölés, slug, git-dátum, ikonok)
   A Brand Book (tools/docs-brand.js) és a Design System (tools/docs-ds.js) közös motorja.
   Csak a Node beépített moduljait használja (a Netlify-buildnek nem kell npm install).
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const json = f => JSON.parse(read(f));
const exists = f => fs.existsSync(path.join(ROOT, f));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Soron belüli jelölés: `kód`, **félkövér**, [szöveg](link) – minden más escape-elve. Link: http(s), mailto, helyi .html, #horgony. */
const inl = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, h) => {
    const ok = /^(https?:|mailto:|[a-z0-9-]+\.html(#[a-z0-9-]+)?$|#[a-z0-9-]+$)/.test(h);
    return `<a href="${ok ? h : '#'}"${/^https?:/.test(h) ? ' rel="noopener"' : ''}>${t}</a>`;
  });
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const strip = h => String(h).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

/** A forrásfájlok git szerinti utolsó módosítása (YYYY-MM-DD); nincs git vagy nincs commit → null. */
function gitDatum(fajlok) {
  let leg = null;
  for (const f of [].concat(fajlok)) {
    try {
      const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', f], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (d && (!leg || d > leg)) leg = d;
    } catch (e) { /* nincs git (pl. letöltött zip) */ }
  }
  return leg;
}
const BUILD_IDO = process.env.SOURCE_DATE_EPOCH ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000) : new Date();
const BUILD_ISO = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Budapest' }).format(BUILD_IDO);
const huDatum = iso => new Intl.DateTimeFormat('hu-HU', { timeZone: 'Europe/Budapest', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso + 'T12:00:00Z'));

// Vonalas piktogramok (a DS stílusában); mindig aria-hidden, a nevet a gomb/link adja.
const IC = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  hold: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  nap: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  auto: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  kereses: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  tovabb: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  vissza: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  kulso: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  le: '<path d="m6 9 6 6 6-6"/>',
  szerk: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
  masol: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
};
const ic = (n, cls = '') => `<svg class="bb-ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${IC[n]}</svg>`;

module.exports = { ROOT, read, json, exists, esc, inl, slug, strip, gitDatum, BUILD_ISO, huDatum, ic };
