// beeco-weboldal-audit · visual-diff.mjs – két futás teljes oldalas képernyőképének összevetése (pixelmatch-jellegű, YIQ-küszöb),
// 400 px-es vízszintes sávonként. Playwrighttal, egy headless oldalon, canvasokon számol: külső csomag nélkül.
// Különböző magasságnál az átfedő részt veti össze, a magasságváltozást külön jelzi. Csak tájékoztató (P3).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const inPage = async ({ a, b, band, thr, minPct, maxPanels }) => {
  const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('kép nem tölthető be')); i.src = src; });
  const [A, B] = await Promise.all([load(a), load(b)]);
  const out = { oldW: A.naturalWidth, oldH: A.naturalHeight, newW: B.naturalWidth, newH: B.naturalHeight };
  if (A.naturalWidth !== B.naturalWidth) return { ...out, error: `eltérő szélesség (${A.naturalWidth} ≠ ${B.naturalWidth}): más nézetmérettel készült` };
  const w = A.naturalWidth, H = Math.min(A.naturalHeight, B.naturalHeight), maxD = 35215 * thr * thr;
  const mk = h => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const y_ = (r, g, b_) => r * 0.29889531 + g * 0.58662247 + b_ * 0.11448223, i_ = (r, g, b_) => r * 0.59597799 - g * 0.2741761 - b_ * 0.32180189, q_ = (r, g, b_) => r * 0.21147017 - g * 0.52261711 + b_ * 0.31114694;
  const bl = (c, al) => 255 + (c - 255) * al;
  const bands = [], panels = [];
  for (let y0 = 0; y0 < H; y0 += band) {
    const bh = Math.min(band, H - y0);
    const c1 = mk(bh), c2 = mk(bh), c3 = mk(bh), x1 = c1.getContext('2d'), x2 = c2.getContext('2d');
    x1.drawImage(A, 0, y0, w, bh, 0, 0, w, bh); x2.drawImage(B, 0, y0, w, bh, 0, 0, w, bh);
    const d1 = x1.getImageData(0, 0, w, bh).data, d2 = x2.getImageData(0, 0, w, bh).data, x3 = c3.getContext('2d'), od = x3.createImageData(w, bh);
    let diff = 0;
    for (let p = 0; p < d1.length; p += 4) {
      const a1 = d1[p + 3] / 255, a2 = d2[p + 3] / 255;
      const r1 = bl(d1[p], a1), g1 = bl(d1[p + 1], a1), b1 = bl(d1[p + 2], a1), r2 = bl(d2[p], a2), g2 = bl(d2[p + 1], a2), b2 = bl(d2[p + 2], a2);
      const dy = y_(r1, g1, b1) - y_(r2, g2, b2), di = i_(r1, g1, b1) - i_(r2, g2, b2), dq = q_(r1, g1, b1) - q_(r2, g2, b2);
      const dl = 0.5053 * dy * dy + 0.299 * di * di + 0.1957 * dq * dq;
      if (dl > maxD) { diff++; od.data[p] = 255; od.data[p + 1] = 0; od.data[p + 2] = 80; od.data[p + 3] = 255; }
      else { const v = Math.min(255, Math.round(y_(r2, g2, b2) * 0.2 + 200)); od.data[p] = od.data[p + 1] = od.data[p + 2] = v; od.data[p + 3] = 255; }
    }
    x3.putImageData(od, 0, 0);
    const pctChanged = (diff / (w * bh)) * 100;
    bands.push({ y0, y1: y0 + bh, pct: +pctChanged.toFixed(2) });
    if (pctChanged > minPct && panels.length < maxPanels) panels.push({ y0, bh, c1, c2, c3, pct: pctChanged });
  }
  out.overlapH = H; out.bands = bands;
  if (panels.length) {
    const s = Math.min(1, 2400 / (3 * w + 24)), pw = Math.round(w * s), gap = 12, head = 22;
    const total = panels.reduce((t, p) => t + Math.round(p.bh * s) + head + gap, 0);
    const cv = document.createElement('canvas'); cv.width = 3 * pw + 2 * gap; cv.height = total; const g = cv.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.font = '14px sans-serif';
    let y = 0;
    for (const p of panels) {
      const ph = Math.round(p.bh * s); g.fillStyle = '#222';
      g.fillText(`${p.y0}–${p.y0 + p.bh} px · ${p.pct.toFixed(1)} % változott`, 4, y + 15); g.fillStyle = '#888';
      g.fillText('régi', 4 + 0 * (pw + gap) + pw - 40, y + 15); g.fillText('új', 4 + (pw + gap) + pw - 30, y + 15); g.fillText('különbség', 4 + 2 * (pw + gap) + pw - 70, y + 15);
      [p.c1, p.c2, p.c3].forEach((c, k) => { g.drawImage(c, k * (pw + gap), y + head, pw, ph); g.strokeStyle = '#bbb'; g.strokeRect(k * (pw + gap) + 0.5, y + head + 0.5, pw - 1, ph - 1); });
      y += ph + head + gap;
    }
    out.png = cv.toDataURL('image/png');
  }
  return out;
};

