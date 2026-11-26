// beeco-weboldal-audit · lib-images.mjs – kép-mélyellenőrzés (v3.1): LCP-kép lazy, túlméretes kép, hiányzó méret (CLS),
// képek összsúlya, régi formátum, oldalankénti képtábla. Bemenet: a mérés (P.vp[*].X.images + imgReqs, P.perf.lcpInfo, vp[*].lcp0).
// A leletek a scorePage `add` függvényén át mennek (dim: perf / visual).

const fileOf = u => { try { return decodeURIComponent(String(u).split('/').pop().split('?')[0]).slice(0, 50); } catch { return String(u).split('/').pop().slice(0, 50); } };
const kb = b => Math.round(b / 1024);
const SKIP_URL = /webclip|favicon/i;
const fmtOf = (mime, url) => { const m = /image\/([a-z0-9+.-]+)/i.exec(mime || ''); const f = m ? m[1].toLowerCase() : ((/\.(\w{2,4})(\?|$)/.exec(url) || [])[1] || '?').toLowerCase(); return f === 'jpg' ? 'jpeg' : f.replace('svg+xml', 'svg'); };

/** Képek elemzése nézetenként; visszaadja a táblát, a leleteket előállító összegzést. */
export function analyzeImages(P) {
  const vps = Object.entries(P.vp || {}).filter(([, v]) => v && v.X && v.imgReqs);
  if (!vps.length) return null;
  const largest = vps.slice().sort((a, b) => (+b[0].split('x')[0]) - (+a[0].split('x')[0]))[0];
  const byUrl = new Map(); // url -> összevont kép
  const oversized = new Map(), noDim = new Map();
  for (const [key, v] of vps) {
    const label = v.mobile ? 'mobil' : 'asztali';
    const reqs = new Map(v.imgReqs.map(r => [r.url, r]));
    for (const r of v.imgReqs) {
      if (/^data:/.test(r.url)) continue;
      const o = byUrl.get(r.url) || { url: r.url, file: fileOf(r.url), bytes: 0, fmt: fmtOf(r.mime, r.url), nat: null, shown: {}, loading: null, fp: '', dom: false };
      o.bytes = Math.max(o.bytes, r.bytes || 0); byUrl.set(r.url, o);
    }
    for (const i of v.X.images) {
      if (!i.src || /^data:/.test(i.src) || /\.svg(\?|$)/i.test(i.src)) continue;
      const o = byUrl.get(i.src); const rq = reqs.get(i.src); const bytes = rq ? rq.bytes : 0;
      if (o) { o.dom = true; if (!o.nat && i.w) o.nat = [i.w, i.h]; if (i.dw > 0) o.shown[label] = [i.dw, i.dh || 0]; if (o.loading == null && i.loading !== undefined) { o.loading = i.loading || 'auto'; o.fp = i.fp || ''; } }
      // túlméretes: a természetes szélesség > 2 × (megjelenített CSS-szélesség × dpr), és > 50 kB
      const dpr = i.dpr || 1;
      if (o && bytes > 50 * 1024 && i.dw >= 20 && i.w > 2 * i.dw * dpr && !SKIP_URL.test(i.src)) {
        const need = 2 * i.dw * dpr; const waste = Math.round(bytes * (1 - (need / i.w) ** 2));
        const prev = oversized.get(i.src);
        if (!prev || waste > prev.waste) oversized.set(i.src, { url: i.src, file: fileOf(i.src), kb: kb(bytes), wasteKB: kb(waste), nat: [i.w, i.h], shown: [i.dw, i.dh], vp: label });
      }
      // hiányzó méret: nincs width+height attribútum, nincs CSS aspect-ratio, a magasság a képből adódik (különben nincs CLS-kockázat)
      if (i.vis && i.zone === 'main' && i.dw >= 48 && i.w > 1 && i.pos !== 'absolute' && i.pos !== 'fixed' && i.wa === false && (i.ar === 'auto' || i.ar === '')) {
        const natR = i.h / i.w, shownR = i.dh / i.dw;
        if (natR > 0 && Math.abs(shownR - natR) / natR < 0.04) noDim.set(i.src, { file: fileOf(i.src), vp: label, fold: i.top < (v.mobile ? 844 : 900) });
      }
    }
  }
  const all = [...byUrl.values()];
  // képek összsúlya a legnagyobb nézeten
  const lv = largest[1]; const uniq = new Map(lv.imgReqs.filter(r => !/^data:/.test(r.url)).map(r => [r.url, r]));
  const totalBytes = [...uniq.values()].reduce((s, r) => s + (r.bytes || 0), 0);
  const legacy = all.filter(o => /^(jpeg|png)$/.test(o.fmt) && o.bytes > 100 * 1024 && !SKIP_URL.test(o.url)).sort((a, b) => b.bytes - a.bytes);
  const table = all.filter(o => o.bytes > 0).sort((a, b) => b.bytes - a.bytes).slice(0, 8).map(o => ({
    file: o.file, kb: kb(o.bytes), fmt: o.fmt, nat: o.nat ? `${o.nat[0]}×${o.nat[1]}` : '–',
    shown: ['asztali', 'mobil'].map(l => o.shown[l] ? `${l === 'mobil' ? 'mob' : 'aszt'} ${o.shown[l][0]}×${o.shown[l][1]}` : null).filter(Boolean).join(' · ') || '–',
    loading: o.loading == null ? '–' : o.loading === 'lazy' ? 'lazy' : o.loading === 'eager' ? 'eager' : 'auto', fp: o.fp || '',
  }));
  return { viewport: largest[0], totalKB: kb(totalBytes), count: uniq.size, table, oversized: [...oversized.values()].sort((a, b) => b.wasteKB - a.wasteKB), noDim: [...noDim.values()],
    legacy: legacy.map(o => ({ file: o.file, kb: kb(o.bytes), fmt: o.fmt })), wasteKB: [...oversized.values()].reduce((s, o) => s + o.wasteKB, 0) };
}

