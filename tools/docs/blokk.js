/* ============================================================
   beeco docs – tartalomblokkok (a régi brandbook-építő blokktípusai, a git-előzményben: brandbook/tartalom/*.json)

   Változás a régi építőhöz képest:
   • A jelvényes kártya (szabaly, hivatalos, javaslat, hianyzik, tilos, korrigalando) és a DO/DON'T címe a környezet
     szintjéhez igazodik: h2 után h3, h3 után h4; ha az oldalon még nincs h2, a cím nem címsor (nem ugrik szintet).
   • A képek lusta betöltésűek, a hiányzó adat látható „Hiányzik” jelvénnyel és a mező nevével jelenik meg.
   • A „gen” blokkokat az oldal-építő adja (ctx.gen), a motor nem tud a tartalomról.
   ============================================================ */
'use strict';
const { esc, inl, slug, href, OLDAL_LINK, ic } = require('./alap');

/** Új renderelési környezet egy oldalhoz. */
function kornyezet(oldalId, hibak, gen = {}) {
  return { oldal: oldalId, hibak, gen, szint: 1, idk: new Set() };
}
function egyediId(ctx, alap) {
  let id = slug(alap) || 'resz', i = 2;
  while (ctx.idk.has(id)) id = `${slug(alap)}-${i++}`;
  ctx.idk.add(id);
  return id;
}
/** Címsor a környezet szintjén: h2/h3 explicit blokk; a kártyák címe ehhez igazodik. */
function cimsor(ctx, szint, szoveg, id) {
  ctx.szint = szint;
  const i = id || egyediId(ctx, strip0(szoveg));
  return `<h${szint} id="${esc(i)}">${inl(szoveg)}</h${szint}>`;
}
const strip0 = s => String(s).replace(/[`*]/g, '');
/** A kártya címe: a legutóbbi címsor alatti szint; h1 alatt (még nincs h2) nem címsor. h4-nél mélyebbre nem megy. */
function kartyaCim(ctx, szoveg, cls = 'bb-kartya-cim') {
  if (!szoveg) return { html: '', id: null };
  const id = egyediId(ctx, `${ctx.oldal}-${strip0(szoveg)}`);
  if (ctx.szint < 2) return { html: `<p class="${cls}" id="${esc(id)}">${inl(szoveg)}</p>`, id };
  const sz = Math.min(ctx.szint + 1, 4);
  return { html: `<h${sz} class="${cls}" id="${esc(id)}">${inl(szoveg)}</h${sz}>`, id };
}

const JELVENY = {
  szabaly: ['is-success', 'Szabály'],
  javaslat: ['is-warning', 'Jóváhagyásra vár'],
  hivatalos: ['is-info', 'Hivatalos szöveg'],
  hianyzik: ['is-muted', 'Hiányzik'],
  tilos: ['is-danger', 'Tilos'],
  korrigalando: ['is-warning', 'Korrigálandó – vázlat, forrás nélkül'],
};
const jelveny = t => JELVENY[t] ? `<span class="bc-badge ${JELVENY[t][0]}">${JELVENY[t][1]}</span>` : '';
const STATUSZ = { stabil: ['is-success', 'Stabil'], 'béta': ['is-info', 'Béta'], elavult: ['is-danger', 'Elavult'], 'vázlat': ['is-warning', 'Vázlat'] };
const statuszJelveny = s => STATUSZ[s] ? `<span class="bc-badge ${STATUSZ[s][0]}">${STATUSZ[s][1]}</span>` : '';
/** Látható „hiányzik” jelzés: a mező nevével, hogy a szerkesztő tudja, mit kell pótolni. */
const hianyzikJel = (mezo, mit) => `<p class="bb-hiany"><span class="bc-badge is-muted">Hiányzik</span> <code>${esc(mezo)}</code>${mit ? ` – ${inl(mit)}` : ''}</p>`;

function forrasLista(f) {
  const tiszta = [].concat(f || []).filter(x => String(x || '').trim());
  if (!tiszta.length) return '';   // üres forrásmező: nincs „Forrás” felirat
  const l = tiszta.map(x => `<li>${inl(x)}</li>`).join('');
  return `<details class="bb-forras"><summary>Forrás (${tiszta.length})</summary><ul>${l}</ul></details>`;
}

// ---------- DO / DON'T (Kristóf: „ha DO és DON'T, mindig legyen vizualizáció”) ----------
function htmlEllenor(h, ctx, hol) {
  if (/\sstyle=|<script|\son[a-z]+=|<link|javascript:/i.test(h)) ctx.hibak.push(`${ctx.oldal}${hol ? ' / ' + hol : ''}: tiltott jelölés a minta-HTML-ben (style/script/on…/link)`);
  if (/bee-angry/.test(h)) ctx.hibak.push(`${ctx.oldal}: a mérges méhecske tilos`);
  // a régi Brand Book útvonalai (ds/web/assets/…) → az új kimenet assets/ mappája, hogy a régi blokk másolható legyen
  return h.replace(/(\s(?:src|href|srcset)=")(?:\.\.\/)?ds\/web\/assets\//g, '$1assets/')
    .replace(/<img(?![^>]*\sloading=)/g, '<img loading="lazy"')
    .replace(/\shref="((?:brand|ds):[^"]*)"/g, (m, u) => OLDAL_LINK.test(u) ? ` href="${href(u) || '#'}"` : (ctx.hibak.push(`${ctx.oldal}: hibás oldalak közti link: ${u}`), ' href="#"'));
}
function vizual(o, ctx) {
  if (o.html) return htmlEllenor(o.html, ctx, o.cim || o.felirat);
  const t = inl(o.szoveg || '');
  switch (o.forma) {
    case 'gomb': return `<button type="button" class="bc-btn">${t}</button>`;
    case 'gomb2': return `<div class="bb-demo-sor">${(o.szoveg || '').split(' | ').map(g => `<button type="button" class="bc-btn">${inl(g)}</button>`).join('')}</div>`;
    case 'hiba': return `<div class="bc-field bb-demo-keskeny"><span class="bc-label">E-mail</span><input class="bc-input" value="nev@" aria-label="E-mail (minta)" aria-invalid="true" readonly><p class="bc-error">${t}</p></div>`;
    case 'meh': return `<div class="bb-demo-sor bb-demo-meh"><img src="assets/brand/${esc(o.kep || 'bee-cheer')}.webp" alt="" width="56" height="56" loading="lazy"><p class="bb-vizual-szoveg">${t}</p></div>`;
    case 'szam': return `<div class="bc-stat bb-demo-keskeny"><p class="bc-stat-value">${t}</p></div>`;
    case 'uzenet': return `<div class="bc-alert is-info"><p>${t}</p></div>`;
    case 'siker': return `<div class="bc-alert is-success"><p>${t}</p></div>`;
    default: return `<p class="bb-vizual-szoveg">${t}</p>`;
  }
}
function ddFig(o, jo, ctx) {
  const cim = o.felirat || o.cim;
  return `<figure class="bb-dd ${jo ? 'is-do' : 'is-dont'}"><figcaption><span class="bb-dd-jel" aria-hidden="true">${jo ? '✓' : '✗'}</span> ${jo ? 'Így' : 'Ne így'}${cim ? ` – ${inl(cim)}` : ''}</figcaption><div class="bb-dd-vizual" inert>${vizual(o, ctx)}</div>${o.miert ? `<p class="bb-dd-miert">${inl(o.miert)}</p>` : ''}</figure>`;
}
function dodont(b, ctx) {
  if (b.allapot === 'javaslat' && !(b.forras && b.forras.length)) ctx.hibak.push(`${ctx.oldal}: javaslat-szintű DO/DON'T forrás nélkül („${b.cim || ''}”)`);
  const c = kartyaCim(ctx, b.cim);
  const parok = (b.parok || []).map(p => `<div class="bb-dd-par">${ddFig(p.jo, true, ctx)}${ddFig(p.rossz, false, ctx)}${p.miert ? `<p class="bb-dd-miert is-kozos">${inl(p.miert)}</p>` : ''}</div>`).join('');
  return `<section class="bb-dodont"${c.id ? ` aria-labelledby="${esc(c.id)}"` : ''}>${c.html ? `<div class="bb-blokk-fej">${b.allapot === 'szabaly' ? '' : jelveny(b.allapot)}${c.html}</div>` : ''}${parok}${forrasLista(b.forras)}</section>`;
}

function tabla(fej, sorok, cim) {
  return `<div class="bc-table-wrap bb-tabla" tabindex="0" role="region" aria-label="${esc(cim || 'Táblázat')}"><table class="bc-table">${cim ? `<caption class="bc-sr">${esc(cim)}</caption>` : ''}<thead><tr>${fej.map(h => `<th scope="col">${inl(h)}</th>`).join('')}</tr></thead><tbody>${sorok.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${inl(c)}</th>` : `<td>${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const lista = (l, cls = 'bb-list') => `<ul class="${cls}">${(l || []).map(e => `<li>${inl(e)}</li>`).join('')}</ul>`;

function blokk(b, ctx) {
  switch (b.t) {
    case 'h2': return cimsor(ctx, 2, b.x, b.id);
    case 'h3': return cimsor(ctx, 3, b.x, b.id);
    case 'p': return `<p>${inl(b.x)}</p>`;
    case 'lead': return `<p class="bb-lead">${inl(b.x)}</p>`;
    case 'roviden': {
      // „Röviden”: három sor az oldal tetején – mi ez, mit használj, mi a tilos (csak az oldal saját tartalmából)
      for (const m of ['mi', 'hasznald', 'ne']) if (!b[m]) ctx.hibak.push(`${ctx.oldal}: a „roviden” blokkból hiányzik: ${m}`);
      return `<section class="bb-roviden" aria-label="Röviden"><p class="bb-roviden-cim">Röviden</p><dl><div><dt>Mi ez</dt><dd>${inl(b.mi || '')}</dd></div><div><dt>Használd</dt><dd>${inl(b.hasznald || '')}</dd></div><div class="is-ne"><dt>Ne</dt><dd>${inl(b.ne || '')}</dd></div></dl></section>`;
    }
    case 'merno': {
      // „Mérnököknek”: a kódok és értékek egy lenyitható sorban (az önkéntes a nevet és a használatot látja)
      const tor = (b.x ? [].concat(b.x).map(x => `<p>${inl(x)}</p>`).join('') : '') + (b.tabla ? tabla(b.tabla.fej, b.tabla.sorok, b.tabla.cim) : '') + (b.elemek ? lista(b.elemek) : '');
      return `<details class="bb-merno"><summary>${inl(b.cim || 'Mérnököknek')}</summary>${tor}</details>`;
    }
    case 'masolhato': {
      // Kész, másolható szöveg (idézet a márkakönyv saját szövegéből): forrás kötelező, a másolás gomb JS-sel jelenik meg
      if (!(b.forras && b.forras.length)) ctx.hibak.push(`${ctx.oldal}: másolható szöveg forrás nélkül („${b.cim || ''}”)`);
      const id = egyediId(ctx, `masol-${b.cim || b.szoveg.slice(0, 20)}`);
      const sz = [].concat(b.szoveg);
      return `<figure class="bb-masolhato"><figcaption>${inl(b.cim || '')}</figcaption><div class="bb-masolhato-sor"><blockquote id="${esc(id)}">${sz.map(x => `<p>${esc(x)}</p>`).join('')}</blockquote><button type="button" class="bc-btn is-ghost is-icon bb-masol" data-masol-cel="${esc(id)}" aria-label="${esc((b.cim || 'Szöveg') + ' másolása')}" hidden>${ic('masol')}</button></div>${forrasLista(b.forras)}</figure>`;
    }
    case 'lista': return lista(b.elemek);
    case 'szamozott': return `<ol class="bb-list">${b.elemek.map(e => `<li>${inl(e)}</li>`).join('')}</ol>`;
    case 'szabaly': case 'javaslat': case 'hianyzik': case 'tilos': case 'hivatalos': case 'korrigalando': {
      if (['javaslat', 'hivatalos', 'korrigalando'].includes(b.t) && !(b.forras && b.forras.length)) ctx.hibak.push(`${ctx.oldal}: ${b.t}-blokk forrás nélkül („${b.cim || ''}”)`);
      const c = kartyaCim(ctx, b.cim);
      const tor = (b.x ? [].concat(b.x).map(p => `<p>${inl(p)}</p>`).join('') : '') + (b.elemek ? lista(b.elemek) : '');
      return `<section class="bb-blokk is-${b.t}"${c.id ? ` aria-labelledby="${esc(c.id)}"` : ''}><div class="bb-blokk-fej">${b.t === 'szabaly' ? '' : jelveny(b.t)}${c.html}</div>${tor}${forrasLista(b.forras)}</section>`;
    }
    case 'pelda': return dodont({ parok: [{ jo: { szoveg: b.jo, forma: b.forma, felirat: b.jo_felirat }, rossz: { szoveg: b.rossz, forma: b.forma, felirat: b.rossz_felirat }, miert: b.miert }] }, ctx);
    case 'dodont': return dodont(b, ctx);
    case 'tabla': return tabla(b.fej, b.sorok, b.cim);
    case 'kep': return `<figure class="bb-kep${b.sotet ? ' is-sotet' : ''}"><img src="${esc(String(b.src || '').replace(/^(?:\.\.\/)?ds\/web\/assets\//, 'assets/'))}" alt="${esc(b.alt)}" loading="lazy"${b.w ? ` width="${b.w}" height="${b.h}"` : ''}>${b.felirat ? `<figcaption>${inl(b.felirat)}</figcaption>` : ''}</figure>`;
    case 'gen': {
      // a generátor neve: „nev” (a régi, kivezetett tartalomfájlok így írták), tartalékként „id”
      const nev = b.nev || b.id;
      const g = ctx.gen[nev];
      if (!g) { ctx.hibak.push(`${ctx.oldal}: ismeretlen generátor: ${nev}`); return ''; }
      const fn = typeof g === 'function' ? g : g.fn;
      const hol = typeof g === 'function' ? '*' : g.oldal;
      if (hol !== '*' && ctx.cfg && hol !== ctx.cfg.id) {
        ctx.hibak.push(`${ctx.oldal}: a „${nev}” generátor csak a ${hol === 'brand' ? 'Brand Bookba' : 'Design Systembe'} való (${g.miert || 'a másik oldal tartalma'})`);
        return '';
      }
      return fn(b, ctx);
    }
    case 'tovabb': ctx.hibak.push(`${ctx.oldal}: a „tovabb” blokk megszűnt – a következő oldalt a nav.json sorrendje adja`); return '';
    default: ctx.hibak.push(`${ctx.oldal}: ismeretlen blokktípus: ${b.t}`); return '';
  }
}
const blokkok = (l, ctx) => (l || []).map(b => blokk(b, ctx)).join('\n');

module.exports = { kornyezet, blokk, blokkok, cimsor, kartyaCim, egyediId, tabla, lista, forrasLista, dodont, ddFig, htmlEllenor, jelveny, statuszJelveny, hianyzikJel };