/** browser: Playwright Browser. → {oldH,newH,heightChange,bands:[{y0,y1,pct}],changed:[...],diffImage} | {error} */
export async function diffImages(browser, oldPath, newPath, outPath, { band = 400, thr = 0.1, minPct = 2, maxPanels = 10 } = {}) {
  if (!existsSync(oldPath)) return { error: `a régi kép nincs meg: ${oldPath}` };
  if (!existsSync(newPath)) return { error: `az új kép nincs meg: ${newPath}` };
  const b64 = f => 'data:image/png;base64,' + readFileSync(f).toString('base64');
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  try {
    await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
    const r = await page.evaluate(inPage, { a: b64(oldPath), b: b64(newPath), band, thr, minPct, maxPanels });
    if (r.error) return { oldH: r.oldH, newH: r.newH, error: r.error };
    let diffImage = null;
    if (r.png) { writeFileSync(outPath, Buffer.from(r.png.split(',')[1], 'base64')); diffImage = outPath; }
    const changed = r.bands.filter(x => x.pct > minPct);
    return { oldH: r.oldH, newH: r.newH, width: r.oldW, heightChange: r.newH - r.oldH, overlapH: r.overlapH, bandCount: r.bands.length, bands: r.bands, changed, diffImage, avgChangedPct: +(r.bands.reduce((s, x) => s + x.pct, 0) / (r.bands.length || 1)).toFixed(2) };
  } catch (e) { return { error: String(e.message).slice(0, 160) }; }
  finally { await ctx.close(); }
}

export function visualMd(entries) {
  const any = entries.filter(e => e.visual && e.visual.length);
  if (!any.length) return [];
  const L = ['## Megváltozott szakaszok (képi összevetés az előző futással)', '', 'A teljes oldalas képek 400 px-es sávonként összevetve (YIQ-küszöb 0,1); 2 % feletti eltérésnél a sáv „megváltozott szakasz” (P3, tájékoztató, nem pontoz). Animáció, csúszka, dátum és véletlenszerű tartalom is okozhat eltérést: nézd meg a különbség-képet.', ''];
  for (const e of any) for (const v of e.visual) {
    L.push(`### ${e.url} · ${v.viewport}`, '');
    if (v.error) { L.push(`_Nem hasonlítható: ${v.error}_`, ''); continue; }
    L.push(`Magasság: ${v.oldH} → ${v.newH} px (${v.heightChange > 0 ? '+' : ''}${v.heightChange}) · összevetett átfedés: ${v.overlapH} px · megváltozott sáv: ${v.changed.length} / ${v.bandCount}`, '');
    if (v.changed.length) { L.push('| Súly | Szakasz (px) | Változott pixel | |', '|---|---|---|---|', ...v.changed.map(c => `| P3 | ${c.y0}–${c.y1} | ${c.pct} % | Megváltozott szakasz |`), '', `Egymás melletti kép (régi | új | különbség): ${v.diffImage}`, ''); }
    else L.push('_Nincs 2 %-nál nagyobb eltérésű szakasz._', '');
  }
  return L;
}