/** Az LCP-elem: <img loading="lazy">-e? Csak a ténylegesen mért LCP-csomópont attribútuma számít (nem osztálynév). */
export function lcpLazy(P) {
  const hits = [];
  const chk = (info, where) => { if (info && info.tag === 'img' && info.loading === 'lazy') hits.push({ where, src: fileOf(info.src || info.url || ''), fp: info.fp || '', rw: info.rw, nw: info.nw }); };
  chk(P.perf && P.perf.lcpInfo, 'mobil (4× CPU)');
  for (const [k, v] of Object.entries(P.vp || {})) chk(v.lcp0 && v.lcp0.info, (v.mobile ? 'mobil ' : 'asztali ') + k);
  // ugyanaz a kép több nézeten: egy bejegyzés
  const seen = new Set(); return hits.filter(h => { const k = h.src + '|' + h.where.split(' ')[0]; if (seen.has(k)) return false; seen.add(k); return true; });
}

export function imageFindings(P, IA, add) {
  const lz = lcpLazy(P);
  if (lz.length) add('perf', 'P1', 'perf.lcp-lazy', `A legnagyobb tartalmi kép (LCP) lusta betöltésű (loading="lazy"): ${lz[0].src}`, lz.map(h => `${h.where}: ${h.src}${h.fp ? ' · fetchpriority=' + h.fp : ' · nincs fetchpriority'}`), 'A hero-kép legyen azonnali: Webflow → a kép Element settings → Loading: Eager (vagy Custom attributes: loading = eager), és fetchpriority = high. A lusta kép csak a layout után kezd letölteni, ezért az LCP késik.', 12);
  if (!IA) return;
  for (const o of IA.oversized.slice(0, 6)) add('visual', 'P2', `visual.oversized-image|${o.file}`, `Túlméretes kép: ${o.file} (${o.nat[0]}×${o.nat[1]} px, megjelenítve ${o.shown[0]} px széles; ~${o.wasteKB} kB felesleg)`, `${o.vp} nézet · letöltve ${o.kb} kB`, 'Tölts fel a megjelenítéshez illő méretű képet (a kétszeres, retina-méretnél ne nagyobbat); a Webflow a srcset-et ebből építi.', 2, 'oz', 8);
  if (IA.noDim.length) add('visual', 'P3', 'visual.img-no-dimensions', `${IA.noDim.length} tartalmi kép width/height és aspect-ratio nélkül (elrendezés-ugrás kockázat)`, IA.noDim.slice(0, 5).map(d => `${d.file}${d.fold ? ' (hajtás fölött)' : ''}`), 'Adj a képnek width és height attribútumot (Webflow: a kép beállításai, vagy Custom attributes), vagy CSS aspect-ratio-t: így a betöltés nem tolja el a tartalmat.', Math.min(4, 0.5 * IA.noDim.length));
  if (IA.totalKB > 1024) add('perf', 'P2', 'perf.image-weight', `A képek összsúlya ${(IA.totalKB / 1024).toFixed(1)} MB (${IA.count} kép, ${IA.viewport} nézet; cél ≤ 1 MB)`, IA.table.slice(0, 3).map(t => `${t.file} ${t.kb} kB`), 'A legnehezebb képeket tömörítsd/méretezd (WebP/AVIF), a hajtás alattiak legyenek lazy-k.', 6);
  for (const o of IA.legacy.slice(0, 5)) add('visual', 'P3', `visual.legacy-format|${o.file}`, `Nagy kép régi formátumban: ${o.file} (${o.kb} kB, ${o.fmt.toUpperCase()})`, 'JPEG/PNG > 100 kB', 'Konvertáld WebP-re vagy AVIF-re (Webflow Assets: „Convert to WebP”); általában 25–35 %-kal kisebb.', 1, 'lg', 4);
}

const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
export function imagesMd(IA) {
  if (!IA) return [];
  const L = [`**Képek** (legnagyobb nézet: ${IA.viewport}; ${IA.count} kép, összesen ${(IA.totalKB / 1024).toFixed(2)} MB${IA.wasteKB ? `; becsült felesleg a túlméretes képekben ~${IA.wasteKB} kB` : ''})`, ''];
  if (!IA.table.length) { L.push('_Nem mért kép._', ''); return L; }
  L.push('| Fájl | kB | Formátum | Természetes px | Megjelenítve | Betöltés |', '|---|---|---|---|---|---|');
  for (const t of IA.table) L.push(`| ${cell(t.file)} | ${t.kb} | ${t.fmt} | ${t.nat} | ${t.shown} | ${t.loading}${t.fp ? ' · fetchpriority=' + t.fp : ''} |`);
  L.push('');
  return L;
}
